<script lang="ts">
  import { onDestroy } from 'svelte'
  import { RpcProvider } from 'worker-rpc'

  import Bookmarks from '../components/Bookmarks.svelte'

  const extensionId = 'naljgifnpkbcfkeapikhahheciachbcg'
  const port = chrome.runtime.connect(extensionId)

  const rpcProvider = new RpcProvider((message, transfer) => {
    console.log('transfer', transfer)
    port.postMessage(message)
  })

  port.onMessage.addListener((message) => {
    rpcProvider.dispatch(message)
  })

  onDestroy(() => {
    port.disconnect()
  })

  let bookmarksTree: chrome.bookmarks.BookmarkTreeNode[]
  const getTree = async () => {
    bookmarksTree = await rpcProvider.rpc('bookmarks.getTree')
    console.log('bookmarks.getTree', bookmarksTree)
  }

  let query: string = ''
  const search = async () => {
    bookmarksTree = await rpcProvider.rpc('bookmarks.search', [
      query,
    ])
  }
</script>

<input
  type="text"
  placeholder="enter query"
  bind:value={query} />
<button on:click={() => search()}>search</button>
<button on:click={() => getTree()}>bookmarks.getTree</button>

<Bookmarks tree={bookmarksTree} />
