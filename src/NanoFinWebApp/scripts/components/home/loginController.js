angular.module('myApp')
    .controller('loginCtrl', function (auth, $scope, $location, store, $http, $log, $window) {

        $scope.user = '';    
        $scope.pass = '';

        function onLoginSuccess(profile, token) {

            //This needs to be changed according to user type - see code below 
            //   $location.path('/reseller');

            store.set('profile', profile);
            store.set('token', token);
            var id = store.get('profile').user_id.substring(6, store.get('profile').user_id.length);

            $http(
            {

                method: 'GET',
                url: 'https://nanofinapifinal.azurewebsites.net/api/UserHandler/getUserSession?userID=' + id

            })
            .then(function (response)
            {
                if (response.data.type === "Consumer") {
                    $location.path('/catalog');
                }else if (response.data.type === "Reseller") {
                    $location.path('/reseller');
                } else if (response.data.type === "Admin") {
                    $location.path('/admin');
                }


            }, function (reason) {

                console.log('failed');
            });
           
        }

        function onLoginFailed() {

            $scope.loading = false;

        }

        $scope.submit = function ()
        {
            if (String($scope.user).includes("help"))
            {
                $window.location.href ='https://nanofinportal.azurewebsites.net/home';
            } else if (String($scope.user).includes("admin")) {
                //$location.url("/admin");
                //$window.location.href = 'https://nanofinlocal.azurewebsites.net/admin';
                $window.location.href = '/admin';
            }else
            {
                $scope.loading = true;
                auth.signin({
                    popup: false,
                    sso: false,
                    connection: 'NanoFinDB',
                    username: $scope.user,
                    password: $scope.pass,
                    authParams: {
                        scope: 'openid name email'
                    }
                }, onLoginSuccess, onLoginFailed);
            }
        };

        $scope.logout = function () {
            auth.signout();
            store.remove('profile');
            store.remove('token');
            localStorage.removeItem("PGID");
            localStorage.removeItem("PGZAR");
            $location.path('/login');
        };


    });
