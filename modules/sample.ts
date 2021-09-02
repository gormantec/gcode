import { Window, Document, Console, PWA, PWAParams, Page, PageParams, Div, DivParams } from 'wasmdom';
import { Debug,JSObject } from "wasmdom-globals";
import { Near, Account, NearConfig, Contract, BrowserLocalStorageKeyStore } from 'near-api-as';

var homePage: Page;
var secondPage: Page;
var aPWA: PWA;
var window: Window, document: Document, console: Console;
var mycontract: Contract;
var accountId: string = "gcode-ed342d45a5f.testnet";

export function run(w: Window, d: Document, c: Console): i32 {
    window = w;
    document = d;
    console = c;
    homePage = new Page( < PageParams > {
        color: "white",
        backgroundColor: "black",
        backgroundPosition: "center",
        backgroundSize: "75%",
        backgroundRepeat: "no-repeat",
        backgroundImage: "url(https://c7.uihere.com/files/614/185/190/sun-solar-flare-uv-uv-light.jpg)"
    });

    secondPage = new Page( < PageParams > {
        color: "black",
        backgroundColor: "white",
        navigateBackPage: homePage,
        child: new Div( < DivParams > {
            innerHTML: "url(https://gcode.com.au/html/test.html)"
        })
    });

    aPWA = new PWA( < PWAParams > {
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

    initContract(5000);
    return 0;

}

function setBlackPage(html: string): void {
    aPWA.setPage(new Page( < PageParams > {
        navigateBackPage: homePage,
        child: new Div( < DivParams > {
            innerHTML: html
        })
    }));
}

function initContract(delay: i32): void {
    window.setTimeout(function() {
        setBlackPage("<p> Contract Request: " + accountId + "</p>");
        var aKeyStore = new BrowserLocalStorageKeyStore();
        const config = new NearConfig(aKeyStore, "testnet", accountId);
        const near = new Near(config);
        const newAccount = new Account(near.connection, accountId);
        newAccount.then((account) => {
            mycontract = new Contract(account, "hello.gormantec.testnet", {
                viewMethods: ["getGreeting"],
                changeMethods: ["setGreeting"]
            });
            mycontract.then((contract) => {
                let getGreeting = contract.method("getGreeting");
                console.log("getGreeting:call");
                getGreeting.exec('{"accountId":"' + contract.account.accountId + '"}')
                    .thenString((text: string) => {
                        console.log("getGreeting:response");
                        setBlackPage("<p> Contract Response: " + text + "</p>");
                        return null;
                    });
                getGreeting.wait();
                let setGreeting = contract.method("setGreeting");
                console.log("setGreeting:call");
                setGreeting.exec('{"message":"test message two"}')
                    .thenString((text: string) => {
                        console.log("setGreeting:response");
                        setBlackPage("<p> setGreeting response: " + text + "</p>");
                        return null;
                    });
                setGreeting.wait();
            });
        });
    }, delay)
}
