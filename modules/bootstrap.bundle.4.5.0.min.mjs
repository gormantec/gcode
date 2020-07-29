console.log("modules/bootstrap.bundle.4.5.0.min.mjs");

import  "https://cdn.jsdelivr.net/npm/popper.js@1.16.0/dist/umd/popper.min.js";

window.Popover = Popover;

import "https://stackpath.bootstrapcdn.com/bootstrap/4.5.0/js/bootstrap.min.js";

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
}

var _B = new BootStrapexports();
var Util = _B.Util;
var Alert = _B.Alert;
var Button = _B.Button;
var Carousel = _B.Carousel;
var Collapse = _B.Collapse;
var Dropdown = _B.Dropdown;
var Modal = _B.Modal;
var ScrollSpy = _B.ScrollSpy;
var Tab = _B.Tab;
var Tooltip = _B.Tooltip;


export {Util, Alert, Button, Carousel, Collapse, Dropdown, Modal, Popover, ScrollSpy, Tab, Tooltip};