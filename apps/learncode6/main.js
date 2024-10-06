//these give us access to the objects in the html
const mainarea = document.querySelector("#mainarea");
const circle = document.querySelector("#circle");
const square = document.querySelector("#square");
const sometext1 = document.querySelector("#sometext1");
const startbutton = document.querySelector("#startbutton");
var count=0;

//this is a simple example of a function that will be called 4 times a second
//you can do what you want in here, "setInterval" controls how often it is called.
function runloop(){
  var newPosition=20+count*20;
  console.log("DEBUG: I am moving the square to "+newPosition+"px");
  square.style.left=""+newPosition+"px";
  count=count+1;
  if(count>40){
    count=0;
    //show the text after ten seconds
    sometext1.style.display="block";
    setTimeout(function(){
      //hide the text again after two seconds
      sometext1.style.display="none";
    },2000);
  }
}


//this is a more complicated example function. It calls the animate function, passing a function that moves the circle 
//down for 1000ms 'then' when that is done moves it up for 1000ms, then calls the function again and again and again.
function bounceball()
{
  animate(function(progress){
      circle.style.top = 320 + progress * 300 + 'px';
  },1000).then(function(){
      animate(function(progress){
        circle.style.top = 620 - progress * 300 + 'px';
      },1000).then(bounceball);
  });
}

startbutton.onclick=function(){
  //run 'runloop' every 250ms, this will count to 20 and start again by setting count equal to zero.
  setInterval(runloop,250);
  //this starts a recursive loop calling 'bounceball'.
  bounceball();
}
