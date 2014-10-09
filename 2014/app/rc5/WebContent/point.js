// SLOPE that is used to determine on what layer user has dragged the mouse on
// ----------------------------------------------------------------------------
Rubik.Slope = {};

Rubik.Slope.HORIZONTAL = "Horizontal";
Rubik.Slope.VERTICAL   = "Vertical";
Rubik.Slope.SLANTED = "Slanted";
Rubik.Slope.ERROR = "Error";

Object.freeze(Rubik.Slope);
Object.defineProperty( Rubik, "Slope", 
		{ writable : false, enumerable : true, configurable : false }
	);		

//Layer: To identify which portion of the face user has clicked/dragged mouse on
//----------------------------------------------------------------------------

Rubik.Layer = {};

Rubik.Layer.LOWER = "lower";
Rubik.Layer.MIDDLE = "middle";
Rubik.Layer.HIGHER = "higher";

Rubik.Layer.ERROR = "Undefined";
Object.freeze(Rubik.Layer);
Object.defineProperty( Rubik, "Layer", 
		{ writable : false, enumerable : true, configurable : false }
	);		


// Point
//----------------------------------------------------------------------------
Rubik.Point = function (x,y){
    this.x = Math.round(x);
    this.y = Math.round(y);
};

// return the mid point of this point and the given point
Rubik.Point.prototype.getMidPointWith = function (that) {
	return new Rubik.Point( (this.x+that.x)/2, (this.y+that.y)/2);
};

// check if this point is in a (more or less) horizontal, vertical or in given slope, 
// with the given point 
Rubik.Point.prototype.getSlopeType = function(that, theta, side) {
	
	var delx = Math.abs(this.x-that.x);
	var dely = Math.abs(this.y-that.y);

	var slope;
	
	if ( delx == 0 ) {
		slope = Rubik.Slope.VERTICAL;
	} else if ( dely == 0 ) {
		slope = Rubik.Slope.HORIZONTAL;
	} else {
	
		var angle = Math.atan(Math.abs(dely/delx));
		
		if ( side  == Rubik.Side.FRONT ) {
			// Horizontal or vertical
			slope =  (angle < Math.PI/4) ? Rubik.Slope.HORIZONTAL : Rubik.Slope.VERTICAL;
		} else if ( side == Rubik.Side.UP ) {
			slope = (angle < theta/2) ? Rubik.Slope.HORIZONTAL : Rubik.Slope.SLANTED;
		} else if ( side == Rubik.Side.RIGHT ) {
			slope =  (angle < (Math.PI/4 + theta/2)) ? Rubik.Slope.SLANTED : Rubik.Slope.VERTICAL;
		} else {
			slope = Rubik.Slope.ERROR;
			console.log("Bad side: " + side);
		}
	}
	return slope;
};


// Find if the given number (co-ordinate) is in LOWER, MIDDLE or the HIGHER part of the range 
// Divide the range in 3 regions, and check where the num falls
// static method
Rubik.Point.getPosInLine = function(num, low, high) {
	if ( num < low || num > high ) {
		return Rubik.Layer.ERROR;
	}
	
	var dist = high - low;
	
    if ( num < low + dist/3 ) {
    	return Rubik.Layer.LOWER;
    } else if ( num > high - dist/3) {
    	return Rubik.Layer.HIGHER;
    }
    return Rubik.Layer.MIDDLE;
	
};

//Find if this point is in LEFT, MIDDLE or the RIGHT part of rectangle 
//with given two points from top and bottom lines of rectangle 
// origin: point of left/bottom corner
// side: length of one side
Rubik.Point.prototype.getHLayerInFront = function(origin, side) {
	return Rubik.Point.getPosInLine(this.y,  origin.y-side, origin.y);
};
Rubik.Point.prototype.getVLayerInFront = function(origin, side) {
	return Rubik.Point.getPosInLine(this.x,  origin.x, origin.x + side);
};

// sSide is slanted length of side
Rubik.Point.prototype.getHLayerInUp = function(origin, sSide, theta) {
	var height = sSide * Math.sin(theta);
	return Rubik.Point.getPosInLine(this.y,  origin.y-height, origin.y);
};

Rubik.Point.prototype.getVLayerInUp = function(origin, hSide, theta) {
	// rel coordinate of point from origin
	var delx = this.x - origin.x;
	var dely = origin.y - this.y;
	
	// get the dist of point that is on left slant and with the same ht as this point.
	
	var dist = delx - dely/Math.tan(theta);
	
	return Rubik.Point.getPosInLine(this.x,  this.x-dist, this.x - dist + hSide);
};

//sSide is slanted length of side
Rubik.Point.prototype.getVLayerInRight = function(origin, sSide, theta) {
	var height = sSide * Math.cos(theta);
	return Rubik.Point.getPosInLine(this.x,  origin.x, origin.x + height);
};

Rubik.Point.prototype.getHLayerInRight = function(origin, hSide, theta) {
	
	// rel coordinate of point from left/bottom
	var delx = this.x - origin.x;
	var dely = origin.y - this.y;
	
	// get the dist of point that is on left slant and with the same ht as this point.
	
	var dist = dely - delx/Math.tan(theta);
	
	return Rubik.Point.getPosInLine(this.y,  this.y + dist - hSide, this.y+dist );
};

Rubik.Point.prototype.toString = function( ) {
	return "(" + this.x + ", " + this.y + ")";
};

// Polygon
//----------------------------------------------------------------------------
Rubik.Polygon = function (){
    this.points=[];
    this.x_min=undefined;  // min, max are useful for method pointInPoly
    this.x_max=undefined;
    this.y_min=undefined;
    this.y_max=undefined;
};

Rubik.Polygon.prototype.add = function(p){
    this.points=this.points.concat(p);
    if (p.x<this.x_min){this.x_min=p.x;}
    if (p.x>this.x_max){this.x_max=p.x;}
    if (p.y<this.y_min){this.y_min=p.y;}
    if (p.y>this.y_min){this.y_max=p.y;}
    return this;
};

// Check if the given point is inside this polygon
Rubik.Polygon.prototype.pointInPoly = function(p){
	
	//console.log("testing " + p + " inside " + this);
	
    var j=(this.points.length-1);  //start by testing the link from the last point to the first point
    var isOdd=false;

    //check the bounding box conditions
    if (p.x < this.x_min || p.x > this.x_max || p.y < this.y_min || p.y > this.y_max){
        return false;
    }

    //if necessary use the line crossing algorithm
    for(var i=0; i<this.points.length; i++){
        if ((this.points[i].y<p.y && this.points[j].y>=p.y) ||  
            (this.points[j].y<p.y && this.points[i].y>=p.y)) {
                if (this.points[i].x+(p.y-this.points[i].y)/(this.points[j].y-
                    this.points[i].y)*(this.points[j].x-this.points[i].x)<p.x)
                { isOdd=(!isOdd);} }
        j=i;
    }
    
    //console.log("Result " + isOdd);
    return isOdd;
};

Rubik.Polygon.prototype.toString = function( ) {
	var out = "Rubik.Polygon [";
	
	 for(var i=0; i<this.points.length; i++){
		out = out + " " + this.points[i];
	 }
	 
	 return out + " ]";
};

