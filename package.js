Package.describe({
  "name": "jeffm:incr-csv",
  "summary": "Incremental CSV parser for Meteor (Deprecated)",
  "version": "0.2.9",
  "git": "https://github.com/jeffmitchel/meteor-incr-csv.git"
});

Package.on_use(function (api) {
  api.versionsFrom('METEOR@1.0');
  api.add_files("incr-csv.js", ['client', 'server']);
  api.export && api.export('IncrementalCSV', ['client', 'server']);
});

Package.on_test(function (api) {
  api.use(['jeffm:incr-csv', 'tinytest'], ['client', 'server']);
  api.add_files('incr-csv-test.js', ['client', 'server']);
});
