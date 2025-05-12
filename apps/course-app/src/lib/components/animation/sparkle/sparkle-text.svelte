
<script lang="ts">
  import { onDestroy, onMount } from 'svelte';
  import Sparkle from './sparkle.svelte';

  interface TSparkle {
    id: string;
    x: string;
    y: string;
    color: string;
    delay: number;
    scale: number;
    lifespan: number;
  }

  export let text: string = 'Hello World';
  export let colors = {
    first: '#9E7AFF',
    second: '#FE8BBB'
  };
  export let sparklesCount = 5;

  export let className: string = '';
  export { className as class };

  let sparkles: TSparkle[] = [];

  const generateStar = (): TSparkle => {
    const starX = `${Math.random() * 100}%`;
    const starY = `${Math.random() * 100}%`;
    const color = Math.random() > 0.5 ? colors.first : colors.second;
    const delay = Math.random() * 4;
    const scale = Math.random() * 1 + 0.3;
    const lifespan = Math.random() * 10 + 5;
    const id = `${starX}-${starY}-${Date.now()}`;
    return { id, x: starX, y: starY, color, delay, scale, lifespan };
  };

  const initializeStars = () => {
    sparkles = Array.from({ length: sparklesCount }, generateStar);
  };

  const updateStars = () => {
    sparkles = sparkles.map((star) =>
      star.lifespan <= 0 ? generateStar() : { ...star, lifespan: star.lifespan - 0.1 }
    );
  };

  let interval: ReturnType<typeof setInterval>;

  onMount(() => {
    initializeStars();
    interval = setInterval(updateStars, 100);
  });

  onDestroy(() => {
    clearInterval(interval);
  });
</script>

<div
  style="--sparkles-first-color: {colors.first}; --sparkles-second-color: {colors.second};"
  class={className}
  {...$$restProps}
>
  <span class="relative inline-block">
    {#each sparkles as item}
      <Sparkle {...item} />
    {/each}
    <strong>{text}</strong>
  </span>
</div>
