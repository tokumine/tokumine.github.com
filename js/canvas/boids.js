
// // Mr Doob stats.js
// var stats = new Stats();
// stats.domElement.style.position = 'absolute';
// stats.domElement.style.left = '0px';
// stats.domElement.style.top = '0px';
// window.document.body.appendChild( stats.domElement );

// setup mouse handler
var mouse = initMouse();
mouse.showStats = false;
mouse.visible = true;
mouse.pos.x = window.innerWidth/2;
mouse.pos.y = window.innerHeight/2;

// setup core canvas and get screen canvas
var canvas = document.createElement('canvas');
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;
document.body.appendChild(canvas);
var ctx = canvas.getContext('2d');

// particle init
var particles = [];
for(var i = 0; i < 200; i++){
    var p = new Particle();

    var angle = Math.random() * Math.PI * 2; // in radians

    p.pos.x = Math.cos(angle) * (Math.random() * 1000 - 500) + window.innerWidth/2;
    p.pos.y = Math.sin(angle) * (Math.random() * 1000 - 500) + window.innerHeight/2;
    particles.push(p);
}

// initialise core loop
setInterval(function(){
    stats.update();
    loop();
}, 1000/60);

// clear screen and draw mouse
function loop(){
    ctx.fillStyle="rgba(0,0,0,0.1)";
    ctx.fillRect(0,0,canvas.width, canvas.height);

    // ctx.clearRect(0,0,canvas.width, canvas.height);
    mouse.draw(ctx);

    for (var i = 0; i < particles.length; i++){
        var p = particles[i];

        p.update(canvas, mouse);
        p.draw(ctx);
    }
}



function Particle(){
    var pos = this.pos = new Vector2(0,0);
    var vel = this.vel = new Vector2(0,0);
    var acc = this.acc = new Vector2(0,0);

    // boidy behaviour
    var b1 = this.b1 = new Vector2(0,0);
    var b2 = this.b2 = new Vector2(0,0);
    var b3 = this.b3 = new Vector2(0,0);
    var b4 = this.b4 = new Vector2(0,0);

    var counter = 0;
    var opacity = 1;//Math.random() * 0.5 + 0.5
    var size = 1;//Math.random() * 10 + 5

    // combined rule 1 + 3
    this.rule1 = function(){
        var tmpV = new Vector2(0,0);
        var tmpV2 = new Vector2(0,0);

        var count = 0;
        for(var i = 0; i < particles.length; i++){
            var p = particles[i];
            if (p != this && this.pos.isCloseTo(p.pos,100)){
                tmpV.plusEq(p.pos);
                tmpV2.plusEq(p.vel);
                count++;
            }
        }

        if (count > 0){
            tmpV.divideEq(count);
            return (tmpV.minusEq(this.pos)).plusEq((tmpV2.minusEq(this.vel)).divideEq(8));
        } else {
            return new Vector2(0,0);
        }



    };

    this.rule2 = function(){
        var tmpV = new Vector2(0,0);
        for(var i = 0; i < particles.length; i++){
            var p = particles[i];
            if (p != this && this.pos.isCloseTo(p.pos,40)){
                tmpV.minusEq(p.pos.minusNew(this.pos));
            }
        }

        return tmpV;
    };


    this.rule3 = function(){
        var tmpV = new Vector2(0,0);
        var count = 0;

        for(var i = 0; i < particles.length; i++){
            var p = particles[i];
            if (p != this && this.pos.isCloseTo(p.pos,100)){
                tmpV.plusEq(p.vel);
                count++;
            }
        }

        if (count > 0){
            tmpV.divideEq(count);
            return (tmpV.minusEq(this.vel)).divideEq(4);
        } else {
            return new Vector2(0,0);
        }
    };

    this.bounds = function(){
        var tmpV = new Vector2(0,0);
        var turn = 40
        if(pos.x < 50) tmpV.x = turn;
        else if(pos.x > canvas.width -50) tmpV.x = -turn;
        if(pos.y < 50) tmpV.y = turn;
        else if(pos.y > canvas.height -50) tmpV.y = -turn;

        return tmpV;
    };

    this.update = function(canvas, mouse){

        b1 = this.rule1();
        b2 = this.rule2();
        b3 = this.rule3();
        b4 = this.bounds();


        // Boidy additions
        acc.plusEq(b1);
        acc.plusEq(b2);
        acc.plusEq(b3);
        acc.plusEq(b4);

        // mouse attraction
        if (!mouse.mouseDown){
            if (this.pos.isCloseTo(mouse.pos,100)){
                acc.plusEq(mouse.pos.minusNew(this.pos).multiplyNew(-4));
            }
        } else {
            acc.plusEq(mouse.pos.minusNew(this.pos).multiplyNew(0.4));
        }


        // drag as an inverse function of accelleration (was 0.99) 1/magnitude
        // update velocity based on accel
        acc.multiplyEq(0.01)
        vel.plusEq(acc);

        // reset acceleration to 0 for next loop
        acc.reset(0,0);
        
        // limit velocity
        var lim = 9;
        if (vel.magnitude() > lim){
            vel.normalise().multiplyEq(lim);
        }

        // STANDARD UPDATE VECTORS BASED ON ACCEL AND VELOCITY
        pos.plusEq(vel);


//                calculate vector difference to mouse
//                normalise & add to accel
//                var diff = mouse.pos.clone();
//                diff.minusEq(pos);
//                diff.normalise();
//                diff.multiplyEq(0.5);
//                acc.copyFrom(diff);



        // BOUNDING BOUNDS
//        if(pos.x <= 0 || pos.x >= canvas.width) {
//            vel.x = vel.x * -1;
//            vel.multiplyEq(1);
//        } else if (pos.y >= canvas.height || pos.y <= 0 ){
//            vel.y = vel.y * -1;
//            vel.multiplyEq(1);
//        }


        // WRAPPING BOUNDS
        // if(pos.x < 0) pos.x = canvas.width;
        // else if(pos.x > canvas.width) pos.x = 0;
        // if(pos.y < 0) pos.y = canvas.height;
        // else if(pos.y > canvas.height) pos.y = 0;
    };

    this.draw = function(ctx){
        ctx.save();

        ctx.translate(pos.x, pos.y);
//                ctx.fillStyle = "rgba(255,255,255," + opacity + ")";
//                ctx.beginPath();
//                ctx.arc(0, 0, size, 0, Math.PI * 2, true);
//                ctx.fill();

        // draw accel
        ctx.strokeStyle = "rgba(255,255,255, " + opacity + ")";
        ctx.fillStyle = "rgba(255,255,255," + opacity + ")";
        ctx.lineWidth = 1;
        ctx.beginPath();
        ctx.moveTo(0,0);
        ctx.lineTo(vel.x*3,vel.y*3);
        ctx.stroke();

        ctx.restore();
    };
}