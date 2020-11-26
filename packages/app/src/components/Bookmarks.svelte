<script lang="ts">
  export let tree: chrome.bookmarks.BookmarkTreeNode[]
</script>

{#if tree}
  <ul>
    {#each tree as node (node.id)}
      <li>
        {#if node.children}
          {node.title}
          <svelte:self tree={node.children} />
        {:else}
          <a
            href={node.url}
            target="_blank"
            rel="noopener noreferrer">{node.title}</a>
        {/if}
      </li>
    {/each}
  </ul>
{/if}
