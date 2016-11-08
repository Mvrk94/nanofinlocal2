angular.module('myApp')
    .controller('AdminCtrl', function ($scope, $http, $mdToast, $log, $interval, notificationService, userSessionService) {

        $scope.baseURL = "https://nanofinapifinal.azurewebsites.net";
        $scope.unvalidatedConsumers = {};

        $scope.productProvierInformation = {};

        var getProductProviderInformation = function () {
            $http({
                method: 'GET',
                url: $scope.baseURL + '/api/ProductProvider/getProductProviderAgregatePaymentInfo?productProviderID=51'
            })
            .then(function (response) {
                $scope.productProvierInformation = response.data;
                $log.info(response);
            }, function (reason) {
                $log.info(reason);
            });
        };

        var getTotalOwedToProductProvider = function () {
            $http({
                method: 'GET',
                url: $scope.baseURL + '/ProductProvider/getTotalOwedToPP?productProviderID=11'
            })
            .then(function (response) {
                $scope.productProvierInformation.totalCashedOwed = response.data;
                $log.info(response);
            }, function (reason) {
                $log.info(reason);
            });
        };

        getProductProviderInformation();
        getTotalOwedToProductProvider();

        var getUnvalidatedConsumers = function () {
            $http({
                method: 'GET',
                url: $scope.baseURL + '/api/Admin/getUnvalidatedConsumers'
            })
            .then(function (response) {
                $scope.unvalidatedConsumers = response.data;
                $log.info(response);
            }, function (reason) {
                $log.info(reason);
            });
        };
        
        $scope.acceptConsumer = function (userID) {
            $http({
                method: 'PUT',
                url: $scope.baseURL + '/api/Admin/acceptConsumer?userID=' + userID
            })
            .then(function (response) {
                getUnvalidatedConsumers();
                $log.info(response);
            }, function (reason) {
                $log.info(reason);
            });
        };



        $scope.rejectConsumer = function (userID) {
            $http({
                method: 'PUT',
                url: $scope.baseURL + '/api/Admin/rejectConsumer?userID=' + userID
            })
            .then(function (response) {
                getUnvalidatedConsumers();
                $log.info(response);
            }, function (reason) {
                $log.info(reason);
            });
        };

        getUnvalidatedConsumers();
        //end of controller
    });