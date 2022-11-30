import {
    PWA,
    Page,
    Div,
    AuthButtons,
    ActionButton,
    DivForm
} from 'https://gcode.com.au/modules/pwa.mjs';

import {
    login,
    contract
} from 'https://gcode.com.au/modules/near/index.mjs';
import {listCrewRequest} from "./boat-crew-widget-askform.lib.mjs";

import {Text,Center,Container,ListView,ListTile,Icon,Icons,Video,Form,TextFormField,DateFormField,InputDecoration,Padding,Column} from './lib/flutter-widgets.lib.mjs'


let messages = null;
let accountId = "";
export var myList = new Div();
export var listView = new ListView({
            "padding": "8px"
        });


async function nearConnect() { 
    if (!messages) {
        var config = await login({
            accountId: accountId,
            contractId: "gcode-eeabe089d972.testnet"
        });
        config.methods = ["addMessage", "listMessages"];
        messages = await contract(config);
    }
}

function newSpinnerRow() {
    return new Div({
        backgroundColor: "rgba(255, 255, 255, 0.7)",
        id: "spinnerRow",
        position: "relative",
        height: "auto",
        borderRadius: "10px",
        padding: "20px",
        margin: "10px",
        child: new Div({
            classNameOverride: "true",
            class: "loader",
            innerText: "...",
            "margin": "14px",
            "top": "0px",
            "right": "0px",
            "bottom": "0px",
            "left": "0px",
            fontSize: "14px"
        })
    });
}

function newRow(data) {
    let _message = data.message;
    let _crewAccountId = data.accountId;
    let _crewTimestamp = data.timestamp;
    var dt = new Date(Date.parse(data.date));
    let localTime = dt.getHours() + ":" + dt.getMinutes().toString().padStart(2, "0");
    let weekdays = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
    let localDay = weekdays[dt.getDay()];
    return new Div({
        class: "clickableDiv",
        backgroundColor: "rgba(255, 255, 255, 0.7)",
        position: "relative",
        height: "auto",
        borderRadius: "10px",
        padding: "10px",
        margin: "10px",
        onclick: function() {
          
            var html = "<h3>boat captain:" + _message.from + "</h3>" +
                "<p><b>subject:</b> " + _message.subject + "</p>" +
                "<p><b>body:</b> " + _message.body + "</p>" +
                "<p><b>driver:</b> " + _message.driver + "</p>" +
                "<p><b>observer:</b> " + _message.observer + "</p>" +
                "<p><b>boat:</b> " + _message.boat + "</p>" +
                "<p><b>location:</b> " + _message.location + "</p>" +
                "<p><b>seats:</b> " + _message.seats + "</p>" +
                "<p><b>going:</b> <span id=\"goingcount\"></span></p>" +
                "<p><b>datetime:</b> " + new Date(Date.parse(_message.datetime)).toLocaleString().substring(0, 17) + "</p>";
          	

            let pageForm = new Div({
                margin: "40px",
                padding: "20px",
                color: "#000000",
                backgroundColor: "#ffffff",
                borderColor: "#000000",
                borderWidth: "2px",
                borderStyle: "solid",
                innerHTML: html
            });
          	let iii1=setInterval(function () {pageForm.querySelector("#goingcount").innerText=pageForm.querySelector("#goingcount").innerText+".";}, 500);
          	let iii2=setInterval(function () {pageForm.querySelector("#goingcount").innerText="";}, 2500);
         	listCrewRequest().then(_requests=>{
              console.log("_requests.length="+_requests.length);
              clearInterval(iii1);
              clearInterval(iii2);
              pageForm.querySelector("#goingcount").innerText=_requests.count;
            })

            pageForm.appendChild(new ActionButton({
                left: "10%",
                right: "10%",
                width: "80%",
                innerText: "Ask to join",
                position: "absolute",
                margin: "auto",
                bottom: "20px",
                top: "unset",
                onclick: () => {
                    PWA.getPWA().setPage(Page.getPage("AsktoJoin"));
                    Page.getPage("AsktoJoin").querySelector("#formCrewAccountId").value = _crewAccountId;
                    Page.getPage("AsktoJoin").querySelector("#formCrewTimestamp").value = _crewTimestamp;
                 
                }
            }));
            Page.getPage("CrewPage").setChild(pageForm);
            PWA.getPWA().setPage(Page.getPage("CrewPage"));
        },
        children: [
            new Div({
                position: "relative",
                fontWeight: "bold",
                innerHTML: _message.subject
            }),
            new Div({
                textAlign: "right",
                fontSize: "small",
                position: "absolute",
                top: "10px",
                right: "10px",
                fontSize: "small",
                innerHTML: localDay + " " + localTime
            }),
            new Div({
                position: "relative",
                fontSize: "small",
                fontStyle: "italic",
                marginTop: "10px",
                innerHTML: "<p style=\"word-wrap: break-word;\">" + _message.body + "</p>"
            }),
        ]
    })
}

export function aPageChangheListener(id) {
    if (id == "ChatPage" && PWA.getPWA().userhash) {
        console.log("page=" + id);
        accountId = "gcode-4" + PWA.getPWA().userhash.toLowerCase() + ".testnet";
        //10160347981689434
        console.log(accountId);
        //lost contract = gcode-eea3047988c.testnet
        (async () => {
            try {
                //await nearConnect();
                //if (!myList.firstChild || !myList.firstChild.id || myList.firstChild.id != "spinnerRow") {
                //    myList.insertBefore(newSpinnerRow(), myList.firstChild);
                //}
                //let accounts = [];
                //accounts.push(accountId);
                //let messageList = JSON.parse(await messages.listMessages({
                 //   accountIds: JSON.stringify(accounts),
                //    max: 30
                //}, 300000000000000));
                //console.log(messageList);
              	let messageList={data:[
                  {message:{subject:"xxxx","body":"xxxxx"},accountId:"xxxx",timestamp:"xxxx",date:(new Date()).toISOString()},
                  {message:{subject:"xxxx","body":"xxxxx"},accountId:"xxxx",timestamp:"xxxx",date:(new Date()).toISOString()},
                  {message:{subject:"xxxx","body":"xxxxx"},accountId:"xxxx",timestamp:"xxxx",date:(new Date()).toISOString()},
                  {message:{subject:"xxxx","body":"xxxxx"},accountId:"xxxx",timestamp:"xxxx",date:(new Date()).toISOString()},
                  {message:{subject:"xxxx","body":"xxxxx"},accountId:"xxxx",timestamp:"xxxx",date:(new Date()).toISOString()},
                  {message:{subject:"xxxx","body":"xxxxx"},accountId:"xxxx",timestamp:"xxxx",date:(new Date()).toISOString()},
                  {message:{subject:"xxxx","body":"xxxxx"},accountId:"xxxx",timestamp:"xxxx",date:(new Date()).toISOString()},
                  {message:{subject:"xxxx","body":"xxxxx"},accountId:"xxxx",timestamp:"xxxx",date:(new Date()).toISOString()},
                  {message:{subject:"xxxx","body":"xxxxx"},accountId:"xxxx",timestamp:"xxxx",date:(new Date()).toISOString()},
                  {message:{subject:"xxxx","body":"xxxxx"},accountId:"xxxx",timestamp:"xxxx",date:(new Date()).toISOString()},
                  {message:{subject:"xxxx","body":"xxxxx"},accountId:"xxxx",timestamp:"xxxx",date:(new Date()).toISOString()},
                  {message:{subject:"xxxx","body":"xxxxx"},accountId:"xxxx",timestamp:"xxxx",date:(new Date()).toISOString()},
                  {message:{subject:"xxxx","body":"xxxxx"},accountId:"xxxx",timestamp:"xxxx",date:(new Date()).toISOString()},
                  {message:{subject:"xxxx","body":"xxxxx"},accountId:"xxxx",timestamp:"xxxx",date:(new Date()).toISOString()},
                  {message:{subject:"xxxx","body":"xxxxx"},accountId:"xxxx",timestamp:"xxxx",date:(new Date()).toISOString()},
                  {message:{subject:"xxxx","body":"xxxxx"},accountId:"xxxx",timestamp:"xxxx",date:(new Date()).toISOString()},
                  {message:{subject:"xxxx","body":"xxxxx"},accountId:"xxxx",timestamp:"xxxx",date:(new Date()).toISOString()},
                  {message:{subject:"xxxx","body":"xxxxx"},accountId:"xxxx",timestamp:"xxxx",date:(new Date()).toISOString()},
                  {message:{subject:"xxxx","body":"xxxxx"},accountId:"xxxx",timestamp:"xxxx",date:(new Date()).toISOString()},
                ]};
              	console.log(JSON.stringify(messageList));
                myList.removeChildren();
                for (var i = 0; i < messageList.data.length; i++) {
                    let _date = messageList.data[i].date;
                    let _message = messageList.data[i].message;
                    myList.appendChild(newRow(messageList.data[i]));
                    listView.appendChild(new Container({
                                      height: "240px",
                                      children: [
                                          new ListTile({
                                              color: "#545454",
                                              title: new Text(_date),
                                              subtitle: new Text((_message.subject || "")),
                                              leading: new Icon(Icons.battery_full),
                                              trailing: new Icon(Icons.star_outline)
                                          }), new Center({})]
                    }));
                }
            } catch (e) {
                console.log(e);
            }

        })();
    }
}

function sendButtonAction(e) {
    var subject = e.parentDiv.querySelector("#formSubject").innerText;
    var body = e.parentDiv.querySelector("#formBody").innerText;
    var driver = e.parentDiv.querySelector("#formDriver").value;
    var observer = e.parentDiv.querySelector("#formObserver").value;
    var date = e.parentDiv.querySelector("#formDate").value;
    var time = e.parentDiv.querySelector("#formTime").value;
    var seats = e.parentDiv.querySelector("#formSeats").value;
    var boat = e.parentDiv.querySelector("#formBoat").innerText;
    var location = e.parentDiv.querySelector("#formLocation").value;
    console.log(date);
    console.log(time);
    if (subject && subject.trim() != "" && body && body.trim() != "") {
        (async () => {
            let message = {
                "from": PWA.getPWA().credentials.name,
                "accountId": accountId,
                "subject": subject,
                "body": body,
                "driver": driver,
                "observer": observer,
                "boat": boat,
                "seats": seats,
                "location": location,
                "datetime": new Date(Date.parse(date + "T" + time + ":00")).toISOString()
            };
            console.log(message);

            PWA.getPWA().setPage("SubmitPage");
            if (messages) await messages.addMessage({
                "message": JSON.stringify(message)
            });
            PWA.getPWA().setPage("ChatPage");
        })();
    }
}

export class CrewDivForm extends DivForm {
    constructor() {
        super({
            paddingTop: "30px",
            formInputs: [{
                    name: "subject",
                    type: "text"
                },
                {
                    name: "body",
                    type: "text",
                    height: "150px"
                },
                {
                    name: "driver",
                    type: "select",
                    height: "40px",
                    options: ["extra not needed", "extra required"]
                },
                {
                    name: "observer",
                    type: "select",
                    height: "40px",
                    options: ["extra not needed", "extra required"]
                },
                {
                    name: "boat",
                    type: "text"
                },
                {
                    name: "location",
                    type: "location",
                    size: "40",
                    country: ["au"]
                },
                {
                    name: "seats",
                    type: "number",
                    min: "1",
                    max: "14",
                    value: "1"
                },
                {
                    name: "date",
                    type: "date"
                },
                {
                    name: "time",
                    type: "time",
                    min: "5:00",
                    max: "18:00",
                    step: "900"
                }
            ],
            sendButton: {
                onclick: sendButtonAction
            }
        });
    }
}

export class Spinner extends Div {
    constructor() {
        super({
            marginLeft: "50%",
            child: new Div({
                classNameOverride: "true",
                class: "loader",
                innerText: "...",
                "margin": "0px",
                "bottom": "40px",
                "right": "auto",
                "height": "40px",
                "width": "40px",
                "marginLeft": "-20px",
                "left": "auto",
                fontSize: "40px"
            })
        });
    }
}



export class LoginButton extends AuthButtons {
    constructor() {
        super({
            facebookkey: "1240916769304778",
            appearance: "list",
            nextPage: "ChatPage"
        });
    }
}