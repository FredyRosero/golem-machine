class Golem {
    
    // PROPERTIES:

    // HTML
    htmlElement;
    dialogHTML;
    boardHTML;
    boardText;    
    previousCellsHTML;
    actualCellHTML;
    nextsCellsHTML;    
    width = 32;
    height = 32;
    _home;

    //Logic
    destX = 0;
    destY = 0;  
    stops = [];
    tasks = [];
    tape;  
    w_m="";
    actualCellIndex = 0;
    actualCell = "?";
    previousCells = "??";
    nextsCells = "??";
    velocity = 10;   

    //States
    isStarted = false;
    isGoingHome = false;
    isMoving = false;   
    isReading = false;
    isReadingLeft = false;   
    isReadingRight = false;   
    isReady = false;    
    isReadyCount = 0;
    isSearching = false;
    isOnReail = false;    
    _isPaused = true;
    _isAtStop = false;
    _isDone = false;
    hasToDrop = false;

    //Animation
    animationInterval;
    stopTime = 500; //ms    
     
    /**
     * CONSTRUCTOR:
     */
    constructor(html) {
        this.htmlElement = html;
    }

    // GETTERS AND SETTERS:

    set home(val) {
        //console.log("set home",val)
        this._home = val;
    }
    get home() {
        return this._home;
    }    

    set isPaused(val) {
        //console.log("set isPaused",val)
        this._isPaused = val;
        if(val) this.onPausedListener();
        else this.onPlayedListener();
    }
    get isPaused() {
        return this._isPaused;
    }       
    onPaused = [];
    onPausedListener() {
        for (let i = 0; i < this.onPaused.length; i++) {
            this.onPaused[i]();
        }        
    } 
    onPlayed = [];
    onPlayedListener() {
        for (let i = 0; i < this.onPlayed.length; i++) {
            this.onPlayed[i]();
        }        
    }    
    
    set isDone(val) {
        console.log("set isDone",val)
        this._isDone = val;
        if(val) this.onDoneListener();
    }
    get isDone() {
        return this._isDone;
    }       
    onDone = [];
    onDoneListener() {
        for (let i = 0; i < this.onDone.length; i++) {
            this.onDone[i]();
        }        
    }     

    set isAtStop(val) {
        //console.log("set isAtStop",val)
        this._isAtStop = val;
    }
    get isAtStop() {
        var opos = this.centerPos;
        var dpos = { x: this.destX, y: this.destY};        
        //Check if arrived       
        if ((opos.x == dpos.x) && (opos.y == dpos.y) ) {
            this._isAtStop = true;               
        } else {
            this._isAtStop = false; 
        }        
        return this._isAtStop;
    }      

    /**
     * Move the box from the top-left corner
     */
    set pos(obj) {
        //console.log("set pos",obj.x,obj.y)
        this.htmlElement.style.top = obj.y  + 'px';
        this.htmlElement.style.left = obj.x + 'px';        
    }
    get pos() {
        return { x: this.htmlElement.offsetLeft, y: this.htmlElement.offsetTop}
    }

    set centerPos(obj) {
        //console.log("set relPos",obj.x,obj.y)
        this.htmlElement.style.top = obj.y - (this.height/2) + 'px';
        this.htmlElement.style.left = obj.x - (this.width/2)+ 'px';      
    }       
    get centerPos() {
        let x = this.htmlElement.offsetLeft + (this.width/2);
        let y = this.htmlElement.offsetTop + (this.height/2);
        return { 
            x: x, 
            y: y
        }
    }

    // BUSINESS LOGIC:

    /**
     * @returns The center of the golme's home.
     */
    homePos() { // Optimizar
        return centerOfHtmlBox (this.home);
    }

    /**
     * @returns True if the golem it's at home, otherwise false.
     */
    isAtHome() {
        var pos = this.homePos();
        return ((pos.x == this.centerPos.x) && (pos.y == this.centerPos.y) )   
    }
    
    /**
     * Set the destination of movement at the center of his home.
     */
    setDestinationAtHome() {  
        var pos = this.homePos();   
        this.setDestinationAt(pos);     
    }

    /**
     * 
     * @param {Object} pos A object with 'x' and 'y' propesties which are the coordinates of the movement destination.
     */
    setDestinationAt(pos) {  
        this.destX = pos.x;
        this.destY = pos.y;
    }    

    /**
     * Set the destination of movement at the end of the tape.
     */
    setDestinationAtTapeEnd() {  
        var pos = { x: this.tape.offsetLeft + this.tape.offsetWidth,
                    y: this.tape.offsetTop + this.tape.offsetHeight
        }
        this.setDestinationAt(pos);     
    }    

    /**
     * Set the destination of movement at the beginning of the tape.
     */
    setDestinationAtTapeBeginning() {  
        var pos = { x: this.tape.offsetLeft,
                    y: this.tape.offsetTop
        }
        this.setDestinationAt(pos);     
    }        

    /**
     * @returns True if the golem has stops to walk.
     */
    hasWork() {
        return this.tasks.length > 0;
    }
    
/*     isOnRail() {
        var opos = this.centerPos;
        var dpos = { x: this.tape.offsetLeft,
                     y: this.tape.offsetTop      
        }

        //Check if arrived       
        if ((opos.y == dpos.y) ) {
            this.onArrived();    
            return;              
        } else {
            this.isAtStop = false; 
        }
                
    } */


    updateDialog(str) {
        this.dialogHTML.innerHTML = str;
    }
    
    /**
     * Read the symbol where the golem is standing and store the previous and nexts depending
     * on the direction of reading.
     */
    readCells() {  
        // If it's at the same cell, return
        if (golem.actualCellIndex == golem.getActualCellIndex()) return;    
        console.log("The golem is reading")
        // To store de old cell...
        // If the golem is moving to left
        if (golem.isReadingLeft) {
            // Shift the string to right: XY -> X
            golem.nextsCells = golem.nextsCells.slice(0,1)
            // Add the new symbol: X -> ZX
            golem.nextsCells = golem.actualCell+golem.nextsCells;
            // TODO:
            golem.previousCells = "??";
        }
        // If the golem is moving to right
        else if (golem.isReadingRight) {
            // Shift the string to left: XY -> Y
            golem.previousCells = golem.previousCells.slice(1,2);
            // Add the new symbol: X -> XZ
            golem.previousCells = golem.previousCells+golem.actualCell;    
            // TODO:
            golem.nextsCells = "??";        
        }
        // Store the now actual cell...
        golem.actualCell = golem.getActualCellValue();
        golem.actualCellIndex = golem.getActualCellIndex();

        // Update html
        golem.previousCellsHTML.innerHTML = golem.previousCells;
        golem.actualCellHTML.innerHTML = golem.actualCell;
        golem.nextsCellsHTML.innerHTML = golem.nextsCells;
    }    

    /**
     * A infinite loop that updates the golem each frame.
     */
    update() {
        if(this._isPaused) {
            this.htmlElement.removeAttribute("class");
            this.htmlElement.classList.add("idle");      
            return;
        }

        if (this.isReading) this.readCells()
        
        this.updateDialog(this.actualCell);

        // If there is a work to do 
        if (this.hasWork()) {        
            this.doWork();
            this.isGoingHome = false;
            // this.isMoving = true;  
        } 
        else {            
            this.setDestinationAtHome();
            this.isGoingHome = true;
            // this.isMoving = false;  
        }
        
        // Move (if it has work to do and it's not paused) or (it has to go home and isn't at home)
        if ((this.isMoving && !this.isPaused) || (this.isGoingHome && !this.isAtHome())) {
            //console.log(this.isGoingHome,this.isAtHome())
            this.moveTo(this.destX,this.destY)
            console.log("The golem is moving!. golem.velocity:",golem.velocity);
            
        }
        // It doesn't have work to do or it's paudes AND it doesn't have to go gome or it's at home
        else {
            if(!this.hasWork() && this.isAtHome() &&  this.isDone==false && this.isStarted==true) {
                this.isDone = true;
                console.log("The job is done!")
            }
            console.log("The golem wont' move")
        }
    }

    /**
     * Triggered when the golem arrives at his actual destination
     */
    onArrived() {
        this.isMoving = false;
        let time = this.stopTime/(this.velocity/10)
        console.log("The golem arrived!",time)

        // Animation
        this.htmlElement.removeAttribute("class");
        if(this.hasToDrop) {            
            this.htmlElement.classList.add("dropping");
            golem.hasToDrop = false;
            console.log("Dropping a pebble");
        } else {
            this.htmlElement.classList.add("idle");
        }
        
        var intervalId = setInterval(function () {
            golem.isMoving = true;
            //console.log("Interval fired");
            clearInterval(intervalId);
        }, time);  

/*         this.isAtStop = true; 
        this.isMoving = false;
        var isReadyCountLimit = this.stopTime/(TIME*(this.velocity/10))
        if (this.isReadyCount >= isReadyCountLimit) {
            this.isReadyCount = 0;
            this.isMoving = true;
        }
        this.isReadyCount++; */

        //Anim
     
    }

    /**
     * Move the golem a little bit in direction of the movement destination.
     * @param {*} dposx The x coordinate of the movement destination
     * @param {*} dposy The y coordinate of the movement destination
     */
    moveTo(dposx,dposy) {

        this.boardText = "Prevous symbols: <br>"+this.w_m.slice(this.getActualCellIndex()-1,this.getActualCellIndex()+1);
                
        var opos = this.centerPos;
        var dpos = { x: dposx, y: dposy};        

        //Check if arrived       
        if ((opos.x == dpos.x) && (opos.y == dpos.y) ) {
            this.onArrived();    
            return;              
        } else {
            this.isAtStop = false; 
        }
        
        // Math
        var dist = { x: dpos.x - opos.x, y: dpos.y - opos.y};
        var norm = Math.sqrt(Math.pow(dist.x,2) + Math.pow(dist.y,2));
        // If the next step is too big for the velocity
        if (norm>this.velocity) dist = { x: this.velocity*dist.x/norm, y: this.velocity*dist.y/norm}
        var fpos = { x: opos.x + dist.x, y: opos.y + dist.y };
        //console.log(opos,dpos,dist,fpos);
        // Set position
        this.centerPos = fpos; // TODO:

        // Animation & Direction
        this.htmlElement.removeAttribute("class");
        if(dist.x<0) {
            this.isReadingRight = false;
            this.isReadingLeft = true;
            this.htmlElement.classList.add("movingLeft");
            this.htmlElement.classList.remove("movingRight");
        }
        else if(dist.x>0) {
            this.isReadingRight = true;
            this.isReadingLeft = false;            
            this.htmlElement.classList.add("movingRight");
            this.htmlElement.classList.remove("movingLeft");
        }
    }

    /**
     * Starts the golem's work
     */
    start() {
        if (this.isDone || !this.isStarted) {
            this.stops = []
            this.w_m = this.tape.value;
            console.log("Golem started!",this.w_m);
            this.constructTasks() 
        }   
        console.log("Golem played");     
        this.isPaused = false; 
        this.isStarted = true;
        this.isMoving = true;
        this.isDone = false;
        
    }

    /**
     * Pauses the golem's work.
     */
    stop() {
        console.log("Golem paused");
        this.isPaused = true; 
        this.isMoving = false;
    }

    /**
     * Restore the initial parameters of the golem's work.
     */    
    reset(){
        console.log("Golem reseted");
        this.isDone = true;
        this.isStarted = false;
        this.stops = []
        this.w_m = this.tape.value;
        this.actualCell = "?";
        this.previousCells = "??";
        this.nextsCells = "??";        
    }


    goToLeft() {
        console.log("goToLeft");
        golem.setDestinationAtTapeBeginning();
        return golem.isAtStop;
    }

    goToRight() {
        console.log("goToRight");
        golem.setDestinationAtTapeEnd();
        golem.isReading = true;
        return golem.isAtStop;
    }

    goToQ0() {
        golem.setDestinationAtCell(1);
        golem.stopTime = 2000;
        golem.hasToDrop = true;
        return golem.isAtStop;
    }
    

    /**
     * Creates the reading stops.
     */
    constructTasks() {
        this.tasks.push(this.goToRight);
        this.tasks.push(this.goToQ0);
        this.tasks.push(this.goToLeft);        
    }

    doWork() {
        var task = this.tasks.at(-1);
        if (task()) this.tasks.pop();
    }

    /**
     * Creates the reading stops.
     */
    constructStops() {
        let y = this.tape.offsetTop - 10;
        //Go to cell #1 and put a pebble
        let x = this.tape.offsetLeft + CELLTAPEWIDTH/2;// + 0 + (this.width/2);
        this.stops.push({x:x,y:y});    

/*         for (let i = 0; i < this.w_m.length; i++) {            
            this.stops.push({x:x,y:y});         
            x += CELLTAPEWIDTH;
        }   */
    }

    /**
     * @returns Return the index of the cell in which it's standing.
     */
    getActualCellIndex() {
        let x = this.tape.offsetLeft + this.centerPos.x + this.width/2;
        x = Math.floor(x / CELLTAPEWIDTH)-1;
        if( x > this.w_m.length-1) return this.w_m.length-1;
        else if (x <= 0) return 0;
        else return x;
    }

    /**
     * @returns Return the symbol of the cell in which it's standing.
     */
    getActualCellValue() {        
        let i = this.getActualCellIndex();
        return this.w_m[i];
    }

    setDestinationAtCell(n) {
        let y = this.tape.offsetTop - 10;
        let x = this.tape.offsetLeft + CELLTAPEWIDTH/2;
        x += CELLTAPEWIDTH*n;
        let pos = {x:x,y:y};
        this.setDestinationAt(pos); 
    }

    static getStopTime(){

    }

}