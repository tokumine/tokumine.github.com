// Simple mouse vector handler
//
// can set various behaviours:
//
// showStats - boolean: show X/Y
// visible   - boolean: show mouse location
// radius    - number: size of mouse spot shown
// mouseUpColor - string: color of mouse spot
// mouseDownColor - string: color of mouse spot on mousedown
//
// pos - vector: position of mouse
// vel - vector: speed of mouse
//
function initMouse(){
    var me = {
        pos: new Vector2(0,0),
        vel: new Vector2(0,0),
        mouseDown: false,
        showStats: false,
        visible: false,
        radius: 6,
        mouseUpColor: "rgba(255,0,0,0.6)",
        mouseDownColor: "rgba(0,255,0,0.6)"
    };

    me.init = function(){
        document.addEventListener('mousemove', me.update, false);
        document.addEventListener('mousedown', me.onMouseDown, false);
        document.addEventListener('mouseup',   me.onMouseUp, false);
    };

    me.update = function(ev){
        ev.preventDefault();
        // store locations
        me.vel.reset(me.pos.x, me.pos.y);
        me.pos.reset(ev.clientX, ev.clientY);

        // calculate velocity of mouse
        me.vel.minusEq(me.pos);
    };

    me.onMouseDown = function( event ){
        me.mouseDown = true;
    };

    me.onMouseUp = function( event ){
        me.mouseDown = false;
    };

    me.mouseColor = function(){
        return me.mouseDown ? me.mouseDownColor : me.mouseUpColor;
    };

    me.draw = function(ctx){
        if (me.visible){
            ctx.save();
            ctx.translate(me.pos.x,me.pos.y);
            ctx.beginPath();
            ctx.fillStyle = me.mouseColor();
            ctx.arc(0,0,me.radius,0,Math.PI * 2, true);
            ctx.fill();

            if (me.showStats){
                ctx.font = "bold 9px courier";
                ctx.fillText("pos: (" + me.pos.x + "," + me.pos.y + ")" , me.radius + 10, 0);
            }
            ctx.restore();
        }
    };

    me.init();

    return me;
}