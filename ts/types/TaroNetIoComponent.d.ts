declare class TaroNetIoComponent extends TaroEventingClass implements TaroNetIoClient {

	stream: TaroStreamComponent;

	send(commandName: string, data: any): void;
}
