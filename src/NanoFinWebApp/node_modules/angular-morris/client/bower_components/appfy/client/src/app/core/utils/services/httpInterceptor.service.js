/**
 * Appfy is a JavaScript toolkit that saves your time to build Single Page Applications. It totally modular and based on MEAN stack concept.
 * 
 * Software licensed under MIT, maintained by Appfy Co and its contributors. Feel free to open an issue or make a PR.
 * Check out documentation and full list of contributors in https://github.com/Appfy
 *
 * Copyright © 2016 Appfy Co <help@appfy.org>
 *
 * Permission is hereby granted, free of charge, to any person obtaining a copy
 * of this software and associated documentation files (the “Software”), to deal
 * in the Software without restriction, including without limitation the rights
 * to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 * copies of the Software, and to permit persons to whom the Software is
 * furnished to do so, subject to the following conditions:
 *
 * The above copyright notice and this permission notice shall be included in all
 * copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED “AS IS”, WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 * OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
 * SOFTWARE.
 **/
(function () {
    'use strict';
    /**
     * @ngdoc object
     * @name appfy.utils.factory:HttpInterceptor
     * @requires $q
     * @requires $rootScope
     **/
    angular.module('appfy.utils').factory('HttpInterceptor', /*@ngInject*/ function ($q, $rootScope) {
        return {
            // optional method
            'request': function (config) {
                // do something on success
                return config;
            },
            // optional method
            'requestError': function (rejection) {
                // do something on error
                //if (canRecover(rejection)) {
                //return responseOrNewPromise
                //}
                return $q.reject(rejection);
            },
            // optional method
            'response': function (response) {
                // do something on success
                return response;
            },
            // optional method
            'responseError': function (rejection) {
                $rootScope.$broadcast('$responseError', rejection);
                return $q.reject(rejection);
            }
        }
    });
})();