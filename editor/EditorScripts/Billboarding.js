function update( event ){
	
	//Rotate this object to always look at the camera.
	this.quaternion.copy( camera.quaternion );
	
}
