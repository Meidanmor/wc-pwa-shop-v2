// src/composables/use-app-meta.js
import { useMeta } from 'quasar';
import { computed, ref, watch, unref } from 'vue';
import { useRoute } from 'vue-router';
import { onServerPrefetch, onMounted } from 'vue';

export function useAppMeta(pageSpecificMeta = {}) {
  const route = useRoute();
  // --- Data Fetching Logic ---
  const fetchedData = ref(null);
  const isLoading = ref(false);
  const error = ref(null);


  const fetchData = async () => {
    const itemId = route.fullPath;
    if (!itemId) {
      fetchedData.value = null;
      console.log('[useAppMeta] No item ID found, skipping fetch.'); // Add this
      return;
    }

    const apiUrl = `https://nuxt.meidanm.com/wp-json/custom/v1/seo?path=${itemId}`; // <<< ENSURE THIS IS ABSOLUTE
    console.log(`[useAppMeta] Attempting to fetch from: ${apiUrl}`); // Log the exact URL

    isLoading.value = true;
    error.value = null;

    try {
      const response = await fetch(apiUrl);
      console.log(`[useAppMeta] Fetch response status: ${response.status}`);

      if (!response.ok) {
        // Try to get more info from the response body if fetch failed
        const errorBody = await response.text();
        console.error(`[useAppMeta] HTTP error! Status: ${response.status}, Body: ${errorBody.substring(0, 500)}`); // Log partial body
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      fetchedData.value = await response.json();
      console.log('[useAppMeta] Successfully fetched data.'); // Confirm success
    } catch (err) {
      console.error('[useAppMeta] Error during fetch or JSON parsing:', err.message || err); // Log the error message
      error.value = err;
      fetchedData.value = null;
    } finally {
      isLoading.value = false;
    }
  };

  // --- SSR and Client-side Data Fetching ---

  // onServerPrefetch is called on the server during SSR.
  onServerPrefetch(async () => {
    if (!fetchedData.value) { // Only fetch if data hasn't been fetched
      await fetchData();
    }
  });

  // onMounted is called only on the client-side.
  onMounted(async () => {
    if (!fetchedData.value) { // Check if data was not already pre-fetched by SSR
      await fetchData();
    }
  });

  // Watch for changes in route parameters to re-fetch data
  watch(
    () => route.params.id, // Watch a specific route param (e.g., 'id')
    async (newId, oldId) => {
      if (newId && newId !== oldId) {
        await fetchData();
      } else if (!newId) {
        fetchedData.value = null; // Clear data if param is gone (e.g., navigating to a non-detail page)
      }
    },
    { immediate: true } // Fetch data immediately when the component is mounted
  );

  // --- Meta Tag Generation Logic ---
  const defaultTitleTemplate = title => `${unref(title) || 'Untitled Page'} - My Awesome Quasar App`;

  const globalMeta = {
    meta: {
      description: { name: 'description', content: 'A Quasar Framework App.' },
      keywords: { name: 'keywords', content: 'quasar, vue, frontend, app' },
      'og:type': { property: 'og:type', content: 'website' },
      'og:site_name': { property: 'og:site_name', content: 'My Awesome Quasar App' },
      // Add other common meta tags
    },
    titleTemplate: defaultTitleTemplate,
  };

  const finalMeta = computed(() => {
    const pageMetaUnref = unref(pageSpecificMeta); // Unref pageSpecificMeta early

    // Default title from page, or fetched data, or fallback
    let title = pageMetaUnref.title || (fetchedData.value && fetchedData.value.title) || 'Untitled Page';
    if (typeof title === 'function') {
      title = title(fetchedData.value); // Allow dynamic title based on fetched data
    } else {
      title = unref(title); // Ensure title is unrefed if passed as a ref
    }

    // Default description from page, or fetched data, or fallback
    let descriptionContent = pageMetaUnref.meta?.description?.content || (fetchedData.value && fetchedData.value.description) || globalMeta.meta.description.content;
    if (typeof descriptionContent === 'function') {
      descriptionContent = descriptionContent(fetchedData.value);
    } else {
      descriptionContent = unref(descriptionContent);
    }

    // Merge meta tags, prioritizing page-specific, then fetched data, then global defaults
    const mergedMeta = {
      ...globalMeta.meta,
      ...pageMetaUnref.meta, // Page-specific overrides global
      // Overwrite/add based on fetchedData
      ...(fetchedData.value ? {
        description: { name: 'description', content: descriptionContent },
        'og:title': { property: 'og:title', content: title },
        'og:description': { property: 'og:description', content: descriptionContent },
        'og:image': { property: 'og:image', content: fetchedData.value.imageUrl || 'https://example.com/default-image.jpg' },
        // Add other dynamic meta tags based on fetchedData
      } : {}),
    };

    const titleTemplate = pageMetaUnref.titleTemplate || defaultTitleTemplate;

    return {
      title,
      titleTemplate,
      meta: mergedMeta,
    };
  });

  useMeta(finalMeta);

  // Return data, loading, and error states for the component to use
  return {
    fetchedData,
    isLoading,
    error,
  };
}