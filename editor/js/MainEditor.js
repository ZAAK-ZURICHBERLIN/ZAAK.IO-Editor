/**
 * @author mrdoob / http://mrdoob.com/
 */
var MainEditor = function () {

	this.editor = new Editor();
	this.init();

};

MainEditor.prototype = {


	init: function(){

		window.URL = window.URL || window.webkitURL;
		window.BlobBuilder = window.BlobBuilder || window.WebKitBlobBuilder || window.MozBlobBuilder;

		Number.prototype.format = function (){
			// return this.toString().replace(/(\d)(?=(\d{3})+(?!\d))/g, "$1,");
		};

		// var	editor = new Editor();
		var scope = this;

		var viewport = new Viewport( scope.editor );
		document.body.appendChild( viewport.dom );

		var script = new Script( scope.editor );
		document.body.appendChild( script.dom );

		var player = new Player( scope.editor );
		document.body.appendChild( player.dom );

		var toolbar = new Toolbar( scope.editor );
		document.body.appendChild( toolbar.dom );

		var menubar = new Menubar( scope.editor );
		document.body.appendChild( menubar.dom );

		var sidebar = new Sidebar( scope.editor );
		document.body.appendChild( sidebar.dom );

		var sidebarLeft = new SidebarLeft( scope.editor );
		document.body.appendChild( sidebarLeft.dom );

		var modal = new UI.Modal();
		document.body.appendChild( modal.dom );

		var shortcuts = new EditorShortCuts(scope.editor);

		//
		//document.getElementById( 'theme' ).href
		scope.editor.setTheme( THEME );

		scope.editor.storage.init( function () {

			scope.editor.storage.get( function ( state ) {

				if ( state !== undefined ) {

					scope.editor.fromJSON( state );

				}

				var selected = scope.editor.config.getKey( 'selected' );

				if ( selected !== undefined ) {

					scope.editor.selectByUuid( selected );

				}

			} );

			//

			var timeout;

			var sceneChanged = function(){

				scope.editor.signals.unsaveProject.dispatch();

				if ( scope.editor.config.getKey( 'autosave' ) === false ) return;

			};

			var manualSave = function () {

				saveState(1000);
			};

			// var saveState = function ( scene ) {
			var saveState = function ( time ) {

				clearTimeout( timeout );

				timeout = setTimeout( function () {

					scope.editor.signals.savingStarted.dispatch();

					timeout = setTimeout( function () {

						scope.editor.storage.set( editor.toJSON() );

						scope.editor.signals.savingFinished.dispatch();

					}, 100 );

				}, time );

			};

			var signals = scope.editor.signals;

			signals.editorCleared.add( sceneChanged );
			signals.geometryChanged.add( sceneChanged );
			signals.objectAdded.add( sceneChanged );
			signals.objectChanged.add( sceneChanged );
			signals.objectRemoved.add( sceneChanged );
			signals.materialChanged.add( sceneChanged );
			signals.sceneGraphChanged.add( sceneChanged );
			//signals.scriptChanged.add( saveState );
			signals.saveProject.add( manualSave );

			signals.showModal.add( function ( content ) {

				modal.show( content );

			} );

		} );

		//

		document.addEventListener( 'dragover', function ( event ) {

			event.preventDefault();
			event.dataTransfer.dropEffect = 'copy';

		}, false );

		document.addEventListener( 'drop', function ( event ) {

			event.preventDefault();

			console.log(event.dataTransfer.files[0]);

			if ( event.dataTransfer.files.length > 0 ) {

				scope.editor.loader.loadFile( event.dataTransfer.files[ 0 ] );

			}

		}, false );

		document.addEventListener( 'keydown', function ( event ) {

			switch ( event.keyCode ) {

				case 79:
					scope.editor.camera.toOrthographic();

					// this.editor.camera.toPerspective();
					break;

				case 8:
					event.preventDefault(); // prevent browser back

					break;

				default:
					shortcuts.keyCheck( event.keyCode );
					break;

			}

		}, false );

		function onWindowResize( event ) {

			scope.editor.signals.windowResize.dispatch();
			// console.log("RESIZE");
		}
		

		window.addEventListener( 'resize', onWindowResize, false );

		onWindowResize();

		//

		var hash = window.location.hash;

		if ( hash.substr( 1, 5 ) === 'file=' ) {

			var file = hash.substr( 6 );

			if ( confirm( 'Any unsaved data will be lost. Are you sure?' ) ) {

				var loader = new THREE.XHRLoader();
				loader.crossOrigin = '';
				loader.load( file, function ( text ) {

					var json = JSON.parse( text );

					scope.editor.clear();
					scope.editor.fromJSON( json );

				} );

			}

		}

		function takeScreenshot() {
		    var dataUrl = renderer.domElement.toDataURL("image/png");
		    if (CARDBOARD_DEBUG) console.debug("SCREENSHOT: " + dataUrl);
		    return renderer.domElement.toDataURL("image/png");
		}

	}
};
