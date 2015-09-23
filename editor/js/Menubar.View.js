/**
 * @author mrdoob / http://mrdoob.com/
 */

Menubar.View = function ( editor ) {

	var container = new UI.Panel();
	container.setClass( 'menu' );

	var title = new UI.Panel();
	title.setClass( 'title' );
	title.setTextContent( 'View' );
	container.add( title );

	var options = new UI.Panel();
	options.setClass( 'options' );
	container.add( options );

	var option = new UI.Panel();
	option.setClass( 'option' );
	option.setTextContent( 'Hide selected ( ' + editor.shortcuts.getKey( 'view/hide' ) +' )' );
	option.onClick( function () {

		editor.hide();

	} );
	options.add( option );

	var option = new UI.Panel();
	option.setClass( 'option' );
	option.setTextContent( 'Unhide All ( ' + editor.shortcuts.getKey( 'view/unhideAll' ) +' )');
		option.onClick( function () {

		editor.unhideAll();

	} );
	options.add( option );

	var option = new UI.Panel();
	option.setClass( 'option' );
	option.setTextContent( 'Isolation Mode ( ' + editor.shortcuts.getKey( 'view/isolate' ) +' )');
	option.onClick( function () {

		editor.isolate();

	} );

	options.add( option );

	return container;

};
