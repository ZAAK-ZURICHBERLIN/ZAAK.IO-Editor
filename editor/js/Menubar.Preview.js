/**
 * @author stahlnow / http://stahllabs.io
 */
Menubar.Preview = function ( editor ) {

    var container = new UI.Panel();
    container.setClass( 'menu right' );
    container.setStyle( 'cursor', ['pointer']);
    var title = new UI.Panel();
    title.setClass( 'title' );
    title.setTextContent( 'Preview' );
    title.onClick( function () {

        App.Helper.Preview(editor.scene.toJSON());

    } );
    container.add( title );

    return container;

};
