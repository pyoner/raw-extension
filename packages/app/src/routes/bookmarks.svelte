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

  let bookmarksTree: chrome.bookmarks.BookmarkTreeNode[]
  const getTree = async () => {
    bookmarksTree = await rpcProvider.rpc('bookmarks.getTree')
    console.log('bookmarks.getTree', bookmarksTree)
  }
</script>

<button on:click={() => getTree()}>bookmarks.getTree</button>
<div>
  {#if bookmarksTree}
    {#each bookmarksTree as node (node.id)}
      <div>
        <div>id: {node.id}</div>
        <div>title: {node.title}</div>
        <div>children: {node.children}</div>
      </div>
    {/each}
  {/if}
</div>
