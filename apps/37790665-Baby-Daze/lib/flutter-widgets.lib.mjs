import { Div,Page } from 'https://gcode.com.au/modules/pwa.mjs';

/*---------------------------------------------------------------------------*/
export class Row extends Div {
    constructor(params) {
        super({
            "position": "relative",
            "top": "unset",
            "bottom": "unset",
            "left": "unset",
            "right": "unset",
            "children": params.children
        });
        for (var i = 0; i < this.childrenCount; i++) {
            this.element.children[i].style.width = (Math.floor(1000 / this.childrenCount) / 10) + "%";
        }
    }
}
export class Column extends Div {
    constructor(params) {
        super({
            "position": "relative",
            "display": "inline-block",
            "top": "unset",
            "bottom": "unset",
            "left": "unset",
            "right": "unset"
        });
        if (params instanceof Div) this.setChild(params);
        else if (params.child) this.setChild(params.child);
        this.style.height = this.firstChild.style.height;
    }
}

export class OutlinedButton extends Div {
    constructor(params) {
        super(params);
        if (params.height) this.style.height = params.height;
        else this.style.height = "80px";
        this.style.width = params.width || "80px";
        this.style.cursor = "pointer";
        this.style.pointerEvents = "auto";
    }
}

export class Text extends Div {
    constructor(_text) {
        super({
            "classNameOverride": true,
            "tagName": "span",
            "innerText": _text
        });
    }
}
export class ListView extends Div {
    constructor(params) {
        super(params);
        this.divChildren = params.children;
        while (this.element.firstChild) {
            this.element.removeChild(this.element.lastChild);
        }
        for (let i = 0; this.divChildren && i < this.divChildren.length; i++) {
            console.log("x");
            super.appendChild(new Div({
                "position": "relative",
                "padding": "8px",
                height: this.divChildren[i].style.height,
                child: this.divChildren[i]
            }));
        }
    }
  
  	removeChildren()
    {
        var child = this.element.lastElementChild; 
        while (child) {
            this.element.removeChild(child);
            child = this.element.lastElementChild;
        }
    }
  	
  	appendChild(child)
    {
      	//this.divChildren.push(child);
      	super.appendChild(new Div({
                "position": "relative",
                "padding": "8px",
                height: child.style.height,
                child: child
            }));
    }
}
export class Container extends Div {
    constructor(params) {
        super(params);
    }
}

export class Form extends Div {
    constructor(params) {
        super(params);
    }
}



export class DateFormField extends Div {
    constructor(params) {
        super({position:"relative",overflowY: "none",overflowX: "none"});
      
      	if(!params.fontSize)this.style.height="44px";
      	else this.style.height=(parseInt(params.fontSize)+30)+"px";
      	let inputField=document.createElement("input");
      	inputField.setAttribute("type","datetime-local");
      	inputField.style.marginBottom="7px";
      	if(!params.fontSize)inputField.style.height="44px";
      	else inputField.style.height=(parseInt(params.fontSize)+10)+"px";
      	if(!params.fontSize)inputField.style.fontSize="24px";
      	inputField.style.padding="3px";
      	inputField.style.backgroundColor="white";
      	this.appendChild(inputField);
      if(params.decoration)
      {
          inputField.style.marginLeft="60px";
          if(params.decoration.style.width)inputField.style.marginLeft=(parseInt(params.decoration.style.width)+3)+"px";
          params.decoration.style.left="3px";
          if(!params.decoration.style.width)params.decoration.style.width="57px";
          params.decoration.style.paddingTop="5px";
          this.appendChild(params.decoration);
      }
      
      const now = new Date();
      inputField.value = new Date(now.getTime() - now.getTimezoneOffset() * 60000).toISOString().substring(0, 19);
    }
  
}

export class TextFormField extends Div {
    constructor(params) {
        super({position:"relative",overflowY: "none",overflowX: "none"});
      
      	if(!params.fontSize)this.style.height="44px";
      	else this.style.height=(parseInt(params.fontSize)+4+14)+"px";
      
      
      	let inputScrollDiv=new Div({overflowY: "auto",overflowX: "none"});
      	let inputDiv=new Div(params);
      	if(params.value){
          console.log("TextFormField Value: "+params.value);
          inputDiv.innerText=params.value;
        }
      	inputDiv.style.position="relative";
      	if(params.contenteditable!=false && params.contenteditable!="false")
        {
          	inputDiv.element.setAttribute("contenteditable","true");
      		inputDiv.style.borderBottom="2px solid #BBBBBB";
      		inputDiv.style.marginBottom="5px";
        }
      	else
        {
      		inputDiv.style.marginBottom="7px";
        }
      	if(!params.fontSize)inputDiv.style.height="30px";
      	else inputDiv.style.height=(parseInt(params.fontSize)+4)+"px";
      	if(!params.fontSize)inputDiv.style.fontSize="24px";
      	if(params.height || params.minHeight){
          inputDiv.style.height="";
          inputDiv.style.minHeight=params.height || params.minHeight;
          this.style.height=(parseInt(params.height)+14)+"px";
          inputDiv.style.borderBottom="unset";
		  inputDiv.style.border="1px solid #BBBBBB";
        }
      	inputDiv.style.padding="3px";
      	inputDiv.style.marginBottom="5px";
      	inputDiv.style.backgroundColor="white";
      	inputScrollDiv.style.height=(parseInt(this.style.height))+"px";
      	inputScrollDiv.appendChild(inputDiv);
      	this.appendChild(inputScrollDiv);
      if(params.decoration)
      {
          inputDiv.style.marginLeft="60px";
          if(params.decoration.style.width)inputDiv.style.marginLeft=(parseInt(params.decoration.style.width)+3)+"px";
          params.decoration.style.left="3px";
          if(!params.decoration.style.width)params.decoration.style.width="57px";
          params.decoration.style.paddingTop="5px";
          this.appendChild(params.decoration);
      }
    }
}
export class Padding extends Div {
    constructor(params) {
        super(params);
    }
}

export class VideoImage extends Div {
    constructor(params) {
        super({
          			width: params.width?params.width:"100%",
                    height: params.height?params.height:"unset",
                    id: params.id?params.id:"image-"+Date.now(),
                    tagName: "img",
              		backgroundColor:"black",
                    classNameOverride: true,
          			onclick:params.onclick
              });
      
      	if(params.src)
        {
          	this.element.src=params.src;
        }
      	if(params.display)
        {
          	this.element.style.display=params.display;
        }
    }
}

export class Video extends Div {
    constructor(params) {
        super({
          			width: params.width?params.width:"320px",
                    height: params.height?params.height:"180px",
                    id: params.id?params.id:"video-"+Date.now(),
                    tagName: "video",
              		backgroundColor:"black",
                    classNameOverride: true
              });
      	if(params.src)
        {
          	this.element.src=params.src;
          	this.element.setAttribute("controls", "controls");
        }
      	if(params.muted && params.muted!="false" && params.muted!=false)
        {
          	this.element.setAttribute("muted","muted");
        }
      	if(params.controls && params.controls!="false" && params.controls!=false)
        {
          	this.element.setAttribute("controls","controls");
        }
      
      	if(params.playsinline && params.playsinline!="false" && params.playsinline!=false)
        {
          	this.element.setAttribute("playsinline","playsinline");
        }
      	if(params.autoplay && params.autoplay!="false" && params.autoplay!=false)
        {
          	this.element.setAttribute("autoplay","autoplay");
        }
      
      	if(params.display)
        {
          	this.element.style.display=params.display;
        }
      
      	
    }
  
  static getVideoCover(file, seekTo = 0.0) {
    console.log("getting video cover for file: ", file);
    return new Promise((resolve, reject) => {
        // load the file to a video player
        const videoPlayer = document.createElement('video');
        videoPlayer.setAttribute('src', URL.createObjectURL(file));
        videoPlayer.load();
        videoPlayer.addEventListener('error', (ex) => {
            reject("error when loading video file", ex);
        });
        // load metadata of the video to get video duration and dimensions
        videoPlayer.addEventListener('loadedmetadata', () => {
            // seek to user defined timestamp (in seconds) if possible
            if (videoPlayer.duration < seekTo) {
                reject("video is too short.");
                return;
            }
            // delay seeking or else 'seeked' event won't fire on Safari
            setTimeout(() => {
              videoPlayer.currentTime = seekTo;
            }, 200);
            // extract video thumbnail once seeking is complete
            videoPlayer.addEventListener('seeked', () => {
                console.log('video is now paused at %ss.', seekTo);
                // define a canvas to have the same dimension as the video
                const canvas = document.createElement("canvas");
                canvas.width = videoPlayer.videoWidth;
                canvas.height = videoPlayer.videoHeight;
                // draw the video frame to canvas
                const ctx = canvas.getContext("2d");
                ctx.drawImage(videoPlayer, 0, 0, canvas.width, canvas.height);
                // return the canvas image as a blob
                ctx.canvas.toBlob(
                    blob => {
                      	let r={width:canvas.width,height:canvas.height,blob:blob};
                      	console.log(r);
                        resolve(r);
                    },
                    "image/jpeg",
                    0.75 /* quality */
                );
            });
        });
    });
}
}
export class Center extends Div {
    constructor(params) {
        super(params);
        this.element.style.display = "flex";
        this.element.style.alignItems = "center";
        this.element.style.justifyContent = "center";
    }
}

export class InputDecoration extends Div {
    constructor(params) {
        super(params);
      if(params.labelText)this.element.innerText=params.labelText;
      this.style.overflow="hidden";
    }
}

let mediaStream=null;
let _blob=null;
let _iblob=null;
let mediaRecorder = null;
let facingMode="environment";

export class AddVideo extends Page {
    constructor(params) {
        super({
            "color": "#545454",
            "backgroundColor": "#FAEBF2",
            "hideFloatingActionButton": "true",
            "hideFooter": "true",
            "navigateBackPage": "VideoBlog",
            "padding": "15px",
            "onopen": () => {
              	console.log("load page");
                document.querySelector('#video').style.display = "";
                document.querySelector('#videoCover').style.display = "none";
                document.querySelector('#saveButton').style.display = "none";
                let done = false;
                document.querySelector('#recButton').style.color = "grey";
                document.querySelector('#flipButton').style.color = "grey";
                if (mediaStream) {
                    mediaStream.getTracks().forEach(function(track) {
                        track.stop();
                    });
                    mediaStream = null;
                }
              	let getOrientation= ()=>window.innerWidth > window.innerHeight ? "landscape-primary" : "portrait-primary";
                var orientation = (screen.orientation || {}).type || screen.mozOrientation || screen.msOrientation || getOrientation();
                let videoSpecs = {
                    facingMode: "environment",
                    resizeMode: "crop-and-scale",
                    aspectRatio: 16 / 9
                }
                console.log(orientation);
                if (orientation === "portrait-secondary" || orientation === "portrait-primary") {
                    videoSpecs = {
                        facingMode: facingMode,
                        resizeMode: "crop-and-scale",
                        aspectRatio: 9 / 16
                    }
                }
              	console.log(videoSpecs);
                navigator.mediaDevices.getUserMedia({
                    audio: true,
                    video: videoSpecs
                }).then(function(aMediaStream) {
                    mediaStream = aMediaStream;
                    if (!done) {
                        const video = document.querySelector('video');
                        console.log(mediaStream);
                        console.log(mediaStream.getVideoTracks()[0].getSettings());
                        video.srcObject = mediaStream;
                        video.volume = 0.0;
                        video.muted = true;
                        video.playsinline = true;
                        video.autoplay = true;
                        video.onloadedmetadata = function(e) {
                            if (!done) {
                                video.play();
                                video.volume = 0.0;
                                video.muted = true;
                                video.playsinline = true;
                                video.autoplay = true;
                                done = true;
                                document.querySelector('#recButton').style.color = "black";
                                document.querySelector('#flipButton').style.color = "black";
                              	
                            }
                        }
                    }
                })

            },
            "id": params ? params.id : null,
            "children": [new Center({
                    height: "202px",
                    top: "10px",
                    child: new Center({
                        width: "360px",
                        height: "202px",
                        overflow: "hidden",
                        children: [new Video({
                            width: "360px",
                            height: "unset",
                            id: "video",
                            muted: "true",
                            playsinline: "true",
                            autoplay: "true"
                        }), new VideoImage({
                            width: "360px",
                            height: "202px",
                            id: "videoCover",
                            display: "none",
                          onclick: () => {
                            let video = document.querySelector("#video");
                            video.style.display = "";
                            document.querySelector("#videoCover").style.display = "none";
                            video.currentTime = 0;
                            video.controls = true;
                            video.playsinline = true;
                            try {
                              video.play();
                            } catch (e) {
                              console.log(e);
                            }
                            const ev2 = () => {
                              let video2 = document.querySelector("#video");
                              video2.style.display = "none";
                              document.querySelector("#videoCover").style.display = "";
                              video2.currentTime = 0;
                              video2.removeEventListener('ended',ev2);
                            };
                            video.addEventListener('ended', ev2, false);
                          }
                        })]
                    })
                }),
                new Form({
                    top: "230px",
                    left: "20px",
                    right: "20px",
                    fontSize: "12px",
                  
                    children: [
                        new TextFormField({
                          	decoration: new InputDecoration({labelText:'Date'}),
                            fontSize: "12px",
                            id: "dateTextFormField",
                          	contenteditable:false
                        }),
                        new TextFormField({
                          	decoration: new InputDecoration({labelText:'Title'}),
                            fontSize: "12px",
                            id: "titleTextFormField"
                        }),
                        new TextFormField({
                          	decoration: new InputDecoration({labelText:'Comment'}),
                            fontSize: "12px",
                          	height: "45px",
                            id: "commentTextFormField"
                        }),
                    ]
                }),

                new Center({
                    height: "50px",
                    bottom: "25px",
                    width: "60px",
                    left: "20px",
                    child: new Div({
                        id: "flipButton",
                        width: "30px",
                        height: "30px",
                        fontSize: "30px",
                        color: "grey",
                        child: new Icon("flip_camera_ios")}),
                        onclick: () => {
                          if(facingMode=="environment")facingMode="user";
                          else facingMode="environment";
                          console.log("click");
                          PWA.refeshCurrentPage();
                        }
                }),

                new Center({
                    height: "50px",
                    bottom: "25px",
                  	left:"80px",
                  	right:"80px",
                    child: new Div({
                        id: "recButton",
                        width: "50px",
                        height: "50px",
                        fontSize: "50px",
                        color: "black",
                        child: new Icon("radio_button_checked"),
                        onclick: () => {
                            let aTimeout = null;
                            if (document.querySelector('#recButton').style.color == "black") {
                                document.querySelector('#video').style.display = "";
                                document.querySelector('#videoCover').style.display = "none";
                                document.querySelector('#recButton').style.color = "red";
                                const video = document.querySelector('video');
                                if (!video.srcObject && mediaStream) {
                                    video.src = null;
                                    video.srcObject = mediaStream;
                                    video.autoplay = true;
                                }
                                video.removeAttribute("controls");
                                video.setAttribute("muted", "muted");
                                video.volume = 0.0;
                                video.muted = true;

                                mediaRecorder = new MediaRecorder(mediaStream);
                                mediaRecorder.start(1000);
                                let chunks = [];
                                mediaRecorder.ondataavailable = function(e) {
                                    chunks.push(e.data);
                                }
                                mediaRecorder.onstop = function(e) {
                                    console.log(mediaRecorder);
                                    console.log("stopped");
                                    if (mediaRecorder.mimeType == "video/mp4") {
                                        _blob = new Blob(chunks, {
                                            'type': 'video/mp4'
                                        });
                                    } else {
                                        _blob = new Blob(chunks, {
                                            'type': 'video/webm'
                                        });
                                    }
                                    video.srcObject = null;

                                    Video.getVideoCover(_blob, 1.5).then(({
                                        width,
                                        height,
                                        blob
                                    }) => {
                                        document.querySelector('#video').style.display = "none";
                                        document.querySelector('#videoCover').style.display = "";
                                        videoCover.src = URL.createObjectURL(blob);
                                        _iblob = blob;
                                        videoCover.style.height = height * parseInt(videoCover.style.width) / width + "px";
                                        videoCover.dataset.realwidth = width;
                                        videoCover.dataset.realheight = height;
                                    });

                                    let b = URL.createObjectURL(_blob);
                                    video.volume = 0.2;
                                    video.muted = false;
                                    video.playsinline = true;
                                    video.autoplay = false;
                                    video.src = b;
                                    video.pause();
                                    video.setAttribute("controls", "controls");
                                    video.removeAttribute("muted");
                                  	mediaRecorder=null;
                                }
                                aTimeout = setTimeout(() => {
                                    aTimeout = null;
                                    console.log("stop");
                                    let dt = Date.now();
                                    let d = new Date(dt);
                                    if(mediaRecorder)mediaRecorder.stop();
                                    document.querySelector('#recButton').style.color = "black";
                                    document.querySelector('#saveButton').style.display = "";
                                    document.querySelector('#dateTextFormField').innerText = d.toLocaleString();
                                    document.querySelector('#dateTextFormField').dataset.timestamp = dt;

                                }, 10000);
                            } else if (document.querySelector('#recButton').style.color == "red") {
                                if (aTimeout) clearTimeout(aTimeout);
                                console.log("stop");
                                let dt = Date.now();
                                let d = new Date(dt);
                                if(mediaRecorder){
                                  console.log("stopping");
                                  mediaRecorder.stop();
                                }
                                document.querySelector('#recButton').style.color = "black";
                                document.querySelector('#saveButton').style.display = "";
                                document.querySelector('#dateTextFormField').innerText = d.toLocaleString();
                                document.querySelector('#dateTextFormField').dataset.timestamp = dt;
                            }
                        }

                    })
                }),
                new Center({
                    height: "50px",
                    bottom: "25px",
                    width: "60px",
                    right: "20px",
                    child: new Div({
                        id: "saveButton",
                        width: "40px",
                        height: "40px",
                        fontSize: "40px",
                        color: "black",
                        display: "none",
                        child: new Icon("save"),
                        onclick: () => {
                            // Request persistent storage for site
                            if (navigator.storage && navigator.storage.persist) {
                                navigator.storage.persist().then((isPersisted) => {
                                    var indexedDB = window.indexedDB || window.webkitIndexedDB || window.mozIndexedDB || window.OIndexedDB || window.msIndexedDB;
                                    var dbVersion = 2.0;
                                    var request = indexedDB.open("babyVideos3", dbVersion),
                                        db;
                                    request.onerror = function(event) {
                                        console.log("Error creating/accessing IndexedDB database");
                                    };
                                    request.onsuccess = function(event) {
                                        let type = "webm";
                                        if (_blob.type == "video/mp4") type = "mp4"
                                        var videoName = "video-" + document.querySelector('#dateTextFormField').dataset.timestamp + "." + type;
                                        console.log(_blob);
                                        new Response(_iblob).arrayBuffer().then((imageArrayBuffer) => {
                                            new Response(_blob).arrayBuffer().then((arrayBuffer) => {
                                                console.log(arrayBuffer);
                                                let obj = {
                                                    name: videoName,
                                                    type: type,
                                                    time: document.querySelector('#dateTextFormField').innerText,
                                                    timestamp: document.querySelector('#dateTextFormField').dataset.timestamp,
                                                    title: document.querySelector('#tilteTextFormField').innerText,
                                                    comment: document.querySelector('#commentTextFormField').innerText,
                                                    image: imageArrayBuffer,
                                                    realwidth: document.querySelector('#videoCover').dataset.realwidth,
                                                    realheight: document.querySelector('#videoCover').dataset.realheight,
                                                    data: arrayBuffer
                                                };
                                                console.log(obj);
                                                var put = request.result.transaction(["videos"], "readwrite").objectStore("videos").put(obj, videoName);
                                                document.querySelector('#saveButton').style.display = "none";
                                                PWA.refeshCurrentPage();
                                            });
                                        });
                                    }
                                    request.onupgradeneeded = function(event) {
                                        event.target.result.createObjectStore("videos");
                                    };
                                });
                            }
                        }
                    })
                }),
            ]
        });
    }
}

export class ListTile extends Div {
    constructor(params) {
        super(params);
        this.style.height = "40px";
        if (params.title) {
            this.appendChild(new Container({
                height: "18px",
                fontSize: "16px",
                top: "0px",
                left: "42px",
                child: params.title
            }));
        }
        if (params.subtitle) {
            this.appendChild(new Container({

                height: "14px",
                fontSize: "12px",
                top: "22px",
                left: "42px",
                child: params.subtitle
            }));
        }
        if (params.leading) {
            this.appendChild(new Container({
                height: "25px",
                fontSize: "24px",
                top: "0px",
                left: "0px",
                width: "40px",
                child: params.leading
            }));
        }
        if (params.trailing) {
            this.appendChild(new Container({
                height: "30px",
                fontSize: "24px",
                top: "5px",
                right: "0px",
                width: "30px",
                child: params.trailing
            }));
        }
    }
}

export class Icon extends Div {
    constructor(icon) {
        super();
        let params = {
            tagName: "i",
            class: "material-icons",
            classNameOverride: true,
            innerText: icon
        };
        this.getParentStyle("fontSize").then((fontSize) => {
            if (fontSize) {
                params.fontSize = fontSize;
            }
            this.setChild(new Div(params));
        });

    }
}
export const Icons = {
    "battery_full": "battery_full",
    "star": "star",
    "star_outline": "star_outline",
    "flag": "flag",
    "alarm": "alarm"
};


