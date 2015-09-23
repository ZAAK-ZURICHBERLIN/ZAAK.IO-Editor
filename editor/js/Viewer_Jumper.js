/**
 * @author mrdoob / http://mrdoob.com/
 */
var Viewer_Jumper = function(){

	var maxLookTime = 0.8;

	var tempDeactivated = null;
	var tempLookAtObject;
}

Viewer_Jumper.prototype = {

  raycasting: function raycasting(){

    if(!raycastingActive)
      return;

    //Set ray to forward vector from object
    var vector = new THREE.Vector3( 0, 0, -1 );
    vector.applyQuaternion( camera.quaternion );

    raycaster.set( camera.position, vector.normalize() ); 

    // calculate objects intersecting the picking ray
    var intersects = raycaster.intersectObjects( scene.children, true );

    if(intersects.length == 0){

      console.log("timeReset");
      lookAtTime = 0.0;
      tempLookAtObject = null;

      return;
    }

    //Create an array that just contains all Targets to not
    // get stuck by particles and overlaying wireframes
    var intersectsClean = [];
    for(var iClean = 0; iClean < intersects.length; iClean++){

      var _pointerName = intersects[iClean].object.name.split('_');

       // console.log(_pointerName);

      if(_pointerName[0] == "Pointer" ){intersectsClean.push(intersects[iClean]);}
    
       if(_pointerName[0] == "MoveTo" ){intersectsClean.push(intersects[iClean]);}
    }

    for ( var i = 0; i < intersectsClean.length; i++ ) {  

      if(tempLookAtObject != null )
        console.log( tempLookAtObject.name + " _ " + intersectsClean[i].object.name );

      if(tempLookAtObject == intersectsClean[i].object){

        lookAtTime += currDelta;

        if(lookAtTime > maxLookTime){
          
          console.log("overtimeReset");
          lookAtTime = 0.0;

          tempLookAtObject = null;

          var _targetType = intersectsClean[i].object.name.split('_')[0];
          var _targetObject;

          if(_targetType == "MoveTo"){

            _targetObject = intersectsClean[i].object;

          } else {

            var _targetName = intersectsClean[i].object.name.split('_')[1];
            _targetObject = scene.getObjectByName( "Target_" + _targetName );
         
          }

          if(_targetObject != null)
              hitObject(_targetObject, _targetType);
          else
            console.log("Target not Found");
          }

      } else {

          tempLookAtObject = intersectsClean[i].object;
          lookAtTime = 0.0;
        }

      if(intersectsClean.length == 0){


         console.log("hardreset");
        lookAtTime = 0.0;

      }  
    }
  },

 hitObject: function(_hitObject, _jumpType){

    var newPos = _hitObject.position;

    var _vector = new THREE.Vector3();
    _vector.setFromMatrixPosition( _hitObject.matrixWorld );

    newPos = _vector;

    if(_jumpType == "MoveTo"){

       var tween = new TWEEN.Tween(camera.position).to(newPos, 3000);

    } else {

       var tween = new TWEEN.Tween(camera.position).to(newPos, 10);
    }

    tween.start();
  }