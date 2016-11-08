angular.module('myApp')
    .controller('sendvoucherCtrl', function ($scope, $http, $routeParams, $log, $interval, $mdToast, $filter, notificationService, userSessionService, $timeout, $q, $mdDialog)
    {
        $scope.baseURL = 'https://nanofinapifinal.azurewebsites.net/api';
        $scope.user = null;
        $scope.users = null;

        if (userSessionService.isUserLoggedIn()) {
            $scope.consumerUserID = userSessionService.getUserID();
        }
        else {
            $scope.consumerUserID = 21;
        }
        console.log(userSessionService.isUserLoggedIn() + "CHECK LOGIN");

        $scope.currentVoucherBalance = 0;



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

        //$scope.sendVoucher = function (amount, recipientDetails, toastParentID)
        //{   if (amount === undefined && recipientDetails === undefined) {
        //        showToast("Please enter amount and recipient details", toastParentID);
        //    } else if (amount === undefined) {
        //        showToast("Please enter amount", toastParentID);
        //    } else if (recipientDetails === undefined) {
        //        showToast("Please enter recipient details", toastParentID);
        //    } else {
        //        var recipientUserID;
        //        var hasSufficientFunds;
        //        var recipientFirstName;
        //        $http({
        //            method: 'GET',
        //            url: 'https://nanofinapifinal.azurewebsites.net/api/WalletHandler/getUserDetailsToUserID?input=' + recipientDetails
        //        }).then(function (response) {
        //            recipientUserID = response.data;
        //            $log.info(response);
        //            if (recipientUserID > 0)
        //            {
        //                $http({
        //                    method: 'GET',
        //                    url: 'https://nanofinapifinal.azurewebsites.net/api/WalletHandler/getHasSufficientAmount?userID=' + $scope.consumerUserID + '&amount=' + amount
        //                }).then(function (response)
        //                {
        //                    hasSufficientFunds = response.data;
        //                    $log.info(response);
        //                    if (hasSufficientFunds === true) {
        //                        $http({
        //                            method: 'POST',
        //                            url: 'https://nanofinapifinal.azurewebsites.net/api/WalletHandler/consumerSendVoucher?consumerUserID=' + $scope.consumerUserID + '&recipientID=' + recipientUserID + '&transferAmount=' + amount
        //                        }).then(function (response) {
        //                            //update voucherBalance
        //                            $scope.currentVoucherBalance = $scope.currentVoucherBalance - amount;
        //                            notificationService.sendSms(recipientUserID, "Hello from NanoFin! You just recieved a NanoBucks voucher valued at R" + amount + ". Visit NanoFin.azurewebsites.net to find out more.");
        //                            $log.info(response);
        //                        }, function (reason) {
        //                            $scope.isLoading = false;
        //                            $log.info(reason);
        //                        });

        //                        $http({
        //                            method: 'GET',
        //                            url: 'https://nanofinapifinal.azurewebsites.net/api/WalletHandler/getUserFirstName?userID=' + recipientUserID
        //                        })
        //                        .then(function (response) {
        //                            recipientFirstName = response.data;
        //                            showToast("Sent " + recipientFirstName + " R" + amount, toastParentID);
        //                            $log.info(response);
        //                        }, function (reason) {
        //                            $scope.isLoading = false;
        //                            $log.info(reason);
        //                         });
        //                    }
        //                    else
        //                    {
        //                        showToast("Insufficient voucher funds", toastParentID);

        //                    }

        //                }, function (reason) {
        //                    $scope.isLoading = false;
        //                    $log.info(reason);
        //                });
        //            }
        //            else {
        //                showToast("Recipient details are incorrect", toastParentID);
        //            }
        //             }, function (reason) {
        //                 $scope.isLoading = false;
        //                 $log.info(reason);
        //        });

        //    }
        //};//send voucher function


        var getUserContactList = function () {
            $http({
                method: 'GET',
                url: $scope.baseURL + '/ContactList/getUsersContactListWithDetails?UserID=' + $scope.consumerUserID
            }).then(function (response) {
               $scope.contacts = response.data;
                $log.info(response);

            }, function (reason) {
                $log.info(reason);
            });
        };

        getUserContactList();

        $scope.isResend = false;
        $scope.sendVoucher = function (amount, recipientID, toastParentID) {
            //check the entered Details
            if (amount === undefined && recipientID === undefined) {
                showToast("Please enter amount and select a recipient", toastParentID);
            } else if (amount === undefined) {
                showToast("Please enter amount", toastParentID);
            } else if (recipientID === undefined) {
                showToast("Please select a recipient", toastParentID);
            }
            else {
                $scope.isLoading = true;
                //first check if they have a sufficient amount
                $http({
                    method: 'GET',
                    url: 'https://nanofinapifinal.azurewebsites.net/api/WalletHandler/getHasSufficientAmount?userID=' + $scope.consumerUserID + '&amount=' + amount
                }).then(function (response) {
                    hasSufficientFunds = response.data;
                    $log.info(response);
                    if (hasSufficientFunds === true) //if have sufficient funds, then only send an OTP
                    {
                        //send OTP
                        //OTP code
                        $http({
                            method: 'PUT',
                            url: 'https://nanofinapifinal.azurewebsites.net/api/Notification/sendUserOTPAndSaveOTP?UserID=' + $scope.consumerUserID + '&isResend=' + $scope.isResend
                        }).then(function (response) {
                            //alert(response.data);
                            if (response.data == "OTP Sent sucessfully first time") {
                                $scope.showOTPPrompt(amount, recipientID);
                                $scope.isLoadingAdd = false;
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
                        $scope.showAlert('Insufficient voucher funds', 'You need more NanoBucks to perform this transaction');

                    }
                }, function (reason) {
                    $scope.isLoading = false;
                    $log.info(reason);
                });
            }
        };

        $scope.showOTPPrompt = function (amount, recipientUserID)
        {
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
                    url: 'https://nanofinapifinal.azurewebsites.net/api/Notification/checkEnteredOTP?UserID=' + $scope.consumerUserID + '&enteredOTP=' + $scope.OTP
                })
                  .then(function (response) {
                      $scope.isValidMsg = response.data;
                      if ($scope.isValidMsg === 'OTP Expired') {

                          $scope.showAlert('OTP Expired', 'Please retry this send transaction');
                          //Alert expired..please retry adding your beneficiary

                      }
                      if ($scope.isValidMsg === 'OTP Valid') {
                          //SEND VOUCHER
                       
                        $http({
                            method: 'POST',
                            url: 'https://nanofinapifinal.azurewebsites.net/api/WalletHandler/consumerSendVoucher?consumerUserID=' + $scope.consumerUserID + '&recipientID=' + recipientUserID + '&transferAmount=' + amount
                        }).then(function (response) {
                            //update voucherBalance
                            $scope.currentVoucherBalance = $scope.currentVoucherBalance - amount;
                            notificationService.sendSms(recipientUserID, "Hello from NanoFin! You just received a NanoBucks voucher valued at R" + amount + ". Visit NanoFin.azurewebsites.net to find out more.");
                            getVoucherBalance();
                            $scope.sendForm.amount = '';

                                    $http({
                                        method: 'GET',
                                        url: 'https://nanofinapifinal.azurewebsites.net/api/WalletHandler/getUserFirstName?userID=' + recipientUserID
                                    })
                                    .then(function (response) {
                                    recipientFirstName = response.data;
                                    $scope.showAlert('NanoBucks sent successfully to your beneficiary!', "Sent " + recipientFirstName + " R" + amount + "!");
                                           
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
                            
                //SEND VOUCHER

                       
                          //Alert user Added...redirect to userpage
                      }
                      if ($scope.isValidMsg === 'OTP Invalid') {

                          $scope.showAlert('OTP Invalid', 'A new OTP will be sent via SMS shortly'); //automatically resends a new otp in api method
                          $scope.showOTPPrompt(amount,recipientUserID);
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
                    url: 'https://nanofinapifinal.azurewebsites.net/api/Notification/sendUserOTPAndSaveOTP?UserID=' + $scope.consumerUserID + '&isResend=' + $scope.isResend
                }).then(function (response) {
                    //alert(response.data);
                    if (response.data == "OTP Resent Successfully") {
                        scope.showAlert("OTP Resent Successfully", "");
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


        //Parameters:Amount, RecipientID, toastParent
        //send OTP
        //"add beneficiary code"
        //showPrompt external method
        //if entered OTP is valid: sending of voucher (post will take place)
        //other cases: block from performing transactions.


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


        function getFullName(item, index) {
            var fullname = [item.userFirstname, item.userLastname].join(" ");
            return fullname;
            
        }

        //trial of md-autocompletecode:
        var self = this;
        //self.simulateQuery = false;
        self.isDisabled = false;
        // list of states to be displayed
       
        self.querySearch = querySearch;
        self.selectedItemChange = selectedItemChange;
        self.searchTextChange = searchTextChange;
   
       
        function querySearch(query) {
            var results = query ? self.states.filter(createFilterFor(query)) : self.states, deferred;
            if (self.simulateQuery) {
                deferred = $q.defer();
                $timeout(function () {
                    deferred.resolve(results);
                },
                   Math.random() * 1000, false);
                return deferred.promise;
            } else {
                return results;
            }
        }
        function searchTextChange(text) {
            $log.info('Text changed to ' + text);
        }
        function selectedItemChange(item) {
            $log.info('Item changed to ' + JSON.stringify(item));
        }
     
        //filter function for search query
        function createFilterFor(query) {
            var lowercaseQuery = angular.lowercase(query);
            return function filterFn(state) {
                return (state.value.indexOf(lowercaseQuery) === 0);
            };
        }
        //trial of md-autocompletecode:

    });