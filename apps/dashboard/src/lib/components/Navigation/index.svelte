<script>
  import { goto } from '$app/navigation';
  import { page } from '$app/stores';
  import { user } from '$lib/utils/store/user';
  import { isCoursePage } from '$lib/utils/functions/app';
  import PrimaryButton from '$lib/components/PrimaryButton/index.svelte';
  import { VARIANTS } from '$lib/components/PrimaryButton/constants';
  import { t } from '$lib/utils/functions/translations';

  export let disableSignup = false;
  export let logo;
  export let orgName;
  export let isOrgSite = false;
  export let backgroundColor = 'bg-white dark:bg-black';

  let navClass = '';

  const redirect = isCoursePage($page.url.pathname) ? `?redirect=${$page.url.pathname}` : '';

  $: navClass = '';
</script>

<nav
  class="{navClass} {backgroundColor} sticky top-0 z-50 flex w-full px-2 py-1 border-t-0 border-r-0 border-b border-l-0 border-gray-300"
>
  <ul class="flex w-full items-center">
    <div class="logo">
      <a
        href="/"
        title={`${$t('navigation.goto')} ${orgName || 'Learnova'} ${$t('navigation.home')}`}
        id="logo"
        data-hveid="8"
      >
        <img
          src={logo || '/logo-192.png'}
          alt={`${orgName || 'Learnova'} logo`}
          class="rounded w-9 inline-block mx-auto"
          data-atf="1"
        />
      </a>
    </div>

    {#if $user.isLoggedIn}
      <li class="hidden">
        <a class="block" href="dashboard"> {$t('navigation.dashboard')} </a>
      </li>

      <li class="hidden">
        <a class="block" href="courses"> {$t('navigation.courses')} </a>
      </li>

      <li class="hidden">
        <a class="block" href="discussions"> {$t('navigation.discussion')} </a>
      </li>

      <li class="hidden">
        <a class="block" href="people">{$t('navigation.people')} </a>
      </li>
    {/if}

    <span class="flex-grow" />

    {#if $user.isLoggedIn}
      {#if isOrgSite}
        <li><a class="block" href="/lms"> {$t('navigation.goto_lms')} </a></li>
      {/if}
    {:else if !$page.url.pathname?.includes('/404')}
      <li>
        <div class="flex">
          <PrimaryButton
            label={$t('navigation.login')}
            variant={VARIANTS.TEXT}
            onClick={() => goto('/login' + redirect)}
          />
        </div>
      </li>
      <li>
        {#if !disableSignup}
          <div class="flex">
            <PrimaryButton
              label={$t('navigation.signup')}
              variant={VARIANTS.CONTAINED}
              onClick={() => goto('/signup' + redirect)}
            />
          </div>
        {/if}
      </li>
    {/if}
    <!-- <li class="hidden">
      <a
        class="flex items-center"
        href="https://t.me/Learnova"
        target="_blank"
      >
        <img
          alt="File:Telegram logo.svg"
          class="mr-1"
          src="https://upload.wikimedia.org/wikipedia/commons/thumb/d/dd/Telegram_alternative_logo.svg/50px-Telegram_alternative_logo.svg.png"
          decoding="async"
          width="25"
          height="25"
          srcset="https://upload.wikimedia.org/wikipedia/commons/thumb/d/dd/Telegram_alternative_logo.svg/50px-Telegram_alternative_logo.svg.png 1.5x, https://upload.wikimedia.org/wikipedia/commons/thumb/8/82/Telegram_logo.svg/1024px-Telegram_logo.svg.png 2x"
          data-file-width="25"
          data-file-height="25"
        />
        <span><SendAlt32 class="carbon-icon dark:text-white" /> Канал</span>
        <SendAlt32 class="carbon-icon dark:text-white" />
        <span>Канал</span>
      </a>
    </li> -->
    <!-- <li class="new-question">
      <NewQuestion />
    </li> -->
  </ul>
</nav>

<style>
  ul {
    margin: 0 auto;
    padding: 0;
  }

  /* clearfix */
  ul::after {
    content: '';
    display: block;
    clear: both;
  }

  /* li.new-question {
    margin-top: 10px;
  } */

  a {
    text-decoration: none;
    color: var(--main-primary-color);
    padding: 0 1.5em;
    font-weight: 700;
    display: flex;
    align-items: center;
    flex-direction: column;
  }

  @media only screen and (max-width: 1002px) {
    nav.hide {
      display: none;
    }
    ul {
      align-items: center;
    }

    a {
      padding: 0 0.5em;
    }
  }
</style>
