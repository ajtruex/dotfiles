(function (global, factory) {
  typeof exports === 'object' && typeof module !== 'undefined' ? factory(exports, require('blockstack'), require('bitcoinjs-lib'), require('process'), require('fs'), require('winston'), require('cors'), require('bn.js'), require('crypto'), require('bip39'), require('express'), require('path'), require('inquirer'), require('node-fetch'), require('@stacks/transactions'), require('@stacks/network'), require('cross-fetch'), require('@stacks/stacking'), require('@stacks/blockchain-api-client'), require('url'), require('readline'), require('stream'), require('jsontokens'), require('ajv'), require('bip32'), require('blockstack/lib/network'), require('@stacks/storage')) :
  typeof define === 'function' && define.amd ? define(['exports', 'blockstack', 'bitcoinjs-lib', 'process', 'fs', 'winston', 'cors', 'bn.js', 'crypto', 'bip39', 'express', 'path', 'inquirer', 'node-fetch', '@stacks/transactions', '@stacks/network', 'cross-fetch', '@stacks/stacking', '@stacks/blockchain-api-client', 'url', 'readline', 'stream', 'jsontokens', 'ajv', 'bip32', 'blockstack/lib/network', '@stacks/storage'], factory) :
  (global = typeof globalThis !== 'undefined' ? globalThis : global || self, factory(global['@stacks/cli'] = {}, global.blockstack, global.bitcoin, global.process$1, global.fs, global.logger, global.cors, global.BN$1, global.crypto, global.bip39, global.express, global.path, global.inquirer, global.fetch, global.transactions, global.network$1, global.crossfetch, global.stacking, global.blockchainApiClient, global.URL, global.readline, global.stream, global.jsontokens, global.Ajv, global.bip32, global.network, global.storage));
}(this, (function (exports, blockstack, bitcoin, process$1, fs, logger, cors, BN$1, crypto, bip39, express, path, inquirer, fetch, transactions, network$1, crossfetch, stacking, blockchainApiClient, URL, readline, stream, jsontokens, Ajv, bip32, network, storage) { 'use strict';

  function _interopDefaultLegacy (e) { return e && typeof e === 'object' && 'default' in e ? e : { 'default': e }; }

  var blockstack__default = /*#__PURE__*/_interopDefaultLegacy(blockstack);
  var cors__default = /*#__PURE__*/_interopDefaultLegacy(cors);
  var BN__default = /*#__PURE__*/_interopDefaultLegacy(BN$1);
  var express__default = /*#__PURE__*/_interopDefaultLegacy(express);
  var fetch__default = /*#__PURE__*/_interopDefaultLegacy(fetch);
  var crossfetch__default = /*#__PURE__*/_interopDefaultLegacy(crossfetch);
  var Ajv__default = /*#__PURE__*/_interopDefaultLegacy(Ajv);

  function asyncGeneratorStep(gen, resolve, reject, _next, _throw, key, arg) {
    try {
      var info = gen[key](arg);
      var value = info.value;
    } catch (error) {
      reject(error);
      return;
    }

    if (info.done) {
      resolve(value);
    } else {
      Promise.resolve(value).then(_next, _throw);
    }
  }

  function _asyncToGenerator(fn) {
    return function () {
      var self = this,
          args = arguments;
      return new Promise(function (resolve, reject) {
        var gen = fn.apply(self, args);

        function _next(value) {
          asyncGeneratorStep(gen, resolve, reject, _next, _throw, "next", value);
        }

        function _throw(err) {
          asyncGeneratorStep(gen, resolve, reject, _next, _throw, "throw", err);
        }

        _next(undefined);
      });
    };
  }

  function _inheritsLoose(subClass, superClass) {
    subClass.prototype = Object.create(superClass.prototype);
    subClass.prototype.constructor = subClass;
    subClass.__proto__ = superClass;
  }

  function _unsupportedIterableToArray(o, minLen) {
    if (!o) return;
    if (typeof o === "string") return _arrayLikeToArray(o, minLen);
    var n = Object.prototype.toString.call(o).slice(8, -1);
    if (n === "Object" && o.constructor) n = o.constructor.name;
    if (n === "Map" || n === "Set") return Array.from(o);
    if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray(o, minLen);
  }

  function _arrayLikeToArray(arr, len) {
    if (len == null || len > arr.length) len = arr.length;

    for (var i = 0, arr2 = new Array(len); i < len; i++) arr2[i] = arr[i];

    return arr2;
  }

  function _createForOfIteratorHelperLoose(o, allowArrayLike) {
    var it;

    if (typeof Symbol === "undefined" || o[Symbol.iterator] == null) {
      if (Array.isArray(o) || (it = _unsupportedIterableToArray(o)) || allowArrayLike && o && typeof o.length === "number") {
        if (it) o = it;
        var i = 0;
        return function () {
          if (i >= o.length) return {
            done: true
          };
          return {
            done: false,
            value: o[i++]
          };
        };
      }

      throw new TypeError("Invalid attempt to iterate non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.");
    }

    it = o[Symbol.iterator]();
    return it.next.bind(it);
  }

  function createCommonjsModule(fn, module) {
  	return module = { exports: {} }, fn(module, module.exports), module.exports;
  }

  var runtime_1 = /*#__PURE__*/createCommonjsModule(function (module) {
    /**
     * Copyright (c) 2014-present, Facebook, Inc.
     *
     * This source code is licensed under the MIT license found in the
     * LICENSE file in the root directory of this source tree.
     */
    var runtime = function (exports) {

      var Op = Object.prototype;
      var hasOwn = Op.hasOwnProperty;
      var undefined$1; // More compressible than void 0.

      var $Symbol = typeof Symbol === "function" ? Symbol : {};
      var iteratorSymbol = $Symbol.iterator || "@@iterator";
      var asyncIteratorSymbol = $Symbol.asyncIterator || "@@asyncIterator";
      var toStringTagSymbol = $Symbol.toStringTag || "@@toStringTag";

      function define(obj, key, value) {
        Object.defineProperty(obj, key, {
          value: value,
          enumerable: true,
          configurable: true,
          writable: true
        });
        return obj[key];
      }

      try {
        // IE 8 has a broken Object.defineProperty that only works on DOM objects.
        define({}, "");
      } catch (err) {
        define = function define(obj, key, value) {
          return obj[key] = value;
        };
      }

      function wrap(innerFn, outerFn, self, tryLocsList) {
        // If outerFn provided and outerFn.prototype is a Generator, then outerFn.prototype instanceof Generator.
        var protoGenerator = outerFn && outerFn.prototype instanceof Generator ? outerFn : Generator;
        var generator = Object.create(protoGenerator.prototype);
        var context = new Context(tryLocsList || []); // The ._invoke method unifies the implementations of the .next,
        // .throw, and .return methods.

        generator._invoke = makeInvokeMethod(innerFn, self, context);
        return generator;
      }

      exports.wrap = wrap; // Try/catch helper to minimize deoptimizations. Returns a completion
      // record like context.tryEntries[i].completion. This interface could
      // have been (and was previously) designed to take a closure to be
      // invoked without arguments, but in all the cases we care about we
      // already have an existing method we want to call, so there's no need
      // to create a new function object. We can even get away with assuming
      // the method takes exactly one argument, since that happens to be true
      // in every case, so we don't have to touch the arguments object. The
      // only additional allocation required is the completion record, which
      // has a stable shape and so hopefully should be cheap to allocate.

      function tryCatch(fn, obj, arg) {
        try {
          return {
            type: "normal",
            arg: fn.call(obj, arg)
          };
        } catch (err) {
          return {
            type: "throw",
            arg: err
          };
        }
      }

      var GenStateSuspendedStart = "suspendedStart";
      var GenStateSuspendedYield = "suspendedYield";
      var GenStateExecuting = "executing";
      var GenStateCompleted = "completed"; // Returning this object from the innerFn has the same effect as
      // breaking out of the dispatch switch statement.

      var ContinueSentinel = {}; // Dummy constructor functions that we use as the .constructor and
      // .constructor.prototype properties for functions that return Generator
      // objects. For full spec compliance, you may wish to configure your
      // minifier not to mangle the names of these two functions.

      function Generator() {}

      function GeneratorFunction() {}

      function GeneratorFunctionPrototype() {} // This is a polyfill for %IteratorPrototype% for environments that
      // don't natively support it.


      var IteratorPrototype = {};

      IteratorPrototype[iteratorSymbol] = function () {
        return this;
      };

      var getProto = Object.getPrototypeOf;
      var NativeIteratorPrototype = getProto && getProto(getProto(values([])));

      if (NativeIteratorPrototype && NativeIteratorPrototype !== Op && hasOwn.call(NativeIteratorPrototype, iteratorSymbol)) {
        // This environment has a native %IteratorPrototype%; use it instead
        // of the polyfill.
        IteratorPrototype = NativeIteratorPrototype;
      }

      var Gp = GeneratorFunctionPrototype.prototype = Generator.prototype = Object.create(IteratorPrototype);
      GeneratorFunction.prototype = Gp.constructor = GeneratorFunctionPrototype;
      GeneratorFunctionPrototype.constructor = GeneratorFunction;
      GeneratorFunction.displayName = define(GeneratorFunctionPrototype, toStringTagSymbol, "GeneratorFunction"); // Helper for defining the .next, .throw, and .return methods of the
      // Iterator interface in terms of a single ._invoke method.

      function defineIteratorMethods(prototype) {
        ["next", "throw", "return"].forEach(function (method) {
          define(prototype, method, function (arg) {
            return this._invoke(method, arg);
          });
        });
      }

      exports.isGeneratorFunction = function (genFun) {
        var ctor = typeof genFun === "function" && genFun.constructor;
        return ctor ? ctor === GeneratorFunction || // For the native GeneratorFunction constructor, the best we can
        // do is to check its .name property.
        (ctor.displayName || ctor.name) === "GeneratorFunction" : false;
      };

      exports.mark = function (genFun) {
        if (Object.setPrototypeOf) {
          Object.setPrototypeOf(genFun, GeneratorFunctionPrototype);
        } else {
          genFun.__proto__ = GeneratorFunctionPrototype;
          define(genFun, toStringTagSymbol, "GeneratorFunction");
        }

        genFun.prototype = Object.create(Gp);
        return genFun;
      }; // Within the body of any async function, `await x` is transformed to
      // `yield regeneratorRuntime.awrap(x)`, so that the runtime can test
      // `hasOwn.call(value, "__await")` to determine if the yielded value is
      // meant to be awaited.


      exports.awrap = function (arg) {
        return {
          __await: arg
        };
      };

      function AsyncIterator(generator, PromiseImpl) {
        function invoke(method, arg, resolve, reject) {
          var record = tryCatch(generator[method], generator, arg);

          if (record.type === "throw") {
            reject(record.arg);
          } else {
            var result = record.arg;
            var value = result.value;

            if (value && typeof value === "object" && hasOwn.call(value, "__await")) {
              return PromiseImpl.resolve(value.__await).then(function (value) {
                invoke("next", value, resolve, reject);
              }, function (err) {
                invoke("throw", err, resolve, reject);
              });
            }

            return PromiseImpl.resolve(value).then(function (unwrapped) {
              // When a yielded Promise is resolved, its final value becomes
              // the .value of the Promise<{value,done}> result for the
              // current iteration.
              result.value = unwrapped;
              resolve(result);
            }, function (error) {
              // If a rejected Promise was yielded, throw the rejection back
              // into the async generator function so it can be handled there.
              return invoke("throw", error, resolve, reject);
            });
          }
        }

        var previousPromise;

        function enqueue(method, arg) {
          function callInvokeWithMethodAndArg() {
            return new PromiseImpl(function (resolve, reject) {
              invoke(method, arg, resolve, reject);
            });
          }

          return previousPromise = // If enqueue has been called before, then we want to wait until
          // all previous Promises have been resolved before calling invoke,
          // so that results are always delivered in the correct order. If
          // enqueue has not been called before, then it is important to
          // call invoke immediately, without waiting on a callback to fire,
          // so that the async generator function has the opportunity to do
          // any necessary setup in a predictable way. This predictability
          // is why the Promise constructor synchronously invokes its
          // executor callback, and why async functions synchronously
          // execute code before the first await. Since we implement simple
          // async functions in terms of async generators, it is especially
          // important to get this right, even though it requires care.
          previousPromise ? previousPromise.then(callInvokeWithMethodAndArg, // Avoid propagating failures to Promises returned by later
          // invocations of the iterator.
          callInvokeWithMethodAndArg) : callInvokeWithMethodAndArg();
        } // Define the unified helper method that is used to implement .next,
        // .throw, and .return (see defineIteratorMethods).


        this._invoke = enqueue;
      }

      defineIteratorMethods(AsyncIterator.prototype);

      AsyncIterator.prototype[asyncIteratorSymbol] = function () {
        return this;
      };

      exports.AsyncIterator = AsyncIterator; // Note that simple async functions are implemented on top of
      // AsyncIterator objects; they just return a Promise for the value of
      // the final result produced by the iterator.

      exports.async = function (innerFn, outerFn, self, tryLocsList, PromiseImpl) {
        if (PromiseImpl === void 0) PromiseImpl = Promise;
        var iter = new AsyncIterator(wrap(innerFn, outerFn, self, tryLocsList), PromiseImpl);
        return exports.isGeneratorFunction(outerFn) ? iter // If outerFn is a generator, return the full iterator.
        : iter.next().then(function (result) {
          return result.done ? result.value : iter.next();
        });
      };

      function makeInvokeMethod(innerFn, self, context) {
        var state = GenStateSuspendedStart;
        return function invoke(method, arg) {
          if (state === GenStateExecuting) {
            throw new Error("Generator is already running");
          }

          if (state === GenStateCompleted) {
            if (method === "throw") {
              throw arg;
            } // Be forgiving, per 25.3.3.3.3 of the spec:
            // https://people.mozilla.org/~jorendorff/es6-draft.html#sec-generatorresume


            return doneResult();
          }

          context.method = method;
          context.arg = arg;

          while (true) {
            var delegate = context.delegate;

            if (delegate) {
              var delegateResult = maybeInvokeDelegate(delegate, context);

              if (delegateResult) {
                if (delegateResult === ContinueSentinel) continue;
                return delegateResult;
              }
            }

            if (context.method === "next") {
              // Setting context._sent for legacy support of Babel's
              // function.sent implementation.
              context.sent = context._sent = context.arg;
            } else if (context.method === "throw") {
              if (state === GenStateSuspendedStart) {
                state = GenStateCompleted;
                throw context.arg;
              }

              context.dispatchException(context.arg);
            } else if (context.method === "return") {
              context.abrupt("return", context.arg);
            }

            state = GenStateExecuting;
            var record = tryCatch(innerFn, self, context);

            if (record.type === "normal") {
              // If an exception is thrown from innerFn, we leave state ===
              // GenStateExecuting and loop back for another invocation.
              state = context.done ? GenStateCompleted : GenStateSuspendedYield;

              if (record.arg === ContinueSentinel) {
                continue;
              }

              return {
                value: record.arg,
                done: context.done
              };
            } else if (record.type === "throw") {
              state = GenStateCompleted; // Dispatch the exception by looping back around to the
              // context.dispatchException(context.arg) call above.

              context.method = "throw";
              context.arg = record.arg;
            }
          }
        };
      } // Call delegate.iterator[context.method](context.arg) and handle the
      // result, either by returning a { value, done } result from the
      // delegate iterator, or by modifying context.method and context.arg,
      // setting context.delegate to null, and returning the ContinueSentinel.


      function maybeInvokeDelegate(delegate, context) {
        var method = delegate.iterator[context.method];

        if (method === undefined$1) {
          // A .throw or .return when the delegate iterator has no .throw
          // method always terminates the yield* loop.
          context.delegate = null;

          if (context.method === "throw") {
            // Note: ["return"] must be used for ES3 parsing compatibility.
            if (delegate.iterator["return"]) {
              // If the delegate iterator has a return method, give it a
              // chance to clean up.
              context.method = "return";
              context.arg = undefined$1;
              maybeInvokeDelegate(delegate, context);

              if (context.method === "throw") {
                // If maybeInvokeDelegate(context) changed context.method from
                // "return" to "throw", let that override the TypeError below.
                return ContinueSentinel;
              }
            }

            context.method = "throw";
            context.arg = new TypeError("The iterator does not provide a 'throw' method");
          }

          return ContinueSentinel;
        }

        var record = tryCatch(method, delegate.iterator, context.arg);

        if (record.type === "throw") {
          context.method = "throw";
          context.arg = record.arg;
          context.delegate = null;
          return ContinueSentinel;
        }

        var info = record.arg;

        if (!info) {
          context.method = "throw";
          context.arg = new TypeError("iterator result is not an object");
          context.delegate = null;
          return ContinueSentinel;
        }

        if (info.done) {
          // Assign the result of the finished delegate to the temporary
          // variable specified by delegate.resultName (see delegateYield).
          context[delegate.resultName] = info.value; // Resume execution at the desired location (see delegateYield).

          context.next = delegate.nextLoc; // If context.method was "throw" but the delegate handled the
          // exception, let the outer generator proceed normally. If
          // context.method was "next", forget context.arg since it has been
          // "consumed" by the delegate iterator. If context.method was
          // "return", allow the original .return call to continue in the
          // outer generator.

          if (context.method !== "return") {
            context.method = "next";
            context.arg = undefined$1;
          }
        } else {
          // Re-yield the result returned by the delegate method.
          return info;
        } // The delegate iterator is finished, so forget it and continue with
        // the outer generator.


        context.delegate = null;
        return ContinueSentinel;
      } // Define Generator.prototype.{next,throw,return} in terms of the
      // unified ._invoke helper method.


      defineIteratorMethods(Gp);
      define(Gp, toStringTagSymbol, "Generator"); // A Generator should always return itself as the iterator object when the
      // @@iterator function is called on it. Some browsers' implementations of the
      // iterator prototype chain incorrectly implement this, causing the Generator
      // object to not be returned from this call. This ensures that doesn't happen.
      // See https://github.com/facebook/regenerator/issues/274 for more details.

      Gp[iteratorSymbol] = function () {
        return this;
      };

      Gp.toString = function () {
        return "[object Generator]";
      };

      function pushTryEntry(locs) {
        var entry = {
          tryLoc: locs[0]
        };

        if (1 in locs) {
          entry.catchLoc = locs[1];
        }

        if (2 in locs) {
          entry.finallyLoc = locs[2];
          entry.afterLoc = locs[3];
        }

        this.tryEntries.push(entry);
      }

      function resetTryEntry(entry) {
        var record = entry.completion || {};
        record.type = "normal";
        delete record.arg;
        entry.completion = record;
      }

      function Context(tryLocsList) {
        // The root entry object (effectively a try statement without a catch
        // or a finally block) gives us a place to store values thrown from
        // locations where there is no enclosing try statement.
        this.tryEntries = [{
          tryLoc: "root"
        }];
        tryLocsList.forEach(pushTryEntry, this);
        this.reset(true);
      }

      exports.keys = function (object) {
        var keys = [];

        for (var key in object) {
          keys.push(key);
        }

        keys.reverse(); // Rather than returning an object with a next method, we keep
        // things simple and return the next function itself.

        return function next() {
          while (keys.length) {
            var key = keys.pop();

            if (key in object) {
              next.value = key;
              next.done = false;
              return next;
            }
          } // To avoid creating an additional object, we just hang the .value
          // and .done properties off the next function object itself. This
          // also ensures that the minifier will not anonymize the function.


          next.done = true;
          return next;
        };
      };

      function values(iterable) {
        if (iterable) {
          var iteratorMethod = iterable[iteratorSymbol];

          if (iteratorMethod) {
            return iteratorMethod.call(iterable);
          }

          if (typeof iterable.next === "function") {
            return iterable;
          }

          if (!isNaN(iterable.length)) {
            var i = -1,
                next = function next() {
              while (++i < iterable.length) {
                if (hasOwn.call(iterable, i)) {
                  next.value = iterable[i];
                  next.done = false;
                  return next;
                }
              }

              next.value = undefined$1;
              next.done = true;
              return next;
            };

            return next.next = next;
          }
        } // Return an iterator with no values.


        return {
          next: doneResult
        };
      }

      exports.values = values;

      function doneResult() {
        return {
          value: undefined$1,
          done: true
        };
      }

      Context.prototype = {
        constructor: Context,
        reset: function reset(skipTempReset) {
          this.prev = 0;
          this.next = 0; // Resetting context._sent for legacy support of Babel's
          // function.sent implementation.

          this.sent = this._sent = undefined$1;
          this.done = false;
          this.delegate = null;
          this.method = "next";
          this.arg = undefined$1;
          this.tryEntries.forEach(resetTryEntry);

          if (!skipTempReset) {
            for (var name in this) {
              // Not sure about the optimal order of these conditions:
              if (name.charAt(0) === "t" && hasOwn.call(this, name) && !isNaN(+name.slice(1))) {
                this[name] = undefined$1;
              }
            }
          }
        },
        stop: function stop() {
          this.done = true;
          var rootEntry = this.tryEntries[0];
          var rootRecord = rootEntry.completion;

          if (rootRecord.type === "throw") {
            throw rootRecord.arg;
          }

          return this.rval;
        },
        dispatchException: function dispatchException(exception) {
          if (this.done) {
            throw exception;
          }

          var context = this;

          function handle(loc, caught) {
            record.type = "throw";
            record.arg = exception;
            context.next = loc;

            if (caught) {
              // If the dispatched exception was caught by a catch block,
              // then let that catch block handle the exception normally.
              context.method = "next";
              context.arg = undefined$1;
            }

            return !!caught;
          }

          for (var i = this.tryEntries.length - 1; i >= 0; --i) {
            var entry = this.tryEntries[i];
            var record = entry.completion;

            if (entry.tryLoc === "root") {
              // Exception thrown outside of any try block that could handle
              // it, so set the completion value of the entire function to
              // throw the exception.
              return handle("end");
            }

            if (entry.tryLoc <= this.prev) {
              var hasCatch = hasOwn.call(entry, "catchLoc");
              var hasFinally = hasOwn.call(entry, "finallyLoc");

              if (hasCatch && hasFinally) {
                if (this.prev < entry.catchLoc) {
                  return handle(entry.catchLoc, true);
                } else if (this.prev < entry.finallyLoc) {
                  return handle(entry.finallyLoc);
                }
              } else if (hasCatch) {
                if (this.prev < entry.catchLoc) {
                  return handle(entry.catchLoc, true);
                }
              } else if (hasFinally) {
                if (this.prev < entry.finallyLoc) {
                  return handle(entry.finallyLoc);
                }
              } else {
                throw new Error("try statement without catch or finally");
              }
            }
          }
        },
        abrupt: function abrupt(type, arg) {
          for (var i = this.tryEntries.length - 1; i >= 0; --i) {
            var entry = this.tryEntries[i];

            if (entry.tryLoc <= this.prev && hasOwn.call(entry, "finallyLoc") && this.prev < entry.finallyLoc) {
              var finallyEntry = entry;
              break;
            }
          }

          if (finallyEntry && (type === "break" || type === "continue") && finallyEntry.tryLoc <= arg && arg <= finallyEntry.finallyLoc) {
            // Ignore the finally entry if control is not jumping to a
            // location outside the try/catch block.
            finallyEntry = null;
          }

          var record = finallyEntry ? finallyEntry.completion : {};
          record.type = type;
          record.arg = arg;

          if (finallyEntry) {
            this.method = "next";
            this.next = finallyEntry.finallyLoc;
            return ContinueSentinel;
          }

          return this.complete(record);
        },
        complete: function complete(record, afterLoc) {
          if (record.type === "throw") {
            throw record.arg;
          }

          if (record.type === "break" || record.type === "continue") {
            this.next = record.arg;
          } else if (record.type === "return") {
            this.rval = this.arg = record.arg;
            this.method = "return";
            this.next = "end";
          } else if (record.type === "normal" && afterLoc) {
            this.next = afterLoc;
          }

          return ContinueSentinel;
        },
        finish: function finish(finallyLoc) {
          for (var i = this.tryEntries.length - 1; i >= 0; --i) {
            var entry = this.tryEntries[i];

            if (entry.finallyLoc === finallyLoc) {
              this.complete(entry.completion, entry.afterLoc);
              resetTryEntry(entry);
              return ContinueSentinel;
            }
          }
        },
        "catch": function _catch(tryLoc) {
          for (var i = this.tryEntries.length - 1; i >= 0; --i) {
            var entry = this.tryEntries[i];

            if (entry.tryLoc === tryLoc) {
              var record = entry.completion;

              if (record.type === "throw") {
                var thrown = record.arg;
                resetTryEntry(entry);
              }

              return thrown;
            }
          } // The context.catch method must only be called with a location
          // argument that corresponds to a known catch block.


          throw new Error("illegal catch attempt");
        },
        delegateYield: function delegateYield(iterable, resultName, nextLoc) {
          this.delegate = {
            iterator: values(iterable),
            resultName: resultName,
            nextLoc: nextLoc
          };

          if (this.method === "next") {
            // Deliberately forget the last sent value so that we don't
            // accidentally pass it on to the delegate.
            this.arg = undefined$1;
          }

          return ContinueSentinel;
        }
      }; // Regardless of whether this script is executing as a CommonJS module
      // or not, return the runtime object so that we can declare the variable
      // regeneratorRuntime in the outer scope, which allows this module to be
      // injected easily by `bin/regenerator --include-runtime script.js`.

      return exports;
    }( // If this script is executing as a CommonJS module, use module.exports
    // as the regeneratorRuntime namespace. Otherwise create a new empty
    // object. Either way, the resulting object will be used to initialize
    // the regeneratorRuntime variable at the top of this file.
     module.exports );

    try {
      regeneratorRuntime = runtime;
    } catch (accidentalStrictMode) {
      // This module should not be running in strict mode, so the above
      // assignment should always work unless something is misconfigured. Just
      // in case runtime.js accidentally runs in strict mode, we can escape
      // strict mode using a global Function call. This could conceivably fail
      // if a Content Security Policy forbids using Function, but in that case
      // the proper solution is to fix the accidental strict mode problem. If
      // you've misconfigured your bundler to force strict mode and applied a
      // CSP to forbid Function, and you're not willing to fix either of those
      // problems, please detail your unique predicament in a GitHub issue.
      Function("r", "regeneratorRuntime = r")(runtime);
    }
  });

  var NAME_PATTERN = '^([0-9a-z_.+-]{3,37})$';
  var NAMESPACE_PATTERN = '^([0-9a-z_-]{1,19})$';
  var ADDRESS_CHARS = '[123456789ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnopqrstuvwxyz]{1,35}';
  var C32_ADDRESS_CHARS = '[0123456789ABCDEFGHJKMNPQRSTVWXYZ]+';
  var ADDRESS_PATTERN = "^(" + ADDRESS_CHARS + ")$";
  var ID_ADDRESS_PATTERN = "^ID-" + ADDRESS_CHARS + "$";
  var STACKS_ADDRESS_PATTERN = "^(" + C32_ADDRESS_CHARS + ")$";
  var PRIVATE_KEY_PATTERN = '^([0-9a-f]{64,66})$';
  var PRIVATE_KEY_UNCOMPRESSED_PATTERN = '^([0-9a-f]{64})$';
  var PRIVATE_KEY_NOSIGN_PATTERN = "^nosign:" + ADDRESS_CHARS + "$";
  var PRIVATE_KEY_MULTISIG_PATTERN = '^([0-9]+),([0-9a-f]{64,66},)*([0-9a-f]{64,66})$';
  var PRIVATE_KEY_SEGWIT_P2SH_PATTERN = '^segwit:p2sh:([0-9]+),([0-9a-f]{64,66},)*([0-9a-f]{64,66})$';
  var PRIVATE_KEY_PATTERN_ANY = PRIVATE_KEY_PATTERN + "|" + PRIVATE_KEY_MULTISIG_PATTERN + "|" + PRIVATE_KEY_SEGWIT_P2SH_PATTERN + "|" + PRIVATE_KEY_NOSIGN_PATTERN;
  var PUBLIC_KEY_PATTERN = '^([0-9a-f]{66,130})$';
  var INT_PATTERN = '^-?[0-9]+$';
  var ZONEFILE_HASH_PATTERN = '^([0-9a-f]{40})$';
  var URL_PATTERN = '^http[s]?://.+$';
  var SUBDOMAIN_PATTERN = '^([0-9a-z_+-]{1,37}).([0-9a-z_.+-]{3,37})$';
  var TXID_PATTERN = '^([0-9a-f]{64})$';
  var BOOLEAN_PATTERN = '^(0|1|true|false)$';
  var LOG_CONFIG_DEFAULTS = {
    level: 'info',
    handleExceptions: true,
    timestamp: true,
    stringify: true,
    colorize: true,
    json: true
  };
  var CONFIG_DEFAULTS = {
    blockstackAPIUrl: 'http://stacks-node-api.stacks.co',
    blockstackNodeUrl: 'http://stacks-node-api.stacks.co',
    broadcastServiceUrl: 'http://stacks-node-api.stacks.co/v2/transactions',
    utxoServiceUrl: 'https://blockchain.info',
    logConfig: LOG_CONFIG_DEFAULTS
  };
  var CONFIG_REGTEST_DEFAULTS = {
    blockstackAPIUrl: 'http://localhost:16268',
    blockstackNodeUrl: 'http://localhost:16264',
    broadcastServiceUrl: 'http://localhost:16269',
    utxoServiceUrl: 'http://localhost:18332',
    logConfig: LOG_CONFIG_DEFAULTS,
    bitcoindPassword: 'blockstacksystem',
    bitcoindUsername: 'blockstack'
  };
  var PUBLIC_TESTNET_HOST = 'testnet-master.blockstack.org';
  var CONFIG_TESTNET_DEFAULTS = {
    blockstackAPIUrl: "http://" + PUBLIC_TESTNET_HOST + ":20443",
    blockstackNodeUrl: "http://" + PUBLIC_TESTNET_HOST + ":20443",
    broadcastServiceUrl: "http://" + PUBLIC_TESTNET_HOST + ":20443/v2/transactions",
    utxoServiceUrl: "http://" + PUBLIC_TESTNET_HOST + ":18332",
    logConfig: /*#__PURE__*/Object.assign({}, LOG_CONFIG_DEFAULTS, {
      level: 'debug'
    })
  };
  var DEFAULT_CONFIG_PATH = '~/.blockstack-cli.conf';
  var DEFAULT_CONFIG_REGTEST_PATH = '~/.blockstack-cli-regtest.conf';
  var DEFAULT_CONFIG_TESTNET_PATH = '~/.blockstack-cli-testnet.conf';
  var DEFAULT_MAX_ID_SEARCH_INDEX = 256;
  var CLI_ARGS = {
    type: 'object',
    properties: {
      announce: {
        type: 'array',
        items: [{
          name: 'message_hash',
          type: 'string',
          realtype: 'zonefile_hash',
          pattern: ZONEFILE_HASH_PATTERN
        }, {
          name: 'owner_key',
          type: 'string',
          realtype: 'private_key',
          pattern: "" + PRIVATE_KEY_PATTERN_ANY
        }],
        minItems: 2,
        maxItems: 2,
        help: 'Broadcast a message on the blockchain for subscribers to read.  ' + 'The `MESSAGE_HASH` argument must be the hash of a previously-announced zone file.  ' + 'The `OWNER_KEY` used to sign the transaction must correspond to the Blockstack ID ' + 'to which other users have already subscribed.  `OWNER_KEY` can be a single private key ' + 'or a serialized multisig private key bundle.\n' + '\n' + 'If this command succeeds, it will print a transaction ID.  The rest of the Blockstack peer ' + 'network will process it once the transaction reaches 7 confirmations.\n' + '\n' + 'Examples:\n' + '\n' + '    $ # Tip: You can obtain the owner key with the get_owner_keys command\n' + '    $ export OWNER_KEY="136ff26efa5db6f06b28f9c8c7a0216a1a52598045162abfe435d13036154a1b01"\n' + '    $ stx announce 737c631c7c5d911c6617993c21fba731363f1cfe "$OWNER_KEY"\n' + '    d51749aeec2803e91a2f8bdec8d3e413491fd816b4962372b214ab74acb0bba8\n' + '\n' + '    $ export OWNER_KEY="2,136ff26efa5db6f06b28f9c8c7a0216a1a52598045162abfe435d13036154a1b01,1885cba486a42960499d1f137ef3a475725ceb11f45d74631f9928280196f67401,2418981c7f3a91d4467a65a518e14fafa30e07e6879c11fab7106ea72b49a7cb01"\n' + '    $ stx announce 737c631c7c5d911c6617993c21fba731363f1cfe "$OWNER_KEY"\n' + '    8136a1114098893b28a693e8d84451abf99ee37ef8766f4bc59808eed76968c9\n' + '\n',
        group: 'Peer Services'
      },
      authenticator: {
        type: 'array',
        items: [{
          name: 'app_gaia_hub',
          type: 'string',
          realtype: 'url',
          pattern: URL_PATTERN
        }, {
          name: 'backup_phrase',
          type: 'string',
          realtype: '12_words_or_ciphertext',
          pattern: '.+'
        }, {
          name: 'profile_gaia_hub',
          type: 'string',
          realtype: 'url',
          pattern: URL_PATTERN
        }, {
          name: 'port',
          type: 'string',
          realtype: 'portnum',
          pattern: '^[0-9]+'
        }],
        minItems: 2,
        maxItems: 4,
        help: 'Run an authentication endpoint for the set of names owned ' + 'by the given backup phrase.  Send applications the given Gaia hub URL on sign-in, ' + 'so the application will use it to read/write user data.\n' + '\n' + 'You can supply your encrypted backup phrase instead of the raw backup phrase.  If so, ' + 'then you will be prompted for your password before any authentication takes place.\n' + '\n' + 'Example:\n' + '\n' + '    $ export BACKUP_PHRASE="oak indicate inside poet please share dinner monitor glow hire source perfect"\n' + '    $ export APP_GAIA_HUB="https://1.2.3.4"\n' + '    $ export PROFILE_GAIA_HUB="https://hub.blockstack.org"\n' + '    $ stx authenticator "$APP_GAIA_HUB" "$BACKUP_PHRASE" "$PROFILE_GAIA_HUB" 8888\n' + '    Press Ctrl+C to exit\n' + '    Authentication server started on 8888\n',
        group: 'Authentication'
      },
      balance: {
        type: 'array',
        items: [{
          name: 'address',
          type: 'string',
          realtype: 'address',
          pattern: ADDRESS_PATTERN + "|" + STACKS_ADDRESS_PATTERN
        }],
        minItems: 1,
        maxItems: 1,
        help: 'Query the balance of an account.  Returns the balances of each kind of token ' + 'that the account owns.  The balances will be in the *smallest possible units* of the ' + 'token (i.e. satoshis for BTC, microStacks for Stacks, etc.).\n' + '\n' + 'Example:\n' + '\n' + '    $ stx balance 16pm276FpJYpm7Dv3GEaRqTVvGPTdceoY4\n' + '    {\n' + '      "BTC": "123456"\n' + '      "STACKS": "123456"\n' + '    }\n' + '    $ stx balance SPZY1V53Z4TVRHHW9Z7SFG8CZNRAG7BD8WJ6SXD0\n' + '    {\n' + '      "BTC": "123456"\n' + '      "STACKS": "123456"\n' + '    }\n',
        group: 'Account Management'
      },
      can_stack: {
        type: 'array',
        items: [{
          name: 'amount',
          type: 'string',
          realtype: 'integer',
          pattern: '^[0-9]+$'
        }, {
          name: 'cycles',
          type: 'string',
          realtype: 'integer',
          pattern: '^[0-9]+$'
        }, {
          name: 'pox_address',
          type: 'string',
          realtype: 'address',
          pattern: "" + ADDRESS_PATTERN
        }, {
          name: 'stx_address',
          type: 'string',
          realtype: 'address',
          pattern: "" + STACKS_ADDRESS_PATTERN
        }],
        minItems: 4,
        maxItems: 4,
        help: 'Check if specified account can stack a number of Stacks tokens for given number of cycles.\n' + '\n' + 'Example:\n' + '\n' + '    $ stx can_stack 10000000 20 16pm276FpJYpm7Dv3GEaRqTVvGPTdceoY4 SPZY1V53Z4TVRHHW9Z7SFG8CZNRAG7BD8WJ6SXD0\n' + '    {\n' + '      "eligible": true\n' + '    }\n',
        group: 'Account Management'
      },
      call_contract_func: {
        type: 'array',
        items: [{
          name: 'contract_address',
          type: 'string',
          realtype: 'address',
          pattern: "" + STACKS_ADDRESS_PATTERN
        }, {
          name: 'contract_name',
          type: 'string',
          realtype: 'string',
          pattern: '^[a-zA-Z]([a-zA-Z0-9]|[-_])*$'
        }, {
          name: 'function_name',
          type: 'string',
          realtype: 'string',
          pattern: '^[a-zA-Z]([a-zA-Z0-9]|[-_!?])*$'
        }, {
          name: 'fee',
          type: 'string',
          realtype: 'integer',
          pattern: '^[0-9]+$'
        }, {
          name: 'nonce',
          type: 'string',
          realtype: 'integer',
          pattern: '^[0-9]+$'
        }, {
          name: 'payment_key',
          type: 'string',
          realtype: 'private_key',
          pattern: "" + PRIVATE_KEY_PATTERN_ANY
        }],
        minItems: 6,
        maxItems: 6,
        help: 'Call a function in a deployed Clarity smart contract.\n' + '\n' + 'If the command succeeds, it prints out a transaction ID.' + '\n' + 'Example:\n' + '    $ export PAYMENT="bfeffdf57f29b0cc1fab9ea197bb1413da2561fe4b83e962c7f02fbbe2b1cd5401"\n' + '    $ stx call_contract_func SPBMRFRPPGCDE3F384WCJPK8PQJGZ8K9QKK7F59X contract_name' + '      contract_function 1 0 "$PAYMENT"\n' + '    a9d387a925fb0ba7a725fb1e11f2c3f1647473699dd5a147c312e6453d233456\n' + '\n',
        group: 'Account Management'
      },
      call_read_only_contract_func: {
        type: 'array',
        items: [{
          name: 'contract_address',
          type: 'string',
          realtype: 'address',
          pattern: "" + STACKS_ADDRESS_PATTERN
        }, {
          name: 'contract_name',
          type: 'string',
          realtype: 'string',
          pattern: '^[a-zA-Z]([a-zA-Z0-9]|[-_])*$'
        }, {
          name: 'function_name',
          type: 'string',
          realtype: 'string',
          pattern: '^[a-zA-Z]([a-zA-Z0-9]|[-_!?])*$'
        }, {
          name: 'sender_address',
          type: 'string',
          realtype: 'address',
          pattern: "" + STACKS_ADDRESS_PATTERN
        }],
        minItems: 4,
        maxItems: 4,
        help: 'Call a read-only function in a deployed Clarity smart contract.\n' + '\n' + 'If the command succeeds, it prints out a Clarity value.' + '\n' + 'Example:\n' + '    $ stx call_read_only_contract_func SPBMRFRPPGCDE3F384WCJPK8PQJGZ8K9QKK7F59X contract_name' + '     contract_function SPBMRFRPPGCDE3F384WCJPK8PQJGZ8K9QKK7F59X\n' + '\n',
        group: 'Account Management'
      },
      convert_address: {
        type: 'array',
        items: [{
          name: 'address',
          type: 'string',
          realtype: 'address',
          pattern: ADDRESS_PATTERN + "|" + STACKS_ADDRESS_PATTERN
        }],
        minItems: 1,
        maxItems: 1,
        help: 'Convert a Bitcoin address to a Stacks address and vice versa.\n' + '\n' + 'Example:\n' + '\n' + '    $ stx convert_address 12qdRgXxgNBNPnDeEChy3fYTbSHQ8nfZfD\n' + '    {\n' + '      "STACKS": "SPA2MZWV9N67TBYVWTE0PSSKMJ2F6YXW7CBE6YPW",\n' + '      "BTC": "12qdRgXxgNBNPnDeEChy3fYTbSHQ8nfZfD"\n' + '    }\n' + '    $ stx convert_address SPA2MZWV9N67TBYVWTE0PSSKMJ2F6YXW7CBE6YPW\n' + '    {\n' + '      "STACKS": "SPA2MZWV9N67TBYVWTE0PSSKMJ2F6YXW7CBE6YPW",\n' + '      "BTC": "12qdRgXxgNBNPnDeEChy3fYTbSHQ8nfZfD"\n' + '    }\n',
        group: 'Account Management'
      },
      decrypt_keychain: {
        type: 'array',
        items: [{
          name: 'encrypted_backup_phrase',
          type: 'string',
          realtype: 'encrypted_backup_phrase',
          pattern: '^[^ ]+$'
        }, {
          name: 'password',
          type: 'string',
          realtype: 'password',
          pattern: '.+'
        }],
        minItems: 1,
        maxItems: 2,
        help: 'Decrypt an encrypted backup phrase with a password.  Decrypts to a 12-word ' + 'backup phrase if done correctly.  The password will be prompted if not given.\n' + '\n' + 'Example:\n' + '\n' + '    $ # password is "asdf"\n' + '    $ stx decrypt_keychain "bfMDtOucUGcJXjZo6vkrZWgEzue9fzPsZ7A6Pl4LQuxLI1xsVF0VPgBkMsnSLCmYS5YHh7R3mNtMmX45Bq9sNGPfPsseQMR0fD9XaHi+tBg=\n' + '    Enter password:\n' + '    section amount spend resemble spray verify night immune tattoo best emotion parrot',
        group: 'Key Management'
      },
      deploy_contract: {
        type: 'array',
        items: [{
          name: 'source_file',
          type: 'string',
          realtype: 'path',
          pattern: '.+'
        }, {
          name: 'contract_name',
          type: 'string',
          realtype: 'string',
          pattern: '^[a-zA-Z]([a-zA-Z0-9]|[-_])*$'
        }, {
          name: 'fee',
          type: 'string',
          realtype: 'integer',
          pattern: '^[0-9]+$'
        }, {
          name: 'nonce',
          type: 'string',
          realtype: 'integer',
          pattern: '^[0-9]+$'
        }, {
          name: 'payment_key',
          type: 'string',
          realtype: 'private_key',
          pattern: "" + PRIVATE_KEY_PATTERN_ANY
        }],
        minItems: 5,
        maxItems: 5,
        help: 'Deploys a Clarity smart contract on the network.\n' + '\n' + 'If the command succeeds, it prints out a transaction ID.' + '\n' + 'Example:\n' + '    $ export PAYMENT="bfeffdf57f29b0cc1fab9ea197bb1413da2561fe4b83e962c7f02fbbe2b1cd5401"\n' + '    $ stx deploy_contract ./my_contract.clar my_contract 1 0 "$PAYMENT"\n' + '    a9d387a925fb0ba7a725fb1e11f2c3f1647473699dd5a147c312e6453d233456\n' + '\n',
        group: 'Account Management'
      },
      docs: {
        type: 'array',
        items: [{
          name: 'format',
          type: 'string',
          realtype: 'output_format',
          pattern: '^json$'
        }],
        minItems: 0,
        maxItems: 1,
        help: 'Dump the documentation for all commands as JSON to standard out.',
        group: 'CLI'
      },
      encrypt_keychain: {
        type: 'array',
        items: [{
          name: 'backup_phrase',
          type: 'string',
          realtype: 'backup_phrase',
          pattern: '.+'
        }, {
          name: 'password',
          type: 'string',
          realtype: 'password',
          pattern: '.+'
        }],
        minItems: 1,
        maxItems: 2,
        help: 'Encrypt a 12-word backup phrase, which can be decrypted later with the ' + '`decrypt_backup_phrase` command.  The password will be prompted if not given.\n' + '\n' + 'Example:\n' + '\n' + '     $ # password is "asdf"\n' + '     $ stx encrypt_keychain "section amount spend resemble spray verify night immune tattoo best emotion parrot"\n' + '     Enter password:\n' + '     Enter password again:\n' + '     M+DnBHYb1fgw4N3oZ+5uTEAua5bAWkgTW/SjmmBhGGbJtjOtqVV+RrLJEJOgT35hBon4WKdGWye2vTdgqDo7+HIobwJwkQtN2YF9g3zPsKk=',
        group: 'Key Management'
      },
      faucet: {
        type: 'array',
        items: [{
          name: 'address',
          type: 'string',
          realtype: 'address',
          pattern: ADDRESS_PATTERN + "|" + STACKS_ADDRESS_PATTERN
        }],
        minItems: 1,
        maxItems: 1,
        help: 'Encrypt a 12-word backup phrase, which can be decrypted later with the ' + '`decrypt_backup_phrase` command.  The password will be prompted if not given.\n' + '\n' + 'Example:\n' + '\n' + '     $ # password is "asdf"\n' + '     $ blockstack-cli encrypt_keychain "section amount spend resemble spray verify night immune tattoo best emotion parrot"\n' + '     Enter password:\n' + '     Enter password again:\n' + '     M+DnBHYb1fgw4N3oZ+5uTEAua5bAWkgTW/SjmmBhGGbJtjOtqVV+RrLJEJOgT35hBon4WKdGWye2vTdgqDo7+HIobwJwkQtN2YF9g3zPsKk=',
        group: 'Key Management'
      },
      gaia_dump_bucket: {
        type: 'array',
        items: [{
          name: 'name_or_id_address',
          type: 'string',
          realtype: 'name_or_id_address',
          pattern: ID_ADDRESS_PATTERN + "|" + NAME_PATTERN + "|" + SUBDOMAIN_PATTERN
        }, {
          name: 'app_origin',
          type: 'string',
          realtype: 'url',
          pattern: URL_PATTERN
        }, {
          name: 'gaia_hub',
          type: 'string',
          realtype: 'url',
          pattern: URL_PATTERN
        }, {
          name: 'backup_phrase',
          type: 'string',
          realtype: '12_words_or_ciphertext'
        }, {
          name: 'dump_dir',
          type: 'string',
          realtype: 'path',
          pattern: '.+'
        }],
        minItems: 5,
        maxItems: 5,
        help: 'Download the contents of a Gaia hub bucket to a given directory.  The `GAIA_HUB` argument ' + 'must correspond to the *write* endpoint of the Gaia hub -- that is, you should be able to fetch ' + '`$GAIA_HUB/hub_info`.  If `DUMP_DIR` does not exist, it will be created.\n' + '\n' + 'Example:\n' + '\n' + '    $ export BACKUP_PHRASE="section amount spend resemble spray verify night immune tattoo best emotion parrot\n' + '    $ stx gaia_dump_bucket hello.id.blockstack https://sample.app https://hub.blockstack.org "$BACKUP_PHRASE" ./backups\n' + '    Download 3 files...\n' + '    Download hello_world to ./backups/hello_world\n' + '    Download dir/format to ./backups/dir\\x2fformat\n' + '    Download /.dotfile to ./backups/\\x2f.dotfile\n' + '    3\n',
        group: 'Gaia'
      },
      gaia_getfile: {
        type: 'array',
        items: [{
          name: 'blockstack_id',
          type: 'string',
          realtype: 'blockstack_id',
          pattern: NAME_PATTERN + "|" + SUBDOMAIN_PATTERN + "$"
        }, {
          name: 'app_origin',
          type: 'string',
          realtype: 'url',
          pattern: URL_PATTERN
        }, {
          name: 'filename',
          type: 'string',
          realtype: 'filename',
          pattern: '.+'
        }, {
          name: 'app_private_key',
          type: 'string',
          realtype: 'private_key',
          pattern: PRIVATE_KEY_UNCOMPRESSED_PATTERN
        }, {
          name: 'decrypt',
          type: 'string',
          realtype: 'boolean',
          pattern: BOOLEAN_PATTERN
        }, {
          name: 'verify',
          type: 'string',
          realtype: 'boolean',
          pattern: BOOLEAN_PATTERN
        }],
        minItems: 3,
        maxItems: 6,
        help: "Get a file from another user's Gaia hub.  Prints the file data to stdout.  If you " + 'want to read an encrypted file, and/or verify a signed file, then you must pass an app ' + 'private key, and pass 1 for `DECRYPT` and/or `VERIFY`.  If the file is encrypted, and you do not ' + 'pass an app private key, then this command downloads the ciphertext.  If the file is signed, ' + 'and you want to download its data and its signature, then you must run this command twice -- ' + 'once to get the file contents at `FILENAME`, and once to get the signature (whose name will be `FILENAME`.sig).\n' + '\n' + 'Gaia is a key-value store, so it does not have any built-in notion of directories.  However, ' + 'most underlying storage systems do -- directory separators in the name of a file in ' + "Gaia may be internally treated as first-class directories (it depends on the Gaia hub's driver)." + 'As such, repeated directory separators will be treated as a single directory separator by this command.  ' + 'For example, the file name `a/b.txt`, `/a/b.txt`, and `///a////b.txt` will be treated as identical.\n' + '\n' + 'Example without encryption:\n' + '\n' + '    $ # Get an unencrypted, unsigned file\n' + '    $ stx gaia_getfile ryan.id http://public.ykliao.com statuses.json\n' + '    [{"id":0,"text":"Hello, Blockstack!","created_at":1515786983492}]\n' + '\n' + 'Example with encryption:\n' + '\n' + '    $ # Get an encrypted file without decrypting\n' + '    $ stx gaia_getfile ryan.id https://app.graphitedocs.com documentscollection.json\n' + '    ' + '    $ # Get an encrypted file, and decrypt it\n' + '    $ # Tip: You can obtain the app key with the get_app_keys command\n' + '    $ export APP_KEY="3ac770e8c3d88b1003bf4a0a148ceb920a6172bdade8e0325a1ed1480ab4fb19"\n' + '    $ stx gaia_getfile ryan.id https://app.graphitedocs.com documentscollection.json "$APP_KEY" 1 0\n',
        group: 'Gaia'
      },
      gaia_putfile: {
        type: 'array',
        items: [{
          name: 'gaia_hub',
          type: 'string',
          realtype: 'url',
          pattern: URL_PATTERN
        }, {
          name: 'app_private_key',
          type: 'string',
          realtype: 'private_key',
          pattern: PRIVATE_KEY_UNCOMPRESSED_PATTERN
        }, {
          name: 'data_path',
          type: 'string',
          realtype: 'path',
          pattern: '.+'
        }, {
          name: 'gaia_filename',
          type: 'string',
          realtype: 'filename',
          pattern: '.+'
        }, {
          name: 'encrypt',
          type: 'string',
          realtype: 'boolean',
          pattern: BOOLEAN_PATTERN
        }, {
          name: 'sign',
          type: 'string',
          realtype: 'boolean',
          pattern: BOOLEAN_PATTERN
        }],
        minItems: 4,
        maxItems: 6,
        help: 'Put a file into a given Gaia hub, authenticating with the given app private key.  ' + 'Optionally encrypt and/or sign the data with the given app private key.  If the file is ' + 'successfully stored, this command prints out the URLs at which it can be fetched.\n' + '\n' + 'Gaia is a key-value store, so it does not have any built-in notion of directories.  However, ' + 'most underlying storage systems do -- directory separators in the name of a file in ' + "Gaia may be internally treated as first-class directories (it depends on the Gaia hub's driver)." + 'As such, repeated directory separators will be treated as a single directory separator by this command.  ' + 'For example, the file name `a/b.txt`, `/a/b.txt`, and `///a////b.txt` will be treated as identical.\n' + '\n' + 'Example:\n' + '\n' + '    $ # Store 4 versions of a file: plaintext, encrypted, signed, and encrypted+signed\n' + '    $ # Tip: You can obtain the app key with the get_app_keys command.\n' + '    $ export APP_KEY="3ac770e8c3d88b1003bf4a0a148ceb920a6172bdade8e0325a1ed1480ab4fb19"\n' + '    $ stx gaia_putfile https://hub.blockstack.org "$APP_KEY" /path/to/file.txt file.txt\n' + '    {\n' + '       "urls": "https://gaia.blockstack.org/hub/19KAzYp4kSKozeAGMUsnuqkEGdgQQLEvwo/file.txt"\n' + '    }\n' + '    $ stx gaia_putfile https://hub.blockstack.org "$APP_KEY" /path/to/file.txt file-encrypted.txt 1\n' + '    {\n' + '       "urls": "https://gaia.blockstack.org/hub/19KAzYp4kSKozeAGMUsnuqkEGdgQQLEvwo/file-encrypted.txt"\n' + '    }\n' + '    $ stx gaia_putfile https://hub.blockstack.org "$APP_KEY" /path/to/file.txt file-signed.txt 0 1\n' + '    {\n' + '       "urls": "https://gaia.blockstack.org/hub/19KAzYp4kSKozeAGMUsnuqkEGdgQQLEvwo/file-signed.txt"\n' + '    }\n' + '    $ stx gaia_putfile https://hub.blockstack.org "$APP_KEY" /path/to/file.txt file-encrypted-signed.txt 1 1\n' + '    {\n' + '       "urls": "https://gaia.blockstack.org/hub/19KAzYp4kSKozeAGMUsnuqkEGdgQQLEvwo/file-encrypted-signed.txt"\n' + '    }\n',
        group: 'Gaia'
      },
      gaia_deletefile: {
        type: 'array',
        items: [{
          name: 'gaia_hub',
          type: 'string',
          realtype: 'url',
          pattern: URL_PATTERN
        }, {
          name: 'app_private_key',
          type: 'string',
          realtype: 'private_key',
          pattern: PRIVATE_KEY_UNCOMPRESSED_PATTERN
        }, {
          name: 'gaia_filename',
          type: 'string',
          realtype: 'filename',
          pattern: '.+'
        }, {
          name: 'was_signed',
          type: 'string',
          realtype: 'boolean',
          pattern: BOOLEAN_PATTERN
        }],
        minItems: 3,
        maxItems: 4,
        help: 'Delete a file in a Gaia hub, as well as its signature metadata (which is stored in a separate file).' + '\n' + 'Example:\n' + '\n' + '    $ # Tip: You can obtain the app key with the get_app_keys command.\n' + '    $ export APP_KEY="3ac770e8c3d88b1003bf4a0a148ceb920a6172bdade8e0325a1ed1480ab4fb19"\n' + '    $ stx gaia_deletefile https://hub.blockstack.org "$APP_KEY" file.txt false\n' + '    ok',
        group: 'Gaia'
      },
      gaia_listfiles: {
        type: 'array',
        items: [{
          name: 'gaia_hub',
          type: 'string',
          realtype: 'url',
          pattern: URL_PATTERN
        }, {
          name: 'app_private_key',
          type: 'string',
          realtype: 'private_key',
          pattern: PRIVATE_KEY_UNCOMPRESSED_PATTERN
        }],
        minItems: 2,
        maxItems: 3,
        help: 'List all the files in a Gaia hub bucket.  You must have the private key for the bucket ' + 'in order to list its contents.  The command prints each file name on its own line, and when ' + 'finished, it prints the number of files listed.\n' + '\n' + 'Example:\n' + '\n' + '    $ # Tip: You can obtain the app key with the get_app_keys command.\n' + '    $ export APP_KEY="3ac770e8c3d88b1003bf4a0a148ceb920a6172bdade8e0325a1ed1480ab4fb19"\n' + '    $ stx gaia_listfiles "https://hub.blockstack.org" "$APP_KEY"\n' + '    hello_world\n' + '    dir/format\n' + '    /.dotfile\n' + '    3\n',
        group: 'Gaia'
      },
      gaia_restore_bucket: {
        type: 'array',
        items: [{
          name: 'name_or_id_address',
          type: 'string',
          realtype: 'name_or_id_address',
          pattern: ID_ADDRESS_PATTERN + "|" + NAME_PATTERN + "|" + SUBDOMAIN_PATTERN
        }, {
          name: 'app_origin',
          type: 'string',
          realtype: 'url',
          pattern: URL_PATTERN
        }, {
          name: 'gaia_hub',
          type: 'string',
          realtype: 'url',
          pattern: URL_PATTERN
        }, {
          name: 'backup_phrase',
          type: 'string',
          realtype: '12_words_or_ciphertext'
        }, {
          name: 'dump_dir',
          type: 'string',
          realtype: 'path',
          pattern: '.+'
        }],
        minItems: 5,
        maxItems: 5,
        help: 'Upload the contents of a previously-dumped Gaia bucket to a new Gaia hub.  The `GAIA_HUB` argument ' + 'must correspond to the *write* endpoint of the Gaia hub -- that is, you should be able to fetch ' + '`$GAIA_HUB/hub_info`.  `DUMP_DIR` must contain the file contents created by a previous successful run of the gaia_dump_bucket command, ' + 'and both `NAME_OR_ID_ADDRESS` and `APP_ORIGIN` must be the same as they were when it was run.\n' + '\n' + 'Example:\n' + '\n' + '    $ export BACKUP_PHRASE="section amount spend resemble spray verify night immune tattoo best emotion parrot"\n' + '    $ stx gaia_restore_bucket hello.id.blockstack https://sample.app https://new.gaia.hub "$BACKUP_PHRASE" ./backups\n' + '    Uploaded ./backups/hello_world to https://new.gaia.hub/hub/1Lr8ggSgdmfcb4764woYutUfFqQMjEoKHc/hello_world\n' + '    Uploaded ./backups/dir\\x2fformat to https://new.gaia.hub/hub/1Lr8ggSgdmfcb4764woYutUfFqQMjEoKHc/dir/format\n' + '    Uploaded ./backups/\\x2f.dotfile to https://new.gaia.hub/hub/1Lr8ggSgdmfcb4764woYutUfFqQMjEoKHc//.dotfile\n' + '    3\n',
        group: 'Gaia'
      },
      gaia_sethub: {
        type: 'array',
        items: [{
          name: 'blockstack_id',
          type: 'string',
          realtype: 'blockstack_id',
          pattern: "^" + NAME_PATTERN + "|" + SUBDOMAIN_PATTERN + "$"
        }, {
          name: 'owner_gaia_hub',
          type: 'string',
          realtype: 'url',
          pattern: URL_PATTERN
        }, {
          name: 'app_origin',
          type: 'string',
          realtype: 'url',
          pattern: URL_PATTERN
        }, {
          name: 'app_gaia_hub',
          type: 'string',
          realtype: 'url',
          pattern: URL_PATTERN
        }, {
          name: 'backup_phrase',
          type: 'string',
          realtype: '12_words_or_ciphertext'
        }],
        minItems: 5,
        maxItems: 5,
        help: 'Set the Gaia hub for a particular application for a Blockstack ID.  If the command succeeds, ' + 'the URLs to your updated profile will be printed and your profile will contain an entry in its "apps" ' + 'key that links the given `APP_ORIGIN` to the given `APP_GAIA_HUB`.\n' + '\n' + 'NOTE: Both `OWNER_GAIA_HUB` and `APP_GAIA_HUB` must be the *write* endpoints of their respective Gaia hubs.\n' + '\n' + 'Your 12-word phrase (in either raw or encrypted form) is required to re-sign and store your ' + 'profile and to generate an app-specific key and Gaia bucket.  If you give the encrypted backup phrase, you will be prompted for a password.\n' + '\n' + 'Example:\n' + '\n' + '    $ export BACKUP_PHRASE="soap fog wealth upon actual blossom neither timber phone exile monkey vocal"\n' + '    $ stx gaia_sethub hello_world.id https://hub.blockstack.org https://my.cool.app https://my.app.gaia.hub "$BACKUP_PHRASE"\n' + '    {\n' + '      "profileUrls": {\n' + '        "error": null,\n' + '        "dataUrls": [\n' + '          "https://gaia.blockstack.org/hub/1ArdkA2oLaKnbNbLccBaFhEV4pYju8hJ82/profile.json"\n' + '        ]\n' + '      }\n' + '    }\n' + '    \n' + '    $ # You can check the new apps entry with curl and jq as follows:\n' + '    $ curl -sL https://gaia.blockstack.org/hub/1ArdkA2oLaKnbNbLccBaFhEV4pYju8hJ82/profile.json | jq ".[0].decodedToken.payload.claim.apps"\n' + '    {\n' + '      "https://my.cool.app": "https://my.app.gaia.hub/hub/1EqzyQLJ15KG1WQmi5cf1HtmSeqS1Wb8tY/"\n' + '    }\n' + '\n',
        group: 'Gaia'
      },
      get_account_history: {
        type: 'array',
        items: [{
          name: 'address',
          type: 'string',
          realtype: 'address',
          pattern: STACKS_ADDRESS_PATTERN
        }, {
          name: 'page',
          type: 'string',
          realtype: 'integer',
          pattern: '^[0-9]+$'
        }],
        minItems: 2,
        maxItems: 2,
        help: 'Query the history of account debits and credits over a given block range.  ' + 'Returns the history one page at a time.  An empty result indicates that the page ' + 'number has exceeded the number of historic operations in the given block range.\n' + '\n' + 'Example:\n' + '\n' + '    $ stx get_account_history SP2H7VMY13ESQDAD5808QEY1EMGESMHZWBJRTN2YA 0\n' + '    [\n' + '      {\n' + '        "address": "SP2H7VMY13ESQDAD5808QEY1EMGESMHZWBJRTN2YA",\n' + '        "block_id": 56789\n' + '        "credit_value": "100000000000",\n' + '        "debit_value": "0",\n' + '        "lock_transfer_block_id": 0,\n' + '        "txid": "0e5db84d94adff5b771262b9df015164703b39bb4a70bf499a1602b858a0a5a1",\n' + '        "type": "STACKS",\n' + '        "vtxindex": 0\n' + '      },\n' + '      {\n' + '        "address": "SP2H7VMY13ESQDAD5808QEY1EMGESMHZWBJRTN2YA",\n' + '        "block_id": 56790,\n' + '        "credit_value": "100000000000",\n' + '        "debit_value": "64000000000",\n' + '        "lock_transfer_block_id": 0,\n' + '        "txid": "5a0c67144626f7bd4514e4de3f3bbf251383ca13887444f326bac4bc8b8060ee",\n' + '        "type": "STACKS",\n' + '        "vtxindex": 1\n' + '      },\n' + '      {\n' + '        "address": "SP2H7VMY13ESQDAD5808QEY1EMGESMHZWBJRTN2YA",\n' + '        "block_id": 56791,\n' + '        "credit_value": "100000000000",\n' + '        "debit_value": "70400000000",\n' + '        "lock_transfer_block_id": 0,\n' + '        "txid": "e54c271d6a9feb4d1859d32bc99ffd713493282adef5b4fbf50bca9e33fc0ecc",\n' + '        "type": "STACKS",\n' + '        "vtxindex": 2\n' + '      },\n' + '      {\n' + '        "address": "SP2H7VMY13ESQDAD5808QEY1EMGESMHZWBJRTN2YA",\n' + '        "block_id": 56792,\n' + '        "credit_value": "100000000000",\n' + '        "debit_value": "76800000000",\n' + '        "lock_transfer_block_id": 0,\n' + '        "txid": "06e0d313261baefec1e59783e256ab487e17e0e776e2fdab0920cc624537e3c8",\n' + '        "type": "STACKS",\n' + '        "vtxindex": 3\n' + '      }\n' + '    ]\n' + '\n',
        group: 'Account Management'
      },
      get_account_at: {
        type: 'array',
        items: [{
          name: 'address',
          type: 'string',
          realtype: 'address',
          pattern: STACKS_ADDRESS_PATTERN
        }, {
          name: 'blocknumber',
          type: 'string',
          realtype: 'integer',
          pattern: '^[0-9]+$'
        }],
        minItems: 2,
        maxItems: 2,
        help: 'Query the list of token debits and credits on a given address that occurred ' + 'at a particular block height.  Does not include BTC debits and credits; only Stacks.\n' + '\n' + 'Example\n' + '\n' + '    $ stx -t get_account_at SP2NTAQFECYGSTE1W47P71FG21H8F00KZZWFGEVKQ 56789\n' + '    [\n' + '      {\n' + '        "debit_value": "0",\n' + '        "block_id": 56789\n' + '        "lock_transfer_block_id": 0,\n' + '        "txid": "291817c78a865c1f72938695218a48174265b2358e89b9448edc89ceefd66aa0",\n' + '        "address": "SP2NTAQFECYGSTE1W47P71FG21H8F00KZZWFGEVKQ",\n' + '        "credit_value": "1000000000000000000",\n' + '        "type": "STACKS",\n' + '        "vtxindex": 0\n' + '      }\n' + '    ]\n' + '\n',
        group: 'Account Management'
      },
      get_address: {
        type: 'array',
        items: [{
          name: 'private_key',
          type: 'string',
          realtype: 'private_key',
          pattern: "" + PRIVATE_KEY_PATTERN_ANY
        }],
        minItems: 1,
        maxItems: 1,
        help: 'Get the address of a private key or multisig private key bundle.  Gives the BTC and STACKS addresses\n' + '\n' + 'Example:\n' + '\n' + '    $ stx get_address f5185b9ca93bdcb5753fded3b097dab8547a8b47d2be578412d0687a9a0184cb01\n' + '    {\n' + '      "BTC": "1JFhWyVPpZQjbPcXFtpGtTmU22u4fhBVmq",\n' + '      "STACKS": "SP2YM3J4KQK09V670TD6ZZ1XYNYCNGCWCVVKSDFWQ"\n' + '    }\n' + '    $ stx get_address 1,f5185b9ca93bdcb5753fded3b097dab8547a8b47d2be578412d0687a9a0184cb01,ff2ff4f4e7f8a1979ffad4fc869def1657fd5d48fc9cf40c1924725ead60942c01\n' + '    {\n' + '      "BTC": "363pKBhc5ipDws1k5181KFf6RSxhBZ7e3p",\n' + '      "STACKS": "SMQWZ30EXVG6XEC1K4QTDP16C1CAWSK1JSWMS0QN"\n' + '    }',
        group: 'Key Management'
      },
      get_blockchain_record: {
        type: 'array',
        items: [{
          name: 'blockstack_id',
          type: 'string',
          realtype: 'blockstack_id',
          pattern: "^" + NAME_PATTERN + "|" + SUBDOMAIN_PATTERN + "$"
        }],
        minItems: 1,
        maxItems: 1,
        help: 'Get the low-level blockchain-hosted state for a Blockstack ID.  This command ' + 'is used mainly for debugging and diagnostics.  You should not rely on it to be stable.',
        group: 'Querying Blockstack IDs'
      },
      get_blockchain_history: {
        type: 'array',
        items: [{
          name: 'blockstack_id',
          type: 'string',
          realtype: 'blockstack_id',
          pattern: NAME_PATTERN + "|" + SUBDOMAIN_PATTERN + "$"
        }, {
          name: 'page',
          type: 'string',
          realtype: 'page_number',
          pattern: '^[0-9]+$'
        }],
        minItems: 1,
        maxItems: 2,
        help: 'Get the low-level blockchain-hosted history of operations on a Blockstack ID.  ' + 'This command is used mainly for debugging and diagnostics, and is not guaranteed to ' + 'be stable across releases.',
        group: 'Querying Blockstack IDs'
      },
      get_confirmations: {
        type: 'array',
        items: [{
          name: 'txid',
          type: 'string',
          realtype: 'transaction_id',
          pattern: TXID_PATTERN
        }],
        minItems: 1,
        maxItems: 1,
        help: 'Get the block height and number of confirmations for a transaction.\n' + '\n' + 'Example:\n' + '\n' + '    $ stx get_confirmations e41ce043ab64fd5a5fd382fba21acba8c1f46cbb1d7c08771ada858ce7d29eea\n' + '    {\n' + '      "blockHeight": 567890,\n' + '      "confirmations": 7,\n' + '    }\n' + '\n',
        group: 'Peer Services'
      },
      get_namespace_blockchain_record: {
        type: 'array',
        items: [{
          name: 'namespace_id',
          type: 'string',
          realtype: 'namespace_id',
          pattern: NAMESPACE_PATTERN
        }],
        minItems: 1,
        maxItems: 1,
        help: 'Get the low-level blockchain-hosted state for a Blockstack namespace.  This command ' + 'is used mainly for debugging and diagnostics, and is not guaranteed to be stable across ' + 'releases.',
        group: 'Namespace Operations'
      },
      get_app_keys: {
        type: 'array',
        items: [{
          name: 'backup_phrase',
          type: 'string',
          realtype: '12_words_or_ciphertext'
        }, {
          name: 'name_or_id_address',
          type: 'string',
          realtype: 'name-or-id-address',
          pattern: NAME_PATTERN + "|" + SUBDOMAIN_PATTERN + "|" + ID_ADDRESS_PATTERN
        }, {
          name: 'app_origin',
          type: 'string',
          realtype: 'url',
          pattern: URL_PATTERN
        }],
        minItems: 3,
        maxItems: 3,
        help: 'Get the application private key from a 12-word backup phrase and a name or ID-address.  ' + 'This is the private key used to sign data in Gaia, and its address is the Gaia bucket ' + 'address.  If you provide your encrypted backup phrase, you will be asked to decrypt it.  ' + 'If you provide a name instead of an ID-address, its ID-address will be queried automatically ' + '(note that this means that the name must already be registered).\n' + '\n' + 'NOTE: This command does NOT verify whether or not the name or ID-address was created by the ' + 'backup phrase. You should do this yourself via the `get_owner_keys` command if you are not sure.\n' + '\n' + 'There are two derivation paths emitted by this command:  a `keyInfo` path and a `legacyKeyInfo`' + "path.  You should use the one that matches the Gaia hub read URL's address, if you have already " + 'signed in before.  If not, then you should use the `keyInfo` path when possible.\n' + '\n' + 'Example:\n' + '\n' + '    $ export BACKUP_PHRASE="one race buffalo dynamic icon drip width lake extra forest fee kit"\n' + '    $ stx get_app_keys "$BACKUP_PHRASE" example.id.blockstack https://my.cool.dapp\n' + '    {\n' + '      "keyInfo": {\n' + '        "privateKey": "TODO",\n' + '        "address": "TODO"\n' + '      },\n' + '      "legacyKeyInfo": {\n' + '        "privateKey": "90f9ec4e13fb9a00243b4c1510075157229bda73076c7c721208c2edca28ea8b",\n' + '        "address": "1Lr8ggSgdmfcb4764woYutUfFqQMjEoKHc"\n' + '      },\n' + '      "ownerKeyIndex": 0\n' + '    }',
        group: 'Key Management'
      },
      get_owner_keys: {
        type: 'array',
        items: [{
          name: 'backup_phrase',
          type: 'string',
          realtype: '12_words_or_ciphertext'
        }, {
          name: 'index',
          type: 'string',
          realtype: 'integer',
          pattern: '^[0-9]+$'
        }],
        minItems: 1,
        maxItems: 2,
        help: 'Get the list of owner private keys and ID-addresses from a 12-word backup phrase.  ' + 'Pass non-zero values for INDEX to generate the sequence of ID-addresses that can be used ' + 'to own Blockstack IDs.  If you provide an encrypted 12-word backup phrase, you will be ' + 'asked for your password to decrypt it.\n' + '\n' + 'Example:\n' + '\n' + '    $ # get the first 3 owner keys and addresses for a backup phrase\n' + '    $ export BACKUP_PHRASE="soap fog wealth upon actual blossom neither timber phone exile monkey vocal"\n' + '    $ stx get_owner_keys "$BACKUP_PHRASE" 3\n' + '    [\n' + '      {\n' + '        "privateKey": "14b0811d5cd3486d47279d8f3a97008647c64586b121e99862c18863e2a4183501",\n' + '        "version": "v0.10-current",\n' + '        "index": 0,\n' + '        "idAddress": "ID-1ArdkA2oLaKnbNbLccBaFhEV4pYju8hJ82"\n' + '      },\n' + '      {\n' + '        "privateKey": "1b3572d8dd6866828281ac6cf135f04153210c1f9b123743eccb795fd3095e4901",\n' + '        "version": "v0.10-current",\n' + '        "index": 1,\n' + '        "idAddress": "ID-18pR3UpD1KFrnk88a3MGZmG2dLuZmbJZ25"\n' + '      },\n' + '      {\n' + '        "privateKey": "b19b6d62356db96d570fb5f08b78f0aa7f384525ba3bdcb96fbde29b8e11710d01",\n' + '        "version": "v0.10-current",\n' + '        "index": 2,\n' + '        "idAddress": "ID-1Gx4s7ggkjENw3wSY6bNd1CwoQKk857AqN"\n' + '      }\n' + '    ]\n' + '\n',
        group: 'Key Management'
      },
      get_payment_key: {
        type: 'array',
        items: [{
          name: 'backup_phrase',
          type: 'string',
          realtype: '12_words_or_ciphertext'
        }],
        minItems: 1,
        maxItems: 1,
        help: 'Get the payment private key from a 12-word backup phrase.  If you provide an ' + 'encrypted backup phrase, you will be asked for your password to decrypt it.  This command ' + 'will tell you your Bitcoin and Stacks token addresses as well.\n' + '\n' + 'Example\n' + '\n' + '    $ stx get_payment_key "soap fog wealth upon actual blossom neither timber phone exile monkey vocal"\n' + '    [\n' + '      {\n' + '        "privateKey": "4023435e33da4aff0775f33e7b258f257fb20ecff039c919b5782313ab73afb401",\n' + '        "address": {\n' + '          "BTC": "1ybaP1gaRwRSWRE4f8JXo2W8fiTZmA4rV",\n' + '          "STACKS": "SP5B89ZJAQHBRXVYP15YB5PAY5E24FEW9K4Q63PE"\n' + '        },\n' + '        "index": 0\n' + '      }\n' + '    ]\n' + '\n',
        group: 'Key Management'
      },
      get_stacks_wallet_key: {
        type: 'array',
        items: [{
          name: 'backup_phrase',
          type: 'string',
          realtype: '24_words_or_ciphertext'
        }],
        minItems: 1,
        maxItems: 1,
        help: 'Get the payment private key from a 24-word backup phrase used by the Stacks wallet.  If you provide an ' + 'encrypted backup phrase, you will be asked for your password to decrypt it.  This command ' + 'will tell you your Bitcoin and Stacks token addresses as well.\n' + '\n' + 'Example\n' + '\n' + '    $ stx get_stacks_payment_key "toast canal educate tissue express melody produce later gospel victory meadow outdoor hollow catch liberty annual gasp hat hello april equip thank neck cruise"\n' + '    [\n' + '      {\n' + '        "privateKey": "a25cea8d310ce656c6d427068c77bad58327334f73e39c296508b06589bc4fa201",\n' + '        "address": {\n' + '          "BTC": "1ATAW6TAbTCKgU3xPgAcWQwjW9Q26Eambx",\n' + '          "STACKS": "SP1KTQR7CTQNA20SV2VNTF9YABMR6RJERSES3KC6Z"\n' + '        },\n' + '        "index": 0\n' + '      }\n' + '    ]\n' + '\n',
        group: 'Key Management'
      },
      get_zonefile: {
        type: 'array',
        items: [{
          name: 'zonefile_hash',
          type: 'string',
          realtype: 'zonefile_hash',
          pattern: ZONEFILE_HASH_PATTERN
        }],
        minItems: 1,
        maxItems: 1,
        help: 'Get a zone file by hash.\n' + '\n' + 'Example:\n' + '\n' + '    $ stx get_zonefile ee77ad484b7b229f09461e4c2b6d3bd3e152ba95\n' + '    $ORIGIN ryanshea.id\n' + '    $TTL 3600\n' + '    _http._tcp URI 10 1 "https://gaia.blockstack.org/hub/15BcxePn59Y6mYD2fRLCLCaaHScefqW2No/1/profile.json"\n' + '\n',
        group: 'Peer Services'
      },
      help: {
        type: 'array',
        items: [{
          name: 'command',
          type: 'string',
          realtype: 'command'
        }],
        minItems: 0,
        maxItems: 1,
        help: 'Get the usage string for a CLI command',
        group: 'CLI'
      },
      lookup: {
        type: 'array',
        items: [{
          name: 'blockstack_id',
          type: 'string',
          realtype: 'blockstack_id',
          pattern: NAME_PATTERN + "|" + SUBDOMAIN_PATTERN + "$"
        }],
        minItems: 1,
        maxItems: 1,
        help: 'Get and authenticate the profile and zone file for a Blockstack ID.\n' + '\n' + 'Example:\n' + '\n' + '    $ stx lookup example.id\n' + '\n',
        group: 'Querying Blockstack IDs'
      },
      names: {
        type: 'array',
        items: [{
          name: 'id_address',
          type: 'string',
          realtype: 'id-address',
          pattern: ID_ADDRESS_PATTERN
        }],
        minItems: 1,
        maxItems: 1,
        help: 'Get the list of Blockstack IDs owned by an ID-address.\n' + '\n' + 'Example:\n' + '\n' + '    $ stx names ID-1FpBChfzHG3TdQQRKWAipbLragCUArueG9\n' + '\n',
        group: 'Querying Blockstack IDs'
      },
      make_keychain: {
        type: 'array',
        items: [{
          name: 'backup_phrase',
          type: 'string',
          realtype: '12_words_or_ciphertext'
        }],
        minItems: 0,
        maxItems: 1,
        help: 'Generate the owner and payment private keys, optionally from a given 12-word ' + 'backup phrase.  If no backup phrase is given, a new one will be generated.  If you provide ' + 'your encrypted backup phrase, you will be asked to decrypt it.\n' + '\n' + 'Example:\n' + '\n' + '    $ stx make_keychain\n' + '    {\n' + '      "mnemonic": "apart spin rich leader siren foil dish sausage fee pipe ethics bundle",\n' + '      "keyInfo": {\n' + '        "address": "SP3G19B6J50FH6JGXAKS06N6WA1XPJCKKM4JCHC2D"\n' + '        "index": 0,\n' + '        "privateKey": "56d30f2b605ed114c7dc45599ae521c525d07e1286fbab67452a6586ea49332a01"\n' + '      }\n' + '    }\n' + '\n',
        group: 'Key Management'
      },
      make_zonefile: {
        type: 'array',
        items: [{
          name: 'blockstack_id',
          type: 'string',
          realtype: 'blockstack_id',
          pattern: "^" + NAME_PATTERN + "|" + SUBDOMAIN_PATTERN + "$"
        }, {
          name: 'id_address',
          type: 'string',
          realtype: 'ID-address',
          pattern: ID_ADDRESS_PATTERN
        }, {
          name: 'gaia_url_prefix',
          type: 'string',
          realtype: 'url',
          pattern: '.+'
        }, {
          name: 'resolver_url',
          type: 'string',
          realtype: 'url',
          pattern: '.+'
        }],
        minItems: 3,
        maxItems: 4,
        help: 'Generate a zone file for a Blockstack ID with the given profile URL.  If you know ' + 'the ID-address for the Blockstack ID, the profile URL usually takes the form of:\n' + '\n' + '     {GAIA_URL_PREFIX}/{ADDRESS}/profile.json\n' + '\n' + 'where `{GAIA_URL_PREFIX}` is the *read* endpoint of your Gaia hub (e.g. https://gaia.blockstack.org/hub) and ' + "`{ADDRESS}` is the base58check part of your ID-address (i.e. the string following 'ID-').\n" + '\n' + 'Example:\n' + '\n' + '     $ stx make_zonefile example.id ID-1ArdkA2oLaKnbNbLccBaFhEV4pYju8hJ82 https://my.gaia.hub/hub\n' + '     $ORIGIN example.id\n' + '     $TTL 3600\n' + '     _http._tcp      IN      URI     10      1       "https://my.gaia.hub/hub/1ArdkA2oLaKnbNbLccBaFhEV4pYju8hJ82/profile.json"\n' + '\n',
        group: 'Peer Services'
      },
      name_import: {
        type: 'array',
        items: [{
          name: 'blockstack_id',
          type: 'string',
          realtype: 'blockstack_id',
          pattern: NAME_PATTERN
        }, {
          name: 'id_address',
          type: 'string',
          realtype: 'id-address',
          pattern: ID_ADDRESS_PATTERN
        }, {
          name: 'gaia_url_prefix',
          type: 'string',
          realtype: 'url',
          pattern: '.+'
        }, {
          name: 'reveal_key',
          type: 'string',
          realtype: 'private_key',
          pattern: "" + PRIVATE_KEY_PATTERN_ANY
        }, {
          name: 'zonefile',
          type: 'string',
          realtype: 'path',
          pattern: '.+'
        }, {
          name: 'zonefile_hash',
          type: 'string',
          realtype: 'zonefile_hash',
          pattern: ZONEFILE_HASH_PATTERN
        }],
        minItems: 4,
        maxItems: 6,
        help: 'Import a name into a namespace you revealed.  The `REVEAL_KEY` must be the same as ' + 'the key that revealed the namespace.  You can only import a name into a namespace if ' + 'the namespace has not yet been launched (i.e. via `namespace_ready`), and if the ' + 'namespace was revealed less than a year ago (52595 blocks ago).\n' + '\n' + 'A zone file will be generated for this name automatically, if "ZONEFILE" is not given.  By default, ' + "the zone file will have a URL to the name owner's profile prefixed by `GAIA_URL_PREFIX`.  If you " + "know the *write* endpoint for the name owner's Gaia hub, you can find out the `GAIA_URL_PREFIX` " + 'to use with `curl $GAIA_HUB/hub_info`".\n' + '\n' + 'If you specify an argument for `ZONEFILE`, then the `GAIA_URL_PREFIX` argument is ignored in favor of ' + 'your custom zone file on disk.\n' + '\n' + 'If you specify a valid zone file hash for `ZONEFILE_HASH` then it will be used in favor of ' + 'both `ZONEFILE` and `GAIA_URL_PREFIX`.  The zone file hash will be incorporated directly into the ' + 'name-import transaction.\n' + '\n' + 'This command prints out a transaction ID if it succeeds, and it replicates the zone file (if given) ' + 'to a transaction broadcaster (you can choose which one with -T).  The zone file will be automatically ' + 'broadcast to the Blockstack peer network when the transaction confirms.  Alternatively, you can do so ' + 'yourself with the `zonefile_push` command.\n' + '\n' + 'Example:\n' + '\n' + '    $ export REVEAL_KEY="bfeffdf57f29b0cc1fab9ea197bb1413da2561fe4b83e962c7f02fbbe2b1cd5401"\n' + '    $ export ID_ADDRESS="ID-18e1bqU7B5qUPY3zJgMLxDnexyStTeSnvV"\n' + '    $ stx name_import example.id "$ID_ADDRESS" https://gaia.blockstack.org/hub "$REVEAL_KEY"\n' + '    f726309cea7a9db364307466dc0e0e759d5c0d6bad1405e2fd970740adc7dc45\n' + '\n',
        group: 'Namespace Operations'
      },
      namespace_preorder: {
        type: 'array',
        items: [{
          name: 'namespace_id',
          type: 'string',
          realtype: 'namespace_id',
          pattern: NAMESPACE_PATTERN
        }, {
          name: 'reveal_address',
          type: 'string',
          realtype: 'address',
          pattern: ADDRESS_PATTERN
        }, {
          name: 'payment_key',
          type: 'string',
          realtype: 'private_key',
          pattern: "" + PRIVATE_KEY_PATTERN_ANY
        }],
        minItems: 3,
        maxItems: 3,
        help: 'Preorder a namespace.  This is the first of three steps to creating a namespace.  ' + 'Once this transaction is confirmed, you will need to use the `namespace_reveal` command ' + 'to reveal the namespace (within 24 hours, or 144 blocks).',
        group: 'Namespace Operations'
      },
      namespace_reveal: {
        type: 'array',
        items: [{
          name: 'namespace_id',
          type: 'string',
          realtype: 'namespace_id',
          pattern: NAMESPACE_PATTERN
        }, {
          name: 'reveal_address',
          type: 'string',
          realtype: 'address',
          pattern: ADDRESS_PATTERN
        }, {
          name: 'version',
          type: 'string',
          realtype: '2-byte-integer',
          pattern: INT_PATTERN
        }, {
          name: 'lifetime',
          type: 'string',
          realtype: '4-byte-integer',
          pattern: INT_PATTERN
        }, {
          name: 'coefficient',
          type: 'string',
          realtype: '1-byte-integer',
          pattern: INT_PATTERN
        }, {
          name: 'base',
          type: 'string',
          realtype: '1-byte-integer',
          pattern: INT_PATTERN
        }, {
          name: 'price_buckets',
          type: 'string',
          realtype: 'csv-of-16-nybbles',
          pattern: '^([0-9]{1,2},){15}[0-9]{1,2}$'
        }, {
          name: 'nonalpha_discount',
          type: 'string',
          realtype: 'nybble',
          pattern: INT_PATTERN
        }, {
          name: 'no_vowel_discount',
          type: 'string',
          realtype: 'nybble',
          pattern: INT_PATTERN
        }, {
          name: 'payment_key',
          type: 'string',
          realtype: 'private_key',
          pattern: "" + PRIVATE_KEY_PATTERN_ANY
        }],
        minItems: 10,
        maxItems: 10,
        help: 'Reveal a preordered namespace, and set the price curve and payment options.  ' + 'This is the second of three steps required to create a namespace, and must be done ' + 'shortly after the associated `namespace_preorder` command.',
        group: 'Namespace Operations'
      },
      namespace_ready: {
        type: 'array',
        items: [{
          name: 'namespace_id',
          type: 'string',
          realtype: 'namespace_id',
          pattern: NAMESPACE_PATTERN
        }, {
          name: 'reveal_key',
          type: 'string',
          realtype: 'private_key',
          pattern: "" + PRIVATE_KEY_PATTERN_ANY
        }],
        minItems: 2,
        maxItems: 2,
        help: 'Launch a revealed namespace.  This is the third and final step of creating a namespace.  ' + 'Once launched, you will not be able to import names anymore.',
        group: 'Namespace Operations'
      },
      price: {
        type: 'array',
        items: [{
          name: 'blockstack_id',
          type: 'string',
          realtype: 'blockstack_id',
          pattern: NAME_PATTERN
        }],
        minItems: 1,
        maxItems: 1,
        help: 'Get the price of an on-chain Blockstack ID.  Its namespace must already exist.\n' + '\n' + 'Example:\n' + '\n' + '    $ stx price example.id\n' + '    {\n' + '      "units": "BTC",\n' + '      "amount": "5500"\n' + '    }\n' + '\n',
        group: 'Querying Blockstack IDs'
      },
      price_namespace: {
        type: 'array',
        items: [{
          name: 'namespace_id',
          type: 'string',
          realtype: 'namespace_id',
          pattern: NAMESPACE_PATTERN
        }],
        minItems: 1,
        maxItems: 1,
        help: 'Get the price of a namespace.\n' + '\n' + 'Example:\n' + '\n' + '    $ # get the price of the .hello namespace\n' + '    $ stx price_namespace hello\n' + '    {\n' + '      "units": "BTC",\n' + '      "amount": "40000000"\n' + '    }\n' + '\n',
        group: 'Namespace Operations'
      },
      profile_sign: {
        type: 'array',
        items: [{
          name: 'profile',
          type: 'string',
          realtype: 'path'
        }, {
          name: 'owner_key',
          type: 'string',
          realtype: 'private_key',
          pattern: PRIVATE_KEY_PATTERN
        }],
        minItems: 2,
        maxItems: 2,
        help: 'Sign a profile on disk with a given owner private key.  Print out the signed profile JWT.\n' + '\n' + 'Example:\n' + '\n' + '    $ # Tip: you can get the owner key from your 12-word backup phrase using the get_owner_keys command\n' + '    $ stx profile_sign /path/to/profile.json 0ffd299af9c257173be8486ef54a4dd1373407d0629ca25ca68ff24a76be09fb01\n' + '\n',
        group: 'Profiles'
      },
      profile_store: {
        type: 'array',
        items: [{
          name: 'user_id',
          type: 'string',
          realtype: 'name-or-id-address',
          pattern: NAME_PATTERN + "|" + SUBDOMAIN_PATTERN + "|" + ID_ADDRESS_PATTERN
        }, {
          name: 'profile',
          type: 'string',
          realtype: 'path'
        }, {
          name: 'owner_key',
          type: 'string',
          realtype: 'private_key',
          pattern: PRIVATE_KEY_PATTERN
        }, {
          name: 'gaia_hub',
          type: 'string',
          realtype: 'url'
        }],
        minItems: 4,
        maxItems: 4,
        help: 'Store a profile on disk to a Gaia hub.  `USER_ID` can be either a Blockstack ID or ' + "an ID-address.  The `GAIA_HUB` argument must be the *write* endpoint for the user's Gaia hub " + '(e.g. https://hub.blockstack.org).  You can verify this by ensuring that you can run ' + '`curl "$GAIA_HUB/hub_info"` successfully.',
        group: 'Profiles'
      },
      profile_verify: {
        type: 'array',
        items: [{
          name: 'profile',
          type: 'string',
          realtype: 'path'
        }, {
          name: 'id_address',
          type: 'string',
          realtype: 'id-address',
          pattern: ID_ADDRESS_PATTERN + "|" + PUBLIC_KEY_PATTERN
        }],
        minItems: 2,
        maxItems: 2,
        help: 'Verify a JWT encoding a profile on disk using an ID-address.  Prints out the contained profile on success.\n' + '\n' + 'Example:\n' + '\n' + '    $ # get the raw profile JWT\n' + '    $ curl -sL https://raw.githubusercontent.com/jcnelson/profile/master/judecn.id > /tmp/judecn.id.jwt\n' + '    $ # Tip: you can get the ID-address for a name with the "whois" command\n' + '    $ stx profile_verify /tmp/judecn.id.jwt ID-16EMaNw3pkn3v6f2BgnSSs53zAKH4Q8YJg\n' + '\n',
        group: 'Profiles'
      },
      renew: {
        type: 'array',
        items: [{
          name: 'blockstack_id',
          type: 'string',
          realtype: 'on-chain-blockstack_id',
          pattern: NAME_PATTERN
        }, {
          name: 'owner_key',
          type: 'string',
          realtype: 'private_key',
          pattern: "" + PRIVATE_KEY_PATTERN_ANY
        }, {
          name: 'payment_key',
          type: 'string',
          realtype: 'private_key',
          pattern: "" + PRIVATE_KEY_PATTERN_ANY
        }, {
          name: 'new_id_address',
          type: 'string',
          realtype: 'id-address',
          pattern: ID_ADDRESS_PATTERN
        }, {
          name: 'zonefile',
          type: 'string',
          realtype: 'path'
        }, {
          name: 'zonefile_hash',
          type: 'string',
          realtype: 'zonefile_hash',
          pattern: ZONEFILE_HASH_PATTERN
        }],
        minItems: 3,
        maxItems: 6,
        help: 'Renew a name.  Optionally transfer it to a new owner address (`NEW_ID_ADDRESS`), ' + 'and optionally load up and give it a new zone file on disk (`ZONEFILE`).  If the command ' + 'succeeds, it prints out a transaction ID.  You can use with the `get_confirmations` ' + 'command to track its confirmations on the underlying blockchain -- once it reaches 7 ' + 'confirmations, the rest of the Blockstack peer network will process it.\n' + '\n' + 'If you create a new zonefile for your name, you will need ' + 'to later use `zonefile_push` to replicate the zone file to the Blockstack peer network ' + 'once the transaction reaches 7 confirmations.\n' + '\n' + 'Example:\n' + '\n' + '    $ # Tip: you can get your owner key from your backup phrase with "get_owner_keys".\n' + '    $ # Tip: you can get your payment key from your backup phrase with "get_payment_key".\n' + '    $ export OWNER="136ff26efa5db6f06b28f9c8c7a0216a1a52598045162abfe435d13036154a1b01"\n' + '    $ export PAYMENT="bfeffdf57f29b0cc1fab9ea197bb1413da2561fe4b83e962c7f02fbbe2b1cd5401"\n' + '    $ stx renew hello_world.id "$OWNER" "$PAYMENT"\n' + '    3d8945ce76d4261678d76592b472ed639a10d4298f9d730af4edbbc3ec02882e\n' + '\n' + '    $ # Renew with a new owner\n' + '    $ export NEW_OWNER="ID-141BcmFVbEuuMb7Bd6umXyV6ZD1WYomYDE"\n' + '    $ stx renew hello_world.id "$OWNER" "$PAYMENT" "$NEW_OWNER"\n' + '    33865625ef3f1b607111c0dfba9e58604927173bd2e299a343e19aa6d2cfb263\n' + '\n' + '    $ # Renew with a new zone file.\n' + '    $ # Tip: you can create a new zonefile with the "make_zonefile" command.\n' + '    $ export ZONEFILE_PATH="/path/to/new/zonefile.txt"\n' + '    $ stx renew hello_world.id "$OWNER" "$PAYMENT" --zonefile "$ZONEFILE_PATH"\n' + '    e41ce043ab64fd5a5fd382fba21acba8c1f46cbb1d7c08771ada858ce7d29eea\n' + '    $ # wait 7 confirmations\n' + '    $ stx get_confirmations e41ce043ab64fd5a5fd382fba21acba8c1f46cbb1d7c08771ada858ce7d29eea\n' + '    {\n' + '      "blockHeight": 567890,\n' + '      "confirmations": 7,\n' + '    }\n' + '    $ stx -H https://core.blockstack.org zonefile_push "$ZONEFILE_PATH"\n' + '    [\n' + '      "https://core.blockstack.org"\n' + '    ]\n' + '\n',
        group: 'Blockstack ID Management'
      },
      register: {
        type: 'array',
        items: [{
          name: 'blockstack_id',
          type: 'string',
          realtype: 'on-chain-blockstack_id',
          pattern: NAME_PATTERN
        }, {
          name: 'owner_key',
          type: 'string',
          realtype: 'private_key',
          pattern: PRIVATE_KEY_PATTERN
        }, {
          name: 'payment_key',
          type: 'string',
          realtype: 'private_key',
          pattern: "" + PRIVATE_KEY_PATTERN_ANY
        }, {
          name: 'gaia_hub',
          type: 'string',
          realtype: 'url'
        }, {
          name: 'zonefile',
          type: 'string',
          realtype: 'path'
        }],
        minItems: 4,
        maxItems: 5,
        help: 'If you are trying to register a name for a *private key*, use this command.\n' + '\n' + 'Register a name to a single name-owning private key.  After successfully running this command, ' + 'and after waiting a couple hours, your name will be ready to use and will resolve to a ' + 'signed empty profile hosted on the given Gaia hub (`GAIA_HUB`).\n' + '\n' + 'Behind the scenes, this will generate and send two transactions ' + 'and generate and replicate a zone file with the given Gaia hub URL (`GAIA_HUB`).  ' + 'Note that the `GAIA_HUB` argument must correspond to the *write* endpoint of the Gaia hub ' + '(i.e. you should be able to run \'curl "$GAIA_HUB/hub_info"\' and get back data).  If you ' + 'are using Blockstack PBC\'s default Gaia hub, pass "https://hub.blockstack.org" for this ' + 'argument.\n' + '\n' + "By default, this command generates a zone file automatically that points to the Gaia hub's " + 'read endpoint (which is queried on-the-fly from `GAIA_HUB`).  If you instead want to have a custom zone file for this name, ' + 'you can specify a path to it on disk with the `ZONEFILE` argument.\n' + '\n' + 'If this command completes successfully, your name will be ready to use once both transactions have 7+ confirmations.  ' + 'You can use the `get_confirmations` command to track the confirmations ' + 'on the transaction IDs returned by this command.\n' + '\n' + 'WARNING: You should *NOT* use the payment private key (`PAYMENT_KEY`) while the name is being confirmed.  ' + 'If you do so, you could double-spend one of the pending transactions and lose your name.\n' + '\n' + 'Example:\n' + '\n' + '    $ export OWNER="136ff26efa5db6f06b28f9c8c7a0216a1a52598045162abfe435d13036154a1b01"\n' + '    $ export PAYMENT="bfeffdf57f29b0cc1fab9ea197bb1413da2561fe4b83e962c7f02fbbe2b1cd5401"\n' + '    $ stx register example.id "$OWNER" "$PAYMENT" https://hub.blockstack.org\n' + '    9bb908bfd4ab221f0829167a461229172184fc825a012c4e551533aa283207b1\n' + '\n',
        group: 'Blockstack ID Management'
      },
      register_addr: {
        type: 'array',
        items: [{
          name: 'blockstack_id',
          type: 'string',
          realtype: 'blockstack_id',
          pattern: NAME_PATTERN
        }, {
          name: 'id-address',
          type: 'string',
          realtype: 'id-address',
          pattern: ID_ADDRESS_PATTERN
        }, {
          name: 'payment_key',
          type: 'string',
          realtype: 'private_key',
          pattern: "" + PRIVATE_KEY_PATTERN_ANY
        }, {
          name: 'gaia_url_prefix',
          type: 'string',
          realtype: 'url'
        }, {
          name: 'zonefile',
          type: 'string',
          realtype: 'path'
        }],
        minItems: 4,
        maxItems: 5,
        help: 'If you are trying to register a name for an *ID-address*, use this command.\n' + '\n' + "Register a name to someone's ID-address.  After successfully running this " + 'command and waiting a couple of hours, the name will be registered on-chain and have a ' + "zone file with a URL to where the owner's profile should be.  This command does NOT " + 'generate, sign, or replicate a profile for the name---the name owner will need to do this ' + 'separately, once the name is registered.\n' + '\n' + 'Behind the scenes, this command will generate two ' + 'transactions, and generate and replicate a zone file with the given Gaia hub read URL ' + '(`GAIA_URL_PREFIX`).  Note that the `GAIA_URL_PREFIX` argument must correspond to the *read* endpoint of the Gaia hub ' + '(e.g. if you are using Blockstack PBC\'s default Gaia hub, this is "https://gaia.blockstack.org/hub"). ' + "If you know the *write* endpoint of the name owner's Gaia hub, you can find the right value for " + '`GAIA_URL_PREFIX` by running "curl $GAIA_HUB/hub_info".\n' + '\n' + 'No profile will be generated or uploaded by this command.  Instead, this command generates ' + 'a zone file that will include the URL to a profile based on the `GAIA_URL_PREFIX` argument.\n' + '\n' + 'The zone file will be generated automatically from the `GAIA_URL_PREFIX` argument.  If you need ' + 'to use a custom zone file, you can pass the path to it on disk via the `ZONEFILE` argument.\n' + '\n' + 'If this command completes successfully, the name will be ready to use in a couple of ' + 'hours---that is, once both transactions have 7+ confirmations. ' + 'You can use the `get_confirmations` command to track the confirmations.\n' + '\n' + 'WARNING: You should *NOT* use the payment private key (`PAYMENT_KEY`) while the name is being confirmed.  ' + 'If you do so, you could double-spend one of the pending transactions and lose the name.\n' + '\n' + 'Example:\n' + '\n' + '    $ export ID_ADDRESS="ID-18e1bqU7B5qUPY3zJgMLxDnexyStTeSnvV"\n' + '    $ export PAYMENT="bfeffdf57f29b0cc1fab9ea197bb1413da2561fe4b83e962c7f02fbbe2b1cd5401"\n' + '    $ stx register_addr example.id "$ID_ADDRESS" "$PAYMENT" https://gaia.blockstack.org/hub',
        group: 'Blockstack ID Management'
      },
      register_subdomain: {
        type: 'array',
        items: [{
          name: 'blockstack_id',
          type: 'string',
          realtype: 'blockstack_id',
          pattern: SUBDOMAIN_PATTERN
        }, {
          name: 'owner_key',
          type: 'string',
          realtype: 'private_key',
          pattern: PRIVATE_KEY_PATTERN
        }, {
          name: 'gaia_hub',
          type: 'string',
          realtype: 'url'
        }, {
          name: 'registrar',
          type: 'string',
          realtype: 'url'
        }, {
          name: 'zonefile',
          type: 'string',
          realtype: 'path'
        }],
        minItems: 4,
        maxItems: 5,
        help: 'Register a subdomain.  This will generate and sign a subdomain zone file record ' + 'with the given `GAIA_HUB` URL and send it to the given subdomain registrar (`REGISTRAR`).\n' + '\n' + 'This command generates, signs, and uploads a profile to the `GAIA_HUB` url.  Note that the `GAIA_HUB` ' + 'argument must correspond to the *write* endpoint of your Gaia hub (i.e. you should be able ' + "to run 'curl \"$GAIA_HUB/hub_info\"' successfully).  If you are using Blockstack PBC's default " + 'Gaia hub, this argument should be "https://hub.blockstack.org".\n' + '\n' + 'WARNING: At this time, no validation will occur on the registrar URL.  Be sure that the URL ' + 'corresponds to the registrar for the on-chain name before running this command!\n' + '\n' + 'Example:\n' + '\n' + '    $ export OWNER="6e50431b955fe73f079469b24f06480aee44e4519282686433195b3c4b5336ef01"\n' + '    $ # NOTE: https://registrar.blockstack.org is the registrar for personal.id!\n' + '    $ stx register_subdomain hello.personal.id "$OWNER" https://hub.blockstack.org https://registrar.blockstack.org\n',
        group: 'Blockstack ID Management'
      },
      revoke: {
        type: 'array',
        items: [{
          name: 'blockstack_id',
          type: 'string',
          realtype: 'on-chain-blockstack_id',
          pattern: NAME_PATTERN
        }, {
          name: 'owner_key',
          type: 'string',
          realtype: 'private_key',
          pattern: "" + PRIVATE_KEY_PATTERN_ANY
        }, {
          name: 'payment_key',
          type: 'string',
          realtype: 'private_key',
          pattern: "" + PRIVATE_KEY_PATTERN_ANY
        }],
        minItems: 3,
        maxItems: 3,
        help: 'Revoke a name.  This renders it unusable until it expires (if ever).  This command ' + 'prints out the transaction ID if it succeeds.  Once the transaction confirms, the name will ' + 'be revoked by each node in the peer network.  This command only works for on-chain names, not ' + 'subdomains.\n' + '\n' + 'Example:\n' + '\n' + '    $ # Tip: you can get your owner and payment keys from your 12-word backup phrase using the get_owner_keys and get_payment_key commands.\n' + '    $ export OWNER="6e50431b955fe73f079469b24f06480aee44e4519282686433195b3c4b5336ef01"\n' + '    $ export PAYMENT="bfeffdf57f29b0cc1fab9ea197bb1413da2561fe4b83e962c7f02fbbe2b1cd5401"\n' + '    $ stx revoke example.id "$OWNER" "$PAYMENT"\n' + '    233b559c97891affa010567bd582110508d0236b4e3f88d3b1d0731629e030b0\n' + '\n',
        group: 'Blockstack ID Management'
      },
      send_btc: {
        type: 'array',
        items: [{
          name: 'recipient_address',
          type: 'string',
          realtype: 'address',
          pattern: ADDRESS_PATTERN
        }, {
          name: 'amount',
          type: 'string',
          realtype: 'satoshis',
          pattern: INT_PATTERN
        }, {
          name: 'payment_key',
          type: 'string',
          realtype: 'private_key',
          pattern: "" + PRIVATE_KEY_PATTERN_ANY
        }],
        minItems: 3,
        maxItems: 3,
        help: 'Send some Bitcoin (in satoshis) from a payment key to an address.  Up to the given ' + 'amount will be spent, but likely less---the actual amount sent will be the amount given, ' + 'minus the transaction fee.  For example, if you want to send 10000 satoshis but the ' + 'transaction fee is 2000 satoshis, then the resulting transaction will send 8000 satoshis ' + 'to the given address.  This is to ensure that this command does not *over*-spend your ' + 'Bitcoin.  If you want to check the amount before spending, pass the `-x` flag to see the ' + 'raw transaction.\n' + '\n' + 'If the command succeeds, it prints out the transaction ID.  You can track its confirmations ' + 'with the `get_confirmations` command.\n' + '\n' + 'Example:\n' + '\n' + '    $ export PAYMENT="bfeffdf57f29b0cc1fab9ea197bb1413da2561fe4b83e962c7f02fbbe2b1cd5401"\n' + '    $ stx send_btc 18qTSE5PPQmypwKKej7QX5Db2XAttgYeA1 123456 "$PAYMENT"\n' + '    c7e239fd24da30e36e011e6bc7db153574a5b40a3a8dc3b727adb54ad038acc5\n' + '\n',
        group: 'Account Management'
      },
      send_tokens: {
        type: 'array',
        items: [{
          name: 'address',
          type: 'string',
          realtype: 'address',
          pattern: STACKS_ADDRESS_PATTERN
        }, {
          name: 'amount',
          type: 'string',
          realtype: 'integer',
          pattern: '^[0-9]+$'
        }, {
          name: 'fee',
          type: 'string',
          realtype: 'integer',
          pattern: '^[0-9]+$'
        }, {
          name: 'nonce',
          type: 'string',
          realtype: 'integer',
          pattern: '^[0-9]+$'
        }, {
          name: 'payment_key',
          type: 'string',
          realtype: 'private_key',
          pattern: "" + PRIVATE_KEY_PATTERN_ANY
        }, {
          name: 'memo',
          type: 'string',
          realtype: 'string',
          pattern: '^.{0,34}$'
        }],
        minItems: 5,
        maxItems: 6,
        help: 'Send a particular type of tokens to the given `ADDRESS`.  Right now, only supported `TOKEN-TYPE` is `STACKS`.  Optionally ' + 'include a memo string (`MEMO`) up to 34 characters long.\n' + '\n' + 'If the command succeeds, it prints out a transaction ID.  You can track the confirmations on the transaction ' + 'via the `get_confirmations` command.  Once the transaction has 7 confirmations, the Blockstack peer network ' + 'will have processed it, and your payment key balance and recipient balance will be updated.\n' + '\n' + 'Example:\n' + '\n' + '    $ # check balances of sender and recipient before sending.\n' + '    $ # address of the key below is SP2SC16ASH76GX549PT7J5WQZA4GHMFBKYMBQFF9V\n' + '    $ export PAYMENT="bfeffdf57f29b0cc1fab9ea197bb1413da2561fe4b83e962c7f02fbbe2b1cd5401"\n' + '    $ stx balance SP2SC16ASH76GX549PT7J5WQZA4GHMFBKYMBQFF9V\n' + '    {\n' + '      "STACKS": "10000000"\n' + '    }\n' + '    $ stx balance SP1P10PS2T517S4SQGZT5WNX8R00G1ECTRKYCPMHY\n' + '    {\n' + '      "STACKS": "0"\n' + '    }\n' + '\n' + '    $ # send tokens\n' + '    $ stx send_tokens SP1P10PS2T517S4SQGZT5WNX8R00G1ECTRKYCPMHY 12345 1 0 "$PAYMENT"\n' + '    a9d387a925fb0ba7a725fb1e11f2c3f1647473699dd5a147c312e6453d233456\n' + '\n' + '    $ # wait for transaction to be confirmed\n' + '\n' + '    $ stx balance SP2SC16ASH76GX549PT7J5WQZA4GHMFBKYMBQFF9V\n' + '    {\n' + '      "STACKS": "9987655"\n' + '    }\n' + '    $ stx balance SP1P10PS2T517S4SQGZT5WNX8R00G1ECTRKYCPMHY\n' + '    {\n' + '      "STACKS": "12345"\n' + '    }\n' + '\n',
        group: 'Account Management'
      },
      stack: {
        type: 'array',
        items: [{
          name: 'amount',
          type: 'string',
          realtype: 'integer',
          pattern: '^[0-9]+$'
        }, {
          name: 'cycles',
          type: 'string',
          realtype: 'integer',
          pattern: '^[0-9]+$'
        }, {
          name: 'pox_address',
          type: 'string',
          realtype: 'integer',
          pattern: "" + ADDRESS_PATTERN
        }, {
          name: 'private_key',
          type: 'string',
          realtype: 'private_key',
          pattern: "" + PRIVATE_KEY_PATTERN_ANY
        }, {
          name: 'fee',
          type: 'string',
          realtype: 'integer',
          pattern: '^[0-9]+$'
        }, {
          name: 'nonce',
          type: 'string',
          realtype: 'integer',
          pattern: '^[0-9]+$'
        }],
        minItems: 4,
        maxItems: 6,
        help: 'Stack the specified number of Stacks tokens for given number of cycles.\n' + '\n' + 'Example:\n' + '\n' + '    $ stx stack 10000000 20 16pm276FpJYpm7Dv3GEaRqTVvGPTdceoY4 136ff26efa5db6f06b28f9c8c7a0216a1a52598045162abfe435d13036154a1b01\n' + '    {\n' + '      "txid": true\n' + '    }\n',
        group: 'Account Management'
      },
      stacking_status: {
        type: 'array',
        items: [{
          name: 'pox_address',
          type: 'string',
          realtype: 'integer',
          pattern: "" + STACKS_ADDRESS_PATTERN
        }],
        minItems: 1,
        maxItems: 1,
        help: 'Get stacking status for specified address.\n' + '\n' + 'Example:\n' + '\n' + '    $ stx stacking_status SPZY1V53Z4TVRHHW9Z7SFG8CZNRAG7BD8WJ6SXD0\n',
        group: 'Account Management'
      },
      transfer: {
        type: 'array',
        items: [{
          name: 'blockstack_id',
          type: 'string',
          realtype: 'on-chain-blockstack_id',
          pattern: NAME_PATTERN
        }, {
          name: 'new_id_address',
          type: 'string',
          realtype: 'id-address',
          pattern: ID_ADDRESS_PATTERN
        }, {
          name: 'keep_zonefile',
          type: 'string',
          realtype: 'true-or-false',
          pattern: '^true$|^false$'
        }, {
          name: 'owner_key',
          type: 'string',
          realtype: 'private_key',
          pattern: "" + PRIVATE_KEY_PATTERN_ANY
        }, {
          name: 'payment_key',
          type: 'string',
          realtype: 'private_key',
          pattern: "" + PRIVATE_KEY_PATTERN_ANY
        }],
        minItems: 5,
        maxItems: 5,
        help: 'Transfer a Blockstack ID to a new address (`NEW_ID_ADDRESS`).  Optionally preserve ' + 'its zone file (`KEEP_ZONEFILE`).  If the command succeeds, it will print a transaction ID.  ' + 'Once the transaction reaches 7 confirmations, the Blockstack peer network will transfer the ' + "Blockstack ID to the new ID-address.  You can track the transaction's confirmations with " + 'the `get_confirmations` command.\n' + '\n' + 'NOTE: This command only works for on-chain Blockstack IDs.  It does not yet work for subdomains.\n' + '\n' + 'An ID-address can only own up to 25 Blockstack IDs.  In practice, you should generate a new ' + 'owner key and ID-address for each name you receive (via the `get_owner_keys` command).\n' + '\n' + 'Example:\n' + '\n' + '    $ # Tip: you can get your owner key from your backup phrase with "get_owner_keys".\n' + '    $ # Tip: you can get your payment key from your backup phrase with "get_payment_key".\n' + '    $ export OWNER="136ff26efa5db6f06b28f9c8c7a0216a1a52598045162abfe435d13036154a1b01"\n' + '    $ export PAYMENT="bfeffdf57f29b0cc1fab9ea197bb1413da2561fe4b83e962c7f02fbbe2b1cd5401"\n' + '    $ stx transfer example.id ID-1HJA1AJvWef21XbQVL2AcTv71b6JHGPfDX true "$OWNER" "$PAYMENT"\n' + '    e09dc158e586d0c09dbcdcba917ec394e6c6ac2b9c91c4b55f32f5973e4f08fc\n' + '\n',
        group: 'Blockstack ID Management'
      },
      tx_preorder: {
        type: 'array',
        items: [{
          name: 'blockstack_id',
          type: 'string',
          realtype: 'on-chain-blockstack_id',
          pattern: NAME_PATTERN
        }, {
          name: 'id_address',
          type: 'string',
          realtype: 'id-address',
          pattern: ID_ADDRESS_PATTERN
        }, {
          name: 'payment_key',
          type: 'string',
          realtype: 'private_key',
          pattern: "" + PRIVATE_KEY_PATTERN_ANY
        }],
        minItems: 3,
        maxItems: 3,
        help: 'Generate and send `NAME_PREORDER` transaction, for a Blockstack ID to be owned ' + 'by a given `ID_ADDRESS`.  The name cost will be paid for by the gven `PAYMENT_KEY`.  The ' + 'ID-address should be a never-before-seen address, since it will be used as a salt when ' + 'generating the name preorder hash.\n' + '\n' + 'This is a low-level command that only experienced Blockstack developers should use.  ' + 'If you just want to register a name, use the "register" command.\n',
        group: 'Blockstack ID Management'
      },
      tx_register: {
        type: 'array',
        items: [{
          name: 'blockstack_id',
          type: 'string',
          realtype: 'on-chain-blockstack_id',
          pattern: NAME_PATTERN
        }, {
          name: 'id_address',
          type: 'string',
          realtype: 'id-address',
          pattern: ID_ADDRESS_PATTERN
        }, {
          name: 'payment_key',
          type: 'string',
          realtype: 'private_key',
          pattern: "" + PRIVATE_KEY_PATTERN_ANY
        }, {
          name: 'zonefile',
          type: 'string',
          realtype: 'path'
        }, {
          name: 'zonefile_hash',
          type: 'string',
          realtype: 'zoenfile_hash',
          pattern: ZONEFILE_HASH_PATTERN
        }],
        minItems: 3,
        maxItems: 5,
        help: 'Generate and send a NAME_REGISTRATION transaction, assigning the given `BLOCKSTACK_ID` ' + 'to the given `ID_ADDRESS`.  Optionally pair the Blockstack ID with a zone file (`ZONEFILE`) or ' + 'the hash of the zone file (`ZONEFILE_HASH`).  You will need to push the zone file to the peer ' + 'network after the transaction confirms (i.e. with `zonefile_push`).\n' + '\n' + 'This is a low-level command that only experienced Blockstack developers should use.  If you ' + 'just want to register a name, you should use the `register` command.',
        group: 'Blockstack ID Management'
      },
      update: {
        type: 'array',
        items: [{
          name: 'blockstack_id',
          type: 'string',
          realtype: 'on-chain-blockstack_id',
          pattern: NAME_PATTERN
        }, {
          name: 'zonefile',
          type: 'string',
          realtype: 'path'
        }, {
          name: 'owner_key',
          type: 'string',
          realtype: 'private_key',
          pattern: "" + PRIVATE_KEY_PATTERN_ANY
        }, {
          name: 'payment_key',
          type: 'string',
          realtype: 'private_key',
          pattern: "" + PRIVATE_KEY_PATTERN_ANY
        }, {
          name: 'zonefile_hash',
          type: 'string',
          realtype: 'zonefile_hash',
          pattern: ZONEFILE_HASH_PATTERN
        }],
        minItems: 4,
        maxItems: 5,
        help: 'Update the zonefile for an on-chain Blockstack ID.  You can generate a well-formed ' + 'zone file using the `make_zonefile` command, or you can supply your own.  Zone files can be ' + 'up to 40Kb.  Alternatively, if you only want to announce the hash of a zone file (or any ' + 'arbitrary 20-byte hex string), you can do so by passing a value for `ZONEFILE_HASH`.  If `ZONEFILE_HASH` ' + 'is given, then the value for `ZONEFILE` will be ignored.\n' + '\n' + 'If this command succeeds, it prints out a transaction ID.  Once the transaction has 7 confirmations, ' + "the Blockstack peer network will set the name's zone file hash to the `RIPEMD160`(SHA256) hash of " + 'the given zone file (or it will simply set it to the hash given in `ZONEFILE_HASH`).\n' + '\n' + 'Once the transaction confirms, you will need to replicate the zone file to the Blockstack peer network.  ' + 'This can be done with the `zonefile_push` command.  Until you do so, no Blockstack clients will be able ' + 'to obtain the zone file announced by this command.\n' + '\n' + 'Example:\n' + '\n' + '    $ # Tip: you can get your owner and payment keys from your 12-word backup phrase using the get_owner_keys and get_payment_key commands.\n' + '    $ export OWNER="6e50431b955fe73f079469b24f06480aee44e4519282686433195b3c4b5336ef01"\n' + '    $ export PAYMENT="bfeffdf57f29b0cc1fab9ea197bb1413da2561fe4b83e962c7f02fbbe2b1cd5401"\n' + '    $ # make a new zone file\n' + '    $ stx make_zonefile example.id ID-1ArdkA2oLaKnbNbLccBaFhEV4pYju8hJ82 https://my.gaia.hub/hub > /tmp/zonefile.txt\n' + '    \n' + '    $ # update the name to reference this new zone file\n' + '    $ stx update example.id /tmp/zonefile.txt "$OWNER" "$PAYMENT"\n' + '    8e94a5b6647276727a343713d3213d587836e1322b1e38bc158406f5f8ebe3fd\n' + '    \n' + '    $ # check confirmations\n' + '    $ stx get_confirmations e41ce043ab64fd5a5fd382fba21acba8c1f46cbb1d7c08771ada858ce7d29eea\n' + '    {\n' + '      "blockHeight": 567890,\n' + '      "confirmations": 7,\n' + '    }\n' + '    \n' + '    $ # send out the new zone file to a Blockstack peer\n' + '    $ stx -H https://core.blockstack.org zonefile_push /tmp/zonefile.txt\n' + '    [\n' + '      "https://core.blockstack.org"\n' + '    ]\n' + '\n',
        group: 'Blockstack ID Management'
      },
      whois: {
        type: 'array',
        items: [{
          name: 'blockstack_id',
          type: 'string',
          realtype: 'blockstack_id',
          pattern: NAME_PATTERN + '|' + SUBDOMAIN_PATTERN
        }],
        minItems: 1,
        maxItems: 1,
        help: 'Look up the zone file and owner of a Blockstack ID.  Works with both on-chain and off-chain names.\n' + '\n' + 'Example:\n' + '\n' + '    $ stx whois example.id\n' + '    {\n' + '      "address": "1ArdkA2oLaKnbNbLccBaFhEV4pYju8hJ82",\n' + '      "block_renewed_at": 567890,\n' + '      "blockchain": "bitcoin",\n' + '      "expire_block": 687010,\n' + '      "grace_period": false,\n' + '      "last_transaction_height": "567891",\n' + '      "last_txid": "a564aa482ee43eb2bdfb016e01ea3b950bab0cfa39eace627d632e73c7c93e48",\n' + '      "owner_script": "76a9146c1c2fc3cf74d900c51e9b5628205130d7b98ae488ac",\n' + '      "renewal_deadline": 692010,\n' + '      "resolver": null,\n' + '      "status": "registered",\n' + '      "zonefile": "$ORIGIN example.id\\n$TTL 3600\\n_http._tcp URI 10 1 \\"https://gaia.blockstack.org/hub/1ArdkA2oLaKnbNbLccBaFhEV4pYju8hJ82/profile.json\\"\\n",\n' + '      "zonefile_hash": "ae4ee8e7f30aa890468164e667e2c203266f726e"\n' + '    }\n' + '\n',
        group: 'Querying Blockstack IDs'
      },
      zonefile_push: {
        type: 'array',
        items: [{
          name: 'zonefile',
          type: 'string',
          realtype: 'path'
        }],
        minItems: 1,
        maxItems: 1,
        help: 'Push a zone file on disk to the Blockstack peer network.  The zone file must ' + 'correspond to a zone file hash that has already been announced.  That is, you use this command ' + 'in conjunction with the `register`, `update`, `renew`, or `name_import` commands.\n' + '\n' + 'Example:\n' + '\n' + '    $ stx -H https://core.blockstack.org zonefile_push /path/to/zonefile.txt\n' + '    [\n' + '      "https://core.blockstack.org"\n' + '    ]\n' + '\n',
        group: 'Peer Services'
      },
      get_did_configuration: {
        type: 'array',
        items: [{
          name: 'blockstack_id',
          type: 'string',
          realtype: 'blockstack_id',
          pattern: NAME_PATTERN + '|' + SUBDOMAIN_PATTERN
        }, {
          name: 'domain',
          type: 'string',
          realtype: 'domain',
          pattern: NAME_PATTERN + '|' + SUBDOMAIN_PATTERN
        }, {
          name: 'owner_key',
          type: 'string',
          realtype: 'private_key',
          pattern: "" + PRIVATE_KEY_PATTERN
        }],
        minItems: 3,
        maxItems: 3,
        help: 'Creates a DID configuration for the given blockstack id and domain to create a link between both.' + 'The specification is define by the Decentralized Identity Foundation at https://identity.foundation/specs/did-configuration/\n' + 'The DID configuration should be placed in the json file ".well_known/did_configuration"' + '\n' + 'Example:\n' + '\n' + '    $ # Tip: you can get your owner keys from your 12-word backup phrase using the get_owner_keys command.\n' + '    $ export PRIVATE_OWNER_KEY="6e50431b955fe73f079469b24f06480aee44e4519282686433195b3c4b5336ef01"\n' + '    $ stx get_did_configuration public_profile_for_testing.id.blockstack helloblockstack.com PRIVATE_OWNER_KEY\n' + '    {\n' + '       "entries": [\n' + '          {\n' + '            "did": "did:stack:v0:SewTRvPZUEQGdr45QvEnVMGHZBhx3FT1Jj-0",\n' + '            "jwt": "eyJ0eXAiOiJKV1QiL...."\n' + '          }\n' + '       ]\n' + '    }\n' + '\n' + 'The decoded content of the jwt above is \n' + '    {\n' + '       "header": {\n' + '          "typ": "JWT", "alg": "ES256K"\n' + '       },\n' + '       "payload": {\n' + '           "iss": "did:stack:v0:SewTRvPZUEQGdr45QvEnVMGHZBhx3FT1Jj-0",\n' + '           "domain": "helloblockstack.com",\n' + '           "exp": "2020-12-07T13:05:28.375Z"\n' + '       },\n' + '       "signature": "NDY7ISzgAHKcZDvbxzTxQdVnf6xWMZ46w5vHcDpNx_1Fsyip0M6E6GMq_2YZ-gUcwmwlo8Ag9jgnfOkaBIFpoQ"\n' + '    }\n' + '\n',
        group: 'DID'
      }
    },
    additionalProperties: false,
    strict: true
  };
  var USAGE = "Usage: " + process$1.argv[1] + " [options] command [command arguments]\nOptions can be:\n    -c                  Path to a config file (defaults to\n                        " + DEFAULT_CONFIG_PATH + ")\n\n    -d                  Print verbose debugging output\n\n    -e                  Estimate the BTC cost of an transaction (in satoshis).\n                        Do not generate or send any transactions.\n\n    -m MAGIC_BYTES      Use an alternative magic byte string instead of \"id\".\n\n    -t                  Use the public testnet instead of mainnet.\n\n    -i                  Use integration test framework instead of mainnet.\n\n    -U                  Unsafe mode.  No safety checks will be performed.\n\n    -x                  Do not broadcast a transaction.  Only generate and\n                        print them to stdout.\n\n    -B BURN_ADDR        Use the given namespace burn address instead of the one\n                        obtained from the Blockstack network (DANGEROUS)\n\n    -D DENOMINATION     Denominate the price to pay in the given units\n                        (DANGEROUS)\n\n    -C CONSENSUS_HASH   Use the given consensus hash instead of one obtained\n                        from the network\n\n    -F FEE_RATE         Use the given transaction fee rate instead of the one\n                        obtained from the Bitcoin network\n\n    -G GRACE_PERIOD     Number of blocks in which a name can be renewed after it\n                        expires (DANGEROUS)\n\n    -H URL              Use an alternative Blockstack Core API endpoint.\n\n    -I URL              Use an alternative Blockstack Core Indexer endpoint.\n\n    -M MAX_INDEX        Maximum keychain index to use when searching for an identity address\n                        (default is " + DEFAULT_MAX_ID_SEARCH_INDEX + ").\n\n    -N PAY2NS_PERIOD    Number of blocks in which a namespace receives the registration\n                        and renewal fees after it is created (DANGEROUS)\n\n    -P PRICE            Use the given price to pay for names or namespaces\n                        (DANGEROUS)\n\n    -T URL              Use an alternative Blockstack transaction broadcaster.\n    \n    -X URL              Use an alternative UTXO service endpoint.\n\n    -u USERNAME         A username to be passed to bitcoind RPC endpoints\n\n    -p PASSWORD         A password to be passed to bitcoind RPC endpoints\n";

  function formatHelpString(indent, limit, helpString) {
    var lines = helpString.split('\n');
    var buf = '';
    var pad = '';

    for (var i = 0; i < indent; i++) {
      pad += ' ';
    }

    for (var _i = 0; _i < lines.length; _i++) {
      var linebuf = pad.slice();

      var words = lines[_i].split(/ /).filter(function (word) {
        return word.length > 0;
      });

      if (words.length == 0) {
        buf += '\n';
        continue;
      }

      if (words[0] === '$' || lines[_i].substring(0, 4) === '    ') {
        buf += lines[_i] + '\n';
        continue;
      }

      for (var j = 0; j < words.length; j++) {
        if (words[j].length === 0) {
          linebuf += '\n';
          break;
        }

        if (linebuf.split('\n').slice(-1)[0].length + 1 + words[j].length > limit) {
          linebuf += '\n';
          linebuf += pad;
        }

        linebuf += words[j] + ' ';
      }

      buf += linebuf + '\n';
    }

    return buf;
  }

  function formatCommandHelpLines(commandName, commandArgs) {
    var rawUsage = '';
    var kwUsage = '';
    var kwPad = '';
    var commandInfo = CLI_ARGS.properties[commandName];
    rawUsage = "  " + commandName + " ";

    for (var i = 0; i < commandArgs.length; i++) {
      if (!commandArgs[i].name) {
        console.log(commandName);
        console.log(commandArgs[i]);
        throw new Error('BUG: command info is missing a "name" field');
      }

      if (i + 1 <= commandInfo.minItems) {
        rawUsage += commandArgs[i].name.toUpperCase() + " ";
      } else {
        rawUsage += "[" + commandArgs[i].name.toUpperCase() + "] ";
      }
    }

    kwUsage = "  " + commandName + " ";

    for (var _i2 = 0; _i2 < commandName.length + 3; _i2++) {
      kwPad += ' ';
    }

    for (var _i3 = 0; _i3 < commandArgs.length; _i3++) {
      if (!commandArgs[_i3].realtype) {
        console.log(commandName);
        console.log(commandArgs[_i3]);
        throw new Error('BUG: command info is missing a "realtype" field');
      }

      if (_i3 + 1 <= commandInfo.minItems) {
        kwUsage += "--" + commandArgs[_i3].name + " " + commandArgs[_i3].realtype.toUpperCase();
      } else {
        kwUsage += "[--" + commandArgs[_i3].name + " " + commandArgs[_i3].realtype.toUpperCase() + "]";
      }

      kwUsage += '\n';
      kwUsage += kwPad;
    }

    return {
      raw: rawUsage,
      kw: kwUsage
    };
  }

  function getCommandGroups() {
    var groups = {};
    var commands = Object.keys(CLI_ARGS.properties);

    for (var i = 0; i < commands.length; i++) {
      var command = commands[i];
      var group = CLI_ARGS.properties[command].group;

      if (!groups.hasOwnProperty(group)) {
        groups[group] = [{
          command: command,
          help: CLI_ARGS.properties[command].help
        }];
      } else {
        groups[group].push({
          command: command,
          help: CLI_ARGS.properties[command].help
        });
      }
    }

    return groups;
  }

  function makeAllCommandsList() {
    var groups = getCommandGroups();
    var groupNames = Object.keys(groups).sort();
    var res = "All commands (run '" + process$1.argv[1] + " help COMMAND' for details):\n";

    for (var i = 0; i < groupNames.length; i++) {
      res += "  " + groupNames[i] + ": ";
      var cmds = [];

      for (var j = 0; j < groups[groupNames[i]].length; j++) {
        cmds.push(groups[groupNames[i]][j].command);
      }

      var helpLineSpaces = formatHelpString(4, 70, cmds.join(' '));
      var helpLineCSV = '    ' + helpLineSpaces.split('\n    ').map(function (line) {
        return line.trim().replace(/ /g, ', ');
      }).join('\n    ') + '\n';
      res += '\n' + helpLineCSV;
      res += '\n';
    }

    return res.trim();
  }
  function makeAllCommandsHelp() {
    var groups = getCommandGroups();
    var groupNames = Object.keys(groups).sort();
    var helps = [];
    var cmds = [];

    for (var i = 0; i < groupNames.length; i++) {
      for (var j = 0; j < groups[groupNames[i]].length; j++) {
        cmds.push(groups[groupNames[i]][j].command);
      }
    }

    cmds = cmds.sort();

    for (var _i4 = 0; _i4 < cmds.length; _i4++) {
      helps.push(makeCommandUsageString(cmds[_i4]).trim());
    }

    return helps.join('\n\n');
  }
  function makeCommandUsageString(command) {
    var res = '';

    if (command === 'all') {
      return makeAllCommandsHelp();
    }

    if (!command) {
      return makeAllCommandsList();
    }

    var commandInfo = CLI_ARGS.properties[command];

    if (!commandInfo || command === 'help') {
      return makeAllCommandsList();
    }

    var help = commandInfo.help;
    var cmdFormat = formatCommandHelpLines(command, commandInfo.items);
    var formattedHelp = formatHelpString(2, 78, help);
    res += "Command: " + command + "\n";
    res += 'Usage:\n';
    res += cmdFormat.raw + "\n";
    res += cmdFormat.kw + "\n";
    res += formattedHelp;
    return res.trim() + '\n';
  }
  function getCLIOpts(argv, opts) {
    if (opts === void 0) {
      opts = 'deitUxC:F:B:P:D:G:N:H:T:I:m:M:X:u:p:';
    }

    var optsTable = {};
    var remainingArgv = [];
    var argvBuff = argv.slice(0);

    for (var i = 0; i < opts.length; i++) {
      if (opts[i] == ':') {
        continue;
      }

      if (i + 1 < opts.length && opts[i + 1] == ':') {
        optsTable[opts[i]] = null;
      } else {
        optsTable[opts[i]] = false;
      }
    }

    for (var _i5 = 0, _Object$keys = Object.keys(optsTable); _i5 < _Object$keys.length; _i5++) {
      var opt = _Object$keys[_i5];

      for (var _i6 = 0; _i6 < argvBuff.length; _i6++) {
        if (argvBuff[_i6] === null) {
          break;
        }

        if (argvBuff[_i6] === '--') {
          break;
        }

        var argvOpt = "-" + opt;

        if (argvOpt === argvBuff[_i6]) {
          if (optsTable[opt] === false) {
            optsTable[opt] = true;
            argvBuff[_i6] = '';
          } else {
            optsTable[opt] = argvBuff[_i6 + 1];
            argvBuff[_i6] = '';
            argvBuff[_i6 + 1] = '';
          }
        }
      }
    }

    for (var _i7 = 0; _i7 < argvBuff.length; _i7++) {
      if (argvBuff[_i7].length > 0) {
        if (argvBuff[_i7] === '--') {
          continue;
        }

        remainingArgv.push(argvBuff[_i7]);
      }
    }

    optsTable['_'] = remainingArgv;
    return optsTable;
  }
  function CLIOptAsString(opts, key) {
    if (opts[key] === null || opts[key] === undefined) {
      return null;
    } else if (typeof opts[key] === 'string') {
      return "" + opts[key];
    } else {
      throw new Error("Option '" + key + "' is not a string");
    }
  }
  function CLIOptAsBool(opts, key) {
    if (typeof opts[key] === 'boolean' || opts[key] === null) {
      return !!opts[key];
    } else {
      throw new Error("Option '" + key + "' is not a boolean");
    }
  }

  function isStringArray(value) {
    if (value instanceof Array) {
      return value.map(function (s) {
        return typeof s === 'string';
      }).reduce(function (x, y) {
        return x && y;
      }, true);
    } else {
      return false;
    }
  }

  function CLIOptAsStringArray(opts, key) {
    var value = opts[key];

    if (value === null || value === undefined) {
      return null;
    } else if (isStringArray(value)) {
      return value;
    } else {
      throw new Error("Option '" + key + "' is not a string array");
    }
  }
  function getCommandArgs(command, argsList) {
    var commandProps = CLI_ARGS.properties[command].items;

    if (!Array.isArray(commandProps)) {
      commandProps = [commandProps];
    }

    var orderedArgs = [];
    var foundArgs = {};

    for (var i = 0; i < argsList.length; i++) {
      if (argsList[i].startsWith('--')) {
        var argName = argsList[i].slice(2);
        var argValue = null;

        if (foundArgs.hasOwnProperty(argName)) {
          return {
            status: false,
            error: "duplicate argument " + argsList[i]
          };
        }

        for (var j = 0; j < commandProps.length; j++) {
          if (!commandProps[j].hasOwnProperty('name')) {
            continue;
          }

          if (commandProps[j].name === argName) {
            if (i + 1 >= argsList.length) {
              return {
                status: false,
                error: "no value for argument " + argsList[i]
              };
            }

            argValue = argsList[i + 1];
          }
        }

        if (argValue) {
          i += 1;
          foundArgs[argName] = argValue;
        } else {
          return {
            status: false,
            error: "no such argument " + argsList[i]
          };
        }
      } else {
        orderedArgs.push(argsList[i]);
      }
    }

    var mergedArgs = [];
    var orderedArgIndex = 0;

    for (var _i8 = 0; _i8 < commandProps.length; _i8++) {
      if (orderedArgIndex < orderedArgs.length) {
        if (!commandProps[_i8].hasOwnProperty('name')) {
          mergedArgs.push(orderedArgs[orderedArgIndex]);
          orderedArgIndex += 1;
        } else if (!foundArgs.hasOwnProperty(commandProps[_i8].name)) {
          mergedArgs.push(orderedArgs[orderedArgIndex]);
          orderedArgIndex += 1;
        } else {
          mergedArgs.push(foundArgs[commandProps[_i8].name]);
        }
      } else {
        mergedArgs.push(foundArgs[commandProps[_i8].name]);
      }
    }

    return {
      status: true,
      arguments: mergedArgs
    };
  }
  function checkArgs(argList) {
    if (argList.length <= 2) {
      return {
        success: false,
        error: 'No command given',
        usage: true,
        command: ''
      };
    }

    var commandName = argList[2];
    var allCommandArgs = argList.slice(3);

    if (!CLI_ARGS.properties.hasOwnProperty(commandName)) {
      return {
        success: false,
        error: "Unrecognized command '" + commandName + "'",
        usage: true,
        command: commandName
      };
    }

    var parsedCommandArgs = getCommandArgs(commandName, allCommandArgs);

    if (!parsedCommandArgs.status) {
      return {
        success: false,
        error: parsedCommandArgs.error,
        usage: true,
        command: commandName
      };
    }

    var commandArgs = parsedCommandArgs.arguments;
    var commandSchema = JSON.parse(JSON.stringify(CLI_ARGS.properties[commandName]));

    for (var i = commandSchema.minItems; i < commandSchema.maxItems; i++) {
      if (i < commandArgs.length) {
        if (commandArgs[i] === null || commandArgs[i] === undefined) {
          commandArgs[i] = null;
          commandSchema.items[i] = {
            type: 'null'
          };
        }
      }
    }

    var ajv = Ajv__default['default']();
    var valid = ajv.validate(commandSchema, commandArgs);

    if (!valid) {
      var errorMsg = '';

      for (var _i9 = 0; _i9 < ajv.errors.length; _i9++) {
        var msg = "Invalid command arguments: Schema \"" + ajv.errors[0].schemaPath + "\" failed validation (problem: \"" + ajv.errors[0].message + "\", cause: \"" + JSON.stringify(ajv.errors[0].params) + "\")\n";
        errorMsg += msg;
      }

      return {
        success: false,
        error: errorMsg,
        usage: true,
        command: commandName
      };
    }

    return {
      success: true,
      command: commandName,
      args: commandArgs
    };
  }
  function loadConfig(configFile, networkType) {
    if (networkType !== 'mainnet' && networkType !== 'testnet' && networkType != 'regtest') {
      throw new Error('Unregognized network');
    }

    var configRet;

    if (networkType === 'mainnet') {
      configRet = Object.assign({}, CONFIG_DEFAULTS);
    } else if (networkType === 'regtest') {
      configRet = Object.assign({}, CONFIG_REGTEST_DEFAULTS);
    } else {
      configRet = Object.assign({}, CONFIG_TESTNET_DEFAULTS);
    }

    try {
      configRet = JSON.parse(fs.readFileSync(configFile).toString());
    } catch (e) {}

    return configRet;
  }

  function encryptBackupPhrase(plaintextBuffer, password) {
    return blockstack.encryptMnemonic(plaintextBuffer, password);
  }
  function decryptBackupPhrase(dataBuffer, password) {
    return blockstack.decryptMnemonic(dataBuffer, password);
  }

  var ZoneFile = /*#__PURE__*/require('zone-file');

  var CLITransactionSigner = /*#__PURE__*/function () {
    function CLITransactionSigner(address) {
      if (address === void 0) {
        address = '';
      }

      this.address = address;
      this.isComplete = false;
    }

    var _proto = CLITransactionSigner.prototype;

    _proto.getAddress = function getAddress() {
      var _this = this;

      return Promise.resolve().then(function () {
        return _this.address;
      });
    };

    _proto.signTransaction = function signTransaction(_txIn, _signingIndex) {
      return Promise.resolve().then(function () {});
    };

    _proto.signerVersion = function signerVersion() {
      return 0;
    };

    return CLITransactionSigner;
  }();

  var NullSigner = /*#__PURE__*/function (_CLITransactionSigner) {
    _inheritsLoose(NullSigner, _CLITransactionSigner);

    function NullSigner() {
      return _CLITransactionSigner.apply(this, arguments) || this;
    }

    return NullSigner;
  }(CLITransactionSigner);
  var MultiSigKeySigner = /*#__PURE__*/function (_CLITransactionSigner2) {
    _inheritsLoose(MultiSigKeySigner, _CLITransactionSigner2);

    function MultiSigKeySigner(redeemScript, privateKeys) {
      var _this2;

      _this2 = _CLITransactionSigner2.call(this) || this;
      _this2.redeemScript = Buffer.from(redeemScript, 'hex');
      _this2.privateKeys = privateKeys;
      _this2.isComplete = true;

      try {
        var chunks = bitcoin.script.decompile(_this2.redeemScript);
        var firstOp = chunks[0];
        _this2.m = parseInt(bitcoin.script.toASM([firstOp]).slice(3), 10);
        _this2.address = bitcoin.address.toBase58Check(bitcoin.crypto.hash160(_this2.redeemScript), blockstack.config.network.layer1.scriptHash);
      } catch (e) {
        logger.error(e);
        throw new Error('Improper redeem script for multi-sig input.');
      }

      return _this2;
    }

    var _proto2 = MultiSigKeySigner.prototype;

    _proto2.getAddress = function getAddress() {
      var _this3 = this;

      return Promise.resolve().then(function () {
        return _this3.address;
      });
    };

    _proto2.signTransaction = function signTransaction(txIn, signingIndex) {
      var _this4 = this;

      return Promise.resolve().then(function () {
        var keysToUse = _this4.privateKeys.slice(0, _this4.m);

        keysToUse.forEach(function (keyHex) {
          var ecPair = blockstack.hexStringToECPair(keyHex);
          txIn.sign(signingIndex, ecPair, _this4.redeemScript);
        });
      });
    };

    _proto2.signerVersion = function signerVersion() {
      return 0;
    };

    return MultiSigKeySigner;
  }(CLITransactionSigner);
  var SegwitP2SHKeySigner = /*#__PURE__*/function (_CLITransactionSigner3) {
    _inheritsLoose(SegwitP2SHKeySigner, _CLITransactionSigner3);

    function SegwitP2SHKeySigner(redeemScript, witnessScript, m, privateKeys) {
      var _this5;

      _this5 = _CLITransactionSigner3.call(this) || this;
      _this5.redeemScript = Buffer.from(redeemScript, 'hex');
      _this5.witnessScript = Buffer.from(witnessScript, 'hex');
      _this5.address = bitcoin.address.toBase58Check(bitcoin.crypto.hash160(_this5.redeemScript), blockstack.config.network.layer1.scriptHash);
      _this5.privateKeys = privateKeys;
      _this5.m = m;
      _this5.isComplete = true;
      return _this5;
    }

    var _proto3 = SegwitP2SHKeySigner.prototype;

    _proto3.getAddress = function getAddress() {
      var _this6 = this;

      return Promise.resolve().then(function () {
        return _this6.address;
      });
    };

    _proto3.findUTXO = function findUTXO(txIn, signingIndex, utxos) {
      var private_tx = txIn.__TX;
      var txidBuf = new Buffer(private_tx.ins[signingIndex].hash.slice());
      var outpoint = private_tx.ins[signingIndex].index;
      txidBuf.reverse();
      var txid = txidBuf.toString('hex');

      for (var i = 0; i < utxos.length; i++) {
        if (utxos[i].tx_hash === txid && utxos[i].tx_output_n === outpoint) {
          if (!utxos[i].value) {
            throw new Error("UTXO for hash=" + txid + " vout=" + outpoint + " has no value");
          }

          return utxos[i];
        }
      }

      throw new Error("No UTXO for input hash=" + txid + " vout=" + outpoint);
    };

    _proto3.signTransaction = function signTransaction(txIn, signingIndex) {
      var _this7 = this;

      return Promise.resolve().then(function () {
        return _this7.getAddress();
      }).then(function (address) {
        return blockstack.config.network.getUTXOs(address);
      }).then(function (utxos) {
        var utxo = _this7.findUTXO(txIn, signingIndex, utxos);

        if (_this7.m === 1) {
          var ecPair = blockstack.hexStringToECPair(_this7.privateKeys[0]);
          txIn.sign(signingIndex, ecPair, _this7.redeemScript, undefined, utxo.value);
        } else {
          var keysToUse = _this7.privateKeys.slice(0, _this7.m);

          keysToUse.forEach(function (keyHex) {
            var ecPair = blockstack.hexStringToECPair(keyHex);
            txIn.sign(signingIndex, ecPair, _this7.redeemScript, undefined, utxo.value, _this7.witnessScript);
          });
        }
      });
    };

    _proto3.signerVersion = function signerVersion() {
      return 0;
    };

    return SegwitP2SHKeySigner;
  }(CLITransactionSigner);

  function isCLITransactionSigner(signer) {
    return signer.signerVersion !== undefined;
  }
  function parseNullSigner(addrString) {
    if (!addrString.startsWith('nosign:')) {
      throw new Error('Invalid nosign string');
    }

    var addr = addrString.slice('nosign:'.length);
    return new NullSigner(addr);
  }
  function parseMultiSigKeys(serializedPrivateKeys) {
    var matches = serializedPrivateKeys.match(PRIVATE_KEY_MULTISIG_PATTERN);

    if (!matches) {
      throw new Error('Invalid multisig private key string');
    }

    var m = parseInt(matches[1]);
    var parts = serializedPrivateKeys.split(',');
    var privkeys = [];

    for (var i = 1; i < 256; i++) {
      var pk = parts[i];

      if (!pk) {
        break;
      }

      if (!pk.match(PRIVATE_KEY_PATTERN)) {
        throw new Error('Invalid private key string');
      }

      privkeys.push(pk);
    }

    var pubkeys = privkeys.map(function (pk) {
      return Buffer.from(getPublicKeyFromPrivateKey(pk), 'hex');
    });
    var multisigInfo = bitcoin.payments.p2ms({
      m: m,
      pubkeys: pubkeys
    });
    return new MultiSigKeySigner(multisigInfo.output.toString('hex'), privkeys);
  }
  function parseSegwitP2SHKeys(serializedPrivateKeys) {
    var matches = serializedPrivateKeys.match(PRIVATE_KEY_SEGWIT_P2SH_PATTERN);

    if (!matches) {
      throw new Error('Invalid segwit p2sh private key string');
    }

    var m = parseInt(matches[1]);
    var parts = serializedPrivateKeys.split(',');
    var privkeys = [];

    for (var i = 1; i < 256; i++) {
      var pk = parts[i];

      if (!pk) {
        break;
      }

      if (!pk.match(PRIVATE_KEY_PATTERN)) {
        throw new Error('Invalid private key string');
      }

      privkeys.push(pk);
    }

    var pubkeys = privkeys.map(function (pk) {
      return Buffer.from(getPublicKeyFromPrivateKey(pk), 'hex');
    });
    var redeemScript;
    var witnessScript = '';

    if (m === 1) {
      var p2wpkh = bitcoin.payments.p2wpkh({
        pubkey: pubkeys[0]
      });
      var p2sh = bitcoin.payments.p2sh({
        redeem: p2wpkh
      });
      redeemScript = p2sh.redeem.output.toString('hex');
    } else {
      var p2ms = bitcoin.payments.p2ms({
        m: m,
        pubkeys: pubkeys
      });
      var p2wsh = bitcoin.payments.p2wsh({
        redeem: p2ms
      });

      var _p2sh = bitcoin.payments.p2sh({
        redeem: p2wsh
      });

      redeemScript = _p2sh.redeem.output.toString('hex');
      witnessScript = p2wsh.redeem.output.toString('hex');
    }

    return new SegwitP2SHKeySigner(redeemScript, witnessScript, m, privkeys);
  }
  function decodePrivateKey(serializedPrivateKey) {
    var nosignMatches = serializedPrivateKey.match(PRIVATE_KEY_NOSIGN_PATTERN);

    if (!!nosignMatches) {
      return parseNullSigner(serializedPrivateKey);
    }

    var singleKeyMatches = serializedPrivateKey.match(PRIVATE_KEY_PATTERN);

    if (!!singleKeyMatches) {
      return serializedPrivateKey;
    }

    var multiKeyMatches = serializedPrivateKey.match(PRIVATE_KEY_MULTISIG_PATTERN);

    if (!!multiKeyMatches) {
      return parseMultiSigKeys(serializedPrivateKey);
    }

    var segwitP2SHMatches = serializedPrivateKey.match(PRIVATE_KEY_SEGWIT_P2SH_PATTERN);

    if (!!segwitP2SHMatches) {
      return parseSegwitP2SHKeys(serializedPrivateKey);
    }

    throw new Error('Unparseable private key');
  }
  function JSONStringify(obj, stderr) {
    if (stderr === void 0) {
      stderr = false;
    }

    if (!stderr && process.stdout.isTTY || stderr && process.stderr.isTTY) {
      return JSON.stringify(obj, null, 2);
    } else {
      return JSON.stringify(obj);
    }
  }
  function getPublicKeyFromPrivateKey(privateKey) {
    var ecKeyPair = blockstack.hexStringToECPair(privateKey);
    return ecKeyPair.publicKey.toString('hex');
  }
  function getPrivateKeyAddress(network, privateKey) {
    if (isCLITransactionSigner(privateKey)) {
      var pkts = privateKey;
      return pkts.address;
    } else {
      var pk = privateKey;
      var ecKeyPair = blockstack.hexStringToECPair(pk);
      return network.coerceAddress(blockstack.ecPairToAddress(ecKeyPair));
    }
  }
  function canonicalPrivateKey(privkey) {
    if (privkey.length == 66 && privkey.slice(-2) === '01') {
      return privkey.substring(0, 64);
    }

    return privkey;
  }
  function makeProfileJWT(profileData, privateKey) {
    var signedToken = blockstack.signProfileToken(profileData, privateKey);
    var wrappedToken = blockstack.wrapProfileToken(signedToken);
    var tokenRecords = [wrappedToken];
    return JSONStringify(tokenRecords);
  }

  function getNameInfoEasy(network, name) {
    var nameInfoPromise = network.getNameInfo(name).then(function (nameInfo) {
      return nameInfo;
    })["catch"](function (error) {
      if (error.message === 'Name not found') {
        return null;
      } else {
        throw error;
      }
    });
    return nameInfoPromise;
  }
  function nameLookup(_x8, _x9, _x10) {
    return _nameLookup.apply(this, arguments);
  }

  function _nameLookup() {
    _nameLookup = _asyncToGenerator( /*#__PURE__*/runtime_1.mark(function _callee3(network, name, includeProfile) {
      var nameInfoPromise, profilePromise, zonefilePromise, _yield$Promise$all, profile, zonefile, nameInfo, profileObj, profileUrl, zonefileJSON, ret;

      return runtime_1.wrap(function _callee3$(_context3) {
        while (1) {
          switch (_context3.prev = _context3.next) {
            case 0:
              if (includeProfile === void 0) {
                includeProfile = true;
              }

              nameInfoPromise = getNameInfoEasy(network, name);
              profilePromise = includeProfile ? blockstack.lookupProfile(name)["catch"](function () {
                return null;
              }) : Promise.resolve().then(function () {
                return null;
              });
              zonefilePromise = nameInfoPromise.then(function (nameInfo) {
                return nameInfo ? nameInfo.zonefile : null;
              });
              _context3.next = 6;
              return Promise.all([profilePromise, zonefilePromise, nameInfoPromise]);

            case 6:
              _yield$Promise$all = _context3.sent;
              profile = _yield$Promise$all[0];
              zonefile = _yield$Promise$all[1];
              nameInfo = _yield$Promise$all[2];
              profileObj = profile;

              if (nameInfo) {
                _context3.next = 13;
                break;
              }

              throw new Error('Name not found');

            case 13:
              if (!(nameInfo.hasOwnProperty('grace_period') && nameInfo.grace_period)) {
                _context3.next = 15;
                break;
              }

              throw new Error("Name is expired at block " + nameInfo.expire_block + " " + ("and must be renewed by block " + nameInfo.renewal_deadline));

            case 15:
              profileUrl = null;

              try {
                zonefileJSON = ZoneFile.parseZoneFile(zonefile);

                if (zonefileJSON.uri && zonefileJSON.hasOwnProperty('$origin')) {
                  profileUrl = blockstack.getTokenFileUrl(zonefileJSON);
                }
              } catch (e) {
                profileObj = null;
              }

              ret = {
                zonefile: zonefile,
                profile: profileObj,
                profileUrl: profileUrl
              };
              return _context3.abrupt("return", ret);

            case 19:
            case "end":
              return _context3.stop();
          }
        }
      }, _callee3);
    }));
    return _nameLookup.apply(this, arguments);
  }

  function getpass(promptStr, cb) {
    var silentOutput = new stream.Writable({
      write: function write(_chunk, _encoding, callback) {
        callback();
      }
    });
    var rl = readline.createInterface({
      input: process.stdin,
      output: silentOutput,
      terminal: true
    });
    process.stderr.write(promptStr);
    rl.question('', function (passwd) {
      rl.close();
      process.stderr.write('\n');
      cb(passwd);
    });
    return;
  }
  function getBackupPhrase(_x11, _x12) {
    return _getBackupPhrase.apply(this, arguments);
  }

  function _getBackupPhrase() {
    _getBackupPhrase = _asyncToGenerator( /*#__PURE__*/runtime_1.mark(function _callee4(backupPhraseOrCiphertext, password) {
      var pass;
      return runtime_1.wrap(function _callee4$(_context4) {
        while (1) {
          switch (_context4.prev = _context4.next) {
            case 0:
              if (!(backupPhraseOrCiphertext.split(/ +/g).length > 1)) {
                _context4.next = 4;
                break;
              }

              return _context4.abrupt("return", backupPhraseOrCiphertext);

            case 4:
              _context4.next = 6;
              return new Promise(function (resolve, reject) {
                if (!process.stdin.isTTY && !password) {
                  reject(new Error('Password argument required in non-interactive mode'));
                } else {
                  getpass('Enter password: ', function (p) {
                    resolve(p);
                  });
                }
              });

            case 6:
              pass = _context4.sent;
              _context4.next = 9;
              return decryptBackupPhrase(Buffer.from(backupPhraseOrCiphertext, 'base64'), pass);

            case 9:
              return _context4.abrupt("return", _context4.sent);

            case 10:
            case "end":
              return _context4.stop();
          }
        }
      }, _callee4);
    }));
    return _getBackupPhrase.apply(this, arguments);
  }

  function mkdirs(path) {
    if (path.length === 0 || path[0] !== '/') {
      throw new Error('Path must be absolute');
    }

    var pathParts = path.replace(/^\//, '').split('/');
    var tmpPath = '/';

    for (var i = 0; i <= pathParts.length; i++) {
      try {
        var statInfo = fs.lstatSync(tmpPath);

        if ((statInfo.mode & fs.constants.S_IFDIR) === 0) {
          throw new Error("Not a directory: " + tmpPath);
        }
      } catch (e) {
        if (e.code === 'ENOENT') {
          fs.mkdirSync(tmpPath);
        } else {
          throw e;
        }
      }

      if (i === pathParts.length) {
        break;
      }

      tmpPath = tmpPath + "/" + pathParts[i];
    }
  }
  function getIDAddress(_x13, _x14) {
    return _getIDAddress.apply(this, arguments);
  }

  function _getIDAddress() {
    _getIDAddress = _asyncToGenerator( /*#__PURE__*/runtime_1.mark(function _callee5(network, nameOrIDAddress) {
      var nameInfo;
      return runtime_1.wrap(function _callee5$(_context5) {
        while (1) {
          switch (_context5.prev = _context5.next) {
            case 0:
              if (!nameOrIDAddress.match(ID_ADDRESS_PATTERN)) {
                _context5.next = 4;
                break;
              }

              return _context5.abrupt("return", nameOrIDAddress);

            case 4:
              _context5.next = 6;
              return network.getNameInfo(nameOrIDAddress);

            case 6:
              nameInfo = _context5.sent;
              return _context5.abrupt("return", "ID-" + nameInfo.address);

            case 8:
            case "end":
              return _context5.stop();
          }
        }
      }, _callee5);
    }));
    return _getIDAddress.apply(this, arguments);
  }

  function getOwnerKeyFromIDAddress(_x15, _x16, _x17) {
    return _getOwnerKeyFromIDAddress.apply(this, arguments);
  }

  function _getOwnerKeyFromIDAddress() {
    _getOwnerKeyFromIDAddress = _asyncToGenerator( /*#__PURE__*/runtime_1.mark(function _callee6(network, mnemonic, idAddress) {
      var index, keyInfo;
      return runtime_1.wrap(function _callee6$(_context6) {
        while (1) {
          switch (_context6.prev = _context6.next) {
            case 0:
              index = 0;

            case 1:

              _context6.next = 4;
              return getOwnerKeyInfo(network, mnemonic, index);

            case 4:
              keyInfo = _context6.sent;

              if (!(keyInfo.idAddress === idAddress)) {
                _context6.next = 7;
                break;
              }

              return _context6.abrupt("return", keyInfo.privateKey);

            case 7:
              index++;
              _context6.next = 1;
              break;

            case 10:
            case "end":
              return _context6.stop();
          }
        }
      }, _callee6);
    }));
    return _getOwnerKeyFromIDAddress.apply(this, arguments);
  }

  function getIDAppKeys(_x18, _x19, _x20, _x21) {
    return _getIDAppKeys.apply(this, arguments);
  }

  function _getIDAppKeys() {
    _getIDAppKeys = _asyncToGenerator( /*#__PURE__*/runtime_1.mark(function _callee7(network, nameOrIDAddress, appOrigin, mnemonicOrCiphertext) {
      var mnemonic, idAddress, appKeyInfo, appPrivateKey, ownerPrivateKey, ret;
      return runtime_1.wrap(function _callee7$(_context7) {
        while (1) {
          switch (_context7.prev = _context7.next) {
            case 0:
              _context7.next = 2;
              return getBackupPhrase(mnemonicOrCiphertext);

            case 2:
              mnemonic = _context7.sent;
              _context7.next = 5;
              return getIDAddress(network, nameOrIDAddress);

            case 5:
              idAddress = _context7.sent;
              _context7.next = 8;
              return getApplicationKeyInfo(network, mnemonic, idAddress, appOrigin);

            case 8:
              appKeyInfo = _context7.sent;
              appPrivateKey = extractAppKey(network, appKeyInfo);
              _context7.next = 12;
              return getOwnerKeyFromIDAddress(network, mnemonic, idAddress);

            case 12:
              ownerPrivateKey = _context7.sent;
              ret = {
                appPrivateKey: appPrivateKey,
                ownerPrivateKey: ownerPrivateKey,
                mnemonic: mnemonic
              };
              return _context7.abrupt("return", ret);

            case 15:
            case "end":
              return _context7.stop();
          }
        }
      }, _callee7);
    }));
    return _getIDAppKeys.apply(this, arguments);
  }

  function makePromptsFromArgList(expectedArgs) {
    var prompts = [];

    for (var i = 0; i < expectedArgs.length; i++) {
      prompts.push(argToPrompt(expectedArgs[i]));
    }

    return prompts;
  }
  function argToPrompt(arg) {
    var name = arg.name;
    var type = arg.type;
    var typeString = transactions.getTypeString(type);

    if (transactions.isClarityAbiPrimitive(type)) {
      if (type === 'uint128') {
        return {
          type: 'input',
          name: name,
          message: "Enter value for function argument \"" + name + "\" of type " + typeString
        };
      } else if (type === 'int128') {
        return {
          type: 'input',
          name: name,
          message: "Enter value for function argument \"" + name + "\" of type " + typeString
        };
      } else if (type === 'bool') {
        return {
          type: 'list',
          name: name,
          message: "Enter value for function argument \"" + name + "\" of type " + typeString,
          choices: ['True', 'False']
        };
      } else if (type === 'principal') {
        return {
          type: 'input',
          name: name,
          message: "Enter value for function argument \"" + name + "\" of type " + typeString
        };
      } else {
        throw new Error("Contract function contains unsupported Clarity ABI type: " + typeString);
      }
    } else if (transactions.isClarityAbiBuffer(type)) {
      return {
        type: 'input',
        name: name,
        message: "Enter value for function argument \"" + name + "\" of type " + typeString
      };
    } else if (transactions.isClarityAbiResponse(type)) {
      throw new Error("Contract function contains unsupported Clarity ABI type: " + typeString);
    } else if (transactions.isClarityAbiOptional(type)) {
      throw new Error("Contract function contains unsupported Clarity ABI type: " + typeString);
    } else if (transactions.isClarityAbiTuple(type)) {
      throw new Error("Contract function contains unsupported Clarity ABI type: " + typeString);
    } else if (transactions.isClarityAbiList(type)) {
      throw new Error("Contract function contains unsupported Clarity ABI type: " + typeString);
    } else {
      throw new Error("Contract function contains unsupported Clarity ABI type: " + typeString);
    }
  }
  function parseClarityFunctionArgAnswers(answers, expectedArgs) {
    var functionArgs = [];

    for (var i = 0; i < expectedArgs.length; i++) {
      var expectedArg = expectedArgs[i];
      var answer = answers[expectedArg.name];
      functionArgs.push(answerToClarityValue(answer, expectedArg));
    }

    return functionArgs;
  }
  function answerToClarityValue(answer, arg) {
    var type = arg.type;
    var typeString = transactions.getTypeString(type);

    if (transactions.isClarityAbiPrimitive(type)) {
      if (type === 'uint128') {
        return transactions.uintCV(answer);
      } else if (type === 'int128') {
        return transactions.intCV(answer);
      } else if (type === 'bool') {
        return answer == 'True' ? transactions.trueCV() : transactions.falseCV();
      } else if (type === 'principal') {
        return transactions.standardPrincipalCV(answer);
      } else {
        throw new Error("Contract function contains unsupported Clarity ABI type: " + typeString);
      }
    } else if (transactions.isClarityAbiBuffer(type)) {
      return transactions.bufferCVFromString(answer);
    } else if (transactions.isClarityAbiResponse(type)) {
      throw new Error("Contract function contains unsupported Clarity ABI type: " + typeString);
    } else if (transactions.isClarityAbiOptional(type)) {
      throw new Error("Contract function contains unsupported Clarity ABI type: " + typeString);
    } else if (transactions.isClarityAbiTuple(type)) {
      throw new Error("Contract function contains unsupported Clarity ABI type: " + typeString);
    } else if (transactions.isClarityAbiList(type)) {
      throw new Error("Contract function contains unsupported Clarity ABI type: " + typeString);
    } else {
      throw new Error("Contract function contains unsupported Clarity ABI type: " + typeString);
    }
  }
  function generateExplorerTxPageUrl(txid, network) {
    if (network.version === transactions.TransactionVersion.Testnet) {
      return "https://testnet-explorer.now.sh/txid/0x" + txid;
    } else {
      return "https://explorer.blockstack.org/txid/0x" + txid;
    }
  }

  var c32check = /*#__PURE__*/require('c32check');
  var STX_WALLET_COMPATIBLE_SEED_STRENGTH = 256;

  function walletFromMnemonic(_x) {
    return _walletFromMnemonic.apply(this, arguments);
  }

  function _walletFromMnemonic() {
    _walletFromMnemonic = _asyncToGenerator( /*#__PURE__*/runtime_1.mark(function _callee(mnemonic) {
      var seed;
      return runtime_1.wrap(function _callee$(_context) {
        while (1) {
          switch (_context.prev = _context.next) {
            case 0:
              _context.next = 2;
              return bip39.mnemonicToSeed(mnemonic);

            case 2:
              seed = _context.sent;
              return _context.abrupt("return", new blockstack.BlockstackWallet(bip32.fromSeed(seed)));

            case 4:
            case "end":
              return _context.stop();
          }
        }
      }, _callee);
    }));
    return _walletFromMnemonic.apply(this, arguments);
  }

  function getNodePrivateKey(node) {
    return blockstack.ecPairToHexString(bitcoin.ECPair.fromPrivateKey(node.privateKey));
  }

  function getOwnerKeyInfo(_x2, _x3, _x4, _x5) {
    return _getOwnerKeyInfo.apply(this, arguments);
  }

  function _getOwnerKeyInfo() {
    _getOwnerKeyInfo = _asyncToGenerator( /*#__PURE__*/runtime_1.mark(function _callee2(network, mnemonic, index, version) {
      var wallet, identity, addr, privkey;
      return runtime_1.wrap(function _callee2$(_context2) {
        while (1) {
          switch (_context2.prev = _context2.next) {
            case 0:
              if (version === void 0) {
                version = 'v0.10-current';
              }

              _context2.next = 3;
              return walletFromMnemonic(mnemonic);

            case 3:
              wallet = _context2.sent;
              identity = wallet.getIdentityAddressNode(index);
              addr = network.coerceAddress(blockstack.BlockstackWallet.getAddressFromBIP32Node(identity));
              privkey = getNodePrivateKey(identity);
              return _context2.abrupt("return", {
                privateKey: privkey,
                version: version,
                index: index,
                idAddress: "ID-" + addr
              });

            case 8:
            case "end":
              return _context2.stop();
          }
        }
      }, _callee2);
    }));
    return _getOwnerKeyInfo.apply(this, arguments);
  }

  function getPaymentKeyInfo(_x6, _x7) {
    return _getPaymentKeyInfo.apply(this, arguments);
  }

  function _getPaymentKeyInfo() {
    _getPaymentKeyInfo = _asyncToGenerator( /*#__PURE__*/runtime_1.mark(function _callee3(network, mnemonic) {
      var wallet, privkey, addr, result;
      return runtime_1.wrap(function _callee3$(_context3) {
        while (1) {
          switch (_context3.prev = _context3.next) {
            case 0:
              _context3.next = 2;
              return walletFromMnemonic(mnemonic);

            case 2:
              wallet = _context3.sent;
              privkey = wallet.getBitcoinPrivateKey(0);
              addr = getPrivateKeyAddress(network, privkey);
              result = {
                privateKey: privkey,
                address: {
                  BTC: addr,
                  STACKS: c32check.b58ToC32(addr)
                },
                index: 0
              };
              return _context3.abrupt("return", result);

            case 7:
            case "end":
              return _context3.stop();
          }
        }
      }, _callee3);
    }));
    return _getPaymentKeyInfo.apply(this, arguments);
  }

  function getStacksWalletKeyInfo(_x8, _x9) {
    return _getStacksWalletKeyInfo.apply(this, arguments);
  }

  function _getStacksWalletKeyInfo() {
    _getStacksWalletKeyInfo = _asyncToGenerator( /*#__PURE__*/runtime_1.mark(function _callee4(network, mnemonic) {
      var seed, master, child, ecPair, privkey, addr, btcAddress, _bitcoin$payments$p2p, address, _bitcoin$payments$p2p2, _address, result;

      return runtime_1.wrap(function _callee4$(_context4) {
        while (1) {
          switch (_context4.prev = _context4.next) {
            case 0:
              _context4.next = 2;
              return bip39.mnemonicToSeed(mnemonic);

            case 2:
              seed = _context4.sent;
              master = bip32.fromSeed(seed);
              child = master.derivePath("m/44'/5757'/0'/0/0");
              ecPair = bitcoin.ECPair.fromPrivateKey(child.privateKey);
              privkey = blockstack.ecPairToHexString(ecPair);
              addr = getPrivateKeyAddress(network, privkey);

              if (network.isTestnet()) {
                _bitcoin$payments$p2p = bitcoin.payments.p2pkh({
                  pubkey: ecPair.publicKey,
                  network: bitcoin.networks.regtest
                }), address = _bitcoin$payments$p2p.address;
                btcAddress = address;
              } else {
                _bitcoin$payments$p2p2 = bitcoin.payments.p2pkh({
                  pubkey: ecPair.publicKey,
                  network: bitcoin.networks.bitcoin
                }), _address = _bitcoin$payments$p2p2.address;
                btcAddress = _address;
              }

              result = {
                privateKey: privkey,
                address: c32check.b58ToC32(addr),
                btcAddress: btcAddress,
                index: 0
              };
              return _context4.abrupt("return", result);

            case 11:
            case "end":
              return _context4.stop();
          }
        }
      }, _callee4);
    }));
    return _getStacksWalletKeyInfo.apply(this, arguments);
  }

  function findIdentityIndex(_x10, _x11, _x12, _x13) {
    return _findIdentityIndex.apply(this, arguments);
  }

  function _findIdentityIndex() {
    _findIdentityIndex = _asyncToGenerator( /*#__PURE__*/runtime_1.mark(function _callee5(network, mnemonic, idAddress, maxIndex) {
      var wallet, i, identity, addr;
      return runtime_1.wrap(function _callee5$(_context5) {
        while (1) {
          switch (_context5.prev = _context5.next) {
            case 0:
              if (!maxIndex) {
                maxIndex = getMaxIDSearchIndex();
              }

              if (!(idAddress.substring(0, 3) !== 'ID-')) {
                _context5.next = 3;
                break;
              }

              throw new Error('Not an identity address');

            case 3:
              _context5.next = 5;
              return walletFromMnemonic(mnemonic);

            case 5:
              wallet = _context5.sent;
              i = 0;

            case 7:
              if (!(i < maxIndex)) {
                _context5.next = 15;
                break;
              }

              identity = wallet.getIdentityAddressNode(i);
              addr = blockstack.BlockstackWallet.getAddressFromBIP32Node(identity);

              if (!(network.coerceAddress(addr) === network.coerceAddress(idAddress.slice(3)))) {
                _context5.next = 12;
                break;
              }

              return _context5.abrupt("return", i);

            case 12:
              i++;
              _context5.next = 7;
              break;

            case 15:
              return _context5.abrupt("return", -1);

            case 16:
            case "end":
              return _context5.stop();
          }
        }
      }, _callee5);
    }));
    return _findIdentityIndex.apply(this, arguments);
  }

  function getApplicationKeyInfo(_x14, _x15, _x16, _x17, _x18) {
    return _getApplicationKeyInfo.apply(this, arguments);
  }

  function _getApplicationKeyInfo() {
    _getApplicationKeyInfo = _asyncToGenerator( /*#__PURE__*/runtime_1.mark(function _callee6(network, mnemonic, idAddress, appDomain, idIndex) {
      var wallet, identityOwnerAddressNode, appsNode, legacyAppPrivateKey, res;
      return runtime_1.wrap(function _callee6$(_context6) {
        while (1) {
          switch (_context6.prev = _context6.next) {
            case 0:
              if (!idIndex) {
                idIndex = -1;
              }

              if (!(idIndex < 0)) {
                _context6.next = 7;
                break;
              }

              _context6.next = 4;
              return findIdentityIndex(network, mnemonic, idAddress);

            case 4:
              idIndex = _context6.sent;

              if (!(idIndex < 0)) {
                _context6.next = 7;
                break;
              }

              throw new Error('Identity address does not belong to this keychain');

            case 7:
              _context6.next = 9;
              return walletFromMnemonic(mnemonic);

            case 9:
              wallet = _context6.sent;
              identityOwnerAddressNode = wallet.getIdentityAddressNode(idIndex);
              appsNode = blockstack.BlockstackWallet.getAppsNode(identityOwnerAddressNode);
              legacyAppPrivateKey = blockstack.BlockstackWallet.getLegacyAppPrivateKey(appsNode.toBase58(), wallet.getIdentitySalt(), appDomain);
              res = {
                keyInfo: {
                  privateKey: 'TODO',
                  address: 'TODO'
                },
                legacyKeyInfo: {
                  privateKey: legacyAppPrivateKey,
                  address: getPrivateKeyAddress(network, legacyAppPrivateKey + "01")
                },
                ownerKeyIndex: idIndex
              };
              return _context6.abrupt("return", res);

            case 15:
            case "end":
              return _context6.stop();
          }
        }
      }, _callee6);
    }));
    return _getApplicationKeyInfo.apply(this, arguments);
  }

  function extractAppKey(network, appKeyInfo, appAddress) {
    if (appAddress) {
      if (network.coerceMainnetAddress(appKeyInfo.keyInfo.address) === network.coerceMainnetAddress(appAddress)) {
        return appKeyInfo.keyInfo.privateKey;
      }

      if (network.coerceMainnetAddress(appKeyInfo.legacyKeyInfo.address) === network.coerceMainnetAddress(appAddress)) {
        return appKeyInfo.legacyKeyInfo.privateKey;
      }
    }

    var appPrivateKey = appKeyInfo.keyInfo.privateKey === 'TODO' || !appKeyInfo.keyInfo.privateKey ? appKeyInfo.legacyKeyInfo.privateKey : appKeyInfo.keyInfo.privateKey;
    return appPrivateKey;
  }

  var BN = /*#__PURE__*/require('bn.js');
  var SATOSHIS_PER_BTC = 1e8;
  var CLINetworkAdapter = /*#__PURE__*/function () {
    function CLINetworkAdapter(network$1, opts) {
      var optsDefault = {
        consensusHash: null,
        feeRate: null,
        namespaceBurnAddress: null,
        priceToPay: null,
        priceUnits: null,
        receiveFeesPeriod: null,
        gracePeriod: null,
        altAPIUrl: opts.nodeAPIUrl,
        altTransactionBroadcasterUrl: network$1.broadcastServiceUrl,
        nodeAPIUrl: opts.nodeAPIUrl
      };
      opts = Object.assign({}, optsDefault, opts);
      this.legacyNetwork = new network.BlockstackNetwork(opts.nodeAPIUrl, opts.altTransactionBroadcasterUrl, network$1.btc, network$1.layer1);
      this.consensusHash = opts.consensusHash;
      this.feeRate = opts.feeRate;
      this.namespaceBurnAddress = opts.namespaceBurnAddress;
      this.priceToPay = opts.priceToPay;
      this.priceUnits = opts.priceUnits;
      this.receiveFeesPeriod = opts.receiveFeesPeriod;
      this.gracePeriod = opts.gracePeriod;
      this.nodeAPIUrl = opts.nodeAPIUrl;
      this.optAlwaysCoerceAddress = false;
    }

    var _proto = CLINetworkAdapter.prototype;

    _proto.isMainnet = function isMainnet() {
      return this.legacyNetwork.layer1.pubKeyHash === bitcoin.networks.bitcoin.pubKeyHash;
    };

    _proto.isTestnet = function isTestnet() {
      return this.legacyNetwork.layer1.pubKeyHash === bitcoin.networks.testnet.pubKeyHash;
    };

    _proto.setCoerceMainnetAddress = function setCoerceMainnetAddress(value) {
      this.optAlwaysCoerceAddress = value;
    };

    _proto.coerceMainnetAddress = function coerceMainnetAddress(address) {
      var addressInfo = bitcoin.address.fromBase58Check(address);
      var addressHash = addressInfo.hash;
      var addressVersion = addressInfo.version;
      var newVersion = 0;

      if (addressVersion === this.legacyNetwork.layer1.pubKeyHash) {
        newVersion = 0;
      } else if (addressVersion === this.legacyNetwork.layer1.scriptHash) {
        newVersion = 5;
      }

      return bitcoin.address.toBase58Check(addressHash, newVersion);
    };

    _proto.getFeeRate = function getFeeRate() {
      if (this.feeRate) {
        return Promise.resolve(this.feeRate);
      }

      if (this.isTestnet()) {
        return Promise.resolve(Math.floor(0.00001 * SATOSHIS_PER_BTC));
      }

      return this.legacyNetwork.getFeeRate();
    };

    _proto.getConsensusHash = function getConsensusHash() {
      var _this = this;

      if (this.consensusHash) {
        return new Promise(function (resolve) {
          return resolve(_this.consensusHash);
        });
      }

      return this.legacyNetwork.getConsensusHash().then(function (c) {
        return c;
      });
    };

    _proto.getGracePeriod = function getGracePeriod() {
      var _this2 = this;

      if (this.gracePeriod) {
        return new Promise(function (resolve) {
          return resolve(_this2.gracePeriod);
        });
      }

      return this.legacyNetwork.getGracePeriod().then(function (g) {
        return g;
      });
    };

    _proto.getNamePrice = function getNamePrice(name) {
      var _this3 = this;

      if (this.priceUnits && this.priceToPay) {
        return new Promise(function (resolve) {
          return resolve({
            units: String(_this3.priceUnits),
            amount: new BN(_this3.priceToPay)
          });
        });
      }

      return this.legacyNetwork.getNamePrice(name).then(function (priceInfo) {
        if (!priceInfo.units) {
          priceInfo = {
            units: 'BTC',
            amount: new BN(String(priceInfo))
          };
        }

        return priceInfo;
      });
    };

    _proto.getNamespacePrice = function getNamespacePrice(namespaceID) {
      var _this4 = this;

      if (this.priceUnits && this.priceToPay) {
        return new Promise(function (resolve) {
          return resolve({
            units: String(_this4.priceUnits),
            amount: new BN(String(_this4.priceToPay))
          });
        });
      }

      return Object.prototype.getNamespacePrice.call(this, namespaceID).then(function (priceInfo) {
        if (!priceInfo.units) {
          priceInfo = {
            units: 'BTC',
            amount: new BN(String(priceInfo))
          };
        }

        return priceInfo;
      });
    };

    _proto.getNamespaceBurnAddress = function getNamespaceBurnAddress(namespace, useCLI, receiveFeesPeriod) {
      var _this5 = this;

      if (useCLI === void 0) {
        useCLI = true;
      }

      if (receiveFeesPeriod === void 0) {
        receiveFeesPeriod = -1;
      }

      if (this.namespaceBurnAddress && useCLI) {
        return new Promise(function (resolve) {
          return resolve(_this5.namespaceBurnAddress);
        });
      }

      return Promise.all([fetch__default['default'](this.legacyNetwork.blockstackAPIUrl + "/v1/namespaces/" + namespace), this.legacyNetwork.getBlockHeight()]).then(function (_ref) {
        var resp = _ref[0],
            blockHeight = _ref[1];

        if (resp.status === 404) {
          throw new Error("No such namespace '" + namespace + "'");
        } else if (resp.status !== 200) {
          throw new Error("Bad response status: " + resp.status);
        } else {
          return Promise.all([resp.json(), blockHeight]);
        }
      }).then(function (_ref2) {
        var namespaceInfo = _ref2[0],
            blockHeight = _ref2[1];
        var address = '1111111111111111111114oLvT2';

        if (namespaceInfo.version === 2) {
          if (receiveFeesPeriod < 0) {
            receiveFeesPeriod = _this5.receiveFeesPeriod;
          }

          if (namespaceInfo.reveal_block + receiveFeesPeriod > blockHeight) {
            address = namespaceInfo.address;
          }
        }

        return address;
      }).then(function (address) {
        return _this5.legacyNetwork.coerceAddress(address);
      });
    };

    _proto.getNameInfo = function getNameInfo(name) {
      var _this6 = this;

      return this.legacyNetwork.getNameInfo(name).then(function (ni) {
        var nameInfo = {
          address: _this6.optAlwaysCoerceAddress ? _this6.coerceMainnetAddress(ni.address) : ni.address,
          blockchain: ni.blockchain,
          did: ni.did,
          expire_block: ni.expire_block,
          grace_period: ni.grace_period,
          last_txid: ni.last_txid,
          renewal_deadline: ni.renewal_deadline,
          resolver: ni.resolver,
          status: ni.status,
          zonefile: ni.zonefile,
          zonefile_hash: ni.zonefile_hash
        };
        return nameInfo;
      });
    };

    _proto.getBlockchainNameRecord = function getBlockchainNameRecord(name) {
      var _this7 = this;

      var url = this.legacyNetwork.blockstackAPIUrl + "/v1/blockchains/bitcoin/names/" + name;
      return fetch__default['default'](url).then(function (resp) {
        if (resp.status !== 200) {
          throw new Error("Bad response status: " + resp.status);
        } else {
          return resp.json();
        }
      }).then(function (nameInfo) {
        var fixedAddresses = {};

        for (var _i = 0, _arr = ['address', 'importer_address', 'recipient_address']; _i < _arr.length; _i++) {
          var addrAttr = _arr[_i];

          if (nameInfo.hasOwnProperty(addrAttr) && nameInfo[addrAttr]) {
            fixedAddresses[addrAttr] = _this7.legacyNetwork.coerceAddress(nameInfo[addrAttr]);
          }
        }

        return Object.assign(nameInfo, fixedAddresses);
      });
    };

    _proto.getNameHistory = function getNameHistory(name, page) {
      var _this8 = this;

      var url = this.legacyNetwork.blockstackAPIUrl + "/v1/names/" + name + "/history?page=" + page;
      return fetch__default['default'](url).then(function (resp) {
        if (resp.status !== 200) {
          throw new Error("Bad response status: " + resp.status);
        }

        return resp.json();
      }).then(function (historyInfo) {
        var fixedHistory = {};

        for (var _i2 = 0, _Object$keys = Object.keys(historyInfo); _i2 < _Object$keys.length; _i2++) {
          var historyBlock = _Object$keys[_i2];
          var fixedHistoryList = [];

          for (var _iterator = _createForOfIteratorHelperLoose(historyInfo[historyBlock]), _step; !(_step = _iterator()).done;) {
            var historyEntry = _step.value;
            var fixedAddresses = {};
            var fixedHistoryEntry = {};

            for (var _i3 = 0, _arr2 = ['address', 'importer_address', 'recipient_address']; _i3 < _arr2.length; _i3++) {
              var addrAttr = _arr2[_i3];

              if (historyEntry.hasOwnProperty(addrAttr) && historyEntry[addrAttr]) {
                fixedAddresses[addrAttr] = _this8.legacyNetwork.coerceAddress(historyEntry[addrAttr]);
              }
            }

            fixedHistoryEntry = Object.assign(historyEntry, fixedAddresses);
            fixedHistoryList.push(fixedHistoryEntry);
          }

          fixedHistory[historyBlock] = fixedHistoryList;
        }

        return fixedHistory;
      });
    };

    _proto.coerceAddress = function coerceAddress(address) {
      return this.legacyNetwork.coerceAddress(address);
    };

    _proto.getAccountHistoryPage = function getAccountHistoryPage(address, page) {
      return this.legacyNetwork.getAccountHistoryPage(address, page);
    };

    _proto.broadcastTransaction = function broadcastTransaction(tx) {
      return this.legacyNetwork.broadcastTransaction(tx);
    };

    _proto.broadcastZoneFile = function broadcastZoneFile(zonefile, txid) {
      return this.legacyNetwork.broadcastZoneFile(zonefile, txid);
    };

    _proto.getNamesOwned = function getNamesOwned(address) {
      return this.legacyNetwork.getNamesOwned(address);
    };

    return CLINetworkAdapter;
  }();
  function getNetwork(configData, regTest) {
    if (regTest) {
      var network$1 = new blockstack__default['default'].network.LocalRegtest(configData.blockstackAPIUrl, configData.broadcastServiceUrl, new blockstack__default['default'].network.BitcoindAPI(configData.utxoServiceUrl, {
        username: configData.bitcoindUsername || 'blockstack',
        password: configData.bitcoindPassword || 'blockstacksystem'
      }));
      return network$1;
    } else {
      var _network = new network.BlockstackNetwork(configData.blockstackAPIUrl, configData.broadcastServiceUrl, new blockstack__default['default'].network.BlockchainInfoApi(configData.utxoServiceUrl));

      return _network;
    }
  }

  var ZoneFile$1 = /*#__PURE__*/require('zone-file');

  function makeFakeAuthResponseToken(appPrivateKey, hubURL, associationToken) {
    var ownerPrivateKey = '24004db06ef6d26cdd2b0fa30b332a1b10fa0ba2b07e63505ffc2a9ed7df22b4';
    var transitPrivateKey = 'f33fb466154023aba2003c17158985aa6603db68db0f1afc0fcf1d641ea6c2cb';
    var transitPublicKey = '0496345da77fb5e06757b9c4fd656bf830a3b293f245a6cc2f11f8334ebb690f1' + '9582124f4b07172eb61187afba4514828f866a8a223e0d5c539b2e38a59ab8bb3';
    window.localStorage.setItem('blockstack-transit-private-key', transitPrivateKey);
    var authResponse = blockstack.makeAuthResponse(ownerPrivateKey, {
      type: '@Person',
      accounts: []
    }, null, {}, null, appPrivateKey, undefined, transitPublicKey, hubURL, blockstack.config.network.blockstackAPIUrl, associationToken);
    return authResponse;
  }

  function makeAssociationToken(appPrivateKey, identityKey) {
    var appPublicKey = getPublicKeyFromPrivateKey(canonicalPrivateKey(appPrivateKey) + "01");
    var FOUR_MONTH_SECONDS = 60 * 60 * 24 * 31 * 4;
    var salt = crypto.randomBytes(16).toString('hex');
    var identityPublicKey = getPublicKeyFromPrivateKey(identityKey);
    var associationTokenClaim = {
      childToAssociate: appPublicKey,
      iss: identityPublicKey,
      exp: FOUR_MONTH_SECONDS + new Date().getTime() / 1000,
      salt: salt
    };
    var associationToken = new jsontokens.TokenSigner('ES256K', identityKey).sign(associationTokenClaim);
    return associationToken;
  }
  function gaiaAuth(network, appPrivateKey, hubUrl, ownerPrivateKey) {
    if (!network.isMainnet()) {
      throw new Error('Gaia only works with mainnet networks.');
    }

    var associationToken;

    if (ownerPrivateKey && appPrivateKey) {
      associationToken = makeAssociationToken(appPrivateKey, ownerPrivateKey);
    }

    var authSessionToken = makeFakeAuthResponseToken(appPrivateKey, hubUrl, associationToken);
    var nameLookupUrl = network.legacyNetwork.blockstackAPIUrl + "/v1/names/";
    var transitPrivateKey = 'f33fb466154023aba2003c17158985aa6603db68db0f1afc0fcf1d641ea6c2cb';
    return blockstack.handlePendingSignIn(nameLookupUrl, authSessionToken, transitPrivateKey);
  }
  function gaiaConnect(network, gaiaHubUrl, privateKey, ownerPrivateKey) {
    var addressMainnet = network.coerceMainnetAddress(getPrivateKeyAddress(network, canonicalPrivateKey(privateKey) + "01"));
    var addressMainnetCanonical = network.coerceMainnetAddress(getPrivateKeyAddress(network, canonicalPrivateKey(privateKey)));
    var associationToken;

    if (ownerPrivateKey) {
      associationToken = makeAssociationToken(privateKey, ownerPrivateKey);
    }

    return storage.connectToGaiaHub(gaiaHubUrl, canonicalPrivateKey(privateKey), associationToken).then(function (hubConfig) {
      if (network.coerceMainnetAddress(hubConfig.address) === addressMainnet) {
        hubConfig.address = addressMainnet;
      } else if (network.coerceMainnetAddress(hubConfig.address) === addressMainnetCanonical) {
        hubConfig.address = addressMainnetCanonical;
      } else {
        throw new Error('Invalid private key: ' + (network.coerceMainnetAddress(hubConfig.address) + " is neither ") + (addressMainnet + " or " + addressMainnetCanonical));
      }

      return hubConfig;
    });
  }

  function gaiaFindProfileName(network, hubConfig, blockstackID) {
    if (!blockstackID || blockstackID === null || blockstackID === undefined) {
      return Promise.resolve().then(function () {
        return 'profile.json';
      });
    } else {
      return network.getNameInfo(blockstackID).then(function (nameInfo) {
        var profileUrl;

        try {
          var zonefileJSON = ZoneFile$1.parseZoneFile(nameInfo.zonefile);

          if (zonefileJSON.uri && zonefileJSON.hasOwnProperty('$origin')) {
            profileUrl = blockstack.getTokenFileUrl(zonefileJSON);
          }
        } catch (e) {
          throw new Error("Could not determine profile URL for " + String(blockstackID) + ": could not parse zone file");
        }

        if (profileUrl === null || profileUrl === undefined) {
          throw new Error("Could not determine profile URL for " + String(blockstackID) + ": no URL in zone file");
        }

        var gaiaReadPrefix = "" + hubConfig.url_prefix + hubConfig.address;
        var gaiaReadUrlPath = String(URL.parse(gaiaReadPrefix).path);
        var profileUrlPath = String(URL.parse(profileUrl).path);

        if (!profileUrlPath.startsWith(gaiaReadUrlPath)) {
          throw new Error("Could not determine profile URL for " + String(blockstackID) + ": wrong Gaia hub" + (" (" + gaiaReadPrefix + " does not correspond to " + profileUrl + ")"));
        }

        var profilePath = profileUrlPath.substring(gaiaReadUrlPath.length + 1);
        return profilePath;
      });
    }
  }

  function gaiaUploadProfile(network, gaiaHubURL, gaiaData, privateKey, blockstackID) {
    var hubConfig;
    return gaiaConnect(network, gaiaHubURL, privateKey).then(function (hubconf) {
      hubConfig = hubconf;
      return gaiaFindProfileName(network, hubConfig, blockstackID);
    }).then(function (profilePath) {
      return blockstack.uploadToGaiaHub(profilePath, gaiaData, hubConfig);
    });
  }
  function gaiaUploadProfileAll(network, gaiaUrls, gaiaData, privateKey, blockstackID) {
    var sanitizedGaiaUrls = gaiaUrls.map(function (gaiaUrl) {
      var urlInfo = URL.parse(gaiaUrl);

      if (!urlInfo.protocol) {
        return '';
      }

      if (!urlInfo.host) {
        return '';
      }

      return String(urlInfo.protocol) + "//" + String(urlInfo.host);
    }).filter(function (gaiaUrl) {
      return gaiaUrl.length > 0;
    });
    var uploadPromises = sanitizedGaiaUrls.map(function (gaiaUrl) {
      return gaiaUploadProfile(network, gaiaUrl, gaiaData, privateKey, blockstackID);
    });
    return Promise.all(uploadPromises).then(function (publicUrls) {
      return {
        error: null,
        dataUrls: publicUrls
      };
    })["catch"](function (e) {
      return {
        error: "Failed to upload: " + e.message,
        dataUrls: null
      };
    });
  }
  function getGaiaAddressFromURL(appUrl) {
    var matches = appUrl.match(/([13][a-km-zA-HJ-NP-Z0-9]{26,35})/);

    if (!matches) {
      throw new Error('Failed to parse gaia address');
    }

    return matches[matches.length - 1];
  }
  function getGaiaAddressFromProfile(network, profile, appOrigin) {
    if (!profile) {
      throw new Error('No profile');
    }

    if (!profile.apps) {
      throw new Error('No profile apps');
    }

    if (!profile.apps[appOrigin]) {
      throw new Error("No app entry for " + appOrigin);
    }

    var appUrl = profile.apps[appOrigin];
    var existingAppAddress;

    try {
      existingAppAddress = network.coerceMainnetAddress(getGaiaAddressFromURL(appUrl));
    } catch (e) {
      throw new Error("Failed to parse app URL " + appUrl);
    }

    return existingAppAddress;
  }

  var SIGNIN_CSS = "\nh1 { \n  font-family: monospace; \n  font-size: 24px; \n  font-style: normal; \n  font-variant: normal; \n  font-weight: 700; \n  line-height: 26.4px; \n} \nh3 { \n  font-family: monospace; \n  font-size: 14px; \n  font-style: normal; \n  font-variant: normal; \n  font-weight: 700; \n  line-height: 15.4px; \n}\np { \n  font-family: monospace; \n  font-size: 14px; \n  font-style: normal; \n  font-variant: normal; \n  font-weight: 400; \n  line-height: 20px; \n}\nb {\n  background-color: #e8e8e8;\n}\npre { \n  font-family: monospace; \n  font-size: 13px; \n  font-style: normal; \n  font-variant: normal; \n  font-weight: 400; \n  line-height: 18.5714px;\n}";
  var SIGNIN_HEADER = "<html><head><style>" + SIGNIN_CSS + "</style></head></body><h3>Blockstack CLI Sign-in</h3><br>";
  var SIGNIN_DESC = '<p>Sign-in request for <b>"{appName}"</b></p>';
  var SIGNIN_SCOPES = '<p>Requested scopes: <b>"{appScopes}"</b></p>';
  var SIGNIN_FMT_NAME = '<p><a href="{authRedirect}">{blockstackID}</a> ({idAddress})</p>';
  var SIGNIN_FMT_ID = '<p><a href="{authRedirect}">{idAddress}</a> (anonymous)</p>';
  var SIGNIN_FOOTER = '</body></html>';
  var authTransitNonce = /*#__PURE__*/crypto.randomBytes(32).toString('hex');

  function getAppPrivateKey(_x, _x2, _x3, _x4) {
    return _getAppPrivateKey.apply(this, arguments);
  }

  function _getAppPrivateKey() {
    _getAppPrivateKey = _asyncToGenerator( /*#__PURE__*/runtime_1.mark(function _callee(network, mnemonic, id, appOrigin) {
      var appKeyInfo, appPrivateKey, existingAppAddress;
      return runtime_1.wrap(function _callee$(_context) {
        while (1) {
          switch (_context.prev = _context.next) {
            case 0:
              _context.next = 2;
              return getApplicationKeyInfo(network, mnemonic, id.idAddress, appOrigin, id.index);

            case 2:
              appKeyInfo = _context.sent;

              try {
                existingAppAddress = getGaiaAddressFromProfile(network, id.profile, appOrigin);
                appPrivateKey = extractAppKey(network, appKeyInfo, existingAppAddress);
              } catch (e) {
                appPrivateKey = extractAppKey(network, appKeyInfo);
              }

              return _context.abrupt("return", appPrivateKey);

            case 5:
            case "end":
              return _context.stop();
          }
        }
      }, _callee);
    }));
    return _getAppPrivateKey.apply(this, arguments);
  }

  function makeSignInLink(_x5, _x6, _x7, _x8, _x9, _x10) {
    return _makeSignInLink.apply(this, arguments);
  }

  function _makeSignInLink() {
    _makeSignInLink = _asyncToGenerator( /*#__PURE__*/runtime_1.mark(function _callee2(network, authPort, mnemonic, authRequest, hubUrl, id) {
      var appOrigin, appPrivateKey, associationToken, authResponseTmp, authResponsePayload, id_public, tokenSigner, authResponse;
      return runtime_1.wrap(function _callee2$(_context2) {
        while (1) {
          switch (_context2.prev = _context2.next) {
            case 0:
              appOrigin = authRequest.domain_name;
              _context2.next = 3;
              return getAppPrivateKey(network, mnemonic, id, appOrigin);

            case 3:
              appPrivateKey = _context2.sent;
              associationToken = makeAssociationToken(appPrivateKey, id.privateKey);
              authResponseTmp = blockstack.makeAuthResponse(id.privateKey, {}, id.name, {
                email: undefined,
                profileUrl: id.profileUrl
              }, undefined, appPrivateKey, undefined, authRequest.public_keys[0], hubUrl, blockstack.config.network.blockstackAPIUrl, associationToken);
              authResponsePayload = jsontokens.decodeToken(authResponseTmp).payload;
              id_public = Object.assign({}, id);
              id_public.profile = {};
              id_public.privateKey = undefined;
              authResponsePayload.metadata = {
                id: id_public,
                profileUrl: id.profileUrl,
                appOrigin: appOrigin,
                redirect_uri: authRequest.redirect_uri,
                scopes: authRequest.scopes,
                salt: crypto.randomBytes(16).toString('hex'),
                nonce: authTransitNonce
              };
              tokenSigner = new jsontokens.TokenSigner('ES256k', id.privateKey);
              authResponse = tokenSigner.sign(authResponsePayload);
              return _context2.abrupt("return", blockstack.updateQueryStringParameter("http://localhost:" + authPort + "/signin", 'authResponse', authResponse));

            case 14:
            case "end":
              return _context2.stop();
          }
        }
      }, _callee2);
    }));
    return _makeSignInLink.apply(this, arguments);
  }

  function makeAuthPage(_x11, _x12, _x13, _x14, _x15, _x16, _x17) {
    return _makeAuthPage.apply(this, arguments);
  }

  function _makeAuthPage() {
    _makeAuthPage = _asyncToGenerator( /*#__PURE__*/runtime_1.mark(function _callee3(network, authPort, mnemonic, hubUrl, manifest, authRequest, ids) {
      var signinBody, signinDescription, signinScopes, i, signinEntry;
      return runtime_1.wrap(function _callee3$(_context3) {
        while (1) {
          switch (_context3.prev = _context3.next) {
            case 0:
              signinBody = SIGNIN_HEADER;
              signinDescription = SIGNIN_DESC.replace(/{appName}/, manifest.name || '(Unknown app)');
              signinScopes = SIGNIN_SCOPES.replace(/{appScopes}/, authRequest.scopes.length > 0 ? authRequest.scopes.join(', ') : '(none)');
              signinBody = "" + signinBody + signinDescription + signinScopes;
              i = 0;

            case 5:
              if (!(i < ids.length)) {
                _context3.next = 24;
                break;
              }

              signinEntry = void 0;

              if (!ids[i].name) {
                _context3.next = 15;
                break;
              }

              _context3.t0 = SIGNIN_FMT_NAME;
              _context3.next = 11;
              return makeSignInLink(network, authPort, mnemonic, authRequest, hubUrl, ids[i]);

            case 11:
              _context3.t1 = _context3.sent;
              signinEntry = _context3.t0.replace.call(_context3.t0, /{authRedirect}/, _context3.t1).replace(/{blockstackID}/, ids[i].name).replace(/{idAddress}/, ids[i].idAddress);
              _context3.next = 20;
              break;

            case 15:
              _context3.t2 = SIGNIN_FMT_ID;
              _context3.next = 18;
              return makeSignInLink(network, authPort, mnemonic, authRequest, hubUrl, ids[i]);

            case 18:
              _context3.t3 = _context3.sent;
              signinEntry = _context3.t2.replace.call(_context3.t2, /{authRedirect}/, _context3.t3).replace(/{idAddress}/, ids[i].idAddress);

            case 20:
              signinBody = "" + signinBody + signinEntry;

            case 21:
              i++;
              _context3.next = 5;
              break;

            case 24:
              signinBody = "" + signinBody + SIGNIN_FOOTER;
              return _context3.abrupt("return", signinBody);

            case 26:
            case "end":
              return _context3.stop();
          }
        }
      }, _callee3);
    }));
    return _makeAuthPage.apply(this, arguments);
  }

  function loadNamedIdentitiesLoop(_x18, _x19, _x20, _x21) {
    return _loadNamedIdentitiesLoop.apply(this, arguments);
  }

  function _loadNamedIdentitiesLoop() {
    _loadNamedIdentitiesLoop = _asyncToGenerator( /*#__PURE__*/runtime_1.mark(function _callee4(network, mnemonic, index, identities) {
      var keyInfo, nameList, i, identity;
      return runtime_1.wrap(function _callee4$(_context4) {
        while (1) {
          switch (_context4.prev = _context4.next) {
            case 0:
              if (!(index > 65536)) {
                _context4.next = 2;
                break;
              }

              throw new Error('Too many names');

            case 2:
              _context4.next = 4;
              return getOwnerKeyInfo(network, mnemonic, index);

            case 4:
              keyInfo = _context4.sent;
              _context4.next = 7;
              return network.getNamesOwned(keyInfo.idAddress.slice(3));

            case 7:
              nameList = _context4.sent;

              if (!(nameList.length === 0)) {
                _context4.next = 10;
                break;
              }

              return _context4.abrupt("return", identities);

            case 10:
              for (i = 0; i < nameList.length; i++) {
                identity = {
                  name: nameList[i],
                  idAddress: keyInfo.idAddress,
                  privateKey: keyInfo.privateKey,
                  index: index,
                  profile: {},
                  profileUrl: ''
                };
                identities.push(identity);
              }

              _context4.next = 13;
              return loadNamedIdentitiesLoop(network, mnemonic, index + 1, identities);

            case 13:
              return _context4.abrupt("return", _context4.sent);

            case 14:
            case "end":
              return _context4.stop();
          }
        }
      }, _callee4);
    }));
    return _loadNamedIdentitiesLoop.apply(this, arguments);
  }

  function loadNamedIdentities(network, mnemonic) {
    return loadNamedIdentitiesLoop(network, mnemonic, 0, []);
  }

  function loadUnnamedIdentity(_x22, _x23, _x24) {
    return _loadUnnamedIdentity.apply(this, arguments);
  }

  function _loadUnnamedIdentity() {
    _loadUnnamedIdentity = _asyncToGenerator( /*#__PURE__*/runtime_1.mark(function _callee5(network, mnemonic, index) {
      var keyInfo, idInfo;
      return runtime_1.wrap(function _callee5$(_context5) {
        while (1) {
          switch (_context5.prev = _context5.next) {
            case 0:
              _context5.next = 2;
              return getOwnerKeyInfo(network, mnemonic, index);

            case 2:
              keyInfo = _context5.sent;
              idInfo = {
                name: '',
                idAddress: keyInfo.idAddress,
                privateKey: keyInfo.privateKey,
                index: index,
                profile: {},
                profileUrl: ''
              };
              return _context5.abrupt("return", idInfo);

            case 5:
            case "end":
              return _context5.stop();
          }
        }
      }, _callee5);
    }));
    return _loadUnnamedIdentity.apply(this, arguments);
  }

  function sendJSON(res, data, statusCode) {
    logger.info("Respond " + statusCode + ": " + JSON.stringify(data));
    res.writeHead(statusCode, {
      'Content-Type': 'application/json'
    });
    res.write(JSON.stringify(data));
    res.end();
  }

  function getIdentityInfo(_x25, _x26, _x27, _x28) {
    return _getIdentityInfo.apply(this, arguments);
  }

  function _getIdentityInfo() {
    _getIdentityInfo = _asyncToGenerator( /*#__PURE__*/runtime_1.mark(function _callee6(network, mnemonic, _appGaiaHub, _profileGaiaHub) {
      var identities, nameInfoPromises, nameDatas, i, nextIndex;
      return runtime_1.wrap(function _callee6$(_context6) {
        while (1) {
          switch (_context6.prev = _context6.next) {
            case 0:
              network.setCoerceMainnetAddress(true);
              _context6.prev = 1;
              _context6.next = 4;
              return loadNamedIdentities(network, mnemonic);

            case 4:
              identities = _context6.sent;
              nameInfoPromises = identities.map(function (id) {
                var lookup = nameLookup(network, id.name, true)["catch"](function () {
                  return null;
                });
                return lookup;
              });
              _context6.next = 8;
              return Promise.all(nameInfoPromises);

            case 8:
              nameDatas = _context6.sent;
              network.setCoerceMainnetAddress(false);
              nameDatas = nameDatas.filter(function (p) {
                return p !== null && p !== undefined;
              });

              for (i = 0; i < nameDatas.length; i++) {
                if (nameDatas[i].hasOwnProperty('error') && nameDatas[i].error) {
                  identities[i].profileUrl = '';
                } else {
                  identities[i].profileUrl = nameDatas[i].profileUrl;
                  identities[i].profile = nameDatas[i].profile;
                }
              }

              nextIndex = identities.length + 1;
              identities = identities.filter(function (id) {
                return !!id.profileUrl;
              });
              _context6.t0 = identities;
              _context6.next = 17;
              return loadUnnamedIdentity(network, mnemonic, nextIndex);

            case 17:
              _context6.t1 = _context6.sent;

              _context6.t0.push.call(_context6.t0, _context6.t1);

              _context6.next = 25;
              break;

            case 21:
              _context6.prev = 21;
              _context6.t2 = _context6["catch"](1);
              network.setCoerceMainnetAddress(false);
              throw _context6.t2;

            case 25:
              return _context6.abrupt("return", identities);

            case 26:
            case "end":
              return _context6.stop();
          }
        }
      }, _callee6, null, [[1, 21]]);
    }));
    return _getIdentityInfo.apply(this, arguments);
  }

  function handleAuth(_x29, _x30, _x31, _x32, _x33, _x34, _x35) {
    return _handleAuth.apply(this, arguments);
  }

  function _handleAuth() {
    _handleAuth = _asyncToGenerator( /*#__PURE__*/runtime_1.mark(function _callee7(network, mnemonic, gaiaHubUrl, profileGaiaHub, port, req, res) {
      var authToken, errorMsg, identities, valid, appManifest, decodedAuthToken, decodedAuthPayload, authPage;
      return runtime_1.wrap(function _callee7$(_context7) {
        while (1) {
          switch (_context7.prev = _context7.next) {
            case 0:
              authToken = req.query.authRequest;

              if (authToken) {
                _context7.next = 3;
                break;
              }

              return _context7.abrupt("return", Promise.resolve().then(function () {
                sendJSON(res, {
                  error: 'No authRequest given'
                }, 400);
              }));

            case 3:
              errorMsg = '';
              identities = [];
              _context7.prev = 5;
              _context7.next = 8;
              return getIdentityInfo(network, mnemonic, gaiaHubUrl, profileGaiaHub);

            case 8:
              identities = _context7.sent;
              errorMsg = 'Unable to verify authentication token';
              _context7.next = 12;
              return blockstack.verifyAuthRequest(authToken);

            case 12:
              valid = _context7.sent;

              if (valid) {
                _context7.next = 16;
                break;
              }

              errorMsg = 'Invalid authentication token: could not verify';
              throw new Error(errorMsg);

            case 16:
              errorMsg = 'Unable to fetch app manifest';
              _context7.next = 19;
              return blockstack.fetchAppManifest(authToken);

            case 19:
              appManifest = _context7.sent;
              errorMsg = 'Unable to decode token';
              decodedAuthToken = jsontokens.decodeToken(authToken);
              decodedAuthPayload = decodedAuthToken.payload;

              if (decodedAuthPayload) {
                _context7.next = 26;
                break;
              }

              errorMsg = 'Invalid authentication token: no payload';
              throw new Error(errorMsg);

            case 26:
              errorMsg = 'Unable to make auth page';
              _context7.next = 29;
              return makeAuthPage(network, port, mnemonic, gaiaHubUrl, appManifest, decodedAuthPayload, identities);

            case 29:
              authPage = _context7.sent;
              res.writeHead(200, {
                'Content-Type': 'text/html',
                'Content-Length': authPage.length
              });
              res.write(authPage);
              res.end();
              _context7.next = 41;
              break;

            case 35:
              _context7.prev = 35;
              _context7.t0 = _context7["catch"](5);

              if (!errorMsg) {
                errorMsg = _context7.t0.message;
              }

              console.log(_context7.t0.stack);
              logger.error(errorMsg);
              sendJSON(res, {
                error: "Unable to authenticate app request: " + errorMsg
              }, 400);

            case 41:
            case "end":
              return _context7.stop();
          }
        }
      }, _callee7, null, [[5, 35]]);
    }));
    return _handleAuth.apply(this, arguments);
  }

  function updateProfileApps(network, id, appOrigin, appGaiaConfig, profile) {
    var needProfileUpdate = false;
    var profilePromise = Promise.resolve().then(function () {
      if (profile === null || profile === undefined) {
        return nameLookup(network, id.name)["catch"](function (_e) {
          return null;
        });
      } else {
        return {
          profile: profile
        };
      }
    });
    return profilePromise.then(function (profileData) {
      if (profileData) {
        profile = profileData.profile;
      }

      if (!profile) {
        logger.debug("Profile for " + id.name + " is " + JSON.stringify(profile));
        logger.debug("Instantiating profile for " + id.name);
        needProfileUpdate = true;
        profile = {
          type: '@Person',
          account: [],
          apps: {}
        };
      }

      if (profile.apps === null || profile.apps === undefined) {
        needProfileUpdate = true;
        logger.debug("Adding multi-reader Gaia links to profile for " + id.name);
        profile.apps = {};
      }

      var gaiaPrefix = "" + appGaiaConfig.url_prefix + appGaiaConfig.address + "/";

      if (!profile.apps.hasOwnProperty(appOrigin) || !profile.apps[appOrigin]) {
        needProfileUpdate = true;
        logger.debug("Setting Gaia read URL " + gaiaPrefix + " for " + appOrigin + " " + ("in profile for " + id.name));
        profile.apps[appOrigin] = gaiaPrefix;
      } else if (!profile.apps[appOrigin].startsWith(gaiaPrefix)) {
        needProfileUpdate = true;
        logger.debug("Overriding Gaia read URL for " + appOrigin + " from " + profile.apps[appOrigin] + " " + ("to " + gaiaPrefix + " in profile for " + id.name));
        profile.apps[appOrigin] = gaiaPrefix;
      }

      return {
        profile: profile,
        changed: needProfileUpdate
      };
    });
  }

  function updateProfileAPISettings(network, id, appGaiaConfig, profile) {
    var needProfileUpdate = false;
    var profilePromise = Promise.resolve().then(function () {
      if (profile === null || profile === undefined) {
        return nameLookup(network, id.name)["catch"](function (_e) {
          return null;
        });
      } else {
        return {
          profile: profile
        };
      }
    });
    return profilePromise.then(function (profileData) {
      if (profileData) {
        profile = profileData.profile;
      }

      if (!profile) {
        logger.debug("Profile for " + id.name + " is " + JSON.stringify(profile));
        logger.debug("Instantiating profile for " + id.name);
        needProfileUpdate = true;
        profile = {
          type: '@Person',
          account: [],
          api: {}
        };
      }

      if (profile.api === null || profile.api === undefined) {
        needProfileUpdate = true;
        logger.debug("Adding API settings to profile for " + id.name);
        profile.api = {
          gaiaHubConfig: {
            url_prefix: appGaiaConfig.url_prefix
          },
          gaiaHubUrl: appGaiaConfig.server
        };
      }

      if (!profile.hasOwnProperty('api') || !profile.api.hasOwnProperty('gaiaHubConfig') || !profile.api.gaiaHubConfig.hasOwnProperty('url_prefix') || !profile.api.gaiaHubConfig.url_prefix || !profile.api.hasOwnProperty('gaiaHubUrl') || !profile.api.gaiaHubUrl) {
        logger.debug("Existing profile for " + id.name + " is " + JSON.stringify(profile));
        logger.debug("Updating API settings to profile for " + id.name);
        profile.api = {
          gaiaHubConfig: {
            url_prefix: appGaiaConfig.url_prefix
          },
          gaiaHubUrl: appGaiaConfig.server
        };
      }

      return {
        profile: profile,
        changed: needProfileUpdate
      };
    });
  }

  function handleSignIn(_x36, _x37, _x38, _x39, _x40, _x41) {
    return _handleSignIn.apply(this, arguments);
  }

  function _handleSignIn() {
    _handleSignIn = _asyncToGenerator( /*#__PURE__*/runtime_1.mark(function _callee8(network, mnemonic, appGaiaHub, profileGaiaHub, req, res) {
      var authResponseQP, nameLookupUrl, errorMsg, errorStatusCode, authResponsePayload, id, profileUrl, appOrigin, redirectUri, scopes, authResponse, hubConfig, needProfileAPIUpdate, profileAPIUpdate, valid, authResponseToken, nonce, appPrivateKey, appHubConfig, newProfileData, profile, needProfileSigninUpdate, gaiaUrls, profileJWT, _profileJWT, appUri;

      return runtime_1.wrap(function _callee8$(_context8) {
        while (1) {
          switch (_context8.prev = _context8.next) {
            case 0:
              authResponseQP = req.query.authResponse;

              if (authResponseQP) {
                _context8.next = 3;
                break;
              }

              return _context8.abrupt("return", Promise.resolve().then(function () {
                sendJSON(res, {
                  error: 'No authResponse given'
                }, 400);
              }));

            case 3:
              nameLookupUrl = network.legacyNetwork.blockstackAPIUrl + "/v1/names/";
              errorMsg = '';
              errorStatusCode = 400;
              needProfileAPIUpdate = false;
              _context8.prev = 7;
              _context8.next = 10;
              return blockstack.verifyAuthResponse(authResponseQP, nameLookupUrl);

            case 10:
              valid = _context8.sent;

              if (valid) {
                _context8.next = 14;
                break;
              }

              errorMsg = "Unable to verify authResponse token " + authResponseQP;
              throw new Error(errorMsg);

            case 14:
              authResponseToken = jsontokens.decodeToken(authResponseQP);
              authResponsePayload = authResponseToken.payload;
              id = authResponsePayload.metadata.id;
              profileUrl = authResponsePayload.metadata.profileUrl;
              appOrigin = authResponsePayload.metadata.appOrigin;
              redirectUri = authResponsePayload.metadata.redirect_uri;
              scopes = authResponsePayload.metadata.scopes;
              nonce = authResponsePayload.metadata.nonce;

              if (!(nonce != authTransitNonce)) {
                _context8.next = 24;
                break;
              }

              throw new Error('Invalid auth response: not generated by this authenticator');

            case 24:
              _context8.next = 26;
              return getOwnerKeyInfo(network, mnemonic, id.index);

            case 26:
              id.privateKey = _context8.sent.privateKey;
              _context8.next = 29;
              return getAppPrivateKey(network, mnemonic, id, appOrigin);

            case 29:
              appPrivateKey = _context8.sent;
              authResponsePayload.metadata = {
                profileUrl: profileUrl
              };
              authResponse = new jsontokens.TokenSigner('ES256K', id.privateKey).sign(authResponsePayload);
              logger.debug("App " + appOrigin + " requests scopes " + JSON.stringify(scopes));
              _context8.next = 35;
              return gaiaConnect(network, appGaiaHub, appPrivateKey);

            case 35:
              appHubConfig = _context8.sent;
              hubConfig = appHubConfig;
              _context8.next = 39;
              return updateProfileAPISettings(network, id, hubConfig);

            case 39:
              newProfileData = _context8.sent;
              needProfileAPIUpdate = newProfileData.changed;
              profileAPIUpdate = newProfileData.profile;
              _context8.next = 44;
              return updateProfileApps(network, id, appOrigin, hubConfig, profileAPIUpdate);

            case 44:
              newProfileData = _context8.sent;
              profile = newProfileData.profile;
              needProfileSigninUpdate = newProfileData.changed && scopes.includes('store_write');
              logger.debug("Resulting profile for " + id.name + " is " + JSON.stringify(profile));

              if (!needProfileSigninUpdate) {
                _context8.next = 56;
                break;
              }

              logger.debug("Upload new profile with new sign-in data to " + profileGaiaHub);
              profileJWT = makeProfileJWT(profile, id.privateKey);
              _context8.next = 53;
              return gaiaUploadProfileAll(network, [profileGaiaHub], profileJWT, id.privateKey, id.name);

            case 53:
              gaiaUrls = _context8.sent;
              _context8.next = 66;
              break;

            case 56:
              if (!needProfileAPIUpdate) {
                _context8.next = 64;
                break;
              }

              logger.debug("Upload new profile with new API settings to " + profileGaiaHub);
              _profileJWT = makeProfileJWT(profileAPIUpdate, id.privateKey);
              _context8.next = 61;
              return gaiaUploadProfileAll(network, [profileGaiaHub], _profileJWT, id.privateKey, id.name);

            case 61:
              gaiaUrls = _context8.sent;
              _context8.next = 66;
              break;

            case 64:
              logger.debug("Gaia read URL for " + appOrigin + " is " + profile.apps[appOrigin]);
              gaiaUrls = {
                dataUrls: [],
                error: null
              };

            case 66:
              if (!(gaiaUrls.hasOwnProperty('error') && gaiaUrls.error)) {
                _context8.next = 70;
                break;
              }

              errorMsg = "Failed to upload new profile: " + gaiaUrls.error;
              errorStatusCode = 502;
              throw new Error(errorMsg);

            case 70:
              logger.debug("Handled sign-in to " + appOrigin + " using " + id.name);
              appUri = blockstack.updateQueryStringParameter(redirectUri, 'authResponse', authResponse);
              logger.info("Redirect to " + appUri);
              res.writeHead(302, {
                Location: appUri
              });
              res.end();
              _context8.next = 82;
              break;

            case 77:
              _context8.prev = 77;
              _context8.t0 = _context8["catch"](7);
              logger.error(_context8.t0);
              logger.error(errorMsg);
              sendJSON(res, {
                error: "Unable to process signin request: " + errorMsg
              }, errorStatusCode);

            case 82:
            case "end":
              return _context8.stop();
          }
        }
      }, _callee8, null, [[7, 77]]);
    }));
    return _handleSignIn.apply(this, arguments);
  }

  var c32check$1 = /*#__PURE__*/require('c32check');
  var txOnly = false;
  var estimateOnly = false;
  var safetyChecks = true;
  var receiveFeesPeriod = 52595;
  var gracePeriod = 5000;
  var noExit = false;
  var maxIDSearchIndex = DEFAULT_MAX_ID_SEARCH_INDEX;
  var BLOCKSTACK_TEST = !!process$1.env.BLOCKSTACK_TEST;
  function getMaxIDSearchIndex() {
    return maxIDSearchIndex;
  }

  function profileSign(network, args) {
    var profilePath = args[0];
    var profileData = JSON.parse(fs.readFileSync(profilePath).toString());
    return Promise.resolve().then(function () {
      return makeProfileJWT(profileData, args[1]);
    });
  }

  function profileVerify(network, args) {
    var profilePath = args[0];
    var publicKeyOrAddress = args[1];

    if (publicKeyOrAddress.match(ID_ADDRESS_PATTERN)) {
      publicKeyOrAddress = network.coerceMainnetAddress(publicKeyOrAddress.slice(3));
    }

    var profileString = fs.readFileSync(profilePath).toString();
    return Promise.resolve().then(function () {
      var profileToken = null;

      try {
        var profileTokens = JSON.parse(profileString);
        profileToken = profileTokens[0].token;
      } catch (e) {
        profileToken = profileString;
      }

      if (!profileToken) {
        throw new Error("Data at " + profilePath + " does not appear to be a signed profile");
      }

      var profile = blockstack.extractProfile(profileToken, publicKeyOrAddress);
      return JSONStringify(profile);
    });
  }

  function profileStore(network, args) {
    var nameOrAddress = args[0];
    var signedProfilePath = args[1];
    var privateKey = decodePrivateKey(args[2]);
    var gaiaHubUrl = args[3];
    var signedProfileData = fs.readFileSync(signedProfilePath).toString();
    var ownerAddress = getPrivateKeyAddress(network, privateKey);
    var ownerAddressMainnet = network.coerceMainnetAddress(ownerAddress);
    var nameInfoPromise;
    var name = '';

    if (nameOrAddress.startsWith('ID-')) {
      nameInfoPromise = Promise.resolve().then(function () {
        return {
          address: nameOrAddress.slice(3)
        };
      });
    } else {
      nameInfoPromise = getNameInfoEasy(network, nameOrAddress);
      name = nameOrAddress;
    }

    var verifyProfilePromise = profileVerify(network, [signedProfilePath, "ID-" + ownerAddressMainnet]);
    return Promise.all([nameInfoPromise, verifyProfilePromise]).then(function (_ref) {
      var nameInfo = _ref[0];

      if (safetyChecks && (!nameInfo || network.coerceAddress(nameInfo.address) !== network.coerceAddress(ownerAddress))) {
        throw new Error('Name owner address either could not be found, or does not match ' + ("private key address " + ownerAddress));
      }

      return gaiaUploadProfileAll(network, [gaiaHubUrl], signedProfileData, args[2], name);
    }).then(function (gaiaUrls) {
      if (gaiaUrls.hasOwnProperty('error')) {
        return JSONStringify({
          dataUrls: gaiaUrls.dataUrls,
          error: gaiaUrls.error
        }, true);
      } else {
        return JSONStringify({
          profileUrls: gaiaUrls.dataUrls
        });
      }
    });
  }

  function getAppKeys(_x, _x2) {
    return _getAppKeys.apply(this, arguments);
  }

  function _getAppKeys() {
    _getAppKeys = _asyncToGenerator( /*#__PURE__*/runtime_1.mark(function _callee(network, args) {
      var mnemonic, nameOrIDAddress, origin, idAddress, networkInfo;
      return runtime_1.wrap(function _callee$(_context) {
        while (1) {
          switch (_context.prev = _context.next) {
            case 0:
              _context.next = 2;
              return getBackupPhrase(args[0]);

            case 2:
              mnemonic = _context.sent;
              nameOrIDAddress = args[1];
              origin = args[2];
              _context.next = 7;
              return getIDAddress(network, nameOrIDAddress);

            case 7:
              idAddress = _context.sent;
              _context.next = 10;
              return getApplicationKeyInfo(network, mnemonic, idAddress, origin);

            case 10:
              networkInfo = _context.sent;
              return _context.abrupt("return", JSONStringify(networkInfo));

            case 12:
            case "end":
              return _context.stop();
          }
        }
      }, _callee);
    }));
    return _getAppKeys.apply(this, arguments);
  }

  function getOwnerKeys(_x3, _x4) {
    return _getOwnerKeys.apply(this, arguments);
  }

  function _getOwnerKeys() {
    _getOwnerKeys = _asyncToGenerator( /*#__PURE__*/runtime_1.mark(function _callee2(network, args) {
      var mnemonic, maxIndex, keyInfo, i;
      return runtime_1.wrap(function _callee2$(_context2) {
        while (1) {
          switch (_context2.prev = _context2.next) {
            case 0:
              _context2.next = 2;
              return getBackupPhrase(args[0]);

            case 2:
              mnemonic = _context2.sent;
              maxIndex = 1;

              if (args.length > 1 && !!args[1]) {
                maxIndex = parseInt(args[1]);
              }

              keyInfo = [];
              i = 0;

            case 7:
              if (!(i < maxIndex)) {
                _context2.next = 16;
                break;
              }

              _context2.t0 = keyInfo;
              _context2.next = 11;
              return getOwnerKeyInfo(network, mnemonic, i);

            case 11:
              _context2.t1 = _context2.sent;

              _context2.t0.push.call(_context2.t0, _context2.t1);

            case 13:
              i++;
              _context2.next = 7;
              break;

            case 16:
              return _context2.abrupt("return", JSONStringify(keyInfo));

            case 17:
            case "end":
              return _context2.stop();
          }
        }
      }, _callee2);
    }));
    return _getOwnerKeys.apply(this, arguments);
  }

  function getPaymentKey(_x5, _x6) {
    return _getPaymentKey.apply(this, arguments);
  }

  function _getPaymentKey() {
    _getPaymentKey = _asyncToGenerator( /*#__PURE__*/runtime_1.mark(function _callee3(network, args) {
      var mnemonic, keyObj, keyInfo;
      return runtime_1.wrap(function _callee3$(_context3) {
        while (1) {
          switch (_context3.prev = _context3.next) {
            case 0:
              _context3.next = 2;
              return getBackupPhrase(args[0]);

            case 2:
              mnemonic = _context3.sent;
              _context3.next = 5;
              return getPaymentKeyInfo(network, mnemonic);

            case 5:
              keyObj = _context3.sent;
              keyInfo = [];
              keyInfo.push(keyObj);
              return _context3.abrupt("return", JSONStringify(keyInfo));

            case 9:
            case "end":
              return _context3.stop();
          }
        }
      }, _callee3);
    }));
    return _getPaymentKey.apply(this, arguments);
  }

  function getStacksWalletKey(_x7, _x8) {
    return _getStacksWalletKey.apply(this, arguments);
  }

  function _getStacksWalletKey() {
    _getStacksWalletKey = _asyncToGenerator( /*#__PURE__*/runtime_1.mark(function _callee4(network, args) {
      var mnemonic, keyObj, keyInfo;
      return runtime_1.wrap(function _callee4$(_context4) {
        while (1) {
          switch (_context4.prev = _context4.next) {
            case 0:
              _context4.next = 2;
              return getBackupPhrase(args[0]);

            case 2:
              mnemonic = _context4.sent;
              _context4.next = 5;
              return getStacksWalletKeyInfo(network, mnemonic);

            case 5:
              keyObj = _context4.sent;
              keyInfo = [];
              keyInfo.push(keyObj);
              return _context4.abrupt("return", JSONStringify(keyInfo));

            case 9:
            case "end":
              return _context4.stop();
          }
        }
      }, _callee4);
    }));
    return _getStacksWalletKey.apply(this, arguments);
  }

  function makeKeychain(_x9, _x10) {
    return _makeKeychain.apply(this, arguments);
  }

  function _makeKeychain() {
    _makeKeychain = _asyncToGenerator( /*#__PURE__*/runtime_1.mark(function _callee5(network, args) {
      var mnemonic, stacksKeyInfo;
      return runtime_1.wrap(function _callee5$(_context5) {
        while (1) {
          switch (_context5.prev = _context5.next) {
            case 0:
              if (!args[0]) {
                _context5.next = 6;
                break;
              }

              _context5.next = 3;
              return getBackupPhrase(args[0]);

            case 3:
              mnemonic = _context5.sent;
              _context5.next = 9;
              break;

            case 6:
              _context5.next = 8;
              return bip39.generateMnemonic(STX_WALLET_COMPATIBLE_SEED_STRENGTH, crypto.randomBytes);

            case 8:
              mnemonic = _context5.sent;

            case 9:
              _context5.next = 11;
              return getStacksWalletKeyInfo(network, mnemonic);

            case 11:
              stacksKeyInfo = _context5.sent;
              return _context5.abrupt("return", JSONStringify({
                mnemonic: mnemonic,
                keyInfo: stacksKeyInfo
              }));

            case 13:
            case "end":
              return _context5.stop();
          }
        }
      }, _callee5);
    }));
    return _makeKeychain.apply(this, arguments);
  }

  function balance(network, args) {
    var address = args[0];

    if (BLOCKSTACK_TEST) {
      address = network.coerceAddress(address);
    }

    var txNetwork = network.isMainnet() ? new network$1.StacksMainnet() : new network$1.StacksTestnet();
    txNetwork.coreApiUrl = network.legacyNetwork.blockstackAPIUrl;
    return fetch__default['default'](txNetwork.getAccountApiUrl(address)).then(function (response) {
      return response.json();
    }).then(function (response) {
      var balanceHex = response.balance;

      if (response.balance.startsWith('0x')) {
        balanceHex = response.balance.substr(2);
      }

      var lockedHex = response.locked;

      if (response.locked.startsWith('0x')) {
        lockedHex = response.locked.substr(2);
      }

      var unlockHeight = response.unlock_height;
      var balance = new BN__default['default'](balanceHex, 16);
      var locked = new BN__default['default'](lockedHex, 16);
      var res = {
        balance: balance.toString(10),
        locked: locked.toString(10),
        unlock_height: unlockHeight,
        nonce: response.nonce
      };
      return Promise.resolve(JSONStringify(res));
    });
  }

  function getAccountHistory(network, args) {
    var address = c32check$1.c32ToB58(args[0]);

    if (args.length >= 2 && !!args[1]) {
      var page = parseInt(args[1]);
      return Promise.resolve().then(function () {
        return network.getAccountHistoryPage(address, page);
      }).then(function (accountStates) {
        return JSONStringify(accountStates.map(function (s) {
          var new_s = {
            address: c32check$1.b58ToC32(s.address),
            credit_value: s.credit_value.toString(),
            debit_value: s.debit_value.toString()
          };
          return new_s;
        }));
      });
    } else {
      var getAllAccountHistoryPages = function getAllAccountHistoryPages(page) {
        return network.getAccountHistoryPage(address, page).then(function (results) {
          if (results.length == 0) {
            return history;
          } else {
            history = history.concat(results);
            return getAllAccountHistoryPages(page + 1);
          }
        });
      };

      var history = [];
      return getAllAccountHistoryPages(0).then(function (accountStates) {
        return JSONStringify(accountStates.map(function (s) {
          var new_s = {
            address: c32check$1.b58ToC32(s.address),
            credit_value: s.credit_value.toString(),
            debit_value: s.debit_value.toString()
          };
          return new_s;
        }));
      });
    }
  }

  function sendTokens(_x11, _x12) {
    return _sendTokens.apply(this, arguments);
  }

  function _sendTokens() {
    _sendTokens = _asyncToGenerator( /*#__PURE__*/runtime_1.mark(function _callee6(network, args) {
      var recipientAddress, tokenAmount, fee, nonce, privateKey, memo, txNetwork, options, tx;
      return runtime_1.wrap(function _callee6$(_context6) {
        while (1) {
          switch (_context6.prev = _context6.next) {
            case 0:
              recipientAddress = args[0];
              tokenAmount = new BN__default['default'](args[1]);
              fee = new BN__default['default'](args[2]);
              nonce = new BN__default['default'](args[3]);
              privateKey = args[4];
              memo = '';

              if (args.length > 4 && !!args[5]) {
                memo = args[5];
              }

              txNetwork = network.isMainnet() ? new network$1.StacksMainnet() : new network$1.StacksTestnet();
              txNetwork.coreApiUrl = network.legacyNetwork.blockstackAPIUrl;
              options = {
                recipient: recipientAddress,
                amount: tokenAmount,
                senderKey: privateKey,
                fee: fee,
                nonce: nonce,
                memo: memo,
                network: txNetwork
              };
              _context6.next = 12;
              return transactions.makeSTXTokenTransfer(options);

            case 12:
              tx = _context6.sent;

              if (!estimateOnly) {
                _context6.next = 15;
                break;
              }

              return _context6.abrupt("return", transactions.estimateTransfer(tx, txNetwork).then(function (cost) {
                return cost.toString(10);
              }));

            case 15:
              if (!txOnly) {
                _context6.next = 17;
                break;
              }

              return _context6.abrupt("return", Promise.resolve(tx.serialize().toString('hex')));

            case 17:
              return _context6.abrupt("return", transactions.broadcastTransaction(tx, txNetwork).then(function (response) {
                if (response.hasOwnProperty('error')) {
                  return response;
                }

                return {
                  txid: "0x" + tx.txid(),
                  transaction: generateExplorerTxPageUrl(tx.txid(), txNetwork)
                };
              })["catch"](function (error) {
                return error.toString();
              }));

            case 18:
            case "end":
              return _context6.stop();
          }
        }
      }, _callee6);
    }));
    return _sendTokens.apply(this, arguments);
  }

  function contractDeploy(_x13, _x14) {
    return _contractDeploy.apply(this, arguments);
  }

  function _contractDeploy() {
    _contractDeploy = _asyncToGenerator( /*#__PURE__*/runtime_1.mark(function _callee7(network, args) {
      var sourceFile, contractName, fee, nonce, privateKey, source, txNetwork, options, tx;
      return runtime_1.wrap(function _callee7$(_context7) {
        while (1) {
          switch (_context7.prev = _context7.next) {
            case 0:
              sourceFile = args[0];
              contractName = args[1];
              fee = new BN__default['default'](args[2]);
              nonce = new BN__default['default'](args[3]);
              privateKey = args[4];
              source = fs.readFileSync(sourceFile).toString();
              txNetwork = network.isMainnet() ? new network$1.StacksMainnet() : new network$1.StacksTestnet();
              txNetwork.coreApiUrl = network.legacyNetwork.blockstackAPIUrl;
              options = {
                contractName: contractName,
                codeBody: source,
                senderKey: privateKey,
                fee: fee,
                nonce: nonce,
                network: txNetwork,
                postConditionMode: transactions.PostConditionMode.Allow
              };
              _context7.next = 11;
              return transactions.makeContractDeploy(options);

            case 11:
              tx = _context7.sent;

              if (!estimateOnly) {
                _context7.next = 14;
                break;
              }

              return _context7.abrupt("return", transactions.estimateContractDeploy(tx, txNetwork).then(function (cost) {
                return cost.toString(10);
              }));

            case 14:
              if (!txOnly) {
                _context7.next = 16;
                break;
              }

              return _context7.abrupt("return", Promise.resolve(tx.serialize().toString('hex')));

            case 16:
              return _context7.abrupt("return", transactions.broadcastTransaction(tx, txNetwork).then(function (response) {
                if (response.hasOwnProperty('error')) {
                  return response;
                }

                return {
                  txid: "0x" + tx.txid(),
                  transaction: generateExplorerTxPageUrl(tx.txid(), txNetwork)
                };
              })["catch"](function (error) {
                return error.toString();
              }));

            case 17:
            case "end":
              return _context7.stop();
          }
        }
      }, _callee7);
    }));
    return _contractDeploy.apply(this, arguments);
  }

  function contractFunctionCall(_x15, _x16) {
    return _contractFunctionCall.apply(this, arguments);
  }

  function _contractFunctionCall() {
    _contractFunctionCall = _asyncToGenerator( /*#__PURE__*/runtime_1.mark(function _callee8(network, args) {
      var contractAddress, contractName, functionName, fee, nonce, privateKey, txNetwork, abi, abiArgs, functionArgs;
      return runtime_1.wrap(function _callee8$(_context8) {
        while (1) {
          switch (_context8.prev = _context8.next) {
            case 0:
              contractAddress = args[0];
              contractName = args[1];
              functionName = args[2];
              fee = new BN__default['default'](args[3]);
              nonce = new BN__default['default'](args[4]);
              privateKey = args[5];
              txNetwork = network.isMainnet() ? new network$1.StacksMainnet() : new network$1.StacksTestnet();
              txNetwork.coreApiUrl = network.legacyNetwork.blockstackAPIUrl;
              functionArgs = [];
              return _context8.abrupt("return", transactions.getAbi(contractAddress, contractName, txNetwork).then(function (responseAbi) {
                abi = responseAbi;
                var filtered = abi.functions.filter(function (fn) {
                  return fn.name === functionName;
                });

                if (filtered.length === 1) {
                  abiArgs = filtered[0].args;
                  return makePromptsFromArgList(abiArgs);
                } else {
                  return null;
                }
              }).then(function (prompts) {
                return inquirer.prompt(prompts);
              }).then(function (answers) {
                functionArgs = parseClarityFunctionArgAnswers(answers, abiArgs);
                var options = {
                  contractAddress: contractAddress,
                  contractName: contractName,
                  functionName: functionName,
                  functionArgs: functionArgs,
                  senderKey: privateKey,
                  fee: fee,
                  nonce: nonce,
                  network: txNetwork,
                  postConditionMode: transactions.PostConditionMode.Allow
                };
                return transactions.makeContractCall(options);
              }).then(function (tx) {
                if (!transactions.validateContractCall(tx.payload, abi)) {
                  throw new Error('Failed to validate function arguments against ABI');
                }

                if (estimateOnly) {
                  return transactions.estimateContractFunctionCall(tx, txNetwork).then(function (cost) {
                    return cost.toString(10);
                  });
                }

                if (txOnly) {
                  return Promise.resolve(tx.serialize().toString('hex'));
                }

                return transactions.broadcastTransaction(tx, txNetwork).then(function (response) {
                  if (response.hasOwnProperty('error')) {
                    return response;
                  }

                  return {
                    txid: "0x" + tx.txid(),
                    transaction: generateExplorerTxPageUrl(tx.txid(), txNetwork)
                  };
                })["catch"](function (error) {
                  return error.toString();
                });
              }));

            case 10:
            case "end":
              return _context8.stop();
          }
        }
      }, _callee8);
    }));
    return _contractFunctionCall.apply(this, arguments);
  }

  function readOnlyContractFunctionCall(_x17, _x18) {
    return _readOnlyContractFunctionCall.apply(this, arguments);
  }

  function _readOnlyContractFunctionCall() {
    _readOnlyContractFunctionCall = _asyncToGenerator( /*#__PURE__*/runtime_1.mark(function _callee9(network, args) {
      var contractAddress, contractName, functionName, senderAddress, txNetwork, abi, abiArgs, functionArgs;
      return runtime_1.wrap(function _callee9$(_context9) {
        while (1) {
          switch (_context9.prev = _context9.next) {
            case 0:
              contractAddress = args[0];
              contractName = args[1];
              functionName = args[2];
              senderAddress = args[3];
              txNetwork = network.isMainnet() ? new network$1.StacksMainnet() : new network$1.StacksTestnet();
              txNetwork.coreApiUrl = network.legacyNetwork.blockstackAPIUrl;
              functionArgs = [];
              return _context9.abrupt("return", transactions.getAbi(contractAddress, contractName, txNetwork).then(function (responseAbi) {
                abi = responseAbi;
                var filtered = abi.functions.filter(function (fn) {
                  return fn.name === functionName;
                });

                if (filtered.length === 1) {
                  abiArgs = filtered[0].args;
                  return makePromptsFromArgList(abiArgs);
                } else {
                  return null;
                }
              }).then(function (prompts) {
                return inquirer.prompt(prompts);
              }).then(function (answers) {
                functionArgs = parseClarityFunctionArgAnswers(answers, abiArgs);
                var options = {
                  contractAddress: contractAddress,
                  contractName: contractName,
                  functionName: functionName,
                  functionArgs: functionArgs,
                  senderAddress: senderAddress,
                  network: txNetwork
                };
                return transactions.callReadOnlyFunction(options);
              }).then(function (returnValue) {
                return transactions.cvToString(returnValue);
              })["catch"](function (error) {
                return error.toString();
              }));

            case 8:
            case "end":
              return _context9.stop();
          }
        }
      }, _callee9);
    }));
    return _readOnlyContractFunctionCall.apply(this, arguments);
  }

  function getKeyAddress(network, args) {
    var privateKey = decodePrivateKey(args[0]);
    return Promise.resolve().then(function () {
      var addr = getPrivateKeyAddress(network, privateKey);
      return JSONStringify({
        BTC: addr,
        STACKS: c32check$1.b58ToC32(addr)
      });
    });
  }

  function gaiaGetFile(network, args) {
    var username = args[0];
    var origin = args[1];
    var path = args[2];
    var appPrivateKey = args[3];
    var decrypt = false;
    var verify = false;

    if (!!appPrivateKey && args.length > 4 && !!args[4]) {
      decrypt = args[4].toLowerCase() === 'true' || args[4].toLowerCase() === '1';
    }

    if (!!appPrivateKey && args.length > 5 && !!args[5]) {
      verify = args[5].toLowerCase() === 'true' || args[5].toLowerCase() === '1';
    }

    if (!appPrivateKey) {
      appPrivateKey = 'fda1afa3ff9ef25579edb5833b825ac29fae82d03db3f607db048aae018fe882';
    }

    blockstack.config.network.layer1 = bitcoin.networks.bitcoin;
    return gaiaAuth(network, appPrivateKey, null).then(function (_userData) {
      return blockstack.getFile(path, {
        decrypt: decrypt,
        verify: verify,
        app: origin,
        username: username
      });
    }).then(function (data) {
      if (data instanceof ArrayBuffer) {
        return Buffer.from(data);
      } else {
        return data;
      }
    });
  }

  function gaiaPutFile(network, args) {
    var hubUrl = args[0];
    var appPrivateKey = args[1];
    var dataPath = args[2];
    var gaiaPath = path.normalize(args[3].replace(/^\/+/, ''));
    var encrypt = false;
    var sign = false;

    if (args.length > 4 && !!args[4]) {
      encrypt = args[4].toLowerCase() === 'true' || args[4].toLowerCase() === '1';
    }

    if (args.length > 5 && !!args[5]) {
      sign = args[5].toLowerCase() === 'true' || args[5].toLowerCase() === '1';
    }

    var data = fs.readFileSync(dataPath);
    blockstack.config.network.layer1 = bitcoin.networks.bitcoin;
    return gaiaAuth(network, appPrivateKey, hubUrl).then(function (_userData) {
      return blockstack.putFile(gaiaPath, data, {
        encrypt: encrypt,
        sign: sign
      });
    }).then(function (url) {
      return JSONStringify({
        urls: [url]
      });
    });
  }

  function gaiaDeleteFile(network, args) {
    var hubUrl = args[0];
    var appPrivateKey = args[1];
    var gaiaPath = path.normalize(args[2].replace(/^\/+/, ''));
    var wasSigned = false;

    if (args.length > 3 && !!args[3]) {
      wasSigned = args[3].toLowerCase() === 'true' || args[3].toLowerCase() === '1';
    }

    blockstack.config.network.layer1 = bitcoin.networks.bitcoin;
    return gaiaAuth(network, appPrivateKey, hubUrl).then(function (_userData) {
      return blockstack.deleteFile(gaiaPath, {
        wasSigned: wasSigned
      });
    }).then(function () {
      return JSONStringify('ok');
    });
  }

  function gaiaListFiles(network, args) {
    var hubUrl = args[0];
    var appPrivateKey = args[1];
    var count = 0;
    blockstack.config.network.layer1 = bitcoin.networks.bitcoin;
    return gaiaAuth(network, canonicalPrivateKey(appPrivateKey), hubUrl).then(function (_userData) {
      return blockstack.listFiles(function (name) {
        console.log(name);
        count += 1;
        return true;
      });
    }).then(function () {
      return JSONStringify(count);
    });
  }

  function batchify(input, batchSize) {
    if (batchSize === void 0) {
      batchSize = 50;
    }

    var output = [];
    var currentBatch = [];

    for (var i = 0; i < input.length; i++) {
      currentBatch.push(input[i]);

      if (currentBatch.length >= batchSize) {
        output.push(currentBatch);
        currentBatch = [];
      }
    }

    if (currentBatch.length > 0) {
      output.push(currentBatch);
    }

    return output;
  }

  function gaiaDumpBucket(network, args) {
    var nameOrIDAddress = args[0];
    var appOrigin = args[1];
    var hubUrl = args[2];
    var mnemonicOrCiphertext = args[3];
    var dumpDir = args[4];

    if (dumpDir.length === 0) {
      throw new Error('Invalid directory (not given)');
    }

    if (dumpDir[0] !== '/') {
      var cwd = fs.realpathSync('.');
      dumpDir = path.normalize(cwd + "/" + dumpDir);
    }

    mkdirs(dumpDir);

    function downloadFile(hubConfig, fileName) {
      var gaiaReadUrl = hubConfig.url_prefix.replace(/\/+$/, '') + "/" + hubConfig.address;
      var fileUrl = gaiaReadUrl + "/" + fileName;
      var destPath = dumpDir + "/" + fileName.replace(/\//g, '\\x2f');
      console.log("Download " + fileUrl + " to " + destPath);
      return fetch__default['default'](fileUrl).then(function (resp) {
        if (resp.status !== 200) {
          throw new Error("Bad status code for " + fileUrl + ": " + resp.status);
        }

        var contentType = resp.headers.get('Content-Type');

        if (contentType === null || contentType.startsWith('text') || contentType === 'application/json') {
          return resp.text();
        } else {
          return resp.arrayBuffer();
        }
      }).then(function (filebytes) {
        return new Promise(function (resolve, reject) {
          try {
            fs.writeFileSync(destPath, Buffer.from(filebytes), {
              encoding: null,
              mode: 432
            });
            resolve();
          } catch (e) {
            reject(e);
          }
        });
      });
    }

    blockstack.config.network.layer1 = bitcoin.networks.bitcoin;
    var fileNames = [];
    var gaiaHubConfig;
    var appPrivateKey;
    var ownerPrivateKey;
    return getIDAppKeys(network, nameOrIDAddress, appOrigin, mnemonicOrCiphertext).then(function (keyInfo) {
      appPrivateKey = keyInfo.appPrivateKey;
      ownerPrivateKey = keyInfo.ownerPrivateKey;
      return gaiaAuth(network, appPrivateKey, hubUrl, ownerPrivateKey);
    }).then(function (_userData) {
      return gaiaConnect(network, hubUrl, appPrivateKey);
    }).then(function (hubConfig) {
      gaiaHubConfig = hubConfig;
      return blockstack.listFiles(function (name) {
        fileNames.push(name);
        return true;
      });
    }).then(function (fileCount) {
      console.log("Download " + fileCount + " files...");
      var fileBatches = batchify(fileNames);
      var filePromiseChain = Promise.resolve();

      var _loop = function _loop(i) {
        var filePromises = fileBatches[i].map(function (fileName) {
          return downloadFile(gaiaHubConfig, fileName);
        });
        var batchPromise = Promise.all(filePromises);
        filePromiseChain = filePromiseChain.then(function () {
          return batchPromise;
        });
      };

      for (var i = 0; i < fileBatches.length; i++) {
        _loop(i);
      }

      return filePromiseChain.then(function () {
        return JSONStringify(fileCount);
      });
    });
  }

  function gaiaRestoreBucket(network, args) {
    var nameOrIDAddress = args[0];
    var appOrigin = args[1];
    var hubUrl = args[2];
    var mnemonicOrCiphertext = args[3];
    var dumpDir = args[4];

    if (dumpDir.length === 0) {
      throw new Error('Invalid directory (not given)');
    }

    if (dumpDir[0] !== '/') {
      var cwd = fs.realpathSync('.');
      dumpDir = path.normalize(cwd + "/" + dumpDir);
    }

    var fileList = fs.readdirSync(dumpDir);
    var fileBatches = batchify(fileList, 10);
    var appPrivateKey;
    var ownerPrivateKey;
    blockstack.config.network.layer1 = bitcoin.networks.bitcoin;
    return getIDAppKeys(network, nameOrIDAddress, appOrigin, mnemonicOrCiphertext).then(function (keyInfo) {
      appPrivateKey = keyInfo.appPrivateKey;
      ownerPrivateKey = keyInfo.ownerPrivateKey;
      return gaiaAuth(network, appPrivateKey, hubUrl, ownerPrivateKey);
    }).then(function (_userData) {
      var uploadPromise = Promise.resolve();

      var _loop2 = function _loop2(i) {
        var uploadBatchPromises = fileBatches[i].map(function (fileName) {
          var filePath = path.join(dumpDir, fileName);
          var dataBuf = fs.readFileSync(filePath);
          var gaiaPath = fileName.replace(/\\x2f/g, '/');
          return blockstack.putFile(gaiaPath, dataBuf, {
            encrypt: false,
            sign: false
          }).then(function (url) {
            console.log("Uploaded " + fileName + " to " + url);
          });
        });
        uploadPromise = uploadPromise.then(function () {
          return Promise.all(uploadBatchPromises);
        });
      };

      for (var i = 0; i < fileBatches.length; i++) {
        _loop2(i);
      }

      return uploadPromise;
    }).then(function () {
      return JSONStringify(fileList.length);
    });
  }

  function gaiaSetHub(_x19, _x20) {
    return _gaiaSetHub.apply(this, arguments);
  }

  function _gaiaSetHub() {
    _gaiaSetHub = _asyncToGenerator( /*#__PURE__*/runtime_1.mark(function _callee10(network, args) {
      var blockstackID, ownerHubUrl, appOrigin, hubUrl, mnemonicPromise, nameInfoPromise, profilePromise, _yield$Promise$all, nameInfo, nameProfile, mnemonic, ownerAddress, idAddress, appKeyInfo, ownerKeyInfo, existingAppAddress, appPrivateKey, appAddress, profile, ownerPrivateKey, ownerGaiaHubPromise, appGaiaHubPromise, _yield$Promise$all2, ownerHubConfig, appHubConfig, gaiaReadUrl, newAppEntry, apps, signedProfile, profileUrls;

      return runtime_1.wrap(function _callee10$(_context10) {
        while (1) {
          switch (_context10.prev = _context10.next) {
            case 0:
              network.setCoerceMainnetAddress(true);
              blockstackID = args[0];
              ownerHubUrl = args[1];
              appOrigin = args[2];
              hubUrl = args[3];
              mnemonicPromise = getBackupPhrase(args[4]);
              nameInfoPromise = getNameInfoEasy(network, blockstackID).then(function (nameInfo) {
                if (!nameInfo) {
                  throw new Error('Name not found');
                }

                return nameInfo;
              });
              profilePromise = blockstack.lookupProfile(blockstackID);
              _context10.next = 10;
              return Promise.all([nameInfoPromise, profilePromise, mnemonicPromise]);

            case 10:
              _yield$Promise$all = _context10.sent;
              nameInfo = _yield$Promise$all[0];
              nameProfile = _yield$Promise$all[1];
              mnemonic = _yield$Promise$all[2];

              if (nameProfile) {
                _context10.next = 16;
                break;
              }

              throw new Error('No profile found');

            case 16:
              if (nameInfo) {
                _context10.next = 18;
                break;
              }

              throw new Error('Name not found');

            case 18:
              if (nameInfo.zonefile) {
                _context10.next = 20;
                break;
              }

              throw new Error('No zone file found');

            case 20:
              if (!nameProfile.apps) {
                nameProfile.apps = {};
              }

              ownerAddress = network.coerceMainnetAddress(nameInfo.address);
              idAddress = "ID-" + ownerAddress;
              _context10.next = 25;
              return getApplicationKeyInfo(network, mnemonic, idAddress, appOrigin);

            case 25:
              appKeyInfo = _context10.sent;
              _context10.next = 28;
              return getOwnerKeyInfo(network, mnemonic, appKeyInfo.ownerKeyIndex);

            case 28:
              ownerKeyInfo = _context10.sent;
              existingAppAddress = null;

              try {
                existingAppAddress = getGaiaAddressFromProfile(network, nameProfile, appOrigin);
                appPrivateKey = extractAppKey(network, appKeyInfo, existingAppAddress);
              } catch (e) {
                console.log("No profile application entry for " + appOrigin);
                appPrivateKey = extractAppKey(network, appKeyInfo);
              }

              appPrivateKey = canonicalPrivateKey(appPrivateKey) + "01";
              appAddress = network.coerceMainnetAddress(getPrivateKeyAddress(network, appPrivateKey));

              if (!(existingAppAddress && appAddress !== existingAppAddress)) {
                _context10.next = 35;
                break;
              }

              throw new Error("BUG: " + existingAppAddress + " !== " + appAddress);

            case 35:
              profile = nameProfile;
              ownerPrivateKey = ownerKeyInfo.privateKey;
              ownerGaiaHubPromise = gaiaConnect(network, ownerHubUrl, ownerPrivateKey);
              appGaiaHubPromise = gaiaConnect(network, hubUrl, appPrivateKey);
              _context10.next = 41;
              return Promise.all([ownerGaiaHubPromise, appGaiaHubPromise]);

            case 41:
              _yield$Promise$all2 = _context10.sent;
              ownerHubConfig = _yield$Promise$all2[0];
              appHubConfig = _yield$Promise$all2[1];

              if (ownerHubConfig.url_prefix) {
                _context10.next = 46;
                break;
              }

              throw new Error('Invalid owner hub config: no url_prefix defined');

            case 46:
              if (appHubConfig.url_prefix) {
                _context10.next = 48;
                break;
              }

              throw new Error('Invalid app hub config: no url_prefix defined');

            case 48:
              gaiaReadUrl = appHubConfig.url_prefix.replace(/\/+$/, '');
              newAppEntry = {};
              newAppEntry[appOrigin] = gaiaReadUrl + "/" + appAddress + "/";
              apps = Object.assign({}, profile.apps ? profile.apps : {}, newAppEntry);
              profile.apps = apps;
              signedProfile = makeProfileJWT(profile, ownerPrivateKey);
              _context10.next = 56;
              return gaiaUploadProfileAll(network, [ownerHubUrl], signedProfile, ownerPrivateKey, blockstackID);

            case 56:
              profileUrls = _context10.sent;

              if (!profileUrls.error) {
                _context10.next = 61;
                break;
              }

              return _context10.abrupt("return", JSONStringify({
                error: profileUrls.error
              }));

            case 61:
              return _context10.abrupt("return", JSONStringify({
                profileUrls: profileUrls.dataUrls
              }));

            case 62:
            case "end":
              return _context10.stop();
          }
        }
      }, _callee10);
    }));
    return _gaiaSetHub.apply(this, arguments);
  }

  function addressConvert(network, args) {
    var addr = args[0];
    var b58addr;
    var c32addr;
    var testnetb58addr;
    var testnetc32addr;

    if (addr.match(STACKS_ADDRESS_PATTERN)) {
      c32addr = addr;
      b58addr = c32check$1.c32ToB58(c32addr);
    } else if (addr.match(/[123456789ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnopqrstuvwxyz]+/)) {
      c32addr = c32check$1.b58ToC32(addr);
      b58addr = addr;
    } else {
      throw new Error("Unrecognized address " + addr);
    }

    if (network.isTestnet()) {
      testnetb58addr = network.coerceAddress(b58addr);
      testnetc32addr = c32check$1.b58ToC32(testnetb58addr);
    }

    return Promise.resolve().then(function () {
      var result = {
        mainnet: {
          STACKS: c32addr,
          BTC: b58addr
        },
        testnet: undefined
      };

      if (network.isTestnet()) {
        result.testnet = {
          STACKS: testnetc32addr,
          BTC: testnetb58addr
        };
      }

      return JSONStringify(result);
    });
  }

  function authDaemon(network, args) {
    var gaiaHubUrl = args[0];
    var mnemonicOrCiphertext = args[1];
    var port = 3000;
    var profileGaiaHub = gaiaHubUrl;

    if (args.length > 2 && !!args[2]) {
      profileGaiaHub = args[2];
    }

    if (args.length > 3 && !!args[3]) {
      port = parseInt(args[3]);
    }

    if (port < 0 || port > 65535) {
      return Promise.resolve().then(function () {
        return JSONStringify({
          error: 'Invalid port'
        });
      });
    }

    var mnemonicPromise = getBackupPhrase(mnemonicOrCiphertext);
    return mnemonicPromise.then(function (mnemonic) {
      noExit = true;
      var authServer = express__default['default']();
      authServer.use(cors__default['default']());
      authServer.get(/^\/auth\/*$/, function (req, res) {
        return handleAuth(network, mnemonic, gaiaHubUrl, profileGaiaHub, port, req, res);
      });
      authServer.get(/^\/signin\/*$/, function (req, res) {
        return handleSignIn(network, mnemonic, gaiaHubUrl, profileGaiaHub, req, res);
      });
      authServer.listen(port, function () {
        return console.log("Authentication server started on " + port);
      });
      return 'Press Ctrl+C to exit';
    })["catch"](function (e) {
      return JSONStringify({
        error: e.message
      });
    });
  }

  function encryptMnemonic(network, args) {
    var mnemonic = args[0];

    if (mnemonic.split(/ +/g).length !== 12) {
      throw new Error('Invalid backup phrase: must be 12 words');
    }

    var passwordPromise = new Promise(function (resolve, reject) {
      var pass = '';

      if (args.length === 2 && !!args[1]) {
        pass = args[1];
        resolve(pass);
      } else {
        if (!process$1.stdin.isTTY) {
          var errMsg = 'Password argument required on non-interactive mode';
          reject(new Error(errMsg));
        } else {
          getpass('Enter password: ', function (pass1) {
            getpass('Enter password again: ', function (pass2) {
              if (pass1 !== pass2) {
                var _errMsg = 'Passwords do not match';
                reject(new Error(_errMsg));
              } else {
                resolve(pass1);
              }
            });
          });
        }
      }
    });
    return passwordPromise.then(function (pass) {
      return encryptBackupPhrase(mnemonic, pass);
    }).then(function (cipherTextBuffer) {
      return cipherTextBuffer.toString('base64');
    })["catch"](function (e) {
      return JSONStringify({
        error: e.message
      });
    });
  }

  function decryptMnemonic(network, args) {
    var ciphertext = args[0];
    var passwordPromise = new Promise(function (resolve, reject) {
      if (args.length === 2 && !!args[1]) {
        var pass = args[1];
        resolve(pass);
      } else {
        if (!process$1.stdin.isTTY) {
          reject(new Error('Password argument required in non-interactive mode'));
        } else {
          getpass('Enter password: ', function (p) {
            resolve(p);
          });
        }
      }
    });
    return passwordPromise.then(function (pass) {
      return decryptBackupPhrase(Buffer.from(ciphertext, 'base64'), pass);
    })["catch"](function (e) {
      return JSONStringify({
        error: 'Failed to decrypt (wrong password or corrupt ciphertext), ' + ("details: " + e.message)
      });
    });
  }

  function stackingStatus(_x21, _x22) {
    return _stackingStatus.apply(this, arguments);
  }

  function _stackingStatus() {
    _stackingStatus = _asyncToGenerator( /*#__PURE__*/runtime_1.mark(function _callee11(network, args) {
      var stxAddress, txNetwork, stacker;
      return runtime_1.wrap(function _callee11$(_context11) {
        while (1) {
          switch (_context11.prev = _context11.next) {
            case 0:
              stxAddress = args[0];
              txNetwork = network.isMainnet() ? new network$1.StacksMainnet() : new network$1.StacksTestnet();
              stacker = new stacking.StackingClient(stxAddress, txNetwork);
              return _context11.abrupt("return", stacker.getStatus().then(function (status) {
                if (status.stacked) {
                  return {
                    amount_microstx: status.details.amount_microstx,
                    first_reward_cycle: status.details.first_reward_cycle,
                    lock_period: status.details.lock_period,
                    unlock_height: status.details.unlock_height,
                    pox_address: {
                      version: status.details.pox_address.version.toString('hex'),
                      hashbytes: status.details.pox_address.hashbytes.toString('hex')
                    }
                  };
                } else {
                  return 'Account not actively participating in Stacking';
                }
              })["catch"](function (error) {
                return error.toString();
              }));

            case 4:
            case "end":
              return _context11.stop();
          }
        }
      }, _callee11);
    }));
    return _stackingStatus.apply(this, arguments);
  }

  function canStack(_x23, _x24) {
    return _canStack.apply(this, arguments);
  }

  function _canStack() {
    _canStack = _asyncToGenerator( /*#__PURE__*/runtime_1.mark(function _callee12(network, args) {
      var amount, cycles, poxAddress, stxAddress, txNetwork, apiConfig, accounts, balancePromise, stacker, poxInfoPromise, stackingEligiblePromise;
      return runtime_1.wrap(function _callee12$(_context12) {
        while (1) {
          switch (_context12.prev = _context12.next) {
            case 0:
              amount = new BN__default['default'](args[0]);
              cycles = Number(args[1]);
              poxAddress = args[2];
              stxAddress = args[3];
              txNetwork = network.isMainnet() ? new network$1.StacksMainnet() : new network$1.StacksTestnet();
              apiConfig = new blockchainApiClient.Configuration({
                fetchApi: crossfetch__default['default'],
                basePath: txNetwork.coreApiUrl
              });
              accounts = new blockchainApiClient.AccountsApi(apiConfig);
              balancePromise = accounts.getAccountBalance({
                principal: stxAddress
              });
              stacker = new stacking.StackingClient(stxAddress, txNetwork);
              poxInfoPromise = stacker.getPoxInfo();
              stackingEligiblePromise = stacker.canStack({
                poxAddress: poxAddress,
                cycles: cycles
              });
              return _context12.abrupt("return", Promise.all([balancePromise, poxInfoPromise, stackingEligiblePromise]).then(function (_ref2) {
                var balance = _ref2[0],
                    poxInfo = _ref2[1],
                    stackingEligible = _ref2[2];
                var minAmount = new BN__default['default'](poxInfo.min_amount_ustx);
                var balanceBN = new BN__default['default'](balance.stx.balance);

                if (minAmount.gt(amount)) {
                  throw new Error("Stacking amount less than required minimum of " + minAmount.toString() + " microstacks");
                }

                if (amount.gt(balanceBN)) {
                  throw new Error("Stacking amount greater than account balance of " + balanceBN.toString() + " microstacks");
                }

                if (!stackingEligible.eligible) {
                  throw new Error("Account cannot participate in stacking. " + stackingEligible.reason);
                }

                return stackingEligible;
              })["catch"](function (error) {
                return error;
              }));

            case 12:
            case "end":
              return _context12.stop();
          }
        }
      }, _callee12);
    }));
    return _canStack.apply(this, arguments);
  }

  function stack(_x25, _x26) {
    return _stack.apply(this, arguments);
  }

  function _stack() {
    _stack = _asyncToGenerator( /*#__PURE__*/runtime_1.mark(function _callee13(network, args) {
      var amount, cycles, poxAddress, privateKey, txNetwork, txVersion, apiConfig, accounts, stxAddress, balancePromise, stacker, poxInfoPromise, coreInfoPromise, stackingEligiblePromise;
      return runtime_1.wrap(function _callee13$(_context13) {
        while (1) {
          switch (_context13.prev = _context13.next) {
            case 0:
              amount = new BN__default['default'](args[0]);
              cycles = Number(args[1]);
              poxAddress = args[2];
              privateKey = args[3];
              txNetwork = network.isMainnet() ? new network$1.StacksMainnet() : new network$1.StacksTestnet();
              txVersion = txNetwork.isMainnet() ? transactions.TransactionVersion.Mainnet : transactions.TransactionVersion.Testnet;
              apiConfig = new blockchainApiClient.Configuration({
                fetchApi: crossfetch__default['default'],
                basePath: txNetwork.coreApiUrl
              });
              accounts = new blockchainApiClient.AccountsApi(apiConfig);
              stxAddress = transactions.getAddressFromPrivateKey(privateKey, txVersion);
              balancePromise = accounts.getAccountBalance({
                principal: stxAddress
              });
              stacker = new stacking.StackingClient(stxAddress, txNetwork);
              poxInfoPromise = stacker.getPoxInfo();
              coreInfoPromise = stacker.getCoreInfo();
              stackingEligiblePromise = stacker.canStack({
                poxAddress: poxAddress,
                cycles: cycles
              });
              return _context13.abrupt("return", Promise.all([balancePromise, poxInfoPromise, coreInfoPromise, stackingEligiblePromise]).then(function (_ref3) {
                var balance = _ref3[0],
                    poxInfo = _ref3[1],
                    coreInfo = _ref3[2],
                    stackingEligible = _ref3[3];
                var minAmount = new BN__default['default'](poxInfo.min_amount_ustx);
                var balanceBN = new BN__default['default'](balance.stx.balance);
                var burnChainBlockHeight = coreInfo.burn_block_height;
                var startBurnBlock = burnChainBlockHeight + 3;

                if (minAmount.gt(amount)) {
                  throw new Error("Stacking amount less than required minimum of " + minAmount.toString() + " microstacks");
                }

                if (amount.gt(balanceBN)) {
                  throw new Error("Stacking amount greater than account balance of " + balanceBN.toString() + " microstacks");
                }

                if (!stackingEligible.eligible) {
                  throw new Error("Account cannot participate in stacking. " + stackingEligible.reason);
                }

                return stacker.stack({
                  amountMicroStx: amount,
                  poxAddress: poxAddress,
                  cycles: cycles,
                  privateKey: privateKey,
                  burnBlockHeight: startBurnBlock
                });
              }).then(function (response) {
                if (response.hasOwnProperty('error')) {
                  return response;
                }

                return {
                  txid: "0x" + response,
                  transaction: generateExplorerTxPageUrl(response, txNetwork)
                };
              })["catch"](function (error) {
                return error;
              }));

            case 15:
            case "end":
              return _context13.stop();
          }
        }
      }, _callee13);
    }));
    return _stack.apply(this, arguments);
  }

  function faucetCall(_, args) {
    var address = args[0];
    var apiConfig = new blockchainApiClient.Configuration({
      fetchApi: crossfetch__default['default'],
      basePath: 'https://stacks-node-api.blockstack.org'
    });
    var faucets = new blockchainApiClient.FaucetsApi(apiConfig);
    return faucets.runFaucetStx({
      address: address
    }).then(function (faucetTx) {
      return JSONStringify({
        txid: faucetTx.txId,
        transaction: generateExplorerTxPageUrl(faucetTx.txId, new network$1.StacksTestnet())
      });
    })["catch"](function (error) {
      return error.toString();
    });
  }

  function printDocs(_network, _args) {
    return Promise.resolve().then(function () {
      var formattedDocs = [];
      var commandNames = Object.keys(CLI_ARGS.properties);

      for (var i = 0; i < commandNames.length; i++) {
        var commandName = commandNames[i];
        var args = [];
        var usage = CLI_ARGS.properties[commandName].help;
        var group = CLI_ARGS.properties[commandName].group;

        for (var j = 0; j < CLI_ARGS.properties[commandName].items.length; j++) {
          var argItem = CLI_ARGS.properties[commandName].items[j];
          args.push({
            name: argItem.name,
            type: argItem.type,
            value: argItem.realtype,
            format: argItem.pattern ? argItem.pattern : '.+'
          });
        }

        formattedDocs.push({
          command: commandName,
          args: args,
          usage: usage,
          group: group
        });
      }

      return JSONStringify(formattedDocs);
    });
  }

  var COMMANDS = {
    authenticator: authDaemon,
    balance: balance,
    can_stack: canStack,
    call_contract_func: contractFunctionCall,
    call_read_only_contract_func: readOnlyContractFunctionCall,
    convert_address: addressConvert,
    decrypt_keychain: decryptMnemonic,
    deploy_contract: contractDeploy,
    docs: printDocs,
    encrypt_keychain: encryptMnemonic,
    gaia_deletefile: gaiaDeleteFile,
    gaia_dump_bucket: gaiaDumpBucket,
    gaia_getfile: gaiaGetFile,
    gaia_listfiles: gaiaListFiles,
    gaia_putfile: gaiaPutFile,
    gaia_restore_bucket: gaiaRestoreBucket,
    gaia_sethub: gaiaSetHub,
    get_address: getKeyAddress,
    get_account_history: getAccountHistory,
    get_app_keys: getAppKeys,
    get_owner_keys: getOwnerKeys,
    get_payment_key: getPaymentKey,
    get_stacks_wallet_key: getStacksWalletKey,
    make_keychain: makeKeychain,
    profile_sign: profileSign,
    profile_store: profileStore,
    profile_verify: profileVerify,
    send_tokens: sendTokens,
    stack: stack,
    stacking_status: stackingStatus,
    faucet: faucetCall
  };
  function CLIMain() {
    var argv = process$1.argv;
    var opts = getCLIOpts(argv);
    var cmdArgs = checkArgs(CLIOptAsStringArray(opts, '_') ? CLIOptAsStringArray(opts, '_') : []);

    if (!cmdArgs.success) {
      if (cmdArgs.error) {
        console.log(cmdArgs.error);
      }

      if (cmdArgs.usage) {
        if (cmdArgs.command) {
          console.log(makeCommandUsageString(cmdArgs.command));
          console.log('Use "help" to list all commands.');
        } else {
          console.log(USAGE);
          console.log(makeAllCommandsList());
        }
      }

      process$1.exit(1);
    } else {
      txOnly = CLIOptAsBool(opts, 'x');
      estimateOnly = CLIOptAsBool(opts, 'e');
      safetyChecks = !CLIOptAsBool(opts, 'U');
      receiveFeesPeriod = opts['N'] ? parseInt(CLIOptAsString(opts, 'N')) : receiveFeesPeriod;
      gracePeriod = opts['G'] ? parseInt(CLIOptAsString(opts, 'N')) : gracePeriod;
      maxIDSearchIndex = opts['M'] ? parseInt(CLIOptAsString(opts, 'M')) : maxIDSearchIndex;
      var debug = CLIOptAsBool(opts, 'd');
      var consensusHash = CLIOptAsString(opts, 'C');
      var integration_test = CLIOptAsBool(opts, 'i');
      var testnet = CLIOptAsBool(opts, 't');
      var magicBytes = CLIOptAsString(opts, 'm');
      var apiUrl = CLIOptAsString(opts, 'H');
      var transactionBroadcasterUrl = CLIOptAsString(opts, 'T');
      var nodeAPIUrl = CLIOptAsString(opts, 'I');
      var utxoUrl = CLIOptAsString(opts, 'X');
      var bitcoindUsername = CLIOptAsString(opts, 'u');
      var bitcoindPassword = CLIOptAsString(opts, 'p');

      if (integration_test) {
        BLOCKSTACK_TEST = integration_test;
      }

      var configPath = CLIOptAsString(opts, 'c') ? CLIOptAsString(opts, 'c') : integration_test ? DEFAULT_CONFIG_REGTEST_PATH : testnet ? DEFAULT_CONFIG_TESTNET_PATH : DEFAULT_CONFIG_PATH;
      var namespaceBurnAddr = CLIOptAsString(opts, 'B');
      var feeRate = CLIOptAsString(opts, 'F') ? parseInt(CLIOptAsString(opts, 'F')) : 0;
      var priceToPay = CLIOptAsString(opts, 'P') ? CLIOptAsString(opts, 'P') : '0';
      var priceUnits = CLIOptAsString(opts, 'D');
      var networkType = testnet ? 'testnet' : integration_test ? 'regtest' : 'mainnet';
      var configData = loadConfig(configPath, networkType);

      if (debug) {
        configData.logConfig.level = 'debug';
      } else {
        configData.logConfig.level = 'info';
      }

      if (bitcoindUsername) {
        configData.bitcoindUsername = bitcoindUsername;
      }

      if (bitcoindPassword) {
        configData.bitcoindPassword = bitcoindPassword;
      }

      if (utxoUrl) {
        configData.utxoServiceUrl = utxoUrl;
      }

      logger.configure({
        level: configData.logConfig.level,
        transports: [new logger.transports.Console(configData.logConfig)]
      });
      var cliOpts = {
        consensusHash: consensusHash ? consensusHash : null,
        feeRate: feeRate ? feeRate : null,
        namespaceBurnAddress: namespaceBurnAddr ? namespaceBurnAddr : null,
        priceToPay: priceToPay ? priceToPay : null,
        priceUnits: priceUnits ? priceUnits : null,
        receiveFeesPeriod: receiveFeesPeriod ? receiveFeesPeriod : null,
        gracePeriod: gracePeriod ? gracePeriod : null,
        altAPIUrl: apiUrl ? apiUrl : configData.blockstackAPIUrl,
        altTransactionBroadcasterUrl: transactionBroadcasterUrl ? transactionBroadcasterUrl : configData.broadcastServiceUrl,
        nodeAPIUrl: nodeAPIUrl ? nodeAPIUrl : configData.blockstackNodeUrl
      };
      var wrappedNetwork = getNetwork(configData, !!BLOCKSTACK_TEST || !!integration_test || !!testnet);
      var blockstackNetwork = new CLINetworkAdapter(wrappedNetwork, cliOpts);

      blockstack.config.logLevel = 'error';

      if (cmdArgs.command === 'help') {
        console.log(makeCommandUsageString(cmdArgs.args[0]));
        process$1.exit(0);
      }

      var method = COMMANDS[cmdArgs.command];
      var exitcode = 0;
      method(blockstackNetwork, cmdArgs.args).then(function (result) {
        try {
          if (result instanceof Buffer) {
            return result;
          } else {
            var resJson = JSON.parse(result);

            if (resJson.hasOwnProperty('status') && !resJson.status) {
              exitcode = 1;
            }

            return result;
          }
        } catch (e) {
          return result;
        }
      }).then(function (result) {
        if (result instanceof Buffer) {
          process$1.stdout.write(result);
        } else {
          console.log(result);
        }
      }).then(function () {
        if (!noExit) {
          process$1.exit(exitcode);
        }
      })["catch"](function (e) {
        console.error(e.stack);
        console.error(e.message);

        if (!noExit) {
          process$1.exit(1);
        }
      });
    }
  }

  var localStorageRAM = {};
  global['window'] = {
    location: {
      origin: 'localhost'
    },
    localStorage: {
      getItem: function getItem(itemName) {
        return localStorageRAM[itemName];
      },
      setItem: function setItem(itemName, itemValue) {
        localStorageRAM[itemName] = itemValue;
      },
      removeItem: function removeItem(itemName) {
        delete localStorageRAM[itemName];
      }
    }
  };
  global['localStorage'] = global['window'].localStorage;
  CLIMain();

  exports.CLIMain = CLIMain;

  Object.defineProperty(exports, '__esModule', { value: true });

})));
//# sourceMappingURL=cli.umd.development.js.map
