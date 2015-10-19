/**
 * @author mrdoob / http://mrdoob.com/
 */

var Menubar = function ( editor ) {

	var container = new UI.Panel();
	container.setId( 'menubar' );

	container.add( new Menubar.File( editor ) );
	container.add( new Menubar.Edit( editor ) );
	container.add( new Menubar.Add( editor ) );
	container.add( new Menubar.Light( editor ) );
	container.add( new Menubar.Navigation( editor ) );
	container.add( new Menubar.View( editor ) );
	// container.add( new Menubar.Play( editor ) );
	container.add( new Menubar.Plus( editor ) );

	container.add( new Menubar.Status( editor ) );
    container.add( new Menubar.Preview( editor ) );

	return container;

};
