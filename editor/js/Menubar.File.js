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

	var option = new UI.Row();
	option.setClass( 'option' );
	option.setTextContent( 'New' );
	option.onClick( function () {

		if ( confirm( 'Any unsaved data will be lost. Are you sure?' ) ) {

			editor.clear();
            // App.Helper.New();

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

	var option = new UI.Row();
	option.setClass( 'option' );
	option.setTextContent( 'Import' );
	option.onClick( function () {

		fileInput.click();

	} );
	options.add( option );


	// var option = new UI.Panel();
	// option.setClass( 'option' );
	// option.setTextContent( 'Reload from LocalStorage' );
	// option.onClick( function () {


	// 	var file = null;
	// 	var hash = window.location.hash;

	// 	if ( hash.substr( 1, 4 ) === 'app=' ) file = hash.substr( 5 );
	// 	if ( hash.substr( 1, 6 ) === 'scene=' ) file = hash.substr( 7 );

	// 	if ( file !== null ) {

	// 		if ( confirm( 'Any unsaved data will be lost. Are you sure?' ) ) {

	// 			var loader = new THREE.XHRLoader();
	// 			loader.crossOrigin = '';
	// 			loader.load( file, function ( text ) {

	// 				var json = JSON.parse( text );


	// 				editor.clear();
	// 				editor.fromJSON( json );

	// 			} );


	// 		}


	// 	}


	// } );
	// options.add( option );



	//

	options.add( new UI.HorizontalRule() );
	
	// Export Scene

	// var option = new UI.Panel();
	// option.setClass( 'option' );
	// option.setTextContent( 'Export Scene' );
	// option.onClick( function () {

	// 	var output = editor.scene.toJSON();
	// 	output = JSON.stringify( output, null, '\t' );
	// 	output = output.replace( /[\n\t]+([\d\.e\-\[\]]+)/g, '$1' );

	// 	exportString( output, 'scene.json' );

	// } );
	// options.add( option );


	var link = document.createElement( 'a' );
	link.style.display = 'none';
	document.body.appendChild( link ); // Firefox workaround, see #6594

	function save( blob, filename ) {

		link.href = URL.createObjectURL( blob );
		link.download = filename || 'data.json';
		link.click();

		// URL.revokeObjectURL( url ); breaks Firefox...

	}

	function saveString( text, filename ) {

		save( new Blob( [ text ], { type: 'text/plain' } ), filename );

	}

	// Save to Platform

    var option = new UI.Panel();
    option.setClass( 'option' );
    option.setTextContent( 'Publish' );

    option.onClick( function () {
        var output = editor.scene.toJSON();
        App.Helper.Save(output);
    } );
    options.add( option );

	return container;

};
