var Module = {
    worker:true,
    preRun: [],
    postRun: [],
    print: function(text) {
        if (text && text.trim()) {
            this.error = text;
        }
    },
    printErr: function(text) {
        console.debug(text);
    },
    canvas:0,
};

function getRandomInt(min, max) {
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min)) + min;
}

function formatInterval(ms) {
    var s = Math.floor(ms / 1000), ms = Math.round(ms %1000);

    return `${s} s ${ms} ms`;
}

const start_t = performance.now();

const id = getRandomInt(1,100);

console.debug(`worker ${id} starting...`);

importScripts('promise-worker.register.min.js', 'giac.js');

var caseval = Module.cwrap('caseval',  'string', ['string']);

registerPromiseWorker(function (expr) {
    console.debug(`worker ${id } receive ${expr}`);
    
    if (!expr)
        return;
    
    const start_t = performance.now();
    
    const result = caseval(expr);
    
    if (Module.error) {
        let error = Module.error;
        delete Module.error;
        throw new Error(error);
    }
    
    const end_t = performance.now();
    
    const processing_t = Math.round(end_t - start_t);
    
    console.debug(`worker ${id} post result ${result} after ${processing_t} ms`);
    
    return { result: result, processing_t: processing_t };
});

let interval_ms = formatInterval(performance.now() - start_t);

console.debug(`worker ${id} listening in ${ interval_ms }`);
