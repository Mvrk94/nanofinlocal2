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
    .controller('consumerSignUpCtrl', function ($scope, $http, $mdToast, $log, $timeout, $location, $mdDialog) {
        
        
        $scope.baseURL = $scope.baseURL = "https://nanofinapifinal.azurewebsites.net";
        $scope.currentStep = 0;
        $scope.numSteps = 4;
        $scope.showToolTip = false;
        $scope.isFormComplete = false;
        $scope.showPagination = true;
        $scope.showComplete = false;
        $scope.showIncompleteBack = false;

        $scope.show1 = true;
        $scope.show2 = false;
        $scope.show3 = false;
        $scope.show4 = false;

        $scope.setForm = function (form) {
            $scope.form = form;
        };
        


        $scope.showCurrentDiv = function (divNumber) {
            $scope.show1 = false;
            $scope.show2 = false;
            $scope.show3 = false;
            $scope.show4 = false;

            if (divNumber === 1) {
                $scope.show1 = true;
            } else if (divNumber === 2) {
                $scope.show2 = true;
            } else if (divNumber === 3) {
                $scope.show3 = true;
            } else if (divNumber === 4) {
                $scope.show4 = true;
            }
            
        };

        $scope.completeSignup = function () {
            //on complete - dont show div
            $scope.show3 = false;
            postUser();
            //$timeout(redirectConsumer, 1550);
        };

        function redirectConsumer() {
            // alert("redirect consumer home/catalog");
            //console.log("redirect to login");
            //$location.path('/login');
        }
        
        var postUser = function () {
            $http({
                method: 'POST',
                url: $scope.baseURL + '/api/signup/postConsumer?fName=' + $scope.consumer.firstName + '&lName=' + $scope.consumer.lastName + '&userName=' + $scope.consumer.username + '&email=' + $scope.consumer.email + '&contactNum=' + $scope.consumer.phoneNumber + '&userPass=' + $scope.consumer.retypePassword + '&IDnumber=' + $scope.consumer.ID + '&DOB=' + $scope.consumer.DOB + '&gender=' + $scope.consumer.gender + '&maritalStatus=' + $scope.consumer.maritalStatus + '&employmentStatus=' + $scope.consumer.employmentStatus
            })
            .then(function (response) {
                $log.info(response);
                console.log("redirect to login");
                $location.path('/login');
            }, function (reason) {
                $log.info(reason);
                console.log("the error");
                console.log(reason.data.Message);
                //error messages - exact text.
                //email taken
                //Username taken
                $scope.currentStep = 0;
                $scope.showCurrentDiv(1);
                $scope.showPagination = true;
                $scope.showComplete = false;
                $scope.showIncompleteBack = false;
                if (reason.data.Message === "email taken") {
                    alert("Email has already been taken. Please choose another email");
                } else if (reason.data.Message === "Username taken") {
                    alert("Username has already been taken. Please choose another user name.");
                }
            });
        };

        $scope.incrementStep = function (form) {
            $scope.currentStep = $scope.currentStep + 1;
            if ($scope.currentStep >= $scope.numSteps - 1) {
                if (form.$valid === false) {
                    $scope.showIncompleteBack = true;  
                } else if (form.$valid === true) {
                    $scope.showComplete = true;
                }
                $scope.showPagination = false;
            }
            $scope.showCurrentDiv($scope.currentStep + 1);
        };

        $scope.decrementStep = function () {
            $scope.currentStep = $scope.currentStep - 1;
            if ($scope.currentStep > 0) {
                $scope.showPagination = true;
                $scope.showComplete = false;
                $scope.showIncompleteBack = false;
            }
            $scope.showCurrentDiv($scope.currentStep + 1);
        };

        var count = 0;
        $scope.$watch('consumerSignUp.$valid', function () {
            if ($scope.consumerSignUp.$valid === true) {
                if (count === 0) {
                    count++;
                } else {
                    if ($scope.currentStep >= $scope.numSteps - 1) {
                        $scope.showIncompleteBack = false;
                        $scope.showPagination = false;
                        $scope.showComplete = true;
                    }

                }
            } else if ($scope.consumerSignUp.$valid === false) {
                if ($scope.currentStep >= $scope.numSteps - 1) {
                    $scope.showIncompleteBack = true;
                    $scope.showPagination = false;
                    $scope.showComplete = false;
                } else {
                    $scope.showIncompleteBack = false;
                    $scope.showPagination = true;
                    $scope.showComplete = false;  
                }
            }

        });

       
        //file upload stuff

        $scope.uploading = false;
        var fd = new FormData();
        $scope.upload = function (files) {
            console.log("uploading");
            $scope.uploading = true;
            //var fd = new FormData();
            //angular.forEach($scope.files, function (file) {
            //    fd.append('file', file);
            //});

            console.log(files);


            //check file size of all files
            for (var i = 0; i < files.length; i++) {
                var fsize = files.item(i).size;//size of file
                console.log('file size:' + fsize);


                if ((fsize / 1024) >= 2048) {
                    $scope.showMaxFileSizeAlert();
                    $scope.uploading = false;
                    return;

                }

            }


            angular.forEach(files, function (value, key) {
                fd.append(key, value);

            });

            $http.post($scope.baseURL + '/api/FileUpload/uploadToNewDirectory?strDirectory=userDocs/consumer/ID/' + $scope.consumer.email, fd,
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
               .textContent('Please try to upload files of smaller sizes.')
               .ariaLabel('Alert Dialog Demo')
               .ok('OK')

           );
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



    });