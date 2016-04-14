/**
 * @author mrdoob / http://mrdoob.com/
 */

Sidebar.Project = function ( editor ) {

	var config = editor.config;
	var signals = editor.signals;

	var rendererTypes = {

		'WebGLRenderer': THREE.WebGLRenderer,
		'CanvasRenderer': THREE.CanvasRenderer,
		'SVGRenderer': THREE.SVGRenderer,
		'SoftwareRenderer': THREE.SoftwareRenderer,
		'RaytracingRenderer': THREE.RaytracingRenderer

	};

	var container = new UI.Panel();
	container.setBorderTop( '0' );
	container.setPaddingTop( '20px' );

	// class

	var options = {};

	for ( var key in rendererTypes ) {

		if ( key.indexOf( 'WebGL' ) >= 0 && System.support.webgl === false ) continue;

		options[ key ] = key;

	}

	var rendererTypeRow = new UI.Row();
	var rendererType = new UI.Select().setOptions( options ).setWidth( '150px' ).onChange( function () {

		var value = this.getValue();

		config.setKey( 'project/renderer', value );

		updateRenderer();

	} );

	rendererTypeRow.add( new UI.Text( 'Renderer' ).setWidth( '90px' ) );
	rendererTypeRow.add( rendererType );

	container.add( rendererTypeRow );

	if ( config.getKey( 'project/renderer' ) !== undefined ) {

		rendererType.setValue( config.getKey( 'project/renderer' ) );

	}

	// antialiasing

	var rendererPropertiesRow = new UI.Row();
	rendererPropertiesRow.add( new UI.Text( '' ).setWidth( '90px' ) );

	var rendererAntialias = new UI.THREE.Boolean( config.getKey( 'project/renderer/antialias' ), 'antialias' ).onChange( function () {

		config.setKey( 'project/renderer/antialias', this.getValue() );
		updateRenderer();

	} );
	rendererPropertiesRow.add( rendererAntialias );

	// shadow

	var rendererShadows = new UI.THREE.Boolean( config.getKey( 'project/renderer/shadows' ), 'shadows' ).onChange( function () {

		config.setKey( 'project/renderer/shadows', this.getValue() );
		updateRenderer();

	} );
	rendererPropertiesRow.add( rendererShadows );

	container.add( rendererPropertiesRow );

	// VR

	var vrRow = new UI.Row();
	var vr = new UI.Checkbox( config.getKey( 'project/vr' ) ).setLeft( '100px' ).onChange( function () {

		config.setKey( 'project/vr', this.getValue() );
		// updateRenderer();

	} );

	vrRow.add( new UI.Text( 'VR' ).setWidth( '90px' ) );
	vrRow.add( vr );

	container.add( vrRow );
	container.add( new UI.Break() );

	//bg
	
	var bgColorRow = new UI.Panel();
	var bgColor = new UI.Color().setHexValue( editor.config.getKey('backgroundColor'));
	bgColor.onChange( function () {
		signals.bgColorChanged.dispatch( bgColor.getHexValue() );

	} );

	bgColorRow.add( new UI.Text( 'Background color' ).setWidth( '90px' ) );
	bgColorRow.add( bgColor );

	container.add( bgColorRow );

	// fog

	var updateFogParameters = function () {

		var near = fogNear.getValue();
		var far = fogFar.getValue();
		var density = fogDensity.getValue();

		signals.fogParametersChanged.dispatch( near, far, density );

	};

	var fogTypeRow = new UI.Row();
	var fogType = new UI.Select().setOptions( {

		'None': 'None',
		'Fog': 'Linear',
		'FogExp2': 'Exponential'

	} ).setWidth( '150px' );
	fogType.onChange( function () {

		var type = fogType.getValue();
		signals.fogTypeChanged.dispatch( type );

		refreshFogUI();

	} );

	fogTypeRow.add( new UI.Text( 'Fog' ).setWidth( '90px' ) );
	fogTypeRow.add( fogType );

	container.add( fogTypeRow );

	// fog color

	var fogColorRow = new UI.Row();
	fogColorRow.setDisplay( 'none' );

	var fogColor = new UI.Color().setValue( '#aaaaaa' )
	fogColor.onChange( function () {

		signals.fogColorChanged.dispatch( fogColor.getHexValue() );

	} );

	fogColorRow.add( new UI.Text( 'Fog color' ).setWidth( '90px' ) );
	fogColorRow.add( fogColor );

	container.add( fogColorRow );

	// fog near

	var fogNearRow = new UI.Row();
	fogNearRow.setDisplay( 'none' );

	var fogNear = new UI.Number( 1 ).setWidth( '60px' ).setRange( 0, Infinity ).onChange( updateFogParameters );

	fogNearRow.add( new UI.Text( 'Fog near' ).setWidth( '90px' ) );
	fogNearRow.add( fogNear );

	container.add( fogNearRow );

	var fogFarRow = new UI.Row();
	fogFarRow.setDisplay( 'none' );

	// fog far

	var fogFar = new UI.Number( 5000 ).setWidth( '60px' ).setRange( 0, Infinity ).onChange( updateFogParameters );

	fogFarRow.add( new UI.Text( 'Fog far' ).setWidth( '90px' ) );
	fogFarRow.add( fogFar );

	container.add( fogFarRow );

	// fog density

	var fogDensityRow = new UI.Row();
	fogDensityRow.setDisplay( 'none' );

	var fogDensity = new UI.Number( 0.00025 ).setWidth( '60px' ).setRange( 0, 0.1 ).setPrecision( 5 ).onChange( updateFogParameters );

	fogDensityRow.add( new UI.Text( 'Fog density' ).setWidth( '90px' ) );
	fogDensityRow.add( fogDensity );

	container.add( fogDensityRow );

	//

	var refreshUI = function () {

		var scene = editor.scene;

		if ( scene.fog ) {

			fogColor.setHexValue( scene.fog.color.getHex() );

			if ( scene.fog instanceof THREE.Fog ) {

				fogType.setValue( "Fog" );
				fogNear.setValue( scene.fog.near );
				fogFar.setValue( scene.fog.far );

			} else if ( scene.fog instanceof THREE.FogExp2 ) {

				fogType.setValue( "FogExp2" );
				fogDensity.setValue( scene.fog.density );

			}

		} else {

			fogType.setValue( "None" );

		}

		refreshFogUI();

	};

	var refreshFogUI = function () {

		var type = fogType.getValue();

		fogColorRow.setDisplay( type === 'None' ? 'none' : '' );
		fogNearRow.setDisplay( type === 'Fog' ? '' : 'none' );
		fogFarRow.setDisplay( type === 'Fog' ? '' : 'none' );
		fogDensityRow.setDisplay( type === 'FogExp2' ? '' : 'none' );

	};

	refreshUI();

	// events

	signals.sceneGraphChanged.add( refreshUI );


	//

	function updateRenderer() {

		createRenderer( rendererType.getValue(), rendererAntialias.getValue(), rendererShadows.getValue() );

	}

	function createRenderer( type, antialias, shadows ) {

		if ( type === 'WebGLRenderer' && System.support.webgl === false ) {

			type = 'CanvasRenderer';

		}

		rendererPropertiesRow.setDisplay( type === 'WebGLRenderer' ? '' : 'none' );

		var renderer = new rendererTypes[ type ]( { antialias: antialias } );
		if ( shadows && renderer.shadowMap ) renderer.shadowMap.enabled = true;
		signals.rendererChanged.dispatch( renderer );

	}

	createRenderer( config.getKey( 'project/renderer' ), config.getKey( 'project/renderer/antialias' ), config.getKey( 'project/renderer/shadows' ) );

	return container;

}
