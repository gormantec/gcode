import { PWA, Page, Div } from 'https://gcode.com.au/modules/pwa.mjs';
import { login, contract } from "https://gcode.com.au/modules/near/index.mjs"

/* example backend dApp call */
login({accountId:"gcode-ec42edf808f.testnet",contractId:"gcode-ec42edf808f.testnet"}).then((config)=>{
  config.methods=["*getGreeting"];
  var aContract=contract(config);
  aContract.getGreeting({"accountId": "hello.gormantec.testnet"}).then((response)=>{
    console.log(response);
  });
});


var homePage=new Page({
  color:"white", 
  backgroundColor:"black", 
  backgroundPosition:"center",
  backgroundSize:"75%",
  backgroundRepeat:"no-repeat",
  backgroundImage:"url(https://c7.uihere.com/files/614/185/190/sun-solar-flare-uv-uv-light.jpg)"
});

var secondPage=new Page({
  color:"black",
  backgroundColor:"white",
  navigateBackPage:homePage,
  child: new Div({innerHTML:"url(https://gcode.com.au/html/test.html)"})
});

var aPWA=new PWA({
        title:"Gorman Technology Pty Ltd",
        footer:"https://www.gormantec.com",
        primaryColor:"#005040",
    });

aPWA.show();

aPWA.floatingActionButton.onclick(function(){
  console.log("This will open a new page.");
  aPWA.setPage(secondPage);
});

aPWA.pwaBody.style.backgroundColor="black";

window.setTimeout(function(){
	aPWA.setPage(homePage);
},1000);
console.log('new javascript file!');