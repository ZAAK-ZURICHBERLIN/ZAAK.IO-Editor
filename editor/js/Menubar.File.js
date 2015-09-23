/**
 * @author mrdoob / http://mrdoob.com/
 */

Menubar.File = function ( editor ) {

	var container = new UI.Panel();
	container.setClass( 'menu' );

	var title = new UI.Panel();
	title.setClass( 'title' );
	title.setTextContent( 'File' );
	container.add( title );

	var options = new UI.Panel();
	options.setClass( 'options' );
	container.add( options );

	// New

	var option = new UI.Panel();
	option.setClass( 'option' );
	option.setTextContent( 'New' );
	option.onClick( function () {

		if ( confirm( 'Any unsaved data will be lost. Are you sure?' ) ) {

			editor.clear();

		}

	} );
	options.add( option );

	//

	options.add( new UI.HorizontalRule() );

	// Import

	var fileInput = document.createElement( 'input' );
	fileInput.type = 'file';
	fileInput.addEventListener( 'change', function ( event ) {

		editor.loader.loadFile( fileInput.files[ 0 ] );

	} );

	var option = new UI.Panel();
	option.setClass( 'option' );
	option.setTextContent( 'Import' );
	option.onClick( function () {

		fileInput.click();

	} );
	options.add( option );

	//

	options.add( new UI.HorizontalRule() );

	// Export Media


	var option = new UI.Panel();
	option.setClass( 'option' );
	option.setTextContent( 'Export Media' );
	option.onClick( function () {

		var images;

		editor.storage.get(function ( state ) {
			
			images = state.scene.images;

			for( var i = 0; i < images.length; i++){

				// var _im = new Image();
				// _im.src = images[i].data64;

				// atob to base64_decode the data-URI
			    var image_data = atob(images[i].data64.split(',')[1]);
			    // Use typed arrays to convert the binary data to a Blob
			    var arraybuffer = new ArrayBuffer(image_data.length);
			    var view = new Uint8Array(arraybuffer);
			    for (var i=0; i<image_data.length; i++) {
			        view[i] = image_data.charCodeAt(i) & 0xff;
			    }
			    try {
			        // This is the recommended method:
			        var blob = new Blob([arraybuffer], {type: 'application/octet-stream'});
			    } catch (e) {
			        // The BlobBuilder API has been deprecated in favour of Blob, but older
			        // browsers don't know about the Blob constructor
			        // IE10 also supports BlobBuilder, but since the `Blob` constructor
			        //  also works, there's no need to add `MSBlobBuilder`.
			        var bb = new (window.WebKitBlobBuilder || window.MozBlobBuilder);
			        bb.append(arraybuffer);
			        var blob = bb.getBlob('application/octet-stream'); // <-- Here's the Blob
			    }

			    // Use the URL object to create a temporary URL
			    var url = (window.webkitURL || window.URL).createObjectURL(blob + "hahaha");
			    location.href = url; // <-- Download!
			}

		} );

	} );
	options.add( option );

	// Export Geometry

	// var option = new UI.Panel();
	// option.setClass( 'option' );
	// option.setTextContent( 'Export Geometry' );
	// option.onClick( function () {

	// 	var object = editor.selected;

	// 	if ( object === null ) {

	// 		alert( 'No object selected.' );
	// 		return;

	// 	}

	// 	var geometry = object.geometry;

	// 	if ( geometry === undefined ) {

	// 		alert( 'The selected object doesn\'t have geometry.' );
	// 		return;

	// 	}

	// 	var output = geometry.toJSON();
	// 	output = JSON.stringify( output, null, '\t' );
	// 	output = output.replace( /[\n\t]+([\d\.e\-\[\]]+)/g, '$1' );

	// 	exportString( output, 'geometry.json' );

	// } );
	// options.add( option );

	// Export Object

	// var option = new UI.Panel();
	// option.setClass( 'option' );
	// option.setTextContent( 'Export Object' );
	// option.onClick( function () {

	// 	var object = editor.selected;

	// 	if ( object === null ) {

	// 		alert( 'No object selected' );
	// 		return;

	// 	}

	// 	var output = object.toJSON();
	// 	output = JSON.stringify( output, null, '\t' );
	// 	output = output.replace( /[\n\t]+([\d\.e\-\[\]]+)/g, '$1' );

	// 	exportString( output, 'model.json' );

	// } );
	// options.add( option );

	// Export Scene

	var option = new UI.Panel();
	option.setClass( 'option' );
	option.setTextContent( 'Export WebVR' );
	option.onClick( function () {

		var output = editor.scene.toJSON();

		// var output = editor.toJSON();
		output = JSON.stringify( output, null, '\t' );
		output = output.replace( /[\n\t]+([\d\.e\-\[\]]+)/g, '$1' );

		console.log(output);

		exportString( output, 'vrScene.json' );

	} );
	options.add( option );

	// Export OBJ

	// var option = new UI.Panel();
	// option.setClass( 'option' );
	// option.setTextContent( 'Export OBJ' );
	// option.onClick( function () {

	// 	var object = editor.selected;

	// 	if ( object === null ) {

	// 		alert( 'No object selected.' );
	// 		return;

	// 	}

	// 	var exporter = new THREE.OBJExporter();

	// 	exportString( exporter.parse( object ), 'model.obj' );

	// } );
	// options.add( option );

	// // Export STL

	// var option = new UI.Panel();
	// option.setClass( 'option' );
	// option.setTextContent( 'Export STL' );
	// option.onClick( function () {

	// 	var exporter = new THREE.STLExporter();

	// 	exportString( exporter.parse( editor.scene ), 'model.stl' );

	// } );
	// options.add( option );

	//

	options.add( new UI.HorizontalRule() );

	// Publish

	var option = new UI.Panel();
	option.setClass( 'option' );
	option.setTextContent( 'Publish' );
	option.onClick( function () {

		var camera = editor.camera;

		var zip = new JSZip();

		zip.file( 'index.html', [

			'<!DOCTYPE html>',
			'<html lang="en">',
			'	<head>',
			'		<title>three.js</title>',
			'		<meta charset="utf-8">',
			'		<meta name="viewport" content="width=device-width, user-scalable=no, minimum-scale=1.0, maximum-scale=1.0">',
			'		<style>',
			'		body {',
			'			margin: 0px;',
			'			overflow: hidden;',
			'		}',
			'		</style>',
			'	</head>',
			'	<body ontouchstart="">',
			'		<script src="js/three.min.js"></script>',
			'		<script src="js/app.js"></script>',
			'		<script>',
			'',
			'			var loader = new THREE.XHRLoader();',
			'			loader.load( \'app.json\', function ( text ) {',
			'',
			'				var player = new APP.Player();',
			'				player.load( JSON.parse( text ) );',
			'				player.setSize( window.innerWidth, window.innerHeight );',
			'				player.play();',
			'',
			'				document.body.appendChild( player.dom );',
			'',
			'				window.addEventListener( \'resize\', function () {',
			'					player.setSize( window.innerWidth, window.innerHeight );',
			'				} );',
			'',
			'			} );',
			'',
			'		</script>',
			'	</body>',
			'</html>'

		].join( '\n' ) );

		//

		var output = editor.toJSON();
		output = JSON.stringify( output, null, '\t' );
		output = output.replace( /[\n\t]+([\d\.e\-\[\]]+)/g, '$1' );

		zip.file( 'app.json', output );

		//

		var manager = new THREE.LoadingManager( function () {

			location.href = 'data:application/zip;base64,' + zip.generate();

		} );

		var loader = new THREE.XHRLoader( manager );
		loader.load( 'js/libs/app.js', function ( content ) {

			zip.file( 'js/app.js', content );

		} );
		loader.load( '../build/three.min.js', function ( content ) {

			zip.file( 'js/three.min.js', content );

		} );

	} );
	options.add( option );

	/*
	// Test

	var option = new UI.Panel();
	option.setClass( 'option' );
	option.setTextContent( 'Test' );
	option.onClick( function () {

		var text = new UI.Text( 'blah' );
		editor.showDialog( text );

	} );
	options.add( option );
	*/


	//

	var exportString = function ( output, filename ) {

		var blob = new Blob( [ output ], { type: 'text/plain' } );
		var objectURL = URL.createObjectURL( blob );

		var link = document.createElement( 'a' );
		link.href = objectURL;
		link.download = filename || 'data.json';
		link.target = '_blank';
		link.click();

	};

	return container;

};
