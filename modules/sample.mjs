import { PWA, Page, Div } from 'https://git.gormantec.com/gcode/modules/pwa.mjs';


var homePage=new Page({
  color:"white", 
  backgroundColor:"black", 
  backgroundPosition:"center",
  backgroundRepeat:"no-repeat",
  backgroundImage:"url(https://c7.uihere.com/files/614/185/190/sun-solar-flare-uv-uv-light.jpg)"
});

var secondPage=new Page({
  color:"black",
  backgroundColor:"white",
  navigateBackPage:homePage,
  child: new Div({innerHTML:"url(https://git.gormantec.com/gcode/html/test.html)"})
});

var aPWA=new PWA({
        title:"Hello World",
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