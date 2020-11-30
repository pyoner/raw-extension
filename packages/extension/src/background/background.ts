import { RpcProvider } from "worker-rpc";

import bookmarks from "./bookmarks";
import { init } from "./helpers";

chrome.runtime.onConnectExternal.addListener((port) => {
  console.log("external connection", port);
  const rpcProvider = new RpcProvider((message, transfer) => {
    port.postMessage(message);
  });

  init(rpcProvider, port, bookmarks);
});
