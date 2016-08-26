
angular.module('angularFlashyValidator').directive('flashy', function ($compile, $rootScope,FlashService) {
    return{
        restrict: "A",
        controller: function ($scope) {
            this.registerFlash = function (id, text, type) {
                if (!this.checkFlashExistance(id, type)) {
                    $scope.flashes.push({
                        text: text,
                        id: id,
                        type: type
                    });
                } else {
                    //console.log("flash already exists");
                    //do nothing
                }

            };

            this.checkFlashExistance = function (id, type) {
                for (var i = 0; i < $scope.flashes.length; i++) {
                    if ($scope.flashes[i].id === id && $scope.flashes[i].type === type) {
                        return true;
                    }
                }
                return false;
            };

            this.removeFlash = function (id,type) {
                for (var i = 0; i < $scope.flashes.length; i++) {
                    if ($scope.flashes[i].id === id && $scope.flashes[i].type === type) {
                        $scope.flashes.splice(i, 1);
                        break;
                    }
                }
                console.log($scope.flashes);
            };
            
        },
        compile: function (tElement, tAttr) {

            return{
                pre: function (scope) {
                    scope.flashes = [];
                },
                post: function (scope, element, attr, ctrl) {

                    $rootScope.$evalAsync(function (scope) {
                       // console.log("eval async");
                        var tpl = "<div class='flash'><ul><li ng-repeat='item in flashes'>{{item.text}}</ul></div>";
                        addFlashToDOM(tpl);
                    });
                    
                    console.log(ctrl);
                    FlashService.registerListener("ctrl",ctrl);

                    function addFlashToDOM(tpl) {

                        var domElements = $compile(tpl)(scope);

                        angular.element(document.querySelector('#flashesContainer')).after(domElements);
                    }
                }
            }
        }
    }
});