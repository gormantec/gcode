const getRequire = getScript('https://cdnjs.cloudflare.com/ajax/libs/require.js/2.3.6/require.min.js', ["require"]);

onmessage = function (e) {

    console.log("worker 1: "+e.data);
    getRequire.then(({ require }) => {
        require(["https://cdn.jsdelivr.net/npm/assemblyscript@latest/dist/sdk.js"], ({ asc }) => {
            console.log("worker 2");
        });
    });
}


/** FUNCTIONS */
async function getScript(src, objects) {
    return new Promise((resolve, reject) => {
        var script = window.document.createElement('script');
        script.type = 'text/javascript';
        script.src = src;
        script.async = 'true';
        script.id = cyrb53(src);
        var exists = document.getElementById(script.id);
        if (exists) {
            if (resolved[script.id]) {
                resolve(resolved[script.id]);
            }
            else {
                document.getElementById(script.id).addEventListener('load', function () {
                    var o = {};
                    if (objects && objects.length > 0) {
                        objects.forEach((o1) => {
                            o[o1] = window[o1];
                        })
                    }
                    resolved[script.id] = o;
                    resolve(o);
                });
            }
        }
        else {
            document.getElementsByTagName('head')[0].appendChild(script);
            script.addEventListener('load', function () {
                var o = {};
                if (objects && objects.length > 0) {
                    objects.forEach((o1) => {
                        o[o1] = window[o1];
                    })
                }
                resolved[script.id] = o;
                resolve(o);
            });
        }
    });
}