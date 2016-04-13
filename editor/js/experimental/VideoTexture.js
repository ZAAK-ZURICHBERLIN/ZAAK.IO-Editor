var VideoTexture = function( _url, _autoplay, _loop ){
	

 //  	var ifrm = document.createElement('iframe');
	// ifrm.setAttribute('id', 'player'); // assign an id
	// ifrm.setAttribute('src', _url);
	// ifrm.width = 1920;
	// ifrm.height = 1080;
	// ifrm.zIndex = '-1000';

	// document.getElementById('viewport').appendChild(ifrm); // to place at end of document



	// create the video element
	var video = document.createElement('video');
	video.crossOrigin = 'anonymus';
	video.autoplay = _autoplay;
	video.loop = _loop;
	video.src = _url;
	// video.type="video/youtube";
	video.width	= 1920;
	video.height = 1080;
	// video.width = 512;
	// video.height = 256;

	// document.getElementById('video1').append(videoSource);

	console.log(video);
	
	video.load();
	// expose video as this.video
	this.video	= video;


	// create the texture
	var texture	= new THREE.Texture( video );
	// expose texture as this.texture
	this.texture	= texture;

	/**
	 * update the object
	 */
	this.update	= function(){
		if( video.readyState !== video.HAVE_ENOUGH_DATA )	return;
		texture.needsUpdate	= true;		
	}

	/**
	 * destroy the object
	 */
	this.destroy	= function(){
		video.pause();
	}
	
}