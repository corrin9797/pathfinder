var strformat = function(s, c) {
    return s.replace(/{(.+?)}/g, function(match, content) {
        return (content in c ? c[content] : match);
    });
};
