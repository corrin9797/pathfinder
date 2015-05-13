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

var stats={
	"STR":"9001",
	"DEX":"2390478"
}	

/*
var check=function(string){
	for stat in stats{
		//if stats in string, replace all instances of stat with number
		while (string.indexOf(stat)!=-1){
			string=string.slice(0,string.indexOf(stat)
		}
	}
}
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
    stringToAdd = stat[statName];
    stringOriginal = stringSplice(stringOriginal, index, toRemove, stringToAdd)
    return stringOriginal
}

var statSpliceAll = function(stringOriginal, statName){
    while (stringOriginal.indexOf(statName) != -1){
	statSplice(stringOriginal, statName);
    }
}



