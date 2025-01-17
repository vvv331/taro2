/// <reference types="@types/google.analytics" />

class PhaserRenderer extends Phaser.Game {

	constructor () {

		const forceCanvas = JSON.parse(
			localStorage.getItem('forceCanvas')
		) || {};

		super({
			type: forceCanvas[gameId] || forceCanvas[0] ?
				Phaser.CANVAS : Phaser.AUTO,
			scale: {
				width: 600,
				height: 400,
				parent: 'game-div',
				mode: Phaser.Scale.ScaleModes.RESIZE,
				autoRound: true,
				resizeInterval: 100
			},
			render: {
				pixelArt: false,
				transparent: false
			},
			fps: {
				smoothStep: false
			},
			scene: [
				GameScene,
				DevModeScene,
				MobileControlsScene
			],
			loader: {
				crossOrigin: 'anonymous'
			},
			plugins: {
				/*scene: [{
					  key: 'rexUI',
					  plugin: UIPlugin,
					  mapping: 'rexUI',
				}],*/
				global: [{
					key: 'virtual-joystick',
					plugin: rexvirtualjoystickplugin,
					start: true
				}]
			}
		});

		if (this.isBooted) {
			this.setupInputListeners();
		} else {
			this.events.once(Phaser.Core.Events.BOOT,
				this.setupInputListeners, this
			);
		}

		if (typeof ga != 'undefined' && taro.env != 'local') {
			ga('send', {
				hitType: 'event',
				eventCategory: 'Rendering Engine',
				eventAction: this.renderer.type
			});
		}
	}

	private setupInputListeners(): void {
		// Ask the input component to set up any listeners it has
		taro.input.setupListeners(this.canvas);
	}

	getViewportBounds (): Phaser.Geom.Rectangle {
		return this.scene.getScene('Game').cameras.main.worldView;
	}
}
