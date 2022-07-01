<script>
  import { PortableText } from "@portabletext/svelte";
  import Figure from "./Figure.svelte";
  export let value;
</script>

<PortableText
  {value}
  components={{
    types: {
      figure: Figure,
    },
  }}
/>
