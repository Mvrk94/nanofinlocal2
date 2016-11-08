angular.module('myApp')
    .controller('claimwizardCtrl', function ($scope, $http, $routeParams, $log, $interval, $mdToast, $filter, $q, $timeout, notificationService, userSessionService,rcWizard,rcForm,rcDisabled) {

        $scope.user = {};

        $scope.saveState = function () {
            var deferred = $q.defer();

            $timeout(function () {
                deferred.resolve();
            }, 5000);

            return deferred.promise;
        };

        $scope.completeWizard = function () {
            alert('Completed!');
        };

    });