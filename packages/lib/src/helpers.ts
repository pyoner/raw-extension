import { RpcProvider } from 'worker-rpc'
import { API } from './types'

export function buildFuncions(api: API) {
  const funcs: Record<string, Function> = {}

  api.methods.forEach((name) => {
    funcs[name] = function () {}
  })

  return funcs
}

const extensionId =
  process.env.EXTENSION_ID || 'naljgifnpkbcfkeapikhahheciachbcg'

let port: chrome.runtime.Port | null = null
export function getPort() {
  if (!port) {
    port = chrome.runtime.connect(extensionId)
    port.onDisconnect.addListener(() => {
      port = null
    })
  }
  return port
}

let provider: RpcProvider | null = null
export function getProvider() {
  const p = getPort()

  if (!provider) {
    provider = new RpcProvider((message, transfer) => {
      p.postMessage(message)
    })

    p.onMessage.addListener((message) => {
      provider?.dispatch(message)
    })
  }

  return provider
}
