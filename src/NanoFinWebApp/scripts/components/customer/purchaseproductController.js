angular.module('myApp')
    .controller('purchaseprodCtrl', function ($scope, $http, $routeParams, $log, $interval, $mdToast, $filter,notificationService, userSessionService)
    {

        if (userSessionService.isUserLoggedIn()) {
            $scope.consumerUserID = userSessionService.getUserID();
        }
        else
        {
            $scope.consumerUserID = 21;
        }
        console.log(userSessionService.isUserLoggedIn() +"CHECK LOGIN");
        //console.log("!!!!!!!!!!!!!!!!!!!1");
        $scope.Accepted = false;

        $scope.myDate = new Date();
        //$scope.minDate = new Date(
        //    $scope.myDate.getFullYear(),
        //    $scope.myDate.getMonth(),
        //    $scope.myDate.getDate());

        var pid = $routeParams.param1;
        $scope.productID = pid;
        $scope.currentVoucherBalance = 0;
       
        $scope.isLoading = false;
        $interval(function () {
            $scope.isLoading = false;
            if (!$scope.$$phase) {
                $scope.$digest();
            }
        }, 5000);

        $scope.docsreq = [];

        var getVoucherBalance = function ()
        {
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

        //$scope.currentVoucherBalance = getVoucherBalance;

        getVoucherBalance();
        $scope.newunitCost=0;
        $scope.getProductDetails = function () {
            $http({
                method: 'GET',
                url: 'https://nanofinapifinal.azurewebsites.net/api/ConsumerWalletHandler/getSpecificSingleProductDetails?ProductID=' + $scope.productID
            })
            .then(function (response) {
                $scope.productDetails = response.data;
                $scope.newunitCost=response.data.unitCost;

                $log.info(response);
            }, function (reason) {
                $log.info(reason);
            });
        };


        $scope.getProductDetails($scope.productID);


        $scope.calcuateTotalAmountSpent = function (unitCost,numUnits)
        {
            var total = 0;
            total = unitCost * numUnits;
            $scope.totalSpentNumber = total;
            $scope.totalAmount = $filter('currency')(total,"R",2);
            return total;

        };

        

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

        //add validation: not buy of more value than nanobucks they have.
        //Date cannot be earlier than today
        $scope.purchased = false;

        $scope.redeemProduct = function (numberUnits,toastParentID, totalAmount, prodName) {
            if(numberUnits===undefined)
            {
                showToast("Please enter the number of Units", toastParentID);
            }
            else
            {
                $scope.isLoading = true;
                $http({ 
                    method: 'POST',
                    url: 'https://nanofinapifinal.azurewebsites.net/api/ConsumerWalletHandler/redeemProduct?userID=' + $scope.consumerUserID + '&productID=' + $scope.productID + '&numberUnits=' + numberUnits + '&startdate=' + $scope.myDate.toISOString()
                })
                .then(function (response) {
                    showToast(prodName + " purchased, you will receive an SMS notification shortly", toastParentID);
                    notificationService.sendSms($scope.consumerUserID, "Hello from NanoFin! You just bought a "+prodName+" product of "+ totalAmount+" from us. Visit NanoFin.azurewebsites.net to find out more.");
                    $log.info(response);
                    //update the currentVoucherBalance:
                    //$scope.currentVoucherBalance =$scope.currentVoucherBalance - $scope.totalSpentNumber;
                    getVoucherBalance();
                    $scope.purchased = true;
                    $scope.Accepted = false;
                    $scope.mNumUnits = 0;

                }, function (reason) {
                    $scope.isLoading = false;
                    $log.info(reason);
                });

             
               

        }
        };
        $scope.maxNumUnits = 0;
        $scope.checkMax = function (numUnits, unitPrice, totalNanoBucks)
        {
            $scope.maxNumUnits = totalNanoBucks / unitPrice;


        };

        $scope.checkMax($scope.mNumUnits, $scope.newunitCost, $scope.currentVoucherBalance);

        //$scope.getDocsRequiredForInsuranceType = function () {
        //    $http({
        //        method: 'GET',
        //        url: 'https://nanofinapifinal.azurewebsites.net/api/ConsumerWalletHandler/getJSONDocsRequiredForInsuranceTypeofProduct?productID=' + $scope.productID
        //    })
        //      .then(function (response) {

        //          $log.info(response);
        //          $scope.docsreq= response.data;
        //          //return docsreq;
        //          //update the currentVoucherBalance:



        //      }, function (reason) {
        //          $scope.isLoading = false;
        //          $log.info(reason);
        //      });

        //};

        //$scope.getDocsRequiredForInsuranceType();
       

         
        $scope.viewModal = function ()
        {
            $("#redeemModal").modal();
        };


        $scope.AcceptConditions = function ()
        {
            $scope.Accepted = true;
            $("#redeemModal").modal('hide');
        };
});