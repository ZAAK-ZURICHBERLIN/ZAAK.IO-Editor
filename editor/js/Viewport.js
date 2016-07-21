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

	var grid = new THREE.GridHelper( 30, 60 , 0x000000,0x000000);
	sceneHelpers.add( grid );

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
			vrHuman = new THREE.Mesh( geometry, new THREE.MeshBasicMaterial( { map: humanMap }));
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
		grid = new THREE.GridHelper( 30, 60);// 0xbbbbbb, 0x888888 );
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
