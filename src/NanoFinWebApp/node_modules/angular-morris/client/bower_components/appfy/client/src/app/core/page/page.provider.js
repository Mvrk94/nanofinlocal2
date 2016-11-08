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
    angular.module('appfy.page').provider('$page',
        /**
         * @ngdoc object
         * @name appfy.page.$pageProvider
         * @description
         * Page is like a main wrapper and it provides the default related states and methods for our application.
         **/
        /*@ngInject*/
        function $pageProvider() {
            this._title = '';
            this._description = '';
            this._keywords = '';
            this._icon = '';
            this._ogSiteName = '';
            this._ogTitle = '';
            this._ogDescription = '';
            this._ogUrl = '';
            this._ogImage = '';
            this._ogSection = '';
            this._ogTag = '';
            this._busy = '';

            /**
             * @ngdoc function
             * @name appfy.page.$pageProvider#title
             * @methodOf appfy.page.$pageProvider
             * @description
             * getter/setter
             * @param {string} str page title
             * @return {string} page title
             **/
            function title(value) {
                if (value) return this._title = value;
                else return this._title;
            }
            /**
             * @ngdoc function
             * @name appfy.page.$pageProvider#description
             * @methodOf appfy.page.$pageProvider
             * @description
             * getter/setter
             * @param {string} value page description
             **/
            function description(value) {
                if (value) return this._description = value;
                else return this._description;
            }
            /**
             * @ngdoc function
             * @name appfy.page.$pageProvider#keywords
             * @methodOf appfy.page.$pageProvider
             * @description
             * getter/setter
             * @param {string} value page keywords
             **/
            function keywords(value) {
                if (value) return this._keywords = value;
                else return this._keywords;
            }
            /**
             * @ngdoc function
             * @name appfy.page.$pageProvider#icon
             * @methodOf appfy.page.$pageProvider
             * @description
             * getter/setter
             * @param {string} value page icon
             **/
            function icon(value) {
                if (value) return this._icon = value;
                else return this._icon;
            }
            /**
             * @ngdoc function
             * @name appfy.page.$pageProvider#ogLocale
             * @methodOf appfy.page.$pageProvider
             * @description
             * getter/setter
             * @param {string} value open graph page locale
             **/
            function ogLocale(value) {
                if (value) return this._ogLocale = value;
                else return this._ogLocale;
            }
            /**
             * @ngdoc function
             * @name appfy.page.$pageProvider#ogSiteName
             * @methodOf appfy.page.$pageProvider
             * @description
             * getter/setter
             * @param {string} value open graph page site name
             **/
            function ogSiteName(value) {
                if (value) return this._ogSiteName = value;
                else return this._ogSiteName;
            }
            /**
             * @ngdoc function
             * @name appfy.page.$pageProvider#ogTitle
             * @methodOf appfy.page.$pageProvider
             * @description
             * getter/setter
             * @param {string} value open graph page title
             **/
            function ogTitle(value) {
                if (value) return this._ogTitle = value;
                else return this._ogTitle;
            }
            /**
             * @ngdoc function
             * @name appfy.page.$pageProvider#ogDescription
             * @methodOf appfy.page.$pageProvider
             * @description
             * getter/setter
             * @param {string} value open graph page description
             **/
            function ogDescription(value) {
                if (value) return this._ogDescription = value;
                else return this._ogDescription;
            }
            /**
             * @ngdoc function
             * @name appfy.page.$pageProvider#ogUrl
             * @methodOf appfy.page.$pageProvider
             * @description
             * getter/setter
             * @param {string} value open graph page url
             **/
            function ogUrl(value) {
                if (value) return this._ogUrl = value;
                else return this._ogUrl;
            }
            /**
             * @ngdoc function
             * @name appfy.page.$pageProvider#ogImage
             * @methodOf appfy.page.$pageProvider
             * @description
             * getter/setter
             * @param {string} value open graph page image
             **/
            function ogImage(value) {
                if (value) return this._ogImage = value;
                else return this._ogImage;
            }
            /**
             * @ngdoc function
             * @name appfy.page.$pageProvider#ogSection
             * @methodOf appfy.page.$pageProvider
             * @description
             * getter/setter
             * @param {string} value open graph page section
             **/
            function ogSection(value) {
                if (value) return this._ogSection = value;
                else return this._ogSection;
            }
            /**
             * @ngdoc function
             * @name appfy.page.$pageProvider#ogTag
             * @methodOf appfy.page.$pageProvider
             * @description
             * getter/setter
             * @param {string} value open graph page tag
             **/
            function ogTag(value) {
                if (value) return this._ogTag = value;
                else return this._ogTag;
            }
            /**
             * @ngdoc function
             * @name appfy.page.$pageProvider#busy
             * @methodOf appfy.page.$pageProvider
             * @description
             * getter/setter for busy state
             **/
            function busy() {
                return this._busy = !this._busy;
            }

            this.$get = this.get = /*@ngInject*/ function ($utils) {
                return {
                    busy: busy,
                    title: title,
                    description: description,
                    keywords: keywords,
                    icon: icon,
                    ogLocale: ogLocale,
                    ogSiteName: ogSiteName,
                    ogTitle: ogTitle,
                    ogDescription: ogDescription,
                    ogUrl: ogUrl,
                    ogImage: ogImage,
                    ogSection: ogSection,
                    ogTag: ogTag
                }
            }
        });
})();