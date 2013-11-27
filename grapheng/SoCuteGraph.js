var SoCuteGraph = SoCuteGraph || {};


SoCuteGraph.nsCrete=function extend(nsString, extendsString) {

    if (!extendsString){
        extendsString=SoCuteGraph;
    }

    var parts = nsString.split('.'),
        parent = extendsString,
        pl, i;
    if (parts[0] == "SoCuteGraph") {
        parts = parts.slice(1);
    }
    pl = parts.length;
    for (i = 0; i < pl; i++) {
        if (typeof parent[parts[i]] == 'undefined') {
            parent[parts[i]] = {};
        }
        parent = parent[parts[i]];
    }
    return parent;
};


