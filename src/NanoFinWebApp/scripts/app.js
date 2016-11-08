/// <reference path="../wwwroot/views/components/customer/consumersignup.html" />
/// <reference path="../wwwroot/views/components/customer/consumersignup.html" />
var app = angular.module('myApp', ['ngRoute', 'ngMaterial', 'ngMessages', 'ngCookies', 'auth0', 'angular-storage', 'angular-jwt', 'ngSanitize', 'ngLoadScript']); //, 'notifyjs'


app.config(function ($routeProvider, $locationProvider, authProvider, $httpProvider, jwtInterceptorProvider,jwtOptionsProvider) {
    $routeProvider
    .when('/', {
        redirectTo: function () {
            return '/home';
        }
    })
    .when('/home', {
        title: 'NanoFin Home',
        templateUrl: '/views/components/home/home.html',
        controller: 'homePageController',
        requiresLogin: false

    })
    .when('/about', {
        title: 'About',
        templateUrl: '/views/components/common/about.html', 
        controller: 'aboutPageController',
        requiresLogin: false
    })
   .when('/login', {
       title: 'Login',
       templateUrl: '/views/components/home/login.html',
       controller: 'loginCtrl',
       requiresLogin: false   
   })
    .when('/reseller', {
        title: 'Reseller',
        templateUrl: '/views/components/reseller/home.html',
        controller: 'resellerPageController',
        //requiresLogin: false
        requiresLogin: false
        
    })
    .when('/resellerperformance', {
        title: 'Reseller - performance',
        templateUrl: '/views/components/reseller/resellerPerformance.html',
        controller: 'resellerPerformancePageController',
        //requiresLogin: false
        requiresLogin: false

    })
    .when('/resellersfindus', {   
        title: 'Find Us',
        templateUrl: '/views/components/reseller/resellerInfo.html',
        controller: 'resellerInfoPageController',
        requiresLogin: false
    })
    .when('/registerreseller', {
        title: 'Register a Reseller',
        templateUrl: '/views/components/admin/registerAReseller.html',
        controller: 'registerResellerPageController',
        requiresLogin: true
    })
    .when('/admin', {
        title: 'Admin Home',
        templateUrl: '/views/components/admin/adminHome.html',
        controller: 'adminHomePageController',
        requiresLogin: true

    })
    .when('/contact', {
        title: 'Contact us',
        templateUrl: '/views/components/common/contact.html',
        controller: 'contactPageController',
        requiresLogin: false
    })
    .when('/catalog', {
        title: 'Catalog',
        templateUrl: '/views/components/customer/catalog.html',
        controller: 'catalogPageController',
        requiresLogin: true
    })
    .when('/signup', {
        title: 'Signup',
        templateUrl: '/views/components/customer/ConsumerSignUp.html',
        controller: 'consumerSignUpPageController',
        requiresLogin: false
    })
   .when('/purchaseproduct/:param1', {
       title: 'Purchase Product',
       templateUrl: '/views/components/customer/purchaseproduct.html',
       controller: 'purchaseprodCtrl',
       requiresLogin: true
   })
     .when('/sendvoucher', {
         title: 'Send Voucher',
         templateUrl: '/views/components/customer/sendvoucher.html',
         controller: 'sendvoucherCtrl',
         requiresLogin: false
     })
     .when('/wallet', {
        title: 'Wallet',
        templateUrl: '/views/components/customer/wallet.html',
        controller: 'walletCtrl',
        requiresLogin: true

     })
     .when('/history', {
        title: 'History',
        templateUrl: '/views/components/customer/history.html',
        controller: 'historyCtrl',
        requiresLogin: true

     })
     .when('/viewClaimHistories', {
              title: 'Claim History',
              templateUrl: '/views/components/customer/viewClaimHistories.html',
              controller: 'claimHistoryCtrl',
              requiresLogin: true

          })
      .when('/profile', {
        title: 'Profile',
        templateUrl: '/views/components/customer/profile.html',
        controller: 'profileCtrl',
        requiresLogin: true

    })
    .when('/claim/:param1', {
        title: 'Claim',
        templateUrl: '/views/components/customer/claim.html',
        controller: 'claimCtrl',
        requiresLogin: true

    })
    .when('/claim2', {
        title: 'Claim2',
        templateUrl: '/views/components/customer/claim2.html',
        controller: 'SampleWizardController',
        requiresLogin: true

    })
    .when('/claimSimple/:param1/:param2', {
        title: 'Claim Simple',
        templateUrl: '/views/components/customer/claimSimple.html',
        controller: 'claimSimpleCtrl',
        requiresLogin: true

    })
  .when('/addbeneficiary', {
             title: 'Add Beneficiary',
             templateUrl: '/views/components/customer/addbeneficiary.html',
             controller: 'addBeneficiaryPageController',
             requiresLogin: true
  })
 .when('/viewbeneficiaries', {
             title: 'View Beneficiaries',
             templateUrl: '/views/components/customer/viewbeneficiaries.html',
             controller: 'viewBeneficiariesPageController',
             requiresLogin: true
         })
  .otherwise({
        templateUrl: '/views/components/home/home.html',
        controller: 'homePageController'
    });

    authProvider.init({
        domain: 'nanofin.eu.auth0.com',
        clientID: 'twXZJa9qjHoWSNSBXSi3GfL2148qiQ08',
        loginUrl: '/login'
    });

    jwtOptionsProvider.config({
        whiteListedDomains: ['http://nanofinapifinal.azurewebsites.net/', 'http://nanofinapibeta.azurewebsites.net/', 'http://localhost/','https://nanofinapifinal.azurewebsites.net']
    });

    jwtInterceptorProvider.tokenGetter = function (store) {
        return store.get('token');

    };

    $httpProvider.interceptors.push('jwtInterceptor'); 

    //$locationProvider.html5Mode(false).hashPrefix('!'); // AngularJS Hashbang routing mode
    $locationProvider.html5Mode(true);
});
app.controller('homePageController', ['$scope', function ($scope) {
}]);
app.controller('aboutPageController', ['$scope','$window', function ($scope, $window) {
    $window.location.href = 'http://test.projectsday.info/t9/';
}]);
app.controller('consumerSignUpPageController', ['$scope', function ($scope) {
}]);
app.controller('loginPageController', ['$scope', function ($scope) {

}]);
app.controller('resellerPageController', ['$scope', function ($scope) {
    $scope.title = "Reseller";
}]);
app.controller('resellerPerformancePageController', ['$scope', function ($scope) {
    $scope.title = "Reseller";
}]);
app.controller('resellerInfoPageController', ['$scope', function ($scope) {
    $scope.title = "resellerInfo";
}]);
app.controller('adminHomePageController', ['$scope', function ($scope) {
}]);
app.controller('registerResellerPageController', ['$scope', function ($scope) {
    $scope.title = "registerreseller";
}]);
app.controller('contactPageController', ['$scope', '$window', function ($scope, $window) {
    $window.location.href = 'http://test.projectsday.info/t9/';
}]);
app.controller('catalogPageController', ['$scope', function ($scope) {
    $scope.title = "Catalog";
}]);
app.controller('purchasePageController', ['$scope', function ($scope) {
    $scope.title = "Purchase";
}]);
app.controller('sendvoucherPageController', ['$scope', function ($scope) {
    $scope.title = "Send";
}]);
app.controller('walletPageController', ['$scope', function ($scope) {
    $scope.title = "Wallet";
}]);
app.controller('historyPageController', ['$scope', function ($scope) {
    $scope.title = "History";
}]);
app.controller('profilePageController', ['$scope', function ($scope) {
    $scope.title = "Profile";
}]);
app.controller('claimPageController', ['$scope', function ($scope) {
    $scope.title = "Claim";
}]);
app.controller('Claim2PageController', ['$scope', function ($scope) {
    $scope.title = "Claim2";
}]);
app.controller('claimSimplePageController', ['$scope', function ($scope) {
    $scope.title = "ClaimSimple";
}]);
app.controller('addBeneficiaryPageController', ['$scope', function ($scope) {
    $scope.title = "ClaimSimple";
}]);
app.controller('viewBeneficiariesPageController', ['$scope', function ($scope) {
    $scope.title = "ClaimSimple";
}]);
app.controller('claimHistoryPageController', ['$scope', function ($scope) {
    $scope.title = "ClaimSimple";
}]);


app.run(function ($rootScope, $route, auth, store, jwtHelper, $location) {

    auth.hookEvents();
    $rootScope.$on('$locationChangeStart', function () {
        //if (!auth.isAuthenticated) {
        //    var token = store.get('token');
        //    if (token) {
        //        if (!jwtHelper.isTokenExpired(token)) {
        //            auth.authenticate(store.get('profile'), token);
        //        } else {
        //            $location.path('/login');

        //        }
        //    }
        //}
    });

    $rootScope.$on('$routeChangeSuccess', function () {
        document.title = $route.current.title;

    });
});