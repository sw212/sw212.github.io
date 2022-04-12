algorithms["HMC"] = {
    leaps: 10,

    stepSize: 0.1,

    step: function(self) {
        var curr = self.chain[self.chain.length - 1]
        self.drawer.curr = curr
        var currP = [randn(), randn()]
        var currH = -self.dist.logPdf(curr) + 0.5*(currP[0]**2 + currP[1]**2)

        var prop = [...curr]
        var p = [...currP]

        var drawSeq = []

        for (let i=0; i<this.leaps; i++) {
            var grads = self.dist.logGradPdf(prop)
            p[0] += 0.5*this.stepSize*grads[0]
            p[1] += 0.5*this.stepSize*grads[1]

            var from = [...prop]
            prop[0] += this.stepSize*p[0]
            prop[1] += this.stepSize*p[1]
            drawSeq.push({
                id: "leap",
                from: [...from],
                to: [...prop]
            })

            var grads = self.dist.logGradPdf(prop)
            p[0] += 0.5*this.stepSize*grads[0]
            p[1] += 0.5*this.stepSize*grads[1]
        }
        var H = -self.dist.logPdf(prop) + 0.5*(p[0]**2 + p[1]**2)

        const acc = currH - H

        if (Math.log(Math.random()) < acc) {
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
        }

        drawSeq.push( {id: 'clearFlow' } )

        return drawSeq
    },

    GUI: function(self) {
        // Leap Input //
        self.leapBox = d3.select('#settings')
            .append('span')
            .attr('class', 'input')

        self.leapBox.append('label')
            .attr('for', 'leapbox')
            .text('Leaps:')

        self.leapInput = self.leapBox.append('input')
            .attr('type', 'number')
            .attr('min', '0')
            .attr('value', this.leaps)
            .attr('style', 'width: 3em; margin-left: 5px')
            .attr('id', 'leapbox')

        // Step Size Input //
        self.stepSizeBox = d3.select('#settings')
            .append('span')
            .attr('class', 'input')

        self.stepSizeBox.append('label')
            .attr('for', 'stepsizebox')
            .text('Step Size:')

        self.stepSizeInput = self.stepSizeBox.append('input')
            .attr('type', 'number')
            .attr('min', '0')
            .attr('value', this.stepSize)
            .attr('step', 0.1)
            .attr('style', 'width: 3em; margin-left: 5px')
            .attr('id', 'stepsizebox')
        

        // Bindings //
        self.leapInput.on("change", function() {
            algorithms['HMC'].leaps = d3.select(this).property("value")
            self.resetChain()
        })
        
        self.stepSizeInput.on("change", function() {
            algorithms['HMC'].stepSize = d3.select(this).property("value")
            self.resetChain()
        })
    },
    
    cleanUpGUI: function(self) {
        self.leapBox.remove()
        self.stepSizeBox.remove()
    }
}