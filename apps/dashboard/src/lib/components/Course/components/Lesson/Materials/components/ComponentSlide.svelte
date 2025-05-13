<script lang="ts">
  import { lesson } from '../../store/lessons';
  import { t } from '$lib/utils/functions/translations';

  let urls: string[] = [];

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

  $: urls = getUrls($lesson.materials.slide_url);
</script>

{#if urls.length > 0}
  {#each urls as url}
    {#if url.endsWith('.pdf') || url.endsWith('.ppt') || url.endsWith('.pptx')}
      <div class="flex items-center justify-between p-2 bg-gray-50 dark:bg-gray-800 rounded mb-2">
        <span class="text-sm truncate">{url.split('/').pop()}</span>
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
      <iframe
        title="Embeded Slides"
        src={url}
        frameborder="0"
        width="100%"
        height="569"
        class="iframe my-3"
        allowfullscreen="true"
        mozallowfullscreen="true"
        webkitallowfullscreen="true"
      />
    {/if}
  {/each}
{/if}
