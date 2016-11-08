(function () {
    'use strict';
    /**
     * @ngdoc object
     * @name appfy.error.config
     **/
    angular.module('appfy.error').config( /*@ngInject*/ function ($stateProvider) {
        //
        // Routes
        //
        $stateProvider.state('app.401', {
            title: '401',
            url: '/401/',
            views: {
                'content': {
                    templateUrl: 'app/modules/appfy-error/templates/401.html'
                }
            },
            resolve: {
                slug: /*@ngInject*/ function ($stateParams) {
                    return $stateParams.slug;
                }
            }
        }).state('app.404', {
            title: '404',
            url: '/404/',
            views: {
                'content': {
                    templateUrl: 'app/modules/appfy-error/templates/404.html'
                }
            },
            resolve: {
                slug: /*@ngInject*/ function ($stateParams) {
                    return $stateParams.slug;
                }
            }
        }).state('app.500', {
            title: '500',
            url: '/500/',
            views: {
                'content': {
                    templateUrl: 'app/modules/appfy-error/templates/500.html'
                }
            },
            resolve: {
                slug: /*@ngInject*/ function ($stateParams) {
                    return $stateParams.slug;
                }
            }
        });
    });
})();