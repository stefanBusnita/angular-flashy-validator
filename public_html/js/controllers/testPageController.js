
angular.module('angularFlashyValidator').controller('TestPageController', function ($scope, FlashService) {

    $scope.validatePushed = false;
    $scope.firstVal = 1;
    $scope.secondVal = 2;
    var minDateOrMaxDate = 'max', minValOrMaxVal = 'min';


    $scope.test = {};

    $scope.$watch('validate', function (newV) {
        console.log("in watch", newV)
    });

    $scope.validateForm = function () {

        $scope.validate = true;
        console.log("validate form pushed", $scope.validate);
        if ($scope.testForm.$valid) {
            $scope.validate = false;
        } else {
            $scope.validate = false;
        }

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