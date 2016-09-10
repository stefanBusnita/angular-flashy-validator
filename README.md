# angular-flashy-validator
A two step general validation process for `ngModel` using angular directives:

	1. Check if the values in the field pass the default given validators
	
	2. Show a coresponding default message with the error.

~Note that the 2 directives work together, the validation directive requires the flash directive to show messages. The flash directive 
can be used separatelly without the validation directive, and accessed via a service in order to show custom messages.

~Note that the provided form for this project is provided in a simplified form, more validators can be added.





I.Description and code examples:

	The directives can be used to validate form inputs (e.g required, min-length e.t.c) providing a unified way of validation for all the 
forms in the application. There are a few default validation methods included for checking length, intervals ( dates and numbers ), patterns, and field requirement.
There is also the possibility to provide custom messages, via a service. This functionality does not require adding 
the validation directive. 

Provide the location of the flash ( message ) directive. Preferably on the <body> tag.

```html
<body ng-app="angularFlashyValidator" flashy>
```

Next add a container for the flash messages.


```html
<div id="flashesContainer"></div>
```

Element prerequisites (A field that is going to be validated has to fulfill the following requirements ) : 
 
	1. Be part of a `<form>`
	
	2. Include the `validate` directive attribute on the element that needs validation.
		a.The validation process is debounced by using `ngModelOptions` value. If not used the validation is done while user is typing(view->model), or at model change (model->view)
		b.The `validate` directive tag can include a interpolated value e.g validate="{{validate}}". When the value is true, the validation is triggered.
		If the messages dissapears after a given time, another validation process can be triggered for example via a button pressed action, which changes the `validate` value to true.
		
	3. Element to be validated has to contain one of the following attributes used in the validation process:
	`min-length`, `max-length`, `ng-maxlength`, `ng-minlength`, `min`, `max`, `ng-required`, `ng-pattern`, `min-date`, `max-date`
	
	4. A title attribute should be included on the field because the default message used the attribute:
	'Number of indents field is required.', where 'Number of indents' is the title attribute value of the element.
	
	5. An element must be provided with an id attribute, whose value is used in the flash creation process as the id of the flash.
	A flash is identified by the following key (id,type), where `id` can be any string and `type` is a description. 
	As a result we can have 3 flashes for a field with the following keys : 
	(`noField`,`required`), (`noField`,`minlength`), (`noField`,`minDate`) e.t.c for a certain id, which in the default validation case is the value of the `id` attribute.

An example of a final element can look like this : 

```html
<form novalidate="" name="testForm">
                <div class="form-group" ng-class="{'has-error' : testForm.tstInputName.$error.isRequired}">
                    <label>Write stuff here</label>
                    <input class="form-control" type="text" name="tstInputName" 
                           id="tstInput" 
                           ng-model="test.inputVal" 
                           title="Write stuff here"
                           ng-required="firstVal+secondVal==3"
                           ng-pattern="/^$|^(0|[1-9][0-9]*)$/"
                           minlength="4"
                           maxlength="6"
                           ng-model-options="{debounce: 300}"
                           validate="{{validate}}"/>
                </div>
</form>
```
                
The validation process will start after 300 ms time in which the user has stopped typing in that particular field.


An example of a default validation for minLength, from the `validate` directive : 

```javascript
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
}
```
                        
~Note that the `defaultDuration` for the flash message is not used. It can be added as the last param in `registerFlash` function call. 

A custom flash can also be provided at any time and location by using a service provided, called `FlashService`.
Example of a custom flash usage : 

```javascript
angular.module('angularFlashyValidator').controller('TestPageController', function ($scope, FlashService) {
$scope.createRandomFlash = function () {
        FlashService.addFlash("randomID", "this is a random flash", "random", 1, 2);
    };
});
```

~Note that `addFlash` function call has the following parameters(`id`,'text',`type(flash description)`,level(info, warning, danger, success),'duration(if not provided flash will stay on screen)')

II.Motivation:

	This project was created in order to fulfill the need for validation and custom message providing in some projects that include a 
large number of forms that need validation. 
By using `angular-flashy-validator` there was a unified way in which validation was done throughout all the projects, regarding the actual validation and the messages provided by the app. Also code duplication was avoided, as it would obviously clutter projects, making them hard to maintain.

III.Installation:

The `angular-flashy-validator` project is provided as a Netbeans project. 
`Bower` is used as a package manager for this project.
Short overview : 

	1. Install dependencies with `bower install` in the project root.
	
	2. The project is good to go, simply run the index.html file in order to see the test page for the project.

IV.Tests:

	The small complexity of the project did not require the inclusion of `Jasmine` tests ( the popular testing framework for angular apps ).
There is a page for tests included in the project, in which some fields are validated using the provided directive, and messages are shown accordingly.
Run `index.html` file using Netbeans.

Short overview : 

	1. A user can write values in the fields and see the output.
	
	2. There is a `testPageController` provided, thru which some model values are changed in order to view both validation input directions,
	namely `view->model`, `model->view`.  
	Test by pressing one of the two buttons provided: `Change with invalid value from Model -> View` and `Alternate between min or max invalid value from Model -> View`.
	
	3. A simple custom message creation is also shown in the test page. This functionality can be used separatelly, via a service provided
	in the project.
	Test by pressing `Create a random flash with a duration of seconds` button
	
	4. Manual form validation is also a possibility, when all messages dissapear ( if there is a given timeout for messages ) the form can be 
	revalidated for the user. 
	Test by pressing `Validate form` button.

V.Contributors:
@Stefan Busnita 2016

VI.Licence:
The `angular-flashy-validator` project is provided under the MIT licence. 
Please view Licence.md for more information of the MIT licence.
