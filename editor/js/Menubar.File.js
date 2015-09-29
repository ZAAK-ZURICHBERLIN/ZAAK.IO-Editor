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
            App.Helper.New();

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

	var exportString = function ( output, filename ) {

		var blob = new Blob( [ output ], { type: 'text/plain' } );
		var objectURL = URL.createObjectURL( blob );

		link.href = objectURL;
		link.download = filename || 'data.json';
		link.target = '_blank';

		var event = document.createEvent("MouseEvents");
		event.initMouseEvent(
			"click", true, false, window, 0, 0, 0, 0, 0
			, false, false, false, false, 0, null
		);
		link.dispatchEvent(event);

	};

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
