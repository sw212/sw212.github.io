canvas = document.getElementById("mainCanvas")
canvas.width = document.body.clientWidth
canvas.height = document.body.clientHeight

class MCMC {
    constructor() {
        this.drawer = new Draw(canvas)
        this.dist = null
        this.algorithm = null
        this.chain = []

        this.wait = 10

        this.auto = false
    }

    setDist(dist) {
        this.dist = dist
        this.drawer.clear(this.drawer.densityCanvas)
        this.computeScaleDependent()
        this.resetChain()
    }

    setAlgo(algo) {
        if (this.algorithm) {
            this.algorithm.cleanUpGUI(this)
        }
        this.resetChain()

        this.algorithm = algo

        this.algorithm.GUI(this)
        this.drawer.drawCircle(this.drawer.chainCanvas, this.dist.init, "rgb(0,0,255)")
        this.drawer.drawNext()
    }

    resetChain() {
        this.drawer.animate = false
        this.drawer.drawList = []
        this.drawer.clear(this.drawer.chainCanvas)
        this.drawer.clear(this.drawer.flowCanvas)
        this.chain = [this.dist.init]
        this.drawer.drawCircle(this.drawer.chainCanvas, this.dist.init, "rgb(0,0,255)")
        this.drawer.drawNext()
    }

    computeScaleDependent() {
        const nx = this.dist.nx || 400
        const ny = this.dist.ny || 200
        const nz = this.dist.nz || 5

        var ratio = this.drawer.canvas.height / this.drawer.canvas.width

        var xs = linspace(this.dist.xlim[0], this.dist.xlim[1], nx)
        var ys = linspace(this.dist.xlim[0]*ratio, this.dist.xlim[1]*ratio, ny)

        var arr = []
        for (var j=0; j<ny; j++) {
            arr.push([])
            for (var i=0; i<nx; i++) {
                arr[j].push(this.dist.pdf([xs[i], ys[j]]))
            }
        }

        this.drawer.arr = arr
        this.drawer.arrT = transpose(arr)
        

        var max = d3.max(arr, function(a) {
            return d3.max(a)
        })
        
        var min = d3.min(arr, function(a) {
            return d3.min(a)
        })
        
        // from x, f(x) to canvas
        this.drawer.xScale = d3.scaleLinear()
            .domain([d3.min(xs), d3.max(xs)])
            .range([0, this.drawer.canvas.width])
        this.drawer.yScale = d3.scaleLinear()
            .domain([d3.min(ys), d3.max(ys)])
            .range([this.drawer.canvas.height,0])

        // from nx, ny to canvas
        this.drawer.xGridScale = d3.scaleLinear()
            .domain([0, nx])
            .range([0,this.drawer.canvas.width])
        this.drawer.yGridScale = d3.scaleLinear()
            .domain([0, ny])
            .range([this.drawer.canvas.height, 0])

        this.drawer.aScale = d3.scaleSqrt()
            .domain([0, max])
            .range([0, 255])

        var zs = linspace(min + 0.05*(max-min), max - 0.05*(max-min), nz)
        
        this.drawer.colourCanvas = document.createElement("canvas")
        this.drawer.colourCanvas.width = nx
        this.drawer.colourCanvas.height = ny
        var ctx = this.drawer.colourCanvas.getContext("2d")
        var image = ctx.createImageData(nx, ny)
        for (let j=0; j<ny; j++){
            for (let i=0; i<nx; i++){
                var index = 4 * (j*image.width + i) //rgba
                image.data[index] = 203
                image.data[index+1] = 106
                image.data[index+2] = 46
                image.data[index+3] = this.drawer.aScale(this.dist.pdf([xs[i], ys[ny-j-1]]))
            }
        }
        ctx.putImageData(image, 0, 0)

        var arr_flat = this.drawer.arr.flat()
        var contours_grid = d3.contours()
            .size([nx, ny])
            .thresholds(zs)
            (arr_flat)
        
        this.drawer.contours = []

        contours_grid.forEach( (path) => {
            this.drawer.contours.push(path.coordinates[0][0])
        })
        this.drawer.drawContourDensity()
    }

    resize() {
        var w = document.body.clientWidth
        var h = document.body.clientHeight

        this.drawer.canvas.width = w
        this.drawer.canvas.height = h

        this.drawer.densityCanvas.width = w
        this.drawer.densityCanvas.height = h

        this.drawer.chainCanvas.width = w
        this.drawer.chainCanvas.height = h

        this.drawer.flowCanvas.width = w
        this.drawer.flowCanvas.height = h

        this.drawer.clearAll()
        this.drawer.drawList = []
        this.drawer.animate = false
        this.drawer.xScale.range([0, w])
        this.drawer.yScale.range([h, 0])
        this.drawer.xGridScale.range([0, w])
        this.drawer.yGridScale.range([h, 0])
        this.drawer.drawContourDensity()

        this.chain.forEach(p => this.drawer.drawCircle(this.drawer.chainCanvas, p))
        this.drawer.drawCircle(this.drawer.chainCanvas, this.chain[this.chain.length - 1], "rgb(0,0,255)")
        this.drawer.drawNext()
    }

    next() {
        if (!this.drawer.drawList.length) {
            this.drawer.drawList = this.drawer.drawList.concat(this.algorithm.step(this))
        }
        this.drawer.processDrawList()
        this.drawer.drawNext()
    }

    play() {
        var self = this

        if (this.drawer.animate || this.auto) {
            this.next()
        }

        setTimeout(function () {
            requestAnimationFrame(function () {
                self.play()
            })
        }, this.wait)
    }
}


// Create instance //
mcmc = new MCMC()
const default_dist = "shuriken"
const default_algo = "HMC"


// GUI //
d3.select('body')
    .append('div')
    .attr('id', 'settings')


// Step button //
mcmc.stepButton = d3.select('#settings')
    .append('button')
    .text('Step')
    .attr('type', 'button')
    .attr('class', 'input')


// Reset button //
mcmc.resetButton = d3.select('#settings')
    .append('button')
    .text('Reset')
    .attr('type', 'button')
    .attr('class', 'input')


// Wait input //
var waitBox = d3.select('#settings')
    .append('span')
    .attr('class', 'input')

waitBox.append('label')
    .attr('for', 'waitbox')
    .text('Delay:')

mcmc.waitInput = waitBox.append('input')
    .attr('type', 'number')
    .attr('min', '0')
    .attr('value', mcmc.wait)
    .attr('style', 'width: 3em; margin-left: 5px')
    .attr('id', 'waitbox')


// Auto sample checkbox //
var autoBox = d3.select('#settings')
    .append('span')
    .attr('class', 'input')

autoBox.append('label')
    .attr('for', 'autobox')
    .text('Auto:')

mcmc.autoButton = autoBox.append('input')
    .attr('type', 'checkbox')
    .attr('style', 'margin-left: 5px; vertical-align: middle')
    .attr('id', 'autobox')


// Distribution select //
var distBox = d3.select('#settings')
    .append('span')
    .attr('class', 'input')

    distBox.append('label')
    .attr('for', 'distbox')
    .text('Distribution:')

mcmc.distSelect = distBox.append('select')
    .attr('style', 'margin-left: 5px')

const distList = Object.keys(distributions)

mcmc.distSelect.selectAll('myOptions')
        .data(distList)
    .enter()
        .append('option')
    .text(function(d) { return d })
    .attr('value', function(d) { return d })


// Algorithm select //
var algoBox = d3.select('#settings')
    .append('span')
    .attr('class', 'input')

algoBox.append('label')
    .attr('for', 'algobox')
    .text('Algorithm:')

mcmc.algoSelect = algoBox.append('select')
    .attr('style', 'margin-left: 5px')

const algoList = Object.keys(algorithms)

mcmc.algoSelect.selectAll('myOptions')
        .data(algoList)
    .enter()
        .append('option')
    .text(function(d) { return d })
    .attr('value', function(d) { return d })


// Init //
mcmc.setDist(distributions[default_dist])
mcmc.distSelect.property('value', default_dist)
mcmc.setAlgo(algorithms[default_algo])
mcmc.algoSelect.property('value', default_algo)
mcmc.play()


// Bindings //
mcmc.stepButton.on("click", function() {
    if (!mcmc.auto) {
        mcmc.next()
    }
})

mcmc.resetButton.on("click", function() {
    mcmc.resetChain()
})

mcmc.waitInput.on("change", function() {
    mcmc.wait = d3.select(this).property("value")
})

mcmc.autoButton.on("change", function() {
    mcmc.auto = d3.select(this).property("checked")
})

mcmc.distSelect.on('change', function() {
    var selectedDist = d3.select(this).property('value')
    mcmc.setDist(distributions[selectedDist])
})

mcmc.algoSelect.on('change', function() {
    var selectedAlgo = d3.select(this).property('value')
    mcmc.setAlgo(algorithms[selectedAlgo])
})

window.onresize = function () {
    mcmc.resize()
}

