var url = 'video/sam.mp4';

//
var video;
var texture;

function init ( event ){

	video = document.createElement('video');
	video.setAttribute("webkit-playsinline","");
	video.setAttribute("playsinline","");
	video.autoplay = true;
	video.loop = true;
	video.width	= 1920;
	video.height = 1080;
	video.src = url;
	video.load();

	// create the texture
	texture	= new THREE.VideoTexture( video );
	// expose texture as this.texture
	
	video.play();

}

function update( event ) {

	if( video.readyState !== video.HAVE_ENOUGH_DATA )	return;
		texture.needsUpdate	= true;	

	this.material	= new THREE.MeshBasicMaterial({
		map	: texture
	});
}

function stop ( event ) {

	video.pause();
}