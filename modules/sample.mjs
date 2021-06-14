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

/** 
 * <h2> Delete everything below here if you are not building a DAPP </h2>
 * This is an example of calling a DAPP on the NEAR testnet. You required an ID on the blockchain,
 * the below generates one for you. If you signup to NEAR and want to use your own, just replease
 * the myID account ID below. For view methods, prefix them with an astrix like, "*getGreeting".
 */
window.setTimeout(function () {
  /* example backend dApp calling hello.gormantec.testnet */
  const myID = "gcode-0000000000000.testnet";
  const targetContract = "hello.gormantec.testnet";
  const errors=(e)=>{aPWA.alert("<u><b>Error</b></u><p>"+e+"</p>");};
  aPWA.alert("<u><b>NEAR testnet</b><p><i>Logginging in......</i></p>");
  login({ accountId: myID, contractId: targetContract }).then((config) => {
    config.methods = ["*getGreeting", "setGreeting"];
    contract(config).then((ct) => {
      aPWA.alert("<u><b>NEAR testnet</b><p>Got DAPP Contract.</p>");
      ct.setGreeting({ "message": "I set this at "+(new Date()).toTimeString().substring(0,8) }).then((response) => {
        aPWA.alert("<u><b>NEAR testnet</b><p>Set message on DAPP</p>");
        ct.getGreeting({ "accountId": myID }).then((response) => {
          aPWA.alert("<u><b>Message from DAPP was</b></u><p>"+response+"</p>");
        }).catch(errors);
      }).catch(errors);
    }).catch(errors);
  });
}, 2000);