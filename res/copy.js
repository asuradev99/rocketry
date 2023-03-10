
function Point(x, y) {
    this.x = x;
    this.y = y;
}

function State(e, p, u, thp, th0, ccw, E, t) {
    this.e = e; // eccentricity
    this.p = p; // semi-latus rectum
    this.u = u; // G(m_1 + m_2)
    this.thp = thp; // initial true anomaly
    this.th0 = th0; //
    this.ccw = ccw; // counter-clockwise orbit
    this.t = t; // time since periapsis
    this.E = E; // eccentric anomaly (redundant with t)

    // redundant info (for performance)
    this.r = new Point(0, 0); // position
    this.v = new Point(0, 0); // velocity
    this.T = 0; // period
}

function norm(v) { return Math.sqrt(v.x * v.x + v.y * v.y); }

function add(v, w) { return new Point(v.x + w.x, v.y + w.y); }
function minus(v, w) { return new Point(v.x - w.x, v.y - w.y); }
function mult(v, c) { return new Point(v.x * c, v.y * c); }

function dot(v, w) { return v.x * w.x + v.y * w.y; }
function vccw(v, w) { return v.x * w.y - v.y * w.x; }

function pow2(x) { return x*x; }
function cosh(x) { return (Math.exp(x) + Math.exp(-x)) / 2; }
function sinh(x) { return (Math.exp(x) - Math.exp(-x)) / 2; }
function tanh(x) { return (Math.exp(x) - Math.exp(-x)) / (Math.exp(x) + Math.exp(-x)); }
function atanh(x) { return 0.5 * Math.log((1 + x) / (1 - x)); }

var G = 6.67384e-11; // gravitational constant
var m1 = 5.97219e24; // mass of the center object
var m2 = 7.3477e22; // mass of the orbiting object
var u = G * (m1 + m2);
var st; // the state variable

(function(){
    // initial states
    var a = 384748000;
    var e=0.0549006, p=a*(1-e*e), thp=0, th0=0, ccw=true;
    var t=0;
    var E=0;
    st = new State(e, p, u, thp, th0, ccw, E, t);
})();


var canvas = document.getElementById("canvas");
var ctx = canvas.getContext("2d");

var dpr = window.devicePixelRatio || 1;
canvas.width = 500 * dpr;
canvas.height = 500 * dpr;
ctx.scale(dpr, dpr);

var vscale = 50000;
var drawScale = 1/2000000;

function toTheta(E, e) {
    // eccentric anomaly -> true anomaly
    if (e < 1)
        return 2 * Math.atan( Math.sqrt((1+e) / (1-e))  * Math.tan(E/2) );
    if (e > 1)
        return 2 * Math.atan( Math.sqrt((1+e) / (e-1))  * tanh(E/2) );
    return 2 * Math.atan(E);
}

function toE(theta, e) {
    // true anomaly -> eccentric anomaly
    if (e < 1)
        return Math.atan2( Math.sqrt(1-e*e) * Math.sin(theta) , e + Math.cos(theta));
    if (e > 1)
        return atanh( Math.sqrt(e*e-1) * Math.sin(theta) / ( e +Math.cos(theta)));
    return Math.tan(theta / 2);
}

function findT(E, e, u, p, ccw) {
    // eccentric anomaly -> time since periapsis
    if (!ccw)
        E = -E;
    var a = p / (1 - e*e);
    if (e < 1)
        return a * Math.sqrt(a / u) * (E - e * Math.sin(E));
    if (e > 1)
        return -a * Math.sqrt(-a / u) * (e * sinh(E) - E);
    return Math.sqrt(p * p * p / (u * 8)) * (E + E*E*E/3);
}

function findE(t, e, u, p, E0, ccw) {
    // time since periapsis -> eccentric anomaly
    var E = E0;
    var a = p / (1 - e*e);
    if (e < 1)
        M = Math.sqrt(u / (a*a*a)) * t;
    else if (e > 1)
        M = Math.sqrt(u / (-a*a*a)) * t;
    else
        M = Math.sqrt((u * 8) / (p * p * p)) * t;

    if (!ccw)
        M = -M;

    // Newton's method
    var E2;
    for (var i = 1; i < 20; ++i) {
        if (e < 1)
            E2 = E - (E - e * Math.sin(E) - M) / (1 - e * Math.cos(E));
        else if (e > 1)
            E2 = E - (-E + e * sinh(E) - M) / (e * cosh(E) - 1);
        else
            E2 = E - (E + E*E*E/3 - M) / (1 + E*E);
        if (Math.abs(E - E2) < 1e-10)
            break;
        E = E2;
    }
    return E;
}

function calculateState(r, v, u) {
    // Find the state variables from initial position and velocity

    var ccw = vccw(r, v);

    // TODO: radial trajectory - this is a non-trivial special case.
    if (ccw == 0) {
        v.x += 0.1; // cheat
        ccw = vccw(r, v);
    }

    var rs = norm(r);
    //r1 = new Point(r.x / rs, r.y / rs);
    //vr = dot(v, r1);
    //vtt = new Point(v.x - r1.x * vr, v.y - r1.y * vr);
    //r1 = new Point(r.x / rs, r.y / rs);
    var vr = dot(v, r) / rs;
    var k = dot(v, r) / dot(r, r);
    var vrr = new Point(r.x * k, r.y * k);
    var vtt = new Point(v.x - vrr.x, v.y - vrr.y);

    var vt = norm(vtt);

    var p = dot(r, r) * dot(vtt, vtt) / u;
    var v0 = u / Math.sqrt(dot(r, r) * dot(vtt, vtt));
    var v0inv = Math.sqrt(dot(r, r) * dot(vtt, vtt)) / u;
    //v0 = u / Math.sqrt();
    var e = Math.sqrt( pow2(vt*v0inv - 1) + pow2(vr*v0inv) );
    //v02 = u / p;
    //e = Math.sqrt( dot(vtt,vtt) - 2*vt*v0 + v02 + (dot(v, r) * dot(v, r) / dot(r, r)  )) / v0;

    //e2 = Math.sqrt(dot(vtt,vtt) - 2*vt*v0 + v02 + (dot(v, r) * dot(v, r) / dot(r, r) ));
    //cos = (vt/v0-1) / e;
    //sin = (vr / v0) / e;

    //cos = (vt - v0) / e2;
    //sin = vr / e2;

    var thp = Math.atan2(vr, vt - v0);
    if (ccw < 0)
        thp = -thp;

    var th0 = Math.atan2(r.y, r.x);

    return new State(e, p, u, thp, th0, ccw >= 0, st.E, st.t);
}

function findRV(st) {
    // Find the position and velocity of the current state
    var e = st.e;
    var p = st.p;
    var u = st.u;
    var thp = st.thp;
    var th0 = st.th0;
    var E = st.E;
    var ccw = st.ccw;

    var theta = toTheta(E, e);
    var rv = p / (1+e*Math.cos(theta));
    var r = new Point(rv*Math.cos((th0 - thp) + theta), rv*Math.sin((th0 - thp) + theta));

    var v0 = Math.sqrt(u / p);
    var vt = (e * Math.cos(theta) + 1) * v0;
    var vr = e * Math.sin(theta) * v0;
    var rs = norm(r);
    var r1 = new Point(r.x / rs, r.y / rs);
    var t1 = new Point(-r1.y, r1.x);
    if (!ccw) {
        vt = -vt;
        vr = -vr;
    }

    var v = new Point(vr*r1.x + vt*t1.x, vr*r1.y + vt*t1.y);

    // cache
    st.r = r;
    st.v = v;

    return {r:r, v:v};
}

function recalculate(_st, dx, dy) {
    // Adjust the velocity by (dx, dy)
    var d = findRV(_st);
    var r = d.r;
    var v = d.v;
    v = new Point(v.x + dx, v.y + dy);

    st = calculateState(r, v, _st.u);
    st.E = toE(st.thp, st.e);
    st.t = findT(st.E, st.e, st.u, st.p, st.ccw);
}


function redraw(st) {
    var e = st.e;
    var p = st.p;
    var u = st.u;
    var thp = st.thp;
    var th0 = st.th0;

    ctx.clearRect(0, 0, 500, 500);

    ctx.save();
    ctx.translate(250, 250);

    // center
    ctx.fillStyle="#FF0000";
    ctx.beginPath();
    ctx.arc(0, 0, 6, 0, 2*Math.PI);
    ctx.fill();

    // trace
    ctx.strokeStyle ="#FF0000";
    if (e == 0) { // circle
        ctx.beginPath();
        ctx.arc(0, 0, p*drawScale, 0, 2*Math.PI);
        ctx.stroke();
    } /*else if (e < 1) { // ellipse
        ctx.save();
        var a = p / (1 - e*e);
        ctx.rotate( th0 - thp );
        ctx.translate(-e * a, 0);
        ctx.scale(1, Math.sqrt(1 - e*e));
        ctx.beginPath();
        ctx.arc(0, 0, a, 0, 2*Math.PI);
        ctx.stroke();
        ctx.restore();
    } */ else {
        var th;
        var rv;
        ctx.beginPath();
        for (th=-Math.PI; th < Math.PI; th+=0.01) {
            rv = p / (1+e*Math.cos(th));
            if (rv <= 0)
                continue;
            ctx.lineTo( rv*Math.cos(th + (th0 - thp))*drawScale, rv*Math.sin(th + (th0 - thp))*drawScale );
        }
        ctx.stroke();
    }


    var d = findRV(st);
    var r = d.r;
    var v = d.v;

    // the orbiting object
    ctx.fillStyle ="#008000";
    ctx.beginPath();
    ctx.arc(r.x * drawScale, r.y * drawScale, 5, 0, 2*Math.PI);
    ctx.fill();

    // the velocity line
    ctx.strokeStyle ="#0000FF";
    ctx.beginPath();
    ctx.moveTo(r.x * drawScale, r.y * drawScale);
    ctx.lineTo((r.x + v.x * vscale) * drawScale, (r.y + v.y * vscale) * drawScale);
    ctx.stroke();

    // arrowhead
    ctx.save();
    ctx.translate((r.x + v.x * vscale) * drawScale, (r.y + v.y * vscale) * drawScale);
    ctx.rotate(-Math.atan2(v.x, v.y));
    ctx.strokeStyle ="#0000FF";
    ctx.beginPath();
    ctx.moveTo(-8, -10);
    ctx.lineTo(0, 0);
    ctx.lineTo(8, -10);
    ctx.stroke();
    ctx.restore();

    ctx.restore();

    updateInfo();
}




var moving = false;
var timer;

redraw(st);


var state = 0;
var r0, v0;
var saveMoving;

canvas.onmousemove = function(event) {
    var x = event.offsetX == undefined ? event.layerX : event.offsetX;
    var y = event.offsetY == undefined ? event.layerY : event.offsetY;
    var p = mult(new Point(x - 250, y - 250), 1/drawScale);
    var d = findRV(st);
    var r = d.r;
    var v = d.v;

    if (state <= 2) {
        if (norm(minus(p, r)) < 14 / drawScale) {
            canvas.style.cursor = 'pointer';
            state = 1;
        } else if (norm( minus( add(r, mult(v, vscale)) , p ) ) < 14 / drawScale) {
            canvas.style.cursor = 'pointer';
            state = 2;
        } else {
            canvas.style.cursor = 'default';
            state = 0;
        }
        return;
    }


    if (state == 3) {
        if (p.x == 0 && p.y == 0)
            p.x = 0.1;
        r = p;
        v = v0;
    } else if (state == 4) {
        r = r0;
        v = mult(minus(p, r), 1/vscale);
    }

    st = calculateState(r, v, st.u);
    var thp = st.thp;
    var th0 = st.th0;

    st.E = toE(thp, st.e);   // why only THP ?
    st.t = findT(st.E, st.e, st.u, st.p, st.ccw);
    redraw(st);
}

canvas.onmousedown = function(event) {
    var d = findRV(st);
    r0 = d.r;
    v0 = d.v;
    if (state == 1 || state == 2) {
        state += 2;
        saveMoving = moving;
        stopMoving();
    }

    canvas.onmousemove(event);
    event.preventDefault();
}

var mousewheel = function (e) {
    var delta = e.wheelDelta ? e.wheelDelta : e.detail;
    console.log(delta);
    drawScale = drawScale + delta / 10000000000;
    drawScale = Math.max(drawScale, 0.000000001);
    redraw(st);
    e.preventDefault();
};

canvas.addEventListener(canvas.hasOwnProperty("onmousewheel") ?
  "mousewheel" : "DOMMouseScroll", mousewheel);

document.onmouseup = function(event) {
    state = 0;
    if (saveMoving)
        startMoving();
    canvas.style.cursor = 'default';
}

function updateInfo() {
    function curveType(e) {
        if (e == 0) return "circle";
        if (e < 1) return "ellipse";
        if (e == 1) return "parabola";
        return "hyperbola";
    }

    var a = st.p / (1 - st.e*st.e);
    var T = 2 * Math.PI * a * Math.sqrt(a / st.u);

    var div = document.getElementById("info");
    s = "";
    s += "curve = " + curveType(st.e) + "<br>";
    s += "eccentricity = " + st.e.toFixed(2) + "<br>";
    s += "altitude = " + Math.round(norm(st.r)/1000) + " km<br>";
    s += "periapsis = " + Math.round((1-st.e)*a/1000) + " km<br>";
    // is the apoapsis for parabola/hyperbola really infinity?
    s += "apoapsis = " + ((st.e < 1) ? (Math.round((1+st.e)*a/1000) + " km") : "&infin;") + "<br>";
    s += "velocity = " + Math.round(norm(st.v)/1000 * 10)/10 + " km/s<br>";
    s += "eccentric anomaly = " + Math.round((((st.E / Math.PI) % 2) + 2) % 2 * 10) / 10 + "&pi;<br>";
    s += "period = " + ((st.e < 1) ? (Math.round(T / (24*60*60) * 10) / 10 + " days") : "&infin;") + "<br>";
    div.innerHTML = s;
}

function animate() {
    st.t += 24*60*60*0.1;
    st.E = findE(st.t, st.e, st.u, st.p, st.E, st.ccw);
    redraw(st);
}

function stopMoving() {
    clearInterval(timer);
    moving = false;
}

function startMoving() {
    if (moving)
        return;
    timer = setInterval(animate, 30);
    moving = true;
}

document.onkeydown = function(event) {
    var dx=0, dy=0;
    if (event.keyCode == 38) { // up
        dy = -1;
    } else if (event.keyCode == 40) { // down
        dy = 1;
    } else if (event.keyCode == 37) { // left
        dx = -1;
    } else if (event.keyCode == 39) { // right
        dx = 1;
    } else if (event.keyCode == 32) {
        if (moving) {
            stopMoving();
        } else {
            startMoving();
        }
    }
    if (dx != 0 || dy != 0) {
        recalculate(st, dx * 10, dy * 10);
        redraw(st);
    }
}
