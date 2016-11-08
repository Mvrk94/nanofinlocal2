/// <reference path="../../../wwwroot/views/components/customer/claim2.html" />
angular.module('myApp')
    .controller('profileCtrl', function ($scope, $http, $routeParams, $log, $interval, $mdToast, $filter, notificationService, userSessionService, $mdDialog,$location) {
        $scope.baseURL = 'https://nanofinapifinal.azurewebsites.net';

        if (userSessionService.isUserLoggedIn()) {
            $scope.consumerUserID = userSessionService.getUserID();
        }
        else {
            $scope.consumerUserID = 21;
        }

        console.log(userSessionService.isUserLoggedIn() + "CHECK LOGIN");

        $scope.userProfileInfo = [];
        $scope.isLoadingSave = false;

        var getConsumerProfile = function () {
           
            $http({
                method: 'GET',
                url: 'https://nanofinapifinal.azurewebsites.net/api/ConsumerWalletHandler/GetConsumerProfileInfo?userID=' + $scope.consumerUserID
            })
              .then(function (response) {
                  $scope.userProfileInfo = response.data;
                  $log.info(response);

              }, function (reason) {
                  $log.info(reason);
              });

        };

        getConsumerProfile();


        $scope.showAlert = function (ev) {
            // Appending dialog to document.body to cover sidenav in docs app
            // Modal dialogs should fully cover application
            // to prevent interaction outside of dialog
            $mdDialog.show(
              $mdDialog.alert()
                .parent(angular.element(document.querySelector('#popupContainer')))
                .clickOutsideToClose(true)
                .title('This is an alert title')
                .textContent('You can specify some description text in here.')
                .ariaLabel('Alert Dialog Demo')
                .ok('Got it!')
                .targetEvent(ev)
            );
        };
  
         
        $scope.$watch('updateProfForm.$valid', function () {

            if ($scope.updateProfForm.$valid === true) {
                $scope.isFormNotCompletedYet = false;
            }
            else {
                $scope.isFormNotCompletedYet = true;
            }
        });

        $scope.updateProfileModal = function ()
        {
            $("#myModal").modal();
        };


        $scope.laterClicked = function () {

            $scope.laterHasBeenSelected = true;

            $("#myModal").modal('hide');
            //$("#myModal").hide();
           
        };

        $scope.SaveAdditonalDetails = function () {
            $scope.isLoadingSave = true;

            $http({
                method: 'PUT',
                url: $scope.baseURL + "/api/ConsumerAdditionalProfileInfo/consumerUpdateJustBasicProfile?userID="+$scope.consumerUserID+"&userFirstName="+$scope.consumer.firstName+"&userLastName="+$scope.consumer.lastName+"&UserName="+$scope.consumer.userName+"&userEmail="+$scope.consumer.email+"&userContactNum="+$scope.consumer.contactNumber+"&consumerDateOfBirth="+$scope.consumer.dob+"&consumerAddress="+$scope.consumer.address+"&maritalStatus="+$scope.consumer.maritalStatus
            })
              .then(function (response) {
                  $log.info(response);
                  console.log(response);
                  $scope.isLoadingSave = false;
               
                 
                  $("#myModal").modal('hide');
                 // $("#alertModal").modal();
                  $scope.showAlertMod();
                  //alert('Thank You! Your additional details are captured Click OK to continue browsing the catalog');
                  getConsumerProfile();
              }, function (reason) {
                  $log.info(reason);
              });


        };

        $scope.showAlertMod = function ()
        {
            $("#alertModal").modal();
        };

        $scope.deactivateProfile = function ()
        {
            $scope.disabling = true;
            $http({
                method: 'PUT',
                url: $scope.baseURL + "/api/ConsumerAdditionalProfileInfo/consumerDeactivateProfile?userID=" + $scope.consumerUserID 
            })
            .then(function (response) {
                $log.info(response);
                console.log(response);
                $scope.disabling = false;

                $location.url('/login');
                           
            }, function (reason) {
                $log.info(reason);
            });

        };
    });