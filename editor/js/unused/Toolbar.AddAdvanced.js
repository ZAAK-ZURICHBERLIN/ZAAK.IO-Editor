/**
 * @author mrdoob / http://mrdoob.com/
 */

Toolbar.AddAdvanced = function ( editor ) {

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

	// Text

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

	options.add( option );

	return container;

}
