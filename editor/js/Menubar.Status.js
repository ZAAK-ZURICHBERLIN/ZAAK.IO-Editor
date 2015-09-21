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

	// var title = new UI.Panel();
	// title.setClass( 'title' );
	// title.setTextContent( 'Autosave' );
	// container.add( title );

	var saveButton = new UI.Panel();
	saveButton.setClass( 'button' );
	saveButton.setWidth("292px");
	// saveButton.setMarginLeft("0px");
	// saveButton.setPaddingRight("0px");
	saveButton.setTextContent( 'Save' );
	saveButton.onClick( function() {

		editor.signals.saveProject.dispatch();
		// console.log("savebutton");

	} );
	container.add(saveButton);

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
