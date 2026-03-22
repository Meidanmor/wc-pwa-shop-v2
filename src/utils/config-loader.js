export async function loadPageConfig(page, isPreview) {
  const url = isPreview
    ? `https://pwav.meidanm.com/wp-json/shop-builder/v1/preview/${page}`
    : `/config/${page}.json`;

  const res = await fetch(url).catch(() => null);
  return res && res.ok ? res.json() : null;
}