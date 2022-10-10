const readFile = require('./fileReader')

async function getData(path){
    const data = await readFile(path)
    return JSON.parse(data)
}
module.exports = {
    getData,
} 