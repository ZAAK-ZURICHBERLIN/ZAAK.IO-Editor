Sidebar.Sounds = function ( editor ) {

	var signals = editor.signals;

	var container = new UI.Panel();
	container.setDisplay( 'none' );
	//container.dom.classList.add( 'Material' );

	container.add( new UI.Text( 'SOUNDS' ) );
	container.add( new UI.Break(), new UI.Break() );

	// constant sound

	var soundsConstantRow = new UI.Panel();
	var soundsConstant = new UI.Sound().onChange( function( event ) {
		
		if ( event.buffer ) {
			
			if ( editor.config.getKey('defaultColor') == 'RMS' ) {
			
				editor.signals.soundAdded.dispatch( event.buffer, editor.selected.material );
				
			}
			
		}
		
		update();
		
	} );

	soundsConstantRow.add( new UI.Text( 'Constant' ).setWidth( '90px' ) );
	soundsConstantRow.add( soundsConstant );

	container.add( soundsConstantRow );


	var playButton = new UI.Button( 'Play' );
	playButton.onClick( function () {

		editor.selected.sounds.play();		

	} );

	container.add( playButton );

	//

	function update() {
		
		if (editor.selected.sounds == undefined) editor.selected.sounds = {};
		
		var sounds = editor.selected.sounds;
		
		sounds.constant = soundsConstant.getValue();

		updateRows();

	};

	function updateRows() {
	
		/*var properties = {
			'constant': physicsFriction,
			'restitution': physicsRestitution,
			'massmodifier': physicsMassmodifier
		};

		var physics = editor.selected.material._physijs;
		console.log(editor.selected);

		for ( var property in properties ) {
		
			//properties[ property ].setDisplay( physics[ property ] !== undefined ? '' : 'none' );

		}*/

	};

	// events

	signals.objectSelected.add( function ( object ) {

		if ( object ) {

			container.setDisplay( '' );
			
			if ( !object.sounds ) object.sounds = {};

			var sounds = object.sounds;
			
			soundsConstant.setValue( sounds.constant );

			updateRows();

		} else {

			container.setDisplay( 'none' );

		}

	} );

	return container;

}
