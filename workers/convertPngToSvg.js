const folder = "resources/atomic",
    folderDest = "resources/converted";

var potrace = require('potrace'),
    fs = require('fs');
var possiblePairs = fs.readdirSync(folder);

// console.log(files)

for(let file in possiblePairs){
    // console.log(files[file])


}



var x = 0;
var runPicturesArraySync = function(items){
  fs. readdir(folder, function(err, items) {
    console. log(items);


    _waitAsyncGroup(items[x], function () {
        x++;
        console.log(x)
        if(x < items.length){
            runPicturesArraySync(items)
        }
        if (x === items.length){

            console.log("fini!")
        }
    })


  })


}

var _waitAsyncGroup = function(file, _continueLoop){


        try {
            console.log(folder + "/" + file)
            potrace.trace(folder + "/" + file, function (err, svg) {
                if (err) {
                    console.log(err)
                    return
                }
                ;

                let name = folderDest + '/' + file.split(".")[0] + '.svg';
                fs.writeFileSync(name, svg);
                console.log(name + " ...ok");
                _continueLoop()

            });
        }catch (e) {
            console.log("damn")
            console.log(e)
            _continueLoop()
        }

}
runPicturesArraySync(possiblePairs.sort().slice(322, possiblePairs.length))
