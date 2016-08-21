angular.module('angularFlashyValidator').directive('validate', function ($http) {
    return{
        restrict: 'A',
        require: "^flashy",
        controller : function($scope){
          this.removeFromBuffer = function(id){
              //$scope.buffer[id] = '';
              console.log("child called");
          };
        },
        compile: function (tElement, tAttrs) {

            return {
                pre: function (scope, element, attrs, ctrl) {
                    scope.buffer = {};
//                    $http.get('messages.json')
//                            .then(function (res) {
//                                scope.messages = res;
//                            });
                },
                post: function (scope, element, attrs, ctrl) {
                    
                    ctrl.doSomething(attrs);
                    /**
                     * Check for : pattern, (ng-required)required, maxlength, minlength, min-date, max-date
                     */
                   
                    console.log(scope.$eval(attrs.ngRequired));

                    //create something like the requires in ecard ?? with registration for this kind of stuff

                    scope.$watch(attrs.ngModel, function (newV) {

                        //checkingProcess here

                        if (!newV) {
                            ctrl.registerFlash("this field can't be empty", 4);
                        } else {
                            console.log("removed");
                        }
                    })

                }

            }

        }

    }
})
