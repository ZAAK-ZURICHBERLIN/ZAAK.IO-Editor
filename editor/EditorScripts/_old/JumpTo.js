var billboarding = true;
var targetName = '';

var targetPosition;

function init ( event ){

	targetPosition = scene.getObjectByName(targetName).position;
}

function update( event ){
	
	if(billboarding){

		this.quaternion.copy( camera.quaternion );
	
	}

}

function rayHit( event ){

	if(tween !== undefined)
    	tween.stop();

	tween = new TWEEN.Tween(camera.position).to(targetPosition, 20).onComplete(reactivate); 

    tween.start();
	
}