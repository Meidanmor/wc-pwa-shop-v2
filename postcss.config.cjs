// We need to extract the 'purgecss' property from the required object
const { purgeCSSPlugin } = require('@fullhuman/postcss-purgecss');
module.exports = {
  plugins: [
    require('autoprefixer')({
      overrideBrowserslist: [
        'last 4 Chrome versions',
        'last 4 Firefox versions',
        'last 4 Edge versions',
        'last 4 Safari versions',
        'last 4 Android versions',
        'last 4 ChromeAndroid versions',
        'last 4 FirefoxAndroid versions',
        'last 4 iOS versions'
      ]
    }),

    // Now we call the extracted function
    purgeCSSPlugin({
      content: [
        './src/**/*.vue',
        './src/**/*.js',
        './index.html',
        './.quasar/**/*.js' // Important for SSR!
      ],
safelist: {
  standard: [
    'html', 'body',
    /q-app/, /q-layout/, /q-page/, /q-header/, /q-footer/,
    /q-body--/,        // Vital for drawer-open overflow handling
    /q-layout--/,      // Vital for header/drawer positioning

    // --- Drawer Fixes ---
    /q-drawer/,        // Re-added: Covers q-drawer, q-drawer--left, etc.
    'q-page-container', // Ensures page content shifts correctly

    // --- Header & Shadow Fixes ---
    'q-header--hidden',
    'q-layout__shadow',
    'absolute-full',
    'no-pointer-events',
    'overflow-hidden',

    // --- Positioning & Stacking ---
    'fixed-top', 'fixed-bottom', 'absolute-top', 'sticky', 'fixed', 'absolute',
    'z-top', 'z-max',

    // --- Utility Fixes ---
    'fit', 'scroll', 'no-scroll', 'hide-scrollbar',
    'row', 'column', 'flex', 'items-center', 'justify-center', 'no-wrap',
    /q-item/,           // Protects q-item, q-item-section, q-item-label
    /q-list/,
    /q-separator/,      // If you use lines between menu items
    'q-router-link--active', // Highlights the current page in the menu
    'q-link',           // Base link styles

      // ----- Carousel styles -----
      /^q-carousel/,      // Keeps all carousel structural classes
      /^q-transition/,    // Keeps all transition/animation classes
  ],
  deep: [
    /q-btn/, /q-icon/, /q-ripple/, /q-scrollarea/, /q-layout__shadow/, /q-drawer/, /q-list/, /q-carousel/
  ],
  greedy: [/q-transition/]
},
      defaultExtractor: content => content.match(/[\w-/:]+(?<!:)/g) || []
    })
  ]
}