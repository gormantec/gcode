/*

  filename:gcode-ed90ac3ef2b.mjs
  created: 2021-8-6T11:59:07
  appName: gcode
  splash: https://gcode.com.au/images/ios/ios-appicon-180-180.png
  icon: https://gcode.com.au/images/ios/ios-appicon-180-180op.png
  icon180x180: https://gcode.com.au/images/ios/ios-appicon-180-180op.png
  mockFrame: iphoneX
  splashBackgroundColor: #005040
  splashDuration: 2000

*/
/*---------------------------------------------------------------------------*/
import {
  PWA,
  Page,
  Div
} from 'https://gcode.com.au/modules/pwa.mjs';
try {
  Page.clearPages();
} catch (e) {
  console.log("XXXX");
}
/*---------------------------------------------------------------------------*/
class HomePage extends Page {
  constructor() {
      super({
          "color": "black",
          "backgroundColor": "black",
          "backgroundPosition": "center",
          "backgroundSize": "60%",
          "backgroundRepeat": "no-repeat",
          "backgroundImage": "url(https://c7.uihere.com/files/614/185/190/sun-solar-flare-uv-uv-light.jpg)"
      });
  }

}
class HomePage4 extends Page {
  constructor() {
      super({
          "color": "black",
          "backgroundColor": "white",
          "navigateBackPage": aHomePage,
          "child": myDiv
      });
  }
}
/*---------------------------------------------------------------------------*/
var myDiv=new Div({innerHTML: "url(https://gcode.com.au/html/test.html)"});
var aHomePage = new HomePage();
var aHomePage4 = new HomePage4();
var aPWA = new PWA({
  title: "Gorman Technology Pty Ltd",
  footer: "https://www.gormantec.com",
  primaryColor: "#005040",
});
aPWA.floatingActionButton.onclick(function() {
  console.log("This will open a new page.");
  aPWA.setPage(aHomePage4);
});
aPWA.setPage(aHomePage);
aPWA.show();
/*---------------------------------------------------------------------------*/


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
  aPWA.alert("<u><b>NEAR testnet</b><p><i>Logging in......</i></p>");
  login({ accountId: myID, contractId: targetContract }).then((config) => {
    config.methods = ["*getGreeting", "setGreeting"];
    contract(config).then((ct) => {
      aPWA.alert("<u><b>NEAR testnet</b></u><p>Got DAPP Contract.</p>");
      ct.setGreeting({ "message": "I set this at "+(new Date()).toTimeString().substring(0,8) }).then((response) => {
        aPWA.alert("<u><b>NEAR testnet</b></u><p>Set message on DAPP</p>");
        ct.getGreeting({ "accountId": myID }).then((response) => {
          aPWA.alert("<u><b>Message from DAPP was</b></u><p>"+response+"</p>");
        }).catch(errors);
      }).catch(errors);
    }).catch(errors);
  });
}, 2000);