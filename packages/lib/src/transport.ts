import { Observable, Observer } from 'rxjs'
import { AnonymousSubject } from 'rxjs/internal/Subject'

function _connect<T>(
  ...args: Parameters<typeof chrome.runtime.connect>
) {
  let port: chrome.runtime.Port | null = null
  const source = new Observable<T>((subscriber) => {
    port = chrome.runtime.connect(...args)

    // message
    const onMessage = (event: T) => {
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

  const destination: Observer<T> = {
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

export class ChromeRuntimePort<T> extends AnonymousSubject<T> {
  constructor(
    ...args: Parameters<typeof chrome.runtime.connect>
  ) {
    const { destination, source } = _connect<T>(...args)

    super(destination, source)
  }
}
