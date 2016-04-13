//The url of the audioFile
var url = 'sound/test.mp3';
var autoplay = true;
var distance = 20;

//Don't change these
var audioSource;

function init ( event ){

	audioSource = new THREE.PositionalAudio(camera.getObjectByName('Listener'));
	audioSource.load( url );
	audioSource.setRefDistance( distance );
	audioSource.autoplay = autoplay;
	this.object.add( audioSource );

}

function rayStart( event ){
		 
	if(audioSource.isPlaying)
	 	audioSource.pause();
	else
	 	audioSource.play();
		
	
}

function stop ( event ) {
	
	audioSource.stop();
}