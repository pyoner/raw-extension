import chromep from "chrome-promise";
import { chromepApi } from "chrome-promise/chrome-promise";
import { API, ClientOutputEvent, UnifyOverloads } from "./types";

export const api: API = {
  namespace: "bookmarks",
  endpoint: chromep.bookmarks,
  methods: [
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
  ],
};

export type Bookmarks = chromepApi.bookmarks.Bookmarks;
export interface Event<
  N extends keyof Bookmarks,
  F extends (...args: any) => any
> extends ClientOutputEvent<Parameters<UnifyOverloads<F>>> {
  namespace: "bookmarks";
  type: N;
}

export type EventGet = Event<"get", Bookmarks["get"]>;
export type EventGetChildren = Event<"getChildren", Bookmarks["getChildren"]>;

export type EventGetRecent = Event<"getRecent", Bookmarks["getRecent"]>;

export type EventGetTree = Event<"getTree", Bookmarks["getTree"]>;

export type EventGetSubTree = Event<"getSubTree", Bookmarks["getSubTree"]>;

export type EventSearch = Event<"search", Bookmarks["search"]>;

export type EventCreate = Event<"create", Bookmarks["create"]>;

export type EventMove = Event<"move", Bookmarks["move"]>;

export type EventUpdate = Event<"update", Bookmarks["update"]>;

export type EventRemove = Event<"remove", Bookmarks["remove"]>;

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
