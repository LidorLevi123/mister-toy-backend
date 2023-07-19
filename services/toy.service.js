
import fs from 'fs'
import { utilService } from './util.service.js'
import { loggerService } from './logger.service.js'

export const toyService = {
    query,
    getById,
    remove,
    save
}

const toys = utilService.readJsonFile('data/toy.json')

function query(filterBy) {
    if (!filterBy) return toys

    // Filter
    const regex = new RegExp(filterBy.name, 'i')
    let filteredToys = toys.filter(toy => regex.test(toy.name))

    if (filterBy.inStock !== null) {
        filterBy.inStock = filterBy.inStock === 'true' ? true : false
        filteredToys = toys.filter(toy => toy.inStock === filterBy.inStock)
    }

    // Sort
    filterBy.isDescending = filterBy.isDescending === 'true' ? true : false
    const desc = filterBy.isDescending ? -1 : 1
    const { sortBy } = filterBy

    if (sortBy === 'name') filteredToys.sort((t1, t2) => t1.name.localeCompare(t2.name) * desc)
    else if (sortBy === 'price') filteredToys.sort((t1, t2) => (t1.price - t2.price) * desc)
    else if (sortBy === 'createdAt') filteredToys.sort((t1, t2) => (t1.createdAt - t2.createdAt) * desc)

    return Promise.resolve(filteredToys)
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
        toy.createdAt = Date.now()
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
