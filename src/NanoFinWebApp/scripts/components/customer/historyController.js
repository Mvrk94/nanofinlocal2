angular.module('myApp')
    .controller('historyCtrl', function ($scope, $http, $routeParams, $log, $interval, $mdToast, $filter, notificationService, userSessionService) {

        if (userSessionService.isUserLoggedIn()) {
            $scope.consumerUserID = userSessionService.getUserID();
        }
        else {
            $scope.consumerUserID = 21;
        }

        console.log(userSessionService.isUserLoggedIn() + "CHECK LOGIN");

        $scope.transactionHistory = [];

        $scope.searchTransaction = '';
        $scope.sortType='transactionDate';


        var getTransactionHistory = function () {
           
            $http({
                method: 'GET',
                url: 'https://nanofinapifinal.azurewebsites.net/api/ConsumerWalletHandler/getAllHistories?userID=' + $scope.consumerUserID
            })
              .then(function (response) {
                  $scope.transactionHistory = response.data;
                  $log.info(response);

              }, function (reason) {
                  $log.info(reason);
              });

        };

        getTransactionHistory();

    });