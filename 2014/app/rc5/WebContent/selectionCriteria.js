// atomType: one of Corner, Edge, (Center not implemented yet)
Rubik.SelectionCriteria = function (atomType, numOfAtomsMoved, allInOneSide) {
	if ( atomType == Rubik.Corner || atomType == Rubik.Edge  || atomType == Rubik.Center) {
		this.atomType = atomType;
	} else {
		this.atomType = null;
		console.log("Invalid argument in Rubik.SelectionCriteria. " + 
				atomType + " is not supported");
	}
	
	this.numOfAtomsMoved = numOfAtomsMoved;
	this.allInOneSide = allInOneSide;
};

// Cube cube
// returns true/false depending on if this criterion

Rubik.SelectionCriteria.prototype.verifier = function () {
	
	var that = this;
	return function(cube) {
		
		if ( that.numOfAtomsMoved < 0 ) {
			// ignore any movement
			return true;
		}

		var moveSeq = cube.computeTransformation();
		var cornersMoved = moveSeq.atomsMoved(Rubik.Corner);
		var edgesMoved = moveSeq.atomsMoved(Rubik.Edge);
		var centersMoved = moveSeq.atomsMoved(Rubik.Center);
		var totalMoved = cornersMoved + edgesMoved + centersMoved; 
		
		if ( totalMoved == 0 ) {
			return false;
		}
		
//		if ( that.atomType == Rubik.Corner) {
//			return cornersMoved == totalMoved && cornersMoved <= that.numOfAtomsMoved;
//		} else if ( that.atomType == Rubik.Edge) {
//			return edgesMoved == totalMoved && edgesMoved <= that.numOfAtomsMoved;
//		} else if ( that.atomType == Rubik.Center) {
//			return centersMoved == totalMoved && centersMoved <= that.numOfAtomsMoved;
//		} 

		if ( that.allInOneSide && !moveSeq.allOfAtomTypeInOneSide( that.atomType)) {
			return false;
		}
		
		if ( that.atomType == Rubik.Corner) {
			return cornersMoved <= that.numOfAtomsMoved;
		} else if ( that.atomType == Rubik.Edge) {
			return edgesMoved <= that.numOfAtomsMoved;
		} else if ( that.atomType == Rubik.Center) {
			return centersMoved <= that.numOfAtomsMoved;
		} 
		
		return false;
	};
};