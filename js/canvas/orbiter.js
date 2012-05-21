function Orbiter(){
    this.radius = 20;
    this.angle = 0;
    this.rotationSpeed = 0.01;
    this.generation = 0;
    this.children = [];
    this.grey = Math.floor(randomRange(0,50));
    this.x = 0;
    this.y = 0;

    this.update = function(){
        this.angle += this.rotationSpeed;
    };

    this.render = function(c){
        c.save();

        c.strokeStyle = "rgba(0,0,0,0.1)";
        c.rotate(this.angle, false);

        c.beginPath();
        c.moveTo(this.x,this.y);
        c.lineTo(this.radius, 0);
        c.stroke();

        c.translate(this.radius,0);

        c.beginPath();
        c.fillStyle = "rgba("+ this.grey +"," + this.grey + "," + this.grey + ",0.1)";
        c.arc(0,0,randomRange(1,1),0,Math.PI * 2, true);
        if (this.generation > 1)
            c.fill();
        //c.stroke();

        for(var i = 0; i < this.children.length; i++){
            var child = this.children[i];
            child.update();
            child.render(c);
        }

        c.restore();
    };

    this.spawn = function(){
        var numChildren = randomRange(2,4);

        for(var i = 0; i < numChildren; i++){
            var child = new Orbiter();
            this.children.push(child);

            child.radius = randomRange(5,200);
            child.rotationSpeed = randomRange(-0.005,0.005);
            child.generation = this.generation+1;
            if(this.generation < 3) child.spawn();
        }
    };
}

function randomRange(min, max){
    return ((Math.random()*(max-min)) + min);
}