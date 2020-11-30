import { RpcProvider, RpcProviderInterface } from "worker-rpc";
import { API } from "./types";

export function init(
  provider: RpcProvider,
  port: chrome.runtime.Port,
  api: API
) {
  const handlers: [
    string,
    RpcProviderInterface.RpcHandler<any, any>
  ][] = api.methods.map((method) => {
    const id = `${api.namespace}.${method}`;
    const handler = (payload?: any[]) => {
      if (payload) {
        return api.endpoint[method](...payload);
      }

      return api.endpoint[method]();
    };

    return [id, handler];
  });

  handlers.forEach(([id, func]) => provider.registerRpcHandler(id, func));

  const onMessage = (message: any, port: chrome.runtime.Port) => {
    console.log("onMessage port", port);
    console.log("onMessage message", message);
    provider.dispatch(message);
  };
  port.onMessage.addListener(onMessage);

  const onDisconnect = (port: chrome.runtime.Port) => {
    console.log("onDisconnect", port);
    handlers.forEach(([id, func]) => provider.deregisterRpcHandler(id, func));
  };
  port.onDisconnect.addListener(onDisconnect);
}
