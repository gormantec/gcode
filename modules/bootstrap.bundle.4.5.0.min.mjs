import { Popover, Tab } from "https://cdn.jsdelivr.net/npm/popper.js@1.16.0/dist/umd/popper.min.js";

window.Popover = Popover;
window.Tab = Tab;

import {Util, Alert, Button, Carousel, Collapse, Dropdown, Modal, ScrollSpy, Tooltip} from "https://stackpath.bootstrapcdn.com/bootstrap/4.5.0/js/bootstrap.min.js";

var _style = window.document.createElement("link");
_style.setAttribute("rel", "stylesheet");
_style.setAttribute("href", "https://stackpath.bootstrapcdn.com/bootstrap/4.5.0/css/bootstrap.min.css");
window.document.head.appendChild(_style);

window.Util = Util;
window.Alert = Alert;
window.Button = Button;
window.Carousel = Carousel;
window.Collapse = Collapse;
window.Dropdown = Dropdown;
window.Modal = Modal;
window.Scrollspy = ScrollSpy;
window.Tab = Tab;
window.Tooltip = Tooltip;

export {Util, Alert, Button, Carousel, Collapse, Dropdown, Modal, Popover, ScrollSpy, Tab, Tooltip};