(function(w){
  
  function Relogio(container){
    
	this.container = container;    
    this.initialize(); 
  }
  
  Relogio.prototype.initialize = function(){
        this.clockdata = {
          h: 0,
          m: 0,
          s: 0,
          ms: 0
        };
        this.canvas = createCanvas(this.container);
    	this.ctx = this.canvas.getContext("2d");
    	this.size = this.canvas.width;
    	this.beginLoop();
  };
  
  function deg2rad(deg){
    return deg * Math.PI / 180;
  }
  
  function rotate(point, deg, center){
    var ang = deg2rad(deg);
    point = {
      x: point.x - center.x,
      y: point.y - center.y
    };
    var rotatedPoint = {
       x: ( point.x * Math.cos(ang) ) - (point.y * Math.sin(ang) ) + center.x,
       y: ( point.x * Math.sin(ang) ) + (point.y * Math.cos(ang) ) + center.y,
    };
    return rotatedPoint;
  }
  
  function draw(){    
    drawClock.call(this);
    drawPointers.call(this);    
  };
  
  function drawPointers(){
    
    var ctx = this.ctx;
    var size = this.size;
    var sizeBlock = size * .05;
  
    var center = {
      x: size / 2,
      y: size / 2
    };
    
    var positions = {
      seconds: {
        x: size / 2 ,
      	y: sizeBlock  + sizeBlock / 4
      },
      minutes: {
        x: size / 2 ,
      	y: sizeBlock  + sizeBlock 
      },
      hours: {
        x: size / 2 ,
      	y: sizeBlock  + sizeBlock * 3.5
      } 
    }
        
    var angles = {
      seconds: (this.clockdata.s / 60) * 360,
      minutes: (this.clockdata.m / 60) * 360,
      hours: (this.clockdata.h / 12) * 360
    };
    
    positions.seconds = rotate(positions.seconds, angles.seconds, center);
    positions.minutes = rotate(positions.minutes, angles.minutes, center);
	positions.hours = rotate(positions.hours, angles.hours, center);
	 	
    var conterMinutes = {
      x: ( 2 * center.x + ( center.x + (center.x - positions.minutes.x) ) ) / 3,
      y: ( 2 * center.y + ( center.y + (center.y - positions.minutes.y) ) ) / 3
    };
    
    var conterSeconds = {
      x: center.x + (conterMinutes.x - positions.seconds.x) ,
      y: center.y + (conterMinutes.y - positions.seconds.y) 
    };
    
    
    ctx.strokeStyle = "#777";
	  ctx.lineWidth = 6;    
    
    ctx.beginPath();
    ctx.moveTo(positions.minutes.x, positions.minutes.y);
    ctx.quadraticCurveTo(conterMinutes.x, conterMinutes.y, positions.hours.x, positions.hours.y);    
    ctx.stroke();
    ctx.closePath();
       
    ctx.strokeStyle = "black";
    ctx.lineWidth = 4;

    ctx.beginPath();
    ctx.arc(positions.seconds.x, positions.seconds.y, 20, 0, Math.PI * 2);
    ctx.stroke();
    ctx.closePath();   
    
    var jointPosition = {
      x: positions.seconds.x, 
      y: positions.seconds.y + (sizeBlock / 4 * 3) 
    };
    
    jointPosition = rotate(jointPosition, angles.seconds, positions.seconds);
    
    ctx.beginPath();
    ctx.moveTo(jointPosition.x, jointPosition.y );
    ctx.quadraticCurveTo(conterSeconds.x, conterSeconds.y, positions.minutes.x, positions.minutes.y);    
    ctx.stroke();
    ctx.closePath();
    
  }
  
  function drawClock(){
    var ctx = this.ctx;
    var size = this.size;
    var sizeBlock = size * .05;
    var center = size / 2;
    
    ctx.clearRect(0, 0, size, size);
    
    ctx.strokeStyle = "black";
    ctx.shadowBlur=1;
	  ctx.shadowColor="black";
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.font = "14pt sans-serif";
    
    var position = {
      x: size / 2 ,
      y: sizeBlock 
    };
    
    for(var i = 0; i < 60; i++){
      var angle = i * 6;
      
      ctx.save();
      ctx.translate(center, center);
      ctx.rotate(deg2rad(angle));
      ctx.translate(-center, -center);
      
      if( i % 5 == 0){      
        
        var reverseAngle = ( 360 * 3 ) - (angle );
        reverseAngle %= 360;
        
        ctx.save()
        ctx.translate(position.x, position.y + sizeBlock / 5);
        ctx.rotate(deg2rad(reverseAngle));
        ctx.translate(-position.x, -(position.y + sizeBlock / 5));
        
        var hora = (( i / 5 ) || 12);      
        ctx.beginPath();
        ctx.fillText( hora , position.x, position.y + sizeBlock / 5);
        ctx.fill();
        ctx.closePath();        
        ctx.restore();
      }

	  ctx.beginPath();
      if( i % 5 ){        
        
      	ctx.moveTo(position.x, position.y  );
    		ctx.lineTo(position.x, position.y + sizeBlock /2);
    		
				ctx.stroke();

      }else{
			} 
      ctx.closePath();     
      ctx.restore();
  	}
  }
  
  function update(){
    
    var time = new Date();     
    this.clockdata.h = time.getHours();
	  this.clockdata.m = time.getMinutes();
	  this.clockdata.s = time.getSeconds();
	  this.clockdata.ms = time.getMilliseconds();    
    this.clockdata.h += (this.clockdata.m / 60);
	  this.clockdata.m += (this.clockdata.s / 60);
    this.clockdata.s += (this.clockdata.ms / 1000);   
  };
  
  function loop(){
    
    update.call(this);
    draw.call(this);
    
    requestAnimationFrame(loop.bind(this));    
  };
  
  Relogio.prototype.beginLoop = function(){
    
    loop.call(this);
    
  };
  
  function createCanvas(cont){		
    var size = Math.min(cont.offsetWidth, cont.offsetHeight);
    var canvas = document.createElement("canvas");
    canvas.width = size;
    canvas.height = size;
    cont.appendChild(canvas);
    return canvas;
  }
  
  w.Relogio = Relogio;
  
}(window))

 
var relogio = new Relogio(document.querySelector(".relogio"));
 