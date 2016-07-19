/**
 * @author dforrer / https://github.com/dforrer
 * Developed as part of a project at University of Applied Sciences and Arts Northwestern Switzerland (www.fhnw.ch)
 */

Sidebar.History = function ( editor ) {

	var signals = editor.signals;

	var config = editor.config;

	var history = editor.history;

	

	var container = new UI.CollapsiblePanel();
	container.setCollapsed( editor.config.getKey( 'ui/sidebar/history/collapsed' ) );
	container.onCollapsedChange( function ( boolean ) {

		editor.config.setKey( 'ui/sidebar/history/collapsed', boolean );

	} );

	container.addStatic( new UI.Text( 'HISTORY' ) );


	// Checkbox 'Save History'

	var saveHistorySpan = new UI.Span().setPosition( 'absolute' ).setRight( '8px' );
	var saveHistoryCheckbox = new UI.Checkbox( config.getKey( 'project/history/stored' ) ).onChange( function () {

		config.setKey( 'project/history/stored', this.getValue() );
		var saveHistory = this.getValue();

		if ( saveHistory ) {

			alert( 'The history will be preserved across sessions.\nThis can have an impact on performance when working with textures.' );

			var lastUndoCmd = history.undos[ history.undos.length - 1 ];
			var lastUndoId = ( lastUndoCmd !== undefined ) ? lastUndoCmd.id : 0;
			editor.history.enableSerialization( lastUndoId );

		} else {

			signals.historyChanged.dispatch();

		}

	} );

	saveHistorySpan.add( saveHistoryCheckbox );

	saveHistorySpan.onClick( function ( event ) {

		event.stopPropagation(); // Avoid panel collapsing

	} );

	container.addStatic( saveHistorySpan );

	container.add( new UI.Break() );

	var ignoreObjectSelectedSignal = false;

	var outliner = new UI.Outliner( editor );
	outliner.onChange( function () {

		ignoreObjectSelectedSignal = true;

		editor.history.goToState( parseInt( outliner.getValue() ) );

		ignoreObjectSelectedSignal = false;

	} );
	outliner.onDblClick( function () {

		//editor.focusById( parseInt( outliner.getValue() ) );

	} );
	container.add( outliner );

	//

	var refreshUI = function () {

		var options = [];
		var enumerator = 1;

		function buildOption( object ) {

			var option = document.createElement( 'div' );
			option.value = object.id;

			return option;

		}

		( function addObjects( objects ) {

			for ( var i = 0, l = objects.length; i < l; i ++ ) {

				var object = objects[ i ];

				var option = buildOption( object );
				option.innerHTML = '&nbsp;' + object.name;

				options.push( option );

			}

		} )( history.undos );


		( function addObjects( objects, pad ) {

			for ( var i = objects.length - 1; i >= 0; i -- ) {

				var object = objects[ i ];

				var option = buildOption( object );
				option.innerHTML = '&nbsp;' + object.name;
				option.style.opacity = 0.3;

				options.push( option );

			}

		} )( history.redos, '&nbsp;' );

		outliner.setOptions( options );

	};

	refreshUI();

	// events

	signals.editorCleared.add( refreshUI );

	signals.historyChanged.add( refreshUI );
	signals.historyChanged.add( function ( cmd ) {

		outliner.setValue( cmd !== undefined ? cmd.id : null );

	} );


	return container;

};
