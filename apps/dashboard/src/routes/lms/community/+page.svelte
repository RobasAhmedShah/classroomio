<script>
  import { goto } from '$app/navigation';
  import Community from '$lib/components/Org/Community/index.svelte';
  import PrimaryButton from '$lib/components/PrimaryButton/index.svelte';
  import { t } from '$lib/utils/functions/translations';

  function askCommunity() {
    goto(`/lms/community/ask`);
  }
</script>

<svelte:head>
  <title>Community - Learnova</title>
</svelte:head>

<section class="w-full max-w-4xl mx-auto">
  <div class="py-10 px-5">
    <div class="flex items-center justify-between mb-10">
      <h1 class="dark:text-white text-3xl font-bold">{$t('community.title')}</h1>
      <PrimaryButton label={$t('community.ask_button')} onClick={askCommunity} />
    </div>

    <Community isLMS={true} />
  </div>
</section>
