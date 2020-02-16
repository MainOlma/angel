// modules are defined as an array
// [ module function, map of requires ]
//
// map of requires is short require name -> numeric require
//
// anything defined in a previous bundle is accessed via the
// orig method which is the require for previous bundles
parcelRequire = (function (modules, cache, entry, globalName) {
  // Save the require from previous bundle to this closure if any
  var previousRequire = typeof parcelRequire === 'function' && parcelRequire;
  var nodeRequire = typeof require === 'function' && require;

  function newRequire(name, jumped) {
    if (!cache[name]) {
      if (!modules[name]) {
        // if we cannot find the module within our internal map or
        // cache jump to the current global require ie. the last bundle
        // that was added to the page.
        var currentRequire = typeof parcelRequire === 'function' && parcelRequire;
        if (!jumped && currentRequire) {
          return currentRequire(name, true);
        }

        // If there are other bundles on this page the require from the
        // previous one is saved to 'previousRequire'. Repeat this as
        // many times as there are bundles until the module is found or
        // we exhaust the require chain.
        if (previousRequire) {
          return previousRequire(name, true);
        }

        // Try the node require function if it exists.
        if (nodeRequire && typeof name === 'string') {
          return nodeRequire(name);
        }

        var err = new Error('Cannot find module \'' + name + '\'');
        err.code = 'MODULE_NOT_FOUND';
        throw err;
      }

      localRequire.resolve = resolve;
      localRequire.cache = {};

      var module = cache[name] = new newRequire.Module(name);

      modules[name][0].call(module.exports, localRequire, module, module.exports, this);
    }

    return cache[name].exports;

    function localRequire(x){
      return newRequire(localRequire.resolve(x));
    }

    function resolve(x){
      return modules[name][1][x] || x;
    }
  }

  function Module(moduleName) {
    this.id = moduleName;
    this.bundle = newRequire;
    this.exports = {};
  }

  newRequire.isParcelRequire = true;
  newRequire.Module = Module;
  newRequire.modules = modules;
  newRequire.cache = cache;
  newRequire.parent = previousRequire;
  newRequire.register = function (id, exports) {
    modules[id] = [function (require, module) {
      module.exports = exports;
    }, {}];
  };

  var error;
  for (var i = 0; i < entry.length; i++) {
    try {
      newRequire(entry[i]);
    } catch (e) {
      // Save first error but execute all entries
      if (!error) {
        error = e;
      }
    }
  }

  if (entry.length) {
    // Expose entry point to Node, AMD or browser globals
    // Based on https://github.com/ForbesLindesay/umd/blob/master/template.js
    var mainExports = newRequire(entry[entry.length - 1]);

    // CommonJS
    if (typeof exports === "object" && typeof module !== "undefined") {
      module.exports = mainExports;

    // RequireJS
    } else if (typeof define === "function" && define.amd) {
     define(function () {
       return mainExports;
     });

    // <script>
    } else if (globalName) {
      this[globalName] = mainExports;
    }
  }

  // Override the current require with this new one
  parcelRequire = newRequire;

  if (error) {
    // throw error from earlier, _after updating parcelRequire_
    throw error;
  }

  return newRequire;
})({"NqYy":[function(require,module,exports) {
var APP_PREFIX = 'ApplicationName_'; // Identifier for this app (this needs to be consistent across every cache update)

var VERSION = 'version_01'; // Version of the off-line cache (change this value everytime you want to update cache)

var CACHE_NAME = APP_PREFIX + VERSION;
var URLS = [// Add URL you want to cache in this list.
'/angel/', // If you have separate JS/CSS files,
'/angel/index.html' // add path to those files here
]; // Respond with cached resources

self.addEventListener('fetch', function (e) {
  console.log('fetch request : ' + e.request.url);
  e.respondWith(caches.match(e.request).then(function (request) {
    if (request) {
      // if cache is available, respond with cache
      console.log('responding with cache : ' + e.request.url);
      return request;
    } else {
      // if there are no cache, try fetching request
      console.log('file is not cached, fetching : ' + e.request.url);
      return fetch(e.request);
    } // You can omit if/else for console.log & put one line below like this too.
    // return request || fetch(e.request)

  }));
}); // Cache resources

self.addEventListener('install', function (e) {
  e.waitUntil(caches.open(CACHE_NAME).then(function (cache) {
    console.log('installing cache : ' + CACHE_NAME);
    return cache.addAll(URLS);
  }));
}); // Delete outdated caches

self.addEventListener('activate', function (e) {
  e.waitUntil(caches.keys().then(function (keyList) {
    // `keyList` contains all cache names under your username.github.io
    // filter out ones that has this app prefix to create white list
    var cacheWhitelist = keyList.filter(function (key) {
      return key.indexOf(APP_PREFIX);
    }); // add current cache name to white list

    cacheWhitelist.push(CACHE_NAME);
    return Promise.all(keyList.map(function (key, i) {
      if (cacheWhitelist.indexOf(key) === -1) {
        console.log('deleting cache : ' + keyList[i]);
        return caches.delete(keyList[i]);
      }
    }));
  }));
});
},{}]},{},["NqYy"], null)