class PhaserProjectile extends PhaserAnimatedEntity {

	protected gameObject: Phaser.GameObjects.Sprite & Hidden;
	protected entity: Projectile;

	constructor (
		scene: GameScene,
		entity: Projectile
	) {
		super(scene, entity, `projectile/${entity._stats.type}`);

		this.sprite.visible = false;

		this.gameObject = this.sprite;

		const { x, y } = entity._translate;
		this.gameObject.setPosition(x, y);

		this.toggleRender(true);
	}

	protected destroy (): void {

		super.destroy();
	}
}
