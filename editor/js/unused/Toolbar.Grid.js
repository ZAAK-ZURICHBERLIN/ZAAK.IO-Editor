/**
 * @author mrdoob / http://mrdoob.com/
 */

Toolbar.Grid = function ( editor ) {

	var signals = editor.signals;

	var container = new UI.Panel();
	container.setClass( 'menu' );
 
	var title = new UI.Panel();
	title.setClass( 'title' );
	title.setTextContent( 'Grid' );
	container.add( title );

	// // grid

	var grid = new UI.Number( 25 ).onChange( update );
	grid.dom.style.width = '42px';
	container.add( new UI.Text( 'Grid: ' ) );
	container.add( grid );

	var snap = new UI.Checkbox( false ).onChange( update );
	container.add( snap );
	container.add( new UI.Text( 'snap' ) );

	var local = new UI.Checkbox( false ).onChange( update );
	container.add( local );
	container.add( new UI.Text( 'local' ) );

	var showGrid = new UI.Checkbox().onChange( update ).setValue( true );
	container.add( showGrid );
	container.add( new UI.Text( 'show' ) );

	function update() {

		signals.snapChanged.dispatch( snap.getValue() === true ? grid.getValue() : null );
		signals.spaceChanged.dispatch( local.getValue() === true ? "local" : "world" );
		signals.showGridChanged.dispatch( showGrid.getValue() );

	}


	return container;

}
