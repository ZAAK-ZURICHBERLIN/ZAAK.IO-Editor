var url = 'sound/test.mp3';

//
var listener = camera.getObjectByName('Listener');
var audioSource;
var isPlaying = true;

function init ( event ){

	audioSource = new THREE.PositionalAudio(listener);
	audioSource.load( url );
	audioSource.setRefDistance( 20 );
	audioSource.autoplay = isPlaying;
	this.object.add( audioSource );

}

function rayHit( event ){
		 
	if(isPlaying)
	 	audioSource.pause();
	else
	 	audioSource.play();
		
	isPlaying = !isPlaying;
	
}

function stop ( event ) {
	
	audioSource.stop();
}