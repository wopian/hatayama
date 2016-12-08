module.exports = function(config) {
    config.set({
        frameworks: ['browserify', 'jasmine'],
        reporters: ['spec'],
        browsers: ['PhantomJS'],
        preprocessors: {
            'tests/**/*.js': ['browserify']
        },
        browserify: {
            debug: true
            //transform: ['brfs']
        },
        plugins: [
            'karma-jasmine',
            'karma-phantomjs-launcher',
            'karma-spec-reporter',
            'karma-browserify'
        ],
        files: [
            'tests/**/*.js'
        ]
    });
};