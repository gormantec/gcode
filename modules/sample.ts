
import { Window, Document, Console, PWA, PWAParams, Page, PageParams, Div, DivParams } from 'wasmdom';
import { Debug } from "wasmdom-globals";
import { Near, Account, NearConfig, Contract, BrowserLocalStorageKeyStore } from 'near-api-as';

var homePage: Page;
var secondPage: Page;
var aPWA: PWA;
var window: Window, document: Document, console: Console;
var mycontract: Contract;

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
        var d1: Div = < Div > aPWA.floatingActionButton;
        d1.onclick(function() {
            Debug.log("Opening a new page");
            aPWA.setPage(secondPage);
        });
    }

    if (aPWA.pwaBody) {
        var d2: Div = < Div > aPWA.pwaBody;
        d2.style.backgroundColor = "black";
    }

    window.setTimeout(function() {
        Debug.log("Homepage: loaded");
        aPWA.setPage(homePage);
    }, 1000);

    initContract(2000);
    callContract(5000);
    return 0;

}

function initContract(delay: i32): void {
    window.setTimeout(function() {
        var accountId = "hello.gormantec.testnet";
        setBlackPage("<p> Contract Request: " + accountId + "</p>");
        var aKeyStore = new BrowserLocalStorageKeyStore();
        const config = new NearConfig(aKeyStore, "testnet", accountId);
        const near = new Near(config);
        const account = new Account(near.connection, accountId);
        mycontract = new Contract(account, accountId, {
            viewMethods: ["getGreeting"],
            changeMethods: ["setGreeting"]
        });
    }, delay)
}


function callContract(delay: i32): void {
    window.setTimeout(function() {
        if (mycontract) {
            mycontract.exec({
                    methodName: "getGreeting",
                    paramaters: '{"accountId":"' + accountId + '"}'
                })
                .thenString((text: string) => {
                    //text = Contract.decodeResult(text);
                    setBlackPage("<p> Contract Response: " + text + "</p>");
                    return null;
                });
            mycontract.exec({
                    methodName: "setGreeting",
                    paramaters: '{"message":"test message"}'
                })
                .thenString((text: string) => {
                    //text = Contract.decodeResult(text);
                    setBlackPage("<p> Contract Response: " + text + "</p>");
                    return null;
                });
        }
    }, delay);
}

function setBlackPage(html: string): void {
    aPWA.setPage(new Page( < PageParams > {
        navigateBackPage: homePage,
        child: new Div( < DivParams > {
            innerHTML: html
        })
    }));
}