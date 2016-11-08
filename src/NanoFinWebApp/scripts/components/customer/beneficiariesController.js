angular.module('myApp')
    .controller('beneficiariesCtrl', function ($scope, $http, $routeParams, $log, $interval, $mdToast, $filter, notificationService, userSessionService, $mdDialog, $location,$window) {

        $scope.baseURL = 'https://nanofinapifinal.azurewebsites.net/api';

        //$scope.sortType = '';
        //$scope.sortReverse = false;
        $scope.searchBeneficiary = '';

        if (userSessionService.isUserLoggedIn()) {
            $scope.consumerUserID = userSessionService.getUserID();
        }
        else {
            $scope.consumerUserID = 21;
        }


        $scope.isLoadingUser = false;
        $scope.beneficiaryFound = false;
        $scope.isLoadingAdd = false;

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

        $scope.getUser = function (userNameOrEmail, contactNum, toastParentID)
        {
            $scope.isLoadingUser = true;

         
            if (userNameOrEmail === undefined && contactNum === undefined) {
                $scope.isLoadingUser = false;
                showToast("Please enter Username/Email and Mobile number", toastParentID);   
            } else if (userNameOrEmail === undefined) {
                $scope.isLoadingUser = false;
                showToast("Please enter Username/Email", toastParentID);
            } else if (contactNum === undefined) {
                $scope.isLoadingUser = false;
                showToast("Please enter Mobile number", toastParentID);
            } else {
                $http({
                    method: 'GET',
                    url: $scope.baseURL+'/ContactList/getUserFromContactNumberAndUserNameOrEmail?userNameOrEmail=' + userNameOrEmail + '&contactNum=' + contactNum
                })
                .then(function (response) {
                    $scope.isLoadingUser = false;
                    var varBeneficiary = response.data;
                    $scope.beneficiary = varBeneficiary;

                   if ($scope.beneficiary === null) {
                        $scope.beneficiaryFound = false;
                        showToast("User not found, please ensure the details are correct", toastParentID);
                    }
                    else
                    {
                        var vbeneficiaryUserID = varBeneficiary.User_ID;
                        $scope.beneficiaryUserID = vbeneficiaryUserID;
                       
                        var vbeneficiaryFirstName = varBeneficiary.userFirstName;
                        $scope.beneficiaryFirstName = vbeneficiaryFirstName;
                        var vbeneficiaryLastName = varBeneficiary.userLastName;
                        $scope.beneficiaryLastName = vbeneficiaryLastName;

                       //check if this found beneficiary is already a beneficiary
                        $http({
                            method: 'GET',
                            url: 'https://nanofinapifinal.azurewebsites.net/api/ContactList/contactAlreadyExists?UserID=' + $scope.consumerUserID + '&contactID=' + $scope.beneficiaryUserID
                        }).then(function (response) {
                               $scope.contactAlreadyExists = response.data;
                              

                               if ($scope.contactAlreadyExists === true) {
                                   
                                   $scope.beneficiaryFound = false;
                                   showToast("This user is already one of your beneficiaries", toastParentID);
                               }
                               else if ($scope.contactAlreadyExists === false) {
                                
                                   $scope.beneficiaryFound = true;
                               }


                               $log.info(response);
                           }, function (reason) {
                               $log.info(reason);
                           });                 
                    }

                    $log.info(response);

                }, function (reason) {
                    $scope.isLoadingUser = false;
                    $log.info(reason);
                });
            }
        };

        $scope.isResend = false;
        $scope.addBeneficiary = function ()
        {
            //first time
            $scope.isLoadingAdd = true;
           
            //OTP code
            $http({
                method: 'PUT',
                url: 'https://nanofinapifinal.azurewebsites.net/api/Notification/sendUserOTPAndSaveOTP?UserID='+$scope.consumerUserID+'&isResend='+ $scope.isResend
            }).then(function (response)
            {
                //alert(response.data);
                if (response.data == "OTP Sent sucessfully first time")
                {
                    $scope.showOTPPrompt();
                    $scope.isLoadingAdd = false;
                }
                if (response.data == "User is still blocked")
                {
                    $scope.showAlert("You are still blocked", "You have exceeded 3 resend requests, try again later.");
                    $scope.isLoadingAdd = false;
                }
             
                $log.info(response);
            }, function (reason) {

                $log.info(reason);
            });
   
        };

        $scope.showOTPPrompt = function (ev) {
            // Appending dialog to document.body to cover sidenav in docs app
            var confirm = $mdDialog.prompt()
              .title('An OTP code has been sent to you via SMS')
              .textContent('Enter the code below')
              .placeholder('OTP code')
              .ariaLabel('OTP code')
              .targetEvent(ev)
              .ok('Submit')
              .cancel('Re-send Code');

            $mdDialog.show(confirm).then(function (result) { //they enter OTP, Stored in result
                $scope.OTP = result;

                $http({
                    method: 'GET',
                    url: 'https://nanofinapifinal.azurewebsites.net/api/Notification/checkEnteredOTP?UserID=' + $scope.consumerUserID + '&enteredOTP=' + $scope.OTP
                })
                  .then(function (response) {
                      $scope.isValidMsg = response.data;
                      if ($scope.isValidMsg === 'OTP Expired')
                      {
                   
                          $scope.showAlert('OTP Expired', 'Please retry adding '+$scope.beneficiaryFirstName + ' ' + $scope.beneficiaryLastName + ' to your beneficiaries');
                          //Alert expired..please retry adding your beneficiary

                      }
                      if ($scope.isValidMsg === 'OTP Valid')
                      {                        
                          //postContact
                            $http({
                                method: 'POST',
                                url: 'https://nanofinapifinal.azurewebsites.net/api/ContactList/PostContact',
                                data: { 'UserID': $scope.consumerUserID, 'ContactsUserID': $scope.beneficiaryUserID }
                            }).then(function (response) {
                                $scope.isLoadingAdd = false;
                                getUserContactList();
                                $scope.showAlert('Beneficiary Added Successfully', $scope.beneficiaryFirstName + ' ' + $scope.beneficiaryLastName + ' has been added to your beneficiaries');
                                $location.url('/viewbeneficiaries');
                            }, function (reason) {
                                $log.info(reason);
                                $scope.isLoadingAdd = false;
                            });
                           
                          //Alert user Added...redirect to userpage
                          //$location.url('/viewbeneficiaries');
                           // $window.location.href = '/viewbeneficiaries';

                      }
                      if ($scope.isValidMsg === 'OTP Invalid') {
                         
                          $scope.showAlert('OTP Invalid', 'A new OTP will be sent via SMS shortly'); //automatically resends a new otp in api method
                          $scope.showOTPPrompt();
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
                
            }, function ()
            {
                $scope.OTP = 'Resend';
                $scope.isResend = true;
                
                //the code to send it is called with resend set to true
                $http({
                    method: 'PUT',
                    url: 'https://nanofinapifinal.azurewebsites.net/api/Notification/sendUserOTPAndSaveOTP?UserID=' + $scope.consumerUserID + '&isResend=' + $scope.isResend
                }).then(function (response)
                {
                    //alert(response.data);
                    if (response.data == "OTP Resent Successfully")
                    {
                        scope.showAlert("OTP Resent Successfully", "");
                        $scope.showOTPPrompt();
                        $scope.isLoadingAdd = false;
                    }
                    if (response.data == "User blocked, OTP not Resent")
                    {
                        $scope.showAlert('Too many resend requests', 'You are temporarily blocked from performing this transaction');
                    }
                 
                    $log.info(response);
                }, function (reason) {

                    $log.info(reason);
                });
            });
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


        var getUserContactList = function () {
            $http({
                method: 'GET',
                url: $scope.baseURL+'/ContactList/getUsersContactListWithDetails?UserID='+$scope.consumerUserID
            }).then(function (response) {
                $scope.contacts = response.data;



            }, function (reason) {
                $log.info(reason);
            });
        };
    
        getUserContactList();

        $scope.remove = function (userID)
        {

            $http({
                method: 'DELETE',
                url: $scope.baseURL + '/ContactList/deleteContact?UserID=' + $scope.consumerUserID + '&ContactUserID=' + userID
            }).then(function (response) {

                $scope.showAlert("Beneficiary Removed", "The selected User will no longer be a beneficiary");

                getUserContactList();

                $log.info(response);
            }, function (reason) {
                $log.info(reason);
            });

        };
});