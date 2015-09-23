/**
 * @author mrdoob / http://mrdoob.com/
 */

var MainEditor = function () {

	this.init();
}

MainEditor.prototype = {


	init: function(){

			window.URL = window.URL || window.webkitURL;
			window.BlobBuilder = window.BlobBuilder || window.WebKitBlobBuilder || window.MozBlobBuilder;

			Number.prototype.format = function (){
				return this.toString().replace(/(\d)(?=(\d{3})+(?!\d))/g, "$1,");
			};
			var editor = new Editor();

			var shortcuts = new EditorShortCuts(editor);

			var viewport = new Viewport( editor );
			document.body.appendChild( viewport.dom );

			var player = new Player( editor );
			document.body.appendChild( player.dom );

			var script = new Script( editor );
			document.body.appendChild( script.dom );

			var toolbar = new Toolbar( editor );
			document.body.appendChild( toolbar.dom );

			var menubar = new Menubar( editor );
			document.body.appendChild( menubar.dom );

			var sidebar = new Sidebar( editor );
			document.body.appendChild( sidebar.dom );

			editor.config.setKey( 'autosave', false ); // Hacky
			editor.setTheme( editor.config.getKey( 'theme' ) );

			editor.storage.init( function () {

				editor.storage.get( function ( state ) {

					if ( state !== undefined ) {

						editor.fromJSON( state );

					}

					var selected = editor.config.getKey( 'selected' );

					if ( selected !== undefined ) {

						editor.selectByUuid( selected );

					}

				} );

				//

				var timeout;

				var sceneChanged = function(){

					editor.signals.unsaveProject.dispatch();

					if ( editor.config.getKey( 'autosave' ) === false ) return;

					// else {
						
					// 	saveState(1000);
						
					// }
					
				};

				var manualSave = function () {

					saveState(1000);
					// console.log("manualSave");
				};

				// var saveState = function ( scene ) {
				var saveState = function ( time ) {

					console.log("h2");

					clearTimeout( timeout );

					timeout = setTimeout( function () {

						editor.signals.savingStarted.dispatch();

						timeout = setTimeout( function () {

							editor.storage.set( editor.toJSON() );

							editor.signals.savingFinished.dispatch();

						}, 100 );

					}, time );

				};

				var signals = editor.signals;

				signals.editorCleared.add( sceneChanged );
				signals.geometryChanged.add( sceneChanged );
				signals.objectAdded.add( sceneChanged );
				signals.objectChanged.add( sceneChanged );
				signals.objectRemoved.add( sceneChanged );
				signals.materialChanged.add( sceneChanged );
				signals.sceneGraphChanged.add( sceneChanged );
				// signals.scriptChanged.add( saveState );
				signals.saveProject.add( manualSave );
			} );

			//

			document.addEventListener( 'dragover', function ( event ) {

				event.preventDefault();
				event.dataTransfer.dropEffect = 'copy';

			}, false );

			document.addEventListener( 'drop', function ( event ) {

				event.preventDefault();

				if ( event.dataTransfer.files.length > 0 ) {

					editor.loader.loadFile( event.dataTransfer.files[ 0 ] );

				}

			}, false );

			document.addEventListener( 'keydown', function ( event ) {

				switch ( event.keyCode ) {

					case 8:
						event.preventDefault(); // prevent browser back
						break;

					default:
						shortcuts.keyCheck( event.keyCode );
						break;
				}

			}, false );

			var onWindowResize = function ( event ) {

				editor.signals.windowResize.dispatch();

			};

			window.addEventListener( 'resize', onWindowResize, false );

			onWindowResize();

			//

			var file = null;
			var hash = window.location.hash;

			if ( hash.substr( 1, 4 ) === 'app=' ) file = hash.substr( 5 );
			if ( hash.substr( 1, 6 ) === 'scene=' ) file = hash.substr( 7 );

			if ( file !== null ) {

				if ( confirm( 'Any unsaved data will be lost. Are you sure?' ) ) {

					var loader = new THREE.XHRLoader();
					loader.crossOrigin = '';
					loader.load( file, function ( text ) {

						var json = JSON.parse( text );

						editor.clear();
						editor.fromJSON( json );

					} );

				}

			}

			window.addEventListener( 'message', function ( event ) {

				editor.clear();
				editor.fromJSON( event.data );

			}, false );
			

		
	}
}
