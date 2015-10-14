/**
 * @author mrdoob / http://mrdoob.com/
 */

Toolbar.Actions = function ( editor ) {

	var signals = editor.signals;

	//Transform

	var container = new UI.Panel();
	container.setClass( 'menu' );

	// var icon = new UI.Panel();
	// icon.setClass( 'title' )
	// container.add( icon );
 
	var title = new UI.Panel();
	title.setClass( 'title' );
	// title.setTextContent( 'Edit' );
	title.setBackground('#E6E6E6 url(img/toolbar-07.png)');
	title.setBackgroundRepeat("no-repeat");
	title.setBackgroundSize("50px");
	container.add( title );

	var options = new UI.Panel();
	options.setClass( 'options' );
	container.add( options );

	// var option = new UI.Panel();
	// option.setClass( 'option' );
	// option.setTextContent( 'Translate' );
	// option.onClick( function () {

	// 	signals.transformModeChanged.dispatch( 'translate' );

	// } );
	// options.add( option );

	// Clone

	var option = new UI.Panel();
	option.setClass( 'option' );
	option.setTextContent( 'Clone' );
	option.onClick( function () {

		var object = editor.selected;

		if ( object.parent === undefined ) return; // avoid cloning the camera or scene

		object = object.clone();

		editor.addObject( object );
		editor.select( object );

	} );
	options.add( option );

	// Delete

	var option = new UI.Panel();
	option.setClass( 'option' );
	option.setTextContent( 'Delete ( X )' );
	option.onClick( function () {
	
		var object = editor.selected;

		if ( confirm( 'Delete ' + object.name + '?' ) === false ) return;

		var parent = object.parent;
		editor.removeObject( object );
		editor.select( parent );

	} );
	options.add( option );



	return container;

}
