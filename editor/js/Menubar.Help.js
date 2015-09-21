/**
 * @author mrdoob / http://mrdoob.com/
 */

Menubar.Help = function ( editor ) {

	var container = new UI.Panel();
	container.setClass( 'menu' );

	var title = new UI.Panel();
	title.setClass( 'title' );
	title.setTextContent("Info");
	// title.setBackground('#E6E6E6 url(http://localhost:8000/GITTY/MYVR/editor/imgs/toolbar-07.png)');
	// title.setBackgroundRepeat("no-repeat");
	// title.setBackgroundSize("50px, 100px");
	// title.setTextContent( 'Info' );
	container.add( title );

	var options = new UI.Panel();
	options.setClass( 'options' );
	container.add( options );

	// Source code

	var option = new UI.Panel();
	option.setClass( 'option' );
	option.setTextContent( 'Source code' );
	option.onClick( function () {

		window.open( 'https://github.com/mrdoob/three.js/tree/master/editor', '_blank' )

	} );
	options.add( option );

	// About

	var option = new UI.Panel();
	option.setClass( 'option' );
	option.setTextContent( 'About' );
	option.onClick( function () {

		window.open( 'http://threejs.org', '_blank' );

	} );
	options.add( option );

	return container;

};
