
angular.module('angularFlashyValidator').directive('flashy', function ($compile, $timeout, $rootScope, FlashService) {
    return{
        restrict: "A",
        controller: function ($scope) {
            /**
             * Register a flash  
             * @param  id - id of element for which flash is set ( form validation flash ) 
             * @param  text - will be displayed in the flash message
             * @param  type - for an element with id there can be messages of different types (e.g required, minLength e.t.c)
             * @param  level - type of flash (e.g info, success, danger, warning ) 
             * @param  duration - if present flash is closed after a number of seconds.
             */
            this.registerFlash = function (id, text, type, level, duration) {
                /**
                 * css classes for flash
                 */
                var classes = {
                    "1": 'success',
                    "2": 'info',
                    "3": 'warning',
                    "4": 'danger'
                }, classString = classes[level];
                /**
                 * Check for flash existance, add it afterwards
                 */
                if (!this.checkFlashExistance(id, type)) {
                    $scope.flashes.unshift({
                        text: text,
                        id: id,
                        type: type,
                        class: 'flash-' + classString
                    });
                    /**
                     * Check for duration of flash, and remove flash after a certain interval
                     */
                    if (duration && duration > 0) {
                        $timeout(function () {
                            for (var i = 0; i < $scope.flashes.length; i++) {
                                if ($scope.flashes[i].id === id && $scope.flashes[i].type === type) {
                                    $scope.flashes.splice(i, 1);
                                    break;
                                }
                            }
                        }, duration * 1000);
                    }

                }
            };
            /**
             * Check if a certain flash with id and type exists
             * @param  id - used as part of flash identification ( validation : id of DOM elem, manual generation : any value )
             * @param type - used as part of flash identification ( validation : type e.g required, maxlength, manual generation : any value )
             */
            this.checkFlashExistance = function (id, type) {
                for (var i = 0; i < $scope.flashes.length; i++) {
                    if ($scope.flashes[i].id === id && $scope.flashes[i].type === type) {
                        return true;
                    }
                }
                return false;
            };
            /**
             * Remove flash with certain id and type
             * @param  id - used as part of flash identification ( validation : id of DOM elem, manual generation : any value )
             * @param type - used as part of flash identification ( validation : type e.g required, maxlength, manual generation : any value )
             */
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
                    var tpl, domElements;
                    /**
                     * User for remove button on flash
                     */
                    scope.ctrl = ctrl;
                    /**
                     * Use a service to register functions for adding / removing a flash
                     * Using FlashService, we can create a flash/remove it from any controller.
                     */
                    FlashService.registerListener("ctrl", ctrl);
                    /**
                     * Call function to add template to DOM with all messages.
                     */
                    $rootScope.$evalAsync(function (scope) {
                        tpl = "<div class='flash'><ul class='flash-list'><li class='{{item.class}} fade' ng-repeat='item in flashes'>{{item.text}}<span class='btn' ng-click='ctrl.removeFlash(item.id,item.type)'>&#10006;</span></li></ul></div>";
                        addFlashToDOM(tpl);
                    });
                    /**
                     * Compile template on scope and add to DOM.
                     */
                    function addFlashToDOM(tpl) {
                        domElements = $compile(tpl)(scope);
                        angular.element(document.querySelector('#flashesContainer')).after(domElements);
                    }
                }
            }
        }
    }
});