
angular.module('angularFlashyValidator').directive('validate', function ($http, $timeout) {
    return{
        restrict: 'A',
        require: ['^flashy', 'ngModel'],
        controller: function ($scope) {},
        compile: function (tElement, tAttrs) {
            return {
                pre: function (scope, element, attrs, ctrl) {},
                post: function (scope, element, attrs, ctrl) {
                    var filters, flashController = ctrl[0], modelController = ctrl[1], title = (attrs.title ? attrs.title + ' field ' : "Field ??? ");

                    /**
                     * Print a console message when title or attribute are not present.
                     * Both title and id are needed for validation.
                     * id - part of the unique flash identifier
                     * title - used for flash message
                     */
                    try {
                        if (!attrs.title) {
                            throw 'Title attribute not present. Default flash message will not work as expected.';
                        }
                        if (!attrs.id) {
                            throw 'Id attribute not present. Flash identification will not work as expected.';
                        }

                    } catch (err) {
                        console.log(err);
                    }

                    /**
                     * Trigger validation manually ( when a button is pressed ).
                     */
                    attrs.$observe('validate', function (value) {
                        if (value) {
                            modelController.$validate();
                        }
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
                        //checked for type because min and max are also used for number, date input type
                        if (attrs.type === 'number' && attrs.max) {
                            if (attrs.max) {
                                modelController.$validators.max = function (modelValue, viewValue) {
                                    return filters["max"].checkValidity(modelValue, viewValue);
                                };
                            }
                            if (attrs.min) {
                                modelController.$validators.min = function (modelValue, viewValue) {
                                    return filters["min"].checkValidity(modelValue, viewValue);
                                };
                            }
                        }
                        //checked for type because min and max are also used for number, date input type
                        if (attrs.type === 'date') {
                            if (attrs.max || attrs.maxDate) {
                                modelController.$validators.maxDate = function (modelValue, viewValue) {
                                    return filters["maxDate"].checkValidity(modelValue, viewValue);
                                };
                            }
                            if (attrs.min || attrs.minDate) {
                                modelController.$validators.minDate = function (modelValue, viewValue) {
                                    return filters["minDate"].checkValidity(modelValue, viewValue);
                                };
                            }
                        }
                    }

                    /**
                     * All filters 
                     * type - used for message ( flash )  identification process 
                     * defaultFlashLevel - default flash level ( implies changes in css used for that flash )
                     * defaultDuration - duration of the flash on screen
                     * checkValidity - $validators pipeline functions - validation logic for each case returning true/false fed to $validators.
                     *     - validation does not pass -> a flash will be registered with the appropriate message
                     *     - validation does pass -> the flash message is removed when pipeline $validators functions are called
                     */
                    filters = {
                        required: {
                            type: "required",
                            defaultFlashLevel: '3',
                            defaultDuration: 15, //not added to flash creation, can be added as last param
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
                            defaultDuration: 15, //not added to flash creation, can be added as last param
                            checkValidity: function (modelValue, viewValue) {
                                var maxLengthValue = parseInt(scope.$eval(attrs.ngMaxLength) || attrs.maxlength, 10);
                                if (viewValue !== undefined && viewValue !== '' && viewValue.length > maxLengthValue) {
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
                            defaultDuration: 15, //not added to flash creation, can be added as last param
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
                            defaultDuration: 15, //not added to flash creation, can be added as last param
                            checkValidity: function (modelValue, viewValue) {
                                if (viewValue !== undefined && viewValue !== '' && new RegExp(attrs.ngPattern).test(viewValue)) {
                                    flashController.removeFlash(attrs.id, this.type);
                                    return true;
                                } else {
                                    flashController.registerFlash(attrs.id, title + "pattern not passed.", this.type, this.defaultFlashLevel);
                                    return false;
                                }
                                return true;
                            }
                        },
                        minDate: {
                            type: "minDate",
                            defaultFlashLevel: '4',
                            defaultDuration: 15, //not added to flash creation, can be added as last param
                            checkValidity: function (modelValue, viewValue) {
                                var minDate = attrs.min || attrs.minDate,
                                        time = Date.parse(viewValue),
                                        minTime = Date.parse(minDate);

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
                            defaultDuration: 15, //not added to flash creation, can be added as last param
                            checkValidity: function (modelValue, viewValue) {
                                var maxDate = attrs.max || attrs.maxDate,
                                        time = Date.parse(viewValue),
                                        maxTime = Date.parse(maxDate);

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
                            defaultDuration: 15, //not added to flash creation, can be added as last param
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
                            defaultDuration: 15, //not added to flash creation, can be added as last param
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
                    //start attribute checking process for validation
                    checkAttrs();
                }

            };

        }

    };
});
