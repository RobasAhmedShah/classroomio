<script>
  import { onMount } from 'svelte';
  import { SyncLoader } from 'svelte-loading-spinners';
  import PlayContainer from './Container.svelte';
  import PlayHeader from './Header/index.svelte';
  import { quizStore, playQuizStore } from '$lib/utils/store/org';
  import { STEPS } from '$lib/utils/constants/quiz';
  import { genQuizPin } from '$lib/utils/functions/org';
  import PrimaryButton from '$lib/components/PrimaryButton/index.svelte';
  import { VARIANTS } from '$lib/components/PrimaryButton/constants';

  let isGettingPin = true;

  function getPin() {
    setTimeout(() => {
      $quizStore.pin = genQuizPin();
      isGettingPin = false;
    }, 3000);
  }

  function goToPlayersStep() {
    $playQuizStore.step = STEPS.WAIT_FOR_PLAYERS;
  }

  onMount(() => {
    getPin();
  });
</script>

<PlayContainer>
  <div slot="header">
    <PlayHeader startCount={true} showCountDown={true} />
  </div>

  <div slot="body" class="w-full rounded-md bg-white dark:bg-neutral-800 py-7 px-5">
    <div class="mb-3">
      <p>1. Visit</p>
      <h3>play.Learnova.com</h3>
    </div>
    <div class="">
      <p>2. Enter Pin</p>
      {#if isGettingPin}
        <SyncLoader size="50" color="#1d4ed8" unit="px" duration="1s" />
      {:else}
        <h3>{$quizStore.pin}</h3>
      {/if}
    </div>
  </div>

  <div slot="footer" class="flex justify-center items-center">
    <p class="font-bold mr-3">Let's go</p>
    <PrimaryButton label="View Players" variant={VARIANTS.OUTLINED} onClick={goToPlayersStep} />
  </div>
</PlayContainer>
