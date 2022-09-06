declare class Client extends IgeEventingClass {

	myPlayer: IgeEntity;
	selectedUnit: IgeEntity;
	entityUpdateQueue: Record<string, UpdateData[]>;

	rendererLoaded: JQueryDeferred<void>;
	playerJoined: JQueryDeferred<void>;

	inactiveTabEntityStream: any[];

	isZooming: boolean;

	constructor(options?: object);
}
