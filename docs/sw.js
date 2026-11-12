/**
 * 这个文件只有一个作用：把上一版装在域名根下的 service worker 卸掉。
 *
 * 背景：工作台原先部署在 https://zhoushichen0311-sys.github.io/ 根路径，
 * 它注册的 sw.js 作用域是整个域名，而且配了「任何导航都回退到 index.html」。
 * 结果是同域名下的 /shichen-zhou-portfolio/ 也被拦成了工作台首页。
 *
 * 现在工作台搬到 /workbench/ 下，新的 sw.js 作用域自然缩小到那个子路径，
 * 但浏览器里装的旧 SW 不会自己消失 —— 它必须被同路径的新文件顶替。
 *
 * 所以这个文件会覆盖掉 /sw.js。它没有 fetch 监听器（对请求完全透明），
 * 装好就立刻注销自己，然后刷新受它控制的标签页。
 */

self.addEventListener('install', () => {
  self.skipWaiting()
})

self.addEventListener('activate', (event) => {
  event.waitUntil(
    self.registration
      .unregister()
      .then(() => self.clients.matchAll({ type: 'window', includeUncontrolled: true }))
      .then((clients) => {
        for (const client of clients) {
          if ('navigate' in client) client.navigate(client.url)
        }
      }),
  )
})
