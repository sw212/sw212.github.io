distributions["circle"] = {
    r0: 3,
    scale: 0.2,

    pdf: (x) => {
        return Math.exp((Math.sqrt(x[0]**2 + x[1]**2) - distributions.circle.r0)**2 / (-2*(distributions.circle.scale**2)))
    },

    logPdf: (x) => {
        return (Math.sqrt(x[0]**2 + x[1]**2) - distributions.circle.r0)**2 / (-2*(distributions.circle.scale**2))
    },

    logGradPdf: (x) => {
        const r = Math.sqrt(x[0]**2 + x[1]**2)
        const c = ((distributions.circle.r0 / r) - 1) / (distributions.circle.scale**2)

        return [x[0]*c, x[1]*c]
    },

    xlim: [-7, 7],
    init: [3, 0],
    nz: 3
}