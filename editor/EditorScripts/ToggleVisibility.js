var tarName = "Overlays-2a";

// Do the On/Off
function rayStart( event ) {

	scene.getObjectByName(tarName).visible = !scene.getObjectByName(tarName).visible;
}