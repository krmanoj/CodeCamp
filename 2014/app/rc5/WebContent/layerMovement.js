// Represent SLICE types on the cube

Object.defineProperty(Rubik,
		    'LayerMovement', 
		    {
		    	value : {}, 
	            writable : false,
	            enumerable : true,
	            configurable : false
		    }); 
 
Rubik.LayerMovement.OUTER = "outer";
Rubik.LayerMovement.INNER = "inner";
Rubik.LayerMovement.ALL   = "all";

Object.freeze(Rubik.LayerMovement);