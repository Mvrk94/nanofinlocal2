//Delete?
angular.module('myApp')
    .factory("FileUploadService", function ($http, $log, $q)
{
        var fac = {};
        fac.UploadFile = function (file, description) {
            var formData = new FormData();
            formData.append("file", file);
            //We can send more data to server using append         
            formData.append("description", description);

            var defer = $q.defer();
            $http.post('http://localhost:14198/api/FileUpload/UpLoadFiles', formData,
                {

                    headers: { 'Content-Type': undefined },
                    transformRequest: angular.identity
                })
            .success(function (d) {
                defer.resolve(d);
            })
            .error(function () {
                defer.reject("File Upload Failed!");
            });

            return defer.promise;

        };
        return fac;

});