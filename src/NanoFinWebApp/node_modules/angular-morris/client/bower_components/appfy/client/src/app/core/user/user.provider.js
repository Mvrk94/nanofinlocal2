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
     * @name appfy.user.$userProvider
     **/
    angular.module('appfy.user').provider('$user', /*@ngInject*/ function $userProvider() {
        this.$get = this.get =
            /*@ngInject*/
            function $userProvider($q, $User, $auth, $rootScope, $sessionStorage, $localStorage, $translate) {
                return {
                    /**
                     * @ngdoc function
                     * @name appfy.user.$userProvider#instance
                     * @methodOf appfy.user.$userProvider
                     * @param {object} object user params
                     * @description
                     * Getter/setter for an {@link appfy.user.service:$User User instance}
                     */
                    instance: function (object) {
                        if (object) {
                            return $localStorage.user = object;
                        }
                        else {
                            return $localStorage.user;
                        }
                    },

                    /**
                     * @ngdoc function
                     * @name appfy.user.$userProvider#boot
                     * @methodOf appfy.user.$userProvider
                     * @param {object} params params for init a new user session
                     * @description
                     * Bootstrap new user
                     * @example
                     * <pre>
                     * 
                     * var response_from_server = {
                     *                               token: 'eyJ0eXAiOhu3',
                     *                               firstName: 'Michael',
                     *                               lastName: 'Jackson'
                     *                            };
                     * 
                     * $user.boot(response_from_server).then(function(UserInstance){
                     *      console.log(UserInstance);
                     * });
                     * 
                     * </pre>
                     * @returns {Promise} callback
                     */
                    boot: function (params) {
                        var deferred = $q.defer();
                        params = params ? params : { profile: {} };
                        this.instance(new $User(params));
                        deferred.resolve(this.instance());
                        return deferred.promise;
                    },
                    /**
                     * @ngdoc function
                     * @name appfy.user.$userProvider#destroy
                     * @methodOf appfy.user.$userProvider
                     * @description
                     * Remove User instance
                     * @returns {Promise} callback
                     * @example
                     * <pre>
                     * //create a new user instance
                     * var NewUser = new $User({firstName: 'Albert', lastName: 'Einstein'});
                    
                     * //persist
                     * $user.instance(NewUser);
                     * 
                     * //show out the result
                     * console.log($user.instance());
                     * 
                     * //mock an async call
                     * setTimeout(function() {
                     *      //destroy the session. it returns a promise.
                     *      $user.instance().destroy().then(function() {
                     *          //no nothing more
                     *          console.log($user.instance());
                     *      });    
                     * }, 3000);
                     * 
                     * </pre>
                     **/
                    destroy: function () {
                        var deferred = $q.defer();
                        $auth.removeToken();
                        $sessionStorage.$reset();
                        $localStorage.$reset();
                        deferred.resolve();
                        return deferred.promise;
                    }
                }
            }
        /**
         * @ngdoc function
         * @name appfy.user.$userProvider#routeAuthed
         * @methodOf appfy.user.$userProvider
         * @description
         * Checks authentication for config phase
         * @example
         * <pre>
         *     $stateProvider.state('app.some-route', {
         *          url: '/some/route',
         *          views: {
         *              'content': {
         *                  templateUrl: 'app/modules/any/module/template.html',
         *                  controller: 'TheCtrl',
         *                  controllerAs: 'vm'
         *              }
         *          },
         *          resolve: {
         *              //verifies if the route are authed, case true redirects to dashboard
         *              checksIfIsAuthed: $userProvider.routeAuthed('/dashboard/')
         *          }
         *      })
         * </pre>
         * @requires satellizer.$auth
         * @requires appfy.$user.provider
         * @requires angular.$location
         * @param {string} redirect destiny of redirection
         * @returns {*} location redirection
         **/
        this.routeAuthed = function (redirect) {
            return /*@ngInject*/ function isAuthed($auth, $user, $window, $timeout, $state) {
                if ($auth.isAuthenticated()) {
                    $timeout(function () {
                        //if ($state.current.name != 'app.sign-in')
                        window.location.replace(redirect || '/');
                    }, 500);
                    return true;
                } else {
                    return false;
                }
            }
        }
        /**
         * @ngdoc function
         * @name appfy.user.$userProvider#routeNotAuthed
         * @methodOf appfy.user.$userProvider
         * @description
         * Checks authentication for config phase
         * @example
         * <pre>
         *     $stateProvider.state('app.some-route', {
         *          url: '/some/route',
         *          views: {
         *              'content': {
         *                  templateUrl: 'app/modules/any/module/template.html',
         *                  controller: 'TheCtrl',
         *                  controllerAs: 'vm'
         *              }
         *          },
         *          resolve: {
         *              //verifies if the route are not authed, case true redirects to login page
         *              checksIfIsAuthed: $userProvider.routeNotAuthed('/login/')
         *          }
         *      })
         * </pre>
         * @requires satellizer.$auth
         * @requires appfy.$user.provider
         * @requires angular.$location
         * @param {string} redirect destiny of redirection
         * @returns {*} location redirection
         **/
        this.routeNotAuthed = function (redirect) {
            return /*@ngInject*/ function isNotAuthed($auth, $timeout, $user, $location, $state, setting) {
                if (!$auth.isAuthenticated()) {
                    $timeout(function () {
                        //if ($state.current.name != 'app.sign-in')
                            window.location.replace(redirect || '/');
                    }, 500);
                    return true;
                } else {
                    return false;
                }
            }
        }
    });
})();