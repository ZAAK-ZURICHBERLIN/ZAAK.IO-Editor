/**
 * @author mrdoob / http://mrdoob.com/
 */

Sidebar.Geometry.TextGeometry = function ( signals, object ) {

	var container = new UI.Panel();

	
	var parameters = object.geometry.parameters;
	var newParameters = parameters || {};

	// Font Size
	var sizeRow = new UI.Panel();
	var size = new UI.Number(parameters.data.size).onChange( update);

	sizeRow.add( new UI.Text( 'Font Size' ).setWidth( '90px' ) );
	sizeRow.add( size );

	container.add( sizeRow );

	// Extrusion - change height to a more understandable name
	var depthRow = new UI.Panel();
	var depth = new UI.Number(parameters.data.height).onChange( update);

	depthRow.add( new UI.Text( 'Depth' ).setWidth( '90px' ) );
	depthRow.add( depth );

	container.add( depthRow );

	// Smoothness in curves - do users need to change values like this?
	// var curveSegmentsRow = new UI.Panel();
	// var curveSegments = new UI.Integer(parameters.data.curveSegments).onChange( update);

	// curveSegmentsRow.add( new UI.Text( 'Curve Segments' ).setWidth( '90px' ) );
	// curveSegmentsRow.add( curveSegments );

	// container.add( curveSegmentsRow );

	// Font
	var fontRow = new UI.Panel();
	var font = new UI.Select().setOptions( {

		'helvetiker': 'helvetiker',
		'optimer': 'optimer',
		'gentilis': 'gentilis'

	} ).setWidth( '150px' ).setFontSize( '12px' ).onChange( update );
	fontRow.add( new UI.Text( 'Font' ).setWidth( '90px' ) );
	fontRow.add( font );

	container.add( fontRow );

	// Weight
	var weightRow = new UI.Panel();
	var weight = new UI.Select().setOptions( {

		'normal': 'normal',
		'bold': 'bold'

	} ).setWidth( '150px' ).setFontSize( '12px' ).onChange( update );
	weightRow.add( new UI.Text( 'Weight' ).setWidth( '90px' ) );
	weightRow.add( weight );

	container.add( weightRow );

	// Style - is this even working ( relevant if fonts support it )
	// var styleRow = new UI.Panel();
	// var style = new UI.Select().setOptions( {

	// 	'normal': 'normal',
	// 	'italics': 'italics'

	// } ).setWidth( '150px' ).setFontSize( '12px' ).onChange( update );
	// styleRow.add( new UI.Text( 'Style' ).setWidth( '90px' ) );
	// styleRow.add( style );

	// container.add( styleRow );

	// Text
	var textRow = new UI.Panel();
	var text = new UI.Input(parameters.text).setWidth( '150px' ).setFontSize( '12px' ).onChange( update);

	textRow.add( new UI.Text( 'Text' ).setWidth( '90px' ) );
	textRow.add( text );

	container.add( textRow );

	//

	function update() {

		object.geometry.dispose();
		
		newParameters.size = size.getValue();
		newParameters.height = depth.getValue();
		newParameters.font = font.getValue();
		newParameters.weight = weight.getValue();

		object.geometry = new THREE.TextGeometry(
			text.getValue(),
			newParameters
			
		);

		object.geometry.computeBoundingSphere();

		signals.geometryChanged.dispatch( object );

	}

	return container;

}
