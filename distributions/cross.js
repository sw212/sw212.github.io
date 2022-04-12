distributions["cross"] = {
    xlim: [-3, 3],
    init: [0, 0],
    nx: 350,
    ny: 200,

    f: (x, c) => {
        const exponent = ((x[0]**2) - 2*c*x[0]*x[1] + (x[1]**2)) / (1-c**2)
        return Math.exp(-exponent)
    },

    df: (x, c) => {
        return -1*((2*x[0] - 2*c*x[1]) / (1-c**2))*distributions.cross.f(x, c)
    },

    pdf: (x) => {
        return distributions.cross.f(x, 0.99) + distributions.cross.f(x, -0.99)
    },

    logPdf: (x) => {
        return Math.log(distributions.cross.pdf(x))
    },

    logGradPdf: (x) => {
        const xnew = [x[1], x[0]]
        const d = distributions.cross.pdf(x)
        // note f is symmetric so df(xnew) will return correct value
        return [(distributions.cross.df(x, 0.99) + distributions.cross.df(x, -0.99))/d,
                (distributions.cross.df(xnew, 0.99) + distributions.cross.df(xnew, -0.99))/d] 
    }
}  

 