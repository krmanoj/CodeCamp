/**
 * 
 */

Rubik.FunctionalCube = function () {
	
	// faces: 
	//   0 -> front
	//   1 -> up
	//   2 -> right
	//   3 -> back
	//   4 -> down
	//   5 -> left
	
	// Atom is represented by an array of numbers
	
	var initialAtoms = [
	            // Corners
	            [0,1,2], [0,1,5], [0,4,2], [0,4,5], [3,1,2], [3,1,5], [3,4,2], [3,4,5],
	            
	            // middles
	            [0, 1], [0, 2], [0, 4], [0, 5],
	            [3, 1], [3, 2], [3, 4], [3, 5],
	            [1, 5], [1, 2], [4, 5], [4, 2],
	            
	            //centers
	            [0], [1], [2], [3], [4], [5]
	            ];
	
	// Keeps the current state of each atom, index into this array is same as the index of initialAtoms
	var movedAtoms;
	
	function resetCube () {
		
		// initial value of movedAtoms is same as initialAtoms. Make a deep copy          

		movedAtoms = initialAtoms.map( function( atom ) {
			return  atom.map( function ( face ) { 
				return face;
			});
		});
	};
	
	resetCube();
	
	
	// take a transformation and repeat it
	// so c0 (Face 0 clockwise) gives t0 (Face 0 twice clockwise)
	
//	function transForward_old (trans) {
//		var newTrans = new Array(); 
//		for (var i = 0; i < trans.length; i++) {
//			newTrans[i] = trans[trans[i]];
//		}
//		return newTrans;
//	} 
//	
//	function transForward_old2 (trans) {
//		var newTrans = [];
//		trans.forEach( function(element) {
//			newTrans.push(trans[element]);
//		});
//		return newTrans;
//	} 

	function transForward (trans) {
		return trans.map( function(element) {
			return trans[element];
		});
	} 
	
	//take a transformation and reverse it
	//so c0 gives a0
//	function transBackward_old (trans) {
//		var newTrans = new Array(); 
//		for (var i = 0; i < trans.length; i++) {
//			newTrans[trans[i]] = i;
//		}
//		return newTrans;
//	} 
	
	function transBackward (trans) {
		var newTrans = [];
		
		trans.forEach( function(element, index) {
			newTrans[element] = index;
		});
		return newTrans;
	} 
	
	

	//face 0 clockwise,  index moves to c0[index]
	var c0 = [0, 2, 4, 3, 5, 1];    // 0th face clockwise
	var t0 = transForward(c0);     // 0th face 180 deg (twice) 
	var a0 = transBackward(c0);    // 0th face anti clockwise
	
	var c3 = a0; 
	var t3 = transForward(c3);
	var a3 = transBackward(c3);
	
	var c1 = [5, 1, 0, 2, 4, 3];
	var t1 = transForward(c1);
	var a1 = transBackward(c1);
	
	var c4 = a1; 
	var t4 = transForward(c4);
	var a4 = transBackward(c4);
	
	var c2 = [1, 3, 2, 4, 0, 5];
	var t2 = transForward(c2);
	var a2 = transBackward(c2);
	
	var c5 = a2;
	var t5 = transForward(c5);
	var a5 = transBackward(c5);
	
	//faces: 
	//0 -> front
	//1 -> up
	//2 -> right
	//3 -> back
	//4 -> down
	//5 -> left
	
	// opposite faces are numerically 3 apart 
	//   front and back are 0 and 3
	//   up and down are 1 and 4 ..
	
	var faceIndices = {
	    F : 0,
	    U : 1,
	    R : 2,
	    B : 3,
	    D : 4,
	    L : 5
	};
	
	// Face name in the sequence of face numbers
	var faceNames = [ "F", "U", "R", "B", "D", "L"];
	
	var transformations = {
			
		// face/layer : [ transformation-for-clockwise, for-twice, for-anti-clockwise ]	
			
		F : [c0, t0, a0],
		U : [c1, t1, a1],
		R : [c2, t2, a2],
		B : [c3, t3, a3],
		D : [c4, t4, a4],
		L : [c5, t5, a5],
		
		H : [c4, t4, a4],   // same as D
		V : [c2, t2, a2],   // same as R
		S : [c0, t0, a0]    // same as F
	};
	
	var outerLayerOfSlice = {
		H : [1, 4],  // Horizontal layer is in between Up (1) and Down (4) 
		V : [2, 5],
		S : [0, 3]
	};
	
	
	// transform function
	// Apply function 'trans' to each member of array 'arr' and 
	//   put all the transformed elements in the same array
	
	function transform ( arr, trans) {
		arr.forEach( function(element, index) {
			arr[index] = trans (element) ;
		});
		return arr;
	};
	
	
	//Standard map function
	//Apply function 'trans' to each member of array 'arr' and 
	//return in a new array
	function map ( arr, trans) {
		var afterTrans = [];
		arr.forEach( function(element, index) {
			afterTrans[index] = trans( element );
		});
		return afterTrans;
	};
	
	
//	 function reduce_old ( arr, acc, reducer ) {
//		for (var i = 0; i < arr.length; i++) {
//			acc = reducer( acc, arr[i]);
//		}
//		return acc;
//	};
	
	function reduce ( arr, acc, reducer ) {
		arr.forEach( function(element) {
			acc = reducer( acc, element );
		});
		return acc;
	};
	// If the 'arr' array has specified element 'elem'
//	function has_old (arr, elem) {
//		for (var i = 0; i < arr.length; i++) {
//			if ( arr[i] === elem ) return true;
//		}
//		return false;
//	};

	function has (arr, elem) {
		return arr.some( function(elemToTest) {
			return elemToTest === elem;
		});
	};

	
	// if two atoms are same in position and orientation
	// basically all the numerical elements are same in both arrays
	function same (atom1, atom2) {
		for (var i = 0; i < atom1.length; i++) {
			if ( atom1[i] !== atom2[i] ) return false;
		}
		return true;
	};
	
	
	// works on movedAtoms, array of all atoms (atom is an array of all faces represented by numbers)
	// face which face is being rotated
	// faceTrans rule of transformation
	//    faceTrans is the array that gives how a face is moving
	//          in face represented by 'index' moves to faceTrans[index]

	function rotateFace ( face, faceTrans ) {
	    return transform ( movedAtoms,
	        function( atom ) {  // function that is applied for each atom
	    	    // check if this atom is affected
	            if ( has (atom, face )) 
	            	return transform ( atom,  
	            		function ( side ) {  // function that is applied to each face of one atom
	    	    	    	return faceTrans[side];
	    	    		}
	    	        );
	            else
	            	return atom;
		    }
	    );
	};
//	function rotateFace_old ( face, faceTrans ) {
//	    return transform ( movedAtoms,
//	        function( atom ) {  // function that is applied for each atom
//	    	    // check if this atom is affected
//	            if ( has (atom, face )) 
//	            	return transform ( atom,  
//	            		function ( side ) {  // function that is applied to each face of one atom
//	    	    	    	return faceTrans[side];
//	    	    		}
//	    	        );
//	            else
//	            	return atom;
//		    }
//	    );
//	};
	
	// Rotate the slice identified by its outer layers
	// sliceTrans is the transformation array
	// works on movedAtoms
	function rotateSlice ( outerLayer1, outerLayer2, sliceTrans ) {
	    return transform ( movedAtoms,
	            function( atom ) {  // function that is applied for each atom
	        	    // check if this atom is affected, corners never get affected by slice movement
	                if ( atom.length < 3 && !has (atom, outerLayer1 ) && !has (atom, outerLayer2 )) 
	                	return transform ( atom,  
	                		function ( side ) {  // function that is applied to each face of one atom
	        	    	    	return sliceTrans[side];
	        	    		}
	        	        );
	                else
	                	return atom;
	    	    }
	        );
	};
	
	
	// apply sequence of moves
	//   works on movedAtoms, that is an array of all atoms in the current position
	//   moves = string of all moves like LR2B'   etc..
	function applySequence (moves) {
		var index = 0;
		var size = moves.length;
		while ( index < size ) {
			var face = moves.charAt(index++);
			
			if ( face == " ") {
				continue;
			}
			
			var rotation = moves.charAt(index);
			
			var trans = 0;
			
			if ( rotation == "2") {
			    trans = 1;
			    index++;
			} else if ( rotation == "'") {
				trans = 2;
				index++;
			}
	
			var faceIndex = faceIndices[face];
			
			if ( faceIndex == undefined ) {
				// try layer
				var outerLayers = outerLayerOfSlice[face];
				
				if ( outerLayers == undefined ) {
				
					throw "Face '" + face + "' is not valid at index " + index +
					" in sequence '" + moves + "'";
				}
				rotateSlice( outerLayers[0], outerLayers[1], transformations[face][trans]);
			} else {
				rotateFace(faceIndex, transformations[face][trans]);
			}
		}
		
		return movedAtoms;
	};
	
	
	// Display all the movements in the cube
	//   from: starting positions (array of all atoms)
	//     to: new positions (array of all atoms)
	function showCube(showMoved) {
		var printed = false;
		for (var i = 0; i < initialAtoms.length; i++) {
			
			if ( !showMoved || !same ( initialAtoms[i], movedAtoms[i]) ) {
				console.log( "    " + atomName(initialAtoms[i]) + " -> " + atomName(movedAtoms[i]));
				printed = true;
			}
		}
		
		if ( ! printed ) {
			console.log("    NOP!");
		}
	};
	
	// convert atoms with numeric faces to user friendly string name
	// [0, 1, 2] => "FUR"
	function atomName ( atom ) {
		return reduce ( atom, "", 
			function (acc, face) {
			    return acc + faceNames[face];
			});
	};
	
	// Show only those atoms that moved
	function showMoved () {
		showCube(true);
	};
	
	//rotateFace ( movedAtoms, 0, c0);
	
	function applyAndShow ( moves ) {
		console.log(moves + " ==> ");
		
		applySequence(moves);
		showMoved();
	};
	
	this.resetCube = resetCube;
	this.applySequence = applySequence;
	this.showMoved = showMoved;
	this.applyAndShow = applyAndShow;
	
	this.runTest = function () {
		applyAndShow("FF'FFF2F'FF2FFFFF2"); resetCube();
		applyAndShow("BB'BBB2B'BB2BBBBB2"); resetCube();
		applyAndShow("RR'RRR2R'RR2RRRRR2"); resetCube();
		applyAndShow("LL'LLL2L'LL2LLLLL2"); resetCube();
		applyAndShow("UU'UUU2U'UU2UUUUU2"); resetCube();
		applyAndShow("DD'DDD2D'DD2DDDDD2"); resetCube();

		applyAndShow("HH'HHH2H'HH2HHHHH2"); resetCube();
		applyAndShow("VV'VVV2V'VV2VVVVV2"); resetCube();
		applyAndShow("SS'SSS2S'SS2SSSSS2"); resetCube();

		
		applyAndShow("RD'R'U2RDR'U2"); resetCube();
		applyAndShow("RD'R'U2RDR'U2  D'RDL2D'R'DL2"); resetCube();
		
		applyAndShow("V'F2VF2"); resetCube();
		
		applyAndShow("RFBU2F2U'FUFU2B'R'F'"); resetCube();


	};
	
	
	/************************ MOVE FINDER ALGO ***************/
	
	//findAMove(last_seq, )
};



