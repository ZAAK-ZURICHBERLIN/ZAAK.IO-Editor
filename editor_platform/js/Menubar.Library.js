/**
 * @author mrdoob / http://mrdoob.com/
 */

Menubar.Library = function ( editor ) {

	var container = new UI.Panel();
	container.setClass( 'menu' );

	var title = new UI.Panel();
	title.setClass( 'title' );
	title.setTextContent( 'Library' );
	container.add( title );

	var options = new UI.Panel();
	options.setClass( 'options' );
	container.add( options );

	//

	var meshCount = 0;
	var lightCount = 0;
	var cameraCount = 0;

	var libraryURL = "./js/libraryList.json";
	var library;

	// var _getAllFilesFromFolder = function(dir) {

	// 	var filesystem;// = require("fs");
	// 	var results = [];

	//     filesystem.readdirSync(dir).forEach(function(file) {

	//         file = dir+'/'+file;
	//         var stat = filesystem.statSync(file);

	//         if (stat && stat.isDirectory()) {
	//             results = results.concat(_getAllFilesFromFolder(file))
	//         } else results.push(file);

	//     });

	// 	return results;

	// };

	// var allEntries = _getAllFilesFromFolder(link);

	// editor.signals.editorCleared.add( function () {

	// 	meshCount = 0;
	// 	lightCount = 0;
	// 	cameraCount = 0;

	// } );

	var loader = new THREE.XHRLoader();
	loader.crossOrigin = '';

	loader.load( libraryURL, function ( text ) {

		library = JSON.parse( text );

		console.log(library);

		// for(var i = 0; i < library.entries.length; i++){

		// 	var data = library.entries[i];

		// 	var option = new UI.Row();
		// 	option.setClass( 'option' );
			
		// 	option.setTextContent( data.name );
		// 	option.onClick( function () {

		// 		// instantiate a loader
		// 		var loader = new THREE.JSONLoader();

		// 		// load a resource
		// 		loader.load(
		// 			// resource URL
		// 			'models/library/' + data.name + '.js',
		// 			// Function when resource is loaded
		// 			function ( geometry, materials ) {

		// 				var material = new THREE.MeshFaceMaterial( materials );
		// 				var object = new THREE.Mesh( geometry, material );

		// 				editor.addObject( object );
		// 				editor.select( object );
		// 			}
		// 		);	
		// 	} );

			option.onMouseOver(function(){
				
				document.getElementById( "preview3d" ).style.display = "block";
				var url = './models/library/' + data.name + '.jpg';

				var myimg = document.getElementById( "preview3d" ).getElementsByTagName('img')[0];
				var mysrc = 	myimg.src = url;


			} );

			option.onMouseOut(function(){
				
				document.getElementById( "preview3d" ).style.display = "none";

			} );

			options.add( option );

		}
	} );	

	var option = new UI.Row();
	option.setClass( 'option' );
	option.setTextContent( 'Open Library' );
	option.onClick( function () {

		// 

	} );
	options.add( option );
	



	return container;

}
