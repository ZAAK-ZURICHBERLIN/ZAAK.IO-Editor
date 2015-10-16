/**
 * @author mrdoob / http://mrdoob.com/
 */

Menubar.Plus = function ( editor ) {

	var container = new UI.Panel();
	container.setClass( 'menu' );

	var title = new UI.Panel();
	title.setClass( 'title' );
	title.setTextContent( 'Exit' );
	title.onClick( function () {

		if ( confirm( 'Do you want to go back to the platform? Any unsaved data will be lost. Are you sure?' ) ) {

			window.open ('http://zaak.io','_self',false)
		}

	} );
	container.add( title );

	// var options = new UI.Panel();
	// options.setClass( 'options' );
	// container.add( options );

	// // Source code

	// var option = new UI.Panel();
	// option.setClass( 'option' );
	// option.setTextContent( 'Return to ZAAK Plus' );
	// option.onClick( function () {

	// 	window.open( 'http://zaak.io' )

	// } );
	// options.add( option );
	return container;

};
