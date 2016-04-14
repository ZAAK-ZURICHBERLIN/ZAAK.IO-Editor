/**
 * @author mrdoob / http://mrdoob.com/
 */

Sidebar.Video = function ( editor ) {

	var signals = editor.signals;

	var container = new UI.Panel();
	container.setBorderTop( '0' );
	container.setPaddingTop( '20px' );

	// Actions


	function build() {

		var object = editor.selected;

		if ( object && object.script ) {

			
			console.log(object.script);

		} else {

			container.setDisplay( 'none' );

		}

	}

	signals.objectSelected.add( build );
	signals.geometryChanged.add( build );

	return container;

};
