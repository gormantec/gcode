import { Window, Document, Console } from "wasmdom";
import { Debug } from "wasmdom-globals";
import { PWA, PWAParams, Page, PageParams, Div, DivParams } from 'wasmdom';
import { Near, Account, NearConfig, Contract, BrowserLocalStorageKeyStore } from 'near-api-as';

var homePage: Page;
var secondPage: Page;
var aPWA: PWA;
var window: Window, document: Document, console: Console;

export function run(w: Window, d: Document, c: Console): i32 {
    window = w;
    document = d;
    console = c;
    homePage = new Page(<PageParams>{
        color: "white",
        backgroundColor: "black",
        backgroundPosition: "center",
        backgroundSize: "75%",
        backgroundRepeat: "no-repeat",
        backgroundImage: "url(https://c7.uihere.com/files/614/185/190/sun-solar-flare-uv-uv-light.jpg)"
    }); 

    secondPage = new Page(<PageParams>{
        color: "black",
        backgroundColor: "white",
        navigateBackPage: homePage,
        child: new Div(<DivParams>{ innerHTML: "url(https://gcode.com.au/html/test.html)" })
    });

    aPWA = new PWA(<PWAParams>{
        title: "Gorman Technology Pty Ltd",
        footer: "https://www.gormantec.com",
        primaryColor: "#005040",
    });

    aPWA.show(window);

    if (aPWA.floatingActionButton) {
        var d1: Div = <Div>aPWA.floatingActionButton;
        d1.onclick(function () {
            console.log("This will open a new page.");
            aPWA.setPage(secondPage);
        });
    }

    if (aPWA.pwaBody) {
        var d2: Div = <Div>aPWA.pwaBody;
        d2.style.backgroundColor = "black";
    }

    Debug.log("****************** homepage1: " + homePage.toString());
    window.setTimeout(function () {
        Debug.log("****************** homepage2: " + homePage.toString());
        aPWA.setPage(homePage);
    }, 1000);
    console.log('new javascript file!');

    window.setTimeout(function () {
        Debug.log(">>NEAR: ");
        var aKeyStore = new BrowserLocalStorageKeyStore();
        const config = new NearConfig(aKeyStore, "testnet", "hello.gormantec.testnet");
        const near = new Near(config);
        const account = new Account(near.connection, "hello.gormantec.testnet");
        const mycontract = new Contract(account, "hello.gormantec.testnet", { viewMethods: ["getGreeting"] });
        mycontract.exec({ methodName: "getGreeting", paramaters: '{"accountId":"hello.gormantec.testnet"}' }).thenString((text:string)=>{
            Debug.log(">>NEAR: result:"+text);
            Debug.log(">>NEAR: text:"+Contract.decodeResult(text));

        });
        Debug.log(">>NEAR: Contract");
    }, 5000);



    return 0;

}
