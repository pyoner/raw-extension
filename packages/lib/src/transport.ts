import { Observable } from 'rxjs'
import { ResponseEvent } from './types'

export function connect(
  ...args: Parameters<typeof chrome.runtime.connect>
) {
  return new Observable<ResponseEvent>((subscriber) => {
    const port = chrome.runtime.connect(...args)

    // message
    const onMessage = (message: any) => {
      subscriber.next(message)
    }
    port.onMessage.addListener(onMessage)

    // disconnect
    const onDisconnect = () => {
      subscriber.complete()
      port.onMessage.removeListener(onMessage)
      port.onDisconnect.removeListener(onDisconnect)
    }
    port.onDisconnect.addListener(onDisconnect)
  })
}
