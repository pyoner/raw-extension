import { ChromeRuntimePort } from './transport'
import { BaseEvent } from './types'

export function createClient<T extends BaseEvent>(
  ...args: Parameters<typeof chrome.runtime.connect>
) {
  let transactionId = 0
  const promises: Map<number, [Function, Function]> = new Map()

  const transport = new ChromeRuntimePort<T>(...args)
  transport.subscribe((message) => {
    const { id, payload, namespace } = message
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
    const func = namespace === 'error' ? reject : resolve
    func(payload)
  })

  const send = (message: T) => {
    const id = transactionId++
    transport.next({ ...message, id })

    return new Promise<T>((resolve, reject) => {
      promises.set(id, [resolve, reject])
    })
  }
  return { send }
}
