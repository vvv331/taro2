var igeCoreConfig = {
	/* Includes for the main IGE loader. Flags are indicated as:
	 * c = client
	 * s = server
	 * a =
	 * p = prototype
	 */
	include: [
		/* Client-Side Stack Trace Support */
		['c', 'IgeStackTrace', 'components/stackTrace/lib_stack.js'],
		/* The IGE Core Files */
		['csap', 'IgeBase', 'core/IgeBase.js'],
		['csap', 'IgeClass', 'core/IgeClass.js'],
		['csap', 'IgeEventingClass', 'core/IgeEventingClass.js'],
		/* Data Classes */
		['csap', 'IgePoint2d', 'core/IgePoint2d.js'],
		['csap', 'IgePoint3d', 'core/IgePoint3d.js'],
		['csap', 'IgePoly2d', 'core/IgePoly2d.js'],
		['csap', 'IgeRect', 'core/IgeRect.js'],
		['csap', 'IgeMatrix2d', 'core/IgeMatrix2d.js'],
		/* Components */
		['csap', 'IgeTimeComponent', 'components/IgeTimeComponent.js'],
		['csap', 'IgeAnimationComponent', 'components/IgeAnimationComponent.js'],
		['csap', 'IgeVelocityComponent', 'components/IgeVelocityComponent.js'],
		['csap', 'IgeInputComponent', 'components/IgeInputComponent.js'],
		['csap', 'IgeTiledComponent', 'components/IgeTiledComponent.js'],
		['csap', 'IgeUiManagerComponent', 'components/IgeUiManagerComponent.js'],
		/* Network Stream */
		['csap', 'IgeTimeSyncExtension', 'components/network/IgeTimeSyncExtension.js'],
		['csap', 'IgeStreamComponent', 'components/network/IgeStreamComponent.js'],
		/* Net.io */
		['cap', 'NetIo', 'components/network/net.io/net.io-client/index.js'],
		['cap', 'IgeNetIoClient', 'components/network/net.io/IgeNetIoClient.js'],
		['sap', 'IgeNetIoServer', 'components/network/net.io/IgeNetIoServer.js'],
		['csap', 'IgeNetIoComponent', 'components/network/net.io/IgeNetIoComponent.js'],
		/* Chat System */
		['cap', 'IgeChatClient', 'components/chat/IgeChatClient.js'],
		['sap', 'IgeChatServer', 'components/chat/IgeChatServer.js'],
		['csap', 'IgeChatComponent', 'components/chat/IgeChatComponent.js'],
		/* CocoonJS Support */
		['csap', 'IgeCocoonJsComponent', 'components/cocoonjs/IgeCocoonJsComponent.js'],
		/* General Extensions */
		['csap', 'IgeUiPositionExtension', 'extensions/IgeUiPositionExtension.js'],
		['csap', 'IgeUiStyleExtension', 'extensions/IgeUiStyleExtension.js'],
		/* Main Engine Classes */
		['csap', 'IgeSceneGraph', 'core/IgeSceneGraph.js'],
		['csap', 'IgeBaseScene', 'core/IgeBaseScene.js'],
		['csap', 'IgeDummyCanvas', 'core/IgeDummyCanvas.js'],
		['csap', 'IgeDummyContext', 'core/IgeDummyContext.js'],
		['csap', 'IgeObject', 'core/IgeObject.js'],
		['csap', 'IgeEntity', 'core/IgeEntity.js'],
		['csap', 'IgeMap2d', 'core/IgeMap2d.js'],
		['csap', 'IgeTileMap2d', 'core/IgeTileMap2d.js'],
		['csap', 'IgeCamera', 'core/IgeCamera.js'],
		['csap', 'IgeViewport', 'core/IgeViewport.js'],
		['csap', 'IgeScene2d', 'core/IgeScene2d.js'],
		['csap', 'IgeArray', 'core/IgeArray.js'],
		/* Engine Actual */
		['csap', 'IgeEngine', 'core/IgeEngine.js'],
		/* Physics Libraries */
		['csap', 'PhysicsComponent', './components/physics/box2d/Box2dComponent.js'],
		['csap', 'IgeEntityPhysics', './components/physics/box2d/IgeEntityPhysics.js'],
		['csap', 'IgeBox2dWorld', './components/physics/box2d/IgeBox2dDebugPainter.js'],
		['csap', 'dists', './components/physics/box2d/dists.js'],
		['csap', 'planck', './components/physics/box2d/dists/planck/planck.js'],
		['csap', 'box2dweb', './components/physics/box2d/dists/box2dweb/lib_box2d.js', 'box2dweb'],
		['csap', 'box2dninja', './components/physics/box2d/dists/box2dweb/box2d_ninja.js', 'box2dninja'],
		['csap', 'box2dts', './components/physics/box2d/dists/flyoverbox2dts/bundle.js'],
		// No crash for now
	]
};

if (typeof (module) !== 'undefined' && typeof (module.exports) !== 'undefined') {
	module.exports = igeCoreConfig;
}
