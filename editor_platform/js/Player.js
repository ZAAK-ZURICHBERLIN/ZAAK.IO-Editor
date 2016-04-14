/**
 * @author mrdoob / http://mrdoob.com/
 */

var Player = function ( editor ) {

	var signals = editor.signals;

	var container = new UI.Panel();
	container.setId( 'player' );
	container.setPosition( 'absolute' );
	container.setDisplay( 'none' );

	//

	// var player = new APP.Player();
	var _scene;

	// window.addEventListener( 'resize', function () {

	// 	if ( player.dom === undefined ) return;

	// 	player.setSize( container.dom.clientWidth, container.dom.clientHeight );

	// } );

	signals.startPlayer.add( function () {

		_scene = editor.toJSON();
		_scene.metadata.type = 'App';
		delete _scene.history;

		// console.log(_scene);

        // preview box
        var preview = "<div id='preview' class='modal-box' style='height:600px;width:900px;text-align: center;'> \
        <header style='background-color:#333;'> \
            <a class='js-modal-close close' style='top:1.5%;'>×</a> \
        </header> \
        <div style='height:100%;'> \
            <iframe id='preview_iframe' width='100%' height='100%' allowfullscreen src='../../ZAAK.IO-Viewer/index.html'></iframe> \
        </div></div>";
        $("body").append($.parseHTML(preview));

        var modal =  ("<div class='modal-overlay js-modal-close'></div>");
        $("body").append(modal);

         setTimeout(function() {

	        // $('#preview_iframe').load(function(){
	        // 	console.log($('#preview_iframe')[0]);
	        var parentFrame = $('#preview_iframe').contents().find('#myIframe');
	        // console.log(parentFrame[0].contentWindow.viewer);
	        parentFrame[0].contentWindow.viewer.startScene(_scene); // load json data
	            // $('#preview_iframe')[0].contentWindow.setManagerMode(); // load json data
	        // });
        }, 1000);


        $(".modal-overlay").fadeTo(500, 0.9);
        $('#preview').fadeIn();
        // modal helper
        $(".js-modal-close, .modal-overlay").click(function() {
            $(".modal-box, .modal-overlay").fadeOut(500, function() {
            	// player.stop();
            	scene = _scene;
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

	// signals.stopPlayer.add( function () {

	// 	// container.setDisplay( 'none' );

	// 	// player.stop();

	// 	// container.dom.removeChild( player.dom );

	// } );

	return container;

};
