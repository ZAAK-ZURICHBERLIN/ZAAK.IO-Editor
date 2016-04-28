/**
 * @author mrdoob / http://mrdoob.com/
 */

Sidebar.Settings = function ( editor ) {

	var config = editor.config;
	var signals = editor.signals;

	var container = new UI.Panel();
	container.setBorderTop( '0' );
	container.setPaddingTop( '20px' );

	// class

	var options = {
		'css/light.css': 'light',
		'css/dark.css': 'dark'
	};

	var themeRow = new UI.Row();
	var theme = new UI.Select().setWidth( '150px' );
	theme.setOptions( options );

	if ( config.getKey( 'theme' ) !== undefined ) {

		theme.setValue( config.getKey( 'theme' ) );

	}

	theme.onChange( function () {

		var value = this.getValue();

		editor.setTheme( value );
		editor.config.setKey( 'theme', value );

	} );

	themeRow.add( new UI.Text( 'Theme' ).setWidth( '90px' ) );
	themeRow.add( theme );

	// container.add( themeRow );

	//Degree
	var rotOptions = {
		false : 'Radians',
		true: 'Degrees'
	};

	var rotRow = new UI.Row();
	var rotation = new UI.Select().setWidth( '150px' );
	rotation.setOptions( rotOptions );

	if ( config.getKey( 'degree' ) !== undefined ) {

		rotation.setValue( config.getKey( 'degree' ) );

	}

	rotation.onChange( function () {

		var value = this.getValue();

		editor.config.setKey( 'degree', value );

		signals.presetChanged.dispatch();

	} );

	rotRow.add( new UI.Text( 'Rotation' ).setWidth( '90px' ) );
	rotRow.add( rotation );

	container.add( rotRow );

	return container;

};
