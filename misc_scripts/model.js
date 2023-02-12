const {create, all, sec} = require('mathjs')
const path = require('path');
const fs = require('fs');
//const data1 = require('./data/out')
//const data2 = require('./data/out2')
const testdata1 = require('./data/outTestData.json')
const testdata2 = require('./data/outTestDataAns.json')


const math = create(all, {});
const Ml = require('./ml');
const ml = new Ml();


let biases = [];// pages, each page is the bias vector for that layer.
let weights = [];
biases[0] = math.map(math.ones(math.matrix([16, 1])), (v) => Math.random()*2 - 1);
weights[0] = math.map(math.ones(math.matrix([16, 28*28])), (v) => Math.random()*2 - 1);
biases[1] = math.map(math.ones(math.matrix([16, 1])), (v) => Math.random()*2 - 1);
weights[1] = math.map(math.ones(math.matrix([16, 16])), (v) => Math.random()*2 - 1);
biases[2] = math.map(math.ones(math.matrix([10, 1])), (v) => Math.random()*2 - 1);
weights[2] = math.map(math.ones(math.matrix([10, 16])), (v) => Math.random()*2 - 1);

console.dir(testdata1[100], {'maxArrayLength': null});
console.dir(testdata2[100], {'maxArrayLength': null});
runFromCache();

function runFromCache() {
    loadIt();
    evaluate(1);
}

function trainMiniFromPythonData() {
    evaluate(-1)

    let set = []
    for (let i = 0; i < 50000; i++) {
        set.push(i)
    }

    for (let e = 0; e < 60; e++) {
        //shuffle index order
        for (let i = set.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            const temp = set[i];
            set[i] = set[j];
            set[j] = temp;
        }

        for (let i = 0; i < 5000; i++) {
            let miniBatch = {};
            miniBatch.size = 0;
            miniBatch.numberInputs = [];
            miniBatch.expecteds = []
            for (let j = 0; j < 10; j++) {
                let index = set[i * 10 + j];
                miniBatch.numberInputs[j] = math.transpose(math.matrix([data1[index]])),
                miniBatch.expecteds[j] = createExpected(data2[index])
                miniBatch.size++;
            }
            trainMiniBatch(miniBatch, .1)
        }
        evaluate(e, 60)
    }

    //testIt();
    saveIt();
}

function evaluate(e) {
    let correct = 0;
    for (let i = 0; i < 10000; i++) {
        let ans = getMax(feedforward(math.transpose(math.matrix([testdata1[i]]))))
        if (ans[0] == testdata2[i]) {
            correct++
        }
    }
    console.log("Test round " + e + ": " + correct + "/" + 10000)
}

function getNumberMatrix(digit, index) {
    return math.transpose(math.matrix([ml.getNumberArray(digit, index)]))
}

function runMini() {
    for (let k = 0; k < 80; k++) {
        let miniBatch = {};
        miniBatch.size = 0;
        miniBatch.numberInputs = [];
        miniBatch.expecteds = []
        for (let i = 0; i < 10; i++) {
            for (let j = 0; j < 10; j++) {
                let numberInput = getNumberMatrix(i,j + (k*10));
                miniBatch.size += 1
                miniBatch.numberInputs.push(numberInput);
                miniBatch.expecteds.push(createExpected(i))
            } 
        }
        trainMiniBatch(miniBatch, .1)
    }
    saveIt();
    testIt();

}

function saveIt() {
    let saveobj = {
        biases: biases,
        weights: weights
    }
    fs.writeFileSync(path.join(__dirname, "data", "model.json"), JSON.stringify(saveobj))
}

function loadIt() {
    let wjson = JSON.parse(fs.readFileSync(path.join(__dirname, "data", "weights.json")).toString())
    let bjson = JSON.parse(fs.readFileSync(path.join(__dirname, "data", "biases.json")).toString())
    biases[0] = math.matrix(bjson[0]);
    biases[1] = math.matrix(bjson[1]);
    biases[2] = math.matrix(bjson[2]);
    weights[0] = math.matrix(wjson[0]);
    weights[1] = math.matrix(wjson[1]);
    weights[2] = math.matrix(wjson[2]);
}

function testIt() {
    // console.log(getMax(feedforward(getNumberMatrix(0,900))))
    // console.log(getMax(feedforward(getNumberMatrix(1,900))))
    // console.log(getMax(feedforward(getNumberMatrix(2,900))))
    // console.log(getMax(feedforward(getNumberMatrix(3,900))))
    // console.log(getMax(feedforward(getNumberMatrix(4,900))))
    // console.log(getMax(feedforward(getNumberMatrix(5,900))))
    // console.log(getMax(feedforward(getNumberMatrix(6,900))))
    // console.log(getMax(feedforward(getNumberMatrix(7,900))))
    // console.log(getMax(feedforward(getNumberMatrix(8,900))))
    // console.log(getMax(feedforward(getNumberMatrix(9,900))))

    console.log(getMax(feedforward( math.transpose(math.matrix([data1[12930]])))))
    console.log(data2[12930])
    console.log(getMax(feedforward( math.transpose(math.matrix([data1[8296]])))))
    console.log(data2[8296])
    console.log(getMax(feedforward( math.transpose(math.matrix([data1[1295]])))))
    console.log(data2[1295])
    console.log(getMax(feedforward( math.transpose(math.matrix([data1[5294]])))))
    console.log(data2[5294])

}

function getMax(m) {
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

function feedforward(a) {
    // activations = [];
    // activations[0] = math.map(numberArray, sigmoid)
    // zs = [];
    // zs[0] = firstLayer(activations[0]);
    // activations[1] = math.map(zs[0], sigmoid)
    // zs[1] = secondLayer(activations[1])
    // activations[2]=math.map(zs[1], sigmoid);
    // zs[2] = thirdLayer(activations[2]);
    // activations[3]=math.map(zs[2], sigmoid);
    // return activations[3]
    for (let i = 0; i < biases.length; i++) {
        a = math.map(math.add(biases[i], math.multiply(weights[i], a)),sigmoid)
    }
    return a;
}

function createExpected(digit) {
    let arr = math.zeros(10)
    arr.set([digit], 1)
    return math.transpose(math.matrix([arr]));
}


function trainMiniBatch(miniBatch, learningRate) {
    /*miniBatch is an object of the form
    {
        size;
        numberInputs[] // array containing 28x28 arrays of num inputs
        expecteds[] // array containing vectors of the labeled number 
                    // of the corresponding input in the same index.
                    // [0,0,1,0,0,0,0,0,0,0] would be thelabel '2''
    }
    */
    let totalDelta_b = []
    let totalDelta_w = []
    totalDelta_b[0] = math.zeros(math.matrix([16, 1]));
    totalDelta_w[0] = math.zeros(math.matrix([16, 28*28]));
    totalDelta_b[1] = math.zeros(math.matrix([16, 1]));
    totalDelta_w[1] = math.zeros(math.matrix([16, 16]));
    totalDelta_b[2] = math.zeros(math.matrix([10, 1]));
    totalDelta_w[2] = math.zeros(math.matrix([10, 16]));

    for (let i = 0; i < miniBatch.size; i++) {
        x = math.map(miniBatch.numberInputs[i], (x)=>x/256)
        //x = miniBatch.numberInputs[i]
        y = miniBatch.expecteds[i]
        //console.log(x, y)
        backprop(x, y, totalDelta_b, totalDelta_w);
    }

    for (let i = 0; i < 3; i++) {
        weights[i] = math.map(weights[i], (v, j, m) => {
            return v - (learningRate / miniBatch.size)*totalDelta_w[i].get(j)
        })
        biases[i] = math.map(biases[i], (v, j, m) => {
            return v - (learningRate / miniBatch.size)*totalDelta_b[i].get(j)
        })
    }
    
}

function backprop(x, y, totalDelta_b, totalDelta_w) {
    let biasDelta = [[], [], []];
    let weightsDelta = [[], [], []]

    activations = [];
    activations[0] = x
    zs = [];
    zs[0] = firstLayer(x);

    activations[1] = math.map(zs[0], sigmoid)
    zs[1] = secondLayer(activations[1])
    activations[2]=math.map(zs[1], sigmoid);
    zs[2]=thirdLayer(activations[2]);
    activations[3]=math.map(zs[2], sigmoid);

   
    let cd = costDerivative(activations[3], y)
    let sd = math.map(zs[2], sigmoidDerivative)
    // element-wise multiplication
    let delta = math.map(cd, (v, i) => v * sd.get(i));
    biasDelta[2] = delta
    weightsDelta[2] = math.multiply(delta, math.transpose(activations[2]))


    sd = math.map(zs[1], sigmoidDerivative) //16 x 1
    delta = math.map(math.multiply(math.transpose(weights[2]), delta),
            (v, i) => v * sd.get(i));
    
    biasDelta[1] = delta;
    weightsDelta[1] = math.multiply(delta, math.transpose(activations[1]))

    sd = math.map(zs[0], sigmoidDerivative)//16x1
    delta = math.map(math.multiply(math.transpose(weights[1]), delta),
            (v, i) => v * sd.get(i));
    
    biasDelta[0] = delta;
    weightsDelta[0] = math.multiply(delta, math.transpose(activations[0]))

    for (let i = 0; i < 3; i++) {
        totalDelta_b[i] = math.add(biasDelta[i], totalDelta_b[i])
        totalDelta_w[i] = math.add(weightsDelta[i], totalDelta_w[i])
    }
}

function costDerivative(outputActivations, y) {
    return math.subtract(outputActivations, y);
}

function firstLayer(numberActivationsVector) {
    return math.add(biases[0], math.multiply(weights[0], numberActivationsVector))
}

function secondLayer(firstActivationVector) {
    return math.add(biases[1], math.multiply(weights[1], firstActivationVector))
}

function thirdLayer(secondActivationVector) {
    return math.add(biases[2], math.multiply(weights[2], secondActivationVector))
}

function sigmoid(a) { 
    return 1 / (1 + Math.pow(Math.E, -1*a))
}

function sigmoidDerivative(a) {
    return sigmoid(a) * (1-sigmoid(a))
}