import {
    PWA,
    Page,
    Div
} from 'https://gcode.com.au/modules/pwa.mjs';
import {Text,Center,Container,ListView,ListTile,Icon,Icons,Video,Form,TextFormField,DateFormField,InputDecoration,Padding,Column,VideoImage,AddVideo} from './lib/flutter-widgets.lib.mjs';

let listView=null;

export class VideoBlog extends Page {
    constructor(params) {
        super({
            "id": "VideoBlog",
            "color": "#545454",
            "backgroundColor": "#FAEBF2",
            "hideFooter": "true",
            "navigateBackPage": "HomePage",
            "floatingActionButtonPage": "AddVideo",
            "onopen": () => {

                var indexedDB = window.indexedDB || window.webkitIndexedDB || window.mozIndexedDB || window.OIndexedDB || window.msIndexedDB;
                var dbVersion = 2.0;
                var request = indexedDB.open("babyVideos3", dbVersion);
                request.onerror = function(event) {
                    console.log("Error creating/accessing IndexedDB database");
                };
                request.onsuccess = function(event) {
                    var get = request.result.transaction(["videos"], "readonly").objectStore("videos").getAll();
                    get.onsuccess = function(event) {
                        console.log(event.target.result);
                        if (event.target.result && event.target.result.length > 0) {
                            listView.removeChildren();
                            for (let i = event.target.result.length - 1; i >= 0; i--) {

                                var b = new Blob([event.target.result[i].data], {
                                    type: 'video/' + event.target.result[i].type
                                });
                                var ib = new Blob([event.target.result[i].image], {
                                    type: 'image/jpeg'
                                });
                                let iobUrl = URL.createObjectURL(ib);
                                let timestamp = event.target.result[i].timestamp;
                                let obUrl = URL.createObjectURL(b);
                                let timeago = Math.floor((Date.now() - timestamp) / 610000);
                                let timeagoString = timeago + " minutes ago";
                                if (timeago > 60) timeagoString = Math.floor(timeago / 60) + " hours ago";
                                else if (timeago > 1440) timeagoString = Math.fooor(timeago / 1440) + " days ago";
                                else if (timeago > 43200) timeagoString = Math.fooor(timeago / 43200) + " months ago";
                                else if (timeago > 524160) timeagoString = Math.fooor(timeago / 524160) + " years ago";
                                let iii = i;
                                let width = 360;
                                let height = event.target.result[i].realheight * width / event.target.result[i].realwidth;
                                listView.appendChild(new Container({
                                    height: "240px",
                                    children: [
                                        new ListTile({
                                            color: "#545454",
                                            title: new Text(timeagoString),
                                            subtitle: new Text((event.target.result[i].comment || "")),
                                            leading: new Icon(Icons.battery_full),
                                            trailing: new Icon(Icons.star_outline)
                                        }), new Center({
                                            top: "40px",
                                            width: "360px",
                                            height: "202px",
                                            overflow: "hidden",
                                            children: [new Video({
                                                    width: width + "360px",
                                                    height: height + "px",
                                                    src: obUrl,
                                                    playsinline: "true",
                                                    display: "none",
                                                    id: "video-" + iii
                                                }),
                                                new VideoImage({
                                                    width: width + "px",
                                                    height: height + "px",
                                                    id: "videoCover-" + iii,
                                                    src: iobUrl,
                                                    onclick: () => {
                                                        let video = document.querySelector("#video-" + iii);
                                                        video.style.display = "";
                                                        document.querySelector("#videoCover-" + iii).style.display = "none";
                                                        video.currentTime = 0;
                                                        video.controls = true;
                                                        video.playsinline = true;
                                                        try {
                                                            video.play();
                                                        } catch (e) {
                                                            console.log(e);
                                                        }
                                                        const ev = () => {
                                                            let video2 = document.querySelector("#video-" + iii);
                                                            video2.style.display = "none";
                                                            document.querySelector("#videoCover-" + iii).style.display = "";
                                                            video2.currentTime = 0;
                                                            video2.removeEventListener('ended',ev);
                                                        };
                                                        video.addEventListener('ended', ev, false);
                                                    }
                                                })
                                            ]
                                        })
                                    ]
                                }));
                            }
                        }
                    };
                }
                request.onupgradeneeded = function(event) {
                    event.target.result.createObjectStore("videos");
                };

            }
        })
        listView = new ListView({
            "padding": "8px"
        });
        this.appendChild(listView);
    }
}