export function addFrame(win, aPWA, mockFrame) {

    var splashdiv = win.document.createElement('div');
    splashdiv.setAttribute("style", "position:fixed;top:20px;bottom:20px;left:20px;right:20px;border-radius: 15px;overflow:hidden;");
    splashdiv.innerHTML=win.document.body.innerHTML;

    while (win.document.body.firstChild) win.document.body.removeChild(win.document.body.lastChild);
    var frame = win.document.createElement('div');
    frame.className = "pwadiv mockFrame " + mockFrame;
    win.document.body.appendChild(frame);
    var shift=0;
    var div;
    if(mockFrame.toLowerCase()=="iphonex")
    {
        aPWA.pwaRoot.style.left = "20px";
        aPWA.pwaRoot.style.right = "20px";
        aPWA.pwaRoot.style.top = "20px";
        aPWA.pwaRoot.style.bottom = "20px";
        aPWA.pwaOverlay.style.left = "20px";
        aPWA.pwaOverlay.style.right = "20px";
        aPWA.pwaOverlay.style.top = "20px";
        aPWA.pwaOverlay.style.bottom = "20px";

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
    }
    else{
        shift=60;
        aPWA.pwaRoot.style.left = "20px";
        aPWA.pwaRoot.style.right = "20px";
        aPWA.pwaRoot.style.top = "80px";
        aPWA.pwaRoot.style.bottom = "80px";
        aPWA.pwaOverlay.style.left = "20px";
        aPWA.pwaOverlay.style.right = "20px";
        aPWA.pwaOverlay.style.top = "80px";
        aPWA.pwaOverlay.style.bottom = "80px";

        div = win.document.createElement('div');
        div.setAttribute("style", "position:fixed;top:20px;background-color:black;left:20px;right: 20px;height:60px");
        aPWA.pwaOverlay.element.appendChild(div);

        div = win.document.createElement('div');
        div.setAttribute("style", "position:fixed;bottom:20px;background-color:black;left:20px;right: 20px;height:60px");
        aPWA.pwaOverlay.element.appendChild(div);

        div = win.document.createElement('div');
        div.setAttribute("style", "position:fixed;top:44px;margin-right:-20px;width:40px;right:50%;height:4px;background-color:#323232;border-radius:2px;");
        aPWA.pwaOverlay.element.appendChild(div);
        div = win.document.createElement('div');

        div = win.document.createElement('div');
        div.setAttribute("style", "position:fixed;top:28px;margin-right:-2px;width:8px;right:50%;height:8px;background-color:#323232;border-radius:4px;");
        aPWA.pwaOverlay.element.appendChild(div);

        div = win.document.createElement('div');
        div.setAttribute("style", "position:fixed;top:42px;margin-right:35px;width:8px;right:50%;height:8px;background-color:#323232;border-radius:4px;");
        aPWA.pwaOverlay.element.appendChild(div);

        div = win.document.createElement('div');
        div.setAttribute("style", "position:fixed;bottom:28px;margin-right:-10px;width:40px;right:50%;height:40px;border-color:#323232;border-radius:20px;border-width:3px;border-style: solid;");
        aPWA.pwaOverlay.element.appendChild(div);
    }
    div = win.document.createElement('div');
    div.setAttribute("id", "pwaStatusBarTime");
    div.setAttribute("style", "position:fixed;top:"+(25+shift).toString()+"px;background-color:none;color:white;width: 50px;left: 10%;height: 20px;text-align: right;font-weight: 900;");
    div.innerText=(new Date()).getHours()+":"+("0"+(new Date()).getMinutes()).slice(-2);
    aPWA.pwaOverlay.element.appendChild(div);
    ((_div)=>{setInterval(function(){_div.innerText=(new Date()).getHours()+":"+("0"+(new Date()).getMinutes()).slice(-2);},30000);})(div);

    div = win.document.createElement('div');
    div.innerText="signal_cellular_alt";
    div.className="material-icons";
    div.setAttribute("style", "position:fixed;top:"+(23+shift).toString()+"px;background-color:none;color:white;width:20px;right: 20%;font-size:20px;");
    aPWA.pwaOverlay.element.appendChild(div);

    div = win.document.createElement('div');
    div.innerText="wifi";
    div.className="material-icons";
    div.setAttribute("style", "position:fixed;top:"+(23+shift).toString()+"px;background-color:none;color:white;width:20px;right: 20%;margin-right:-25px;font-size:20px;");
    aPWA.pwaOverlay.element.appendChild(div);

    div = win.document.createElement('div');
    div.innerText="battery_charging_full";
    div.className="material-icons";
    div.setAttribute("style", "position:fixed;top:"+(16+shift).toString()+"px;background-color:none;color:white;width:20px;margin-right:-50px;right: 20%;font-size:28px;-webkit-transform: rotate(90deg);-moz-transform: rotate(90deg);-ms-transform: rotate(90deg);transform: rotate(90deg)");
    aPWA.pwaOverlay.element.appendChild(div);


    frame.appendChild(splashdiv);
    
    return frame;
}
