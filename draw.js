class Draw {
    constructor(canvas) {
        this.canvas = canvas

        this.densityCanvas = document.createElement("canvas")
        this.densityCanvas.width = this.canvas.width
        this.densityCanvas.height = this.canvas.height

        this.chainCanvas = document.createElement("canvas")
        this.chainCanvas.width = this.canvas.width
        this.chainCanvas.height = this.canvas.height

        this.flowCanvas = document.createElement("canvas")
        this.flowCanvas.width = this.canvas.width
        this.flowCanvas.height = this.canvas.height 

        this.drawList = []

        this.xGridScale = null
        this.yGridScale = null
        this.xScale = null
        this.yScale = null
        this.aScale = null

        this.arr = null
        this.arrT = null
        this.contours = null

        this.curr = null

        this.animate = false
    }

    processDrawList(){
        var drawJob = this.drawList.shift()

        if (drawJob.id == "leap") {
            this.animate = true
            this.drawPath(this.flowCanvas, drawJob.from, drawJob.to)
        }

        if (drawJob.id == "proposal") {
            if (drawJob.accept) {
                this.drawCircle(this.chainCanvas, drawJob.pos, "rgb(0,0,255)")
                this.drawCircle(this.chainCanvas, this.curr)
            } else {
                this.animate = false
                this.drawCircle(this.flowCanvas, drawJob.pos, "rgb(255,0,0)")
            }
        }

        if (drawJob.id == "clearFlow") {
            this.animate = false
            this.flowCanvas.getContext("2d").clearRect(0, 0, this.flowCanvas.width, this.flowCanvas.height)
        }

    }

    drawContourDensity() {
        var ctx = this.densityCanvas.getContext("2d")
        ctx.drawImage(this.colourCanvas, 0, 0, this.colourCanvas.width, this.colourCanvas.height, 0, 0, this.densityCanvas.width, this.densityCanvas.height)

        var opacity = linspace(0.1, 0.4, this.contours.length)
        this.contours.forEach( (arr, ci) => {
            ctx.beginPath()
            ctx.strokeStyle = "rgba(0,0,0," + opacity[ci] + ")"
            for (var i=0; i<arr.length-1; i++) {
                ctx.moveTo(this.xGridScale(arr[i][0]), this.yGridScale(arr[i][1]))
                ctx.lineTo(this.xGridScale(arr[i+1][0]), this.yGridScale(arr[i+1][1]))
            }
            ctx.stroke()
        })
    }

    drawCircle(canvas, pos, colour) {
        var ctx = canvas.getContext("2d")

        colour = colour || "black"
        ctx.strokeStyle = colour
        ctx.fillStyle = colour
        
        var px = this.xScale(pos[0])
        var py = this.yScale(pos[1])

        ctx.beginPath()
        ctx.arc(px, py, 3, 0, 2 * Math.PI,true)
        ctx.fill()
        ctx.stroke()
    }

    drawPath(canvas, from, to, colour) {
        var ctx = canvas.getContext("2d")

        colour = colour || "black"
        ctx.strokeStyle = colour

        ctx.beginPath()
        ctx.moveTo(this.xScale(from[0]), this.yScale(from[1]))
        ctx.lineTo(this.xScale(to[0]), this.yScale(to[1]))
        ctx.stroke()
    }

    drawNext() {
        var ctx = this.canvas.getContext("2d")

        ctx.clearRect(0, 0, this.canvas.width, this.canvas.height)
        ctx.drawImage(this.densityCanvas, 0, 0)
        ctx.drawImage(this.chainCanvas, 0, 0)
        ctx.drawImage(this.flowCanvas, 0, 0)
    }

    clear(canvas) {
        var ctx = canvas.getContext("2d")
        ctx.clearRect(0, 0, canvas.width, canvas.height)
    }

    clearAll() {
        this.clear(this.densityCanvas)
        this.clear(this.chainCanvas)
        this.clear(this.flowCanvas)
    }
}