<script lang="ts">
  import { onMount } from 'svelte';
  import { ProgressBar } from 'carbon-components-svelte';
  import { supabase } from '$lib/utils/functions/supabase';
  import { lesson } from '../../store/lessons';
  import { t } from '$lib/utils/functions/translations';
  import { snackbar } from '$lib/components/Snackbar/store';

  export let lessonId = '';

  let fileInput: HTMLInputElement;
  let isUploading = false;
  let progress = 0;
  let fileSize = 0;
  let uploadedFileUrl = '';

  async function onFileSelected(e: Event) {
    const file = (e.target as HTMLInputElement).files?.[0];
    if (!file) return;

    // Check file size (max 50MB)
    const maxSize = 50 * 1024 * 1024; // 50MB in bytes
    if (file.size > maxSize) {
      snackbar.error('course.navItem.lessons.materials.tabs.slide.file_too_large');
      return;
    }

    // Check file type
    const allowedTypes = ['application/pdf', 'application/vnd.ms-powerpoint', 'application/vnd.openxmlformats-officedocument.presentationml.presentation'];
    if (!allowedTypes.includes(file.type)) {
      snackbar.error('course.navItem.lessons.materials.tabs.slide.invalid_file_type');
      return;
    }

    isUploading = true;
    fileSize = file.size / (1024 * 1024); // Convert to MB

    try {
      const filename = `slides/${lessonId}/${Date.now()}_${file.name}`;
      const { data, error } = await supabase.storage.from('course-materials').upload(filename, file, {
        cacheControl: '3600',
        upsert: false
      });

      if (error) throw error;

      if (data) {
        const { data: response } = await supabase.storage.from('course-materials').getPublicUrl(filename);
        uploadedFileUrl = response.publicUrl;
        $lesson.materials.slide_url = uploadedFileUrl;
        snackbar.success('course.navItem.lessons.materials.tabs.slide.upload_success');
      }
    } catch (error) {
      console.error('Error uploading slide:', error);
      snackbar.error('course.navItem.lessons.materials.tabs.slide.upload_error');
    } finally {
      isUploading = false;
      progress = 0;
    }
  }

  function handleUpload() {
    fileInput?.click();
  }
</script>

<div class="w-full">
  <input
    type="file"
    style="display: none;"
    bind:this={fileInput}
    on:change={onFileSelected}
    accept=".pdf,.ppt,.pptx"
    disabled={isUploading}
  />

  {#if isUploading}
    <div class="flex flex-col gap-5 max-w-[500px] w-[60%] justify-center">
      <p class="mt-5 text-center">
        {$t('course.navItem.lessons.materials.tabs.slide.uploading')}
      </p>
      <ProgressBar value={progress} max={100} status="active" />
      <p class="text-sm">{progress}% of {fileSize.toFixed(2)}MB</p>
    </div>
  {:else}
    <button
      type="button"
      on:click={handleUpload}
      class="h-full w-full hover:cursor-pointer"
    >
      <div class="border-primary-300 flex h-full w-full flex-col items-center justify-center rounded-xl border border-dashed p-8">
        <img src="/upload-slide.svg" alt="upload" class="w-16 h-16 mb-4" />
        <span class="pt-3">
          <h3 class="text-center text-xl font-normal dark:text-white">
            {$t('course.navItem.lessons.materials.tabs.slide.upload_slide')}
          </h3>
          <p class="text-center text-sm font-normal">
            {$t('course.navItem.lessons.materials.tabs.slide.select_file')}
          </p>
          <p class="text-center text-sm text-gray-500">
            {$t('course.navItem.lessons.materials.tabs.slide.file_size')}
          </p>
        </span>
      </div>
    </button>
  {/if}
</div> 