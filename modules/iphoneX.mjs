export function addFrame(win, aPWA, mockFrame) {
    while (win.document.body.firstChild) win.document.body.removeChild(win.document.body.lastChild);
    var frame = win.document.createElement('div');
    frame.className = "pwadiv " + mockFrame;
    win.document.body.appendChild(frame);
    aPWA.pwaRoot.style.left = "20px";
    aPWA.pwaRoot.style.right = "20px";
    aPWA.pwaRoot.style.top = "20px";
    aPWA.pwaRoot.style.bottom = "20px";
    aPWA.pwaOverlay.style.left = "20px";
    aPWA.pwaOverlay.style.right = "20px";
    aPWA.pwaOverlay.style.top = "20px";
    aPWA.pwaOverlay.style.bottom = "20px";
    var div;
    div = win.document.createElement('div');
    div.setAttribute("style", "position:fixed;top:14px;margin-left:-95px;width:190px;left:50%;height:30px;background-color:black;border-bottom-left-radius:20px;border-bottom-right-radius:20px;");
    aPWA.pwaOverlay.element.appendChild(div);
    div = win.document.createElement('div');
    div.setAttribute("style", "position:fixed;top:22px;margin-left:-30px;width:60px;left:50%;height:5px;background-color:#323232;border-radius:2.5px;");
    aPWA.pwaOverlay.element.appendChild(div);
    div = win.document.createElement('div');
    div.setAttribute("style", "position:fixed;top:16px;margin-left:-107px;left:50%;width:12px;height:5px;background:none;border-style:solid;border-color:black;border-top-right-radius:12px;height:8px;border-bottom-width:0px;border-left-width:0px;border-right-width:4px;border-top-width:4px");
    aPWA.pwaOverlay.element.appendChild(div);
    div = win.document.createElement('div');
    div.setAttribute("style", "position:fixed;top:16px;margin-left:91px;left:50%;width:12px;height:5px;background:none;border-style:solid;border-color:black;border-top-left-radius:12px;height:8px;border-bottom-width:0px;border-right-width:0px;border-left-width:4px;border-top-width:4px");
    aPWA.pwaOverlay.element.appendChild(div);
    div = win.document.createElement('div');
    div.setAttribute("style", "position:fixed;top:20px;margin-left:40px;width:8px;left:50%;height:8px;background-color:#323232;border-radius:4px;");
    aPWA.pwaOverlay.element.appendChild(div);
    div = win.document.createElement('div');
    div.setAttribute("id", "pwaStatusBarTime");
    div.setAttribute("style", "position:fixed;top:25px;background-color:none;color:black;width: 50px;left: 10%;height: 20px;text-align: right;font-weight: 900;");
    div.innerText=(new Date()).getHours()+":"+("0"+(new Date()).getMinutes()).slice(-2);
    aPWA.pwaOverlay.element.appendChild(div);
    ((_div)=>{setTimeout(function(){_div.innerText=(new Date()).getHours()+":"+("0"+(new Date()).getMinutes()).slice(-2);},30000);})(div);

    div = win.document.createElement('div');
    div.innerText="wifi";
    div.className="material-icons";
    div.setAttribute("style", "position:fixed;top:21px;background-color:none;color:black;width:20px;right: 20%;font-size:16px;");
    aPWA.pwaOverlay.element.appendChild(div);

    div = win.document.createElement('div');
    div.innerText="wifi";
    div.className="material-icons";
    div.setAttribute("style", "position:fixed;top:21px;background-color:none;color:black;width:20px;right: 20%;margin-right:-25px;font-size:16px;");
    aPWA.pwaOverlay.element.appendChild(div);

    div = win.document.createElement('div');
    div.innerText="battery_charging_full";
    div.className="material-icons";
    div.setAttribute("style", "position:fixed;top:21px;background-color:none;color:black;width:20px;margin-right:-50px;right: 20%;font-size:24px;-webkit-transform: rotate(-90deg);-moz-transform: rotate(-90deg);-ms-transform: rotate(-90deg);transform: rotate(-90deg)");
    aPWA.pwaOverlay.element.appendChild(div);


    return frame;
}
