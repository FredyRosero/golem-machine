// Const
const CELLTAPEWIDTH = 20;
const CELLTAPEWIDTHPADDING = 0;
const TIME = 100;
var intervalId;

class World {
    golem;
    constructor(htmlContainer){
        
        this.htmlContainer = htmlContainer;

        //Tape
        this.tape = document.getElementById("inputTape");
        //this.tape.value = "0123456789";
        this.tape.value = "$1#11##111##"; //Q
        this.tape.value += "11##"; //A 
        this.tape.value += "1#11##"; //Sigma=0,1
        this.tape.value += "10101#"; //d(q0,0)=q0
        this.tape.value += "1011011#"; //
        this.tape.value += "1101011#"; //
        this.tape.value += "110110111#"; //
        this.tape.value += "111010111#"; //
        this.tape.value += "11101101###"; //
        this.tape.value += "1#11#1#1#11_"; // 01001 */
        this.tape.addEventListener('input',this.updateTapeWidth)

        // Start button
        var startButton = document.getElementById("start");

        //Golem
        this.golem = new Golem(document.getElementById("golem"));                     
        this.golem.home = document.getElementById("golemsHome");;
        this.golem.dialogHTML = document.getElementById("dialog");;
        this.golem.boardHTML = document.getElementById("board");;
        this.golem.previousCellsHTML = document.querySelector("#board .previousCells");
        this.golem.actualCellHTML = document.querySelector("#board .actualCell");
        this.golem.nextsCellsHTML = document.querySelector("#board .nextsCells");
           
        this.golem.tape = this.tape;
        // When it's done...
        this.golem.onDone.push(function () {
            //alert("Done!")
            startButton.innerHTML = "Start";
        })
        this.htmlContainer.appendChild(this.golem.htmlElement);
        
        this.golem.centerPos = centerOfHtmlBox(this.golem.home);
        
        //Start button
        var velocitySlider = document.getElementById("velocity");
        velocitySlider.addEventListener('change',function (e) {
            let val = e.target.value;
            console.log("velocity:",val)
            golem.velocity = val;
            let animSpeed = ( ((1-0.001)/(1-100))*val ) - (((1-0.001)/(1-100))-1) + "s";
            console.log("animSpeed",animSpeed);
            golem.htmlElement.style.animationDuration = animSpeed;
        })  
        
        this.init();   
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