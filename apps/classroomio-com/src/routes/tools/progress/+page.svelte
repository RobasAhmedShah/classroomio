<script lang="ts">
  import { LogoFacebook, LogoLinkedin } from 'carbon-icons-svelte';
  import { onDestroy } from 'svelte';
  import { fly } from 'svelte/transition';
  import { sineInOut } from 'svelte/easing';
  import Mood from './components/Mood.svelte';
  import ToolsHeader from '$lib/ToolsHeader/ToolsHeader.svelte';
  import Avatar from './components/Avatar.svelte';
  import Background from './components/Background.svelte';
  import Report from './components/Report.svelte';
  import FullView from './components/FullView.svelte';
  import DownloadButton from './components/DownloadButton.svelte';
  import { htmlBody, type HtmlBody, openModal, isFormComplete } from './components/store';

  const MAX_CHARS = 160;
  let remainingChars = MAX_CHARS;
  let showReport: boolean = false;
  let showSetter: boolean = true;
  let isDownloading: boolean = false;
  let isDisabled: boolean;

  // sets the result of the mini validation for the htmlBody store
  const unsubscribe = isFormComplete.subscribe((value) => {
    isDisabled = value;
  });

  function handleInputChange(event: any, property: keyof HtmlBody) {
    $htmlBody[property] = event.target.value;

    if (property === 'learning') {
      remainingChars = MAX_CHARS - event.target.value.length;
    }
  }

  function shareTemplate() {
    return encodeURIComponent(
      `Learning Progress Update: ${$htmlBody.learning} and I'm ${$htmlBody.mood.text}. \nGenerated yours on Learnova.com\n`
    );
  }

  function shareOnTwitter() {
    const text = shareTemplate();
    const hashtags = encodeURIComponent('Learnova,progressReport');
    const url = `https://x.com/intent/post?text=${text}&hashtags=${hashtags}`;
    window.open(url);
  }

  function shareOnFacebook() {
    const text = shareTemplate();
    window.open(
      `https://www.facebook.com/dialog/share?app_id=145634995501895&display=popup&href=https%3A%2F%2FLearnova.com%2Fdocs%2F&redirect_uri=https%3A%2F%2FLearnova.com%2Ftools%2Fexplorer&hashtag=${text}`
    );
  }

  function shareOnLinkedIn() {
    const text = shareTemplate();
    const url = `http://www.linkedin.com/shareArticle?summary=${text}&text=${text}`;
    window.open(url);
  }

  onDestroy(() => {
    unsubscribe();
  });
</script>

<svelte:head>
  <title>Random Name Picker | Learnova</title>
  <meta
    property="og:image"
    itemprop="image"
    content="https://brand.cdn.clsrio.com/og/free-tools.png"
  />
  <meta property="og:title" content="Random Name Picker | Learnova" />
  <meta
    property="og:description"
    content="Use this online name picker to draw a random name from a list of names for your online or physical classroom."
  />

  <meta
    property="og:image:secure_url"
    itemprop="image"
    content="https://brand.cdn.clsrio.com/og/free-tools.png"
  />

  <meta name="twitter:title" content="Random Name Picker | Learnova" />
  <meta
    name="twitter:description"
    content="Use this online name picker to draw a random name from a list of names for your online or physical classroom."
  />
  <meta name="twitter:image" content="https://brand.cdn.clsrio.com/og/free-tools.png" />
</svelte:head>

<section class="mt-[10%] md:mt-16 px-1 md:px-0 w-full md:w-full">
  <ToolsHeader>
    <img
      src="/free-tools/progress-report.svg"
      class="w-[15%] md:w-[5%] mx-auto border rounded-full"
      alt=""
    />
    <h1 class="text-4xl md:text-6xl font-bold text-[#040F2D] my-3">Progress Report</h1>
    <p class="text-md text-[#656565] font-light md:font-normal md:w-[45%] mx-auto">
      Generate cool reports of your learning progress. Share reports with your network for
      collaborative learning
    </p>
  </ToolsHeader>

  <!-- modals -->
  <Avatar />
  <Mood />
  <Background />
  <FullView />

  <div
    class="border rounded-md w-full md:w-11/12 lg:w-[80%] my-10 mx-auto shadow-md flex md:flex-row flex-col justify-evenly"
  >
    <!-- left side -->
    {#if showSetter}
      <div
        transition:fly={{ y: 100, easing: sineInOut }}
        class="w-full mx-auto md:w-[48%] md:max-w-[500px] p-5 md:border-r"
      >
        <!-- preview button -->
        <div class="flex md:hidden justify-end mb-5">
          <button
            type="button"
            on:click={() => {
              showSetter = false;
              showReport = true;
            }}
            class="flex justify-between items-center gap-2 px-3 py-1 rounded-full text-white text-xs bg-[#0233BD]"
          >
            <img
              src="/free-tools/progress-report/preview-icon.svg"
              alt="preview icon"
              class="w-4"
            />
            Preview
          </button>
        </div>

        <!-- name input -->
        <div>
          <p class="text-sm text-[#656565]">Add your name</p>
          <input
            type="text"
            bind:value={$htmlBody.name}
            on:input={(event) => handleInputChange(event, 'name')}
            placeholder="Enter your name here"
            class="w-full border my-3 py-2 px-3 outline-none rounded-sm bg-[#F1F2F4] text-xs placeholder:text-sm placeholder:text-[#ADADAD]"
          />
        </div>

        <!-- mood input -->
        <div class="mt-3">
          <p class="text-sm text-[#656565]">Select your mood</p>
          <button
            type="button"
            on:click={() => ($openModal.mood = true)}
            class="w-full flex justify-between items-center border my-3 py-2 px-3 outline-none rounded-sm bg-[#F1F2F4] text-gray-400 text-sm"
          >
            {#if $htmlBody.mood.text}
              <div
                class="px-3 py-1 border border-[#EDEDED] text-white bg-blue-500 rounded-2xl font-semibold text-[7px] md:text-xs flex items-center justify-between"
              >
                {#if $htmlBody.mood.text}
                  <span class="flex gap-1 items-center">
                    <p class="font-semibold text-[9px] md:text-xs">is {$htmlBody.mood.text}</p>
                    <img
                      src="https://assets.cdn.clsrio.com/progress-report/emojis/{$htmlBody.mood
                        .iconSrc}.png"
                      alt={$htmlBody.mood.text}
                      class="w-3"
                    />
                  </span>
                {/if}
              </div>
            {:else}
              What feeling describes you?
              <img
                src="/free-tools/progress-report/smiley-face-icon.svg"
                alt="smiley face"
                class="w-3"
              />
            {/if}
          </button>
        </div>

        <!-- learning input -->
        <div class="mt-5">
          <p class="text-sm text-[#656565]">What are you learning?</p>
          <textarea
            bind:value={$htmlBody.learning}
            maxlength={MAX_CHARS}
            on:input={(event) => handleInputChange(event, 'learning')}
            placeholder="Tell us what you are learning"
            class="w-full h-[17vh] border my-3 py-2 px-3 outline-none rounded-sm bg-[#F1F2F4] text-sm placeholder:text-sm placeholder:text-[#ADADAD]"
          ></textarea>
          <p class="text-xs text-right text-[#656565]">{remainingChars} characters remaining</p>
        </div>

        <!-- range input -->
        <div class="mt-3">
          <p class="text-sm text-[#656565] pb-4">Estimate your progress</p>
          <div class="flex justify-between items-center">
            <input
              type="range"
              min="0"
              max="100"
              bind:value={$htmlBody.progress}
              class="range-input"
              on:input={(event) => handleInputChange(event, 'progress')}
              style="background: linear-gradient(to right, #0F62FE {$htmlBody.progress}%, #ccc {$htmlBody.progress}%);"
            />
            <p class="text-sm font-semibold">{$htmlBody.progress}%</p>
          </div>
        </div>

        <!-- avatar button -->
        <div class="flex flex-wrap justify-between items-center mt-3">
          <div class="w-full md:w-2/4">
            <p class="text-[12px] md:text-sm text-[#656565]">Choose your avatar</p>
            <button
              type="button"
              on:click={() => ($openModal.avatar = true)}
              class="bg-[#F7F7F7] w-full py-1.5 px-5 md:px-0 mt-3 flex md:w-[65%] items-center justify-between md:justify-center gap-2"
            >
              <img
                src={`https://assets.cdn.clsrio.com/progress-report/avatars/${
                  $htmlBody.avatar || 'avatar_m'
                }.svg`}
                alt=""
                class="w-[15%] md:w-[30%]"
              />
              <img
                src="/free-tools/progress-report/question-mark.svg"
                alt="A question mark"
                class="w-[15%] md:w-[30%]"
              />
            </button>
          </div>

          <!-- & background -->
          <div class="w-full md:w-2/4">
            <p class="text-[12px] md:text-sm text-[#656565]">Choose your background</p>
            <button
              type="button"
              on:click={() => ($openModal.background = true)}
              class="bg-[#F7F7F7] w-full py-1.5 px-5 md:px-0 mt-3 flex md:w-[65%] items-center justify-between md:justify-center gap-2"
            >
              <img
                src={`https://assets.cdn.clsrio.com/progress-report/backgrounds/${
                  $htmlBody.background || 'blue_tetiary_background'
                }.webp`}
                alt="An avatar"
                class="w-[15%] md:w-[30%]"
              />
              <img
                src="/free-tools/progress-report/question-mark.svg"
                alt="A question mark"
                class="w-[15%] md:w-[30%]"
              />
            </button>
          </div>
        </div>
        <DownloadButton {isDisabled} {isDownloading} />
      </div>
    {/if}

    <!-- right side -->

    <div
      transition:fly={{ y: 100, easing: sineInOut }}
      class="w-full mx-auto md:w-[48%] md:min-w-[400px] md:max-w-[500px] px-5 md:px-1 md:mt-0 mt-5 md:p-5"
    >
      <div class="hidden md:block">
        <Report />

        <!-- download & share button -->
        <div class="mt-9 pt-8 px-2 h-auto border-t">
          <DownloadButton {isDisabled} {isDownloading} text="Download Image" />

          <!-- share button -->
          <div class="w-full md:w-[70%] mx-auto my-5">
            <h1 class="text-sm font-semibold text-center">Share on image on social media:</h1>

            <div
              class="flex justify-evenly border rounded-xl gap-5 w-[60%] md:w-[80%] px-5 py-2 mt-2 mx-auto"
            >
              <button
                type="button"
                on:click={shareOnFacebook}
                class="w-10 hover:scale-[1.2] transition-all duration-300"
              >
                <LogoFacebook size={32} />
              </button>
              <button
                type="button"
                on:click={shareOnLinkedIn}
                class="w-10 hover:scale-[1.2] transition-all duration-300"
              >
                <LogoLinkedin size={32} />
              </button>
              <button
                type="button"
                on:click={shareOnTwitter}
                class="w-5 hover:scale-[1.2] transition-all duration-300"
              >
                <img src="/twitter_logo.png" alt="X.com" />
              </button>
            </div>
          </div>
        </div>
      </div>

      {#if showReport}
        <!-- hide button -->
        <div class="flex justify-end mb-5">
          <button
            type="button"
            on:click={() => {
              showReport = false;
              showSetter = true;
            }}
            class="flex justify-between items-center gap-2 px-3 py-1 rounded-full text-white text-xs bg-[#0233BD]"
          >
            <img src="/free-tools/progress-report/hide-icon.svg" alt="preview icon" class="w-4" />
            Close
          </button>
        </div>
        <Report />

        <!-- download & share button -->
        <div class="mt-9 pt-8 px-2 h-auto border-t">
          <DownloadButton {isDisabled} {isDownloading} />

          <!-- share button -->
          <div class="w-full md:w-[70%] mx-auto my-5">
            <h1 class="text-sm font-semibold text-center">Share on image on social media:</h1>

            <div
              class="flex justify-evenly border rounded-xl gap-5 w-[60%] md:w-[80%] px-5 py-2 mt-2 mx-auto"
            >
              <button
                type="button"
                on:click={shareOnFacebook}
                class="w-10 hover:scale-[1.2] transition-all duration-300"
              >
                <LogoFacebook size={32} />
              </button>
              <button
                type="button"
                on:click={shareOnLinkedIn}
                class="w-10 hover:scale-[1.2] transition-all duration-300"
              >
                <LogoLinkedin size={32} />
              </button>
              <button
                type="button"
                on:click={shareOnTwitter}
                class="w-5 hover:scale-[1.2] transition-all duration-300"
              >
                <img src="/twitter_logo.png" alt="X.com" />
              </button>
            </div>
          </div>
        </div>
      {/if}
    </div>
  </div>
</section>

<style>
  .range-input {
    -webkit-appearance: none;
    appearance: none;
    width: 80%;
    cursor: pointer;
    outline: none;
    border-radius: 15px;
    height: 1rem;
  }

  .range-input::-webkit-slider-thumb {
    -webkit-appearance: none;
    appearance: none;
    height: 1.5rem;
    width: 1.5rem;
    background-color: #0f62fe;
    border-radius: 50%;
    border: none;
    transition: 0.2s ease-in-out;
  }

  .range-input::-moz-range-thumb {
    height: 1rem;
    width: 1rem;
    background-color: yellow;
    border-radius: 50%;
    transition: 0.2s ease-in-out;
  }

  .range-input:active::-webkit-slider-thumb {
    border: 3px solid #fff;
    filter: drop-shadow(0px 1px 1px #000000);
  }

  .range-input:focus::-webkit-slider-thumb {
    border: 3px solid #fff;
    filter: drop-shadow(0px 1px 1px #000000);
  }

  .range-input::-moz-range-thumb:hover {
    border: 3px solid #fff;
    box-shadow: 0 0 0 10px rgba(255, 85, 0, 0.1);
  }

  .range-input:active::-moz-range-thumb {
    border: 3px solid #fff;
    filter: drop-shadow(0px 1px 1px #000000);
  }

  .range-input:focus::-moz-range-thumb {
    border: 3px solid #fff;
    filter: drop-shadow(0px 1px 1px #000000);
  }
</style>
