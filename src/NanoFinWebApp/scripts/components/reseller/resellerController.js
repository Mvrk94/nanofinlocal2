/// <reference path="wwwroot/lib/angular/angular.min.js" />
/// <reference path="wwwroot/lib/angular/angular.js" />

angular.module('myApp')
    .controller('resellerCtrl', function ($scope, $http, $mdToast, $log, $interval, notificationService, userSessionService, $compile, $sce, $element, $mdDialog, $location,$window) {
        //, notifyjs
        if (userSessionService.isUserLoggedIn()) {
            $scope.resellerUserID = userSessionService.getUserID();
        }
        console.log(userSessionService.isUserLoggedIn() + "CHECK LOGIN");

        $scope.isLoading = false;
        $scope.currentVoucherBalance = 0;
        $scope.totalCashEarned = 0;
        $scope.purchasedVouchers_SortOrder = '';
        $scope.sentVouchers_SortOrder = '';
        $scope.ascending = true;
        $scope.userDetailsList = "";
        $scope.baseURL = "https://nanofinapifinal.azurewebsites.net";
        $scope.webApp = "https://nanofinlocal.azurewebsites.net";
        $scope.localHost = "http://localhost:59760";
       
       

        $interval(function () { 
            $scope.isLoading = false;
            if (!$scope.$$phase) {
                $scope.$digest();
            }
        }, 5000); 

        $scope.increment = function (num) {
            num = num + 1;
        };


        $scope.showAlertPurchase = function (amount) {
            // Appending dialog to document.body to cover sidenav in docs app
            // Modal dialogs should fully cover application
            // to prevent interaction outside of dialog
            $mdDialog.show(
              $mdDialog.alert()
                .parent(angular.element(document.querySelector('#popupContainer')))
                .clickOutsideToClose(true)
                .title('Payment Successful')
                .textContent('You purchased R ' + amount + ' Bulk Voucher')
                .ariaLabel('Alert Dialog Demo')
                .ok('OK')

            );
        };

        $scope.getPurchasedBulkVouchers = function () {
            $http({
                method: 'GET',
                url: $scope.baseURL + '/api/WalletHandler/getResellerPurchasedBulkVouchers?resellerUserID=' + $scope.resellerUserID
            })
            .then(function (response) {
                $scope.purchasedBulkVouchers = response.data;
                $log.info(response);
            }, function (reason) {
                $log.info(reason);
            });
        };

        var getCurrentVoucherBalance = function () {
            $http({
                method: 'GET',
                url: $scope.baseURL +  '/api/WalletHandler/getVoucherAccountBalance?userID=' + $scope.resellerUserID
            })
            .then(function (response) {
                $scope.currentVoucherBalance = response.data;
                $log.info(response);
                getTotalCashEarned($scope.resellerUserID);
            }, function (reason) {
                $log.info(reason);
            });
        };

        var getTotalCashEarned = function () {
            $http({
                method: 'GET',
                url: $scope.baseURL + '/api/WalletHandler/getResellerTotalCashEarned?resellerUserID=' + $scope.resellerUserID
            })
            .then(function (response) {
                $scope.totalCashEarned = response.data;
                $log.info(response);
            }, function (reason) {
                $log.info(reason);
            });
        };

      

        $scope.getSentBulkVouchersWithUserDetails = function () {
            $http({
                method: 'GET',
                url: $scope.baseURL + '/api/WalletHandler/getSentBulkVoucherUserDetails?resellerUserID=' + $scope.resellerUserID
            })
            .then(function (response) {
                $scope.sentBulkVouchers = response.data;
                var userIDList = "";
                $log.info(response);
            }, function (reason) {
                $log.info(reason);
            });
        };

        getCurrentVoucherBalance($scope.resellerUserID);
        $scope.getPurchasedBulkVouchers($scope.resellerUserID);
        $scope.getSentBulkVouchersWithUserDetails($scope.resellerUserID);


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

        //$scope.initializePayment(amount); //Payment gateway - prepare checkout
        //call initPayment. then on check redirect, call buy bulk

        $scope.buyBulk = function (amount) {
            //check reseller has enough in bank account
            if (amount === undefined) {
                //showToast("Please enter an amount", toastParentID);
                //$scope.resellerPurchaseVoucher.txtBuyBulkAmount.$error = true;
            } else {
                $http({
                    method: 'POST',
                    url: $scope.baseURL + '/api/WalletHandler/buyBulkVoucher?userID=' + $scope.resellerUserID + '&BulkVoucherAmount=' + amount
                })  
                .then(function (response) {
                    $scope.currentVoucherBalance = $scope.currentVoucherBalance + amount;
                    $scope.getPurchasedBulkVouchers($scope.resellerUserID);
                    getCurrentVoucherBalance();
                    //$scope.buyBulkForm.amount = "";
                   // $scope.resellerPurchaseVoucher.txtBuyBulkAmount.$error = false;
                    //$scope.initializePayment(amount); //Payment gateway - prepare checkout
                   // $scope.showAlertPurchase("You purchased R" + amount+".") //COMMENT IF PAYGATE IS UP;
                    $log.info(response);
                }, function (reason) {
                    $scope.isLoading = false;
                    $log.info(reason);
                });
                //showToast("You purchased a R" + amount + " voucher.",  'sendVoucher-ToastContainer');
            }
        };

        //PAYMENT STUFFS BRUH

        $scope.paymentCardVisible = false;

        $scope.payGateCheckOutHTML = "";
        $scope.payGateCheckOutID = "";
        $scope.isCheckOutPrepared = false;
        // called in buyBulk
        $scope.initializePayment = function (amount) {
            $http({
                method: 'GET',
                url: $scope.baseURL + '/api/PaymentGateway/InitRequest?amount=' + amount
            })
            .then(function (response) {

                $scope.payGateCheckOutID = response.data.id;//.substring(0, 32);
                console.log($scope.payGateCheckOutID);   
                $scope.paymentCardVisible = true;
                  

                var checkoutScript = document.createElement('script');
                checkoutScript.setAttribute('src', 'https://test.oppwa.com/v1/paymentWidgets.js?checkoutId=' + $scope.payGateCheckOutID);
                document.head.appendChild(checkoutScript);

                //$scope.baseURL = "https://nanofinapifinal.azurewebsites.net";
                //$scope.webApp = "https://nanofinlocal.azurewebsites.net";
                //$scope.localHost = "http://localhost:59760";
                //document.getElementById('formToAdd').innerHTML = '<form action="' + $scope.localHost + '/reseller" class="paymentWidgets">AMEX MASTER MASTERDEBIT MAESTRO VISA</form>';
                document.getElementById('formToAdd').innerHTML = '<form action="' + $scope.webApp + '/reseller" class="paymentWidgets">AMEX MASTER MASTERDEBIT MAESTRO VISA</form>'; 
               // document.getElementById('formToAdd').innerHTML = '<form action="/reseller" class="paymentWidgets">AMEX MASTER MASTERDEBIT MAESTRO VISA</form>';

                $log.info(response);  

                localStorage.setItem("PGID", $scope.payGateCheckOutID);
                localStorage.setItem("PGZAR", amount.toString());

            }, function (reason) {
                $log.info(reason);
            });
        };

        $scope.getStatus = function (status) {
            $http({
                method: 'GET',
                url: $scope.baseURL + '/api/PaymentGateway/getStatus/' + status
            })
            .then(function (response) {
                console.log("call to get status of PG");
                $log.info(response);
            }, function (reason) {
                $log.info(reason);
            });
        };

        //check if redirect is coming after payment
        if (localStorage.getItem("PGID") !== null) {
            if (localStorage.getItem("firstRedirect") === null) {
                localStorage.setItem("firstRedirect", "false");
                $location.url('/reseller');
                //$window.location.href = '/reseller';

            } else {
                console.log("after pay");
                $scope.buyBulk(localStorage.getItem("PGZAR"));
                $scope.getStatus(localStorage.getItem("PGID"));
                $scope.showAlertPurchase(localStorage.getItem("PGZAR"));
                localStorage.removeItem("firstRedirect");
                localStorage.removeItem("PGID");
                localStorage.removeItem("PGZAR");
            }

        } else {
            console.log("redirect not after pay");
        }
        //END PAYMENT

        //OTPS START Reseller send bulk voucher with otps: //COPIED PREVIOUS CODE AND EDITED, commented out below for reverting back

        $scope.isResend = false;
        //recipient details can be - email, cellphone number, username.
        $scope.sendBulkVoucher = function (amount, recipienDetails, toastParentID) {
            //$scope.$evalAsync($scope.isLoading = true);
            $scope.isLoading = true;
            //console.log($scope.isLoading);
            if (amount === undefined && recipienDetails === undefined) {
                showToast("Please enter amount and recipient details", toastParentID);
            } else if (amount === undefined) {
                showToast("Please enter amount", toastParentID);
            } else if (recipienDetails === undefined) {
                showToast("Please enter recipient details", toastParentID);
            } else {
                //var recipient = get first name    
                // check recipient details are correct
                //check reseller has amount to sell
                var recipientUserID;
                var hasSufficientFunds;
                var recipientFirstName;

                $http({
                    method: 'GET',
                    url: $scope.baseURL + '/api/WalletHandler/getUserDetailsToUserID?input=' + recipienDetails
                })
                .then(function (response) {
                    recipientUserID = response.data;
                    $log.info(response);

                    if (recipientUserID > 0) {

                        $http({
                            method: 'GET',
                            url: $scope.baseURL + '/api/WalletHandler/getHasSufficientAmount?userID=' + $scope.resellerUserID + '&amount=' + amount
                        })
                        .then(function (response) {
                            hasSufficientFunds = response.data;
                            $log.info(response);
                            if (hasSufficientFunds === true) {
                                //send OTP
                                $http({
                                    method: 'PUT',
                                    url: 'https://nanofinapifinal.azurewebsites.net/api/Notification/sendUserOTPAndSaveOTP?UserID=' + $scope.resellerUserID + '&isResend=' + $scope.isResend
                                }).then(function (response) {
                                    //alert(response.data);
                                    if (response.data == "OTP Sent sucessfully first time") {
                                        $scope.showOTPPrompt(amount, recipientUserID);
                                        $scope.isLoadingAdd = false;
                                        $scope.sendBulkForm.amount = "";
                                        $scope.sendBulkForm.recipientDetails = "";
                                        $scope.resellerSendVoucher.sendBulkAmount.$error = false;
                                        $scope.resellerSendVoucher.txtSendBulkTo_userDetails.$error = false;
                                        getTotalCashEarned();
                                    }
                                    if (response.data == "User is still blocked") {
                                        $scope.showAlert("You are still blocked", "You have exceeded 3 resend requests, try again later.");
                                        $scope.isLoadingAdd = false;
                                    }
                                    $log.info(response);
                                }, function (reason) {

                                    $log.info(reason);
                                });

                            }
                            else {
                                showToast("Insufficient voucher funds", toastParentID);
                            }
                        }, function (reason) {
                            $scope.isLoading = false;
                            $log.info(reason);

                        });

                    } else {
                        showToast("Recipient details are incorrect", toastParentID);
                    }

                }, function (reason) {
                    $scope.isLoading = false;
                    $log.info(reason);
                    showToast("Recipient details are incorrect", toastParentID);

                });

            }

        };

        $scope.showAlert = function (title, message) {
            $mdDialog.show(
              $mdDialog.alert()
                .parent(angular.element(document.querySelector('#popupContainer')))
                .clickOutsideToClose(true)
                .title(title)
                .textContent(message)
                .ariaLabel('Alert Dialog')
                .ok('OK')
            ).then(function () {
                $scope.beneficiaryFound = false;
            });
        };

        $scope.showOTPPrompt = function (amount, recipientUserID) {
            // Appending dialog to document.body to cover sidenav in docs app
            var confirm = $mdDialog.prompt()
              .title('An OTP code has been sent to you via SMS')
              .textContent('Enter the code below')
              .placeholder('OTP code')
              .ariaLabel('OTP code')
              .targetEvent()
              .ok('Submit')
              .cancel('Re-send Code');
            $mdDialog.show(confirm).then(function (result) { //they enter & OTP= Stored in result
                $scope.OTP = result;
                $http({
                    method: 'GET',
                    url: 'https://nanofinapifinal.azurewebsites.net/api/Notification/checkEnteredOTP?UserID=' + $scope.resellerUserID + '&enteredOTP=' + $scope.OTP
                })
                  .then(function (response) {
                      $scope.isValidMsg = response.data;
                      if ($scope.isValidMsg === 'OTP Expired') {
                          $scope.showAlert('OTP Expired', 'Please retry this send transaction');
                          //Alert expired..please retry adding your beneficiary
                      }
                      if ($scope.isValidMsg === 'OTP Valid') {

                          $http({
                              method: 'POST',
                              url: $scope.baseURL + '/api/WalletHandler/sendBulkVoucher?resellerUserID=' + $scope.resellerUserID + '&recipientID=' + recipientUserID + '&transferAmount=' + amount
                          })
                              .then(function (response) {
                                  $scope.currentVoucherBalance = $scope.currentVoucherBalance - amount;
                                  $scope.totalCashEarned = $scope.totalCashEarned + (amount * 0.1);
                                  //hello username ?
                                  //notificationService.sendSms(recipientUserID, "Hello from NanoFin! You just recieved a voucher valued at R" + amount + ". Visit NanoFinLocal.azurewebsites.net to find out more.");
                                  $http({
                                      method: 'GET',
                                      url: 'https://nanofinapifinal.azurewebsites.net/api/WalletHandler/getUserFirstName?userID=' + recipientUserID
                                  })
                                      .then(function (response) {
                                          recipientFirstName = response.data;
                                          notificationService.sendSms(recipientUserID, "Hello from NanoFin! You just recieved a voucher valued at R" + amount + ". Visit NanoFinLocal.azurewebsites.net to find out more.");
                                          $scope.showAlert('NanoBucks sent successfully to your customer!', "Sent " + recipientFirstName + " R " + amount + "!");
                                          $log.info(response);
                                      }, function (reason) {
                                          $scope.isLoading = false;
                                          $log.info(reason);
                                      });
                                  $log.info(response);
                              }, function (reason) {
                                  $scope.isLoading = false;
                                  $log.info(reason);
                              });
                      }
                      if ($scope.isValidMsg === 'OTP Invalid') {

                          $scope.showAlert('OTP Invalid', 'A new OTP will be sent via SMS shortly'); //automatically resends a new otp in api method
                          $scope.showOTPPrompt(amount, recipientUserID);
                          $scope.isLoadingAdd = false;
                          //show alert that a new OTP has been resent
                          //show another Prompt
                      }
                      if ($scope.isValidMsg === 'User Blocked') {
                          $scope.showAlert('Too many resend requests', 'You are temporarily blocked from performing this transaction');
                          $scope.isLoadingAdd = false;
                          //show alert that user has been blocked
                      }
                  },
                  function (reason) {
                      $log.info(reason);
                  });

            }, function () {
                $scope.OTP = 'Resend';
                $scope.isResend = true;

                //the code to send it is called with resend set to true
                $http({
                    method: 'PUT',
                    url: 'https://nanofinapifinal.azurewebsites.net/api/Notification/sendUserOTPAndSaveOTP?UserID=' + $scope.resellerUserID + '&isResend=' + $scope.isResend
                }).then(function (response) {
                    //alert(response.data);
                    if (response.data == "OTP Resent Successfully") {
                        $scope.showAlert("OTP Resent Successfully", "");
                        $scope.showOTPPrompt(amount, recipientUserID);
                        $scope.isLoadingAdd = false;
                    }
                    if (response.data == "User blocked, OTP not Resent") {
                        $scope.showAlert('Too many resend requests', 'You are temporarily blocked from performing this transaction');
                    }

                    $log.info(response);
                }, function (reason) {

                    $log.info(reason);
                });
            });
        };

        //OTPS END

        //getVoucherAccountBalance
        $scope.getActiveBulkVouchers = function () {
            $http({
                method: 'GET',
                url: $scope.baseURL + '/api/WalletHandler/getResellerActiveBulkVouchers?resellerUserID=' + $scope.resellerUserID
            })
            .then(function (response) {
                $scope.activeBulkVouchers = response.data;
                $log.info(response);
            }, function (reason) {
                $log.info(reason);
            });
        };

        var userDetailsToUserID = function (userDetails) {
            $http({
                method: 'GET',
                url: $scope.baseURL + '/api/WalletHandler/getResellerSentBulkVouchers?resellerUserID=' + $scope.resellerUserID
            })
            .then(function (response) {   
                $scope.userID = response.data;
                $log.info(response);
            }, function (reason) {
                $log.info(reason);
            });
        };  
        

        
    });
 
//$http({
//    method: 'POST',
//    url: $scope.baseURL +  '/api/WalletHandler/sendBulkVoucher?resellerUserID=' + resellerUserID + '&recipientID=' + recipientUserID + '&transferAmount=' + amount
//})
//.then(function (response) {
//    $log.info(response);
//}, function (reason) {
//    $scope.isLoading = false;
//    $log.info(reason);
//   
//});