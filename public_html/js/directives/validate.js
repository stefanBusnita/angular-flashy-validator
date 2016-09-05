
angular.module('angularFlashyValidator').directive('validate', function ($http, $timeout) {
    return{
        restrict: 'A',
        require: ['^flashy', 'ngModel'],
        controller: function ($scope) {},
        compile: function (tElement, tAttrs) {
            return {
                pre: function (scope, element, attrs, ctrl) {
                    $http.get('json/messages.json')
                            .then(function (res) {
                                scope.message = res.data;
                            });
                },
                post: function (scope, element, attrs, ctrl) {
                    var filters, flashController = ctrl[0], modelController = ctrl[1], title = attrs.title + ' field ';


                    attrs.$observe('validate', function (value) {
                        console.log(value);
                    });

                    /**
                     * Function in which registration of all pipeline functions for $validators are set
                     * according to the presence of certain validation tags included.
                     */
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
                        if (attrs.minlength || attrs.ngMinLength) {
                            modelController.$validators.minLength = function (modelValue, viewValue) {
                                return filters["minLength"].checkValidity(modelValue, viewValue);
                            };
                        }
                        if (attrs.maxlength || attrs.ngMaxLength) {
                            modelController.$validators.maxLength = function (modelValue, viewValue) {
                                return filters["maxLength"].checkValidity(modelValue, viewValue);
                            };
                        }

                        if (attrs.type === 'number' && attrs.min) {
                            modelController.$validators.min = function (modelValue, viewValue) {
                                return filters["min"].checkValidity(modelValue, viewValue);
                            };
                        }

                        if (attrs.type === 'number' && attrs.max) {
                            modelController.$validators.max = function (modelValue, viewValue) {
                                return filters["max"].checkValidity(modelValue, viewValue);
                            };
                        }

                        if (attrs.type === 'date' && attrs.min || attrs.minDate) {
                            modelController.$validators.minDate = function (modelValue, viewValue) {
                                return filters["minDate"].checkValidity(modelValue, viewValue);
                            };
                        }
                        ;

                        if (attrs.type == 'date' && attrs.max || attrs.maxDate) {
                            modelController.$validators.maxDate = function (modelValue, viewValue) {
                                return filters["maxDate"].checkValidity(modelValue, viewValue);
                            };
                        }
                    }
                    ;

                    /**
                     * All filters 
                     * defaultFlashLevel, defaultDuration - flash info for validation message duration + level (flash type)
                     * checkValidity - $validators pipeline functions - validation logic for each case returning true/false fed to $validators.
                     * validation does not pass, a flash will be registered with the appropriate message
                     * validation does pass, the flash message is removed.
                     */
                    filters = {
                        required: {
                            type: "required",
                            defaultFlashLevel: '3',
                            defaultDuration: 15,
                            checkValidity: function (modelValue, viewValue) {
                                if (scope.$eval(attrs.ngRequired) || attrs.required) {
                                    if (viewValue === '' || viewValue === undefined) {
                                        flashController.registerFlash(attrs.id, title + "is required.", this.type, this.defaultFlashLevel);
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
                            defaultDuration: 15,
                            checkValidity: function (modelValue, viewValue) {
                                var maxLengthValue = parseInt(scope.$eval(attrs.ngMaxLength) || attrs.maxlength, 10);
                                if (viewValue !== undefined && viewValue !== '' && viewValue.length >= maxLengthValue) {
                                    flashController.registerFlash(attrs.id, title + "max length reached or exceded.", this.type, this.defaultFlashLevel);
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
                            defaultDuration: 15,
                            checkValidity: function (modelValue, viewValue) {
                                var minLengthValue = parseInt(scope.$eval(attrs.ngMinLength) || attrs.minlength, 10);
                                if (viewValue !== undefined && viewValue !== '' && viewValue.length < minLengthValue) {
                                    flashController.registerFlash(attrs.id, title + "min length not met.", this.type, this.defaultFlashLevel);
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
                            defaultDuration: 15,
                            checkValidity: function (modelValue, viewValue) {
                                if (viewValue !== undefined && viewValue !== '' && new RegExp(attrs.ngPattern).test(viewValue)) {
                                    flashController.removeFlash(attrs.id, this.type);
                                    return true;
                                } else {
                                    flashController.registerFlash(attrs.id, title + "field pattern not passed.", this.type, this.defaultFlashLevel);
                                    return false;
                                }
                                return true;
                            }
                        },
                        minDate: {
                            type: "minDate",
                            defaultFlashLevel: '4',
                            defaultDuration: 15,
                            checkValidity: function (modelValue, viewValue) {
                                var minDate = attrs.min || attrs.minDate;
                                var time = Date.parse(viewValue);
                                var minTime = Date.parse(minDate);

                                if (time < minTime) {
                                    flashController.registerFlash(attrs.id, title + "min date is " + minDate + ".", this.type, this.defaultFlashLevel);
                                    return false;
                                } else {
                                    flashController.removeFlash(attrs.id, this.type);
                                    return true;
                                }

                                return true;
                            }
                        },
                        maxDate: {
                            type: "maxDate",
                            defaultFlashLevel: '4',
                            defaultDuration: 15,
                            checkValidity: function (modelValue, viewValue) {
                                var maxDate = attrs.max || attrs.maxDate;
                                var time = Date.parse(viewValue);
                                var maxTime = Date.parse(maxDate);

                                if (time > maxTime) {
                                    flashController.registerFlash(attrs.id, title + "max date is " + maxDate + ".", this.type, this.defaultFlashLevel);
                                    return false;
                                } else {
                                    flashController.removeFlash(attrs.id, this.type);
                                    return true;
                                }

                                return true;

                            }
                        },
                        min: {
                            type: "min",
                            defaultFlashLevel: '2',
                            defaultDuration: 15,
                            checkValidity: function (modelValue, viewValue) {
                                if (parseInt(viewValue) < parseInt(attrs.min)) {
                                    flashController.registerFlash(attrs.id, title + "min value is " + attrs.min + ".", this.type, this.defaultFlashLevel);
                                    return false;
                                } else {
                                    flashController.removeFlash(attrs.id, this.type);
                                    return true;
                                }

                                return true;
                            }
                        },
                        max: {
                            type: "max",
                            defaultFlashLevel: '2',
                            defaultDuration: 15,
                            checkValidity: function (modelValue, viewValue) {
                                if (parseInt(viewValue) > parseInt(attrs.max)) {
                                    flashController.registerFlash(attrs.id, title + "max value is " + attrs.max + ".", this.type, this.defaultFlashLevel);
                                    return false;
                                } else {
                                    flashController.removeFlash(attrs.id, this.type);
                                    return true;
                                }

                                return true;
                            }
                        }
                    };

                    checkAttrs();
                }

            };

        }

    };
});
