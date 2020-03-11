"use strict";

require("core-js/modules/es.symbol");

require("core-js/modules/es.array.concat");

require("core-js/modules/es.array.filter");

require("core-js/modules/es.array.for-each");

require("core-js/modules/es.object.get-own-property-descriptor");

require("core-js/modules/es.object.get-own-property-descriptors");

require("core-js/modules/es.object.keys");

require("core-js/modules/es.object.to-string");

require("core-js/modules/es.promise");

require("core-js/modules/es.string.trim");

require("core-js/modules/web.dom-collections.for-each");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = init;

require("regenerator-runtime/runtime");

var _axios = _interopRequireDefault(require("axios"));

var _ReverMedia = _interopRequireDefault(require("./ReverMedia"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); if (enumerableOnly) symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; }); keys.push.apply(keys, symbols); } return keys; }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; if (i % 2) { ownKeys(Object(source), true).forEach(function (key) { _defineProperty(target, key, source[key]); }); } else if (Object.getOwnPropertyDescriptors) { Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)); } else { ownKeys(Object(source)).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } } return target; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

function asyncGeneratorStep(gen, resolve, reject, _next, _throw, key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { Promise.resolve(value).then(_next, _throw); } }

function _asyncToGenerator(fn) { return function () { var self = this, args = arguments; return new Promise(function (resolve, reject) { var gen = fn.apply(self, args); function _next(value) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "next", value); } function _throw(err) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "throw", err); } _next(undefined); }); }; }

function init() {
  return _init.apply(this, arguments);
}

function _init() {
  _init = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee() {
    var args,
        organization,
        reverMediaInstance,
        _args = arguments;
    return regeneratorRuntime.wrap(function _callee$(_context) {
      while (1) {
        switch (_context.prev = _context.next) {
          case 0:
            args = _args.length > 0 && _args[0] !== undefined ? _args[0] : {};
            validateArgs(args);
            _context.next = 4;
            return fetchOrganizationData(args);

          case 4:
            organization = _context.sent;
            reverMediaInstance = new _ReverMedia.default(_objectSpread({}, args, {
              organization: organization
            }));
            return _context.abrupt("return", reverMediaInstance);

          case 7:
          case "end":
            return _context.stop();
        }
      }
    }, _callee);
  }));
  return _init.apply(this, arguments);
}

function validateArgs(args) {
  var _args$reverURL = args.reverURL,
      reverURL = _args$reverURL === void 0 ? '' : _args$reverURL,
      _args$reverToken = args.reverToken,
      reverToken = _args$reverToken === void 0 ? '' : _args$reverToken,
      _args$organizationId = args.organizationId,
      organizationId = _args$organizationId === void 0 ? '' : _args$organizationId;
  if (!reverURL.trim()) throw new Error('reverURL param is required');
  if (!reverToken.trim()) throw new Error('reverToken param is required');
  if (!organizationId.trim()) throw new Error('organizationId param is required');
}

function fetchOrganizationData(_x) {
  return _fetchOrganizationData.apply(this, arguments);
}

function _fetchOrganizationData() {
  _fetchOrganizationData = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee2(args) {
    var reverURL, reverToken, organizationId, requestURL, response;
    return regeneratorRuntime.wrap(function _callee2$(_context2) {
      while (1) {
        switch (_context2.prev = _context2.next) {
          case 0:
            _context2.prev = 0;
            reverURL = args.reverURL, reverToken = args.reverToken, organizationId = args.organizationId;
            requestURL = "".concat(reverURL, "/organizations/").concat(organizationId);
            _context2.next = 5;
            return _axios.default.get(requestURL, {
              headers: {
                Authorization: reverToken
              }
            });

          case 5:
            response = _context2.sent;
            return _context2.abrupt("return", response.data);

          case 9:
            _context2.prev = 9;
            _context2.t0 = _context2["catch"](0);
            throw new Error("An error ocurred triying to get organization with id ".concat(args.organizationId, ".\nInit args: ").concat(JSON.stringify(args)));

          case 12:
          case "end":
            return _context2.stop();
        }
      }
    }, _callee2, null, [[0, 9]]);
  }));
  return _fetchOrganizationData.apply(this, arguments);
}