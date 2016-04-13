var allPaths = [];
var paths = [];

var keyPressed = false;
var touchPressed = false;

var currentTime = 0;
var loopTime = 10 * 1000;


function init( event ) {
	
	scene.traverse( function ( child ){
		
		if(child.name.split('_')[0] === "Path"){
		
			allPaths.push(child);
		}
	});
	
	allPaths.sort(function(a, b) { 		
		 return (a.name.toLowerCase() > b.name.toLowerCase()) ? 1 : -1;
	});

	

	for(var i = 0; i < allPaths.length; i++){
		
		var _path = [];
		
		allPaths[i].traverse( function ( child2 ){
			
			if(child2 !== allPaths[i]){

				_path.push(new THREE.Vector3(child2.position.x, child2.position.y, child2.position.z));
			}

		});
		
		addPath(_path);
		
		if(allPaths[i].name.split('_')[2] == 'x')
			pathEnds.push(i);
		
	}

	
	for(var ii = 0; ii < allPaths.length; ii++){
		
		allPaths[ii].traverse(function ( child ){
				scene.remove( child );
			});
			
	}
	
}

function addPath(_spline){

  var path;

  var _geometry = new THREE.Geometry();

  for ( var i = 0; i < 200; i ++ ) {

    _geometry.vertices.push( new THREE.Vector3() );

  }

  path = new THREE.CatmullRomCurve3( _spline );
  path.type = 'catmullrom';
  path.tension = 0.0;
  path.mesh = new THREE.Line( _geometry.clone(), new THREE.LineBasicMaterial( {
    color: 0x000000,
    opacity: 0.0,
    transparent:true,
    linewidth: 1
  } ) );
  path.mesh.castShadow = true;
  
  paths.push( path );
  scene.add( path.mesh );

}

function update( event ) {
	
	var franky = 0

	if( keyPressed ){
		
		currentTime = currentTime + event.delta;
	
		var t = ( currentTime % loopTime ) / loopTime;
		var pos = paths[0].getPointAt( t );
		
		camera.position.copy( pos );
	}
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
