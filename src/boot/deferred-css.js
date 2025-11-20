// src/boot/deferred-css.js
export default async () => {
  if (process.env.CLIENT) {
    const link = document.createElement('link')
    link.rel = 'stylesheet'
    link.href = '/assets/deferred.css'  // make sure this path exists in /dist/assets/
    link.media = 'print'
    link.onload = () => (link.media = 'all')
    document.head.appendChild(link)
  }
}