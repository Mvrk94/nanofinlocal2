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
'use strict';
/*jshint -W117 */
describe('Http Interceptor Service', function () {
    var Interceptor, rootScope;
    beforeEach(module('appfy.utils'));
    beforeEach(inject(function ($rootScope, _HttpInterceptor_) {
        Interceptor = _HttpInterceptor_;
        rootScope = $rootScope;
    }));

    describe('response', function () {
        it('should define request', function () {
            expect(Interceptor.request(true)).toBeTruthy();
        });
        it('should return response on success', function () {
            expect(Interceptor.response(true)).toBeTruthy();
        });
        it('should return object with status 2 for $q.reject on request error', function () {
            expect(Interceptor.requestError(true).$$state.status).toEqual(2);
        });
        it('should $emit $Unauthorized on response error 401', function () {
            spyOn(rootScope, '$emit');
            Interceptor.responseError({
                status: 401
            });
            expect(rootScope.$emit).toHaveBeenCalledWith('$Unauthorized');
        });
    });
});