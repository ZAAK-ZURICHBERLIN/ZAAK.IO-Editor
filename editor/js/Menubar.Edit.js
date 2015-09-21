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

		editor.history.undo();

	} );
	options.add( option );	

	//Redo
	var option = new UI.Panel();
	option.setClass( 'option' );
	option.setTextContent( 'Redo ( ' + editor.shortcuts.getKey( 'history/redo' ) +' )' );
	option.onClick( function () {

		editor.history.redo();

	} );
	options.add( option );

	//Translate
	var option = new UI.Panel();
	option.setClass( 'option' );
	option.setTextContent( 'Translate ( ' + editor.shortcuts.getKey( 'transform/move' ) +' )' );
	option.onClick( function () {

		signals.transformModeChanged.dispatch( 'translate' );

	} );

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

	//TODO: Put the action to a different place
	var option = new UI.Panel();
	option.setClass( 'option' );
	option.setTextContent( 'Clone ( ' + editor.shortcuts.getKey( 'edit/cloneObject' ) +' )');
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
	
		// var object = editor.selected;

		// if ( confirm( 'Delete ' + object.name + '?' ) === false ) return;

		// var parent = object.parent;
		// editor.removeObject( object );
		// editor.select( parent );
		editor.destoryCurrent();

	} );
	options.add( option );


	options.add( option );
	

	return container;

};
