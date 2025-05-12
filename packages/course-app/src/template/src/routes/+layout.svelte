<script lang="ts">
  import { onMount } from 'svelte';
  import { page } from '$app/stores';
  import { components } from '$lib/components';
  import Transition from '$lib/components/ui/_custom/Transition.svelte';
  import { getPageSection } from '$lib/utils/helpers/page';
  import { courses } from '$lib/utils/stores/course';
  import { homePage, sharedPage } from '$lib/utils/stores/pages';
  import type { Course } from '$lib/utils/types/course';
  import type { Page, Section } from '$lib/utils/types/page';

  import '../app.css';

  export let data: {
    page: Page;
    sharedPage: Page;
    courses: Course[];
  };

  const seo: Section | undefined = getPageSection(data.sharedPage, 'seo');

  onMount(() => {
    homePage.set(data.page);
    sharedPage.set(data.sharedPage);
    courses.set(data.courses);
  });
</script>

<svelte:head>
  {#if seo?.settings?.title}
    <title>{seo.settings.title}</title>
  {/if}
  {#if seo?.settings?.description}
    <meta name="description" content={seo.settings.description} />
  {/if}
</svelte:head>

{#if $homePage.id}
  <main>
    <Transition>
      {#if !$page.url.pathname.includes('course/')}
        <components.navigation />
      {/if}

      <slot />

      {#if !$page.url.pathname.includes('course/')}
        <components.footer />
      {/if}
    </Transition>
  </main>
{:else}
  <div class="loading">
    Loading...
  </div>
{/if}
