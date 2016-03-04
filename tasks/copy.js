module.exports = {
    dist: {
        files: [{
            //Root of source -> Root of domain
            expand: true,
            cwd: 'src/',
            src: ['.htaccess', 'robots.txt', 'index.php'],
            dest: 'dist/'
        },
        {
            expand: true,
            cwd: 'src/assets/',
            src: ['**'],
            dest: 'dist/assets/'
        }
    }
}