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
