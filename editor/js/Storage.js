/**
 * @author mrdoob / http://mrdoob.com/
 */

var Storage = function () {

	var indexedDB = window.indexedDB || window.mozIndexedDB || window.webkitIndexedDB || window.msIndexedDB;

	if ( indexedDB === undefined  ) {
		console.warn( 'Storage: IndexedDB not available.' );
		return { init: function () {}, get: function () {}, set: function () {}, clear: function () {} };
	}

	var name = 'threejs-editor';
	var version = 1;

	var dbSize;

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
				// console.log(request.);
			};

		},

		clear: function ( callback ) {

			var transaction = database.transaction( [ 'states' ], 'readwrite' );
			var objectStore = transaction.objectStore( 'states' );
			var request = objectStore.clear();
			request.onsuccess = function ( event ) {

				callback();

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
		                var json = JSON.stringify(storedObject);
		                size += json.length;
		                cursor.continue();
		            }
		            else{
		            	// console.log(size);
		            	// dbSize = parseInt(size) / 1000000;
		            	// console.log(dbSize);
		            	size /= 1000000;
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
	}	
};
