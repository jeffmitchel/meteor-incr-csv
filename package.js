Package.describe({
  summary: "Incremental CSV parser for Meteor"
});

Package.on_use(function (api) {
  api.add_files("incr-csv.js", ['client', 'server']);
  api.export && api.export('IncrementalCSV', ['client', 'server']);
});

Package.on_test(function (api) {
  api.use(['incr-csv', 'tinytest'], ['client', 'server']);
  api.add_files('incr-csv-test.js', ['client', 'server']);
});
