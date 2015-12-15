/**
 * @author Samuel Vonäsch / http://zaak.io
 */
var Library = function() {
	
	var canvas;

	var scenes = [], camera, renderer, emptyScene;

	var template = document.getElementById("template").text;
	var content = document.getElementById("content");

	var emptyScene = new THREE.Scene();

	var libLoader = new LibraryLoader(this);

	var id = 0;

	var uniformDimension = 3;

	init();
	animate();

	function init() {

		canvas = document.getElementById( "c" );

		camera = new THREE.PerspectiveCamera( 50, 1, 0.1, 100 );
		
		preloadLibrary();

		renderer = new THREE.WebGLRenderer( { canvas: canvas, antialias: true } );
		renderer.setClearColor( 0xFFFFFF );
	}


	function preloadLibrary(){

		var libraryURL = "./js/libraryList.json";

		var loader = new THREE.XHRLoader();
		loader.crossOrigin = '';

		loader.load( libraryURL, function ( text ) {

			library = JSON.parse( text );

			for(var i = 0; i < library.entries.length; i++){


				var name = library.entries[i].name + library.entries[i].format;
				// var myFile, myBlob; 

				loadObject(name, library);

				// var loader = new THREE.XHRLoader();
				// loader.crossOrigin = '';
				// loader.setWithCredentials(name);

				// loader.load( library.location + name, function ( text ) {

				// 	var fileParts = [text];

				// 	myBlob = new Blob(fileParts, {type : 'text/javascript'});
				// 	myFile = blobToFile(myBlob, name);

				// 	libLoader.loadFile( name );

				// });

			} 
		} );



		console.log("preloadDone");
	}

	function loadObject ( _name ){

		console.log(library)
		// var name = library.entries[i].name + library.entries[i].format;
		var myFile, myBlob; 

		var loader = new THREE.XHRLoader();
		loader.crossOrigin = '';

		loader.load( library.location + _name, function ( text ) {

			var fileParts = [text];

			myBlob = new Blob(fileParts, {type : 'text/javascript'});
			myFile = blobToFile(myBlob, _name);

			libLoader.loadFile( myFile );

		} );
	}


	this.createScenes = function(_object, file){

		var scene = new THREE.Scene();

		// console.log(_object);
		var _name = getDisplayName(_object.name);

		console.log(_object);

		// make a list item
		var element = document.createElement( "div" );
		element.type = "button"
		element.addEventListener('click', function(){
		    window.parent.editor.loader.loadFile(file);
		});
		element.className = "list-item";
		element.innerHTML = template.replace('$', _name );
		
		// id ++;

		// Look up the element that represents the area
		// we want to render the scene
		scene.element = element.querySelector(".scene");
		content.appendChild( element );

		_object.geometry.computeBoundingBox();

		var width = _object.geometry.boundingBox.max.x - _object.geometry.boundingBox.min.x;
		var height = _object.geometry.boundingBox.max.y - _object.geometry.boundingBox.min.y;
		var depth = _object.geometry.boundingBox.max.z - _object.geometry.boundingBox.min.z;

		var _size = uniformDimension / Math.max(depth, Math.max(width,height));
		
		_object.scale.set(_size,_size,_size);

		console.log(_object.scale);

		// radius = _object.geometry.boundingSphere.radius;
		// distanceFactor = Math.abs( camera.aspect * radius / Math.sin( camera.fov ));
		camera.position.z = 5;

		scene.add(_object);

		light = new THREE.HemisphereLight( 0xffbbbb, 0x444488 );
		light.position.set( - 0.5, 0.8, 1 );
		scene.add( light );

		scenes.push( scene );


	}

	function getDisplayName( meshName ){

		// var libraryURL = "./js/libraryList.json";

		// var loader = new THREE.XHRLoader();
		// loader.crossOrigin = '';

		// loader.load( libraryURL, function ( text ) {

		// 	library = JSON.parse( text );

		for(var i = 0; i < library.entries.length; i++){


			var name = library.entries[i].name + library.entries[i].format;
			var myFile, myBlob; 

			if(name == meshName)
				return library.entries[i].display_name;

		} 

		console.log("***");
		return "default";
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

		renderer.setClearColor( 0xFFFFFF );
		renderer.clear( true );
		renderer.setClearColor( 0xE0E0E0 );

		renderer.enableScissorTest( true );
		scenes.forEach( function( scene ) {

			// so something moves
			scene.children[0].rotation.y = Date.now() * 0.0001;

			// get the element that is a place holder for where we want to
			// draw the scene
			var element = scene.element;

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

			camera.aspect = width / height;
			camera.updateProjectionMatrix();
			renderer.setViewport( left, bottom, width, height );
			renderer.setScissor( left, bottom, width, height );
			renderer.render( scene, camera );


		} );
		renderer.enableScissorTest( false );

	}
}