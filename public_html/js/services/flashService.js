angular.module('angularFlashyValidator').service('FlashService',function(){
   
   var listeners = {};
   
   this.registerListener = function(key,callbackFunction){
       listeners[key] = callbackFunction;
   };
   
   this.addFlash = function(id,text,type){
       console.log(listeners);
       listeners["ctrl"].registerFlash(id,text,type);
   };
   
   this.removeFlash = function(id){ //maybe we can do this with the fadeout??
        listeners["remove"](id);
   };
    
});


