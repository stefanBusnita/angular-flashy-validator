
angular.module('angularFlashyValidator').directive('validate', function ($http,$timeout) {
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
                                console.log(res.data);
                                scope.message = res.data;
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
                        if (attrs.maxlength || attrs.ngMaxLength) {
                            modelController.$validators.maxLength = function (modelValue, viewValue) {
                                return filters["maxLength"].checkValidity(modelValue, viewValue);
                            };
                        }
                        
                        modelController.$asyncValidators.test = function(modelValue,viewValue){
                          
                          var deferred = $q.defer();
                          //try to do the typing thing before validation.
                          
                            
                        };
                    }
                    ;
                    console.log(scope.message);
                    function getMessage(type) {
                        console.log(scope.message);
                        return attrs.title ? (attrs.title + " " + scope.messages[type]) : "";
                    }

                    filters = {
                        required: {
                            type: "required",
                            defaultFlashLevel: '3',
                            checkValidity: function (modelValue, viewValue) {
                                console.log("required model and viewValue", modelValue, viewValue);
                                if (scope.$eval(attrs.ngRequired) || attrs.required) {
                                    if (viewValue === '' || viewValue === undefined) {
                                        flashController.registerFlash(attrs.id, attrs.title + " field is required.", this.type, this.defaultFlashLevel);
                                        return false;
                                    } else {
                                        flashController.removeFlash(attrs.id, this.type);
                                        return true;
                                    }
                                } else {
                                    return true;
                                }
                            }
                        },
                        maxLength: {
                            type: "maxLength",
                            defaultFlashLevel: '3',
                            checkValidity: function (modelValue, viewValue) {
                                var maxLengthValue = parseInt(scope.$eval(attrs.ngMaxLength) || attrs.maxlength, 10);
                                if (viewValue !== undefined && viewValue !== '' && viewValue.length >= maxLengthValue) {
                                    flashController.registerFlash(attrs.id, "max length reached", this.type, this.defaultFlashLevel);
                                    return false;
                                } else {
                                    flashController.removeFlash(attrs.id, this.type);
                                    return true;
                                }
                                return true;
                            }
                        },
                        minLength: {
                            type: "minLength",
                            defaultFlashLevel: '2',
                            checkValidity: function (modelValue, viewValue) {

                                    var minLengthValue = parseInt(scope.$eval(attrs.ngMinLength) || attrs.minlength, 10);
                                    if (viewValue !== undefined && viewValue !== '' && viewValue.length < minLengthValue) {
                                        flashController.registerFlash(attrs.id, "min length not met", this.type, this.defaultFlashLevel);
                                        return false;
                                    } else {
                                        flashController.removeFlash(attrs.id, this.type);
                                        return true;
                                    }
                                    return true;
                            }
                        },
                        hasPattern: {
                            type: "hasPattern",
                            defaultFlashLevel: '4',
                            checkValidity: function (modelValue, viewValue) {
                                if (viewValue !== undefined && viewValue !== '' && new RegExp(attrs.ngPattern).test(viewValue)) {
                                    flashController.removeFlash(attrs.id, this.type);
                                } else {
                                    flashController.registerFlash(attrs.id, "pattern not passed", this.type, this.defaultFlashLevel);
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
                    };

                    checkAttrs();
                }

            };

        }

    };
});
