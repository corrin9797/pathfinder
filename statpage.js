console.log("whassup")

/*
  We're gonna receive 2 json blobs, minimum

  1) template (universal)
  2) personal stats (player tied)

  Things to do
  * equation parsing
  * take the template, put the personal stats in it and display
  * make the personal stats editable

  newStat(name, base?, mod? + other stuff)
*/

/*
  TODO LIST
  * if a number is followed immediately by a number
    * if a string is followed immediately by a number
      * replacing string with number followed by space to make sure they're separated
  * merge all the checks into one function in ONE LOOP because otherwise it would just be gross
*/

//TEST STATS
var stats={
    "STR":"9001",
    "DEX":"2390478"
}	

/*
#######################################
## Replacing stat names with numbers ##
#######################################
*/
//Takes a string (stringOriginal) and puts stringToAdd at index, removing a certain amount (toRemove) of letters
var stringSplice = function(stringOriginal, index, toRemove, stringToAdd){
    tempString = stringOriginal.slice(0, index);
    tempString += stringToAdd;
    tempString += stringOriginal.slice(index+toRemove);
    return tempString;
}
//replaces the FIRST instance of statName with its value
var statSplice = function(stringOriginal, statName){
    index = stringOriginal.indexOf(statName);
    toRemove = statName.length;
    stringToAdd = stats[statName] + " ";
    stringOriginal = stringSplice(stringOriginal, index, toRemove, stringToAdd)
    return stringOriginal;
}
//replaces ALL instances of statName with its value
var statSpliceAll = function(stringOriginal, statName){
    while (stringOriginal.indexOf(statName) != -1){
	stringOriginal = statSplice(stringOriginal, statName);
    }
    return stringOriginal;
}
//replaces all instances of all statnames from dictionary stats with their values
//final form
var replaceStats = function(stringOriginal){
    for (var key in stats){
	stringOriginal = statSpliceAll(stringOriginal, key);
    }
    return stringOriginal;
}

/*
#####################################
## Checking that a string is valid ##
#####################################
*/
//Checking that a string is nothing but +, -, /, *, and numbers
var checkString = function(string){
    for (var i in string){
	if ("1234567890+-*/() ".indexOf(string[i]) == -1){
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
	else if (string[i] = ")"){
	    parensCount--;
	}
	if (parensCount < 0){
	    return false;
	}
    }
    if (parensCount != 0){
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
	if ("+-*/".indexOf(current) != -1){ //if current is an op
	    if (previous == ""){
		return false;
	    }
	    else if ("1234567890()".indexOf(previous) == -1){
		return false;
	    }
	}
	if (current != " "){
	    previous = string[i];
	}
    }
}

//Checking if operations have a number or open parens after them
var checkOpAfter = function(string){
}

//Checking operations both before and after
//final form
var checkOp = function(string){
}

//Checking if numbers aren't followed by another number
var checkFollow = function(string){
}

var string = "STR STR DEX DEX DEX STR"

string = replaceStats(string);
console.log(string);
console.log(checkString(string));
