<script>
  let count = 10;

  function incrementCount() {
    count++;
  }
</script>

<h1>Counter Element</h1>
<p>Count: <span>{count}</span></p>
<button on:click={incrementCount}>+</button>
