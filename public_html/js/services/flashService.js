angular.module('angularFlashyValidator').service('FlashService',function(){
   
   var listeners = {};
   
   this.registerListener = function(key,callbackFunction){
       listeners[key] = callbackFunction;
   };
   
   this.addFlash = function(id,text,type,level){
       console.log(listeners);
       listeners["ctrl"].registerFlash(id,text,type,level);
   };
   
   this.removeFlash = function(id){ //maybe we can do this with the fadeout??
        listeners["remove"](id);
   };
    
});


