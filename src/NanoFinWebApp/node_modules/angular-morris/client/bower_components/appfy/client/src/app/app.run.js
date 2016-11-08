(function () {
    'use strict';
    /**
     * @ngdoc object
     * @name AppfyApp
     **/
    angular.module('AppfyApp').run( /*@ngInject*/ function ($auth, $user) {
        //enforce that localStorage will be clean
        if (!$auth.isAuthenticated()) {
            $user.destroy();
        }
    });
})();