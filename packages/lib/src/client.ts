import { clientConnect } from './transport'
import { RequestEvent, ResponseEvent } from './types'

export function createClient<
  C extends RequestEvent,
  S extends ResponseEvent
>(...args: Parameters<typeof chrome.runtime.connect>) {
  let transactionId = 0
  const promises: Map<number, [Function, Function]> = new Map()

  const { destination, source } = clientConnect<C, S>(...args)
  source.subscribe((event) => {
    const { id, payload } = event
    if (id === undefined) {
      return
    }

    const result = promises.get(id)
    if (result === undefined) {
      return
    }

    // delete promise
    promises.delete(id)

    const [resolve, reject] = result
    const func = event.type === 'error' ? reject : resolve
    func(payload)
  })

  const send = (event: C) => {
    const id = transactionId++
    destination.next({ ...event, id })

    return new Promise<S>((resolve, reject) => {
      promises.set(id, [resolve, reject])
    })
  }
  return { send }
}
