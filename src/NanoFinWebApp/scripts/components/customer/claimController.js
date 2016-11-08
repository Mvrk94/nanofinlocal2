//CAN DELETE?
angular.module('myApp')
    .directive('ngFiles', ['$parse', function ($parse) {

        function fn_link(scope, element, attrs) {
            var onChange = $parse(attrs.ngFiles);
            element.on('change', function (event) {
                onChange(scope, { $files: event.target.files });
            });
        }

        return {
            link: fn_link
        };
    }])

    .controller('claimCtrl', function ($scope, $http, $routeParams, $log, $interval, $mdToast, $filter,notificationService, userSessionService)
    {
        if (userSessionService.isUserLoggedIn()) {
            $scope.consumerUserID = userSessionService.getUserID();
        }
        else {
            $scope.consumerUserID = 21;
        }
        console.log(userSessionService.isUserLoggedIn() + "CHECK LOGIN");

        var pid = $routeParams.param1;
        $scope.productID = pid;

        $scope.claimFormData = {}; //object to store form data
       
      

        $scope.getProductDetails = function () {
            $http({
                method: 'GET',
                url: 'http://nanofinapifinal.azurewebsites.net/api/ConsumerWalletHandler/getSpecificSingleProductDetails?ProductID=' + $scope.productID
            })
            .then(function (response) {
                $scope.productDetails = response.data;
                $log.info(response);
            }, function (reason) {
                $log.info(reason);
            });
        };

        $scope.getProductDetails($scope.productID);

        $scope.getProductClaimTemplate = function () {
            $http({
                method: 'GET',
                url: 'http://nanofinapifinal.azurewebsites.net/api/Claim/getClaimTemplateJustJson?productID=' + $scope.productID
            })
            .then(function (response) {
                $scope.productClaimTemplate = JSON.parse(response.data);
                $log.info(response);
            }, function (reason) {
                $log.info(reason);

            });

        };

        $scope.getProductClaimTemplate($scope.productID);


         
        var formdata = new FormData();
       
        $scope.getTheFiles = function ($files) {
            $scope.imagesrc = [];

            for (var i = 0; i < $files.length; i++) {
                var reader = new FileReader();
                reader.fileName = $files[i].name;

                //reader.onload = function (event) {
                //    var image = {};
                //    image.Name = event.target.fileName;
                //    image.Size = (event.total / 1024).toFixed(2);
                //    image.Src = event.target.result;
                //    $scope.imagesrc.push(image);
                //    $scope.$apply();
                //};
                reader.readAsDataURL($files[i]);

            }


            console.log($files);

            angular.forEach($files, function (value, key) {
                formdata.append(key, value);
            });
        };

        $scope.uploadFiles = function () {

            var request = {
                method: 'POST',
                url: 'http://localhost:14198/api/FileUpload/UpLoadFiles',
                data: formdata,
                headers: {
                    'Content-Type': undefined
                }
            };

            // SEND THE FILES.
            $http(request)
                .success(function (d) {
                    alert("File Uploaded!!!!!");
                    alert(d);
                    $scope.reset();
                })
                .error(function () {
                    alert("Failed!");
                    $scope.reset();
                });
        };


        //reset variables etc
        $scope.reset = function () {
            angular.forEach(
                angular.element("input [type = 'file']"),
                function (inputElem) {
                    angular.element(inputElem).val(null);
                });
            $scope.imagesrc = [];
            formdata = new FormData();
        };

        $scope.getthefile = function () {
            $http({
                method: 'GET',
                cache: false,
                url: 'http://localhost:10812/api/FileUpload/getfile',
                headers: {
                    'Content-Type': 'application/json; charset=utf-8'
                }
            }).success(function (data, status) {
                console.log(data);
                window.open(data, '_blank', '');
                // Displays text data if the file is a text file, binary if it's an image            
                // What should I write here to download the file I receive from the WebAPI method?
            }).error(function (data, status) {
                // ...
            });
        };

        $scope.submitClaim = function () {

            $http({
                method: 'POST',
                url: 'http://nanofinapibeta.azurewebsites.net/api/TestManager/Postclaim'
            }).then(function (response) {
                //update voucherBalance
                $scope.currentVoucherBalance = $scope.currentVoucherBalance - amount;
                notificationService.sendSms(recipientUserID, "Hello from NanoFin! You just recieved a NanoBucks voucher valued at R" + amount + ". Visit NanoFin.azurewebsites.net to find out more.");
                $log.info(response);
            }, function (reason) {
                $scope.isLoading = false;
                $log.info(reason);
            });

        };

    });