//takes string s, dictionary c
//replaces anything in {} with its value in dictionary with the thing in {} as the key
var strformat = function(s, c) {
    return s.replace(/{(.+?)}/g, function(match, content) {
        return (content in c ? c[content] : match);
    });
};

