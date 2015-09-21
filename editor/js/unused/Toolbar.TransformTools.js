/**
 * @author mrdoob / http://mrdoob.com/
 */

Toolbar.TransformTools = function ( editor ) {

	var signals = editor.signals;

	var container = new UI.Panel();
	container.setClass( 'menu' );
 
	var title = new UI.Panel();
	title.setClass( 'title' );
	// title.setTextContent( 'Transform' );
	title.setBackground('#E6E6E6 url(img/toolbar-02.png)');
	title.setBackgroundRepeat("no-repeat");
	title.setBackgroundSize("50px");
	container.add( title );

	var options = new UI.Panel();
	options.setClass( 'options' );
	container.add( options );

	var option = new UI.Panel();
	option.setClass( 'option' );
	option.setTextContent( 'Translate ( ' + editor.config.getKey( 'shortcuts/transform/move' ) +' )' );
	option.onClick( function () {

		signals.transformModeChanged.dispatch( 'translate' );

	} );
	options.add( option );

	var option = new UI.Panel();
	option.setClass( 'option' );
	option.setTextContent( 'Scale ( ' + editor.config.getKey( 'shortcuts/transform/scale' ) +' )' );
		option.onClick( function () {

		signals.transformModeChanged.dispatch( 'scale' );

	} );
	options.add( option );

	var option = new UI.Panel();
	option.setClass( 'option' );
	option.setTextContent( 'Rotate ( ' + editor.config.getKey( 'shortcuts/transform/rotate' ) +' )' );
	option.onClick( function () {

		signals.transformModeChanged.dispatch( 'rotate' );

	} );

	options.add( option );


	return container;

}
