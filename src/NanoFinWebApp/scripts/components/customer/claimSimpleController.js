angular.module('myApp')
    .directive('fileInput', ['$parse', function ($parse) {
       
        return {
            restrict: 'A',
            link: function (scope, element, attrs) {
                element.bind('change', function () {//on change event bind this element to the model
                    $parse(attrs.fileInput)
                    .assign(scope, element[0].files);
                    scope.$apply();
                });
            }


        };

    }])
    .controller('claimSimpleCtrl', function ($scope, $http, notificationService, userSessionService, $location, $mdDialog, $log, $routeParams, $window)
    {
        $scope.apiBaseUrl = 'https://nanofinapifinal.azurewebsites.net';

        if (userSessionService.isUserLoggedIn()) {
            $scope.consumerUserID = userSessionService.getUserID();
        }
        else {
            $scope.consumerUserID = 21;
        }
        console.log(userSessionService.isUserLoggedIn() + "CHECK LOGIN");

        var apid = $routeParams.param1;
        $scope.activeProd_ID = apid;
        var pid = $routeParams.param2;
        $scope.productID = pid;
       
        //date
        $scope.date = new Date();

        //for building claimUploadPath: InsManID/productName/year/month/userID/activeProductItemID
       //$scope.mIM_id = 0;
        $scope.productName = "";
        var currentTime = new Date();
        $scope.year = currentTime.getFullYear();
        $scope.month = currentTime.getMonth() + 1;
        $scope.IM_id = 0;

        //wizard data:
        var vm = this;
        vm.currentStep = 1;
        //get request
        vm.steps = [];
      

        //saving
        $scope.saving = false;
        $scope.pageLoading = true;

        var getCustomerID = function()
        {
            $http({
                method: 'GET',
                url: $scope.apiBaseUrl +'/api/Claim/getCustomerID?UserID=' + $scope.consumerUserID
            })
              .then(function (response) {                  
                  $scope.consumerID = response.data;
                  $log.info(response);
              }, function (reason) {
                  $log.info(reason);
              });          
        };
        getCustomerID();

        var getActiveProductDetails = function ()
        {
                $http({
                    method: 'GET',
                    url: 'https://nanofinapifinal.azurewebsites.net/api/ConsumerWalletHandler/GetConsumerSingleActiveProductItemWithDetail?activeProductitemsID=' + $scope.activeProd_ID
                })
                .then(function (response) {
                    $scope.pageLoading = false;
                    var varActProdDetails = response.data;
                    $scope.activeProductDetails = varActProdDetails;

                    var pIM_id = varActProdDetails.ProductProvider_ID;
                    $scope.IM_id = pIM_id;

                    var prodName = varActProdDetails.productName;
                    $scope.productName = prodName;

                    var policyNumber = varActProdDetails.activeProductItemPolicyNum;
                    $scope.policyNum = policyNumber;


                    $log.info(response);
                }, function (reason) {
                    $log.info(reason);
                });


        };

        getActiveProductDetails();

        var getProductClaimTemplate = function () {
            $http({
                method: 'GET',
                url: 'https://nanofinapifinal.azurewebsites.net/api/Claim/getClaimTemplateJustJson?productID='+$scope.productID
            })
            .then(function (response) {

                $scope.pageLoading = false;
                vm.steps = angular.fromJson(response.data);
                $log.info(response);

            }, function (reason) {
                $log.info(reason);
            });

        };

        getProductClaimTemplate();

        //Upload code: 

        $scope.uploading = false;

        var fd = new FormData();
        $scope.upload = function (files) {
            $scope.uploading = true;
            //var fd = new FormData();
            //angular.forEach($scope.files, function (file) {
            //    fd.append('file', file);
            //});
             
            console.log(files);

            if (files.length === 0) {
                alert("No files selected!");
                $scope.uploading = false;
                return;
            }


            //check file size of all files
            for (var i = 0; i < files.length;i++)
            {
                var fsize = files.item(i).size;//size of file
                console.log('file size:' + fsize);       

                if((fsize/1024)>= 2048)
                {
                    $scope.showMaxFileSizeAlert();
                    $scope.uploading = false;
                    return;
                }

                var fileExtension = $scope.getFileExt(files.item(i).name);

                if (fileExtension === 'exe') {
                    alert("Don't allow this file type!");
                    $scope.uploading = false;
                    return;
                }

            }

            angular.forEach(files, function (value, key) {
                fd.append(key, value);          
            });
            $http.post( $scope.apiBaseUrl+'/api/FileUpload/uploadToNewDirectory?strDirectory=claims/' + $scope.productName + "/" + $scope.activeProd_ID , fd,
                { 
                    transformRequest: angular.identity,
                    headers: {
                        'Content-Type': undefined
                    }
                }).success(function (d) {
                      $scope.uploading = false;
                    $scope.showAlert(files);
                    console.log(d);
                }).error(function () {
                    $scope.uploading = false;
                    alert("Failed!");
                });
            
        };

        $scope.showMaxFileSizeAlert = function () {
            $mdDialog.show(
             $mdDialog.alert()
               .parent(angular.element(document.querySelector('#popupContainer')))
               .clickOutsideToClose(true)
               .title('The size of one or more files is more than 2 MiB')
               .textContent( 'Please try to upload files of smaller sizes.')
               .ariaLabel('Alert Dialog Demo')
               .ok('OK')

           );
        };

        $scope.getFileExt = function (string) {
            var array = string.split('.');
            return array[1];
        };

        $scope.showAlert = function (files) {
            // Appending dialog to document.body to cover sidenav in docs app
            // Modal dialogs should fully cover application
            // to prevent interaction outside of dialog
            $mdDialog.show(
              $mdDialog.alert()
                .parent(angular.element(document.querySelector('#popupContainer')))
                .clickOutsideToClose(true)
                .title('File(s) Uploaded Successfully:')
                .textContent($scope.NamesList(files))
                .ariaLabel('Alert Dialog Demo')
                .ok('OK')
                
            );
        };

        //names list for alert after upload
        $scope.NamesList = function (files) {
            var namesStr = "";
            for (var i = 0; i < files.length; i++) {
                namesStr = namesStr + files[i].name + "  \r\n";

            }
            return namesStr;
        };

   
            //Functions
            vm.gotoStep = function (newStep) {
                vm.currentStep = newStep;
            };

            //the last step is for document uploads
            vm.getStepTemplate = function () {
                for (var i = 0; i < vm.steps.length; i++) {
                    if (vm.currentStep == vm.steps[i].step)
                    {
                        return vm.steps[i].fields;   
                    }
                }
            };

      
            $scope.showClaimAlert = function (claimID) {
                // Appending dialog to document.body to cover sidenav in docs app
                // Modal dialogs should fully cover application
                // to prevent interaction outside of dialog
                $mdDialog.show(
                  $mdDialog.alert()
                    .parent(angular.element(document.querySelector('#popupContainer')))
                    .clickOutsideToClose(true)
                    .title('Claim submitted Successfully!')
                    .textContent("Claim reference #: " + claimID + " for your " +$scope.productName + " product")
                    .ariaLabel('Alert Dialog Demo')
                    .ok('OK')
                ).then(function () {
                    //$window.location.href = '/wallet';
                    $location.url('/wallet');
                });
            };




        //This code gets executed when a claim gets submitted:

            $scope.showConfirm = function (steps) {
                // Appending dialog to document.body to cover sidenav in docs app
                var confirm = $mdDialog.confirm()
                      .title('Claim confirmation')
                      .textContent("Please confirm the submission of your claim by clicking 'Confirm' ")
                      .ariaLabel('Lucky day')
                      //.targetEvent(ev)
                      .ok('Confirm')
                      .cancel('Cancel');

                $mdDialog.show(confirm).then(function ()
                {
                    $scope.saving = true;
                    $http({
                        method: 'POST',
                        url: 'https://nanofinapifinal.azurewebsites.net/api/Claim/Postclaim',
                        data: { 'Consumer_ID': $scope.consumerID, 'ActiveProductItems_ID': $scope.activeProd_ID, 'capturedClaimFormDataJson': JSON.stringify(steps), 'claimDate': $scope.date ,'claimStatus': "In Progress",'claimPaymentFinalised': "false" }
                    }).then(function (response) {

                        //increment the consumer's numClaims
                        $http({
                            method: 'PUT',
                            url: 'https://nanofinapifinal.azurewebsites.net/api/Claim/incrementConsumerNumClaims?consumerID=' + $scope.consumerID
                        }).then(function (response) {
                          
                            $log.info(response);
                        }, function (reason) {

                            $log.info(reason);
                        });

                        //get the claim id
                        $http({
                            method: 'GET',
                            url: 'https://nanofinapifinal.azurewebsites.net/api/Claim/GetClaimID?activeProductID=' + $scope.activeProd_ID
                        }).then(function (response) {
                            var claimID = response.data;
                            $scope.sClaimID = claimID;

                            //flag item as not active anymore
                            $http({
                                method: 'PUT',
                                url: 'https://nanofinapifinal.azurewebsites.net/api/Claim/setIsActiveToFalse?activeProductID=' + $scope.activeProd_ID
                            }).then(function (response) {

                                // notificationService.sendSms($scope.consumerUserID, "Hello from NanoFin! You just recieved a NanoBucks voucher valued at R" + amount + ". Visit NanoFin.azurewebsites.net to find out more.");
                                $log.info(response);
                            }, function (reason) {

                                $log.info(reason);
                            });

                            //save upload path in db //postclaimuploaddocument         
                           
                            var uploadpath = "/UploadFiles/claims/"+ $scope.productName + "/" + $scope.activeProd_ID;
                            $scope.scUploadPath = uploadpath;
                            $http({
                                method: 'POST',
                                url: $scope.apiBaseUrl+'/api/Claim/Postclaimuploaddocument?userID=' + $scope.consumerUserID + '&activeProductItemsID=' + $scope.activeProd_ID + '&claimUploadDocPath=' + $scope.scUploadPath + '&claimID=' + $scope.sClaimID
                            }).then(function (response) {

                                notificationService.sendSms($scope.consumerUserID, "Hello from NanoFin! You just submitted a claim online for your " + $scope.productName + " product. Contact 0866275213 or visit nanofinlocal.azurewebsites.net for more info.");
                                $log.info(response);
                            }, function (reason) {

                                $log.info(reason);
                            }); 



                            $scope.showClaimAlert(claimID);
                            $log.info(response);
                        }, function (reason) {

                            $log.info(reason);
                        });


                        $scope.saving = false;
                        $log.info(response);
                    }, function (reason) {

                        $scope.saving = false;
                        $log.info("Postclaim not succeeded: "-reason);
                    });   
                   
                }, function () {
                    
                });
            };


        


            vm.save = function (steps) {
                
                //THIS IS WHERE CLAIM GETS SUBMITTED
                //show confirm.......then showAlert
                $scope.showConfirm(steps); //http calls inside showconfirm method
    
                
            };


            var getConsumerDetails = function ()
            {

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
            getConsumerDetails();
        

           
        

        });