const getRequire = getScript('https://cdnjs.cloudflare.com/ajax/libs/require.js/2.3.6/require.min.js', ["require"]);

onmessage = function (e) {

    console.log("worker 1: "+e.data);
    getRequire.then(({ require }) => {
        require(["https://cdn.jsdelivr.net/npm/assemblyscript@latest/dist/sdk.js"], ({ asc }) => {
            console.log("worker 2");
        });
    });
}