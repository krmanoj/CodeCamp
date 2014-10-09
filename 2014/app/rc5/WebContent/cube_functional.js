/**
 * 
 */

// faces: 
//   0 -> front
//   1 -> up
//   2 -> right
//   3 -> back
//   4 -> down
//   5 -> left



cube_init= [
            // Corners
            [0,1,2], [0,1,5], [0,4,2], [0,4,5], [3,1,2], [3,1,5], [3,4,2], [3,4,5],
            
            // middles
            [0, 1], [0, 2], [0, 4], [0, 5],
            [3, 1], [3, 2], [3, 4], [3, 5],
            [1, 5], [1, 2], [4, 5], [4, 2],
            
            //centers
            [0], [1], [2], [3], [4], [5]
            ];

reset_cube = function () {
	
	// initial value is same as cube_init. Is there any easier way to make a deep copy?          
	cube_cur = [ [0,1,2], [0,1,5], [0,4,2], [0,4,5], [3,1,2], [3,1,5], [3,4,2], [3,4,5],
	             
	             [0, 1], [0, 2], [0, 4], [0, 5],
	             [3, 1], [3, 2], [3, 4], [3, 5],
	             [1, 5], [1, 2], [4, 5], [4, 2],
	             
	             [0], [1], [2], [3], [4], [5]
	          ];
};

reset_cube();


// take a transformation and repeat it
// so c0 (Face 0 clockwise) gives t0 (Face 0 twice clockwise)
function trans_forward (trans) {
	var new_trans = new Array(); 
	for (var i = 0; i < trans.length; i++) {
		new_trans[i] = trans[trans[i]];
	}
	return new_trans;
} 

//take a transformation and reverse it
//so c0 gives a0
function trans_backward (trans) {
	var new_trans = new Array(); 
	for (var i = 0; i < trans.length; i++) {
		new_trans[trans[i]] = i;
	}
	return new_trans;
} 

//take a transformation and reverse it
//so c0 gives a0
// no used and probably wrong
//function trans_mirror (trans) {
//	var new_trans = new Array(); 
//	for (var i = 0; i < trans.length; i++) {
//		new_trans[i] = (trans[i]+3) % 3;
//	}
//	return new_trans;
//} 

//face 0 clockwise,  index moves to c0[index]
c0 = [0, 2, 4, 3, 5, 1];    // 0th face clockwise
t0 = trans_forward(c0);     // 0th face 180 deg (twice) 
a0 = trans_backward(c0);    // 0th face anti clockwise

c3 = a0; //trans_mirror(a0);
t3 = trans_forward(c3);
a3 = trans_backward(c3);

c1 = [5, 1, 0, 2, 4, 3];
t1 = trans_forward(c1);
a1 = trans_backward(c1);

c4 = a1; //trans_mirror(a1);
t4 = trans_forward(c4);
a4 = trans_backward(c4);

c2 = [1, 3, 2, 4, 0, 5];
t2 = trans_forward(c2);
a2 = trans_backward(c2);

c5 = a2; //trans_mirror(a2);
t5 = trans_forward(c5);
a5 = trans_backward(c5);

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

index_of_face = {
    F : 0,
    U : 1,
    R : 2,
    B : 3,
    D : 4,
    L : 5
};

name_of_face = [ "F", "U", "R", "B", "D", "L"];

transformations = {
		
	// face/layer : [ transformation-for-clockwise, for-twice, for-anti-clockwise ]	
		
	"F" : [c0, t0, a0],
	"U" : [c1, t1, a1],
	"R" : [c2, t2, a2],
	"B" : [c3, t3, a3],
	"D" : [c4, t4, a4],
	"L" : [c5, t5, a5],
	
	"H" : [c4, t4, a4],   // same as D
	"V" : [c2, t2, a2],   // same as R
	"S" : [c0, t0, a0]    // same as F
};

outer_layer_of_slice = {
	"H" : [1, 4],  // Horizontal layer is in between Up (1) and Down (4) 
	"V" : [2, 5],
	"S" : [0, 3]
};


// Standard map function
// Apply function 'trans' to each member of array 'arr' and 
//   put all the transformed elements in the same array
//      (should we have gone by creating a new array?
map = function ( arr, trans) {
	for (var i = 0; i < arr.length; i++) {
		arr[i] = trans( arr[i]);
	}
	return arr;
};

reduce = function ( arr, acc, reducer ) {
	for (var i = 0; i < arr.length; i++) {
		acc = reducer( acc, arr[i]);
	}
	return acc;
};

// If the 'arr' array has specified element 'elem'
has = function (arr, elem) {
	for (var i = 0; i < arr.length; i++) {
		if ( arr[i] === elem ) return true;
	}
	return false;
};

// if two atoms are same in position and orientation
// basically all the numerical elements are same in both arrays
same = function (atom1, atom2) {
	for (var i = 0; i < atom1.length; i++) {
		if ( atom1[i] !== atom2[i] ) return false;
	}
	return true;
};


// works on cube_cur, array of all atoms (atom is an array of all faces represented by numbers)
// face which face is being rotated
// face_trans rule of transformation
//    face_trans is the array that gives how a face is moving
//          in face represented by 'index' moves to face_trans[index]
rotate_a_face = function ( face, face_trans ) {
    return map ( cube_cur,
        function( atom ) {  // function that is applied for each atom
    	    // check if this atom is affected
            if ( has (atom, face )) 
            	return map ( atom,  
            		function ( side ) {  // function that is applied to each face of one atom
    	    	    	return face_trans[side];
    	    		}
    	        );
            else
            	return atom;
	    }
    );
};

// Rotate the slice identified by its outer and inner layer
// slice_trans is the transformation array
// works on cube_cur
rotate_a_slice = function ( outer_layer1, outer_layer2, slice_trans ) {
    return map ( cube_cur,
            function( atom ) {  // function that is applied for each atom
        	    // check if this atom is affected, corners never get affected by slice movement
                if ( atom.length < 3 && !has (atom, outer_layer1 ) && !has (atom, outer_layer2 )) 
                	return map ( atom,  
                		function ( side ) {  // function that is applied to each face of one atom
        	    	    	return slice_trans[side];
        	    		}
        	        );
                else
                	return atom;
    	    }
        );
};


// apply sequence of moves
//   works on cube_cur, that is an array of all atoms in the current position
//   moves = string of all moves like LR2B'   etc..
apply_sequence = function (moves) {
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
			index++
		}

		var face_index = index_of_face[face];
		
		if ( face_index == undefined ) {
			// try layer
			var outer_layers = outer_layer_of_slice[face];
			
			if ( outer_layers == undefined ) {
			
				throw "Face '" + face + "' is not valid at index " + index +
				" in sequence '" + moves + "'";
			}
			rotate_a_slice( outer_layers[0], outer_layers[1], transformations[face][trans]);
		} else {
			rotate_a_face(face_index, transformations[face][trans]);
		}
	}
	
	return cube_cur;
};


// Display all the movements in the cube
//   from: starting positions (array of all atoms)
//     to: new positions (array of all atoms)
show_cube = function (show_moved) {
	var printed = false;
	for (var i = 0; i < cube_init.length; i++) {
		
		if ( !show_moved || !same ( cube_init[i], cube_cur[i]) ) {
			console.log( atom_name(cube_init[i]) + " -> " + atom_name(cube_cur[i]));
			printed = true;
		}
	}
	
	if ( ! printed ) {
		console.log("Back to original state!");
	}
};

// convert atoms with numeric faces to user friendly string name
// [0, 1, 2] => "FUR"
atom_name = function ( atom ) {
	return reduce ( atom, "", 
		function (acc, face) {
		    return acc + name_of_face[face];
		});
};

// Show only those atoms that moved
show_moved = function () {
	show_cube(true);
};

//rotate_a_face ( cube_cur, 0, c0);

apply_and_show = function ( moves ) {
	console.log(moves + " -> ");
	
	apply_sequence(moves);
	show_moved();
};

test_base = function () {
	apply_and_show("FF'FFF2F'FF2FFFFF2"); reset_cube();
	apply_and_show("BB'BBB2B'BB2BBBBB2"); reset_cube();
	apply_and_show("RR'RRR2R'RR2RRRRR2"); reset_cube();
	apply_and_show("LL'LLL2L'LL2LLLLL2"); reset_cube();
	apply_and_show("UU'UUU2U'UU2UUUUU2"); reset_cube();
	apply_and_show("DD'DDD2D'DD2DDDDD2"); reset_cube();

	apply_and_show("HH'HHH2H'HH2HHHHH2"); reset_cube();
	apply_and_show("VV'VVV2V'VV2VVVVV2"); reset_cube();
	apply_and_show("SS'SSS2S'SS2SSSSS2"); reset_cube();

	
	apply_and_show("RD'R'U2RDR'U2"); reset_cube();
	apply_and_show("RD'R'U2RDR'U2  D'RDL2D'R'DL2"); reset_cube();
	
	apply_and_show("V'F2VF2"); reset_cube();
	
	apply_and_show("RFBU2F2U'FUFU2B'R'F'"); reset_cube();


};

/************************ MOVE FINDER ALGO ***************/

//find_a_move(last_seq, )




