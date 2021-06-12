export function createDownload(blobname, blob) {
    //var blob = dataURItoBlob(message.content);
    var blobUrl = URL.createObjectURL(blob);
    var save = document.createElement('a');
    save.style.marginLeft = "-80px";
    save.style.marginTop = "10px";
    save.style.color = "white";
    save.href = blobUrl;
    save.download = blobname;
    save.innerHTML = "[download]";
    document.getElementById("userIcon").insertBefore(save, document.getElementById("userIcon").firstChild);
    save.addEventListener("click", () => {
        save.remove();
    });

}

export const b64toBlob = (base64, type = 'application/octet-stream') =>
    fetch(`data:${type};base64,${base64}`).then(res => res.blob())