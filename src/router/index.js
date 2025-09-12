import { defineRouter } from '#q-app/wrappers'
import { createRouter, createMemoryHistory, createWebHistory, createWebHashHistory } from 'vue-router'
import routes from './routes'

/*
 * If not building with SSR mode, you can
 * directly export the Router instantiation;
 *
 * The function below can be async too; either use
 * async/await or return a Promise which resolves
 * with the Router instance.
 */

export default defineRouter(function (/* { store, ssrContext } */) {
  const createHistory = process.env.SERVER
      ? createMemoryHistory
      : (process.env.VUE_ROUTER_MODE === 'history' ? createWebHistory : createWebHashHistory)

  const Router = createRouter({
    scrollBehavior(to, from, savedPosition) {
      if (savedPosition) {
        // e.g. when using browser back/forward
        return savedPosition
      }
      // keep scroll on initial load (don’t reset to top)
      if (from === undefined) {
        return {}
      }
      // default: scroll to top on route changes
      return {left: 0, top: 0}
    },
    routes,
    history: createHistory(process.env.VUE_ROUTER_BASE)
  })

  return Router
})
