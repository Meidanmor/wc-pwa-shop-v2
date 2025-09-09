(() => {
  // node_modules/workbox-core/_version.js
  try {
    self["workbox:core:7.2.0"] && _();
  } catch (e) {
  }

  // node_modules/workbox-core/_private/logger.js
  var logger = false ? null : (() => {
    if (!("__WB_DISABLE_DEV_LOGS" in globalThis)) {
      self.__WB_DISABLE_DEV_LOGS = false;
    }
    let inGroup = false;
    const methodToColorMap = {
      debug: `#7f8c8d`,
      log: `#2ecc71`,
      warn: `#f39c12`,
      error: `#c0392b`,
      groupCollapsed: `#3498db`,
      groupEnd: null
      // No colored prefix on groupEnd
    };
    const print = function(method, args) {
      if (self.__WB_DISABLE_DEV_LOGS) {
        return;
      }
      if (method === "groupCollapsed") {
        if (/^((?!chrome|android).)*safari/i.test(navigator.userAgent)) {
          console[method](...args);
          return;
        }
      }
      const styles = [
        `background: ${methodToColorMap[method]}`,
        `border-radius: 0.5em`,
        `color: white`,
        `font-weight: bold`,
        `padding: 2px 0.5em`
      ];
      const logPrefix = inGroup ? [] : ["%cworkbox", styles.join(";")];
      console[method](...logPrefix, ...args);
      if (method === "groupCollapsed") {
        inGroup = true;
      }
      if (method === "groupEnd") {
        inGroup = false;
      }
    };
    const api = {};
    const loggerMethods = Object.keys(methodToColorMap);
    for (const key of loggerMethods) {
      const method = key;
      api[method] = (...args) => {
        print(method, args);
      };
    }
    return api;
  })();

  // node_modules/workbox-core/models/messages/messages.js
  var messages = {
    "invalid-value": ({ paramName, validValueDescription, value }) => {
      if (!paramName || !validValueDescription) {
        throw new Error(`Unexpected input to 'invalid-value' error.`);
      }
      return `The '${paramName}' parameter was given a value with an unexpected value. ${validValueDescription} Received a value of ${JSON.stringify(value)}.`;
    },
    "not-an-array": ({ moduleName, className, funcName, paramName }) => {
      if (!moduleName || !className || !funcName || !paramName) {
        throw new Error(`Unexpected input to 'not-an-array' error.`);
      }
      return `The parameter '${paramName}' passed into '${moduleName}.${className}.${funcName}()' must be an array.`;
    },
    "incorrect-type": ({ expectedType, paramName, moduleName, className, funcName }) => {
      if (!expectedType || !paramName || !moduleName || !funcName) {
        throw new Error(`Unexpected input to 'incorrect-type' error.`);
      }
      const classNameStr = className ? `${className}.` : "";
      return `The parameter '${paramName}' passed into '${moduleName}.${classNameStr}${funcName}()' must be of type ${expectedType}.`;
    },
    "incorrect-class": ({ expectedClassName, paramName, moduleName, className, funcName, isReturnValueProblem }) => {
      if (!expectedClassName || !moduleName || !funcName) {
        throw new Error(`Unexpected input to 'incorrect-class' error.`);
      }
      const classNameStr = className ? `${className}.` : "";
      if (isReturnValueProblem) {
        return `The return value from '${moduleName}.${classNameStr}${funcName}()' must be an instance of class ${expectedClassName}.`;
      }
      return `The parameter '${paramName}' passed into '${moduleName}.${classNameStr}${funcName}()' must be an instance of class ${expectedClassName}.`;
    },
    "missing-a-method": ({ expectedMethod, paramName, moduleName, className, funcName }) => {
      if (!expectedMethod || !paramName || !moduleName || !className || !funcName) {
        throw new Error(`Unexpected input to 'missing-a-method' error.`);
      }
      return `${moduleName}.${className}.${funcName}() expected the '${paramName}' parameter to expose a '${expectedMethod}' method.`;
    },
    "add-to-cache-list-unexpected-type": ({ entry }) => {
      return `An unexpected entry was passed to 'workbox-precaching.PrecacheController.addToCacheList()' The entry '${JSON.stringify(entry)}' isn't supported. You must supply an array of strings with one or more characters, objects with a url property or Request objects.`;
    },
    "add-to-cache-list-conflicting-entries": ({ firstEntry, secondEntry }) => {
      if (!firstEntry || !secondEntry) {
        throw new Error(`Unexpected input to 'add-to-cache-list-duplicate-entries' error.`);
      }
      return `Two of the entries passed to 'workbox-precaching.PrecacheController.addToCacheList()' had the URL ${firstEntry} but different revision details. Workbox is unable to cache and version the asset correctly. Please remove one of the entries.`;
    },
    "plugin-error-request-will-fetch": ({ thrownErrorMessage }) => {
      if (!thrownErrorMessage) {
        throw new Error(`Unexpected input to 'plugin-error-request-will-fetch', error.`);
      }
      return `An error was thrown by a plugins 'requestWillFetch()' method. The thrown error message was: '${thrownErrorMessage}'.`;
    },
    "invalid-cache-name": ({ cacheNameId, value }) => {
      if (!cacheNameId) {
        throw new Error(`Expected a 'cacheNameId' for error 'invalid-cache-name'`);
      }
      return `You must provide a name containing at least one character for setCacheDetails({${cacheNameId}: '...'}). Received a value of '${JSON.stringify(value)}'`;
    },
    "unregister-route-but-not-found-with-method": ({ method }) => {
      if (!method) {
        throw new Error(`Unexpected input to 'unregister-route-but-not-found-with-method' error.`);
      }
      return `The route you're trying to unregister was not  previously registered for the method type '${method}'.`;
    },
    "unregister-route-route-not-registered": () => {
      return `The route you're trying to unregister was not previously registered.`;
    },
    "queue-replay-failed": ({ name }) => {
      return `Replaying the background sync queue '${name}' failed.`;
    },
    "duplicate-queue-name": ({ name }) => {
      return `The Queue name '${name}' is already being used. All instances of backgroundSync.Queue must be given unique names.`;
    },
    "expired-test-without-max-age": ({ methodName, paramName }) => {
      return `The '${methodName}()' method can only be used when the '${paramName}' is used in the constructor.`;
    },
    "unsupported-route-type": ({ moduleName, className, funcName, paramName }) => {
      return `The supplied '${paramName}' parameter was an unsupported type. Please check the docs for ${moduleName}.${className}.${funcName} for valid input types.`;
    },
    "not-array-of-class": ({ value, expectedClass, moduleName, className, funcName, paramName }) => {
      return `The supplied '${paramName}' parameter must be an array of '${expectedClass}' objects. Received '${JSON.stringify(value)},'. Please check the call to ${moduleName}.${className}.${funcName}() to fix the issue.`;
    },
    "max-entries-or-age-required": ({ moduleName, className, funcName }) => {
      return `You must define either config.maxEntries or config.maxAgeSecondsin ${moduleName}.${className}.${funcName}`;
    },
    "statuses-or-headers-required": ({ moduleName, className, funcName }) => {
      return `You must define either config.statuses or config.headersin ${moduleName}.${className}.${funcName}`;
    },
    "invalid-string": ({ moduleName, funcName, paramName }) => {
      if (!paramName || !moduleName || !funcName) {
        throw new Error(`Unexpected input to 'invalid-string' error.`);
      }
      return `When using strings, the '${paramName}' parameter must start with 'http' (for cross-origin matches) or '/' (for same-origin matches). Please see the docs for ${moduleName}.${funcName}() for more info.`;
    },
    "channel-name-required": () => {
      return `You must provide a channelName to construct a BroadcastCacheUpdate instance.`;
    },
    "invalid-responses-are-same-args": () => {
      return `The arguments passed into responsesAreSame() appear to be invalid. Please ensure valid Responses are used.`;
    },
    "expire-custom-caches-only": () => {
      return `You must provide a 'cacheName' property when using the expiration plugin with a runtime caching strategy.`;
    },
    "unit-must-be-bytes": ({ normalizedRangeHeader }) => {
      if (!normalizedRangeHeader) {
        throw new Error(`Unexpected input to 'unit-must-be-bytes' error.`);
      }
      return `The 'unit' portion of the Range header must be set to 'bytes'. The Range header provided was "${normalizedRangeHeader}"`;
    },
    "single-range-only": ({ normalizedRangeHeader }) => {
      if (!normalizedRangeHeader) {
        throw new Error(`Unexpected input to 'single-range-only' error.`);
      }
      return `Multiple ranges are not supported. Please use a  single start value, and optional end value. The Range header provided was "${normalizedRangeHeader}"`;
    },
    "invalid-range-values": ({ normalizedRangeHeader }) => {
      if (!normalizedRangeHeader) {
        throw new Error(`Unexpected input to 'invalid-range-values' error.`);
      }
      return `The Range header is missing both start and end values. At least one of those values is needed. The Range header provided was "${normalizedRangeHeader}"`;
    },
    "no-range-header": () => {
      return `No Range header was found in the Request provided.`;
    },
    "range-not-satisfiable": ({ size, start, end }) => {
      return `The start (${start}) and end (${end}) values in the Range are not satisfiable by the cached response, which is ${size} bytes.`;
    },
    "attempt-to-cache-non-get-request": ({ url, method }) => {
      return `Unable to cache '${url}' because it is a '${method}' request and only 'GET' requests can be cached.`;
    },
    "cache-put-with-no-response": ({ url }) => {
      return `There was an attempt to cache '${url}' but the response was not defined.`;
    },
    "no-response": ({ url, error }) => {
      let message = `The strategy could not generate a response for '${url}'.`;
      if (error) {
        message += ` The underlying error is ${error}.`;
      }
      return message;
    },
    "bad-precaching-response": ({ url, status }) => {
      return `The precaching request for '${url}' failed` + (status ? ` with an HTTP status of ${status}.` : `.`);
    },
    "non-precached-url": ({ url }) => {
      return `createHandlerBoundToURL('${url}') was called, but that URL is not precached. Please pass in a URL that is precached instead.`;
    },
    "add-to-cache-list-conflicting-integrities": ({ url }) => {
      return `Two of the entries passed to 'workbox-precaching.PrecacheController.addToCacheList()' had the URL ${url} with different integrity values. Please remove one of them.`;
    },
    "missing-precache-entry": ({ cacheName, url }) => {
      return `Unable to find a precached response in ${cacheName} for ${url}.`;
    },
    "cross-origin-copy-response": ({ origin }) => {
      return `workbox-core.copyResponse() can only be used with same-origin responses. It was passed a response with origin ${origin}.`;
    },
    "opaque-streams-source": ({ type }) => {
      const message = `One of the workbox-streams sources resulted in an '${type}' response.`;
      if (type === "opaqueredirect") {
        return `${message} Please do not use a navigation request that results in a redirect as a source.`;
      }
      return `${message} Please ensure your sources are CORS-enabled.`;
    }
  };

  // node_modules/workbox-core/models/messages/messageGenerator.js
  var generatorFunction = (code, details = {}) => {
    const message = messages[code];
    if (!message) {
      throw new Error(`Unable to find message for code '${code}'.`);
    }
    return message(details);
  };
  var messageGenerator = false ? fallback : generatorFunction;

  // node_modules/workbox-core/_private/WorkboxError.js
  var WorkboxError = class extends Error {
    /**
     *
     * @param {string} errorCode The error code that
     * identifies this particular error.
     * @param {Object=} details Any relevant arguments
     * that will help developers identify issues should
     * be added as a key on the context object.
     */
    constructor(errorCode, details) {
      const message = messageGenerator(errorCode, details);
      super(message);
      this.name = errorCode;
      this.details = details;
    }
  };

  // node_modules/workbox-core/_private/assert.js
  var isArray = (value, details) => {
    if (!Array.isArray(value)) {
      throw new WorkboxError("not-an-array", details);
    }
  };
  var hasMethod = (object, expectedMethod, details) => {
    const type = typeof object[expectedMethod];
    if (type !== "function") {
      details["expectedMethod"] = expectedMethod;
      throw new WorkboxError("missing-a-method", details);
    }
  };
  var isType = (object, expectedType, details) => {
    if (typeof object !== expectedType) {
      details["expectedType"] = expectedType;
      throw new WorkboxError("incorrect-type", details);
    }
  };
  var isInstance = (object, expectedClass, details) => {
    if (!(object instanceof expectedClass)) {
      details["expectedClassName"] = expectedClass.name;
      throw new WorkboxError("incorrect-class", details);
    }
  };
  var isOneOf = (value, validValues, details) => {
    if (!validValues.includes(value)) {
      details["validValueDescription"] = `Valid values are ${JSON.stringify(validValues)}.`;
      throw new WorkboxError("invalid-value", details);
    }
  };
  var isArrayOfClass = (value, expectedClass, details) => {
    const error = new WorkboxError("not-array-of-class", details);
    if (!Array.isArray(value)) {
      throw error;
    }
    for (const item of value) {
      if (!(item instanceof expectedClass)) {
        throw error;
      }
    }
  };
  var finalAssertExports = false ? null : {
    hasMethod,
    isArray,
    isInstance,
    isOneOf,
    isType,
    isArrayOfClass
  };

  // node_modules/workbox-core/models/quotaErrorCallbacks.js
  var quotaErrorCallbacks = /* @__PURE__ */ new Set();

  // node_modules/workbox-core/registerQuotaErrorCallback.js
  function registerQuotaErrorCallback(callback) {
    if (true) {
      finalAssertExports.isType(callback, "function", {
        moduleName: "workbox-core",
        funcName: "register",
        paramName: "callback"
      });
    }
    quotaErrorCallbacks.add(callback);
    if (true) {
      logger.log("Registered a callback to respond to quota errors.", callback);
    }
  }

  // node_modules/workbox-core/_private/cacheNames.js
  var _cacheNameDetails = {
    googleAnalytics: "googleAnalytics",
    precache: "precache-v2",
    prefix: "workbox",
    runtime: "runtime",
    suffix: typeof registration !== "undefined" ? registration.scope : ""
  };
  var _createCacheName = (cacheName) => {
    return [_cacheNameDetails.prefix, cacheName, _cacheNameDetails.suffix].filter((value) => value && value.length > 0).join("-");
  };
  var eachCacheNameDetail = (fn) => {
    for (const key of Object.keys(_cacheNameDetails)) {
      fn(key);
    }
  };
  var cacheNames = {
    updateDetails: (details) => {
      eachCacheNameDetail((key) => {
        if (typeof details[key] === "string") {
          _cacheNameDetails[key] = details[key];
        }
      });
    },
    getGoogleAnalyticsName: (userCacheName) => {
      return userCacheName || _createCacheName(_cacheNameDetails.googleAnalytics);
    },
    getPrecacheName: (userCacheName) => {
      return userCacheName || _createCacheName(_cacheNameDetails.precache);
    },
    getPrefix: () => {
      return _cacheNameDetails.prefix;
    },
    getRuntimeName: (userCacheName) => {
      return userCacheName || _createCacheName(_cacheNameDetails.runtime);
    },
    getSuffix: () => {
      return _cacheNameDetails.suffix;
    }
  };

  // node_modules/workbox-core/_private/cacheMatchIgnoreParams.js
  function stripParams(fullURL, ignoreParams) {
    const strippedURL = new URL(fullURL);
    for (const param of ignoreParams) {
      strippedURL.searchParams.delete(param);
    }
    return strippedURL.href;
  }
  async function cacheMatchIgnoreParams(cache, request, ignoreParams, matchOptions) {
    const strippedRequestURL = stripParams(request.url, ignoreParams);
    if (request.url === strippedRequestURL) {
      return cache.match(request, matchOptions);
    }
    const keysOptions = Object.assign(Object.assign({}, matchOptions), { ignoreSearch: true });
    const cacheKeys = await cache.keys(request, keysOptions);
    for (const cacheKey of cacheKeys) {
      const strippedCacheKeyURL = stripParams(cacheKey.url, ignoreParams);
      if (strippedRequestURL === strippedCacheKeyURL) {
        return cache.match(cacheKey, matchOptions);
      }
    }
    return;
  }

  // node_modules/workbox-core/_private/canConstructResponseFromBodyStream.js
  var supportStatus;
  function canConstructResponseFromBodyStream() {
    if (supportStatus === void 0) {
      const testResponse = new Response("");
      if ("body" in testResponse) {
        try {
          new Response(testResponse.body);
          supportStatus = true;
        } catch (error) {
          supportStatus = false;
        }
      }
      supportStatus = false;
    }
    return supportStatus;
  }

  // node_modules/workbox-core/_private/dontWaitFor.js
  function dontWaitFor(promise) {
    void promise.then(() => {
    });
  }

  // node_modules/workbox-core/_private/Deferred.js
  var Deferred = class {
    /**
     * Creates a promise and exposes its resolve and reject functions as methods.
     */
    constructor() {
      this.promise = new Promise((resolve, reject) => {
        this.resolve = resolve;
        this.reject = reject;
      });
    }
  };

  // node_modules/workbox-core/_private/executeQuotaErrorCallbacks.js
  async function executeQuotaErrorCallbacks() {
    if (true) {
      logger.log(`About to run ${quotaErrorCallbacks.size} callbacks to clean up caches.`);
    }
    for (const callback of quotaErrorCallbacks) {
      await callback();
      if (true) {
        logger.log(callback, "is complete.");
      }
    }
    if (true) {
      logger.log("Finished running callbacks.");
    }
  }

  // node_modules/workbox-core/_private/getFriendlyURL.js
  var getFriendlyURL = (url) => {
    const urlObj = new URL(String(url), location.href);
    return urlObj.href.replace(new RegExp(`^${location.origin}`), "");
  };

  // node_modules/workbox-core/_private/timeout.js
  function timeout(ms) {
    return new Promise((resolve) => setTimeout(resolve, ms));
  }

  // node_modules/workbox-core/_private/waitUntil.js
  function waitUntil(event, asyncFn) {
    const returnPromise = asyncFn();
    event.waitUntil(returnPromise);
    return returnPromise;
  }

  // node_modules/workbox-core/copyResponse.js
  async function copyResponse(response, modifier) {
    let origin = null;
    if (response.url) {
      const responseURL = new URL(response.url);
      origin = responseURL.origin;
    }
    if (origin !== self.location.origin) {
      throw new WorkboxError("cross-origin-copy-response", { origin });
    }
    const clonedResponse = response.clone();
    const responseInit = {
      headers: new Headers(clonedResponse.headers),
      status: clonedResponse.status,
      statusText: clonedResponse.statusText
    };
    const modifiedResponseInit = modifier ? modifier(responseInit) : responseInit;
    const body = canConstructResponseFromBodyStream() ? clonedResponse.body : await clonedResponse.blob();
    return new Response(body, modifiedResponseInit);
  }

  // node_modules/workbox-core/clientsClaim.js
  function clientsClaim() {
    self.addEventListener("activate", () => self.clients.claim());
  }

  // node_modules/workbox-precaching/_version.js
  try {
    self["workbox:precaching:7.2.0"] && _();
  } catch (e) {
  }

  // node_modules/workbox-precaching/utils/createCacheKey.js
  var REVISION_SEARCH_PARAM = "__WB_REVISION__";
  function createCacheKey(entry) {
    if (!entry) {
      throw new WorkboxError("add-to-cache-list-unexpected-type", { entry });
    }
    if (typeof entry === "string") {
      const urlObject = new URL(entry, location.href);
      return {
        cacheKey: urlObject.href,
        url: urlObject.href
      };
    }
    const { revision, url } = entry;
    if (!url) {
      throw new WorkboxError("add-to-cache-list-unexpected-type", { entry });
    }
    if (!revision) {
      const urlObject = new URL(url, location.href);
      return {
        cacheKey: urlObject.href,
        url: urlObject.href
      };
    }
    const cacheKeyURL = new URL(url, location.href);
    const originalURL = new URL(url, location.href);
    cacheKeyURL.searchParams.set(REVISION_SEARCH_PARAM, revision);
    return {
      cacheKey: cacheKeyURL.href,
      url: originalURL.href
    };
  }

  // node_modules/workbox-precaching/utils/PrecacheInstallReportPlugin.js
  var PrecacheInstallReportPlugin = class {
    constructor() {
      this.updatedURLs = [];
      this.notUpdatedURLs = [];
      this.handlerWillStart = async ({ request, state }) => {
        if (state) {
          state.originalRequest = request;
        }
      };
      this.cachedResponseWillBeUsed = async ({ event, state, cachedResponse }) => {
        if (event.type === "install") {
          if (state && state.originalRequest && state.originalRequest instanceof Request) {
            const url = state.originalRequest.url;
            if (cachedResponse) {
              this.notUpdatedURLs.push(url);
            } else {
              this.updatedURLs.push(url);
            }
          }
        }
        return cachedResponse;
      };
    }
  };

  // node_modules/workbox-precaching/utils/PrecacheCacheKeyPlugin.js
  var PrecacheCacheKeyPlugin = class {
    constructor({ precacheController: precacheController2 }) {
      this.cacheKeyWillBeUsed = async ({ request, params }) => {
        const cacheKey = (params === null || params === void 0 ? void 0 : params.cacheKey) || this._precacheController.getCacheKeyForURL(request.url);
        return cacheKey ? new Request(cacheKey, { headers: request.headers }) : request;
      };
      this._precacheController = precacheController2;
    }
  };

  // node_modules/workbox-precaching/utils/printCleanupDetails.js
  var logGroup = (groupTitle, deletedURLs) => {
    logger.groupCollapsed(groupTitle);
    for (const url of deletedURLs) {
      logger.log(url);
    }
    logger.groupEnd();
  };
  function printCleanupDetails(deletedURLs) {
    const deletionCount = deletedURLs.length;
    if (deletionCount > 0) {
      logger.groupCollapsed(`During precaching cleanup, ${deletionCount} cached request${deletionCount === 1 ? " was" : "s were"} deleted.`);
      logGroup("Deleted Cache Requests", deletedURLs);
      logger.groupEnd();
    }
  }

  // node_modules/workbox-precaching/utils/printInstallDetails.js
  function _nestedGroup(groupTitle, urls) {
    if (urls.length === 0) {
      return;
    }
    logger.groupCollapsed(groupTitle);
    for (const url of urls) {
      logger.log(url);
    }
    logger.groupEnd();
  }
  function printInstallDetails(urlsToPrecache, urlsAlreadyPrecached) {
    const precachedCount = urlsToPrecache.length;
    const alreadyPrecachedCount = urlsAlreadyPrecached.length;
    if (precachedCount || alreadyPrecachedCount) {
      let message = `Precaching ${precachedCount} file${precachedCount === 1 ? "" : "s"}.`;
      if (alreadyPrecachedCount > 0) {
        message += ` ${alreadyPrecachedCount} file${alreadyPrecachedCount === 1 ? " is" : "s are"} already cached.`;
      }
      logger.groupCollapsed(message);
      _nestedGroup(`View newly precached URLs.`, urlsToPrecache);
      _nestedGroup(`View previously precached URLs.`, urlsAlreadyPrecached);
      logger.groupEnd();
    }
  }

  // node_modules/workbox-strategies/_version.js
  try {
    self["workbox:strategies:7.2.0"] && _();
  } catch (e) {
  }

  // node_modules/workbox-strategies/StrategyHandler.js
  function toRequest(input) {
    return typeof input === "string" ? new Request(input) : input;
  }
  var StrategyHandler = class {
    /**
     * Creates a new instance associated with the passed strategy and event
     * that's handling the request.
     *
     * The constructor also initializes the state that will be passed to each of
     * the plugins handling this request.
     *
     * @param {workbox-strategies.Strategy} strategy
     * @param {Object} options
     * @param {Request|string} options.request A request to run this strategy for.
     * @param {ExtendableEvent} options.event The event associated with the
     *     request.
     * @param {URL} [options.url]
     * @param {*} [options.params] The return value from the
     *     {@link workbox-routing~matchCallback} (if applicable).
     */
    constructor(strategy, options) {
      this._cacheKeys = {};
      if (true) {
        finalAssertExports.isInstance(options.event, ExtendableEvent, {
          moduleName: "workbox-strategies",
          className: "StrategyHandler",
          funcName: "constructor",
          paramName: "options.event"
        });
      }
      Object.assign(this, options);
      this.event = options.event;
      this._strategy = strategy;
      this._handlerDeferred = new Deferred();
      this._extendLifetimePromises = [];
      this._plugins = [...strategy.plugins];
      this._pluginStateMap = /* @__PURE__ */ new Map();
      for (const plugin of this._plugins) {
        this._pluginStateMap.set(plugin, {});
      }
      this.event.waitUntil(this._handlerDeferred.promise);
    }
    /**
     * Fetches a given request (and invokes any applicable plugin callback
     * methods) using the `fetchOptions` (for non-navigation requests) and
     * `plugins` defined on the `Strategy` object.
     *
     * The following plugin lifecycle methods are invoked when using this method:
     * - `requestWillFetch()`
     * - `fetchDidSucceed()`
     * - `fetchDidFail()`
     *
     * @param {Request|string} input The URL or request to fetch.
     * @return {Promise<Response>}
     */
    async fetch(input) {
      const { event } = this;
      let request = toRequest(input);
      if (request.mode === "navigate" && event instanceof FetchEvent && event.preloadResponse) {
        const possiblePreloadResponse = await event.preloadResponse;
        if (possiblePreloadResponse) {
          if (true) {
            logger.log(`Using a preloaded navigation response for '${getFriendlyURL(request.url)}'`);
          }
          return possiblePreloadResponse;
        }
      }
      const originalRequest = this.hasCallback("fetchDidFail") ? request.clone() : null;
      try {
        for (const cb of this.iterateCallbacks("requestWillFetch")) {
          request = await cb({ request: request.clone(), event });
        }
      } catch (err) {
        if (err instanceof Error) {
          throw new WorkboxError("plugin-error-request-will-fetch", {
            thrownErrorMessage: err.message
          });
        }
      }
      const pluginFilteredRequest = request.clone();
      try {
        let fetchResponse;
        fetchResponse = await fetch(request, request.mode === "navigate" ? void 0 : this._strategy.fetchOptions);
        if (true) {
          logger.debug(`Network request for '${getFriendlyURL(request.url)}' returned a response with status '${fetchResponse.status}'.`);
        }
        for (const callback of this.iterateCallbacks("fetchDidSucceed")) {
          fetchResponse = await callback({
            event,
            request: pluginFilteredRequest,
            response: fetchResponse
          });
        }
        return fetchResponse;
      } catch (error) {
        if (true) {
          logger.log(`Network request for '${getFriendlyURL(request.url)}' threw an error.`, error);
        }
        if (originalRequest) {
          await this.runCallbacks("fetchDidFail", {
            error,
            event,
            originalRequest: originalRequest.clone(),
            request: pluginFilteredRequest.clone()
          });
        }
        throw error;
      }
    }
    /**
     * Calls `this.fetch()` and (in the background) runs `this.cachePut()` on
     * the response generated by `this.fetch()`.
     *
     * The call to `this.cachePut()` automatically invokes `this.waitUntil()`,
     * so you do not have to manually call `waitUntil()` on the event.
     *
     * @param {Request|string} input The request or URL to fetch and cache.
     * @return {Promise<Response>}
     */
    async fetchAndCachePut(input) {
      const response = await this.fetch(input);
      const responseClone = response.clone();
      void this.waitUntil(this.cachePut(input, responseClone));
      return response;
    }
    /**
     * Matches a request from the cache (and invokes any applicable plugin
     * callback methods) using the `cacheName`, `matchOptions`, and `plugins`
     * defined on the strategy object.
     *
     * The following plugin lifecycle methods are invoked when using this method:
     * - cacheKeyWillBeUsed()
     * - cachedResponseWillBeUsed()
     *
     * @param {Request|string} key The Request or URL to use as the cache key.
     * @return {Promise<Response|undefined>} A matching response, if found.
     */
    async cacheMatch(key) {
      const request = toRequest(key);
      let cachedResponse;
      const { cacheName, matchOptions } = this._strategy;
      const effectiveRequest = await this.getCacheKey(request, "read");
      const multiMatchOptions = Object.assign(Object.assign({}, matchOptions), { cacheName });
      cachedResponse = await caches.match(effectiveRequest, multiMatchOptions);
      if (true) {
        if (cachedResponse) {
          logger.debug(`Found a cached response in '${cacheName}'.`);
        } else {
          logger.debug(`No cached response found in '${cacheName}'.`);
        }
      }
      for (const callback of this.iterateCallbacks("cachedResponseWillBeUsed")) {
        cachedResponse = await callback({
          cacheName,
          matchOptions,
          cachedResponse,
          request: effectiveRequest,
          event: this.event
        }) || void 0;
      }
      return cachedResponse;
    }
    /**
     * Puts a request/response pair in the cache (and invokes any applicable
     * plugin callback methods) using the `cacheName` and `plugins` defined on
     * the strategy object.
     *
     * The following plugin lifecycle methods are invoked when using this method:
     * - cacheKeyWillBeUsed()
     * - cacheWillUpdate()
     * - cacheDidUpdate()
     *
     * @param {Request|string} key The request or URL to use as the cache key.
     * @param {Response} response The response to cache.
     * @return {Promise<boolean>} `false` if a cacheWillUpdate caused the response
     * not be cached, and `true` otherwise.
     */
    async cachePut(key, response) {
      const request = toRequest(key);
      await timeout(0);
      const effectiveRequest = await this.getCacheKey(request, "write");
      if (true) {
        if (effectiveRequest.method && effectiveRequest.method !== "GET") {
          throw new WorkboxError("attempt-to-cache-non-get-request", {
            url: getFriendlyURL(effectiveRequest.url),
            method: effectiveRequest.method
          });
        }
        const vary = response.headers.get("Vary");
        if (vary) {
          logger.debug(`The response for ${getFriendlyURL(effectiveRequest.url)} has a 'Vary: ${vary}' header. Consider setting the {ignoreVary: true} option on your strategy to ensure cache matching and deletion works as expected.`);
        }
      }
      if (!response) {
        if (true) {
          logger.error(`Cannot cache non-existent response for '${getFriendlyURL(effectiveRequest.url)}'.`);
        }
        throw new WorkboxError("cache-put-with-no-response", {
          url: getFriendlyURL(effectiveRequest.url)
        });
      }
      const responseToCache = await this._ensureResponseSafeToCache(response);
      if (!responseToCache) {
        if (true) {
          logger.debug(`Response '${getFriendlyURL(effectiveRequest.url)}' will not be cached.`, responseToCache);
        }
        return false;
      }
      const { cacheName, matchOptions } = this._strategy;
      const cache = await self.caches.open(cacheName);
      const hasCacheUpdateCallback = this.hasCallback("cacheDidUpdate");
      const oldResponse = hasCacheUpdateCallback ? await cacheMatchIgnoreParams(
        // TODO(philipwalton): the `__WB_REVISION__` param is a precaching
        // feature. Consider into ways to only add this behavior if using
        // precaching.
        cache,
        effectiveRequest.clone(),
        ["__WB_REVISION__"],
        matchOptions
      ) : null;
      if (true) {
        logger.debug(`Updating the '${cacheName}' cache with a new Response for ${getFriendlyURL(effectiveRequest.url)}.`);
      }
      try {
        await cache.put(effectiveRequest, hasCacheUpdateCallback ? responseToCache.clone() : responseToCache);
      } catch (error) {
        if (error instanceof Error) {
          if (error.name === "QuotaExceededError") {
            await executeQuotaErrorCallbacks();
          }
          throw error;
        }
      }
      for (const callback of this.iterateCallbacks("cacheDidUpdate")) {
        await callback({
          cacheName,
          oldResponse,
          newResponse: responseToCache.clone(),
          request: effectiveRequest,
          event: this.event
        });
      }
      return true;
    }
    /**
     * Checks the list of plugins for the `cacheKeyWillBeUsed` callback, and
     * executes any of those callbacks found in sequence. The final `Request`
     * object returned by the last plugin is treated as the cache key for cache
     * reads and/or writes. If no `cacheKeyWillBeUsed` plugin callbacks have
     * been registered, the passed request is returned unmodified
     *
     * @param {Request} request
     * @param {string} mode
     * @return {Promise<Request>}
     */
    async getCacheKey(request, mode) {
      const key = `${request.url} | ${mode}`;
      if (!this._cacheKeys[key]) {
        let effectiveRequest = request;
        for (const callback of this.iterateCallbacks("cacheKeyWillBeUsed")) {
          effectiveRequest = toRequest(await callback({
            mode,
            request: effectiveRequest,
            event: this.event,
            // params has a type any can't change right now.
            params: this.params
            // eslint-disable-line
          }));
        }
        this._cacheKeys[key] = effectiveRequest;
      }
      return this._cacheKeys[key];
    }
    /**
     * Returns true if the strategy has at least one plugin with the given
     * callback.
     *
     * @param {string} name The name of the callback to check for.
     * @return {boolean}
     */
    hasCallback(name) {
      for (const plugin of this._strategy.plugins) {
        if (name in plugin) {
          return true;
        }
      }
      return false;
    }
    /**
     * Runs all plugin callbacks matching the given name, in order, passing the
     * given param object (merged ith the current plugin state) as the only
     * argument.
     *
     * Note: since this method runs all plugins, it's not suitable for cases
     * where the return value of a callback needs to be applied prior to calling
     * the next callback. See
     * {@link workbox-strategies.StrategyHandler#iterateCallbacks}
     * below for how to handle that case.
     *
     * @param {string} name The name of the callback to run within each plugin.
     * @param {Object} param The object to pass as the first (and only) param
     *     when executing each callback. This object will be merged with the
     *     current plugin state prior to callback execution.
     */
    async runCallbacks(name, param) {
      for (const callback of this.iterateCallbacks(name)) {
        await callback(param);
      }
    }
    /**
     * Accepts a callback and returns an iterable of matching plugin callbacks,
     * where each callback is wrapped with the current handler state (i.e. when
     * you call each callback, whatever object parameter you pass it will
     * be merged with the plugin's current state).
     *
     * @param {string} name The name fo the callback to run
     * @return {Array<Function>}
     */
    *iterateCallbacks(name) {
      for (const plugin of this._strategy.plugins) {
        if (typeof plugin[name] === "function") {
          const state = this._pluginStateMap.get(plugin);
          const statefulCallback = (param) => {
            const statefulParam = Object.assign(Object.assign({}, param), { state });
            return plugin[name](statefulParam);
          };
          yield statefulCallback;
        }
      }
    }
    /**
     * Adds a promise to the
     * [extend lifetime promises]{@link https://w3c.github.io/ServiceWorker/#extendableevent-extend-lifetime-promises}
     * of the event event associated with the request being handled (usually a
     * `FetchEvent`).
     *
     * Note: you can await
     * {@link workbox-strategies.StrategyHandler~doneWaiting}
     * to know when all added promises have settled.
     *
     * @param {Promise} promise A promise to add to the extend lifetime promises
     *     of the event that triggered the request.
     */
    waitUntil(promise) {
      this._extendLifetimePromises.push(promise);
      return promise;
    }
    /**
     * Returns a promise that resolves once all promises passed to
     * {@link workbox-strategies.StrategyHandler~waitUntil}
     * have settled.
     *
     * Note: any work done after `doneWaiting()` settles should be manually
     * passed to an event's `waitUntil()` method (not this handler's
     * `waitUntil()` method), otherwise the service worker thread my be killed
     * prior to your work completing.
     */
    async doneWaiting() {
      let promise;
      while (promise = this._extendLifetimePromises.shift()) {
        await promise;
      }
    }
    /**
     * Stops running the strategy and immediately resolves any pending
     * `waitUntil()` promises.
     */
    destroy() {
      this._handlerDeferred.resolve(null);
    }
    /**
     * This method will call cacheWillUpdate on the available plugins (or use
     * status === 200) to determine if the Response is safe and valid to cache.
     *
     * @param {Request} options.request
     * @param {Response} options.response
     * @return {Promise<Response|undefined>}
     *
     * @private
     */
    async _ensureResponseSafeToCache(response) {
      let responseToCache = response;
      let pluginsUsed = false;
      for (const callback of this.iterateCallbacks("cacheWillUpdate")) {
        responseToCache = await callback({
          request: this.request,
          response: responseToCache,
          event: this.event
        }) || void 0;
        pluginsUsed = true;
        if (!responseToCache) {
          break;
        }
      }
      if (!pluginsUsed) {
        if (responseToCache && responseToCache.status !== 200) {
          responseToCache = void 0;
        }
        if (true) {
          if (responseToCache) {
            if (responseToCache.status !== 200) {
              if (responseToCache.status === 0) {
                logger.warn(`The response for '${this.request.url}' is an opaque response. The caching strategy that you're using will not cache opaque responses by default.`);
              } else {
                logger.debug(`The response for '${this.request.url}' returned a status code of '${response.status}' and won't be cached as a result.`);
              }
            }
          }
        }
      }
      return responseToCache;
    }
  };

  // node_modules/workbox-strategies/Strategy.js
  var Strategy = class {
    /**
     * Creates a new instance of the strategy and sets all documented option
     * properties as public instance properties.
     *
     * Note: if a custom strategy class extends the base Strategy class and does
     * not need more than these properties, it does not need to define its own
     * constructor.
     *
     * @param {Object} [options]
     * @param {string} [options.cacheName] Cache name to store and retrieve
     * requests. Defaults to the cache names provided by
     * {@link workbox-core.cacheNames}.
     * @param {Array<Object>} [options.plugins] [Plugins]{@link https://developers.google.com/web/tools/workbox/guides/using-plugins}
     * to use in conjunction with this caching strategy.
     * @param {Object} [options.fetchOptions] Values passed along to the
     * [`init`](https://developer.mozilla.org/en-US/docs/Web/API/WindowOrWorkerGlobalScope/fetch#Parameters)
     * of [non-navigation](https://github.com/GoogleChrome/workbox/issues/1796)
     * `fetch()` requests made by this strategy.
     * @param {Object} [options.matchOptions] The
     * [`CacheQueryOptions`]{@link https://w3c.github.io/ServiceWorker/#dictdef-cachequeryoptions}
     * for any `cache.match()` or `cache.put()` calls made by this strategy.
     */
    constructor(options = {}) {
      this.cacheName = cacheNames.getRuntimeName(options.cacheName);
      this.plugins = options.plugins || [];
      this.fetchOptions = options.fetchOptions;
      this.matchOptions = options.matchOptions;
    }
    /**
     * Perform a request strategy and returns a `Promise` that will resolve with
     * a `Response`, invoking all relevant plugin callbacks.
     *
     * When a strategy instance is registered with a Workbox
     * {@link workbox-routing.Route}, this method is automatically
     * called when the route matches.
     *
     * Alternatively, this method can be used in a standalone `FetchEvent`
     * listener by passing it to `event.respondWith()`.
     *
     * @param {FetchEvent|Object} options A `FetchEvent` or an object with the
     *     properties listed below.
     * @param {Request|string} options.request A request to run this strategy for.
     * @param {ExtendableEvent} options.event The event associated with the
     *     request.
     * @param {URL} [options.url]
     * @param {*} [options.params]
     */
    handle(options) {
      const [responseDone] = this.handleAll(options);
      return responseDone;
    }
    /**
     * Similar to {@link workbox-strategies.Strategy~handle}, but
     * instead of just returning a `Promise` that resolves to a `Response` it
     * it will return an tuple of `[response, done]` promises, where the former
     * (`response`) is equivalent to what `handle()` returns, and the latter is a
     * Promise that will resolve once any promises that were added to
     * `event.waitUntil()` as part of performing the strategy have completed.
     *
     * You can await the `done` promise to ensure any extra work performed by
     * the strategy (usually caching responses) completes successfully.
     *
     * @param {FetchEvent|Object} options A `FetchEvent` or an object with the
     *     properties listed below.
     * @param {Request|string} options.request A request to run this strategy for.
     * @param {ExtendableEvent} options.event The event associated with the
     *     request.
     * @param {URL} [options.url]
     * @param {*} [options.params]
     * @return {Array<Promise>} A tuple of [response, done]
     *     promises that can be used to determine when the response resolves as
     *     well as when the handler has completed all its work.
     */
    handleAll(options) {
      if (options instanceof FetchEvent) {
        options = {
          event: options,
          request: options.request
        };
      }
      const event = options.event;
      const request = typeof options.request === "string" ? new Request(options.request) : options.request;
      const params = "params" in options ? options.params : void 0;
      const handler = new StrategyHandler(this, { event, request, params });
      const responseDone = this._getResponse(handler, request, event);
      const handlerDone = this._awaitComplete(responseDone, handler, request, event);
      return [responseDone, handlerDone];
    }
    async _getResponse(handler, request, event) {
      await handler.runCallbacks("handlerWillStart", { event, request });
      let response = void 0;
      try {
        response = await this._handle(request, handler);
        if (!response || response.type === "error") {
          throw new WorkboxError("no-response", { url: request.url });
        }
      } catch (error) {
        if (error instanceof Error) {
          for (const callback of handler.iterateCallbacks("handlerDidError")) {
            response = await callback({ error, event, request });
            if (response) {
              break;
            }
          }
        }
        if (!response) {
          throw error;
        } else if (true) {
          logger.log(`While responding to '${getFriendlyURL(request.url)}', an ${error instanceof Error ? error.toString() : ""} error occurred. Using a fallback response provided by a handlerDidError plugin.`);
        }
      }
      for (const callback of handler.iterateCallbacks("handlerWillRespond")) {
        response = await callback({ event, request, response });
      }
      return response;
    }
    async _awaitComplete(responseDone, handler, request, event) {
      let response;
      let error;
      try {
        response = await responseDone;
      } catch (error2) {
      }
      try {
        await handler.runCallbacks("handlerDidRespond", {
          event,
          request,
          response
        });
        await handler.doneWaiting();
      } catch (waitUntilError) {
        if (waitUntilError instanceof Error) {
          error = waitUntilError;
        }
      }
      await handler.runCallbacks("handlerDidComplete", {
        event,
        request,
        response,
        error
      });
      handler.destroy();
      if (error) {
        throw error;
      }
    }
  };

  // node_modules/workbox-precaching/PrecacheStrategy.js
  var PrecacheStrategy = class _PrecacheStrategy extends Strategy {
    /**
     *
     * @param {Object} [options]
     * @param {string} [options.cacheName] Cache name to store and retrieve
     * requests. Defaults to the cache names provided by
     * {@link workbox-core.cacheNames}.
     * @param {Array<Object>} [options.plugins] {@link https://developers.google.com/web/tools/workbox/guides/using-plugins|Plugins}
     * to use in conjunction with this caching strategy.
     * @param {Object} [options.fetchOptions] Values passed along to the
     * {@link https://developer.mozilla.org/en-US/docs/Web/API/WindowOrWorkerGlobalScope/fetch#Parameters|init}
     * of all fetch() requests made by this strategy.
     * @param {Object} [options.matchOptions] The
     * {@link https://w3c.github.io/ServiceWorker/#dictdef-cachequeryoptions|CacheQueryOptions}
     * for any `cache.match()` or `cache.put()` calls made by this strategy.
     * @param {boolean} [options.fallbackToNetwork=true] Whether to attempt to
     * get the response from the network if there's a precache miss.
     */
    constructor(options = {}) {
      options.cacheName = cacheNames.getPrecacheName(options.cacheName);
      super(options);
      this._fallbackToNetwork = options.fallbackToNetwork === false ? false : true;
      this.plugins.push(_PrecacheStrategy.copyRedirectedCacheableResponsesPlugin);
    }
    /**
     * @private
     * @param {Request|string} request A request to run this strategy for.
     * @param {workbox-strategies.StrategyHandler} handler The event that
     *     triggered the request.
     * @return {Promise<Response>}
     */
    async _handle(request, handler) {
      const response = await handler.cacheMatch(request);
      if (response) {
        return response;
      }
      if (handler.event && handler.event.type === "install") {
        return await this._handleInstall(request, handler);
      }
      return await this._handleFetch(request, handler);
    }
    async _handleFetch(request, handler) {
      let response;
      const params = handler.params || {};
      if (this._fallbackToNetwork) {
        if (true) {
          logger.warn(`The precached response for ${getFriendlyURL(request.url)} in ${this.cacheName} was not found. Falling back to the network.`);
        }
        const integrityInManifest = params.integrity;
        const integrityInRequest = request.integrity;
        const noIntegrityConflict = !integrityInRequest || integrityInRequest === integrityInManifest;
        response = await handler.fetch(new Request(request, {
          integrity: request.mode !== "no-cors" ? integrityInRequest || integrityInManifest : void 0
        }));
        if (integrityInManifest && noIntegrityConflict && request.mode !== "no-cors") {
          this._useDefaultCacheabilityPluginIfNeeded();
          const wasCached = await handler.cachePut(request, response.clone());
          if (true) {
            if (wasCached) {
              logger.log(`A response for ${getFriendlyURL(request.url)} was used to "repair" the precache.`);
            }
          }
        }
      } else {
        throw new WorkboxError("missing-precache-entry", {
          cacheName: this.cacheName,
          url: request.url
        });
      }
      if (true) {
        const cacheKey = params.cacheKey || await handler.getCacheKey(request, "read");
        logger.groupCollapsed(`Precaching is responding to: ` + getFriendlyURL(request.url));
        logger.log(`Serving the precached url: ${getFriendlyURL(cacheKey instanceof Request ? cacheKey.url : cacheKey)}`);
        logger.groupCollapsed(`View request details here.`);
        logger.log(request);
        logger.groupEnd();
        logger.groupCollapsed(`View response details here.`);
        logger.log(response);
        logger.groupEnd();
        logger.groupEnd();
      }
      return response;
    }
    async _handleInstall(request, handler) {
      this._useDefaultCacheabilityPluginIfNeeded();
      const response = await handler.fetch(request);
      const wasCached = await handler.cachePut(request, response.clone());
      if (!wasCached) {
        throw new WorkboxError("bad-precaching-response", {
          url: request.url,
          status: response.status
        });
      }
      return response;
    }
    /**
     * This method is complex, as there a number of things to account for:
     *
     * The `plugins` array can be set at construction, and/or it might be added to
     * to at any time before the strategy is used.
     *
     * At the time the strategy is used (i.e. during an `install` event), there
     * needs to be at least one plugin that implements `cacheWillUpdate` in the
     * array, other than `copyRedirectedCacheableResponsesPlugin`.
     *
     * - If this method is called and there are no suitable `cacheWillUpdate`
     * plugins, we need to add `defaultPrecacheCacheabilityPlugin`.
     *
     * - If this method is called and there is exactly one `cacheWillUpdate`, then
     * we don't have to do anything (this might be a previously added
     * `defaultPrecacheCacheabilityPlugin`, or it might be a custom plugin).
     *
     * - If this method is called and there is more than one `cacheWillUpdate`,
     * then we need to check if one is `defaultPrecacheCacheabilityPlugin`. If so,
     * we need to remove it. (This situation is unlikely, but it could happen if
     * the strategy is used multiple times, the first without a `cacheWillUpdate`,
     * and then later on after manually adding a custom `cacheWillUpdate`.)
     *
     * See https://github.com/GoogleChrome/workbox/issues/2737 for more context.
     *
     * @private
     */
    _useDefaultCacheabilityPluginIfNeeded() {
      let defaultPluginIndex = null;
      let cacheWillUpdatePluginCount = 0;
      for (const [index, plugin] of this.plugins.entries()) {
        if (plugin === _PrecacheStrategy.copyRedirectedCacheableResponsesPlugin) {
          continue;
        }
        if (plugin === _PrecacheStrategy.defaultPrecacheCacheabilityPlugin) {
          defaultPluginIndex = index;
        }
        if (plugin.cacheWillUpdate) {
          cacheWillUpdatePluginCount++;
        }
      }
      if (cacheWillUpdatePluginCount === 0) {
        this.plugins.push(_PrecacheStrategy.defaultPrecacheCacheabilityPlugin);
      } else if (cacheWillUpdatePluginCount > 1 && defaultPluginIndex !== null) {
        this.plugins.splice(defaultPluginIndex, 1);
      }
    }
  };
  PrecacheStrategy.defaultPrecacheCacheabilityPlugin = {
    async cacheWillUpdate({ response }) {
      if (!response || response.status >= 400) {
        return null;
      }
      return response;
    }
  };
  PrecacheStrategy.copyRedirectedCacheableResponsesPlugin = {
    async cacheWillUpdate({ response }) {
      return response.redirected ? await copyResponse(response) : response;
    }
  };

  // node_modules/workbox-precaching/PrecacheController.js
  var PrecacheController = class {
    /**
     * Create a new PrecacheController.
     *
     * @param {Object} [options]
     * @param {string} [options.cacheName] The cache to use for precaching.
     * @param {string} [options.plugins] Plugins to use when precaching as well
     * as responding to fetch events for precached assets.
     * @param {boolean} [options.fallbackToNetwork=true] Whether to attempt to
     * get the response from the network if there's a precache miss.
     */
    constructor({ cacheName, plugins = [], fallbackToNetwork = true } = {}) {
      this._urlsToCacheKeys = /* @__PURE__ */ new Map();
      this._urlsToCacheModes = /* @__PURE__ */ new Map();
      this._cacheKeysToIntegrities = /* @__PURE__ */ new Map();
      this._strategy = new PrecacheStrategy({
        cacheName: cacheNames.getPrecacheName(cacheName),
        plugins: [
          ...plugins,
          new PrecacheCacheKeyPlugin({ precacheController: this })
        ],
        fallbackToNetwork
      });
      this.install = this.install.bind(this);
      this.activate = this.activate.bind(this);
    }
    /**
     * @type {workbox-precaching.PrecacheStrategy} The strategy created by this controller and
     * used to cache assets and respond to fetch events.
     */
    get strategy() {
      return this._strategy;
    }
    /**
     * Adds items to the precache list, removing any duplicates and
     * stores the files in the
     * {@link workbox-core.cacheNames|"precache cache"} when the service
     * worker installs.
     *
     * This method can be called multiple times.
     *
     * @param {Array<Object|string>} [entries=[]] Array of entries to precache.
     */
    precache(entries) {
      this.addToCacheList(entries);
      if (!this._installAndActiveListenersAdded) {
        self.addEventListener("install", this.install);
        self.addEventListener("activate", this.activate);
        this._installAndActiveListenersAdded = true;
      }
    }
    /**
     * This method will add items to the precache list, removing duplicates
     * and ensuring the information is valid.
     *
     * @param {Array<workbox-precaching.PrecacheController.PrecacheEntry|string>} entries
     *     Array of entries to precache.
     */
    addToCacheList(entries) {
      if (true) {
        finalAssertExports.isArray(entries, {
          moduleName: "workbox-precaching",
          className: "PrecacheController",
          funcName: "addToCacheList",
          paramName: "entries"
        });
      }
      const urlsToWarnAbout = [];
      for (const entry of entries) {
        if (typeof entry === "string") {
          urlsToWarnAbout.push(entry);
        } else if (entry && entry.revision === void 0) {
          urlsToWarnAbout.push(entry.url);
        }
        const { cacheKey, url } = createCacheKey(entry);
        const cacheMode = typeof entry !== "string" && entry.revision ? "reload" : "default";
        if (this._urlsToCacheKeys.has(url) && this._urlsToCacheKeys.get(url) !== cacheKey) {
          throw new WorkboxError("add-to-cache-list-conflicting-entries", {
            firstEntry: this._urlsToCacheKeys.get(url),
            secondEntry: cacheKey
          });
        }
        if (typeof entry !== "string" && entry.integrity) {
          if (this._cacheKeysToIntegrities.has(cacheKey) && this._cacheKeysToIntegrities.get(cacheKey) !== entry.integrity) {
            throw new WorkboxError("add-to-cache-list-conflicting-integrities", {
              url
            });
          }
          this._cacheKeysToIntegrities.set(cacheKey, entry.integrity);
        }
        this._urlsToCacheKeys.set(url, cacheKey);
        this._urlsToCacheModes.set(url, cacheMode);
        if (urlsToWarnAbout.length > 0) {
          const warningMessage = `Workbox is precaching URLs without revision info: ${urlsToWarnAbout.join(", ")}
This is generally NOT safe. Learn more at https://bit.ly/wb-precache`;
          if (false) {
            console.warn(warningMessage);
          } else {
            logger.warn(warningMessage);
          }
        }
      }
    }
    /**
     * Precaches new and updated assets. Call this method from the service worker
     * install event.
     *
     * Note: this method calls `event.waitUntil()` for you, so you do not need
     * to call it yourself in your event handlers.
     *
     * @param {ExtendableEvent} event
     * @return {Promise<workbox-precaching.InstallResult>}
     */
    install(event) {
      return waitUntil(event, async () => {
        const installReportPlugin = new PrecacheInstallReportPlugin();
        this.strategy.plugins.push(installReportPlugin);
        for (const [url, cacheKey] of this._urlsToCacheKeys) {
          const integrity = this._cacheKeysToIntegrities.get(cacheKey);
          const cacheMode = this._urlsToCacheModes.get(url);
          const request = new Request(url, {
            integrity,
            cache: cacheMode,
            credentials: "same-origin"
          });
          await Promise.all(this.strategy.handleAll({
            params: { cacheKey },
            request,
            event
          }));
        }
        const { updatedURLs, notUpdatedURLs } = installReportPlugin;
        if (true) {
          printInstallDetails(updatedURLs, notUpdatedURLs);
        }
        return { updatedURLs, notUpdatedURLs };
      });
    }
    /**
     * Deletes assets that are no longer present in the current precache manifest.
     * Call this method from the service worker activate event.
     *
     * Note: this method calls `event.waitUntil()` for you, so you do not need
     * to call it yourself in your event handlers.
     *
     * @param {ExtendableEvent} event
     * @return {Promise<workbox-precaching.CleanupResult>}
     */
    activate(event) {
      return waitUntil(event, async () => {
        const cache = await self.caches.open(this.strategy.cacheName);
        const currentlyCachedRequests = await cache.keys();
        const expectedCacheKeys = new Set(this._urlsToCacheKeys.values());
        const deletedURLs = [];
        for (const request of currentlyCachedRequests) {
          if (!expectedCacheKeys.has(request.url)) {
            await cache.delete(request);
            deletedURLs.push(request.url);
          }
        }
        if (true) {
          printCleanupDetails(deletedURLs);
        }
        return { deletedURLs };
      });
    }
    /**
     * Returns a mapping of a precached URL to the corresponding cache key, taking
     * into account the revision information for the URL.
     *
     * @return {Map<string, string>} A URL to cache key mapping.
     */
    getURLsToCacheKeys() {
      return this._urlsToCacheKeys;
    }
    /**
     * Returns a list of all the URLs that have been precached by the current
     * service worker.
     *
     * @return {Array<string>} The precached URLs.
     */
    getCachedURLs() {
      return [...this._urlsToCacheKeys.keys()];
    }
    /**
     * Returns the cache key used for storing a given URL. If that URL is
     * unversioned, like `/index.html', then the cache key will be the original
     * URL with a search parameter appended to it.
     *
     * @param {string} url A URL whose cache key you want to look up.
     * @return {string} The versioned URL that corresponds to a cache key
     * for the original URL, or undefined if that URL isn't precached.
     */
    getCacheKeyForURL(url) {
      const urlObject = new URL(url, location.href);
      return this._urlsToCacheKeys.get(urlObject.href);
    }
    /**
     * @param {string} url A cache key whose SRI you want to look up.
     * @return {string} The subresource integrity associated with the cache key,
     * or undefined if it's not set.
     */
    getIntegrityForCacheKey(cacheKey) {
      return this._cacheKeysToIntegrities.get(cacheKey);
    }
    /**
     * This acts as a drop-in replacement for
     * [`cache.match()`](https://developer.mozilla.org/en-US/docs/Web/API/Cache/match)
     * with the following differences:
     *
     * - It knows what the name of the precache is, and only checks in that cache.
     * - It allows you to pass in an "original" URL without versioning parameters,
     * and it will automatically look up the correct cache key for the currently
     * active revision of that URL.
     *
     * E.g., `matchPrecache('index.html')` will find the correct precached
     * response for the currently active service worker, even if the actual cache
     * key is `'/index.html?__WB_REVISION__=1234abcd'`.
     *
     * @param {string|Request} request The key (without revisioning parameters)
     * to look up in the precache.
     * @return {Promise<Response|undefined>}
     */
    async matchPrecache(request) {
      const url = request instanceof Request ? request.url : request;
      const cacheKey = this.getCacheKeyForURL(url);
      if (cacheKey) {
        const cache = await self.caches.open(this.strategy.cacheName);
        return cache.match(cacheKey);
      }
      return void 0;
    }
    /**
     * Returns a function that looks up `url` in the precache (taking into
     * account revision information), and returns the corresponding `Response`.
     *
     * @param {string} url The precached URL which will be used to lookup the
     * `Response`.
     * @return {workbox-routing~handlerCallback}
     */
    createHandlerBoundToURL(url) {
      const cacheKey = this.getCacheKeyForURL(url);
      if (!cacheKey) {
        throw new WorkboxError("non-precached-url", { url });
      }
      return (options) => {
        options.request = new Request(url);
        options.params = Object.assign({ cacheKey }, options.params);
        return this.strategy.handle(options);
      };
    }
  };

  // node_modules/workbox-precaching/utils/getOrCreatePrecacheController.js
  var precacheController;
  var getOrCreatePrecacheController = () => {
    if (!precacheController) {
      precacheController = new PrecacheController();
    }
    return precacheController;
  };

  // node_modules/workbox-routing/_version.js
  try {
    self["workbox:routing:7.2.0"] && _();
  } catch (e) {
  }

  // node_modules/workbox-routing/utils/constants.js
  var defaultMethod = "GET";
  var validMethods = [
    "DELETE",
    "GET",
    "HEAD",
    "PATCH",
    "POST",
    "PUT"
  ];

  // node_modules/workbox-routing/utils/normalizeHandler.js
  var normalizeHandler = (handler) => {
    if (handler && typeof handler === "object") {
      if (true) {
        finalAssertExports.hasMethod(handler, "handle", {
          moduleName: "workbox-routing",
          className: "Route",
          funcName: "constructor",
          paramName: "handler"
        });
      }
      return handler;
    } else {
      if (true) {
        finalAssertExports.isType(handler, "function", {
          moduleName: "workbox-routing",
          className: "Route",
          funcName: "constructor",
          paramName: "handler"
        });
      }
      return { handle: handler };
    }
  };

  // node_modules/workbox-routing/Route.js
  var Route = class {
    /**
     * Constructor for Route class.
     *
     * @param {workbox-routing~matchCallback} match
     * A callback function that determines whether the route matches a given
     * `fetch` event by returning a non-falsy value.
     * @param {workbox-routing~handlerCallback} handler A callback
     * function that returns a Promise resolving to a Response.
     * @param {string} [method='GET'] The HTTP method to match the Route
     * against.
     */
    constructor(match, handler, method = defaultMethod) {
      if (true) {
        finalAssertExports.isType(match, "function", {
          moduleName: "workbox-routing",
          className: "Route",
          funcName: "constructor",
          paramName: "match"
        });
        if (method) {
          finalAssertExports.isOneOf(method, validMethods, { paramName: "method" });
        }
      }
      this.handler = normalizeHandler(handler);
      this.match = match;
      this.method = method;
    }
    /**
     *
     * @param {workbox-routing-handlerCallback} handler A callback
     * function that returns a Promise resolving to a Response
     */
    setCatchHandler(handler) {
      this.catchHandler = normalizeHandler(handler);
    }
  };

  // node_modules/workbox-routing/RegExpRoute.js
  var RegExpRoute = class extends Route {
    /**
     * If the regular expression contains
     * [capture groups]{@link https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/RegExp#grouping-back-references},
     * the captured values will be passed to the
     * {@link workbox-routing~handlerCallback} `params`
     * argument.
     *
     * @param {RegExp} regExp The regular expression to match against URLs.
     * @param {workbox-routing~handlerCallback} handler A callback
     * function that returns a Promise resulting in a Response.
     * @param {string} [method='GET'] The HTTP method to match the Route
     * against.
     */
    constructor(regExp, handler, method) {
      if (true) {
        finalAssertExports.isInstance(regExp, RegExp, {
          moduleName: "workbox-routing",
          className: "RegExpRoute",
          funcName: "constructor",
          paramName: "pattern"
        });
      }
      const match = ({ url }) => {
        const result = regExp.exec(url.href);
        if (!result) {
          return;
        }
        if (url.origin !== location.origin && result.index !== 0) {
          if (true) {
            logger.debug(`The regular expression '${regExp.toString()}' only partially matched against the cross-origin URL '${url.toString()}'. RegExpRoute's will only handle cross-origin requests if they match the entire URL.`);
          }
          return;
        }
        return result.slice(1);
      };
      super(match, handler, method);
    }
  };

  // node_modules/workbox-routing/Router.js
  var Router = class {
    /**
     * Initializes a new Router.
     */
    constructor() {
      this._routes = /* @__PURE__ */ new Map();
      this._defaultHandlerMap = /* @__PURE__ */ new Map();
    }
    /**
     * @return {Map<string, Array<workbox-routing.Route>>} routes A `Map` of HTTP
     * method name ('GET', etc.) to an array of all the corresponding `Route`
     * instances that are registered.
     */
    get routes() {
      return this._routes;
    }
    /**
     * Adds a fetch event listener to respond to events when a route matches
     * the event's request.
     */
    addFetchListener() {
      self.addEventListener("fetch", (event) => {
        const { request } = event;
        const responsePromise = this.handleRequest({ request, event });
        if (responsePromise) {
          event.respondWith(responsePromise);
        }
      });
    }
    /**
     * Adds a message event listener for URLs to cache from the window.
     * This is useful to cache resources loaded on the page prior to when the
     * service worker started controlling it.
     *
     * The format of the message data sent from the window should be as follows.
     * Where the `urlsToCache` array may consist of URL strings or an array of
     * URL string + `requestInit` object (the same as you'd pass to `fetch()`).
     *
     * ```
     * {
     *   type: 'CACHE_URLS',
     *   payload: {
     *     urlsToCache: [
     *       './script1.js',
     *       './script2.js',
     *       ['./script3.js', {mode: 'no-cors'}],
     *     ],
     *   },
     * }
     * ```
     */
    addCacheListener() {
      self.addEventListener("message", (event) => {
        if (event.data && event.data.type === "CACHE_URLS") {
          const { payload } = event.data;
          if (true) {
            logger.debug(`Caching URLs from the window`, payload.urlsToCache);
          }
          const requestPromises = Promise.all(payload.urlsToCache.map((entry) => {
            if (typeof entry === "string") {
              entry = [entry];
            }
            const request = new Request(...entry);
            return this.handleRequest({ request, event });
          }));
          event.waitUntil(requestPromises);
          if (event.ports && event.ports[0]) {
            void requestPromises.then(() => event.ports[0].postMessage(true));
          }
        }
      });
    }
    /**
     * Apply the routing rules to a FetchEvent object to get a Response from an
     * appropriate Route's handler.
     *
     * @param {Object} options
     * @param {Request} options.request The request to handle.
     * @param {ExtendableEvent} options.event The event that triggered the
     *     request.
     * @return {Promise<Response>|undefined} A promise is returned if a
     *     registered route can handle the request. If there is no matching
     *     route and there's no `defaultHandler`, `undefined` is returned.
     */
    handleRequest({ request, event }) {
      if (true) {
        finalAssertExports.isInstance(request, Request, {
          moduleName: "workbox-routing",
          className: "Router",
          funcName: "handleRequest",
          paramName: "options.request"
        });
      }
      const url = new URL(request.url, location.href);
      if (!url.protocol.startsWith("http")) {
        if (true) {
          logger.debug(`Workbox Router only supports URLs that start with 'http'.`);
        }
        return;
      }
      const sameOrigin = url.origin === location.origin;
      const { params, route } = this.findMatchingRoute({
        event,
        request,
        sameOrigin,
        url
      });
      let handler = route && route.handler;
      const debugMessages = [];
      if (true) {
        if (handler) {
          debugMessages.push([`Found a route to handle this request:`, route]);
          if (params) {
            debugMessages.push([
              `Passing the following params to the route's handler:`,
              params
            ]);
          }
        }
      }
      const method = request.method;
      if (!handler && this._defaultHandlerMap.has(method)) {
        if (true) {
          debugMessages.push(`Failed to find a matching route. Falling back to the default handler for ${method}.`);
        }
        handler = this._defaultHandlerMap.get(method);
      }
      if (!handler) {
        if (true) {
          logger.debug(`No route found for: ${getFriendlyURL(url)}`);
        }
        return;
      }
      if (true) {
        logger.groupCollapsed(`Router is responding to: ${getFriendlyURL(url)}`);
        debugMessages.forEach((msg) => {
          if (Array.isArray(msg)) {
            logger.log(...msg);
          } else {
            logger.log(msg);
          }
        });
        logger.groupEnd();
      }
      let responsePromise;
      try {
        responsePromise = handler.handle({ url, request, event, params });
      } catch (err) {
        responsePromise = Promise.reject(err);
      }
      const catchHandler = route && route.catchHandler;
      if (responsePromise instanceof Promise && (this._catchHandler || catchHandler)) {
        responsePromise = responsePromise.catch(async (err) => {
          if (catchHandler) {
            if (true) {
              logger.groupCollapsed(`Error thrown when responding to:  ${getFriendlyURL(url)}. Falling back to route's Catch Handler.`);
              logger.error(`Error thrown by:`, route);
              logger.error(err);
              logger.groupEnd();
            }
            try {
              return await catchHandler.handle({ url, request, event, params });
            } catch (catchErr) {
              if (catchErr instanceof Error) {
                err = catchErr;
              }
            }
          }
          if (this._catchHandler) {
            if (true) {
              logger.groupCollapsed(`Error thrown when responding to:  ${getFriendlyURL(url)}. Falling back to global Catch Handler.`);
              logger.error(`Error thrown by:`, route);
              logger.error(err);
              logger.groupEnd();
            }
            return this._catchHandler.handle({ url, request, event });
          }
          throw err;
        });
      }
      return responsePromise;
    }
    /**
     * Checks a request and URL (and optionally an event) against the list of
     * registered routes, and if there's a match, returns the corresponding
     * route along with any params generated by the match.
     *
     * @param {Object} options
     * @param {URL} options.url
     * @param {boolean} options.sameOrigin The result of comparing `url.origin`
     *     against the current origin.
     * @param {Request} options.request The request to match.
     * @param {Event} options.event The corresponding event.
     * @return {Object} An object with `route` and `params` properties.
     *     They are populated if a matching route was found or `undefined`
     *     otherwise.
     */
    findMatchingRoute({ url, sameOrigin, request, event }) {
      const routes = this._routes.get(request.method) || [];
      for (const route of routes) {
        let params;
        const matchResult = route.match({ url, sameOrigin, request, event });
        if (matchResult) {
          if (true) {
            if (matchResult instanceof Promise) {
              logger.warn(`While routing ${getFriendlyURL(url)}, an async matchCallback function was used. Please convert the following route to use a synchronous matchCallback function:`, route);
            }
          }
          params = matchResult;
          if (Array.isArray(params) && params.length === 0) {
            params = void 0;
          } else if (matchResult.constructor === Object && // eslint-disable-line
          Object.keys(matchResult).length === 0) {
            params = void 0;
          } else if (typeof matchResult === "boolean") {
            params = void 0;
          }
          return { route, params };
        }
      }
      return {};
    }
    /**
     * Define a default `handler` that's called when no routes explicitly
     * match the incoming request.
     *
     * Each HTTP method ('GET', 'POST', etc.) gets its own default handler.
     *
     * Without a default handler, unmatched requests will go against the
     * network as if there were no service worker present.
     *
     * @param {workbox-routing~handlerCallback} handler A callback
     * function that returns a Promise resulting in a Response.
     * @param {string} [method='GET'] The HTTP method to associate with this
     * default handler. Each method has its own default.
     */
    setDefaultHandler(handler, method = defaultMethod) {
      this._defaultHandlerMap.set(method, normalizeHandler(handler));
    }
    /**
     * If a Route throws an error while handling a request, this `handler`
     * will be called and given a chance to provide a response.
     *
     * @param {workbox-routing~handlerCallback} handler A callback
     * function that returns a Promise resulting in a Response.
     */
    setCatchHandler(handler) {
      this._catchHandler = normalizeHandler(handler);
    }
    /**
     * Registers a route with the router.
     *
     * @param {workbox-routing.Route} route The route to register.
     */
    registerRoute(route) {
      if (true) {
        finalAssertExports.isType(route, "object", {
          moduleName: "workbox-routing",
          className: "Router",
          funcName: "registerRoute",
          paramName: "route"
        });
        finalAssertExports.hasMethod(route, "match", {
          moduleName: "workbox-routing",
          className: "Router",
          funcName: "registerRoute",
          paramName: "route"
        });
        finalAssertExports.isType(route.handler, "object", {
          moduleName: "workbox-routing",
          className: "Router",
          funcName: "registerRoute",
          paramName: "route"
        });
        finalAssertExports.hasMethod(route.handler, "handle", {
          moduleName: "workbox-routing",
          className: "Router",
          funcName: "registerRoute",
          paramName: "route.handler"
        });
        finalAssertExports.isType(route.method, "string", {
          moduleName: "workbox-routing",
          className: "Router",
          funcName: "registerRoute",
          paramName: "route.method"
        });
      }
      if (!this._routes.has(route.method)) {
        this._routes.set(route.method, []);
      }
      this._routes.get(route.method).push(route);
    }
    /**
     * Unregisters a route with the router.
     *
     * @param {workbox-routing.Route} route The route to unregister.
     */
    unregisterRoute(route) {
      if (!this._routes.has(route.method)) {
        throw new WorkboxError("unregister-route-but-not-found-with-method", {
          method: route.method
        });
      }
      const routeIndex = this._routes.get(route.method).indexOf(route);
      if (routeIndex > -1) {
        this._routes.get(route.method).splice(routeIndex, 1);
      } else {
        throw new WorkboxError("unregister-route-route-not-registered");
      }
    }
  };

  // node_modules/workbox-routing/utils/getOrCreateDefaultRouter.js
  var defaultRouter;
  var getOrCreateDefaultRouter = () => {
    if (!defaultRouter) {
      defaultRouter = new Router();
      defaultRouter.addFetchListener();
      defaultRouter.addCacheListener();
    }
    return defaultRouter;
  };

  // node_modules/workbox-routing/registerRoute.js
  function registerRoute(capture, handler, method) {
    let route;
    if (typeof capture === "string") {
      const captureUrl = new URL(capture, location.href);
      if (true) {
        if (!(capture.startsWith("/") || capture.startsWith("http"))) {
          throw new WorkboxError("invalid-string", {
            moduleName: "workbox-routing",
            funcName: "registerRoute",
            paramName: "capture"
          });
        }
        const valueToCheck = capture.startsWith("http") ? captureUrl.pathname : capture;
        const wildcards = "[*:?+]";
        if (new RegExp(`${wildcards}`).exec(valueToCheck)) {
          logger.debug(`The '$capture' parameter contains an Express-style wildcard character (${wildcards}). Strings are now always interpreted as exact matches; use a RegExp for partial or wildcard matches.`);
        }
      }
      const matchCallback = ({ url }) => {
        if (true) {
          if (url.pathname === captureUrl.pathname && url.origin !== captureUrl.origin) {
            logger.debug(`${capture} only partially matches the cross-origin URL ${url.toString()}. This route will only handle cross-origin requests if they match the entire URL.`);
          }
        }
        return url.href === captureUrl.href;
      };
      route = new Route(matchCallback, handler, method);
    } else if (capture instanceof RegExp) {
      route = new RegExpRoute(capture, handler, method);
    } else if (typeof capture === "function") {
      route = new Route(capture, handler, method);
    } else if (capture instanceof Route) {
      route = capture;
    } else {
      throw new WorkboxError("unsupported-route-type", {
        moduleName: "workbox-routing",
        funcName: "registerRoute",
        paramName: "capture"
      });
    }
    const defaultRouter2 = getOrCreateDefaultRouter();
    defaultRouter2.registerRoute(route);
    return route;
  }

  // node_modules/workbox-precaching/utils/removeIgnoredSearchParams.js
  function removeIgnoredSearchParams(urlObject, ignoreURLParametersMatching = []) {
    for (const paramName of [...urlObject.searchParams.keys()]) {
      if (ignoreURLParametersMatching.some((regExp) => regExp.test(paramName))) {
        urlObject.searchParams.delete(paramName);
      }
    }
    return urlObject;
  }

  // node_modules/workbox-precaching/utils/generateURLVariations.js
  function* generateURLVariations(url, { ignoreURLParametersMatching = [/^utm_/, /^fbclid$/], directoryIndex = "index.html", cleanURLs = true, urlManipulation } = {}) {
    const urlObject = new URL(url, location.href);
    urlObject.hash = "";
    yield urlObject.href;
    const urlWithoutIgnoredParams = removeIgnoredSearchParams(urlObject, ignoreURLParametersMatching);
    yield urlWithoutIgnoredParams.href;
    if (directoryIndex && urlWithoutIgnoredParams.pathname.endsWith("/")) {
      const directoryURL = new URL(urlWithoutIgnoredParams.href);
      directoryURL.pathname += directoryIndex;
      yield directoryURL.href;
    }
    if (cleanURLs) {
      const cleanURL = new URL(urlWithoutIgnoredParams.href);
      cleanURL.pathname += ".html";
      yield cleanURL.href;
    }
    if (urlManipulation) {
      const additionalURLs = urlManipulation({ url: urlObject });
      for (const urlToAttempt of additionalURLs) {
        yield urlToAttempt.href;
      }
    }
  }

  // node_modules/workbox-precaching/PrecacheRoute.js
  var PrecacheRoute = class extends Route {
    /**
     * @param {PrecacheController} precacheController A `PrecacheController`
     * instance used to both match requests and respond to fetch events.
     * @param {Object} [options] Options to control how requests are matched
     * against the list of precached URLs.
     * @param {string} [options.directoryIndex=index.html] The `directoryIndex` will
     * check cache entries for a URLs ending with '/' to see if there is a hit when
     * appending the `directoryIndex` value.
     * @param {Array<RegExp>} [options.ignoreURLParametersMatching=[/^utm_/, /^fbclid$/]] An
     * array of regex's to remove search params when looking for a cache match.
     * @param {boolean} [options.cleanURLs=true] The `cleanURLs` option will
     * check the cache for the URL with a `.html` added to the end of the end.
     * @param {workbox-precaching~urlManipulation} [options.urlManipulation]
     * This is a function that should take a URL and return an array of
     * alternative URLs that should be checked for precache matches.
     */
    constructor(precacheController2, options) {
      const match = ({ request }) => {
        const urlsToCacheKeys = precacheController2.getURLsToCacheKeys();
        for (const possibleURL of generateURLVariations(request.url, options)) {
          const cacheKey = urlsToCacheKeys.get(possibleURL);
          if (cacheKey) {
            const integrity = precacheController2.getIntegrityForCacheKey(cacheKey);
            return { cacheKey, integrity };
          }
        }
        if (true) {
          logger.debug(`Precaching did not find a match for ` + getFriendlyURL(request.url));
        }
        return;
      };
      super(match, precacheController2.strategy);
    }
  };

  // node_modules/workbox-precaching/addRoute.js
  function addRoute(options) {
    const precacheController2 = getOrCreatePrecacheController();
    const precacheRoute = new PrecacheRoute(precacheController2, options);
    registerRoute(precacheRoute);
  }

  // node_modules/workbox-precaching/utils/deleteOutdatedCaches.js
  var SUBSTRING_TO_FIND = "-precache-";
  var deleteOutdatedCaches = async (currentPrecacheName, substringToFind = SUBSTRING_TO_FIND) => {
    const cacheNames3 = await self.caches.keys();
    const cacheNamesToDelete = cacheNames3.filter((cacheName) => {
      return cacheName.includes(substringToFind) && cacheName.includes(self.registration.scope) && cacheName !== currentPrecacheName;
    });
    await Promise.all(cacheNamesToDelete.map((cacheName) => self.caches.delete(cacheName)));
    return cacheNamesToDelete;
  };

  // node_modules/workbox-precaching/cleanupOutdatedCaches.js
  function cleanupOutdatedCaches() {
    self.addEventListener("activate", (event) => {
      const cacheName = cacheNames.getPrecacheName();
      event.waitUntil(deleteOutdatedCaches(cacheName).then((cachesDeleted) => {
        if (true) {
          if (cachesDeleted.length > 0) {
            logger.log(`The following out-of-date precaches were cleaned up automatically:`, cachesDeleted);
          }
        }
      }));
    });
  }

  // node_modules/workbox-precaching/precache.js
  function precache(entries) {
    const precacheController2 = getOrCreatePrecacheController();
    precacheController2.precache(entries);
  }

  // node_modules/workbox-precaching/precacheAndRoute.js
  function precacheAndRoute(entries, options) {
    precache(entries);
    addRoute(options);
  }

  // node_modules/workbox-strategies/utils/messages.js
  var messages2 = {
    strategyStart: (strategyName, request) => `Using ${strategyName} to respond to '${getFriendlyURL(request.url)}'`,
    printFinalResponse: (response) => {
      if (response) {
        logger.groupCollapsed(`View the final response here.`);
        logger.log(response || "[No response returned]");
        logger.groupEnd();
      }
    }
  };

  // node_modules/workbox-strategies/plugins/cacheOkAndOpaquePlugin.js
  var cacheOkAndOpaquePlugin = {
    /**
     * Returns a valid response (to allow caching) if the status is 200 (OK) or
     * 0 (opaque).
     *
     * @param {Object} options
     * @param {Response} options.response
     * @return {Response|null}
     *
     * @private
     */
    cacheWillUpdate: async ({ response }) => {
      if (response.status === 200 || response.status === 0) {
        return response;
      }
      return null;
    }
  };

  // node_modules/workbox-strategies/StaleWhileRevalidate.js
  var StaleWhileRevalidate = class extends Strategy {
    /**
     * @param {Object} [options]
     * @param {string} [options.cacheName] Cache name to store and retrieve
     * requests. Defaults to cache names provided by
     * {@link workbox-core.cacheNames}.
     * @param {Array<Object>} [options.plugins] [Plugins]{@link https://developers.google.com/web/tools/workbox/guides/using-plugins}
     * to use in conjunction with this caching strategy.
     * @param {Object} [options.fetchOptions] Values passed along to the
     * [`init`](https://developer.mozilla.org/en-US/docs/Web/API/WindowOrWorkerGlobalScope/fetch#Parameters)
     * of [non-navigation](https://github.com/GoogleChrome/workbox/issues/1796)
     * `fetch()` requests made by this strategy.
     * @param {Object} [options.matchOptions] [`CacheQueryOptions`](https://w3c.github.io/ServiceWorker/#dictdef-cachequeryoptions)
     */
    constructor(options = {}) {
      super(options);
      if (!this.plugins.some((p) => "cacheWillUpdate" in p)) {
        this.plugins.unshift(cacheOkAndOpaquePlugin);
      }
    }
    /**
     * @private
     * @param {Request|string} request A request to run this strategy for.
     * @param {workbox-strategies.StrategyHandler} handler The event that
     *     triggered the request.
     * @return {Promise<Response>}
     */
    async _handle(request, handler) {
      const logs = [];
      if (true) {
        finalAssertExports.isInstance(request, Request, {
          moduleName: "workbox-strategies",
          className: this.constructor.name,
          funcName: "handle",
          paramName: "request"
        });
      }
      const fetchAndCachePromise = handler.fetchAndCachePut(request).catch(() => {
      });
      void handler.waitUntil(fetchAndCachePromise);
      let response = await handler.cacheMatch(request);
      let error;
      if (response) {
        if (true) {
          logs.push(`Found a cached response in the '${this.cacheName}' cache. Will update with the network response in the background.`);
        }
      } else {
        if (true) {
          logs.push(`No response found in the '${this.cacheName}' cache. Will wait for the network response.`);
        }
        try {
          response = await fetchAndCachePromise;
        } catch (err) {
          if (err instanceof Error) {
            error = err;
          }
        }
      }
      if (true) {
        logger.groupCollapsed(messages2.strategyStart(this.constructor.name, request));
        for (const log of logs) {
          logger.log(log);
        }
        messages2.printFinalResponse(response);
        logger.groupEnd();
      }
      if (!response) {
        throw new WorkboxError("no-response", { url: request.url, error });
      }
      return response;
    }
  };

  // node_modules/idb/build/wrap-idb-value.js
  var instanceOfAny = (object, constructors) => constructors.some((c) => object instanceof c);
  var idbProxyableTypes;
  var cursorAdvanceMethods;
  function getIdbProxyableTypes() {
    return idbProxyableTypes || (idbProxyableTypes = [
      IDBDatabase,
      IDBObjectStore,
      IDBIndex,
      IDBCursor,
      IDBTransaction
    ]);
  }
  function getCursorAdvanceMethods() {
    return cursorAdvanceMethods || (cursorAdvanceMethods = [
      IDBCursor.prototype.advance,
      IDBCursor.prototype.continue,
      IDBCursor.prototype.continuePrimaryKey
    ]);
  }
  var cursorRequestMap = /* @__PURE__ */ new WeakMap();
  var transactionDoneMap = /* @__PURE__ */ new WeakMap();
  var transactionStoreNamesMap = /* @__PURE__ */ new WeakMap();
  var transformCache = /* @__PURE__ */ new WeakMap();
  var reverseTransformCache = /* @__PURE__ */ new WeakMap();
  function promisifyRequest(request) {
    const promise = new Promise((resolve, reject) => {
      const unlisten = () => {
        request.removeEventListener("success", success);
        request.removeEventListener("error", error);
      };
      const success = () => {
        resolve(wrap(request.result));
        unlisten();
      };
      const error = () => {
        reject(request.error);
        unlisten();
      };
      request.addEventListener("success", success);
      request.addEventListener("error", error);
    });
    promise.then((value) => {
      if (value instanceof IDBCursor) {
        cursorRequestMap.set(value, request);
      }
    }).catch(() => {
    });
    reverseTransformCache.set(promise, request);
    return promise;
  }
  function cacheDonePromiseForTransaction(tx) {
    if (transactionDoneMap.has(tx))
      return;
    const done = new Promise((resolve, reject) => {
      const unlisten = () => {
        tx.removeEventListener("complete", complete);
        tx.removeEventListener("error", error);
        tx.removeEventListener("abort", error);
      };
      const complete = () => {
        resolve();
        unlisten();
      };
      const error = () => {
        reject(tx.error || new DOMException("AbortError", "AbortError"));
        unlisten();
      };
      tx.addEventListener("complete", complete);
      tx.addEventListener("error", error);
      tx.addEventListener("abort", error);
    });
    transactionDoneMap.set(tx, done);
  }
  var idbProxyTraps = {
    get(target, prop, receiver) {
      if (target instanceof IDBTransaction) {
        if (prop === "done")
          return transactionDoneMap.get(target);
        if (prop === "objectStoreNames") {
          return target.objectStoreNames || transactionStoreNamesMap.get(target);
        }
        if (prop === "store") {
          return receiver.objectStoreNames[1] ? void 0 : receiver.objectStore(receiver.objectStoreNames[0]);
        }
      }
      return wrap(target[prop]);
    },
    set(target, prop, value) {
      target[prop] = value;
      return true;
    },
    has(target, prop) {
      if (target instanceof IDBTransaction && (prop === "done" || prop === "store")) {
        return true;
      }
      return prop in target;
    }
  };
  function replaceTraps(callback) {
    idbProxyTraps = callback(idbProxyTraps);
  }
  function wrapFunction(func) {
    if (func === IDBDatabase.prototype.transaction && !("objectStoreNames" in IDBTransaction.prototype)) {
      return function(storeNames, ...args) {
        const tx = func.call(unwrap(this), storeNames, ...args);
        transactionStoreNamesMap.set(tx, storeNames.sort ? storeNames.sort() : [storeNames]);
        return wrap(tx);
      };
    }
    if (getCursorAdvanceMethods().includes(func)) {
      return function(...args) {
        func.apply(unwrap(this), args);
        return wrap(cursorRequestMap.get(this));
      };
    }
    return function(...args) {
      return wrap(func.apply(unwrap(this), args));
    };
  }
  function transformCachableValue(value) {
    if (typeof value === "function")
      return wrapFunction(value);
    if (value instanceof IDBTransaction)
      cacheDonePromiseForTransaction(value);
    if (instanceOfAny(value, getIdbProxyableTypes()))
      return new Proxy(value, idbProxyTraps);
    return value;
  }
  function wrap(value) {
    if (value instanceof IDBRequest)
      return promisifyRequest(value);
    if (transformCache.has(value))
      return transformCache.get(value);
    const newValue = transformCachableValue(value);
    if (newValue !== value) {
      transformCache.set(value, newValue);
      reverseTransformCache.set(newValue, value);
    }
    return newValue;
  }
  var unwrap = (value) => reverseTransformCache.get(value);

  // node_modules/idb/build/index.js
  function openDB(name, version, { blocked, upgrade, blocking, terminated } = {}) {
    const request = indexedDB.open(name, version);
    const openPromise = wrap(request);
    if (upgrade) {
      request.addEventListener("upgradeneeded", (event) => {
        upgrade(wrap(request.result), event.oldVersion, event.newVersion, wrap(request.transaction), event);
      });
    }
    if (blocked) {
      request.addEventListener("blocked", (event) => blocked(
        // Casting due to https://github.com/microsoft/TypeScript-DOM-lib-generator/pull/1405
        event.oldVersion,
        event.newVersion,
        event
      ));
    }
    openPromise.then((db) => {
      if (terminated)
        db.addEventListener("close", () => terminated());
      if (blocking) {
        db.addEventListener("versionchange", (event) => blocking(event.oldVersion, event.newVersion, event));
      }
    }).catch(() => {
    });
    return openPromise;
  }
  function deleteDB(name, { blocked } = {}) {
    const request = indexedDB.deleteDatabase(name);
    if (blocked) {
      request.addEventListener("blocked", (event) => blocked(
        // Casting due to https://github.com/microsoft/TypeScript-DOM-lib-generator/pull/1405
        event.oldVersion,
        event
      ));
    }
    return wrap(request).then(() => void 0);
  }
  var readMethods = ["get", "getKey", "getAll", "getAllKeys", "count"];
  var writeMethods = ["put", "add", "delete", "clear"];
  var cachedMethods = /* @__PURE__ */ new Map();
  function getMethod(target, prop) {
    if (!(target instanceof IDBDatabase && !(prop in target) && typeof prop === "string")) {
      return;
    }
    if (cachedMethods.get(prop))
      return cachedMethods.get(prop);
    const targetFuncName = prop.replace(/FromIndex$/, "");
    const useIndex = prop !== targetFuncName;
    const isWrite = writeMethods.includes(targetFuncName);
    if (
      // Bail if the target doesn't exist on the target. Eg, getAll isn't in Edge.
      !(targetFuncName in (useIndex ? IDBIndex : IDBObjectStore).prototype) || !(isWrite || readMethods.includes(targetFuncName))
    ) {
      return;
    }
    const method = async function(storeName, ...args) {
      const tx = this.transaction(storeName, isWrite ? "readwrite" : "readonly");
      let target2 = tx.store;
      if (useIndex)
        target2 = target2.index(args.shift());
      return (await Promise.all([
        target2[targetFuncName](...args),
        isWrite && tx.done
      ]))[0];
    };
    cachedMethods.set(prop, method);
    return method;
  }
  replaceTraps((oldTraps) => ({
    ...oldTraps,
    get: (target, prop, receiver) => getMethod(target, prop) || oldTraps.get(target, prop, receiver),
    has: (target, prop) => !!getMethod(target, prop) || oldTraps.has(target, prop)
  }));

  // node_modules/workbox-expiration/_version.js
  try {
    self["workbox:expiration:7.2.0"] && _();
  } catch (e) {
  }

  // node_modules/workbox-expiration/models/CacheTimestampsModel.js
  var DB_NAME = "workbox-expiration";
  var CACHE_OBJECT_STORE = "cache-entries";
  var normalizeURL = (unNormalizedUrl) => {
    const url = new URL(unNormalizedUrl, location.href);
    url.hash = "";
    return url.href;
  };
  var CacheTimestampsModel = class {
    /**
     *
     * @param {string} cacheName
     *
     * @private
     */
    constructor(cacheName) {
      this._db = null;
      this._cacheName = cacheName;
    }
    /**
     * Performs an upgrade of indexedDB.
     *
     * @param {IDBPDatabase<CacheDbSchema>} db
     *
     * @private
     */
    _upgradeDb(db) {
      const objStore = db.createObjectStore(CACHE_OBJECT_STORE, { keyPath: "id" });
      objStore.createIndex("cacheName", "cacheName", { unique: false });
      objStore.createIndex("timestamp", "timestamp", { unique: false });
    }
    /**
     * Performs an upgrade of indexedDB and deletes deprecated DBs.
     *
     * @param {IDBPDatabase<CacheDbSchema>} db
     *
     * @private
     */
    _upgradeDbAndDeleteOldDbs(db) {
      this._upgradeDb(db);
      if (this._cacheName) {
        void deleteDB(this._cacheName);
      }
    }
    /**
     * @param {string} url
     * @param {number} timestamp
     *
     * @private
     */
    async setTimestamp(url, timestamp) {
      url = normalizeURL(url);
      const entry = {
        url,
        timestamp,
        cacheName: this._cacheName,
        // Creating an ID from the URL and cache name won't be necessary once
        // Edge switches to Chromium and all browsers we support work with
        // array keyPaths.
        id: this._getId(url)
      };
      const db = await this.getDb();
      const tx = db.transaction(CACHE_OBJECT_STORE, "readwrite", {
        durability: "relaxed"
      });
      await tx.store.put(entry);
      await tx.done;
    }
    /**
     * Returns the timestamp stored for a given URL.
     *
     * @param {string} url
     * @return {number | undefined}
     *
     * @private
     */
    async getTimestamp(url) {
      const db = await this.getDb();
      const entry = await db.get(CACHE_OBJECT_STORE, this._getId(url));
      return entry === null || entry === void 0 ? void 0 : entry.timestamp;
    }
    /**
     * Iterates through all the entries in the object store (from newest to
     * oldest) and removes entries once either `maxCount` is reached or the
     * entry's timestamp is less than `minTimestamp`.
     *
     * @param {number} minTimestamp
     * @param {number} maxCount
     * @return {Array<string>}
     *
     * @private
     */
    async expireEntries(minTimestamp, maxCount) {
      const db = await this.getDb();
      let cursor = await db.transaction(CACHE_OBJECT_STORE).store.index("timestamp").openCursor(null, "prev");
      const entriesToDelete = [];
      let entriesNotDeletedCount = 0;
      while (cursor) {
        const result = cursor.value;
        if (result.cacheName === this._cacheName) {
          if (minTimestamp && result.timestamp < minTimestamp || maxCount && entriesNotDeletedCount >= maxCount) {
            entriesToDelete.push(cursor.value);
          } else {
            entriesNotDeletedCount++;
          }
        }
        cursor = await cursor.continue();
      }
      const urlsDeleted = [];
      for (const entry of entriesToDelete) {
        await db.delete(CACHE_OBJECT_STORE, entry.id);
        urlsDeleted.push(entry.url);
      }
      return urlsDeleted;
    }
    /**
     * Takes a URL and returns an ID that will be unique in the object store.
     *
     * @param {string} url
     * @return {string}
     *
     * @private
     */
    _getId(url) {
      return this._cacheName + "|" + normalizeURL(url);
    }
    /**
     * Returns an open connection to the database.
     *
     * @private
     */
    async getDb() {
      if (!this._db) {
        this._db = await openDB(DB_NAME, 1, {
          upgrade: this._upgradeDbAndDeleteOldDbs.bind(this)
        });
      }
      return this._db;
    }
  };

  // node_modules/workbox-expiration/CacheExpiration.js
  var CacheExpiration = class {
    /**
     * To construct a new CacheExpiration instance you must provide at least
     * one of the `config` properties.
     *
     * @param {string} cacheName Name of the cache to apply restrictions to.
     * @param {Object} config
     * @param {number} [config.maxEntries] The maximum number of entries to cache.
     * Entries used the least will be removed as the maximum is reached.
     * @param {number} [config.maxAgeSeconds] The maximum age of an entry before
     * it's treated as stale and removed.
     * @param {Object} [config.matchOptions] The [`CacheQueryOptions`](https://developer.mozilla.org/en-US/docs/Web/API/Cache/delete#Parameters)
     * that will be used when calling `delete()` on the cache.
     */
    constructor(cacheName, config = {}) {
      this._isRunning = false;
      this._rerunRequested = false;
      if (true) {
        finalAssertExports.isType(cacheName, "string", {
          moduleName: "workbox-expiration",
          className: "CacheExpiration",
          funcName: "constructor",
          paramName: "cacheName"
        });
        if (!(config.maxEntries || config.maxAgeSeconds)) {
          throw new WorkboxError("max-entries-or-age-required", {
            moduleName: "workbox-expiration",
            className: "CacheExpiration",
            funcName: "constructor"
          });
        }
        if (config.maxEntries) {
          finalAssertExports.isType(config.maxEntries, "number", {
            moduleName: "workbox-expiration",
            className: "CacheExpiration",
            funcName: "constructor",
            paramName: "config.maxEntries"
          });
        }
        if (config.maxAgeSeconds) {
          finalAssertExports.isType(config.maxAgeSeconds, "number", {
            moduleName: "workbox-expiration",
            className: "CacheExpiration",
            funcName: "constructor",
            paramName: "config.maxAgeSeconds"
          });
        }
      }
      this._maxEntries = config.maxEntries;
      this._maxAgeSeconds = config.maxAgeSeconds;
      this._matchOptions = config.matchOptions;
      this._cacheName = cacheName;
      this._timestampModel = new CacheTimestampsModel(cacheName);
    }
    /**
     * Expires entries for the given cache and given criteria.
     */
    async expireEntries() {
      if (this._isRunning) {
        this._rerunRequested = true;
        return;
      }
      this._isRunning = true;
      const minTimestamp = this._maxAgeSeconds ? Date.now() - this._maxAgeSeconds * 1e3 : 0;
      const urlsExpired = await this._timestampModel.expireEntries(minTimestamp, this._maxEntries);
      const cache = await self.caches.open(this._cacheName);
      for (const url of urlsExpired) {
        await cache.delete(url, this._matchOptions);
      }
      if (true) {
        if (urlsExpired.length > 0) {
          logger.groupCollapsed(`Expired ${urlsExpired.length} ${urlsExpired.length === 1 ? "entry" : "entries"} and removed ${urlsExpired.length === 1 ? "it" : "them"} from the '${this._cacheName}' cache.`);
          logger.log(`Expired the following ${urlsExpired.length === 1 ? "URL" : "URLs"}:`);
          urlsExpired.forEach((url) => logger.log(`    ${url}`));
          logger.groupEnd();
        } else {
          logger.debug(`Cache expiration ran and found no entries to remove.`);
        }
      }
      this._isRunning = false;
      if (this._rerunRequested) {
        this._rerunRequested = false;
        dontWaitFor(this.expireEntries());
      }
    }
    /**
     * Update the timestamp for the given URL. This ensures the when
     * removing entries based on maximum entries, most recently used
     * is accurate or when expiring, the timestamp is up-to-date.
     *
     * @param {string} url
     */
    async updateTimestamp(url) {
      if (true) {
        finalAssertExports.isType(url, "string", {
          moduleName: "workbox-expiration",
          className: "CacheExpiration",
          funcName: "updateTimestamp",
          paramName: "url"
        });
      }
      await this._timestampModel.setTimestamp(url, Date.now());
    }
    /**
     * Can be used to check if a URL has expired or not before it's used.
     *
     * This requires a look up from IndexedDB, so can be slow.
     *
     * Note: This method will not remove the cached entry, call
     * `expireEntries()` to remove indexedDB and Cache entries.
     *
     * @param {string} url
     * @return {boolean}
     */
    async isURLExpired(url) {
      if (!this._maxAgeSeconds) {
        if (true) {
          throw new WorkboxError(`expired-test-without-max-age`, {
            methodName: "isURLExpired",
            paramName: "maxAgeSeconds"
          });
        }
        return false;
      } else {
        const timestamp = await this._timestampModel.getTimestamp(url);
        const expireOlderThan = Date.now() - this._maxAgeSeconds * 1e3;
        return timestamp !== void 0 ? timestamp < expireOlderThan : true;
      }
    }
    /**
     * Removes the IndexedDB object store used to keep track of cache expiration
     * metadata.
     */
    async delete() {
      this._rerunRequested = false;
      await this._timestampModel.expireEntries(Infinity);
    }
  };

  // node_modules/workbox-expiration/ExpirationPlugin.js
  var ExpirationPlugin = class {
    /**
     * @param {ExpirationPluginOptions} config
     * @param {number} [config.maxEntries] The maximum number of entries to cache.
     * Entries used the least will be removed as the maximum is reached.
     * @param {number} [config.maxAgeSeconds] The maximum age of an entry before
     * it's treated as stale and removed.
     * @param {Object} [config.matchOptions] The [`CacheQueryOptions`](https://developer.mozilla.org/en-US/docs/Web/API/Cache/delete#Parameters)
     * that will be used when calling `delete()` on the cache.
     * @param {boolean} [config.purgeOnQuotaError] Whether to opt this cache in to
     * automatic deletion if the available storage quota has been exceeded.
     */
    constructor(config = {}) {
      this.cachedResponseWillBeUsed = async ({ event, request, cacheName, cachedResponse }) => {
        if (!cachedResponse) {
          return null;
        }
        const isFresh = this._isResponseDateFresh(cachedResponse);
        const cacheExpiration = this._getCacheExpiration(cacheName);
        dontWaitFor(cacheExpiration.expireEntries());
        const updateTimestampDone = cacheExpiration.updateTimestamp(request.url);
        if (event) {
          try {
            event.waitUntil(updateTimestampDone);
          } catch (error) {
            if (true) {
              if ("request" in event) {
                logger.warn(`Unable to ensure service worker stays alive when updating cache entry for '${getFriendlyURL(event.request.url)}'.`);
              }
            }
          }
        }
        return isFresh ? cachedResponse : null;
      };
      this.cacheDidUpdate = async ({ cacheName, request }) => {
        if (true) {
          finalAssertExports.isType(cacheName, "string", {
            moduleName: "workbox-expiration",
            className: "Plugin",
            funcName: "cacheDidUpdate",
            paramName: "cacheName"
          });
          finalAssertExports.isInstance(request, Request, {
            moduleName: "workbox-expiration",
            className: "Plugin",
            funcName: "cacheDidUpdate",
            paramName: "request"
          });
        }
        const cacheExpiration = this._getCacheExpiration(cacheName);
        await cacheExpiration.updateTimestamp(request.url);
        await cacheExpiration.expireEntries();
      };
      if (true) {
        if (!(config.maxEntries || config.maxAgeSeconds)) {
          throw new WorkboxError("max-entries-or-age-required", {
            moduleName: "workbox-expiration",
            className: "Plugin",
            funcName: "constructor"
          });
        }
        if (config.maxEntries) {
          finalAssertExports.isType(config.maxEntries, "number", {
            moduleName: "workbox-expiration",
            className: "Plugin",
            funcName: "constructor",
            paramName: "config.maxEntries"
          });
        }
        if (config.maxAgeSeconds) {
          finalAssertExports.isType(config.maxAgeSeconds, "number", {
            moduleName: "workbox-expiration",
            className: "Plugin",
            funcName: "constructor",
            paramName: "config.maxAgeSeconds"
          });
        }
      }
      this._config = config;
      this._maxAgeSeconds = config.maxAgeSeconds;
      this._cacheExpirations = /* @__PURE__ */ new Map();
      if (config.purgeOnQuotaError) {
        registerQuotaErrorCallback(() => this.deleteCacheAndMetadata());
      }
    }
    /**
     * A simple helper method to return a CacheExpiration instance for a given
     * cache name.
     *
     * @param {string} cacheName
     * @return {CacheExpiration}
     *
     * @private
     */
    _getCacheExpiration(cacheName) {
      if (cacheName === cacheNames.getRuntimeName()) {
        throw new WorkboxError("expire-custom-caches-only");
      }
      let cacheExpiration = this._cacheExpirations.get(cacheName);
      if (!cacheExpiration) {
        cacheExpiration = new CacheExpiration(cacheName, this._config);
        this._cacheExpirations.set(cacheName, cacheExpiration);
      }
      return cacheExpiration;
    }
    /**
     * @param {Response} cachedResponse
     * @return {boolean}
     *
     * @private
     */
    _isResponseDateFresh(cachedResponse) {
      if (!this._maxAgeSeconds) {
        return true;
      }
      const dateHeaderTimestamp = this._getDateHeaderTimestamp(cachedResponse);
      if (dateHeaderTimestamp === null) {
        return true;
      }
      const now = Date.now();
      return dateHeaderTimestamp >= now - this._maxAgeSeconds * 1e3;
    }
    /**
     * This method will extract the data header and parse it into a useful
     * value.
     *
     * @param {Response} cachedResponse
     * @return {number|null}
     *
     * @private
     */
    _getDateHeaderTimestamp(cachedResponse) {
      if (!cachedResponse.headers.has("date")) {
        return null;
      }
      const dateHeader = cachedResponse.headers.get("date");
      const parsedDate = new Date(dateHeader);
      const headerTime = parsedDate.getTime();
      if (isNaN(headerTime)) {
        return null;
      }
      return headerTime;
    }
    /**
     * This is a helper method that performs two operations:
     *
     * - Deletes *all* the underlying Cache instances associated with this plugin
     * instance, by calling caches.delete() on your behalf.
     * - Deletes the metadata from IndexedDB used to keep track of expiration
     * details for each Cache instance.
     *
     * When using cache expiration, calling this method is preferable to calling
     * `caches.delete()` directly, since this will ensure that the IndexedDB
     * metadata is also cleanly removed and open IndexedDB instances are deleted.
     *
     * Note that if you're *not* using cache expiration for a given cache, calling
     * `caches.delete()` and passing in the cache's name should be sufficient.
     * There is no Workbox-specific method needed for cleanup in that case.
     */
    async deleteCacheAndMetadata() {
      for (const [cacheName, cacheExpiration] of this._cacheExpirations) {
        await self.caches.delete(cacheName);
        await cacheExpiration.delete();
      }
      this._cacheExpirations = /* @__PURE__ */ new Map();
    }
  };

  // src-pwa/custom-service-worker.js
  self.skipWaiting();
  clientsClaim();
  precacheAndRoute(self.__WB_MANIFEST);
  cleanupOutdatedCaches();
  registerRoute(
    ({ url }) => url.origin === "https://nuxt.meidanm.com" && (url.pathname === "/wp-json/wc/store/v1/products" || url.pathname === "/wp-json/wc/store/v1/products/categories") && url.searchParams.has("per_page"),
    new StaleWhileRevalidate({
      cacheName: "woocommerce-api",
      plugins: [
        new ExpirationPlugin({
          maxEntries: 50,
          maxAgeSeconds: 24 * 60 * 60
          // 1 day
        })
      ]
    })
  );
  registerRoute(
    ({ url }) => url.origin === "https://nuxt.meidanm.com" && url.pathname === "/wp-json/custom/v1/seo" && url.searchParams.has("path"),
    new StaleWhileRevalidate({
      cacheName: "seo-api",
      plugins: [
        new ExpirationPlugin({
          maxEntries: 50,
          maxAgeSeconds: 24 * 60 * 60
          // 1 day
        })
      ]
    })
  );
  self.addEventListener("install", () => {
    console.log("\u{1F6E0}\uFE0F Service Worker installing");
    self.skipWaiting();
  });
  self.addEventListener("activate", (event) => {
    console.log("\u26A1 Service Worker activating");
    event.waitUntil(self.clients.claim());
  });
  self.addEventListener("push", function(event) {
    console.log("[Service Worker] Push Received.");
    const data = event.data.json();
    console.log("[Service Worker] Push Data:", data);
    let tag = "order-confirmation";
    if (data.product_id) {
      tag = "product_" + data.product_id + "_sale";
    }
    const options = {
      body: data.body,
      icon: "/icons/icon-128x128.png",
      badge: "/icons/icon-128x128.png",
      data: data.data,
      // <-- ✅ This is critical
      tag,
      // optional: prevents duplicates
      renotify: false
    };
    event.waitUntil(
      self.registration.showNotification(data.title, options)
    );
  });
  self.addEventListener("notificationclick", function(event) {
    event.notification.close();
    const clickUrl = event.notification?.data?.url || "/";
    event.waitUntil(
      clients.matchAll({ type: "window", includeUncontrolled: true }).then((clientList) => {
        for (const client of clientList) {
          if (client.url.includes(self.location.origin)) {
            client.postMessage({ action: "navigate", url: clickUrl });
            return client.focus();
          }
        }
        return clients.openWindow(clickUrl);
      })
    );
  });
  if (false) {
    registerRoute(
      new NavigationRoute(
        //createHandlerBoundToURL(process.env.PWA_FALLBACK_HTML),
        createHandlerBoundToURL("index.html"),
        {
          denylist: [
            new RegExp("sw\\.js$"),
            /workbox-(.)*\.js$/
          ]
        }
      )
    );
  }
})();
//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAic291cmNlcyI6IFsiLi4vLi4vbm9kZV9tb2R1bGVzL3dvcmtib3gtY29yZS9fdmVyc2lvbi5qcyIsICIuLi8uLi9ub2RlX21vZHVsZXMvd29ya2JveC1jb3JlL19wcml2YXRlL2xvZ2dlci5qcyIsICIuLi8uLi9ub2RlX21vZHVsZXMvd29ya2JveC1jb3JlL21vZGVscy9tZXNzYWdlcy9tZXNzYWdlcy5qcyIsICIuLi8uLi9ub2RlX21vZHVsZXMvd29ya2JveC1jb3JlL21vZGVscy9tZXNzYWdlcy9tZXNzYWdlR2VuZXJhdG9yLmpzIiwgIi4uLy4uL25vZGVfbW9kdWxlcy93b3JrYm94LWNvcmUvX3ByaXZhdGUvV29ya2JveEVycm9yLmpzIiwgIi4uLy4uL25vZGVfbW9kdWxlcy93b3JrYm94LWNvcmUvX3ByaXZhdGUvYXNzZXJ0LmpzIiwgIi4uLy4uL25vZGVfbW9kdWxlcy93b3JrYm94LWNvcmUvbW9kZWxzL3F1b3RhRXJyb3JDYWxsYmFja3MuanMiLCAiLi4vLi4vbm9kZV9tb2R1bGVzL3dvcmtib3gtY29yZS9yZWdpc3RlclF1b3RhRXJyb3JDYWxsYmFjay5qcyIsICIuLi8uLi9ub2RlX21vZHVsZXMvd29ya2JveC1jb3JlL19wcml2YXRlL2NhY2hlTmFtZXMuanMiLCAiLi4vLi4vbm9kZV9tb2R1bGVzL3dvcmtib3gtY29yZS9fcHJpdmF0ZS9jYWNoZU1hdGNoSWdub3JlUGFyYW1zLmpzIiwgIi4uLy4uL25vZGVfbW9kdWxlcy93b3JrYm94LWNvcmUvX3ByaXZhdGUvY2FuQ29uc3RydWN0UmVzcG9uc2VGcm9tQm9keVN0cmVhbS5qcyIsICIuLi8uLi9ub2RlX21vZHVsZXMvd29ya2JveC1jb3JlL19wcml2YXRlL2RvbnRXYWl0Rm9yLmpzIiwgIi4uLy4uL25vZGVfbW9kdWxlcy93b3JrYm94LWNvcmUvX3ByaXZhdGUvRGVmZXJyZWQuanMiLCAiLi4vLi4vbm9kZV9tb2R1bGVzL3dvcmtib3gtY29yZS9fcHJpdmF0ZS9leGVjdXRlUXVvdGFFcnJvckNhbGxiYWNrcy5qcyIsICIuLi8uLi9ub2RlX21vZHVsZXMvd29ya2JveC1jb3JlL19wcml2YXRlL2dldEZyaWVuZGx5VVJMLmpzIiwgIi4uLy4uL25vZGVfbW9kdWxlcy93b3JrYm94LWNvcmUvX3ByaXZhdGUvdGltZW91dC5qcyIsICIuLi8uLi9ub2RlX21vZHVsZXMvd29ya2JveC1jb3JlL19wcml2YXRlL3dhaXRVbnRpbC5qcyIsICIuLi8uLi9ub2RlX21vZHVsZXMvd29ya2JveC1jb3JlL2NvcHlSZXNwb25zZS5qcyIsICIuLi8uLi9ub2RlX21vZHVsZXMvd29ya2JveC1jb3JlL2NsaWVudHNDbGFpbS5qcyIsICIuLi8uLi9ub2RlX21vZHVsZXMvd29ya2JveC1wcmVjYWNoaW5nL192ZXJzaW9uLmpzIiwgIi4uLy4uL25vZGVfbW9kdWxlcy93b3JrYm94LXByZWNhY2hpbmcvdXRpbHMvY3JlYXRlQ2FjaGVLZXkuanMiLCAiLi4vLi4vbm9kZV9tb2R1bGVzL3dvcmtib3gtcHJlY2FjaGluZy91dGlscy9QcmVjYWNoZUluc3RhbGxSZXBvcnRQbHVnaW4uanMiLCAiLi4vLi4vbm9kZV9tb2R1bGVzL3dvcmtib3gtcHJlY2FjaGluZy91dGlscy9QcmVjYWNoZUNhY2hlS2V5UGx1Z2luLmpzIiwgIi4uLy4uL25vZGVfbW9kdWxlcy93b3JrYm94LXByZWNhY2hpbmcvdXRpbHMvcHJpbnRDbGVhbnVwRGV0YWlscy5qcyIsICIuLi8uLi9ub2RlX21vZHVsZXMvd29ya2JveC1wcmVjYWNoaW5nL3V0aWxzL3ByaW50SW5zdGFsbERldGFpbHMuanMiLCAiLi4vLi4vbm9kZV9tb2R1bGVzL3dvcmtib3gtc3RyYXRlZ2llcy9fdmVyc2lvbi5qcyIsICIuLi8uLi9ub2RlX21vZHVsZXMvd29ya2JveC1zdHJhdGVnaWVzL1N0cmF0ZWd5SGFuZGxlci5qcyIsICIuLi8uLi9ub2RlX21vZHVsZXMvd29ya2JveC1zdHJhdGVnaWVzL1N0cmF0ZWd5LmpzIiwgIi4uLy4uL25vZGVfbW9kdWxlcy93b3JrYm94LXByZWNhY2hpbmcvUHJlY2FjaGVTdHJhdGVneS5qcyIsICIuLi8uLi9ub2RlX21vZHVsZXMvd29ya2JveC1wcmVjYWNoaW5nL1ByZWNhY2hlQ29udHJvbGxlci5qcyIsICIuLi8uLi9ub2RlX21vZHVsZXMvd29ya2JveC1wcmVjYWNoaW5nL3V0aWxzL2dldE9yQ3JlYXRlUHJlY2FjaGVDb250cm9sbGVyLmpzIiwgIi4uLy4uL25vZGVfbW9kdWxlcy93b3JrYm94LXJvdXRpbmcvX3ZlcnNpb24uanMiLCAiLi4vLi4vbm9kZV9tb2R1bGVzL3dvcmtib3gtcm91dGluZy91dGlscy9jb25zdGFudHMuanMiLCAiLi4vLi4vbm9kZV9tb2R1bGVzL3dvcmtib3gtcm91dGluZy91dGlscy9ub3JtYWxpemVIYW5kbGVyLmpzIiwgIi4uLy4uL25vZGVfbW9kdWxlcy93b3JrYm94LXJvdXRpbmcvUm91dGUuanMiLCAiLi4vLi4vbm9kZV9tb2R1bGVzL3dvcmtib3gtcm91dGluZy9SZWdFeHBSb3V0ZS5qcyIsICIuLi8uLi9ub2RlX21vZHVsZXMvd29ya2JveC1yb3V0aW5nL1JvdXRlci5qcyIsICIuLi8uLi9ub2RlX21vZHVsZXMvd29ya2JveC1yb3V0aW5nL3V0aWxzL2dldE9yQ3JlYXRlRGVmYXVsdFJvdXRlci5qcyIsICIuLi8uLi9ub2RlX21vZHVsZXMvd29ya2JveC1yb3V0aW5nL3JlZ2lzdGVyUm91dGUuanMiLCAiLi4vLi4vbm9kZV9tb2R1bGVzL3dvcmtib3gtcHJlY2FjaGluZy91dGlscy9yZW1vdmVJZ25vcmVkU2VhcmNoUGFyYW1zLmpzIiwgIi4uLy4uL25vZGVfbW9kdWxlcy93b3JrYm94LXByZWNhY2hpbmcvdXRpbHMvZ2VuZXJhdGVVUkxWYXJpYXRpb25zLmpzIiwgIi4uLy4uL25vZGVfbW9kdWxlcy93b3JrYm94LXByZWNhY2hpbmcvUHJlY2FjaGVSb3V0ZS5qcyIsICIuLi8uLi9ub2RlX21vZHVsZXMvd29ya2JveC1wcmVjYWNoaW5nL2FkZFJvdXRlLmpzIiwgIi4uLy4uL25vZGVfbW9kdWxlcy93b3JrYm94LXByZWNhY2hpbmcvdXRpbHMvZGVsZXRlT3V0ZGF0ZWRDYWNoZXMuanMiLCAiLi4vLi4vbm9kZV9tb2R1bGVzL3dvcmtib3gtcHJlY2FjaGluZy9jbGVhbnVwT3V0ZGF0ZWRDYWNoZXMuanMiLCAiLi4vLi4vbm9kZV9tb2R1bGVzL3dvcmtib3gtcHJlY2FjaGluZy9wcmVjYWNoZS5qcyIsICIuLi8uLi9ub2RlX21vZHVsZXMvd29ya2JveC1wcmVjYWNoaW5nL3ByZWNhY2hlQW5kUm91dGUuanMiLCAiLi4vLi4vbm9kZV9tb2R1bGVzL3dvcmtib3gtc3RyYXRlZ2llcy91dGlscy9tZXNzYWdlcy5qcyIsICIuLi8uLi9ub2RlX21vZHVsZXMvd29ya2JveC1zdHJhdGVnaWVzL3BsdWdpbnMvY2FjaGVPa0FuZE9wYXF1ZVBsdWdpbi5qcyIsICIuLi8uLi9ub2RlX21vZHVsZXMvd29ya2JveC1zdHJhdGVnaWVzL1N0YWxlV2hpbGVSZXZhbGlkYXRlLmpzIiwgIi4uLy4uL25vZGVfbW9kdWxlcy9pZGIvYnVpbGQvd3JhcC1pZGItdmFsdWUuanMiLCAiLi4vLi4vbm9kZV9tb2R1bGVzL2lkYi9idWlsZC9pbmRleC5qcyIsICIuLi8uLi9ub2RlX21vZHVsZXMvd29ya2JveC1leHBpcmF0aW9uL192ZXJzaW9uLmpzIiwgIi4uLy4uL25vZGVfbW9kdWxlcy93b3JrYm94LWV4cGlyYXRpb24vbW9kZWxzL0NhY2hlVGltZXN0YW1wc01vZGVsLmpzIiwgIi4uLy4uL25vZGVfbW9kdWxlcy93b3JrYm94LWV4cGlyYXRpb24vQ2FjaGVFeHBpcmF0aW9uLmpzIiwgIi4uLy4uL25vZGVfbW9kdWxlcy93b3JrYm94LWV4cGlyYXRpb24vRXhwaXJhdGlvblBsdWdpbi5qcyIsICIuLi8uLi9zcmMtcHdhL2N1c3RvbS1zZXJ2aWNlLXdvcmtlci5qcyJdLAogICJzb3VyY2VzQ29udGVudCI6IFsiXCJ1c2Ugc3RyaWN0XCI7XG4vLyBAdHMtaWdub3JlXG50cnkge1xuICAgIHNlbGZbJ3dvcmtib3g6Y29yZTo3LjIuMCddICYmIF8oKTtcbn1cbmNhdGNoIChlKSB7IH1cbiIsICIvKlxuICBDb3B5cmlnaHQgMjAxOSBHb29nbGUgTExDXG4gIFVzZSBvZiB0aGlzIHNvdXJjZSBjb2RlIGlzIGdvdmVybmVkIGJ5IGFuIE1JVC1zdHlsZVxuICBsaWNlbnNlIHRoYXQgY2FuIGJlIGZvdW5kIGluIHRoZSBMSUNFTlNFIGZpbGUgb3IgYXRcbiAgaHR0cHM6Ly9vcGVuc291cmNlLm9yZy9saWNlbnNlcy9NSVQuXG4qL1xuaW1wb3J0ICcuLi9fdmVyc2lvbi5qcyc7XG5jb25zdCBsb2dnZXIgPSAocHJvY2Vzcy5lbnYuTk9ERV9FTlYgPT09ICdwcm9kdWN0aW9uJ1xuICAgID8gbnVsbFxuICAgIDogKCgpID0+IHtcbiAgICAgICAgLy8gRG9uJ3Qgb3ZlcndyaXRlIHRoaXMgdmFsdWUgaWYgaXQncyBhbHJlYWR5IHNldC5cbiAgICAgICAgLy8gU2VlIGh0dHBzOi8vZ2l0aHViLmNvbS9Hb29nbGVDaHJvbWUvd29ya2JveC9wdWxsLzIyODQjaXNzdWVjb21tZW50LTU2MDQ3MDkyM1xuICAgICAgICBpZiAoISgnX19XQl9ESVNBQkxFX0RFVl9MT0dTJyBpbiBnbG9iYWxUaGlzKSkge1xuICAgICAgICAgICAgc2VsZi5fX1dCX0RJU0FCTEVfREVWX0xPR1MgPSBmYWxzZTtcbiAgICAgICAgfVxuICAgICAgICBsZXQgaW5Hcm91cCA9IGZhbHNlO1xuICAgICAgICBjb25zdCBtZXRob2RUb0NvbG9yTWFwID0ge1xuICAgICAgICAgICAgZGVidWc6IGAjN2Y4YzhkYCxcbiAgICAgICAgICAgIGxvZzogYCMyZWNjNzFgLFxuICAgICAgICAgICAgd2FybjogYCNmMzljMTJgLFxuICAgICAgICAgICAgZXJyb3I6IGAjYzAzOTJiYCxcbiAgICAgICAgICAgIGdyb3VwQ29sbGFwc2VkOiBgIzM0OThkYmAsXG4gICAgICAgICAgICBncm91cEVuZDogbnVsbCwgLy8gTm8gY29sb3JlZCBwcmVmaXggb24gZ3JvdXBFbmRcbiAgICAgICAgfTtcbiAgICAgICAgY29uc3QgcHJpbnQgPSBmdW5jdGlvbiAobWV0aG9kLCBhcmdzKSB7XG4gICAgICAgICAgICBpZiAoc2VsZi5fX1dCX0RJU0FCTEVfREVWX0xPR1MpIHtcbiAgICAgICAgICAgICAgICByZXR1cm47XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBpZiAobWV0aG9kID09PSAnZ3JvdXBDb2xsYXBzZWQnKSB7XG4gICAgICAgICAgICAgICAgLy8gU2FmYXJpIGRvZXNuJ3QgcHJpbnQgYWxsIGNvbnNvbGUuZ3JvdXBDb2xsYXBzZWQoKSBhcmd1bWVudHM6XG4gICAgICAgICAgICAgICAgLy8gaHR0cHM6Ly9idWdzLndlYmtpdC5vcmcvc2hvd19idWcuY2dpP2lkPTE4Mjc1NFxuICAgICAgICAgICAgICAgIGlmICgvXigoPyFjaHJvbWV8YW5kcm9pZCkuKSpzYWZhcmkvaS50ZXN0KG5hdmlnYXRvci51c2VyQWdlbnQpKSB7XG4gICAgICAgICAgICAgICAgICAgIGNvbnNvbGVbbWV0aG9kXSguLi5hcmdzKTtcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGNvbnN0IHN0eWxlcyA9IFtcbiAgICAgICAgICAgICAgICBgYmFja2dyb3VuZDogJHttZXRob2RUb0NvbG9yTWFwW21ldGhvZF19YCxcbiAgICAgICAgICAgICAgICBgYm9yZGVyLXJhZGl1czogMC41ZW1gLFxuICAgICAgICAgICAgICAgIGBjb2xvcjogd2hpdGVgLFxuICAgICAgICAgICAgICAgIGBmb250LXdlaWdodDogYm9sZGAsXG4gICAgICAgICAgICAgICAgYHBhZGRpbmc6IDJweCAwLjVlbWAsXG4gICAgICAgICAgICBdO1xuICAgICAgICAgICAgLy8gV2hlbiBpbiBhIGdyb3VwLCB0aGUgd29ya2JveCBwcmVmaXggaXMgbm90IGRpc3BsYXllZC5cbiAgICAgICAgICAgIGNvbnN0IGxvZ1ByZWZpeCA9IGluR3JvdXAgPyBbXSA6IFsnJWN3b3JrYm94Jywgc3R5bGVzLmpvaW4oJzsnKV07XG4gICAgICAgICAgICBjb25zb2xlW21ldGhvZF0oLi4ubG9nUHJlZml4LCAuLi5hcmdzKTtcbiAgICAgICAgICAgIGlmIChtZXRob2QgPT09ICdncm91cENvbGxhcHNlZCcpIHtcbiAgICAgICAgICAgICAgICBpbkdyb3VwID0gdHJ1ZTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGlmIChtZXRob2QgPT09ICdncm91cEVuZCcpIHtcbiAgICAgICAgICAgICAgICBpbkdyb3VwID0gZmFsc2U7XG4gICAgICAgICAgICB9XG4gICAgICAgIH07XG4gICAgICAgIC8vIGVzbGludC1kaXNhYmxlLW5leHQtbGluZSBAdHlwZXNjcmlwdC1lc2xpbnQvYmFuLXR5cGVzXG4gICAgICAgIGNvbnN0IGFwaSA9IHt9O1xuICAgICAgICBjb25zdCBsb2dnZXJNZXRob2RzID0gT2JqZWN0LmtleXMobWV0aG9kVG9Db2xvck1hcCk7XG4gICAgICAgIGZvciAoY29uc3Qga2V5IG9mIGxvZ2dlck1ldGhvZHMpIHtcbiAgICAgICAgICAgIGNvbnN0IG1ldGhvZCA9IGtleTtcbiAgICAgICAgICAgIGFwaVttZXRob2RdID0gKC4uLmFyZ3MpID0+IHtcbiAgICAgICAgICAgICAgICBwcmludChtZXRob2QsIGFyZ3MpO1xuICAgICAgICAgICAgfTtcbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gYXBpO1xuICAgIH0pKCkpO1xuZXhwb3J0IHsgbG9nZ2VyIH07XG4iLCAiLypcbiAgQ29weXJpZ2h0IDIwMTggR29vZ2xlIExMQ1xuXG4gIFVzZSBvZiB0aGlzIHNvdXJjZSBjb2RlIGlzIGdvdmVybmVkIGJ5IGFuIE1JVC1zdHlsZVxuICBsaWNlbnNlIHRoYXQgY2FuIGJlIGZvdW5kIGluIHRoZSBMSUNFTlNFIGZpbGUgb3IgYXRcbiAgaHR0cHM6Ly9vcGVuc291cmNlLm9yZy9saWNlbnNlcy9NSVQuXG4qL1xuaW1wb3J0ICcuLi8uLi9fdmVyc2lvbi5qcyc7XG5leHBvcnQgY29uc3QgbWVzc2FnZXMgPSB7XG4gICAgJ2ludmFsaWQtdmFsdWUnOiAoeyBwYXJhbU5hbWUsIHZhbGlkVmFsdWVEZXNjcmlwdGlvbiwgdmFsdWUgfSkgPT4ge1xuICAgICAgICBpZiAoIXBhcmFtTmFtZSB8fCAhdmFsaWRWYWx1ZURlc2NyaXB0aW9uKSB7XG4gICAgICAgICAgICB0aHJvdyBuZXcgRXJyb3IoYFVuZXhwZWN0ZWQgaW5wdXQgdG8gJ2ludmFsaWQtdmFsdWUnIGVycm9yLmApO1xuICAgICAgICB9XG4gICAgICAgIHJldHVybiAoYFRoZSAnJHtwYXJhbU5hbWV9JyBwYXJhbWV0ZXIgd2FzIGdpdmVuIGEgdmFsdWUgd2l0aCBhbiBgICtcbiAgICAgICAgICAgIGB1bmV4cGVjdGVkIHZhbHVlLiAke3ZhbGlkVmFsdWVEZXNjcmlwdGlvbn0gUmVjZWl2ZWQgYSB2YWx1ZSBvZiBgICtcbiAgICAgICAgICAgIGAke0pTT04uc3RyaW5naWZ5KHZhbHVlKX0uYCk7XG4gICAgfSxcbiAgICAnbm90LWFuLWFycmF5JzogKHsgbW9kdWxlTmFtZSwgY2xhc3NOYW1lLCBmdW5jTmFtZSwgcGFyYW1OYW1lIH0pID0+IHtcbiAgICAgICAgaWYgKCFtb2R1bGVOYW1lIHx8ICFjbGFzc05hbWUgfHwgIWZ1bmNOYW1lIHx8ICFwYXJhbU5hbWUpIHtcbiAgICAgICAgICAgIHRocm93IG5ldyBFcnJvcihgVW5leHBlY3RlZCBpbnB1dCB0byAnbm90LWFuLWFycmF5JyBlcnJvci5gKTtcbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gKGBUaGUgcGFyYW1ldGVyICcke3BhcmFtTmFtZX0nIHBhc3NlZCBpbnRvIGAgK1xuICAgICAgICAgICAgYCcke21vZHVsZU5hbWV9LiR7Y2xhc3NOYW1lfS4ke2Z1bmNOYW1lfSgpJyBtdXN0IGJlIGFuIGFycmF5LmApO1xuICAgIH0sXG4gICAgJ2luY29ycmVjdC10eXBlJzogKHsgZXhwZWN0ZWRUeXBlLCBwYXJhbU5hbWUsIG1vZHVsZU5hbWUsIGNsYXNzTmFtZSwgZnVuY05hbWUsIH0pID0+IHtcbiAgICAgICAgaWYgKCFleHBlY3RlZFR5cGUgfHwgIXBhcmFtTmFtZSB8fCAhbW9kdWxlTmFtZSB8fCAhZnVuY05hbWUpIHtcbiAgICAgICAgICAgIHRocm93IG5ldyBFcnJvcihgVW5leHBlY3RlZCBpbnB1dCB0byAnaW5jb3JyZWN0LXR5cGUnIGVycm9yLmApO1xuICAgICAgICB9XG4gICAgICAgIGNvbnN0IGNsYXNzTmFtZVN0ciA9IGNsYXNzTmFtZSA/IGAke2NsYXNzTmFtZX0uYCA6ICcnO1xuICAgICAgICByZXR1cm4gKGBUaGUgcGFyYW1ldGVyICcke3BhcmFtTmFtZX0nIHBhc3NlZCBpbnRvIGAgK1xuICAgICAgICAgICAgYCcke21vZHVsZU5hbWV9LiR7Y2xhc3NOYW1lU3RyfWAgK1xuICAgICAgICAgICAgYCR7ZnVuY05hbWV9KCknIG11c3QgYmUgb2YgdHlwZSAke2V4cGVjdGVkVHlwZX0uYCk7XG4gICAgfSxcbiAgICAnaW5jb3JyZWN0LWNsYXNzJzogKHsgZXhwZWN0ZWRDbGFzc05hbWUsIHBhcmFtTmFtZSwgbW9kdWxlTmFtZSwgY2xhc3NOYW1lLCBmdW5jTmFtZSwgaXNSZXR1cm5WYWx1ZVByb2JsZW0sIH0pID0+IHtcbiAgICAgICAgaWYgKCFleHBlY3RlZENsYXNzTmFtZSB8fCAhbW9kdWxlTmFtZSB8fCAhZnVuY05hbWUpIHtcbiAgICAgICAgICAgIHRocm93IG5ldyBFcnJvcihgVW5leHBlY3RlZCBpbnB1dCB0byAnaW5jb3JyZWN0LWNsYXNzJyBlcnJvci5gKTtcbiAgICAgICAgfVxuICAgICAgICBjb25zdCBjbGFzc05hbWVTdHIgPSBjbGFzc05hbWUgPyBgJHtjbGFzc05hbWV9LmAgOiAnJztcbiAgICAgICAgaWYgKGlzUmV0dXJuVmFsdWVQcm9ibGVtKSB7XG4gICAgICAgICAgICByZXR1cm4gKGBUaGUgcmV0dXJuIHZhbHVlIGZyb20gYCArXG4gICAgICAgICAgICAgICAgYCcke21vZHVsZU5hbWV9LiR7Y2xhc3NOYW1lU3RyfSR7ZnVuY05hbWV9KCknIGAgK1xuICAgICAgICAgICAgICAgIGBtdXN0IGJlIGFuIGluc3RhbmNlIG9mIGNsYXNzICR7ZXhwZWN0ZWRDbGFzc05hbWV9LmApO1xuICAgICAgICB9XG4gICAgICAgIHJldHVybiAoYFRoZSBwYXJhbWV0ZXIgJyR7cGFyYW1OYW1lfScgcGFzc2VkIGludG8gYCArXG4gICAgICAgICAgICBgJyR7bW9kdWxlTmFtZX0uJHtjbGFzc05hbWVTdHJ9JHtmdW5jTmFtZX0oKScgYCArXG4gICAgICAgICAgICBgbXVzdCBiZSBhbiBpbnN0YW5jZSBvZiBjbGFzcyAke2V4cGVjdGVkQ2xhc3NOYW1lfS5gKTtcbiAgICB9LFxuICAgICdtaXNzaW5nLWEtbWV0aG9kJzogKHsgZXhwZWN0ZWRNZXRob2QsIHBhcmFtTmFtZSwgbW9kdWxlTmFtZSwgY2xhc3NOYW1lLCBmdW5jTmFtZSwgfSkgPT4ge1xuICAgICAgICBpZiAoIWV4cGVjdGVkTWV0aG9kIHx8XG4gICAgICAgICAgICAhcGFyYW1OYW1lIHx8XG4gICAgICAgICAgICAhbW9kdWxlTmFtZSB8fFxuICAgICAgICAgICAgIWNsYXNzTmFtZSB8fFxuICAgICAgICAgICAgIWZ1bmNOYW1lKSB7XG4gICAgICAgICAgICB0aHJvdyBuZXcgRXJyb3IoYFVuZXhwZWN0ZWQgaW5wdXQgdG8gJ21pc3NpbmctYS1tZXRob2QnIGVycm9yLmApO1xuICAgICAgICB9XG4gICAgICAgIHJldHVybiAoYCR7bW9kdWxlTmFtZX0uJHtjbGFzc05hbWV9LiR7ZnVuY05hbWV9KCkgZXhwZWN0ZWQgdGhlIGAgK1xuICAgICAgICAgICAgYCcke3BhcmFtTmFtZX0nIHBhcmFtZXRlciB0byBleHBvc2UgYSAnJHtleHBlY3RlZE1ldGhvZH0nIG1ldGhvZC5gKTtcbiAgICB9LFxuICAgICdhZGQtdG8tY2FjaGUtbGlzdC11bmV4cGVjdGVkLXR5cGUnOiAoeyBlbnRyeSB9KSA9PiB7XG4gICAgICAgIHJldHVybiAoYEFuIHVuZXhwZWN0ZWQgZW50cnkgd2FzIHBhc3NlZCB0byBgICtcbiAgICAgICAgICAgIGAnd29ya2JveC1wcmVjYWNoaW5nLlByZWNhY2hlQ29udHJvbGxlci5hZGRUb0NhY2hlTGlzdCgpJyBUaGUgZW50cnkgYCArXG4gICAgICAgICAgICBgJyR7SlNPTi5zdHJpbmdpZnkoZW50cnkpfScgaXNuJ3Qgc3VwcG9ydGVkLiBZb3UgbXVzdCBzdXBwbHkgYW4gYXJyYXkgb2YgYCArXG4gICAgICAgICAgICBgc3RyaW5ncyB3aXRoIG9uZSBvciBtb3JlIGNoYXJhY3RlcnMsIG9iamVjdHMgd2l0aCBhIHVybCBwcm9wZXJ0eSBvciBgICtcbiAgICAgICAgICAgIGBSZXF1ZXN0IG9iamVjdHMuYCk7XG4gICAgfSxcbiAgICAnYWRkLXRvLWNhY2hlLWxpc3QtY29uZmxpY3RpbmctZW50cmllcyc6ICh7IGZpcnN0RW50cnksIHNlY29uZEVudHJ5IH0pID0+IHtcbiAgICAgICAgaWYgKCFmaXJzdEVudHJ5IHx8ICFzZWNvbmRFbnRyeSkge1xuICAgICAgICAgICAgdGhyb3cgbmV3IEVycm9yKGBVbmV4cGVjdGVkIGlucHV0IHRvIGAgKyBgJ2FkZC10by1jYWNoZS1saXN0LWR1cGxpY2F0ZS1lbnRyaWVzJyBlcnJvci5gKTtcbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gKGBUd28gb2YgdGhlIGVudHJpZXMgcGFzc2VkIHRvIGAgK1xuICAgICAgICAgICAgYCd3b3JrYm94LXByZWNhY2hpbmcuUHJlY2FjaGVDb250cm9sbGVyLmFkZFRvQ2FjaGVMaXN0KCknIGhhZCB0aGUgVVJMIGAgK1xuICAgICAgICAgICAgYCR7Zmlyc3RFbnRyeX0gYnV0IGRpZmZlcmVudCByZXZpc2lvbiBkZXRhaWxzLiBXb3JrYm94IGlzIGAgK1xuICAgICAgICAgICAgYHVuYWJsZSB0byBjYWNoZSBhbmQgdmVyc2lvbiB0aGUgYXNzZXQgY29ycmVjdGx5LiBQbGVhc2UgcmVtb3ZlIG9uZSBgICtcbiAgICAgICAgICAgIGBvZiB0aGUgZW50cmllcy5gKTtcbiAgICB9LFxuICAgICdwbHVnaW4tZXJyb3ItcmVxdWVzdC13aWxsLWZldGNoJzogKHsgdGhyb3duRXJyb3JNZXNzYWdlIH0pID0+IHtcbiAgICAgICAgaWYgKCF0aHJvd25FcnJvck1lc3NhZ2UpIHtcbiAgICAgICAgICAgIHRocm93IG5ldyBFcnJvcihgVW5leHBlY3RlZCBpbnB1dCB0byBgICsgYCdwbHVnaW4tZXJyb3ItcmVxdWVzdC13aWxsLWZldGNoJywgZXJyb3IuYCk7XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIChgQW4gZXJyb3Igd2FzIHRocm93biBieSBhIHBsdWdpbnMgJ3JlcXVlc3RXaWxsRmV0Y2goKScgbWV0aG9kLiBgICtcbiAgICAgICAgICAgIGBUaGUgdGhyb3duIGVycm9yIG1lc3NhZ2Ugd2FzOiAnJHt0aHJvd25FcnJvck1lc3NhZ2V9Jy5gKTtcbiAgICB9LFxuICAgICdpbnZhbGlkLWNhY2hlLW5hbWUnOiAoeyBjYWNoZU5hbWVJZCwgdmFsdWUgfSkgPT4ge1xuICAgICAgICBpZiAoIWNhY2hlTmFtZUlkKSB7XG4gICAgICAgICAgICB0aHJvdyBuZXcgRXJyb3IoYEV4cGVjdGVkIGEgJ2NhY2hlTmFtZUlkJyBmb3IgZXJyb3IgJ2ludmFsaWQtY2FjaGUtbmFtZSdgKTtcbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gKGBZb3UgbXVzdCBwcm92aWRlIGEgbmFtZSBjb250YWluaW5nIGF0IGxlYXN0IG9uZSBjaGFyYWN0ZXIgZm9yIGAgK1xuICAgICAgICAgICAgYHNldENhY2hlRGV0YWlscyh7JHtjYWNoZU5hbWVJZH06ICcuLi4nfSkuIFJlY2VpdmVkIGEgdmFsdWUgb2YgYCArXG4gICAgICAgICAgICBgJyR7SlNPTi5zdHJpbmdpZnkodmFsdWUpfSdgKTtcbiAgICB9LFxuICAgICd1bnJlZ2lzdGVyLXJvdXRlLWJ1dC1ub3QtZm91bmQtd2l0aC1tZXRob2QnOiAoeyBtZXRob2QgfSkgPT4ge1xuICAgICAgICBpZiAoIW1ldGhvZCkge1xuICAgICAgICAgICAgdGhyb3cgbmV3IEVycm9yKGBVbmV4cGVjdGVkIGlucHV0IHRvIGAgK1xuICAgICAgICAgICAgICAgIGAndW5yZWdpc3Rlci1yb3V0ZS1idXQtbm90LWZvdW5kLXdpdGgtbWV0aG9kJyBlcnJvci5gKTtcbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gKGBUaGUgcm91dGUgeW91J3JlIHRyeWluZyB0byB1bnJlZ2lzdGVyIHdhcyBub3QgIHByZXZpb3VzbHkgYCArXG4gICAgICAgICAgICBgcmVnaXN0ZXJlZCBmb3IgdGhlIG1ldGhvZCB0eXBlICcke21ldGhvZH0nLmApO1xuICAgIH0sXG4gICAgJ3VucmVnaXN0ZXItcm91dGUtcm91dGUtbm90LXJlZ2lzdGVyZWQnOiAoKSA9PiB7XG4gICAgICAgIHJldHVybiAoYFRoZSByb3V0ZSB5b3UncmUgdHJ5aW5nIHRvIHVucmVnaXN0ZXIgd2FzIG5vdCBwcmV2aW91c2x5IGAgK1xuICAgICAgICAgICAgYHJlZ2lzdGVyZWQuYCk7XG4gICAgfSxcbiAgICAncXVldWUtcmVwbGF5LWZhaWxlZCc6ICh7IG5hbWUgfSkgPT4ge1xuICAgICAgICByZXR1cm4gYFJlcGxheWluZyB0aGUgYmFja2dyb3VuZCBzeW5jIHF1ZXVlICcke25hbWV9JyBmYWlsZWQuYDtcbiAgICB9LFxuICAgICdkdXBsaWNhdGUtcXVldWUtbmFtZSc6ICh7IG5hbWUgfSkgPT4ge1xuICAgICAgICByZXR1cm4gKGBUaGUgUXVldWUgbmFtZSAnJHtuYW1lfScgaXMgYWxyZWFkeSBiZWluZyB1c2VkLiBgICtcbiAgICAgICAgICAgIGBBbGwgaW5zdGFuY2VzIG9mIGJhY2tncm91bmRTeW5jLlF1ZXVlIG11c3QgYmUgZ2l2ZW4gdW5pcXVlIG5hbWVzLmApO1xuICAgIH0sXG4gICAgJ2V4cGlyZWQtdGVzdC13aXRob3V0LW1heC1hZ2UnOiAoeyBtZXRob2ROYW1lLCBwYXJhbU5hbWUgfSkgPT4ge1xuICAgICAgICByZXR1cm4gKGBUaGUgJyR7bWV0aG9kTmFtZX0oKScgbWV0aG9kIGNhbiBvbmx5IGJlIHVzZWQgd2hlbiB0aGUgYCArXG4gICAgICAgICAgICBgJyR7cGFyYW1OYW1lfScgaXMgdXNlZCBpbiB0aGUgY29uc3RydWN0b3IuYCk7XG4gICAgfSxcbiAgICAndW5zdXBwb3J0ZWQtcm91dGUtdHlwZSc6ICh7IG1vZHVsZU5hbWUsIGNsYXNzTmFtZSwgZnVuY05hbWUsIHBhcmFtTmFtZSB9KSA9PiB7XG4gICAgICAgIHJldHVybiAoYFRoZSBzdXBwbGllZCAnJHtwYXJhbU5hbWV9JyBwYXJhbWV0ZXIgd2FzIGFuIHVuc3VwcG9ydGVkIHR5cGUuIGAgK1xuICAgICAgICAgICAgYFBsZWFzZSBjaGVjayB0aGUgZG9jcyBmb3IgJHttb2R1bGVOYW1lfS4ke2NsYXNzTmFtZX0uJHtmdW5jTmFtZX0gZm9yIGAgK1xuICAgICAgICAgICAgYHZhbGlkIGlucHV0IHR5cGVzLmApO1xuICAgIH0sXG4gICAgJ25vdC1hcnJheS1vZi1jbGFzcyc6ICh7IHZhbHVlLCBleHBlY3RlZENsYXNzLCBtb2R1bGVOYW1lLCBjbGFzc05hbWUsIGZ1bmNOYW1lLCBwYXJhbU5hbWUsIH0pID0+IHtcbiAgICAgICAgcmV0dXJuIChgVGhlIHN1cHBsaWVkICcke3BhcmFtTmFtZX0nIHBhcmFtZXRlciBtdXN0IGJlIGFuIGFycmF5IG9mIGAgK1xuICAgICAgICAgICAgYCcke2V4cGVjdGVkQ2xhc3N9JyBvYmplY3RzLiBSZWNlaXZlZCAnJHtKU09OLnN0cmluZ2lmeSh2YWx1ZSl9LCcuIGAgK1xuICAgICAgICAgICAgYFBsZWFzZSBjaGVjayB0aGUgY2FsbCB0byAke21vZHVsZU5hbWV9LiR7Y2xhc3NOYW1lfS4ke2Z1bmNOYW1lfSgpIGAgK1xuICAgICAgICAgICAgYHRvIGZpeCB0aGUgaXNzdWUuYCk7XG4gICAgfSxcbiAgICAnbWF4LWVudHJpZXMtb3ItYWdlLXJlcXVpcmVkJzogKHsgbW9kdWxlTmFtZSwgY2xhc3NOYW1lLCBmdW5jTmFtZSB9KSA9PiB7XG4gICAgICAgIHJldHVybiAoYFlvdSBtdXN0IGRlZmluZSBlaXRoZXIgY29uZmlnLm1heEVudHJpZXMgb3IgY29uZmlnLm1heEFnZVNlY29uZHNgICtcbiAgICAgICAgICAgIGBpbiAke21vZHVsZU5hbWV9LiR7Y2xhc3NOYW1lfS4ke2Z1bmNOYW1lfWApO1xuICAgIH0sXG4gICAgJ3N0YXR1c2VzLW9yLWhlYWRlcnMtcmVxdWlyZWQnOiAoeyBtb2R1bGVOYW1lLCBjbGFzc05hbWUsIGZ1bmNOYW1lIH0pID0+IHtcbiAgICAgICAgcmV0dXJuIChgWW91IG11c3QgZGVmaW5lIGVpdGhlciBjb25maWcuc3RhdHVzZXMgb3IgY29uZmlnLmhlYWRlcnNgICtcbiAgICAgICAgICAgIGBpbiAke21vZHVsZU5hbWV9LiR7Y2xhc3NOYW1lfS4ke2Z1bmNOYW1lfWApO1xuICAgIH0sXG4gICAgJ2ludmFsaWQtc3RyaW5nJzogKHsgbW9kdWxlTmFtZSwgZnVuY05hbWUsIHBhcmFtTmFtZSB9KSA9PiB7XG4gICAgICAgIGlmICghcGFyYW1OYW1lIHx8ICFtb2R1bGVOYW1lIHx8ICFmdW5jTmFtZSkge1xuICAgICAgICAgICAgdGhyb3cgbmV3IEVycm9yKGBVbmV4cGVjdGVkIGlucHV0IHRvICdpbnZhbGlkLXN0cmluZycgZXJyb3IuYCk7XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIChgV2hlbiB1c2luZyBzdHJpbmdzLCB0aGUgJyR7cGFyYW1OYW1lfScgcGFyYW1ldGVyIG11c3Qgc3RhcnQgd2l0aCBgICtcbiAgICAgICAgICAgIGAnaHR0cCcgKGZvciBjcm9zcy1vcmlnaW4gbWF0Y2hlcykgb3IgJy8nIChmb3Igc2FtZS1vcmlnaW4gbWF0Y2hlcykuIGAgK1xuICAgICAgICAgICAgYFBsZWFzZSBzZWUgdGhlIGRvY3MgZm9yICR7bW9kdWxlTmFtZX0uJHtmdW5jTmFtZX0oKSBmb3IgYCArXG4gICAgICAgICAgICBgbW9yZSBpbmZvLmApO1xuICAgIH0sXG4gICAgJ2NoYW5uZWwtbmFtZS1yZXF1aXJlZCc6ICgpID0+IHtcbiAgICAgICAgcmV0dXJuIChgWW91IG11c3QgcHJvdmlkZSBhIGNoYW5uZWxOYW1lIHRvIGNvbnN0cnVjdCBhIGAgK1xuICAgICAgICAgICAgYEJyb2FkY2FzdENhY2hlVXBkYXRlIGluc3RhbmNlLmApO1xuICAgIH0sXG4gICAgJ2ludmFsaWQtcmVzcG9uc2VzLWFyZS1zYW1lLWFyZ3MnOiAoKSA9PiB7XG4gICAgICAgIHJldHVybiAoYFRoZSBhcmd1bWVudHMgcGFzc2VkIGludG8gcmVzcG9uc2VzQXJlU2FtZSgpIGFwcGVhciB0byBiZSBgICtcbiAgICAgICAgICAgIGBpbnZhbGlkLiBQbGVhc2UgZW5zdXJlIHZhbGlkIFJlc3BvbnNlcyBhcmUgdXNlZC5gKTtcbiAgICB9LFxuICAgICdleHBpcmUtY3VzdG9tLWNhY2hlcy1vbmx5JzogKCkgPT4ge1xuICAgICAgICByZXR1cm4gKGBZb3UgbXVzdCBwcm92aWRlIGEgJ2NhY2hlTmFtZScgcHJvcGVydHkgd2hlbiB1c2luZyB0aGUgYCArXG4gICAgICAgICAgICBgZXhwaXJhdGlvbiBwbHVnaW4gd2l0aCBhIHJ1bnRpbWUgY2FjaGluZyBzdHJhdGVneS5gKTtcbiAgICB9LFxuICAgICd1bml0LW11c3QtYmUtYnl0ZXMnOiAoeyBub3JtYWxpemVkUmFuZ2VIZWFkZXIgfSkgPT4ge1xuICAgICAgICBpZiAoIW5vcm1hbGl6ZWRSYW5nZUhlYWRlcikge1xuICAgICAgICAgICAgdGhyb3cgbmV3IEVycm9yKGBVbmV4cGVjdGVkIGlucHV0IHRvICd1bml0LW11c3QtYmUtYnl0ZXMnIGVycm9yLmApO1xuICAgICAgICB9XG4gICAgICAgIHJldHVybiAoYFRoZSAndW5pdCcgcG9ydGlvbiBvZiB0aGUgUmFuZ2UgaGVhZGVyIG11c3QgYmUgc2V0IHRvICdieXRlcycuIGAgK1xuICAgICAgICAgICAgYFRoZSBSYW5nZSBoZWFkZXIgcHJvdmlkZWQgd2FzIFwiJHtub3JtYWxpemVkUmFuZ2VIZWFkZXJ9XCJgKTtcbiAgICB9LFxuICAgICdzaW5nbGUtcmFuZ2Utb25seSc6ICh7IG5vcm1hbGl6ZWRSYW5nZUhlYWRlciB9KSA9PiB7XG4gICAgICAgIGlmICghbm9ybWFsaXplZFJhbmdlSGVhZGVyKSB7XG4gICAgICAgICAgICB0aHJvdyBuZXcgRXJyb3IoYFVuZXhwZWN0ZWQgaW5wdXQgdG8gJ3NpbmdsZS1yYW5nZS1vbmx5JyBlcnJvci5gKTtcbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gKGBNdWx0aXBsZSByYW5nZXMgYXJlIG5vdCBzdXBwb3J0ZWQuIFBsZWFzZSB1c2UgYSAgc2luZ2xlIHN0YXJ0IGAgK1xuICAgICAgICAgICAgYHZhbHVlLCBhbmQgb3B0aW9uYWwgZW5kIHZhbHVlLiBUaGUgUmFuZ2UgaGVhZGVyIHByb3ZpZGVkIHdhcyBgICtcbiAgICAgICAgICAgIGBcIiR7bm9ybWFsaXplZFJhbmdlSGVhZGVyfVwiYCk7XG4gICAgfSxcbiAgICAnaW52YWxpZC1yYW5nZS12YWx1ZXMnOiAoeyBub3JtYWxpemVkUmFuZ2VIZWFkZXIgfSkgPT4ge1xuICAgICAgICBpZiAoIW5vcm1hbGl6ZWRSYW5nZUhlYWRlcikge1xuICAgICAgICAgICAgdGhyb3cgbmV3IEVycm9yKGBVbmV4cGVjdGVkIGlucHV0IHRvICdpbnZhbGlkLXJhbmdlLXZhbHVlcycgZXJyb3IuYCk7XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIChgVGhlIFJhbmdlIGhlYWRlciBpcyBtaXNzaW5nIGJvdGggc3RhcnQgYW5kIGVuZCB2YWx1ZXMuIEF0IGxlYXN0IGAgK1xuICAgICAgICAgICAgYG9uZSBvZiB0aG9zZSB2YWx1ZXMgaXMgbmVlZGVkLiBUaGUgUmFuZ2UgaGVhZGVyIHByb3ZpZGVkIHdhcyBgICtcbiAgICAgICAgICAgIGBcIiR7bm9ybWFsaXplZFJhbmdlSGVhZGVyfVwiYCk7XG4gICAgfSxcbiAgICAnbm8tcmFuZ2UtaGVhZGVyJzogKCkgPT4ge1xuICAgICAgICByZXR1cm4gYE5vIFJhbmdlIGhlYWRlciB3YXMgZm91bmQgaW4gdGhlIFJlcXVlc3QgcHJvdmlkZWQuYDtcbiAgICB9LFxuICAgICdyYW5nZS1ub3Qtc2F0aXNmaWFibGUnOiAoeyBzaXplLCBzdGFydCwgZW5kIH0pID0+IHtcbiAgICAgICAgcmV0dXJuIChgVGhlIHN0YXJ0ICgke3N0YXJ0fSkgYW5kIGVuZCAoJHtlbmR9KSB2YWx1ZXMgaW4gdGhlIFJhbmdlIGFyZSBgICtcbiAgICAgICAgICAgIGBub3Qgc2F0aXNmaWFibGUgYnkgdGhlIGNhY2hlZCByZXNwb25zZSwgd2hpY2ggaXMgJHtzaXplfSBieXRlcy5gKTtcbiAgICB9LFxuICAgICdhdHRlbXB0LXRvLWNhY2hlLW5vbi1nZXQtcmVxdWVzdCc6ICh7IHVybCwgbWV0aG9kIH0pID0+IHtcbiAgICAgICAgcmV0dXJuIChgVW5hYmxlIHRvIGNhY2hlICcke3VybH0nIGJlY2F1c2UgaXQgaXMgYSAnJHttZXRob2R9JyByZXF1ZXN0IGFuZCBgICtcbiAgICAgICAgICAgIGBvbmx5ICdHRVQnIHJlcXVlc3RzIGNhbiBiZSBjYWNoZWQuYCk7XG4gICAgfSxcbiAgICAnY2FjaGUtcHV0LXdpdGgtbm8tcmVzcG9uc2UnOiAoeyB1cmwgfSkgPT4ge1xuICAgICAgICByZXR1cm4gKGBUaGVyZSB3YXMgYW4gYXR0ZW1wdCB0byBjYWNoZSAnJHt1cmx9JyBidXQgdGhlIHJlc3BvbnNlIHdhcyBub3QgYCArXG4gICAgICAgICAgICBgZGVmaW5lZC5gKTtcbiAgICB9LFxuICAgICduby1yZXNwb25zZSc6ICh7IHVybCwgZXJyb3IgfSkgPT4ge1xuICAgICAgICBsZXQgbWVzc2FnZSA9IGBUaGUgc3RyYXRlZ3kgY291bGQgbm90IGdlbmVyYXRlIGEgcmVzcG9uc2UgZm9yICcke3VybH0nLmA7XG4gICAgICAgIGlmIChlcnJvcikge1xuICAgICAgICAgICAgbWVzc2FnZSArPSBgIFRoZSB1bmRlcmx5aW5nIGVycm9yIGlzICR7ZXJyb3J9LmA7XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIG1lc3NhZ2U7XG4gICAgfSxcbiAgICAnYmFkLXByZWNhY2hpbmctcmVzcG9uc2UnOiAoeyB1cmwsIHN0YXR1cyB9KSA9PiB7XG4gICAgICAgIHJldHVybiAoYFRoZSBwcmVjYWNoaW5nIHJlcXVlc3QgZm9yICcke3VybH0nIGZhaWxlZGAgK1xuICAgICAgICAgICAgKHN0YXR1cyA/IGAgd2l0aCBhbiBIVFRQIHN0YXR1cyBvZiAke3N0YXR1c30uYCA6IGAuYCkpO1xuICAgIH0sXG4gICAgJ25vbi1wcmVjYWNoZWQtdXJsJzogKHsgdXJsIH0pID0+IHtcbiAgICAgICAgcmV0dXJuIChgY3JlYXRlSGFuZGxlckJvdW5kVG9VUkwoJyR7dXJsfScpIHdhcyBjYWxsZWQsIGJ1dCB0aGF0IFVSTCBpcyBgICtcbiAgICAgICAgICAgIGBub3QgcHJlY2FjaGVkLiBQbGVhc2UgcGFzcyBpbiBhIFVSTCB0aGF0IGlzIHByZWNhY2hlZCBpbnN0ZWFkLmApO1xuICAgIH0sXG4gICAgJ2FkZC10by1jYWNoZS1saXN0LWNvbmZsaWN0aW5nLWludGVncml0aWVzJzogKHsgdXJsIH0pID0+IHtcbiAgICAgICAgcmV0dXJuIChgVHdvIG9mIHRoZSBlbnRyaWVzIHBhc3NlZCB0byBgICtcbiAgICAgICAgICAgIGAnd29ya2JveC1wcmVjYWNoaW5nLlByZWNhY2hlQ29udHJvbGxlci5hZGRUb0NhY2hlTGlzdCgpJyBoYWQgdGhlIFVSTCBgICtcbiAgICAgICAgICAgIGAke3VybH0gd2l0aCBkaWZmZXJlbnQgaW50ZWdyaXR5IHZhbHVlcy4gUGxlYXNlIHJlbW92ZSBvbmUgb2YgdGhlbS5gKTtcbiAgICB9LFxuICAgICdtaXNzaW5nLXByZWNhY2hlLWVudHJ5JzogKHsgY2FjaGVOYW1lLCB1cmwgfSkgPT4ge1xuICAgICAgICByZXR1cm4gYFVuYWJsZSB0byBmaW5kIGEgcHJlY2FjaGVkIHJlc3BvbnNlIGluICR7Y2FjaGVOYW1lfSBmb3IgJHt1cmx9LmA7XG4gICAgfSxcbiAgICAnY3Jvc3Mtb3JpZ2luLWNvcHktcmVzcG9uc2UnOiAoeyBvcmlnaW4gfSkgPT4ge1xuICAgICAgICByZXR1cm4gKGB3b3JrYm94LWNvcmUuY29weVJlc3BvbnNlKCkgY2FuIG9ubHkgYmUgdXNlZCB3aXRoIHNhbWUtb3JpZ2luIGAgK1xuICAgICAgICAgICAgYHJlc3BvbnNlcy4gSXQgd2FzIHBhc3NlZCBhIHJlc3BvbnNlIHdpdGggb3JpZ2luICR7b3JpZ2lufS5gKTtcbiAgICB9LFxuICAgICdvcGFxdWUtc3RyZWFtcy1zb3VyY2UnOiAoeyB0eXBlIH0pID0+IHtcbiAgICAgICAgY29uc3QgbWVzc2FnZSA9IGBPbmUgb2YgdGhlIHdvcmtib3gtc3RyZWFtcyBzb3VyY2VzIHJlc3VsdGVkIGluIGFuIGAgK1xuICAgICAgICAgICAgYCcke3R5cGV9JyByZXNwb25zZS5gO1xuICAgICAgICBpZiAodHlwZSA9PT0gJ29wYXF1ZXJlZGlyZWN0Jykge1xuICAgICAgICAgICAgcmV0dXJuIChgJHttZXNzYWdlfSBQbGVhc2UgZG8gbm90IHVzZSBhIG5hdmlnYXRpb24gcmVxdWVzdCB0aGF0IHJlc3VsdHMgYCArXG4gICAgICAgICAgICAgICAgYGluIGEgcmVkaXJlY3QgYXMgYSBzb3VyY2UuYCk7XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIGAke21lc3NhZ2V9IFBsZWFzZSBlbnN1cmUgeW91ciBzb3VyY2VzIGFyZSBDT1JTLWVuYWJsZWQuYDtcbiAgICB9LFxufTtcbiIsICIvKlxuICBDb3B5cmlnaHQgMjAxOCBHb29nbGUgTExDXG5cbiAgVXNlIG9mIHRoaXMgc291cmNlIGNvZGUgaXMgZ292ZXJuZWQgYnkgYW4gTUlULXN0eWxlXG4gIGxpY2Vuc2UgdGhhdCBjYW4gYmUgZm91bmQgaW4gdGhlIExJQ0VOU0UgZmlsZSBvciBhdFxuICBodHRwczovL29wZW5zb3VyY2Uub3JnL2xpY2Vuc2VzL01JVC5cbiovXG5pbXBvcnQgeyBtZXNzYWdlcyB9IGZyb20gJy4vbWVzc2FnZXMuanMnO1xuaW1wb3J0ICcuLi8uLi9fdmVyc2lvbi5qcyc7XG5jb25zdCBmYWxsYmFjayA9IChjb2RlLCAuLi5hcmdzKSA9PiB7XG4gICAgbGV0IG1zZyA9IGNvZGU7XG4gICAgaWYgKGFyZ3MubGVuZ3RoID4gMCkge1xuICAgICAgICBtc2cgKz0gYCA6OiAke0pTT04uc3RyaW5naWZ5KGFyZ3MpfWA7XG4gICAgfVxuICAgIHJldHVybiBtc2c7XG59O1xuY29uc3QgZ2VuZXJhdG9yRnVuY3Rpb24gPSAoY29kZSwgZGV0YWlscyA9IHt9KSA9PiB7XG4gICAgY29uc3QgbWVzc2FnZSA9IG1lc3NhZ2VzW2NvZGVdO1xuICAgIGlmICghbWVzc2FnZSkge1xuICAgICAgICB0aHJvdyBuZXcgRXJyb3IoYFVuYWJsZSB0byBmaW5kIG1lc3NhZ2UgZm9yIGNvZGUgJyR7Y29kZX0nLmApO1xuICAgIH1cbiAgICByZXR1cm4gbWVzc2FnZShkZXRhaWxzKTtcbn07XG5leHBvcnQgY29uc3QgbWVzc2FnZUdlbmVyYXRvciA9IHByb2Nlc3MuZW52Lk5PREVfRU5WID09PSAncHJvZHVjdGlvbicgPyBmYWxsYmFjayA6IGdlbmVyYXRvckZ1bmN0aW9uO1xuIiwgIi8qXG4gIENvcHlyaWdodCAyMDE4IEdvb2dsZSBMTENcblxuICBVc2Ugb2YgdGhpcyBzb3VyY2UgY29kZSBpcyBnb3Zlcm5lZCBieSBhbiBNSVQtc3R5bGVcbiAgbGljZW5zZSB0aGF0IGNhbiBiZSBmb3VuZCBpbiB0aGUgTElDRU5TRSBmaWxlIG9yIGF0XG4gIGh0dHBzOi8vb3BlbnNvdXJjZS5vcmcvbGljZW5zZXMvTUlULlxuKi9cbmltcG9ydCB7IG1lc3NhZ2VHZW5lcmF0b3IgfSBmcm9tICcuLi9tb2RlbHMvbWVzc2FnZXMvbWVzc2FnZUdlbmVyYXRvci5qcyc7XG5pbXBvcnQgJy4uL192ZXJzaW9uLmpzJztcbi8qKlxuICogV29ya2JveCBlcnJvcnMgc2hvdWxkIGJlIHRocm93biB3aXRoIHRoaXMgY2xhc3MuXG4gKiBUaGlzIGFsbG93cyB1c2UgdG8gZW5zdXJlIHRoZSB0eXBlIGVhc2lseSBpbiB0ZXN0cyxcbiAqIGhlbHBzIGRldmVsb3BlcnMgaWRlbnRpZnkgZXJyb3JzIGZyb20gd29ya2JveFxuICogZWFzaWx5IGFuZCBhbGxvd3MgdXNlIHRvIG9wdGltaXNlIGVycm9yXG4gKiBtZXNzYWdlcyBjb3JyZWN0bHkuXG4gKlxuICogQHByaXZhdGVcbiAqL1xuY2xhc3MgV29ya2JveEVycm9yIGV4dGVuZHMgRXJyb3Ige1xuICAgIC8qKlxuICAgICAqXG4gICAgICogQHBhcmFtIHtzdHJpbmd9IGVycm9yQ29kZSBUaGUgZXJyb3IgY29kZSB0aGF0XG4gICAgICogaWRlbnRpZmllcyB0aGlzIHBhcnRpY3VsYXIgZXJyb3IuXG4gICAgICogQHBhcmFtIHtPYmplY3Q9fSBkZXRhaWxzIEFueSByZWxldmFudCBhcmd1bWVudHNcbiAgICAgKiB0aGF0IHdpbGwgaGVscCBkZXZlbG9wZXJzIGlkZW50aWZ5IGlzc3VlcyBzaG91bGRcbiAgICAgKiBiZSBhZGRlZCBhcyBhIGtleSBvbiB0aGUgY29udGV4dCBvYmplY3QuXG4gICAgICovXG4gICAgY29uc3RydWN0b3IoZXJyb3JDb2RlLCBkZXRhaWxzKSB7XG4gICAgICAgIGNvbnN0IG1lc3NhZ2UgPSBtZXNzYWdlR2VuZXJhdG9yKGVycm9yQ29kZSwgZGV0YWlscyk7XG4gICAgICAgIHN1cGVyKG1lc3NhZ2UpO1xuICAgICAgICB0aGlzLm5hbWUgPSBlcnJvckNvZGU7XG4gICAgICAgIHRoaXMuZGV0YWlscyA9IGRldGFpbHM7XG4gICAgfVxufVxuZXhwb3J0IHsgV29ya2JveEVycm9yIH07XG4iLCAiLypcbiAgQ29weXJpZ2h0IDIwMTggR29vZ2xlIExMQ1xuXG4gIFVzZSBvZiB0aGlzIHNvdXJjZSBjb2RlIGlzIGdvdmVybmVkIGJ5IGFuIE1JVC1zdHlsZVxuICBsaWNlbnNlIHRoYXQgY2FuIGJlIGZvdW5kIGluIHRoZSBMSUNFTlNFIGZpbGUgb3IgYXRcbiAgaHR0cHM6Ly9vcGVuc291cmNlLm9yZy9saWNlbnNlcy9NSVQuXG4qL1xuaW1wb3J0IHsgV29ya2JveEVycm9yIH0gZnJvbSAnLi4vX3ByaXZhdGUvV29ya2JveEVycm9yLmpzJztcbmltcG9ydCAnLi4vX3ZlcnNpb24uanMnO1xuLypcbiAqIFRoaXMgbWV0aG9kIHRocm93cyBpZiB0aGUgc3VwcGxpZWQgdmFsdWUgaXMgbm90IGFuIGFycmF5LlxuICogVGhlIGRlc3RydWN0ZWQgdmFsdWVzIGFyZSByZXF1aXJlZCB0byBwcm9kdWNlIGEgbWVhbmluZ2Z1bCBlcnJvciBmb3IgdXNlcnMuXG4gKiBUaGUgZGVzdHJ1Y3RlZCBhbmQgcmVzdHJ1Y3R1cmVkIG9iamVjdCBpcyBzbyBpdCdzIGNsZWFyIHdoYXQgaXNcbiAqIG5lZWRlZC5cbiAqL1xuY29uc3QgaXNBcnJheSA9ICh2YWx1ZSwgZGV0YWlscykgPT4ge1xuICAgIGlmICghQXJyYXkuaXNBcnJheSh2YWx1ZSkpIHtcbiAgICAgICAgdGhyb3cgbmV3IFdvcmtib3hFcnJvcignbm90LWFuLWFycmF5JywgZGV0YWlscyk7XG4gICAgfVxufTtcbmNvbnN0IGhhc01ldGhvZCA9IChvYmplY3QsIGV4cGVjdGVkTWV0aG9kLCBkZXRhaWxzKSA9PiB7XG4gICAgY29uc3QgdHlwZSA9IHR5cGVvZiBvYmplY3RbZXhwZWN0ZWRNZXRob2RdO1xuICAgIGlmICh0eXBlICE9PSAnZnVuY3Rpb24nKSB7XG4gICAgICAgIGRldGFpbHNbJ2V4cGVjdGVkTWV0aG9kJ10gPSBleHBlY3RlZE1ldGhvZDtcbiAgICAgICAgdGhyb3cgbmV3IFdvcmtib3hFcnJvcignbWlzc2luZy1hLW1ldGhvZCcsIGRldGFpbHMpO1xuICAgIH1cbn07XG5jb25zdCBpc1R5cGUgPSAob2JqZWN0LCBleHBlY3RlZFR5cGUsIGRldGFpbHMpID0+IHtcbiAgICBpZiAodHlwZW9mIG9iamVjdCAhPT0gZXhwZWN0ZWRUeXBlKSB7XG4gICAgICAgIGRldGFpbHNbJ2V4cGVjdGVkVHlwZSddID0gZXhwZWN0ZWRUeXBlO1xuICAgICAgICB0aHJvdyBuZXcgV29ya2JveEVycm9yKCdpbmNvcnJlY3QtdHlwZScsIGRldGFpbHMpO1xuICAgIH1cbn07XG5jb25zdCBpc0luc3RhbmNlID0gKG9iamVjdCwgXG4vLyBOZWVkIHRoZSBnZW5lcmFsIHR5cGUgdG8gZG8gdGhlIGNoZWNrIGxhdGVyLlxuLy8gZXNsaW50LWRpc2FibGUtbmV4dC1saW5lIEB0eXBlc2NyaXB0LWVzbGludC9iYW4tdHlwZXNcbmV4cGVjdGVkQ2xhc3MsIGRldGFpbHMpID0+IHtcbiAgICBpZiAoIShvYmplY3QgaW5zdGFuY2VvZiBleHBlY3RlZENsYXNzKSkge1xuICAgICAgICBkZXRhaWxzWydleHBlY3RlZENsYXNzTmFtZSddID0gZXhwZWN0ZWRDbGFzcy5uYW1lO1xuICAgICAgICB0aHJvdyBuZXcgV29ya2JveEVycm9yKCdpbmNvcnJlY3QtY2xhc3MnLCBkZXRhaWxzKTtcbiAgICB9XG59O1xuY29uc3QgaXNPbmVPZiA9ICh2YWx1ZSwgdmFsaWRWYWx1ZXMsIGRldGFpbHMpID0+IHtcbiAgICBpZiAoIXZhbGlkVmFsdWVzLmluY2x1ZGVzKHZhbHVlKSkge1xuICAgICAgICBkZXRhaWxzWyd2YWxpZFZhbHVlRGVzY3JpcHRpb24nXSA9IGBWYWxpZCB2YWx1ZXMgYXJlICR7SlNPTi5zdHJpbmdpZnkodmFsaWRWYWx1ZXMpfS5gO1xuICAgICAgICB0aHJvdyBuZXcgV29ya2JveEVycm9yKCdpbnZhbGlkLXZhbHVlJywgZGV0YWlscyk7XG4gICAgfVxufTtcbmNvbnN0IGlzQXJyYXlPZkNsYXNzID0gKHZhbHVlLCBcbi8vIE5lZWQgZ2VuZXJhbCB0eXBlIHRvIGRvIGNoZWNrIGxhdGVyLlxuZXhwZWN0ZWRDbGFzcywgLy8gZXNsaW50LWRpc2FibGUtbGluZVxuZGV0YWlscykgPT4ge1xuICAgIGNvbnN0IGVycm9yID0gbmV3IFdvcmtib3hFcnJvcignbm90LWFycmF5LW9mLWNsYXNzJywgZGV0YWlscyk7XG4gICAgaWYgKCFBcnJheS5pc0FycmF5KHZhbHVlKSkge1xuICAgICAgICB0aHJvdyBlcnJvcjtcbiAgICB9XG4gICAgZm9yIChjb25zdCBpdGVtIG9mIHZhbHVlKSB7XG4gICAgICAgIGlmICghKGl0ZW0gaW5zdGFuY2VvZiBleHBlY3RlZENsYXNzKSkge1xuICAgICAgICAgICAgdGhyb3cgZXJyb3I7XG4gICAgICAgIH1cbiAgICB9XG59O1xuY29uc3QgZmluYWxBc3NlcnRFeHBvcnRzID0gcHJvY2Vzcy5lbnYuTk9ERV9FTlYgPT09ICdwcm9kdWN0aW9uJ1xuICAgID8gbnVsbFxuICAgIDoge1xuICAgICAgICBoYXNNZXRob2QsXG4gICAgICAgIGlzQXJyYXksXG4gICAgICAgIGlzSW5zdGFuY2UsXG4gICAgICAgIGlzT25lT2YsXG4gICAgICAgIGlzVHlwZSxcbiAgICAgICAgaXNBcnJheU9mQ2xhc3MsXG4gICAgfTtcbmV4cG9ydCB7IGZpbmFsQXNzZXJ0RXhwb3J0cyBhcyBhc3NlcnQgfTtcbiIsICIvKlxuICBDb3B5cmlnaHQgMjAxOCBHb29nbGUgTExDXG5cbiAgVXNlIG9mIHRoaXMgc291cmNlIGNvZGUgaXMgZ292ZXJuZWQgYnkgYW4gTUlULXN0eWxlXG4gIGxpY2Vuc2UgdGhhdCBjYW4gYmUgZm91bmQgaW4gdGhlIExJQ0VOU0UgZmlsZSBvciBhdFxuICBodHRwczovL29wZW5zb3VyY2Uub3JnL2xpY2Vuc2VzL01JVC5cbiovXG5pbXBvcnQgJy4uL192ZXJzaW9uLmpzJztcbi8vIENhbGxiYWNrcyB0byBiZSBleGVjdXRlZCB3aGVuZXZlciB0aGVyZSdzIGEgcXVvdGEgZXJyb3IuXG4vLyBDYW4ndCBjaGFuZ2UgRnVuY3Rpb24gdHlwZSByaWdodCBub3cuXG4vLyBlc2xpbnQtZGlzYWJsZS1uZXh0LWxpbmUgQHR5cGVzY3JpcHQtZXNsaW50L2Jhbi10eXBlc1xuY29uc3QgcXVvdGFFcnJvckNhbGxiYWNrcyA9IG5ldyBTZXQoKTtcbmV4cG9ydCB7IHF1b3RhRXJyb3JDYWxsYmFja3MgfTtcbiIsICIvKlxuICBDb3B5cmlnaHQgMjAxOSBHb29nbGUgTExDXG5cbiAgVXNlIG9mIHRoaXMgc291cmNlIGNvZGUgaXMgZ292ZXJuZWQgYnkgYW4gTUlULXN0eWxlXG4gIGxpY2Vuc2UgdGhhdCBjYW4gYmUgZm91bmQgaW4gdGhlIExJQ0VOU0UgZmlsZSBvciBhdFxuICBodHRwczovL29wZW5zb3VyY2Uub3JnL2xpY2Vuc2VzL01JVC5cbiovXG5pbXBvcnQgeyBsb2dnZXIgfSBmcm9tICcuL19wcml2YXRlL2xvZ2dlci5qcyc7XG5pbXBvcnQgeyBhc3NlcnQgfSBmcm9tICcuL19wcml2YXRlL2Fzc2VydC5qcyc7XG5pbXBvcnQgeyBxdW90YUVycm9yQ2FsbGJhY2tzIH0gZnJvbSAnLi9tb2RlbHMvcXVvdGFFcnJvckNhbGxiYWNrcy5qcyc7XG5pbXBvcnQgJy4vX3ZlcnNpb24uanMnO1xuLyoqXG4gKiBBZGRzIGEgZnVuY3Rpb24gdG8gdGhlIHNldCBvZiBxdW90YUVycm9yQ2FsbGJhY2tzIHRoYXQgd2lsbCBiZSBleGVjdXRlZCBpZlxuICogdGhlcmUncyBhIHF1b3RhIGVycm9yLlxuICpcbiAqIEBwYXJhbSB7RnVuY3Rpb259IGNhbGxiYWNrXG4gKiBAbWVtYmVyb2Ygd29ya2JveC1jb3JlXG4gKi9cbi8vIENhbid0IGNoYW5nZSBGdW5jdGlvbiB0eXBlXG4vLyBlc2xpbnQtZGlzYWJsZS1uZXh0LWxpbmUgQHR5cGVzY3JpcHQtZXNsaW50L2Jhbi10eXBlc1xuZnVuY3Rpb24gcmVnaXN0ZXJRdW90YUVycm9yQ2FsbGJhY2soY2FsbGJhY2spIHtcbiAgICBpZiAocHJvY2Vzcy5lbnYuTk9ERV9FTlYgIT09ICdwcm9kdWN0aW9uJykge1xuICAgICAgICBhc3NlcnQuaXNUeXBlKGNhbGxiYWNrLCAnZnVuY3Rpb24nLCB7XG4gICAgICAgICAgICBtb2R1bGVOYW1lOiAnd29ya2JveC1jb3JlJyxcbiAgICAgICAgICAgIGZ1bmNOYW1lOiAncmVnaXN0ZXInLFxuICAgICAgICAgICAgcGFyYW1OYW1lOiAnY2FsbGJhY2snLFxuICAgICAgICB9KTtcbiAgICB9XG4gICAgcXVvdGFFcnJvckNhbGxiYWNrcy5hZGQoY2FsbGJhY2spO1xuICAgIGlmIChwcm9jZXNzLmVudi5OT0RFX0VOViAhPT0gJ3Byb2R1Y3Rpb24nKSB7XG4gICAgICAgIGxvZ2dlci5sb2coJ1JlZ2lzdGVyZWQgYSBjYWxsYmFjayB0byByZXNwb25kIHRvIHF1b3RhIGVycm9ycy4nLCBjYWxsYmFjayk7XG4gICAgfVxufVxuZXhwb3J0IHsgcmVnaXN0ZXJRdW90YUVycm9yQ2FsbGJhY2sgfTtcbiIsICIvKlxuICBDb3B5cmlnaHQgMjAxOCBHb29nbGUgTExDXG5cbiAgVXNlIG9mIHRoaXMgc291cmNlIGNvZGUgaXMgZ292ZXJuZWQgYnkgYW4gTUlULXN0eWxlXG4gIGxpY2Vuc2UgdGhhdCBjYW4gYmUgZm91bmQgaW4gdGhlIExJQ0VOU0UgZmlsZSBvciBhdFxuICBodHRwczovL29wZW5zb3VyY2Uub3JnL2xpY2Vuc2VzL01JVC5cbiovXG5pbXBvcnQgJy4uL192ZXJzaW9uLmpzJztcbmNvbnN0IF9jYWNoZU5hbWVEZXRhaWxzID0ge1xuICAgIGdvb2dsZUFuYWx5dGljczogJ2dvb2dsZUFuYWx5dGljcycsXG4gICAgcHJlY2FjaGU6ICdwcmVjYWNoZS12MicsXG4gICAgcHJlZml4OiAnd29ya2JveCcsXG4gICAgcnVudGltZTogJ3J1bnRpbWUnLFxuICAgIHN1ZmZpeDogdHlwZW9mIHJlZ2lzdHJhdGlvbiAhPT0gJ3VuZGVmaW5lZCcgPyByZWdpc3RyYXRpb24uc2NvcGUgOiAnJyxcbn07XG5jb25zdCBfY3JlYXRlQ2FjaGVOYW1lID0gKGNhY2hlTmFtZSkgPT4ge1xuICAgIHJldHVybiBbX2NhY2hlTmFtZURldGFpbHMucHJlZml4LCBjYWNoZU5hbWUsIF9jYWNoZU5hbWVEZXRhaWxzLnN1ZmZpeF1cbiAgICAgICAgLmZpbHRlcigodmFsdWUpID0+IHZhbHVlICYmIHZhbHVlLmxlbmd0aCA+IDApXG4gICAgICAgIC5qb2luKCctJyk7XG59O1xuY29uc3QgZWFjaENhY2hlTmFtZURldGFpbCA9IChmbikgPT4ge1xuICAgIGZvciAoY29uc3Qga2V5IG9mIE9iamVjdC5rZXlzKF9jYWNoZU5hbWVEZXRhaWxzKSkge1xuICAgICAgICBmbihrZXkpO1xuICAgIH1cbn07XG5leHBvcnQgY29uc3QgY2FjaGVOYW1lcyA9IHtcbiAgICB1cGRhdGVEZXRhaWxzOiAoZGV0YWlscykgPT4ge1xuICAgICAgICBlYWNoQ2FjaGVOYW1lRGV0YWlsKChrZXkpID0+IHtcbiAgICAgICAgICAgIGlmICh0eXBlb2YgZGV0YWlsc1trZXldID09PSAnc3RyaW5nJykge1xuICAgICAgICAgICAgICAgIF9jYWNoZU5hbWVEZXRhaWxzW2tleV0gPSBkZXRhaWxzW2tleV07XG4gICAgICAgICAgICB9XG4gICAgICAgIH0pO1xuICAgIH0sXG4gICAgZ2V0R29vZ2xlQW5hbHl0aWNzTmFtZTogKHVzZXJDYWNoZU5hbWUpID0+IHtcbiAgICAgICAgcmV0dXJuIHVzZXJDYWNoZU5hbWUgfHwgX2NyZWF0ZUNhY2hlTmFtZShfY2FjaGVOYW1lRGV0YWlscy5nb29nbGVBbmFseXRpY3MpO1xuICAgIH0sXG4gICAgZ2V0UHJlY2FjaGVOYW1lOiAodXNlckNhY2hlTmFtZSkgPT4ge1xuICAgICAgICByZXR1cm4gdXNlckNhY2hlTmFtZSB8fCBfY3JlYXRlQ2FjaGVOYW1lKF9jYWNoZU5hbWVEZXRhaWxzLnByZWNhY2hlKTtcbiAgICB9LFxuICAgIGdldFByZWZpeDogKCkgPT4ge1xuICAgICAgICByZXR1cm4gX2NhY2hlTmFtZURldGFpbHMucHJlZml4O1xuICAgIH0sXG4gICAgZ2V0UnVudGltZU5hbWU6ICh1c2VyQ2FjaGVOYW1lKSA9PiB7XG4gICAgICAgIHJldHVybiB1c2VyQ2FjaGVOYW1lIHx8IF9jcmVhdGVDYWNoZU5hbWUoX2NhY2hlTmFtZURldGFpbHMucnVudGltZSk7XG4gICAgfSxcbiAgICBnZXRTdWZmaXg6ICgpID0+IHtcbiAgICAgICAgcmV0dXJuIF9jYWNoZU5hbWVEZXRhaWxzLnN1ZmZpeDtcbiAgICB9LFxufTtcbiIsICIvKlxuICBDb3B5cmlnaHQgMjAyMCBHb29nbGUgTExDXG4gIFVzZSBvZiB0aGlzIHNvdXJjZSBjb2RlIGlzIGdvdmVybmVkIGJ5IGFuIE1JVC1zdHlsZVxuICBsaWNlbnNlIHRoYXQgY2FuIGJlIGZvdW5kIGluIHRoZSBMSUNFTlNFIGZpbGUgb3IgYXRcbiAgaHR0cHM6Ly9vcGVuc291cmNlLm9yZy9saWNlbnNlcy9NSVQuXG4qL1xuaW1wb3J0ICcuLi9fdmVyc2lvbi5qcyc7XG5mdW5jdGlvbiBzdHJpcFBhcmFtcyhmdWxsVVJMLCBpZ25vcmVQYXJhbXMpIHtcbiAgICBjb25zdCBzdHJpcHBlZFVSTCA9IG5ldyBVUkwoZnVsbFVSTCk7XG4gICAgZm9yIChjb25zdCBwYXJhbSBvZiBpZ25vcmVQYXJhbXMpIHtcbiAgICAgICAgc3RyaXBwZWRVUkwuc2VhcmNoUGFyYW1zLmRlbGV0ZShwYXJhbSk7XG4gICAgfVxuICAgIHJldHVybiBzdHJpcHBlZFVSTC5ocmVmO1xufVxuLyoqXG4gKiBNYXRjaGVzIGFuIGl0ZW0gaW4gdGhlIGNhY2hlLCBpZ25vcmluZyBzcGVjaWZpYyBVUkwgcGFyYW1zLiBUaGlzIGlzIHNpbWlsYXJcbiAqIHRvIHRoZSBgaWdub3JlU2VhcmNoYCBvcHRpb24sIGJ1dCBpdCBhbGxvd3MgeW91IHRvIGlnbm9yZSBqdXN0IHNwZWNpZmljXG4gKiBwYXJhbXMgKHdoaWxlIGNvbnRpbnVpbmcgdG8gbWF0Y2ggb24gdGhlIG90aGVycykuXG4gKlxuICogQHByaXZhdGVcbiAqIEBwYXJhbSB7Q2FjaGV9IGNhY2hlXG4gKiBAcGFyYW0ge1JlcXVlc3R9IHJlcXVlc3RcbiAqIEBwYXJhbSB7T2JqZWN0fSBtYXRjaE9wdGlvbnNcbiAqIEBwYXJhbSB7QXJyYXk8c3RyaW5nPn0gaWdub3JlUGFyYW1zXG4gKiBAcmV0dXJuIHtQcm9taXNlPFJlc3BvbnNlfHVuZGVmaW5lZD59XG4gKi9cbmFzeW5jIGZ1bmN0aW9uIGNhY2hlTWF0Y2hJZ25vcmVQYXJhbXMoY2FjaGUsIHJlcXVlc3QsIGlnbm9yZVBhcmFtcywgbWF0Y2hPcHRpb25zKSB7XG4gICAgY29uc3Qgc3RyaXBwZWRSZXF1ZXN0VVJMID0gc3RyaXBQYXJhbXMocmVxdWVzdC51cmwsIGlnbm9yZVBhcmFtcyk7XG4gICAgLy8gSWYgdGhlIHJlcXVlc3QgZG9lc24ndCBpbmNsdWRlIGFueSBpZ25vcmVkIHBhcmFtcywgbWF0Y2ggYXMgbm9ybWFsLlxuICAgIGlmIChyZXF1ZXN0LnVybCA9PT0gc3RyaXBwZWRSZXF1ZXN0VVJMKSB7XG4gICAgICAgIHJldHVybiBjYWNoZS5tYXRjaChyZXF1ZXN0LCBtYXRjaE9wdGlvbnMpO1xuICAgIH1cbiAgICAvLyBPdGhlcndpc2UsIG1hdGNoIGJ5IGNvbXBhcmluZyBrZXlzXG4gICAgY29uc3Qga2V5c09wdGlvbnMgPSBPYmplY3QuYXNzaWduKE9iamVjdC5hc3NpZ24oe30sIG1hdGNoT3B0aW9ucyksIHsgaWdub3JlU2VhcmNoOiB0cnVlIH0pO1xuICAgIGNvbnN0IGNhY2hlS2V5cyA9IGF3YWl0IGNhY2hlLmtleXMocmVxdWVzdCwga2V5c09wdGlvbnMpO1xuICAgIGZvciAoY29uc3QgY2FjaGVLZXkgb2YgY2FjaGVLZXlzKSB7XG4gICAgICAgIGNvbnN0IHN0cmlwcGVkQ2FjaGVLZXlVUkwgPSBzdHJpcFBhcmFtcyhjYWNoZUtleS51cmwsIGlnbm9yZVBhcmFtcyk7XG4gICAgICAgIGlmIChzdHJpcHBlZFJlcXVlc3RVUkwgPT09IHN0cmlwcGVkQ2FjaGVLZXlVUkwpIHtcbiAgICAgICAgICAgIHJldHVybiBjYWNoZS5tYXRjaChjYWNoZUtleSwgbWF0Y2hPcHRpb25zKTtcbiAgICAgICAgfVxuICAgIH1cbiAgICByZXR1cm47XG59XG5leHBvcnQgeyBjYWNoZU1hdGNoSWdub3JlUGFyYW1zIH07XG4iLCAiLypcbiAgQ29weXJpZ2h0IDIwMTkgR29vZ2xlIExMQ1xuXG4gIFVzZSBvZiB0aGlzIHNvdXJjZSBjb2RlIGlzIGdvdmVybmVkIGJ5IGFuIE1JVC1zdHlsZVxuICBsaWNlbnNlIHRoYXQgY2FuIGJlIGZvdW5kIGluIHRoZSBMSUNFTlNFIGZpbGUgb3IgYXRcbiAgaHR0cHM6Ly9vcGVuc291cmNlLm9yZy9saWNlbnNlcy9NSVQuXG4qL1xuaW1wb3J0ICcuLi9fdmVyc2lvbi5qcyc7XG5sZXQgc3VwcG9ydFN0YXR1cztcbi8qKlxuICogQSB1dGlsaXR5IGZ1bmN0aW9uIHRoYXQgZGV0ZXJtaW5lcyB3aGV0aGVyIHRoZSBjdXJyZW50IGJyb3dzZXIgc3VwcG9ydHNcbiAqIGNvbnN0cnVjdGluZyBhIG5ldyBgUmVzcG9uc2VgIGZyb20gYSBgcmVzcG9uc2UuYm9keWAgc3RyZWFtLlxuICpcbiAqIEByZXR1cm4ge2Jvb2xlYW59IGB0cnVlYCwgaWYgdGhlIGN1cnJlbnQgYnJvd3NlciBjYW4gc3VjY2Vzc2Z1bGx5XG4gKiAgICAgY29uc3RydWN0IGEgYFJlc3BvbnNlYCBmcm9tIGEgYHJlc3BvbnNlLmJvZHlgIHN0cmVhbSwgYGZhbHNlYCBvdGhlcndpc2UuXG4gKlxuICogQHByaXZhdGVcbiAqL1xuZnVuY3Rpb24gY2FuQ29uc3RydWN0UmVzcG9uc2VGcm9tQm9keVN0cmVhbSgpIHtcbiAgICBpZiAoc3VwcG9ydFN0YXR1cyA9PT0gdW5kZWZpbmVkKSB7XG4gICAgICAgIGNvbnN0IHRlc3RSZXNwb25zZSA9IG5ldyBSZXNwb25zZSgnJyk7XG4gICAgICAgIGlmICgnYm9keScgaW4gdGVzdFJlc3BvbnNlKSB7XG4gICAgICAgICAgICB0cnkge1xuICAgICAgICAgICAgICAgIG5ldyBSZXNwb25zZSh0ZXN0UmVzcG9uc2UuYm9keSk7XG4gICAgICAgICAgICAgICAgc3VwcG9ydFN0YXR1cyA9IHRydWU7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBjYXRjaCAoZXJyb3IpIHtcbiAgICAgICAgICAgICAgICBzdXBwb3J0U3RhdHVzID0gZmFsc2U7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgICAgc3VwcG9ydFN0YXR1cyA9IGZhbHNlO1xuICAgIH1cbiAgICByZXR1cm4gc3VwcG9ydFN0YXR1cztcbn1cbmV4cG9ydCB7IGNhbkNvbnN0cnVjdFJlc3BvbnNlRnJvbUJvZHlTdHJlYW0gfTtcbiIsICIvKlxuICBDb3B5cmlnaHQgMjAxOSBHb29nbGUgTExDXG4gIFVzZSBvZiB0aGlzIHNvdXJjZSBjb2RlIGlzIGdvdmVybmVkIGJ5IGFuIE1JVC1zdHlsZVxuICBsaWNlbnNlIHRoYXQgY2FuIGJlIGZvdW5kIGluIHRoZSBMSUNFTlNFIGZpbGUgb3IgYXRcbiAgaHR0cHM6Ly9vcGVuc291cmNlLm9yZy9saWNlbnNlcy9NSVQuXG4qL1xuaW1wb3J0ICcuLi9fdmVyc2lvbi5qcyc7XG4vKipcbiAqIEEgaGVscGVyIGZ1bmN0aW9uIHRoYXQgcHJldmVudHMgYSBwcm9taXNlIGZyb20gYmVpbmcgZmxhZ2dlZCBhcyB1bnVzZWQuXG4gKlxuICogQHByaXZhdGVcbiAqKi9cbmV4cG9ydCBmdW5jdGlvbiBkb250V2FpdEZvcihwcm9taXNlKSB7XG4gICAgLy8gRWZmZWN0aXZlIG5vLW9wLlxuICAgIHZvaWQgcHJvbWlzZS50aGVuKCgpID0+IHsgfSk7XG59XG4iLCAiLypcbiAgQ29weXJpZ2h0IDIwMTggR29vZ2xlIExMQ1xuXG4gIFVzZSBvZiB0aGlzIHNvdXJjZSBjb2RlIGlzIGdvdmVybmVkIGJ5IGFuIE1JVC1zdHlsZVxuICBsaWNlbnNlIHRoYXQgY2FuIGJlIGZvdW5kIGluIHRoZSBMSUNFTlNFIGZpbGUgb3IgYXRcbiAgaHR0cHM6Ly9vcGVuc291cmNlLm9yZy9saWNlbnNlcy9NSVQuXG4qL1xuaW1wb3J0ICcuLi9fdmVyc2lvbi5qcyc7XG4vKipcbiAqIFRoZSBEZWZlcnJlZCBjbGFzcyBjb21wb3NlcyBQcm9taXNlcyBpbiBhIHdheSB0aGF0IGFsbG93cyBmb3IgdGhlbSB0byBiZVxuICogcmVzb2x2ZWQgb3IgcmVqZWN0ZWQgZnJvbSBvdXRzaWRlIHRoZSBjb25zdHJ1Y3Rvci4gSW4gbW9zdCBjYXNlcyBwcm9taXNlc1xuICogc2hvdWxkIGJlIHVzZWQgZGlyZWN0bHksIGJ1dCBEZWZlcnJlZHMgY2FuIGJlIG5lY2Vzc2FyeSB3aGVuIHRoZSBsb2dpYyB0b1xuICogcmVzb2x2ZSBhIHByb21pc2UgbXVzdCBiZSBzZXBhcmF0ZS5cbiAqXG4gKiBAcHJpdmF0ZVxuICovXG5jbGFzcyBEZWZlcnJlZCB7XG4gICAgLyoqXG4gICAgICogQ3JlYXRlcyBhIHByb21pc2UgYW5kIGV4cG9zZXMgaXRzIHJlc29sdmUgYW5kIHJlamVjdCBmdW5jdGlvbnMgYXMgbWV0aG9kcy5cbiAgICAgKi9cbiAgICBjb25zdHJ1Y3RvcigpIHtcbiAgICAgICAgdGhpcy5wcm9taXNlID0gbmV3IFByb21pc2UoKHJlc29sdmUsIHJlamVjdCkgPT4ge1xuICAgICAgICAgICAgdGhpcy5yZXNvbHZlID0gcmVzb2x2ZTtcbiAgICAgICAgICAgIHRoaXMucmVqZWN0ID0gcmVqZWN0O1xuICAgICAgICB9KTtcbiAgICB9XG59XG5leHBvcnQgeyBEZWZlcnJlZCB9O1xuIiwgIi8qXG4gIENvcHlyaWdodCAyMDE4IEdvb2dsZSBMTENcblxuICBVc2Ugb2YgdGhpcyBzb3VyY2UgY29kZSBpcyBnb3Zlcm5lZCBieSBhbiBNSVQtc3R5bGVcbiAgbGljZW5zZSB0aGF0IGNhbiBiZSBmb3VuZCBpbiB0aGUgTElDRU5TRSBmaWxlIG9yIGF0XG4gIGh0dHBzOi8vb3BlbnNvdXJjZS5vcmcvbGljZW5zZXMvTUlULlxuKi9cbmltcG9ydCB7IGxvZ2dlciB9IGZyb20gJy4uL19wcml2YXRlL2xvZ2dlci5qcyc7XG5pbXBvcnQgeyBxdW90YUVycm9yQ2FsbGJhY2tzIH0gZnJvbSAnLi4vbW9kZWxzL3F1b3RhRXJyb3JDYWxsYmFja3MuanMnO1xuaW1wb3J0ICcuLi9fdmVyc2lvbi5qcyc7XG4vKipcbiAqIFJ1bnMgYWxsIG9mIHRoZSBjYWxsYmFjayBmdW5jdGlvbnMsIG9uZSBhdCBhIHRpbWUgc2VxdWVudGlhbGx5LCBpbiB0aGUgb3JkZXJcbiAqIGluIHdoaWNoIHRoZXkgd2VyZSByZWdpc3RlcmVkLlxuICpcbiAqIEBtZW1iZXJvZiB3b3JrYm94LWNvcmVcbiAqIEBwcml2YXRlXG4gKi9cbmFzeW5jIGZ1bmN0aW9uIGV4ZWN1dGVRdW90YUVycm9yQ2FsbGJhY2tzKCkge1xuICAgIGlmIChwcm9jZXNzLmVudi5OT0RFX0VOViAhPT0gJ3Byb2R1Y3Rpb24nKSB7XG4gICAgICAgIGxvZ2dlci5sb2coYEFib3V0IHRvIHJ1biAke3F1b3RhRXJyb3JDYWxsYmFja3Muc2l6ZX0gYCArXG4gICAgICAgICAgICBgY2FsbGJhY2tzIHRvIGNsZWFuIHVwIGNhY2hlcy5gKTtcbiAgICB9XG4gICAgZm9yIChjb25zdCBjYWxsYmFjayBvZiBxdW90YUVycm9yQ2FsbGJhY2tzKSB7XG4gICAgICAgIGF3YWl0IGNhbGxiYWNrKCk7XG4gICAgICAgIGlmIChwcm9jZXNzLmVudi5OT0RFX0VOViAhPT0gJ3Byb2R1Y3Rpb24nKSB7XG4gICAgICAgICAgICBsb2dnZXIubG9nKGNhbGxiYWNrLCAnaXMgY29tcGxldGUuJyk7XG4gICAgICAgIH1cbiAgICB9XG4gICAgaWYgKHByb2Nlc3MuZW52Lk5PREVfRU5WICE9PSAncHJvZHVjdGlvbicpIHtcbiAgICAgICAgbG9nZ2VyLmxvZygnRmluaXNoZWQgcnVubmluZyBjYWxsYmFja3MuJyk7XG4gICAgfVxufVxuZXhwb3J0IHsgZXhlY3V0ZVF1b3RhRXJyb3JDYWxsYmFja3MgfTtcbiIsICIvKlxuICBDb3B5cmlnaHQgMjAxOCBHb29nbGUgTExDXG5cbiAgVXNlIG9mIHRoaXMgc291cmNlIGNvZGUgaXMgZ292ZXJuZWQgYnkgYW4gTUlULXN0eWxlXG4gIGxpY2Vuc2UgdGhhdCBjYW4gYmUgZm91bmQgaW4gdGhlIExJQ0VOU0UgZmlsZSBvciBhdFxuICBodHRwczovL29wZW5zb3VyY2Uub3JnL2xpY2Vuc2VzL01JVC5cbiovXG5pbXBvcnQgJy4uL192ZXJzaW9uLmpzJztcbmNvbnN0IGdldEZyaWVuZGx5VVJMID0gKHVybCkgPT4ge1xuICAgIGNvbnN0IHVybE9iaiA9IG5ldyBVUkwoU3RyaW5nKHVybCksIGxvY2F0aW9uLmhyZWYpO1xuICAgIC8vIFNlZSBodHRwczovL2dpdGh1Yi5jb20vR29vZ2xlQ2hyb21lL3dvcmtib3gvaXNzdWVzLzIzMjNcbiAgICAvLyBXZSB3YW50IHRvIGluY2x1ZGUgZXZlcnl0aGluZywgZXhjZXB0IGZvciB0aGUgb3JpZ2luIGlmIGl0J3Mgc2FtZS1vcmlnaW4uXG4gICAgcmV0dXJuIHVybE9iai5ocmVmLnJlcGxhY2UobmV3IFJlZ0V4cChgXiR7bG9jYXRpb24ub3JpZ2lufWApLCAnJyk7XG59O1xuZXhwb3J0IHsgZ2V0RnJpZW5kbHlVUkwgfTtcbiIsICIvKlxuICBDb3B5cmlnaHQgMjAxOSBHb29nbGUgTExDXG4gIFVzZSBvZiB0aGlzIHNvdXJjZSBjb2RlIGlzIGdvdmVybmVkIGJ5IGFuIE1JVC1zdHlsZVxuICBsaWNlbnNlIHRoYXQgY2FuIGJlIGZvdW5kIGluIHRoZSBMSUNFTlNFIGZpbGUgb3IgYXRcbiAgaHR0cHM6Ly9vcGVuc291cmNlLm9yZy9saWNlbnNlcy9NSVQuXG4qL1xuaW1wb3J0ICcuLi9fdmVyc2lvbi5qcyc7XG4vKipcbiAqIFJldHVybnMgYSBwcm9taXNlIHRoYXQgcmVzb2x2ZXMgYW5kIHRoZSBwYXNzZWQgbnVtYmVyIG9mIG1pbGxpc2Vjb25kcy5cbiAqIFRoaXMgdXRpbGl0eSBpcyBhbiBhc3luYy9hd2FpdC1mcmllbmRseSB2ZXJzaW9uIG9mIGBzZXRUaW1lb3V0YC5cbiAqXG4gKiBAcGFyYW0ge251bWJlcn0gbXNcbiAqIEByZXR1cm4ge1Byb21pc2V9XG4gKiBAcHJpdmF0ZVxuICovXG5leHBvcnQgZnVuY3Rpb24gdGltZW91dChtcykge1xuICAgIHJldHVybiBuZXcgUHJvbWlzZSgocmVzb2x2ZSkgPT4gc2V0VGltZW91dChyZXNvbHZlLCBtcykpO1xufVxuIiwgIi8qXG4gIENvcHlyaWdodCAyMDIwIEdvb2dsZSBMTENcbiAgVXNlIG9mIHRoaXMgc291cmNlIGNvZGUgaXMgZ292ZXJuZWQgYnkgYW4gTUlULXN0eWxlXG4gIGxpY2Vuc2UgdGhhdCBjYW4gYmUgZm91bmQgaW4gdGhlIExJQ0VOU0UgZmlsZSBvciBhdFxuICBodHRwczovL29wZW5zb3VyY2Uub3JnL2xpY2Vuc2VzL01JVC5cbiovXG5pbXBvcnQgJy4uL192ZXJzaW9uLmpzJztcbi8qKlxuICogQSB1dGlsaXR5IG1ldGhvZCB0aGF0IG1ha2VzIGl0IGVhc2llciB0byB1c2UgYGV2ZW50LndhaXRVbnRpbGAgd2l0aFxuICogYXN5bmMgZnVuY3Rpb25zIGFuZCByZXR1cm4gdGhlIHJlc3VsdC5cbiAqXG4gKiBAcGFyYW0ge0V4dGVuZGFibGVFdmVudH0gZXZlbnRcbiAqIEBwYXJhbSB7RnVuY3Rpb259IGFzeW5jRm5cbiAqIEByZXR1cm4ge0Z1bmN0aW9ufVxuICogQHByaXZhdGVcbiAqL1xuZnVuY3Rpb24gd2FpdFVudGlsKGV2ZW50LCBhc3luY0ZuKSB7XG4gICAgY29uc3QgcmV0dXJuUHJvbWlzZSA9IGFzeW5jRm4oKTtcbiAgICBldmVudC53YWl0VW50aWwocmV0dXJuUHJvbWlzZSk7XG4gICAgcmV0dXJuIHJldHVyblByb21pc2U7XG59XG5leHBvcnQgeyB3YWl0VW50aWwgfTtcbiIsICIvKlxuICBDb3B5cmlnaHQgMjAxOSBHb29nbGUgTExDXG5cbiAgVXNlIG9mIHRoaXMgc291cmNlIGNvZGUgaXMgZ292ZXJuZWQgYnkgYW4gTUlULXN0eWxlXG4gIGxpY2Vuc2UgdGhhdCBjYW4gYmUgZm91bmQgaW4gdGhlIExJQ0VOU0UgZmlsZSBvciBhdFxuICBodHRwczovL29wZW5zb3VyY2Uub3JnL2xpY2Vuc2VzL01JVC5cbiovXG5pbXBvcnQgeyBjYW5Db25zdHJ1Y3RSZXNwb25zZUZyb21Cb2R5U3RyZWFtIH0gZnJvbSAnLi9fcHJpdmF0ZS9jYW5Db25zdHJ1Y3RSZXNwb25zZUZyb21Cb2R5U3RyZWFtLmpzJztcbmltcG9ydCB7IFdvcmtib3hFcnJvciB9IGZyb20gJy4vX3ByaXZhdGUvV29ya2JveEVycm9yLmpzJztcbmltcG9ydCAnLi9fdmVyc2lvbi5qcyc7XG4vKipcbiAqIEFsbG93cyBkZXZlbG9wZXJzIHRvIGNvcHkgYSByZXNwb25zZSBhbmQgbW9kaWZ5IGl0cyBgaGVhZGVyc2AsIGBzdGF0dXNgLFxuICogb3IgYHN0YXR1c1RleHRgIHZhbHVlcyAodGhlIHZhbHVlcyBzZXR0YWJsZSB2aWEgYVxuICogW2BSZXNwb25zZUluaXRgXXtAbGluayBodHRwczovL2RldmVsb3Blci5tb3ppbGxhLm9yZy9lbi1VUy9kb2NzL1dlYi9BUEkvUmVzcG9uc2UvUmVzcG9uc2UjU3ludGF4fVxuICogb2JqZWN0IGluIHRoZSBjb25zdHJ1Y3RvcikuXG4gKiBUbyBtb2RpZnkgdGhlc2UgdmFsdWVzLCBwYXNzIGEgZnVuY3Rpb24gYXMgdGhlIHNlY29uZCBhcmd1bWVudC4gVGhhdFxuICogZnVuY3Rpb24gd2lsbCBiZSBpbnZva2VkIHdpdGggYSBzaW5nbGUgb2JqZWN0IHdpdGggdGhlIHJlc3BvbnNlIHByb3BlcnRpZXNcbiAqIGB7aGVhZGVycywgc3RhdHVzLCBzdGF0dXNUZXh0fWAuIFRoZSByZXR1cm4gdmFsdWUgb2YgdGhpcyBmdW5jdGlvbiB3aWxsXG4gKiBiZSB1c2VkIGFzIHRoZSBgUmVzcG9uc2VJbml0YCBmb3IgdGhlIG5ldyBgUmVzcG9uc2VgLiBUbyBjaGFuZ2UgdGhlIHZhbHVlc1xuICogZWl0aGVyIG1vZGlmeSB0aGUgcGFzc2VkIHBhcmFtZXRlcihzKSBhbmQgcmV0dXJuIGl0LCBvciByZXR1cm4gYSB0b3RhbGx5XG4gKiBuZXcgb2JqZWN0LlxuICpcbiAqIFRoaXMgbWV0aG9kIGlzIGludGVudGlvbmFsbHkgbGltaXRlZCB0byBzYW1lLW9yaWdpbiByZXNwb25zZXMsIHJlZ2FyZGxlc3Mgb2ZcbiAqIHdoZXRoZXIgQ09SUyB3YXMgdXNlZCBvciBub3QuXG4gKlxuICogQHBhcmFtIHtSZXNwb25zZX0gcmVzcG9uc2VcbiAqIEBwYXJhbSB7RnVuY3Rpb259IG1vZGlmaWVyXG4gKiBAbWVtYmVyb2Ygd29ya2JveC1jb3JlXG4gKi9cbmFzeW5jIGZ1bmN0aW9uIGNvcHlSZXNwb25zZShyZXNwb25zZSwgbW9kaWZpZXIpIHtcbiAgICBsZXQgb3JpZ2luID0gbnVsbDtcbiAgICAvLyBJZiByZXNwb25zZS51cmwgaXNuJ3Qgc2V0LCBhc3N1bWUgaXQncyBjcm9zcy1vcmlnaW4gYW5kIGtlZXAgb3JpZ2luIG51bGwuXG4gICAgaWYgKHJlc3BvbnNlLnVybCkge1xuICAgICAgICBjb25zdCByZXNwb25zZVVSTCA9IG5ldyBVUkwocmVzcG9uc2UudXJsKTtcbiAgICAgICAgb3JpZ2luID0gcmVzcG9uc2VVUkwub3JpZ2luO1xuICAgIH1cbiAgICBpZiAob3JpZ2luICE9PSBzZWxmLmxvY2F0aW9uLm9yaWdpbikge1xuICAgICAgICB0aHJvdyBuZXcgV29ya2JveEVycm9yKCdjcm9zcy1vcmlnaW4tY29weS1yZXNwb25zZScsIHsgb3JpZ2luIH0pO1xuICAgIH1cbiAgICBjb25zdCBjbG9uZWRSZXNwb25zZSA9IHJlc3BvbnNlLmNsb25lKCk7XG4gICAgLy8gQ3JlYXRlIGEgZnJlc2ggYFJlc3BvbnNlSW5pdGAgb2JqZWN0IGJ5IGNsb25pbmcgdGhlIGhlYWRlcnMuXG4gICAgY29uc3QgcmVzcG9uc2VJbml0ID0ge1xuICAgICAgICBoZWFkZXJzOiBuZXcgSGVhZGVycyhjbG9uZWRSZXNwb25zZS5oZWFkZXJzKSxcbiAgICAgICAgc3RhdHVzOiBjbG9uZWRSZXNwb25zZS5zdGF0dXMsXG4gICAgICAgIHN0YXR1c1RleHQ6IGNsb25lZFJlc3BvbnNlLnN0YXR1c1RleHQsXG4gICAgfTtcbiAgICAvLyBBcHBseSBhbnkgdXNlciBtb2RpZmljYXRpb25zLlxuICAgIGNvbnN0IG1vZGlmaWVkUmVzcG9uc2VJbml0ID0gbW9kaWZpZXIgPyBtb2RpZmllcihyZXNwb25zZUluaXQpIDogcmVzcG9uc2VJbml0O1xuICAgIC8vIENyZWF0ZSB0aGUgbmV3IHJlc3BvbnNlIGZyb20gdGhlIGJvZHkgc3RyZWFtIGFuZCBgUmVzcG9uc2VJbml0YFxuICAgIC8vIG1vZGlmaWNhdGlvbnMuIE5vdGU6IG5vdCBhbGwgYnJvd3NlcnMgc3VwcG9ydCB0aGUgUmVzcG9uc2UuYm9keSBzdHJlYW0sXG4gICAgLy8gc28gZmFsbCBiYWNrIHRvIHJlYWRpbmcgdGhlIGVudGlyZSBib2R5IGludG8gbWVtb3J5IGFzIGEgYmxvYi5cbiAgICBjb25zdCBib2R5ID0gY2FuQ29uc3RydWN0UmVzcG9uc2VGcm9tQm9keVN0cmVhbSgpXG4gICAgICAgID8gY2xvbmVkUmVzcG9uc2UuYm9keVxuICAgICAgICA6IGF3YWl0IGNsb25lZFJlc3BvbnNlLmJsb2IoKTtcbiAgICByZXR1cm4gbmV3IFJlc3BvbnNlKGJvZHksIG1vZGlmaWVkUmVzcG9uc2VJbml0KTtcbn1cbmV4cG9ydCB7IGNvcHlSZXNwb25zZSB9O1xuIiwgIi8qXG4gIENvcHlyaWdodCAyMDE5IEdvb2dsZSBMTENcblxuICBVc2Ugb2YgdGhpcyBzb3VyY2UgY29kZSBpcyBnb3Zlcm5lZCBieSBhbiBNSVQtc3R5bGVcbiAgbGljZW5zZSB0aGF0IGNhbiBiZSBmb3VuZCBpbiB0aGUgTElDRU5TRSBmaWxlIG9yIGF0XG4gIGh0dHBzOi8vb3BlbnNvdXJjZS5vcmcvbGljZW5zZXMvTUlULlxuKi9cbmltcG9ydCAnLi9fdmVyc2lvbi5qcyc7XG4vKipcbiAqIENsYWltIGFueSBjdXJyZW50bHkgYXZhaWxhYmxlIGNsaWVudHMgb25jZSB0aGUgc2VydmljZSB3b3JrZXJcbiAqIGJlY29tZXMgYWN0aXZlLiBUaGlzIGlzIG5vcm1hbGx5IHVzZWQgaW4gY29uanVuY3Rpb24gd2l0aCBgc2tpcFdhaXRpbmcoKWAuXG4gKlxuICogQG1lbWJlcm9mIHdvcmtib3gtY29yZVxuICovXG5mdW5jdGlvbiBjbGllbnRzQ2xhaW0oKSB7XG4gICAgc2VsZi5hZGRFdmVudExpc3RlbmVyKCdhY3RpdmF0ZScsICgpID0+IHNlbGYuY2xpZW50cy5jbGFpbSgpKTtcbn1cbmV4cG9ydCB7IGNsaWVudHNDbGFpbSB9O1xuIiwgIlwidXNlIHN0cmljdFwiO1xuLy8gQHRzLWlnbm9yZVxudHJ5IHtcbiAgICBzZWxmWyd3b3JrYm94OnByZWNhY2hpbmc6Ny4yLjAnXSAmJiBfKCk7XG59XG5jYXRjaCAoZSkgeyB9XG4iLCAiLypcbiAgQ29weXJpZ2h0IDIwMTggR29vZ2xlIExMQ1xuXG4gIFVzZSBvZiB0aGlzIHNvdXJjZSBjb2RlIGlzIGdvdmVybmVkIGJ5IGFuIE1JVC1zdHlsZVxuICBsaWNlbnNlIHRoYXQgY2FuIGJlIGZvdW5kIGluIHRoZSBMSUNFTlNFIGZpbGUgb3IgYXRcbiAgaHR0cHM6Ly9vcGVuc291cmNlLm9yZy9saWNlbnNlcy9NSVQuXG4qL1xuaW1wb3J0IHsgV29ya2JveEVycm9yIH0gZnJvbSAnd29ya2JveC1jb3JlL19wcml2YXRlL1dvcmtib3hFcnJvci5qcyc7XG5pbXBvcnQgJy4uL192ZXJzaW9uLmpzJztcbi8vIE5hbWUgb2YgdGhlIHNlYXJjaCBwYXJhbWV0ZXIgdXNlZCB0byBzdG9yZSByZXZpc2lvbiBpbmZvLlxuY29uc3QgUkVWSVNJT05fU0VBUkNIX1BBUkFNID0gJ19fV0JfUkVWSVNJT05fXyc7XG4vKipcbiAqIENvbnZlcnRzIGEgbWFuaWZlc3QgZW50cnkgaW50byBhIHZlcnNpb25lZCBVUkwgc3VpdGFibGUgZm9yIHByZWNhY2hpbmcuXG4gKlxuICogQHBhcmFtIHtPYmplY3R8c3RyaW5nfSBlbnRyeVxuICogQHJldHVybiB7c3RyaW5nfSBBIFVSTCB3aXRoIHZlcnNpb25pbmcgaW5mby5cbiAqXG4gKiBAcHJpdmF0ZVxuICogQG1lbWJlcm9mIHdvcmtib3gtcHJlY2FjaGluZ1xuICovXG5leHBvcnQgZnVuY3Rpb24gY3JlYXRlQ2FjaGVLZXkoZW50cnkpIHtcbiAgICBpZiAoIWVudHJ5KSB7XG4gICAgICAgIHRocm93IG5ldyBXb3JrYm94RXJyb3IoJ2FkZC10by1jYWNoZS1saXN0LXVuZXhwZWN0ZWQtdHlwZScsIHsgZW50cnkgfSk7XG4gICAgfVxuICAgIC8vIElmIGEgcHJlY2FjaGUgbWFuaWZlc3QgZW50cnkgaXMgYSBzdHJpbmcsIGl0J3MgYXNzdW1lZCB0byBiZSBhIHZlcnNpb25lZFxuICAgIC8vIFVSTCwgbGlrZSAnL2FwcC5hYmNkMTIzNC5qcycuIFJldHVybiBhcy1pcy5cbiAgICBpZiAodHlwZW9mIGVudHJ5ID09PSAnc3RyaW5nJykge1xuICAgICAgICBjb25zdCB1cmxPYmplY3QgPSBuZXcgVVJMKGVudHJ5LCBsb2NhdGlvbi5ocmVmKTtcbiAgICAgICAgcmV0dXJuIHtcbiAgICAgICAgICAgIGNhY2hlS2V5OiB1cmxPYmplY3QuaHJlZixcbiAgICAgICAgICAgIHVybDogdXJsT2JqZWN0LmhyZWYsXG4gICAgICAgIH07XG4gICAgfVxuICAgIGNvbnN0IHsgcmV2aXNpb24sIHVybCB9ID0gZW50cnk7XG4gICAgaWYgKCF1cmwpIHtcbiAgICAgICAgdGhyb3cgbmV3IFdvcmtib3hFcnJvcignYWRkLXRvLWNhY2hlLWxpc3QtdW5leHBlY3RlZC10eXBlJywgeyBlbnRyeSB9KTtcbiAgICB9XG4gICAgLy8gSWYgdGhlcmUncyBqdXN0IGEgVVJMIGFuZCBubyByZXZpc2lvbiwgdGhlbiBpdCdzIGFsc28gYXNzdW1lZCB0byBiZSBhXG4gICAgLy8gdmVyc2lvbmVkIFVSTC5cbiAgICBpZiAoIXJldmlzaW9uKSB7XG4gICAgICAgIGNvbnN0IHVybE9iamVjdCA9IG5ldyBVUkwodXJsLCBsb2NhdGlvbi5ocmVmKTtcbiAgICAgICAgcmV0dXJuIHtcbiAgICAgICAgICAgIGNhY2hlS2V5OiB1cmxPYmplY3QuaHJlZixcbiAgICAgICAgICAgIHVybDogdXJsT2JqZWN0LmhyZWYsXG4gICAgICAgIH07XG4gICAgfVxuICAgIC8vIE90aGVyd2lzZSwgY29uc3RydWN0IGEgcHJvcGVybHkgdmVyc2lvbmVkIFVSTCB1c2luZyB0aGUgY3VzdG9tIFdvcmtib3hcbiAgICAvLyBzZWFyY2ggcGFyYW1ldGVyIGFsb25nIHdpdGggdGhlIHJldmlzaW9uIGluZm8uXG4gICAgY29uc3QgY2FjaGVLZXlVUkwgPSBuZXcgVVJMKHVybCwgbG9jYXRpb24uaHJlZik7XG4gICAgY29uc3Qgb3JpZ2luYWxVUkwgPSBuZXcgVVJMKHVybCwgbG9jYXRpb24uaHJlZik7XG4gICAgY2FjaGVLZXlVUkwuc2VhcmNoUGFyYW1zLnNldChSRVZJU0lPTl9TRUFSQ0hfUEFSQU0sIHJldmlzaW9uKTtcbiAgICByZXR1cm4ge1xuICAgICAgICBjYWNoZUtleTogY2FjaGVLZXlVUkwuaHJlZixcbiAgICAgICAgdXJsOiBvcmlnaW5hbFVSTC5ocmVmLFxuICAgIH07XG59XG4iLCAiLypcbiAgQ29weXJpZ2h0IDIwMjAgR29vZ2xlIExMQ1xuXG4gIFVzZSBvZiB0aGlzIHNvdXJjZSBjb2RlIGlzIGdvdmVybmVkIGJ5IGFuIE1JVC1zdHlsZVxuICBsaWNlbnNlIHRoYXQgY2FuIGJlIGZvdW5kIGluIHRoZSBMSUNFTlNFIGZpbGUgb3IgYXRcbiAgaHR0cHM6Ly9vcGVuc291cmNlLm9yZy9saWNlbnNlcy9NSVQuXG4qL1xuaW1wb3J0ICcuLi9fdmVyc2lvbi5qcyc7XG4vKipcbiAqIEEgcGx1Z2luLCBkZXNpZ25lZCB0byBiZSB1c2VkIHdpdGggUHJlY2FjaGVDb250cm9sbGVyLCB0byBkZXRlcm1pbmUgdGhlXG4gKiBvZiBhc3NldHMgdGhhdCB3ZXJlIHVwZGF0ZWQgKG9yIG5vdCB1cGRhdGVkKSBkdXJpbmcgdGhlIGluc3RhbGwgZXZlbnQuXG4gKlxuICogQHByaXZhdGVcbiAqL1xuY2xhc3MgUHJlY2FjaGVJbnN0YWxsUmVwb3J0UGx1Z2luIHtcbiAgICBjb25zdHJ1Y3RvcigpIHtcbiAgICAgICAgdGhpcy51cGRhdGVkVVJMcyA9IFtdO1xuICAgICAgICB0aGlzLm5vdFVwZGF0ZWRVUkxzID0gW107XG4gICAgICAgIHRoaXMuaGFuZGxlcldpbGxTdGFydCA9IGFzeW5jICh7IHJlcXVlc3QsIHN0YXRlLCB9KSA9PiB7XG4gICAgICAgICAgICAvLyBUT0RPOiBgc3RhdGVgIHNob3VsZCBuZXZlciBiZSB1bmRlZmluZWQuLi5cbiAgICAgICAgICAgIGlmIChzdGF0ZSkge1xuICAgICAgICAgICAgICAgIHN0YXRlLm9yaWdpbmFsUmVxdWVzdCA9IHJlcXVlc3Q7XG4gICAgICAgICAgICB9XG4gICAgICAgIH07XG4gICAgICAgIHRoaXMuY2FjaGVkUmVzcG9uc2VXaWxsQmVVc2VkID0gYXN5bmMgKHsgZXZlbnQsIHN0YXRlLCBjYWNoZWRSZXNwb25zZSwgfSkgPT4ge1xuICAgICAgICAgICAgaWYgKGV2ZW50LnR5cGUgPT09ICdpbnN0YWxsJykge1xuICAgICAgICAgICAgICAgIGlmIChzdGF0ZSAmJlxuICAgICAgICAgICAgICAgICAgICBzdGF0ZS5vcmlnaW5hbFJlcXVlc3QgJiZcbiAgICAgICAgICAgICAgICAgICAgc3RhdGUub3JpZ2luYWxSZXF1ZXN0IGluc3RhbmNlb2YgUmVxdWVzdCkge1xuICAgICAgICAgICAgICAgICAgICAvLyBUT0RPOiBgc3RhdGVgIHNob3VsZCBuZXZlciBiZSB1bmRlZmluZWQuLi5cbiAgICAgICAgICAgICAgICAgICAgY29uc3QgdXJsID0gc3RhdGUub3JpZ2luYWxSZXF1ZXN0LnVybDtcbiAgICAgICAgICAgICAgICAgICAgaWYgKGNhY2hlZFJlc3BvbnNlKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICB0aGlzLm5vdFVwZGF0ZWRVUkxzLnB1c2godXJsKTtcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMudXBkYXRlZFVSTHMucHVzaCh1cmwpO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICAgICAgcmV0dXJuIGNhY2hlZFJlc3BvbnNlO1xuICAgICAgICB9O1xuICAgIH1cbn1cbmV4cG9ydCB7IFByZWNhY2hlSW5zdGFsbFJlcG9ydFBsdWdpbiB9O1xuIiwgIi8qXG4gIENvcHlyaWdodCAyMDIwIEdvb2dsZSBMTENcblxuICBVc2Ugb2YgdGhpcyBzb3VyY2UgY29kZSBpcyBnb3Zlcm5lZCBieSBhbiBNSVQtc3R5bGVcbiAgbGljZW5zZSB0aGF0IGNhbiBiZSBmb3VuZCBpbiB0aGUgTElDRU5TRSBmaWxlIG9yIGF0XG4gIGh0dHBzOi8vb3BlbnNvdXJjZS5vcmcvbGljZW5zZXMvTUlULlxuKi9cbmltcG9ydCAnLi4vX3ZlcnNpb24uanMnO1xuLyoqXG4gKiBBIHBsdWdpbiwgZGVzaWduZWQgdG8gYmUgdXNlZCB3aXRoIFByZWNhY2hlQ29udHJvbGxlciwgdG8gdHJhbnNsYXRlIFVSTHMgaW50b1xuICogdGhlIGNvcnJlc3BvbmRpbmcgY2FjaGUga2V5LCBiYXNlZCBvbiB0aGUgY3VycmVudCByZXZpc2lvbiBpbmZvLlxuICpcbiAqIEBwcml2YXRlXG4gKi9cbmNsYXNzIFByZWNhY2hlQ2FjaGVLZXlQbHVnaW4ge1xuICAgIGNvbnN0cnVjdG9yKHsgcHJlY2FjaGVDb250cm9sbGVyIH0pIHtcbiAgICAgICAgdGhpcy5jYWNoZUtleVdpbGxCZVVzZWQgPSBhc3luYyAoeyByZXF1ZXN0LCBwYXJhbXMsIH0pID0+IHtcbiAgICAgICAgICAgIC8vIFBhcmFtcyBpcyB0eXBlIGFueSwgY2FuJ3QgY2hhbmdlIHJpZ2h0IG5vdy5cbiAgICAgICAgICAgIC8qIGVzbGludC1kaXNhYmxlICovXG4gICAgICAgICAgICBjb25zdCBjYWNoZUtleSA9IChwYXJhbXMgPT09IG51bGwgfHwgcGFyYW1zID09PSB2b2lkIDAgPyB2b2lkIDAgOiBwYXJhbXMuY2FjaGVLZXkpIHx8XG4gICAgICAgICAgICAgICAgdGhpcy5fcHJlY2FjaGVDb250cm9sbGVyLmdldENhY2hlS2V5Rm9yVVJMKHJlcXVlc3QudXJsKTtcbiAgICAgICAgICAgIC8qIGVzbGludC1lbmFibGUgKi9cbiAgICAgICAgICAgIHJldHVybiBjYWNoZUtleVxuICAgICAgICAgICAgICAgID8gbmV3IFJlcXVlc3QoY2FjaGVLZXksIHsgaGVhZGVyczogcmVxdWVzdC5oZWFkZXJzIH0pXG4gICAgICAgICAgICAgICAgOiByZXF1ZXN0O1xuICAgICAgICB9O1xuICAgICAgICB0aGlzLl9wcmVjYWNoZUNvbnRyb2xsZXIgPSBwcmVjYWNoZUNvbnRyb2xsZXI7XG4gICAgfVxufVxuZXhwb3J0IHsgUHJlY2FjaGVDYWNoZUtleVBsdWdpbiB9O1xuIiwgIi8qXG4gIENvcHlyaWdodCAyMDE4IEdvb2dsZSBMTENcblxuICBVc2Ugb2YgdGhpcyBzb3VyY2UgY29kZSBpcyBnb3Zlcm5lZCBieSBhbiBNSVQtc3R5bGVcbiAgbGljZW5zZSB0aGF0IGNhbiBiZSBmb3VuZCBpbiB0aGUgTElDRU5TRSBmaWxlIG9yIGF0XG4gIGh0dHBzOi8vb3BlbnNvdXJjZS5vcmcvbGljZW5zZXMvTUlULlxuKi9cbmltcG9ydCB7IGxvZ2dlciB9IGZyb20gJ3dvcmtib3gtY29yZS9fcHJpdmF0ZS9sb2dnZXIuanMnO1xuaW1wb3J0ICcuLi9fdmVyc2lvbi5qcyc7XG4vKipcbiAqIEBwYXJhbSB7c3RyaW5nfSBncm91cFRpdGxlXG4gKiBAcGFyYW0ge0FycmF5PHN0cmluZz59IGRlbGV0ZWRVUkxzXG4gKlxuICogQHByaXZhdGVcbiAqL1xuY29uc3QgbG9nR3JvdXAgPSAoZ3JvdXBUaXRsZSwgZGVsZXRlZFVSTHMpID0+IHtcbiAgICBsb2dnZXIuZ3JvdXBDb2xsYXBzZWQoZ3JvdXBUaXRsZSk7XG4gICAgZm9yIChjb25zdCB1cmwgb2YgZGVsZXRlZFVSTHMpIHtcbiAgICAgICAgbG9nZ2VyLmxvZyh1cmwpO1xuICAgIH1cbiAgICBsb2dnZXIuZ3JvdXBFbmQoKTtcbn07XG4vKipcbiAqIEBwYXJhbSB7QXJyYXk8c3RyaW5nPn0gZGVsZXRlZFVSTHNcbiAqXG4gKiBAcHJpdmF0ZVxuICogQG1lbWJlcm9mIHdvcmtib3gtcHJlY2FjaGluZ1xuICovXG5leHBvcnQgZnVuY3Rpb24gcHJpbnRDbGVhbnVwRGV0YWlscyhkZWxldGVkVVJMcykge1xuICAgIGNvbnN0IGRlbGV0aW9uQ291bnQgPSBkZWxldGVkVVJMcy5sZW5ndGg7XG4gICAgaWYgKGRlbGV0aW9uQ291bnQgPiAwKSB7XG4gICAgICAgIGxvZ2dlci5ncm91cENvbGxhcHNlZChgRHVyaW5nIHByZWNhY2hpbmcgY2xlYW51cCwgYCArXG4gICAgICAgICAgICBgJHtkZWxldGlvbkNvdW50fSBjYWNoZWQgYCArXG4gICAgICAgICAgICBgcmVxdWVzdCR7ZGVsZXRpb25Db3VudCA9PT0gMSA/ICcgd2FzJyA6ICdzIHdlcmUnfSBkZWxldGVkLmApO1xuICAgICAgICBsb2dHcm91cCgnRGVsZXRlZCBDYWNoZSBSZXF1ZXN0cycsIGRlbGV0ZWRVUkxzKTtcbiAgICAgICAgbG9nZ2VyLmdyb3VwRW5kKCk7XG4gICAgfVxufVxuIiwgIi8qXG4gIENvcHlyaWdodCAyMDE4IEdvb2dsZSBMTENcblxuICBVc2Ugb2YgdGhpcyBzb3VyY2UgY29kZSBpcyBnb3Zlcm5lZCBieSBhbiBNSVQtc3R5bGVcbiAgbGljZW5zZSB0aGF0IGNhbiBiZSBmb3VuZCBpbiB0aGUgTElDRU5TRSBmaWxlIG9yIGF0XG4gIGh0dHBzOi8vb3BlbnNvdXJjZS5vcmcvbGljZW5zZXMvTUlULlxuKi9cbmltcG9ydCB7IGxvZ2dlciB9IGZyb20gJ3dvcmtib3gtY29yZS9fcHJpdmF0ZS9sb2dnZXIuanMnO1xuaW1wb3J0ICcuLi9fdmVyc2lvbi5qcyc7XG4vKipcbiAqIEBwYXJhbSB7c3RyaW5nfSBncm91cFRpdGxlXG4gKiBAcGFyYW0ge0FycmF5PHN0cmluZz59IHVybHNcbiAqXG4gKiBAcHJpdmF0ZVxuICovXG5mdW5jdGlvbiBfbmVzdGVkR3JvdXAoZ3JvdXBUaXRsZSwgdXJscykge1xuICAgIGlmICh1cmxzLmxlbmd0aCA9PT0gMCkge1xuICAgICAgICByZXR1cm47XG4gICAgfVxuICAgIGxvZ2dlci5ncm91cENvbGxhcHNlZChncm91cFRpdGxlKTtcbiAgICBmb3IgKGNvbnN0IHVybCBvZiB1cmxzKSB7XG4gICAgICAgIGxvZ2dlci5sb2codXJsKTtcbiAgICB9XG4gICAgbG9nZ2VyLmdyb3VwRW5kKCk7XG59XG4vKipcbiAqIEBwYXJhbSB7QXJyYXk8c3RyaW5nPn0gdXJsc1RvUHJlY2FjaGVcbiAqIEBwYXJhbSB7QXJyYXk8c3RyaW5nPn0gdXJsc0FscmVhZHlQcmVjYWNoZWRcbiAqXG4gKiBAcHJpdmF0ZVxuICogQG1lbWJlcm9mIHdvcmtib3gtcHJlY2FjaGluZ1xuICovXG5leHBvcnQgZnVuY3Rpb24gcHJpbnRJbnN0YWxsRGV0YWlscyh1cmxzVG9QcmVjYWNoZSwgdXJsc0FscmVhZHlQcmVjYWNoZWQpIHtcbiAgICBjb25zdCBwcmVjYWNoZWRDb3VudCA9IHVybHNUb1ByZWNhY2hlLmxlbmd0aDtcbiAgICBjb25zdCBhbHJlYWR5UHJlY2FjaGVkQ291bnQgPSB1cmxzQWxyZWFkeVByZWNhY2hlZC5sZW5ndGg7XG4gICAgaWYgKHByZWNhY2hlZENvdW50IHx8IGFscmVhZHlQcmVjYWNoZWRDb3VudCkge1xuICAgICAgICBsZXQgbWVzc2FnZSA9IGBQcmVjYWNoaW5nICR7cHJlY2FjaGVkQ291bnR9IGZpbGUke3ByZWNhY2hlZENvdW50ID09PSAxID8gJycgOiAncyd9LmA7XG4gICAgICAgIGlmIChhbHJlYWR5UHJlY2FjaGVkQ291bnQgPiAwKSB7XG4gICAgICAgICAgICBtZXNzYWdlICs9XG4gICAgICAgICAgICAgICAgYCAke2FscmVhZHlQcmVjYWNoZWRDb3VudH0gYCArXG4gICAgICAgICAgICAgICAgICAgIGBmaWxlJHthbHJlYWR5UHJlY2FjaGVkQ291bnQgPT09IDEgPyAnIGlzJyA6ICdzIGFyZSd9IGFscmVhZHkgY2FjaGVkLmA7XG4gICAgICAgIH1cbiAgICAgICAgbG9nZ2VyLmdyb3VwQ29sbGFwc2VkKG1lc3NhZ2UpO1xuICAgICAgICBfbmVzdGVkR3JvdXAoYFZpZXcgbmV3bHkgcHJlY2FjaGVkIFVSTHMuYCwgdXJsc1RvUHJlY2FjaGUpO1xuICAgICAgICBfbmVzdGVkR3JvdXAoYFZpZXcgcHJldmlvdXNseSBwcmVjYWNoZWQgVVJMcy5gLCB1cmxzQWxyZWFkeVByZWNhY2hlZCk7XG4gICAgICAgIGxvZ2dlci5ncm91cEVuZCgpO1xuICAgIH1cbn1cbiIsICJcInVzZSBzdHJpY3RcIjtcbi8vIEB0cy1pZ25vcmVcbnRyeSB7XG4gICAgc2VsZlsnd29ya2JveDpzdHJhdGVnaWVzOjcuMi4wJ10gJiYgXygpO1xufVxuY2F0Y2ggKGUpIHsgfVxuIiwgIi8qXG4gIENvcHlyaWdodCAyMDIwIEdvb2dsZSBMTENcblxuICBVc2Ugb2YgdGhpcyBzb3VyY2UgY29kZSBpcyBnb3Zlcm5lZCBieSBhbiBNSVQtc3R5bGVcbiAgbGljZW5zZSB0aGF0IGNhbiBiZSBmb3VuZCBpbiB0aGUgTElDRU5TRSBmaWxlIG9yIGF0XG4gIGh0dHBzOi8vb3BlbnNvdXJjZS5vcmcvbGljZW5zZXMvTUlULlxuKi9cbmltcG9ydCB7IGFzc2VydCB9IGZyb20gJ3dvcmtib3gtY29yZS9fcHJpdmF0ZS9hc3NlcnQuanMnO1xuaW1wb3J0IHsgY2FjaGVNYXRjaElnbm9yZVBhcmFtcyB9IGZyb20gJ3dvcmtib3gtY29yZS9fcHJpdmF0ZS9jYWNoZU1hdGNoSWdub3JlUGFyYW1zLmpzJztcbmltcG9ydCB7IERlZmVycmVkIH0gZnJvbSAnd29ya2JveC1jb3JlL19wcml2YXRlL0RlZmVycmVkLmpzJztcbmltcG9ydCB7IGV4ZWN1dGVRdW90YUVycm9yQ2FsbGJhY2tzIH0gZnJvbSAnd29ya2JveC1jb3JlL19wcml2YXRlL2V4ZWN1dGVRdW90YUVycm9yQ2FsbGJhY2tzLmpzJztcbmltcG9ydCB7IGdldEZyaWVuZGx5VVJMIH0gZnJvbSAnd29ya2JveC1jb3JlL19wcml2YXRlL2dldEZyaWVuZGx5VVJMLmpzJztcbmltcG9ydCB7IGxvZ2dlciB9IGZyb20gJ3dvcmtib3gtY29yZS9fcHJpdmF0ZS9sb2dnZXIuanMnO1xuaW1wb3J0IHsgdGltZW91dCB9IGZyb20gJ3dvcmtib3gtY29yZS9fcHJpdmF0ZS90aW1lb3V0LmpzJztcbmltcG9ydCB7IFdvcmtib3hFcnJvciB9IGZyb20gJ3dvcmtib3gtY29yZS9fcHJpdmF0ZS9Xb3JrYm94RXJyb3IuanMnO1xuaW1wb3J0ICcuL192ZXJzaW9uLmpzJztcbmZ1bmN0aW9uIHRvUmVxdWVzdChpbnB1dCkge1xuICAgIHJldHVybiB0eXBlb2YgaW5wdXQgPT09ICdzdHJpbmcnID8gbmV3IFJlcXVlc3QoaW5wdXQpIDogaW5wdXQ7XG59XG4vKipcbiAqIEEgY2xhc3MgY3JlYXRlZCBldmVyeSB0aW1lIGEgU3RyYXRlZ3kgaW5zdGFuY2UgaW5zdGFuY2UgY2FsbHNcbiAqIHtAbGluayB3b3JrYm94LXN0cmF0ZWdpZXMuU3RyYXRlZ3l+aGFuZGxlfSBvclxuICoge0BsaW5rIHdvcmtib3gtc3RyYXRlZ2llcy5TdHJhdGVneX5oYW5kbGVBbGx9IHRoYXQgd3JhcHMgYWxsIGZldGNoIGFuZFxuICogY2FjaGUgYWN0aW9ucyBhcm91bmQgcGx1Z2luIGNhbGxiYWNrcyBhbmQga2VlcHMgdHJhY2sgb2Ygd2hlbiB0aGUgc3RyYXRlZ3lcbiAqIGlzIFwiZG9uZVwiIChpLmUuIGFsbCBhZGRlZCBgZXZlbnQud2FpdFVudGlsKClgIHByb21pc2VzIGhhdmUgcmVzb2x2ZWQpLlxuICpcbiAqIEBtZW1iZXJvZiB3b3JrYm94LXN0cmF0ZWdpZXNcbiAqL1xuY2xhc3MgU3RyYXRlZ3lIYW5kbGVyIHtcbiAgICAvKipcbiAgICAgKiBDcmVhdGVzIGEgbmV3IGluc3RhbmNlIGFzc29jaWF0ZWQgd2l0aCB0aGUgcGFzc2VkIHN0cmF0ZWd5IGFuZCBldmVudFxuICAgICAqIHRoYXQncyBoYW5kbGluZyB0aGUgcmVxdWVzdC5cbiAgICAgKlxuICAgICAqIFRoZSBjb25zdHJ1Y3RvciBhbHNvIGluaXRpYWxpemVzIHRoZSBzdGF0ZSB0aGF0IHdpbGwgYmUgcGFzc2VkIHRvIGVhY2ggb2ZcbiAgICAgKiB0aGUgcGx1Z2lucyBoYW5kbGluZyB0aGlzIHJlcXVlc3QuXG4gICAgICpcbiAgICAgKiBAcGFyYW0ge3dvcmtib3gtc3RyYXRlZ2llcy5TdHJhdGVneX0gc3RyYXRlZ3lcbiAgICAgKiBAcGFyYW0ge09iamVjdH0gb3B0aW9uc1xuICAgICAqIEBwYXJhbSB7UmVxdWVzdHxzdHJpbmd9IG9wdGlvbnMucmVxdWVzdCBBIHJlcXVlc3QgdG8gcnVuIHRoaXMgc3RyYXRlZ3kgZm9yLlxuICAgICAqIEBwYXJhbSB7RXh0ZW5kYWJsZUV2ZW50fSBvcHRpb25zLmV2ZW50IFRoZSBldmVudCBhc3NvY2lhdGVkIHdpdGggdGhlXG4gICAgICogICAgIHJlcXVlc3QuXG4gICAgICogQHBhcmFtIHtVUkx9IFtvcHRpb25zLnVybF1cbiAgICAgKiBAcGFyYW0geyp9IFtvcHRpb25zLnBhcmFtc10gVGhlIHJldHVybiB2YWx1ZSBmcm9tIHRoZVxuICAgICAqICAgICB7QGxpbmsgd29ya2JveC1yb3V0aW5nfm1hdGNoQ2FsbGJhY2t9IChpZiBhcHBsaWNhYmxlKS5cbiAgICAgKi9cbiAgICBjb25zdHJ1Y3RvcihzdHJhdGVneSwgb3B0aW9ucykge1xuICAgICAgICB0aGlzLl9jYWNoZUtleXMgPSB7fTtcbiAgICAgICAgLyoqXG4gICAgICAgICAqIFRoZSByZXF1ZXN0IHRoZSBzdHJhdGVneSBpcyBwZXJmb3JtaW5nIChwYXNzZWQgdG8gdGhlIHN0cmF0ZWd5J3NcbiAgICAgICAgICogYGhhbmRsZSgpYCBvciBgaGFuZGxlQWxsKClgIG1ldGhvZCkuXG4gICAgICAgICAqIEBuYW1lIHJlcXVlc3RcbiAgICAgICAgICogQGluc3RhbmNlXG4gICAgICAgICAqIEB0eXBlIHtSZXF1ZXN0fVxuICAgICAgICAgKiBAbWVtYmVyb2Ygd29ya2JveC1zdHJhdGVnaWVzLlN0cmF0ZWd5SGFuZGxlclxuICAgICAgICAgKi9cbiAgICAgICAgLyoqXG4gICAgICAgICAqIFRoZSBldmVudCBhc3NvY2lhdGVkIHdpdGggdGhpcyByZXF1ZXN0LlxuICAgICAgICAgKiBAbmFtZSBldmVudFxuICAgICAgICAgKiBAaW5zdGFuY2VcbiAgICAgICAgICogQHR5cGUge0V4dGVuZGFibGVFdmVudH1cbiAgICAgICAgICogQG1lbWJlcm9mIHdvcmtib3gtc3RyYXRlZ2llcy5TdHJhdGVneUhhbmRsZXJcbiAgICAgICAgICovXG4gICAgICAgIC8qKlxuICAgICAgICAgKiBBIGBVUkxgIGluc3RhbmNlIG9mIGByZXF1ZXN0LnVybGAgKGlmIHBhc3NlZCB0byB0aGUgc3RyYXRlZ3knc1xuICAgICAgICAgKiBgaGFuZGxlKClgIG9yIGBoYW5kbGVBbGwoKWAgbWV0aG9kKS5cbiAgICAgICAgICogTm90ZTogdGhlIGB1cmxgIHBhcmFtIHdpbGwgYmUgcHJlc2VudCBpZiB0aGUgc3RyYXRlZ3kgd2FzIGludm9rZWRcbiAgICAgICAgICogZnJvbSBhIHdvcmtib3ggYFJvdXRlYCBvYmplY3QuXG4gICAgICAgICAqIEBuYW1lIHVybFxuICAgICAgICAgKiBAaW5zdGFuY2VcbiAgICAgICAgICogQHR5cGUge1VSTHx1bmRlZmluZWR9XG4gICAgICAgICAqIEBtZW1iZXJvZiB3b3JrYm94LXN0cmF0ZWdpZXMuU3RyYXRlZ3lIYW5kbGVyXG4gICAgICAgICAqL1xuICAgICAgICAvKipcbiAgICAgICAgICogQSBgcGFyYW1gIHZhbHVlIChpZiBwYXNzZWQgdG8gdGhlIHN0cmF0ZWd5J3NcbiAgICAgICAgICogYGhhbmRsZSgpYCBvciBgaGFuZGxlQWxsKClgIG1ldGhvZCkuXG4gICAgICAgICAqIE5vdGU6IHRoZSBgcGFyYW1gIHBhcmFtIHdpbGwgYmUgcHJlc2VudCBpZiB0aGUgc3RyYXRlZ3kgd2FzIGludm9rZWRcbiAgICAgICAgICogZnJvbSBhIHdvcmtib3ggYFJvdXRlYCBvYmplY3QgYW5kIHRoZVxuICAgICAgICAgKiB7QGxpbmsgd29ya2JveC1yb3V0aW5nfm1hdGNoQ2FsbGJhY2t9IHJldHVybmVkXG4gICAgICAgICAqIGEgdHJ1dGh5IHZhbHVlIChpdCB3aWxsIGJlIHRoYXQgdmFsdWUpLlxuICAgICAgICAgKiBAbmFtZSBwYXJhbXNcbiAgICAgICAgICogQGluc3RhbmNlXG4gICAgICAgICAqIEB0eXBlIHsqfHVuZGVmaW5lZH1cbiAgICAgICAgICogQG1lbWJlcm9mIHdvcmtib3gtc3RyYXRlZ2llcy5TdHJhdGVneUhhbmRsZXJcbiAgICAgICAgICovXG4gICAgICAgIGlmIChwcm9jZXNzLmVudi5OT0RFX0VOViAhPT0gJ3Byb2R1Y3Rpb24nKSB7XG4gICAgICAgICAgICBhc3NlcnQuaXNJbnN0YW5jZShvcHRpb25zLmV2ZW50LCBFeHRlbmRhYmxlRXZlbnQsIHtcbiAgICAgICAgICAgICAgICBtb2R1bGVOYW1lOiAnd29ya2JveC1zdHJhdGVnaWVzJyxcbiAgICAgICAgICAgICAgICBjbGFzc05hbWU6ICdTdHJhdGVneUhhbmRsZXInLFxuICAgICAgICAgICAgICAgIGZ1bmNOYW1lOiAnY29uc3RydWN0b3InLFxuICAgICAgICAgICAgICAgIHBhcmFtTmFtZTogJ29wdGlvbnMuZXZlbnQnLFxuICAgICAgICAgICAgfSk7XG4gICAgICAgIH1cbiAgICAgICAgT2JqZWN0LmFzc2lnbih0aGlzLCBvcHRpb25zKTtcbiAgICAgICAgdGhpcy5ldmVudCA9IG9wdGlvbnMuZXZlbnQ7XG4gICAgICAgIHRoaXMuX3N0cmF0ZWd5ID0gc3RyYXRlZ3k7XG4gICAgICAgIHRoaXMuX2hhbmRsZXJEZWZlcnJlZCA9IG5ldyBEZWZlcnJlZCgpO1xuICAgICAgICB0aGlzLl9leHRlbmRMaWZldGltZVByb21pc2VzID0gW107XG4gICAgICAgIC8vIENvcHkgdGhlIHBsdWdpbnMgbGlzdCAoc2luY2UgaXQncyBtdXRhYmxlIG9uIHRoZSBzdHJhdGVneSksXG4gICAgICAgIC8vIHNvIGFueSBtdXRhdGlvbnMgZG9uJ3QgYWZmZWN0IHRoaXMgaGFuZGxlciBpbnN0YW5jZS5cbiAgICAgICAgdGhpcy5fcGx1Z2lucyA9IFsuLi5zdHJhdGVneS5wbHVnaW5zXTtcbiAgICAgICAgdGhpcy5fcGx1Z2luU3RhdGVNYXAgPSBuZXcgTWFwKCk7XG4gICAgICAgIGZvciAoY29uc3QgcGx1Z2luIG9mIHRoaXMuX3BsdWdpbnMpIHtcbiAgICAgICAgICAgIHRoaXMuX3BsdWdpblN0YXRlTWFwLnNldChwbHVnaW4sIHt9KTtcbiAgICAgICAgfVxuICAgICAgICB0aGlzLmV2ZW50LndhaXRVbnRpbCh0aGlzLl9oYW5kbGVyRGVmZXJyZWQucHJvbWlzZSk7XG4gICAgfVxuICAgIC8qKlxuICAgICAqIEZldGNoZXMgYSBnaXZlbiByZXF1ZXN0IChhbmQgaW52b2tlcyBhbnkgYXBwbGljYWJsZSBwbHVnaW4gY2FsbGJhY2tcbiAgICAgKiBtZXRob2RzKSB1c2luZyB0aGUgYGZldGNoT3B0aW9uc2AgKGZvciBub24tbmF2aWdhdGlvbiByZXF1ZXN0cykgYW5kXG4gICAgICogYHBsdWdpbnNgIGRlZmluZWQgb24gdGhlIGBTdHJhdGVneWAgb2JqZWN0LlxuICAgICAqXG4gICAgICogVGhlIGZvbGxvd2luZyBwbHVnaW4gbGlmZWN5Y2xlIG1ldGhvZHMgYXJlIGludm9rZWQgd2hlbiB1c2luZyB0aGlzIG1ldGhvZDpcbiAgICAgKiAtIGByZXF1ZXN0V2lsbEZldGNoKClgXG4gICAgICogLSBgZmV0Y2hEaWRTdWNjZWVkKClgXG4gICAgICogLSBgZmV0Y2hEaWRGYWlsKClgXG4gICAgICpcbiAgICAgKiBAcGFyYW0ge1JlcXVlc3R8c3RyaW5nfSBpbnB1dCBUaGUgVVJMIG9yIHJlcXVlc3QgdG8gZmV0Y2guXG4gICAgICogQHJldHVybiB7UHJvbWlzZTxSZXNwb25zZT59XG4gICAgICovXG4gICAgYXN5bmMgZmV0Y2goaW5wdXQpIHtcbiAgICAgICAgY29uc3QgeyBldmVudCB9ID0gdGhpcztcbiAgICAgICAgbGV0IHJlcXVlc3QgPSB0b1JlcXVlc3QoaW5wdXQpO1xuICAgICAgICBpZiAocmVxdWVzdC5tb2RlID09PSAnbmF2aWdhdGUnICYmXG4gICAgICAgICAgICBldmVudCBpbnN0YW5jZW9mIEZldGNoRXZlbnQgJiZcbiAgICAgICAgICAgIGV2ZW50LnByZWxvYWRSZXNwb25zZSkge1xuICAgICAgICAgICAgY29uc3QgcG9zc2libGVQcmVsb2FkUmVzcG9uc2UgPSAoYXdhaXQgZXZlbnQucHJlbG9hZFJlc3BvbnNlKTtcbiAgICAgICAgICAgIGlmIChwb3NzaWJsZVByZWxvYWRSZXNwb25zZSkge1xuICAgICAgICAgICAgICAgIGlmIChwcm9jZXNzLmVudi5OT0RFX0VOViAhPT0gJ3Byb2R1Y3Rpb24nKSB7XG4gICAgICAgICAgICAgICAgICAgIGxvZ2dlci5sb2coYFVzaW5nIGEgcHJlbG9hZGVkIG5hdmlnYXRpb24gcmVzcG9uc2UgZm9yIGAgK1xuICAgICAgICAgICAgICAgICAgICAgICAgYCcke2dldEZyaWVuZGx5VVJMKHJlcXVlc3QudXJsKX0nYCk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIHJldHVybiBwb3NzaWJsZVByZWxvYWRSZXNwb25zZTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgICAvLyBJZiB0aGVyZSBpcyBhIGZldGNoRGlkRmFpbCBwbHVnaW4sIHdlIG5lZWQgdG8gc2F2ZSBhIGNsb25lIG9mIHRoZVxuICAgICAgICAvLyBvcmlnaW5hbCByZXF1ZXN0IGJlZm9yZSBpdCdzIGVpdGhlciBtb2RpZmllZCBieSBhIHJlcXVlc3RXaWxsRmV0Y2hcbiAgICAgICAgLy8gcGx1Z2luIG9yIGJlZm9yZSB0aGUgb3JpZ2luYWwgcmVxdWVzdCdzIGJvZHkgaXMgY29uc3VtZWQgdmlhIGZldGNoKCkuXG4gICAgICAgIGNvbnN0IG9yaWdpbmFsUmVxdWVzdCA9IHRoaXMuaGFzQ2FsbGJhY2soJ2ZldGNoRGlkRmFpbCcpXG4gICAgICAgICAgICA/IHJlcXVlc3QuY2xvbmUoKVxuICAgICAgICAgICAgOiBudWxsO1xuICAgICAgICB0cnkge1xuICAgICAgICAgICAgZm9yIChjb25zdCBjYiBvZiB0aGlzLml0ZXJhdGVDYWxsYmFja3MoJ3JlcXVlc3RXaWxsRmV0Y2gnKSkge1xuICAgICAgICAgICAgICAgIHJlcXVlc3QgPSBhd2FpdCBjYih7IHJlcXVlc3Q6IHJlcXVlc3QuY2xvbmUoKSwgZXZlbnQgfSk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgICAgY2F0Y2ggKGVycikge1xuICAgICAgICAgICAgaWYgKGVyciBpbnN0YW5jZW9mIEVycm9yKSB7XG4gICAgICAgICAgICAgICAgdGhyb3cgbmV3IFdvcmtib3hFcnJvcigncGx1Z2luLWVycm9yLXJlcXVlc3Qtd2lsbC1mZXRjaCcsIHtcbiAgICAgICAgICAgICAgICAgICAgdGhyb3duRXJyb3JNZXNzYWdlOiBlcnIubWVzc2FnZSxcbiAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgICAvLyBUaGUgcmVxdWVzdCBjYW4gYmUgYWx0ZXJlZCBieSBwbHVnaW5zIHdpdGggYHJlcXVlc3RXaWxsRmV0Y2hgIG1ha2luZ1xuICAgICAgICAvLyB0aGUgb3JpZ2luYWwgcmVxdWVzdCAobW9zdCBsaWtlbHkgZnJvbSBhIGBmZXRjaGAgZXZlbnQpIGRpZmZlcmVudFxuICAgICAgICAvLyBmcm9tIHRoZSBSZXF1ZXN0IHdlIG1ha2UuIFBhc3MgYm90aCB0byBgZmV0Y2hEaWRGYWlsYCB0byBhaWQgZGVidWdnaW5nLlxuICAgICAgICBjb25zdCBwbHVnaW5GaWx0ZXJlZFJlcXVlc3QgPSByZXF1ZXN0LmNsb25lKCk7XG4gICAgICAgIHRyeSB7XG4gICAgICAgICAgICBsZXQgZmV0Y2hSZXNwb25zZTtcbiAgICAgICAgICAgIC8vIFNlZSBodHRwczovL2dpdGh1Yi5jb20vR29vZ2xlQ2hyb21lL3dvcmtib3gvaXNzdWVzLzE3OTZcbiAgICAgICAgICAgIGZldGNoUmVzcG9uc2UgPSBhd2FpdCBmZXRjaChyZXF1ZXN0LCByZXF1ZXN0Lm1vZGUgPT09ICduYXZpZ2F0ZScgPyB1bmRlZmluZWQgOiB0aGlzLl9zdHJhdGVneS5mZXRjaE9wdGlvbnMpO1xuICAgICAgICAgICAgaWYgKHByb2Nlc3MuZW52Lk5PREVfRU5WICE9PSAncHJvZHVjdGlvbicpIHtcbiAgICAgICAgICAgICAgICBsb2dnZXIuZGVidWcoYE5ldHdvcmsgcmVxdWVzdCBmb3IgYCArXG4gICAgICAgICAgICAgICAgICAgIGAnJHtnZXRGcmllbmRseVVSTChyZXF1ZXN0LnVybCl9JyByZXR1cm5lZCBhIHJlc3BvbnNlIHdpdGggYCArXG4gICAgICAgICAgICAgICAgICAgIGBzdGF0dXMgJyR7ZmV0Y2hSZXNwb25zZS5zdGF0dXN9Jy5gKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGZvciAoY29uc3QgY2FsbGJhY2sgb2YgdGhpcy5pdGVyYXRlQ2FsbGJhY2tzKCdmZXRjaERpZFN1Y2NlZWQnKSkge1xuICAgICAgICAgICAgICAgIGZldGNoUmVzcG9uc2UgPSBhd2FpdCBjYWxsYmFjayh7XG4gICAgICAgICAgICAgICAgICAgIGV2ZW50LFxuICAgICAgICAgICAgICAgICAgICByZXF1ZXN0OiBwbHVnaW5GaWx0ZXJlZFJlcXVlc3QsXG4gICAgICAgICAgICAgICAgICAgIHJlc3BvbnNlOiBmZXRjaFJlc3BvbnNlLFxuICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgcmV0dXJuIGZldGNoUmVzcG9uc2U7XG4gICAgICAgIH1cbiAgICAgICAgY2F0Y2ggKGVycm9yKSB7XG4gICAgICAgICAgICBpZiAocHJvY2Vzcy5lbnYuTk9ERV9FTlYgIT09ICdwcm9kdWN0aW9uJykge1xuICAgICAgICAgICAgICAgIGxvZ2dlci5sb2coYE5ldHdvcmsgcmVxdWVzdCBmb3IgYCArXG4gICAgICAgICAgICAgICAgICAgIGAnJHtnZXRGcmllbmRseVVSTChyZXF1ZXN0LnVybCl9JyB0aHJldyBhbiBlcnJvci5gLCBlcnJvcik7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICAvLyBgb3JpZ2luYWxSZXF1ZXN0YCB3aWxsIG9ubHkgZXhpc3QgaWYgYSBgZmV0Y2hEaWRGYWlsYCBjYWxsYmFja1xuICAgICAgICAgICAgLy8gaXMgYmVpbmcgdXNlZCAoc2VlIGFib3ZlKS5cbiAgICAgICAgICAgIGlmIChvcmlnaW5hbFJlcXVlc3QpIHtcbiAgICAgICAgICAgICAgICBhd2FpdCB0aGlzLnJ1bkNhbGxiYWNrcygnZmV0Y2hEaWRGYWlsJywge1xuICAgICAgICAgICAgICAgICAgICBlcnJvcjogZXJyb3IsXG4gICAgICAgICAgICAgICAgICAgIGV2ZW50LFxuICAgICAgICAgICAgICAgICAgICBvcmlnaW5hbFJlcXVlc3Q6IG9yaWdpbmFsUmVxdWVzdC5jbG9uZSgpLFxuICAgICAgICAgICAgICAgICAgICByZXF1ZXN0OiBwbHVnaW5GaWx0ZXJlZFJlcXVlc3QuY2xvbmUoKSxcbiAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIHRocm93IGVycm9yO1xuICAgICAgICB9XG4gICAgfVxuICAgIC8qKlxuICAgICAqIENhbGxzIGB0aGlzLmZldGNoKClgIGFuZCAoaW4gdGhlIGJhY2tncm91bmQpIHJ1bnMgYHRoaXMuY2FjaGVQdXQoKWAgb25cbiAgICAgKiB0aGUgcmVzcG9uc2UgZ2VuZXJhdGVkIGJ5IGB0aGlzLmZldGNoKClgLlxuICAgICAqXG4gICAgICogVGhlIGNhbGwgdG8gYHRoaXMuY2FjaGVQdXQoKWAgYXV0b21hdGljYWxseSBpbnZva2VzIGB0aGlzLndhaXRVbnRpbCgpYCxcbiAgICAgKiBzbyB5b3UgZG8gbm90IGhhdmUgdG8gbWFudWFsbHkgY2FsbCBgd2FpdFVudGlsKClgIG9uIHRoZSBldmVudC5cbiAgICAgKlxuICAgICAqIEBwYXJhbSB7UmVxdWVzdHxzdHJpbmd9IGlucHV0IFRoZSByZXF1ZXN0IG9yIFVSTCB0byBmZXRjaCBhbmQgY2FjaGUuXG4gICAgICogQHJldHVybiB7UHJvbWlzZTxSZXNwb25zZT59XG4gICAgICovXG4gICAgYXN5bmMgZmV0Y2hBbmRDYWNoZVB1dChpbnB1dCkge1xuICAgICAgICBjb25zdCByZXNwb25zZSA9IGF3YWl0IHRoaXMuZmV0Y2goaW5wdXQpO1xuICAgICAgICBjb25zdCByZXNwb25zZUNsb25lID0gcmVzcG9uc2UuY2xvbmUoKTtcbiAgICAgICAgdm9pZCB0aGlzLndhaXRVbnRpbCh0aGlzLmNhY2hlUHV0KGlucHV0LCByZXNwb25zZUNsb25lKSk7XG4gICAgICAgIHJldHVybiByZXNwb25zZTtcbiAgICB9XG4gICAgLyoqXG4gICAgICogTWF0Y2hlcyBhIHJlcXVlc3QgZnJvbSB0aGUgY2FjaGUgKGFuZCBpbnZva2VzIGFueSBhcHBsaWNhYmxlIHBsdWdpblxuICAgICAqIGNhbGxiYWNrIG1ldGhvZHMpIHVzaW5nIHRoZSBgY2FjaGVOYW1lYCwgYG1hdGNoT3B0aW9uc2AsIGFuZCBgcGx1Z2luc2BcbiAgICAgKiBkZWZpbmVkIG9uIHRoZSBzdHJhdGVneSBvYmplY3QuXG4gICAgICpcbiAgICAgKiBUaGUgZm9sbG93aW5nIHBsdWdpbiBsaWZlY3ljbGUgbWV0aG9kcyBhcmUgaW52b2tlZCB3aGVuIHVzaW5nIHRoaXMgbWV0aG9kOlxuICAgICAqIC0gY2FjaGVLZXlXaWxsQmVVc2VkKClcbiAgICAgKiAtIGNhY2hlZFJlc3BvbnNlV2lsbEJlVXNlZCgpXG4gICAgICpcbiAgICAgKiBAcGFyYW0ge1JlcXVlc3R8c3RyaW5nfSBrZXkgVGhlIFJlcXVlc3Qgb3IgVVJMIHRvIHVzZSBhcyB0aGUgY2FjaGUga2V5LlxuICAgICAqIEByZXR1cm4ge1Byb21pc2U8UmVzcG9uc2V8dW5kZWZpbmVkPn0gQSBtYXRjaGluZyByZXNwb25zZSwgaWYgZm91bmQuXG4gICAgICovXG4gICAgYXN5bmMgY2FjaGVNYXRjaChrZXkpIHtcbiAgICAgICAgY29uc3QgcmVxdWVzdCA9IHRvUmVxdWVzdChrZXkpO1xuICAgICAgICBsZXQgY2FjaGVkUmVzcG9uc2U7XG4gICAgICAgIGNvbnN0IHsgY2FjaGVOYW1lLCBtYXRjaE9wdGlvbnMgfSA9IHRoaXMuX3N0cmF0ZWd5O1xuICAgICAgICBjb25zdCBlZmZlY3RpdmVSZXF1ZXN0ID0gYXdhaXQgdGhpcy5nZXRDYWNoZUtleShyZXF1ZXN0LCAncmVhZCcpO1xuICAgICAgICBjb25zdCBtdWx0aU1hdGNoT3B0aW9ucyA9IE9iamVjdC5hc3NpZ24oT2JqZWN0LmFzc2lnbih7fSwgbWF0Y2hPcHRpb25zKSwgeyBjYWNoZU5hbWUgfSk7XG4gICAgICAgIGNhY2hlZFJlc3BvbnNlID0gYXdhaXQgY2FjaGVzLm1hdGNoKGVmZmVjdGl2ZVJlcXVlc3QsIG11bHRpTWF0Y2hPcHRpb25zKTtcbiAgICAgICAgaWYgKHByb2Nlc3MuZW52Lk5PREVfRU5WICE9PSAncHJvZHVjdGlvbicpIHtcbiAgICAgICAgICAgIGlmIChjYWNoZWRSZXNwb25zZSkge1xuICAgICAgICAgICAgICAgIGxvZ2dlci5kZWJ1ZyhgRm91bmQgYSBjYWNoZWQgcmVzcG9uc2UgaW4gJyR7Y2FjaGVOYW1lfScuYCk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBlbHNlIHtcbiAgICAgICAgICAgICAgICBsb2dnZXIuZGVidWcoYE5vIGNhY2hlZCByZXNwb25zZSBmb3VuZCBpbiAnJHtjYWNoZU5hbWV9Jy5gKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgICBmb3IgKGNvbnN0IGNhbGxiYWNrIG9mIHRoaXMuaXRlcmF0ZUNhbGxiYWNrcygnY2FjaGVkUmVzcG9uc2VXaWxsQmVVc2VkJykpIHtcbiAgICAgICAgICAgIGNhY2hlZFJlc3BvbnNlID1cbiAgICAgICAgICAgICAgICAoYXdhaXQgY2FsbGJhY2soe1xuICAgICAgICAgICAgICAgICAgICBjYWNoZU5hbWUsXG4gICAgICAgICAgICAgICAgICAgIG1hdGNoT3B0aW9ucyxcbiAgICAgICAgICAgICAgICAgICAgY2FjaGVkUmVzcG9uc2UsXG4gICAgICAgICAgICAgICAgICAgIHJlcXVlc3Q6IGVmZmVjdGl2ZVJlcXVlc3QsXG4gICAgICAgICAgICAgICAgICAgIGV2ZW50OiB0aGlzLmV2ZW50LFxuICAgICAgICAgICAgICAgIH0pKSB8fCB1bmRlZmluZWQ7XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIGNhY2hlZFJlc3BvbnNlO1xuICAgIH1cbiAgICAvKipcbiAgICAgKiBQdXRzIGEgcmVxdWVzdC9yZXNwb25zZSBwYWlyIGluIHRoZSBjYWNoZSAoYW5kIGludm9rZXMgYW55IGFwcGxpY2FibGVcbiAgICAgKiBwbHVnaW4gY2FsbGJhY2sgbWV0aG9kcykgdXNpbmcgdGhlIGBjYWNoZU5hbWVgIGFuZCBgcGx1Z2luc2AgZGVmaW5lZCBvblxuICAgICAqIHRoZSBzdHJhdGVneSBvYmplY3QuXG4gICAgICpcbiAgICAgKiBUaGUgZm9sbG93aW5nIHBsdWdpbiBsaWZlY3ljbGUgbWV0aG9kcyBhcmUgaW52b2tlZCB3aGVuIHVzaW5nIHRoaXMgbWV0aG9kOlxuICAgICAqIC0gY2FjaGVLZXlXaWxsQmVVc2VkKClcbiAgICAgKiAtIGNhY2hlV2lsbFVwZGF0ZSgpXG4gICAgICogLSBjYWNoZURpZFVwZGF0ZSgpXG4gICAgICpcbiAgICAgKiBAcGFyYW0ge1JlcXVlc3R8c3RyaW5nfSBrZXkgVGhlIHJlcXVlc3Qgb3IgVVJMIHRvIHVzZSBhcyB0aGUgY2FjaGUga2V5LlxuICAgICAqIEBwYXJhbSB7UmVzcG9uc2V9IHJlc3BvbnNlIFRoZSByZXNwb25zZSB0byBjYWNoZS5cbiAgICAgKiBAcmV0dXJuIHtQcm9taXNlPGJvb2xlYW4+fSBgZmFsc2VgIGlmIGEgY2FjaGVXaWxsVXBkYXRlIGNhdXNlZCB0aGUgcmVzcG9uc2VcbiAgICAgKiBub3QgYmUgY2FjaGVkLCBhbmQgYHRydWVgIG90aGVyd2lzZS5cbiAgICAgKi9cbiAgICBhc3luYyBjYWNoZVB1dChrZXksIHJlc3BvbnNlKSB7XG4gICAgICAgIGNvbnN0IHJlcXVlc3QgPSB0b1JlcXVlc3Qoa2V5KTtcbiAgICAgICAgLy8gUnVuIGluIHRoZSBuZXh0IHRhc2sgdG8gYXZvaWQgYmxvY2tpbmcgb3RoZXIgY2FjaGUgcmVhZHMuXG4gICAgICAgIC8vIGh0dHBzOi8vZ2l0aHViLmNvbS93M2MvU2VydmljZVdvcmtlci9pc3N1ZXMvMTM5N1xuICAgICAgICBhd2FpdCB0aW1lb3V0KDApO1xuICAgICAgICBjb25zdCBlZmZlY3RpdmVSZXF1ZXN0ID0gYXdhaXQgdGhpcy5nZXRDYWNoZUtleShyZXF1ZXN0LCAnd3JpdGUnKTtcbiAgICAgICAgaWYgKHByb2Nlc3MuZW52Lk5PREVfRU5WICE9PSAncHJvZHVjdGlvbicpIHtcbiAgICAgICAgICAgIGlmIChlZmZlY3RpdmVSZXF1ZXN0Lm1ldGhvZCAmJiBlZmZlY3RpdmVSZXF1ZXN0Lm1ldGhvZCAhPT0gJ0dFVCcpIHtcbiAgICAgICAgICAgICAgICB0aHJvdyBuZXcgV29ya2JveEVycm9yKCdhdHRlbXB0LXRvLWNhY2hlLW5vbi1nZXQtcmVxdWVzdCcsIHtcbiAgICAgICAgICAgICAgICAgICAgdXJsOiBnZXRGcmllbmRseVVSTChlZmZlY3RpdmVSZXF1ZXN0LnVybCksXG4gICAgICAgICAgICAgICAgICAgIG1ldGhvZDogZWZmZWN0aXZlUmVxdWVzdC5tZXRob2QsXG4gICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICAvLyBTZWUgaHR0cHM6Ly9naXRodWIuY29tL0dvb2dsZUNocm9tZS93b3JrYm94L2lzc3Vlcy8yODE4XG4gICAgICAgICAgICBjb25zdCB2YXJ5ID0gcmVzcG9uc2UuaGVhZGVycy5nZXQoJ1ZhcnknKTtcbiAgICAgICAgICAgIGlmICh2YXJ5KSB7XG4gICAgICAgICAgICAgICAgbG9nZ2VyLmRlYnVnKGBUaGUgcmVzcG9uc2UgZm9yICR7Z2V0RnJpZW5kbHlVUkwoZWZmZWN0aXZlUmVxdWVzdC51cmwpfSBgICtcbiAgICAgICAgICAgICAgICAgICAgYGhhcyBhICdWYXJ5OiAke3Zhcnl9JyBoZWFkZXIuIGAgK1xuICAgICAgICAgICAgICAgICAgICBgQ29uc2lkZXIgc2V0dGluZyB0aGUge2lnbm9yZVZhcnk6IHRydWV9IG9wdGlvbiBvbiB5b3VyIHN0cmF0ZWd5IGAgK1xuICAgICAgICAgICAgICAgICAgICBgdG8gZW5zdXJlIGNhY2hlIG1hdGNoaW5nIGFuZCBkZWxldGlvbiB3b3JrcyBhcyBleHBlY3RlZC5gKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgICBpZiAoIXJlc3BvbnNlKSB7XG4gICAgICAgICAgICBpZiAocHJvY2Vzcy5lbnYuTk9ERV9FTlYgIT09ICdwcm9kdWN0aW9uJykge1xuICAgICAgICAgICAgICAgIGxvZ2dlci5lcnJvcihgQ2Fubm90IGNhY2hlIG5vbi1leGlzdGVudCByZXNwb25zZSBmb3IgYCArXG4gICAgICAgICAgICAgICAgICAgIGAnJHtnZXRGcmllbmRseVVSTChlZmZlY3RpdmVSZXF1ZXN0LnVybCl9Jy5gKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIHRocm93IG5ldyBXb3JrYm94RXJyb3IoJ2NhY2hlLXB1dC13aXRoLW5vLXJlc3BvbnNlJywge1xuICAgICAgICAgICAgICAgIHVybDogZ2V0RnJpZW5kbHlVUkwoZWZmZWN0aXZlUmVxdWVzdC51cmwpLFxuICAgICAgICAgICAgfSk7XG4gICAgICAgIH1cbiAgICAgICAgY29uc3QgcmVzcG9uc2VUb0NhY2hlID0gYXdhaXQgdGhpcy5fZW5zdXJlUmVzcG9uc2VTYWZlVG9DYWNoZShyZXNwb25zZSk7XG4gICAgICAgIGlmICghcmVzcG9uc2VUb0NhY2hlKSB7XG4gICAgICAgICAgICBpZiAocHJvY2Vzcy5lbnYuTk9ERV9FTlYgIT09ICdwcm9kdWN0aW9uJykge1xuICAgICAgICAgICAgICAgIGxvZ2dlci5kZWJ1ZyhgUmVzcG9uc2UgJyR7Z2V0RnJpZW5kbHlVUkwoZWZmZWN0aXZlUmVxdWVzdC51cmwpfScgYCArXG4gICAgICAgICAgICAgICAgICAgIGB3aWxsIG5vdCBiZSBjYWNoZWQuYCwgcmVzcG9uc2VUb0NhY2hlKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIHJldHVybiBmYWxzZTtcbiAgICAgICAgfVxuICAgICAgICBjb25zdCB7IGNhY2hlTmFtZSwgbWF0Y2hPcHRpb25zIH0gPSB0aGlzLl9zdHJhdGVneTtcbiAgICAgICAgY29uc3QgY2FjaGUgPSBhd2FpdCBzZWxmLmNhY2hlcy5vcGVuKGNhY2hlTmFtZSk7XG4gICAgICAgIGNvbnN0IGhhc0NhY2hlVXBkYXRlQ2FsbGJhY2sgPSB0aGlzLmhhc0NhbGxiYWNrKCdjYWNoZURpZFVwZGF0ZScpO1xuICAgICAgICBjb25zdCBvbGRSZXNwb25zZSA9IGhhc0NhY2hlVXBkYXRlQ2FsbGJhY2tcbiAgICAgICAgICAgID8gYXdhaXQgY2FjaGVNYXRjaElnbm9yZVBhcmFtcyhcbiAgICAgICAgICAgIC8vIFRPRE8ocGhpbGlwd2FsdG9uKTogdGhlIGBfX1dCX1JFVklTSU9OX19gIHBhcmFtIGlzIGEgcHJlY2FjaGluZ1xuICAgICAgICAgICAgLy8gZmVhdHVyZS4gQ29uc2lkZXIgaW50byB3YXlzIHRvIG9ubHkgYWRkIHRoaXMgYmVoYXZpb3IgaWYgdXNpbmdcbiAgICAgICAgICAgIC8vIHByZWNhY2hpbmcuXG4gICAgICAgICAgICBjYWNoZSwgZWZmZWN0aXZlUmVxdWVzdC5jbG9uZSgpLCBbJ19fV0JfUkVWSVNJT05fXyddLCBtYXRjaE9wdGlvbnMpXG4gICAgICAgICAgICA6IG51bGw7XG4gICAgICAgIGlmIChwcm9jZXNzLmVudi5OT0RFX0VOViAhPT0gJ3Byb2R1Y3Rpb24nKSB7XG4gICAgICAgICAgICBsb2dnZXIuZGVidWcoYFVwZGF0aW5nIHRoZSAnJHtjYWNoZU5hbWV9JyBjYWNoZSB3aXRoIGEgbmV3IFJlc3BvbnNlIGAgK1xuICAgICAgICAgICAgICAgIGBmb3IgJHtnZXRGcmllbmRseVVSTChlZmZlY3RpdmVSZXF1ZXN0LnVybCl9LmApO1xuICAgICAgICB9XG4gICAgICAgIHRyeSB7XG4gICAgICAgICAgICBhd2FpdCBjYWNoZS5wdXQoZWZmZWN0aXZlUmVxdWVzdCwgaGFzQ2FjaGVVcGRhdGVDYWxsYmFjayA/IHJlc3BvbnNlVG9DYWNoZS5jbG9uZSgpIDogcmVzcG9uc2VUb0NhY2hlKTtcbiAgICAgICAgfVxuICAgICAgICBjYXRjaCAoZXJyb3IpIHtcbiAgICAgICAgICAgIGlmIChlcnJvciBpbnN0YW5jZW9mIEVycm9yKSB7XG4gICAgICAgICAgICAgICAgLy8gU2VlIGh0dHBzOi8vZGV2ZWxvcGVyLm1vemlsbGEub3JnL2VuLVVTL2RvY3MvV2ViL0FQSS9ET01FeGNlcHRpb24jZXhjZXB0aW9uLVF1b3RhRXhjZWVkZWRFcnJvclxuICAgICAgICAgICAgICAgIGlmIChlcnJvci5uYW1lID09PSAnUXVvdGFFeGNlZWRlZEVycm9yJykge1xuICAgICAgICAgICAgICAgICAgICBhd2FpdCBleGVjdXRlUXVvdGFFcnJvckNhbGxiYWNrcygpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB0aHJvdyBlcnJvcjtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgICBmb3IgKGNvbnN0IGNhbGxiYWNrIG9mIHRoaXMuaXRlcmF0ZUNhbGxiYWNrcygnY2FjaGVEaWRVcGRhdGUnKSkge1xuICAgICAgICAgICAgYXdhaXQgY2FsbGJhY2soe1xuICAgICAgICAgICAgICAgIGNhY2hlTmFtZSxcbiAgICAgICAgICAgICAgICBvbGRSZXNwb25zZSxcbiAgICAgICAgICAgICAgICBuZXdSZXNwb25zZTogcmVzcG9uc2VUb0NhY2hlLmNsb25lKCksXG4gICAgICAgICAgICAgICAgcmVxdWVzdDogZWZmZWN0aXZlUmVxdWVzdCxcbiAgICAgICAgICAgICAgICBldmVudDogdGhpcy5ldmVudCxcbiAgICAgICAgICAgIH0pO1xuICAgICAgICB9XG4gICAgICAgIHJldHVybiB0cnVlO1xuICAgIH1cbiAgICAvKipcbiAgICAgKiBDaGVja3MgdGhlIGxpc3Qgb2YgcGx1Z2lucyBmb3IgdGhlIGBjYWNoZUtleVdpbGxCZVVzZWRgIGNhbGxiYWNrLCBhbmRcbiAgICAgKiBleGVjdXRlcyBhbnkgb2YgdGhvc2UgY2FsbGJhY2tzIGZvdW5kIGluIHNlcXVlbmNlLiBUaGUgZmluYWwgYFJlcXVlc3RgXG4gICAgICogb2JqZWN0IHJldHVybmVkIGJ5IHRoZSBsYXN0IHBsdWdpbiBpcyB0cmVhdGVkIGFzIHRoZSBjYWNoZSBrZXkgZm9yIGNhY2hlXG4gICAgICogcmVhZHMgYW5kL29yIHdyaXRlcy4gSWYgbm8gYGNhY2hlS2V5V2lsbEJlVXNlZGAgcGx1Z2luIGNhbGxiYWNrcyBoYXZlXG4gICAgICogYmVlbiByZWdpc3RlcmVkLCB0aGUgcGFzc2VkIHJlcXVlc3QgaXMgcmV0dXJuZWQgdW5tb2RpZmllZFxuICAgICAqXG4gICAgICogQHBhcmFtIHtSZXF1ZXN0fSByZXF1ZXN0XG4gICAgICogQHBhcmFtIHtzdHJpbmd9IG1vZGVcbiAgICAgKiBAcmV0dXJuIHtQcm9taXNlPFJlcXVlc3Q+fVxuICAgICAqL1xuICAgIGFzeW5jIGdldENhY2hlS2V5KHJlcXVlc3QsIG1vZGUpIHtcbiAgICAgICAgY29uc3Qga2V5ID0gYCR7cmVxdWVzdC51cmx9IHwgJHttb2RlfWA7XG4gICAgICAgIGlmICghdGhpcy5fY2FjaGVLZXlzW2tleV0pIHtcbiAgICAgICAgICAgIGxldCBlZmZlY3RpdmVSZXF1ZXN0ID0gcmVxdWVzdDtcbiAgICAgICAgICAgIGZvciAoY29uc3QgY2FsbGJhY2sgb2YgdGhpcy5pdGVyYXRlQ2FsbGJhY2tzKCdjYWNoZUtleVdpbGxCZVVzZWQnKSkge1xuICAgICAgICAgICAgICAgIGVmZmVjdGl2ZVJlcXVlc3QgPSB0b1JlcXVlc3QoYXdhaXQgY2FsbGJhY2soe1xuICAgICAgICAgICAgICAgICAgICBtb2RlLFxuICAgICAgICAgICAgICAgICAgICByZXF1ZXN0OiBlZmZlY3RpdmVSZXF1ZXN0LFxuICAgICAgICAgICAgICAgICAgICBldmVudDogdGhpcy5ldmVudCxcbiAgICAgICAgICAgICAgICAgICAgLy8gcGFyYW1zIGhhcyBhIHR5cGUgYW55IGNhbid0IGNoYW5nZSByaWdodCBub3cuXG4gICAgICAgICAgICAgICAgICAgIHBhcmFtczogdGhpcy5wYXJhbXMsIC8vIGVzbGludC1kaXNhYmxlLWxpbmVcbiAgICAgICAgICAgICAgICB9KSk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICB0aGlzLl9jYWNoZUtleXNba2V5XSA9IGVmZmVjdGl2ZVJlcXVlc3Q7XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIHRoaXMuX2NhY2hlS2V5c1trZXldO1xuICAgIH1cbiAgICAvKipcbiAgICAgKiBSZXR1cm5zIHRydWUgaWYgdGhlIHN0cmF0ZWd5IGhhcyBhdCBsZWFzdCBvbmUgcGx1Z2luIHdpdGggdGhlIGdpdmVuXG4gICAgICogY2FsbGJhY2suXG4gICAgICpcbiAgICAgKiBAcGFyYW0ge3N0cmluZ30gbmFtZSBUaGUgbmFtZSBvZiB0aGUgY2FsbGJhY2sgdG8gY2hlY2sgZm9yLlxuICAgICAqIEByZXR1cm4ge2Jvb2xlYW59XG4gICAgICovXG4gICAgaGFzQ2FsbGJhY2sobmFtZSkge1xuICAgICAgICBmb3IgKGNvbnN0IHBsdWdpbiBvZiB0aGlzLl9zdHJhdGVneS5wbHVnaW5zKSB7XG4gICAgICAgICAgICBpZiAobmFtZSBpbiBwbHVnaW4pIHtcbiAgICAgICAgICAgICAgICByZXR1cm4gdHJ1ZTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gZmFsc2U7XG4gICAgfVxuICAgIC8qKlxuICAgICAqIFJ1bnMgYWxsIHBsdWdpbiBjYWxsYmFja3MgbWF0Y2hpbmcgdGhlIGdpdmVuIG5hbWUsIGluIG9yZGVyLCBwYXNzaW5nIHRoZVxuICAgICAqIGdpdmVuIHBhcmFtIG9iamVjdCAobWVyZ2VkIGl0aCB0aGUgY3VycmVudCBwbHVnaW4gc3RhdGUpIGFzIHRoZSBvbmx5XG4gICAgICogYXJndW1lbnQuXG4gICAgICpcbiAgICAgKiBOb3RlOiBzaW5jZSB0aGlzIG1ldGhvZCBydW5zIGFsbCBwbHVnaW5zLCBpdCdzIG5vdCBzdWl0YWJsZSBmb3IgY2FzZXNcbiAgICAgKiB3aGVyZSB0aGUgcmV0dXJuIHZhbHVlIG9mIGEgY2FsbGJhY2sgbmVlZHMgdG8gYmUgYXBwbGllZCBwcmlvciB0byBjYWxsaW5nXG4gICAgICogdGhlIG5leHQgY2FsbGJhY2suIFNlZVxuICAgICAqIHtAbGluayB3b3JrYm94LXN0cmF0ZWdpZXMuU3RyYXRlZ3lIYW5kbGVyI2l0ZXJhdGVDYWxsYmFja3N9XG4gICAgICogYmVsb3cgZm9yIGhvdyB0byBoYW5kbGUgdGhhdCBjYXNlLlxuICAgICAqXG4gICAgICogQHBhcmFtIHtzdHJpbmd9IG5hbWUgVGhlIG5hbWUgb2YgdGhlIGNhbGxiYWNrIHRvIHJ1biB3aXRoaW4gZWFjaCBwbHVnaW4uXG4gICAgICogQHBhcmFtIHtPYmplY3R9IHBhcmFtIFRoZSBvYmplY3QgdG8gcGFzcyBhcyB0aGUgZmlyc3QgKGFuZCBvbmx5KSBwYXJhbVxuICAgICAqICAgICB3aGVuIGV4ZWN1dGluZyBlYWNoIGNhbGxiYWNrLiBUaGlzIG9iamVjdCB3aWxsIGJlIG1lcmdlZCB3aXRoIHRoZVxuICAgICAqICAgICBjdXJyZW50IHBsdWdpbiBzdGF0ZSBwcmlvciB0byBjYWxsYmFjayBleGVjdXRpb24uXG4gICAgICovXG4gICAgYXN5bmMgcnVuQ2FsbGJhY2tzKG5hbWUsIHBhcmFtKSB7XG4gICAgICAgIGZvciAoY29uc3QgY2FsbGJhY2sgb2YgdGhpcy5pdGVyYXRlQ2FsbGJhY2tzKG5hbWUpKSB7XG4gICAgICAgICAgICAvLyBUT0RPKHBoaWxpcHdhbHRvbik6IG5vdCBzdXJlIHdoeSBgYW55YCBpcyBuZWVkZWQuIEl0IHNlZW1zIGxpa2VcbiAgICAgICAgICAgIC8vIHRoaXMgc2hvdWxkIHdvcmsgd2l0aCBgYXMgV29ya2JveFBsdWdpbkNhbGxiYWNrUGFyYW1bQ11gLlxuICAgICAgICAgICAgYXdhaXQgY2FsbGJhY2socGFyYW0pO1xuICAgICAgICB9XG4gICAgfVxuICAgIC8qKlxuICAgICAqIEFjY2VwdHMgYSBjYWxsYmFjayBhbmQgcmV0dXJucyBhbiBpdGVyYWJsZSBvZiBtYXRjaGluZyBwbHVnaW4gY2FsbGJhY2tzLFxuICAgICAqIHdoZXJlIGVhY2ggY2FsbGJhY2sgaXMgd3JhcHBlZCB3aXRoIHRoZSBjdXJyZW50IGhhbmRsZXIgc3RhdGUgKGkuZS4gd2hlblxuICAgICAqIHlvdSBjYWxsIGVhY2ggY2FsbGJhY2ssIHdoYXRldmVyIG9iamVjdCBwYXJhbWV0ZXIgeW91IHBhc3MgaXQgd2lsbFxuICAgICAqIGJlIG1lcmdlZCB3aXRoIHRoZSBwbHVnaW4ncyBjdXJyZW50IHN0YXRlKS5cbiAgICAgKlxuICAgICAqIEBwYXJhbSB7c3RyaW5nfSBuYW1lIFRoZSBuYW1lIGZvIHRoZSBjYWxsYmFjayB0byBydW5cbiAgICAgKiBAcmV0dXJuIHtBcnJheTxGdW5jdGlvbj59XG4gICAgICovXG4gICAgKml0ZXJhdGVDYWxsYmFja3MobmFtZSkge1xuICAgICAgICBmb3IgKGNvbnN0IHBsdWdpbiBvZiB0aGlzLl9zdHJhdGVneS5wbHVnaW5zKSB7XG4gICAgICAgICAgICBpZiAodHlwZW9mIHBsdWdpbltuYW1lXSA9PT0gJ2Z1bmN0aW9uJykge1xuICAgICAgICAgICAgICAgIGNvbnN0IHN0YXRlID0gdGhpcy5fcGx1Z2luU3RhdGVNYXAuZ2V0KHBsdWdpbik7XG4gICAgICAgICAgICAgICAgY29uc3Qgc3RhdGVmdWxDYWxsYmFjayA9IChwYXJhbSkgPT4ge1xuICAgICAgICAgICAgICAgICAgICBjb25zdCBzdGF0ZWZ1bFBhcmFtID0gT2JqZWN0LmFzc2lnbihPYmplY3QuYXNzaWduKHt9LCBwYXJhbSksIHsgc3RhdGUgfSk7XG4gICAgICAgICAgICAgICAgICAgIC8vIFRPRE8ocGhpbGlwd2FsdG9uKTogbm90IHN1cmUgd2h5IGBhbnlgIGlzIG5lZWRlZC4gSXQgc2VlbXMgbGlrZVxuICAgICAgICAgICAgICAgICAgICAvLyB0aGlzIHNob3VsZCB3b3JrIHdpdGggYGFzIFdvcmtib3hQbHVnaW5DYWxsYmFja1BhcmFtW0NdYC5cbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIHBsdWdpbltuYW1lXShzdGF0ZWZ1bFBhcmFtKTtcbiAgICAgICAgICAgICAgICB9O1xuICAgICAgICAgICAgICAgIHlpZWxkIHN0YXRlZnVsQ2FsbGJhY2s7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICB9XG4gICAgLyoqXG4gICAgICogQWRkcyBhIHByb21pc2UgdG8gdGhlXG4gICAgICogW2V4dGVuZCBsaWZldGltZSBwcm9taXNlc117QGxpbmsgaHR0cHM6Ly93M2MuZ2l0aHViLmlvL1NlcnZpY2VXb3JrZXIvI2V4dGVuZGFibGVldmVudC1leHRlbmQtbGlmZXRpbWUtcHJvbWlzZXN9XG4gICAgICogb2YgdGhlIGV2ZW50IGV2ZW50IGFzc29jaWF0ZWQgd2l0aCB0aGUgcmVxdWVzdCBiZWluZyBoYW5kbGVkICh1c3VhbGx5IGFcbiAgICAgKiBgRmV0Y2hFdmVudGApLlxuICAgICAqXG4gICAgICogTm90ZTogeW91IGNhbiBhd2FpdFxuICAgICAqIHtAbGluayB3b3JrYm94LXN0cmF0ZWdpZXMuU3RyYXRlZ3lIYW5kbGVyfmRvbmVXYWl0aW5nfVxuICAgICAqIHRvIGtub3cgd2hlbiBhbGwgYWRkZWQgcHJvbWlzZXMgaGF2ZSBzZXR0bGVkLlxuICAgICAqXG4gICAgICogQHBhcmFtIHtQcm9taXNlfSBwcm9taXNlIEEgcHJvbWlzZSB0byBhZGQgdG8gdGhlIGV4dGVuZCBsaWZldGltZSBwcm9taXNlc1xuICAgICAqICAgICBvZiB0aGUgZXZlbnQgdGhhdCB0cmlnZ2VyZWQgdGhlIHJlcXVlc3QuXG4gICAgICovXG4gICAgd2FpdFVudGlsKHByb21pc2UpIHtcbiAgICAgICAgdGhpcy5fZXh0ZW5kTGlmZXRpbWVQcm9taXNlcy5wdXNoKHByb21pc2UpO1xuICAgICAgICByZXR1cm4gcHJvbWlzZTtcbiAgICB9XG4gICAgLyoqXG4gICAgICogUmV0dXJucyBhIHByb21pc2UgdGhhdCByZXNvbHZlcyBvbmNlIGFsbCBwcm9taXNlcyBwYXNzZWQgdG9cbiAgICAgKiB7QGxpbmsgd29ya2JveC1zdHJhdGVnaWVzLlN0cmF0ZWd5SGFuZGxlcn53YWl0VW50aWx9XG4gICAgICogaGF2ZSBzZXR0bGVkLlxuICAgICAqXG4gICAgICogTm90ZTogYW55IHdvcmsgZG9uZSBhZnRlciBgZG9uZVdhaXRpbmcoKWAgc2V0dGxlcyBzaG91bGQgYmUgbWFudWFsbHlcbiAgICAgKiBwYXNzZWQgdG8gYW4gZXZlbnQncyBgd2FpdFVudGlsKClgIG1ldGhvZCAobm90IHRoaXMgaGFuZGxlcidzXG4gICAgICogYHdhaXRVbnRpbCgpYCBtZXRob2QpLCBvdGhlcndpc2UgdGhlIHNlcnZpY2Ugd29ya2VyIHRocmVhZCBteSBiZSBraWxsZWRcbiAgICAgKiBwcmlvciB0byB5b3VyIHdvcmsgY29tcGxldGluZy5cbiAgICAgKi9cbiAgICBhc3luYyBkb25lV2FpdGluZygpIHtcbiAgICAgICAgbGV0IHByb21pc2U7XG4gICAgICAgIHdoaWxlICgocHJvbWlzZSA9IHRoaXMuX2V4dGVuZExpZmV0aW1lUHJvbWlzZXMuc2hpZnQoKSkpIHtcbiAgICAgICAgICAgIGF3YWl0IHByb21pc2U7XG4gICAgICAgIH1cbiAgICB9XG4gICAgLyoqXG4gICAgICogU3RvcHMgcnVubmluZyB0aGUgc3RyYXRlZ3kgYW5kIGltbWVkaWF0ZWx5IHJlc29sdmVzIGFueSBwZW5kaW5nXG4gICAgICogYHdhaXRVbnRpbCgpYCBwcm9taXNlcy5cbiAgICAgKi9cbiAgICBkZXN0cm95KCkge1xuICAgICAgICB0aGlzLl9oYW5kbGVyRGVmZXJyZWQucmVzb2x2ZShudWxsKTtcbiAgICB9XG4gICAgLyoqXG4gICAgICogVGhpcyBtZXRob2Qgd2lsbCBjYWxsIGNhY2hlV2lsbFVwZGF0ZSBvbiB0aGUgYXZhaWxhYmxlIHBsdWdpbnMgKG9yIHVzZVxuICAgICAqIHN0YXR1cyA9PT0gMjAwKSB0byBkZXRlcm1pbmUgaWYgdGhlIFJlc3BvbnNlIGlzIHNhZmUgYW5kIHZhbGlkIHRvIGNhY2hlLlxuICAgICAqXG4gICAgICogQHBhcmFtIHtSZXF1ZXN0fSBvcHRpb25zLnJlcXVlc3RcbiAgICAgKiBAcGFyYW0ge1Jlc3BvbnNlfSBvcHRpb25zLnJlc3BvbnNlXG4gICAgICogQHJldHVybiB7UHJvbWlzZTxSZXNwb25zZXx1bmRlZmluZWQ+fVxuICAgICAqXG4gICAgICogQHByaXZhdGVcbiAgICAgKi9cbiAgICBhc3luYyBfZW5zdXJlUmVzcG9uc2VTYWZlVG9DYWNoZShyZXNwb25zZSkge1xuICAgICAgICBsZXQgcmVzcG9uc2VUb0NhY2hlID0gcmVzcG9uc2U7XG4gICAgICAgIGxldCBwbHVnaW5zVXNlZCA9IGZhbHNlO1xuICAgICAgICBmb3IgKGNvbnN0IGNhbGxiYWNrIG9mIHRoaXMuaXRlcmF0ZUNhbGxiYWNrcygnY2FjaGVXaWxsVXBkYXRlJykpIHtcbiAgICAgICAgICAgIHJlc3BvbnNlVG9DYWNoZSA9XG4gICAgICAgICAgICAgICAgKGF3YWl0IGNhbGxiYWNrKHtcbiAgICAgICAgICAgICAgICAgICAgcmVxdWVzdDogdGhpcy5yZXF1ZXN0LFxuICAgICAgICAgICAgICAgICAgICByZXNwb25zZTogcmVzcG9uc2VUb0NhY2hlLFxuICAgICAgICAgICAgICAgICAgICBldmVudDogdGhpcy5ldmVudCxcbiAgICAgICAgICAgICAgICB9KSkgfHwgdW5kZWZpbmVkO1xuICAgICAgICAgICAgcGx1Z2luc1VzZWQgPSB0cnVlO1xuICAgICAgICAgICAgaWYgKCFyZXNwb25zZVRvQ2FjaGUpIHtcbiAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgICBpZiAoIXBsdWdpbnNVc2VkKSB7XG4gICAgICAgICAgICBpZiAocmVzcG9uc2VUb0NhY2hlICYmIHJlc3BvbnNlVG9DYWNoZS5zdGF0dXMgIT09IDIwMCkge1xuICAgICAgICAgICAgICAgIHJlc3BvbnNlVG9DYWNoZSA9IHVuZGVmaW5lZDtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGlmIChwcm9jZXNzLmVudi5OT0RFX0VOViAhPT0gJ3Byb2R1Y3Rpb24nKSB7XG4gICAgICAgICAgICAgICAgaWYgKHJlc3BvbnNlVG9DYWNoZSkge1xuICAgICAgICAgICAgICAgICAgICBpZiAocmVzcG9uc2VUb0NhY2hlLnN0YXR1cyAhPT0gMjAwKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBpZiAocmVzcG9uc2VUb0NhY2hlLnN0YXR1cyA9PT0gMCkge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGxvZ2dlci53YXJuKGBUaGUgcmVzcG9uc2UgZm9yICcke3RoaXMucmVxdWVzdC51cmx9JyBgICtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgYGlzIGFuIG9wYXF1ZSByZXNwb25zZS4gVGhlIGNhY2hpbmcgc3RyYXRlZ3kgdGhhdCB5b3UncmUgYCArXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGB1c2luZyB3aWxsIG5vdCBjYWNoZSBvcGFxdWUgcmVzcG9uc2VzIGJ5IGRlZmF1bHQuYCk7XG4gICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgICAgICBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBsb2dnZXIuZGVidWcoYFRoZSByZXNwb25zZSBmb3IgJyR7dGhpcy5yZXF1ZXN0LnVybH0nIGAgK1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBgcmV0dXJuZWQgYSBzdGF0dXMgY29kZSBvZiAnJHtyZXNwb25zZS5zdGF0dXN9JyBhbmQgd29uJ3QgYCArXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGBiZSBjYWNoZWQgYXMgYSByZXN1bHQuYCk7XG4gICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIHJlc3BvbnNlVG9DYWNoZTtcbiAgICB9XG59XG5leHBvcnQgeyBTdHJhdGVneUhhbmRsZXIgfTtcbiIsICIvKlxuICBDb3B5cmlnaHQgMjAyMCBHb29nbGUgTExDXG5cbiAgVXNlIG9mIHRoaXMgc291cmNlIGNvZGUgaXMgZ292ZXJuZWQgYnkgYW4gTUlULXN0eWxlXG4gIGxpY2Vuc2UgdGhhdCBjYW4gYmUgZm91bmQgaW4gdGhlIExJQ0VOU0UgZmlsZSBvciBhdFxuICBodHRwczovL29wZW5zb3VyY2Uub3JnL2xpY2Vuc2VzL01JVC5cbiovXG5pbXBvcnQgeyBjYWNoZU5hbWVzIH0gZnJvbSAnd29ya2JveC1jb3JlL19wcml2YXRlL2NhY2hlTmFtZXMuanMnO1xuaW1wb3J0IHsgV29ya2JveEVycm9yIH0gZnJvbSAnd29ya2JveC1jb3JlL19wcml2YXRlL1dvcmtib3hFcnJvci5qcyc7XG5pbXBvcnQgeyBsb2dnZXIgfSBmcm9tICd3b3JrYm94LWNvcmUvX3ByaXZhdGUvbG9nZ2VyLmpzJztcbmltcG9ydCB7IGdldEZyaWVuZGx5VVJMIH0gZnJvbSAnd29ya2JveC1jb3JlL19wcml2YXRlL2dldEZyaWVuZGx5VVJMLmpzJztcbmltcG9ydCB7IFN0cmF0ZWd5SGFuZGxlciB9IGZyb20gJy4vU3RyYXRlZ3lIYW5kbGVyLmpzJztcbmltcG9ydCAnLi9fdmVyc2lvbi5qcyc7XG4vKipcbiAqIEFuIGFic3RyYWN0IGJhc2UgY2xhc3MgdGhhdCBhbGwgb3RoZXIgc3RyYXRlZ3kgY2xhc3NlcyBtdXN0IGV4dGVuZCBmcm9tOlxuICpcbiAqIEBtZW1iZXJvZiB3b3JrYm94LXN0cmF0ZWdpZXNcbiAqL1xuY2xhc3MgU3RyYXRlZ3kge1xuICAgIC8qKlxuICAgICAqIENyZWF0ZXMgYSBuZXcgaW5zdGFuY2Ugb2YgdGhlIHN0cmF0ZWd5IGFuZCBzZXRzIGFsbCBkb2N1bWVudGVkIG9wdGlvblxuICAgICAqIHByb3BlcnRpZXMgYXMgcHVibGljIGluc3RhbmNlIHByb3BlcnRpZXMuXG4gICAgICpcbiAgICAgKiBOb3RlOiBpZiBhIGN1c3RvbSBzdHJhdGVneSBjbGFzcyBleHRlbmRzIHRoZSBiYXNlIFN0cmF0ZWd5IGNsYXNzIGFuZCBkb2VzXG4gICAgICogbm90IG5lZWQgbW9yZSB0aGFuIHRoZXNlIHByb3BlcnRpZXMsIGl0IGRvZXMgbm90IG5lZWQgdG8gZGVmaW5lIGl0cyBvd25cbiAgICAgKiBjb25zdHJ1Y3Rvci5cbiAgICAgKlxuICAgICAqIEBwYXJhbSB7T2JqZWN0fSBbb3B0aW9uc11cbiAgICAgKiBAcGFyYW0ge3N0cmluZ30gW29wdGlvbnMuY2FjaGVOYW1lXSBDYWNoZSBuYW1lIHRvIHN0b3JlIGFuZCByZXRyaWV2ZVxuICAgICAqIHJlcXVlc3RzLiBEZWZhdWx0cyB0byB0aGUgY2FjaGUgbmFtZXMgcHJvdmlkZWQgYnlcbiAgICAgKiB7QGxpbmsgd29ya2JveC1jb3JlLmNhY2hlTmFtZXN9LlxuICAgICAqIEBwYXJhbSB7QXJyYXk8T2JqZWN0Pn0gW29wdGlvbnMucGx1Z2luc10gW1BsdWdpbnNde0BsaW5rIGh0dHBzOi8vZGV2ZWxvcGVycy5nb29nbGUuY29tL3dlYi90b29scy93b3JrYm94L2d1aWRlcy91c2luZy1wbHVnaW5zfVxuICAgICAqIHRvIHVzZSBpbiBjb25qdW5jdGlvbiB3aXRoIHRoaXMgY2FjaGluZyBzdHJhdGVneS5cbiAgICAgKiBAcGFyYW0ge09iamVjdH0gW29wdGlvbnMuZmV0Y2hPcHRpb25zXSBWYWx1ZXMgcGFzc2VkIGFsb25nIHRvIHRoZVxuICAgICAqIFtgaW5pdGBdKGh0dHBzOi8vZGV2ZWxvcGVyLm1vemlsbGEub3JnL2VuLVVTL2RvY3MvV2ViL0FQSS9XaW5kb3dPcldvcmtlckdsb2JhbFNjb3BlL2ZldGNoI1BhcmFtZXRlcnMpXG4gICAgICogb2YgW25vbi1uYXZpZ2F0aW9uXShodHRwczovL2dpdGh1Yi5jb20vR29vZ2xlQ2hyb21lL3dvcmtib3gvaXNzdWVzLzE3OTYpXG4gICAgICogYGZldGNoKClgIHJlcXVlc3RzIG1hZGUgYnkgdGhpcyBzdHJhdGVneS5cbiAgICAgKiBAcGFyYW0ge09iamVjdH0gW29wdGlvbnMubWF0Y2hPcHRpb25zXSBUaGVcbiAgICAgKiBbYENhY2hlUXVlcnlPcHRpb25zYF17QGxpbmsgaHR0cHM6Ly93M2MuZ2l0aHViLmlvL1NlcnZpY2VXb3JrZXIvI2RpY3RkZWYtY2FjaGVxdWVyeW9wdGlvbnN9XG4gICAgICogZm9yIGFueSBgY2FjaGUubWF0Y2goKWAgb3IgYGNhY2hlLnB1dCgpYCBjYWxscyBtYWRlIGJ5IHRoaXMgc3RyYXRlZ3kuXG4gICAgICovXG4gICAgY29uc3RydWN0b3Iob3B0aW9ucyA9IHt9KSB7XG4gICAgICAgIC8qKlxuICAgICAgICAgKiBDYWNoZSBuYW1lIHRvIHN0b3JlIGFuZCByZXRyaWV2ZVxuICAgICAgICAgKiByZXF1ZXN0cy4gRGVmYXVsdHMgdG8gdGhlIGNhY2hlIG5hbWVzIHByb3ZpZGVkIGJ5XG4gICAgICAgICAqIHtAbGluayB3b3JrYm94LWNvcmUuY2FjaGVOYW1lc30uXG4gICAgICAgICAqXG4gICAgICAgICAqIEB0eXBlIHtzdHJpbmd9XG4gICAgICAgICAqL1xuICAgICAgICB0aGlzLmNhY2hlTmFtZSA9IGNhY2hlTmFtZXMuZ2V0UnVudGltZU5hbWUob3B0aW9ucy5jYWNoZU5hbWUpO1xuICAgICAgICAvKipcbiAgICAgICAgICogVGhlIGxpc3RcbiAgICAgICAgICogW1BsdWdpbnNde0BsaW5rIGh0dHBzOi8vZGV2ZWxvcGVycy5nb29nbGUuY29tL3dlYi90b29scy93b3JrYm94L2d1aWRlcy91c2luZy1wbHVnaW5zfVxuICAgICAgICAgKiB1c2VkIGJ5IHRoaXMgc3RyYXRlZ3kuXG4gICAgICAgICAqXG4gICAgICAgICAqIEB0eXBlIHtBcnJheTxPYmplY3Q+fVxuICAgICAgICAgKi9cbiAgICAgICAgdGhpcy5wbHVnaW5zID0gb3B0aW9ucy5wbHVnaW5zIHx8IFtdO1xuICAgICAgICAvKipcbiAgICAgICAgICogVmFsdWVzIHBhc3NlZCBhbG9uZyB0byB0aGVcbiAgICAgICAgICogW2Bpbml0YF17QGxpbmsgaHR0cHM6Ly9kZXZlbG9wZXIubW96aWxsYS5vcmcvZW4tVVMvZG9jcy9XZWIvQVBJL1dpbmRvd09yV29ya2VyR2xvYmFsU2NvcGUvZmV0Y2gjUGFyYW1ldGVyc31cbiAgICAgICAgICogb2YgYWxsIGZldGNoKCkgcmVxdWVzdHMgbWFkZSBieSB0aGlzIHN0cmF0ZWd5LlxuICAgICAgICAgKlxuICAgICAgICAgKiBAdHlwZSB7T2JqZWN0fVxuICAgICAgICAgKi9cbiAgICAgICAgdGhpcy5mZXRjaE9wdGlvbnMgPSBvcHRpb25zLmZldGNoT3B0aW9ucztcbiAgICAgICAgLyoqXG4gICAgICAgICAqIFRoZVxuICAgICAgICAgKiBbYENhY2hlUXVlcnlPcHRpb25zYF17QGxpbmsgaHR0cHM6Ly93M2MuZ2l0aHViLmlvL1NlcnZpY2VXb3JrZXIvI2RpY3RkZWYtY2FjaGVxdWVyeW9wdGlvbnN9XG4gICAgICAgICAqIGZvciBhbnkgYGNhY2hlLm1hdGNoKClgIG9yIGBjYWNoZS5wdXQoKWAgY2FsbHMgbWFkZSBieSB0aGlzIHN0cmF0ZWd5LlxuICAgICAgICAgKlxuICAgICAgICAgKiBAdHlwZSB7T2JqZWN0fVxuICAgICAgICAgKi9cbiAgICAgICAgdGhpcy5tYXRjaE9wdGlvbnMgPSBvcHRpb25zLm1hdGNoT3B0aW9ucztcbiAgICB9XG4gICAgLyoqXG4gICAgICogUGVyZm9ybSBhIHJlcXVlc3Qgc3RyYXRlZ3kgYW5kIHJldHVybnMgYSBgUHJvbWlzZWAgdGhhdCB3aWxsIHJlc29sdmUgd2l0aFxuICAgICAqIGEgYFJlc3BvbnNlYCwgaW52b2tpbmcgYWxsIHJlbGV2YW50IHBsdWdpbiBjYWxsYmFja3MuXG4gICAgICpcbiAgICAgKiBXaGVuIGEgc3RyYXRlZ3kgaW5zdGFuY2UgaXMgcmVnaXN0ZXJlZCB3aXRoIGEgV29ya2JveFxuICAgICAqIHtAbGluayB3b3JrYm94LXJvdXRpbmcuUm91dGV9LCB0aGlzIG1ldGhvZCBpcyBhdXRvbWF0aWNhbGx5XG4gICAgICogY2FsbGVkIHdoZW4gdGhlIHJvdXRlIG1hdGNoZXMuXG4gICAgICpcbiAgICAgKiBBbHRlcm5hdGl2ZWx5LCB0aGlzIG1ldGhvZCBjYW4gYmUgdXNlZCBpbiBhIHN0YW5kYWxvbmUgYEZldGNoRXZlbnRgXG4gICAgICogbGlzdGVuZXIgYnkgcGFzc2luZyBpdCB0byBgZXZlbnQucmVzcG9uZFdpdGgoKWAuXG4gICAgICpcbiAgICAgKiBAcGFyYW0ge0ZldGNoRXZlbnR8T2JqZWN0fSBvcHRpb25zIEEgYEZldGNoRXZlbnRgIG9yIGFuIG9iamVjdCB3aXRoIHRoZVxuICAgICAqICAgICBwcm9wZXJ0aWVzIGxpc3RlZCBiZWxvdy5cbiAgICAgKiBAcGFyYW0ge1JlcXVlc3R8c3RyaW5nfSBvcHRpb25zLnJlcXVlc3QgQSByZXF1ZXN0IHRvIHJ1biB0aGlzIHN0cmF0ZWd5IGZvci5cbiAgICAgKiBAcGFyYW0ge0V4dGVuZGFibGVFdmVudH0gb3B0aW9ucy5ldmVudCBUaGUgZXZlbnQgYXNzb2NpYXRlZCB3aXRoIHRoZVxuICAgICAqICAgICByZXF1ZXN0LlxuICAgICAqIEBwYXJhbSB7VVJMfSBbb3B0aW9ucy51cmxdXG4gICAgICogQHBhcmFtIHsqfSBbb3B0aW9ucy5wYXJhbXNdXG4gICAgICovXG4gICAgaGFuZGxlKG9wdGlvbnMpIHtcbiAgICAgICAgY29uc3QgW3Jlc3BvbnNlRG9uZV0gPSB0aGlzLmhhbmRsZUFsbChvcHRpb25zKTtcbiAgICAgICAgcmV0dXJuIHJlc3BvbnNlRG9uZTtcbiAgICB9XG4gICAgLyoqXG4gICAgICogU2ltaWxhciB0byB7QGxpbmsgd29ya2JveC1zdHJhdGVnaWVzLlN0cmF0ZWd5fmhhbmRsZX0sIGJ1dFxuICAgICAqIGluc3RlYWQgb2YganVzdCByZXR1cm5pbmcgYSBgUHJvbWlzZWAgdGhhdCByZXNvbHZlcyB0byBhIGBSZXNwb25zZWAgaXRcbiAgICAgKiBpdCB3aWxsIHJldHVybiBhbiB0dXBsZSBvZiBgW3Jlc3BvbnNlLCBkb25lXWAgcHJvbWlzZXMsIHdoZXJlIHRoZSBmb3JtZXJcbiAgICAgKiAoYHJlc3BvbnNlYCkgaXMgZXF1aXZhbGVudCB0byB3aGF0IGBoYW5kbGUoKWAgcmV0dXJucywgYW5kIHRoZSBsYXR0ZXIgaXMgYVxuICAgICAqIFByb21pc2UgdGhhdCB3aWxsIHJlc29sdmUgb25jZSBhbnkgcHJvbWlzZXMgdGhhdCB3ZXJlIGFkZGVkIHRvXG4gICAgICogYGV2ZW50LndhaXRVbnRpbCgpYCBhcyBwYXJ0IG9mIHBlcmZvcm1pbmcgdGhlIHN0cmF0ZWd5IGhhdmUgY29tcGxldGVkLlxuICAgICAqXG4gICAgICogWW91IGNhbiBhd2FpdCB0aGUgYGRvbmVgIHByb21pc2UgdG8gZW5zdXJlIGFueSBleHRyYSB3b3JrIHBlcmZvcm1lZCBieVxuICAgICAqIHRoZSBzdHJhdGVneSAodXN1YWxseSBjYWNoaW5nIHJlc3BvbnNlcykgY29tcGxldGVzIHN1Y2Nlc3NmdWxseS5cbiAgICAgKlxuICAgICAqIEBwYXJhbSB7RmV0Y2hFdmVudHxPYmplY3R9IG9wdGlvbnMgQSBgRmV0Y2hFdmVudGAgb3IgYW4gb2JqZWN0IHdpdGggdGhlXG4gICAgICogICAgIHByb3BlcnRpZXMgbGlzdGVkIGJlbG93LlxuICAgICAqIEBwYXJhbSB7UmVxdWVzdHxzdHJpbmd9IG9wdGlvbnMucmVxdWVzdCBBIHJlcXVlc3QgdG8gcnVuIHRoaXMgc3RyYXRlZ3kgZm9yLlxuICAgICAqIEBwYXJhbSB7RXh0ZW5kYWJsZUV2ZW50fSBvcHRpb25zLmV2ZW50IFRoZSBldmVudCBhc3NvY2lhdGVkIHdpdGggdGhlXG4gICAgICogICAgIHJlcXVlc3QuXG4gICAgICogQHBhcmFtIHtVUkx9IFtvcHRpb25zLnVybF1cbiAgICAgKiBAcGFyYW0geyp9IFtvcHRpb25zLnBhcmFtc11cbiAgICAgKiBAcmV0dXJuIHtBcnJheTxQcm9taXNlPn0gQSB0dXBsZSBvZiBbcmVzcG9uc2UsIGRvbmVdXG4gICAgICogICAgIHByb21pc2VzIHRoYXQgY2FuIGJlIHVzZWQgdG8gZGV0ZXJtaW5lIHdoZW4gdGhlIHJlc3BvbnNlIHJlc29sdmVzIGFzXG4gICAgICogICAgIHdlbGwgYXMgd2hlbiB0aGUgaGFuZGxlciBoYXMgY29tcGxldGVkIGFsbCBpdHMgd29yay5cbiAgICAgKi9cbiAgICBoYW5kbGVBbGwob3B0aW9ucykge1xuICAgICAgICAvLyBBbGxvdyBmb3IgZmxleGlibGUgb3B0aW9ucyB0byBiZSBwYXNzZWQuXG4gICAgICAgIGlmIChvcHRpb25zIGluc3RhbmNlb2YgRmV0Y2hFdmVudCkge1xuICAgICAgICAgICAgb3B0aW9ucyA9IHtcbiAgICAgICAgICAgICAgICBldmVudDogb3B0aW9ucyxcbiAgICAgICAgICAgICAgICByZXF1ZXN0OiBvcHRpb25zLnJlcXVlc3QsXG4gICAgICAgICAgICB9O1xuICAgICAgICB9XG4gICAgICAgIGNvbnN0IGV2ZW50ID0gb3B0aW9ucy5ldmVudDtcbiAgICAgICAgY29uc3QgcmVxdWVzdCA9IHR5cGVvZiBvcHRpb25zLnJlcXVlc3QgPT09ICdzdHJpbmcnXG4gICAgICAgICAgICA/IG5ldyBSZXF1ZXN0KG9wdGlvbnMucmVxdWVzdClcbiAgICAgICAgICAgIDogb3B0aW9ucy5yZXF1ZXN0O1xuICAgICAgICBjb25zdCBwYXJhbXMgPSAncGFyYW1zJyBpbiBvcHRpb25zID8gb3B0aW9ucy5wYXJhbXMgOiB1bmRlZmluZWQ7XG4gICAgICAgIGNvbnN0IGhhbmRsZXIgPSBuZXcgU3RyYXRlZ3lIYW5kbGVyKHRoaXMsIHsgZXZlbnQsIHJlcXVlc3QsIHBhcmFtcyB9KTtcbiAgICAgICAgY29uc3QgcmVzcG9uc2VEb25lID0gdGhpcy5fZ2V0UmVzcG9uc2UoaGFuZGxlciwgcmVxdWVzdCwgZXZlbnQpO1xuICAgICAgICBjb25zdCBoYW5kbGVyRG9uZSA9IHRoaXMuX2F3YWl0Q29tcGxldGUocmVzcG9uc2VEb25lLCBoYW5kbGVyLCByZXF1ZXN0LCBldmVudCk7XG4gICAgICAgIC8vIFJldHVybiBhbiBhcnJheSBvZiBwcm9taXNlcywgc3VpdGFibGUgZm9yIHVzZSB3aXRoIFByb21pc2UuYWxsKCkuXG4gICAgICAgIHJldHVybiBbcmVzcG9uc2VEb25lLCBoYW5kbGVyRG9uZV07XG4gICAgfVxuICAgIGFzeW5jIF9nZXRSZXNwb25zZShoYW5kbGVyLCByZXF1ZXN0LCBldmVudCkge1xuICAgICAgICBhd2FpdCBoYW5kbGVyLnJ1bkNhbGxiYWNrcygnaGFuZGxlcldpbGxTdGFydCcsIHsgZXZlbnQsIHJlcXVlc3QgfSk7XG4gICAgICAgIGxldCByZXNwb25zZSA9IHVuZGVmaW5lZDtcbiAgICAgICAgdHJ5IHtcbiAgICAgICAgICAgIHJlc3BvbnNlID0gYXdhaXQgdGhpcy5faGFuZGxlKHJlcXVlc3QsIGhhbmRsZXIpO1xuICAgICAgICAgICAgLy8gVGhlIFwib2ZmaWNpYWxcIiBTdHJhdGVneSBzdWJjbGFzc2VzIGFsbCB0aHJvdyB0aGlzIGVycm9yIGF1dG9tYXRpY2FsbHksXG4gICAgICAgICAgICAvLyBidXQgaW4gY2FzZSBhIHRoaXJkLXBhcnR5IFN0cmF0ZWd5IGRvZXNuJ3QsIGVuc3VyZSB0aGF0IHdlIGhhdmUgYVxuICAgICAgICAgICAgLy8gY29uc2lzdGVudCBmYWlsdXJlIHdoZW4gdGhlcmUncyBubyByZXNwb25zZSBvciBhbiBlcnJvciByZXNwb25zZS5cbiAgICAgICAgICAgIGlmICghcmVzcG9uc2UgfHwgcmVzcG9uc2UudHlwZSA9PT0gJ2Vycm9yJykge1xuICAgICAgICAgICAgICAgIHRocm93IG5ldyBXb3JrYm94RXJyb3IoJ25vLXJlc3BvbnNlJywgeyB1cmw6IHJlcXVlc3QudXJsIH0pO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICAgIGNhdGNoIChlcnJvcikge1xuICAgICAgICAgICAgaWYgKGVycm9yIGluc3RhbmNlb2YgRXJyb3IpIHtcbiAgICAgICAgICAgICAgICBmb3IgKGNvbnN0IGNhbGxiYWNrIG9mIGhhbmRsZXIuaXRlcmF0ZUNhbGxiYWNrcygnaGFuZGxlckRpZEVycm9yJykpIHtcbiAgICAgICAgICAgICAgICAgICAgcmVzcG9uc2UgPSBhd2FpdCBjYWxsYmFjayh7IGVycm9yLCBldmVudCwgcmVxdWVzdCB9KTtcbiAgICAgICAgICAgICAgICAgICAgaWYgKHJlc3BvbnNlKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGlmICghcmVzcG9uc2UpIHtcbiAgICAgICAgICAgICAgICB0aHJvdyBlcnJvcjtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGVsc2UgaWYgKHByb2Nlc3MuZW52Lk5PREVfRU5WICE9PSAncHJvZHVjdGlvbicpIHtcbiAgICAgICAgICAgICAgICBsb2dnZXIubG9nKGBXaGlsZSByZXNwb25kaW5nIHRvICcke2dldEZyaWVuZGx5VVJMKHJlcXVlc3QudXJsKX0nLCBgICtcbiAgICAgICAgICAgICAgICAgICAgYGFuICR7ZXJyb3IgaW5zdGFuY2VvZiBFcnJvciA/IGVycm9yLnRvU3RyaW5nKCkgOiAnJ30gZXJyb3Igb2NjdXJyZWQuIFVzaW5nIGEgZmFsbGJhY2sgcmVzcG9uc2UgcHJvdmlkZWQgYnkgYCArXG4gICAgICAgICAgICAgICAgICAgIGBhIGhhbmRsZXJEaWRFcnJvciBwbHVnaW4uYCk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgICAgZm9yIChjb25zdCBjYWxsYmFjayBvZiBoYW5kbGVyLml0ZXJhdGVDYWxsYmFja3MoJ2hhbmRsZXJXaWxsUmVzcG9uZCcpKSB7XG4gICAgICAgICAgICByZXNwb25zZSA9IGF3YWl0IGNhbGxiYWNrKHsgZXZlbnQsIHJlcXVlc3QsIHJlc3BvbnNlIH0pO1xuICAgICAgICB9XG4gICAgICAgIHJldHVybiByZXNwb25zZTtcbiAgICB9XG4gICAgYXN5bmMgX2F3YWl0Q29tcGxldGUocmVzcG9uc2VEb25lLCBoYW5kbGVyLCByZXF1ZXN0LCBldmVudCkge1xuICAgICAgICBsZXQgcmVzcG9uc2U7XG4gICAgICAgIGxldCBlcnJvcjtcbiAgICAgICAgdHJ5IHtcbiAgICAgICAgICAgIHJlc3BvbnNlID0gYXdhaXQgcmVzcG9uc2VEb25lO1xuICAgICAgICB9XG4gICAgICAgIGNhdGNoIChlcnJvcikge1xuICAgICAgICAgICAgLy8gSWdub3JlIGVycm9ycywgYXMgcmVzcG9uc2UgZXJyb3JzIHNob3VsZCBiZSBjYXVnaHQgdmlhIHRoZSBgcmVzcG9uc2VgXG4gICAgICAgICAgICAvLyBwcm9taXNlIGFib3ZlLiBUaGUgYGRvbmVgIHByb21pc2Ugd2lsbCBvbmx5IHRocm93IGZvciBlcnJvcnMgaW5cbiAgICAgICAgICAgIC8vIHByb21pc2VzIHBhc3NlZCB0byBgaGFuZGxlci53YWl0VW50aWwoKWAuXG4gICAgICAgIH1cbiAgICAgICAgdHJ5IHtcbiAgICAgICAgICAgIGF3YWl0IGhhbmRsZXIucnVuQ2FsbGJhY2tzKCdoYW5kbGVyRGlkUmVzcG9uZCcsIHtcbiAgICAgICAgICAgICAgICBldmVudCxcbiAgICAgICAgICAgICAgICByZXF1ZXN0LFxuICAgICAgICAgICAgICAgIHJlc3BvbnNlLFxuICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICBhd2FpdCBoYW5kbGVyLmRvbmVXYWl0aW5nKCk7XG4gICAgICAgIH1cbiAgICAgICAgY2F0Y2ggKHdhaXRVbnRpbEVycm9yKSB7XG4gICAgICAgICAgICBpZiAod2FpdFVudGlsRXJyb3IgaW5zdGFuY2VvZiBFcnJvcikge1xuICAgICAgICAgICAgICAgIGVycm9yID0gd2FpdFVudGlsRXJyb3I7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgICAgYXdhaXQgaGFuZGxlci5ydW5DYWxsYmFja3MoJ2hhbmRsZXJEaWRDb21wbGV0ZScsIHtcbiAgICAgICAgICAgIGV2ZW50LFxuICAgICAgICAgICAgcmVxdWVzdCxcbiAgICAgICAgICAgIHJlc3BvbnNlLFxuICAgICAgICAgICAgZXJyb3I6IGVycm9yLFxuICAgICAgICB9KTtcbiAgICAgICAgaGFuZGxlci5kZXN0cm95KCk7XG4gICAgICAgIGlmIChlcnJvcikge1xuICAgICAgICAgICAgdGhyb3cgZXJyb3I7XG4gICAgICAgIH1cbiAgICB9XG59XG5leHBvcnQgeyBTdHJhdGVneSB9O1xuLyoqXG4gKiBDbGFzc2VzIGV4dGVuZGluZyB0aGUgYFN0cmF0ZWd5YCBiYXNlZCBjbGFzcyBzaG91bGQgaW1wbGVtZW50IHRoaXMgbWV0aG9kLFxuICogYW5kIGxldmVyYWdlIHRoZSB7QGxpbmsgd29ya2JveC1zdHJhdGVnaWVzLlN0cmF0ZWd5SGFuZGxlcn1cbiAqIGFyZyB0byBwZXJmb3JtIGFsbCBmZXRjaGluZyBhbmQgY2FjaGUgbG9naWMsIHdoaWNoIHdpbGwgZW5zdXJlIGFsbCByZWxldmFudFxuICogY2FjaGUsIGNhY2hlIG9wdGlvbnMsIGZldGNoIG9wdGlvbnMgYW5kIHBsdWdpbnMgYXJlIHVzZWQgKHBlciB0aGUgY3VycmVudFxuICogc3RyYXRlZ3kgaW5zdGFuY2UpLlxuICpcbiAqIEBuYW1lIF9oYW5kbGVcbiAqIEBpbnN0YW5jZVxuICogQGFic3RyYWN0XG4gKiBAZnVuY3Rpb25cbiAqIEBwYXJhbSB7UmVxdWVzdH0gcmVxdWVzdFxuICogQHBhcmFtIHt3b3JrYm94LXN0cmF0ZWdpZXMuU3RyYXRlZ3lIYW5kbGVyfSBoYW5kbGVyXG4gKiBAcmV0dXJuIHtQcm9taXNlPFJlc3BvbnNlPn1cbiAqXG4gKiBAbWVtYmVyb2Ygd29ya2JveC1zdHJhdGVnaWVzLlN0cmF0ZWd5XG4gKi9cbiIsICIvKlxuICBDb3B5cmlnaHQgMjAyMCBHb29nbGUgTExDXG5cbiAgVXNlIG9mIHRoaXMgc291cmNlIGNvZGUgaXMgZ292ZXJuZWQgYnkgYW4gTUlULXN0eWxlXG4gIGxpY2Vuc2UgdGhhdCBjYW4gYmUgZm91bmQgaW4gdGhlIExJQ0VOU0UgZmlsZSBvciBhdFxuICBodHRwczovL29wZW5zb3VyY2Uub3JnL2xpY2Vuc2VzL01JVC5cbiovXG5pbXBvcnQgeyBjb3B5UmVzcG9uc2UgfSBmcm9tICd3b3JrYm94LWNvcmUvY29weVJlc3BvbnNlLmpzJztcbmltcG9ydCB7IGNhY2hlTmFtZXMgfSBmcm9tICd3b3JrYm94LWNvcmUvX3ByaXZhdGUvY2FjaGVOYW1lcy5qcyc7XG5pbXBvcnQgeyBnZXRGcmllbmRseVVSTCB9IGZyb20gJ3dvcmtib3gtY29yZS9fcHJpdmF0ZS9nZXRGcmllbmRseVVSTC5qcyc7XG5pbXBvcnQgeyBsb2dnZXIgfSBmcm9tICd3b3JrYm94LWNvcmUvX3ByaXZhdGUvbG9nZ2VyLmpzJztcbmltcG9ydCB7IFdvcmtib3hFcnJvciB9IGZyb20gJ3dvcmtib3gtY29yZS9fcHJpdmF0ZS9Xb3JrYm94RXJyb3IuanMnO1xuaW1wb3J0IHsgU3RyYXRlZ3kgfSBmcm9tICd3b3JrYm94LXN0cmF0ZWdpZXMvU3RyYXRlZ3kuanMnO1xuaW1wb3J0ICcuL192ZXJzaW9uLmpzJztcbi8qKlxuICogQSB7QGxpbmsgd29ya2JveC1zdHJhdGVnaWVzLlN0cmF0ZWd5fSBpbXBsZW1lbnRhdGlvblxuICogc3BlY2lmaWNhbGx5IGRlc2lnbmVkIHRvIHdvcmsgd2l0aFxuICoge0BsaW5rIHdvcmtib3gtcHJlY2FjaGluZy5QcmVjYWNoZUNvbnRyb2xsZXJ9XG4gKiB0byBib3RoIGNhY2hlIGFuZCBmZXRjaCBwcmVjYWNoZWQgYXNzZXRzLlxuICpcbiAqIE5vdGU6IGFuIGluc3RhbmNlIG9mIHRoaXMgY2xhc3MgaXMgY3JlYXRlZCBhdXRvbWF0aWNhbGx5IHdoZW4gY3JlYXRpbmcgYVxuICogYFByZWNhY2hlQ29udHJvbGxlcmA7IGl0J3MgZ2VuZXJhbGx5IG5vdCBuZWNlc3NhcnkgdG8gY3JlYXRlIHRoaXMgeW91cnNlbGYuXG4gKlxuICogQGV4dGVuZHMgd29ya2JveC1zdHJhdGVnaWVzLlN0cmF0ZWd5XG4gKiBAbWVtYmVyb2Ygd29ya2JveC1wcmVjYWNoaW5nXG4gKi9cbmNsYXNzIFByZWNhY2hlU3RyYXRlZ3kgZXh0ZW5kcyBTdHJhdGVneSB7XG4gICAgLyoqXG4gICAgICpcbiAgICAgKiBAcGFyYW0ge09iamVjdH0gW29wdGlvbnNdXG4gICAgICogQHBhcmFtIHtzdHJpbmd9IFtvcHRpb25zLmNhY2hlTmFtZV0gQ2FjaGUgbmFtZSB0byBzdG9yZSBhbmQgcmV0cmlldmVcbiAgICAgKiByZXF1ZXN0cy4gRGVmYXVsdHMgdG8gdGhlIGNhY2hlIG5hbWVzIHByb3ZpZGVkIGJ5XG4gICAgICoge0BsaW5rIHdvcmtib3gtY29yZS5jYWNoZU5hbWVzfS5cbiAgICAgKiBAcGFyYW0ge0FycmF5PE9iamVjdD59IFtvcHRpb25zLnBsdWdpbnNdIHtAbGluayBodHRwczovL2RldmVsb3BlcnMuZ29vZ2xlLmNvbS93ZWIvdG9vbHMvd29ya2JveC9ndWlkZXMvdXNpbmctcGx1Z2luc3xQbHVnaW5zfVxuICAgICAqIHRvIHVzZSBpbiBjb25qdW5jdGlvbiB3aXRoIHRoaXMgY2FjaGluZyBzdHJhdGVneS5cbiAgICAgKiBAcGFyYW0ge09iamVjdH0gW29wdGlvbnMuZmV0Y2hPcHRpb25zXSBWYWx1ZXMgcGFzc2VkIGFsb25nIHRvIHRoZVxuICAgICAqIHtAbGluayBodHRwczovL2RldmVsb3Blci5tb3ppbGxhLm9yZy9lbi1VUy9kb2NzL1dlYi9BUEkvV2luZG93T3JXb3JrZXJHbG9iYWxTY29wZS9mZXRjaCNQYXJhbWV0ZXJzfGluaXR9XG4gICAgICogb2YgYWxsIGZldGNoKCkgcmVxdWVzdHMgbWFkZSBieSB0aGlzIHN0cmF0ZWd5LlxuICAgICAqIEBwYXJhbSB7T2JqZWN0fSBbb3B0aW9ucy5tYXRjaE9wdGlvbnNdIFRoZVxuICAgICAqIHtAbGluayBodHRwczovL3czYy5naXRodWIuaW8vU2VydmljZVdvcmtlci8jZGljdGRlZi1jYWNoZXF1ZXJ5b3B0aW9uc3xDYWNoZVF1ZXJ5T3B0aW9uc31cbiAgICAgKiBmb3IgYW55IGBjYWNoZS5tYXRjaCgpYCBvciBgY2FjaGUucHV0KClgIGNhbGxzIG1hZGUgYnkgdGhpcyBzdHJhdGVneS5cbiAgICAgKiBAcGFyYW0ge2Jvb2xlYW59IFtvcHRpb25zLmZhbGxiYWNrVG9OZXR3b3JrPXRydWVdIFdoZXRoZXIgdG8gYXR0ZW1wdCB0b1xuICAgICAqIGdldCB0aGUgcmVzcG9uc2UgZnJvbSB0aGUgbmV0d29yayBpZiB0aGVyZSdzIGEgcHJlY2FjaGUgbWlzcy5cbiAgICAgKi9cbiAgICBjb25zdHJ1Y3RvcihvcHRpb25zID0ge30pIHtcbiAgICAgICAgb3B0aW9ucy5jYWNoZU5hbWUgPSBjYWNoZU5hbWVzLmdldFByZWNhY2hlTmFtZShvcHRpb25zLmNhY2hlTmFtZSk7XG4gICAgICAgIHN1cGVyKG9wdGlvbnMpO1xuICAgICAgICB0aGlzLl9mYWxsYmFja1RvTmV0d29yayA9XG4gICAgICAgICAgICBvcHRpb25zLmZhbGxiYWNrVG9OZXR3b3JrID09PSBmYWxzZSA/IGZhbHNlIDogdHJ1ZTtcbiAgICAgICAgLy8gUmVkaXJlY3RlZCByZXNwb25zZXMgY2Fubm90IGJlIHVzZWQgdG8gc2F0aXNmeSBhIG5hdmlnYXRpb24gcmVxdWVzdCwgc29cbiAgICAgICAgLy8gYW55IHJlZGlyZWN0ZWQgcmVzcG9uc2UgbXVzdCBiZSBcImNvcGllZFwiIHJhdGhlciB0aGFuIGNsb25lZCwgc28gdGhlIG5ld1xuICAgICAgICAvLyByZXNwb25zZSBkb2Vzbid0IGNvbnRhaW4gdGhlIGByZWRpcmVjdGVkYCBmbGFnLiBTZWU6XG4gICAgICAgIC8vIGh0dHBzOi8vYnVncy5jaHJvbWl1bS5vcmcvcC9jaHJvbWl1bS9pc3N1ZXMvZGV0YWlsP2lkPTY2OTM2MyZkZXNjPTIjYzFcbiAgICAgICAgdGhpcy5wbHVnaW5zLnB1c2goUHJlY2FjaGVTdHJhdGVneS5jb3B5UmVkaXJlY3RlZENhY2hlYWJsZVJlc3BvbnNlc1BsdWdpbik7XG4gICAgfVxuICAgIC8qKlxuICAgICAqIEBwcml2YXRlXG4gICAgICogQHBhcmFtIHtSZXF1ZXN0fHN0cmluZ30gcmVxdWVzdCBBIHJlcXVlc3QgdG8gcnVuIHRoaXMgc3RyYXRlZ3kgZm9yLlxuICAgICAqIEBwYXJhbSB7d29ya2JveC1zdHJhdGVnaWVzLlN0cmF0ZWd5SGFuZGxlcn0gaGFuZGxlciBUaGUgZXZlbnQgdGhhdFxuICAgICAqICAgICB0cmlnZ2VyZWQgdGhlIHJlcXVlc3QuXG4gICAgICogQHJldHVybiB7UHJvbWlzZTxSZXNwb25zZT59XG4gICAgICovXG4gICAgYXN5bmMgX2hhbmRsZShyZXF1ZXN0LCBoYW5kbGVyKSB7XG4gICAgICAgIGNvbnN0IHJlc3BvbnNlID0gYXdhaXQgaGFuZGxlci5jYWNoZU1hdGNoKHJlcXVlc3QpO1xuICAgICAgICBpZiAocmVzcG9uc2UpIHtcbiAgICAgICAgICAgIHJldHVybiByZXNwb25zZTtcbiAgICAgICAgfVxuICAgICAgICAvLyBJZiB0aGlzIGlzIGFuIGBpbnN0YWxsYCBldmVudCBmb3IgYW4gZW50cnkgdGhhdCBpc24ndCBhbHJlYWR5IGNhY2hlZCxcbiAgICAgICAgLy8gdGhlbiBwb3B1bGF0ZSB0aGUgY2FjaGUuXG4gICAgICAgIGlmIChoYW5kbGVyLmV2ZW50ICYmIGhhbmRsZXIuZXZlbnQudHlwZSA9PT0gJ2luc3RhbGwnKSB7XG4gICAgICAgICAgICByZXR1cm4gYXdhaXQgdGhpcy5faGFuZGxlSW5zdGFsbChyZXF1ZXN0LCBoYW5kbGVyKTtcbiAgICAgICAgfVxuICAgICAgICAvLyBHZXR0aW5nIGhlcmUgbWVhbnMgc29tZXRoaW5nIHdlbnQgd3JvbmcuIEFuIGVudHJ5IHRoYXQgc2hvdWxkIGhhdmUgYmVlblxuICAgICAgICAvLyBwcmVjYWNoZWQgd2Fzbid0IGZvdW5kIGluIHRoZSBjYWNoZS5cbiAgICAgICAgcmV0dXJuIGF3YWl0IHRoaXMuX2hhbmRsZUZldGNoKHJlcXVlc3QsIGhhbmRsZXIpO1xuICAgIH1cbiAgICBhc3luYyBfaGFuZGxlRmV0Y2gocmVxdWVzdCwgaGFuZGxlcikge1xuICAgICAgICBsZXQgcmVzcG9uc2U7XG4gICAgICAgIGNvbnN0IHBhcmFtcyA9IChoYW5kbGVyLnBhcmFtcyB8fCB7fSk7XG4gICAgICAgIC8vIEZhbGwgYmFjayB0byB0aGUgbmV0d29yayBpZiB3ZSdyZSBjb25maWd1cmVkIHRvIGRvIHNvLlxuICAgICAgICBpZiAodGhpcy5fZmFsbGJhY2tUb05ldHdvcmspIHtcbiAgICAgICAgICAgIGlmIChwcm9jZXNzLmVudi5OT0RFX0VOViAhPT0gJ3Byb2R1Y3Rpb24nKSB7XG4gICAgICAgICAgICAgICAgbG9nZ2VyLndhcm4oYFRoZSBwcmVjYWNoZWQgcmVzcG9uc2UgZm9yIGAgK1xuICAgICAgICAgICAgICAgICAgICBgJHtnZXRGcmllbmRseVVSTChyZXF1ZXN0LnVybCl9IGluICR7dGhpcy5jYWNoZU5hbWV9IHdhcyBub3QgYCArXG4gICAgICAgICAgICAgICAgICAgIGBmb3VuZC4gRmFsbGluZyBiYWNrIHRvIHRoZSBuZXR3b3JrLmApO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgY29uc3QgaW50ZWdyaXR5SW5NYW5pZmVzdCA9IHBhcmFtcy5pbnRlZ3JpdHk7XG4gICAgICAgICAgICBjb25zdCBpbnRlZ3JpdHlJblJlcXVlc3QgPSByZXF1ZXN0LmludGVncml0eTtcbiAgICAgICAgICAgIGNvbnN0IG5vSW50ZWdyaXR5Q29uZmxpY3QgPSAhaW50ZWdyaXR5SW5SZXF1ZXN0IHx8IGludGVncml0eUluUmVxdWVzdCA9PT0gaW50ZWdyaXR5SW5NYW5pZmVzdDtcbiAgICAgICAgICAgIC8vIERvIG5vdCBhZGQgaW50ZWdyaXR5IGlmIHRoZSBvcmlnaW5hbCByZXF1ZXN0IGlzIG5vLWNvcnNcbiAgICAgICAgICAgIC8vIFNlZSBodHRwczovL2dpdGh1Yi5jb20vR29vZ2xlQ2hyb21lL3dvcmtib3gvaXNzdWVzLzMwOTZcbiAgICAgICAgICAgIHJlc3BvbnNlID0gYXdhaXQgaGFuZGxlci5mZXRjaChuZXcgUmVxdWVzdChyZXF1ZXN0LCB7XG4gICAgICAgICAgICAgICAgaW50ZWdyaXR5OiByZXF1ZXN0Lm1vZGUgIT09ICduby1jb3JzJ1xuICAgICAgICAgICAgICAgICAgICA/IGludGVncml0eUluUmVxdWVzdCB8fCBpbnRlZ3JpdHlJbk1hbmlmZXN0XG4gICAgICAgICAgICAgICAgICAgIDogdW5kZWZpbmVkLFxuICAgICAgICAgICAgfSkpO1xuICAgICAgICAgICAgLy8gSXQncyBvbmx5IFwic2FmZVwiIHRvIHJlcGFpciB0aGUgY2FjaGUgaWYgd2UncmUgdXNpbmcgU1JJIHRvIGd1YXJhbnRlZVxuICAgICAgICAgICAgLy8gdGhhdCB0aGUgcmVzcG9uc2UgbWF0Y2hlcyB0aGUgcHJlY2FjaGUgbWFuaWZlc3QncyBleHBlY3RhdGlvbnMsXG4gICAgICAgICAgICAvLyBhbmQgdGhlcmUncyBlaXRoZXIgYSkgbm8gaW50ZWdyaXR5IHByb3BlcnR5IGluIHRoZSBpbmNvbWluZyByZXF1ZXN0XG4gICAgICAgICAgICAvLyBvciBiKSB0aGVyZSBpcyBhbiBpbnRlZ3JpdHksIGFuZCBpdCBtYXRjaGVzIHRoZSBwcmVjYWNoZSBtYW5pZmVzdC5cbiAgICAgICAgICAgIC8vIFNlZSBodHRwczovL2dpdGh1Yi5jb20vR29vZ2xlQ2hyb21lL3dvcmtib3gvaXNzdWVzLzI4NThcbiAgICAgICAgICAgIC8vIEFsc28gaWYgdGhlIG9yaWdpbmFsIHJlcXVlc3QgdXNlcnMgbm8tY29ycyB3ZSBkb24ndCB1c2UgaW50ZWdyaXR5LlxuICAgICAgICAgICAgLy8gU2VlIGh0dHBzOi8vZ2l0aHViLmNvbS9Hb29nbGVDaHJvbWUvd29ya2JveC9pc3N1ZXMvMzA5NlxuICAgICAgICAgICAgaWYgKGludGVncml0eUluTWFuaWZlc3QgJiZcbiAgICAgICAgICAgICAgICBub0ludGVncml0eUNvbmZsaWN0ICYmXG4gICAgICAgICAgICAgICAgcmVxdWVzdC5tb2RlICE9PSAnbm8tY29ycycpIHtcbiAgICAgICAgICAgICAgICB0aGlzLl91c2VEZWZhdWx0Q2FjaGVhYmlsaXR5UGx1Z2luSWZOZWVkZWQoKTtcbiAgICAgICAgICAgICAgICBjb25zdCB3YXNDYWNoZWQgPSBhd2FpdCBoYW5kbGVyLmNhY2hlUHV0KHJlcXVlc3QsIHJlc3BvbnNlLmNsb25lKCkpO1xuICAgICAgICAgICAgICAgIGlmIChwcm9jZXNzLmVudi5OT0RFX0VOViAhPT0gJ3Byb2R1Y3Rpb24nKSB7XG4gICAgICAgICAgICAgICAgICAgIGlmICh3YXNDYWNoZWQpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGxvZ2dlci5sb2coYEEgcmVzcG9uc2UgZm9yICR7Z2V0RnJpZW5kbHlVUkwocmVxdWVzdC51cmwpfSBgICtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBgd2FzIHVzZWQgdG8gXCJyZXBhaXJcIiB0aGUgcHJlY2FjaGUuYCk7XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgICAgZWxzZSB7XG4gICAgICAgICAgICAvLyBUaGlzIHNob3VsZG4ndCBub3JtYWxseSBoYXBwZW4sIGJ1dCB0aGVyZSBhcmUgZWRnZSBjYXNlczpcbiAgICAgICAgICAgIC8vIGh0dHBzOi8vZ2l0aHViLmNvbS9Hb29nbGVDaHJvbWUvd29ya2JveC9pc3N1ZXMvMTQ0MVxuICAgICAgICAgICAgdGhyb3cgbmV3IFdvcmtib3hFcnJvcignbWlzc2luZy1wcmVjYWNoZS1lbnRyeScsIHtcbiAgICAgICAgICAgICAgICBjYWNoZU5hbWU6IHRoaXMuY2FjaGVOYW1lLFxuICAgICAgICAgICAgICAgIHVybDogcmVxdWVzdC51cmwsXG4gICAgICAgICAgICB9KTtcbiAgICAgICAgfVxuICAgICAgICBpZiAocHJvY2Vzcy5lbnYuTk9ERV9FTlYgIT09ICdwcm9kdWN0aW9uJykge1xuICAgICAgICAgICAgY29uc3QgY2FjaGVLZXkgPSBwYXJhbXMuY2FjaGVLZXkgfHwgKGF3YWl0IGhhbmRsZXIuZ2V0Q2FjaGVLZXkocmVxdWVzdCwgJ3JlYWQnKSk7XG4gICAgICAgICAgICAvLyBXb3JrYm94IGlzIGdvaW5nIHRvIGhhbmRsZSB0aGUgcm91dGUuXG4gICAgICAgICAgICAvLyBwcmludCB0aGUgcm91dGluZyBkZXRhaWxzIHRvIHRoZSBjb25zb2xlLlxuICAgICAgICAgICAgbG9nZ2VyLmdyb3VwQ29sbGFwc2VkKGBQcmVjYWNoaW5nIGlzIHJlc3BvbmRpbmcgdG86IGAgKyBnZXRGcmllbmRseVVSTChyZXF1ZXN0LnVybCkpO1xuICAgICAgICAgICAgbG9nZ2VyLmxvZyhgU2VydmluZyB0aGUgcHJlY2FjaGVkIHVybDogJHtnZXRGcmllbmRseVVSTChjYWNoZUtleSBpbnN0YW5jZW9mIFJlcXVlc3QgPyBjYWNoZUtleS51cmwgOiBjYWNoZUtleSl9YCk7XG4gICAgICAgICAgICBsb2dnZXIuZ3JvdXBDb2xsYXBzZWQoYFZpZXcgcmVxdWVzdCBkZXRhaWxzIGhlcmUuYCk7XG4gICAgICAgICAgICBsb2dnZXIubG9nKHJlcXVlc3QpO1xuICAgICAgICAgICAgbG9nZ2VyLmdyb3VwRW5kKCk7XG4gICAgICAgICAgICBsb2dnZXIuZ3JvdXBDb2xsYXBzZWQoYFZpZXcgcmVzcG9uc2UgZGV0YWlscyBoZXJlLmApO1xuICAgICAgICAgICAgbG9nZ2VyLmxvZyhyZXNwb25zZSk7XG4gICAgICAgICAgICBsb2dnZXIuZ3JvdXBFbmQoKTtcbiAgICAgICAgICAgIGxvZ2dlci5ncm91cEVuZCgpO1xuICAgICAgICB9XG4gICAgICAgIHJldHVybiByZXNwb25zZTtcbiAgICB9XG4gICAgYXN5bmMgX2hhbmRsZUluc3RhbGwocmVxdWVzdCwgaGFuZGxlcikge1xuICAgICAgICB0aGlzLl91c2VEZWZhdWx0Q2FjaGVhYmlsaXR5UGx1Z2luSWZOZWVkZWQoKTtcbiAgICAgICAgY29uc3QgcmVzcG9uc2UgPSBhd2FpdCBoYW5kbGVyLmZldGNoKHJlcXVlc3QpO1xuICAgICAgICAvLyBNYWtlIHN1cmUgd2UgZGVmZXIgY2FjaGVQdXQoKSB1bnRpbCBhZnRlciB3ZSBrbm93IHRoZSByZXNwb25zZVxuICAgICAgICAvLyBzaG91bGQgYmUgY2FjaGVkOyBzZWUgaHR0cHM6Ly9naXRodWIuY29tL0dvb2dsZUNocm9tZS93b3JrYm94L2lzc3Vlcy8yNzM3XG4gICAgICAgIGNvbnN0IHdhc0NhY2hlZCA9IGF3YWl0IGhhbmRsZXIuY2FjaGVQdXQocmVxdWVzdCwgcmVzcG9uc2UuY2xvbmUoKSk7XG4gICAgICAgIGlmICghd2FzQ2FjaGVkKSB7XG4gICAgICAgICAgICAvLyBUaHJvd2luZyBoZXJlIHdpbGwgbGVhZCB0byB0aGUgYGluc3RhbGxgIGhhbmRsZXIgZmFpbGluZywgd2hpY2hcbiAgICAgICAgICAgIC8vIHdlIHdhbnQgdG8gZG8gaWYgKmFueSogb2YgdGhlIHJlc3BvbnNlcyBhcmVuJ3Qgc2FmZSB0byBjYWNoZS5cbiAgICAgICAgICAgIHRocm93IG5ldyBXb3JrYm94RXJyb3IoJ2JhZC1wcmVjYWNoaW5nLXJlc3BvbnNlJywge1xuICAgICAgICAgICAgICAgIHVybDogcmVxdWVzdC51cmwsXG4gICAgICAgICAgICAgICAgc3RhdHVzOiByZXNwb25zZS5zdGF0dXMsXG4gICAgICAgICAgICB9KTtcbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gcmVzcG9uc2U7XG4gICAgfVxuICAgIC8qKlxuICAgICAqIFRoaXMgbWV0aG9kIGlzIGNvbXBsZXgsIGFzIHRoZXJlIGEgbnVtYmVyIG9mIHRoaW5ncyB0byBhY2NvdW50IGZvcjpcbiAgICAgKlxuICAgICAqIFRoZSBgcGx1Z2luc2AgYXJyYXkgY2FuIGJlIHNldCBhdCBjb25zdHJ1Y3Rpb24sIGFuZC9vciBpdCBtaWdodCBiZSBhZGRlZCB0b1xuICAgICAqIHRvIGF0IGFueSB0aW1lIGJlZm9yZSB0aGUgc3RyYXRlZ3kgaXMgdXNlZC5cbiAgICAgKlxuICAgICAqIEF0IHRoZSB0aW1lIHRoZSBzdHJhdGVneSBpcyB1c2VkIChpLmUuIGR1cmluZyBhbiBgaW5zdGFsbGAgZXZlbnQpLCB0aGVyZVxuICAgICAqIG5lZWRzIHRvIGJlIGF0IGxlYXN0IG9uZSBwbHVnaW4gdGhhdCBpbXBsZW1lbnRzIGBjYWNoZVdpbGxVcGRhdGVgIGluIHRoZVxuICAgICAqIGFycmF5LCBvdGhlciB0aGFuIGBjb3B5UmVkaXJlY3RlZENhY2hlYWJsZVJlc3BvbnNlc1BsdWdpbmAuXG4gICAgICpcbiAgICAgKiAtIElmIHRoaXMgbWV0aG9kIGlzIGNhbGxlZCBhbmQgdGhlcmUgYXJlIG5vIHN1aXRhYmxlIGBjYWNoZVdpbGxVcGRhdGVgXG4gICAgICogcGx1Z2lucywgd2UgbmVlZCB0byBhZGQgYGRlZmF1bHRQcmVjYWNoZUNhY2hlYWJpbGl0eVBsdWdpbmAuXG4gICAgICpcbiAgICAgKiAtIElmIHRoaXMgbWV0aG9kIGlzIGNhbGxlZCBhbmQgdGhlcmUgaXMgZXhhY3RseSBvbmUgYGNhY2hlV2lsbFVwZGF0ZWAsIHRoZW5cbiAgICAgKiB3ZSBkb24ndCBoYXZlIHRvIGRvIGFueXRoaW5nICh0aGlzIG1pZ2h0IGJlIGEgcHJldmlvdXNseSBhZGRlZFxuICAgICAqIGBkZWZhdWx0UHJlY2FjaGVDYWNoZWFiaWxpdHlQbHVnaW5gLCBvciBpdCBtaWdodCBiZSBhIGN1c3RvbSBwbHVnaW4pLlxuICAgICAqXG4gICAgICogLSBJZiB0aGlzIG1ldGhvZCBpcyBjYWxsZWQgYW5kIHRoZXJlIGlzIG1vcmUgdGhhbiBvbmUgYGNhY2hlV2lsbFVwZGF0ZWAsXG4gICAgICogdGhlbiB3ZSBuZWVkIHRvIGNoZWNrIGlmIG9uZSBpcyBgZGVmYXVsdFByZWNhY2hlQ2FjaGVhYmlsaXR5UGx1Z2luYC4gSWYgc28sXG4gICAgICogd2UgbmVlZCB0byByZW1vdmUgaXQuIChUaGlzIHNpdHVhdGlvbiBpcyB1bmxpa2VseSwgYnV0IGl0IGNvdWxkIGhhcHBlbiBpZlxuICAgICAqIHRoZSBzdHJhdGVneSBpcyB1c2VkIG11bHRpcGxlIHRpbWVzLCB0aGUgZmlyc3Qgd2l0aG91dCBhIGBjYWNoZVdpbGxVcGRhdGVgLFxuICAgICAqIGFuZCB0aGVuIGxhdGVyIG9uIGFmdGVyIG1hbnVhbGx5IGFkZGluZyBhIGN1c3RvbSBgY2FjaGVXaWxsVXBkYXRlYC4pXG4gICAgICpcbiAgICAgKiBTZWUgaHR0cHM6Ly9naXRodWIuY29tL0dvb2dsZUNocm9tZS93b3JrYm94L2lzc3Vlcy8yNzM3IGZvciBtb3JlIGNvbnRleHQuXG4gICAgICpcbiAgICAgKiBAcHJpdmF0ZVxuICAgICAqL1xuICAgIF91c2VEZWZhdWx0Q2FjaGVhYmlsaXR5UGx1Z2luSWZOZWVkZWQoKSB7XG4gICAgICAgIGxldCBkZWZhdWx0UGx1Z2luSW5kZXggPSBudWxsO1xuICAgICAgICBsZXQgY2FjaGVXaWxsVXBkYXRlUGx1Z2luQ291bnQgPSAwO1xuICAgICAgICBmb3IgKGNvbnN0IFtpbmRleCwgcGx1Z2luXSBvZiB0aGlzLnBsdWdpbnMuZW50cmllcygpKSB7XG4gICAgICAgICAgICAvLyBJZ25vcmUgdGhlIGNvcHkgcmVkaXJlY3RlZCBwbHVnaW4gd2hlbiBkZXRlcm1pbmluZyB3aGF0IHRvIGRvLlxuICAgICAgICAgICAgaWYgKHBsdWdpbiA9PT0gUHJlY2FjaGVTdHJhdGVneS5jb3B5UmVkaXJlY3RlZENhY2hlYWJsZVJlc3BvbnNlc1BsdWdpbikge1xuICAgICAgICAgICAgICAgIGNvbnRpbnVlO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgLy8gU2F2ZSB0aGUgZGVmYXVsdCBwbHVnaW4ncyBpbmRleCwgaW4gY2FzZSBpdCBuZWVkcyB0byBiZSByZW1vdmVkLlxuICAgICAgICAgICAgaWYgKHBsdWdpbiA9PT0gUHJlY2FjaGVTdHJhdGVneS5kZWZhdWx0UHJlY2FjaGVDYWNoZWFiaWxpdHlQbHVnaW4pIHtcbiAgICAgICAgICAgICAgICBkZWZhdWx0UGx1Z2luSW5kZXggPSBpbmRleDtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGlmIChwbHVnaW4uY2FjaGVXaWxsVXBkYXRlKSB7XG4gICAgICAgICAgICAgICAgY2FjaGVXaWxsVXBkYXRlUGx1Z2luQ291bnQrKztcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgICBpZiAoY2FjaGVXaWxsVXBkYXRlUGx1Z2luQ291bnQgPT09IDApIHtcbiAgICAgICAgICAgIHRoaXMucGx1Z2lucy5wdXNoKFByZWNhY2hlU3RyYXRlZ3kuZGVmYXVsdFByZWNhY2hlQ2FjaGVhYmlsaXR5UGx1Z2luKTtcbiAgICAgICAgfVxuICAgICAgICBlbHNlIGlmIChjYWNoZVdpbGxVcGRhdGVQbHVnaW5Db3VudCA+IDEgJiYgZGVmYXVsdFBsdWdpbkluZGV4ICE9PSBudWxsKSB7XG4gICAgICAgICAgICAvLyBPbmx5IHJlbW92ZSB0aGUgZGVmYXVsdCBwbHVnaW47IG11bHRpcGxlIGN1c3RvbSBwbHVnaW5zIGFyZSBhbGxvd2VkLlxuICAgICAgICAgICAgdGhpcy5wbHVnaW5zLnNwbGljZShkZWZhdWx0UGx1Z2luSW5kZXgsIDEpO1xuICAgICAgICB9XG4gICAgICAgIC8vIE5vdGhpbmcgbmVlZHMgdG8gYmUgZG9uZSBpZiBjYWNoZVdpbGxVcGRhdGVQbHVnaW5Db3VudCBpcyAxXG4gICAgfVxufVxuUHJlY2FjaGVTdHJhdGVneS5kZWZhdWx0UHJlY2FjaGVDYWNoZWFiaWxpdHlQbHVnaW4gPSB7XG4gICAgYXN5bmMgY2FjaGVXaWxsVXBkYXRlKHsgcmVzcG9uc2UgfSkge1xuICAgICAgICBpZiAoIXJlc3BvbnNlIHx8IHJlc3BvbnNlLnN0YXR1cyA+PSA0MDApIHtcbiAgICAgICAgICAgIHJldHVybiBudWxsO1xuICAgICAgICB9XG4gICAgICAgIHJldHVybiByZXNwb25zZTtcbiAgICB9LFxufTtcblByZWNhY2hlU3RyYXRlZ3kuY29weVJlZGlyZWN0ZWRDYWNoZWFibGVSZXNwb25zZXNQbHVnaW4gPSB7XG4gICAgYXN5bmMgY2FjaGVXaWxsVXBkYXRlKHsgcmVzcG9uc2UgfSkge1xuICAgICAgICByZXR1cm4gcmVzcG9uc2UucmVkaXJlY3RlZCA/IGF3YWl0IGNvcHlSZXNwb25zZShyZXNwb25zZSkgOiByZXNwb25zZTtcbiAgICB9LFxufTtcbmV4cG9ydCB7IFByZWNhY2hlU3RyYXRlZ3kgfTtcbiIsICIvKlxuICBDb3B5cmlnaHQgMjAxOSBHb29nbGUgTExDXG5cbiAgVXNlIG9mIHRoaXMgc291cmNlIGNvZGUgaXMgZ292ZXJuZWQgYnkgYW4gTUlULXN0eWxlXG4gIGxpY2Vuc2UgdGhhdCBjYW4gYmUgZm91bmQgaW4gdGhlIExJQ0VOU0UgZmlsZSBvciBhdFxuICBodHRwczovL29wZW5zb3VyY2Uub3JnL2xpY2Vuc2VzL01JVC5cbiovXG5pbXBvcnQgeyBhc3NlcnQgfSBmcm9tICd3b3JrYm94LWNvcmUvX3ByaXZhdGUvYXNzZXJ0LmpzJztcbmltcG9ydCB7IGNhY2hlTmFtZXMgfSBmcm9tICd3b3JrYm94LWNvcmUvX3ByaXZhdGUvY2FjaGVOYW1lcy5qcyc7XG5pbXBvcnQgeyBsb2dnZXIgfSBmcm9tICd3b3JrYm94LWNvcmUvX3ByaXZhdGUvbG9nZ2VyLmpzJztcbmltcG9ydCB7IFdvcmtib3hFcnJvciB9IGZyb20gJ3dvcmtib3gtY29yZS9fcHJpdmF0ZS9Xb3JrYm94RXJyb3IuanMnO1xuaW1wb3J0IHsgd2FpdFVudGlsIH0gZnJvbSAnd29ya2JveC1jb3JlL19wcml2YXRlL3dhaXRVbnRpbC5qcyc7XG5pbXBvcnQgeyBjcmVhdGVDYWNoZUtleSB9IGZyb20gJy4vdXRpbHMvY3JlYXRlQ2FjaGVLZXkuanMnO1xuaW1wb3J0IHsgUHJlY2FjaGVJbnN0YWxsUmVwb3J0UGx1Z2luIH0gZnJvbSAnLi91dGlscy9QcmVjYWNoZUluc3RhbGxSZXBvcnRQbHVnaW4uanMnO1xuaW1wb3J0IHsgUHJlY2FjaGVDYWNoZUtleVBsdWdpbiB9IGZyb20gJy4vdXRpbHMvUHJlY2FjaGVDYWNoZUtleVBsdWdpbi5qcyc7XG5pbXBvcnQgeyBwcmludENsZWFudXBEZXRhaWxzIH0gZnJvbSAnLi91dGlscy9wcmludENsZWFudXBEZXRhaWxzLmpzJztcbmltcG9ydCB7IHByaW50SW5zdGFsbERldGFpbHMgfSBmcm9tICcuL3V0aWxzL3ByaW50SW5zdGFsbERldGFpbHMuanMnO1xuaW1wb3J0IHsgUHJlY2FjaGVTdHJhdGVneSB9IGZyb20gJy4vUHJlY2FjaGVTdHJhdGVneS5qcyc7XG5pbXBvcnQgJy4vX3ZlcnNpb24uanMnO1xuLyoqXG4gKiBQZXJmb3JtcyBlZmZpY2llbnQgcHJlY2FjaGluZyBvZiBhc3NldHMuXG4gKlxuICogQG1lbWJlcm9mIHdvcmtib3gtcHJlY2FjaGluZ1xuICovXG5jbGFzcyBQcmVjYWNoZUNvbnRyb2xsZXIge1xuICAgIC8qKlxuICAgICAqIENyZWF0ZSBhIG5ldyBQcmVjYWNoZUNvbnRyb2xsZXIuXG4gICAgICpcbiAgICAgKiBAcGFyYW0ge09iamVjdH0gW29wdGlvbnNdXG4gICAgICogQHBhcmFtIHtzdHJpbmd9IFtvcHRpb25zLmNhY2hlTmFtZV0gVGhlIGNhY2hlIHRvIHVzZSBmb3IgcHJlY2FjaGluZy5cbiAgICAgKiBAcGFyYW0ge3N0cmluZ30gW29wdGlvbnMucGx1Z2luc10gUGx1Z2lucyB0byB1c2Ugd2hlbiBwcmVjYWNoaW5nIGFzIHdlbGxcbiAgICAgKiBhcyByZXNwb25kaW5nIHRvIGZldGNoIGV2ZW50cyBmb3IgcHJlY2FjaGVkIGFzc2V0cy5cbiAgICAgKiBAcGFyYW0ge2Jvb2xlYW59IFtvcHRpb25zLmZhbGxiYWNrVG9OZXR3b3JrPXRydWVdIFdoZXRoZXIgdG8gYXR0ZW1wdCB0b1xuICAgICAqIGdldCB0aGUgcmVzcG9uc2UgZnJvbSB0aGUgbmV0d29yayBpZiB0aGVyZSdzIGEgcHJlY2FjaGUgbWlzcy5cbiAgICAgKi9cbiAgICBjb25zdHJ1Y3Rvcih7IGNhY2hlTmFtZSwgcGx1Z2lucyA9IFtdLCBmYWxsYmFja1RvTmV0d29yayA9IHRydWUsIH0gPSB7fSkge1xuICAgICAgICB0aGlzLl91cmxzVG9DYWNoZUtleXMgPSBuZXcgTWFwKCk7XG4gICAgICAgIHRoaXMuX3VybHNUb0NhY2hlTW9kZXMgPSBuZXcgTWFwKCk7XG4gICAgICAgIHRoaXMuX2NhY2hlS2V5c1RvSW50ZWdyaXRpZXMgPSBuZXcgTWFwKCk7XG4gICAgICAgIHRoaXMuX3N0cmF0ZWd5ID0gbmV3IFByZWNhY2hlU3RyYXRlZ3koe1xuICAgICAgICAgICAgY2FjaGVOYW1lOiBjYWNoZU5hbWVzLmdldFByZWNhY2hlTmFtZShjYWNoZU5hbWUpLFxuICAgICAgICAgICAgcGx1Z2luczogW1xuICAgICAgICAgICAgICAgIC4uLnBsdWdpbnMsXG4gICAgICAgICAgICAgICAgbmV3IFByZWNhY2hlQ2FjaGVLZXlQbHVnaW4oeyBwcmVjYWNoZUNvbnRyb2xsZXI6IHRoaXMgfSksXG4gICAgICAgICAgICBdLFxuICAgICAgICAgICAgZmFsbGJhY2tUb05ldHdvcmssXG4gICAgICAgIH0pO1xuICAgICAgICAvLyBCaW5kIHRoZSBpbnN0YWxsIGFuZCBhY3RpdmF0ZSBtZXRob2RzIHRvIHRoZSBpbnN0YW5jZS5cbiAgICAgICAgdGhpcy5pbnN0YWxsID0gdGhpcy5pbnN0YWxsLmJpbmQodGhpcyk7XG4gICAgICAgIHRoaXMuYWN0aXZhdGUgPSB0aGlzLmFjdGl2YXRlLmJpbmQodGhpcyk7XG4gICAgfVxuICAgIC8qKlxuICAgICAqIEB0eXBlIHt3b3JrYm94LXByZWNhY2hpbmcuUHJlY2FjaGVTdHJhdGVneX0gVGhlIHN0cmF0ZWd5IGNyZWF0ZWQgYnkgdGhpcyBjb250cm9sbGVyIGFuZFxuICAgICAqIHVzZWQgdG8gY2FjaGUgYXNzZXRzIGFuZCByZXNwb25kIHRvIGZldGNoIGV2ZW50cy5cbiAgICAgKi9cbiAgICBnZXQgc3RyYXRlZ3koKSB7XG4gICAgICAgIHJldHVybiB0aGlzLl9zdHJhdGVneTtcbiAgICB9XG4gICAgLyoqXG4gICAgICogQWRkcyBpdGVtcyB0byB0aGUgcHJlY2FjaGUgbGlzdCwgcmVtb3ZpbmcgYW55IGR1cGxpY2F0ZXMgYW5kXG4gICAgICogc3RvcmVzIHRoZSBmaWxlcyBpbiB0aGVcbiAgICAgKiB7QGxpbmsgd29ya2JveC1jb3JlLmNhY2hlTmFtZXN8XCJwcmVjYWNoZSBjYWNoZVwifSB3aGVuIHRoZSBzZXJ2aWNlXG4gICAgICogd29ya2VyIGluc3RhbGxzLlxuICAgICAqXG4gICAgICogVGhpcyBtZXRob2QgY2FuIGJlIGNhbGxlZCBtdWx0aXBsZSB0aW1lcy5cbiAgICAgKlxuICAgICAqIEBwYXJhbSB7QXJyYXk8T2JqZWN0fHN0cmluZz59IFtlbnRyaWVzPVtdXSBBcnJheSBvZiBlbnRyaWVzIHRvIHByZWNhY2hlLlxuICAgICAqL1xuICAgIHByZWNhY2hlKGVudHJpZXMpIHtcbiAgICAgICAgdGhpcy5hZGRUb0NhY2hlTGlzdChlbnRyaWVzKTtcbiAgICAgICAgaWYgKCF0aGlzLl9pbnN0YWxsQW5kQWN0aXZlTGlzdGVuZXJzQWRkZWQpIHtcbiAgICAgICAgICAgIHNlbGYuYWRkRXZlbnRMaXN0ZW5lcignaW5zdGFsbCcsIHRoaXMuaW5zdGFsbCk7XG4gICAgICAgICAgICBzZWxmLmFkZEV2ZW50TGlzdGVuZXIoJ2FjdGl2YXRlJywgdGhpcy5hY3RpdmF0ZSk7XG4gICAgICAgICAgICB0aGlzLl9pbnN0YWxsQW5kQWN0aXZlTGlzdGVuZXJzQWRkZWQgPSB0cnVlO1xuICAgICAgICB9XG4gICAgfVxuICAgIC8qKlxuICAgICAqIFRoaXMgbWV0aG9kIHdpbGwgYWRkIGl0ZW1zIHRvIHRoZSBwcmVjYWNoZSBsaXN0LCByZW1vdmluZyBkdXBsaWNhdGVzXG4gICAgICogYW5kIGVuc3VyaW5nIHRoZSBpbmZvcm1hdGlvbiBpcyB2YWxpZC5cbiAgICAgKlxuICAgICAqIEBwYXJhbSB7QXJyYXk8d29ya2JveC1wcmVjYWNoaW5nLlByZWNhY2hlQ29udHJvbGxlci5QcmVjYWNoZUVudHJ5fHN0cmluZz59IGVudHJpZXNcbiAgICAgKiAgICAgQXJyYXkgb2YgZW50cmllcyB0byBwcmVjYWNoZS5cbiAgICAgKi9cbiAgICBhZGRUb0NhY2hlTGlzdChlbnRyaWVzKSB7XG4gICAgICAgIGlmIChwcm9jZXNzLmVudi5OT0RFX0VOViAhPT0gJ3Byb2R1Y3Rpb24nKSB7XG4gICAgICAgICAgICBhc3NlcnQuaXNBcnJheShlbnRyaWVzLCB7XG4gICAgICAgICAgICAgICAgbW9kdWxlTmFtZTogJ3dvcmtib3gtcHJlY2FjaGluZycsXG4gICAgICAgICAgICAgICAgY2xhc3NOYW1lOiAnUHJlY2FjaGVDb250cm9sbGVyJyxcbiAgICAgICAgICAgICAgICBmdW5jTmFtZTogJ2FkZFRvQ2FjaGVMaXN0JyxcbiAgICAgICAgICAgICAgICBwYXJhbU5hbWU6ICdlbnRyaWVzJyxcbiAgICAgICAgICAgIH0pO1xuICAgICAgICB9XG4gICAgICAgIGNvbnN0IHVybHNUb1dhcm5BYm91dCA9IFtdO1xuICAgICAgICBmb3IgKGNvbnN0IGVudHJ5IG9mIGVudHJpZXMpIHtcbiAgICAgICAgICAgIC8vIFNlZSBodHRwczovL2dpdGh1Yi5jb20vR29vZ2xlQ2hyb21lL3dvcmtib3gvaXNzdWVzLzIyNTlcbiAgICAgICAgICAgIGlmICh0eXBlb2YgZW50cnkgPT09ICdzdHJpbmcnKSB7XG4gICAgICAgICAgICAgICAgdXJsc1RvV2FybkFib3V0LnB1c2goZW50cnkpO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgZWxzZSBpZiAoZW50cnkgJiYgZW50cnkucmV2aXNpb24gPT09IHVuZGVmaW5lZCkge1xuICAgICAgICAgICAgICAgIHVybHNUb1dhcm5BYm91dC5wdXNoKGVudHJ5LnVybCk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBjb25zdCB7IGNhY2hlS2V5LCB1cmwgfSA9IGNyZWF0ZUNhY2hlS2V5KGVudHJ5KTtcbiAgICAgICAgICAgIGNvbnN0IGNhY2hlTW9kZSA9IHR5cGVvZiBlbnRyeSAhPT0gJ3N0cmluZycgJiYgZW50cnkucmV2aXNpb24gPyAncmVsb2FkJyA6ICdkZWZhdWx0JztcbiAgICAgICAgICAgIGlmICh0aGlzLl91cmxzVG9DYWNoZUtleXMuaGFzKHVybCkgJiZcbiAgICAgICAgICAgICAgICB0aGlzLl91cmxzVG9DYWNoZUtleXMuZ2V0KHVybCkgIT09IGNhY2hlS2V5KSB7XG4gICAgICAgICAgICAgICAgdGhyb3cgbmV3IFdvcmtib3hFcnJvcignYWRkLXRvLWNhY2hlLWxpc3QtY29uZmxpY3RpbmctZW50cmllcycsIHtcbiAgICAgICAgICAgICAgICAgICAgZmlyc3RFbnRyeTogdGhpcy5fdXJsc1RvQ2FjaGVLZXlzLmdldCh1cmwpLFxuICAgICAgICAgICAgICAgICAgICBzZWNvbmRFbnRyeTogY2FjaGVLZXksXG4gICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBpZiAodHlwZW9mIGVudHJ5ICE9PSAnc3RyaW5nJyAmJiBlbnRyeS5pbnRlZ3JpdHkpIHtcbiAgICAgICAgICAgICAgICBpZiAodGhpcy5fY2FjaGVLZXlzVG9JbnRlZ3JpdGllcy5oYXMoY2FjaGVLZXkpICYmXG4gICAgICAgICAgICAgICAgICAgIHRoaXMuX2NhY2hlS2V5c1RvSW50ZWdyaXRpZXMuZ2V0KGNhY2hlS2V5KSAhPT0gZW50cnkuaW50ZWdyaXR5KSB7XG4gICAgICAgICAgICAgICAgICAgIHRocm93IG5ldyBXb3JrYm94RXJyb3IoJ2FkZC10by1jYWNoZS1saXN0LWNvbmZsaWN0aW5nLWludGVncml0aWVzJywge1xuICAgICAgICAgICAgICAgICAgICAgICAgdXJsLFxuICAgICAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgdGhpcy5fY2FjaGVLZXlzVG9JbnRlZ3JpdGllcy5zZXQoY2FjaGVLZXksIGVudHJ5LmludGVncml0eSk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICB0aGlzLl91cmxzVG9DYWNoZUtleXMuc2V0KHVybCwgY2FjaGVLZXkpO1xuICAgICAgICAgICAgdGhpcy5fdXJsc1RvQ2FjaGVNb2Rlcy5zZXQodXJsLCBjYWNoZU1vZGUpO1xuICAgICAgICAgICAgaWYgKHVybHNUb1dhcm5BYm91dC5sZW5ndGggPiAwKSB7XG4gICAgICAgICAgICAgICAgY29uc3Qgd2FybmluZ01lc3NhZ2UgPSBgV29ya2JveCBpcyBwcmVjYWNoaW5nIFVSTHMgd2l0aG91dCByZXZpc2lvbiBgICtcbiAgICAgICAgICAgICAgICAgICAgYGluZm86ICR7dXJsc1RvV2FybkFib3V0LmpvaW4oJywgJyl9XFxuVGhpcyBpcyBnZW5lcmFsbHkgTk9UIHNhZmUuIGAgK1xuICAgICAgICAgICAgICAgICAgICBgTGVhcm4gbW9yZSBhdCBodHRwczovL2JpdC5seS93Yi1wcmVjYWNoZWA7XG4gICAgICAgICAgICAgICAgaWYgKHByb2Nlc3MuZW52Lk5PREVfRU5WID09PSAncHJvZHVjdGlvbicpIHtcbiAgICAgICAgICAgICAgICAgICAgLy8gVXNlIGNvbnNvbGUgZGlyZWN0bHkgdG8gZGlzcGxheSB0aGlzIHdhcm5pbmcgd2l0aG91dCBibG9hdGluZ1xuICAgICAgICAgICAgICAgICAgICAvLyBidW5kbGUgc2l6ZXMgYnkgcHVsbGluZyBpbiBhbGwgb2YgdGhlIGxvZ2dlciBjb2RlYmFzZSBpbiBwcm9kLlxuICAgICAgICAgICAgICAgICAgICBjb25zb2xlLndhcm4od2FybmluZ01lc3NhZ2UpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgbG9nZ2VyLndhcm4od2FybmluZ01lc3NhZ2UpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgIH1cbiAgICAvKipcbiAgICAgKiBQcmVjYWNoZXMgbmV3IGFuZCB1cGRhdGVkIGFzc2V0cy4gQ2FsbCB0aGlzIG1ldGhvZCBmcm9tIHRoZSBzZXJ2aWNlIHdvcmtlclxuICAgICAqIGluc3RhbGwgZXZlbnQuXG4gICAgICpcbiAgICAgKiBOb3RlOiB0aGlzIG1ldGhvZCBjYWxscyBgZXZlbnQud2FpdFVudGlsKClgIGZvciB5b3UsIHNvIHlvdSBkbyBub3QgbmVlZFxuICAgICAqIHRvIGNhbGwgaXQgeW91cnNlbGYgaW4geW91ciBldmVudCBoYW5kbGVycy5cbiAgICAgKlxuICAgICAqIEBwYXJhbSB7RXh0ZW5kYWJsZUV2ZW50fSBldmVudFxuICAgICAqIEByZXR1cm4ge1Byb21pc2U8d29ya2JveC1wcmVjYWNoaW5nLkluc3RhbGxSZXN1bHQ+fVxuICAgICAqL1xuICAgIGluc3RhbGwoZXZlbnQpIHtcbiAgICAgICAgLy8gd2FpdFVudGlsIHJldHVybnMgUHJvbWlzZTxhbnk+XG4gICAgICAgIC8vIGVzbGludC1kaXNhYmxlLW5leHQtbGluZSBAdHlwZXNjcmlwdC1lc2xpbnQvbm8tdW5zYWZlLXJldHVyblxuICAgICAgICByZXR1cm4gd2FpdFVudGlsKGV2ZW50LCBhc3luYyAoKSA9PiB7XG4gICAgICAgICAgICBjb25zdCBpbnN0YWxsUmVwb3J0UGx1Z2luID0gbmV3IFByZWNhY2hlSW5zdGFsbFJlcG9ydFBsdWdpbigpO1xuICAgICAgICAgICAgdGhpcy5zdHJhdGVneS5wbHVnaW5zLnB1c2goaW5zdGFsbFJlcG9ydFBsdWdpbik7XG4gICAgICAgICAgICAvLyBDYWNoZSBlbnRyaWVzIG9uZSBhdCBhIHRpbWUuXG4gICAgICAgICAgICAvLyBTZWUgaHR0cHM6Ly9naXRodWIuY29tL0dvb2dsZUNocm9tZS93b3JrYm94L2lzc3Vlcy8yNTI4XG4gICAgICAgICAgICBmb3IgKGNvbnN0IFt1cmwsIGNhY2hlS2V5XSBvZiB0aGlzLl91cmxzVG9DYWNoZUtleXMpIHtcbiAgICAgICAgICAgICAgICBjb25zdCBpbnRlZ3JpdHkgPSB0aGlzLl9jYWNoZUtleXNUb0ludGVncml0aWVzLmdldChjYWNoZUtleSk7XG4gICAgICAgICAgICAgICAgY29uc3QgY2FjaGVNb2RlID0gdGhpcy5fdXJsc1RvQ2FjaGVNb2Rlcy5nZXQodXJsKTtcbiAgICAgICAgICAgICAgICBjb25zdCByZXF1ZXN0ID0gbmV3IFJlcXVlc3QodXJsLCB7XG4gICAgICAgICAgICAgICAgICAgIGludGVncml0eSxcbiAgICAgICAgICAgICAgICAgICAgY2FjaGU6IGNhY2hlTW9kZSxcbiAgICAgICAgICAgICAgICAgICAgY3JlZGVudGlhbHM6ICdzYW1lLW9yaWdpbicsXG4gICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICAgICAgYXdhaXQgUHJvbWlzZS5hbGwodGhpcy5zdHJhdGVneS5oYW5kbGVBbGwoe1xuICAgICAgICAgICAgICAgICAgICBwYXJhbXM6IHsgY2FjaGVLZXkgfSxcbiAgICAgICAgICAgICAgICAgICAgcmVxdWVzdCxcbiAgICAgICAgICAgICAgICAgICAgZXZlbnQsXG4gICAgICAgICAgICAgICAgfSkpO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgY29uc3QgeyB1cGRhdGVkVVJMcywgbm90VXBkYXRlZFVSTHMgfSA9IGluc3RhbGxSZXBvcnRQbHVnaW47XG4gICAgICAgICAgICBpZiAocHJvY2Vzcy5lbnYuTk9ERV9FTlYgIT09ICdwcm9kdWN0aW9uJykge1xuICAgICAgICAgICAgICAgIHByaW50SW5zdGFsbERldGFpbHModXBkYXRlZFVSTHMsIG5vdFVwZGF0ZWRVUkxzKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIHJldHVybiB7IHVwZGF0ZWRVUkxzLCBub3RVcGRhdGVkVVJMcyB9O1xuICAgICAgICB9KTtcbiAgICB9XG4gICAgLyoqXG4gICAgICogRGVsZXRlcyBhc3NldHMgdGhhdCBhcmUgbm8gbG9uZ2VyIHByZXNlbnQgaW4gdGhlIGN1cnJlbnQgcHJlY2FjaGUgbWFuaWZlc3QuXG4gICAgICogQ2FsbCB0aGlzIG1ldGhvZCBmcm9tIHRoZSBzZXJ2aWNlIHdvcmtlciBhY3RpdmF0ZSBldmVudC5cbiAgICAgKlxuICAgICAqIE5vdGU6IHRoaXMgbWV0aG9kIGNhbGxzIGBldmVudC53YWl0VW50aWwoKWAgZm9yIHlvdSwgc28geW91IGRvIG5vdCBuZWVkXG4gICAgICogdG8gY2FsbCBpdCB5b3Vyc2VsZiBpbiB5b3VyIGV2ZW50IGhhbmRsZXJzLlxuICAgICAqXG4gICAgICogQHBhcmFtIHtFeHRlbmRhYmxlRXZlbnR9IGV2ZW50XG4gICAgICogQHJldHVybiB7UHJvbWlzZTx3b3JrYm94LXByZWNhY2hpbmcuQ2xlYW51cFJlc3VsdD59XG4gICAgICovXG4gICAgYWN0aXZhdGUoZXZlbnQpIHtcbiAgICAgICAgLy8gd2FpdFVudGlsIHJldHVybnMgUHJvbWlzZTxhbnk+XG4gICAgICAgIC8vIGVzbGludC1kaXNhYmxlLW5leHQtbGluZSBAdHlwZXNjcmlwdC1lc2xpbnQvbm8tdW5zYWZlLXJldHVyblxuICAgICAgICByZXR1cm4gd2FpdFVudGlsKGV2ZW50LCBhc3luYyAoKSA9PiB7XG4gICAgICAgICAgICBjb25zdCBjYWNoZSA9IGF3YWl0IHNlbGYuY2FjaGVzLm9wZW4odGhpcy5zdHJhdGVneS5jYWNoZU5hbWUpO1xuICAgICAgICAgICAgY29uc3QgY3VycmVudGx5Q2FjaGVkUmVxdWVzdHMgPSBhd2FpdCBjYWNoZS5rZXlzKCk7XG4gICAgICAgICAgICBjb25zdCBleHBlY3RlZENhY2hlS2V5cyA9IG5ldyBTZXQodGhpcy5fdXJsc1RvQ2FjaGVLZXlzLnZhbHVlcygpKTtcbiAgICAgICAgICAgIGNvbnN0IGRlbGV0ZWRVUkxzID0gW107XG4gICAgICAgICAgICBmb3IgKGNvbnN0IHJlcXVlc3Qgb2YgY3VycmVudGx5Q2FjaGVkUmVxdWVzdHMpIHtcbiAgICAgICAgICAgICAgICBpZiAoIWV4cGVjdGVkQ2FjaGVLZXlzLmhhcyhyZXF1ZXN0LnVybCkpIHtcbiAgICAgICAgICAgICAgICAgICAgYXdhaXQgY2FjaGUuZGVsZXRlKHJlcXVlc3QpO1xuICAgICAgICAgICAgICAgICAgICBkZWxldGVkVVJMcy5wdXNoKHJlcXVlc3QudXJsKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBpZiAocHJvY2Vzcy5lbnYuTk9ERV9FTlYgIT09ICdwcm9kdWN0aW9uJykge1xuICAgICAgICAgICAgICAgIHByaW50Q2xlYW51cERldGFpbHMoZGVsZXRlZFVSTHMpO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgcmV0dXJuIHsgZGVsZXRlZFVSTHMgfTtcbiAgICAgICAgfSk7XG4gICAgfVxuICAgIC8qKlxuICAgICAqIFJldHVybnMgYSBtYXBwaW5nIG9mIGEgcHJlY2FjaGVkIFVSTCB0byB0aGUgY29ycmVzcG9uZGluZyBjYWNoZSBrZXksIHRha2luZ1xuICAgICAqIGludG8gYWNjb3VudCB0aGUgcmV2aXNpb24gaW5mb3JtYXRpb24gZm9yIHRoZSBVUkwuXG4gICAgICpcbiAgICAgKiBAcmV0dXJuIHtNYXA8c3RyaW5nLCBzdHJpbmc+fSBBIFVSTCB0byBjYWNoZSBrZXkgbWFwcGluZy5cbiAgICAgKi9cbiAgICBnZXRVUkxzVG9DYWNoZUtleXMoKSB7XG4gICAgICAgIHJldHVybiB0aGlzLl91cmxzVG9DYWNoZUtleXM7XG4gICAgfVxuICAgIC8qKlxuICAgICAqIFJldHVybnMgYSBsaXN0IG9mIGFsbCB0aGUgVVJMcyB0aGF0IGhhdmUgYmVlbiBwcmVjYWNoZWQgYnkgdGhlIGN1cnJlbnRcbiAgICAgKiBzZXJ2aWNlIHdvcmtlci5cbiAgICAgKlxuICAgICAqIEByZXR1cm4ge0FycmF5PHN0cmluZz59IFRoZSBwcmVjYWNoZWQgVVJMcy5cbiAgICAgKi9cbiAgICBnZXRDYWNoZWRVUkxzKCkge1xuICAgICAgICByZXR1cm4gWy4uLnRoaXMuX3VybHNUb0NhY2hlS2V5cy5rZXlzKCldO1xuICAgIH1cbiAgICAvKipcbiAgICAgKiBSZXR1cm5zIHRoZSBjYWNoZSBrZXkgdXNlZCBmb3Igc3RvcmluZyBhIGdpdmVuIFVSTC4gSWYgdGhhdCBVUkwgaXNcbiAgICAgKiB1bnZlcnNpb25lZCwgbGlrZSBgL2luZGV4Lmh0bWwnLCB0aGVuIHRoZSBjYWNoZSBrZXkgd2lsbCBiZSB0aGUgb3JpZ2luYWxcbiAgICAgKiBVUkwgd2l0aCBhIHNlYXJjaCBwYXJhbWV0ZXIgYXBwZW5kZWQgdG8gaXQuXG4gICAgICpcbiAgICAgKiBAcGFyYW0ge3N0cmluZ30gdXJsIEEgVVJMIHdob3NlIGNhY2hlIGtleSB5b3Ugd2FudCB0byBsb29rIHVwLlxuICAgICAqIEByZXR1cm4ge3N0cmluZ30gVGhlIHZlcnNpb25lZCBVUkwgdGhhdCBjb3JyZXNwb25kcyB0byBhIGNhY2hlIGtleVxuICAgICAqIGZvciB0aGUgb3JpZ2luYWwgVVJMLCBvciB1bmRlZmluZWQgaWYgdGhhdCBVUkwgaXNuJ3QgcHJlY2FjaGVkLlxuICAgICAqL1xuICAgIGdldENhY2hlS2V5Rm9yVVJMKHVybCkge1xuICAgICAgICBjb25zdCB1cmxPYmplY3QgPSBuZXcgVVJMKHVybCwgbG9jYXRpb24uaHJlZik7XG4gICAgICAgIHJldHVybiB0aGlzLl91cmxzVG9DYWNoZUtleXMuZ2V0KHVybE9iamVjdC5ocmVmKTtcbiAgICB9XG4gICAgLyoqXG4gICAgICogQHBhcmFtIHtzdHJpbmd9IHVybCBBIGNhY2hlIGtleSB3aG9zZSBTUkkgeW91IHdhbnQgdG8gbG9vayB1cC5cbiAgICAgKiBAcmV0dXJuIHtzdHJpbmd9IFRoZSBzdWJyZXNvdXJjZSBpbnRlZ3JpdHkgYXNzb2NpYXRlZCB3aXRoIHRoZSBjYWNoZSBrZXksXG4gICAgICogb3IgdW5kZWZpbmVkIGlmIGl0J3Mgbm90IHNldC5cbiAgICAgKi9cbiAgICBnZXRJbnRlZ3JpdHlGb3JDYWNoZUtleShjYWNoZUtleSkge1xuICAgICAgICByZXR1cm4gdGhpcy5fY2FjaGVLZXlzVG9JbnRlZ3JpdGllcy5nZXQoY2FjaGVLZXkpO1xuICAgIH1cbiAgICAvKipcbiAgICAgKiBUaGlzIGFjdHMgYXMgYSBkcm9wLWluIHJlcGxhY2VtZW50IGZvclxuICAgICAqIFtgY2FjaGUubWF0Y2goKWBdKGh0dHBzOi8vZGV2ZWxvcGVyLm1vemlsbGEub3JnL2VuLVVTL2RvY3MvV2ViL0FQSS9DYWNoZS9tYXRjaClcbiAgICAgKiB3aXRoIHRoZSBmb2xsb3dpbmcgZGlmZmVyZW5jZXM6XG4gICAgICpcbiAgICAgKiAtIEl0IGtub3dzIHdoYXQgdGhlIG5hbWUgb2YgdGhlIHByZWNhY2hlIGlzLCBhbmQgb25seSBjaGVja3MgaW4gdGhhdCBjYWNoZS5cbiAgICAgKiAtIEl0IGFsbG93cyB5b3UgdG8gcGFzcyBpbiBhbiBcIm9yaWdpbmFsXCIgVVJMIHdpdGhvdXQgdmVyc2lvbmluZyBwYXJhbWV0ZXJzLFxuICAgICAqIGFuZCBpdCB3aWxsIGF1dG9tYXRpY2FsbHkgbG9vayB1cCB0aGUgY29ycmVjdCBjYWNoZSBrZXkgZm9yIHRoZSBjdXJyZW50bHlcbiAgICAgKiBhY3RpdmUgcmV2aXNpb24gb2YgdGhhdCBVUkwuXG4gICAgICpcbiAgICAgKiBFLmcuLCBgbWF0Y2hQcmVjYWNoZSgnaW5kZXguaHRtbCcpYCB3aWxsIGZpbmQgdGhlIGNvcnJlY3QgcHJlY2FjaGVkXG4gICAgICogcmVzcG9uc2UgZm9yIHRoZSBjdXJyZW50bHkgYWN0aXZlIHNlcnZpY2Ugd29ya2VyLCBldmVuIGlmIHRoZSBhY3R1YWwgY2FjaGVcbiAgICAgKiBrZXkgaXMgYCcvaW5kZXguaHRtbD9fX1dCX1JFVklTSU9OX189MTIzNGFiY2QnYC5cbiAgICAgKlxuICAgICAqIEBwYXJhbSB7c3RyaW5nfFJlcXVlc3R9IHJlcXVlc3QgVGhlIGtleSAod2l0aG91dCByZXZpc2lvbmluZyBwYXJhbWV0ZXJzKVxuICAgICAqIHRvIGxvb2sgdXAgaW4gdGhlIHByZWNhY2hlLlxuICAgICAqIEByZXR1cm4ge1Byb21pc2U8UmVzcG9uc2V8dW5kZWZpbmVkPn1cbiAgICAgKi9cbiAgICBhc3luYyBtYXRjaFByZWNhY2hlKHJlcXVlc3QpIHtcbiAgICAgICAgY29uc3QgdXJsID0gcmVxdWVzdCBpbnN0YW5jZW9mIFJlcXVlc3QgPyByZXF1ZXN0LnVybCA6IHJlcXVlc3Q7XG4gICAgICAgIGNvbnN0IGNhY2hlS2V5ID0gdGhpcy5nZXRDYWNoZUtleUZvclVSTCh1cmwpO1xuICAgICAgICBpZiAoY2FjaGVLZXkpIHtcbiAgICAgICAgICAgIGNvbnN0IGNhY2hlID0gYXdhaXQgc2VsZi5jYWNoZXMub3Blbih0aGlzLnN0cmF0ZWd5LmNhY2hlTmFtZSk7XG4gICAgICAgICAgICByZXR1cm4gY2FjaGUubWF0Y2goY2FjaGVLZXkpO1xuICAgICAgICB9XG4gICAgICAgIHJldHVybiB1bmRlZmluZWQ7XG4gICAgfVxuICAgIC8qKlxuICAgICAqIFJldHVybnMgYSBmdW5jdGlvbiB0aGF0IGxvb2tzIHVwIGB1cmxgIGluIHRoZSBwcmVjYWNoZSAodGFraW5nIGludG9cbiAgICAgKiBhY2NvdW50IHJldmlzaW9uIGluZm9ybWF0aW9uKSwgYW5kIHJldHVybnMgdGhlIGNvcnJlc3BvbmRpbmcgYFJlc3BvbnNlYC5cbiAgICAgKlxuICAgICAqIEBwYXJhbSB7c3RyaW5nfSB1cmwgVGhlIHByZWNhY2hlZCBVUkwgd2hpY2ggd2lsbCBiZSB1c2VkIHRvIGxvb2t1cCB0aGVcbiAgICAgKiBgUmVzcG9uc2VgLlxuICAgICAqIEByZXR1cm4ge3dvcmtib3gtcm91dGluZ35oYW5kbGVyQ2FsbGJhY2t9XG4gICAgICovXG4gICAgY3JlYXRlSGFuZGxlckJvdW5kVG9VUkwodXJsKSB7XG4gICAgICAgIGNvbnN0IGNhY2hlS2V5ID0gdGhpcy5nZXRDYWNoZUtleUZvclVSTCh1cmwpO1xuICAgICAgICBpZiAoIWNhY2hlS2V5KSB7XG4gICAgICAgICAgICB0aHJvdyBuZXcgV29ya2JveEVycm9yKCdub24tcHJlY2FjaGVkLXVybCcsIHsgdXJsIH0pO1xuICAgICAgICB9XG4gICAgICAgIHJldHVybiAob3B0aW9ucykgPT4ge1xuICAgICAgICAgICAgb3B0aW9ucy5yZXF1ZXN0ID0gbmV3IFJlcXVlc3QodXJsKTtcbiAgICAgICAgICAgIG9wdGlvbnMucGFyYW1zID0gT2JqZWN0LmFzc2lnbih7IGNhY2hlS2V5IH0sIG9wdGlvbnMucGFyYW1zKTtcbiAgICAgICAgICAgIHJldHVybiB0aGlzLnN0cmF0ZWd5LmhhbmRsZShvcHRpb25zKTtcbiAgICAgICAgfTtcbiAgICB9XG59XG5leHBvcnQgeyBQcmVjYWNoZUNvbnRyb2xsZXIgfTtcbiIsICIvKlxuICBDb3B5cmlnaHQgMjAxOSBHb29nbGUgTExDXG5cbiAgVXNlIG9mIHRoaXMgc291cmNlIGNvZGUgaXMgZ292ZXJuZWQgYnkgYW4gTUlULXN0eWxlXG4gIGxpY2Vuc2UgdGhhdCBjYW4gYmUgZm91bmQgaW4gdGhlIExJQ0VOU0UgZmlsZSBvciBhdFxuICBodHRwczovL29wZW5zb3VyY2Uub3JnL2xpY2Vuc2VzL01JVC5cbiovXG5pbXBvcnQgeyBQcmVjYWNoZUNvbnRyb2xsZXIgfSBmcm9tICcuLi9QcmVjYWNoZUNvbnRyb2xsZXIuanMnO1xuaW1wb3J0ICcuLi9fdmVyc2lvbi5qcyc7XG5sZXQgcHJlY2FjaGVDb250cm9sbGVyO1xuLyoqXG4gKiBAcmV0dXJuIHtQcmVjYWNoZUNvbnRyb2xsZXJ9XG4gKiBAcHJpdmF0ZVxuICovXG5leHBvcnQgY29uc3QgZ2V0T3JDcmVhdGVQcmVjYWNoZUNvbnRyb2xsZXIgPSAoKSA9PiB7XG4gICAgaWYgKCFwcmVjYWNoZUNvbnRyb2xsZXIpIHtcbiAgICAgICAgcHJlY2FjaGVDb250cm9sbGVyID0gbmV3IFByZWNhY2hlQ29udHJvbGxlcigpO1xuICAgIH1cbiAgICByZXR1cm4gcHJlY2FjaGVDb250cm9sbGVyO1xufTtcbiIsICJcInVzZSBzdHJpY3RcIjtcbi8vIEB0cy1pZ25vcmVcbnRyeSB7XG4gICAgc2VsZlsnd29ya2JveDpyb3V0aW5nOjcuMi4wJ10gJiYgXygpO1xufVxuY2F0Y2ggKGUpIHsgfVxuIiwgIi8qXG4gIENvcHlyaWdodCAyMDE4IEdvb2dsZSBMTENcblxuICBVc2Ugb2YgdGhpcyBzb3VyY2UgY29kZSBpcyBnb3Zlcm5lZCBieSBhbiBNSVQtc3R5bGVcbiAgbGljZW5zZSB0aGF0IGNhbiBiZSBmb3VuZCBpbiB0aGUgTElDRU5TRSBmaWxlIG9yIGF0XG4gIGh0dHBzOi8vb3BlbnNvdXJjZS5vcmcvbGljZW5zZXMvTUlULlxuKi9cbmltcG9ydCAnLi4vX3ZlcnNpb24uanMnO1xuLyoqXG4gKiBUaGUgZGVmYXVsdCBIVFRQIG1ldGhvZCwgJ0dFVCcsIHVzZWQgd2hlbiB0aGVyZSdzIG5vIHNwZWNpZmljIG1ldGhvZFxuICogY29uZmlndXJlZCBmb3IgYSByb3V0ZS5cbiAqXG4gKiBAdHlwZSB7c3RyaW5nfVxuICpcbiAqIEBwcml2YXRlXG4gKi9cbmV4cG9ydCBjb25zdCBkZWZhdWx0TWV0aG9kID0gJ0dFVCc7XG4vKipcbiAqIFRoZSBsaXN0IG9mIHZhbGlkIEhUVFAgbWV0aG9kcyBhc3NvY2lhdGVkIHdpdGggcmVxdWVzdHMgdGhhdCBjb3VsZCBiZSByb3V0ZWQuXG4gKlxuICogQHR5cGUge0FycmF5PHN0cmluZz59XG4gKlxuICogQHByaXZhdGVcbiAqL1xuZXhwb3J0IGNvbnN0IHZhbGlkTWV0aG9kcyA9IFtcbiAgICAnREVMRVRFJyxcbiAgICAnR0VUJyxcbiAgICAnSEVBRCcsXG4gICAgJ1BBVENIJyxcbiAgICAnUE9TVCcsXG4gICAgJ1BVVCcsXG5dO1xuIiwgIi8qXG4gIENvcHlyaWdodCAyMDE4IEdvb2dsZSBMTENcblxuICBVc2Ugb2YgdGhpcyBzb3VyY2UgY29kZSBpcyBnb3Zlcm5lZCBieSBhbiBNSVQtc3R5bGVcbiAgbGljZW5zZSB0aGF0IGNhbiBiZSBmb3VuZCBpbiB0aGUgTElDRU5TRSBmaWxlIG9yIGF0XG4gIGh0dHBzOi8vb3BlbnNvdXJjZS5vcmcvbGljZW5zZXMvTUlULlxuKi9cbmltcG9ydCB7IGFzc2VydCB9IGZyb20gJ3dvcmtib3gtY29yZS9fcHJpdmF0ZS9hc3NlcnQuanMnO1xuaW1wb3J0ICcuLi9fdmVyc2lvbi5qcyc7XG4vKipcbiAqIEBwYXJhbSB7ZnVuY3Rpb24oKXxPYmplY3R9IGhhbmRsZXIgRWl0aGVyIGEgZnVuY3Rpb24sIG9yIGFuIG9iamVjdCB3aXRoIGFcbiAqICdoYW5kbGUnIG1ldGhvZC5cbiAqIEByZXR1cm4ge09iamVjdH0gQW4gb2JqZWN0IHdpdGggYSBoYW5kbGUgbWV0aG9kLlxuICpcbiAqIEBwcml2YXRlXG4gKi9cbmV4cG9ydCBjb25zdCBub3JtYWxpemVIYW5kbGVyID0gKGhhbmRsZXIpID0+IHtcbiAgICBpZiAoaGFuZGxlciAmJiB0eXBlb2YgaGFuZGxlciA9PT0gJ29iamVjdCcpIHtcbiAgICAgICAgaWYgKHByb2Nlc3MuZW52Lk5PREVfRU5WICE9PSAncHJvZHVjdGlvbicpIHtcbiAgICAgICAgICAgIGFzc2VydC5oYXNNZXRob2QoaGFuZGxlciwgJ2hhbmRsZScsIHtcbiAgICAgICAgICAgICAgICBtb2R1bGVOYW1lOiAnd29ya2JveC1yb3V0aW5nJyxcbiAgICAgICAgICAgICAgICBjbGFzc05hbWU6ICdSb3V0ZScsXG4gICAgICAgICAgICAgICAgZnVuY05hbWU6ICdjb25zdHJ1Y3RvcicsXG4gICAgICAgICAgICAgICAgcGFyYW1OYW1lOiAnaGFuZGxlcicsXG4gICAgICAgICAgICB9KTtcbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gaGFuZGxlcjtcbiAgICB9XG4gICAgZWxzZSB7XG4gICAgICAgIGlmIChwcm9jZXNzLmVudi5OT0RFX0VOViAhPT0gJ3Byb2R1Y3Rpb24nKSB7XG4gICAgICAgICAgICBhc3NlcnQuaXNUeXBlKGhhbmRsZXIsICdmdW5jdGlvbicsIHtcbiAgICAgICAgICAgICAgICBtb2R1bGVOYW1lOiAnd29ya2JveC1yb3V0aW5nJyxcbiAgICAgICAgICAgICAgICBjbGFzc05hbWU6ICdSb3V0ZScsXG4gICAgICAgICAgICAgICAgZnVuY05hbWU6ICdjb25zdHJ1Y3RvcicsXG4gICAgICAgICAgICAgICAgcGFyYW1OYW1lOiAnaGFuZGxlcicsXG4gICAgICAgICAgICB9KTtcbiAgICAgICAgfVxuICAgICAgICByZXR1cm4geyBoYW5kbGU6IGhhbmRsZXIgfTtcbiAgICB9XG59O1xuIiwgIi8qXG4gIENvcHlyaWdodCAyMDE4IEdvb2dsZSBMTENcblxuICBVc2Ugb2YgdGhpcyBzb3VyY2UgY29kZSBpcyBnb3Zlcm5lZCBieSBhbiBNSVQtc3R5bGVcbiAgbGljZW5zZSB0aGF0IGNhbiBiZSBmb3VuZCBpbiB0aGUgTElDRU5TRSBmaWxlIG9yIGF0XG4gIGh0dHBzOi8vb3BlbnNvdXJjZS5vcmcvbGljZW5zZXMvTUlULlxuKi9cbmltcG9ydCB7IGFzc2VydCB9IGZyb20gJ3dvcmtib3gtY29yZS9fcHJpdmF0ZS9hc3NlcnQuanMnO1xuaW1wb3J0IHsgZGVmYXVsdE1ldGhvZCwgdmFsaWRNZXRob2RzIH0gZnJvbSAnLi91dGlscy9jb25zdGFudHMuanMnO1xuaW1wb3J0IHsgbm9ybWFsaXplSGFuZGxlciB9IGZyb20gJy4vdXRpbHMvbm9ybWFsaXplSGFuZGxlci5qcyc7XG5pbXBvcnQgJy4vX3ZlcnNpb24uanMnO1xuLyoqXG4gKiBBIGBSb3V0ZWAgY29uc2lzdHMgb2YgYSBwYWlyIG9mIGNhbGxiYWNrIGZ1bmN0aW9ucywgXCJtYXRjaFwiIGFuZCBcImhhbmRsZXJcIi5cbiAqIFRoZSBcIm1hdGNoXCIgY2FsbGJhY2sgZGV0ZXJtaW5lIGlmIGEgcm91dGUgc2hvdWxkIGJlIHVzZWQgdG8gXCJoYW5kbGVcIiBhXG4gKiByZXF1ZXN0IGJ5IHJldHVybmluZyBhIG5vbi1mYWxzeSB2YWx1ZSBpZiBpdCBjYW4uIFRoZSBcImhhbmRsZXJcIiBjYWxsYmFja1xuICogaXMgY2FsbGVkIHdoZW4gdGhlcmUgaXMgYSBtYXRjaCBhbmQgc2hvdWxkIHJldHVybiBhIFByb21pc2UgdGhhdCByZXNvbHZlc1xuICogdG8gYSBgUmVzcG9uc2VgLlxuICpcbiAqIEBtZW1iZXJvZiB3b3JrYm94LXJvdXRpbmdcbiAqL1xuY2xhc3MgUm91dGUge1xuICAgIC8qKlxuICAgICAqIENvbnN0cnVjdG9yIGZvciBSb3V0ZSBjbGFzcy5cbiAgICAgKlxuICAgICAqIEBwYXJhbSB7d29ya2JveC1yb3V0aW5nfm1hdGNoQ2FsbGJhY2t9IG1hdGNoXG4gICAgICogQSBjYWxsYmFjayBmdW5jdGlvbiB0aGF0IGRldGVybWluZXMgd2hldGhlciB0aGUgcm91dGUgbWF0Y2hlcyBhIGdpdmVuXG4gICAgICogYGZldGNoYCBldmVudCBieSByZXR1cm5pbmcgYSBub24tZmFsc3kgdmFsdWUuXG4gICAgICogQHBhcmFtIHt3b3JrYm94LXJvdXRpbmd+aGFuZGxlckNhbGxiYWNrfSBoYW5kbGVyIEEgY2FsbGJhY2tcbiAgICAgKiBmdW5jdGlvbiB0aGF0IHJldHVybnMgYSBQcm9taXNlIHJlc29sdmluZyB0byBhIFJlc3BvbnNlLlxuICAgICAqIEBwYXJhbSB7c3RyaW5nfSBbbWV0aG9kPSdHRVQnXSBUaGUgSFRUUCBtZXRob2QgdG8gbWF0Y2ggdGhlIFJvdXRlXG4gICAgICogYWdhaW5zdC5cbiAgICAgKi9cbiAgICBjb25zdHJ1Y3RvcihtYXRjaCwgaGFuZGxlciwgbWV0aG9kID0gZGVmYXVsdE1ldGhvZCkge1xuICAgICAgICBpZiAocHJvY2Vzcy5lbnYuTk9ERV9FTlYgIT09ICdwcm9kdWN0aW9uJykge1xuICAgICAgICAgICAgYXNzZXJ0LmlzVHlwZShtYXRjaCwgJ2Z1bmN0aW9uJywge1xuICAgICAgICAgICAgICAgIG1vZHVsZU5hbWU6ICd3b3JrYm94LXJvdXRpbmcnLFxuICAgICAgICAgICAgICAgIGNsYXNzTmFtZTogJ1JvdXRlJyxcbiAgICAgICAgICAgICAgICBmdW5jTmFtZTogJ2NvbnN0cnVjdG9yJyxcbiAgICAgICAgICAgICAgICBwYXJhbU5hbWU6ICdtYXRjaCcsXG4gICAgICAgICAgICB9KTtcbiAgICAgICAgICAgIGlmIChtZXRob2QpIHtcbiAgICAgICAgICAgICAgICBhc3NlcnQuaXNPbmVPZihtZXRob2QsIHZhbGlkTWV0aG9kcywgeyBwYXJhbU5hbWU6ICdtZXRob2QnIH0pO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICAgIC8vIFRoZXNlIHZhbHVlcyBhcmUgcmVmZXJlbmNlZCBkaXJlY3RseSBieSBSb3V0ZXIgc28gY2Fubm90IGJlXG4gICAgICAgIC8vIGFsdGVyZWQgYnkgbWluaWZpY2F0b24uXG4gICAgICAgIHRoaXMuaGFuZGxlciA9IG5vcm1hbGl6ZUhhbmRsZXIoaGFuZGxlcik7XG4gICAgICAgIHRoaXMubWF0Y2ggPSBtYXRjaDtcbiAgICAgICAgdGhpcy5tZXRob2QgPSBtZXRob2Q7XG4gICAgfVxuICAgIC8qKlxuICAgICAqXG4gICAgICogQHBhcmFtIHt3b3JrYm94LXJvdXRpbmctaGFuZGxlckNhbGxiYWNrfSBoYW5kbGVyIEEgY2FsbGJhY2tcbiAgICAgKiBmdW5jdGlvbiB0aGF0IHJldHVybnMgYSBQcm9taXNlIHJlc29sdmluZyB0byBhIFJlc3BvbnNlXG4gICAgICovXG4gICAgc2V0Q2F0Y2hIYW5kbGVyKGhhbmRsZXIpIHtcbiAgICAgICAgdGhpcy5jYXRjaEhhbmRsZXIgPSBub3JtYWxpemVIYW5kbGVyKGhhbmRsZXIpO1xuICAgIH1cbn1cbmV4cG9ydCB7IFJvdXRlIH07XG4iLCAiLypcbiAgQ29weXJpZ2h0IDIwMTggR29vZ2xlIExMQ1xuXG4gIFVzZSBvZiB0aGlzIHNvdXJjZSBjb2RlIGlzIGdvdmVybmVkIGJ5IGFuIE1JVC1zdHlsZVxuICBsaWNlbnNlIHRoYXQgY2FuIGJlIGZvdW5kIGluIHRoZSBMSUNFTlNFIGZpbGUgb3IgYXRcbiAgaHR0cHM6Ly9vcGVuc291cmNlLm9yZy9saWNlbnNlcy9NSVQuXG4qL1xuaW1wb3J0IHsgYXNzZXJ0IH0gZnJvbSAnd29ya2JveC1jb3JlL19wcml2YXRlL2Fzc2VydC5qcyc7XG5pbXBvcnQgeyBsb2dnZXIgfSBmcm9tICd3b3JrYm94LWNvcmUvX3ByaXZhdGUvbG9nZ2VyLmpzJztcbmltcG9ydCB7IFJvdXRlIH0gZnJvbSAnLi9Sb3V0ZS5qcyc7XG5pbXBvcnQgJy4vX3ZlcnNpb24uanMnO1xuLyoqXG4gKiBSZWdFeHBSb3V0ZSBtYWtlcyBpdCBlYXN5IHRvIGNyZWF0ZSBhIHJlZ3VsYXIgZXhwcmVzc2lvbiBiYXNlZFxuICoge0BsaW5rIHdvcmtib3gtcm91dGluZy5Sb3V0ZX0uXG4gKlxuICogRm9yIHNhbWUtb3JpZ2luIHJlcXVlc3RzIHRoZSBSZWdFeHAgb25seSBuZWVkcyB0byBtYXRjaCBwYXJ0IG9mIHRoZSBVUkwuIEZvclxuICogcmVxdWVzdHMgYWdhaW5zdCB0aGlyZC1wYXJ0eSBzZXJ2ZXJzLCB5b3UgbXVzdCBkZWZpbmUgYSBSZWdFeHAgdGhhdCBtYXRjaGVzXG4gKiB0aGUgc3RhcnQgb2YgdGhlIFVSTC5cbiAqXG4gKiBAbWVtYmVyb2Ygd29ya2JveC1yb3V0aW5nXG4gKiBAZXh0ZW5kcyB3b3JrYm94LXJvdXRpbmcuUm91dGVcbiAqL1xuY2xhc3MgUmVnRXhwUm91dGUgZXh0ZW5kcyBSb3V0ZSB7XG4gICAgLyoqXG4gICAgICogSWYgdGhlIHJlZ3VsYXIgZXhwcmVzc2lvbiBjb250YWluc1xuICAgICAqIFtjYXB0dXJlIGdyb3Vwc117QGxpbmsgaHR0cHM6Ly9kZXZlbG9wZXIubW96aWxsYS5vcmcvZW4tVVMvZG9jcy9XZWIvSmF2YVNjcmlwdC9SZWZlcmVuY2UvR2xvYmFsX09iamVjdHMvUmVnRXhwI2dyb3VwaW5nLWJhY2stcmVmZXJlbmNlc30sXG4gICAgICogdGhlIGNhcHR1cmVkIHZhbHVlcyB3aWxsIGJlIHBhc3NlZCB0byB0aGVcbiAgICAgKiB7QGxpbmsgd29ya2JveC1yb3V0aW5nfmhhbmRsZXJDYWxsYmFja30gYHBhcmFtc2BcbiAgICAgKiBhcmd1bWVudC5cbiAgICAgKlxuICAgICAqIEBwYXJhbSB7UmVnRXhwfSByZWdFeHAgVGhlIHJlZ3VsYXIgZXhwcmVzc2lvbiB0byBtYXRjaCBhZ2FpbnN0IFVSTHMuXG4gICAgICogQHBhcmFtIHt3b3JrYm94LXJvdXRpbmd+aGFuZGxlckNhbGxiYWNrfSBoYW5kbGVyIEEgY2FsbGJhY2tcbiAgICAgKiBmdW5jdGlvbiB0aGF0IHJldHVybnMgYSBQcm9taXNlIHJlc3VsdGluZyBpbiBhIFJlc3BvbnNlLlxuICAgICAqIEBwYXJhbSB7c3RyaW5nfSBbbWV0aG9kPSdHRVQnXSBUaGUgSFRUUCBtZXRob2QgdG8gbWF0Y2ggdGhlIFJvdXRlXG4gICAgICogYWdhaW5zdC5cbiAgICAgKi9cbiAgICBjb25zdHJ1Y3RvcihyZWdFeHAsIGhhbmRsZXIsIG1ldGhvZCkge1xuICAgICAgICBpZiAocHJvY2Vzcy5lbnYuTk9ERV9FTlYgIT09ICdwcm9kdWN0aW9uJykge1xuICAgICAgICAgICAgYXNzZXJ0LmlzSW5zdGFuY2UocmVnRXhwLCBSZWdFeHAsIHtcbiAgICAgICAgICAgICAgICBtb2R1bGVOYW1lOiAnd29ya2JveC1yb3V0aW5nJyxcbiAgICAgICAgICAgICAgICBjbGFzc05hbWU6ICdSZWdFeHBSb3V0ZScsXG4gICAgICAgICAgICAgICAgZnVuY05hbWU6ICdjb25zdHJ1Y3RvcicsXG4gICAgICAgICAgICAgICAgcGFyYW1OYW1lOiAncGF0dGVybicsXG4gICAgICAgICAgICB9KTtcbiAgICAgICAgfVxuICAgICAgICBjb25zdCBtYXRjaCA9ICh7IHVybCB9KSA9PiB7XG4gICAgICAgICAgICBjb25zdCByZXN1bHQgPSByZWdFeHAuZXhlYyh1cmwuaHJlZik7XG4gICAgICAgICAgICAvLyBSZXR1cm4gaW1tZWRpYXRlbHkgaWYgdGhlcmUncyBubyBtYXRjaC5cbiAgICAgICAgICAgIGlmICghcmVzdWx0KSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgLy8gUmVxdWlyZSB0aGF0IHRoZSBtYXRjaCBzdGFydCBhdCB0aGUgZmlyc3QgY2hhcmFjdGVyIGluIHRoZSBVUkwgc3RyaW5nXG4gICAgICAgICAgICAvLyBpZiBpdCdzIGEgY3Jvc3Mtb3JpZ2luIHJlcXVlc3QuXG4gICAgICAgICAgICAvLyBTZWUgaHR0cHM6Ly9naXRodWIuY29tL0dvb2dsZUNocm9tZS93b3JrYm94L2lzc3Vlcy8yODEgZm9yIHRoZSBjb250ZXh0XG4gICAgICAgICAgICAvLyBiZWhpbmQgdGhpcyBiZWhhdmlvci5cbiAgICAgICAgICAgIGlmICh1cmwub3JpZ2luICE9PSBsb2NhdGlvbi5vcmlnaW4gJiYgcmVzdWx0LmluZGV4ICE9PSAwKSB7XG4gICAgICAgICAgICAgICAgaWYgKHByb2Nlc3MuZW52Lk5PREVfRU5WICE9PSAncHJvZHVjdGlvbicpIHtcbiAgICAgICAgICAgICAgICAgICAgbG9nZ2VyLmRlYnVnKGBUaGUgcmVndWxhciBleHByZXNzaW9uICcke3JlZ0V4cC50b1N0cmluZygpfScgb25seSBwYXJ0aWFsbHkgbWF0Y2hlZCBgICtcbiAgICAgICAgICAgICAgICAgICAgICAgIGBhZ2FpbnN0IHRoZSBjcm9zcy1vcmlnaW4gVVJMICcke3VybC50b1N0cmluZygpfScuIFJlZ0V4cFJvdXRlJ3Mgd2lsbCBvbmx5IGAgK1xuICAgICAgICAgICAgICAgICAgICAgICAgYGhhbmRsZSBjcm9zcy1vcmlnaW4gcmVxdWVzdHMgaWYgdGhleSBtYXRjaCB0aGUgZW50aXJlIFVSTC5gKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgLy8gSWYgdGhlIHJvdXRlIG1hdGNoZXMsIGJ1dCB0aGVyZSBhcmVuJ3QgYW55IGNhcHR1cmUgZ3JvdXBzIGRlZmluZWQsIHRoZW5cbiAgICAgICAgICAgIC8vIHRoaXMgd2lsbCByZXR1cm4gW10sIHdoaWNoIGlzIHRydXRoeSBhbmQgdGhlcmVmb3JlIHN1ZmZpY2llbnQgdG9cbiAgICAgICAgICAgIC8vIGluZGljYXRlIGEgbWF0Y2guXG4gICAgICAgICAgICAvLyBJZiB0aGVyZSBhcmUgY2FwdHVyZSBncm91cHMsIHRoZW4gaXQgd2lsbCByZXR1cm4gdGhlaXIgdmFsdWVzLlxuICAgICAgICAgICAgcmV0dXJuIHJlc3VsdC5zbGljZSgxKTtcbiAgICAgICAgfTtcbiAgICAgICAgc3VwZXIobWF0Y2gsIGhhbmRsZXIsIG1ldGhvZCk7XG4gICAgfVxufVxuZXhwb3J0IHsgUmVnRXhwUm91dGUgfTtcbiIsICIvKlxuICBDb3B5cmlnaHQgMjAxOCBHb29nbGUgTExDXG5cbiAgVXNlIG9mIHRoaXMgc291cmNlIGNvZGUgaXMgZ292ZXJuZWQgYnkgYW4gTUlULXN0eWxlXG4gIGxpY2Vuc2UgdGhhdCBjYW4gYmUgZm91bmQgaW4gdGhlIExJQ0VOU0UgZmlsZSBvciBhdFxuICBodHRwczovL29wZW5zb3VyY2Uub3JnL2xpY2Vuc2VzL01JVC5cbiovXG5pbXBvcnQgeyBhc3NlcnQgfSBmcm9tICd3b3JrYm94LWNvcmUvX3ByaXZhdGUvYXNzZXJ0LmpzJztcbmltcG9ydCB7IGdldEZyaWVuZGx5VVJMIH0gZnJvbSAnd29ya2JveC1jb3JlL19wcml2YXRlL2dldEZyaWVuZGx5VVJMLmpzJztcbmltcG9ydCB7IGRlZmF1bHRNZXRob2QgfSBmcm9tICcuL3V0aWxzL2NvbnN0YW50cy5qcyc7XG5pbXBvcnQgeyBsb2dnZXIgfSBmcm9tICd3b3JrYm94LWNvcmUvX3ByaXZhdGUvbG9nZ2VyLmpzJztcbmltcG9ydCB7IG5vcm1hbGl6ZUhhbmRsZXIgfSBmcm9tICcuL3V0aWxzL25vcm1hbGl6ZUhhbmRsZXIuanMnO1xuaW1wb3J0IHsgV29ya2JveEVycm9yIH0gZnJvbSAnd29ya2JveC1jb3JlL19wcml2YXRlL1dvcmtib3hFcnJvci5qcyc7XG5pbXBvcnQgJy4vX3ZlcnNpb24uanMnO1xuLyoqXG4gKiBUaGUgUm91dGVyIGNhbiBiZSB1c2VkIHRvIHByb2Nlc3MgYSBgRmV0Y2hFdmVudGAgdXNpbmcgb25lIG9yIG1vcmVcbiAqIHtAbGluayB3b3JrYm94LXJvdXRpbmcuUm91dGV9LCByZXNwb25kaW5nIHdpdGggYSBgUmVzcG9uc2VgIGlmXG4gKiBhIG1hdGNoaW5nIHJvdXRlIGV4aXN0cy5cbiAqXG4gKiBJZiBubyByb3V0ZSBtYXRjaGVzIGEgZ2l2ZW4gYSByZXF1ZXN0LCB0aGUgUm91dGVyIHdpbGwgdXNlIGEgXCJkZWZhdWx0XCJcbiAqIGhhbmRsZXIgaWYgb25lIGlzIGRlZmluZWQuXG4gKlxuICogU2hvdWxkIHRoZSBtYXRjaGluZyBSb3V0ZSB0aHJvdyBhbiBlcnJvciwgdGhlIFJvdXRlciB3aWxsIHVzZSBhIFwiY2F0Y2hcIlxuICogaGFuZGxlciBpZiBvbmUgaXMgZGVmaW5lZCB0byBncmFjZWZ1bGx5IGRlYWwgd2l0aCBpc3N1ZXMgYW5kIHJlc3BvbmQgd2l0aCBhXG4gKiBSZXF1ZXN0LlxuICpcbiAqIElmIGEgcmVxdWVzdCBtYXRjaGVzIG11bHRpcGxlIHJvdXRlcywgdGhlICoqZWFybGllc3QqKiByZWdpc3RlcmVkIHJvdXRlIHdpbGxcbiAqIGJlIHVzZWQgdG8gcmVzcG9uZCB0byB0aGUgcmVxdWVzdC5cbiAqXG4gKiBAbWVtYmVyb2Ygd29ya2JveC1yb3V0aW5nXG4gKi9cbmNsYXNzIFJvdXRlciB7XG4gICAgLyoqXG4gICAgICogSW5pdGlhbGl6ZXMgYSBuZXcgUm91dGVyLlxuICAgICAqL1xuICAgIGNvbnN0cnVjdG9yKCkge1xuICAgICAgICB0aGlzLl9yb3V0ZXMgPSBuZXcgTWFwKCk7XG4gICAgICAgIHRoaXMuX2RlZmF1bHRIYW5kbGVyTWFwID0gbmV3IE1hcCgpO1xuICAgIH1cbiAgICAvKipcbiAgICAgKiBAcmV0dXJuIHtNYXA8c3RyaW5nLCBBcnJheTx3b3JrYm94LXJvdXRpbmcuUm91dGU+Pn0gcm91dGVzIEEgYE1hcGAgb2YgSFRUUFxuICAgICAqIG1ldGhvZCBuYW1lICgnR0VUJywgZXRjLikgdG8gYW4gYXJyYXkgb2YgYWxsIHRoZSBjb3JyZXNwb25kaW5nIGBSb3V0ZWBcbiAgICAgKiBpbnN0YW5jZXMgdGhhdCBhcmUgcmVnaXN0ZXJlZC5cbiAgICAgKi9cbiAgICBnZXQgcm91dGVzKCkge1xuICAgICAgICByZXR1cm4gdGhpcy5fcm91dGVzO1xuICAgIH1cbiAgICAvKipcbiAgICAgKiBBZGRzIGEgZmV0Y2ggZXZlbnQgbGlzdGVuZXIgdG8gcmVzcG9uZCB0byBldmVudHMgd2hlbiBhIHJvdXRlIG1hdGNoZXNcbiAgICAgKiB0aGUgZXZlbnQncyByZXF1ZXN0LlxuICAgICAqL1xuICAgIGFkZEZldGNoTGlzdGVuZXIoKSB7XG4gICAgICAgIC8vIFNlZSBodHRwczovL2dpdGh1Yi5jb20vTWljcm9zb2Z0L1R5cGVTY3JpcHQvaXNzdWVzLzI4MzU3I2lzc3VlY29tbWVudC00MzY0ODQ3MDVcbiAgICAgICAgc2VsZi5hZGRFdmVudExpc3RlbmVyKCdmZXRjaCcsICgoZXZlbnQpID0+IHtcbiAgICAgICAgICAgIGNvbnN0IHsgcmVxdWVzdCB9ID0gZXZlbnQ7XG4gICAgICAgICAgICBjb25zdCByZXNwb25zZVByb21pc2UgPSB0aGlzLmhhbmRsZVJlcXVlc3QoeyByZXF1ZXN0LCBldmVudCB9KTtcbiAgICAgICAgICAgIGlmIChyZXNwb25zZVByb21pc2UpIHtcbiAgICAgICAgICAgICAgICBldmVudC5yZXNwb25kV2l0aChyZXNwb25zZVByb21pc2UpO1xuICAgICAgICAgICAgfVxuICAgICAgICB9KSk7XG4gICAgfVxuICAgIC8qKlxuICAgICAqIEFkZHMgYSBtZXNzYWdlIGV2ZW50IGxpc3RlbmVyIGZvciBVUkxzIHRvIGNhY2hlIGZyb20gdGhlIHdpbmRvdy5cbiAgICAgKiBUaGlzIGlzIHVzZWZ1bCB0byBjYWNoZSByZXNvdXJjZXMgbG9hZGVkIG9uIHRoZSBwYWdlIHByaW9yIHRvIHdoZW4gdGhlXG4gICAgICogc2VydmljZSB3b3JrZXIgc3RhcnRlZCBjb250cm9sbGluZyBpdC5cbiAgICAgKlxuICAgICAqIFRoZSBmb3JtYXQgb2YgdGhlIG1lc3NhZ2UgZGF0YSBzZW50IGZyb20gdGhlIHdpbmRvdyBzaG91bGQgYmUgYXMgZm9sbG93cy5cbiAgICAgKiBXaGVyZSB0aGUgYHVybHNUb0NhY2hlYCBhcnJheSBtYXkgY29uc2lzdCBvZiBVUkwgc3RyaW5ncyBvciBhbiBhcnJheSBvZlxuICAgICAqIFVSTCBzdHJpbmcgKyBgcmVxdWVzdEluaXRgIG9iamVjdCAodGhlIHNhbWUgYXMgeW91J2QgcGFzcyB0byBgZmV0Y2goKWApLlxuICAgICAqXG4gICAgICogYGBgXG4gICAgICoge1xuICAgICAqICAgdHlwZTogJ0NBQ0hFX1VSTFMnLFxuICAgICAqICAgcGF5bG9hZDoge1xuICAgICAqICAgICB1cmxzVG9DYWNoZTogW1xuICAgICAqICAgICAgICcuL3NjcmlwdDEuanMnLFxuICAgICAqICAgICAgICcuL3NjcmlwdDIuanMnLFxuICAgICAqICAgICAgIFsnLi9zY3JpcHQzLmpzJywge21vZGU6ICduby1jb3JzJ31dLFxuICAgICAqICAgICBdLFxuICAgICAqICAgfSxcbiAgICAgKiB9XG4gICAgICogYGBgXG4gICAgICovXG4gICAgYWRkQ2FjaGVMaXN0ZW5lcigpIHtcbiAgICAgICAgLy8gU2VlIGh0dHBzOi8vZ2l0aHViLmNvbS9NaWNyb3NvZnQvVHlwZVNjcmlwdC9pc3N1ZXMvMjgzNTcjaXNzdWVjb21tZW50LTQzNjQ4NDcwNVxuICAgICAgICBzZWxmLmFkZEV2ZW50TGlzdGVuZXIoJ21lc3NhZ2UnLCAoKGV2ZW50KSA9PiB7XG4gICAgICAgICAgICAvLyBldmVudC5kYXRhIGlzIHR5cGUgJ2FueSdcbiAgICAgICAgICAgIC8vIGVzbGludC1kaXNhYmxlLW5leHQtbGluZSBAdHlwZXNjcmlwdC1lc2xpbnQvbm8tdW5zYWZlLW1lbWJlci1hY2Nlc3NcbiAgICAgICAgICAgIGlmIChldmVudC5kYXRhICYmIGV2ZW50LmRhdGEudHlwZSA9PT0gJ0NBQ0hFX1VSTFMnKSB7XG4gICAgICAgICAgICAgICAgLy8gZXNsaW50LWRpc2FibGUtbmV4dC1saW5lIEB0eXBlc2NyaXB0LWVzbGludC9uby11bnNhZmUtYXNzaWdubWVudFxuICAgICAgICAgICAgICAgIGNvbnN0IHsgcGF5bG9hZCB9ID0gZXZlbnQuZGF0YTtcbiAgICAgICAgICAgICAgICBpZiAocHJvY2Vzcy5lbnYuTk9ERV9FTlYgIT09ICdwcm9kdWN0aW9uJykge1xuICAgICAgICAgICAgICAgICAgICBsb2dnZXIuZGVidWcoYENhY2hpbmcgVVJMcyBmcm9tIHRoZSB3aW5kb3dgLCBwYXlsb2FkLnVybHNUb0NhY2hlKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgY29uc3QgcmVxdWVzdFByb21pc2VzID0gUHJvbWlzZS5hbGwocGF5bG9hZC51cmxzVG9DYWNoZS5tYXAoKGVudHJ5KSA9PiB7XG4gICAgICAgICAgICAgICAgICAgIGlmICh0eXBlb2YgZW50cnkgPT09ICdzdHJpbmcnKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBlbnRyeSA9IFtlbnRyeV07XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgY29uc3QgcmVxdWVzdCA9IG5ldyBSZXF1ZXN0KC4uLmVudHJ5KTtcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIHRoaXMuaGFuZGxlUmVxdWVzdCh7IHJlcXVlc3QsIGV2ZW50IH0pO1xuICAgICAgICAgICAgICAgICAgICAvLyBUT0RPKHBoaWxpcHdhbHRvbik6IFR5cGVTY3JpcHQgZXJyb3JzIHdpdGhvdXQgdGhpcyB0eXBlY2FzdCBmb3JcbiAgICAgICAgICAgICAgICAgICAgLy8gc29tZSByZWFzb24gKHByb2JhYmx5IGEgYnVnKS4gVGhlIHJlYWwgdHlwZSBoZXJlIHNob3VsZCB3b3JrIGJ1dFxuICAgICAgICAgICAgICAgICAgICAvLyBkb2Vzbid0OiBgQXJyYXk8UHJvbWlzZTxSZXNwb25zZT4gfCB1bmRlZmluZWQ+YC5cbiAgICAgICAgICAgICAgICB9KSk7IC8vIFR5cGVTY3JpcHRcbiAgICAgICAgICAgICAgICBldmVudC53YWl0VW50aWwocmVxdWVzdFByb21pc2VzKTtcbiAgICAgICAgICAgICAgICAvLyBJZiBhIE1lc3NhZ2VDaGFubmVsIHdhcyB1c2VkLCByZXBseSB0byB0aGUgbWVzc2FnZSBvbiBzdWNjZXNzLlxuICAgICAgICAgICAgICAgIGlmIChldmVudC5wb3J0cyAmJiBldmVudC5wb3J0c1swXSkge1xuICAgICAgICAgICAgICAgICAgICB2b2lkIHJlcXVlc3RQcm9taXNlcy50aGVuKCgpID0+IGV2ZW50LnBvcnRzWzBdLnBvc3RNZXNzYWdlKHRydWUpKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgIH0pKTtcbiAgICB9XG4gICAgLyoqXG4gICAgICogQXBwbHkgdGhlIHJvdXRpbmcgcnVsZXMgdG8gYSBGZXRjaEV2ZW50IG9iamVjdCB0byBnZXQgYSBSZXNwb25zZSBmcm9tIGFuXG4gICAgICogYXBwcm9wcmlhdGUgUm91dGUncyBoYW5kbGVyLlxuICAgICAqXG4gICAgICogQHBhcmFtIHtPYmplY3R9IG9wdGlvbnNcbiAgICAgKiBAcGFyYW0ge1JlcXVlc3R9IG9wdGlvbnMucmVxdWVzdCBUaGUgcmVxdWVzdCB0byBoYW5kbGUuXG4gICAgICogQHBhcmFtIHtFeHRlbmRhYmxlRXZlbnR9IG9wdGlvbnMuZXZlbnQgVGhlIGV2ZW50IHRoYXQgdHJpZ2dlcmVkIHRoZVxuICAgICAqICAgICByZXF1ZXN0LlxuICAgICAqIEByZXR1cm4ge1Byb21pc2U8UmVzcG9uc2U+fHVuZGVmaW5lZH0gQSBwcm9taXNlIGlzIHJldHVybmVkIGlmIGFcbiAgICAgKiAgICAgcmVnaXN0ZXJlZCByb3V0ZSBjYW4gaGFuZGxlIHRoZSByZXF1ZXN0LiBJZiB0aGVyZSBpcyBubyBtYXRjaGluZ1xuICAgICAqICAgICByb3V0ZSBhbmQgdGhlcmUncyBubyBgZGVmYXVsdEhhbmRsZXJgLCBgdW5kZWZpbmVkYCBpcyByZXR1cm5lZC5cbiAgICAgKi9cbiAgICBoYW5kbGVSZXF1ZXN0KHsgcmVxdWVzdCwgZXZlbnQsIH0pIHtcbiAgICAgICAgaWYgKHByb2Nlc3MuZW52Lk5PREVfRU5WICE9PSAncHJvZHVjdGlvbicpIHtcbiAgICAgICAgICAgIGFzc2VydC5pc0luc3RhbmNlKHJlcXVlc3QsIFJlcXVlc3QsIHtcbiAgICAgICAgICAgICAgICBtb2R1bGVOYW1lOiAnd29ya2JveC1yb3V0aW5nJyxcbiAgICAgICAgICAgICAgICBjbGFzc05hbWU6ICdSb3V0ZXInLFxuICAgICAgICAgICAgICAgIGZ1bmNOYW1lOiAnaGFuZGxlUmVxdWVzdCcsXG4gICAgICAgICAgICAgICAgcGFyYW1OYW1lOiAnb3B0aW9ucy5yZXF1ZXN0JyxcbiAgICAgICAgICAgIH0pO1xuICAgICAgICB9XG4gICAgICAgIGNvbnN0IHVybCA9IG5ldyBVUkwocmVxdWVzdC51cmwsIGxvY2F0aW9uLmhyZWYpO1xuICAgICAgICBpZiAoIXVybC5wcm90b2NvbC5zdGFydHNXaXRoKCdodHRwJykpIHtcbiAgICAgICAgICAgIGlmIChwcm9jZXNzLmVudi5OT0RFX0VOViAhPT0gJ3Byb2R1Y3Rpb24nKSB7XG4gICAgICAgICAgICAgICAgbG9nZ2VyLmRlYnVnKGBXb3JrYm94IFJvdXRlciBvbmx5IHN1cHBvcnRzIFVSTHMgdGhhdCBzdGFydCB3aXRoICdodHRwJy5gKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgfVxuICAgICAgICBjb25zdCBzYW1lT3JpZ2luID0gdXJsLm9yaWdpbiA9PT0gbG9jYXRpb24ub3JpZ2luO1xuICAgICAgICBjb25zdCB7IHBhcmFtcywgcm91dGUgfSA9IHRoaXMuZmluZE1hdGNoaW5nUm91dGUoe1xuICAgICAgICAgICAgZXZlbnQsXG4gICAgICAgICAgICByZXF1ZXN0LFxuICAgICAgICAgICAgc2FtZU9yaWdpbixcbiAgICAgICAgICAgIHVybCxcbiAgICAgICAgfSk7XG4gICAgICAgIGxldCBoYW5kbGVyID0gcm91dGUgJiYgcm91dGUuaGFuZGxlcjtcbiAgICAgICAgY29uc3QgZGVidWdNZXNzYWdlcyA9IFtdO1xuICAgICAgICBpZiAocHJvY2Vzcy5lbnYuTk9ERV9FTlYgIT09ICdwcm9kdWN0aW9uJykge1xuICAgICAgICAgICAgaWYgKGhhbmRsZXIpIHtcbiAgICAgICAgICAgICAgICBkZWJ1Z01lc3NhZ2VzLnB1c2goW2BGb3VuZCBhIHJvdXRlIHRvIGhhbmRsZSB0aGlzIHJlcXVlc3Q6YCwgcm91dGVdKTtcbiAgICAgICAgICAgICAgICBpZiAocGFyYW1zKSB7XG4gICAgICAgICAgICAgICAgICAgIGRlYnVnTWVzc2FnZXMucHVzaChbXG4gICAgICAgICAgICAgICAgICAgICAgICBgUGFzc2luZyB0aGUgZm9sbG93aW5nIHBhcmFtcyB0byB0aGUgcm91dGUncyBoYW5kbGVyOmAsXG4gICAgICAgICAgICAgICAgICAgICAgICBwYXJhbXMsXG4gICAgICAgICAgICAgICAgICAgIF0pO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgICAvLyBJZiB3ZSBkb24ndCBoYXZlIGEgaGFuZGxlciBiZWNhdXNlIHRoZXJlIHdhcyBubyBtYXRjaGluZyByb3V0ZSwgdGhlblxuICAgICAgICAvLyBmYWxsIGJhY2sgdG8gZGVmYXVsdEhhbmRsZXIgaWYgdGhhdCdzIGRlZmluZWQuXG4gICAgICAgIGNvbnN0IG1ldGhvZCA9IHJlcXVlc3QubWV0aG9kO1xuICAgICAgICBpZiAoIWhhbmRsZXIgJiYgdGhpcy5fZGVmYXVsdEhhbmRsZXJNYXAuaGFzKG1ldGhvZCkpIHtcbiAgICAgICAgICAgIGlmIChwcm9jZXNzLmVudi5OT0RFX0VOViAhPT0gJ3Byb2R1Y3Rpb24nKSB7XG4gICAgICAgICAgICAgICAgZGVidWdNZXNzYWdlcy5wdXNoKGBGYWlsZWQgdG8gZmluZCBhIG1hdGNoaW5nIHJvdXRlLiBGYWxsaW5nIGAgK1xuICAgICAgICAgICAgICAgICAgICBgYmFjayB0byB0aGUgZGVmYXVsdCBoYW5kbGVyIGZvciAke21ldGhvZH0uYCk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBoYW5kbGVyID0gdGhpcy5fZGVmYXVsdEhhbmRsZXJNYXAuZ2V0KG1ldGhvZCk7XG4gICAgICAgIH1cbiAgICAgICAgaWYgKCFoYW5kbGVyKSB7XG4gICAgICAgICAgICBpZiAocHJvY2Vzcy5lbnYuTk9ERV9FTlYgIT09ICdwcm9kdWN0aW9uJykge1xuICAgICAgICAgICAgICAgIC8vIE5vIGhhbmRsZXIgc28gV29ya2JveCB3aWxsIGRvIG5vdGhpbmcuIElmIGxvZ3MgaXMgc2V0IG9mIGRlYnVnXG4gICAgICAgICAgICAgICAgLy8gaS5lLiB2ZXJib3NlLCB3ZSBzaG91bGQgcHJpbnQgb3V0IHRoaXMgaW5mb3JtYXRpb24uXG4gICAgICAgICAgICAgICAgbG9nZ2VyLmRlYnVnKGBObyByb3V0ZSBmb3VuZCBmb3I6ICR7Z2V0RnJpZW5kbHlVUkwodXJsKX1gKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgfVxuICAgICAgICBpZiAocHJvY2Vzcy5lbnYuTk9ERV9FTlYgIT09ICdwcm9kdWN0aW9uJykge1xuICAgICAgICAgICAgLy8gV2UgaGF2ZSBhIGhhbmRsZXIsIG1lYW5pbmcgV29ya2JveCBpcyBnb2luZyB0byBoYW5kbGUgdGhlIHJvdXRlLlxuICAgICAgICAgICAgLy8gcHJpbnQgdGhlIHJvdXRpbmcgZGV0YWlscyB0byB0aGUgY29uc29sZS5cbiAgICAgICAgICAgIGxvZ2dlci5ncm91cENvbGxhcHNlZChgUm91dGVyIGlzIHJlc3BvbmRpbmcgdG86ICR7Z2V0RnJpZW5kbHlVUkwodXJsKX1gKTtcbiAgICAgICAgICAgIGRlYnVnTWVzc2FnZXMuZm9yRWFjaCgobXNnKSA9PiB7XG4gICAgICAgICAgICAgICAgaWYgKEFycmF5LmlzQXJyYXkobXNnKSkge1xuICAgICAgICAgICAgICAgICAgICBsb2dnZXIubG9nKC4uLm1zZyk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICBsb2dnZXIubG9nKG1zZyk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICBsb2dnZXIuZ3JvdXBFbmQoKTtcbiAgICAgICAgfVxuICAgICAgICAvLyBXcmFwIGluIHRyeSBhbmQgY2F0Y2ggaW4gY2FzZSB0aGUgaGFuZGxlIG1ldGhvZCB0aHJvd3MgYSBzeW5jaHJvbm91c1xuICAgICAgICAvLyBlcnJvci4gSXQgc2hvdWxkIHN0aWxsIGNhbGxiYWNrIHRvIHRoZSBjYXRjaCBoYW5kbGVyLlxuICAgICAgICBsZXQgcmVzcG9uc2VQcm9taXNlO1xuICAgICAgICB0cnkge1xuICAgICAgICAgICAgcmVzcG9uc2VQcm9taXNlID0gaGFuZGxlci5oYW5kbGUoeyB1cmwsIHJlcXVlc3QsIGV2ZW50LCBwYXJhbXMgfSk7XG4gICAgICAgIH1cbiAgICAgICAgY2F0Y2ggKGVycikge1xuICAgICAgICAgICAgcmVzcG9uc2VQcm9taXNlID0gUHJvbWlzZS5yZWplY3QoZXJyKTtcbiAgICAgICAgfVxuICAgICAgICAvLyBHZXQgcm91dGUncyBjYXRjaCBoYW5kbGVyLCBpZiBpdCBleGlzdHNcbiAgICAgICAgY29uc3QgY2F0Y2hIYW5kbGVyID0gcm91dGUgJiYgcm91dGUuY2F0Y2hIYW5kbGVyO1xuICAgICAgICBpZiAocmVzcG9uc2VQcm9taXNlIGluc3RhbmNlb2YgUHJvbWlzZSAmJlxuICAgICAgICAgICAgKHRoaXMuX2NhdGNoSGFuZGxlciB8fCBjYXRjaEhhbmRsZXIpKSB7XG4gICAgICAgICAgICByZXNwb25zZVByb21pc2UgPSByZXNwb25zZVByb21pc2UuY2F0Y2goYXN5bmMgKGVycikgPT4ge1xuICAgICAgICAgICAgICAgIC8vIElmIHRoZXJlJ3MgYSByb3V0ZSBjYXRjaCBoYW5kbGVyLCBwcm9jZXNzIHRoYXQgZmlyc3RcbiAgICAgICAgICAgICAgICBpZiAoY2F0Y2hIYW5kbGVyKSB7XG4gICAgICAgICAgICAgICAgICAgIGlmIChwcm9jZXNzLmVudi5OT0RFX0VOViAhPT0gJ3Byb2R1Y3Rpb24nKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAvLyBTdGlsbCBpbmNsdWRlIFVSTCBoZXJlIGFzIGl0IHdpbGwgYmUgYXN5bmMgZnJvbSB0aGUgY29uc29sZSBncm91cFxuICAgICAgICAgICAgICAgICAgICAgICAgLy8gYW5kIG1heSBub3QgbWFrZSBzZW5zZSB3aXRob3V0IHRoZSBVUkxcbiAgICAgICAgICAgICAgICAgICAgICAgIGxvZ2dlci5ncm91cENvbGxhcHNlZChgRXJyb3IgdGhyb3duIHdoZW4gcmVzcG9uZGluZyB0bzogYCArXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgYCAke2dldEZyaWVuZGx5VVJMKHVybCl9LiBGYWxsaW5nIGJhY2sgdG8gcm91dGUncyBDYXRjaCBIYW5kbGVyLmApO1xuICAgICAgICAgICAgICAgICAgICAgICAgbG9nZ2VyLmVycm9yKGBFcnJvciB0aHJvd24gYnk6YCwgcm91dGUpO1xuICAgICAgICAgICAgICAgICAgICAgICAgbG9nZ2VyLmVycm9yKGVycik7XG4gICAgICAgICAgICAgICAgICAgICAgICBsb2dnZXIuZ3JvdXBFbmQoKTtcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICB0cnkge1xuICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuIGF3YWl0IGNhdGNoSGFuZGxlci5oYW5kbGUoeyB1cmwsIHJlcXVlc3QsIGV2ZW50LCBwYXJhbXMgfSk7XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgY2F0Y2ggKGNhdGNoRXJyKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBpZiAoY2F0Y2hFcnIgaW5zdGFuY2VvZiBFcnJvcikge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGVyciA9IGNhdGNoRXJyO1xuICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIGlmICh0aGlzLl9jYXRjaEhhbmRsZXIpIHtcbiAgICAgICAgICAgICAgICAgICAgaWYgKHByb2Nlc3MuZW52Lk5PREVfRU5WICE9PSAncHJvZHVjdGlvbicpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIC8vIFN0aWxsIGluY2x1ZGUgVVJMIGhlcmUgYXMgaXQgd2lsbCBiZSBhc3luYyBmcm9tIHRoZSBjb25zb2xlIGdyb3VwXG4gICAgICAgICAgICAgICAgICAgICAgICAvLyBhbmQgbWF5IG5vdCBtYWtlIHNlbnNlIHdpdGhvdXQgdGhlIFVSTFxuICAgICAgICAgICAgICAgICAgICAgICAgbG9nZ2VyLmdyb3VwQ29sbGFwc2VkKGBFcnJvciB0aHJvd24gd2hlbiByZXNwb25kaW5nIHRvOiBgICtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBgICR7Z2V0RnJpZW5kbHlVUkwodXJsKX0uIEZhbGxpbmcgYmFjayB0byBnbG9iYWwgQ2F0Y2ggSGFuZGxlci5gKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIGxvZ2dlci5lcnJvcihgRXJyb3IgdGhyb3duIGJ5OmAsIHJvdXRlKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIGxvZ2dlci5lcnJvcihlcnIpO1xuICAgICAgICAgICAgICAgICAgICAgICAgbG9nZ2VyLmdyb3VwRW5kKCk7XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIHRoaXMuX2NhdGNoSGFuZGxlci5oYW5kbGUoeyB1cmwsIHJlcXVlc3QsIGV2ZW50IH0pO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB0aHJvdyBlcnI7XG4gICAgICAgICAgICB9KTtcbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gcmVzcG9uc2VQcm9taXNlO1xuICAgIH1cbiAgICAvKipcbiAgICAgKiBDaGVja3MgYSByZXF1ZXN0IGFuZCBVUkwgKGFuZCBvcHRpb25hbGx5IGFuIGV2ZW50KSBhZ2FpbnN0IHRoZSBsaXN0IG9mXG4gICAgICogcmVnaXN0ZXJlZCByb3V0ZXMsIGFuZCBpZiB0aGVyZSdzIGEgbWF0Y2gsIHJldHVybnMgdGhlIGNvcnJlc3BvbmRpbmdcbiAgICAgKiByb3V0ZSBhbG9uZyB3aXRoIGFueSBwYXJhbXMgZ2VuZXJhdGVkIGJ5IHRoZSBtYXRjaC5cbiAgICAgKlxuICAgICAqIEBwYXJhbSB7T2JqZWN0fSBvcHRpb25zXG4gICAgICogQHBhcmFtIHtVUkx9IG9wdGlvbnMudXJsXG4gICAgICogQHBhcmFtIHtib29sZWFufSBvcHRpb25zLnNhbWVPcmlnaW4gVGhlIHJlc3VsdCBvZiBjb21wYXJpbmcgYHVybC5vcmlnaW5gXG4gICAgICogICAgIGFnYWluc3QgdGhlIGN1cnJlbnQgb3JpZ2luLlxuICAgICAqIEBwYXJhbSB7UmVxdWVzdH0gb3B0aW9ucy5yZXF1ZXN0IFRoZSByZXF1ZXN0IHRvIG1hdGNoLlxuICAgICAqIEBwYXJhbSB7RXZlbnR9IG9wdGlvbnMuZXZlbnQgVGhlIGNvcnJlc3BvbmRpbmcgZXZlbnQuXG4gICAgICogQHJldHVybiB7T2JqZWN0fSBBbiBvYmplY3Qgd2l0aCBgcm91dGVgIGFuZCBgcGFyYW1zYCBwcm9wZXJ0aWVzLlxuICAgICAqICAgICBUaGV5IGFyZSBwb3B1bGF0ZWQgaWYgYSBtYXRjaGluZyByb3V0ZSB3YXMgZm91bmQgb3IgYHVuZGVmaW5lZGBcbiAgICAgKiAgICAgb3RoZXJ3aXNlLlxuICAgICAqL1xuICAgIGZpbmRNYXRjaGluZ1JvdXRlKHsgdXJsLCBzYW1lT3JpZ2luLCByZXF1ZXN0LCBldmVudCwgfSkge1xuICAgICAgICBjb25zdCByb3V0ZXMgPSB0aGlzLl9yb3V0ZXMuZ2V0KHJlcXVlc3QubWV0aG9kKSB8fCBbXTtcbiAgICAgICAgZm9yIChjb25zdCByb3V0ZSBvZiByb3V0ZXMpIHtcbiAgICAgICAgICAgIGxldCBwYXJhbXM7XG4gICAgICAgICAgICAvLyByb3V0ZS5tYXRjaCByZXR1cm5zIHR5cGUgYW55LCBub3QgcG9zc2libGUgdG8gY2hhbmdlIHJpZ2h0IG5vdy5cbiAgICAgICAgICAgIC8vIGVzbGludC1kaXNhYmxlLW5leHQtbGluZSBAdHlwZXNjcmlwdC1lc2xpbnQvbm8tdW5zYWZlLWFzc2lnbm1lbnRcbiAgICAgICAgICAgIGNvbnN0IG1hdGNoUmVzdWx0ID0gcm91dGUubWF0Y2goeyB1cmwsIHNhbWVPcmlnaW4sIHJlcXVlc3QsIGV2ZW50IH0pO1xuICAgICAgICAgICAgaWYgKG1hdGNoUmVzdWx0KSB7XG4gICAgICAgICAgICAgICAgaWYgKHByb2Nlc3MuZW52Lk5PREVfRU5WICE9PSAncHJvZHVjdGlvbicpIHtcbiAgICAgICAgICAgICAgICAgICAgLy8gV2FybiBkZXZlbG9wZXJzIHRoYXQgdXNpbmcgYW4gYXN5bmMgbWF0Y2hDYWxsYmFjayBpcyBhbG1vc3QgYWx3YXlzXG4gICAgICAgICAgICAgICAgICAgIC8vIG5vdCB0aGUgcmlnaHQgdGhpbmcgdG8gZG8uXG4gICAgICAgICAgICAgICAgICAgIGlmIChtYXRjaFJlc3VsdCBpbnN0YW5jZW9mIFByb21pc2UpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGxvZ2dlci53YXJuKGBXaGlsZSByb3V0aW5nICR7Z2V0RnJpZW5kbHlVUkwodXJsKX0sIGFuIGFzeW5jIGAgK1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGBtYXRjaENhbGxiYWNrIGZ1bmN0aW9uIHdhcyB1c2VkLiBQbGVhc2UgY29udmVydCB0aGUgYCArXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgYGZvbGxvd2luZyByb3V0ZSB0byB1c2UgYSBzeW5jaHJvbm91cyBtYXRjaENhbGxiYWNrIGZ1bmN0aW9uOmAsIHJvdXRlKTtcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAvLyBTZWUgaHR0cHM6Ly9naXRodWIuY29tL0dvb2dsZUNocm9tZS93b3JrYm94L2lzc3Vlcy8yMDc5XG4gICAgICAgICAgICAgICAgLy8gZXNsaW50LWRpc2FibGUtbmV4dC1saW5lIEB0eXBlc2NyaXB0LWVzbGludC9uby11bnNhZmUtYXNzaWdubWVudFxuICAgICAgICAgICAgICAgIHBhcmFtcyA9IG1hdGNoUmVzdWx0O1xuICAgICAgICAgICAgICAgIGlmIChBcnJheS5pc0FycmF5KHBhcmFtcykgJiYgcGFyYW1zLmxlbmd0aCA9PT0gMCkge1xuICAgICAgICAgICAgICAgICAgICAvLyBJbnN0ZWFkIG9mIHBhc3NpbmcgYW4gZW1wdHkgYXJyYXkgaW4gYXMgcGFyYW1zLCB1c2UgdW5kZWZpbmVkLlxuICAgICAgICAgICAgICAgICAgICBwYXJhbXMgPSB1bmRlZmluZWQ7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIGVsc2UgaWYgKG1hdGNoUmVzdWx0LmNvbnN0cnVjdG9yID09PSBPYmplY3QgJiYgLy8gZXNsaW50LWRpc2FibGUtbGluZVxuICAgICAgICAgICAgICAgICAgICBPYmplY3Qua2V5cyhtYXRjaFJlc3VsdCkubGVuZ3RoID09PSAwKSB7XG4gICAgICAgICAgICAgICAgICAgIC8vIEluc3RlYWQgb2YgcGFzc2luZyBhbiBlbXB0eSBvYmplY3QgaW4gYXMgcGFyYW1zLCB1c2UgdW5kZWZpbmVkLlxuICAgICAgICAgICAgICAgICAgICBwYXJhbXMgPSB1bmRlZmluZWQ7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIGVsc2UgaWYgKHR5cGVvZiBtYXRjaFJlc3VsdCA9PT0gJ2Jvb2xlYW4nKSB7XG4gICAgICAgICAgICAgICAgICAgIC8vIEZvciB0aGUgYm9vbGVhbiB2YWx1ZSB0cnVlIChyYXRoZXIgdGhhbiBqdXN0IHNvbWV0aGluZyB0cnV0aC15KSxcbiAgICAgICAgICAgICAgICAgICAgLy8gZG9uJ3Qgc2V0IHBhcmFtcy5cbiAgICAgICAgICAgICAgICAgICAgLy8gU2VlIGh0dHBzOi8vZ2l0aHViLmNvbS9Hb29nbGVDaHJvbWUvd29ya2JveC9wdWxsLzIxMzQjaXNzdWVjb21tZW50LTUxMzkyNDM1M1xuICAgICAgICAgICAgICAgICAgICBwYXJhbXMgPSB1bmRlZmluZWQ7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIC8vIFJldHVybiBlYXJseSBpZiBoYXZlIGEgbWF0Y2guXG4gICAgICAgICAgICAgICAgcmV0dXJuIHsgcm91dGUsIHBhcmFtcyB9O1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICAgIC8vIElmIG5vIG1hdGNoIHdhcyBmb3VuZCBhYm92ZSwgcmV0dXJuIGFuZCBlbXB0eSBvYmplY3QuXG4gICAgICAgIHJldHVybiB7fTtcbiAgICB9XG4gICAgLyoqXG4gICAgICogRGVmaW5lIGEgZGVmYXVsdCBgaGFuZGxlcmAgdGhhdCdzIGNhbGxlZCB3aGVuIG5vIHJvdXRlcyBleHBsaWNpdGx5XG4gICAgICogbWF0Y2ggdGhlIGluY29taW5nIHJlcXVlc3QuXG4gICAgICpcbiAgICAgKiBFYWNoIEhUVFAgbWV0aG9kICgnR0VUJywgJ1BPU1QnLCBldGMuKSBnZXRzIGl0cyBvd24gZGVmYXVsdCBoYW5kbGVyLlxuICAgICAqXG4gICAgICogV2l0aG91dCBhIGRlZmF1bHQgaGFuZGxlciwgdW5tYXRjaGVkIHJlcXVlc3RzIHdpbGwgZ28gYWdhaW5zdCB0aGVcbiAgICAgKiBuZXR3b3JrIGFzIGlmIHRoZXJlIHdlcmUgbm8gc2VydmljZSB3b3JrZXIgcHJlc2VudC5cbiAgICAgKlxuICAgICAqIEBwYXJhbSB7d29ya2JveC1yb3V0aW5nfmhhbmRsZXJDYWxsYmFja30gaGFuZGxlciBBIGNhbGxiYWNrXG4gICAgICogZnVuY3Rpb24gdGhhdCByZXR1cm5zIGEgUHJvbWlzZSByZXN1bHRpbmcgaW4gYSBSZXNwb25zZS5cbiAgICAgKiBAcGFyYW0ge3N0cmluZ30gW21ldGhvZD0nR0VUJ10gVGhlIEhUVFAgbWV0aG9kIHRvIGFzc29jaWF0ZSB3aXRoIHRoaXNcbiAgICAgKiBkZWZhdWx0IGhhbmRsZXIuIEVhY2ggbWV0aG9kIGhhcyBpdHMgb3duIGRlZmF1bHQuXG4gICAgICovXG4gICAgc2V0RGVmYXVsdEhhbmRsZXIoaGFuZGxlciwgbWV0aG9kID0gZGVmYXVsdE1ldGhvZCkge1xuICAgICAgICB0aGlzLl9kZWZhdWx0SGFuZGxlck1hcC5zZXQobWV0aG9kLCBub3JtYWxpemVIYW5kbGVyKGhhbmRsZXIpKTtcbiAgICB9XG4gICAgLyoqXG4gICAgICogSWYgYSBSb3V0ZSB0aHJvd3MgYW4gZXJyb3Igd2hpbGUgaGFuZGxpbmcgYSByZXF1ZXN0LCB0aGlzIGBoYW5kbGVyYFxuICAgICAqIHdpbGwgYmUgY2FsbGVkIGFuZCBnaXZlbiBhIGNoYW5jZSB0byBwcm92aWRlIGEgcmVzcG9uc2UuXG4gICAgICpcbiAgICAgKiBAcGFyYW0ge3dvcmtib3gtcm91dGluZ35oYW5kbGVyQ2FsbGJhY2t9IGhhbmRsZXIgQSBjYWxsYmFja1xuICAgICAqIGZ1bmN0aW9uIHRoYXQgcmV0dXJucyBhIFByb21pc2UgcmVzdWx0aW5nIGluIGEgUmVzcG9uc2UuXG4gICAgICovXG4gICAgc2V0Q2F0Y2hIYW5kbGVyKGhhbmRsZXIpIHtcbiAgICAgICAgdGhpcy5fY2F0Y2hIYW5kbGVyID0gbm9ybWFsaXplSGFuZGxlcihoYW5kbGVyKTtcbiAgICB9XG4gICAgLyoqXG4gICAgICogUmVnaXN0ZXJzIGEgcm91dGUgd2l0aCB0aGUgcm91dGVyLlxuICAgICAqXG4gICAgICogQHBhcmFtIHt3b3JrYm94LXJvdXRpbmcuUm91dGV9IHJvdXRlIFRoZSByb3V0ZSB0byByZWdpc3Rlci5cbiAgICAgKi9cbiAgICByZWdpc3RlclJvdXRlKHJvdXRlKSB7XG4gICAgICAgIGlmIChwcm9jZXNzLmVudi5OT0RFX0VOViAhPT0gJ3Byb2R1Y3Rpb24nKSB7XG4gICAgICAgICAgICBhc3NlcnQuaXNUeXBlKHJvdXRlLCAnb2JqZWN0Jywge1xuICAgICAgICAgICAgICAgIG1vZHVsZU5hbWU6ICd3b3JrYm94LXJvdXRpbmcnLFxuICAgICAgICAgICAgICAgIGNsYXNzTmFtZTogJ1JvdXRlcicsXG4gICAgICAgICAgICAgICAgZnVuY05hbWU6ICdyZWdpc3RlclJvdXRlJyxcbiAgICAgICAgICAgICAgICBwYXJhbU5hbWU6ICdyb3V0ZScsXG4gICAgICAgICAgICB9KTtcbiAgICAgICAgICAgIGFzc2VydC5oYXNNZXRob2Qocm91dGUsICdtYXRjaCcsIHtcbiAgICAgICAgICAgICAgICBtb2R1bGVOYW1lOiAnd29ya2JveC1yb3V0aW5nJyxcbiAgICAgICAgICAgICAgICBjbGFzc05hbWU6ICdSb3V0ZXInLFxuICAgICAgICAgICAgICAgIGZ1bmNOYW1lOiAncmVnaXN0ZXJSb3V0ZScsXG4gICAgICAgICAgICAgICAgcGFyYW1OYW1lOiAncm91dGUnLFxuICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICBhc3NlcnQuaXNUeXBlKHJvdXRlLmhhbmRsZXIsICdvYmplY3QnLCB7XG4gICAgICAgICAgICAgICAgbW9kdWxlTmFtZTogJ3dvcmtib3gtcm91dGluZycsXG4gICAgICAgICAgICAgICAgY2xhc3NOYW1lOiAnUm91dGVyJyxcbiAgICAgICAgICAgICAgICBmdW5jTmFtZTogJ3JlZ2lzdGVyUm91dGUnLFxuICAgICAgICAgICAgICAgIHBhcmFtTmFtZTogJ3JvdXRlJyxcbiAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgYXNzZXJ0Lmhhc01ldGhvZChyb3V0ZS5oYW5kbGVyLCAnaGFuZGxlJywge1xuICAgICAgICAgICAgICAgIG1vZHVsZU5hbWU6ICd3b3JrYm94LXJvdXRpbmcnLFxuICAgICAgICAgICAgICAgIGNsYXNzTmFtZTogJ1JvdXRlcicsXG4gICAgICAgICAgICAgICAgZnVuY05hbWU6ICdyZWdpc3RlclJvdXRlJyxcbiAgICAgICAgICAgICAgICBwYXJhbU5hbWU6ICdyb3V0ZS5oYW5kbGVyJyxcbiAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgYXNzZXJ0LmlzVHlwZShyb3V0ZS5tZXRob2QsICdzdHJpbmcnLCB7XG4gICAgICAgICAgICAgICAgbW9kdWxlTmFtZTogJ3dvcmtib3gtcm91dGluZycsXG4gICAgICAgICAgICAgICAgY2xhc3NOYW1lOiAnUm91dGVyJyxcbiAgICAgICAgICAgICAgICBmdW5jTmFtZTogJ3JlZ2lzdGVyUm91dGUnLFxuICAgICAgICAgICAgICAgIHBhcmFtTmFtZTogJ3JvdXRlLm1ldGhvZCcsXG4gICAgICAgICAgICB9KTtcbiAgICAgICAgfVxuICAgICAgICBpZiAoIXRoaXMuX3JvdXRlcy5oYXMocm91dGUubWV0aG9kKSkge1xuICAgICAgICAgICAgdGhpcy5fcm91dGVzLnNldChyb3V0ZS5tZXRob2QsIFtdKTtcbiAgICAgICAgfVxuICAgICAgICAvLyBHaXZlIHByZWNlZGVuY2UgdG8gYWxsIG9mIHRoZSBlYXJsaWVyIHJvdXRlcyBieSBhZGRpbmcgdGhpcyBhZGRpdGlvbmFsXG4gICAgICAgIC8vIHJvdXRlIHRvIHRoZSBlbmQgb2YgdGhlIGFycmF5LlxuICAgICAgICB0aGlzLl9yb3V0ZXMuZ2V0KHJvdXRlLm1ldGhvZCkucHVzaChyb3V0ZSk7XG4gICAgfVxuICAgIC8qKlxuICAgICAqIFVucmVnaXN0ZXJzIGEgcm91dGUgd2l0aCB0aGUgcm91dGVyLlxuICAgICAqXG4gICAgICogQHBhcmFtIHt3b3JrYm94LXJvdXRpbmcuUm91dGV9IHJvdXRlIFRoZSByb3V0ZSB0byB1bnJlZ2lzdGVyLlxuICAgICAqL1xuICAgIHVucmVnaXN0ZXJSb3V0ZShyb3V0ZSkge1xuICAgICAgICBpZiAoIXRoaXMuX3JvdXRlcy5oYXMocm91dGUubWV0aG9kKSkge1xuICAgICAgICAgICAgdGhyb3cgbmV3IFdvcmtib3hFcnJvcigndW5yZWdpc3Rlci1yb3V0ZS1idXQtbm90LWZvdW5kLXdpdGgtbWV0aG9kJywge1xuICAgICAgICAgICAgICAgIG1ldGhvZDogcm91dGUubWV0aG9kLFxuICAgICAgICAgICAgfSk7XG4gICAgICAgIH1cbiAgICAgICAgY29uc3Qgcm91dGVJbmRleCA9IHRoaXMuX3JvdXRlcy5nZXQocm91dGUubWV0aG9kKS5pbmRleE9mKHJvdXRlKTtcbiAgICAgICAgaWYgKHJvdXRlSW5kZXggPiAtMSkge1xuICAgICAgICAgICAgdGhpcy5fcm91dGVzLmdldChyb3V0ZS5tZXRob2QpLnNwbGljZShyb3V0ZUluZGV4LCAxKTtcbiAgICAgICAgfVxuICAgICAgICBlbHNlIHtcbiAgICAgICAgICAgIHRocm93IG5ldyBXb3JrYm94RXJyb3IoJ3VucmVnaXN0ZXItcm91dGUtcm91dGUtbm90LXJlZ2lzdGVyZWQnKTtcbiAgICAgICAgfVxuICAgIH1cbn1cbmV4cG9ydCB7IFJvdXRlciB9O1xuIiwgIi8qXG4gIENvcHlyaWdodCAyMDE5IEdvb2dsZSBMTENcblxuICBVc2Ugb2YgdGhpcyBzb3VyY2UgY29kZSBpcyBnb3Zlcm5lZCBieSBhbiBNSVQtc3R5bGVcbiAgbGljZW5zZSB0aGF0IGNhbiBiZSBmb3VuZCBpbiB0aGUgTElDRU5TRSBmaWxlIG9yIGF0XG4gIGh0dHBzOi8vb3BlbnNvdXJjZS5vcmcvbGljZW5zZXMvTUlULlxuKi9cbmltcG9ydCB7IFJvdXRlciB9IGZyb20gJy4uL1JvdXRlci5qcyc7XG5pbXBvcnQgJy4uL192ZXJzaW9uLmpzJztcbmxldCBkZWZhdWx0Um91dGVyO1xuLyoqXG4gKiBDcmVhdGVzIGEgbmV3LCBzaW5nbGV0b24gUm91dGVyIGluc3RhbmNlIGlmIG9uZSBkb2VzIG5vdCBleGlzdC4gSWYgb25lXG4gKiBkb2VzIGFscmVhZHkgZXhpc3QsIHRoYXQgaW5zdGFuY2UgaXMgcmV0dXJuZWQuXG4gKlxuICogQHByaXZhdGVcbiAqIEByZXR1cm4ge1JvdXRlcn1cbiAqL1xuZXhwb3J0IGNvbnN0IGdldE9yQ3JlYXRlRGVmYXVsdFJvdXRlciA9ICgpID0+IHtcbiAgICBpZiAoIWRlZmF1bHRSb3V0ZXIpIHtcbiAgICAgICAgZGVmYXVsdFJvdXRlciA9IG5ldyBSb3V0ZXIoKTtcbiAgICAgICAgLy8gVGhlIGhlbHBlcnMgdGhhdCB1c2UgdGhlIGRlZmF1bHQgUm91dGVyIGFzc3VtZSB0aGVzZSBsaXN0ZW5lcnMgZXhpc3QuXG4gICAgICAgIGRlZmF1bHRSb3V0ZXIuYWRkRmV0Y2hMaXN0ZW5lcigpO1xuICAgICAgICBkZWZhdWx0Um91dGVyLmFkZENhY2hlTGlzdGVuZXIoKTtcbiAgICB9XG4gICAgcmV0dXJuIGRlZmF1bHRSb3V0ZXI7XG59O1xuIiwgIi8qXG4gIENvcHlyaWdodCAyMDE5IEdvb2dsZSBMTENcblxuICBVc2Ugb2YgdGhpcyBzb3VyY2UgY29kZSBpcyBnb3Zlcm5lZCBieSBhbiBNSVQtc3R5bGVcbiAgbGljZW5zZSB0aGF0IGNhbiBiZSBmb3VuZCBpbiB0aGUgTElDRU5TRSBmaWxlIG9yIGF0XG4gIGh0dHBzOi8vb3BlbnNvdXJjZS5vcmcvbGljZW5zZXMvTUlULlxuKi9cbmltcG9ydCB7IGxvZ2dlciB9IGZyb20gJ3dvcmtib3gtY29yZS9fcHJpdmF0ZS9sb2dnZXIuanMnO1xuaW1wb3J0IHsgV29ya2JveEVycm9yIH0gZnJvbSAnd29ya2JveC1jb3JlL19wcml2YXRlL1dvcmtib3hFcnJvci5qcyc7XG5pbXBvcnQgeyBSb3V0ZSB9IGZyb20gJy4vUm91dGUuanMnO1xuaW1wb3J0IHsgUmVnRXhwUm91dGUgfSBmcm9tICcuL1JlZ0V4cFJvdXRlLmpzJztcbmltcG9ydCB7IGdldE9yQ3JlYXRlRGVmYXVsdFJvdXRlciB9IGZyb20gJy4vdXRpbHMvZ2V0T3JDcmVhdGVEZWZhdWx0Um91dGVyLmpzJztcbmltcG9ydCAnLi9fdmVyc2lvbi5qcyc7XG4vKipcbiAqIEVhc2lseSByZWdpc3RlciBhIFJlZ0V4cCwgc3RyaW5nLCBvciBmdW5jdGlvbiB3aXRoIGEgY2FjaGluZ1xuICogc3RyYXRlZ3kgdG8gYSBzaW5nbGV0b24gUm91dGVyIGluc3RhbmNlLlxuICpcbiAqIFRoaXMgbWV0aG9kIHdpbGwgZ2VuZXJhdGUgYSBSb3V0ZSBmb3IgeW91IGlmIG5lZWRlZCBhbmRcbiAqIGNhbGwge0BsaW5rIHdvcmtib3gtcm91dGluZy5Sb3V0ZXIjcmVnaXN0ZXJSb3V0ZX0uXG4gKlxuICogQHBhcmFtIHtSZWdFeHB8c3RyaW5nfHdvcmtib3gtcm91dGluZy5Sb3V0ZX5tYXRjaENhbGxiYWNrfHdvcmtib3gtcm91dGluZy5Sb3V0ZX0gY2FwdHVyZVxuICogSWYgdGhlIGNhcHR1cmUgcGFyYW0gaXMgYSBgUm91dGVgLCBhbGwgb3RoZXIgYXJndW1lbnRzIHdpbGwgYmUgaWdub3JlZC5cbiAqIEBwYXJhbSB7d29ya2JveC1yb3V0aW5nfmhhbmRsZXJDYWxsYmFja30gW2hhbmRsZXJdIEEgY2FsbGJhY2tcbiAqIGZ1bmN0aW9uIHRoYXQgcmV0dXJucyBhIFByb21pc2UgcmVzdWx0aW5nIGluIGEgUmVzcG9uc2UuIFRoaXMgcGFyYW1ldGVyXG4gKiBpcyByZXF1aXJlZCBpZiBgY2FwdHVyZWAgaXMgbm90IGEgYFJvdXRlYCBvYmplY3QuXG4gKiBAcGFyYW0ge3N0cmluZ30gW21ldGhvZD0nR0VUJ10gVGhlIEhUVFAgbWV0aG9kIHRvIG1hdGNoIHRoZSBSb3V0ZVxuICogYWdhaW5zdC5cbiAqIEByZXR1cm4ge3dvcmtib3gtcm91dGluZy5Sb3V0ZX0gVGhlIGdlbmVyYXRlZCBgUm91dGVgLlxuICpcbiAqIEBtZW1iZXJvZiB3b3JrYm94LXJvdXRpbmdcbiAqL1xuZnVuY3Rpb24gcmVnaXN0ZXJSb3V0ZShjYXB0dXJlLCBoYW5kbGVyLCBtZXRob2QpIHtcbiAgICBsZXQgcm91dGU7XG4gICAgaWYgKHR5cGVvZiBjYXB0dXJlID09PSAnc3RyaW5nJykge1xuICAgICAgICBjb25zdCBjYXB0dXJlVXJsID0gbmV3IFVSTChjYXB0dXJlLCBsb2NhdGlvbi5ocmVmKTtcbiAgICAgICAgaWYgKHByb2Nlc3MuZW52Lk5PREVfRU5WICE9PSAncHJvZHVjdGlvbicpIHtcbiAgICAgICAgICAgIGlmICghKGNhcHR1cmUuc3RhcnRzV2l0aCgnLycpIHx8IGNhcHR1cmUuc3RhcnRzV2l0aCgnaHR0cCcpKSkge1xuICAgICAgICAgICAgICAgIHRocm93IG5ldyBXb3JrYm94RXJyb3IoJ2ludmFsaWQtc3RyaW5nJywge1xuICAgICAgICAgICAgICAgICAgICBtb2R1bGVOYW1lOiAnd29ya2JveC1yb3V0aW5nJyxcbiAgICAgICAgICAgICAgICAgICAgZnVuY05hbWU6ICdyZWdpc3RlclJvdXRlJyxcbiAgICAgICAgICAgICAgICAgICAgcGFyYW1OYW1lOiAnY2FwdHVyZScsXG4gICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICAvLyBXZSB3YW50IHRvIGNoZWNrIGlmIEV4cHJlc3Mtc3R5bGUgd2lsZGNhcmRzIGFyZSBpbiB0aGUgcGF0aG5hbWUgb25seS5cbiAgICAgICAgICAgIC8vIFRPRE86IFJlbW92ZSB0aGlzIGxvZyBtZXNzYWdlIGluIHY0LlxuICAgICAgICAgICAgY29uc3QgdmFsdWVUb0NoZWNrID0gY2FwdHVyZS5zdGFydHNXaXRoKCdodHRwJylcbiAgICAgICAgICAgICAgICA/IGNhcHR1cmVVcmwucGF0aG5hbWVcbiAgICAgICAgICAgICAgICA6IGNhcHR1cmU7XG4gICAgICAgICAgICAvLyBTZWUgaHR0cHM6Ly9naXRodWIuY29tL3BpbGxhcmpzL3BhdGgtdG8tcmVnZXhwI3BhcmFtZXRlcnNcbiAgICAgICAgICAgIGNvbnN0IHdpbGRjYXJkcyA9ICdbKjo/K10nO1xuICAgICAgICAgICAgaWYgKG5ldyBSZWdFeHAoYCR7d2lsZGNhcmRzfWApLmV4ZWModmFsdWVUb0NoZWNrKSkge1xuICAgICAgICAgICAgICAgIGxvZ2dlci5kZWJ1ZyhgVGhlICckY2FwdHVyZScgcGFyYW1ldGVyIGNvbnRhaW5zIGFuIEV4cHJlc3Mtc3R5bGUgd2lsZGNhcmQgYCArXG4gICAgICAgICAgICAgICAgICAgIGBjaGFyYWN0ZXIgKCR7d2lsZGNhcmRzfSkuIFN0cmluZ3MgYXJlIG5vdyBhbHdheXMgaW50ZXJwcmV0ZWQgYXMgYCArXG4gICAgICAgICAgICAgICAgICAgIGBleGFjdCBtYXRjaGVzOyB1c2UgYSBSZWdFeHAgZm9yIHBhcnRpYWwgb3Igd2lsZGNhcmQgbWF0Y2hlcy5gKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgICBjb25zdCBtYXRjaENhbGxiYWNrID0gKHsgdXJsIH0pID0+IHtcbiAgICAgICAgICAgIGlmIChwcm9jZXNzLmVudi5OT0RFX0VOViAhPT0gJ3Byb2R1Y3Rpb24nKSB7XG4gICAgICAgICAgICAgICAgaWYgKHVybC5wYXRobmFtZSA9PT0gY2FwdHVyZVVybC5wYXRobmFtZSAmJlxuICAgICAgICAgICAgICAgICAgICB1cmwub3JpZ2luICE9PSBjYXB0dXJlVXJsLm9yaWdpbikge1xuICAgICAgICAgICAgICAgICAgICBsb2dnZXIuZGVidWcoYCR7Y2FwdHVyZX0gb25seSBwYXJ0aWFsbHkgbWF0Y2hlcyB0aGUgY3Jvc3Mtb3JpZ2luIFVSTCBgICtcbiAgICAgICAgICAgICAgICAgICAgICAgIGAke3VybC50b1N0cmluZygpfS4gVGhpcyByb3V0ZSB3aWxsIG9ubHkgaGFuZGxlIGNyb3NzLW9yaWdpbiByZXF1ZXN0cyBgICtcbiAgICAgICAgICAgICAgICAgICAgICAgIGBpZiB0aGV5IG1hdGNoIHRoZSBlbnRpcmUgVVJMLmApO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIHJldHVybiB1cmwuaHJlZiA9PT0gY2FwdHVyZVVybC5ocmVmO1xuICAgICAgICB9O1xuICAgICAgICAvLyBJZiBgY2FwdHVyZWAgaXMgYSBzdHJpbmcgdGhlbiBgaGFuZGxlcmAgYW5kIGBtZXRob2RgIG11c3QgYmUgcHJlc2VudC5cbiAgICAgICAgcm91dGUgPSBuZXcgUm91dGUobWF0Y2hDYWxsYmFjaywgaGFuZGxlciwgbWV0aG9kKTtcbiAgICB9XG4gICAgZWxzZSBpZiAoY2FwdHVyZSBpbnN0YW5jZW9mIFJlZ0V4cCkge1xuICAgICAgICAvLyBJZiBgY2FwdHVyZWAgaXMgYSBgUmVnRXhwYCB0aGVuIGBoYW5kbGVyYCBhbmQgYG1ldGhvZGAgbXVzdCBiZSBwcmVzZW50LlxuICAgICAgICByb3V0ZSA9IG5ldyBSZWdFeHBSb3V0ZShjYXB0dXJlLCBoYW5kbGVyLCBtZXRob2QpO1xuICAgIH1cbiAgICBlbHNlIGlmICh0eXBlb2YgY2FwdHVyZSA9PT0gJ2Z1bmN0aW9uJykge1xuICAgICAgICAvLyBJZiBgY2FwdHVyZWAgaXMgYSBmdW5jdGlvbiB0aGVuIGBoYW5kbGVyYCBhbmQgYG1ldGhvZGAgbXVzdCBiZSBwcmVzZW50LlxuICAgICAgICByb3V0ZSA9IG5ldyBSb3V0ZShjYXB0dXJlLCBoYW5kbGVyLCBtZXRob2QpO1xuICAgIH1cbiAgICBlbHNlIGlmIChjYXB0dXJlIGluc3RhbmNlb2YgUm91dGUpIHtcbiAgICAgICAgcm91dGUgPSBjYXB0dXJlO1xuICAgIH1cbiAgICBlbHNlIHtcbiAgICAgICAgdGhyb3cgbmV3IFdvcmtib3hFcnJvcigndW5zdXBwb3J0ZWQtcm91dGUtdHlwZScsIHtcbiAgICAgICAgICAgIG1vZHVsZU5hbWU6ICd3b3JrYm94LXJvdXRpbmcnLFxuICAgICAgICAgICAgZnVuY05hbWU6ICdyZWdpc3RlclJvdXRlJyxcbiAgICAgICAgICAgIHBhcmFtTmFtZTogJ2NhcHR1cmUnLFxuICAgICAgICB9KTtcbiAgICB9XG4gICAgY29uc3QgZGVmYXVsdFJvdXRlciA9IGdldE9yQ3JlYXRlRGVmYXVsdFJvdXRlcigpO1xuICAgIGRlZmF1bHRSb3V0ZXIucmVnaXN0ZXJSb3V0ZShyb3V0ZSk7XG4gICAgcmV0dXJuIHJvdXRlO1xufVxuZXhwb3J0IHsgcmVnaXN0ZXJSb3V0ZSB9O1xuIiwgIi8qXG4gIENvcHlyaWdodCAyMDE4IEdvb2dsZSBMTENcblxuICBVc2Ugb2YgdGhpcyBzb3VyY2UgY29kZSBpcyBnb3Zlcm5lZCBieSBhbiBNSVQtc3R5bGVcbiAgbGljZW5zZSB0aGF0IGNhbiBiZSBmb3VuZCBpbiB0aGUgTElDRU5TRSBmaWxlIG9yIGF0XG4gIGh0dHBzOi8vb3BlbnNvdXJjZS5vcmcvbGljZW5zZXMvTUlULlxuKi9cbmltcG9ydCAnLi4vX3ZlcnNpb24uanMnO1xuLyoqXG4gKiBSZW1vdmVzIGFueSBVUkwgc2VhcmNoIHBhcmFtZXRlcnMgdGhhdCBzaG91bGQgYmUgaWdub3JlZC5cbiAqXG4gKiBAcGFyYW0ge1VSTH0gdXJsT2JqZWN0IFRoZSBvcmlnaW5hbCBVUkwuXG4gKiBAcGFyYW0ge0FycmF5PFJlZ0V4cD59IGlnbm9yZVVSTFBhcmFtZXRlcnNNYXRjaGluZyBSZWdFeHBzIHRvIHRlc3QgYWdhaW5zdFxuICogZWFjaCBzZWFyY2ggcGFyYW1ldGVyIG5hbWUuIE1hdGNoZXMgbWVhbiB0aGF0IHRoZSBzZWFyY2ggcGFyYW1ldGVyIHNob3VsZCBiZVxuICogaWdub3JlZC5cbiAqIEByZXR1cm4ge1VSTH0gVGhlIFVSTCB3aXRoIGFueSBpZ25vcmVkIHNlYXJjaCBwYXJhbWV0ZXJzIHJlbW92ZWQuXG4gKlxuICogQHByaXZhdGVcbiAqIEBtZW1iZXJvZiB3b3JrYm94LXByZWNhY2hpbmdcbiAqL1xuZXhwb3J0IGZ1bmN0aW9uIHJlbW92ZUlnbm9yZWRTZWFyY2hQYXJhbXModXJsT2JqZWN0LCBpZ25vcmVVUkxQYXJhbWV0ZXJzTWF0Y2hpbmcgPSBbXSkge1xuICAgIC8vIENvbnZlcnQgdGhlIGl0ZXJhYmxlIGludG8gYW4gYXJyYXkgYXQgdGhlIHN0YXJ0IG9mIHRoZSBsb29wIHRvIG1ha2Ugc3VyZVxuICAgIC8vIGRlbGV0aW9uIGRvZXNuJ3QgbWVzcyB1cCBpdGVyYXRpb24uXG4gICAgZm9yIChjb25zdCBwYXJhbU5hbWUgb2YgWy4uLnVybE9iamVjdC5zZWFyY2hQYXJhbXMua2V5cygpXSkge1xuICAgICAgICBpZiAoaWdub3JlVVJMUGFyYW1ldGVyc01hdGNoaW5nLnNvbWUoKHJlZ0V4cCkgPT4gcmVnRXhwLnRlc3QocGFyYW1OYW1lKSkpIHtcbiAgICAgICAgICAgIHVybE9iamVjdC5zZWFyY2hQYXJhbXMuZGVsZXRlKHBhcmFtTmFtZSk7XG4gICAgICAgIH1cbiAgICB9XG4gICAgcmV0dXJuIHVybE9iamVjdDtcbn1cbiIsICIvKlxuICBDb3B5cmlnaHQgMjAxOSBHb29nbGUgTExDXG5cbiAgVXNlIG9mIHRoaXMgc291cmNlIGNvZGUgaXMgZ292ZXJuZWQgYnkgYW4gTUlULXN0eWxlXG4gIGxpY2Vuc2UgdGhhdCBjYW4gYmUgZm91bmQgaW4gdGhlIExJQ0VOU0UgZmlsZSBvciBhdFxuICBodHRwczovL29wZW5zb3VyY2Uub3JnL2xpY2Vuc2VzL01JVC5cbiovXG5pbXBvcnQgeyByZW1vdmVJZ25vcmVkU2VhcmNoUGFyYW1zIH0gZnJvbSAnLi9yZW1vdmVJZ25vcmVkU2VhcmNoUGFyYW1zLmpzJztcbmltcG9ydCAnLi4vX3ZlcnNpb24uanMnO1xuLyoqXG4gKiBHZW5lcmF0b3IgZnVuY3Rpb24gdGhhdCB5aWVsZHMgcG9zc2libGUgdmFyaWF0aW9ucyBvbiB0aGUgb3JpZ2luYWwgVVJMIHRvXG4gKiBjaGVjaywgb25lIGF0IGEgdGltZS5cbiAqXG4gKiBAcGFyYW0ge3N0cmluZ30gdXJsXG4gKiBAcGFyYW0ge09iamVjdH0gb3B0aW9uc1xuICpcbiAqIEBwcml2YXRlXG4gKiBAbWVtYmVyb2Ygd29ya2JveC1wcmVjYWNoaW5nXG4gKi9cbmV4cG9ydCBmdW5jdGlvbiogZ2VuZXJhdGVVUkxWYXJpYXRpb25zKHVybCwgeyBpZ25vcmVVUkxQYXJhbWV0ZXJzTWF0Y2hpbmcgPSBbL151dG1fLywgL15mYmNsaWQkL10sIGRpcmVjdG9yeUluZGV4ID0gJ2luZGV4Lmh0bWwnLCBjbGVhblVSTHMgPSB0cnVlLCB1cmxNYW5pcHVsYXRpb24sIH0gPSB7fSkge1xuICAgIGNvbnN0IHVybE9iamVjdCA9IG5ldyBVUkwodXJsLCBsb2NhdGlvbi5ocmVmKTtcbiAgICB1cmxPYmplY3QuaGFzaCA9ICcnO1xuICAgIHlpZWxkIHVybE9iamVjdC5ocmVmO1xuICAgIGNvbnN0IHVybFdpdGhvdXRJZ25vcmVkUGFyYW1zID0gcmVtb3ZlSWdub3JlZFNlYXJjaFBhcmFtcyh1cmxPYmplY3QsIGlnbm9yZVVSTFBhcmFtZXRlcnNNYXRjaGluZyk7XG4gICAgeWllbGQgdXJsV2l0aG91dElnbm9yZWRQYXJhbXMuaHJlZjtcbiAgICBpZiAoZGlyZWN0b3J5SW5kZXggJiYgdXJsV2l0aG91dElnbm9yZWRQYXJhbXMucGF0aG5hbWUuZW5kc1dpdGgoJy8nKSkge1xuICAgICAgICBjb25zdCBkaXJlY3RvcnlVUkwgPSBuZXcgVVJMKHVybFdpdGhvdXRJZ25vcmVkUGFyYW1zLmhyZWYpO1xuICAgICAgICBkaXJlY3RvcnlVUkwucGF0aG5hbWUgKz0gZGlyZWN0b3J5SW5kZXg7XG4gICAgICAgIHlpZWxkIGRpcmVjdG9yeVVSTC5ocmVmO1xuICAgIH1cbiAgICBpZiAoY2xlYW5VUkxzKSB7XG4gICAgICAgIGNvbnN0IGNsZWFuVVJMID0gbmV3IFVSTCh1cmxXaXRob3V0SWdub3JlZFBhcmFtcy5ocmVmKTtcbiAgICAgICAgY2xlYW5VUkwucGF0aG5hbWUgKz0gJy5odG1sJztcbiAgICAgICAgeWllbGQgY2xlYW5VUkwuaHJlZjtcbiAgICB9XG4gICAgaWYgKHVybE1hbmlwdWxhdGlvbikge1xuICAgICAgICBjb25zdCBhZGRpdGlvbmFsVVJMcyA9IHVybE1hbmlwdWxhdGlvbih7IHVybDogdXJsT2JqZWN0IH0pO1xuICAgICAgICBmb3IgKGNvbnN0IHVybFRvQXR0ZW1wdCBvZiBhZGRpdGlvbmFsVVJMcykge1xuICAgICAgICAgICAgeWllbGQgdXJsVG9BdHRlbXB0LmhyZWY7XG4gICAgICAgIH1cbiAgICB9XG59XG4iLCAiLypcbiAgQ29weXJpZ2h0IDIwMjAgR29vZ2xlIExMQ1xuXG4gIFVzZSBvZiB0aGlzIHNvdXJjZSBjb2RlIGlzIGdvdmVybmVkIGJ5IGFuIE1JVC1zdHlsZVxuICBsaWNlbnNlIHRoYXQgY2FuIGJlIGZvdW5kIGluIHRoZSBMSUNFTlNFIGZpbGUgb3IgYXRcbiAgaHR0cHM6Ly9vcGVuc291cmNlLm9yZy9saWNlbnNlcy9NSVQuXG4qL1xuaW1wb3J0IHsgbG9nZ2VyIH0gZnJvbSAnd29ya2JveC1jb3JlL19wcml2YXRlL2xvZ2dlci5qcyc7XG5pbXBvcnQgeyBnZXRGcmllbmRseVVSTCB9IGZyb20gJ3dvcmtib3gtY29yZS9fcHJpdmF0ZS9nZXRGcmllbmRseVVSTC5qcyc7XG5pbXBvcnQgeyBSb3V0ZSB9IGZyb20gJ3dvcmtib3gtcm91dGluZy9Sb3V0ZS5qcyc7XG5pbXBvcnQgeyBnZW5lcmF0ZVVSTFZhcmlhdGlvbnMgfSBmcm9tICcuL3V0aWxzL2dlbmVyYXRlVVJMVmFyaWF0aW9ucy5qcyc7XG5pbXBvcnQgJy4vX3ZlcnNpb24uanMnO1xuLyoqXG4gKiBBIHN1YmNsYXNzIG9mIHtAbGluayB3b3JrYm94LXJvdXRpbmcuUm91dGV9IHRoYXQgdGFrZXMgYVxuICoge0BsaW5rIHdvcmtib3gtcHJlY2FjaGluZy5QcmVjYWNoZUNvbnRyb2xsZXJ9XG4gKiBpbnN0YW5jZSBhbmQgdXNlcyBpdCB0byBtYXRjaCBpbmNvbWluZyByZXF1ZXN0cyBhbmQgaGFuZGxlIGZldGNoaW5nXG4gKiByZXNwb25zZXMgZnJvbSB0aGUgcHJlY2FjaGUuXG4gKlxuICogQG1lbWJlcm9mIHdvcmtib3gtcHJlY2FjaGluZ1xuICogQGV4dGVuZHMgd29ya2JveC1yb3V0aW5nLlJvdXRlXG4gKi9cbmNsYXNzIFByZWNhY2hlUm91dGUgZXh0ZW5kcyBSb3V0ZSB7XG4gICAgLyoqXG4gICAgICogQHBhcmFtIHtQcmVjYWNoZUNvbnRyb2xsZXJ9IHByZWNhY2hlQ29udHJvbGxlciBBIGBQcmVjYWNoZUNvbnRyb2xsZXJgXG4gICAgICogaW5zdGFuY2UgdXNlZCB0byBib3RoIG1hdGNoIHJlcXVlc3RzIGFuZCByZXNwb25kIHRvIGZldGNoIGV2ZW50cy5cbiAgICAgKiBAcGFyYW0ge09iamVjdH0gW29wdGlvbnNdIE9wdGlvbnMgdG8gY29udHJvbCBob3cgcmVxdWVzdHMgYXJlIG1hdGNoZWRcbiAgICAgKiBhZ2FpbnN0IHRoZSBsaXN0IG9mIHByZWNhY2hlZCBVUkxzLlxuICAgICAqIEBwYXJhbSB7c3RyaW5nfSBbb3B0aW9ucy5kaXJlY3RvcnlJbmRleD1pbmRleC5odG1sXSBUaGUgYGRpcmVjdG9yeUluZGV4YCB3aWxsXG4gICAgICogY2hlY2sgY2FjaGUgZW50cmllcyBmb3IgYSBVUkxzIGVuZGluZyB3aXRoICcvJyB0byBzZWUgaWYgdGhlcmUgaXMgYSBoaXQgd2hlblxuICAgICAqIGFwcGVuZGluZyB0aGUgYGRpcmVjdG9yeUluZGV4YCB2YWx1ZS5cbiAgICAgKiBAcGFyYW0ge0FycmF5PFJlZ0V4cD59IFtvcHRpb25zLmlnbm9yZVVSTFBhcmFtZXRlcnNNYXRjaGluZz1bL151dG1fLywgL15mYmNsaWQkL11dIEFuXG4gICAgICogYXJyYXkgb2YgcmVnZXgncyB0byByZW1vdmUgc2VhcmNoIHBhcmFtcyB3aGVuIGxvb2tpbmcgZm9yIGEgY2FjaGUgbWF0Y2guXG4gICAgICogQHBhcmFtIHtib29sZWFufSBbb3B0aW9ucy5jbGVhblVSTHM9dHJ1ZV0gVGhlIGBjbGVhblVSTHNgIG9wdGlvbiB3aWxsXG4gICAgICogY2hlY2sgdGhlIGNhY2hlIGZvciB0aGUgVVJMIHdpdGggYSBgLmh0bWxgIGFkZGVkIHRvIHRoZSBlbmQgb2YgdGhlIGVuZC5cbiAgICAgKiBAcGFyYW0ge3dvcmtib3gtcHJlY2FjaGluZ351cmxNYW5pcHVsYXRpb259IFtvcHRpb25zLnVybE1hbmlwdWxhdGlvbl1cbiAgICAgKiBUaGlzIGlzIGEgZnVuY3Rpb24gdGhhdCBzaG91bGQgdGFrZSBhIFVSTCBhbmQgcmV0dXJuIGFuIGFycmF5IG9mXG4gICAgICogYWx0ZXJuYXRpdmUgVVJMcyB0aGF0IHNob3VsZCBiZSBjaGVja2VkIGZvciBwcmVjYWNoZSBtYXRjaGVzLlxuICAgICAqL1xuICAgIGNvbnN0cnVjdG9yKHByZWNhY2hlQ29udHJvbGxlciwgb3B0aW9ucykge1xuICAgICAgICBjb25zdCBtYXRjaCA9ICh7IHJlcXVlc3QsIH0pID0+IHtcbiAgICAgICAgICAgIGNvbnN0IHVybHNUb0NhY2hlS2V5cyA9IHByZWNhY2hlQ29udHJvbGxlci5nZXRVUkxzVG9DYWNoZUtleXMoKTtcbiAgICAgICAgICAgIGZvciAoY29uc3QgcG9zc2libGVVUkwgb2YgZ2VuZXJhdGVVUkxWYXJpYXRpb25zKHJlcXVlc3QudXJsLCBvcHRpb25zKSkge1xuICAgICAgICAgICAgICAgIGNvbnN0IGNhY2hlS2V5ID0gdXJsc1RvQ2FjaGVLZXlzLmdldChwb3NzaWJsZVVSTCk7XG4gICAgICAgICAgICAgICAgaWYgKGNhY2hlS2V5KSB7XG4gICAgICAgICAgICAgICAgICAgIGNvbnN0IGludGVncml0eSA9IHByZWNhY2hlQ29udHJvbGxlci5nZXRJbnRlZ3JpdHlGb3JDYWNoZUtleShjYWNoZUtleSk7XG4gICAgICAgICAgICAgICAgICAgIHJldHVybiB7IGNhY2hlS2V5LCBpbnRlZ3JpdHkgfTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBpZiAocHJvY2Vzcy5lbnYuTk9ERV9FTlYgIT09ICdwcm9kdWN0aW9uJykge1xuICAgICAgICAgICAgICAgIGxvZ2dlci5kZWJ1ZyhgUHJlY2FjaGluZyBkaWQgbm90IGZpbmQgYSBtYXRjaCBmb3IgYCArIGdldEZyaWVuZGx5VVJMKHJlcXVlc3QudXJsKSk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICByZXR1cm47XG4gICAgICAgIH07XG4gICAgICAgIHN1cGVyKG1hdGNoLCBwcmVjYWNoZUNvbnRyb2xsZXIuc3RyYXRlZ3kpO1xuICAgIH1cbn1cbmV4cG9ydCB7IFByZWNhY2hlUm91dGUgfTtcbiIsICIvKlxuICBDb3B5cmlnaHQgMjAxOSBHb29nbGUgTExDXG4gIFVzZSBvZiB0aGlzIHNvdXJjZSBjb2RlIGlzIGdvdmVybmVkIGJ5IGFuIE1JVC1zdHlsZVxuICBsaWNlbnNlIHRoYXQgY2FuIGJlIGZvdW5kIGluIHRoZSBMSUNFTlNFIGZpbGUgb3IgYXRcbiAgaHR0cHM6Ly9vcGVuc291cmNlLm9yZy9saWNlbnNlcy9NSVQuXG4qL1xuaW1wb3J0IHsgcmVnaXN0ZXJSb3V0ZSB9IGZyb20gJ3dvcmtib3gtcm91dGluZy9yZWdpc3RlclJvdXRlLmpzJztcbmltcG9ydCB7IGdldE9yQ3JlYXRlUHJlY2FjaGVDb250cm9sbGVyIH0gZnJvbSAnLi91dGlscy9nZXRPckNyZWF0ZVByZWNhY2hlQ29udHJvbGxlci5qcyc7XG5pbXBvcnQgeyBQcmVjYWNoZVJvdXRlIH0gZnJvbSAnLi9QcmVjYWNoZVJvdXRlLmpzJztcbmltcG9ydCAnLi9fdmVyc2lvbi5qcyc7XG4vKipcbiAqIEFkZCBhIGBmZXRjaGAgbGlzdGVuZXIgdG8gdGhlIHNlcnZpY2Ugd29ya2VyIHRoYXQgd2lsbFxuICogcmVzcG9uZCB0b1xuICogW25ldHdvcmsgcmVxdWVzdHNde0BsaW5rIGh0dHBzOi8vZGV2ZWxvcGVyLm1vemlsbGEub3JnL2VuLVVTL2RvY3MvV2ViL0FQSS9TZXJ2aWNlX1dvcmtlcl9BUEkvVXNpbmdfU2VydmljZV9Xb3JrZXJzI0N1c3RvbV9yZXNwb25zZXNfdG9fcmVxdWVzdHN9XG4gKiB3aXRoIHByZWNhY2hlZCBhc3NldHMuXG4gKlxuICogUmVxdWVzdHMgZm9yIGFzc2V0cyB0aGF0IGFyZW4ndCBwcmVjYWNoZWQsIHRoZSBgRmV0Y2hFdmVudGAgd2lsbCBub3QgYmVcbiAqIHJlc3BvbmRlZCB0bywgYWxsb3dpbmcgdGhlIGV2ZW50IHRvIGZhbGwgdGhyb3VnaCB0byBvdGhlciBgZmV0Y2hgIGV2ZW50XG4gKiBsaXN0ZW5lcnMuXG4gKlxuICogQHBhcmFtIHtPYmplY3R9IFtvcHRpb25zXSBTZWUgdGhlIHtAbGluayB3b3JrYm94LXByZWNhY2hpbmcuUHJlY2FjaGVSb3V0ZX1cbiAqIG9wdGlvbnMuXG4gKlxuICogQG1lbWJlcm9mIHdvcmtib3gtcHJlY2FjaGluZ1xuICovXG5mdW5jdGlvbiBhZGRSb3V0ZShvcHRpb25zKSB7XG4gICAgY29uc3QgcHJlY2FjaGVDb250cm9sbGVyID0gZ2V0T3JDcmVhdGVQcmVjYWNoZUNvbnRyb2xsZXIoKTtcbiAgICBjb25zdCBwcmVjYWNoZVJvdXRlID0gbmV3IFByZWNhY2hlUm91dGUocHJlY2FjaGVDb250cm9sbGVyLCBvcHRpb25zKTtcbiAgICByZWdpc3RlclJvdXRlKHByZWNhY2hlUm91dGUpO1xufVxuZXhwb3J0IHsgYWRkUm91dGUgfTtcbiIsICIvKlxuICBDb3B5cmlnaHQgMjAxOCBHb29nbGUgTExDXG5cbiAgVXNlIG9mIHRoaXMgc291cmNlIGNvZGUgaXMgZ292ZXJuZWQgYnkgYW4gTUlULXN0eWxlXG4gIGxpY2Vuc2UgdGhhdCBjYW4gYmUgZm91bmQgaW4gdGhlIExJQ0VOU0UgZmlsZSBvciBhdFxuICBodHRwczovL29wZW5zb3VyY2Uub3JnL2xpY2Vuc2VzL01JVC5cbiovXG5pbXBvcnQgJy4uL192ZXJzaW9uLmpzJztcbmNvbnN0IFNVQlNUUklOR19UT19GSU5EID0gJy1wcmVjYWNoZS0nO1xuLyoqXG4gKiBDbGVhbnMgdXAgaW5jb21wYXRpYmxlIHByZWNhY2hlcyB0aGF0IHdlcmUgY3JlYXRlZCBieSBvbGRlciB2ZXJzaW9ucyBvZlxuICogV29ya2JveCwgYnkgYSBzZXJ2aWNlIHdvcmtlciByZWdpc3RlcmVkIHVuZGVyIHRoZSBjdXJyZW50IHNjb3BlLlxuICpcbiAqIFRoaXMgaXMgbWVhbnQgdG8gYmUgY2FsbGVkIGFzIHBhcnQgb2YgdGhlIGBhY3RpdmF0ZWAgZXZlbnQuXG4gKlxuICogVGhpcyBzaG91bGQgYmUgc2FmZSB0byB1c2UgYXMgbG9uZyBhcyB5b3UgZG9uJ3QgaW5jbHVkZSBgc3Vic3RyaW5nVG9GaW5kYFxuICogKGRlZmF1bHRpbmcgdG8gYC1wcmVjYWNoZS1gKSBpbiB5b3VyIG5vbi1wcmVjYWNoZSBjYWNoZSBuYW1lcy5cbiAqXG4gKiBAcGFyYW0ge3N0cmluZ30gY3VycmVudFByZWNhY2hlTmFtZSBUaGUgY2FjaGUgbmFtZSBjdXJyZW50bHkgaW4gdXNlIGZvclxuICogcHJlY2FjaGluZy4gVGhpcyBjYWNoZSB3b24ndCBiZSBkZWxldGVkLlxuICogQHBhcmFtIHtzdHJpbmd9IFtzdWJzdHJpbmdUb0ZpbmQ9Jy1wcmVjYWNoZS0nXSBDYWNoZSBuYW1lcyB3aGljaCBpbmNsdWRlIHRoaXNcbiAqIHN1YnN0cmluZyB3aWxsIGJlIGRlbGV0ZWQgKGV4Y2x1ZGluZyBgY3VycmVudFByZWNhY2hlTmFtZWApLlxuICogQHJldHVybiB7QXJyYXk8c3RyaW5nPn0gQSBsaXN0IG9mIGFsbCB0aGUgY2FjaGUgbmFtZXMgdGhhdCB3ZXJlIGRlbGV0ZWQuXG4gKlxuICogQHByaXZhdGVcbiAqIEBtZW1iZXJvZiB3b3JrYm94LXByZWNhY2hpbmdcbiAqL1xuY29uc3QgZGVsZXRlT3V0ZGF0ZWRDYWNoZXMgPSBhc3luYyAoY3VycmVudFByZWNhY2hlTmFtZSwgc3Vic3RyaW5nVG9GaW5kID0gU1VCU1RSSU5HX1RPX0ZJTkQpID0+IHtcbiAgICBjb25zdCBjYWNoZU5hbWVzID0gYXdhaXQgc2VsZi5jYWNoZXMua2V5cygpO1xuICAgIGNvbnN0IGNhY2hlTmFtZXNUb0RlbGV0ZSA9IGNhY2hlTmFtZXMuZmlsdGVyKChjYWNoZU5hbWUpID0+IHtcbiAgICAgICAgcmV0dXJuIChjYWNoZU5hbWUuaW5jbHVkZXMoc3Vic3RyaW5nVG9GaW5kKSAmJlxuICAgICAgICAgICAgY2FjaGVOYW1lLmluY2x1ZGVzKHNlbGYucmVnaXN0cmF0aW9uLnNjb3BlKSAmJlxuICAgICAgICAgICAgY2FjaGVOYW1lICE9PSBjdXJyZW50UHJlY2FjaGVOYW1lKTtcbiAgICB9KTtcbiAgICBhd2FpdCBQcm9taXNlLmFsbChjYWNoZU5hbWVzVG9EZWxldGUubWFwKChjYWNoZU5hbWUpID0+IHNlbGYuY2FjaGVzLmRlbGV0ZShjYWNoZU5hbWUpKSk7XG4gICAgcmV0dXJuIGNhY2hlTmFtZXNUb0RlbGV0ZTtcbn07XG5leHBvcnQgeyBkZWxldGVPdXRkYXRlZENhY2hlcyB9O1xuIiwgIi8qXG4gIENvcHlyaWdodCAyMDE5IEdvb2dsZSBMTENcblxuICBVc2Ugb2YgdGhpcyBzb3VyY2UgY29kZSBpcyBnb3Zlcm5lZCBieSBhbiBNSVQtc3R5bGVcbiAgbGljZW5zZSB0aGF0IGNhbiBiZSBmb3VuZCBpbiB0aGUgTElDRU5TRSBmaWxlIG9yIGF0XG4gIGh0dHBzOi8vb3BlbnNvdXJjZS5vcmcvbGljZW5zZXMvTUlULlxuKi9cbmltcG9ydCB7IGNhY2hlTmFtZXMgfSBmcm9tICd3b3JrYm94LWNvcmUvX3ByaXZhdGUvY2FjaGVOYW1lcy5qcyc7XG5pbXBvcnQgeyBsb2dnZXIgfSBmcm9tICd3b3JrYm94LWNvcmUvX3ByaXZhdGUvbG9nZ2VyLmpzJztcbmltcG9ydCB7IGRlbGV0ZU91dGRhdGVkQ2FjaGVzIH0gZnJvbSAnLi91dGlscy9kZWxldGVPdXRkYXRlZENhY2hlcy5qcyc7XG5pbXBvcnQgJy4vX3ZlcnNpb24uanMnO1xuLyoqXG4gKiBBZGRzIGFuIGBhY3RpdmF0ZWAgZXZlbnQgbGlzdGVuZXIgd2hpY2ggd2lsbCBjbGVhbiB1cCBpbmNvbXBhdGlibGVcbiAqIHByZWNhY2hlcyB0aGF0IHdlcmUgY3JlYXRlZCBieSBvbGRlciB2ZXJzaW9ucyBvZiBXb3JrYm94LlxuICpcbiAqIEBtZW1iZXJvZiB3b3JrYm94LXByZWNhY2hpbmdcbiAqL1xuZnVuY3Rpb24gY2xlYW51cE91dGRhdGVkQ2FjaGVzKCkge1xuICAgIC8vIFNlZSBodHRwczovL2dpdGh1Yi5jb20vTWljcm9zb2Z0L1R5cGVTY3JpcHQvaXNzdWVzLzI4MzU3I2lzc3VlY29tbWVudC00MzY0ODQ3MDVcbiAgICBzZWxmLmFkZEV2ZW50TGlzdGVuZXIoJ2FjdGl2YXRlJywgKChldmVudCkgPT4ge1xuICAgICAgICBjb25zdCBjYWNoZU5hbWUgPSBjYWNoZU5hbWVzLmdldFByZWNhY2hlTmFtZSgpO1xuICAgICAgICBldmVudC53YWl0VW50aWwoZGVsZXRlT3V0ZGF0ZWRDYWNoZXMoY2FjaGVOYW1lKS50aGVuKChjYWNoZXNEZWxldGVkKSA9PiB7XG4gICAgICAgICAgICBpZiAocHJvY2Vzcy5lbnYuTk9ERV9FTlYgIT09ICdwcm9kdWN0aW9uJykge1xuICAgICAgICAgICAgICAgIGlmIChjYWNoZXNEZWxldGVkLmxlbmd0aCA+IDApIHtcbiAgICAgICAgICAgICAgICAgICAgbG9nZ2VyLmxvZyhgVGhlIGZvbGxvd2luZyBvdXQtb2YtZGF0ZSBwcmVjYWNoZXMgd2VyZSBjbGVhbmVkIHVwIGAgK1xuICAgICAgICAgICAgICAgICAgICAgICAgYGF1dG9tYXRpY2FsbHk6YCwgY2FjaGVzRGVsZXRlZCk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICB9KSk7XG4gICAgfSkpO1xufVxuZXhwb3J0IHsgY2xlYW51cE91dGRhdGVkQ2FjaGVzIH07XG4iLCAiLypcbiAgQ29weXJpZ2h0IDIwMTkgR29vZ2xlIExMQ1xuXG4gIFVzZSBvZiB0aGlzIHNvdXJjZSBjb2RlIGlzIGdvdmVybmVkIGJ5IGFuIE1JVC1zdHlsZVxuICBsaWNlbnNlIHRoYXQgY2FuIGJlIGZvdW5kIGluIHRoZSBMSUNFTlNFIGZpbGUgb3IgYXRcbiAgaHR0cHM6Ly9vcGVuc291cmNlLm9yZy9saWNlbnNlcy9NSVQuXG4qL1xuaW1wb3J0IHsgZ2V0T3JDcmVhdGVQcmVjYWNoZUNvbnRyb2xsZXIgfSBmcm9tICcuL3V0aWxzL2dldE9yQ3JlYXRlUHJlY2FjaGVDb250cm9sbGVyLmpzJztcbmltcG9ydCAnLi9fdmVyc2lvbi5qcyc7XG4vKipcbiAqIEFkZHMgaXRlbXMgdG8gdGhlIHByZWNhY2hlIGxpc3QsIHJlbW92aW5nIGFueSBkdXBsaWNhdGVzIGFuZFxuICogc3RvcmVzIHRoZSBmaWxlcyBpbiB0aGVcbiAqIHtAbGluayB3b3JrYm94LWNvcmUuY2FjaGVOYW1lc3xcInByZWNhY2hlIGNhY2hlXCJ9IHdoZW4gdGhlIHNlcnZpY2VcbiAqIHdvcmtlciBpbnN0YWxscy5cbiAqXG4gKiBUaGlzIG1ldGhvZCBjYW4gYmUgY2FsbGVkIG11bHRpcGxlIHRpbWVzLlxuICpcbiAqIFBsZWFzZSBub3RlOiBUaGlzIG1ldGhvZCAqKndpbGwgbm90Kiogc2VydmUgYW55IG9mIHRoZSBjYWNoZWQgZmlsZXMgZm9yIHlvdS5cbiAqIEl0IG9ubHkgcHJlY2FjaGVzIGZpbGVzLiBUbyByZXNwb25kIHRvIGEgbmV0d29yayByZXF1ZXN0IHlvdSBjYWxsXG4gKiB7QGxpbmsgd29ya2JveC1wcmVjYWNoaW5nLmFkZFJvdXRlfS5cbiAqXG4gKiBJZiB5b3UgaGF2ZSBhIHNpbmdsZSBhcnJheSBvZiBmaWxlcyB0byBwcmVjYWNoZSwgeW91IGNhbiBqdXN0IGNhbGxcbiAqIHtAbGluayB3b3JrYm94LXByZWNhY2hpbmcucHJlY2FjaGVBbmRSb3V0ZX0uXG4gKlxuICogQHBhcmFtIHtBcnJheTxPYmplY3R8c3RyaW5nPn0gW2VudHJpZXM9W11dIEFycmF5IG9mIGVudHJpZXMgdG8gcHJlY2FjaGUuXG4gKlxuICogQG1lbWJlcm9mIHdvcmtib3gtcHJlY2FjaGluZ1xuICovXG5mdW5jdGlvbiBwcmVjYWNoZShlbnRyaWVzKSB7XG4gICAgY29uc3QgcHJlY2FjaGVDb250cm9sbGVyID0gZ2V0T3JDcmVhdGVQcmVjYWNoZUNvbnRyb2xsZXIoKTtcbiAgICBwcmVjYWNoZUNvbnRyb2xsZXIucHJlY2FjaGUoZW50cmllcyk7XG59XG5leHBvcnQgeyBwcmVjYWNoZSB9O1xuIiwgIi8qXG4gIENvcHlyaWdodCAyMDE5IEdvb2dsZSBMTENcblxuICBVc2Ugb2YgdGhpcyBzb3VyY2UgY29kZSBpcyBnb3Zlcm5lZCBieSBhbiBNSVQtc3R5bGVcbiAgbGljZW5zZSB0aGF0IGNhbiBiZSBmb3VuZCBpbiB0aGUgTElDRU5TRSBmaWxlIG9yIGF0XG4gIGh0dHBzOi8vb3BlbnNvdXJjZS5vcmcvbGljZW5zZXMvTUlULlxuKi9cbmltcG9ydCB7IGFkZFJvdXRlIH0gZnJvbSAnLi9hZGRSb3V0ZS5qcyc7XG5pbXBvcnQgeyBwcmVjYWNoZSB9IGZyb20gJy4vcHJlY2FjaGUuanMnO1xuaW1wb3J0ICcuL192ZXJzaW9uLmpzJztcbi8qKlxuICogVGhpcyBtZXRob2Qgd2lsbCBhZGQgZW50cmllcyB0byB0aGUgcHJlY2FjaGUgbGlzdCBhbmQgYWRkIGEgcm91dGUgdG9cbiAqIHJlc3BvbmQgdG8gZmV0Y2ggZXZlbnRzLlxuICpcbiAqIFRoaXMgaXMgYSBjb252ZW5pZW5jZSBtZXRob2QgdGhhdCB3aWxsIGNhbGxcbiAqIHtAbGluayB3b3JrYm94LXByZWNhY2hpbmcucHJlY2FjaGV9IGFuZFxuICoge0BsaW5rIHdvcmtib3gtcHJlY2FjaGluZy5hZGRSb3V0ZX0gaW4gYSBzaW5nbGUgY2FsbC5cbiAqXG4gKiBAcGFyYW0ge0FycmF5PE9iamVjdHxzdHJpbmc+fSBlbnRyaWVzIEFycmF5IG9mIGVudHJpZXMgdG8gcHJlY2FjaGUuXG4gKiBAcGFyYW0ge09iamVjdH0gW29wdGlvbnNdIFNlZSB0aGVcbiAqIHtAbGluayB3b3JrYm94LXByZWNhY2hpbmcuUHJlY2FjaGVSb3V0ZX0gb3B0aW9ucy5cbiAqXG4gKiBAbWVtYmVyb2Ygd29ya2JveC1wcmVjYWNoaW5nXG4gKi9cbmZ1bmN0aW9uIHByZWNhY2hlQW5kUm91dGUoZW50cmllcywgb3B0aW9ucykge1xuICAgIHByZWNhY2hlKGVudHJpZXMpO1xuICAgIGFkZFJvdXRlKG9wdGlvbnMpO1xufVxuZXhwb3J0IHsgcHJlY2FjaGVBbmRSb3V0ZSB9O1xuIiwgIi8qXG4gIENvcHlyaWdodCAyMDE4IEdvb2dsZSBMTENcblxuICBVc2Ugb2YgdGhpcyBzb3VyY2UgY29kZSBpcyBnb3Zlcm5lZCBieSBhbiBNSVQtc3R5bGVcbiAgbGljZW5zZSB0aGF0IGNhbiBiZSBmb3VuZCBpbiB0aGUgTElDRU5TRSBmaWxlIG9yIGF0XG4gIGh0dHBzOi8vb3BlbnNvdXJjZS5vcmcvbGljZW5zZXMvTUlULlxuKi9cbmltcG9ydCB7IGxvZ2dlciB9IGZyb20gJ3dvcmtib3gtY29yZS9fcHJpdmF0ZS9sb2dnZXIuanMnO1xuaW1wb3J0IHsgZ2V0RnJpZW5kbHlVUkwgfSBmcm9tICd3b3JrYm94LWNvcmUvX3ByaXZhdGUvZ2V0RnJpZW5kbHlVUkwuanMnO1xuaW1wb3J0ICcuLi9fdmVyc2lvbi5qcyc7XG5leHBvcnQgY29uc3QgbWVzc2FnZXMgPSB7XG4gICAgc3RyYXRlZ3lTdGFydDogKHN0cmF0ZWd5TmFtZSwgcmVxdWVzdCkgPT4gYFVzaW5nICR7c3RyYXRlZ3lOYW1lfSB0byByZXNwb25kIHRvICcke2dldEZyaWVuZGx5VVJMKHJlcXVlc3QudXJsKX0nYCxcbiAgICBwcmludEZpbmFsUmVzcG9uc2U6IChyZXNwb25zZSkgPT4ge1xuICAgICAgICBpZiAocmVzcG9uc2UpIHtcbiAgICAgICAgICAgIGxvZ2dlci5ncm91cENvbGxhcHNlZChgVmlldyB0aGUgZmluYWwgcmVzcG9uc2UgaGVyZS5gKTtcbiAgICAgICAgICAgIGxvZ2dlci5sb2cocmVzcG9uc2UgfHwgJ1tObyByZXNwb25zZSByZXR1cm5lZF0nKTtcbiAgICAgICAgICAgIGxvZ2dlci5ncm91cEVuZCgpO1xuICAgICAgICB9XG4gICAgfSxcbn07XG4iLCAiLypcbiAgQ29weXJpZ2h0IDIwMTggR29vZ2xlIExMQ1xuXG4gIFVzZSBvZiB0aGlzIHNvdXJjZSBjb2RlIGlzIGdvdmVybmVkIGJ5IGFuIE1JVC1zdHlsZVxuICBsaWNlbnNlIHRoYXQgY2FuIGJlIGZvdW5kIGluIHRoZSBMSUNFTlNFIGZpbGUgb3IgYXRcbiAgaHR0cHM6Ly9vcGVuc291cmNlLm9yZy9saWNlbnNlcy9NSVQuXG4qL1xuaW1wb3J0ICcuLi9fdmVyc2lvbi5qcyc7XG5leHBvcnQgY29uc3QgY2FjaGVPa0FuZE9wYXF1ZVBsdWdpbiA9IHtcbiAgICAvKipcbiAgICAgKiBSZXR1cm5zIGEgdmFsaWQgcmVzcG9uc2UgKHRvIGFsbG93IGNhY2hpbmcpIGlmIHRoZSBzdGF0dXMgaXMgMjAwIChPSykgb3JcbiAgICAgKiAwIChvcGFxdWUpLlxuICAgICAqXG4gICAgICogQHBhcmFtIHtPYmplY3R9IG9wdGlvbnNcbiAgICAgKiBAcGFyYW0ge1Jlc3BvbnNlfSBvcHRpb25zLnJlc3BvbnNlXG4gICAgICogQHJldHVybiB7UmVzcG9uc2V8bnVsbH1cbiAgICAgKlxuICAgICAqIEBwcml2YXRlXG4gICAgICovXG4gICAgY2FjaGVXaWxsVXBkYXRlOiBhc3luYyAoeyByZXNwb25zZSB9KSA9PiB7XG4gICAgICAgIGlmIChyZXNwb25zZS5zdGF0dXMgPT09IDIwMCB8fCByZXNwb25zZS5zdGF0dXMgPT09IDApIHtcbiAgICAgICAgICAgIHJldHVybiByZXNwb25zZTtcbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gbnVsbDtcbiAgICB9LFxufTtcbiIsICIvKlxuICBDb3B5cmlnaHQgMjAxOCBHb29nbGUgTExDXG5cbiAgVXNlIG9mIHRoaXMgc291cmNlIGNvZGUgaXMgZ292ZXJuZWQgYnkgYW4gTUlULXN0eWxlXG4gIGxpY2Vuc2UgdGhhdCBjYW4gYmUgZm91bmQgaW4gdGhlIExJQ0VOU0UgZmlsZSBvciBhdFxuICBodHRwczovL29wZW5zb3VyY2Uub3JnL2xpY2Vuc2VzL01JVC5cbiovXG5pbXBvcnQgeyBhc3NlcnQgfSBmcm9tICd3b3JrYm94LWNvcmUvX3ByaXZhdGUvYXNzZXJ0LmpzJztcbmltcG9ydCB7IGxvZ2dlciB9IGZyb20gJ3dvcmtib3gtY29yZS9fcHJpdmF0ZS9sb2dnZXIuanMnO1xuaW1wb3J0IHsgV29ya2JveEVycm9yIH0gZnJvbSAnd29ya2JveC1jb3JlL19wcml2YXRlL1dvcmtib3hFcnJvci5qcyc7XG5pbXBvcnQgeyBjYWNoZU9rQW5kT3BhcXVlUGx1Z2luIH0gZnJvbSAnLi9wbHVnaW5zL2NhY2hlT2tBbmRPcGFxdWVQbHVnaW4uanMnO1xuaW1wb3J0IHsgU3RyYXRlZ3kgfSBmcm9tICcuL1N0cmF0ZWd5LmpzJztcbmltcG9ydCB7IG1lc3NhZ2VzIH0gZnJvbSAnLi91dGlscy9tZXNzYWdlcy5qcyc7XG5pbXBvcnQgJy4vX3ZlcnNpb24uanMnO1xuLyoqXG4gKiBBbiBpbXBsZW1lbnRhdGlvbiBvZiBhXG4gKiBbc3RhbGUtd2hpbGUtcmV2YWxpZGF0ZV0oaHR0cHM6Ly9kZXZlbG9wZXIuY2hyb21lLmNvbS9kb2NzL3dvcmtib3gvY2FjaGluZy1zdHJhdGVnaWVzLW92ZXJ2aWV3LyNzdGFsZS13aGlsZS1yZXZhbGlkYXRlKVxuICogcmVxdWVzdCBzdHJhdGVneS5cbiAqXG4gKiBSZXNvdXJjZXMgYXJlIHJlcXVlc3RlZCBmcm9tIGJvdGggdGhlIGNhY2hlIGFuZCB0aGUgbmV0d29yayBpbiBwYXJhbGxlbC5cbiAqIFRoZSBzdHJhdGVneSB3aWxsIHJlc3BvbmQgd2l0aCB0aGUgY2FjaGVkIHZlcnNpb24gaWYgYXZhaWxhYmxlLCBvdGhlcndpc2VcbiAqIHdhaXQgZm9yIHRoZSBuZXR3b3JrIHJlc3BvbnNlLiBUaGUgY2FjaGUgaXMgdXBkYXRlZCB3aXRoIHRoZSBuZXR3b3JrIHJlc3BvbnNlXG4gKiB3aXRoIGVhY2ggc3VjY2Vzc2Z1bCByZXF1ZXN0LlxuICpcbiAqIEJ5IGRlZmF1bHQsIHRoaXMgc3RyYXRlZ3kgd2lsbCBjYWNoZSByZXNwb25zZXMgd2l0aCBhIDIwMCBzdGF0dXMgY29kZSBhc1xuICogd2VsbCBhcyBbb3BhcXVlIHJlc3BvbnNlc10oaHR0cHM6Ly9kZXZlbG9wZXIuY2hyb21lLmNvbS9kb2NzL3dvcmtib3gvY2FjaGluZy1yZXNvdXJjZXMtZHVyaW5nLXJ1bnRpbWUvI29wYXF1ZS1yZXNwb25zZXMpLlxuICogT3BhcXVlIHJlc3BvbnNlcyBhcmUgY3Jvc3Mtb3JpZ2luIHJlcXVlc3RzIHdoZXJlIHRoZSByZXNwb25zZSBkb2Vzbid0XG4gKiBzdXBwb3J0IFtDT1JTXShodHRwczovL2VuYWJsZS1jb3JzLm9yZy8pLlxuICpcbiAqIElmIHRoZSBuZXR3b3JrIHJlcXVlc3QgZmFpbHMsIGFuZCB0aGVyZSBpcyBubyBjYWNoZSBtYXRjaCwgdGhpcyB3aWxsIHRocm93XG4gKiBhIGBXb3JrYm94RXJyb3JgIGV4Y2VwdGlvbi5cbiAqXG4gKiBAZXh0ZW5kcyB3b3JrYm94LXN0cmF0ZWdpZXMuU3RyYXRlZ3lcbiAqIEBtZW1iZXJvZiB3b3JrYm94LXN0cmF0ZWdpZXNcbiAqL1xuY2xhc3MgU3RhbGVXaGlsZVJldmFsaWRhdGUgZXh0ZW5kcyBTdHJhdGVneSB7XG4gICAgLyoqXG4gICAgICogQHBhcmFtIHtPYmplY3R9IFtvcHRpb25zXVxuICAgICAqIEBwYXJhbSB7c3RyaW5nfSBbb3B0aW9ucy5jYWNoZU5hbWVdIENhY2hlIG5hbWUgdG8gc3RvcmUgYW5kIHJldHJpZXZlXG4gICAgICogcmVxdWVzdHMuIERlZmF1bHRzIHRvIGNhY2hlIG5hbWVzIHByb3ZpZGVkIGJ5XG4gICAgICoge0BsaW5rIHdvcmtib3gtY29yZS5jYWNoZU5hbWVzfS5cbiAgICAgKiBAcGFyYW0ge0FycmF5PE9iamVjdD59IFtvcHRpb25zLnBsdWdpbnNdIFtQbHVnaW5zXXtAbGluayBodHRwczovL2RldmVsb3BlcnMuZ29vZ2xlLmNvbS93ZWIvdG9vbHMvd29ya2JveC9ndWlkZXMvdXNpbmctcGx1Z2luc31cbiAgICAgKiB0byB1c2UgaW4gY29uanVuY3Rpb24gd2l0aCB0aGlzIGNhY2hpbmcgc3RyYXRlZ3kuXG4gICAgICogQHBhcmFtIHtPYmplY3R9IFtvcHRpb25zLmZldGNoT3B0aW9uc10gVmFsdWVzIHBhc3NlZCBhbG9uZyB0byB0aGVcbiAgICAgKiBbYGluaXRgXShodHRwczovL2RldmVsb3Blci5tb3ppbGxhLm9yZy9lbi1VUy9kb2NzL1dlYi9BUEkvV2luZG93T3JXb3JrZXJHbG9iYWxTY29wZS9mZXRjaCNQYXJhbWV0ZXJzKVxuICAgICAqIG9mIFtub24tbmF2aWdhdGlvbl0oaHR0cHM6Ly9naXRodWIuY29tL0dvb2dsZUNocm9tZS93b3JrYm94L2lzc3Vlcy8xNzk2KVxuICAgICAqIGBmZXRjaCgpYCByZXF1ZXN0cyBtYWRlIGJ5IHRoaXMgc3RyYXRlZ3kuXG4gICAgICogQHBhcmFtIHtPYmplY3R9IFtvcHRpb25zLm1hdGNoT3B0aW9uc10gW2BDYWNoZVF1ZXJ5T3B0aW9uc2BdKGh0dHBzOi8vdzNjLmdpdGh1Yi5pby9TZXJ2aWNlV29ya2VyLyNkaWN0ZGVmLWNhY2hlcXVlcnlvcHRpb25zKVxuICAgICAqL1xuICAgIGNvbnN0cnVjdG9yKG9wdGlvbnMgPSB7fSkge1xuICAgICAgICBzdXBlcihvcHRpb25zKTtcbiAgICAgICAgLy8gSWYgdGhpcyBpbnN0YW5jZSBjb250YWlucyBubyBwbHVnaW5zIHdpdGggYSAnY2FjaGVXaWxsVXBkYXRlJyBjYWxsYmFjayxcbiAgICAgICAgLy8gcHJlcGVuZCB0aGUgYGNhY2hlT2tBbmRPcGFxdWVQbHVnaW5gIHBsdWdpbiB0byB0aGUgcGx1Z2lucyBsaXN0LlxuICAgICAgICBpZiAoIXRoaXMucGx1Z2lucy5zb21lKChwKSA9PiAnY2FjaGVXaWxsVXBkYXRlJyBpbiBwKSkge1xuICAgICAgICAgICAgdGhpcy5wbHVnaW5zLnVuc2hpZnQoY2FjaGVPa0FuZE9wYXF1ZVBsdWdpbik7XG4gICAgICAgIH1cbiAgICB9XG4gICAgLyoqXG4gICAgICogQHByaXZhdGVcbiAgICAgKiBAcGFyYW0ge1JlcXVlc3R8c3RyaW5nfSByZXF1ZXN0IEEgcmVxdWVzdCB0byBydW4gdGhpcyBzdHJhdGVneSBmb3IuXG4gICAgICogQHBhcmFtIHt3b3JrYm94LXN0cmF0ZWdpZXMuU3RyYXRlZ3lIYW5kbGVyfSBoYW5kbGVyIFRoZSBldmVudCB0aGF0XG4gICAgICogICAgIHRyaWdnZXJlZCB0aGUgcmVxdWVzdC5cbiAgICAgKiBAcmV0dXJuIHtQcm9taXNlPFJlc3BvbnNlPn1cbiAgICAgKi9cbiAgICBhc3luYyBfaGFuZGxlKHJlcXVlc3QsIGhhbmRsZXIpIHtcbiAgICAgICAgY29uc3QgbG9ncyA9IFtdO1xuICAgICAgICBpZiAocHJvY2Vzcy5lbnYuTk9ERV9FTlYgIT09ICdwcm9kdWN0aW9uJykge1xuICAgICAgICAgICAgYXNzZXJ0LmlzSW5zdGFuY2UocmVxdWVzdCwgUmVxdWVzdCwge1xuICAgICAgICAgICAgICAgIG1vZHVsZU5hbWU6ICd3b3JrYm94LXN0cmF0ZWdpZXMnLFxuICAgICAgICAgICAgICAgIGNsYXNzTmFtZTogdGhpcy5jb25zdHJ1Y3Rvci5uYW1lLFxuICAgICAgICAgICAgICAgIGZ1bmNOYW1lOiAnaGFuZGxlJyxcbiAgICAgICAgICAgICAgICBwYXJhbU5hbWU6ICdyZXF1ZXN0JyxcbiAgICAgICAgICAgIH0pO1xuICAgICAgICB9XG4gICAgICAgIGNvbnN0IGZldGNoQW5kQ2FjaGVQcm9taXNlID0gaGFuZGxlci5mZXRjaEFuZENhY2hlUHV0KHJlcXVlc3QpLmNhdGNoKCgpID0+IHtcbiAgICAgICAgICAgIC8vIFN3YWxsb3cgdGhpcyBlcnJvciBiZWNhdXNlIGEgJ25vLXJlc3BvbnNlJyBlcnJvciB3aWxsIGJlIHRocm93biBpblxuICAgICAgICAgICAgLy8gbWFpbiBoYW5kbGVyIHJldHVybiBmbG93LiBUaGlzIHdpbGwgYmUgaW4gdGhlIGB3YWl0VW50aWwoKWAgZmxvdy5cbiAgICAgICAgfSk7XG4gICAgICAgIHZvaWQgaGFuZGxlci53YWl0VW50aWwoZmV0Y2hBbmRDYWNoZVByb21pc2UpO1xuICAgICAgICBsZXQgcmVzcG9uc2UgPSBhd2FpdCBoYW5kbGVyLmNhY2hlTWF0Y2gocmVxdWVzdCk7XG4gICAgICAgIGxldCBlcnJvcjtcbiAgICAgICAgaWYgKHJlc3BvbnNlKSB7XG4gICAgICAgICAgICBpZiAocHJvY2Vzcy5lbnYuTk9ERV9FTlYgIT09ICdwcm9kdWN0aW9uJykge1xuICAgICAgICAgICAgICAgIGxvZ3MucHVzaChgRm91bmQgYSBjYWNoZWQgcmVzcG9uc2UgaW4gdGhlICcke3RoaXMuY2FjaGVOYW1lfSdgICtcbiAgICAgICAgICAgICAgICAgICAgYCBjYWNoZS4gV2lsbCB1cGRhdGUgd2l0aCB0aGUgbmV0d29yayByZXNwb25zZSBpbiB0aGUgYmFja2dyb3VuZC5gKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgICBlbHNlIHtcbiAgICAgICAgICAgIGlmIChwcm9jZXNzLmVudi5OT0RFX0VOViAhPT0gJ3Byb2R1Y3Rpb24nKSB7XG4gICAgICAgICAgICAgICAgbG9ncy5wdXNoKGBObyByZXNwb25zZSBmb3VuZCBpbiB0aGUgJyR7dGhpcy5jYWNoZU5hbWV9JyBjYWNoZS4gYCArXG4gICAgICAgICAgICAgICAgICAgIGBXaWxsIHdhaXQgZm9yIHRoZSBuZXR3b3JrIHJlc3BvbnNlLmApO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgdHJ5IHtcbiAgICAgICAgICAgICAgICAvLyBOT1RFKHBoaWxpcHdhbHRvbik6IFJlYWxseSBhbm5veWluZyB0aGF0IHdlIGhhdmUgdG8gdHlwZSBjYXN0IGhlcmUuXG4gICAgICAgICAgICAgICAgLy8gaHR0cHM6Ly9naXRodWIuY29tL21pY3Jvc29mdC9UeXBlU2NyaXB0L2lzc3Vlcy8yMDAwNlxuICAgICAgICAgICAgICAgIHJlc3BvbnNlID0gKGF3YWl0IGZldGNoQW5kQ2FjaGVQcm9taXNlKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGNhdGNoIChlcnIpIHtcbiAgICAgICAgICAgICAgICBpZiAoZXJyIGluc3RhbmNlb2YgRXJyb3IpIHtcbiAgICAgICAgICAgICAgICAgICAgZXJyb3IgPSBlcnI7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICAgIGlmIChwcm9jZXNzLmVudi5OT0RFX0VOViAhPT0gJ3Byb2R1Y3Rpb24nKSB7XG4gICAgICAgICAgICBsb2dnZXIuZ3JvdXBDb2xsYXBzZWQobWVzc2FnZXMuc3RyYXRlZ3lTdGFydCh0aGlzLmNvbnN0cnVjdG9yLm5hbWUsIHJlcXVlc3QpKTtcbiAgICAgICAgICAgIGZvciAoY29uc3QgbG9nIG9mIGxvZ3MpIHtcbiAgICAgICAgICAgICAgICBsb2dnZXIubG9nKGxvZyk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBtZXNzYWdlcy5wcmludEZpbmFsUmVzcG9uc2UocmVzcG9uc2UpO1xuICAgICAgICAgICAgbG9nZ2VyLmdyb3VwRW5kKCk7XG4gICAgICAgIH1cbiAgICAgICAgaWYgKCFyZXNwb25zZSkge1xuICAgICAgICAgICAgdGhyb3cgbmV3IFdvcmtib3hFcnJvcignbm8tcmVzcG9uc2UnLCB7IHVybDogcmVxdWVzdC51cmwsIGVycm9yIH0pO1xuICAgICAgICB9XG4gICAgICAgIHJldHVybiByZXNwb25zZTtcbiAgICB9XG59XG5leHBvcnQgeyBTdGFsZVdoaWxlUmV2YWxpZGF0ZSB9O1xuIiwgImNvbnN0IGluc3RhbmNlT2ZBbnkgPSAob2JqZWN0LCBjb25zdHJ1Y3RvcnMpID0+IGNvbnN0cnVjdG9ycy5zb21lKChjKSA9PiBvYmplY3QgaW5zdGFuY2VvZiBjKTtcblxubGV0IGlkYlByb3h5YWJsZVR5cGVzO1xubGV0IGN1cnNvckFkdmFuY2VNZXRob2RzO1xuLy8gVGhpcyBpcyBhIGZ1bmN0aW9uIHRvIHByZXZlbnQgaXQgdGhyb3dpbmcgdXAgaW4gbm9kZSBlbnZpcm9ubWVudHMuXG5mdW5jdGlvbiBnZXRJZGJQcm94eWFibGVUeXBlcygpIHtcbiAgICByZXR1cm4gKGlkYlByb3h5YWJsZVR5cGVzIHx8XG4gICAgICAgIChpZGJQcm94eWFibGVUeXBlcyA9IFtcbiAgICAgICAgICAgIElEQkRhdGFiYXNlLFxuICAgICAgICAgICAgSURCT2JqZWN0U3RvcmUsXG4gICAgICAgICAgICBJREJJbmRleCxcbiAgICAgICAgICAgIElEQkN1cnNvcixcbiAgICAgICAgICAgIElEQlRyYW5zYWN0aW9uLFxuICAgICAgICBdKSk7XG59XG4vLyBUaGlzIGlzIGEgZnVuY3Rpb24gdG8gcHJldmVudCBpdCB0aHJvd2luZyB1cCBpbiBub2RlIGVudmlyb25tZW50cy5cbmZ1bmN0aW9uIGdldEN1cnNvckFkdmFuY2VNZXRob2RzKCkge1xuICAgIHJldHVybiAoY3Vyc29yQWR2YW5jZU1ldGhvZHMgfHxcbiAgICAgICAgKGN1cnNvckFkdmFuY2VNZXRob2RzID0gW1xuICAgICAgICAgICAgSURCQ3Vyc29yLnByb3RvdHlwZS5hZHZhbmNlLFxuICAgICAgICAgICAgSURCQ3Vyc29yLnByb3RvdHlwZS5jb250aW51ZSxcbiAgICAgICAgICAgIElEQkN1cnNvci5wcm90b3R5cGUuY29udGludWVQcmltYXJ5S2V5LFxuICAgICAgICBdKSk7XG59XG5jb25zdCBjdXJzb3JSZXF1ZXN0TWFwID0gbmV3IFdlYWtNYXAoKTtcbmNvbnN0IHRyYW5zYWN0aW9uRG9uZU1hcCA9IG5ldyBXZWFrTWFwKCk7XG5jb25zdCB0cmFuc2FjdGlvblN0b3JlTmFtZXNNYXAgPSBuZXcgV2Vha01hcCgpO1xuY29uc3QgdHJhbnNmb3JtQ2FjaGUgPSBuZXcgV2Vha01hcCgpO1xuY29uc3QgcmV2ZXJzZVRyYW5zZm9ybUNhY2hlID0gbmV3IFdlYWtNYXAoKTtcbmZ1bmN0aW9uIHByb21pc2lmeVJlcXVlc3QocmVxdWVzdCkge1xuICAgIGNvbnN0IHByb21pc2UgPSBuZXcgUHJvbWlzZSgocmVzb2x2ZSwgcmVqZWN0KSA9PiB7XG4gICAgICAgIGNvbnN0IHVubGlzdGVuID0gKCkgPT4ge1xuICAgICAgICAgICAgcmVxdWVzdC5yZW1vdmVFdmVudExpc3RlbmVyKCdzdWNjZXNzJywgc3VjY2Vzcyk7XG4gICAgICAgICAgICByZXF1ZXN0LnJlbW92ZUV2ZW50TGlzdGVuZXIoJ2Vycm9yJywgZXJyb3IpO1xuICAgICAgICB9O1xuICAgICAgICBjb25zdCBzdWNjZXNzID0gKCkgPT4ge1xuICAgICAgICAgICAgcmVzb2x2ZSh3cmFwKHJlcXVlc3QucmVzdWx0KSk7XG4gICAgICAgICAgICB1bmxpc3RlbigpO1xuICAgICAgICB9O1xuICAgICAgICBjb25zdCBlcnJvciA9ICgpID0+IHtcbiAgICAgICAgICAgIHJlamVjdChyZXF1ZXN0LmVycm9yKTtcbiAgICAgICAgICAgIHVubGlzdGVuKCk7XG4gICAgICAgIH07XG4gICAgICAgIHJlcXVlc3QuYWRkRXZlbnRMaXN0ZW5lcignc3VjY2VzcycsIHN1Y2Nlc3MpO1xuICAgICAgICByZXF1ZXN0LmFkZEV2ZW50TGlzdGVuZXIoJ2Vycm9yJywgZXJyb3IpO1xuICAgIH0pO1xuICAgIHByb21pc2VcbiAgICAgICAgLnRoZW4oKHZhbHVlKSA9PiB7XG4gICAgICAgIC8vIFNpbmNlIGN1cnNvcmluZyByZXVzZXMgdGhlIElEQlJlcXVlc3QgKCpzaWdoKiksIHdlIGNhY2hlIGl0IGZvciBsYXRlciByZXRyaWV2YWxcbiAgICAgICAgLy8gKHNlZSB3cmFwRnVuY3Rpb24pLlxuICAgICAgICBpZiAodmFsdWUgaW5zdGFuY2VvZiBJREJDdXJzb3IpIHtcbiAgICAgICAgICAgIGN1cnNvclJlcXVlc3RNYXAuc2V0KHZhbHVlLCByZXF1ZXN0KTtcbiAgICAgICAgfVxuICAgICAgICAvLyBDYXRjaGluZyB0byBhdm9pZCBcIlVuY2F1Z2h0IFByb21pc2UgZXhjZXB0aW9uc1wiXG4gICAgfSlcbiAgICAgICAgLmNhdGNoKCgpID0+IHsgfSk7XG4gICAgLy8gVGhpcyBtYXBwaW5nIGV4aXN0cyBpbiByZXZlcnNlVHJhbnNmb3JtQ2FjaGUgYnV0IGRvZXNuJ3QgZG9lc24ndCBleGlzdCBpbiB0cmFuc2Zvcm1DYWNoZS4gVGhpc1xuICAgIC8vIGlzIGJlY2F1c2Ugd2UgY3JlYXRlIG1hbnkgcHJvbWlzZXMgZnJvbSBhIHNpbmdsZSBJREJSZXF1ZXN0LlxuICAgIHJldmVyc2VUcmFuc2Zvcm1DYWNoZS5zZXQocHJvbWlzZSwgcmVxdWVzdCk7XG4gICAgcmV0dXJuIHByb21pc2U7XG59XG5mdW5jdGlvbiBjYWNoZURvbmVQcm9taXNlRm9yVHJhbnNhY3Rpb24odHgpIHtcbiAgICAvLyBFYXJseSBiYWlsIGlmIHdlJ3ZlIGFscmVhZHkgY3JlYXRlZCBhIGRvbmUgcHJvbWlzZSBmb3IgdGhpcyB0cmFuc2FjdGlvbi5cbiAgICBpZiAodHJhbnNhY3Rpb25Eb25lTWFwLmhhcyh0eCkpXG4gICAgICAgIHJldHVybjtcbiAgICBjb25zdCBkb25lID0gbmV3IFByb21pc2UoKHJlc29sdmUsIHJlamVjdCkgPT4ge1xuICAgICAgICBjb25zdCB1bmxpc3RlbiA9ICgpID0+IHtcbiAgICAgICAgICAgIHR4LnJlbW92ZUV2ZW50TGlzdGVuZXIoJ2NvbXBsZXRlJywgY29tcGxldGUpO1xuICAgICAgICAgICAgdHgucmVtb3ZlRXZlbnRMaXN0ZW5lcignZXJyb3InLCBlcnJvcik7XG4gICAgICAgICAgICB0eC5yZW1vdmVFdmVudExpc3RlbmVyKCdhYm9ydCcsIGVycm9yKTtcbiAgICAgICAgfTtcbiAgICAgICAgY29uc3QgY29tcGxldGUgPSAoKSA9PiB7XG4gICAgICAgICAgICByZXNvbHZlKCk7XG4gICAgICAgICAgICB1bmxpc3RlbigpO1xuICAgICAgICB9O1xuICAgICAgICBjb25zdCBlcnJvciA9ICgpID0+IHtcbiAgICAgICAgICAgIHJlamVjdCh0eC5lcnJvciB8fCBuZXcgRE9NRXhjZXB0aW9uKCdBYm9ydEVycm9yJywgJ0Fib3J0RXJyb3InKSk7XG4gICAgICAgICAgICB1bmxpc3RlbigpO1xuICAgICAgICB9O1xuICAgICAgICB0eC5hZGRFdmVudExpc3RlbmVyKCdjb21wbGV0ZScsIGNvbXBsZXRlKTtcbiAgICAgICAgdHguYWRkRXZlbnRMaXN0ZW5lcignZXJyb3InLCBlcnJvcik7XG4gICAgICAgIHR4LmFkZEV2ZW50TGlzdGVuZXIoJ2Fib3J0JywgZXJyb3IpO1xuICAgIH0pO1xuICAgIC8vIENhY2hlIGl0IGZvciBsYXRlciByZXRyaWV2YWwuXG4gICAgdHJhbnNhY3Rpb25Eb25lTWFwLnNldCh0eCwgZG9uZSk7XG59XG5sZXQgaWRiUHJveHlUcmFwcyA9IHtcbiAgICBnZXQodGFyZ2V0LCBwcm9wLCByZWNlaXZlcikge1xuICAgICAgICBpZiAodGFyZ2V0IGluc3RhbmNlb2YgSURCVHJhbnNhY3Rpb24pIHtcbiAgICAgICAgICAgIC8vIFNwZWNpYWwgaGFuZGxpbmcgZm9yIHRyYW5zYWN0aW9uLmRvbmUuXG4gICAgICAgICAgICBpZiAocHJvcCA9PT0gJ2RvbmUnKVxuICAgICAgICAgICAgICAgIHJldHVybiB0cmFuc2FjdGlvbkRvbmVNYXAuZ2V0KHRhcmdldCk7XG4gICAgICAgICAgICAvLyBQb2x5ZmlsbCBmb3Igb2JqZWN0U3RvcmVOYW1lcyBiZWNhdXNlIG9mIEVkZ2UuXG4gICAgICAgICAgICBpZiAocHJvcCA9PT0gJ29iamVjdFN0b3JlTmFtZXMnKSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIHRhcmdldC5vYmplY3RTdG9yZU5hbWVzIHx8IHRyYW5zYWN0aW9uU3RvcmVOYW1lc01hcC5nZXQodGFyZ2V0KTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIC8vIE1ha2UgdHguc3RvcmUgcmV0dXJuIHRoZSBvbmx5IHN0b3JlIGluIHRoZSB0cmFuc2FjdGlvbiwgb3IgdW5kZWZpbmVkIGlmIHRoZXJlIGFyZSBtYW55LlxuICAgICAgICAgICAgaWYgKHByb3AgPT09ICdzdG9yZScpIHtcbiAgICAgICAgICAgICAgICByZXR1cm4gcmVjZWl2ZXIub2JqZWN0U3RvcmVOYW1lc1sxXVxuICAgICAgICAgICAgICAgICAgICA/IHVuZGVmaW5lZFxuICAgICAgICAgICAgICAgICAgICA6IHJlY2VpdmVyLm9iamVjdFN0b3JlKHJlY2VpdmVyLm9iamVjdFN0b3JlTmFtZXNbMF0pO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICAgIC8vIEVsc2UgdHJhbnNmb3JtIHdoYXRldmVyIHdlIGdldCBiYWNrLlxuICAgICAgICByZXR1cm4gd3JhcCh0YXJnZXRbcHJvcF0pO1xuICAgIH0sXG4gICAgc2V0KHRhcmdldCwgcHJvcCwgdmFsdWUpIHtcbiAgICAgICAgdGFyZ2V0W3Byb3BdID0gdmFsdWU7XG4gICAgICAgIHJldHVybiB0cnVlO1xuICAgIH0sXG4gICAgaGFzKHRhcmdldCwgcHJvcCkge1xuICAgICAgICBpZiAodGFyZ2V0IGluc3RhbmNlb2YgSURCVHJhbnNhY3Rpb24gJiZcbiAgICAgICAgICAgIChwcm9wID09PSAnZG9uZScgfHwgcHJvcCA9PT0gJ3N0b3JlJykpIHtcbiAgICAgICAgICAgIHJldHVybiB0cnVlO1xuICAgICAgICB9XG4gICAgICAgIHJldHVybiBwcm9wIGluIHRhcmdldDtcbiAgICB9LFxufTtcbmZ1bmN0aW9uIHJlcGxhY2VUcmFwcyhjYWxsYmFjaykge1xuICAgIGlkYlByb3h5VHJhcHMgPSBjYWxsYmFjayhpZGJQcm94eVRyYXBzKTtcbn1cbmZ1bmN0aW9uIHdyYXBGdW5jdGlvbihmdW5jKSB7XG4gICAgLy8gRHVlIHRvIGV4cGVjdGVkIG9iamVjdCBlcXVhbGl0eSAod2hpY2ggaXMgZW5mb3JjZWQgYnkgdGhlIGNhY2hpbmcgaW4gYHdyYXBgKSwgd2VcbiAgICAvLyBvbmx5IGNyZWF0ZSBvbmUgbmV3IGZ1bmMgcGVyIGZ1bmMuXG4gICAgLy8gRWRnZSBkb2Vzbid0IHN1cHBvcnQgb2JqZWN0U3RvcmVOYW1lcyAoYm9vbyksIHNvIHdlIHBvbHlmaWxsIGl0IGhlcmUuXG4gICAgaWYgKGZ1bmMgPT09IElEQkRhdGFiYXNlLnByb3RvdHlwZS50cmFuc2FjdGlvbiAmJlxuICAgICAgICAhKCdvYmplY3RTdG9yZU5hbWVzJyBpbiBJREJUcmFuc2FjdGlvbi5wcm90b3R5cGUpKSB7XG4gICAgICAgIHJldHVybiBmdW5jdGlvbiAoc3RvcmVOYW1lcywgLi4uYXJncykge1xuICAgICAgICAgICAgY29uc3QgdHggPSBmdW5jLmNhbGwodW53cmFwKHRoaXMpLCBzdG9yZU5hbWVzLCAuLi5hcmdzKTtcbiAgICAgICAgICAgIHRyYW5zYWN0aW9uU3RvcmVOYW1lc01hcC5zZXQodHgsIHN0b3JlTmFtZXMuc29ydCA/IHN0b3JlTmFtZXMuc29ydCgpIDogW3N0b3JlTmFtZXNdKTtcbiAgICAgICAgICAgIHJldHVybiB3cmFwKHR4KTtcbiAgICAgICAgfTtcbiAgICB9XG4gICAgLy8gQ3Vyc29yIG1ldGhvZHMgYXJlIHNwZWNpYWwsIGFzIHRoZSBiZWhhdmlvdXIgaXMgYSBsaXR0bGUgbW9yZSBkaWZmZXJlbnQgdG8gc3RhbmRhcmQgSURCLiBJblxuICAgIC8vIElEQiwgeW91IGFkdmFuY2UgdGhlIGN1cnNvciBhbmQgd2FpdCBmb3IgYSBuZXcgJ3N1Y2Nlc3MnIG9uIHRoZSBJREJSZXF1ZXN0IHRoYXQgZ2F2ZSB5b3UgdGhlXG4gICAgLy8gY3Vyc29yLiBJdCdzIGtpbmRhIGxpa2UgYSBwcm9taXNlIHRoYXQgY2FuIHJlc29sdmUgd2l0aCBtYW55IHZhbHVlcy4gVGhhdCBkb2Vzbid0IG1ha2Ugc2Vuc2VcbiAgICAvLyB3aXRoIHJlYWwgcHJvbWlzZXMsIHNvIGVhY2ggYWR2YW5jZSBtZXRob2RzIHJldHVybnMgYSBuZXcgcHJvbWlzZSBmb3IgdGhlIGN1cnNvciBvYmplY3QsIG9yXG4gICAgLy8gdW5kZWZpbmVkIGlmIHRoZSBlbmQgb2YgdGhlIGN1cnNvciBoYXMgYmVlbiByZWFjaGVkLlxuICAgIGlmIChnZXRDdXJzb3JBZHZhbmNlTWV0aG9kcygpLmluY2x1ZGVzKGZ1bmMpKSB7XG4gICAgICAgIHJldHVybiBmdW5jdGlvbiAoLi4uYXJncykge1xuICAgICAgICAgICAgLy8gQ2FsbGluZyB0aGUgb3JpZ2luYWwgZnVuY3Rpb24gd2l0aCB0aGUgcHJveHkgYXMgJ3RoaXMnIGNhdXNlcyBJTExFR0FMIElOVk9DQVRJT04sIHNvIHdlIHVzZVxuICAgICAgICAgICAgLy8gdGhlIG9yaWdpbmFsIG9iamVjdC5cbiAgICAgICAgICAgIGZ1bmMuYXBwbHkodW53cmFwKHRoaXMpLCBhcmdzKTtcbiAgICAgICAgICAgIHJldHVybiB3cmFwKGN1cnNvclJlcXVlc3RNYXAuZ2V0KHRoaXMpKTtcbiAgICAgICAgfTtcbiAgICB9XG4gICAgcmV0dXJuIGZ1bmN0aW9uICguLi5hcmdzKSB7XG4gICAgICAgIC8vIENhbGxpbmcgdGhlIG9yaWdpbmFsIGZ1bmN0aW9uIHdpdGggdGhlIHByb3h5IGFzICd0aGlzJyBjYXVzZXMgSUxMRUdBTCBJTlZPQ0FUSU9OLCBzbyB3ZSB1c2VcbiAgICAgICAgLy8gdGhlIG9yaWdpbmFsIG9iamVjdC5cbiAgICAgICAgcmV0dXJuIHdyYXAoZnVuYy5hcHBseSh1bndyYXAodGhpcyksIGFyZ3MpKTtcbiAgICB9O1xufVxuZnVuY3Rpb24gdHJhbnNmb3JtQ2FjaGFibGVWYWx1ZSh2YWx1ZSkge1xuICAgIGlmICh0eXBlb2YgdmFsdWUgPT09ICdmdW5jdGlvbicpXG4gICAgICAgIHJldHVybiB3cmFwRnVuY3Rpb24odmFsdWUpO1xuICAgIC8vIFRoaXMgZG9lc24ndCByZXR1cm4sIGl0IGp1c3QgY3JlYXRlcyBhICdkb25lJyBwcm9taXNlIGZvciB0aGUgdHJhbnNhY3Rpb24sXG4gICAgLy8gd2hpY2ggaXMgbGF0ZXIgcmV0dXJuZWQgZm9yIHRyYW5zYWN0aW9uLmRvbmUgKHNlZSBpZGJPYmplY3RIYW5kbGVyKS5cbiAgICBpZiAodmFsdWUgaW5zdGFuY2VvZiBJREJUcmFuc2FjdGlvbilcbiAgICAgICAgY2FjaGVEb25lUHJvbWlzZUZvclRyYW5zYWN0aW9uKHZhbHVlKTtcbiAgICBpZiAoaW5zdGFuY2VPZkFueSh2YWx1ZSwgZ2V0SWRiUHJveHlhYmxlVHlwZXMoKSkpXG4gICAgICAgIHJldHVybiBuZXcgUHJveHkodmFsdWUsIGlkYlByb3h5VHJhcHMpO1xuICAgIC8vIFJldHVybiB0aGUgc2FtZSB2YWx1ZSBiYWNrIGlmIHdlJ3JlIG5vdCBnb2luZyB0byB0cmFuc2Zvcm0gaXQuXG4gICAgcmV0dXJuIHZhbHVlO1xufVxuZnVuY3Rpb24gd3JhcCh2YWx1ZSkge1xuICAgIC8vIFdlIHNvbWV0aW1lcyBnZW5lcmF0ZSBtdWx0aXBsZSBwcm9taXNlcyBmcm9tIGEgc2luZ2xlIElEQlJlcXVlc3QgKGVnIHdoZW4gY3Vyc29yaW5nKSwgYmVjYXVzZVxuICAgIC8vIElEQiBpcyB3ZWlyZCBhbmQgYSBzaW5nbGUgSURCUmVxdWVzdCBjYW4geWllbGQgbWFueSByZXNwb25zZXMsIHNvIHRoZXNlIGNhbid0IGJlIGNhY2hlZC5cbiAgICBpZiAodmFsdWUgaW5zdGFuY2VvZiBJREJSZXF1ZXN0KVxuICAgICAgICByZXR1cm4gcHJvbWlzaWZ5UmVxdWVzdCh2YWx1ZSk7XG4gICAgLy8gSWYgd2UndmUgYWxyZWFkeSB0cmFuc2Zvcm1lZCB0aGlzIHZhbHVlIGJlZm9yZSwgcmV1c2UgdGhlIHRyYW5zZm9ybWVkIHZhbHVlLlxuICAgIC8vIFRoaXMgaXMgZmFzdGVyLCBidXQgaXQgYWxzbyBwcm92aWRlcyBvYmplY3QgZXF1YWxpdHkuXG4gICAgaWYgKHRyYW5zZm9ybUNhY2hlLmhhcyh2YWx1ZSkpXG4gICAgICAgIHJldHVybiB0cmFuc2Zvcm1DYWNoZS5nZXQodmFsdWUpO1xuICAgIGNvbnN0IG5ld1ZhbHVlID0gdHJhbnNmb3JtQ2FjaGFibGVWYWx1ZSh2YWx1ZSk7XG4gICAgLy8gTm90IGFsbCB0eXBlcyBhcmUgdHJhbnNmb3JtZWQuXG4gICAgLy8gVGhlc2UgbWF5IGJlIHByaW1pdGl2ZSB0eXBlcywgc28gdGhleSBjYW4ndCBiZSBXZWFrTWFwIGtleXMuXG4gICAgaWYgKG5ld1ZhbHVlICE9PSB2YWx1ZSkge1xuICAgICAgICB0cmFuc2Zvcm1DYWNoZS5zZXQodmFsdWUsIG5ld1ZhbHVlKTtcbiAgICAgICAgcmV2ZXJzZVRyYW5zZm9ybUNhY2hlLnNldChuZXdWYWx1ZSwgdmFsdWUpO1xuICAgIH1cbiAgICByZXR1cm4gbmV3VmFsdWU7XG59XG5jb25zdCB1bndyYXAgPSAodmFsdWUpID0+IHJldmVyc2VUcmFuc2Zvcm1DYWNoZS5nZXQodmFsdWUpO1xuXG5leHBvcnQgeyByZXZlcnNlVHJhbnNmb3JtQ2FjaGUgYXMgYSwgaW5zdGFuY2VPZkFueSBhcyBpLCByZXBsYWNlVHJhcHMgYXMgciwgdW53cmFwIGFzIHUsIHdyYXAgYXMgdyB9O1xuIiwgImltcG9ydCB7IHcgYXMgd3JhcCwgciBhcyByZXBsYWNlVHJhcHMgfSBmcm9tICcuL3dyYXAtaWRiLXZhbHVlLmpzJztcbmV4cG9ydCB7IHUgYXMgdW53cmFwLCB3IGFzIHdyYXAgfSBmcm9tICcuL3dyYXAtaWRiLXZhbHVlLmpzJztcblxuLyoqXG4gKiBPcGVuIGEgZGF0YWJhc2UuXG4gKlxuICogQHBhcmFtIG5hbWUgTmFtZSBvZiB0aGUgZGF0YWJhc2UuXG4gKiBAcGFyYW0gdmVyc2lvbiBTY2hlbWEgdmVyc2lvbi5cbiAqIEBwYXJhbSBjYWxsYmFja3MgQWRkaXRpb25hbCBjYWxsYmFja3MuXG4gKi9cbmZ1bmN0aW9uIG9wZW5EQihuYW1lLCB2ZXJzaW9uLCB7IGJsb2NrZWQsIHVwZ3JhZGUsIGJsb2NraW5nLCB0ZXJtaW5hdGVkIH0gPSB7fSkge1xuICAgIGNvbnN0IHJlcXVlc3QgPSBpbmRleGVkREIub3BlbihuYW1lLCB2ZXJzaW9uKTtcbiAgICBjb25zdCBvcGVuUHJvbWlzZSA9IHdyYXAocmVxdWVzdCk7XG4gICAgaWYgKHVwZ3JhZGUpIHtcbiAgICAgICAgcmVxdWVzdC5hZGRFdmVudExpc3RlbmVyKCd1cGdyYWRlbmVlZGVkJywgKGV2ZW50KSA9PiB7XG4gICAgICAgICAgICB1cGdyYWRlKHdyYXAocmVxdWVzdC5yZXN1bHQpLCBldmVudC5vbGRWZXJzaW9uLCBldmVudC5uZXdWZXJzaW9uLCB3cmFwKHJlcXVlc3QudHJhbnNhY3Rpb24pLCBldmVudCk7XG4gICAgICAgIH0pO1xuICAgIH1cbiAgICBpZiAoYmxvY2tlZCkge1xuICAgICAgICByZXF1ZXN0LmFkZEV2ZW50TGlzdGVuZXIoJ2Jsb2NrZWQnLCAoZXZlbnQpID0+IGJsb2NrZWQoXG4gICAgICAgIC8vIENhc3RpbmcgZHVlIHRvIGh0dHBzOi8vZ2l0aHViLmNvbS9taWNyb3NvZnQvVHlwZVNjcmlwdC1ET00tbGliLWdlbmVyYXRvci9wdWxsLzE0MDVcbiAgICAgICAgZXZlbnQub2xkVmVyc2lvbiwgZXZlbnQubmV3VmVyc2lvbiwgZXZlbnQpKTtcbiAgICB9XG4gICAgb3BlblByb21pc2VcbiAgICAgICAgLnRoZW4oKGRiKSA9PiB7XG4gICAgICAgIGlmICh0ZXJtaW5hdGVkKVxuICAgICAgICAgICAgZGIuYWRkRXZlbnRMaXN0ZW5lcignY2xvc2UnLCAoKSA9PiB0ZXJtaW5hdGVkKCkpO1xuICAgICAgICBpZiAoYmxvY2tpbmcpIHtcbiAgICAgICAgICAgIGRiLmFkZEV2ZW50TGlzdGVuZXIoJ3ZlcnNpb25jaGFuZ2UnLCAoZXZlbnQpID0+IGJsb2NraW5nKGV2ZW50Lm9sZFZlcnNpb24sIGV2ZW50Lm5ld1ZlcnNpb24sIGV2ZW50KSk7XG4gICAgICAgIH1cbiAgICB9KVxuICAgICAgICAuY2F0Y2goKCkgPT4geyB9KTtcbiAgICByZXR1cm4gb3BlblByb21pc2U7XG59XG4vKipcbiAqIERlbGV0ZSBhIGRhdGFiYXNlLlxuICpcbiAqIEBwYXJhbSBuYW1lIE5hbWUgb2YgdGhlIGRhdGFiYXNlLlxuICovXG5mdW5jdGlvbiBkZWxldGVEQihuYW1lLCB7IGJsb2NrZWQgfSA9IHt9KSB7XG4gICAgY29uc3QgcmVxdWVzdCA9IGluZGV4ZWREQi5kZWxldGVEYXRhYmFzZShuYW1lKTtcbiAgICBpZiAoYmxvY2tlZCkge1xuICAgICAgICByZXF1ZXN0LmFkZEV2ZW50TGlzdGVuZXIoJ2Jsb2NrZWQnLCAoZXZlbnQpID0+IGJsb2NrZWQoXG4gICAgICAgIC8vIENhc3RpbmcgZHVlIHRvIGh0dHBzOi8vZ2l0aHViLmNvbS9taWNyb3NvZnQvVHlwZVNjcmlwdC1ET00tbGliLWdlbmVyYXRvci9wdWxsLzE0MDVcbiAgICAgICAgZXZlbnQub2xkVmVyc2lvbiwgZXZlbnQpKTtcbiAgICB9XG4gICAgcmV0dXJuIHdyYXAocmVxdWVzdCkudGhlbigoKSA9PiB1bmRlZmluZWQpO1xufVxuXG5jb25zdCByZWFkTWV0aG9kcyA9IFsnZ2V0JywgJ2dldEtleScsICdnZXRBbGwnLCAnZ2V0QWxsS2V5cycsICdjb3VudCddO1xuY29uc3Qgd3JpdGVNZXRob2RzID0gWydwdXQnLCAnYWRkJywgJ2RlbGV0ZScsICdjbGVhciddO1xuY29uc3QgY2FjaGVkTWV0aG9kcyA9IG5ldyBNYXAoKTtcbmZ1bmN0aW9uIGdldE1ldGhvZCh0YXJnZXQsIHByb3ApIHtcbiAgICBpZiAoISh0YXJnZXQgaW5zdGFuY2VvZiBJREJEYXRhYmFzZSAmJlxuICAgICAgICAhKHByb3AgaW4gdGFyZ2V0KSAmJlxuICAgICAgICB0eXBlb2YgcHJvcCA9PT0gJ3N0cmluZycpKSB7XG4gICAgICAgIHJldHVybjtcbiAgICB9XG4gICAgaWYgKGNhY2hlZE1ldGhvZHMuZ2V0KHByb3ApKVxuICAgICAgICByZXR1cm4gY2FjaGVkTWV0aG9kcy5nZXQocHJvcCk7XG4gICAgY29uc3QgdGFyZ2V0RnVuY05hbWUgPSBwcm9wLnJlcGxhY2UoL0Zyb21JbmRleCQvLCAnJyk7XG4gICAgY29uc3QgdXNlSW5kZXggPSBwcm9wICE9PSB0YXJnZXRGdW5jTmFtZTtcbiAgICBjb25zdCBpc1dyaXRlID0gd3JpdGVNZXRob2RzLmluY2x1ZGVzKHRhcmdldEZ1bmNOYW1lKTtcbiAgICBpZiAoXG4gICAgLy8gQmFpbCBpZiB0aGUgdGFyZ2V0IGRvZXNuJ3QgZXhpc3Qgb24gdGhlIHRhcmdldC4gRWcsIGdldEFsbCBpc24ndCBpbiBFZGdlLlxuICAgICEodGFyZ2V0RnVuY05hbWUgaW4gKHVzZUluZGV4ID8gSURCSW5kZXggOiBJREJPYmplY3RTdG9yZSkucHJvdG90eXBlKSB8fFxuICAgICAgICAhKGlzV3JpdGUgfHwgcmVhZE1ldGhvZHMuaW5jbHVkZXModGFyZ2V0RnVuY05hbWUpKSkge1xuICAgICAgICByZXR1cm47XG4gICAgfVxuICAgIGNvbnN0IG1ldGhvZCA9IGFzeW5jIGZ1bmN0aW9uIChzdG9yZU5hbWUsIC4uLmFyZ3MpIHtcbiAgICAgICAgLy8gaXNXcml0ZSA/ICdyZWFkd3JpdGUnIDogdW5kZWZpbmVkIGd6aXBwcyBiZXR0ZXIsIGJ1dCBmYWlscyBpbiBFZGdlIDooXG4gICAgICAgIGNvbnN0IHR4ID0gdGhpcy50cmFuc2FjdGlvbihzdG9yZU5hbWUsIGlzV3JpdGUgPyAncmVhZHdyaXRlJyA6ICdyZWFkb25seScpO1xuICAgICAgICBsZXQgdGFyZ2V0ID0gdHguc3RvcmU7XG4gICAgICAgIGlmICh1c2VJbmRleClcbiAgICAgICAgICAgIHRhcmdldCA9IHRhcmdldC5pbmRleChhcmdzLnNoaWZ0KCkpO1xuICAgICAgICAvLyBNdXN0IHJlamVjdCBpZiBvcCByZWplY3RzLlxuICAgICAgICAvLyBJZiBpdCdzIGEgd3JpdGUgb3BlcmF0aW9uLCBtdXN0IHJlamVjdCBpZiB0eC5kb25lIHJlamVjdHMuXG4gICAgICAgIC8vIE11c3QgcmVqZWN0IHdpdGggb3AgcmVqZWN0aW9uIGZpcnN0LlxuICAgICAgICAvLyBNdXN0IHJlc29sdmUgd2l0aCBvcCB2YWx1ZS5cbiAgICAgICAgLy8gTXVzdCBoYW5kbGUgYm90aCBwcm9taXNlcyAobm8gdW5oYW5kbGVkIHJlamVjdGlvbnMpXG4gICAgICAgIHJldHVybiAoYXdhaXQgUHJvbWlzZS5hbGwoW1xuICAgICAgICAgICAgdGFyZ2V0W3RhcmdldEZ1bmNOYW1lXSguLi5hcmdzKSxcbiAgICAgICAgICAgIGlzV3JpdGUgJiYgdHguZG9uZSxcbiAgICAgICAgXSkpWzBdO1xuICAgIH07XG4gICAgY2FjaGVkTWV0aG9kcy5zZXQocHJvcCwgbWV0aG9kKTtcbiAgICByZXR1cm4gbWV0aG9kO1xufVxucmVwbGFjZVRyYXBzKChvbGRUcmFwcykgPT4gKHtcbiAgICAuLi5vbGRUcmFwcyxcbiAgICBnZXQ6ICh0YXJnZXQsIHByb3AsIHJlY2VpdmVyKSA9PiBnZXRNZXRob2QodGFyZ2V0LCBwcm9wKSB8fCBvbGRUcmFwcy5nZXQodGFyZ2V0LCBwcm9wLCByZWNlaXZlciksXG4gICAgaGFzOiAodGFyZ2V0LCBwcm9wKSA9PiAhIWdldE1ldGhvZCh0YXJnZXQsIHByb3ApIHx8IG9sZFRyYXBzLmhhcyh0YXJnZXQsIHByb3ApLFxufSkpO1xuXG5leHBvcnQgeyBkZWxldGVEQiwgb3BlbkRCIH07XG4iLCAiXCJ1c2Ugc3RyaWN0XCI7XG4vLyBAdHMtaWdub3JlXG50cnkge1xuICAgIHNlbGZbJ3dvcmtib3g6ZXhwaXJhdGlvbjo3LjIuMCddICYmIF8oKTtcbn1cbmNhdGNoIChlKSB7IH1cbiIsICIvKlxuICBDb3B5cmlnaHQgMjAxOCBHb29nbGUgTExDXG5cbiAgVXNlIG9mIHRoaXMgc291cmNlIGNvZGUgaXMgZ292ZXJuZWQgYnkgYW4gTUlULXN0eWxlXG4gIGxpY2Vuc2UgdGhhdCBjYW4gYmUgZm91bmQgaW4gdGhlIExJQ0VOU0UgZmlsZSBvciBhdFxuICBodHRwczovL29wZW5zb3VyY2Uub3JnL2xpY2Vuc2VzL01JVC5cbiovXG5pbXBvcnQgeyBvcGVuREIsIGRlbGV0ZURCIH0gZnJvbSAnaWRiJztcbmltcG9ydCAnLi4vX3ZlcnNpb24uanMnO1xuY29uc3QgREJfTkFNRSA9ICd3b3JrYm94LWV4cGlyYXRpb24nO1xuY29uc3QgQ0FDSEVfT0JKRUNUX1NUT1JFID0gJ2NhY2hlLWVudHJpZXMnO1xuY29uc3Qgbm9ybWFsaXplVVJMID0gKHVuTm9ybWFsaXplZFVybCkgPT4ge1xuICAgIGNvbnN0IHVybCA9IG5ldyBVUkwodW5Ob3JtYWxpemVkVXJsLCBsb2NhdGlvbi5ocmVmKTtcbiAgICB1cmwuaGFzaCA9ICcnO1xuICAgIHJldHVybiB1cmwuaHJlZjtcbn07XG4vKipcbiAqIFJldHVybnMgdGhlIHRpbWVzdGFtcCBtb2RlbC5cbiAqXG4gKiBAcHJpdmF0ZVxuICovXG5jbGFzcyBDYWNoZVRpbWVzdGFtcHNNb2RlbCB7XG4gICAgLyoqXG4gICAgICpcbiAgICAgKiBAcGFyYW0ge3N0cmluZ30gY2FjaGVOYW1lXG4gICAgICpcbiAgICAgKiBAcHJpdmF0ZVxuICAgICAqL1xuICAgIGNvbnN0cnVjdG9yKGNhY2hlTmFtZSkge1xuICAgICAgICB0aGlzLl9kYiA9IG51bGw7XG4gICAgICAgIHRoaXMuX2NhY2hlTmFtZSA9IGNhY2hlTmFtZTtcbiAgICB9XG4gICAgLyoqXG4gICAgICogUGVyZm9ybXMgYW4gdXBncmFkZSBvZiBpbmRleGVkREIuXG4gICAgICpcbiAgICAgKiBAcGFyYW0ge0lEQlBEYXRhYmFzZTxDYWNoZURiU2NoZW1hPn0gZGJcbiAgICAgKlxuICAgICAqIEBwcml2YXRlXG4gICAgICovXG4gICAgX3VwZ3JhZGVEYihkYikge1xuICAgICAgICAvLyBUT0RPKHBoaWxpcHdhbHRvbik6IEVkZ2VIVE1MIGRvZXNuJ3Qgc3VwcG9ydCBhcnJheXMgYXMgYSBrZXlQYXRoLCBzbyB3ZVxuICAgICAgICAvLyBoYXZlIHRvIHVzZSB0aGUgYGlkYCBrZXlQYXRoIGhlcmUgYW5kIGNyZWF0ZSBvdXIgb3duIHZhbHVlcyAoYVxuICAgICAgICAvLyBjb25jYXRlbmF0aW9uIG9mIGB1cmwgKyBjYWNoZU5hbWVgKSBpbnN0ZWFkIG9mIHNpbXBseSB1c2luZ1xuICAgICAgICAvLyBga2V5UGF0aDogWyd1cmwnLCAnY2FjaGVOYW1lJ11gLCB3aGljaCBpcyBzdXBwb3J0ZWQgaW4gb3RoZXIgYnJvd3NlcnMuXG4gICAgICAgIGNvbnN0IG9ialN0b3JlID0gZGIuY3JlYXRlT2JqZWN0U3RvcmUoQ0FDSEVfT0JKRUNUX1NUT1JFLCB7IGtleVBhdGg6ICdpZCcgfSk7XG4gICAgICAgIC8vIFRPRE8ocGhpbGlwd2FsdG9uKTogb25jZSB3ZSBkb24ndCBoYXZlIHRvIHN1cHBvcnQgRWRnZUhUTUwsIHdlIGNhblxuICAgICAgICAvLyBjcmVhdGUgYSBzaW5nbGUgaW5kZXggd2l0aCB0aGUga2V5UGF0aCBgWydjYWNoZU5hbWUnLCAndGltZXN0YW1wJ11gXG4gICAgICAgIC8vIGluc3RlYWQgb2YgZG9pbmcgYm90aCB0aGVzZSBpbmRleGVzLlxuICAgICAgICBvYmpTdG9yZS5jcmVhdGVJbmRleCgnY2FjaGVOYW1lJywgJ2NhY2hlTmFtZScsIHsgdW5pcXVlOiBmYWxzZSB9KTtcbiAgICAgICAgb2JqU3RvcmUuY3JlYXRlSW5kZXgoJ3RpbWVzdGFtcCcsICd0aW1lc3RhbXAnLCB7IHVuaXF1ZTogZmFsc2UgfSk7XG4gICAgfVxuICAgIC8qKlxuICAgICAqIFBlcmZvcm1zIGFuIHVwZ3JhZGUgb2YgaW5kZXhlZERCIGFuZCBkZWxldGVzIGRlcHJlY2F0ZWQgREJzLlxuICAgICAqXG4gICAgICogQHBhcmFtIHtJREJQRGF0YWJhc2U8Q2FjaGVEYlNjaGVtYT59IGRiXG4gICAgICpcbiAgICAgKiBAcHJpdmF0ZVxuICAgICAqL1xuICAgIF91cGdyYWRlRGJBbmREZWxldGVPbGREYnMoZGIpIHtcbiAgICAgICAgdGhpcy5fdXBncmFkZURiKGRiKTtcbiAgICAgICAgaWYgKHRoaXMuX2NhY2hlTmFtZSkge1xuICAgICAgICAgICAgdm9pZCBkZWxldGVEQih0aGlzLl9jYWNoZU5hbWUpO1xuICAgICAgICB9XG4gICAgfVxuICAgIC8qKlxuICAgICAqIEBwYXJhbSB7c3RyaW5nfSB1cmxcbiAgICAgKiBAcGFyYW0ge251bWJlcn0gdGltZXN0YW1wXG4gICAgICpcbiAgICAgKiBAcHJpdmF0ZVxuICAgICAqL1xuICAgIGFzeW5jIHNldFRpbWVzdGFtcCh1cmwsIHRpbWVzdGFtcCkge1xuICAgICAgICB1cmwgPSBub3JtYWxpemVVUkwodXJsKTtcbiAgICAgICAgY29uc3QgZW50cnkgPSB7XG4gICAgICAgICAgICB1cmwsXG4gICAgICAgICAgICB0aW1lc3RhbXAsXG4gICAgICAgICAgICBjYWNoZU5hbWU6IHRoaXMuX2NhY2hlTmFtZSxcbiAgICAgICAgICAgIC8vIENyZWF0aW5nIGFuIElEIGZyb20gdGhlIFVSTCBhbmQgY2FjaGUgbmFtZSB3b24ndCBiZSBuZWNlc3Nhcnkgb25jZVxuICAgICAgICAgICAgLy8gRWRnZSBzd2l0Y2hlcyB0byBDaHJvbWl1bSBhbmQgYWxsIGJyb3dzZXJzIHdlIHN1cHBvcnQgd29yayB3aXRoXG4gICAgICAgICAgICAvLyBhcnJheSBrZXlQYXRocy5cbiAgICAgICAgICAgIGlkOiB0aGlzLl9nZXRJZCh1cmwpLFxuICAgICAgICB9O1xuICAgICAgICBjb25zdCBkYiA9IGF3YWl0IHRoaXMuZ2V0RGIoKTtcbiAgICAgICAgY29uc3QgdHggPSBkYi50cmFuc2FjdGlvbihDQUNIRV9PQkpFQ1RfU1RPUkUsICdyZWFkd3JpdGUnLCB7XG4gICAgICAgICAgICBkdXJhYmlsaXR5OiAncmVsYXhlZCcsXG4gICAgICAgIH0pO1xuICAgICAgICBhd2FpdCB0eC5zdG9yZS5wdXQoZW50cnkpO1xuICAgICAgICBhd2FpdCB0eC5kb25lO1xuICAgIH1cbiAgICAvKipcbiAgICAgKiBSZXR1cm5zIHRoZSB0aW1lc3RhbXAgc3RvcmVkIGZvciBhIGdpdmVuIFVSTC5cbiAgICAgKlxuICAgICAqIEBwYXJhbSB7c3RyaW5nfSB1cmxcbiAgICAgKiBAcmV0dXJuIHtudW1iZXIgfCB1bmRlZmluZWR9XG4gICAgICpcbiAgICAgKiBAcHJpdmF0ZVxuICAgICAqL1xuICAgIGFzeW5jIGdldFRpbWVzdGFtcCh1cmwpIHtcbiAgICAgICAgY29uc3QgZGIgPSBhd2FpdCB0aGlzLmdldERiKCk7XG4gICAgICAgIGNvbnN0IGVudHJ5ID0gYXdhaXQgZGIuZ2V0KENBQ0hFX09CSkVDVF9TVE9SRSwgdGhpcy5fZ2V0SWQodXJsKSk7XG4gICAgICAgIHJldHVybiBlbnRyeSA9PT0gbnVsbCB8fCBlbnRyeSA9PT0gdm9pZCAwID8gdm9pZCAwIDogZW50cnkudGltZXN0YW1wO1xuICAgIH1cbiAgICAvKipcbiAgICAgKiBJdGVyYXRlcyB0aHJvdWdoIGFsbCB0aGUgZW50cmllcyBpbiB0aGUgb2JqZWN0IHN0b3JlIChmcm9tIG5ld2VzdCB0b1xuICAgICAqIG9sZGVzdCkgYW5kIHJlbW92ZXMgZW50cmllcyBvbmNlIGVpdGhlciBgbWF4Q291bnRgIGlzIHJlYWNoZWQgb3IgdGhlXG4gICAgICogZW50cnkncyB0aW1lc3RhbXAgaXMgbGVzcyB0aGFuIGBtaW5UaW1lc3RhbXBgLlxuICAgICAqXG4gICAgICogQHBhcmFtIHtudW1iZXJ9IG1pblRpbWVzdGFtcFxuICAgICAqIEBwYXJhbSB7bnVtYmVyfSBtYXhDb3VudFxuICAgICAqIEByZXR1cm4ge0FycmF5PHN0cmluZz59XG4gICAgICpcbiAgICAgKiBAcHJpdmF0ZVxuICAgICAqL1xuICAgIGFzeW5jIGV4cGlyZUVudHJpZXMobWluVGltZXN0YW1wLCBtYXhDb3VudCkge1xuICAgICAgICBjb25zdCBkYiA9IGF3YWl0IHRoaXMuZ2V0RGIoKTtcbiAgICAgICAgbGV0IGN1cnNvciA9IGF3YWl0IGRiXG4gICAgICAgICAgICAudHJhbnNhY3Rpb24oQ0FDSEVfT0JKRUNUX1NUT1JFKVxuICAgICAgICAgICAgLnN0b3JlLmluZGV4KCd0aW1lc3RhbXAnKVxuICAgICAgICAgICAgLm9wZW5DdXJzb3IobnVsbCwgJ3ByZXYnKTtcbiAgICAgICAgY29uc3QgZW50cmllc1RvRGVsZXRlID0gW107XG4gICAgICAgIGxldCBlbnRyaWVzTm90RGVsZXRlZENvdW50ID0gMDtcbiAgICAgICAgd2hpbGUgKGN1cnNvcikge1xuICAgICAgICAgICAgY29uc3QgcmVzdWx0ID0gY3Vyc29yLnZhbHVlO1xuICAgICAgICAgICAgLy8gVE9ETyhwaGlsaXB3YWx0b24pOiBvbmNlIHdlIGNhbiB1c2UgYSBtdWx0aS1rZXkgaW5kZXgsIHdlXG4gICAgICAgICAgICAvLyB3b24ndCBoYXZlIHRvIGNoZWNrIGBjYWNoZU5hbWVgIGhlcmUuXG4gICAgICAgICAgICBpZiAocmVzdWx0LmNhY2hlTmFtZSA9PT0gdGhpcy5fY2FjaGVOYW1lKSB7XG4gICAgICAgICAgICAgICAgLy8gRGVsZXRlIGFuIGVudHJ5IGlmIGl0J3Mgb2xkZXIgdGhhbiB0aGUgbWF4IGFnZSBvclxuICAgICAgICAgICAgICAgIC8vIGlmIHdlIGFscmVhZHkgaGF2ZSB0aGUgbWF4IG51bWJlciBhbGxvd2VkLlxuICAgICAgICAgICAgICAgIGlmICgobWluVGltZXN0YW1wICYmIHJlc3VsdC50aW1lc3RhbXAgPCBtaW5UaW1lc3RhbXApIHx8XG4gICAgICAgICAgICAgICAgICAgIChtYXhDb3VudCAmJiBlbnRyaWVzTm90RGVsZXRlZENvdW50ID49IG1heENvdW50KSkge1xuICAgICAgICAgICAgICAgICAgICAvLyBUT0RPKHBoaWxpcHdhbHRvbik6IHdlIHNob3VsZCBiZSBhYmxlIHRvIGRlbGV0ZSB0aGVcbiAgICAgICAgICAgICAgICAgICAgLy8gZW50cnkgcmlnaHQgaGVyZSwgYnV0IGRvaW5nIHNvIGNhdXNlcyBhbiBpdGVyYXRpb25cbiAgICAgICAgICAgICAgICAgICAgLy8gYnVnIGluIFNhZmFyaSBzdGFibGUgKGZpeGVkIGluIFRQKS4gSW5zdGVhZCB3ZSBjYW5cbiAgICAgICAgICAgICAgICAgICAgLy8gc3RvcmUgdGhlIGtleXMgb2YgdGhlIGVudHJpZXMgdG8gZGVsZXRlLCBhbmQgdGhlblxuICAgICAgICAgICAgICAgICAgICAvLyBkZWxldGUgdGhlIHNlcGFyYXRlIHRyYW5zYWN0aW9ucy5cbiAgICAgICAgICAgICAgICAgICAgLy8gaHR0cHM6Ly9naXRodWIuY29tL0dvb2dsZUNocm9tZS93b3JrYm94L2lzc3Vlcy8xOTc4XG4gICAgICAgICAgICAgICAgICAgIC8vIGN1cnNvci5kZWxldGUoKTtcbiAgICAgICAgICAgICAgICAgICAgLy8gV2Ugb25seSBuZWVkIHRvIHJldHVybiB0aGUgVVJMLCBub3QgdGhlIHdob2xlIGVudHJ5LlxuICAgICAgICAgICAgICAgICAgICBlbnRyaWVzVG9EZWxldGUucHVzaChjdXJzb3IudmFsdWUpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgZW50cmllc05vdERlbGV0ZWRDb3VudCsrO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGN1cnNvciA9IGF3YWl0IGN1cnNvci5jb250aW51ZSgpO1xuICAgICAgICB9XG4gICAgICAgIC8vIFRPRE8ocGhpbGlwd2FsdG9uKTogb25jZSB0aGUgU2FmYXJpIGJ1ZyBpbiB0aGUgZm9sbG93aW5nIGlzc3VlIGlzIGZpeGVkLFxuICAgICAgICAvLyB3ZSBzaG91bGQgYmUgYWJsZSB0byByZW1vdmUgdGhpcyBsb29wIGFuZCBkbyB0aGUgZW50cnkgZGVsZXRpb24gaW4gdGhlXG4gICAgICAgIC8vIGN1cnNvciBsb29wIGFib3ZlOlxuICAgICAgICAvLyBodHRwczovL2dpdGh1Yi5jb20vR29vZ2xlQ2hyb21lL3dvcmtib3gvaXNzdWVzLzE5NzhcbiAgICAgICAgY29uc3QgdXJsc0RlbGV0ZWQgPSBbXTtcbiAgICAgICAgZm9yIChjb25zdCBlbnRyeSBvZiBlbnRyaWVzVG9EZWxldGUpIHtcbiAgICAgICAgICAgIGF3YWl0IGRiLmRlbGV0ZShDQUNIRV9PQkpFQ1RfU1RPUkUsIGVudHJ5LmlkKTtcbiAgICAgICAgICAgIHVybHNEZWxldGVkLnB1c2goZW50cnkudXJsKTtcbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gdXJsc0RlbGV0ZWQ7XG4gICAgfVxuICAgIC8qKlxuICAgICAqIFRha2VzIGEgVVJMIGFuZCByZXR1cm5zIGFuIElEIHRoYXQgd2lsbCBiZSB1bmlxdWUgaW4gdGhlIG9iamVjdCBzdG9yZS5cbiAgICAgKlxuICAgICAqIEBwYXJhbSB7c3RyaW5nfSB1cmxcbiAgICAgKiBAcmV0dXJuIHtzdHJpbmd9XG4gICAgICpcbiAgICAgKiBAcHJpdmF0ZVxuICAgICAqL1xuICAgIF9nZXRJZCh1cmwpIHtcbiAgICAgICAgLy8gQ3JlYXRpbmcgYW4gSUQgZnJvbSB0aGUgVVJMIGFuZCBjYWNoZSBuYW1lIHdvbid0IGJlIG5lY2Vzc2FyeSBvbmNlXG4gICAgICAgIC8vIEVkZ2Ugc3dpdGNoZXMgdG8gQ2hyb21pdW0gYW5kIGFsbCBicm93c2VycyB3ZSBzdXBwb3J0IHdvcmsgd2l0aFxuICAgICAgICAvLyBhcnJheSBrZXlQYXRocy5cbiAgICAgICAgcmV0dXJuIHRoaXMuX2NhY2hlTmFtZSArICd8JyArIG5vcm1hbGl6ZVVSTCh1cmwpO1xuICAgIH1cbiAgICAvKipcbiAgICAgKiBSZXR1cm5zIGFuIG9wZW4gY29ubmVjdGlvbiB0byB0aGUgZGF0YWJhc2UuXG4gICAgICpcbiAgICAgKiBAcHJpdmF0ZVxuICAgICAqL1xuICAgIGFzeW5jIGdldERiKCkge1xuICAgICAgICBpZiAoIXRoaXMuX2RiKSB7XG4gICAgICAgICAgICB0aGlzLl9kYiA9IGF3YWl0IG9wZW5EQihEQl9OQU1FLCAxLCB7XG4gICAgICAgICAgICAgICAgdXBncmFkZTogdGhpcy5fdXBncmFkZURiQW5kRGVsZXRlT2xkRGJzLmJpbmQodGhpcyksXG4gICAgICAgICAgICB9KTtcbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gdGhpcy5fZGI7XG4gICAgfVxufVxuZXhwb3J0IHsgQ2FjaGVUaW1lc3RhbXBzTW9kZWwgfTtcbiIsICIvKlxuICBDb3B5cmlnaHQgMjAxOCBHb29nbGUgTExDXG5cbiAgVXNlIG9mIHRoaXMgc291cmNlIGNvZGUgaXMgZ292ZXJuZWQgYnkgYW4gTUlULXN0eWxlXG4gIGxpY2Vuc2UgdGhhdCBjYW4gYmUgZm91bmQgaW4gdGhlIExJQ0VOU0UgZmlsZSBvciBhdFxuICBodHRwczovL29wZW5zb3VyY2Uub3JnL2xpY2Vuc2VzL01JVC5cbiovXG5pbXBvcnQgeyBhc3NlcnQgfSBmcm9tICd3b3JrYm94LWNvcmUvX3ByaXZhdGUvYXNzZXJ0LmpzJztcbmltcG9ydCB7IGRvbnRXYWl0Rm9yIH0gZnJvbSAnd29ya2JveC1jb3JlL19wcml2YXRlL2RvbnRXYWl0Rm9yLmpzJztcbmltcG9ydCB7IGxvZ2dlciB9IGZyb20gJ3dvcmtib3gtY29yZS9fcHJpdmF0ZS9sb2dnZXIuanMnO1xuaW1wb3J0IHsgV29ya2JveEVycm9yIH0gZnJvbSAnd29ya2JveC1jb3JlL19wcml2YXRlL1dvcmtib3hFcnJvci5qcyc7XG5pbXBvcnQgeyBDYWNoZVRpbWVzdGFtcHNNb2RlbCB9IGZyb20gJy4vbW9kZWxzL0NhY2hlVGltZXN0YW1wc01vZGVsLmpzJztcbmltcG9ydCAnLi9fdmVyc2lvbi5qcyc7XG4vKipcbiAqIFRoZSBgQ2FjaGVFeHBpcmF0aW9uYCBjbGFzcyBhbGxvd3MgeW91IGRlZmluZSBhbiBleHBpcmF0aW9uIGFuZCAvIG9yXG4gKiBsaW1pdCBvbiB0aGUgbnVtYmVyIG9mIHJlc3BvbnNlcyBzdG9yZWQgaW4gYVxuICogW2BDYWNoZWBdKGh0dHBzOi8vZGV2ZWxvcGVyLm1vemlsbGEub3JnL2VuLVVTL2RvY3MvV2ViL0FQSS9DYWNoZSkuXG4gKlxuICogQG1lbWJlcm9mIHdvcmtib3gtZXhwaXJhdGlvblxuICovXG5jbGFzcyBDYWNoZUV4cGlyYXRpb24ge1xuICAgIC8qKlxuICAgICAqIFRvIGNvbnN0cnVjdCBhIG5ldyBDYWNoZUV4cGlyYXRpb24gaW5zdGFuY2UgeW91IG11c3QgcHJvdmlkZSBhdCBsZWFzdFxuICAgICAqIG9uZSBvZiB0aGUgYGNvbmZpZ2AgcHJvcGVydGllcy5cbiAgICAgKlxuICAgICAqIEBwYXJhbSB7c3RyaW5nfSBjYWNoZU5hbWUgTmFtZSBvZiB0aGUgY2FjaGUgdG8gYXBwbHkgcmVzdHJpY3Rpb25zIHRvLlxuICAgICAqIEBwYXJhbSB7T2JqZWN0fSBjb25maWdcbiAgICAgKiBAcGFyYW0ge251bWJlcn0gW2NvbmZpZy5tYXhFbnRyaWVzXSBUaGUgbWF4aW11bSBudW1iZXIgb2YgZW50cmllcyB0byBjYWNoZS5cbiAgICAgKiBFbnRyaWVzIHVzZWQgdGhlIGxlYXN0IHdpbGwgYmUgcmVtb3ZlZCBhcyB0aGUgbWF4aW11bSBpcyByZWFjaGVkLlxuICAgICAqIEBwYXJhbSB7bnVtYmVyfSBbY29uZmlnLm1heEFnZVNlY29uZHNdIFRoZSBtYXhpbXVtIGFnZSBvZiBhbiBlbnRyeSBiZWZvcmVcbiAgICAgKiBpdCdzIHRyZWF0ZWQgYXMgc3RhbGUgYW5kIHJlbW92ZWQuXG4gICAgICogQHBhcmFtIHtPYmplY3R9IFtjb25maWcubWF0Y2hPcHRpb25zXSBUaGUgW2BDYWNoZVF1ZXJ5T3B0aW9uc2BdKGh0dHBzOi8vZGV2ZWxvcGVyLm1vemlsbGEub3JnL2VuLVVTL2RvY3MvV2ViL0FQSS9DYWNoZS9kZWxldGUjUGFyYW1ldGVycylcbiAgICAgKiB0aGF0IHdpbGwgYmUgdXNlZCB3aGVuIGNhbGxpbmcgYGRlbGV0ZSgpYCBvbiB0aGUgY2FjaGUuXG4gICAgICovXG4gICAgY29uc3RydWN0b3IoY2FjaGVOYW1lLCBjb25maWcgPSB7fSkge1xuICAgICAgICB0aGlzLl9pc1J1bm5pbmcgPSBmYWxzZTtcbiAgICAgICAgdGhpcy5fcmVydW5SZXF1ZXN0ZWQgPSBmYWxzZTtcbiAgICAgICAgaWYgKHByb2Nlc3MuZW52Lk5PREVfRU5WICE9PSAncHJvZHVjdGlvbicpIHtcbiAgICAgICAgICAgIGFzc2VydC5pc1R5cGUoY2FjaGVOYW1lLCAnc3RyaW5nJywge1xuICAgICAgICAgICAgICAgIG1vZHVsZU5hbWU6ICd3b3JrYm94LWV4cGlyYXRpb24nLFxuICAgICAgICAgICAgICAgIGNsYXNzTmFtZTogJ0NhY2hlRXhwaXJhdGlvbicsXG4gICAgICAgICAgICAgICAgZnVuY05hbWU6ICdjb25zdHJ1Y3RvcicsXG4gICAgICAgICAgICAgICAgcGFyYW1OYW1lOiAnY2FjaGVOYW1lJyxcbiAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgaWYgKCEoY29uZmlnLm1heEVudHJpZXMgfHwgY29uZmlnLm1heEFnZVNlY29uZHMpKSB7XG4gICAgICAgICAgICAgICAgdGhyb3cgbmV3IFdvcmtib3hFcnJvcignbWF4LWVudHJpZXMtb3ItYWdlLXJlcXVpcmVkJywge1xuICAgICAgICAgICAgICAgICAgICBtb2R1bGVOYW1lOiAnd29ya2JveC1leHBpcmF0aW9uJyxcbiAgICAgICAgICAgICAgICAgICAgY2xhc3NOYW1lOiAnQ2FjaGVFeHBpcmF0aW9uJyxcbiAgICAgICAgICAgICAgICAgICAgZnVuY05hbWU6ICdjb25zdHJ1Y3RvcicsXG4gICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBpZiAoY29uZmlnLm1heEVudHJpZXMpIHtcbiAgICAgICAgICAgICAgICBhc3NlcnQuaXNUeXBlKGNvbmZpZy5tYXhFbnRyaWVzLCAnbnVtYmVyJywge1xuICAgICAgICAgICAgICAgICAgICBtb2R1bGVOYW1lOiAnd29ya2JveC1leHBpcmF0aW9uJyxcbiAgICAgICAgICAgICAgICAgICAgY2xhc3NOYW1lOiAnQ2FjaGVFeHBpcmF0aW9uJyxcbiAgICAgICAgICAgICAgICAgICAgZnVuY05hbWU6ICdjb25zdHJ1Y3RvcicsXG4gICAgICAgICAgICAgICAgICAgIHBhcmFtTmFtZTogJ2NvbmZpZy5tYXhFbnRyaWVzJyxcbiAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGlmIChjb25maWcubWF4QWdlU2Vjb25kcykge1xuICAgICAgICAgICAgICAgIGFzc2VydC5pc1R5cGUoY29uZmlnLm1heEFnZVNlY29uZHMsICdudW1iZXInLCB7XG4gICAgICAgICAgICAgICAgICAgIG1vZHVsZU5hbWU6ICd3b3JrYm94LWV4cGlyYXRpb24nLFxuICAgICAgICAgICAgICAgICAgICBjbGFzc05hbWU6ICdDYWNoZUV4cGlyYXRpb24nLFxuICAgICAgICAgICAgICAgICAgICBmdW5jTmFtZTogJ2NvbnN0cnVjdG9yJyxcbiAgICAgICAgICAgICAgICAgICAgcGFyYW1OYW1lOiAnY29uZmlnLm1heEFnZVNlY29uZHMnLFxuICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICAgIHRoaXMuX21heEVudHJpZXMgPSBjb25maWcubWF4RW50cmllcztcbiAgICAgICAgdGhpcy5fbWF4QWdlU2Vjb25kcyA9IGNvbmZpZy5tYXhBZ2VTZWNvbmRzO1xuICAgICAgICB0aGlzLl9tYXRjaE9wdGlvbnMgPSBjb25maWcubWF0Y2hPcHRpb25zO1xuICAgICAgICB0aGlzLl9jYWNoZU5hbWUgPSBjYWNoZU5hbWU7XG4gICAgICAgIHRoaXMuX3RpbWVzdGFtcE1vZGVsID0gbmV3IENhY2hlVGltZXN0YW1wc01vZGVsKGNhY2hlTmFtZSk7XG4gICAgfVxuICAgIC8qKlxuICAgICAqIEV4cGlyZXMgZW50cmllcyBmb3IgdGhlIGdpdmVuIGNhY2hlIGFuZCBnaXZlbiBjcml0ZXJpYS5cbiAgICAgKi9cbiAgICBhc3luYyBleHBpcmVFbnRyaWVzKCkge1xuICAgICAgICBpZiAodGhpcy5faXNSdW5uaW5nKSB7XG4gICAgICAgICAgICB0aGlzLl9yZXJ1blJlcXVlc3RlZCA9IHRydWU7XG4gICAgICAgICAgICByZXR1cm47XG4gICAgICAgIH1cbiAgICAgICAgdGhpcy5faXNSdW5uaW5nID0gdHJ1ZTtcbiAgICAgICAgY29uc3QgbWluVGltZXN0YW1wID0gdGhpcy5fbWF4QWdlU2Vjb25kc1xuICAgICAgICAgICAgPyBEYXRlLm5vdygpIC0gdGhpcy5fbWF4QWdlU2Vjb25kcyAqIDEwMDBcbiAgICAgICAgICAgIDogMDtcbiAgICAgICAgY29uc3QgdXJsc0V4cGlyZWQgPSBhd2FpdCB0aGlzLl90aW1lc3RhbXBNb2RlbC5leHBpcmVFbnRyaWVzKG1pblRpbWVzdGFtcCwgdGhpcy5fbWF4RW50cmllcyk7XG4gICAgICAgIC8vIERlbGV0ZSBVUkxzIGZyb20gdGhlIGNhY2hlXG4gICAgICAgIGNvbnN0IGNhY2hlID0gYXdhaXQgc2VsZi5jYWNoZXMub3Blbih0aGlzLl9jYWNoZU5hbWUpO1xuICAgICAgICBmb3IgKGNvbnN0IHVybCBvZiB1cmxzRXhwaXJlZCkge1xuICAgICAgICAgICAgYXdhaXQgY2FjaGUuZGVsZXRlKHVybCwgdGhpcy5fbWF0Y2hPcHRpb25zKTtcbiAgICAgICAgfVxuICAgICAgICBpZiAocHJvY2Vzcy5lbnYuTk9ERV9FTlYgIT09ICdwcm9kdWN0aW9uJykge1xuICAgICAgICAgICAgaWYgKHVybHNFeHBpcmVkLmxlbmd0aCA+IDApIHtcbiAgICAgICAgICAgICAgICBsb2dnZXIuZ3JvdXBDb2xsYXBzZWQoYEV4cGlyZWQgJHt1cmxzRXhwaXJlZC5sZW5ndGh9IGAgK1xuICAgICAgICAgICAgICAgICAgICBgJHt1cmxzRXhwaXJlZC5sZW5ndGggPT09IDEgPyAnZW50cnknIDogJ2VudHJpZXMnfSBhbmQgcmVtb3ZlZCBgICtcbiAgICAgICAgICAgICAgICAgICAgYCR7dXJsc0V4cGlyZWQubGVuZ3RoID09PSAxID8gJ2l0JyA6ICd0aGVtJ30gZnJvbSB0aGUgYCArXG4gICAgICAgICAgICAgICAgICAgIGAnJHt0aGlzLl9jYWNoZU5hbWV9JyBjYWNoZS5gKTtcbiAgICAgICAgICAgICAgICBsb2dnZXIubG9nKGBFeHBpcmVkIHRoZSBmb2xsb3dpbmcgJHt1cmxzRXhwaXJlZC5sZW5ndGggPT09IDEgPyAnVVJMJyA6ICdVUkxzJ306YCk7XG4gICAgICAgICAgICAgICAgdXJsc0V4cGlyZWQuZm9yRWFjaCgodXJsKSA9PiBsb2dnZXIubG9nKGAgICAgJHt1cmx9YCkpO1xuICAgICAgICAgICAgICAgIGxvZ2dlci5ncm91cEVuZCgpO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgZWxzZSB7XG4gICAgICAgICAgICAgICAgbG9nZ2VyLmRlYnVnKGBDYWNoZSBleHBpcmF0aW9uIHJhbiBhbmQgZm91bmQgbm8gZW50cmllcyB0byByZW1vdmUuYCk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgICAgdGhpcy5faXNSdW5uaW5nID0gZmFsc2U7XG4gICAgICAgIGlmICh0aGlzLl9yZXJ1blJlcXVlc3RlZCkge1xuICAgICAgICAgICAgdGhpcy5fcmVydW5SZXF1ZXN0ZWQgPSBmYWxzZTtcbiAgICAgICAgICAgIGRvbnRXYWl0Rm9yKHRoaXMuZXhwaXJlRW50cmllcygpKTtcbiAgICAgICAgfVxuICAgIH1cbiAgICAvKipcbiAgICAgKiBVcGRhdGUgdGhlIHRpbWVzdGFtcCBmb3IgdGhlIGdpdmVuIFVSTC4gVGhpcyBlbnN1cmVzIHRoZSB3aGVuXG4gICAgICogcmVtb3ZpbmcgZW50cmllcyBiYXNlZCBvbiBtYXhpbXVtIGVudHJpZXMsIG1vc3QgcmVjZW50bHkgdXNlZFxuICAgICAqIGlzIGFjY3VyYXRlIG9yIHdoZW4gZXhwaXJpbmcsIHRoZSB0aW1lc3RhbXAgaXMgdXAtdG8tZGF0ZS5cbiAgICAgKlxuICAgICAqIEBwYXJhbSB7c3RyaW5nfSB1cmxcbiAgICAgKi9cbiAgICBhc3luYyB1cGRhdGVUaW1lc3RhbXAodXJsKSB7XG4gICAgICAgIGlmIChwcm9jZXNzLmVudi5OT0RFX0VOViAhPT0gJ3Byb2R1Y3Rpb24nKSB7XG4gICAgICAgICAgICBhc3NlcnQuaXNUeXBlKHVybCwgJ3N0cmluZycsIHtcbiAgICAgICAgICAgICAgICBtb2R1bGVOYW1lOiAnd29ya2JveC1leHBpcmF0aW9uJyxcbiAgICAgICAgICAgICAgICBjbGFzc05hbWU6ICdDYWNoZUV4cGlyYXRpb24nLFxuICAgICAgICAgICAgICAgIGZ1bmNOYW1lOiAndXBkYXRlVGltZXN0YW1wJyxcbiAgICAgICAgICAgICAgICBwYXJhbU5hbWU6ICd1cmwnLFxuICAgICAgICAgICAgfSk7XG4gICAgICAgIH1cbiAgICAgICAgYXdhaXQgdGhpcy5fdGltZXN0YW1wTW9kZWwuc2V0VGltZXN0YW1wKHVybCwgRGF0ZS5ub3coKSk7XG4gICAgfVxuICAgIC8qKlxuICAgICAqIENhbiBiZSB1c2VkIHRvIGNoZWNrIGlmIGEgVVJMIGhhcyBleHBpcmVkIG9yIG5vdCBiZWZvcmUgaXQncyB1c2VkLlxuICAgICAqXG4gICAgICogVGhpcyByZXF1aXJlcyBhIGxvb2sgdXAgZnJvbSBJbmRleGVkREIsIHNvIGNhbiBiZSBzbG93LlxuICAgICAqXG4gICAgICogTm90ZTogVGhpcyBtZXRob2Qgd2lsbCBub3QgcmVtb3ZlIHRoZSBjYWNoZWQgZW50cnksIGNhbGxcbiAgICAgKiBgZXhwaXJlRW50cmllcygpYCB0byByZW1vdmUgaW5kZXhlZERCIGFuZCBDYWNoZSBlbnRyaWVzLlxuICAgICAqXG4gICAgICogQHBhcmFtIHtzdHJpbmd9IHVybFxuICAgICAqIEByZXR1cm4ge2Jvb2xlYW59XG4gICAgICovXG4gICAgYXN5bmMgaXNVUkxFeHBpcmVkKHVybCkge1xuICAgICAgICBpZiAoIXRoaXMuX21heEFnZVNlY29uZHMpIHtcbiAgICAgICAgICAgIGlmIChwcm9jZXNzLmVudi5OT0RFX0VOViAhPT0gJ3Byb2R1Y3Rpb24nKSB7XG4gICAgICAgICAgICAgICAgdGhyb3cgbmV3IFdvcmtib3hFcnJvcihgZXhwaXJlZC10ZXN0LXdpdGhvdXQtbWF4LWFnZWAsIHtcbiAgICAgICAgICAgICAgICAgICAgbWV0aG9kTmFtZTogJ2lzVVJMRXhwaXJlZCcsXG4gICAgICAgICAgICAgICAgICAgIHBhcmFtTmFtZTogJ21heEFnZVNlY29uZHMnLFxuICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgcmV0dXJuIGZhbHNlO1xuICAgICAgICB9XG4gICAgICAgIGVsc2Uge1xuICAgICAgICAgICAgY29uc3QgdGltZXN0YW1wID0gYXdhaXQgdGhpcy5fdGltZXN0YW1wTW9kZWwuZ2V0VGltZXN0YW1wKHVybCk7XG4gICAgICAgICAgICBjb25zdCBleHBpcmVPbGRlclRoYW4gPSBEYXRlLm5vdygpIC0gdGhpcy5fbWF4QWdlU2Vjb25kcyAqIDEwMDA7XG4gICAgICAgICAgICByZXR1cm4gdGltZXN0YW1wICE9PSB1bmRlZmluZWQgPyB0aW1lc3RhbXAgPCBleHBpcmVPbGRlclRoYW4gOiB0cnVlO1xuICAgICAgICB9XG4gICAgfVxuICAgIC8qKlxuICAgICAqIFJlbW92ZXMgdGhlIEluZGV4ZWREQiBvYmplY3Qgc3RvcmUgdXNlZCB0byBrZWVwIHRyYWNrIG9mIGNhY2hlIGV4cGlyYXRpb25cbiAgICAgKiBtZXRhZGF0YS5cbiAgICAgKi9cbiAgICBhc3luYyBkZWxldGUoKSB7XG4gICAgICAgIC8vIE1ha2Ugc3VyZSB3ZSBkb24ndCBhdHRlbXB0IGFub3RoZXIgcmVydW4gaWYgd2UncmUgY2FsbGVkIGluIHRoZSBtaWRkbGUgb2ZcbiAgICAgICAgLy8gYSBjYWNoZSBleHBpcmF0aW9uLlxuICAgICAgICB0aGlzLl9yZXJ1blJlcXVlc3RlZCA9IGZhbHNlO1xuICAgICAgICBhd2FpdCB0aGlzLl90aW1lc3RhbXBNb2RlbC5leHBpcmVFbnRyaWVzKEluZmluaXR5KTsgLy8gRXhwaXJlcyBhbGwuXG4gICAgfVxufVxuZXhwb3J0IHsgQ2FjaGVFeHBpcmF0aW9uIH07XG4iLCAiLypcbiAgQ29weXJpZ2h0IDIwMTggR29vZ2xlIExMQ1xuXG4gIFVzZSBvZiB0aGlzIHNvdXJjZSBjb2RlIGlzIGdvdmVybmVkIGJ5IGFuIE1JVC1zdHlsZVxuICBsaWNlbnNlIHRoYXQgY2FuIGJlIGZvdW5kIGluIHRoZSBMSUNFTlNFIGZpbGUgb3IgYXRcbiAgaHR0cHM6Ly9vcGVuc291cmNlLm9yZy9saWNlbnNlcy9NSVQuXG4qL1xuaW1wb3J0IHsgYXNzZXJ0IH0gZnJvbSAnd29ya2JveC1jb3JlL19wcml2YXRlL2Fzc2VydC5qcyc7XG5pbXBvcnQgeyBjYWNoZU5hbWVzIH0gZnJvbSAnd29ya2JveC1jb3JlL19wcml2YXRlL2NhY2hlTmFtZXMuanMnO1xuaW1wb3J0IHsgZG9udFdhaXRGb3IgfSBmcm9tICd3b3JrYm94LWNvcmUvX3ByaXZhdGUvZG9udFdhaXRGb3IuanMnO1xuaW1wb3J0IHsgZ2V0RnJpZW5kbHlVUkwgfSBmcm9tICd3b3JrYm94LWNvcmUvX3ByaXZhdGUvZ2V0RnJpZW5kbHlVUkwuanMnO1xuaW1wb3J0IHsgbG9nZ2VyIH0gZnJvbSAnd29ya2JveC1jb3JlL19wcml2YXRlL2xvZ2dlci5qcyc7XG5pbXBvcnQgeyByZWdpc3RlclF1b3RhRXJyb3JDYWxsYmFjayB9IGZyb20gJ3dvcmtib3gtY29yZS9yZWdpc3RlclF1b3RhRXJyb3JDYWxsYmFjay5qcyc7XG5pbXBvcnQgeyBXb3JrYm94RXJyb3IgfSBmcm9tICd3b3JrYm94LWNvcmUvX3ByaXZhdGUvV29ya2JveEVycm9yLmpzJztcbmltcG9ydCB7IENhY2hlRXhwaXJhdGlvbiB9IGZyb20gJy4vQ2FjaGVFeHBpcmF0aW9uLmpzJztcbmltcG9ydCAnLi9fdmVyc2lvbi5qcyc7XG4vKipcbiAqIFRoaXMgcGx1Z2luIGNhbiBiZSB1c2VkIGluIGEgYHdvcmtib3gtc3RyYXRlZ3lgIHRvIHJlZ3VsYXJseSBlbmZvcmNlIGFcbiAqIGxpbWl0IG9uIHRoZSBhZ2UgYW5kIC8gb3IgdGhlIG51bWJlciBvZiBjYWNoZWQgcmVxdWVzdHMuXG4gKlxuICogSXQgY2FuIG9ubHkgYmUgdXNlZCB3aXRoIGB3b3JrYm94LXN0cmF0ZWd5YCBpbnN0YW5jZXMgdGhhdCBoYXZlIGFcbiAqIFtjdXN0b20gYGNhY2hlTmFtZWAgcHJvcGVydHkgc2V0XSgvd2ViL3Rvb2xzL3dvcmtib3gvZ3VpZGVzL2NvbmZpZ3VyZS13b3JrYm94I2N1c3RvbV9jYWNoZV9uYW1lc19pbl9zdHJhdGVnaWVzKS5cbiAqIEluIG90aGVyIHdvcmRzLCBpdCBjYW4ndCBiZSB1c2VkIHRvIGV4cGlyZSBlbnRyaWVzIGluIHN0cmF0ZWd5IHRoYXQgdXNlcyB0aGVcbiAqIGRlZmF1bHQgcnVudGltZSBjYWNoZSBuYW1lLlxuICpcbiAqIFdoZW5ldmVyIGEgY2FjaGVkIHJlc3BvbnNlIGlzIHVzZWQgb3IgdXBkYXRlZCwgdGhpcyBwbHVnaW4gd2lsbCBsb29rXG4gKiBhdCB0aGUgYXNzb2NpYXRlZCBjYWNoZSBhbmQgcmVtb3ZlIGFueSBvbGQgb3IgZXh0cmEgcmVzcG9uc2VzLlxuICpcbiAqIFdoZW4gdXNpbmcgYG1heEFnZVNlY29uZHNgLCByZXNwb25zZXMgbWF5IGJlIHVzZWQgKm9uY2UqIGFmdGVyIGV4cGlyaW5nXG4gKiBiZWNhdXNlIHRoZSBleHBpcmF0aW9uIGNsZWFuIHVwIHdpbGwgbm90IGhhdmUgb2NjdXJyZWQgdW50aWwgKmFmdGVyKiB0aGVcbiAqIGNhY2hlZCByZXNwb25zZSBoYXMgYmVlbiB1c2VkLiBJZiB0aGUgcmVzcG9uc2UgaGFzIGEgXCJEYXRlXCIgaGVhZGVyLCB0aGVuXG4gKiBhIGxpZ2h0IHdlaWdodCBleHBpcmF0aW9uIGNoZWNrIGlzIHBlcmZvcm1lZCBhbmQgdGhlIHJlc3BvbnNlIHdpbGwgbm90IGJlXG4gKiB1c2VkIGltbWVkaWF0ZWx5LlxuICpcbiAqIFdoZW4gdXNpbmcgYG1heEVudHJpZXNgLCB0aGUgZW50cnkgbGVhc3QtcmVjZW50bHkgcmVxdWVzdGVkIHdpbGwgYmUgcmVtb3ZlZFxuICogZnJvbSB0aGUgY2FjaGUgZmlyc3QuXG4gKlxuICogQG1lbWJlcm9mIHdvcmtib3gtZXhwaXJhdGlvblxuICovXG5jbGFzcyBFeHBpcmF0aW9uUGx1Z2luIHtcbiAgICAvKipcbiAgICAgKiBAcGFyYW0ge0V4cGlyYXRpb25QbHVnaW5PcHRpb25zfSBjb25maWdcbiAgICAgKiBAcGFyYW0ge251bWJlcn0gW2NvbmZpZy5tYXhFbnRyaWVzXSBUaGUgbWF4aW11bSBudW1iZXIgb2YgZW50cmllcyB0byBjYWNoZS5cbiAgICAgKiBFbnRyaWVzIHVzZWQgdGhlIGxlYXN0IHdpbGwgYmUgcmVtb3ZlZCBhcyB0aGUgbWF4aW11bSBpcyByZWFjaGVkLlxuICAgICAqIEBwYXJhbSB7bnVtYmVyfSBbY29uZmlnLm1heEFnZVNlY29uZHNdIFRoZSBtYXhpbXVtIGFnZSBvZiBhbiBlbnRyeSBiZWZvcmVcbiAgICAgKiBpdCdzIHRyZWF0ZWQgYXMgc3RhbGUgYW5kIHJlbW92ZWQuXG4gICAgICogQHBhcmFtIHtPYmplY3R9IFtjb25maWcubWF0Y2hPcHRpb25zXSBUaGUgW2BDYWNoZVF1ZXJ5T3B0aW9uc2BdKGh0dHBzOi8vZGV2ZWxvcGVyLm1vemlsbGEub3JnL2VuLVVTL2RvY3MvV2ViL0FQSS9DYWNoZS9kZWxldGUjUGFyYW1ldGVycylcbiAgICAgKiB0aGF0IHdpbGwgYmUgdXNlZCB3aGVuIGNhbGxpbmcgYGRlbGV0ZSgpYCBvbiB0aGUgY2FjaGUuXG4gICAgICogQHBhcmFtIHtib29sZWFufSBbY29uZmlnLnB1cmdlT25RdW90YUVycm9yXSBXaGV0aGVyIHRvIG9wdCB0aGlzIGNhY2hlIGluIHRvXG4gICAgICogYXV0b21hdGljIGRlbGV0aW9uIGlmIHRoZSBhdmFpbGFibGUgc3RvcmFnZSBxdW90YSBoYXMgYmVlbiBleGNlZWRlZC5cbiAgICAgKi9cbiAgICBjb25zdHJ1Y3Rvcihjb25maWcgPSB7fSkge1xuICAgICAgICAvKipcbiAgICAgICAgICogQSBcImxpZmVjeWNsZVwiIGNhbGxiYWNrIHRoYXQgd2lsbCBiZSB0cmlnZ2VyZWQgYXV0b21hdGljYWxseSBieSB0aGVcbiAgICAgICAgICogYHdvcmtib3gtc3RyYXRlZ2llc2AgaGFuZGxlcnMgd2hlbiBhIGBSZXNwb25zZWAgaXMgYWJvdXQgdG8gYmUgcmV0dXJuZWRcbiAgICAgICAgICogZnJvbSBhIFtDYWNoZV0oaHR0cHM6Ly9kZXZlbG9wZXIubW96aWxsYS5vcmcvZW4tVVMvZG9jcy9XZWIvQVBJL0NhY2hlKSB0b1xuICAgICAgICAgKiB0aGUgaGFuZGxlci4gSXQgYWxsb3dzIHRoZSBgUmVzcG9uc2VgIHRvIGJlIGluc3BlY3RlZCBmb3IgZnJlc2huZXNzIGFuZFxuICAgICAgICAgKiBwcmV2ZW50cyBpdCBmcm9tIGJlaW5nIHVzZWQgaWYgdGhlIGBSZXNwb25zZWAncyBgRGF0ZWAgaGVhZGVyIHZhbHVlIGlzXG4gICAgICAgICAqIG9sZGVyIHRoYW4gdGhlIGNvbmZpZ3VyZWQgYG1heEFnZVNlY29uZHNgLlxuICAgICAgICAgKlxuICAgICAgICAgKiBAcGFyYW0ge09iamVjdH0gb3B0aW9uc1xuICAgICAgICAgKiBAcGFyYW0ge3N0cmluZ30gb3B0aW9ucy5jYWNoZU5hbWUgTmFtZSBvZiB0aGUgY2FjaGUgdGhlIHJlc3BvbnNlIGlzIGluLlxuICAgICAgICAgKiBAcGFyYW0ge1Jlc3BvbnNlfSBvcHRpb25zLmNhY2hlZFJlc3BvbnNlIFRoZSBgUmVzcG9uc2VgIG9iamVjdCB0aGF0J3MgYmVlblxuICAgICAgICAgKiAgICAgcmVhZCBmcm9tIGEgY2FjaGUgYW5kIHdob3NlIGZyZXNobmVzcyBzaG91bGQgYmUgY2hlY2tlZC5cbiAgICAgICAgICogQHJldHVybiB7UmVzcG9uc2V9IEVpdGhlciB0aGUgYGNhY2hlZFJlc3BvbnNlYCwgaWYgaXQnc1xuICAgICAgICAgKiAgICAgZnJlc2gsIG9yIGBudWxsYCBpZiB0aGUgYFJlc3BvbnNlYCBpcyBvbGRlciB0aGFuIGBtYXhBZ2VTZWNvbmRzYC5cbiAgICAgICAgICpcbiAgICAgICAgICogQHByaXZhdGVcbiAgICAgICAgICovXG4gICAgICAgIHRoaXMuY2FjaGVkUmVzcG9uc2VXaWxsQmVVc2VkID0gYXN5bmMgKHsgZXZlbnQsIHJlcXVlc3QsIGNhY2hlTmFtZSwgY2FjaGVkUmVzcG9uc2UsIH0pID0+IHtcbiAgICAgICAgICAgIGlmICghY2FjaGVkUmVzcG9uc2UpIHtcbiAgICAgICAgICAgICAgICByZXR1cm4gbnVsbDtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGNvbnN0IGlzRnJlc2ggPSB0aGlzLl9pc1Jlc3BvbnNlRGF0ZUZyZXNoKGNhY2hlZFJlc3BvbnNlKTtcbiAgICAgICAgICAgIC8vIEV4cGlyZSBlbnRyaWVzIHRvIGVuc3VyZSB0aGF0IGV2ZW4gaWYgdGhlIGV4cGlyYXRpb24gZGF0ZSBoYXNcbiAgICAgICAgICAgIC8vIGV4cGlyZWQsIGl0J2xsIG9ubHkgYmUgdXNlZCBvbmNlLlxuICAgICAgICAgICAgY29uc3QgY2FjaGVFeHBpcmF0aW9uID0gdGhpcy5fZ2V0Q2FjaGVFeHBpcmF0aW9uKGNhY2hlTmFtZSk7XG4gICAgICAgICAgICBkb250V2FpdEZvcihjYWNoZUV4cGlyYXRpb24uZXhwaXJlRW50cmllcygpKTtcbiAgICAgICAgICAgIC8vIFVwZGF0ZSB0aGUgbWV0YWRhdGEgZm9yIHRoZSByZXF1ZXN0IFVSTCB0byB0aGUgY3VycmVudCB0aW1lc3RhbXAsXG4gICAgICAgICAgICAvLyBidXQgZG9uJ3QgYGF3YWl0YCBpdCBhcyB3ZSBkb24ndCB3YW50IHRvIGJsb2NrIHRoZSByZXNwb25zZS5cbiAgICAgICAgICAgIGNvbnN0IHVwZGF0ZVRpbWVzdGFtcERvbmUgPSBjYWNoZUV4cGlyYXRpb24udXBkYXRlVGltZXN0YW1wKHJlcXVlc3QudXJsKTtcbiAgICAgICAgICAgIGlmIChldmVudCkge1xuICAgICAgICAgICAgICAgIHRyeSB7XG4gICAgICAgICAgICAgICAgICAgIGV2ZW50LndhaXRVbnRpbCh1cGRhdGVUaW1lc3RhbXBEb25lKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgY2F0Y2ggKGVycm9yKSB7XG4gICAgICAgICAgICAgICAgICAgIGlmIChwcm9jZXNzLmVudi5OT0RFX0VOViAhPT0gJ3Byb2R1Y3Rpb24nKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAvLyBUaGUgZXZlbnQgbWF5IG5vdCBiZSBhIGZldGNoIGV2ZW50OyBvbmx5IGxvZyB0aGUgVVJMIGlmIGl0IGlzLlxuICAgICAgICAgICAgICAgICAgICAgICAgaWYgKCdyZXF1ZXN0JyBpbiBldmVudCkge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGxvZ2dlci53YXJuKGBVbmFibGUgdG8gZW5zdXJlIHNlcnZpY2Ugd29ya2VyIHN0YXlzIGFsaXZlIHdoZW4gYCArXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGB1cGRhdGluZyBjYWNoZSBlbnRyeSBmb3IgYCArXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGAnJHtnZXRGcmllbmRseVVSTChldmVudC5yZXF1ZXN0LnVybCl9Jy5gKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIHJldHVybiBpc0ZyZXNoID8gY2FjaGVkUmVzcG9uc2UgOiBudWxsO1xuICAgICAgICB9O1xuICAgICAgICAvKipcbiAgICAgICAgICogQSBcImxpZmVjeWNsZVwiIGNhbGxiYWNrIHRoYXQgd2lsbCBiZSB0cmlnZ2VyZWQgYXV0b21hdGljYWxseSBieSB0aGVcbiAgICAgICAgICogYHdvcmtib3gtc3RyYXRlZ2llc2AgaGFuZGxlcnMgd2hlbiBhbiBlbnRyeSBpcyBhZGRlZCB0byBhIGNhY2hlLlxuICAgICAgICAgKlxuICAgICAgICAgKiBAcGFyYW0ge09iamVjdH0gb3B0aW9uc1xuICAgICAgICAgKiBAcGFyYW0ge3N0cmluZ30gb3B0aW9ucy5jYWNoZU5hbWUgTmFtZSBvZiB0aGUgY2FjaGUgdGhhdCB3YXMgdXBkYXRlZC5cbiAgICAgICAgICogQHBhcmFtIHtzdHJpbmd9IG9wdGlvbnMucmVxdWVzdCBUaGUgUmVxdWVzdCBmb3IgdGhlIGNhY2hlZCBlbnRyeS5cbiAgICAgICAgICpcbiAgICAgICAgICogQHByaXZhdGVcbiAgICAgICAgICovXG4gICAgICAgIHRoaXMuY2FjaGVEaWRVcGRhdGUgPSBhc3luYyAoeyBjYWNoZU5hbWUsIHJlcXVlc3QsIH0pID0+IHtcbiAgICAgICAgICAgIGlmIChwcm9jZXNzLmVudi5OT0RFX0VOViAhPT0gJ3Byb2R1Y3Rpb24nKSB7XG4gICAgICAgICAgICAgICAgYXNzZXJ0LmlzVHlwZShjYWNoZU5hbWUsICdzdHJpbmcnLCB7XG4gICAgICAgICAgICAgICAgICAgIG1vZHVsZU5hbWU6ICd3b3JrYm94LWV4cGlyYXRpb24nLFxuICAgICAgICAgICAgICAgICAgICBjbGFzc05hbWU6ICdQbHVnaW4nLFxuICAgICAgICAgICAgICAgICAgICBmdW5jTmFtZTogJ2NhY2hlRGlkVXBkYXRlJyxcbiAgICAgICAgICAgICAgICAgICAgcGFyYW1OYW1lOiAnY2FjaGVOYW1lJyxcbiAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgICAgICBhc3NlcnQuaXNJbnN0YW5jZShyZXF1ZXN0LCBSZXF1ZXN0LCB7XG4gICAgICAgICAgICAgICAgICAgIG1vZHVsZU5hbWU6ICd3b3JrYm94LWV4cGlyYXRpb24nLFxuICAgICAgICAgICAgICAgICAgICBjbGFzc05hbWU6ICdQbHVnaW4nLFxuICAgICAgICAgICAgICAgICAgICBmdW5jTmFtZTogJ2NhY2hlRGlkVXBkYXRlJyxcbiAgICAgICAgICAgICAgICAgICAgcGFyYW1OYW1lOiAncmVxdWVzdCcsXG4gICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBjb25zdCBjYWNoZUV4cGlyYXRpb24gPSB0aGlzLl9nZXRDYWNoZUV4cGlyYXRpb24oY2FjaGVOYW1lKTtcbiAgICAgICAgICAgIGF3YWl0IGNhY2hlRXhwaXJhdGlvbi51cGRhdGVUaW1lc3RhbXAocmVxdWVzdC51cmwpO1xuICAgICAgICAgICAgYXdhaXQgY2FjaGVFeHBpcmF0aW9uLmV4cGlyZUVudHJpZXMoKTtcbiAgICAgICAgfTtcbiAgICAgICAgaWYgKHByb2Nlc3MuZW52Lk5PREVfRU5WICE9PSAncHJvZHVjdGlvbicpIHtcbiAgICAgICAgICAgIGlmICghKGNvbmZpZy5tYXhFbnRyaWVzIHx8IGNvbmZpZy5tYXhBZ2VTZWNvbmRzKSkge1xuICAgICAgICAgICAgICAgIHRocm93IG5ldyBXb3JrYm94RXJyb3IoJ21heC1lbnRyaWVzLW9yLWFnZS1yZXF1aXJlZCcsIHtcbiAgICAgICAgICAgICAgICAgICAgbW9kdWxlTmFtZTogJ3dvcmtib3gtZXhwaXJhdGlvbicsXG4gICAgICAgICAgICAgICAgICAgIGNsYXNzTmFtZTogJ1BsdWdpbicsXG4gICAgICAgICAgICAgICAgICAgIGZ1bmNOYW1lOiAnY29uc3RydWN0b3InLFxuICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgaWYgKGNvbmZpZy5tYXhFbnRyaWVzKSB7XG4gICAgICAgICAgICAgICAgYXNzZXJ0LmlzVHlwZShjb25maWcubWF4RW50cmllcywgJ251bWJlcicsIHtcbiAgICAgICAgICAgICAgICAgICAgbW9kdWxlTmFtZTogJ3dvcmtib3gtZXhwaXJhdGlvbicsXG4gICAgICAgICAgICAgICAgICAgIGNsYXNzTmFtZTogJ1BsdWdpbicsXG4gICAgICAgICAgICAgICAgICAgIGZ1bmNOYW1lOiAnY29uc3RydWN0b3InLFxuICAgICAgICAgICAgICAgICAgICBwYXJhbU5hbWU6ICdjb25maWcubWF4RW50cmllcycsXG4gICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBpZiAoY29uZmlnLm1heEFnZVNlY29uZHMpIHtcbiAgICAgICAgICAgICAgICBhc3NlcnQuaXNUeXBlKGNvbmZpZy5tYXhBZ2VTZWNvbmRzLCAnbnVtYmVyJywge1xuICAgICAgICAgICAgICAgICAgICBtb2R1bGVOYW1lOiAnd29ya2JveC1leHBpcmF0aW9uJyxcbiAgICAgICAgICAgICAgICAgICAgY2xhc3NOYW1lOiAnUGx1Z2luJyxcbiAgICAgICAgICAgICAgICAgICAgZnVuY05hbWU6ICdjb25zdHJ1Y3RvcicsXG4gICAgICAgICAgICAgICAgICAgIHBhcmFtTmFtZTogJ2NvbmZpZy5tYXhBZ2VTZWNvbmRzJyxcbiAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgICB0aGlzLl9jb25maWcgPSBjb25maWc7XG4gICAgICAgIHRoaXMuX21heEFnZVNlY29uZHMgPSBjb25maWcubWF4QWdlU2Vjb25kcztcbiAgICAgICAgdGhpcy5fY2FjaGVFeHBpcmF0aW9ucyA9IG5ldyBNYXAoKTtcbiAgICAgICAgaWYgKGNvbmZpZy5wdXJnZU9uUXVvdGFFcnJvcikge1xuICAgICAgICAgICAgcmVnaXN0ZXJRdW90YUVycm9yQ2FsbGJhY2soKCkgPT4gdGhpcy5kZWxldGVDYWNoZUFuZE1ldGFkYXRhKCkpO1xuICAgICAgICB9XG4gICAgfVxuICAgIC8qKlxuICAgICAqIEEgc2ltcGxlIGhlbHBlciBtZXRob2QgdG8gcmV0dXJuIGEgQ2FjaGVFeHBpcmF0aW9uIGluc3RhbmNlIGZvciBhIGdpdmVuXG4gICAgICogY2FjaGUgbmFtZS5cbiAgICAgKlxuICAgICAqIEBwYXJhbSB7c3RyaW5nfSBjYWNoZU5hbWVcbiAgICAgKiBAcmV0dXJuIHtDYWNoZUV4cGlyYXRpb259XG4gICAgICpcbiAgICAgKiBAcHJpdmF0ZVxuICAgICAqL1xuICAgIF9nZXRDYWNoZUV4cGlyYXRpb24oY2FjaGVOYW1lKSB7XG4gICAgICAgIGlmIChjYWNoZU5hbWUgPT09IGNhY2hlTmFtZXMuZ2V0UnVudGltZU5hbWUoKSkge1xuICAgICAgICAgICAgdGhyb3cgbmV3IFdvcmtib3hFcnJvcignZXhwaXJlLWN1c3RvbS1jYWNoZXMtb25seScpO1xuICAgICAgICB9XG4gICAgICAgIGxldCBjYWNoZUV4cGlyYXRpb24gPSB0aGlzLl9jYWNoZUV4cGlyYXRpb25zLmdldChjYWNoZU5hbWUpO1xuICAgICAgICBpZiAoIWNhY2hlRXhwaXJhdGlvbikge1xuICAgICAgICAgICAgY2FjaGVFeHBpcmF0aW9uID0gbmV3IENhY2hlRXhwaXJhdGlvbihjYWNoZU5hbWUsIHRoaXMuX2NvbmZpZyk7XG4gICAgICAgICAgICB0aGlzLl9jYWNoZUV4cGlyYXRpb25zLnNldChjYWNoZU5hbWUsIGNhY2hlRXhwaXJhdGlvbik7XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIGNhY2hlRXhwaXJhdGlvbjtcbiAgICB9XG4gICAgLyoqXG4gICAgICogQHBhcmFtIHtSZXNwb25zZX0gY2FjaGVkUmVzcG9uc2VcbiAgICAgKiBAcmV0dXJuIHtib29sZWFufVxuICAgICAqXG4gICAgICogQHByaXZhdGVcbiAgICAgKi9cbiAgICBfaXNSZXNwb25zZURhdGVGcmVzaChjYWNoZWRSZXNwb25zZSkge1xuICAgICAgICBpZiAoIXRoaXMuX21heEFnZVNlY29uZHMpIHtcbiAgICAgICAgICAgIC8vIFdlIGFyZW4ndCBleHBpcmluZyBieSBhZ2UsIHNvIHJldHVybiB0cnVlLCBpdCdzIGZyZXNoXG4gICAgICAgICAgICByZXR1cm4gdHJ1ZTtcbiAgICAgICAgfVxuICAgICAgICAvLyBDaGVjayBpZiB0aGUgJ2RhdGUnIGhlYWRlciB3aWxsIHN1ZmZpY2UgYSBxdWljayBleHBpcmF0aW9uIGNoZWNrLlxuICAgICAgICAvLyBTZWUgaHR0cHM6Ly9naXRodWIuY29tL0dvb2dsZUNocm9tZUxhYnMvc3ctdG9vbGJveC9pc3N1ZXMvMTY0IGZvclxuICAgICAgICAvLyBkaXNjdXNzaW9uLlxuICAgICAgICBjb25zdCBkYXRlSGVhZGVyVGltZXN0YW1wID0gdGhpcy5fZ2V0RGF0ZUhlYWRlclRpbWVzdGFtcChjYWNoZWRSZXNwb25zZSk7XG4gICAgICAgIGlmIChkYXRlSGVhZGVyVGltZXN0YW1wID09PSBudWxsKSB7XG4gICAgICAgICAgICAvLyBVbmFibGUgdG8gcGFyc2UgZGF0ZSwgc28gYXNzdW1lIGl0J3MgZnJlc2guXG4gICAgICAgICAgICByZXR1cm4gdHJ1ZTtcbiAgICAgICAgfVxuICAgICAgICAvLyBJZiB3ZSBoYXZlIGEgdmFsaWQgaGVhZGVyVGltZSwgdGhlbiBvdXIgcmVzcG9uc2UgaXMgZnJlc2ggaWZmIHRoZVxuICAgICAgICAvLyBoZWFkZXJUaW1lIHBsdXMgbWF4QWdlU2Vjb25kcyBpcyBncmVhdGVyIHRoYW4gdGhlIGN1cnJlbnQgdGltZS5cbiAgICAgICAgY29uc3Qgbm93ID0gRGF0ZS5ub3coKTtcbiAgICAgICAgcmV0dXJuIGRhdGVIZWFkZXJUaW1lc3RhbXAgPj0gbm93IC0gdGhpcy5fbWF4QWdlU2Vjb25kcyAqIDEwMDA7XG4gICAgfVxuICAgIC8qKlxuICAgICAqIFRoaXMgbWV0aG9kIHdpbGwgZXh0cmFjdCB0aGUgZGF0YSBoZWFkZXIgYW5kIHBhcnNlIGl0IGludG8gYSB1c2VmdWxcbiAgICAgKiB2YWx1ZS5cbiAgICAgKlxuICAgICAqIEBwYXJhbSB7UmVzcG9uc2V9IGNhY2hlZFJlc3BvbnNlXG4gICAgICogQHJldHVybiB7bnVtYmVyfG51bGx9XG4gICAgICpcbiAgICAgKiBAcHJpdmF0ZVxuICAgICAqL1xuICAgIF9nZXREYXRlSGVhZGVyVGltZXN0YW1wKGNhY2hlZFJlc3BvbnNlKSB7XG4gICAgICAgIGlmICghY2FjaGVkUmVzcG9uc2UuaGVhZGVycy5oYXMoJ2RhdGUnKSkge1xuICAgICAgICAgICAgcmV0dXJuIG51bGw7XG4gICAgICAgIH1cbiAgICAgICAgY29uc3QgZGF0ZUhlYWRlciA9IGNhY2hlZFJlc3BvbnNlLmhlYWRlcnMuZ2V0KCdkYXRlJyk7XG4gICAgICAgIGNvbnN0IHBhcnNlZERhdGUgPSBuZXcgRGF0ZShkYXRlSGVhZGVyKTtcbiAgICAgICAgY29uc3QgaGVhZGVyVGltZSA9IHBhcnNlZERhdGUuZ2V0VGltZSgpO1xuICAgICAgICAvLyBJZiB0aGUgRGF0ZSBoZWFkZXIgd2FzIGludmFsaWQgZm9yIHNvbWUgcmVhc29uLCBwYXJzZWREYXRlLmdldFRpbWUoKVxuICAgICAgICAvLyB3aWxsIHJldHVybiBOYU4uXG4gICAgICAgIGlmIChpc05hTihoZWFkZXJUaW1lKSkge1xuICAgICAgICAgICAgcmV0dXJuIG51bGw7XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIGhlYWRlclRpbWU7XG4gICAgfVxuICAgIC8qKlxuICAgICAqIFRoaXMgaXMgYSBoZWxwZXIgbWV0aG9kIHRoYXQgcGVyZm9ybXMgdHdvIG9wZXJhdGlvbnM6XG4gICAgICpcbiAgICAgKiAtIERlbGV0ZXMgKmFsbCogdGhlIHVuZGVybHlpbmcgQ2FjaGUgaW5zdGFuY2VzIGFzc29jaWF0ZWQgd2l0aCB0aGlzIHBsdWdpblxuICAgICAqIGluc3RhbmNlLCBieSBjYWxsaW5nIGNhY2hlcy5kZWxldGUoKSBvbiB5b3VyIGJlaGFsZi5cbiAgICAgKiAtIERlbGV0ZXMgdGhlIG1ldGFkYXRhIGZyb20gSW5kZXhlZERCIHVzZWQgdG8ga2VlcCB0cmFjayBvZiBleHBpcmF0aW9uXG4gICAgICogZGV0YWlscyBmb3IgZWFjaCBDYWNoZSBpbnN0YW5jZS5cbiAgICAgKlxuICAgICAqIFdoZW4gdXNpbmcgY2FjaGUgZXhwaXJhdGlvbiwgY2FsbGluZyB0aGlzIG1ldGhvZCBpcyBwcmVmZXJhYmxlIHRvIGNhbGxpbmdcbiAgICAgKiBgY2FjaGVzLmRlbGV0ZSgpYCBkaXJlY3RseSwgc2luY2UgdGhpcyB3aWxsIGVuc3VyZSB0aGF0IHRoZSBJbmRleGVkREJcbiAgICAgKiBtZXRhZGF0YSBpcyBhbHNvIGNsZWFubHkgcmVtb3ZlZCBhbmQgb3BlbiBJbmRleGVkREIgaW5zdGFuY2VzIGFyZSBkZWxldGVkLlxuICAgICAqXG4gICAgICogTm90ZSB0aGF0IGlmIHlvdSdyZSAqbm90KiB1c2luZyBjYWNoZSBleHBpcmF0aW9uIGZvciBhIGdpdmVuIGNhY2hlLCBjYWxsaW5nXG4gICAgICogYGNhY2hlcy5kZWxldGUoKWAgYW5kIHBhc3NpbmcgaW4gdGhlIGNhY2hlJ3MgbmFtZSBzaG91bGQgYmUgc3VmZmljaWVudC5cbiAgICAgKiBUaGVyZSBpcyBubyBXb3JrYm94LXNwZWNpZmljIG1ldGhvZCBuZWVkZWQgZm9yIGNsZWFudXAgaW4gdGhhdCBjYXNlLlxuICAgICAqL1xuICAgIGFzeW5jIGRlbGV0ZUNhY2hlQW5kTWV0YWRhdGEoKSB7XG4gICAgICAgIC8vIERvIHRoaXMgb25lIGF0IGEgdGltZSBpbnN0ZWFkIG9mIGFsbCBhdCBvbmNlIHZpYSBgUHJvbWlzZS5hbGwoKWAgdG9cbiAgICAgICAgLy8gcmVkdWNlIHRoZSBjaGFuY2Ugb2YgaW5jb25zaXN0ZW5jeSBpZiBhIHByb21pc2UgcmVqZWN0cy5cbiAgICAgICAgZm9yIChjb25zdCBbY2FjaGVOYW1lLCBjYWNoZUV4cGlyYXRpb25dIG9mIHRoaXMuX2NhY2hlRXhwaXJhdGlvbnMpIHtcbiAgICAgICAgICAgIGF3YWl0IHNlbGYuY2FjaGVzLmRlbGV0ZShjYWNoZU5hbWUpO1xuICAgICAgICAgICAgYXdhaXQgY2FjaGVFeHBpcmF0aW9uLmRlbGV0ZSgpO1xuICAgICAgICB9XG4gICAgICAgIC8vIFJlc2V0IHRoaXMuX2NhY2hlRXhwaXJhdGlvbnMgdG8gaXRzIGluaXRpYWwgc3RhdGUuXG4gICAgICAgIHRoaXMuX2NhY2hlRXhwaXJhdGlvbnMgPSBuZXcgTWFwKCk7XG4gICAgfVxufVxuZXhwb3J0IHsgRXhwaXJhdGlvblBsdWdpbiB9O1xuIiwgIi8qIGVzbGludC1lbnYgc2VydmljZXdvcmtlciAqL1xyXG5cclxuLypcclxuICogVGhpcyBmaWxlICh5b3VyIGN1c3RvbSBzZXJ2aWNlIHdvcmtlcilcclxuICogaXMgcGlja2VkIHVwIGJ5IHRoZSBidWlsZCBzeXN0ZW0gT05MWSBpZlxyXG4gKiBxdWFzYXIuY29uZmlnIGZpbGUgPiBwd2EgPiB3b3JrYm94TW9kZSBpcyBzZXQgdG8gXCJJbmplY3RNYW5pZmVzdFwiXHJcbiAqL1xyXG5cclxuaW1wb3J0IHsgY2xpZW50c0NsYWltIH0gZnJvbSAnd29ya2JveC1jb3JlJ1xyXG5pbXBvcnQgeyBwcmVjYWNoZUFuZFJvdXRlLCBjbGVhbnVwT3V0ZGF0ZWRDYWNoZXMsIGNyZWF0ZUhhbmRsZXJCb3VuZFRvVVJMIH0gZnJvbSAnd29ya2JveC1wcmVjYWNoaW5nJ1xyXG5pbXBvcnQgeyByZWdpc3RlclJvdXRlLCBOYXZpZ2F0aW9uUm91dGUgfSBmcm9tICd3b3JrYm94LXJvdXRpbmcnXHJcblxyXG4vLyBcdTI3MDUgSU1QT1JUIFRIRVNFXHJcbmltcG9ydCB7IC8qTmV0d29ya0ZpcnN0LCovIFN0YWxlV2hpbGVSZXZhbGlkYXRlIH0gZnJvbSAnd29ya2JveC1zdHJhdGVnaWVzJ1xyXG5pbXBvcnQgeyBFeHBpcmF0aW9uUGx1Z2luIH0gZnJvbSAnd29ya2JveC1leHBpcmF0aW9uJ1xyXG5cclxuLy8gU2V0dXAgc2VydmljZSB3b3JrZXIgYmVoYXZpb3Jcclxuc2VsZi5za2lwV2FpdGluZygpXHJcbmNsaWVudHNDbGFpbSgpXHJcblxyXG4vLyBQcmUtY2FjaGUgc3RhdGljIGFzc2V0c1xyXG5wcmVjYWNoZUFuZFJvdXRlKHNlbGYuX19XQl9NQU5JRkVTVClcclxuXHJcbi8vIENsZWFuIG9sZCBjYWNoZXNcclxuY2xlYW51cE91dGRhdGVkQ2FjaGVzKClcclxuXHJcbi8vIFx1MjcwNSBBUEkgY2FjaGluZyBmb3IgV29vQ29tbWVyY2UgYmFja2VuZFxyXG4vKnJlZ2lzdGVyUm91dGUoXHJcbiAgKHsgdXJsIH0pID0+XHJcbiAgICAgIHVybC5vcmlnaW4gPT09ICdodHRwczovL251eHQubWVpZGFubS5jb20nICYmXHJcbiAgICAgICh1cmwucGF0aG5hbWUgPT09ICcvd3AtanNvbi93Yy9zdG9yZS92MS9wcm9kdWN0cycgfHwgdXJsLnBhdGhuYW1lID09PSAnL3dwLWpzb24vd2Mvc3RvcmUvdjEvcHJvZHVjdHMvY2F0ZWdvcmllcycpICYmXHJcbiAgICB1cmwuc2VhcmNoUGFyYW1zLmhhcygncGVyX3BhZ2UnKSxcclxuICBuZXcgTmV0d29ya0ZpcnN0KHtcclxuICAgIGNhY2hlTmFtZTogJ3dvb2NvbW1lcmNlLWFwaScsXHJcbiAgICBwbHVnaW5zOiBbXHJcbiAgICAgIG5ldyBFeHBpcmF0aW9uUGx1Z2luKHtcclxuICAgICAgICBtYXhFbnRyaWVzOiA1MCxcclxuICAgICAgICBtYXhBZ2VTZWNvbmRzOiAyNCAqIDYwICogNjAsIC8vIDEgZGF5XHJcbiAgICAgIH0pLFxyXG4gICAgXSxcclxuICB9KVxyXG4pKi9cclxucmVnaXN0ZXJSb3V0ZShcclxuICAoeyB1cmwgfSkgPT5cclxuICAgIHVybC5vcmlnaW4gPT09ICdodHRwczovL251eHQubWVpZGFubS5jb20nICYmXHJcbiAgICAoXHJcbiAgICAgIHVybC5wYXRobmFtZSA9PT0gJy93cC1qc29uL3djL3N0b3JlL3YxL3Byb2R1Y3RzJyB8fFxyXG4gICAgICB1cmwucGF0aG5hbWUgPT09ICcvd3AtanNvbi93Yy9zdG9yZS92MS9wcm9kdWN0cy9jYXRlZ29yaWVzJ1xyXG4gICAgKSAmJlxyXG4gICAgdXJsLnNlYXJjaFBhcmFtcy5oYXMoJ3Blcl9wYWdlJyksXHJcbiAgbmV3IFN0YWxlV2hpbGVSZXZhbGlkYXRlKHtcclxuICAgIGNhY2hlTmFtZTogJ3dvb2NvbW1lcmNlLWFwaScsXHJcbiAgICBwbHVnaW5zOiBbXHJcbiAgICAgIG5ldyBFeHBpcmF0aW9uUGx1Z2luKHtcclxuICAgICAgICBtYXhFbnRyaWVzOiA1MCxcclxuICAgICAgICBtYXhBZ2VTZWNvbmRzOiAyNCAqIDYwICogNjAsIC8vIDEgZGF5XHJcbiAgICAgIH0pLFxyXG4gICAgXSxcclxuICB9KVxyXG4pO1xyXG5cclxuLypyZWdpc3RlclJvdXRlKFxyXG4gICh7IHVybCB9KSA9PlxyXG4gICAgICB1cmwub3JpZ2luID09PSAnaHR0cHM6Ly9udXh0Lm1laWRhbm0uY29tJyAmJlxyXG4gICAgdXJsLnBhdGhuYW1lID09PSAnL3dwLWpzb24vY3VzdG9tL3YxL3NlbycgJiZcclxuICAgIHVybC5zZWFyY2hQYXJhbXMuaGFzKCdwYXRoJyksXHJcbiAgbmV3IE5ldHdvcmtGaXJzdCh7XHJcbiAgICBjYWNoZU5hbWU6ICdzZW8tYXBpJyxcclxuICAgIHBsdWdpbnM6IFtcclxuICAgICAgbmV3IEV4cGlyYXRpb25QbHVnaW4oe1xyXG4gICAgICAgIG1heEVudHJpZXM6IDUwLFxyXG4gICAgICAgIG1heEFnZVNlY29uZHM6IDI0ICogNjAgKiA2MCwgLy8gMSBkYXlcclxuICAgICAgfSksXHJcbiAgICBdLFxyXG4gIH0pXHJcbikqL1xyXG5yZWdpc3RlclJvdXRlKFxyXG4gICh7IHVybCB9KSA9PlxyXG4gICAgdXJsLm9yaWdpbiA9PT0gJ2h0dHBzOi8vbnV4dC5tZWlkYW5tLmNvbScgJiZcclxuICAgIHVybC5wYXRobmFtZSA9PT0gJy93cC1qc29uL2N1c3RvbS92MS9zZW8nICYmXHJcbiAgICB1cmwuc2VhcmNoUGFyYW1zLmhhcygncGF0aCcpLFxyXG4gIG5ldyBTdGFsZVdoaWxlUmV2YWxpZGF0ZSh7XHJcbiAgICBjYWNoZU5hbWU6ICdzZW8tYXBpJyxcclxuICAgIHBsdWdpbnM6IFtcclxuICAgICAgbmV3IEV4cGlyYXRpb25QbHVnaW4oe1xyXG4gICAgICAgIG1heEVudHJpZXM6IDUwLFxyXG4gICAgICAgIG1heEFnZVNlY29uZHM6IDI0ICogNjAgKiA2MCwgLy8gMSBkYXlcclxuICAgICAgfSksXHJcbiAgICBdLFxyXG4gIH0pXHJcbik7XHJcbnNlbGYuYWRkRXZlbnRMaXN0ZW5lcignaW5zdGFsbCcsICgvKmV2ZW50Ki8pID0+IHtcclxuICBjb25zb2xlLmxvZygnXHVEODNEXHVERUUwXHVGRTBGIFNlcnZpY2UgV29ya2VyIGluc3RhbGxpbmcnKTtcclxuICBzZWxmLnNraXBXYWl0aW5nKCk7IC8vIE9wdGlvbmFsIGJ1dCB1c2VmdWxcclxufSk7XHJcblxyXG5zZWxmLmFkZEV2ZW50TGlzdGVuZXIoJ2FjdGl2YXRlJywgKGV2ZW50KSA9PiB7XHJcbiAgY29uc29sZS5sb2coJ1x1MjZBMSBTZXJ2aWNlIFdvcmtlciBhY3RpdmF0aW5nJyk7XHJcbiAgZXZlbnQud2FpdFVudGlsKHNlbGYuY2xpZW50cy5jbGFpbSgpKTsgLy8gT3B0aW9uYWxcclxufSk7XHJcblxyXG5zZWxmLmFkZEV2ZW50TGlzdGVuZXIoJ3B1c2gnLCBmdW5jdGlvbiAoZXZlbnQpIHtcclxuICBjb25zb2xlLmxvZygnW1NlcnZpY2UgV29ya2VyXSBQdXNoIFJlY2VpdmVkLicpO1xyXG4gIGNvbnN0IGRhdGEgPSBldmVudC5kYXRhLmpzb24oKTtcclxuICBjb25zb2xlLmxvZygnW1NlcnZpY2UgV29ya2VyXSBQdXNoIERhdGE6JywgZGF0YSk7XHJcblxyXG4gIGxldCB0YWcgPSAnb3JkZXItY29uZmlybWF0aW9uJztcclxuICBpZihkYXRhLnByb2R1Y3RfaWQpe1xyXG4gICAgICB0YWcgPSAncHJvZHVjdF8nK2RhdGEucHJvZHVjdF9pZCsnX3NhbGUnO1xyXG4gIH1cclxuICBjb25zdCBvcHRpb25zID0ge1xyXG4gICAgYm9keTogZGF0YS5ib2R5LFxyXG4gICAgaWNvbjogJy9pY29ucy9pY29uLTEyOHgxMjgucG5nJyxcclxuICAgIGJhZGdlOiAnL2ljb25zL2ljb24tMTI4eDEyOC5wbmcnLFxyXG4gICAgZGF0YTogZGF0YS5kYXRhLCAvLyA8LS0gXHUyNzA1IFRoaXMgaXMgY3JpdGljYWxcclxuICAgIHRhZzogdGFnLCAvLyBvcHRpb25hbDogcHJldmVudHMgZHVwbGljYXRlc1xyXG4gICAgcmVub3RpZnk6IGZhbHNlXHJcbiAgfTtcclxuXHJcbiAgZXZlbnQud2FpdFVudGlsKFxyXG4gICAgc2VsZi5yZWdpc3RyYXRpb24uc2hvd05vdGlmaWNhdGlvbihkYXRhLnRpdGxlLCBvcHRpb25zKVxyXG4gICk7XHJcbn0pO1xyXG5cclxuc2VsZi5hZGRFdmVudExpc3RlbmVyKCdub3RpZmljYXRpb25jbGljaycsIGZ1bmN0aW9uIChldmVudCkge1xyXG4gIGV2ZW50Lm5vdGlmaWNhdGlvbi5jbG9zZSgpO1xyXG4gIGNvbnN0IGNsaWNrVXJsID0gZXZlbnQubm90aWZpY2F0aW9uPy5kYXRhPy51cmwgfHwgJy8nO1xyXG5cclxuICBldmVudC53YWl0VW50aWwoXHJcbiAgICBjbGllbnRzLm1hdGNoQWxsKHsgdHlwZTogJ3dpbmRvdycsIGluY2x1ZGVVbmNvbnRyb2xsZWQ6IHRydWUgfSkudGhlbihjbGllbnRMaXN0ID0+IHtcclxuICAgICAgZm9yIChjb25zdCBjbGllbnQgb2YgY2xpZW50TGlzdCkge1xyXG4gICAgICAgIGlmIChjbGllbnQudXJsLmluY2x1ZGVzKHNlbGYubG9jYXRpb24ub3JpZ2luKSkge1xyXG4gICAgICAgICAgY2xpZW50LnBvc3RNZXNzYWdlKHsgYWN0aW9uOiAnbmF2aWdhdGUnLCB1cmw6IGNsaWNrVXJsIH0pO1xyXG4gICAgICAgICAgcmV0dXJuIGNsaWVudC5mb2N1cygpO1xyXG4gICAgICAgIH1cclxuICAgICAgfVxyXG5cclxuICAgICAgcmV0dXJuIGNsaWVudHMub3BlbldpbmRvdyhjbGlja1VybCk7XHJcbiAgICB9KVxyXG4gICk7XHJcbn0pO1xyXG5cclxuXHJcbi8vIFx1MjcwNSBOYXZpZ2F0aW9uIGZhbGxiYWNrIGZvciBTUEEgcm91dGluZ1xyXG5pZiAocHJvY2Vzcy5lbnYuTU9ERSAhPT0gJ3NzcicgfHwgcHJvY2Vzcy5lbnYuUFJPRCkge1xyXG4gIHJlZ2lzdGVyUm91dGUoXHJcbiAgICBuZXcgTmF2aWdhdGlvblJvdXRlKFxyXG4gICAgICAvL2NyZWF0ZUhhbmRsZXJCb3VuZFRvVVJMKHByb2Nlc3MuZW52LlBXQV9GQUxMQkFDS19IVE1MKSxcclxuICAgICAgY3JlYXRlSGFuZGxlckJvdW5kVG9VUkwocHJvY2Vzcy5lbnYuUFdBX0ZBTExCQUNLX0hUTUwpLFxyXG4gICAgICB7XHJcbiAgICAgICAgZGVueWxpc3Q6IFtcclxuICAgICAgICAgIG5ldyBSZWdFeHAocHJvY2Vzcy5lbnYuUFdBX1NFUlZJQ0VfV09SS0VSX1JFR0VYKSxcclxuICAgICAgICAgIC93b3JrYm94LSguKSpcXC5qcyQvXHJcbiAgICAgICAgXVxyXG4gICAgICB9XHJcbiAgICApXHJcbiAgKVxyXG59XHJcblxyXG4iXSwKICAibWFwcGluZ3MiOiAiOztBQUVBLE1BQUk7QUFDQSxTQUFLLG9CQUFvQixLQUFLLEVBQUU7QUFBQSxFQUNwQyxTQUNPLEdBQUc7QUFBQSxFQUFFOzs7QUNFWixNQUFNLFNBQVUsUUFDVixRQUNDLE1BQU07QUFHTCxRQUFJLEVBQUUsMkJBQTJCLGFBQWE7QUFDMUMsV0FBSyx3QkFBd0I7QUFBQSxJQUNqQztBQUNBLFFBQUksVUFBVTtBQUNkLFVBQU0sbUJBQW1CO0FBQUEsTUFDckIsT0FBTztBQUFBLE1BQ1AsS0FBSztBQUFBLE1BQ0wsTUFBTTtBQUFB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QUEsTUFDSixRQUFRLFNBQVMsRUFBRSxNQUFNLFVBQVUscUJBQXFCLEtBQUssQ0FBQyxFQUFFLEtBQUssZ0JBQWM7QUFDakYsbUJBQVcsVUFBVSxZQUFZO0FBQy9CLGNBQUksT0FBTyxJQUFJLFNBQVMsS0FBSyxTQUFTLE1BQU0sR0FBRztBQUM3QyxtQkFBTyxZQUFZLEVBQUUsUUFBUSxZQUFZLEtBQUssU0FBUyxDQUFDO0FBQ3hELG1CQUFPLE9BQU8sTUFBTTtBQUFBLFVBQ3RCO0FBQUEsUUFDRjtBQUVBLGVBQU8sUUFBUSxXQUFXLFFBQVE7QUFBQSxNQUNwQyxDQUFDO0FBQUEsSUFDSDtBQUFBLEVBQ0YsQ0FBQztBQUlELE1BQWtDLE9BQWtCO0FBQ2xEO0FBQUEsTUFDRSxJQUFJO0FBQUE7QUFBQSxRQUVGLHdCQUF3QixZQUE2QjtBQUFBLFFBQ3JEO0FBQUEsVUFDRSxVQUFVO0FBQUEsWUFDUixJQUFJLE9BQU8sVUFBb0M7QUFBQSxZQUMvQztBQUFBLFVBQ0Y7QUFBQSxRQUNGO0FBQUEsTUFDRjtBQUFBLElBQ0Y7QUFBQSxFQUNGOyIsCiAgIm5hbWVzIjogWyJwcmVjYWNoZUNvbnRyb2xsZXIiLCAiZXJyb3IiLCAiZGVmYXVsdFJvdXRlciIsICJwcmVjYWNoZUNvbnRyb2xsZXIiLCAicHJlY2FjaGVDb250cm9sbGVyIiwgImNhY2hlTmFtZXMiLCAicHJlY2FjaGVDb250cm9sbGVyIiwgIm1lc3NhZ2VzIiwgIm1lc3NhZ2VzIiwgInRhcmdldCJdCn0K
