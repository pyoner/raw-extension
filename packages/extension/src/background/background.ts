import { RpcProvider } from 'worker-rpc'

import bookmarks from './bookmarks'
import { init } from './helpers'

chrome.runtime.onConnectExternal.addListener((port) => {
  const rpcProvider = new RpcProvider((message, transfer) => {
    console.log('transfer', transfer)
    port.postMessage(message)
  })

  init(rpcProvider, port, bookmarks)
})
