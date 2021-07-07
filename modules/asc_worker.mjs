importScripts("https://cdn.jsdelivr.net/npm/assemblyscript@latest/dist/sdk.js");

console.log(asc);

onmessage = function (e) {

    console.log("worker 1: "+e.data);

}



