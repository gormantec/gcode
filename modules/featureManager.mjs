export async function loadFeatures()
{

    let { getLeftMenuItem } = await import('/modules/features/helpMenu.mjs');
    let meta=getLeftMenuItem();
    let d=window.document.createElement("div");
    let i=window.document.createElement("i");
    d.setAttribute("id",meta.id);
    d.setAttribute("class",meta.class);
    i.setAttribute("class","material-icons-outlined");
    i.innerText=meta.materialIcon;
    d.appendChild(i);
    let pageLeftToolbar=window.document.querySelector("#pageLeftToolbar");
    let terminalButton=window.document.querySelector("#terminalButton");
    pageLeftToolbar.insertBefore(pageLeftToolbar,terminalButton);
    
}