var fs = require("fs"),
    http = require("http"),
    url = require("url"),
    path = require("path");
    cdn = require("./cdn.js")

var port = 8888;
console.log("Im running fine")

http.createServer(function (req, res) {
    req.url = req.url.slice(1);
    var file = path.resolve(__dirname, req.url);
    fs.stat(file, function (err, stats) {
        if (err) {
            if (err.code === 'ENOENT') {
                // 404 Error if file not found
                return res.writeHead(404, {
                    'Content-Length': Buffer.byteLength("NOT FOUND"),
                    'Content-Type': 'text/plain'
                });
            }
            res.end(err);
        }
        var range = req.headers.range;
        if (!range) {
            // 416 Wrong range
            return res.writeHead(416, {
                'Content-Length': Buffer.byteLength("WRONG RANGE"),
                'Content-Type': 'text/plain'
            });
        }
        var positions = range.replace(/bytes=/, "").split("-");
        var start = parseInt(positions[0], 10);
        var total = stats.size;
        var end = positions[1] ? parseInt(positions[1], 10) : total - 1;
        var chunksize = (end - start) + 1;

        res.writeHead(206, {
            "Content-Range": "bytes " + start + "-" + end + "/" + total,
            "Accept-Ranges": "bytes",
            "Content-Length": chunksize,
            "Content-Type": "video/mp4"
        });

        var stream = fs.createReadStream(file, { start: start, end: end })
            .on("open", function () {
                stream.pipe(res);
            }).on("error", function (err) {
                res.end(err);
            });
    });
}).listen(port);