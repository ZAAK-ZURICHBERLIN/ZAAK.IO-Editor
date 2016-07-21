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
        var preview = "<div id='preview' class='modal-box' style='height:100%;width:100%;text-align: center;'> \
        <header style='background-color:#333;'> \
            <a class='js-modal-close close' style='top:1.5%;'>×</a> \
        </header> \
        <div style='height:100%;'> \
            <iframe id='library_iframe' width='100%' height='100%' allowfullscreen src=" + LIBRARY_URL + "></iframe> \
        </div></div>";
        $("body").append($.parseHTML(preview));

        var modal =  ("<div class='modal-overlay js-modal-close'></div>");
        $("body").append(modal);

        $(".modal-overlay").fadeTo(500, 0.9);
        $('#preview').fadeIn();
        // modal helper
        $(".js-modal-close, .modal-overlay").click(function() {
            $(".modal-box, .modal-overlay").fadeOut(500, function() {
            	// player.stop();
                $(".modal-overlay").remove();
                $("#preview").remove();
            });
        });
        $(window).resize(function() {
            $(".modal-box").css({
                top: ($(window).height() - $("#preview").outerHeight()) / 2,
                left: ($(window).width() - $("#preview").outerWidth()) / 2
            });
        });

        $(window).resize();

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
