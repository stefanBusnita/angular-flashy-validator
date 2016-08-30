
angular.module('angularFlashyValidator').controller('TestPageController', function ($scope,FlashService) {
    
    $scope.validatePushed = false;
    $scope.firstVal = 1;
    $scope.secondVal = 2;
    

    $scope.test = {};

    $scope.$watch('test.inputVal', function (newV) {
        
        if(newV){
            console.log(newV);
        }
        
    });
    
    $scope.validateForm = function(){
        $scope.validatePushed = true;
    }
    
    $scope.createRandomFlash = function(){
        FlashService.addFlash("randomID","this is a random flash","random",1);
    };
    
});