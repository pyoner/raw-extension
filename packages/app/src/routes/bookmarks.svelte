<script lang="ts">
  import { RpcProvider } from 'worker-rpc'

  const extensionId = 'naljgifnpkbcfkeapikhahheciachbcg'
  const port = chrome.runtime.connect(extensionId)

  const rpcProvider = new RpcProvider((message, transfer) => {
    console.log('transfer', transfer)
    port.postMessage(message)
  })

  port.onMessage.addListener((message) => {
    rpcProvider.dispatch(message)
  })

  let result: number

  const add = async (x: number, y: number) => {
    result = await rpcProvider.rpc('add', { x, y })
  }
</script>

<button on:click={() => add(1, 2)}>add 1 + 2</button>
=
{typeof result === undefined ? '?' : result}
