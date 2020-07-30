console.log("modules/bootstrap.bundle.4.5.0.min.mjs");

import "https://cdn.jsdelivr.net/npm/popper.js@1.16.0/dist/umd/popper.min.js";
import "https://stackpath.bootstrapcdn.com/bootstrap/4.5.0/js/bootstrap.min.js";

/*
var _style = window.document.createElement("link");
_style.setAttribute("rel", "stylesheet");
_style.setAttribute("href", "https://stackpath.bootstrapcdn.com/bootstrap/4.5.0/css/bootstrap.min.css");
window.document.head.appendChild(_style);
var _style = window.document.createElement("script");
_style.setAttribute("src", "https://cdn.jsdelivr.net/npm/popper.js@1.16.0/dist/umd/popper.min.js");
window.document.head.appendChild(_style);
var _style = window.document.createElement("script");
_style.setAttribute("src", "https://stackpath.bootstrapcdn.com/bootstrap/4.5.0/js/bootstrap.min.js");
window.document.head.appendChild(_style);


class BootStrapexports{
    get Util() { return window.Util };
    get Alert() { return window.Alert };
    get Button() { return window.Button };
    get Carousel() { return window.Carousel };
    get Collapse() { return window.Collapse };
    get Dropdown() { return window.Dropdown = Dropdown };
    get Modal() { return window.Modal};
    get ScrollSpy() { return window.Scrollspy};
    get Tab() { return window.Tab};
    get Tooltip() { return window.Tooltip};
    get Popover() { return window.Popover};
}
*/

var _B = new BootStrapexports();
var Util = window.Util;
var Alert = window.Alert;
var Button = window.Button;
var Carousel = window.Carousel;
var Collapse = window.Collapse;
var Dropdown = window.Dropdown;
var Modal = window.Modal;
var ScrollSpy = window.ScrollSpy;
var Tab = window.Tab;
var Tooltip = window.Tooltip;
var Popover = window.Popover;


export {Util, Alert, Button, Carousel, Collapse, Dropdown, Modal, Popover, ScrollSpy, Tab, Tooltip};