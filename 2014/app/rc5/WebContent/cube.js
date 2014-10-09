Rubik.Cube = function (size) {
	this.size = size || 3;
	this.init();
	
	console.log("Cube initialized.");
};

// Reset to the start position
Rubik.Cube.prototype.init = function() {

	this.corners = Rubik.Corner.getBaseList();
	
	this.edges = Rubik.Edge.getBaseList();
	
	this.centers = Rubik.Center.getBaseList();
	
	this.atoms = new Array().concat(this.corners, this.edges, this.centers);
	
	// create a map from originalUID of atom to Atom object for faster search by UID
	this.atomsByoriginalUID = {} ;
	this.atomsByNewPosUId = {};  // both are same to start with
	for (var index=0; index < this.atoms.length; index++ ) {
		this.atomsByoriginalUID[this.atoms[index].originalUID] = this.atoms[index];
		this.atomsByNewPosUId[this.atoms[index].originalUID] = this.atoms[index];
		
	}
	
	this.reset();
};

//go back to original, arranged structure
Rubik.Cube.prototype.reset = function () {
	
	this.atoms.forEach ( 
		function (atom) {
			atom.reset(); 
		} 
	);

	this.sideColors = new Object();
	
	this.setColor(Rubik.Side.FRONT, Rubik.Color.WHITE);
	this.setColor(Rubik.Side.BACK,  Rubik.Color.YELLOW);
	this.setColor(Rubik.Side.RIGHT, Rubik.Color.BLUE);
	this.setColor(Rubik.Side.LEFT,  Rubik.Color.ORANGE);
	this.setColor(Rubik.Side.UP,    Rubik.Color.GREEN);
	this.setColor(Rubik.Side.DOWN,  Rubik.Color.RED);
   
	this.allMovesDone = new Array();
	
    return this;
};

// Set only in the beginning, this does not change later
Rubik.Cube.prototype.setColor = function (side, color) {
	this.sideColors[side.id] = color;
};

// Get the initial color of a side
Rubik.Cube.prototype.getColor = function (side) {
	return this.sideColors[side.id];
};

// Get the color of the specified side of the specified atom right now (possibly after some movement or in the beginning)
// atomSides is like "flu"
// side is of type Side
Rubik.Cube.prototype.getAtomColor = function (atomSides, side) {

	var uid = Rubik.Atom.getUId(atomSides);
	
	var atom = this.atomsByNewPosUId[uid];
	if ( atom ) {
		return   this.getColor(Rubik.Side.getSide(atom.origSide(side)));  
	}
	
//	for( var i = 0; i < atoms.length; i++) {
//		if ( atoms[i].getUId() === uid ) {
//			return   this.getColor(Rubik.Side.getSide(atoms[i][side]));  ;
//		}
//	}
	
	// should never happen
	// throw runtime exception
	return Rubik.Color.ERROR;
};


// Do a single move, like r or l2
// Move move
// String move(s)
Rubik.Cube.prototype.move = function (move) {
	
	if ( move instanceof Rubik.Move ) {
		this.allMovesDone.push(move);
		this.moveWithoutRecording(move);
	} else if ( move instanceof String || typeof move == 'string') {  // could be String object or String literal
		// move is a sequence of many moves
		// Do all the moves as specified in the string

		var allMoves = Rubik.Move.getMoves(move);
		for(var i=0; i < allMoves.length; i++) {
		    this.move(allMoves[i]);
		}
	} else {
		console.log("Invalid argument type of variable " + move);
	}
	
	return this;
};

// Do the move but not record. Recording should be done by the caller
// Input: Move move
// returns this
Rubik.Cube.prototype.moveWithoutRecording = function(move) {
	
	var layerMoving = move.getLayerMovement();
	
	var centerMoving = layerMoving == Rubik.LayerMovement.ALL || layerMoving == Rubik.LayerMovement.INNER;

	
    for (var index in this.atoms) {
    	var atom = this.atoms[index];
    	var  isCenter = atom instanceof Rubik.Center;
    	
    	if ( layerMoving == Rubik.LayerMovement.ALL ||
    			isCenter && centerMoving ||
    			!isCenter &&  atom.isChanging(move) ) {
    		this.atoms[index].move(move);
    	}
    }
    
	this.atomsByNewPosUId = {} ;
	
	for (var index=0; index < this.atoms.length; index++ ) {
		this.atomsByNewPosUId[this.atoms[index].getUId()] = this.atoms[index];
	}

    return this;
    
};

// find the undo-move of the last-move and do it.
Rubik.Cube.prototype.undoLastMove = function () {
	if ( this.allMovesDone.length == 0 ) {
		console.log("Nothing to undo");
		return;
	}
    var lastMove = this.allMovesDone.pop();
    this.moveWithoutRecording( lastMove.getUndoMove());
};



// Do all the backward and anti moves as specified in the string
// String moves
Rubik.Cube.prototype.reverseMove = function(moves) {
    var allMoves = Rubik.Move.getMoves(moves);
    for(var i = allMoves.size()-1; i >= 0; i--) {
        this.move( allMoves.get(i).getUndoMove() );
    }
    return this;
};

// Returns a MoveSequence describing all movements
Rubik.Cube.prototype.computeTransformation = function () {
	
	if ( arguments.length == 0 ) {
		// After doing some moves, use this method to find out what pieces moved where
		// returns MoveSequence

		var moveSeq = new Rubik.MoveSequence(this.allMovesDone);
		this.computeAtomTransformation(this.atoms, moveSeq);
		return moveSeq;
	} else if ( arguments.length == 1){
		// DO specified moves in a new Cube, and then find out what pieces moved where
		// String moves
		// Should have been static method
	    var cube = new Rubik.Cube();
	    cube.move(arguments[0]);
	    return cube.computeTransformation();
	}
};


// Find out what atom moved and to where. Utility method that takes care of 
// corner or middle at a time
// Atom [] from, Atom [] to, MoveSequence moveSeq

Rubik.Cube.prototype.computeAtomTransformation = function(atoms, moveSeq) {
    var size = atoms.length;
    for(var i=0; i < size; i++) {
    	atoms[i].visited = false;
    }
    while( true ) {
        // find the atom we have not visited
        var foundNotVisited = -1;
        for(var i=0; i < size; i++) {
            if ( ! atoms[i].visited ) {
                foundNotVisited = i;
                break;
            }
        }
        if ( foundNotVisited == -1) {  // all atoms visited so we are done
            break;
        }
        var start = atoms[foundNotVisited];  // start of a new sequence
        
        start.visited = true;
        
        if ( start.hasMoved() ) {
            var next = null;
            var seq = moveSeq.createSequence(start);  // create a new sequence with start as the first cubelet
            var current = start;
            while ( !start.same(next)) {
            	next = this.atomsByoriginalUID[current.getUId()];
                         
                 seq.push(next);
                 next.visited = true;

                 if ( seq.length > 13) {
                     console.log("Error!");
                     console.log(moveSeq);
                 }
                 current = next;
            }
        }  // else this cubelet has not moved as its new position is same as old
    }
};

//Rubik.Cube.prototype.allChangesInOneSide = function() {
//    var c1=0, c2=0, c3=0;
//    for (var i=0; i < 12; i++ ) {
//        var edge = MIDDLE_ARRANGED[i];
//        if ( !edge.equals(middleNewPos[i]) ) {
//            if ( c1 == 0 ) {
//                c1 = edge.getSides()[0];
//                c2 = edge.getSides()[1];
//            } else {
//                if ( c2 != 0 && !edge.isInSide(c2) ) {
//                    c2 = 0;
//                }
//                if ( c1 != 0 && !edge.isInSide(c1) ) {
//                    c1 = 0;
//                }
//                
//                if ( c1 == 0 ) {
//                    c1 = c2;
//                }
//                
//                if ( c1 == 0 ) {
//                    return false;
//                }
//            }
//        }
//    }
//
//    
//    for (var i=0; i < 8; i++ ) {
//        var corner = CORNERS_ARRANGED[i];
//        if ( !corner.equals(cornersNewPos[i]) ) {
//            if ( c1 == 0 ) {
//                c1 = corner.getSides()[0];
//                c2 = corner.getSides()[1];
//                c3 = corner.getSides()[2];
//            } else {
//                if ( c3 != 0 && !corner.isInSide(c3) ) {
//                    c3 = 0;
//                }
//
//                if ( c2 != 0 && !corner.isInSide(c2) ) {
//                    c2 = 0;
//                }
//                if ( c1 != 0 && !corner.isInSide(c1) ) {
//                    c1 = 0;
//                }
//                if ( c2 == 0 && c3 != 0) {
//                    c2 = c3;
//                    c3 = 0;
//                }                    
//                if ( c1 == 0 ) {
//                    c1 = (c3 == 0) ? c2 : c3;
//                    if ( c3 == 0) {
//                        c1 = c2;
//                        c2 = 0;
//                    } else if ( c2 != 0){
//                        c1 = c2;
//                        c2 = 0;
//                    }
//                }
//                
//                if ( c1 == 0 ) {
//                    return false;
//                }
//            }
//        }
//        
//    }
//    return c1 != 0;
//    
//};

Rubik.Cube.prototype.allChangesInOneSide = function() {
    var c1=0, c2=0, c3=0;
    for (var i=0; i < this.edges.length; i++ ) {
        var edge = this.edges[i];
        if ( edge.hasMoved() ) {
            if ( c1 == 0 ) {
                c1 = edge.getSides()[0];
                c2 = edge.getSides()[1];
            } else {
                if ( c2 != 0 && !edge.isInSide(c2) ) {
                    c2 = 0;
                }
                if ( c1 != 0 && !edge.isInSide(c1) ) {
                    c1 = 0;
                }
                
                if ( c1 == 0 ) {
                    c1 = c2;
                }
                
                if ( c1 == 0 ) {
                    return false;
                }
            }
        }
    }

    
    for (var i=0; i < 8; i++ ) {
        var corner = this.corners[i];
        if ( corner.hasMoved() ) {
            if ( c1 == 0 ) {
                c1 = corner.getSides()[0];
                c2 = corner.getSides()[1];
                c3 = corner.getSides()[2];
            } else {
                if ( c3 != 0 && !corner.isInSide(c3) ) {
                    c3 = 0;
                }

                if ( c2 != 0 && !corner.isInSide(c2) ) {
                    c2 = 0;
                }
                if ( c1 != 0 && !corner.isInSide(c1) ) {
                    c1 = 0;
                }
                if ( c2 == 0 && c3 != 0) {
                    c2 = c3;
                    c3 = 0;
                }                    
                if ( c1 == 0 ) {
                    c1 = (c3 == 0) ? c2 : c3;
                    if ( c3 == 0) {
                        c1 = c2;
                        c2 = 0;
                    } else if ( c2 != 0){
                        c1 = c2;
                        c2 = 0;
                    }
                }
                
                if ( c1 == 0 ) {
                    return false;
                }
            }
        }
        
    }
    return c1 != 0;
    
};

// Check if it arranged by comparing the new pos from the base position
Rubik.Cube.prototype.isArranged = function() {
	for (var index=0; index < this.atoms.length; index++ ) {
		if ( this.atoms[i].hasMoved() ) {
			return true;
		}
	}
	return false;
};

// find out how many corners moved
Rubik.Cube.prototype.cornersMoved = function() {
    var count=0;
	for (var index=0; index < this.corners.length; index++ ) {
		if ( this.atoms[i].hasMoved() ) {
			count++;
		}
	}
    return count;
};

// find out how many middle atom moved.
Rubik.Cube.prototype.middleMoved = function () {
    var count=0;
	for (var index=0; index < this.edges.length; index++ ) {
		if ( this.atoms[i].hasMoved() ) {
			count++;
		}
	}
    return count;
    
};



//Rubik.Cube.prototype.dump1 = function () {
//    System.out.println("----------------------");
//    for (var i=0; i < 8; i++ ) {
//    
//        console.log(CORNERS_ARRANGED[i] + " -> " + (CORNERS_ARRANGED[i].equals(cornersNewPos[i]) ? "" : cornersNewPos[i].toString()));
//    }
//    for (var i=0; i < 12; i++ ) {
//        console.log(MIDDLE_ARRANGED[i] + " -> " + (MIDDLE_ARRANGED[i].equals(middleNewPos[i]) ? "" : middleNewPos[i].toString()));
//    }
//    console.log("----------------------");
//};
//
//
//Rubik.Cube.prototype.dump = function () {
//    var out = "";
//    for (var i=0; i < 8; i++ ) {
//        if ( !this.CORNERS_ARRANGED[i].equals(this.cornersNewPos[i]) )
//            out = out + this.CORNERS_ARRANGED[i].toString() + " -> " + this.cornersNewPos[i].toString() + " ";
//    }
//    
//    out.concat(" ");
//    
//    for (var i=0; i < 12; i++ ) {
//        if ( !this.MIDDLE_ARRANGED[i].equals(this.middleNewPos[i]) )
//        	out = out + this.MIDDLE_ARRANGED[i].toString() + " -> " + this.middleNewPos[i].toString() + " ";
//    }
//    
//    return out;
//};

Rubik.Cube.prototype.test = function(moves) {
    var cube = new Rubik.Cube();
    
    if ( arguments.length > 0 ) {
        cube.move(arguments[0]);
        
        var ms = cube.computeTransformation();
        console.log(ms);
        console.log(cube.cornersMoved());
        console.log(cube.middleMoved());
        return;
    }
//    // get input from command line
//    byte [] bytes = new byte[256];
//    int count;
//    
//    while (true) {
//        System.out.print("> ");
//        try {
//            count = System.in.read(bytes);
//            StringBuffer buf = new StringBuffer();
//            boolean move = true;
//            for (int i=0; i < count; i++) {
//                if ( bytes[i] == '\r' || bytes[i] == '\n') 
//                    break;
//                char ch = (char)(bytes[i]);
//                if ( i == 0 && ch == 'q') {
//                    return;
//                } else if ( i == 0 && ch == 's') {
//                    cube.reset();
//                    move = false;
//                    break;
//                }
//                buf.append((char)(bytes[i]));
//            }
//            
//            if ( move && buf.length() > 0) {
//                cube.move(buf.toString().trim());
//                
//                MoveSequence ms = cube.computeTransformation();
//                System.out.println(ms);
//                System.out.println(cube.cornersMoved());
//                System.out.println(cube.middleMoved());
//            }                
//            
//        } catch (IOException e) {
//            // TODO
//            e.printStackTrace();
//        }
//        
//    }

};


