angular.module('myApp')
    .controller('claimHistoryCtrl', function ($scope, $http, $routeParams, $log, $interval, $mdToast, $filter, notificationService, userSessionService) {

        $scope.baseURL = 'https://nanofinapifinal.azurewebsites.net';
        if (userSessionService.isUserLoggedIn()) {
            $scope.consumerUserID = userSessionService.getUserID();
        }
        else {
            $scope.consumerUserID = 21;
        }
        console.log(userSessionService.isUserLoggedIn() + "CHECK LOGIN");

        $scope.claimsInProgressHistory = [];

        $scope.searchInProgressClaim = '';
        $scope.sortType = 'transactionDate';
        $scope.searchFinalisedClaim = '';

        $scope.pageLoading = false;
        $scope.pageFinalizedLoading = false;
        $scope.getClaimsInProgressHistory = function () {
            $scope.pageLoading = true;
            $http({
                method: 'GET',
                url: $scope.baseURL + "/api/Claim/getClaimsInProgress?userID=" + $scope.consumerUserID
            })
              .then(function (response) {
                  $scope.pageLoading = false;
                  $log.info(response);
                  var vClaimsInProg = response.data;
                  $scope.claimsInProgressHistory = vClaimsInProg;     

              }, function (reason) {
                  $scope.pageLoading = false;
                  $log.info(reason);
              });

        };

        $scope.getClaimsInProgressHistory();

        $scope.getClaimsFinalizedHistory = function ()
        {
            $scope.pageFinalizedLoading = true;
            $http({
                method: 'GET',
                url: $scope.baseURL + "/api/Claim/getClaimsThatHaveBeenSettled?userID=" + $scope.consumerUserID
            })
             .then(function (response) {
                 $scope.pageFinalizedLoading = false;
                 $log.info(response);
                 var vClaimsFinalized = response.data;
                 $scope.claimsFinalized = vClaimsFinalized;

             }, function (reason) {
                 $scope.pageFinalizedLoading = false;
                 $log.info(reason);
             });

        };
        $scope.getClaimsFinalizedHistory();

       // /api/ConsumerWalletHandler/GetConsumerSingleActiveProductItemWithDetail?activeProductitemsID=9801
    });