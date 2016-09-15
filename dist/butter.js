(function(f){if(typeof exports==="object"&&typeof module!=="undefined"){module.exports=f()}else if(typeof define==="function"&&define.amd){define([],f)}else{var g;if(typeof window!=="undefined"){g=window}else if(typeof global!=="undefined"){g=global}else if(typeof self!=="undefined"){g=self}else{g=this}g.Butter = f()}})(function(){var define,module,exports;return (function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
'use strict';

function Butter(threshold, flip) {
  this.threshold = this.getColor(threshold || 'ff5e7689');

  this.flip = flip ? -1 : 1;
}

Butter.prototype = {
  constructor: Butter,

  _run: function _run(sourceData) {

    // Source data width
    var sourceW = sourceData.width;

    // Source data height
    var sourceH = sourceData.height;

    // Source colors rgba
    var sourcePixels = sourceData.data;

    // Source colors 32bit
    var sourceView32 = new Uint32Array(sourcePixels.buffer);

    // Threshold color
    var thresh = this.threshold;

    // Over or under (black/white)
    var flip = this.flip;

    for (var row = 0; row < sourceH; row += 1) {
      var rowStart = row * sourceW;
      var rowWidth = rowStart + sourceW;

      var rangeStart = 0;
      var range = sourceView32.subarray(rowStart, rowWidth);

      for (var colorIndex = 0; colorIndex < range.length; colorIndex += 1) {
        var color = range[colorIndex];

        if (flip * color > flip * thresh && rangeStart === 0) {
          rangeStart = colorIndex;
        }

        if (flip * color < flip * thresh && rangeStart !== 0) {
          range.subarray(rangeStart, colorIndex).sort();

          // Start again
          rangeStart = 0;
        }
      }
    }

    return sourceData;
  },

  that: function that(source) {

    // TODO: Check type of args, allow images?
    var sourceData = source.getImageData(0, 0, source.canvas.width, source.canvas.height);

    return this._run(sourceData);
  },

  getColor: function getColor(color) {
    return parseInt(color, 16);
  }
};

module.exports = Butter;

},{}]},{},[1])(1)
});