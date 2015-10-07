/**
 * @author mrdoob / http://mrdoob.com/
 */

Menubar.Status = function ( editor ) {

	var container = new UI.Panel();
	container.setClass( 'menu right' );

	// var checkbox = new UI.Checkbox( editor.config.getKey( 'autosave' ) );
	// checkbox.onChange( function () {

	// 	var value = this.getValue();

	// 	editor.config.setKey( 'autosave', value );

	// 	if ( value === true ) {

	// 		editor.signals.sceneGraphChanged.dispatch();

	// 	}

	// } );
	// container.add( checkbox );

	var title = new UI.Panel();
	title.setClass( 'title' );
	title.setTextContent( 'Size: unknown' );

	editor.storage.size( function (size){

				var _size = (size !== null) ? size : "0";
				console.log(size);
				title.setTextContent( "Size : " + _size/10 + "/50Mb");
				// title.setWidth(size);

		});

	container.add( title );

	// var loading = new UI.Panel();
	// loading.setClass( 'status' );

	// container.add( loading );

	var saveButton = new UI.Panel();
	saveButton.setClass( 'button' );
	// saveButton.setWidth("300px");
	saveButton.setTextContent( 'Save' );
	saveButton.onClick( function() {

		editor.signals.saveProject.dispatch();


	} );
	container.add(saveButton);

	// var title = new UI.Panel();
	// title.setClass( 'title' );
	// title.setTextContent( 'Size: unknown' );
	// container.add( title );

	editor.signals.unsaveProject.add( function () {
		// e05e60 / saving : #333 / save : #2cbb84

		saveButton.setBackgroundColor('#e05e60').setColor('white').setBorder('none');
		// saveButton.setBackgroundColor('crimson').setColor('white').setBorder('none');

		// saveButton.setColor('white');

	} );

	editor.signals.savingStarted.add( function () {

		// title.setTextDecoration( 'underline' );
		saveButton.setBackgroundColor('#f2f2f2').setColor('darkslategrey');
		//Create a "currently saving overlay"
		// document.getElementById((saveOverlay).style.display = 'initial';

	} );

	editor.signals.savingFinished.add( function () {

		saveButton.setBackgroundColor('#2cbb84');
		
		editor.storage.size( function (size){
			title.setTextContent( "Size : " + size/10 + "/50Mb");

		});
	} );

	return container;

};
