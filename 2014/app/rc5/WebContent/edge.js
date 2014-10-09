
Rubik.Edge = function (sideMiddle) 
{
	Rubik.Atom.call(this, sideMiddle);
};

Rubik.Edge.prototype = Object.create(Rubik.Atom.prototype);

//Object.defineProperties(
//		Rubik.Edge.prototype,
//		{
//			sidesCount : { value : 2, writable : false, enumerable : true, configurable : false }
//		}
//	);
//
////static method: create a new atom with the specified sides
////char [] sides
//Rubik.Edge.prototype.createNew = function(sides) {
//    return new Rubik.Edge(sides);
//};

//static method
//return all Edges 
Rubik.Edge.getBaseList = function () {
	var allEdges =  [
         new Rubik.Edge("rf"),
         new Rubik.Edge("rd"),
         new Rubik.Edge("ru"),
         new Rubik.Edge("rb"),
         
         new Rubik.Edge("lf"),
         new Rubik.Edge("ld"),
         new Rubik.Edge("lu"),
         new Rubik.Edge("lb"),
         
         new Rubik.Edge("fu"),
         new Rubik.Edge("ub"),
         new Rubik.Edge("bd"),
         new Rubik.Edge("df")
     ];

     // keep it sorted to start with
     //sort the colors/sides in each corner
//     for(var i = 0; i <  allEdges.length; i++) {
//    	 allEdges[i].sides.sort();    
//     }
	 return allEdges;                    
};
     
