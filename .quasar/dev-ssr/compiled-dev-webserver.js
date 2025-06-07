var __defProp = Object.defineProperty;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __esm = (fn, res) => function __init() {
  return fn && (res = (0, fn[__getOwnPropNames(fn)[0]])(fn = 0)), res;
};
var __export = (target, all) => {
  for (var name in all)
    __defProp(target, name, { get: all[name], enumerable: true });
};

// node_modules/@quasar/app-vite/exports/wrappers/wrappers.js
var wrapper, defineSsrMiddleware, defineSsrCreate, defineSsrListen, defineSsrClose, defineSsrServeStaticContent, defineSsrRenderPreloadTag;
var init_wrappers = __esm({
  "node_modules/@quasar/app-vite/exports/wrappers/wrappers.js"() {
    wrapper = (callback) => callback;
    defineSsrMiddleware = wrapper;
    defineSsrCreate = wrapper;
    defineSsrListen = wrapper;
    defineSsrClose = wrapper;
    defineSsrServeStaticContent = wrapper;
    defineSsrRenderPreloadTag = wrapper;
  }
});

// src-ssr/middlewares/render.js
var render_exports = {};
__export(render_exports, {
  default: () => render_default
});
var render_default;
var init_render = __esm({
  "src-ssr/middlewares/render.js"() {
    init_wrappers();
    render_default = defineSsrMiddleware(({ app, resolve, render, serve }) => {
      app.get(resolve.urlPath("*"), (req, res) => {
        res.setHeader("Content-Type", "text/html");
        res.setHeader(
          "Content-Security-Policy",
          "default-src *; script-src 'self' 'unsafe-inline'; style-src 'self' 'unsafe-inline';"
        );
        render(
          /* the ssrContext: */
          { req, res }
        ).then((html) => {
          res.send(html);
        }).catch((err) => {
          if (err.url) {
            if (err.code) {
              res.redirect(err.code, err.url);
            } else {
              res.redirect(err.url);
            }
          } else if (err.code === 404) {
            res.status(404).send("404 | Page Not Found");
          } else if (true) {
            serve.error({ err, req, res });
          } else {
            res.status(500).send("500 | Internal Server Error");
            if (true) {
              console.error(err.stack);
            }
          }
        });
      });
    });
  }
});

// src-ssr/server.js
init_wrappers();
import express from "express";
import compression from "compression";
import serverless from "serverless-http";
var create = defineSsrCreate(() => {
  const app = express();
  app.disable("x-powered-by");
  if (false) {
    app.use(compression());
  }
  return app;
});
var listen = defineSsrListen(({ app, devHttpsApp, port, ssrHandler }) => {
  if (true) {
    const server = devHttpsApp || app;
    return server.listen(port, () => {
      if (false) {
        console.log("Server listening at port " + port);
      }
    });
  } else {
    return {
      handler: serverless(ssrHandler)
    };
  }
});
var close = defineSsrClose(({ listenResult }) => {
  return listenResult.close();
});
var maxAge = true ? 0 : 1e3 * 60 * 60 * 24 * 30;
var serveStaticContent = defineSsrServeStaticContent(({ app, resolve }) => {
  return ({ urlPath = "/", pathToServe = ".", opts = {} }) => {
    const serveFn = express.static(resolve.public(pathToServe), { maxAge, ...opts });
    app.use(resolve.urlPath(urlPath), serveFn);
  };
});
var jsRE = /\.js$/;
var cssRE = /\.css$/;
var woffRE = /\.woff$/;
var woff2RE = /\.woff2$/;
var gifRE = /\.gif$/;
var jpgRE = /\.jpe?g$/;
var pngRE = /\.png$/;
var renderPreloadTag = defineSsrRenderPreloadTag((file) => {
  if (jsRE.test(file) === true) {
    return `<link rel="modulepreload" href="${file}" crossorigin>`;
  }
  if (cssRE.test(file) === true) {
    return `<link rel="stylesheet" href="${file}" crossorigin>`;
  }
  if (woffRE.test(file) === true) {
    return `<link rel="preload" href="${file}" as="font" type="font/woff" crossorigin>`;
  }
  if (woff2RE.test(file) === true) {
    return `<link rel="preload" href="${file}" as="font" type="font/woff2" crossorigin>`;
  }
  if (gifRE.test(file) === true) {
    return `<link rel="preload" href="${file}" as="image" type="image/gif" crossorigin>`;
  }
  if (jpgRE.test(file) === true) {
    return `<link rel="preload" href="${file}" as="image" type="image/jpeg" crossorigin>`;
  }
  if (pngRE.test(file) === true) {
    return `<link rel="preload" href="${file}" as="image" type="image/png" crossorigin>`;
  }
  return "";
});

// .quasar/dev-ssr/ssr-middlewares.js
function injectMiddlewares(opts) {
  return Promise.all([
    Promise.resolve().then(() => (init_render(), render_exports))
  ]).then(async (rawMiddlewares) => {
    const middlewares = rawMiddlewares.map((entry) => entry.default);
    for (let i = 0; i < middlewares.length; i++) {
      try {
        await middlewares[i](opts);
      } catch (err) {
        console.error("[Quasar SSR] middleware error:", err);
        return;
      }
    }
  });
}
export {
  close,
  create,
  injectMiddlewares,
  listen,
  serveStaticContent
};
//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAic291cmNlcyI6IFsiLi4vLi4vbm9kZV9tb2R1bGVzL0BxdWFzYXIvYXBwLXZpdGUvZXhwb3J0cy93cmFwcGVycy93cmFwcGVycy5qcyIsICIuLi8uLi9zcmMtc3NyL21pZGRsZXdhcmVzL3JlbmRlci5qcyIsICIuLi8uLi9zcmMtc3NyL3NlcnZlci5qcyIsICJzc3ItbWlkZGxld2FyZXMuanMiXSwKICAic291cmNlc0NvbnRlbnQiOiBbIi8vIEZ1bmN0aW9ucyBpbiB0aGlzIGZpbGUgYXJlIG5vLW9wLFxuLy8gIHRoZXkganVzdCB0YWtlIGEgY2FsbGJhY2sgZnVuY3Rpb24gYW5kIHJldHVybiBpdFxuLy8gVGhleSdyZSB1c2VkIHRvIGFwcGx5IHR5cGluZ3MgdG8gdGhlIGNhbGxiYWNrXG4vLyAgcGFyYW1ldGVycyBhbmQgcmV0dXJuIHZhbHVlIHdoZW4gdXNpbmcgUXVhc2FyIHdpdGggVHlwZVNjcmlwdFxuXG5jb25zdCB3cmFwcGVyID0gY2FsbGJhY2sgPT4gY2FsbGJhY2tcblxuZXhwb3J0IGNvbnN0IGRlZmluZUNvbmZpZyA9IHdyYXBwZXJcblxuZXhwb3J0IGNvbnN0IGRlZmluZUJvb3QgPSB3cmFwcGVyXG5leHBvcnQgY29uc3QgZGVmaW5lUHJlRmV0Y2ggPSB3cmFwcGVyXG5leHBvcnQgY29uc3QgZGVmaW5lUm91dGVyID0gd3JhcHBlclxuZXhwb3J0IGNvbnN0IGRlZmluZVN0b3JlID0gd3JhcHBlclxuXG5leHBvcnQgY29uc3QgZGVmaW5lU3NyTWlkZGxld2FyZSA9IHdyYXBwZXJcbmV4cG9ydCBjb25zdCBkZWZpbmVTc3JDcmVhdGUgPSB3cmFwcGVyXG5leHBvcnQgY29uc3QgZGVmaW5lU3NyTGlzdGVuID0gd3JhcHBlclxuZXhwb3J0IGNvbnN0IGRlZmluZVNzckNsb3NlID0gd3JhcHBlclxuZXhwb3J0IGNvbnN0IGRlZmluZVNzclNlcnZlU3RhdGljQ29udGVudCA9IHdyYXBwZXJcbmV4cG9ydCBjb25zdCBkZWZpbmVTc3JSZW5kZXJQcmVsb2FkVGFnID0gd3JhcHBlclxuIiwgImltcG9ydCB7IGRlZmluZVNzck1pZGRsZXdhcmUgfSBmcm9tICcjcS1hcHAvd3JhcHBlcnMnXG5cbi8vIFRoaXMgbWlkZGxld2FyZSBzaG91bGQgZXhlY3V0ZSBhcyBsYXN0IG9uZVxuLy8gc2luY2UgaXQgY2FwdHVyZXMgZXZlcnl0aGluZyBhbmQgdHJpZXMgdG9cbi8vIHJlbmRlciB0aGUgcGFnZSB3aXRoIFZ1ZVxuXG5leHBvcnQgZGVmYXVsdCBkZWZpbmVTc3JNaWRkbGV3YXJlKCh7IGFwcCwgcmVzb2x2ZSwgcmVuZGVyLCBzZXJ2ZSB9KSA9PiB7XG5cbiAgLy8gd2UgY2FwdHVyZSBhbnkgb3RoZXIgRXhwcmVzcyByb3V0ZSBhbmQgaGFuZCBpdFxuICAvLyBvdmVyIHRvIFZ1ZSBhbmQgVnVlIFJvdXRlciB0byByZW5kZXIgb3VyIHBhZ2VcbiAgYXBwLmdldChyZXNvbHZlLnVybFBhdGgoJyonKSwgKHJlcSwgcmVzKSA9PiB7XG4gICAgcmVzLnNldEhlYWRlcignQ29udGVudC1UeXBlJywgJ3RleHQvaHRtbCcpXG4gICAgcmVzLnNldEhlYWRlcihcbiAgICAgICAgJ0NvbnRlbnQtU2VjdXJpdHktUG9saWN5JyxcbiAgICAgICAgXCJkZWZhdWx0LXNyYyAqOyBzY3JpcHQtc3JjICdzZWxmJyAndW5zYWZlLWlubGluZSc7IHN0eWxlLXNyYyAnc2VsZicgJ3Vuc2FmZS1pbmxpbmUnO1wiXG4gICAgKVxuXG4gICAgcmVuZGVyKC8qIHRoZSBzc3JDb250ZXh0OiAqLyB7IHJlcSwgcmVzIH0pXG4gICAgICAudGhlbihodG1sID0+IHtcbiAgICAgICAgLy8gbm93IGxldCdzIHNlbmQgdGhlIHJlbmRlcmVkIGh0bWwgdG8gdGhlIGNsaWVudFxuICAgICAgICByZXMuc2VuZChodG1sKVxuICAgICAgfSlcbiAgICAgIC5jYXRjaChlcnIgPT4ge1xuICAgICAgICAvLyBvb3BzLCB3ZSBoYWQgYW4gZXJyb3Igd2hpbGUgcmVuZGVyaW5nIHRoZSBwYWdlXG5cbiAgICAgICAgLy8gd2Ugd2VyZSB0b2xkIHRvIHJlZGlyZWN0IHRvIGFub3RoZXIgVVJMXG4gICAgICAgIGlmIChlcnIudXJsKSB7XG4gICAgICAgICAgaWYgKGVyci5jb2RlKSB7XG4gICAgICAgICAgICByZXMucmVkaXJlY3QoZXJyLmNvZGUsIGVyci51cmwpXG4gICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIHJlcy5yZWRpcmVjdChlcnIudXJsKVxuICAgICAgICAgIH1cbiAgICAgICAgfSBlbHNlIGlmIChlcnIuY29kZSA9PT0gNDA0KSB7XG4gICAgICAgICAgLy8gaG1tLCBWdWUgUm91dGVyIGNvdWxkIG5vdCBmaW5kIHRoZSByZXF1ZXN0ZWQgcm91dGVcblxuICAgICAgICAgIC8vIFNob3VsZCByZWFjaCBoZXJlIG9ubHkgaWYgbm8gXCJjYXRjaC1hbGxcIiByb3V0ZVxuICAgICAgICAgIC8vIGlzIGRlZmluZWQgaW4gL3NyYy9yb3V0ZXNcbiAgICAgICAgICByZXMuc3RhdHVzKDQwNCkuc2VuZCgnNDA0IHwgUGFnZSBOb3QgRm91bmQnKVxuICAgICAgICB9IGVsc2UgaWYgKHByb2Nlc3MuZW52LkRFVikge1xuICAgICAgICAgIC8vIHdlbGwsIHdlIHRyZWF0IGFueSBvdGhlciBjb2RlIGFzIGVycm9yO1xuICAgICAgICAgIC8vIGlmIHdlJ3JlIGluIGRldiBtb2RlLCB0aGVuIHdlIGNhbiB1c2UgUXVhc2FyIENMSVxuICAgICAgICAgIC8vIHRvIGRpc3BsYXkgYSBuaWNlIGVycm9yIHBhZ2UgdGhhdCBjb250YWlucyB0aGUgc3RhY2tcbiAgICAgICAgICAvLyBhbmQgb3RoZXIgdXNlZnVsIGluZm9ybWF0aW9uXG5cbiAgICAgICAgICAvLyBzZXJ2ZS5lcnJvciBpcyBhdmFpbGFibGUgb24gZGV2IG9ubHlcbiAgICAgICAgICBzZXJ2ZS5lcnJvcih7IGVyciwgcmVxLCByZXMgfSlcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAvLyB3ZSdyZSBpbiBwcm9kdWN0aW9uLCBzbyB3ZSBzaG91bGQgaGF2ZSBhbm90aGVyIG1ldGhvZFxuICAgICAgICAgIC8vIHRvIGRpc3BsYXkgc29tZXRoaW5nIHRvIHRoZSBjbGllbnQgd2hlbiB3ZSBlbmNvdW50ZXIgYW4gZXJyb3JcbiAgICAgICAgICAvLyAoZm9yIHNlY3VyaXR5IHJlYXNvbnMsIGl0J3Mgbm90IG9rIHRvIGRpc3BsYXkgdGhlIHNhbWUgd2VhbHRoXG4gICAgICAgICAgLy8gb2YgaW5mb3JtYXRpb24gYXMgd2UgZG8gaW4gZGV2ZWxvcG1lbnQpXG5cbiAgICAgICAgICAvLyBSZW5kZXIgRXJyb3IgUGFnZSBvbiBwcm9kdWN0aW9uIG9yXG4gICAgICAgICAgLy8gY3JlYXRlIGEgcm91dGUgKC9zcmMvcm91dGVzKSBmb3IgYW4gZXJyb3IgcGFnZSBhbmQgcmVkaXJlY3QgdG8gaXRcbiAgICAgICAgICByZXMuc3RhdHVzKDUwMCkuc2VuZCgnNTAwIHwgSW50ZXJuYWwgU2VydmVyIEVycm9yJylcblxuICAgICAgICAgIGlmIChwcm9jZXNzLmVudi5ERUJVR0dJTkcpIHtcbiAgICAgICAgICAgIGNvbnNvbGUuZXJyb3IoZXJyLnN0YWNrKVxuICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgfSlcbiAgfSlcbn0pXG4iLCAiLyoqXG4gKiBNb3JlIGluZm8gYWJvdXQgdGhpcyBmaWxlOlxuICogaHR0cHM6Ly92Mi5xdWFzYXIuZGV2L3F1YXNhci1jbGktdml0ZS9kZXZlbG9waW5nLXNzci9zc3Itd2Vic2VydmVyXG4gKlxuICogUnVucyBpbiBOb2RlIGNvbnRleHQuXG4gKi9cblxuLyoqXG4gKiBNYWtlIHN1cmUgdG8geWFybiBhZGQgLyBucG0gaW5zdGFsbCAoaW4geW91ciBwcm9qZWN0IHJvb3QpXG4gKiBhbnl0aGluZyB5b3UgaW1wb3J0IGhlcmUgKGV4Y2VwdCBmb3IgZXhwcmVzcyBhbmQgY29tcHJlc3Npb24pLlxuICovXG5pbXBvcnQgZXhwcmVzcyBmcm9tICdleHByZXNzJ1xuaW1wb3J0IGNvbXByZXNzaW9uIGZyb20gJ2NvbXByZXNzaW9uJ1xuaW1wb3J0IHNlcnZlcmxlc3MgZnJvbSAnc2VydmVybGVzcy1odHRwJ1xuXG5pbXBvcnQge1xuICBkZWZpbmVTc3JDcmVhdGUsXG4gIGRlZmluZVNzckxpc3RlbixcbiAgZGVmaW5lU3NyQ2xvc2UsXG4gIGRlZmluZVNzclNlcnZlU3RhdGljQ29udGVudCxcbiAgZGVmaW5lU3NyUmVuZGVyUHJlbG9hZFRhZ1xufSBmcm9tICcjcS1hcHAvd3JhcHBlcnMnXG5cbi8qKlxuICogQ3JlYXRlIHlvdXIgd2Vic2VydmVyIGFuZCByZXR1cm4gaXRzIGluc3RhbmNlLlxuICogSWYgbmVlZGVkLCBwcmVwYXJlIHlvdXIgd2Vic2VydmVyIHRvIHJlY2VpdmVcbiAqIGNvbm5lY3QtbGlrZSBtaWRkbGV3YXJlcy5cbiAqXG4gKiBDYW4gYmUgYXN5bmM6IGRlZmluZVNzckNyZWF0ZShhc3luYyAoeyAuLi4gfSkgPT4geyAuLi4gfSlcbiAqL1xuZXhwb3J0IGNvbnN0IGNyZWF0ZSA9IGRlZmluZVNzckNyZWF0ZSgoLyogeyAuLi4gfSAqLykgPT4ge1xuICBjb25zdCBhcHAgPSBleHByZXNzKClcblxuICAvLyBhdHRhY2tlcnMgY2FuIHVzZSB0aGlzIGhlYWRlciB0byBkZXRlY3QgYXBwcyBydW5uaW5nIEV4cHJlc3NcbiAgLy8gYW5kIHRoZW4gbGF1bmNoIHNwZWNpZmljYWxseS10YXJnZXRlZCBhdHRhY2tzXG4gIGFwcC5kaXNhYmxlKCd4LXBvd2VyZWQtYnknKVxuXG4gIC8vIHBsYWNlIGhlcmUgYW55IG1pZGRsZXdhcmVzIHRoYXRcbiAgLy8gYWJzb2x1dGVseSBuZWVkIHRvIHJ1biBiZWZvcmUgYW55dGhpbmcgZWxzZVxuICBpZiAocHJvY2Vzcy5lbnYuUFJPRCkge1xuICAgIGFwcC51c2UoY29tcHJlc3Npb24oKSlcbiAgfVxuXG4gIHJldHVybiBhcHBcbn0pXG5cbi8qKlxuICogWW91IG5lZWQgdG8gbWFrZSB0aGUgc2VydmVyIGxpc3RlbiB0byB0aGUgaW5kaWNhdGVkIHBvcnRcbiAqIGFuZCByZXR1cm4gdGhlIGxpc3RlbmluZyBpbnN0YW5jZSBvciB3aGF0ZXZlciB5b3UgbmVlZCB0b1xuICogY2xvc2UgdGhlIHNlcnZlciB3aXRoLlxuICpcbiAqIFRoZSBcImxpc3RlblJlc3VsdFwiIHBhcmFtIGZvciB0aGUgXCJjbG9zZSgpXCIgZGVmaW5pdGlvbiBiZWxvd1xuICogaXMgd2hhdCB5b3UgcmV0dXJuIGhlcmUuXG4gKlxuICogRm9yIHByb2R1Y3Rpb24sIHlvdSBjYW4gaW5zdGVhZCBleHBvcnQgeW91clxuICogaGFuZGxlciBmb3Igc2VydmVybGVzcyB1c2Ugb3Igd2hhdGV2ZXIgZWxzZSBmaXRzIHlvdXIgbmVlZHMuXG4gKlxuICogQ2FuIGJlIGFzeW5jOiBkZWZpbmVTc3JMaXN0ZW4oYXN5bmMgKHsgYXBwLCBkZXZIdHRwc0FwcCwgcG9ydCB9KSA9PiB7IC4uLiB9KVxuICovXG5leHBvcnQgY29uc3QgbGlzdGVuID0gZGVmaW5lU3NyTGlzdGVuKCh7IGFwcCwgZGV2SHR0cHNBcHAsIHBvcnQsIHNzckhhbmRsZXIgfSkgPT4ge1xuICBpZiAocHJvY2Vzcy5lbnYuREVWKSB7XG4gICAgY29uc3Qgc2VydmVyID0gZGV2SHR0cHNBcHAgfHwgYXBwXG4gICAgcmV0dXJuIHNlcnZlci5saXN0ZW4ocG9ydCwgKCkgPT4ge1xuICAgICAgaWYgKHByb2Nlc3MuZW52LlBST0QpIHtcbiAgICAgICAgY29uc29sZS5sb2coJ1NlcnZlciBsaXN0ZW5pbmcgYXQgcG9ydCAnICsgcG9ydClcbiAgICAgIH1cbiAgICB9KVxuICB9IGVsc2Uge1xuICAgIHJldHVybiB7XG4gICAgICBoYW5kbGVyOiBzZXJ2ZXJsZXNzKHNzckhhbmRsZXIpXG4gICAgfVxuICB9XG59KVxuXG4vKipcbiAqIFNob3VsZCBjbG9zZSB0aGUgc2VydmVyIGFuZCBmcmVlIHVwIGFueSByZXNvdXJjZXMuXG4gKiBXaWxsIGJlIHVzZWQgb24gZGV2ZWxvcG1lbnQgb25seSB3aGVuIHRoZSBzZXJ2ZXIgbmVlZHNcbiAqIHRvIGJlIHJlYm9vdGVkLlxuICpcbiAqIFNob3VsZCB5b3UgbmVlZCB0aGUgcmVzdWx0IG9mIHRoZSBcImxpc3RlbigpXCIgY2FsbCBhYm92ZSxcbiAqIHlvdSBjYW4gdXNlIHRoZSBcImxpc3RlblJlc3VsdFwiIHBhcmFtLlxuICpcbiAqIENhbiBiZSBhc3luYzogZGVmaW5lU3NyQ2xvc2UoYXN5bmMgKHsgbGlzdGVuUmVzdWx0IH0pID0+IHsgLi4uIH0pXG4gKi9cbmV4cG9ydCBjb25zdCBjbG9zZSA9IGRlZmluZVNzckNsb3NlKCh7IGxpc3RlblJlc3VsdCB9KSA9PiB7XG4gIHJldHVybiBsaXN0ZW5SZXN1bHQuY2xvc2UoKVxufSlcblxuY29uc3QgbWF4QWdlID0gcHJvY2Vzcy5lbnYuREVWXG4gID8gMFxuICA6IDEwMDAgKiA2MCAqIDYwICogMjQgKiAzMFxuXG4vKipcbiAqIFNob3VsZCByZXR1cm4gYSBmdW5jdGlvbiB0aGF0IHdpbGwgYmUgdXNlZCB0byBjb25maWd1cmUgdGhlIHdlYnNlcnZlclxuICogdG8gc2VydmUgc3RhdGljIGNvbnRlbnQgYXQgXCJ1cmxQYXRoXCIgZnJvbSBcInBhdGhUb1NlcnZlXCIgZm9sZGVyL2ZpbGUuXG4gKlxuICogTm90aWNlIHJlc29sdmUudXJsUGF0aCh1cmxQYXRoKSBhbmQgcmVzb2x2ZS5wdWJsaWMocGF0aFRvU2VydmUpIHVzYWdlcy5cbiAqXG4gKiBDYW4gYmUgYXN5bmM6IGRlZmluZVNzclNlcnZlU3RhdGljQ29udGVudChhc3luYyAoeyBhcHAsIHJlc29sdmUgfSkgPT4ge1xuICogQ2FuIHJldHVybiBhbiBhc3luYyBmdW5jdGlvbjogcmV0dXJuIGFzeW5jICh7IHVybFBhdGggPSAnLycsIHBhdGhUb1NlcnZlID0gJy4nLCBvcHRzID0ge30gfSkgPT4ge1xuICovXG5leHBvcnQgY29uc3Qgc2VydmVTdGF0aWNDb250ZW50ID0gZGVmaW5lU3NyU2VydmVTdGF0aWNDb250ZW50KCh7IGFwcCwgcmVzb2x2ZSB9KSA9PiB7XG4gIHJldHVybiAoeyB1cmxQYXRoID0gJy8nLCBwYXRoVG9TZXJ2ZSA9ICcuJywgb3B0cyA9IHt9IH0pID0+IHtcbiAgICBjb25zdCBzZXJ2ZUZuID0gZXhwcmVzcy5zdGF0aWMocmVzb2x2ZS5wdWJsaWMocGF0aFRvU2VydmUpLCB7IG1heEFnZSwgLi4ub3B0cyB9KVxuICAgIGFwcC51c2UocmVzb2x2ZS51cmxQYXRoKHVybFBhdGgpLCBzZXJ2ZUZuKVxuICB9XG59KVxuXG5jb25zdCBqc1JFID0gL1xcLmpzJC9cbmNvbnN0IGNzc1JFID0gL1xcLmNzcyQvXG5jb25zdCB3b2ZmUkUgPSAvXFwud29mZiQvXG5jb25zdCB3b2ZmMlJFID0gL1xcLndvZmYyJC9cbmNvbnN0IGdpZlJFID0gL1xcLmdpZiQvXG5jb25zdCBqcGdSRSA9IC9cXC5qcGU/ZyQvXG5jb25zdCBwbmdSRSA9IC9cXC5wbmckL1xuXG4vKipcbiAqIFNob3VsZCByZXR1cm4gYSBTdHJpbmcgd2l0aCBIVE1MIG91dHB1dFxuICogKGlmIGFueSkgZm9yIHByZWxvYWRpbmcgaW5kaWNhdGVkIGZpbGVcbiAqL1xuZXhwb3J0IGNvbnN0IHJlbmRlclByZWxvYWRUYWcgPSBkZWZpbmVTc3JSZW5kZXJQcmVsb2FkVGFnKChmaWxlLyogLCB7IHNzckNvbnRleHQgfSAqLykgPT4ge1xuICBpZiAoanNSRS50ZXN0KGZpbGUpID09PSB0cnVlKSB7XG4gICAgcmV0dXJuIGA8bGluayByZWw9XCJtb2R1bGVwcmVsb2FkXCIgaHJlZj1cIiR7ZmlsZX1cIiBjcm9zc29yaWdpbj5gXG4gIH1cblxuICBpZiAoY3NzUkUudGVzdChmaWxlKSA9PT0gdHJ1ZSkge1xuICAgIHJldHVybiBgPGxpbmsgcmVsPVwic3R5bGVzaGVldFwiIGhyZWY9XCIke2ZpbGV9XCIgY3Jvc3NvcmlnaW4+YFxuICB9XG5cbiAgaWYgKHdvZmZSRS50ZXN0KGZpbGUpID09PSB0cnVlKSB7XG4gICAgcmV0dXJuIGA8bGluayByZWw9XCJwcmVsb2FkXCIgaHJlZj1cIiR7ZmlsZX1cIiBhcz1cImZvbnRcIiB0eXBlPVwiZm9udC93b2ZmXCIgY3Jvc3NvcmlnaW4+YFxuICB9XG5cbiAgaWYgKHdvZmYyUkUudGVzdChmaWxlKSA9PT0gdHJ1ZSkge1xuICAgIHJldHVybiBgPGxpbmsgcmVsPVwicHJlbG9hZFwiIGhyZWY9XCIke2ZpbGV9XCIgYXM9XCJmb250XCIgdHlwZT1cImZvbnQvd29mZjJcIiBjcm9zc29yaWdpbj5gXG4gIH1cblxuICBpZiAoZ2lmUkUudGVzdChmaWxlKSA9PT0gdHJ1ZSkge1xuICAgIHJldHVybiBgPGxpbmsgcmVsPVwicHJlbG9hZFwiIGhyZWY9XCIke2ZpbGV9XCIgYXM9XCJpbWFnZVwiIHR5cGU9XCJpbWFnZS9naWZcIiBjcm9zc29yaWdpbj5gXG4gIH1cblxuICBpZiAoanBnUkUudGVzdChmaWxlKSA9PT0gdHJ1ZSkge1xuICAgIHJldHVybiBgPGxpbmsgcmVsPVwicHJlbG9hZFwiIGhyZWY9XCIke2ZpbGV9XCIgYXM9XCJpbWFnZVwiIHR5cGU9XCJpbWFnZS9qcGVnXCIgY3Jvc3NvcmlnaW4+YFxuICB9XG5cbiAgaWYgKHBuZ1JFLnRlc3QoZmlsZSkgPT09IHRydWUpIHtcbiAgICByZXR1cm4gYDxsaW5rIHJlbD1cInByZWxvYWRcIiBocmVmPVwiJHtmaWxlfVwiIGFzPVwiaW1hZ2VcIiB0eXBlPVwiaW1hZ2UvcG5nXCIgY3Jvc3NvcmlnaW4+YFxuICB9XG5cbiAgcmV0dXJuICcnXG59KVxuIiwgIi8qIGVzbGludC1kaXNhYmxlICovXG4vKipcbiAqIFRISVMgRklMRSBJUyBHRU5FUkFURUQgQVVUT01BVElDQUxMWS5cbiAqIERPIE5PVCBFRElULlxuICoqL1xuXG5leHBvcnQgZGVmYXVsdCBmdW5jdGlvbiBpbmplY3RNaWRkbGV3YXJlcyAob3B0cykge1xuICByZXR1cm4gUHJvbWlzZS5hbGwoW1xuICAgIFxuICAgIGltcG9ydCgnYXBwL3NyYy1zc3IvbWlkZGxld2FyZXMvcmVuZGVyJylcbiAgICBcbiAgXSkudGhlbihhc3luYyByYXdNaWRkbGV3YXJlcyA9PiB7XG4gICAgY29uc3QgbWlkZGxld2FyZXMgPSByYXdNaWRkbGV3YXJlc1xuICAgICAgLm1hcChlbnRyeSA9PiBlbnRyeS5kZWZhdWx0KVxuXG4gICAgZm9yIChsZXQgaSA9IDA7IGkgPCBtaWRkbGV3YXJlcy5sZW5ndGg7IGkrKykge1xuICAgICAgdHJ5IHtcbiAgICAgICAgYXdhaXQgbWlkZGxld2FyZXNbaV0ob3B0cylcbiAgICAgIH1cbiAgICAgIGNhdGNoIChlcnIpIHtcbiAgICAgICAgY29uc29sZS5lcnJvcignW1F1YXNhciBTU1JdIG1pZGRsZXdhcmUgZXJyb3I6JywgZXJyKVxuICAgICAgICByZXR1cm5cbiAgICAgIH1cbiAgICB9XG4gIH0pXG59XG4iXSwKICAibWFwcGluZ3MiOiAiOzs7Ozs7Ozs7OztBQUFBLElBS00sU0FTTyxxQkFDQSxpQkFDQSxpQkFDQSxnQkFDQSw2QkFDQTtBQW5CYjtBQUFBO0FBS0EsSUFBTSxVQUFVLGNBQVk7QUFTckIsSUFBTSxzQkFBc0I7QUFDNUIsSUFBTSxrQkFBa0I7QUFDeEIsSUFBTSxrQkFBa0I7QUFDeEIsSUFBTSxpQkFBaUI7QUFDdkIsSUFBTSw4QkFBOEI7QUFDcEMsSUFBTSw0QkFBNEI7QUFBQTtBQUFBOzs7QUNuQnpDO0FBQUE7QUFBQTtBQUFBO0FBQUEsSUFNTztBQU5QO0FBQUE7QUFBQTtBQU1BLElBQU8saUJBQVEsb0JBQW9CLENBQUMsRUFBRSxLQUFLLFNBQVMsUUFBUSxNQUFNLE1BQU07QUFJdEUsVUFBSSxJQUFJLFFBQVEsUUFBUSxHQUFHLEdBQUcsQ0FBQyxLQUFLLFFBQVE7QUFDMUMsWUFBSSxVQUFVLGdCQUFnQixXQUFXO0FBQ3pDLFlBQUk7QUFBQSxVQUNBO0FBQUEsVUFDQTtBQUFBLFFBQ0o7QUFFQTtBQUFBO0FBQUEsVUFBNkIsRUFBRSxLQUFLLElBQUk7QUFBQSxRQUFDLEVBQ3RDLEtBQUssVUFBUTtBQUVaLGNBQUksS0FBSyxJQUFJO0FBQUEsUUFDZixDQUFDLEVBQ0EsTUFBTSxTQUFPO0FBSVosY0FBSSxJQUFJLEtBQUs7QUFDWCxnQkFBSSxJQUFJLE1BQU07QUFDWixrQkFBSSxTQUFT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
