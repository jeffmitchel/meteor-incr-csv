var expect = [
  ["FirstName", "LastName",  "Email"],
  ["Albert",    "Einstein",  "emc2@princeton.edu"],
  ["Marie",     "Curie",     "marie.curie@sorbonne.fr"],
  ["Ma\nx",     "Pla\r\nck", "max@mpg.de"]
];

var input_f = [
  'FirstName,"LastName",Email\r\nAlbert,Einstein,emc2@princeton.edu\r',   // terminator on chunk boundary
  '\nMarie,Curie,marie.curie@sorbonne.fr\r\nMa\nx,"Pla\r\nck",max@mpg.de' // terminators in data and no terminator on last row
];

var input_o = [
  'FirstName|^LastName^|Email$Albert|Einstein|emc2@princeton.edu$',       // alternate options
  'Marie|Curie|marie.curie@sorbonne.fr$Ma\nx|Pla\r\nck|max@mpg.de$'
];

var output = [];

Tinytest.add('IncrmentalCSV - Function Constructor', function(test) {
  csv = new IncrementalCSV(
    function (rec, idx) {
      output[idx] = rec;
      console.log('1: %d -> ', idx, rec);
    }
  );

  _.each(input_f, function(str) {
    csv.push(str);
  });

  csv.finish();

  test.equal(output, expect);
  output = [];
});

Tinytest.add('IncrmentalCSV - Object Constructor', function(test) {
  csv = new IncrementalCSV({
    onRecord: function (rec, idx) {
      output[idx] = rec;
      console.log('2: %d -> ', idx, rec);
    },
    recordSeparator: '$',
    fieldSeparator: '|',
    quoteCharacter: '^'
  });

  _.each(input_o, function(str) {
    csv.push(str);
  });

  csv.finish();

  test.equal(output, expect);
  output = [];
});