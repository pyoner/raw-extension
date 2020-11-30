import { Observable, Observer } from "rxjs";
import { ServerOutputEvent, ServerInputEvent } from "./types";

export function createServer<I, O>(
  input: Observable<ServerInputEvent<I>>,
  output: Observer<ServerOutputEvent<O>>
) {}
