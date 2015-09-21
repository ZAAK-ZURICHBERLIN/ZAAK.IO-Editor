/**
 * @author mrdoob / http://mrdoob.com/
 */

Menubar.Navigation = function ( editor ) {

	var container = new UI.Panel();
	container.setClass( 'menu' );

	var title = new UI.Panel();
	title.setClass( 'title' );
	title.setTextContent( 'Navigation' );
	container.add( title );

	var options = new UI.Panel();
	options.setClass( 'options' );
	container.add( options );

	//Need a huge overhaul
	// SphereTarget
	var option = new UI.Panel();
	option.setClass( 'option' );
	option.setTextContent( 'Sphere JumpTo' );
	option.onClick( function () {

		var radius = 15;
		var widthSegments = 10;
		var heightSegments = 10;
		var phiStart = 0;
		var phiLength = Math.PI * 2;
		var thetaStart = 0;
		var thetaLength = Math.PI;

		var geometry = new THREE.SphereGeometry( radius, widthSegments, heightSegments, phiStart, phiLength, thetaStart, thetaLength );
		var mesh = new THREE.Mesh( geometry, new THREE.MeshNormalMaterial({transparent: true, depthTest: false, depthWrite: false, needsUpdate: true}) );

		mesh.name = 'JumpTo';

		editor.addObject( mesh );
		editor.select( mesh );

	} );
	options.add( option );

	//Plane Pointer
	var option = new UI.Panel();
	option.setClass( 'option' );
	option.setTextContent( 'Plane Pointer' );
	option.onClick( function () {

		var width = 100;
		var height = 100;

		var widthSegments = 1;
		var heightSegments = 1;

		var geometry = new THREE.PlaneGeometry( width, height, widthSegments, heightSegments );
		var material = new THREE.MeshBasicMaterial({side: THREE.DoubleSide, transparent: true, depthTest: false, depthWrite: false, needsUpdate: true});
		var mesh = new THREE.Mesh( geometry, material );
		mesh.name = 'Pointer_name';

		editor.addObject( mesh );
		editor.select( mesh );

	} );
	options.add( option );

	//Plane Target
	var option = new UI.Panel();
	option.setClass( 'option' );
	option.setTextContent( 'Sphere Target' );
	option.onClick( function () {

		var radius = 15;
		var widthSegments = 10;
		var heightSegments = 10;
		var phiStart = 0;
		var phiLength = Math.PI * 2;
		var thetaStart = 0;
		var thetaLength = Math.PI;

		var geometry = new THREE.SphereGeometry( radius, widthSegments, heightSegments, phiStart, phiLength, thetaStart, thetaLength );
		var mesh = new THREE.Mesh( geometry, new THREE.MeshNormalMaterial({transparent: true, depthTest: true, depthWrite: true, needsUpdate: true}) );

		mesh.name = 'Target_name';

		editor.addObject( mesh );
		editor.select( mesh );

	} );
	options.add( option );

	return container;

};
