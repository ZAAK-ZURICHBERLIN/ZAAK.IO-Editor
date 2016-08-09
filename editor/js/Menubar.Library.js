/**
 * @author mrdoob / http://mrdoob.com/
 */

Menubar.Library = function ( editor ) {

	var signals = editor.signals;

	var container = new UI.Panel();
	container.setClass( 'menu' );

	// var isPlaying = false;

	var title = new UI.Panel();
	title.setClass( 'title' );
	title.setTextContent( 'Library' );
	title.onClick( function () {

		// if ( isPlaying === false ) {

			// isPlaying = true;
			// title.setTextContent( 'Stop' );
			// signals.startPlayer.dispatch();

		// } else {

		// 	isPlaying = false;
		// 	title.setTextContent( 'Play' );
		// 	signals.stopPlayer.dispatch();

		// }
		// preview box
        var preview = "<iframe id='library_iframe' style='width:calc(100% - 300px);height:100%;position:absolute;margin-top:32px;' src=" + LIBRARY_URL + "></iframe> ";
        $("body").append($.parseHTML(preview));

        // var modal =  ("<div class='modal-overlay js-modal-close'></div>");
        // $("body").append(modal);

        // $(".modal-overlay").fadeTo(500, 0.9);
        $('#library').fadeIn();
        // modal helper
        // $(".js-modal-close, .modal-overlay").click(function() {
        //     $(".modal-box, .modal-overlay").fadeOut(500, function() {
        //     	// player.stop();
        //         $(".modal-overlay").remove();
        //         $("#library").remove();
        //     });
        // });
        // $(window).resize(function() {
        //     $(".modal-box").css({
        //         top: ($(window).height() - $("#library").outerHeight()) / 21 + 32,
        //         right: ($(window).width() - $("#library").outerWidth()) / 2 + 300
        //     });
        // });

        // $(window).resize();

	} );
	container.add( title );

	return container;

};


	// var option = new UI.Row();
	// option.setClass( 'option' );
	// option.setTextContent( 'Library' );
	// option.onClick( function () {

        


	// } );
	// options.add( option );
