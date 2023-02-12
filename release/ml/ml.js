const fs = require('fs');
const path = require('path');
const {create, all, sec} = require('mathjs')
const math = create(all, {});

class Ml {

    constructor() {
        this.model = new Model();
    }

    getBlobBuffer(digit, index) {
        let chunksize = 28 * 28;
        var buffer = Buffer.alloc(chunksize);
        const filename = path.join(__dirname, '..', 'assets','ml', 'data' + digit + '.bin');
        let fd = fs.openSync(filename, 'r');
        fs.readSync(fd, buffer, 0, chunksize, chunksize * index);  
        return buffer;
    }

    getNumberArray(digit, index) {
        return Array.from(new Uint8Array(this.getBlobBuffer(digit, index)));
    }

    testNumber(inputArray) {
        return this.model.feedforward(math.transpose(math.matrix([inputArray])))
    }
}

class Model {
    constructor() {
        let wjson = JSON.parse(fs.readFileSync(path.join(__dirname, "data", "weights.json")).toString())
        let bjson = JSON.parse(fs.readFileSync(path.join(__dirname, "data", "biases.json")).toString())
        this.biases = []
        this.weights = []
        this.biases[0] = math.matrix(bjson[0]);
        this.biases[1] = math.matrix(bjson[1]);
        this.biases[2] = math.matrix(bjson[2]);
        this.weights[0] = math.matrix(wjson[0]);
        this.weights[1] = math.matrix(wjson[1]);
        this.weights[2] = math.matrix(wjson[2]);
    }
    feedforward(a) {
        for (let i = 0; i < this.biases.length; i++) {
            a = math.map(math.add(this.biases[i], math.multiply(this.weights[i], a)),this.sigmoid)
        }
        return this.getMax(a)[0];
    }
    getMax(m) {
        let max = -1;
        let max_i = -1;
        for (let i = 0; i < 10; i++) {
            let v = m.get([i,0])
            if (v > max) {
                max =  v
                max_i = i
            }
        }
        return [max_i, max];
    }
    sigmoid(a) { 
        return 1 / (1 + Math.pow(Math.E, -1*a))
    }
}



module.exports = Ml