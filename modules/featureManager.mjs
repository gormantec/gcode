export async function loadFeatures()
{

    '/modules/features/helpMenu.mjs'

    let res = await fetch('/.config.json');
    let json = await res.json();
    Array.from(json.features).forEach((feature)=>{

        let { getLeftMenuItem,getLeftMenuItemFunction } = await import(feature.uri).catch(()=>{console.log("import error");});
        if(isFunction(getLeftMenuItemFunction))
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
        
            if(isFunction(getLeftMenuItemFunction))
            {
                document.getElementById(meta.id).onclick = getLeftMenuItemFunction;
            }
        }


    });

    
    
}

function isFunction(f)
{
    return (f && {}.toString.call(f) === '[object Function]')l
        
}