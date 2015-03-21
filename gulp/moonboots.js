var Moonboots = require('moonboots-static');

var moonboots = new Moonboots({
    moonboots: {
        main: __dirname + '/../src2/app.js',
        browserify: {
          debug: true,
          transforms: ['reactify']
        },
        uglify: [],
        minify: false,
        cache: false,
        developmentMode: true
    },
    // Contents from the public directory
    // will be copied to the target directory
    public: __dirname + '/../src2/public',
    // Directory to build files into
    directory: __dirname + '/../_build',
    // Log build items
    verbose: true
});

moonboots.on('ready', function (err) {
    if (err) {
        // Oh no something went wrong
    } else {
        // Yay, we built our files!
    }
});
