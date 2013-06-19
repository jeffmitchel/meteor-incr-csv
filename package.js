Package.describe({
  summary: "Incremental CSV Parser for Meteor"
});

Package.on_use(function (api) {
  api.add_files("incr-csv.js", ['client', 'server']);
});

Package.on_test(function (api) {
  api.use(['incr-csv', 'tinytest'], ['client', 'server']);
  api.add_files('incr-csv-test.js', ['client', 'server']);
});