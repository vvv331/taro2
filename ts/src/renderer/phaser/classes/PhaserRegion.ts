class PhaserRegion extends PhaserEntity {

	protected gameObject: Phaser.GameObjects.Graphics;
	protected entity: Region;

	constructor (
		scene: Phaser.Scene,
		entity: Region
	) {
		super(entity);

		this.gameObject = scene.add.graphics();

		this.transform();
	}

	protected transform (): void {
		const graphics = this.gameObject;
		const stats = this.entity._stats.default;

		graphics.setPosition(stats.x, stats.y);

		graphics.clear();
		graphics.fillStyle(
			Number(`0x${stats.inside.substring(1)}`),
			// TODO this can throw an error if alpha is undefined
			stats.alpha / 100 || 0.4
		);
		graphics.fillRect(
			0,
			0,
			stats.width,
			stats.height
		);
	}
}
