class PhaserItem extends PhaserAnimatedEntity {

	protected gameObject: Phaser.GameObjects.Sprite & Hidden;
	protected entity: Item;
	private inBackpack: boolean;

	constructor (
		scene: GameScene,
		entity: Item
	) {
		super(scene, entity, `item/${entity._stats.itemTypeId}`);

		this.sprite.visible = false;
		this.gameObject = this.sprite;

		const { x, y } = entity._translate;
		this.gameObject.setPosition(x, y);

		this.inBackpack = false;
		this.toggleRender(!this.inBackpack);

		Object.assign(this.evtListeners, {
			backpack: entity.on('backpack', this.backpack, this),
		});
	}

	private backpack (inBackpack: boolean): void {
		//
		this.inBackpack = inBackpack;

		if (this.inBackpack) {
			this.hide();
		} else {
			this.show();
		}

		this.toggleRender(!this.inBackpack);
	}

	protected destroy (): void {

		this.toggleRender(false);
		super.destroy();
	}
}
