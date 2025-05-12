<script lang="ts">
  import { onMount } from 'svelte';
  import { page } from '$app/stores';
  import { homePage, sharedPage } from '$lib/utils/stores/pages';
  import { courses } from '$lib/utils/stores/course';
  import { getPageSection } from '$lib/utils/helpers/page';
  import { components } from '$lib/components';
  import Transition from '$lib/components/ui/_custom/Transition.svelte';
  import type { Page, Section } from '$lib/utils/types/page';
  import type { Course } from '$lib/utils/types/course';

  import '../app.css';

  type Props = {
    data: {
      page: Page;
      sharedPage: Page;
      courses: Course[];
    };
  };

  export let data: Props['data'];
  export let children: import('svelte').Snippet;

  const seo: Section | undefined = $derived(getPageSection(data.sharedPage, 'seo'));

  onMount(() => {
    homePage.set(data.page);
    sharedPage.set(data.sharedPage);
    courses.set(data.courses);
  });
</script>

<svelte:head>
  <title>{seo?.settings.title}</title>
  <meta name="description" content={seo?.settings.description} />
</svelte:head>

{#if $homePage.id}
  <main>
    <Transition>
      {#if !$page.url.pathname.includes('course/')}
        <components.navigation />
      {/if}

      {@render children?.()}

      {#if !$page.url.pathname.includes('course/')}
        <components.footer />
      {/if}
    </Transition>
  </main>
{/if}
