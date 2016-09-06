angular.module('angularFlashyValidator').service('FlashService',function(){
   
   var listeners = {};
   
   this.registerListener = function(key,callbackFunction){
       listeners[key] = callbackFunction;
   };
   
   this.addFlash = function(id,text,type,level,duration){
       listeners["ctrl"].registerFlash(id,text,type,level,duration);
   };
   
   this.removeFlash = function(id,type){ //maybe we can do this with the fadeout??
        listeners["ctrl"].removeFlash(id,type);
   };
    
});


