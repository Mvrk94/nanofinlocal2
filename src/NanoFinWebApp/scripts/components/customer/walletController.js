angular.module('myApp')
    .controller('walletCtrl', function ($scope, $http, $routeParams, $log, $interval, $mdToast, $filter, notificationService, userSessionService) {

        if (userSessionService.isUserLoggedIn()) {
            $scope.consumerUserID = userSessionService.getUserID();
        }
        else {
            $scope.consumerUserID = 21;
        }
        console.log(userSessionService.isUserLoggedIn() + "CHECK LOGIN");

        $scope.currentVoucherBalance = 0;
        $scope.activeProductItems = [];

        $scope.searchProduct = '';
        $scope.haspolicynum = false;

        $scope.isLoading = false;
        $interval(function () {
            $scope.isLoading = false;
            if (!$scope.$$phase) {
                $scope.$digest();
            }
        }, 5000);

        var showToast = function (message, parentId) {
            var parentElement = angular.element(document.getElementById(parentId));
            var toast = $mdToast.simple()
            .content(message)
            .action('OK')
            .highlightAction(true)
            .hideDelay(0)
            .position('bottom right')
            .parent(parentElement)
            .hideDelay(5000);
            $mdToast.show(toast);
        };

        var getVoucherBalance = function () {
            $http({
                method: 'GET',
                url: 'https://nanofinapifinal.azurewebsites.net/api/ConsumerWalletHandler/getConsumerVoucherTotal?userID=' + $scope.consumerUserID
            })
            .then(function (response) {
                $scope.currentVoucherBalance = response.data;
                $log.info(response);

            }, function (reason) {
                $log.info(reason);
            });

        };

        getVoucherBalance();

        var getActiveProductItems = function () {
            var specificProductDetails;


            $http({
                method: 'GET',
                url: 'https://nanofinapifinal.azurewebsites.net/api/ConsumerWalletHandler/GetConsumerActiveProductitemsWithDetail?userID=' + $scope.consumerUserID
            })
              .then(function (response) {
                  $scope.activeProductItems = response.data;
                  $log.info(response);

              }, function (reason) {
                  $log.info(reason);
              });

        };

        getActiveProductItems();

        $scope.determinePolicyNum = function (policyNum)
        {
            if (policyNum === null || policyNum === "") {
                $scope.policynum = "Policy Number Pending";
                $scope.noPolicyNumYet = true;
                return "Policy Number Pending";
               
            }
            else
            {
                $scope.noPolicyNumYet = false;
                $scope.policynum = policyNum;
                return policyNum;
            }
        };



    });