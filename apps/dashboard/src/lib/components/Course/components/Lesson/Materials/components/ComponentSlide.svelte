<script lang="ts">
  import { lesson } from '../../store/lessons';
  import { t } from '$lib/utils/functions/translations';

  export let isStudent = false;

  let urls: string[] = [];
  let uploadedFiles: { name: string; url: string }[] = [];

  function canvaHandler(_url): string {
    if (_url.includes('?embed')) return _url;
    return `${_url}?embed`;
  }

  function getUrls(_url: string | null): string[] {
    if (!_url) return [];

    // Split by comma to handle multiple URLs
    const urlArray = _url.split(',').map(url => url.trim());
    
    return urlArray.map(url => {
      if (url.includes('www.canva.com')) {
        return canvaHandler(url);
      }
      return url;
    });
  }

  $: {
    urls = getUrls($lesson.materials.slide_url);
    uploadedFiles = urls.map(url => ({
      name: url.split('/').pop() || '',
      url: url
    }));
  }
</script>

{#if urls.length > 0}
  <div class="space-y-4">
    {#each urls as url, index}
      {#if url.endsWith('.pdf') || url.endsWith('.ppt') || url.endsWith('.pptx')}
        <div class="flex items-center justify-between p-2 bg-gray-50 dark:bg-gray-800 rounded">
          <span class="text-sm truncate">{uploadedFiles[index].name}</span>
          <a 
            href={url} 
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
      {:else if url.includes('canva.com') || url.includes('docs.google.com')}
        <div class="mb-4">
          <iframe
            title="Embeded Slides"
            src={url}
            frameborder="0"
            width="100%"
            height="569"
            class="iframe"
            allowfullscreen="true"
            mozallowfullscreen="true"
            webkitallowfullscreen="true"
          />
        </div>
      {/if}
    {/each}
  </div>
{:else}
  <div class="flex flex-col items-center justify-center p-8 text-center">
    <p class="text-gray-500 dark:text-gray-400">
      {$t('course.navItem.lessons.materials.body_heading')}
    </p>
    <p class="text-sm text-gray-400 dark:text-gray-500 mt-2">
      {$t('course.navItem.lessons.materials.body_content')}
    </p>
  </div>
{/if}
