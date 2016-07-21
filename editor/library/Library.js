"use strict";
/**
 * @author Samuel Vonäsch / http://zaak.io
 */
var Library = function(_src) {
	
	var canvas;

	var scenes = [], camera, renderer, library, controls;

	var template = document.getElementById("template").text;
	var content = document.getElementById("content");

	var libLoader = new LibraryLoader(this);

	var id = 0;

	var uniformDimension = 1;

	var librarySource = _src;


	init();
	animate();

	function init() {

		canvas = document.getElementById( "c" );
		
		renderer = new THREE.WebGLRenderer( { canvas: canvas } );
		renderer.setClearColor( 0xFFFFFF );
		// renderer.setPixelRatio( window.devicePixelRatio );	

	}


	this.loadLibrary = function(_filter){

		_filter = typeof _filter !== 'undefined' ? _filter : "3d";

		//Clean selection
		while (content.firstChild) {
		    content.removeChild(content.firstChild);
		}

		// console.log(¥beta.zaak.io/api/v1/asset?format=json&limit=1);
		// var libraryURL = librarySource+ "/lib"+_filter+".json";
		var libraryURL = BASE_URL + API_URL +'asset?format=json&category__slug=' + _filter;

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

				url = BASE_URL + library.objects[_id].media;

				loader.load( url, function ( text ) {

					var fileParts = [text];

					myBlob = new Blob(fileParts, {type : 'text/javascript'});
					myFile = blobToFile(myBlob, _name);

					libLoader.loadFile( myFile );

				} );
			break;

			case "audio":
				url = library.objects[_id].media;
				script = { name: library.objects[_id].name,  source: "//The url of the audioFile\nvar url = '"+url+"';\nvar autoplay = true;\nvar distance = 20;\n\n//Don't change these\nvar audioSource;\n\nfunction init ( event ){\n\n\taudioSource = new THREE.PositionalAudio(camera.getObjectByName('Listener'));\n\taudioSource.load( url );\n\taudioSource.setRefDistance( distance );\n\taudioSource.autoplay = autoplay;\n\tthis.add( audioSource );\n\n}\n\nfunction rayStart( event ){\n\t\t \n\tif(audioSource.isPlaying)\n\t \taudioSource.pause();\n\telse\n\t \taudioSource.play();\n\t\t\n\t\n}\n\nfunction stop ( event ) {\n\t\n\taudioSource.stop();\n}"};

				createAudio( script, library.objects[_id], url);
		
			break;

			case "video":
				url = library.objects[_id].media;
				script = { name: library.objects[_id].name,  source: "var url = '"+url+"';\n\n//\nvar video;\nvar texture;\n\nfunction init ( event ){\n\n\tvideo = document.createElement('video');\n\tvideo.setAttribute(\"webkit-playsinline\",\"\");\n\tvideo.setAttribute(\"playsinline\",\"\");\n\tvideo.autoplay = true;\n\tvideo.loop = true;\n\tvideo.width\t= 1920;\n\tvideo.height = 1080;\n\tvideo.src = url;\n\tvideo.load();\n\n\t// create the texture\n\ttexture\t= new THREE.VideoTexture( video );\n\t// expose texture as this.texture\n\t\n\tvideo.play();\n\n}\n\nfunction update( event ) {\n\n\tif( video.readyState !== video.HAVE_ENOUGH_DATA )\treturn;\n\t\ttexture.needsUpdate\t= true;\t\n\n\tthis.material\t= new THREE.MeshBasicMaterial({\n\t\tmap\t: texture\n\t});\n}\n\nfunction stop ( event ) {\n\n\tvideo.pause();\n}"};

				createVideo( script, library.objects[_id], url);
		
			break;

			case "code":

				var dloader = new THREE.XHRLoader();
				dloader.crossOrigin = '';

				var url = BASE_URL + library.objects[_id].media;

				dloader.load(url, function ( text ) {

					
					url = text;
					script = { name: library.objects[_id].name,  source: url};

					createScripts( script, library.objects[_id]);

				} );

			default:
			break;
		}
	}

	function createVideo( _script, _object, _url ){

		var element = document.createElement( "div" );

		element.className = "list-item";

		var tags = _object.tags[0];
		element.innerHTML = template.replace('$', _object.name ).replace('£', _object.user.name ).replace('?', _object.description ).replace('!', tags );
		// element.innerHTML = template;

		// element.children(".nameHere")[0].innerHTML

		var video = document.createElement('video');

		video.setAttribute("controls","controls");

		var s = video.style;
		s.width = '100%';

		var source = document.createElement('source');

		source.src = BASE_URL + _url;
		// source.type = "video/mp4";
	

		video.appendChild(source);

		element.querySelector(".scene").appendChild(video);
		// console.log(element.querySelector("#addButton"));	
		content.appendChild( element );

		var _butt = element.querySelector("#addButton");

		_butt.addEventListener('click', function(){
			 window.parent.main.editor.addScriptNew(_script);
			 window.parent.closeIFrame();

		});
	}

	function createAudio( _script, _object, _url ){

		var element = document.createElement( "div" );

		element.className = "list-item";

		var tags = _object.tags[0];
		element.innerHTML = template.replace('$', _object.name ).replace('£', _object.user.name ).replace('?', _object.description ).replace('!', tags );
		// element.innerHTML = template;

		// element.children(".nameHere")[0].innerHTML

		var audio = document.createElement('audio');

		audio.setAttribute("controls","controls");

		var s = audio.style;
		s.width = '100%';
		// s.top = '0';
		// s.bottom = '0';

		var source = document.createElement('source');

		source.src = BASE_URL + _url;
		// source.type = "video/mp4";
	

		audio.appendChild(source);

		element.querySelector(".scene").appendChild(audio);
		// console.log(element.querySelector("#addButton"));	
		content.appendChild( element );

		var _butt = element.querySelector("#addButton");

		_butt.addEventListener('click', function(){
			 window.parent.main.editor.addScriptNew(_script);
			 window.parent.closeIFrame();

		});
	}

	function createScripts( _script, _object, _url ){

		var element = document.createElement( "div" );

		element.className = "list-item";

		var tags = _object.tags[0];
		element.innerHTML = template.replace('$', _object.name ).replace('£', _object.user.name ).replace('?', _object.description ).replace('!', tags );

		content.appendChild( element );

		var img = document.createElement('img')

		// img.style.height = '120px';
		img.src = IMAGES_URL + "/code.png";

		element.querySelector(".scene").appendChild(img);

		var _butt = element.querySelector("#addButton");

		_butt.addEventListener('click', function(){
			 window.parent.main.editor.addScriptNew(_script);
			 window.parent.closeIFrame();

		});
	}

	//For 3D objects
	this.createScenes = function(_object, file, _name){

		var _scene = new THREE.Scene();

		if(_object.scene !== undefined){

			_scene.uuid = _object.scene.uuid;
			_scene.name = _object.scene.name;

			while ( _object.scene.children.length > 0 ) {

				_scene.add( _object.scene.children[ 0 ] );

			}

		}else{

			_scene.add(_object);

		}


		// make a list item
		var element = document.createElement( "div" );

		element.className = "list-item";
		var _libraryEntry = getDisplayName(_name);
		var tags = ' ';
		tags = _libraryEntry.tags[0];
		element.innerHTML = template.replace('$', _libraryEntry.name ).replace('£', _libraryEntry.user.name ).replace('?', _libraryEntry.description ).replace('!', tags );

		var _butt = element.querySelector("#addButton");
		_butt.addEventListener('click', function(){
			 window.parent.editor.loader.loadFile(file);
			 window.parent.closeIFrame();

		});


		_scene.userData.element = element.querySelector( ".scene" );
		_scene.userData.element.style.height = "200px";

		content.appendChild( element );

		var camera = new THREE.PerspectiveCamera( 50, 1, 0.1, 1000 );
		// camera.position.z = 2;
		// Convert camera fov degrees to radians
		var fov = camera.fov * ( Math.PI / 180 ); 

		var distance = 10;

		camera.position.z = distance;
		_scene.userData.camera = camera;

		controls = new THREE.OrbitControls( _scene.userData.camera, _scene.userData.element );
		
		controls.minDistance = distance*0.2;
		controls.maxDistance = distance*2;
		controls.enablePan = true;
		controls.enableZoom = true;
		_scene.userData.controls = controls;

		_scene.add( new THREE.HemisphereLight( 0xaaaaaa, 0x444444 ) );
		var light = new THREE.DirectionalLight( 0xffffff, 0.5 );
		light.position.set( 1, 1, 1 );
		_scene.add( light );

		scenes.push( _scene );


	};

	function getDisplayName( _name ){

		for(var i = 0; i < library.objects.length; i++){

			var name = library.objects[i].media;

			if(name == _name)
				return library.objects[i];

		} 

		return "null";
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
		renderer.setScissorTest( false );
		renderer.clear();
		renderer.setClearColor( 0xf3f3f3 );
		renderer.setScissorTest( true );
		var id = 0;

		scenes.forEach( function( scene ) {

			id ++;
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

			// console.log("render");
			// set the viewport
			var width  = rect.right - rect.left;
			var height = rect.bottom - rect.top;
			var left   = rect.left;
			var bottom = renderer.domElement.clientHeight - rect.bottom;
			
			renderer.setViewport( left, bottom, width, height );
			renderer.setScissor( left, bottom, width, height );

			// console.log(id);

			// console.log(renderer.getScissor);

			var camera = scene.userData.camera;
			//camera.aspect = width / height; // not changing in this example
			// camera.updateProjectionMatrix();
			// scene.userData.controls.update();
			renderer.render( scene, camera );
		} );


	}
}