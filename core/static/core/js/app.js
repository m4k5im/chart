(function () {

    var app = angular.module('mainApp', ['angularFileUpload']);

    app.controller('AppController', ['$scope', '$timeout', 'FileUploader', function ($scope, $timeout, FileUploader) {

        var uploader = $scope.uploader = new FileUploader({
            url: 'http://127.0.0.1:8000/core/upload/'
        });

        uploader.filters.push({
            name: 'fileFilter',
            fn: function (newItem) {
                var type = newItem.type.slice(newItem.type.lastIndexOf('/') + 1);
                var result = 'vnd.ms-excel'.indexOf(type) !== -1 || 'vnd.openxmlformats-officedocument.spreadsheetml.sheet'.indexOf(type) !== -1;
                $scope.fileError = !result;
                var item = $scope.uploader.queue[0];
                if (item && item.name !== item.file.name) {
                    uploader.clearQueue();
                }
                return result;
            }
        });

        uploader.onSuccessItem = function (fileItem, response) {
            if (response.success === 1) {
                $scope.data = response.data;
                $scope.success = true;
            }
        };

        $scope.renderChart = function () {
            if ($scope.success) {
                var data = {
                    labels: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10],
                    series: $scope.data
                };

                var options = {
                    showLine: false,
                    width: 600,
                    height: 400,
                    fullWidth: true,
                    low: 0,
                    chartPadding: {
                        right: 10
                    },
                };

                new Chartist.Line('.ct-chart', data, options);
            }
        };

    }]);

})();