function transpose(arr) {
    return arr.reduce((prev, next) => next.map((item, i) =>
      (prev[i] || []).concat(next[i])
    ), [])
  }


function linspace(start, stop, n) {
    var arr = []
    var step = (stop - start) / (n - 1)
    for (var i = 0; i<n; i++) {
        arr.push(start + (i*step))
    }
    return arr
  }


function randn() {
    var u = 0, v = 0;
    while(u === 0) u = Math.random()
    while(v === 0) v = Math.random()
    return Math.sqrt( -2.0 * Math.log( u ) ) * Math.cos( 2.0 * Math.PI * v )
}