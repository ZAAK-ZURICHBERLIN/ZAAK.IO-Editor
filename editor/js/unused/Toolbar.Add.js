/**
 * @author mrdoob / http://mrdoob.com/
 */

Toolbar.Add = function ( editor ) {

	var signals = editor.signals;

	var container = new UI.Panel();
	container.setClass( 'menu' );
 
	var title = new UI.Panel();
	title.setClass( 'title' );
	// title.setTextContent( 'Add' );
	title.setBackground('#E6E6E6 url(img/toolbar-01.png)');
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

	// Group

	var option = new UI.Panel();
	option.setClass( 'option' );
	option.setTextContent( 'Group' );
	option.onClick( function () {

		var mesh = new THREE.Group();
		mesh.name = 'Group ' + ( ++ meshCount );

		editor.addObject( mesh );
		editor.select( mesh );

	} );
	options.add( option );

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

	// Icosahedron

	var option = new UI.Panel();
	option.setClass( 'option' );
	option.setTextContent( 'Icosahedron' );
	option.onClick( function () {

		var radius = 75;
		var detail = 2;

		var geometry = new THREE.IcosahedronGeometry( radius, detail );
		var mesh = new THREE.Mesh( geometry, new THREE.MeshPhongMaterial() );
		mesh.name = 'Icosahedron ' + ( ++ meshCount );

		editor.addObject( mesh );
		editor.select( mesh );

	} );
	options.add( option );
	// //

	options.add( new UI.HorizontalRule() );

	// PointLight

	var option = new UI.Panel();
	option.setClass( 'option' );
	option.setTextContent( 'PointLight' );
	option.onClick( function () {

		var color = 0xffffff;
		var intensity = 1;
		var distance = 0;

		var light = new THREE.PointLight( color, intensity, distance );
		light.name = 'PointLight ' + ( ++ lightCount );

		editor.addObject( light );
		editor.select( light );

	} );
	options.add( option );

	// // SpotLight

	// var option = new UI.Panel();
	// option.setClass( 'option' );
	// option.setTextContent( 'SpotLight' );
	// option.onClick( function () {

	// 	var color = 0xffffff;
	// 	var intensity = 1;
	// 	var distance = 0;
	// 	var angle = Math.PI * 0.1;
	// 	var exponent = 10;

	// 	var light = new THREE.SpotLight( color, intensity, distance, angle, exponent );
	// 	light.name = 'SpotLight ' + ( ++ lightCount );
	// 	light.target.name = 'SpotLight ' + ( lightCount ) + ' Target';

	// 	light.position.set( 0.5, 1, 0.75 ).multiplyScalar( 200 );

	// 	editor.addObject( light );
	// 	editor.select( light );

	// } );
	// options.add( option );

	// DirectionalLight

	var option = new UI.Panel();
	option.setClass( 'option' );
	option.setTextContent( 'DirectionalLight' );
	option.onClick( function () {

		var color = 0xffffff;
		var intensity = 1;

		var light = new THREE.DirectionalLight( color, intensity );
		light.name = 'DirectionalLight ' + ( ++ lightCount );
		light.target.name = 'DirectionalLight ' + ( lightCount ) + ' Target';

		light.position.set( 0.5, 1, 0.75 ).multiplyScalar( 200 );

		editor.addObject( light );
		editor.select( light );

	} );
	options.add( option );

	// HemisphereLight

	var option = new UI.Panel();
	option.setClass( 'option' );
	option.setTextContent( 'HemisphereLight' );
	option.onClick( function () {

		var skyColor = 0x00aaff;
		var groundColor = 0xffaa00;
		var intensity = 1;

		var light = new THREE.HemisphereLight( skyColor, groundColor, intensity );
		light.name = 'HemisphereLight ' + ( ++ lightCount );

		light.position.set( 0.5, 1, 0.75 ).multiplyScalar( 200 );

		editor.addObject( light );
		editor.select( light );

	} );
	options.add( option );

	// AmbientLight

	var option = new UI.Panel();
	option.setClass( 'option' );
	option.setTextContent( 'AmbientLight' );
	option.onClick( function() {

		var color = 0x222222;

		var light = new THREE.AmbientLight( color );
		light.name = 'AmbientLight ' + ( ++ lightCount );

		editor.addObject( light );
		editor.select( light );

	} );
	options.add( option );

	//

	options.add( new UI.HorizontalRule() );

	var option = new UI.Panel();
	option.setClass( 'option' );
	option.setTextContent( 'Text' );
	option.onClick( function () {

		var text = "three.js",

				height = 0,
				size = 70,
				hover = 30,

				curveSegments = 6,

				bevelThickness = 2,
				bevelSize = 1.5,
				bevelSegments = 3,
				bevelEnabled = true,

				font = "helvetiker", // helvetiker, optimer, gentilis, droid sans, droid serif
				weight = "normal", // normal bold
				style = "normal"; // normal italic

		textGeo = new THREE.TextGeometry( "New Text", {

					size: size,
					height: height,
					curveSegments: curveSegments,

					font: font,
					weight: weight,
					style: style,

					bevelThickness: bevelThickness,
					bevelSize: bevelSize,
					bevelEnabled: bevelEnabled,

					material: 0,
					extrudeMaterial: 1

				});

		textGeo.computeBoundingBox();
		textGeo.computeVertexNormals();

		// "fix" side normals by removing z-component of normals for side faces
		// (this doesn't work well for beveled geometry as then we lose nice curvature around z-axis)


		var triangleAreaHeuristics = 0.1 * ( height * size );

		for ( var i = 0; i < textGeo.faces.length; i ++ ) {

			var face = textGeo.faces[ i ];

			if ( face.materialIndex == 1 ) {

				for ( var j = 0; j < face.vertexNormals.length; j ++ ) {

					face.vertexNormals[ j ].z = 0;
					face.vertexNormals[ j ].normalize();

				}

				var va = textGeo.vertices[ face.a ];
				var vb = textGeo.vertices[ face.b ];
				var vc = textGeo.vertices[ face.c ];

				var s = THREE.GeometryUtils.triangleArea( va, vb, vc );

				if ( s > triangleAreaHeuristics ) {

					for ( var j = 0; j < face.vertexNormals.length; j ++ ) {

						face.vertexNormals[ j ].copy( face.normal );

					}

				}

			}

		}	

		var centerOffset = -0.5 * ( textGeo.boundingBox.max.x - textGeo.boundingBox.min.x );

		var textMesh1 = new THREE.Mesh( textGeo, new THREE.MeshBasicMaterial({color: 'antiquewhite', needsUpdate: true })  );

		textMesh1.position.x = centerOffset;
		textMesh1.position.y = 30;
		textMesh1.position.z = 0;

		textMesh1.rotation.x = 0;
		textMesh1.rotation.y = Math.PI * 2;

		textMesh1.name = "Text Object";

		editor.addObject( textMesh1 );
		editor.select( textMesh1 );

	} );
	options.add( option );


	// Mediasphere

	var option = new UI.Panel();
	option.setClass( 'option' );
	option.setTextContent( 'Mediasphere' );
	option.onClick( function () {

		//Media Object
		var radius = 40;
		var widthSegments = 15;
		var heightSegments = 15;
		var phiStart = 0;
		var phiLength = Math.PI * 2;
		var thetaStart = 0;
		var thetaLength = Math.PI;

		var geometry = new THREE.SphereGeometry( radius, widthSegments, heightSegments, phiStart, phiLength, thetaStart, thetaLength );
		THREE.ImageUtils.crossOrigin = '';
		var texture = THREE.ImageUtils.loadTexture('http://upload.wikimedia.org/wikipedia/commons/1/18/Rheingauer_Dom%2C_Geisenheim%2C_360_Panorama_%28Equirectangular_projection%29.jpg');
		var mediaObject = new THREE.Mesh( geometry, new THREE.MeshPhongMaterial({map: texture, side: THREE.BackSide, needsUpdate: true}) );

		mediaObject.name = 'MediaSphere';

		editor.addObject( mediaObject );

		//TargetObject
		var radius = 15;
		var widthSegments = 10;
		var heightSegments = 10;
		var phiStart = 0;
		var phiLength = Math.PI * 2;
		var thetaStart = 0;
		var thetaLength = Math.PI;

		var geometry = new THREE.SphereGeometry( radius, widthSegments, heightSegments, phiStart, phiLength, thetaStart, thetaLength );
		var mesh = new THREE.Mesh( geometry, new THREE.MeshNormalMaterial({transparent: true, depthTest: false, depthWrite: false, needsUpdate: true}) );

		mesh.name = 'Target';

		editor.addObject( mesh );
		editor.select( mediaObject );

		editor.moveObject(mesh, mediaObject);

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

		mesh.name = 'Target';

		editor.addObject( mesh );
		editor.select( mesh );

	} );
	options.add( option );

	// Plane

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
