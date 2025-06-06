<script>
  import { onMount } from 'svelte';
  import FlowStreamReferenceIcon from 'carbon-icons-svelte/lib/FlowStreamReference.svelte';
  import ChartClusterBarIcon from 'carbon-icons-svelte/lib/ChartClusterBar.svelte';
  import MachineLearningModelIcon from 'carbon-icons-svelte/lib/MachineLearningModel.svelte';
  import TextField from '$lib/components/Form/TextField.svelte';
  import PrimaryButton from '$lib/components/PrimaryButton/index.svelte';
  import { getSupabase } from '$lib/utils/functions/supabase';
  import { validateEmail } from '$lib/utils/functions/validateEmail';

  let email = '';
  let isAdding = false;
  let success = false;

  const supabase = getSupabase();
  const animate = 'transition delay-75 duration-300 ease-in-out';
  const areas = [
    {
      title: 'Access',
      description:
        'Quickly find any material you need to get your job done. LearnovaAi offers the All-in-on-platform'
    },
    {
      title: 'Analytics',
      description:
        'Avoid assumptions, better understand the needs of your classrooms and give students a personlized experience'
    },
    {
      title: 'Automation',
      description:
        'Lesson reminders, deadline reminders and many other automated alerts to help everyone in the learning process be proactive'
    }
  ];

  async function handleSubmit() {
    if (!email || !validateEmail(email)) return;
    isAdding = true;

    await supabase.from('waitinglist').insert([{ email }]);

    success = true;

    setTimeout(() => {
      isAdding = false;
      success = false;
      email = '';
    }, 5000);
  }

  onMount(() => {
    console.log('Welcome to CIO');
  });
</script>

<svelte:head>
  <title>Learnova - The classroom software</title>
</svelte:head>

<div class="md:h-[93vh] w-screen flex items-center justify-center flex-col m-2 sm:m-0 font-sans">
  <!--
    <img
      src="/logo-192.png"
      alt="Learnova logo"
      class="rounded inline-block mx-auto w-20 h-20 sm:w-auto sm:h-auto"
      data-atf="1"
    />
  -->
  <div>
    <h3 class="dark:text-white text-4xl text-center">
      Learnova<span class="text-primary-700">Ai</span>
    </h3>
    <p class="dark:text-white text-lg text-center">
      The operating system for classroooms of the future 🚀🚀🚀.
    </p>
  </div>

  <form on:submit|preventDefault={handleSubmit} class="my-4 hidden">
    <div class="flex items-center flex-col sm:flex-row">
      {#if success}
        <p class="dark:text-white">You have been added successfully. Thanks for joining.</p>
      {:else}
        <TextField
          bind:value={email}
          type="email"
          placeholder="Enter your email.."
          className="mr-3 my-2"
          isRequired={true}
          isDisabled={isAdding}
        />
        <PrimaryButton type="submit" isLoading={isAdding}>Join waiting list</PrimaryButton>
      {/if}
    </div>
  </form>

  <div class="flex flex-col md:flex-row mt-4">
    {#each areas as area, index}
      <div
        class="max-w-[350px] m-3 bg-white dark:bg-black rounded-md py-3 px-12 active shadow-xl border-2 hover:border-primary-700 {animate}"
      >
        <h3 class="dark:text-white text-3xl">
          {#if index === 0}
            <FlowStreamReferenceIcon size={32} class="carbon-icon dark:text-white" />
          {:else if index === 1}
            <ChartClusterBarIcon size={32} class="carbon-icon dark:text-white" />
          {:else if index === 2}
            <MachineLearningModelIcon size={32} class="carbon-icon dark:text-white" />
          {/if}
          {area.title}
        </h3>
        <p class="dark:text-white">{area.description}</p>
      </div>
    {/each}
  </div>
</div>
