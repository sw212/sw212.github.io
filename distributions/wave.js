distributions["wave"] = {
    c: 12,
    s: 3,
    xlim: [-8, 8],
    init: [0, 0],
    nx: 700,
    ny: 400,
    nz: 4,

    pdf: (x) => {
        return Math.exp(-distributions.wave.c*((0.5*x[1] - Math.sin(x[0]))**2 ) - (x[0]/distributions.wave.s)**2)
    },

    logPdf: (x) => {
        return -distributions.wave.c*((0.5*x[1] - Math.sin(x[0]))**2 ) - (x[0]/distributions.wave.s)**2
    },

    logGradPdf: (x) => {
        return [2*distributions.wave.c*Math.cos(x[0])*(0.5*x[1] - Math.sin(x[0])) - 2*x[0]/(distributions.wave.s**2),
                distributions.wave.c*(Math.sin(x[0]) - 0.5*x[1])]
    }
} 