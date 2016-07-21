// File:editor/js/MainEditor.js

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

		//VR STUFF of doob
	// /*
	// 	window.addEventListener( 'message', function ( event ) {

	// 		editor.clear();
	// 		editor.fromJSON( event.data );

	// 	}, false );
	// 	*/

	// 	// VR

	// 	var groupVR;

	// 	// TODO: Use editor.signals.enteredVR (WebVR 1.0)

	// 	editor.signals.enterVR.add( function () {

	// 		if ( groupVR === undefined ) {

	// 			groupVR = new THREE.HTMLGroup( viewport.dom );
	// 			editor.sceneHelpers.add( groupVR );

	// 			var mesh = new THREE.HTMLMesh( sidebar.dom );
	// 			mesh.position.set( 15, 0, 15 );
	// 			mesh.rotation.y = - 0.5;
	// 			groupVR.add( mesh );

	// 			var signals = editor.signals;

	// 			function updateTexture() {

	// 				mesh.material.map.update();

	// 			}

	// 			signals.objectSelected.add( updateTexture );
	// 			signals.objectAdded.add( updateTexture );
	// 			signals.objectChanged.add( updateTexture );
	// 			signals.objectRemoved.add( updateTexture );
	// 			signals.sceneGraphChanged.add( updateTexture );
	// 			signals.historyChanged.add( updateTexture );

	// 		}

	// 		groupVR.visible = true;

	// 	} );

	// 	editor.signals.exitedVR.add( function () {

	// 		if ( groupVR !== undefined ) groupVR.visible = false;

	// 	} );

		function takeScreenshot() {
		    var dataUrl = renderer.domElement.toDataURL("image/png");
		    if (CARDBOARD_DEBUG) console.debug("SCREENSHOT: " + dataUrl);
		    return renderer.domElement.toDataURL("image/png");
		}

	}
};

// File:examples/js/libs/system.min.js

// system.js - http://github.com/mrdoob/system.js
'use strict';var System={browser:function(){var a=navigator.userAgent;return/Arora/i.test(a)?"Arora":/Chrome/i.test(a)?"Chrome":/Epiphany/i.test(a)?"Epiphany":/Firefox/i.test(a)?"Firefox":/Mobile(\/.*)? Safari/i.test(a)?"Mobile Safari":/MSIE/i.test(a)?"Internet Explorer":/Midori/i.test(a)?"Midori":/Opera/.test(a)?"Opera":/Safari/i.test(a)?"Safari":!1}(),os:function(){var a=navigator.userAgent;return/Android/i.test(a)?"Android":/CrOS/i.test(a)?"Chrome OS":/iP[ao]d|iPhone/i.test(a)?"iOS":/Linux/i.test(a)?
"Linux":/Mac OS/i.test(a)?"Mac OS":/windows/i.test(a)?"Windows":!1}(),support:{canvas:!!window.CanvasRenderingContext2D,localStorage:function(){try{return!!window.localStorage.getItem}catch(a){return!1}}(),file:!!window.File&&!!window.FileReader&&!!window.FileList&&!!window.Blob,fileSystem:!!window.requestFileSystem||!!window.webkitRequestFileSystem,getUserMedia:!!window.navigator.getUserMedia||!!window.navigator.webkitGetUserMedia||!!window.navigator.mozGetUserMedia||!!window.navigator.msGetUserMedia,
requestAnimationFrame:!!window.mozRequestAnimationFrame||!!window.webkitRequestAnimationFrame||!!window.oRequestAnimationFrame||!!window.msRequestAnimationFrame,sessionStorage:function(){try{return!!window.sessionStorage.getItem}catch(a){return!1}}(),webgl:function(){try{return!!window.WebGLRenderingContext&&!!document.createElement("canvas").getContext("experimental-webgl")}catch(a){return!1}}(),worker:!!window.Worker}};

// File:examples/js/controls/EditorControls.js

/**
 * @author qiao / https://github.com/qiao
 * @author mrdoob / http://mrdoob.com
 * @author alteredq / http://alteredqualia.com/
 * @author WestLangley / http://github.com/WestLangley
 */

THREE.EditorControls = function ( object, domElement ) {

	domElement = ( domElement !== undefined ) ? domElement : document;

	// API

	this.enabled = true;
	this.center = new THREE.Vector3();
	this.controler = object;

	// internals

	var scope = this;
	var vector = new THREE.Vector3();

	var STATE = { NONE: - 1, ROTATE: 0, ZOOM: 1, PAN: 2 };
	var state = STATE.NONE;

	var center = this.center;
	var normalMatrix = new THREE.Matrix3();
	var pointer = new THREE.Vector2();
	var pointerOld = new THREE.Vector2();
	var spherical = new THREE.Spherical();

	// events

	var changeEvent = { type: 'change' };

	this.focus = function ( target, frame ) {

		var scale = new THREE.Vector3();
		target.matrixWorld.decompose( center, new THREE.Quaternion(), scale );

		if ( frame && target.geometry ) {

			scale = ( scale.x + scale.y + scale.z ) / 3;
			center.add( target.geometry.boundingSphere.center.clone().multiplyScalar( scale ) );
			var radius = target.geometry.boundingSphere.radius * ( scale );
			var pos = scope.controler.position.clone().sub( center ).normalize().multiplyScalar( radius * 2 );
			scope.controler.position.copy( center ).add( pos );

		}

		scope.controler.lookAt( center );

		scope.dispatchEvent( changeEvent );

	};

	this.pan = function ( delta ) {

		var distance = scope.controler.position.distanceTo( center );

		delta.multiplyScalar( distance * 0.001 );
		delta.applyMatrix3( normalMatrix.getNormalMatrix( scope.controler.matrix ) );

		scope.controler.position.add( delta );
		center.add( delta );

		scope.dispatchEvent( changeEvent );

	};

	this.zoom = function ( delta ) {


		if(scope.controler instanceof THREE.PerspectiveCamera !== true){

			scope.controler.zoom = Math.max(scope.controler.zoom - delta.z * 0.001, 0.1);	

			/*scope.controler.left = scope.controler.left + delta.z*0.01;
			scope.controler.right = scope.controler.right + delta.z*0.01;
			scope.controler.top = scope.controler.top + delta.z*0.001;
			scope.controler.bottom = scope.controler.bottom + delta.z*0.001;*/

			scope.controler.updateProjectionMatrix();
		}
		else
		{

			var distance = scope.controler.position.distanceTo( center );

			delta.multiplyScalar( distance * 0.001 );

			if ( delta.length() > distance ) return;

			delta.applyMatrix3( normalMatrix.getNormalMatrix( scope.controler.matrix ) );

			scope.controler.position.add( delta );

		}

		scope.dispatchEvent( changeEvent );

	};

	this.rotate = function ( delta ) {

		vector.copy( scope.controler.position ).sub( center );

		spherical.setFromVector3( vector );

		spherical.theta += delta.x;
		spherical.phi += delta.y;

		spherical.makeSafe();

		vector.setFromSpherical( spherical );

		scope.controler.position.copy( center ).add( vector );

		scope.controler.lookAt( center );

		scope.dispatchEvent( changeEvent );

	};

	// mouse

	function onMouseDown( event ) {

		if ( scope.enabled === false ) return;

		if ( event.button === 0 ) {

			state = STATE.ROTATE;

		} else if ( event.button === 1 ) {

			state = STATE.ZOOM;

		} else if ( event.button === 2 ) {

			state = STATE.PAN;

		}

		pointerOld.set( event.clientX, event.clientY );

		domElement.addEventListener( 'mousemove', onMouseMove, false );
		domElement.addEventListener( 'mouseup', onMouseUp, false );
		domElement.addEventListener( 'mouseout', onMouseUp, false );
		domElement.addEventListener( 'dblclick', onMouseUp, false );

	}

	function onMouseMove( event ) {

		if ( scope.enabled === false ) return;

		pointer.set( event.clientX, event.clientY );

		var movementX = pointer.x - pointerOld.x;
		var movementY = pointer.y - pointerOld.y;

		if ( state === STATE.ROTATE ) {

			scope.rotate( new THREE.Vector3( - movementX * 0.005, - movementY * 0.005, 0 ) );

		} else if ( state === STATE.ZOOM ) {

			scope.zoom( new THREE.Vector3( 0, 0, movementY ) );

		} else if ( state === STATE.PAN ) {

			scope.pan( new THREE.Vector3( - movementX, movementY, 0 ) );

		}

		pointerOld.set( event.clientX, event.clientY );

	}

	function onMouseUp( event ) {

		domElement.removeEventListener( 'mousemove', onMouseMove, false );
		domElement.removeEventListener( 'mouseup', onMouseUp, false );
		domElement.removeEventListener( 'mouseout', onMouseUp, false );
		domElement.removeEventListener( 'dblclick', onMouseUp, false );

		state = STATE.NONE;

	}

	function onMouseWheel( event ) {

		event.preventDefault();

		// if ( scope.enabled === false ) return;

		var delta = 0;

		if ( event.wheelDelta ) {

			// WebKit / Opera / Explorer 9

			delta = - event.wheelDelta;

		} else if ( event.detail ) {

			// Firefox

			delta = event.detail * 10;

		}

		scope.zoom( new THREE.Vector3( 0, 0, delta ) );

	}

	function contextmenu( event ) {

		event.preventDefault();

	}

	this.dispose = function() {

		domElement.removeEventListener( 'contextmenu', contextmenu, false );
		domElement.removeEventListener( 'mousedown', onMouseDown, false );
		domElement.removeEventListener( 'mousewheel', onMouseWheel, false );
		domElement.removeEventListener( 'MozMousePixelScroll', onMouseWheel, false ); // firefox

		domElement.removeEventListener( 'mousemove', onMouseMove, false );
		domElement.removeEventListener( 'mouseup', onMouseUp, false );
		domElement.removeEventListener( 'mouseout', onMouseUp, false );
		domElement.removeEventListener( 'dblclick', onMouseUp, false );

		domElement.removeEventListener( 'touchstart', touchStart, false );
		domElement.removeEventListener( 'touchmove', touchMove, false );

	}

	domElement.addEventListener( 'contextmenu', contextmenu, false );
	domElement.addEventListener( 'mousedown', onMouseDown, false );
	domElement.addEventListener( 'mousewheel', onMouseWheel, false );
	domElement.addEventListener( 'MozMousePixelScroll', onMouseWheel, false ); // firefox

	// touch

	var touch = new THREE.Vector3();

	var touches = [ new THREE.Vector3(), new THREE.Vector3(), new THREE.Vector3() ];
	var prevTouches = [ new THREE.Vector3(), new THREE.Vector3(), new THREE.Vector3() ];

	var prevDistance = null;

	function touchStart( event ) {

		if ( scope.enabled === false ) return;

		switch ( event.touches.length ) {

			case 1:
				touches[ 0 ].set( event.touches[ 0 ].pageX, event.touches[ 0 ].pageY, 0 );
				touches[ 1 ].set( event.touches[ 0 ].pageX, event.touches[ 0 ].pageY, 0 );
				break;

			case 2:
				touches[ 0 ].set( event.touches[ 0 ].pageX, event.touches[ 0 ].pageY, 0 );
				touches[ 1 ].set( event.touches[ 1 ].pageX, event.touches[ 1 ].pageY, 0 );
				prevDistance = touches[ 0 ].distanceTo( touches[ 1 ] );
				break;

		}

		prevTouches[ 0 ].copy( touches[ 0 ] );
		prevTouches[ 1 ].copy( touches[ 1 ] );

	}


	function touchMove( event ) {

		if ( scope.enabled === false ) return;

		event.preventDefault();
		event.stopPropagation();

		function getClosest( touch, touches ) {

			var closest = touches[ 0 ];

			for ( var i in touches ) {

				if ( closest.distanceTo( touch ) > touches[ i ].distanceTo( touch ) ) closest = touches[ i ];

			}

			return closest;

		}

		switch ( event.touches.length ) {

			case 1:
				touches[ 0 ].set( event.touches[ 0 ].pageX, event.touches[ 0 ].pageY, 0 );
				touches[ 1 ].set( event.touches[ 0 ].pageX, event.touches[ 0 ].pageY, 0 );
				scope.rotate( touches[ 0 ].sub( getClosest( touches[ 0 ], prevTouches ) ).multiplyScalar( - 0.005 ) );
				break;

			case 2:
				touches[ 0 ].set( event.touches[ 0 ].pageX, event.touches[ 0 ].pageY, 0 );
				touches[ 1 ].set( event.touches[ 1 ].pageX, event.touches[ 1 ].pageY, 0 );
				distance = touches[ 0 ].distanceTo( touches[ 1 ] );
				scope.zoom( new THREE.Vector3( 0, 0, prevDistance - distance ) );
				prevDistance = distance;


				var offset0 = touches[ 0 ].clone().sub( getClosest( touches[ 0 ], prevTouches ) );
				var offset1 = touches[ 1 ].clone().sub( getClosest( touches[ 1 ], prevTouches ) );
				offset0.x = - offset0.x;
				offset1.x = - offset1.x;

				scope.pan( offset0.add( offset1 ).multiplyScalar( 0.5 ) );

				break;

		}

		prevTouches[ 0 ].copy( touches[ 0 ] );
		prevTouches[ 1 ].copy( touches[ 1 ] );

	}

	domElement.addEventListener( 'touchstart', touchStart, false );
	domElement.addEventListener( 'touchmove', touchMove, false );

};

THREE.EditorControls.prototype = Object.create( THREE.EventDispatcher.prototype );
THREE.EditorControls.prototype.constructor = THREE.EditorControls;

// File:examples/js/controls/TransformControls.js

/**
 * @author arodic / https://github.com/arodic
 */

( function () {

	'use strict';

	var GizmoMaterial = function ( parameters ) {

		THREE.MeshBasicMaterial.call( this );

		this.depthTest = false;
		this.depthWrite = false;
		this.side = THREE.FrontSide;
		this.transparent = true;

		this.setValues( parameters );

		this.oldColor = this.color.clone();
		this.oldOpacity = this.opacity;

		this.highlight = function( highlighted ) {

			if ( highlighted ) {

				this.color.setRGB( 1, 1, 0 );
				this.opacity = 1;

			} else {

				this.color.copy( this.oldColor );
				this.opacity = this.oldOpacity;

			}

		};

	};

	GizmoMaterial.prototype = Object.create( THREE.MeshBasicMaterial.prototype );
	GizmoMaterial.prototype.constructor = GizmoMaterial;


	var GizmoLineMaterial = function ( parameters ) {

		THREE.LineBasicMaterial.call( this );

		this.depthTest = false;
		this.depthWrite = false;
		this.transparent = true;
		this.linewidth = 1;

		this.setValues( parameters );

		this.oldColor = this.color.clone();
		this.oldOpacity = this.opacity;

		this.highlight = function( highlighted ) {

			if ( highlighted ) {

				this.color.setRGB( 1, 1, 0 );
				this.opacity = 1;

			} else {

				this.color.copy( this.oldColor );
				this.opacity = this.oldOpacity;

			}

		};

	};

	GizmoLineMaterial.prototype = Object.create( THREE.LineBasicMaterial.prototype );
	GizmoLineMaterial.prototype.constructor = GizmoLineMaterial;


	var pickerMaterial = new GizmoMaterial( { visible: false, transparent: false } );


	THREE.TransformGizmo = function () {

		var scope = this;

		this.init = function () {

			THREE.Object3D.call( this );

			this.handles = new THREE.Object3D();
			this.pickers = new THREE.Object3D();
			this.planes = new THREE.Object3D();

			this.add( this.handles );
			this.add( this.pickers );
			this.add( this.planes );

			//// PLANES

			var planeGeometry = new THREE.PlaneBufferGeometry( 50, 50, 2, 2 );
			var planeMaterial = new THREE.MeshBasicMaterial( { visible: false, side: THREE.DoubleSide } );

			var planes = {
				"XY":   new THREE.Mesh( planeGeometry, planeMaterial ),
				"YZ":   new THREE.Mesh( planeGeometry, planeMaterial ),
				"XZ":   new THREE.Mesh( planeGeometry, planeMaterial ),
				"XYZE": new THREE.Mesh( planeGeometry, planeMaterial )
			};

			this.activePlane = planes[ "XYZE" ];

			planes[ "YZ" ].rotation.set( 0, Math.PI / 2, 0 );
			planes[ "XZ" ].rotation.set( - Math.PI / 2, 0, 0 );

			for ( var i in planes ) {

				planes[ i ].name = i;
				this.planes.add( planes[ i ] );
				this.planes[ i ] = planes[ i ];

			}

			//// HANDLES AND PICKERS

			var setupGizmos = function( gizmoMap, parent ) {

				for ( var name in gizmoMap ) {

					for ( i = gizmoMap[ name ].length; i --; ) {

						var object = gizmoMap[ name ][ i ][ 0 ];
						var position = gizmoMap[ name ][ i ][ 1 ];
						var rotation = gizmoMap[ name ][ i ][ 2 ];

						object.name = name;

						if ( position ) object.position.set( position[ 0 ], position[ 1 ], position[ 2 ] );
						if ( rotation ) object.rotation.set( rotation[ 0 ], rotation[ 1 ], rotation[ 2 ] );

						parent.add( object );

					}

				}

			};

			setupGizmos( this.handleGizmos, this.handles );
			setupGizmos( this.pickerGizmos, this.pickers );

			// reset Transformations

			this.traverse( function ( child ) {

				if ( child instanceof THREE.Mesh ) {

					child.updateMatrix();

					var tempGeometry = child.geometry.clone();
					tempGeometry.applyMatrix( child.matrix );
					child.geometry = tempGeometry;

					child.position.set( 0, 0, 0 );
					child.rotation.set( 0, 0, 0 );
					child.scale.set( 1, 1, 1 );

				}

			} );

		};

		this.highlight = function ( axis ) {

			this.traverse( function( child ) {

				if ( child.material && child.material.highlight ) {

					if ( child.name === axis ) {

						child.material.highlight( true );

					} else {

						child.material.highlight( false );

					}

				}

			} );

		};

	};

	THREE.TransformGizmo.prototype = Object.create( THREE.Object3D.prototype );
	THREE.TransformGizmo.prototype.constructor = THREE.TransformGizmo;

	THREE.TransformGizmo.prototype.update = function ( rotation, eye ) {

		var vec1 = new THREE.Vector3( 0, 0, 0 );
		var vec2 = new THREE.Vector3( 0, 1, 0 );
		var lookAtMatrix = new THREE.Matrix4();

		this.traverse( function( child ) {

			if ( child.name.search( "E" ) !== - 1 ) {

				child.quaternion.setFromRotationMatrix( lookAtMatrix.lookAt( eye, vec1, vec2 ) );

			} else if ( child.name.search( "X" ) !== - 1 || child.name.search( "Y" ) !== - 1 || child.name.search( "Z" ) !== - 1 ) {

				child.quaternion.setFromEuler( rotation );

			}

		} );

	};

	THREE.TransformGizmoTranslate = function () {

		THREE.TransformGizmo.call( this );

		var arrowGeometry = new THREE.Geometry();
		var mesh = new THREE.Mesh( new THREE.CylinderGeometry( 0, 0.05, 0.2, 12, 1, false ) );
		mesh.position.y = 0.5;
		mesh.updateMatrix();

		arrowGeometry.merge( mesh.geometry, mesh.matrix );

		var lineXGeometry = new THREE.BufferGeometry();
		lineXGeometry.addAttribute( 'position', new THREE.Float32Attribute( [ 0, 0, 0,  1, 0, 0 ], 3 ) );

		var lineYGeometry = new THREE.BufferGeometry();
		lineYGeometry.addAttribute( 'position', new THREE.Float32Attribute( [ 0, 0, 0,  0, 1, 0 ], 3 ) );

		var lineZGeometry = new THREE.BufferGeometry();
		lineZGeometry.addAttribute( 'position', new THREE.Float32Attribute( [ 0, 0, 0,  0, 0, 1 ], 3 ) );

		this.handleGizmos = {

			X: [
				[ new THREE.Mesh( arrowGeometry, new GizmoMaterial( { color: 0xff0000 } ) ), [ 0.5, 0, 0 ], [ 0, 0, - Math.PI / 2 ] ],
				[ new THREE.Line( lineXGeometry, new GizmoLineMaterial( { color: 0xff0000 } ) ) ]
			],

			Y: [
				[ new THREE.Mesh( arrowGeometry, new GizmoMaterial( { color: 0x00ff00 } ) ), [ 0, 0.5, 0 ] ],
				[	new THREE.Line( lineYGeometry, new GizmoLineMaterial( { color: 0x00ff00 } ) ) ]
			],

			Z: [
				[ new THREE.Mesh( arrowGeometry, new GizmoMaterial( { color: 0x0000ff } ) ), [ 0, 0, 0.5 ], [ Math.PI / 2, 0, 0 ] ],
				[ new THREE.Line( lineZGeometry, new GizmoLineMaterial( { color: 0x0000ff } ) ) ]
			],

			XYZ: [
				[ new THREE.Mesh( new THREE.OctahedronGeometry( 0.1, 0 ), new GizmoMaterial( { color: 0xffffff, opacity: 0.25 } ) ), [ 0, 0, 0 ], [ 0, 0, 0 ] ]
			],

			XY: [
				[ new THREE.Mesh( new THREE.PlaneBufferGeometry( 0.29, 0.29 ), new GizmoMaterial( { color: 0xffff00, opacity: 0.25 } ) ), [ 0.15, 0.15, 0 ] ]
			],

			YZ: [
				[ new THREE.Mesh( new THREE.PlaneBufferGeometry( 0.29, 0.29 ), new GizmoMaterial( { color: 0x00ffff, opacity: 0.25 } ) ), [ 0, 0.15, 0.15 ], [ 0, Math.PI / 2, 0 ] ]
			],

			XZ: [
				[ new THREE.Mesh( new THREE.PlaneBufferGeometry( 0.29, 0.29 ), new GizmoMaterial( { color: 0xff00ff, opacity: 0.25 } ) ), [ 0.15, 0, 0.15 ], [ - Math.PI / 2, 0, 0 ] ]
			]

		};

		this.pickerGizmos = {

			X: [
				[ new THREE.Mesh( new THREE.CylinderBufferGeometry( 0.2, 0, 1, 4, 1, false ), pickerMaterial ), [ 0.6, 0, 0 ], [ 0, 0, - Math.PI / 2 ] ]
			],

			Y: [
				[ new THREE.Mesh( new THREE.CylinderBufferGeometry( 0.2, 0, 1, 4, 1, false ), pickerMaterial ), [ 0, 0.6, 0 ] ]
			],

			Z: [
				[ new THREE.Mesh( new THREE.CylinderBufferGeometry( 0.2, 0, 1, 4, 1, false ), pickerMaterial ), [ 0, 0, 0.6 ], [ Math.PI / 2, 0, 0 ] ]
			],

			XYZ: [
				[ new THREE.Mesh( new THREE.OctahedronGeometry( 0.2, 0 ), pickerMaterial ) ]
			],

			XY: [
				[ new THREE.Mesh( new THREE.PlaneBufferGeometry( 0.4, 0.4 ), pickerMaterial ), [ 0.2, 0.2, 0 ] ]
			],

			YZ: [
				[ new THREE.Mesh( new THREE.PlaneBufferGeometry( 0.4, 0.4 ), pickerMaterial ), [ 0, 0.2, 0.2 ], [ 0, Math.PI / 2, 0 ] ]
			],

			XZ: [
				[ new THREE.Mesh( new THREE.PlaneBufferGeometry( 0.4, 0.4 ), pickerMaterial ), [ 0.2, 0, 0.2 ], [ - Math.PI / 2, 0, 0 ] ]
			]

		};

		this.setActivePlane = function ( axis, eye ) {

			var tempMatrix = new THREE.Matrix4();
			eye.applyMatrix4( tempMatrix.getInverse( tempMatrix.extractRotation( this.planes[ "XY" ].matrixWorld ) ) );

			if ( axis === "X" ) {

				this.activePlane = this.planes[ "XY" ];

				if ( Math.abs( eye.y ) > Math.abs( eye.z ) ) this.activePlane = this.planes[ "XZ" ];

			}

			if ( axis === "Y" ) {

				this.activePlane = this.planes[ "XY" ];

				if ( Math.abs( eye.x ) > Math.abs( eye.z ) ) this.activePlane = this.planes[ "YZ" ];

			}

			if ( axis === "Z" ) {

				this.activePlane = this.planes[ "XZ" ];

				if ( Math.abs( eye.x ) > Math.abs( eye.y ) ) this.activePlane = this.planes[ "YZ" ];

			}

			if ( axis === "XYZ" ) this.activePlane = this.planes[ "XYZE" ];

			if ( axis === "XY" ) this.activePlane = this.planes[ "XY" ];

			if ( axis === "YZ" ) this.activePlane = this.planes[ "YZ" ];

			if ( axis === "XZ" ) this.activePlane = this.planes[ "XZ" ];

		};

		this.init();

	};

	THREE.TransformGizmoTranslate.prototype = Object.create( THREE.TransformGizmo.prototype );
	THREE.TransformGizmoTranslate.prototype.constructor = THREE.TransformGizmoTranslate;

	THREE.TransformGizmoRotate = function () {

		THREE.TransformGizmo.call( this );

		var CircleGeometry = function ( radius, facing, arc ) {

			var geometry = new THREE.BufferGeometry();
			var vertices = [];
			arc = arc ? arc : 1;

			for ( var i = 0; i <= 64 * arc; ++ i ) {

				if ( facing === 'x' ) vertices.push( 0, Math.cos( i / 32 * Math.PI ) * radius, Math.sin( i / 32 * Math.PI ) * radius );
				if ( facing === 'y' ) vertices.push( Math.cos( i / 32 * Math.PI ) * radius, 0, Math.sin( i / 32 * Math.PI ) * radius );
				if ( facing === 'z' ) vertices.push( Math.sin( i / 32 * Math.PI ) * radius, Math.cos( i / 32 * Math.PI ) * radius, 0 );

			}

			geometry.addAttribute( 'position', new THREE.Float32Attribute( vertices, 3 ) );
			return geometry;

		};

		this.handleGizmos = {

			X: [
				[ new THREE.Line( new CircleGeometry( 1, 'x', 0.5 ), new GizmoLineMaterial( { color: 0xff0000 } ) ) ]
			],

			Y: [
				[ new THREE.Line( new CircleGeometry( 1, 'y', 0.5 ), new GizmoLineMaterial( { color: 0x00ff00 } ) ) ]
			],

			Z: [
				[ new THREE.Line( new CircleGeometry( 1, 'z', 0.5 ), new GizmoLineMaterial( { color: 0x0000ff } ) ) ]
			],

			E: [
				[ new THREE.Line( new CircleGeometry( 1.25, 'z', 1 ), new GizmoLineMaterial( { color: 0xcccc00 } ) ) ]
			],

			XYZE: [
				[ new THREE.Line( new CircleGeometry( 1, 'z', 1 ), new GizmoLineMaterial( { color: 0x787878 } ) ) ]
			]

		};

		this.pickerGizmos = {

			X: [
				[ new THREE.Mesh( new THREE.TorusBufferGeometry( 1, 0.12, 4, 12, Math.PI ), pickerMaterial ), [ 0, 0, 0 ], [ 0, - Math.PI / 2, - Math.PI / 2 ] ]
			],

			Y: [
				[ new THREE.Mesh( new THREE.TorusBufferGeometry( 1, 0.12, 4, 12, Math.PI ), pickerMaterial ), [ 0, 0, 0 ], [ Math.PI / 2, 0, 0 ] ]
			],

			Z: [
				[ new THREE.Mesh( new THREE.TorusBufferGeometry( 1, 0.12, 4, 12, Math.PI ), pickerMaterial ), [ 0, 0, 0 ], [ 0, 0, - Math.PI / 2 ] ]
			],

			E: [
				[ new THREE.Mesh( new THREE.TorusBufferGeometry( 1.25, 0.12, 2, 24 ), pickerMaterial ) ]
			],

			XYZE: [
				[ new THREE.Mesh( new THREE.Geometry() ) ]// TODO
			]

		};

		this.setActivePlane = function ( axis ) {

			if ( axis === "E" ) this.activePlane = this.planes[ "XYZE" ];

			if ( axis === "X" ) this.activePlane = this.planes[ "YZ" ];

			if ( axis === "Y" ) this.activePlane = this.planes[ "XZ" ];

			if ( axis === "Z" ) this.activePlane = this.planes[ "XY" ];

		};

		this.update = function ( rotation, eye2 ) {

			THREE.TransformGizmo.prototype.update.apply( this, arguments );

			var group = {

				handles: this[ "handles" ],
				pickers: this[ "pickers" ],

			};

			var tempMatrix = new THREE.Matrix4();
			var worldRotation = new THREE.Euler( 0, 0, 1 );
			var tempQuaternion = new THREE.Quaternion();
			var unitX = new THREE.Vector3( 1, 0, 0 );
			var unitY = new THREE.Vector3( 0, 1, 0 );
			var unitZ = new THREE.Vector3( 0, 0, 1 );
			var quaternionX = new THREE.Quaternion();
			var quaternionY = new THREE.Quaternion();
			var quaternionZ = new THREE.Quaternion();
			var eye = eye2.clone();

			worldRotation.copy( this.planes[ "XY" ].rotation );
			tempQuaternion.setFromEuler( worldRotation );

			tempMatrix.makeRotationFromQuaternion( tempQuaternion ).getInverse( tempMatrix );
			eye.applyMatrix4( tempMatrix );

			this.traverse( function( child ) {

				tempQuaternion.setFromEuler( worldRotation );

				if ( child.name === "X" ) {

					quaternionX.setFromAxisAngle( unitX, Math.atan2( - eye.y, eye.z ) );
					tempQuaternion.multiplyQuaternions( tempQuaternion, quaternionX );
					child.quaternion.copy( tempQuaternion );

				}

				if ( child.name === "Y" ) {

					quaternionY.setFromAxisAngle( unitY, Math.atan2( eye.x, eye.z ) );
					tempQuaternion.multiplyQuaternions( tempQuaternion, quaternionY );
					child.quaternion.copy( tempQuaternion );

				}

				if ( child.name === "Z" ) {

					quaternionZ.setFromAxisAngle( unitZ, Math.atan2( eye.y, eye.x ) );
					tempQuaternion.multiplyQuaternions( tempQuaternion, quaternionZ );
					child.quaternion.copy( tempQuaternion );

				}

			} );

		};

		this.init();

	};

	THREE.TransformGizmoRotate.prototype = Object.create( THREE.TransformGizmo.prototype );
	THREE.TransformGizmoRotate.prototype.constructor = THREE.TransformGizmoRotate;

	THREE.TransformGizmoScale = function () {

		THREE.TransformGizmo.call( this );

		var arrowGeometry = new THREE.Geometry();
		var mesh = new THREE.Mesh( new THREE.BoxGeometry( 0.125, 0.125, 0.125 ) );
		mesh.position.y = 0.5;
		mesh.updateMatrix();

		arrowGeometry.merge( mesh.geometry, mesh.matrix );

		var lineXGeometry = new THREE.BufferGeometry();
		lineXGeometry.addAttribute( 'position', new THREE.Float32Attribute( [ 0, 0, 0,  1, 0, 0 ], 3 ) );

		var lineYGeometry = new THREE.BufferGeometry();
		lineYGeometry.addAttribute( 'position', new THREE.Float32Attribute( [ 0, 0, 0,  0, 1, 0 ], 3 ) );

		var lineZGeometry = new THREE.BufferGeometry();
		lineZGeometry.addAttribute( 'position', new THREE.Float32Attribute( [ 0, 0, 0,  0, 0, 1 ], 3 ) );

		this.handleGizmos = {

			X: [
				[ new THREE.Mesh( arrowGeometry, new GizmoMaterial( { color: 0xff0000 } ) ), [ 0.5, 0, 0 ], [ 0, 0, - Math.PI / 2 ] ],
				[ new THREE.Line( lineXGeometry, new GizmoLineMaterial( { color: 0xff0000 } ) ) ]
			],

			Y: [
				[ new THREE.Mesh( arrowGeometry, new GizmoMaterial( { color: 0x00ff00 } ) ), [ 0, 0.5, 0 ] ],
				[ new THREE.Line( lineYGeometry, new GizmoLineMaterial( { color: 0x00ff00 } ) ) ]
			],

			Z: [
				[ new THREE.Mesh( arrowGeometry, new GizmoMaterial( { color: 0x0000ff } ) ), [ 0, 0, 0.5 ], [ Math.PI / 2, 0, 0 ] ],
				[ new THREE.Line( lineZGeometry, new GizmoLineMaterial( { color: 0x0000ff } ) ) ]
			],

			XYZ: [
				[ new THREE.Mesh( new THREE.BoxBufferGeometry( 0.125, 0.125, 0.125 ), new GizmoMaterial( { color: 0xffffff, opacity: 0.25 } ) ) ]
			]

		};

		this.pickerGizmos = {

			X: [
				[ new THREE.Mesh( new THREE.CylinderBufferGeometry( 0.2, 0, 1, 4, 1, false ), pickerMaterial ), [ 0.6, 0, 0 ], [ 0, 0, - Math.PI / 2 ] ]
			],

			Y: [
				[ new THREE.Mesh( new THREE.CylinderBufferGeometry( 0.2, 0, 1, 4, 1, false ), pickerMaterial ), [ 0, 0.6, 0 ] ]
			],

			Z: [
				[ new THREE.Mesh( new THREE.CylinderBufferGeometry( 0.2, 0, 1, 4, 1, false ), pickerMaterial ), [ 0, 0, 0.6 ], [ Math.PI / 2, 0, 0 ] ]
			],

			XYZ: [
				[ new THREE.Mesh( new THREE.BoxBufferGeometry( 0.4, 0.4, 0.4 ), pickerMaterial ) ]
			]

		};

		this.setActivePlane = function ( axis, eye ) {

			var tempMatrix = new THREE.Matrix4();
			eye.applyMatrix4( tempMatrix.getInverse( tempMatrix.extractRotation( this.planes[ "XY" ].matrixWorld ) ) );

			if ( axis === "X" ) {

				this.activePlane = this.planes[ "XY" ];
				if ( Math.abs( eye.y ) > Math.abs( eye.z ) ) this.activePlane = this.planes[ "XZ" ];

			}

			if ( axis === "Y" ) {

				this.activePlane = this.planes[ "XY" ];
				if ( Math.abs( eye.x ) > Math.abs( eye.z ) ) this.activePlane = this.planes[ "YZ" ];

			}

			if ( axis === "Z" ) {

				this.activePlane = this.planes[ "XZ" ];
				if ( Math.abs( eye.x ) > Math.abs( eye.y ) ) this.activePlane = this.planes[ "YZ" ];

			}

			if ( axis === "XYZ" ) this.activePlane = this.planes[ "XYZE" ];

		};

		this.init();

	};

	THREE.TransformGizmoScale.prototype = Object.create( THREE.TransformGizmo.prototype );
	THREE.TransformGizmoScale.prototype.constructor = THREE.TransformGizmoScale;

	THREE.TransformControls = function ( camera, domElement ) {

		// TODO: Make non-uniform scale and rotate play nice in hierarchies
		// TODO: ADD RXYZ contol

		THREE.Object3D.call( this );

		domElement = ( domElement !== undefined ) ? domElement : document;

		this.object = undefined;
		this.visible = false;
		this.translationSnap = null;
		this.rotationSnap = null;
		this.space = "local";
		this.size = 1;
		this.axis = null;
		this.controler = camera;

		var scope = this;

		// var currentCam;

		var _mode = "translate";
		var _dragging = false;
		var _plane = "XY";
		var _gizmo = {

			"translate": new THREE.TransformGizmoTranslate(),
			"rotate": new THREE.TransformGizmoRotate(),
			"scale": new THREE.TransformGizmoScale()
		};

		for ( var type in _gizmo ) {

			var gizmoObj = _gizmo[ type ];

			gizmoObj.visible = ( type === _mode );
			this.add( gizmoObj );

		}

		var changeEvent = { type: "change" };
		var mouseDownEvent = { type: "mouseDown" };
		var mouseUpEvent = { type: "mouseUp", mode: _mode };
		var objectChangeEvent = { type: "objectChange" };

		var ray = new THREE.Raycaster();
		var pointerVector = new THREE.Vector2();

		var point = new THREE.Vector3();
		var offset = new THREE.Vector3();

		var rotation = new THREE.Vector3();
		var offsetRotation = new THREE.Vector3();
		var scale = 1;

		var lookAtMatrix = new THREE.Matrix4();
		var eye = new THREE.Vector3();

		var tempMatrix = new THREE.Matrix4();
		var tempVector = new THREE.Vector3();
		var tempQuaternion = new THREE.Quaternion();
		var unitX = new THREE.Vector3( 1, 0, 0 );
		var unitY = new THREE.Vector3( 0, 1, 0 );
		var unitZ = new THREE.Vector3( 0, 0, 1 );

		var quaternionXYZ = new THREE.Quaternion();
		var quaternionX = new THREE.Quaternion();
		var quaternionY = new THREE.Quaternion();
		var quaternionZ = new THREE.Quaternion();
		var quaternionE = new THREE.Quaternion();

		var oldPosition = new THREE.Vector3();
		var oldScale = new THREE.Vector3();
		var oldRotationMatrix = new THREE.Matrix4();

		var parentRotationMatrix  = new THREE.Matrix4();
		var parentScale = new THREE.Vector3();

		var worldPosition = new THREE.Vector3();
		var worldRotation = new THREE.Euler();
		var worldRotationMatrix  = new THREE.Matrix4();
		var camPosition = new THREE.Vector3();
		var camRotation = new THREE.Euler();

		domElement.addEventListener( "mousedown", onPointerDown, false );
		domElement.addEventListener( "touchstart", onPointerDown, false );

		domElement.addEventListener( "mousemove", onPointerHover, false );
		domElement.addEventListener( "touchmove", onPointerHover, false );

		domElement.addEventListener( "mousemove", onPointerMove, false );
		domElement.addEventListener( "touchmove", onPointerMove, false );

		domElement.addEventListener( "mouseup", onPointerUp, false );
		domElement.addEventListener( "mouseout", onPointerUp, false );
		domElement.addEventListener( "touchend", onPointerUp, false );
		domElement.addEventListener( "touchcancel", onPointerUp, false );
		domElement.addEventListener( "touchleave", onPointerUp, false );

		this.dispose = function () {

			domElement.removeEventListener( "mousedown", onPointerDown );
			domElement.removeEventListener( "touchstart", onPointerDown );

			domElement.removeEventListener( "mousemove", onPointerHover );
			domElement.removeEventListener( "touchmove", onPointerHover );

			domElement.removeEventListener( "mousemove", onPointerMove );
			domElement.removeEventListener( "touchmove", onPointerMove );

			domElement.removeEventListener( "mouseup", onPointerUp );
			domElement.removeEventListener( "mouseout", onPointerUp );
			domElement.removeEventListener( "touchend", onPointerUp );
			domElement.removeEventListener( "touchcancel", onPointerUp );
			domElement.removeEventListener( "touchleave", onPointerUp );

		};

		this.attach = function ( object ) {

			this.object = object;
			this.visible = true;
			this.update();

		};

		this.detach = function () {

			this.object = undefined;
			this.visible = false;
			this.axis = null;

		};

		this.getMode = function () {

			return _mode;

		};

		this.setMode = function ( mode ) {

			_mode = mode ? mode : _mode;

			if ( _mode === "scale" ) scope.space = "local";

			for ( var type in _gizmo ) _gizmo[ type ].visible = ( type === _mode );

			this.update();
			scope.dispatchEvent( changeEvent );

		};

		this.setTranslationSnap = function ( translationSnap ) {

			scope.translationSnap = translationSnap;

		};

		this.setRotationSnap = function ( rotationSnap ) {

			scope.rotationSnap = rotationSnap;

		};

		this.setSize = function ( size ) {

			scope.size = size;
			this.update();
			scope.dispatchEvent( changeEvent );

		};

		this.setSpace = function ( space ) {

			scope.space = space;
			this.update();
			scope.dispatchEvent( changeEvent );

		};

		this.update = function () {

			if ( scope.object === undefined ) return;

			scope.object.updateMatrixWorld();
			worldPosition.setFromMatrixPosition( scope.object.matrixWorld );
			worldRotation.setFromRotationMatrix( tempMatrix.extractRotation( scope.object.matrixWorld ) );

			scope.controler.updateMatrixWorld();
			camPosition.setFromMatrixPosition( scope.controler.matrixWorld );
			camRotation.setFromRotationMatrix( tempMatrix.extractRotation( scope.controler.matrixWorld ) );

			if(scope.controler instanceof THREE.PerspectiveCamera){

				scale = worldPosition.distanceTo( camPosition ) / 6 * scope.size;

			}else{

				scale = Math.max(10 - scope.controler.zoom,1.5);
			}

			this.scale.set( scale, scale, scale );
			this.position.copy( worldPosition );

			eye.copy( camPosition ).sub( worldPosition ).normalize();

			if ( scope.space === "local" ) {

				_gizmo[ _mode ].update( worldRotation, eye );

			} else if ( scope.space === "world" ) {

				_gizmo[ _mode ].update( new THREE.Euler(), eye );

			}

			_gizmo[ _mode ].highlight( scope.axis );

		};

		function onPointerHover( event ) {

			if ( scope.object === undefined || _dragging === true || ( event.button !== undefined && event.button !== 0 ) ) return;

			var pointer = event.changedTouches ? event.changedTouches[ 0 ] : event;

			var intersect = intersectObjects( pointer, _gizmo[ _mode ].pickers.children );

			var axis = null;

			if ( intersect ) {

				axis = intersect.object.name;

				event.preventDefault();

			}

			if ( scope.axis !== axis ) {

				scope.axis = axis;
				scope.update();
				scope.dispatchEvent( changeEvent );

			}

		}

		function onPointerDown( event ) {

			if ( scope.object === undefined || _dragging === true || ( event.button !== undefined && event.button !== 0 ) ) return;

			var pointer = event.changedTouches ? event.changedTouches[ 0 ] : event;

			if ( pointer.button === 0 || pointer.button === undefined ) {

				var intersect = intersectObjects( pointer, _gizmo[ _mode ].pickers.children );

				if ( intersect ) {

					event.preventDefault();
					event.stopPropagation();

					scope.dispatchEvent( mouseDownEvent );

					scope.axis = intersect.object.name;

					scope.update();

					eye.copy( camPosition ).sub( worldPosition ).normalize();

					_gizmo[ _mode ].setActivePlane( scope.axis, eye );

					var planeIntersect = intersectObjects( pointer, [ _gizmo[ _mode ].activePlane ] );

					if ( planeIntersect ) {

						oldPosition.copy( scope.object.position );
						oldScale.copy( scope.object.scale );

						oldRotationMatrix.extractRotation( scope.object.matrix );
						worldRotationMatrix.extractRotation( scope.object.matrixWorld );

						parentRotationMatrix.extractRotation( scope.object.parent.matrixWorld );
						parentScale.setFromMatrixScale( tempMatrix.getInverse( scope.object.parent.matrixWorld ) );

						offset.copy( planeIntersect.point );

					}

				}

			}

			_dragging = true;

		}

		function onPointerMove( event ) {

			if ( scope.object === undefined || scope.axis === null || _dragging === false || ( event.button !== undefined && event.button !== 0 ) ) return;

			var pointer = event.changedTouches ? event.changedTouches[ 0 ] : event;

			var planeIntersect = intersectObjects( pointer, [ _gizmo[ _mode ].activePlane ] );

			if ( planeIntersect === false ) return;

			event.preventDefault();
			event.stopPropagation();

			point.copy( planeIntersect.point );

			if ( _mode === "translate" ) {

				point.sub( offset );
				point.multiply( parentScale );

				if ( scope.space === "local" ) {

					point.applyMatrix4( tempMatrix.getInverse( worldRotationMatrix ) );

					if ( scope.axis.search( "X" ) === - 1 ) point.x = 0;
					if ( scope.axis.search( "Y" ) === - 1 ) point.y = 0;
					if ( scope.axis.search( "Z" ) === - 1 ) point.z = 0;

					point.applyMatrix4( oldRotationMatrix );

					scope.object.position.copy( oldPosition );
					scope.object.position.add( point );

				}

				if ( scope.space === "world" || scope.axis.search( "XYZ" ) !== - 1 ) {

					if ( scope.axis.search( "X" ) === - 1 ) point.x = 0;
					if ( scope.axis.search( "Y" ) === - 1 ) point.y = 0;
					if ( scope.axis.search( "Z" ) === - 1 ) point.z = 0;

					point.applyMatrix4( tempMatrix.getInverse( parentRotationMatrix ) );

					scope.object.position.copy( oldPosition );
					scope.object.position.add( point );

				}

				if ( scope.translationSnap !== null ) {

					if ( scope.space === "local" ) {

						scope.object.position.applyMatrix4( tempMatrix.getInverse( worldRotationMatrix ) );

					}

					if ( scope.axis.search( "X" ) !== - 1 ) scope.object.position.x = Math.round( scope.object.position.x / scope.translationSnap ) * scope.translationSnap;
					if ( scope.axis.search( "Y" ) !== - 1 ) scope.object.position.y = Math.round( scope.object.position.y / scope.translationSnap ) * scope.translationSnap;
					if ( scope.axis.search( "Z" ) !== - 1 ) scope.object.position.z = Math.round( scope.object.position.z / scope.translationSnap ) * scope.translationSnap;

					if ( scope.space === "local" ) {

						scope.object.position.applyMatrix4( worldRotationMatrix );

					}

				}

			} else if ( _mode === "scale" ) {

				point.sub( offset );
				point.multiply( parentScale );

				if ( scope.space === "local" ) {

					if ( scope.axis === "XYZ" ) {

						scale = 1 + ( ( point.y ) / Math.max( oldScale.x, oldScale.y, oldScale.z ) );

						scope.object.scale.x = oldScale.x * scale;
						scope.object.scale.y = oldScale.y * scale;
						scope.object.scale.z = oldScale.z * scale;

					} else {

						point.applyMatrix4( tempMatrix.getInverse( worldRotationMatrix ) );

						if ( scope.axis === "X" ) scope.object.scale.x = oldScale.x * ( 1 + point.x / oldScale.x );
						if ( scope.axis === "Y" ) scope.object.scale.y = oldScale.y * ( 1 + point.y / oldScale.y );
						if ( scope.axis === "Z" ) scope.object.scale.z = oldScale.z * ( 1 + point.z / oldScale.z );

					}

				}

			} else if ( _mode === "rotate" ) {

				point.sub( worldPosition );
				point.multiply( parentScale );
				tempVector.copy( offset ).sub( worldPosition );
				tempVector.multiply( parentScale );

				if ( scope.axis === "E" ) {

					point.applyMatrix4( tempMatrix.getInverse( lookAtMatrix ) );
					tempVector.applyMatrix4( tempMatrix.getInverse( lookAtMatrix ) );

					rotation.set( Math.atan2( point.z, point.y ), Math.atan2( point.x, point.z ), Math.atan2( point.y, point.x ) );
					offsetRotation.set( Math.atan2( tempVector.z, tempVector.y ), Math.atan2( tempVector.x, tempVector.z ), Math.atan2( tempVector.y, tempVector.x ) );

					tempQuaternion.setFromRotationMatrix( tempMatrix.getInverse( parentRotationMatrix ) );

					quaternionE.setFromAxisAngle( eye, rotation.z - offsetRotation.z );
					quaternionXYZ.setFromRotationMatrix( worldRotationMatrix );

					tempQuaternion.multiplyQuaternions( tempQuaternion, quaternionE );
					tempQuaternion.multiplyQuaternions( tempQuaternion, quaternionXYZ );

					scope.object.quaternion.copy( tempQuaternion );

				} else if ( scope.axis === "XYZE" ) {

					quaternionE.setFromEuler( point.clone().cross( tempVector ).normalize() ); // rotation axis

					tempQuaternion.setFromRotationMatrix( tempMatrix.getInverse( parentRotationMatrix ) );
					quaternionX.setFromAxisAngle( quaternionE, - point.clone().angleTo( tempVector ) );
					quaternionXYZ.setFromRotationMatrix( worldRotationMatrix );

					tempQuaternion.multiplyQuaternions( tempQuaternion, quaternionX );
					tempQuaternion.multiplyQuaternions( tempQuaternion, quaternionXYZ );

					scope.object.quaternion.copy( tempQuaternion );

				} else if ( scope.space === "local" ) {

					point.applyMatrix4( tempMatrix.getInverse( worldRotationMatrix ) );

					tempVector.applyMatrix4( tempMatrix.getInverse( worldRotationMatrix ) );

					rotation.set( Math.atan2( point.z, point.y ), Math.atan2( point.x, point.z ), Math.atan2( point.y, point.x ) );
					offsetRotation.set( Math.atan2( tempVector.z, tempVector.y ), Math.atan2( tempVector.x, tempVector.z ), Math.atan2( tempVector.y, tempVector.x ) );

					quaternionXYZ.setFromRotationMatrix( oldRotationMatrix );

					if ( scope.rotationSnap !== null ) {

						quaternionX.setFromAxisAngle( unitX, Math.round( ( rotation.x - offsetRotation.x ) / scope.rotationSnap ) * scope.rotationSnap );
						quaternionY.setFromAxisAngle( unitY, Math.round( ( rotation.y - offsetRotation.y ) / scope.rotationSnap ) * scope.rotationSnap );
						quaternionZ.setFromAxisAngle( unitZ, Math.round( ( rotation.z - offsetRotation.z ) / scope.rotationSnap ) * scope.rotationSnap );

					} else {

						quaternionX.setFromAxisAngle( unitX, rotation.x - offsetRotation.x );
						quaternionY.setFromAxisAngle( unitY, rotation.y - offsetRotation.y );
						quaternionZ.setFromAxisAngle( unitZ, rotation.z - offsetRotation.z );

					}

					if ( scope.axis === "X" ) quaternionXYZ.multiplyQuaternions( quaternionXYZ, quaternionX );
					if ( scope.axis === "Y" ) quaternionXYZ.multiplyQuaternions( quaternionXYZ, quaternionY );
					if ( scope.axis === "Z" ) quaternionXYZ.multiplyQuaternions( quaternionXYZ, quaternionZ );

					scope.object.quaternion.copy( quaternionXYZ );

				} else if ( scope.space === "world" ) {

					rotation.set( Math.atan2( point.z, point.y ), Math.atan2( point.x, point.z ), Math.atan2( point.y, point.x ) );
					offsetRotation.set( Math.atan2( tempVector.z, tempVector.y ), Math.atan2( tempVector.x, tempVector.z ), Math.atan2( tempVector.y, tempVector.x ) );

					tempQuaternion.setFromRotationMatrix( tempMatrix.getInverse( parentRotationMatrix ) );

					if ( scope.rotationSnap !== null ) {

						quaternionX.setFromAxisAngle( unitX, Math.round( ( rotation.x - offsetRotation.x ) / scope.rotationSnap ) * scope.rotationSnap );
						quaternionY.setFromAxisAngle( unitY, Math.round( ( rotation.y - offsetRotation.y ) / scope.rotationSnap ) * scope.rotationSnap );
						quaternionZ.setFromAxisAngle( unitZ, Math.round( ( rotation.z - offsetRotation.z ) / scope.rotationSnap ) * scope.rotationSnap );

					} else {

						quaternionX.setFromAxisAngle( unitX, rotation.x - offsetRotation.x );
						quaternionY.setFromAxisAngle( unitY, rotation.y - offsetRotation.y );
						quaternionZ.setFromAxisAngle( unitZ, rotation.z - offsetRotation.z );

					}

					quaternionXYZ.setFromRotationMatrix( worldRotationMatrix );

					if ( scope.axis === "X" ) tempQuaternion.multiplyQuaternions( tempQuaternion, quaternionX );
					if ( scope.axis === "Y" ) tempQuaternion.multiplyQuaternions( tempQuaternion, quaternionY );
					if ( scope.axis === "Z" ) tempQuaternion.multiplyQuaternions( tempQuaternion, quaternionZ );

					tempQuaternion.multiplyQuaternions( tempQuaternion, quaternionXYZ );

					scope.object.quaternion.copy( tempQuaternion );

				}

			}

			scope.update();
			scope.dispatchEvent( changeEvent );
			scope.dispatchEvent( objectChangeEvent );

		}

		function onPointerUp( event ) {

			event.preventDefault(); // Prevent MouseEvent on mobile

			if ( event.button !== undefined && event.button !== 0 ) return;

			if ( _dragging && ( scope.axis !== null ) ) {

				mouseUpEvent.mode = _mode;
				scope.dispatchEvent( mouseUpEvent );

			}

			_dragging = false;

			if ( event instanceof TouchEvent ) {

				// Force "rollover"

				scope.axis = null;
				scope.update();
				scope.dispatchEvent( changeEvent );

			} else {

				onPointerHover( event );

			}

		}

		function intersectObjects( pointer, objects ) {

			var rect = domElement.getBoundingClientRect();
			var x = ( pointer.clientX - rect.left ) / rect.width;
			var y = ( pointer.clientY - rect.top ) / rect.height;

			pointerVector.set( ( x * 2 ) - 1, - ( y * 2 ) + 1 );

			ray.setFromCamera( pointerVector, scope.controler );

			var intersections = ray.intersectObjects( objects, true );
			return intersections[ 0 ] ? intersections[ 0 ] : false;

		}

	};

	THREE.TransformControls.prototype = Object.create( THREE.Object3D.prototype );
	THREE.TransformControls.prototype.constructor = THREE.TransformControls;

}() );

// File:examples/js/libs/jszip.min.js

/*!

JSZip - A Javascript class for generating and reading zip files
<http://stuartk.com/jszip>

(c) 2009-2014 Stuart Knightley <stuart [at] stuartk.com>
Dual licenced under the MIT license or GPLv3. See https://raw.github.com/Stuk/jszip/master/LICENSE.markdown.

JSZip uses the library pako released under the MIT license :
https://github.com/nodeca/pako/blob/master/LICENSE
*/
!function(a){if("object"==typeof exports&&"undefined"!=typeof module)module.exports=a();else if("function"==typeof define&&define.amd)define([],a);else{var b;"undefined"!=typeof window?b=window:"undefined"!=typeof global?b=global:"undefined"!=typeof self&&(b=self),b.JSZip=a()}}(function(){return function a(b,c,d){function e(g,h){if(!c[g]){if(!b[g]){var i="function"==typeof require&&require;if(!h&&i)return i(g,!0);if(f)return f(g,!0);throw new Error("Cannot find module '"+g+"'")}var j=c[g]={exports:{}};b[g][0].call(j.exports,function(a){var c=b[g][1][a];return e(c?c:a)},j,j.exports,a,b,c,d)}return c[g].exports}for(var f="function"==typeof require&&require,g=0;g<d.length;g++)e(d[g]);return e}({1:[function(a,b,c){"use strict";var d="ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=";c.encode=function(a){for(var b,c,e,f,g,h,i,j="",k=0;k<a.length;)b=a.charCodeAt(k++),c=a.charCodeAt(k++),e=a.charCodeAt(k++),f=b>>2,g=(3&b)<<4|c>>4,h=(15&c)<<2|e>>6,i=63&e,isNaN(c)?h=i=64:isNaN(e)&&(i=64),j=j+d.charAt(f)+d.charAt(g)+d.charAt(h)+d.charAt(i);return j},c.decode=function(a){var b,c,e,f,g,h,i,j="",k=0;for(a=a.replace(/[^A-Za-z0-9\+\/\=]/g,"");k<a.length;)f=d.indexOf(a.charAt(k++)),g=d.indexOf(a.charAt(k++)),h=d.indexOf(a.charAt(k++)),i=d.indexOf(a.charAt(k++)),b=f<<2|g>>4,c=(15&g)<<4|h>>2,e=(3&h)<<6|i,j+=String.fromCharCode(b),64!=h&&(j+=String.fromCharCode(c)),64!=i&&(j+=String.fromCharCode(e));return j}},{}],2:[function(a,b){"use strict";function c(){this.compressedSize=0,this.uncompressedSize=0,this.crc32=0,this.compressionMethod=null,this.compressedContent=null}c.prototype={getContent:function(){return null},getCompressedContent:function(){return null}},b.exports=c},{}],3:[function(a,b,c){"use strict";c.STORE={magic:"\x00\x00",compress:function(a){return a},uncompress:function(a){return a},compressInputType:null,uncompressInputType:null},c.DEFLATE=a("./flate")},{"./flate":8}],4:[function(a,b){"use strict";var c=a("./utils"),d=[0,1996959894,3993919788,2567524794,124634137,1886057615,3915621685,2657392035,249268274,2044508324,3772115230,2547177864,162941995,2125561021,3887607047,2428444049,498536548,1789927666,4089016648,2227061214,450548861,1843258603,4107580753,2211677639,325883990,1684777152,4251122042,2321926636,335633487,1661365465,4195302755,2366115317,997073096,1281953886,3579855332,2724688242,1006888145,1258607687,3524101629,2768942443,901097722,1119000684,3686517206,2898065728,853044451,1172266101,3705015759,2882616665,651767980,1373503546,3369554304,3218104598,565507253,1454621731,3485111705,3099436303,671266974,1594198024,3322730930,2970347812,795835527,1483230225,3244367275,3060149565,1994146192,31158534,2563907772,4023717930,1907459465,112637215,2680153253,3904427059,2013776290,251722036,2517215374,3775830040,2137656763,141376813,2439277719,3865271297,1802195444,476864866,2238001368,4066508878,1812370925,453092731,2181625025,4111451223,1706088902,314042704,2344532202,4240017532,1658658271,366619977,2362670323,4224994405,1303535960,984961486,2747007092,3569037538,1256170817,1037604311,2765210733,3554079995,1131014506,879679996,2909243462,3663771856,1141124467,855842277,2852801631,3708648649,1342533948,654459306,3188396048,3373015174,1466479909,544179635,3110523913,3462522015,1591671054,702138776,2966460450,3352799412,1504918807,783551873,3082640443,3233442989,3988292384,2596254646,62317068,1957810842,3939845945,2647816111,81470997,1943803523,3814918930,2489596804,225274430,2053790376,3826175755,2466906013,167816743,2097651377,4027552580,2265490386,503444072,1762050814,4150417245,2154129355,426522225,1852507879,4275313526,2312317920,282753626,1742555852,4189708143,2394877945,397917763,1622183637,3604390888,2714866558,953729732,1340076626,3518719985,2797360999,1068828381,1219638859,3624741850,2936675148,906185462,1090812512,3747672003,2825379669,829329135,1181335161,3412177804,3160834842,628085408,1382605366,3423369109,3138078467,570562233,1426400815,3317316542,2998733608,733239954,1555261956,3268935591,3050360625,752459403,1541320221,2607071920,3965973030,1969922972,40735498,2617837225,3943577151,1913087877,83908371,2512341634,3803740692,2075208622,213261112,2463272603,3855990285,2094854071,198958881,2262029012,4057260610,1759359992,534414190,2176718541,4139329115,1873836001,414664567,2282248934,4279200368,1711684554,285281116,2405801727,4167216745,1634467795,376229701,2685067896,3608007406,1308918612,956543938,2808555105,3495958263,1231636301,1047427035,2932959818,3654703836,1088359270,936918e3,2847714899,3736837829,1202900863,817233897,3183342108,3401237130,1404277552,615818150,3134207493,3453421203,1423857449,601450431,3009837614,3294710456,1567103746,711928724,3020668471,3272380065,1510334235,755167117];b.exports=function(a,b){if("undefined"==typeof a||!a.length)return 0;var e="string"!==c.getTypeOf(a);"undefined"==typeof b&&(b=0);var f=0,g=0,h=0;b=-1^b;for(var i=0,j=a.length;j>i;i++)h=e?a[i]:a.charCodeAt(i),g=255&(b^h),f=d[g],b=b>>>8^f;return-1^b}},{"./utils":21}],5:[function(a,b){"use strict";function c(){this.data=null,this.length=0,this.index=0}var d=a("./utils");c.prototype={checkOffset:function(a){this.checkIndex(this.index+a)},checkIndex:function(a){if(this.length<a||0>a)throw new Error("End of data reached (data length = "+this.length+", asked index = "+a+"). Corrupted zip ?")},setIndex:function(a){this.checkIndex(a),this.index=a},skip:function(a){this.setIndex(this.index+a)},byteAt:function(){},readInt:function(a){var b,c=0;for(this.checkOffset(a),b=this.index+a-1;b>=this.index;b--)c=(c<<8)+this.byteAt(b);return this.index+=a,c},readString:function(a){return d.transformTo("string",this.readData(a))},readData:function(){},lastIndexOfSignature:function(){},readDate:function(){var a=this.readInt(4);return new Date((a>>25&127)+1980,(a>>21&15)-1,a>>16&31,a>>11&31,a>>5&63,(31&a)<<1)}},b.exports=c},{"./utils":21}],6:[function(a,b,c){"use strict";c.base64=!1,c.binary=!1,c.dir=!1,c.createFolders=!1,c.date=null,c.compression=null,c.comment=null},{}],7:[function(a,b,c){"use strict";var d=a("./utils");c.string2binary=function(a){return d.string2binary(a)},c.string2Uint8Array=function(a){return d.transformTo("uint8array",a)},c.uint8Array2String=function(a){return d.transformTo("string",a)},c.string2Blob=function(a){var b=d.transformTo("arraybuffer",a);return d.arrayBuffer2Blob(b)},c.arrayBuffer2Blob=function(a){return d.arrayBuffer2Blob(a)},c.transformTo=function(a,b){return d.transformTo(a,b)},c.getTypeOf=function(a){return d.getTypeOf(a)},c.checkSupport=function(a){return d.checkSupport(a)},c.MAX_VALUE_16BITS=d.MAX_VALUE_16BITS,c.MAX_VALUE_32BITS=d.MAX_VALUE_32BITS,c.pretty=function(a){return d.pretty(a)},c.findCompression=function(a){return d.findCompression(a)},c.isRegExp=function(a){return d.isRegExp(a)}},{"./utils":21}],8:[function(a,b,c){"use strict";var d="undefined"!=typeof Uint8Array&&"undefined"!=typeof Uint16Array&&"undefined"!=typeof Uint32Array,e=a("pako");c.uncompressInputType=d?"uint8array":"array",c.compressInputType=d?"uint8array":"array",c.magic="\b\x00",c.compress=function(a){return e.deflateRaw(a)},c.uncompress=function(a){return e.inflateRaw(a)}},{pako:24}],9:[function(a,b){"use strict";function c(a,b){return this instanceof c?(this.files={},this.comment=null,this.root="",a&&this.load(a,b),void(this.clone=function(){var a=new c;for(var b in this)"function"!=typeof this[b]&&(a[b]=this[b]);return a})):new c(a,b)}var d=a("./base64");c.prototype=a("./object"),c.prototype.load=a("./load"),c.support=a("./support"),c.defaults=a("./defaults"),c.utils=a("./deprecatedPublicUtils"),c.base64={encode:function(a){return d.encode(a)},decode:function(a){return d.decode(a)}},c.compressions=a("./compressions"),b.exports=c},{"./base64":1,"./compressions":3,"./defaults":6,"./deprecatedPublicUtils":7,"./load":10,"./object":13,"./support":17}],10:[function(a,b){"use strict";var c=a("./base64"),d=a("./zipEntries");b.exports=function(a,b){var e,f,g,h;for(b=b||{},b.base64&&(a=c.decode(a)),f=new d(a,b),e=f.files,g=0;g<e.length;g++)h=e[g],this.file(h.fileName,h.decompressed,{binary:!0,optimizedBinaryString:!0,date:h.date,dir:h.dir,comment:h.fileComment.length?h.fileComment:null,createFolders:b.createFolders});return f.zipComment.length&&(this.comment=f.zipComment),this}},{"./base64":1,"./zipEntries":22}],11:[function(a,b){(function(a){"use strict";b.exports=function(b,c){return new a(b,c)},b.exports.test=function(b){return a.isBuffer(b)}}).call(this,"undefined"!=typeof Buffer?Buffer:void 0)},{}],12:[function(a,b){"use strict";function c(a){this.data=a,this.length=this.data.length,this.index=0}var d=a("./uint8ArrayReader");c.prototype=new d,c.prototype.readData=function(a){this.checkOffset(a);var b=this.data.slice(this.index,this.index+a);return this.index+=a,b},b.exports=c},{"./uint8ArrayReader":18}],13:[function(a,b){"use strict";var c=a("./support"),d=a("./utils"),e=a("./crc32"),f=a("./signature"),g=a("./defaults"),h=a("./base64"),i=a("./compressions"),j=a("./compressedObject"),k=a("./nodeBuffer"),l=a("./utf8"),m=a("./stringWriter"),n=a("./uint8ArrayWriter"),o=function(a){if(a._data instanceof j&&(a._data=a._data.getContent(),a.options.binary=!0,a.options.base64=!1,"uint8array"===d.getTypeOf(a._data))){var b=a._data;a._data=new Uint8Array(b.length),0!==b.length&&a._data.set(b,0)}return a._data},p=function(a){var b=o(a),e=d.getTypeOf(b);return"string"===e?!a.options.binary&&c.nodebuffer?k(b,"utf-8"):a.asBinary():b},q=function(a){var b=o(this);return null===b||"undefined"==typeof b?"":(this.options.base64&&(b=h.decode(b)),b=a&&this.options.binary?A.utf8decode(b):d.transformTo("string",b),a||this.options.binary||(b=d.transformTo("string",A.utf8encode(b))),b)},r=function(a,b,c){this.name=a,this.dir=c.dir,this.date=c.date,this.comment=c.comment,this._data=b,this.options=c,this._initialMetadata={dir:c.dir,date:c.date}};r.prototype={asText:function(){return q.call(this,!0)},asBinary:function(){return q.call(this,!1)},asNodeBuffer:function(){var a=p(this);return d.transformTo("nodebuffer",a)},asUint8Array:function(){var a=p(this);return d.transformTo("uint8array",a)},asArrayBuffer:function(){return this.asUint8Array().buffer}};var s=function(a,b){var c,d="";for(c=0;b>c;c++)d+=String.fromCharCode(255&a),a>>>=8;return d},t=function(){var a,b,c={};for(a=0;a<arguments.length;a++)for(b in arguments[a])arguments[a].hasOwnProperty(b)&&"undefined"==typeof c[b]&&(c[b]=arguments[a][b]);return c},u=function(a){return a=a||{},a.base64!==!0||null!==a.binary&&void 0!==a.binary||(a.binary=!0),a=t(a,g),a.date=a.date||new Date,null!==a.compression&&(a.compression=a.compression.toUpperCase()),a},v=function(a,b,c){var e,f=d.getTypeOf(b);if(c=u(c),c.createFolders&&(e=w(a))&&x.call(this,e,!0),c.dir||null===b||"undefined"==typeof b)c.base64=!1,c.binary=!1,b=null;else if("string"===f)c.binary&&!c.base64&&c.optimizedBinaryString!==!0&&(b=d.string2binary(b));else{if(c.base64=!1,c.binary=!0,!(f||b instanceof j))throw new Error("The data of '"+a+"' is in an unsupported format !");"arraybuffer"===f&&(b=d.transformTo("uint8array",b))}var g=new r(a,b,c);return this.files[a]=g,g},w=function(a){"/"==a.slice(-1)&&(a=a.substring(0,a.length-1));var b=a.lastIndexOf("/");return b>0?a.substring(0,b):""},x=function(a,b){return"/"!=a.slice(-1)&&(a+="/"),b="undefined"!=typeof b?b:!1,this.files[a]||v.call(this,a,null,{dir:!0,createFolders:b}),this.files[a]},y=function(a,b){var c,f=new j;return a._data instanceof j?(f.uncompressedSize=a._data.uncompressedSize,f.crc32=a._data.crc32,0===f.uncompressedSize||a.dir?(b=i.STORE,f.compressedContent="",f.crc32=0):a._data.compressionMethod===b.magic?f.compressedContent=a._data.getCompressedContent():(c=a._data.getContent(),f.compressedContent=b.compress(d.transformTo(b.compressInputType,c)))):(c=p(a),(!c||0===c.length||a.dir)&&(b=i.STORE,c=""),f.uncompressedSize=c.length,f.crc32=e(c),f.compressedContent=b.compress(d.transformTo(b.compressInputType,c))),f.compressedSize=f.compressedContent.length,f.compressionMethod=b.magic,f},z=function(a,b,c,g){var h,i,j,k,m=(c.compressedContent,d.transformTo("string",l.utf8encode(b.name))),n=b.comment||"",o=d.transformTo("string",l.utf8encode(n)),p=m.length!==b.name.length,q=o.length!==n.length,r=b.options,t="",u="",v="";j=b._initialMetadata.dir!==b.dir?b.dir:r.dir,k=b._initialMetadata.date!==b.date?b.date:r.date,h=k.getHours(),h<<=6,h|=k.getMinutes(),h<<=5,h|=k.getSeconds()/2,i=k.getFullYear()-1980,i<<=4,i|=k.getMonth()+1,i<<=5,i|=k.getDate(),p&&(u=s(1,1)+s(e(m),4)+m,t+="up"+s(u.length,2)+u),q&&(v=s(1,1)+s(this.crc32(o),4)+o,t+="uc"+s(v.length,2)+v);var w="";w+="\n\x00",w+=p||q?"\x00\b":"\x00\x00",w+=c.compressionMethod,w+=s(h,2),w+=s(i,2),w+=s(c.crc32,4),w+=s(c.compressedSize,4),w+=s(c.uncompressedSize,4),w+=s(m.length,2),w+=s(t.length,2);var x=f.LOCAL_FILE_HEADER+w+m+t,y=f.CENTRAL_FILE_HEADER+"\x00"+w+s(o.length,2)+"\x00\x00\x00\x00"+(j===!0?"\x00\x00\x00":"\x00\x00\x00\x00")+s(g,4)+m+t+o;return{fileRecord:x,dirRecord:y,compressedObject:c}},A={load:function(){throw new Error("Load method is not defined. Is the file jszip-load.js included ?")},filter:function(a){var b,c,d,e,f=[];for(b in this.files)this.files.hasOwnProperty(b)&&(d=this.files[b],e=new r(d.name,d._data,t(d.options)),c=b.slice(this.root.length,b.length),b.slice(0,this.root.length)===this.root&&a(c,e)&&f.push(e));return f},file:function(a,b,c){if(1===arguments.length){if(d.isRegExp(a)){var e=a;return this.filter(function(a,b){return!b.dir&&e.test(a)})}return this.filter(function(b,c){return!c.dir&&b===a})[0]||null}return a=this.root+a,v.call(this,a,b,c),this},folder:function(a){if(!a)return this;if(d.isRegExp(a))return this.filter(function(b,c){return c.dir&&a.test(b)});var b=this.root+a,c=x.call(this,b),e=this.clone();return e.root=c.name,e},remove:function(a){a=this.root+a;var b=this.files[a];if(b||("/"!=a.slice(-1)&&(a+="/"),b=this.files[a]),b&&!b.dir)delete this.files[a];else for(var c=this.filter(function(b,c){return c.name.slice(0,a.length)===a}),d=0;d<c.length;d++)delete this.files[c[d].name];return this},generate:function(a){a=t(a||{},{base64:!0,compression:"STORE",type:"base64",comment:null}),d.checkSupport(a.type);var b,c,e=[],g=0,j=0,k=d.transformTo("string",this.utf8encode(a.comment||this.comment||""));for(var l in this.files)if(this.files.hasOwnProperty(l)){var o=this.files[l],p=o.options.compression||a.compression.toUpperCase(),q=i[p];if(!q)throw new Error(p+" is not a valid compression method !");var r=y.call(this,o,q),u=z.call(this,l,o,r,g);g+=u.fileRecord.length+r.compressedSize,j+=u.dirRecord.length,e.push(u)}var v="";v=f.CENTRAL_DIRECTORY_END+"\x00\x00\x00\x00"+s(e.length,2)+s(e.length,2)+s(j,4)+s(g,4)+s(k.length,2)+k;var w=a.type.toLowerCase();for(b="uint8array"===w||"arraybuffer"===w||"blob"===w||"nodebuffer"===w?new n(g+j+v.length):new m(g+j+v.length),c=0;c<e.length;c++)b.append(e[c].fileRecord),b.append(e[c].compressedObject.compressedContent);for(c=0;c<e.length;c++)b.append(e[c].dirRecord);b.append(v);var x=b.finalize();switch(a.type.toLowerCase()){case"uint8array":case"arraybuffer":case"nodebuffer":return d.transformTo(a.type.toLowerCase(),x);case"blob":return d.arrayBuffer2Blob(d.transformTo("arraybuffer",x));case"base64":return a.base64?h.encode(x):x;default:return x}},crc32:function(a,b){return e(a,b)},utf8encode:function(a){return d.transformTo("string",l.utf8encode(a))},utf8decode:function(a){return l.utf8decode(a)}};b.exports=A},{"./base64":1,"./compressedObject":2,"./compressions":3,"./crc32":4,"./defaults":6,"./nodeBuffer":11,"./signature":14,"./stringWriter":16,"./support":17,"./uint8ArrayWriter":19,"./utf8":20,"./utils":21}],14:[function(a,b,c){"use strict";c.LOCAL_FILE_HEADER="PK",c.CENTRAL_FILE_HEADER="PK",c.CENTRAL_DIRECTORY_END="PK",c.ZIP64_CENTRAL_DIRECTORY_LOCATOR="PK",c.ZIP64_CENTRAL_DIRECTORY_END="PK",c.DATA_DESCRIPTOR="PK\b"},{}],15:[function(a,b){"use strict";function c(a,b){this.data=a,b||(this.data=e.string2binary(this.data)),this.length=this.data.length,this.index=0}var d=a("./dataReader"),e=a("./utils");c.prototype=new d,c.prototype.byteAt=function(a){return this.data.charCodeAt(a)},c.prototype.lastIndexOfSignature=function(a){return this.data.lastIndexOf(a)},c.prototype.readData=function(a){this.checkOffset(a);var b=this.data.slice(this.index,this.index+a);return this.index+=a,b},b.exports=c},{"./dataReader":5,"./utils":21}],16:[function(a,b){"use strict";var c=a("./utils"),d=function(){this.data=[]};d.prototype={append:function(a){a=c.transformTo("string",a),this.data.push(a)},finalize:function(){return this.data.join("")}},b.exports=d},{"./utils":21}],17:[function(a,b,c){(function(a){"use strict";if(c.base64=!0,c.array=!0,c.string=!0,c.arraybuffer="undefined"!=typeof ArrayBuffer&&"undefined"!=typeof Uint8Array,c.nodebuffer="undefined"!=typeof a,c.uint8array="undefined"!=typeof Uint8Array,"undefined"==typeof ArrayBuffer)c.blob=!1;else{var b=new ArrayBuffer(0);try{c.blob=0===new Blob([b],{type:"application/zip"}).size}catch(d){try{var e=window.BlobBuilder||window.WebKitBlobBuilder||window.MozBlobBuilder||window.MSBlobBuilder,f=new e;f.append(b),c.blob=0===f.getBlob("application/zip").size}catch(d){c.blob=!1}}}}).call(this,"undefined"!=typeof Buffer?Buffer:void 0)},{}],18:[function(a,b){"use strict";function c(a){a&&(this.data=a,this.length=this.data.length,this.index=0)}var d=a("./dataReader");c.prototype=new d,c.prototype.byteAt=function(a){return this.data[a]},c.prototype.lastIndexOfSignature=function(a){for(var b=a.charCodeAt(0),c=a.charCodeAt(1),d=a.charCodeAt(2),e=a.charCodeAt(3),f=this.length-4;f>=0;--f)if(this.data[f]===b&&this.data[f+1]===c&&this.data[f+2]===d&&this.data[f+3]===e)return f;return-1},c.prototype.readData=function(a){if(this.checkOffset(a),0===a)return new Uint8Array(0);var b=this.data.subarray(this.index,this.index+a);return this.index+=a,b},b.exports=c},{"./dataReader":5}],19:[function(a,b){"use strict";var c=a("./utils"),d=function(a){this.data=new Uint8Array(a),this.index=0};d.prototype={append:function(a){0!==a.length&&(a=c.transformTo("uint8array",a),this.data.set(a,this.index),this.index+=a.length)},finalize:function(){return this.data}},b.exports=d},{"./utils":21}],20:[function(a,b,c){"use strict";for(var d=a("./utils"),e=a("./support"),f=a("./nodeBuffer"),g=new Array(256),h=0;256>h;h++)g[h]=h>=252?6:h>=248?5:h>=240?4:h>=224?3:h>=192?2:1;g[254]=g[254]=1;var i=function(a){var b,c,d,f,g,h=a.length,i=0;for(f=0;h>f;f++)c=a.charCodeAt(f),55296===(64512&c)&&h>f+1&&(d=a.charCodeAt(f+1),56320===(64512&d)&&(c=65536+(c-55296<<10)+(d-56320),f++)),i+=128>c?1:2048>c?2:65536>c?3:4;for(b=e.uint8array?new Uint8Array(i):new Array(i),g=0,f=0;i>g;f++)c=a.charCodeAt(f),55296===(64512&c)&&h>f+1&&(d=a.charCodeAt(f+1),56320===(64512&d)&&(c=65536+(c-55296<<10)+(d-56320),f++)),128>c?b[g++]=c:2048>c?(b[g++]=192|c>>>6,b[g++]=128|63&c):65536>c?(b[g++]=224|c>>>12,b[g++]=128|c>>>6&63,b[g++]=128|63&c):(b[g++]=240|c>>>18,b[g++]=128|c>>>12&63,b[g++]=128|c>>>6&63,b[g++]=128|63&c);return b},j=function(a,b){var c;for(b=b||a.length,b>a.length&&(b=a.length),c=b-1;c>=0&&128===(192&a[c]);)c--;return 0>c?b:0===c?b:c+g[a[c]]>b?c:b},k=function(a){var b,c,e,f,h=a.length,i=new Array(2*h);for(c=0,b=0;h>b;)if(e=a[b++],128>e)i[c++]=e;else if(f=g[e],f>4)i[c++]=65533,b+=f-1;else{for(e&=2===f?31:3===f?15:7;f>1&&h>b;)e=e<<6|63&a[b++],f--;f>1?i[c++]=65533:65536>e?i[c++]=e:(e-=65536,i[c++]=55296|e>>10&1023,i[c++]=56320|1023&e)}return i.length!==c&&(i.subarray?i=i.subarray(0,c):i.length=c),d.applyFromCharCode(i)};c.utf8encode=function(a){return e.nodebuffer?f(a,"utf-8"):i(a)},c.utf8decode=function(a){if(e.nodebuffer)return d.transformTo("nodebuffer",a).toString("utf-8");a=d.transformTo(e.uint8array?"uint8array":"array",a);for(var b=[],c=0,f=a.length,g=65536;f>c;){var h=j(a,Math.min(c+g,f));b.push(e.uint8array?k(a.subarray(c,h)):k(a.slice(c,h))),c=h}return b.join("")}},{"./nodeBuffer":11,"./support":17,"./utils":21}],21:[function(a,b,c){"use strict";function d(a){return a}function e(a,b){for(var c=0;c<a.length;++c)b[c]=255&a.charCodeAt(c);return b}function f(a){var b=65536,d=[],e=a.length,f=c.getTypeOf(a),g=0,h=!0;try{switch(f){case"uint8array":String.fromCharCode.apply(null,new Uint8Array(0));break;case"nodebuffer":String.fromCharCode.apply(null,j(0))}}catch(i){h=!1}if(!h){for(var k="",l=0;l<a.length;l++)k+=String.fromCharCode(a[l]);return k}for(;e>g&&b>1;)try{d.push("array"===f||"nodebuffer"===f?String.fromCharCode.apply(null,a.slice(g,Math.min(g+b,e))):String.fromCharCode.apply(null,a.subarray(g,Math.min(g+b,e)))),g+=b}catch(i){b=Math.floor(b/2)}return d.join("")}function g(a,b){for(var c=0;c<a.length;c++)b[c]=a[c];return b}var h=a("./support"),i=a("./compressions"),j=a("./nodeBuffer");c.string2binary=function(a){for(var b="",c=0;c<a.length;c++)b+=String.fromCharCode(255&a.charCodeAt(c));return b},c.arrayBuffer2Blob=function(a){c.checkSupport("blob");try{return new Blob([a],{type:"application/zip"})}catch(b){try{var d=window.BlobBuilder||window.WebKitBlobBuilder||window.MozBlobBuilder||window.MSBlobBuilder,e=new d;return e.append(a),e.getBlob("application/zip")}catch(b){throw new Error("Bug : can't construct the Blob.")}}},c.applyFromCharCode=f;var k={};k.string={string:d,array:function(a){return e(a,new Array(a.length))},arraybuffer:function(a){return k.string.uint8array(a).buffer},uint8array:function(a){return e(a,new Uint8Array(a.length))},nodebuffer:function(a){return e(a,j(a.length))}},k.array={string:f,array:d,arraybuffer:function(a){return new Uint8Array(a).buffer},uint8array:function(a){return new Uint8Array(a)},nodebuffer:function(a){return j(a)}},k.arraybuffer={string:function(a){return f(new Uint8Array(a))},array:function(a){return g(new Uint8Array(a),new Array(a.byteLength))},arraybuffer:d,uint8array:function(a){return new Uint8Array(a)},nodebuffer:function(a){return j(new Uint8Array(a))}},k.uint8array={string:f,array:function(a){return g(a,new Array(a.length))},arraybuffer:function(a){return a.buffer},uint8array:d,nodebuffer:function(a){return j(a)}},k.nodebuffer={string:f,array:function(a){return g(a,new Array(a.length))},arraybuffer:function(a){return k.nodebuffer.uint8array(a).buffer},uint8array:function(a){return g(a,new Uint8Array(a.length))},nodebuffer:d},c.transformTo=function(a,b){if(b||(b=""),!a)return b;c.checkSupport(a);var d=c.getTypeOf(b),e=k[d][a](b);return e},c.getTypeOf=function(a){return"string"==typeof a?"string":"[object Array]"===Object.prototype.toString.call(a)?"array":h.nodebuffer&&j.test(a)?"nodebuffer":h.uint8array&&a instanceof Uint8Array?"uint8array":h.arraybuffer&&a instanceof ArrayBuffer?"arraybuffer":void 0},c.checkSupport=function(a){var b=h[a.toLowerCase()];if(!b)throw new Error(a+" is not supported by this browser")},c.MAX_VALUE_16BITS=65535,c.MAX_VALUE_32BITS=-1,c.pretty=function(a){var b,c,d="";for(c=0;c<(a||"").length;c++)b=a.charCodeAt(c),d+="\\x"+(16>b?"0":"")+b.toString(16).toUpperCase();return d},c.findCompression=function(a){for(var b in i)if(i.hasOwnProperty(b)&&i[b].magic===a)return i[b];return null},c.isRegExp=function(a){return"[object RegExp]"===Object.prototype.toString.call(a)}},{"./compressions":3,"./nodeBuffer":11,"./support":17}],22:[function(a,b){"use strict";function c(a,b){this.files=[],this.loadOptions=b,a&&this.load(a)}var d=a("./stringReader"),e=a("./nodeBufferReader"),f=a("./uint8ArrayReader"),g=a("./utils"),h=a("./signature"),i=a("./zipEntry"),j=a("./support"),k=a("./object");c.prototype={checkSignature:function(a){var b=this.reader.readString(4);if(b!==a)throw new Error("Corrupted zip or bug : unexpected signature ("+g.pretty(b)+", expected "+g.pretty(a)+")")},readBlockEndOfCentral:function(){this.diskNumber=this.reader.readInt(2),this.diskWithCentralDirStart=this.reader.readInt(2),this.centralDirRecordsOnThisDisk=this.reader.readInt(2),this.centralDirRecords=this.reader.readInt(2),this.centralDirSize=this.reader.readInt(4),this.centralDirOffset=this.reader.readInt(4),this.zipCommentLength=this.reader.readInt(2),this.zipComment=this.reader.readString(this.zipCommentLength),this.zipComment=k.utf8decode(this.zipComment)},readBlockZip64EndOfCentral:function(){this.zip64EndOfCentralSize=this.reader.readInt(8),this.versionMadeBy=this.reader.readString(2),this.versionNeeded=this.reader.readInt(2),this.diskNumber=this.reader.readInt(4),this.diskWithCentralDirStart=this.reader.readInt(4),this.centralDirRecordsOnThisDisk=this.reader.readInt(8),this.centralDirRecords=this.reader.readInt(8),this.centralDirSize=this.reader.readInt(8),this.centralDirOffset=this.reader.readInt(8),this.zip64ExtensibleData={};for(var a,b,c,d=this.zip64EndOfCentralSize-44,e=0;d>e;)a=this.reader.readInt(2),b=this.reader.readInt(4),c=this.reader.readString(b),this.zip64ExtensibleData[a]={id:a,length:b,value:c}},readBlockZip64EndOfCentralLocator:function(){if(this.diskWithZip64CentralDirStart=this.reader.readInt(4),this.relativeOffsetEndOfZip64CentralDir=this.reader.readInt(8),this.disksCount=this.reader.readInt(4),this.disksCount>1)throw new Error("Multi-volumes zip are not supported")},readLocalFiles:function(){var a,b;for(a=0;a<this.files.length;a++)b=this.files[a],this.reader.setIndex(b.localHeaderOffset),this.checkSignature(h.LOCAL_FILE_HEADER),b.readLocalPart(this.reader),b.handleUTF8()},readCentralDir:function(){var a;for(this.reader.setIndex(this.centralDirOffset);this.reader.readString(4)===h.CENTRAL_FILE_HEADER;)a=new i({zip64:this.zip64},this.loadOptions),a.readCentralPart(this.reader),this.files.push(a)},readEndOfCentral:function(){var a=this.reader.lastIndexOfSignature(h.CENTRAL_DIRECTORY_END);if(-1===a)throw new Error("Corrupted zip : can't find end of central directory");if(this.reader.setIndex(a),this.checkSignature(h.CENTRAL_DIRECTORY_END),this.readBlockEndOfCentral(),this.diskNumber===g.MAX_VALUE_16BITS||this.diskWithCentralDirStart===g.MAX_VALUE_16BITS||this.centralDirRecordsOnThisDisk===g.MAX_VALUE_16BITS||this.centralDirRecords===g.MAX_VALUE_16BITS||this.centralDirSize===g.MAX_VALUE_32BITS||this.centralDirOffset===g.MAX_VALUE_32BITS){if(this.zip64=!0,a=this.reader.lastIndexOfSignature(h.ZIP64_CENTRAL_DIRECTORY_LOCATOR),-1===a)throw new Error("Corrupted zip : can't find the ZIP64 end of central directory locator");this.reader.setIndex(a),this.checkSignature(h.ZIP64_CENTRAL_DIRECTORY_LOCATOR),this.readBlockZip64EndOfCentralLocator(),this.reader.setIndex(this.relativeOffsetEndOfZip64CentralDir),this.checkSignature(h.ZIP64_CENTRAL_DIRECTORY_END),this.readBlockZip64EndOfCentral()}},prepareReader:function(a){var b=g.getTypeOf(a);this.reader="string"!==b||j.uint8array?"nodebuffer"===b?new e(a):new f(g.transformTo("uint8array",a)):new d(a,this.loadOptions.optimizedBinaryString)},load:function(a){this.prepareReader(a),this.readEndOfCentral(),this.readCentralDir(),this.readLocalFiles()}},b.exports=c},{"./nodeBufferReader":12,"./object":13,"./signature":14,"./stringReader":15,"./support":17,"./uint8ArrayReader":18,"./utils":21,"./zipEntry":23}],23:[function(a,b){"use strict";function c(a,b){this.options=a,this.loadOptions=b}var d=a("./stringReader"),e=a("./utils"),f=a("./compressedObject"),g=a("./object");c.prototype={isEncrypted:function(){return 1===(1&this.bitFlag)},useUTF8:function(){return 2048===(2048&this.bitFlag)},prepareCompressedContent:function(a,b,c){return function(){var d=a.index;a.setIndex(b);var e=a.readData(c);return a.setIndex(d),e}},prepareContent:function(a,b,c,d,f){return function(){var a=e.transformTo(d.uncompressInputType,this.getCompressedContent()),b=d.uncompress(a);if(b.length!==f)throw new Error("Bug : uncompressed data size mismatch");return b}},readLocalPart:function(a){var b,c;if(a.skip(22),this.fileNameLength=a.readInt(2),c=a.readInt(2),this.fileName=a.readString(this.fileNameLength),a.skip(c),-1==this.compressedSize||-1==this.uncompressedSize)throw new Error("Bug or corrupted zip : didn't get enough informations from the central directory (compressedSize == -1 || uncompressedSize == -1)");if(b=e.findCompression(this.compressionMethod),null===b)throw new Error("Corrupted zip : compression "+e.pretty(this.compressionMethod)+" unknown (inner file : "+this.fileName+")");if(this.decompressed=new f,this.decompressed.compressedSize=this.compressedSize,this.decompressed.uncompressedSize=this.uncompressedSize,this.decompressed.crc32=this.crc32,this.decompressed.compressionMethod=this.compressionMethod,this.decompressed.getCompressedContent=this.prepareCompressedContent(a,a.index,this.compressedSize,b),this.decompressed.getContent=this.prepareContent(a,a.index,this.compressedSize,b,this.uncompressedSize),this.loadOptions.checkCRC32&&(this.decompressed=e.transformTo("string",this.decompressed.getContent()),g.crc32(this.decompressed)!==this.crc32))throw new Error("Corrupted zip : CRC32 mismatch")},readCentralPart:function(a){if(this.versionMadeBy=a.readString(2),this.versionNeeded=a.readInt(2),this.bitFlag=a.readInt(2),this.compressionMethod=a.readString(2),this.date=a.readDate(),this.crc32=a.readInt(4),this.compressedSize=a.readInt(4),this.uncompressedSize=a.readInt(4),this.fileNameLength=a.readInt(2),this.extraFieldsLength=a.readInt(2),this.fileCommentLength=a.readInt(2),this.diskNumberStart=a.readInt(2),this.internalFileAttributes=a.readInt(2),this.externalFileAttributes=a.readInt(4),this.localHeaderOffset=a.readInt(4),this.isEncrypted())throw new Error("Encrypted zip are not supported");this.fileName=a.readString(this.fileNameLength),this.readExtraFields(a),this.parseZIP64ExtraField(a),this.fileComment=a.readString(this.fileCommentLength),this.dir=16&this.externalFileAttributes?!0:!1},parseZIP64ExtraField:function(){if(this.extraFields[1]){var a=new d(this.extraFields[1].value);this.uncompressedSize===e.MAX_VALUE_32BITS&&(this.uncompressedSize=a.readInt(8)),this.compressedSize===e.MAX_VALUE_32BITS&&(this.compressedSize=a.readInt(8)),this.localHeaderOffset===e.MAX_VALUE_32BITS&&(this.localHeaderOffset=a.readInt(8)),this.diskNumberStart===e.MAX_VALUE_32BITS&&(this.diskNumberStart=a.readInt(4))}},readExtraFields:function(a){var b,c,d,e=a.index;for(this.extraFields=this.extraFields||{};a.index<e+this.extraFieldsLength;)b=a.readInt(2),c=a.readInt(2),d=a.readString(c),this.extraFields[b]={id:b,length:c,value:d}},handleUTF8:function(){if(this.useUTF8())this.fileName=g.utf8decode(this.fileName),this.fileComment=g.utf8decode(this.fileComment);else{var a=this.findExtraFieldUnicodePath();null!==a&&(this.fileName=a);var b=this.findExtraFieldUnicodeComment();null!==b&&(this.fileComment=b)}},findExtraFieldUnicodePath:function(){var a=this.extraFields[28789];if(a){var b=new d(a.value);return 1!==b.readInt(1)?null:g.crc32(this.fileName)!==b.readInt(4)?null:g.utf8decode(b.readString(a.length-5))}return null},findExtraFieldUnicodeComment:function(){var a=this.extraFields[25461];if(a){var b=new d(a.value);return 1!==b.readInt(1)?null:g.crc32(this.fileComment)!==b.readInt(4)?null:g.utf8decode(b.readString(a.length-5))}return null}},b.exports=c},{"./compressedObject":2,"./object":13,"./stringReader":15,"./utils":21}],24:[function(a,b){"use strict";var c=a("./lib/utils/common").assign,d=a("./lib/deflate"),e=a("./lib/inflate"),f=a("./lib/zlib/constants"),g={};c(g,d,e,f),b.exports=g},{"./lib/deflate":25,"./lib/inflate":26,"./lib/utils/common":27,"./lib/zlib/constants":30}],25:[function(a,b,c){"use strict";function d(a,b){var c=new s(b);if(c.push(a,!0),c.err)throw c.msg;return c.result}function e(a,b){return b=b||{},b.raw=!0,d(a,b)}function f(a,b){return b=b||{},b.gzip=!0,d(a,b)}var g=a("./zlib/deflate.js"),h=a("./utils/common"),i=a("./utils/strings"),j=a("./zlib/messages"),k=a("./zlib/zstream"),l=0,m=4,n=0,o=1,p=-1,q=0,r=8,s=function(a){this.options=h.assign({level:p,method:r,chunkSize:16384,windowBits:15,memLevel:8,strategy:q,to:""},a||{});var b=this.options;b.raw&&b.windowBits>0?b.windowBits=-b.windowBits:b.gzip&&b.windowBits>0&&b.windowBits<16&&(b.windowBits+=16),this.err=0,this.msg="",this.ended=!1,this.chunks=[],this.strm=new k,this.strm.avail_out=0;var c=g.deflateInit2(this.strm,b.level,b.method,b.windowBits,b.memLevel,b.strategy);if(c!==n)throw new Error(j[c]);b.header&&g.deflateSetHeader(this.strm,b.header)
};s.prototype.push=function(a,b){var c,d,e=this.strm,f=this.options.chunkSize;if(this.ended)return!1;d=b===~~b?b:b===!0?m:l,e.input="string"==typeof a?i.string2buf(a):a,e.next_in=0,e.avail_in=e.input.length;do{if(0===e.avail_out&&(e.output=new h.Buf8(f),e.next_out=0,e.avail_out=f),c=g.deflate(e,d),c!==o&&c!==n)return this.onEnd(c),this.ended=!0,!1;(0===e.avail_out||0===e.avail_in&&d===m)&&this.onData("string"===this.options.to?i.buf2binstring(h.shrinkBuf(e.output,e.next_out)):h.shrinkBuf(e.output,e.next_out))}while((e.avail_in>0||0===e.avail_out)&&c!==o);return d===m?(c=g.deflateEnd(this.strm),this.onEnd(c),this.ended=!0,c===n):!0},s.prototype.onData=function(a){this.chunks.push(a)},s.prototype.onEnd=function(a){a===n&&(this.result="string"===this.options.to?this.chunks.join(""):h.flattenChunks(this.chunks)),this.chunks=[],this.err=a,this.msg=this.strm.msg},c.Deflate=s,c.deflate=d,c.deflateRaw=e,c.gzip=f},{"./utils/common":27,"./utils/strings":28,"./zlib/deflate.js":32,"./zlib/messages":37,"./zlib/zstream":39}],26:[function(a,b,c){"use strict";function d(a,b){var c=new m(b);if(c.push(a,!0),c.err)throw c.msg;return c.result}function e(a,b){return b=b||{},b.raw=!0,d(a,b)}var f=a("./zlib/inflate.js"),g=a("./utils/common"),h=a("./utils/strings"),i=a("./zlib/constants"),j=a("./zlib/messages"),k=a("./zlib/zstream"),l=a("./zlib/gzheader"),m=function(a){this.options=g.assign({chunkSize:16384,windowBits:0,to:""},a||{});var b=this.options;b.raw&&b.windowBits>=0&&b.windowBits<16&&(b.windowBits=-b.windowBits,0===b.windowBits&&(b.windowBits=-15)),!(b.windowBits>=0&&b.windowBits<16)||a&&a.windowBits||(b.windowBits+=32),b.windowBits>15&&b.windowBits<48&&0===(15&b.windowBits)&&(b.windowBits|=15),this.err=0,this.msg="",this.ended=!1,this.chunks=[],this.strm=new k,this.strm.avail_out=0;var c=f.inflateInit2(this.strm,b.windowBits);if(c!==i.Z_OK)throw new Error(j[c]);this.header=new l,f.inflateGetHeader(this.strm,this.header)};m.prototype.push=function(a,b){var c,d,e,j,k,l=this.strm,m=this.options.chunkSize;if(this.ended)return!1;d=b===~~b?b:b===!0?i.Z_FINISH:i.Z_NO_FLUSH,l.input="string"==typeof a?h.binstring2buf(a):a,l.next_in=0,l.avail_in=l.input.length;do{if(0===l.avail_out&&(l.output=new g.Buf8(m),l.next_out=0,l.avail_out=m),c=f.inflate(l,i.Z_NO_FLUSH),c!==i.Z_STREAM_END&&c!==i.Z_OK)return this.onEnd(c),this.ended=!0,!1;l.next_out&&(0===l.avail_out||c===i.Z_STREAM_END||0===l.avail_in&&d===i.Z_FINISH)&&("string"===this.options.to?(e=h.utf8border(l.output,l.next_out),j=l.next_out-e,k=h.buf2string(l.output,e),l.next_out=j,l.avail_out=m-j,j&&g.arraySet(l.output,l.output,e,j,0),this.onData(k)):this.onData(g.shrinkBuf(l.output,l.next_out)))}while(l.avail_in>0&&c!==i.Z_STREAM_END);return c===i.Z_STREAM_END&&(d=i.Z_FINISH),d===i.Z_FINISH?(c=f.inflateEnd(this.strm),this.onEnd(c),this.ended=!0,c===i.Z_OK):!0},m.prototype.onData=function(a){this.chunks.push(a)},m.prototype.onEnd=function(a){a===i.Z_OK&&(this.result="string"===this.options.to?this.chunks.join(""):g.flattenChunks(this.chunks)),this.chunks=[],this.err=a,this.msg=this.strm.msg},c.Inflate=m,c.inflate=d,c.inflateRaw=e,c.ungzip=d},{"./utils/common":27,"./utils/strings":28,"./zlib/constants":30,"./zlib/gzheader":33,"./zlib/inflate.js":35,"./zlib/messages":37,"./zlib/zstream":39}],27:[function(a,b,c){"use strict";var d="undefined"!=typeof Uint8Array&&"undefined"!=typeof Uint16Array&&"undefined"!=typeof Int32Array;c.assign=function(a){for(var b=Array.prototype.slice.call(arguments,1);b.length;){var c=b.shift();if(c){if("object"!=typeof c)throw new TypeError(c+"must be non-object");for(var d in c)c.hasOwnProperty(d)&&(a[d]=c[d])}}return a},c.shrinkBuf=function(a,b){return a.length===b?a:a.subarray?a.subarray(0,b):(a.length=b,a)};var e={arraySet:function(a,b,c,d,e){if(b.subarray&&a.subarray)return void a.set(b.subarray(c,c+d),e);for(var f=0;d>f;f++)a[e+f]=b[c+f]},flattenChunks:function(a){var b,c,d,e,f,g;for(d=0,b=0,c=a.length;c>b;b++)d+=a[b].length;for(g=new Uint8Array(d),e=0,b=0,c=a.length;c>b;b++)f=a[b],g.set(f,e),e+=f.length;return g}},f={arraySet:function(a,b,c,d,e){for(var f=0;d>f;f++)a[e+f]=b[c+f]},flattenChunks:function(a){return[].concat.apply([],a)}};c.setTyped=function(a){a?(c.Buf8=Uint8Array,c.Buf16=Uint16Array,c.Buf32=Int32Array,c.assign(c,e)):(c.Buf8=Array,c.Buf16=Array,c.Buf32=Array,c.assign(c,f))},c.setTyped(d)},{}],28:[function(a,b,c){"use strict";function d(a,b){if(65537>b&&(a.subarray&&g||!a.subarray&&f))return String.fromCharCode.apply(null,e.shrinkBuf(a,b));for(var c="",d=0;b>d;d++)c+=String.fromCharCode(a[d]);return c}var e=a("./common"),f=!0,g=!0;try{String.fromCharCode.apply(null,[0])}catch(h){f=!1}try{String.fromCharCode.apply(null,new Uint8Array(1))}catch(h){g=!1}for(var i=new e.Buf8(256),j=0;256>j;j++)i[j]=j>=252?6:j>=248?5:j>=240?4:j>=224?3:j>=192?2:1;i[254]=i[254]=1,c.string2buf=function(a){var b,c,d,f,g,h=a.length,i=0;for(f=0;h>f;f++)c=a.charCodeAt(f),55296===(64512&c)&&h>f+1&&(d=a.charCodeAt(f+1),56320===(64512&d)&&(c=65536+(c-55296<<10)+(d-56320),f++)),i+=128>c?1:2048>c?2:65536>c?3:4;for(b=new e.Buf8(i),g=0,f=0;i>g;f++)c=a.charCodeAt(f),55296===(64512&c)&&h>f+1&&(d=a.charCodeAt(f+1),56320===(64512&d)&&(c=65536+(c-55296<<10)+(d-56320),f++)),128>c?b[g++]=c:2048>c?(b[g++]=192|c>>>6,b[g++]=128|63&c):65536>c?(b[g++]=224|c>>>12,b[g++]=128|c>>>6&63,b[g++]=128|63&c):(b[g++]=240|c>>>18,b[g++]=128|c>>>12&63,b[g++]=128|c>>>6&63,b[g++]=128|63&c);return b},c.buf2binstring=function(a){return d(a,a.length)},c.binstring2buf=function(a){for(var b=new e.Buf8(a.length),c=0,d=b.length;d>c;c++)b[c]=a.charCodeAt(c);return b},c.buf2string=function(a,b){var c,e,f,g,h=b||a.length,j=new Array(2*h);for(e=0,c=0;h>c;)if(f=a[c++],128>f)j[e++]=f;else if(g=i[f],g>4)j[e++]=65533,c+=g-1;else{for(f&=2===g?31:3===g?15:7;g>1&&h>c;)f=f<<6|63&a[c++],g--;g>1?j[e++]=65533:65536>f?j[e++]=f:(f-=65536,j[e++]=55296|f>>10&1023,j[e++]=56320|1023&f)}return d(j,e)},c.utf8border=function(a,b){var c;for(b=b||a.length,b>a.length&&(b=a.length),c=b-1;c>=0&&128===(192&a[c]);)c--;return 0>c?b:0===c?b:c+i[a[c]]>b?c:b}},{"./common":27}],29:[function(a,b){"use strict";function c(a,b,c,d){for(var e=65535&a|0,f=a>>>16&65535|0,g=0;0!==c;){g=c>2e3?2e3:c,c-=g;do e=e+b[d++]|0,f=f+e|0;while(--g);e%=65521,f%=65521}return e|f<<16|0}b.exports=c},{}],30:[function(a,b){b.exports={Z_NO_FLUSH:0,Z_PARTIAL_FLUSH:1,Z_SYNC_FLUSH:2,Z_FULL_FLUSH:3,Z_FINISH:4,Z_BLOCK:5,Z_TREES:6,Z_OK:0,Z_STREAM_END:1,Z_NEED_DICT:2,Z_ERRNO:-1,Z_STREAM_ERROR:-2,Z_DATA_ERROR:-3,Z_BUF_ERROR:-5,Z_NO_COMPRESSION:0,Z_BEST_SPEED:1,Z_BEST_COMPRESSION:9,Z_DEFAULT_COMPRESSION:-1,Z_FILTERED:1,Z_HUFFMAN_ONLY:2,Z_RLE:3,Z_FIXED:4,Z_DEFAULT_STRATEGY:0,Z_BINARY:0,Z_TEXT:1,Z_UNKNOWN:2,Z_DEFLATED:8}},{}],31:[function(a,b){"use strict";function c(){for(var a,b=[],c=0;256>c;c++){a=c;for(var d=0;8>d;d++)a=1&a?3988292384^a>>>1:a>>>1;b[c]=a}return b}function d(a,b,c,d){var f=e,g=d+c;a=-1^a;for(var h=d;g>h;h++)a=a>>>8^f[255&(a^b[h])];return-1^a}var e=c();b.exports=d},{}],32:[function(a,b,c){"use strict";function d(a,b){return a.msg=G[b],b}function e(a){return(a<<1)-(a>4?9:0)}function f(a){for(var b=a.length;--b>=0;)a[b]=0}function g(a){var b=a.state,c=b.pending;c>a.avail_out&&(c=a.avail_out),0!==c&&(C.arraySet(a.output,b.pending_buf,b.pending_out,c,a.next_out),a.next_out+=c,b.pending_out+=c,a.total_out+=c,a.avail_out-=c,b.pending-=c,0===b.pending&&(b.pending_out=0))}function h(a,b){D._tr_flush_block(a,a.block_start>=0?a.block_start:-1,a.strstart-a.block_start,b),a.block_start=a.strstart,g(a.strm)}function i(a,b){a.pending_buf[a.pending++]=b}function j(a,b){a.pending_buf[a.pending++]=b>>>8&255,a.pending_buf[a.pending++]=255&b}function k(a,b,c,d){var e=a.avail_in;return e>d&&(e=d),0===e?0:(a.avail_in-=e,C.arraySet(b,a.input,a.next_in,e,c),1===a.state.wrap?a.adler=E(a.adler,b,e,c):2===a.state.wrap&&(a.adler=F(a.adler,b,e,c)),a.next_in+=e,a.total_in+=e,e)}function l(a,b){var c,d,e=a.max_chain_length,f=a.strstart,g=a.prev_length,h=a.nice_match,i=a.strstart>a.w_size-jb?a.strstart-(a.w_size-jb):0,j=a.window,k=a.w_mask,l=a.prev,m=a.strstart+ib,n=j[f+g-1],o=j[f+g];a.prev_length>=a.good_match&&(e>>=2),h>a.lookahead&&(h=a.lookahead);do if(c=b,j[c+g]===o&&j[c+g-1]===n&&j[c]===j[f]&&j[++c]===j[f+1]){f+=2,c++;do;while(j[++f]===j[++c]&&j[++f]===j[++c]&&j[++f]===j[++c]&&j[++f]===j[++c]&&j[++f]===j[++c]&&j[++f]===j[++c]&&j[++f]===j[++c]&&j[++f]===j[++c]&&m>f);if(d=ib-(m-f),f=m-ib,d>g){if(a.match_start=b,g=d,d>=h)break;n=j[f+g-1],o=j[f+g]}}while((b=l[b&k])>i&&0!==--e);return g<=a.lookahead?g:a.lookahead}function m(a){var b,c,d,e,f,g=a.w_size;do{if(e=a.window_size-a.lookahead-a.strstart,a.strstart>=g+(g-jb)){C.arraySet(a.window,a.window,g,g,0),a.match_start-=g,a.strstart-=g,a.block_start-=g,c=a.hash_size,b=c;do d=a.head[--b],a.head[b]=d>=g?d-g:0;while(--c);c=g,b=c;do d=a.prev[--b],a.prev[b]=d>=g?d-g:0;while(--c);e+=g}if(0===a.strm.avail_in)break;if(c=k(a.strm,a.window,a.strstart+a.lookahead,e),a.lookahead+=c,a.lookahead+a.insert>=hb)for(f=a.strstart-a.insert,a.ins_h=a.window[f],a.ins_h=(a.ins_h<<a.hash_shift^a.window[f+1])&a.hash_mask;a.insert&&(a.ins_h=(a.ins_h<<a.hash_shift^a.window[f+hb-1])&a.hash_mask,a.prev[f&a.w_mask]=a.head[a.ins_h],a.head[a.ins_h]=f,f++,a.insert--,!(a.lookahead+a.insert<hb)););}while(a.lookahead<jb&&0!==a.strm.avail_in)}function n(a,b){var c=65535;for(c>a.pending_buf_size-5&&(c=a.pending_buf_size-5);;){if(a.lookahead<=1){if(m(a),0===a.lookahead&&b===H)return sb;if(0===a.lookahead)break}a.strstart+=a.lookahead,a.lookahead=0;var d=a.block_start+c;if((0===a.strstart||a.strstart>=d)&&(a.lookahead=a.strstart-d,a.strstart=d,h(a,!1),0===a.strm.avail_out))return sb;if(a.strstart-a.block_start>=a.w_size-jb&&(h(a,!1),0===a.strm.avail_out))return sb}return a.insert=0,b===K?(h(a,!0),0===a.strm.avail_out?ub:vb):a.strstart>a.block_start&&(h(a,!1),0===a.strm.avail_out)?sb:sb}function o(a,b){for(var c,d;;){if(a.lookahead<jb){if(m(a),a.lookahead<jb&&b===H)return sb;if(0===a.lookahead)break}if(c=0,a.lookahead>=hb&&(a.ins_h=(a.ins_h<<a.hash_shift^a.window[a.strstart+hb-1])&a.hash_mask,c=a.prev[a.strstart&a.w_mask]=a.head[a.ins_h],a.head[a.ins_h]=a.strstart),0!==c&&a.strstart-c<=a.w_size-jb&&(a.match_length=l(a,c)),a.match_length>=hb)if(d=D._tr_tally(a,a.strstart-a.match_start,a.match_length-hb),a.lookahead-=a.match_length,a.match_length<=a.max_lazy_match&&a.lookahead>=hb){a.match_length--;do a.strstart++,a.ins_h=(a.ins_h<<a.hash_shift^a.window[a.strstart+hb-1])&a.hash_mask,c=a.prev[a.strstart&a.w_mask]=a.head[a.ins_h],a.head[a.ins_h]=a.strstart;while(0!==--a.match_length);a.strstart++}else a.strstart+=a.match_length,a.match_length=0,a.ins_h=a.window[a.strstart],a.ins_h=(a.ins_h<<a.hash_shift^a.window[a.strstart+1])&a.hash_mask;else d=D._tr_tally(a,0,a.window[a.strstart]),a.lookahead--,a.strstart++;if(d&&(h(a,!1),0===a.strm.avail_out))return sb}return a.insert=a.strstart<hb-1?a.strstart:hb-1,b===K?(h(a,!0),0===a.strm.avail_out?ub:vb):a.last_lit&&(h(a,!1),0===a.strm.avail_out)?sb:tb}function p(a,b){for(var c,d,e;;){if(a.lookahead<jb){if(m(a),a.lookahead<jb&&b===H)return sb;if(0===a.lookahead)break}if(c=0,a.lookahead>=hb&&(a.ins_h=(a.ins_h<<a.hash_shift^a.window[a.strstart+hb-1])&a.hash_mask,c=a.prev[a.strstart&a.w_mask]=a.head[a.ins_h],a.head[a.ins_h]=a.strstart),a.prev_length=a.match_length,a.prev_match=a.match_start,a.match_length=hb-1,0!==c&&a.prev_length<a.max_lazy_match&&a.strstart-c<=a.w_size-jb&&(a.match_length=l(a,c),a.match_length<=5&&(a.strategy===S||a.match_length===hb&&a.strstart-a.match_start>4096)&&(a.match_length=hb-1)),a.prev_length>=hb&&a.match_length<=a.prev_length){e=a.strstart+a.lookahead-hb,d=D._tr_tally(a,a.strstart-1-a.prev_match,a.prev_length-hb),a.lookahead-=a.prev_length-1,a.prev_length-=2;do++a.strstart<=e&&(a.ins_h=(a.ins_h<<a.hash_shift^a.window[a.strstart+hb-1])&a.hash_mask,c=a.prev[a.strstart&a.w_mask]=a.head[a.ins_h],a.head[a.ins_h]=a.strstart);while(0!==--a.prev_length);if(a.match_available=0,a.match_length=hb-1,a.strstart++,d&&(h(a,!1),0===a.strm.avail_out))return sb}else if(a.match_available){if(d=D._tr_tally(a,0,a.window[a.strstart-1]),d&&h(a,!1),a.strstart++,a.lookahead--,0===a.strm.avail_out)return sb}else a.match_available=1,a.strstart++,a.lookahead--}return a.match_available&&(d=D._tr_tally(a,0,a.window[a.strstart-1]),a.match_available=0),a.insert=a.strstart<hb-1?a.strstart:hb-1,b===K?(h(a,!0),0===a.strm.avail_out?ub:vb):a.last_lit&&(h(a,!1),0===a.strm.avail_out)?sb:tb}function q(a,b){for(var c,d,e,f,g=a.window;;){if(a.lookahead<=ib){if(m(a),a.lookahead<=ib&&b===H)return sb;if(0===a.lookahead)break}if(a.match_length=0,a.lookahead>=hb&&a.strstart>0&&(e=a.strstart-1,d=g[e],d===g[++e]&&d===g[++e]&&d===g[++e])){f=a.strstart+ib;do;while(d===g[++e]&&d===g[++e]&&d===g[++e]&&d===g[++e]&&d===g[++e]&&d===g[++e]&&d===g[++e]&&d===g[++e]&&f>e);a.match_length=ib-(f-e),a.match_length>a.lookahead&&(a.match_length=a.lookahead)}if(a.match_length>=hb?(c=D._tr_tally(a,1,a.match_length-hb),a.lookahead-=a.match_length,a.strstart+=a.match_length,a.match_length=0):(c=D._tr_tally(a,0,a.window[a.strstart]),a.lookahead--,a.strstart++),c&&(h(a,!1),0===a.strm.avail_out))return sb}return a.insert=0,b===K?(h(a,!0),0===a.strm.avail_out?ub:vb):a.last_lit&&(h(a,!1),0===a.strm.avail_out)?sb:tb}function r(a,b){for(var c;;){if(0===a.lookahead&&(m(a),0===a.lookahead)){if(b===H)return sb;break}if(a.match_length=0,c=D._tr_tally(a,0,a.window[a.strstart]),a.lookahead--,a.strstart++,c&&(h(a,!1),0===a.strm.avail_out))return sb}return a.insert=0,b===K?(h(a,!0),0===a.strm.avail_out?ub:vb):a.last_lit&&(h(a,!1),0===a.strm.avail_out)?sb:tb}function s(a){a.window_size=2*a.w_size,f(a.head),a.max_lazy_match=B[a.level].max_lazy,a.good_match=B[a.level].good_length,a.nice_match=B[a.level].nice_length,a.max_chain_length=B[a.level].max_chain,a.strstart=0,a.block_start=0,a.lookahead=0,a.insert=0,a.match_length=a.prev_length=hb-1,a.match_available=0,a.ins_h=0}function t(){this.strm=null,this.status=0,this.pending_buf=null,this.pending_buf_size=0,this.pending_out=0,this.pending=0,this.wrap=0,this.gzhead=null,this.gzindex=0,this.method=Y,this.last_flush=-1,this.w_size=0,this.w_bits=0,this.w_mask=0,this.window=null,this.window_size=0,this.prev=null,this.head=null,this.ins_h=0,this.hash_size=0,this.hash_bits=0,this.hash_mask=0,this.hash_shift=0,this.block_start=0,this.match_length=0,this.prev_match=0,this.match_available=0,this.strstart=0,this.match_start=0,this.lookahead=0,this.prev_length=0,this.max_chain_length=0,this.max_lazy_match=0,this.level=0,this.strategy=0,this.good_match=0,this.nice_match=0,this.dyn_ltree=new C.Buf16(2*fb),this.dyn_dtree=new C.Buf16(2*(2*db+1)),this.bl_tree=new C.Buf16(2*(2*eb+1)),f(this.dyn_ltree),f(this.dyn_dtree),f(this.bl_tree),this.l_desc=null,this.d_desc=null,this.bl_desc=null,this.bl_count=new C.Buf16(gb+1),this.heap=new C.Buf16(2*cb+1),f(this.heap),this.heap_len=0,this.heap_max=0,this.depth=new C.Buf16(2*cb+1),f(this.depth),this.l_buf=0,this.lit_bufsize=0,this.last_lit=0,this.d_buf=0,this.opt_len=0,this.static_len=0,this.matches=0,this.insert=0,this.bi_buf=0,this.bi_valid=0}function u(a){var b;return a&&a.state?(a.total_in=a.total_out=0,a.data_type=X,b=a.state,b.pending=0,b.pending_out=0,b.wrap<0&&(b.wrap=-b.wrap),b.status=b.wrap?lb:qb,a.adler=2===b.wrap?0:1,b.last_flush=H,D._tr_init(b),M):d(a,O)}function v(a){var b=u(a);return b===M&&s(a.state),b}function w(a,b){return a&&a.state?2!==a.state.wrap?O:(a.state.gzhead=b,M):O}function x(a,b,c,e,f,g){if(!a)return O;var h=1;if(b===R&&(b=6),0>e?(h=0,e=-e):e>15&&(h=2,e-=16),1>f||f>Z||c!==Y||8>e||e>15||0>b||b>9||0>g||g>V)return d(a,O);8===e&&(e=9);var i=new t;return a.state=i,i.strm=a,i.wrap=h,i.gzhead=null,i.w_bits=e,i.w_size=1<<i.w_bits,i.w_mask=i.w_size-1,i.hash_bits=f+7,i.hash_size=1<<i.hash_bits,i.hash_mask=i.hash_size-1,i.hash_shift=~~((i.hash_bits+hb-1)/hb),i.window=new C.Buf8(2*i.w_size),i.head=new C.Buf16(i.hash_size),i.prev=new C.Buf16(i.w_size),i.lit_bufsize=1<<f+6,i.pending_buf_size=4*i.lit_bufsize,i.pending_buf=new C.Buf8(i.pending_buf_size),i.d_buf=i.lit_bufsize>>1,i.l_buf=3*i.lit_bufsize,i.level=b,i.strategy=g,i.method=c,v(a)}function y(a,b){return x(a,b,Y,$,_,W)}function z(a,b){var c,h,k,l;if(!a||!a.state||b>L||0>b)return a?d(a,O):O;if(h=a.state,!a.output||!a.input&&0!==a.avail_in||h.status===rb&&b!==K)return d(a,0===a.avail_out?Q:O);if(h.strm=a,c=h.last_flush,h.last_flush=b,h.status===lb)if(2===h.wrap)a.adler=0,i(h,31),i(h,139),i(h,8),h.gzhead?(i(h,(h.gzhead.text?1:0)+(h.gzhead.hcrc?2:0)+(h.gzhead.extra?4:0)+(h.gzhead.name?8:0)+(h.gzhead.comment?16:0)),i(h,255&h.gzhead.time),i(h,h.gzhead.time>>8&255),i(h,h.gzhead.time>>16&255),i(h,h.gzhead.time>>24&255),i(h,9===h.level?2:h.strategy>=T||h.level<2?4:0),i(h,255&h.gzhead.os),h.gzhead.extra&&h.gzhead.extra.length&&(i(h,255&h.gzhead.extra.length),i(h,h.gzhead.extra.length>>8&255)),h.gzhead.hcrc&&(a.adler=F(a.adler,h.pending_buf,h.pending,0)),h.gzindex=0,h.status=mb):(i(h,0),i(h,0),i(h,0),i(h,0),i(h,0),i(h,9===h.level?2:h.strategy>=T||h.level<2?4:0),i(h,wb),h.status=qb);else{var m=Y+(h.w_bits-8<<4)<<8,n=-1;n=h.strategy>=T||h.level<2?0:h.level<6?1:6===h.level?2:3,m|=n<<6,0!==h.strstart&&(m|=kb),m+=31-m%31,h.status=qb,j(h,m),0!==h.strstart&&(j(h,a.adler>>>16),j(h,65535&a.adler)),a.adler=1}if(h.status===mb)if(h.gzhead.extra){for(k=h.pending;h.gzindex<(65535&h.gzhead.extra.length)&&(h.pending!==h.pending_buf_size||(h.gzhead.hcrc&&h.pending>k&&(a.adler=F(a.adler,h.pending_buf,h.pending-k,k)),g(a),k=h.pending,h.pending!==h.pending_buf_size));)i(h,255&h.gzhead.extra[h.gzindex]),h.gzindex++;h.gzhead.hcrc&&h.pending>k&&(a.adler=F(a.adler,h.pending_buf,h.pending-k,k)),h.gzindex===h.gzhead.extra.length&&(h.gzindex=0,h.status=nb)}else h.status=nb;if(h.status===nb)if(h.gzhead.name){k=h.pending;do{if(h.pending===h.pending_buf_size&&(h.gzhead.hcrc&&h.pending>k&&(a.adler=F(a.adler,h.pending_buf,h.pending-k,k)),g(a),k=h.pending,h.pending===h.pending_buf_size)){l=1;break}l=h.gzindex<h.gzhead.name.length?255&h.gzhead.name.charCodeAt(h.gzindex++):0,i(h,l)}while(0!==l);h.gzhead.hcrc&&h.pending>k&&(a.adler=F(a.adler,h.pending_buf,h.pending-k,k)),0===l&&(h.gzindex=0,h.status=ob)}else h.status=ob;if(h.status===ob)if(h.gzhead.comment){k=h.pending;do{if(h.pending===h.pending_buf_size&&(h.gzhead.hcrc&&h.pending>k&&(a.adler=F(a.adler,h.pending_buf,h.pending-k,k)),g(a),k=h.pending,h.pending===h.pending_buf_size)){l=1;break}l=h.gzindex<h.gzhead.comment.length?255&h.gzhead.comment.charCodeAt(h.gzindex++):0,i(h,l)}while(0!==l);h.gzhead.hcrc&&h.pending>k&&(a.adler=F(a.adler,h.pending_buf,h.pending-k,k)),0===l&&(h.status=pb)}else h.status=pb;if(h.status===pb&&(h.gzhead.hcrc?(h.pending+2>h.pending_buf_size&&g(a),h.pending+2<=h.pending_buf_size&&(i(h,255&a.adler),i(h,a.adler>>8&255),a.adler=0,h.status=qb)):h.status=qb),0!==h.pending){if(g(a),0===a.avail_out)return h.last_flush=-1,M}else if(0===a.avail_in&&e(b)<=e(c)&&b!==K)return d(a,Q);if(h.status===rb&&0!==a.avail_in)return d(a,Q);if(0!==a.avail_in||0!==h.lookahead||b!==H&&h.status!==rb){var o=h.strategy===T?r(h,b):h.strategy===U?q(h,b):B[h.level].func(h,b);if((o===ub||o===vb)&&(h.status=rb),o===sb||o===ub)return 0===a.avail_out&&(h.last_flush=-1),M;if(o===tb&&(b===I?D._tr_align(h):b!==L&&(D._tr_stored_block(h,0,0,!1),b===J&&(f(h.head),0===h.lookahead&&(h.strstart=0,h.block_start=0,h.insert=0))),g(a),0===a.avail_out))return h.last_flush=-1,M}return b!==K?M:h.wrap<=0?N:(2===h.wrap?(i(h,255&a.adler),i(h,a.adler>>8&255),i(h,a.adler>>16&255),i(h,a.adler>>24&255),i(h,255&a.total_in),i(h,a.total_in>>8&255),i(h,a.total_in>>16&255),i(h,a.total_in>>24&255)):(j(h,a.adler>>>16),j(h,65535&a.adler)),g(a),h.wrap>0&&(h.wrap=-h.wrap),0!==h.pending?M:N)}function A(a){var b;return a&&a.state?(b=a.state.status,b!==lb&&b!==mb&&b!==nb&&b!==ob&&b!==pb&&b!==qb&&b!==rb?d(a,O):(a.state=null,b===qb?d(a,P):M)):O}var B,C=a("../utils/common"),D=a("./trees"),E=a("./adler32"),F=a("./crc32"),G=a("./messages"),H=0,I=1,J=3,K=4,L=5,M=0,N=1,O=-2,P=-3,Q=-5,R=-1,S=1,T=2,U=3,V=4,W=0,X=2,Y=8,Z=9,$=15,_=8,ab=29,bb=256,cb=bb+1+ab,db=30,eb=19,fb=2*cb+1,gb=15,hb=3,ib=258,jb=ib+hb+1,kb=32,lb=42,mb=69,nb=73,ob=91,pb=103,qb=113,rb=666,sb=1,tb=2,ub=3,vb=4,wb=3,xb=function(a,b,c,d,e){this.good_length=a,this.max_lazy=b,this.nice_length=c,this.max_chain=d,this.func=e};B=[new xb(0,0,0,0,n),new xb(4,4,8,4,o),new xb(4,5,16,8,o),new xb(4,6,32,32,o),new xb(4,4,16,16,p),new xb(8,16,32,32,p),new xb(8,16,128,128,p),new xb(8,32,128,256,p),new xb(32,128,258,1024,p),new xb(32,258,258,4096,p)],c.deflateInit=y,c.deflateInit2=x,c.deflateReset=v,c.deflateResetKeep=u,c.deflateSetHeader=w,c.deflate=z,c.deflateEnd=A,c.deflateInfo="pako deflate (from Nodeca project)"},{"../utils/common":27,"./adler32":29,"./crc32":31,"./messages":37,"./trees":38}],33:[function(a,b){"use strict";function c(){this.text=0,this.time=0,this.xflags=0,this.os=0,this.extra=null,this.extra_len=0,this.name="",this.comment="",this.hcrc=0,this.done=!1}b.exports=c},{}],34:[function(a,b){"use strict";var c=30,d=12;b.exports=function(a,b){var e,f,g,h,i,j,k,l,m,n,o,p,q,r,s,t,u,v,w,x,y,z,A,B,C;e=a.state,f=a.next_in,B=a.input,g=f+(a.avail_in-5),h=a.next_out,C=a.output,i=h-(b-a.avail_out),j=h+(a.avail_out-257),k=e.dmax,l=e.wsize,m=e.whave,n=e.wnext,o=e.window,p=e.hold,q=e.bits,r=e.lencode,s=e.distcode,t=(1<<e.lenbits)-1,u=(1<<e.distbits)-1;a:do{15>q&&(p+=B[f++]<<q,q+=8,p+=B[f++]<<q,q+=8),v=r[p&t];b:for(;;){if(w=v>>>24,p>>>=w,q-=w,w=v>>>16&255,0===w)C[h++]=65535&v;else{if(!(16&w)){if(0===(64&w)){v=r[(65535&v)+(p&(1<<w)-1)];continue b}if(32&w){e.mode=d;break a}a.msg="invalid literal/length code",e.mode=c;break a}x=65535&v,w&=15,w&&(w>q&&(p+=B[f++]<<q,q+=8),x+=p&(1<<w)-1,p>>>=w,q-=w),15>q&&(p+=B[f++]<<q,q+=8,p+=B[f++]<<q,q+=8),v=s[p&u];c:for(;;){if(w=v>>>24,p>>>=w,q-=w,w=v>>>16&255,!(16&w)){if(0===(64&w)){v=s[(65535&v)+(p&(1<<w)-1)];continue c}a.msg="invalid distance code",e.mode=c;break a}if(y=65535&v,w&=15,w>q&&(p+=B[f++]<<q,q+=8,w>q&&(p+=B[f++]<<q,q+=8)),y+=p&(1<<w)-1,y>k){a.msg="invalid distance too far back",e.mode=c;break a}if(p>>>=w,q-=w,w=h-i,y>w){if(w=y-w,w>m&&e.sane){a.msg="invalid distance too far back",e.mode=c;break a}if(z=0,A=o,0===n){if(z+=l-w,x>w){x-=w;do C[h++]=o[z++];while(--w);z=h-y,A=C}}else if(w>n){if(z+=l+n-w,w-=n,x>w){x-=w;do C[h++]=o[z++];while(--w);if(z=0,x>n){w=n,x-=w;do C[h++]=o[z++];while(--w);z=h-y,A=C}}}else if(z+=n-w,x>w){x-=w;do C[h++]=o[z++];while(--w);z=h-y,A=C}for(;x>2;)C[h++]=A[z++],C[h++]=A[z++],C[h++]=A[z++],x-=3;x&&(C[h++]=A[z++],x>1&&(C[h++]=A[z++]))}else{z=h-y;do C[h++]=C[z++],C[h++]=C[z++],C[h++]=C[z++],x-=3;while(x>2);x&&(C[h++]=C[z++],x>1&&(C[h++]=C[z++]))}break}}break}}while(g>f&&j>h);x=q>>3,f-=x,q-=x<<3,p&=(1<<q)-1,a.next_in=f,a.next_out=h,a.avail_in=g>f?5+(g-f):5-(f-g),a.avail_out=j>h?257+(j-h):257-(h-j),e.hold=p,e.bits=q}},{}],35:[function(a,b,c){"use strict";function d(a){return(a>>>24&255)+(a>>>8&65280)+((65280&a)<<8)+((255&a)<<24)}function e(){this.mode=0,this.last=!1,this.wrap=0,this.havedict=!1,this.flags=0,this.dmax=0,this.check=0,this.total=0,this.head=null,this.wbits=0,this.wsize=0,this.whave=0,this.wnext=0,this.window=null,this.hold=0,this.bits=0,this.length=0,this.offset=0,this.extra=0,this.lencode=null,this.distcode=null,this.lenbits=0,this.distbits=0,this.ncode=0,this.nlen=0,this.ndist=0,this.have=0,this.next=null,this.lens=new r.Buf16(320),this.work=new r.Buf16(288),this.lendyn=null,this.distdyn=null,this.sane=0,this.back=0,this.was=0}function f(a){var b;return a&&a.state?(b=a.state,a.total_in=a.total_out=b.total=0,a.msg="",b.wrap&&(a.adler=1&b.wrap),b.mode=K,b.last=0,b.havedict=0,b.dmax=32768,b.head=null,b.hold=0,b.bits=0,b.lencode=b.lendyn=new r.Buf32(ob),b.distcode=b.distdyn=new r.Buf32(pb),b.sane=1,b.back=-1,C):F}function g(a){var b;return a&&a.state?(b=a.state,b.wsize=0,b.whave=0,b.wnext=0,f(a)):F}function h(a,b){var c,d;return a&&a.state?(d=a.state,0>b?(c=0,b=-b):(c=(b>>4)+1,48>b&&(b&=15)),b&&(8>b||b>15)?F:(null!==d.window&&d.wbits!==b&&(d.window=null),d.wrap=c,d.wbits=b,g(a))):F}function i(a,b){var c,d;return a?(d=new e,a.state=d,d.window=null,c=h(a,b),c!==C&&(a.state=null),c):F}function j(a){return i(a,rb)}function k(a){if(sb){var b;for(p=new r.Buf32(512),q=new r.Buf32(32),b=0;144>b;)a.lens[b++]=8;for(;256>b;)a.lens[b++]=9;for(;280>b;)a.lens[b++]=7;for(;288>b;)a.lens[b++]=8;for(v(x,a.lens,0,288,p,0,a.work,{bits:9}),b=0;32>b;)a.lens[b++]=5;v(y,a.lens,0,32,q,0,a.work,{bits:5}),sb=!1}a.lencode=p,a.lenbits=9,a.distcode=q,a.distbits=5}function l(a,b,c,d){var e,f=a.state;return null===f.window&&(f.wsize=1<<f.wbits,f.wnext=0,f.whave=0,f.window=new r.Buf8(f.wsize)),d>=f.wsize?(r.arraySet(f.window,b,c-f.wsize,f.wsize,0),f.wnext=0,f.whave=f.wsize):(e=f.wsize-f.wnext,e>d&&(e=d),r.arraySet(f.window,b,c-d,e,f.wnext),d-=e,d?(r.arraySet(f.window,b,c-d,d,0),f.wnext=d,f.whave=f.wsize):(f.wnext+=e,f.wnext===f.wsize&&(f.wnext=0),f.whave<f.wsize&&(f.whave+=e))),0}function m(a,b){var c,e,f,g,h,i,j,m,n,o,p,q,ob,pb,qb,rb,sb,tb,ub,vb,wb,xb,yb,zb,Ab=0,Bb=new r.Buf8(4),Cb=[16,17,18,0,8,7,9,6,10,5,11,4,12,3,13,2,14,1,15];if(!a||!a.state||!a.output||!a.input&&0!==a.avail_in)return F;c=a.state,c.mode===V&&(c.mode=W),h=a.next_out,f=a.output,j=a.avail_out,g=a.next_in,e=a.input,i=a.avail_in,m=c.hold,n=c.bits,o=i,p=j,xb=C;a:for(;;)switch(c.mode){case K:if(0===c.wrap){c.mode=W;break}for(;16>n;){if(0===i)break a;i--,m+=e[g++]<<n,n+=8}if(2&c.wrap&&35615===m){c.check=0,Bb[0]=255&m,Bb[1]=m>>>8&255,c.check=t(c.check,Bb,2,0),m=0,n=0,c.mode=L;break}if(c.flags=0,c.head&&(c.head.done=!1),!(1&c.wrap)||(((255&m)<<8)+(m>>8))%31){a.msg="incorrect header check",c.mode=lb;break}if((15&m)!==J){a.msg="unknown compression method",c.mode=lb;break}if(m>>>=4,n-=4,wb=(15&m)+8,0===c.wbits)c.wbits=wb;else if(wb>c.wbits){a.msg="invalid window size",c.mode=lb;break}c.dmax=1<<wb,a.adler=c.check=1,c.mode=512&m?T:V,m=0,n=0;break;case L:for(;16>n;){if(0===i)break a;i--,m+=e[g++]<<n,n+=8}if(c.flags=m,(255&c.flags)!==J){a.msg="unknown compression method",c.mode=lb;break}if(57344&c.flags){a.msg="unknown header flags set",c.mode=lb;break}c.head&&(c.head.text=m>>8&1),512&c.flags&&(Bb[0]=255&m,Bb[1]=m>>>8&255,c.check=t(c.check,Bb,2,0)),m=0,n=0,c.mode=M;case M:for(;32>n;){if(0===i)break a;i--,m+=e[g++]<<n,n+=8}c.head&&(c.head.time=m),512&c.flags&&(Bb[0]=255&m,Bb[1]=m>>>8&255,Bb[2]=m>>>16&255,Bb[3]=m>>>24&255,c.check=t(c.check,Bb,4,0)),m=0,n=0,c.mode=N;case N:for(;16>n;){if(0===i)break a;i--,m+=e[g++]<<n,n+=8}c.head&&(c.head.xflags=255&m,c.head.os=m>>8),512&c.flags&&(Bb[0]=255&m,Bb[1]=m>>>8&255,c.check=t(c.check,Bb,2,0)),m=0,n=0,c.mode=O;case O:if(1024&c.flags){for(;16>n;){if(0===i)break a;i--,m+=e[g++]<<n,n+=8}c.length=m,c.head&&(c.head.extra_len=m),512&c.flags&&(Bb[0]=255&m,Bb[1]=m>>>8&255,c.check=t(c.check,Bb,2,0)),m=0,n=0}else c.head&&(c.head.extra=null);c.mode=P;case P:if(1024&c.flags&&(q=c.length,q>i&&(q=i),q&&(c.head&&(wb=c.head.extra_len-c.length,c.head.extra||(c.head.extra=new Array(c.head.extra_len)),r.arraySet(c.head.extra,e,g,q,wb)),512&c.flags&&(c.check=t(c.check,e,q,g)),i-=q,g+=q,c.length-=q),c.length))break a;c.length=0,c.mode=Q;case Q:if(2048&c.flags){if(0===i)break a;q=0;do wb=e[g+q++],c.head&&wb&&c.length<65536&&(c.head.name+=String.fromCharCode(wb));while(wb&&i>q);if(512&c.flags&&(c.check=t(c.check,e,q,g)),i-=q,g+=q,wb)break a}else c.head&&(c.head.name=null);c.length=0,c.mode=R;case R:if(4096&c.flags){if(0===i)break a;q=0;do wb=e[g+q++],c.head&&wb&&c.length<65536&&(c.head.comment+=String.fromCharCode(wb));while(wb&&i>q);if(512&c.flags&&(c.check=t(c.check,e,q,g)),i-=q,g+=q,wb)break a}else c.head&&(c.head.comment=null);c.mode=S;case S:if(512&c.flags){for(;16>n;){if(0===i)break a;i--,m+=e[g++]<<n,n+=8}if(m!==(65535&c.check)){a.msg="header crc mismatch",c.mode=lb;break}m=0,n=0}c.head&&(c.head.hcrc=c.flags>>9&1,c.head.done=!0),a.adler=c.check=0,c.mode=V;break;case T:for(;32>n;){if(0===i)break a;i--,m+=e[g++]<<n,n+=8}a.adler=c.check=d(m),m=0,n=0,c.mode=U;case U:if(0===c.havedict)return a.next_out=h,a.avail_out=j,a.next_in=g,a.avail_in=i,c.hold=m,c.bits=n,E;a.adler=c.check=1,c.mode=V;case V:if(b===A||b===B)break a;case W:if(c.last){m>>>=7&n,n-=7&n,c.mode=ib;break}for(;3>n;){if(0===i)break a;i--,m+=e[g++]<<n,n+=8}switch(c.last=1&m,m>>>=1,n-=1,3&m){case 0:c.mode=X;break;case 1:if(k(c),c.mode=bb,b===B){m>>>=2,n-=2;break a}break;case 2:c.mode=$;break;case 3:a.msg="invalid block type",c.mode=lb}m>>>=2,n-=2;break;case X:for(m>>>=7&n,n-=7&n;32>n;){if(0===i)break a;i--,m+=e[g++]<<n,n+=8}if((65535&m)!==(m>>>16^65535)){a.msg="invalid stored block lengths",c.mode=lb;break}if(c.length=65535&m,m=0,n=0,c.mode=Y,b===B)break a;case Y:c.mode=Z;case Z:if(q=c.length){if(q>i&&(q=i),q>j&&(q=j),0===q)break a;r.arraySet(f,e,g,q,h),i-=q,g+=q,j-=q,h+=q,c.length-=q;break}c.mode=V;break;case $:for(;14>n;){if(0===i)break a;i--,m+=e[g++]<<n,n+=8}if(c.nlen=(31&m)+257,m>>>=5,n-=5,c.ndist=(31&m)+1,m>>>=5,n-=5,c.ncode=(15&m)+4,m>>>=4,n-=4,c.nlen>286||c.ndist>30){a.msg="too many length or distance symbols",c.mode=lb;break}c.have=0,c.mode=_;case _:for(;c.have<c.ncode;){for(;3>n;){if(0===i)break a;i--,m+=e[g++]<<n,n+=8}c.lens[Cb[c.have++]]=7&m,m>>>=3,n-=3}for(;c.have<19;)c.lens[Cb[c.have++]]=0;if(c.lencode=c.lendyn,c.lenbits=7,yb={bits:c.lenbits},xb=v(w,c.lens,0,19,c.lencode,0,c.work,yb),c.lenbits=yb.bits,xb){a.msg="invalid code lengths set",c.mode=lb;break}c.have=0,c.mode=ab;case ab:for(;c.have<c.nlen+c.ndist;){for(;Ab=c.lencode[m&(1<<c.lenbits)-1],qb=Ab>>>24,rb=Ab>>>16&255,sb=65535&Ab,!(n>=qb);){if(0===i)break a;i--,m+=e[g++]<<n,n+=8}if(16>sb)m>>>=qb,n-=qb,c.lens[c.have++]=sb;else{if(16===sb){for(zb=qb+2;zb>n;){if(0===i)break a;i--,m+=e[g++]<<n,n+=8}if(m>>>=qb,n-=qb,0===c.have){a.msg="invalid bit length repeat",c.mode=lb;break}wb=c.lens[c.have-1],q=3+(3&m),m>>>=2,n-=2}else if(17===sb){for(zb=qb+3;zb>n;){if(0===i)break a;i--,m+=e[g++]<<n,n+=8}m>>>=qb,n-=qb,wb=0,q=3+(7&m),m>>>=3,n-=3}else{for(zb=qb+7;zb>n;){if(0===i)break a;i--,m+=e[g++]<<n,n+=8}m>>>=qb,n-=qb,wb=0,q=11+(127&m),m>>>=7,n-=7}if(c.have+q>c.nlen+c.ndist){a.msg="invalid bit length repeat",c.mode=lb;break}for(;q--;)c.lens[c.have++]=wb}}if(c.mode===lb)break;if(0===c.lens[256]){a.msg="invalid code -- missing end-of-block",c.mode=lb;break}if(c.lenbits=9,yb={bits:c.lenbits},xb=v(x,c.lens,0,c.nlen,c.lencode,0,c.work,yb),c.lenbits=yb.bits,xb){a.msg="invalid literal/lengths set",c.mode=lb;break}if(c.distbits=6,c.distcode=c.distdyn,yb={bits:c.distbits},xb=v(y,c.lens,c.nlen,c.ndist,c.distcode,0,c.work,yb),c.distbits=yb.bits,xb){a.msg="invalid distances set",c.mode=lb;break}if(c.mode=bb,b===B)break a;case bb:c.mode=cb;case cb:if(i>=6&&j>=258){a.next_out=h,a.avail_out=j,a.next_in=g,a.avail_in=i,c.hold=m,c.bits=n,u(a,p),h=a.next_out,f=a.output,j=a.avail_out,g=a.next_in,e=a.input,i=a.avail_in,m=c.hold,n=c.bits,c.mode===V&&(c.back=-1);break}for(c.back=0;Ab=c.lencode[m&(1<<c.lenbits)-1],qb=Ab>>>24,rb=Ab>>>16&255,sb=65535&Ab,!(n>=qb);){if(0===i)break a;i--,m+=e[g++]<<n,n+=8}if(rb&&0===(240&rb)){for(tb=qb,ub=rb,vb=sb;Ab=c.lencode[vb+((m&(1<<tb+ub)-1)>>tb)],qb=Ab>>>24,rb=Ab>>>16&255,sb=65535&Ab,!(n>=tb+qb);){if(0===i)break a;i--,m+=e[g++]<<n,n+=8}m>>>=tb,n-=tb,c.back+=tb}if(m>>>=qb,n-=qb,c.back+=qb,c.length=sb,0===rb){c.mode=hb;break}if(32&rb){c.back=-1,c.mode=V;break}if(64&rb){a.msg="invalid literal/length code",c.mode=lb;break}c.extra=15&rb,c.mode=db;case db:if(c.extra){for(zb=c.extra;zb>n;){if(0===i)break a;i--,m+=e[g++]<<n,n+=8}c.length+=m&(1<<c.extra)-1,m>>>=c.extra,n-=c.extra,c.back+=c.extra}c.was=c.length,c.mode=eb;case eb:for(;Ab=c.distcode[m&(1<<c.distbits)-1],qb=Ab>>>24,rb=Ab>>>16&255,sb=65535&Ab,!(n>=qb);){if(0===i)break a;i--,m+=e[g++]<<n,n+=8}if(0===(240&rb)){for(tb=qb,ub=rb,vb=sb;Ab=c.distcode[vb+((m&(1<<tb+ub)-1)>>tb)],qb=Ab>>>24,rb=Ab>>>16&255,sb=65535&Ab,!(n>=tb+qb);){if(0===i)break a;i--,m+=e[g++]<<n,n+=8}m>>>=tb,n-=tb,c.back+=tb}if(m>>>=qb,n-=qb,c.back+=qb,64&rb){a.msg="invalid distance code",c.mode=lb;break}c.offset=sb,c.extra=15&rb,c.mode=fb;case fb:if(c.extra){for(zb=c.extra;zb>n;){if(0===i)break a;i--,m+=e[g++]<<n,n+=8}c.offset+=m&(1<<c.extra)-1,m>>>=c.extra,n-=c.extra,c.back+=c.extra}if(c.offset>c.dmax){a.msg="invalid distance too far back",c.mode=lb;break}c.mode=gb;case gb:if(0===j)break a;
if(q=p-j,c.offset>q){if(q=c.offset-q,q>c.whave&&c.sane){a.msg="invalid distance too far back",c.mode=lb;break}q>c.wnext?(q-=c.wnext,ob=c.wsize-q):ob=c.wnext-q,q>c.length&&(q=c.length),pb=c.window}else pb=f,ob=h-c.offset,q=c.length;q>j&&(q=j),j-=q,c.length-=q;do f[h++]=pb[ob++];while(--q);0===c.length&&(c.mode=cb);break;case hb:if(0===j)break a;f[h++]=c.length,j--,c.mode=cb;break;case ib:if(c.wrap){for(;32>n;){if(0===i)break a;i--,m|=e[g++]<<n,n+=8}if(p-=j,a.total_out+=p,c.total+=p,p&&(a.adler=c.check=c.flags?t(c.check,f,p,h-p):s(c.check,f,p,h-p)),p=j,(c.flags?m:d(m))!==c.check){a.msg="incorrect data check",c.mode=lb;break}m=0,n=0}c.mode=jb;case jb:if(c.wrap&&c.flags){for(;32>n;){if(0===i)break a;i--,m+=e[g++]<<n,n+=8}if(m!==(4294967295&c.total)){a.msg="incorrect length check",c.mode=lb;break}m=0,n=0}c.mode=kb;case kb:xb=D;break a;case lb:xb=G;break a;case mb:return H;case nb:default:return F}return a.next_out=h,a.avail_out=j,a.next_in=g,a.avail_in=i,c.hold=m,c.bits=n,(c.wsize||p!==a.avail_out&&c.mode<lb&&(c.mode<ib||b!==z))&&l(a,a.output,a.next_out,p-a.avail_out)?(c.mode=mb,H):(o-=a.avail_in,p-=a.avail_out,a.total_in+=o,a.total_out+=p,c.total+=p,c.wrap&&p&&(a.adler=c.check=c.flags?t(c.check,f,p,a.next_out-p):s(c.check,f,p,a.next_out-p)),a.data_type=c.bits+(c.last?64:0)+(c.mode===V?128:0)+(c.mode===bb||c.mode===Y?256:0),(0===o&&0===p||b===z)&&xb===C&&(xb=I),xb)}function n(a){if(!a||!a.state)return F;var b=a.state;return b.window&&(b.window=null),a.state=null,C}function o(a,b){var c;return a&&a.state?(c=a.state,0===(2&c.wrap)?F:(c.head=b,b.done=!1,C)):F}var p,q,r=a("../utils/common"),s=a("./adler32"),t=a("./crc32"),u=a("./inffast"),v=a("./inftrees"),w=0,x=1,y=2,z=4,A=5,B=6,C=0,D=1,E=2,F=-2,G=-3,H=-4,I=-5,J=8,K=1,L=2,M=3,N=4,O=5,P=6,Q=7,R=8,S=9,T=10,U=11,V=12,W=13,X=14,Y=15,Z=16,$=17,_=18,ab=19,bb=20,cb=21,db=22,eb=23,fb=24,gb=25,hb=26,ib=27,jb=28,kb=29,lb=30,mb=31,nb=32,ob=852,pb=592,qb=15,rb=qb,sb=!0;c.inflateReset=g,c.inflateReset2=h,c.inflateResetKeep=f,c.inflateInit=j,c.inflateInit2=i,c.inflate=m,c.inflateEnd=n,c.inflateGetHeader=o,c.inflateInfo="pako inflate (from Nodeca project)"},{"../utils/common":27,"./adler32":29,"./crc32":31,"./inffast":34,"./inftrees":36}],36:[function(a,b){"use strict";var c=a("../utils/common"),d=15,e=852,f=592,g=0,h=1,i=2,j=[3,4,5,6,7,8,9,10,11,13,15,17,19,23,27,31,35,43,51,59,67,83,99,115,131,163,195,227,258,0,0],k=[16,16,16,16,16,16,16,16,17,17,17,17,18,18,18,18,19,19,19,19,20,20,20,20,21,21,21,21,16,72,78],l=[1,2,3,4,5,7,9,13,17,25,33,49,65,97,129,193,257,385,513,769,1025,1537,2049,3073,4097,6145,8193,12289,16385,24577,0,0],m=[16,16,16,16,17,17,18,18,19,19,20,20,21,21,22,22,23,23,24,24,25,25,26,26,27,27,28,28,29,29,64,64];b.exports=function(a,b,n,o,p,q,r,s){var t,u,v,w,x,y,z,A,B,C=s.bits,D=0,E=0,F=0,G=0,H=0,I=0,J=0,K=0,L=0,M=0,N=null,O=0,P=new c.Buf16(d+1),Q=new c.Buf16(d+1),R=null,S=0;for(D=0;d>=D;D++)P[D]=0;for(E=0;o>E;E++)P[b[n+E]]++;for(H=C,G=d;G>=1&&0===P[G];G--);if(H>G&&(H=G),0===G)return p[q++]=20971520,p[q++]=20971520,s.bits=1,0;for(F=1;G>F&&0===P[F];F++);for(F>H&&(H=F),K=1,D=1;d>=D;D++)if(K<<=1,K-=P[D],0>K)return-1;if(K>0&&(a===g||1!==G))return-1;for(Q[1]=0,D=1;d>D;D++)Q[D+1]=Q[D]+P[D];for(E=0;o>E;E++)0!==b[n+E]&&(r[Q[b[n+E]]++]=E);if(a===g?(N=R=r,y=19):a===h?(N=j,O-=257,R=k,S-=257,y=256):(N=l,R=m,y=-1),M=0,E=0,D=F,x=q,I=H,J=0,v=-1,L=1<<H,w=L-1,a===h&&L>e||a===i&&L>f)return 1;for(var T=0;;){T++,z=D-J,r[E]<y?(A=0,B=r[E]):r[E]>y?(A=R[S+r[E]],B=N[O+r[E]]):(A=96,B=0),t=1<<D-J,u=1<<I,F=u;do u-=t,p[x+(M>>J)+u]=z<<24|A<<16|B|0;while(0!==u);for(t=1<<D-1;M&t;)t>>=1;if(0!==t?(M&=t-1,M+=t):M=0,E++,0===--P[D]){if(D===G)break;D=b[n+r[E]]}if(D>H&&(M&w)!==v){for(0===J&&(J=H),x+=F,I=D-J,K=1<<I;G>I+J&&(K-=P[I+J],!(0>=K));)I++,K<<=1;if(L+=1<<I,a===h&&L>e||a===i&&L>f)return 1;v=M&w,p[v]=H<<24|I<<16|x-q|0}}return 0!==M&&(p[x+M]=D-J<<24|64<<16|0),s.bits=H,0}},{"../utils/common":27}],37:[function(a,b){"use strict";b.exports={2:"need dictionary",1:"stream end",0:"","-1":"file error","-2":"stream error","-3":"data error","-4":"insufficient memory","-5":"buffer error","-6":"incompatible version"}},{}],38:[function(a,b,c){"use strict";function d(a){for(var b=a.length;--b>=0;)a[b]=0}function e(a){return 256>a?gb[a]:gb[256+(a>>>7)]}function f(a,b){a.pending_buf[a.pending++]=255&b,a.pending_buf[a.pending++]=b>>>8&255}function g(a,b,c){a.bi_valid>V-c?(a.bi_buf|=b<<a.bi_valid&65535,f(a,a.bi_buf),a.bi_buf=b>>V-a.bi_valid,a.bi_valid+=c-V):(a.bi_buf|=b<<a.bi_valid&65535,a.bi_valid+=c)}function h(a,b,c){g(a,c[2*b],c[2*b+1])}function i(a,b){var c=0;do c|=1&a,a>>>=1,c<<=1;while(--b>0);return c>>>1}function j(a){16===a.bi_valid?(f(a,a.bi_buf),a.bi_buf=0,a.bi_valid=0):a.bi_valid>=8&&(a.pending_buf[a.pending++]=255&a.bi_buf,a.bi_buf>>=8,a.bi_valid-=8)}function k(a,b){var c,d,e,f,g,h,i=b.dyn_tree,j=b.max_code,k=b.stat_desc.static_tree,l=b.stat_desc.has_stree,m=b.stat_desc.extra_bits,n=b.stat_desc.extra_base,o=b.stat_desc.max_length,p=0;for(f=0;U>=f;f++)a.bl_count[f]=0;for(i[2*a.heap[a.heap_max]+1]=0,c=a.heap_max+1;T>c;c++)d=a.heap[c],f=i[2*i[2*d+1]+1]+1,f>o&&(f=o,p++),i[2*d+1]=f,d>j||(a.bl_count[f]++,g=0,d>=n&&(g=m[d-n]),h=i[2*d],a.opt_len+=h*(f+g),l&&(a.static_len+=h*(k[2*d+1]+g)));if(0!==p){do{for(f=o-1;0===a.bl_count[f];)f--;a.bl_count[f]--,a.bl_count[f+1]+=2,a.bl_count[o]--,p-=2}while(p>0);for(f=o;0!==f;f--)for(d=a.bl_count[f];0!==d;)e=a.heap[--c],e>j||(i[2*e+1]!==f&&(a.opt_len+=(f-i[2*e+1])*i[2*e],i[2*e+1]=f),d--)}}function l(a,b,c){var d,e,f=new Array(U+1),g=0;for(d=1;U>=d;d++)f[d]=g=g+c[d-1]<<1;for(e=0;b>=e;e++){var h=a[2*e+1];0!==h&&(a[2*e]=i(f[h]++,h))}}function m(){var a,b,c,d,e,f=new Array(U+1);for(c=0,d=0;O-1>d;d++)for(ib[d]=c,a=0;a<1<<_[d];a++)hb[c++]=d;for(hb[c-1]=d,e=0,d=0;16>d;d++)for(jb[d]=e,a=0;a<1<<ab[d];a++)gb[e++]=d;for(e>>=7;R>d;d++)for(jb[d]=e<<7,a=0;a<1<<ab[d]-7;a++)gb[256+e++]=d;for(b=0;U>=b;b++)f[b]=0;for(a=0;143>=a;)eb[2*a+1]=8,a++,f[8]++;for(;255>=a;)eb[2*a+1]=9,a++,f[9]++;for(;279>=a;)eb[2*a+1]=7,a++,f[7]++;for(;287>=a;)eb[2*a+1]=8,a++,f[8]++;for(l(eb,Q+1,f),a=0;R>a;a++)fb[2*a+1]=5,fb[2*a]=i(a,5);kb=new nb(eb,_,P+1,Q,U),lb=new nb(fb,ab,0,R,U),mb=new nb(new Array(0),bb,0,S,W)}function n(a){var b;for(b=0;Q>b;b++)a.dyn_ltree[2*b]=0;for(b=0;R>b;b++)a.dyn_dtree[2*b]=0;for(b=0;S>b;b++)a.bl_tree[2*b]=0;a.dyn_ltree[2*X]=1,a.opt_len=a.static_len=0,a.last_lit=a.matches=0}function o(a){a.bi_valid>8?f(a,a.bi_buf):a.bi_valid>0&&(a.pending_buf[a.pending++]=a.bi_buf),a.bi_buf=0,a.bi_valid=0}function p(a,b,c,d){o(a),d&&(f(a,c),f(a,~c)),E.arraySet(a.pending_buf,a.window,b,c,a.pending),a.pending+=c}function q(a,b,c,d){var e=2*b,f=2*c;return a[e]<a[f]||a[e]===a[f]&&d[b]<=d[c]}function r(a,b,c){for(var d=a.heap[c],e=c<<1;e<=a.heap_len&&(e<a.heap_len&&q(b,a.heap[e+1],a.heap[e],a.depth)&&e++,!q(b,d,a.heap[e],a.depth));)a.heap[c]=a.heap[e],c=e,e<<=1;a.heap[c]=d}function s(a,b,c){var d,f,i,j,k=0;if(0!==a.last_lit)do d=a.pending_buf[a.d_buf+2*k]<<8|a.pending_buf[a.d_buf+2*k+1],f=a.pending_buf[a.l_buf+k],k++,0===d?h(a,f,b):(i=hb[f],h(a,i+P+1,b),j=_[i],0!==j&&(f-=ib[i],g(a,f,j)),d--,i=e(d),h(a,i,c),j=ab[i],0!==j&&(d-=jb[i],g(a,d,j)));while(k<a.last_lit);h(a,X,b)}function t(a,b){var c,d,e,f=b.dyn_tree,g=b.stat_desc.static_tree,h=b.stat_desc.has_stree,i=b.stat_desc.elems,j=-1;for(a.heap_len=0,a.heap_max=T,c=0;i>c;c++)0!==f[2*c]?(a.heap[++a.heap_len]=j=c,a.depth[c]=0):f[2*c+1]=0;for(;a.heap_len<2;)e=a.heap[++a.heap_len]=2>j?++j:0,f[2*e]=1,a.depth[e]=0,a.opt_len--,h&&(a.static_len-=g[2*e+1]);for(b.max_code=j,c=a.heap_len>>1;c>=1;c--)r(a,f,c);e=i;do c=a.heap[1],a.heap[1]=a.heap[a.heap_len--],r(a,f,1),d=a.heap[1],a.heap[--a.heap_max]=c,a.heap[--a.heap_max]=d,f[2*e]=f[2*c]+f[2*d],a.depth[e]=(a.depth[c]>=a.depth[d]?a.depth[c]:a.depth[d])+1,f[2*c+1]=f[2*d+1]=e,a.heap[1]=e++,r(a,f,1);while(a.heap_len>=2);a.heap[--a.heap_max]=a.heap[1],k(a,b),l(f,j,a.bl_count)}function u(a,b,c){var d,e,f=-1,g=b[1],h=0,i=7,j=4;for(0===g&&(i=138,j=3),b[2*(c+1)+1]=65535,d=0;c>=d;d++)e=g,g=b[2*(d+1)+1],++h<i&&e===g||(j>h?a.bl_tree[2*e]+=h:0!==e?(e!==f&&a.bl_tree[2*e]++,a.bl_tree[2*Y]++):10>=h?a.bl_tree[2*Z]++:a.bl_tree[2*$]++,h=0,f=e,0===g?(i=138,j=3):e===g?(i=6,j=3):(i=7,j=4))}function v(a,b,c){var d,e,f=-1,i=b[1],j=0,k=7,l=4;for(0===i&&(k=138,l=3),d=0;c>=d;d++)if(e=i,i=b[2*(d+1)+1],!(++j<k&&e===i)){if(l>j){do h(a,e,a.bl_tree);while(0!==--j)}else 0!==e?(e!==f&&(h(a,e,a.bl_tree),j--),h(a,Y,a.bl_tree),g(a,j-3,2)):10>=j?(h(a,Z,a.bl_tree),g(a,j-3,3)):(h(a,$,a.bl_tree),g(a,j-11,7));j=0,f=e,0===i?(k=138,l=3):e===i?(k=6,l=3):(k=7,l=4)}}function w(a){var b;for(u(a,a.dyn_ltree,a.l_desc.max_code),u(a,a.dyn_dtree,a.d_desc.max_code),t(a,a.bl_desc),b=S-1;b>=3&&0===a.bl_tree[2*cb[b]+1];b--);return a.opt_len+=3*(b+1)+5+5+4,b}function x(a,b,c,d){var e;for(g(a,b-257,5),g(a,c-1,5),g(a,d-4,4),e=0;d>e;e++)g(a,a.bl_tree[2*cb[e]+1],3);v(a,a.dyn_ltree,b-1),v(a,a.dyn_dtree,c-1)}function y(a){var b,c=4093624447;for(b=0;31>=b;b++,c>>>=1)if(1&c&&0!==a.dyn_ltree[2*b])return G;if(0!==a.dyn_ltree[18]||0!==a.dyn_ltree[20]||0!==a.dyn_ltree[26])return H;for(b=32;P>b;b++)if(0!==a.dyn_ltree[2*b])return H;return G}function z(a){pb||(m(),pb=!0),a.l_desc=new ob(a.dyn_ltree,kb),a.d_desc=new ob(a.dyn_dtree,lb),a.bl_desc=new ob(a.bl_tree,mb),a.bi_buf=0,a.bi_valid=0,n(a)}function A(a,b,c,d){g(a,(J<<1)+(d?1:0),3),p(a,b,c,!0)}function B(a){g(a,K<<1,3),h(a,X,eb),j(a)}function C(a,b,c,d){var e,f,h=0;a.level>0?(a.strm.data_type===I&&(a.strm.data_type=y(a)),t(a,a.l_desc),t(a,a.d_desc),h=w(a),e=a.opt_len+3+7>>>3,f=a.static_len+3+7>>>3,e>=f&&(e=f)):e=f=c+5,e>=c+4&&-1!==b?A(a,b,c,d):a.strategy===F||f===e?(g(a,(K<<1)+(d?1:0),3),s(a,eb,fb)):(g(a,(L<<1)+(d?1:0),3),x(a,a.l_desc.max_code+1,a.d_desc.max_code+1,h+1),s(a,a.dyn_ltree,a.dyn_dtree)),n(a),d&&o(a)}function D(a,b,c){return a.pending_buf[a.d_buf+2*a.last_lit]=b>>>8&255,a.pending_buf[a.d_buf+2*a.last_lit+1]=255&b,a.pending_buf[a.l_buf+a.last_lit]=255&c,a.last_lit++,0===b?a.dyn_ltree[2*c]++:(a.matches++,b--,a.dyn_ltree[2*(hb[c]+P+1)]++,a.dyn_dtree[2*e(b)]++),a.last_lit===a.lit_bufsize-1}var E=a("../utils/common"),F=4,G=0,H=1,I=2,J=0,K=1,L=2,M=3,N=258,O=29,P=256,Q=P+1+O,R=30,S=19,T=2*Q+1,U=15,V=16,W=7,X=256,Y=16,Z=17,$=18,_=[0,0,0,0,0,0,0,0,1,1,1,1,2,2,2,2,3,3,3,3,4,4,4,4,5,5,5,5,0],ab=[0,0,0,0,1,1,2,2,3,3,4,4,5,5,6,6,7,7,8,8,9,9,10,10,11,11,12,12,13,13],bb=[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,2,3,7],cb=[16,17,18,0,8,7,9,6,10,5,11,4,12,3,13,2,14,1,15],db=512,eb=new Array(2*(Q+2));d(eb);var fb=new Array(2*R);d(fb);var gb=new Array(db);d(gb);var hb=new Array(N-M+1);d(hb);var ib=new Array(O);d(ib);var jb=new Array(R);d(jb);var kb,lb,mb,nb=function(a,b,c,d,e){this.static_tree=a,this.extra_bits=b,this.extra_base=c,this.elems=d,this.max_length=e,this.has_stree=a&&a.length},ob=function(a,b){this.dyn_tree=a,this.max_code=0,this.stat_desc=b},pb=!1;c._tr_init=z,c._tr_stored_block=A,c._tr_flush_block=C,c._tr_tally=D,c._tr_align=B},{"../utils/common":27}],39:[function(a,b){"use strict";function c(){this.input=null,this.next_in=0,this.avail_in=0,this.total_in=0,this.output=null,this.next_out=0,this.avail_out=0,this.total_out=0,this.msg="",this.state=null,this.data_type=2,this.adler=0}b.exports=c},{}]},{},[9])(9)});
// File:examples/js/loaders/AMFLoader.js

/*
 * @author tamarintech / https://tamarintech.com
 *
 * Description: Early release of an AMF Loader following the pattern of the
 * example loaders in the three.js project.
 *
 * More information about the AMF format: http://amf.wikispaces.com
 *
 * Usage:
 *	var loader = new AMFLoader();
 *	loader.load('/path/to/project.amf', function(objecttree) {
 *		scene.add(objecttree);
 *	});
 *
 * Materials now supported, material colors supported
 * Zip support, requires jszip
 * TextDecoder polyfill required by some browsers (particularly IE, Edge)
 * No constellation support (yet)!
 *
 */

THREE.AMFLoader = function ( manager ) {

	this.manager = ( manager !== undefined ) ? manager : THREE.DefaultLoadingManager;

};

THREE.AMFLoader.prototype = {

	constructor: THREE.AMFLoader,

	load: function ( url, onLoad, onProgress, onError ) {

		var scope = this;

		var loader = new THREE.XHRLoader( scope.manager );
		loader.setResponseType( 'arraybuffer' );
		loader.load( url, function( text ) {

			onLoad( scope.parse( text ) );

		}, onProgress, onError );

	},

	parse: function ( data ) {

		function loadDocument( data ) {

			var view = new DataView( data );
			var magic = String.fromCharCode( view.getUint8( 0 ), view.getUint8( 1 ) );

			if ( magic === "PK" ) {

				var zip = null;
				var file = null;

				console.log( "Loading Zip" );

				try {

					zip = new JSZip( data );

				} catch ( e ) {

					if ( e instanceof ReferenceError ) {

						console.log( "	jszip missing and file is compressed." );
						return null;

					}

				}

				for ( file in zip.files ) {

					if ( file.toLowerCase().substr( - 4 ) === '.amf' ) {

						break;

					}

				}

				console.log( "	Trying to load file asset: " + file );
				view = new DataView( zip.file( file ).asArrayBuffer() );

			}

			if ( TextDecoder === undefined ) {

				console.log( "	TextDecoder not present.	Please use TextDecoder polyfill." );
				return null;

			}

			var fileText = new TextDecoder( 'utf-8' ).decode( view );
			var xmlData = new DOMParser().parseFromString( fileText, 'application/xml' );

			if ( xmlData.documentElement.nodeName.toLowerCase() !== "amf" ) {

				console.log( "	Error loading AMF - no AMF document found." );
				return null;

			}

			return xmlData;

		}

		function loadDocumentScale( node ) {

			var scale = 1.0;
			var unit = 'millimeter';

			if ( node.documentElement.attributes[ 'unit' ] !== undefined ) {

				unit = node.documentElement.attributes[ 'unit' ].value.toLowerCase();

			}

			var scaleUnits = {
				'millimeter': 1.0,
				'inch': 25.4,
				'feet': 304.8,
				'meter': 1000.0,
				'micron': 0.001
			};

			if ( scaleUnits[ unit ] !== undefined ) {

				scale = scaleUnits[ unit ];

			}

			console.log( "	Unit scale: " + scale );
			return scale;

		}

		function loadMaterials( node ) {

			var matName = "AMF Material";
			var matId = node.attributes[ 'id' ].textContent;
			var color = { r: 1.0, g: 1.0, b: 1.0, a: 1.0 };

			var loadedMaterial = null;

			for ( var i = 0; i < node.children.length; i ++ ) {

				var matChildEl = node.children[ i ];

				if ( matChildEl.nodeName === "metadata" && matChildEl.attributes[ 'type' ] !== undefined ) {

					if ( matChildEl.attributes[ 'type' ].value === 'name' ) {

						matname = matChildEl.textContent;

					}

				} else if ( matChildEl.nodeName === 'color' ) {

					color = loadColor( matChildEl );

				}

			}

			loadedMaterial = new THREE.MeshPhongMaterial( {
				shading: THREE.FlatShading,
				color: new THREE.Color( color.r, color.g, color.b ),
				name: matName
			} );

			if ( color.a !== 1.0 ) {

				loadedMaterial.transparent = true;
				loadedMaterial.opacity = color.a;

			}

			return { 'id': matId, 'material': loadedMaterial };

		}

		function loadColor( node ) {

			var color = { 'r': 1.0, 'g': 1.0, 'b': 1.0, 'a': 1.0 };

			for ( var i = 0; i < node.children.length; i ++ ) {

				var matColor = node.children[ i ];

				if ( matColor.nodeName === 'r' ) {

					color.r = matColor.textContent;

				} else if ( matColor.nodeName === 'g' ) {

					color.g = matColor.textContent;

				} else if ( matColor.nodeName === 'b' ) {

					color.b = matColor.textContent;

				} else if ( matColor.nodeName === 'a' ) {

					color.a = matColor.textContent;

				}

			}

			return color;

		}

		function loadMeshVolume( node ) {

			var volume = { "name": "", "triangles": [], "materialid": null };

			var currVolumeNode = node.firstElementChild;

			if ( node.attributes[ 'materialid' ] !== undefined ) {

				volume.materialId = node.attributes[ 'materialid' ].nodeValue;

			}

			while ( currVolumeNode ) {

				if ( currVolumeNode.nodeName === "metadata" ) {

					if ( currVolumeNode.attributes[ 'type' ] !== undefined ) {

						if ( currVolumeNode.attributes[ 'type' ].value === 'name' ) {

							volume.name = currVolumeNode.textContent;

						}

					}

				} else if ( currVolumeNode.nodeName === "triangle" ) {

					var v1 = currVolumeNode.getElementsByTagName("v1")[0].textContent;
					var v2 = currVolumeNode.getElementsByTagName("v2")[0].textContent;
					var v3 = currVolumeNode.getElementsByTagName("v3")[0].textContent;

					volume.triangles.push( v1 );
					volume.triangles.push( v2 );
					volume.triangles.push( v3 );

				}

				currVolumeNode = currVolumeNode.nextElementSibling;

			}

			return volume;

		}

		function loadMeshVertices( node ) {

			var vertArray = [];
			var normalArray = [];
			var currVerticesNode = node.firstElementChild;

			while ( currVerticesNode ) {

				if ( currVerticesNode.nodeName === "vertex" ) {

					var vNode = currVerticesNode.firstElementChild;

					while ( vNode ) {

						if ( vNode.nodeName === "coordinates" ) {

							var x = vNode.getElementsByTagName("x")[0].textContent;
							var y = vNode.getElementsByTagName("y")[0].textContent;
							var z = vNode.getElementsByTagName("z")[0].textContent;

							vertArray.push(x);
							vertArray.push(y);
							vertArray.push(z);

						} else if ( vNode.nodeName === "normal" ) {

							var nx = vNode.getElementsByTagName("nx")[0].textContent;
							var ny = vNode.getElementsByTagName("ny")[0].textContent;
							var nz = vNode.getElementsByTagName("nz")[0].textContent;

							normalArray.push(nx);
							normalArray.push(ny);
							normalArray.push(nz);

						}

						vNode = vNode.nextElementSibling;

					}

				}
				currVerticesNode = currVerticesNode.nextElementSibling;

			}

			return { "vertices": vertArray, "normals": normalArray };

		}

		function loadObject( node ) {

			var objId = node.attributes[ 'id' ].textContent;
			var loadedObject = { "name": "amfobject", "meshes": [] };
			var currColor = null;
			var currObjNode = node.firstElementChild;

			while ( currObjNode ) {

				if ( currObjNode.nodeName === "metadata" ) {

					if ( currObjNode.attributes[ 'type' ] !== undefined ) {

						if ( currObjNode.attributes[ 'type' ].value === 'name' ) {

							loadedObject.name = currObjNode.textContent;

						}

					}

				} else if ( currObjNode.nodeName === "color" ) {

					currColor = loadColor( currObjNode );

				} else if ( currObjNode.nodeName === "mesh" ) {

					var currMeshNode = currObjNode.firstElementChild;
					var mesh = { "vertices": [], "normals": [], "volumes": [], "color": currColor };

					while ( currMeshNode ) {

						if ( currMeshNode.nodeName === "vertices" ) {

							var loadedVertices = loadMeshVertices( currMeshNode );

							mesh.normals = mesh.normals.concat( loadedVertices.normals );
							mesh.vertices = mesh.vertices.concat( loadedVertices.vertices );

						} else if ( currMeshNode.nodeName === "volume" ) {

							mesh.volumes.push( loadMeshVolume( currMeshNode ) );

						}

						currMeshNode = currMeshNode.nextElementSibling;

					}

					loadedObject.meshes.push( mesh );

				}

				currObjNode = currObjNode.nextElementSibling;

			}

			return { 'id': objId, 'obj': loadedObject };

		}

		var xmlData = loadDocument( data );
		var amfName = "";
		var amfAuthor = "";
		var amfScale = loadDocumentScale( xmlData );
		var amfMaterials = {};
		var amfObjects = {};
		var children = xmlData.documentElement.children;

		for ( var i = 0; i < children.length; i ++ ) {

			var child = children[ i ];

			if ( child.nodeName === 'metadata' ) {

				if ( child.attributes[ 'type' ] !== undefined ) {

					if ( child.attributes[ 'type' ].value === 'name' ) {

						amfName = child.textContent;

					} else if ( child.attributes[ 'type' ].value === 'author' ) {

						amfAuthor = child.textContent;

					}

				}

			} else if ( child.nodeName === 'material' ) {

				var loadedMaterial = loadMaterials( child );

				amfMaterials[ loadedMaterial.id ] = loadedMaterial.material;

			} else if ( child.nodeName === 'object' ) {

				var loadedObject = loadObject( child );

				amfObjects[ loadedObject.id ] = loadedObject.obj;

			}

		}

		var sceneObject = new THREE.Group();
		var defaultMaterial = new THREE.MeshPhongMaterial( { color: 0xaaaaff, shading: THREE.FlatShading } );

		sceneObject.name = amfName;
		sceneObject.userData.author = amfAuthor;
		sceneObject.userData.loader = "AMF";

		for ( var id in amfObjects ) {

			var part = amfObjects[ id ];
			var meshes = part.meshes;
			var newObject = new THREE.Group();
			newObject.name = part.name || '';

			for ( var i = 0; i < meshes.length; i ++ ) {

				var objDefaultMaterial = defaultMaterial;
				var mesh = meshes[ i ];
				var meshVertices = Float32Array.from( mesh.vertices );
				var vertices = new THREE.BufferAttribute( Float32Array.from( meshVertices ), 3 );
				var meshNormals = null;
				var normals = null;

				if ( mesh.normals.length ) {

					meshNormals = Float32Array.from( mesh.normals );
					normals = new THREE.BufferAttribute( Float32Array.from( meshNormals ), 3 );

				}

				if ( mesh.color ) {

					var color = mesh.color;

					objDefaultMaterial = defaultMaterial.clone();
					objDefaultMaterial.color = new THREE.Color( color.r, color.g, color.b );

					if ( color.a !== 1.0 ) {

						objDefaultMaterial.transparent = true;
						objDefaultMaterial.opacity = color.a;

					}

				}

				var volumes = mesh.volumes;

				for ( var j = 0; j < volumes.length; j ++ ) {

					var volume = volumes[ j ];
					var newGeometry = new THREE.BufferGeometry();
					var indexes = Uint32Array.from( volume.triangles );
					var material = objDefaultMaterial;

					newGeometry.setIndex( new THREE.BufferAttribute( indexes, 1 ) );
					newGeometry.addAttribute( 'position', vertices.clone() );

					if( normals ) {

						newGeometry.addAttribute( 'normal', normals.clone() );

					}

					if ( amfMaterials[ volume.materialId ] !== undefined ) {

						material = amfMaterials[ volume.materialId ];

					}

					newGeometry.scale( amfScale, amfScale, amfScale );
					newObject.add( new THREE.Mesh( newGeometry, material.clone() ) );

				}

			}

			sceneObject.add( newObject );

		}

		return sceneObject;

	}

};

// File:examples/js/loaders/BabylonLoader.js

/**
 * @author mrdoob / http://mrdoob.com/
 */

THREE.BabylonLoader = function ( manager ) {

	this.manager = ( manager !== undefined ) ? manager : THREE.DefaultLoadingManager;

};

THREE.BabylonLoader.prototype = {

	constructor: THREE.BabylonLoader,

	load: function ( url, onLoad, onProgress, onError ) {

		var scope = this;

		var loader = new THREE.XHRLoader( scope.manager );
		loader.load( url, function ( text ) {

			onLoad( scope.parse( JSON.parse( text ) ) );

		}, onProgress, onError );

	},

	parse: function ( json ) {

		var materials = this.parseMaterials( json );
		var scene = this.parseObjects( json, materials );

		return scene;

	},

	parseMaterials: function ( json ) {

		var materials = {};

		for ( var i = 0, l = json.materials.length; i < l; i ++ ) {

			var data = json.materials[ i ];

			var material = new THREE.MeshPhongMaterial();
			material.name = data.name;
			material.color.fromArray( data.diffuse );
			material.emissive.fromArray( data.emissive );
			material.specular.fromArray( data.specular );
			material.shininess = data.specularPower;
			material.opacity = data.alpha;

			materials[ data.id ] = material;

		}

		if ( json.multiMaterials ) {

			for ( var i = 0, l = json.multiMaterials.length; i < l; i ++ ) {

				var data = json.multiMaterials[ i ];

				console.warn( 'THREE.BabylonLoader: Multi materials not yet supported.' );

				materials[ data.id ] = new THREE.MeshPhongMaterial();

			}

		}

		return materials;

	},

	parseGeometry: function ( json ) {

		var geometry = new THREE.BufferGeometry();

		// indices

		var indices = new Uint16Array( json.indices );

		geometry.setIndex( new THREE.BufferAttribute( indices, 1 ) );

		// positions

		var positions = new Float32Array( json.positions );

		for ( var j = 2, jl = positions.length; j < jl; j += 3 ) {

			positions[ j ] = - positions[ j ];

		}

		geometry.addAttribute( 'position', new THREE.BufferAttribute( positions, 3 ) );

		// normals

		if ( json.normals ) {

			var normals = new Float32Array( json.normals );

			for ( var j = 2, jl = normals.length; j < jl; j += 3 ) {

				normals[ j ] = - normals[ j ];

			}

			geometry.addAttribute( 'normal', new THREE.BufferAttribute( normals, 3 ) );

		}

		// uvs

		if ( json.uvs ) {

			var uvs = new Float32Array( json.uvs );

			geometry.addAttribute( 'uv', new THREE.BufferAttribute( uvs, 2 ) );

		}

		// offsets

		var subMeshes = json.subMeshes;

		if ( subMeshes ) {

			for ( var j = 0, jl = subMeshes.length; j < jl; j ++ ) {

				var subMesh = subMeshes[ j ];

				geometry.addGroup( subMesh.indexStart, subMesh.indexCount );

			}

		}

		return geometry;

	},

	parseObjects: function ( json, materials ) {

		var objects = {};
		var scene = new THREE.Scene();

		var cameras = json.cameras;

		for ( var i = 0, l = cameras.length; i < l; i ++ ) {

			var data = cameras[ i ];

			var camera = new THREE.PerspectiveCamera( ( data.fov / Math.PI ) * 180, 1.33, data.minZ, data.maxZ );

			camera.name = data.name;
			camera.position.fromArray( data.position );
			if ( data.rotation ) camera.rotation.fromArray( data.rotation );

			objects[ data.id ] = camera;

		}

		var lights = json.lights;

		for ( var i = 0, l = lights.length; i < l; i ++ ) {

			var data = lights[ i ];

			var light;

			switch ( data.type ) {

				case 0:
					light = new THREE.PointLight();
					break;

				case 1:
					light = new THREE.DirectionalLight();
					break;

				case 2:
					light = new THREE.SpotLight();
					break;

				case 3:
					light = new THREE.HemisphereLight();
					break;
			}

			light.name = data.name;
			if ( data.position ) light.position.set( data.position[ 0 ], data.position[ 1 ], - data.position[ 2 ] );
			light.color.fromArray( data.diffuse );
			if ( data.groundColor ) light.groundColor.fromArray( data.groundColor );
			if ( data.intensity ) light.intensity = data.intensity;

			objects[ data.id ] = light;

			scene.add( light );

		}

		var meshes = json.meshes;

		for ( var i = 0, l = meshes.length; i < l; i ++ ) {

			var data = meshes[ i ];

			var object;

			if ( data.indices ) {

				var geometry = this.parseGeometry( data );

				object = new THREE.Mesh( geometry, materials[ data.materialId ] );

			} else {

				object = new THREE.Group();

			}

			object.name = data.name;
			object.position.set( data.position[ 0 ], data.position[ 1 ], - data.position[ 2 ] );
			object.rotation.fromArray( data.rotation );
			if ( data.rotationQuaternion ) object.quaternion.fromArray( data.rotationQuaternion );
			object.scale.fromArray( data.scaling );
			// object.visible = data.isVisible;

			if ( data.parentId ) {

				objects[ data.parentId ].add( object );

			} else {

				scene.add( object );

			}

			objects[ data.id ] = object;

		}

		return scene;

	}

};

// File:examples/js/loaders/ColladaLoader.js

/**
* @author Tim Knip / http://www.floorplanner.com/ / tim at floorplanner.com
* @author Tony Parisi / http://www.tonyparisi.com/
*/

THREE.ColladaLoader = function () {

	var COLLADA = null;
	var scene = null;
	var visualScene;
	var kinematicsModel;

	var readyCallbackFunc = null;

	var sources = {};
	var images = {};
	var animations = {};
	var controllers = {};
	var geometries = {};
	var materials = {};
	var effects = {};
	var cameras = {};
	var lights = {};

	var animData;
	var kinematics;
	var visualScenes;
	var kinematicsModels;
	var baseUrl;
	var morphs;
	var skins;

	var flip_uv = true;
	var preferredShading = THREE.SmoothShading;

	var options = {
		// Force Geometry to always be centered at the local origin of the
		// containing Mesh.
		centerGeometry: false,

		// Axis conversion is done for geometries, animations, and controllers.
		// If we ever pull cameras or lights out of the COLLADA file, they'll
		// need extra work.
		convertUpAxis: false,

		subdivideFaces: true,

		upAxis: 'Y',

		// For reflective or refractive materials we'll use this cubemap
		defaultEnvMap: null

	};

	var colladaUnit = 1.0;
	var colladaUp = 'Y';
	var upConversion = null;

	function load ( url, readyCallback, progressCallback, failCallback ) {

		var length = 0;

		if ( document.implementation && document.implementation.createDocument ) {

			var request = new XMLHttpRequest();

			request.onreadystatechange = function() {

				if ( request.readyState === 4 ) {

					if ( request.status === 0 || request.status === 200 ) {

						if ( request.response ) {

							readyCallbackFunc = readyCallback;
							parse( request.response, undefined, url );

						} else {

							if ( failCallback ) {

								failCallback( { type: 'error', url: url } );

							} else {

								console.error( "ColladaLoader: Empty or non-existing file (" + url + ")" );

							}

						}

					}else{

						if( failCallback ){

							failCallback( { type: 'error', url: url } );

						}else{

							console.error( 'ColladaLoader: Couldn\'t load "' + url + '" (' + request.status + ')' );

						}

					}

				} else if ( request.readyState === 3 ) {

					if ( progressCallback ) {

						if ( length === 0 ) {

							length = request.getResponseHeader( "Content-Length" );

						}

						progressCallback( { total: length, loaded: request.responseText.length } );

					}

				}

			};

			request.open( "GET", url, true );
			request.send( null );

		} else {

			alert( "Don't know how to parse XML!" );

		}

	}

	function parse( text, callBack, url ) {

		COLLADA = new DOMParser().parseFromString( text, 'text/xml' );
		callBack = callBack || readyCallbackFunc;

		if ( url !== undefined ) {

			var parts = url.split( '/' );
			parts.pop();
			baseUrl = ( parts.length < 1 ? '.' : parts.join( '/' ) ) + '/';

		}

		parseAsset();
		setUpConversion();
		images = parseLib( "library_images image", _Image, "image" );
		materials = parseLib( "library_materials material", Material, "material" );
		effects = parseLib( "library_effects effect", Effect, "effect" );
		geometries = parseLib( "library_geometries geometry", Geometry, "geometry" );
		cameras = parseLib( "library_cameras camera", Camera, "camera" );
		lights = parseLib( "library_lights light", Light, "light" );
		controllers = parseLib( "library_controllers controller", Controller, "controller" );
		animations = parseLib( "library_animations animation", Animation, "animation" );
		visualScenes = parseLib( "library_visual_scenes visual_scene", VisualScene, "visual_scene" );
		kinematicsModels = parseLib( "library_kinematics_models kinematics_model", KinematicsModel, "kinematics_model" );

		morphs = [];
		skins = [];

		visualScene = parseScene();
		scene = new THREE.Group();

		for ( var i = 0; i < visualScene.nodes.length; i ++ ) {

			scene.add( createSceneGraph( visualScene.nodes[ i ] ) );

		}

		// unit conversion
		scene.scale.multiplyScalar( colladaUnit );

		createAnimations();

		kinematicsModel = parseKinematicsModel();
		createKinematics();

		var result = {

			scene: scene,
			morphs: morphs,
			skins: skins,
			animations: animData,
			kinematics: kinematics,
			dae: {
				images: images,
				materials: materials,
				cameras: cameras,
				lights: lights,
				effects: effects,
				geometries: geometries,
				controllers: controllers,
				animations: animations,
				visualScenes: visualScenes,
				visualScene: visualScene,
				scene: visualScene,
				kinematicsModels: kinematicsModels,
				kinematicsModel: kinematicsModel
			}

		};

		if ( callBack ) {

			callBack( result );

		}

		return result;

	}

	function setPreferredShading ( shading ) {

		preferredShading = shading;

	}

	function parseAsset () {

		var elements = COLLADA.querySelectorAll('asset');

		var element = elements[0];

		if ( element && element.childNodes ) {

			for ( var i = 0; i < element.childNodes.length; i ++ ) {

				var child = element.childNodes[ i ];

				switch ( child.nodeName ) {

					case 'unit':

						var meter = child.getAttribute( 'meter' );

						if ( meter ) {

							colladaUnit = parseFloat( meter );

						}

						break;

					case 'up_axis':

						colladaUp = child.textContent.charAt(0);
						break;

				}

			}

		}

	}

	function parseLib ( q, classSpec, prefix ) {

		var elements = COLLADA.querySelectorAll(q);

		var lib = {};

		var i = 0;

		var elementsLength = elements.length;

		for ( var j = 0; j < elementsLength; j ++ ) {

			var element = elements[j];
			var daeElement = ( new classSpec() ).parse( element );

			if ( !daeElement.id || daeElement.id.length === 0 ) daeElement.id = prefix + ( i ++ );
			lib[ daeElement.id ] = daeElement;

		}

		return lib;

	}

	function parseScene() {

		var sceneElement = COLLADA.querySelectorAll('scene instance_visual_scene')[0];

		if ( sceneElement ) {

			var url = sceneElement.getAttribute( 'url' ).replace( /^#/, '' );
			return visualScenes[ url.length > 0 ? url : 'visual_scene0' ];

		} else {

			return null;

		}

	}

	function parseKinematicsModel() {

		var kinematicsModelElement = COLLADA.querySelectorAll('instance_kinematics_model')[0];

		if ( kinematicsModelElement ) {

			var url = kinematicsModelElement.getAttribute( 'url' ).replace(/^#/, '');
			return kinematicsModels[ url.length > 0 ? url : 'kinematics_model0' ];

		} else {

			return null;

		}

	}

	function createAnimations() {

		animData = [];

		// fill in the keys
		recurseHierarchy( scene );

	}

	function recurseHierarchy( node ) {

		var n = visualScene.getChildById( node.colladaId, true ),
			newData = null;

		if ( n && n.keys ) {

			newData = {
				fps: 60,
				hierarchy: [ {
					node: n,
					keys: n.keys,
					sids: n.sids
				} ],
				node: node,
				name: 'animation_' + node.name,
				length: 0
			};

			animData.push(newData);

			for ( var i = 0, il = n.keys.length; i < il; i ++ ) {

				newData.length = Math.max( newData.length, n.keys[i].time );

			}

		} else {

			newData = {
				hierarchy: [ {
					keys: [],
					sids: []
				} ]
			}

		}

		for ( var i = 0, il = node.children.length; i < il; i ++ ) {

			var d = recurseHierarchy( node.children[i] );

			for ( var j = 0, jl = d.hierarchy.length; j < jl; j ++ ) {

				newData.hierarchy.push( {
					keys: [],
					sids: []
				} );

			}

		}

		return newData;

	}

	function calcAnimationBounds () {

		var start = 1000000;
		var end = -start;
		var frames = 0;
		var ID;
		for ( var id in animations ) {

			var animation = animations[ id ];
			ID = ID || animation.id;
			for ( var i = 0; i < animation.sampler.length; i ++ ) {

				var sampler = animation.sampler[ i ];

				sampler.create();

				start = Math.min( start, sampler.startTime );
				end = Math.max( end, sampler.endTime );
				frames = Math.max( frames, sampler.input.length );

			}

		}

		return { start:start, end:end, frames:frames,ID:ID };

	}

	function createMorph ( geometry, ctrl ) {

		var morphCtrl = ctrl instanceof InstanceController ? controllers[ ctrl.url ] : ctrl;

		if ( !morphCtrl || !morphCtrl.morph ) {

			console.log("could not find morph controller!");
			return;

		}

		var morph = morphCtrl.morph;

		for ( var i = 0; i < morph.targets.length; i ++ ) {

			var target_id = morph.targets[ i ];
			var daeGeometry = geometries[ target_id ];

			if ( !daeGeometry.mesh ||
				 !daeGeometry.mesh.primitives ||
				 !daeGeometry.mesh.primitives.length ) {
				 continue;
			}

			var target = daeGeometry.mesh.primitives[ 0 ].geometry;

			if ( target.vertices.length === geometry.vertices.length ) {

				geometry.morphTargets.push( { name: "target_1", vertices: target.vertices } );

			}

		}

		geometry.morphTargets.push( { name: "target_Z", vertices: geometry.vertices } );

	}

	function createSkin ( geometry, ctrl, applyBindShape ) {

		var skinCtrl = controllers[ ctrl.url ];

		if ( !skinCtrl || !skinCtrl.skin ) {

			console.log( "could not find skin controller!" );
			return;

		}

		if ( !ctrl.skeleton || !ctrl.skeleton.length ) {

			console.log( "could not find the skeleton for the skin!" );
			return;

		}

		var skin = skinCtrl.skin;
		var skeleton = visualScene.getChildById( ctrl.skeleton[ 0 ] );
		var hierarchy = [];

		applyBindShape = applyBindShape !== undefined ? applyBindShape : true;

		var bones = [];
		geometry.skinWeights = [];
		geometry.skinIndices = [];

		//createBones( geometry.bones, skin, hierarchy, skeleton, null, -1 );
		//createWeights( skin, geometry.bones, geometry.skinIndices, geometry.skinWeights );

		/*
		geometry.animation = {
			name: 'take_001',
			fps: 30,
			length: 2,
			JIT: true,
			hierarchy: hierarchy
		};
		*/

		if ( applyBindShape ) {

			for ( var i = 0; i < geometry.vertices.length; i ++ ) {

				geometry.vertices[ i ].applyMatrix4( skin.bindShapeMatrix );

			}

		}

	}

	function setupSkeleton ( node, bones, frame, parent ) {

		node.world = node.world || new THREE.Matrix4();
		node.localworld = node.localworld || new THREE.Matrix4();
		node.world.copy( node.matrix );
		node.localworld.copy( node.matrix );

		if ( node.channels && node.channels.length ) {

			var channel = node.channels[ 0 ];
			var m = channel.sampler.output[ frame ];

			if ( m instanceof THREE.Matrix4 ) {

				node.world.copy( m );
				node.localworld.copy(m);
				if (frame === 0)
					node.matrix.copy(m);
			}

		}

		if ( parent ) {

			node.world.multiplyMatrices( parent, node.world );

		}

		bones.push( node );

		for ( var i = 0; i < node.nodes.length; i ++ ) {

			setupSkeleton( node.nodes[ i ], bones, frame, node.world );

		}

	}

	function setupSkinningMatrices ( bones, skin ) {

		// FIXME: this is dumb...

		for ( var i = 0; i < bones.length; i ++ ) {

			var bone = bones[ i ];
			var found = -1;

			if ( bone.type != 'JOINT' ) continue;

			for ( var j = 0; j < skin.joints.length; j ++ ) {

				if ( bone.sid === skin.joints[ j ] ) {

					found = j;
					break;

				}

			}

			if ( found >= 0 ) {

				var inv = skin.invBindMatrices[ found ];

				bone.invBindMatrix = inv;
				bone.skinningMatrix = new THREE.Matrix4();
				bone.skinningMatrix.multiplyMatrices(bone.world, inv); // (IBMi * JMi)
				bone.animatrix = new THREE.Matrix4();

				bone.animatrix.copy(bone.localworld);
				bone.weights = [];

				for ( var j = 0; j < skin.weights.length; j ++ ) {

					for (var k = 0; k < skin.weights[ j ].length; k ++ ) {

						var w = skin.weights[ j ][ k ];

						if ( w.joint === found ) {

							bone.weights.push( w );

						}

					}

				}

			} else {

				console.warn( "ColladaLoader: Could not find joint '" + bone.sid + "'." );

				bone.skinningMatrix = new THREE.Matrix4();
				bone.weights = [];

			}
		}

	}

	//Walk the Collada tree and flatten the bones into a list, extract the position, quat and scale from the matrix
	function flattenSkeleton(skeleton) {

		var list = [];
		var walk = function(parentid, node, list) {

			var bone = {};
			bone.name = node.sid;
			bone.parent = parentid;
			bone.matrix = node.matrix;
			var data = [ new THREE.Vector3(),new THREE.Quaternion(),new THREE.Vector3() ];
			bone.matrix.decompose(data[0], data[1], data[2]);

			bone.pos = [ data[0].x,data[0].y,data[0].z ];

			bone.scl = [ data[2].x,data[2].y,data[2].z ];
			bone.rotq = [ data[1].x,data[1].y,data[1].z,data[1].w ];
			list.push(bone);

			for (var i in node.nodes) {

				walk(node.sid, node.nodes[i], list);

			}

		};

		walk(-1, skeleton, list);
		return list;

	}

	//Move the vertices into the pose that is proper for the start of the animation
	function skinToBindPose(geometry,skeleton,skinController) {

		var bones = [];
		setupSkeleton( skeleton, bones, -1 );
		setupSkinningMatrices( bones, skinController.skin );
		var v = new THREE.Vector3();
		var skinned = [];

		for (var i = 0; i < geometry.vertices.length; i ++) {

			skinned.push(new THREE.Vector3());

		}

		for ( i = 0; i < bones.length; i ++ ) {

			if ( bones[ i ].type != 'JOINT' ) continue;

			for ( var j = 0; j < bones[ i ].weights.length; j ++ ) {

				var w = bones[ i ].weights[ j ];
				var vidx = w.index;
				var weight = w.weight;

				var o = geometry.vertices[vidx];
				var s = skinned[vidx];

				v.x = o.x;
				v.y = o.y;
				v.z = o.z;

				v.applyMatrix4( bones[i].skinningMatrix );

				s.x += (v.x * weight);
				s.y += (v.y * weight);
				s.z += (v.z * weight);
			}

		}

		for (var i = 0; i < geometry.vertices.length; i ++) {

			geometry.vertices[i] = skinned[i];

		}

	}

	function applySkin ( geometry, instanceCtrl, frame ) {

		var skinController = controllers[ instanceCtrl.url ];

		frame = frame !== undefined ? frame : 40;

		if ( !skinController || !skinController.skin ) {

			console.log( 'ColladaLoader: Could not find skin controller.' );
			return;

		}

		if ( !instanceCtrl.skeleton || !instanceCtrl.skeleton.length ) {

			console.log( 'ColladaLoader: Could not find the skeleton for the skin. ' );
			return;

		}

		var animationBounds = calcAnimationBounds();
		var skeleton = visualScene.getChildById( instanceCtrl.skeleton[0], true ) || visualScene.getChildBySid( instanceCtrl.skeleton[0], true );

		//flatten the skeleton into a list of bones
		var bonelist = flattenSkeleton(skeleton);
		var joints = skinController.skin.joints;

		//sort that list so that the order reflects the order in the joint list
		var sortedbones = [];
		for (var i = 0; i < joints.length; i ++) {

			for (var j = 0; j < bonelist.length; j ++) {

				if (bonelist[j].name === joints[i]) {

					sortedbones[i] = bonelist[j];

				}

			}

		}

		//hook up the parents by index instead of name
		for (var i = 0; i < sortedbones.length; i ++) {

			for (var j = 0; j < sortedbones.length; j ++) {

				if (sortedbones[i].parent === sortedbones[j].name) {

					sortedbones[i].parent = j;

				}

			}

		}


		var i, j, w, vidx, weight;
		var v = new THREE.Vector3(), o, s;

		// move vertices to bind shape
		for ( i = 0; i < geometry.vertices.length; i ++ ) {
			geometry.vertices[i].applyMatrix4( skinController.skin.bindShapeMatrix );
		}

		var skinIndices = [];
		var skinWeights = [];
		var weights = skinController.skin.weights;

		// hook up the skin weights
		// TODO - this might be a good place to choose greatest 4 weights
		for ( var i =0; i < weights.length; i ++ ) {

			var indicies = new THREE.Vector4(weights[i][0] ? weights[i][0].joint : 0,weights[i][1] ? weights[i][1].joint : 0,weights[i][2] ? weights[i][2].joint : 0,weights[i][3] ? weights[i][3].joint : 0);
			var weight = new THREE.Vector4(weights[i][0] ? weights[i][0].weight : 0,weights[i][1] ? weights[i][1].weight : 0,weights[i][2] ? weights[i][2].weight : 0,weights[i][3] ? weights[i][3].weight : 0);

			skinIndices.push(indicies);
			skinWeights.push(weight);

		}

		geometry.skinIndices = skinIndices;
		geometry.skinWeights = skinWeights;
		geometry.bones = sortedbones;
		// process animation, or simply pose the rig if no animation

		//create an animation for the animated bones
		//NOTE: this has no effect when using morphtargets
		var animationdata = { "name":animationBounds.ID,"fps":30,"length":animationBounds.frames / 30,"hierarchy":[] };

		for (var j = 0; j < sortedbones.length; j ++) {

			animationdata.hierarchy.push({ parent:sortedbones[j].parent, name:sortedbones[j].name, keys:[] });

		}

		console.log( 'ColladaLoader:', animationBounds.ID + ' has ' + sortedbones.length + ' bones.' );



		skinToBindPose(geometry, skeleton, skinController);


		for ( frame = 0; frame < animationBounds.frames; frame ++ ) {

			var bones = [];
			var skinned = [];
			// process the frame and setup the rig with a fresh
			// transform, possibly from the bone's animation channel(s)

			setupSkeleton( skeleton, bones, frame );
			setupSkinningMatrices( bones, skinController.skin );

			for (var i = 0; i < bones.length; i ++) {

				for (var j = 0; j < animationdata.hierarchy.length; j ++) {

					if (animationdata.hierarchy[j].name === bones[i].sid) {

						var key = {};
						key.time = (frame / 30);
						key.matrix = bones[i].animatrix;

						if (frame === 0)
							bones[i].matrix = key.matrix;

						var data = [ new THREE.Vector3(),new THREE.Quaternion(),new THREE.Vector3() ];
						key.matrix.decompose(data[0], data[1], data[2]);

						key.pos = [ data[0].x,data[0].y,data[0].z ];

						key.scl = [ data[2].x,data[2].y,data[2].z ];
						key.rot = data[1];

						animationdata.hierarchy[j].keys.push(key);

					}

				}

			}

			geometry.animation = animationdata;

		}

	}

	function createKinematics() {

		if ( kinematicsModel && kinematicsModel.joints.length === 0 ) {
			kinematics = undefined;
			return;
		}

		var jointMap = {};

		var _addToMap = function( jointIndex, parentVisualElement ) {

			var parentVisualElementId = parentVisualElement.getAttribute( 'id' );
			var colladaNode = visualScene.getChildById( parentVisualElementId, true );
			var joint = kinematicsModel.joints[ jointIndex ];

			scene.traverse(function( node ) {

				if ( node.colladaId == parentVisualElementId ) {

					jointMap[ jointIndex ] = {
						node: node,
						transforms: colladaNode.transforms,
						joint: joint,
						position: joint.zeroPosition
					};

				}

			});

		};

		kinematics = {

			joints: kinematicsModel && kinematicsModel.joints,

			getJointValue: function( jointIndex ) {

				var jointData = jointMap[ jointIndex ];

				if ( jointData ) {

					return jointData.position;

				} else {

					console.log( 'getJointValue: joint ' + jointIndex + ' doesn\'t exist' );

				}

			},

			setJointValue: function( jointIndex, value ) {

				var jointData = jointMap[ jointIndex ];

				if ( jointData ) {

					var joint = jointData.joint;

					if ( value > joint.limits.max || value < joint.limits.min ) {

						console.log( 'setJointValue: joint ' + jointIndex + ' value ' + value + ' outside of limits (min: ' + joint.limits.min + ', max: ' + joint.limits.max + ')' );

					} else if ( joint.static ) {

						console.log( 'setJointValue: joint ' + jointIndex + ' is static' );

					} else {

						var threejsNode = jointData.node;
						var axis = joint.axis;
						var transforms = jointData.transforms;

						var matrix = new THREE.Matrix4();

						for (i = 0; i < transforms.length; i ++ ) {

							var transform = transforms[ i ];

							// kinda ghetto joint detection
							if ( transform.sid && transform.sid.indexOf( 'joint' + jointIndex ) !== -1 ) {

								// apply actual joint value here
								switch ( joint.type ) {

									case 'revolute':

										matrix.multiply( m1.makeRotationAxis( axis, THREE.Math.degToRad(value) ) );
										break;

									case 'prismatic':

										matrix.multiply( m1.makeTranslation(axis.x * value, axis.y * value, axis.z * value ) );
										break;

									default:

										console.warn( 'setJointValue: unknown joint type: ' + joint.type );
										break;

								}

							} else {

								var m1 = new THREE.Matrix4();

								switch ( transform.type ) {

									case 'matrix':

										matrix.multiply( transform.obj );

										break;

									case 'translate':

										matrix.multiply( m1.makeTranslation( transform.obj.x, transform.obj.y, transform.obj.z ) );

										break;

									case 'rotate':

										matrix.multiply( m1.makeRotationAxis( transform.obj, transform.angle ) );

										break;

								}
							}
						}

						// apply the matrix to the threejs node
						var elementsFloat32Arr = matrix.elements;
						var elements = Array.prototype.slice.call( elementsFloat32Arr );

						var elementsRowMajor = [
							elements[ 0 ],
							elements[ 4 ],
							elements[ 8 ],
							elements[ 12 ],
							elements[ 1 ],
							elements[ 5 ],
							elements[ 9 ],
							elements[ 13 ],
							elements[ 2 ],
							elements[ 6 ],
							elements[ 10 ],
							elements[ 14 ],
							elements[ 3 ],
							elements[ 7 ],
							elements[ 11 ],
							elements[ 15 ]
						];

						threejsNode.matrix.set.apply( threejsNode.matrix, elementsRowMajor );
						threejsNode.matrix.decompose( threejsNode.position, threejsNode.quaternion, threejsNode.scale );
					}

				} else {

					console.log( 'setJointValue: joint ' + jointIndex + ' doesn\'t exist' );

				}

			}

		};

		var element = COLLADA.querySelector('scene instance_kinematics_scene');

		if ( element ) {

			for ( var i = 0; i < element.childNodes.length; i ++ ) {

				var child = element.childNodes[ i ];

				if ( child.nodeType != 1 ) continue;

				switch ( child.nodeName ) {

					case 'bind_joint_axis':

						var visualTarget = child.getAttribute( 'target' ).split( '/' ).pop();
						var axis = child.querySelector('axis param').textContent;
						var jointIndex = parseInt( axis.split( 'joint' ).pop().split( '.' )[0] );
						var visualTargetElement = COLLADA.querySelector( '[sid="' + visualTarget + '"]' );

						if ( visualTargetElement ) {
							var parentVisualElement = visualTargetElement.parentElement;
							_addToMap(jointIndex, parentVisualElement);
						}

						break;

					default:

						break;

				}

			}
		}

	}

	function createSceneGraph ( node, parent ) {

		var obj = new THREE.Object3D();
		var skinned = false;
		var skinController;
		var morphController;
		var i, j;

		// FIXME: controllers

		for ( i = 0; i < node.controllers.length; i ++ ) {

			var controller = controllers[ node.controllers[ i ].url ];

			switch ( controller.type ) {

				case 'skin':

					if ( geometries[ controller.skin.source ] ) {

						var inst_geom = new InstanceGeometry();

						inst_geom.url = controller.skin.source;
						inst_geom.instance_material = node.controllers[ i ].instance_material;

						node.geometries.push( inst_geom );
						skinned = true;
						skinController = node.controllers[ i ];

					} else if ( controllers[ controller.skin.source ] ) {

						// urgh: controller can be chained
						// handle the most basic case...

						var second = controllers[ controller.skin.source ];
						morphController = second;
					//	skinController = node.controllers[i];

						if ( second.morph && geometries[ second.morph.source ] ) {

							var inst_geom = new InstanceGeometry();

							inst_geom.url = second.morph.source;
							inst_geom.instance_material = node.controllers[ i ].instance_material;

							node.geometries.push( inst_geom );

						}

					}

					break;

				case 'morph':

					if ( geometries[ controller.morph.source ] ) {

						var inst_geom = new InstanceGeometry();

						inst_geom.url = controller.morph.source;
						inst_geom.instance_material = node.controllers[ i ].instance_material;

						node.geometries.push( inst_geom );
						morphController = node.controllers[ i ];

					}

					console.log( 'ColladaLoader: Morph-controller partially supported.' );

				default:
					break;

			}

		}

		// geometries

		var double_sided_materials = {};

		for ( i = 0; i < node.geometries.length; i ++ ) {

			var instance_geometry = node.geometries[i];
			var instance_materials = instance_geometry.instance_material;
			var geometry = geometries[ instance_geometry.url ];
			var used_materials = {};
			var used_materials_array = [];
			var num_materials = 0;
			var first_material;

			if ( geometry ) {

				if ( !geometry.mesh || !geometry.mesh.primitives )
					continue;

				if ( obj.name.length === 0 ) {

					obj.name = geometry.id;

				}

				// collect used fx for this geometry-instance

				if ( instance_materials ) {

					for ( j = 0; j < instance_materials.length; j ++ ) {

						var instance_material = instance_materials[ j ];
						var mat = materials[ instance_material.target ];
						var effect_id = mat.instance_effect.url;
						var shader = effects[ effect_id ].shader;
						var material3js = shader.material;

						if ( geometry.doubleSided ) {

							if ( !( instance_material.symbol in double_sided_materials ) ) {

								var _copied_material = material3js.clone();
								_copied_material.side = THREE.DoubleSide;
								double_sided_materials[ instance_material.symbol ] = _copied_material;

							}

							material3js = double_sided_materials[ instance_material.symbol ];

						}

						material3js.opacity = !material3js.opacity ? 1 : material3js.opacity;
						used_materials[ instance_material.symbol ] = num_materials;
						used_materials_array.push( material3js );
						first_material = material3js;
						first_material.name = mat.name === null || mat.name === '' ? mat.id : mat.name;
						num_materials ++;

					}

				}

				var mesh;
				var material = first_material || new THREE.MeshLambertMaterial( { color: 0xdddddd, side: geometry.doubleSided ? THREE.DoubleSide : THREE.FrontSide } );
				var geom = geometry.mesh.geometry3js;

				if ( num_materials > 1 ) {

					material = new THREE.MultiMaterial( used_materials_array );
					
					for ( j = 0; j < geom.faces.length; j ++ ) {

						var face = geom.faces[ j ];
						face.materialIndex = used_materials[ face.daeMaterial ]

					}

				}

				if ( skinController !== undefined ) {


					applySkin( geom, skinController );

					if ( geom.morphTargets.length > 0 ) {

						material.morphTargets = true;
						material.skinning = false;

					} else {

						material.morphTargets = false;
						material.skinning = true;

					}


					mesh = new THREE.SkinnedMesh( geom, material, false );


					//mesh.skeleton = skinController.skeleton;
					//mesh.skinController = controllers[ skinController.url ];
					//mesh.skinInstanceController = skinController;
					mesh.name = 'skin_' + skins.length;



					//mesh.animationHandle.setKey(0);
					skins.push( mesh );

				} else if ( morphController !== undefined ) {

					createMorph( geom, morphController );

					material.morphTargets = true;

					mesh = new THREE.Mesh( geom, material );
					mesh.name = 'morph_' + morphs.length;

					morphs.push( mesh );

				} else {

					if ( geom.isLineStrip === true ) {

						mesh = new THREE.Line( geom );

					} else {

						mesh = new THREE.Mesh( geom, material );

					}

				}

				obj.add(mesh);

			}

		}

		for ( i = 0; i < node.cameras.length; i ++ ) {

			var instance_camera = node.cameras[i];
			var cparams = cameras[instance_camera.url];

			var cam = new THREE.PerspectiveCamera(cparams.yfov, parseFloat(cparams.aspect_ratio),
					parseFloat(cparams.znear), parseFloat(cparams.zfar));

			obj.add(cam);
		}

		for ( i = 0; i < node.lights.length; i ++ ) {

			var light = null;
			var instance_light = node.lights[i];
			var lparams = lights[instance_light.url];

			if ( lparams && lparams.technique ) {

				var color = lparams.color.getHex();
				var intensity = lparams.intensity;
				var distance = lparams.distance;
				var angle = lparams.falloff_angle;

				switch ( lparams.technique ) {

					case 'directional':

						light = new THREE.DirectionalLight( color, intensity, distance );
						light.position.set(0, 0, 1);
						break;

					case 'point':

						light = new THREE.PointLight( color, intensity, distance );
						break;

					case 'spot':

						light = new THREE.SpotLight( color, intensity, distance, angle );
						light.position.set(0, 0, 1);
						break;

					case 'ambient':

						light = new THREE.AmbientLight( color );
						break;

				}

			}

			if (light) {
				obj.add(light);
			}
		}

		obj.name = node.name || node.id || "";
		obj.colladaId = node.id || "";
		obj.layer = node.layer || "";
		obj.matrix = node.matrix;
		obj.matrix.decompose( obj.position, obj.quaternion, obj.scale );

		if ( options.centerGeometry && obj.geometry ) {

			var delta = obj.geometry.center();
			delta.multiply( obj.scale );
			delta.applyQuaternion( obj.quaternion );

			obj.position.sub( delta );

		}

		for ( i = 0; i < node.nodes.length; i ++ ) {

			obj.add( createSceneGraph( node.nodes[i], node ) );

		}

		return obj;

	}

	function getJointId( skin, id ) {

		for ( var i = 0; i < skin.joints.length; i ++ ) {

			if ( skin.joints[ i ] === id ) {

				return i;

			}

		}

	}

	function getLibraryNode( id ) {

		var nodes = COLLADA.querySelectorAll('library_nodes node');

		for ( var i = 0; i < nodes.length; i++ ) {

			var attObj = nodes[i].attributes.getNamedItem('id');

			if ( attObj && attObj.value === id ) {

				return nodes[i];

			}

		}

		return undefined;

	}

	function getChannelsForNode ( node ) {

		var channels = [];
		var startTime = 1000000;
		var endTime = -1000000;

		for ( var id in animations ) {

			var animation = animations[id];

			for ( var i = 0; i < animation.channel.length; i ++ ) {

				var channel = animation.channel[i];
				var sampler = animation.sampler[i];
				var id = channel.target.split('/')[0];

				if ( id == node.id ) {

					sampler.create();
					channel.sampler = sampler;
					startTime = Math.min(startTime, sampler.startTime);
					endTime = Math.max(endTime, sampler.endTime);
					channels.push(channel);

				}

			}

		}

		if ( channels.length ) {

			node.startTime = startTime;
			node.endTime = endTime;

		}

		return channels;

	}

	function calcFrameDuration( node ) {

		var minT = 10000000;

		for ( var i = 0; i < node.channels.length; i ++ ) {

			var sampler = node.channels[i].sampler;

			for ( var j = 0; j < sampler.input.length - 1; j ++ ) {

				var t0 = sampler.input[ j ];
				var t1 = sampler.input[ j + 1 ];
				minT = Math.min( minT, t1 - t0 );

			}
		}

		return minT;

	}

	function calcMatrixAt( node, t ) {

		var animated = {};

		var i, j;

		for ( i = 0; i < node.channels.length; i ++ ) {

			var channel = node.channels[ i ];
			animated[ channel.sid ] = channel;

		}

		var matrix = new THREE.Matrix4();

		for ( i = 0; i < node.transforms.length; i ++ ) {

			var transform = node.transforms[ i ];
			var channel = animated[ transform.sid ];

			if ( channel !== undefined ) {

				var sampler = channel.sampler;
				var value;

				for ( j = 0; j < sampler.input.length - 1; j ++ ) {

					if ( sampler.input[ j + 1 ] > t ) {

						value = sampler.output[ j ];
						//console.log(value.flatten)
						break;

					}

				}

				if ( value !== undefined ) {

					if ( value instanceof THREE.Matrix4 ) {

						matrix.multiplyMatrices( matrix, value );

					} else {

						// FIXME: handle other types

						matrix.multiplyMatrices( matrix, transform.matrix );

					}

				} else {

					matrix.multiplyMatrices( matrix, transform.matrix );

				}

			} else {

				matrix.multiplyMatrices( matrix, transform.matrix );

			}

		}

		return matrix;

	}

	function bakeAnimations ( node ) {

		if ( node.channels && node.channels.length ) {

			var keys = [],
				sids = [];

			for ( var i = 0, il = node.channels.length; i < il; i ++ ) {

				var channel = node.channels[i],
					fullSid = channel.fullSid,
					sampler = channel.sampler,
					input = sampler.input,
					transform = node.getTransformBySid( channel.sid ),
					member;

				if ( channel.arrIndices ) {

					member = [];

					for ( var j = 0, jl = channel.arrIndices.length; j < jl; j ++ ) {

						member[ j ] = getConvertedIndex( channel.arrIndices[ j ] );

					}

				} else {

					member = getConvertedMember( channel.member );

				}

				if ( transform ) {

					if ( sids.indexOf( fullSid ) === -1 ) {

						sids.push( fullSid );

					}

					for ( var j = 0, jl = input.length; j < jl; j ++ ) {

						var time = input[j],
							data = sampler.getData( transform.type, j, member ),
							key = findKey( keys, time );

						if ( !key ) {

							key = new Key( time );
							var timeNdx = findTimeNdx( keys, time );
							keys.splice( timeNdx === -1 ? keys.length : timeNdx, 0, key );

						}

						key.addTarget( fullSid, transform, member, data );

					}

				} else {

					console.log( 'Could not find transform "' + channel.sid + '" in node ' + node.id );

				}

			}

			// post process
			for ( var i = 0; i < sids.length; i ++ ) {

				var sid = sids[ i ];

				for ( var j = 0; j < keys.length; j ++ ) {

					var key = keys[ j ];

					if ( !key.hasTarget( sid ) ) {

						interpolateKeys( keys, key, j, sid );

					}

				}

			}

			node.keys = keys;
			node.sids = sids;

		}

	}

	function findKey ( keys, time) {

		var retVal = null;

		for ( var i = 0, il = keys.length; i < il && retVal === null; i ++ ) {

			var key = keys[i];

			if ( key.time === time ) {

				retVal = key;

			} else if ( key.time > time ) {

				break;

			}

		}

		return retVal;

	}

	function findTimeNdx ( keys, time) {

		var ndx = -1;

		for ( var i = 0, il = keys.length; i < il && ndx === -1; i ++ ) {

			var key = keys[i];

			if ( key.time >= time ) {

				ndx = i;

			}

		}

		return ndx;

	}

	function interpolateKeys ( keys, key, ndx, fullSid ) {

		var prevKey = getPrevKeyWith( keys, fullSid, ndx ? ndx - 1 : 0 ),
			nextKey = getNextKeyWith( keys, fullSid, ndx + 1 );

		if ( prevKey && nextKey ) {

			var scale = (key.time - prevKey.time) / (nextKey.time - prevKey.time),
				prevTarget = prevKey.getTarget( fullSid ),
				nextData = nextKey.getTarget( fullSid ).data,
				prevData = prevTarget.data,
				data;

			if ( prevTarget.type === 'matrix' ) {

				data = prevData;

			} else if ( prevData.length ) {

				data = [];

				for ( var i = 0; i < prevData.length; ++ i ) {

					data[ i ] = prevData[ i ] + ( nextData[ i ] - prevData[ i ] ) * scale;

				}

			} else {

				data = prevData + ( nextData - prevData ) * scale;

			}

			key.addTarget( fullSid, prevTarget.transform, prevTarget.member, data );

		}

	}

	// Get next key with given sid

	function getNextKeyWith( keys, fullSid, ndx ) {

		for ( ; ndx < keys.length; ndx ++ ) {

			var key = keys[ ndx ];

			if ( key.hasTarget( fullSid ) ) {

				return key;

			}

		}

		return null;

	}

	// Get previous key with given sid

	function getPrevKeyWith( keys, fullSid, ndx ) {

		ndx = ndx >= 0 ? ndx : ndx + keys.length;

		for ( ; ndx >= 0; ndx -- ) {

			var key = keys[ ndx ];

			if ( key.hasTarget( fullSid ) ) {

				return key;

			}

		}

		return null;

	}

	function _Image() {

		this.id = "";
		this.init_from = "";

	}

	_Image.prototype.parse = function(element) {

		this.id = element.getAttribute('id');

		for ( var i = 0; i < element.childNodes.length; i ++ ) {

			var child = element.childNodes[ i ];

			if ( child.nodeName === 'init_from' ) {

				this.init_from = child.textContent;

			}

		}

		return this;

	};

	function Controller() {

		this.id = "";
		this.name = "";
		this.type = "";
		this.skin = null;
		this.morph = null;

	}

	Controller.prototype.parse = function( element ) {

		this.id = element.getAttribute('id');
		this.name = element.getAttribute('name');
		this.type = "none";

		for ( var i = 0; i < element.childNodes.length; i ++ ) {

			var child = element.childNodes[ i ];

			switch ( child.nodeName ) {

				case 'skin':

					this.skin = (new Skin()).parse(child);
					this.type = child.nodeName;
					break;

				case 'morph':

					this.morph = (new Morph()).parse(child);
					this.type = child.nodeName;
					break;

				default:
					break;

			}
		}

		return this;

	};

	function Morph() {

		this.method = null;
		this.source = null;
		this.targets = null;
		this.weights = null;

	}

	Morph.prototype.parse = function( element ) {

		var sources = {};
		var inputs = [];
		var i;

		this.method = element.getAttribute( 'method' );
		this.source = element.getAttribute( 'source' ).replace( /^#/, '' );

		for ( i = 0; i < element.childNodes.length; i ++ ) {

			var child = element.childNodes[ i ];
			if ( child.nodeType != 1 ) continue;

			switch ( child.nodeName ) {

				case 'source':

					var source = ( new Source() ).parse( child );
					sources[ source.id ] = source;
					break;

				case 'targets':

					inputs = this.parseInputs( child );
					break;

				default:

					console.log( child.nodeName );
					break;

			}

		}

		for ( i = 0; i < inputs.length; i ++ ) {

			var input = inputs[ i ];
			var source = sources[ input.source ];

			switch ( input.semantic ) {

				case 'MORPH_TARGET':

					this.targets = source.read();
					break;

				case 'MORPH_WEIGHT':

					this.weights = source.read();
					break;

				default:
					break;

			}
		}

		return this;

	};

	Morph.prototype.parseInputs = function(element) {

		var inputs = [];

		for ( var i = 0; i < element.childNodes.length; i ++ ) {

			var child = element.childNodes[i];
			if ( child.nodeType != 1) continue;

			switch ( child.nodeName ) {

				case 'input':

					inputs.push( (new Input()).parse(child) );
					break;

				default:
					break;
			}
		}

		return inputs;

	};

	function Skin() {

		this.source = "";
		this.bindShapeMatrix = null;
		this.invBindMatrices = [];
		this.joints = [];
		this.weights = [];

	}

	Skin.prototype.parse = function( element ) {

		var sources = {};
		var joints, weights;

		this.source = element.getAttribute( 'source' ).replace( /^#/, '' );
		this.invBindMatrices = [];
		this.joints = [];
		this.weights = [];

		for ( var i = 0; i < element.childNodes.length; i ++ ) {

			var child = element.childNodes[i];
			if ( child.nodeType != 1 ) continue;

			switch ( child.nodeName ) {

				case 'bind_shape_matrix':

					var f = _floats(child.textContent);
					this.bindShapeMatrix = getConvertedMat4( f );
					break;

				case 'source':

					var src = new Source().parse(child);
					sources[ src.id ] = src;
					break;

				case 'joints':

					joints = child;
					break;

				case 'vertex_weights':

					weights = child;
					break;

				default:

					console.log( child.nodeName );
					break;

			}
		}

		this.parseJoints( joints, sources );
		this.parseWeights( weights, sources );

		return this;

	};

	Skin.prototype.parseJoints = function ( element, sources ) {

		for ( var i = 0; i < element.childNodes.length; i ++ ) {

			var child = element.childNodes[ i ];
			if ( child.nodeType != 1 ) continue;

			switch ( child.nodeName ) {

				case 'input':

					var input = ( new Input() ).parse( child );
					var source = sources[ input.source ];

					if ( input.semantic === 'JOINT' ) {

						this.joints = source.read();

					} else if ( input.semantic === 'INV_BIND_MATRIX' ) {

						this.invBindMatrices = source.read();

					}

					break;

				default:
					break;
			}

		}

	};

	Skin.prototype.parseWeights = function ( element, sources ) {

		var v, vcount, inputs = [];

		for ( var i = 0; i < element.childNodes.length; i ++ ) {

			var child = element.childNodes[ i ];
			if ( child.nodeType != 1 ) continue;

			switch ( child.nodeName ) {

				case 'input':

					inputs.push( ( new Input() ).parse( child ) );
					break;

				case 'v':

					v = _ints( child.textContent );
					break;

				case 'vcount':

					vcount = _ints( child.textContent );
					break;

				default:
					break;

			}

		}

		var index = 0;

		for ( var i = 0; i < vcount.length; i ++ ) {

			var numBones = vcount[i];
			var vertex_weights = [];

			for ( var j = 0; j < numBones; j ++ ) {

				var influence = {};

				for ( var k = 0; k < inputs.length; k ++ ) {

					var input = inputs[ k ];
					var value = v[ index + input.offset ];

					switch ( input.semantic ) {

						case 'JOINT':

							influence.joint = value;//this.joints[value];
							break;

						case 'WEIGHT':

							influence.weight = sources[ input.source ].data[ value ];
							break;

						default:
							break;

					}

				}

				vertex_weights.push( influence );
				index += inputs.length;
			}

			for ( var j = 0; j < vertex_weights.length; j ++ ) {

				vertex_weights[ j ].index = i;

			}

			this.weights.push( vertex_weights );

		}

	};

	function VisualScene () {

		this.id = "";
		this.name = "";
		this.nodes = [];
		this.scene = new THREE.Group();

	}

	VisualScene.prototype.getChildById = function( id, recursive ) {

		for ( var i = 0; i < this.nodes.length; i ++ ) {

			var node = this.nodes[ i ].getChildById( id, recursive );

			if ( node ) {

				return node;

			}

		}

		return null;

	};

	VisualScene.prototype.getChildBySid = function( sid, recursive ) {

		for ( var i = 0; i < this.nodes.length; i ++ ) {

			var node = this.nodes[ i ].getChildBySid( sid, recursive );

			if ( node ) {

				return node;

			}

		}

		return null;

	};

	VisualScene.prototype.parse = function( element ) {

		this.id = element.getAttribute( 'id' );
		this.name = element.getAttribute( 'name' );
		this.nodes = [];

		for ( var i = 0; i < element.childNodes.length; i ++ ) {

			var child = element.childNodes[ i ];
			if ( child.nodeType != 1 ) continue;

			switch ( child.nodeName ) {

				case 'node':

					this.nodes.push( ( new Node() ).parse( child ) );
					break;

				default:
					break;

			}

		}

		return this;

	};

	function Node() {

		this.id = "";
		this.name = "";
		this.sid = "";
		this.nodes = [];
		this.controllers = [];
		this.transforms = [];
		this.geometries = [];
		this.channels = [];
		this.matrix = new THREE.Matrix4();

	}

	Node.prototype.getChannelForTransform = function( transformSid ) {

		for ( var i = 0; i < this.channels.length; i ++ ) {

			var channel = this.channels[i];
			var parts = channel.target.split('/');
			var id = parts.shift();
			var sid = parts.shift();
			var dotSyntax = (sid.indexOf(".") >= 0);
			var arrSyntax = (sid.indexOf("(") >= 0);
			var arrIndices;
			var member;

			if ( dotSyntax ) {

				parts = sid.split(".");
				sid = parts.shift();
				member = parts.shift();

			} else if ( arrSyntax ) {

				arrIndices = sid.split("(");
				sid = arrIndices.shift();

				for ( var j = 0; j < arrIndices.length; j ++ ) {

					arrIndices[ j ] = parseInt( arrIndices[ j ].replace( /\)/, '' ) );

				}

			}

			if ( sid === transformSid ) {

				channel.info = { sid: sid, dotSyntax: dotSyntax, arrSyntax: arrSyntax, arrIndices: arrIndices };
				return channel;

			}

		}

		return null;

	};

	Node.prototype.getChildById = function ( id, recursive ) {

		if ( this.id === id ) {

			return this;

		}

		if ( recursive ) {

			for ( var i = 0; i < this.nodes.length; i ++ ) {

				var n = this.nodes[ i ].getChildById( id, recursive );

				if ( n ) {

					return n;

				}

			}

		}

		return null;

	};

	Node.prototype.getChildBySid = function ( sid, recursive ) {

		if ( this.sid === sid ) {

			return this;

		}

		if ( recursive ) {

			for ( var i = 0; i < this.nodes.length; i ++ ) {

				var n = this.nodes[ i ].getChildBySid( sid, recursive );

				if ( n ) {

					return n;

				}

			}
		}

		return null;

	};

	Node.prototype.getTransformBySid = function ( sid ) {

		for ( var i = 0; i < this.transforms.length; i ++ ) {

			if ( this.transforms[ i ].sid === sid ) return this.transforms[ i ];

		}

		return null;

	};

	Node.prototype.parse = function( element ) {

		var url;

		this.id = element.getAttribute('id');
		this.sid = element.getAttribute('sid');
		this.name = element.getAttribute('name');
		this.type = element.getAttribute('type');
		this.layer = element.getAttribute('layer');

		this.type = this.type === 'JOINT' ? this.type : 'NODE';

		this.nodes = [];
		this.transforms = [];
		this.geometries = [];
		this.cameras = [];
		this.lights = [];
		this.controllers = [];
		this.matrix = new THREE.Matrix4();

		for ( var i = 0; i < element.childNodes.length; i ++ ) {

			var child = element.childNodes[ i ];
			if ( child.nodeType != 1 ) continue;

			switch ( child.nodeName ) {

				case 'node':

					this.nodes.push( ( new Node() ).parse( child ) );
					break;

				case 'instance_camera':

					this.cameras.push( ( new InstanceCamera() ).parse( child ) );
					break;

				case 'instance_controller':

					this.controllers.push( ( new InstanceController() ).parse( child ) );
					break;

				case 'instance_geometry':

					this.geometries.push( ( new InstanceGeometry() ).parse( child ) );
					break;

				case 'instance_light':

					this.lights.push( ( new InstanceLight() ).parse( child ) );
					break;

				case 'instance_node':

					url = child.getAttribute( 'url' ).replace( /^#/, '' );
					var iNode = getLibraryNode( url );

					if ( iNode ) {

						this.nodes.push( ( new Node() ).parse( iNode )) ;

					}

					break;

				case 'rotate':
				case 'translate':
				case 'scale':
				case 'matrix':
				case 'lookat':
				case 'skew':

					this.transforms.push( ( new Transform() ).parse( child ) );
					break;

				case 'extra':
					break;

				default:

					console.log( child.nodeName );
					break;

			}

		}

		this.channels = getChannelsForNode( this );
		bakeAnimations( this );

		this.updateMatrix();

		return this;

	};

	Node.prototype.updateMatrix = function () {

		this.matrix.identity();

		for ( var i = 0; i < this.transforms.length; i ++ ) {

			this.transforms[ i ].apply( this.matrix );

		}

	};

	function Transform () {

		this.sid = "";
		this.type = "";
		this.data = [];
		this.obj = null;

	}

	Transform.prototype.parse = function ( element ) {

		this.sid = element.getAttribute( 'sid' );
		this.type = element.nodeName;
		this.data = _floats( element.textContent );
		this.convert();

		return this;

	};

	Transform.prototype.convert = function () {

		switch ( this.type ) {

			case 'matrix':

				this.obj = getConvertedMat4( this.data );
				break;

			case 'rotate':

				this.angle = THREE.Math.degToRad( this.data[3] );

			case 'translate':

				fixCoords( this.data, -1 );
				this.obj = new THREE.Vector3( this.data[ 0 ], this.data[ 1 ], this.data[ 2 ] );
				break;

			case 'scale':

				fixCoords( this.data, 1 );
				this.obj = new THREE.Vector3( this.data[ 0 ], this.data[ 1 ], this.data[ 2 ] );
				break;

			default:
				console.log( 'Can not convert Transform of type ' + this.type );
				break;

		}

	};

	Transform.prototype.apply = function () {

		var m1 = new THREE.Matrix4();

		return function ( matrix ) {

			switch ( this.type ) {

				case 'matrix':

					matrix.multiply( this.obj );

					break;

				case 'translate':

					matrix.multiply( m1.makeTranslation( this.obj.x, this.obj.y, this.obj.z ) );

					break;

				case 'rotate':

					matrix.multiply( m1.makeRotationAxis( this.obj, this.angle ) );

					break;

				case 'scale':

					matrix.scale( this.obj );

					break;

			}

		};

	}();

	Transform.prototype.update = function ( data, member ) {

		var members = [ 'X', 'Y', 'Z', 'ANGLE' ];

		switch ( this.type ) {

			case 'matrix':

				if ( ! member ) {

					this.obj.copy( data );

				} else if ( member.length === 1 ) {

					switch ( member[ 0 ] ) {

						case 0:

							this.obj.n11 = data[ 0 ];
							this.obj.n21 = data[ 1 ];
							this.obj.n31 = data[ 2 ];
							this.obj.n41 = data[ 3 ];

							break;

						case 1:

							this.obj.n12 = data[ 0 ];
							this.obj.n22 = data[ 1 ];
							this.obj.n32 = data[ 2 ];
							this.obj.n42 = data[ 3 ];

							break;

						case 2:

							this.obj.n13 = data[ 0 ];
							this.obj.n23 = data[ 1 ];
							this.obj.n33 = data[ 2 ];
							this.obj.n43 = data[ 3 ];

							break;

						case 3:

							this.obj.n14 = data[ 0 ];
							this.obj.n24 = data[ 1 ];
							this.obj.n34 = data[ 2 ];
							this.obj.n44 = data[ 3 ];

							break;

					}

				} else if ( member.length === 2 ) {

					var propName = 'n' + ( member[ 0 ] + 1 ) + ( member[ 1 ] + 1 );
					this.obj[ propName ] = data;

				} else {

					console.log('Incorrect addressing of matrix in transform.');

				}

				break;

			case 'translate':
			case 'scale':

				if ( Object.prototype.toString.call( member ) === '[object Array]' ) {

					member = members[ member[ 0 ] ];

				}

				switch ( member ) {

					case 'X':

						this.obj.x = data;
						break;

					case 'Y':

						this.obj.y = data;
						break;

					case 'Z':

						this.obj.z = data;
						break;

					default:

						this.obj.x = data[ 0 ];
						this.obj.y = data[ 1 ];
						this.obj.z = data[ 2 ];
						break;

				}

				break;

			case 'rotate':

				if ( Object.prototype.toString.call( member ) === '[object Array]' ) {

					member = members[ member[ 0 ] ];

				}

				switch ( member ) {

					case 'X':

						this.obj.x = data;
						break;

					case 'Y':

						this.obj.y = data;
						break;

					case 'Z':

						this.obj.z = data;
						break;

					case 'ANGLE':

						this.angle = THREE.Math.degToRad( data );
						break;

					default:

						this.obj.x = data[ 0 ];
						this.obj.y = data[ 1 ];
						this.obj.z = data[ 2 ];
						this.angle = THREE.Math.degToRad( data[ 3 ] );
						break;

				}
				break;

		}

	};

	function InstanceController() {

		this.url = "";
		this.skeleton = [];
		this.instance_material = [];

	}

	InstanceController.prototype.parse = function ( element ) {

		this.url = element.getAttribute('url').replace(/^#/, '');
		this.skeleton = [];
		this.instance_material = [];

		for ( var i = 0; i < element.childNodes.length; i ++ ) {

			var child = element.childNodes[ i ];
			if ( child.nodeType !== 1 ) continue;

			switch ( child.nodeName ) {

				case 'skeleton':

					this.skeleton.push( child.textContent.replace(/^#/, '') );
					break;

				case 'bind_material':

					var instances = child.querySelectorAll('instance_material');

					for ( var j = 0; j < instances.length; j ++ ) {

						var instance = instances[j];
						this.instance_material.push( (new InstanceMaterial()).parse(instance) );

					}


					break;

				case 'extra':
					break;

				default:
					break;

			}
		}

		return this;

	};

	function InstanceMaterial () {

		this.symbol = "";
		this.target = "";

	}

	InstanceMaterial.prototype.parse = function ( element ) {

		this.symbol = element.getAttribute('symbol');
		this.target = element.getAttribute('target').replace(/^#/, '');
		return this;

	};

	function InstanceGeometry() {

		this.url = "";
		this.instance_material = [];

	}

	InstanceGeometry.prototype.parse = function ( element ) {

		this.url = element.getAttribute('url').replace(/^#/, '');
		this.instance_material = [];

		for ( var i = 0; i < element.childNodes.length; i ++ ) {

			var child = element.childNodes[i];
			if ( child.nodeType != 1 ) continue;

			if ( child.nodeName === 'bind_material' ) {

				var instances = child.querySelectorAll('instance_material');

				for ( var j = 0; j < instances.length; j ++ ) {

					var instance = instances[j];
					this.instance_material.push( (new InstanceMaterial()).parse(instance) );

				}

				break;

			}

		}

		return this;

	};

	function Geometry() {

		this.id = "";
		this.mesh = null;

	}

	Geometry.prototype.parse = function ( element ) {

		this.id = element.getAttribute('id');

		extractDoubleSided( this, element );

		for ( var i = 0; i < element.childNodes.length; i ++ ) {

			var child = element.childNodes[i];

			switch ( child.nodeName ) {

				case 'mesh':

					this.mesh = (new Mesh(this)).parse(child);
					break;

				case 'extra':

					// console.log( child );
					break;

				default:
					break;
			}
		}

		return this;

	};

	function Mesh( geometry ) {

		this.geometry = geometry.id;
		this.primitives = [];
		this.vertices = null;
		this.geometry3js = null;

	}

	Mesh.prototype.parse = function ( element ) {

		this.primitives = [];

		for ( var i = 0; i < element.childNodes.length; i ++ ) {

			var child = element.childNodes[ i ];

			switch ( child.nodeName ) {

				case 'source':

					_source( child );
					break;

				case 'vertices':

					this.vertices = ( new Vertices() ).parse( child );
					break;

				case 'linestrips':

					this.primitives.push( ( new LineStrips().parse( child ) ) );
					break;

				case 'triangles':

					this.primitives.push( ( new Triangles().parse( child ) ) );
					break;

				case 'polygons':

					this.primitives.push( ( new Polygons().parse( child ) ) );
					break;

				case 'polylist':

					this.primitives.push( ( new Polylist().parse( child ) ) );
					break;

				default:
					break;

			}

		}

		this.geometry3js = new THREE.Geometry();

		if ( this.vertices === null ) {

			// TODO (mrdoob): Study case when this is null (carrier.dae)

			return this;

		}

		var vertexData = sources[ this.vertices.input['POSITION'].source ].data;

		for ( var i = 0; i < vertexData.length; i += 3 ) {

			this.geometry3js.vertices.push( getConvertedVec3( vertexData, i ).clone() );

		}

		for ( var i = 0; i < this.primitives.length; i ++ ) {

			var primitive = this.primitives[ i ];
			primitive.setVertices( this.vertices );
			this.handlePrimitive( primitive, this.geometry3js );

		}

		if ( this.geometry3js.calcNormals ) {

			this.geometry3js.computeVertexNormals();
			delete this.geometry3js.calcNormals;

		}

		return this;

	};

	Mesh.prototype.handlePrimitive = function ( primitive, geom ) {

		if ( primitive instanceof LineStrips ) {

			// TODO: Handle indices. Maybe easier with BufferGeometry?

			geom.isLineStrip = true;
			return;

		}

		var j, k, pList = primitive.p, inputs = primitive.inputs;
		var input, index, idx32;
		var source, numParams;
		var vcIndex = 0, vcount = 3, maxOffset = 0;
		var texture_sets = [];

		for ( j = 0; j < inputs.length; j ++ ) {

			input = inputs[ j ];

			var offset = input.offset + 1;
			maxOffset = (maxOffset < offset) ? offset : maxOffset;

			switch ( input.semantic ) {

				case 'TEXCOORD':
					texture_sets.push( input.set );
					break;

			}

		}

		for ( var pCount = 0; pCount < pList.length; ++ pCount ) {

			var p = pList[ pCount ], i = 0;

			while ( i < p.length ) {

				var vs = [];
				var ns = [];
				var ts = null;
				var cs = [];

				if ( primitive.vcount ) {

					vcount = primitive.vcount.length ? primitive.vcount[ vcIndex ++ ] : primitive.vcount;

				} else {

					vcount = p.length / maxOffset;

				}


				for ( j = 0; j < vcount; j ++ ) {

					for ( k = 0; k < inputs.length; k ++ ) {

						input = inputs[ k ];
						source = sources[ input.source ];

						index = p[ i + ( j * maxOffset ) + input.offset ];
						numParams = source.accessor.params.length;
						idx32 = index * numParams;

						switch ( input.semantic ) {

							case 'VERTEX':

								vs.push( index );

								break;

							case 'NORMAL':

								ns.push( getConvertedVec3( source.data, idx32 ) );

								break;

							case 'TEXCOORD':

								ts = ts || { };
								if ( ts[ input.set ] === undefined ) ts[ input.set ] = [];
								// invert the V
								ts[ input.set ].push( new THREE.Vector2( source.data[ idx32 ], source.data[ idx32 + 1 ] ) );

								break;

							case 'COLOR':

								cs.push( new THREE.Color().setRGB( source.data[ idx32 ], source.data[ idx32 + 1 ], source.data[ idx32 + 2 ] ) );

								break;

							default:

								break;

						}

					}

				}

				if ( ns.length === 0 ) {

					// check the vertices inputs
					input = this.vertices.input.NORMAL;

					if ( input ) {

						source = sources[ input.source ];
						numParams = source.accessor.params.length;

						for ( var ndx = 0, len = vs.length; ndx < len; ndx ++ ) {

							ns.push( getConvertedVec3( source.data, vs[ ndx ] * numParams ) );

						}

					} else {

						geom.calcNormals = true;

					}

				}

				if ( !ts ) {

					ts = { };
					// check the vertices inputs
					input = this.vertices.input.TEXCOORD;

					if ( input ) {

						texture_sets.push( input.set );
						source = sources[ input.source ];
						numParams = source.accessor.params.length;

						for ( var ndx = 0, len = vs.length; ndx < len; ndx ++ ) {

							idx32 = vs[ ndx ] * numParams;
							if ( ts[ input.set ] === undefined ) ts[ input.set ] = [ ];
							// invert the V
							ts[ input.set ].push( new THREE.Vector2( source.data[ idx32 ], 1.0 - source.data[ idx32 + 1 ] ) );

						}

					}

				}

				if ( cs.length === 0 ) {

					// check the vertices inputs
					input = this.vertices.input.COLOR;

					if ( input ) {

						source = sources[ input.source ];
						numParams = source.accessor.params.length;

						for ( var ndx = 0, len = vs.length; ndx < len; ndx ++ ) {

							idx32 = vs[ ndx ] * numParams;
							cs.push( new THREE.Color().setRGB( source.data[ idx32 ], source.data[ idx32 + 1 ], source.data[ idx32 + 2 ] ) );

						}

					}

				}

				var face = null, faces = [], uv, uvArr;

				if ( vcount === 3 ) {

					faces.push( new THREE.Face3( vs[0], vs[1], vs[2], ns, cs.length ? cs : new THREE.Color() ) );

				} else if ( vcount === 4 ) {

					faces.push( new THREE.Face3( vs[0], vs[1], vs[3], ns.length ? [ ns[0].clone(), ns[1].clone(), ns[3].clone() ] : [], cs.length ? [ cs[0], cs[1], cs[3] ] : new THREE.Color() ) );

					faces.push( new THREE.Face3( vs[1], vs[2], vs[3], ns.length ? [ ns[1].clone(), ns[2].clone(), ns[3].clone() ] : [], cs.length ? [ cs[1], cs[2], cs[3] ] : new THREE.Color() ) );

				} else if ( vcount > 4 && options.subdivideFaces ) {

					var clr = cs.length ? cs : new THREE.Color(),
						vec1, vec2, vec3, v1, v2, norm;

					// subdivide into multiple Face3s

					for ( k = 1; k < vcount - 1; ) {

						faces.push( new THREE.Face3( vs[0], vs[k], vs[k + 1], ns.length ? [ ns[0].clone(), ns[k ++].clone(), ns[k].clone() ] : [], clr ) );

					}

				}

				if ( faces.length ) {

					for ( var ndx = 0, len = faces.length; ndx < len; ndx ++ ) {

						face = faces[ndx];
						face.daeMaterial = primitive.material;
						geom.faces.push( face );

						for ( k = 0; k < texture_sets.length; k ++ ) {

							uv = ts[ texture_sets[k] ];

							if ( vcount > 4 ) {

								// Grab the right UVs for the vertices in this face
								uvArr = [ uv[0], uv[ndx + 1], uv[ndx + 2] ];

							} else if ( vcount === 4 ) {

								if ( ndx === 0 ) {

									uvArr = [ uv[0], uv[1], uv[3] ];

								} else {

									uvArr = [ uv[1].clone(), uv[2], uv[3].clone() ];

								}

							} else {

								uvArr = [ uv[0], uv[1], uv[2] ];

							}

							if ( geom.faceVertexUvs[k] === undefined ) {

								geom.faceVertexUvs[k] = [];

							}

							geom.faceVertexUvs[k].push( uvArr );

						}

					}

				} else {

					console.log( 'dropped face with vcount ' + vcount + ' for geometry with id: ' + geom.id );

				}

				i += maxOffset * vcount;

			}

		}

	};

	function Polygons () {

		this.material = "";
		this.count = 0;
		this.inputs = [];
		this.vcount = null;
		this.p = [];
		this.geometry = new THREE.Geometry();

	}

	Polygons.prototype.setVertices = function ( vertices ) {

		for ( var i = 0; i < this.inputs.length; i ++ ) {

			if ( this.inputs[ i ].source === vertices.id ) {

				this.inputs[ i ].source = vertices.input[ 'POSITION' ].source;

			}

		}

	};

	Polygons.prototype.parse = function ( element ) {

		this.material = element.getAttribute( 'material' );
		this.count = _attr_as_int( element, 'count', 0 );

		for ( var i = 0; i < element.childNodes.length; i ++ ) {

			var child = element.childNodes[ i ];

			switch ( child.nodeName ) {

				case 'input':

					this.inputs.push( ( new Input() ).parse( element.childNodes[ i ] ) );
					break;

				case 'vcount':

					this.vcount = _ints( child.textContent );
					break;

				case 'p':

					this.p.push( _ints( child.textContent ) );
					break;

				case 'ph':

					console.warn( 'polygon holes not yet supported!' );
					break;

				default:
					break;

			}

		}

		return this;

	};

	function Polylist () {

		Polygons.call( this );

		this.vcount = [];

	}

	Polylist.prototype = Object.create( Polygons.prototype );
	Polylist.prototype.constructor = Polylist;

	function LineStrips() {

		Polygons.call( this );

		this.vcount = 1;

	}

	LineStrips.prototype = Object.create( Polygons.prototype );
	LineStrips.prototype.constructor = LineStrips;

	function Triangles () {

		Polygons.call( this );

		this.vcount = 3;

	}

	Triangles.prototype = Object.create( Polygons.prototype );
	Triangles.prototype.constructor = Triangles;

	function Accessor() {

		this.source = "";
		this.count = 0;
		this.stride = 0;
		this.params = [];

	}

	Accessor.prototype.parse = function ( element ) {

		this.params = [];
		this.source = element.getAttribute( 'source' );
		this.count = _attr_as_int( element, 'count', 0 );
		this.stride = _attr_as_int( element, 'stride', 0 );

		for ( var i = 0; i < element.childNodes.length; i ++ ) {

			var child = element.childNodes[ i ];

			if ( child.nodeName === 'param' ) {

				var param = {};
				param[ 'name' ] = child.getAttribute( 'name' );
				param[ 'type' ] = child.getAttribute( 'type' );
				this.params.push( param );

			}

		}

		return this;

	};

	function Vertices() {

		this.input = {};

	}

	Vertices.prototype.parse = function ( element ) {

		this.id = element.getAttribute('id');

		for ( var i = 0; i < element.childNodes.length; i ++ ) {

			if ( element.childNodes[i].nodeName === 'input' ) {

				var input = ( new Input() ).parse( element.childNodes[ i ] );
				this.input[ input.semantic ] = input;

			}

		}

		return this;

	};

	function Input () {

		this.semantic = "";
		this.offset = 0;
		this.source = "";
		this.set = 0;

	}

	Input.prototype.parse = function ( element ) {

		this.semantic = element.getAttribute('semantic');
		this.source = element.getAttribute('source').replace(/^#/, '');
		this.set = _attr_as_int(element, 'set', -1);
		this.offset = _attr_as_int(element, 'offset', 0);

		if ( this.semantic === 'TEXCOORD' && this.set < 0 ) {

			this.set = 0;

		}

		return this;

	};

	function Source ( id ) {

		this.id = id;
		this.type = null;

	}

	Source.prototype.parse = function ( element ) {

		this.id = element.getAttribute( 'id' );

		for ( var i = 0; i < element.childNodes.length; i ++ ) {

			var child = element.childNodes[i];

			switch ( child.nodeName ) {

				case 'bool_array':

					this.data = _bools( child.textContent );
					this.type = child.nodeName;
					break;

				case 'float_array':

					this.data = _floats( child.textContent );
					this.type = child.nodeName;
					break;

				case 'int_array':

					this.data = _ints( child.textContent );
					this.type = child.nodeName;
					break;

				case 'IDREF_array':
				case 'Name_array':

					this.data = _strings( child.textContent );
					this.type = child.nodeName;
					break;

				case 'technique_common':

					for ( var j = 0; j < child.childNodes.length; j ++ ) {

						if ( child.childNodes[ j ].nodeName === 'accessor' ) {

							this.accessor = ( new Accessor() ).parse( child.childNodes[ j ] );
							break;

						}
					}
					break;

				default:
					// console.log(child.nodeName);
					break;

			}

		}

		return this;

	};

	Source.prototype.read = function () {

		var result = [];

		//for (var i = 0; i < this.accessor.params.length; i++) {

		var param = this.accessor.params[ 0 ];

			//console.log(param.name + " " + param.type);

		switch ( param.type ) {

			case 'IDREF':
			case 'Name': case 'name':
			case 'float':

				return this.data;

			case 'float4x4':

				for ( var j = 0; j < this.data.length; j += 16 ) {

					var s = this.data.slice( j, j + 16 );
					var m = getConvertedMat4( s );
					result.push( m );
				}

				break;

			default:

				console.log( 'ColladaLoader: Source: Read dont know how to read ' + param.type + '.' );
				break;

		}

		//}

		return result;

	};

	function Material () {

		this.id = "";
		this.name = "";
		this.instance_effect = null;

	}

	Material.prototype.parse = function ( element ) {

		this.id = element.getAttribute( 'id' );
		this.name = element.getAttribute( 'name' );

		for ( var i = 0; i < element.childNodes.length; i ++ ) {

			if ( element.childNodes[ i ].nodeName === 'instance_effect' ) {

				this.instance_effect = ( new InstanceEffect() ).parse( element.childNodes[ i ] );
				break;

			}

		}

		return this;

	};

	function ColorOrTexture () {

		this.color = new THREE.Color();
		this.color.setRGB( Math.random(), Math.random(), Math.random() );
		this.color.a = 1.0;

		this.texture = null;
		this.texcoord = null;
		this.texOpts = null;

	}

	ColorOrTexture.prototype.isColor = function () {

		return ( this.texture === null );

	};

	ColorOrTexture.prototype.isTexture = function () {

		return ( this.texture != null );

	};

	ColorOrTexture.prototype.parse = function ( element ) {

		if (element.nodeName === 'transparent') {

			this.opaque = element.getAttribute('opaque');

		}

		for ( var i = 0; i < element.childNodes.length; i ++ ) {

			var child = element.childNodes[ i ];
			if ( child.nodeType != 1 ) continue;

			switch ( child.nodeName ) {

				case 'color':

					var rgba = _floats( child.textContent );
					this.color = new THREE.Color();
					this.color.setRGB( rgba[0], rgba[1], rgba[2] );
					this.color.a = rgba[3];
					break;

				case 'texture':

					this.texture = child.getAttribute('texture');
					this.texcoord = child.getAttribute('texcoord');
					// Defaults from:
					// https://collada.org/mediawiki/index.php/Maya_texture_placement_MAYA_extension
					this.texOpts = {
						offsetU: 0,
						offsetV: 0,
						repeatU: 1,
						repeatV: 1,
						wrapU: 1,
						wrapV: 1
					};
					this.parseTexture( child );
					break;

				default:
					break;

			}

		}

		return this;

	};

	ColorOrTexture.prototype.parseTexture = function ( element ) {

		if ( ! element.childNodes ) return this;

		// This should be supported by Maya, 3dsMax, and MotionBuilder

		if ( element.childNodes[1] && element.childNodes[1].nodeName === 'extra' ) {

			element = element.childNodes[1];

			if ( element.childNodes[1] && element.childNodes[1].nodeName === 'technique' ) {

				element = element.childNodes[1];

			}

		}

		for ( var i = 0; i < element.childNodes.length; i ++ ) {

			var child = element.childNodes[ i ];

			switch ( child.nodeName ) {

				case 'offsetU':
				case 'offsetV':
				case 'repeatU':
				case 'repeatV':

					this.texOpts[ child.nodeName ] = parseFloat( child.textContent );

					break;

				case 'wrapU':
				case 'wrapV':

					// some dae have a value of true which becomes NaN via parseInt

					if ( child.textContent.toUpperCase() === 'TRUE' ) {

						this.texOpts[ child.nodeName ] = 1;

					} else {

						this.texOpts[ child.nodeName ] = parseInt( child.textContent );

					}
					break;

				default:

					this.texOpts[ child.nodeName ] = child.textContent;

					break;

			}

		}

		return this;

	};

	function Shader ( type, effect ) {

		this.type = type;
		this.effect = effect;
		this.material = null;

	}

	Shader.prototype.parse = function ( element ) {

		for ( var i = 0; i < element.childNodes.length; i ++ ) {

			var child = element.childNodes[ i ];
			if ( child.nodeType != 1 ) continue;

			switch ( child.nodeName ) {

				case 'emission':
				case 'diffuse':
				case 'specular':
				case 'transparent':

					this[ child.nodeName ] = ( new ColorOrTexture() ).parse( child );
					break;

				case 'bump':

					// If 'bumptype' is 'heightfield', create a 'bump' property
					// Else if 'bumptype' is 'normalmap', create a 'normal' property
					// (Default to 'bump')
					var bumpType = child.getAttribute( 'bumptype' );
					if ( bumpType ) {
						if ( bumpType.toLowerCase() === "heightfield" ) {
							this[ 'bump' ] = ( new ColorOrTexture() ).parse( child );
						} else if ( bumpType.toLowerCase() === "normalmap" ) {
							this[ 'normal' ] = ( new ColorOrTexture() ).parse( child );
						} else {
							console.error( "Shader.prototype.parse: Invalid value for attribute 'bumptype' (" + bumpType + ") - valid bumptypes are 'HEIGHTFIELD' and 'NORMALMAP' - defaulting to 'HEIGHTFIELD'" );
							this[ 'bump' ] = ( new ColorOrTexture() ).parse( child );
						}
					} else {
						console.warn( "Shader.prototype.parse: Attribute 'bumptype' missing from bump node - defaulting to 'HEIGHTFIELD'" );
						this[ 'bump' ] = ( new ColorOrTexture() ).parse( child );
					}

					break;

				case 'shininess':
				case 'reflectivity':
				case 'index_of_refraction':
				case 'transparency':

					var f = child.querySelectorAll('float');

					if ( f.length > 0 )
						this[ child.nodeName ] = parseFloat( f[ 0 ].textContent );

					break;

				default:
					break;

			}

		}

		this.create();
		return this;

	};

	Shader.prototype.create = function() {

		var props = {};

		var transparent = false;

		if (this['transparency'] !== undefined && this['transparent'] !== undefined) {
			// convert transparent color RBG to average value
			var transparentColor = this['transparent'];
			var transparencyLevel = (this.transparent.color.r + this.transparent.color.g + this.transparent.color.b) / 3 * this.transparency;

			if (transparencyLevel > 0) {
				transparent = true;
				props[ 'transparent' ] = true;
				props[ 'opacity' ] = 1 - transparencyLevel;

			}

		}

		var keys = {
			'diffuse':'map',
			'ambient':'lightMap',
			'specular':'specularMap',
			'emission':'emissionMap',
			'bump':'bumpMap',
			'normal':'normalMap'
			};

		for ( var prop in this ) {

			switch ( prop ) {

				case 'ambient':
				case 'emission':
				case 'diffuse':
				case 'specular':
				case 'bump':
				case 'normal':

					var cot = this[ prop ];

					if ( cot instanceof ColorOrTexture ) {

						if ( cot.isTexture() ) {

							var samplerId = cot.texture;
							var surfaceId = this.effect.sampler[samplerId];

							if ( surfaceId !== undefined && surfaceId.source !== undefined ) {

								var surface = this.effect.surface[surfaceId.source];

								if ( surface !== undefined ) {

									var image = images[ surface.init_from ];

									if ( image ) {

										var url = baseUrl + image.init_from;

										var texture;
										var loader = THREE.Loader.Handlers.get( url );

										if ( loader !== null ) {

											texture = loader.load( url );

										} else {

											texture = new THREE.Texture();

											loadTextureImage( texture, url );

										}

										texture.wrapS = cot.texOpts.wrapU ? THREE.RepeatWrapping : THREE.ClampToEdgeWrapping;
										texture.wrapT = cot.texOpts.wrapV ? THREE.RepeatWrapping : THREE.ClampToEdgeWrapping;
										texture.offset.x = cot.texOpts.offsetU;
										texture.offset.y = cot.texOpts.offsetV;
										texture.repeat.x = cot.texOpts.repeatU;
										texture.repeat.y = cot.texOpts.repeatV;
										props[keys[prop]] = texture;

										// Texture with baked lighting?
										if (prop === 'emission') props['emissive'] = 0xffffff;

									}

								}

							}

						} else if ( prop === 'diffuse' || !transparent ) {

							if ( prop === 'emission' ) {

								props[ 'emissive' ] = cot.color.getHex();

							} else {

								props[ prop ] = cot.color.getHex();

							}

						}

					}

					break;

				case 'shininess':

					props[ prop ] = this[ prop ];
					break;

				case 'reflectivity':

					props[ prop ] = this[ prop ];
					if ( props[ prop ] > 0.0 ) props['envMap'] = options.defaultEnvMap;
					props['combine'] = THREE.MixOperation;	//mix regular shading with reflective component
					break;

				case 'index_of_refraction':

					props[ 'refractionRatio' ] = this[ prop ]; //TODO: "index_of_refraction" becomes "refractionRatio" in shader, but I'm not sure if the two are actually comparable
					if ( this[ prop ] !== 1.0 ) props['envMap'] = options.defaultEnvMap;
					break;

				case 'transparency':
					// gets figured out up top
					break;

				default:
					break;

			}

		}

		props[ 'shading' ] = preferredShading;
		props[ 'side' ] = this.effect.doubleSided ? THREE.DoubleSide : THREE.FrontSide;

		if ( props.diffuse !== undefined ) {

			props.color = props.diffuse;
			delete props.diffuse;

		}

		switch ( this.type ) {

			case 'constant':

				if (props.emissive != undefined) props.color = props.emissive;
				this.material = new THREE.MeshBasicMaterial( props );
				break;

			case 'phong':
			case 'blinn':

				this.material = new THREE.MeshPhongMaterial( props );
				break;

			case 'lambert':
			default:

				this.material = new THREE.MeshLambertMaterial( props );
				break;

		}

		return this.material;

	};

	function Surface ( effect ) {

		this.effect = effect;
		this.init_from = null;
		this.format = null;

	}

	Surface.prototype.parse = function ( element ) {

		for ( var i = 0; i < element.childNodes.length; i ++ ) {

			var child = element.childNodes[ i ];
			if ( child.nodeType != 1 ) continue;

			switch ( child.nodeName ) {

				case 'init_from':

					this.init_from = child.textContent;
					break;

				case 'format':

					this.format = child.textContent;
					break;

				default:

					console.log( "unhandled Surface prop: " + child.nodeName );
					break;

			}

		}

		return this;

	};

	function Sampler2D ( effect ) {

		this.effect = effect;
		this.source = null;
		this.wrap_s = null;
		this.wrap_t = null;
		this.minfilter = null;
		this.magfilter = null;
		this.mipfilter = null;

	}

	Sampler2D.prototype.parse = function ( element ) {

		for ( var i = 0; i < element.childNodes.length; i ++ ) {

			var child = element.childNodes[ i ];
			if ( child.nodeType != 1 ) continue;

			switch ( child.nodeName ) {

				case 'source':

					this.source = child.textContent;
					break;

				case 'minfilter':

					this.minfilter = child.textContent;
					break;

				case 'magfilter':

					this.magfilter = child.textContent;
					break;

				case 'mipfilter':

					this.mipfilter = child.textContent;
					break;

				case 'wrap_s':

					this.wrap_s = child.textContent;
					break;

				case 'wrap_t':

					this.wrap_t = child.textContent;
					break;

				default:

					console.log( "unhandled Sampler2D prop: " + child.nodeName );
					break;

			}

		}

		return this;

	};

	function Effect () {

		this.id = "";
		this.name = "";
		this.shader = null;
		this.surface = {};
		this.sampler = {};

	}

	Effect.prototype.create = function () {

		if ( this.shader === null ) {

			return null;

		}

	};

	Effect.prototype.parse = function ( element ) {

		this.id = element.getAttribute( 'id' );
		this.name = element.getAttribute( 'name' );

		extractDoubleSided( this, element );

		this.shader = null;

		for ( var i = 0; i < element.childNodes.length; i ++ ) {

			var child = element.childNodes[ i ];
			if ( child.nodeType != 1 ) continue;

			switch ( child.nodeName ) {

				case 'profile_COMMON':

					this.parseTechnique( this.parseProfileCOMMON( child ) );
					break;

				default:
					break;

			}

		}

		return this;

	};

	Effect.prototype.parseNewparam = function ( element ) {

		var sid = element.getAttribute( 'sid' );

		for ( var i = 0; i < element.childNodes.length; i ++ ) {

			var child = element.childNodes[ i ];
			if ( child.nodeType != 1 ) continue;

			switch ( child.nodeName ) {

				case 'surface':

					this.surface[sid] = ( new Surface( this ) ).parse( child );
					break;

				case 'sampler2D':

					this.sampler[sid] = ( new Sampler2D( this ) ).parse( child );
					break;

				case 'extra':

					break;

				default:

					console.log( child.nodeName );
					break;

			}

		}

	};

	Effect.prototype.parseProfileCOMMON = function ( element ) {

		var technique;

		for ( var i = 0; i < element.childNodes.length; i ++ ) {

			var child = element.childNodes[ i ];

			if ( child.nodeType != 1 ) continue;

			switch ( child.nodeName ) {

				case 'profile_COMMON':

					this.parseProfileCOMMON( child );
					break;

				case 'technique':

					technique = child;
					break;

				case 'newparam':

					this.parseNewparam( child );
					break;

				case 'image':

					var _image = ( new _Image() ).parse( child );
					images[ _image.id ] = _image;
					break;

				case 'extra':
					break;

				default:

					console.log( child.nodeName );
					break;

			}

		}

		return technique;

	};

	Effect.prototype.parseTechnique = function ( element ) {

		for ( var i = 0; i < element.childNodes.length; i ++ ) {

			var child = element.childNodes[i];
			if ( child.nodeType != 1 ) continue;

			switch ( child.nodeName ) {

				case 'constant':
				case 'lambert':
				case 'blinn':
				case 'phong':

					this.shader = ( new Shader( child.nodeName, this ) ).parse( child );
					break;
				case 'extra':
					this.parseExtra(child);
					break;
				default:
					break;

			}

		}

	};

	Effect.prototype.parseExtra = function ( element ) {

		for ( var i = 0; i < element.childNodes.length; i ++ ) {

			var child = element.childNodes[i];
			if ( child.nodeType != 1 ) continue;

			switch ( child.nodeName ) {

				case 'technique':
					this.parseExtraTechnique( child );
					break;
				default:
					break;

			}

		}

	};

	Effect.prototype.parseExtraTechnique = function ( element ) {

		for ( var i = 0; i < element.childNodes.length; i ++ ) {

			var child = element.childNodes[i];
			if ( child.nodeType != 1 ) continue;

			switch ( child.nodeName ) {

				case 'bump':
					this.shader.parse( element );
					break;
				default:
					break;

			}

		}

	};

	function InstanceEffect () {

		this.url = "";

	}

	InstanceEffect.prototype.parse = function ( element ) {

		this.url = element.getAttribute( 'url' ).replace( /^#/, '' );
		return this;

	};

	function Animation() {

		this.id = "";
		this.name = "";
		this.source = {};
		this.sampler = [];
		this.channel = [];

	}

	Animation.prototype.parse = function ( element ) {

		this.id = element.getAttribute( 'id' );
		this.name = element.getAttribute( 'name' );
		this.source = {};

		for ( var i = 0; i < element.childNodes.length; i ++ ) {

			var child = element.childNodes[ i ];

			if ( child.nodeType != 1 ) continue;

			switch ( child.nodeName ) {

				case 'animation':

					var anim = ( new Animation() ).parse( child );

					for ( var src in anim.source ) {

						this.source[ src ] = anim.source[ src ];

					}

					for ( var j = 0; j < anim.channel.length; j ++ ) {

						this.channel.push( anim.channel[ j ] );
						this.sampler.push( anim.sampler[ j ] );

					}

					break;

				case 'source':

					var src = ( new Source() ).parse( child );
					this.source[ src.id ] = src;
					break;

				case 'sampler':

					this.sampler.push( ( new Sampler( this ) ).parse( child ) );
					break;

				case 'channel':

					this.channel.push( ( new Channel( this ) ).parse( child ) );
					break;

				default:
					break;

			}

		}

		return this;

	};

	function Channel( animation ) {

		this.animation = animation;
		this.source = "";
		this.target = "";
		this.fullSid = null;
		this.sid = null;
		this.dotSyntax = null;
		this.arrSyntax = null;
		this.arrIndices = null;
		this.member = null;

	}

	Channel.prototype.parse = function ( element ) {

		this.source = element.getAttribute( 'source' ).replace( /^#/, '' );
		this.target = element.getAttribute( 'target' );

		var parts = this.target.split( '/' );

		var id = parts.shift();
		var sid = parts.shift();

		var dotSyntax = ( sid.indexOf(".") >= 0 );
		var arrSyntax = ( sid.indexOf("(") >= 0 );

		if ( dotSyntax ) {

			parts = sid.split(".");
			this.sid = parts.shift();
			this.member = parts.shift();

		} else if ( arrSyntax ) {

			var arrIndices = sid.split("(");
			this.sid = arrIndices.shift();

			for (var j = 0; j < arrIndices.length; j ++ ) {

				arrIndices[j] = parseInt( arrIndices[j].replace(/\)/, '') );

			}

			this.arrIndices = arrIndices;

		} else {

			this.sid = sid;

		}

		this.fullSid = sid;
		this.dotSyntax = dotSyntax;
		this.arrSyntax = arrSyntax;

		return this;

	};

	function Sampler ( animation ) {

		this.id = "";
		this.animation = animation;
		this.inputs = [];
		this.input = null;
		this.output = null;
		this.strideOut = null;
		this.interpolation = null;
		this.startTime = null;
		this.endTime = null;
		this.duration = 0;

	}

	Sampler.prototype.parse = function ( element ) {

		this.id = element.getAttribute( 'id' );
		this.inputs = [];

		for ( var i = 0; i < element.childNodes.length; i ++ ) {

			var child = element.childNodes[ i ];
			if ( child.nodeType != 1 ) continue;

			switch ( child.nodeName ) {

				case 'input':

					this.inputs.push( (new Input()).parse( child ) );
					break;

				default:
					break;

			}

		}

		return this;

	};

	Sampler.prototype.create = function () {

		for ( var i = 0; i < this.inputs.length; i ++ ) {

			var input = this.inputs[ i ];
			var source = this.animation.source[ input.source ];

			switch ( input.semantic ) {

				case 'INPUT':

					this.input = source.read();
					break;

				case 'OUTPUT':

					this.output = source.read();
					this.strideOut = source.accessor.stride;
					break;

				case 'INTERPOLATION':

					this.interpolation = source.read();
					break;

				case 'IN_TANGENT':

					break;

				case 'OUT_TANGENT':

					break;

				default:

					console.log(input.semantic);
					break;

			}

		}

		this.startTime = 0;
		this.endTime = 0;
		this.duration = 0;

		if ( this.input.length ) {

			this.startTime = 100000000;
			this.endTime = -100000000;

			for ( var i = 0; i < this.input.length; i ++ ) {

				this.startTime = Math.min( this.startTime, this.input[ i ] );
				this.endTime = Math.max( this.endTime, this.input[ i ] );

			}

			this.duration = this.endTime - this.startTime;

		}

	};

	Sampler.prototype.getData = function ( type, ndx, member ) {

		var data;

		if ( type === 'matrix' && this.strideOut === 16 ) {

			data = this.output[ ndx ];

		} else if ( this.strideOut > 1 ) {

			data = [];
			ndx *= this.strideOut;

			for ( var i = 0; i < this.strideOut; ++ i ) {

				data[ i ] = this.output[ ndx + i ];

			}

			if ( this.strideOut === 3 ) {

				switch ( type ) {

					case 'rotate':
					case 'translate':

						fixCoords( data, -1 );
						break;

					case 'scale':

						fixCoords( data, 1 );
						break;

				}

			} else if ( this.strideOut === 4 && type === 'matrix' ) {

				fixCoords( data, -1 );

			}

		} else {

			data = this.output[ ndx ];

			if ( member && type === 'translate' ) {
				data = getConvertedTranslation( member, data );
			}

		}

		return data;

	};

	function Key ( time ) {

		this.targets = [];
		this.time = time;

	}

	Key.prototype.addTarget = function ( fullSid, transform, member, data ) {

		this.targets.push( {
			sid: fullSid,
			member: member,
			transform: transform,
			data: data
		} );

	};

	Key.prototype.apply = function ( opt_sid ) {

		for ( var i = 0; i < this.targets.length; ++ i ) {

			var target = this.targets[ i ];

			if ( !opt_sid || target.sid === opt_sid ) {

				target.transform.update( target.data, target.member );

			}

		}

	};

	Key.prototype.getTarget = function ( fullSid ) {

		for ( var i = 0; i < this.targets.length; ++ i ) {

			if ( this.targets[ i ].sid === fullSid ) {

				return this.targets[ i ];

			}

		}

		return null;

	};

	Key.prototype.hasTarget = function ( fullSid ) {

		for ( var i = 0; i < this.targets.length; ++ i ) {

			if ( this.targets[ i ].sid === fullSid ) {

				return true;

			}

		}

		return false;

	};

	// TODO: Currently only doing linear interpolation. Should support full COLLADA spec.
	Key.prototype.interpolate = function ( nextKey, time ) {

		for ( var i = 0, l = this.targets.length; i < l; i ++ ) {

			var target = this.targets[ i ],
				nextTarget = nextKey.getTarget( target.sid ),
				data;

			if ( target.transform.type !== 'matrix' && nextTarget ) {

				var scale = ( time - this.time ) / ( nextKey.time - this.time ),
					nextData = nextTarget.data,
					prevData = target.data;

				if ( scale < 0 ) scale = 0;
				if ( scale > 1 ) scale = 1;

				if ( prevData.length ) {

					data = [];

					for ( var j = 0; j < prevData.length; ++ j ) {

						data[ j ] = prevData[ j ] + ( nextData[ j ] - prevData[ j ] ) * scale;

					}

				} else {

					data = prevData + ( nextData - prevData ) * scale;

				}

			} else {

				data = target.data;

			}

			target.transform.update( data, target.member );

		}

	};

	// Camera
	function Camera() {

		this.id = "";
		this.name = "";
		this.technique = "";

	}

	Camera.prototype.parse = function ( element ) {

		this.id = element.getAttribute( 'id' );
		this.name = element.getAttribute( 'name' );

		for ( var i = 0; i < element.childNodes.length; i ++ ) {

			var child = element.childNodes[ i ];
			if ( child.nodeType != 1 ) continue;

			switch ( child.nodeName ) {

				case 'optics':

					this.parseOptics( child );
					break;

				default:
					break;

			}

		}

		return this;

	};

	Camera.prototype.parseOptics = function ( element ) {

		for ( var i = 0; i < element.childNodes.length; i ++ ) {

			if ( element.childNodes[ i ].nodeName === 'technique_common' ) {

				var technique = element.childNodes[ i ];

				for ( var j = 0; j < technique.childNodes.length; j ++ ) {

					this.technique = technique.childNodes[ j ].nodeName;

					if ( this.technique === 'perspective' ) {

						var perspective = technique.childNodes[ j ];

						for ( var k = 0; k < perspective.childNodes.length; k ++ ) {

							var param = perspective.childNodes[ k ];

							switch ( param.nodeName ) {

								case 'yfov':
									this.yfov = param.textContent;
									break;
								case 'xfov':
									this.xfov = param.textContent;
									break;
								case 'znear':
									this.znear = param.textContent;
									break;
								case 'zfar':
									this.zfar = param.textContent;
									break;
								case 'aspect_ratio':
									this.aspect_ratio = param.textContent;
									break;

							}

						}

					} else if ( this.technique === 'orthographic' ) {

						var orthographic = technique.childNodes[ j ];

						for ( var k = 0; k < orthographic.childNodes.length; k ++ ) {

							var param = orthographic.childNodes[ k ];

							switch ( param.nodeName ) {

								case 'xmag':
									this.xmag = param.textContent;
									break;
								case 'ymag':
									this.ymag = param.textContent;
									break;
								case 'znear':
									this.znear = param.textContent;
									break;
								case 'zfar':
									this.zfar = param.textContent;
									break;
								case 'aspect_ratio':
									this.aspect_ratio = param.textContent;
									break;

							}

						}

					}

				}

			}

		}

		return this;

	};

	function InstanceCamera() {

		this.url = "";

	}

	InstanceCamera.prototype.parse = function ( element ) {

		this.url = element.getAttribute('url').replace(/^#/, '');

		return this;

	};

	// Light

	function Light() {

		this.id = "";
		this.name = "";
		this.technique = "";

	}

	Light.prototype.parse = function ( element ) {

		this.id = element.getAttribute( 'id' );
		this.name = element.getAttribute( 'name' );

		for ( var i = 0; i < element.childNodes.length; i ++ ) {

			var child = element.childNodes[ i ];
			if ( child.nodeType != 1 ) continue;

			switch ( child.nodeName ) {

				case 'technique_common':

					this.parseCommon( child );
					break;

				case 'technique':

					this.parseTechnique( child );
					break;

				default:
					break;

			}

		}

		return this;

	};

	Light.prototype.parseCommon = function ( element ) {

		for ( var i = 0; i < element.childNodes.length; i ++ ) {

			switch ( element.childNodes[ i ].nodeName ) {

				case 'directional':
				case 'point':
				case 'spot':
				case 'ambient':

					this.technique = element.childNodes[ i ].nodeName;

					var light = element.childNodes[ i ];

					for ( var j = 0; j < light.childNodes.length; j ++ ) {

						var child = light.childNodes[j];

						switch ( child.nodeName ) {

							case 'color':

								var rgba = _floats( child.textContent );
								this.color = new THREE.Color(0);
								this.color.setRGB( rgba[0], rgba[1], rgba[2] );
								this.color.a = rgba[3];
								break;

							case 'falloff_angle':

								this.falloff_angle = parseFloat( child.textContent );
								break;

							case 'quadratic_attenuation':
								var f = parseFloat( child.textContent );
								this.distance = f ? Math.sqrt( 1 / f ) : 0;
						}

					}

			}

		}

		return this;

	};

	Light.prototype.parseTechnique = function ( element ) {

		this.profile = element.getAttribute( 'profile' );

		for ( var i = 0; i < element.childNodes.length; i ++ ) {

			var child = element.childNodes[ i ];

			switch ( child.nodeName ) {

				case 'intensity':

					this.intensity = parseFloat(child.textContent);
					break;

			}

		}

		return this;

	};

	function InstanceLight() {

		this.url = "";

	}

	InstanceLight.prototype.parse = function ( element ) {

		this.url = element.getAttribute('url').replace(/^#/, '');

		return this;

	};

	function KinematicsModel( ) {

		this.id = '';
		this.name = '';
		this.joints = [];
		this.links = [];

	}

	KinematicsModel.prototype.parse = function( element ) {

		this.id = element.getAttribute('id');
		this.name = element.getAttribute('name');
		this.joints = [];
		this.links = [];

		for (var i = 0; i < element.childNodes.length; i ++ ) {

			var child = element.childNodes[ i ];
			if ( child.nodeType != 1 ) continue;

			switch ( child.nodeName ) {

				case 'technique_common':

					this.parseCommon(child);
					break;

				default:
					break;

			}

		}

		return this;

	};

	KinematicsModel.prototype.parseCommon = function( element ) {

		for (var i = 0; i < element.childNodes.length; i ++ ) {

			var child = element.childNodes[ i ];
			if ( child.nodeType != 1 ) continue;

			switch ( element.childNodes[ i ].nodeName ) {

				case 'joint':
					this.joints.push( (new Joint()).parse(child) );
					break;

				case 'link':
					this.links.push( (new Link()).parse(child) );
					break;

				default:
					break;

			}

		}

		return this;

	};

	function Joint( ) {

		this.sid = '';
		this.name = '';
		this.axis = new THREE.Vector3();
		this.limits = {
			min: 0,
			max: 0
		};
		this.type = '';
		this.static = false;
		this.zeroPosition = 0.0;
		this.middlePosition = 0.0;

	}

	Joint.prototype.parse = function( element ) {

		this.sid = element.getAttribute('sid');
		this.name = element.getAttribute('name');
		this.axis = new THREE.Vector3();
		this.limits = {
			min: 0,
			max: 0
		};
		this.type = '';
		this.static = false;
		this.zeroPosition = 0.0;
		this.middlePosition = 0.0;

		var axisElement = element.querySelector('axis');
		var _axis = _floats(axisElement.textContent);
		this.axis = getConvertedVec3(_axis, 0);

		var min = element.querySelector('limits min') ? parseFloat(element.querySelector('limits min').textContent) : -360;
		var max = element.querySelector('limits max') ? parseFloat(element.querySelector('limits max').textContent) : 360;

		this.limits = {
			min: min,
			max: max
		};

		var jointTypes = [ 'prismatic', 'revolute' ];
		for (var i = 0; i < jointTypes.length; i ++ ) {

			var type = jointTypes[ i ];

			var jointElement = element.querySelector(type);

			if ( jointElement ) {

				this.type = type;

			}

		}

		// if the min is equal to or somehow greater than the max, consider the joint static
		if ( this.limits.min >= this.limits.max ) {

			this.static = true;

		}

		this.middlePosition = (this.limits.min + this.limits.max) / 2.0;
		return this;

	};

	function Link( ) {

		this.sid = '';
		this.name = '';
		this.transforms = [];
		this.attachments = [];

	}

	Link.prototype.parse = function( element ) {

		this.sid = element.getAttribute('sid');
		this.name = element.getAttribute('name');
		this.transforms = [];
		this.attachments = [];

		for (var i = 0; i < element.childNodes.length; i ++ ) {

			var child = element.childNodes[ i ];
			if ( child.nodeType != 1 ) continue;

			switch ( child.nodeName ) {

				case 'attachment_full':
					this.attachments.push( (new Attachment()).parse(child) );
					break;

				case 'rotate':
				case 'translate':
				case 'matrix':

					this.transforms.push( (new Transform()).parse(child) );
					break;

				default:

					break;

			}

		}

		return this;

	};

	function Attachment( ) {

		this.joint = '';
		this.transforms = [];
		this.links = [];

	}

	Attachment.prototype.parse = function( element ) {

		this.joint = element.getAttribute('joint').split('/').pop();
		this.links = [];

		for (var i = 0; i < element.childNodes.length; i ++ ) {

			var child = element.childNodes[ i ];
			if ( child.nodeType != 1 ) continue;

			switch ( child.nodeName ) {

				case 'link':
					this.links.push( (new Link()).parse(child) );
					break;

				case 'rotate':
				case 'translate':
				case 'matrix':

					this.transforms.push( (new Transform()).parse(child) );
					break;

				default:

					break;

			}

		}

		return this;

	};

	function _source( element ) {

		var id = element.getAttribute( 'id' );

		if ( sources[ id ] != undefined ) {

			return sources[ id ];

		}

		sources[ id ] = ( new Source(id )).parse( element );
		return sources[ id ];

	}

	function _nsResolver( nsPrefix ) {

		if ( nsPrefix === "dae" ) {

			return "http://www.collada.org/2005/11/COLLADASchema";

		}

		return null;

	}

	function _bools( str ) {

		var raw = _strings( str );
		var data = [];

		for ( var i = 0, l = raw.length; i < l; i ++ ) {

			data.push( (raw[i] === 'true' || raw[i] === '1') ? true : false );

		}

		return data;

	}

	function _floats( str ) {

		var raw = _strings(str);
		var data = [];

		for ( var i = 0, l = raw.length; i < l; i ++ ) {

			data.push( parseFloat( raw[ i ] ) );

		}

		return data;

	}

	function _ints( str ) {

		var raw = _strings( str );
		var data = [];

		for ( var i = 0, l = raw.length; i < l; i ++ ) {

			data.push( parseInt( raw[ i ], 10 ) );

		}

		return data;

	}

	function _strings( str ) {

		return ( str.length > 0 ) ? _trimString( str ).split( /\s+/ ) : [];

	}

	function _trimString( str ) {

		return str.replace( /^\s+/, "" ).replace( /\s+$/, "" );

	}

	function _attr_as_float( element, name, defaultValue ) {

		if ( element.hasAttribute( name ) ) {

			return parseFloat( element.getAttribute( name ) );

		} else {

			return defaultValue;

		}

	}

	function _attr_as_int( element, name, defaultValue ) {

		if ( element.hasAttribute( name ) ) {

			return parseInt( element.getAttribute( name ), 10) ;

		} else {

			return defaultValue;

		}

	}

	function _attr_as_string( element, name, defaultValue ) {

		if ( element.hasAttribute( name ) ) {

			return element.getAttribute( name );

		} else {

			return defaultValue;

		}

	}

	function _format_float( f, num ) {

		if ( f === undefined ) {

			var s = '0.';

			while ( s.length < num + 2 ) {

				s += '0';

			}

			return s;

		}

		num = num || 2;

		var parts = f.toString().split( '.' );
		parts[ 1 ] = parts.length > 1 ? parts[ 1 ].substr( 0, num ) : "0";

		while ( parts[ 1 ].length < num ) {

			parts[ 1 ] += '0';

		}

		return parts.join( '.' );

	}

	function loadTextureImage ( texture, url ) {

		var loader = new THREE.ImageLoader();

		loader.load( url, function ( image ) {

			texture.image = image;
			texture.needsUpdate = true;

		} );

	}

	function extractDoubleSided( obj, element ) {

		obj.doubleSided = false;

		var node = element.querySelectorAll('extra double_sided')[0];

		if ( node ) {

			if ( node && parseInt( node.textContent, 10 ) === 1 ) {

				obj.doubleSided = true;

			}

		}

	}

	// Up axis conversion

	function setUpConversion() {

		if ( options.convertUpAxis !== true || colladaUp === options.upAxis ) {

			upConversion = null;

		} else {

			switch ( colladaUp ) {

				case 'X':

					upConversion = options.upAxis === 'Y' ? 'XtoY' : 'XtoZ';
					break;

				case 'Y':

					upConversion = options.upAxis === 'X' ? 'YtoX' : 'YtoZ';
					break;

				case 'Z':

					upConversion = options.upAxis === 'X' ? 'ZtoX' : 'ZtoY';
					break;

			}

		}

	}

	function fixCoords( data, sign ) {

		if ( options.convertUpAxis !== true || colladaUp === options.upAxis ) {

			return;

		}

		switch ( upConversion ) {

			case 'XtoY':

				var tmp = data[ 0 ];
				data[ 0 ] = sign * data[ 1 ];
				data[ 1 ] = tmp;
				break;

			case 'XtoZ':

				var tmp = data[ 2 ];
				data[ 2 ] = data[ 1 ];
				data[ 1 ] = data[ 0 ];
				data[ 0 ] = tmp;
				break;

			case 'YtoX':

				var tmp = data[ 0 ];
				data[ 0 ] = data[ 1 ];
				data[ 1 ] = sign * tmp;
				break;

			case 'YtoZ':

				var tmp = data[ 1 ];
				data[ 1 ] = sign * data[ 2 ];
				data[ 2 ] = tmp;
				break;

			case 'ZtoX':

				var tmp = data[ 0 ];
				data[ 0 ] = data[ 1 ];
				data[ 1 ] = data[ 2 ];
				data[ 2 ] = tmp;
				break;

			case 'ZtoY':

				var tmp = data[ 1 ];
				data[ 1 ] = data[ 2 ];
				data[ 2 ] = sign * tmp;
				break;

		}

	}

	function getConvertedTranslation( axis, data ) {

		if ( options.convertUpAxis !== true || colladaUp === options.upAxis ) {

			return data;

		}

		switch ( axis ) {
			case 'X':
				data = upConversion === 'XtoY' ? data * -1 : data;
				break;
			case 'Y':
				data = upConversion === 'YtoZ' || upConversion === 'YtoX' ? data * -1 : data;
				break;
			case 'Z':
				data = upConversion === 'ZtoY' ? data * -1 : data ;
				break;
			default:
				break;
		}

		return data;
	}

	function getConvertedVec3( data, offset ) {

		var arr = [ data[ offset ], data[ offset + 1 ], data[ offset + 2 ] ];
		fixCoords( arr, -1 );
		return new THREE.Vector3( arr[ 0 ], arr[ 1 ], arr[ 2 ] );

	}

	function getConvertedMat4( data ) {

		if ( options.convertUpAxis ) {

			// First fix rotation and scale

			// Columns first
			var arr = [ data[ 0 ], data[ 4 ], data[ 8 ] ];
			fixCoords( arr, -1 );
			data[ 0 ] = arr[ 0 ];
			data[ 4 ] = arr[ 1 ];
			data[ 8 ] = arr[ 2 ];
			arr = [ data[ 1 ], data[ 5 ], data[ 9 ] ];
			fixCoords( arr, -1 );
			data[ 1 ] = arr[ 0 ];
			data[ 5 ] = arr[ 1 ];
			data[ 9 ] = arr[ 2 ];
			arr = [ data[ 2 ], data[ 6 ], data[ 10 ] ];
			fixCoords( arr, -1 );
			data[ 2 ] = arr[ 0 ];
			data[ 6 ] = arr[ 1 ];
			data[ 10 ] = arr[ 2 ];
			// Rows second
			arr = [ data[ 0 ], data[ 1 ], data[ 2 ] ];
			fixCoords( arr, -1 );
			data[ 0 ] = arr[ 0 ];
			data[ 1 ] = arr[ 1 ];
			data[ 2 ] = arr[ 2 ];
			arr = [ data[ 4 ], data[ 5 ], data[ 6 ] ];
			fixCoords( arr, -1 );
			data[ 4 ] = arr[ 0 ];
			data[ 5 ] = arr[ 1 ];
			data[ 6 ] = arr[ 2 ];
			arr = [ data[ 8 ], data[ 9 ], data[ 10 ] ];
			fixCoords( arr, -1 );
			data[ 8 ] = arr[ 0 ];
			data[ 9 ] = arr[ 1 ];
			data[ 10 ] = arr[ 2 ];

			// Now fix translation
			arr = [ data[ 3 ], data[ 7 ], data[ 11 ] ];
			fixCoords( arr, -1 );
			data[ 3 ] = arr[ 0 ];
			data[ 7 ] = arr[ 1 ];
			data[ 11 ] = arr[ 2 ];

		}

		return new THREE.Matrix4().set(
			data[0], data[1], data[2], data[3],
			data[4], data[5], data[6], data[7],
			data[8], data[9], data[10], data[11],
			data[12], data[13], data[14], data[15]
			);

	}

	function getConvertedIndex( index ) {

		if ( index > -1 && index < 3 ) {

			var members = [ 'X', 'Y', 'Z' ],
				indices = { X: 0, Y: 1, Z: 2 };

			index = getConvertedMember( members[ index ] );
			index = indices[ index ];

		}

		return index;

	}

	function getConvertedMember( member ) {

		if ( options.convertUpAxis ) {

			switch ( member ) {

				case 'X':

					switch ( upConversion ) {

						case 'XtoY':
						case 'XtoZ':
						case 'YtoX':

							member = 'Y';
							break;

						case 'ZtoX':

							member = 'Z';
							break;

					}

					break;

				case 'Y':

					switch ( upConversion ) {

						case 'XtoY':
						case 'YtoX':
						case 'ZtoX':

							member = 'X';
							break;

						case 'XtoZ':
						case 'YtoZ':
						case 'ZtoY':

							member = 'Z';
							break;

					}

					break;

				case 'Z':

					switch ( upConversion ) {

						case 'XtoZ':

							member = 'X';
							break;

						case 'YtoZ':
						case 'ZtoX':
						case 'ZtoY':

							member = 'Y';
							break;

					}

					break;

			}

		}

		return member;

	}

	return {

		load: load,
		parse: parse,
		setPreferredShading: setPreferredShading,
		applySkin: applySkin,
		geometries : geometries,
		options: options

	};

};

// File:examples/js/loaders/KMZLoader.js

/**
 * @author mrdoob / http://mrdoob.com/
 */

THREE.KMZLoader = function ( manager ) {

	this.manager = ( manager !== undefined ) ? manager : THREE.DefaultLoadingManager;

};

THREE.KMZLoader.prototype = {

	constructor: THREE.KMZLoader,

	load: function ( url, onLoad, onProgress, onError ) {

		var scope = this;

		var loader = new THREE.XHRLoader( scope.manager );
		loader.setResponseType( 'arraybuffer' );
		loader.load( url, function ( text ) {

			onLoad( scope.parse( text ) );

		}, onProgress, onError );

	},

	parse: function ( data ) {

		var zip = new JSZip( data );

		// console.log( zip );

		for ( var name in zip.files ) {

			if ( name.toLowerCase().substr( - 4 ) === '.dae' ) {

				return new THREE.ColladaLoader().parse( zip.file( name ).asText() );

			}

		}

		console.error( 'KZMLoader: Couldn\'t find .dae file.' );

		return {
			scene: new THREE.Group()
		}

	}

};

// File:examples/js/loaders/MD2Loader.js

/**
 * @author mrdoob / http://mrdoob.com/
 */

THREE.MD2Loader = function ( manager ) {

	this.manager = ( manager !== undefined ) ? manager : THREE.DefaultLoadingManager;

};

THREE.MD2Loader.prototype = {

	constructor: THREE.MD2Loader,

	load: function ( url, onLoad, onProgress, onError ) {

		var scope = this;

		var loader = new THREE.XHRLoader( scope.manager );
		loader.setResponseType( 'arraybuffer' );
		loader.load( url, function ( buffer ) {

			onLoad( scope.parse( buffer ) );

		}, onProgress, onError );

	},

	parse: ( function () {

		var normals = [
			[ -0.525731,  0.000000,  0.850651 ], [ -0.442863,  0.238856,  0.864188 ],
			[ -0.295242,  0.000000,  0.955423 ], [ -0.309017,  0.500000,  0.809017 ],
			[ -0.162460,  0.262866,  0.951056 ], [  0.000000,  0.000000,  1.000000 ],
			[  0.000000,  0.850651,  0.525731 ], [ -0.147621,  0.716567,  0.681718 ],
			[  0.147621,  0.716567,  0.681718 ], [  0.000000,  0.525731,  0.850651 ],
			[  0.309017,  0.500000,  0.809017 ], [  0.525731,  0.000000,  0.850651 ],
			[  0.295242,  0.000000,  0.955423 ], [  0.442863,  0.238856,  0.864188 ],
			[  0.162460,  0.262866,  0.951056 ], [ -0.681718,  0.147621,  0.716567 ],
			[ -0.809017,  0.309017,  0.500000 ], [ -0.587785,  0.425325,  0.688191 ],
			[ -0.850651,  0.525731,  0.000000 ], [ -0.864188,  0.442863,  0.238856 ],
			[ -0.716567,  0.681718,  0.147621 ], [ -0.688191,  0.587785,  0.425325 ],
			[ -0.500000,  0.809017,  0.309017 ], [ -0.238856,  0.864188,  0.442863 ],
			[ -0.425325,  0.688191,  0.587785 ], [ -0.716567,  0.681718, -0.147621 ],
			[ -0.500000,  0.809017, -0.309017 ], [ -0.525731,  0.850651,  0.000000 ],
			[  0.000000,  0.850651, -0.525731 ], [ -0.238856,  0.864188, -0.442863 ],
			[  0.000000,  0.955423, -0.295242 ], [ -0.262866,  0.951056, -0.162460 ],
			[  0.000000,  1.000000,  0.000000 ], [  0.000000,  0.955423,  0.295242 ],
			[ -0.262866,  0.951056,  0.162460 ], [  0.238856,  0.864188,  0.442863 ],
			[  0.262866,  0.951056,  0.162460 ], [  0.500000,  0.809017,  0.309017 ],
			[  0.238856,  0.864188, -0.442863 ], [  0.262866,  0.951056, -0.162460 ],
			[  0.500000,  0.809017, -0.309017 ], [  0.850651,  0.525731,  0.000000 ],
			[  0.716567,  0.681718,  0.147621 ], [  0.716567,  0.681718, -0.147621 ],
			[  0.525731,  0.850651,  0.000000 ], [  0.425325,  0.688191,  0.587785 ],
			[  0.864188,  0.442863,  0.238856 ], [  0.688191,  0.587785,  0.425325 ],
			[  0.809017,  0.309017,  0.500000 ], [  0.681718,  0.147621,  0.716567 ],
			[  0.587785,  0.425325,  0.688191 ], [  0.955423,  0.295242,  0.000000 ],
			[  1.000000,  0.000000,  0.000000 ], [  0.951056,  0.162460,  0.262866 ],
			[  0.850651, -0.525731,  0.000000 ], [  0.955423, -0.295242,  0.000000 ],
			[  0.864188, -0.442863,  0.238856 ], [  0.951056, -0.162460,  0.262866 ],
			[  0.809017, -0.309017,  0.500000 ], [  0.681718, -0.147621,  0.716567 ],
			[  0.850651,  0.000000,  0.525731 ], [  0.864188,  0.442863, -0.238856 ],
			[  0.809017,  0.309017, -0.500000 ], [  0.951056,  0.162460, -0.262866 ],
			[  0.525731,  0.000000, -0.850651 ], [  0.681718,  0.147621, -0.716567 ],
			[  0.681718, -0.147621, -0.716567 ], [  0.850651,  0.000000, -0.525731 ],
			[  0.809017, -0.309017, -0.500000 ], [  0.864188, -0.442863, -0.238856 ],
			[  0.951056, -0.162460, -0.262866 ], [  0.147621,  0.716567, -0.681718 ],
			[  0.309017,  0.500000, -0.809017 ], [  0.425325,  0.688191, -0.587785 ],
			[  0.442863,  0.238856, -0.864188 ], [  0.587785,  0.425325, -0.688191 ],
			[  0.688191,  0.587785, -0.425325 ], [ -0.147621,  0.716567, -0.681718 ],
			[ -0.309017,  0.500000, -0.809017 ], [  0.000000,  0.525731, -0.850651 ],
			[ -0.525731,  0.000000, -0.850651 ], [ -0.442863,  0.238856, -0.864188 ],
			[ -0.295242,  0.000000, -0.955423 ], [ -0.162460,  0.262866, -0.951056 ],
			[  0.000000,  0.000000, -1.000000 ], [  0.295242,  0.000000, -0.955423 ],
			[  0.162460,  0.262866, -0.951056 ], [ -0.442863, -0.238856, -0.864188 ],
			[ -0.309017, -0.500000, -0.809017 ], [ -0.162460, -0.262866, -0.951056 ],
			[  0.000000, -0.850651, -0.525731 ], [ -0.147621, -0.716567, -0.681718 ],
			[  0.147621, -0.716567, -0.681718 ], [  0.000000, -0.525731, -0.850651 ],
			[  0.309017, -0.500000, -0.809017 ], [  0.442863, -0.238856, -0.864188 ],
			[  0.162460, -0.262866, -0.951056 ], [  0.238856, -0.864188, -0.442863 ],
			[  0.500000, -0.809017, -0.309017 ], [  0.425325, -0.688191, -0.587785 ],
			[  0.716567, -0.681718, -0.147621 ], [  0.688191, -0.587785, -0.425325 ],
			[  0.587785, -0.425325, -0.688191 ], [  0.000000, -0.955423, -0.295242 ],
			[  0.000000, -1.000000,  0.000000 ], [  0.262866, -0.951056, -0.162460 ],
			[  0.000000, -0.850651,  0.525731 ], [  0.000000, -0.955423,  0.295242 ],
			[  0.238856, -0.864188,  0.442863 ], [  0.262866, -0.951056,  0.162460 ],
			[  0.500000, -0.809017,  0.309017 ], [  0.716567, -0.681718,  0.147621 ],
			[  0.525731, -0.850651,  0.000000 ], [ -0.238856, -0.864188, -0.442863 ],
			[ -0.500000, -0.809017, -0.309017 ], [ -0.262866, -0.951056, -0.162460 ],
			[ -0.850651, -0.525731,  0.000000 ], [ -0.716567, -0.681718, -0.147621 ],
			[ -0.716567, -0.681718,  0.147621 ], [ -0.525731, -0.850651,  0.000000 ],
			[ -0.500000, -0.809017,  0.309017 ], [ -0.238856, -0.864188,  0.442863 ],
			[ -0.262866, -0.951056,  0.162460 ], [ -0.864188, -0.442863,  0.238856 ],
			[ -0.809017, -0.309017,  0.500000 ], [ -0.688191, -0.587785,  0.425325 ],
			[ -0.681718, -0.147621,  0.716567 ], [ -0.442863, -0.238856,  0.864188 ],
			[ -0.587785, -0.425325,  0.688191 ], [ -0.309017, -0.500000,  0.809017 ],
			[ -0.147621, -0.716567,  0.681718 ], [ -0.425325, -0.688191,  0.587785 ],
			[ -0.162460, -0.262866,  0.951056 ], [  0.442863, -0.238856,  0.864188 ],
			[  0.162460, -0.262866,  0.951056 ], [  0.309017, -0.500000,  0.809017 ],
			[  0.147621, -0.716567,  0.681718 ], [  0.000000, -0.525731,  0.850651 ],
			[  0.425325, -0.688191,  0.587785 ], [  0.587785, -0.425325,  0.688191 ],
			[  0.688191, -0.587785,  0.425325 ], [ -0.955423,  0.295242,  0.000000 ],
			[ -0.951056,  0.162460,  0.262866 ], [ -1.000000,  0.000000,  0.000000 ],
			[ -0.850651,  0.000000,  0.525731 ], [ -0.955423, -0.295242,  0.000000 ],
			[ -0.951056, -0.162460,  0.262866 ], [ -0.864188,  0.442863, -0.238856 ],
			[ -0.951056,  0.162460, -0.262866 ], [ -0.809017,  0.309017, -0.500000 ],
			[ -0.864188, -0.442863, -0.238856 ], [ -0.951056, -0.162460, -0.262866 ],
			[ -0.809017, -0.309017, -0.500000 ], [ -0.681718,  0.147621, -0.716567 ],
			[ -0.681718, -0.147621, -0.716567 ], [ -0.850651,  0.000000, -0.525731 ],
			[ -0.688191,  0.587785, -0.425325 ], [ -0.587785,  0.425325, -0.688191 ],
			[ -0.425325,  0.688191, -0.587785 ], [ -0.425325, -0.688191, -0.587785 ],
			[ -0.587785, -0.425325, -0.688191 ], [ -0.688191, -0.587785, -0.425325 ]
		];

		return function ( buffer ) {

			console.time( 'MD2Loader' );

			var data = new DataView( buffer );

			// http://tfc.duke.free.fr/coding/md2-specs-en.html

			var header = {};
			var headerNames = [
				'ident', 'version',
				'skinwidth', 'skinheight',
				'framesize',
				'num_skins', 'num_vertices', 'num_st', 'num_tris', 'num_glcmds', 'num_frames',
				'offset_skins', 'offset_st', 'offset_tris', 'offset_frames', 'offset_glcmds', 'offset_end'
			];

			for ( var i = 0; i < headerNames.length; i ++ ) {

				header[ headerNames[ i ] ] = data.getInt32( i * 4, true );

			}

			if ( header.ident !== 844121161 || header.version !== 8 ) {

				console.error( 'Not a valid MD2 file' );
				return;

			}

			if ( header.offset_end !== data.byteLength ) {

				console.error( 'Corrupted MD2 file' );
				return;

			}

			//

			var geometry = new THREE.Geometry();

			// uvs

			var uvs = [];
			var offset = header.offset_st;

			for ( var i = 0, l = header.num_st; i < l; i ++ ) {

				var u = data.getInt16( offset + 0, true );
				var v = data.getInt16( offset + 2, true );

				uvs.push( new THREE.Vector2( u / header.skinwidth, 1 - ( v / header.skinheight ) ) );

				offset += 4;

			}

			// triangles

			var offset = header.offset_tris;

			for ( var i = 0, l = header.num_tris; i < l; i ++ ) {

				var a = data.getUint16( offset + 0, true );
				var b = data.getUint16( offset + 2, true );
				var c = data.getUint16( offset + 4, true );

				geometry.faces.push( new THREE.Face3( a, b, c ) );

				geometry.faceVertexUvs[ 0 ].push( [
					uvs[ data.getUint16( offset + 6, true ) ],
					uvs[ data.getUint16( offset + 8, true ) ],
					uvs[ data.getUint16( offset + 10, true ) ]
				] );

				offset += 12;

			}

			// frames

			var translation = new THREE.Vector3();
			var scale = new THREE.Vector3();
			var string = [];

			var offset = header.offset_frames;

			for ( var i = 0, l = header.num_frames; i < l; i ++ ) {

				scale.set(
					data.getFloat32( offset + 0, true ),
					data.getFloat32( offset + 4, true ),
					data.getFloat32( offset + 8, true )
				);

				translation.set(
					data.getFloat32( offset + 12, true ),
					data.getFloat32( offset + 16, true ),
					data.getFloat32( offset + 20, true )
				);

				offset += 24;

				for ( var j = 0; j < 16; j ++ ) {

					var character = data.getUint8( offset + j, true );
					if( character === 0 ) break;
					
					string[ j ] = character;

				}

				var frame = {
					name: String.fromCharCode.apply( null, string ),
					vertices: [],
					normals: []
				};

				offset += 16;

				for ( var j = 0; j < header.num_vertices; j ++ ) {

					var x = data.getUint8( offset ++, true );
					var y = data.getUint8( offset ++, true );
					var z = data.getUint8( offset ++, true );
					var n = normals[ data.getUint8( offset ++, true ) ];

					var vertex = new THREE.Vector3(
						x * scale.x + translation.x,
						z * scale.z + translation.z,
						y * scale.y + translation.y
					);

					var normal = new THREE.Vector3( n[ 0 ], n[ 2 ], n[ 1 ] );

					frame.vertices.push( vertex );
					frame.normals.push( normal );

				}

				geometry.morphTargets.push( frame );

			}

			// Static

			geometry.vertices = geometry.morphTargets[ 0 ].vertices;

			var morphTarget = geometry.morphTargets[ 0 ];

			for ( var j = 0, jl = geometry.faces.length; j < jl; j ++ ) {

				var face = geometry.faces[ j ];

				face.vertexNormals = [
					morphTarget.normals[ face.a ],
					morphTarget.normals[ face.b ],
					morphTarget.normals[ face.c ]
				];

			}


			// Convert to geometry.morphNormals

			for ( var i = 0, l = geometry.morphTargets.length; i < l; i ++ ) {

				var morphTarget = geometry.morphTargets[ i ];
				var vertexNormals = [];

				for ( var j = 0, jl = geometry.faces.length; j < jl; j ++ ) {

					var face = geometry.faces[ j ];

					vertexNormals.push( {
						a: morphTarget.normals[ face.a ],
						b: morphTarget.normals[ face.b ],
						c: morphTarget.normals[ face.c ]
					} );

				}

				geometry.morphNormals.push( { vertexNormals: vertexNormals } );

			}

			geometry.animations = THREE.AnimationClip.CreateClipsFromMorphTargetSequences( geometry.morphTargets, 10 )

			console.timeEnd( 'MD2Loader' );

			return geometry;

		}

	} )()

}

// File:examples/js/loaders/OBJLoader.js

/**
 * @author mrdoob / http://mrdoob.com/
 */

THREE.OBJLoader = function ( manager ) {

	this.manager = ( manager !== undefined ) ? manager : THREE.DefaultLoadingManager;

	this.materials = null;

	this.regexp = {
		// v float float float
		vertex_pattern           : /^v\s+([\d|\.|\+|\-|e|E]+)\s+([\d|\.|\+|\-|e|E]+)\s+([\d|\.|\+|\-|e|E]+)/,
		// vn float float float
		normal_pattern           : /^vn\s+([\d|\.|\+|\-|e|E]+)\s+([\d|\.|\+|\-|e|E]+)\s+([\d|\.|\+|\-|e|E]+)/,
		// vt float float
		uv_pattern               : /^vt\s+([\d|\.|\+|\-|e|E]+)\s+([\d|\.|\+|\-|e|E]+)/,
		// f vertex vertex vertex
		face_vertex              : /^f\s+(-?\d+)\s+(-?\d+)\s+(-?\d+)(?:\s+(-?\d+))?/,
		// f vertex/uv vertex/uv vertex/uv
		face_vertex_uv           : /^f\s+(-?\d+)\/(-?\d+)\s+(-?\d+)\/(-?\d+)\s+(-?\d+)\/(-?\d+)(?:\s+(-?\d+)\/(-?\d+))?/,
		// f vertex/uv/normal vertex/uv/normal vertex/uv/normal
		face_vertex_uv_normal    : /^f\s+(-?\d+)\/(-?\d+)\/(-?\d+)\s+(-?\d+)\/(-?\d+)\/(-?\d+)\s+(-?\d+)\/(-?\d+)\/(-?\d+)(?:\s+(-?\d+)\/(-?\d+)\/(-?\d+))?/,
		// f vertex//normal vertex//normal vertex//normal
		face_vertex_normal       : /^f\s+(-?\d+)\/\/(-?\d+)\s+(-?\d+)\/\/(-?\d+)\s+(-?\d+)\/\/(-?\d+)(?:\s+(-?\d+)\/\/(-?\d+))?/,
		// o object_name | g group_name
		object_pattern           : /^[og]\s*(.+)?/,
		// s boolean
		smoothing_pattern        : /^s\s+(\d+|on|off)/,
		// mtllib file_reference
		material_library_pattern : /^mtllib /,
		// usemtl material_name
		material_use_pattern     : /^usemtl /
	};

};

THREE.OBJLoader.prototype = {

	constructor: THREE.OBJLoader,

	load: function ( url, onLoad, onProgress, onError ) {

		var scope = this;

		var loader = new THREE.XHRLoader( scope.manager );
		loader.setPath( this.path );
		loader.load( url, function ( text ) {

			onLoad( scope.parse( text ) );

		}, onProgress, onError );

	},

	setPath: function ( value ) {

		this.path = value;

	},

	setMaterials: function ( materials ) {

		this.materials = materials;

	},

	_createParserState : function () {

		var state = {
			objects  : [],
			object   : {},

			vertices : [],
			normals  : [],
			uvs      : [],

			materialLibraries : [],

			startObject: function ( name, fromDeclaration ) {

				// If the current object (initial from reset) is not from a g/o declaration in the parsed
				// file. We need to use it for the first parsed g/o to keep things in sync.
				if ( this.object && this.object.fromDeclaration === false ) {

					this.object.name = name;
					this.object.fromDeclaration = ( fromDeclaration !== false );
					return;

				}

				if ( this.object && typeof this.object._finalize === 'function' ) {

					this.object._finalize();

				}

				var previousMaterial = ( this.object && typeof this.object.currentMaterial === 'function' ? this.object.currentMaterial() : undefined );

				this.object = {
					name : name || '',
					fromDeclaration : ( fromDeclaration !== false ),

					geometry : {
						vertices : [],
						normals  : [],
						uvs      : []
					},
					materials : [],
					smooth : true,

					startMaterial : function( name, libraries ) {

						var previous = this._finalize( false );

						// New usemtl declaration overwrites an inherited material, except if faces were declared
						// after the material, then it must be preserved for proper MultiMaterial continuation.
						if ( previous && ( previous.inherited || previous.groupCount <= 0 ) ) {

							this.materials.splice( previous.index, 1 );

						}

						var material = {
							index      : this.materials.length,
							name       : name || '',
							mtllib     : ( Array.isArray( libraries ) && libraries.length > 0 ? libraries[ libraries.length - 1 ] : '' ),
							smooth     : ( previous !== undefined ? previous.smooth : this.smooth ),
							groupStart : ( previous !== undefined ? previous.groupEnd : 0 ),
							groupEnd   : -1,
							groupCount : -1,
							inherited  : false,

							clone : function( index ) {
								return {
									index      : ( typeof index === 'number' ? index : this.index ),
									name       : this.name,
									mtllib     : this.mtllib,
									smooth     : this.smooth,
									groupStart : this.groupEnd,
									groupEnd   : -1,
									groupCount : -1,
									inherited  : false
								};
							}
						};

						this.materials.push( material );

						return material;

					},

					currentMaterial : function() {

						if ( this.materials.length > 0 ) {
							return this.materials[ this.materials.length - 1 ];
						}

						return undefined;

					},

					_finalize : function( end ) {

						var lastMultiMaterial = this.currentMaterial();
						if ( lastMultiMaterial && lastMultiMaterial.groupEnd === -1 ) {

							lastMultiMaterial.groupEnd = this.geometry.vertices.length / 3;
							lastMultiMaterial.groupCount = lastMultiMaterial.groupEnd - lastMultiMaterial.groupStart;
							lastMultiMaterial.inherited = false;

						}

						// Guarantee at least one empty material, this makes the creation later more straight forward.
						if ( end !== false && this.materials.length === 0 ) {
							this.materials.push({
								name   : '',
								smooth : this.smooth
							});
						}

						return lastMultiMaterial;

					}
				};

				// Inherit previous objects material.
				// Spec tells us that a declared material must be set to all objects until a new material is declared.
				// If a usemtl declaration is encountered while this new object is being parsed, it will
				// overwrite the inherited material. Exception being that there was already face declarations
				// to the inherited material, then it will be preserved for proper MultiMaterial continuation.

				if ( previousMaterial && previousMaterial.name && typeof previousMaterial.clone === "function" ) {

					var declared = previousMaterial.clone( 0 );
					declared.inherited = true;
					this.object.materials.push( declared );

				}

				this.objects.push( this.object );

			},

			finalize : function() {

				if ( this.object && typeof this.object._finalize === 'function' ) {

					this.object._finalize();

				}

			},

			parseVertexIndex: function ( value, len ) {

				var index = parseInt( value, 10 );
				return ( index >= 0 ? index - 1 : index + len / 3 ) * 3;

			},

			parseNormalIndex: function ( value, len ) {

				var index = parseInt( value, 10 );
				return ( index >= 0 ? index - 1 : index + len / 3 ) * 3;

			},

			parseUVIndex: function ( value, len ) {

				var index = parseInt( value, 10 );
				return ( index >= 0 ? index - 1 : index + len / 2 ) * 2;

			},

			addVertex: function ( a, b, c ) {

				var src = this.vertices;
				var dst = this.object.geometry.vertices;

				dst.push( src[ a + 0 ] );
				dst.push( src[ a + 1 ] );
				dst.push( src[ a + 2 ] );
				dst.push( src[ b + 0 ] );
				dst.push( src[ b + 1 ] );
				dst.push( src[ b + 2 ] );
				dst.push( src[ c + 0 ] );
				dst.push( src[ c + 1 ] );
				dst.push( src[ c + 2 ] );

			},

			addVertexLine: function ( a ) {

				var src = this.vertices;
				var dst = this.object.geometry.vertices;

				dst.push( src[ a + 0 ] );
				dst.push( src[ a + 1 ] );
				dst.push( src[ a + 2 ] );

			},

			addNormal : function ( a, b, c ) {

				var src = this.normals;
				var dst = this.object.geometry.normals;

				dst.push( src[ a + 0 ] );
				dst.push( src[ a + 1 ] );
				dst.push( src[ a + 2 ] );
				dst.push( src[ b + 0 ] );
				dst.push( src[ b + 1 ] );
				dst.push( src[ b + 2 ] );
				dst.push( src[ c + 0 ] );
				dst.push( src[ c + 1 ] );
				dst.push( src[ c + 2 ] );

			},

			addUV: function ( a, b, c ) {

				var src = this.uvs;
				var dst = this.object.geometry.uvs;

				dst.push( src[ a + 0 ] );
				dst.push( src[ a + 1 ] );
				dst.push( src[ b + 0 ] );
				dst.push( src[ b + 1 ] );
				dst.push( src[ c + 0 ] );
				dst.push( src[ c + 1 ] );

			},

			addUVLine: function ( a ) {

				var src = this.uvs;
				var dst = this.object.geometry.uvs;

				dst.push( src[ a + 0 ] );
				dst.push( src[ a + 1 ] );

			},

			addFace: function ( a, b, c, d, ua, ub, uc, ud, na, nb, nc, nd ) {

				var vLen = this.vertices.length;

				var ia = this.parseVertexIndex( a, vLen );
				var ib = this.parseVertexIndex( b, vLen );
				var ic = this.parseVertexIndex( c, vLen );
				var id;

				if ( d === undefined ) {

					this.addVertex( ia, ib, ic );

				} else {

					id = this.parseVertexIndex( d, vLen );

					this.addVertex( ia, ib, id );
					this.addVertex( ib, ic, id );

				}

				if ( ua !== undefined ) {

					var uvLen = this.uvs.length;

					ia = this.parseUVIndex( ua, uvLen );
					ib = this.parseUVIndex( ub, uvLen );
					ic = this.parseUVIndex( uc, uvLen );

					if ( d === undefined ) {

						this.addUV( ia, ib, ic );

					} else {

						id = this.parseUVIndex( ud, uvLen );

						this.addUV( ia, ib, id );
						this.addUV( ib, ic, id );

					}

				}

				if ( na !== undefined ) {

					// Normals are many times the same. If so, skip function call and parseInt.
					var nLen = this.normals.length;
					ia = this.parseNormalIndex( na, nLen );

					ib = na === nb ? ia : this.parseNormalIndex( nb, nLen );
					ic = na === nc ? ia : this.parseNormalIndex( nc, nLen );

					if ( d === undefined ) {

						this.addNormal( ia, ib, ic );

					} else {

						id = this.parseNormalIndex( nd, nLen );

						this.addNormal( ia, ib, id );
						this.addNormal( ib, ic, id );

					}

				}

			},

			addLineGeometry: function ( vertices, uvs ) {

				this.object.geometry.type = 'Line';

				var vLen = this.vertices.length;
				var uvLen = this.uvs.length;

				for ( var vi = 0, l = vertices.length; vi < l; vi ++ ) {

					this.addVertexLine( this.parseVertexIndex( vertices[ vi ], vLen ) );

				}

				for ( var uvi = 0, l = uvs.length; uvi < l; uvi ++ ) {

					this.addUVLine( this.parseUVIndex( uvs[ uvi ], uvLen ) );

				}

			}

		};

		state.startObject( '', false );

		return state;

	},

	parse: function ( text ) {

		console.time( 'OBJLoader' );

		var state = this._createParserState();

		if ( text.indexOf( '\r\n' ) !== - 1 ) {

			// This is faster than String.split with regex that splits on both
			text = text.replace( '\r\n', '\n' );

		}

		var lines = text.split( '\n' );
		var line = '', lineFirstChar = '', lineSecondChar = '';
		var lineLength = 0;
		var result = [];

		// Faster to just trim left side of the line. Use if available.
		var trimLeft = ( typeof ''.trimLeft === 'function' );

		for ( var i = 0, l = lines.length; i < l; i ++ ) {

			line = lines[ i ];

			line = trimLeft ? line.trimLeft() : line.trim();

			lineLength = line.length;

			if ( lineLength === 0 ) continue;

			lineFirstChar = line.charAt( 0 );

			// @todo invoke passed in handler if any
			if ( lineFirstChar === '#' ) continue;

			if ( lineFirstChar === 'v' ) {

				lineSecondChar = line.charAt( 1 );

				if ( lineSecondChar === ' ' && ( result = this.regexp.vertex_pattern.exec( line ) ) !== null ) {

					// 0                  1      2      3
					// ["v 1.0 2.0 3.0", "1.0", "2.0", "3.0"]

					state.vertices.push(
						parseFloat( result[ 1 ] ),
						parseFloat( result[ 2 ] ),
						parseFloat( result[ 3 ] )
					);

				} else if ( lineSecondChar === 'n' && ( result = this.regexp.normal_pattern.exec( line ) ) !== null ) {

					// 0                   1      2      3
					// ["vn 1.0 2.0 3.0", "1.0", "2.0", "3.0"]

					state.normals.push(
						parseFloat( result[ 1 ] ),
						parseFloat( result[ 2 ] ),
						parseFloat( result[ 3 ] )
					);

				} else if ( lineSecondChar === 't' && ( result = this.regexp.uv_pattern.exec( line ) ) !== null ) {

					// 0               1      2
					// ["vt 0.1 0.2", "0.1", "0.2"]

					state.uvs.push(
						parseFloat( result[ 1 ] ),
						parseFloat( result[ 2 ] )
					);

				} else {

					throw new Error( "Unexpected vertex/normal/uv line: '" + line  + "'" );

				}

			} else if ( lineFirstChar === "f" ) {

				if ( ( result = this.regexp.face_vertex_uv_normal.exec( line ) ) !== null ) {

					// f vertex/uv/normal vertex/uv/normal vertex/uv/normal
					// 0                        1    2    3    4    5    6    7    8    9   10         11         12
					// ["f 1/1/1 2/2/2 3/3/3", "1", "1", "1", "2", "2", "2", "3", "3", "3", undefined, undefined, undefined]

					state.addFace(
						result[ 1 ], result[ 4 ], result[ 7 ], result[ 10 ],
						result[ 2 ], result[ 5 ], result[ 8 ], result[ 11 ],
						result[ 3 ], result[ 6 ], result[ 9 ], result[ 12 ]
					);

				} else if ( ( result = this.regexp.face_vertex_uv.exec( line ) ) !== null ) {

					// f vertex/uv vertex/uv vertex/uv
					// 0                  1    2    3    4    5    6   7          8
					// ["f 1/1 2/2 3/3", "1", "1", "2", "2", "3", "3", undefined, undefined]

					state.addFace(
						result[ 1 ], result[ 3 ], result[ 5 ], result[ 7 ],
						result[ 2 ], result[ 4 ], result[ 6 ], result[ 8 ]
					);

				} else if ( ( result = this.regexp.face_vertex_normal.exec( line ) ) !== null ) {

					// f vertex//normal vertex//normal vertex//normal
					// 0                     1    2    3    4    5    6   7          8
					// ["f 1//1 2//2 3//3", "1", "1", "2", "2", "3", "3", undefined, undefined]

					state.addFace(
						result[ 1 ], result[ 3 ], result[ 5 ], result[ 7 ],
						undefined, undefined, undefined, undefined,
						result[ 2 ], result[ 4 ], result[ 6 ], result[ 8 ]
					);

				} else if ( ( result = this.regexp.face_vertex.exec( line ) ) !== null ) {

					// f vertex vertex vertex
					// 0            1    2    3   4
					// ["f 1 2 3", "1", "2", "3", undefined]

					state.addFace(
						result[ 1 ], result[ 2 ], result[ 3 ], result[ 4 ]
					);

				} else {

					throw new Error( "Unexpected face line: '" + line  + "'" );

				}

			} else if ( lineFirstChar === "l" ) {

				var lineParts = line.substring( 1 ).trim().split( " " );
				var lineVertices = [], lineUVs = [];

				if ( line.indexOf( "/" ) === - 1 ) {

					lineVertices = lineParts;

				} else {

					for ( var li = 0, llen = lineParts.length; li < llen; li ++ ) {

						var parts = lineParts[ li ].split( "/" );

						if ( parts[ 0 ] !== "" ) lineVertices.push( parts[ 0 ] );
						if ( parts[ 1 ] !== "" ) lineUVs.push( parts[ 1 ] );

					}

				}
				state.addLineGeometry( lineVertices, lineUVs );

			} else if ( ( result = this.regexp.object_pattern.exec( line ) ) !== null ) {

				// o object_name
				// or
				// g group_name

				var name = result[ 0 ].substr( 1 ).trim();
				state.startObject( name );

			} else if ( this.regexp.material_use_pattern.test( line ) ) {

				// material

				state.object.startMaterial( line.substring( 7 ).trim(), state.materialLibraries );

			} else if ( this.regexp.material_library_pattern.test( line ) ) {

				// mtl file

				state.materialLibraries.push( line.substring( 7 ).trim() );

			} else if ( ( result = this.regexp.smoothing_pattern.exec( line ) ) !== null ) {

				// smooth shading

				// @todo Handle files that have varying smooth values for a set of faces inside one geometry,
				// but does not define a usemtl for each face set.
				// This should be detected and a dummy material created (later MultiMaterial and geometry groups).
				// This requires some care to not create extra material on each smooth value for "normal" obj files.
				// where explicit usemtl defines geometry groups.
				// Example asset: examples/models/obj/cerberus/Cerberus.obj

				var value = result[ 1 ].trim().toLowerCase();
				state.object.smooth = ( value === '1' || value === 'on' );

				var material = state.object.currentMaterial();
				if ( material ) {

					material.smooth = state.object.smooth;

				}

			} else {

				// Handle null terminated files without exception
				if ( line === '\0' ) continue;

				throw new Error( "Unexpected line: '" + line  + "'" );

			}

		}

		state.finalize();

		var container = new THREE.Group();
		container.materialLibraries = [].concat( state.materialLibraries );

		for ( var i = 0, l = state.objects.length; i < l; i ++ ) {

			var object = state.objects[ i ];
			var geometry = object.geometry;
			var materials = object.materials;
			var isLine = ( geometry.type === 'Line' );

			// Skip o/g line declarations that did not follow with any faces
			if ( geometry.vertices.length === 0 ) continue;

			var buffergeometry = new THREE.BufferGeometry();

			buffergeometry.addAttribute( 'position', new THREE.BufferAttribute( new Float32Array( geometry.vertices ), 3 ) );

			if ( geometry.normals.length > 0 ) {

				buffergeometry.addAttribute( 'normal', new THREE.BufferAttribute( new Float32Array( geometry.normals ), 3 ) );

			} else {

				buffergeometry.computeVertexNormals();

			}

			if ( geometry.uvs.length > 0 ) {

				buffergeometry.addAttribute( 'uv', new THREE.BufferAttribute( new Float32Array( geometry.uvs ), 2 ) );

			}

			// Create materials

			var createdMaterials = [];

			for ( var mi = 0, miLen = materials.length; mi < miLen ; mi++ ) {

				var sourceMaterial = materials[mi];
				var material = undefined;

				if ( this.materials !== null ) {

					material = this.materials.create( sourceMaterial.name );

					// mtl etc. loaders probably can't create line materials correctly, copy properties to a line material.
					if ( isLine && material && ! ( material instanceof THREE.LineBasicMaterial ) ) {

						var materialLine = new THREE.LineBasicMaterial();
						materialLine.copy( material );
						material = materialLine;

					}

				}

				if ( ! material ) {

					material = ( ! isLine ? new THREE.MeshPhongMaterial() : new THREE.LineBasicMaterial() );
					material.name = sourceMaterial.name;

				}

				material.shading = sourceMaterial.smooth ? THREE.SmoothShading : THREE.FlatShading;

				createdMaterials.push(material);

			}

			// Create mesh

			var mesh;

			if ( createdMaterials.length > 1 ) {

				for ( var mi = 0, miLen = materials.length; mi < miLen ; mi++ ) {

					var sourceMaterial = materials[mi];
					buffergeometry.addGroup( sourceMaterial.groupStart, sourceMaterial.groupCount, mi );

				}

				var multiMaterial = new THREE.MultiMaterial( createdMaterials );
				mesh = ( ! isLine ? new THREE.Mesh( buffergeometry, multiMaterial ) : new THREE.Line( buffergeometry, multiMaterial ) );

			} else {

				mesh = ( ! isLine ? new THREE.Mesh( buffergeometry, createdMaterials[ 0 ] ) : new THREE.Line( buffergeometry, createdMaterials[ 0 ] ) );
			}

			mesh.name = object.name;

			container.add( mesh );

		}

		console.timeEnd( 'OBJLoader' );

		return container;

	}

};

// File:examples/js/loaders/PlayCanvasLoader.js

/**
 * @author mrdoob / http://mrdoob.com/
 */

THREE.PlayCanvasLoader = function ( manager ) {

	this.manager = ( manager !== undefined ) ? manager : THREE.DefaultLoadingManager;

};

THREE.PlayCanvasLoader.prototype = {

	constructor: THREE.PlayCanvasLoader,

	load: function ( url, onLoad, onProgress, onError ) {

		var scope = this;

		var loader = new THREE.XHRLoader( scope.manager );
		loader.load( url, function ( text ) {

			onLoad( scope.parse( JSON.parse( text ) ) );

		}, onProgress, onError );

	},

	parse: function ( json ) {

		function parseVertices( data ) {

			var attributes = {};

			for ( var name in data ) {

				var attribute = data[ name ];

				var type = attribute.type;
				var size = attribute.components;

				var array;

				if ( type === 'float32' ) array = new Float32Array( attribute.data );
				if ( array === undefined ) console.log( 'PlayCanvasLoader: TODO', type );

				attributes[ name ] = new THREE.BufferAttribute( array, size );

			}

			data._attributes = attributes;

		}

		function parseMeshes( data ) {

			var geometry = new THREE.BufferGeometry();

			geometry.setIndex( new THREE.Uint16Attribute( data.indices, 1 ) );

			var attributes = model.vertices[ data.vertices ]._attributes;

			for ( var name in attributes ) {

				var attribute = attributes[ name ];

				if ( name === 'texCoord0' ) name = 'uv';

				geometry.addAttribute( name, attribute );

			}

			data._geometry = geometry;

		}

		function parseMeshInstances( data ) {

			var node = model.nodes[ data.node ];
			var mesh = model.meshes[ data.mesh ];

			if ( node._geometries === undefined ) {

				node._geometries = [];

			}

			node._geometries.push( mesh._geometry );

		}

		function parseNodes( data ) {

			var object = new THREE.Group();
			object.name = data.name;

			if ( data._geometries !== undefined ) {

				var material = new THREE.MeshPhongMaterial();

				for ( var i = 0; i < data._geometries.length; i ++ ) {

					var geometry = data._geometries[ i ];

					object.add( new THREE.Mesh( geometry, material ) );

				}

			}

			for ( var i = 0; i < data.rotation.length; i ++ ) {

				data.rotation[ i ] *= Math.PI / 180;

			}

			object.position.fromArray( data.position );
			object.rotation.fromArray( data.rotation );
			object.scale.fromArray( data.scale );

			data._object = object;

		}

		//

		console.log( json );

		var model = json.model;

		for ( var i = 0; i < model.vertices.length; i ++ ) {

			parseVertices( model.vertices[ i ] );

		}

		for ( var i = 0; i < model.meshes.length; i ++ ) {

			parseMeshes( model.meshes[ i ] );

		}

		for ( var i = 0; i < model.meshInstances.length; i ++ ) {

			parseMeshInstances( model.meshInstances[ i ] );

		}

		for ( var i = 0; i < model.nodes.length; i ++ ) {

			parseNodes( model.nodes[ i ] );

		}

		for ( var i = 0; i < model.parents.length; i ++ ) {

			var parent = model.parents[ i ];

			if ( parent === -1 ) continue;

			model.nodes[ parent ]._object.add( model.nodes[ i ]._object );


		}

		return model.nodes[ 0 ]._object;

	}

};

// File:examples/js/loaders/PLYLoader.js

/**
 * @author Wei Meng / http://about.me/menway
 *
 * Description: A THREE loader for PLY ASCII files (known as the Polygon
 * File Format or the Stanford Triangle Format).
 *
 * Limitations: ASCII decoding assumes file is UTF-8.
 *
 * Usage:
 *	var loader = new THREE.PLYLoader();
 *	loader.load('./models/ply/ascii/dolphins.ply', function (geometry) {
 *
 *		scene.add( new THREE.Mesh( geometry ) );
 *
 *	} );
 *
 * If the PLY file uses non standard property names, they can be mapped while
 * loading. For example, the following maps the properties
 * “diffuse_(red|green|blue)” in the file to standard color names.
 *
 * loader.setPropertyNameMapping( {
 *	diffuse_red: 'red',
 *	diffuse_green: 'green',
 *	diffuse_blue: 'blue'
 * } );
 *
 */


THREE.PLYLoader = function ( manager ) {

	this.manager = ( manager !== undefined ) ? manager : THREE.DefaultLoadingManager;

	this.propertyNameMapping = {};

};

THREE.PLYLoader.prototype = {

	constructor: THREE.PLYLoader,

	load: function ( url, onLoad, onProgress, onError ) {

		var scope = this;

		var loader = new THREE.XHRLoader( this.manager );
		loader.setResponseType( 'arraybuffer' );
		loader.load( url, function ( text ) {

			onLoad( scope.parse( text ) );

		}, onProgress, onError );

	},

	setPropertyNameMapping: function ( mapping ) {

		this.propertyNameMapping = mapping;

	},

	parse: function ( data ) {

		function isASCII( data ) {

			var header = parseHeader( bin2str( data ) );
			return header.format === "ascii";

		}

		function bin2str( buf ) {

			var array_buffer = new Uint8Array( buf );
			var str = '';

			for ( var i = 0; i < buf.byteLength; i ++ ) {

				str += String.fromCharCode( array_buffer[ i ] ); // implicitly assumes little-endian

			}

			return str;

		}

		function parseHeader( data ) {

			var patternHeader = /ply([\s\S]*)end_header\s/;
			var headerText = "";
			var headerLength = 0;
			var result = patternHeader.exec( data );

			if ( result !== null ) {

				headerText = result [ 1 ];
				headerLength = result[ 0 ].length;

			}

			var header = {
				comments: [],
				elements: [],
				headerLength: headerLength
			};

			var lines = headerText.split( '\n' );
			var currentElement;
			var lineType, lineValues;

			function make_ply_element_property( propertValues, propertyNameMapping ) {

				var property = { type: propertValues[ 0 ] };

				if ( property.type === 'list' ) {

					property.name = propertValues[ 3 ];
					property.countType = propertValues[ 1 ];
					property.itemType = propertValues[ 2 ];

				} else {

					property.name = propertValues[ 1 ];

				}

				if ( property.name in propertyNameMapping ) {

					property.name = propertyNameMapping[ property.name ];

				}

				return property;

			}

			for ( var i = 0; i < lines.length; i ++ ) {

				var line = lines[ i ];
				line = line.trim();

				if ( line === "" ) continue;

				lineValues = line.split( /\s+/ );
				lineType = lineValues.shift();
				line = lineValues.join( " " );

				switch ( lineType ) {

					case "format":

						header.format = lineValues[ 0 ];
						header.version = lineValues[ 1 ];

						break;

					case "comment":

						header.comments.push( line );

						break;

					case "element":

						if ( currentElement !== undefined ) {

							header.elements.push( currentElement );

						}

						currentElement = {};
						currentElement.name = lineValues[ 0 ];
						currentElement.count = parseInt( lineValues[ 1 ] );
						currentElement.properties = [];

						break;

					case "property":

						currentElement.properties.push( make_ply_element_property( lineValues, scope.propertyNameMapping ) );

						break;


					default:

						console.log( "unhandled", lineType, lineValues );

				}

			}

			if ( currentElement !== undefined ) {

				header.elements.push( currentElement );

			}

			return header;

		}

		function parseASCIINumber( n, type ) {

			switch ( type ) {

			case 'char': case 'uchar': case 'short': case 'ushort': case 'int': case 'uint':
			case 'int8': case 'uint8': case 'int16': case 'uint16': case 'int32': case 'uint32':

				return parseInt( n );

			case 'float': case 'double': case 'float32': case 'float64':

				return parseFloat( n );

			}

		}

		function parseASCIIElement( properties, line ) {

			var values = line.split( /\s+/ );

			var element = {};

			for ( var i = 0; i < properties.length; i ++ ) {

				if ( properties[ i ].type === "list" ) {

					var list = [];
					var n = parseASCIINumber( values.shift(), properties[ i ].countType );

					for ( var j = 0; j < n; j ++ ) {

						list.push( parseASCIINumber( values.shift(), properties[ i ].itemType ) );

					}

					element[ properties[ i ].name ] = list;

				} else {

					element[ properties[ i ].name ] = parseASCIINumber( values.shift(), properties[ i ].type );

				}

			}

			return element;

		}

		function parseASCII( data ) {

			// PLY ascii format specification, as per http://en.wikipedia.org/wiki/PLY_(file_format)

			var geometry = new THREE.Geometry();

			var result;

			var header = parseHeader( data );

			var patternBody = /end_header\s([\s\S]*)$/;
			var body = "";
			if ( ( result = patternBody.exec( data ) ) !== null ) {

				body = result [ 1 ];

			}

			var lines = body.split( '\n' );
			var currentElement = 0;
			var currentElementCount = 0;
			geometry.useColor = false;

			for ( var i = 0; i < lines.length; i ++ ) {

				var line = lines[ i ];
				line = line.trim();
				if ( line === "" ) {

					continue;

				}

				if ( currentElementCount >= header.elements[ currentElement ].count ) {

					currentElement ++;
					currentElementCount = 0;

				}

				var element = parseASCIIElement( header.elements[ currentElement ].properties, line );

				handleElement( geometry, header.elements[ currentElement ].name, element );

				currentElementCount ++;

			}

			return postProcess( geometry );

		}

		function postProcess( geometry ) {

			if ( geometry.useColor ) {

				for ( var i = 0; i < geometry.faces.length; i ++ ) {

					geometry.faces[ i ].vertexColors = [
						geometry.colors[ geometry.faces[ i ].a ],
						geometry.colors[ geometry.faces[ i ].b ],
						geometry.colors[ geometry.faces[ i ].c ]
					];

				}

				geometry.elementsNeedUpdate = true;

			}

			geometry.computeBoundingSphere();

			return geometry;

		}

		function handleElement( geometry, elementName, element ) {

			if ( elementName === "vertex" ) {

				geometry.vertices.push(
					new THREE.Vector3( element.x, element.y, element.z )
				);

				if ( 'red' in element && 'green' in element && 'blue' in element ) {

					geometry.useColor = true;

					var color = new THREE.Color();
					color.setRGB( element.red / 255.0, element.green / 255.0, element.blue / 255.0 );
					geometry.colors.push( color );

				}

			} else if ( elementName === "face" ) {

				var vertex_indices = element.vertex_indices;
				var texcoord = element.texcoord;

				if ( vertex_indices.length === 3 ) {

					geometry.faces.push(
						new THREE.Face3( vertex_indices[ 0 ], vertex_indices[ 1 ], vertex_indices[ 2 ] )
					);

					if ( texcoord ) {
						geometry.faceVertexUvs[ 0 ].push( [
							new THREE.Vector2( texcoord[ 0 ], texcoord[ 1 ]),
							new THREE.Vector2( texcoord[ 2 ], texcoord[ 3 ]),
							new THREE.Vector2( texcoord[ 4 ], texcoord[ 5 ])
						] );
					}

				} else if ( vertex_indices.length === 4 ) {

					geometry.faces.push(
						new THREE.Face3( vertex_indices[ 0 ], vertex_indices[ 1 ], vertex_indices[ 3 ] ),
						new THREE.Face3( vertex_indices[ 1 ], vertex_indices[ 2 ], vertex_indices[ 3 ] )
					);

					if ( texcoord ) {
						geometry.faceVertexUvs[ 0 ].push( [
							new THREE.Vector2( texcoord[ 0 ], texcoord[ 1 ]),
							new THREE.Vector2( texcoord[ 2 ], texcoord[ 3 ]),
							new THREE.Vector2( texcoord[ 6 ], texcoord[ 7 ])
						], [
							new THREE.Vector2( texcoord[ 2 ], texcoord[ 3 ]),
							new THREE.Vector2( texcoord[ 4 ], texcoord[ 5 ]),
							new THREE.Vector2( texcoord[ 6 ], texcoord[ 7 ])
						] );
					}

				}

			}

		}

		function binaryRead( dataview, at, type, little_endian ) {

			switch ( type ) {

				// corespondences for non-specific length types here match rply:
				case 'int8':		case 'char':	 return [ dataview.getInt8( at ), 1 ];
				case 'uint8':		case 'uchar':	 return [ dataview.getUint8( at ), 1 ];
				case 'int16':		case 'short':	 return [ dataview.getInt16( at, little_endian ), 2 ];
				case 'uint16':	case 'ushort': return [ dataview.getUint16( at, little_endian ), 2 ];
				case 'int32':		case 'int':		 return [ dataview.getInt32( at, little_endian ), 4 ];
				case 'uint32':	case 'uint':	 return [ dataview.getUint32( at, little_endian ), 4 ];
				case 'float32': case 'float':	 return [ dataview.getFloat32( at, little_endian ), 4 ];
				case 'float64': case 'double': return [ dataview.getFloat64( at, little_endian ), 8 ];

			}

		}

		function binaryReadElement( dataview, at, properties, little_endian ) {

			var element = {};
			var result, read = 0;

			for ( var i = 0; i < properties.length; i ++ ) {

				if ( properties[ i ].type === "list" ) {

					var list = [];

					result = binaryRead( dataview, at + read, properties[ i ].countType, little_endian );
					var n = result[ 0 ];
					read += result[ 1 ];

					for ( var j = 0; j < n; j ++ ) {

						result = binaryRead( dataview, at + read, properties[ i ].itemType, little_endian );
						list.push( result[ 0 ] );
						read += result[ 1 ];

					}

					element[ properties[ i ].name ] = list;

				} else {

					result = binaryRead( dataview, at + read, properties[ i ].type, little_endian );
					element[ properties[ i ].name ] = result[ 0 ];
					read += result[ 1 ];

				}

			}

			return [ element, read ];

		}

		function parseBinary( data ) {

			var geometry = new THREE.Geometry();

			var header = parseHeader( bin2str( data ) );
			var little_endian = ( header.format === "binary_little_endian" );
			var body = new DataView( data, header.headerLength );
			var result, loc = 0;

			for ( var currentElement = 0; currentElement < header.elements.length; currentElement ++ ) {

				for ( var currentElementCount = 0; currentElementCount < header.elements[ currentElement ].count; currentElementCount ++ ) {

					result = binaryReadElement( body, loc, header.elements[ currentElement ].properties, little_endian );
					loc += result[ 1 ];
					var element = result[ 0 ];

					handleElement( geometry, header.elements[ currentElement ].name, element );

				}

			}

			return postProcess( geometry );

		}

		//

		console.time( 'PLYLoader' );

		var geometry;
		var scope = this;

		if ( data instanceof ArrayBuffer ) {

			geometry = isASCII( data ) ? parseASCII( bin2str( data ) ) : parseBinary( data );

		} else {

			geometry = parseASCII( data );

		}

		console.timeEnd( 'PLYLoader' );

		return geometry;

	}

};

// File:examples/js/loaders/STLLoader.js

/**
 * @author aleeper / http://adamleeper.com/
 * @author mrdoob / http://mrdoob.com/
 * @author gero3 / https://github.com/gero3
 *
 * Description: A THREE loader for STL ASCII files, as created by Solidworks and other CAD programs.
 *
 * Supports both binary and ASCII encoded files, with automatic detection of type.
 *
 * Limitations:
 *  Binary decoding supports "Magics" color format (http://en.wikipedia.org/wiki/STL_(file_format)#Color_in_binary_STL).
 *  There is perhaps some question as to how valid it is to always assume little-endian-ness.
 *  ASCII decoding assumes file is UTF-8. Seems to work for the examples...
 *
 * Usage:
 *  var loader = new THREE.STLLoader();
 *  loader.load( './models/stl/slotted_disk.stl', function ( geometry ) {
 *    scene.add( new THREE.Mesh( geometry ) );
 *  });
 *
 * For binary STLs geometry might contain colors for vertices. To use it:
 *  // use the same code to load STL as above
 *  if (geometry.hasColors) {
 *    material = new THREE.MeshPhongMaterial({ opacity: geometry.alpha, vertexColors: THREE.VertexColors });
 *  } else { .... }
 *  var mesh = new THREE.Mesh( geometry, material );
 */


THREE.STLLoader = function ( manager ) {

	this.manager = ( manager !== undefined ) ? manager : THREE.DefaultLoadingManager;

};

THREE.STLLoader.prototype = {

	constructor: THREE.STLLoader,

	load: function ( url, onLoad, onProgress, onError ) {

		var scope = this;

		var loader = new THREE.XHRLoader( scope.manager );
		loader.setResponseType( 'arraybuffer' );
		loader.load( url, function ( text ) {

			onLoad( scope.parse( text ) );

		}, onProgress, onError );

	},

	parse: function ( data ) {

		var isBinary = function () {

			var expect, face_size, n_faces, reader;
			reader = new DataView( binData );
			face_size = ( 32 / 8 * 3 ) + ( ( 32 / 8 * 3 ) * 3 ) + ( 16 / 8 );
			n_faces = reader.getUint32( 80, true );
			expect = 80 + ( 32 / 8 ) + ( n_faces * face_size );

			if ( expect === reader.byteLength ) {

				return true;

			}

			// some binary files will have different size from expected,
			// checking characters higher than ASCII to confirm is binary
			var fileLength = reader.byteLength;
			for ( var index = 0; index < fileLength; index ++ ) {

				if ( reader.getUint8( index, false ) > 127 ) {

					return true;

				}

			}

			return false;

		};

		var binData = this.ensureBinary( data );

		return isBinary()
			? this.parseBinary( binData )
			: this.parseASCII( this.ensureString( data ) );

	},

	parseBinary: function ( data ) {

		var reader = new DataView( data );
		var faces = reader.getUint32( 80, true );

		var r, g, b, hasColors = false, colors;
		var defaultR, defaultG, defaultB, alpha;

		// process STL header
		// check for default color in header ("COLOR=rgba" sequence).

		for ( var index = 0; index < 80 - 10; index ++ ) {

			if ( ( reader.getUint32( index, false ) == 0x434F4C4F /*COLO*/ ) &&
				( reader.getUint8( index + 4 ) == 0x52 /*'R'*/ ) &&
				( reader.getUint8( index + 5 ) == 0x3D /*'='*/ ) ) {

				hasColors = true;
				colors = new Float32Array( faces * 3 * 3 );

				defaultR = reader.getUint8( index + 6 ) / 255;
				defaultG = reader.getUint8( index + 7 ) / 255;
				defaultB = reader.getUint8( index + 8 ) / 255;
				alpha = reader.getUint8( index + 9 ) / 255;

			}

		}

		var dataOffset = 84;
		var faceLength = 12 * 4 + 2;

		var offset = 0;

		var geometry = new THREE.BufferGeometry();

		var vertices = new Float32Array( faces * 3 * 3 );
		var normals = new Float32Array( faces * 3 * 3 );

		for ( var face = 0; face < faces; face ++ ) {

			var start = dataOffset + face * faceLength;
			var normalX = reader.getFloat32( start, true );
			var normalY = reader.getFloat32( start + 4, true );
			var normalZ = reader.getFloat32( start + 8, true );

			if ( hasColors ) {

				var packedColor = reader.getUint16( start + 48, true );

				if ( ( packedColor & 0x8000 ) === 0 ) {

					// facet has its own unique color

					r = ( packedColor & 0x1F ) / 31;
					g = ( ( packedColor >> 5 ) & 0x1F ) / 31;
					b = ( ( packedColor >> 10 ) & 0x1F ) / 31;

				} else {

					r = defaultR;
					g = defaultG;
					b = defaultB;

				}

			}

			for ( var i = 1; i <= 3; i ++ ) {

				var vertexstart = start + i * 12;

				vertices[ offset ] = reader.getFloat32( vertexstart, true );
				vertices[ offset + 1 ] = reader.getFloat32( vertexstart + 4, true );
				vertices[ offset + 2 ] = reader.getFloat32( vertexstart + 8, true );

				normals[ offset ] = normalX;
				normals[ offset + 1 ] = normalY;
				normals[ offset + 2 ] = normalZ;

				if ( hasColors ) {

					colors[ offset ] = r;
					colors[ offset + 1 ] = g;
					colors[ offset + 2 ] = b;

				}

				offset += 3;

			}

		}

		geometry.addAttribute( 'position', new THREE.BufferAttribute( vertices, 3 ) );
		geometry.addAttribute( 'normal', new THREE.BufferAttribute( normals, 3 ) );

		if ( hasColors ) {

			geometry.addAttribute( 'color', new THREE.BufferAttribute( colors, 3 ) );
			geometry.hasColors = true;
			geometry.alpha = alpha;

		}

		return geometry;

	},

	parseASCII: function ( data ) {

		var geometry, length, normal, patternFace, patternNormal, patternVertex, result, text;
		geometry = new THREE.Geometry();
		patternFace = /facet([\s\S]*?)endfacet/g;

		while ( ( result = patternFace.exec( data ) ) !== null ) {

			text = result[ 0 ];
			patternNormal = /normal[\s]+([\-+]?[0-9]+\.?[0-9]*([eE][\-+]?[0-9]+)?)+[\s]+([\-+]?[0-9]*\.?[0-9]+([eE][\-+]?[0-9]+)?)+[\s]+([\-+]?[0-9]*\.?[0-9]+([eE][\-+]?[0-9]+)?)+/g;

			while ( ( result = patternNormal.exec( text ) ) !== null ) {

				normal = new THREE.Vector3( parseFloat( result[ 1 ] ), parseFloat( result[ 3 ] ), parseFloat( result[ 5 ] ) );

			}

			patternVertex = /vertex[\s]+([\-+]?[0-9]+\.?[0-9]*([eE][\-+]?[0-9]+)?)+[\s]+([\-+]?[0-9]*\.?[0-9]+([eE][\-+]?[0-9]+)?)+[\s]+([\-+]?[0-9]*\.?[0-9]+([eE][\-+]?[0-9]+)?)+/g;

			while ( ( result = patternVertex.exec( text ) ) !== null ) {

				geometry.vertices.push( new THREE.Vector3( parseFloat( result[ 1 ] ), parseFloat( result[ 3 ] ), parseFloat( result[ 5 ] ) ) );

			}

			length = geometry.vertices.length;

			geometry.faces.push( new THREE.Face3( length - 3, length - 2, length - 1, normal ) );

		}

		geometry.computeBoundingBox();
		geometry.computeBoundingSphere();

		return geometry;

	},

	ensureString: function ( buf ) {

		if ( typeof buf !== "string" ) {

			var array_buffer = new Uint8Array( buf );
			var str = '';
			for ( var i = 0; i < buf.byteLength; i ++ ) {

				str += String.fromCharCode( array_buffer[ i ] ); // implicitly assumes little-endian

			}
			return str;

		} else {

			return buf;

		}

	},

	ensureBinary: function ( buf ) {

		if ( typeof buf === "string" ) {

			var array_buffer = new Uint8Array( buf.length );
			for ( var i = 0; i < buf.length; i ++ ) {

				array_buffer[ i ] = buf.charCodeAt( i ) & 0xff; // implicitly assumes little-endian

			}
			return array_buffer.buffer || array_buffer;

		} else {

			return buf;

		}

	}

};

if ( typeof DataView === 'undefined' ) {

	DataView = function( buffer, byteOffset, byteLength ) {

		this.buffer = buffer;
		this.byteOffset = byteOffset || 0;
		this.byteLength = byteLength || buffer.byteLength || buffer.length;
		this._isString = typeof buffer === "string";

	};

	DataView.prototype = {

		_getCharCodes: function( buffer, start, length ) {

			start = start || 0;
			length = length || buffer.length;
			var end = start + length;
			var codes = [];
			for ( var i = start; i < end; i ++ ) {

				codes.push( buffer.charCodeAt( i ) & 0xff );

			}
			return codes;

		},

		_getBytes: function ( length, byteOffset, littleEndian ) {

			var result;

			// Handle the lack of endianness
			if ( littleEndian === undefined ) {

				littleEndian = this._littleEndian;

			}

			// Handle the lack of byteOffset
			if ( byteOffset === undefined ) {

				byteOffset = this.byteOffset;

			} else {

				byteOffset = this.byteOffset + byteOffset;

			}

			if ( length === undefined ) {

				length = this.byteLength - byteOffset;

			}

			// Error Checking
			if ( typeof byteOffset !== 'number' ) {

				throw new TypeError( 'DataView byteOffset is not a number' );

			}

			if ( length < 0 || byteOffset + length > this.byteLength ) {

				throw new Error( 'DataView length or (byteOffset+length) value is out of bounds' );

			}

			if ( this.isString ) {

				result = this._getCharCodes( this.buffer, byteOffset, byteOffset + length );

			} else {

				result = this.buffer.slice( byteOffset, byteOffset + length );

			}

			if ( ! littleEndian && length > 1 ) {

				if ( Array.isArray( result ) === false ) {

					result = Array.prototype.slice.call( result );

				}

				result.reverse();

			}

			return result;

		},

		// Compatibility functions on a String Buffer

		getFloat64: function ( byteOffset, littleEndian ) {

			var b = this._getBytes( 8, byteOffset, littleEndian ),

				sign = 1 - ( 2 * ( b[ 7 ] >> 7 ) ),
				exponent = ( ( ( ( b[ 7 ] << 1 ) & 0xff ) << 3 ) | ( b[ 6 ] >> 4 ) ) - ( ( 1 << 10 ) - 1 ),

			// Binary operators such as | and << operate on 32 bit values, using + and Math.pow(2) instead
				mantissa = ( ( b[ 6 ] & 0x0f ) * Math.pow( 2, 48 ) ) + ( b[ 5 ] * Math.pow( 2, 40 ) ) + ( b[ 4 ] * Math.pow( 2, 32 ) ) +
							( b[ 3 ] * Math.pow( 2, 24 ) ) + ( b[ 2 ] * Math.pow( 2, 16 ) ) + ( b[ 1 ] * Math.pow( 2, 8 ) ) + b[ 0 ];

			if ( exponent === 1024 ) {

				if ( mantissa !== 0 ) {

					return NaN;

				} else {

					return sign * Infinity;

				}

			}

			if ( exponent === - 1023 ) {

				// Denormalized
				return sign * mantissa * Math.pow( 2, - 1022 - 52 );

			}

			return sign * ( 1 + mantissa * Math.pow( 2, - 52 ) ) * Math.pow( 2, exponent );

		},

		getFloat32: function ( byteOffset, littleEndian ) {

			var b = this._getBytes( 4, byteOffset, littleEndian ),

				sign = 1 - ( 2 * ( b[ 3 ] >> 7 ) ),
				exponent = ( ( ( b[ 3 ] << 1 ) & 0xff ) | ( b[ 2 ] >> 7 ) ) - 127,
				mantissa = ( ( b[ 2 ] & 0x7f ) << 16 ) | ( b[ 1 ] << 8 ) | b[ 0 ];

			if ( exponent === 128 ) {

				if ( mantissa !== 0 ) {

					return NaN;

				} else {

					return sign * Infinity;

				}

			}

			if ( exponent === - 127 ) {

				// Denormalized
				return sign * mantissa * Math.pow( 2, - 126 - 23 );

			}

			return sign * ( 1 + mantissa * Math.pow( 2, - 23 ) ) * Math.pow( 2, exponent );

		},

		getInt32: function ( byteOffset, littleEndian ) {

			var b = this._getBytes( 4, byteOffset, littleEndian );
			return ( b[ 3 ] << 24 ) | ( b[ 2 ] << 16 ) | ( b[ 1 ] << 8 ) | b[ 0 ];

		},

		getUint32: function ( byteOffset, littleEndian ) {

			return this.getInt32( byteOffset, littleEndian ) >>> 0;

		},

		getInt16: function ( byteOffset, littleEndian ) {

			return ( this.getUint16( byteOffset, littleEndian ) << 16 ) >> 16;

		},

		getUint16: function ( byteOffset, littleEndian ) {

			var b = this._getBytes( 2, byteOffset, littleEndian );
			return ( b[ 1 ] << 8 ) | b[ 0 ];

		},

		getInt8: function ( byteOffset ) {

			return ( this.getUint8( byteOffset ) << 24 ) >> 24;

		},

		getUint8: function ( byteOffset ) {

			return this._getBytes( 1, byteOffset )[ 0 ];

		}

	 };

}

// File:examples/js/loaders/UTF8Loader.js

/**
 * Loader for UTF8 version2 (after r51) encoded models generated by:
 *	http://code.google.com/p/webgl-loader/
 *
 * Code to load/decompress mesh is taken from r100 of this webgl-loader
 */

THREE.UTF8Loader = function () {};

/**
 * Load UTF8 encoded model
 * @param jsonUrl - URL from which to load json containing information about model
 * @param callback - Callback(THREE.Object3D) on successful loading of model
 * @param options - options on how to load model (see THREE.MTLLoader.MaterialCreator for basic options)
 *                  Additional options include
 *                   geometryBase: Base url from which to load referenced geometries
 *                   materialBase: Base url from which to load referenced textures
 */

THREE.UTF8Loader.prototype.load = function ( jsonUrl, callback, options ) {

	this.downloadModelJson( jsonUrl, callback, options );

};

// BufferGeometryCreator

THREE.UTF8Loader.BufferGeometryCreator = function () {
};

THREE.UTF8Loader.BufferGeometryCreator.prototype.create = function ( attribArray, indices ) {

	var ntris = indices.length / 3;

	var geometry = new THREE.BufferGeometry();

	var positions = new Float32Array( ntris * 3 * 3 );
	var normals = new Float32Array( ntris * 3 * 3 );
	var uvs = new Float32Array( ntris * 3 * 2 );

	var i, j, offset;

	var end = attribArray.length;
	var stride = 8;

	// extract positions

	j = 0;
	offset = 0;

	for ( i = offset; i < end; i += stride ) {

		positions[ j ++ ] = attribArray[ i     ];
		positions[ j ++ ] = attribArray[ i + 1 ];
		positions[ j ++ ] = attribArray[ i + 2 ];

	}

	// extract uvs

	j = 0;
	offset = 3;

	for ( i = offset; i < end; i += stride ) {

		uvs[ j ++ ] = attribArray[ i     ];
		uvs[ j ++ ] = attribArray[ i + 1 ];
	}

	// extract normals

	j = 0;
	offset = 5;

	for ( i = offset; i < end; i += stride ) {

		normals[ j ++ ] = attribArray[ i     ];
		normals[ j ++ ] = attribArray[ i + 1 ];
		normals[ j ++ ] = attribArray[ i + 2 ];

	}

	geometry.setIndex( new THREE.BufferAttribute( indices, 1 ) );
	geometry.addAttribute( 'position', new THREE.BufferAttribute( positions, 3 ) );
	geometry.addAttribute( 'normal', new THREE.BufferAttribute( normals, 3 ) );
	geometry.addAttribute( 'uv', new THREE.BufferAttribute( uvs, 2 ) );

	geometry.computeBoundingSphere();

	return geometry;

};


// UTF-8 decoder from webgl-loader (r100)
// http://code.google.com/p/webgl-loader/

// Model manifest description. Contains objects like:
// name: {
//   materials: { 'material_name': { ... } ... },
//   decodeParams: {
//     decodeOffsets: [ ... ],
//     decodeScales: [ ... ],
//   },
//   urls: {
//     'url': [
//       { material: 'material_name',
//         attribRange: [#, #],
//         indexRange: [#, #],
//         names: [ 'object names' ... ],
//         lengths: [#, #, # ... ]
//       }
//     ],
//     ...
//   }
// }

var DEFAULT_DECODE_PARAMS = {

    decodeOffsets: [ -4095, -4095, -4095, 0, 0, -511, -511, -511 ],
    decodeScales: [ 1 / 8191, 1 / 8191, 1 / 8191, 1 / 1023, 1 / 1023, 1 / 1023, 1 / 1023, 1 / 1023 ]

    // TODO: normal decoding? (see walt.js)
    // needs to know: input, output (from vertex format!)
    //
    // Should split attrib/index.
    // 1) Decode position and non-normal attributes.
    // 2) Decode indices, computing normals
    // 3) Maybe normalize normals? Only necessary for refinement, or fixed?
    // 4) Maybe refine normals? Should this be part of regular refinement?
    // 5) Morphing

};

// Triangle strips!

// TODO: will it be an optimization to specialize this method at
// runtime for different combinations of stride, decodeOffset and
// decodeScale?

THREE.UTF8Loader.prototype.decompressAttribsInner_ = function ( str, inputStart, inputEnd,
                                                                  output, outputStart, stride,
                                                                  decodeOffset, decodeScale ) {

	var prev = 0;

	for ( var j = inputStart; j < inputEnd; j ++ ) {

		var code = str.charCodeAt( j );
		prev += ( code >> 1 ) ^ ( -( code & 1 ) );

		output[ outputStart ] = decodeScale * ( prev + decodeOffset );
		outputStart += stride;

	}

};

THREE.UTF8Loader.prototype.decompressIndices_ = function( str, inputStart, numIndices,
                                                            output, outputStart ) {

	var highest = 0;

	for ( var i = 0; i < numIndices; i ++ ) {

		var code = str.charCodeAt( inputStart ++ );

		output[ outputStart ++ ] = highest - code;

		if ( code === 0 ) {

			highest ++;

		}

	}

};

THREE.UTF8Loader.prototype.decompressAABBs_ = function ( str, inputStart, numBBoxen,
                                                           decodeOffsets, decodeScales ) {
	var numFloats = 6 * numBBoxen;

	var inputEnd = inputStart + numFloats;
	var outputStart = 0;

	var bboxen = new Float32Array( numFloats );

	for ( var i = inputStart; i < inputEnd; i += 6 ) {

		var minX = str.charCodeAt(i + 0) + decodeOffsets[0];
		var minY = str.charCodeAt(i + 1) + decodeOffsets[1];
		var minZ = str.charCodeAt(i + 2) + decodeOffsets[2];

		var radiusX = (str.charCodeAt(i + 3) + 1) >> 1;
		var radiusY = (str.charCodeAt(i + 4) + 1) >> 1;
		var radiusZ = (str.charCodeAt(i + 5) + 1) >> 1;

		bboxen[ outputStart ++ ] = decodeScales[0] * (minX + radiusX);
		bboxen[ outputStart ++ ] = decodeScales[1] * (minY + radiusY);
		bboxen[ outputStart ++ ] = decodeScales[2] * (minZ + radiusZ);

		bboxen[ outputStart ++ ] = decodeScales[0] * radiusX;
		bboxen[ outputStart ++ ] = decodeScales[1] * radiusY;
		bboxen[ outputStart ++ ] = decodeScales[2] * radiusZ;

	}

	return bboxen;

};

THREE.UTF8Loader.prototype.decompressMesh =  function ( str, meshParams, decodeParams, name, idx, callback ) {

    // Extract conversion parameters from attribArrays.

	var stride = decodeParams.decodeScales.length;

	var decodeOffsets = decodeParams.decodeOffsets;
	var decodeScales = decodeParams.decodeScales;

	var attribStart = meshParams.attribRange[0];
	var numVerts = meshParams.attribRange[1];

    // Decode attributes.

	var inputOffset = attribStart;
	var attribsOut = new Float32Array( stride * numVerts );

	for (var j = 0; j < stride; j ++ ) {

		var end = inputOffset + numVerts;

		var decodeScale = decodeScales[j];

		if ( decodeScale ) {

            // Assume if decodeScale is never set, simply ignore the
            // attribute.

			this.decompressAttribsInner_( str, inputOffset, end,
                attribsOut, j, stride,
                decodeOffsets[j], decodeScale );
		}

		inputOffset = end;

	}

	var indexStart = meshParams.indexRange[ 0 ];
	var numIndices = 3 * meshParams.indexRange[ 1 ];

	var indicesOut = new Uint16Array( numIndices );

	this.decompressIndices_( str, inputOffset, numIndices, indicesOut, 0 );

    // Decode bboxen.

	var bboxen = undefined;
	var bboxOffset = meshParams.bboxes;

	if ( bboxOffset ) {

		bboxen = this.decompressAABBs_( str, bboxOffset, meshParams.names.length, decodeOffsets, decodeScales );
	}

	callback( name, idx, attribsOut, indicesOut, bboxen, meshParams );

};

THREE.UTF8Loader.prototype.copyAttrib = function ( stride, attribsOutFixed, lastAttrib, index ) {

	for ( var j = 0; j < stride; j ++ ) {

		lastAttrib[ j ] = attribsOutFixed[ stride * index + j ];

	}

};

THREE.UTF8Loader.prototype.decodeAttrib2 = function ( str, stride, decodeOffsets, decodeScales, deltaStart,
                                                        numVerts, attribsOut, attribsOutFixed, lastAttrib,
                                                        index ) {

	for ( var j = 0; j < 5; j ++ ) {

		var code = str.charCodeAt( deltaStart + numVerts * j + index );
		var delta = ( code >> 1) ^ (-(code & 1));

		lastAttrib[ j ] += delta;
		attribsOutFixed[ stride * index + j ] = lastAttrib[ j ];
		attribsOut[ stride * index + j ] = decodeScales[ j ] * ( lastAttrib[ j ] + decodeOffsets[ j ] );
	}

};

THREE.UTF8Loader.prototype.accumulateNormal = function ( i0, i1, i2, attribsOutFixed, crosses ) {

	var p0x = attribsOutFixed[ 8 * i0 ];
	var p0y = attribsOutFixed[ 8 * i0 + 1 ];
	var p0z = attribsOutFixed[ 8 * i0 + 2 ];

	var p1x = attribsOutFixed[ 8 * i1 ];
	var p1y = attribsOutFixed[ 8 * i1 + 1 ];
	var p1z = attribsOutFixed[ 8 * i1 + 2 ];

	var p2x = attribsOutFixed[ 8 * i2 ];
	var p2y = attribsOutFixed[ 8 * i2 + 1 ];
	var p2z = attribsOutFixed[ 8 * i2 + 2 ];

	p1x -= p0x;
	p1y -= p0y;
	p1z -= p0z;

	p2x -= p0x;
	p2y -= p0y;
	p2z -= p0z;

	p0x = p1y * p2z - p1z * p2y;
	p0y = p1z * p2x - p1x * p2z;
	p0z = p1x * p2y - p1y * p2x;

	crosses[ 3 * i0 ]     += p0x;
	crosses[ 3 * i0 + 1 ] += p0y;
	crosses[ 3 * i0 + 2 ] += p0z;

	crosses[ 3 * i1 ]     += p0x;
	crosses[ 3 * i1 + 1 ] += p0y;
	crosses[ 3 * i1 + 2 ] += p0z;

	crosses[ 3 * i2 ]     += p0x;
	crosses[ 3 * i2 + 1 ] += p0y;
	crosses[ 3 * i2 + 2 ] += p0z;

};

THREE.UTF8Loader.prototype.decompressMesh2 = function( str, meshParams, decodeParams, name, idx, callback ) {

	var MAX_BACKREF = 96;

    // Extract conversion parameters from attribArrays.

	var stride = decodeParams.decodeScales.length;

	var decodeOffsets = decodeParams.decodeOffsets;
	var decodeScales = decodeParams.decodeScales;

	var deltaStart = meshParams.attribRange[ 0 ];
	var numVerts = meshParams.attribRange[ 1 ];

	var codeStart = meshParams.codeRange[ 0 ];
	var codeLength = meshParams.codeRange[ 1 ];

	var numIndices = 3 * meshParams.codeRange[ 2 ];

	var indicesOut = new Uint16Array( numIndices );

	var crosses = new Int32Array( 3 * numVerts );

	var lastAttrib = new Uint16Array( stride );

	var attribsOutFixed = new Uint16Array( stride * numVerts );
	var attribsOut = new Float32Array( stride * numVerts );

	var highest = 0;
	var outputStart = 0;

	for ( var i = 0; i < numIndices; i += 3 ) {

		var code = str.charCodeAt( codeStart ++ );

		var max_backref = Math.min( i, MAX_BACKREF );

		if ( code < max_backref ) {

            // Parallelogram

			var winding = code % 3;
			var backref = i - ( code - winding );
			var i0, i1, i2;

			switch ( winding ) {

				case 0:

					i0 = indicesOut[ backref + 2 ];
					i1 = indicesOut[ backref + 1 ];
					i2 = indicesOut[ backref + 0 ];
					break;

				case 1:

					i0 = indicesOut[ backref + 0 ];
					i1 = indicesOut[ backref + 2 ];
					i2 = indicesOut[ backref + 1 ];
					break;

				case 2:

					i0 = indicesOut[ backref + 1 ];
					i1 = indicesOut[ backref + 0 ];
					i2 = indicesOut[ backref + 2 ];
					break;

			}

			indicesOut[ outputStart ++ ] = i0;
			indicesOut[ outputStart ++ ] = i1;

			code = str.charCodeAt( codeStart ++ );

			var index = highest - code;
			indicesOut[ outputStart ++ ] = index;

			if ( code === 0 ) {

				for (var j = 0; j < 5; j ++ ) {

					var deltaCode = str.charCodeAt( deltaStart + numVerts * j + highest );

					var prediction = ((deltaCode >> 1) ^ (-(deltaCode & 1))) +
                        attribsOutFixed[stride * i0 + j] +
                        attribsOutFixed[stride * i1 + j] -
                        attribsOutFixed[stride * i2 + j];

					lastAttrib[j] = prediction;

					attribsOutFixed[ stride * highest + j ] = prediction;
					attribsOut[ stride * highest + j ] = decodeScales[ j ] * ( prediction + decodeOffsets[ j ] );

				}

				highest ++;

			} else {

				this.copyAttrib( stride, attribsOutFixed, lastAttrib, index );

			}

			this.accumulateNormal( i0, i1, index, attribsOutFixed, crosses );

		} else {

            // Simple

			var index0 = highest - ( code - max_backref );

			indicesOut[ outputStart ++ ] = index0;

			if ( code === max_backref ) {

				this.decodeAttrib2( str, stride, decodeOffsets, decodeScales, deltaStart,
                    numVerts, attribsOut, attribsOutFixed, lastAttrib,
                    highest ++ );

			} else {

				this.copyAttrib(stride, attribsOutFixed, lastAttrib, index0);

			}

			code = str.charCodeAt( codeStart ++ );

			var index1 = highest - code;
			indicesOut[ outputStart ++ ] = index1;

			if ( code === 0 ) {

				this.decodeAttrib2( str, stride, decodeOffsets, decodeScales, deltaStart,
                    numVerts, attribsOut, attribsOutFixed, lastAttrib,
                    highest ++ );

			} else {

				this.copyAttrib( stride, attribsOutFixed, lastAttrib, index1 );

			}

			code = str.charCodeAt( codeStart ++ );

			var index2 = highest - code;
			indicesOut[ outputStart ++ ] = index2;

			if ( code === 0 ) {

				for ( var j = 0; j < 5; j ++ ) {

					lastAttrib[ j ] = ( attribsOutFixed[ stride * index0 + j ] + attribsOutFixed[ stride * index1 + j ] ) / 2;

				}

				this.decodeAttrib2( str, stride, decodeOffsets, decodeScales, deltaStart,
                    numVerts, attribsOut, attribsOutFixed, lastAttrib,
                    highest ++ );

			} else {

				this.copyAttrib( stride, attribsOutFixed, lastAttrib, index2 );

			}

			this.accumulateNormal( index0, index1, index2, attribsOutFixed, crosses );

		}

	}

	for ( var i = 0; i < numVerts; i ++ ) {

		var nx = crosses[ 3 * i ];
		var ny = crosses[ 3 * i + 1 ];
		var nz = crosses[ 3 * i + 2 ];

		var norm = 511.0 / Math.sqrt( nx * nx + ny * ny + nz * nz );

		var cx = str.charCodeAt( deltaStart + 5 * numVerts + i );
		var cy = str.charCodeAt( deltaStart + 6 * numVerts + i );
		var cz = str.charCodeAt( deltaStart + 7 * numVerts + i );

		attribsOut[ stride * i + 5 ] = norm * nx + ((cx >> 1) ^ (-(cx & 1)));
		attribsOut[ stride * i + 6 ] = norm * ny + ((cy >> 1) ^ (-(cy & 1)));
		attribsOut[ stride * i + 7 ] = norm * nz + ((cz >> 1) ^ (-(cz & 1)));
	}

	callback( name, idx, attribsOut, indicesOut, undefined, meshParams );

};

THREE.UTF8Loader.prototype.downloadMesh = function ( path, name, meshEntry, decodeParams, callback ) {

	var loader = this;
	var idx = 0;

	function onprogress( data ) {

		while ( idx < meshEntry.length ) {

			var meshParams = meshEntry[ idx ];
			var indexRange = meshParams.indexRange;

			if ( indexRange ) {

				var meshEnd = indexRange[ 0 ] + 3 * indexRange[ 1 ];

				if ( data.length < meshEnd ) break;

				loader.decompressMesh( data, meshParams, decodeParams, name, idx, callback );

			} else {

				var codeRange = meshParams.codeRange;
				var meshEnd = codeRange[ 0 ] + codeRange[ 1 ];

				if ( data.length < meshEnd ) break;

				loader.decompressMesh2( data, meshParams, decodeParams, name, idx, callback );
			}

			++ idx;

		}

	}

	getHttpRequest( path, function( data ) {

		onprogress( data );

        // TODO: handle errors.

	});

};

THREE.UTF8Loader.prototype.downloadMeshes = function ( path, meshUrlMap, decodeParams, callback ) {

	for ( var url in meshUrlMap ) {

		var meshEntry = meshUrlMap[url];
		this.downloadMesh( path + url, url, meshEntry, decodeParams, callback );

	}

};

THREE.UTF8Loader.prototype.createMeshCallback = function( materialBaseUrl, loadModelInfo, allDoneCallback ) {

	var nCompletedUrls = 0;
	var nExpectedUrls = 0;

	var expectedMeshesPerUrl = {};
	var decodedMeshesPerUrl = {};

	var modelParts = {};

	var meshUrlMap = loadModelInfo.urls;

	for ( var url in meshUrlMap ) {

		expectedMeshesPerUrl[ url ] = meshUrlMap[ url ].length;
		decodedMeshesPerUrl[ url ] = 0;

		nExpectedUrls ++;

		modelParts[ url ] = new THREE.Object3D();

	}

	var model = new THREE.Object3D();

    // Prepare materials first...

	var materialCreator = new THREE.MTLLoader.MaterialCreator( materialBaseUrl, loadModelInfo.options );
	materialCreator.setMaterials( loadModelInfo.materials );

	materialCreator.preload();

	// Create callback for creating mesh parts

	var bufferGeometryCreator = new THREE.UTF8Loader.BufferGeometryCreator();

	var meshCallback = function( name, idx, attribArray, indexArray, bboxen, meshParams ) {

        // Got ourselves a new mesh

        // name identifies this part of the model (url)
        // idx is the mesh index of this mesh of the part
        // attribArray defines the vertices
        // indexArray defines the faces
        // bboxen defines the bounding box
        // meshParams contains the material info

		var geometry = bufferGeometryCreator.create( attribArray, indexArray );
		var material = materialCreator.create( meshParams.material );

		var mesh = new THREE.Mesh( geometry, material );
		modelParts[ name ].add( mesh );

        //model.add(new THREE.Mesh(geometry, material));

		decodedMeshesPerUrl[ name ] ++;

		if ( decodedMeshesPerUrl[ name ] === expectedMeshesPerUrl[ name ] ) {

			nCompletedUrls ++;

			model.add( modelParts[ name ] );

			if ( nCompletedUrls === nExpectedUrls ) {

                // ALL DONE!!!

				allDoneCallback( model );

			}

		}

	};

	return meshCallback;

};

THREE.UTF8Loader.prototype.downloadModel = function ( geometryBase, materialBase, model, callback ) {

	var meshCallback = this.createMeshCallback( materialBase, model, callback );
	this.downloadMeshes( geometryBase, model.urls, model.decodeParams, meshCallback );

};

THREE.UTF8Loader.prototype.downloadModelJson = function ( jsonUrl, callback, options ) {

	getJsonRequest( jsonUrl, function( loaded ) {

		if ( ! loaded.decodeParams ) {

			if ( options && options.decodeParams ) {

				loaded.decodeParams = options.decodeParams;

			} else {

				loaded.decodeParams = DEFAULT_DECODE_PARAMS;

			}

		}

		loaded.options = options;

		var geometryBase = jsonUrl.substr( 0, jsonUrl.lastIndexOf( "/" ) + 1 );
		var materialBase = geometryBase;

		if ( options && options.geometryBase ) {

			geometryBase = options.geometryBase;

			if ( geometryBase.charAt( geometryBase.length - 1 ) !== "/" ) {

				geometryBase = geometryBase + "/";

			}

		}

		if ( options && options.materialBase ) {

			materialBase = options.materialBase;

			if ( materialBase.charAt( materialBase.length - 1 ) !== "/" ) {

				materialBase = materialBase  + "/";

			}

		}

		this.downloadModel( geometryBase, materialBase, loaded, callback );

	}.bind( this ) );

};

// XMLHttpRequest stuff

function getHttpRequest( url, onload, opt_onprogress ) {

	var req = new THREE.XHRLoader();
	req.load( url, onload, opt_onprogress );

}

function getJsonRequest( url, onjson ) {

	getHttpRequest( url,
        function( e ) { onjson( JSON.parse( e ) ); },
        function() {} );

}

function addListeners( dom, listeners ) {

    // TODO: handle event capture, object binding.

	for ( var key in listeners ) {

		dom.addEventListener( key, listeners[ key ] );

	}
}

// File:examples/js/loaders/VRMLLoader.js

/**
 * @author mrdoob / http://mrdoob.com/
 */

THREE.VRMLLoader = function ( manager ) {

	this.manager = ( manager !== undefined ) ? manager : THREE.DefaultLoadingManager;

};

THREE.VRMLLoader.prototype = {

	constructor: THREE.VRMLLoader,

	// for IndexedFaceSet support
	isRecordingPoints: false,
	isRecordingFaces: false,
	points: [],
	indexes : [],

	// for Background support
	isRecordingAngles: false,
	isRecordingColors: false,
	angles: [],
	colors: [],

	recordingFieldname: null,

	load: function ( url, onLoad, onProgress, onError ) {

		var scope = this;

		var loader = new THREE.XHRLoader( this.manager );
		loader.load( url, function ( text ) {

			onLoad( scope.parse( text ) );

		}, onProgress, onError );

	},

	setCrossOrigin: function ( value ) {

		this.crossOrigin = value;

	},

	parse: function ( data ) {

		var texturePath = this.texturePath || '';

		var textureLoader = new THREE.TextureLoader( this.manager );
		textureLoader.setCrossOrigin( this.crossOrigin );

		var parseV1 = function ( lines, scene ) {

			console.warn( 'VRML V1.0 not supported yet' );

		};

		var parseV2 = function ( lines, scene ) {

			var defines = {};
			var float_pattern = /(\b|\-|\+)([\d\.e]+)/;
			var float2_pattern = /([\d\.\+\-e]+)\s+([\d\.\+\-e]+)/g;
			var float3_pattern = /([\d\.\+\-e]+)\s+([\d\.\+\-e]+)\s+([\d\.\+\-e]+)/g;

			/**
			* Interpolates colors a and b following their relative distance
			* expressed by t.
			*
			* @param float a
			* @param float b
			* @param float t
			* @returns {Color}
			*/
			var interpolateColors = function( a, b, t ) {

				var deltaR = a.r - b.r;
				var deltaG = a.g - b.g;
				var deltaB = a.b - b.b;

				var c = new THREE.Color();

				c.r = a.r - t * deltaR;
				c.g = a.g - t * deltaG;
				c.b = a.b - t * deltaB;

				return c;

			};

			/**
			 * Vertically paints the faces interpolating between the
			 * specified colors at the specified angels. This is used for the Background
			 * node, but could be applied to other nodes with multiple faces as well.
			 *
			 * When used with the Background node, default is directionIsDown is true if
			 * interpolating the skyColor down from the Zenith. When interpolationg up from
			 * the Nadir i.e. interpolating the groundColor, the directionIsDown is false.
			 *
			 * The first angle is never specified, it is the Zenith (0 rad). Angles are specified
			 * in radians. The geometry is thought a sphere, but could be anything. The color interpolation
			 * is linear along the Y axis in any case.
			 *
			 * You must specify one more color than you have angles at the beginning of the colors array.
			 * This is the color of the Zenith (the top of the shape).
			 *
			 * @param geometry
			 * @param radius
			 * @param angles
			 * @param colors
			 * @param boolean directionIsDown Whether to work bottom up or top down.
			 */
			var paintFaces = function ( geometry, radius, angles, colors, directionIsDown ) {

				var f, n, p, vertexIndex, color;

				var direction = directionIsDown ? 1 : - 1;

				var faceIndices = [ 'a', 'b', 'c', 'd' ];

				var coord = [ ], aColor, bColor, t = 1, A = {}, B = {}, applyColor = false, colorIndex;

				for ( var k = 0; k < angles.length; k ++ ) {

					var vec = { };

					// push the vector at which the color changes
					vec.y = direction * ( Math.cos( angles[ k ] ) * radius );

					vec.x = direction * ( Math.sin( angles[ k ] ) * radius );

					coord.push( vec );

				}

				// painting the colors on the faces
				for ( var i = 0; i < geometry.faces.length ; i ++ ) {

					f  = geometry.faces[ i ];

					n = ( f instanceof THREE.Face3 ) ? 3 : 4;

					for ( var j = 0; j < n; j ++ ) {

						vertexIndex = f[ faceIndices[ j ] ];

						p = geometry.vertices[ vertexIndex ];

						for ( var index = 0; index < colors.length; index ++ ) {

							// linear interpolation between aColor and bColor, calculate proportion
							// A is previous point (angle)
							if ( index === 0 ) {

								A.x = 0;
								A.y = directionIsDown ? radius : - 1 * radius;

							} else {

								A.x = coord[ index - 1 ].x;
								A.y = coord[ index - 1 ].y;

							}

							// B is current point (angle)
							B = coord[ index ];

							if ( undefined !== B ) {

								// p has to be between the points A and B which we interpolate
								applyColor = directionIsDown ? p.y <= A.y && p.y > B.y : p.y >= A.y && p.y < B.y;

								if ( applyColor ) {

									bColor = colors[ index + 1 ];

									aColor = colors[ index ];

									// below is simple linear interpolation
									t = Math.abs( p.y - A.y ) / ( A.y - B.y );

									// to make it faster, you can only calculate this if the y coord changes, the color is the same for points with the same y
									color = interpolateColors( aColor, bColor, t );

									f.vertexColors[ j ] = color;

								}

							} else if ( undefined === f.vertexColors[ j ] ) {

								colorIndex = directionIsDown ? colors.length - 1 : 0;
								f.vertexColors[ j ] = colors[ colorIndex ];

							}

						}

					}

				}

			};

			var index = [];

			var parseProperty = function ( node, line ) {

				var parts = [], part, property = {}, fieldName;

				/**
				 * Expression for matching relevant information, such as a name or value, but not the separators
				 * @type {RegExp}
				 */
				var regex = /[^\s,\[\]]+/g;

				var point, angles, colors;

				while ( null != ( part = regex.exec( line ) ) ) {

					parts.push( part[ 0 ] );

				}

				fieldName = parts[ 0 ];


				// trigger several recorders
				switch ( fieldName ) {
					case 'skyAngle':
					case 'groundAngle':
						this.recordingFieldname = fieldName;
						this.isRecordingAngles = true;
						this.angles = [];
						break;
					case 'skyColor':
					case 'groundColor':
						this.recordingFieldname = fieldName;
						this.isRecordingColors = true;
						this.colors = [];
						break;
					case 'point':
						this.recordingFieldname = fieldName;
						this.isRecordingPoints = true;
						this.points = [];
						break;
					case 'coordIndex':
					case 'texCoordIndex':
						this.recordingFieldname = fieldName;
						this.isRecordingFaces = true;
						this.indexes = [];
				}

				if ( this.isRecordingFaces ) {

					// the parts hold the indexes as strings
					if ( parts.length > 0 ) {

						for ( var ind = 0; ind < parts.length; ind ++ ) {

							// the part should either be positive integer or -1
							if ( ! /(-?\d+)/.test( parts[ ind ] ) ) {

								continue;

							}

							// end of current face
							if ( parts[ ind ] === "-1" ) {

								if ( index.length > 0 ) {

									this.indexes.push( index );

								}

								// start new one
								index = [];

							} else {

								index.push( parseInt( parts[ ind ] ) );

							}

						}

					}

					// end
					if ( /]/.exec( line ) ) {

						if ( index.length > 0 ) {

							this.indexes.push( index );

						}

						// start new one
						index = [];

						this.isRecordingFaces = false;
						node[this.recordingFieldname] = this.indexes;

					}

				} else if ( this.isRecordingPoints ) {

					if ( node.nodeType == 'Coordinate' )

					while ( null !== ( parts = float3_pattern.exec( line ) ) ) {

						point = {
							x: parseFloat( parts[ 1 ] ),
							y: parseFloat( parts[ 2 ] ),
							z: parseFloat( parts[ 3 ] )
						};

						this.points.push( point );

					}

					if ( node.nodeType == 'TextureCoordinate' )

					while ( null !== ( parts = float2_pattern.exec( line ) ) ) {

						point = {
							x: parseFloat( parts[ 1 ] ),
							y: parseFloat( parts[ 2 ] )
						};

						this.points.push( point );

					}

					// end
					if ( /]/.exec( line ) ) {

						this.isRecordingPoints = false;
						node.points = this.points;

					}

				} else if ( this.isRecordingAngles ) {

					// the parts hold the angles as strings
					if ( parts.length > 0 ) {

						for ( var ind = 0; ind < parts.length; ind ++ ) {

							// the part should be a float
							if ( ! float_pattern.test( parts[ ind ] ) ) {

								continue;

							}

							this.angles.push( parseFloat( parts[ ind ] ) );

						}

					}

					// end
					if ( /]/.exec( line ) ) {

						this.isRecordingAngles = false;
						node[ this.recordingFieldname ] = this.angles;

					}

				} else if ( this.isRecordingColors ) {

					while ( null !== ( parts = float3_pattern.exec( line ) ) ) {

						color = {
							r: parseFloat( parts[ 1 ] ),
							g: parseFloat( parts[ 2 ] ),
							b: parseFloat( parts[ 3 ] )
						};

						this.colors.push( color );

					}

					// end
					if ( /]/.exec( line ) ) {

						this.isRecordingColors = false;
						node[ this.recordingFieldname ] = this.colors;

					}

				} else if ( parts[ parts.length - 1 ] !== 'NULL' && fieldName !== 'children' ) {

					switch ( fieldName ) {

						case 'diffuseColor':
						case 'emissiveColor':
						case 'specularColor':
						case 'color':

							if ( parts.length != 4 ) {

								console.warn( 'Invalid color format detected for ' + fieldName );
								break;

							}

							property = {
								r: parseFloat( parts[ 1 ] ),
								g: parseFloat( parts[ 2 ] ),
								b: parseFloat( parts[ 3 ] )
							};

							break;

						case 'translation':
						case 'scale':
						case 'size':
							if ( parts.length != 4 ) {

								console.warn( 'Invalid vector format detected for ' + fieldName );
								break;

							}

							property = {
								x: parseFloat( parts[ 1 ] ),
								y: parseFloat( parts[ 2 ] ),
								z: parseFloat( parts[ 3 ] )
							};

							break;

						case 'radius':
						case 'topRadius':
						case 'bottomRadius':
						case 'height':
						case 'transparency':
						case 'shininess':
						case 'ambientIntensity':
							if ( parts.length != 2 ) {

								console.warn( 'Invalid single float value specification detected for ' + fieldName );
								break;

							}

							property = parseFloat( parts[ 1 ] );

							break;

						case 'rotation':
							if ( parts.length != 5 ) {

								console.warn( 'Invalid quaternion format detected for ' + fieldName );
								break;

							}

							property = {
								x: parseFloat( parts[ 1 ] ),
								y: parseFloat( parts[ 2 ] ),
								z: parseFloat( parts[ 3 ] ),
								w: parseFloat( parts[ 4 ] )
							};

							break;

						case 'ccw':
						case 'solid':
						case 'colorPerVertex':
						case 'convex':
							if ( parts.length != 2 ) {

								console.warn( 'Invalid format detected for ' + fieldName );
								break;

							}

							property = parts[ 1 ] === 'TRUE' ? true : false;

							break;
					}

					node[ fieldName ] = property;

				}

				return property;

			};

			var getTree = function ( lines ) {

				var tree = { 'string': 'Scene', children: [] };
				var current = tree;
				var matches;
				var specification;

				for ( var i = 0; i < lines.length; i ++ ) {

					var comment = '';

					var line = lines[ i ];

					// omit whitespace only lines
					if ( null !== ( result = /^\s+?$/g.exec( line ) ) ) {

						continue;

					}

					line = line.trim();

					// skip empty lines
					if ( line === '' ) {

						continue;

					}

					if ( /#/.exec( line ) ) {

						var parts = line.split( '#' );

						// discard everything after the #, it is a comment
						line = parts[ 0 ];

						// well, let's also keep the comment
						comment = parts[ 1 ];

					}

					if ( matches = /([^\s]*){1}(?:\s+)?{/.exec( line ) ) {

						// first subpattern should match the Node name

						var block = { 'nodeType' : matches[ 1 ], 'string': line, 'parent': current, 'children': [], 'comment' : comment };
						current.children.push( block );
						current = block;

						if ( /}/.exec( line ) ) {

							// example: geometry Box { size 1 1 1 } # all on the same line
							specification = /{(.*)}/.exec( line )[ 1 ];

							// todo: remove once new parsing is complete?
							block.children.push( specification );

							parseProperty( current, specification );

							current = current.parent;

						}

					} else if ( /}/.exec( line ) ) {

						current = current.parent;

					} else if ( line !== '' ) {

						parseProperty( current, line );
						// todo: remove once new parsing is complete? we still do not parse geometry and appearance the new way
						current.children.push( line );

					}

				}

				return tree;

			};

			var parseNode = function ( data, parent ) {

				// console.log( data );

				if ( typeof data === 'string' ) {

					if ( /USE/.exec( data ) ) {

						var defineKey = /USE\s+?([^\s]+)/.exec( data )[ 1 ];

						if ( undefined == defines[ defineKey ] ) {

							console.warn( defineKey + ' is not defined.' );

						} else {

							if ( /appearance/.exec( data ) && defineKey ) {

								parent.material = defines[ defineKey ].clone();

							} else if ( /geometry/.exec( data ) && defineKey ) {

								parent.geometry = defines[ defineKey ].clone();

								// the solid property is not cloned with clone(), is only needed for VRML loading, so we need to transfer it
								if ( undefined !== defines[ defineKey ].solid && defines[ defineKey ].solid === false ) {

									parent.geometry.solid = false;
									parent.material.side = THREE.DoubleSide;

								}

							} else if ( defineKey ) {

								var object = defines[ defineKey ].clone();
								parent.add( object );

							}

						}

					}

					return;

				}

				var object = parent;

				if ( 'Transform' === data.nodeType || 'Group' === data.nodeType ) {

					object = new THREE.Object3D();

					if ( /DEF/.exec( data.string ) ) {

						object.name = /DEF\s+([^\s]+)/.exec( data.string )[ 1 ];
						defines[ object.name ] = object;

					}

					if ( undefined !== data[ 'translation' ] ) {

						var t = data.translation;

						object.position.set( t.x, t.y, t.z );

					}

					if ( undefined !== data.rotation ) {

						var r = data.rotation;

						object.quaternion.setFromAxisAngle( new THREE.Vector3( r.x, r.y, r.z ), r.w );

					}

					if ( undefined !== data.scale ) {

						var s = data.scale;

						object.scale.set( s.x, s.y, s.z );

					}

					parent.add( object );

				} else if ( 'Shape' === data.nodeType ) {

					object = new THREE.Mesh();

					if ( /DEF/.exec( data.string ) ) {

						object.name = /DEF\s+([^\s]+)/.exec( data.string )[ 1 ];

						defines[ object.name ] = object;

					}

					parent.add( object );

				} else if ( 'Background' === data.nodeType ) {

					var segments = 20;

					// sky (full sphere):

					var radius = 2e4;

					var skyGeometry = new THREE.SphereGeometry( radius, segments, segments );
					var skyMaterial = new THREE.MeshBasicMaterial( { fog: false, side: THREE.BackSide } );

					if ( data.skyColor.length > 1 ) {

						paintFaces( skyGeometry, radius, data.skyAngle, data.skyColor, true );

						skyMaterial.vertexColors = THREE.VertexColors

					} else {

						var color = data.skyColor[ 0 ];
						skyMaterial.color.setRGB( color.r, color.b, color.g );

					}

					scene.add( new THREE.Mesh( skyGeometry, skyMaterial ) );

					// ground (half sphere):

					if ( data.groundColor !== undefined ) {

						radius = 1.2e4;

						var groundGeometry = new THREE.SphereGeometry( radius, segments, segments, 0, 2 * Math.PI, 0.5 * Math.PI, 1.5 * Math.PI );
						var groundMaterial = new THREE.MeshBasicMaterial( { fog: false, side: THREE.BackSide, vertexColors: THREE.VertexColors } );

						paintFaces( groundGeometry, radius, data.groundAngle, data.groundColor, false );

						scene.add( new THREE.Mesh( groundGeometry, groundMaterial ) );

					}

				} else if ( /geometry/.exec( data.string ) ) {

					if ( 'Box' === data.nodeType ) {

						var s = data.size;

						parent.geometry = new THREE.BoxGeometry( s.x, s.y, s.z );

					} else if ( 'Cylinder' === data.nodeType ) {

						parent.geometry = new THREE.CylinderGeometry( data.radius, data.radius, data.height );

					} else if ( 'Cone' === data.nodeType ) {

						parent.geometry = new THREE.CylinderGeometry( data.topRadius, data.bottomRadius, data.height );

					} else if ( 'Sphere' === data.nodeType ) {

						parent.geometry = new THREE.SphereGeometry( data.radius );

					} else if ( 'IndexedFaceSet' === data.nodeType ) {

						var geometry = new THREE.Geometry();

						var indexes, uvIndexes, uvs;

						for ( var i = 0, j = data.children.length; i < j; i ++ ) {

							var child = data.children[ i ];

							var vec;

							if ( 'TextureCoordinate' === child.nodeType ) {

								uvs = child.points;

							}


							if ( 'Coordinate' === child.nodeType ) {

								if ( child.points ) {

									for ( var k = 0, l = child.points.length; k < l; k ++ ) {

										var point = child.points[ k ];

										vec = new THREE.Vector3( point.x, point.y, point.z );

										geometry.vertices.push( vec );

									}

								}

								if ( child.string.indexOf ( 'DEF' ) > -1 ) {

									var name = /DEF\s+([^\s]+)/.exec( child.string )[ 1 ];

									defines[ name ] = geometry.vertices;

								}

								if ( child.string.indexOf ( 'USE' ) > -1 ) {

									var defineKey = /USE\s+([^\s]+)/.exec( child.string )[ 1 ];

									geometry.vertices = defines[ defineKey ];
								}

							}

						}

						var skip = 0;

						// some shapes only have vertices for use in other shapes
						if ( data.coordIndex ) {

							// read this: http://math.hws.edu/eck/cs424/notes2013/16_Threejs_Advanced.html
							for ( var i = 0, j = data.coordIndex.length; i < j; i ++ ) {

								indexes = data.coordIndex[ i ]; if ( data.texCoordIndex ) uvIndexes = data.texCoordIndex[ i ];

								// vrml support multipoint indexed face sets (more then 3 vertices). You must calculate the composing triangles here
								skip = 0;

								// Face3 only works with triangles, but IndexedFaceSet allows shapes with more then three vertices, build them of triangles
								while ( indexes.length >= 3 && skip < ( indexes.length - 2 ) ) {

									var face = new THREE.Face3(
										indexes[ 0 ],
										indexes[ skip + (data.ccw ? 1 : 2) ],
										indexes[ skip + (data.ccw ? 2 : 1) ],
										null // normal, will be added later
										// todo: pass in the color, if a color index is present
									);

									if ( uvs && uvIndexes ) {
										geometry.faceVertexUvs [0].push( [
											new THREE.Vector2 (
												uvs[ uvIndexes[ 0 ] ].x ,
												uvs[ uvIndexes[ 0 ] ].y
											) ,
											new THREE.Vector2 (
												uvs[ uvIndexes[ skip + (data.ccw ? 1 : 2) ] ].x ,
												uvs[ uvIndexes[ skip + (data.ccw ? 1 : 2) ] ].y
											) ,
											new THREE.Vector2 (
												uvs[ uvIndexes[ skip + (data.ccw ? 2 : 1) ] ].x ,
												uvs[ uvIndexes[ skip + (data.ccw ? 2 : 1) ] ].y
											)
										] );
									}

									skip ++;

									geometry.faces.push( face );

								}


							}

						} else {

							// do not add dummy mesh to the scene
							parent.parent.remove( parent );

						}

						if ( false === data.solid ) {

							parent.material.side = THREE.DoubleSide;

						}

						// we need to store it on the geometry for use with defines
						geometry.solid = data.solid;

						geometry.computeFaceNormals();
						//geometry.computeVertexNormals(); // does not show
						geometry.computeBoundingSphere();

						// see if it's a define
						if ( /DEF/.exec( data.string ) ) {

							geometry.name = /DEF ([^\s]+)/.exec( data.string )[ 1 ];
							defines[ geometry.name ] = geometry;

						}

						parent.geometry = geometry;

					}

					return;

				} else if ( /appearance/.exec( data.string ) ) {

					for ( var i = 0; i < data.children.length; i ++ ) {

						var child = data.children[ i ];

						if ( 'Material' === child.nodeType ) {

							var material = new THREE.MeshPhongMaterial();

							if ( undefined !== child.diffuseColor ) {

								var d = child.diffuseColor;

								material.color.setRGB( d.r, d.g, d.b );

							}

							if ( undefined !== child.emissiveColor ) {

								var e = child.emissiveColor;

								material.emissive.setRGB( e.r, e.g, e.b );

							}

							if ( undefined !== child.specularColor ) {

								var s = child.specularColor;

								material.specular.setRGB( s.r, s.g, s.b );

							}

							if ( undefined !== child.transparency ) {

								var t = child.transparency;

								// transparency is opposite of opacity
								material.opacity = Math.abs( 1 - t );

								material.transparent = true;

							}

							if ( /DEF/.exec( data.string ) ) {

								material.name = /DEF ([^\s]+)/.exec( data.string )[ 1 ];

								defines[ material.name ] = material;

							}

							parent.material = material;

						}

						if ( 'ImageTexture' === child.nodeType ) {

							var textureName = /"([^"]+)"/.exec(child.children[ 0 ]);

							if (textureName) {

								parent.material.name = textureName[ 1 ];

								parent.material.map = textureLoader.load( texturePath + textureName[ 1 ] );

							}

						}

					}

					return;

				}

				for ( var i = 0, l = data.children.length; i < l; i ++ ) {

					var child = data.children[ i ];

					parseNode( data.children[ i ], object );

				}

			};

			parseNode( getTree( lines ), scene );

		};

		var scene = new THREE.Scene();

		var lines = data.split( '\n' );

		// some lines do not have breaks
		for (var i = lines.length -1; i > -1; i--) {

			// split lines with {..{ or {..[ - some have both
			if (/{.*[{\[]/.test (lines[i])) {
				var parts = lines[i].split ('{').join ('{\n').split ('\n');
				parts.unshift(1);
				parts.unshift(i);
				lines.splice.apply(lines, parts);
			} else

			// split lines with ]..}
			if (/\].*}/.test (lines[i])) {
				var parts = lines[i].split (']').join (']\n').split ('\n');
				parts.unshift(1);
				parts.unshift(i);
				lines.splice.apply(lines, parts);
			}

			// split lines with }..}
			if (/}.*}/.test (lines[i])) {
				var parts = lines[i].split ('}').join ('}\n').split ('\n');
				parts.unshift(1);
				parts.unshift(i);
				lines.splice.apply(lines, parts);
			}

			// force the parser to create Coordinate node for empty coords
			// coord USE something -> coord USE something Coordinate {}
			if((lines[i].indexOf ('coord') > -1) && (lines[i].indexOf ('[') < 0) && (lines[i].indexOf ('{') < 0)) {
				lines[i] += ' Coordinate {}';
			}
		}

		var header = lines.shift();

		if ( /V1.0/.exec( header ) ) {

			parseV1( lines, scene );

		} else if ( /V2.0/.exec( header ) ) {

			parseV2( lines, scene );

		}

		return scene;

	}

};

// File:examples/js/loaders/VTKLoader.js

/**
 * @author mrdoob / http://mrdoob.com/
 * @author Alex Pletzer
 */

THREE.VTKLoader = function( manager ) {

	this.manager = ( manager !== undefined ) ? manager : THREE.DefaultLoadingManager;

};

Object.assign( THREE.VTKLoader.prototype, THREE.EventDispatcher.prototype, {

	load: function ( url, onLoad, onProgress, onError ) {

		var scope = this;

		var loader = new THREE.XHRLoader( scope.manager );
		loader.setResponseType( 'arraybuffer' );
		loader.load( url, function( text ) {

			onLoad( scope.parse( text ) );

		}, onProgress, onError );

	},

	parse: function ( data ) {

		function parseASCII( data ) {

			// connectivity of the triangles
			var indices = [];

			// triangles vertices
			var positions = [];

			// red, green, blue colors in the range 0 to 1
			var colors = [];

			// normal vector, one per vertex
			var normals = [];

			var result;

			// pattern for reading vertices, 3 floats or integers
			var pat3Floats = /(\-?\d+\.?[\d\-\+e]*)\s+(\-?\d+\.?[\d\-\+e]*)\s+(\-?\d+\.?[\d\-\+e]*)/g;

			// pattern for connectivity, an integer followed by any number of ints
			// the first integer is the number of polygon nodes
			var patConnectivity = /^(\d+)\s+([\s\d]*)/;

			// indicates start of vertex data section
			var patPOINTS = /^POINTS /;

			// indicates start of polygon connectivity section
			var patPOLYGONS = /^POLYGONS /;

			// indicates start of triangle strips section
			var patTRIANGLE_STRIPS = /^TRIANGLE_STRIPS /;

			// POINT_DATA number_of_values
			var patPOINT_DATA = /^POINT_DATA[ ]+(\d+)/;

			// CELL_DATA number_of_polys
			var patCELL_DATA = /^CELL_DATA[ ]+(\d+)/;

			// Start of color section
			var patCOLOR_SCALARS = /^COLOR_SCALARS[ ]+(\w+)[ ]+3/;

			// NORMALS Normals float
			var patNORMALS = /^NORMALS[ ]+(\w+)[ ]+(\w+)/;

			var inPointsSection = false;
			var inPolygonsSection = false;
			var inTriangleStripSection = false;
			var inPointDataSection = false;
			var inCellDataSection = false;
			var inColorSection = false;
			var inNormalsSection = false;

			var lines = data.split( '\n' );

			for ( var i in lines ) {

				var line = lines[ i ];

				if ( inPointsSection ) {

					// get the vertices
					while ( ( result = pat3Floats.exec( line ) ) !== null ) {

						var x = parseFloat( result[ 1 ] );
						var y = parseFloat( result[ 2 ] );
						var z = parseFloat( result[ 3 ] );
						positions.push( x, y, z );

					}

				} else if ( inPolygonsSection ) {

					if ( ( result = patConnectivity.exec( line ) ) !== null ) {

						// numVertices i0 i1 i2 ...
						var numVertices = parseInt( result[ 1 ] );
						var inds = result[ 2 ].split( /\s+/ );

						if ( numVertices >= 3 ) {

							var i0 = parseInt( inds[ 0 ] );
							var i1, i2;
							var k = 1;
							// split the polygon in numVertices - 2 triangles
							for ( var j = 0; j < numVertices - 2; ++ j ) {

								i1 = parseInt( inds[ k ] );
								i2 = parseInt( inds[ k + 1 ] );
								indices.push( i0, i1, i2 );
								k ++;

							}

						}

					}

				} else if ( inTriangleStripSection ) {

					if ( ( result = patConnectivity.exec( line ) ) !== null ) {

						// numVertices i0 i1 i2 ...
						var numVertices = parseInt( result[ 1 ] );
						var inds = result[ 2 ].split( /\s+/ );

						if ( numVertices >= 3 ) {

							var i0, i1, i2;
							// split the polygon in numVertices - 2 triangles
							for ( var j = 0; j < numVertices - 2; j ++ ) {

								if ( j % 2 === 1 ) {

									i0 = parseInt( inds[ j ] );
									i1 = parseInt( inds[ j + 2 ] );
									i2 = parseInt( inds[ j + 1 ] );
									indices.push( i0, i1, i2 );

								} else {

									i0 = parseInt( inds[ j ] );
									i1 = parseInt( inds[ j + 1 ] );
									i2 = parseInt( inds[ j + 2 ] );
									indices.push( i0, i1, i2 );

								}

							}

						}

					}

				} else if ( inPointDataSection || inCellDataSection ) {

					if ( inColorSection ) {

						// Get the colors

						while ( ( result = pat3Floats.exec( line ) ) !== null ) {

							var r = parseFloat( result[ 1 ] );
							var g = parseFloat( result[ 2 ] );
							var b = parseFloat( result[ 3 ] );
							colors.push( r, g, b );

						}

					} else if ( inNormalsSection ) {

						// Get the normal vectors

						while ( ( result = pat3Floats.exec( line ) ) !== null ) {

							var nx = parseFloat( result[ 1 ] );
							var ny = parseFloat( result[ 2 ] );
							var nz = parseFloat( result[ 3 ] );
							normals.push( nx, ny, nz );

						}

					}

				}

				if ( patPOLYGONS.exec( line ) !== null ) {

					inPolygonsSection = true;
					inPointsSection = false;
					inTriangleStripSection = false;

				} else if ( patPOINTS.exec( line ) !== null ) {

					inPolygonsSection = false;
					inPointsSection = true;
					inTriangleStripSection = false;

				} else if ( patTRIANGLE_STRIPS.exec( line ) !== null ) {

					inPolygonsSection = false;
					inPointsSection = false;
					inTriangleStripSection = true;

				} else if ( patPOINT_DATA.exec( line ) !== null ) {

					inPointDataSection = true;
					inPointsSection = false;
					inPolygonsSection = false;
					inTriangleStripSection = false;

				} else if ( patCELL_DATA.exec( line ) !== null ) {

					inCellDataSection = true;
					inPointsSection = false;
					inPolygonsSection = false;
					inTriangleStripSection = false;

				} else if ( patCOLOR_SCALARS.exec( line ) !== null ) {

					inColorSection = true;
					inNormalsSection = false;
					inPointsSection = false;
					inPolygonsSection = false;
					inTriangleStripSection = false;

				} else if ( patNORMALS.exec( line ) !== null ) {

					inNormalsSection = true;
					inColorSection = false;
					inPointsSection = false;
					inPolygonsSection = false;
					inTriangleStripSection = false;

				}

			}

			var geometry;
			var stagger = 'point';

			if ( colors.length == indices.length ) {

				stagger = 'cell';

			}

			if ( stagger == 'point' ) {

				// Nodal. Use BufferGeometry
				geometry = new THREE.BufferGeometry();
				geometry.setIndex( new THREE.BufferAttribute( new Uint32Array( indices ), 1 ) );
				geometry.addAttribute( 'position', new THREE.BufferAttribute( new Float32Array( positions ), 3 ) );

				if ( colors.length == positions.length ) {

					geometry.addAttribute( 'color', new THREE.BufferAttribute( new Float32Array( colors ), 3 ) );

				}

				if ( normals.length == positions.length ) {

					geometry.addAttribute( 'normal', new THREE.BufferAttribute( new Float32Array( normals ), 3 ) );

				}

			} else {

				// Cell centered colors. The only way to attach a solid color to each triangle
				// is to use Geometry, which is less efficient than BufferGeometry
				geometry = new THREE.Geometry();

				var numTriangles = indices.length / 3;
				var numPoints = positions.length / 3;
				var va, vb, vc;
				var face;
				var ia, ib, ic;
				var x, y, z;
				var r, g, b;

				for ( var j = 0; j < numPoints; ++ j ) {

					x = positions[ 3 * j + 0 ];
					y = positions[ 3 * j + 1 ];
					z = positions[ 3 * j + 2 ];
					geometry.vertices.push( new THREE.Vector3( x, y, z ) );

				}

				for ( var i = 0; i < numTriangles; ++ i ) {

					ia = indices[ 3 * i + 0 ];
					ib = indices[ 3 * i + 1 ];
					ic = indices[ 3 * i + 2 ];
					geometry.faces.push( new THREE.Face3( ia, ib, ic ) );

				}

				if ( colors.length == numTriangles * 3 ) {

					for ( var i = 0; i < numTriangles; ++ i ) {

						face = geometry.faces[ i ];
						r = colors[ 3 * i + 0 ];
						g = colors[ 3 * i + 1 ];
						b = colors[ 3 * i + 2 ];
						face.color = new THREE.Color().setRGB( r, g, b );

					}

				}

			}

			return geometry;

		}

		function parseBinary( data ) {

			var count, pointIndex, i, numberOfPoints, pt, s;
			var buffer = new Uint8Array ( data );
			var dataView = new DataView ( data );

			// Points and normals, by default, are empty
			var points = [];
			var normals = [];
			var indices = [];

			// Going to make a big array of strings
			var vtk = [];
			var index = 0;

			function findString( buffer, start ) {

				var index = start;
				var c = buffer[ index ];
				var s = [];
				while ( c != 10 ) {

					s.push ( String.fromCharCode ( c ) );
					index ++;
					c = buffer[ index ];

				}

				return { start: start,
						end: index,
						next: index + 1,
						parsedString: s.join( '' ) };

			}

			var state, line;

			while ( true ) {

				// Get a string
				state = findString ( buffer, index );
				line = state.parsedString;

				if ( line.indexOf ( 'POINTS' ) === 0 ) {

					vtk.push ( line );
					// Add the points
					numberOfPoints = parseInt ( line.split( ' ' )[ 1 ], 10 );

					// Each point is 3 4-byte floats
					count = numberOfPoints * 4 * 3;

					points = new Float32Array( numberOfPoints * 3 );

					pointIndex = state.next;
					for ( i = 0; i < numberOfPoints; i ++ ) {

						points[ 3 * i ] = dataView.getFloat32( pointIndex, false );
						points[ 3 * i + 1 ] = dataView.getFloat32( pointIndex + 4, false );
						points[ 3 * i + 2 ] = dataView.getFloat32( pointIndex + 8, false );
						pointIndex = pointIndex + 12;

					}
					// increment our next pointer
					state.next = state.next + count + 1;

				} else if ( line.indexOf ( 'TRIANGLE_STRIPS' ) === 0 ) {

					var numberOfStrips = parseInt ( line.split( ' ' )[ 1 ], 10 );
					var size = parseInt ( line.split ( ' ' )[ 2 ], 10 );
					// 4 byte integers
					count = size * 4;

					indices = new Uint32Array( 3 * size - 9 * numberOfStrips );
					var indicesIndex = 0;

					pointIndex = state.next;
					for ( i = 0; i < numberOfStrips; i ++ ) {

						// For each strip, read the first value, then record that many more points
						var indexCount = dataView.getInt32( pointIndex, false );
						var strip = [];
						pointIndex += 4;
						for ( s = 0; s < indexCount; s ++ ) {

							strip.push ( dataView.getInt32( pointIndex, false ) );
							pointIndex += 4;

						}

						// retrieves the n-2 triangles from the triangle strip
						for ( var j = 0; j < indexCount - 2; j ++ ) {

							if ( j % 2 ) {

								indices[ indicesIndex ++ ] = strip[ j ];
								indices[ indicesIndex ++ ] = strip[ j + 2 ];
								indices[ indicesIndex ++ ] = strip[ j + 1 ];

							} else {


								indices[ indicesIndex ++ ] = strip[ j ];
								indices[ indicesIndex ++ ] = strip[ j + 1 ];
								indices[ indicesIndex ++ ] = strip[ j + 2 ];

							}

						}

					}
					// increment our next pointer
					state.next = state.next + count + 1;

				} else if ( line.indexOf ( 'POLYGONS' ) === 0 ) {

					var numberOfStrips = parseInt ( line.split( ' ' )[ 1 ], 10 );
					var size = parseInt ( line.split ( ' ' )[ 2 ], 10 );
					// 4 byte integers
					count = size * 4;

					indices = new Uint32Array( 3 * size - 9 * numberOfStrips );
					var indicesIndex = 0;

					pointIndex = state.next;
					for ( i = 0; i < numberOfStrips; i ++ ) {

						// For each strip, read the first value, then record that many more points
						var indexCount = dataView.getInt32( pointIndex, false );
						var strip = [];
						pointIndex += 4;
						for ( s = 0; s < indexCount; s ++ ) {

							strip.push ( dataView.getInt32( pointIndex, false ) );
							pointIndex += 4;

						}
						var i0 = strip[ 0 ];
						// divide the polygon in n-2 triangle
						for ( var j = 1; j < indexCount - 1; j ++ ) {

							indices[ indicesIndex ++ ] = strip[ 0 ];
							indices[ indicesIndex ++ ] = strip[ j ];
							indices[ indicesIndex ++ ] = strip[ j + 1 ];

						}

					}
					// increment our next pointer
					state.next = state.next + count + 1;

				} else if ( line.indexOf ( 'POINT_DATA' ) === 0 ) {

					numberOfPoints = parseInt ( line.split( ' ' )[ 1 ], 10 );

					// Grab the next line
					state = findString ( buffer, state.next );

					// Now grab the binary data
					count = numberOfPoints * 4 * 3;

					normals = new Float32Array( numberOfPoints * 3 );
					pointIndex = state.next;
					for ( i = 0; i < numberOfPoints; i ++ ) {

						normals[ 3 * i ] = dataView.getFloat32( pointIndex, false );
						normals[ 3 * i + 1 ] = dataView.getFloat32( pointIndex + 4, false );
						normals[ 3 * i + 2 ] = dataView.getFloat32( pointIndex + 8, false );
						pointIndex += 12;

					}

					// Increment past our data
					state.next = state.next + count;

				}

				// Increment index
				index = state.next;

				if ( index >= buffer.byteLength ) {

					break;

				}

			}

			var geometry = new THREE.BufferGeometry();
			geometry.setIndex( new THREE.BufferAttribute( indices, 1 ) );
			geometry.addAttribute( 'position', new THREE.BufferAttribute( points, 3 ) );

			if ( normals.length == points.length ) {

				geometry.addAttribute( 'normal', new THREE.BufferAttribute( normals, 3 ) );

			}

			return geometry;

		}

		function parseXML( stringFile ) {

			// Changes XML to JSON, based on https://davidwalsh.name/convert-xml-json

			function xmlToJson( xml ) {

				// Create the return object
				var obj = {};

				if ( xml.nodeType == 1 ) { // element

					// do attributes

					if ( xml.attributes ) {

						if ( xml.attributes.length > 0 ) {

							obj[ 'attributes' ] = {};

							for ( var j = 0; j < xml.attributes.length; j ++ ) {

								var attribute = xml.attributes.item( j );
								obj[ 'attributes' ][ attribute.nodeName ] = attribute.nodeValue.trim();

							}

						}

					}

				} else if ( xml.nodeType == 3 ) { // text

					obj = xml.nodeValue.trim();

				}

				// do children
				if ( xml.hasChildNodes() ) {

					for ( var i = 0; i < xml.childNodes.length; i ++ ) {

						var item = xml.childNodes.item( i );
						var nodeName = item.nodeName;

						if ( typeof( obj[ nodeName ] ) === 'undefined' ) {

							var tmp = xmlToJson( item );

							if ( tmp !== '' ) obj[ nodeName ] = tmp;

						} else {

							if ( typeof( obj[ nodeName ].push ) === 'undefined' ) {

								var old = obj[ nodeName ];
								obj[ nodeName ] = [ old ];

							}

							var tmp = xmlToJson( item );

							if ( tmp !== '' ) obj[ nodeName ].push( tmp );

						}

					}

				}

				return obj;

			}

			// Taken from Base64-js
			function Base64toByteArray( b64 ) {

				var Arr = typeof Uint8Array !== 'undefined' ? Uint8Array : Array;
				var i;
				var lookup = [];
				var revLookup = [];
				var code = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/';
				var len = code.length;

				for ( i = 0; i < len; i ++ ) {

					lookup[ i ] = code[ i ];

				}

				for ( i = 0; i < len; ++ i ) {

					revLookup[ code.charCodeAt( i ) ] = i;

				}

				revLookup[ '-'.charCodeAt( 0 ) ] = 62;
				revLookup[ '_'.charCodeAt( 0 ) ] = 63;

				var j, l, tmp, placeHolders, arr;
				var len = b64.length;

				if ( len % 4 > 0 ) {

					throw new Error( 'Invalid string. Length must be a multiple of 4' );

				}

				placeHolders = b64[ len - 2 ] === '=' ? 2 : b64[ len - 1 ] === '=' ? 1 : 0;
				arr = new Arr( len * 3 / 4 - placeHolders );
				l = placeHolders > 0 ? len - 4 : len;

				var L = 0;

				for ( i = 0, j = 0; i < l; i += 4, j += 3 ) {

					tmp = ( revLookup[ b64.charCodeAt( i ) ] << 18 ) | ( revLookup[ b64.charCodeAt( i + 1 ) ] << 12 ) | ( revLookup[ b64.charCodeAt( i + 2 ) ] << 6 ) | revLookup[ b64.charCodeAt( i + 3 ) ];
					arr[ L ++ ] = ( tmp & 0xFF0000 ) >> 16;
					arr[ L ++ ] = ( tmp & 0xFF00 ) >> 8;
					arr[ L ++ ] = tmp & 0xFF;

				}

				if ( placeHolders === 2 ) {

					tmp = ( revLookup[ b64.charCodeAt( i ) ] << 2 ) | ( revLookup[ b64.charCodeAt( i + 1 ) ] >> 4 );
					arr[ L ++ ] = tmp & 0xFF;

				} else if ( placeHolders === 1 ) {

					tmp = ( revLookup[ b64.charCodeAt( i ) ] << 10 ) | ( revLookup[ b64.charCodeAt( i + 1 ) ] << 4 ) | ( revLookup[ b64.charCodeAt( i + 2 ) ] >> 2 );
					arr[ L ++ ] = ( tmp >> 8 ) & 0xFF;
					arr[ L ++ ] = tmp & 0xFF;

				}

				return arr;

			}

			function parseDataArray( ele, compressed ) {

				// Check the format

				if ( ele.attributes.format == 'binary' ) {

					if ( compressed ) {

						// Split the blob_header and compressed Data
						if ( ele[ '#text' ].indexOf( '==' ) != - 1 ) {

							var data = ele[ '#text' ].split( '==' );

							// console.log( data );

							if ( data.length == 2 ) {

								var blob = data.shift();
								var content = data.shift();

								if ( content === '' ) {

									content = blob + '==';

								}

							} else if ( data.length > 2 ) {

								var blob = data.shift();
								var content = data.shift();
								content = content + '==';

							} else if ( data.length < 2 ) {

								var content = data.shift();
								content = content + '==';

							}

							// Convert to bytearray
							var arr = Base64toByteArray( content );

							// decompress
							var inflate = new Zlib.Inflate( arr, { resize: true, verify: true } );
							var content = inflate.decompress();

						} else {

							var content = Base64toByteArray( ele[ '#text' ] );

						}

					} else {

						var content = Base64toByteArray( ele[ '#text' ] );

					}

					var content = content.buffer;

				} else {

					if ( ele[ '#text' ] ) {

						var content = ele[ '#text' ].replace( /\n/g, ' ' ).split( ' ' ).filter( function ( el, idx, arr ) {

							if ( el !== '' ) return el;

						} );

					} else {

						var content = new Int32Array( 0 ).buffer;

					}

				}

				delete ele[ '#text' ];

				// Get the content and optimize it

				if ( ele.attributes.type == 'Float32' ) {

					var txt = new Float32Array( content );

					if ( ele.attributes.format == 'binary' ) {

						if ( ! compressed ) {

							txt = txt.filter( function( el, idx, arr ) {

								if ( idx !== 0 ) return true;

							} );

						}

					}

				} else if ( ele.attributes.type === 'Int64' ) {

					var txt = new Int32Array( content );

					if ( ele.attributes.format == 'binary' ) {

						if ( ! compressed ) {

							txt = txt.filter( function ( el, idx, arr ) {

								if ( idx !== 0 ) return true;

							} );

						}

						txt = txt.filter( function ( el, idx, arr ) {

							if ( idx % 2 !== 1 ) return true;

						} );

					}

				}

				// console.log( txt );

				return txt;

			}

			// Main part
			// Get Dom
			var dom = null;

			if ( window.DOMParser ) {

				try {

					dom = ( new DOMParser() ).parseFromString( stringFile, 'text/xml' );

				} catch ( e ) {

					dom = null;

				}

			} else if ( window.ActiveXObject ) {

				try {

					dom = new ActiveXObject( 'Microsoft.XMLDOM' );
					dom.async = false;

					if ( ! dom.loadXML( xml ) ) {

						throw new Error( dom.parseError.reason + dom.parseError.srcText );

					}

				} catch ( e ) {

					dom = null;

				}

			} else {

				throw new Error( 'Cannot parse xml string!' );

			}

			// Get the doc
			var doc = dom.documentElement;
			// Convert to json
			var json = xmlToJson( doc );
			var points = [];
			var normals = [];
			var indices = [];

			if ( json.PolyData ) {

				var piece = json.PolyData.Piece;
				var compressed = json.attributes.hasOwnProperty( 'compressor' );

				// Can be optimized
				// Loop through the sections
				var sections = [ 'PointData', 'Points', 'Strips', 'Polys' ];// +['CellData', 'Verts', 'Lines'];
				var sectionIndex = 0, numberOfSections = sections.length;

				while ( sectionIndex < numberOfSections ) {

					var section = piece[ sections[ sectionIndex ] ];

					// If it has a DataArray in it

					if ( section.DataArray ) {

						// Depending on the number of DataArrays

						if ( Object.prototype.toString.call( section.DataArray ) === '[object Array]' ) {

							var arr = section.DataArray;

						} else {

							var arr = [ section.DataArray ];

						}

						var dataArrayIndex = 0, numberOfDataArrays = arr.length;

						while ( dataArrayIndex < numberOfDataArrays ) {

							// Parse the DataArray
							arr[ dataArrayIndex ].text = parseDataArray( arr[ dataArrayIndex ], compressed );
							dataArrayIndex ++;

						}

						switch ( sections[ sectionIndex ] ) {

							// if iti is point data
							case 'PointData':

								var numberOfPoints = parseInt( piece.attributes.NumberOfPoints );
								var normalsName = section.attributes.Normals;

								if ( numberOfPoints > 0 ) {

									for ( var i = 0, len = arr.length; i < len; i ++ ) {

										if ( normalsName == arr[ i ].attributes.Name ) {

											var components = arr[ i ].attributes.NumberOfComponents;
											normals = new Float32Array( numberOfPoints * components );
											normals.set( arr[ i ].text, 0 );

										}

									}

								}

								// console.log('Normals', normals);

								break;

							// if it is points
							case 'Points':

								var numberOfPoints = parseInt( piece.attributes.NumberOfPoints );

								if ( numberOfPoints > 0 ) {

									var components = section.DataArray.attributes.NumberOfComponents;
									points = new Float32Array( numberOfPoints * components );
									points.set( section.DataArray.text, 0 );

								}

								// console.log('Points', points);

								break;

							// if it is strips
							case 'Strips':

								var numberOfStrips = parseInt( piece.attributes.NumberOfStrips );

								if ( numberOfStrips > 0 ) {

									var connectivity = new Int32Array( section.DataArray[ 0 ].text.length );
									var offset = new Int32Array( section.DataArray[ 1 ].text.length );
									connectivity.set( section.DataArray[ 0 ].text, 0 );
									offset.set( section.DataArray[ 1 ].text, 0 );

									var size = numberOfStrips + connectivity.length;
									indices = new Uint32Array( 3 * size - 9 * numberOfStrips );

									var indicesIndex = 0;

									for ( var i = 0,len = numberOfStrips; i < len; i ++ ) {

										var strip = [];

										for ( var s = 0, len1 = offset[ i ], len0 = 0; s < len1 - len0; s ++ ) {

											strip.push ( connectivity[ s ] );

											if ( i > 0 ) len0 = offset[ i - 1 ];

										}

										for ( var j = 0, len1 = offset[ i ], len0 = 0; j < len1 - len0 - 2; j ++ ) {

											if ( j % 2 ) {

												indices[ indicesIndex ++ ] = strip[ j ];
												indices[ indicesIndex ++ ] = strip[ j + 2 ];
												indices[ indicesIndex ++ ] = strip[ j + 1 ];

											} else {

												indices[ indicesIndex ++ ] = strip[ j ];
												indices[ indicesIndex ++ ] = strip[ j + 1 ];
												indices[ indicesIndex ++ ] = strip[ j + 2 ];

											}

											if ( i > 0 ) len0 = offset[ i - 1 ];

										}

									}

								}

								//console.log('Strips', indices);

								break;

							// if it is polys
							case 'Polys':

								var numberOfPolys = parseInt( piece.attributes.NumberOfPolys );

								if ( numberOfPolys > 0 ) {

									var connectivity = new Int32Array( section.DataArray[ 0 ].text.length );
									var offset = new Int32Array( section.DataArray[ 1 ].text.length );
									connectivity.set( section.DataArray[ 0 ].text, 0 );
									offset.set( section.DataArray[ 1 ].text, 0 );

									var size = numberOfPolys + connectivity.length;
									indices = new Uint32Array( 3 * size - 9 * numberOfPolys );
									var indicesIndex = 0, connectivityIndex = 0;
									var i = 0,len = numberOfPolys, len0 = 0;

									while ( i < len ) {

										var poly = [];
										var s = 0, len1 = offset[ i ];

										while ( s < len1 - len0 ) {

											poly.push( connectivity[ connectivityIndex ++ ] );
											s ++;

										}

										var j = 1;

										while ( j < len1 - len0 - 1 ) {

											indices[ indicesIndex ++ ] = poly[ 0 ];
											indices[ indicesIndex ++ ] = poly[ j ];
											indices[ indicesIndex ++ ] = poly[ j + 1 ];
											j ++;

										}

										i ++;
										len0 = offset[ i - 1 ];

									}

								}
								//console.log('Polys', indices);
								break;

							default:
								break;

						}

					}

					sectionIndex ++;

				}

				var geometry = new THREE.BufferGeometry();
				geometry.setIndex( new THREE.BufferAttribute( indices, 1 ) );
				geometry.addAttribute( 'position', new THREE.BufferAttribute( points, 3 ) );

				if ( normals.length == points.length ) {

					geometry.addAttribute( 'normal', new THREE.BufferAttribute( normals, 3 ) );

				}

				// console.log( json );

				return geometry;

			} else {

				// TODO for vtu,vti,and other xml formats

			}

		}

		function getStringFile( data ) {

			var stringFile = '';
			var charArray = new Uint8Array( data );
			var i = 0;
			var len = charArray.length;

			while ( len -- ) {

				stringFile += String.fromCharCode( charArray[ i ++ ] );

			}

			return stringFile;

		}

		// get the 5 first lines of the files to check if there is the key word binary
		var meta = String.fromCharCode.apply( null, new Uint8Array( data, 0, 250 ) ).split( '\n' );

		if ( meta[ 0 ].indexOf( 'xml' ) !== - 1 ) {

			return parseXML( getStringFile( data ) );

		} else if ( meta[ 2 ].includes( 'ASCII' ) ) {

			return parseASCII( getStringFile( data ) );

		} else {

			return parseBinary( data );

		}

	}

} );

// File:examples/js/loaders/ctm/lzma.js


var LZMA = LZMA || {};

// browserify support
if ( typeof module === 'object' ) {

	module.exports = LZMA;

}

LZMA.OutWindow = function() {
	this._windowSize = 0;
};

LZMA.OutWindow.prototype.create = function(windowSize) {
	if ( (!this._buffer) || (this._windowSize !== windowSize) ) {
		this._buffer = [];
	}
	this._windowSize = windowSize;
	this._pos = 0;
	this._streamPos = 0;
};

LZMA.OutWindow.prototype.flush = function() {
	var size = this._pos - this._streamPos;
	if (size !== 0) {
		while (size --) {
			this._stream.writeByte(this._buffer[this._streamPos ++]);
		}
		if (this._pos >= this._windowSize) {
			this._pos = 0;
		}
		this._streamPos = this._pos;
	}
};

LZMA.OutWindow.prototype.releaseStream = function() {
	this.flush();
	this._stream = null;
};

LZMA.OutWindow.prototype.setStream = function(stream) {
	this.releaseStream();
	this._stream = stream;
};

LZMA.OutWindow.prototype.init = function(solid) {
	if (!solid) {
		this._streamPos = 0;
		this._pos = 0;
	}
};

LZMA.OutWindow.prototype.copyBlock = function(distance, len) {
	var pos = this._pos - distance - 1;
	if (pos < 0) {
		pos += this._windowSize;
	}
	while (len --) {
		if (pos >= this._windowSize) {
			pos = 0;
		}
		this._buffer[this._pos ++] = this._buffer[pos ++];
		if (this._pos >= this._windowSize) {
			this.flush();
		}
	}
};

LZMA.OutWindow.prototype.putByte = function(b) {
	this._buffer[this._pos ++] = b;
	if (this._pos >= this._windowSize) {
		this.flush();
	}
};

LZMA.OutWindow.prototype.getByte = function(distance) {
	var pos = this._pos - distance - 1;
	if (pos < 0) {
		pos += this._windowSize;
	}
	return this._buffer[pos];
};

LZMA.RangeDecoder = function() {
};

LZMA.RangeDecoder.prototype.setStream = function(stream) {
	this._stream = stream;
};

LZMA.RangeDecoder.prototype.releaseStream = function() {
	this._stream = null;
};

LZMA.RangeDecoder.prototype.init = function() {
	var i = 5;

	this._code = 0;
	this._range = -1;
  
	while (i --) {
		this._code = (this._code << 8) | this._stream.readByte();
	}
};

LZMA.RangeDecoder.prototype.decodeDirectBits = function(numTotalBits) {
	var result = 0, i = numTotalBits, t;

	while (i --) {
		this._range >>>= 1;
		t = (this._code - this._range) >>> 31;
		this._code -= this._range & (t - 1);
		result = (result << 1) | (1 - t);

		if ( (this._range & 0xff000000) === 0) {
			this._code = (this._code << 8) | this._stream.readByte();
			this._range <<= 8;
		}
	}

	return result;
};

LZMA.RangeDecoder.prototype.decodeBit = function(probs, index) {
	var prob = probs[index],
      newBound = (this._range >>> 11) * prob;

	if ( (this._code ^ 0x80000000) < (newBound ^ 0x80000000) ) {
		this._range = newBound;
		probs[index] += (2048 - prob) >>> 5;
		if ( (this._range & 0xff000000) === 0) {
			this._code = (this._code << 8) | this._stream.readByte();
			this._range <<= 8;
		}
		return 0;
	}

	this._range -= newBound;
	this._code -= newBound;
	probs[index] -= prob >>> 5;
	if ( (this._range & 0xff000000) === 0) {
		this._code = (this._code << 8) | this._stream.readByte();
		this._range <<= 8;
	}
	return 1;
};

LZMA.initBitModels = function(probs, len) {
	while (len --) {
		probs[len] = 1024;
	}
};

LZMA.BitTreeDecoder = function(numBitLevels) {
	this._models = [];
	this._numBitLevels = numBitLevels;
};

LZMA.BitTreeDecoder.prototype.init = function() {
	LZMA.initBitModels(this._models, 1 << this._numBitLevels);
};

LZMA.BitTreeDecoder.prototype.decode = function(rangeDecoder) {
	var m = 1, i = this._numBitLevels;

	while (i --) {
		m = (m << 1) | rangeDecoder.decodeBit(this._models, m);
	}
	return m - (1 << this._numBitLevels);
};

LZMA.BitTreeDecoder.prototype.reverseDecode = function(rangeDecoder) {
	var m = 1, symbol = 0, i = 0, bit;

	for (; i < this._numBitLevels; ++ i) {
		bit = rangeDecoder.decodeBit(this._models, m);
		m = (m << 1) | bit;
		symbol |= bit << i;
	}
	return symbol;
};

LZMA.reverseDecode2 = function(models, startIndex, rangeDecoder, numBitLevels) {
	var m = 1, symbol = 0, i = 0, bit;

	for (; i < numBitLevels; ++ i) {
		bit = rangeDecoder.decodeBit(models, startIndex + m);
		m = (m << 1) | bit;
		symbol |= bit << i;
	}
	return symbol;
};

LZMA.LenDecoder = function() {
	this._choice = [];
	this._lowCoder = [];
	this._midCoder = [];
	this._highCoder = new LZMA.BitTreeDecoder(8);
	this._numPosStates = 0;
};

LZMA.LenDecoder.prototype.create = function(numPosStates) {
	for (; this._numPosStates < numPosStates; ++ this._numPosStates) {
		this._lowCoder[this._numPosStates] = new LZMA.BitTreeDecoder(3);
		this._midCoder[this._numPosStates] = new LZMA.BitTreeDecoder(3);
	}
};

LZMA.LenDecoder.prototype.init = function() {
	var i = this._numPosStates;
	LZMA.initBitModels(this._choice, 2);
	while (i --) {
		this._lowCoder[i].init();
		this._midCoder[i].init();
	}
	this._highCoder.init();
};

LZMA.LenDecoder.prototype.decode = function(rangeDecoder, posState) {
	if (rangeDecoder.decodeBit(this._choice, 0) === 0) {
		return this._lowCoder[posState].decode(rangeDecoder);
	}
	if (rangeDecoder.decodeBit(this._choice, 1) === 0) {
		return 8 + this._midCoder[posState].decode(rangeDecoder);
	}
	return 16 + this._highCoder.decode(rangeDecoder);
};

LZMA.Decoder2 = function() {
	this._decoders = [];
};

LZMA.Decoder2.prototype.init = function() {
	LZMA.initBitModels(this._decoders, 0x300);
};

LZMA.Decoder2.prototype.decodeNormal = function(rangeDecoder) {
	var symbol = 1;

	do {
		symbol = (symbol << 1) | rangeDecoder.decodeBit(this._decoders, symbol);
	}while (symbol < 0x100);

	return symbol & 0xff;
};

LZMA.Decoder2.prototype.decodeWithMatchByte = function(rangeDecoder, matchByte) {
	var symbol = 1, matchBit, bit;

	do {
		matchBit = (matchByte >> 7) & 1;
		matchByte <<= 1;
		bit = rangeDecoder.decodeBit(this._decoders, ( (1 + matchBit) << 8) + symbol);
		symbol = (symbol << 1) | bit;
		if (matchBit !== bit) {
			while (symbol < 0x100) {
				symbol = (symbol << 1) | rangeDecoder.decodeBit(this._decoders, symbol);
			}
			break;
		}
	}while (symbol < 0x100);

	return symbol & 0xff;
};

LZMA.LiteralDecoder = function() {
};

LZMA.LiteralDecoder.prototype.create = function(numPosBits, numPrevBits) {
	var i;

	if (this._coders
    && (this._numPrevBits === numPrevBits)
    && (this._numPosBits === numPosBits) ) {
		return;
	}
	this._numPosBits = numPosBits;
	this._posMask = (1 << numPosBits) - 1;
	this._numPrevBits = numPrevBits;

	this._coders = [];

	i = 1 << (this._numPrevBits + this._numPosBits);
	while (i --) {
		this._coders[i] = new LZMA.Decoder2();
	}
};

LZMA.LiteralDecoder.prototype.init = function() {
	var i = 1 << (this._numPrevBits + this._numPosBits);
	while (i --) {
		this._coders[i].init();
	}
};

LZMA.LiteralDecoder.prototype.getDecoder = function(pos, prevByte) {
	return this._coders[( (pos & this._posMask) << this._numPrevBits)
    + ( (prevByte & 0xff) >>> (8 - this._numPrevBits) )];
};

LZMA.Decoder = function() {
	this._outWindow = new LZMA.OutWindow();
	this._rangeDecoder = new LZMA.RangeDecoder();
	this._isMatchDecoders = [];
	this._isRepDecoders = [];
	this._isRepG0Decoders = [];
	this._isRepG1Decoders = [];
	this._isRepG2Decoders = [];
	this._isRep0LongDecoders = [];
	this._posSlotDecoder = [];
	this._posDecoders = [];
	this._posAlignDecoder = new LZMA.BitTreeDecoder(4);
	this._lenDecoder = new LZMA.LenDecoder();
	this._repLenDecoder = new LZMA.LenDecoder();
	this._literalDecoder = new LZMA.LiteralDecoder();
	this._dictionarySize = -1;
	this._dictionarySizeCheck = -1;

	this._posSlotDecoder[0] = new LZMA.BitTreeDecoder(6);
	this._posSlotDecoder[1] = new LZMA.BitTreeDecoder(6);
	this._posSlotDecoder[2] = new LZMA.BitTreeDecoder(6);
	this._posSlotDecoder[3] = new LZMA.BitTreeDecoder(6);
};

LZMA.Decoder.prototype.setDictionarySize = function(dictionarySize) {
	if (dictionarySize < 0) {
		return false;
	}
	if (this._dictionarySize !== dictionarySize) {
		this._dictionarySize = dictionarySize;
		this._dictionarySizeCheck = Math.max(this._dictionarySize, 1);
		this._outWindow.create( Math.max(this._dictionarySizeCheck, 4096) );
	}
	return true;
};

LZMA.Decoder.prototype.setLcLpPb = function(lc, lp, pb) {
	var numPosStates = 1 << pb;

	if (lc > 8 || lp > 4 || pb > 4) {
		return false;
	}

	this._literalDecoder.create(lp, lc);

	this._lenDecoder.create(numPosStates);
	this._repLenDecoder.create(numPosStates);
	this._posStateMask = numPosStates - 1;

	return true;
};

LZMA.Decoder.prototype.init = function() {
	var i = 4;

	this._outWindow.init(false);

	LZMA.initBitModels(this._isMatchDecoders, 192);
	LZMA.initBitModels(this._isRep0LongDecoders, 192);
	LZMA.initBitModels(this._isRepDecoders, 12);
	LZMA.initBitModels(this._isRepG0Decoders, 12);
	LZMA.initBitModels(this._isRepG1Decoders, 12);
	LZMA.initBitModels(this._isRepG2Decoders, 12);
	LZMA.initBitModels(this._posDecoders, 114);

	this._literalDecoder.init();

	while (i --) {
		this._posSlotDecoder[i].init();
	}

	this._lenDecoder.init();
	this._repLenDecoder.init();
	this._posAlignDecoder.init();
	this._rangeDecoder.init();
};

LZMA.Decoder.prototype.decode = function(inStream, outStream, outSize) {
	var state = 0, rep0 = 0, rep1 = 0, rep2 = 0, rep3 = 0, nowPos64 = 0, prevByte = 0,
      posState, decoder2, len, distance, posSlot, numDirectBits;

	this._rangeDecoder.setStream(inStream);
	this._outWindow.setStream(outStream);

	this.init();

	while (outSize < 0 || nowPos64 < outSize) {
		posState = nowPos64 & this._posStateMask;

		if (this._rangeDecoder.decodeBit(this._isMatchDecoders, (state << 4) + posState) === 0) {
			decoder2 = this._literalDecoder.getDecoder(nowPos64 ++, prevByte);

			if (state >= 7) {
				prevByte = decoder2.decodeWithMatchByte(this._rangeDecoder, this._outWindow.getByte(rep0) );
			}else {
				prevByte = decoder2.decodeNormal(this._rangeDecoder);
			}
			this._outWindow.putByte(prevByte);

			state = state < 4 ? 0 : state - (state < 10 ? 3 : 6);

		}else {

			if (this._rangeDecoder.decodeBit(this._isRepDecoders, state) === 1) {
				len = 0;
				if (this._rangeDecoder.decodeBit(this._isRepG0Decoders, state) === 0) {
					if (this._rangeDecoder.decodeBit(this._isRep0LongDecoders, (state << 4) + posState) === 0) {
						state = state < 7 ? 9 : 11;
						len = 1;
					}
				}else {
					if (this._rangeDecoder.decodeBit(this._isRepG1Decoders, state) === 0) {
						distance = rep1;
					}else {
						if (this._rangeDecoder.decodeBit(this._isRepG2Decoders, state) === 0) {
							distance = rep2;
						}else {
							distance = rep3;
							rep3 = rep2;
						}
						rep2 = rep1;
					}
					rep1 = rep0;
					rep0 = distance;
				}
				if (len === 0) {
					len = 2 + this._repLenDecoder.decode(this._rangeDecoder, posState);
					state = state < 7 ? 8 : 11;
				}
			}else {
				rep3 = rep2;
				rep2 = rep1;
				rep1 = rep0;

				len = 2 + this._lenDecoder.decode(this._rangeDecoder, posState);
				state = state < 7 ? 7 : 10;

				posSlot = this._posSlotDecoder[len <= 5 ? len - 2 : 3].decode(this._rangeDecoder);
				if (posSlot >= 4) {

					numDirectBits = (posSlot >> 1) - 1;
					rep0 = (2 | (posSlot & 1) ) << numDirectBits;

					if (posSlot < 14) {
						rep0 += LZMA.reverseDecode2(this._posDecoders,
                rep0 - posSlot - 1, this._rangeDecoder, numDirectBits);
					}else {
						rep0 += this._rangeDecoder.decodeDirectBits(numDirectBits - 4) << 4;
						rep0 += this._posAlignDecoder.reverseDecode(this._rangeDecoder);
						if (rep0 < 0) {
							if (rep0 === -1) {
								break;
							}
							return false;
						}
					}
				}else {
					rep0 = posSlot;
				}
			}

			if (rep0 >= nowPos64 || rep0 >= this._dictionarySizeCheck) {
				return false;
			}

			this._outWindow.copyBlock(rep0, len);
			nowPos64 += len;
			prevByte = this._outWindow.getByte(0);
		}
	}

	this._outWindow.flush();
	this._outWindow.releaseStream();
	this._rangeDecoder.releaseStream();

	return true;
};

LZMA.Decoder.prototype.setDecoderProperties = function(properties) {
	var value, lc, lp, pb, dictionarySize;

	if (properties.size < 5) {
		return false;
	}

	value = properties.readByte();
	lc = value % 9;
	value = ~~(value / 9);
	lp = value % 5;
	pb = ~~(value / 5);

	if ( !this.setLcLpPb(lc, lp, pb) ) {
		return false;
	}

	dictionarySize = properties.readByte();
	dictionarySize |= properties.readByte() << 8;
	dictionarySize |= properties.readByte() << 16;
	dictionarySize += properties.readByte() * 16777216;

	return this.setDictionarySize(dictionarySize);
};

LZMA.decompress = function(properties, inStream, outStream, outSize) {
	var decoder = new LZMA.Decoder();

	if ( !decoder.setDecoderProperties(properties) ) {
		throw "Incorrect stream properties";
	}

	if ( !decoder.decode(inStream, outStream, outSize) ) {
		throw "Error in data stream";
	}

	return true;
};

// File:examples/js/loaders/ctm/ctm.js

/*
Copyright (c) 2011 Juan Mellado

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in
all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
THE SOFTWARE.
*/

/*
References:
- "OpenCTM: The Open Compressed Triangle Mesh file format" by Marcus Geelnard
  http://openctm.sourceforge.net/
*/

var CTM = CTM || {};

// browserify support
if ( typeof module === 'object' ) {

	module.exports = CTM;

}

CTM.CompressionMethod = {
  RAW: 0x00574152,
  MG1: 0x0031474d,
  MG2: 0x0032474d
};

CTM.Flags = {
  NORMALS: 0x00000001
};

CTM.File = function(stream) {
	this.load(stream);
};

CTM.File.prototype.load = function(stream) {
	this.header = new CTM.FileHeader(stream);

	this.body = new CTM.FileBody(this.header);
  
	this.getReader().read(stream, this.body);
};

CTM.File.prototype.getReader = function() {
	var reader;

	switch (this.header.compressionMethod){
		case CTM.CompressionMethod.RAW:
			reader = new CTM.ReaderRAW();
			break;
		case CTM.CompressionMethod.MG1:
			reader = new CTM.ReaderMG1();
			break;
		case CTM.CompressionMethod.MG2:
			reader = new CTM.ReaderMG2();
			break;
	}

	return reader;
};

CTM.FileHeader = function(stream) {
	stream.readInt32(); //magic "OCTM"
	this.fileFormat = stream.readInt32();
	this.compressionMethod = stream.readInt32();
	this.vertexCount = stream.readInt32();
	this.triangleCount = stream.readInt32();
	this.uvMapCount = stream.readInt32();
	this.attrMapCount = stream.readInt32();
	this.flags = stream.readInt32();
	this.comment = stream.readString();
};

CTM.FileHeader.prototype.hasNormals = function() {
	return this.flags & CTM.Flags.NORMALS;
};

CTM.FileBody = function(header) {
	var i = header.triangleCount * 3,
      v = header.vertexCount * 3,
      n = header.hasNormals() ? header.vertexCount * 3 : 0,
      u = header.vertexCount * 2,
      a = header.vertexCount * 4,
      j = 0;

	var data = new ArrayBuffer(
    (i + v + n + (u * header.uvMapCount) + (a * header.attrMapCount) ) * 4);

	this.indices = new Uint32Array(data, 0, i);

	this.vertices = new Float32Array(data, i * 4, v);

	if ( header.hasNormals() ) {
		this.normals = new Float32Array(data, (i + v) * 4, n);
	}
  
	if (header.uvMapCount) {
		this.uvMaps = [];
		for (j = 0; j < header.uvMapCount; ++ j) {
			this.uvMaps[j] = { uv: new Float32Array(data,
        (i + v + n + (j * u) ) * 4, u) };
		}
	}
  
	if (header.attrMapCount) {
		this.attrMaps = [];
		for (j = 0; j < header.attrMapCount; ++ j) {
			this.attrMaps[j] = { attr: new Float32Array(data,
        (i + v + n + (u * header.uvMapCount) + (j * a) ) * 4, a) };
		}
	}
};

CTM.FileMG2Header = function(stream) {
	stream.readInt32(); //magic "MG2H"
	this.vertexPrecision = stream.readFloat32();
	this.normalPrecision = stream.readFloat32();
	this.lowerBoundx = stream.readFloat32();
	this.lowerBoundy = stream.readFloat32();
	this.lowerBoundz = stream.readFloat32();
	this.higherBoundx = stream.readFloat32();
	this.higherBoundy = stream.readFloat32();
	this.higherBoundz = stream.readFloat32();
	this.divx = stream.readInt32();
	this.divy = stream.readInt32();
	this.divz = stream.readInt32();
  
	this.sizex = (this.higherBoundx - this.lowerBoundx) / this.divx;
	this.sizey = (this.higherBoundy - this.lowerBoundy) / this.divy;
	this.sizez = (this.higherBoundz - this.lowerBoundz) / this.divz;
};

CTM.ReaderRAW = function() {
};

CTM.ReaderRAW.prototype.read = function(stream, body) {
	this.readIndices(stream, body.indices);
	this.readVertices(stream, body.vertices);
  
	if (body.normals) {
		this.readNormals(stream, body.normals);
	}
	if (body.uvMaps) {
		this.readUVMaps(stream, body.uvMaps);
	}
	if (body.attrMaps) {
		this.readAttrMaps(stream, body.attrMaps);
	}
};

CTM.ReaderRAW.prototype.readIndices = function(stream, indices) {
	stream.readInt32(); //magic "INDX"
	stream.readArrayInt32(indices);
};

CTM.ReaderRAW.prototype.readVertices = function(stream, vertices) {
	stream.readInt32(); //magic "VERT"
	stream.readArrayFloat32(vertices);
};

CTM.ReaderRAW.prototype.readNormals = function(stream, normals) {
	stream.readInt32(); //magic "NORM"
	stream.readArrayFloat32(normals);
};

CTM.ReaderRAW.prototype.readUVMaps = function(stream, uvMaps) {
	var i = 0;
	for (; i < uvMaps.length; ++ i) {
		stream.readInt32(); //magic "TEXC"

		uvMaps[i].name = stream.readString();
		uvMaps[i].filename = stream.readString();
		stream.readArrayFloat32(uvMaps[i].uv);
	}
};

CTM.ReaderRAW.prototype.readAttrMaps = function(stream, attrMaps) {
	var i = 0;
	for (; i < attrMaps.length; ++ i) {
		stream.readInt32(); //magic "ATTR"

		attrMaps[i].name = stream.readString();
		stream.readArrayFloat32(attrMaps[i].attr);
	}
};

CTM.ReaderMG1 = function() {
};

CTM.ReaderMG1.prototype.read = function(stream, body) {
	this.readIndices(stream, body.indices);
	this.readVertices(stream, body.vertices);
  
	if (body.normals) {
		this.readNormals(stream, body.normals);
	}
	if (body.uvMaps) {
		this.readUVMaps(stream, body.uvMaps);
	}
	if (body.attrMaps) {
		this.readAttrMaps(stream, body.attrMaps);
	}
};

CTM.ReaderMG1.prototype.readIndices = function(stream, indices) {
	stream.readInt32(); //magic "INDX"
	stream.readInt32(); //packed size
  
	var interleaved = new CTM.InterleavedStream(indices, 3);
	LZMA.decompress(stream, stream, interleaved, interleaved.data.length);

	CTM.restoreIndices(indices, indices.length);
};

CTM.ReaderMG1.prototype.readVertices = function(stream, vertices) {
	stream.readInt32(); //magic "VERT"
	stream.readInt32(); //packed size
  
	var interleaved = new CTM.InterleavedStream(vertices, 1);
	LZMA.decompress(stream, stream, interleaved, interleaved.data.length);
};

CTM.ReaderMG1.prototype.readNormals = function(stream, normals) {
	stream.readInt32(); //magic "NORM"
	stream.readInt32(); //packed size

	var interleaved = new CTM.InterleavedStream(normals, 3);
	LZMA.decompress(stream, stream, interleaved, interleaved.data.length);
};

CTM.ReaderMG1.prototype.readUVMaps = function(stream, uvMaps) {
	var i = 0;
	for (; i < uvMaps.length; ++ i) {
		stream.readInt32(); //magic "TEXC"

		uvMaps[i].name = stream.readString();
		uvMaps[i].filename = stream.readString();
    
		stream.readInt32(); //packed size

		var interleaved = new CTM.InterleavedStream(uvMaps[i].uv, 2);
		LZMA.decompress(stream, stream, interleaved, interleaved.data.length);
	}
};

CTM.ReaderMG1.prototype.readAttrMaps = function(stream, attrMaps) {
	var i = 0;
	for (; i < attrMaps.length; ++ i) {
		stream.readInt32(); //magic "ATTR"

		attrMaps[i].name = stream.readString();
    
		stream.readInt32(); //packed size

		var interleaved = new CTM.InterleavedStream(attrMaps[i].attr, 4);
		LZMA.decompress(stream, stream, interleaved, interleaved.data.length);
	}
};

CTM.ReaderMG2 = function() {
};

CTM.ReaderMG2.prototype.read = function(stream, body) {
	this.MG2Header = new CTM.FileMG2Header(stream);
  
	this.readVertices(stream, body.vertices);
	this.readIndices(stream, body.indices);
  
	if (body.normals) {
		this.readNormals(stream, body);
	}
	if (body.uvMaps) {
		this.readUVMaps(stream, body.uvMaps);
	}
	if (body.attrMaps) {
		this.readAttrMaps(stream, body.attrMaps);
	}
};

CTM.ReaderMG2.prototype.readVertices = function(stream, vertices) {
	stream.readInt32(); //magic "VERT"
	stream.readInt32(); //packed size

	var interleaved = new CTM.InterleavedStream(vertices, 3);
	LZMA.decompress(stream, stream, interleaved, interleaved.data.length);
  
	var gridIndices = this.readGridIndices(stream, vertices);
  
	CTM.restoreVertices(vertices, this.MG2Header, gridIndices, this.MG2Header.vertexPrecision);
};

CTM.ReaderMG2.prototype.readGridIndices = function(stream, vertices) {
	stream.readInt32(); //magic "GIDX"
	stream.readInt32(); //packed size
  
	var gridIndices = new Uint32Array(vertices.length / 3);
  
	var interleaved = new CTM.InterleavedStream(gridIndices, 1);
	LZMA.decompress(stream, stream, interleaved, interleaved.data.length);
  
	CTM.restoreGridIndices(gridIndices, gridIndices.length);
  
	return gridIndices;
};

CTM.ReaderMG2.prototype.readIndices = function(stream, indices) {
	stream.readInt32(); //magic "INDX"
	stream.readInt32(); //packed size

	var interleaved = new CTM.InterleavedStream(indices, 3);
	LZMA.decompress(stream, stream, interleaved, interleaved.data.length);

	CTM.restoreIndices(indices, indices.length);
};

CTM.ReaderMG2.prototype.readNormals = function(stream, body) {
	stream.readInt32(); //magic "NORM"
	stream.readInt32(); //packed size

	var interleaved = new CTM.InterleavedStream(body.normals, 3);
	LZMA.decompress(stream, stream, interleaved, interleaved.data.length);

	var smooth = CTM.calcSmoothNormals(body.indices, body.vertices);

	CTM.restoreNormals(body.normals, smooth, this.MG2Header.normalPrecision);
};

CTM.ReaderMG2.prototype.readUVMaps = function(stream, uvMaps) {
	var i = 0;
	for (; i < uvMaps.length; ++ i) {
		stream.readInt32(); //magic "TEXC"

		uvMaps[i].name = stream.readString();
		uvMaps[i].filename = stream.readString();
    
		var precision = stream.readFloat32();
    
		stream.readInt32(); //packed size

		var interleaved = new CTM.InterleavedStream(uvMaps[i].uv, 2);
		LZMA.decompress(stream, stream, interleaved, interleaved.data.length);
    
		CTM.restoreMap(uvMaps[i].uv, 2, precision);
	}
};

CTM.ReaderMG2.prototype.readAttrMaps = function(stream, attrMaps) {
	var i = 0;
	for (; i < attrMaps.length; ++ i) {
		stream.readInt32(); //magic "ATTR"

		attrMaps[i].name = stream.readString();
    
		var precision = stream.readFloat32();
    
		stream.readInt32(); //packed size

		var interleaved = new CTM.InterleavedStream(attrMaps[i].attr, 4);
		LZMA.decompress(stream, stream, interleaved, interleaved.data.length);
    
		CTM.restoreMap(attrMaps[i].attr, 4, precision);
	}
};

CTM.restoreIndices = function(indices, len) {
	var i = 3;
	if (len > 0) {
		indices[2] += indices[0];
		indices[1] += indices[0];
	}
	for (; i < len; i += 3) {
		indices[i] += indices[i - 3];
    
		if (indices[i] === indices[i - 3]) {
			indices[i + 1] += indices[i - 2];
		}else {
			indices[i + 1] += indices[i];
		}

		indices[i + 2] += indices[i];
	}
};

CTM.restoreGridIndices = function(gridIndices, len) {
	var i = 1;
	for (; i < len; ++ i) {
		gridIndices[i] += gridIndices[i - 1];
	}
};

CTM.restoreVertices = function(vertices, grid, gridIndices, precision) {
	var gridIdx, delta, x, y, z,
      intVertices = new Uint32Array(vertices.buffer, vertices.byteOffset, vertices.length),
      ydiv = grid.divx, zdiv = ydiv * grid.divy,
      prevGridIdx = 0x7fffffff, prevDelta = 0,
      i = 0, j = 0, len = gridIndices.length;

	for (; i < len; j += 3) {
		x = gridIdx = gridIndices[i ++];
    
		z = ~~(x / zdiv);
		x -= ~~(z * zdiv);
		y = ~~(x / ydiv);
		x -= ~~(y * ydiv);

		delta = intVertices[j];
		if (gridIdx === prevGridIdx) {
			delta += prevDelta;
		}

		vertices[j]     = grid.lowerBoundx +
      x * grid.sizex + precision * delta;
		vertices[j + 1] = grid.lowerBoundy +
      y * grid.sizey + precision * intVertices[j + 1];
		vertices[j + 2] = grid.lowerBoundz +
      z * grid.sizez + precision * intVertices[j + 2];

		prevGridIdx = gridIdx;
		prevDelta = delta;
	}
};

CTM.restoreNormals = function(normals, smooth, precision) {
	var ro, phi, theta, sinPhi,
      nx, ny, nz, by, bz, len,
      intNormals = new Uint32Array(normals.buffer, normals.byteOffset, normals.length),
      i = 0, k = normals.length,
      PI_DIV_2 = 3.141592653589793238462643 * 0.5;

	for (; i < k; i += 3) {
		ro = intNormals[i] * precision;
		phi = intNormals[i + 1];

		if (phi === 0) {
			normals[i]     = smooth[i]     * ro;
			normals[i + 1] = smooth[i + 1] * ro;
			normals[i + 2] = smooth[i + 2] * ro;
		}else {
      
			if (phi <= 4) {
				theta = (intNormals[i + 2] - 2) * PI_DIV_2;
			}else {
				theta = ( (intNormals[i + 2] * 4 / phi) - 2) * PI_DIV_2;
			}
      
			phi *= precision * PI_DIV_2;
			sinPhi = ro * Math.sin(phi);

			nx = sinPhi * Math.cos(theta);
			ny = sinPhi * Math.sin(theta);
			nz = ro * Math.cos(phi);

			bz = smooth[i + 1];
			by = smooth[i] - smooth[i + 2];

			len = Math.sqrt(2 * bz * bz + by * by);
			if (len > 1e-20) {
				by /= len;
				bz /= len;
			}

			normals[i]     = smooth[i]     * nz +
        (smooth[i + 1] * bz - smooth[i + 2] * by) * ny - bz * nx;
			normals[i + 1] = smooth[i + 1] * nz -
        (smooth[i + 2]      + smooth[i]   ) * bz  * ny + by * nx;
			normals[i + 2] = smooth[i + 2] * nz +
        (smooth[i]     * by + smooth[i + 1] * bz) * ny + bz * nx;
		}
	}
};

CTM.restoreMap = function(map, count, precision) {
	var delta, value,
      intMap = new Uint32Array(map.buffer, map.byteOffset, map.length),
      i = 0, j, len = map.length;

	for (; i < count; ++ i) {
		delta = 0;

		for (j = i; j < len; j += count) {
			value = intMap[j];
      
			delta += value & 1 ? -( (value + 1) >> 1) : value >> 1;
      
			map[j] = delta * precision;
		}
	}
};

CTM.calcSmoothNormals = function(indices, vertices) {
	var smooth = new Float32Array(vertices.length),
      indx, indy, indz, nx, ny, nz,
      v1x, v1y, v1z, v2x, v2y, v2z, len,
      i, k;

	for (i = 0, k = indices.length; i < k;) {
		indx = indices[i ++] * 3;
		indy = indices[i ++] * 3;
		indz = indices[i ++] * 3;

		v1x = vertices[indy]     - vertices[indx];
		v2x = vertices[indz]     - vertices[indx];
		v1y = vertices[indy + 1] - vertices[indx + 1];
		v2y = vertices[indz + 1] - vertices[indx + 1];
		v1z = vertices[indy + 2] - vertices[indx + 2];
		v2z = vertices[indz + 2] - vertices[indx + 2];
    
		nx = v1y * v2z - v1z * v2y;
		ny = v1z * v2x - v1x * v2z;
		nz = v1x * v2y - v1y * v2x;
    
		len = Math.sqrt(nx * nx + ny * ny + nz * nz);
		if (len > 1e-10) {
			nx /= len;
			ny /= len;
			nz /= len;
		}
    
		smooth[indx]     += nx;
		smooth[indx + 1] += ny;
		smooth[indx + 2] += nz;
		smooth[indy]     += nx;
		smooth[indy + 1] += ny;
		smooth[indy + 2] += nz;
		smooth[indz]     += nx;
		smooth[indz + 1] += ny;
		smooth[indz + 2] += nz;
	}

	for (i = 0, k = smooth.length; i < k; i += 3) {
		len = Math.sqrt(smooth[i] * smooth[i] + 
      smooth[i + 1] * smooth[i + 1] +
      smooth[i + 2] * smooth[i + 2]);

		if (len > 1e-10) {
			smooth[i]     /= len;
			smooth[i + 1] /= len;
			smooth[i + 2] /= len;
		}
	}

	return smooth;
};

CTM.isLittleEndian = (function() {
	var buffer = new ArrayBuffer(2),
      bytes = new Uint8Array(buffer),
      ints = new Uint16Array(buffer);

	bytes[0] = 1;

	return ints[0] === 1;
}());

CTM.InterleavedStream = function(data, count) {
	this.data = new Uint8Array(data.buffer, data.byteOffset, data.byteLength);
	this.offset = CTM.isLittleEndian ? 3 : 0;
	this.count = count * 4;
	this.len = this.data.length;
};

CTM.InterleavedStream.prototype.writeByte = function(value) {
	this.data[this.offset] = value;
  
	this.offset += this.count;
	if (this.offset >= this.len) {
  
		this.offset -= this.len - 4;
		if (this.offset >= this.count) {
    
			this.offset -= this.count + (CTM.isLittleEndian ? 1 : -1);
		}
	}
};

CTM.Stream = function(data) {
	this.data = data;
	this.offset = 0;
};

CTM.Stream.prototype.TWO_POW_MINUS23 = Math.pow(2, -23);

CTM.Stream.prototype.TWO_POW_MINUS126 = Math.pow(2, -126);

CTM.Stream.prototype.readByte = function() {
	return this.data[this.offset ++] & 0xff;
};

CTM.Stream.prototype.readInt32 = function() {
	var i = this.readByte();
	i |= this.readByte() << 8;
	i |= this.readByte() << 16;
	return i | (this.readByte() << 24);
};

CTM.Stream.prototype.readFloat32 = function() {
	var m = this.readByte();
	m += this.readByte() << 8;

	var b1 = this.readByte();
	var b2 = this.readByte();

	m += (b1 & 0x7f) << 16; 
	var e = ( (b2 & 0x7f) << 1) | ( (b1 & 0x80) >>> 7);
	var s = b2 & 0x80 ? -1 : 1;

	if (e === 255) {
		return m !== 0 ? NaN : s * Infinity;
	}
	if (e > 0) {
		return s * (1 + (m * this.TWO_POW_MINUS23) ) * Math.pow(2, e - 127);
	}
	if (m !== 0) {
		return s * m * this.TWO_POW_MINUS126;
	}
	return s * 0;
};

CTM.Stream.prototype.readString = function() {
	var len = this.readInt32();

	this.offset += len;

	return String.fromCharCode.apply(null, this.data.subarray(this.offset - len, this.offset));
};

CTM.Stream.prototype.readArrayInt32 = function(array) {
	var i = 0, len = array.length;
  
	while (i < len) {
		array[i ++] = this.readInt32();
	}

	return array;
};

CTM.Stream.prototype.readArrayFloat32 = function(array) {
	var i = 0, len = array.length;

	while (i < len) {
		array[i ++] = this.readFloat32();
	}

	return array;
};

// File:examples/js/loaders/ctm/CTMLoader.js

/**
 * Loader for CTM encoded models generated by OpenCTM tools:
 *	http://openctm.sourceforge.net/
 *
 * Uses js-openctm library by Juan Mellado
 *	http://code.google.com/p/js-openctm/
 *
 * @author alteredq / http://alteredqualia.com/
 */

THREE.CTMLoader = function () {

	THREE.Loader.call( this );

};

THREE.CTMLoader.prototype = Object.create( THREE.Loader.prototype );
THREE.CTMLoader.prototype.constructor = THREE.CTMLoader;

// Load multiple CTM parts defined in JSON

THREE.CTMLoader.prototype.loadParts = function( url, callback, parameters ) {

	parameters = parameters || {};

	var scope = this;

	var xhr = new XMLHttpRequest();

	var basePath = parameters.basePath ? parameters.basePath : this.extractUrlBase( url );

	xhr.onreadystatechange = function() {

		if ( xhr.readyState === 4 ) {

			if ( xhr.status === 200 || xhr.status === 0 ) {

				var jsonObject = JSON.parse( xhr.responseText );

				var materials = [], geometries = [], counter = 0;

				function callbackFinal( geometry ) {

					counter += 1;

					geometries.push( geometry );

					if ( counter === jsonObject.offsets.length ) {

						callback( geometries, materials );

					}

				}


				// init materials

				for ( var i = 0; i < jsonObject.materials.length; i ++ ) {

					materials[ i ] = scope.createMaterial( jsonObject.materials[ i ], basePath );

				}

				// load joined CTM file

				var partUrl = basePath + jsonObject.data;
				var parametersPart = { useWorker: parameters.useWorker, worker:parameters.worker, offsets: jsonObject.offsets };
				scope.load( partUrl, callbackFinal, parametersPart );

			}

		}

	};

	xhr.open( "GET", url, true );
	xhr.setRequestHeader( "Content-Type", "text/plain" );
	xhr.send( null );

};

// Load CTMLoader compressed models
//	- parameters
//		- url (required)
//		- callback (required)

THREE.CTMLoader.prototype.load = function( url, callback, parameters ) {

	parameters = parameters || {};

	var scope = this;

	var offsets = parameters.offsets !== undefined ? parameters.offsets : [ 0 ];

	var xhr = new XMLHttpRequest(),
		callbackProgress = null;

	var length = 0;

	xhr.onreadystatechange = function() {

		if ( xhr.readyState === 4 ) {

			if ( xhr.status === 200 || xhr.status === 0 ) {

				var binaryData = new Uint8Array(xhr.response);

				var s = Date.now();

				if ( parameters.useWorker ) {

					var worker = parameters.worker || new Worker( "js/loaders/ctm/CTMWorker.js" );

					worker.onmessage = function( event ) {

						var files = event.data;

						for ( var i = 0; i < files.length; i ++ ) {

							var ctmFile = files[ i ];

							var e1 = Date.now();
							// console.log( "CTM data parse time [worker]: " + (e1-s) + " ms" );

							scope.createModel( ctmFile, callback );

							var e = Date.now();
							console.log( "model load time [worker]: " + (e - e1) + " ms, total: " + (e - s));

						}


					};

					worker.postMessage( { "data": binaryData, "offsets": offsets } );

				} else {

					for ( var i = 0; i < offsets.length; i ++ ) {

						var stream = new CTM.Stream( binaryData );
						stream.offset = offsets[ i ];

						var ctmFile = new CTM.File( stream );

						scope.createModel( ctmFile, callback );

					}

					//var e = Date.now();
					//console.log( "CTM data parse time [inline]: " + (e-s) + " ms" );

				}

			} else {

				console.error( "Couldn't load [" + url + "] [" + xhr.status + "]" );

			}

		} else if ( xhr.readyState === 3 ) {

			if ( callbackProgress ) {

				if ( length === 0 ) {

					length = xhr.getResponseHeader( "Content-Length" );

				}

				callbackProgress( { total: length, loaded: xhr.responseText.length } );

			}

		} else if ( xhr.readyState === 2 ) {

			length = xhr.getResponseHeader( "Content-Length" );

		}

	};

	xhr.open( "GET", url, true );
	xhr.responseType = "arraybuffer";

	xhr.send( null );

};


THREE.CTMLoader.prototype.createModel = function ( file, callback ) {

	var Model = function () {

		THREE.BufferGeometry.call( this );

		this.materials = [];

		var indices = file.body.indices,
		positions = file.body.vertices,
		normals = file.body.normals;

		var uvs, colors;

		var uvMaps = file.body.uvMaps;

		if ( uvMaps !== undefined && uvMaps.length > 0 ) {

			uvs = uvMaps[ 0 ].uv;

		}

		var attrMaps = file.body.attrMaps;

		if ( attrMaps !== undefined && attrMaps.length > 0 && attrMaps[ 0 ].name === 'Color' ) {

			colors = attrMaps[ 0 ].attr;

		}

		this.setIndex( new THREE.BufferAttribute( indices, 1 ) );
		this.addAttribute( 'position', new THREE.BufferAttribute( positions, 3 ) );

		if ( normals !== undefined ) {

			this.addAttribute( 'normal', new THREE.BufferAttribute( normals, 3 ) );

		}

		if ( uvs !== undefined ) {

			this.addAttribute( 'uv', new THREE.BufferAttribute( uvs, 2 ) );

		}

		if ( colors !== undefined ) {

			this.addAttribute( 'color', new THREE.BufferAttribute( colors, 4 ) );

		}

	};

	Model.prototype = Object.create( THREE.BufferGeometry.prototype );
	Model.prototype.constructor = Model;

	var geometry = new Model();

	// compute vertex normals if not present in the CTM model
	if ( geometry.attributes.normal === undefined ) {
		geometry.computeVertexNormals();
	}

	callback( geometry );

};

// File:examples/js/exporters/OBJExporter.js

/**
 * @author mrdoob / http://mrdoob.com/
 */

THREE.OBJExporter = function () {};

THREE.OBJExporter.prototype = {

	constructor: THREE.OBJExporter,

	parse: function ( object ) {

		var output = '';

		var indexVertex = 0;
		var indexVertexUvs = 0;
		var indexNormals = 0;

		var vertex = new THREE.Vector3();
		var normal = new THREE.Vector3();
		var uv = new THREE.Vector2();

		var i, j, l, m, face = [];

		var parseMesh = function ( mesh ) {

			var nbVertex = 0;
			var nbNormals = 0;
			var nbVertexUvs = 0;

			var geometry = mesh.geometry;

			var normalMatrixWorld = new THREE.Matrix3();

			if ( geometry instanceof THREE.Geometry ) {

				geometry = new THREE.BufferGeometry().setFromObject( mesh );

			}

			if ( geometry instanceof THREE.BufferGeometry ) {

				// shortcuts
				var vertices = geometry.getAttribute( 'position' );
				var normals = geometry.getAttribute( 'normal' );
				var uvs = geometry.getAttribute( 'uv' );
				var indices = geometry.getIndex();

				// name of the mesh object
				output += 'o ' + mesh.name + '\n';

				// vertices

				if( vertices !== undefined ) {

					for ( i = 0, l = vertices.count; i < l; i ++, nbVertex++ ) {

						vertex.x = vertices.getX( i );
						vertex.y = vertices.getY( i );
						vertex.z = vertices.getZ( i );

						// transfrom the vertex to world space
						vertex.applyMatrix4( mesh.matrixWorld );

						// transform the vertex to export format
						output += 'v ' + vertex.x + ' ' + vertex.y + ' ' + vertex.z + '\n';

					}

				}

				// uvs

				if( uvs !== undefined ) {

					for ( i = 0, l = uvs.count; i < l; i ++, nbVertexUvs++ ) {

						uv.x = uvs.getX( i );
						uv.y = uvs.getY( i );

						// transform the uv to export format
						output += 'vt ' + uv.x + ' ' + uv.y + '\n';

					}

				}

				// normals

				if( normals !== undefined ) {

					normalMatrixWorld.getNormalMatrix( mesh.matrixWorld );

					for ( i = 0, l = normals.count; i < l; i ++, nbNormals++ ) {

						normal.x = normals.getX( i );
						normal.y = normals.getY( i );
						normal.z = normals.getZ( i );

						// transfrom the normal to world space
						normal.applyMatrix3( normalMatrixWorld );

						// transform the normal to export format
						output += 'vn ' + normal.x + ' ' + normal.y + ' ' + normal.z + '\n';

					}

				}

				// faces

				if( indices !== null ) {

					for ( i = 0, l = indices.count; i < l; i += 3 ) {

						for( m = 0; m < 3; m ++ ){

							j = indices.getX( i + m ) + 1;

							face[ m ] = ( indexVertex + j ) + '/' + ( uvs ? ( indexVertexUvs + j ) : '' ) + '/' + ( indexNormals + j );

						}

						// transform the face to export format
						output += 'f ' + face.join( ' ' ) + "\n";

					}

				} else {

					for ( i = 0, l = vertices.count; i < l; i += 3 ) {

						for( m = 0; m < 3; m ++ ){

							j = i + m + 1;

							face[ m ] = ( indexVertex + j ) + '/' + ( uvs ? ( indexVertexUvs + j ) : '' ) + '/' + ( indexNormals + j );

						}

						// transform the face to export format
						output += 'f ' + face.join( ' ' ) + "\n";

					}

				}

			} else {

				console.warn( 'THREE.OBJExporter.parseMesh(): geometry type unsupported', geometry );

			}

			// update index
			indexVertex += nbVertex;
			indexVertexUvs += nbVertexUvs;
			indexNormals += nbNormals;

		};

		var parseLine = function( line ) {

			var nbVertex = 0;

			var geometry = line.geometry;
			var type = line.type;

			if ( geometry instanceof THREE.Geometry ) {

				geometry = new THREE.BufferGeometry().setFromObject( line );

			}

			if ( geometry instanceof THREE.BufferGeometry ) {

				// shortcuts
				var vertices = geometry.getAttribute( 'position' );
				var indices = geometry.getIndex();

				// name of the line object
				output += 'o ' + line.name + '\n';

				if( vertices !== undefined ) {

					for ( i = 0, l = vertices.count; i < l; i ++, nbVertex++ ) {

						vertex.x = vertices.getX( i );
						vertex.y = vertices.getY( i );
						vertex.z = vertices.getZ( i );

						// transfrom the vertex to world space
						vertex.applyMatrix4( line.matrixWorld );

						// transform the vertex to export format
						output += 'v ' + vertex.x + ' ' + vertex.y + ' ' + vertex.z + '\n';

					}

				}

				if ( type === 'Line' ) {

					output += 'l ';

					for ( j = 1, l = vertices.count; j <= l; j++ ) {

						output += ( indexVertex + j ) + ' ';

					}

					output += '\n';

				}

				if ( type === 'LineSegments' ) {

					for ( j = 1, k = j + 1, l = vertices.count; j < l; j += 2, k = j + 1 ) {

						output += 'l ' + ( indexVertex + j ) + ' ' + ( indexVertex + k ) + '\n';

					}

				}

			} else {

				console.warn('THREE.OBJExporter.parseLine(): geometry type unsupported', geometry );

			}

			// update index
			indexVertex += nbVertex;

		};

		object.traverse( function ( child ) {

			if ( child instanceof THREE.Mesh ) {

				parseMesh( child );

			}

			if ( child instanceof THREE.Line ) {

				parseLine( child );

			}

		} );

		return output;

	}

};

// File:examples/js/exporters/STLExporter.js

/**
 * @author kovacsv / http://kovacsv.hu/
 * @author mrdoob / http://mrdoob.com/
 */

THREE.STLExporter = function () {};

THREE.STLExporter.prototype = {

	constructor: THREE.STLExporter,

	parse: ( function () {

		var vector = new THREE.Vector3();
		var normalMatrixWorld = new THREE.Matrix3();

		return function parse( scene ) {

			var output = '';

			output += 'solid exported\n';

			scene.traverse( function ( object ) {

				if ( object instanceof THREE.Mesh ) {

					var geometry = object.geometry;
					var matrixWorld = object.matrixWorld;

					if ( geometry instanceof THREE.Geometry ) {

						var vertices = geometry.vertices;
						var faces = geometry.faces;

						normalMatrixWorld.getNormalMatrix( matrixWorld );

						for ( var i = 0, l = faces.length; i < l; i ++ ) {

							var face = faces[ i ];

							vector.copy( face.normal ).applyMatrix3( normalMatrixWorld ).normalize();

							output += '\tfacet normal ' + vector.x + ' ' + vector.y + ' ' + vector.z + '\n';
							output += '\t\touter loop\n';

							var indices = [ face.a, face.b, face.c ];

							for ( var j = 0; j < 3; j ++ ) {

								vector.copy( vertices[ indices[ j ] ] ).applyMatrix4( matrixWorld );

								output += '\t\t\tvertex ' + vector.x + ' ' + vector.y + ' ' + vector.z + '\n';

							}

							output += '\t\tendloop\n';
							output += '\tendfacet\n';

						}

					}

				}

			} );

			output += 'endsolid exported\n';

			return output;

		};

	}() )

};

// File:examples/js/loaders/deprecated/SceneLoader.js

/**
 * @author alteredq / http://alteredqualia.com/
 */

THREE.SceneLoader = function ( manager ) {

	this.onLoadStart = function () {};
	this.onLoadProgress = function() {};
	this.onLoadComplete = function () {};

	this.callbackSync = function () {};
	this.callbackProgress = function () {};

	this.geometryHandlers = {};
	this.hierarchyHandlers = {};

	this.addGeometryHandler( "ascii", THREE.JSONLoader );

	this.manager = ( manager !== undefined ) ? manager : THREE.DefaultLoadingManager;

};

THREE.SceneLoader.prototype = {

	constructor: THREE.SceneLoader,

	load: function ( url, onLoad, onProgress, onError ) {

		var scope = this;

		var loader = new THREE.XHRLoader( scope.manager );
		loader.load( url, function ( text ) {

			scope.parse( JSON.parse( text ), onLoad, url );

		}, onProgress, onError );

	},

	addGeometryHandler: function ( typeID, loaderClass ) {

		this.geometryHandlers[ typeID ] = { "loaderClass": loaderClass };

	},

	addHierarchyHandler: function ( typeID, loaderClass ) {

		this.hierarchyHandlers[ typeID ] = { "loaderClass": loaderClass };

	},

	parse: function ( json, callbackFinished, url ) {

		var scope = this;

		var urlBase = THREE.Loader.prototype.extractUrlBase( url );

		var geometry, material, camera, fog,
			texture, images, color,
			light, hex, intensity,
			counter_models, counter_textures,
			total_models, total_textures,
			result;

		var target_array = [];

		var data = json;

		// async geometry loaders

		for ( var typeID in this.geometryHandlers ) {

			var loaderClass = this.geometryHandlers[ typeID ][ "loaderClass" ];
			this.geometryHandlers[ typeID ][ "loaderObject" ] = new loaderClass();

		}

		// async hierachy loaders

		for ( var typeID in this.hierarchyHandlers ) {

			var loaderClass = this.hierarchyHandlers[ typeID ][ "loaderClass" ];
			this.hierarchyHandlers[ typeID ][ "loaderObject" ] = new loaderClass();

		}

		counter_models = 0;
		counter_textures = 0;

		result = {

			scene: new THREE.Scene(),
			geometries: {},
			face_materials: {},
			materials: {},
			textures: {},
			objects: {},
			cameras: {},
			lights: {},
			fogs: {},
			empties: {},
			groups: {}

		};

		if ( data.transform ) {

			var position = data.transform.position,
				rotation = data.transform.rotation,
				scale = data.transform.scale;

			if ( position ) {

				result.scene.position.fromArray( position );

			}

			if ( rotation ) {

				result.scene.rotation.fromArray( rotation );

			}

			if ( scale ) {

				result.scene.scale.fromArray( scale );

			}

			if ( position || rotation || scale ) {

				result.scene.updateMatrix();
				result.scene.updateMatrixWorld();

			}

		}

		function get_url( source_url, url_type ) {

			if ( url_type == "relativeToHTML" ) {

				return source_url;

			} else {

				return urlBase + source_url;

			}

		}

		// toplevel loader function, delegates to handle_children

		function handle_objects() {

			handle_children( result.scene, data.objects );

		}

		// handle all the children from the loaded json and attach them to given parent

		function handle_children( parent, children ) {

			var mat, dst, pos, rot, scl, quat;

			for ( var objID in children ) {

				// check by id if child has already been handled,
				// if not, create new object

				var object = result.objects[ objID ];
				var objJSON = children[ objID ];

				if ( object === undefined ) {

					// meshes

					if ( objJSON.type && ( objJSON.type in scope.hierarchyHandlers ) ) {

						if ( objJSON.loading === undefined ) {

							material = result.materials[ objJSON.material ];

							objJSON.loading = true;

							var loader = scope.hierarchyHandlers[ objJSON.type ][ "loaderObject" ];

							// ColladaLoader

							if ( loader.options ) {

								loader.load( get_url( objJSON.url, data.urlBaseType ), create_callback_hierachy( objID, parent, material, objJSON ) );

							// UTF8Loader
							// OBJLoader

							} else {

								loader.load( get_url( objJSON.url, data.urlBaseType ), create_callback_hierachy( objID, parent, material, objJSON ) );

							}

						}

					} else if ( objJSON.geometry !== undefined ) {

						geometry = result.geometries[ objJSON.geometry ];

						// geometry already loaded

						if ( geometry ) {

							material = result.materials[ objJSON.material ];

							pos = objJSON.position;
							rot = objJSON.rotation;
							scl = objJSON.scale;
							mat = objJSON.matrix;
							quat = objJSON.quaternion;

							// use materials from the model file
							// if there is no material specified in the object

							if ( ! objJSON.material ) {

								material = new THREE.MultiMaterial( result.face_materials[ objJSON.geometry ] );

							}

							// use materials from the model file
							// if there is just empty face material
							// (must create new material as each model has its own face material)

							if ( ( material instanceof THREE.MultiMaterial ) && material.materials.length === 0 ) {

								material = new THREE.MultiMaterial( result.face_materials[ objJSON.geometry ] );

							}

							if ( objJSON.skin ) {

								object = new THREE.SkinnedMesh( geometry, material );

							} else if ( objJSON.morph ) {

								object = new THREE.MorphAnimMesh( geometry, material );

								if ( objJSON.duration !== undefined ) {

									object.duration = objJSON.duration;

								}

								if ( objJSON.time !== undefined ) {

									object.time = objJSON.time;

								}

								if ( objJSON.mirroredLoop !== undefined ) {

									object.mirroredLoop = objJSON.mirroredLoop;

								}

								if ( material.morphNormals ) {

									geometry.computeMorphNormals();

								}

							} else {

								object = new THREE.Mesh( geometry, material );

							}

							object.name = objID;

							if ( mat ) {

								object.matrixAutoUpdate = false;
								object.matrix.set(
									mat[ 0 ],  mat[ 1 ],  mat[ 2 ],  mat[ 3 ],
									mat[ 4 ],  mat[ 5 ],  mat[ 6 ],  mat[ 7 ],
									mat[ 8 ],  mat[ 9 ],  mat[ 10 ], mat[ 11 ],
									mat[ 12 ], mat[ 13 ], mat[ 14 ], mat[ 15 ]
								);

							} else {

								object.position.fromArray( pos );

								if ( quat ) {

									object.quaternion.fromArray( quat );

								} else {

									object.rotation.fromArray( rot );

								}

								object.scale.fromArray( scl );

							}

							object.visible = objJSON.visible;
							object.castShadow = objJSON.castShadow;
							object.receiveShadow = objJSON.receiveShadow;

							parent.add( object );

							result.objects[ objID ] = object;

						}

					// lights

					} else if ( objJSON.type === "AmbientLight" || objJSON.type === "PointLight" ||
						objJSON.type === "DirectionalLight" || objJSON.type === "SpotLight" ||
						objJSON.type === "HemisphereLight" ) {

						var color = objJSON.color;
						var intensity = objJSON.intensity;
						var distance = objJSON.distance;
						var position = objJSON.position;
						var rotation = objJSON.rotation;

						switch ( objJSON.type ) {

							case 'AmbientLight':
								light = new THREE.AmbientLight( color );
								break;

							case 'PointLight':
								light = new THREE.PointLight( color, intensity, distance );
								light.position.fromArray( position );
								break;

							case 'DirectionalLight':
								light = new THREE.DirectionalLight( color, intensity );
								light.position.fromArray( objJSON.direction );
								break;

							case 'SpotLight':
								light = new THREE.SpotLight( color, intensity, distance );
								light.angle = objJSON.angle;
								light.position.fromArray( position );
								light.target.set( position[ 0 ], position[ 1 ] - distance, position[ 2 ] );
								light.target.applyEuler( new THREE.Euler( rotation[ 0 ], rotation[ 1 ], rotation[ 2 ], 'XYZ' ) );
								break;

							case 'HemisphereLight':
								light = new THREE.DirectionalLight( color, intensity, distance );
								light.target.set( position[ 0 ], position[ 1 ] - distance, position[ 2 ] );
								light.target.applyEuler( new THREE.Euler( rotation[ 0 ], rotation[ 1 ], rotation[ 2 ], 'XYZ' ) );
								break;

						}

						parent.add( light );

						light.name = objID;
						result.lights[ objID ] = light;
						result.objects[ objID ] = light;

					// cameras

					} else if ( objJSON.type === "PerspectiveCamera" || objJSON.type === "OrthographicCamera" ) {

						pos = objJSON.position;
						rot = objJSON.rotation;
						quat = objJSON.quaternion;

						if ( objJSON.type === "PerspectiveCamera" ) {

							camera = new THREE.PerspectiveCamera( objJSON.fov, objJSON.aspect, objJSON.near, objJSON.far );

						} else if ( objJSON.type === "OrthographicCamera" ) {

							camera = new THREE.OrthographicCamera( objJSON.left, objJSON.right, objJSON.top, objJSON.bottom, objJSON.near, objJSON.far );

						}

						camera.name = objID;
						camera.position.fromArray( pos );

						if ( quat !== undefined ) {

							camera.quaternion.fromArray( quat );

						} else if ( rot !== undefined ) {

							camera.rotation.fromArray( rot );

						} else if ( objJSON.target ) {

							camera.lookAt( new THREE.Vector3().fromArray( objJSON.target ) );

						}

						parent.add( camera );

						result.cameras[ objID ] = camera;
						result.objects[ objID ] = camera;

					// pure Object3D

					} else {

						pos = objJSON.position;
						rot = objJSON.rotation;
						scl = objJSON.scale;
						quat = objJSON.quaternion;

						object = new THREE.Object3D();
						object.name = objID;
						object.position.fromArray( pos );

						if ( quat ) {

							object.quaternion.fromArray( quat );

						} else {

							object.rotation.fromArray( rot );

						}

						object.scale.fromArray( scl );
						object.visible = ( objJSON.visible !== undefined ) ? objJSON.visible : false;

						parent.add( object );

						result.objects[ objID ] = object;
						result.empties[ objID ] = object;

					}

					if ( object ) {

						if ( objJSON.userData !== undefined ) {

							for ( var key in objJSON.userData ) {

								var value = objJSON.userData[ key ];
								object.userData[ key ] = value;

							}

						}

						if ( objJSON.groups !== undefined ) {

							for ( var i = 0; i < objJSON.groups.length; i ++ ) {

								var groupID = objJSON.groups[ i ];

								if ( result.groups[ groupID ] === undefined ) {

									result.groups[ groupID ] = [];

								}

								result.groups[ groupID ].push( objID );

							}

						}

					}

				}

				if ( object !== undefined && objJSON.children !== undefined ) {

					handle_children( object, objJSON.children );

				}

			}

		}

		function handle_mesh( geo, mat, id ) {

			result.geometries[ id ] = geo;
			result.face_materials[ id ] = mat;
			handle_objects();

		}

		function handle_hierarchy( node, id, parent, material, obj ) {

			var p = obj.position;
			var r = obj.rotation;
			var q = obj.quaternion;
			var s = obj.scale;

			node.position.fromArray( p );

			if ( q ) {

				node.quaternion.fromArray( q );

			} else {

				node.rotation.fromArray( r );

			}

			node.scale.fromArray( s );

			// override children materials
			// if object material was specified in JSON explicitly

			if ( material ) {

				node.traverse( function ( child ) {

					child.material = material;

				} );

			}

			// override children visibility
			// with root node visibility as specified in JSON

			var visible = ( obj.visible !== undefined ) ? obj.visible : true;

			node.traverse( function ( child ) {

				child.visible = visible;

			} );

			parent.add( node );

			node.name = id;

			result.objects[ id ] = node;
			handle_objects();

		}

		function create_callback_geometry( id ) {

			return function ( geo, mat ) {

				geo.name = id;

				handle_mesh( geo, mat, id );

				counter_models -= 1;

				scope.onLoadComplete();

				async_callback_gate();

			}

		}

		function create_callback_hierachy( id, parent, material, obj ) {

			return function ( event ) {

				var result;

				// loaders which use EventDispatcher

				if ( event.content ) {

					result = event.content;

				// ColladaLoader

				} else if ( event.dae ) {

					result = event.scene;


				// UTF8Loader

				} else {

					result = event;

				}

				handle_hierarchy( result, id, parent, material, obj );

				counter_models -= 1;

				scope.onLoadComplete();

				async_callback_gate();

			}

		}

		function create_callback_embed( id ) {

			return function ( geo, mat ) {

				geo.name = id;

				result.geometries[ id ] = geo;
				result.face_materials[ id ] = mat;

			}

		}

		function async_callback_gate() {

			var progress = {

				totalModels : total_models,
				totalTextures : total_textures,
				loadedModels : total_models - counter_models,
				loadedTextures : total_textures - counter_textures

			};

			scope.callbackProgress( progress, result );

			scope.onLoadProgress();

			if ( counter_models === 0 && counter_textures === 0 ) {

				finalize();
				callbackFinished( result );

			}

		}

		function finalize() {

			// take care of targets which could be asynchronously loaded objects

			for ( var i = 0; i < target_array.length; i ++ ) {

				var ta = target_array[ i ];

				var target = result.objects[ ta.targetName ];

				if ( target ) {

					ta.object.target = target;

				} else {

					// if there was error and target of specified name doesn't exist in the scene file
					// create instead dummy target
					// (target must be added to scene explicitly as parent is already added)

					ta.object.target = new THREE.Object3D();
					result.scene.add( ta.object.target );

				}

				ta.object.target.userData.targetInverse = ta.object;

			}

		}

		var callbackTexture = function ( count ) {

			counter_textures -= count;
			async_callback_gate();

			scope.onLoadComplete();

		};

		// must use this instead of just directly calling callbackTexture
		// because of closure in the calling context loop

		var generateTextureCallback = function ( count ) {

			return function () {

				callbackTexture( count );

			};

		};

		function traverse_json_hierarchy( objJSON, callback ) {

			callback( objJSON );

			if ( objJSON.children !== undefined ) {

				for ( var objChildID in objJSON.children ) {

					traverse_json_hierarchy( objJSON.children[ objChildID ], callback );

				}

			}

		}

		// first go synchronous elements

		// fogs

		var fogID, fogJSON;

		for ( fogID in data.fogs ) {

			fogJSON = data.fogs[ fogID ];

			if ( fogJSON.type === "linear" ) {

				fog = new THREE.Fog( 0x000000, fogJSON.near, fogJSON.far );

			} else if ( fogJSON.type === "exp2" ) {

				fog = new THREE.FogExp2( 0x000000, fogJSON.density );

			}

			color = fogJSON.color;
			fog.color.setRGB( color[ 0 ], color[ 1 ], color[ 2 ] );

			result.fogs[ fogID ] = fog;

		}

		// now come potentially asynchronous elements

		// geometries

		// count how many geometries will be loaded asynchronously

		var geoID, geoJSON;

		for ( geoID in data.geometries ) {

			geoJSON = data.geometries[ geoID ];

			if ( geoJSON.type in this.geometryHandlers ) {

				counter_models += 1;

				scope.onLoadStart();

			}

		}

		// count how many hierarchies will be loaded asynchronously

		for ( var objID in data.objects ) {

			traverse_json_hierarchy( data.objects[ objID ], function ( objJSON ) {

				if ( objJSON.type && ( objJSON.type in scope.hierarchyHandlers ) ) {

					counter_models += 1;

					scope.onLoadStart();

				}

			} );

		}

		total_models = counter_models;

		for ( geoID in data.geometries ) {

			geoJSON = data.geometries[ geoID ];

			if ( geoJSON.type === "cube" ) {

				geometry = new THREE.BoxGeometry( geoJSON.width, geoJSON.height, geoJSON.depth, geoJSON.widthSegments, geoJSON.heightSegments, geoJSON.depthSegments );
				geometry.name = geoID;
				result.geometries[ geoID ] = geometry;

			} else if ( geoJSON.type === "plane" ) {

				geometry = new THREE.PlaneGeometry( geoJSON.width, geoJSON.height, geoJSON.widthSegments, geoJSON.heightSegments );
				geometry.name = geoID;
				result.geometries[ geoID ] = geometry;

			} else if ( geoJSON.type === "sphere" ) {

				geometry = new THREE.SphereGeometry( geoJSON.radius, geoJSON.widthSegments, geoJSON.heightSegments );
				geometry.name = geoID;
				result.geometries[ geoID ] = geometry;

			} else if ( geoJSON.type === "cylinder" ) {

				geometry = new THREE.CylinderGeometry( geoJSON.topRad, geoJSON.botRad, geoJSON.height, geoJSON.radSegs, geoJSON.heightSegs );
				geometry.name = geoID;
				result.geometries[ geoID ] = geometry;

			} else if ( geoJSON.type === "torus" ) {

				geometry = new THREE.TorusGeometry( geoJSON.radius, geoJSON.tube, geoJSON.segmentsR, geoJSON.segmentsT );
				geometry.name = geoID;
				result.geometries[ geoID ] = geometry;

			} else if ( geoJSON.type === "icosahedron" ) {

				geometry = new THREE.IcosahedronGeometry( geoJSON.radius, geoJSON.subdivisions );
				geometry.name = geoID;
				result.geometries[ geoID ] = geometry;

			} else if ( geoJSON.type in this.geometryHandlers ) {

				var loader = this.geometryHandlers[ geoJSON.type ][ "loaderObject" ];
				loader.load( get_url( geoJSON.url, data.urlBaseType ), create_callback_geometry( geoID ) );

			} else if ( geoJSON.type === "embedded" ) {

				var modelJson = data.embeds[ geoJSON.id ],
					texture_path = "";

				// pass metadata along to jsonLoader so it knows the format version

				modelJson.metadata = data.metadata;

				if ( modelJson ) {

					var jsonLoader = this.geometryHandlers[ "ascii" ][ "loaderObject" ];
					var model = jsonLoader.parse( modelJson, texture_path );
					create_callback_embed( geoID )( model.geometry, model.materials );

				}

			}

		}

		// textures

		// count how many textures will be loaded asynchronously

		var textureID, textureJSON;

		for ( textureID in data.textures ) {

			textureJSON = data.textures[ textureID ];

			if ( Array.isArray( textureJSON.url ) ) {

				counter_textures += textureJSON.url.length;

				for ( var n = 0; n < textureJSON.url.length; n ++ ) {

					scope.onLoadStart();

				}

			} else {

				counter_textures += 1;

				scope.onLoadStart();

			}

		}

		total_textures = counter_textures;

		for ( textureID in data.textures ) {

			textureJSON = data.textures[ textureID ];

			if ( textureJSON.mapping !== undefined && THREE[ textureJSON.mapping ] !== undefined ) {

				textureJSON.mapping = THREE[ textureJSON.mapping ];

			}

			var texture;

			if ( Array.isArray( textureJSON.url ) ) {

				var count = textureJSON.url.length;
				var urls = [];

				for ( var i = 0; i < count; i ++ ) {

					urls[ i ] = get_url( textureJSON.url[ i ], data.urlBaseType );

				}

				var loader = THREE.Loader.Handlers.get( urls[ 0 ] );

				if ( loader !== null ) {

					texture = loader.load( urls, generateTextureCallback( count ) );

					if ( textureJSON.mapping !== undefined )
						texture.mapping = textureJSON.mapping;

				} else {

					texture = new THREE.CubeTextureLoader().load( urls, generateTextureCallback( count ) );
					texture.mapping = textureJSON.mapping;

				}

			} else {

				var fullUrl = get_url( textureJSON.url, data.urlBaseType );
				var textureCallback = generateTextureCallback( 1 );

				var loader = THREE.Loader.Handlers.get( fullUrl );

				if ( loader !== null ) {

					texture = loader.load( fullUrl, textureCallback );

				} else {

					texture = new THREE.Texture();
					loader = new THREE.ImageLoader();

					( function ( texture ) {

						loader.load( fullUrl, function ( image ) {

							texture.image = image;
							texture.needsUpdate = true;

							textureCallback();

						} );

					} )( texture )


				}

				if ( textureJSON.mapping !== undefined )
					texture.mapping = textureJSON.mapping;

				if ( THREE[ textureJSON.minFilter ] !== undefined )
					texture.minFilter = THREE[ textureJSON.minFilter ];

				if ( THREE[ textureJSON.magFilter ] !== undefined )
					texture.magFilter = THREE[ textureJSON.magFilter ];

				if ( textureJSON.anisotropy ) texture.anisotropy = textureJSON.anisotropy;

				if ( textureJSON.repeat ) {

					texture.repeat.set( textureJSON.repeat[ 0 ], textureJSON.repeat[ 1 ] );

					if ( textureJSON.repeat[ 0 ] !== 1 ) texture.wrapS = THREE.RepeatWrapping;
					if ( textureJSON.repeat[ 1 ] !== 1 ) texture.wrapT = THREE.RepeatWrapping;

				}

				if ( textureJSON.offset ) {

					texture.offset.set( textureJSON.offset[ 0 ], textureJSON.offset[ 1 ] );

				}

				// handle wrap after repeat so that default repeat can be overriden

				if ( textureJSON.wrap ) {

					var wrapMap = {
						"repeat": THREE.RepeatWrapping,
						"mirror": THREE.MirroredRepeatWrapping
					};

					if ( wrapMap[ textureJSON.wrap[ 0 ] ] !== undefined ) texture.wrapS = wrapMap[ textureJSON.wrap[ 0 ] ];
					if ( wrapMap[ textureJSON.wrap[ 1 ] ] !== undefined ) texture.wrapT = wrapMap[ textureJSON.wrap[ 1 ] ];

				}

			}

			result.textures[ textureID ] = texture;

		}

		// materials

		var matID, matJSON;
		var parID;

		for ( matID in data.materials ) {

			matJSON = data.materials[ matID ];

			for ( parID in matJSON.parameters ) {

				if ( parID === "envMap" || parID === "map" || parID === "lightMap" || parID === "bumpMap" || parID === "normalMap" || parID === "alphaMap" ) {

					matJSON.parameters[ parID ] = result.textures[ matJSON.parameters[ parID ] ];

				} else if ( parID === "shading" ) {

					matJSON.parameters[ parID ] = ( matJSON.parameters[ parID ] === "flat" ) ? THREE.FlatShading : THREE.SmoothShading;

				} else if ( parID === "side" ) {

					if ( matJSON.parameters[ parID ] == "double" ) {

						matJSON.parameters[ parID ] = THREE.DoubleSide;

					} else if ( matJSON.parameters[ parID ] == "back" ) {

						matJSON.parameters[ parID ] = THREE.BackSide;

					} else {

						matJSON.parameters[ parID ] = THREE.FrontSide;

					}

				} else if ( parID === "blending" ) {

					matJSON.parameters[ parID ] = matJSON.parameters[ parID ] in THREE ? THREE[ matJSON.parameters[ parID ] ] : THREE.NormalBlending;

				} else if ( parID === "combine" ) {

					matJSON.parameters[ parID ] = matJSON.parameters[ parID ] in THREE ? THREE[ matJSON.parameters[ parID ] ] : THREE.MultiplyOperation;

				} else if ( parID === "vertexColors" ) {

					if ( matJSON.parameters[ parID ] == "face" ) {

						matJSON.parameters[ parID ] = THREE.FaceColors;

					// default to vertex colors if "vertexColors" is anything else face colors or 0 / null / false

					} else if ( matJSON.parameters[ parID ] ) {

						matJSON.parameters[ parID ] = THREE.VertexColors;

					}

				} else if ( parID === "wrapRGB" ) {

					var v3 = matJSON.parameters[ parID ];
					matJSON.parameters[ parID ] = new THREE.Vector3( v3[ 0 ], v3[ 1 ], v3[ 2 ] );

				} else if ( parID === "normalScale" ) {

					var v2 = matJSON.parameters[ parID ];
					matJSON.parameters[ parID ] = new THREE.Vector2( v2[ 0 ], v2[ 1 ] );

				}

			}

			if ( matJSON.parameters.opacity !== undefined && matJSON.parameters.opacity < 1.0 ) {

				matJSON.parameters.transparent = true;

			}

			material = new THREE[ matJSON.type ]( matJSON.parameters );
			material.name = matID;

			result.materials[ matID ] = material;

		}

		// second pass through all materials to initialize MultiMaterials
		// that could be referring to other materials out of order

		for ( matID in data.materials ) {

			matJSON = data.materials[ matID ];

			if ( matJSON.parameters.materials ) {

				var materialArray = [];

				for ( var i = 0; i < matJSON.parameters.materials.length; i ++ ) {

					var label = matJSON.parameters.materials[ i ];
					materialArray.push( result.materials[ label ] );

				}

				result.materials[ matID ].materials = materialArray;

			}

		}

		// objects ( synchronous init of procedural primitives )

		handle_objects();

		// defaults

		if ( result.cameras && data.defaults.camera ) {

			result.currentCamera = result.cameras[ data.defaults.camera ];

		}

		if ( result.fogs && data.defaults.fog ) {

			result.scene.fog = result.fogs[ data.defaults.fog ];

		}

		// synchronous callback

		scope.callbackSync( result );

		// just in case there are no async elements

		async_callback_gate();

	}

};

// File:examples/js/renderers/Projector.js

/**
 * @author mrdoob / http://mrdoob.com/
 * @author supereggbert / http://www.paulbrunt.co.uk/
 * @author julianwa / https://github.com/julianwa
 */

THREE.RenderableObject = function () {

	this.id = 0;

	this.object = null;
	this.z = 0;
	this.renderOrder = 0;

};

//

THREE.RenderableFace = function () {

	this.id = 0;

	this.v1 = new THREE.RenderableVertex();
	this.v2 = new THREE.RenderableVertex();
	this.v3 = new THREE.RenderableVertex();

	this.normalModel = new THREE.Vector3();

	this.vertexNormalsModel = [ new THREE.Vector3(), new THREE.Vector3(), new THREE.Vector3() ];
	this.vertexNormalsLength = 0;

	this.color = new THREE.Color();
	this.material = null;
	this.uvs = [ new THREE.Vector2(), new THREE.Vector2(), new THREE.Vector2() ];

	this.z = 0;
	this.renderOrder = 0;

};

//

THREE.RenderableVertex = function () {

	this.position = new THREE.Vector3();
	this.positionWorld = new THREE.Vector3();
	this.positionScreen = new THREE.Vector4();

	this.visible = true;

};

THREE.RenderableVertex.prototype.copy = function ( vertex ) {

	this.positionWorld.copy( vertex.positionWorld );
	this.positionScreen.copy( vertex.positionScreen );

};

//

THREE.RenderableLine = function () {

	this.id = 0;

	this.v1 = new THREE.RenderableVertex();
	this.v2 = new THREE.RenderableVertex();

	this.vertexColors = [ new THREE.Color(), new THREE.Color() ];
	this.material = null;

	this.z = 0;
	this.renderOrder = 0;

};

//

THREE.RenderableSprite = function () {

	this.id = 0;

	this.object = null;

	this.x = 0;
	this.y = 0;
	this.z = 0;

	this.rotation = 0;
	this.scale = new THREE.Vector2();

	this.material = null;
	this.renderOrder = 0;

};

//

THREE.Projector = function () {

	var _object, _objectCount, _objectPool = [], _objectPoolLength = 0,
	_vertex, _vertexCount, _vertexPool = [], _vertexPoolLength = 0,
	_face, _faceCount, _facePool = [], _facePoolLength = 0,
	_line, _lineCount, _linePool = [], _linePoolLength = 0,
	_sprite, _spriteCount, _spritePool = [], _spritePoolLength = 0,

	_renderData = { objects: [], lights: [], elements: [] },

	_vector3 = new THREE.Vector3(),
	_vector4 = new THREE.Vector4(),

	_clipBox = new THREE.Box3( new THREE.Vector3( - 1, - 1, - 1 ), new THREE.Vector3( 1, 1, 1 ) ),
	_boundingBox = new THREE.Box3(),
	_points3 = new Array( 3 ),
	_points4 = new Array( 4 ),

	_viewMatrix = new THREE.Matrix4(),
	_viewProjectionMatrix = new THREE.Matrix4(),

	_modelMatrix,
	_modelViewProjectionMatrix = new THREE.Matrix4(),

	_normalMatrix = new THREE.Matrix3(),

	_frustum = new THREE.Frustum(),

	_clippedVertex1PositionScreen = new THREE.Vector4(),
	_clippedVertex2PositionScreen = new THREE.Vector4();

	//

	this.projectVector = function ( vector, camera ) {

		console.warn( 'THREE.Projector: .projectVector() is now vector.project().' );
		vector.project( camera );

	};

	this.unprojectVector = function ( vector, camera ) {

		console.warn( 'THREE.Projector: .unprojectVector() is now vector.unproject().' );
		vector.unproject( camera );

	};

	this.pickingRay = function ( vector, camera ) {

		console.error( 'THREE.Projector: .pickingRay() is now raycaster.setFromCamera().' );

	};

	//

	var RenderList = function () {

		var normals = [];
		var uvs = [];

		var object = null;
		var material = null;

		var normalMatrix = new THREE.Matrix3();

		function setObject( value ) {

			object = value;
			material = object.material;

			normalMatrix.getNormalMatrix( object.matrixWorld );

			normals.length = 0;
			uvs.length = 0;

		}

		function projectVertex( vertex ) {

			var position = vertex.position;
			var positionWorld = vertex.positionWorld;
			var positionScreen = vertex.positionScreen;

			positionWorld.copy( position ).applyMatrix4( _modelMatrix );
			positionScreen.copy( positionWorld ).applyMatrix4( _viewProjectionMatrix );

			var invW = 1 / positionScreen.w;

			positionScreen.x *= invW;
			positionScreen.y *= invW;
			positionScreen.z *= invW;

			vertex.visible = positionScreen.x >= - 1 && positionScreen.x <= 1 &&
					 positionScreen.y >= - 1 && positionScreen.y <= 1 &&
					 positionScreen.z >= - 1 && positionScreen.z <= 1;

		}

		function pushVertex( x, y, z ) {

			_vertex = getNextVertexInPool();
			_vertex.position.set( x, y, z );

			projectVertex( _vertex );

		}

		function pushNormal( x, y, z ) {

			normals.push( x, y, z );

		}

		function pushUv( x, y ) {

			uvs.push( x, y );

		}

		function checkTriangleVisibility( v1, v2, v3 ) {

			if ( v1.visible === true || v2.visible === true || v3.visible === true ) return true;

			_points3[ 0 ] = v1.positionScreen;
			_points3[ 1 ] = v2.positionScreen;
			_points3[ 2 ] = v3.positionScreen;

			return _clipBox.intersectsBox( _boundingBox.setFromPoints( _points3 ) );

		}

		function checkBackfaceCulling( v1, v2, v3 ) {

			return ( ( v3.positionScreen.x - v1.positionScreen.x ) *
				    ( v2.positionScreen.y - v1.positionScreen.y ) -
				    ( v3.positionScreen.y - v1.positionScreen.y ) *
				    ( v2.positionScreen.x - v1.positionScreen.x ) ) < 0;

		}

		function pushLine( a, b ) {

			var v1 = _vertexPool[ a ];
			var v2 = _vertexPool[ b ];

			_line = getNextLineInPool();

			_line.id = object.id;
			_line.v1.copy( v1 );
			_line.v2.copy( v2 );
			_line.z = ( v1.positionScreen.z + v2.positionScreen.z ) / 2;
			_line.renderOrder = object.renderOrder;

			_line.material = object.material;

			_renderData.elements.push( _line );

		}

		function pushTriangle( a, b, c ) {

			var v1 = _vertexPool[ a ];
			var v2 = _vertexPool[ b ];
			var v3 = _vertexPool[ c ];

			if ( checkTriangleVisibility( v1, v2, v3 ) === false ) return;

			if ( material.side === THREE.DoubleSide || checkBackfaceCulling( v1, v2, v3 ) === true ) {

				_face = getNextFaceInPool();

				_face.id = object.id;
				_face.v1.copy( v1 );
				_face.v2.copy( v2 );
				_face.v3.copy( v3 );
				_face.z = ( v1.positionScreen.z + v2.positionScreen.z + v3.positionScreen.z ) / 3;
				_face.renderOrder = object.renderOrder;

				// use first vertex normal as face normal

				_face.normalModel.fromArray( normals, a * 3 );
				_face.normalModel.applyMatrix3( normalMatrix ).normalize();

				for ( var i = 0; i < 3; i ++ ) {

					var normal = _face.vertexNormalsModel[ i ];
					normal.fromArray( normals, arguments[ i ] * 3 );
					normal.applyMatrix3( normalMatrix ).normalize();

					var uv = _face.uvs[ i ];
					uv.fromArray( uvs, arguments[ i ] * 2 );

				}

				_face.vertexNormalsLength = 3;

				_face.material = object.material;

				_renderData.elements.push( _face );

			}

		}

		return {
			setObject: setObject,
			projectVertex: projectVertex,
			checkTriangleVisibility: checkTriangleVisibility,
			checkBackfaceCulling: checkBackfaceCulling,
			pushVertex: pushVertex,
			pushNormal: pushNormal,
			pushUv: pushUv,
			pushLine: pushLine,
			pushTriangle: pushTriangle
		}

	};

	var renderList = new RenderList();

	this.projectScene = function ( scene, camera, sortObjects, sortElements ) {

		_faceCount = 0;
		_lineCount = 0;
		_spriteCount = 0;

		_renderData.elements.length = 0;

		if ( scene.autoUpdate === true ) scene.updateMatrixWorld();
		if ( camera.parent === null ) camera.updateMatrixWorld();

		_viewMatrix.copy( camera.matrixWorldInverse.getInverse( camera.matrixWorld ) );
		_viewProjectionMatrix.multiplyMatrices( camera.projectionMatrix, _viewMatrix );

		_frustum.setFromMatrix( _viewProjectionMatrix );

		//

		_objectCount = 0;

		_renderData.objects.length = 0;
		_renderData.lights.length = 0;

		function addObject( object ) {

			_object = getNextObjectInPool();
			_object.id = object.id;
			_object.object = object;

			_vector3.setFromMatrixPosition( object.matrixWorld );
			_vector3.applyProjection( _viewProjectionMatrix );
			_object.z = _vector3.z;
			_object.renderOrder = object.renderOrder;

			_renderData.objects.push( _object );

		}

		scene.traverseVisible( function ( object ) {

			if ( object instanceof THREE.Light ) {

				_renderData.lights.push( object );

			} else if ( object instanceof THREE.Mesh || object instanceof THREE.Line ) {

				if ( object.material.visible === false ) return;
				if ( object.frustumCulled === true && _frustum.intersectsObject( object ) === false ) return;

				addObject( object );

			} else if ( object instanceof THREE.Sprite ) {

				if ( object.material.visible === false ) return;
				if ( object.frustumCulled === true && _frustum.intersectsSprite( object ) === false ) return;

				addObject( object );

			}

		} );

		if ( sortObjects === true ) {

			_renderData.objects.sort( painterSort );

		}

		//

		for ( var o = 0, ol = _renderData.objects.length; o < ol; o ++ ) {

			var object = _renderData.objects[ o ].object;
			var geometry = object.geometry;

			renderList.setObject( object );

			_modelMatrix = object.matrixWorld;

			_vertexCount = 0;

			if ( object instanceof THREE.Mesh ) {

				if ( geometry instanceof THREE.BufferGeometry ) {

					var attributes = geometry.attributes;
					var groups = geometry.groups;

					if ( attributes.position === undefined ) continue;

					var positions = attributes.position.array;

					for ( var i = 0, l = positions.length; i < l; i += 3 ) {

						renderList.pushVertex( positions[ i ], positions[ i + 1 ], positions[ i + 2 ] );

					}

					if ( attributes.normal !== undefined ) {

						var normals = attributes.normal.array;

						for ( var i = 0, l = normals.length; i < l; i += 3 ) {

							renderList.pushNormal( normals[ i ], normals[ i + 1 ], normals[ i + 2 ] );

						}

					}

					if ( attributes.uv !== undefined ) {

						var uvs = attributes.uv.array;

						for ( var i = 0, l = uvs.length; i < l; i += 2 ) {

							renderList.pushUv( uvs[ i ], uvs[ i + 1 ] );

						}

					}

					if ( geometry.index !== null ) {

						var indices = geometry.index.array;

						if ( groups.length > 0 ) {

							for ( var o = 0; o < groups.length; o ++ ) {

								var group = groups[ o ];

								for ( var i = group.start, l = group.start + group.count; i < l; i += 3 ) {

									renderList.pushTriangle( indices[ i ], indices[ i + 1 ], indices[ i + 2 ] );

								}

							}

						} else {

							for ( var i = 0, l = indices.length; i < l; i += 3 ) {

								renderList.pushTriangle( indices[ i ], indices[ i + 1 ], indices[ i + 2 ] );

							}

						}

					} else {

						for ( var i = 0, l = positions.length / 3; i < l; i += 3 ) {

							renderList.pushTriangle( i, i + 1, i + 2 );

						}

					}

				} else if ( geometry instanceof THREE.Geometry ) {

					var vertices = geometry.vertices;
					var faces = geometry.faces;
					var faceVertexUvs = geometry.faceVertexUvs[ 0 ];

					_normalMatrix.getNormalMatrix( _modelMatrix );

					var material = object.material;

					var isFaceMaterial = material instanceof THREE.MultiMaterial;
					var objectMaterials = isFaceMaterial === true ? object.material : null;

					for ( var v = 0, vl = vertices.length; v < vl; v ++ ) {

						var vertex = vertices[ v ];

						_vector3.copy( vertex );

						if ( material.morphTargets === true ) {

							var morphTargets = geometry.morphTargets;
							var morphInfluences = object.morphTargetInfluences;

							for ( var t = 0, tl = morphTargets.length; t < tl; t ++ ) {

								var influence = morphInfluences[ t ];

								if ( influence === 0 ) continue;

								var target = morphTargets[ t ];
								var targetVertex = target.vertices[ v ];

								_vector3.x += ( targetVertex.x - vertex.x ) * influence;
								_vector3.y += ( targetVertex.y - vertex.y ) * influence;
								_vector3.z += ( targetVertex.z - vertex.z ) * influence;

							}

						}

						renderList.pushVertex( _vector3.x, _vector3.y, _vector3.z );

					}

					for ( var f = 0, fl = faces.length; f < fl; f ++ ) {

						var face = faces[ f ];

						material = isFaceMaterial === true
							 ? objectMaterials.materials[ face.materialIndex ]
							 : object.material;

						if ( material === undefined ) continue;

						var side = material.side;

						var v1 = _vertexPool[ face.a ];
						var v2 = _vertexPool[ face.b ];
						var v3 = _vertexPool[ face.c ];

						if ( renderList.checkTriangleVisibility( v1, v2, v3 ) === false ) continue;

						var visible = renderList.checkBackfaceCulling( v1, v2, v3 );

						if ( side !== THREE.DoubleSide ) {

							if ( side === THREE.FrontSide && visible === false ) continue;
							if ( side === THREE.BackSide && visible === true ) continue;

						}

						_face = getNextFaceInPool();

						_face.id = object.id;
						_face.v1.copy( v1 );
						_face.v2.copy( v2 );
						_face.v3.copy( v3 );

						_face.normalModel.copy( face.normal );

						if ( visible === false && ( side === THREE.BackSide || side === THREE.DoubleSide ) ) {

							_face.normalModel.negate();

						}

						_face.normalModel.applyMatrix3( _normalMatrix ).normalize();

						var faceVertexNormals = face.vertexNormals;

						for ( var n = 0, nl = Math.min( faceVertexNormals.length, 3 ); n < nl; n ++ ) {

							var normalModel = _face.vertexNormalsModel[ n ];
							normalModel.copy( faceVertexNormals[ n ] );

							if ( visible === false && ( side === THREE.BackSide || side === THREE.DoubleSide ) ) {

								normalModel.negate();

							}

							normalModel.applyMatrix3( _normalMatrix ).normalize();

						}

						_face.vertexNormalsLength = faceVertexNormals.length;

						var vertexUvs = faceVertexUvs[ f ];

						if ( vertexUvs !== undefined ) {

							for ( var u = 0; u < 3; u ++ ) {

								_face.uvs[ u ].copy( vertexUvs[ u ] );

							}

						}

						_face.color = face.color;
						_face.material = material;

						_face.z = ( v1.positionScreen.z + v2.positionScreen.z + v3.positionScreen.z ) / 3;
						_face.renderOrder = object.renderOrder;

						_renderData.elements.push( _face );

					}

				}

			} else if ( object instanceof THREE.Line ) {

				if ( geometry instanceof THREE.BufferGeometry ) {

					var attributes = geometry.attributes;

					if ( attributes.position !== undefined ) {

						var positions = attributes.position.array;

						for ( var i = 0, l = positions.length; i < l; i += 3 ) {

							renderList.pushVertex( positions[ i ], positions[ i + 1 ], positions[ i + 2 ] );

						}

						if ( geometry.index !== null ) {

							var indices = geometry.index.array;

							for ( var i = 0, l = indices.length; i < l; i += 2 ) {

								renderList.pushLine( indices[ i ], indices[ i + 1 ] );

							}

						} else {

							var step = object instanceof THREE.LineSegments ? 2 : 1;

							for ( var i = 0, l = ( positions.length / 3 ) - 1; i < l; i += step ) {

								renderList.pushLine( i, i + 1 );

							}

						}

					}

				} else if ( geometry instanceof THREE.Geometry ) {

					_modelViewProjectionMatrix.multiplyMatrices( _viewProjectionMatrix, _modelMatrix );

					var vertices = object.geometry.vertices;

					if ( vertices.length === 0 ) continue;

					v1 = getNextVertexInPool();
					v1.positionScreen.copy( vertices[ 0 ] ).applyMatrix4( _modelViewProjectionMatrix );

					var step = object instanceof THREE.LineSegments ? 2 : 1;

					for ( var v = 1, vl = vertices.length; v < vl; v ++ ) {

						v1 = getNextVertexInPool();
						v1.positionScreen.copy( vertices[ v ] ).applyMatrix4( _modelViewProjectionMatrix );

						if ( ( v + 1 ) % step > 0 ) continue;

						v2 = _vertexPool[ _vertexCount - 2 ];

						_clippedVertex1PositionScreen.copy( v1.positionScreen );
						_clippedVertex2PositionScreen.copy( v2.positionScreen );

						if ( clipLine( _clippedVertex1PositionScreen, _clippedVertex2PositionScreen ) === true ) {

							// Perform the perspective divide
							_clippedVertex1PositionScreen.multiplyScalar( 1 / _clippedVertex1PositionScreen.w );
							_clippedVertex2PositionScreen.multiplyScalar( 1 / _clippedVertex2PositionScreen.w );

							_line = getNextLineInPool();

							_line.id = object.id;
							_line.v1.positionScreen.copy( _clippedVertex1PositionScreen );
							_line.v2.positionScreen.copy( _clippedVertex2PositionScreen );

							_line.z = Math.max( _clippedVertex1PositionScreen.z, _clippedVertex2PositionScreen.z );
							_line.renderOrder = object.renderOrder;

							_line.material = object.material;

							if ( object.material.vertexColors === THREE.VertexColors ) {

								_line.vertexColors[ 0 ].copy( object.geometry.colors[ v ] );
								_line.vertexColors[ 1 ].copy( object.geometry.colors[ v - 1 ] );

							}

							_renderData.elements.push( _line );

						}

					}

				}

			} else if ( object instanceof THREE.Sprite ) {

				_vector4.set( _modelMatrix.elements[ 12 ], _modelMatrix.elements[ 13 ], _modelMatrix.elements[ 14 ], 1 );
				_vector4.applyMatrix4( _viewProjectionMatrix );

				var invW = 1 / _vector4.w;

				_vector4.z *= invW;

				if ( _vector4.z >= - 1 && _vector4.z <= 1 ) {

					_sprite = getNextSpriteInPool();
					_sprite.id = object.id;
					_sprite.x = _vector4.x * invW;
					_sprite.y = _vector4.y * invW;
					_sprite.z = _vector4.z;
					_sprite.renderOrder = object.renderOrder;
					_sprite.object = object;

					_sprite.rotation = object.rotation;

					_sprite.scale.x = object.scale.x * Math.abs( _sprite.x - ( _vector4.x + camera.projectionMatrix.elements[ 0 ] ) / ( _vector4.w + camera.projectionMatrix.elements[ 12 ] ) );
					_sprite.scale.y = object.scale.y * Math.abs( _sprite.y - ( _vector4.y + camera.projectionMatrix.elements[ 5 ] ) / ( _vector4.w + camera.projectionMatrix.elements[ 13 ] ) );

					_sprite.material = object.material;

					_renderData.elements.push( _sprite );

				}

			}

		}

		if ( sortElements === true ) {

			_renderData.elements.sort( painterSort );

		}

		return _renderData;

	};

	// Pools

	function getNextObjectInPool() {

		if ( _objectCount === _objectPoolLength ) {

			var object = new THREE.RenderableObject();
			_objectPool.push( object );
			_objectPoolLength ++;
			_objectCount ++;
			return object;

		}

		return _objectPool[ _objectCount ++ ];

	}

	function getNextVertexInPool() {

		if ( _vertexCount === _vertexPoolLength ) {

			var vertex = new THREE.RenderableVertex();
			_vertexPool.push( vertex );
			_vertexPoolLength ++;
			_vertexCount ++;
			return vertex;

		}

		return _vertexPool[ _vertexCount ++ ];

	}

	function getNextFaceInPool() {

		if ( _faceCount === _facePoolLength ) {

			var face = new THREE.RenderableFace();
			_facePool.push( face );
			_facePoolLength ++;
			_faceCount ++;
			return face;

		}

		return _facePool[ _faceCount ++ ];


	}

	function getNextLineInPool() {

		if ( _lineCount === _linePoolLength ) {

			var line = new THREE.RenderableLine();
			_linePool.push( line );
			_linePoolLength ++;
			_lineCount ++;
			return line;

		}

		return _linePool[ _lineCount ++ ];

	}

	function getNextSpriteInPool() {

		if ( _spriteCount === _spritePoolLength ) {

			var sprite = new THREE.RenderableSprite();
			_spritePool.push( sprite );
			_spritePoolLength ++;
			_spriteCount ++;
			return sprite;

		}

		return _spritePool[ _spriteCount ++ ];

	}

	//

	function painterSort( a, b ) {

		if ( a.renderOrder !== b.renderOrder ) {

			return a.renderOrder - b.renderOrder;

		} else if ( a.z !== b.z ) {

			return b.z - a.z;

		} else if ( a.id !== b.id ) {

			return a.id - b.id;

		} else {

			return 0;

		}

	}

	function clipLine( s1, s2 ) {

		var alpha1 = 0, alpha2 = 1,

		// Calculate the boundary coordinate of each vertex for the near and far clip planes,
		// Z = -1 and Z = +1, respectively.
		bc1near =  s1.z + s1.w,
		bc2near =  s2.z + s2.w,
		bc1far =  - s1.z + s1.w,
		bc2far =  - s2.z + s2.w;

		if ( bc1near >= 0 && bc2near >= 0 && bc1far >= 0 && bc2far >= 0 ) {

			// Both vertices lie entirely within all clip planes.
			return true;

		} else if ( ( bc1near < 0 && bc2near < 0 ) || ( bc1far < 0 && bc2far < 0 ) ) {

			// Both vertices lie entirely outside one of the clip planes.
			return false;

		} else {

			// The line segment spans at least one clip plane.

			if ( bc1near < 0 ) {

				// v1 lies outside the near plane, v2 inside
				alpha1 = Math.max( alpha1, bc1near / ( bc1near - bc2near ) );

			} else if ( bc2near < 0 ) {

				// v2 lies outside the near plane, v1 inside
				alpha2 = Math.min( alpha2, bc1near / ( bc1near - bc2near ) );

			}

			if ( bc1far < 0 ) {

				// v1 lies outside the far plane, v2 inside
				alpha1 = Math.max( alpha1, bc1far / ( bc1far - bc2far ) );

			} else if ( bc2far < 0 ) {

				// v2 lies outside the far plane, v2 inside
				alpha2 = Math.min( alpha2, bc1far / ( bc1far - bc2far ) );

			}

			if ( alpha2 < alpha1 ) {

				// The line segment spans two boundaries, but is outside both of them.
				// (This can't happen when we're only clipping against just near/far but good
				//  to leave the check here for future usage if other clip planes are added.)
				return false;

			} else {

				// Update the s1 and s2 vertices to match the clipped line segment.
				s1.lerp( s2, alpha1 );
				s2.lerp( s1, 1 - alpha2 );

				return true;

			}

		}

	}

};

// File:examples/js/renderers/CanvasRenderer.js

/**
 * @author mrdoob / http://mrdoob.com/
 */

THREE.SpriteCanvasMaterial = function ( parameters ) {

	THREE.Material.call( this );

	this.type = 'SpriteCanvasMaterial';

	this.color = new THREE.Color( 0xffffff );
	this.program = function ( context, color ) {};

	this.setValues( parameters );

};

THREE.SpriteCanvasMaterial.prototype = Object.create( THREE.Material.prototype );
THREE.SpriteCanvasMaterial.prototype.constructor = THREE.SpriteCanvasMaterial;

THREE.SpriteCanvasMaterial.prototype.clone = function () {

	var material = new THREE.SpriteCanvasMaterial();

	material.copy( this );
	material.color.copy( this.color );
	material.program = this.program;

	return material;

};

//

THREE.CanvasRenderer = function ( parameters ) {

	console.log( 'THREE.CanvasRenderer', THREE.REVISION );

	parameters = parameters || {};

	var _this = this,
	_renderData, _elements, _lights,
	_projector = new THREE.Projector(),

	_canvas = parameters.canvas !== undefined
			 ? parameters.canvas
			 : document.createElement( 'canvas' ),

	_canvasWidth = _canvas.width,
	_canvasHeight = _canvas.height,
	_canvasWidthHalf = Math.floor( _canvasWidth / 2 ),
	_canvasHeightHalf = Math.floor( _canvasHeight / 2 ),

	_viewportX = 0,
	_viewportY = 0,
	_viewportWidth = _canvasWidth,
	_viewportHeight = _canvasHeight,

	_pixelRatio = 1,

	_context = _canvas.getContext( '2d', {
		alpha: parameters.alpha === true
	} ),

	_clearColor = new THREE.Color( 0x000000 ),
	_clearAlpha = parameters.alpha === true ? 0 : 1,

	_contextGlobalAlpha = 1,
	_contextGlobalCompositeOperation = 0,
	_contextStrokeStyle = null,
	_contextFillStyle = null,
	_contextLineWidth = null,
	_contextLineCap = null,
	_contextLineJoin = null,
	_contextLineDash = [],

	_camera,

	_v1, _v2, _v3, _v4,
	_v5 = new THREE.RenderableVertex(),
	_v6 = new THREE.RenderableVertex(),

	_v1x, _v1y, _v2x, _v2y, _v3x, _v3y,
	_v4x, _v4y, _v5x, _v5y, _v6x, _v6y,

	_color = new THREE.Color(),
	_color1 = new THREE.Color(),
	_color2 = new THREE.Color(),
	_color3 = new THREE.Color(),
	_color4 = new THREE.Color(),

	_diffuseColor = new THREE.Color(),
	_emissiveColor = new THREE.Color(),

	_lightColor = new THREE.Color(),

	_patterns = {},

	_image, _uvs,
	_uv1x, _uv1y, _uv2x, _uv2y, _uv3x, _uv3y,

	_clipBox = new THREE.Box2(),
	_clearBox = new THREE.Box2(),
	_elemBox = new THREE.Box2(),

	_ambientLight = new THREE.Color(),
	_directionalLights = new THREE.Color(),
	_pointLights = new THREE.Color(),

	_vector3 = new THREE.Vector3(), // Needed for PointLight
	_centroid = new THREE.Vector3(),
	_normal = new THREE.Vector3(),
	_normalViewMatrix = new THREE.Matrix3();

	/* TODO
	_canvas.mozImageSmoothingEnabled = false;
	_canvas.webkitImageSmoothingEnabled = false;
	_canvas.msImageSmoothingEnabled = false;
	_canvas.imageSmoothingEnabled = false;
	*/

	// dash+gap fallbacks for Firefox and everything else

	if ( _context.setLineDash === undefined ) {

		_context.setLineDash = function () {};

	}

	this.domElement = _canvas;

	this.autoClear = true;
	this.sortObjects = true;
	this.sortElements = true;

	this.info = {

		render: {

			vertices: 0,
			faces: 0

		}

	};

	// WebGLRenderer compatibility

	this.supportsVertexTextures = function () {};
	this.setFaceCulling = function () {};

	// API

	this.getContext = function () {

		return _context;

	};

	this.getContextAttributes = function () {

		return _context.getContextAttributes();

	};

	this.getPixelRatio = function () {

		return _pixelRatio;

	};

	this.setPixelRatio = function ( value ) {

		if ( value !== undefined ) _pixelRatio = value;

	};

	this.setSize = function ( width, height, updateStyle ) {

		_canvasWidth = width * _pixelRatio;
		_canvasHeight = height * _pixelRatio;

		_canvas.width = _canvasWidth;
		_canvas.height = _canvasHeight;

		_canvasWidthHalf = Math.floor( _canvasWidth / 2 );
		_canvasHeightHalf = Math.floor( _canvasHeight / 2 );

		if ( updateStyle !== false ) {

			_canvas.style.width = width + 'px';
			_canvas.style.height = height + 'px';

		}

		_clipBox.min.set( - _canvasWidthHalf, - _canvasHeightHalf );
		_clipBox.max.set(   _canvasWidthHalf,   _canvasHeightHalf );

		_clearBox.min.set( - _canvasWidthHalf, - _canvasHeightHalf );
		_clearBox.max.set(   _canvasWidthHalf,   _canvasHeightHalf );

		_contextGlobalAlpha = 1;
		_contextGlobalCompositeOperation = 0;
		_contextStrokeStyle = null;
		_contextFillStyle = null;
		_contextLineWidth = null;
		_contextLineCap = null;
		_contextLineJoin = null;

		this.setViewport( 0, 0, width, height );

	};

	this.setViewport = function ( x, y, width, height ) {

		_viewportX = x * _pixelRatio;
		_viewportY = y * _pixelRatio;

		_viewportWidth = width * _pixelRatio;
		_viewportHeight = height * _pixelRatio;

	};

	this.setScissor = function () {};
	this.setScissorTest = function () {};

	this.setClearColor = function ( color, alpha ) {

		_clearColor.set( color );
		_clearAlpha = alpha !== undefined ? alpha : 1;

		_clearBox.min.set( - _canvasWidthHalf, - _canvasHeightHalf );
		_clearBox.max.set(   _canvasWidthHalf,   _canvasHeightHalf );

	};

	this.setClearColorHex = function ( hex, alpha ) {

		console.warn( 'THREE.CanvasRenderer: .setClearColorHex() is being removed. Use .setClearColor() instead.' );
		this.setClearColor( hex, alpha );

	};

	this.getClearColor = function () {

		return _clearColor;

	};

	this.getClearAlpha = function () {

		return _clearAlpha;

	};

	this.getMaxAnisotropy = function () {

		return 0;

	};

	this.clear = function () {

		if ( _clearBox.isEmpty() === false ) {

			_clearBox.intersect( _clipBox );
			_clearBox.expandByScalar( 2 );

			_clearBox.min.x = _clearBox.min.x + _canvasWidthHalf;
			_clearBox.min.y =  - _clearBox.min.y + _canvasHeightHalf;		// higher y value !
			_clearBox.max.x = _clearBox.max.x + _canvasWidthHalf;
			_clearBox.max.y =  - _clearBox.max.y + _canvasHeightHalf;		// lower y value !

			if ( _clearAlpha < 1 ) {

				_context.clearRect(
					_clearBox.min.x | 0,
					_clearBox.max.y | 0,
					( _clearBox.max.x - _clearBox.min.x ) | 0,
					( _clearBox.min.y - _clearBox.max.y ) | 0
				);

			}

			if ( _clearAlpha > 0 ) {

				setBlending( THREE.NormalBlending );
				setOpacity( 1 );

				setFillStyle( 'rgba(' + Math.floor( _clearColor.r * 255 ) + ',' + Math.floor( _clearColor.g * 255 ) + ',' + Math.floor( _clearColor.b * 255 ) + ',' + _clearAlpha + ')' );

				_context.fillRect(
					_clearBox.min.x | 0,
					_clearBox.max.y | 0,
					( _clearBox.max.x - _clearBox.min.x ) | 0,
					( _clearBox.min.y - _clearBox.max.y ) | 0
				);

			}

			_clearBox.makeEmpty();

		}

	};

	// compatibility

	this.clearColor = function () {};
	this.clearDepth = function () {};
	this.clearStencil = function () {};

	this.render = function ( scene, camera ) {

		if ( camera instanceof THREE.Camera === false ) {

			console.error( 'THREE.CanvasRenderer.render: camera is not an instance of THREE.Camera.' );
			return;

		}

		if ( this.autoClear === true ) this.clear();

		_this.info.render.vertices = 0;
		_this.info.render.faces = 0;

		_context.setTransform( _viewportWidth / _canvasWidth, 0, 0, - _viewportHeight / _canvasHeight, _viewportX, _canvasHeight - _viewportY );
		_context.translate( _canvasWidthHalf, _canvasHeightHalf );

		_renderData = _projector.projectScene( scene, camera, this.sortObjects, this.sortElements );
		_elements = _renderData.elements;
		_lights = _renderData.lights;
		_camera = camera;

		_normalViewMatrix.getNormalMatrix( camera.matrixWorldInverse );

		/* DEBUG
		setFillStyle( 'rgba( 0, 255, 255, 0.5 )' );
		_context.fillRect( _clipBox.min.x, _clipBox.min.y, _clipBox.max.x - _clipBox.min.x, _clipBox.max.y - _clipBox.min.y );
		*/

		calculateLights();

		for ( var e = 0, el = _elements.length; e < el; e ++ ) {

			var element = _elements[ e ];

			var material = element.material;

			if ( material === undefined || material.opacity === 0 ) continue;

			_elemBox.makeEmpty();

			if ( element instanceof THREE.RenderableSprite ) {

				_v1 = element;
				_v1.x *= _canvasWidthHalf; _v1.y *= _canvasHeightHalf;

				renderSprite( _v1, element, material );

			} else if ( element instanceof THREE.RenderableLine ) {

				_v1 = element.v1; _v2 = element.v2;

				_v1.positionScreen.x *= _canvasWidthHalf; _v1.positionScreen.y *= _canvasHeightHalf;
				_v2.positionScreen.x *= _canvasWidthHalf; _v2.positionScreen.y *= _canvasHeightHalf;

				_elemBox.setFromPoints( [
					_v1.positionScreen,
					_v2.positionScreen
				] );

				if ( _clipBox.intersectsBox( _elemBox ) === true ) {

					renderLine( _v1, _v2, element, material );

				}

			} else if ( element instanceof THREE.RenderableFace ) {

				_v1 = element.v1; _v2 = element.v2; _v3 = element.v3;

				if ( _v1.positionScreen.z < - 1 || _v1.positionScreen.z > 1 ) continue;
				if ( _v2.positionScreen.z < - 1 || _v2.positionScreen.z > 1 ) continue;
				if ( _v3.positionScreen.z < - 1 || _v3.positionScreen.z > 1 ) continue;

				_v1.positionScreen.x *= _canvasWidthHalf; _v1.positionScreen.y *= _canvasHeightHalf;
				_v2.positionScreen.x *= _canvasWidthHalf; _v2.positionScreen.y *= _canvasHeightHalf;
				_v3.positionScreen.x *= _canvasWidthHalf; _v3.positionScreen.y *= _canvasHeightHalf;

				if ( material.overdraw > 0 ) {

					expand( _v1.positionScreen, _v2.positionScreen, material.overdraw );
					expand( _v2.positionScreen, _v3.positionScreen, material.overdraw );
					expand( _v3.positionScreen, _v1.positionScreen, material.overdraw );

				}

				_elemBox.setFromPoints( [
					_v1.positionScreen,
					_v2.positionScreen,
					_v3.positionScreen
				] );

				if ( _clipBox.intersectsBox( _elemBox ) === true ) {

					renderFace3( _v1, _v2, _v3, 0, 1, 2, element, material );

				}

			}

			/* DEBUG
			setLineWidth( 1 );
			setStrokeStyle( 'rgba( 0, 255, 0, 0.5 )' );
			_context.strokeRect( _elemBox.min.x, _elemBox.min.y, _elemBox.max.x - _elemBox.min.x, _elemBox.max.y - _elemBox.min.y );
			*/

			_clearBox.union( _elemBox );

		}

		/* DEBUG
		setLineWidth( 1 );
		setStrokeStyle( 'rgba( 255, 0, 0, 0.5 )' );
		_context.strokeRect( _clearBox.min.x, _clearBox.min.y, _clearBox.max.x - _clearBox.min.x, _clearBox.max.y - _clearBox.min.y );
		*/

		_context.setTransform( 1, 0, 0, 1, 0, 0 );

	};

	//

	function calculateLights() {

		_ambientLight.setRGB( 0, 0, 0 );
		_directionalLights.setRGB( 0, 0, 0 );
		_pointLights.setRGB( 0, 0, 0 );

		for ( var l = 0, ll = _lights.length; l < ll; l ++ ) {

			var light = _lights[ l ];
			var lightColor = light.color;

			if ( light instanceof THREE.AmbientLight ) {

				_ambientLight.add( lightColor );

			} else if ( light instanceof THREE.DirectionalLight ) {

				// for sprites

				_directionalLights.add( lightColor );

			} else if ( light instanceof THREE.PointLight ) {

				// for sprites

				_pointLights.add( lightColor );

			}

		}

	}

	function calculateLight( position, normal, color ) {

		for ( var l = 0, ll = _lights.length; l < ll; l ++ ) {

			var light = _lights[ l ];

			_lightColor.copy( light.color );

			if ( light instanceof THREE.DirectionalLight ) {

				var lightPosition = _vector3.setFromMatrixPosition( light.matrixWorld ).normalize();

				var amount = normal.dot( lightPosition );

				if ( amount <= 0 ) continue;

				amount *= light.intensity;

				color.add( _lightColor.multiplyScalar( amount ) );

			} else if ( light instanceof THREE.PointLight ) {

				var lightPosition = _vector3.setFromMatrixPosition( light.matrixWorld );

				var amount = normal.dot( _vector3.subVectors( lightPosition, position ).normalize() );

				if ( amount <= 0 ) continue;

				amount *= light.distance == 0 ? 1 : 1 - Math.min( position.distanceTo( lightPosition ) / light.distance, 1 );

				if ( amount == 0 ) continue;

				amount *= light.intensity;

				color.add( _lightColor.multiplyScalar( amount ) );

			}

		}

	}

	function renderSprite( v1, element, material ) {

		setOpacity( material.opacity );
		setBlending( material.blending );

		var scaleX = element.scale.x * _canvasWidthHalf;
		var scaleY = element.scale.y * _canvasHeightHalf;

		var dist = 0.5 * Math.sqrt( scaleX * scaleX + scaleY * scaleY ); // allow for rotated sprite
		_elemBox.min.set( v1.x - dist, v1.y - dist );
		_elemBox.max.set( v1.x + dist, v1.y + dist );

		if ( material instanceof THREE.SpriteMaterial ) {

			var texture = material.map;

			if ( texture !== null ) {

				var pattern = _patterns[ texture.id ];

				if ( pattern === undefined || pattern.version !== texture.version ) {

					pattern = textureToPattern( texture );
					_patterns[ texture.id ] = pattern;

				}

				if ( pattern.canvas !== undefined ) {

					setFillStyle( pattern.canvas );

					var bitmap = texture.image;

					var ox = bitmap.width * texture.offset.x;
					var oy = bitmap.height * texture.offset.y;

					var sx = bitmap.width * texture.repeat.x;
					var sy = bitmap.height * texture.repeat.y;

					var cx = scaleX / sx;
					var cy = scaleY / sy;

					_context.save();
					_context.translate( v1.x, v1.y );
					if ( material.rotation !== 0 ) _context.rotate( material.rotation );
					_context.translate( - scaleX / 2, - scaleY / 2 );
					_context.scale( cx, cy );
					_context.translate( - ox, - oy );
					_context.fillRect( ox, oy, sx, sy );
					_context.restore();

				}

			} else {

				// no texture

				setFillStyle( material.color.getStyle() );

				_context.save();
				_context.translate( v1.x, v1.y );
				if ( material.rotation !== 0 ) _context.rotate( material.rotation );
				_context.scale( scaleX, - scaleY );
				_context.fillRect( - 0.5, - 0.5, 1, 1 );
				_context.restore();

			}

		} else if ( material instanceof THREE.SpriteCanvasMaterial ) {

			setStrokeStyle( material.color.getStyle() );
			setFillStyle( material.color.getStyle() );

			_context.save();
			_context.translate( v1.x, v1.y );
			if ( material.rotation !== 0 ) _context.rotate( material.rotation );
			_context.scale( scaleX, scaleY );

			material.program( _context );

			_context.restore();

		}

		/* DEBUG
		setStrokeStyle( 'rgb(255,255,0)' );
		_context.beginPath();
		_context.moveTo( v1.x - 10, v1.y );
		_context.lineTo( v1.x + 10, v1.y );
		_context.moveTo( v1.x, v1.y - 10 );
		_context.lineTo( v1.x, v1.y + 10 );
		_context.stroke();
		*/

	}

	function renderLine( v1, v2, element, material ) {

		setOpacity( material.opacity );
		setBlending( material.blending );

		_context.beginPath();
		_context.moveTo( v1.positionScreen.x, v1.positionScreen.y );
		_context.lineTo( v2.positionScreen.x, v2.positionScreen.y );

		if ( material instanceof THREE.LineBasicMaterial ) {

			setLineWidth( material.linewidth );
			setLineCap( material.linecap );
			setLineJoin( material.linejoin );

			if ( material.vertexColors !== THREE.VertexColors ) {

				setStrokeStyle( material.color.getStyle() );

			} else {

				var colorStyle1 = element.vertexColors[ 0 ].getStyle();
				var colorStyle2 = element.vertexColors[ 1 ].getStyle();

				if ( colorStyle1 === colorStyle2 ) {

					setStrokeStyle( colorStyle1 );

				} else {

					try {

						var grad = _context.createLinearGradient(
							v1.positionScreen.x,
							v1.positionScreen.y,
							v2.positionScreen.x,
							v2.positionScreen.y
						);
						grad.addColorStop( 0, colorStyle1 );
						grad.addColorStop( 1, colorStyle2 );

					} catch ( exception ) {

						grad = colorStyle1;

					}

					setStrokeStyle( grad );

				}

			}

			_context.stroke();
			_elemBox.expandByScalar( material.linewidth * 2 );

		} else if ( material instanceof THREE.LineDashedMaterial ) {

			setLineWidth( material.linewidth );
			setLineCap( material.linecap );
			setLineJoin( material.linejoin );
			setStrokeStyle( material.color.getStyle() );
			setLineDash( [ material.dashSize, material.gapSize ] );

			_context.stroke();

			_elemBox.expandByScalar( material.linewidth * 2 );

			setLineDash( [] );

		}

	}

	function renderFace3( v1, v2, v3, uv1, uv2, uv3, element, material ) {

		_this.info.render.vertices += 3;
		_this.info.render.faces ++;

		setOpacity( material.opacity );
		setBlending( material.blending );

		_v1x = v1.positionScreen.x; _v1y = v1.positionScreen.y;
		_v2x = v2.positionScreen.x; _v2y = v2.positionScreen.y;
		_v3x = v3.positionScreen.x; _v3y = v3.positionScreen.y;

		drawTriangle( _v1x, _v1y, _v2x, _v2y, _v3x, _v3y );

		if ( ( material instanceof THREE.MeshLambertMaterial || material instanceof THREE.MeshPhongMaterial ) && material.map === null ) {

			_diffuseColor.copy( material.color );
			_emissiveColor.copy( material.emissive );

			if ( material.vertexColors === THREE.FaceColors ) {

				_diffuseColor.multiply( element.color );

			}

			_color.copy( _ambientLight );

			_centroid.copy( v1.positionWorld ).add( v2.positionWorld ).add( v3.positionWorld ).divideScalar( 3 );

			calculateLight( _centroid, element.normalModel, _color );

			_color.multiply( _diffuseColor ).add( _emissiveColor );

			material.wireframe === true
				 ? strokePath( _color, material.wireframeLinewidth, material.wireframeLinecap, material.wireframeLinejoin )
				 : fillPath( _color );

		} else if ( material instanceof THREE.MeshBasicMaterial ||
				    material instanceof THREE.MeshLambertMaterial ||
				    material instanceof THREE.MeshPhongMaterial ) {

			if ( material.map !== null ) {

				var mapping = material.map.mapping;

				if ( mapping === THREE.UVMapping ) {

					_uvs = element.uvs;
					patternPath( _v1x, _v1y, _v2x, _v2y, _v3x, _v3y, _uvs[ uv1 ].x, _uvs[ uv1 ].y, _uvs[ uv2 ].x, _uvs[ uv2 ].y, _uvs[ uv3 ].x, _uvs[ uv3 ].y, material.map );

				}

			} else if ( material.envMap !== null ) {

				if ( material.envMap.mapping === THREE.SphericalReflectionMapping ) {

					_normal.copy( element.vertexNormalsModel[ uv1 ] ).applyMatrix3( _normalViewMatrix );
					_uv1x = 0.5 * _normal.x + 0.5;
					_uv1y = 0.5 * _normal.y + 0.5;

					_normal.copy( element.vertexNormalsModel[ uv2 ] ).applyMatrix3( _normalViewMatrix );
					_uv2x = 0.5 * _normal.x + 0.5;
					_uv2y = 0.5 * _normal.y + 0.5;

					_normal.copy( element.vertexNormalsModel[ uv3 ] ).applyMatrix3( _normalViewMatrix );
					_uv3x = 0.5 * _normal.x + 0.5;
					_uv3y = 0.5 * _normal.y + 0.5;

					patternPath( _v1x, _v1y, _v2x, _v2y, _v3x, _v3y, _uv1x, _uv1y, _uv2x, _uv2y, _uv3x, _uv3y, material.envMap );

				}

			} else {

				_color.copy( material.color );

				if ( material.vertexColors === THREE.FaceColors ) {

					_color.multiply( element.color );

				}

				material.wireframe === true
					 ? strokePath( _color, material.wireframeLinewidth, material.wireframeLinecap, material.wireframeLinejoin )
					 : fillPath( _color );

			}

		} else if ( material instanceof THREE.MeshNormalMaterial ) {

			_normal.copy( element.normalModel ).applyMatrix3( _normalViewMatrix );

			_color.setRGB( _normal.x, _normal.y, _normal.z ).multiplyScalar( 0.5 ).addScalar( 0.5 );

			material.wireframe === true
				 ? strokePath( _color, material.wireframeLinewidth, material.wireframeLinecap, material.wireframeLinejoin )
				 : fillPath( _color );

		} else {

			_color.setRGB( 1, 1, 1 );

			material.wireframe === true
				 ? strokePath( _color, material.wireframeLinewidth, material.wireframeLinecap, material.wireframeLinejoin )
				 : fillPath( _color );

		}

	}

	//

	function drawTriangle( x0, y0, x1, y1, x2, y2 ) {

		_context.beginPath();
		_context.moveTo( x0, y0 );
		_context.lineTo( x1, y1 );
		_context.lineTo( x2, y2 );
		_context.closePath();

	}

	function strokePath( color, linewidth, linecap, linejoin ) {

		setLineWidth( linewidth );
		setLineCap( linecap );
		setLineJoin( linejoin );
		setStrokeStyle( color.getStyle() );

		_context.stroke();

		_elemBox.expandByScalar( linewidth * 2 );

	}

	function fillPath( color ) {

		setFillStyle( color.getStyle() );
		_context.fill();

	}

	function textureToPattern( texture ) {

		if ( texture.version === 0 ||
			texture instanceof THREE.CompressedTexture ||
			texture instanceof THREE.DataTexture ) {

			return {
				canvas: undefined,
				version: texture.version
			};

		}

		var image = texture.image;

		if ( image.complete === false ) {

			return {
				canvas: undefined,
				version: 0
			};

		}

		var canvas = document.createElement( 'canvas' );
		canvas.width = image.width;
		canvas.height = image.height;

		var context = canvas.getContext( '2d' );
		context.setTransform( 1, 0, 0, - 1, 0, image.height );
		context.drawImage( image, 0, 0 );

		var repeatX = texture.wrapS === THREE.RepeatWrapping;
		var repeatY = texture.wrapT === THREE.RepeatWrapping;

		var repeat = 'no-repeat';

		if ( repeatX === true && repeatY === true ) {

			repeat = 'repeat';

		} else if ( repeatX === true ) {

			repeat = 'repeat-x';

		} else if ( repeatY === true ) {

			repeat = 'repeat-y';

		}

		var pattern = _context.createPattern( canvas, repeat );

		if ( texture.onUpdate ) texture.onUpdate( texture );

		return {
			canvas: pattern,
			version: texture.version
		};

	}

	function patternPath( x0, y0, x1, y1, x2, y2, u0, v0, u1, v1, u2, v2, texture ) {

		var pattern = _patterns[ texture.id ];

		if ( pattern === undefined || pattern.version !== texture.version ) {

			pattern = textureToPattern( texture );
			_patterns[ texture.id ] = pattern;

		}

		if ( pattern.canvas !== undefined ) {

			setFillStyle( pattern.canvas );

		} else {

			setFillStyle( 'rgba( 0, 0, 0, 1)' );
			_context.fill();
			return;

		}

		// http://extremelysatisfactorytotalitarianism.com/blog/?p=2120

		var a, b, c, d, e, f, det, idet,
		offsetX = texture.offset.x / texture.repeat.x,
		offsetY = texture.offset.y / texture.repeat.y,
		width = texture.image.width * texture.repeat.x,
		height = texture.image.height * texture.repeat.y;

		u0 = ( u0 + offsetX ) * width;
		v0 = ( v0 + offsetY ) * height;

		u1 = ( u1 + offsetX ) * width;
		v1 = ( v1 + offsetY ) * height;

		u2 = ( u2 + offsetX ) * width;
		v2 = ( v2 + offsetY ) * height;

		x1 -= x0; y1 -= y0;
		x2 -= x0; y2 -= y0;

		u1 -= u0; v1 -= v0;
		u2 -= u0; v2 -= v0;

		det = u1 * v2 - u2 * v1;

		if ( det === 0 ) return;

		idet = 1 / det;

		a = ( v2 * x1 - v1 * x2 ) * idet;
		b = ( v2 * y1 - v1 * y2 ) * idet;
		c = ( u1 * x2 - u2 * x1 ) * idet;
		d = ( u1 * y2 - u2 * y1 ) * idet;

		e = x0 - a * u0 - c * v0;
		f = y0 - b * u0 - d * v0;

		_context.save();
		_context.transform( a, b, c, d, e, f );
		_context.fill();
		_context.restore();

	}

	function clipImage( x0, y0, x1, y1, x2, y2, u0, v0, u1, v1, u2, v2, image ) {

		// http://extremelysatisfactorytotalitarianism.com/blog/?p=2120

		var a, b, c, d, e, f, det, idet,
		width = image.width - 1,
		height = image.height - 1;

		u0 *= width; v0 *= height;
		u1 *= width; v1 *= height;
		u2 *= width; v2 *= height;

		x1 -= x0; y1 -= y0;
		x2 -= x0; y2 -= y0;

		u1 -= u0; v1 -= v0;
		u2 -= u0; v2 -= v0;

		det = u1 * v2 - u2 * v1;

		idet = 1 / det;

		a = ( v2 * x1 - v1 * x2 ) * idet;
		b = ( v2 * y1 - v1 * y2 ) * idet;
		c = ( u1 * x2 - u2 * x1 ) * idet;
		d = ( u1 * y2 - u2 * y1 ) * idet;

		e = x0 - a * u0 - c * v0;
		f = y0 - b * u0 - d * v0;

		_context.save();
		_context.transform( a, b, c, d, e, f );
		_context.clip();
		_context.drawImage( image, 0, 0 );
		_context.restore();

	}

	// Hide anti-alias gaps

	function expand( v1, v2, pixels ) {

		var x = v2.x - v1.x, y = v2.y - v1.y,
		det = x * x + y * y, idet;

		if ( det === 0 ) return;

		idet = pixels / Math.sqrt( det );

		x *= idet; y *= idet;

		v2.x += x; v2.y += y;
		v1.x -= x; v1.y -= y;

	}

	// Context cached methods.

	function setOpacity( value ) {

		if ( _contextGlobalAlpha !== value ) {

			_context.globalAlpha = value;
			_contextGlobalAlpha = value;

		}

	}

	function setBlending( value ) {

		if ( _contextGlobalCompositeOperation !== value ) {

			if ( value === THREE.NormalBlending ) {

				_context.globalCompositeOperation = 'source-over';

			} else if ( value === THREE.AdditiveBlending ) {

				_context.globalCompositeOperation = 'lighter';

			} else if ( value === THREE.SubtractiveBlending ) {

				_context.globalCompositeOperation = 'darker';

			} else if ( value === THREE.MultiplyBlending ) {

				_context.globalCompositeOperation = 'multiply';

			}

			_contextGlobalCompositeOperation = value;

		}

	}

	function setLineWidth( value ) {

		if ( _contextLineWidth !== value ) {

			_context.lineWidth = value;
			_contextLineWidth = value;

		}

	}

	function setLineCap( value ) {

		// "butt", "round", "square"

		if ( _contextLineCap !== value ) {

			_context.lineCap = value;
			_contextLineCap = value;

		}

	}

	function setLineJoin( value ) {

		// "round", "bevel", "miter"

		if ( _contextLineJoin !== value ) {

			_context.lineJoin = value;
			_contextLineJoin = value;

		}

	}

	function setStrokeStyle( value ) {

		if ( _contextStrokeStyle !== value ) {

			_context.strokeStyle = value;
			_contextStrokeStyle = value;

		}

	}

	function setFillStyle( value ) {

		if ( _contextFillStyle !== value ) {

			_context.fillStyle = value;
			_contextFillStyle = value;

		}

	}

	function setLineDash( value ) {

		if ( _contextLineDash.length !== value.length ) {

			_context.setLineDash( value );
			_contextLineDash = value;

		}

	}

};

// File:examples/js/renderers/RaytracingRenderer.js

/**
 * RaytracingRenderer renders by raytracing it's scene. However, it does not
 * compute the pixels itself but it hands off and coordinates the taks for workers.
 * The workers compute the pixel values and this renderer simply paints it to the Canvas.
 *
 * @author zz85 / http://github.com/zz85
 */

THREE.RaytracingRenderer = function ( parameters ) {

	console.log( 'THREE.RaytracingRenderer', THREE.REVISION );

	parameters = parameters || {};

	var scope = this;
	var pool = [];
	var renderering = false;

	var canvas = document.createElement( 'canvas' );
	var context = canvas.getContext( '2d', {
		alpha: parameters.alpha === true
	} );

	var maxRecursionDepth = 3;

	var canvasWidth, canvasHeight;
	var canvasWidthHalf, canvasHeightHalf;

	var clearColor = new THREE.Color( 0x000000 );

	this.domElement = canvas;

	this.autoClear = true;

	var workers = parameters.workers;
	var blockSize = parameters.blockSize || 64;
	this.randomize = parameters.randomize;

	var toRender = [], workerId = 0, sceneId = 0;

	console.log( '%cSpinning off ' + workers + ' Workers ', 'font-size: 20px; background: black; color: white; font-family: monospace;' );

	this.setWorkers = function( w ) {

		workers = w || navigator.hardwareConcurrency || 4;

		while ( pool.length < workers ) {
			var worker = new Worker( parameters.workerPath );
			worker.id = workerId++;

			worker.onmessage = function( e ) {

				var data = e.data;

				if ( ! data ) return;

				if ( data.blockSize && sceneId == data.sceneId ) { // we match sceneId here to be sure

					var imagedata = new ImageData( new Uint8ClampedArray( data.data ), data.blockSize, data.blockSize );
					context.putImageData( imagedata, data.blockX, data.blockY );

					// completed

					console.log( 'Worker ' + this.id, data.time / 1000, ( Date.now() - reallyThen ) / 1000 + ' s' );

					if ( pool.length > workers ) {

						pool.splice( pool.indexOf( this ), 1 );
						return this.terminate();

					}

					renderNext( this );

				}

			}

			worker.color = new THREE.Color().setHSL( Math.random() , 0.8, 0.8 ).getHexString();
			pool.push( worker );

			if ( renderering ) {

				updateSettings( worker );

				worker.postMessage( {
					scene: sceneJSON,
					camera: cameraJSON,
					annex: materials,
					sceneId: sceneId
				} );

				renderNext( worker );

			}

		}

		if ( ! renderering ) {

			while ( pool.length > workers ) {

				pool.pop().terminate();

			}

		}

	};

	this.setWorkers( workers );

	this.setClearColor = function ( color, alpha ) {

		clearColor.set( color );

	};

	this.setPixelRatio = function () {};

	this.setSize = function ( width, height ) {

		canvas.width = width;
		canvas.height = height;

		canvasWidth = canvas.width;
		canvasHeight = canvas.height;

		canvasWidthHalf = Math.floor( canvasWidth / 2 );
		canvasHeightHalf = Math.floor( canvasHeight / 2 );

		context.fillStyle = 'white';

		pool.forEach( updateSettings );

	};

	this.setSize( canvas.width, canvas.height );

	this.clear = function () {

	};

	//

	var totalBlocks, xblocks, yblocks;

	function updateSettings( worker ) {

		worker.postMessage( {

			init: [ canvasWidth, canvasHeight ],
			worker: worker.id,
			// workers: pool.length,
			blockSize: blockSize

		} );

	}

	function renderNext( worker ) {
		if ( ! toRender.length ) {

			renderering = false;
			return scope.dispatchEvent( { type: "complete" } );

		}

		var current = toRender.pop();

		var blockX = ( current % xblocks ) * blockSize;
		var blockY = ( current / xblocks | 0 ) * blockSize;

		worker.postMessage( {
			render: true,
			x: blockX,
			y: blockY,
			sceneId: sceneId
		} );

		context.fillStyle = '#' + worker.color;

		context.fillRect( blockX, blockY, blockSize, blockSize );

	}

	var materials = {};

	var sceneJSON, cameraJSON, reallyThen;

	// additional properties that were not serialize automatically

	var _annex = {

		mirror: 1,
		reflectivity: 1,
		refractionRatio: 1,
		glass: 1,

	};

	function serializeObject( o ) {

		var mat = o.material;

		if ( ! mat || mat.uuid in materials ) return;

		var props = {};
		for ( var m in _annex ) {

			if ( mat[ m ] !== undefined ) {

				props[ m ] = mat[ m ];

			}

		}

		materials[ mat.uuid ] = props;
	}

	this.render = function ( scene, camera ) {

		renderering = true;

		// update scene graph

		if ( scene.autoUpdate === true ) scene.updateMatrixWorld();

		// update camera matrices

		if ( camera.parent === null ) camera.updateMatrixWorld();


		sceneJSON = scene.toJSON();
		cameraJSON = camera.toJSON();
		++ sceneId;

		scene.traverse( serializeObject );

		pool.forEach( function( worker ) {

			worker.postMessage( {
				scene: sceneJSON,
				camera: cameraJSON,
				annex: materials,
				sceneId: sceneId
			} );
		} );

		context.clearRect( 0, 0, canvasWidth, canvasHeight );
		reallyThen = Date.now();

		xblocks = Math.ceil( canvasWidth / blockSize );
		yblocks = Math.ceil( canvasHeight / blockSize );
		totalBlocks = xblocks * yblocks;

		toRender = [];

		for ( var i = 0; i < totalBlocks; i ++ ) {

			toRender.push( i );

		}


		// Randomize painting :)

		if ( scope.randomize ) {

			for ( var i = 0; i < totalBlocks; i ++ ) {

				var swap = Math.random()  * totalBlocks | 0;
				var tmp = toRender[ swap ];
				toRender[ swap ] = toRender[ i ];
				toRender[ i ] = tmp;

			}

		}


		pool.forEach( renderNext );

	};

};

Object.assign( THREE.RaytracingRenderer.prototype, THREE.EventDispatcher.prototype );

// File:examples/js/renderers/SoftwareRenderer.js

/**
 * @author mrdoob / http://mrdoob.com/
 * @author ryg / http://farbrausch.de/~fg
 * @author mraleph / http://mrale.ph/
 * @author daoshengmu / http://dsmu.me/
 */

THREE.SoftwareRenderer = function ( parameters ) {

	console.log( 'THREE.SoftwareRenderer', THREE.REVISION );

	parameters = parameters || {};

	var canvas = parameters.canvas !== undefined
			 ? parameters.canvas
			 : document.createElement( 'canvas' );

	var context = canvas.getContext( '2d', {
		alpha: parameters.alpha === true
	} );
	
	var alpha = parameters.alpha;

	var shaders = {};
	var textures = {};

	var canvasWidth, canvasHeight;
	var canvasWBlocks, canvasHBlocks;
	var viewportXScale, viewportYScale, viewportZScale;
	var viewportXOffs, viewportYOffs, viewportZOffs;

	var clearColor = new THREE.Color( 0x000000 );

	var imagedata, data, zbuffer;
	var numBlocks, blockMaxZ, blockFlags;

	var BLOCK_ISCLEAR = ( 1 << 0 );
	var BLOCK_NEEDCLEAR = ( 1 << 1 );

	var subpixelBits = 4;
	var subpixelBias = ( 1 << subpixelBits ) - 1;
	var blockShift = 3;
	var blockSize = 1 << blockShift;
	var maxZVal = ( 1 << 24 ); // Note: You want to size this so you don't get overflows.
	var lineMode = false;
	var lookVector = new THREE.Vector3( 0, 0, 1 );
	var crossVector = new THREE.Vector3();

	var rectx1 = Infinity, recty1 = Infinity;
	var rectx2 = 0, recty2 = 0;

	var prevrectx1 = Infinity, prevrecty1 = Infinity;
	var prevrectx2 = 0, prevrecty2 = 0;

	var projector = new THREE.Projector();

	var spriteV1 = new THREE.Vector4();
	var spriteV2 = new THREE.Vector4();
	var spriteV3 = new THREE.Vector4();

	var spriteUV1 = new THREE.Vector2();
	var spriteUV2 = new THREE.Vector2();
	var spriteUV3 = new THREE.Vector2();

	var mpVPool = [];
	var mpVPoolCount = 0;
	var mpNPool = [];
	var mpNPoolCount = 0;
	var mpUVPool = [];
	var mpUVPoolCount = 0;

	this.domElement = canvas;

	this.autoClear = true;

	// WebGLRenderer compatibility

	this.supportsVertexTextures = function () {};
	this.setFaceCulling = function () {};

	this.setClearColor = function ( color, alpha ) {

		clearColor.set( color );
		cleanColorBuffer();

	};

	this.setPixelRatio = function () {};

	this.setSize = function ( width, height ) {

		canvasWBlocks = Math.floor( width / blockSize );
		canvasHBlocks = Math.floor( height / blockSize );
		canvasWidth   = canvasWBlocks * blockSize;
		canvasHeight  = canvasHBlocks * blockSize;

		var fixScale = 1 << subpixelBits;

		viewportXScale =  fixScale * canvasWidth  / 2;
		viewportYScale = - fixScale * canvasHeight / 2;
		viewportZScale =             maxZVal      / 2;

		viewportXOffs  =  fixScale * canvasWidth  / 2 + 0.5;
		viewportYOffs  =  fixScale * canvasHeight / 2 + 0.5;
		viewportZOffs  =             maxZVal      / 2 + 0.5;

		canvas.width = canvasWidth;
		canvas.height = canvasHeight;

		context.fillStyle = alpha ? "rgba(0, 0, 0, 0)" : clearColor.getStyle();
		context.fillRect( 0, 0, canvasWidth, canvasHeight );

		imagedata = context.getImageData( 0, 0, canvasWidth, canvasHeight );
		data = imagedata.data;

		zbuffer = new Int32Array( data.length / 4 );

		numBlocks = canvasWBlocks * canvasHBlocks;
		blockMaxZ = new Int32Array( numBlocks );
		blockFlags = new Uint8Array( numBlocks );

		for ( var i = 0, l = zbuffer.length; i < l; i ++ ) {

			zbuffer[ i ] = maxZVal;

		}

		for ( var i = 0; i < numBlocks; i ++ ) {

			blockFlags[ i ] = BLOCK_ISCLEAR;

		}

		cleanColorBuffer();

	};

	this.setSize( canvas.width, canvas.height );

	this.clear = function () {

		rectx1 = Infinity;
		recty1 = Infinity;
		rectx2 = 0;
		recty2 = 0;
		mpVPoolCount = 0;
		mpNPoolCount = 0;
		mpUVPoolCount = 0;

		for ( var i = 0; i < numBlocks; i ++ ) {

			blockMaxZ[ i ] = maxZVal;
			blockFlags[ i ] = ( blockFlags[ i ] & BLOCK_ISCLEAR ) ? BLOCK_ISCLEAR : BLOCK_NEEDCLEAR;

		}

	};

    // TODO: Check why autoClear can't be false.
	this.render = function ( scene, camera ) {

		if ( this.autoClear === true ) this.clear();

		var renderData = projector.projectScene( scene, camera, false, false );
		var elements = renderData.elements;

		for ( var e = 0, el = elements.length; e < el; e ++ ) {

			var element = elements[ e ];
			var material = element.material;
			var shader = getMaterialShader( material );

			if ( !shader ) continue;

			if ( element instanceof THREE.RenderableFace ) {

				if ( ! element.uvs ) {

					drawTriangle(
						element.v1.positionScreen,
						element.v2.positionScreen,
						element.v3.positionScreen,
						null, null, null,
						shader, element, material
					);

				} else {

					drawTriangle(
						element.v1.positionScreen,
						element.v2.positionScreen,
						element.v3.positionScreen,
						element.uvs[ 0 ], element.uvs[ 1 ], element.uvs[ 2 ],
						shader, element, material
					);

				}


			} else if ( element instanceof THREE.RenderableSprite ) {

				var scaleX = element.scale.x * 0.5;
				var scaleY = element.scale.y * 0.5;

				spriteV1.copy( element );
				spriteV1.x -= scaleX;
				spriteV1.y += scaleY;

				spriteV2.copy( element );
				spriteV2.x -= scaleX;
				spriteV2.y -= scaleY;

				spriteV3.copy( element );
				spriteV3.x += scaleX;
				spriteV3.y += scaleY;

				if ( material.map ) {

					spriteUV1.set( 0, 1 );
					spriteUV2.set( 0, 0 );
					spriteUV3.set( 1, 1 );

					drawTriangle(
						spriteV1, spriteV2, spriteV3,
						spriteUV1, spriteUV2, spriteUV3,
						shader, element, material
					);

				} else {

					drawTriangle(
						spriteV1, spriteV2, spriteV3,
						null, null, null,
						shader, element, material
					);

				}

				spriteV1.copy( element );
				spriteV1.x += scaleX;
				spriteV1.y += scaleY;

				spriteV2.copy( element );
				spriteV2.x -= scaleX;
				spriteV2.y -= scaleY;

				spriteV3.copy( element );
				spriteV3.x += scaleX;
				spriteV3.y -= scaleY;

				if ( material.map ) {

					spriteUV1.set( 1, 1 );
					spriteUV2.set( 0, 0 );
					spriteUV3.set( 1, 0 );

					drawTriangle(
						spriteV1, spriteV2, spriteV3,
						spriteUV1, spriteUV2, spriteUV3,
						shader, element, material
					);

				} else {

					drawTriangle(
						spriteV1, spriteV2, spriteV3,
						null, null, null,
						shader, element, material
					);

				}

			} else if ( element instanceof THREE.RenderableLine ) {

				var shader = getMaterialShader( material );

				drawLine(
					element.v1.positionScreen,
					element.v2.positionScreen,
					element.vertexColors[0],
					element.vertexColors[1],
					shader,
					material
				);
			}

		}

		finishClear();

		var x = Math.min( rectx1, prevrectx1 );
		var y = Math.min( recty1, prevrecty1 );
		var width = Math.max( rectx2, prevrectx2 ) - x;
		var height = Math.max( recty2, prevrecty2 ) - y;

		/*
		// debug; draw zbuffer

		for ( var i = 0, l = zbuffer.length; i < l; i++ ) {

			var o = i * 4;
			var v = (65535 - zbuffer[ i ]) >> 3;
			data[ o + 0 ] = v;
			data[ o + 1 ] = v;
			data[ o + 2 ] = v;
			data[ o + 3 ] = 255;
		}
		*/

		if ( x !== Infinity ) {

			context.putImageData( imagedata, 0, 0, x, y, width, height );

		}

		prevrectx1 = rectx1; prevrecty1 = recty1;
		prevrectx2 = rectx2; prevrecty2 = recty2;

	};

	function setSize( width, height ) {

		canvasWBlocks = Math.floor( width / blockSize );
		canvasHBlocks = Math.floor( height / blockSize );
		canvasWidth   = canvasWBlocks * blockSize;
		canvasHeight  = canvasHBlocks * blockSize;

		var fixScale = 1 << subpixelBits;

		viewportXScale =  fixScale * canvasWidth  / 2;
		viewportYScale = -fixScale * canvasHeight / 2;
		viewportZScale =             maxZVal      / 2;

		viewportXOffs  =  fixScale * canvasWidth  / 2 + 0.5;
		viewportYOffs  =  fixScale * canvasHeight / 2 + 0.5;
		viewportZOffs  =             maxZVal      / 2 + 0.5;

		canvas.width = canvasWidth;
		canvas.height = canvasHeight;

		context.fillStyle = alpha ? "rgba(0, 0, 0, 0)" : clearColor.getStyle();
		context.fillRect( 0, 0, canvasWidth, canvasHeight );

		imagedata = context.getImageData( 0, 0, canvasWidth, canvasHeight );
		data = imagedata.data;

		zbuffer = new Int32Array( data.length / 4 );

		numBlocks = canvasWBlocks * canvasHBlocks;
		blockMaxZ = new Int32Array( numBlocks );
		blockFlags = new Uint8Array( numBlocks );

		for ( var i = 0, l = zbuffer.length; i < l; i ++ ) {

			zbuffer[ i ] = maxZVal;

		}

		for ( var i = 0; i < numBlocks; i ++ ) {

			blockFlags[ i ] = BLOCK_ISCLEAR;

		}

		cleanColorBuffer();
	}

	function cleanColorBuffer() {

		var size = canvasWidth * canvasHeight * 4;

		for ( var i = 0; i < size; i += 4 ) {

			data[ i ] = clearColor.r * 255 | 0;
			data[ i + 1 ] = clearColor.g * 255 | 0;
			data[ i + 2 ] = clearColor.b * 255 | 0;
			data[ i + 3 ] = alpha ? 0 : 255;

		}

		context.fillStyle = alpha ? "rgba(0, 0, 0, 0)" : clearColor.getStyle();
		context.fillRect( 0, 0, canvasWidth, canvasHeight );

	}

	function getPalette( material, bSimulateSpecular ) {

		var i = 0, j = 0;
		var diffuseR = material.color.r * 255;
		var diffuseG = material.color.g * 255;
		var diffuseB = material.color.b * 255;
		var palette = new Uint8Array( 256 * 3 );

		if ( bSimulateSpecular ) {

			while ( i < 204 ) {

				palette[ j ++ ] = Math.min( i * diffuseR / 204, 255 );
				palette[ j ++ ] = Math.min( i * diffuseG / 204, 255 );
				palette[ j ++ ] = Math.min( i * diffuseB / 204, 255 );
				++ i;

			}

			while ( i < 256 ) {

				// plus specular highlight
				palette[ j ++ ] = Math.min( diffuseR + ( i - 204 ) * ( 255 - diffuseR ) / 82, 255 );
				palette[ j ++ ] = Math.min( diffuseG + ( i - 204 ) * ( 255 - diffuseG ) / 82, 255 );
				palette[ j ++ ] = Math.min( diffuseB + ( i - 204 ) * ( 255 - diffuseB ) / 82, 255 );
				++ i;

			}

		} else {

			while ( i < 256 ) {

				palette[ j ++ ] = Math.min( i * diffuseR / 255, 255 );
				palette[ j ++ ] = Math.min( i * diffuseG / 255, 255 );
				palette[ j ++ ] = Math.min( i * diffuseB / 255, 255 );
				++ i;

			}

		}

		return palette;

	}

	function basicMaterialShader( buffer, depthBuf, offset, depth, u, v, n, face, material ) {

		var colorOffset = offset * 4;

		var texture = textures[ material.map.id ];

		if ( ! texture.data )
			return;

		var tdim = texture.width;
		var isTransparent = material.transparent;
		var tbound = tdim - 1;
		var tdata = texture.data;
		var tIndex = ( ( ( v * tdim ) & tbound ) * tdim + ( ( u * tdim ) & tbound ) ) * 4;

		if ( ! isTransparent ) {

			buffer[ colorOffset ] = tdata[ tIndex ];
			buffer[ colorOffset + 1 ] = tdata[ tIndex + 1 ];
			buffer[ colorOffset + 2 ] = tdata[ tIndex + 2 ];
			buffer[ colorOffset + 3 ] = ( material.opacity << 8 ) - 1;
			depthBuf[ offset ] = depth;

		} else {

			var srcR = tdata[ tIndex ];
			var srcG = tdata[ tIndex + 1 ];
			var srcB = tdata[ tIndex + 2 ];
			var opaci = tdata[ tIndex + 3 ] * material.opacity / 255;
			var destR = buffer[ colorOffset ];
			var destG = buffer[ colorOffset + 1 ];
			var destB = buffer[ colorOffset + 2 ];
	
			buffer[ colorOffset ] = ( srcR * opaci + destR * ( 1 - opaci ) );
			buffer[ colorOffset + 1 ] = ( srcG * opaci + destG * ( 1 - opaci ) );
			buffer[ colorOffset + 2 ] = ( srcB * opaci + destB * ( 1 - opaci ) );
			buffer[ colorOffset + 3 ] = ( material.opacity << 8 ) - 1;

			if ( buffer[ colorOffset + 3 ] == 255 )	// Only opaue pixls write to the depth buffer
				depthBuf[ offset ] = depth;
		}

	}

	function lightingMaterialShader( buffer, depthBuf, offset, depth, u, v, n, face, material ) {

		var colorOffset = offset * 4;

		var texture = textures[ material.map.id ];

		if ( ! texture.data )
			return;

		var tdim = texture.width;
		var isTransparent = material.transparent;
		var cIndex = ( n > 0 ? ( ~~ n ) : 0 ) * 3;
		var tbound = tdim - 1;
		var tdata = texture.data;
		var tIndex = ( ( ( v * tdim ) & tbound ) * tdim + ( ( u * tdim ) & tbound ) ) * 4;

		if ( ! isTransparent ) {

			buffer[ colorOffset ] = ( material.palette[ cIndex ] * tdata[ tIndex ] ) >> 8;
			buffer[ colorOffset + 1 ] = ( material.palette[ cIndex + 1 ] * tdata[ tIndex + 1 ] ) >> 8;
			buffer[ colorOffset + 2 ] = ( material.palette[ cIndex + 2 ] * tdata[ tIndex + 2 ] ) >> 8;
			buffer[ colorOffset + 3 ] = ( material.opacity << 8 ) - 1;
			depthBuf[ offset ] = depth;

		} else {

			var foreColorR = material.palette[ cIndex ] * tdata[ tIndex ];
			var foreColorG = material.palette[ cIndex + 1 ] * tdata[ tIndex + 1 ];
			var foreColorB = material.palette[ cIndex + 2 ] * tdata[ tIndex + 2 ];
			var opaci = tdata[ tIndex + 3 ] * material.opacity / 256;
			var destR = buffer[ colorOffset ];
			var destG = buffer[ colorOffset + 1 ];
			var destB = buffer[ colorOffset + 2 ];

			buffer[ colorOffset ] = foreColorR * opaci + destR * ( 1 - opaci );
			buffer[ colorOffset + 1 ] = foreColorG * opaci + destG * ( 1 - opaci );
			buffer[ colorOffset + 2 ] = foreColorB * opaci + destB * ( 1 - opaci );
			buffer[ colorOffset + 3 ] = ( material.opacity << 8 ) - 1;

			if ( buffer[ colorOffset + 3 ] == 255 )	// Only opaue pixls write to the depth buffer
				depthBuf[ offset ] = depth;
		}

	}

	function onMaterialUpdate ( event ) {

		var material = event.target;

		material.removeEventListener( 'update', onMaterialUpdate );

		delete shaders[ material.id ];

	}

	function getMaterialShader( material ) {

		var id = material.id;
		var shader = shaders[ id ];

		if ( shader && material.map && !textures[ material.map.id ] ) delete shaders[ id ];

		if ( shaders[ id ] === undefined ) {

			material.addEventListener( 'update', onMaterialUpdate );

			if ( material instanceof THREE.MeshBasicMaterial ||
				material instanceof THREE.MeshLambertMaterial ||
				material instanceof THREE.MeshPhongMaterial ||
				material instanceof THREE.SpriteMaterial ) {

				if ( material instanceof THREE.MeshLambertMaterial ) {

					// Generate color palette
					if ( ! material.palette ) {

						material.palette = getPalette( material, false );

					}

				} else if ( material instanceof THREE.MeshPhongMaterial ) {

					// Generate color palette
					if ( ! material.palette ) {

						material.palette = getPalette( material, true );

					}

				}

				var string;

				if ( material.map ) {

					var texture = new THREE.SoftwareRenderer.Texture();
					texture.fromImage( material.map.image );

					if ( !texture.data ) return;

					textures[ material.map.id ] = texture;

					if ( material instanceof THREE.MeshBasicMaterial
						|| material instanceof THREE.SpriteMaterial ) {

						shader = basicMaterialShader;

					} else {

						shader = lightingMaterialShader;

					}


				} else {

					if ( material.vertexColors === THREE.FaceColors ) {

						string = [
							'var colorOffset = offset * 4;',
							'buffer[ colorOffset ] = face.color.r * 255;',
							'buffer[ colorOffset + 1 ] = face.color.g * 255;',
							'buffer[ colorOffset + 2 ] = face.color.b * 255;',
							'buffer[ colorOffset + 3 ] = material.opacity * 255;',
							'depthBuf[ offset ] = depth;'
						].join( '\n' );

					} else {

						string = [
							'var colorOffset = offset * 4;',
							'buffer[ colorOffset ] = material.color.r * 255;',
							'buffer[ colorOffset + 1 ] = material.color.g * 255;',
							'buffer[ colorOffset + 2 ] = material.color.b * 255;',
							'buffer[ colorOffset + 3 ] = material.opacity * 255;',
							'depthBuf[ offset ] = depth;'
						].join( '\n' );

					}

					shader = new Function( 'buffer, depthBuf, offset, depth, u, v, n, face, material', string );

				}

			} else if ( material instanceof THREE.LineBasicMaterial ) {

				var string = [
					'var colorOffset = offset * 4;',
					'buffer[ colorOffset ] = material.color.r * (color1.r+color2.r) * 0.5 * 255;',
					'buffer[ colorOffset + 1 ] = material.color.g * (color1.g+color2.g) * 0.5 * 255;',
					'buffer[ colorOffset + 2 ] = material.color.b * (color1.b+color2.b) * 0.5 * 255;',
					'buffer[ colorOffset + 3 ] = 255;',
					'depthBuf[ offset ] = depth;'
				].join('\n');

				shader = new Function( 'buffer, depthBuf, offset, depth, color1, color2, material', string );

			} else {

				var string = [
					'var colorOffset = offset * 4;',
					'buffer[ colorOffset ] = u * 255;',
					'buffer[ colorOffset + 1 ] = v * 255;',
					'buffer[ colorOffset + 2 ] = 0;',
					'buffer[ colorOffset + 3 ] = 255;',
					'depthBuf[ offset ] = depth;'
				].join( '\n' );

				shader = new Function( 'buffer, depthBuf, offset, depth, u, v, n, face, material', string );

			}

			shaders[ id ] = shader;

		}

		return shader;

	}

	function clearRectangle( x1, y1, x2, y2 ) {

		var xmin = Math.max( Math.min( x1, x2 ), 0 );
		var xmax = Math.min( Math.max( x1, x2 ), canvasWidth );
		var ymin = Math.max( Math.min( y1, y2 ), 0 );
		var ymax = Math.min( Math.max( y1, y2 ), canvasHeight );

		var offset = ( xmin + ymin * canvasWidth ) * 4 + 3;
		var linestep = ( canvasWidth - ( xmax - xmin ) ) * 4;

		for ( var y = ymin; y < ymax; y ++ ) {

			for ( var x = xmin; x < xmax; x ++ ) {

				data[ offset += 4 ] = 0;

			}

			offset += linestep;

		}

	}

	function drawTriangle( v1, v2, v3, uv1, uv2, uv3, shader, face, material ) {

		// TODO: Implement per-pixel z-clipping

		if ( v1.z < - 1 || v1.z > 1 || v2.z < - 1 || v2.z > 1 || v3.z < - 1 || v3.z > 1 ) return;

		// https://gist.github.com/2486101
		// explanation: http://pouet.net/topic.php?which=8760&page=1

		var fixscale = ( 1 << subpixelBits );

		// 28.4 fixed-point coordinates

		var x1 = ( v1.x * viewportXScale + viewportXOffs ) | 0;
		var x2 = ( v2.x * viewportXScale + viewportXOffs ) | 0;
		var x3 = ( v3.x * viewportXScale + viewportXOffs ) | 0;

		var y1 = ( v1.y * viewportYScale + viewportYOffs ) | 0;
		var y2 = ( v2.y * viewportYScale + viewportYOffs ) | 0;
		var y3 = ( v3.y * viewportYScale + viewportYOffs ) | 0;

		var bHasNormal = face.vertexNormalsModel && face.vertexNormalsModel.length;
		var bHasUV = uv1 && uv2 && uv3;

		var longestSide = Math.max(
			Math.sqrt( (x1 - x2)*(x1 - x2) + (y1 - y2)*(y1 - y2) ),
			Math.sqrt( (x2 - x3)*(x2 - x3) + (y2 - y3)*(y2 - y3) ),
			Math.sqrt( (x3 - x1)*(x3 - x1) + (y3 - y1)*(y3 - y1) )
		);

		if( !(face instanceof THREE.RenderableSprite) 
			&& (longestSide > 100 * fixscale) ) {

			// 1
			// |\
			// |a\
			// |__\
			// |\c|\
			// |b\|d\
			// |__\__\
			// 2      3
			var tempFace = { vertexNormalsModel : [], 
						color : face.color };
			var mpUV12, mpUV23, mpUV31;
			if ( bHasUV ) {
				if ( mpUVPoolCount === mpUVPool.length ) {
					mpUV12 = new THREE.Vector2();
					mpUVPool.push( mpUV12 );
					++mpUVPoolCount;

					mpUV23 = new THREE.Vector2();
					mpUVPool.push( mpUV23 );
					++mpUVPoolCount;

					mpUV31 = new THREE.Vector2();
					mpUVPool.push( mpUV31 );
					++mpUVPoolCount;
				} else {
					mpUV12 = mpUVPool[ mpUVPoolCount ];
					++mpUVPoolCount;				
					mpUV23 = mpUVPool[ mpUVPoolCount ];
					++mpUVPoolCount;
					mpUV31 = mpUVPool[ mpUVPoolCount ];
					++mpUVPoolCount;
				}

				var weight;

				weight = (1 + v2.z) * (v2.w / v1.w) / (1 + v1.z);
				mpUV12.copy( uv1 ).multiplyScalar( weight ).add( uv2 ).multiplyScalar( 1 / (weight + 1) );
				weight = (1 + v3.z) * (v3.w / v2.w) / (1 + v2.z);
				mpUV23.copy( uv2 ).multiplyScalar( weight ).add( uv3 ).multiplyScalar( 1 / (weight + 1) );
				weight = (1 + v1.z) * (v1.w / v3.w) / (1 + v3.z);
				mpUV31.copy( uv3 ).multiplyScalar( weight ).add( uv1 ).multiplyScalar( 1 / (weight + 1) );
			}
			
			var mpV12, mpV23, mpV31;
			if ( mpVPoolCount === mpVPool.length ) {
				mpV12 = new THREE.Vector4();
				mpVPool.push( mpV12 );
				++mpVPoolCount;

				mpV23 = new THREE.Vector4();
				mpVPool.push( mpV23 );
				++mpVPoolCount;

				mpV31 = new THREE.Vector4();
				mpVPool.push( mpV31 );
				++mpVPoolCount;
			} else {
				mpV12 = mpVPool[ mpVPoolCount ];
				++mpVPoolCount;				
				mpV23 = mpVPool[ mpVPoolCount ];
				++mpVPoolCount;
				mpV31 = mpVPool[ mpVPoolCount ];
				++mpVPoolCount;
			}

			mpV12.copy( v1 ).add( v2 ).multiplyScalar( 0.5 );
			mpV23.copy( v2 ).add( v3 ).multiplyScalar( 0.5 );
			mpV31.copy( v3 ).add( v1 ).multiplyScalar( 0.5 );

			var mpN12, mpN23, mpN31;
			if( bHasNormal ) {
				if ( mpNPoolCount === mpNPool.length ) {
					mpN12 = new THREE.Vector3();
					mpNPool.push( mpN12 );
					++mpNPoolCount;

					mpN23 = new THREE.Vector3();
					mpNPool.push( mpN23 );
					++mpNPoolCount;

					mpN31 = new THREE.Vector3();
					mpNPool.push( mpN31 );
					++mpNPoolCount;
				} else {
					mpN12 = mpNPool[ mpNPoolCount ];
					++mpNPoolCount;				
					mpN23 = mpNPool[ mpNPoolCount ];
					++mpNPoolCount;
					mpN31 = mpNPool[ mpNPoolCount ];
					++mpNPoolCount;
				}

				mpN12.copy( face.vertexNormalsModel[ 0 ] ).add( face.vertexNormalsModel[ 1 ] ).normalize();
				mpN23.copy( face.vertexNormalsModel[ 1 ] ).add( face.vertexNormalsModel[ 2 ] ).normalize();
				mpN31.copy( face.vertexNormalsModel[ 2 ] ).add( face.vertexNormalsModel[ 0 ] ).normalize();
			}

			// a
			if( bHasNormal ) {
				tempFace.vertexNormalsModel[ 0 ] = face.vertexNormalsModel[ 0 ];
				tempFace.vertexNormalsModel[ 1 ] = mpN12;
				tempFace.vertexNormalsModel[ 2 ] = mpN31;
			}
			drawTriangle( v1, mpV12, mpV31, uv1, mpUV12, mpUV31, shader, tempFace, material );

			// b
			if( bHasNormal ) {
				tempFace.vertexNormalsModel[ 0 ] = face.vertexNormalsModel[ 1 ];
				tempFace.vertexNormalsModel[ 1 ] = mpN23;
				tempFace.vertexNormalsModel[ 2 ] = mpN12;
			}
			drawTriangle( v2, mpV23, mpV12, uv2, mpUV23, mpUV12, shader, tempFace, material );

			// c
			if( bHasNormal ) {
				tempFace.vertexNormalsModel[ 0 ] = mpN12;
				tempFace.vertexNormalsModel[ 1 ] = mpN23;
				tempFace.vertexNormalsModel[ 2 ] = mpN31;
			}
			drawTriangle( mpV12, mpV23, mpV31, mpUV12, mpUV23, mpUV31, shader, tempFace, material );

			// d
			if( bHasNormal ) {
				tempFace.vertexNormalsModel[ 0 ] = face.vertexNormalsModel[ 2 ];
				tempFace.vertexNormalsModel[ 1 ] = mpN31;
				tempFace.vertexNormalsModel[ 2 ] = mpN23;
			}
			drawTriangle( v3, mpV31, mpV23, uv3, mpUV31, mpUV23, shader, tempFace, material );

			return;
		}

		// Z values (.28 fixed-point)

		var z1 = ( v1.z * viewportZScale + viewportZOffs ) | 0;
		var z2 = ( v2.z * viewportZScale + viewportZOffs ) | 0;
		var z3 = ( v3.z * viewportZScale + viewportZOffs ) | 0;

		// UV values
		var bHasUV = false;
		var tu1, tv1, tu2, tv2, tu3, tv3;

		if ( uv1 && uv2 && uv3 ) {

			bHasUV = true;

			tu1 = uv1.x;
			tv1 = 1 - uv1.y;
			tu2 = uv2.x;
			tv2 = 1 - uv2.y;
			tu3 = uv3.x;
			tv3 = 1 - uv3.y;

		}

		// Normal values
		var n1, n2, n3, nz1, nz2, nz3;

		if ( bHasNormal ) {

			n1 = face.vertexNormalsModel[ 0 ];
			n2 = face.vertexNormalsModel[ 1 ];
			n3 = face.vertexNormalsModel[ 2 ];
			nz1 = n1.z * 255;
			nz2 = n2.z * 255;
			nz3 = n3.z * 255;

		}

		// Deltas

		var dx12 = x1 - x2, dy12 = y2 - y1;
		var dx23 = x2 - x3, dy23 = y3 - y2;
		var dx31 = x3 - x1, dy31 = y1 - y3;

		// Bounding rectangle

		var minx = Math.max( ( Math.min( x1, x2, x3 ) + subpixelBias ) >> subpixelBits, 0 );
		var maxx = Math.min( ( Math.max( x1, x2, x3 ) + subpixelBias ) >> subpixelBits, canvasWidth );
		var miny = Math.max( ( Math.min( y1, y2, y3 ) + subpixelBias ) >> subpixelBits, 0 );
		var maxy = Math.min( ( Math.max( y1, y2, y3 ) + subpixelBias ) >> subpixelBits, canvasHeight );

		rectx1 = Math.min( minx, rectx1 );
		rectx2 = Math.max( maxx, rectx2 );
		recty1 = Math.min( miny, recty1 );
		recty2 = Math.max( maxy, recty2 );

		// Block size, standard 8x8 (must be power of two)

		var q = blockSize;

		// Start in corner of 8x8 block

		minx &= ~ ( q - 1 );
		miny &= ~ ( q - 1 );

		// Constant part of half-edge functions

		var minXfixscale = ( minx << subpixelBits );
		var minYfixscale = ( miny << subpixelBits );

		var c1 = dy12 * ( ( minXfixscale ) - x1 ) + dx12 * ( ( minYfixscale ) - y1 );
		var c2 = dy23 * ( ( minXfixscale ) - x2 ) + dx23 * ( ( minYfixscale ) - y2 );
		var c3 = dy31 * ( ( minXfixscale ) - x3 ) + dx31 * ( ( minYfixscale ) - y3 );

		// Correct for fill convention

		if ( dy12 > 0 || ( dy12 == 0 && dx12 > 0 ) ) c1 ++;
		if ( dy23 > 0 || ( dy23 == 0 && dx23 > 0 ) ) c2 ++;
		if ( dy31 > 0 || ( dy31 == 0 && dx31 > 0 ) ) c3 ++;

		// Note this doesn't kill subpixel precision, but only because we test for >=0 (not >0).
		// It's a bit subtle. :)
		c1 = ( c1 - 1 ) >> subpixelBits;
		c2 = ( c2 - 1 ) >> subpixelBits;
		c3 = ( c3 - 1 ) >> subpixelBits;

		// Z interpolation setup

		var dz12 = z1 - z2, dz31 = z3 - z1;
		var invDet = 1.0 / ( dx12 * dy31 - dx31 * dy12 );
		var dzdx = ( invDet * ( dz12 * dy31 - dz31 * dy12 ) ); // dz per one subpixel step in x
		var dzdy = ( invDet * ( dz12 * dx31 - dx12 * dz31 ) ); // dz per one subpixel step in y

		// Z at top/left corner of rast area

		var cz = ( z1 + ( ( minXfixscale ) - x1 ) * dzdx + ( ( minYfixscale ) - y1 ) * dzdy ) | 0;

		// Z pixel steps

		dzdx = ( dzdx * fixscale ) | 0;
		dzdy = ( dzdy * fixscale ) | 0;

		var dtvdx, dtvdy, cbtu, cbtv;
		if ( bHasUV ) {

			// UV interpolation setup
			var dtu12 = tu1 - tu2, dtu31 = tu3 - tu1;
			var dtudx = ( invDet * ( dtu12 * dy31 - dtu31 * dy12 ) ); // dtu per one subpixel step in x
			var dtudy = ( invDet * ( dtu12 * dx31 - dx12 * dtu31 ) ); // dtu per one subpixel step in y
			var dtv12 = tv1 - tv2, dtv31 = tv3 - tv1;
			dtvdx = ( invDet * ( dtv12 * dy31 - dtv31 * dy12 ) ); // dtv per one subpixel step in x
			dtvdy = ( invDet * ( dtv12 * dx31 - dx12 * dtv31 ) ); // dtv per one subpixel step in y

			// UV at top/left corner of rast area
			cbtu = ( tu1 + ( minXfixscale - x1 ) * dtudx + ( minYfixscale - y1 ) * dtudy );
			cbtv = ( tv1 + ( minXfixscale - x1 ) * dtvdx + ( minYfixscale - y1 ) * dtvdy );

			// UV pixel steps
			dtudx = dtudx * fixscale;
			dtudy = dtudy * fixscale;
			dtvdx = dtvdx * fixscale;
			dtvdy = dtvdy * fixscale;

		}

		var dnxdx, dnzdy, cbnz;
		if ( bHasNormal ) {

			 // Normal interpolation setup
			var dnz12 = nz1 - nz2, dnz31 = nz3 - nz1;
			var dnzdx = ( invDet * ( dnz12 * dy31 - dnz31 * dy12 ) ); // dnz per one subpixel step in x
			var dnzdy = ( invDet * ( dnz12 * dx31 - dx12 * dnz31 ) ); // dnz per one subpixel step in y

			// Normal at top/left corner of rast area
			cbnz = ( nz1 + ( minXfixscale - x1 ) * dnzdx + ( minYfixscale - y1 ) * dnzdy );

			// Normal pixel steps
			dnzdx = ( dnzdx * fixscale );
			dnzdy = ( dnzdy * fixscale );

		}

		// Set up min/max corners
		var qm1 = q - 1; // for convenience
		var nmin1 = 0, nmax1 = 0;
		var nmin2 = 0, nmax2 = 0;
		var nmin3 = 0, nmax3 = 0;
		var nminz = 0, nmaxz = 0;
		if ( dx12 >= 0 ) nmax1 -= qm1 * dx12; else nmin1 -= qm1 * dx12;
		if ( dy12 >= 0 ) nmax1 -= qm1 * dy12; else nmin1 -= qm1 * dy12;
		if ( dx23 >= 0 ) nmax2 -= qm1 * dx23; else nmin2 -= qm1 * dx23;
		if ( dy23 >= 0 ) nmax2 -= qm1 * dy23; else nmin2 -= qm1 * dy23;
		if ( dx31 >= 0 ) nmax3 -= qm1 * dx31; else nmin3 -= qm1 * dx31;
		if ( dy31 >= 0 ) nmax3 -= qm1 * dy31; else nmin3 -= qm1 * dy31;
		if ( dzdx >= 0 ) nmaxz += qm1 * dzdx; else nminz += qm1 * dzdx;
		if ( dzdy >= 0 ) nmaxz += qm1 * dzdy; else nminz += qm1 * dzdy;

		// Loop through blocks
		var linestep = canvasWidth - q;

		var cb1 = c1;
		var cb2 = c2;
		var cb3 = c3;
		var cbz = cz;
		var qstep = - q;
		var e1x = qstep * dy12;
		var e2x = qstep * dy23;
		var e3x = qstep * dy31;
		var ezx = qstep * dzdx;

		var etux, etvx;
		if ( bHasUV ) {

			etux = qstep * dtudx;
			etvx = qstep * dtvdx;

		}

		var enzx;
		if ( bHasNormal ) {

			enzx = qstep * dnzdx;

		}

		var x0 = minx;

		for ( var y0 = miny; y0 < maxy; y0 += q ) {

			// New block line - keep hunting for tri outer edge in old block line dir
			while ( x0 >= minx && x0 < maxx && cb1 >= nmax1 && cb2 >= nmax2 && cb3 >= nmax3 ) {

				x0 += qstep;
				cb1 += e1x;
				cb2 += e2x;
				cb3 += e3x;
				cbz += ezx;

				if ( bHasUV ) {

					cbtu += etux;
					cbtv += etvx;

				}

				if ( bHasNormal ) {

					cbnz += enzx;

				}

			}

			// Okay, we're now in a block we know is outside. Reverse direction and go into main loop.
			qstep = - qstep;
			e1x = - e1x;
			e2x = - e2x;
			e3x = - e3x;
			ezx = - ezx;

			if ( bHasUV ) {

				etux = - etux;
				etvx = - etvx;

			}

			if ( bHasNormal ) {

				enzx = - enzx;

			}

			while ( 1 ) {

				// Step everything
				x0 += qstep;
				cb1 += e1x;
				cb2 += e2x;
				cb3 += e3x;
				cbz += ezx;

				if ( bHasUV ) {

					cbtu += etux;
					cbtv += etvx;

				}

				if ( bHasNormal ) {

					cbnz += enzx;

				}

				// We're done with this block line when at least one edge completely out
				// If an edge function is too small and decreasing in the current traversal
				// dir, we're done with this line.
				if ( x0 < minx || x0 >= maxx ) break;
				if ( cb1 < nmax1 ) if ( e1x < 0 ) break; else continue;
				if ( cb2 < nmax2 ) if ( e2x < 0 ) break; else continue;
				if ( cb3 < nmax3 ) if ( e3x < 0 ) break; else continue;

				// We can skip this block if it's already fully covered
				var blockX = x0 >> blockShift;
				var blockY = y0 >> blockShift;
				var blockId = blockX + blockY * canvasWBlocks;
				var minz = cbz + nminz;

				// farthest point in block closer than closest point in our tri?
				if ( blockMaxZ[ blockId ] < minz ) continue;

				// Need to do a deferred clear?
				var bflags = blockFlags[ blockId ];
				if ( bflags & BLOCK_NEEDCLEAR ) clearBlock( blockX, blockY );
				blockFlags[ blockId ] = bflags & ~ ( BLOCK_ISCLEAR | BLOCK_NEEDCLEAR );

				// Offset at top-left corner
				var offset = x0 + y0 * canvasWidth;

				// Accept whole block when fully covered
				if ( cb1 >= nmin1 && cb2 >= nmin2 && cb3 >= nmin3 ) {

					var maxz = cbz + nmaxz;
					blockMaxZ[ blockId ] = Math.min( blockMaxZ[ blockId ], maxz );

					var cy1 = cb1;
					var cy2 = cb2;
					var cyz = cbz;

					var cytu, cytv;
					if ( bHasUV ) {

						cytu = cbtu;
						cytv = cbtv;

					}

					var cynz;
					if ( bHasNormal ) {

						cynz = cbnz;

					}


					for ( var iy = 0; iy < q; iy ++ ) {

						var cx1 = cy1;
						var cx2 = cy2;
						var cxz = cyz;

						var cxtu;
						var cxtv;
						if ( bHasUV ) {

							cxtu = cytu;
							cxtv = cytv;

						}

						var cxnz;
						if ( bHasNormal ) {

							cxnz = cynz;

						}

						for ( var ix = 0; ix < q; ix ++ ) {

							var z = cxz;

							if ( z < zbuffer[ offset ] ) {

								shader( data, zbuffer, offset, z, cxtu, cxtv, cxnz, face, material );

							}

							cx1 += dy12;
							cx2 += dy23;
							cxz += dzdx;

							if ( bHasUV ) {

								cxtu += dtudx;
								cxtv += dtvdx;

							}

							if ( bHasNormal ) {

								cxnz += dnzdx;

							}

							offset ++;

						}

						cy1 += dx12;
						cy2 += dx23;
						cyz += dzdy;

						if ( bHasUV ) {

							cytu += dtudy;
							cytv += dtvdy;

						}

						if ( bHasNormal ) {

							cynz += dnzdy;

						}

						offset += linestep;

					}

				} else {

					// Partially covered block

					var cy1 = cb1;
					var cy2 = cb2;
					var cy3 = cb3;
					var cyz = cbz;

					var cytu, cytv;
					if ( bHasUV ) {

						cytu = cbtu;
						cytv = cbtv;

					}

					var cynz;
					if ( bHasNormal ) {

						cynz = cbnz;

					}

					for ( var iy = 0; iy < q; iy ++ ) {

						var cx1 = cy1;
						var cx2 = cy2;
						var cx3 = cy3;
						var cxz = cyz;

						var cxtu;
						var cxtv;
						if ( bHasUV ) {

							cxtu = cytu;
							cxtv = cytv;

						}

						var cxnz;
						if ( bHasNormal ) {

							cxnz = cynz;

						}

						for ( var ix = 0; ix < q; ix ++ ) {

							if ( ( cx1 | cx2 | cx3 ) >= 0 ) {

								var z = cxz;

								if ( z < zbuffer[ offset ] ) {

									shader( data, zbuffer, offset, z, cxtu, cxtv, cxnz, face, material );

								}

							}

							cx1 += dy12;
							cx2 += dy23;
							cx3 += dy31;
							cxz += dzdx;

							if ( bHasUV ) {

								cxtu += dtudx;
								cxtv += dtvdx;

							}

							if ( bHasNormal ) {

								cxnz += dnzdx;

							}

							offset ++;

						}

						cy1 += dx12;
						cy2 += dx23;
						cy3 += dx31;
						cyz += dzdy;

						if ( bHasUV ) {

							cytu += dtudy;
							cytv += dtvdy;

						}

						if ( bHasNormal ) {

							cynz += dnzdy;

						}

						offset += linestep;

					}

				}

			}

			// Advance to next row of blocks
			cb1 += q * dx12;
			cb2 += q * dx23;
			cb3 += q * dx31;
			cbz += q * dzdy;

			if ( bHasUV ) {

				cbtu += q * dtudy;
				cbtv += q * dtvdy;

			}

			if ( bHasNormal ) {

				cbnz += q * dnzdy;

			}

		}

	}

	// When drawing line, the blockShiftShift has to be zero. In order to clean pixel
	// Using color1 and color2 to interpolation pixel color
	// LineWidth is according to material.linewidth
	function drawLine( v1, v2, color1, color2, shader, material ) {

		// While the line mode is enable, blockSize has to be changed to 0.
		if ( !lineMode ) {
			lineMode = true;
			blockShift = 0;
			blockSize = 1 << blockShift;

			setSize( canvas.width, canvas.height );
		}

		// TODO: Implement per-pixel z-clipping
		if ( v1.z < -1 || v1.z > 1 || v2.z < -1 || v2.z > 1 ) return;

		var halfLineWidth = Math.floor( ( material.linewidth - 1 ) * 0.5 );

		// https://gist.github.com/2486101
		// explanation: http://pouet.net/topic.php?which=8760&page=1

		// 28.4 fixed-point coordinates
		var x1 = ( v1.x * viewportXScale + viewportXOffs ) | 0;
		var x2 = ( v2.x * viewportXScale + viewportXOffs ) | 0;

		var y1 = ( v1.y * viewportYScale + viewportYOffs ) | 0;
		var y2 = ( v2.y * viewportYScale + viewportYOffs ) | 0;

		var z1 = ( v1.z * viewportZScale + viewportZOffs ) | 0;
		var z2 = ( v2.z * viewportZScale + viewportZOffs ) | 0;

		// Deltas
		var dx12 = x1 - x2, dy12 = y1 - y2, dz12 = z1 - z2;

		// Bounding rectangle
		var minx = Math.max( ( Math.min( x1, x2 ) + subpixelBias ) >> subpixelBits, 0 );
		var maxx = Math.min( ( Math.max( x1, x2 ) + subpixelBias ) >> subpixelBits, canvasWidth );
		var miny = Math.max( ( Math.min( y1, y2 ) + subpixelBias ) >> subpixelBits, 0 );
		var maxy = Math.min( ( Math.max( y1, y2 ) + subpixelBias ) >> subpixelBits, canvasHeight );
		var minz = Math.max( ( Math.min( z1, z2 ) + subpixelBias ) >> subpixelBits, 0 );
		var maxz = ( Math.max( z1, z2 ) + subpixelBias ) >> subpixelBits;

		rectx1 = Math.min( minx, rectx1 );
		rectx2 = Math.max( maxx, rectx2 );
		recty1 = Math.min( miny, recty1 );
		recty2 = Math.max( maxy, recty2 );

		// Get the line's unit vector and cross vector
		var length = Math.sqrt( ( dy12 * dy12 ) + ( dx12 * dx12 ) );
		var unitX = ( dx12 / length );
		var unitY = ( dy12 / length );
		var unitZ = ( dz12 / length );
		var pixelX, pixelY, pixelZ;
		var pX, pY, pZ;
		crossVector.set( unitX, unitY, unitZ );
		crossVector.cross( lookVector );
		crossVector.normalize();

		while (length > 0) {

			// Get this pixel.
			pixelX = x2 + length * unitX;
			pixelY = y2 + length * unitY;
			pixelZ = z2 + length * unitZ;

			pixelX = ( pixelX + subpixelBias ) >> subpixelBits;
			pixelY = ( pixelY + subpixelBias ) >> subpixelBits;
			pZ = ( pixelZ + subpixelBias ) >> subpixelBits;

			// Draw line with line width
			for ( var i = -halfLineWidth; i <= halfLineWidth; ++i ) {

				// Compute the line pixels.
				// Get the pixels on the vector that crosses to the line vector
				pX = Math.floor( ( pixelX + crossVector.x * i ) );
				pY = Math.floor( ( pixelY + crossVector.y * i ) );

				// if pixel is over the rect. Continue
				if ( rectx1 >= pX || rectx2 <= pX || recty1 >= pY
					|| recty2 <= pY )
				continue;

				// Find this pixel at which block
				var blockX = pX >> blockShift;
				var blockY = pY >> blockShift;
				var blockId = blockX + blockY * canvasWBlocks;

				// Compare the pixel depth width z block.
				if ( blockMaxZ[ blockId ] < minz ) continue;

				blockMaxZ[ blockId ] = Math.min( blockMaxZ[ blockId ], maxz );

				var bflags = blockFlags[ blockId ];
				if ( bflags & BLOCK_NEEDCLEAR ) clearBlock( blockX, blockY );
				blockFlags[ blockId ] = bflags & ~( BLOCK_ISCLEAR | BLOCK_NEEDCLEAR );

				// draw pixel
				var offset = pX + pY * canvasWidth;

				if ( pZ < zbuffer[ offset ] ) {
					shader( data, zbuffer, offset, pZ, color1, color2, material );
				}
			}

			--length;
		}

	}

	function clearBlock( blockX, blockY ) {

		var zoffset = blockX * blockSize + blockY * blockSize * canvasWidth;
		var poffset = zoffset * 4;

		var zlinestep = canvasWidth - blockSize;
		var plinestep = zlinestep * 4;

		for ( var y = 0; y < blockSize; y ++ ) {

			for ( var x = 0; x < blockSize; x ++ ) {

				zbuffer[ zoffset ++ ] = maxZVal;

				data[ poffset ++ ] = clearColor.r * 255 | 0;
				data[ poffset ++ ] = clearColor.g * 255 | 0;
				data[ poffset ++ ] = clearColor.b * 255 | 0;
				data[ poffset ++ ] = alpha ? 0 : 255;

			}

			zoffset += zlinestep;
			poffset += plinestep;

		}

	}

	function finishClear( ) {

		var block = 0;

		for ( var y = 0; y < canvasHBlocks; y ++ ) {

			for ( var x = 0; x < canvasWBlocks; x ++ ) {

				if ( blockFlags[ block ] & BLOCK_NEEDCLEAR ) {

					clearBlock( x, y );
					blockFlags[ block ] = BLOCK_ISCLEAR;

				}

				block ++;

			}

		}

	}

};

THREE.SoftwareRenderer.Texture = function() {

	var canvas;

	this.fromImage = function( image ) {

		if ( ! image || image.width <= 0 || image.height <= 0 )
			return;

		if ( canvas === undefined ) {

			canvas = document.createElement( 'canvas' );

		}

		var size = image.width > image.height ? image.width : image.height;
		size = THREE.Math.nextPowerOfTwo( size );

		if ( canvas.width != size || canvas.height != size ) {

			canvas.width = size;
			canvas.height = size;

		}

		var ctx = canvas.getContext( '2d' );
		ctx.clearRect( 0, 0, size, size );
		ctx.drawImage( image, 0, 0, size, size );

		var imgData = ctx.getImageData( 0, 0, size, size );

		this.data = imgData.data;
		this.width = size;
		this.height = size;
		this.srcUrl = image.src;

	};

};

// File:examples/js/renderers/SVGRenderer.js

/**
 * @author mrdoob / http://mrdoob.com/
 */

THREE.SVGObject = function ( node ) {

	THREE.Object3D.call( this );

	this.node = node;

};

THREE.SVGObject.prototype = Object.create( THREE.Object3D.prototype );
THREE.SVGObject.prototype.constructor = THREE.SVGObject;

THREE.SVGRenderer = function () {

	console.log( 'THREE.SVGRenderer', THREE.REVISION );

	var _this = this,
	_renderData, _elements, _lights,
	_projector = new THREE.Projector(),
	_svg = document.createElementNS( 'http://www.w3.org/2000/svg', 'svg' ),
	_svgWidth, _svgHeight, _svgWidthHalf, _svgHeightHalf,

	_v1, _v2, _v3, _v4,

	_clipBox = new THREE.Box2(),
	_elemBox = new THREE.Box2(),

	_color = new THREE.Color(),
	_diffuseColor = new THREE.Color(),
	_ambientLight = new THREE.Color(),
	_directionalLights = new THREE.Color(),
	_pointLights = new THREE.Color(),
	_clearColor = new THREE.Color(),
	_clearAlpha = 1,

	_vector3 = new THREE.Vector3(), // Needed for PointLight
	_centroid = new THREE.Vector3(),
	_normal = new THREE.Vector3(),
	_normalViewMatrix = new THREE.Matrix3(),

	_viewMatrix = new THREE.Matrix4(),
	_viewProjectionMatrix = new THREE.Matrix4(),

	_svgPathPool = [], _svgLinePool = [], _svgRectPool = [],
	_svgNode, _pathCount = 0, _lineCount = 0, _rectCount = 0,
	_quality = 1;

	this.domElement = _svg;

	this.autoClear = true;
	this.sortObjects = true;
	this.sortElements = true;

	this.info = {

		render: {

			vertices: 0,
			faces: 0

		}

	};

	this.setQuality = function( quality ) {

		switch ( quality ) {

			case "high": _quality = 1; break;
			case "low": _quality = 0; break;

		}

	};

	// WebGLRenderer compatibility

	this.supportsVertexTextures = function () {};
	this.setFaceCulling = function () {};

	this.setClearColor = function ( color, alpha ) {

		_clearColor.set( color );
		_clearAlpha = alpha !== undefined ? alpha : 1;

	};

	this.setPixelRatio = function () {};

	this.setSize = function( width, height ) {

		_svgWidth = width; _svgHeight = height;
		_svgWidthHalf = _svgWidth / 2; _svgHeightHalf = _svgHeight / 2;

		_svg.setAttribute( 'viewBox', ( - _svgWidthHalf ) + ' ' + ( - _svgHeightHalf ) + ' ' + _svgWidth + ' ' + _svgHeight );
		_svg.setAttribute( 'width', _svgWidth );
		_svg.setAttribute( 'height', _svgHeight );

		_clipBox.min.set( - _svgWidthHalf, - _svgHeightHalf );
		_clipBox.max.set( _svgWidthHalf, _svgHeightHalf );

	};

	this.clear = function () {

		_pathCount = 0;
		_lineCount = 0;
		_rectCount = 0;

		while ( _svg.childNodes.length > 0 ) {

			_svg.removeChild( _svg.childNodes[ 0 ] );

		}

		_svg.style.backgroundColor = 'rgba(' + ( ( _clearColor.r * 255 ) | 0 ) + ',' + ( ( _clearColor.g * 255 ) | 0 ) + ',' + ( ( _clearColor.b * 255 ) | 0 ) + ',' + _clearAlpha + ')';

	};

	this.render = function ( scene, camera ) {

		if ( camera instanceof THREE.Camera === false ) {

			console.error( 'THREE.SVGRenderer.render: camera is not an instance of THREE.Camera.' );
			return;

		}

		if ( this.autoClear === true ) this.clear();

		_this.info.render.vertices = 0;
		_this.info.render.faces = 0;

		_viewMatrix.copy( camera.matrixWorldInverse.getInverse( camera.matrixWorld ) );
		_viewProjectionMatrix.multiplyMatrices( camera.projectionMatrix, _viewMatrix );

		_renderData = _projector.projectScene( scene, camera, this.sortObjects, this.sortElements );
		_elements = _renderData.elements;
		_lights = _renderData.lights;

		_normalViewMatrix.getNormalMatrix( camera.matrixWorldInverse );

		calculateLights( _lights );

		for ( var e = 0, el = _elements.length; e < el; e ++ ) {

			var element = _elements[ e ];
			var material = element.material;

			if ( material === undefined || material.opacity === 0 ) continue;

			_elemBox.makeEmpty();

			if ( element instanceof THREE.RenderableSprite ) {

				_v1 = element;
				_v1.x *= _svgWidthHalf; _v1.y *= - _svgHeightHalf;

				renderSprite( _v1, element, material );

			} else if ( element instanceof THREE.RenderableLine ) {

				_v1 = element.v1; _v2 = element.v2;

				_v1.positionScreen.x *= _svgWidthHalf; _v1.positionScreen.y *= - _svgHeightHalf;
				_v2.positionScreen.x *= _svgWidthHalf; _v2.positionScreen.y *= - _svgHeightHalf;

				_elemBox.setFromPoints( [ _v1.positionScreen, _v2.positionScreen ] );

				if ( _clipBox.intersectsBox( _elemBox ) === true ) {

					renderLine( _v1, _v2, element, material );

				}

			} else if ( element instanceof THREE.RenderableFace ) {

				_v1 = element.v1; _v2 = element.v2; _v3 = element.v3;

				if ( _v1.positionScreen.z < - 1 || _v1.positionScreen.z > 1 ) continue;
				if ( _v2.positionScreen.z < - 1 || _v2.positionScreen.z > 1 ) continue;
				if ( _v3.positionScreen.z < - 1 || _v3.positionScreen.z > 1 ) continue;

				_v1.positionScreen.x *= _svgWidthHalf; _v1.positionScreen.y *= - _svgHeightHalf;
				_v2.positionScreen.x *= _svgWidthHalf; _v2.positionScreen.y *= - _svgHeightHalf;
				_v3.positionScreen.x *= _svgWidthHalf; _v3.positionScreen.y *= - _svgHeightHalf;

				_elemBox.setFromPoints( [
					_v1.positionScreen,
					_v2.positionScreen,
					_v3.positionScreen
				] );

				if ( _clipBox.intersectsBox( _elemBox ) === true ) {

					renderFace3( _v1, _v2, _v3, element, material );

				}

			}

		}

		scene.traverseVisible( function ( object ) {

			 if ( object instanceof THREE.SVGObject ) {

				_vector3.setFromMatrixPosition( object.matrixWorld );
				_vector3.applyProjection( _viewProjectionMatrix );

				var x =   _vector3.x * _svgWidthHalf;
				var y = - _vector3.y * _svgHeightHalf;

				var node = object.node;
				node.setAttribute( 'transform', 'translate(' + x + ',' + y + ')' );

				_svg.appendChild( node );

			}

		} );

	};

	function calculateLights( lights ) {

		_ambientLight.setRGB( 0, 0, 0 );
		_directionalLights.setRGB( 0, 0, 0 );
		_pointLights.setRGB( 0, 0, 0 );

		for ( var l = 0, ll = lights.length; l < ll; l ++ ) {

			var light = lights[ l ];
			var lightColor = light.color;

			if ( light instanceof THREE.AmbientLight ) {

				_ambientLight.r += lightColor.r;
				_ambientLight.g += lightColor.g;
				_ambientLight.b += lightColor.b;

			} else if ( light instanceof THREE.DirectionalLight ) {

				_directionalLights.r += lightColor.r;
				_directionalLights.g += lightColor.g;
				_directionalLights.b += lightColor.b;

			} else if ( light instanceof THREE.PointLight ) {

				_pointLights.r += lightColor.r;
				_pointLights.g += lightColor.g;
				_pointLights.b += lightColor.b;

			}

		}

	}

	function calculateLight( lights, position, normal, color ) {

		for ( var l = 0, ll = lights.length; l < ll; l ++ ) {

			var light = lights[ l ];
			var lightColor = light.color;

			if ( light instanceof THREE.DirectionalLight ) {

				var lightPosition = _vector3.setFromMatrixPosition( light.matrixWorld ).normalize();

				var amount = normal.dot( lightPosition );

				if ( amount <= 0 ) continue;

				amount *= light.intensity;

				color.r += lightColor.r * amount;
				color.g += lightColor.g * amount;
				color.b += lightColor.b * amount;

			} else if ( light instanceof THREE.PointLight ) {

				var lightPosition = _vector3.setFromMatrixPosition( light.matrixWorld );

				var amount = normal.dot( _vector3.subVectors( lightPosition, position ).normalize() );

				if ( amount <= 0 ) continue;

				amount *= light.distance == 0 ? 1 : 1 - Math.min( position.distanceTo( lightPosition ) / light.distance, 1 );

				if ( amount == 0 ) continue;

				amount *= light.intensity;

				color.r += lightColor.r * amount;
				color.g += lightColor.g * amount;
				color.b += lightColor.b * amount;

			}

		}

	}

	function renderSprite( v1, element, material ) {

		var scaleX = element.scale.x * _svgWidthHalf;
		var scaleY = element.scale.y * _svgHeightHalf;

		_svgNode = getRectNode( _rectCount ++ );

		_svgNode.setAttribute( 'x', v1.x - ( scaleX * 0.5 ) );
		_svgNode.setAttribute( 'y', v1.y - ( scaleY * 0.5 ) );
		_svgNode.setAttribute( 'width', scaleX );
		_svgNode.setAttribute( 'height', scaleY );

		if ( material instanceof THREE.SpriteMaterial ) {

			_svgNode.setAttribute( 'style', 'fill: ' + material.color.getStyle() );

		}

		_svg.appendChild( _svgNode );

	}

	function renderLine( v1, v2, element, material ) {

		_svgNode = getLineNode( _lineCount ++ );

		_svgNode.setAttribute( 'x1', v1.positionScreen.x );
		_svgNode.setAttribute( 'y1', v1.positionScreen.y );
		_svgNode.setAttribute( 'x2', v2.positionScreen.x );
		_svgNode.setAttribute( 'y2', v2.positionScreen.y );

		if ( material instanceof THREE.LineBasicMaterial ) {

			_svgNode.setAttribute( 'style', 'fill: none; stroke: ' + material.color.getStyle() + '; stroke-width: ' + material.linewidth + '; stroke-opacity: ' + material.opacity + '; stroke-linecap: ' + material.linecap + '; stroke-linejoin: ' + material.linejoin );

			_svg.appendChild( _svgNode );

		}

	}

	function renderFace3( v1, v2, v3, element, material ) {

		_this.info.render.vertices += 3;
		_this.info.render.faces ++;

		_svgNode = getPathNode( _pathCount ++ );
		_svgNode.setAttribute( 'd', 'M ' + v1.positionScreen.x + ' ' + v1.positionScreen.y + ' L ' + v2.positionScreen.x + ' ' + v2.positionScreen.y + ' L ' + v3.positionScreen.x + ',' + v3.positionScreen.y + 'z' );

		if ( material instanceof THREE.MeshBasicMaterial ) {

			_color.copy( material.color );

			if ( material.vertexColors === THREE.FaceColors ) {

				_color.multiply( element.color );

			}

		} else if ( material instanceof THREE.MeshLambertMaterial || material instanceof THREE.MeshPhongMaterial ) {

			_diffuseColor.copy( material.color );

			if ( material.vertexColors === THREE.FaceColors ) {

				_diffuseColor.multiply( element.color );

			}

			_color.copy( _ambientLight );

			_centroid.copy( v1.positionWorld ).add( v2.positionWorld ).add( v3.positionWorld ).divideScalar( 3 );

			calculateLight( _lights, _centroid, element.normalModel, _color );

			_color.multiply( _diffuseColor ).add( material.emissive );

		} else if ( material instanceof THREE.MeshNormalMaterial ) {

			_normal.copy( element.normalModel ).applyMatrix3( _normalViewMatrix );

			_color.setRGB( _normal.x, _normal.y, _normal.z ).multiplyScalar( 0.5 ).addScalar( 0.5 );

		}

		if ( material.wireframe ) {

			_svgNode.setAttribute( 'style', 'fill: none; stroke: ' + _color.getStyle() + '; stroke-width: ' + material.wireframeLinewidth + '; stroke-opacity: ' + material.opacity + '; stroke-linecap: ' + material.wireframeLinecap + '; stroke-linejoin: ' + material.wireframeLinejoin );

		} else {

			_svgNode.setAttribute( 'style', 'fill: ' + _color.getStyle() + '; fill-opacity: ' + material.opacity );

		}

		_svg.appendChild( _svgNode );

	}

	function getLineNode( id ) {

		if ( _svgLinePool[ id ] == null ) {

			_svgLinePool[ id ] = document.createElementNS( 'http://www.w3.org/2000/svg', 'line' );

			if ( _quality == 0 ) {

				_svgLinePool[ id ].setAttribute( 'shape-rendering', 'crispEdges' ); //optimizeSpeed

			}

			return _svgLinePool[ id ];

		}

		return _svgLinePool[ id ];

	}

	function getPathNode( id ) {

		if ( _svgPathPool[ id ] == null ) {

			_svgPathPool[ id ] = document.createElementNS( 'http://www.w3.org/2000/svg', 'path' );

			if ( _quality == 0 ) {

				_svgPathPool[ id ].setAttribute( 'shape-rendering', 'crispEdges' ); //optimizeSpeed

			}

			return _svgPathPool[ id ];

		}

		return _svgPathPool[ id ];

	}

	function getRectNode( id ) {

		if ( _svgRectPool[ id ] == null ) {

			_svgRectPool[ id ] = document.createElementNS( 'http://www.w3.org/2000/svg', 'rect' );

			if ( _quality == 0 ) {

				_svgRectPool[ id ].setAttribute( 'shape-rendering', 'crispEdges' ); //optimizeSpeed

			}

			return _svgRectPool[ id ];

		}

		return _svgRectPool[ id ];

	}

};

// File:editor/js/libs/sortable.min.js

/*! Sortable 1.0.1 - MIT | git://github.com/rubaxa/Sortable.git */
!function(a){"use strict";"function"==typeof define&&define.amd?define(a):"undefined"!=typeof module&&"undefined"!=typeof module.exports?module.exports=a():"undefined"!=typeof Package?Sortable=a():window.Sortable=a()}(function(){"use strict";function a(a,b){this.el=a,this.options=b=b||{};var d={group:Math.random(),sort:!0,disabled:!1,store:null,handle:null,scroll:!0,scrollSensitivity:30,scrollSpeed:10,draggable:/[uo]l/i.test(a.nodeName)?"li":">*",ghostClass:"sortable-ghost",ignore:"a, img",filter:null,animation:0,setData:function(a,b){a.setData("Text",b.textContent)},dropBubble:!1,dragoverBubble:!1};for(var e in d)!(e in b)&&(b[e]=d[e]);var g=b.group;g&&"object"==typeof g||(g=b.group={name:g}),["pull","put"].forEach(function(a){a in g||(g[a]=!0)}),L.forEach(function(d){b[d]=c(this,b[d]||M),f(a,d.substr(2).toLowerCase(),b[d])},this),a[E]=g.name+" "+(g.put.join?g.put.join(" "):"");for(var h in this)"_"===h.charAt(0)&&(this[h]=c(this,this[h]));f(a,"mousedown",this._onTapStart),f(a,"touchstart",this._onTapStart),I&&f(a,"selectstart",this._onTapStart),f(a,"dragover",this._onDragOver),f(a,"dragenter",this._onDragOver),P.push(this._onDragOver),b.store&&this.sort(b.store.get(this))}function b(a){s&&s.state!==a&&(i(s,"display",a?"none":""),!a&&s.state&&t.insertBefore(s,q),s.state=a)}function c(a,b){var c=O.call(arguments,2);return b.bind?b.bind.apply(b,[a].concat(c)):function(){return b.apply(a,c.concat(O.call(arguments)))}}function d(a,b,c){if(a){c=c||G,b=b.split(".");var d=b.shift().toUpperCase(),e=new RegExp("\\s("+b.join("|")+")\\s","g");do if(">*"===d&&a.parentNode===c||(""===d||a.nodeName.toUpperCase()==d)&&(!b.length||((" "+a.className+" ").match(e)||[]).length==b.length))return a;while(a!==c&&(a=a.parentNode))}return null}function e(a){a.dataTransfer.dropEffect="move",a.preventDefault()}function f(a,b,c){a.addEventListener(b,c,!1)}function g(a,b,c){a.removeEventListener(b,c,!1)}function h(a,b,c){if(a)if(a.classList)a.classList[c?"add":"remove"](b);else{var d=(" "+a.className+" ").replace(/\s+/g," ").replace(" "+b+" ","");a.className=d+(c?" "+b:"")}}function i(a,b,c){var d=a&&a.style;if(d){if(void 0===c)return G.defaultView&&G.defaultView.getComputedStyle?c=G.defaultView.getComputedStyle(a,""):a.currentStyle&&(c=a.currentStyle),void 0===b?c:c[b];b in d||(b="-webkit-"+b),d[b]=c+("string"==typeof c?"":"px")}}function j(a,b,c){if(a){var d=a.getElementsByTagName(b),e=0,f=d.length;if(c)for(;f>e;e++)c(d[e],e);return d}return[]}function k(a){a.draggable=!1}function l(){J=!1}function m(a,b){var c=a.lastElementChild,d=c.getBoundingClientRect();return b.clientY-(d.top+d.height)>5&&c}function n(a){for(var b=a.tagName+a.className+a.src+a.href+a.textContent,c=b.length,d=0;c--;)d+=b.charCodeAt(c);return d.toString(36)}function o(a){for(var b=0;a&&(a=a.previousElementSibling)&&"TEMPLATE"!==a.nodeName.toUpperCase();)b++;return b}function p(a,b){var c,d;return function(){void 0===c&&(c=arguments,d=this,setTimeout(function(){1===c.length?a.call(d,c[0]):a.apply(d,c),c=void 0},b))}}var q,r,s,t,u,v,w,x,y,z,A,B,C,D={},E="Sortable"+(new Date).getTime(),F=window,G=F.document,H=F.parseInt,I=!!G.createElement("div").dragDrop,J=!1,K=function(a,b,c,d,e,f){var g=G.createEvent("Event");g.initEvent(b,!0,!0),g.item=c||a,g.from=d||a,g.clone=s,g.oldIndex=e,g.newIndex=f,a.dispatchEvent(g)},L="onAdd onUpdate onRemove onStart onEnd onFilter onSort".split(" "),M=function(){},N=Math.abs,O=[].slice,P=[];return a.prototype={constructor:a,_dragStarted:function(){h(q,this.options.ghostClass,!0),a.active=this,K(t,"start",q,t,y)},_onTapStart:function(a){var b=a.type,c=a.touches&&a.touches[0],e=(c||a).target,g=e,h=this.options,i=this.el,l=h.filter;if(!("mousedown"===b&&0!==a.button||h.disabled)){if(h.handle&&(e=d(e,h.handle,i)),e=d(e,h.draggable,i),y=o(e),"function"==typeof l){if(l.call(this,a,e,this))return K(g,"filter",e,i,y),void a.preventDefault()}else if(l&&(l=l.split(",").some(function(a){return a=d(g,a.trim(),i),a?(K(a,"filter",e,i,y),!0):void 0})))return void a.preventDefault();if(e&&!q&&e.parentNode===i){"selectstart"===b&&e.dragDrop(),B=a,t=this.el,q=e,v=q.nextSibling,A=this.options.group,q.draggable=!0,h.ignore.split(",").forEach(function(a){j(e,a.trim(),k)}),c&&(B={target:e,clientX:c.clientX,clientY:c.clientY},this._onDragStart(B,!0),a.preventDefault()),f(G,"mouseup",this._onDrop),f(G,"touchend",this._onDrop),f(G,"touchcancel",this._onDrop),f(q,"dragend",this),f(t,"dragstart",this._onDragStart),f(G,"dragover",this);try{G.selection?G.selection.empty():window.getSelection().removeAllRanges()}catch(m){}}}},_emulateDragOver:function(){if(C){i(r,"display","none");var a=G.elementFromPoint(C.clientX,C.clientY),b=a,c=this.options.group.name,d=P.length;if(b)do{if((" "+b[E]+" ").indexOf(c)>-1){for(;d--;)P[d]({clientX:C.clientX,clientY:C.clientY,target:a,rootEl:b});break}a=b}while(b=b.parentNode);i(r,"display","")}},_onTouchMove:function(a){if(B){var b=a.touches[0],c=b.clientX-B.clientX,d=b.clientY-B.clientY,e="translate3d("+c+"px,"+d+"px,0)";C=b,i(r,"webkitTransform",e),i(r,"mozTransform",e),i(r,"msTransform",e),i(r,"transform",e),this._onDrag(b),a.preventDefault()}},_onDragStart:function(a,b){var c=a.dataTransfer,d=this.options;if(this._offUpEvents(),"clone"==A.pull&&(s=q.cloneNode(!0),i(s,"display","none"),t.insertBefore(s,q)),b){var e,g=q.getBoundingClientRect(),h=i(q);r=q.cloneNode(!0),i(r,"top",g.top-H(h.marginTop,10)),i(r,"left",g.left-H(h.marginLeft,10)),i(r,"width",g.width),i(r,"height",g.height),i(r,"opacity","0.8"),i(r,"position","fixed"),i(r,"zIndex","100000"),t.appendChild(r),e=r.getBoundingClientRect(),i(r,"width",2*g.width-e.width),i(r,"height",2*g.height-e.height),f(G,"touchmove",this._onTouchMove),f(G,"touchend",this._onDrop),f(G,"touchcancel",this._onDrop),this._loopId=setInterval(this._emulateDragOver,150)}else c&&(c.effectAllowed="move",d.setData&&d.setData.call(this,c,q)),f(G,"drop",this);if(u=d.scroll,u===!0){u=t;do if(u.offsetWidth<u.scrollWidth||u.offsetHeight<u.scrollHeight)break;while(u=u.parentNode)}setTimeout(this._dragStarted,0)},_onDrag:p(function(a){if(t&&this.options.scroll){var b,c,d=this.options,e=d.scrollSensitivity,f=d.scrollSpeed,g=a.clientX,h=a.clientY,i=window.innerWidth,j=window.innerHeight,k=(e>=i-g)-(e>=g),l=(e>=j-h)-(e>=h);k||l?b=F:u&&(b=u,c=u.getBoundingClientRect(),k=(N(c.right-g)<=e)-(N(c.left-g)<=e),l=(N(c.bottom-h)<=e)-(N(c.top-h)<=e)),(D.vx!==k||D.vy!==l||D.el!==b)&&(D.el=b,D.vx=k,D.vy=l,clearInterval(D.pid),b&&(D.pid=setInterval(function(){b===F?F.scrollTo(F.scrollX+k*f,F.scrollY+l*f):(l&&(b.scrollTop+=l*f),k&&(b.scrollLeft+=k*f))},24)))}},30),_onDragOver:function(a){var c,e,f,g=this.el,h=this.options,j=h.group,k=j.put,n=A===j,o=h.sort;if(void 0!==a.preventDefault&&(a.preventDefault(),!h.dragoverBubble&&a.stopPropagation()),!J&&A&&(n?o||(f=!t.contains(q)):A.pull&&k&&(A.name===j.name||k.indexOf&&~k.indexOf(A.name)))&&(void 0===a.rootEl||a.rootEl===this.el)){if(c=d(a.target,h.draggable,g),e=q.getBoundingClientRect(),f)return b(!0),void(s||v?t.insertBefore(q,s||v):o||t.appendChild(q));if(0===g.children.length||g.children[0]===r||g===a.target&&(c=m(g,a))){if(c){if(c.animated)return;u=c.getBoundingClientRect()}b(n),g.appendChild(q),this._animate(e,q),c&&this._animate(u,c)}else if(c&&!c.animated&&c!==q&&void 0!==c.parentNode[E]){w!==c&&(w=c,x=i(c));var p,u=c.getBoundingClientRect(),y=u.right-u.left,z=u.bottom-u.top,B=/left|right|inline/.test(x.cssFloat+x.display),C=c.offsetWidth>q.offsetWidth,D=c.offsetHeight>q.offsetHeight,F=(B?(a.clientX-u.left)/y:(a.clientY-u.top)/z)>.5,G=c.nextElementSibling;J=!0,setTimeout(l,30),b(n),p=B?c.previousElementSibling===q&&!C||F&&C:G!==q&&!D||F&&D,p&&!G?g.appendChild(q):c.parentNode.insertBefore(q,p?G:c),this._animate(e,q),this._animate(u,c)}}},_animate:function(a,b){var c=this.options.animation;if(c){var d=b.getBoundingClientRect();i(b,"transition","none"),i(b,"transform","translate3d("+(a.left-d.left)+"px,"+(a.top-d.top)+"px,0)"),b.offsetWidth,i(b,"transition","all "+c+"ms"),i(b,"transform","translate3d(0,0,0)"),clearTimeout(b.animated),b.animated=setTimeout(function(){i(b,"transition",""),b.animated=!1},c)}},_offUpEvents:function(){g(G,"mouseup",this._onDrop),g(G,"touchmove",this._onTouchMove),g(G,"touchend",this._onDrop),g(G,"touchcancel",this._onDrop)},_onDrop:function(b){var c=this.el,d=this.options;clearInterval(this._loopId),clearInterval(D.pid),g(G,"drop",this),g(G,"dragover",this),g(c,"dragstart",this._onDragStart),this._offUpEvents(),b&&(b.preventDefault(),!d.dropBubble&&b.stopPropagation(),r&&r.parentNode.removeChild(r),q&&(g(q,"dragend",this),k(q),h(q,this.options.ghostClass,!1),t!==q.parentNode?(z=o(q),K(q.parentNode,"sort",q,t,y,z),K(t,"sort",q,t,y,z),K(q,"add",q,t,y,z),K(t,"remove",q,t,y,z)):(s&&s.parentNode.removeChild(s),q.nextSibling!==v&&(z=o(q),K(t,"update",q,t,y,z),K(t,"sort",q,t,y,z))),a.active&&K(t,"end",q,t,y,z)),t=q=r=v=s=B=C=w=x=A=a.active=null,this.save())},handleEvent:function(a){var b=a.type;"dragover"===b?(this._onDrag(a),e(a)):("drop"===b||"dragend"===b)&&this._onDrop(a)},toArray:function(){for(var a,b=[],c=this.el.children,e=0,f=c.length;f>e;e++)a=c[e],d(a,this.options.draggable,this.el)&&b.push(a.getAttribute("data-id")||n(a));return b},sort:function(a){var b={},c=this.el;this.toArray().forEach(function(a,e){var f=c.children[e];d(f,this.options.draggable,c)&&(b[a]=f)},this),a.forEach(function(a){b[a]&&(c.removeChild(b[a]),c.appendChild(b[a]))})},save:function(){var a=this.options.store;a&&a.set(this)},closest:function(a,b){return d(a,b||this.options.draggable,this.el)},option:function(a,b){var c=this.options;return void 0===b?c[a]:void(c[a]=b)},destroy:function(){var a=this.el,b=this.options;L.forEach(function(c){g(a,c.substr(2).toLowerCase(),b[c])}),g(a,"mousedown",this._onTapStart),g(a,"touchstart",this._onTapStart),g(a,"selectstart",this._onTapStart),g(a,"dragover",this._onDragOver),g(a,"dragenter",this._onDragOver),Array.prototype.forEach.call(a.querySelectorAll("[draggable]"),function(a){a.removeAttribute("draggable")}),P.splice(P.indexOf(this._onDragOver),1),this._onDrop(),this.el=null}},a.utils={on:f,off:g,css:i,find:j,bind:c,is:function(a,b){return!!d(a,b,a)},throttle:p,closest:d,toggleClass:h,dispatchEvent:K,index:o},a.version="1.0.1",a.create=function(b,c){return new a(b,c)},a});
// File:editor/js/libs/signals.min.js

/*

 JS Signals <http://millermedeiros.github.com/js-signals/>
 Released under the MIT license
 Author: Miller Medeiros
 Version: 0.7.4 - Build: 252 (2012/02/24 10:30 PM)
*/
(function(h){function g(a,b,c,d,e){this._listener=b;this._isOnce=c;this.context=d;this._signal=a;this._priority=e||0}function f(a,b){if(typeof a!=="function")throw Error("listener is a required param of {fn}() and should be a Function.".replace("{fn}",b));}var e={VERSION:"0.7.4"};g.prototype={active:!0,params:null,execute:function(a){var b;this.active&&this._listener&&(a=this.params?this.params.concat(a):a,b=this._listener.apply(this.context,a),this._isOnce&&this.detach());return b},detach:function(){return this.isBound()?
this._signal.remove(this._listener,this.context):null},isBound:function(){return!!this._signal&&!!this._listener},getListener:function(){return this._listener},_destroy:function(){delete this._signal;delete this._listener;delete this.context},isOnce:function(){return this._isOnce},toString:function(){return"[SignalBinding isOnce:"+this._isOnce+", isBound:"+this.isBound()+", active:"+this.active+"]"}};e.Signal=function(){this._bindings=[];this._prevParams=null};e.Signal.prototype={memorize:!1,_shouldPropagate:!0,
active:!0,_registerListener:function(a,b,c,d){var e=this._indexOfListener(a,c);if(e!==-1){if(a=this._bindings[e],a.isOnce()!==b)throw Error("You cannot add"+(b?"":"Once")+"() then add"+(!b?"":"Once")+"() the same listener without removing the relationship first.");}else a=new g(this,a,b,c,d),this._addBinding(a);this.memorize&&this._prevParams&&a.execute(this._prevParams);return a},_addBinding:function(a){var b=this._bindings.length;do--b;while(this._bindings[b]&&a._priority<=this._bindings[b]._priority);
this._bindings.splice(b+1,0,a)},_indexOfListener:function(a,b){for(var c=this._bindings.length,d;c--;)if(d=this._bindings[c],d._listener===a&&d.context===b)return c;return-1},has:function(a,b){return this._indexOfListener(a,b)!==-1},add:function(a,b,c){f(a,"add");return this._registerListener(a,!1,b,c)},addOnce:function(a,b,c){f(a,"addOnce");return this._registerListener(a,!0,b,c)},remove:function(a,b){f(a,"remove");var c=this._indexOfListener(a,b);c!==-1&&(this._bindings[c]._destroy(),this._bindings.splice(c,
1));return a},removeAll:function(){for(var a=this._bindings.length;a--;)this._bindings[a]._destroy();this._bindings.length=0},getNumListeners:function(){return this._bindings.length},halt:function(){this._shouldPropagate=!1},dispatch:function(a){if(this.active){var b=Array.prototype.slice.call(arguments),c=this._bindings.length,d;if(this.memorize)this._prevParams=b;if(c){d=this._bindings.slice();this._shouldPropagate=!0;do c--;while(d[c]&&this._shouldPropagate&&d[c].execute(b)!==!1)}}},forget:function(){this._prevParams=
null},dispose:function(){this.removeAll();delete this._bindings;delete this._prevParams},toString:function(){return"[Signal active:"+this.active+" numListeners:"+this.getNumListeners()+"]"}};typeof define==="function"&&define.amd?define(e):typeof module!=="undefined"&&module.exports?module.exports=e:h.signals=e})(this);
// File:editor/js/libs/ui.js

/**
 * @author mrdoob / http://mrdoob.com/
 */

var UI = {};

UI.Element = function ( dom ) {

	this.dom = dom;

};

UI.Element.prototype = {

	add: function () {

		for ( var i = 0; i < arguments.length; i ++ ) {

			var argument = arguments[ i ];

			if ( argument instanceof UI.Element ) {

				this.dom.appendChild( argument.dom );

			} else {

				console.error( 'UI.Element:', argument, 'is not an instance of UI.Element.' );

			}

		}

		return this;

	},

	remove: function () {

		for ( var i = 0; i < arguments.length; i ++ ) {

			var argument = arguments[ i ];

			if ( argument instanceof UI.Element ) {

				this.dom.removeChild( argument.dom );

			} else {

				console.error( 'UI.Element:', argument, 'is not an instance of UI.Element.' );

			}

		}

		return this;

	},

	clear: function () {

		while ( this.dom.children.length ) {

			this.dom.removeChild( this.dom.lastChild );

		}

	},

	setId: function ( id ) {

		this.dom.id = id;

		return this;

	},

	setClass: function ( name ) {

		this.dom.className = name;

		return this;

	},

	setStyle: function ( style, array ) {

		for ( var i = 0; i < array.length; i ++ ) {

			this.dom.style[ style ] = array[ i ];

		}

		return this;

	},

	setDisabled: function ( value ) {

		this.dom.disabled = value;

		return this;

	},

	setTextContent: function ( value ) {

		this.dom.textContent = value;

		return this;

	}

};

// properties

var properties = [ 'position', 'left', 'top', 'right', 'bottom', 'width', 'height', 'border', 'borderLeft',
'borderTop', 'borderRight', 'borderBottom', 'borderColor', 'display', 'overflow', 'margin', 'marginLeft', 'marginTop', 'marginRight', 'marginBottom', 'padding', 'paddingLeft', 'paddingTop', 'paddingRight', 'paddingBottom', 'color',
'background', 'backgroundColor', 'opacity', 'fontSize', 'fontWeight', 'textAlign', 'textDecoration', 'textTransform', 'cursor', 'zIndex','backgroundImage' ];


properties.forEach( function ( property ) {

	var method = 'set' + property.substr( 0, 1 ).toUpperCase() + property.substr( 1, property.length );

	UI.Element.prototype[ method ] = function () {

		this.setStyle( property, arguments );

		return this;

	};

} );

// events

var events = [ 'KeyUp', 'KeyDown', 'MouseOver', 'MouseOut', 'Click', 'DblClick', 'Change' ];

events.forEach( function ( event ) {

	var method = 'on' + event;

	UI.Element.prototype[ method ] = function ( callback ) {

		this.dom.addEventListener( event.toLowerCase(), callback.bind( this ), false );

		return this;

	};

} );

// Span

UI.Span = function () {

	UI.Element.call( this );

	this.dom = document.createElement( 'span' );

	return this;

};

UI.Span.prototype = Object.create( UI.Element.prototype );
UI.Span.prototype.constructor = UI.Span;

// Div

UI.Div = function () {

	UI.Element.call( this );

	this.dom = document.createElement( 'div' );

	return this;

};

UI.Div.prototype = Object.create( UI.Element.prototype );
UI.Div.prototype.constructor = UI.Div;

// Row

UI.Row = function () {

	UI.Element.call( this );

	var dom = document.createElement( 'div' );
	dom.className = 'Row';

	this.dom = dom;

	return this;

};

UI.Row.prototype = Object.create( UI.Element.prototype );
UI.Row.prototype.constructor = UI.Row;

// Panel

UI.Panel = function () {

	UI.Element.call( this );

	var dom = document.createElement( 'div' );
	dom.className = 'Panel';

	this.dom = dom;

	return this;

};

UI.Panel.prototype = Object.create( UI.Element.prototype );
UI.Panel.prototype.constructor = UI.Panel;


// Collapsible Panel

UI.CollapsiblePanel = function () {

	UI.Panel.call( this );

	this.setClass( 'Panel Collapsible' );

	var scope = this;

	this.static = new UI.Panel();
	this.static.setClass( 'Static' );
	this.static.onClick( function () {

		scope.toggle();

	} );
	this.dom.appendChild( this.static.dom );

	this.contents = new UI.Panel();
	this.contents.setClass( 'Content' );
	this.dom.appendChild( this.contents.dom );

	var button = new UI.Panel();
	button.setClass( 'Button' );
	this.static.add( button );

	this.isCollapsed = false;

	return this;

};

UI.CollapsiblePanel.prototype = Object.create( UI.Panel.prototype );
UI.CollapsiblePanel.prototype.constructor = UI.CollapsiblePanel;

UI.CollapsiblePanel.prototype.addStatic = function () {

	this.static.add.apply( this.static, arguments );
	return this;

};

UI.CollapsiblePanel.prototype.removeStatic = function () {

	this.static.remove.apply( this.static, arguments );
	return this;

};

UI.CollapsiblePanel.prototype.clearStatic = function () {

	this.static.clear();
	return this;

};

UI.CollapsiblePanel.prototype.add = function () {

	this.contents.add.apply( this.contents, arguments );
	return this;

};

UI.CollapsiblePanel.prototype.remove = function () {

	this.contents.remove.apply( this.contents, arguments );
	return this;

};

UI.CollapsiblePanel.prototype.clear = function () {

	this.contents.clear();
	return this;

};

UI.CollapsiblePanel.prototype.toggle = function() {

	this.setCollapsed( ! this.isCollapsed );

};

UI.CollapsiblePanel.prototype.collapse = function() {

	this.setCollapsed( true );

};

UI.CollapsiblePanel.prototype.expand = function() {

	this.setCollapsed( false );

};

UI.CollapsiblePanel.prototype.setCollapsed = function( boolean ) {

	if ( boolean ) {

		this.dom.classList.add( 'collapsed' );

	} else {

		this.dom.classList.remove( 'collapsed' );

	}

	this.isCollapsed = boolean;

	if ( this.onCollapsedChangeCallback !== undefined ) {

		this.onCollapsedChangeCallback( boolean );

	}

};

UI.CollapsiblePanel.prototype.onCollapsedChange = function ( callback ) {

	this.onCollapsedChangeCallback = callback;

};

// Text

UI.Text = function ( text ) {

	UI.Element.call( this );

	var dom = document.createElement( 'span' );
	dom.className = 'Text';
	dom.style.cursor = 'default';
	dom.style.display = 'inline-block';
	dom.style.verticalAlign = 'middle';

	this.dom = dom;
	this.setValue( text );

	return this;

};

UI.Text.prototype = Object.create( UI.Element.prototype );
UI.Text.prototype.constructor = UI.Text;

UI.Text.prototype.getValue = function () {

	return this.dom.textContent;

};

UI.Text.prototype.setValue = function ( value ) {

	if ( value !== undefined ) {

		this.dom.textContent = value;

	}

	return this;

};


// Input

UI.Input = function ( text ) {

	UI.Element.call( this );

	var scope = this;

	var dom = document.createElement( 'input' );
	dom.className = 'Input';
	dom.style.padding = '2px';
	dom.style.border = '1px solid transparent';

	dom.addEventListener( 'keydown', function ( event ) {

		event.stopPropagation();

	}, false );

	this.dom = dom;
	this.setValue( text );

	return this;

};

UI.Input.prototype = Object.create( UI.Element.prototype );
UI.Input.prototype.constructor = UI.Input;

UI.Input.prototype.getValue = function () {

	return this.dom.value;

};

UI.Input.prototype.setValue = function ( value ) {

	this.dom.value = value;

	return this;

};


// TextArea

UI.TextArea = function () {

	UI.Element.call( this );

	var scope = this;

	var dom = document.createElement( 'textarea' );
	dom.className = 'TextArea';
	dom.style.padding = '2px';
	dom.spellcheck = false;

	dom.addEventListener( 'keydown', function ( event ) {

		event.stopPropagation();

		if ( event.keyCode === 9 ) {

			event.preventDefault();

			var cursor = dom.selectionStart;

			dom.value = dom.value.substring( 0, cursor ) + '\t' + dom.value.substring( cursor );
			dom.selectionStart = cursor + 1;
			dom.selectionEnd = dom.selectionStart;

		}

	}, false );

	this.dom = dom;

	return this;

};

UI.TextArea.prototype = Object.create( UI.Element.prototype );
UI.TextArea.prototype.constructor = UI.TextArea;

UI.TextArea.prototype.getValue = function () {

	return this.dom.value;

};

UI.TextArea.prototype.setValue = function ( value ) {

	this.dom.value = value;

	return this;

};


// Select

UI.Select = function () {

	UI.Element.call( this );

	var scope = this;

	var dom = document.createElement( 'select' );
	dom.className = 'Select';
	dom.style.padding = '2px';

	this.dom = dom;

	return this;

};

UI.Select.prototype = Object.create( UI.Element.prototype );
UI.Select.prototype.constructor = UI.Select;

UI.Select.prototype.setMultiple = function ( boolean ) {

	this.dom.multiple = boolean;

	return this;

};

UI.Select.prototype.setOptions = function ( options ) {

	var selected = this.dom.value;

	while ( this.dom.children.length > 0 ) {

		this.dom.removeChild( this.dom.firstChild );

	}

	for ( var key in options ) {

		var option = document.createElement( 'option' );
		option.value = key;
		option.innerHTML = options[ key ];
		this.dom.appendChild( option );

	}

	this.dom.value = selected;

	return this;

};

UI.Select.prototype.getValue = function () {

	return this.dom.value;

};

UI.Select.prototype.setValue = function ( value ) {

	value = String( value );

	if ( this.dom.value !== value ) {

		this.dom.value = value;

	}

	return this;

};

// Checkbox

UI.Checkbox = function ( boolean ) {

	UI.Element.call( this );

	var scope = this;

	var dom = document.createElement( 'input' );
	dom.className = 'Checkbox';
	dom.type = 'checkbox';

	this.dom = dom;
	this.setValue( boolean );

	return this;

};

UI.Checkbox.prototype = Object.create( UI.Element.prototype );
UI.Checkbox.prototype.constructor = UI.Checkbox;

UI.Checkbox.prototype.getValue = function () {

	return this.dom.checked;

};

UI.Checkbox.prototype.setValue = function ( value ) {

	if ( value !== undefined ) {

		this.dom.checked = value;

	}

	return this;

};


// Color

UI.Color = function () {

	UI.Element.call( this );

	var scope = this;

	var dom = document.createElement( 'input' );
	dom.className = 'Color';
	dom.style.width = '64px';
	dom.style.height = '17px';
	dom.style.border = '0px';
	dom.style.padding = '2px';
	dom.style.backgroundColor = 'transparent';

	try {

		dom.type = 'color';
		dom.value = '#ffffff';

	} catch ( exception ) {}

	this.dom = dom;

	return this;

};

UI.Color.prototype = Object.create( UI.Element.prototype );
UI.Color.prototype.constructor = UI.Color;

UI.Color.prototype.getValue = function () {

	return this.dom.value;

};

UI.Color.prototype.getHexValue = function () {

	return parseInt( this.dom.value.substr( 1 ), 16 );

};

UI.Color.prototype.setValue = function ( value ) {

	this.dom.value = value;

	return this;

};

UI.Color.prototype.setHexValue = function ( hex ) {

	this.dom.value = '#' + ( '000000' + hex.toString( 16 ) ).slice( - 6 );

	return this;

};


// Number

UI.Number = function ( number ) {

	UI.Element.call( this );

	var scope = this;

	var dom = document.createElement( 'input' );
	dom.className = 'Number';
	dom.value = '0.00';

	dom.addEventListener( 'keydown', function ( event ) {

		event.stopPropagation();

		if ( event.keyCode === 13 ) dom.blur();

	}, false );

	this.value = 0;

	this.min = - Infinity;
	this.max = Infinity;

	this.precision = 2;
	this.step = 1;
	this.unit = '';

	this.dom = dom;

	this.setValue( number );

	var changeEvent = document.createEvent( 'HTMLEvents' );
	changeEvent.initEvent( 'change', true, true );

	var distance = 0;
	var onMouseDownValue = 0;

	var pointer = [ 0, 0 ];
	var prevPointer = [ 0, 0 ];

	function onMouseDown( event ) {

		event.preventDefault();

		distance = 0;

		onMouseDownValue = scope.value;

		prevPointer = [ event.clientX, event.clientY ];

		document.addEventListener( 'mousemove', onMouseMove, false );
		document.addEventListener( 'mouseup', onMouseUp, false );

	}

	function onMouseMove( event ) {

		var currentValue = scope.value;

		pointer = [ event.clientX, event.clientY ];

		distance += ( pointer[ 0 ] - prevPointer[ 0 ] ) - ( pointer[ 1 ] - prevPointer[ 1 ] );

		var value = onMouseDownValue + ( distance / ( event.shiftKey ? 5 : 50 ) ) * scope.step;
		value = Math.min( scope.max, Math.max( scope.min, value ) );

		if ( currentValue !== value ) {

			scope.setValue( value );
			dom.dispatchEvent( changeEvent );

		}

		prevPointer = [ event.clientX, event.clientY ];

	}

	function onMouseUp( event ) {

		document.removeEventListener( 'mousemove', onMouseMove, false );
		document.removeEventListener( 'mouseup', onMouseUp, false );

		if ( Math.abs( distance ) < 2 ) {

			dom.focus();
			dom.select();

		}

	}

	function onChange( event ) {

		scope.setValue( dom.value );

	}

	function onFocus( event ) {

		dom.style.backgroundColor = '';
		dom.style.cursor = '';

	}

	function onBlur( event ) {

		dom.style.backgroundColor = 'transparent';
		dom.style.cursor = 'col-resize';

	}

	onBlur();

	dom.addEventListener( 'mousedown', onMouseDown, false );
	dom.addEventListener( 'change', onChange, false );
	dom.addEventListener( 'focus', onFocus, false );
	dom.addEventListener( 'blur', onBlur, false );

	return this;

};

UI.Number.prototype = Object.create( UI.Element.prototype );
UI.Number.prototype.constructor = UI.Number;

UI.Number.prototype.getValue = function () {

	return this.value;

};

UI.Number.prototype.setValue = function ( value ) {

	if ( value !== undefined ) {

		value = parseFloat( value );

		if ( value < this.min ) value = this.min;
		if ( value > this.max ) value = this.max;

		this.value = value;
		this.dom.value = value.toFixed( this.precision ) + ' ' + this.unit;

	}

	return this;

};

UI.Number.prototype.setPrecision = function ( precision ) {

	this.precision = precision;

	return this;

};

UI.Number.prototype.setStep = function ( step ) {

	this.step = step;

	return this;

};

UI.Number.prototype.setRange = function ( min, max ) {

	this.min = min;
	this.max = max;

	return this;

};

UI.Number.prototype.setUnit = function ( unit ) {

	this.unit = unit;

	return this;

};

// Integer

UI.Integer = function ( number ) {

	UI.Element.call( this );

	var scope = this;

	var dom = document.createElement( 'input' );
	dom.className = 'Number';
	dom.value = '0';

	dom.addEventListener( 'keydown', function ( event ) {

		event.stopPropagation();

	}, false );

	this.value = 0;

	this.min = - Infinity;
	this.max = Infinity;

	this.step = 1;

	this.dom = dom;

	this.setValue( number );

	var changeEvent = document.createEvent( 'HTMLEvents' );
	changeEvent.initEvent( 'change', true, true );

	var distance = 0;
	var onMouseDownValue = 0;

	var pointer = [ 0, 0 ];
	var prevPointer = [ 0, 0 ];

	function onMouseDown( event ) {

		event.preventDefault();

		distance = 0;

		onMouseDownValue = scope.value;

		prevPointer = [ event.clientX, event.clientY ];

		document.addEventListener( 'mousemove', onMouseMove, false );
		document.addEventListener( 'mouseup', onMouseUp, false );

	}

	function onMouseMove( event ) {

		var currentValue = scope.value;

		pointer = [ event.clientX, event.clientY ];

		distance += ( pointer[ 0 ] - prevPointer[ 0 ] ) - ( pointer[ 1 ] - prevPointer[ 1 ] );

		var value = onMouseDownValue + ( distance / ( event.shiftKey ? 5 : 50 ) ) * scope.step;
		value = Math.min( scope.max, Math.max( scope.min, value ) ) | 0;

		if ( currentValue !== value ) {

			scope.setValue( value );
			dom.dispatchEvent( changeEvent );

		}

		prevPointer = [ event.clientX, event.clientY ];

	}

	function onMouseUp( event ) {

		document.removeEventListener( 'mousemove', onMouseMove, false );
		document.removeEventListener( 'mouseup', onMouseUp, false );

		if ( Math.abs( distance ) < 2 ) {

			dom.focus();
			dom.select();

		}

	}

	function onChange( event ) {

		scope.setValue( dom.value );

	}

	function onFocus( event ) {

		dom.style.backgroundColor = '';
		dom.style.cursor = '';

	}

	function onBlur( event ) {

		dom.style.backgroundColor = 'transparent';
		dom.style.cursor = 'col-resize';

	}

	onBlur();

	dom.addEventListener( 'mousedown', onMouseDown, false );
	dom.addEventListener( 'change', onChange, false );
	dom.addEventListener( 'focus', onFocus, false );
	dom.addEventListener( 'blur', onBlur, false );

	return this;

};

UI.Integer.prototype = Object.create( UI.Element.prototype );
UI.Integer.prototype.constructor = UI.Integer;

UI.Integer.prototype.getValue = function () {

	return this.value;

};

UI.Integer.prototype.setValue = function ( value ) {

	if ( value !== undefined ) {

		value = parseInt( value );

		this.value = value;
		this.dom.value = value;

	}

	return this;

};

UI.Number.prototype.setStep = function ( step ) {

	this.step = step;

	return this;

};

UI.Integer.prototype.setRange = function ( min, max ) {

	this.min = min;
	this.max = max;

	return this;

};


// Break

UI.Break = function () {

	UI.Element.call( this );

	var dom = document.createElement( 'br' );
	dom.className = 'Break';

	this.dom = dom;

	return this;

};

UI.Break.prototype = Object.create( UI.Element.prototype );
UI.Break.prototype.constructor = UI.Break;


// HorizontalRule

UI.HorizontalRule = function () {

	UI.Element.call( this );

	var dom = document.createElement( 'hr' );
	dom.className = 'HorizontalRule';

	this.dom = dom;

	return this;

};

UI.HorizontalRule.prototype = Object.create( UI.Element.prototype );
UI.HorizontalRule.prototype.constructor = UI.HorizontalRule;


// Button

UI.Button = function ( value ) {

	UI.Element.call( this );

	var dom = document.createElement( 'button' );
	dom.className = 'Button';

	this.dom = dom;
	this.dom.textContent = value;

	return this;

};

UI.Button.prototype = Object.create( UI.Element.prototype );
UI.Button.prototype.constructor = UI.Button;

UI.Button.prototype.setLabel = function ( value ) {

	this.dom.textContent = value;

	return this;

};


// Modal

UI.Modal = function ( value ) {

	var scope = this;

	var dom = document.createElement( 'div' );

	dom.style.position = 'absolute';
	dom.style.width = '100%';
	dom.style.height = '100%';
	dom.style.backgroundColor = 'rgba(0,0,0,0.5)';
	dom.style.display = 'none';
	dom.style.alignItems = 'center';
	dom.style.justifyContent = 'center';
	dom.addEventListener( 'click', function ( event ) {

		scope.hide();

	} );

	this.dom = dom;

	this.container = new UI.Panel();
	this.container.dom.style.width = '200px';
	this.container.dom.style.padding = '20px';
	this.container.dom.style.backgroundColor = '#ffffff';
	this.container.dom.style.boxShadow = '0px 5px 10px rgba(0,0,0,0.5)';

	this.add( this.container );

	return this;

};

UI.Modal.prototype = Object.create( UI.Element.prototype );
UI.Modal.prototype.constructor = UI.Modal;

UI.Modal.prototype.show = function ( content ) {

	this.container.clear();
	this.container.add( content );

	this.dom.style.display = 'flex';

	return this;

};

UI.Modal.prototype.hide = function () {

	this.dom.style.display = 'none';

	return this;

};

// File:editor/js/libs/ui.three.js

/**
 * @author mrdoob / http://mrdoob.com/
 */

UI.Texture = function ( mapping ) {

	UI.Element.call( this );

	var scope = this;

	var dom = document.createElement( 'span' );

	var input = document.createElement( 'input' );
	input.type = 'file';
	input.addEventListener( 'change', function ( event ) {

		loadFile( event.target.files[ 0 ] );

	} );

	var canvas = document.createElement( 'canvas' );
	canvas.width = 32;
	canvas.height = 16;
	canvas.style.cursor = 'pointer';
	canvas.style.marginRight = '5px';
	canvas.style.border = '1px solid #888';
	canvas.addEventListener( 'click', function ( event ) {

		input.click();

	}, false );
	canvas.addEventListener( 'drop', function ( event ) {

		event.preventDefault();
		event.stopPropagation();
		loadFile( event.dataTransfer.files[ 0 ] );

	}, false );
	dom.appendChild( canvas );

	var name = document.createElement( 'input' );
	name.disabled = true;
	name.style.width = '64px';
	name.style.border = '1px solid #ccc';
	dom.appendChild( name );

	var loadFile = function ( file ) {

		if ( file.type.match( 'image.*' ) ) {

			var reader = new FileReader();

			if ( file.type === 'image/targa' ) {

				reader.addEventListener( 'load', function ( event ) {

					var canvas = new THREE.TGALoader().parse( event.target.result );

					var texture = new THREE.CanvasTexture( canvas, mapping );
					texture.sourceFile = file.name;

					scope.setValue( texture );

					if ( scope.onChangeCallback ) scope.onChangeCallback();

				}, false );

				reader.readAsArrayBuffer( file );

			} else {

				reader.addEventListener( 'load', function ( event ) {

					var image = document.createElement( 'img' );
					image.addEventListener( 'load', function( event ) {

						var texture = new THREE.Texture( this, mapping );
						texture.sourceFile = file.name;
						texture.needsUpdate = true;

						scope.setValue( texture );

						if ( scope.onChangeCallback ) scope.onChangeCallback();

					}, false );

					image.src = event.target.result;

				}, false );

				reader.readAsDataURL( file );

			}

		}

	};

	this.dom = dom;
	this.texture = null;
	this.onChangeCallback = null;

	return this;

};

UI.Texture.prototype = Object.create( UI.Element.prototype );
UI.Texture.prototype.constructor = UI.Texture;

UI.Texture.prototype.getValue = function () {

	return this.texture;

};

UI.Texture.prototype.setValue = function ( texture ) {

	var canvas = this.dom.children[ 0 ];
	var name = this.dom.children[ 1 ];
	var context = canvas.getContext( '2d' );

	if ( texture !== null ) {

		var image = texture.image;

		if ( image !== undefined && image.width > 0 ) {

			name.value = texture.sourceFile;

			var scale = canvas.width / image.width;
			context.drawImage( image, 0, 0, image.width * scale, image.height * scale );

		} else {

			name.value = texture.sourceFile + ' (error)';
			context.clearRect( 0, 0, canvas.width, canvas.height );

		}

	} else {

		name.value = '';

		if ( context !== null ) {

			// Seems like context can be null if the canvas is not visible

			context.clearRect( 0, 0, canvas.width, canvas.height );

		}

	}

	this.texture = texture;

};

UI.Texture.prototype.onChange = function ( callback ) {

	this.onChangeCallback = callback;

	return this;

};

//Video
UI.Video = function ( mapping ) {

	UI.Element.call( this );

	var scope = this;

	var dom = document.createElement( 'span' );

	var input = document.createElement( 'input' );
	input.type = 'file';
	input.addEventListener( 'change', function ( event ) {

		loadFile( event.target.files[ 0 ] );

	} );

	var canvas = document.createElement( 'canvas' );
	canvas.width = 32;
	canvas.height = 16;
	canvas.style.cursor = 'pointer';
	canvas.style.marginRight = '5px';
	canvas.style.border = '1px solid #888';
	canvas.addEventListener( 'click', function ( event ) {

		input.click();

	}, false );
	canvas.addEventListener( 'drop', function ( event ) {

		event.preventDefault();
		event.stopPropagation();
		loadFile( event.dataTransfer.files[ 0 ] );

	}, false );
	dom.appendChild( canvas );

	var name = document.createElement( 'input' );
	name.disabled = true;
	name.style.width = '64px';
	name.style.border = '1px solid #ccc';
	dom.appendChild( name );

	var loadFile = function ( file ) {

		if ( file.type.match( 'video.*' ) ) {

			var reader = new FileReader();
			reader.addEventListener( 'load', function ( event ) {

				var video = document.createElement( 'video' );
				video.addEventListener( 'load', function( event ) {

					var videoTexture = new THREE.Texture( this );
					videoTexture.sourceFile = file.name;
					videoTexture.needsUpdate = true;

					scope.setValue( videoTexture );

					if ( scope.onChangeCallback ) scope.onChangeCallback();

				}, false );

				video.src = event.target.result;

			}, false );

			reader.readAsDataURL( file );

		}

	};

	this.dom = dom;
	this.texture = null;
	this.onChangeCallback = null;

	return this;

};

UI.Video.prototype = Object.create( UI.Element.prototype );
UI.Video.prototype.constructor = UI.Texture;

UI.Video.prototype.getValue = function () {

	return this.video;

};

UI.Video.prototype.setValue = function ( video ) {

	var canvas = this.dom.children[ 0 ];
	var name = this.dom.children[ 1 ];
	var context = canvas.getContext( '2d' );

	if ( video !== null ) {

		console.log(video.sourceFile);

		// var vid = texture.image;

		// if ( image !== undefined && image.width > 0 ) {

		// 	name.value = texture.sourceFile;

		// 	var scale = canvas.width / image.width;
		// 	context.drawImage( image, 0, 0, image.width * scale, image.height * scale );

		// } else {

		// 	name.value = texture.sourceFile + ' (error)';
		// 	context.clearRect( 0, 0, canvas.width, canvas.height );

		// }

	} else {

		name.value = '';
		context.clearRect( 0, 0, canvas.width, canvas.height );

	}

	this.texture = texture;

};

UI.Video.prototype.onChange = function ( callback ) {

	this.onChangeCallback = callback;

	return this;

};

// Outliner

UI.Outliner = function ( editor ) {

	UI.Element.call( this );

	var scope = this;

	var dom = document.createElement( 'div' );
	dom.className = 'Outliner';
	dom.tabIndex = 0;	// keyup event is ignored without setting tabIndex

	// hack
	this.scene = editor.scene;

	// Prevent native scroll behavior
	dom.addEventListener( 'keydown', function ( event ) {

		switch ( event.keyCode ) {
			case 38: // up
			case 40: // down
				event.preventDefault();
				event.stopPropagation();
				break;
		}

	}, false );

	// Keybindings to support arrow navigation
	dom.addEventListener( 'keyup', function ( event ) {

		switch ( event.keyCode ) {
			case 38: // up
				scope.selectIndex( scope.selectedIndex - 1 );
				break;
			case 40: // down
				scope.selectIndex( scope.selectedIndex + 1 );
				break;
		}

	}, false );

	this.dom = dom;

	this.options = [];
	this.selectedIndex = - 1;
	this.selectedValue = null;

	return this;

};

UI.Outliner.prototype = Object.create( UI.Element.prototype );
UI.Outliner.prototype.constructor = UI.Outliner;

UI.Outliner.prototype.selectIndex = function ( index ) {

	if ( index >= 0 && index < this.options.length ) {

		this.setValue( this.options[ index ].value );

		var changeEvent = document.createEvent( 'HTMLEvents' );
		changeEvent.initEvent( 'change', true, true );
		this.dom.dispatchEvent( changeEvent );

	}

};

UI.Outliner.prototype.setOptions = function ( options ) {

	var scope = this;

	while ( scope.dom.children.length > 0 ) {

		scope.dom.removeChild( scope.dom.firstChild );

	}

	function onClick() {

		scope.setValue( this.value );

		var changeEvent = document.createEvent( 'HTMLEvents' );
		changeEvent.initEvent( 'change', true, true );
		scope.dom.dispatchEvent( changeEvent );

	}

	// Drag

	var currentDrag;

	function onDrag( event ) {

		currentDrag = this;

	}

	function onDragStart( event ) {

		event.dataTransfer.setData( 'text', 'foo' );

	}

	function onDragOver( event ) {

		if ( this === currentDrag ) return;

		var area = event.offsetY / this.clientHeight;

		if ( area < 0.25 ) {

			this.className = 'option dragTop';

		} else if ( area > 0.75 ) {

			this.className = 'option dragBottom';

		} else {

			this.className = 'option drag';

		}

	}

	function onDragLeave() {

		if ( this === currentDrag ) return;

		this.className = 'option';

	}

	function onDrop( event ) {

		if ( this === currentDrag ) return;

		this.className = 'option';

		var scene = scope.scene;
		var object = scene.getObjectById( currentDrag.value );

		var area = event.offsetY / this.clientHeight;

		if ( area < 0.25 ) {

			var nextObject = scene.getObjectById( this.value );
			moveObject( object, nextObject.parent, nextObject );

		} else if ( area > 0.75 ) {

			var nextObject = scene.getObjectById( this.nextSibling.value );
			moveObject( object, nextObject.parent, nextObject );

		} else {

			var parentObject = scene.getObjectById( this.value );
			moveObject( object, parentObject );

		}

	}

	function moveObject( object, newParent, nextObject ) {

		if ( nextObject === null ) nextObject = undefined;

		var newParentIsChild = false;

		object.traverse( function ( child ) {

			if ( child === newParent ) newParentIsChild = true;

		} );

		if ( newParentIsChild ) return;

		editor.execute( new MoveObjectCommand( object, newParent, nextObject ) );

		var changeEvent = document.createEvent( 'HTMLEvents' );
		changeEvent.initEvent( 'change', true, true );
		scope.dom.dispatchEvent( changeEvent );

	}

	//

	scope.options = [];

	for ( var i = 0; i < options.length; i ++ ) {

		var div = options[ i ];
		div.className = 'option';
		scope.dom.appendChild( div );

		scope.options.push( div );

		div.addEventListener( 'click', onClick, false );

		if ( div.draggable === true ) {

			div.addEventListener( 'drag', onDrag, false );
			div.addEventListener( 'dragstart', onDragStart, false ); // Firefox needs this

			div.addEventListener( 'dragover', onDragOver, false );
			div.addEventListener( 'dragleave', onDragLeave, false );
			div.addEventListener( 'drop', onDrop, false );

		}


	}

	return scope;

};

UI.Outliner.prototype.getValue = function () {

	return this.selectedValue;

};

UI.Outliner.prototype.setValue = function ( value ) {

	for ( var i = 0; i < this.options.length; i ++ ) {

		var element = this.options[ i ];

		if ( element.value === value ) {

			element.classList.add( 'active' );

			// scroll into view

			var y = element.offsetTop - this.dom.offsetTop;
			var bottomY = y + element.offsetHeight;
			var minScroll = bottomY - this.dom.offsetHeight;

			if ( this.dom.scrollTop > y ) {

				this.dom.scrollTop = y;

			} else if ( this.dom.scrollTop < minScroll ) {

				this.dom.scrollTop = minScroll;

			}

			this.selectedIndex = i;

		} else {

			element.classList.remove( 'active' );

		}

	}

	this.selectedValue = value;

	return this;

};

UI.THREE = {};

UI.THREE.Boolean = function ( boolean, text ) {

	UI.Span.call( this );

	this.setMarginRight( '10px' );

	this.checkbox = new UI.Checkbox( boolean );
	this.text = new UI.Text( text ).setMarginLeft( '3px' );

	this.add( this.checkbox );
	this.add( this.text );

};

UI.THREE.Boolean.prototype = Object.create( UI.Span.prototype );
UI.THREE.Boolean.prototype.constructor = UI.THREE.Boolean;

UI.THREE.Boolean.prototype.getValue = function () {

	return this.checkbox.getValue();

};

UI.THREE.Boolean.prototype.setValue = function ( value ) {

	return this.checkbox.setValue( value );

};

// File:editor/js/libs/app.js

/**
 * @author mrdoob / http://mrdoob.com/
 */

var APP = {

	Player: function () {

		var scope = this;

		var loader = new THREE.ObjectLoader();
		var camera, scene, renderer;

		var controls, effect, cameraVR, isVR;

		var events = {};

		this.dom = document.createElement( 'div' );

		this.width = 500;
		this.height = 500;

		this.load = function ( json ) {

			isVR = json.project.vr;

			renderer = new THREE.WebGLRenderer( { antialias: true } );
			renderer.setClearColor( 0x000000 );
			renderer.setPixelRatio( window.devicePixelRatio );

			if ( json.project.gammaInput ) renderer.gammaInput = true;
			if ( json.project.gammaOutput ) renderer.gammaOutput = true;

			if ( json.project.shadows ) {

				renderer.shadowMap.enabled = true;
				// renderer.shadowMap.type = THREE.PCFSoftShadowMap;

			}

			this.dom.appendChild( renderer.domElement );

			this.setScene( loader.parse( json.scene ) );
			this.setCamera( loader.parse( json.camera ) );

			events = {
				init: [],
				start: [],
				stop: [],
				keydown: [],
				keyup: [],
				mousedown: [],
				mouseup: [],
				mousemove: [],
				touchstart: [],
				touchend: [],
				touchmove: [],
				update: []
			};

			var scriptWrapParams = 'player,renderer,scene,camera';
			var scriptWrapResultObj = {};

			for ( var eventKey in events ) {

				scriptWrapParams += ',' + eventKey;
				scriptWrapResultObj[ eventKey ] = eventKey;

			}

			var scriptWrapResult = JSON.stringify( scriptWrapResultObj ).replace( /\"/g, '' );

			for ( var uuid in json.scripts ) {

				var object = scene.getObjectByProperty( 'uuid', uuid, true );

				if ( object === undefined ) {

					console.warn( 'APP.Player: Script without object.', uuid );
					continue;

				}

				var scripts = json.scripts[ uuid ];

				for ( var i = 0; i < scripts.length; i ++ ) {

					var script = scripts[ i ];

					var functions = ( new Function( scriptWrapParams, script.source + '\nreturn ' + scriptWrapResult + ';' ).bind( object ) )( this, renderer, scene, camera );

					for ( var name in functions ) {

						if ( functions[ name ] === undefined ) continue;

						if ( events[ name ] === undefined ) {

							console.warn( 'APP.Player: Event type not supported (', name, ')' );
							continue;

						}

						events[ name ].push( functions[ name ].bind( object ) );

					}

				}

			}

			dispatch( events.init, arguments );

		};

		this.setCamera = function ( value ) {

			camera = value;
			camera.aspect = this.width / this.height;
			camera.updateProjectionMatrix();

			if ( isVR === true ) {

				cameraVR = new THREE.PerspectiveCamera();
				cameraVR.projectionMatrix = camera.projectionMatrix;
				camera.add( cameraVR );

				controls = new THREE.VRControls( cameraVR );
				effect = new THREE.VREffect( renderer );

				if ( WEBVR.isAvailable() === true ) {

					this.dom.appendChild( WEBVR.getButton( effect ) );

				}

				if ( WEBVR.isLatestAvailable() === false ) {

					this.dom.appendChild( WEBVR.getMessage() );

				}

			}

		};

		this.setScene = function ( value ) {

			scene = value;

		};

		this.setSize = function ( width, height ) {

			this.width = width;
			this.height = height;

			if ( camera ) {

				camera.aspect = this.width / this.height;
				camera.updateProjectionMatrix();

			}

			if ( renderer ) {

				renderer.setSize( width, height );

			}

		};

		function dispatch( array, event ) {

			for ( var i = 0, l = array.length; i < l; i ++ ) {

				array[ i ]( event );

			}

		}

		var prevTime, request;

		function animate( time ) {

			request = requestAnimationFrame( animate );

			try {

				dispatch( events.update, { time: time, delta: time - prevTime } );

			} catch ( e ) {

				console.error( ( e.message || e ), ( e.stack || "" ) );

			}

			if ( isVR === true ) {

				camera.updateMatrixWorld();

				controls.update();
				effect.render( scene, cameraVR );

			} else {

				renderer.render( scene, camera );

			}

			prevTime = time;

		}

		this.play = function () {

			document.addEventListener( 'keydown', onDocumentKeyDown );
			document.addEventListener( 'keyup', onDocumentKeyUp );
			document.addEventListener( 'mousedown', onDocumentMouseDown );
			document.addEventListener( 'mouseup', onDocumentMouseUp );
			document.addEventListener( 'mousemove', onDocumentMouseMove );
			document.addEventListener( 'touchstart', onDocumentTouchStart );
			document.addEventListener( 'touchend', onDocumentTouchEnd );
			document.addEventListener( 'touchmove', onDocumentTouchMove );

			dispatch( events.start, arguments );

			request = requestAnimationFrame( animate );
			prevTime = performance.now();

		};

		this.stop = function () {

			document.removeEventListener( 'keydown', onDocumentKeyDown );
			document.removeEventListener( 'keyup', onDocumentKeyUp );
			document.removeEventListener( 'mousedown', onDocumentMouseDown );
			document.removeEventListener( 'mouseup', onDocumentMouseUp );
			document.removeEventListener( 'mousemove', onDocumentMouseMove );
			document.removeEventListener( 'touchstart', onDocumentTouchStart );
			document.removeEventListener( 'touchend', onDocumentTouchEnd );
			document.removeEventListener( 'touchmove', onDocumentTouchMove );

			dispatch( events.stop, arguments );

			cancelAnimationFrame( request );

		};

		this.dispose = function () {

			while ( this.dom.children.length ) {

				this.dom.removeChild( this.dom.firstChild );

			}

			renderer.dispose();

			camera = undefined;
			scene = undefined;
			renderer = undefined;

		};

		//

		function onDocumentKeyDown( event ) {

			dispatch( events.keydown, event );

		}

		function onDocumentKeyUp( event ) {

			dispatch( events.keyup, event );

		}

		function onDocumentMouseDown( event ) {

			dispatch( events.mousedown, event );

		}

		function onDocumentMouseUp( event ) {

			dispatch( events.mouseup, event );

		}

		function onDocumentMouseMove( event ) {

			dispatch( events.mousemove, event );

		}

		function onDocumentTouchStart( event ) {

			dispatch( events.touchstart, event );

		}

		function onDocumentTouchEnd( event ) {

			dispatch( events.touchend, event );

		}

		function onDocumentTouchMove( event ) {

			dispatch( events.touchmove, event );

		}

	}

};

// File:editor/js/Player.js

/**
 * @author mrdoob / http://mrdoob.com/
 */

var Player = function ( editor ) {

	var signals = editor.signals;

	var container = new UI.Panel();
	container.setId( 'player' );
	container.setPosition( 'absolute' );
	container.setDisplay( 'none' );

	var _scene;

	signals.startPlayer.add( function () {

		_scene = editor.toJSON();
		_scene.metadata.type = 'App';
		delete _scene.history;

		// console.log(_scene);
		App.Helper.Preview(_scene);

        // preview box
        // var preview = "<div id='preview' class='modal-box' style='height:600px;width:900px;text-align: center;'> \
        // <header style='background-color:#333;'> \
        //     <a class='js-modal-close close' style='top:1.5%;'>×</a> \
        // </header> \
        // <div style='height:100%;'> \
        //     <iframe id='preview_iframe' width='100%' height='100%' allowfullscreen src='../../ZAAK.IO-Viewer/index.html'></iframe> \
        // </div></div>";
        // $("body").append($.parseHTML(preview));

        // var modal =  ("<div class='modal-overlay js-modal-close'></div>");
        // $("body").append(modal);

        //  setTimeout(function() {

	       //  // $('#preview_iframe').load(function(){
	       //  // 	console.log($('#preview_iframe')[0]);
	       //  var parentFrame = $('#preview_iframe');//.find('#myIframe');
	       //  parentFrame[0].contentWindow.viewer.startScene(_scene); // load json data
	       //      // $('#preview_iframe')[0].contentWindow.setManagerMode(); // load json data
	       //  // });
        // }, 1000);


        // $(".modal-overlay").fadeTo(500, 0.9);
        // $('#preview').fadeIn();
        // // modal helper
        // $(".js-modal-close, .modal-overlay").click(function() {
        //     $(".modal-box, .modal-overlay").fadeOut(500, function() {
        //     	// player.stop();
        //     	scene = _scene;
        //         $(".modal-overlay").remove();
        //         $("#preview").remove();
        //         signals.stopPlayer.dispatch();

        //     });
        // });
        // $(window).resize(function() {
        //     $(".modal-box").css({
        //         top: ($(window).height() - $("#preview").outerHeight()) / 2,
        //         left: ($(window).width() - $("#preview").outerWidth()) / 2
        //     });
        // });

        // $(window).resize();
        

	} );

	return container;

};

// File:editor/js/Script.js

/**
 * @author mrdoob / http://mrdoob.com/
 */

var Script = function ( editor ) {

	var signals = editor.signals;

	var container = new UI.Panel();
	container.setId( 'script' );
	container.setPosition( 'absolute' );
	container.setBackgroundColor( '#272822' );
	container.setDisplay( 'none' );

	var header = new UI.Panel();
	header.setPadding( '10px' );
	container.add( header );

	var title = new UI.Text().setColor( '#fff' );
	header.add( title );

	var buttonSVG = ( function () {
		var svg = document.createElementNS( 'http://www.w3.org/2000/svg', 'svg' );
		svg.setAttribute( 'width', 32 );
		svg.setAttribute( 'height', 32 );
		var path = document.createElementNS( 'http://www.w3.org/2000/svg', 'path' );
		path.setAttribute( 'd', 'M 12,12 L 22,22 M 22,12 12,22' );
		path.setAttribute( 'stroke', '#fff' );
		svg.appendChild( path );
		return svg;
	} )();

	var close = new UI.Element( buttonSVG );
	close.setPosition( 'absolute' );
	close.setTop( '0px' );
	close.setRight( '1px' );
	close.setCursor( 'pointer' );
	close.onClick( function () {

		container.setDisplay( 'none' );

	} );
	header.add( close );

		var lineSVG = ( function () {
		var svg = document.createElementNS( 'http://www.w3.org/2000/svg', 'svg' );
		svg.setAttribute( 'width', 32 );
		svg.setAttribute( 'height', 2000 );
		var path = document.createElementNS( 'http://www.w3.org/2000/svg', 'path' );
		path.setAttribute( 'd', 'M 0,0 L 12,10000' );
		path.setAttribute( 'stroke', '#000' );
		path.setAttribute( 'stroke-dasharray', '4,4');
		svg.appendChild( path );
		return svg;
	} )();

	var lineo = new UI.Element(lineSVG);
	lineo.setPosition( 'absolute' );
	lineo.setTop( '0px' );
	lineo.setBottom( '0px' );
	lineo.setLeft( '-4px' );
	header.add( lineo );


	var renderer;

	signals.rendererChanged.add( function ( newRenderer ) {

		renderer = newRenderer;

	} );


	var delay;
	var currentMode;
	var currentScript;
	var currentObject;

	var codemirror = CodeMirror( container.dom, {
		value: '',
		lineNumbers: true,
		matchBrackets: true,
		indentWithTabs: true,
		tabSize: 4,
		indentUnit: 4,
		hintOptions: {
			completeSingle: false
		}
	} );
	codemirror.setOption( 'theme', 'monokai' );
	codemirror.on( 'change', function () {

		if ( codemirror.state.focused === false ) return;

		clearTimeout( delay );
		delay = setTimeout( function () {

			var value = codemirror.getValue();

			if ( ! validate( value ) ) return;

			if ( typeof( currentScript ) === 'object' ) {

				if ( value !== currentScript.source ) {

					editor.execute( new SetScriptValueCommand( currentObject, currentScript, 'source', value, codemirror.getCursor() ) );

				}
				return;
			}

			if ( currentScript !== 'programInfo' ) return;

			var json = JSON.parse( value );

			if ( JSON.stringify( currentObject.material.defines ) !== JSON.stringify( json.defines ) ) {

				var cmd = new SetMaterialValueCommand( currentObject, 'defines', json.defines );
				cmd.updatable = false;
				editor.execute( cmd );

			}
			if ( JSON.stringify( currentObject.material.uniforms ) !== JSON.stringify( json.uniforms ) ) {

				var cmd = new SetMaterialValueCommand( currentObject, 'uniforms', json.uniforms );
				cmd.updatable = false;
				editor.execute( cmd );

			}
			if ( JSON.stringify( currentObject.material.attributes ) !== JSON.stringify( json.attributes ) ) {

				var cmd = new SetMaterialValueCommand( currentObject, 'attributes', json.attributes );
				cmd.updatable = false;
				editor.execute( cmd );

			}

		}, 300 );

	});

	// prevent backspace from deleting objects
	var wrapper = codemirror.getWrapperElement();
	wrapper.addEventListener( 'keydown', function ( event ) {

		event.stopPropagation();

	} );

	// validate

	var errorLines = [];
	var widgets = [];

	var validate = function ( string ) {

		var valid;
		var errors = [];

		return codemirror.operation( function () {

			while ( errorLines.length > 0 ) {

				codemirror.removeLineClass( errorLines.shift(), 'background', 'errorLine' );

			}

			while ( widgets.length > 0 ) {

				codemirror.removeLineWidget( widgets.shift() );

			}

			//

			switch ( currentMode ) {

				case 'javascript':

					try {

						var syntax = esprima.parse( string, { tolerant: true } );
						errors = syntax.errors;

					} catch ( error ) {

						errors.push( {

							lineNumber: error.lineNumber - 1,
							message: error.message

						} );

					}

					for ( var i = 0; i < errors.length; i ++ ) {

						var error = errors[ i ];
						error.message = error.message.replace(/Line [0-9]+: /, '');

					}

					break;

				case 'json':

					errors = [];

					jsonlint.parseError = function ( message, info ) {

						message = message.split('\n')[3];

						errors.push( {

							lineNumber: info.loc.first_line - 1,
							message: message

						} );

					};

					try {

						jsonlint.parse( string );

					} catch ( error ) {

						// ignore failed error recovery

					}

					break;

				case 'glsl':

					try {

						var shaderType = currentScript === 'vertexShader' ?
								glslprep.Shader.VERTEX : glslprep.Shader.FRAGMENT;

						glslprep.parseGlsl( string, shaderType );

					} catch( error ) {

						if ( error instanceof glslprep.SyntaxError ) {

							errors.push( {

								lineNumber: error.line,
								message: "Syntax Error: " + error.message

							} );

						} else {

							console.error( error.stack || error );

						}

					}

					if ( errors.length !== 0 ) break;
					if ( renderer instanceof THREE.WebGLRenderer === false ) break;

					currentObject.material[ currentScript ] = string;
					currentObject.material.needsUpdate = true;
					signals.materialChanged.dispatch( currentObject.material );

					var programs = renderer.info.programs;

					valid = true;
					var parseMessage = /^(?:ERROR|WARNING): \d+:(\d+): (.*)/g;

					for ( var i = 0, n = programs.length; i !== n; ++ i ) {

						var diagnostics = programs[i].diagnostics;

						if ( diagnostics === undefined ||
								diagnostics.material !== currentObject.material ) continue;

						if ( ! diagnostics.runnable ) valid = false;

						var shaderInfo = diagnostics[ currentScript ];
						var lineOffset = shaderInfo.prefix.split(/\r\n|\r|\n/).length;

						while ( true ) {

							var parseResult = parseMessage.exec( shaderInfo.log );
							if ( parseResult === null ) break;

							errors.push( {

								lineNumber: parseResult[ 1 ] - lineOffset,
								message: parseResult[ 2 ]

							} );

						} // messages

						break;

					} // programs

			} // mode switch

			for ( var i = 0; i < errors.length; i ++ ) {

				var error = errors[ i ];

				var message = document.createElement( 'div' );
				message.className = 'esprima-error';
				message.textContent = error.message;

				var lineNumber = Math.max( error.lineNumber, 0 );
				errorLines.push( lineNumber );

				codemirror.addLineClass( lineNumber, 'background', 'errorLine' );

				var widget = codemirror.addLineWidget( lineNumber, message );

				widgets.push( widget );

			}

			return valid !== undefined ? valid : errors.length === 0;

		});

	};

	// tern js autocomplete

	var server = new CodeMirror.TernServer( {
		caseInsensitive: true,
		plugins: { threejs: null }
	} );

	codemirror.setOption( 'extraKeys', {
		'Ctrl-Space': function(cm) { server.complete(cm); },
		'Ctrl-I': function(cm) { server.showType(cm); },
		'Ctrl-O': function(cm) { server.showDocs(cm); },
		'Alt-.': function(cm) { server.jumpToDef(cm); },
		'Alt-,': function(cm) { server.jumpBack(cm); },
		'Ctrl-Q': function(cm) { server.rename(cm); },
		'Ctrl-.': function(cm) { server.selectName(cm); }
	} );

	codemirror.on( 'cursorActivity', function( cm ) {

		if ( currentMode !== 'javascript' ) return;
		server.updateArgHints( cm );

	} );

	codemirror.on( 'keypress', function( cm, kb ) {

		if ( currentMode !== 'javascript' ) return;
		var typed = String.fromCharCode( kb.which || kb.keyCode );
		if ( /[\w\.]/.exec( typed ) ) {

			server.complete( cm );

		}

	} );


	//

	signals.editorCleared.add( function () {

		container.setDisplay( 'none' );

	} );

	signals.editScript.add( function ( object, script ) {

		var mode, name, source;

		if ( typeof( script ) === 'object' ) {

			mode = 'javascript';
			name = script.name;
			source = script.source;
			title.setValue( object.name + ' / ' + name );

		} else {

			switch ( script ) {

				case 'vertexShader':

					mode = 'glsl';
					name = 'Vertex Shader';
					source = object.material.vertexShader || "";

					break;

				case 'fragmentShader':

					mode = 'glsl';
					name = 'Fragment Shader';
					source = object.material.fragmentShader || "";

					break;

				case 'programInfo':

					mode = 'json';
					name = 'Program Properties';
					var json = {
						defines: object.material.defines,
						uniforms: object.material.uniforms,
						attributes: object.material.attributes
					};
					source = JSON.stringify( json, null, '\t' );

			}
			title.setValue( object.material.name + ' / ' + name );

		}

		currentMode = mode;
		currentScript = script;
		currentObject = object;

		container.setDisplay( '' );
		codemirror.setValue( source );
		if (mode === 'json' ) mode = { name: 'javascript', json: true };
		codemirror.setOption( 'mode', mode );

	} );

	signals.scriptRemoved.add( function ( script ) {

		if ( currentScript === script ) {

			container.setDisplay( 'none' );

		}

	} );

	signals.refreshScriptEditor.add( function ( object, script, cursorPosition ) {

		if ( currentScript !== script ) return;

		// copying the codemirror history because "codemirror.setValue(...)" alters its history

		var history = codemirror.getHistory();
		title.setValue( object.name + ' / ' + script.name );
		codemirror.setValue( script.source );

		if ( cursorPosition !== undefined ) {

			codemirror.setCursor( cursorPosition );

		}
		codemirror.setHistory( history ); // setting the history to previous state

	} );

	return container;

};

// File:examples/js/effects/VREffect.js

/**
 * @author dmarcos / https://github.com/dmarcos
 * @author mrdoob / http://mrdoob.com
 *
 * WebVR Spec: http://mozvr.github.io/webvr-spec/webvr.html
 *
 * Firefox: http://mozvr.com/downloads/
 * Chromium: https://drive.google.com/folderview?id=0BzudLt22BqGRbW9WTHMtOWMzNjQ&usp=sharing#list
 *
 */

THREE.VREffect = function ( renderer, onError ) {

	var isWebVR1 = true;

	var vrDisplay, vrDisplays;
	var eyeTranslationL = new THREE.Vector3();
	var eyeTranslationR = new THREE.Vector3();
	var renderRectL, renderRectR;
	var eyeFOVL, eyeFOVR;

	function gotVRDisplays( displays ) {

		vrDisplays = displays;

		for ( var i = 0; i < displays.length; i ++ ) {

			if ( 'VRDisplay' in window && displays[ i ] instanceof VRDisplay ) {

				vrDisplay = displays[ i ];
				isWebVR1 = true;
				break; // We keep the first we encounter

			} else if ( 'HMDVRDevice' in window && displays[ i ] instanceof HMDVRDevice ) {

				vrDisplay = displays[ i ];
				isWebVR1 = false;
				break; // We keep the first we encounter

			}

		}

		if ( vrDisplay === undefined ) {

			if ( onError ) onError( 'HMD not available' );

		}

	}

	if ( navigator.getVRDisplays ) {

		navigator.getVRDisplays().then( gotVRDisplays );

	} else if ( navigator.getVRDevices ) {

		// Deprecated API.
		navigator.getVRDevices().then( gotVRDisplays );

	}

	//

	this.isPresenting = false;
	this.scale = 1;

	var scope = this;

	var rendererSize = renderer.getSize();
	var rendererPixelRatio = renderer.getPixelRatio();

	this.getVRDisplay = function () {

		return vrDisplay;

	};

	this.getVRDisplays = function () {

		return vrDisplays;

	};

	this.setSize = function ( width, height ) {

		rendererSize = { width: width, height: height };

		if ( scope.isPresenting ) {

			var eyeParamsL = vrDisplay.getEyeParameters( 'left' );
			renderer.setPixelRatio( 1 );

			if ( isWebVR1 ) {

				renderer.setSize( eyeParamsL.renderWidth * 2, eyeParamsL.renderHeight, false );

			} else {

				renderer.setSize( eyeParamsL.renderRect.width * 2, eyeParamsL.renderRect.height, false );

			}

		} else {

			renderer.setPixelRatio( rendererPixelRatio );
			renderer.setSize( width, height );

		}

	};

	// fullscreen

	var canvas = renderer.domElement;
	var requestFullscreen;
	var exitFullscreen;
	var fullscreenElement;
	var leftBounds = [ 0.0, 0.0, 0.5, 1.0 ];
	var rightBounds = [ 0.5, 0.0, 0.5, 1.0 ];

	function onFullscreenChange () {

		var wasPresenting = scope.isPresenting;
		scope.isPresenting = vrDisplay !== undefined && ( vrDisplay.isPresenting || ( ! isWebVR1 && document[ fullscreenElement ] instanceof window.HTMLElement ) );

		if ( scope.isPresenting ) {

			var eyeParamsL = vrDisplay.getEyeParameters( 'left' );
			var eyeWidth, eyeHeight;

			if ( isWebVR1 ) {

				eyeWidth = eyeParamsL.renderWidth;
				eyeHeight = eyeParamsL.renderHeight;

				if ( vrDisplay.getLayers ) {

					var layers = vrDisplay.getLayers();
					if (layers.length) {

						leftBounds = layers[0].leftBounds || [ 0.0, 0.0, 0.5, 1.0 ];
						rightBounds = layers[0].rightBounds || [ 0.5, 0.0, 0.5, 1.0 ];

					}
				}

			} else {

				eyeWidth = eyeParamsL.renderRect.width;
				eyeHeight = eyeParamsL.renderRect.height;

			}

			if ( !wasPresenting ) {

				rendererPixelRatio = renderer.getPixelRatio();
				rendererSize = renderer.getSize();

				renderer.setPixelRatio( 1 );
				renderer.setSize( eyeWidth * 2, eyeHeight, false );

			}

		} else if ( wasPresenting ) {

			renderer.setPixelRatio( rendererPixelRatio );
			renderer.setSize( rendererSize.width, rendererSize.height );

		}

	}

	if ( canvas.requestFullscreen ) {

		requestFullscreen = 'requestFullscreen';
		fullscreenElement = 'fullscreenElement';
		exitFullscreen = 'exitFullscreen';
		document.addEventListener( 'fullscreenchange', onFullscreenChange, false );

	} else if ( canvas.mozRequestFullScreen ) {

		requestFullscreen = 'mozRequestFullScreen';
		fullscreenElement = 'mozFullScreenElement';
		exitFullscreen = 'mozCancelFullScreen';
		document.addEventListener( 'mozfullscreenchange', onFullscreenChange, false );

	} else {

		requestFullscreen = 'webkitRequestFullscreen';
		fullscreenElement = 'webkitFullscreenElement';
		exitFullscreen = 'webkitExitFullscreen';
		document.addEventListener( 'webkitfullscreenchange', onFullscreenChange, false );

	}

	window.addEventListener( 'vrdisplaypresentchange', onFullscreenChange, false );

	this.setFullScreen = function ( boolean ) {

		return new Promise( function ( resolve, reject ) {

			if ( vrDisplay === undefined ) {

				reject( new Error( 'No VR hardware found.' ) );
				return;

			}

			if ( scope.isPresenting === boolean ) {

				resolve();
				return;

			}

			if ( isWebVR1 ) {

				if ( boolean ) {

					resolve( vrDisplay.requestPresent( [ { source: canvas } ] ) );

				} else {

					resolve( vrDisplay.exitPresent() );

				}

			} else {

				if ( canvas[ requestFullscreen ] ) {

					canvas[ boolean ? requestFullscreen : exitFullscreen ]( { vrDisplay: vrDisplay } );
					resolve();

				} else {

					console.error( 'No compatible requestFullscreen method found.' );
					reject( new Error( 'No compatible requestFullscreen method found.' ) );

				}

			}

		} );

	};

	this.requestPresent = function () {

		return this.setFullScreen( true );

	};

	this.exitPresent = function () {

		return this.setFullScreen( false );

	};

	this.requestAnimationFrame = function ( f ) {

		if ( isWebVR1 && vrDisplay !== undefined ) {

			return vrDisplay.requestAnimationFrame( f );

		} else {

			return window.requestAnimationFrame( f );

		}

	};
	
	this.cancelAnimationFrame = function ( h ) {

		if ( isWebVR1 && vrDisplay !== undefined ) {

			vrDisplay.cancelAnimationFrame( h );

		} else {

			window.cancelAnimationFrame( h );

		}

	};
	
	this.submitFrame = function () {

		if ( isWebVR1 && vrDisplay !== undefined && scope.isPresenting ) {

			vrDisplay.submitFrame();

		}

	};

	this.autoSubmitFrame = true;

	// render

	var cameraL = new THREE.PerspectiveCamera();
	cameraL.layers.enable( 1 );

	var cameraR = new THREE.PerspectiveCamera();
	cameraR.layers.enable( 2 );

	this.render = function ( scene, camera, renderTarget, forceClear ) {

		if ( vrDisplay && scope.isPresenting ) {

			var autoUpdate = scene.autoUpdate;

			if ( autoUpdate ) {

				scene.updateMatrixWorld();
				scene.autoUpdate = false;

			}

			var eyeParamsL = vrDisplay.getEyeParameters( 'left' );
			var eyeParamsR = vrDisplay.getEyeParameters( 'right' );

			if ( isWebVR1 ) {

				eyeTranslationL.fromArray( eyeParamsL.offset );
				eyeTranslationR.fromArray( eyeParamsR.offset );
				eyeFOVL = eyeParamsL.fieldOfView;
				eyeFOVR = eyeParamsR.fieldOfView;

			} else {

				eyeTranslationL.copy( eyeParamsL.eyeTranslation );
				eyeTranslationR.copy( eyeParamsR.eyeTranslation );
				eyeFOVL = eyeParamsL.recommendedFieldOfView;
				eyeFOVR = eyeParamsR.recommendedFieldOfView;

			}

			if ( Array.isArray( scene ) ) {

				console.warn( 'THREE.VREffect.render() no longer supports arrays. Use object.layers instead.' );
				scene = scene[ 0 ];

			}

			// When rendering we don't care what the recommended size is, only what the actual size
			// of the backbuffer is.
			var size = renderer.getSize();
			renderRectL = {
				x: Math.round( size.width * leftBounds[ 0 ] ),
				y: Math.round( size.height * leftBounds[ 1 ] ),
				width: Math.round( size.width * leftBounds[ 2 ] ),
				height:  Math.round(size.height * leftBounds[ 3 ] )
			};
			renderRectR = {
				x: Math.round( size.width * rightBounds[ 0 ] ),
				y: Math.round( size.height * rightBounds[ 1 ] ),
				width: Math.round( size.width * rightBounds[ 2 ] ),
				height:  Math.round(size.height * rightBounds[ 3 ] )
			};

			if (renderTarget) {
				
				renderer.setRenderTarget(renderTarget);
				renderTarget.scissorTest = true;
				
			} else  {
				
				renderer.setScissorTest( true );
			
			}

			if ( renderer.autoClear || forceClear ) renderer.clear();

			if ( camera.parent === null ) camera.updateMatrixWorld();

			cameraL.projectionMatrix = fovToProjection( eyeFOVL, true, camera.near, camera.far );
			cameraR.projectionMatrix = fovToProjection( eyeFOVR, true, camera.near, camera.far );

			camera.matrixWorld.decompose( cameraL.position, cameraL.quaternion, cameraL.scale );
			camera.matrixWorld.decompose( cameraR.position, cameraR.quaternion, cameraR.scale );

			var scale = this.scale;
			cameraL.translateOnAxis( eyeTranslationL, scale );
			cameraR.translateOnAxis( eyeTranslationR, scale );


			// render left eye
			if ( renderTarget ) {

				renderTarget.viewport.set(renderRectL.x, renderRectL.y, renderRectL.width, renderRectL.height);
				renderTarget.scissor.set(renderRectL.x, renderRectL.y, renderRectL.width, renderRectL.height);

			} else {

				renderer.setViewport( renderRectL.x, renderRectL.y, renderRectL.width, renderRectL.height );
				renderer.setScissor( renderRectL.x, renderRectL.y, renderRectL.width, renderRectL.height );

			}
			renderer.render( scene, cameraL, renderTarget, forceClear );

			// render right eye
			if (renderTarget) {

				renderTarget.viewport.set(renderRectR.x, renderRectR.y, renderRectR.width, renderRectR.height);
  				renderTarget.scissor.set(renderRectR.x, renderRectR.y, renderRectR.width, renderRectR.height);

			} else {

				renderer.setViewport( renderRectR.x, renderRectR.y, renderRectR.width, renderRectR.height );
				renderer.setScissor( renderRectR.x, renderRectR.y, renderRectR.width, renderRectR.height );

			}
			renderer.render( scene, cameraR, renderTarget, forceClear );

			if (renderTarget) {

				renderTarget.viewport.set( 0, 0, size.width, size.height );
				renderTarget.scissor.set( 0, 0, size.width, size.height );
				renderTarget.scissorTest = false;
				renderer.setRenderTarget( null );

			} else {
				
				renderer.setScissorTest( false );

			}
			
			if ( autoUpdate ) {

				scene.autoUpdate = true;

			}

			if ( scope.autoSubmitFrame ) {

				scope.submitFrame();

			}

			return;

		}

		// Regular render mode if not HMD

		renderer.render( scene, camera, renderTarget, forceClear );

	};

	//

	function fovToNDCScaleOffset( fov ) {

		var pxscale = 2.0 / ( fov.leftTan + fov.rightTan );
		var pxoffset = ( fov.leftTan - fov.rightTan ) * pxscale * 0.5;
		var pyscale = 2.0 / ( fov.upTan + fov.downTan );
		var pyoffset = ( fov.upTan - fov.downTan ) * pyscale * 0.5;
		return { scale: [ pxscale, pyscale ], offset: [ pxoffset, pyoffset ] };

	}

	function fovPortToProjection( fov, rightHanded, zNear, zFar ) {

		rightHanded = rightHanded === undefined ? true : rightHanded;
		zNear = zNear === undefined ? 0.01 : zNear;
		zFar = zFar === undefined ? 10000.0 : zFar;

		var handednessScale = rightHanded ? - 1.0 : 1.0;

		// start with an identity matrix
		var mobj = new THREE.Matrix4();
		var m = mobj.elements;

		// and with scale/offset info for normalized device coords
		var scaleAndOffset = fovToNDCScaleOffset( fov );

		// X result, map clip edges to [-w,+w]
		m[ 0 * 4 + 0 ] = scaleAndOffset.scale[ 0 ];
		m[ 0 * 4 + 1 ] = 0.0;
		m[ 0 * 4 + 2 ] = scaleAndOffset.offset[ 0 ] * handednessScale;
		m[ 0 * 4 + 3 ] = 0.0;

		// Y result, map clip edges to [-w,+w]
		// Y offset is negated because this proj matrix transforms from world coords with Y=up,
		// but the NDC scaling has Y=down (thanks D3D?)
		m[ 1 * 4 + 0 ] = 0.0;
		m[ 1 * 4 + 1 ] = scaleAndOffset.scale[ 1 ];
		m[ 1 * 4 + 2 ] = - scaleAndOffset.offset[ 1 ] * handednessScale;
		m[ 1 * 4 + 3 ] = 0.0;

		// Z result (up to the app)
		m[ 2 * 4 + 0 ] = 0.0;
		m[ 2 * 4 + 1 ] = 0.0;
		m[ 2 * 4 + 2 ] = zFar / ( zNear - zFar ) * - handednessScale;
		m[ 2 * 4 + 3 ] = ( zFar * zNear ) / ( zNear - zFar );

		// W result (= Z in)
		m[ 3 * 4 + 0 ] = 0.0;
		m[ 3 * 4 + 1 ] = 0.0;
		m[ 3 * 4 + 2 ] = handednessScale;
		m[ 3 * 4 + 3 ] = 0.0;

		mobj.transpose();

		return mobj;

	}

	function fovToProjection( fov, rightHanded, zNear, zFar ) {

		var DEG2RAD = Math.PI / 180.0;

		var fovPort = {
			upTan: Math.tan( fov.upDegrees * DEG2RAD ),
			downTan: Math.tan( fov.downDegrees * DEG2RAD ),
			leftTan: Math.tan( fov.leftDegrees * DEG2RAD ),
			rightTan: Math.tan( fov.rightDegrees * DEG2RAD )
		};

		return fovPortToProjection( fovPort, rightHanded, zNear, zFar );

	}

};

// File:examples/js/controls/VRControls.js

/**
 * @author dmarcos / https://github.com/dmarcos
 * @author mrdoob / http://mrdoob.com
 */

THREE.VRControls = function ( object, onError ) {

	var scope = this;

	var vrDisplay, vrDisplays;

	var standingMatrix = new THREE.Matrix4();

	function gotVRDisplays( displays ) {

		vrDisplays = displays;

		for ( var i = 0; i < displays.length; i ++ ) {

			if ( ( 'VRDisplay' in window && displays[ i ] instanceof VRDisplay ) ||
				 ( 'PositionSensorVRDevice' in window && displays[ i ] instanceof PositionSensorVRDevice ) ) {

				vrDisplay = displays[ i ];
				break;  // We keep the first we encounter

			}

		}

		if ( vrDisplay === undefined ) {

			if ( onError ) onError( 'VR input not available.' );

		}

	}

	if ( navigator.getVRDisplays ) {

		navigator.getVRDisplays().then( gotVRDisplays );

	} else if ( navigator.getVRDevices ) {

		// Deprecated API.
		navigator.getVRDevices().then( gotVRDisplays );

	}

	// the Rift SDK returns the position in meters
	// this scale factor allows the user to define how meters
	// are converted to scene units.

	this.scale = 1;

	// If true will use "standing space" coordinate system where y=0 is the
	// floor and x=0, z=0 is the center of the room.
	this.standing = false;

	// Distance from the users eyes to the floor in meters. Used when
	// standing=true but the VRDisplay doesn't provide stageParameters.
	this.userHeight = 1.6;

	this.getVRDisplay = function () {

		return vrDisplay;

	};

	this.getVRDisplays = function () {

		return vrDisplays;

	};

	this.getStandingMatrix = function () {

		return standingMatrix;

	};

	this.update = function () {

		if ( vrDisplay ) {

			if ( vrDisplay.getPose ) {

				var pose = vrDisplay.getPose();

				if ( pose.orientation !== null ) {

					object.quaternion.fromArray( pose.orientation );

				}

				if ( pose.position !== null ) {

					object.position.fromArray( pose.position );

				} else {

					object.position.set( 0, 0, 0 );

				}

			} else {

				// Deprecated API.
				var state = vrDisplay.getState();

				if ( state.orientation !== null ) {

					object.quaternion.copy( state.orientation );

				}

				if ( state.position !== null ) {

					object.position.copy( state.position );

				} else {

					object.position.set( 0, 0, 0 );

				}

			}

			if ( this.standing ) {

				if ( vrDisplay.stageParameters ) {

					object.updateMatrix();

					standingMatrix.fromArray( vrDisplay.stageParameters.sittingToStandingTransform );
					object.applyMatrix( standingMatrix );

				} else {

					object.position.setY( object.position.y + this.userHeight );

				}

			}

			object.position.multiplyScalar( scope.scale );

		}

	};

	this.resetPose = function () {

		if ( vrDisplay ) {

			if ( vrDisplay.resetPose !== undefined ) {

				vrDisplay.resetPose();

			} else if ( vrDisplay.resetSensor !== undefined ) {

				// Deprecated API.
				vrDisplay.resetSensor();

			} else if ( vrDisplay.zeroSensor !== undefined ) {

				// Really deprecated API.
				vrDisplay.zeroSensor();

			}

		}

	};

	this.resetSensor = function () {

		console.warn( 'THREE.VRControls: .resetSensor() is now .resetPose().' );
		this.resetPose();

	};

	this.zeroSensor = function () {

		console.warn( 'THREE.VRControls: .zeroSensor() is now .resetPose().' );
		this.resetPose();

	};

	this.dispose = function () {

		vrDisplay = null;

	};

};

// File:editor/js/Storage.js

/**
 * @author mrdoob / http://mrdoob.com/
 */

var Storage = function () {

	var indexedDB = window.indexedDB || window.mozIndexedDB || window.webkitIndexedDB || window.msIndexedDB;

	if ( indexedDB === undefined  ) {

		console.warn( 'Storage: IndexedDB not available.' );

		return { init: function () {}, get: function () {}, set: function () {}, clear: function () {}, size: function () {} };

	}

	var name = 'threejs-editor';
	var version = 1;

	var database;

	return {

		init: function ( callback ) {

			var request = indexedDB.open( name, version );
			request.onupgradeneeded = function ( event ) {

				var db = event.target.result;

				if ( db.objectStoreNames.contains( 'states' ) === false ) {

					db.createObjectStore( 'states' );

				}

			};
			request.onsuccess = function ( event ) {

				database = event.target.result;

				callback();

			};
			request.onerror = function ( event ) {

				console.error( 'IndexedDB', event );

			};


		},

		get: function ( callback ) {

			var transaction = database.transaction( [ 'states' ], 'readwrite' );
			var objectStore = transaction.objectStore( 'states' );
			var request = objectStore.get( 0 );
			request.onsuccess = function ( event ) {

				callback( event.target.result );

			};

		},

		set: function ( data, callback ) {

			var start = performance.now();

			var transaction = database.transaction( [ 'states' ], 'readwrite' );
			var objectStore = transaction.objectStore( 'states' );
			var request = objectStore.put( data, 0 );
			request.onsuccess = function ( event ) {

				console.log( '[' + /\d\d\:\d\d\:\d\d/.exec( new Date() )[ 0 ] + ']', 'Saved state to IndexedDB. ' + ( performance.now() - start ).toFixed( 2 ) + 'ms' );

			};

			// var output = data.history;
			// delete output.history;

			// var json = JSON.stringify(output);
			// console.log(json.length/100000);


		},

		clear: function () {

			if ( database === undefined ) return;

			var transaction = database.transaction( [ 'states' ], 'readwrite' );
			var objectStore = transaction.objectStore( 'states' );
			var request = objectStore.clear();
			request.onsuccess = function ( event ) {

				console.log( '[' + /\d\d\:\d\d\:\d\d/.exec( new Date() )[ 0 ] + ']', 'Cleared IndexedDB.' );

			};

		},
		
		size: function ( callback ){

			if(database != null){
				var size = 0;
		 
		        var transaction = database.transaction(["states"])
		            .objectStore("states")
		            .openCursor();
		 
		        transaction.onsuccess = function(event){
		            var cursor = event.target.result;
		            
		            if(cursor){
		                var storedObject = cursor.value;
		                delete storedObject.history;
		                var json = JSON.stringify(storedObject);
		                size += json.length;
		                cursor.continue();
		            }
		            else{
		            	size /= 100000; // -2
		            	size = parseInt(size);

		            	callback(size,null);
		            }
		        }.bind(this);
		        transaction.onerror = function(err){
		            callback(null,err);
		        }
		    }
		    else{
		        callback(null,null);
		    }
		}

	};

};

// File:editor/js/Config.js

/**
 * @author mrdoob / http://mrdoob.com/
 */

var Config = function ( name ) {

	var storage = {
		'autosave': true,
		'theme': 'css/light.css',

		'degree': true,

		'backgroundColor': 0xcccccc,

		'project/history/stored': true,
		'project/renderer': 'WebGLRenderer',
		'project/renderer/antialias': true,
		'project/renderer/gammaInput': false,
		'project/renderer/gammaOutput': false,
		'project/renderer/shadows': true,
		'project/editable': false,
		'project/vr': false,
		'project/gazetime':2.4,
		'project/crosshair':true,
		'project/quality':1.0,

		'ui/sidebar/animation/collapsed': true,
		'ui/sidebar/geometry/collapsed': true,
		'ui/sidebar/history/collapsed': true,
		'ui/sidebar/material/collapsed': true,
		'ui/sidebar/object3d/collapsed': false,
		'ui/sidebar/project/collapsed': true,
		'ui/sidebar/scene/collapsed': false,
		'ui/sidebar/script/collapsed': true
	};

	if ( window.localStorage[ name ] === undefined ) {

		window.localStorage[ name ] = JSON.stringify( storage );

	} else {

		var data = JSON.parse( window.localStorage[ name ] );

		for ( var key in data ) {

			storage[ key ] = data[ key ];

		}

	}

	return {

		getKey: function ( key ) {

			return storage[ key ];

		},

		setKey: function () { // key, value, key, value ...

			for ( var i = 0, l = arguments.length; i < l; i += 2 ) {

				storage[ arguments[ i ] ] = arguments[ i + 1 ];

			}

			window.localStorage[ name ] = JSON.stringify( storage );

			console.log( '[' + /\d\d\:\d\d\:\d\d/.exec( new Date() )[ 0 ] + ']', 'Saved config to LocalStorage.' );

		},

		clear: function () {

			delete window.localStorage[ name ];

		}

	};

};

// File:editor/js/History.js

/**
 * @author dforrer / https://github.com/dforrer
 * Developed as part of a project at University of Applied Sciences and Arts Northwestern Switzerland (www.fhnw.ch)
 */

History = function ( editor ) {

	this.editor = editor;
	this.undos = [];
	this.redos = [];
	this.lastCmdTime = new Date();
	this.idCounter = 0;

	this.historyDisabled = false;
	this.config = editor.config;

	//Set editor-reference in Command

	Command( editor );

	// signals

	var scope = this;

	/*this.editor.signals.startPlayer.add( function () {

		scope.historyDisabled = true;

	} );

	this.editor.signals.stopPlayer.add( function () {

		scope.historyDisabled = false;

	} );*/

};

History.prototype = {

	execute: function ( cmd, optionalName ) {

		var lastCmd = this.undos[ this.undos.length - 1 ];
		var timeDifference = new Date().getTime() - this.lastCmdTime.getTime();

		var isUpdatableCmd = lastCmd &&
			lastCmd.updatable &&
			cmd.updatable &&
			lastCmd.object === cmd.object &&
			lastCmd.type === cmd.type &&
			lastCmd.script === cmd.script &&
			lastCmd.attributeName === cmd.attributeName;

		if ( isUpdatableCmd && cmd.type === "SetScriptValueCommand" ) {

			// When the cmd.type is "SetScriptValueCommand" the timeDifference is ignored

			lastCmd.update( cmd );
			cmd = lastCmd;

		} else if ( isUpdatableCmd && timeDifference < 500 ) {

			lastCmd.update( cmd );
			cmd = lastCmd;

		} else {

			// the command is not updatable and is added as a new part of the history

			this.undos.push( cmd );
			cmd.id = ++ this.idCounter;

		}
		cmd.name = ( optionalName !== undefined ) ? optionalName : cmd.name;
		cmd.execute();
		cmd.inMemory = true;

		if ( this.config.getKey( 'project/history/stored' ) ) {

			cmd.json = cmd.toJSON();	// serialize the cmd immediately after execution and append the json to the cmd

		}
		this.lastCmdTime = new Date();

		// clearing all the redo-commands

		this.redos = [];
		this.editor.signals.historyChanged.dispatch( cmd );

	},

	undo: function () {

		if ( this.historyDisabled ) {

			alert( "Undo/Redo disabled while scene is playing." );
			return;

		}

		var cmd = undefined;

		if ( this.undos.length > 0 ) {

			cmd = this.undos.pop();

			if ( cmd.inMemory === false ) {

				cmd.fromJSON( cmd.json );

			}

		}

		if ( cmd !== undefined ) {

			cmd.undo();
			this.redos.push( cmd );
			this.editor.signals.historyChanged.dispatch( cmd );

		}

		return cmd;

	},

	redo: function () {

		if ( this.historyDisabled ) {

			alert( "Undo/Redo disabled while scene is playing." );
			return;

		}

		var cmd = undefined;

		if ( this.redos.length > 0 ) {

			cmd = this.redos.pop();

			if ( cmd.inMemory === false ) {

				cmd.fromJSON( cmd.json );

			}

		}

		if ( cmd !== undefined ) {

			cmd.execute();
			this.undos.push( cmd );
			this.editor.signals.historyChanged.dispatch( cmd );

		}

		return cmd;

	},

	toJSON: function () {

		var history = {};
		history.undos = [];
		history.redos = [];

		if ( ! this.config.getKey( 'project/history/stored' ) ) {

			return history;

		}

		// Append Undos to History

		for ( var i = 0 ; i < this.undos.length; i ++ ) {

			if ( this.undos[ i ].hasOwnProperty( "json" ) ) {

				history.undos.push( this.undos[ i ].json );

			}

		}

		// Append Redos to History

		for ( var i = 0 ; i < this.redos.length; i ++ ) {

			if ( this.redos[ i ].hasOwnProperty( "json" ) ) {

				history.redos.push( this.redos[ i ].json );

			}

		}

		return history;

	},

	fromJSON: function ( json ) {

		if ( json === undefined ) return;

		for ( var i = 0; i < json.undos.length; i ++ ) {

			var cmdJSON = json.undos[ i ];
			var cmd = new window[ cmdJSON.type ]();	// creates a new object of type "json.type"
			cmd.json = cmdJSON;
			cmd.id = cmdJSON.id;
			cmd.name = cmdJSON.name;
			this.undos.push( cmd );
			this.idCounter = ( cmdJSON.id > this.idCounter ) ? cmdJSON.id : this.idCounter; // set last used idCounter

		}

		for ( var i = 0; i < json.redos.length; i ++ ) {

			var cmdJSON = json.redos[ i ];
			var cmd = new window[ cmdJSON.type ]();	// creates a new object of type "json.type"
			cmd.json = cmdJSON;
			cmd.id = cmdJSON.id;
			cmd.name = cmdJSON.name;
			this.redos.push( cmd );
			this.idCounter = ( cmdJSON.id > this.idCounter ) ? cmdJSON.id : this.idCounter; // set last used idCounter

		}

		// Select the last executed undo-command
		this.editor.signals.historyChanged.dispatch( this.undos[ this.undos.length - 1 ] );

	},

	clear: function () {

		this.undos = [];
		this.redos = [];
		this.idCounter = 0;

		this.editor.signals.historyChanged.dispatch();

	},

	goToState: function ( id ) {

		if ( this.historyDisabled ) {

			alert( "Undo/Redo disabled while scene is playing." );
			return;

		}

		this.editor.signals.sceneGraphChanged.active = false;
		this.editor.signals.historyChanged.active = false;

		var cmd = this.undos.length > 0 ? this.undos[ this.undos.length - 1 ] : undefined;	// next cmd to pop

		if ( cmd === undefined || id > cmd.id ) {

			cmd = this.redo();
			while ( cmd !== undefined && id > cmd.id ) {

				cmd = this.redo();

			}

		} else {

			while ( true ) {

				cmd = this.undos[ this.undos.length - 1 ];	// next cmd to pop

				if ( cmd === undefined || id === cmd.id ) break;

				cmd = this.undo();

			}

		}

		this.editor.signals.sceneGraphChanged.active = true;
		this.editor.signals.historyChanged.active = true;

		this.editor.signals.sceneGraphChanged.dispatch();
		this.editor.signals.historyChanged.dispatch( cmd );

	},

	enableSerialization: function ( id ) {

		/**
		 * because there might be commands in this.undos and this.redos
		 * which have not been serialized with .toJSON() we go back
		 * to the oldest command and redo one command after the other
		 * while also calling .toJSON() on them.
		 */

		this.goToState( - 1 );

		this.editor.signals.sceneGraphChanged.active = false;
		this.editor.signals.historyChanged.active = false;

		var cmd = this.redo();
		while ( cmd !== undefined ) {

			if ( ! cmd.hasOwnProperty( "json" ) ) {

				cmd.json = cmd.toJSON();

			}
			cmd = this.redo();

		}

		this.editor.signals.sceneGraphChanged.active = true;
		this.editor.signals.historyChanged.active = true;

		this.goToState( id );

	}

};

// File:editor/js/Loader.js

/**
 * @author mrdoob / http://mrdoob.com/
 */

var Loader = function ( editor ) {

	var scope = this;
	var signals = editor.signals;

	this.texturePath = '';

	this.loadFile = function ( file ) {

		console.log(file);

		var filename = file.name;
		var extension = filename.split( '.' ).pop().toLowerCase();

		//Debug download stuff
		// var reader = new FileReader();
		// reader.addEventListener( 'progress', function ( event ) {

		// 	var size = '(' + Math.floor( event.total / 1000 ).format() + ' KB)';
		// 	var progress = Math.floor( ( event.loaded / event.total ) * 100 ) + '%';
		// 	console.log( 'Loading', filename, size, progress );

		// } );

		switch ( extension ) {

			case 'amf':

				var reader = new FileReader();
				reader.addEventListener( 'load', function ( event ) {

					var loader = new THREE.AMFLoader();
					var amfobject = loader.parse( event.target.result );

					editor.execute( new AddObjectCommand( amfobject ) );

				}, false );
				reader.readAsArrayBuffer( file );

				break;

			case 'awd':

				var reader = new FileReader();
				reader.addEventListener( 'load', function ( event ) {

					var loader = new THREE.AWDLoader();
					var scene = loader.parse( event.target.result );

					editor.execute( new SetSceneCommand( scene ) );

				}, false );
				reader.readAsArrayBuffer( file );

				break;

			case 'babylon':

				var reader = new FileReader();
				reader.addEventListener( 'load', function ( event ) {

					var contents = event.target.result;
					var json = JSON.parse( contents );

					var loader = new THREE.BabylonLoader();
					var scene = loader.parse( json );

					editor.execute( new SetSceneCommand( scene ) );

				}, false );
				reader.readAsText( file );

				break;

			case 'babylonmeshdata':

				var reader = new FileReader();
				reader.addEventListener( 'load', function ( event ) {

					var contents = event.target.result;
					var json = JSON.parse( contents );

					var loader = new THREE.BabylonLoader();

					var geometry = loader.parseGeometry( json );
					var material = new THREE.MeshStandardMaterial();

					var mesh = new THREE.Mesh( geometry, material );
					mesh.name = filename;

					editor.execute( new AddObjectCommand( mesh ) );

				}, false );
				reader.readAsText( file );

				break;

			case 'ctm':

				var reader = new FileReader();
				reader.addEventListener( 'load', function ( event ) {

					var data = new Uint8Array( event.target.result );

					var stream = new CTM.Stream( data );
					stream.offset = 0;

					var loader = new THREE.CTMLoader();
					loader.createModel( new CTM.File( stream ), function( geometry ) {

						geometry.sourceType = "ctm";
						geometry.sourceFile = file.name;

						var material = new THREE.MeshStandardMaterial();

						var mesh = new THREE.Mesh( geometry, material );
						mesh.name = filename;

						editor.execute( new AddObjectCommand( mesh ) );

					} );

				}, false );
				reader.readAsArrayBuffer( file );

				break;

			case 'dae':

				var reader = new FileReader();
				reader.addEventListener( 'load', function ( event ) {

					var contents = event.target.result;

					var loader = new THREE.ColladaLoader();
					var collada = loader.parse( contents );

					collada.scene.name = filename;

					editor.execute( new AddObjectCommand( collada.scene ) );

				}, false );
				reader.readAsText( file );

				break;

			case 'fbx':

				reader.addEventListener( 'load', function ( event ) {

					var contents = event.target.result;

					var loader = new THREE.FBXLoader();
					var object = loader.parse( contents );

					editor.execute( new AddObjectCommand( object ) );

				}, false );
				reader.readAsText( file );

				break;

				case 'gltf':

					reader.addEventListener( 'load', function ( event ) {

						var contents = event.target.result;
						var json = JSON.parse( contents );

						var loader = new THREE.GLTFLoader();
						var collada = loader.parse( json );

						collada.scene.name = filename;

						editor.execute( new AddObjectCommand( collada.scene ) );

					}, false );
					reader.readAsText( file );

					break;

			case 'js':
			case 'json':

			case '3geo':
			case '3mat':
			case '3obj':
			case '3scn':

				var reader = new FileReader();
				reader.addEventListener( 'load', function ( event ) {

					var contents = event.target.result;

					// 2.0

					if ( contents.indexOf( 'postMessage' ) !== - 1 ) {

						var blob = new Blob( [ contents ], { type: 'text/javascript' } );
						var url = URL.createObjectURL( blob );

						var worker = new Worker( url );

						worker.onmessage = function ( event ) {

							event.data.metadata = { version: 2 };
							handleJSON( event.data, file, filename );

						};

						worker.postMessage( Date.now() );

						return;

					}

					// >= 3.0

					var data;

					try {

						data = JSON.parse( contents );

					} catch ( error ) {

						alert( error );
						return;

					}

					handleJSON( data, file, filename );

				}, false );
				reader.readAsText( file );

				break;


			case 'kmz':

				var reader = new FileReader();
				reader.addEventListener( 'load', function ( event ) {

					var loader = new THREE.KMZLoader();
					var collada = loader.parse( event.target.result );

					collada.scene.name = filename;

					editor.execute( new AddObjectCommand( collada.scene ) );

				}, false );
				reader.readAsArrayBuffer( file );

				break;

			case 'md2':

				var reader = new FileReader();
				reader.addEventListener( 'load', function ( event ) {

					var contents = event.target.result;

					var geometry = new THREE.MD2Loader().parse( contents );
					var material = new THREE.MeshStandardMaterial( {
						morphTargets: true,
						morphNormals: true
					} );

					var mesh = new THREE.Mesh( geometry, material );
					mesh.mixer = new THREE.AnimationMixer( mesh );
					mesh.name = filename;

					editor.execute( new AddObjectCommand( mesh ) );

				}, false );
				reader.readAsArrayBuffer( file );

				break;

			case 'obj':

				var reader = new FileReader();
				reader.addEventListener( 'load', function ( event ) {

					var contents = event.target.result;

					var object = new THREE.OBJLoader().parse( contents );
					object.name = filename;

					editor.execute( new AddObjectCommand( object ) );

				}, false );
				reader.readAsText( file );

				break;

			case 'playcanvas':

				var reader = new FileReader();
				reader.addEventListener( 'load', function ( event ) {

					var contents = event.target.result;
					var json = JSON.parse( contents );

					var loader = new THREE.PlayCanvasLoader();
					var object = loader.parse( json );

					editor.execute( new AddObjectCommand( object ) );

				}, false );
				reader.readAsText( file );

				break;

			case 'ply':

				var reader = new FileReader();
				reader.addEventListener( 'load', function ( event ) {

					var contents = event.target.result;

					var geometry = new THREE.PLYLoader().parse( contents );
					geometry.sourceType = "ply";
					geometry.sourceFile = file.name;

					var material = new THREE.MeshStandardMaterial();

					var mesh = new THREE.Mesh( geometry, material );
					mesh.name = filename;

					editor.execute( new AddObjectCommand( mesh ) );

				}, false );
				reader.readAsText( file );

				break;

			case 'stl':

				var reader = new FileReader();
				reader.addEventListener( 'load', function ( event ) {

					var contents = event.target.result;

					var geometry = new THREE.STLLoader().parse( contents );
					geometry.sourceType = "stl";
					geometry.sourceFile = file.name;

					var material = new THREE.MeshStandardMaterial();

					var mesh = new THREE.Mesh( geometry, material );
					mesh.name = filename;

					editor.execute( new AddObjectCommand( mesh ) );

				}, false );

				if ( reader.readAsBinaryString !== undefined ) {

					reader.readAsBinaryString( file );

				} else {

					reader.readAsArrayBuffer( file );

				}

				break;

			/*
			case 'utf8':

				var reader = new FileReader();
				reader.addEventListener( 'load', function ( event ) {

					var contents = event.target.result;

					var geometry = new THREE.UTF8Loader().parse( contents );
					var material = new THREE.MeshLambertMaterial();

					var mesh = new THREE.Mesh( geometry, material );

					editor.execute( new AddObjectCommand( mesh ) );

				}, false );
				reader.readAsBinaryString( file );

				break;
			*/

			case 'vtk':

				var reader = new FileReader();
				reader.addEventListener( 'load', function ( event ) {

					var contents = event.target.result;

					var geometry = new THREE.VTKLoader().parse( contents );
					geometry.sourceType = "vtk";
					geometry.sourceFile = file.name;

					var material = new THREE.MeshStandardMaterial();

					var mesh = new THREE.Mesh( geometry, material );
					mesh.name = filename;

					editor.execute( new AddObjectCommand( mesh ) );

				}, false );
				reader.readAsText( file );

				break;

			case 'wrl':

				var reader = new FileReader();
				reader.addEventListener( 'load', function ( event ) {

					var contents = event.target.result;

					var result = new THREE.VRMLLoader().parse( contents );

					editor.execute( new SetSceneCommand( result ) );

				}, false );
				reader.readAsText( file );

				break;

			default:

				alert( 'Unsupported file format (' + extension +  ').' );

				break;

		}

	};

	function handleJSON( data, file, filename ) {

		if ( data.metadata === undefined ) { // 2.0

			data.metadata = { type: 'Geometry' };

		}

		if ( data.metadata.type === undefined ) { // 3.0

			data.metadata.type = 'Geometry';

		}

		if ( data.metadata.formatVersion !== undefined ) {

			data.metadata.version = data.metadata.formatVersion;

		}

		switch ( data.metadata.type.toLowerCase() ) {

			case 'buffergeometry':
				// console.log("buffergeometry");

				var loader = new THREE.BufferGeometryLoader();
				var result = loader.parse( data );

				var mesh = new THREE.Mesh( result );

				editor.execute( new AddObjectCommand( mesh ) );

				break;

			case 'geometry':
				// console.log("geometry");

				var loader = new THREE.JSONLoader();
				loader.setTexturePath( scope.texturePath );

				var result = loader.parse( data );

				var geometry = result.geometry;
				console.log(geometry);

				var material;

				if ( result.materials !== undefined ) {

					if ( result.materials.length > 1 ) {

						material = new THREE.MultiMaterial( result.materials );

					} else {

						material = result.materials[ 0 ];

					}

				} else {

					material = new THREE.MeshStandardMaterial();

				}

				geometry.sourceType = "ascii";
				geometry.sourceFile = file.name;

				var mesh;

				if ( geometry.animations) {

				// if ( geometry.animation && geometry.animation.hierarchy ) {

					mesh = new THREE.SkinnedMesh( geometry, material );

				} else {

					mesh = new THREE.Mesh( geometry, material );

				}

				mesh.name = filename;

				editor.execute( new AddObjectCommand( mesh ) );

				break;

			case 'object':
				console.log("object");

				var loader = new THREE.ObjectLoader();
				loader.setTexturePath( scope.texturePath );

				var result = loader.parse( data );

				if ( result instanceof THREE.Scene ) {

					editor.execute( new SetSceneCommand( result ) );

				} else {

					editor.execute( new AddObjectCommand( result ) );

				}

				break;

			case 'scene':
				console.log("scene");

				// DEPRECATED

				var loader = new THREE.SceneLoader();
				loader.parse( data, function ( result ) {

					editor.execute( new SetSceneCommand( result.scene ) );

				}, '' );

				break;

			case 'app':

				console.log(data);

				editor.fromJSON( data );

				break;

		}

	}

};

// File:editor/js/Menubar.js

/**
 * @author mrdoob / http://mrdoob.com/
 */

var Menubar = function ( editor ) {

	var container = new UI.Panel();
	container.setId( 'menubar' );

	container.add( new Menubar.File( editor ) );
	container.add( new Menubar.Edit( editor ) );
	container.add( new Menubar.Add( editor ) );
	container.add( new Menubar.Library( editor ));
	container.add( new Menubar.Play( editor ) );

	// container.add( new Menubar.Examples( editor ) );
	container.add( new Menubar.Help( editor ) );

	container.add( new Menubar.Status( editor ) );

	return container;

};

// File:editor/js/Menubar.File.js

/**
 * @author mrdoob / http://mrdoob.com/
 */

Menubar.File = function ( editor ) {

	var container = new UI.Panel();
	container.setClass( 'menu' );

	var title = new UI.Panel();
	title.setClass( 'title' );
	title.setTextContent( 'File' );
	container.add( title );

	var options = new UI.Panel();
	options.setClass( 'options' );
	container.add( options );

	// New

	var option = new UI.Row();
	option.setClass( 'option' );
	option.setTextContent( 'New' );
	option.onClick( function () {

		if ( confirm( 'Any unsaved data will be lost. Are you sure?' ) ) {

			editor.clear();

		}

	} );
	options.add( option );

	//

	options.add( new UI.HorizontalRule() );

	// Import

	var fileInput = document.createElement( 'input' );
	fileInput.type = 'file';
	fileInput.addEventListener( 'change', function ( event ) {

		editor.loader.loadFile( fileInput.files[ 0 ] );

	} );

	var option = new UI.Row();
	option.setClass( 'option' );
	option.setTextContent( 'Import' );
	option.onClick( function () {

		fileInput.click();

	} );
	options.add( option );

	//

	options.add( new UI.HorizontalRule() );

	// Export Editor

	var option = new UI.Row();
	option.setClass( 'option' );
	option.setTextContent( 'Export Editor' );
	option.onClick( function () {

		var zip = new JSZip();

		//

		var output = editor.toJSON();
		output.metadata.type = 'App';
		delete output.history;

		// console.log(output.scene.textures.length);

		// for(var i = 0; i < output.scene.textures.length; i++){
		// 	for(var ii = 0; ii < output.scene.textures.length; ii++){
		// 		console.log(output.scene.textures[i].image);

		// 		var _oldUUID = output.scene.textures[ii].uuid;
		// 		var _newUUID = output.scene.textures[i].uuid;

		// 		for(var iii = 0; i < output.scene.materials.length; iii++){

		// 			if(output.scene.materials[iii].map == _oldUUID)
		// 		}
			
		// 	}
		// }


		output = JSON.stringify( output, null, '\t' );
		output = output.replace( /[\n\t]+([\d\.e\-\[\]]+)/g, '$1' );

		saveString( output, 'zaak.json' );

		// //

		// var manager = new THREE.LoadingManager( function () {

		// 	save( zip.generate( { type: 'blob' } ), 'download.zip' );

		// } );

		// var loader = new THREE.XHRLoader( manager );
		// loader.load( 'js/libs/app/index.html', function ( content ) {

		// 	zip.file( 'index.html', content );

		// } );
		// loader.load( 'js/libs/app.js', function ( content ) {

		// 	zip.file( 'js/app.js', content );

		// } );
		// loader.load( '../build/three.min.js', function ( content ) {

		// 	zip.file( 'js/three.min.js', content );

		// } );

	} );
	options.add( option );


	// Export Geometry

	/*var option = new UI.Row();
	option.setClass( 'option' );
	option.setTextContent( 'Export Geometry' );
	option.onClick( function () {

		var object = editor.selected;

		if ( object === null ) {

			alert( 'No object selected.' );
			return;

		}

		var geometry = object.geometry;

		if ( geometry === undefined ) {

			alert( 'The selected object doesn\'t have geometry.' );
			return;

		}

		var output = geometry.toJSON();

		try {

			output = JSON.stringify( output, null, '\t' );
			output = output.replace( /[\n\t]+([\d\.e\-\[\]]+)/g, '$1' );

		} catch ( e ) {

			output = JSON.stringify( output );

		}

		saveString( output, 'geometry.json' );

	} );
	options.add( option );*/

	// Export Geometry

	// var option = new UI.Row();
	// option.setClass( 'option' );
	// option.setTextContent( 'Export Geometry' );
	// option.onClick( function () {

	// 	var object = editor.selected;

	// 	if ( object === null ) {

	// 		alert( 'No object selected.' );
	// 		return;

	// 	}

	// 	var geometry = object.geometry;

	// 	if ( geometry === undefined ) {

	// 		alert( 'The selected object doesn\'t have geometry.' );
	// 		return;

	// 	}

	// 	var output = geometry.toJSON();

	// 	try {

	// 		output = JSON.stringify( output, null, '\t' );
	// 		output = output.replace( /[\n\t]+([\d\.e\-\[\]]+)/g, '$1' );

	// 	} catch ( e ) {

	// 		output = JSON.stringify( output );

	// 	}

	// 	saveString( output, 'geometry.json' );

	// } );
	// options.add( option );

	// Export Object

	var option = new UI.Row();
	option.setClass( 'option' );
	option.setTextContent( 'Export Object' );
	option.onClick( function () {

		var object = editor.selected;

		if ( object === null ) {

			alert( 'No object selected' );
			return;

		}

		var output = object.toJSON();

		try {

			output = JSON.stringify( output, null, '\t' );
			output = output.replace( /[\n\t]+([\d\.e\-\[\]]+)/g, '$1' );

		} catch ( e ) {

			output = JSON.stringify( output );

		}

		saveString( output, 'model.json' );

	} );
	options.add( option );

	// // Export Scene

	// var option = new UI.Row();
	// option.setClass( 'option' );
	// option.setTextContent( 'Export Scene' );
	// option.onClick( function () {

	// 	var output = editor.scene.toJSON();

	// 	try {

	// 		output = JSON.stringify( output, null, '\t' );
	// 		output = output.replace( /[\n\t]+([\d\.e\-\[\]]+)/g, '$1' );

	// 	} catch ( e ) {

	// 		output = JSON.stringify( output );

	// 	}

	// 	saveString( output, 'scene.json' );

	// } );
	// options.add( option );

	// // Export OBJ

	// var option = new UI.Row();
	// option.setClass( 'option' );
	// option.setTextContent( 'Export OBJ' );
	// option.onClick( function () {

	// 	var object = editor.selected;

	// 	if ( object === null ) {

	// 		alert( 'No object selected.' );
	// 		return;

	// 	}

	// 	var exporter = new THREE.OBJExporter();

	// 	saveString( exporter.parse( object ), 'model.obj' );

	// } );
	// options.add( option );

	// // Export STL

	// var option = new UI.Row();
	// option.setClass( 'option' );
	// option.setTextContent( 'Export STL' );
	// option.onClick( function () {

	// 	var exporter = new THREE.STLExporter();

	// 	saveString( exporter.parse( editor.scene ), 'model.stl' );

	// } );
	// options.add( option );

	//

	options.add( new UI.HorizontalRule() );

	// Publish
	var option = new UI.Panel();
    option.setClass( 'option' );
    option.setTextContent( 'Publish' );

    option.onClick( function () {
        var output = editor.toJSON();
        output.metadata.type = 'App';
		delete output.history;
        App.Helper.Save(output);
    } );
    options.add( option );

	/*var option = new UI.Row();
	option.setClass( 'option' );
	option.setTextContent( 'Publish' );
	option.onClick( function () {

		var zip = new JSZip();

		//


		var vr = output.project.vr;

		output = JSON.stringify( output, null, '\t' );
		output = output.replace( /[\n\t]+([\d\.e\-\[\]]+)/g, '$1' );

			var includes = [];

			if ( vr ) {

				includes.push( '<script src="js/VRControls.js"></script>' );
				includes.push( '<script src="js/VREffect.js"></script>' );
				includes.push( '<script src="js/WebVR.js"></script>' );

			}

			content = content.replace( '<!-- includes -->', includes.join( '\n\t\t' ) );

			zip.file( 'index.html', content );


		if ( vr ) {

			loader.load( '../examples/js/controls/VRControls.js', function ( content ) {

				zip.file( 'js/VRControls.js', content );

			} );

			loader.load( '../examples/js/effects/VREffect.js', function ( content ) {

				zip.file( 'js/VREffect.js', content );

			} );

			loader.load( '../examples/js/WebVR.js', function ( content ) {

				zip.file( 'js/WebVR.js', content );

			} );

		}

	} );
	options.add( option );
	*/

	/*
	// Publish (Dropbox)

	var option = new UI.Row();
	option.setClass( 'option' );
	option.setTextContent( 'Publish (Dropbox)' );
	option.onClick( function () {

		var parameters = {
			files: [
				{ 'url': 'data:text/plain;base64,' + window.btoa( "Hello, World" ), 'filename': 'app/test.txt' }
			]
		};

		Dropbox.save( parameters );

	} );
	options.add( option );
	*/


	//

	var link = document.createElement( 'a' );
	link.style.display = 'none';
	document.body.appendChild( link ); // Firefox workaround, see #6594

	function save( blob, filename ) {

		link.href = URL.createObjectURL( blob );
		link.download = filename || 'data.json';
		link.click();

		// URL.revokeObjectURL( url ); breaks Firefox...

	}

	function saveString( text, filename ) {

		save( new Blob( [ text ], { type: 'text/plain' } ), filename );

	}

	return container;

};

// File:editor/js/Menubar.Edit.js

/**
 * @author mrdoob / http://mrdoob.com/
 */

Menubar.Edit = function ( editor ) {

	var container = new UI.Panel();
	container.setClass( 'menu' );

	var title = new UI.Panel();
	title.setClass( 'title' );
	title.setTextContent( 'Edit' );
	container.add( title );

	var options = new UI.Panel();
	options.setClass( 'options' );
	container.add( options );

	// Undo

	var undo = new UI.Row();
	undo.setClass( 'option' );
	undo.setTextContent( 'Undo (Ctrl+Z)' );
	undo.onClick( function () {

		editor.undo();

	} );
	options.add( undo );

	// Redo

	var redo = new UI.Row();
	redo.setClass( 'option' );
	redo.setTextContent( 'Redo (Ctrl+Shift+Z)' );
	redo.onClick( function () {

		editor.redo();

	} );
	options.add( redo );

	// Clear History

	var option = new UI.Row();
	option.setClass( 'option' );
	option.setTextContent( 'Clear History' );
	option.onClick( function () {

		if ( confirm( 'The Undo/Redo History will be cleared. Are you sure?' ) ) {

			editor.history.clear();

		}

	} );
	options.add( option );


	editor.signals.historyChanged.add( function () {

		var history = editor.history;

		undo.setClass( 'option' );
		redo.setClass( 'option' );

		if ( history.undos.length == 0 ) {

			undo.setClass( 'inactive' );

		}

		if ( history.redos.length == 0 ) {

			redo.setClass( 'inactive' );

		}

	} );

	// ---

	options.add( new UI.HorizontalRule() );

	// Clone

	var option = new UI.Row();
	option.setClass( 'option' );
	option.setTextContent( 'Clone' );
	option.onClick( function () {

		var object = editor.selected;

		if ( object.parent === null ) return; // avoid cloning the camera or scene

		object = object.clone();

		editor.execute( new AddObjectCommand( object ) );

	} );
	options.add( option );

	// Delete

	var option = new UI.Row();
	option.setClass( 'option' );
	option.setTextContent( 'Delete (Del)' );
	option.onClick( function () {

		var object = editor.selected;

		if ( confirm( 'Delete ' + object.name + '?' ) === false ) return;

		var parent = object.parent;
		if ( parent === undefined ) return; // avoid deleting the camera or scene

		editor.execute( new RemoveObjectCommand( object ) );

	} );
	options.add( option );

	// Minify shaders

	var option = new UI.Row();
	option.setClass( 'option' );
	option.setTextContent( 'Minify Shaders' );
	option.onClick( function() {

		var root = editor.selected || editor.scene;

		var errors = [];
		var nMaterialsChanged = 0;

		var path = [];

		function getPath ( object ) {

			path.length = 0;

			var parent = object.parent;
			if ( parent !== undefined ) getPath( parent );

			path.push( object.name || object.uuid );

			return path;

		}

		var cmds = [];
		root.traverse( function ( object ) {

			var material = object.material;

			if ( material instanceof THREE.ShaderMaterial ) {

				try {

					var shader = glslprep.minifyGlsl( [
							material.vertexShader, material.fragmentShader ] );

					cmds.push( new SetMaterialValueCommand( object, 'vertexShader', shader[ 0 ] ) );
					cmds.push( new SetMaterialValueCommand( object, 'fragmentShader', shader[ 1 ] ) );

					++nMaterialsChanged;

				} catch ( e ) {

					var path = getPath( object ).join( "/" );

					if ( e instanceof glslprep.SyntaxError )

						errors.push( path + ":" +
								e.line + ":" + e.column + ": " + e.message );

					else {

						errors.push( path +
								": Unexpected error (see console for details)." );

						console.error( e.stack || e );

					}

				}

			}

		} );

		if ( nMaterialsChanged > 0 ) {

			editor.execute( new MultiCmdsCommand( cmds ), 'Minify Shaders' );

		}

		window.alert( nMaterialsChanged +
				" material(s) were changed.\n" + errors.join( "\n" ) );

	} );
	options.add( option );


	return container;

};

// File:editor/js/Menubar.Add.js

/**
 * @author mrdoob / http://mrdoob.com/
 */

Menubar.Add = function ( editor ) {

	var container = new UI.Panel();
	container.setClass( 'menu' );

	var title = new UI.Panel();
	title.setClass( 'title' );
	title.setTextContent( 'Add' );
	container.add( title );

	var options = new UI.Panel();
	options.setClass( 'options' );
	container.add( options );

	//

	var meshCount = 0;
	var lightCount = 0;
	var cameraCount = 0;

	editor.signals.editorCleared.add( function () {

		meshCount = 0;
		lightCount = 0;
		cameraCount = 0;

	} );

	// Group

	var option = new UI.Row();
	option.setClass( 'option' );
	option.setTextContent( 'Group' );
	option.onClick( function () {

		var mesh = new THREE.Group();
		mesh.name = 'Group ' + ( ++ meshCount );

		editor.execute( new AddObjectCommand( mesh ) );

	} );
	options.add( option );

	//

	options.add( new UI.HorizontalRule() );

	// Video Object

	// var option = new UI.Row();
	// option.setClass( 'option' );
	// option.setTextContent( 'VideoPlayer' );
	// option.onClick( function () {

	// 	var varArray = {
	// 	    url: 'images/ttf.mp4',
	//   	};

	// 	var script = { name: 'VideoPlayer', publicVar: varArray, source: "var video;\nvar texture;\nvar isPlaying = false;\n\nfunction init ( event ){\n\n\tvideo = document.createElement('video');\n\tvideo.autoplay = true;\n\tvideo.loop = true;\n\tvideo.width\t= 1920;\n\tvideo.height = 1080;\n\tvideo.src = url;\n\tvideo.load();\n\n\t// create the texture\n\ttexture\t= new THREE.Texture( video );\n\n}\n\nfunction update( event ) {\n\n\tif( video.readyState !== video.HAVE_ENOUGH_DATA )\treturn;\n\t\ttexture.needsUpdate\t= true;\t\n\n\tthis.material = new THREE.MeshStandardMaterial({\n\t\tmap\t: texture\n\t});\n}\n\nfunction rayHit( event ){\n\t\n\tif(isPlaying)\n\t\tvideo.pause();\n\telse\n\t\tvideo.play();\n\t\n\tisPlaying = ! isPlaying;\n}\n\n\nfunction stop ( event ) {\n\t\n\tvideo.pause();\n}"};
	// 	editor.execute( new AddScriptCommand( editor.selected, script ) );

	// } );
	// options.add( option );

	// //Audio
	// var option = new UI.Row();
	// option.setClass( 'option' );
	// option.setTextContent( 'AudioSource' );
	// option.onClick( function () {

	// 	var varArray = {
	// 	    url: 'sound/test.mp3',
	//   	};

	// 	var script = { name: 'AudioSource', publicVar: varArray, source: "var listener = camera.getObjectByName(\"Listener\");\nvar audioSource;\nvar isPlaying = true;\n\nfunction init ( event ){\n\n\tconsole.log(this.name);\n\t\n\taudioSource = new THREE.PositionalAudio(listener);\n\taudioSource.load( url );\n\taudioSource.setRefDistance( 20 );\n\taudioSource.autoplay = isPlaying;\n\tthis.add( audioSource );\n\n}\n\nfunction rayHit( event ){\n\t\n\t \n\tif(isPlaying)\n\t \taudioSource.pause();\n\telse\n\t \taudioSource.play();\n\t\t\n\tisPlaying = !isPlaying;\n\t\n}\n\n\nfunction stop ( event ) {\n\t\n\taudioSource.stop();\n}"};

	// 	editor.execute( new AddScriptCommand( editor.selected, script ) );

	// } );
	// options.add( option );

	// //Move To
	// var option = new UI.Row();
	// option.setClass( 'option' );
	// option.setTextContent( 'Move To' );
	// option.onClick( function () {

	// 	var script = { name: 'MoveTo', source: "var billboarding = true;\n\nfunction update( event ){\n\t\n\tif(billboarding){\n\n\t\tthis.quaternion.copy( camera.quaternion );\n\t\n\t}\n\n}\n\nfunction rayHit( event ){\n\n\tif(tween !== undefined)\n    \ttween.stop();\n\n    var newPos = this.position;\n\n\ttween = new TWEEN.Tween(camera.position).to(newPos, 1300).onComplete(reactivate);\n    tween.easing(TWEEN.Easing.Cubic.InOut);\n\n    tween.start();\n\t\n}"};

	// 	editor.execute( new AddScriptCommand( editor.selected, script ) );

	// } );
	// options.add( option );

	// //Jump To
	// var option = new UI.Row();
	// option.setClass( 'option' );
	// option.setTextContent( 'Jump To' );
	// option.onClick( function () {

	// 	var varArray = {
	// 	    targetName: 'Target_JumpTo',
	//   	};

	// 	var script = { name: 'JumpTo', publicVar: varArray, source: "var billboarding = true;\n\nvar targetPosition;\n\nfunction init( event ){\n\t\n\tconsole.log(this.name);\n\n\ttargetPosition = scene.getObjectByName(targetName).position;\n}\n\nfunction update( event ){\n\t\n\tif(billboarding){\n\n\t\tthis.quaternion.copy( camera.quaternion );\n\t\n\t}\n}\n\nfunction rayHit( event ){\n\n\tif(tween !== undefined)\n    \ttween.stop();\n\n\ttween = new TWEEN.Tween(camera.position).to(targetPosition, 20).onComplete(reactivate); \n\n    tween.start();\n\t\n}"};

	// 	editor.execute( new AddScriptCommand( editor.selected, script ) );

	// } );
	// options.add( option );

	// //Billboarding
	// var option = new UI.Row();
	// option.setClass( 'option' );
	// option.setTextContent( 'Billboarding' );
	// option.onClick( function () {

	// 	var script = { name: 'Billboarding', source: "var billboarding = true;\n\nfunction update( event ){\n\t\n\tif(billboarding){\n\n\t\tthis.quaternion.copy( camera.quaternion );\n\t\n\t}\n\n}"};

	// 	editor.execute( new AddScriptCommand( editor.selected, script ) );

	// } );
	// options.add( option );

	// //
	// var option = new UI.Row();
	// option.setClass( 'option' );
	// option.setTextContent( 'Library' );
	// option.onClick( function () {

 //        // preview box
 //        var preview = "<div id='preview' class='modal-box' style='height:100%;width:100%;text-align: center;'> \
 //        <header style='background-color:#333;'> \
 //            <a class='js-modal-close close' style='top:1.5%;'>×</a> \
 //        </header> \
 //        <div style='height:100%;'> \
 //            <iframe id='library_iframe' width='100%' height='100%' allowfullscreen src=" + LIBRARY_URL + "></iframe> \
 //        </div></div>";
 //        $("body").append($.parseHTML(preview));

 //        var modal =  ("<div class='modal-overlay js-modal-close'></div>");
 //        $("body").append(modal);

 //        $(".modal-overlay").fadeTo(500, 0.9);
 //        $('#preview').fadeIn();
 //        // modal helper
 //        $(".js-modal-close, .modal-overlay").click(function() {
 //            $(".modal-box, .modal-overlay").fadeOut(500, function() {
 //            	// player.stop();
 //                $(".modal-overlay").remove();
 //                $("#preview").remove();
 //            });
 //        });
 //        $(window).resize(function() {
 //            $(".modal-box").css({
 //                top: ($(window).height() - $("#preview").outerHeight()) / 2,
 //                left: ($(window).width() - $("#preview").outerWidth()) / 2
 //            });
 //        });

 //        $(window).resize();


	// } );
	// options.add( option );

	

	// options.add( new UI.HorizontalRule() );

	// Plane

	var option = new UI.Row();
	option.setClass( 'option' );
	option.setTextContent( 'Plane' );
	option.onClick( function () {

		var geometry = new THREE.PlaneBufferGeometry( 2, 2 );
		var material = new THREE.MeshStandardMaterial();
		var mesh = new THREE.Mesh( geometry, material );
		mesh.name = 'Plane ' + ( ++ meshCount );

		editor.execute( new AddObjectCommand( mesh ) );

	} );
	options.add( option );

	// Box

	var option = new UI.Row();
	option.setClass( 'option' );
	option.setTextContent( 'Box' );
	option.onClick( function () {

		var geometry = new THREE.BoxBufferGeometry( 1, 1, 1 );
		var mesh = new THREE.Mesh( geometry, new THREE.MeshStandardMaterial() );
		mesh.name = 'Box ' + ( ++ meshCount );

		editor.execute( new AddObjectCommand( mesh ) );

	} );
	options.add( option );

	// Circle

	var option = new UI.Row();
	option.setClass( 'option' );
	option.setTextContent( 'Circle' );
	option.onClick( function () {

		var radius = 1;
		var segments = 32;

		var geometry = new THREE.CircleBufferGeometry( radius, segments );
		var mesh = new THREE.Mesh( geometry, new THREE.MeshStandardMaterial() );
		mesh.name = 'Circle ' + ( ++ meshCount );

		editor.execute( new AddObjectCommand( mesh ) );

	} );
	// options.add( option );

	// Cylinder

	var option = new UI.Row();
	option.setClass( 'option' );
	option.setTextContent( 'Cylinder' );
	option.onClick( function () {

		var radiusTop = 1;
		var radiusBottom = 1;
		var height = 2;
		var radiusSegments = 32;
		var heightSegments = 1;
		var openEnded = false;

		var geometry = new THREE.CylinderBufferGeometry( radiusTop, radiusBottom, height, radiusSegments, heightSegments, openEnded );
		var mesh = new THREE.Mesh( geometry, new THREE.MeshStandardMaterial() );
		mesh.name = 'Cylinder ' + ( ++ meshCount );

		editor.execute( new AddObjectCommand( mesh ) );

	} );
	// options.add( option );

	// Sphere
	var option = new UI.Row();
	option.setClass( 'option' );
	option.setTextContent( 'Sphere' );
	option.onClick( function () {

		var radius = 1;
		var widthSegments = 32;
		var heightSegments = 16;
		var phiStart = 0;
		var phiLength = Math.PI * 2;
		var thetaStart = 0;
		var thetaLength = Math.PI;

		var geometry = new THREE.SphereBufferGeometry( radius, widthSegments, heightSegments, phiStart, phiLength, thetaStart, thetaLength );
		var mesh = new THREE.Mesh( geometry, new THREE.MeshStandardMaterial() );
		mesh.name = 'Sphere ' + ( ++ meshCount );

		editor.execute( new AddObjectCommand( mesh ) );

	} );
	options.add( option );

	// Icosahedron

	var option = new UI.Row();
	option.setClass( 'option' );
	option.setTextContent( 'Icosahedron' );
	option.onClick( function () {

		var radius = 1;
		var detail = 2;

		var geometry = new THREE.IcosahedronGeometry( radius, detail );
		var mesh = new THREE.Mesh( geometry, new THREE.MeshStandardMaterial() );
		mesh.name = 'Icosahedron ' + ( ++ meshCount );

		editor.execute( new AddObjectCommand( mesh ) );

	} );
	options.add( option );

	// Torus

	var option = new UI.Row();
	option.setClass( 'option' );
	option.setTextContent( 'Torus' );
	option.onClick( function () {

		var radius = 2;
		var tube = 1;
		var radialSegments = 32;
		var tubularSegments = 12;
		var arc = Math.PI * 2;

		var geometry = new THREE.TorusBufferGeometry( radius, tube, radialSegments, tubularSegments, arc );
		var mesh = new THREE.Mesh( geometry, new THREE.MeshStandardMaterial() );
		mesh.name = 'Torus ' + ( ++ meshCount );

		editor.execute( new AddObjectCommand( mesh ) );

	} );
	// options.add( option );

	// TorusKnot

	var option = new UI.Row();
	option.setClass( 'option' );
	option.setTextContent( 'TorusKnot' );
	option.onClick( function () {

		var radius = 2;
		var tube = 0.8;
		var tubularSegments = 64;
		var radialSegments = 12;
		var p = 2;
		var q = 3;

		var geometry = new THREE.TorusKnotBufferGeometry( radius, tube, tubularSegments, radialSegments, p, q );
		var mesh = new THREE.Mesh( geometry, new THREE.MeshStandardMaterial() );
		mesh.name = 'TorusKnot ' + ( ++ meshCount );

		editor.execute( new AddObjectCommand( mesh ) );

	} );
	// options.add( option );

	/*
	// Teapot

	var option = new UI.Row();
	option.setClass( 'option' );
	option.setTextContent( 'Teapot' );
	option.onClick( function () {

		var size = 50;
		var segments = 10;
		var bottom = true;
		var lid = true;
		var body = true;
		var fitLid = false;
		var blinnScale = true;

		var material = new THREE.MeshStandardMaterial();

		var geometry = new THREE.TeapotBufferGeometry( size, segments, bottom, lid, body, fitLid, blinnScale );
		var mesh = new THREE.Mesh( geometry, material );
		mesh.name = 'Teapot ' + ( ++ meshCount );

		editor.addObject( mesh );
		editor.select( mesh );

	} );
	options.add( option );
	*/

	// Lathe

	var option = new UI.Row();
	option.setClass( 'option' );
	option.setTextContent( 'Lathe' );
	option.onClick( function() {

		var points = [
			new THREE.Vector2( 0, 0 ),
			new THREE.Vector2( 4, 0 ),
			new THREE.Vector2( 3.5, 0.5 ),
			new THREE.Vector2( 1, 0.75 ),
			new THREE.Vector2( 0.8, 1 ),
			new THREE.Vector2( 0.8, 4 ),
			new THREE.Vector2( 1, 4.2 ),
			new THREE.Vector2( 1.4, 4.8 ),
			new THREE.Vector2( 2, 5 ),
			new THREE.Vector2( 2.5, 5.4 ),
			new THREE.Vector2( 3, 12 )
		];
		var segments = 20;
		var phiStart = 0;
		var phiLength = 2 * Math.PI;

		var geometry = new THREE.LatheBufferGeometry( points, segments, phiStart, phiLength );
		var mesh = new THREE.Mesh( geometry, new THREE.MeshStandardMaterial( { side: THREE.DoubleSide } ) );
		mesh.name = 'Lathe ' + ( ++ meshCount );

		editor.execute( new AddObjectCommand( mesh ) );

	} );
	// options.add( option );

	// Sprite

	var option = new UI.Row();
	option.setClass( 'option' );
	option.setTextContent( 'Sprite' );
	option.onClick( function () {

		var sprite = new THREE.Sprite( new THREE.SpriteMaterial() );
		sprite.name = 'Sprite ' + ( ++ meshCount );

		editor.execute( new AddObjectCommand( sprite ) );

	} );
	options.add( option );

	//

	options.add( new UI.HorizontalRule() );

	// PointLight

	var option = new UI.Row();
	option.setClass( 'option' );
	option.setTextContent( 'PointLight' );
	option.onClick( function () {

		var color = 0xffffff;
		var intensity = 1;
		var distance = 0;

		var light = new THREE.PointLight( color, intensity, distance );
		light.name = 'PointLight ' + ( ++ lightCount );

		editor.execute( new AddObjectCommand( light ) );

	} );
	options.add( option );

	// SpotLight

	var option = new UI.Row();
	option.setClass( 'option' );
	option.setTextContent( 'SpotLight' );
	option.onClick( function () {

		var color = 0xffffff;
		var intensity = 1;
		var distance = 0;
		var angle = Math.PI * 0.1;
		var penumbra = 0;

		var light = new THREE.SpotLight( color, intensity, distance, angle, penumbra );
		light.name = 'SpotLight ' + ( ++ lightCount );
		light.target.name = 'SpotLight ' + ( lightCount ) + ' Target';

		light.position.set( 5, 10, 7.5 );

		editor.execute( new AddObjectCommand( light ) );

	} );
	options.add( option );

	// DirectionalLight

	var option = new UI.Row();
	option.setClass( 'option' );
	option.setTextContent( 'DirectionalLight' );
	option.onClick( function () {

		var color = 0xffffff;
		var intensity = 1;

		var light = new THREE.DirectionalLight( color, intensity );
		light.name = 'DirectionalLight ' + ( ++ lightCount );
		light.target.name = 'DirectionalLight ' + ( lightCount ) + ' Target';

		light.position.set( 5, 10, 7.5 );

		editor.execute( new AddObjectCommand( light ) );

	} );
	options.add( option );

	// HemisphereLight

	var option = new UI.Row();
	option.setClass( 'option' );
	option.setTextContent( 'HemisphereLight' );
	option.onClick( function () {

		var skyColor = 0x00aaff;
		var groundColor = 0xffaa00;
		var intensity = 1;

		var light = new THREE.HemisphereLight( skyColor, groundColor, intensity );
		light.name = 'HemisphereLight ' + ( ++ lightCount );

		light.position.set( 0, 10, 0 );

		editor.execute( new AddObjectCommand( light ) );

	} );
	options.add( option );

	// AmbientLight

	var option = new UI.Row();
	option.setClass( 'option' );
	option.setTextContent( 'AmbientLight' );
	option.onClick( function() {

		var color = 0x222222;

		var light = new THREE.AmbientLight( color );
		light.name = 'AmbientLight ' + ( ++ lightCount );

		editor.execute( new AddObjectCommand( light ) );

	} );
	options.add( option );

	//

	options.add( new UI.HorizontalRule() );

	// PerspectiveCamera

	var option = new UI.Row();
	option.setClass( 'option' );
	option.setTextContent( 'PerspectiveCamera' );
	option.onClick( function() {

		var camera = new THREE.PerspectiveCamera( 50, 1, 1, 10000 );
		camera.name = 'PerspectiveCamera ' + ( ++ cameraCount );

		editor.execute( new AddObjectCommand( camera ) );

	} );
	// options.add( option );

	return container;

}

// File:editor/js/Menubar.Play.js

/**
 * @author mrdoob / http://mrdoob.com/
 */

Menubar.Play = function ( editor ) {

	var signals = editor.signals;

	var container = new UI.Panel();
	container.setClass( 'menu' );

	// var isPlaying = false;

	var title = new UI.Panel();
	title.setClass( 'title' );
	title.setTextContent( 'Play' );
	title.onClick( function () {

		// if ( isPlaying === false ) {

			// isPlaying = true;
			// title.setTextContent( 'Stop' );
			signals.startPlayer.dispatch();

		// } else {

		// 	isPlaying = false;
		// 	title.setTextContent( 'Play' );
		// 	signals.stopPlayer.dispatch();

		// }

	} );
	container.add( title );

	return container;

};
// File:editor/js/Menubar.Examples.js

/**
 * @author mrdoob / http://mrdoob.com/
 */

Menubar.Examples = function ( editor ) {

	var container = new UI.Panel();
	container.setClass( 'menu' );

	var title = new UI.Panel();
	title.setClass( 'title' );
	title.setTextContent( 'Examples' );
	container.add( title );

	var options = new UI.Panel();
	options.setClass( 'options' );
	container.add( options );

	// Examples

	var items = [
		{ title: 'Arkanoid', file: 'arkanoid.app.json' },
		{ title: 'Camera', file: 'camera.app.json' },
		{ title: 'Particles', file: 'particles.app.json' },
		{ title: 'Pong', file: 'pong.app.json' }
	];

	var loader = new THREE.XHRLoader();

	for ( var i = 0; i < items.length; i ++ ) {

		( function ( i ) {

			var item = items[ i ];

			var option = new UI.Row();
			option.setClass( 'option' );
			option.setTextContent( item.title );
			option.onClick( function () {

				if ( confirm( 'Any unsaved data will be lost. Are you sure?' ) ) {

					loader.load( 'examples/' + item.file, function ( text ) {

						editor.clear();
						editor.fromJSON( JSON.parse( text ) );

					} );

				}

			} );
			options.add( option );

		} )( i )

	}

	return container;

};

// File:editor/js/Menubar.Library.js

/**
 * @author mrdoob / http://mrdoob.com/
 */

Menubar.Library = function ( editor ) {

	var signals = editor.signals;

	var container = new UI.Panel();
	container.setClass( 'menu' );

	// var isPlaying = false;

	var title = new UI.Panel();
	title.setClass( 'title' );
	title.setTextContent( 'Library' );
	title.onClick( function () {

		// if ( isPlaying === false ) {

			// isPlaying = true;
			// title.setTextContent( 'Stop' );
			// signals.startPlayer.dispatch();

		// } else {

		// 	isPlaying = false;
		// 	title.setTextContent( 'Play' );
		// 	signals.stopPlayer.dispatch();

		// }
		// preview box
        var preview = "<div id='preview' class='modal-box' style='height:100%;width:100%;text-align: center;'> \
        <header style='background-color:#333;'> \
            <a class='js-modal-close close' style='top:1.5%;'>×</a> \
        </header> \
        <div style='height:100%;'> \
            <iframe id='library_iframe' width='100%' height='100%' allowfullscreen src=" + LIBRARY_URL + "></iframe> \
        </div></div>";
        $("body").append($.parseHTML(preview));

        var modal =  ("<div class='modal-overlay js-modal-close'></div>");
        $("body").append(modal);

        $(".modal-overlay").fadeTo(500, 0.9);
        $('#preview').fadeIn();
        // modal helper
        $(".js-modal-close, .modal-overlay").click(function() {
            $(".modal-box, .modal-overlay").fadeOut(500, function() {
            	// player.stop();
                $(".modal-overlay").remove();
                $("#preview").remove();
            });
        });
        $(window).resize(function() {
            $(".modal-box").css({
                top: ($(window).height() - $("#preview").outerHeight()) / 2,
                left: ($(window).width() - $("#preview").outerWidth()) / 2
            });
        });

        $(window).resize();

	} );
	container.add( title );

	return container;

};


	// var option = new UI.Row();
	// option.setClass( 'option' );
	// option.setTextContent( 'Library' );
	// option.onClick( function () {

        


	// } );
	// options.add( option );

// File:editor/js/Menubar.Help.js

/**
 * @author mrdoob / http://mrdoob.com/
 */

Menubar.Help = function ( editor ) {

	var container = new UI.Panel();
	container.setClass( 'menu' );

	var title = new UI.Panel();
	title.setClass( 'title' );
	title.setTextContent( 'Exit' );
	container.add( title );

	var options = new UI.Panel();
	options.setClass( 'options' );
	container.add( options );

	// Source code

	// var option = new UI.Row();
	// option.setClass( 'option' );
	// option.setTextContent( 'Source code' );
	// option.onClick( function () {

	// 	window.open( 'https://github.com/mrdoob/three.js/tree/master/editor', '_blank' )

	// } );
	// options.add( option );

	// About

	var option = new UI.Row();
	option.setClass( 'option' );
	option.setTextContent( 'Exit to Platform' );
	option.onClick( function () {

		window.location.href=BASE_URL;
		//window.open( 'http://beta.zaak.io', '_blank' );

	} );
	options.add( option );

	return container;

};

// File:editor/js/Menubar.Status.js

/**
 * @author mrdoob / http://mrdoob.com/
 */

Menubar.Status = function ( editor ) {

	var container = new UI.Panel();
	container.setClass( 'menu right' );

	// var checkbox = new UI.Checkbox( editor.config.getKey( 'autosave' ) );
	// checkbox.onChange( function () {

	// 	var value = this.getValue();

	// 	editor.config.setKey( 'autosave', value );

	// 	if ( value === true ) {

	// 		editor.signals.sceneGraphChanged.dispatch();

	// 	}

	// } );
	// container.add( checkbox );

	var title = new UI.Panel();
	title.setClass( 'title' );
	title.setTextContent( 'Size: unknown' );

	editor.storage.size( function (size){

				var _size = (size !== null) ? size : "0";
				title.setTextContent( "Size : " + _size/10 + "/50Mb");

		});

	container.add( title );

	// var loading = new UI.Panel();
	// loading.setClass( 'status' );

	// container.add( loading );

	var saveButton = new UI.Panel();
	saveButton.setClass( 'button' );
	// saveButton.setWidth("300px");
	saveButton.setTextContent( 'Save' );
	saveButton.onClick( function() {

		editor.signals.saveProject.dispatch();


	} );
	container.add(saveButton);

	// var title = new UI.Panel();
	// title.setClass( 'title' );
	// title.setTextContent( 'Size: unknown' );
	// container.add( title );

	editor.signals.unsaveProject.add( function () {
		// e05e60 / saving : #333 / save : #2cbb84

		saveButton.setBackgroundColor('#e05e60').setColor('white').setBorder('none');
		// saveButton.setBackgroundColor('crimson').setColor('white').setBorder('none');

		// saveButton.setColor('white');

	} );

	editor.signals.savingStarted.add( function () {

		// title.setTextDecoration( 'underline' );
		saveButton.setBackgroundColor('#f2f2f2').setColor('darkslategrey');
		//Create a "currently saving overlay"
		// document.getElementById((saveOverlay).style.display = 'initial';

	} );

	editor.signals.savingFinished.add( function () {

		saveButton.setBackgroundColor('#2cbb84');
		
		editor.storage.size( function (size){
			title.setTextContent( "Size : " + size/10 + "/50Mb");

		});
	} );

	editor.signals.sceneGraphChanged.add( function () {

		editor.storage.size( function (size){
			title.setTextContent( "Size : " + size/10 + "/50Mb");

		});

	} );


	return container;

};

// File:editor/js/Sidebar.js

/**
 * @author mrdoob / http://mrdoob.com/
 */

var Sidebar = function ( editor ) {


	var container = new UI.Panel();
	container.setId( 'sidebar-right' );

	//

	var sceneTab = new UI.Text( 'SCENE' ).onClick( onClick );
	var projectTab = new UI.Text( 'PROJECT' ).onClick( onClick );
	var settingsTab = new UI.Text( 'SETTINGS' ).onClick( onClick );

	var tabs = new UI.Div();
	tabs.setId( 'tabs' );
	tabs.add( sceneTab, projectTab, settingsTab );
	container.add( tabs );

	function onClick( event ) {

		select( event.target.textContent );

	}

	//

	var scene = new UI.Span().add(
		new Sidebar.Scene( editor )
		// new Sidebar.Script( editor ),
		// new Sidebar.Properties( editor ),
		// new Sidebar.Animation( editor )
		
	);
	container.add( scene );

	var project = new UI.Span().add(
		new Sidebar.Project( editor )
	);
	container.add( project );

	var settings = new UI.Span().add(
		new Sidebar.Settings( editor ),
		new Sidebar.History( editor )
	);
	container.add( settings );

	//

	function select( section ) {

		sceneTab.setClass( '' );
		projectTab.setClass( '' );
		settingsTab.setClass( '' );

		scene.setDisplay( 'none' );
		project.setDisplay( 'none' );
		settings.setDisplay( 'none' );

		switch ( section ) {
			case 'SCENE':
				sceneTab.setClass( 'selected' );
				scene.setDisplay( '' );
				break;
			case 'PROJECT':
				projectTab.setClass( 'selected' );
				project.setDisplay( '' );
				break;
			case 'SETTINGS':
				settingsTab.setClass( 'selected' );
				settings.setDisplay( '' );
				break;
		}

	}

	select( 'SCENE' );

	//Events
	// signals.sceneGraphChanged.add( refreshUI );

	editor.sidebarProject = container;
	return container;

};

// File:editor/js/SidebarLeft.js

/**
 * @author mrdoob / http://mrdoob.com/
 */

var SidebarLeft = function ( editor ) {



	var container = new UI.Panel();
	container.setId( 'sidebar-left' );
	//

	// var sceneTab = new UI.Text( 'SCENE' ).onClick( onClick );
	// var projectTab = new UI.Text( 'PROJECT' ).onClick( onClick );
	// var settingsTab = new UI.Text( 'SETTINGS' ).onClick( onClick );

	// var tabs = new UI.Div();
	// tabs.setId( 'tabs' );
	// tabs.add( sceneTab, projectTab, settingsTab );
	// container.add( tabs );

	// function onClick( event ) {

	// 	select( event.target.textContent );

	// }

	//
	container.add( new Sidebar.Script( editor ) );
	container.add( new Sidebar.Properties( editor ) );
	container.add( new Sidebar.Animation( editor ) );

	// var scene = new UI.Span().add(
	// 	// new Sidebar.Scene( editor ),
	// 	new Sidebar.Script( editor ),
	// 	new Sidebar.Properties( editor ),
	// 	new Sidebar.Animation( editor )
		
	// );
	// container.add( scene );

	// var project = new UI.Span().add(
	// 	new Sidebar.Project( editor )
	// );
	// container.add( project );

	// var settings = new UI.Span().add(
	// 	new Sidebar.Settings( editor ),
	// 	new Sidebar.History( editor )
	// );
	// container.add( settings );

	//

	// function select( section ) {

	// 	sceneTab.setClass( '' );
	// 	projectTab.setClass( '' );
	// 	settingsTab.setClass( '' );

		// scene.setDisplay( 'selected' );
	// 	project.setDisplay( 'none' );
	// 	settings.setDisplay( 'none' );

	// 	switch ( section ) {
	// 		case 'SCENE':
	// 			sceneTab.setClass( 'selected' );
	// 			scene.setDisplay( '' );
	// 			break;
	// 		case 'PROJECT':
	// 			projectTab.setClass( 'selected' );
	// 			project.setDisplay( '' );
	// 			break;
	// 		case 'SETTINGS':
	// 			settingsTab.setClass( 'selected' );
	// 			settings.setDisplay( '' );
	// 			break;
	// 	}

	// }

	// select( 'SCENE' );

	//Events
	// signals.sceneGraphChanged.add( refreshUI );
	editor.sidebarObject = container;

	return container;

};

// File:editor/js/Sidebar.Scene.js

/**
 * @author mrdoob / http://mrdoob.com/
 */

Sidebar.Scene = function ( editor ) {

	var signals = editor.signals;

	var container = new UI.Panel();
	container.setBorderTop( '0' );
	container.setPaddingTop( '20px' );

	// outliner

	function buildOption( object, draggable ) {

		var option = document.createElement( 'div' );
		option.draggable = draggable;
		option.innerHTML = buildHTML( object );
		option.value = object.id;

		return option;

	}

	function buildHTML( object ) {

		var html = '<span class="type ' + object.type + '"></span> ' + object.name;

		if ( object instanceof THREE.Mesh ) {

			var geometry = object.geometry;
			var material = object.material;

			html += ' <span class="type ' + geometry.type + '"></span> ' + geometry.name;
			html += ' <span class="type ' + material.type + '"></span> ' + material.name;

		}

		html += getScript( object.uuid );

		return html;

	}

	function getScript( uuid ) {

		if ( editor.scripts[ uuid ] !== undefined ) {

			return ' <span class="type Script"></span>';

		}

		return '';

	}

	var ignoreObjectSelectedSignal = false;

	var outliner = new UI.Outliner( editor );
	outliner.setId( 'outliner' );
	outliner.onChange( function () {

		ignoreObjectSelectedSignal = true;

		editor.selectById( parseInt( outliner.getValue() ) );

		ignoreObjectSelectedSignal = false;

	} );
	outliner.onDblClick( function () {

		editor.focusById( parseInt( outliner.getValue() ) );

	} );
	container.add( outliner );
	container.add( new UI.Break() );

	var refreshUI = function () {

		var camera = editor.camera;
		var scene = editor.scene;

		var options = [];

		options.push( buildOption( camera, false ) );
		options.push( buildOption( scene, false ) );

		( function addObjects( objects, pad ) {

			for ( var i = 0, l = objects.length; i < l; i ++ ) {

				var object = objects[ i ];

				var option = buildOption( object, true );
				option.style.paddingLeft = ( pad * 10 ) + 'px';
				options.push( option );

				addObjects( object.children, pad + 1 );

			}

		} )( scene.children, 1 );

		outliner.setOptions( options );

		if ( editor.selected !== null ) {

			outliner.setValue( editor.selected.id );

		}

		// if ( scene.fog ) {

		// 	fogColor.setHexValue( scene.fog.color.getHex() );

		// 	if ( scene.fog instanceof THREE.Fog ) {

		// 		fogType.setValue( "Fog" );
		// 		fogNear.setValue( scene.fog.near );
		// 		fogFar.setValue( scene.fog.far );

		// 	} else if ( scene.fog instanceof THREE.FogExp2 ) {

		// 		fogType.setValue( "FogExp2" );
		// 		fogDensity.setValue( scene.fog.density );

		// 	}

		// } else {

		// 	fogType.setValue( "None" );

		// }

		// refreshFogUI();

	};

	refreshUI();

	// events

	signals.sceneGraphChanged.add( refreshUI );
	signals.scriptAdded.add( refreshUI );
	signals.scriptChanged.add( refreshUI );
	signals.scriptRemoved.add( refreshUI );

	signals.objectChanged.add( function ( object ) {

		var options = outliner.options;

		for ( var i = 0; i < options.length; i ++ ) {

			var option = options[ i ];

			if ( option.value === object.id ) {

				option.innerHTML = buildHTML( object );
				return;

			}

		}

	} );

	signals.objectSelected.add( function ( object ) {

		if ( ignoreObjectSelectedSignal === true ) return;

		outliner.setValue( object !== null ? object.id : null );

	} );

	return container;

};

// File:editor/js/Sidebar.Project.js

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

	var qualityTypes = {
		0.3:'low',
		0.5:'medium',
		1.0:'high'
	};

	var basicShortCutTypes = {

		'Blender':'Blender',
		'Unity':'Unity'
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

	var rendererPropertiesRow = new UI.Row().setMarginLeft( '90px' );

	var rendererAntialias = new UI.THREE.Boolean( config.getKey( 'project/renderer/antialias' ), 'antialias' ).onChange( function () {

		config.setKey( 'project/renderer/antialias', this.getValue() );
		updateRenderer();

	} );
	rendererPropertiesRow.add( rendererAntialias );

	// shadow
	var shadowsRow = new UI.Row();

	var rendererShadows = new UI.THREE.Boolean( config.getKey( 'project/renderer/shadows' ) ).onChange( function () {

		config.setKey( 'project/renderer/shadows', this.getValue() );
		updateRenderer();

	} );
	shadowsRow.add( new UI.Text( 'Shadows' ).setWidth( '90px' ) );

	shadowsRow.add( rendererShadows );


	container.add( shadowsRow );

	// rendererPropertiesRow.add( new UI.Break() );

	// gamma input

	var rendererGammaInput = new UI.THREE.Boolean( config.getKey( 'project/renderer/gammaInput' ), 'γ input' ).onChange( function () {

		config.setKey( 'project/renderer/gammaInput', this.getValue() );
		updateRenderer();

	} );
	rendererPropertiesRow.add( rendererGammaInput );

	// gamma output

	var rendererGammaOutput = new UI.THREE.Boolean( config.getKey( 'project/renderer/gammaOutput' ), 'γ output' ).onChange( function () {

		config.setKey( 'project/renderer/gammaOutput', this.getValue() );
		updateRenderer();

	} );
	rendererPropertiesRow.add( rendererGammaOutput );

	// container.add( rendererPropertiesRow );

	// Editable

	var editableRow = new UI.Row();
	var editable = new UI.Checkbox( config.getKey( 'project/editable' ) ).setLeft( '100px' ).onChange( function () {

		config.setKey( 'project/editable', this.getValue() );

	} );

	editableRow.add( new UI.Text( 'Editable' ).setWidth( '90px' ) );
	editableRow.add( editable );

	// container.add( editableRow );

	// VR

	var vrRow = new UI.Row();
	var vr = new UI.Checkbox( config.getKey( 'project/vr' ) ).setLeft( '100px' ).onChange( function () {

		config.setKey( 'project/vr', this.getValue() );
		// updateRenderer();

	} );

	vrRow.add( new UI.Text( 'VR' ).setWidth( '90px' ) );
	vrRow.add( vr );

	// container.add( vrRow );

	// crosshair
	var crosshairRow = new UI.Row();
	var crosshair = new UI.Checkbox( config.getKey( 'project/crosshair' ) ).setLeft( '100px' ).onChange( function () {

		config.setKey( 'project/crosshair', this.getValue() );
		// updateRenderer();

	} );
		crosshairRow.add( new UI.Text( 'Crosshair' ).setWidth( '90px' ) );

	crosshairRow.add( crosshair );

	container.add( crosshairRow );

	// Gazetime
	var gazetimeRow = new UI.Row();
	var gazetime = new UI.Number( config.getKey( 'project/gazetime' ) ).setLeft( '100px' ).onChange( function () {

		config.setKey( 'project/gazetime', this.getValue() );
		// updateRenderer();

	} );

	gazetime.min = 0.0;

	gazetimeRow.add( new UI.Text( 'Gaze Time' ).setWidth( '90px' ) );

	gazetimeRow.add( gazetime );

	container.add( gazetimeRow );

	// Quality
	var qualityRow = new UI.Row();
	var quality = new UI.Select().setOptions( qualityTypes ).setWidth( '150px' ).onChange( function () {

		var value = this.getValue();

		config.setKey( 'project/quality', value );

	} );

	qualityRow.add( new UI.Text( 'Quality' ).setWidth( '90px' ) );
	qualityRow.add( quality );

	container.add( qualityRow );

	if ( config.getKey( 'project/quality' ) !== undefined ) {

		quality.setValue( config.getKey( 'project/quality' ) );

	}
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

		bgColor.setHexValue( editor.config.getKey('backgroundColor'));


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
	signals.bgColorChanged.add( refreshUI );



	//

	function updateRenderer() {

		createRenderer( rendererType.getValue(), rendererAntialias.getValue(), rendererShadows.getValue(), rendererGammaInput.getValue(), rendererGammaOutput.getValue() );

	}

	function createRenderer( type, antialias, shadows, gammaIn, gammaOut ) {

		if ( type === 'WebGLRenderer' && System.support.webgl === false ) {

			type = 'CanvasRenderer';

		}

		rendererPropertiesRow.setDisplay( type === 'WebGLRenderer' ? '' : 'none' );

		var renderer = new rendererTypes[ type ]( { antialias: antialias} );
		renderer.gammaInput = gammaIn;
		renderer.gammaOutput = gammaOut;
		if ( shadows && renderer.shadowMap ) {

			renderer.shadowMap.enabled = true;
			// renderer.shadowMap.type = THREE.PCFSoftShadowMap;
		}

		signals.rendererChanged.dispatch( renderer );

		signals.bgColorChanged.dispatch( bgColor.getHexValue() );
	}

	createRenderer( config.getKey( 'project/renderer' ), config.getKey( 'project/renderer/antialias' ), config.getKey( 'project/renderer/shadows' ), config.getKey( 'project/renderer/gammaInput' ), config.getKey( 'project/renderer/gammaOutput' ) );

	return container;

};

// File:editor/js/Sidebar.Settings.js

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

	//Removed
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

// File:editor/js/Sidebar.Properties.js

/**
 * @author mrdoob / http://mrdoob.com/
 */

Sidebar.Properties = function ( editor ) {

	var signals = editor.signals;

	var container = new UI.Span();

	var objectTab = new UI.Text( 'OBJECT' ).onClick( onClick );
	var geometryTab = new UI.Text( 'GEOMETRY' ).onClick( onClick );
	var materialTab = new UI.Text( 'MATERIAL' ).onClick( onClick );

	var tabs = new UI.Div();
	tabs.setId( 'tabs' );
	tabs.add( objectTab, geometryTab, materialTab );
	container.add( tabs );

	function onClick( event ) {

		select( event.target.textContent );

	}

	//

	var object = new UI.Span().add(
		new Sidebar.Object( editor )
	);
	container.add( object );

	var geometry = new UI.Span().add(
		new Sidebar.Geometry( editor )
	);
	container.add( geometry );

	var material = new UI.Span().add(
		new Sidebar.Material( editor )
	);
	container.add( material );

	//

	function select( section ) {

		objectTab.setClass( '' );
		geometryTab.setClass( '' );
		materialTab.setClass( '' );

		object.setDisplay( 'none' );
		geometry.setDisplay( 'none' );
		material.setDisplay( 'none' );

		switch ( section ) {
			case 'OBJECT':
				objectTab.setClass( 'selected' );
				object.setDisplay( '' );
				break;
			case 'GEOMETRY':
				geometryTab.setClass( 'selected' );
				geometry.setDisplay( '' );
				break;
			case 'MATERIAL':
				materialTab.setClass( 'selected' );
				material.setDisplay( '' );
				break;
		}

	}

	select( 'OBJECT' );

	return container;

};

// File:editor/js/Sidebar.Object.js

/**
 * @author mrdoob / http://mrdoob.com/
 */

Sidebar.Object = function ( editor ) {

	var signals = editor.signals;

	var	radConverter = (editor.config.getKey('degree') == 'true') ? (180/Math.PI) : 1.0;

	var container = new UI.Panel();
	container.setBorderTop( '0' );
	container.setPaddingTop( '20px' );
	container.setDisplay( 'none' );

	// Actions

	var objectActions = new UI.Select().setPosition( 'absolute' ).setRight( '8px' ).setFontSize( '11px' );
	objectActions.setOptions( {

		'Actions': 'Actions',
		'Reset Position': 'Reset Position',
		'Reset Rotation': 'Reset Rotation',
		'Reset Scale': 'Reset Scale'

	} );
	objectActions.onClick( function ( event ) {

		event.stopPropagation(); // Avoid panel collapsing

	} );
	objectActions.onChange( function ( event ) {

		var object = editor.selected;

		switch ( this.getValue() ) {

			case 'Reset Position':
				editor.execute( new SetPositionCommand( object, new THREE.Vector3( 0, 0, 0 ) ) );
				break;

			case 'Reset Rotation':
				editor.execute( new SetRotationCommand( object, new THREE.Euler( 0, 0, 0 ) ) );
				break;

			case 'Reset Scale':
				editor.execute( new SetScaleCommand( object, new THREE.Vector3( 1, 1, 1 ) ) );
				break;

		}

		this.setValue( 'Actions' );

	} );
	// container.addStatic( objectActions );

	// type

	var objectTypeRow = new UI.Row();
	var objectType = new UI.Text();

	objectTypeRow.add( new UI.Text( 'Type' ).setWidth( '90px' ) );
	objectTypeRow.add( objectType );

	//REMOVED
	// container.add( objectTypeRow );

	// uuid

	var objectUUIDRow = new UI.Row();
	var objectUUID = new UI.Input().setWidth( '115px' ).setFontSize( '12px' ).setDisabled( true );
	var objectUUIDRenew = new UI.Button( '⟳' ).setMarginLeft( '7px' ).onClick( function () {

		objectUUID.setValue( THREE.Math.generateUUID() );

		editor.execute( new SetUuidCommand( editor.selected, objectUUID.getValue() ) );

	} );

	objectUUIDRow.add( new UI.Text( 'UUID' ).setWidth( '90px' ) );
	objectUUIDRow.add( objectUUID );
	objectUUIDRow.add( objectUUIDRenew );

	//REMOVED
	// container.add( objectUUIDRow );

	// name

	var objectNameRow = new UI.Row();
	var objectName = new UI.Input().setWidth( '150px' ).setFontSize( '12px' ).onChange( function () {

		editor.execute( new SetValueCommand( editor.selected, 'name', objectName.getValue() ) );

	} );

	objectNameRow.add( new UI.Text( 'Name' ).setWidth( '90px' ) );
	objectNameRow.add( objectName );

	container.add( objectNameRow );
	
	// parent

	var objectParentRow = new UI.Row();
	var objectParent = new UI.Select().setWidth( '150px' ).setFontSize( '12px' ).onChange( update );

	objectParentRow.add( new UI.Text( 'Parent' ).setWidth( '90px' ) );
	objectParentRow.add( objectParent );

	container.add( objectParentRow );
	
	// position

	var objectPositionRow = new UI.Row();
	var objectPositionX = new UI.Number().setWidth( '50px' ).onChange( update );
	var objectPositionY = new UI.Number().setWidth( '50px' ).onChange( update );
	var objectPositionZ = new UI.Number().setWidth( '50px' ).onChange( update );

	objectPositionRow.add( new UI.Text( 'Position' ).setWidth( '90px' ) );
	objectPositionRow.add( objectPositionX, objectPositionY, objectPositionZ );

	container.add( objectPositionRow );

	// rotation

	var objectRotationRow = new UI.Row();
	var objectRotationX = new UI.Number().setStep( 10 ).setUnit( '°' ).setWidth( '50px' ).onChange( update );
	var objectRotationY = new UI.Number().setStep( 10 ).setUnit( '°' ).setWidth( '50px' ).onChange( update );
	var objectRotationZ = new UI.Number().setStep( 10 ).setUnit( '°' ).setWidth( '50px' ).onChange( update );

	objectRotationRow.add( new UI.Text( 'Rotation' ).setWidth( '90px' ) );
	objectRotationRow.add( objectRotationX, objectRotationY, objectRotationZ );

	container.add( objectRotationRow );

	// scale

	var objectScaleRow = new UI.Row();
	var objectScaleLock = new UI.Checkbox( true ).setPosition( 'absolute' ).setLeft( '75px' );
	var objectScaleX = new UI.Number( 1 ).setRange( 0.01, Infinity ).setWidth( '50px' ).onChange( updateScaleX );
	var objectScaleY = new UI.Number( 1 ).setRange( 0.01, Infinity ).setWidth( '50px' ).onChange( updateScaleY );
	var objectScaleZ = new UI.Number( 1 ).setRange( 0.01, Infinity ).setWidth( '50px' ).onChange( updateScaleZ );

	objectScaleRow.add( new UI.Text( 'Scale' ).setWidth( '90px' ) );
	objectScaleRow.add( objectScaleLock );
	objectScaleRow.add( objectScaleX, objectScaleY, objectScaleZ );

	container.add( objectScaleRow );

	// fov

	var objectFovRow = new UI.Row();
	var objectFov = new UI.Number().onChange( update );

	objectFovRow.add( new UI.Text( 'Fov' ).setWidth( '90px' ) );
	objectFovRow.add( objectFov );

	container.add( objectFovRow );

	// near

	var objectNearRow = new UI.Row();
	var objectNear = new UI.Number().onChange( update );

	objectNearRow.add( new UI.Text( 'Near' ).setWidth( '90px' ) );
	objectNearRow.add( objectNear );

	container.add( objectNearRow );

	// far

	var objectFarRow = new UI.Row();
	var objectFar = new UI.Number().onChange( update );

	objectFarRow.add( new UI.Text( 'Far' ).setWidth( '90px' ) );
	objectFarRow.add( objectFar );

	container.add( objectFarRow );

	// intensity

	var objectIntensityRow = new UI.Row();
	var objectIntensity = new UI.Number().setRange( 0, Infinity ).onChange( update );

	objectIntensityRow.add( new UI.Text( 'Intensity' ).setWidth( '90px' ) );
	objectIntensityRow.add( objectIntensity );

	container.add( objectIntensityRow );

	// color

	var objectColorRow = new UI.Row();
	var objectColor = new UI.Color().onChange( update );

	objectColorRow.add( new UI.Text( 'Color' ).setWidth( '90px' ) );
	objectColorRow.add( objectColor );

	container.add( objectColorRow );

	// ground color

	var objectGroundColorRow = new UI.Row();
	var objectGroundColor = new UI.Color().onChange( update );

	objectGroundColorRow.add( new UI.Text( 'Ground color' ).setWidth( '90px' ) );
	objectGroundColorRow.add( objectGroundColor );

	container.add( objectGroundColorRow );

	// distance

	var objectDistanceRow = new UI.Row();
	var objectDistance = new UI.Number().setRange( 0, Infinity ).onChange( update );

	objectDistanceRow.add( new UI.Text( 'Distance' ).setWidth( '90px' ) );
	objectDistanceRow.add( objectDistance );

	container.add( objectDistanceRow );

	// angle

	var objectAngleRow = new UI.Row();
	var objectAngle = new UI.Number().setPrecision( 3 ).setRange( 0, Math.PI / 2 ).onChange( update );

	objectAngleRow.add( new UI.Text( 'Angle' ).setWidth( '90px' ) );
	objectAngleRow.add( objectAngle );

	container.add( objectAngleRow );

	// penumbra

	var objectPenumbraRow = new UI.Row();
	var objectPenumbra = new UI.Number().setRange( 0, 1 ).onChange( update );

	objectPenumbraRow.add( new UI.Text( 'Penumbra' ).setWidth( '90px' ) );
	objectPenumbraRow.add( objectPenumbra );

	container.add( objectPenumbraRow );

	// decay

	var objectDecayRow = new UI.Row();
	var objectDecay = new UI.Number().setRange( 0, Infinity ).onChange( update );

	objectDecayRow.add( new UI.Text( 'Decay' ).setWidth( '90px' ) );
	objectDecayRow.add( objectDecay );

	container.add( objectDecayRow );

	// shadow

	var objectShadowRow = new UI.Row();

	objectShadowRow.add( new UI.Text( 'Shadow' ).setWidth( '90px' ) );

	var objectCastShadow = new UI.THREE.Boolean( false, 'cast' ).onChange( update );
	objectShadowRow.add( objectCastShadow );

	var objectReceiveShadow = new UI.THREE.Boolean( false, 'receive' ).onChange( update );
	objectShadowRow.add( objectReceiveShadow );

	var objectShadowRadius = new UI.Number( 1 ).onChange( update );
	objectShadowRow.add( objectShadowRadius );

	container.add( objectShadowRow );

	// visible

	var objectVisibleRow = new UI.Row();
	var objectVisible = new UI.Checkbox().onChange( update );

	objectVisibleRow.add( new UI.Text( 'Visible' ).setWidth( '90px' ) );
	objectVisibleRow.add( objectVisible );

	container.add( objectVisibleRow );

	// user data

	var timeout;

	var objectUserDataRow = new UI.Row();
	var objectUserData = new UI.TextArea().setWidth( '150px' ).setHeight( '40px' ).setFontSize( '12px' ).onChange( update );
	objectUserData.onKeyUp( function () {

		try {

			JSON.parse( objectUserData.getValue() );

			objectUserData.dom.classList.add( 'success' );
			objectUserData.dom.classList.remove( 'fail' );

		} catch ( error ) {

			objectUserData.dom.classList.remove( 'success' );
			objectUserData.dom.classList.add( 'fail' );

		}

	} );

	objectUserDataRow.add( new UI.Text( 'User data' ).setWidth( '90px' ) );
	objectUserDataRow.add( objectUserData );

	//REMOVED
	// container.add( objectUserDataRow );


	//

	function updateScaleX() {

		var object = editor.selected;

		if ( objectScaleLock.getValue() === true ) {

			var scale = objectScaleX.getValue() / object.scale.x;

			objectScaleY.setValue( objectScaleY.getValue() * scale );
			objectScaleZ.setValue( objectScaleZ.getValue() * scale );

		}

		update();

	}

	function updateScaleY() {

		var object = editor.selected;

		if ( objectScaleLock.getValue() === true ) {

			var scale = objectScaleY.getValue() / object.scale.y;

			objectScaleX.setValue( objectScaleX.getValue() * scale );
			objectScaleZ.setValue( objectScaleZ.getValue() * scale );

		}

		update();

	}

	function updateScaleZ() {

		var object = editor.selected;

		if ( objectScaleLock.getValue() === true ) {

			var scale = objectScaleZ.getValue() / object.scale.z;

			objectScaleX.setValue( objectScaleX.getValue() * scale );
			objectScaleY.setValue( objectScaleY.getValue() * scale );

		}

		update();

	}

	function update() {

		var object = editor.selected;

		if ( object !== null ) {

			
			if ( object.parent !== null ) {

				var newParentId = parseInt( objectParent.getValue() );

				if ( object.parent.id !== newParentId && object.id !== newParentId ) {

					editor.execute( new MoveObjectCommand( object, editor.scene.getObjectById( newParentId ) ) );

				}

			}
			
			var newPosition = new THREE.Vector3( objectPositionX.getValue(), objectPositionY.getValue(), objectPositionZ.getValue() );
			if ( object.position.distanceTo( newPosition ) >= 0.01 ) {

				editor.execute( new SetPositionCommand( object, newPosition ) );

			}

			var newRotation = new THREE.Euler( objectRotationX.getValue() / radConverter, objectRotationY.getValue() / radConverter, objectRotationZ.getValue() / radConverter);

			if ( object.rotation.toVector3().distanceTo( newRotation.toVector3() ) >= 0.01 ) {

				editor.execute( new SetRotationCommand( object, newRotation ) );

			}

			var newScale = new THREE.Vector3( objectScaleX.getValue(), objectScaleY.getValue(), objectScaleZ.getValue() );
			if ( object.scale.distanceTo( newScale ) >= 0.01 ) {

				editor.execute( new SetScaleCommand( object, newScale ) );

			}

			if ( object.fov !== undefined && Math.abs( object.fov - objectFov.getValue() ) >= 0.01 ) {

				editor.execute( new SetValueCommand( object, 'fov', objectFov.getValue() ) );
				object.updateProjectionMatrix();

			}

			if ( object.near !== undefined && Math.abs( object.near - objectNear.getValue() ) >= 0.01 ) {

				editor.execute( new SetValueCommand( object, 'near', objectNear.getValue() ) );

			}

			if ( object.far !== undefined && Math.abs( object.far - objectFar.getValue() ) >= 0.01 ) {

				editor.execute( new SetValueCommand( object, 'far', objectFar.getValue() ) );

			}

			if ( object.intensity !== undefined && Math.abs( object.intensity - objectIntensity.getValue() ) >= 0.01 ) {

				editor.execute( new SetValueCommand( object, 'intensity', objectIntensity.getValue() ) );

			}

			if ( object.color !== undefined && object.color.getHex() !== objectColor.getHexValue() ) {

				editor.execute( new SetColorCommand( object, 'color', objectColor.getHexValue() ) );

			}

			if ( object.groundColor !== undefined && object.groundColor.getHex() !== objectGroundColor.getHexValue() ) {

				editor.execute( new SetColorCommand( object, 'groundColor', objectGroundColor.getHexValue() ) );

			}

			if ( object.distance !== undefined && Math.abs( object.distance - objectDistance.getValue() ) >= 0.01 ) {

				editor.execute( new SetValueCommand( object, 'distance', objectDistance.getValue() ) );

			}

			if ( object.angle !== undefined && Math.abs( object.angle - objectAngle.getValue() ) >= 0.01 ) {

				editor.execute( new SetValueCommand( object, 'angle', objectAngle.getValue() ) );

			}

			if ( object.penumbra !== undefined && Math.abs( object.penumbra - objectPenumbra.getValue() ) >= 0.01 ) {

				editor.execute( new SetValueCommand( object, 'penumbra', objectPenumbra.getValue() ) );

			}

			if ( object.decay !== undefined && Math.abs( object.decay - objectDecay.getValue() ) >= 0.01 ) {

				editor.execute( new SetValueCommand( object, 'decay', objectDecay.getValue() ) );

			}

			if ( object.visible !== objectVisible.getValue() ) {

				editor.execute( new SetValueCommand( object, 'visible', objectVisible.getValue() ) );

			}

			if ( object.castShadow !== undefined && object.castShadow !== objectCastShadow.getValue() ) {

				editor.execute( new SetValueCommand( object, 'castShadow', objectCastShadow.getValue() ) );

			}

			if ( object.receiveShadow !== undefined && object.receiveShadow !== objectReceiveShadow.getValue() ) {

				editor.execute( new SetValueCommand( object, 'receiveShadow', objectReceiveShadow.getValue() ) );
				object.material.needsUpdate = true;

			}

			if ( object.shadow !== undefined ) {

				if ( object.shadow.radius !== objectShadowRadius.getValue() ) {

					editor.execute( new SetValueCommand( object.shadow, 'radius', objectShadowRadius.getValue() ) );

				}

			}

			try {

				var userData = JSON.parse( objectUserData.getValue() );
				if ( JSON.stringify( object.userData ) != JSON.stringify( userData ) ) {

					editor.execute( new SetValueCommand( object, 'userData', userData ) );

				}

			} catch ( exception ) {

				console.warn( exception );

			}

		}

	}

	function updateRows( object ) {

		var properties = {
			'fov': objectFovRow,
			'near': objectNearRow,
			'far': objectFarRow,
			'intensity': objectIntensityRow,
			'color': objectColorRow,
			'groundColor': objectGroundColorRow,
			'distance' : objectDistanceRow,
			'angle' : objectAngleRow,
			'penumbra' : objectPenumbraRow,
			'decay' : objectDecayRow,
			'castShadow' : objectShadowRow,
			'receiveShadow' : objectReceiveShadow,
			'shadow': objectShadowRadius
		};

		for ( var property in properties ) {

			properties[ property ].setDisplay( object[ property ] !== undefined ? '' : 'none' );

		}

	}

	function updateTransformRows( object ) {

		if ( object instanceof THREE.Light ||
		   ( object instanceof THREE.Object3D && object.userData.targetInverse ) ) {

			objectRotationRow.setDisplay( 'none' );
			objectScaleRow.setDisplay( 'none' );

		} else {

			objectRotationRow.setDisplay( '' );
			objectScaleRow.setDisplay( '' );

		}

	}

	// events

	signals.objectSelected.add( function ( object ) {

		if ( object !== null ) {

			container.setDisplay( 'block' );

			updateRows( object );
			updateUI( object );

		} else {

			container.setDisplay( 'none' );

		}

	} );
	
	//TODO: test if working
	signals.sceneGraphChanged.add( function () {

		var scene = editor.scene;
		var options = {};

		scene.traverse( function ( object ) {

			options[ object.id ] = object.name;

		} );

		objectParent.setOptions( options );

	} );
	
	signals.objectChanged.add( function ( object ) {

		if ( object !== editor.selected ) return;

		updateUI( object );

	} );

	signals.refreshSidebarObject3D.add( function ( object ) {

		if ( object !== editor.selected ) return;

		updateUI( object );

	} );

	signals.presetChanged.add( function (){

		radConverter = (editor.config.getKey('degree') == 'true') ? (180/Math.PI) : 1.0;

		if(editor.selected != null)
			updateUI( editor.selected);

	} );

	function updateUI( object ) {

		objectType.setValue( object.type );

		objectUUID.setValue( object.uuid );
		objectName.setValue( object.name );

		if ( object.parent !== null ) {

			objectParent.setValue( object.parent.id );

		}
	
		objectPositionX.setValue( object.position.x );
		objectPositionY.setValue( object.position.y );
		objectPositionZ.setValue( object.position.z );

		objectRotationX.setValue( object.rotation.x * radConverter );
		objectRotationY.setValue( object.rotation.y * radConverter );
		objectRotationZ.setValue( object.rotation.z * radConverter );

		objectScaleX.setValue( object.scale.x );
		objectScaleY.setValue( object.scale.y );
		objectScaleZ.setValue( object.scale.z );

		if ( object.fov !== undefined ) {

			objectFov.setValue( object.fov );

		}

		if ( object.near !== undefined ) {

			objectNear.setValue( object.near );

		}

		if ( object.far !== undefined ) {

			objectFar.setValue( object.far );

		}

		if ( object.intensity !== undefined ) {

			objectIntensity.setValue( object.intensity );

		}

		if ( object.color !== undefined ) {

			objectColor.setHexValue( object.color.getHexString() );

		}

		if ( object.groundColor !== undefined ) {

			objectGroundColor.setHexValue( object.groundColor.getHexString() );

		}

		if ( object.distance !== undefined ) {

			objectDistance.setValue( object.distance );

		}

		if ( object.angle !== undefined ) {

			objectAngle.setValue( object.angle );

		}

		if ( object.penumbra !== undefined ) {

			objectPenumbra.setValue( object.penumbra );

		}

		if ( object.decay !== undefined ) {

			objectDecay.setValue( object.decay );

		}

		if ( object.castShadow !== undefined ) {

			objectCastShadow.setValue( object.castShadow );

		}

		if ( object.receiveShadow !== undefined ) {

			objectReceiveShadow.setValue( object.receiveShadow );

		}

		if ( object.shadow !== undefined ) {

			objectShadowRadius.setValue( object.shadow.radius );

		}

		objectVisible.setValue( object.visible );

		try {

			objectUserData.setValue( JSON.stringify( object.userData, null, '  ' ) );

		} catch ( error ) {

			console.log( error );

		}

		objectUserData.setBorderColor( 'transparent' );
		objectUserData.setBackgroundColor( '' );

		updateTransformRows( object );

	}

	return container;

};

// File:editor/js/Sidebar.Geometry.js

/**
 * @author mrdoob / http://mrdoob.com/
 */

Sidebar.Geometry = function ( editor ) {

	var signals = editor.signals;

	var container = new UI.Panel();
	container.setBorderTop( '0' );
	container.setPaddingTop( '20px' );

	// Actions

	/*
	var objectActions = new UI.Select().setPosition( 'absolute' ).setRight( '8px' ).setFontSize( '11px' );
	objectActions.setOptions( {

		'Actions': 'Actions',
		'Center': 'Center',
		'Convert': 'Convert',
		'Flatten': 'Flatten'

	} );
	objectActions.onClick( function ( event ) {

		event.stopPropagation(); // Avoid panel collapsing

	} );
	objectActions.onChange( function ( event ) {

		var action = this.getValue();

		var object = editor.selected;
		var geometry = object.geometry;

		if ( confirm( action + ' ' + object.name + '?' ) === false ) return;

		switch ( action ) {

			case 'Center':

				var offset = geometry.center();

				var newPosition = object.position.clone();
				newPosition.sub( offset );
				editor.execute( new SetPositionCommand( object, newPosition ) );

				editor.signals.geometryChanged.dispatch( object );

				break;

			case 'Convert':

				if ( geometry instanceof THREE.Geometry ) {

					editor.execute( new SetGeometryCommand( object, new THREE.BufferGeometry().fromGeometry( geometry ) ) );

				}

				break;

			case 'Flatten':

				var newGeometry = geometry.clone();
				newGeometry.uuid = geometry.uuid;
				newGeometry.applyMatrix( object.matrix );

				var cmds = [ new SetGeometryCommand( object, newGeometry ),
					new SetPositionCommand( object, new THREE.Vector3( 0, 0, 0 ) ),
					new SetRotationCommand( object, new THREE.Euler( 0, 0, 0 ) ),
					new SetScaleCommand( object, new THREE.Vector3( 1, 1, 1 ) ) ];

				editor.execute( new MultiCmdsCommand( cmds ), 'Flatten Geometry' );

				break;

		}

		this.setValue( 'Actions' );

	} );
	container.addStatic( objectActions );
	*/

	// type

	var geometryTypeRow = new UI.Row();
	var geometryType = new UI.Text();

	geometryTypeRow.add( new UI.Text( 'Type' ).setWidth( '90px' ) );
	geometryTypeRow.add( geometryType );

	container.add( geometryTypeRow );

	// uuid

	// var geometryUUIDRow = new UI.Row();
	// var geometryUUID = new UI.Input().setWidth( '115px' ).setFontSize( '12px' ).setDisabled( true );
	// var geometryUUIDRenew = new UI.Button( '⟳' ).setMarginLeft( '7px' ).onClick( function () {

	// 	geometryUUID.setValue( THREE.Math.generateUUID() );

	// 	editor.execute( new SetGeometryValueCommand( editor.selected, 'uuid', geometryUUID.getValue() ) );

	// } );

	// geometryUUIDRow.add( new UI.Text( 'UUID' ).setWidth( '90px' ) );
	// geometryUUIDRow.add( geometryUUID );
	// geometryUUIDRow.add( geometryUUIDRenew );

	// container.add( geometryUUIDRow );

	// name

	var geometryNameRow = new UI.Row();
	var geometryName = new UI.Input().setWidth( '150px' ).setFontSize( '12px' ).onChange( function () {

		editor.execute( new SetGeometryValueCommand( editor.selected, 'name', geometryName.getValue() ) );

	} );

	geometryNameRow.add( new UI.Text( 'Name' ).setWidth( '90px' ) );
	geometryNameRow.add( geometryName );

	// REMOVED
	// container.add( geometryNameRow );

	// geometry

	container.add( new Sidebar.Geometry.Geometry( editor ) );

	// buffergeometry
	// REMOVED
	// container.add( new Sidebar.Geometry.BufferGeometry( editor ) );

	// parameters

	var parameters = new UI.Span();
	container.add( parameters );


	//

	function build() {

		var object = editor.selected;

		if ( object && object.geometry ) {

			var geometry = object.geometry;

			container.setDisplay( 'block' );

			geometryType.setValue( geometry.type );

			//geometryUUID.setValue( geometry.uuid );
			geometryName.setValue( geometry.name );

			//

			parameters.clear();

			if ( geometry.type === 'BufferGeometry' || geometry.type === 'Geometry' ) {

				parameters.add( new Sidebar.Geometry.Modifiers( editor, object ) );

			} else if ( Sidebar.Geometry[ geometry.type ] !== undefined ) {

				parameters.add( new Sidebar.Geometry[ geometry.type ]( editor, object ) );

			}

		} else {

			container.setDisplay( 'none' );

		}

	}

	signals.objectSelected.add( build );
	signals.geometryChanged.add( build );

	return container;

};

// File:editor/js/Sidebar.Geometry.Geometry.js

/**
 * @author mrdoob / http://mrdoob.com/
 */

Sidebar.Geometry.Geometry = function ( editor ) {

	var signals = editor.signals;

	var container = new UI.Row();

	// vertices

	var verticesRow = new UI.Row();
	var vertices = new UI.Text();

	verticesRow.add( new UI.Text( 'Vertices' ).setWidth( '90px' ) );
	verticesRow.add( vertices );

	container.add( verticesRow );

	// faces

	var facesRow = new UI.Row();
	var faces = new UI.Text();

	facesRow.add( new UI.Text( 'Faces' ).setWidth( '90px' ) );
	facesRow.add( faces );

	container.add( facesRow );

	//

	function update( object ) {

		if ( object === null ) return; // objectSelected.dispatch( null )
		if ( object === undefined ) return;

		var geometry = object.geometry;

		if ( geometry instanceof THREE.Geometry ) {

			container.setDisplay( 'block' );

			vertices.setValue( ( geometry.vertices.length ).format() );
			faces.setValue( ( geometry.faces.length ).format() );

		} else {

			container.setDisplay( 'none' );

		}

	}

	signals.objectSelected.add( update );
	signals.geometryChanged.add( update );

	return container;

};

// File:editor/js/Sidebar.Geometry.BufferGeometry.js

/**
 * @author mrdoob / http://mrdoob.com/
 */

Sidebar.Geometry.BufferGeometry = function ( editor ) {

	var signals = editor.signals;

	var container = new UI.Row();

	function update( object ) {

		if ( object === null ) return; // objectSelected.dispatch( null )
		if ( object === undefined ) return;

		var geometry = object.geometry;

		if ( geometry instanceof THREE.BufferGeometry ) {

			container.clear();
			container.setDisplay( 'block' );

			var index = geometry.index;

			if ( index !== null ) {

				var panel = new UI.Row();
				panel.add( new UI.Text( 'index' ).setWidth( '90px' ) );
				panel.add( new UI.Text( ( index.count ).format() ).setFontSize( '12px' ) );
				//REMOVED
				// container.add( panel );

			}

			var attributes = geometry.attributes;

			for ( var name in attributes ) {

				var panel = new UI.Row();
				panel.add( new UI.Text( name ).setWidth( '90px' ) );
				panel.add( new UI.Text( ( attributes[ name ].count ).format() ).setFontSize( '12px' ) );
				//REMOVED
				// container.add( panel );

			}

		} else {

			container.setDisplay( 'none' );

		}

	}

	signals.objectSelected.add( update );
	signals.geometryChanged.add( update );

	return container;

};

// File:editor/js/Sidebar.Geometry.Modifiers.js

/**
 * @author mrdoob / http://mrdoob.com/
 */

Sidebar.Geometry.Modifiers = function ( editor, object ) {

	var signals = editor.signals;

	var container = new UI.Row().setPaddingLeft( '90px' );

	var geometry = object.geometry;

	// Compute Vertex Normals

	var button = new UI.Button( 'Compute Vertex Normals' );
	button.onClick( function () {

		geometry.computeVertexNormals();

		if ( geometry instanceof THREE.BufferGeometry ) {

			geometry.attributes.normal.needsUpdate = true;

		} else {

			geometry.normalsNeedUpdate = true;

		}

		signals.geometryChanged.dispatch( object );

	} );

	container.add( button );

	//

	return container;

};

// File:editor/js/Sidebar.Geometry.BoxGeometry.js

/**
 * @author mrdoob / http://mrdoob.com/
 */

Sidebar.Geometry.BoxGeometry = function ( editor, object ) {

	var signals = editor.signals;

	var container = new UI.Row();

	var geometry = object.geometry;
	var parameters = geometry.parameters;

	// width

	var widthRow = new UI.Row();
	var width = new UI.Number( parameters.width ).onChange( update );

	widthRow.add( new UI.Text( 'Width' ).setWidth( '90px' ) );
	widthRow.add( width );

	container.add( widthRow );

	// height

	var heightRow = new UI.Row();
	var height = new UI.Number( parameters.height ).onChange( update );

	heightRow.add( new UI.Text( 'Height' ).setWidth( '90px' ) );
	heightRow.add( height );

	container.add( heightRow );

	// depth

	var depthRow = new UI.Row();
	var depth = new UI.Number( parameters.depth ).onChange( update );

	depthRow.add( new UI.Text( 'Depth' ).setWidth( '90px' ) );
	depthRow.add( depth );

	container.add( depthRow );

	// widthSegments

	var widthSegmentsRow = new UI.Row();
	var widthSegments = new UI.Integer( parameters.widthSegments ).setRange( 1, Infinity ).onChange( update );

	widthSegmentsRow.add( new UI.Text( 'Width segments' ).setWidth( '90px' ) );
	widthSegmentsRow.add( widthSegments );

	container.add( widthSegmentsRow );

	// heightSegments

	var heightSegmentsRow = new UI.Row();
	var heightSegments = new UI.Integer( parameters.heightSegments ).setRange( 1, Infinity ).onChange( update );

	heightSegmentsRow.add( new UI.Text( 'Height segments' ).setWidth( '90px' ) );
	heightSegmentsRow.add( heightSegments );

	container.add( heightSegmentsRow );

	// depthSegments

	var depthSegmentsRow = new UI.Row();
	var depthSegments = new UI.Integer( parameters.depthSegments ).setRange( 1, Infinity ).onChange( update );

	depthSegmentsRow.add( new UI.Text( 'Depth segments' ).setWidth( '90px' ) );
	depthSegmentsRow.add( depthSegments );

	container.add( depthSegmentsRow );

	//

	function update() {

		editor.execute( new SetGeometryCommand( object, new THREE[ geometry.type ](
			width.getValue(),
			height.getValue(),
			depth.getValue(),
			widthSegments.getValue(),
			heightSegments.getValue(),
			depthSegments.getValue()
		) ) );

	}

	return container;

};

Sidebar.Geometry.BoxBufferGeometry = Sidebar.Geometry.BoxGeometry;

// File:editor/js/Sidebar.Geometry.CircleGeometry.js

/**
 * @author mrdoob / http://mrdoob.com/
 */

Sidebar.Geometry.CircleGeometry = function ( editor, object ) {

	var signals = editor.signals;

	var container = new UI.Row();

	var geometry = object.geometry;
	var parameters = geometry.parameters;

	// radius

	var radiusRow = new UI.Row();
	var radius = new UI.Number( parameters.radius ).onChange( update );

	radiusRow.add( new UI.Text( 'Radius' ).setWidth( '90px' ) );
	radiusRow.add( radius );

	container.add( radiusRow );

	// segments

	var segmentsRow = new UI.Row();
	var segments = new UI.Integer( parameters.segments ).setRange( 3, Infinity ).onChange( update );

	segmentsRow.add( new UI.Text( 'Segments' ).setWidth( '90px' ) );
	segmentsRow.add( segments );

	container.add( segmentsRow );

	// thetaStart

	var thetaStartRow = new UI.Row();
	var thetaStart = new UI.Number( parameters.thetaStart ).onChange( update );

	thetaStartRow.add( new UI.Text( 'Theta start' ).setWidth( '90px' ) );
	thetaStartRow.add( thetaStart );

	container.add( thetaStartRow );

	// thetaLength

	var thetaLengthRow = new UI.Row();
	var thetaLength = new UI.Number( parameters.thetaLength ).onChange( update );

	thetaLengthRow.add( new UI.Text( 'Theta length' ).setWidth( '90px' ) );
	thetaLengthRow.add( thetaLength );

	container.add( thetaLengthRow );

	//

	function update() {

		editor.execute( new SetGeometryCommand( object, new THREE[ geometry.type ](
			radius.getValue(),
			segments.getValue(),
			thetaStart.getValue(),
			thetaLength.getValue()
		) ) );

	}

	return container;

};

Sidebar.Geometry.CircleBufferGeometry = Sidebar.Geometry.CircleGeometry;

// File:editor/js/Sidebar.Geometry.CylinderGeometry.js

/**
 * @author mrdoob / http://mrdoob.com/
 */

Sidebar.Geometry.CylinderGeometry = function ( editor, object ) {

	var signals = editor.signals;

	var container = new UI.Row();

	var geometry = object.geometry;
	var parameters = geometry.parameters;

	// radiusTop

	var radiusTopRow = new UI.Row();
	var radiusTop = new UI.Number( parameters.radiusTop ).onChange( update );

	radiusTopRow.add( new UI.Text( 'Radius top' ).setWidth( '90px' ) );
	radiusTopRow.add( radiusTop );

	container.add( radiusTopRow );

	// radiusBottom

	var radiusBottomRow = new UI.Row();
	var radiusBottom = new UI.Number( parameters.radiusBottom ).onChange( update );

	radiusBottomRow.add( new UI.Text( 'Radius bottom' ).setWidth( '90px' ) );
	radiusBottomRow.add( radiusBottom );

	container.add( radiusBottomRow );

	// height

	var heightRow = new UI.Row();
	var height = new UI.Number( parameters.height ).onChange( update );

	heightRow.add( new UI.Text( 'Height' ).setWidth( '90px' ) );
	heightRow.add( height );

	container.add( heightRow );

	// radialSegments

	var radialSegmentsRow = new UI.Row();
	var radialSegments = new UI.Integer( parameters.radialSegments ).setRange( 1, Infinity ).onChange( update );

	radialSegmentsRow.add( new UI.Text( 'Radial segments' ).setWidth( '90px' ) );
	radialSegmentsRow.add( radialSegments );

	container.add( radialSegmentsRow );

	// heightSegments

	var heightSegmentsRow = new UI.Row();
	var heightSegments = new UI.Integer( parameters.heightSegments ).setRange( 1, Infinity ).onChange( update );

	heightSegmentsRow.add( new UI.Text( 'Height segments' ).setWidth( '90px' ) );
	heightSegmentsRow.add( heightSegments );

	container.add( heightSegmentsRow );

	// openEnded

	var openEndedRow = new UI.Row();
	var openEnded = new UI.Checkbox( parameters.openEnded ).onChange( update );

	openEndedRow.add( new UI.Text( 'Open ended' ).setWidth( '90px' ) );
	openEndedRow.add( openEnded );

	container.add( openEndedRow );

	//

	function update() {

		editor.execute( new SetGeometryCommand( object, new THREE[ geometry.type ](
			radiusTop.getValue(),
			radiusBottom.getValue(),
			height.getValue(),
			radialSegments.getValue(),
			heightSegments.getValue(),
			openEnded.getValue()
		) ) );

	}

	return container;

};

Sidebar.Geometry.CylinderBufferGeometry = Sidebar.Geometry.CylinderGeometry;

// File:editor/js/Sidebar.Geometry.IcosahedronGeometry.js

/**
 * @author mrdoob / http://mrdoob.com/
 */

Sidebar.Geometry.IcosahedronGeometry = function ( editor, object ) {

	var signals = editor.signals;

	var container = new UI.Row();

	var geometry = object.geometry;
	var parameters = geometry.parameters;

	// radius

	var radiusRow = new UI.Row();
	var radius = new UI.Number( parameters.radius ).onChange( update );

	radiusRow.add( new UI.Text( 'Radius' ).setWidth( '90px' ) );
	radiusRow.add( radius );

	container.add( radiusRow );

	// detail

	var detailRow = new UI.Row();
	var detail = new UI.Integer( parameters.detail ).setRange( 0, Infinity ).onChange( update );

	detailRow.add( new UI.Text( 'Detail' ).setWidth( '90px' ) );
	detailRow.add( detail );

	container.add( detailRow );


	//

	function update() {

		editor.execute( new SetGeometryCommand( object, new THREE[ geometry.type ](
			radius.getValue(),
			detail.getValue()
		) ) );

		signals.objectChanged.dispatch( object );

	}

	return container;

};

Sidebar.Geometry.IcosahedronBufferGeometry = Sidebar.Geometry.IcosahedronGeometry;

// File:editor/js/Sidebar.Geometry.PlaneGeometry.js

/**
 * @author mrdoob / http://mrdoob.com/
 */

Sidebar.Geometry.PlaneGeometry = function ( editor, object ) {

	var signals = editor.signals;

	var container = new UI.Row();

	var geometry = object.geometry;
	var parameters = geometry.parameters;

	// width

	var widthRow = new UI.Row();
	var width = new UI.Number( parameters.width ).onChange( update );

	widthRow.add( new UI.Text( 'Width' ).setWidth( '90px' ) );
	widthRow.add( width );

	container.add( widthRow );

	// height

	var heightRow = new UI.Row();
	var height = new UI.Number( parameters.height ).onChange( update );

	heightRow.add( new UI.Text( 'Height' ).setWidth( '90px' ) );
	heightRow.add( height );

	container.add( heightRow );

	// widthSegments

	var widthSegmentsRow = new UI.Row();
	var widthSegments = new UI.Integer( parameters.widthSegments ).setRange( 1, Infinity ).onChange( update );

	widthSegmentsRow.add( new UI.Text( 'Width segments' ).setWidth( '90px' ) );
	widthSegmentsRow.add( widthSegments );

	container.add( widthSegmentsRow );

	// heightSegments

	var heightSegmentsRow = new UI.Row();
	var heightSegments = new UI.Integer( parameters.heightSegments ).setRange( 1, Infinity ).onChange( update );

	heightSegmentsRow.add( new UI.Text( 'Height segments' ).setWidth( '90px' ) );
	heightSegmentsRow.add( heightSegments );

	container.add( heightSegmentsRow );


	//

	function update() {

		editor.execute( new SetGeometryCommand( object, new THREE[ geometry.type ](
			width.getValue(),
			height.getValue(),
			widthSegments.getValue(),
			heightSegments.getValue()
		) ) );

	}

	return container;

};

Sidebar.Geometry.PlaneBufferGeometry = Sidebar.Geometry.PlaneGeometry;

// File:editor/js/Sidebar.Geometry.SphereGeometry.js

/**
 * @author mrdoob / http://mrdoob.com/
 */

Sidebar.Geometry.SphereGeometry = function ( editor, object ) {

	var signals = editor.signals;

	var container = new UI.Row();

	var geometry = object.geometry;
	var parameters = geometry.parameters;

	// radius

	var radiusRow = new UI.Row();
	var radius = new UI.Number( parameters.radius ).onChange( update );

	radiusRow.add( new UI.Text( 'Radius' ).setWidth( '90px' ) );
	radiusRow.add( radius );

	container.add( radiusRow );

	// widthSegments

	var widthSegmentsRow = new UI.Row();
	var widthSegments = new UI.Integer( parameters.widthSegments ).setRange( 1, Infinity ).onChange( update );

	widthSegmentsRow.add( new UI.Text( 'Width segments' ).setWidth( '90px' ) );
	widthSegmentsRow.add( widthSegments );

	container.add( widthSegmentsRow );

	// heightSegments

	var heightSegmentsRow = new UI.Row();
	var heightSegments = new UI.Integer( parameters.heightSegments ).setRange( 1, Infinity ).onChange( update );

	heightSegmentsRow.add( new UI.Text( 'Height segments' ).setWidth( '90px' ) );
	heightSegmentsRow.add( heightSegments );

	container.add( heightSegmentsRow );

	// phiStart

	var phiStartRow = new UI.Row();
	var phiStart = new UI.Number( parameters.phiStart ).onChange( update );

	phiStartRow.add( new UI.Text( 'Phi start' ).setWidth( '90px' ) );
	phiStartRow.add( phiStart );

	container.add( phiStartRow );

	// phiLength

	var phiLengthRow = new UI.Row();
	var phiLength = new UI.Number( parameters.phiLength ).onChange( update );

	phiLengthRow.add( new UI.Text( 'Phi length' ).setWidth( '90px' ) );
	phiLengthRow.add( phiLength );

	container.add( phiLengthRow );

	// thetaStart

	var thetaStartRow = new UI.Row();
	var thetaStart = new UI.Number( parameters.thetaStart ).onChange( update );

	thetaStartRow.add( new UI.Text( 'Theta start' ).setWidth( '90px' ) );
	thetaStartRow.add( thetaStart );

	container.add( thetaStartRow );

	// thetaLength

	var thetaLengthRow = new UI.Row();
	var thetaLength = new UI.Number( parameters.thetaLength ).onChange( update );

	thetaLengthRow.add( new UI.Text( 'Theta length' ).setWidth( '90px' ) );
	thetaLengthRow.add( thetaLength );

	container.add( thetaLengthRow );


	//

	function update() {

		editor.execute( new SetGeometryCommand( object, new THREE[ geometry.type ](
			radius.getValue(),
			widthSegments.getValue(),
			heightSegments.getValue(),
			phiStart.getValue(),
			phiLength.getValue(),
			thetaStart.getValue(),
			thetaLength.getValue()
		) ) );

	}

	return container;

};

Sidebar.Geometry.SphereBufferGeometry = Sidebar.Geometry.SphereGeometry;

// File:editor/js/Sidebar.Geometry.TorusGeometry.js

/**
 * @author mrdoob / http://mrdoob.com/
 */

Sidebar.Geometry.TorusGeometry = function ( editor, object ) {

	var signals = editor.signals;

	var container = new UI.Row();

	var geometry = object.geometry;
	var parameters = geometry.parameters;

	// radius

	var radiusRow = new UI.Row();
	var radius = new UI.Number( parameters.radius ).onChange( update );

	radiusRow.add( new UI.Text( 'Radius' ).setWidth( '90px' ) );
	radiusRow.add( radius );

	container.add( radiusRow );

	// tube

	var tubeRow = new UI.Row();
	var tube = new UI.Number( parameters.tube ).onChange( update );

	tubeRow.add( new UI.Text( 'Tube' ).setWidth( '90px' ) );
	tubeRow.add( tube );

	container.add( tubeRow );

	// radialSegments

	var radialSegmentsRow = new UI.Row();
	var radialSegments = new UI.Integer( parameters.radialSegments ).setRange( 1, Infinity ).onChange( update );

	radialSegmentsRow.add( new UI.Text( 'Radial segments' ).setWidth( '90px' ) );
	radialSegmentsRow.add( radialSegments );

	container.add( radialSegmentsRow );

	// tubularSegments

	var tubularSegmentsRow = new UI.Row();
	var tubularSegments = new UI.Integer( parameters.tubularSegments ).setRange( 1, Infinity ).onChange( update );

	tubularSegmentsRow.add( new UI.Text( 'Tubular segments' ).setWidth( '90px' ) );
	tubularSegmentsRow.add( tubularSegments );

	container.add( tubularSegmentsRow );

	// arc

	var arcRow = new UI.Row();
	var arc = new UI.Number( parameters.arc ).onChange( update );

	arcRow.add( new UI.Text( 'Arc' ).setWidth( '90px' ) );
	arcRow.add( arc );

	container.add( arcRow );


	//

	function update() {

		editor.execute( new SetGeometryCommand( object, new THREE[ geometry.type ](
			radius.getValue(),
			tube.getValue(),
			radialSegments.getValue(),
			tubularSegments.getValue(),
			arc.getValue()
		) ) );

	}

	return container;

};

Sidebar.Geometry.TorusBufferGeometry = Sidebar.Geometry.TorusGeometry;

// File:editor/js/Sidebar.Geometry.TorusKnotGeometry.js

/**
 * @author mrdoob / http://mrdoob.com/
 */

Sidebar.Geometry.TorusKnotGeometry = function ( editor, object ) {

	var signals = editor.signals;

	var container = new UI.Row();

	var geometry = object.geometry;
	var parameters = geometry.parameters;

	// radius

	var radiusRow = new UI.Row();
	var radius = new UI.Number( parameters.radius ).onChange( update );

	radiusRow.add( new UI.Text( 'Radius' ).setWidth( '90px' ) );
	radiusRow.add( radius );

	container.add( radiusRow );

	// tube

	var tubeRow = new UI.Row();
	var tube = new UI.Number( parameters.tube ).onChange( update );

	tubeRow.add( new UI.Text( 'Tube' ).setWidth( '90px' ) );
	tubeRow.add( tube );

	container.add( tubeRow );

	// tubularSegments

	var tubularSegmentsRow = new UI.Row();
	var tubularSegments = new UI.Integer( parameters.tubularSegments ).setRange( 1, Infinity ).onChange( update );

	tubularSegmentsRow.add( new UI.Text( 'Tubular segments' ).setWidth( '90px' ) );
	tubularSegmentsRow.add( tubularSegments );

	container.add( tubularSegmentsRow );

	// radialSegments

	var radialSegmentsRow = new UI.Row();
	var radialSegments = new UI.Integer( parameters.radialSegments ).setRange( 1, Infinity ).onChange( update );

	radialSegmentsRow.add( new UI.Text( 'Radial segments' ).setWidth( '90px' ) );
	radialSegmentsRow.add( radialSegments );

	container.add( radialSegmentsRow );

	// p

	var pRow = new UI.Row();
	var p = new UI.Number( parameters.p ).onChange( update );

	pRow.add( new UI.Text( 'P' ).setWidth( '90px' ) );
	pRow.add( p );

	container.add( pRow );

	// q

	var qRow = new UI.Row();
	var q = new UI.Number( parameters.q ).onChange( update );

	pRow.add( new UI.Text( 'Q' ).setWidth( '90px' ) );
	pRow.add( q );

	container.add( qRow );


	//

	function update() {

		editor.execute( new SetGeometryCommand( object, new THREE[ geometry.type ](
			radius.getValue(),
			tube.getValue(),
			tubularSegments.getValue(),
			radialSegments.getValue(),
			p.getValue(),
			q.getValue()
		) ) );

	}

	return container;

};

Sidebar.Geometry.TorusKnotBufferGeometry = Sidebar.Geometry.TorusKnotGeometry;

// File:examples/js/geometries/TeapotBufferGeometry.js

/**
 * @author Eric Haines / http://erichaines.com/
 *
 * Tessellates the famous Utah teapot database by Martin Newell into triangles.
 *
 * THREE.TeapotBufferGeometry = function ( size, segments, bottom, lid, body, fitLid, blinn )
 *
 * defaults: size = 50, segments = 10, bottom = true, lid = true, body = true,
 *   fitLid = false, blinn = true
 *
 * size is a relative scale: I've scaled the teapot to fit vertically between -1 and 1.
 * Think of it as a "radius".
 * segments - number of line segments to subdivide each patch edge;
 *   1 is possible but gives degenerates, so two is the real minimum.
 * bottom - boolean, if true (default) then the bottom patches are added. Some consider
 *   adding the bottom heresy, so set this to "false" to adhere to the One True Way.
 * lid - to remove the lid and look inside, set to true.
 * body - to remove the body and leave the lid, set this and "bottom" to false.
 * fitLid - the lid is a tad small in the original. This stretches it a bit so you can't
 *   see the teapot's insides through the gap.
 * blinn - Jim Blinn scaled the original data vertically by dividing by about 1.3 to look
 *   nicer. If you want to see the original teapot, similar to the real-world model, set
 *   this to false. True by default.
 *   See http://en.wikipedia.org/wiki/File:Original_Utah_Teapot.jpg for the original
 *   real-world teapot (from http://en.wikipedia.org/wiki/Utah_teapot).
 *
 * Note that the bottom (the last four patches) is not flat - blame Frank Crow, not me.
 *
 * The teapot should normally be rendered as a double sided object, since for some
 * patches both sides can be seen, e.g., the gap around the lid and inside the spout.
 *
 * Segments 'n' determines the number of triangles output.
 *   Total triangles = 32*2*n*n - 8*n    [degenerates at the top and bottom cusps are deleted]
 *
 *   size_factor   # triangles
 *       1          56
 *       2         240
 *       3         552
 *       4         992
 *
 *      10        6320
 *      20       25440
 *      30       57360
 *
 * Code converted from my ancient SPD software, http://tog.acm.org/resources/SPD/
 * Created for the Udacity course "Interactive Rendering", http://bit.ly/ericity
 * Lesson: https://www.udacity.com/course/viewer#!/c-cs291/l-68866048/m-106482448
 * YouTube video on teapot history: https://www.youtube.com/watch?v=DxMfblPzFNc
 *
 * See https://en.wikipedia.org/wiki/Utah_teapot for the history of the teapot
 *
 */
/*global THREE */

THREE.TeapotBufferGeometry = function ( size, segments, bottom, lid, body, fitLid, blinn ) {

	"use strict";

	// 32 * 4 * 4 Bezier spline patches
	var teapotPatches = [
/*rim*/
0,1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,
3,16,17,18,7,19,20,21,11,22,23,24,15,25,26,27,
18,28,29,30,21,31,32,33,24,34,35,36,27,37,38,39,
30,40,41,0,33,42,43,4,36,44,45,8,39,46,47,12,
/*body*/
12,13,14,15,48,49,50,51,52,53,54,55,56,57,58,59,
15,25,26,27,51,60,61,62,55,63,64,65,59,66,67,68,
27,37,38,39,62,69,70,71,65,72,73,74,68,75,76,77,
39,46,47,12,71,78,79,48,74,80,81,52,77,82,83,56,
56,57,58,59,84,85,86,87,88,89,90,91,92,93,94,95,
59,66,67,68,87,96,97,98,91,99,100,101,95,102,103,104,
68,75,76,77,98,105,106,107,101,108,109,110,104,111,112,113,
77,82,83,56,107,114,115,84,110,116,117,88,113,118,119,92,
/*handle*/
120,121,122,123,124,125,126,127,128,129,130,131,132,133,134,135,
123,136,137,120,127,138,139,124,131,140,141,128,135,142,143,132,
132,133,134,135,144,145,146,147,148,149,150,151,68,152,153,154,
135,142,143,132,147,155,156,144,151,157,158,148,154,159,160,68,
/*spout*/
161,162,163,164,165,166,167,168,169,170,171,172,173,174,175,176,
164,177,178,161,168,179,180,165,172,181,182,169,176,183,184,173,
173,174,175,176,185,186,187,188,189,190,191,192,193,194,195,196,
176,183,184,173,188,197,198,185,192,199,200,189,196,201,202,193,
/*lid*/
203,203,203,203,204,205,206,207,208,208,208,208,209,210,211,212,
203,203,203,203,207,213,214,215,208,208,208,208,212,216,217,218,
203,203,203,203,215,219,220,221,208,208,208,208,218,222,223,224,
203,203,203,203,221,225,226,204,208,208,208,208,224,227,228,209,
209,210,211,212,229,230,231,232,233,234,235,236,237,238,239,240,
212,216,217,218,232,241,242,243,236,244,245,246,240,247,248,249,
218,222,223,224,243,250,251,252,246,253,254,255,249,256,257,258,
224,227,228,209,252,259,260,229,255,261,262,233,258,263,264,237,
/*bottom*/
265,265,265,265,266,267,268,269,270,271,272,273,92,119,118,113,
265,265,265,265,269,274,275,276,273,277,278,279,113,112,111,104,
265,265,265,265,276,280,281,282,279,283,284,285,104,103,102,95,
265,265,265,265,282,286,287,266,285,288,289,270,95,94,93,92
	] ;

	var teapotVertices = [
1.4,0,2.4,
1.4,-0.784,2.4,
0.784,-1.4,2.4,
0,-1.4,2.4,
1.3375,0,2.53125,
1.3375,-0.749,2.53125,
0.749,-1.3375,2.53125,
0,-1.3375,2.53125,
1.4375,0,2.53125,
1.4375,-0.805,2.53125,
0.805,-1.4375,2.53125,
0,-1.4375,2.53125,
1.5,0,2.4,
1.5,-0.84,2.4,
0.84,-1.5,2.4,
0,-1.5,2.4,
-0.784,-1.4,2.4,
-1.4,-0.784,2.4,
-1.4,0,2.4,
-0.749,-1.3375,2.53125,
-1.3375,-0.749,2.53125,
-1.3375,0,2.53125,
-0.805,-1.4375,2.53125,
-1.4375,-0.805,2.53125,
-1.4375,0,2.53125,
-0.84,-1.5,2.4,
-1.5,-0.84,2.4,
-1.5,0,2.4,
-1.4,0.784,2.4,
-0.784,1.4,2.4,
0,1.4,2.4,
-1.3375,0.749,2.53125,
-0.749,1.3375,2.53125,
0,1.3375,2.53125,
-1.4375,0.805,2.53125,
-0.805,1.4375,2.53125,
0,1.4375,2.53125,
-1.5,0.84,2.4,
-0.84,1.5,2.4,
0,1.5,2.4,
0.784,1.4,2.4,
1.4,0.784,2.4,
0.749,1.3375,2.53125,
1.3375,0.749,2.53125,
0.805,1.4375,2.53125,
1.4375,0.805,2.53125,
0.84,1.5,2.4,
1.5,0.84,2.4,
1.75,0,1.875,
1.75,-0.98,1.875,
0.98,-1.75,1.875,
0,-1.75,1.875,
2,0,1.35,
2,-1.12,1.35,
1.12,-2,1.35,
0,-2,1.35,
2,0,0.9,
2,-1.12,0.9,
1.12,-2,0.9,
0,-2,0.9,
-0.98,-1.75,1.875,
-1.75,-0.98,1.875,
-1.75,0,1.875,
-1.12,-2,1.35,
-2,-1.12,1.35,
-2,0,1.35,
-1.12,-2,0.9,
-2,-1.12,0.9,
-2,0,0.9,
-1.75,0.98,1.875,
-0.98,1.75,1.875,
0,1.75,1.875,
-2,1.12,1.35,
-1.12,2,1.35,
0,2,1.35,
-2,1.12,0.9,
-1.12,2,0.9,
0,2,0.9,
0.98,1.75,1.875,
1.75,0.98,1.875,
1.12,2,1.35,
2,1.12,1.35,
1.12,2,0.9,
2,1.12,0.9,
2,0,0.45,
2,-1.12,0.45,
1.12,-2,0.45,
0,-2,0.45,
1.5,0,0.225,
1.5,-0.84,0.225,
0.84,-1.5,0.225,
0,-1.5,0.225,
1.5,0,0.15,
1.5,-0.84,0.15,
0.84,-1.5,0.15,
0,-1.5,0.15,
-1.12,-2,0.45,
-2,-1.12,0.45,
-2,0,0.45,
-0.84,-1.5,0.225,
-1.5,-0.84,0.225,
-1.5,0,0.225,
-0.84,-1.5,0.15,
-1.5,-0.84,0.15,
-1.5,0,0.15,
-2,1.12,0.45,
-1.12,2,0.45,
0,2,0.45,
-1.5,0.84,0.225,
-0.84,1.5,0.225,
0,1.5,0.225,
-1.5,0.84,0.15,
-0.84,1.5,0.15,
0,1.5,0.15,
1.12,2,0.45,
2,1.12,0.45,
0.84,1.5,0.225,
1.5,0.84,0.225,
0.84,1.5,0.15,
1.5,0.84,0.15,
-1.6,0,2.025,
-1.6,-0.3,2.025,
-1.5,-0.3,2.25,
-1.5,0,2.25,
-2.3,0,2.025,
-2.3,-0.3,2.025,
-2.5,-0.3,2.25,
-2.5,0,2.25,
-2.7,0,2.025,
-2.7,-0.3,2.025,
-3,-0.3,2.25,
-3,0,2.25,
-2.7,0,1.8,
-2.7,-0.3,1.8,
-3,-0.3,1.8,
-3,0,1.8,
-1.5,0.3,2.25,
-1.6,0.3,2.025,
-2.5,0.3,2.25,
-2.3,0.3,2.025,
-3,0.3,2.25,
-2.7,0.3,2.025,
-3,0.3,1.8,
-2.7,0.3,1.8,
-2.7,0,1.575,
-2.7,-0.3,1.575,
-3,-0.3,1.35,
-3,0,1.35,
-2.5,0,1.125,
-2.5,-0.3,1.125,
-2.65,-0.3,0.9375,
-2.65,0,0.9375,
-2,-0.3,0.9,
-1.9,-0.3,0.6,
-1.9,0,0.6,
-3,0.3,1.35,
-2.7,0.3,1.575,
-2.65,0.3,0.9375,
-2.5,0.3,1.125,
-1.9,0.3,0.6,
-2,0.3,0.9,
1.7,0,1.425,
1.7,-0.66,1.425,
1.7,-0.66,0.6,
1.7,0,0.6,
2.6,0,1.425,
2.6,-0.66,1.425,
3.1,-0.66,0.825,
3.1,0,0.825,
2.3,0,2.1,
2.3,-0.25,2.1,
2.4,-0.25,2.025,
2.4,0,2.025,
2.7,0,2.4,
2.7,-0.25,2.4,
3.3,-0.25,2.4,
3.3,0,2.4,
1.7,0.66,0.6,
1.7,0.66,1.425,
3.1,0.66,0.825,
2.6,0.66,1.425,
2.4,0.25,2.025,
2.3,0.25,2.1,
3.3,0.25,2.4,
2.7,0.25,2.4,
2.8,0,2.475,
2.8,-0.25,2.475,
3.525,-0.25,2.49375,
3.525,0,2.49375,
2.9,0,2.475,
2.9,-0.15,2.475,
3.45,-0.15,2.5125,
3.45,0,2.5125,
2.8,0,2.4,
2.8,-0.15,2.4,
3.2,-0.15,2.4,
3.2,0,2.4,
3.525,0.25,2.49375,
2.8,0.25,2.475,
3.45,0.15,2.5125,
2.9,0.15,2.475,
3.2,0.15,2.4,
2.8,0.15,2.4,
0,0,3.15,
0.8,0,3.15,
0.8,-0.45,3.15,
0.45,-0.8,3.15,
0,-0.8,3.15,
0,0,2.85,
0.2,0,2.7,
0.2,-0.112,2.7,
0.112,-0.2,2.7,
0,-0.2,2.7,
-0.45,-0.8,3.15,
-0.8,-0.45,3.15,
-0.8,0,3.15,
-0.112,-0.2,2.7,
-0.2,-0.112,2.7,
-0.2,0,2.7,
-0.8,0.45,3.15,
-0.45,0.8,3.15,
0,0.8,3.15,
-0.2,0.112,2.7,
-0.112,0.2,2.7,
0,0.2,2.7,
0.45,0.8,3.15,
0.8,0.45,3.15,
0.112,0.2,2.7,
0.2,0.112,2.7,
0.4,0,2.55,
0.4,-0.224,2.55,
0.224,-0.4,2.55,
0,-0.4,2.55,
1.3,0,2.55,
1.3,-0.728,2.55,
0.728,-1.3,2.55,
0,-1.3,2.55,
1.3,0,2.4,
1.3,-0.728,2.4,
0.728,-1.3,2.4,
0,-1.3,2.4,
-0.224,-0.4,2.55,
-0.4,-0.224,2.55,
-0.4,0,2.55,
-0.728,-1.3,2.55,
-1.3,-0.728,2.55,
-1.3,0,2.55,
-0.728,-1.3,2.4,
-1.3,-0.728,2.4,
-1.3,0,2.4,
-0.4,0.224,2.55,
-0.224,0.4,2.55,
0,0.4,2.55,
-1.3,0.728,2.55,
-0.728,1.3,2.55,
0,1.3,2.55,
-1.3,0.728,2.4,
-0.728,1.3,2.4,
0,1.3,2.4,
0.224,0.4,2.55,
0.4,0.224,2.55,
0.728,1.3,2.55,
1.3,0.728,2.55,
0.728,1.3,2.4,
1.3,0.728,2.4,
0,0,0,
1.425,0,0,
1.425,0.798,0,
0.798,1.425,0,
0,1.425,0,
1.5,0,0.075,
1.5,0.84,0.075,
0.84,1.5,0.075,
0,1.5,0.075,
-0.798,1.425,0,
-1.425,0.798,0,
-1.425,0,0,
-0.84,1.5,0.075,
-1.5,0.84,0.075,
-1.5,0,0.075,
-1.425,-0.798,0,
-0.798,-1.425,0,
0,-1.425,0,
-1.5,-0.84,0.075,
-0.84,-1.5,0.075,
0,-1.5,0.075,
0.798,-1.425,0,
1.425,-0.798,0,
0.84,-1.5,0.075,
1.5,-0.84,0.075
	] ;

	THREE.BufferGeometry.call( this );

	this.type = 'TeapotBufferGeometry';

	this.parameters = {
		size: size,
		segments: segments,
		bottom: bottom,
		lid: lid,
		body: body,
		fitLid: fitLid,
		blinn: blinn
	};

	size = size || 50;

	// number of segments per patch
	segments = segments !== undefined ? Math.max( 2, Math.floor( segments ) || 10 ) : 10;

	// which parts should be visible
	bottom = bottom === undefined ? true : bottom;
	lid = lid === undefined ? true : lid;
	body = body === undefined ? true : body;

	// Should the lid be snug? It's not traditional, so off by default
	fitLid = fitLid === undefined ? false : fitLid;

	// Jim Blinn scaled the teapot down in size by about 1.3 for
	// some rendering tests. He liked the new proportions that he kept
	// the data in this form. The model was distributed with these new
	// proportions and became the norm. Trivia: comparing images of the
	// real teapot and the computer model, the ratio for the bowl of the
	// real teapot is more like 1.25, but since 1.3 is the traditional
	// value given, we use it here.
	var blinnScale = 1.3;
	blinn = blinn === undefined ? true : blinn;

	// scale the size to be the real scaling factor
	var maxHeight = 3.15 * ( blinn ? 1 : blinnScale );

	var maxHeight2 = maxHeight / 2;
	var trueSize = size / maxHeight2;

	// Number of elements depends on what is needed. Subtract degenerate
	// triangles at tip of bottom and lid out in advance.
	var numTriangles = bottom ? ( 8 * segments - 4 ) * segments : 0;
	numTriangles += lid ? ( 16 * segments - 4 ) * segments : 0;
	numTriangles += body ? 40 * segments * segments : 0;

	var indices = new Uint32Array( numTriangles * 3 );

	var numVertices = bottom ? 4 : 0;
	numVertices += lid ? 8 : 0;
	numVertices += body ? 20 : 0;
	numVertices *= ( segments + 1 ) * ( segments + 1 );

	var vertices = new Float32Array( numVertices * 3 );
	var normals = new Float32Array( numVertices * 3 );
	var uvs = new Float32Array( numVertices * 2 );

	// Bezier form
	var ms = new THREE.Matrix4();
	ms.set( -1.0,  3.0, -3.0,  1.0,
			 3.0, -6.0,  3.0,  0.0,
			-3.0,  3.0,  0.0,  0.0,
			 1.0,  0.0,  0.0,  0.0 ) ;

	var g = [];
	var i, r, c;

	var sp = [];
	var tp = [];
	var dsp = [];
	var dtp = [];

	// M * G * M matrix, sort of see
	// http://www.cs.helsinki.fi/group/goa/mallinnus/curves/surfaces.html
	var mgm = [];

	var vert = [];
	var sdir = [];
	var tdir = [];

	var norm = new THREE.Vector3();

	var tcoord;

	var sstep, tstep;
	var vertPerRow, eps;

	var s, t, sval, tval, p, dsval, dtval;

	var normOut = new THREE.Vector3();
	var v1, v2, v3, v4;

	var gmx = new THREE.Matrix4();
	var tmtx = new THREE.Matrix4();

	var vsp = new THREE.Vector4();
	var vtp = new THREE.Vector4();
	var vdsp = new THREE.Vector4();
	var vdtp = new THREE.Vector4();

	var vsdir = new THREE.Vector3();
	var vtdir = new THREE.Vector3();

	var mst = ms.clone();
	mst.transpose();

	// internal function: test if triangle has any matching vertices;
	// if so, don't save triangle, since it won't display anything.
	var notDegenerate = function ( vtx1, vtx2, vtx3 ) {

		// if any vertex matches, return false
		return ! ( ( ( vertices[ vtx1 * 3 ]     === vertices[ vtx2 * 3 ] ) &&
					 ( vertices[ vtx1 * 3 + 1 ] === vertices[ vtx2 * 3 + 1 ] ) &&
					 ( vertices[ vtx1 * 3 + 2 ] === vertices[ vtx2 * 3 + 2 ] ) ) ||
				   ( ( vertices[ vtx1 * 3 ]     === vertices[ vtx3 * 3 ] ) &&
					 ( vertices[ vtx1 * 3 + 1 ] === vertices[ vtx3 * 3 + 1 ] ) &&
					 ( vertices[ vtx1 * 3 + 2 ] === vertices[ vtx3 * 3 + 2 ] ) ) ||
				   ( ( vertices[ vtx2 * 3 ]     === vertices[ vtx3 * 3 ] ) &&
					 ( vertices[ vtx2 * 3 + 1 ] === vertices[ vtx3 * 3 + 1 ] ) &&
					 ( vertices[ vtx2 * 3 + 2 ] === vertices[ vtx3 * 3 + 2 ] ) ) );

	};


	for ( i = 0; i < 3; i ++ )
	{

		mgm[ i ] = new THREE.Matrix4();

	}

	var minPatches = body ? 0 : 20;
	var maxPatches = bottom ? 32 : 28;

	vertPerRow = segments + 1;

	eps = 0.0000001;

	var surfCount = 0;

	var vertCount = 0;
	var normCount = 0;
	var uvCount = 0;

	var indexCount = 0;

	for ( var surf = minPatches ; surf < maxPatches ; surf ++ ) {

		// lid is in the middle of the data, patches 20-27,
		// so ignore it for this part of the loop if the lid is not desired
		if ( lid || ( surf < 20 || surf >= 28 ) ) {

			// get M * G * M matrix for x,y,z
			for ( i = 0 ; i < 3 ; i ++ ) {

				// get control patches
				for ( r = 0 ; r < 4 ; r ++ ) {

					for ( c = 0 ; c < 4 ; c ++ ) {

						// transposed
						g[ c * 4 + r ] = teapotVertices[ teapotPatches[ surf * 16 + r * 4 + c ] * 3 + i ] ;

						// is the lid to be made larger, and is this a point on the lid
						// that is X or Y?
						if ( fitLid && ( surf >= 20 && surf < 28 ) && ( i !== 2 ) ) {

							// increase XY size by 7.7%, found empirically. I don't
							// increase Z so that the teapot will continue to fit in the
							// space -1 to 1 for Y (Y is up for the final model).
							g[ c * 4 + r ] *= 1.077;

						}

						// Blinn "fixed" the teapot by dividing Z by blinnScale, and that's the
						// data we now use. The original teapot is taller. Fix it:
						if ( ! blinn && ( i === 2 ) ) {

							g[ c * 4 + r ] *= blinnScale;

						}

					}

				}

				gmx.set( g[ 0 ], g[ 1 ], g[ 2 ], g[ 3 ], g[ 4 ], g[ 5 ], g[ 6 ], g[ 7 ], g[ 8 ], g[ 9 ], g[ 10 ], g[ 11 ], g[ 12 ], g[ 13 ], g[ 14 ], g[ 15 ] );

				tmtx.multiplyMatrices( gmx, ms );
				mgm[ i ].multiplyMatrices( mst, tmtx );

			}

			// step along, get points, and output
			for ( sstep = 0 ; sstep <= segments ; sstep ++ ) {

				s = sstep / segments;

				for ( tstep = 0 ; tstep <= segments ; tstep ++ ) {

					t = tstep / segments;

					// point from basis
					// get power vectors and their derivatives
					for ( p = 4, sval = tval = 1.0 ; p -- ; ) {

						sp[ p ] = sval ;
						tp[ p ] = tval ;
						sval *= s ;
						tval *= t ;

						if ( p === 3 ) {

							dsp[ p ] = dtp[ p ] = 0.0 ;
							dsval = dtval = 1.0 ;

						} else {

							dsp[ p ] = dsval * ( 3 - p ) ;
							dtp[ p ] = dtval * ( 3 - p ) ;
							dsval *= s ;
							dtval *= t ;

						}

					}

					vsp.fromArray( sp );
					vtp.fromArray( tp );
					vdsp.fromArray( dsp );
					vdtp.fromArray( dtp );

					// do for x,y,z
					for ( i = 0 ; i < 3 ; i ++ ) {

						// multiply power vectors times matrix to get value
						tcoord = vsp.clone();
						tcoord.applyMatrix4( mgm[ i ] );
						vert[ i ] = tcoord.dot( vtp );

						// get s and t tangent vectors
						tcoord = vdsp.clone();
						tcoord.applyMatrix4( mgm[ i ] );
						sdir[ i ] = tcoord.dot( vtp ) ;

						tcoord = vsp.clone();
						tcoord.applyMatrix4( mgm[ i ] );
						tdir[ i ] = tcoord.dot( vdtp ) ;

					}

					// find normal
					vsdir.fromArray( sdir );
					vtdir.fromArray( tdir );
					norm.crossVectors( vtdir, vsdir );
					norm.normalize();

					// if X and Z length is 0, at the cusp, so point the normal up or down, depending on patch number
					if ( vert[ 0 ] === 0 && vert[ 1 ] === 0 )
					{

						// if above the middle of the teapot, normal points up, else down
						normOut.set( 0, vert[ 2 ] > maxHeight2 ? 1 : - 1, 0 );

					}
					else
					{

						// standard output: rotate on X axis
						normOut.set( norm.x, norm.z, - norm.y );

					}

					// store it all
					vertices[ vertCount ++ ] = trueSize * vert[ 0 ];
					vertices[ vertCount ++ ] = trueSize * ( vert[ 2 ] - maxHeight2 );
					vertices[ vertCount ++ ] = - trueSize * vert[ 1 ];

					normals[ normCount ++ ] = normOut.x;
					normals[ normCount ++ ] = normOut.y;
					normals[ normCount ++ ] = normOut.z;

					uvs[ uvCount ++ ] = 1 - t;
					uvs[ uvCount ++ ] = 1 - s;

				}

			}

			// save the faces
			for ( sstep = 0 ; sstep < segments ; sstep ++ ) {

				for ( tstep = 0 ; tstep < segments ; tstep ++ ) {

					v1 = surfCount * vertPerRow * vertPerRow + sstep * vertPerRow + tstep;
					v2 = v1 + 1;
					v3 = v2 + vertPerRow;
					v4 = v1 + vertPerRow;

					// Normals and UVs cannot be shared. Without clone(), you can see the consequences
					// of sharing if you call geometry.applyMatrix( matrix ).
					if ( notDegenerate ( v1, v2, v3 ) ) {

						indices[ indexCount ++ ] = v1;
						indices[ indexCount ++ ] = v2;
						indices[ indexCount ++ ] = v3;

					}
					if ( notDegenerate ( v1, v3, v4 ) ) {

						indices[ indexCount ++ ] = v1;
						indices[ indexCount ++ ] = v3;
						indices[ indexCount ++ ] = v4;

					}

				}

			}

			// increment only if a surface was used
			surfCount ++;

		}

	}

	this.setIndex( new THREE.BufferAttribute( indices, 1 ) );
	this.addAttribute( 'position', new THREE.BufferAttribute( vertices, 3 ) );
	this.addAttribute( 'normal', new THREE.BufferAttribute( normals, 3 ) );
	this.addAttribute( 'uv', new THREE.BufferAttribute( uvs, 2 ) );

	this.computeBoundingSphere();

};


THREE.TeapotBufferGeometry.prototype = Object.create( THREE.BufferGeometry.prototype );
THREE.TeapotBufferGeometry.prototype.constructor = THREE.TeapotBufferGeometry;

THREE.TeapotBufferGeometry.prototype.clone = function () {

	var bufferGeometry = new THREE.TeapotBufferGeometry(
		this.parameters.size,
		this.parameters.segments,
		this.parameters.bottom,
		this.parameters.lid,
		this.parameters.body,
		this.parameters.fitLid,
		this.parameters.blinn
	);

	return bufferGeometry;

};

// File:editor/js/Sidebar.Geometry.TeapotBufferGeometry.js

/**
 * @author tschw
 */

Sidebar.Geometry.TeapotBufferGeometry = function ( signals, object ) {

	var container = new UI.Row();

	var parameters = object.geometry.parameters;

	// size

	var sizeRow = new UI.Row();
	var size = new UI.Number( parameters.size ).onChange( update );

	sizeRow.add( new UI.Text( 'Size' ).setWidth( '90px' ) );
	sizeRow.add( size );

	container.add( sizeRow );

	// segments

	var segmentsRow = new UI.Row();
	var segments = new UI.Integer( parameters.segments ).setRange( 1, Infinity ).onChange( update );

	segmentsRow.add( new UI.Text( 'Segments' ).setWidth( '90px' ) );
	segmentsRow.add( segments );

	container.add( segmentsRow );

	// bottom

	var bottomRow = new UI.Row();
	var bottom = new UI.Checkbox( parameters.bottom ).onChange( update );

	bottomRow.add( new UI.Text( 'Bottom' ).setWidth( '90px' ) );
	bottomRow.add( bottom );

	container.add( bottomRow );

	// lid

	var lidRow = new UI.Row();
	var lid = new UI.Checkbox( parameters.lid ).onChange( update );

	lidRow.add( new UI.Text( 'Lid' ).setWidth( '90px' ) );
	lidRow.add( lid );

	container.add( lidRow );

	// body

	var bodyRow = new UI.Row();
	var body = new UI.Checkbox( parameters.body ).onChange( update );

	bodyRow.add( new UI.Text( 'Body' ).setWidth( '90px' ) );
	bodyRow.add( body );

	container.add( bodyRow );

	// fitted lid

	var fitLidRow = new UI.Row();
	var fitLid = new UI.Checkbox( parameters.fitLid ).onChange( update );

	fitLidRow.add( new UI.Text( 'Fitted Lid' ).setWidth( '90px' ) );
	fitLidRow.add( fitLid );

	container.add( fitLidRow );

	// blinn-sized

	var blinnRow = new UI.Row();
	var blinn = new UI.Checkbox( parameters.blinn ).onChange( update );

	blinnRow.add( new UI.Text( 'Blinn-scaled' ).setWidth( '90px' ) );
	blinnRow.add( blinn );

	container.add( blinnRow );

	function update() {

		object.geometry.dispose();

		object.geometry = new THREE.TeapotBufferGeometry(
			size.getValue(),
			segments.getValue(),
			bottom.getValue(),
			lid.getValue(),
			body.getValue(),
			fitLid.getValue(),
			blinn.getValue()
		);

		object.geometry.computeBoundingSphere();

		signals.geometryChanged.dispatch( object );

	}

	return container;

};

// File:editor/js/Sidebar.Material.js

/**
 * @author mrdoob / http://mrdoob.com/
 */

Sidebar.Material = function ( editor ) {

	var signals = editor.signals;
	var currentObject;

	var container = new UI.Panel();
	container.setBorderTop( '0' );
	container.setPaddingTop( '20px' );

	// New / Copy / Paste

	var copiedMaterial;
	var managerRow = new UI.Row();

	managerRow.add( new UI.Text( 'Actions' ).setWidth( '90px' ) );
	managerRow.add( new UI.Button( 'Reset' ).onClick( function () {

		var material = new THREE[ materialClass.getValue() ]();
		editor.execute( new SetMaterialCommand( currentObject, material ), 'New Material: ' + materialClass.getValue() );
		update();

	} ) );

	managerRow.add( new UI.Button( 'Copy' ).onClick( function () {

		copiedMaterial = currentObject.material;

	} ) );

	managerRow.add( new UI.Button( 'Paste' ).onClick( function () {

		if ( copiedMaterial === undefined ) return;

		editor.execute( new SetMaterialCommand( currentObject, copiedMaterial ), 'Pasted Material: ' + materialClass.getValue() );
		refreshUI();
		update();

	} ) );

	var materialUUIDRenew = new UI.Button( 'Solo' ).onClick( function () {

		materialUUID.setValue( THREE.Math.generateUUID() );
		editor.execute( new SetMaterialValueCommand( editor.selected, 'name', materialName.getValue() + '_copy' ) );

		update();

	} );

	// materialUUIDRow.add( new UI.Text( 'UUID' ).setWidth( '90px' ) );
	//REMOVED
	// materialUUIDRow.add( materialUUID );
	managerRow.add( materialUUIDRenew );

	container.add( managerRow );


	// type

	var materialClassRow = new UI.Row();
	var materialClass = new UI.Select().setOptions( {

		'LineBasicMaterial': 'LineBasicMaterial',
		'LineDashedMaterial': 'LineDashedMaterial',
		'MeshBasicMaterial': 'MeshBasicMaterial',
		'MeshDepthMaterial': 'MeshDepthMaterial',
		'MeshNormalMaterial': 'MeshNormalMaterial',
		'MeshLambertMaterial': 'MeshLambertMaterial',
		'MeshPhongMaterial': 'MeshPhongMaterial',
		'MeshStandardMaterial': 'MeshStandardMaterial',
		'ShaderMaterial': 'ShaderMaterial',
		'SpriteMaterial': 'SpriteMaterial'

	} ).setWidth( '150px' ).setFontSize( '12px' ).onChange( update );

	materialClassRow.add( new UI.Text( 'Type' ).setWidth( '90px' ) );
	materialClassRow.add( materialClass );

	container.add( materialClassRow );

	// uuid

	var materialUUIDRow = new UI.Row();
	var materialUUID = new UI.Input().setWidth( '115px' ).setFontSize( '12px' ).setDisabled( true );
	var materialUUIDRenew = new UI.Button( '+' ).setMarginLeft( '7px' ).onClick( function () {

		materialUUID.setValue( THREE.Math.generateUUID() );
		update();

	} );

	materialUUIDRow.add( new UI.Text( 'UUID' ).setWidth( '90px' ) );
	materialUUIDRow.add( materialUUID );
	materialUUIDRow.add( materialUUIDRenew );

	//REMOVED
	// container.add( materialUUIDRow );

	// name

	var materialNameRow = new UI.Row();
	var materialName = new UI.Input().setWidth( '150px' ).setFontSize( '12px' ).onChange( function () {

		editor.execute( new SetMaterialValueCommand( editor.selected, 'name', materialName.getValue() ) );

	} );

	materialNameRow.add( new UI.Text( 'Name' ).setWidth( '90px' ) );
	materialNameRow.add( materialName );

	container.add( materialNameRow );

	// program

	var materialProgramRow = new UI.Row();
	materialProgramRow.add( new UI.Text( 'Program' ).setWidth( '90px' ) );

	var materialProgramInfo = new UI.Button( 'Info' );
	materialProgramInfo.setMarginLeft( '4px' );
	materialProgramInfo.onClick( function () {

		signals.editScript.dispatch( currentObject, 'programInfo' );

	} );
	materialProgramRow.add( materialProgramInfo );

	var materialProgramVertex = new UI.Button( 'Vertex' );
	materialProgramVertex.setMarginLeft( '4px' );
	materialProgramVertex.onClick( function () {

		signals.editScript.dispatch( currentObject, 'vertexShader' );

	} );
	materialProgramRow.add( materialProgramVertex );

	var materialProgramFragment = new UI.Button( 'Fragment' );
	materialProgramFragment.setMarginLeft( '4px' );
	materialProgramFragment.onClick( function () {

		signals.editScript.dispatch( currentObject, 'fragmentShader' );

	} );
	materialProgramRow.add( materialProgramFragment );

	container.add( materialProgramRow );

	// color

	var materialColorRow = new UI.Row();
	var materialColor = new UI.Color().onChange( update );

	materialColorRow.add( new UI.Text( 'Color' ).setWidth( '90px' ) );
	materialColorRow.add( materialColor );

	container.add( materialColorRow );

	// roughness

	var materialRoughnessRow = new UI.Row();
	var materialRoughness = new UI.Number( 0.5 ).setWidth( '60px' ).setRange( 0, 1 ).onChange( update );

	materialRoughnessRow.add( new UI.Text( 'Roughness' ).setWidth( '90px' ) );
	materialRoughnessRow.add( materialRoughness );

	container.add( materialRoughnessRow );

	// metalness

	var materialMetalnessRow = new UI.Row();
	var materialMetalness = new UI.Number( 0.5 ).setWidth( '60px' ).setRange( 0, 1 ).onChange( update );

	materialMetalnessRow.add( new UI.Text( 'Metalness' ).setWidth( '90px' ) );
	materialMetalnessRow.add( materialMetalness );

	container.add( materialMetalnessRow );

	// emissive

	var materialEmissiveRow = new UI.Row();
	var materialEmissive = new UI.Color().setHexValue( 0x000000 ).onChange( update );

	materialEmissiveRow.add( new UI.Text( 'Emissive' ).setWidth( '90px' ) );
	materialEmissiveRow.add( materialEmissive );

	container.add( materialEmissiveRow );

	// specular

	var materialSpecularRow = new UI.Row();
	var materialSpecular = new UI.Color().setHexValue( 0x111111 ).onChange( update );

	materialSpecularRow.add( new UI.Text( 'Specular' ).setWidth( '90px' ) );
	materialSpecularRow.add( materialSpecular );

	container.add( materialSpecularRow );

	// shininess

	var materialShininessRow = new UI.Row();
	var materialShininess = new UI.Number( 30 ).onChange( update );

	materialShininessRow.add( new UI.Text( 'Shininess' ).setWidth( '90px' ) );
	materialShininessRow.add( materialShininess );

	container.add( materialShininessRow );

	// vertex colors

	var materialVertexColorsRow = new UI.Row();
	var materialVertexColors = new UI.Select().setOptions( {

		0: 'No',
		1: 'Face',
		2: 'Vertex'

	} ).onChange( update );

	materialVertexColorsRow.add( new UI.Text( 'Vertex Colors' ).setWidth( '90px' ) );
	materialVertexColorsRow.add( materialVertexColors );

	container.add( materialVertexColorsRow );

	// skinning

	var materialSkinningRow = new UI.Row();
	var materialSkinning = new UI.Checkbox( false ).onChange( update );

	materialSkinningRow.add( new UI.Text( 'Skinning' ).setWidth( '90px' ) );
	materialSkinningRow.add( materialSkinning );

	container.add( materialSkinningRow );

	// map

	var materialMapRow = new UI.Row();
	var materialMapEnabled = new UI.Checkbox( false ).onChange( update );
	var materialMap = new UI.Texture().onChange( update );

	materialMapRow.add( new UI.Text( 'Map' ).setWidth( '90px' ) );
	materialMapRow.add( materialMapEnabled );
	materialMapRow.add( materialMap );

	container.add( materialMapRow );

	// alpha map

	var materialAlphaMapRow = new UI.Row();
	var materialAlphaMapEnabled = new UI.Checkbox( false ).onChange( update );
	var materialAlphaMap = new UI.Texture().onChange( update );

	materialAlphaMapRow.add( new UI.Text( 'Alpha Map' ).setWidth( '90px' ) );
	materialAlphaMapRow.add( materialAlphaMapEnabled );
	materialAlphaMapRow.add( materialAlphaMap );

	container.add( materialAlphaMapRow );

	// bump map

	var materialBumpMapRow = new UI.Row();
	var materialBumpMapEnabled = new UI.Checkbox( false ).onChange( update );
	var materialBumpMap = new UI.Texture().onChange( update );
	var materialBumpScale = new UI.Number( 1 ).setWidth( '30px' ).onChange( update );

	materialBumpMapRow.add( new UI.Text( 'Bump Map' ).setWidth( '90px' ) );
	materialBumpMapRow.add( materialBumpMapEnabled );
	materialBumpMapRow.add( materialBumpMap );
	materialBumpMapRow.add( materialBumpScale );

	container.add( materialBumpMapRow );

	// normal map

	var materialNormalMapRow = new UI.Row();
	var materialNormalMapEnabled = new UI.Checkbox( false ).onChange( update );
	var materialNormalMap = new UI.Texture().onChange( update );

	materialNormalMapRow.add( new UI.Text( 'Normal Map' ).setWidth( '90px' ) );
	materialNormalMapRow.add( materialNormalMapEnabled );
	materialNormalMapRow.add( materialNormalMap );

	container.add( materialNormalMapRow );

	// displacement map

	var materialDisplacementMapRow = new UI.Row();
	var materialDisplacementMapEnabled = new UI.Checkbox( false ).onChange( update );
	var materialDisplacementMap = new UI.Texture().onChange( update );
	var materialDisplacementScale = new UI.Number( 1 ).setWidth( '30px' ).onChange( update );

	materialDisplacementMapRow.add( new UI.Text( 'Displace Map' ).setWidth( '90px' ) );
	materialDisplacementMapRow.add( materialDisplacementMapEnabled );
	materialDisplacementMapRow.add( materialDisplacementMap );
	materialDisplacementMapRow.add( materialDisplacementScale );

	container.add( materialDisplacementMapRow );

	// roughness map

	var materialRoughnessMapRow = new UI.Row();
	var materialRoughnessMapEnabled = new UI.Checkbox( false ).onChange( update );
	var materialRoughnessMap = new UI.Texture().onChange( update );

	materialRoughnessMapRow.add( new UI.Text( 'Rough. Map' ).setWidth( '90px' ) );
	materialRoughnessMapRow.add( materialRoughnessMapEnabled );
	materialRoughnessMapRow.add( materialRoughnessMap );

	container.add( materialRoughnessMapRow );

	// metalness map

	var materialMetalnessMapRow = new UI.Row();
	var materialMetalnessMapEnabled = new UI.Checkbox( false ).onChange( update );
	var materialMetalnessMap = new UI.Texture().onChange( update );

	materialMetalnessMapRow.add( new UI.Text( 'Metal. Map' ).setWidth( '90px' ) );
	materialMetalnessMapRow.add( materialMetalnessMapEnabled );
	materialMetalnessMapRow.add( materialMetalnessMap );

	container.add( materialMetalnessMapRow );

	// specular map

	var materialSpecularMapRow = new UI.Row();
	var materialSpecularMapEnabled = new UI.Checkbox( false ).onChange( update );
	var materialSpecularMap = new UI.Texture().onChange( update );

	materialSpecularMapRow.add( new UI.Text( 'Specular Map' ).setWidth( '90px' ) );
	materialSpecularMapRow.add( materialSpecularMapEnabled );
	materialSpecularMapRow.add( materialSpecularMap );

	container.add( materialSpecularMapRow );

	// env map

	var materialEnvMapRow = new UI.Row();
	var materialEnvMapEnabled = new UI.Checkbox( false ).onChange( update );
	var materialEnvMap = new UI.Texture( THREE.SphericalReflectionMapping ).onChange( update );
	var materialReflectivity = new UI.Number( 1 ).setWidth( '30px' ).onChange( update );

	materialEnvMapRow.add( new UI.Text( 'Env Map' ).setWidth( '90px' ) );
	materialEnvMapRow.add( materialEnvMapEnabled );
	materialEnvMapRow.add( materialEnvMap );
	materialEnvMapRow.add( materialReflectivity );

	container.add( materialEnvMapRow );

	// light map

	var materialLightMapRow = new UI.Row();
	var materialLightMapEnabled = new UI.Checkbox( false ).onChange( update );
	var materialLightMap = new UI.Texture().onChange( update );

	materialLightMapRow.add( new UI.Text( 'Light Map' ).setWidth( '90px' ) );
	materialLightMapRow.add( materialLightMapEnabled );
	materialLightMapRow.add( materialLightMap );

	container.add( materialLightMapRow );

	// ambient occlusion map

	var materialAOMapRow = new UI.Row();
	var materialAOMapEnabled = new UI.Checkbox( false ).onChange( update );
	var materialAOMap = new UI.Texture().onChange( update );
	var materialAOScale = new UI.Number( 1 ).setRange( 0, 1 ).setWidth( '30px' ).onChange( update );

	materialAOMapRow.add( new UI.Text( 'AO Map' ).setWidth( '90px' ) );
	materialAOMapRow.add( materialAOMapEnabled );
	materialAOMapRow.add( materialAOMap );
	materialAOMapRow.add( materialAOScale );

	container.add( materialAOMapRow );

	// emissive map

	var materialEmissiveMapRow = new UI.Row();
	var materialEmissiveMapEnabled = new UI.Checkbox( false ).onChange( update );
	var materialEmissiveMap = new UI.Texture().onChange( update );

	materialEmissiveMapRow.add( new UI.Text( 'Emissive Map' ).setWidth( '90px' ) );
	materialEmissiveMapRow.add( materialEmissiveMapEnabled );
	materialEmissiveMapRow.add( materialEmissiveMap );

	container.add( materialEmissiveMapRow );

	// side

	var materialSideRow = new UI.Row();
	var materialSide = new UI.Select().setOptions( {

		0: 'Front',
		1: 'Back',
		2: 'Double'

	} ).setWidth( '150px' ).setFontSize( '12px' ).onChange( update );

	materialSideRow.add( new UI.Text( 'Side' ).setWidth( '90px' ) );
	materialSideRow.add( materialSide );

	container.add( materialSideRow );

	// shading

	var materialShadingRow = new UI.Row();
	var materialShading = new UI.Select().setOptions( {

		0: 'No',
		1: 'Flat',
		2: 'Smooth'

	} ).setWidth( '150px' ).setFontSize( '12px' ).onChange( update );

	materialShadingRow.add( new UI.Text( 'Shading' ).setWidth( '90px' ) );
	materialShadingRow.add( materialShading );

	container.add( materialShadingRow );

	// blending

	var materialBlendingRow = new UI.Row();
	var materialBlending = new UI.Select().setOptions( {

		0: 'No',
		1: 'Normal',
		2: 'Additive',
		3: 'Subtractive',
		4: 'Multiply',
		5: 'Custom'

	} ).setWidth( '150px' ).setFontSize( '12px' ).onChange( update );

	materialBlendingRow.add( new UI.Text( 'Blending' ).setWidth( '90px' ) );
	materialBlendingRow.add( materialBlending );

	container.add( materialBlendingRow );

	// opacity

	var materialOpacityRow = new UI.Row();
	var materialOpacity = new UI.Number( 1 ).setWidth( '60px' ).setRange( 0, 1 ).onChange( update );

	materialOpacityRow.add( new UI.Text( 'Opacity' ).setWidth( '90px' ) );
	materialOpacityRow.add( materialOpacity );

	container.add( materialOpacityRow );

	// transparent

	var materialTransparentRow = new UI.Row();
	var materialTransparent = new UI.Checkbox().setLeft( '100px' ).onChange( update );

	materialTransparentRow.add( new UI.Text( 'Transparent' ).setWidth( '90px' ) );
	materialTransparentRow.add( materialTransparent );

	container.add( materialTransparentRow );

	// alpha test

	var materialAlphaTestRow = new UI.Row();
	var materialAlphaTest = new UI.Number().setWidth( '60px' ).setRange( 0, 1 ).onChange( update );

	materialAlphaTestRow.add( new UI.Text( 'Alpha Test' ).setWidth( '90px' ) );
	materialAlphaTestRow.add( materialAlphaTest );

	container.add( materialAlphaTestRow );

	// wireframe

	var materialWireframeRow = new UI.Row();
	var materialWireframe = new UI.Checkbox( false ).onChange( update );
	var materialWireframeLinewidth = new UI.Number( 1 ).setWidth( '60px' ).setRange( 0, 100 ).onChange( update );

	materialWireframeRow.add( new UI.Text( 'Wireframe' ).setWidth( '90px' ) );
	materialWireframeRow.add( materialWireframe );
	materialWireframeRow.add( materialWireframeLinewidth );

	container.add( materialWireframeRow );

	//

	function update() {

		var object = currentObject;

		var geometry = object.geometry;
		var material = object.material;

		var textureWarning = false;
		var objectHasUvs = false;

		if ( object instanceof THREE.Sprite ) objectHasUvs = true;
		if ( geometry instanceof THREE.Geometry && geometry.faceVertexUvs[ 0 ].length > 0 ) objectHasUvs = true;
		if ( geometry instanceof THREE.BufferGeometry && geometry.attributes.uv !== undefined ) objectHasUvs = true;

		if ( material ) {

			// if ( material.uuid !== undefined && material.uuid !== materialUUID.getValue() ) {

			// 	editor.execute( new SetMaterialValueCommand( currentObject, 'uuid', materialUUID.getValue() ) );

			// }

			if ( material instanceof THREE[ materialClass.getValue() ] === false ) {

				material = new THREE[ materialClass.getValue() ]();

				editor.execute( new SetMaterialCommand( currentObject, material ), 'New Material: ' + materialClass.getValue() );
				// TODO Copy other references in the scene graph
				// keeping name and UUID then.
				// Also there should be means to create a unique
				// copy for the current object explicitly and to
				// attach the current material to other objects.

			}

			if ( material.color !== undefined && material.color.getHex() !== materialColor.getHexValue() ) {

				editor.execute( new SetMaterialColorCommand( currentObject, 'color', materialColor.getHexValue() ) );

			}

			if ( material.roughness !== undefined && Math.abs( material.roughness - materialRoughness.getValue() ) >= 0.01 ) {

				editor.execute( new SetMaterialValueCommand( currentObject, 'roughness', materialRoughness.getValue() ) );

			}

			if ( material.metalness !== undefined && Math.abs( material.metalness - materialMetalness.getValue() ) >= 0.01 ) {

				editor.execute( new SetMaterialValueCommand( currentObject, 'metalness', materialMetalness.getValue() ) );

			}

			if ( material.emissive !== undefined && material.emissive.getHex() !== materialEmissive.getHexValue() ) {

				editor.execute( new SetMaterialColorCommand( currentObject, 'emissive', materialEmissive.getHexValue() ) );

			}

			if ( material.specular !== undefined && material.specular.getHex() !== materialSpecular.getHexValue() ) {

				editor.execute( new SetMaterialColorCommand( currentObject, 'specular', materialSpecular.getHexValue() ) );

			}

			if ( material.shininess !== undefined && Math.abs( material.shininess - materialShininess.getValue() ) >= 0.01 ) {

				editor.execute( new SetMaterialValueCommand( currentObject, 'shininess', materialShininess.getValue() ) );

			}

			if ( material.vertexColors !== undefined ) {

				var vertexColors = parseInt( materialVertexColors.getValue() );

				if ( material.vertexColors !== vertexColors ) {

					editor.execute( new SetMaterialValueCommand( currentObject, 'vertexColors', vertexColors ) );

				}

			}

			if ( material.skinning !== undefined && material.skinning !== materialSkinning.getValue() ) {

				editor.execute( new SetMaterialValueCommand( currentObject, 'skinning', materialSkinning.getValue() ) );

			}

			if ( material.map !== undefined ) {

				var mapEnabled = materialMapEnabled.getValue() === true;

				if ( objectHasUvs ) {

					var map = mapEnabled ? materialMap.getValue() : null;
					if ( material.map !== map ) {

						editor.execute( new SetMaterialMapCommand( currentObject, 'map', map ) );

					}

				} else {

					if ( mapEnabled ) textureWarning = true;

				}

			}

			if ( material.alphaMap !== undefined ) {

				var mapEnabled = materialAlphaMapEnabled.getValue() === true;

				if ( objectHasUvs ) {

					var alphaMap = mapEnabled ? materialAlphaMap.getValue() : null;
					if ( material.alphaMap !== alphaMap ) {

						editor.execute( new SetMaterialMapCommand( currentObject, 'alphaMap', alphaMap ) );

					}

				} else {

					if ( mapEnabled ) textureWarning = true;

				}

			}

			if ( material.bumpMap !== undefined ) {

				var bumpMapEnabled = materialBumpMapEnabled.getValue() === true;

				if ( objectHasUvs ) {

					var bumpMap = bumpMapEnabled ? materialBumpMap.getValue() : null;
					if ( material.bumpMap !== bumpMap ) {

						editor.execute( new SetMaterialMapCommand( currentObject, 'bumpMap', bumpMap ) );

					}

					if ( material.bumpScale !== materialBumpScale.getValue() ) {

						editor.execute( new SetMaterialValueCommand( currentObject, 'bumpScale', materialBumpScale.getValue() ) );

					}

				} else {

					if ( bumpMapEnabled ) textureWarning = true;

				}

			}

			if ( material.normalMap !== undefined ) {

				var normalMapEnabled = materialNormalMapEnabled.getValue() === true;

				if ( objectHasUvs ) {

					var normalMap = normalMapEnabled ? materialNormalMap.getValue() : null;
					if ( material.normalMap !== normalMap ) {

						editor.execute( new SetMaterialMapCommand( currentObject, 'normalMap', normalMap ) );

					}

				} else {

					if ( normalMapEnabled ) textureWarning = true;

				}

			}

			if ( material.displacementMap !== undefined ) {

				var displacementMapEnabled = materialDisplacementMapEnabled.getValue() === true;

				if ( objectHasUvs ) {

					var displacementMap = displacementMapEnabled ? materialDisplacementMap.getValue() : null;
					if ( material.displacementMap !== displacementMap ) {

						editor.execute( new SetMaterialMapCommand( currentObject, 'displacementMap', displacementMap ) );

					}

					if ( material.displacementScale !== materialDisplacementScale.getValue() ) {

						editor.execute( new SetMaterialValueCommand( currentObject, 'displacementScale', materialDisplacementScale.getValue() ) );

					}

				} else {

					if ( displacementMapEnabled ) textureWarning = true;

				}

			}

			if ( material.roughnessMap !== undefined ) {

				var roughnessMapEnabled = materialRoughnessMapEnabled.getValue() === true;

				if ( objectHasUvs ) {

					var roughnessMap = roughnessMapEnabled ? materialRoughnessMap.getValue() : null;
					if ( material.roughnessMap !== roughnessMap ) {

						editor.execute( new SetMaterialMapCommand( currentObject, 'roughnessMap', roughnessMap ) );

					}

				} else {

					if ( roughnessMapEnabled ) textureWarning = true;

				}

			}

			if ( material.metalnessMap !== undefined ) {

				var metalnessMapEnabled = materialMetalnessMapEnabled.getValue() === true;

				if ( objectHasUvs ) {

					var metalnessMap = metalnessMapEnabled ? materialMetalnessMap.getValue() : null;
					if ( material.metalnessMap !== metalnessMap ) {

						editor.execute( new SetMaterialMapCommand( currentObject, 'metalnessMap', metalnessMap ) );

					}

				} else {

					if ( metalnessMapEnabled ) textureWarning = true;

				}

			}

			if ( material.specularMap !== undefined ) {

				var specularMapEnabled = materialSpecularMapEnabled.getValue() === true;

				if ( objectHasUvs ) {

					var specularMap = specularMapEnabled ? materialSpecularMap.getValue() : null;
					if ( material.specularMap !== specularMap ) {

						editor.execute( new SetMaterialMapCommand( currentObject, 'specularMap', specularMap ) );

					}

				} else {

					if ( specularMapEnabled ) textureWarning = true;

				}

			}

			if ( material.envMap !== undefined ) {

				var envMapEnabled = materialEnvMapEnabled.getValue() === true;

				var envMap = envMapEnabled ? materialEnvMap.getValue() : null;

				if ( material.envMap !== envMap ) {

					editor.execute( new SetMaterialMapCommand( currentObject, 'envMap', envMap ) );

				}

			}

			if ( material.reflectivity !== undefined ) {

				var reflectivity = materialReflectivity.getValue();

				if ( material.reflectivity !== reflectivity ) {

					editor.execute( new SetMaterialValueCommand( currentObject, 'reflectivity', reflectivity ) );

				}

			}

			if ( material.lightMap !== undefined ) {

				var lightMapEnabled = materialLightMapEnabled.getValue() === true;

				if ( objectHasUvs ) {

					var lightMap = lightMapEnabled ? materialLightMap.getValue() : null;
					if ( material.lightMap !== lightMap ) {

						editor.execute( new SetMaterialMapCommand( currentObject, 'lightMap', lightMap ) );

					}

				} else {

					if ( lightMapEnabled ) textureWarning = true;

				}

			}

			if ( material.aoMap !== undefined ) {

				var aoMapEnabled = materialAOMapEnabled.getValue() === true;

				if ( objectHasUvs ) {

					var aoMap = aoMapEnabled ? materialAOMap.getValue() : null;
					if ( material.aoMap !== aoMap ) {

						editor.execute( new SetMaterialMapCommand( currentObject, 'aoMap', aoMap ) );

					}

					if ( material.aoMapIntensity !== materialAOScale.getValue() ) {

						editor.execute( new SetMaterialValueCommand( currentObject, 'aoMapIntensity', materialAOScale.getValue() ) );

					}

				} else {

					if ( aoMapEnabled ) textureWarning = true;

				}

			}

			if ( material.emissiveMap !== undefined ) {

				var emissiveMapEnabled = materialEmissiveMapEnabled.getValue() === true;

				if ( objectHasUvs ) {

					var emissiveMap = emissiveMapEnabled ? materialEmissiveMap.getValue() : null;
					if ( material.emissiveMap !== emissiveMap ) {

						editor.execute( new SetMaterialMapCommand( currentObject, 'emissiveMap', emissiveMap ) );

					}

				} else {

					if ( emissiveMapEnabled ) textureWarning = true;

				}

			}

			if ( material.side !== undefined ) {

				var side = parseInt( materialSide.getValue() );
				if ( material.side !== side ) {

					editor.execute( new SetMaterialValueCommand( currentObject, 'side', side ) );

				}


			}

			if ( material.shading !== undefined ) {

				var shading = parseInt( materialShading.getValue() );
				if ( material.shading !== shading ) {

					editor.execute( new SetMaterialValueCommand( currentObject, 'shading', shading ) );

				}

			}

			if ( material.blending !== undefined ) {

				var blending = parseInt( materialBlending.getValue() );
				if ( material.blending !== blending ) {

					editor.execute( new SetMaterialValueCommand( currentObject, 'blending', blending ) );

				}

			}

			if ( material.opacity !== undefined && Math.abs( material.opacity - materialOpacity.getValue() ) >= 0.01 ) {

				editor.execute( new SetMaterialValueCommand( currentObject, 'opacity', materialOpacity.getValue() ) );

			}

			if ( material.transparent !== undefined && material.transparent !== materialTransparent.getValue() ) {

				editor.execute( new SetMaterialValueCommand( currentObject, 'transparent', materialTransparent.getValue() ) );

			}

			if ( material.alphaTest !== undefined && Math.abs( material.alphaTest - materialAlphaTest.getValue() ) >= 0.01 ) {

				editor.execute( new SetMaterialValueCommand( currentObject, 'alphaTest', materialAlphaTest.getValue() ) );

			}

			if ( material.wireframe !== undefined && material.wireframe !== materialWireframe.getValue() ) {

				editor.execute( new SetMaterialValueCommand( currentObject, 'wireframe', materialWireframe.getValue() ) );

			}

			if ( material.wireframeLinewidth !== undefined && Math.abs( material.wireframeLinewidth - materialWireframeLinewidth.getValue() ) >= 0.01 ) {

				editor.execute( new SetMaterialValueCommand( currentObject, 'wireframeLinewidth', materialWireframeLinewidth.getValue() ) );

			}

		}

		if ( textureWarning ) {

			console.warn( "Can't set texture, model doesn't have texture coordinates" );

		}

	}

	//

	function setRowVisibility() {

		var properties = {
			'name': materialNameRow,
			'color': materialColorRow,
			'roughness': materialRoughnessRow,
			'metalness': materialMetalnessRow,
			'emissive': materialEmissiveRow,
			'specular': materialSpecularRow,
			'shininess': materialShininessRow,
			'vertexShader': materialProgramRow,
			'vertexColors': materialVertexColorsRow,
			'skinning': materialSkinningRow,
			'map': materialMapRow,
			'alphaMap': materialAlphaMapRow,
			'bumpMap': materialBumpMapRow,
			'normalMap': materialNormalMapRow,
			'displacementMap': materialDisplacementMapRow,
			'roughnessMap': materialRoughnessMapRow,
			'metalnessMap': materialMetalnessMapRow,
			'specularMap': materialSpecularMapRow,
			'envMap': materialEnvMapRow,
			'lightMap': materialLightMapRow,
			'aoMap': materialAOMapRow,
			'emissiveMap': materialEmissiveMapRow,
			'side': materialSideRow,
			'shading': materialShadingRow,
			'blending': materialBlendingRow,
			'opacity': materialOpacityRow,
			'transparent': materialTransparentRow,
			'alphaTest': materialAlphaTestRow,
			'wireframe': materialWireframeRow
		};

		var material = currentObject.material;

		for ( var property in properties ) {

			properties[ property ].setDisplay( material[ property ] !== undefined ? '' : 'none' );

		}

	}


	function refreshUI( resetTextureSelectors ) {

		if ( ! currentObject ) return;

		var material = currentObject.material;

		// if ( material.uuid !== undefined ) {

		// 	materialUUID.setValue( material.uuid );

		// }

		if ( material.name !== undefined ) {

			materialName.setValue( material.name );

		}

		materialClass.setValue( material.type );

		if ( material.color !== undefined ) {

			materialColor.setHexValue( material.color.getHexString() );

		}

		if ( material.roughness !== undefined ) {

			materialRoughness.setValue( material.roughness );

		}

		if ( material.metalness !== undefined ) {

			materialMetalness.setValue( material.metalness );

		}

		if ( material.emissive !== undefined ) {

			materialEmissive.setHexValue( material.emissive.getHexString() );

		}

		if ( material.specular !== undefined ) {

			materialSpecular.setHexValue( material.specular.getHexString() );

		}

		if ( material.shininess !== undefined ) {

			materialShininess.setValue( material.shininess );

		}

		if ( material.vertexColors !== undefined ) {

			materialVertexColors.setValue( material.vertexColors );

		}

		if ( material.skinning !== undefined ) {

			materialSkinning.setValue( material.skinning );

		}

		if ( material.map !== undefined ) {

			materialMapEnabled.setValue( material.map !== null );

			if ( material.map !== null || resetTextureSelectors ) {

				materialMap.setValue( material.map );

			}

		}

		if ( material.alphaMap !== undefined ) {

			materialAlphaMapEnabled.setValue( material.alphaMap !== null );

			if ( material.alphaMap !== null || resetTextureSelectors ) {

				materialAlphaMap.setValue( material.alphaMap );

			}

		}

		if ( material.bumpMap !== undefined ) {

			materialBumpMapEnabled.setValue( material.bumpMap !== null );

			if ( material.bumpMap !== null || resetTextureSelectors ) {

				materialBumpMap.setValue( material.bumpMap );

			}

			materialBumpScale.setValue( material.bumpScale );

		}

		if ( material.normalMap !== undefined ) {

			materialNormalMapEnabled.setValue( material.normalMap !== null );

			if ( material.normalMap !== null || resetTextureSelectors ) {

				materialNormalMap.setValue( material.normalMap );

			}

		}

		if ( material.displacementMap !== undefined ) {

			materialDisplacementMapEnabled.setValue( material.displacementMap !== null );

			if ( material.displacementMap !== null || resetTextureSelectors ) {

				materialDisplacementMap.setValue( material.displacementMap );

			}

			materialDisplacementScale.setValue( material.displacementScale );

		}

		if ( material.roughnessMap !== undefined ) {

			materialRoughnessMapEnabled.setValue( material.roughnessMap !== null );

			if ( material.roughnessMap !== null || resetTextureSelectors ) {

				materialRoughnessMap.setValue( material.roughnessMap );

			}

		}

		if ( material.metalnessMap !== undefined ) {

			materialMetalnessMapEnabled.setValue( material.metalnessMap !== null );

			if ( material.metalnessMap !== null || resetTextureSelectors ) {

				materialMetalnessMap.setValue( material.metalnessMap );

			}

		}

		if ( material.specularMap !== undefined ) {

			materialSpecularMapEnabled.setValue( material.specularMap !== null );

			if ( material.specularMap !== null || resetTextureSelectors ) {

				materialSpecularMap.setValue( material.specularMap );

			}

		}

		if ( material.envMap !== undefined ) {

			materialEnvMapEnabled.setValue( material.envMap !== null );

			if ( material.envMap !== null || resetTextureSelectors ) {

				materialEnvMap.setValue( material.envMap );

			}

		}

		if ( material.reflectivity !== undefined ) {

			materialReflectivity.setValue( material.reflectivity );

		}

		if ( material.lightMap !== undefined ) {

			materialLightMapEnabled.setValue( material.lightMap !== null );

			if ( material.lightMap !== null || resetTextureSelectors ) {

				materialLightMap.setValue( material.lightMap );

			}

		}

		if ( material.aoMap !== undefined ) {

			materialAOMapEnabled.setValue( material.aoMap !== null );

			if ( material.aoMap !== null || resetTextureSelectors ) {

				materialAOMap.setValue( material.aoMap );

			}

			materialAOScale.setValue( material.aoMapIntensity );

		}

		if ( material.emissiveMap !== undefined ) {

			materialEmissiveMapEnabled.setValue( material.emissiveMap !== null );

			if ( material.emissiveMap !== null || resetTextureSelectors ) {

				materialEmissiveMap.setValue( material.emissiveMap );

			}

		}

		if ( material.side !== undefined ) {

			materialSide.setValue( material.side );

		}

		if ( material.shading !== undefined ) {

			materialShading.setValue( material.shading );

		}

		if ( material.blending !== undefined ) {

			materialBlending.setValue( material.blending );

		}

		if ( material.opacity !== undefined ) {

			materialOpacity.setValue( material.opacity );

		}

		if ( material.transparent !== undefined ) {

			materialTransparent.setValue( material.transparent );

		}

		if ( material.alphaTest !== undefined ) {

			materialAlphaTest.setValue( material.alphaTest );

		}

		if ( material.wireframe !== undefined ) {

			materialWireframe.setValue( material.wireframe );

		}

		if ( material.wireframeLinewidth !== undefined ) {

			materialWireframeLinewidth.setValue( material.wireframeLinewidth );

		}

		setRowVisibility();

	}

	// events

	signals.objectSelected.add( function ( object ) {

		if ( object && object.material ) {

			var objectChanged = object !== currentObject;

			currentObject = object;
			refreshUI( objectChanged );
			container.setDisplay( '' );

		} else {

			currentObject = null;
			container.setDisplay( 'none' );

		}

	} );

	signals.materialChanged.add( function () {

		refreshUI();

	} );

	return container;

};

// File:editor/js/Sidebar.Animation.js

/**
 * @author mrdoob / http://mrdoob.com/
 */

Sidebar.Animation = function ( editor ) {

	var signals = editor.signals;

	var options = {};
	var possibleAnimations = {};

	var container = new UI.CollapsiblePanel();
	container.setCollapsed( editor.config.getKey( 'ui/sidebar/animation/collapsed' ) );
	container.onCollapsedChange( function ( boolean ) {

		editor.config.setKey( 'ui/sidebar/animation/collapsed', boolean );

	} );
	container.setDisplay( 'none' );

	container.addStatic( new UI.Text( 'Animation' ).setTextTransform( 'uppercase' ) );
	container.add( new UI.Break() );

	var animationsRow = new UI.Row();
	container.add( animationsRow );

	/*

	var animations = {};

	signals.objectAdded.add( function ( object ) {

		object.traverse( function ( child ) {

			if ( child instanceof THREE.SkinnedMesh ) {

				var material = child.material;

				if ( material instanceof THREE.MultiMaterial ) {

					for ( var i = 0; i < material.materials.length; i ++ ) {

						material.materials[ i ].skinning = true;

					}

				} else {

					child.material.skinning = true;

				}

				animations[ child.id ] = new THREE.Animation( child, child.geometry.animation );

			} else if ( child instanceof THREE.MorphAnimMesh ) {

				var animation = new THREE.MorphAnimation( child );
				animation.duration = 30;

				// temporal hack for THREE.AnimationHandler
				animation._play = animation.play;
				animation.play = function () {
					this._play();
					THREE.AnimationHandler.play( this );
				};
				animation.resetBlendWeights = function () {};
				animation.stop = function () {
					this.pause();
					THREE.AnimationHandler.stop( this );
				};

				animations[ child.id ] = animation;

			}

		} );

	} );

	signals.objectSelected.add( function ( object ) {

		container.setDisplay( 'none' );

		if ( object instanceof THREE.SkinnedMesh || object instanceof THREE.MorphAnimMesh ) {

			animationsRow.clear();

			var animation = animations[ object.id ];

			var playButton = new UI.Button( 'Play' ).onClick( function () {

				animation.play();

			} );
			animationsRow.add( playButton );

			var pauseButton = new UI.Button( 'Stop' ).onClick( function () {

				animation.stop();

			} );
			animationsRow.add( pauseButton );

			container.setDisplay( 'block' );

		}

	} );

	*/

	return container;

}

// File:editor/js/Sidebar.Script.js

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

					var name = new UI.Input( script.name ).setWidth( '130px' ).setFontSize( '12px' );
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

// File:editor/js/Sidebar.History.js

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

// File:editor/js/Toolbar.js

/**
 * @author mrdoob / http://mrdoob.com/
 */

var Toolbar = function ( editor ) {

	var signals = editor.signals;

	var container = new UI.Panel();
	container.setId( 'toolbar' );

	var buttons = new UI.Panel();
	container.add( buttons );

	// translate / rotate / scale

	var translate = new UI.Button( 'translate' ).onClick( function () {

		signals.transformModeChanged.dispatch( 'translate' );

	} );
	buttons.add( translate );

	var rotate = new UI.Button( 'rotate' ).onClick( function () {

		signals.transformModeChanged.dispatch( 'rotate' );

	} );
	buttons.add( rotate );

	var scale = new UI.Button( 'scale' ).onClick( function () {

		signals.transformModeChanged.dispatch( 'scale' );

	} );
	buttons.add( scale );

	// grid

	var grid = new UI.Number( 25 ).setWidth( '40px' ).onChange( update );
	buttons.add( new UI.Text( 'grid: ' ) );
	buttons.add( grid );

	var snap = new UI.THREE.Boolean( false, 'snap' ).onChange( update );
	buttons.add( snap );

	var local = new UI.THREE.Boolean( false, 'local' ).onChange( update );
	buttons.add( local );

	var showGrid = new UI.THREE.Boolean( true, 'show' ).onChange( update );
	buttons.add( showGrid );

	var showMan = new UI.Checkbox().onChange( update ).setValue( true );
	buttons.add( showMan );
	buttons.add( new UI.Text( 'Dummy' ) );

	function update() {

		signals.snapChanged.dispatch( snap.getValue() === true ? grid.getValue() : null );
		signals.spaceChanged.dispatch( local.getValue() === true ? "local" : "world" );
		signals.showGridChanged.dispatch( showGrid.getValue() );
		signals.showManChanged.dispatch( showMan.getValue() );

	}

	return container;

}

// File:editor/js/Viewport.js

/**
 * @author mrdoob / http://mrdoob.com/
 */

var Viewport = function ( editor ) {

	var signals = editor.signals;

	var container = new UI.Panel();
	container.setId( 'viewport' );
	container.setPosition( 'absolute' );

	container.add( new Viewport.Info( editor ) );

	//

	var renderer = null;

	var camera = editor.camera;
	var scene = editor.scene;
	var sceneHelpers = editor.sceneHelpers;

	var objects = [];

	//

	var vrEffect, vrControls;

	// if ( WEBVR.isAvailable() === true ) {

	// 	var vrCamera = new THREE.PerspectiveCamera();
	// 	vrCamera.projectionMatrix = camera.projectionMatrix;
	// 	camera.add( vrCamera );

	// }

	// helpers



	//

	var camera = editor.camera;
	// var perspCam = true;	

	//

	var renderer = null;

	//

	// instantiate a loader
	var loader = new THREE.JSONLoader();
	var tex_loader = new THREE.TextureLoader();
	var humanMap = tex_loader.load(DUMMY_TEX);
	var vrHuman;

	// load a resource
	loader.load(
		// resource URL
		DUMMY,
		// '3D/dummy.json',
		// Function when resource is loaded
		function ( geometry, materials ) {
			vrHuman = new THREE.Mesh( geometry, new THREE.MeshBasicMaterial( { map: humanMap, side : THREE.DoubleSide}));
			sceneHelpers.add( vrHuman );
			vrHuman.scale.set(1,1,1);
			// vrHuman.rotation.set(0,3.14,0);
		}

	);

	var box = new THREE.Box3();

	var selectionBox = new THREE.BoxHelper();
	selectionBox.material.depthTest = false;
	selectionBox.material.transparent = true;
	selectionBox.visible = false;
	sceneHelpers.add( selectionBox );

	var grid = new THREE.GridHelper( 30, 60 );
	sceneHelpers.add( grid );

	var objectPositionOnDown = null;
	var objectRotationOnDown = null;
	var objectScaleOnDown = null;

	var transformControls = new THREE.TransformControls( camera, container.dom );
	transformControls.addEventListener( 'change', function () {

		var object = transformControls.object;

		if ( object !== undefined ) {

			selectionBox.update( object );

			if ( editor.helpers[ object.id ] !== undefined ) {

				editor.helpers[ object.id ].update();

			}

			signals.refreshSidebarObject3D.dispatch( object );

		}

		render();

	} );
	transformControls.addEventListener( 'mouseDown', function () {

		var object = transformControls.object;

		objectPositionOnDown = object.position.clone();
		objectRotationOnDown = object.rotation.clone();
		objectScaleOnDown = object.scale.clone();

		controls.enabled = false;

	} );

	transformControls.addEventListener( 'mouseUp', function () {

		var object = transformControls.object;

		if ( object !== undefined ) {

			switch ( transformControls.getMode() ) {

				case 'translate':

					if ( ! objectPositionOnDown.equals( object.position ) ) {

						editor.execute( new SetPositionCommand( object, object.position, objectPositionOnDown ) );

					}

					break;

				case 'rotate':

					if ( ! objectRotationOnDown.equals( object.rotation ) ) {

						editor.execute( new SetRotationCommand( object, object.rotation, objectRotationOnDown ) );

					}

					break;

				case 'scale':

					if ( ! objectScaleOnDown.equals( object.scale ) ) {

						editor.execute( new SetScaleCommand( object, object.scale, objectScaleOnDown ) );

					}

					break;

			}

		}

		controls.enabled = true;

	} );

	sceneHelpers.add( transformControls );

	// fog

	var oldFogType = "None";
	var oldFogColor = 0xaaaaaa;
	var oldFogNear = 1;
	var oldFogFar = 5000;
	var oldFogDensity = 0.00025;

	// object picking

	var raycaster = new THREE.Raycaster();
	var mouse = new THREE.Vector2();

	// events

	function getIntersects( point, objects ) {

		mouse.set( ( point.x * 2 ) - 1, - ( point.y * 2 ) + 1 );

		// var usedCam = (camera.inPerspectiveMode) ? camera.cameraP : camera.cameraO;

		raycaster.setFromCamera( mouse, camera );

		return raycaster.intersectObjects( objects );

	}

	var onDownPosition = new THREE.Vector2();
	var onUpPosition = new THREE.Vector2();
	var onDoubleClickPosition = new THREE.Vector2();

	function getMousePosition( dom, x, y ) {

		var rect = dom.getBoundingClientRect();
		return [ ( x - rect.left ) / rect.width, ( y - rect.top ) / rect.height ];

	}

	function handleClick() {

		if ( onDownPosition.distanceTo( onUpPosition ) === 0 ) {

			var intersects = getIntersects( onUpPosition, objects );

			if ( intersects.length > 0 ) {

				var object = intersects[ 0 ].object;

				if ( object.userData.object !== undefined ) {

					// helper

					editor.select( object.userData.object );

				} else {

					editor.select( object );

				}

			} else {

				editor.select( null );

			}

			render();

		}

	}

	function onMouseDown( event ) {

		event.preventDefault();

		var array = getMousePosition( container.dom, event.clientX, event.clientY );
		onDownPosition.fromArray( array );

		document.addEventListener( 'mouseup', onMouseUp, false );

	}

	function onMouseUp( event ) {

		var array = getMousePosition( container.dom, event.clientX, event.clientY );
		onUpPosition.fromArray( array );

		handleClick();

		document.removeEventListener( 'mouseup', onMouseUp, false );

	}

	function onTouchStart( event ) {

		var touch = event.changedTouches[ 0 ];

		var array = getMousePosition( container.dom, touch.clientX, touch.clientY );
		onDownPosition.fromArray( array );

		document.addEventListener( 'touchend', onTouchEnd, false );

	}

	function onTouchEnd( event ) {

		var touch = event.changedTouches[ 0 ];

		var array = getMousePosition( container.dom, touch.clientX, touch.clientY );
		onUpPosition.fromArray( array );

		handleClick();

		document.removeEventListener( 'touchend', onTouchEnd, false );

	}

	function onDoubleClick( event ) {

		var array = getMousePosition( container.dom, event.clientX, event.clientY );
		onDoubleClickPosition.fromArray( array );

		var intersects = getIntersects( onDoubleClickPosition, objects );

		if ( intersects.length > 0 ) {

			var intersect = intersects[ 0 ];

			signals.objectFocused.dispatch( intersect.object );

		}

	}

	container.dom.addEventListener( 'mousedown', onMouseDown, false );
	container.dom.addEventListener( 'touchstart', onTouchStart, false );
	container.dom.addEventListener( 'dblclick', onDoubleClick, false );

	// controls need to be added *after* main logic,
	// otherwise controls.enabled doesn't work.

	var controls = new THREE.EditorControls( camera, container.dom );
	controls.addEventListener( 'change', function () {

		transformControls.update();
		signals.cameraChanged.dispatch( camera );

	} );

	// signals

	signals.editorCleared.add( function () {

		controls.center.set( 0, 0, 0 );
		render();

	} );

	signals.enterVR.add( function () {

		vrEffect.isPresenting ? vrEffect.exitPresent() : vrEffect.requestPresent();

	} );

	var clearColor;

	signals.themeChanged.add( function ( value ) {

		// grid.setColors( 0x444444, 0x888888 );
		sceneHelpers.remove( grid );
		grid = new THREE.GridHelper( 30, 60, 0x444444, 0x888888 );
		sceneHelpers.add( grid );
		clearColor = 0xaaaaaa;

		/*
		 switch ( value ) {

			case 'css/light.css':
				sceneHelpers.remove( grid );
				grid = new THREE.GridHelper( 30, 60, 0x444444, 0x888888 );
				sceneHelpers.add( grid );
				clearColor = 0xaaaaaa;
				break;
			case 'css/dark.css':
				sceneHelpers.remove( grid );
				grid = new THREE.GridHelper( 30, 60, 0xbbbbbb, 0x888888 );
				sceneHelpers.add( grid );
				clearColor = 0x333333;
				break;

		}
		*/

		renderer.setClearColor( clearColor );

		render();

	} );

	signals.switchCameraMode.add( function () {

		var position = camera.position;

		var distance = THREE.Vector3();


		if (camera instanceof THREE.PerspectiveCamera) {
            camera = new THREE.OrthographicCamera(window.innerWidth / -16, window.innerWidth / 16, window.innerHeight / 16, window.innerHeight / -16, -200, 10000);

        } else {
            camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 0.1, 10000);

        }

      	camera.position.x = position.x;
        camera.position.y = position.y;
        camera.position.z = position.z;

       
        controls.controler = camera; // update
        transformControls.controler = camera; // update

        // controls.zoom(0);
        if(editor.selected != undefined)
        	editor.focus(editor.selected);
		// render();

	} );

	signals.cameraPositionSnap.add( function ( mode ) {

		//Needs Update to work without selected object
		var distance = camera.position.length();
		var newPos;

		console.log(distance);

		if(editor.selected)
			distance = editor.selected.position.distanceTo(camera.position);

		switch(mode){

			case "top" :
				newPos = new THREE.Vector3(0, distance, 0);
			break;

			case "bottom" :
				newPos = new THREE.Vector3(0, -distance, 0);
			break;

			case "left" :
				newPos = new THREE.Vector3(distance, 0, 0);
			break;

			case "right" :
				newPos = new THREE.Vector3(-distance, 0, 0);
			break;

			case "front" :
				newPos = new THREE.Vector3(0, 0, -distance);
			break;

			case "back" :
				newPos = new THREE.Vector3(0, 0, distance);
			break;

		}
		
		if(editor.selected){

			camera.position.set(newPos.x + editor.selected.position.x, 
				newPos.y + editor.selected.position.y, 
				newPos.z + editor.selected.position.z);

			controls.focus(editor.selected);

		}
		else
		{

			// console.log(newPos);
			// controls.center.set( 0, 0, 0 );
			// controls.focus
			// render();
			camera.position.set(newPos.x,  
				newPos.y, 
				newPos.z);

			controls.focus(editor.scene);
		}

		signals.cameraChanged.dispatch( camera );

	} );

	signals.transformModeChanged.add( function ( mode ) {

		transformControls.setMode( mode );

	} );

	signals.snapChanged.add( function ( dist ) {

		transformControls.setTranslationSnap( dist );

	} );

	signals.spaceChanged.add( function ( space ) {

		transformControls.setSpace( space );

	} );

	signals.rendererChanged.add( function ( newRenderer ) {

		if ( renderer !== null ) {

			container.dom.removeChild( renderer.domElement );

		}

		renderer = newRenderer;
		editor.renderer = renderer;

		renderer.autoClear = false;
		renderer.autoUpdateScene = false;
		renderer.setClearColor( clearColor );
		renderer.setPixelRatio( window.devicePixelRatio );
		renderer.setSize( container.dom.offsetWidth, container.dom.offsetHeight );

		container.dom.appendChild( renderer.domElement );

		// if ( WEBVR.isAvailable() === true ) {

		// 	vrControls = new THREE.VRControls( vrCamera );
		// 	vrEffect = new THREE.VREffect( renderer );

		// 	window.addEventListener( 'vrdisplaypresentchange', function ( event ) {

		// 		effect.isPresenting ? signals.enteredVR.dispatch() : signals.exitedVR.dispatch();

		// 	}, false );

		// }

		render();


	} );

	signals.sceneGraphChanged.add( function () {

		render();

	} );

	var saveTimeout;

	signals.cameraChanged.add( function () {

		render();

	} );

	signals.objectSelected.add( function ( object ) {

		selectionBox.visible = false;
		transformControls.detach();

		if ( object !== null ) {

			box.setFromObject( object );

			if ( box.isEmpty() === false ) {

				selectionBox.update( box );
				selectionBox.visible = true;

			}

			transformControls.attach( object );

		}

		render();

	} );

	signals.objectFocused.add( function ( object ) {

		controls.focus( object );

	} );

	signals.geometryChanged.add( function ( object ) {

		if ( object !== undefined ) {

			selectionBox.update( object );

		}

		render();

	} );

	signals.objectAdded.add( function ( object ) {

		object.traverse( function ( child ) {

			objects.push( child );

		} );

	} );

	signals.objectChanged.add( function ( object ) {

		if ( editor.selected === object ) {

			selectionBox.update( object );
			transformControls.update();

		}

		if ( object instanceof THREE.PerspectiveCamera ) {

			object.updateProjectionMatrix();

		}

		if ( editor.helpers[ object.id ] !== undefined ) {

			editor.helpers[ object.id ].update();

		}

		render();

	} );

	signals.objectRemoved.add( function ( object ) {

		object.traverse( function ( child ) {

			objects.splice( objects.indexOf( child ), 1 );

		} );

	} );

	signals.helperAdded.add( function ( object ) {

		objects.push( object.getObjectByName( 'picker' ) );

	} );

	signals.helperRemoved.add( function ( object ) {

		objects.splice( objects.indexOf( object.getObjectByName( 'picker' ) ), 1 );

	} );

	signals.materialChanged.add( function ( material ) {

		render();

	} );

	//@elephantatwork, changeable bgColor
	signals.bgColorChanged.add(function ( bgColor ) {

		renderer.setClearColor( bgColor, 1 );
		editor.config.setKey( 'backgroundColor', bgColor);

		render();

	} );

	signals.fogTypeChanged.add( function ( fogType ) {


		if ( fogType !== oldFogType ) {

			if ( fogType === "None" ) {

				scene.fog = null;

			} else if ( fogType === "Fog" ) {

				scene.fog = new THREE.Fog( oldFogColor, oldFogNear, oldFogFar );

			} else if ( fogType === "FogExp2" ) {

				scene.fog = new THREE.FogExp2( oldFogColor, oldFogDensity );

			}

			oldFogType = fogType;

		}

		render();

	} );

	signals.fogColorChanged.add( function ( fogColor ) {

		oldFogColor = fogColor;

		editor.config.setKey( 'fogColor', fogColor);


		updateFog( scene );

		render();

	} );

	signals.fogParametersChanged.add( function ( near, far, density ) {

		oldFogNear = near;
		oldFogFar = far;
		oldFogDensity = density;

		updateFog( scene );

		render();

	} );

	signals.windowResize.add( function () {

		camera.aspect = container.dom.offsetWidth / container.dom.offsetHeight;
		camera.updateProjectionMatrix();

		renderer.setSize( container.dom.offsetWidth, container.dom.offsetHeight );

		render();

	} );

	signals.showGridChanged.add( function ( showGrid ) {

		grid.visible = showGrid;
		console.log(grid);
		render();

	} );

	signals.showManChanged.add( function ( showMan ) {

		vrHuman.visible = showMan;
		render();

	} );

	function updateFog( root ) {

		if ( root.fog ) {

			root.fog.color.setHex( oldFogColor );

			if ( root.fog.near !== undefined ) root.fog.near = oldFogNear;
			if ( root.fog.far !== undefined ) root.fog.far = oldFogFar;
			if ( root.fog.density !== undefined ) root.fog.density = oldFogDensity;

		}

	}

	var lastTimeMsec = null;

	function animate( now ) {

		requestAnimationFrame( animate );

		// call each update function
		lastTimeMsec	= lastTimeMsec || now-1000/60;
		var delta	= Math.min(200, now - lastTimeMsec);
		lastTimeMsec	= now;
		// call each update function
		editor.RenderFcts.forEach(function( _function ){
			_function(delta/1000, now/1000);
			render();
		
		})
		
		/*

		// animations

		if ( THREE.AnimationHandler.animations.length > 0 ) {

			THREE.AnimationHandler.update( 0.016 );

			for ( var i = 0, l = sceneHelpers.children.length; i < l; i ++ ) {

				var helper = sceneHelpers.children[ i ];

				if ( helper instanceof THREE.SkeletonHelper ) {

					helper.update();

				}

			}

		}
		*/

		if ( vrEffect && vrEffect.isPresenting ) {

			render();

		}

		render();


	}

	function render() {

		sceneHelpers.updateMatrixWorld();
		scene.updateMatrixWorld();

		if ( vrEffect && vrEffect.isPresenting ) {

			vrControls.update();

			camera.updateMatrixWorld();
			renderer.clear();

			vrEffect.render( scene, vrCamera );
			vrEffect.render( sceneHelpers, vrCamera );

		} else {

			renderer.clear();
			renderer.render( scene, camera );

			// console.log(camera);

			if ( renderer instanceof THREE.RaytracingRenderer === false ) {

				renderer.render( sceneHelpers, camera );

			}

		}


	}

	requestAnimationFrame( animate );

	return container;

};

// File:editor/js/Viewport.Info.js

/**
 * @author mrdoob / http://mrdoob.com/
 */

Viewport.Info = function ( editor ) {

	var signals = editor.signals;

	var container = new UI.Panel();
	container.setId( 'info' );
	container.setPosition( 'absolute' );
	container.setLeft( '10px' );
	container.setBottom( '10px' );
	container.setFontSize( '12px' );
	container.setColor( '#fff' );

	var objectsText = new UI.Text( '0' ).setMarginLeft( '6px' );
	var verticesText = new UI.Text( '0' ).setMarginLeft( '6px' );
	var trianglesText = new UI.Text( '0' ).setMarginLeft( '6px' );

	container.add( new UI.Text( 'objects' ), objectsText, new UI.Break() );
	container.add( new UI.Text( 'vertices' ), verticesText, new UI.Break() );
	container.add( new UI.Text( 'triangles' ), trianglesText, new UI.Break() );

	signals.objectAdded.add( update );
	signals.objectRemoved.add( update );
	signals.geometryChanged.add( update );

	//

	function update() {

		var scene = editor.scene;

		var objects = 0, vertices = 0, triangles = 0;

		for ( var i = 0, l = scene.children.length; i < l; i ++ ) {

			var object = scene.children[ i ];

			object.traverseVisible( function ( object ) {

				objects ++;

				if ( object instanceof THREE.Mesh ) {

					var geometry = object.geometry;

					if ( geometry instanceof THREE.Geometry ) {

						vertices += geometry.vertices.length;
						triangles += geometry.faces.length;

					} else if ( geometry instanceof THREE.BufferGeometry ) {

						if ( geometry.index !== null ) {

							vertices += geometry.index.count * 3;
							triangles += geometry.index.count;

						} else {

							vertices += geometry.attributes.position.count;
							triangles += geometry.attributes.position.count / 3;

						}

					}

				}

			} );

		}

		objectsText.setValue( objects.format() );
		verticesText.setValue( vertices.format() );
		trianglesText.setValue( triangles.format() );

	}

	return container;

}

// File:editor/js/Command.js

/**
 * @author dforrer / https://github.com/dforrer
 * Developed as part of a project at University of Applied Sciences and Arts Northwestern Switzerland (www.fhnw.ch)
 */

/**
 * @param editorRef pointer to main editor object used to initialize
 *        each command object with a reference to the editor
 * @constructor
 */

var Command = function ( editorRef ) {

	this.id = - 1;
	this.inMemory = false;
	this.updatable = false;
	this.type = '';
	this.name = '';

	if ( editorRef !== undefined ) {

		Command.editor = editorRef;

	}
	this.editor = Command.editor;


};

Command.prototype.toJSON = function () {

	var output = {};
	output.type = this.type;
	output.id = this.id;
	output.name = this.name;
	return output;

};

Command.prototype.fromJSON = function ( json ) {

	this.inMemory = true;
	this.type = json.type;
	this.id = json.id;
	this.name = json.name;

};

// File:editor/js/commands/AddObjectCommand.js

/**
 * @author dforrer / https://github.com/dforrer
 * Developed as part of a project at University of Applied Sciences and Arts Northwestern Switzerland (www.fhnw.ch)
 */

/**
 * @param object THREE.Object3D
 * @constructor
 */

var AddObjectCommand = function ( object ) {

	Command.call( this );

	this.type = 'AddObjectCommand';

	this.object = object;
	if ( object !== undefined ) {

		this.name = 'Add Object: ' + object.name;

	}

};

AddObjectCommand.prototype = {

	execute: function () {

		console.log(this.object);
		this.editor.addObject( this.object );
		this.editor.select( this.object );

	},

	undo: function () {

		this.editor.removeObject( this.object );
		this.editor.deselect();

	},

	toJSON: function () {

		var output = Command.prototype.toJSON.call( this );
		output.object = this.object.toJSON();

		return output;

	},

	fromJSON: function ( json ) {

		Command.prototype.fromJSON.call( this, json );

		this.object = this.editor.objectByUuid( json.object.object.uuid );

		if ( this.object === undefined ) {

			var loader = new THREE.ObjectLoader();
			this.object = loader.parse( json.object );

		}

	}

};

// File:editor/js/commands/RemoveObjectCommand.js

/**
 * @author dforrer / https://github.com/dforrer
 * Developed as part of a project at University of Applied Sciences and Arts Northwestern Switzerland (www.fhnw.ch)
 */

/**
 * @param object THREE.Object3D
 * @constructor
 */

var RemoveObjectCommand = function ( object ) {

	Command.call( this );

	this.type = 'RemoveObjectCommand';
	this.name = 'Remove Object';

	this.object = object;
	this.parent = ( object !== undefined ) ? object.parent : undefined;
	if ( this.parent !== undefined ) {

		this.index = this.parent.children.indexOf( this.object );

	}

};

RemoveObjectCommand.prototype = {

	execute: function () {

		var scope = this.editor;
		this.object.traverse( function ( child ) {

			scope.removeHelper( child );

		} );

		this.parent.remove( this.object );
		this.editor.select( this.parent );

		this.editor.signals.objectRemoved.dispatch( this.object );
		this.editor.signals.sceneGraphChanged.dispatch();

	},

	undo: function () {

		var scope = this.editor;

		this.object.traverse( function ( child ) {

			if ( child.geometry !== undefined ) scope.addGeometry( child.geometry );
			if ( child.material !== undefined ) scope.addMaterial( child.material );

			scope.addHelper( child );

		} );

		this.parent.children.splice( this.index, 0, this.object );
		this.object.parent = this.parent;
		this.editor.select( this.object );

		this.editor.signals.objectAdded.dispatch( this.object );
		this.editor.signals.sceneGraphChanged.dispatch();

	},

	toJSON: function () {

		var output = Command.prototype.toJSON.call( this );
		output.object = this.object.toJSON();
		output.index = this.index;
		output.parentUuid = this.parent.uuid;

		return output;

	},

	fromJSON: function ( json ) {

		Command.prototype.fromJSON.call( this, json );

		this.parent = this.editor.objectByUuid( json.parentUuid );
		if ( this.parent === undefined ) {

			this.parent = this.editor.scene;

		}

		this.index = json.index;

		this.object = this.editor.objectByUuid( json.object.object.uuid );
		if ( this.object === undefined ) {

			var loader = new THREE.ObjectLoader();
			this.object = loader.parse( json.object );

		}

	}

};

// File:editor/js/commands/MoveObjectCommand.js

/**
 * @author dforrer / https://github.com/dforrer
 * Developed as part of a project at University of Applied Sciences and Arts Northwestern Switzerland (www.fhnw.ch)
 */

/**
 * @param object THREE.Object3D
 * @param newParent THREE.Object3D
 * @param newBefore THREE.Object3D
 * @constructor
 */

var MoveObjectCommand = function ( object, newParent, newBefore ) {

	Command.call( this );

	this.type = 'MoveObjectCommand';
	this.name = 'Move Object';

	this.object = object;
	this.oldParent = ( object !== undefined ) ? object.parent : undefined;
	this.oldIndex = ( this.oldParent !== undefined ) ? this.oldParent.children.indexOf( this.object ) : undefined;
	this.newParent = newParent;

	if ( newBefore !== undefined ) {

		this.newIndex = ( newParent !== undefined ) ? newParent.children.indexOf( newBefore ) : undefined;

	} else {

		this.newIndex = ( newParent !== undefined ) ? newParent.children.length : undefined;

	}

	if ( this.oldParent === this.newParent && this.newIndex > this.oldIndex ) {

		this.newIndex --;

	}

	this.newBefore = newBefore;

};

MoveObjectCommand.prototype = {

	execute: function () {

		this.oldParent.remove( this.object );

		// console.log(this.)
		var children = this.newParent.children;
		children.splice( this.newIndex, 0, this.object );
		this.object.parent = this.newParent;

		this.editor.signals.sceneGraphChanged.dispatch();

	},

	undo: function () {

		this.newParent.remove( this.object );

		var children = this.oldParent.children;
		children.splice( this.oldIndex, 0, this.object );
		this.object.parent = this.oldParent;

		this.editor.signals.sceneGraphChanged.dispatch();

	},

	toJSON: function () {

		var output = Command.prototype.toJSON.call( this );

		output.objectUuid = this.object.uuid;
		output.newParentUuid = this.newParent.uuid;
		output.oldParentUuid = this.oldParent.uuid;
		output.newIndex = this.newIndex;
		output.oldIndex = this.oldIndex;

		return output;

	},

	fromJSON: function ( json ) {

		Command.prototype.fromJSON.call( this, json );

		this.object = this.editor.objectByUuid( json.objectUuid );
		this.oldParent = this.editor.objectByUuid( json.oldParentUuid );
		if ( this.oldParent === undefined ) {

			this.oldParent = this.editor.scene;

		}
		this.newParent = this.editor.objectByUuid( json.newParentUuid );
		if ( this.newParent === undefined ) {

			this.newParent = this.editor.scene;

		}
		this.newIndex = json.newIndex;
		this.oldIndex = json.oldIndex;

	}

};

// File:editor/js/commands/SetPositionCommand.js

/**
 * @author dforrer / https://github.com/dforrer
 * Developed as part of a project at University of Applied Sciences and Arts Northwestern Switzerland (www.fhnw.ch)
 */

/**
 * @param object THREE.Object3D
 * @param newPosition THREE.Vector3
 * @param optionalOldPosition THREE.Vector3
 * @constructor
 */

var SetPositionCommand = function ( object, newPosition, optionalOldPosition ) {

	Command.call( this );

	this.type = 'SetPositionCommand';
	this.name = 'Set Position';
	this.updatable = true;

	this.object = object;

	if ( object !== undefined && newPosition !== undefined ) {

		this.oldPosition = object.position.clone();
		this.newPosition = newPosition.clone();

	}

	if ( optionalOldPosition !== undefined ) {

		this.oldPosition = optionalOldPosition.clone();

	}

};
SetPositionCommand.prototype = {

	execute: function () {

		this.object.position.copy( this.newPosition );
		this.object.updateMatrixWorld( true );
		this.editor.signals.objectChanged.dispatch( this.object );

	},

	undo: function () {

		this.object.position.copy( this.oldPosition );
		this.object.updateMatrixWorld( true );
		this.editor.signals.objectChanged.dispatch( this.object );

	},

	update: function ( command ) {

		this.newPosition.copy( command.newPosition );

	},

	toJSON: function () {

		var output = Command.prototype.toJSON.call( this );

		output.objectUuid = this.object.uuid;
		output.oldPosition = this.oldPosition.toArray();
		output.newPosition = this.newPosition.toArray();

		return output;

	},

	fromJSON: function ( json ) {

		Command.prototype.fromJSON.call( this, json );

		this.object = this.editor.objectByUuid( json.objectUuid );
		this.oldPosition = new THREE.Vector3().fromArray( json.oldPosition );
		this.newPosition = new THREE.Vector3().fromArray( json.newPosition );

	}

};

// File:editor/js/commands/SetRotationCommand.js

/**
 * @author dforrer / https://github.com/dforrer
 * Developed as part of a project at University of Applied Sciences and Arts Northwestern Switzerland (www.fhnw.ch)
 */

/**
 * @param object THREE.Object3D
 * @param newRotation THREE.Euler
 * @param optionalOldRotation THREE.Euler
 * @constructor
 */

var SetRotationCommand = function ( object, newRotation, optionalOldRotation ) {

	Command.call( this );

	this.type = 'SetRotationCommand';
	this.name = 'Set Rotation';
	this.updatable = true;

	this.object = object;

	if ( object !== undefined && newRotation !== undefined ) {

		this.oldRotation = object.rotation.clone();
		this.newRotation = newRotation.clone();

	}

	if ( optionalOldRotation !== undefined ) {

		this.oldRotation = optionalOldRotation.clone();

	}

};

SetRotationCommand.prototype = {

	execute: function () {

		this.object.rotation.copy( this.newRotation );
		this.object.updateMatrixWorld( true );
		this.editor.signals.objectChanged.dispatch( this.object );

	},

	undo: function () {

		this.object.rotation.copy( this.oldRotation );
		this.object.updateMatrixWorld( true );
		this.editor.signals.objectChanged.dispatch( this.object );

	},

	update: function ( command ) {

		this.newRotation.copy( command.newRotation );

	},

	toJSON: function () {

		var output = Command.prototype.toJSON.call( this );

		output.objectUuid = this.object.uuid;
		output.oldRotation = this.oldRotation.toArray();
		output.newRotation = this.newRotation.toArray();

		return output;

	},

	fromJSON: function ( json ) {

		Command.prototype.fromJSON.call( this, json );

		this.object = this.editor.objectByUuid( json.objectUuid );
		this.oldRotation = new THREE.Euler().fromArray( json.oldRotation );
		this.newRotation = new THREE.Euler().fromArray( json.newRotation );

	}

};

// File:editor/js/commands/SetScaleCommand.js

/**
 * @author dforrer / https://github.com/dforrer
 * Developed as part of a project at University of Applied Sciences and Arts Northwestern Switzerland (www.fhnw.ch)
 */

/**
 * @param object THREE.Object3D
 * @param newScale THREE.Vector3
 * @param optionalOldScale THREE.Vector3
 * @constructor
 */

var SetScaleCommand = function ( object, newScale, optionalOldScale ) {

	Command.call( this );

	this.type = 'SetScaleCommand';
	this.name = 'Set Scale';
	this.updatable = true;

	this.object = object;

	if ( object !== undefined && newScale !== undefined ) {

		this.oldScale = object.scale.clone();
		this.newScale = newScale.clone();

	}

	if ( optionalOldScale !== undefined ) {

		this.oldScale = optionalOldScale.clone();

	}

};

SetScaleCommand.prototype = {

	execute: function () {

		this.object.scale.copy( this.newScale );
		this.object.updateMatrixWorld( true );
		this.editor.signals.objectChanged.dispatch( this.object );

	},

	undo: function () {

		this.object.scale.copy( this.oldScale );
		this.object.updateMatrixWorld( true );
		this.editor.signals.objectChanged.dispatch( this.object );

	},

	update: function ( command ) {

		this.newScale.copy( command.newScale );

	},

	toJSON: function () {

		var output = Command.prototype.toJSON.call( this );

		output.objectUuid = this.object.uuid;
		output.oldScale = this.oldScale.toArray();
		output.newScale = this.newScale.toArray();

		return output;

	},

	fromJSON: function ( json ) {

		Command.prototype.fromJSON.call( this, json );

		this.object = this.editor.objectByUuid( json.objectUuid );
		this.oldScale = new THREE.Vector3().fromArray( json.oldScale );
		this.newScale = new THREE.Vector3().fromArray( json.newScale );

	}

};

// File:editor/js/commands/SetValueCommand.js

/**
 * @author dforrer / https://github.com/dforrer
 * Developed as part of a project at University of Applied Sciences and Arts Northwestern Switzerland (www.fhnw.ch)
 */

/**
 * @param object THREE.Object3D
 * @param attributeName string
 * @param newValue number, string, boolean or object
 * @constructor
 */

var SetValueCommand = function ( object, attributeName, newValue ) {

	Command.call( this );

	this.type = 'SetValueCommand';
	this.name = 'Set ' + attributeName;
	this.updatable = true;

	this.object = object;
	this.attributeName = attributeName;
	this.oldValue = ( object !== undefined ) ? object[ attributeName ] : undefined;
	this.newValue = newValue;

};

SetValueCommand.prototype = {

	execute: function () {

		this.object[ this.attributeName ] = this.newValue;
		this.editor.signals.objectChanged.dispatch( this.object );
		this.editor.signals.sceneGraphChanged.dispatch();

	},

	undo: function () {

		this.object[ this.attributeName ] = this.oldValue;
		this.editor.signals.objectChanged.dispatch( this.object );
		this.editor.signals.sceneGraphChanged.dispatch();

	},

	update: function ( cmd ) {

		this.newValue = cmd.newValue;

	},

	toJSON: function () {

		var output = Command.prototype.toJSON.call( this );

		output.objectUuid = this.object.uuid;
		output.attributeName = this.attributeName;
		output.oldValue = this.oldValue;
		output.newValue = this.newValue;

		return output;

	},

	fromJSON: function ( json ) {

		Command.prototype.fromJSON.call( this, json );

		this.attributeName = json.attributeName;
		this.oldValue = json.oldValue;
		this.newValue = json.newValue;
		this.object = this.editor.objectByUuid( json.objectUuid );

	}

};

// File:editor/js/commands/SetUuidCommand.js

/**
 * @author dforrer / https://github.com/dforrer
 * Developed as part of a project at University of Applied Sciences and Arts Northwestern Switzerland (www.fhnw.ch)
 */

/**
 * @param object THREE.Object3D
 * @param newUuid string
 * @constructor
 */

var SetUuidCommand = function ( object, newUuid ) {

	Command.call( this );

	this.type = 'SetUuidCommand';
	this.name = 'Update UUID';

	this.object = object;

	this.oldUuid = ( object !== undefined ) ? object.uuid : undefined;
	this.newUuid = newUuid;

};

SetUuidCommand.prototype = {

	execute: function () {

		this.object.uuid = this.newUuid;
		this.editor.signals.objectChanged.dispatch( this.object );
		this.editor.signals.sceneGraphChanged.dispatch();

	},

	undo: function () {

		this.object.uuid = this.oldUuid;
		this.editor.signals.objectChanged.dispatch( this.object );
		this.editor.signals.sceneGraphChanged.dispatch();

	},

	toJSON: function () {

		var output = Command.prototype.toJSON.call( this );

		output.oldUuid = this.oldUuid;
		output.newUuid = this.newUuid;

		return output;

	},

	fromJSON: function ( json ) {

		Command.prototype.fromJSON.call( this, json );

		this.oldUuid = json.oldUuid;
		this.newUuid = json.newUuid;
		this.object = this.editor.objectByUuid( json.oldUuid );

		if ( this.object === undefined ) {

			this.object = this.editor.objectByUuid( json.newUuid );

		}

	}

};

// File:editor/js/commands/SetColorCommand.js

/**
 * @author dforrer / https://github.com/dforrer
 * Developed as part of a project at University of Applied Sciences and Arts Northwestern Switzerland (www.fhnw.ch)
 */

/**
 * @param object THREE.Object3D
 * @param attributeName string
 * @param newValue integer representing a hex color value
 * @constructor
 */

var SetColorCommand = function ( object, attributeName, newValue ) {

	Command.call( this );

	this.type = 'SetColorCommand';
	this.name = 'Set ' + attributeName;
	this.updatable = true;

	this.object = object;
	this.attributeName = attributeName;
	this.oldValue = ( object !== undefined ) ? this.object[ this.attributeName ].getHex() : undefined;
	this.newValue = newValue;

};

SetColorCommand.prototype = {

	execute: function () {

		this.object[ this.attributeName ].setHex( this.newValue );
		this.editor.signals.objectChanged.dispatch( this.object );

	},

	undo: function () {

		this.object[ this.attributeName ].setHex( this.oldValue );
		this.editor.signals.objectChanged.dispatch( this.object );

	},

	update: function ( cmd ) {

		this.newValue = cmd.newValue;

	},

	toJSON: function () {

		var output = Command.prototype.toJSON.call( this );

		output.objectUuid = this.object.uuid;
		output.attributeName = this.attributeName;
		output.oldValue = this.oldValue;
		output.newValue = this.newValue;

		return output;

	},

	fromJSON: function ( json ) {

		Command.prototype.fromJSON.call( this, json );

		this.object = this.editor.objectByUuid( json.objectUuid );
		this.attributeName = json.attributeName;
		this.oldValue = json.oldValue;
		this.newValue = json.newValue;

	}

};

// File:editor/js/commands/SetGeometryCommand.js

/**
 * @author dforrer / https://github.com/dforrer
 * Developed as part of a project at University of Applied Sciences and Arts Northwestern Switzerland (www.fhnw.ch)
 */

/**
 * @param object THREE.Object3D
 * @param newGeometry THREE.Geometry
 * @constructor
 */

var SetGeometryCommand = function ( object, newGeometry ) {

	Command.call( this );

	this.type = 'SetGeometryCommand';
	this.name = 'Set Geometry';
	this.updatable = true;

	this.object = object;
	this.oldGeometry = ( object !== undefined ) ? object.geometry : undefined;
	this.newGeometry = newGeometry;

};

SetGeometryCommand.prototype = {

	execute: function () {

		this.object.geometry.dispose();
		this.object.geometry = this.newGeometry;
		this.object.geometry.computeBoundingSphere();

		this.editor.signals.geometryChanged.dispatch( this.object );
		this.editor.signals.sceneGraphChanged.dispatch();

	},

	undo: function () {

		this.object.geometry.dispose();
		this.object.geometry = this.oldGeometry;
		this.object.geometry.computeBoundingSphere();

		this.editor.signals.geometryChanged.dispatch( this.object );
		this.editor.signals.sceneGraphChanged.dispatch();

	},

	update: function ( cmd ) {

		this.newGeometry = cmd.newGeometry;

	},

	toJSON: function () {

		var output = Command.prototype.toJSON.call( this );

		output.objectUuid = this.object.uuid;
		output.oldGeometry = this.object.geometry.toJSON();
		output.newGeometry = this.newGeometry.toJSON();

		return output;

	},

	fromJSON: function ( json ) {

		Command.prototype.fromJSON.call( this, json );

		this.object = this.editor.objectByUuid( json.objectUuid );

		this.oldGeometry = parseGeometry( json.oldGeometry );
		this.newGeometry = parseGeometry( json.newGeometry );

		function parseGeometry ( data ) {

			var loader = new THREE.ObjectLoader();
			return loader.parseGeometries( [ data ] )[ data.uuid ];

		}

	}

};

// File:editor/js/commands/SetGeometryValueCommand.js

/**
 * @author dforrer / https://github.com/dforrer
 * Developed as part of a project at University of Applied Sciences and Arts Northwestern Switzerland (www.fhnw.ch)
 */

/**
 * @param object THREE.Object3D
 * @param attributeName string
 * @param newValue number, string, boolean or object
 * @constructor
 */

var SetGeometryValueCommand = function ( object, attributeName, newValue ) {

	Command.call( this );

	this.type = 'SetGeometryValueCommand';
	this.name = 'Set Geometry.' + attributeName;

	this.object = object;
	this.attributeName = attributeName;
	this.oldValue = ( object !== undefined ) ? object.geometry[ attributeName ] : undefined;
	this.newValue = newValue;

};

SetGeometryValueCommand.prototype = {

	execute: function () {

		this.object.geometry[ this.attributeName ] = this.newValue;
		this.editor.signals.objectChanged.dispatch( this.object );
		this.editor.signals.geometryChanged.dispatch();
		this.editor.signals.sceneGraphChanged.dispatch();

	},

	undo: function () {

		this.object.geometry[ this.attributeName ] = this.oldValue;
		this.editor.signals.objectChanged.dispatch( this.object );
		this.editor.signals.geometryChanged.dispatch();
		this.editor.signals.sceneGraphChanged.dispatch();

	},

	toJSON: function () {

		var output = Command.prototype.toJSON.call( this );

		output.objectUuid = this.object.uuid;
		output.attributeName = this.attributeName;
		output.oldValue = this.oldValue;
		output.newValue = this.newValue;

		return output;

	},

	fromJSON: function ( json ) {

		Command.prototype.fromJSON.call( this, json );

		this.object = this.editor.objectByUuid( json.objectUuid );
		this.attributeName = json.attributeName;
		this.oldValue = json.oldValue;
		this.newValue = json.newValue;

	}

};

// File:editor/js/commands/MultiCmdsCommand.js

/**
 * @author dforrer / https://github.com/dforrer
 * Developed as part of a project at University of Applied Sciences and Arts Northwestern Switzerland (www.fhnw.ch)
 */

/**
 * @param cmdArray array containing command objects
 * @constructor
 */

var MultiCmdsCommand = function ( cmdArray ) {

	Command.call( this );

	this.type = 'MultiCmdsCommand';
	this.name = 'Multiple Changes';

	this.cmdArray = ( cmdArray !== undefined ) ? cmdArray : [];

};

MultiCmdsCommand.prototype = {

	execute: function () {

		this.editor.signals.sceneGraphChanged.active = false;

		for ( var i = 0; i < this.cmdArray.length; i ++ ) {

			this.cmdArray[ i ].execute();

		}

		this.editor.signals.sceneGraphChanged.active = true;
		this.editor.signals.sceneGraphChanged.dispatch();

	},

	undo: function () {

		this.editor.signals.sceneGraphChanged.active = false;

		for ( var i = this.cmdArray.length - 1; i >= 0; i -- ) {

			this.cmdArray[ i ].undo();

		}

		this.editor.signals.sceneGraphChanged.active = true;
		this.editor.signals.sceneGraphChanged.dispatch();

	},

	toJSON: function () {

		var output = Command.prototype.toJSON.call( this );

		var cmds = [];
		for ( var i = 0; i < this.cmdArray.length; i ++ ) {

			cmds.push( this.cmdArray[ i ].toJSON() );

		}
		output.cmds = cmds;

		return output;

	},

	fromJSON: function ( json ) {

		Command.prototype.fromJSON.call( this, json );

		var cmds = json.cmds;
		for ( var i = 0; i < cmds.length; i ++ ) {

			var cmd = new window[ cmds[ i ].type ]();	// creates a new object of type "json.type"
			cmd.fromJSON( cmds[ i ] );
			this.cmdArray.push( cmd );

		}

	}

};

// File:editor/js/commands/AddScriptCommand.js

/**
 * @author dforrer / https://github.com/dforrer
 * Developed as part of a project at University of Applied Sciences and Arts Northwestern Switzerland (www.fhnw.ch)
 */

/**
 * @param object THREE.Object3D
 * @param script javascript object
 * @constructor
 */

var AddScriptCommand = function ( object, script ) {

	Command.call( this );

	this.type = 'AddScriptCommand';
	this.name = 'Add Script';

	this.object = object;
	this.script = script;

};

AddScriptCommand.prototype = {

	execute: function () {

		console.log(this.script);
		console.log(this.object);

		if ( this.editor.scripts[ this.object.uuid ] === undefined ) {

			this.editor.scripts[ this.object.uuid ] = [];

		}

		this.editor.scripts[ this.object.uuid ].push( this.script );

		this.editor.signals.scriptAdded.dispatch( this.script );

	},

	undo: function () {

		if ( this.editor.scripts[ this.object.uuid ] === undefined ) return;

		var index = this.editor.scripts[ this.object.uuid ].indexOf( this.script );

		if ( index !== - 1 ) {

			this.editor.scripts[ this.object.uuid ].splice( index, 1 );

		}

		this.editor.signals.scriptRemoved.dispatch( this.script );

	},

	toJSON: function () {

		var output = Command.prototype.toJSON.call( this );

		output.objectUuid = this.object.uuid;
		output.script = this.script;

		return output;

	},

	fromJSON: function ( json ) {

		Command.prototype.fromJSON.call( this, json );

		this.script = json.script;
		this.object = this.editor.objectByUuid( json.objectUuid );

	}

};

// File:editor/js/commands/RemoveScriptCommand.js

/**
 * @author dforrer / https://github.com/dforrer
 * Developed as part of a project at University of Applied Sciences and Arts Northwestern Switzerland (www.fhnw.ch)
 */

/**
 * @param object THREE.Object3D
 * @param script javascript object
 * @constructor
 */

var RemoveScriptCommand = function ( object, script ) {

	Command.call( this );

	this.type = 'RemoveScriptCommand';
	this.name = 'Remove Script';

	this.object = object;
	this.script = script;
	if ( this.object && this.script ) {

		this.index = this.editor.scripts[ this.object.uuid ].indexOf( this.script );

	}

};

RemoveScriptCommand.prototype = {

	execute: function () {

		if ( this.editor.scripts[ this.object.uuid ] === undefined ) return;

		if ( this.index !== - 1 ) {

			this.editor.scripts[ this.object.uuid ].splice( this.index, 1 );

		}

		this.editor.signals.scriptRemoved.dispatch( this.script );

	},

	undo: function () {

		if ( this.editor.scripts[ this.object.uuid ] === undefined ) {

			this.editor.scripts[ this.object.uuid ] = [];

		}

		this.editor.scripts[ this.object.uuid ].splice( this.index, 0, this.script );

		this.editor.signals.scriptAdded.dispatch( this.script );

	},

	toJSON: function () {

		var output = Command.prototype.toJSON.call( this );

		output.objectUuid = this.object.uuid;
		output.script = this.script;
		output.index = this.index;

		return output;

	},

	fromJSON: function ( json ) {

		Command.prototype.fromJSON.call( this, json );

		this.script = json.script;
		this.index = json.index;
		this.object = this.editor.objectByUuid( json.objectUuid );

	}

};

// File:editor/js/commands/SetScriptValueCommand.js

/**
 * @author dforrer / https://github.com/dforrer
 * Developed as part of a project at University of Applied Sciences and Arts Northwestern Switzerland (www.fhnw.ch)
 */

/**
 * @param object THREE.Object3D
 * @param script javascript object
 * @param attributeName string
 * @param newValue string, object
 * @param cursorPosition javascript object with format {line: 2, ch: 3}
 * @constructor
 */

var SetScriptValueCommand = function ( object, script, attributeName, newValue, cursorPosition ) {

	Command.call( this );

	this.type = 'SetScriptValueCommand';
	this.name = 'Set Script.' + attributeName;
	this.updatable = true;

	this.object = object;
	this.script = script;

	this.attributeName = attributeName;
	this.oldValue = ( script !== undefined ) ? script[ this.attributeName ] : undefined;
	this.newValue = newValue;
	this.cursorPosition = cursorPosition;

};

SetScriptValueCommand.prototype = {

	execute: function () {

		this.script[ this.attributeName ] = this.newValue;

		this.editor.signals.scriptChanged.dispatch();
		this.editor.signals.refreshScriptEditor.dispatch( this.object, this.script, this.cursorPosition );

	},

	undo: function () {

		this.script[ this.attributeName ] = this.oldValue;

		this.editor.signals.scriptChanged.dispatch();
		this.editor.signals.refreshScriptEditor.dispatch( this.object, this.script, this.cursorPosition );

	},

	update: function ( cmd ) {

		this.cursorPosition = cmd.cursorPosition;
		this.newValue = cmd.newValue;

	},

	toJSON: function () {

		var output = Command.prototype.toJSON.call( this );

		output.objectUuid = this.object.uuid;
		output.index = this.editor.scripts[ this.object.uuid ].indexOf( this.script );
		output.attributeName = this.attributeName;
		output.oldValue = this.oldValue;
		output.newValue = this.newValue;
		output.cursorPosition = this.cursorPosition;

		return output;

	},

	fromJSON: function ( json ) {

		Command.prototype.fromJSON.call( this, json );

		this.oldValue = json.oldValue;
		this.newValue = json.newValue;
		this.attributeName = json.attributeName;
		this.object = this.editor.objectByUuid( json.objectUuid );
		this.script = this.editor.scripts[ json.objectUuid ][ json.index ];
		this.cursorPosition = json.cursorPosition;

	}

};

// File:editor/js/commands/SetMaterialCommand.js

/**
 * @author dforrer / https://github.com/dforrer
 * Developed as part of a project at University of Applied Sciences and Arts Northwestern Switzerland (www.fhnw.ch)
 */

/**
 * @param object THREE.Object3D
 * @param newMaterial THREE.Material
 * @constructor
 */

var SetMaterialCommand = function ( object, newMaterial ) {

	Command.call( this );

	this.type = 'SetMaterialCommand';
	this.name = 'New Material';

	this.object = object;
	this.oldMaterial = ( object !== undefined ) ? object.material : undefined;
	this.newMaterial = newMaterial;

};

SetMaterialCommand.prototype = {

	execute: function () {

		this.object.material = this.newMaterial;
		this.editor.signals.materialChanged.dispatch( this.newMaterial );

	},

	undo: function () {

		this.object.material = this.oldMaterial;
		this.editor.signals.materialChanged.dispatch( this.oldMaterial );

	},

	toJSON: function () {

		var output = Command.prototype.toJSON.call( this );

		output.objectUuid = this.object.uuid;
		output.oldMaterial = this.oldMaterial.toJSON();
		output.newMaterial = this.newMaterial.toJSON();

		return output;

	},

	fromJSON: function ( json ) {

		Command.prototype.fromJSON.call( this, json );

		this.object = this.editor.objectByUuid( json.objectUuid );
		this.oldMaterial = parseMaterial( json.oldMaterial );
		this.newMaterial = parseMaterial( json.newMaterial );


		function parseMaterial ( json ) {

			var loader = new THREE.ObjectLoader();
			var images = loader.parseImages( json.images );
			var textures  = loader.parseTextures( json.textures, images );
			var materials = loader.parseMaterials( [ json ], textures );
			return materials[ json.uuid ];

		}

	}

};

// File:editor/js/commands/SetMaterialValueCommand.js

/**
 * @author dforrer / https://github.com/dforrer
 * Developed as part of a project at University of Applied Sciences and Arts Northwestern Switzerland (www.fhnw.ch)
 */

/**
 * @param object THREE.Object3D
 * @param attributeName string
 * @param newValue number, string, boolean or object
 * @constructor
 */

var SetMaterialValueCommand = function ( object, attributeName, newValue ) {

	Command.call( this );

	this.type = 'SetMaterialValueCommand';
	this.name = 'Set Material.' + attributeName;
	this.updatable = true;

	this.object = object;
	this.oldValue = ( object !== undefined ) ? object.material[ attributeName ] : undefined;
	this.newValue = newValue;
	this.attributeName = attributeName;

};

SetMaterialValueCommand.prototype = {

	execute: function () {

		this.object.material[ this.attributeName ] = this.newValue;
		this.object.material.needsUpdate = true;
		this.editor.signals.objectChanged.dispatch( this.object );
		this.editor.signals.materialChanged.dispatch( this.object.material );

	},

	undo: function () {

		this.object.material[ this.attributeName ] = this.oldValue;
		this.object.material.needsUpdate = true;
		this.editor.signals.objectChanged.dispatch( this.object );
		this.editor.signals.materialChanged.dispatch( this.object.material );

	},

	update: function ( cmd ) {

		this.newValue = cmd.newValue;

	},

	toJSON: function () {

		var output = Command.prototype.toJSON.call( this );

		output.objectUuid = this.object.uuid;
		output.attributeName = this.attributeName;
		output.oldValue = this.oldValue;
		output.newValue = this.newValue;

		return output;

	},

	fromJSON: function ( json ) {

		Command.prototype.fromJSON.call( this, json );

		this.attributeName = json.attributeName;
		this.oldValue = json.oldValue;
		this.newValue = json.newValue;
		this.object = this.editor.objectByUuid( json.objectUuid );

	}

};

// File:editor/js/commands/SetMaterialColorCommand.js

/**
 * @author dforrer / https://github.com/dforrer
 * Developed as part of a project at University of Applied Sciences and Arts Northwestern Switzerland (www.fhnw.ch)
 */

/**
 * @param object THREE.Object3D
 * @param attributeName string
 * @param newValue integer representing a hex color value
 * @constructor
 */

var SetMaterialColorCommand = function ( object, attributeName, newValue ) {

	Command.call( this );

	this.type = 'SetMaterialColorCommand';
	this.name = 'Set Material.' + attributeName;
	this.updatable = true;

	this.object = object;
	this.attributeName = attributeName;
	this.oldValue = ( object !== undefined ) ? this.object.material[ this.attributeName ].getHex() : undefined;
	this.newValue = newValue;

};

SetMaterialColorCommand.prototype = {

	execute: function () {

		this.object.material[ this.attributeName ].setHex( this.newValue );
		this.editor.signals.materialChanged.dispatch( this.object.material );

	},

	undo: function () {

		this.object.material[ this.attributeName ].setHex( this.oldValue );
		this.editor.signals.materialChanged.dispatch( this.object.material );

	},

	update: function ( cmd ) {

		this.newValue = cmd.newValue;

	},

	toJSON: function () {

		var output = Command.prototype.toJSON.call( this );

		output.objectUuid = this.object.uuid;
		output.attributeName = this.attributeName;
		output.oldValue = this.oldValue;
		output.newValue = this.newValue;

		return output;

	},

	fromJSON: function ( json ) {

		Command.prototype.fromJSON.call( this, json );

		this.object = this.editor.objectByUuid( json.objectUuid );
		this.attributeName = json.attributeName;
		this.oldValue = json.oldValue;
		this.newValue = json.newValue;

	}

};

// File:editor/js/commands/SetMaterialMapCommand.js

/**
 * @author dforrer / https://github.com/dforrer
 * Developed as part of a project at University of Applied Sciences and Arts Northwestern Switzerland (www.fhnw.ch)
 */

/**
 * @param object THREE.Object3D
 * @param mapName string
 * @param newMap THREE.Texture
 * @constructor
 */

var SetMaterialMapCommand = function ( object, mapName, newMap ) {

	Command.call( this );
	this.type = 'SetMaterialMapCommand';
	this.name = 'Set Material.' + mapName;

	this.object = object;
	this.mapName = mapName;
	this.oldMap = ( object !== undefined ) ? object.material[ mapName ] : undefined;
	this.newMap = newMap;

};

SetMaterialMapCommand.prototype = {

	execute: function () {

		this.object.material[ this.mapName ] = this.newMap;
		this.object.material.needsUpdate = true;
		this.editor.signals.materialChanged.dispatch( this.object.material );

	},

	undo: function () {

		this.object.material[ this.mapName ] = this.oldMap;
		this.object.material.needsUpdate = true;
		this.editor.signals.materialChanged.dispatch( this.object.material );

	},

	toJSON: function () {

		var output = Command.prototype.toJSON.call( this );

		output.objectUuid = this.object.uuid;
		output.mapName = this.mapName;
		output.newMap = serializeMap( this.newMap );
		output.oldMap = serializeMap( this.oldMap );

		return output;

		// serializes a map (THREE.Texture)

		function serializeMap ( map ) {

			if ( map === null || map === undefined ) return null;

			var meta = {
				geometries: {},
				materials: {},
				textures: {},
				images: {}
			};

			var json = map.toJSON( meta );
			var images = extractFromCache( meta.images );
			if ( images.length > 0 ) json.images = images;
			json.sourceFile = map.sourceFile;

			return json;

		}

		// Note: The function 'extractFromCache' is copied from Object3D.toJSON()

		// extract data from the cache hash
		// remove metadata on each item
		// and return as array
		function extractFromCache ( cache ) {

			var values = [];
			for ( var key in cache ) {

				var data = cache[ key ];
				delete data.metadata;
				values.push( data );

			}
			return values;

		}

	},

	fromJSON: function ( json ) {

		Command.prototype.fromJSON.call( this, json );

		this.object = this.editor.objectByUuid( json.objectUuid );
		this.mapName = json.mapName;
		this.oldMap = parseTexture( json.oldMap );
		this.newMap = parseTexture( json.newMap );

		function parseTexture ( json ) {

			var map = null;
			if ( json !== null ) {

				var loader = new THREE.ObjectLoader();
				var images = loader.parseImages( json.images );
				var textures  = loader.parseTextures( [ json ], images );
				map = textures[ json.uuid ];
				map.sourceFile = json.sourceFile;

			}
			return map;

		}

	}

};

// File:editor/js/commands/SetSceneCommand.js

/**
 * @author dforrer / https://github.com/dforrer
 * Developed as part of a project at University of Applied Sciences and Arts Northwestern Switzerland (www.fhnw.ch)
 */

/**
 * @param scene containing children to import
 * @constructor
 */

var SetSceneCommand = function ( scene ) {

	Command.call( this );

	this.type = 'SetSceneCommand';
	this.name = 'Set Scene';

	this.cmdArray = [];

	if ( scene !== undefined ) {

		this.cmdArray.push( new SetUuidCommand( this.editor.scene, scene.uuid ) );
		this.cmdArray.push( new SetValueCommand( this.editor.scene, 'name', scene.name ) );
		this.cmdArray.push( new SetValueCommand( this.editor.scene, 'userData', JSON.parse( JSON.stringify( scene.userData ) ) ) );

		while ( scene.children.length > 0 ) {

			var child = scene.children.pop();
			this.cmdArray.push( new AddObjectCommand( child ) );

		}

	}

};

SetSceneCommand.prototype = {

	execute: function () {

		this.editor.signals.sceneGraphChanged.active = false;

		for ( var i = 0; i < this.cmdArray.length; i ++ ) {

			this.cmdArray[ i ].execute();

		}

		this.editor.signals.sceneGraphChanged.active = true;
		this.editor.signals.sceneGraphChanged.dispatch();

	},

	undo: function () {

		this.editor.signals.sceneGraphChanged.active = false;

		for ( var i = this.cmdArray.length - 1; i >= 0; i -- ) {

			this.cmdArray[ i ].undo();

		}

		this.editor.signals.sceneGraphChanged.active = true;
		this.editor.signals.sceneGraphChanged.dispatch();

	},

	toJSON: function () {

		var output = Command.prototype.toJSON.call( this );

		var cmds = [];
		for ( var i = 0; i < this.cmdArray.length; i ++ ) {

			cmds.push( this.cmdArray[ i ].toJSON() );

		}
		output.cmds = cmds;

		return output;

	},

	fromJSON: function ( json ) {

		Command.prototype.fromJSON.call( this, json );

		var cmds = json.cmds;
		for ( var i = 0; i < cmds.length; i ++ ) {

			var cmd = new window[ cmds[ i ].type ]();	// creates a new object of type "json.type"
			cmd.fromJSON( cmds[ i ] );
			this.cmdArray.push( cmd );

		}

	}

};

// File:editor/js/EditorShortCuts.js

/**
 * @author elephantatwork, Samuel Vonäsch
 * keyboard Recognition code @author Jérome Etienne
 */

var EditorShortCuts = function (editor) {

	this.editor = editor;
	this.shortcuts = this.editor.shortcuts;

	this.domElement = document;
	// to store the current state
	this.keyCodes	= {};
	this.modifiers	= {};
	
	// create callback to bind/unbind keyboard events
	var _this	= this;
	this._onKeyDown	= function(event){ _this._onKeyChange(event)	}
	this._onKeyUp	= function(event){ _this._onKeyChange(event)	}

	// bind keyEvents
	this.domElement.addEventListener("keydown", this._onKeyDown, false);
	this.domElement.addEventListener("keyup", this._onKeyUp, false);

	// create callback to bind/unbind window blur event
	this._onBlur = function(){
		for(var prop in _this.keyCodes)  _this.keyCodes[prop] = false;
		for(var prop in _this.modifiers)  _this.modifiers[prop] = false;
	}

	// bind window blur
	window.addEventListener("blur", this._onBlur, false);


};

EditorShortCuts.MODIFIERS	= ['shift', 'ctrl', 'alt', 'meta'];
EditorShortCuts.ALIAS	= {
	'left'		: 37,
	'up'		: 38,
	'right'		: 39,
	'down'		: 40,
	'space'		: 32,
	'pageup'	: 33,
	'pagedown'	: 34,
	'tab'		: 9,
	'escape'	: 27,
	'num1'		: 97,
	'num2'		: 98,
	'num3'		: 99,
	'num4'		: 100,
	'num5'		: 101,
	'num6'		: 102,
	'num7'		: 103,
	'num8'		: 104,
	'num9'		: 105,
	'num0'		: 96

};

EditorShortCuts.prototype = {


	keyCheck: function( keyCode ){

		//Create the a json file and export it
		if( this.pressed(this.shortcuts.getKey('file/exportscene' ))) {

			var output = this.editor.scene.toJSON();
			output = JSON.stringify( output, null, '\t' );
			output = output.replace( /[\n\t]+([\d\.e\-\[\]]+)/g, '$1' );

			this.exportString( output, 'scene.json' );;

		}
		
		//History
		//Undo
		if( this.pressed(this.shortcuts.getKey('history/undo' ))) this.editor.history.undo();

		//Redo
		if( this.pressed(this.shortcuts.getKey('history/redo' ))) this.editor.history.redo();


		//Transform
		//Translate
		if( this.pressed(this.shortcuts.getKey('transform/move' ))) this.editor.signals.transformModeChanged.dispatch( 'translate' );

		//Rotate
		if( this.pressed(this.shortcuts.getKey('transform/rotate' ))) this.editor.signals.transformModeChanged.dispatch( 'rotate' );

		//Sccale
		if( this.pressed(this.shortcuts.getKey('transform/scale' ))) this.editor.signals.transformModeChanged.dispatch( 'scale' );

		//Delete Shortcut -HACK IT ATM, pressing x doesnt work
		if( keyCode == 88 ) {
			if(editor.selected != null && editor.selected.parent != null)
				editor.execute( new RemoveObjectCommand( editor.selected ) );
		}

		//Clone Object
		if( this.pressed(this.shortcuts.getKey( 'edit/clone' ))) {
			var _uuid = editor.selected.uuid;
			var _object = editor.selected.clone();
			var _scripts = editor.scripts[_uuid];
			
			editor.execute( new AddObjectCommand( _object ) );

			if(_scripts !== undefined){
				var length = _scripts.length-1;
				for(var i = 0; i<_scripts.length; i++){
					console.log(i);
					editor.execute( new AddScriptCommand( _object, _scripts[i]  ) );
				}
			}
		}

		//Hide Current
		if( this.pressed(this.shortcuts.getKey( 'view/hide' ))) this.editor.hide();

		//Unhide all
		if( this.pressed(this.shortcuts.getKey( 'view/unhideAll' ))) this.editor.unhideAll();

		//Isolate - toggle
		if( this.pressed(this.shortcuts.getKey( 'view/isolate' ))) this.editor.isolate();

		//Focus object
		if( this.pressed(this.shortcuts.getKey( 'view/focus' ))) this.editor.focus(this.editor.selected);


		if( this.pressed(this.shortcuts.getKey( 'camera/switch' ))) this.editor.signals.switchCameraMode.dispatch();

		//Camera Positions - Hack Style
		if( this.pressed(this.shortcuts.getKey( 'camera/top' ))) this.editor.signals.cameraPositionSnap.dispatch( 'top' );
		if( this.pressed(this.shortcuts.getKey( 'camera/left' ))) this.editor.signals.cameraPositionSnap.dispatch( 'left' );
		if( this.pressed(this.shortcuts.getKey( 'camera/front' ))) this.editor.signals.cameraPositionSnap.dispatch( 'front' );

		if( this.pressed("ctrl+"+this.shortcuts.getKey( 'camera/top' ))) this.editor.signals.cameraPositionSnap.dispatch( 'bottom' );
		if( this.pressed("ctrl+"+this.shortcuts.getKey( 'camera/left' ))) this.editor.signals.cameraPositionSnap.dispatch( 'right' );
		if( this.pressed("ctrl+"+this.shortcuts.getKey( 'camera/front' ))) this.editor.signals.cameraPositionSnap.dispatch( 'back' );


		//Toggle ObjectView
		if( this.pressed(this.shortcuts.getKey( 'view/objectView' ))) {

			// console.log(this.editor.sidebarObject.dom);
			if(this.editor.sidebarObject.dom.style.visibility == 'hidden')
				this.editor.sidebarObject.dom.style.visibility = 'visible';
			else  
				this.editor.sidebarObject.dom.style.visibility = 'hidden';
		};


		//Toggle Project View
		if( this.pressed(this.shortcuts.getKey( 'view/projectView' ))){
			if(this.editor.sidebarProject.dom.style.visibility == 'hidden')
				this.editor.sidebarProject.dom.style.visibility = 'visible';
			else  
				this.editor.sidebarProject.dom.style.visibility = 'hidden';

		};


	},

	//Ugly and should be here
	exportString: function ( output, filename ) {
		
		//export scnee hack
		var link = document.createElement( 'a' );
		link.style.display = 'none';
		document.body.appendChild( link ); // Firefox workaround, see #6594

		var blob = new Blob( [ output ], { type: 'text/plain' } );
		var objectURL = URL.createObjectURL( blob );

		link.href = objectURL;
		link.download = filename || 'data.json';
		link.target = '_blank';

		var event = document.createEvent("MouseEvents");
		event.initMouseEvent(
			"click", true, false, window, 0, 0, 0, 0, 0
			, false, false, false, false, 0, null
		);
		link.dispatchEvent(event);
	},

	/**
	* To stop listening of the keyboard events
	*/
	destroy: function(){
		// unbind keyEvents
		this.domElement.removeEventListener("keydown", this._onKeyDown, false);
		this.domElement.removeEventListener("keyup", this._onKeyUp, false);

		// unbind window blur event
		window.removeEventListener("blur", this._onBlur, false);
	},

	/**
	 * to process the keyboard dom event
	*/
	_onKeyChange: function( event ){
		// log to debug
		// console.log("onKeyChange", event, event.keyCode, event.shiftKey, event.ctrlKey, event.altKey, event.metaKey);

		// update this.keyCodes
		var keyCode		= event.keyCode
		var pressed		= event.type === 'keydown' ? true : false
		this.keyCodes[keyCode]	= pressed
		// update this.modifiers
		this.modifiers['shift']	= event.shiftKey
		this.modifiers['ctrl']	= event.ctrlKey
		this.modifiers['alt']	= event.altKey
		this.modifiers['meta']	= event.metaKey
	},

	/**
	 * query keyboard state to know if a key is pressed of not
	 *
	 * @param {String} keyDesc the description of the key. format : modifiers+key e.g shift+A
	 * @returns {Boolean} true if the key is pressed, false otherwise
	*/
	pressed: function(keyDesc){
		// console.log(keyDesc);
		var keys	= keyDesc.split("+");
		for(var i = 0; i < keys.length; i++){
			var key		= keys[i]
			var pressed	= false
			if( EditorShortCuts.MODIFIERS.indexOf( key ) !== -1 ){
				pressed	= this.modifiers[key];
			}else if( Object.keys(EditorShortCuts.ALIAS).indexOf( key ) != -1 ){
				pressed	= this.keyCodes[ EditorShortCuts.ALIAS[key] ];
			}else {
				pressed	= this.keyCodes[key.toUpperCase().charCodeAt(0)]
			}
			if( !pressed)	return false;
		};
		return true;
	},

	/**
	 * return true if an event match a keyDesc
	 * @param  {KeyboardEvent} event   keyboard event
	 * @param  {String} keyDesc string description of the key
	 * @return {Boolean}         true if the event match keyDesc, false otherwise
	 */
	eventMatches: function( event, keyDesc ) {

		var aliases	= EditorShortCuts.ALIAS;
		var aliasKeys	= Object.keys(aliases);
		var keys	= keyDesc.split("+");
		// log to debug
		// console.log("eventMatches", event, event.keyCode, event.shiftKey, event.ctrlKey, event.altKey, event.metaKey)
		for(var i = 0; i < keys.length; i++){
			var key		= keys[i];
			var pressed	= false;
			if( key === 'shift' ){
				pressed	= (event.shiftKey	? true : false)
			}else if( key === 'ctrl' ){
				pressed	= (event.ctrlKey	? true : false)
			}else if( key === 'alt' ){
				pressed	= (event.altKey		? true : false)
			}else if( key === 'meta' ){
				pressed	= (event.metaKey	? true : false)
			}else if( aliasKeys.indexOf( key ) !== -1 ){
				pressed	= (event.keyCode === aliases[key] ? true : false);
			}else if( event.keyCode === key.toUpperCase().charCodeAt(0) ){
				pressed	= true;
			}

			if( !pressed )	return false;
		}

		return true;
	}

}


// File:editor/js/EditorShortCutsList.js

/**
 * @author elephantatWork, Samuel Vonäsch
 */

var EditorShortCutsList = function () {

	var name = 'threejs-editor-shortcuts';

	var storage = {

		'file/exportscene':"ctrl+e",

		'history/undo':"ctrl+z",
		'history/redo':"ctrl+y",

		'transform/move':'g',
		'transform/rotate':'r',
		'transform/scale':'s',

		'edit/clone':'shift+D',
		'edit/duplicate':'',
		'edit/delete':'x',

		'view/hide':'h',
		'view/unhideAll':'alt+h',
		'view/isolate':'i',
		'view/focus':'f',
		'view/showgrid':'space',
		'view/projectView':'n',
		'view/objectView':'t',

		'camera/front':'1',
		'camera/left':'3',
		'camera/top':'7',
		'camera/switch':'5'
	};

	if ( window.localStorage[ name ] === undefined ) {

		window.localStorage[ name ] = JSON.stringify( storage );

	} else {

		var data = JSON.parse( window.localStorage[ name ] );

		for ( var key in data ) {

			storage[ key ] = data[ key ];

		}

	}

	return {

		getKey: function ( key ) {

			return storage[ key ];

		},

		setKey: function () { // key, value, key, value ...

			for ( var i = 0, l = arguments.length; i < l; i += 2 ) {

				storage[ arguments[ i ] ] = arguments[ i + 1 ];

			}

			window.localStorage[ name ] = JSON.stringify( storage );
 
			console.log( '[' + /\d\d\:\d\d\:\d\d/.exec( new Date() )[ 0 ] + ']', 'Saved config to shortcuts.' );

		},

		clear: function () {

			delete window.localStorage[ name ];

		}

	}

};

// File:editor/js/Editor.js

/**
 * @author mrdoob / http://mrdoob.com/
 */
"use strict";
var Editor = function () {

	var SIGNALS = signals;

	 // ( width, height, fov, near, far, orthoNear, orthoFar )
	// this.DEFAULT_CAMERA = new THREE.CombinedCamera(100,100, 50, 0.1, 10000, 0.1, 10000);
	this.DEFAULT_CAMERA = new THREE.PerspectiveCamera( 50, 1, 0.1, 10000 );
	this.DEFAULT_CAMERA.name = 'Camera';
	this.DEFAULT_CAMERA.position.set( 20, 10, 20 );
	this.DEFAULT_CAMERA.lookAt( new THREE.Vector3() );

	var Signal = signals.Signal;

	this.signals = {

		// script

		editScript: new Signal(),

		// player

		startPlayer: new Signal(),
		stopPlayer: new Signal(),

		// vr

		enterVR: new Signal(),

		enteredVR: new Signal(),
		exitedVR: new Signal(),

		// actions 

		showModal: new Signal(),

		// notifications

		editorCleared: new Signal(),

		savingStarted: new Signal(),
		savingFinished: new Signal(),

		themeChanged: new Signal(),

		transformModeChanged: new Signal(),
		snapChanged: new Signal(),
		spaceChanged: new Signal(),
		rendererChanged: new Signal(),

		sceneGraphChanged: new Signal(),

		cameraChanged: new Signal(),

		geometryChanged: new Signal(),

		objectSelected: new Signal(),
		objectFocused: new Signal(),

		objectAdded: new Signal(),
		objectChanged: new Signal(),
		objectRemoved: new Signal(),

		helperAdded: new Signal(),
		helperRemoved: new Signal(),

		materialChanged: new Signal(),

		scriptAdded: new Signal(),
		scriptChanged: new Signal(),
		scriptRemoved: new Signal(),

		fogTypeChanged: new Signal(),
		fogColorChanged: new Signal(),
		fogParametersChanged: new Signal(),
		windowResize: new Signal(),

		showGridChanged: new Signal(),
		refreshSidebarObject3D: new Signal(),
		historyChanged: new Signal(),
		refreshScriptEditor: new Signal(),

		cameraPositionSnap: new Signal(),
		undo: new Signal(),
		redo: new Signal(),
		switchCameraMode: new Signal(),
		unsaveProject: new Signal(),
		saveProject: new Signal(),
		showManChanged: new Signal(),

		bgColorChanged: new Signal(),
		presetChanged: new Signal(),

	};

	this.config = new Config( 'threejs-editor' );
	this.history = new History( this );
	this.storage = new Storage();
	this.loader = new Loader( this );

	this.camera = this.DEFAULT_CAMERA.clone();
	this.camera.aspect = this.DEFAULT_CAMERA.aspect;
 	this.camera.updateProjectionMatrix();

	this.scene = new THREE.Scene();
	this.scene.name = 'Scene';

	this.sceneHelpers = new THREE.Scene();

	this.object = {};
	this.geometries = {};
	this.materials = {};
	// this.textures = {};
	this.scripts = {};

	this.selected = null;
	this.helpers = {};

	this.shortcuts = new EditorShortCutsList();
	this.isolationMode = false;

	this.sidebarObject = null;
	this.sidebarProject = null;


	var SCREEN_WIDTH = window.innerWidth;
	var SCREEN_HEIGHT = window.innerHeight;


	var activeCamera;
	var cameraPerspective, cameraOrtho;
	this.renderer = null;

	this.RenderFcts = [];

};

Editor.prototype = {

	setTheme: function ( value ) {

		//document.getElementById( 'theme' ).href = value;

		this.signals.themeChanged.dispatch( value );

	},

	//

	setScene: function ( scene ) {

		this.scene.uuid = scene.uuid;
		this.scene.name = scene.name;
		this.scene.userData = JSON.parse( JSON.stringify( scene.userData ) );

		// avoid render per object

		this.signals.sceneGraphChanged.active = false;

		while ( scene.children.length > 0 ) {

			this.addObject( scene.children[ 0 ] );

		}
		// console.log("why");
		this.signals.sceneGraphChanged.active = true;
		this.signals.sceneGraphChanged.dispatch();

	},

	//

	addObject: function ( object ) {

		var scope = this;

		object.traverse( function ( child ) {

			if ( child.geometry !== undefined ) scope.addGeometry( child.geometry );
			if ( child.material !== undefined ) scope.addMaterial( child.material );

			scope.addHelper( child );

		} );

		this.scene.add( object );

		console.log("asdf");

		this.signals.objectAdded.dispatch( object );
		this.signals.sceneGraphChanged.dispatch();

	},

	cloneObject: function(){

		var object = this.selected;

		if( object === null ) return;

		if ( object.parent === undefined ) return; // avoid cloning the camera or scene

		object = object.clone();

		this.addObject( object );
		this.select( object );
	},

	destoryCurrent: function(){

		var object = this.selected;

		if(object === null) return;

		if ( confirm( 'Delete ' + object.name + '?' ) === false ) return;

		var parent = object.parent;
		this.removeObject( object );
		this.select( null );
	},

	moveObject: function ( object, parent, before ) {

		if ( parent === undefined ) {

			parent = this.scene;

		}

		parent.add( object );

		// sort children array

		if ( before !== undefined ) {

			var index = parent.children.indexOf( before );
			parent.children.splice( index, 0, object );
			parent.children.pop();

		}

		this.signals.sceneGraphChanged.dispatch();

	},

	nameObject: function ( object, name ) {

		object.name = name;
		this.signals.sceneGraphChanged.dispatch();

	},

	removeObject: function ( object ) {

		if ( object.parent === null ) return; // avoid deleting the camera or scene

		var scope = this;

		object.traverse( function ( child ) {

			scope.removeHelper( child );

		} );

		object.parent.remove( object );

		this.signals.objectRemoved.dispatch( object );
		this.signals.sceneGraphChanged.dispatch();

	},

	addGeometry: function ( geometry ) {

		this.geometries[ geometry.uuid ] = geometry;

	},

	setGeometryName: function ( geometry, name ) {

		geometry.name = name;
		this.signals.sceneGraphChanged.dispatch();

	},

	addMaterial: function ( material ) {

		this.materials[ material.uuid ] = material;

	},

	setMaterialName: function ( material, name ) {

		material.name = name;
		this.signals.sceneGraphChanged.dispatch();

	},

	addTexture: function ( texture ) {

		this.textures[ texture.uuid ] = texture;

	},

	//

	addHelper: function () {

		var geometry = new THREE.SphereBufferGeometry( 2, 4, 2 );
		var material = new THREE.MeshBasicMaterial( { color: 0xff0000, visible: false } );

		return function ( object ) {

			var helper;

			if ( object instanceof THREE.Camera ) {

				helper = new THREE.CameraHelper( object, 1 );

			} else if ( object instanceof THREE.PointLight ) {

				helper = new THREE.PointLightHelper( object, 1 );

			} else if ( object instanceof THREE.DirectionalLight ) {

				helper = new THREE.DirectionalLightHelper( object, 1 );

			} else if ( object instanceof THREE.SpotLight ) {

				helper = new THREE.SpotLightHelper( object, 1 );

			} else if ( object instanceof THREE.HemisphereLight ) {

				helper = new THREE.HemisphereLightHelper( object, 1 );

			} else if ( object instanceof THREE.SkinnedMesh ) {

				helper = new THREE.SkeletonHelper( object );

			} else {

				// no helper for this object type
				return;

			}

			var picker = new THREE.Mesh( geometry, material );
			picker.name = 'picker';
			picker.userData.object = object;
			helper.add( picker );

			this.sceneHelpers.add( helper );
			this.helpers[ object.id ] = helper;

			this.signals.helperAdded.dispatch( helper );

		};

	}(),

	removeHelper: function ( object ) {

		if ( this.helpers[ object.id ] !== undefined ) {

			var helper = this.helpers[ object.id ];
			helper.parent.remove( helper );

			delete this.helpers[ object.id ];

			this.signals.helperRemoved.dispatch( helper );

		}

	},

	//
	addScriptNew: function ( _script ) {

		editor.execute( new AddScriptCommand( this.selected, _script ) );


	},

	addScript: function ( object, script ) {

		if ( this.scripts[ object.uuid ] === undefined ) {

			this.scripts[ object.uuid ] = [];

		}

		this.scripts[ object.uuid ].push( script );

		this.signals.scriptAdded.dispatch( script );

	},

	removeScript: function ( object, script ) {

		if ( this.scripts[ object.uuid ] === undefined ) return;

		var index = this.scripts[ object.uuid ].indexOf( script );

		if ( index !== - 1 ) {

			this.scripts[ object.uuid ].splice( index, 1 );

		}

		this.signals.scriptRemoved.dispatch( script );

	},

	//

	select: function ( object ) {

		if ( this.selected === object ) return;

		var uuid = null;

		if ( object !== null ) {

			uuid = object.uuid;

		}

		this.selected = object;

		this.config.setKey( 'selected', uuid );
		this.signals.objectSelected.dispatch( object );

	},

	selectById: function ( id ) {

		if ( id === this.camera.id ) {

			this.select( this.camera );
			return;

		}

		this.select( this.scene.getObjectById( id, true ) );

	},

	selectByUuid: function ( uuid ) {

		var scope = this;

		this.scene.traverse( function ( child ) {

			if ( child.uuid === uuid ) {

				scope.select( child );

			}

		} );

	},

	deselect: function () {

		this.select( null );

	},

	focus: function ( object ) {

		if ( this.selected === null ) return;
			this.signals.objectFocused.dispatch( object );

		this.cleanScene(this.scene);	

	},

	focusById: function ( id ) {

		this.focus( this.scene.getObjectById( id, true ) );

	},


	hide: function(){

		if(this.selected !== null){
			this.selected.visible = false;
			this.deselect();
		}
	},

	unhideAll: function(){

		this.scene.traverse( function ( child ) {

			child.visible = true;

		} );

		this.signals.sceneGraphChanged.dispatch();
	},

	isolate: function(){

		var mode = !this.isolationMode;
		this.isolationMode = mode;

		if(this.selected !== null){
			this.scene.traverse( function ( child ) {

				if ( !(child instanceof THREE.Light )){ 
					if(child.name !== "Scene" ){
					
						child.visible = mode;

					}
				}
			} );

			this.selected.visible = true;

			//TODO: Add parent iteration so all parents of an object stay visible and don't hide the child
			this.signals.sceneGraphChanged.dispatch();

		}
	},

	clear: function () {

		this.history.clear();
		this.storage.clear();

		this.camera.copy( this.DEFAULT_CAMERA );

		var objects = this.scene.children;

		while ( objects.length > 0 ) {

			this.removeObject( objects[ 0 ] );

		}

		this.geometries = {};
		this.materials = {};
		this.textures = {};
		this.scripts = {};

		this.deselect();

		this.signals.editorCleared.dispatch();
		this.signals.windowResize.dispatch();

		this.signals.bgColorChanged.dispatch(0xC8C8C8);

	},

	//

	fromJSON: function ( json ) {

		console.log(json);

		var loader = new THREE.ObjectLoader();

		// backwards

		if ( json.scene === undefined ) {

			this.setScene( loader.parse( json ) );
			return;

		}

		// TODO: Clean this up somehow

		if ( json.project !== undefined ) {

			this.config.setKey( 'project/renderer/shadows', json.project.shadows );
			this.config.setKey( 'project/vr', json.project.vr );
			this.config.setKey('backgroundColor', json.project.backgroundColor);

			this.signals.bgColorChanged.dispatch( json.project.backgroundColor );

			// console.log("project");
		}
		// console.log(this.config.getKey('backgroundColor'));

		// this.signals.bgColorChanged.dispatch( this.config.getKey('backgroundColor'));

		var camera = loader.parse( json.camera );

		this.camera.copy( camera );
		this.history.fromJSON( json.history );
		this.scripts = json.scripts;

		// console.log(json.scene);

		this.setScene( loader.parse( json.scene ) );

		this.signals.saveProject.dispatch();

		this.signals.windowResize.dispatch();


	},

	toJSON: function () {

		// scripts clean up
		var scene = this.scene;
		var scripts = this.scripts;

		for ( var key in scripts ) {

			var script = scripts[ key ];

			if ( script.length === 0 || scene.getObjectByProperty( 'uuid', key ) === undefined ) {

				delete scripts[ key ];

			}

		}
		//Script merging;
		// var array = [{name:"foo1",value:"val1"},{name:"foo1",value:["val2","val3"]},{name:"foo2",value:"val4"}];

		// var output = [];

		// for ( var value in scripts ) { 
		//     var existing = output.filter(function(v, i) { 
		//         return v.name == value.name; 
		//     }); 
		//     if(existing.length) {
		//         var existingIndex = output.indexOf(existing[0]);
		//         output[existingIndex].value = output[existingIndex].value.concat(value.value); 
		//     }
		//     else {
		//         if(typeof value.value == 'string')
		//             value.value = [value.value];
		//         output.push(value);  
		//     }
		// }

		// console.dir(output);

		//

		return {

			metadata: {},
			project: {
				gammaInput: this.config.getKey( 'project/renderer/gammaInput' ),
				gammaOutput: this.config.getKey( 'project/renderer/gammaOutput' ),
				shadows: this.config.getKey( 'project/renderer/shadows' ),

				vr: this.config.getKey( 'project/vr' ),
				backgroundColor: this.config.getKey('backgroundColor'),
				fog: this.scene.fog,
				fogColor: this.config.getKey('fogColor'),
				gazetime: this.config.getKey( 'project/gazetime' ),
				quality: parseFloat(this.config.getKey( 'project/quality' )),
				crosshair: this.config.getKey( 'project/crosshair' ),

			},
			camera: this.camera.toJSON(),
			scene: this.scene.toJSON(),
			scripts: this.scripts,
			history: this.history.toJSON()

		};

	},

	cleanScene: function ( _scene ){

		// console.log(_scene.toJSON());

	},

	objectByUuid: function ( uuid ) {

		return this.scene.getObjectByProperty( 'uuid', uuid, true );

	},

	execute: function ( cmd, optionalName ) {

		this.history.execute( cmd, optionalName );

	},

	undo: function () {

		this.history.undo();

	},

	redo: function () {

		this.history.redo();

	}

};

