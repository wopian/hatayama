module.exports = {
    options: {
        stripBanners: true,
    },
    dist: {
        files: {
            'dist/assets/js/app.js' : [
                'src/assets/javascript/vendor/materialize.min.js',
                'src/assets/javascript/vendor/instantclick.min.js',
                //'src/assets/js/vendor/jquery.lazyload.min.js',
                'src/assets/javascript/app.js'
            ]
        }
    }
}