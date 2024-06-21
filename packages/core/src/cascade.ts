export class Cascade {
  private _rpc: string;
  constructor(rpc: string) {
    this._rpc = rpc;
    return this;
  }

  get rpc() {
    return this._rpc;
  }
}
