/*

  filename:new-file-3662444.jsm
  created: 2020-6-6T17:34:05

*/

import { PWA, Page, Div } from 'https://git.gormantec.com/gcode/modules/pwa.mjs';
import { $ } from 'https://git.gormantec.com/gcode/modules/jquery-3.5.1.slim.min.mjs';
import { Util } from 'https://git.gormantec.com/gcode/modules/bootstrap.bundle.4.5.0.min.mjs';

import 'https://code.jquery.com/jquery-3.5.1.slim.min.js';
window.$ = window.jQuery = jQuery;
import 'https://cdn.jsdelivr.net/npm/popper.js@1.16.0/dist/umd/popper.min.js';
import 'https://stackpath.bootstrapcdn.com/bootstrap/4.5.0/js/bootstrap.min.js';


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