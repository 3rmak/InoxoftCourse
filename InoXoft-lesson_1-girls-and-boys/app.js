const path = require('path')
const fs = require('fs')
const util = require('util')

// const __dirname = path.resolve()

const boysCamp = path.resolve(__dirname, "boys")
const girlsCamp = path.resolve(__dirname, "girls")

const fsReadDir = util.promisify(fs.readdir)
const fsReadFile = util.promisify(fs.readFile)
const fsRename = util.promisify(fs.rename)

async function goToCamps(from, to, gender){
    const res = await fsReadDir(from)
    res.map(async (val, index)=>{
        try {
            const item = await fsReadFile(path.resolve(from, val))
            const person = JSON.parse(item.toString('ascii'))
            if(person.gender === gender){
                await fsRename(
                    path.resolve(from, val), 
                    path.resolve(to, val)
                )
            }
        } catch (error) {
            console.log("Error while moving")
        }
    })
}


goToCamps(boysCamp, girlsCamp, 'female')
    .then(()=>{
        console.log("Girls are in a place")
    })

goToCamps(girlsCamp, boysCamp, 'male')
.then(()=>{
    console.log("Boys are in a place")
})