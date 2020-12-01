<script lang="ts">
  import { clientConnect } from "raw-lib/src/transport";
  import { createClient } from "raw-lib/src/client";

  import type { ClientInputEvent, ClientOutputEvent } from "raw-lib/src/types";
  import type { Events } from "raw-lib/src/bookmarks";

  import { onDestroy } from "svelte";

  import Bookmarks from "../components/Bookmarks.svelte";

  const extensionId = "naljgifnpkbcfkeapikhahheciachbcg";
  const { input, output } = clientConnect<ClientInputEvent, ClientOutputEvent>(
    extensionId
  );

  const { send } = createClient<Events>(input, output);

  onDestroy(() => {
    output.complete();
  });

  let tree: chrome.bookmarks.BookmarkTreeNode[];
  const getTree = async () => {
    tree = await send({
      namespace: "bookmarks",
      type: "getTree",
    });
    console.log("bookmarks.getTree", tree);
  };

  let query: string = "";
  const search = async () => {
    tree = await send({
      namespace: "bookmarks",
      type: "search",
    });
  };
</script>

<input type="text" placeholder="enter query" bind:value={query} />
<button on:click={() => search()}>search</button>
<button on:click={() => getTree()}>bookmarks.getTree</button>

<Bookmarks {tree} />
