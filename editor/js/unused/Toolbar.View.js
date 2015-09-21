/**
 * @author mrdoob / http://mrdoob.com/
 */

Toolbar.View = function ( editor ) {

	var signals = editor.signals;

	//Transform

	var container = new UI.Panel();
	container.setClass( 'menu' );
 
	var title = new UI.Panel();
	title.setClass( 'title' );
	// title.setTextContent( 'View' );
	title.setBackground('#E6E6E6 url(img/toolbar-06.png)');
	title.setBackgroundRepeat("no-repeat");
	title.setBackgroundSize("50px");
	container.add( title );

	var options = new UI.Panel();
	options.setClass( 'options' );
	container.add( options );

	var option = new UI.Panel();
	option.setClass( 'option' );
	option.setTextContent( 'Hide selected ( ' + editor.config.getKey( 'shortcuts/view/hide' ) +' )' );
	option.onClick( function () {

		editor.hide();

	} );
	options.add( option );

	var option = new UI.Panel();
	option.setClass( 'option' );
	option.setTextContent( 'Unhide All ( ' + editor.config.getKey( 'shortcuts/view/unhideAll' ) +' )');
		option.onClick( function () {

		editor.unhideAll();

	} );
	options.add( option );

	var option = new UI.Panel();
	option.setClass( 'option' );
	option.setTextContent( 'Isolation Mode ( ' + editor.config.getKey( 'shortcuts/view/isolate' ) +' )');
	option.onClick( function () {

		editor.isolate();

	} );

	options.add( option );


	return container;

}
