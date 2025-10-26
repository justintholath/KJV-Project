function hide_disp_tbl() {
    document.getElementById("disp_tbl").style.display = 'none';
};

function construct_kjv(kjvTable) {
    var kjvloop = kjvTable.length - 1
    var kjvstr = ""
    for (kjvi=0; kjvi < kjvloop; kjvi++) {
        kjvstr += kjvTable[kjvi] + ' ';
    };
    kjvstr += kjvTable[kjvloop];
    return kjvstr;
};

function construct_kjm(kjvTable, kjmTable) {
    var kjvElement = [], kjmElement = [];
    var kjvline = "", deltaline = "", deltaStrFrom = "", deltaStrTo = "";
    var kjvloop = kjvTable.length
    var kjmstr = ""
    var countOfChange = 0, fromLen = 0, toLen = 0, deltaline = 0, ix = 0;
    for (kjvi=0; kjvi < kjvloop; kjvi++) {
        kjvline = kjvTable[kjvi]
        deltaline = kjmTable[kjvi]
        countOfChange = parseInt(deltaline.substring(0,2))
        if  (countOfChange == 0) {
			kjmstr += kjvline + " ";
            continue
        };
        deltaStrFrom = deltaline.substring(2,2 + (countOfChange * 5))
        deltaStrTo = deltaline.substring(2 + (countOfChange * 5))
        currKjvOffset = 0

        for (ix=0; ix < countOfChange; ix++) {
            fromLen = parseInt(deltaStrFrom.substring(0,3));
            kjmstr += kjvline.substring(currKjvOffset,fromLen);
            toLen = 2 + parseInt(deltaStrTo.substring(0,2));
            kjmstr += deltaStrTo.substring(2,toLen);
            currKjvOffset = fromLen + parseInt(deltaStrFrom.substring(3,5));
            if (toLen == 2) {currKjvOffset += 1};
            deltaStrFrom = deltaStrFrom.substring(5)
            deltaStrTo = deltaStrTo.substring(toLen)
        };

        kjmstr += kjvline.substring(currKjvOffset) + " ";
    };
    return kjmstr;
};

function read_kjm(kjvTable, kjmTable) {
    var kjvElement = [], kjmElement = [];
    var kjvline = "", deltaline = "", deltaStrFrom = "", deltaStrTo = "";
    var kjvloop = kjvTable.length
    var kjmstr = ""
    var countOfChange = 0, fromLen = 0, toLen = 0, deltaline = 0, ix = 0;
    for (kjvi=0; kjvi < kjvloop; kjvi++) {
        kjvline = kjvTable[kjvi]
        deltaline = kjmTable[kjvi]
        countOfChange = parseInt(deltaline.substring(0,2))
        if  (countOfChange == 0) {
			kjmstr += kjvline + "<br>";
            continue
        };
        deltaStrFrom = deltaline.substring(2,2 + (countOfChange * 5))
        deltaStrTo = deltaline.substring(2 + (countOfChange * 5))
        currKjvOffset = 0

        for (ix=0; ix < countOfChange; ix++) {
            fromLen = parseInt(deltaStrFrom.substring(0,3));
            kjmstr += kjvline.substring(currKjvOffset,fromLen);
            toLen = 2 + parseInt(deltaStrTo.substring(0,2));
            kjmstr += deltaStrTo.substring(2,toLen);
            currKjvOffset = fromLen + parseInt(deltaStrFrom.substring(3,5));
            if (toLen == 2) {currKjvOffset += 1};
            deltaStrFrom = deltaStrFrom.substring(5)
            deltaStrTo = deltaStrTo.substring(toLen)
        };

        kjmstr += kjvline.substring(currKjvOffset) + "<br>";;
    };
    return kjmstr;
};

function construct_with_mark(kjvTable, kjmTable) {
    var kjvElement = [], kjmElement = [];
    var kjvline = "", deltaline = "", deltaStrFrom = "", deltaStrTo = "";
    var kjvloop = kjvTable.length
    var countOfChange = 0, fromLen = 0, toLen = 0, deltaline = 0, ix = 0;
    var replaceLen = 0;
    var kjmstr = "[KJM] "
    var kjvstr = '<font style="color:lightgrey"> [KJV] '
    for (kjvi=0; kjvi < kjvloop; kjvi++) {
        kjvline = kjvTable[kjvi]
        deltaline = kjmTable[kjvi]
        countOfChange = parseInt(deltaline.substring(0,2))
        if  (countOfChange == 0) {
            kjmstr += kjvline + " ";
            kjvstr += kjvline + " ";
            continue
        };
        deltaStrFrom = deltaline.substring(2,2 + (countOfChange * 5))
        deltaStrTo = deltaline.substring(2 + (countOfChange * 5))
        currKjvOffset = 0

        for (ix=0; ix < countOfChange; ix++) {
            fromLen = parseInt(deltaStrFrom.substring(0,3));
            kjmstr += kjvline.substring(currKjvOffset,fromLen);
            kjvstr += kjvline.substring(currKjvOffset,fromLen);
            toLen = 2 + parseInt(deltaStrTo.substring(0,2));
            kjmstr += "<markgreen>" + deltaStrTo.substring(2,toLen) + "</markgreen> ";
            replaceLen = fromLen + parseInt(deltaStrFrom.substring(3,5));
            kjvstr += "<markred>" + kjvline.substring(fromLen,replaceLen) + "</markred> ";
            currKjvOffset = replaceLen;
            if (toLen == 2) {currKjvOffset += 1};
            deltaStrFrom = deltaStrFrom.substring(5)
            deltaStrTo = deltaStrTo.substring(toLen)
        };

        kjmstr += kjvline.substring(currKjvOffset) + " ";
        kjvstr += kjvline.substring(currKjvOffset) + " ";
    };
    return kjmstr + '<br>' + kjvstr + '</font><br>';
};

function construct_strike_through(kjvTable, kjmTable) {
    var kjvElement = [], kjmElement = [];
    var kjvline = "", deltaline = "", deltaStrFrom = "", deltaStrTo = "";
    var kjvloop = kjvTable.length
    var kjmstr = "", finalstr = "";
    var countOfChange = 0, fromLen = 0, toLen = 0, deltaline = 0, ix = 0;
    var replaceLen = 0;
    for (kjvi=0; kjvi < kjvloop; kjvi++) {
        kjmstr = ""
        kjvline = kjvTable[kjvi]
        deltaline = kjmTable[kjvi]
        countOfChange = parseInt(deltaline.substring(0,2))
        if  (countOfChange == 0) {
            finalstr += kjvline + '<br>';
            continue
        };
        deltaStrFrom = deltaline.substring(2,2 + (countOfChange * 5))
        deltaStrTo = deltaline.substring(2 + (countOfChange * 5))
        currKjvOffset = 0

        for (ix=0; ix < countOfChange; ix++) {
            fromLen = parseInt(deltaStrFrom.substring(0,3));
            kjmstr += kjvline.substring(currKjvOffset,fromLen);
            toLen = 2 + parseInt(deltaStrTo.substring(0,2));
            kjmstr += "<markgreen>" + deltaStrTo.substring(2,toLen) + "</markgreen>";
            replaceLen = fromLen + parseInt(deltaStrFrom.substring(3,5));
            kjmstr += '<font style="color:lightgrey"><strike>';
            kjmstr += kjvline.substring(fromLen,replaceLen) + "</strike></font>";
            currKjvOffset = replaceLen;
            deltaStrFrom = deltaStrFrom.substring(5)
            deltaStrTo = deltaStrTo.substring(toLen)
        };

        kjmstr += kjvline.substring(currKjvOffset);
        finalstr += kjmstr + '<br>'
    };
    return finalstr;
};


