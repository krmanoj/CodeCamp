Rubik.CubeDisplay = function CubeDisplay(canvas, fluPosX, fluPosY, hvSize, slantRatio,
		anglePerspective, gap) {
	this.fluPosX = fluPosX; // starting position for FRONT-LEFT-UP corner
	this.fluPosY = fluPosY; // starting position for FRONT-LEFT-UP corner
	this.hvSize = hvSize; // size of front face (length/width in pixel)
	this.slantRatio = slantRatio; // the slanted lengths in top surface will
									// be hvSize*slantRatio;
	this.anglePerspective = (Math.PI * anglePerspective) / 180; // angle by
																// which lines
																// in the top
																// and right
																// sides are
																// drawn
	this.gap = gap; // gap between two atoms in front layer for nicer display
	this.canvas = canvas;
	this.view2PosX = fluPosX + this.hvSize*3/2 + fluPosX * 6;
	this.view2PosY = fluPosY;
	this.tanTheta = Math.tan(this.anglePerspective);
	this.slantedLen = this.hvSize * this.slantRatio;
	
};

Rubik.CubeDisplay.prototype.getAtomPos = function(side, i, j) {
	// need some smart logic here
	
	// i*3 + j => atoms name at i,j position. Prefix with the symbol of side
	var frontBack = [ "lu", "l", "ld", "u", "", "d", "ru", "r", "rd" ];   // prefix is f or b

	var leftRight = [ "fu", "u", "bu", "f", "", "b", "fd", "d", "bd" ];

	var upDown = [ "lf", "l", "bl", "f", "", "b", "fr", "r", "br" ];

	var sides = Array();
	sides[0] = side.id;
	if (i == 1 && j == 1) {
		// center one
		return sides;
	}
	var pos;
	if (side == Rubik.Side.FRONT || side == Rubik.Side.BACK) {
		pos = frontBack;
	} else if (side == Rubik.Side.LEFT || side == Rubik.Side.RIGHT) {
		pos = leftRight;
	} else {
		pos = upDown;
	}

	return sides.concat(pos[i * 3 + j].split(''));
};

Rubik.CubeDisplay.prototype.getAtomColor = function(cube, side, i, j) {
	var atomPos = this.getAtomPos(side, i, j);
	var color = cube.getAtomColor(atomPos, side);

	return color.getRGB();
};

Rubik.CubeDisplay.prototype.draw = function(cube) {
   //clear the canvas
	var ctx = this.canvas.getContext("2d");
	ctx.rect(0,0, this.canvas.width, this.canvas.height);
	ctx.fillStyle="black";
    ctx.fill();

	
	this.frontAtomSize = this.hvSize / cube.size;
	this.topAtomSlant = this.hvSize * this.slantRatio;

	var slantedLen = this.hvSize * this.slantRatio;
	var delx = slantedLen * Math.cos(this.anglePerspective);
	var dely = slantedLen * Math.sin(this.anglePerspective);
	
	// remember the extent of all sides, 
	this.front = new Rubik.Polygon()
					.add( new Rubik.Point(this.fluPosX, this.fluPosY))
					.add( new Rubik.Point(this.fluPosX, this.fluPosY+this.hvSize))
					.add( new Rubik.Point(this.fluPosX+this.hvSize, this.fluPosY+this.hvSize))
					.add( new Rubik.Point(this.fluPosX+this.hvSize, this.fluPosY));
	//console.log("Front Side: " + this.front);

	this.right = new Rubik.Polygon()
					.add( new Rubik.Point(this.fluPosX+this.hvSize, this.fluPosY))
					.add( new Rubik.Point(this.fluPosX+this.hvSize+delx, this.fluPosY-dely))
					.add( new Rubik.Point(this.fluPosX+this.hvSize+delx, this.fluPosY-dely+this.hvSize))
					.add( new Rubik.Point(this.fluPosX+this.hvSize, this.fluPosY+this.hvSize));
	//console.log("Right Side: " + this.right);

	this.up = new Rubik.Polygon()
					.add( new Rubik.Point(this.fluPosX, this.fluPosY))
					.add( new Rubik.Point(this.fluPosX+delx, this.fluPosY-dely))
					.add( new Rubik.Point(this.fluPosX+this.hvSize+delx, this.fluPosY-dely))
					.add( new Rubik.Point(this.fluPosX+this.hvSize, this.fluPosY));
	//console.log("Up Side: " + this.up);

	this.drawFrontOrBack(Rubik.Side.FRONT, cube, this.fluPosX, this.fluPosY);
	this.drawFrontOrBack(Rubik.Side.BACK, cube, this.view2PosX + delx, this.view2PosY
			- dely);

	this.drawUpOrDown(Rubik.Side.UP, cube, this.fluPosX, this.fluPosY);
	this.drawUpOrDown(Rubik.Side.DOWN, cube, this.view2PosX, this.view2PosY
			+ this.hvSize);

	this.drawLeftOrRight(Rubik.Side.RIGHT, cube, this.fluPosX + this.hvSize,
			this.fluPosY);
	this.drawLeftOrRight(Rubik.Side.LEFT, cube, this.view2PosX, this.view2PosY);
	
};

Rubik.CubeDisplay.prototype.drawFrontOrBack = function(side, cube, startX, startY) {

	var ctx = this.canvas.getContext("2d");

	var frontAtomSize = this.hvSize / cube.size;
	for ( var i = 0; i < cube.size; i++) {
		for ( var j = 0; j < cube.size; j++) {
			var x0 = startX + i * frontAtomSize;
			var y0 = startY + j * frontAtomSize;

			ctx.fillStyle = this.getAtomColor(cube, side, i, j);
			ctx.fillRect(x0 + this.gap, y0 + this.gap, frontAtomSize - 2
					* this.gap, frontAtomSize - 2 * this.gap);
		}
	}
};

Rubik.CubeDisplay.prototype.drawLeftOrRight = function(side, cube, startX, startY) {

	var ctx = this.canvas.getContext("2d");

	var frontAtomSize = this.hvSize / cube.size;

	var topAtomSlant = frontAtomSize * this.slantRatio;

	var delx = topAtomSlant * Math.cos(this.anglePerspective);
	var dely = topAtomSlant * Math.sin(this.anglePerspective);

	var gapx = this.gap * Math.cos(this.anglePerspective);
	var gapy = this.gap * Math.sin(this.anglePerspective);

	for ( var i = 0; i < cube.size; i++) {
		for ( var j = 0; j < cube.size; j++) {

			var x0 = startX + j * delx;
			var y0 = startY - j * dely + i * frontAtomSize;

			ctx.fillStyle = this.getAtomColor(cube, side, i, j);

			ctx.beginPath();
			ctx.moveTo(x0 + gapx, y0 + gapy);
			ctx.lineTo(x0 + delx - gapx, y0 - dely + gapy);
			ctx.lineTo(x0 + delx - gapx, y0 - dely + frontAtomSize - gapy);
			ctx.lineTo(x0 + gapx, y0 + frontAtomSize - gapy);
			ctx.closePath();
			ctx.fill();

		}
	}
};

Rubik.CubeDisplay.prototype.drawUpOrDown = function(side, cube, startX, startY) {

	var ctx = this.canvas.getContext("2d");

	var frontAtomSize = this.hvSize / cube.size;
	var topAtomSlant = frontAtomSize * this.slantRatio;
	var delx = topAtomSlant * Math.cos(this.anglePerspective);
	var dely = topAtomSlant * Math.sin(this.anglePerspective);

	//var gapx = this.gap * Math.cos(this.anglePerspective);
	var gapy = this.gap * Math.sin(this.anglePerspective);

	for ( var i = 0; i < cube.size; i++) {
		for ( var j = 0; j < cube.size; j++) {
			var x0 = startX + i * frontAtomSize + j * delx;
			var y0 = startY - j * dely;

			ctx.fillStyle = this.getAtomColor(cube, side, i, j);

			ctx.beginPath();
			ctx.moveTo(x0 + this.gap, y0 - gapy);
			ctx.lineTo(x0 + frontAtomSize - this.gap, y0 - gapy);
			ctx.lineTo(x0 + frontAtomSize + delx - this.gap, y0 - dely + gapy);
			ctx.lineTo(x0 + delx + this.gap, y0 - dely + gapy);
			ctx.closePath();
			ctx.fill();
		}
	}
};

Rubik.CubeDisplay.prototype.getPosition = function (event){
    var p = new Rubik.Point();
    if (event.pageX != undefined && event.pageY != undefined) {
        p.x = event.pageX;
        p.y = event.pageY;
     }
     else {
        p.x = event.clientX + document.body.scrollLeft +
                document.documentElement.scrollLeft;
        p.y = event.clientY + document.body.scrollTop +
                document.documentElement.scrollTop;
    }
    p.x -= this.canvas.offsetLeft;
    p.y -= this.canvas.offsetTop;


    return p;
};

Rubik.CubeDisplay.prototype.doMouseDown = function (event) {
    //console.log("MouseDown: " + event.pageX + ", " + event.pageY);
    this.dragStart = this.getPosition(event);
};

Rubik.CubeDisplay.prototype.doMouseUp = function (event) {
	//console.log("MouseUp: " + event.pageX + ", " + event.pageY);
	this.dragEnd = this.getPosition(event);
	return this.processMove();
};

Rubik.CubeDisplay.prototype.processMove = function() {

    // use dragStart and dragEnd coordinates to find out what layer to rotate
	var midPoint = this.dragStart.getMidPointWith(this.dragEnd);
	var move = Rubik.Move.NONE;
	
						
	if ( this.front.pointInPoly(this.dragStart) &&  this.front.pointInPoly(this.dragEnd)) {
		//console.log("Rubik.Point " + this.dragStart + " & " + this.dragEnd + " in Front");
		
		var origin = new Rubik.Point(this.fluPosX, this.fluPosY+this.hvSize);

		var slope = this.dragStart.getSlopeType(this.dragEnd, this.anglePerspective, Rubik.Side.FRONT);
		var lowToHigh = (slope == Rubik.Slope.HORIZONTAL ) 
							?(this.dragEnd.x > this.dragStart.x)
							:(this.dragEnd.y > this.dragStart.y);
		
		if ( slope == Rubik.Slope.HORIZONTAL ) {
			var layer = midPoint.getHLayerInFront(origin, this.hvSize);
			if ( layer == Rubik.Layer.LOWER ) {
				move = lowToHigh ? Rubik.Move.UA : Rubik.Move.U;
			} else if ( layer == Rubik.Layer.HIGHER ) {
				move = lowToHigh ? Rubik.Move.D : Rubik.Move.DA;
			} else {
				move = lowToHigh ? Rubik.Move.H : Rubik.Move.HA;  //"Dud'" : "D'u'd";
			}
		} else if ( slope == Rubik.Slope.VERTICAL ) {
			var layer = midPoint.getVLayerInFront(origin, this.hvSize);
			if ( layer == Rubik.Layer.LOWER ) {
				move = lowToHigh ? Rubik.Move.L : Rubik.Move.LA;
			} else if ( layer == Rubik.Layer.HIGHER ) {
				move = lowToHigh ? Rubik.Move.RA : Rubik.Move.R;
			} else {
				move = lowToHigh ? Rubik.Move.VA : Rubik.Move.V; //  "R'rl'" : "Rr'l";
			}
			
		} else {
		    //console.log("Points " + this.dragStart + " and " + this.dragEnd  + " gives bad slope " + slope.type + ". Ignored");
		}
	}
	else if ( this.right.pointInPoly(this.dragStart) &&  this.right.pointInPoly(this.dragEnd)) {
		//console.log("Rubik.Point " + this.dragStart + " & " + this.dragEnd + " in Right");
		
		var origin = new Rubik.Point(this.fluPosX+this.hvSize, this.fluPosY+this.hvSize);
		var slope = this.dragStart.getSlopeType(this.dragEnd, this.anglePerspective, Rubik.Side.RIGHT);
		var lowToHigh = (slope == Rubik.Slope.SLANTED ) 
						?(this.dragEnd.x > this.dragStart.x)
						:(this.dragEnd.y > this.dragStart.y);

		if ( slope == Rubik.Slope.SLANTED ) {
			var layer = midPoint.getHLayerInRight(origin, this.hvSize, this.anglePerspective);
			if ( layer == Rubik.Layer.LOWER ) {
				move = lowToHigh ? Rubik.Move.UA : Rubik.Move.U;
			} else if ( layer == Rubik.Layer.HIGHER ) {
				move = lowToHigh ? Rubik.Move.D : Rubik.Move.DA;
			} else {
				move = lowToHigh ? Rubik.Move.H : Rubik.Move.HA; //"Dd'u" : "D'du'";
			}
		} else if ( slope == Rubik.Slope.VERTICAL ) {
			var layer = midPoint.getVLayerInRight(origin, this.slantedLen, this.anglePerspective);
			if ( layer == Rubik.Layer.LOWER ) {
				move = lowToHigh ? Rubik.Move.F : Rubik.Move.FA;
			} else if ( layer == Rubik.Layer.HIGHER ) {
				move = lowToHigh ? Rubik.Move.BA : Rubik.Move.B;
			} else {
				move = lowToHigh ? Rubik.Move.S : Rubik.Move.SA; //"Ff'b" : "F'fb'";
			}
			
		} else {
		    //console.log("Points " + this.dragStart + " and " + this.dragEnd  + " gives " + slope.type + ". Ignored");
		}
	}
	else if ( this.up.pointInPoly(this.dragStart) &&  this.up.pointInPoly(this.dragEnd)) {
		//console.log("Rubik.Point " + this.dragStart + " & " + this.dragEnd + " in Up");
		
		var origin = new Rubik.Point(this.fluPosX, this.fluPosY);
		var slope = this.dragStart.getSlopeType(this.dragEnd, this.anglePerspective, Rubik.Side.UP);
		var lowToHigh = (slope == Rubik.Slope.HORIZONTAL ) 
				?(this.dragEnd.x > this.dragStart.x)
				:(this.dragEnd.y > this.dragStart.y);

		if ( slope == Rubik.Slope.HORIZONTAL ) {
			var layer = midPoint.getHLayerInUp(origin, this.slantedLen, this.anglePerspective);
			if ( layer == Rubik.Layer.LOWER ) {
				move = lowToHigh ? Rubik.Move.BA : Rubik.Move.B;
			} else if ( layer == Rubik.Layer.HIGHER ) {
				move = lowToHigh ? Rubik.Move.F : Rubik.Move.FA;
			} else {
				move = lowToHigh ? Rubik.Move.S : Rubik.Move.SA; //"Ff'b" : "F'fb'";
			}
		} else if ( slope == Rubik.Slope.SLANTED ) {
			var layer = midPoint.getVLayerInUp(origin, this.hvSize, this.anglePerspective);
			if ( layer == Rubik.Layer.LOWER ) {
				move = lowToHigh ? Rubik.Move.L : Rubik.Move.LA;
			} else if ( layer == Rubik.Layer.HIGHER ) {
				move = lowToHigh ? Rubik.Move.RA : Rubik.Move.R;
			} else {
				move = lowToHigh ? Rubik.Move.VA : Rubik.Move.V; //"R'rl'" : "Rr'l";
			}
			
		} else {
		    //console.log("Points " + this.dragStart + " and " + this.dragEnd  + " gives " + slope.type + ". Ignored");
		}
		
	} else {  // drag is happening outside the cube surface, so simulate the rotation
		//var origin = new Rubik.Point(this.fluPosX, this.fluPosY);
		var slope = this.dragStart.getSlopeType(this.dragEnd, this.anglePerspective, Rubik.Side.UP);
		var lowToHigh = (slope == Rubik.Slope.HORIZONTAL ) 
				?(this.dragEnd.x > this.dragStart.x)
				:(this.dragEnd.y > this.dragStart.y);

		if ( slope == Rubik.Slope.HORIZONTAL ) {
			move = lowToHigh ? "d" : "d'";
		} else {
			move = lowToHigh ? "r'" : "r";
		}
	}
	
	if ( move == Rubik.Move.NONE ) {
		console.log("No move generated!");
	} else {
		console.log("Move: " + move);
	}
		
	return move;
};

