const fs = require('fs')

const filepath = '/home/tolasom/Desktop/apidev/audios'
//IDGAF
//upload script (work)
fs.readdir(filepath, (err, files)=>{
    if (err) {return err}
    var item = 0
    files.forEach((IDGAF)=>{
        var str = IDGAF
        // console.log(IDGAF)
        while(item <= 20 ){
            var res = str.replace(`.wav`,`_${item}.wav`)
            item++;
            console.log('after :'+res)
        }
        //console.log(res)
    })
})