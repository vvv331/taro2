class PhaserAttributeBar extends Phaser.GameObjects.Container {

	private static pool: Phaser.GameObjects.Group;

	static get(unit: PhaserUnit): PhaserAttributeBar {

		if (!this.pool) {
			this.pool = unit.scene.make.group({});
		}

		let bar: PhaserAttributeBar = this.pool.getFirstDead(false);
		if (!bar) {
			bar = new PhaserAttributeBar(unit);
			this.pool.add(bar);
		}
		bar.setActive(true);

		bar.unit = unit;
		unit.attributesContainer.add(bar);
		bar.setVisible(true);

		return bar;
	}

	static release (bar: PhaserAttributeBar): void {

		bar.resetFadeOut();

		bar.setVisible(false);
		bar.unit.attributesContainer.remove(bar);
		bar.unit = null;

		bar.name = null;

		bar.setActive(false);
	}

	private readonly barImages: Phaser.GameObjects.Image[] = [];
	private readonly bitmapText: Phaser.GameObjects.BitmapText;
	private readonly rtText: Phaser.GameObjects.RenderTexture;

	private fadeTimerEvent: Phaser.Time.TimerEvent;
	private fadeTween: Phaser.Tweens.Tween;

	private constructor(private unit: PhaserUnit) {

		const scene = unit.scene;

		super(scene);

		// Bar
		const stroke = scene.add.image(0, 0, 'stroke');
		stroke.setOrigin(0.5);

		const filLeft = scene.add.image(
			-stroke.width / 2,
			0,
			'fill-side'
		);
		filLeft.setOrigin(0, 0.5);
		filLeft.visible = false;

		const fill = scene.add.image(
			filLeft.x + filLeft.width - 1,
			0,
			'fill'
		);
		fill.setOrigin(0, 0.5);
		fill.setScale(1, filLeft.height);
		fill.visible = false;

		const fillRight = scene.add.image(
			fill.x + fill.displayWidth - 1,
			0,
			'fill-side'
		);
		fillRight.setOrigin(0, 0.5);
		fillRight.flipX = true;
		fillRight.visible = false;

		this.barImages.push(filLeft, fill, fillRight, stroke);
		this.add(this.barImages);

		// Label
		const text = this.bitmapText = scene.add.bitmapText(0, 0,
			BitmapFontManager.font(scene, 'Arial', true, false, '#000000')
		);
		text.setCenterAlign();
		text.setFontSize(14);
		text.setOrigin(0.5);
		text.letterSpacing = -0.8;
		text.visible = false;
		this.add(text);

		if (scene.renderer.type === Phaser.CANVAS) {
			const rt = this.rtText = scene.add.renderTexture(0, 0);
			rt.setOrigin(0.5);
			rt.visible = false;
			this.add(rt);
		}

		// TODO batch entire attribute bar, not only text

		unit.attributesContainer.add(this);
	}

	render (data: AttributeData): void {
		const {
			color,
			value,
			max,
			displayValue,
			index,
			showWhen,
			decimalPlaces
		} = data;

		this.name = data.type || data.key;

		// Bar
		const images = this.barImages;
		const fillLeft = images[0];
		const fill = images[1];
		const fillRight = images[2];
		const stroke = images[3];

		// TODO implement support for custom bar color, similar to how it's done with bitmap fonts
		// ideally, texture cloning logic could be extracted into a separate class TextureManager
		// and used both for bitmap fonts and attribute bar textures
		/*bar.fillStyle(Phaser.Display.Color
			.HexStringToColor(color)
			.color);*/

		// TODO pack ui textures (including chat bubble) into a single atlas for perf improvement

		if (value !== 0) {
			const w = stroke.width - 2*fillLeft.width + 2;
			fill.scaleX = w * value / max;
			fillRight.x = fill.x + fill.displayWidth - 1;

			fillLeft.visible =
				fill.visible =
					fillRight.visible = true;
		} else {
			fillLeft.visible =
				fill.visible =
					fillRight.visible = false;
		}

		// Label
		const text = this.bitmapText;
		const rt = this.rtText;
		if (displayValue) {
			text.setText(value.toFixed(decimalPlaces));
			text.visible = !rt;
			if (rt) { // TODO batch enitre container instead of only label
				rt.resize(text.width, text.height);
				rt.clear();
				rt.draw(text, text.width/2, text.height/2);
				rt.visible = true;
			}
		} else {
			text.setText('');
			text.visible = false;
			rt && (rt.visible = false);
		}

		this.y = (index - 1) * stroke.height;

		this.resetFadeOut();

		if ((showWhen instanceof Array &&
			showWhen.indexOf('valueChanges') > -1) ||
			showWhen === 'valueChanges') {

			this.fadeOut();
		}
	}

	private fadeOut(): void {

		const scene = this.scene;

		this.fadeTimerEvent = scene.time.delayedCall(1000, () => {

			this.fadeTimerEvent = null;

			this.fadeTween = scene.tweens.add({
				targets: this,
				alpha: 0,
				duration: 500,
				onComplete: () => {

					this.fadeTween = null;

					const unit = this.unit;
					if (unit) {

						const attributes = unit.attributes;
						const index = attributes.indexOf(this);

						if (index !== -1) {
							attributes.splice(index, 1);
							PhaserAttributeBar.release(this);
						}
					}
				}
			});
		});
	}

	private resetFadeOut (): void {
		// reset fade timer and tween
		if (this.fadeTimerEvent) {
			this.scene.time.removeEvent(this.fadeTimerEvent);
			this.fadeTimerEvent = null;
		}
		if (this.fadeTween) {
			this.fadeTween.remove();
			this.fadeTween = null;
		}
		this.alpha = 1;
	}
}
