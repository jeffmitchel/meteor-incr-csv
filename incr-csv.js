IncrementalCSV = function(options) {
  if (options && typeof(options) === 'function') {
    this.options = {
      onRecord: options
    };
  } else {
    this.options = options || {};
  }

  if(! this.options.onRecord || typeof(this.options.onRecord) != 'function')
    this.options.onRecord = function(row, idx) {};

  if(! this.options.quoteCharacter || this.options.quoteCharacter.length != 1)
    this.options.quoteCharacter = '"';

  if(! this.options.fieldSeparator || this.options.fieldSeparator.length != 1)
    this.options.fieldSeparator = ',';

  if(! this.options.recordSeparator || this.options.recordSeparator.length < 1 || this.options.recordSeparator.length > 2)
    this.options.recordSeparator = '\r\n';

  this.index = 0;
  this.record = [''];
  this.inQuote = false;
  this.fieldIndex = 0;
  this.recordIndex = 0;
  this.backtrack = '';
};

IncrementalCSV.prototype = {
  constructor: IncrementalCSV,

  push: function(input) {
    this._parse(input);
  },

  finish: function() {
    var self = this;
    if(! (self.record.length === 1 && self.record[0].length === 0))
      self.options.onRecord(self.record, self.recordIndex);
  },

  // ---------------------------------------------------------------------
  // Adapted from csvToArray v2.1 by Daniel Tillin
  // https://code.google.com/p/csv-to-array/
  // ---------------------------------------------------------------------
  _parse: function (input) {

    var self = this;

    for (var idx = self.backtrack.length > 0 ? -1 : 0; idx < input.length; idx++) {

      if(idx < 0) {
        c = self.backtrack;
        self.backtrack = '';
      } else {
        c = input.charAt(idx);
      }

      switch (c) {

        case this.options.quoteCharacter:

          if (self.inQuote && input.charAt(idx + 1) == this.options.quoteCharacter) {
            self.record[self.fieldIndex] += this.options.quoteCharacter;
            ++idx;
          } else {
            self.inQuote = ! self.inQuote;
          }
          break;

        case this.options.fieldSeparator:
          if (! self.inQuote) {
            self.record[++self.fieldIndex] = '';
          } else {
            self.record[self.fieldIndex] += c;
          }
          break;

        case this.options.recordSeparator.charAt(0):

          // edge case: if first character of a two character record separator is the last
          //            character of this chunk, save it for processing with the next chunk.
          if(this.options.recordSeparator.length == 2 && idx >= input.length - 1) {
            self.backtrack = this.options.recordSeparator.charAt(0);
            break;
          }

          // in a quoted field? append to current field
          if(self.inQuote) {
            self.record[self.fieldIndex] += c;
          }

          // if a 1 char separator or if the next char is the 2nd char of a 2 char separator,
          // do the callback and reset the record.
          else if (! this.options.recordSeparator.charAt(1) ||
            (this.options.recordSeparator.charAt(1) && this.options.recordSeparator.charAt(1) == input.charAt(idx + 1))) {

            self.options.onRecord(self.record, self.recordIndex);

            ++self.recordIndex;
            self.record = [''];
            self.fieldIndex = 0;

            if (this.options.recordSeparator.charAt(1)) {
              ++idx;
            }
          } else {
              self.record[self.fieldIndex] += c;
          }
          break;

        default:
          self.record[self.fieldIndex] += c;
        }
    }
  }
};
