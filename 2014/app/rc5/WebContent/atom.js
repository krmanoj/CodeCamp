// Constructor for atoms
// Input: String
//        String form:  "l", "lfu" or "lf"

Rubik.Atom = function (sides) 

{
	// input: sides, for example corner could be "fru", and middle could be "fu"
	// sides : array of 'sides' of the atom
	
	// Simplest implementation
	// this.sides = sides
	
	if ( ! (sides instanceof String) && ! ( typeof sides == 'string') ) {     
		throw new Rubik.RCException("InvalidArgumentType", 
				"Atom constructor called with wrong arugement type: '" + (typeof sides) + 
				"'. Only String is supported, i.e. 'rfu' or 'lf' or 'b'");

	}
	
	// in cross window objects, these patterns are unreliable, check object by its characteristics
	// duck typing :) if it looks/acts like a duck, then it is a duck for all practical purposes .. 
	// and then after God only knows...
	
	Object.defineProperties( 
		this, 
		{
		    startPos : { value: sides, writable : false, enumerable : false, configurable : false }
		});
	
	// I thought I can make "sides" readonly but it is just the "side property" is not writable, but "side object" is modifiable 
	
	// movement contains map from old position to new position
	// To start with new and old both are same
	this.movement = {};
	this.newSides = new Array();
	
	for ( var i=0; i < this.startPos.length; i++) {
		var side = this.startPos.charAt(i);
		this.movement[side] = side;
		this.newSides.push(side);
		this.originalUID += Rubik.Side[side].numId;
	}
	
	//this.newPos = this.startPos;  define if we need

	
	this.uid = 0;   // uid of the moved positions, changes after movement of this atom
	
	// Generate the unique ID of the starting position. This original UID never changes

	Object.defineProperty ( this, "originalUID",
			{ value: this.getUId(), writable : false, enumerable : true, configurable : false }
	);
};

//// Get array of sides of this atom
//// Return a copy of the array side so not to disturb the private array "sides"
//Rubik.Atom.prototype.getSides = function () {
//	return this.copySides(this.sides);
//};

////must be provided by sub class
//Rubik.Atom.prototype.createNew = function () {
//	throw new Rubik.RCException("MethodNotImplemented", "createNew Must be overrriden by sub class '" +
//			(typeof this) + "'");
//	return 0;
//};

//// static method
//// Make a copy of the array of sides
//// Input: sides is array color 
//Rubik.Atom.prototype.copySides = function(sides) {
////    var copy = new Array(); 
////    for(var i=0; i < sides.length; i++ ) {
////        copy[i] = sides[i];
////    }
////    return copy;
//	
//	return sides.slice(0);
//};

// Get the unique id of the moved position (orientation of sides are ignored)
// Lazily computed when required first time
// Undefined whenever sides change because of movement
Rubik.Atom.prototype.getUId = function() {
	if ( this.uid == 0 ) {
		for(var side in this.movement) {
			this.uid += Rubik.Side[this.movement[side]].numId;  // numIDs are distinct powers of 2, so they can be added. so lfu, flu, ulf all will have the same uid.
		}
	}
	return this.uid;
};

//Get the unique id of any atom whose sides are passed in string form
Rubik.Atom.getUId = function(sides) {
	var uid = 0;
	for(var i=0; i < sides.length; i++) {
		uid += Rubik.Side[sides[i]].numId;  // numIDs are distinct powers of 2, so they can be added. so lfu, flu, ulf all will have the same uid.
	}
	return uid;
};

// Apply the specified move to this piece. 
// Input Move move
Rubik.Atom.prototype.move = function(move) {
    
	this.newSides.length = 0;
    for(var side in this.movement) {
    	var newSide = move.nextPos(this.movement[ side ]);
    	this.movement[ side ] = newSide;
    	this.newSides.push(newSide);
    }

    this.uid = 0;  // position has changed so re-compute next time it is needed 
    
    return this;
};

Rubik.Atom.prototype.toString = function() {
	var out = "";
	
    for(var side in this.movement) {
    	out += this.movement[side];
    }
    
    return out;
};

Rubik.Atom.prototype.details = function() {
	return this.toString();
};


Rubik.Atom.prototype.hasMoved = function() {
	
    for(var side in this.movement) {
    	if ( side != this.movement[side])
    		return true;
    }
    
    return false;
};

Rubik.Atom.prototype.origSide = function(newSide) {
	
    for(var side in this.movement) {
    	if ( newSide == this.movement[side])
    		return side;
    }
    
    throw new Rubik.RCException("New side " + newSide + " is not a valid side for the atom: " + this.details());
};

// Check if the specified 'move' is affecting this atom
// Input Move move
Rubik.Atom.prototype.isChanging = function(move) {
    return move.isChanging(this.newSides);
};

//// Check if this atom is same atom with the same orientation as the argument
//// Input: Atom atom
//Rubik.Atom.prototype.equals = function(atom) {
//    for(var i=0; i < this.sidesCount; i++) {
//        if ( this.sides[i] != atom.sides[i] ) {
//            return false;
//        }
//    }
//    return true;
//};

//// Check if both arrays are of same length and same elements
////char [] f, char [] s
//Rubik.Atom.prototype.equalSides = function(f, s) {
//    if ( f.length != s.length) {
//        return false;
//    }
//    for( var i=0; i < f.length; i++) {
//        if ( f[i] != s[i]) {
//            return false;
//        }
//    }
//    return true;
//};

// ignore the rotation/orientation of the atom, and then compare if the passed atom is same as this
// so fru, rfu, urf all are referring to the same atom.
Rubik.Atom.prototype.same = function(atom) {
    if ( atom == null ) {
        return false;
    }
//    var copy1 = this.copySides(atom.sides);
//    var copy2 = this.copySides(this.sides);
//    copy1.sort();
//    copy2.sort();        
//    return this.equalSides(copy1, copy2);
    
    return this.getUId() == atom.getUId();
};

// Check if "this" atom is in the side specified in the parameter
// Parameter 'side' could be of type Side or one char string representing the side
//
Rubik.Atom.prototype.isInSide = function(side) {

	if ( side.id ) {
		side = side.id;
	} 
	
	if ( ((side instanceof String) || ( typeof side == 'string')) && side.length > 0){
		 side = side.charAt(0);
	} else  {
	    console.log("Bad side passed to Atom.prototype.isInSide: type: '" + side + 
	    		"' Value: '" + side );	

		return false;
	}
	
	 for(var atomSide in this.movement) {
	        if ( this.movement[atomSide] == side ) {
	            return true;
	        }
	 }
	
    return false;
    
};

// Based on the movement formula given by baseFrom -> baseTo, compute the new orientation of "this" atom
// for example,
//    baseFrom: rfu
//    baseTo:   rub
//    this  :   fru  ( note that "this" atom and baseFrom atom should be the same atom!
//    return:   urb  ( note that rfu->rub => fru->urb
//
// Atom baseFrom, Atom baseTo
// returns Atom
//Rubik.Atom.prototype.whereTo = function(baseFrom, baseTo) {
//    var faces = baseFrom.sidesCount;
//    var newPos = new Array(); 
//    for(var i=0; i < faces; i++) {
//        // find corner[i] in baseFrom
//        var ch = this.sides[i];
//         for(var j=0; j < faces; j++) {
//            if ( baseFrom.sides[j] == ch) {
//                newPos[i] = baseTo.sides[j];
//                break;
//            }
//         }
//    }
//    
//    return this.createNew(newPos);
//    
//};

// origPos is some string like "flu"
// return the 
Rubik.Atom.prototype.newPos = function (origPos) {
	var newPos = "";
	for(var i=0; i < origPos.length; i++) {
		newPos += this.movement[origPos.charAt(i)];
	}
	return newPos;
};

// Reset the position to original
Rubik.Atom.prototype.reset = function() {
    for(var side in this.movement) {
    	this.movement[ side ] = side;
    }

};


