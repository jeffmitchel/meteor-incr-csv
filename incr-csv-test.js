var expect = [
  ["FirstName", "LastName", "Email"],
  ["Albert",    "Einstein", "emc2@princeton.edu"],
  ["Marie",     "Curie",    "marie.curie@sorbonne.fr"],
  ["Max",       "Planck",   "max@mpg.de"]
];

var input = [
  'FirstName,"LastName",Email\r\nAlbert,Einstein,emc2@princeton.edu\r',   // terminator on check boundary
  '\nMarie,Curie,marie.curie@sorbonne.fr\r\nMax,Planck,max@mpg.de'        // no terminator on last row
];

var output = [];

Tinytest.add('IncrementalCSV - Parse Records', function(test) {
  csv = new IncrementalCSV(
    function (rec, idx) {
      output[idx] = rec;
      console.log('%d -> ', idx, rec);
    }
  );

  _.each(input, function(str) {
    csv.push(str);
  });

  csv.finish();

  test.equal(output, expect);
});