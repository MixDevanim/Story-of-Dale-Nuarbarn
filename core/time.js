var Time = {
    maxDelta: 1e-5,
	time: 0.0,
    fpsTimer: 0.0,
    dt: 0.0,
    framerateMeasured: 1.0,
    
    update: function(now){
        this.dt = now * 0.001 - this.time;
        this.time = now * 0.001;
        this.fpsTimer += this.dt;
        if (this.dt > this.maxDelta)
            this.maxDelta = this.dt;
        
        if (this.fpsTimer > 0.25){
            this.fpsTimer = 0.0;
            
            this.framerateMeasured = 1.0/this.maxDelta;
            
            this.maxDelta = 1e-5;
        }
    },
}
