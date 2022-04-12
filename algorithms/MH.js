algorithms["MH"] = {
    scale: 1,

    step: function(self) {
        var curr = self.chain[self.chain.length - 1]
        self.drawer.curr = curr
        var prop = [...curr]
        var drawSeq = []

        prop[0] += randn()*this.scale
        prop[1] += randn()*this.scale

        const acc = self.dist.pdf(prop) / self.dist.pdf(curr)

        if (Math.random() < acc) {
            self.chain.push(prop)
            drawSeq.push({
                id: 'proposal',
                accept: true,
                pos: prop
            })
            
        } else {
            self.chain.push(curr)
            drawSeq.push({
                id: 'proposal',
                accept: false,
                pos: prop
            })
            drawSeq.push( {id: 'clearFlow' } )
        }

        return drawSeq
    },

    GUI: function(self) {
        self.sigmaBox = d3.select('#settings')
            .append('span')
            .attr('class', 'input')

        self.sigmaBox.append('label')
            .attr('for', 'sigmabox')
            .text('Variance:')

        self.sigmaInput = self.sigmaBox.append('input')
            .attr('type', 'number')
            .attr('min', '0')
            .attr('value', this.scale)
            .attr('style', 'width: 3em; margin-left: 5px')
            .attr('id', 'sigmabox')

        self.sigmaInput.on("change", function() {
            algorithms['MH'].scale = d3.select(this).property("value")
            self.resetChain()
        })
    },

    cleanUpGUI: function(self) {
        self.sigmaBox.remove()
    }
}