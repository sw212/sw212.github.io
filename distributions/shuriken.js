distributions["shuriken"] = {
    c: 12,
    s: 3,
    xlim: [-8, 8],
    init: [0, 0],
    nx: 700,
    ny: 400,
    nz: 7,

    pdf: (x) => {
        xnew = [x[1], -x[0]]
        return distributions.wave.pdf(x) + distributions.wave.pdf(xnew)
    },

    logPdf: (x) => {
        return Math.log(distributions.shuriken.pdf(x))
    },

    logGradPdf: (x) => {
        const xnew = [x[1], -x[0]]
        const f = distributions.wave.pdf(x),
              fnew = distributions.wave.pdf(xnew),
              df = distributions.wave.logGradPdf(x),
              dfnew = distributions.wave.logGradPdf(xnew)
        
        return [(df[0]*f - dfnew[1]*fnew)/(f + fnew),
                (df[1]*f + dfnew[0]*fnew)/(f + fnew)]
    }
} 