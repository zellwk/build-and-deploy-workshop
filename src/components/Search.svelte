<script>
  import algolia from "algoliasearch/lite.js";
  const client = algolia("WGGTXJI80W", "914cb19bac3b5f92d0fc2d0dede112bf");
  const index = client.initIndex("content");
  let query = "";
  let hits = [];

  async function search() {
    const response = await index.search(query);
    hits = response.hits;
  }
</script>

<h1>Search</h1>
<input type="text" bind:value={query} on:keyup={search} />

{#each hits as hit}
  <div style="border: 2px solid black">
    <p><strong>{hit.content || hit.h2 || hit.h1}</strong></p>
    <p>Under this file: {hit.h1}</p>
    <a href={hit.link}>{hit.link}</a>
  </div>
{/each}
