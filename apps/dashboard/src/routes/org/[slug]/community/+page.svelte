<script>
  import { goto } from '$app/navigation';
  import Community from '$lib/components/Org/Community/index.svelte';
  import PrimaryButton from '$lib/components/PrimaryButton/index.svelte';
  import { VARIANTS } from '$lib/components/PrimaryButton/constants';
  import { currentOrgPath } from '$lib/utils/store/org';
  import { isMobile } from '$lib/utils/store/useMobile';
  import Add from 'carbon-icons-svelte/lib/Add.svelte';
  import { t } from '$lib/utils/functions/translations';

  function askCommunity() {
    goto(`${$currentOrgPath}/community/ask`);
  }
</script>

<svelte:head>
  <title>Community - Learnova</title>
</svelte:head>

<section class="w-full md:max-w-4xl md:mx-auto">
  <div class="w-full py-10 px-5">
    <div class="flex items-center justify-between mb-10 w-full">
      <h1 class="dark:text-white text-2xl md:text-3xl font-bold">{$t('community.title')}</h1>
      {#if $isMobile}
        <PrimaryButton onClick={askCommunity}>
          <Add size={24} />
        </PrimaryButton>
      {:else}
        <PrimaryButton
          label={$t('community.ask_button')}
          variant={VARIANTS.CONTAINED_DARK}
          onClick={askCommunity}
        />
      {/if}
    </div>
    <Community />
  </div>
</section>
