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
	option.setTextContent( 'Plane' );
	option.onClick( function () {

		var width = 200;
		var height = 200;

		var widthSegments = 1;
		var heightSegments = 1;

		var geometry = new THREE.PlaneGeometry( width, height, widthSegments, heightSegments );
		var material = new THREE.MeshPhongMaterial();
		var mesh = new THREE.Mesh( geometry, material );
		mesh.name = 'Plane ' + ( ++ meshCount );

		editor.addObject( mesh );
		editor.select( mesh );

	} );
	options.add( option );

	// // Soundsource
	// var option = new UI.Panel();
	// option.setClass( 'option' );
	// option.setTextContent( 'Soundsource' );
	// option.onClick( function () {

	// 	var source = new THREE.Audio(editor.listener);

	// 	editor.addObject( source );
	// 	editor.select( source );

	// } );
	// options.add( option );

	// Box
	var option = new UI.Panel();
	option.setClass( 'option' );
	option.setTextContent( 'Box' );
	option.onClick( function () {

		var width = 100;
		var height = 100;
		var depth = 100;

		var widthSegments = 1;
		var heightSegments = 1;
		var depthSegments = 1;

		var geometry = new THREE.BoxGeometry( width, height, depth, widthSegments, heightSegments, depthSegments );
		var mesh = new THREE.Mesh( geometry, new THREE.MeshPhongMaterial() );
		mesh.name = 'Box ' + ( ++ meshCount );

		editor.addObject( mesh );
		editor.select( mesh );

	} );
	options.add( option );

	// Cylinder
	var option = new UI.Panel();
	option.setClass( 'option' );
	option.setTextContent( 'Cylinder' );
	option.onClick( function () {

		var radiusTop = 20;
		var radiusBottom = 20;
		var height = 100;
		var radiusSegments = 32;
		var heightSegments = 1;
		var openEnded = false;

		var geometry = new THREE.CylinderGeometry( radiusTop, radiusBottom, height, radiusSegments, heightSegments, openEnded );
		var mesh = new THREE.Mesh( geometry, new THREE.MeshPhongMaterial() );
		mesh.name = 'Cylinder ' + ( ++ meshCount );

		editor.addObject( mesh );
		editor.select( mesh );

	} );
	options.add( option );

	// Sphere
	var option = new UI.Panel();
	option.setClass( 'option' );
	option.setTextContent( 'Sphere' );
	option.onClick( function () {

		var radius = 75;
		var widthSegments = 32;
		var heightSegments = 16;
		var phiStart = 0;
		var phiLength = Math.PI * 2;
		var thetaStart = 0;
		var thetaLength = Math.PI;

		var geometry = new THREE.SphereGeometry( radius, widthSegments, heightSegments, phiStart, phiLength, thetaStart, thetaLength );
		var mesh = new THREE.Mesh( geometry, new THREE.MeshPhongMaterial() );
		mesh.name = 'Sphere ' + ( ++ meshCount );

		editor.addObject( mesh );
		editor.select( mesh );

	} );
	options.add( option );

	
	// // Text
	// var option = new UI.Panel();
	// option.setClass( 'option' );
	// option.setTextContent( 'Text' );
	// option.onClick( function () {

	// 	var text = "three.js",
	// 			height = 20,
	// 			size = 70,
	// 			hover = 30,

	// 			curveSegments = 4,

	// 			bevelThickness = 2,
	// 			bevelSize = 1.5,
	// 			bevelSegments = 3,
	// 			bevelEnabled = true,

	// 			font = "helvetiker", // helvetiker, optimer, gentilis, droid sans, droid serif
	// 			weight = "bold", // normal bold
	// 			style = "normal"; // normal italic



	// 	var textGeo = new THREE.TextGeometry( text, {

	// 		size: size,
	// 		height: height,
	// 		curveSegments: curveSegments,

	// 		font: font,
	// 		weight: weight,
	// 		style: style,

	// 		bevelThickness: bevelThickness,
	// 		bevelSize: bevelSize,
	// 		bevelEnabled: bevelEnabled,

	// 		material: 0,
	// 		extrudeMaterial: 1

	// 	});

	// 	console.log(textGeo);

	// 	textGeo.computeBoundingBox();
	// 	textGeo.computeVertexNormals();

	// 	// "fix" side normals by removing z-component of normals for side faces
	// 	// (this doesn't work well for beveled geometry as then we lose nice curvature around z-axis)

	// 	if ( ! bevelEnabled ) {

	// 		var triangleAreaHeuristics = 0.1 * ( height * size );

	// 		for ( var i = 0; i < textGeo.faces.length; i ++ ) {

	// 			var face = textGeo.faces[ i ];

	// 			if ( face.materialIndex == 1 ) {

	// 				for ( var j = 0; j < face.vertexNormals.length; j ++ ) {

	// 					face.vertexNormals[ j ].z = 0;
	// 					face.vertexNormals[ j ].normalize();

	// 				}

	// 				var va = textGeo.vertices[ face.a ];
	// 				var vb = textGeo.vertices[ face.b ];
	// 				var vc = textGeo.vertices[ face.c ];

	// 				var s = THREE.GeometryUtils.triangleArea( va, vb, vc );

	// 				if ( s > triangleAreaHeuristics ) {

	// 					for ( var j = 0; j < face.vertexNormals.length; j ++ ) {

	// 						face.vertexNormals[ j ].copy( face.normal );

	// 					}

	// 				}

	// 			}

	// 		}

	// 	}

	// 	var centerOffset = -0.5 * ( textGeo.boundingBox.max.x - textGeo.boundingBox.min.x );

	// 	textMesh1 = new THREE.Mesh( textGeo, new THREE.MeshBasicMaterial({color: 'antiquewhite', needsUpdate: true }) );

	// 	textMesh1.position.x = centerOffset;
	// 	textMesh1.position.y = hover;
	// 	textMesh1.position.z = 0;

	// 	textMesh1.rotation.x = 0;
	// 	textMesh1.rotation.y = Math.PI * 2;

	// 	textMesh1.name = "Text Object";

	// 	console.log(textMesh1);

	// 	editor.addObject( textMesh1 );
	// 	editor.select( textMesh1 );

	// } );
	// options.add( option );

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

	return container;

}
