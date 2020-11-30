import { clientConnect } from "./transport";
import { ClientOutputEvent, ClientInputEvent } from "./types";

export function createClient<
  I extends ClientInputEvent,
  O extends ClientOutputEvent
>(...args: Parameters<typeof chrome.runtime.connect>) {
  let transactionId = 0;
  const promises: Map<number, [Function, Function]> = new Map();

  const { input, output } = clientConnect<I, O>(...args);
  input.subscribe((event) => {
    const { id, payload } = event;
    if (id === undefined) {
      return;
    }

    const result = promises.get(id);
    if (result === undefined) {
      return;
    }

    // delete promise
    promises.delete(id);

    const [resolve, reject] = result;
    const func = event.type === "error" ? reject : resolve;
    func(payload);
  });

  const send = (event: O) => {
    const id = transactionId++;
    output.next({ ...event, id });

    return new Promise<I>((resolve, reject) => {
      promises.set(id, [resolve, reject]);
    });
  };
  return { send };
}
