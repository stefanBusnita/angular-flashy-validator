angular.module('angularFlashyValidator').directive('flashy', function ($compile) {
    return{
        restrict: "A",
        controller: function ($scope) {
            this.registerFlash = function (text, level) {
                var id = Math.random();
                $scope.flashes.push({
                    text: text,
                    level: level,
                    id: id
                });
                return id;
            };

            this.doSomething = function (text) {
                console.log(text);
            };

            this.removeFlash = function (id) {
                //remove also from child directive buffer 
            };
        },
        compile: function (tElement, tAttr) {

            return{
                pre: function (scope) {
                    scope.flashes = [];
                },
                post: function (scope, element, attr, ctrl) {                                       
                    var tpl = "<div class='flash'><ul><li ng-repeat='item in flashes'>{{item.text}}</ul></div>";

                    addFlashToDOM(tpl);

                    function addFlashToDOM(tpl) {

                        var domElements = $compile(tpl)(scope);

                        angular.element(document.querySelector('#flashesContainer')).after(domElements);
                    }


                }

            }

        }
    }
});