/// <reference path="../../wwwroot/lib/angular/angular.min.js" />
/// <reference path="../../wwwroot/lib/angular/angular.js" />

angular.module('myApp').factory("notificationService", function ($http, $log, $q) {
    //singleton - factory only EXECUTES once. can be called as many times as needed
    //make calls by: notificationService.someFunc();
    
    var self = {};
    //public variables
    self.userPhoneNumber = 0; 
    self.userID = 0;

    //public functions
    self.setPhoneNumber = function (newNumber) {
        self.userPhoneNumber = newNumber;
    };

    self.setUserID = function (newUserID) {
        self.userID = newUserID;
    };

    self.getPhoneNumber = function (newNumber) {
        return self.userPhoneNumber;
    };

    self.getUserID = function () {
       return self.userID;
    };



    self.sendSms = function (userID, message) {
        var promisedPhoneNum = getPhoneNumFromUserID(userID);
        promisedPhoneNum.then(function (response) {
            self.userPhoneNumber = response.data;
            //console.log("Found user number from id: " + self.userPhoneNumber + " message " + message);

            // send sms 
            $http({
                method: 'POST',
                url: 'https://nanofinapifinal.azurewebsites.net/api/Notification/SendSMS?toPhoneNum=' + self.userPhoneNumber + '&message=' + message
            })
            .then(function (response) {
                console.log("sent sms to: " + self.userPhoneNumber + " with message: " + message);  
                $log.info(response);
            }, function (reason) {
                console.log("failed to send sms");
                $log.info(reason);
            });

        }, function () {
            console.log("Failed to get phone number from user ID");
        }); //promisedPhoneNum
    };

    //private functions
    function getPhoneNumFromUserID(userID) {
        var defer = $q.defer();
        $http({
            method: 'GET',
            url: 'https://nanofinapifinal.azurewebsites.net/api/Notification/getPhoneNumFromUserID?userID=' + userID
        })
        .then(function (response) {
            defer.resolve(response);
            $log.info(response);
        }, function (reason) {
            defer.reject(reason);
            $log.info(reason);
        });
        return defer.promise;
    }

    function getCorrectPhoneNumFormat(phoneNumber) {
        var defer = $q.defer();
        $http({
            method: 'GET',
            url: 'https://nanofinapifinal.azurewebsites.net/api/Notification/getCorrectPhoneNumFormat?phoneNum=' + phoneNumber
        })
        .then(function (response) {
            defer.resolve(response);
            $log.info(response);
        }, function (reason) {
            defer.reject(reason);
            $log.info(reason);
           
        });
        return defer.promise;
    }



    return self;
});

