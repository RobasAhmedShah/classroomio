<script lang="ts">
  import { goto } from '$app/navigation';
  import VisitOrgSiteButton from '$lib/components/Buttons/VisitOrgSite.svelte';
  import { courseMetaDeta, courses } from '$lib/components/Courses/store';
  import Learning from '$lib/components/LMS/components/Learning.svelte';
  import { VARIANTS } from '$lib/components/PrimaryButton/constants';
  import PrimaryButton from '$lib/components/PrimaryButton/index.svelte';
  import { getGreeting } from '$lib/utils/functions/date';
  import { t } from '$lib/utils/functions/translations';
  import { fetchCourses } from '$lib/utils/services/courses';
  import { currentOrg } from '$lib/utils/store/org';
  import { profile } from '$lib/utils/store/user';
  import type { Course } from '$lib/utils/types';

  let hasFetched = false;
  let progressPercentage = 0;
  let totalLessons = 0;
  let totalCompleted = 0;

  async function getCourses(userId: string | undefined, orgId: string) {
    if (hasFetched || !userId || !orgId) {
      return;
    }
    // only show is loading when fetching for the first time
    if (!$courses.length) {
      $courseMetaDeta.isLoading = true;
    }

    const coursesResult = await fetchCourses(userId, orgId);
    console.log(`coursesResult`, coursesResult);

    $courseMetaDeta.isLoading = false;
    if (!coursesResult) return;

    courses.set(coursesResult.allCourses);
    hasFetched = true;
  }

  function calcTotalProgress(courses: Course[]) {
    totalCompleted = courses.reduce((acc, cur) => acc + (cur.progress_rate || 0), 0);
    totalLessons = courses.reduce((acc, cur) => acc + (cur.total_lessons || 0), 0);

    progressPercentage = Math.round((totalCompleted / totalLessons) * 100) || 0;
  }

  $: getCourses($profile.id, $currentOrg.id);
  $: calcTotalProgress($courses);
</script>

<svelte:head>
  <title>Student Dashboard - Learnova</title>
</svelte:head>

<section class="mx-auto max-w-6xl gap-5">
  <div class="m-5">
    <div class="mb-10 flex items-center justify-between">
      <h1 class="text-2xl font-bold dark:text-white md:text-3xl">
        {$t(getGreeting())}
        {$profile.fullname}!
      </h1>

      <VisitOrgSiteButton isLMS={true} />
    </div>

    <div
      class="bg-primary-900 my-2 flex h-fit w-full flex-col-reverse justify-between rounded-md p-5 md:flex-row md:items-center lg:h-[265px] lg:p-10"
    >
      <div class="w-full md:w-[75%] lg:w-[80%]">
        <p class=" mb-5 text-xs font-normal text-white lg:text-xl">
          {$currentOrg.customization.dashboard.bannerText
            ? $currentOrg.customization.dashboard.bannerText
            : $t('dashboard.lms_dashboard_hero')}
        </p>
        <PrimaryButton
          label={$t('dashboard.dont')}
          variant={VARIANTS.CONTAINED_WHITE}
          onClick={() => goto('/lms/mylearning')}
        />
      </div>
      <img
        src={$currentOrg.customization.dashboard.bannerImage
          ? $currentOrg.customization.dashboard.bannerImage
          : '/images/student-learning.svg'}
        alt="student Learning Pictogram"
        class="mb-3 w-28 md:mb-0 md:block md:w-1/3 lg:h-[205px] lg:w-[275px]"
      />
    </div>
    <section class="flex w-full flex-col md:gap-5 lg:flex-row">
      <div class="mt-10 w-full lg:w-[50%] xl:mt-2">
        <Learning />
      </div>
      <div class="mt-10 w-full lg:w-[50%] xl:mt-2">
        <p class="pb-3 text-base font-semibold text-[#040F2D] dark:text-white">
          {$t('dashboard.your_progress')}
        </p>
        <div
          class="flex h-fit items-center justify-center gap-2 rounded border border-[#EAEAEA] p-3 dark:bg-neutral-800 lg:h-[40vh] lg:overflow-y-auto"
        >
          <div
            class="flex h-full w-full flex-col items-center justify-between gap-5 sm:flex-row lg:items-center lg:justify-around xl:flex-col xl:items-start"
          >
            <div>
              <img src="/images/target.svg" alt="student Learning score" />
            </div>
            <span class="text-center xl:text-start">
              <p class="py-2 text-base font-semibold text-[#040F2D] dark:text-white">
                {$t('dashboard.your_progress')}
              </p>
              {#if totalLessons > 0}
                <p class="text-xs font-normal text-[#656565] dark:text-white">
                  {totalCompleted}/{totalLessons}
                  {$t('dashboard.lessons_completed')}
                </p>
              {:else}
                <p class="text-xs font-normal text-[#656565] dark:text-white">
                  {$t('dashboard.no_courses_started')}
                </p>
              {/if}
            </span>
            <h1
              class="my-0 whitespace-nowrap text-5xl font-bold text-[#262626] dark:text-white lg:text-6xl"
            >
              {progressPercentage} %
            </h1>
          </div>
        </div>
      </div>
    </section>
  </div>
</section>
