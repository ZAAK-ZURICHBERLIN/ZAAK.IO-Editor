/**
 * @author mrdoob / http://mrdoob.com/
 */

Toolbar.AddVR = function ( editor ) {

	var signals = editor.signals;

	var container = new UI.Panel();
	container.setClass( 'menu' );
 
	var title = new UI.Panel();
	title.setClass( 'title' );
	// title.setTextContent( 'Add' );
	title.setBackground('#E6E6E6 url(img/toolbar-05.png)');
	title.setBackgroundRepeat("no-repeat");
	title.setBackgroundSize("50px");
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

	// Plane

	var option = new UI.Panel();
	option.setClass( 'option' );
	option.setTextContent( 'WEB' );
	option.onClick( function () {

		//////////////////////////////////////////////////////////////////////////////////
		//		create THREEx.HtmlMixer	but without any events				//
		//////////////////////////////////////////////////////////////////////////////////
		var mixerContext= new THREEx.HtmlMixer.Context(editor.renderer, editor.scene, editor.camera);

		// handle window resize for mixerContext
		// window.addEventListener('resize', function(){
		// 	mixerContext.rendererCss.setSize( window.innerWidth, window.innerHeight )
		// }, false);

		// console.log(mixerContext);

		//////////////////////////////////////////////////////////////////////////////////
		//		mixerContext configuration and dom attachement
		//////////////////////////////////////////////////////////////////////////////////

	 	 // set up rendererCss
		var rendererCss		= mixerContext.rendererCss;
		rendererCss.setSize( window.innerWidth, window.innerHeight );
		// // set up rendererWebgl
		var rendererWebgl	= mixerContext.rendererWebgl;


		var css3dElement		= rendererCss.domElement;
		css3dElement.style.position	= 'absolute';
		css3dElement.style.top		= '0px';
		css3dElement.style.width	= '100%';
		css3dElement.style.height	= '100%';
		document.getElementById("viewport").appendChild( css3dElement );
		// document.body.appendChild( css3dElement );
		
		var webglCanvas			= rendererWebgl.domElement;
		webglCanvas.style.position	= 'absolute';
		webglCanvas.style.top		= '0px';
		webglCanvas.style.width		= '100%';
		webglCanvas.style.height	= '100%';
		webglCanvas.style.pointerEvents	= 'none';
		css3dElement.appendChild( webglCanvas );
		
		//////////////////////////////////////////////////////////////////////////////////
		//		create a Plane for THREEx.HtmlMixer				//
		//////////////////////////////////////////////////////////////////////////////////
		

		// create the iframe element
		var domElement	= document.createElement('iframe');
		// domElement.src	= 'http://jeromeetienne.github.io/threex/';
		domElement.src	= 'http://killscreendaily.com/';
		domElement.style.border	= 'none';
		// create the plane
		var mixerPlane	= new THREEx.HtmlMixer.Plane(mixerContext, domElement);
		mixerPlane.object3d.scale.multiplyScalar(2);

		editor.mixerContext = mixerContext;

		// console.log("Add");
		// console.log(editor);
		// console.log(mixerPlane.object3d);

		// var url     = 'http://threejs.com';
		// var mixerPlane  = THREEx.HtmlMixer.createPlaneFromIframe(mixerContext, url)
		// scene.add(mixerPlane.object3d)

		editor.addObject( mixerPlane.object3d );
		editor.select( mixerPlane.object3d );

	} );
	options.add( option );	


	// Mediasphere

	var option = new UI.Panel();
	option.setClass( 'option' );
	option.setTextContent( 'Mediasphere' );
	option.onClick( function () {

		//Media Object
		var radius = 120;
		var widthSegments = 64;
		var heightSegments = 64;
		var phiStart = 0;
		var phiLength = Math.PI * 2;
		var thetaStart = 0;
		var thetaLength = Math.PI;

		var geometry = new THREE.SphereGeometry( radius, widthSegments, heightSegments, phiStart, phiLength, thetaStart, thetaLength );
		THREE.ImageUtils.crossOrigin = '';
		var texture = THREE.ImageUtils.loadTexture('http://upload.wikimedia.org/wikipedia/commons/1/18/Rheingauer_Dom%2C_Geisenheim%2C_360_Panorama_%28Equirectangular_projection%29.jpg');
		var mediaObject = new THREE.Mesh( geometry, new THREE.MeshPhongMaterial({map: texture, side: THREE.FrontSide, needsUpdate: true}) );

		mediaObject.name = 'MediaSphere';


		editor.addObject( mediaObject );
		mediaObject.scale.set(-1,1,1);

		//TargetObject
		var radius = 15;
		var widthSegments = 10;
		var heightSegments = 10;
		var phiStart = 0;
		var phiLength = Math.PI * 2;
		var thetaStart = 0;
		var thetaLength = Math.PI;

		var geometry = new THREE.SphereGeometry( radius, widthSegments, heightSegments, phiStart, phiLength, thetaStart, thetaLength );
		var mesh = new THREE.Mesh( geometry, new THREE.MeshNormalMaterial({transparent: true, depthTest: true, depthWrite: true, needsUpdate: true}) );
		// var mesh = new THREE.Mesh( geometry, new THREE.MeshNormalMaterial({transparent: true, depthTest: false, depthWrite: false, needsUpdate: true}) );

		mesh.name = 'Target_name';

		editor.addObject( mesh );
		mesh.scale.set(-1,1,1);
		
		editor.select( mediaObject );

		editor.moveObject(mesh, mediaObject);

	} );
	options.add( option );

	// Cube

	var option = new UI.Panel();
	option.setClass( 'option' );
	option.setTextContent( 'CubeMap' );
	option.onClick( function () {

		//Media Object
		// var cubemap = THREE.ImageUtils.loadTextureCube(urls); // load textures
		// cubemap.format = THREE.RGBFormat;

		//Parent Object
		var radius = 15;
		var widthSegments = 10;
		var heightSegments = 10;
		var phiStart = 0;
		var phiLength = Math.PI * 2;
		var thetaStart = 0;
		var thetaLength = Math.PI;

		var geometry = new THREE.SphereGeometry( radius, widthSegments, heightSegments, phiStart, phiLength, thetaStart, thetaLength );
		var mesh = new THREE.Mesh( geometry, new THREE.MeshNormalMaterial({transparent: true, depthTest: false, depthWrite: false, needsUpdate: true}) );

		mesh.name = 'Target_name';

		editor.addObject( mesh );

		//ShaderMaterial Test

		var urls = [
		    'imgs/cube/pano_2.jpg',
		    'imgs/cube/pano_0.jpg',
		    'imgs/cube/pano_4.jpg',
		    'imgs/cube/pano_5.jpg',
		    'imgs/cube/pano_1.jpg',
		    'imgs/cube/pano_3.jpg',
		  ];

		var shader = THREE.ShaderLib['cube']; // init cube shader from built-in lib
		shader.uniforms['tCube'].value = THREE.ImageUtils.loadTextureCube(urls); // apply textures to shader

		  // create shader material
	 	skyBoxMaterial = new THREE.ShaderMaterial( {
	    	fragmentShader: shader.fragmentShader,
	    	vertexShader: shader.vertexShader,
	    	uniforms: shader.uniforms,
	    	depthWrite: true,
	    	side: THREE.BackSide
	  	});

		var skybox = new THREE.Mesh(
		  new THREE.CubeGeometry(240, 240, 240),
		  skyBoxMaterial 
		);

		editor.addObject(skybox);

		// var _planes = [];

		// for(var i = 0; i < 6; i++){
		// 	var planesGeometry = new THREE.PlaneGeometry( 200, 200, 1, 1 );
		// 	var plane = new THREE.Mesh( planesGeometry, new THREE.MeshBasicMaterial({ needsUpdate: true}) );

		// 	_planes[i] = plane;



		// 	editor.addObject( plane );

		// 	editor.moveObject(plane, mesh);

		// }

		// _planes[0].position.set(100,0,0);
		// _planes[1].position.set(-100,0,0);
		// _planes[2].position.set(0,100,0);
		// _planes[3].position.set(0,-100,0);
		// _planes[4].position.set(0,0,100);
		// _planes[5].position.set(0,0,-100);

		// _planes[0].rotation.set(0,-1.57,0);
		// _planes[1].rotation.set(0,1.57,0);
		// _planes[2].rotation.set(1.57,0,1.57);
		// _planes[3].rotation.set(-1.57,0,-1.57);
		// _planes[4].rotation.set(3.14,0,3.14);
		// _planes[5].rotation.set(0,0,0);

		// _planes[0].name = 'X+';
		// _planes[1].name = 'X-';
		// _planes[2].name = 'Y+';
		// _planes[3].name = 'Y-';
		// _planes[4].name = 'Z+';
		// _planes[5].name = 'Z-';

		

		

		// mesh.name = 'Target_name';

		editor.addObject( mesh );
		editor.select( mesh );

		// editor.moveObject(mesh, mediaObject);

	} );
	options.add( option );


	// SphereTarget

	var option = new UI.Panel();
	option.setClass( 'option' );
	option.setTextContent( 'sphereTarget' );
	option.onClick( function () {

		var radius = 15;
		var widthSegments = 10;
		var heightSegments = 10;
		var phiStart = 0;
		var phiLength = Math.PI * 2;
		var thetaStart = 0;
		var thetaLength = Math.PI;

		var geometry = new THREE.SphereGeometry( radius, widthSegments, heightSegments, phiStart, phiLength, thetaStart, thetaLength );
		var mesh = new THREE.Mesh( geometry, new THREE.MeshNormalMaterial({transparent: true, depthTest: false, depthWrite: false, needsUpdate: true}) );

		mesh.name = 'TargetLocation';

		editor.addObject( mesh );
		editor.select( mesh );

	} );
	options.add( option );

	// Planetarget

	var option = new UI.Panel();
	option.setClass( 'option' );
	option.setTextContent( 'planeTarget' );
	option.onClick( function () {

		var width = 100;
		var height = 100;

		var widthSegments = 1;
		var heightSegments = 1;

		var geometry = new THREE.PlaneGeometry( width, height, widthSegments, heightSegments );
		var material = new THREE.MeshBasicMaterial({side: THREE.DoubleSide, transparent: true, depthTest: false, depthWrite: false, needsUpdate: true});
		var mesh = new THREE.Mesh( geometry, material );
		mesh.name = 'Target';

		editor.addObject( mesh );
		editor.select( mesh );

	} );
	options.add( option );

	return container;

}
