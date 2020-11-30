import { Observable, Observer } from "rxjs";
import { Sender, ServerDestinationEvent, ServerSourceEvents } from "./types";

export function clientConnect<C, S>(
  ...args: Parameters<typeof chrome.runtime.connect>
) {
  let port: chrome.runtime.Port | null = null;
  const source = new Observable<S>((subscriber) => {
    port = chrome.runtime.connect(...args);

    // message
    const onMessage = (event: S) => {
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

  const destination: Observer<C> = {
    next(value) {
      port?.postMessage(value);
    },

    complete() {
      port?.disconnect();
    },

    error(err) {
      console.error(err);
    },

    get closed() {
      return Boolean(port);
    },
  };

  return { source, destination };
}

export function serverConnect<S, C>() {
  const senders: Record<Sender, chrome.runtime.Port> = {};
  const source = new Observable<ServerSourceEvents<S>>((subscriber) => {
    const onConnectExternal = (port: chrome.runtime.Port) => {
      const sender = port.sender?.origin;
      if (sender === undefined) {
        return;
      }

      senders[sender] = port;
      // emit ConnectEvent
      subscriber.next({
        type: "connect",
        sender,
      });
      const onMessage = (message: any) => {
        // emit MessageEvent
        subscriber.next({
          type: "message",
          sender,
          message,
        });
      };
      port.onMessage.addListener(onMessage);

      const onDisconnect = () => {
        delete senders[sender];
        port.onDisconnect.removeListener(onDisconnect);
        port.onMessage.removeListener(onMessage);

        // emit DisconnectEvent
        subscriber.next({
          type: "disconnect",
          sender,
        });
      };
      port.onDisconnect.addListener(onDisconnect);
    };
    chrome.runtime.onConnectExternal.addListener(onConnectExternal);

    return function unsubscribe() {
      chrome.runtime.onConnectExternal.removeListener(onConnectExternal);
    };
  });

  const destination: Observer<ServerDestinationEvent<C>> = {
    next({ to, message }) {
      senders[to]?.postMessage(message);
    },
    complete() {},
    error() {},
  };

  return { source, destination };
}
