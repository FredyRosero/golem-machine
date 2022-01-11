class Golem {
    
    // HTML
    htmlElement;
    width = 32;
    height = 32;

    //Logic
    destx = 0;
    desty = 0;  
    stops = [];
    tape;  
    velocity = 10;   
    w_m="";
    isStarted = false;
    isGoingHome = false;
    isWorking = false;
    stopTime = 500; //ms    
    isReady = false;    
    isReadyCount = 0;
    _home;
    _isPaused = true;
    _isAtStop = false;
    _isDone = false;

    //Animation
    animationInterval;
     
    /**
     * Constructor
     */
    constructor(html) {
        this.htmlElement = html;
    }

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
     * Set the destination of movement as the center of his home.
     */
    setDestinationAsHome() {  
        var pos = this.homePos();   
        this.setDestinationAs(pos);     
    }

    /**
     * 
     * @param {Object} pos A object with 'x' and 'y' propesties which are the coordinates of the movement destination.
     */
    setDestinationAs(pos) {  
        this.destx = pos.x;
        this.desty = pos.y;
    }    

    /**
     * @returns True if the golem has stops to walk.
     */
    hasWork() {
        return this.stops.length !== 0;
    }

    /**
     * A infinite loop that updates the golem each frame.
     */
    update() {
        if(this._isPaused) return;
        // Check actual destination
        var nextStop;
        // If there is a destination set it as destination 
        if (this.hasWork()) {        
            nextStop = this.stops.at(0);
            this.setDestinationAs(nextStop);
            this.isGoingHome = false;
            this.isWorking = true;  
        } 
        //  If there isn't a destination set destination home
        else {            
            this.setDestinationAsHome();
            this.isGoingHome = true;
            this.isWorking = false;  
        }
        
        // Move (if it has work to do and it's not paused) or (it has to go home and isn't at home)
        if ((this.isWorking && !this.isPaused) || (this.isGoingHome && !this.isAtHome())) {
            //console.log(this.isGoingHome,this.isAtHome())
            this.moveTo(this.destx,this.desty)
            console.log("The golem is moving!. golem.velocity:",golem.velocity);
            
        }
        // It doesn't have work to do or it's paudes AND it doesn't have to go gome or it's at home
        else {
            if(!this.hasWork() && this.isAtHome() &&  this.isDone==false && this.isStarted==true) {
                this.isDone = true;
                console.log("The job is done!")
            }
            //console.log("The golem wont' move")
            this.htmlElement.classList.add("idle");
            this.htmlElement.classList.remove("movingRight");
            this.htmlElement.classList.remove("movingLeft");
        }
    }

    /**
     * Triggered when the golem arrives at his actual destination
     */
    onArrived() {
        //console.log("The golem arrived!")
        this.isAtStop = true; 
        var isReadyCountLimit = this.stopTime/(TIME*(this.velocity/10))
        if (this.isReadyCount >= isReadyCountLimit) {
            this.stops.shift();
            this.isReadyCount = 0;
        }
        this.isReadyCount++;

        //Anim
        this.htmlElement.classList.add("idle");
        this.htmlElement.classList.remove("movingRight");
        this.htmlElement.classList.remove("movingLeft");        
    }

    /**
     * Move the golem a little bit in direction of the movement destination.
     * @param {*} dposx The x coordinate of the movement destination
     * @param {*} dposy The y coordinate of the movement destination
     */
    moveTo(dposx,dposy) {
                
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

        if(dist.x<0) {
            this.htmlElement.classList.add("movingLeft");
            this.htmlElement.classList.remove("movingRight");
        }
        else if(dist.x>0) {
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
            this.constructStops() 
        }   
        console.log("Golem played");     
        this.isPaused = false; 
        this.isStarted = true;
        this.isDone = false;
        
    }

    /**
     * Pauses the golem's work.
     */
    stop() {
        console.log("Golem paused");
        this.isPaused = true; 
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
    }

    /**
     * Creates the reading stops.
     */
    constructStops() {
        let y = this.tape.offsetTop - 10;
        let x = this.tape.offsetLeft + CELLTAPEWIDTH/2;// + 0 + (this.width/2);
        for (let i = 0; i < this.w_m.length; i++) {            
            this.stops.push({x:x,y:y});         
            x += CELLTAPEWIDTH;
        }  
    }

    static getStopTime(){

    }

}