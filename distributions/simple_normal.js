distributions["simple_normal"] = {
    pdf: (x) => {
        const c = 1 / (2 * Math.PI)
        return c * Math.exp(-0.5 * (x[0]**2 + x[1]**2))
    },

    logPdf: (x) => {
        const c = -Math.log(2 * Math.PI)
        return c - 0.5*(x[0]**2 + x[1]**2)
    },

    logGradPdf: (x) => {
        return [-x[0], -x[1]]
    },

    xlim: [-5, 5],
    init: [0, 0]
}