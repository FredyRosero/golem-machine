// Const
const CELLTAPEWIDTH = 20;
const CELLTAPEWIDTHPADDING = 8;
const TIME = 100;
var intervalId;

class World {
    golem;
    constructor(htmlContainer){
        
        this.htmlContainer = htmlContainer;

        //Tape
        this.tape = document.getElementById("inputTape");
        this.tape.value = "$1#11##11###01"; 
        this.tape.addEventListener('input',this.updateTapeWidth)

        //Start button
        var startButton = document.getElementById("start");

        //Start button
        var velocitySlider = document.getElementById("velocity");
        velocitySlider.addEventListener('change',function (e) {
            let val = e.target.value;
            console.log("velocity:",val)
            golem.velocity = val;
        })

        //Golem
        this.golem = new Golem(document.getElementById("golem"));                     
        this.golem.home = startButton;
           
        this.golem.tape = this.tape;
        // When it's done...
        this.golem.onDone.push(function () {
            //alert("Done!")
            startButton.innerHTML = "Start";
        })
        this.htmlContainer.appendChild(this.golem.htmlElement);
        this.init();   
        this.golem.centerPos = centerOfHtmlBox(startButton);             
    }

    init() {
        this.tape.dispatchEvent( new InputEvent("input") );
        intervalId = setInterval(function () {
            world.updateAnimation();
        }, TIME);        
    }    

    updateTapeWidth (e) {
        var lenght = this.value.length;
        var width = ((lenght + 1) * CELLTAPEWIDTH) - CELLTAPEWIDTHPADDING + 'px';
        this.style.width = width;
    }        

    updateAnimation() {
        //console.log(this.world.golem.homePos())
        this.golem.update();
    }    
}