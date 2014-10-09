// Represents a move in the cube
// LayerMovement layerMovement
// String movements
// String symbolForMove
Rubik.Move = function (layerMovement, movements, symbolForMove) {

	// Save movements in object form with key as "from position", and value as "to position"
	// if movements is "ubdfu"
	// then transform it to { "u" : "b", "b" : "d", "d" : "f", "f" : "u"};

	this.movements = {};
	for(var i=0; i < movements.length-1; i++) {
		if ( this.movements[movements[i]] == undefined ) {  // to take care L2 kind of moves as there are two cycles in udufbf 
			this.movements[movements[i]] = movements[i+1];
		}
	}
	
	this.side = symbolForMove.toLowerCase().split('')[0];
	this.symbol = symbolForMove;
	this.layerMovement = layerMovement; // LayerMovement: OUTER, INNER or ALL
	Object.freeze(this);
};



//Right face clockwise movement can be expressed by 
// ubdfu => up -> back -> down -> front -> up

// following are for rotating the outer layers front, back, up, down, left and right
Rubik.Move.R =  new Rubik.Move(Rubik.LayerMovement.OUTER, "ubdfu", "R"); 
Rubik.Move.R2 = new Rubik.Move(Rubik.LayerMovement.OUTER, "udufbf","R2"); // Right twice
Rubik.Move.RA = new Rubik.Move(Rubik.LayerMovement.OUTER, "ufdbu", "R'");  // Right face anti clockwise
Rubik.Move.L =  new Rubik.Move(Rubik.LayerMovement.OUTER, "ufdbu", "L");
Rubik.Move.L2 = new Rubik.Move(Rubik.LayerMovement.OUTER, "udufbf","L2");
Rubik.Move.LA = new Rubik.Move(Rubik.LayerMovement.OUTER, "ubdfu", "L'");

Rubik.Move.U =  new Rubik.Move(Rubik.LayerMovement.OUTER, "flbrf", "U");
Rubik.Move.U2 = new Rubik.Move(Rubik.LayerMovement.OUTER, "fbflrl","U2");
Rubik.Move.UA = new Rubik.Move(Rubik.LayerMovement.OUTER, "frblf", "U'");
Rubik.Move.D =  new Rubik.Move(Rubik.LayerMovement.OUTER, "frblf", "D");;
Rubik.Move.D2 = new Rubik.Move(Rubik.LayerMovement.OUTER, "fbflrl","D2");
Rubik.Move.DA = new Rubik.Move(Rubik.LayerMovement.OUTER, "flbrf", "D'");

Rubik.Move.F =  new Rubik.Move(Rubik.LayerMovement.OUTER, "urdlu", "F");
Rubik.Move.F2 = new Rubik.Move(Rubik.LayerMovement.OUTER, "udulrl","F2");
Rubik.Move.FA = new Rubik.Move(Rubik.LayerMovement.OUTER, "uldru", "F'");
Rubik.Move.B =  new Rubik.Move(Rubik.LayerMovement.OUTER, "uldru", "B");
Rubik.Move.B2 = new Rubik.Move(Rubik.LayerMovement.OUTER, "udulrl","B2");
Rubik.Move.BA = new Rubik.Move(Rubik.LayerMovement.OUTER, "urdlu", "B'");

//following are for rotating the slices (layer between two outer surfaces
Rubik.Move.H =  new Rubik.Move(Rubik.LayerMovement.INNER, "frblf", "H");   // Horizontal slice (between UP and DOWN) clockwise looking from Down
Rubik.Move.H2 = new Rubik.Move(Rubik.LayerMovement.INNER, "fbflrl","H2");  // Horizontal slice 180 deg
Rubik.Move.HA = new Rubik.Move(Rubik.LayerMovement.INNER, "flbrf", "H'");  // Horizontal slice anti clockwise looking from Down


Rubik.Move.V =  new Rubik.Move(Rubik.LayerMovement.INNER, "ubdfu", "V");   // Vertical slice between Left and Right, clockwise looking from Right
Rubik.Move.V2 = new Rubik.Move(Rubik.LayerMovement.INNER, "udufbf","V2");  // Vertical slice 180 deg
Rubik.Move.VA = new Rubik.Move(Rubik.LayerMovement.INNER, "ufdbu", "V'");  // Vertical slice anti-clockwise looking from Right


Rubik.Move.S =  new Rubik.Move(Rubik.LayerMovement.INNER, "urdlu", "S");   // Slice between Front and Back, clockwise looking from front 
Rubik.Move.S2 = new Rubik.Move(Rubik.LayerMovement.INNER, "udulrl","S2");  // Slice between Front and Back, 180 deg
Rubik.Move.SA = new Rubik.Move(Rubik.LayerMovement.INNER, "uldru", "S'");  // Slice between Front and Back, anti-clockwise looking from front



// Moves to rotate the whole cube
Rubik.Move.r =  new Rubik.Move(Rubik.LayerMovement.ALL, "ubdfu", "r");   // Rotate cube clockwise looking from right
Rubik.Move.r2 = new Rubik.Move(Rubik.LayerMovement.ALL, "udufbf", "r2"); // Rotate cube 180 deg looking from right
Rubik.Move.ra = new Rubik.Move(Rubik.LayerMovement.ALL, "ufdbu", "r'");  // Rotate cube ant-clockwise looking from right
Rubik.Move.l =  new Rubik.Move(Rubik.LayerMovement.ALL, "ufdbu", "l");
Rubik.Move.l2 = new Rubik.Move(Rubik.LayerMovement.ALL, "udufbf", "l2");
Rubik.Move.la = new Rubik.Move(Rubik.LayerMovement.ALL, "ubdfu", "l'");

Rubik.Move.u =  new Rubik.Move(Rubik.LayerMovement.ALL, "flbrf", "u");
Rubik.Move.u2 = new Rubik.Move(Rubik.LayerMovement.ALL, "fbflrl", "u2");
Rubik.Move.ua = new Rubik.Move(Rubik.LayerMovement.ALL, "frblf", "u'");
Rubik.Move.d =  new Rubik.Move(Rubik.LayerMovement.ALL, "frblf", "d");;
Rubik.Move.d2 = new Rubik.Move(Rubik.LayerMovement.ALL, "fbflrl", "d2");
Rubik.Move.da = new Rubik.Move(Rubik.LayerMovement.ALL, "flbrf", "d'");

Rubik.Move.f =  new Rubik.Move(Rubik.LayerMovement.ALL, "urdlu", "f");
Rubik.Move.f2 = new Rubik.Move(Rubik.LayerMovement.ALL, "udulrl", "f2");
Rubik.Move.fa = new Rubik.Move(Rubik.LayerMovement.ALL, "uldru", "f'");
Rubik.Move.b =  new Rubik.Move(Rubik.LayerMovement.ALL, "uldru", "b");
Rubik.Move.b2 = new Rubik.Move(Rubik.LayerMovement.ALL, "udulrl", "b2");
Rubik.Move.ba = new Rubik.Move(Rubik.LayerMovement.ALL, "urdlu", "b'");

Object.defineProperty( Rubik.Move, "NONE", 
		{ 
			value :  new Rubik.Move(null, "", ""), 
			writable : false, 
			enumerable : false, 
			configurable : false 
		});

// Build an array of all moves
(function() {
	Rubik.Move.ALL_MOVES = [];
	
	for (var key in Rubik.Move) {
		if ( Rubik.Move[key].layerMovement ) {
			Rubik.Move.ALL_MOVES.push(Rubik.Move[key]);
		}
	}
	
}());

//// All possible moves
//Rubik.Move.ALL_MOVES = [ 
//    Rubik.Move.R, Rubik.Move.R2, Rubik.Move.RA, 
//    Rubik.Move.L, Rubik.Move.L2, Rubik.Move.LA, 
//    Rubik.Move.U, Rubik.Move.U2, Rubik.Move.UA, 
//    Rubik.Move.D, Rubik.Move.D2, Rubik.Move.DA, 
//    Rubik.Move.F, Rubik.Move.F2, Rubik.Move.FA, 
//    Rubik.Move.B, Rubik.Move.B2, Rubik.Move.BA, 
//    
//    Rubik.Move.H, Rubik.Move.H2, Rubik.Move.HA, 
//    Rubik.Move.V, Rubik.Move.V2, Rubik.Move.VA, 
//    Rubik.Move.S, Rubik.Move.S2, Rubik.Move.SA, 
//
//    Rubik.Move.r, Rubik.Move.r2, Rubik.Move.ra, 
//    Rubik.Move.l, Rubik.Move.l2, Rubik.Move.la, 
//    Rubik.Move.u, Rubik.Move.u2, Rubik.Move.ua, 
//    Rubik.Move.d, Rubik.Move.d2, Rubik.Move.da, 
//    Rubik.Move.f, Rubik.Move.f2, Rubik.Move.fa, 
//    Rubik.Move.b, Rubik.Move.b2, Rubik.Move.ba 
//
//    ];
//
//// All undo moves. Undo of a move like ALL_MOVES[i] is ALL_UNDO_MOVES[i]
//Rubik.Move.ALL_UNDO_MOVES = [ 
//	Rubik.Move.RA, Rubik.Move.R2, Rubik.Move.R, 
//	Rubik.Move.LA, Rubik.Move.L2, Rubik.Move.L, 
//	Rubik.Move.UA, Rubik.Move.U2, Rubik.Move.U, 
//	Rubik.Move.DA, Rubik.Move.D2, Rubik.Move.D, 
//	Rubik.Move.FA, Rubik.Move.F2, Rubik.Move.F, 
//	Rubik.Move.BA, Rubik.Move.B2, Rubik.Move.B, 
//	
//    Rubik.Move.HA, Rubik.Move.H2, Rubik.Move.H, 
//    Rubik.Move.VA, Rubik.Move.V2, Rubik.Move.V, 
//    Rubik.Move.SA, Rubik.Move.S2, Rubik.Move.S, 
//
//	Rubik.Move.ra, Rubik.Move.r2, Rubik.Move.r, 
//	Rubik.Move.la, Rubik.Move.l2, Rubik.Move.l, 
//	Rubik.Move.ua, Rubik.Move.u2, Rubik.Move.u, 
//	Rubik.Move.da, Rubik.Move.d2, Rubik.Move.d, 
//	Rubik.Move.fa, Rubik.Move.f2, Rubik.Move.f, 
//	Rubik.Move.ba, Rubik.Move.b2, Rubik.Move.b
//	
//
//	];


// This method is used to find the new face of one of the sides of an atom (corner or edge)
// Parameter old: one of the sides of the atom which is moving

// what is the new position of the old face after THIS move
// For example, Rubik.Move.R =  new Rubik.Move("ubdfu", "r");
// If the 'old' is 'b' (back face) then as specified in "ubdfu", back moves to down. So this method 
// will return 'd'  which is the new position of 'b'.
// Also, in this move, right and left face do not get affected, so if the 'old' face is not 
// in "ubdfu", means the specified face is not affected.

Rubik.Move.prototype.nextPos = function(old) {

    // Old implementation	
    //    var pos = this.movements.indexOf(old);
    //    return (pos == -1) ? old : this.movements.charAt(pos+1);

    // New Implementation, with temp var	
    //	var pos =  this.movements[old];
    //	return (pos == 'undefined' ? old : pos);

	return this.movements[old] || old;
};

// check if this move affects the "side" the atom is in
// parameter atom is an array of all the faces like fru is passed as ['f', 'r', 'u'] 
// Corner fru gets affected only by F, R or U moves. L, D, B moves will not affect fru corner
// Edge fr gets affected if F, R, 
Rubik.Move.prototype.isChanging = function(atomSides) {
	
	if ( this.layerMovement == Rubik.LayerMovement.INNER ) {
		// middle slices do not move any corner
		if (atomSides.length == 3) {
			return false;
		}
		
		// for inner slice, "side" is not defined, as those are H, V and S
		// so edge will change only if both sides of edges are in 'movement' field
		// 
	    for(var i=0; i < atomSides.length; i++) {
	        
	    	// when you check if a variable is undefined or not, use undefined keyword ( string 'undefined' is wrong!)
	    	// when you check type undefined, use string 'undefined'
	    	
	    	if ( this.movements[atomSides[i]] == undefined) { 
	            return false;
	        }
	    	
	    }
	    return true;
	}
	
	// now take care of Rubik.LayerMovement.OUTER and Rubik.LayerMovement.ALL
    for(var i=0; i < atomSides.length; i++) {
        if ( atomSides[i] == this.side) 
            return true;
    }
    return false;
};


// converts a string moves to an array
// moves: String i.e "R L2 R'"
// returns: Array of moves i.e. [Rubik.Move.R, Rubik.Move.L2, Rubik.Move.RA]
// Static method
Rubik.Move.getMoves = function(moves) {
    var retMoves = new Array();
    for(var i=0; i < moves.length; i++) {
        if ( moves.charAt(i) == ' ')
            continue;
        if( (i+1) < moves.length && (moves.charAt(i+1) == '2' || moves.charAt(i+1) == '\'') ) {
            retMoves.push(this.getMove(moves.substring(i, i+2)));
            i++;    
        } else {
            retMoves.push(this.getMove(moves.substring(i, i+1)));
        }
            
    }
    return retMoves;
};

// Get the move object associated with the specified move in string format
// Like "R2" will give Rubik.Move.R2
// Parameter move: String

// OLD implementation.. very inefficient
//Rubik.Move.getMove = function(move) {
//    for(var i=0; i < Rubik.Move.ALL_MOVES.length; i++) {
//        if ( Rubik.Move.ALL_MOVES[i].symbol == move) {
//            return Rubik.Move.ALL_MOVES[i];
//        }
//    }
//    console.log("Bad move: " + move);
//    return null;
//};

Rubik.Move.getMove = function(move) {
	
	var moveProp;
	
	if ( move.length > 1 && move.charAt(1) === "'") {
		// if move is X', property name should be XA
		// if move is x', property name should be xa
		// So replace ' by A or a accordingly

		moveProp = move.replace("'", (move.charCodeAt(0) > 90) ? "a" : "A");
	
	} else {  // X, X2, x and x2 kind of moves match exactly with property names
		moveProp = move;
	}
	
	var moveObj = Rubik.Move[moveProp];
	
	if ( moveObj == 'undefined' ) {
		console.log("Bad move: " + move);
	}
	
    return moveObj;
};

// Find the move that can undo THIS move.
//Rubik.Move.prototype.getUndoMove = function() {
//    for(var i=0; i < Rubik.Move.ALL_MOVES.length; i++) {
//        if ( Rubik.Move.ALL_MOVES[i].symbol == this.symbol ) {
//            return Rubik.Move.ALL_UNDO_MOVES[i];
//        }
//    }
//    return null;      
//};
Rubik.Move.prototype.getUndoMove = function() {
	if ( this.symbol.length > 1 ) {
		if ( this.symbol.charAt(1) === "2" ) {
			// for all X2 moves, undo move is same as this one

			return this;
			
		} else if ( this.symbol.charAt(1) === "'") {

			// for all X' moves, the reverse is X, so remove ' and look for the move

			return Rubik.Move[this.symbol.charAt(0)];
		} else {

			console.log("System Error: '" + this.symbol + "' has bad second char");
			return Rubik.Move.NONE;
		}
	} else {  // move is single letter (clockwise) like X. Append a or A to make it anticlockwise,
		// (i.e. XA or xa) and then look for property
		
		return Rubik.Move[this.symbol.charAt(0) + ((this.symbol.charCodeAt(0) > 90) ? "a" : "A")];
	}
};

Rubik.Move.prototype.toString = function() {
    return this.symbol;    
};

// Check if this move and the specified move are happening on the same side
// for example, r, r2, r' all moves happen r side.
// Parameter move : Rubik.Move
Rubik.Move.prototype.sameSideAs = function(move) {
    return this.symbol.charAt(0) == move.symbol.charAt(0);
};

Rubik.Move.prototype.isRotatingCube = function(){
	return this.layerMovement == Rubik.LayerMovement.ALL;
};

Rubik.Move.prototype.getLayerMovement = function(){
	return this.layerMovement;
};


Object.freeze(Rubik.Move);

