var billboarding = true;

function update( event ){
	
	if(billboarding){

		this.quaternion.copy( camera.quaternion );
	
	}

}

function rayHit( event ){

	if(tween !== undefined)
    	tween.stop();

    var newPos = this.position;

	tween = new TWEEN.Tween(camera.position).to(newPos, 1300).onComplete(reactivate);
    tween.easing(TWEEN.Easing.Cubic.InOut);

    tween.start();
	
}