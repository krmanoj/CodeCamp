(function() {
	
	module = "side.js";
	
	var count = Object.keys(Rubik.Side).length;
	assert( count == 6, "Number of proeprties in Rubik.Side is '" + count + "'");
	
	var old = Rubik.Side.FRONT;
	Rubik.Side.FRONT = "junk";
	assert( old === Rubik.Side.FRONT, "Rubik.Side.FRONT is not writable");
	
	Rubik.Side.FRONT.newProp = 5;
	assert( Rubik.Side.FRONT.newProp === 5, "Rubik.Side.FRONT supports new properties" );
	delete Rubik.Side.FRONT.newProp;
	
	Rubik.Side.NEW_PROP = "SHOULD NOT WORK";
	assert( typeof Rubik.Side.NEW_PROP == 'undefined', "Cannot add new properties to Rubik.Side");
	
	var all = Rubik.Side.ALL.toString();
	assert( all == "f,b,r,l,u,d", "Rubik.Side.ALL is '" + all + "'");
	
	assert ( Rubik.Side.FRONT.id === 'f', "Rubik.Side.FRONT.id is '" + Rubik.Side.FRONT.id + "'");
	assert ( Rubik.Side.BACK.id  === 'b', "Rubik.Side.BACK.id is '"  + Rubik.Side.BACK.id + "'");
	assert ( Rubik.Side.LEFT.id  === 'l', "Rubik.Side.LEFT.id is '"  + Rubik.Side.LEFT.id + "'");
	assert ( Rubik.Side.RIGHT.id === 'r', "Rubik.Side.RIGHT.id is '" + Rubik.Side.RIGHT.id + "'");
	assert ( Rubik.Side.UP.id    === 'u', "Rubik.Side.UP.id is '"    + Rubik.Side.UP.id + "'");
	assert ( Rubik.Side.DOWN.id  === 'd', "Rubik.Side.DOWN.id is '"  + Rubik.Side.DOWN.id + "'");
	
}());
