export function addFrame(win,mockFrame)
{
while (win.document.body.firstChild) win.document.body.removeChild(win.document.body.lastChild);
var frame=win.document.createElement('div');
frame.className="pwadiv "+mockFrame;
win.document.body.appendChild(frame);
this.pwaRoot.style.left="20px";
this.pwaRoot.style.right="20px";
this.pwaRoot.style.top="20px";
this.pwaRoot.style.bottom="20px";
this.pwaOverlay.style.left="20px";
this.pwaOverlay.style.right="20px";
this.pwaOverlay.style.top="20px";
this.pwaOverlay.style.bottom="20px";
var div;
div=win.document.createElement('div');
div.setAttribute("style","position:fixed;top:14px;margin-left:-95px;width:190px;left:50%;height:30px;background-color:black;border-bottom-left-radius:20px;border-bottom-right-radius:20px;");
this.pwaOverlay.element.appendChild(div);
div=win.document.createElement('div');
div.setAttribute("style","position:fixed;top:22px;margin-left:-30px;width:60px;left:50%;height:5px;background-color:#323232;border-radius:2.5px;");
this.pwaOverlay.element.appendChild(div);
div=win.document.createElement('div');
div.setAttribute("style","position:fixed;top:16px;margin-left:-107px;left:50%;width:12px;height:5px;background:none;border-style:solid;border-color:black;border-top-right-radius:12px;height:8px;border-bottom-width:0px;border-left-width:0px;border-right-width:4px;border-top-width:4px");
this.pwaOverlay.element.appendChild(div);
div=win.document.createElement('div');
div.setAttribute("style","position:fixed;top:16px;margin-left:91px;left:50%;width:12px;height:5px;background:none;border-style:solid;border-color:black;border-top-left-radius:12px;height:8px;border-bottom-width:0px;border-right-width:0px;border-left-width:4px;border-top-width:4px");
this.pwaOverlay.element.appendChild(div);
div=win.document.createElement('div');
div.setAttribute("style","position:fixed;top:20px;margin-left:40px;width:8px;left:50%;height:8px;background-color:#323232;border-radius:4px;");
this.pwaOverlay.element.appendChild(div);
return frame;
}
