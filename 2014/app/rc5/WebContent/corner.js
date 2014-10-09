// Rubik.Corner represents one corner cubelet
// Uses Rubik.Atom as base Object

// String corner i.e. "fru"
Rubik.Corner = function (corner){
	Rubik.Atom.call(this, corner);
};

Rubik.Corner.prototype = Object.create(Rubik.Atom.prototype);


//Object.defineProperties(
//		Rubik.Corner.prototype,
//		{
//			sidesCount : { value : 3, writable : false, enumerable : true, configurable : false }
//		}
//	);
//
//// static method: create a new atom with the specified sides
//// char [] sides
//Rubik.Corner.prototype.createNew = function(sides) {
//    return new Rubik.Corner(sides);
//};

// static method (trying to mimic static method of java, but this style does not work for instances of Rubik.Corner)
// If we add it in Rubik.Corner.prototype then it does not work for Rubik.Corner
// could be added to both (but do we really need that?)

// return a new copy of all Corners 
Rubik.Corner.getBaseList = function () {
	
	var allCorners = [
	  new Rubik.Corner("rfu"),
	  new Rubik.Corner("rfd"),
	  new Rubik.Corner("lfu"),
	  new Rubik.Corner("lfd"),
	  new Rubik.Corner("rbu"),
	  new Rubik.Corner("rbd"),
	  new Rubik.Corner("lbu"),
	  new Rubik.Corner("lbd")
	  ];

//      // sort the colors/sides in each corner
//      for(var i = 0; i <  allCorners.length; i++) {
//    	  allCorners[i].sides.sort();    
//      }

	return allCorners;
};
    
