//arguments: string s, dictionary c
//returns formatted string where all occurences of 
//    {key} in s are replaced with the value of c[key]
//if key not in dictionary c, {key} is left as-is
var strformat = function(s, c) {
    return s.replace(/{(.+?)}/g, function(match, content) {
        return (content in c ? c[content] : match);
    });
};

//strformat(s,c) except with extra bonus <span> magic
//replacement format: 
//{STR} -> <span class="statspan" id="STR" title="">10</span>
//
//NO LONGER USED BECAUSE MARIONETTE IS A THING
var statformat = function(s, c) {
    return s.replace(/{(.+?)}/g, function(match, content) {
        if (!(content in c)) {
            return match;
        } else {
            var r = "";
            r += "<span class=\"statspan\" "+"id=\""+content+"\" title=\"\">";
            r += c[content];
            r += "</span>";
            return r;
        }
    });

}
