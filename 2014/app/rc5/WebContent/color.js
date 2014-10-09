Rubik.Color = function (r, g, b) {
	this.r = r;
	this.g = g;
	this.b = b;
};

Rubik.Color.RED =    new Rubik.Color(255, 0,   0);
Rubik.Color.GREEN =  new Rubik.Color(0,   255, 0);
Rubik.Color.BLUE =   new Rubik.Color(0,   0,   255);
Rubik.Color.WHITE =  new Rubik.Color(255, 255, 255);
Rubik.Color.YELLOW = new Rubik.Color(255, 255, 0);
Rubik.Color.ORANGE = new Rubik.Color(255, 0,   255);
Rubik.Color.CYAN   = new Rubik.Color(0,   255, 255);

Rubik.Color.ERROR  = new Rubik.Color(65,   65, 65);

Rubik.Color.prototype.getRGB = function() {
	return "rgb(" + this.r + "," + this.g + ", " + this.b + ")";
};

Object.freeze(Rubik.Color);
Object.defineProperty( Rubik, "Color", 
		{ writable : false, enumerable : true, configurable : false }
);