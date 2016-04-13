var positions = [ new THREE.Vector3( 289.76843686945404, 452.51481137238443, 56.10018915737797 ),
            new THREE.Vector3( -53.56300074753207, 171.49711742836848, -14.495472686253045 ),
            new THREE.Vector3( -91.40118730204415, 176.4306956436485, -6.958271935582161 ),
            new THREE.Vector3( -383.785318791128, 491.1365363371675, 47.869296953772746 ) ];

var path
var tTween;

var pathMove = false;

var currPathPos = new THREE.Vector2(0.0,0.0);

var direction = false;
var ARC_SEGMENTS = 200;

function init( event ) {

  var _geometry = new THREE.Geometry();

  for ( var i = 0; i < 200; i ++ ) {

    _geometry.vertices.push( new THREE.Vector3() );

  }

  path = new THREE.CatmullRomCurve3( positions );
  console.log(path);
  path.type = 'chordal';
  path.mesh = new THREE.Line( _geometry.clone(), new THREE.LineBasicMaterial( {
    color: 0x000000,
    opacity: 0.0,
    transparent:true,
    linewidth: 1
  } ) );
  path.mesh.castShadow = true;

  
  
}

function update( event ) {


  if(pathMove){
    var pos = path.getPointAt( Math.max(currPathPos.x, 0) );
    camera.position.copy( pos );
  }

}

function rayHit( event ) {
  
  if(tTween !== undefined)
    tTween.stop();
  
  currPathPos = new THREE.Vector2(0.0,0.0); 

  var toone = new THREE.Vector2( 1, 1 );

  // console.log(toone);
  pathMove = true;

  tTween = new TWEEN.Tween(currPathPos).to(toone, 13000).onComplete(function end(){
    pathMove = false;
  });
  tTween.easing(TWEEN.Easing.Cubic.InOut);

  tTween.start();

}