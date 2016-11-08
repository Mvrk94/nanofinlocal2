(function () {
    'use strict';
    /**
     * @ngdoc object
     * @name AppfyApp.config
     **/
    angular.module('AppfyApp').config( /*@ngInject*/ function ($locationProvider) {
        //configure angular-material theme
        //$mdThemingProvider.theme('default').primaryPalette('blue');
        
        //disables html5Mode because we run in Github Pages
        //$locationProvider.html5Mode({ enabled: false });
    });
})();