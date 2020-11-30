import { Observable, Observer } from "rxjs";
import { api } from "./bookmarks";
import {
  ServerOutputEvent,
  ServerInputEvent,
  API,
  ClientOutputEvent,
  ClientInputEvent,
} from "./types";

export function createServer(
  input: Observable<ServerInputEvent<ClientOutputEvent>>,
  output: Observer<ServerOutputEvent<ClientInputEvent>>,
  apis: Record<API["namespace"], API>
) {
  return input.subscribe((event) => {
    switch (event.type) {
      case "message":
        const { message } = event;
        const { endpoint, methods } = apis[message.namespace];
        if (
          endpoint &&
          message.type in endpoint &&
          methods.includes(message.type)
        ) {
          const { payload = [] } = message;
          try {
            const result = endpoint[message.type](...payload);
            if (result instanceof Promise) {
              result.then((value) => {
                output.next({
                  to: event.from,
                  message: {
                    id: message.id,
                    payload: value,
                  },
                });
              });
            } else {
              output.next({
                to: event.from,
                message: {
                  id: message.id,
                  payload: result,
                },
              });
            }
          } catch (err) {
            output.error({
              to: event.from,
              message: {
                id: message.id,
                type: "error",
                payload: err,
              },
            });
          }
        }
        break;
    }
  });
}
