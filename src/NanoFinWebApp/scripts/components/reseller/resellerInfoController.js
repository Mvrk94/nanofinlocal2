/// <reference path="wwwroot/lib/angular/angular.min.js" />
/// <reference path="wwwroot/lib/angular/angular.js" />

angular.module('myApp')
    .controller('resellerInfoCtrl', function ($scope, $http, $mdToast, $log, $interval, notificationService, userSessionService) {
        

        
        function initMap() {
            var map = new google.maps.Map(document.getElementById('map'), {
                center: { lat: -26.186204, lng: 28.018809 },
                scrollwheel: false,
                zoom: 15
            });

            var marker = new google.maps.Marker({
                position: { lat: -26.185515, lng: 28.019232 },
                map: map,
                title: 'Jozi Hub: 44 Stanley Ave, Milpark, Johannesburg'
            });
        }

        initMap();

    });