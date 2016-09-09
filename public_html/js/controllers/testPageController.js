
angular.module('angularFlashyValidator').controller('TestPageController', function ($scope,$timeout, FlashService) {

    $scope.validate = false;
    
    $scope.firstVal = 1;
    $scope.secondVal = 2;
    var minDateOrMaxDate = 'max', minValOrMaxVal = 'min';


    $scope.test = {};

    $scope.validateForm = function () {
        //trigger a validation on button press of all fields.
        $scope.validate = true;
       
       $timeout(function(){
           $scope.validate = false; //return value to false in order to use again
       },1500);

    }

    $scope.createRandomFlash = function () {
        FlashService.addFlash("randomID", "this is a random flash", "random", 1, 2);
    };

    $scope.changeInputFromModel = function () {
        $scope.test.inputVal = '12342123412341sdasdddaswd';
    };

    $scope.changeDateInputFromModel = function () {
        if (minDateOrMaxDate === 'max') {
            $scope.test.dateValue = new Date();
            minDateOrMaxDate = 'min';
        } else {
            $scope.test.dateValue = new Date('2015', '09', '01');
            minDateOrMaxDate = 'max';
        }
    }

    $scope.changeNumberInputFromModel = function () {
        if (minValOrMaxVal === 'max') {
            $scope.test.numberInputVal = 12;
            minValOrMaxVal = 'min';
        } else {
            $scope.test.numberInputVal = 1;
            minValOrMaxVal = 'max';
        }
    };

});