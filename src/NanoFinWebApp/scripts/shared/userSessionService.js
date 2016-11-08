/// <reference path="../../wwwroot/lib/angular/angular.min.js" />
/// <reference path="../../wwwroot/lib/angular/angular.js" />

angular.module('myApp').factory("userSessionService", function ($http, $log, $q, store) {
    var self = {};

    self.getUserID = function () {
        if (store.get('profile') === null) {
            return -1;
        } else {
            return store.get('profile').user_id.substring(6, store.get('profile').user_id.length);
        }
    };

    self.isUserLoggedIn = function(){
        if (store.get('profile') === null &&  store.get('token') === null) {
            return false;
        } else {
            return true;
        }
    };

    return self;
});