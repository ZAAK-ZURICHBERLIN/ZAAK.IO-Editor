/**
 * @author mrdoob / http://mrdoob.com/
 */

Menubar.Edit = function ( editor ) {

	var container = new UI.Panel();
	container.setClass( 'menu' );

	var title = new UI.Panel();	
	title.setClass( 'title' );
	title.setTextContent( 'Edit' );
	container.add( title );

	var options = new UI.Panel();
	options.setClass( 'options' );
	container.add( options );


	//Undo
	var option = new UI.Panel();
	option.setClass( 'option' );
	option.setTextContent( 'Undo ( ' + editor.shortcuts.getKey( 'history/undo' ) +' )' );
	option.onClick( function () {


		editor.undo();

	} );
	options.add( option );	

	//Redo
	var option = new UI.Panel();
	option.setClass( 'option' );
	option.setTextContent( 'Redo ( ' + editor.shortcuts.getKey( 'history/redo' ) +' )' );
	option.onClick( function () {

		editor.redo();

	} );
	options.add( option );

	// Clear History

	var option = new UI.Row();
	option.setClass( 'option' );
	option.setTextContent( 'Clear History' );
	option.onClick( function () {

		if ( confirm( 'The Undo/Redo History will be cleared. Are you sure?' ) ) {

			editor.history.clear();

		}

	} );
	options.add( option );


	options.add( new UI.HorizontalRule() );

	//Translate
	var option = new UI.Panel();

	editor.signals.historyChanged.add( function () {

		var history = editor.history;

		undo.setClass( 'option' );
		redo.setClass( 'option' );

		if ( history.undos.length == 0 ) {

			undo.setClass( 'inactive' );

		}

		if ( history.redos.length == 0 ) {

			redo.setClass( 'inactive' );

		}

	} );

	// ---

	options.add( new UI.HorizontalRule() );

	// Translate
	var option = new UI.Panel();
	option.setClass( 'option' );
	option.setTextContent( 'Translate ( ' + editor.shortcuts.getKey( 'transform/move' ) +' )' );
	option.onClick( function () {

		signals.transformModeChanged.dispatch( 'translate' );

	} );
	options.add( option );

	//Scale
	var option = new UI.Panel();
	option.setClass( 'option' );
	option.setTextContent( 'Scale ( ' + editor.shortcuts.getKey( 'transform/scale' ) +' )' );
		option.onClick( function () {

		signals.transformModeChanged.dispatch( 'scale' );


	} );
	options.add( option );


	//Rotate
	var option = new UI.Panel();
	option.setClass( 'option' );
	option.setTextContent( 'Rotate ( ' + editor.shortcuts.getKey( 'transform/rotate' ) +' )' );
	option.onClick( function () {

		signals.transformModeChanged.dispatch( 'rotate' );

	} );
	options.add( option );

	options.add( new UI.HorizontalRule() );


	//TODO: Put the action to a different place
	var option = new UI.Panel();
	option.setClass( 'option' );
	option.setTextContent( 'Clone ( ' + editor.shortcuts.getKey( 'edit/clone' ) +' )');
	option.onClick( function () {


		// var object = editor.selected;

		// if ( object.parent === undefined ) return; // avoid cloning the camera or scene

		// object = object.clone();

		// editor.addObject( object );
		// editor.select( object );
		editor.cloneObject();

	} );
	options.add( option );

	//TODO: Put the action to a different place
	var option = new UI.Panel();
	option.setClass( 'option' );
	option.setTextContent( 'Delete ( X )' );
	option.onClick( function () {

		editor.destoryCurrent();

	} );
	options.add( option );


	options.add( option );
	

	return container;

};
