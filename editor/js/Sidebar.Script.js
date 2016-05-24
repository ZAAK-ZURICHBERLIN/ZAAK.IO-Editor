/**
 * @author mrdoob / http://mrdoob.com/
 */

Sidebar.Script = function ( editor ) {

	var signals = editor.signals;

	var container = new UI.CollapsiblePanel();
	container.setCollapsed( editor.config.getKey( 'ui/sidebar/script/collapsed' ) );
	container.onCollapsedChange( function ( boolean ) {

		editor.config.setKey( 'ui/sidebar/script/collapsed', boolean );

	} );
	container.setDisplay( 'none' );

	container.addStatic( new UI.Text( 'Script' ).setTextTransform( 'uppercase' ) );
	container.add( new UI.Break() );

	//

	var scriptsContainer = new UI.Row();
	container.add( scriptsContainer );

	var newScript = new UI.Button( 'New' );
	newScript.onClick( function () {

		var script = { name: 'newScript', source: 'function update( event ) {}' };
		editor.execute( new AddScriptCommand( editor.selected, script ) );

	} );
	container.add( newScript );

	/*
	var loadScript = new UI.Button( 'Load' );
	loadScript.setMarginLeft( '4px' );
	container.add( loadScript );
	*/

	//

	function update() {

		scriptsContainer.clear();

		var object = editor.selected;


		if ( object === null ) {

			return;

		}

		var scripts = editor.scripts[ object.uuid ];

		if ( scripts !== undefined ) {

			for ( var i = 0; i < scripts.length; i ++ ) {

				( function ( object, script ) {

					console.log(script);

					var name = new UI.Text( script.name ).setWidth( '130px' ).setFontSize( '12px' );
					name.onChange( function () {

						editor.execute( new SetScriptValueCommand( editor.selected, script, 'name', this.getValue() ) );

					} );
					scriptsContainer.add( name );

					var edit = new UI.Button( 'Edit' );
					edit.setMarginLeft( '4px' );
					edit.onClick( function () {

						signals.editScript.dispatch( object, script );

					} );
					scriptsContainer.add( edit );

					var remove = new UI.Button( 'Remove' );
					remove.setMarginLeft( '4px' );
					remove.onClick( function () {

						if ( confirm( 'Are you sure?' ) ) {

							editor.execute( new RemoveScriptCommand( editor.selected, script ) );

						}

					} );
					scriptsContainer.add( remove );

					scriptsContainer.add( new UI.Break() );


					// console.log(script.publicVar.length
					for (var key in script.publicVar) {
					  if (script.publicVar.hasOwnProperty(key)) {
					    
						console.log(key);

						var name = new UI.Text( key ).setWidth( '130px' ).setFontSize( '12px' );
						scriptsContainer.add( name );

						var url = new UI.Input(script.publicVar[key]).setWidth( '130px' ).setFontSize( '12px' );
						url.onChange( function () {

							script.publicVar[key] = this.getValue();

						} );
						scriptsContainer.add( url );

					  }
					}

					// if(script.name === "VideoPlayer"){

					// 	var name = new UI.Text( "Video Name" ).setWidth( '130px' ).setFontSize( '12px' );
					// 	scriptsContainer.add( name );


					// 	// var url = new UI.Input(script.publicVar.url).setWidth( '130px' ).setFontSize( '12px' );
					// 	// url.onChange( function () {

					// 	// 	script.publicVar.url = this.getValue();

					// 	// } );
					// 	// scriptsContainer.add( url );

					// 	var videoRow = new UI.Row();
					// 	var videoUpload = new UI.Video().onChange( update );

					// 	videoRow.add( new UI.Text( 'Video' ).setWidth( '90px' ) );
					// 	videoRow.add( videoUpload );

					// 	scriptsContainer.add( videoRow );


					// }

					scriptsContainer.add( new UI.Break() );

				} )( object, scripts[ i ] )

			}

		}

	}

	// signals

	signals.objectSelected.add( function ( object ) {

		if ( object !== null ) {

			container.setDisplay( 'block' );

			update();

		} else {

			container.setDisplay( 'none' );

		}

	} );

	signals.scriptAdded.add( update );
	signals.scriptRemoved.add( update );
	signals.scriptChanged.add( update );

	return container;

};
