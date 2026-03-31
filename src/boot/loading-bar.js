import { LoadingBar } from 'quasar'

export default ({ router }) => {
  LoadingBar.setDefaults({
    color: 'black',
    size: '5px',
    position: 'top'
  })

  router.beforeEach(() => {
      LoadingBar.start()
  })

  router.afterEach(() => {
    LoadingBar.stop()
  })
}