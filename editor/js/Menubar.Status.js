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
	container.add( title );

	// var loading = new UI.Panel();
	// loading.setClass( 'status' );

	// container.add( loading );

	var saveButton = new UI.Panel();
	saveButton.setClass( 'button' );
	// saveButton.setWidth("300px");
	saveButton.setTextContent( 'Save' );
	saveButton.onClick( function() {

		editor.storage.size( function (size){
					title.setTextContent( "Size : " + size + "/100Mb");
					// title.setWidth(size);

		});

		// console.log(editor.storage.dbSize);
		// title.setTextContent( "Size : " + editor.storage.dbSize + "/100Mb");

		editor.signals.saveProject.dispatch();
		// console.log("savebutton");

	} );
	container.add(saveButton);

	// var title = new UI.Panel();
	// title.setClass( 'title' );
	// title.setTextContent( 'Size: unknown' );
	// container.add( title );

	editor.signals.unsaveProject.add( function () {

		saveButton.setBackgroundColor('crimson').setColor('white').setBorder('none');
		// saveButton.setColor('white');

	} );

	editor.signals.savingStarted.add( function () {

		// title.setTextDecoration( 'underline' );
		saveButton.setBackgroundColor('lightgoldenrodyellow').setColor('darkslategrey');
		//Create a "currently saving overlay"
		// document.getElementById((saveOverlay).style.display = 'initial';

	} );

	editor.signals.savingFinished.add( function () {

		saveButton.setBackgroundColor('lightgreen');
		// 	title.setTextDecoration( 'none' );
		// document.getElementById(saveOverlay).style.display = 'none';

	} );

	return container;

};
