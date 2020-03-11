"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var ReverMedia = function ReverMedia(args) {
  _classCallCheck(this, ReverMedia);

  this.reverURL = args.reverURL;
  this.reverToken = args.reverToken;
  this.organization = args.organization;
  this.azureToken = args.azureToken;
};

exports.default = ReverMedia;