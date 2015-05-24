/*
  TODO LIST
  * merge all the checks into one function in ONE LOOP because otherwise it would just be gross
  * sort keys by length, longest first (so name overlap isn't a problem)
*/

var isNumber = function(string){
    return ("0123456789".indexOf(string) != -1 && string != "");
};

//#######################################
//## Replacing stat names with numbers ##
//#######################################

//Takes a string (stringOriginal) and puts stringToAdd at index, removing a certain amount (toRemove) of letters
var stringSplice = function(stringOriginal, index, toRemove, stringToAdd){
    tempString = stringOriginal.slice(0, index);
    tempString += stringToAdd;
    tempString += stringOriginal.slice(index+toRemove);
    return tempString;
}
//replaces the FIRST instance of statName with its value
var statSplice = function(stringOriginal, statName, stats){
    index = stringOriginal.indexOf(statName);
    toRemove = statName.length;
    stringToAdd = stats[statName] + " ";
    stringOriginal = stringSplice(stringOriginal, index, toRemove, stringToAdd);
    return stringOriginal;
}
//replaces ALL instances of statName with its value
var statSpliceAll = function(stringOriginal, statName, stats){
    while (stringOriginal.indexOf(statName) != -1){
	stringOriginal = statSplice(stringOriginal, statName);
    }
    return stringOriginal;
}
//replaces all instances of all statnames from dictionary stats with their values
//final form
var replaceStats = function(stringOriginal, stats){
    for (var key in stats){
	stringOriginal = statSpliceAll(stringOriginal, key);
    }
    return stringOriginal;
}


//#####################################
//## Checking that a string is valid ##
//#####################################

//Checking that a string is nothing but +, -, /, *, and numbers
var checkString = function(string){
    for (var i in string){
	if ("1234567890/+-*() ".indexOf(string[i]) == -1){
	    console.log("inval char: " + string[i]);
	    return false;
	}
    }
    return true;
}

//Checking parens are valid
var checkParens = function(string){
    parensCount = 0;
    for (var i in string){
	if (string[i] == "("){
	    parensCount++;
	}
	else if (string[i] == ")"){
	    parensCount--;
	}
	if (parensCount < 0){
	    console.log("mismatched parens");
	    return false;
	}
    }
    if (parensCount != 0){
	console.log("mismatched parens");
	return false;
    }
    return true;
}


//Checking if operations have a number or close parens before them
var checkOpBefore = function(string){
    var previous = "";
    var current = "";
    for (var i in string){
	current = string[i];
	if ("*+-/".indexOf(current) != -1){ //if current is an op
	    if (previous == ""){
		console.log("Operation at beginning");
		return false;
	    }
	    else if ("1234567890()".indexOf(previous) == -1){
		console.log("operation not preceeded by number");
		    return false;
	    }
	}
	if (current != " "){
	    previous = string[i];
	}
    }
    return true;
}

//Checking if operations have a number or open parens after them
var checkOpAfter = function(string){
    //if before is an operation, check that current is a number or open parens (ignoring all spaces)
    var previous = "";
    var current = "";
    for (var i in string){
	current = string[i];
	if ("*+-/".indexOf(previous) != -1){ //if previous is an op
	    if (" 0123456789(".indexOf(current) == -1){
		console.log("operation not followed by number");
		return false;
	    }
	}
	if (current != " "){
	    previous = string[i];
	}
    }
    if ("*+-/(".indexOf(previous) != -1 && previous != ""){ //if previous is still an operation (unresolved operation)
	console.log("|" + previous + "|" + current + "|");
	console.log("unresolved operation");
	return false;
    }
    console.log("returning true")
    return true;
}

//Checking operations both before and after
//final form
var checkOp = function(string){
    return (checkOpBefore(string) && checkOpAfter(string));
}


//Checking if numbers aren't followed by another number
var checkFollow = function(string){
    //if current is a number and previous is also a number and spaces have been done did then no
    var current = "";
    var previous = "";
    var space = false;
    for (var i in string){
	current = string[i];
	if (isNumber(previous) && space && isNumber(current)){
	    console.log("number followed by number")
	    return false;
	}
	if (isNumber(previous) && space && !isNumber(current)){
	    previous = current;
	    space = false;
	}
	if (!isNumber(previous) && space && isNumber(current)){
	    previous = current;
	    space = false;
	}
	if (current != " "){
	    previous = current;
	}
	else {
	    space = true;
	}
    }
    return true;
}

var check = function(string){
    return (checkString(string) && checkParens(string) && checkOp(string) && checkFollow(string));
}


//###########
//## Final ##
//###########

var convertCheck = function(string, stats){
    string = replaceStats(string, stats);
    if (check(string)) {
	return string;
    }
    else {
	return "Error: Formula Invalid";
    }
}

var evaluate = function(string, stats){
    string = convertCheck(string, stats);
    if (string != "Error: Formula Invalid"){
	return eval(string);
    }
    else{
	return "Error: Formula Invalid"
    }
}
