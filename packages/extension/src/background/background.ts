import { createServer } from "raw-lib/src/server";
import { serverConnect } from "raw-lib/src/transport";
import { api as bookmarks } from "raw-lib/src/bookmarks";

const apis = {
  [bookmarks.namespace]: bookmarks,
};
const { input, output } = serverConnect();
const subs = createServer(input, output, apis);
console.log(subs);
