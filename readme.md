# Meteor Incremental CSV Package

Process a CSV file incrementally. Useful when a file is large or you can't (or don't want to) store it first.

## How to install 
1. `npm install -g meteorite` (if not already installed)
2. `mrt add incr-csv`

## Documentation:

### Constructor:

IncrmentalCSV(function callback(row, index), object options);

Callback is called once for each row and is passed the row as an array of strings and the zero-based ordinal index of the row.

The options are optional. Available options and defaults are:
```
  - quoteCharacter  = '"';      // length must be 1
  - fieldSeparator  = ',';      // length must be 1
  - recordSeparator = '\r\n';   // length must be 1 or 2
```
### Methods:

```
  push(string);
```

Push a string into the parser for processing. The string should be a valid CSV fragment, but does not need to be a complete row. 

```
  finish();
```

Since the CSV specification allow the last line of the input to be unterminated calling finish() will flush any remaining data.

## Example:

This example incrementally parses a CSV file uploaded using [EventedMind's File Uploader](https://github.com/EventedMind/meteor-file).

```javascript
if (Meteor.isServer) {
  // array of parsers for multi-file upload.  
  var csvs = {};

  Meteor.methods({
    'uploadFile': function (file) {
      // create parser on first block
      if(file.start === 0) {
        csvs[file.name] = new IncrementalCSV(
          function(rec, idx) {
            // process your data here.
            // idx is zero-based, skip if there's a header.
            console.log(idx+1, "->", rec);
          }
        );
      }

      // convert data to a buffer and
      // send it as a string to the parser
      var buffer = new Buffer(file.data);
      csvs[file.name].push(buffer.toString());

      // end of file. flush the parser and cleanup
      if (file.size === file.end) {
        csvs[file.name].finish();
        delete csvs[file.name];
      }
    }
  });
}
```

## Credit:
The parser is adapted from cvsToArray v2.1 by Daniel Tillin.

https://code.google.com/p/csv-to-array/
