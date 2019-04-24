import browserSync from 'browser-sync'
const bro = browserSync.create()
export const reloadBro = bro.reload
export const streamBro = bro.stream
export function runBro () {
  bro.init({
    proxy: 'smartjex.me',
    open: false,
    port: 1337
  })
}