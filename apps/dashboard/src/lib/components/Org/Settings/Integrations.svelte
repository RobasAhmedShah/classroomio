<script lang="ts">
  import { Grid, Column, Row } from 'carbon-components-svelte';
  import CheckmarkFilled from 'carbon-icons-svelte/lib/CheckmarkFilled.svelte';
  import { supabase } from '$lib/utils/functions/supabase';
  import { profile } from '$lib/utils/store/user';
  import { snackbar } from '$lib/components/Snackbar/store';
  import TextField from '$lib/components/Form/TextField.svelte';
  import PrimaryButton from '$lib/components/PrimaryButton/index.svelte';
  import { VARIANTS } from '$lib/components/PrimaryButton/constants';
  import SectionTitle from '../SectionTitle.svelte';
  import ArrowUpRightIcon from '$lib/components/Icons/ArrowTopRight.svelte';
  import { t } from '$lib/utils/functions/translations';

  let chatId: number | null;

  async function addChatId() {
    if (!chatId || `${chatId}`.length < 5) return;

    const { error } = await supabase
      .from('profile')
      .update({
        telegram_chat_id: chatId
      })
      .match({ id: $profile.id });

    if (error) {
      console.log(error);
      snackbar.error('snackbar.course_settings.error.failed_integration');
    } else {
      $profile.telegram_chat_id = chatId;
      chatId = null;
      snackbar.success('snackbar.course_settings.success.successful_integration');
    }
  }

  async function deleteChatId() {
    const { error } = await supabase
      .from('profile')
      .update({ telegram_chat_id: null })
      .match({ id: $profile.id });

    if (error) {
      snackbar.error('snackbar.course_settings.error.failed_deletion');
      console.log(error);
    } else {
      $profile.telegram_chat_id = null;
      snackbar.success('snackbar.course_settings.success.successful_deletion');
    }
  }
</script>

<Grid class="border-c rounded border-gray-200 dark:border-neutral-600 w-full mt-5">
  <Row class="flex lg:flex-row flex-col justify-center lg:justify-start py-7 border-bottom-c">
    <Column sm={4} md={4} lg={4} class="flex items-center justify-center">
      <img src="/telegram-svg.svg" alt="" class="w-10 mr-2" />
      <SectionTitle>{$t('settings.integrations.heading')}</SectionTitle></Column
    >

    <Column sm={8} md={8} lg={8} class="mt-2 lg:mt-0 flex flex-col items-center lg:items-start">
      {#if $profile.telegram_chat_id !== null}
        <div class="flex flex-col items-center w-full">
          <div class="flex items-center">
            <CheckmarkFilled size={32} class="mr-2" style="fill: green;" />
            <SectionTitle>{$t('settings.integrations.success_message')}</SectionTitle>
          </div>
          <PrimaryButton className="mt-3" variant={VARIANTS.CONTAINED_DANGER} onClick={deleteChatId}
            >{$t('settings.integrations.disconnect')}</PrimaryButton
          >
        </div>
      {:else}
        <div>
          <h3 class="font-normal text-lg">
            {$t('settings.integrations.sub_heading')}
          </h3>
          <h4 class="font-normal">{$t('settings.integrations.step_authenticate')}</h4>
          <PrimaryButton
            className="mb-5"
            variant={VARIANTS.OUTLINED}
            onClick={() => window.open('https://t.me/Learnova_bot', '_blank')}
            ><span class="mr-2">{$t('settings.integrations.open_bot_button')}</span>
            <ArrowUpRightIcon /></PrimaryButton
          >
          <h4 class="font-normal">{$t('settings.integrations.step_chatId')}</h4>
          <TextField
            bind:value={chatId}
            placeholder="360111"
            className="w-full lg:w-60 mb-5"
            type="number"
            isRequired
          />
          <PrimaryButton onClick={addChatId}
            >{$t('settings.integrations.connect_button')}</PrimaryButton
          >
        </div>
      {/if}
    </Column>
  </Row>
</Grid>
