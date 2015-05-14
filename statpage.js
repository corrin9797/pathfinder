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
  * parens checking
  * if there's nothing after an operation?


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
    return tempString    
}

var statSplice = function(stringOriginal, statName){
    index = stringOriginal.indexOf(statName);
    toRemove = statName.length;
    stringToAdd = stats[statName];
    stringOriginal = stringSplice(stringOriginal, index, toRemove, stringToAdd)
    return stringOriginal;
}

var statSpliceAll = function(stringOriginal, statName){
    while (stringOriginal.indexOf(statName) != -1){
	stringOriginal = statSplice(stringOriginal, statName);
    }
    return stringOriginal;
}

var replaceStats = function(stringOriginal){
    for (var key in stats){
	stringOriginal = statSpliceAll(stringOriginal, key);
    }
    return stringOriginal;
}

//Checking that a string is nothing but +, -, /, *, and numbers
var checkString = function(string){
    for (i in string){
	if ("1234567890+-*/() ".indexOf(string[i]) == -1){
	    console.log("inval char: " + string[i]);
	    return false;
	}
    }
    return true;
}

var string = "STR STR DEX DEX DEX STR"

string = replaceStats(string);
console.log(string);
console.log(checkString(string));
