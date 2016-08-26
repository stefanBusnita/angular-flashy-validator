
angular.module('angularFlashyValidator').directive('validate', function ($http) {
    return{
        restrict: 'A',
        require: ['^flashy', 'ngModel'],
        controller: function ($scope) {

        },
        compile: function (tElement, tAttrs) {

            return {
                pre: function (scope, element, attrs, ctrl) {
                    scope.buffer = {};

                    $http.get('json/messages.json')
                            .then(function (res) {
                                scope.messages = res;
                            });
                },
                post: function (scope, element, attrs, ctrl) {
                    var filters, flashController = ctrl[0], modelController = ctrl[1];

                    function checkAttrs() {
                        if (scope.$eval(attrs.ngRequired) && attrs.ngRequired || attrs.required) {
                            modelController.$validators.isRequired = function (modelValue, viewValue) {
                                return filters["required"].checkValidity(modelValue, viewValue);
                            };
                        }
                        if (attrs.ngPattern) {
                            modelController.$validators.hasPattern = function (modelValue, viewValue) {
                                return filters["hasPattern"].checkValidity(modelValue, viewValue);
                            };
                        }
                        if (attrs.minlength || attrs.ngMinLength) {//delayed a bit
                            modelController.$validators.minLength = function (modelValue, viewValue) {
                                return filters["minLength"].checkValidity(modelValue, viewValue);
                            };
                        }
                    }
                    ;

                    filters = {
                        required: {
                            type: "required",
                            checkValidity: function (modelValue, viewValue) {
                                console.log("required model and viewValue",modelValue,viewValue);
                                if (scope.$eval(attrs.ngRequired) || attrs.required) {
                                    if (viewValue==='' || viewValue===undefined) {
                                        console.log("there is no value");
                                        flashController.registerFlash(attrs.id, "field can't be empty", this.type);
                                        return false;
                                    } else {
                                        flashController.removeFlash(attrs.id, this.type);
                                        console.log("removed");
                                        return true;
                                    }
                                } else {
                                    return true;
                                }
                            }
                        },
                        maxLength: {
                            type: "maxLength",
                            checkValidity: function (modelValue, viewValue) {

                            }
                        },
                        minLength: {
                            type: "minLength",
                            checkValidity: function (modelValue, viewValue) {
                                    var minLengthValue = parseInt(attrs.ngMinLength || attrs.minlength,10);
                                    if(viewValue!==undefined && viewValue!=='' && viewValue.length <  minLengthValue){
                                       flashController.registerFlash(attrs.id, "min length not met", this.type);
                                        return false; 
                                    }else{
                                        flashController.removeFlash(attrs.id, this.type);
                                        return true;
                                    }
                                    return true;
                            }
                        },
                        hasPattern: {
                            type: "hasPattern",
                            checkValidity: function (modelValue, viewValue) {
                                    if (viewValue!==undefined && viewValue!=='' && new RegExp(attrs.ngPattern).test(viewValue)) {
                                        flashController.removeFlash(attrs.id, this.type);
                                    } else {
                                        flashController.registerFlash(attrs.id, "pattern not passed", this.type);
                                    }
                                return true;
                            }
                        },
                        minDate: {
                            type: "minDate",
                            checkValidity: function (modelValue, viewValue) {

                            }
                        },
                        maxDate: {
                            type: "maxDate",
                            checkValidity: function (modelValue, viewValue) {

                            }
                        }
                    }

                    checkAttrs();
                }

            }

        }

    }
});
