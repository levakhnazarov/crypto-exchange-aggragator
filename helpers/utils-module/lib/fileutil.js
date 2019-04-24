const fs = require('fs')
exports.createFile = function (filename, content) {
    return new Promise(function(resolve, reject){
    fs.open(__dirname + filename,'r',function(err, fd){
        if (err) {
            fs.writeFile(__dirname + filename, content, function(err) {
                if(err) {
                    reject(err);
                }
                resolve(filename)
            });
        } else {
            reject(filename)
        }
    });

    })
};