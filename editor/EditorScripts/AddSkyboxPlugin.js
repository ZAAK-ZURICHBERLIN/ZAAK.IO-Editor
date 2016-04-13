//The names of all your skyboxes.
var skyboxNames = ["1a", "1b"];
//First to show skybox, id 
var initialSky = 1;
//The color the transition between a skyboxchange will have.
var transitionColor = 0x720fff;


function init ( event ) {
	
	var skyboxes = new Skyboxes(player, skyboxNames, transitionColor, initialSky );
	player.allPlugins.sky = skyboxes;	
}

