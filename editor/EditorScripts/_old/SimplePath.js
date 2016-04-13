//initialisation from dummy objects
var allPathElements = [];

//Actual real value
var pathPositions;
var path;

//Is the path currently active
var isMoving = false;

//Loop Path
// var currentTime = 0;
// var loopTime = 10 * 1000;

//Directional Path
//The tween that smoothly translates t on a directional path
var pathTween;
var currPathPos;

//Movement values
var pathMoveTime = 8; //seconds

//Inputs
var keyPressed = false;
var touchPressed = false;

function init( event ) {
	
	this.traverse( function ( child ){
		
		// if(child.name.split('_')[0] === "Path"){
		
		allPathElements.push(child);
		// }
	});
	
	//Sort from alpha numerical
	allPathElements.sort(function(a, b) { 		
		 return (a.name.toLowerCase() > b.name.toLowerCase()) ? 1 : -1;
	});

	//
	allPaths[i].traverse( function ( child2 ){
			
		if(child2 !== this){

			pathPositions.push(new THREE.Vector3(child2.position.x, child2.position.y, child2.position.z));
		}

	});

	addPath(pathPositions);
	
	allPathElements.traverse(function ( child ){
		scene.remove( child );
	});
			
	
	
}

function addPath(_spline){

  var _path;

  var _geometry = new THREE.Geometry();

  for ( var i = 0; i < 200; i ++ ) {

    _geometry.vertices.push( new THREE.Vector3() );

  }

  _path = new THREE.CatmullRomCurve3( _spline );
  _path.type = 'catmullrom';
  _path.tension = 0.0;
  _path.mesh = new THREE.Line( _geometry.clone(), new THREE.LineBasicMaterial( {
    color: 0x000000,
    opacity: 0.0,
    transparent:true,
    linewidth: 1
  } ) );
  _path.mesh.castShadow = true;

  path = _path;
  scene.add( path.mesh );

}

function update( event ) {

	var change = event.delta;
	
	if(isNaN(change))
		return;

	
	if( keyPressed ){
		
		//Loop
		currentTime = currentTime + change;
	
		var t = ( currentTime % loopTime ) / loopTime;
		var pos = paths[0].getPointAt( t );
		
		camera.position.copy( pos );

	}else{
	
	}

	//pathMovement
	if(isMoving){
    	var pos = path.getPointAt( Math.max(currPathPos.x, 0) );
    	camera.position.copy( pos );
  	}
	
}

function rayHit( event ){
	//Start path movement here
}

//Start a tween to move the camera on a path
function cameraTweenStart(){

	if(pathTween !== undefined){
    	pathTween.stop();
	}

  	currPathPos = new THREE.Vector2(0,0);

	pathTween = new TWEEN.Tween(currPathPos).to(new THREE.Vector2( 1, 1 );, pathMoveTime * 1000).onComplete(pathMoveEnd);

	pathTween.easing(TWEEN.Easing.Cubic.InOut);

  	pathTween.start();

  	isMoving = true;

}



function pathMoveEnd(){

  isMoving = false;

  var pos = path.getPointAt( Math.round(currPathPos.x) );

  camera.position.copy( pos );

  actionEnd();
}

function keydown( event ) {

	if(event.code == "Space")
		keyPressed = true;
}

function keyup( event ) {

	if(event.code == "Space")
		keyPressed = false;
}

function touchstart( event ) {

	touchPressed = true;
}

function toucheend( event ) {

	touchPressed = false;
}
