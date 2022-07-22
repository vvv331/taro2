class PhaserAnimatedEntity extends PhaserEntity {

	protected sprite: Phaser.GameObjects.Sprite;

	protected constructor (
		public scene: GameScene,
		entity: IgeEntity,
		protected key: string
	) {
		super(entity);

		const bounds = entity._bounds2d;
		const sprite = this.sprite = scene.add.sprite(0, 0, key);

		sprite.setDisplaySize(bounds.x, bounds.y);
		sprite.rotation = entity._rotate.z;

		Object.assign(this.evtListeners, {
			'play-animation': entity.on('play-animation', this.playAnimation, this),
			size: entity.on('size', this.size, this),
			layer: entity.on('layer', this.layer, this),
			scale: entity.on('scale', this.scale, this)
		});
	}

	protected playAnimation (animationId: string): void {
		this.sprite.play(`${this.key}/${animationId}`);
	}

	protected transform (data: {
		x: number;
		y: number;
		rotation: number
	}): void {
		this.gameObject.setPosition(data.x, data.y);
		this.sprite.rotation = data.rotation;
	}

	protected size (
		data: {
			width: number,
			height: number
		}
	): void {
		this.sprite.setDisplaySize(data.width, data.height);
	}

	protected layer (): void {
		console.log(`key: ${this.key} layer: ${this.entity._layer}, depth: ${this.entity._depth}`); // TODO: Remove
		// use index - 1 because taro layers are indexed at 1
		this.scene.entityLayers[this.entity._layer - 1].add(this.gameObject);
		this.gameObject.setDepth(this.entity._depth);
	}

	protected scale (data: {
		x: number;
		y: number
	}): void {
		this.sprite.setScale(data.x, data.y);
	}

	protected destroy (): void {

		this.sprite = null;

		super.destroy();
	}
}