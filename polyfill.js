/**
 * Copyright (C) 2015  Austin Peterson
 *
 * This program is free software: you can redistribute it and/or modify
 * it under the terms of the GNU General Public License as published by
 * the Free Software Foundation, either version 3 of the License, or
 * (at your option) any later version.
 *
 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU General Public License for more details.
 *
 * You should have received a copy of the GNU General Public License
 * along with this program.  If not, see <http://www.gnu.org/licenses/>.
 */

var crypto = require('crypto');

function Polyfill(logger) {
  var log = logger.child({module: "Polyfill"});

  if (!String.prototype.repeat) {
    log.trace("String.prototype.repeat not found. Adding...");
    String.prototype.repeat = function(count) {
      'use strict';
      if (this == null) {
        throw new TypeError('can\'t convert ' + this + ' to object');
      }
      var str = '' + this;
      count = +count;
      if (count != count) {
        count = 0;
      }
      if (count < 0) {
        throw new RangeError('repeat count must be non-negative');
      }
      if (count == Infinity) {
        throw new RangeError('repeat count must be less than infinity');
      }
      count = Math.floor(count);
      if (str.length == 0 || count == 0) {
        return '';
      }
      // Ensuring count is a 31-bit integer allows us to heavily optimize the
      // main part. But anyway, most current (august 2014) browsers can't handle
      // strings 1 << 28 chars or longer, so:
      if (str.length * count >= 1 << 28) {
        throw new RangeError('repeat count must not overflow maximum string size');
      }
      var rpt = '';
      for (;;) {
        if ((count & 1) == 1) {
          rpt += str;
        }
        count >>>= 1;
        if (count == 0) {
          break;
        }
        str += str;
      }
      return rpt;
    }
  }

  if (!String.prototype.prepend) {
    log.trace("String.prototype.prepend not found. Adding...");
    // Prepend only if str is not empty
    String.prototype.prepend = function(text) {
      var str = this.toString();
      return str ? text+str : str;
    }
  }

  if (!String.prototype.append) {
    log.trace("String.prototype.append not found. Adding...");
    // Append only if str is not empty
    String.prototype.append = function(text) {
      var str = this.toString();
      return str ? str+text : str;
    }
  }

  if (!String.prototype.sha1) {
    log.trace("String.prototype.sha1 not found. Adding...");
    String.prototype.sha1 = function() {
      return crypto.createHash('sha1').update(this.toString()).digest('hex');
    }
  }

  if (!String.prototype.decodeHTML) {
    log.trace("String.prototype.decodeHTML not found. Adding...");
    String.prototype.decodeHTML = function() {
      var map = {"gt":">" /* , … */};
      return this.replace(/&(#(?:x[0-9a-f]+|\d+)|[a-z]+);?/gi, function($0, $1) {
          if ($1[0] === "#") {
              return String.fromCharCode($1[1].toLowerCase() === "x" ? parseInt($1.substr(2), 16)  : parseInt($1.substr(1), 10));
          } else {
              return map.hasOwnProperty($1) ? map[$1] : $0;
          }
      });
    };
  }

  if (!Array.prototype.randomElement) {
    log.trace("Array.prototype.randomElement not found. Adding...");
    var chance = new (require('chance'));
    Array.prototype.randomElement = function(low, high) {
      low = low || 0;
      high = high || this.length - 1;
      if (high > this.length - 1) {
        high = this.length - 1;
      }
      return this[chance.integer({min:low, max:high})];
    }
  }

  if (!String.prototype.contains) {
    log.trace("String.prototype.contains not found. Adding...");
    String.prototype.contains = function(needle) {
      return this.indexOf(needle) !== -1;
    }
  }

  // Register startsWith function
  if (!String.prototype.startsWith) {
    log.trace("String.prototype.startsWith not found. Adding...");
    Object.defineProperty(String.prototype, 'startsWith', {
      value: function(searchString, position) {
        position = position || 0;
        return this.substring(position, position + searchString.length) === searchString;
      }
    });
  }

  if (!String.prototype.endsWith) {
    log.trace("String.prototype.endsWith not found. Adding...");
    Object.defineProperty(String.prototype, 'endsWith', {
      value: function(searchString, position) {
        var subjectString = this.toString();
        if (position === undefined || position > subjectString.length) {
          position = subjectString.length;
        }
        position -= searchString.length;
        var lastIndex = subjectString.indexOf(searchString, position);
        return lastIndex !== -1 && lastIndex === position;
      }
    });
  }

  if (!String.prototype.isChannel) {
    log.trace("String.prototype.isChannel not found. Adding...");
    String.prototype.isChannel = function() {
      return (this.startsWith("#") || this.startsWith("+") || this.startsWith("&") || this.startsWith("!")) // Starts with #, +, & or !
        && !(this.contains(" ") || this.contains(",") || this.contains(":")) // Does not contain <space>, <colon> or <comma>
        && this.length <= 50; // Up to 50 characters
    }
  }

  if (!String.prototype.pluralize) {
    log.trace("String.prototype.pluralize not found. Adding...");
    String.prototype.pluralize = function(count, plural) {
      if (plural == null)
        plural = this + 's';

      return (count == 1 ? this : plural)
    }
  }

  if (!Object.prototype.each) {
    log.trace("Object.prototype.each not found. Adding...");
    Object.prototype.each = function(callback, thisArg) {
      'use strict';
      if (this == null) throw new TypeError('Object.prototype.each called on null or undefined');
      if (typeof callback !== 'function') throw new TypeError();
      thisArg = thisArg || void 0;
      Object.keys(this).forEach(function (key, id, array) {
        callback.call(thisArg, this[key], key, this);
      }, this);
    }
  }

  if (!Array.prototype.each) {
    log.trace("Array.prototype.each not found. Adding...");
    Array.prototype.each = function(callback, thisArg) {
      'use strict';
      if (this == null) throw new TypeError('Object.prototype.each called on null or undefined');
      if (typeof callback !== 'function') throw new TypeError();
      thisArg = thisArg || void 0;
      Array.prototype.forEach.call(this, callback, thisArg);
    }
  }

  if (!Object.prototype.some) {
    log.trace("Object.prototype.some not found. Adding...");
    // Return true to stop looping
    Object.prototype.some = function(callback, thisArg) {
      'use strict';
      if (this == null) throw new TypeError('Object.prototype.some called on null or undefined');
      if (typeof callback !== 'function') throw new TypeError();
      thisArg = thisArg || void 0;
      return Object.keys(this).some(function (key, id, array) {
        return callback.call(thisArg, this[key], key, this);
      }, this);
    };
  }

  if (!Object.prototype.every) {
    log.trace("Object.prototype.every not found. Adding...");
    // Return false to stop looping
    Object.prototype.every = function(callback, thisArg) {
      'use strict';
      if (this == null) throw new TypeError('Object.prototype.every called on null or undefined');
      if (typeof callback !== 'function') throw new TypeError();
      thisArg = thisArg || void 0;
      return Object.keys(this).every(function (key, id, array) {
        return callback.call(thisArg, this[key], key, this);
      }, this);
    };
  }

  if (!Math.log10) {
    log.trace("Math.log10 not found. Adding...");
    Math.log10 = Math.log10 || function(x) {
      return Math.log(x) / Math.LN10;
    };
  }

  if(!Object.prototype.isEmpty) {
    Object.prototype.isEmpty = function() {
      for(var prop in this) {
          if(this.hasOwnProperty(prop))
              return false;
      }

      return true;
    }
  }

  log.info("Finished initializing Polyfill.");
}

module.exports = Polyfill;
