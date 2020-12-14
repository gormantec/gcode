import { Window, Document, Debug, Console } from "../dom/document";
import { PWA, PWAParams, Page, PageParams, Div, DivParams } from '../pwa/pwa';

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
    return 0;

}
