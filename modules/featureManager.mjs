export async function loadFeatures()
{

    let res = await fetch('/.config.json');
    let json = await res.json();
    let arr = Array.from(json.features);
    arr=arr.sort((a,b)=>a.navPosition>b.navPosition);
    arr.forEach((feature)=>{

        let { onload,menuMetadata,menuAction,toolbarMetadata,toolbarAction } = await import(feature.uri).catch(()=>{console.log("import error");});
        if(isFunction(menuMetadata))
        {
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
            pageLeftToolbar.insertBefore(d,terminalButton);
        
            if(isFunction(menuAction))
            {
                document.getElementById(meta.id).onclick = menuAction;
            }
        }
        if(isFunction(toolbarMetadata))
        {
            let pageLeftToolbar=window.document.querySelector("#pageLeftToolbarTop");
            pageLeftToolbar.innerText="";
            let buttons = Array.from(toolbarMetadata());
            buttons.forEach((button)=>{
                let d=window.document.createElement("div");
                let i=window.document.createElement("i");
                let img=window.document.createElement("img");
                d.setAttribute("class","toolbarButton");
                d.setAttribute("data-action",button.dataAction);
                if(button.materialIcon)
                {
                    i.setAttribute("class","material-icons");
                    i.innerText=button.materialIcon;
                    d.appendChild(i);
                }
                else if(button.imageIcon)
                {
                    img.setAttribute("src",button.imageIcon);
                    d.appendChild(img);
                }
                pageLeftToolbar.appendChild(d);
                d.onclick = toolbarAction;
            });

        }
        if(isFunction(onload)) onload();

    }); 
    
    
}

function isFunction(f)
{
    return (f && {}.toString.call(f) === '[object Function]');
        
}

export function refreshFeatures()
{
    let res = await fetch('/.config.json');
    let json = await res.json();
    let arr = Array.from(json.features);
    arr=arr.sort((a,b)=>a.navPosition>b.navPosition);
    arr.forEach((feature)=>{
        let { refresh } = await import(feature.uri).catch(()=>{console.log("import error");});
        if(isFunction(refresh))refresh();
    });
}