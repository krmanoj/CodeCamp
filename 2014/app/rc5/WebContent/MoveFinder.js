// int maxMoves => maximum number of moves to be tried
// Array of function that accepts array of moves and return if the result is useful
Rubik.MoveFinder = function (maxMoves) {
	this.maxMoves = maxMoves;
	this.selectionCriteria = [];
	this.moveOnlyOuter = false;
	
	this.restrictSecondHalf = false;
	
	this.maxSequences = 1;  
	
	// it keeps track of what is the next set of moves we need to try
	
	this.nextLoopVars = new Array();
	this.cube = new Rubik.Cube();
	this.startTime = undefined;
	this.count = 0;
};

Rubik.MoveFinder.prototype.sequenceLength = function(len) {
	this.maxMoves = len;
	return this;
};

Rubik.MoveFinder.prototype.maxSequencesToFind = function(maxCount) {
	this.maxSequences = maxCount;
	return this;
};


Rubik.MoveFinder.prototype.moveOnlyOuterLayer = function(outer) {
	this.moveOnlyOuter = (outer == undefined ? false : outer );
	return this;
};

Rubik.MoveFinder.prototype.restrictSecondHalfMoves = function(restrictSecondHalf) {
	this.restrictSecondHalf = (restrictSecondHalf == undefined ? false : restrictSecondHalf );
	return this;
};

Rubik.MoveFinder.prototype.verifier = function(verifier) {
	this.selectionCriteria.push(verifier);
	return this;
};


Rubik.MoveFinder.prototype.find = function() {

	if ( this.count >= this.maxSequences ) {
		return;
	}
	
	if ( this.startTime === undefined ) {
		this.startTime = +new Date();
	}
	
	var curLen = this.nextLoopVars.length;
	if ( curLen < this.maxMoves) {
		
		var moveIndex;
		for ( moveIndex in Rubik.Move.ALL_MOVES) {
			
			var newMove = Rubik.Move.ALL_MOVES[moveIndex];
			
			// there is no point in trying sequence like ll2 or ll'
			if ( curLen > 0 && newMove.sameSideAs(this.nextLoopVars[curLen-1])) {
				continue;
			}
			
			// No point in trying cube rotation too
			if ( newMove.isRotatingCube() ) {
				continue;
			}
			
			if ( this.moveOnlyOuter && newMove.getLayerMovement() != Rubik.LayerMovement.OUTER ) {
				continue;
			}
			
			if ( this.restrictSecondHalf ) {
				// if we have already selected half of max number of moves, then the 
				// rest of the moves must be in the same layer as one of the already selected moves
				
				if ( curLen > (this.maxMoves+1)/2) {
					var useful = false;
					for(var k=0; k < this.maxMoves/2; k++) {
						if ( newMove.sameSideAs(this.nextLoopVars[k]) ) {
							useful = true;
							break;
						}
					}
					if ( !useful ) {
						continue;
					}
				}
			}
			
			
			this.cube.move(newMove);
			this.nextLoopVars[curLen] = Rubik.Move.ALL_MOVES[moveIndex];
			this.find();
			
			this.cube.undoLastMove();
			this.nextLoopVars.length = curLen;  // remove last element
		}
		return false;
	} else {
		
		//console.log("checking: " + this.cube.computeTransformation().toString());
        // we have accumulated  maxMoves number of moves
		// now try all selection criteria
		var j;
		for ( j = 0; j < this.selectionCriteria.length; j++ ) {
			if ( !this.selectionCriteria[j](this.cube) ) {
				return false;
			}
		}

		this.count++;

		console.log("Found a move: " + this.timeSoFar());
		console.log(this.cube.computeTransformation().toString());
		
		//alert("Found a move: " + this.cube.computeTransformation().toString());
		return true;
	}
	
};

Rubik.MoveFinder.prototype.timeSoFar = function() {
	
	var sofar = (+new Date()) - this.startTime;
	
	if ( sofar < 1000) {
		return "Count: " + this.count + " Time: " + sofar + " milliseconds";
	} else {
		sofar /= 1000;
	}
	
	if ( sofar < 60) {
		return "Count: " + this.count + " Time: " + sofar + " seconds";
	} else {
		sofar /= 60;
	}

	if ( sofar < 60) {
		return "Count: " + this.count + " Time: " + sofar + " minutes";
	} else {
		sofar /= 60;
	}

	
	return "Count: " + this.count + " Time: " + sofar + " hours";
};

