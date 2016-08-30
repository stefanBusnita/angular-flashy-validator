
angular.module('angularFlashyValidator').directive('flashy', function ($compile, $rootScope, FlashService) {
    return{
        restrict: "A",
        controller: function ($scope) {

            this.registerFlash = function (id, text, type, level) {
                console.log("arguments", id,text,type,level);
                var classes = {
                    "1": 'success',
                    "2": 'info',
                    "3": 'warning',
                    "4": 'danger'
                };
                var classString = classes[level];
                console.log("classes",classes);
                console.log("class string", classString);
                if (!this.checkFlashExistance(id, type)) {

                    $scope.flashes.unshift({
                        text: text,
                        id: id,
                        type: type,
                        class: 'flash-' + classString
                    });
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

            this.removeFlash = function (id, type) {
                for (var i = 0; i < $scope.flashes.length; i++) {
                    if ($scope.flashes[i].id === id && $scope.flashes[i].type === type) {
                        $scope.flashes.splice(i, 1);
                        break;
                    }
                }
            };

        },
        compile: function (tElement, tAttr) {

            return{
                pre: function (scope) {
                    scope.flashes = [];
                },
                post: function (scope, element, attr, ctrl) {
                    
                    scope.removeFlash = ctrl.removeFlash;

                    $rootScope.$evalAsync(function (scope) {
                        var tpl = "<div class='flash'><ul class='flash-list'><li class='{{item.class}}' ng-repeat='item in flashes'>{{item.text}}<span class='btn' ng-click='removeFlash(item.id,item.type)'>&#10006;</span></li></ul></div>";
                        addFlashToDOM(tpl);
                    });

                    FlashService.registerListener("ctrl", ctrl);

                    function addFlashToDOM(tpl) {

                        var domElements = $compile(tpl)(scope);

                        angular.element(document.querySelector('#flashesContainer')).after(domElements);
                    }
                }
            }
        }
    }
});