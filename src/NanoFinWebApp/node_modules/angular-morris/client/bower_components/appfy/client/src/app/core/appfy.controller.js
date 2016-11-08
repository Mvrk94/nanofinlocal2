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
     * @ngdoc controller
     * @name appfy.controller:$AppCtrl
     * @requires ui.router.$state
     * @requires appfy.page.$pageProvider
     * @requires appfy.user.$userProvider
     * @requires appfy.setting
     * @requires appfy.enviroment
     **/
    angular.module('appfy.core').controller('$AppCtrl', /*@ngInject*/ function ($state, $page, $user, setting, enviroment) {
        var app = this;

        /** 
         * Configures moment
         */
        moment.locale(setting.locale);

        /**
         * @ngdoc property
         * @name page
         * @propertyOf appfy.controller:$AppCtrl
         * @description
         * Getter of $page service
         * @example
         * //checks the busy state
         * 
         * `{{$app.page()._busy}}`
         * 
         * //shows div only if the page is free
         * 
         * `<div ng-if="!$app.page().busy()"></div>`

         * //or..
         * 
         * `<div ng-if="!$app.page()._busy"></div>`
         **/
        app.page = function () {
            return $page;
        }

        /**
        * @ngdoc property
        * @name state
        * @propertyOf appfy.controller:$AppCtrl
        * @description
        * Getter of $state service
        * @example
        * //prints current state name
        * 
        * `{{$app.state().current.name}}`
        **/
        app.state = function () {
            return $state;
        }

        /**
         * @ngdoc property
         * @name setting
         * @propertyOf appfy.controller:$AppCtrl
         * @description
         * Getter of `setting` factory
         * @example
         * //prints app name
         * 
         * `{{$app.setting().name}}`
         **/
        app.setting = function () {
            return setting;
        }

        app.enviroment = function () {
            return enviroment;
        }

    });
})();