angular.module('angularFlashyValidator', []);

angular.module('angularFlashyValidator').run(function runApp($rootScope) {});

angular.module('angularFlashyValidator').controller('TestPageController', function ($scope) {

    $scope.firstVal = 1;
    $scope.secondVal = 2;
    

    $scope.test = {};

    $scope.$watch('test.inputVal', function (newV) {
        
        if(newV){
            console.log(newV);
        }
        
    })

});


