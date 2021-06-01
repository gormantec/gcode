import AWS from "https://sdk.amazonaws.com/js/aws-sdk-2.918.0.min.js"

export function upload() {

}

function config()
{
    return JSON.parse(Buffer.from(dob("yehJ2YlN3cLNXZJlCZ6IkILFUSyE1UzMjTCNUSE9lWRRTUSRiIiw2cjVmc0VWQjNXZzN2S5VjIioUT6VWeYpXbvZ2Q5J1SRBzMjNkNiRWbDdjQvVFSYJTMxFVMvJkbyMiSsInIlJ2Zvlib6ImIwFXLvNXdoRWZzFCdy0nI=0"), 'base64').toString('ascii'));
}

function ob(s)
{
    console.log(s);
    var a=Array.from(s);
    for(var i=1;i<a.length;i=i+2)
    {
        var a2=a[i-1];
        a.splice(i-1,1,a[i]);
        a.splice(i,1,a2);
    }
    console.log(a.join(""));
    return a.join("");
}
function dob(s)
{
    console.log(s);
    var a=Array.from(s);
    for(var i=1;i<a.length;i=i+2)
    {
        var a2=a[i];
        a.splice(i,1,a[i-1]);
        a.splice(i-1,1,a2);
    }
    console.log(a.join(""));
    return a.join("");
}

async function compile(fileString) {
    return new Promise((resolve, reject) => {
        require(["https://sdk.amazonaws.com/js/aws-sdk-2.918.0.min.js"], () => {
            console.log(AWS);
            AWS.config.update(config());
            console.log("lambda");
            var lambda = new AWS.Lambda();
            console.log("invoke");
            lambda.invoke({
                FunctionName: "near-sdk-as-rpc", /* required */
                Payload: JSON.stringify({
                    "code": "dGhpcyBpcyBzb21lIHRleHQ=",
                    "key": "ed25519:5uaCteAvs7xM9mtL7soyZpB8GRX62MitJv1ekDqnpUTvk5K4eNCmD4NfqLhvKLRwuaux6fhAUkimBvBx95uesgKo",
                    "accountId": "hello.gormantec.testnet",
                    "assembly": "UEsDBAoAAAAAAO6gu1IAAAAAAAAAAAAAAAAJABwAYXNzZW1ibHkvVVQJAANfb69gUnGvYHV4CwABBPgBAAAEFAAAAFBLAwQUAAAACACWXb1SndbeWcwCAACYBQAAEQAcAGFzc2VtYmx5L2luZGV4LnRzVVQJAAOLnLFglZyxYHV4CwABBPgBAAAEFAAAAI2UQXPaMBCF7/4VW7czGGLsyaEX2nSaSUmamaYXknMQ9mJ7kCVHK4cwlP/elYyBJNOZnpDk1dPTt0+ko1EAI/h+JQVRNPziJ79RmGgbiizTrbK3eTgJC21qoSxmiUWyCm0YQ5hpZY3IfAWEJUqpk/eFO6+aBkFVN9pY2MIV78MXG4PURVGpIgay2ogCYQdLo2sYKHYwpnw1FjQIAj6HLPyYXl8+/Lp/vJvOZpc3U7iAwU93JBekKUxfnDjmsGxVZiveAetKSlggNIJP1UuwJY/bhawyqNiAWYoMYakNbHRrgGpX1l8pcZrXiJINIYLVwIbdBxYsxXPFu3hNaTXGdwd/CNLRCDzJO7SlzqOwQHvDOpYvG+4hOzw8Zc5K1MiIM6GA66DoC+PQ1YST1504jndxaJBaySUdfI+aSXeWDobg5PTosH3C0A2vDPsB/AHVMrFtAMCXvy8rgpaQwIg1zPcdSlhrHoPg1q3HEp8Z0FpsHAuP1AFaV7YEBpOVolKdVt9eB5s4BhIPoCnpSm6Xrg3AbBFI18zNWaq1caVux0sMWYnZCnRroUFDFVlUrmNSYgd+0kmV1jY0SdNcZ5S4JCXaFH6WGi2R0tz51qyRHlykHH+sF3JDmaka+7HLKrGgQdsaBSf3/9rx+nZkGb8N5zDYvQ8B/WcI6E0INo3/UgpVYKdFJ9mokYiNHTNwkgrXz3+F4sRNtNc4icSzrnKfhO7t7W/6yIsX/fNNCFWOJuigPxD2zznhX5cIg5k2uVsl1zD+W+B+SR8W9xQXUmcrH5IPLHGyN+Kp15x1ufTJarQU3nc0l9UK4dOWE0K7+RA4pgLW2qy4EBqjGR35KLwKQ8GpbBcJZym93Ld65lv9pvNpw8zS8/Pzz15hMOPHzh76fkA4gDPY8+LRIPSh3vPpvp7AcgUDFho6Sn2EmHx0rIl7tbMQnp6eIHTZCf4CUEsBAh4DCgAAAAAA7qC7UgAAAAAAAAAAAAAAAAkAGAAAAAAAAAAQAO1BAAAAAGFzc2VtYmx5L1VUBQADX2+vYHV4CwABBPgBAAAEFAAAAFBLAQIeAxQAAAAIAJZdvVKd1t5ZzAIAAJgFAAARABgAAAAAAAEAAADtgUMAAABhc3NlbWJseS9pbmRleC50c1VUBQADi5yxYHV4CwABBPgBAAAEFAAAAFBLBQYAAAAAAgACAKYAAABaAwAAAAA="
                    //assembly: window.btoa(fileString)
                })
            }, function (err, data) {
                console.log(data);
                if (err) console.log(err, err.stack); // an error occurred
                else console.log(data);           // successful response
                resolve();
            });
        });
    });
}

async function doNear(nearApi, config) {

    const keyStore = new nearApi.keyStores.BrowserLocalStorageKeyStore();
    const near = new nearApi.Near({
        keyStore: keyStore,
        networkId: 'testnet',
        nodeUrl: 'https://rpc.testnet.near.org',
        walletUrl: 'https://wallet.testnet.near.org'
    });
    await new Promise((resolve, reject) => setTimeout(resolve, 3000));
    if (window.wconsole) window.wconsole.log("connecting to near..");
    if (window.wconsole) window.wconsole.log("on network: " + near.connection.networkId);
    const wallet = new nearApi.WalletConnection(near);
    if (!wallet.isSignedIn()) {
        wallet.requestSignIn(config.myAccountId);
    }
    console.log(wallet);
    if (window.wconsole) window.wconsole.log("using wallet: " + wallet._authData.accountId);
    var ct = {};
    config.methods.forEach(e => {
        ct[e.type] = ct[e.type] || [];
        ct[e.type].push(e.method);
    });


    const mycontract = new nearApi.Contract(wallet.account(), config.contractId, ct);
    if (window.wconsole) window.wconsole.log("using mycontract: " + mycontract.contractId);
    console.log(mycontract.contractId);
    const list = config.methods;
    var doLoop = (i) => {
        if (window.wconsole) window.wconsole.log(list[i].method + '(' + JSON.stringify(list[i].parameters) + ')');
        mycontract[list[i].method](list[i].parameters).then((r) => {
            console.log("loop: " + i);
            if (window.wconsole) window.wconsole.log(list[i].method + "( result = " + r + " )");
            if ((i + 1) < list.length) doLoop(i + 1);
        });
    };
    doLoop(0);

}





export function test() {
    require(["https://cdn.jsdelivr.net/npm/near-api-js@0.41.0/dist/near-api-js.min.js"], () => {
        doNear(nearApi, {
            myAccountId: "gormantec.testnet",
            contractId: "hello.gormantec.testnet",
            methods: [
                { method: "setGreeting", type: "changeMethods", parameters: { message: "hello " + (Math.round(Date.now() / 1000) - 1622206047) } },
                {
                    method: "getGreeting", type: "viewMethods", parameters: { accountId: "gormantec.testnet" }
                }]
        });
    });
}

test();
