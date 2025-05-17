<script lang="ts">
  import { onMount } from 'svelte';
  import { ProgressBar } from 'carbon-components-svelte';
  import { supabase } from '$lib/utils/functions/supabase';
  import { lesson, handleUpdateLessonMaterials } from '../../store/lessons';
  import { t } from '$lib/utils/functions/translations';
  import { snackbar } from '$lib/components/Snackbar/store';

  export let lessonId = '';

  let fileInput: HTMLInputElement;
  let isUploading = false;
  let progress = 0;
  let fileSize = 0;
  let uploadedFiles: { name: string; url: string }[] = [];

  // Load existing slides on mount
  onMount(async () => {
    if ($lesson.materials.slide_url) {
      const existingUrls = $lesson.materials.slide_url.split(',').map(url => url.trim());
      uploadedFiles = existingUrls.map(url => ({
        name: url.split('/').pop() || '',
        url: url
      }));
    }
  });

  async function onFileSelected(e: Event) {
    const files = (e.target as HTMLInputElement).files;
    if (!files?.length) return;

    isUploading = true;

    for (const file of Array.from(files)) {
      // Check file size (max 50MB)
      const maxSize = 50 * 1024 * 1024; // 50MB in bytes
      if (file.size > maxSize) {
        snackbar.error('course.navItem.lessons.materials.tabs.slide.file_too_large');
        continue;
      }

      // Check file type
      const allowedTypes = ['application/pdf', 'application/vnd.ms-powerpoint', 'application/vnd.openxmlformats-officedocument.presentationml.presentation'];
      if (!allowedTypes.includes(file.type)) {
        snackbar.error('course.navItem.lessons.materials.tabs.slide.invalid_file_type');
        continue;
      }

      fileSize = file.size / (1024 * 1024); // Convert to MB

      try {
        const filename = `slides/${lessonId}/${Date.now()}_${file.name}`;
        const { data, error } = await supabase.storage.from('uploads').upload(filename, file, {
          cacheControl: '3600',
          upsert: false
        });

        if (error) throw error;

        if (data) {
          const { data: response } = await supabase.storage.from('uploads').getPublicUrl(filename);
          uploadedFiles = [...uploadedFiles, { name: file.name, url: response.publicUrl }];
          
          // Update the lesson materials with all slide URLs
          $lesson.materials.slide_url = uploadedFiles.map(f => f.url).join(',');
          
          // Update the lesson in the database
          const { error: updateError } = await handleUpdateLessonMaterials($lesson, lessonId);

          if (updateError) throw updateError;
          
          snackbar.success('course.navItem.lessons.materials.tabs.slide.upload_success');
        }
      } catch (error) {
        console.error('Error uploading slide:', error);
        snackbar.error('course.navItem.lessons.materials.tabs.slide.upload_error');
      }
    }

    isUploading = false;
    progress = 0;
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
    multiple
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

  {#if uploadedFiles.length > 0}
    <div class="mt-4 space-y-2">
      {#each uploadedFiles as file}
        <div class="flex items-center justify-between p-2 bg-gray-50 dark:bg-gray-800 rounded">
          <span class="text-sm truncate">{file.name}</span>
          <a 
            href={file.url} 
            target="_blank" 
            rel="noopener noreferrer"
            class="text-primary-600 hover:text-primary-700 flex items-center gap-2"
          >
            <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
              <path fill-rule="evenodd" d="M6 2a2 2 0 00-2 2v12a2 2 0 002 2h8a2 2 0 002-2V7.414A2 2 0 0015.414 6L12 2.586A2 2 0 0010.586 2H6zm5 6a1 1 0 10-2 0v3.586l-1.293-1.293a1 1 0 10-1.414 1.414l3 3a1 1 0 001.414 0l3-3a1 1 0 00-1.414-1.414L11 11.586V8z" clip-rule="evenodd" />
            </svg>
            {$t('course.navItem.lessons.materials.tabs.slide.download_slide')}
          </a>
        </div>
      {/each}
    </div>
  {/if}
</div> 