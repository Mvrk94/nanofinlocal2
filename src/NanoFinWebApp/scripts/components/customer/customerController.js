angular.module('myApp')
    .controller('customerCtrl', function ($scope, $http, notificationService, userSessionService, $location, $window, $log, $mdDialog)
    {

        if (userSessionService.isUserLoggedIn()) {
            $scope.consumerUserID = userSessionService.getUserID();
        }
        else {
            $scope.consumerUserID = 21;
        }

        $scope.$location = $location;

        //$scope.additionalDetailsNotCompleted = true;
       

        $scope.baseURL = "https://nanofinapifinal.azurewebsites.net";

        $scope.assets = [];
        $scope.travels = [];
        $scope.legals = [];
        $scope.medicals = [];
        $scope.funerals = [];
        $scope.valueaddeds = [];

        $scope.sortType = 'productName';
        $scope.sortReverse = false;
        $scope.searchProduct = '';

        $scope.productID = 0;


        $scope.pageLoading = false;
        $scope.isLoadingSave = false;
      
      
        //Additional Details Modal Code
       // $scope.isNotCompletedYet = true;
        $scope.items = [{ name: 'Khaya Cover', id: 31 }, { name: 'Commuter Accident', id: 41 }, { name: 'Legal Insurance', id: 51 }, { name: 'Trauma And Assault Cover', id: 71 }, { name: 'Personal Accident Cover', id: 91 }, { name: 'Funeral Cover', id: 101 }, { name: 'Cross Border Travel', id: 191 }, { name: '2Help1 Hospital Cash Plan', id: 231 }];
        $scope.selected = [];
        $scope.toggle = function (item, list) {
            var idx = list.indexOf(item.id);
            if (idx > -1) {
                list.splice(idx, 1);//if exists remove it
            }
            else {
                list.push(item.id); //if does not exist add it
            }
        };

        $scope.exists = function (item, list) { //does this item exist in the list
            return list.indexOf(item.id) > -1;
        };

        $scope.getSelectedFormat = function (selected)
        {
            var text = "";
            for (i = 0; i < selected.length; i++)
            {
                text += selected[i] + ",";
            }
            text = text.substring(0, text.length - 1);//remove last comma
            text += ";";
            //0,0,0}";
            for (i = 0; i < selected.length; i++) {
                text += 0 + ",";
            }
            text = text.substring(0, text.length - 1);//remove last comma
            text += "";
            $scope.newSelectedItemsFormatted = text;
            return text;
        };

        $scope.$watch('consumerSignUp.$valid', function () {

            if ($scope.consumerSignUp.$valid === true) {
                $scope.isFormNotCompletedYet = false;
            }
            else
            {
                $scope.isFormNotCompletedYet = true;
            }
        });


    $scope.getCatalogProducts = function (insuranceTypeID)
    {
        $scope.pageLoading = true;
        $http({
            method: 'GET',
            url: "https://nanofinapifinal.azurewebsites.net/api/ConsumerWalletHandler/getSpecificCategoryCatalogInsuranceProducts?insuranceTypeID=" + insuranceTypeID
        }).then(function successCallBack(response) {
            $scope.pageLoading = false;
            switch (insuranceTypeID)
            {
                case 1:
                    $scope.assets = response.data; 
                    break;
                case 2:
                    $scope.travels = response.data;
                    break;
                case 11:
                    $scope.legals = response.data;
                    break;
                case 21:
                    $scope.medicals = response.data;
                    break;
                case 31:
                    $scope.funerals = response.data;
                    break;
                case 41:
                    $scope.valueaddeds = response.data;
                    break;
            }
        });

    };

       
    $scope.getCatalogProducts(1);
    $scope.getCatalogProducts(2);
    $scope.getCatalogProducts(11);
    $scope.getCatalogProducts(21);
    $scope.getCatalogProducts(31);
    $scope.getCatalogProducts(41);

        //used consumerProfiles controller
        //Get request to see if homeowner type is null(means we don't have additional details about this person): if it is additionalDetailsNotCompleted is true otherwise it is false
    var getIsAdditDetailsCaptured = function ()
    {
        $http({
            method: 'GET',
            url: $scope.baseURL + "/api/ConsumerAdditionalProfileInfo/getIsHomeOwnerTypeNull?userID=" + $scope.consumerUserID
        })
           .then(function (response) {
               var additIsCompleted = response.data;
               $scope.additionalDetailsNotCompleted = additIsCompleted; //true if NOT completed or false if is completed
               $log.info(response);
               console.log(response);
           }, function (reason) {
               $log.info(reason);
           });
    };
    getIsAdditDetailsCaptured();

        //initialize the variable for if customer checks to complete additional sign up details later
    var initializeLater = function ()
    {
        $scope.laterHasBeenSelected = false;
    };
   
    initializeLater();
    $scope.laterHasBeenSelected = false;
    $scope.goToPurchaseProduct = function(productID)
    {
        getIsAdditDetailsCaptured();
        //logic nb here:
        if ($scope.laterHasBeenSelected === true) //check if later been chosen
        {
            $location.url('/purchaseproduct/' + productID);
        }
       else if ($scope.additionalDetailsNotCompleted===true) //have not been captured for this user AND notWantToComplete later
        {
            $("#myModal").modal();
            //this works        
           
        }
        else if($scope.additionalDetailsNotCompleted===false)
        {
           $location.url('/purchaseproduct/' + productID);
           //window.location = '/purchaseproduct/' + productID;
        }
        
    };
        //click on later
    $scope.laterClicked = function () {

        $scope.laterHasBeenSelected = true;

        $("#myModal").modal('hide');
        //$("#myModal").hide();
        $("#alertLaterModal").modal();
    };

        //Post to save the new details to the database

    $scope.SaveAdditonalDetails = function () {
        $scope.isLoadingSave = true;

        $http({
            method: 'PUT',
            url: $scope.baseURL + "/api/ConsumerAdditionalProfileInfo/putAdditionalSignUpInfo?userID=" + $scope.consumerUserID + "&consumerAddress=" + $scope.consumer.addressline + "&homeOwnerType=" + $scope.consumer.homeOwnerType + "&numDependants=" + $scope.consumer.numberDependants + "&topProductsInterestedIn=" + $scope.getSelectedFormat($scope.selected) + "&grossMonthly=" + $scope.consumer.grossMonthlyIncome + "&nettMonthly=" + $scope.consumer.nettMonthlyIncome + "&totalExpenses=" + $scope.consumer.totalMonthlyExpenses
        })
          .then(function (response) {
              $log.info(response);
              console.log(response);
              $scope.isLoadingSave = false;
              $scope.additionalDetailsNotCompleted = false; //they have been completed
              $("#myModal").modal('hide');
            
              $("#alertModal").modal();
              //alert('Thank You! Your additional details are captured Click OK to continue browsing the catalog');
             
          }, function (reason) {
              $log.info(reason);
          });
    };


    
    });
