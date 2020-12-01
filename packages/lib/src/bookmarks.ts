import chromep from "chrome-promise";
import type { chromepApi } from "chrome-promise/chrome-promise";
import type { API, BuildEvent } from "./types";

export const NAMESPACE = "bookmarks" as const;
export const ENDPOINT = chromep.bookmarks;
export const METHODS = [
  "get",
  "getChildren",
  "getRecent",
  "getTree",
  "getSubTree",
  "search",
  "create",
  "move",
  "update",
  "remove",
  "removeTree",
] as const;

export const api: API = {
  namespace: NAMESPACE,
  endpoint: ENDPOINT,
  methods: [...METHODS],
};

export type Namespace = typeof NAMESPACE;
export type Endpoint = chromepApi.bookmarks.Bookmarks;
export type Methods = typeof METHODS[number];

export type EventGet = BuildEvent<Namespace, Endpoint, Methods, "get">;
export type EventGetChildren = BuildEvent<
  Namespace,
  Endpoint,
  Methods,
  "getChildren"
>;
export type EventGetRecent = BuildEvent<
  Namespace,
  Endpoint,
  Methods,
  "getRecent"
>;
export type EventGetTree = BuildEvent<Namespace, Endpoint, Methods, "getTree">;
export type EventGetSubTree = BuildEvent<
  Namespace,
  Endpoint,
  Methods,
  "getSubTree"
>;
export type EventSearch = BuildEvent<Namespace, Endpoint, Methods, "search">;
export type EventCreate = BuildEvent<Namespace, Endpoint, Methods, "create">;
export type EventMove = BuildEvent<Namespace, Endpoint, Methods, "move">;
export type EventUpdate = BuildEvent<Namespace, Endpoint, Methods, "update">;
export type EventRemove = BuildEvent<Namespace, Endpoint, Methods, "remove">;

export type Events =
  | EventGet
  | EventGetChildren
  | EventGetRecent
  | EventGetSubTree
  | EventGetTree
  | EventMove
  | EventRemove
  | EventSearch
  | EventUpdate;
