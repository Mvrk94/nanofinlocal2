angular.module('myApp')
    .controller('resellerPerformanceController', function ($scope, $http, $log, userSessionService) {

        $scope.baseURL = "https://nanofinapifinal.azurewebsites.net";
        $scope.profitData = [];
        $scope.profitPerMonthJSON = {};

        if (userSessionService.isUserLoggedIn()) {
            $scope.resellerUserID = userSessionService.getUserID();
        }


        //new graphs
        var getProfitRev = function () {
            
            $http({
                method: 'GET',
                url: $scope.baseURL + '/api/Reports/getResellerProfitPerMonth?resellerID=' + $scope.resellerUserID
            })
           .then(function (response) {
               $scope.profitPerMonthJSON = response.data;
               $log.info(response);
               $scope.data = [];
               var counter = 0;
               $scope.aveProfit = 0;
               $scope.aveRev = 0;
               $scope.bestSellingMonth = "";
               $scope.bestSellingMonthAmount = 0;
               for (var i in $scope.profitPerMonthJSON) {
                   $scope.data.push({
                       "Period": $scope.profitPerMonthJSON[counter].transactionDate.substring(0, 10).toString(),
                       "Revenue": Math.round($scope.profitPerMonthJSON[counter].sold),
                       "Profit": Math.round(($scope.profitPerMonthJSON[counter].sold) / 10)
                   });
                   //get ave profit and revenue
                   $scope.aveRev += Math.round($scope.profitPerMonthJSON[counter].sold);
                   $scope.aveProfit += Math.round(($scope.profitPerMonthJSON[counter].sold) / 10);
                  
                   //max alg - get best selling month
                   if ($scope.bestSellingMonthAmount  < Math.round($scope.profitPerMonthJSON[counter].sold)) {
                       $scope.bestSellingMonth = $scope.profitPerMonthJSON[counter].transactionDate.substring(0, 7).toString();
                       $scope.bestSellingMonthAmount = Math.round($scope.profitPerMonthJSON[counter].sold);
                   }

                   counter++;
               }
               $scope.aveRev = Math.round($scope.aveRev / counter);
               $scope.aveProfit = Math.round($scope.aveProfit / counter);
               console.log("PREF REV DATA");
               console.log($scope.data);

               Morris.Bar({
                   element: 'profRevGraph',
                   data: $scope.data,
                   xkey: 'Period',
                   ykeys: ['Revenue', 'Profit'],
                   labels: ['Revenue', 'Profit'],
                   xLabelAngle: 60
               });


           }, function (reason) {
               $log.info(reason);
           });
           
        };

        getProfitRev();

        var getBoughtVsSoldpermonthPie = function () {
           
            $http({
                method: 'GET',
                url: $scope.baseURL + '/api/Reseller/getCurrentMonthSalesAndSoldVouchers?userID=' + $scope.resellerUserID
            })
           .then(function (response) {
               $scope.profitPerMonthJSON = response.data;
               $log.info(response);
               $scope.data = [];
               var counter = 0;
               for (var i in $scope.profitPerMonthJSON) {
                   if(counter===0){
                       $scope.data.push({
                           "value": $scope.profitPerMonthJSON[counter].TransactionAmount,
                           "label" : "Purchased"
                           });
                   } else {
                       $scope.data.push({
                           "value": $scope.profitPerMonthJSON[counter].TransactionAmount,
                           "label": "Sold"
                       });
                   }
                   
                   counter++;
               }
               console.log("PIE DATA");
               console.log($scope.data);

               Morris.Donut({
                   element: 'boughtVsSold',
                   data: $scope.data,
                   formatter: function (x) { return "R " + x;  }
               }).on('click', function (i, row) {
                   console.log(i, row);
               });


           }, function (reason) {
               $log.info(reason);
           });
        };

        getBoughtVsSoldpermonthPie();

        var numUnitsSoldPerMonth = function () {
            $http({
                method: 'GET',
                url: $scope.baseURL + '/api/Reseller/getNumUnitsSendPerMonth?userID=' + $scope.resellerUserID
            })
           .then(function (response) {
               $scope.profitPerMonthJSON = response.data;
               $log.info(response);
               $scope.data = [];
               var counter = 0;
               for (var i in $scope.profitPerMonthJSON) {
                   $scope.data.push({
                       "Period": $scope.profitPerMonthJSON[counter].monthDate,
                       "Units": $scope.profitPerMonthJSON[counter].numUnitsSold
                   });
                   counter++;
               }
               console.log("NUM UNITS SOLD DATA");
               console.log($scope.data);

               Morris.Line({
                   element: 'unitsSoldPerMonth',
                   data: $scope.data,
                   xkey: 'Period',
                   ykeys: ['Units'],
                   labels: ['Units sold']
               });


           }, function (reason) {
               $log.info(reason);
           });
        };

        numUnitsSoldPerMonth();


        var aveAmountSentPerMonth = function () {
            $http({
                method: 'GET',
                url: $scope.baseURL + '/api/Reseller/getAverageAmountSentPerMonth?userID=' + $scope.resellerUserID
            })
           .then(function (response) {
               $scope.profitPerMonthJSON = response.data;
               $log.info(response);
               $scope.data = [];
               var counter = 0;
               for (var i in $scope.profitPerMonthJSON) {
                   $scope.data.push({   
                       "period": $scope.profitPerMonthJSON[counter].monthDate,
                       "TransactionAmount": Math.round($scope.profitPerMonthJSON[counter].TransactionAmount)
                   });
                   counter++;
               }
               console.log("Ave voucher amount sold per month DATA");
               console.log($scope.data);

               Morris.Line({
                   element: 'aveAmountSentPerMonthGraph',
                   data: $scope.data,
                   xkey: 'period',
                   ykeys: ['TransactionAmount'],
                   labels: ['Transaction Amount']
               });


           }, function (reason) {
               $log.info(reason);
           });
        };

        aveAmountSentPerMonth();
        

});