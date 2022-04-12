distributions["funnel"] = {
    f: (x, c) => {
        return -0.5*Math.log(2 * Math.PI) - Math.log(c) - 0.5*((x/c)**2)
    },

    del_x: (x, c) => {
        return -x / c**2 
    },

    del_v: (x, c) => {
        return (x+c)*(x-c)/(c**3)
    },
    xlim: [-10, 10],
    init: [0, 0]
}

distributions.funnel.logPdf = function(x) {
    return distributions.funnel.f(x[1], 3) + distributions.funnel.f(x[0], Math.exp(x[1]/2)) //not Math.exp(x[0]) because c in f(x, c) is in terms of s.d.
}

distributions.funnel.logGradPdf = function(x) {
    return [distributions.funnel.del_x(x[0], Math.exp(x[1]/2)),
    distributions.funnel.del_x(x[1], 3) + 0.5*distributions.funnel.del_v(x[0], Math.exp(x[1]/2))*Math.exp(x[1]/2)]
}

distributions.funnel.pdf = function(x) {
    return Math.exp(distributions.funnel.logPdf(x))
}
