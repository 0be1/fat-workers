import PromiseWorker from 'promise-worker.min';

// each call returns the same promised worker
function worker_singleton() {
    var worker = new Worker('giac_worker.js');

    var promiseWorker = new PromiseWorker(worker);
    
    return function() {
        return promiseWorker;
    }
}

// each call returns a new promised worker
function workers() {
    return function() {
        var worker = new Worker('giac_worker.js');

        var promiseWorker = new PromiseWorker(worker);
        return promiseWorker;
    }
}

require(['domReady!'], function(doc) {
    function disable(button) {
        button.disabled = true;
        button.textContent = 'Processing...';
    }
    
    function enable(button) {
        button.disabled = false;
        button.textContent = 'Go!';
    }
    
    function process(promise) {
        return function(event) {
            var button = event.target,
                table = button.previousElementSibling,
                status = button.nextElementSibling;

            disable(button);

            var giac_nodes = table.querySelectorAll('tbody tr td:first-child');

            var promises = [],
                start_t = performance.now();

            let n_worker = giac_nodes.length;

            for(let n=0; n < n_worker; n++) {
                const el = giac_nodes[n],
                    expr = el.textContent,
                    result = el.nextElementSibling,
                    processing_t = result.nextElementSibling;

                result.textContent = 'Processing...';

                promises.push(promise().postMessage(expr).then(function(msg) {
                    result.className = "success";
                    result.textContent = msg.result;
                    processing_t.textContent = msg.processing_t;
                })
                .catch(function(err) {
                    result.className = "error";
                    result.textContent = err.message;
                }));
            }

            Promise.all(promises).then(function() {
                const end_t = performance.now();

                status.textContent = `Algebra processed in ${ Math.round(end_t - start_t) } ms`;

                enable(button);
            });
        };
    }
    
    doc.querySelector('button#multiple').onclick = process(workers());
    
    doc.querySelector('button#single').onclick = process(worker_singleton());
});