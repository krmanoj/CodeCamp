Rubik.RCException = function(type, message) {
    this.type = type;
    this.message = message;
};

Rubik.RCException.prototype.toString = function() {
	return "Exception: " + this.type + " - " + this.message;
};