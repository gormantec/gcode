import { PWA, Page, Div } from 'https://gcode.com.au/modules/pwa.mjs';
import { login, contract } from "https://gcode.com.au/modules/near/index.mjs";

var homePage = new Page({
  color: "white",
  backgroundColor: "black",
  backgroundPosition: "center",
  backgroundSize: "75%",
  backgroundRepeat: "no-repeat",
  backgroundImage: "url(https://c7.uihere.com/files/614/185/190/sun-solar-flare-uv-uv-light.jpg)"
});

var secondPage = new Page({
  color: "black",
  backgroundColor: "white",
  navigateBackPage: homePage,
  child: new Div({ innerHTML: "url(https://gcode.com.au/html/test.html)" })
});

var aPWA = new PWA({
  title: "Gorman Technology Pty Ltd",
  footer: "https://www.gormantec.com",
  primaryColor: "#005040",
});

aPWA.show();

aPWA.floatingActionButton.onclick(function () {
  console.log("This will open a new page.");
  aPWA.setPage(secondPage);
});

aPWA.pwaBody.style.backgroundColor = "black";

window.setTimeout(function () {
  aPWA.setPage(homePage);
  console.log('PAGE LOADED!');
}, 1000);

window.setTimeout(function () {
  /* example backend dApp calling hello.gormantec.testnet */
  const myID = "gcode-ec45c15fa75.testnet";
  const targetContract = "home.gormantec.testnet";
  const errors=(e)=>{aPWA.alert("<u><b>Error</b></u><p>"+e+"</p>");};
  login({ accountId: myID, contractId: targetContract }).then((config) => {
    aPWA.alert("<u><b>Logged into NEAR testnet</b>");
    config.methods = ["*getGreeting", "setGreeting"];
    contract(config).then((ct) => {
      aPWA.alert("<u><b>Got DAPP Contract</b>");
      ct.setGreeting({ "message": "I set this at "+(new Date()).toTimeString().substring(0,8) }).then((response) => {
        aPWA.alert("<u><b>DAPP message value set</b>");
        ct.getGreeting({ "accountId": myID }).then((response) => {
          aPWA.alert("<u><b>Message from DAPP was</b></u><p>"+response+"</p>");
        }).catch(errors);
      }).catch(errors);
    }).catch(errors);
  });
}, 2000);