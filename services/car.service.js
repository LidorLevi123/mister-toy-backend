
import fs from 'fs'
import { utilService } from './util.service.js'
import { loggerService } from './logger.service.js'

export const carService = {
    query,
    getById,
    remove,
    save
}

const PAGE_SIZE = 5
const cars = utilService.readJsonFile('data/car.json')

function query(filterBy = { txt: '' }) {
    const regex = new RegExp(filterBy.txt, 'i')
    var carsToReturn = cars.filter(car => regex.test(car.vendor))
    if (filterBy.minSpeed) {
        carsToReturn = carsToReturn.filter(car => car.speed >= filterBy.minSpeed)
    }
    if (filterBy.pageIdx !== undefined) {
        const startIdx = filterBy.pageIdx * PAGE_SIZE
        carsToReturn = carsToReturn.slice(startIdx, startIdx + PAGE_SIZE)
    }
    return Promise.resolve(carsToReturn)
}

function getById(carId) {
    const car = cars.find(car => car._id === carId)
    return Promise.resolve(car)
}

function remove(carId) {
    const idx = cars.findIndex(car => car._id === carId)
    cars.splice(idx, 1)
    return _saveCarsToFile()
}

function save(car) {
    if (car._id) {
        const idx = cars.findIndex(currCar => currCar._id === car._id)
        cars[idx] = car
    } else {
        car._id = utilService.makeId()
        cars.unshift(car)
    }
    return _saveCarsToFile().then(() => car)
}

function _saveCarsToFile() {
    return new Promise((resolve, reject) => {
        const data = JSON.stringify(cars, null, 2)
        fs.writeFile('data/car.json', data, (err) => {
            if (err) {
                loggerService.error('Cannot write to cars file', err)
                return reject(err)
            }
            resolve()
        })
    })
}
