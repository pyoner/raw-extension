import { Observable, Observer } from 'rxjs'

export function clientConnect<C, S>(
  ...args: Parameters<typeof chrome.runtime.connect>
) {
  let port: chrome.runtime.Port | null = null
  const source = new Observable<S>((subscriber) => {
    port = chrome.runtime.connect(...args)

    // message
    const onMessage = (event: S) => {
      subscriber.next(event)
    }
    port.onMessage.addListener(onMessage)

    // disconnect
    const onDisconnect = () => {
      subscriber.complete()
      port?.onMessage.removeListener(onMessage)
      port?.onDisconnect.removeListener(onDisconnect)
      port = null
    }
    port.onDisconnect.addListener(onDisconnect)
  })

  const destination: Observer<C> = {
    next(value) {
      port?.postMessage(value)
    },

    complete() {
      port?.disconnect()
    },

    error(err) {
      console.error(err)
    },

    get closed() {
      return Boolean(port)
    },
  }

  return { source, destination }
}

export function serverConnect<T>() {
  const source = new Observable<chrome.runtime.Port>(
    (subscriber) => {
      const onConnectExternal = (port: chrome.runtime.Port) => {
        subscriber.next(port)
      }
      chrome.runtime.onConnectExternal.addListener(
        onConnectExternal,
      )

      return function unsubscribe() {
        chrome.runtime.onConnectExternal.removeListener(
          onConnectExternal,
        )
      }
    },
  )

  const destination: Observer<T> = {
    next(value) {},
    complete() {},
    error() {},
  }

  return { source, destination }
}
