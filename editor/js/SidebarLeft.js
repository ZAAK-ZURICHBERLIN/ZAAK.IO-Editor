/**
 * @author mrdoob / http://mrdoob.com/
 */

var SidebarLeft = function ( editor ) {



	var container = new UI.Panel();
	container.setId( 'sidebar-left' );
	//

	// var sceneTab = new UI.Text( 'SCENE' ).onClick( onClick );
	// var projectTab = new UI.Text( 'PROJECT' ).onClick( onClick );
	// var settingsTab = new UI.Text( 'SETTINGS' ).onClick( onClick );

	// var tabs = new UI.Div();
	// tabs.setId( 'tabs' );
	// tabs.add( sceneTab, projectTab, settingsTab );
	// container.add( tabs );

	// function onClick( event ) {

	// 	select( event.target.textContent );

	// }

	//
	container.add( new Sidebar.Script( editor ) );
	container.add( new Sidebar.Properties( editor ) );
	container.add( new Sidebar.Animation( editor ) );

	// var scene = new UI.Span().add(
	// 	// new Sidebar.Scene( editor ),
	// 	new Sidebar.Script( editor ),
	// 	new Sidebar.Properties( editor ),
	// 	new Sidebar.Animation( editor )
		
	// );
	// container.add( scene );

	// var project = new UI.Span().add(
	// 	new Sidebar.Project( editor )
	// );
	// container.add( project );

	// var settings = new UI.Span().add(
	// 	new Sidebar.Settings( editor ),
	// 	new Sidebar.History( editor )
	// );
	// container.add( settings );

	//

	// function select( section ) {

	// 	sceneTab.setClass( '' );
	// 	projectTab.setClass( '' );
	// 	settingsTab.setClass( '' );

		// scene.setDisplay( 'selected' );
	// 	project.setDisplay( 'none' );
	// 	settings.setDisplay( 'none' );

	// 	switch ( section ) {
	// 		case 'SCENE':
	// 			sceneTab.setClass( 'selected' );
	// 			scene.setDisplay( '' );
	// 			break;
	// 		case 'PROJECT':
	// 			projectTab.setClass( 'selected' );
	// 			project.setDisplay( '' );
	// 			break;
	// 		case 'SETTINGS':
	// 			settingsTab.setClass( 'selected' );
	// 			settings.setDisplay( '' );
	// 			break;
	// 	}

	// }

	// select( 'SCENE' );

	//Events
	// signals.sceneGraphChanged.add( refreshUI );
	editor.sidebarObject = container;

	return container;

};
