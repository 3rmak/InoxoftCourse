const path = require('path')
const fs = require('fs')
const util = require('util')

// const __dirname = path.resolve()
const stats = new fs.Stats

const start_folder = path.resolve(__dirname, 'folder')
const destination_folder = path.resolve(__dirname, 'destination_folder')

const fsReadDir = util.promisify(fs.readdir)
const fsRename = util.promisify(fs.rename)
const fsStat = util.promisify(fs.stat)

if (!fs.existsSync(destination_folder)){
    fs.mkdirSync(destination_folder);
}

async function whoPutsYouThere(folder){
    try {
        const files = await fsReadDir(folder)
        files.map(async function(val){
            try {
                const statsItem = await fsStat(path.resolve(folder, val))
                if(statsItem.isFile()){
                    const oldPath = path.resolve(folder, val)
                    const newPath = path.resolve(destination_folder, val)
                    await fsRename(oldPath, newPath)
                }
                if(statsItem.isDirectory()){
                    whoPutsYouThere(path.resolve(folder, val))
                }
            } catch (error) {
                console.log("error during rename operations")
            }
        })
    } catch (error) {
        console.log("error during fs operations ")
    }
}

whoPutsYouThere(start_folder)