
import fs from 'fs'
import { utilService } from './util.service.js'
import { loggerService } from './logger.service.js'

export const toyService = {
    query,
    getById,
    remove,
    save
}

const PAGE_SIZE = 5
const toys = utilService.readJsonFile('data/toy.json')

function query(filterBy = { txt: '' }) {
    // const regex = new RegExp(filterBy.txt, 'i')
    // var toysToReturn = toys.filter(toy => regex.test(toy.vendor))
    // if (filterBy.minSpeed) {
    //     toysToReturn = toysToReturn.filter(toy => toy.speed >= filterBy.minSpeed)
    // }
    // if (filterBy.pageIdx !== undefined) {
    //     const startIdx = filterBy.pageIdx * PAGE_SIZE
    //     toysToReturn = toysToReturn.slice(startIdx, startIdx + PAGE_SIZE)
    // }
    // return Promise.resolve(toysToReturn)
    return Promise.resolve(toys)
}

function getById(toyId) {
    const toy = toys.find(toy => toy._id === toyId)
    return Promise.resolve(toy)
}

function remove(toyId) {
    const idx = toys.findIndex(toy => toy._id === toyId)
    toys.splice(idx, 1)
    return _saveToysToFile()
}

function save(toy) {
    if (toy._id) {
        const idx = toys.findIndex(currToy => currToy._id === toy._id)
        toys[idx] = toy
    } else {
        toy._id = utilService.makeId()
        toys.unshift(toy)
    }
    return _saveToysToFile().then(() => toy)
}

function _saveToysToFile() {
    return new Promise((resolve, reject) => {
        const data = JSON.stringify(toys, null, 2)
        fs.writeFile('data/toy.json', data, (err) => {
            if (err) {
                loggerService.error('Cannot write to toys file', err)
                return reject(err)
            }
            resolve()
        })
    })
}
