import { RpcProvider } from 'worker-rpc'

chrome.runtime.onConnectExternal.addListener((port) => {
  const rpcProvider = new RpcProvider((message, transfer) => {
    console.log('transfer', transfer)
    port.postMessage(message)
  })

  port.onMessage.addListener((message) => {
    rpcProvider.dispatch(message)
  })

  rpcProvider.registerRpcHandler(
    'add',
    ({ x, y }: { x: number; y: number }) => x + y,
  )
})
