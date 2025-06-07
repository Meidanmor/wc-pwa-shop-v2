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
var create = defineSsrCreate(() => {
  const app = express();
  app.disable("x-powered-by");
  if (false) {
    app.use(compression());
  }
  return app;
});
var listen = defineSsrListen(({ app, devHttpsApp, port }) => {
  const server = devHttpsApp || app;
  return server.listen(port, () => {
    if (false) {
      console.log("Server listening at port " + port);
    }
  });
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
//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAic291cmNlcyI6IFsiLi4vLi4vbm9kZV9tb2R1bGVzL0BxdWFzYXIvYXBwLXZpdGUvZXhwb3J0cy93cmFwcGVycy93cmFwcGVycy5qcyIsICIuLi8uLi9zcmMtc3NyL21pZGRsZXdhcmVzL3JlbmRlci5qcyIsICIuLi8uLi9zcmMtc3NyL3NlcnZlci5qcyIsICJzc3ItbWlkZGxld2FyZXMuanMiXSwKICAic291cmNlc0NvbnRlbnQiOiBbIi8vIEZ1bmN0aW9ucyBpbiB0aGlzIGZpbGUgYXJlIG5vLW9wLFxuLy8gIHRoZXkganVzdCB0YWtlIGEgY2FsbGJhY2sgZnVuY3Rpb24gYW5kIHJldHVybiBpdFxuLy8gVGhleSdyZSB1c2VkIHRvIGFwcGx5IHR5cGluZ3MgdG8gdGhlIGNhbGxiYWNrXG4vLyAgcGFyYW1ldGVycyBhbmQgcmV0dXJuIHZhbHVlIHdoZW4gdXNpbmcgUXVhc2FyIHdpdGggVHlwZVNjcmlwdFxuXG5jb25zdCB3cmFwcGVyID0gY2FsbGJhY2sgPT4gY2FsbGJhY2tcblxuZXhwb3J0IGNvbnN0IGRlZmluZUNvbmZpZyA9IHdyYXBwZXJcblxuZXhwb3J0IGNvbnN0IGRlZmluZUJvb3QgPSB3cmFwcGVyXG5leHBvcnQgY29uc3QgZGVmaW5lUHJlRmV0Y2ggPSB3cmFwcGVyXG5leHBvcnQgY29uc3QgZGVmaW5lUm91dGVyID0gd3JhcHBlclxuZXhwb3J0IGNvbnN0IGRlZmluZVN0b3JlID0gd3JhcHBlclxuXG5leHBvcnQgY29uc3QgZGVmaW5lU3NyTWlkZGxld2FyZSA9IHdyYXBwZXJcbmV4cG9ydCBjb25zdCBkZWZpbmVTc3JDcmVhdGUgPSB3cmFwcGVyXG5leHBvcnQgY29uc3QgZGVmaW5lU3NyTGlzdGVuID0gd3JhcHBlclxuZXhwb3J0IGNvbnN0IGRlZmluZVNzckNsb3NlID0gd3JhcHBlclxuZXhwb3J0IGNvbnN0IGRlZmluZVNzclNlcnZlU3RhdGljQ29udGVudCA9IHdyYXBwZXJcbmV4cG9ydCBjb25zdCBkZWZpbmVTc3JSZW5kZXJQcmVsb2FkVGFnID0gd3JhcHBlclxuIiwgImltcG9ydCB7IGRlZmluZVNzck1pZGRsZXdhcmUgfSBmcm9tICcjcS1hcHAvd3JhcHBlcnMnXG5cbi8vIFRoaXMgbWlkZGxld2FyZSBzaG91bGQgZXhlY3V0ZSBhcyBsYXN0IG9uZVxuLy8gc2luY2UgaXQgY2FwdHVyZXMgZXZlcnl0aGluZyBhbmQgdHJpZXMgdG9cbi8vIHJlbmRlciB0aGUgcGFnZSB3aXRoIFZ1ZVxuXG5leHBvcnQgZGVmYXVsdCBkZWZpbmVTc3JNaWRkbGV3YXJlKCh7IGFwcCwgcmVzb2x2ZSwgcmVuZGVyLCBzZXJ2ZSB9KSA9PiB7XG5cbiAgLy8gd2UgY2FwdHVyZSBhbnkgb3RoZXIgRXhwcmVzcyByb3V0ZSBhbmQgaGFuZCBpdFxuICAvLyBvdmVyIHRvIFZ1ZSBhbmQgVnVlIFJvdXRlciB0byByZW5kZXIgb3VyIHBhZ2VcbiAgYXBwLmdldChyZXNvbHZlLnVybFBhdGgoJyonKSwgKHJlcSwgcmVzKSA9PiB7XG4gICAgcmVzLnNldEhlYWRlcignQ29udGVudC1UeXBlJywgJ3RleHQvaHRtbCcpXG4gICAgcmVzLnNldEhlYWRlcihcbiAgICAgICAgJ0NvbnRlbnQtU2VjdXJpdHktUG9saWN5JyxcbiAgICAgICAgXCJkZWZhdWx0LXNyYyAqOyBzY3JpcHQtc3JjICdzZWxmJyAndW5zYWZlLWlubGluZSc7IHN0eWxlLXNyYyAnc2VsZicgJ3Vuc2FmZS1pbmxpbmUnO1wiXG4gICAgKVxuXG4gICAgcmVuZGVyKC8qIHRoZSBzc3JDb250ZXh0OiAqLyB7IHJlcSwgcmVzIH0pXG4gICAgICAudGhlbihodG1sID0+IHtcbiAgICAgICAgLy8gbm93IGxldCdzIHNlbmQgdGhlIHJlbmRlcmVkIGh0bWwgdG8gdGhlIGNsaWVudFxuICAgICAgICByZXMuc2VuZChodG1sKVxuICAgICAgfSlcbiAgICAgIC5jYXRjaChlcnIgPT4ge1xuICAgICAgICAvLyBvb3BzLCB3ZSBoYWQgYW4gZXJyb3Igd2hpbGUgcmVuZGVyaW5nIHRoZSBwYWdlXG5cbiAgICAgICAgLy8gd2Ugd2VyZSB0b2xkIHRvIHJlZGlyZWN0IHRvIGFub3RoZXIgVVJMXG4gICAgICAgIGlmIChlcnIudXJsKSB7XG4gICAgICAgICAgaWYgKGVyci5jb2RlKSB7XG4gICAgICAgICAgICByZXMucmVkaXJlY3QoZXJyLmNvZGUsIGVyci51cmwpXG4gICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIHJlcy5yZWRpcmVjdChlcnIudXJsKVxuICAgICAgICAgIH1cbiAgICAgICAgfSBlbHNlIGlmIChlcnIuY29kZSA9PT0gNDA0KSB7XG4gICAgICAgICAgLy8gaG1tLCBWdWUgUm91dGVyIGNvdWxkIG5vdCBmaW5kIHRoZSByZXF1ZXN0ZWQgcm91dGVcblxuICAgICAgICAgIC8vIFNob3VsZCByZWFjaCBoZXJlIG9ubHkgaWYgbm8gXCJjYXRjaC1hbGxcIiByb3V0ZVxuICAgICAgICAgIC8vIGlzIGRlZmluZWQgaW4gL3NyYy9yb3V0ZXNcbiAgICAgICAgICByZXMuc3RhdHVzKDQwNCkuc2VuZCgnNDA0IHwgUGFnZSBOb3QgRm91bmQnKVxuICAgICAgICB9IGVsc2UgaWYgKHByb2Nlc3MuZW52LkRFVikge1xuICAgICAgICAgIC8vIHdlbGwsIHdlIHRyZWF0IGFueSBvdGhlciBjb2RlIGFzIGVycm9yO1xuICAgICAgICAgIC8vIGlmIHdlJ3JlIGluIGRldiBtb2RlLCB0aGVuIHdlIGNhbiB1c2UgUXVhc2FyIENMSVxuICAgICAgICAgIC8vIHRvIGRpc3BsYXkgYSBuaWNlIGVycm9yIHBhZ2UgdGhhdCBjb250YWlucyB0aGUgc3RhY2tcbiAgICAgICAgICAvLyBhbmQgb3RoZXIgdXNlZnVsIGluZm9ybWF0aW9uXG5cbiAgICAgICAgICAvLyBzZXJ2ZS5lcnJvciBpcyBhdmFpbGFibGUgb24gZGV2IG9ubHlcbiAgICAgICAgICBzZXJ2ZS5lcnJvcih7IGVyciwgcmVxLCByZXMgfSlcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAvLyB3ZSdyZSBpbiBwcm9kdWN0aW9uLCBzbyB3ZSBzaG91bGQgaGF2ZSBhbm90aGVyIG1ldGhvZFxuICAgICAgICAgIC8vIHRvIGRpc3BsYXkgc29tZXRoaW5nIHRvIHRoZSBjbGllbnQgd2hlbiB3ZSBlbmNvdW50ZXIgYW4gZXJyb3JcbiAgICAgICAgICAvLyAoZm9yIHNlY3VyaXR5IHJlYXNvbnMsIGl0J3Mgbm90IG9rIHRvIGRpc3BsYXkgdGhlIHNhbWUgd2VhbHRoXG4gICAgICAgICAgLy8gb2YgaW5mb3JtYXRpb24gYXMgd2UgZG8gaW4gZGV2ZWxvcG1lbnQpXG5cbiAgICAgICAgICAvLyBSZW5kZXIgRXJyb3IgUGFnZSBvbiBwcm9kdWN0aW9uIG9yXG4gICAgICAgICAgLy8gY3JlYXRlIGEgcm91dGUgKC9zcmMvcm91dGVzKSBmb3IgYW4gZXJyb3IgcGFnZSBhbmQgcmVkaXJlY3QgdG8gaXRcbiAgICAgICAgICByZXMuc3RhdHVzKDUwMCkuc2VuZCgnNTAwIHwgSW50ZXJuYWwgU2VydmVyIEVycm9yJylcblxuICAgICAgICAgIGlmIChwcm9jZXNzLmVudi5ERUJVR0dJTkcpIHtcbiAgICAgICAgICAgIGNvbnNvbGUuZXJyb3IoZXJyLnN0YWNrKVxuICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgfSlcbiAgfSlcbn0pXG4iLCAiLyoqXG4gKiBNb3JlIGluZm8gYWJvdXQgdGhpcyBmaWxlOlxuICogaHR0cHM6Ly92Mi5xdWFzYXIuZGV2L3F1YXNhci1jbGktdml0ZS9kZXZlbG9waW5nLXNzci9zc3Itd2Vic2VydmVyXG4gKlxuICogUnVucyBpbiBOb2RlIGNvbnRleHQuXG4gKi9cblxuLyoqXG4gKiBNYWtlIHN1cmUgdG8geWFybiBhZGQgLyBucG0gaW5zdGFsbCAoaW4geW91ciBwcm9qZWN0IHJvb3QpXG4gKiBhbnl0aGluZyB5b3UgaW1wb3J0IGhlcmUgKGV4Y2VwdCBmb3IgZXhwcmVzcyBhbmQgY29tcHJlc3Npb24pLlxuICovXG5pbXBvcnQgZXhwcmVzcyBmcm9tICdleHByZXNzJ1xuaW1wb3J0IGNvbXByZXNzaW9uIGZyb20gJ2NvbXByZXNzaW9uJ1xuXG5pbXBvcnQge1xuICBkZWZpbmVTc3JDcmVhdGUsXG4gIGRlZmluZVNzckxpc3RlbixcbiAgZGVmaW5lU3NyQ2xvc2UsXG4gIGRlZmluZVNzclNlcnZlU3RhdGljQ29udGVudCxcbiAgZGVmaW5lU3NyUmVuZGVyUHJlbG9hZFRhZ1xufSBmcm9tICcjcS1hcHAvd3JhcHBlcnMnXG5cbi8qKlxuICogQ3JlYXRlIHlvdXIgd2Vic2VydmVyIGFuZCByZXR1cm4gaXRzIGluc3RhbmNlLlxuICogSWYgbmVlZGVkLCBwcmVwYXJlIHlvdXIgd2Vic2VydmVyIHRvIHJlY2VpdmVcbiAqIGNvbm5lY3QtbGlrZSBtaWRkbGV3YXJlcy5cbiAqXG4gKiBDYW4gYmUgYXN5bmM6IGRlZmluZVNzckNyZWF0ZShhc3luYyAoeyAuLi4gfSkgPT4geyAuLi4gfSlcbiAqL1xuZXhwb3J0IGNvbnN0IGNyZWF0ZSA9IGRlZmluZVNzckNyZWF0ZSgoLyogeyAuLi4gfSAqLykgPT4ge1xuICBjb25zdCBhcHAgPSBleHByZXNzKClcblxuICAvLyBhdHRhY2tlcnMgY2FuIHVzZSB0aGlzIGhlYWRlciB0byBkZXRlY3QgYXBwcyBydW5uaW5nIEV4cHJlc3NcbiAgLy8gYW5kIHRoZW4gbGF1bmNoIHNwZWNpZmljYWxseS10YXJnZXRlZCBhdHRhY2tzXG4gIGFwcC5kaXNhYmxlKCd4LXBvd2VyZWQtYnknKVxuXG4gIC8vIHBsYWNlIGhlcmUgYW55IG1pZGRsZXdhcmVzIHRoYXRcbiAgLy8gYWJzb2x1dGVseSBuZWVkIHRvIHJ1biBiZWZvcmUgYW55dGhpbmcgZWxzZVxuICBpZiAocHJvY2Vzcy5lbnYuUFJPRCkge1xuICAgIGFwcC51c2UoY29tcHJlc3Npb24oKSlcbiAgfVxuXG4gIHJldHVybiBhcHBcbn0pXG5cbi8qKlxuICogWW91IG5lZWQgdG8gbWFrZSB0aGUgc2VydmVyIGxpc3RlbiB0byB0aGUgaW5kaWNhdGVkIHBvcnRcbiAqIGFuZCByZXR1cm4gdGhlIGxpc3RlbmluZyBpbnN0YW5jZSBvciB3aGF0ZXZlciB5b3UgbmVlZCB0b1xuICogY2xvc2UgdGhlIHNlcnZlciB3aXRoLlxuICpcbiAqIFRoZSBcImxpc3RlblJlc3VsdFwiIHBhcmFtIGZvciB0aGUgXCJjbG9zZSgpXCIgZGVmaW5pdGlvbiBiZWxvd1xuICogaXMgd2hhdCB5b3UgcmV0dXJuIGhlcmUuXG4gKlxuICogRm9yIHByb2R1Y3Rpb24sIHlvdSBjYW4gaW5zdGVhZCBleHBvcnQgeW91clxuICogaGFuZGxlciBmb3Igc2VydmVybGVzcyB1c2Ugb3Igd2hhdGV2ZXIgZWxzZSBmaXRzIHlvdXIgbmVlZHMuXG4gKlxuICogQ2FuIGJlIGFzeW5jOiBkZWZpbmVTc3JMaXN0ZW4oYXN5bmMgKHsgYXBwLCBkZXZIdHRwc0FwcCwgcG9ydCB9KSA9PiB7IC4uLiB9KVxuICovXG5leHBvcnQgY29uc3QgbGlzdGVuID0gZGVmaW5lU3NyTGlzdGVuKCh7IGFwcCwgZGV2SHR0cHNBcHAsIHBvcnQgfSkgPT4ge1xuICAgIGNvbnN0IHNlcnZlciA9IGRldkh0dHBzQXBwIHx8IGFwcFxuICAgIHJldHVybiBzZXJ2ZXIubGlzdGVuKHBvcnQsICgpID0+IHtcbiAgICAgIGlmIChwcm9jZXNzLmVudi5QUk9EKSB7XG4gICAgICAgIGNvbnNvbGUubG9nKCdTZXJ2ZXIgbGlzdGVuaW5nIGF0IHBvcnQgJyArIHBvcnQpXG4gICAgICB9XG4gICAgfSlcbn0pXG5cbi8qKlxuICogU2hvdWxkIGNsb3NlIHRoZSBzZXJ2ZXIgYW5kIGZyZWUgdXAgYW55IHJlc291cmNlcy5cbiAqIFdpbGwgYmUgdXNlZCBvbiBkZXZlbG9wbWVudCBvbmx5IHdoZW4gdGhlIHNlcnZlciBuZWVkc1xuICogdG8gYmUgcmVib290ZWQuXG4gKlxuICogU2hvdWxkIHlvdSBuZWVkIHRoZSByZXN1bHQgb2YgdGhlIFwibGlzdGVuKClcIiBjYWxsIGFib3ZlLFxuICogeW91IGNhbiB1c2UgdGhlIFwibGlzdGVuUmVzdWx0XCIgcGFyYW0uXG4gKlxuICogQ2FuIGJlIGFzeW5jOiBkZWZpbmVTc3JDbG9zZShhc3luYyAoeyBsaXN0ZW5SZXN1bHQgfSkgPT4geyAuLi4gfSlcbiAqL1xuZXhwb3J0IGNvbnN0IGNsb3NlID0gZGVmaW5lU3NyQ2xvc2UoKHsgbGlzdGVuUmVzdWx0IH0pID0+IHtcbiAgcmV0dXJuIGxpc3RlblJlc3VsdC5jbG9zZSgpXG59KVxuXG5jb25zdCBtYXhBZ2UgPSBwcm9jZXNzLmVudi5ERVZcbiAgPyAwXG4gIDogMTAwMCAqIDYwICogNjAgKiAyNCAqIDMwXG5cbi8qKlxuICogU2hvdWxkIHJldHVybiBhIGZ1bmN0aW9uIHRoYXQgd2lsbCBiZSB1c2VkIHRvIGNvbmZpZ3VyZSB0aGUgd2Vic2VydmVyXG4gKiB0byBzZXJ2ZSBzdGF0aWMgY29udGVudCBhdCBcInVybFBhdGhcIiBmcm9tIFwicGF0aFRvU2VydmVcIiBmb2xkZXIvZmlsZS5cbiAqXG4gKiBOb3RpY2UgcmVzb2x2ZS51cmxQYXRoKHVybFBhdGgpIGFuZCByZXNvbHZlLnB1YmxpYyhwYXRoVG9TZXJ2ZSkgdXNhZ2VzLlxuICpcbiAqIENhbiBiZSBhc3luYzogZGVmaW5lU3NyU2VydmVTdGF0aWNDb250ZW50KGFzeW5jICh7IGFwcCwgcmVzb2x2ZSB9KSA9PiB7XG4gKiBDYW4gcmV0dXJuIGFuIGFzeW5jIGZ1bmN0aW9uOiByZXR1cm4gYXN5bmMgKHsgdXJsUGF0aCA9ICcvJywgcGF0aFRvU2VydmUgPSAnLicsIG9wdHMgPSB7fSB9KSA9PiB7XG4gKi9cbmV4cG9ydCBjb25zdCBzZXJ2ZVN0YXRpY0NvbnRlbnQgPSBkZWZpbmVTc3JTZXJ2ZVN0YXRpY0NvbnRlbnQoKHsgYXBwLCByZXNvbHZlIH0pID0+IHtcbiAgcmV0dXJuICh7IHVybFBhdGggPSAnLycsIHBhdGhUb1NlcnZlID0gJy4nLCBvcHRzID0ge30gfSkgPT4ge1xuICAgIGNvbnN0IHNlcnZlRm4gPSBleHByZXNzLnN0YXRpYyhyZXNvbHZlLnB1YmxpYyhwYXRoVG9TZXJ2ZSksIHsgbWF4QWdlLCAuLi5vcHRzIH0pXG4gICAgYXBwLnVzZShyZXNvbHZlLnVybFBhdGgodXJsUGF0aCksIHNlcnZlRm4pXG4gIH1cbn0pXG5cbmNvbnN0IGpzUkUgPSAvXFwuanMkL1xuY29uc3QgY3NzUkUgPSAvXFwuY3NzJC9cbmNvbnN0IHdvZmZSRSA9IC9cXC53b2ZmJC9cbmNvbnN0IHdvZmYyUkUgPSAvXFwud29mZjIkL1xuY29uc3QgZ2lmUkUgPSAvXFwuZ2lmJC9cbmNvbnN0IGpwZ1JFID0gL1xcLmpwZT9nJC9cbmNvbnN0IHBuZ1JFID0gL1xcLnBuZyQvXG5cbi8qKlxuICogU2hvdWxkIHJldHVybiBhIFN0cmluZyB3aXRoIEhUTUwgb3V0cHV0XG4gKiAoaWYgYW55KSBmb3IgcHJlbG9hZGluZyBpbmRpY2F0ZWQgZmlsZVxuICovXG5leHBvcnQgY29uc3QgcmVuZGVyUHJlbG9hZFRhZyA9IGRlZmluZVNzclJlbmRlclByZWxvYWRUYWcoKGZpbGUvKiAsIHsgc3NyQ29udGV4dCB9ICovKSA9PiB7XG4gIGlmIChqc1JFLnRlc3QoZmlsZSkgPT09IHRydWUpIHtcbiAgICByZXR1cm4gYDxsaW5rIHJlbD1cIm1vZHVsZXByZWxvYWRcIiBocmVmPVwiJHtmaWxlfVwiIGNyb3Nzb3JpZ2luPmBcbiAgfVxuXG4gIGlmIChjc3NSRS50ZXN0KGZpbGUpID09PSB0cnVlKSB7XG4gICAgcmV0dXJuIGA8bGluayByZWw9XCJzdHlsZXNoZWV0XCIgaHJlZj1cIiR7ZmlsZX1cIiBjcm9zc29yaWdpbj5gXG4gIH1cblxuICBpZiAod29mZlJFLnRlc3QoZmlsZSkgPT09IHRydWUpIHtcbiAgICByZXR1cm4gYDxsaW5rIHJlbD1cInByZWxvYWRcIiBocmVmPVwiJHtmaWxlfVwiIGFzPVwiZm9udFwiIHR5cGU9XCJmb250L3dvZmZcIiBjcm9zc29yaWdpbj5gXG4gIH1cblxuICBpZiAod29mZjJSRS50ZXN0KGZpbGUpID09PSB0cnVlKSB7XG4gICAgcmV0dXJuIGA8bGluayByZWw9XCJwcmVsb2FkXCIgaHJlZj1cIiR7ZmlsZX1cIiBhcz1cImZvbnRcIiB0eXBlPVwiZm9udC93b2ZmMlwiIGNyb3Nzb3JpZ2luPmBcbiAgfVxuXG4gIGlmIChnaWZSRS50ZXN0KGZpbGUpID09PSB0cnVlKSB7XG4gICAgcmV0dXJuIGA8bGluayByZWw9XCJwcmVsb2FkXCIgaHJlZj1cIiR7ZmlsZX1cIiBhcz1cImltYWdlXCIgdHlwZT1cImltYWdlL2dpZlwiIGNyb3Nzb3JpZ2luPmBcbiAgfVxuXG4gIGlmIChqcGdSRS50ZXN0KGZpbGUpID09PSB0cnVlKSB7XG4gICAgcmV0dXJuIGA8bGluayByZWw9XCJwcmVsb2FkXCIgaHJlZj1cIiR7ZmlsZX1cIiBhcz1cImltYWdlXCIgdHlwZT1cImltYWdlL2pwZWdcIiBjcm9zc29yaWdpbj5gXG4gIH1cblxuICBpZiAocG5nUkUudGVzdChmaWxlKSA9PT0gdHJ1ZSkge1xuICAgIHJldHVybiBgPGxpbmsgcmVsPVwicHJlbG9hZFwiIGhyZWY9XCIke2ZpbGV9XCIgYXM9XCJpbWFnZVwiIHR5cGU9XCJpbWFnZS9wbmdcIiBjcm9zc29yaWdpbj5gXG4gIH1cblxuICByZXR1cm4gJydcbn0pXG4iLCAiLyogZXNsaW50LWRpc2FibGUgKi9cbi8qKlxuICogVEhJUyBGSUxFIElTIEdFTkVSQVRFRCBBVVRPTUFUSUNBTExZLlxuICogRE8gTk9UIEVESVQuXG4gKiovXG5cbmV4cG9ydCBkZWZhdWx0IGZ1bmN0aW9uIGluamVjdE1pZGRsZXdhcmVzIChvcHRzKSB7XG4gIHJldHVybiBQcm9taXNlLmFsbChbXG4gICAgXG4gICAgaW1wb3J0KCdhcHAvc3JjLXNzci9taWRkbGV3YXJlcy9yZW5kZXInKVxuICAgIFxuICBdKS50aGVuKGFzeW5jIHJhd01pZGRsZXdhcmVzID0+IHtcbiAgICBjb25zdCBtaWRkbGV3YXJlcyA9IHJhd01pZGRsZXdhcmVzXG4gICAgICAubWFwKGVudHJ5ID0+IGVudHJ5LmRlZmF1bHQpXG5cbiAgICBmb3IgKGxldCBpID0gMDsgaSA8IG1pZGRsZXdhcmVzLmxlbmd0aDsgaSsrKSB7XG4gICAgICB0cnkge1xuICAgICAgICBhd2FpdCBtaWRkbGV3YXJlc1tpXShvcHRzKVxuICAgICAgfVxuICAgICAgY2F0Y2ggKGVycikge1xuICAgICAgICBjb25zb2xlLmVycm9yKCdbUXVhc2FyIFNTUl0gbWlkZGxld2FyZSBlcnJvcjonLCBlcnIpXG4gICAgICAgIHJldHVyblxuICAgICAgfVxuICAgIH1cbiAgfSlcbn1cbiJdLAogICJtYXBwaW5ncyI6ICI7Ozs7Ozs7Ozs7O0FBQUEsSUFLTSxTQVNPLHFCQUNBLGlCQUNBLGlCQUNBLGdCQUNBLDZCQUNBO0FBbkJiO0FBQUE7QUFLQSxJQUFNLFVBQVUsY0FBWTtBQVNyQixJQUFNLHNCQUFzQjtBQUM1QixJQUFNLGtCQUFrQjtBQUN4QixJQUFNLGtCQUFrQjtBQUN4QixJQUFNLGlCQUFpQjtBQUN2QixJQUFNLDhCQUE4QjtBQUNwQyxJQUFNLDRCQUE0QjtBQUFBO0FBQUE7OztBQ25CekM7QUFBQTtBQUFBO0FBQUE7QUFBQSxJQU1PO0FBTlA7QUFBQTtBQUFBO0FBTUEsSUFBTyxpQkFBUSxvQkFBb0IsQ0FBQyxFQUFFLEtBQUssU0FBUyxRQUFRLE1BQU0sTUFBTTtBQUl0RSxVQUFJLElBQUksUUFBUSxRQUFRLEdBQUcsR0FBRyxDQUFDLEtBQUssUUFBUTtBQUMxQyxZQUFJLFVBQVUsZ0JBQWdCLFdBQVc7QUFDekMsWUFBSTtBQUFBLFVBQ0E7QUFBQSxVQUNBO0FBQUEsUUFDSjtBQUVBO0FBQUE7QUFBQSxVQUE2QixFQUFFLEtBQUssSUFBSTtBQUFBLFFBQUMsRUFDdEMsS0FBSyxVQUFRO0FBRVosY0FBSSxLQUFLLElBQUk7QUFBQSxRQUNmLENBQUMsRUFDQSxNQUFNLFNBQU87QUFJWixjQUFJLElBQUksS0FBSztBQUNYLGdCQUFJLElBQUksTUFBTTtBQUNaLGtCQUFJLFNBQVMsSUFBSSxNQUFNLElBQUksR0FBRztBQUFBLFlBQ2hDLE9BQU87QUFDTCxrQkFBSSxTQUFTLElBQUksR0FBRztBQUFBLFlBQ3RCO0FBQUEsVUFDRixXQUFXLElBQUksU0FBUyxLQUFLO0FBSzNCLGdCQUFJLE9BQU8sR0FBRyxFQUFFLEtBQUssc0JBQXNCO0FBQUEsVUFDN0MsV0FBVyxNQUFpQjtBQU8xQixrQkFBTSxNQUFNLEVBQUUsS0FBSyxLQUFLLElBQUksQ0FBQztBQUFBLFVBQy9CLE9BQU87QUFRTCxnQkFBSSxPQUFPLEdBQUcsRUFBRSxLQUFLLDZCQUE2QjtBQUVsRCxnQkFBSSxNQUF1QjtBQUN6QixzQkFBUSxNQUFNLElBQUksS0FBSztBQUFBLFlBQ3pCO0FBQUEsVUFDRjtBQUFBLFFBQ0YsQ0FBQztBQUFBLE1BQ0wsQ0FBQztBQUFBLElBQ0gsQ0FBQztBQUFBO0FBQUE7OztBQ2hERDtBQUhBLE9BQU8sYUFBYTtBQUNwQixPQUFPLGlCQUFpQjtBQWlCakIsSUFBTSxTQUFTLGdCQUFnQixNQUFtQjtBQUN2RCxRQUFNLE1BQU0sUUFBUTtBQUlwQixNQUFJLFFBQVEsY0FBYztBQUkxQixNQUFJLE9BQWtCO0FBQ3BCLFFBQUksSUFBSSxZQUFZLENBQUM7QUFBQSxFQUN2QjtBQUVBLFNBQU87QUFDVCxDQUFDO0FBZU0sSUFBTSxTQUFTLGdCQUFnQixDQUFDLEVBQUUsS0FBSyxhQUFhLEtBQUssTUFBTTtBQUNsRSxRQUFNLFNBQVMsZUFBZTtBQUM5QixTQUFPLE9BQU8sT0FBTyxNQUFNLE1BQU07QUFDL0IsUUFBSSxPQUFrQjtBQUNwQixjQUFRLElBQUksOEJBQThCLElBQUk7QUFBQSxJQUNoRDtBQUFBLEVBQ0YsQ0FBQztBQUNMLENBQUM7QUFZTSxJQUFNLFFBQVEsZUFBZSxDQUFDLEVBQUUsYUFBYSxNQUFNO0FBQ3hELFNBQU8sYUFBYSxNQUFNO0FBQzVCLENBQUM7QUFFRCxJQUFNLFNBQVMsT0FDWCxJQUNBLE1BQU8sS0FBSyxLQUFLLEtBQUs7QUFXbkIsSUFBTSxxQkFBcUIsNEJBQTRCLENBQUMsRUFBRSxLQUFLLFFBQVEsTUFBTTtBQUNsRixTQUFPLENBQUMsRUFBRSxVQUFVLEtBQUssY0FBYyxLQUFLLE9BQU8sQ0FBQyxFQUFFLE1BQU07QUFDMUQsVUFBTSxVQUFVLFFBQVEsT0FBTyxRQUFRLE9BQU8sV0FBVyxHQUFHLEVBQUUsUUFBUSxHQUFHLEtBQUssQ0FBQztBQUMvRSxRQUFJLElBQUksUUFBUSxRQUFRLE9BQU8sR0FBRyxPQUFPO0FBQUEsRUFDM0M7QUFDRixDQUFDO0FBRUQsSUFBTSxPQUFPO0FBQ2IsSUFBTSxRQUFRO0FBQ2QsSUFBTSxTQUFTO0FBQ2YsSUFBTSxVQUFVO0FBQ2hCLElBQU0sUUFBUTtBQUNkLElBQU0sUUFBUTtBQUNkLElBQU0sUUFBUTtBQU1QLElBQU0sbUJBQW1CLDBCQUEwQixDQUFDLFNBQStCO0FBQ3hGLE1BQUksS0FBSyxLQUFLLElBQUksTUFBTSxNQUFNO0FBQzVCLFdBQU8sbUNBQW1DLElBQUk7QUFBQSxFQUNoRDtBQUVBLE1BQUksTUFBTSxLQUFLLElBQUksTUFBTSxNQUFNO0FBQzdCLFdBQU8sZ0NBQWdDLElBQUk7QUFBQSxFQUM3QztBQUVBLE1BQUksT0FBTyxLQUFLLElBQUksTUFBTSxNQUFNO0FBQzlCLFdBQU8sNkJBQTZCLElBQUk7QUFBQSxFQUMxQztBQUVBLE1BQUksUUFBUSxLQUFLLElBQUksTUFBTSxNQUFNO0FBQy9CLFdBQU8sNkJBQTZCLElBQUk7QUFBQSxFQUMxQztBQUVBLE1BQUksTUFBTSxLQUFLLElBQUksTUFBTSxNQUFNO0FBQzdCLFdBQU8sNkJBQTZCLElBQUk7QUFBQSxFQUMxQztBQUVBLE1BQUksTUFBTSxLQUFLLElBQUksTUFBTSxNQUFNO0FBQzdCLFdBQU8sNkJBQTZCLElBQUk7QUFBQSxFQUMxQztBQUVBLE1BQUksTUFBTSxLQUFLLElBQUksTUFBTSxNQUFNO0FBQzdCLFdBQU8sNkJBQTZCLElBQUk7QUFBQSxFQUMxQztBQUVBLFNBQU87QUFDVCxDQUFDOzs7QUN6SWMsU0FBUixrQkFBb0MsTUFBTTtBQUMvQyxTQUFPLFFBQVEsSUFBSTtBQUFBLElBRWpCO0FBQUEsRUFFRixDQUFDLEVBQUUsS0FBSyxPQUFNLG1CQUFrQjtBQUM5QixVQUFNLGNBQWMsZUFDakIsSUFBSSxXQUFTLE1BQU0sT0FBTztBQUU3QixhQUFTLElBQUksR0FBRyxJQUFJLFlBQVksUUFBUSxLQUFLO0FBQzNDLFVBQUk7QUFDRixjQUFNLFlBQVksQ0FBQyxFQUFFLElBQUk7QUFBQSxNQUMzQixTQUNPLEtBQUs7QUFDVixnQkFBUSxNQUFNLGtDQUFrQyxHQUFHO0FBQ25EO0FBQUEsTUFDRjtBQUFBLElBQ0Y7QUFBQSxFQUNGLENBQUM7QUFDSDsiLAogICJuYW1lcyI6IFtdCn0K
