// Keeps track of the all pieces how they have moved from the original base positions.

// Input: List<Move> allMovesDone
Rubik.MoveSequence = function (allMovesDone) {
	
	// List<Move> allMovesDone: sequence of moves that are done on the cube
	this.allMovesDone = allMovesDone;
	
    this.cornerMovements = new Array();    // new ArrayList< List<Corner> >();
    this.middleMovements = new Array();    //new ArrayList< List<Edge> >();
    this.centerMovements = new Array();    //new ArrayList< List<Center> >();
};

    
// Create a new sequence where a new set of moved pieces can be stored.
// One sequence takes care of one cycle.
// Returns List<? extends Atom>
Rubik.MoveSequence.prototype.createSequence = function (atom) {
    var newSeq = new Array();
    
    if ( atom instanceof Rubik.Corner ) {
        this.cornerMovements.push( newSeq );      
    } else if ( atom instanceof Rubik.Edge ){
        this.middleMovements.push(newSeq);
    } else if ( atom instanceof Rubik.Center ){
        this.centerMovements.push(newSeq);
    } else {
        console.log("Bad atom type:" + (typeof atom));	
    }
    newSeq.push( atom );
    return newSeq;
};
    
Rubik.MoveSequence.prototype.toString = function() {
        
    var buf = "(";
    for(var i = 0; i < this.allMovesDone.length; i++) {
        buf = buf.concat(this.allMovesDone[i].toString());
    }
    buf = buf.concat(") ==>\n");  
    var len = buf.length;

    buf = this.printSequences(this.cornerMovements, buf);
    buf = this.printSequences(this.middleMovements, buf);
    buf = this.printSequences(this.centerMovements, buf);
    
    if ( len == buf.length ) {
    	// no movement
    	buf = buf.slice(0, buf.length-1).concat(" [ ]\n"); 
    }
    return buf;
};

//List < List <? extends Atom> > atomMovements, StringBuffer out
//Rubik.MoveSequence.prototype.printSequences = function (atomMovements, buf) {
//	
//    for (var i = 0; i < atomMovements.length; i++) {
//        var putArrow = false;
//        var atoms = atomMovements[i];
// 
//        for(var j = 0; j < atoms.length; j++) {
//            if ( putArrow ) {
//            	buf = buf.concat(" -> ");
//            } else {
//            	buf = buf.concat("    [ ");
//                putArrow = true;    
//            }
//            buf = buf.concat(atoms[j]); 
//        }
//        buf = buf.concat(" ]");
//
//        buf = buf.concat("\n");
//    }
//    return buf;
//};

Rubik.MoveSequence.prototype.printSequences = function (atomMovements, buf) {
	
    for (var i = 0; i < atomMovements.length; i++) {
        var putArrow = false;
        var atoms = atomMovements[i];
        var last;
        for(var j = 0; j < atoms.length-1; j++) {
            if ( putArrow ) {
            	buf = buf.concat(" -> ");
            } else {
            	last = atoms[j].startPos;
            	
            	buf = buf.concat("    [ " + last + " -> ");
                putArrow = true;    
            }
            last = atoms[j].newPos(last);
            buf = buf.concat(last); 

        }
        buf = buf.concat(" ]");

        buf = buf.concat("\n");
    }
    return buf;
};
// Side side, List < List <? extends Atom> > atomMovements
Rubik.MoveSequence.prototype.allInOneSideInASeq = function (side, atomMovements) {
    for (var i = 0; i < atomMovements.length; i++) {
    	var atoms = atomMovements[i];
        for(var j = 0; j < atoms.length; j++) {
            if ( !atoms[j].isInSide(side)) {
                return false;
            }
        }
    }
    return true;
};
    
Rubik.MoveSequence.prototype.allInOneSide = function (side) {
	return this.allInOneSideInASeq(side, this.middleMovements) && this.allInOneSideInASeq(side, this.cornerMovements);
};

//Returns true if all movements of specified atom type is in one side
//AtomType : one of Corner, Edge or Center
Rubik.MoveSequence.prototype.allOfAtomTypeInOneSide = function (atomType) {
	var cycles = this.getCyclesOfType(atomType);
	
	if ( cycles.length == 0 || cycles[0].length == 0) {
		return true;               // though nothing moved, we can assume that the condition is satsified
	}
	
	// Get one atom, and check for its each side if rest all the movements are in that side
	var sidesOfFirstAtom = cycles[0][0].newSides;
	
	for(var i=0; i < sidesOfFirstAtom.length; i++) {
		if ( this.allInOneSide( sidesOfFirstAtom[i] )) {
			return true;
		}
	}
	
	return false;
	
};


// Returns how many corners moved
// AtomType : one of Corner, Edge or Center
Rubik.MoveSequence.prototype.atomsMoved = function (atomType) {
	return this.sumOfAllCycles(this.getCyclesOfType(atomType));
};

// Array of array of atoms
Rubik.MoveSequence.prototype.sumOfAllCycles = function (cycles) {
	var moved = 0;
	for(var i = 0; i < cycles.length; i++) {
		moved += cycles[i].length-1;  // 1 less because first and last atoms are always same to complete the cycle
	}
	return moved;
};

/**
 * Get Cycles of  the given type
 * @param atomType Any if Rubik.Atom type
 * @returns Array < Array <? extends Atom> >
 */
Rubik.MoveSequence.prototype.getCyclesOfType = function (atomType) {
	if ( atomType == Rubik.Corner ) {
		return this.cornerMovements;
	} else if ( atomType == Rubik.Edge ) {
		return this.middleMovements;  
	} else if ( atomType == Rubik.Center ) {
		return this.centerMovements; 
	} else {
	    console.log("Invalid argument type in getCyclesOfType: " + atomType);
	}
};



