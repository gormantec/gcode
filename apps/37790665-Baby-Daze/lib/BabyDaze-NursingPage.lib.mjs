import {
    PWA,
    Page,
    Div
} from 'https://gcode.com.au/modules/pwa.mjs';
import {Text,Center,Container,ListView,ListTile,Icon,Icons,Video,Form,TextFormField,DateFormField,InputDecoration,Padding,Column,VideoImage,AddVideo} from './flutter-widgets.lib.mjs';


export class Nursing extends Page {
    constructor(params) {
        super({
            "color": "#545454",
            "backgroundColor": "red",
            "hideFloatingActionButton": "true",
            "hideFooter": "true",
            "hideHeader": "true",
            "navigateBackPage": "HomePage",
            "padding": "15px",
            "id": "Nursing",
          	"children":[
              new Div({
                        id: "recButton",
                		right:"10px",
                		top:"10px",
                        width: "50px",
                        height: "50px",
                        fontSize: "50px",
                        color: "white",
                        child: new Icon("done"),
                        onclick: () => {
                          this.resetTimerL();
                          this.resetTimerR();
                        document.querySelector("#titleTextFormField").parentElement.parentElement.style.display="";
                          document.querySelector("#timerFields").style.height="20px";
                          document.querySelector("#timerFieldL").innerText="";
                          document.querySelector("#timerFieldR").innerText="";
                          document.querySelector("#startNursingButtonL > div > i").innerText="play_circle";
                          document.querySelector("#startNursingButtonR > div > i").innerText="play_circle";
              			  PWA.getPWA().showHeader();
                          PWA.getPWA().setPage("HomePage");
                        }
              }),
              new Div({
                        id: "recButton",
                		left:"10px",
                		top:"10px",
                        width: "50px",
                        height: "50px",
                        fontSize: "50px",
                        color: "white",
                        child: new Icon("close"),
                        onclick: () => {
                          
                          this.resetTimerL();
                          this.resetTimerR();

                          document.querySelector("#titleTextFormField").parentElement.parentElement.style.display="";
                          document.querySelector("#timerFields").style.height="20px";
                          document.querySelector("#timerFieldL").innerText="";
                          document.querySelector("#timerFieldR").innerText="";
                          document.querySelector("#startNursingButtonL > div > i").innerText="play_circle";
                          document.querySelector("#startNursingButtonR > div > i").innerText="play_circle";
              			  PWA.getPWA().showHeader();
                          PWA.getPWA().setPage("HomePage");
                        }
              }),
              new Center({
                		left:"60px",
                		right:"60px",
                		top:"10px",
                		height:"50px",
                        child:new Div({
                          id: "recButton",
                          width: "50px",
                          height: "50px",
                          fontSize: "50px",
                          color: "white",
                          child: new Icon("child_care")
              			})
              }),
              new Div({
                		left:"4px",
                		right:"4px",
                		top:"80px",
                		bottom:"4px",
                		borderRadius:"16px",
                		backgroundColor:"white",
                		children:[new Form({
                            top: "20px",
                            left: "20px",
                            right: "20px",
                            fontSize: "12px",

                            children: [
                                new DateFormField({
                                    decoration: new InputDecoration({labelText:'Time',width:"100px"}),
                                    fontSize: "16px",
                                    id: "dateTextFormField"
                                }),
                              	new Center({id: "timerFields",position: "relative",height:"20px",fontSize:"24px",children:[
                                  new Center({
                                    id: "timerFieldL",
                                    top:"20px",
                                    left:"60px",
                                    width: "80px"
                                  }),
                                  new Center({
                                    id: "timerFieldR",
                                    top:"20px",
                                    right:"60px",
                                    width: "80px"
                                  })
                                ]}),
                                new TextFormField({
                                    decoration: new InputDecoration({labelText:'Last start side',width:"100px"}),
                                    fontSize: "18px",
                                  	value:"Left side",
                                    id: "titleTextFormField",
                                  	contenteditable: "false"
                                }),
                              	new Center({position:"relative",height:"100px",child:new Div({width:"210px",children:[
                                  new Div({
                                            id: "startNursingButtonL",
                                            left:"0px",
                                            top:"20px",
                                            width: "50px",
                                            height: "50px",
                                            fontSize: "50px",
                                            color: "#f67904",
                                            child: new Icon("play_circle"),
                                            onclick: () => {
                                              var icon=document.querySelector("#startNursingButtonL > div > i");
                                              if(icon.innerText=="play_circle"){
                                                icon.innerText="pause_circle";
                                                document.querySelector("#titleTextFormField").parentElement.parentElement.style.display="none";
                                                document.querySelector("#timerFields").style.height="56px";
                                                this.startTimerL(document.querySelector("#timerFieldL"));
                                              }
                                              else{
                                                icon.innerText="play_circle";
                                                this.stopTimerL();
                                              }
                                              document.querySelector("#titleTextFormField").innerText="Left side";
                                              
                                            }
                                  }),
                                  new Div({
                                            id: "startNursingButtonR",
                                            top:"20px",
                                            left:"80px",
                                            width: "50px",
                                            height: "50px",
                                            fontSize: "50px",
                                            color: "#f67904",
                                            child: new Icon("play_circle"),
                                            onclick: () => {
                                              var icon=document.querySelector("#startNursingButtonR > div > i");
                                              if(icon.innerText=="play_circle"){
                                                icon.innerText="pause_circle";
                                                document.querySelector("#titleTextFormField").parentElement.parentElement.style.display="none";
                                                document.querySelector("#timerFields").style.height="56px";
                                                document.querySelector("#timerFieldR").innerText=this.getTimerValueR();
                                                this.startTimerR(document.querySelector("#timerFieldR"));
                                              }
                                              else{
                                                icon.innerText="play_circle";
                                                this.stopTimerR();
                                              }
                                              document.querySelector("#titleTextFormField").innerText="Right side";
                                            }
                                  }),
                                  new Div({
                                            id: "stopNursingButton",
                                            right:"0px",
                                            top:"20px",
                                            width: "50px",
                                            height: "50px",
                                            fontSize: "50px",
                                            color: "#f67904",
                                            child: new Icon("stop_circle"),
                                            onclick: () => {
                                              var icon=document.querySelector("#startNursingButtonL > div > i");
                                              icon.innerText="play_circle";
                                              
                                              icon=document.querySelector("#startNursingButtonR > div > i");
                                              icon.innerText="play_circle";
                                                document.querySelector("#titleTextFormField").parentElement.parentElement.style.display="";
                                                document.querySelector("#timerFields").style.height="20px";
                                                document.querySelector("#timerFieldL").innerText="";
                                                document.querySelector("#timerFieldR").innerText="";
                                                this.stopTimerL();
                                                this.stopTimerR();
                                            }
                                  }),
                                ]})}),
                                new TextFormField({
                                    decoration: new InputDecoration({labelText:'Notes'}),
                                    fontSize: "12px",
                                    height: "65px",
                                    id: "commentTextFormField"
                                }),
                            ]
                        })]
              })
          	],
            onopen: ()=>{
              PWA.getPWA().hideHeader();
            }
        });
    }

    startTimerR(e)
    {
      if(this.timerR==null)this.timerR=0;
      this.startTimeR=Date.now();
      this.startedR=true;
      e.innerText=this.getTimerValueR();
      this.anIntervalR=setInterval(()=>e.innerText=this.getTimerValueR(),1000);
    }
  	stopTimerR()
    {
      console.log(this.timerR);
      if(this.timerR!=null && this.startedR)
      {
          let now=Date.now();
          this.timerR=this.timerR+(now-this.startTimeR);
          this.startTimeR=now;
          this.startedR=false;
          if(this.anIntervalR)clearInterval(this.anIntervalR);
      }
      console.log(this.timerR);
    }
  	resetTimerR()
    {
      this.stopTimerR();
      this.timerR=0;
    }
  	getTimerValueR()
    {
      	if(this.timerR==null)this.timerR=0;
        if(this.startedR==true)
        {
          let now=Date.now();
          this.timerR=this.timerR+(now-this.startTimeR);
          this.startTimeR=now;
        }
      	return Math.floor(this.timerR/60000)+":"+(Math.floor((this.timerR-Math.floor(this.timerR/60000)*60000)/1000)+"").padStart(2, "0");
    }
  
    startTimerL(e)
    {
      if(this.timerL==null)this.timerL=0;
      this.startTimeL=Date.now();
      this.startedL=true;
      e.innerText=this.getTimerValueL();
      this.anIntervalL=setInterval(()=>e.innerText=this.getTimerValueL(),1000);
    }
  	stopTimerL()
    {
      console.log(this.timerL);
      if(this.timerL!=null && this.startedL)
      {
          let now=Date.now();
          this.timerL=this.timerL+(now-this.startTimeL);
          this.startTimeL=now;
          this.startedL=false;
          if(this.anIntervalL)clearInterval(this.anIntervalL);
      }
      console.log(this.timerL);
    }
  	resetTimerL()
    {
      this.stopTimerL();
      this.timerL=0;
    }
  	getTimerValueL()
    {
      	if(this.timerL==null)this.timerL=0;
        if(this.startedL==true)
        {
          let now=Date.now();
          this.timerL=this.timerL+(now-this.startTimeL);
          this.startTimeL=now;
        }
      	return Math.floor(this.timerL/60000)+":"+(Math.floor((this.timerL-Math.floor(this.timerL/60000)*60000)/1000)+"").padStart(2, "0");
    }
}