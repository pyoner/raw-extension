<script lang="ts">
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

  let bookmarksTree: chrome.bookmarks.BookmarkTreeNode[]
  const getTree = async () => {
    bookmarksTree = await rpcProvider.rpc('bookmarks.getTree')
    console.log('bookmarks.getTree', bookmarksTree)
  }
</script>

<button on:click={() => getTree()}>bookmarks.getTree</button>

<Bookmarks tree={bookmarksTree} />
