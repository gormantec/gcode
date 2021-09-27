/*---------------------------------------------------------------------------*/
import { PWA, Page, Div } from 'https://gcode.com.au/modules/pwa.mjs';
try { Page.clearPages(); } catch (e) {}
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
class SecondPage extends Page {
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
var aSecondPage = new SecondPage();
var aPWA = new PWA({
  title: "Gorman Technology Pty Ltd",
  footer: "https://www.gormantec.com",
  primaryColor: "#005040",
});
aPWA.floatingActionButton.onclick(function() {
  aPWA.setPage(aSecondPage);
});
aPWA.setPage(aHomePage);
aPWA.show();
/*---------------------------------------------------------------------------*/
