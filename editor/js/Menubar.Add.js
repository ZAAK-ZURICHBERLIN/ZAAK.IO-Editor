/**
 * @author mrdoob / http://mrdoob.com/
 */

Menubar.Add = function ( editor ) {

	var container = new UI.Panel();
	container.setClass( 'menu' );

	var title = new UI.Panel();
	title.setClass( 'title' );
	title.setTextContent( 'Add' );
	container.add( title );

	var options = new UI.Panel();
	options.setClass( 'options' );
	container.add( options );

	//

	var meshCount = 0;
	var lightCount = 0;
	var cameraCount = 0;

	editor.signals.editorCleared.add( function () {

		meshCount = 0;
		lightCount = 0;
		cameraCount = 0;

	} );

	// Group

	var option = new UI.Row();
	option.setClass( 'option' );
	option.setTextContent( 'Group' );
	option.onClick( function () {

		var mesh = new THREE.Group();
		mesh.name = 'Group ' + ( ++ meshCount );

		editor.execute( new AddObjectCommand( mesh ) );

	} );
	options.add( option );

	//

	options.add( new UI.HorizontalRule() );

	// Video Object

	// var option = new UI.Row();
	// option.setClass( 'option' );
	// option.setTextContent( 'VideoPlayer' );
	// option.onClick( function () {

	// 	var varArray = {
	// 	    url: 'images/ttf.mp4',
	//   	};

	// 	var script = { name: 'VideoPlayer', publicVar: varArray, source: "var video;\nvar texture;\nvar isPlaying = false;\n\nfunction init ( event ){\n\n\tvideo = document.createElement('video');\n\tvideo.autoplay = true;\n\tvideo.loop = true;\n\tvideo.width\t= 1920;\n\tvideo.height = 1080;\n\tvideo.src = url;\n\tvideo.load();\n\n\t// create the texture\n\ttexture\t= new THREE.Texture( video );\n\n}\n\nfunction update( event ) {\n\n\tif( video.readyState !== video.HAVE_ENOUGH_DATA )\treturn;\n\t\ttexture.needsUpdate\t= true;\t\n\n\tthis.material = new THREE.MeshStandardMaterial({\n\t\tmap\t: texture\n\t});\n}\n\nfunction rayHit( event ){\n\t\n\tif(isPlaying)\n\t\tvideo.pause();\n\telse\n\t\tvideo.play();\n\t\n\tisPlaying = ! isPlaying;\n}\n\n\nfunction stop ( event ) {\n\t\n\tvideo.pause();\n}"};
	// 	editor.execute( new AddScriptCommand( editor.selected, script ) );

	// } );
	// options.add( option );

	// //Audio
	// var option = new UI.Row();
	// option.setClass( 'option' );
	// option.setTextContent( 'AudioSource' );
	// option.onClick( function () {

	// 	var varArray = {
	// 	    url: 'sound/test.mp3',
	//   	};

	// 	var script = { name: 'AudioSource', publicVar: varArray, source: "var listener = camera.getObjectByName(\"Listener\");\nvar audioSource;\nvar isPlaying = true;\n\nfunction init ( event ){\n\n\tconsole.log(this.name);\n\t\n\taudioSource = new THREE.PositionalAudio(listener);\n\taudioSource.load( url );\n\taudioSource.setRefDistance( 20 );\n\taudioSource.autoplay = isPlaying;\n\tthis.add( audioSource );\n\n}\n\nfunction rayHit( event ){\n\t\n\t \n\tif(isPlaying)\n\t \taudioSource.pause();\n\telse\n\t \taudioSource.play();\n\t\t\n\tisPlaying = !isPlaying;\n\t\n}\n\n\nfunction stop ( event ) {\n\t\n\taudioSource.stop();\n}"};

	// 	editor.execute( new AddScriptCommand( editor.selected, script ) );

	// } );
	// options.add( option );

	// //Move To
	// var option = new UI.Row();
	// option.setClass( 'option' );
	// option.setTextContent( 'Move To' );
	// option.onClick( function () {

	// 	var script = { name: 'MoveTo', source: "var billboarding = true;\n\nfunction update( event ){\n\t\n\tif(billboarding){\n\n\t\tthis.quaternion.copy( camera.quaternion );\n\t\n\t}\n\n}\n\nfunction rayHit( event ){\n\n\tif(tween !== undefined)\n    \ttween.stop();\n\n    var newPos = this.position;\n\n\ttween = new TWEEN.Tween(camera.position).to(newPos, 1300).onComplete(reactivate);\n    tween.easing(TWEEN.Easing.Cubic.InOut);\n\n    tween.start();\n\t\n}"};

	// 	editor.execute( new AddScriptCommand( editor.selected, script ) );

	// } );
	// options.add( option );

	// //Jump To
	// var option = new UI.Row();
	// option.setClass( 'option' );
	// option.setTextContent( 'Jump To' );
	// option.onClick( function () {

	// 	var varArray = {
	// 	    targetName: 'Target_JumpTo',
	//   	};

	// 	var script = { name: 'JumpTo', publicVar: varArray, source: "var billboarding = true;\n\nvar targetPosition;\n\nfunction init( event ){\n\t\n\tconsole.log(this.name);\n\n\ttargetPosition = scene.getObjectByName(targetName).position;\n}\n\nfunction update( event ){\n\t\n\tif(billboarding){\n\n\t\tthis.quaternion.copy( camera.quaternion );\n\t\n\t}\n}\n\nfunction rayHit( event ){\n\n\tif(tween !== undefined)\n    \ttween.stop();\n\n\ttween = new TWEEN.Tween(camera.position).to(targetPosition, 20).onComplete(reactivate); \n\n    tween.start();\n\t\n}"};

	// 	editor.execute( new AddScriptCommand( editor.selected, script ) );

	// } );
	// options.add( option );

	// //Billboarding
	// var option = new UI.Row();
	// option.setClass( 'option' );
	// option.setTextContent( 'Billboarding' );
	// option.onClick( function () {

	// 	var script = { name: 'Billboarding', source: "var billboarding = true;\n\nfunction update( event ){\n\t\n\tif(billboarding){\n\n\t\tthis.quaternion.copy( camera.quaternion );\n\t\n\t}\n\n}"};

	// 	editor.execute( new AddScriptCommand( editor.selected, script ) );

	// } );
	// options.add( option );

	// //
	var option = new UI.Row();
	option.setClass( 'option' );
	option.setTextContent( 'Library' );
	option.onClick( function () {

        // preview box
        var preview = "<div id='preview' class='modal-box' style='height:100%;width:100%;text-align: center;'> \
        <header style='background-color:#333;'> \
            <a class='js-modal-close close' style='top:1.5%;'>×</a> \
        </header> \
        <div style='height:100%;'> \
            <iframe id='library_iframe' width='100%' height='100%' allowfullscreen src=" + LIBRARY_URL + "></iframe> \
        </div></div>";
        $("body").append($.parseHTML(preview));

        var modal =  ("<div class='modal-overlay js-modal-close'></div>");
        $("body").append(modal);

        $(".modal-overlay").fadeTo(500, 0.9);
        $('#preview').fadeIn();
        // modal helper
        $(".js-modal-close, .modal-overlay").click(function() {
            $(".modal-box, .modal-overlay").fadeOut(500, function() {
            	// player.stop();
                $(".modal-overlay").remove();
                $("#preview").remove();
            });
        });
        $(window).resize(function() {
            $(".modal-box").css({
                top: ($(window).height() - $("#preview").outerHeight()) / 2,
                left: ($(window).width() - $("#preview").outerWidth()) / 2
            });
        });

        $(window).resize();


	} );
	options.add( option );

	

	options.add( new UI.HorizontalRule() );

	// Plane

	var option = new UI.Row();
	option.setClass( 'option' );
	option.setTextContent( 'Plane' );
	option.onClick( function () {

		var geometry = new THREE.PlaneGeometry( 2, 2 );
		var material = new THREE.MeshStandardMaterial();
		var mesh = new THREE.Mesh( geometry, material );
		mesh.name = 'Plane ' + ( ++ meshCount );

		editor.execute( new AddObjectCommand( mesh ) );

	} );
	options.add( option );

	// Box

	var option = new UI.Row();
	option.setClass( 'option' );
	option.setTextContent( 'Box' );
	option.onClick( function () {

		var geometry = new THREE.BoxGeometry( 1, 1, 1 );
		var mesh = new THREE.Mesh( geometry, new THREE.MeshStandardMaterial() );
		mesh.name = 'Box ' + ( ++ meshCount );

		editor.execute( new AddObjectCommand( mesh ) );

	} );
	options.add( option );

	// Circle

	var option = new UI.Row();
	option.setClass( 'option' );
	option.setTextContent( 'Circle' );
	option.onClick( function () {

		var radius = 1;
		var segments = 32;

		var geometry = new THREE.CircleGeometry( radius, segments );
		var mesh = new THREE.Mesh( geometry, new THREE.MeshStandardMaterial() );
		mesh.name = 'Circle ' + ( ++ meshCount );

		editor.execute( new AddObjectCommand( mesh ) );

	} );
	options.add( option );

	// Cylinder

	var option = new UI.Row();
	option.setClass( 'option' );
	option.setTextContent( 'Cylinder' );
	option.onClick( function () {

		var radiusTop = 1;
		var radiusBottom = 1;
		var height = 2;
		var radiusSegments = 32;
		var heightSegments = 1;
		var openEnded = false;

		var geometry = new THREE.CylinderGeometry( radiusTop, radiusBottom, height, radiusSegments, heightSegments, openEnded );
		var mesh = new THREE.Mesh( geometry, new THREE.MeshStandardMaterial() );
		mesh.name = 'Cylinder ' + ( ++ meshCount );

		editor.execute( new AddObjectCommand( mesh ) );

	} );
	options.add( option );

	// Sphere
	var option = new UI.Row();
	option.setClass( 'option' );
	option.setTextContent( 'Sphere' );
	option.onClick( function () {

		var radius = 1;
		var widthSegments = 32;
		var heightSegments = 16;
		var phiStart = 0;
		var phiLength = Math.PI * 2;
		var thetaStart = 0;
		var thetaLength = Math.PI;

		var geometry = new THREE.SphereGeometry( radius, widthSegments, heightSegments, phiStart, phiLength, thetaStart, thetaLength );
		var mesh = new THREE.Mesh( geometry, new THREE.MeshStandardMaterial() );
		mesh.name = 'Sphere ' + ( ++ meshCount );

		editor.execute( new AddObjectCommand( mesh ) );

	} );
	options.add( option );

	// Icosahedron

	var option = new UI.Row();
	option.setClass( 'option' );
	option.setTextContent( 'Icosahedron' );
	option.onClick( function () {

		var radius = 1;
		var detail = 2;

		var geometry = new THREE.IcosahedronGeometry( radius, detail );
		var mesh = new THREE.Mesh( geometry, new THREE.MeshStandardMaterial() );
		mesh.name = 'Icosahedron ' + ( ++ meshCount );

		editor.execute( new AddObjectCommand( mesh ) );

	} );
	options.add( option );

	// Torus

	var option = new UI.Row();
	option.setClass( 'option' );
	option.setTextContent( 'Torus' );
	option.onClick( function () {

		var radius = 2;
		var tube = 1;
		var radialSegments = 32;
		var tubularSegments = 12;
		var arc = Math.PI * 2;

		var geometry = new THREE.TorusGeometry( radius, tube, radialSegments, tubularSegments, arc );
		var mesh = new THREE.Mesh( geometry, new THREE.MeshStandardMaterial() );
		mesh.name = 'Torus ' + ( ++ meshCount );

		editor.execute( new AddObjectCommand( mesh ) );

	} );
	options.add( option );

	// TorusKnot

	var option = new UI.Row();
	option.setClass( 'option' );
	option.setTextContent( 'TorusKnot' );
	option.onClick( function () {

		var radius = 2;
		var tube = 0.8;
		var radialSegments = 64;
		var tubularSegments = 12;
		var p = 2;
		var q = 3;
		var heightScale = 1;

		var geometry = new THREE.TorusKnotGeometry( radius, tube, radialSegments, tubularSegments, p, q, heightScale );
		var mesh = new THREE.Mesh( geometry, new THREE.MeshStandardMaterial() );
		mesh.name = 'TorusKnot ' + ( ++ meshCount );

		editor.execute( new AddObjectCommand( mesh ) );

	} );
	options.add( option );

	/*
	// Teapot

	var option = new UI.Row();
	option.setClass( 'option' );
	option.setTextContent( 'Teapot' );
	option.onClick( function () {

		var size = 50;
		var segments = 10;
		var bottom = true;
		var lid = true;
		var body = true;
		var fitLid = false;
		var blinnScale = true;

		var material = new THREE.MeshStandardMaterial();

		var geometry = new THREE.TeapotBufferGeometry( size, segments, bottom, lid, body, fitLid, blinnScale );
		var mesh = new THREE.Mesh( geometry, material );
		mesh.name = 'Teapot ' + ( ++ meshCount );

		editor.addObject( mesh );
		editor.select( mesh );

	} );
	options.add( option );
	*/

	// Sprite

	var option = new UI.Row();
	option.setClass( 'option' );
	option.setTextContent( 'Sprite' );
	option.onClick( function () {

		var sprite = new THREE.Sprite( new THREE.SpriteMaterial() );
		sprite.name = 'Sprite ' + ( ++ meshCount );

		editor.execute( new AddObjectCommand( sprite ) );

	} );
	options.add( option );

	//

	options.add( new UI.HorizontalRule() );

	// PointLight

	var option = new UI.Row();
	option.setClass( 'option' );
	option.setTextContent( 'PointLight' );
	option.onClick( function () {

		var color = 0xffffff;
		var intensity = 1;
		var distance = 0;

		var light = new THREE.PointLight( color, intensity, distance );
		light.name = 'PointLight ' + ( ++ lightCount );

		editor.execute( new AddObjectCommand( light ) );

	} );
	options.add( option );

	// SpotLight

	var option = new UI.Row();
	option.setClass( 'option' );
	option.setTextContent( 'SpotLight' );
	option.onClick( function () {

		var color = 0xffffff;
		var intensity = 1;
		var distance = 0;
		var angle = Math.PI * 0.1;
		var exponent = 10;

		var light = new THREE.SpotLight( color, intensity, distance, angle, exponent );
		light.name = 'SpotLight ' + ( ++ lightCount );
		light.target.name = 'SpotLight ' + ( lightCount ) + ' Target';

		light.position.set( 5, 10, 7.5 );

		editor.execute( new AddObjectCommand( light ) );

	} );
	options.add( option );

	// DirectionalLight

	var option = new UI.Row();
	option.setClass( 'option' );
	option.setTextContent( 'DirectionalLight' );
	option.onClick( function () {

		var color = 0xffffff;
		var intensity = 1;

		var light = new THREE.DirectionalLight( color, intensity );
		light.name = 'DirectionalLight ' + ( ++ lightCount );
		light.target.name = 'DirectionalLight ' + ( lightCount ) + ' Target';

		light.position.set( 5, 10, 7.5 );

		editor.execute( new AddObjectCommand( light ) );

	} );
	options.add( option );

	// HemisphereLight

	var option = new UI.Row();
	option.setClass( 'option' );
	option.setTextContent( 'HemisphereLight' );
	option.onClick( function () {

		var skyColor = 0x00aaff;
		var groundColor = 0xffaa00;
		var intensity = 1;

		var light = new THREE.HemisphereLight( skyColor, groundColor, intensity );
		light.name = 'HemisphereLight ' + ( ++ lightCount );

		light.position.set( 0, 10, 0 );

		editor.execute( new AddObjectCommand( light ) );

	} );
	options.add( option );

	// AmbientLight

	var option = new UI.Row();
	option.setClass( 'option' );
	option.setTextContent( 'AmbientLight' );
	option.onClick( function() {

		var color = 0x222222;

		var light = new THREE.AmbientLight( color );
		light.name = 'AmbientLight ' + ( ++ lightCount );

		editor.execute( new AddObjectCommand( light ) );

	} );
	options.add( option );

	//

	options.add( new UI.HorizontalRule() );

	// PerspectiveCamera

	var option = new UI.Row();
	option.setClass( 'option' );
	option.setTextContent( 'PerspectiveCamera' );
	option.onClick( function() {

		var camera = new THREE.PerspectiveCamera( 50, 1, 1, 10000 );
		camera.name = 'PerspectiveCamera ' + ( ++ cameraCount );

		editor.execute( new AddObjectCommand( camera ) );

	} );
	options.add( option );

	return container;

}
