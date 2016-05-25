// File:editor/library/Library.js

"use strict";
/**
 * @author Samuel Vonäsch / http://zaak.io
 */
var Library = function(_src) {
	
	var canvas;

	var scenes = [], camera, renderer, library, controls;

	var template = document.getElementById("template").text;
	var content = document.getElementById("content");

	// var emptyScene = new THREE.Scene();

	var libLoader = new LibraryLoader(this);

	var id = 0;

	var uniformDimension = 1;

	var librarySource = _src;


	init();
	animate();

	function init() {

		canvas = document.getElementById( "c" );
		
		renderer = new THREE.WebGLRenderer( { canvas: canvas, antialias: true } );
		renderer.setClearColor( 0xFFFFFF );


	}


	this.loadLibrary = function(_filter){

		_filter = typeof _filter !== 'undefined' ? _filter : "3d";

		//Clean selection
		while (content.firstChild) {
		    content.removeChild(content.firstChild);
		}

		// console.log(¥beta.zaak.io/api/v1/asset?format=json&limit=1);
		// var libraryURL = librarySource+ "/lib"+_filter+".json";
		var libraryURL = BASE_URL + API_URL +'/asset?format=json&category__slug=' + _filter;

		var loader = new THREE.XHRLoader();
		loader.crossOrigin = '';

		loader.load( libraryURL, function ( text ) {

			console.log(text);

			library = JSON.parse( text );

			for(var i = 0; i < library.objects.length; i++){

				var name = library.objects[i].media;

				loadObject(name, i);

			} 
		} );

		console.log("preloadDone");
	};

	function loadObject ( _name, _id ){

		// console.log(_library)
		// var name = library.entries[i].name + library.entries[i].format;
		console.log(library.objects[_id]);
		switch(library.objects[_id].category.slug){
			case "3d":

				var myFile, myBlob; 

				var url, script;
				
				var loader = new THREE.XHRLoader();
				loader.crossOrigin = '';

				loader.load( library.objects[_id].media, function ( text ) {

					var fileParts = [text];

					myBlob = new Blob(fileParts, {type : 'text/javascript'});
					myFile = blobToFile(myBlob, _name);

					console.log(myFile);

					libLoader.loadFile( myFile );

				} );
			break;

			case "audio":
				url = library.objects[_id].media;
				script = { name: library.objects[_id].name,  source: "//The url of the audioFile\nvar url = '"+url+"';\nvar autoplay = true;\nvar distance = 20;\n\n//Don't change these\nvar audioSource;\n\nfunction init ( event ){\n\n\taudioSource = new THREE.PositionalAudio(camera.getObjectByName('Listener'));\n\taudioSource.load( url );\n\taudioSource.setRefDistance( distance );\n\taudioSource.autoplay = autoplay;\n\tthis.add( audioSource );\n\n}\n\nfunction rayStart( event ){\n\t\t \n\tif(audioSource.isPlaying)\n\t \taudioSource.pause();\n\telse\n\t \taudioSource.play();\n\t\t\n\t\n}\n\nfunction stop ( event ) {\n\t\n\taudioSource.stop();\n}"};

				createScripts( script, library.objects[_id]);
		
			break;

			case "video":
				url = library.objects[_id].media;
				script = { name: library.objects[_id].name,  source: "var url = '"+url+"';\n\n//\nvar video;\nvar texture;\n\nfunction init ( event ){\n\n\tvideo = document.createElement('video');\n\tvideo.setAttribute(\"webkit-playsinline\",\"\");\n\tvideo.setAttribute(\"playsinline\",\"\");\n\tvideo.autoplay = true;\n\tvideo.loop = true;\n\tvideo.width\t= 1920;\n\tvideo.height = 1080;\n\tvideo.src = url;\n\tvideo.load();\n\n\t// create the texture\n\ttexture\t= new THREE.VideoTexture( video );\n\t// expose texture as this.texture\n\t\n\tvideo.play();\n\n}\n\nfunction update( event ) {\n\n\tif( video.readyState !== video.HAVE_ENOUGH_DATA )\treturn;\n\t\ttexture.needsUpdate\t= true;\t\n\n\tthis.material\t= new THREE.MeshBasicMaterial({\n\t\tmap\t: texture\n\t});\n}\n\nfunction stop ( event ) {\n\n\tvideo.pause();\n}"};

				createScripts( script, library.objects[_id]);
		
			break;

			case "code":

				var dloader = new THREE.XHRLoader();
				dloader.crossOrigin = '';

				var lurl = library.objects[_id].media;

				dloader.load(lurl, function ( text ) {

					
					url = text;
					script = { name: library.objects[_id].name,  source: url};

					createScripts( script, library.objects[_id]);

				} );

			default:
			break;
		}
	}

	function createScripts( _script, _object ){

		var element = document.createElement( "div" );

		element.className = "list-item";

		var tags = _object.tags[0];
		element.innerHTML = template.replace('$', _object.name ).replace('£', _object.user.name ).replace('?', _object.description ).replace('!', tags );
		// element.innerHTML = template;

		// element.children(".nameHere")[0].innerHTML

		// scene.element = element.querySelector(".scene");
		// console.log(element.querySelector("#addButton"));	
		content.appendChild( element );

		var _butt = element.querySelector("#addButton");

		_butt.addEventListener('click', function(){
			 window.parent.main.editor.addScriptNew(_script);
			 window.parent.closeIFrame();

		});
	}

	//For 3D objects
	this.createScenes = function(_object, file){

		var scene = new THREE.Scene();

		// console.log(_object);
		var _name = getDisplayName(_object.name);

		console.log(_object);

		// make a list item
		var element = document.createElement( "div" );

		element.className = "list-item";
		var _libraryEntry = getDisplayName(_object);
		var tags = _libraryEntry.tags[0];
		element.innerHTML = template.replace('$', _libraryEntry.name ).replace('£', _libraryEntry.user.name ).replace('?', _libraryEntry.description ).replace('!', tags );

		var _butt = element.querySelector("#addButton");
		// console.log(_butt);
		_butt.addEventListener('click', function(){
			 window.parent.editor.loader.loadFile(file);
			 window.parent.closeIFrame();
			 // $(".modal-box, .modal-overlay").fadeOut(500, function() {
    //             $(".modal-overlay").remove();

    //         });
		});

		scene.userData.element = element.querySelector( ".scene" );
		content.appendChild( element );
		var camera = new THREE.PerspectiveCamera( 50, 1, 0.1, 1000 );
		// camera.position.z = 2;
		// Convert camera fov degrees to radians
		var fov = camera.fov * ( Math.PI / 180 ); 
				// _object.scale.set(_size,_size,_size);
		_object.geometry.computeBoundingBox();




		var width = _object.geometry.boundingBox.max.x - _object.geometry.boundingBox.min.x;
		var height = _object.geometry.boundingBox.max.y - _object.geometry.boundingBox.min.y;
		var depth = _object.geometry.boundingBox.max.z - _object.geometry.boundingBox.min.z;

		// Calculate the camera distance
		var _size = Math.max(depth, Math.max(width,height));

		var distance = Math.abs( _size / Math.sin( fov / 2 ) );
		camera.position.z = distance;
		scene.userData.camera = camera;

		controls = new THREE.OrbitControls( scene.userData.camera, scene.userData.element );
		
		controls.minDistance = distance*0.2;
		controls.maxDistance = distance*2;
		controls.enablePan = true;
		controls.enableZoom = true;
		scene.userData.controls = controls;

		// _object.geometry.computeBoundingBox();

		// var _size = uniformDimension / Math.max(depth, Math.max(width,height));
				scene.add(_object);

		scene.add( new THREE.HemisphereLight( 0xaaaaaa, 0x444444 ) );
		var light = new THREE.DirectionalLight( 0xffffff, 0.5 );
		light.position.set( 1, 1, 1 );
		scene.add( light );
		scenes.push( scene );


	};

	function getDisplayName( _object ){

		for(var i = 0; i < library.objects.length; i++){

			var name = library.objects[i].media;

			if(name == _object.name)
				return library.objects[i];

		} 

		return null;
		// } );

	}

	function blobToFile(theBlob, fileName){
	    //A Blob() is almost a File() - it's just missing the two properties below which we will add
	    theBlob.lastModifiedDate = new Date();
	    theBlob.name = fileName;
	    return theBlob;
	}

	function updateSize() {

		var width = canvas.clientWidth;
		var height = canvas.clientHeight;

		if ( canvas.width !== width || canvas.height != height ) {

			renderer.setSize ( width, height, false );

		}

	}

	function animate() {

		render();
		requestAnimationFrame( animate );

	}

	function render() {

		updateSize();
		renderer.setClearColor( 0xffffff );
		// renderer.setScissorTest( false );
		renderer.clear();
		renderer.setClearColor( 0xe0e0e0 );
		// renderer.setScissorTest( true );

		scenes.forEach( function( scene ) {
			// so something moves
			scene.children[0].rotation.y = Date.now() * 0.0001;
			// get the element that is a place holder for where we want to
			// draw the scene
			var element = scene.userData.element;
			// get its position relative to the page's viewport
			var rect = element.getBoundingClientRect();
			// check if it's offscreen. If so skip it
			if ( rect.bottom < 0 || rect.top  > renderer.domElement.clientHeight ||
				 rect.right  < 0 || rect.left > renderer.domElement.clientWidth ) {
				return;  // it's off screen
			}
			// set the viewport
			var width  = rect.right - rect.left;
			var height = rect.bottom - rect.top;
			var left   = rect.left;
			var bottom = renderer.domElement.clientHeight - rect.bottom;
			renderer.setViewport( left, bottom, width, height );
			renderer.setScissor( left, bottom, width, height );
			var camera = scene.userData.camera;
			//camera.aspect = width / height; // not changing in this example
			//camera.updateProjectionMatrix();
			//scene.userData.controls.update();
			renderer.render( scene, camera );
		} );


	}
}
// File:editor/library/LibraryLoader.js

/**
 * @author mrdoob / http://mrdoob.com/
 */

var LibraryLoader = function ( library ) {

	var scope = this;
	var Library = library;

	this.texturePath = '';

	this.loadFile = function ( file ) {

		// library.createScenes(file, _id);
		console.log(file);

		var filename = file.name;
		var extension = filename.split( '.' ).pop().toLowerCase();

		switch ( extension ) {

			case 'amf':

				var reader = new FileReader();
				reader.addEventListener( 'load', function ( event ) {

					var loader = new THREE.AMFLoader();
					var amfobject = loader.parse( event.target.result );

					// editor.execute( new AddObjectCommand( amfobject ) );

				}, false );
				reader.readAsArrayBuffer( file );

				break;

			case 'awd':

				var reader = new FileReader();
				reader.addEventListener( 'load', function ( event ) {

					var loader = new THREE.AWDLoader();
					var scene = loader.parse( event.target.result );

					// editor.execute( new SetSceneCommand( scene ) );

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

					// editor.execute( new SetSceneCommand( scene ) );

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

					// editor.execute( new AddObjectCommand( mesh ) );

				}, false );
				reader.readAsText( file );

				break;

			// case 'ctm':

			// 	var reader = new FileReader();
			// 	reader.addEventListener( 'load', function ( event ) {

			// 		var data = new Uint8Array( event.target.result );

			// 		var stream = new CTM.Stream( data );
			// 		stream.offset = 0;

			// 		var loader = new THREE.CTMLoader();
			// 		loader.createModel( new CTM.File( stream ), function( geometry ) {

			// 			geometry.sourceType = "ctm";
			// 			geometry.sourceFile = file.name;

			// 			var material = new THREE.MeshStandardMaterial();

			// 			var mesh = new THREE.Mesh( geometry, material );
			// 			mesh.name = filename;

			// 			// editor.execute( new AddObjectCommand( mesh ) );

			// 		} );

			// 	}, false );
			// 	reader.readAsArrayBuffer( file );

			// 	break;

			case 'dae':

				var reader = new FileReader();
				reader.addEventListener( 'load', function ( event ) {

					var contents = event.target.result;

					var loader = new THREE.ColladaLoader();
					var collada = loader.parse( contents );

					collada.scene.name = filename;

					// editor.execute( new AddObjectCommand( collada.scene ) );

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

					// editor.execute( new AddObjectCommand( collada.scene ) );

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

					// editor.execute( new AddObjectCommand( mesh ) );

				}, false );
				reader.readAsArrayBuffer( file );

				break;

			case 'obj':

				var reader = new FileReader();
				reader.addEventListener( 'load', function ( event ) {

					var contents = event.target.result;

					var object = new THREE.OBJLoader().parse( contents );
					object.name = filename;

					// editor.execute( new AddObjectCommand( object ) );

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

					// editor.execute( new AddObjectCommand( object ) );

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

					// editor.execute( new AddObjectCommand( mesh ) );

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

					// editor.execute( new AddObjectCommand( mesh ) );

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

					// editor.execute( new AddObjectCommand( mesh ) );

				}, false );
				reader.readAsText( file );

				break;

			case 'wrl':

				var reader = new FileReader();
				reader.addEventListener( 'load', function ( event ) {

					var contents = event.target.result;

					var result = new THREE.VRMLLoader().parse( contents );

					// editor.exec ute( new SetSceneCommand( result ) );

				}, false );
				reader.readAsText( file );

				break;

			default:

				alert( 'Unsupported file format (' + extension +  ').' );

				break;

		}

	};

	function handleJSON( data, file, filename, _id ) {

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

				var loader = new THREE.BufferGeometryLoader();
				var result = loader.parse( data );

				var mesh = new THREE.Mesh( result );

				// editor.execute( new AddObjectCommand( mesh ) );
				library.createScenes(result);

				break;

			case 'geometry':

				var loader = new THREE.JSONLoader();
				loader.setTexturePath( scope.texturePath );

				var result = loader.parse( data );

				var geometry = result.geometry;
				var material;

				if ( result.materials !== undefined ) {

					if ( result.materials.length > 1 ) {

						material = new THREE.MeshFaceMaterial( result.materials );

					} else {

						material = result.materials[ 0 ];

					}

				} else {

					material = new THREE.MeshStandardMaterial();

				}

				geometry.sourceType = "ascii";
				geometry.sourceFile = file.name;

				var mesh;

				if ( geometry.animation && geometry.animation.hierarchy ) {

					mesh = new THREE.SkinnedMesh( geometry, material );

				} else {

					mesh = new THREE.Mesh( geometry, material );

				}

				mesh.name = filename;

				// editor.execute( new AddObjectCommand( mesh ) );
				Library.createScenes(mesh, file);


				break;

			case 'object':

				var loader = new THREE.ObjectLoader();
				loader.setTexturePath( scope.texturePath );

				var result = loader.parse( data );

				if ( result instanceof THREE.Scene ) {

					// editor.execute( new SetSceneCommand( result ) );

				} else {

					// editor.execute( new AddObjectCommand( result ) );
					console.log(result);
					// sobjects.add(result);
					library.createScenes(result);
				}

				break;

			case 'scene':

				// DEPRECATED

				var loader = new THREE.SceneLoader();
				loader.parse( data, function ( result ) {

					// editor.execute( new SetSceneCommand( result.scene ) );

				}, '' );

				break;

			case 'app':

				// editor.fromJSON( data );

				break;

		}

	}

};

// File:examples/js/controls/OrbitControls.js

/**
 * @author qiao / https://github.com/qiao
 * @author mrdoob / http://mrdoob.com
 * @author alteredq / http://alteredqualia.com/
 * @author WestLangley / http://github.com/WestLangley
 * @author erich666 / http://erichaines.com
 */

// This set of controls performs orbiting, dollying (zooming), and panning.
// Unlike TrackballControls, it maintains the "up" direction object.up (+Y by default).
//
//    Orbit - left mouse / touch: one finger move
//    Zoom - middle mouse, or mousewheel / touch: two finger spread or squish
//    Pan - right mouse, or arrow keys / touch: three finter swipe

THREE.OrbitControls = function ( object, domElement ) {

	this.object = object;

	this.domElement = ( domElement !== undefined ) ? domElement : document;

	// Set to false to disable this control
	this.enabled = true;

	// "target" sets the location of focus, where the object orbits around
	this.target = new THREE.Vector3();

	// How far you can dolly in and out ( PerspectiveCamera only )
	this.minDistance = 0;
	this.maxDistance = Infinity;

	// How far you can zoom in and out ( OrthographicCamera only )
	this.minZoom = 0;
	this.maxZoom = Infinity;

	// How far you can orbit vertically, upper and lower limits.
	// Range is 0 to Math.PI radians.
	this.minPolarAngle = 0; // radians
	this.maxPolarAngle = Math.PI; // radians

	// How far you can orbit horizontally, upper and lower limits.
	// If set, must be a sub-interval of the interval [ - Math.PI, Math.PI ].
	this.minAzimuthAngle = - Infinity; // radians
	this.maxAzimuthAngle = Infinity; // radians

	// Set to true to enable damping (inertia)
	// If damping is enabled, you must call controls.update() in your animation loop
	this.enableDamping = false;
	this.dampingFactor = 0.25;

	// This option actually enables dollying in and out; left as "zoom" for backwards compatibility.
	// Set to false to disable zooming
	this.enableZoom = true;
	this.zoomSpeed = 1.0;

	// Set to false to disable rotating
	this.enableRotate = true;
	this.rotateSpeed = 1.0;

	// Set to false to disable panning
	this.enablePan = true;
	this.keyPanSpeed = 7.0;	// pixels moved per arrow key push

	// Set to true to automatically rotate around the target
	// If auto-rotate is enabled, you must call controls.update() in your animation loop
	this.autoRotate = false;
	this.autoRotateSpeed = 2.0; // 30 seconds per round when fps is 60

	// Set to false to disable use of the keys
	this.enableKeys = true;

	// The four arrow keys
	this.keys = { LEFT: 37, UP: 38, RIGHT: 39, BOTTOM: 40 };

	// Mouse buttons
	this.mouseButtons = { ORBIT: THREE.MOUSE.LEFT, ZOOM: THREE.MOUSE.MIDDLE, PAN: THREE.MOUSE.RIGHT };

	// for reset
	this.target0 = this.target.clone();
	this.position0 = this.object.position.clone();
	this.zoom0 = this.object.zoom;

	//
	// public methods
	//

	this.getPolarAngle = function () {

		return phi;

	};

	this.getAzimuthalAngle = function () {

		return theta;

	};

	this.reset = function () {

		scope.target.copy( scope.target0 );
		scope.object.position.copy( scope.position0 );
		scope.object.zoom = scope.zoom0;

		scope.object.updateProjectionMatrix();
		scope.dispatchEvent( changeEvent );

		scope.update();

		state = STATE.NONE;

	};

	// this method is exposed, but perhaps it would be better if we can make it private...
	this.update = function() {

		var offset = new THREE.Vector3();

		// so camera.up is the orbit axis
		var quat = new THREE.Quaternion().setFromUnitVectors( object.up, new THREE.Vector3( 0, 1, 0 ) );
		var quatInverse = quat.clone().inverse();

		var lastPosition = new THREE.Vector3();
		var lastQuaternion = new THREE.Quaternion();

		return function () {

			var position = scope.object.position;

			offset.copy( position ).sub( scope.target );

			// rotate offset to "y-axis-is-up" space
			offset.applyQuaternion( quat );

			// angle from z-axis around y-axis

			theta = Math.atan2( offset.x, offset.z );

			// angle from y-axis

			phi = Math.atan2( Math.sqrt( offset.x * offset.x + offset.z * offset.z ), offset.y );

			if ( scope.autoRotate && state === STATE.NONE ) {

				rotateLeft( getAutoRotationAngle() );

			}

			theta += thetaDelta;
			phi += phiDelta;

			// restrict theta to be between desired limits
			theta = Math.max( scope.minAzimuthAngle, Math.min( scope.maxAzimuthAngle, theta ) );

			// restrict phi to be between desired limits
			phi = Math.max( scope.minPolarAngle, Math.min( scope.maxPolarAngle, phi ) );

			// restrict phi to be betwee EPS and PI-EPS
			phi = Math.max( EPS, Math.min( Math.PI - EPS, phi ) );

			var radius = offset.length() * scale;

			// restrict radius to be between desired limits
			radius = Math.max( scope.minDistance, Math.min( scope.maxDistance, radius ) );

			// move target to panned location
			scope.target.add( panOffset );

			offset.x = radius * Math.sin( phi ) * Math.sin( theta );
			offset.y = radius * Math.cos( phi );
			offset.z = radius * Math.sin( phi ) * Math.cos( theta );

			// rotate offset back to "camera-up-vector-is-up" space
			offset.applyQuaternion( quatInverse );

			position.copy( scope.target ).add( offset );

			scope.object.lookAt( scope.target );

			if ( scope.enableDamping === true ) {

				thetaDelta *= ( 1 - scope.dampingFactor );
				phiDelta *= ( 1 - scope.dampingFactor );

			} else {

				thetaDelta = 0;
				phiDelta = 0;

			}

			scale = 1;
			panOffset.set( 0, 0, 0 );

			// update condition is:
			// min(camera displacement, camera rotation in radians)^2 > EPS
			// using small-angle approximation cos(x/2) = 1 - x^2 / 8

			if ( zoomChanged ||
				lastPosition.distanceToSquared( scope.object.position ) > EPS ||
				8 * ( 1 - lastQuaternion.dot( scope.object.quaternion ) ) > EPS ) {

				scope.dispatchEvent( changeEvent );

				lastPosition.copy( scope.object.position );
				lastQuaternion.copy( scope.object.quaternion );
				zoomChanged = false;

				return true;

			}

			return false;

		};

	}();

	this.dispose = function() {

		scope.domElement.removeEventListener( 'contextmenu', onContextMenu, false );
		scope.domElement.removeEventListener( 'mousedown', onMouseDown, false );
		scope.domElement.removeEventListener( 'mousewheel', onMouseWheel, false );
		scope.domElement.removeEventListener( 'MozMousePixelScroll', onMouseWheel, false ); // firefox

		scope.domElement.removeEventListener( 'touchstart', onTouchStart, false );
		scope.domElement.removeEventListener( 'touchend', onTouchEnd, false );
		scope.domElement.removeEventListener( 'touchmove', onTouchMove, false );

		document.removeEventListener( 'mousemove', onMouseMove, false );
		document.removeEventListener( 'mouseup', onMouseUp, false );
		document.removeEventListener( 'mouseout', onMouseUp, false );

		window.removeEventListener( 'keydown', onKeyDown, false );

		//scope.dispatchEvent( { type: 'dispose' } ); // should this be added here?

	}

	//
	// internals
	//

	var scope = this;

	var changeEvent = { type: 'change' };
	var startEvent = { type: 'start' };
	var endEvent = { type: 'end' };

	var STATE = { NONE : - 1, ROTATE : 0, DOLLY : 1, PAN : 2, TOUCH_ROTATE : 3, TOUCH_DOLLY : 4, TOUCH_PAN : 5 };

	var state = STATE.NONE;

	var EPS = 0.000001;

	// current position in spherical coordinates
	var theta;
	var phi;

	var phiDelta = 0;
	var thetaDelta = 0;
	var scale = 1;
	var panOffset = new THREE.Vector3();
	var zoomChanged = false;

	var rotateStart = new THREE.Vector2();
	var rotateEnd = new THREE.Vector2();
	var rotateDelta = new THREE.Vector2();

	var panStart = new THREE.Vector2();
	var panEnd = new THREE.Vector2();
	var panDelta = new THREE.Vector2();

	var dollyStart = new THREE.Vector2();
	var dollyEnd = new THREE.Vector2();
	var dollyDelta = new THREE.Vector2();

	function getAutoRotationAngle() {

		return 2 * Math.PI / 60 / 60 * scope.autoRotateSpeed;

	}

	function getZoomScale() {

		return Math.pow( 0.95, scope.zoomSpeed );

	}

	function rotateLeft( angle ) {

		thetaDelta -= angle;

	}

	function rotateUp( angle ) {

		phiDelta -= angle;

	}

	var panLeft = function() {

		var v = new THREE.Vector3();

		return function panLeft( distance, objectMatrix ) {

			var te = objectMatrix.elements;

			// get X column of objectMatrix
			v.set( te[ 0 ], te[ 1 ], te[ 2 ] );

			v.multiplyScalar( - distance );

			panOffset.add( v );

		};

	}();

	var panUp = function() {

		var v = new THREE.Vector3();

		return function panUp( distance, objectMatrix ) {

			var te = objectMatrix.elements;

			// get Y column of objectMatrix
			v.set( te[ 4 ], te[ 5 ], te[ 6 ] );

			v.multiplyScalar( distance );

			panOffset.add( v );

		};

	}();

	// deltaX and deltaY are in pixels; right and down are positive
	var pan = function() {

		var offset = new THREE.Vector3();

		return function( deltaX, deltaY ) {

			var element = scope.domElement === document ? scope.domElement.body : scope.domElement;

			if ( scope.object instanceof THREE.PerspectiveCamera ) {

				// perspective
				var position = scope.object.position;
				offset.copy( position ).sub( scope.target );
				var targetDistance = offset.length();

				// half of the fov is center to top of screen
				targetDistance *= Math.tan( ( scope.object.fov / 2 ) * Math.PI / 180.0 );

				// we actually don't use screenWidth, since perspective camera is fixed to screen height
				panLeft( 2 * deltaX * targetDistance / element.clientHeight, scope.object.matrix );
				panUp( 2 * deltaY * targetDistance / element.clientHeight, scope.object.matrix );

			} else if ( scope.object instanceof THREE.OrthographicCamera ) {

				// orthographic
				panLeft( deltaX * ( scope.object.right - scope.object.left ) / element.clientWidth, scope.object.matrix );
				panUp( deltaY * ( scope.object.top - scope.object.bottom ) / element.clientHeight, scope.object.matrix );

			} else {

				// camera neither orthographic nor perspective
				console.warn( 'WARNING: OrbitControls.js encountered an unknown camera type - pan disabled.' );
				scope.enablePan = false;

			}

		};

	}();

	function dollyIn( dollyScale ) {

		if ( scope.object instanceof THREE.PerspectiveCamera ) {

			scale /= dollyScale;

		} else if ( scope.object instanceof THREE.OrthographicCamera ) {

			scope.object.zoom = Math.max( scope.minZoom, Math.min( scope.maxZoom, scope.object.zoom * dollyScale ) );
			scope.object.updateProjectionMatrix();
			zoomChanged = true;

		} else {

			console.warn( 'WARNING: OrbitControls.js encountered an unknown camera type - dolly/zoom disabled.' );
			scope.enableZoom = false;

		}

	}

	function dollyOut( dollyScale ) {

		if ( scope.object instanceof THREE.PerspectiveCamera ) {

			scale *= dollyScale;

		} else if ( scope.object instanceof THREE.OrthographicCamera ) {

			scope.object.zoom = Math.max( scope.minZoom, Math.min( scope.maxZoom, scope.object.zoom / dollyScale ) );
			scope.object.updateProjectionMatrix();
			zoomChanged = true;

		} else {

			console.warn( 'WARNING: OrbitControls.js encountered an unknown camera type - dolly/zoom disabled.' );
			scope.enableZoom = false;

		}

	}

	//
	// event callbacks - update the object state
	//

	var handleMouseDownRotate = function( event ) {

		//console.log( 'handleMouseDownRotate' );

		rotateStart.set( event.clientX, event.clientY );

	};

	var handleMouseDownDolly = function( event ) {

		//console.log( 'handleMouseDownDolly' );

		dollyStart.set( event.clientX, event.clientY );

	};

	var handleMouseDownPan = function( event ) {

		//console.log( 'handleMouseDownPan' );

		panStart.set( event.clientX, event.clientY );

	};

	var handleMouseMoveRotate = function( event ) {

		//console.log( 'handleMouseMoveRotate' );

		rotateEnd.set( event.clientX, event.clientY );
		rotateDelta.subVectors( rotateEnd, rotateStart );

		var element = scope.domElement === document ? scope.domElement.body : scope.domElement;

		// rotating across whole screen goes 360 degrees around
		rotateLeft( 2 * Math.PI * rotateDelta.x / element.clientWidth * scope.rotateSpeed );

		// rotating up and down along whole screen attempts to go 360, but limited to 180
		rotateUp( 2 * Math.PI * rotateDelta.y / element.clientHeight * scope.rotateSpeed );

		rotateStart.copy( rotateEnd );

		scope.update();

	};

	var handleMouseMoveDolly = function( event ) {

		//console.log( 'handleMouseMoveDolly' );

		dollyEnd.set( event.clientX, event.clientY );

		dollyDelta.subVectors( dollyEnd, dollyStart );

		if ( dollyDelta.y > 0 ) {

			dollyIn( getZoomScale() );

		} else if ( dollyDelta.y < 0 ) {

			dollyOut( getZoomScale() );

		}

		dollyStart.copy( dollyEnd );

		scope.update();

	};

	var handleMouseMovePan = function( event ) {

		//console.log( 'handleMouseMovePan' );

		panEnd.set( event.clientX, event.clientY );

		panDelta.subVectors( panEnd, panStart );

		pan( panDelta.x, panDelta.y );

		panStart.copy( panEnd );

		scope.update();

	};

	var handleMouseUp = function( event ) {

		//console.log( 'handleMouseUp' );

	};

	var handleMouseWheel = function( event ) {

		//console.log( 'handleMouseWheel' );

		var delta = 0;

		if ( event.wheelDelta !== undefined ) {

			// WebKit / Opera / Explorer 9

			delta = event.wheelDelta;

		} else if ( event.detail !== undefined ) {

			// Firefox

			delta = - event.detail;

		}

		if ( delta > 0 ) {

			dollyOut( getZoomScale() );

		} else if ( delta < 0 ) {

			dollyIn( getZoomScale() );

		}

		scope.update();

	};

	var handleKeyDown = function( event ) {

		//console.log( 'handleKeyDown' );

		switch ( event.keyCode ) {

			case scope.keys.UP:
				pan( 0, scope.keyPanSpeed );
				scope.update();
				break;

			case scope.keys.BOTTOM:
				pan( 0, - scope.keyPanSpeed );
				scope.update();
				break;

			case scope.keys.LEFT:
				pan( scope.keyPanSpeed, 0 );
				scope.update();
				break;

			case scope.keys.RIGHT:
				pan( - scope.keyPanSpeed, 0 );
				scope.update();
				break;

		}

	};

	var handleTouchStartRotate = function( event ) {

		//console.log( 'handleTouchStartRotate' );

		rotateStart.set( event.touches[ 0 ].pageX, event.touches[ 0 ].pageY );

	};

	var handleTouchStartDolly = function( event ) {

		//console.log( 'handleTouchStartDolly' );

		var dx = event.touches[ 0 ].pageX - event.touches[ 1 ].pageX;
		var dy = event.touches[ 0 ].pageY - event.touches[ 1 ].pageY;

		var distance = Math.sqrt( dx * dx + dy * dy );

		dollyStart.set( 0, distance );

	};

	var handleTouchStartPan = function( event ) {

		//console.log( 'handleTouchStartPan' );

		panStart.set( event.touches[ 0 ].pageX, event.touches[ 0 ].pageY );

	};

	var handleTouchMoveRotate = function( event ) {

		//console.log( 'handleTouchMoveRotate' );

		rotateEnd.set( event.touches[ 0 ].pageX, event.touches[ 0 ].pageY );
		rotateDelta.subVectors( rotateEnd, rotateStart );

		var element = scope.domElement === document ? scope.domElement.body : scope.domElement;

		// rotating across whole screen goes 360 degrees around
		rotateLeft( 2 * Math.PI * rotateDelta.x / element.clientWidth * scope.rotateSpeed );

		// rotating up and down along whole screen attempts to go 360, but limited to 180
		rotateUp( 2 * Math.PI * rotateDelta.y / element.clientHeight * scope.rotateSpeed );

		rotateStart.copy( rotateEnd );

		scope.update();

	};

	var handleTouchMoveDolly = function( event ) {

		//console.log( 'handleTouchMoveDolly' );

		var dx = event.touches[ 0 ].pageX - event.touches[ 1 ].pageX;
		var dy = event.touches[ 0 ].pageY - event.touches[ 1 ].pageY;

		var distance = Math.sqrt( dx * dx + dy * dy );

		dollyEnd.set( 0, distance );

		dollyDelta.subVectors( dollyEnd, dollyStart );

		if ( dollyDelta.y > 0 ) {

			dollyOut( getZoomScale() );

		} else if ( dollyDelta.y < 0 ) {

			dollyIn( getZoomScale() );

		}

		dollyStart.copy( dollyEnd );

		scope.update();

	};

	var handleTouchMovePan = function( event ) {

		//console.log( 'handleTouchMovePan' );

		panEnd.set( event.touches[ 0 ].pageX, event.touches[ 0 ].pageY );

		panDelta.subVectors( panEnd, panStart );

		pan( panDelta.x, panDelta.y );

		panStart.copy( panEnd );

		scope.update();

	};

	var handleTouchEnd = function( event ) {

		//console.log( 'handleTouchEnd' );

	};

	//
	// event handlers - FSM: listen for events and reset state
	//

	function onMouseDown( event ) {

		if ( scope.enabled === false ) return;

		event.preventDefault();

		if ( event.button === scope.mouseButtons.ORBIT ) {

			if ( scope.enableRotate === false ) return;

			handleMouseDownRotate( event );

			state = STATE.ROTATE;

		} else if ( event.button === scope.mouseButtons.ZOOM ) {

			if ( scope.enableZoom === false ) return;

			handleMouseDownDolly( event );

			state = STATE.DOLLY;

		} else if ( event.button === scope.mouseButtons.PAN ) {

			if ( scope.enablePan === false ) return;

			handleMouseDownPan( event );

			state = STATE.PAN;

		}

		if ( state !== STATE.NONE ) {

			document.addEventListener( 'mousemove', onMouseMove, false );
			document.addEventListener( 'mouseup', onMouseUp, false );
			document.addEventListener( 'mouseout', onMouseUp, false );

			scope.dispatchEvent( startEvent );

		}

	};

	function onMouseMove( event ) {

		if ( scope.enabled === false ) return;

		event.preventDefault();

		if ( state === STATE.ROTATE ) {

			if ( scope.enableRotate === false ) return;

			handleMouseMoveRotate( event );

		} else if ( state === STATE.DOLLY ) {

			if ( scope.enableZoom === false ) return;

			handleMouseMoveDolly( event );

		} else if ( state === STATE.PAN ) {

			if ( scope.enablePan === false ) return;

			handleMouseMovePan( event );

		}

	};

	function onMouseUp( event ) {

		if ( scope.enabled === false ) return;

		handleMouseUp( event );

		document.removeEventListener( 'mousemove', onMouseMove, false );
		document.removeEventListener( 'mouseup', onMouseUp, false );
		document.removeEventListener( 'mouseout', onMouseUp, false );

		scope.dispatchEvent( endEvent );

		state = STATE.NONE;

	};

	function onMouseWheel( event ) {

		if ( scope.enabled === false || scope.enableZoom === false || state !== STATE.NONE ) return;

		event.preventDefault();
		event.stopPropagation();

		handleMouseWheel( event );

		scope.dispatchEvent( startEvent ); // not sure why these are here...
		scope.dispatchEvent( endEvent );

	};

	function onKeyDown( event ) {

		if ( scope.enabled === false || scope.enableKeys === false || scope.enablePan === false ) return;

		handleKeyDown( event );

	};

	function onTouchStart( event ) {

		if ( scope.enabled === false ) return;

		switch ( event.touches.length ) {

			case 1:	// one-fingered touch: rotate

				if ( scope.enableRotate === false ) return;

				handleTouchStartRotate( event );

				state = STATE.TOUCH_ROTATE;

				break;

			case 2:	// two-fingered touch: dolly

				if ( scope.enableZoom === false ) return;

				handleTouchStartDolly( event );

				state = STATE.TOUCH_DOLLY;

				break;

			case 3: // three-fingered touch: pan

				if ( scope.enablePan === false ) return;

				handleTouchStartPan( event );

				state = STATE.TOUCH_PAN;

				break;

			default:

				state = STATE.NONE;

		}

		if ( state !== STATE.NONE ) {

			scope.dispatchEvent( startEvent );

		}

	};

	function onTouchMove( event ) {

		if ( scope.enabled === false ) return;

		event.preventDefault();
		event.stopPropagation();

		switch ( event.touches.length ) {

			case 1: // one-fingered touch: rotate

				if ( scope.enableRotate === false ) return;
				if ( state !== STATE.TOUCH_ROTATE ) return; // is this needed?...

				handleTouchMoveRotate( event );

				break;

			case 2: // two-fingered touch: dolly

				if ( scope.enableZoom === false ) return;
				if ( state !== STATE.TOUCH_DOLLY ) return; // is this needed?...

				handleTouchMoveDolly( event );

				break;

			case 3: // three-fingered touch: pan

				if ( scope.enablePan === false ) return;
				if ( state !== STATE.TOUCH_PAN ) return; // is this needed?...

				handleTouchMovePan( event );

				break;

			default:

				state = STATE.NONE;

		}

	};

	function onTouchEnd( event ) {

		if ( scope.enabled === false ) return;

		handleTouchEnd( event );

		scope.dispatchEvent( endEvent );

		state = STATE.NONE;

	};

	function onContextMenu( event ) {

		//console.log( 'onContextMenu' );

		event.preventDefault();

	};

	//

	function init() {

		scope.domElement.addEventListener( 'contextmenu', onContextMenu, false );

		scope.domElement.addEventListener( 'mousedown', onMouseDown, false );
		scope.domElement.addEventListener( 'mousewheel', onMouseWheel, false );
		scope.domElement.addEventListener( 'MozMousePixelScroll', onMouseWheel, false ); // firefox

		scope.domElement.addEventListener( 'touchstart', onTouchStart, false );
		scope.domElement.addEventListener( 'touchend', onTouchEnd, false );
		scope.domElement.addEventListener( 'touchmove', onTouchMove, false );

		window.addEventListener( 'keydown', onKeyDown, false );

	};

	init();

	// force an update at start

	this.update();

};

THREE.OrbitControls.prototype = Object.create( THREE.EventDispatcher.prototype );
THREE.OrbitControls.prototype.constructor = THREE.OrbitControls;

Object.defineProperties( THREE.OrbitControls.prototype, {

	center: {

		get: function () {

			console.warn( 'THREE.OrbitControls: .center has been renamed to .target' );
			return this.target;

		}

	},

	// backward compatibility

	noZoom: {

		get: function () {

			console.warn( 'THREE.OrbitControls: .noZoom has been deprecated. Use .enableZoom instead.' );
			return ! this.enableZoom;

		},

		set: function ( value ) {

			console.warn( 'THREE.OrbitControls: .noZoom has been deprecated. Use .enableZoom instead.' );
			this.enableZoom = ! value;

		}

	},

	noRotate: {

		get: function () {

			console.warn( 'THREE.OrbitControls: .noRotate has been deprecated. Use .enableRotate instead.' );
			return ! this.enableRotate;

		},

		set: function ( value ) {

			console.warn( 'THREE.OrbitControls: .noRotate has been deprecated. Use .enableRotate instead.' );
			this.enableRotate = ! value;

		}

	},

	noPan: {

		get: function () {

			console.warn( 'THREE.OrbitControls: .noPan has been deprecated. Use .enablePan instead.' );
			return ! this.enablePan;

		},

		set: function ( value ) {

			console.warn( 'THREE.OrbitControls: .noPan has been deprecated. Use .enablePan instead.' );
			this.enablePan = ! value;

		}

	},

	noKeys: {

		get: function () {

			console.warn( 'THREE.OrbitControls: .noKeys has been deprecated. Use .enableKeys instead.' );
			return ! this.enableKeys;

		},

		set: function ( value ) {

			console.warn( 'THREE.OrbitControls: .noKeys has been deprecated. Use .enableKeys instead.' );
			this.enableKeys = ! value;

		}

	},

	staticMoving : {

		get: function () {

			console.warn( 'THREE.OrbitControls: .staticMoving has been deprecated. Use .enableDamping instead.' );
			return ! this.constraint.enableDamping;

		},

		set: function ( value ) {

			console.warn( 'THREE.OrbitControls: .staticMoving has been deprecated. Use .enableDamping instead.' );
			this.constraint.enableDamping = ! value;

		}

	},

	dynamicDampingFactor : {

		get: function () {

			console.warn( 'THREE.OrbitControls: .dynamicDampingFactor has been renamed. Use .dampingFactor instead.' );
			return this.constraint.dampingFactor;

		},

		set: function ( value ) {

			console.warn( 'THREE.OrbitControls: .dynamicDampingFactor has been renamed. Use .dampingFactor instead.' );
			this.constraint.dampingFactor = value;

		}

	}

} );

