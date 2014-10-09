// Side.js

// Represents each side of the cube
// Rubik.Side object has 6 properties representing six sides
// Properties:
//    char id; single character representation of the side like 'f' or 'd'
//    int   numId; values in 2s power ( 1,2,4,8,16,32,64,128 )
// Operation:
//     toString => returns a single char representation of the side
//     name    => returns the full name of the side like 'front' or 'down'
// Six sides are pre-created, so no need to create new Sides

// using a single function to create Rubik.Side classes
// Any function defined inside a function including constructor is local, so not known publicly


(function () {

	// Execute this code only once
	if ( typeof Rubik.Side != 'undefined' ) {
        return;
    }
    
    Rubik.Side = {};
    
    var count = 0;  // to generate the numeric IDs of each face like 2^^0, 2^^1, 2^^2, 2^^3

	// constructor that is not known publicly
    // String name : Full name of this side like 'front' or 'left'
	function side(name) {
      
      this.numId = 1 << count++;

      this.id = name.slice(0, 1);
 
      // methods declared like this get created one for each instance.. define in prototype to remove unnecessary copies
      
      this.toString = function() { return this.id; };

      this.name = function() { return name; };  // referring to local var/params.. method cannot go in prototype
      
      // have more redundant maps for easier search
      
      Rubik.Side[this.id] = this;
      
    }

	// Create only a limited set of Sides
    Rubik.Side.FRONT = new side('front');
    Rubik.Side.BACK  = new side('back');
    Rubik.Side.RIGHT = new side('right');
    Rubik.Side.LEFT  = new side('left');
    Rubik.Side.UP    = new side('up');
    Rubik.Side.DOWN  = new side('down');

    Object.defineProperty(Rubik.Side,
	    'ALL', 
	    {
	        value : [Rubik.Side.FRONT, Rubik.Side.BACK, Rubik.Side.RIGHT, Rubik.Side.LEFT, Rubik.Side.UP, Rubik.Side.DOWN], 
            writable : false,
            enumerable : false,  // enumeration is not allowed, rest all properties are enumerable
            configurable : false
	    }); 
 
    // Given a one letter id of the side return the Side object
    Rubik.Side.getSide = function(side) {
  		//for(var i=0; i < Rubik.Side.ALL.length; i++) {
  		//	if ( Rubik.Side.ALL[i].id == side ) {
  		//		return Rubik.Side.ALL[i];
  		//	}
  		//}
    	return Rubik.Side[side];
    };
    
    
    // Prevent any more Rubik.Side.xxx to be created
    // Prevent any property to be deleted
    Object.freeze(Rubik.Side);


}());