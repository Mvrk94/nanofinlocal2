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
     * @ngdoc service
     * @name appfy.user.service:$User
     **/
    angular.module('appfy.user').service('$User', /*@ngInject*/ function ($auth, lodash) {
        var _ = lodash,
            self = this;
        var $User = function (params) {
            params = params ? params : {};
            angular.extend(this, params);
        }

        /**
         * @ngdoc function
         * @name appfy.user.service#isAuthed
         * @methodOf appfy.user.service:$User
         * @description
         * Checks authentication for an $User instance.
         * @example
         * <pre>
         * 
         * var response_from_server = {
         *                               token: 'eyJ0eXAiOhu3',
         *                               firstName: 'Michael',
         *                               lastName: 'Jackson'
         *                            };
         * 
         * var user = new $User(response_from_server);
         * 
         * console.log(user.isAuthed()); //print true
         * 
         * </pre>
         * @requires satellizer.$auth
         * @returns {*} bool
         **/
        $User.prototype.isAuthed = function isAuthed() {
            return $auth.isAuthenticated();
        }

        return $User;
    });
})();