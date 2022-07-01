<script>
  import { getImageUrl } from "../utilities/sanity.js";
  export let portableText;

  const { alt, caption, image } = portableText.value;
  const url = getImageUrl(image.asset._ref);
</script>

<figure>
  <img src={url} {alt} />
  <figcaption>{caption}</figcaption>
</figure>
