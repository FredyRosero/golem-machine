//Init
world = new World(document.getElementById("world"));
golem = world.golem;

document.getElementById("start").addEventListener("click", onClickStart); 

document.getElementById("reset").addEventListener("click", onClickReset); 

function onClickStart() {    
    if (golem.isPaused) {
        golem.start();  
        this.innerHTML = "Stop";   
    }
    else {
        this.innerHTML = "Play";
        golem.stop();     
    }
}

function onClickReset() {    
    console.log("onClickReset");
    golem.reset();
}
