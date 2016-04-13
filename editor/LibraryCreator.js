var LibraryCreator = function( ) {

	var scenes = [], camera, renderer, emptyScene;

	init();
	animate();

	function init() {

		canvas = document.getElementById( "c" );

		camera = new THREE.PerspectiveCamera( 50, 1, 0.1, 100 );
		camera.position.z = 2;

		var geometries = [
			new THREE.BoxGeometry( 1, 1, 1 ),
			new THREE.SphereGeometry( 0.5, 12, 12 ),
			new THREE.DodecahedronGeometry( 0.5 ),
			new THREE.CylinderGeometry( 0.5, 0.5, 1, 12 ),
		];

		var template = document.getElementById("template").text;
		var content = document.getElementById("content");

		var emptyScene = new THREE.Scene();

		for ( var i =  0; i < 100; i ++ ) {

			var scene = new THREE.Scene();

			// make a list item
			var element = document.createElement( "div" );
			element.className = "list-item";
			element.innerHTML = template.replace('$', i + 1 );

			// Look up the element that represents the area
			// we want to render the scene
			scene.element = element.querySelector(".scene");
			content.appendChild( element );

			// add one random mesh to each scene
			var geometry = geometries[ geometries.length * Math.random() | 0 ];
			var material = new THREE.MeshLambertMaterial( { color: 0xffffff * Math.random() } );

			scene.add( new THREE.Mesh( geometry, material ) );

			light = new THREE.HemisphereLight( 0xffbbbb, 0x444488 );
			light.position.set( - 0.5, 0.8, 1 );
			scene.add( light );

			scenes.push( scene );

		}


		renderer = new THREE.WebGLRenderer( { canvas: canvas, antialias: true } );
		renderer.setClearColor( 0xFFFFFF );

	}

	var libraryURL = "./js/libraryList.json";

	var loader = new THREE.XHRLoader();
	loader.crossOrigin = '';

	loader.load( libraryURL, function ( text ) {

		library = JSON.parse( text );

		console.log(library);

		for(var i = 0; i < library.entries.length; i++){

			add(library.entries[i]);
		}
	});
	
	function add( type ) {

	    //Create an input type dynamically.   
	    var element = document.createElement("input");
	    //Assign different attributes to the element. 
	    element.type = type;
	    element.value = type; // Really? You want the default value to be the type string?
	    element.name = type;  // And the name too?
	    element.onclick = function() { // Note this is a function
	        parent.library.createModel(element.value);
	    };

	    var foo = document.getElementById("fooBar");
	    //Append the element in page (in span).  
	    foo.appendChild(element);
	}
}