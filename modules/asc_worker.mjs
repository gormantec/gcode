importScripts("https://cdnjs.cloudflare.com/ajax/libs/require.js/2.3.6/require.min.js");

//console.log(require);

onmessage = function (e) {

    console.log("worker 1: "+e.data);
    require(["https://cdn.jsdelivr.net/npm/assemblyscript@latest/dist/sdk.js"], ({ asc }) => {

    });

}



