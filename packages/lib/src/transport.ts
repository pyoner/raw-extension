import { Observable, Observer } from "rxjs";
import type { ServerInputEvent, ServerOutputEvent } from "./types";

export function clientConnect<I, O>(
  ...args: Parameters<typeof chrome.runtime.connect>
) {
  let port: chrome.runtime.Port | null = null;
  const input = new Observable<I>((subscriber) => {
    port = chrome.runtime.connect(...args);

    // message
    const onMessage = (event: I) => {
      subscriber.next(event);
    };
    port.onMessage.addListener(onMessage);

    // disconnect
    const onDisconnect = () => {
      subscriber.complete();
      port?.onMessage.removeListener(onMessage);
      port?.onDisconnect.removeListener(onDisconnect);
      port = null;
    };
    port.onDisconnect.addListener(onDisconnect);
  });

  const output: Observer<O> = {
    next(value) {
      port?.postMessage(value);
    },

    complete() {
      port?.disconnect();
    },

    error(err) {
      port?.postMessage(err);
    },

    get closed() {
      return Boolean(port);
    },
  };

  return { input, output };
}

export function serverConnect<I = any, O = any>() {
  const input = new Observable<ServerInputEvent<I>>((subscriber) => {
    const onConnectExternal = (port: chrome.runtime.Port) => {
      // emit ConnectEvent
      subscriber.next({
        type: "connect",
        from: port,
      });
      const onMessage = (message: any) => {
        // emit MessageEvent
        subscriber.next({
          type: "message",
          from: port,
          message,
        });
      };
      port.onMessage.addListener(onMessage);

      const onDisconnect = () => {
        port.onDisconnect.removeListener(onDisconnect);
        port.onMessage.removeListener(onMessage);

        // emit DisconnectEvent
        subscriber.next({
          type: "disconnect",
          from: port,
        });
      };
      port.onDisconnect.addListener(onDisconnect);
    };
    chrome.runtime.onConnectExternal.addListener(onConnectExternal);

    return function unsubscribe() {
      chrome.runtime.onConnectExternal.removeListener(onConnectExternal);
    };
  });

  const output: Observer<ServerOutputEvent<O>> = {
    next({ to, message }) {
      to.postMessage(message);
    },
    complete() {},
    error() {},
  };

  return { input, output };
}
