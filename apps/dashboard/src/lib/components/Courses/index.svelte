<script lang="ts">
  import Box from '../Box/index.svelte';
  import Card from './components/Card/index.svelte';
  import List from './components/List/index.svelte';
  import CardLoader from './components/Card/Loader.svelte';
  import CoursesEmptyIcon from '../Icons/CoursesEmptyIcon.svelte';
  import { courseMetaDeta } from './store';
  import type { Course } from '$lib/utils/types';
  import { globalStore } from '$lib/utils/store/app';
  import {
    StructuredList,
    StructuredListHead,
    StructuredListRow,
    StructuredListCell,
    StructuredListBody
  } from 'carbon-components-svelte';
  import { t } from '$lib/utils/functions/translations';

  export let courses: Course[] = [];
  export let emptyTitle = $t('courses.course_card.empty_title');
  export let emptyDescription = $t('courses.course_card.empty_description');
  export let isExplore = false;

  function calcProgressRate(progressRate?: number, totalLessons?: number): number {
    if (!progressRate || !totalLessons) {
      return 0;
    }

    return Math.round((progressRate / totalLessons) * 100);
  }
</script>

<!-- <CopyCourseModal /> -->

<div class="mx-auto my-4 w-full">
  {#if $courseMetaDeta.isLoading}
    <section class={`${$courseMetaDeta.isLoading || courses ? 'cards-container' : ''} `}>
      <CardLoader />
      <CardLoader />
      <CardLoader />
    </section>
  {:else if $courseMetaDeta.view === 'list'}
    <StructuredList selection class="w-full">
      <StructuredListHead>
        <StructuredListRow head>
          <StructuredListCell head>
            {$t('courses.course_card.list_view.title')}
          </StructuredListCell>
          <StructuredListCell head>
            {$t('courses.course_card.list_view.description')}
          </StructuredListCell>
          <StructuredListCell head>
            {$t('courses.course_card.list_view.type')}
          </StructuredListCell>
          <StructuredListCell head>
            {$t('courses.course_card.list_view.lessons')}
          </StructuredListCell>
          <StructuredListCell head>
            {$t('courses.course_card.list_view.students')}
          </StructuredListCell>
          <StructuredListCell head>
            {$t('courses.course_card.list_view.published')}
          </StructuredListCell>
          <StructuredListCell head>{''}</StructuredListCell>
        </StructuredListRow>
      </StructuredListHead>
      <StructuredListBody>
        {#each courses as courseData}
          <List
            id={courseData.id}
            title={courseData.title}
            type={$t(`course.navItem.settings.${courseData.type.toLowerCase()}`)}
            description={courseData.description}
            isPublished={courseData.is_published}
            totalLessons={courseData.total_lessons}
            totalStudents={courseData.total_students}
          />
        {/each}
      </StructuredListBody>
    </StructuredList>
  {:else}
    <section class={`relative ${$courseMetaDeta.isLoading || courses ? 'cards-container' : ''} `}>
      {#each courses as courseData}
        {#key courseData.id}
          <Card
            id={courseData.id}
            slug={courseData.slug}
            bannerImage={courseData.logo || '/images/Learnova-course-img-template.jpg'}
            title={courseData.title}
            description={courseData.description}
            isPublished={courseData.is_published}
            type={courseData.type}
            currency={courseData.currency}
            totalLessons={courseData.total_lessons}
            totalStudents={courseData.total_students}
            isLMS={$globalStore.isOrgSite}
            {isExplore}
            progressRate={calcProgressRate(courseData.progress_rate, courseData.total_lessons)}
          />
        {/key}
      {/each}
    </section>
  {/if}
</div>
{#if !$courseMetaDeta.isLoading && !courses.length}
  <Box className="w-full">
    <CoursesEmptyIcon />
    <h3 class="my-5 text-2xl dark:text-white">{emptyTitle}</h3>
    <p class="w-1/3 text-center dark:text-white">
      {emptyDescription}
    </p>
  </Box>
{/if}
