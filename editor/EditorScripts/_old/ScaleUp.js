
var objectName = "FRANK";
var linkedObject;

var sizeIteration = 0.02;
var minSize = 0.1;

function init( event ) {

	linkedObject = scene.getObjectByName( objectName );
}

function rayHit( event ) {

	 TweenMax.to(transphere.size, 0.3, {linkedObject.size - });
}