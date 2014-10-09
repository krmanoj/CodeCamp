// "Center" represents the center cubelet of every side.


// Input: String center i.e. "f"
Rubik.Center = function (center){
	
	Rubik.Atom.call(this, center);
};

Rubik.Center.prototype = Object.create(Rubik.Atom.prototype);

//Object.defineProperties(
//	Rubik.Center.prototype,
//	{
//		sidesCount : { value : 1, writable : false, enumerable : true, configurable : false }
//	}
//);

////static method: create a new atom with the specified sides
////char [] sides
//Rubik.Center.prototype.createNew = function(sides) {
//    return new Rubik.Center(sides);
//};


// static method
// return a new copy of all Centers 
Rubik.Center.getBaseList = function () {
	var allCenters = [
	  new Rubik.Center("r"),
	  new Rubik.Center("f"),
	  new Rubik.Center("u"),
	  new Rubik.Center("l"),
	  new Rubik.Center("b"),
	  new Rubik.Center("d")
	  ];
	return allCenters;
};
    
