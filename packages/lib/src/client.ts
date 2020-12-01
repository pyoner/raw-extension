import { Observable, Observer } from "rxjs";
import { InferReturnType } from "./bookmarks";
import { ClientOutputEvent, ClientInputEvent, Optional } from "./types";

export function createClient<S extends Optional<ClientOutputEvent, "id">>(
  input: Observable<ClientInputEvent>,
  output: Observer<ClientOutputEvent>
) {
  let transactionId = 0;
  const promises: Map<number, [Function, Function]> = new Map();

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

  const send = (event: S) => {
    const id = transactionId++;
    output.next({ ...event, id });

    return new Promise<InferReturnType<S>>((resolve, reject) => {
      promises.set(id, [resolve, reject]);
    });
  };
  return { send };
}
