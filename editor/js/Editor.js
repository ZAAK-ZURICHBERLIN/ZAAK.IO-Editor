/**
 * @author mrdoob / http://mrdoob.com/
 */

var Editor = function (shortcuts) {

	var SIGNALS = signals;

	this.signals = {

		// script

		editScript: new SIGNALS.Signal(),

		// player

		startPlayer: new SIGNALS.Signal(),
		stopPlayer: new SIGNALS.Signal(),

		// actions

		// showDialog: new SIGNALS.Signal(),

		// notifications

		editorCleared: new SIGNALS.Signal(),

		savingStarted: new SIGNALS.Signal(),
		savingFinished: new SIGNALS.Signal(),

		themeChanged: new SIGNALS.Signal(),

		transformModeChanged: new SIGNALS.Signal(),
		snapChanged: new SIGNALS.Signal(),
		spaceChanged: new SIGNALS.Signal(),
		rendererChanged: new SIGNALS.Signal(),

		sceneGraphChanged: new SIGNALS.Signal(),

		cameraChanged: new SIGNALS.Signal(),

		geometryChanged: new SIGNALS.Signal(),

		objectSelected: new SIGNALS.Signal(),
		objectFocused: new SIGNALS.Signal(),

		objectAdded: new SIGNALS.Signal(),
		objectChanged: new SIGNALS.Signal(),
		objectRemoved: new SIGNALS.Signal(),

		helperAdded: new SIGNALS.Signal(),
		helperRemoved: new SIGNALS.Signal(),

		materialChanged: new SIGNALS.Signal(),

		scriptAdded: new SIGNALS.Signal(),
		scriptChanged: new SIGNALS.Signal(),
		scriptRemoved: new SIGNALS.Signal(),

		fogTypeChanged: new SIGNALS.Signal(),
		fogColorChanged: new SIGNALS.Signal(),
		fogParametersChanged: new SIGNALS.Signal(),
		windowResize: new SIGNALS.Signal(),

		showGridChanged: new SIGNALS.Signal(),

		// added by Sam
		cameraPositionSnap: new SIGNALS.Signal(),
		saveProject: new SIGNALS.Signal(),
		unsaveProject: new SIGNALS.Signal(),
		undo: new SIGNALS.Signal(),
		redo: new SIGNALS.Signal(),
		soundAdded: new SIGNALS.Signal(),
		showManChanged: new SIGNALS.Signal(),
		bgColorChanged: new SIGNALS.Signal()
	};

	this.config = new Config();
	this.history = new History( this );
	this.storage = new Storage();
	this.loader = new Loader( this );
	this.shortcuts = new EditorShortCutsList();

	this.camera = new THREE.PerspectiveCamera( 50, 1, 1, 100000 );
	this.camera.position.set( 500, 250, 500 );
	this.camera.lookAt( new THREE.Vector3() );
	this.camera.name = 'Camera';

	this.listener = new THREE.AudioListener();
	this.camera.add( this.listener );

	this.scene = new THREE.Scene();
	this.scene.name = 'Scene';

	this.sceneHelpers = new THREE.Scene();

	this.object = {};
	this.geometries = {};
	this.materials = {};
	this.textures = {};
	this.scripts = {};
	
	this.soundCollection = new SoundCollection({cam:this.camera});

	this.selected = null;
	this.helpers = {};
	this.nodes = {};

	this.isolationMode = false;

};

Editor.prototype = {

	setTheme: function ( value ) {

		document.getElementById( 'theme' ).href = value;

		this.signals.themeChanged.dispatch( value );

	},

	/*
	showDialog: function ( value ) {

		this.signals.showDialog.dispatch( value );

	},
	*/

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
		console.log("hey");

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
	addNode: function () {

		console.log("NodeHelper")
		pointerPos = object.position;
		helper = new THREE.NodeHelper( new THREE.Vector3( 1, 0, 0 ), pointerPos, 10 );

	},

	addHelper: function () {

		var geometry = new THREE.SphereBufferGeometry( 20, 4, 2 );
		var material = new THREE.MeshBasicMaterial( { color: 0xff0000, visible: false } );

		return function ( object ) {

			var helper, nodes;
			var pointerPos, targetPos = THREE.Vector3( 0, 0, 0 );

			if ( object instanceof THREE.Camera ) {

				helper = new THREE.CameraHelper( object, 10 );

			} else if ( object instanceof THREE.PointLight ) {

				helper = new THREE.PointLightHelper( object, 10 );

			} else if ( object instanceof THREE.DirectionalLight ) {

				helper = new THREE.DirectionalLightHelper( object, 20 );

			} else if ( object instanceof THREE.SpotLight ) {

				helper = new THREE.SpotLightHelper( object, 10 );

			} else if ( object instanceof THREE.HemisphereLight ) {

				helper = new THREE.HemisphereLightHelper( object, 10 );

			} else if ( object instanceof THREE.SkinnedMesh ) {

				helper = new THREE.SkeletonHelper( object );
		
			} else if( object.name == "Pointer_name"){

			}else {

				// no helper for this object type
				return;

			}



			var picker = new THREE.Mesh( geometry, material );
			picker.name = 'picker';
			picker.userData.object = object;
			helper.add( picker );

			// if(targetPos != null){
			// 	console.log("ArrowHelper Yeah");
			// 	helper = new THREE.ArrowHelper( targetPos-pointerPos, pointerPos, 10 );
			// }
			if(object.name == "Pointer_name" )

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

		this.signals.objectFocused.dispatch( object );

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

				console.log(child.name);
				if ( !(child instanceof THREE.Light )){ 
					if(child.name !== "Scene" ){
					
					child.visible = mode;
					}
				}

			} );

			console.log(this.selected.name);
			this.selected.visible = true;

			// this.selected.traverse( function ( child2 ) { //Show all chilrden

			// 	child2.visible = true;

			// } );

			//TODO: Add parent iteration so all parents of an object stay visible and don't hide the child

			this.signals.sceneGraphChanged.dispatch();

		}
	},

	clear: function () {

		this.history.clear();

		this.camera.position.set( 500, 250, 500 );
		this.camera.lookAt( new THREE.Vector3() );

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

		this.signals.bgColorChanged.dispatch(0x333333);

	},

	play: function ( ) {
	
		this.scene.traverse( function ( child ) {
		
			if ( child.sounds ) {
			
				if ( child.sounds.constant ) {
					editor.soundCollection.playAttachedSound( child.sounds.constant, child );
				}
			
			}
		
		}.bind( this ) );
		
	},
	
	stop: function ( ) {
	
		this.scene.traverse( function ( child ) {
			
			if ( child.sounds ) {
			
				editor.soundCollection.stop( child.sounds.constant, true );
				console.log(child.name);
			}
		
		}.bind( this ) );
	},	

	//

	fromJSON: function ( json ) {

		var loader = new THREE.ObjectLoader();


		// backwards

		if ( json.scene === undefined ) {

			this.setScene( loader.parse( json ) );
			return;

		}

		// TODO: Clean this up somehow

		var camera = loader.parse( json.camera );

		this.camera.position.copy( camera.position );
		this.camera.rotation.copy( camera.rotation );
		this.camera.aspect = camera.aspect;
		this.camera.near = camera.near;
		this.camera.far = camera.far;

		this.setScene( loader.parse( json.scene ) );
		this.scripts = json.scripts;

		// console.log(json.background);
		if(json.project.background != undefined){
		
			console.log("BG Found");
			this.signals.bgColorChanged.dispatch(json.project.background);
		}else{

			console.log("initiate with gray bg");
			this.signals.bgColorChanged.dispatch(0x333333);
		}

		//Meh
		this.signals.saveProject.dispatch();

		// document.getElementById( "preloader" ).style.display = "none";

	},

	toJSON: function () {

		// console.log(this.scene.toJSON())

		return {

			project: {
						// editor.config.setKey( 'backgroundColor', bgColor);

				background: this.config.getKey('backgroundColor')
				// vr: this.config.getKey( 'project/vr' )
			},
			camera: this.camera.toJSON(),
			scene: this.scene.toJSON(),
			scripts: this.scripts

		};

	}

}
