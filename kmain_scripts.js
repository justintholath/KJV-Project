function chapter_resume() {
	var tempString = var_coordinates;
	if  (tempString != null && tempString.length == 6) {
	    var x_b_no = parseInt(tempString.substring(1,3),10)
		var x_c_no = parseInt(tempString.substring(3,6),10);
		chapter_open(x_b_no, x_c_no);
    }
    else {
       chapter_open(1, 1);
    };
}

function book_open(x_b_no){
    chapter_open(x_b_no, 1)
}

function chapter_open(x_b_no, x_c_no) {
    var maxchap = chapter_max(x_b_no);
    if  (x_c_no > maxchap) {x_c_no = maxchap};
    if (x_c_no == 0) {x_c_no = 1};
    var maxverse = verse_max(x_b_no, x_c_no);
    build_hdr(x_b_no, x_c_no, maxchap, maxverse);
    fetch_All(x_b_no, x_c_no, maxverse);
    gotop();
};

function build_hdr(book_no, chap_no, maxchap, maxverse) {
	var book_name = fetch_name(book_no);
	var nextchap = chap_no + 1;
	var prevchap = chap_no - 1;
    var x = '<table><tr>';
    x += ' <td class="s20" onclick="AllBooks(' + book_no + ')">' + book_name + '</td>';
    x += ' <td class="s20" onclick="chapter_tbl(' + book_no + ',' + maxchap + ')">' + chap_no + '</td>';
    x += ' <td class="s20" onclick="display_menu(' + book_no + ',' + chap_no + ')">More</td>';
    if (chap_no == 1) {
		x += ' <td class="v20"></td>';
	}
	else {
        x += ' <td class="s20" onclick="chapter_open(' + book_no + ',' + prevchap + ')">Prev</td>';
    };
    if  (chap_no == maxchap) {
        x += ' <td class="v20"></td>';
    }
    else {
        x += ' <td class="s20" onclick="chapter_open(' + book_no + ',' + nextchap + ')">Next</td>';
    };
    x += '</tr></table>';
    document.getElementById("hdr_tbl").innerHTML = x;
    document.getElementById("hdr_tbl").style.display = 'block';
};

function display_menu(book_no, chap_no) {
	var x = '<table><tr>';
    x += '<td class="s20" onclick="Navigate(' + "'r'" + ',' + book_no + ',' + chap_no + ')">Read</td>';
    x += '<td class="s20" onclick="Navigate(' + "'k'" + ',' + book_no + ',' + chap_no + ')">KJV</td>'
    x += '<td class="s20" onclick="Navigate(' + "'d'" + ',' + book_no + ',' + chap_no + ')">Delta</td>'
    x += '<td class="s20" onclick="Navigate(' + "'c'" + ',' + book_no + ',' + chap_no + ')">Compare</td>';
    x += '<td class="s20" onclick="ClosePop()">Close</td>';
    x += '</tr></table>';
/*    alert(x); */
    txt_modal.innerHTML = x;
    modal.style.display = "block";
};

function Navigate(in_val, book_no, chap_no) {
    var_coordinates = in_val + var_coordinates.substring(1,6)
    chapter_open(book_no, chap_no)
    ClosePop()
}

function fetch_All(x_b_no, x_c_no, maxverse) {
    var i, rvwVtitle;
    var kjvTable = kjv_fetch(x_b_no, x_c_no, 0);
    var kjmTable = kjm_fetch(x_b_no, x_c_no, 0);
    var read_M = var_coordinates.substring(0,1)
    var sub_verse_count = 0;
    var delta_flag = 0;
    
    var x = '<p><h4>' + fetch_name(x_b_no) + " " + x_c_no + '</h4>';
    for (i=1; i<= maxverse; i++) {
        sub_verse_count = (kjmTable[i - 1]).length
        delta_flag = 0;
        for (j = 0; j < sub_verse_count; j++) {
            if (kjmTable[i - 1][j] != "00") {
                delta_flag = 1;
            };
        };
        if (delta_flag == 0) {
            x += '<span style="color:saddlebrown;"><u>' + "Verse " + i.toString() + '</u></span><br>'
        } else {
            clickstr = ' onclick="displaytext2(' + x_b_no + ',' + x_c_no + ',' + i + ',' + maxverse + ')"'
            clickid  = '<a id="V' + i + '"></a>'
            x += clickid + '<span style="color:blue;cursor: pointer;"' + clickstr + '><u>' + "Verse " + i.toString() + '</u></span><br>'
        };
        switch(read_M) {
        case "k":
            x += '<font style="color:red">' + construct_kjv(kjvTable[i - 1]) + '</font><br>';
            break;
        case "d":
            x += construct_strike_through(kjvTable[i - 1], kjmTable[i - 1]);
            break;
        case "c":
            x += construct_with_mark(kjvTable[i - 1], kjmTable[i - 1]);
            break;
        case "r":
        default:
            x += read_kjm(kjvTable[i - 1], kjmTable[i - 1]);
        };
    };
    x += "<br><br><br><br><br></p>"
    document.getElementById("disp_txt").innerHTML = x;
    document.getElementById("disp_txt").style.display = 'block';
    hide_disp_tbl();
    var_coordinates = read_M + (100 + x_b_no).toString().substring(1) + (1000 + x_c_no).toString().substring(1)
	if(lsTest()) {localStorage.setItem("okjm_v3_coordinates",var_coordinates);};
};

function displaytext2(bno, cno, vno, maxverse) {
	var prevno = vno - 1;
	var nextno = vno + 1;
	var x = '<table><tr>';
    x += ' <td class="s25" onclick="ClosePop()">Close</td>';
    if (vno == 1) {
		x += ' <td class="v25"></td>';
	}
	else {
        x += ' <td class="s25" onclick="displaytext2(' + bno + ',' + cno + ',' + prevno + ',' + maxverse + ')">Prev</td>';
    };
    if  (vno == maxverse) {
        x += ' <td class="v25"></td>';
    }
    else {
        x += ' <td class="s25" onclick="displaytext2(' + bno + ',' + cno + ',' + nextno + ',' + maxverse + ')">Next</td>';
    };
    x += '</tr></table>';
    var kjm_vrs = kjm_fetch(bno, cno, vno)
    var kjv_vrs = kjv_fetch(bno, cno, vno)
    x += '<p>' + fetch_name(bno) + ' ' + cno + ':' + vno + '<br><br>';
    x += construct_with_mark(kjv_vrs, kjm_vrs)
    x += '<br><br>'
    x += '</p>';
/*    alert(x); */
    txt_modal.innerHTML = x;
    modal.style.display = "block";
};

function ClosePop() {
	modal.style.display = "none";
};

function gotop() {
    window.location.href = ("#Top");
};

function goto_verse(v_no) {
    var verseloc = "#V" + v_no
    document.getElementById("disp_tbl").style.display = 'none';
    window.location.href = (verseloc);
};

function chapter_tbl(book_no, maxchap) {
    var nbr_cols = 10
    var disp_class_no = "10"
    if (book_no == 27 && (window.innerWidth <= 768)) {nbr_cols = 7; disp_class_no = "14"}
    var last_col = maxchap % nbr_cols;
    var row_loop = (maxchap - last_col) / nbr_cols;
    var x = '<br><br><table>';
    x += '<th style="color:blue;"  colspan="' + nbr_cols + '"><b>' + fetch_name(book_no) + ' - Chapters</b></th>'
    var i, j, k;
    for (i=0; i< row_loop; i++) {
        x += '<tr>';
        for (j=1; j<= nbr_cols; j++) {
            k = i * nbr_cols + j;
            x += ' <td class="s' + disp_class_no + '" onclick="chapter_open(' + book_no + ',' + k + ')">' + k + '</td>';
        }
        x += '</tr>';
    }
    if (last_col > 0) {
        x += '<tr>';
        for (j=1; j<= nbr_cols; j++) {
            if (j<= last_col) {
                k = row_loop * nbr_cols + j;
                chapter_key = book_no * 1000 + k;
                x += ' <td class="s' + disp_class_no + '" onclick="chapter_open(' + book_no + ',' + k + ')">' + k + '</td>';
            }
            else {
                x += ' <td class="w' + disp_class_no + '"></td>';
            };
        }
        x += '</tr>';
    }
    x += '</table>'
    x += '<table><tr>';
    x += '<td class="w80"></td>';
    x += '<td class="g20" onclick="hide_disp_tbl()"><b>Close Table</b></td>'
    x += '</tr>';
    x += '</table>'
    document.getElementById("disp_tbl").innerHTML = x;
    document.getElementById("disp_tbl").style.display = 'block';
    window.location.href = ("#Top");
}

function verse_tbl(maxverse) {
    var nbr_cols = 10
    var disp_class_no = "10"
    if (maxverse > 99 && (window.innerWidth <= 768)) {nbr_cols = 7; disp_class_no = "14"}

    var last_col = maxverse % nbr_cols;
    var row_loop = (maxverse - last_col) / nbr_cols;
    var x = '<br><br><table><th style="color:blue;" colspan="' + nbr_cols + '"> Choose verse</th>';
    var i, j, k;
    for (i=0; i< row_loop; i++) {
        x += '<tr>';
        for (j=1; j<= nbr_cols; j++) {
            k = i * nbr_cols + j;
            x += ' <td class="o' + disp_class_no + '" onclick="goto_verse(' + k + ')">' + k + '</td>';
        }
        x += '</tr>';
    }
    if (last_col > 0) {
        x += '<tr>';
        for (j=1; j<= last_col; j++) {
            k = row_loop * nbr_cols + j;
            x += ' <td class="o' + disp_class_no + '" onclick="goto_verse(' + k + ')">' + k + '</td>';
        }
        x += '</tr>';
    }
    x += '</table>'
    x += '<table><tr>';
    x += '<td class="w80"></td>';
    x += '<td class="g20" onclick="hide_disp_tbl()"><b>Close Table</b></td>'
    x += '</tr>';
    x += '</table>'
    document.getElementById("disp_tbl").innerHTML = x;
    document.getElementById("disp_tbl").style.display = 'block';
    window.location.href = ("#Top");
}

function goto_verse(v_no) {
    verseloc = "#V" + v_no
    document.getElementById("disp_tbl").style.display = 'none';
    document.getElementById("srch_results").style.display = 'none';
    window.location.href = (verseloc);
};

function AllBooks(book_no) {
    var x = '<br><br>'
    if (book_no < 39) {
        x += '<table><tr>'
        x += ' <td class="v50">Old</td>'
        x += ' <td class="o50" onclick="AllBooks(40)">New</td>'
        x += '</tr></table><br>'
        if (window.innerWidth <= 768) {
            x += shortlist_ot()
        } else {
            x += fulllist_ot()
        };
    } else {
        x += '<table><tr>'
        x += ' <td class="o50" onclick="AllBooks(1)">Old</td>'
        x += ' <td class="v50">New</td>'
        x += '</tr></table><br>'
        if (window.innerWidth <= 768) {
           x += shortlist_nt()
        } else {
           x += booklist_nt()
        };
    };
    document.getElementById("disp_tbl").innerHTML = x;
    document.getElementById("disp_tbl").style.display = 'block';
    window.location.href = ("#Top");
};

function fulllist_ot() {
    var x = '<table><tr>'
    x += ' <td class="s20" onclick="book_open(1)">Genesis</td>'
    x += ' <td class="s20" onclick="book_open(2)">Exodus</td>'
    x += ' <td class="s20" onclick="book_open(3)">Leviticus</td>'
    x += ' <td class="s20" onclick="book_open(4)">Numbers</td>'
    x += ' <td class="s20" onclick="book_open(5)">Deuteronomy</td>'
    x += '</tr>'
    x += '<tr>'
    x += ' <td class="s20" onclick="book_open(6)">Joshua</td>'
    x += ' <td class="s20" onclick="book_open(7)">Judges</td>'
    x += ' <td class="s20" onclick="book_open(31)">Ruth</td>'
    x += ' <td class="s20" onclick="book_open(8)">1 Samuel</td>'
    x += ' <td class="s20" onclick="book_open(9)">2 Samuel</td>'
    x += '</tr>'
    x += '<tr>'
    x += ' <td class="s20" onclick="book_open(10)">1 Kings</td>'
    x += ' <td class="s20" onclick="book_open(11)">2 Kings</td>'
    x += '</tr>'
    x += '<tr>'
    x += ' <td class="s20" onclick="book_open(38)">1 Chronicles</td>'
    x += ' <td class="s20" onclick="book_open(39)">2 Chronicles</td>'
    x += ' <td class="s20" onclick="book_open(36)">Ezra</td>'
    x += ' <td class="s20" onclick="book_open(37)">Nehemiah</td>'
    x += ' <td class="s20" onclick="book_open(34)">Esther</td>'
    x += '</tr>'
    x += '<tr>'
    x += ' <td class="s20" onclick="book_open(29)">Job</td>'
    x += ' <td class="s20" onclick="book_open(27)">Psalms</td>'
    x += ' <td class="s20" onclick="book_open(28)">Proverbs</td>'
    x += ' <td class="s20" onclick="book_open(33)">Ecclesiastes</td>'
    x += ' <td class="s20" onclick="book_open(30)">SongofSongs</td>'
    x += '</tr>'
    x += '<tr>'
    x += ' <td class="s20" onclick="book_open(12)">Isaiah</td>'
    x += ' <td class="s20" onclick="book_open(13)">Jeremiah</td>'
    x += ' <td class="s20" onclick="book_open(14)">Ezekiel</td>'
    x += ' <td class="s20" onclick="book_open(32)">Lamentations</td>'
    x += ' <td class="s20" onclick="book_open(35)">Daniel</td>'
    x += '</tr>'
    x += '<tr>'
    x += ' <td class="s20" onclick="book_open(15)">Hosea</td>'
    x += ' <td class="s20" onclick="book_open(16)">Joel</td>'
    x += ' <td class="s20" onclick="book_open(17)">Amos</td>'
    x += ' <td class="s20" onclick="book_open(18)">Obadiah</td>'
    x += ' <td class="s20" onclick="book_open(19)">Jonah</td>'
    x += '</tr>'
    x += '<tr>'
    x += ' <td class="s20" onclick="book_open(20)">Micah</td>'
    x += ' <td class="s20" onclick="book_open(21)">Nahum</td>'
    x += ' <td class="s20" onclick="book_open(22)">Habakkuk</td>'
    x += ' <td class="s20" onclick="book_open(23)">Zephaniah</td>'
    x += ' <td class="s20" onclick="book_open(24)">Haggai</td>'
    x += '</tr>'
    x += '<tr>'
    x += ' <td class="s20" onclick="book_open(25)">Zechariah</td>'
    x += ' <td class="s20" onclick="book_open(26)">Malachi</td>'
    x += '<td class="w20"></td>';
    x += '<td class="g40" colspan="4" onclick="hide_disp_tbl()"><b>Close</b></td>'
    x += '</tr>';
    x += '</table>'
    return x;
};

function shortlist_ot() {
    var x = '<table><tr>'
    x += ' <td class="s20" onclick="book_open(1)">Gen</td>'
    x += ' <td class="s20" onclick="book_open(2)">Exo</td>'
    x += ' <td class="s20" onclick="book_open(3)">Lev</td>'
    x += ' <td class="s20" onclick="book_open(4)">Num</td>'
    x += ' <td class="s20" onclick="book_open(5)">Deu</td>'
    x += '</tr>'
    x += '<tr>'
    x += ' <td class="s20" onclick="book_open(6)">Jos</td>'
    x += ' <td class="s20" onclick="book_open(7)">Jdg</td>'
    x += ' <td class="s20" onclick="book_open(31)">Rut</td>'
    x += ' <td class="s20" onclick="book_open(8)">1Sa</td>'
    x += ' <td class="s20" onclick="book_open(9)">2Sa</td>'
    x += '</tr>'
    x += '<tr>'
    x += ' <td class="s20" onclick="book_open(10)">1Ki</td>'
    x += ' <td class="s20" onclick="book_open(11)">2Ki</td>'
    x += '</tr>'
    x += '<tr>'
    x += ' <td class="s20" onclick="book_open(38)">1Ch</td>'
    x += ' <td class="s20" onclick="book_open(39)">2Ch</td>'
    x += ' <td class="s20" onclick="book_open(36)">Ezr</td>'
    x += ' <td class="s20" onclick="book_open(37)">Neh</td>'
    x += ' <td class="s20" onclick="book_open(34)">Est</td>'
    x += '</tr>'
    x += '<tr>'
    x += ' <td class="s20" onclick="book_open(29)">Job</td>'
    x += ' <td class="s20" onclick="book_open(27)">Psa</td>'
    x += ' <td class="s20" onclick="book_open(28)">Pro</td>'
    x += ' <td class="s20" onclick="book_open(33)">Ecc</td>'
    x += ' <td class="s20" onclick="book_open(30)">Son</td>'
    x += '</tr>'
    x += '<tr>'
    x += ' <td class="s20" onclick="book_open(12)">Isa</td>'
    x += ' <td class="s20" onclick="book_open(13)">Jer</td>'
    x += ' <td class="s20" onclick="book_open(14)">Eze</td>'
    x += ' <td class="s20" onclick="book_open(32)">Lam</td>'
    x += ' <td class="s20" onclick="book_open(35)">Dan</td>'
    x += '</tr>'
    x += '<tr>'
    x += ' <td class="s20" onclick="book_open(15)">Hos</td>'
    x += ' <td class="s20" onclick="book_open(16)">Joe</td>'
    x += ' <td class="s20" onclick="book_open(17)">Amo</td>'
    x += ' <td class="s20" onclick="book_open(18)">Oba</td>'
    x += ' <td class="s20" onclick="book_open(19)">Jon</td>'
    x += '</tr>'
    x += '<tr>'
    x += ' <td class="s20" onclick="book_open(20)">Mic</td>'
    x += ' <td class="s20" onclick="book_open(21)">Nah</td>'
    x += ' <td class="s20" onclick="book_open(22)">Hab</td>'
    x += ' <td class="s20" onclick="book_open(23)">Zep</td>'
    x += ' <td class="s20" onclick="book_open(24)">Hag</td>'
    x += '</tr>'
    x += '<tr>'
    x += ' <td class="s20" onclick="book_open(25)">Zec</td>'
    x += ' <td class="s20" onclick="book_open(26)">Mal</td>'
    x += '<td class="w20"></td>';
    x += '<td class="g40" colspan="4" onclick="hide_disp_tbl()"><b>Close</b></td>'
    x += '</tr></table><br>'
    return x;
};


function booklist_nt() {
    var x = '<table><tr>'
    x += ' <td class="s20" onclick="book_open(40)">Matthew</td>'
    x += ' <td class="s20" onclick="book_open(41)">Mark</td>'
    x += ' <td class="s20" onclick="book_open(42)">Luke</td>'
    x += ' <td class="s20" onclick="book_open(43)">John</td>'
    x += ' <td class="s20" onclick="book_open(44)">Acts</td>'
    x += '</tr></table><br>'
    x += '<table><tr>'
    x += ' <td class="s20" onclick="book_open(45)">Romans</td>'
    x += ' <td class="s20" onclick="book_open(46)">1 Corinthians</td>'
    x += ' <td class="s20" onclick="book_open(47)">2 Corinthians</td>'
    x += ' <td class="s20" onclick="book_open(48)">Galatians</td>'
    x += ' <td class="s20" onclick="book_open(49)">Ephesians</td>'
    x += '</tr>'
    x += '<tr>'
    x += ' <td class="s20" onclick="book_open(50)">Philippians</td>'
    x += ' <td class="s20" onclick="book_open(51)">Colossians</td>'
    x += ' <td class="s20" onclick="book_open(52)">1 Thessalonians</td>'
    x += ' <td class="s20" onclick="book_open(53)">2 Thessalonians</td>'
    x += '</tr>'
    x += '<tr>'
    x += ' <td class="s20" onclick="book_open(54)">1 Timothy</td>'
    x += ' <td class="s20" onclick="book_open(55)">2 Timothy</td>'
    x += ' <td class="s20" onclick="book_open(56)">Titus</td>'
    x += ' <td class="s20" onclick="book_open(57)">Philemon</td>'
    x += ' <td class="s20" onclick="book_open(58)">Hebrews</td>'
    x += '</tr></table><br>'
    x += '<table><tr>'
    x += ' <td class="s20" onclick="book_open(59)">James</td>'
    x += ' <td class="s20" onclick="book_open(60)">1 Peter</td>'
    x += ' <td class="s20" onclick="book_open(61)">2 Peter</td>'
    x += ' <td class="s20" onclick="book_open(62)">1 John</td>'
    x += ' <td class="s20" onclick="book_open(63)">2 John</td>'
    x += '</tr>'
    x += '<tr>'
    x += ' <td class="s20" onclick="book_open(64)">3 John</td>'
    x += ' <td class="s20" onclick="book_open(65)">Jude</td>'
    x += ' <td class="s20" onclick="book_open(66)">Revelation</td>'
    x += '<td class="g40" colspan="4" onclick="hide_disp_tbl()"><b>Close</b></td>'
    x += '</tr></table><br>'
    return x;
};

function shortlist_nt() {
    var x = '<table><tr>'
    x += ' <td class="s20" onclick="book_open(40)">Mat</td>'
    x += ' <td class="s20" onclick="book_open(41)">Mar</td>'
    x += ' <td class="s20" onclick="book_open(42)">Luk</td>'
    x += ' <td class="s20" onclick="book_open(43)">Joh</td>'
    x += ' <td class="s20" onclick="book_open(44)">Act</td>'
    x += '</tr></table><br>'
    x += '<table><tr>'
    x += ' <td class="s20" onclick="book_open(45)">Rom</td>'
    x += ' <td class="s20" onclick="book_open(46)">1Co</td>'
    x += ' <td class="s20" onclick="book_open(47)">2Co</td>'
    x += ' <td class="s20" onclick="book_open(48)">Gal</td>'
    x += ' <td class="s20" onclick="book_open(49)">Eph</td>'
    x += '</tr>'
    x += '<tr>'
    x += ' <td class="s20" onclick="book_open(50)">Php</td>'
    x += ' <td class="s20" onclick="book_open(51)">Col</td>'
    x += ' <td class="s20" onclick="book_open(52)">1Th</td>'
    x += ' <td class="s20" onclick="book_open(53)">2Th</td>'
    x += '</tr>'
    x += '<tr>'
    x += ' <td class="s20" onclick="book_open(54)">1Ti</td>'
    x += ' <td class="s20" onclick="book_open(55)">2Ti</td>'
    x += ' <td class="s20" onclick="book_open(56)">Tit</td>'
    x += ' <td class="s20" onclick="book_open(57)">Phm</td>'
    x += ' <td class="s20" onclick="book_open(58)">Heb</td>'
    x += '</tr></table><br>'
    x += '<table><tr>'
    x += ' <td class="s20" onclick="book_open(59)">Jam</td>'
    x += ' <td class="s20" onclick="book_open(60)">1Pe</td>'
    x += ' <td class="s20" onclick="book_open(61)">2Pe</td>'
    x += ' <td class="s20" onclick="book_open(62)">1Jo</td>'
    x += ' <td class="s20" onclick="book_open(63)">2Jo</td>'
    x += '</tr>'
    x += '<tr>'
    x += ' <td class="s20" onclick="book_open(64)">3Jo</td>'
    x += ' <td class="s20" onclick="book_open(65)">Jud</td>'
    x += ' <td class="s20" onclick="book_open(66)">Rev</td>'
    x += '<td class="g40" colspan="4" onclick="hide_disp_tbl()"><b>Close</b></td>'
    x += '</tr></table><br>'
    return x;
};


