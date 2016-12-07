var assert = require('assert');
var client = require('webdriverio').remote({
    logLevel: process.env.TRAVIS ? 'command' : 'silent',
    desiredCapabilities: {
        browserName: 'phantomjs'
    }
}).init();

describe('example', function() {
    before(function(done) {
        client.url('http://localhost:9000/fixture/example.html', done);
    });

    it('tests a feature', function(done) {
        client
            .getTitle(function(err, title) {
                assert.equal(title, 'Example');
            })
            .call(done);
    });

    after(function(done) {
        client.end(done);
    });
});