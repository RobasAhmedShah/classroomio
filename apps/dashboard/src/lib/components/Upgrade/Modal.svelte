<script lang="ts">
  import { goto } from '$app/navigation';
  import { page } from '$app/stores';
  import Confetti from '$lib/components/Confetti/index.svelte';
  import { toggleConfetti } from '$lib/components/Confetti/store';

  import StepDoneIcon from '$lib/components/Icons/StepDoneIcon.svelte';
  import Modal from '$lib/components/Modal/index.svelte';
  import { VARIANTS } from '$lib/components/PrimaryButton/constants';
  import PrimaryButton from '$lib/components/PrimaryButton/index.svelte';
  import { snackbar } from '$lib/components/Snackbar/store';
  import { t } from '$lib/utils/functions/translations';
  import { currentOrg, currentOrgPath, isFreePlan } from '$lib/utils/store/org';
  import { profile } from '$lib/utils/store/user';
  import { Loading } from 'carbon-components-svelte';
  import Checkmark from 'carbon-icons-svelte/lib/Checkmark.svelte';
  import PLANS from 'shared/src/plans/data.json';

  const disabledClass = 'bg-gray-300 text-gray-400 hover:cursor-not-allowed';

  const planNames = Object.keys(PLANS);

  let isLoadingPlan: string | null = null;
  let open = false;
  let upgraded = true;
  let isYearlyPlan = true;
  let isConfirming = true;

  async function handleClick(plan, planName: string) {
    if (plan.CTA.IS_DISABLED || !$profile.id) {
      return;
    }

    isLoadingPlan = planName;

    try {
      // Set the plan to the upgraded yearly version
      upgraded = true;
      isYearlyPlan = true;

      snackbar.success('Plan upgraded to yearly successfully!');
    } catch (error) {
      console.error('Error upgrading plan', error);

      snackbar.error('snackbar.upgrade.failed');
    }

    isLoadingPlan = null;
  }

  function onUpgrade() {
    upgraded = true;
    toggleConfetti();

    setTimeout(() => {
      toggleConfetti();
    }, 1000);
  }

  function onClose() {
    const path = upgraded ? $currentOrgPath : $page.url.pathname;
    goto(path);
  }

  function onLearnMore() {
    window.open('https://classroomio.com/blog/early-adopter', '_blank');
  }
  function toggleIsYearlyPlan() {
    isYearlyPlan = !isYearlyPlan;
  }

  $: {
    const query = new URLSearchParams($page.url.search);
    open = (query.get('upgrade') || '') === 'true';
    isConfirming = (query.get('confirmation') || '') === 'true';
  }

  $: handleUpgradeSuccess(Boolean($currentOrg.id && !$isFreePlan && open));
  function handleUpgradeSuccess(upgradeSuccessful: boolean) {
    if (upgradeSuccessful) {
      onUpgrade();
    }
  }
</script>
