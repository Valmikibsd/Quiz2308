var countqno = 1, capflg = 0, capno = 0 ;// parseInt(getCookie("countqno") || "0");

/****  cookies     *****/

// Set cookie
function setCookie(name, value, days) {
    let expires = "";
    if (days) {
        let d = new Date();
        d.setTime(d.getTime() + (days * 24 * 60 * 60 * 1000));
        expires = "; expires=" + d.toUTCString();
    }
    document.cookie = name + "=" + (value || "") + expires + "; path=/";
}

// Get cookie
function getCookie(name) {
    let nameEQ = name + "=";
    let ca = document.cookie.split(';');
    for (let i = 0; i < ca.length; i++) {
        let c = ca[i].trim();
        if (c.indexOf(nameEQ) == 0) return c.substring(nameEQ.length);
    }
    return null;
}

// Clear cookie
function clearCookie(name) {
    document.cookie = name + "=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
}

$("#btnSubmit").bind("click", function () {

    var chekerr = false;

    if ($("#txtContCode").val() == "") {
        chekerr = true;
        swal({
            title: "Required!",
            text: "Please enter captcha code ",
            icon: "error",
            timer: 10000,
        });

    }


    if (chekerr == false) {



        var examids = $("#hdfExamId").val();
        var langids = "19";
        var Captchas = $("#txtContCode").val();
        $("#txtContCode").val('');

        document.getElementById('divloading').style.display = 'inline-block';
        $.ajax({
            type: "POST",
            url: "/Home/recaptchamatch",
            //   contentType: "application/json",
            data: { uname: $('#hdfUserId').val(), password: 1, examid: 22, langid: capno, Captcha: Captchas },
            //contentType: "application/json; charset=utf-8",
            dataType: "json",
            success: function (response) {

                document.getElementById('divloading').style.display = 'none';
                let status = response.status;
                let message = response.message;

                if (status == 'Error') {


                    swal({
                        title: "Required!",
                        text: "Wrong captcha code",
                        icon: "error",
                        timer: 10000,
                    });
                } else {
                    capflg = 0;
                    capno++;
                    if (capno > 5) { capno =0}
                    document.getElementById('divloading').style.display = 'none';
                    //$('.coverlay').css('display', 'none');
                    //$('.capt').css('display', 'none');
                    $('.cpopup-close').trigger("click");
                    var sid = parseInt(getCookie("sId") || "0");
                    var fid = parseInt(getCookie("fId") || "0");
                    var totalnoofq = parseInt(getCookie("totalnoofq") || "0");
                    var time_limit = parseInt(getCookie("time_limit") || "0");
                    var queid = parseInt(getCookie("queid") || "0"); 
                    fnBackNext(sid, fid, totalnoofq, queid);
                    CountTime(time_limit, sid, fid, 2);

                    clearCookie("sId");
                    clearCookie("fId");
                    clearCookie("totalnoofq");
                    clearCookie("time_limit");
                }





            }, error: function (ex) {
                swal({
                    title: "Required!",
                    text: "Entry for the exam will open on 15 जुलाई 2025 से 24 जुलाई 2025' ",
                    icon: "error",
                    timer: 10000,
                });

            }
        });
    }
    return false;
});


function preventBack() {
    window.history.forward();
}
setTimeout("preventBack()", 0);
window.onunload = function () {
    null
};

document.addEventListener("contextmenu", function (e) {
    e.preventDefault();
});



//var time_limit = 29;
var time_out = 0;
var nextqnsauto = 0;
var nextcounterauto = 0;
var totalnoofques = 0;

/*function CountTime(time_limit, sId, fId, type) {
    if (capflg == 1) {
        return false;
    }
    if (parseInt($("#hidexamtime").val()) > 0) {
        return false;
    }
    clearInterval(time_out);

    const circle = document.querySelector("svg circle");

    // Remove any existing animation by resetting styles
    circle.style.animation = "none";
    void circle.offsetWidth; // Force reflow to restart animation

    // Apply properties using setAttribute
    circle.setAttribute("stroke-dasharray", "113px");
    circle.setAttribute("stroke-dashoffset", "5px");
    circle.setAttribute("stroke-linecap", "round");
    circle.setAttribute("stroke-width", "2px");
    circle.setAttribute("stroke", "red");
    circle.setAttribute("fill", "none");

    // Remove old <style> tag if exists
    const oldStyle = document.getElementById("countdown-style");
    if (oldStyle) oldStyle.remove();

    // Create new <style> tag for animation
    const style = document.createElement("style");
    style.id = "countdown-style";
    style.textContent = `
        @keyframes countdown {
            from { stroke-dashoffset: 5px; }
            to { stroke-dashoffset: 113px; }
        }
    `;
    document.head.appendChild(style);

    // Restart animation after resetting
    setTimeout(() => {
        circle.style.animation = `countdown ${time_limit}s linear forwards`;
    }, 10);

    // Store actual end time
    let endTime = Date.now() + time_limit * 1000;

    // Timer countdown logic using real time difference
    time_out = setInterval(() => {
        let remaining = Math.floor((endTime - Date.now()) / 1000);

        if (remaining <= 0) {
            $('#timer').html('0');
            clearInterval(time_out);

            if (nextcounterauto == "F") {
                $('#btnendexam').click();
            }

            $('.nextqns_' + nextqnsauto + '').click();

        } else {
            $('#timer').html(remaining);
        }
    }, 1000);
}*/

function CountTime(time_limit, sId, fId, type) {
    if (capflg == 1) return false;
    if (parseInt($("#hidexamtime").val()) > 0) return false;
    clearInterval(time_out);

    const circle = document.querySelector("svg circle");

    // Reset animation
    circle.style.animation = "none";
    void circle.offsetWidth;

    // Circle properties
    circle.setAttribute("stroke-dasharray", "113px");
    circle.setAttribute("stroke-dashoffset", "5px");
    circle.setAttribute("stroke-linecap", "round");
    circle.setAttribute("stroke-width", "2px");
    circle.setAttribute("stroke", "red");
    circle.setAttribute("fill", "none");

    // Remove old style
    const oldStyle = document.getElementById("countdown-style");
    if (oldStyle) oldStyle.remove();

    // New animation style
    const style = document.createElement("style");
    style.id = "countdown-style";
    style.textContent = `
        @keyframes countdown {
            from { stroke-dashoffset: 5px; }
            to { stroke-dashoffset: 113px; }
        }
    `;
    document.head.appendChild(style);

    // Restart animation
    setTimeout(() => {
        circle.style.animation = `countdown ${time_limit}s linear forwards`;
    }, 10);

    // Set end time
    let endTime = Date.now() + time_limit * 1000;

    // Show full time immediately
    $('#timer').html(time_limit);

    // Timer logic
    time_out = setInterval(() => {
        let remaining = Math.ceil((endTime - Date.now()) / 1000);

        if (remaining <= 0) {
            $('#timer').html('0');
            clearInterval(time_out);

            if (nextcounterauto == "F") {
                $('#btnendexam').click();
            }
            $('.nextqns_' + nextqnsauto + '').click();

        } else {
            $('#timer').html(remaining);
        }
    }, 1000);
}


/*
function CountTime(time_limit, sId, fId, type) {
    if (capflg == 1) {
        return false;
    }
    if (parseInt($("#hidexamtime").val()) > 0) {
        return false;
    }
    setCookie("time_limit", time_limit,1)
    clearInterval(time_out);
    const circle = document.querySelector("svg circle");

    // Remove any existing animation by resetting styles
    circle.style.animation = "none"; // Reset animation
    void circle.offsetWidth; // Force reflow to restart animation

    // Apply properties using setAttribute
    circle.setAttribute("stroke-dasharray", "113px");
    circle.setAttribute("stroke-dashoffset", "5px");
    circle.setAttribute("stroke-linecap", "round");
    circle.setAttribute("stroke-width", "2px");
    circle.setAttribute("stroke", "red");
    circle.setAttribute("fill", "none");

    // Remove old <style> tag if exists
    const oldStyle = document.getElementById("countdown-style");
    if (oldStyle) oldStyle.remove();

    // Create new <style> tag to define animation
    const style = document.createElement("style");
    style.id = "countdown-style";
    style.textContent = `
        @keyframes countdown {
            from {
                stroke-dashoffset: 5px;
            }
            to {
                stroke-dashoffset: 113px;
            }
        }
    `;
    document.head.appendChild(style);

    // Restart animation after resetting
    setTimeout(() => {
        circle.style.animation = `countdown ${time_limit}s linear forwards`;
    }, 10); // Small delay to apply changes

    // Timer countdown logic

    time_out = setInterval(() => {
        if (time_limit == 0) {
            $('#timer').html('0');
            clearInterval(time_out);

            if (nextcounterauto == "F") {
                $('#btnendexam').click();
            }

            // nextcounterauto = nextqnsauto;
            $('.nextqns_' + nextqnsauto + '').click();




        } else {
            $('#timer').html(time_limit);
            time_limit -= 1;
        }
    }, 1000);
}*/
//let time_out;

function CountTimeE(time_limit, sId, fId, type) {
    if (capflg == 1) {
        return false;
    }
    clearInterval(time_out);

    // Convert minutes to seconds
    let totalSeconds = Math.floor(time_limit * 60);

    // Instead of decreasing each second, store the end time
    let endTime = Date.now() + totalSeconds * 1000;

    const circle = document.querySelector("svg circle");
    const timeText = document.getElementById(fId);

    // Reset previous animation
    circle.style.animation = "none";
    void circle.offsetWidth;

    // Set circle properties
    circle.setAttribute("stroke-dasharray", "113px");
    circle.setAttribute("stroke-dashoffset", "5px");
    circle.setAttribute("stroke-linecap", "round");
    circle.setAttribute("stroke-width", "2px");
    circle.setAttribute("stroke", "red");
    circle.setAttribute("fill", "none");
    circle.style.display = 'none';

    // Remove old style
    const oldStyle = document.getElementById("countdown-style");
    if (oldStyle) oldStyle.remove();

    // Add new style for animation
    const style = document.createElement("style");
    style.id = "countdown-style";
    style.textContent = `
        @keyframes countdown {
            from { stroke-dashoffset: 5px; }
            to { stroke-dashoffset: 113px; }
        }
    `;
    document.head.appendChild(style);

    // Restart animation
    setTimeout(() => {
        circle.style.animation = `countdown ${totalSeconds}s linear forwards`;
    }, 10);

    // Timer logic using real time difference
    time_out = setInterval(() => {
        let remaining = Math.floor((endTime - Date.now()) / 1000);

        if (remaining <= 0) {
            $('#timer').html("0:00");
            clearInterval(time_out);
            $('#btnendexam').click();
        } else {
            let minutes = Math.floor(remaining / 60);
            let seconds = remaining % 60;
            $('#timer').html(`${minutes}:${seconds < 10 ? '0' : ''}${seconds}`);
        }
    }, 1000);
}


/*
function CountTimeE(time_limit, sId, fId, type) {
    if (capflg == 1) {
        return false;
    }
    clearInterval(time_out);

    // Convert minutes to seconds
    let totalSeconds = Math.floor(time_limit * 60);
    let remainingSeconds = totalSeconds;

    const circle = document.querySelector("svg circle");
    const timeText = document.getElementById(fId); // This is the text inside the circle

    // Reset previous animation
    circle.style.animation = "none";
    void circle.offsetWidth; // Force reflow

    // Set circle properties
    circle.setAttribute("stroke-dasharray", "113px");
    circle.setAttribute("stroke-dashoffset", "5px");
    circle.setAttribute("stroke-linecap", "round");
    circle.setAttribute("stroke-width", "2px");
    circle.setAttribute("stroke", "red");
    circle.setAttribute("fill", "none");
    circle.style.display = 'none';

    // Remove old <style> if exists
    const oldStyle = document.getElementById("countdown-style");
    if (oldStyle) oldStyle.remove();

    // Add new <style> for animation
    const style = document.createElement("style");
    style.id = "countdown-style";
    style.textContent = `
        @keyframes countdown {
            from {
                stroke-dashoffset: 5px;
            }
            to {
                stroke-dashoffset: 113px;
            }
        }
    `;
    document.head.appendChild(style);

    // Restart animation
    setTimeout(() => {
        circle.style.animation = `countdown ${totalSeconds}s linear forwards`;
    }, 10);

    // Timer logic
    time_out = setInterval(() => {
        if (remainingSeconds <= 0) {
            circle.textContent = "0:00";
            clearInterval(time_out);

            //if (nextcounterauto == "F") {
                $('#btnendexam').click();
            //}
            //$('.nextqns_' + nextqnsauto + '').click();
        } else {
            let minutes = Math.floor(remainingSeconds / 60);
            let seconds = remainingSeconds % 60;
            //circle.textContent = `${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;
            $('#timer').html(`${minutes}:${seconds < 10 ? '0' : ''}${seconds}`);
            remainingSeconds--;
        }
    }, 1000);
}
*/


// Encryption function
function encryptData(data, key) {
    var encrypted = CryptoJS.AES.encrypt(data, key);
    return encrypted.toString();
}

// Decryption function
function decryptData(encryptedData, key) {
    var decrypted = CryptoJS.AES.decrypt(encryptedData, key);
    return decrypted.toString(CryptoJS.enc.Utf8);
}

function disableFnKeys(e) { if (((e.which || e.keyCode) > 111 && (e.which || e.keyCode) < 124) || (e.which || e.keyCode) == 13) e.preventDefault(); };
// To disable f5

/* OR jQuery >= 1.7 */
$(document).on("keydown", disableFnKeys);

//// To re-enable f5
///* jQuery < 1.7 */
//$(document).unbind("keydown", disableF5);
///* OR jQuery >= 1.7 */
//$(document).off("keydown", disableF5);

//var goahead = false;
//window.onbeforeunload = function () {
//    if (goahead == false) {
//        //  reSeatingUser()
//        return "Your work will be lost.";
//    }
//};

//$(window).unload(function () {
//    if (goahead == false)
//        fnEndExam(1, 75);
//});

history.pushState(null, null, location.href);
window.onpopstate = function () {
    history.go(1);
};
function reSeatingUser() {
    $.ajax({
        type: "POST",
        url: "StartExam.aspx/fnReset",
        data: '{}',
        contentType: "application/json; charset=utf-8",
        dataType: "json",
        success: function (data) {

        }, error: function (ex) {

        }
    });
}

//function chkUserParticipatedOrNot() {
//    document.getElementById('divmainloading').style.display = 'block';
//    $.ajax({
//        type: "POST",
//        url: "StartExam.aspx/fnParticipatedOrNot",
//        data: '{uid: ' + JSON.stringify($('#hdfUserId').val()) + '}',
//        contentType: "application/json; charset=utf-8",
//        dataType: "json",
//        success: function (data) {
//            if (data.d[0] == 'er') { goahead = true; document.getElementById('divmainloading').style.display = 'none'; alert('There seems to be something wrong! Please trya again or later.'); document.location.href = "Login.aspx"; }
//            else if (data.d[0] == 'na') {
//                document.getElementById('divmainloading').style.display = 'none';
//                goahead = true;
//                //alert('You have already participated this exam! Thank You.');
//                document.location.href = "ShowReport.aspx?uid=" + $('#hdfUserId').val();

//            }
//            else if (data.d[0] == "rs") {
//                document.getElementById('divmainloading').style.display = 'none';
//                goahead = true;
//                //alert('Thank you for participate in this exam.');
//                document.location.href = "ShowReport.aspx?uid=" + $('#hdfUserId').val();
//            }
//            else
//                fnGetQuestions();
//        }, error: function (ex) {
//            document.getElementById('divmainloading').style.display = 'none';
//            goahead = true;
//            document.location.href = "ShowReport.aspx?uid=" + $('#hdfUserId').val();
//        }

//    });
//}


//var minutes = 64;

var minutes = 64;
var seconds = 60;
var countDown;
$(document).ready(function () {
    //chkUserParticipatedOrNot();
    // fnGetQuestionsonLang();

    document.addEventListener('keyup', (e) => {
        const isMac = navigator.platform.toUpperCase().includes('MAC');
        const combo = (isMac && e.metaKey) || (!isMac && e.ctrlKey);
        if (combo && e.key.toLowerCase() === 'p') {
            e.preventDefault();
            alert('Printing is disabled on this page.');
        }
        // Attempt to catch PrintScreen (not reliable across browsers)
        if (e.key === 'Alt' || e.code === 'PrintScreen' || e.key === 'Control' || e.key === 'PrtScr') {
            // Attempt to overwrite clipboard (may require https + user gesture)
            if (navigator.clipboard && navigator.clipboard.writeText) {
                navigator.clipboard.writeText('Screenshots are disabled on this page.')
                    .catch(() => { });
            }
            //alert('Screenshots are discouraged on this page.');
            e.preventDefault();
        }
    });

    var dropdown = $("#dynamic_select"); // Select the dropdown element
    var optionCount = dropdown.children('option').length; // Get the count of options


    $('#welcomeuser').css('display', 'block');
    $('#timerhtml').css('display', 'block');

    if (optionCount > 2) {
        $('.overlay').css('display', 'block');
        $('.lang-box').css('display', 'block');
    }
    else {
        var firstVal = $('#dynamic_select').children('option').eq(1).val();

        $('.lang-box').css('display', 'none');
        $('.overlay').css('display', 'none');
        $('#dynamic_select').val(firstVal);
        fnGetQuestions();
    }



    //  console.log("Number of options: " + optionCount);

});
function fnGetQuestionsonLang() {
    totalnoofques = 0;
    currentquesno = 0;
    nextcounterauto = 0;
    $.ajax({
        type: "POST",
        url: "/Home/fnGetQuestionsonLang",
        data: { uid: $('#hdfUserId').val(), ExamId: $('#hdfExamId').val() },
        //contentType: "application/json; charset=utf-8",
        dataType: "json",
        success: function (data) {
            var tableData = JSON.parse(data);
            if (tableData.length > 0) {
                $('#welcomeuser').css('display', 'block');
                $('#timerhtml').css('display', 'block');
                if (tableData != null || tableData != undefined || tableData != '') {
                    if (tableData.length > 1) {
                        $('.overlay').css('display', 'block');
                        $('.lang-box').css('display', 'block');
                    }
                    else {
                        $('.lang-box').css('display', 'none');
                        $('.overlay').css('display', 'none');
                        $('#dynamic_select').val(tableData[0].langid);
                        fnGetQuestions();
                    }
                }
            }
            //countDown = setInterval(countTime, 1000);
        }, error: function (ex) {
            //document.getElementById('divmainloading').style.display = 'none';
            alert('There seems to be something wrong! Please try a again or later.'); /*document.location.href = "Login.aspx";*/
        }
    });
}
function fnGetQuestions() {

    var jdata = {
        uid: $('#hdfUserId').val(), examid: $('#hdfExamId').val(), langid: $('#dynamic_select').val(), type: 'getquestions'
    }
    url_add = window.location.href;
    var data = url_add.split("://")
    var protocol = data[0];
    data = data[1].split("/");
    var domain = data[0];
    var menuname = data[1] + "/" + data[2];
    var encrp = "";
    var url_add = window.location.protocol + "//" + window.location.host + "/";
    var url = url_add + 'api/ApiServices/QuizApi';

    $.ajax({
        type: "POST",
        url: url,
        data: { jsonData: JSON.stringify(jdata) },
        //contentType: "application/json; charset=utf-8", fngetquestions
        dataType: "json",
        success: function (data) {
            console.log(data);
            //  var tableData = JSON.parse(data.Data);
            var tableData = data.Data;
            $("#hdfcapt").val(tableData[0].CaptchaFlag);
            $("#hidexamtime").val(tableData[0].examtime);
            $("#hidcapttime").val(tableData[0].CaptchaQno);
            $('.popup').css('display', 'none');
            $('.mock-question').css('display', 'block');
            if (tableData != null || tableData != undefined || tableData != '') {
                if (tableData.length > 0) {
                    if (tableData[0].dsplynoofques == 1)
                        fnSingleQuestion(tableData);
                    else if (tableData[0].dsplynoofques > 1)
                        fnMultipleQuestion(tableData);
                }
                $('#dynamic_select').val('0');
                $('.lang-box').css('display', 'none');
                $('.overlay').css('display', 'none');
            }

            //countDown = setInterval(countTime, 1000);
        }, error: function (ex) {
            //document.getElementById('divmainloading').style.display = 'none';
            alert('There seems to be something wrong! Please try a again or later.'); /*document.location.href = "Login.aspx";*/
        }
    });
}
$('.popup-close').click(function () {
    $('.lang-box').css('display', 'none');
    $('.overlay').css('display', 'none');
});

$('.cpopup-close').click(function () {
    $('.capt').css('display', 'none');
    $('.coverlay').css('display', 'none');
});

function fnSingleQuestion(tableData) {

    var htmlContent = "";
    var rShowHide = '';
    var totalnoofq = tableData.length;
    document.getElementById('hdfTotalNoOfQ').value = totalnoofq;

    minutes = tableData[0].ltime;
    // alert(tableData[0].ltime);

    var counter = 0;
    var idsval = 1;


    var qnostatus = '<div class="attempt-head">कुल प्रश्नों की संख्या  - ' + totalnoofq + '</div><div class="attemp-left-cont"><div class="attempt-leg"><div class="legend"><span class="green"></span>प्रयास किए गए प्रश्न</div><div class="legend"><span class="grey"></span>अप्रयासित प्रश्न</div></div></div>';
    var timerhtml = `<div id="countdown"><div id="timer"></div><svg><circle r="18" cx="20" cy="20"></circle></svg></div>`;
    $('#timerhtml').html(timerhtml);
    totalnoofques = totalnoofq;
    for (var i = 0; i < tableData.length; i++) {
        if (i == 0)
            rShowHide = "block";
        else
            rShowHide = "none";
        if (counter == i) {
            var uploadfile = (tableData[i].UploadFile != null ? tableData[i].UploadFile.substring(tableData[i].UploadFile.length - 3) : '');

            qnostatus += ' <a onclick="javascript:fnGoToQuestion(' + (i + 1) + ',' + totalnoofq + ');" id="pq' + (i + 1) + '" class=' + tableData[i].OPTION_name + '>' + (i + 1) + '</a>';
            htmlContent += '<div  id="divq' + (i + 1) + '" style="display:' + rShowHide + ';">' + (tableData[i].que_typeID == 1 ? '<ol><li class="mock-q"><span>' + (i + 1) + '. </span>' + (tableData[i].QNS_ENG != '' ? '<span>' + tableData[i].QNS_ENG + '</span>' : '') + '' + (tableData[i].QNS_HND != '' ? '</br><span>' + tableData[i].QNS_HND + '</span>' : '') + '' + (tableData[i].QNS_OTH != '' ? '</br><span>' + tableData[i].QNS_OTH + '</span>' : '') + '</li></ol>' : tableData[i].que_typeID == 2 ? '<ol><li class="mock-q"><span>' + (i + 1) + '. </span><span><audio controls><source src="' + tableData[i].QNS_ENG + '" type="audio/mpeg"></audio></span></br><span><audio controls><source src="' + tableData[i].QNS_HND + '" type="audio/mpeg"></audio></span></br><span><audio controls><source src="' + tableData[i].QNS_OTH + '" type="audio/mpeg"></audio></span></li></ol>' : tableData[i].que_typeID == 3 ? '<ol><li class="mock-q"><span>' + (i + 1) + '. </span><span><video width="600" autoplay loop muted><source src="' + tableData[i].QNS_ENG + '" type="video/mp4"></video></span></br><span><video width="600" autoplay loop muted><source src="' + tableData[i].QNS_HND + '" type="video/mp4"></video></span></br><span><video width="600" autoplay loop muted><source src="' + tableData[i].QNS_OTH + '" type="video/mp4"></video></span></li></ol>' : tableData[i].que_typeID == 4 ? '<ol><li class="mock-q"><span>' + (i + 1) + '. </span><span><img src="' + tableData[i].QNS_ENG + '"></span></br><span><img src="' + tableData[i].QNS_HND + '"></span></br><span><img src="' + tableData[i].QNS_OTH + '"></span></li></ol>' : '') + '' + (uploadfile != '' && uploadfile == "mp4" && tableData[i].QUES_RANDOM_NO != null && tableData[i].UploadFile != "noPhoto.png" ? '<div class="mock-q-pic"><video width="600" autoplay loop muted><source src="' + tableData[i].UploadFile_Path + '" type="video/mp4"></video></div>' : uploadfile != '' && uploadfile == "mp3" && tableData[i].QUES_RANDOM_NO != null && tableData[i].UploadFile != "noPhoto.png" ? '<div class="mock-q-pic"><audio controls><source src="' + tableData[i].UploadFile_Path + '" type="audio/mpeg"></audio></div>' : uploadfile != '' && tableData[i].QUES_RANDOM_NO != null && tableData[i].UploadFile != "noPhoto.png" && uploadfile == "jpg" || uploadfile == "jpeg" || uploadfile == "gif" ? '<div class="mock-q-pic"><img src="' + tableData[i].UploadFile_Path + '"></div>' : '') + '<div class="mock-option" id="one"><input name="option' + (i + 1) + '"    type="radio" value="' + tableData[i].OPT_ENG1 + '" onclick="fnChkQStatus(' + (i + 1) + '),fnOptionEndExam(' + (i + 1) + ',' + (counter + 1) + ',' + tableData[i].QNS_ID + ',1)" ' + tableData[i].selt1 + ' /><label for="one">' + (tableData[i].op_typeID_01 == 1 ? '<span>' + tableData[i].OPT_ENG1 + '</span><span>' + tableData[i].OPT_HND1 + '</span><span>' + tableData[i].OPT_OTH1 + '</span>' : tableData[i].op_typeID_01 == 2 ? '<span>' + (tableData[i].OPT_ENG1_PATH != '' ? '<audio controls><source src="' + tableData[i].OPT_ENG1_PATH + '" type="audio/mpeg"></audio>' : '') + '</span><span>' + (tableData[i].OPT_HND1_PATH != '' ? '<audio controls><source src="' + tableData[i].OPT_HND1_PATH + '" type="audio/mpeg"></audio>' : '') + '</span><span>' + (tableData[i].OPT_OTH1_PATH != '' ? '<audio controls><source src="' + tableData[i].OPT_OTH1_PATH + '" type="audio/mpeg"></audio>' : '') + '</span>' : tableData[i].op_typeID_01 == 3 ? '<span>' + (tableData[i].OPT_ENG1_PATH != '' ? '<video width="600" autoplay loop muted><source src="' + tableData[i].OPT_ENG1_PATH + '" type="video/mp4"></video>' : '') + '</span><span>' + (tableData[i].OPT_HND1_PATH != '' ? '<video width="600" autoplay loop muted><source src="' + tableData[i].OPT_HND1_PATH + '" type="video/mp4"></video>' : '') + '</span><span>' + (tableData[i].OPT_OTH1_PATH != '' ? '<video width="600" autoplay loop muted><source src="' + tableData[i].OPT_OTH1_PATH + '" type="video/mp4"></video>' : '') + '</span>' : tableData[i].op_typeID_01 == 4 ? '<span>' + (tableData[i].OPT_ENG1_PATH != '' ? '<div class="mock-q-pic"><img src="' + tableData[i].OPT_ENG1_PATH + '"></div>' : '') + '</span><span>' + (tableData[i].OPT_HND1_PATH != '' ? '<div class="mock-q-pic"><img src="' + tableData[i].OPT_HND1_PATH + '"></div>' : '') + '</span><span>' + (tableData[i].OPT_OTH1_PATH != '' ? '<div class="mock-q-pic"><img src="' + tableData[i].OPT_OTH1_PATH + '"></div>' : '') + '</span>' : tableData[i].op_typeID_01 == 5 ? '<span>' + tableData[i].OPT_ENG1 + '</span><span>' + tableData[i].OPT_HND1 + '</span><span>' + tableData[i].OPT_OTH1 + '</span>' : '') + '</label></div><div class="mock-option" id="one"><input name="option' + (i + 1) + '"  onclick="fnChkQStatus(' + (i + 1) + '),fnOptionEndExam(' + (i + 1) + ',' + (counter + 1) + ',' + tableData[i].QNS_ID + ',2)" type="radio" value="' + tableData[i].OPT_ENG2 + '"   ' + tableData[i].selt2 + ' /><label for="one">' + (tableData[i].op_typeID_02 == 1 ? '<span>' + tableData[i].OPT_ENG2 + '</span><span>' + tableData[i].OPT_HND2 + '</span><span>' + tableData[i].OPT_OTH2 + '</span>' : tableData[i].op_typeID_02 == 2 ? '<span>' + (tableData[i].OPT_ENG2_PATH != '' ? '<audio controls><source src="' + tableData[i].OPT_ENG2_PATH + '" type="audio/mpeg"></audio>' : '') + '</span><span>' + (tableData[i].OPT_HND2_PATH != '' ? '<audio controls><source src="' + tableData[i].OPT_HND2_PATH + '" type="audio/mpeg"></audio>' : '') + '</span><span>' + (tableData[i].OPT_OTH2_PATH != '' ? '<audio controls><source src="' + tableData[i].OPT_OTH2_PATH + '" type="audio/mpeg"></audio>' : '') + '</span>' : tableData[i].op_typeID_02 == 3 ? '<span>' + (tableData[i].OPT_ENG2_PATH != '' ? '<video width="600" autoplay loop muted><source src="' + tableData[i].OPT_ENG2_PATH + '" type="video/mp4"></video>' : '') + '</span><span>' + (tableData[i].OPT_HND2_PATH != '' ? '<video width="600" autoplay loop muted><source src="' + tableData[i].OPT_HND2_PATH + '" type="video/mp4"></video>' : '') + '</span><span>' + (tableData[i].OPT_OTH2_PATH != '' ? '<video width="600" autoplay loop muted><source src="' + tableData[i].OPT_OTH2_PATH + '" type="video/mp4"></video>' : '') + '</span>' : tableData[i].op_typeID_02 == 4 ? '<span>' + (tableData[i].OPT_ENG2_PATH != '' ? '<div class="mock-q-pic"><img src="' + tableData[i].OPT_ENG2_PATH + '"></div>' : '') + '</span><span>' + (tableData[i].OPT_HND2_PATH != '' ? '<div class="mock-q-pic"><img src="' + tableData[i].OPT_HND2_PATH + '"></div>' : '') + '</span><span>' + (tableData[i].OPT_OTH2_PATH != '' ? '<div class="mock-q-pic"><img src="' + tableData[i].OPT_OTH2_PATH + '"></div>' : '') + '</span>' : tableData[i].op_typeID_02 == 5 ? '<span>' + tableData[i].OPT_ENG2 + '</span><span>' + tableData[i].OPT_HND2 + '</span><span>' + tableData[i].OPT_OTH2 + '</span>' : '') + '</label></div>' + (tableData[i].OPTION_TYPE_NO == 3 || tableData[i].OPTION_TYPE_NO == 4 || tableData[i].OPTION_TYPE_NO == 5 || tableData[i].OPTION_TYPE_NO == 6 || tableData[i].OPTION_TYPE_NO == 7 ? '<div class="mock-option" id="one"><input name="option' + (i + 1) + '"  onclick="fnChkQStatus(' + (i + 1) + '),fnOptionEndExam(' + (i + 1) + ',' + (counter + 1) + ',' + tableData[i].QNS_ID + ',3)" type="radio" value="' + tableData[i].OPT_ENG3 + '"  ' + tableData[i].selt3 + ' /><label for="one">' + (tableData[i].op_typeID_03 == 1 ? '<span>' + tableData[i].OPT_ENG3 + '</span><span>' + tableData[i].OPT_HND3 + '</span><span>' + tableData[i].OPT_OTH3 + '</span>' : tableData[i].op_typeID_03 == 2 ? '<span>' + (tableData[i].OPT_ENG3_PATH != '' ? '<audio controls><source src="' + tableData[i].OPT_ENG3_PATH + '" type="audio/mpeg"></audio>' : '') + '</span><span>' + (tableData[i].OPT_HND3_PATH != '' ? '<audio controls><source src="' + tableData[i].OPT_HND3_PATH + '" type="audio/mpeg"></audio>' : '') + '</span><span>' + (tableData[i].OPT_OTH3_PATH != '' ? '<audio controls><source src="' + tableData[i].OPT_OTH3_PATH + '" type="audio/mpeg"></audio>' : '') + '</span>' : tableData[i].op_typeID_03 == 3 ? '<span>' + (tableData[i].OPT_ENG3_PATH != '' ? '<video width="600" autoplay loop muted><source src="' + tableData[i].OPT_ENG3_PATH + '" type="video/mp4"></video>' : '') + '</span><span>' + (tableData[i].OPT_HND3_PATH != '' ? '<video width="600" autoplay loop muted><source src="' + tableData[i].OPT_HND3_PATH + '" type="video/mp4"></video>' : '') + '</span><span>' + (tableData[i].OPT_OTH3_PATH != '' ? '<video width="600" autoplay loop muted><source src="' + tableData[i].OPT_OTH3_PATH + '" type="video/mp4"></video>' : '') + '</span>' : tableData[i].op_typeID_03 == 4 ? '<span>' + (tableData[i].OPT_ENG3_PATH != '' ? '<div class="mock-q-pic"><img src="' + tableData[i].OPT_ENG3_PATH + '"></div>' : '') + '</span><span>' + (tableData[i].OPT_HND3_PATH != '' ? '<div class="mock-q-pic"><img src="' + tableData[i].OPT_HND3_PATH + '"></div>' : '') + '</span><span>' + (tableData[i].OPT_OTH3_PATH != '' ? '<div class="mock-q-pic"><img src="' + tableData[i].OPT_OTH3_PATH + '"></div>' : '') + '</span>' : '') + '</label></div>' : '') + (tableData[i].OPTION_TYPE_NO == 4 || tableData[i].OPTION_TYPE_NO == 5 || tableData[i].OPTION_TYPE_NO == 6 || tableData[i].OPTION_TYPE_NO == 7 ? '<div class="mock-option" id="one"><input name="option' + (i + 1) + '"  onclick="fnChkQStatus(' + (i + 1) + '),fnOptionEndExam(' + (i + 1) + ',' + (counter + 1) + ',' + tableData[i].QNS_ID + ',4)" type="radio" value="' + tableData[i].OPT_ENG4 + '" ' + tableData[i].selt4 + ' /><label for="one">' + (tableData[i].op_typeID_04 == 1 ? '<span>' + tableData[i].OPT_ENG4 + '</span><span>' + tableData[i].OPT_HND4 + '</span><span>' + tableData[i].OPT_OTH4 + '</span>' : tableData[i].op_typeID_04 == 2 ? '<span>' + (tableData[i].OPT_ENG4_PATH != '' ? '<audio controls><source src="' + tableData[i].OPT_ENG4_PATH + '" type="audio/mpeg"></audio>' : '') + '</span><span>' + (tableData[i].OPT_HND4_PATH != '' ? '<audio controls><source src="' + tableData[i].OPT_HND4_PATH + '" type="audio/mpeg"></audio>' : '') + '</span><span>' + (tableData[i].OPT_OTH4_PATH != '' ? '<audio controls><source src="' + tableData[i].OPT_OTH4_PATH + '" type="audio/mpeg"></audio>' : '') + '</span>' : tableData[i].op_typeID_04 == 3 ? '<span>' + (tableData[i].OPT_ENG4_PATH != '' ? '<video width="600" autoplay loop muted><source src="' + tableData[i].OPT_ENG4_PATH + '" type="video/mp4"></video>' : '') + '</span><span>' + (tableData[i].OPT_HND4_PATH != '' ? '<video width="600" autoplay loop muted><source src="' + tableData[i].OPT_HND4_PATH + '" type="video/mp4"></video>' : '') + '</span><span>' + (tableData[i].OPT_OTH4_PATH != '' ? '<video width="600" autoplay loop muted><source src="' + tableData[i].OPT_OTH4_PATH + '" type="video/mp4"></video>' : '') + '</span>' : tableData[i].op_typeID_04 == 4 ? '<span>' + (tableData[i].OPT_ENG4_PATH != '' ? '<div class="mock-q-pic"><img src="' + tableData[i].OPT_ENG4_PATH + '"></div>' : '') + '</span><span>' + (tableData[i].OPT_HND4_PATH != '' ? '<div class="mock-q-pic"><img src="' + tableData[i].OPT_HND4_PATH + '"></div>' : '') + '</span><span>' + (tableData[i].OPT_OTH4_PATH != '' ? '<div class="mock-q-pic"><img src="' + tableData[i].OPT_OTH4_PATH + '"></div>' : '') + '</span>' : '') + '</label></div>' : '') + (tableData[i].OPTION_TYPE_NO == 5 || tableData[i].OPTION_TYPE_NO == 6 || tableData[i].OPTION_TYPE_NO == 7 ? '<div class="mock-option" id="one"><input name="option' + (i + 1) + '"  onclick="fnChkQStatus(' + (i + 1) + '),fnOptionEndExam(' + (i + 1) + ',' + (counter + 1) + ',' + tableData[i].QNS_ID + ',5)" type="radio" value="' + tableData[i].OPT_ENG5 + '" ' + tableData[i].selt5 + ' /><label for="one">' + (tableData[i].OP_TYPEID_05 == 1 ? '<span>' + tableData[i].OPT_ENG5 + '</span><span>' + tableData[i].OPT_HIND5 + '</span><span>' + tableData[i].OPT_OTH5 + '</span>' : tableData[i].OP_TYPEID_05 == 2 ? '<span>' + (tableData[i].OPT_ENG5_PATH != '' ? '<audio controls><source src="' + tableData[i].OPT_ENG5_PATH + '" type="audio/mpeg"></audio>' : '') + '</span><span>' + (tableData[i].OPT_HND5_PATH != '' ? '<audio controls><source src="' + tableData[i].OPT_HND5_PATH + '" type="audio/mpeg"></audio>' : '') + '</span><span>' + (tableData[i].OPT_OTH5_PATH != '' ? '<audio controls><source src="' + tableData[i].OPT_OTH5_PATH + '" type="audio/mpeg"></audio>' : '') + '</span>' : tableData[i].OP_TYPEID_05 == 3 ? '<span>' + (tableData[i].OPT_ENG5_PATH != '' ? '<video width="600" autoplay loop muted><source src="' + tableData[i].OPT_ENG5_PATH + '" type="video/mp4"></video>' : '') + '</span><span>' + (tableData[i].OPT_HND5_PATH != '' ? '<video width="600" autoplay loop muted><source src="' + tableData[i].OPT_HND5_PATH + '" type="video/mp4"></video>' : '') + '</span><span>' + (tableData[i].OPT_OTH5_PATH != '' ? '<video width="600" autoplay loop muted><source src="' + tableData[i].OPT_OTH5_PATH + '" type="video/mp4"></video>' : '') + '</span>' : tableData[i].OP_TYPEID_05 == 4 ? '<span>' + (tableData[i].OPT_ENG5_PATH != '' ? '<div class="mock-q-pic"><img src="' + tableData[i].OPT_ENG5_PATH + '"></div>' : '') + '</span><span>' + (tableData[i].OPT_HND5_PATH != '' ? '<div class="mock-q-pic"><img src="' + tableData[i].OPT_HND5_PATH + '"></div>' : '') + '</span><span>' + (tableData[i].OPT_OTH5_PATH != '' ? '<div class="mock-q-pic"><img src="' + tableData[i].OPT_OTH5_PATH + '"></div>' : '') + '</span>' : '') + '</label></div>' : '') + (tableData[i].OPTION_TYPE_NO == 6 || tableData[i].OPTION_TYPE_NO == 7 ? '<div class="mock-option" id="one"><input name="option' + (i + 1) + '"  onclick="fnChkQStatus(' + (i + 1) + '),fnOptionEndExam(' + (i + 1) + ',' + (counter + 1) + ',' + tableData[i].QNS_ID + ',6)" type="radio" value="' + tableData[i].OPT_ENG4 + '" ' + tableData[i].selt6 + ' /><label for="one">' + (tableData[i].OP_TYPEID_06 == 1 ? '<span>' + tableData[i].OPT_ENG6 + '</span><span>' + tableData[i].OPT_HIND6 + '</span><span>' + tableData[i].OPT_OTH6 + '</span>' : tableData[i].OP_TYPEID_06 == 2 ? '<span>' + (tableData[i].OPT_ENG6_PATH != '' ? '<audio controls><source src="' + tableData[i].OPT_ENG6_PATH + '" type="audio/mpeg"></audio>' : '') + '</span><span>' + (tableData[i].OPT_HND6_PATH != '' ? '<audio controls><source src="' + tableData[i].OPT_HND6_PATH + '" type="audio/mpeg"></audio>' : '') + '</span><span>' + (tableData[i].OPT_OTH6_PATH != '' ? '<audio controls><source src="' + tableData[i].OPT_OTH6_PATH + '" type="audio/mpeg"></audio>' : '') + '</span>' : tableData[i].OP_TYPEID_06 == 3 ? '<span>' + (tableData[i].OPT_ENG6_PATH != '' ? '<video width="600" autoplay loop muted><source src="' + tableData[i].OPT_ENG6_PATH + '" type="video/mp4"></video>' : '') + '</span><span>' + (tableData[i].OPT_HND6_PATH != '' ? '<video width="600" autoplay loop muted><source src="' + tableData[i].OPT_HND6_PATH + '" type="video/mp4"></video>' : '') + '</span><span>' + (tableData[i].OPT_OTH6_PATH != '' ? '<video width="600" autoplay loop muted><source src="' + tableData[i].OPT_OTH6_PATH + '" type="video/mp4"></video>' : '') + '</span>' : tableData[i].OP_TYPEID_06 == 4 ? '<span>' + (tableData[i].OPT_ENG6_PATH != '' ? '<div class="mock-q-pic"><img src="' + tableData[i].OPT_ENG6_PATH + '"></div>' : '') + '</span><span>' + (tableData[i].OPT_HND6_PATH != '' ? '<div class="mock-q-pic"><img src="' + tableData[i].OPT_HND6_PATH + '"></div>' : '') + '</span><span>' + (tableData[i].OPT_OTH6_PATH != '' ? '<div class="mock-q-pic"><img src="' + tableData[i].OPT_OTH6_PATH + '"></div>' : '') + '</span>' : '') + '</label></div>' : '') + (tableData[i].OPTION_TYPE_NO == 7 ? '<div class="mock-option" id="one"><input name="option' + (i + 1) + '"  onclick="fnChkQStatus(' + (i + 1) + '),fnOptionEndExam(' + (i + 1) + ',' + (counter + 1) + ',' + tableData[i].QNS_ID + ',7)" type="radio" value="' + tableData[i].OPT_ENG4 + '" ' + tableData[i].selt7 + ' /><label for="one">' + (tableData[i].OP_TYPEID_07 == 1 ? '<span>' + tableData[i].OPT_ENG7 + '</span><span>' + tableData[i].OPT_HIND7 + '</span><span>' + tableData[i].OPT_OTH7 + '</span>' : tableData[i].OP_TYPEID_07 == 2 ? '<span>' + (tableData[i].OPT_ENG7_PATH != '' ? '<audio controls><source src="' + tableData[i].OPT_ENG7_PATH + '" type="audio/mpeg"></audio>' : '') + '</span><span>' + (tableData[i].OPT_HND7_PATH != '' ? '<audio controls><source src="' + tableData[i].OPT_HND7_PATH + '" type="audio/mpeg"></audio>' : '') + '</span><span>' + (tableData[i].OPT_OTH7_PATH != '' ? '<audio controls><source src="' + tableData[i].OPT_OTH7_PATH + '" type="audio/mpeg"></audio>' : '') + '</span>' : tableData[i].OP_TYPEID_07 == 3 ? '<span>' + (tableData[i].OPT_ENG7_PATH != '' ? '<video width="600" autoplay loop muted><source src="' + tableData[i].OPT_ENG7_PATH + '" type="video/mp4"></video>' : '') + '</span><span>' + (tableData[i].OPT_HND7_PATH != '' ? '<video width="600" autoplay loop muted><source src="' + tableData[i].OPT_HND7_PATH + '" type="video/mp4"></video>' : '') + '</span><span>' + (tableData[i].OPT_OTH7_PATH != '' ? '<video width="600" autoplay loop muted><source src="' + tableData[i].OPT_OTH7_PATH + '" type="video/mp4"></video>' : '') + '</span>' : tableData[i].OP_TYPEID_07 == 4 ? '<span>' + (tableData[i].OPT_ENG7_PATH != '' ? '<div class="mock-q-pic"><img src="' + tableData[i].OPT_ENG7_PATH + '"></div>' : '') + '</span><span>' + (tableData[i].OPT_HND7_PATH != '' ? '<div class="mock-q-pic"><img src="' + tableData[i].OPT_HND7_PATH + '"></div>' : '') + '</span><span>' + (tableData[i].OPT_OTH7_PATH != '' ? '<div class="mock-q-pic"><img src="' + tableData[i].OPT_OTH7_PATH + '"></div>' : '') + '</span>' : '') + '</label></div>' : '') + '<input type="hidden" id="hdfRightAns' + (i + 1) + '" value="' + encryptData(tableData[i].RIGHT_ANS, '1234') + '"><input type="hidden" id="hdfqus' + (i + 1) + '" value="' + tableData[i].QNS_ID + '">';


            //if (i == totalnoofq - 1)
            htmlContent += '<div class="mock-btn" style="margin-top: 20px;"><a href="JavaScript:void(0)" class="nextqns_' + i + '" onclick="fnBackNext(' + (i + 1) + ',' + (counter + 1) + ',' + totalnoofq + ',' + tableData[i+1].QNS_ID + '), CountTime(' + tableData[i].TIME + ',' + (i + 1) + ',' + (counter + 1) + ',2)">Next Question &raquo;</a><input type="hidden" id="hdfFirstQ' + (counter + 1) + '" value="' + (counter + 1) + '" /><input type="hidden" id="hdfLastQ' + (counter + 1) + '" value="' + (i + 1) + '" /></div></div>';
            if (tableData[0].examtime > 0) {
                CountTimeE(tableData[0].examtime, (i + 1), (counter + 1), 1);
            }
            else {
                CountTime(tableData[i].TIME, (i + 1), (counter + 1), 1);
            }
        }
        else {
            var uploadfile = (tableData[i].UploadFile_Path != null ? tableData[i].UploadFile_Path.substring(tableData[i].UploadFile_Path.length - 3) : '');
            htmlContent += '<div id="divq' + (i + 1) + '" style="display:' + rShowHide + ';">' + (tableData[i].que_typeID == 1 ? '<ol><li class="mock-q"><span>' + (i + 1) + '. </span>' + (tableData[i].QNS_ENG != '' ? '<span>' + tableData[i].QNS_ENG + '</span>' : '') + '' + (tableData[i].QNS_HND != '' ? '</br><span>' + tableData[i].QNS_HND + '</span>' : '') + '' + (tableData[i].QNS_OTH != '' ? '</br><span>' + tableData[i].QNS_OTH + '</span>' : '') + '</li></ol>' : tableData[i].que_typeID == 2 ? '<ol><li class="mock-q"><span>' + (i + 1) + '. </span><span><audio controls><source src="' + tableData[i].QNS_ENG + '" type="audio/mpeg"></audio></span></br><span><audio controls><source src="' + tableData[i].QNS_HND + '" type="audio/mpeg"></audio></span></br><span><audio controls><source src="' + tableData[i].QNS_OTH + '" type="audio/mpeg"></audio></span></li></ol>' : tableData[i].que_typeID == 3 ? '<ol><li class="mock-q"><span>' + (i + 1) + '. </span><span><video width="600" autoplay loop muted><source src="' + tableData[i].QNS_ENG + '" type="video/mp4"></video></span></br><span><video width="600" autoplay loop muted><source src="' + tableData[i].QNS_HND + '" type="video/mp4"></video></span></br><span><video width="600" autoplay loop muted><source src="' + tableData[i].QNS_OTH + '" type="video/mp4"></video></span></li></ol>' : tableData[i].que_typeID == 4 ? '<ol><li class="mock-q"><span>' + (i + 1) + '. </span><span><img src="' + tableData[i].QNS_ENG + '"></span></br><span><img src="' + tableData[i].QNS_HND + '"></span></br><span><img src="' + tableData[i].QNS_OTH + '"></span></li></ol>' : '') + '' + (uploadfile != '' && uploadfile == "mp4" && tableData[i].QUES_RANDOM_NO != null && tableData[i].UploadFile != "noPhoto.png" ? '<div class="mock-q-pic"><video width="600" autoplay loop muted><source src="' + tableData[i].UploadFile_Path + '" type="video/mp4"></video></div>' : uploadfile != '' && uploadfile == "mp3" && tableData[i].QUES_RANDOM_NO != null && tableData[i].UploadFile != "noPhoto.png" ? '<div class="mock-q-pic"><audio controls><source src="' + tableData[i].UploadFile_Path + '" type="audio/mpeg"></audio></div>' : uploadfile != '' && tableData[i].QUES_RANDOM_NO != null && tableData[i].UploadFile != "noPhoto.png" && uploadfile == "jpg" || uploadfile == "jpeg" || uploadfile == "gif" ? '<div class="mock-q-pic"><img src="' + tableData[i].UploadFile_Path + '"></div>' : '') + '<div class="mock-option" id="one"><input name="option' + (i + 1) + '"    type="radio" value="' + tableData[i].OPT_ENG1 + '" onclick="fnChkQStatus(' + (i + 1) + '),fnOptionEndExam(' + (i + 1) + ',' + (counter + 1) + ',' + tableData[i].QNS_ID + ',1)" ' + tableData[i].selt1 + ' /><label for="one">' + (tableData[i].op_typeID_01 == 1 ? '<span>' + tableData[i].OPT_ENG1 + '</span><span>' + tableData[i].OPT_HND1 + '</span><span>' + tableData[i].OPT_OTH1 + '</span>' : tableData[i].op_typeID_01 == 2 ? '<span>' + (tableData[i].OPT_ENG1_PATH != '' ? '<audio controls><source src="' + tableData[i].OPT_ENG1_PATH + '" type="audio/mpeg"></audio>' : '') + '</span><span>' + (tableData[i].OPT_HND1_PATH != '' ? '<audio controls><source src="' + tableData[i].OPT_HND1_PATH + '" type="audio/mpeg"></audio>' : '') + '</span><span>' + (tableData[i].OPT_OTH1_PATH != '' ? '<audio controls><source src="' + tableData[i].OPT_OTH1_PATH + '" type="audio/mpeg"></audio>' : '') + '</span>' : tableData[i].op_typeID_01 == 3 ? '<span>' + (tableData[i].OPT_ENG1_PATH != '' ? '<video width="600" autoplay loop muted><source src="' + tableData[i].OPT_ENG1_PATH + '" type="video/mp4"></video>' : '') + '</span><span>' + (tableData[i].OPT_HND1_PATH != '' ? '<video width="600" autoplay loop muted><source src="' + tableData[i].OPT_HND1_PATH + '" type="video/mp4"></video>' : '') + '</span><span>' + (tableData[i].OPT_OTH1_PATH != '' ? '<video width="600" autoplay loop muted><source src="' + tableData[i].OPT_OTH1_PATH + '" type="video/mp4"></video>' : '') + '</span>' : tableData[i].op_typeID_01 == 4 ? '<span>' + (tableData[i].OPT_ENG1_PATH != '' ? '<div class="mock-q-pic"><img src="' + tableData[i].OPT_ENG1_PATH + '"></div>' : '') + '</span><span>' + (tableData[i].OPT_HND1_PATH != '' ? '<div class="mock-q-pic"><img src="' + tableData[i].OPT_HND1_PATH + '"></div>' : '') + '</span><span>' + (tableData[i].OPT_OTH1_PATH != '' ? '<div class="mock-q-pic"><img src="' + tableData[i].OPT_OTH1_PATH + '"></div>' : '') + '</span>' : tableData[i].op_typeID_01 == 5 ? '<span>' + tableData[i].OPT_ENG1 + '</span><span>' + tableData[i].OPT_HND1 + '</span><span>' + tableData[i].OPT_OTH1 + '</span>' : '') + '</label></div><div class="mock-option" id="one"><input name="option' + (i + 1) + '"  onclick="fnChkQStatus(' + (i + 1) + '),fnOptionEndExam(' + (i + 1) + ',' + (counter + 1) + ',' + tableData[i].QNS_ID + ',2)" type="radio" value="' + tableData[i].OPT_ENG2 + '"   ' + tableData[i].selt2 + ' /><label for="one">' + (tableData[i].op_typeID_02 == 1 ? '<span>' + tableData[i].OPT_ENG2 + '</span><span>' + tableData[i].OPT_HND2 + '</span><span>' + tableData[i].OPT_OTH2 + '</span>' : tableData[i].op_typeID_02 == 2 ? '<span>' + (tableData[i].OPT_ENG2_PATH != '' ? '<audio controls><source src="' + tableData[i].OPT_ENG2_PATH + '" type="audio/mpeg"></audio>' : '') + '</span><span>' + (tableData[i].OPT_HND2_PATH != '' ? '<audio controls><source src="' + tableData[i].OPT_HND2_PATH + '" type="audio/mpeg"></audio>' : '') + '</span><span>' + (tableData[i].OPT_OTH2_PATH != '' ? '<audio controls><source src="' + tableData[i].OPT_OTH2_PATH + '" type="audio/mpeg"></audio>' : '') + '</span>' : tableData[i].op_typeID_02 == 3 ? '<span>' + (tableData[i].OPT_ENG2_PATH != '' ? '<video width="600" autoplay loop muted><source src="' + tableData[i].OPT_ENG2_PATH + '" type="video/mp4"></video>' : '') + '</span><span>' + (tableData[i].OPT_HND2_PATH != '' ? '<video width="600" autoplay loop muted><source src="' + tableData[i].OPT_HND2_PATH + '" type="video/mp4"></video>' : '') + '</span><span>' + (tableData[i].OPT_OTH2_PATH != '' ? '<video width="600" autoplay loop muted><source src="' + tableData[i].OPT_OTH2_PATH + '" type="video/mp4"></video>' : '') + '</span>' : tableData[i].op_typeID_02 == 4 ? '<span>' + (tableData[i].OPT_ENG2_PATH != '' ? '<div class="mock-q-pic"><img src="' + tableData[i].OPT_ENG2_PATH + '"></div>' : '') + '</span><span>' + (tableData[i].OPT_HND2_PATH != '' ? '<div class="mock-q-pic"><img src="' + tableData[i].OPT_HND2_PATH + '"></div>' : '') + '</span><span>' + (tableData[i].OPT_OTH2_PATH != '' ? '<div class="mock-q-pic"><img src="' + tableData[i].OPT_OTH2_PATH + '"></div>' : '') + '</span>' : tableData[i].op_typeID_02 == 5 ? '<span>' + tableData[i].OPT_ENG2 + '</span><span>' + tableData[i].OPT_HND2 + '</span><span>' + tableData[i].OPT_OTH2 + '</span>' : '') + '</label></div>' + (tableData[i].OPTION_TYPE_NO == 3 || tableData[i].OPTION_TYPE_NO == 4 || tableData[i].OPTION_TYPE_NO == 5 || tableData[i].OPTION_TYPE_NO == 6 || tableData[i].OPTION_TYPE_NO == 7 ? '<div class="mock-option" id="one"><input name="option' + (i + 1) + '"  onclick="fnChkQStatus(' + (i + 1) + '),fnOptionEndExam(' + (i + 1) + ',' + (counter + 1) + ',' + tableData[i].QNS_ID + ',3)" type="radio" value="' + tableData[i].OPT_ENG3 + '"  ' + tableData[i].selt3 + ' /><label for="one">' + (tableData[i].op_typeID_03 == 1 ? '<span>' + tableData[i].OPT_ENG3 + '</span><span>' + tableData[i].OPT_HND3 + '</span><span>' + tableData[i].OPT_OTH3 + '</span>' : tableData[i].op_typeID_03 == 2 ? '<span>' + (tableData[i].OPT_ENG3_PATH != '' ? '<audio controls><source src="' + tableData[i].OPT_ENG3_PATH + '" type="audio/mpeg"></audio>' : '') + '</span><span>' + (tableData[i].OPT_HND3_PATH != '' ? '<audio controls><source src="' + tableData[i].OPT_HND3_PATH + '" type="audio/mpeg"></audio>' : '') + '</span><span>' + (tableData[i].OPT_OTH3_PATH != '' ? '<audio controls><source src="' + tableData[i].OPT_OTH3_PATH + '" type="audio/mpeg"></audio>' : '') + '</span>' : tableData[i].op_typeID_03 == 3 ? '<span>' + (tableData[i].OPT_ENG3_PATH != '' ? '<video width="600" autoplay loop muted><source src="' + tableData[i].OPT_ENG3_PATH + '" type="video/mp4"></video>' : '') + '</span><span>' + (tableData[i].OPT_HND3_PATH != '' ? '<video width="600" autoplay loop muted><source src="' + tableData[i].OPT_HND3_PATH + '" type="video/mp4"></video>' : '') + '</span><span>' + (tableData[i].OPT_OTH3_PATH != '' ? '<video width="600" autoplay loop muted><source src="' + tableData[i].OPT_OTH3_PATH + '" type="video/mp4"></video>' : '') + '</span>' : tableData[i].op_typeID_03 == 4 ? '<span>' + (tableData[i].OPT_ENG3_PATH != '' ? '<div class="mock-q-pic"><img src="' + tableData[i].OPT_ENG3_PATH + '"></div>' : '') + '</span><span>' + (tableData[i].OPT_HND3_PATH != '' ? '<div class="mock-q-pic"><img src="' + tableData[i].OPT_HND3_PATH + '"></div>' : '') + '</span><span>' + (tableData[i].OPT_OTH3_PATH != '' ? '<div class="mock-q-pic"><img src="' + tableData[i].OPT_OTH3_PATH + '"></div>' : '') + '</span>' : '') + '</label></div>' : '') + (tableData[i].OPTION_TYPE_NO == 4 || tableData[i].OPTION_TYPE_NO == 5 || tableData[i].OPTION_TYPE_NO == 6 || tableData[i].OPTION_TYPE_NO == 7 ? '<div class="mock-option" id="one"><input name="option' + (i + 1) + '"  onclick="fnChkQStatus(' + (i + 1) + '),fnOptionEndExam(' + (i + 1) + ',' + (counter + 1) + ',' + tableData[i].QNS_ID + ',4)" type="radio" value="' + tableData[i].OPT_ENG4 + '" ' + tableData[i].selt4 + ' /><label for="one">' + (tableData[i].op_typeID_04 == 1 ? '<span>' + tableData[i].OPT_ENG4 + '</span><span>' + tableData[i].OPT_HND4 + '</span><span>' + tableData[i].OPT_OTH4 + '</span>' : tableData[i].op_typeID_04 == 2 ? '<span>' + (tableData[i].OPT_ENG4_PATH != '' ? '<audio controls><source src="' + tableData[i].OPT_ENG4_PATH + '" type="audio/mpeg"></audio>' : '') + '</span><span>' + (tableData[i].OPT_HND4_PATH != '' ? '<audio controls><source src="' + tableData[i].OPT_HND4_PATH + '" type="audio/mpeg"></audio>' : '') + '</span><span>' + (tableData[i].OPT_OTH4_PATH != '' ? '<audio controls><source src="' + tableData[i].OPT_OTH4_PATH + '" type="audio/mpeg"></audio>' : '') + '</span>' : tableData[i].op_typeID_04 == 3 ? '<span>' + (tableData[i].OPT_ENG4_PATH != '' ? '<video width="600" autoplay loop muted><source src="' + tableData[i].OPT_ENG4_PATH + '" type="video/mp4"></video>' : '') + '</span><span>' + (tableData[i].OPT_HND4_PATH != '' ? '<video width="600" autoplay loop muted><source src="' + tableData[i].OPT_HND4_PATH + '" type="video/mp4"></video>' : '') + '</span><span>' + (tableData[i].OPT_OTH4_PATH != '' ? '<video width="600" autoplay loop muted><source src="' + tableData[i].OPT_OTH4_PATH + '" type="video/mp4"></video>' : '') + '</span>' : tableData[i].op_typeID_04 == 4 ? '<span>' + (tableData[i].OPT_ENG4_PATH != '' ? '<div class="mock-q-pic"><img src="' + tableData[i].OPT_ENG4_PATH + '"></div>' : '') + '</span><span>' + (tableData[i].OPT_HND4_PATH != '' ? '<div class="mock-q-pic"><img src="' + tableData[i].OPT_HND4_PATH + '"></div>' : '') + '</span><span>' + (tableData[i].OPT_OTH4_PATH != '' ? '<div class="mock-q-pic"><img src="' + tableData[i].OPT_OTH4_PATH + '"></div>' : '') + '</span>' : '') + '</label></div>' : '') + (tableData[i].OPTION_TYPE_NO == 5 || tableData[i].OPTION_TYPE_NO == 6 || tableData[i].OPTION_TYPE_NO == 7 ? '<div class="mock-option" id="one"><input name="option' + (i + 1) + '"  onclick="fnChkQStatus(' + (i + 1) + '),fnOptionEndExam(' + (i + 1) + ',' + (counter + 1) + ',' + tableData[i].QNS_ID + ',5)" type="radio" value="' + tableData[i].OPT_ENG5 + '" ' + tableData[i].selt5 + ' /><label for="one">' + (tableData[i].OP_TYPEID_05 == 1 ? '<span>' + tableData[i].OPT_ENG5 + '</span><span>' + tableData[i].OPT_HIND5 + '</span><span>' + tableData[i].OPT_OTH5 + '</span>' : tableData[i].OP_TYPEID_05 == 2 ? '<span>' + (tableData[i].OPT_ENG5_PATH != '' ? '<audio controls><source src="' + tableData[i].OPT_ENG5_PATH + '" type="audio/mpeg"></audio>' : '') + '</span><span>' + (tableData[i].OPT_HND5_PATH != '' ? '<audio controls><source src="' + tableData[i].OPT_HND5_PATH + '" type="audio/mpeg"></audio>' : '') + '</span><span>' + (tableData[i].OPT_OTH5_PATH != '' ? '<audio controls><source src="' + tableData[i].OPT_OTH5_PATH + '" type="audio/mpeg"></audio>' : '') + '</span>' : tableData[i].OP_TYPEID_05 == 3 ? '<span>' + (tableData[i].OPT_ENG5_PATH != '' ? '<video width="600" autoplay loop muted><source src="' + tableData[i].OPT_ENG5_PATH + '" type="video/mp4"></video>' : '') + '</span><span>' + (tableData[i].OPT_HND5_PATH != '' ? '<video width="600" autoplay loop muted><source src="' + tableData[i].OPT_HND5_PATH + '" type="video/mp4"></video>' : '') + '</span><span>' + (tableData[i].OPT_OTH5_PATH != '' ? '<video width="600" autoplay loop muted><source src="' + tableData[i].OPT_OTH5_PATH + '" type="video/mp4"></video>' : '') + '</span>' : tableData[i].OP_TYPEID_05 == 4 ? '<span>' + (tableData[i].OPT_ENG5_PATH != '' ? '<div class="mock-q-pic"><img src="' + tableData[i].OPT_ENG5_PATH + '"></div>' : '') + '</span><span>' + (tableData[i].OPT_HND5_PATH != '' ? '<div class="mock-q-pic"><img src="' + tableData[i].OPT_HND5_PATH + '"></div>' : '') + '</span><span>' + (tableData[i].OPT_OTH5_PATH != '' ? '<div class="mock-q-pic"><img src="' + tableData[i].OPT_OTH5_PATH + '"></div>' : '') + '</span>' : '') + '</label></div>' : '') + (tableData[i].OPTION_TYPE_NO == 6 || tableData[i].OPTION_TYPE_NO == 7 ? '<div class="mock-option" id="one"><input name="option' + (i + 1) + '"  onclick="fnChkQStatus(' + (i + 1) + '),fnOptionEndExam(' + (i + 1) + ',' + (counter + 1) + ',' + tableData[i].QNS_ID + ',6)" type="radio" value="' + tableData[i].OPT_ENG4 + '" ' + tableData[i].selt6 + ' /><label for="one">' + (tableData[i].OP_TYPEID_06 == 1 ? '<span>' + tableData[i].OPT_ENG6 + '</span><span>' + tableData[i].OPT_HIND6 + '</span><span>' + tableData[i].OPT_OTH6 + '</span>' : tableData[i].OP_TYPEID_06 == 2 ? '<span>' + (tableData[i].OPT_ENG6_PATH != '' ? '<audio controls><source src="' + tableData[i].OPT_ENG6_PATH + '" type="audio/mpeg"></audio>' : '') + '</span><span>' + (tableData[i].OPT_HND6_PATH != '' ? '<audio controls><source src="' + tableData[i].OPT_HND6_PATH + '" type="audio/mpeg"></audio>' : '') + '</span><span>' + (tableData[i].OPT_OTH6_PATH != '' ? '<audio controls><source src="' + tableData[i].OPT_OTH6_PATH + '" type="audio/mpeg"></audio>' : '') + '</span>' : tableData[i].OP_TYPEID_06 == 3 ? '<span>' + (tableData[i].OPT_ENG6_PATH != '' ? '<video width="600" autoplay loop muted><source src="' + tableData[i].OPT_ENG6_PATH + '" type="video/mp4"></video>' : '') + '</span><span>' + (tableData[i].OPT_HND6_PATH != '' ? '<video width="600" autoplay loop muted><source src="' + tableData[i].OPT_HND6_PATH + '" type="video/mp4"></video>' : '') + '</span><span>' + (tableData[i].OPT_OTH6_PATH != '' ? '<video width="600" autoplay loop muted><source src="' + tableData[i].OPT_OTH6_PATH + '" type="video/mp4"></video>' : '') + '</span>' : tableData[i].OP_TYPEID_06 == 4 ? '<span>' + (tableData[i].OPT_ENG6_PATH != '' ? '<div class="mock-q-pic"><img src="' + tableData[i].OPT_ENG6_PATH + '"></div>' : '') + '</span><span>' + (tableData[i].OPT_HND6_PATH != '' ? '<div class="mock-q-pic"><img src="' + tableData[i].OPT_HND6_PATH + '"></div>' : '') + '</span><span>' + (tableData[i].OPT_OTH6_PATH != '' ? '<div class="mock-q-pic"><img src="' + tableData[i].OPT_OTH6_PATH + '"></div>' : '') + '</span>' : '') + '</label></div>' : '') + (tableData[i].OPTION_TYPE_NO == 7 ? '<div class="mock-option" id="one"><input name="option' + (i + 1) + '"  onclick="fnChkQStatus(' + (i + 1) + '),fnOptionEndExam(' + (i + 1) + ',' + (counter + 1) + ',' + tableData[i].QNS_ID + ',7)" type="radio" value="' + tableData[i].OPT_ENG4 + '" ' + tableData[i].selt7 + ' /><label for="one">' + (tableData[i].OP_TYPEID_07 == 1 ? '<span>' + tableData[i].OPT_ENG7 + '</span><span>' + tableData[i].OPT_HIND7 + '</span><span>' + tableData[i].OPT_OTH7 + '</span>' : tableData[i].OP_TYPEID_07 == 2 ? '<span>' + (tableData[i].OPT_ENG7_PATH != '' ? '<audio controls><source src="' + tableData[i].OPT_ENG7_PATH + '" type="audio/mpeg"></audio>' : '') + '</span><span>' + (tableData[i].OPT_HND7_PATH != '' ? '<audio controls><source src="' + tableData[i].OPT_HND7_PATH + '" type="audio/mpeg"></audio>' : '') + '</span><span>' + (tableData[i].OPT_OTH7_PATH != '' ? '<audio controls><source src="' + tableData[i].OPT_OTH7_PATH + '" type="audio/mpeg"></audio>' : '') + '</span>' : tableData[i].OP_TYPEID_07 == 3 ? '<span>' + (tableData[i].OPT_ENG7_PATH != '' ? '<video width="600" autoplay loop muted><source src="' + tableData[i].OPT_ENG7_PATH + '" type="video/mp4"></video>' : '') + '</span><span>' + (tableData[i].OPT_HND7_PATH != '' ? '<video width="600" autoplay loop muted><source src="' + tableData[i].OPT_HND7_PATH + '" type="video/mp4"></video>' : '') + '</span><span>' + (tableData[i].OPT_OTH7_PATH != '' ? '<video width="600" autoplay loop muted><source src="' + tableData[i].OPT_OTH7_PATH + '" type="video/mp4"></video>' : '') + '</span>' : tableData[i].OP_TYPEID_07 == 4 ? '<span>' + (tableData[i].OPT_ENG7_PATH != '' ? '<div class="mock-q-pic"><img src="' + tableData[i].OPT_ENG7_PATH + '"></div>' : '') + '</span><span>' + (tableData[i].OPT_HND7_PATH != '' ? '<div class="mock-q-pic"><img src="' + tableData[i].OPT_HND7_PATH + '"></div>' : '') + '</span><span>' + (tableData[i].OPT_OTH7_PATH != '' ? '<div class="mock-q-pic"><img src="' + tableData[i].OPT_OTH7_PATH + '"></div>' : '') + '</span>' : '') + '</label></div>' : '') + '<input type="hidden" id="hdfRightAns' + (i + 1) + '" value="' + encryptData(tableData[i].RIGHT_ANS, '1234') + '"><input type="hidden" id="hdfqus' + (i + 1) + '" value="' + tableData[i].QNS_ID + '">';

            //htmlContent += '<div class="mock-btn" style="margin-top: 20px;"><a href="JavaScript:void(0)" onclick="fnBackNext(' + (i + 1) + ',' + (counter + 1) + ')">Next Question &raquo;</a><input type="hidden" id="hdfFirstQ' + (counter + 1) + '" value="' + (counter + 1) + '" /><input type="hidden" id="hdfLastQ' + (counter + 1) + '" value="' + (i + 1) + '" /></div></div>';

            qnostatus += '<a onclick="javascript:fnGoToQuestion(' + (counter + 1) + ',' + totalnoofq + ');" id="pq' + (i + 1) + '" class=' + tableData[i].OPTION_name + '>' + (i + 1) + '</a>';

            if (i == totalnoofq - 1) {


                htmlContent += '<div class="mock-btn" style="margin-top: 20px;"><a name="next" class="next" id="btnendexam"  onclick="fnEndExam(' + (i + 1) + ',' + (counter + 1) + ',' + tableData[i].TIME + ')" ><span style="margin-left: -8px;">End the Exam</span><br /><span> परीक्षा समाप्त करें</span></a></div><input type="hidden" id="hdfFirstQ' + (counter + 1) + '" value="' + (counter + 1) + '" /><input type="hidden" id="hdfLastQ' + (counter + 1) + '" value="' + (i + 1) + '" /></div>';

            }
            else {
                if (i == (counter + 1)) {
                    if (counter > 1) {
                        // htmlContent += '<div class="btnPrev"><a name="next" class="next" style="margin:0px;float:none;background:none;cursor:pointer;"  onclick="fnBack(' + (counter - 4) + ',' + (counter + 1) + ')" ><span style="margin-left: -8px;">Back</span><br /><span>पीछे जाएं</span></a></div>';
                    }
                    htmlContent += '<div class="mock-btn" style="margin-top: 20px;"><a href="JavaScript:void(0)" class="nextqns_' + i + '" onclick="fnBackNext(' + (i + 1) + ',' + (counter + 1) + ',' + totalnoofq + ',' + tableData[i+1].QNS_ID + '), CountTime(' + tableData[i].TIME + ',' + (i + 1) + ',' + (counter + 1) + ',3)">Next Question &raquo;</a><input type="hidden" id="hdfFirstQ' + (counter + 1) + '" value="' + (counter + 1) + '" /><input type="hidden" id="hdfLastQ' + (counter + 1) + '" value="' + (i + 1) + '" /></div></div>';
                    counter += 1;

                    //nextcounterauto = counter;
                }
            }

        }

    }
    qnostatus += '</div><div id="divEndExam" class="end-exam"><a name="next" class="next"  onclick="fnEndExam(5,1)"><span>End the Exam / परीक्षा समाप्त करें</span></a></div>';
    // qnostatus += '</div><div id="divEndExam" class="mock-btn"><a name="next" class="next" style="margin:0px;float:none;background:none;cursor:pointer;" onclick="fnEndExam(5,1)"><span style="margin-left: -8px;">End the Exam</span><br><span> परीक्षा समाप्त करें</span></a></div>';

    $('#divQStatus').html(qnostatus);
    document.getElementById('divmainloading').style.display = 'none';
    //htmlContent += '<a href="#"><input name="next" class="next" type="button" value="Next" /></a>';
    $('#divTotalNoOfQ').html("कुल प्रश्नों की संख्या : 1/" + totalnoofq);
    $('#pSet').html((tableData[0].SETS).replace("_", " - "));
    $('#divQuestionsAnsSheet').html(htmlContent);
    //$('#headerhtml').text(tableData[0].Header);
    //$('#footerhtml').text(tableData[0].Footer);
}

function fnMultipleQuestion(tableData) {
    var htmlContent = "";
    var rShowHide = '';
    var totalnoofq = tableData.length;
    document.getElementById('hdfTotalNoOfQ').value = totalnoofq;

    //minutes = tableData[0].ltime;
    // alert(tableData[0].ltime);

    var counter = 0;
    var idsval = 1;
    var qnostatus = '<div class="attempt-head">Total Number Of Questions - ' + totalnoofq + '</div><div class="attemp-left-cont"><div class="attempt-leg"><div class="legend"><span class="green"></span>Attempt Questions</div><div class="legend"><span class="grey"></span>Unattempt Questions</div></div></div>';
    $('#timerhtml').html('<span id="timers">Time Left : 0/60</span>');
    for (var i = 0; i < tableData.length; i++) {
        if (i < tableData[i].dsplynoofques)
            rShowHide = "block";
        else
            rShowHide = "none";
        if (counter == i) {

            var uploadfile = (tableData[i].UploadFile != null ? tableData[i].UploadFile.substring(tableData[i].UploadFile.length - 3) : '');
            qnostatus += ' <a onclick="javascript:fnGoToQuestion(' + (i + 1) + ',' + totalnoofq + ');" id="pq' + (i + 1) + '" class=' + tableData[i].OPTION_name + '>' + (i + 1) + '</a>';
            htmlContent += '<div  id="divq' + (i + 1) + '" style="display:' + rShowHide + ';">' + (tableData[i].que_typeID == 1 ? '<ol><li class="mock-q"><span>' + (i + 1) + '. </span>' + (tableData[i].QNS_ENG != '' ? '<span>' + tableData[i].QNS_ENG + '</span>' : '') + '' + (tableData[i].QNS_HND != '' ? '</br><span>' + tableData[i].QNS_HND + '</span>' : '') + '' + (tableData[i].QNS_OTH != '' ? '</br><span>' + tableData[i].QNS_OTH + '</span>' : '') + '</li></ol>' : tableData[i].que_typeID == 2 ? '<ol><li class="mock-q"><span>' + (i + 1) + '. </span><span><audio controls><source src="' + tableData[i].QNS_ENG + '" type="audio/mpeg"></audio></span></br><span><audio controls><source src="' + tableData[i].QNS_HND + '" type="audio/mpeg"></audio></span></br><span><audio controls><source src="' + tableData[i].QNS_OTH + '" type="audio/mpeg"></audio></span></li></ol>' : tableData[i].que_typeID == 3 ? '<ol><li class="mock-q"><span>' + (i + 1) + '. </span><span><video width="600" autoplay loop muted><source src="' + tableData[i].QNS_ENG + '" type="video/mp4"></video></span></br><span><video width="600" autoplay loop muted><source src="' + tableData[i].QNS_HND + '" type="video/mp4"></video></span></br><span><video width="600" autoplay loop muted><source src="' + tableData[i].QNS_OTH + '" type="video/mp4"></video></span></li></ol>' : tableData[i].que_typeID == 4 ? '<ol><li class="mock-q"><span>' + (i + 1) + '. </span><span><img src="' + tableData[i].QNS_ENG + '"></span></br><span><img src="' + tableData[i].QNS_HND + '"></span></br><span><img src="' + tableData[i].QNS_OTH + '"></span></li></ol>' : '') + '' + (uploadfile != '' && uploadfile == "mp4" && tableData[i].QUES_RANDOM_NO != null && tableData[i].UploadFile != "noPhoto.png" ? '<div class="mock-q-pic"><video width="600" autoplay loop muted><source src="' + tableData[i].UploadFile_Path + '" type="video/mp4"></video></div>' : uploadfile != '' && uploadfile == "mp3" && tableData[i].QUES_RANDOM_NO != null && tableData[i].UploadFile != "noPhoto.png" ? '<div class="mock-q-pic"><audio controls><source src="' + tableData[i].UploadFile_Path + '" type="audio/mpeg"></audio></div>' : uploadfile != '' && tableData[i].QUES_RANDOM_NO != null && uploadfile == "jpg" || uploadfile == "jpeg" || uploadfile == "gif" && tableData[i].UploadFile != "noPhoto.png" ? '<div class="mock-q-pic"><img src="' + tableData[i].UploadFile_Path + '"></div>' : uploadfile != '' && tableData[i].QUES_RANDOM_NO != null && uploadfile == "png" && tableData[i].UploadFile != "noPhoto.png" ? '<div class="mock-q-pic"><img src="' + tableData[i].UploadFile_Path + '"></div>' : '') + '<div class="mock-option" id="one"><input name="option' + (i + 1) + '"    type="radio" value="' + tableData[i].OPT_ENG1 + '" onclick="fnChkQStatus(' + (i + 1) + '),fnOptionEndExam(' + (i + 1) + ',' + (counter + 1) + ',' + tableData[i].QNS_ID + ',1)" ' + tableData[i].selt1 + ' /><label for="one">' + (tableData[i].op_typeID_01 == 1 ? '<span>' + tableData[i].OPT_ENG1 + '</span><span>' + tableData[i].OPT_HND1 + '</span><span>' + tableData[i].OPT_OTH1 + '</span>' : tableData[i].op_typeID_01 == 2 ? '<span>' + (tableData[i].OPT_ENG1_PATH != '' ? '<audio controls><source src="' + tableData[i].OPT_ENG1_PATH + '" type="audio/mpeg"></audio>' : '') + '</span><span>' + (tableData[i].OPT_HND1_PATH != '' ? '<audio controls><source src="' + tableData[i].OPT_HND1_PATH + '" type="audio/mpeg"></audio>' : '') + '</span><span>' + (tableData[i].OPT_OTH1_PATH != '' ? '<audio controls><source src="' + tableData[i].OPT_OTH1_PATH + '" type="audio/mpeg"></audio>' : '') + '</span>' : tableData[i].op_typeID_01 == 3 ? '<span>' + (tableData[i].OPT_ENG1_PATH != '' ? '<video width="600" autoplay loop muted><source src="' + tableData[i].OPT_ENG1_PATH + '" type="video/mp4"></video>' : '') + '</span><span>' + (tableData[i].OPT_HND1_PATH != '' ? '<video width="600" autoplay loop muted><source src="' + tableData[i].OPT_HND1_PATH + '" type="video/mp4"></video>' : '') + '</span><span>' + (tableData[i].OPT_OTH1_PATH != '' ? '<video width="600" autoplay loop muted><source src="' + tableData[i].OPT_OTH1_PATH + '" type="video/mp4"></video>' : '') + '</span>' : tableData[i].op_typeID_01 == 4 ? '<span>' + (tableData[i].OPT_ENG1_PATH != '' ? '<div class="mock-q-pic"><img src="' + tableData[i].OPT_ENG1_PATH + '"></div>' : '') + '</span><span>' + (tableData[i].OPT_HND1_PATH != '' ? '<div class="mock-q-pic"><img src="' + tableData[i].OPT_HND1_PATH + '"></div>' : '') + '</span><span>' + (tableData[i].OPT_OTH1_PATH != '' ? '<div class="mock-q-pic"><img src="' + tableData[i].OPT_OTH1_PATH + '"></div>' : '') + '</span>' : tableData[i].op_typeID_01 == 5 ? '<span>' + tableData[i].OPT_ENG1 + '</span><span>' + tableData[i].OPT_HND1 + '</span><span>' + tableData[i].OPT_OTH1 + '</span>' : '') + '</label></div><div class="mock-option" id="one"><input name="option' + (i + 1) + '"  onclick="fnChkQStatus(' + (i + 1) + '),fnOptionEndExam(' + (i + 1) + ',' + (counter + 1) + ',' + tableData[i].QNS_ID + ',2)" type="radio" value="' + tableData[i].OPT_ENG2 + '"   ' + tableData[i].selt2 + ' /><label for="one">' + (tableData[i].op_typeID_02 == 1 ? '<span>' + tableData[i].OPT_ENG2 + '</span><span>' + tableData[i].OPT_HND2 + '</span><span>' + tableData[i].OPT_OTH2 + '</span>' : tableData[i].op_typeID_02 == 2 ? '<span>' + (tableData[i].OPT_ENG2_PATH != '' ? '<audio controls><source src="' + tableData[i].OPT_ENG2_PATH + '" type="audio/mpeg"></audio>' : '') + '</span><span>' + (tableData[i].OPT_HND2_PATH != '' ? '<audio controls><source src="' + tableData[i].OPT_HND2_PATH + '" type="audio/mpeg"></audio>' : '') + '</span><span>' + (tableData[i].OPT_OTH2_PATH != '' ? '<audio controls><source src="' + tableData[i].OPT_OTH2_PATH + '" type="audio/mpeg"></audio>' : '') + '</span>' : tableData[i].op_typeID_02 == 3 ? '<span>' + (tableData[i].OPT_ENG2_PATH != '' ? '<video width="600" autoplay loop muted><source src="' + tableData[i].OPT_ENG2_PATH + '" type="video/mp4"></video>' : '') + '</span><span>' + (tableData[i].OPT_HND2_PATH != '' ? '<video width="600" autoplay loop muted><source src="' + tableData[i].OPT_HND2_PATH + '" type="video/mp4"></video>' : '') + '</span><span>' + (tableData[i].OPT_OTH2_PATH != '' ? '<video width="600" autoplay loop muted><source src="' + tableData[i].OPT_OTH2_PATH + '" type="video/mp4"></video>' : '') + '</span>' : tableData[i].op_typeID_02 == 4 ? '<span>' + (tableData[i].OPT_ENG2_PATH != '' ? '<div class="mock-q-pic"><img src="' + tableData[i].OPT_ENG2_PATH + '"></div>' : '') + '</span><span>' + (tableData[i].OPT_HND2_PATH != '' ? '<div class="mock-q-pic"><img src="' + tableData[i].OPT_HND2_PATH + '"></div>' : '') + '</span><span>' + (tableData[i].OPT_OTH2_PATH != '' ? '<div class="mock-q-pic"><img src="' + tableData[i].OPT_OTH2_PATH + '"></div>' : '') + '</span>' : tableData[i].op_typeID_02 == 5 ? '<span>' + tableData[i].OPT_ENG2 + '</span><span>' + tableData[i].OPT_HND2 + '</span><span>' + tableData[i].OPT_OTH2 + '</span>' : '') + '</label></div>' + (tableData[i].OPTION_TYPE_NO == 3 || tableData[i].OPTION_TYPE_NO == 4 || tableData[i].OPTION_TYPE_NO == 5 || tableData[i].OPTION_TYPE_NO == 6 || tableData[i].OPTION_TYPE_NO == 7 ? '<div class="mock-option" id="one"><input name="option' + (i + 1) + '"  onclick="fnChkQStatus(' + (i + 1) + '),fnOptionEndExam(' + (i + 1) + ',' + (counter + 1) + ',' + tableData[i].QNS_ID + ',3)" type="radio" value="' + tableData[i].OPT_ENG3 + '"  ' + tableData[i].selt3 + ' /><label for="one">' + (tableData[i].op_typeID_03 == 1 ? '<span>' + tableData[i].OPT_ENG3 + '</span><span>' + tableData[i].OPT_HND3 + '</span><span>' + tableData[i].OPT_OTH3 + '</span>' : tableData[i].op_typeID_03 == 2 ? '<span>' + (tableData[i].OPT_ENG3_PATH != '' ? '<audio controls><source src="' + tableData[i].OPT_ENG3_PATH + '" type="audio/mpeg"></audio>' : '') + '</span><span>' + (tableData[i].OPT_HND3_PATH != '' ? '<audio controls><source src="' + tableData[i].OPT_HND3_PATH + '" type="audio/mpeg"></audio>' : '') + '</span><span>' + (tableData[i].OPT_OTH3_PATH != '' ? '<audio controls><source src="' + tableData[i].OPT_OTH3_PATH + '" type="audio/mpeg"></audio>' : '') + '</span>' : tableData[i].op_typeID_03 == 3 ? '<span>' + (tableData[i].OPT_ENG3_PATH != '' ? '<video width="600" autoplay loop muted><source src="' + tableData[i].OPT_ENG3_PATH + '" type="video/mp4"></video>' : '') + '</span><span>' + (tableData[i].OPT_HND3_PATH != '' ? '<video width="600" autoplay loop muted><source src="' + tableData[i].OPT_HND3_PATH + '" type="video/mp4"></video>' : '') + '</span><span>' + (tableData[i].OPT_OTH3_PATH != '' ? '<video width="600" autoplay loop muted><source src="' + tableData[i].OPT_OTH3_PATH + '" type="video/mp4"></video>' : '') + '</span>' : tableData[i].op_typeID_03 == 4 ? '<span>' + (tableData[i].OPT_ENG3_PATH != '' ? '<div class="mock-q-pic"><img src="' + tableData[i].OPT_ENG3_PATH + '"></div>' : '') + '</span><span>' + (tableData[i].OPT_HND3_PATH != '' ? '<div class="mock-q-pic"><img src="' + tableData[i].OPT_HND3_PATH + '"></div>' : '') + '</span><span>' + (tableData[i].OPT_OTH3_PATH != '' ? '<div class="mock-q-pic"><img src="' + tableData[i].OPT_OTH3_PATH + '"></div>' : '') + '</span>' : '') + '</label></div>' : '') + (tableData[i].OPTION_TYPE_NO == 4 || tableData[i].OPTION_TYPE_NO == 5 || tableData[i].OPTION_TYPE_NO == 6 || tableData[i].OPTION_TYPE_NO == 7 ? '<div class="mock-option" id="one"><input name="option' + (i + 1) + '"  onclick="fnChkQStatus(' + (i + 1) + '),fnOptionEndExam(' + (i + 1) + ',' + (counter + 1) + ',' + tableData[i].QNS_ID + ',4)" type="radio" value="' + tableData[i].OPT_ENG4 + '" ' + tableData[i].selt4 + ' /><label for="one">' + (tableData[i].op_typeID_04 == 1 ? '<span>' + tableData[i].OPT_ENG4 + '</span><span>' + tableData[i].OPT_HND4 + '</span><span>' + tableData[i].OPT_OTH4 + '</span>' : tableData[i].op_typeID_04 == 2 ? '<span>' + (tableData[i].OPT_ENG4_PATH != '' ? '<audio controls><source src="' + tableData[i].OPT_ENG4_PATH + '" type="audio/mpeg"></audio>' : '') + '</span><span>' + (tableData[i].OPT_HND4_PATH != '' ? '<audio controls><source src="' + tableData[i].OPT_HND4_PATH + '" type="audio/mpeg"></audio>' : '') + '</span><span>' + (tableData[i].OPT_OTH4_PATH != '' ? '<audio controls><source src="' + tableData[i].OPT_OTH4_PATH + '" type="audio/mpeg"></audio>' : '') + '</span>' : tableData[i].op_typeID_04 == 3 ? '<span>' + (tableData[i].OPT_ENG4_PATH != '' ? '<video width="600" autoplay loop muted><source src="' + tableData[i].OPT_ENG4_PATH + '" type="video/mp4"></video>' : '') + '</span><span>' + (tableData[i].OPT_HND4_PATH != '' ? '<video width="600" autoplay loop muted><source src="' + tableData[i].OPT_HND4_PATH + '" type="video/mp4"></video>' : '') + '</span><span>' + (tableData[i].OPT_OTH4_PATH != '' ? '<video width="600" autoplay loop muted><source src="' + tableData[i].OPT_OTH4_PATH + '" type="video/mp4"></video>' : '') + '</span>' : tableData[i].op_typeID_04 == 4 ? '<span>' + (tableData[i].OPT_ENG4_PATH != '' ? '<div class="mock-q-pic"><img src="' + tableData[i].OPT_ENG4_PATH + '"></div>' : '') + '</span><span>' + (tableData[i].OPT_HND4_PATH != '' ? '<div class="mock-q-pic"><img src="' + tableData[i].OPT_HND4_PATH + '"></div>' : '') + '</span><span>' + (tableData[i].OPT_OTH4_PATH != '' ? '<div class="mock-q-pic"><img src="' + tableData[i].OPT_OTH4_PATH + '"></div>' : '') + '</span>' : '') + '</label></div>' : '') + (tableData[i].OPTION_TYPE_NO == 5 || tableData[i].OPTION_TYPE_NO == 6 || tableData[i].OPTION_TYPE_NO == 7 ? '<div class="mock-option" id="one"><input name="option' + (i + 1) + '"  onclick="fnChkQStatus(' + (i + 1) + '),fnOptionEndExam(' + (i + 1) + ',' + (counter + 1) + ',' + tableData[i].QNS_ID + ',5)" type="radio" value="' + tableData[i].OPT_ENG5 + '" ' + tableData[i].selt5 + ' /><label for="one">' + (tableData[i].OP_TYPEID_05 == 1 ? '<span>' + tableData[i].OPT_ENG5 + '</span><span>' + tableData[i].OPT_HIND5 + '</span><span>' + tableData[i].OPT_OTH5 + '</span>' : tableData[i].OP_TYPEID_05 == 2 ? '<span>' + (tableData[i].OPT_ENG5_PATH != '' ? '<audio controls><source src="' + tableData[i].OPT_ENG5_PATH + '" type="audio/mpeg"></audio>' : '') + '</span><span>' + (tableData[i].OPT_HND5_PATH != '' ? '<audio controls><source src="' + tableData[i].OPT_HND5_PATH + '" type="audio/mpeg"></audio>' : '') + '</span><span>' + (tableData[i].OPT_OTH5_PATH != '' ? '<audio controls><source src="' + tableData[i].OPT_OTH5_PATH + '" type="audio/mpeg"></audio>' : '') + '</span>' : tableData[i].OP_TYPEID_05 == 3 ? '<span>' + (tableData[i].OPT_ENG5_PATH != '' ? '<video width="600" autoplay loop muted><source src="' + tableData[i].OPT_ENG5_PATH + '" type="video/mp4"></video>' : '') + '</span><span>' + (tableData[i].OPT_HND5_PATH != '' ? '<video width="600" autoplay loop muted><source src="' + tableData[i].OPT_HND5_PATH + '" type="video/mp4"></video>' : '') + '</span><span>' + (tableData[i].OPT_OTH5_PATH != '' ? '<video width="600" autoplay loop muted><source src="' + tableData[i].OPT_OTH5_PATH + '" type="video/mp4"></video>' : '') + '</span>' : tableData[i].OP_TYPEID_05 == 4 ? '<span>' + (tableData[i].OPT_ENG5_PATH != '' ? '<div class="mock-q-pic"><img src="' + tableData[i].OPT_ENG5_PATH + '"></div>' : '') + '</span><span>' + (tableData[i].OPT_HND5_PATH != '' ? '<div class="mock-q-pic"><img src="' + tableData[i].OPT_HND5_PATH + '"></div>' : '') + '</span><span>' + (tableData[i].OPT_OTH5_PATH != '' ? '<div class="mock-q-pic"><img src="' + tableData[i].OPT_OTH5_PATH + '"></div>' : '') + '</span>' : '') + '</label></div>' : '') + (tableData[i].OPTION_TYPE_NO == 6 || tableData[i].OPTION_TYPE_NO == 7 ? '<div class="mock-option" id="one"><input name="option' + (i + 1) + '"  onclick="fnChkQStatus(' + (i + 1) + '),fnOptionEndExam(' + (i + 1) + ',' + (counter + 1) + ',' + tableData[i].QNS_ID + ',6)" type="radio" value="' + tableData[i].OPT_ENG4 + '" ' + tableData[i].selt6 + ' /><label for="one">' + (tableData[i].OP_TYPEID_06 == 1 ? '<span>' + tableData[i].OPT_ENG6 + '</span><span>' + tableData[i].OPT_HIND6 + '</span><span>' + tableData[i].OPT_OTH6 + '</span>' : tableData[i].OP_TYPEID_06 == 2 ? '<span>' + (tableData[i].OPT_ENG6_PATH != '' ? '<audio controls><source src="' + tableData[i].OPT_ENG6_PATH + '" type="audio/mpeg"></audio>' : '') + '</span><span>' + (tableData[i].OPT_HND6_PATH != '' ? '<audio controls><source src="' + tableData[i].OPT_HND6_PATH + '" type="audio/mpeg"></audio>' : '') + '</span><span>' + (tableData[i].OPT_OTH6_PATH != '' ? '<audio controls><source src="' + tableData[i].OPT_OTH6_PATH + '" type="audio/mpeg"></audio>' : '') + '</span>' : tableData[i].OP_TYPEID_06 == 3 ? '<span>' + (tableData[i].OPT_ENG6_PATH != '' ? '<video width="600" autoplay loop muted><source src="' + tableData[i].OPT_ENG6_PATH + '" type="video/mp4"></video>' : '') + '</span><span>' + (tableData[i].OPT_HND6_PATH != '' ? '<video width="600" autoplay loop muted><source src="' + tableData[i].OPT_HND6_PATH + '" type="video/mp4"></video>' : '') + '</span><span>' + (tableData[i].OPT_OTH6_PATH != '' ? '<video width="600" autoplay loop muted><source src="' + tableData[i].OPT_OTH6_PATH + '" type="video/mp4"></video>' : '') + '</span>' : tableData[i].OP_TYPEID_06 == 4 ? '<span>' + (tableData[i].OPT_ENG6_PATH != '' ? '<div class="mock-q-pic"><img src="' + tableData[i].OPT_ENG6_PATH + '"></div>' : '') + '</span><span>' + (tableData[i].OPT_HND6_PATH != '' ? '<div class="mock-q-pic"><img src="' + tableData[i].OPT_HND6_PATH + '"></div>' : '') + '</span><span>' + (tableData[i].OPT_OTH6_PATH != '' ? '<div class="mock-q-pic"><img src="' + tableData[i].OPT_OTH6_PATH + '"></div>' : '') + '</span>' : '') + '</label></div>' : '') + (tableData[i].OPTION_TYPE_NO == 7 ? '<div class="mock-option" id="one"><input name="option' + (i + 1) + '"  onclick="fnChkQStatus(' + (i + 1) + '),fnOptionEndExam(' + (i + 1) + ',' + (counter + 1) + ',' + tableData[i].QNS_ID + ',7)" type="radio" value="' + tableData[i].OPT_ENG4 + '" ' + tableData[i].selt7 + ' /><label for="one">' + (tableData[i].OP_TYPEID_07 == 1 ? '<span>' + tableData[i].OPT_ENG7 + '</span><span>' + tableData[i].OPT_HIND7 + '</span><span>' + tableData[i].OPT_OTH7 + '</span>' : tableData[i].OP_TYPEID_07 == 2 ? '<span>' + (tableData[i].OPT_ENG7_PATH != '' ? '<audio controls><source src="' + tableData[i].OPT_ENG7_PATH + '" type="audio/mpeg"></audio>' : '') + '</span><span>' + (tableData[i].OPT_HND7_PATH != '' ? '<audio controls><source src="' + tableData[i].OPT_HND7_PATH + '" type="audio/mpeg"></audio>' : '') + '</span><span>' + (tableData[i].OPT_OTH7_PATH != '' ? '<audio controls><source src="' + tableData[i].OPT_OTH7_PATH + '" type="audio/mpeg"></audio>' : '') + '</span>' : tableData[i].OP_TYPEID_07 == 3 ? '<span>' + (tableData[i].OPT_ENG7_PATH != '' ? '<video width="600" autoplay loop muted><source src="' + tableData[i].OPT_ENG7_PATH + '" type="video/mp4"></video>' : '') + '</span><span>' + (tableData[i].OPT_HND7_PATH != '' ? '<video width="600" autoplay loop muted><source src="' + tableData[i].OPT_HND7_PATH + '" type="video/mp4"></video>' : '') + '</span><span>' + (tableData[i].OPT_OTH7_PATH != '' ? '<video width="600" autoplay loop muted><source src="' + tableData[i].OPT_OTH7_PATH + '" type="video/mp4"></video>' : '') + '</span>' : tableData[i].OP_TYPEID_07 == 4 ? '<span>' + (tableData[i].OPT_ENG7_PATH != '' ? '<div class="mock-q-pic"><img src="' + tableData[i].OPT_ENG7_PATH + '"></div>' : '') + '</span><span>' + (tableData[i].OPT_HND7_PATH != '' ? '<div class="mock-q-pic"><img src="' + tableData[i].OPT_HND7_PATH + '"></div>' : '') + '</span><span>' + (tableData[i].OPT_OTH7_PATH != '' ? '<div class="mock-q-pic"><img src="' + tableData[i].OPT_OTH7_PATH + '"></div>' : '') + '</span>' : '') + '</label></div>' : '') + '<input type="hidden" id="hdfRightAns' + (i + 1) + '" value="' + encryptData(tableData[i].RIGHT_ANS, '1234') + '"><input type="hidden" id="hdfqus' + (i + 1) + '" value="' + tableData[i].QNS_ID + '">';


            if (i == totalnoofq - 1)
                htmlContent += '<div class="mock-btn" style="margin-top: 20px;"><a name="next" class="next"  onclick="fnEndExam(' + (i + 1) + ',' + (counter + 1) + ',' + tableData[i].TIME + ')" ><span style="margin-left: -8px;">End the Exam</span><br /><span> परीक्षा समाप्त करें</span></a></div><input type="hidden" id="hdfFirstQ' + (counter + 1) + '" value="' + (counter + 1) + '" /><input type="hidden" id="hdfLastQ' + (counter + 1) + '" value="' + (i + 1) + '" /></div></div>';

            //CountTime(tableData[i].TIME, (i + 1), (counter + 1), 1);
        }
        else {
            var uploadfile = (tableData[i].UploadFile != null ? tableData[i].UploadFile.substring(tableData[i].UploadFile.length - 3) : '');
            htmlContent += '<div id="divq' + (i + 1) + '">' + (tableData[i].que_typeID == 1 ? '<ol><li class="mock-q"><span>' + (i + 1) + '. </span>' + (tableData[i].QNS_ENG != '' ? '<span>' + tableData[i].QNS_ENG + '</span>' : '') + '' + (tableData[i].QNS_HND != '' ? '</br><span>' + tableData[i].QNS_HND + '</span>' : '') + '' + (tableData[i].QNS_OTH != '' ? '</br><span>' + tableData[i].QNS_OTH + '</span>' : '') + '</li></ol>' : tableData[i].que_typeID == 2 ? '<ol><li class="mock-q"><span>' + (i + 1) + '. </span><span><audio controls><source src="' + tableData[i].QNS_ENG + '" type="audio/mpeg"></audio></span></br><span><audio controls><source src="' + tableData[i].QNS_HND + '" type="audio/mpeg"></audio></span></br><span><audio controls><source src="' + tableData[i].QNS_OTH + '" type="audio/mpeg"></audio></span></li></ol>' : tableData[i].que_typeID == 3 ? '<ol><li class="mock-q"><span>' + (i + 1) + '. </span><span><video width="600" autoplay loop muted><source src="' + tableData[i].QNS_ENG + '" type="video/mp4"></video></span></br><span><video width="600" autoplay loop muted><source src="' + tableData[i].QNS_HND + '" type="video/mp4"></video></span></br><span><video width="600" autoplay loop muted><source src="' + tableData[i].QNS_OTH + '" type="video/mp4"></video></span></li></ol>' : tableData[i].que_typeID == 4 ? '<ol><li class="mock-q"><span>' + (i + 1) + '. </span><span><img src="' + tableData[i].QNS_ENG + '"></span></br><span><img src="' + tableData[i].QNS_HND + '"></span></br><span><img src="' + tableData[i].QNS_OTH + '"></span></li></ol>' : '') + '' + (uploadfile != '' && uploadfile == "mp4" && tableData[i].QUES_RANDOM_NO != null && tableData[i].UploadFile != "noPhoto.png" ? '<div class="mock-q-pic"><video width="600" autoplay loop muted><source src="' + tableData[i].UploadFile_Path + '" type="video/mp4"></video></div>' : uploadfile != '' && uploadfile == "mp3" && tableData[i].QUES_RANDOM_NO != null && tableData[i].UploadFile != "noPhoto.png" ? '<div class="mock-q-pic"><audio controls><source src="' + tableData[i].UploadFile_Path + '" type="audio/mpeg"></audio></div>' : uploadfile != '' && tableData[i].QUES_RANDOM_NO != null && uploadfile == "jpg" || uploadfile == "jpeg" || uploadfile == "gif" && tableData[i].UploadFile != "noPhoto.png" ? '<div class="mock-q-pic"><img src="' + tableData[i].UploadFile_Path + '"></div>' : uploadfile != '' && tableData[i].QUES_RANDOM_NO != null && uploadfile == "png" && tableData[i].UploadFile != "noPhoto.png" ? '<div class="mock-q-pic"><img src="' + tableData[i].UploadFile_Path + '"></div>' : '') + '<div class="mock-option" id="one"><input name="option' + (i + 1) + '"    type="radio" value="' + tableData[i].OPT_ENG1 + '" onclick="fnChkQStatus(' + (i + 1) + '),fnOptionEndExam(' + (i + 1) + ',' + (counter + 1) + ',' + tableData[i].QNS_ID + ',1)" ' + tableData[i].selt1 + ' /><label for="one">' + (tableData[i].op_typeID_01 == 1 ? '<span>' + tableData[i].OPT_ENG1 + '</span><span>' + tableData[i].OPT_HND1 + '</span><span>' + tableData[i].OPT_OTH1 + '</span>' : tableData[i].op_typeID_01 == 2 ? '<span>' + (tableData[i].OPT_ENG1_PATH != '' ? '<audio controls><source src="' + tableData[i].OPT_ENG1_PATH + '" type="audio/mpeg"></audio>' : '') + '</span><span>' + (tableData[i].OPT_HND1_PATH != '' ? '<audio controls><source src="' + tableData[i].OPT_HND1_PATH + '" type="audio/mpeg"></audio>' : '') + '</span><span>' + (tableData[i].OPT_OTH1_PATH != '' ? '<audio controls><source src="' + tableData[i].OPT_OTH1_PATH + '" type="audio/mpeg"></audio>' : '') + '</span>' : tableData[i].op_typeID_01 == 3 ? '<span>' + (tableData[i].OPT_ENG1_PATH != '' ? '<video width="600" autoplay loop muted><source src="' + tableData[i].OPT_ENG1_PATH + '" type="video/mp4"></video>' : '') + '</span><span>' + (tableData[i].OPT_HND1_PATH != '' ? '<video width="600" autoplay loop muted><source src="' + tableData[i].OPT_HND1_PATH + '" type="video/mp4"></video>' : '') + '</span><span>' + (tableData[i].OPT_OTH1_PATH != '' ? '<video width="600" autoplay loop muted><source src="' + tableData[i].OPT_OTH1_PATH + '" type="video/mp4"></video>' : '') + '</span>' : tableData[i].op_typeID_01 == 4 ? '<span>' + (tableData[i].OPT_ENG1_PATH != '' ? '<div class="mock-q-pic"><img src="' + tableData[i].OPT_ENG1_PATH + '"></div>' : '') + '</span><span>' + (tableData[i].OPT_HND1_PATH != '' ? '<div class="mock-q-pic"><img src="' + tableData[i].OPT_HND1_PATH + '"></div>' : '') + '</span><span>' + (tableData[i].OPT_OTH1_PATH != '' ? '<div class="mock-q-pic"><img src="' + tableData[i].OPT_OTH1_PATH + '"></div>' : '') + '</span>' : tableData[i].op_typeID_01 == 5 ? '<span>' + tableData[i].OPT_ENG1 + '</span><span>' + tableData[i].OPT_HND1 + '</span><span>' + tableData[i].OPT_OTH1 + '</span>' : '') + '</label></div><div class="mock-option" id="one"><input name="option' + (i + 1) + '"  onclick="fnChkQStatus(' + (i + 1) + '),fnOptionEndExam(' + (i + 1) + ',' + (counter + 1) + ',' + tableData[i].QNS_ID + ',2)" type="radio" value="' + tableData[i].OPT_ENG2 + '"   ' + tableData[i].selt2 + ' /><label for="one">' + (tableData[i].op_typeID_02 == 1 ? '<span>' + tableData[i].OPT_ENG2 + '</span><span>' + tableData[i].OPT_HND2 + '</span><span>' + tableData[i].OPT_OTH2 + '</span>' : tableData[i].op_typeID_02 == 2 ? '<span>' + (tableData[i].OPT_ENG2_PATH != '' ? '<audio controls><source src="' + tableData[i].OPT_ENG2_PATH + '" type="audio/mpeg"></audio>' : '') + '</span><span>' + (tableData[i].OPT_HND2_PATH != '' ? '<audio controls><source src="' + tableData[i].OPT_HND2_PATH + '" type="audio/mpeg"></audio>' : '') + '</span><span>' + (tableData[i].OPT_OTH2_PATH != '' ? '<audio controls><source src="' + tableData[i].OPT_OTH2_PATH + '" type="audio/mpeg"></audio>' : '') + '</span>' : tableData[i].op_typeID_02 == 3 ? '<span>' + (tableData[i].OPT_ENG2_PATH != '' ? '<video width="600" autoplay loop muted><source src="' + tableData[i].OPT_ENG2_PATH + '" type="video/mp4"></video>' : '') + '</span><span>' + (tableData[i].OPT_HND2_PATH != '' ? '<video width="600" autoplay loop muted><source src="' + tableData[i].OPT_HND2_PATH + '" type="video/mp4"></video>' : '') + '</span><span>' + (tableData[i].OPT_OTH2_PATH != '' ? '<video width="600" autoplay loop muted><source src="' + tableData[i].OPT_OTH2_PATH + '" type="video/mp4"></video>' : '') + '</span>' : tableData[i].op_typeID_02 == 4 ? '<span>' + (tableData[i].OPT_ENG2_PATH != '' ? '<div class="mock-q-pic"><img src="' + tableData[i].OPT_ENG2_PATH + '"></div>' : '') + '</span><span>' + (tableData[i].OPT_HND2_PATH != '' ? '<div class="mock-q-pic"><img src="' + tableData[i].OPT_HND2_PATH + '"></div>' : '') + '</span><span>' + (tableData[i].OPT_OTH2_PATH != '' ? '<div class="mock-q-pic"><img src="' + tableData[i].OPT_OTH2_PATH + '"></div>' : '') + '</span>' : tableData[i].op_typeID_02 == 5 ? '<span>' + tableData[i].OPT_ENG2 + '</span><span>' + tableData[i].OPT_HND2 + '</span><span>' + tableData[i].OPT_OTH2 + '</span>' : '') + '</label></div>' + (tableData[i].OPTION_TYPE_NO == 3 || tableData[i].OPTION_TYPE_NO == 4 || tableData[i].OPTION_TYPE_NO == 5 || tableData[i].OPTION_TYPE_NO == 6 || tableData[i].OPTION_TYPE_NO == 7 ? '<div class="mock-option" id="one"><input name="option' + (i + 1) + '"  onclick="fnChkQStatus(' + (i + 1) + '),fnOptionEndExam(' + (i + 1) + ',' + (counter + 1) + ',' + tableData[i].QNS_ID + ',3)" type="radio" value="' + tableData[i].OPT_ENG3 + '"  ' + tableData[i].selt3 + ' /><label for="one">' + (tableData[i].op_typeID_03 == 1 ? '<span>' + tableData[i].OPT_ENG3 + '</span><span>' + tableData[i].OPT_HND3 + '</span><span>' + tableData[i].OPT_OTH3 + '</span>' : tableData[i].op_typeID_03 == 2 ? '<span>' + (tableData[i].OPT_ENG3_PATH != '' ? '<audio controls><source src="' + tableData[i].OPT_ENG3_PATH + '" type="audio/mpeg"></audio>' : '') + '</span><span>' + (tableData[i].OPT_HND3_PATH != '' ? '<audio controls><source src="' + tableData[i].OPT_HND3_PATH + '" type="audio/mpeg"></audio>' : '') + '</span><span>' + (tableData[i].OPT_OTH3_PATH != '' ? '<audio controls><source src="' + tableData[i].OPT_OTH3_PATH + '" type="audio/mpeg"></audio>' : '') + '</span>' : tableData[i].op_typeID_03 == 3 ? '<span>' + (tableData[i].OPT_ENG3_PATH != '' ? '<video width="600" autoplay loop muted><source src="' + tableData[i].OPT_ENG3_PATH + '" type="video/mp4"></video>' : '') + '</span><span>' + (tableData[i].OPT_HND3_PATH != '' ? '<video width="600" autoplay loop muted><source src="' + tableData[i].OPT_HND3_PATH + '" type="video/mp4"></video>' : '') + '</span><span>' + (tableData[i].OPT_OTH3_PATH != '' ? '<video width="600" autoplay loop muted><source src="' + tableData[i].OPT_OTH3_PATH + '" type="video/mp4"></video>' : '') + '</span>' : tableData[i].op_typeID_03 == 4 ? '<span>' + (tableData[i].OPT_ENG3_PATH != '' ? '<div class="mock-q-pic"><img src="' + tableData[i].OPT_ENG3_PATH + '"></div>' : '') + '</span><span>' + (tableData[i].OPT_HND3_PATH != '' ? '<div class="mock-q-pic"><img src="' + tableData[i].OPT_HND3_PATH + '"></div>' : '') + '</span><span>' + (tableData[i].OPT_OTH3_PATH != '' ? '<div class="mock-q-pic"><img src="' + tableData[i].OPT_OTH3_PATH + '"></div>' : '') + '</span>' : '') + '</label></div>' : '') + (tableData[i].OPTION_TYPE_NO == 4 || tableData[i].OPTION_TYPE_NO == 5 || tableData[i].OPTION_TYPE_NO == 6 || tableData[i].OPTION_TYPE_NO == 7 ? '<div class="mock-option" id="one"><input name="option' + (i + 1) + '"  onclick="fnChkQStatus(' + (i + 1) + '),fnOptionEndExam(' + (i + 1) + ',' + (counter + 1) + ',' + tableData[i].QNS_ID + ',4)" type="radio" value="' + tableData[i].OPT_ENG4 + '" ' + tableData[i].selt4 + ' /><label for="one">' + (tableData[i].op_typeID_04 == 1 ? '<span>' + tableData[i].OPT_ENG4 + '</span><span>' + tableData[i].OPT_HND4 + '</span><span>' + tableData[i].OPT_OTH4 + '</span>' : tableData[i].op_typeID_04 == 2 ? '<span>' + (tableData[i].OPT_ENG4_PATH != '' ? '<audio controls><source src="' + tableData[i].OPT_ENG4_PATH + '" type="audio/mpeg"></audio>' : '') + '</span><span>' + (tableData[i].OPT_HND4_PATH != '' ? '<audio controls><source src="' + tableData[i].OPT_HND4_PATH + '" type="audio/mpeg"></audio>' : '') + '</span><span>' + (tableData[i].OPT_OTH4_PATH != '' ? '<audio controls><source src="' + tableData[i].OPT_OTH4_PATH + '" type="audio/mpeg"></audio>' : '') + '</span>' : tableData[i].op_typeID_04 == 3 ? '<span>' + (tableData[i].OPT_ENG4_PATH != '' ? '<video width="600" autoplay loop muted><source src="' + tableData[i].OPT_ENG4_PATH + '" type="video/mp4"></video>' : '') + '</span><span>' + (tableData[i].OPT_HND4_PATH != '' ? '<video width="600" autoplay loop muted><source src="' + tableData[i].OPT_HND4_PATH + '" type="video/mp4"></video>' : '') + '</span><span>' + (tableData[i].OPT_OTH4_PATH != '' ? '<video width="600" autoplay loop muted><source src="' + tableData[i].OPT_OTH4_PATH + '" type="video/mp4"></video>' : '') + '</span>' : tableData[i].op_typeID_04 == 4 ? '<span>' + (tableData[i].OPT_ENG4_PATH != '' ? '<div class="mock-q-pic"><img src="' + tableData[i].OPT_ENG4_PATH + '"></div>' : '') + '</span><span>' + (tableData[i].OPT_HND4_PATH != '' ? '<div class="mock-q-pic"><img src="' + tableData[i].OPT_HND4_PATH + '"></div>' : '') + '</span><span>' + (tableData[i].OPT_OTH4_PATH != '' ? '<div class="mock-q-pic"><img src="' + tableData[i].OPT_OTH4_PATH + '"></div>' : '') + '</span>' : '') + '</label></div>' : '') + (tableData[i].OPTION_TYPE_NO == 5 || tableData[i].OPTION_TYPE_NO == 6 || tableData[i].OPTION_TYPE_NO == 7 ? '<div class="mock-option" id="one"><input name="option' + (i + 1) + '"  onclick="fnChkQStatus(' + (i + 1) + '),fnOptionEndExam(' + (i + 1) + ',' + (counter + 1) + ',' + tableData[i].QNS_ID + ',5)" type="radio" value="' + tableData[i].OPT_ENG5 + '" ' + tableData[i].selt5 + ' /><label for="one">' + (tableData[i].OP_TYPEID_05 == 1 ? '<span>' + tableData[i].OPT_ENG5 + '</span><span>' + tableData[i].OPT_HIND5 + '</span><span>' + tableData[i].OPT_OTH5 + '</span>' : tableData[i].OP_TYPEID_05 == 2 ? '<span>' + (tableData[i].OPT_ENG5_PATH != '' ? '<audio controls><source src="' + tableData[i].OPT_ENG5_PATH + '" type="audio/mpeg"></audio>' : '') + '</span><span>' + (tableData[i].OPT_HND5_PATH != '' ? '<audio controls><source src="' + tableData[i].OPT_HND5_PATH + '" type="audio/mpeg"></audio>' : '') + '</span><span>' + (tableData[i].OPT_OTH5_PATH != '' ? '<audio controls><source src="' + tableData[i].OPT_OTH5_PATH + '" type="audio/mpeg"></audio>' : '') + '</span>' : tableData[i].OP_TYPEID_05 == 3 ? '<span>' + (tableData[i].OPT_ENG5_PATH != '' ? '<video width="600" autoplay loop muted><source src="' + tableData[i].OPT_ENG5_PATH + '" type="video/mp4"></video>' : '') + '</span><span>' + (tableData[i].OPT_HND5_PATH != '' ? '<video width="600" autoplay loop muted><source src="' + tableData[i].OPT_HND5_PATH + '" type="video/mp4"></video>' : '') + '</span><span>' + (tableData[i].OPT_OTH5_PATH != '' ? '<video width="600" autoplay loop muted><source src="' + tableData[i].OPT_OTH5_PATH + '" type="video/mp4"></video>' : '') + '</span>' : tableData[i].OP_TYPEID_05 == 4 ? '<span>' + (tableData[i].OPT_ENG5_PATH != '' ? '<div class="mock-q-pic"><img src="' + tableData[i].OPT_ENG5_PATH + '"></div>' : '') + '</span><span>' + (tableData[i].OPT_HND5_PATH != '' ? '<div class="mock-q-pic"><img src="' + tableData[i].OPT_HND5_PATH + '"></div>' : '') + '</span><span>' + (tableData[i].OPT_OTH5_PATH != '' ? '<div class="mock-q-pic"><img src="' + tableData[i].OPT_OTH5_PATH + '"></div>' : '') + '</span>' : '') + '</label></div>' : '') + (tableData[i].OPTION_TYPE_NO == 6 || tableData[i].OPTION_TYPE_NO == 7 ? '<div class="mock-option" id="one"><input name="option' + (i + 1) + '"  onclick="fnChkQStatus(' + (i + 1) + '),fnOptionEndExam(' + (i + 1) + ',' + (counter + 1) + ',' + tableData[i].QNS_ID + ',6)" type="radio" value="' + tableData[i].OPT_ENG4 + '" ' + tableData[i].selt6 + ' /><label for="one">' + (tableData[i].OP_TYPEID_06 == 1 ? '<span>' + tableData[i].OPT_ENG6 + '</span><span>' + tableData[i].OPT_HIND6 + '</span><span>' + tableData[i].OPT_OTH6 + '</span>' : tableData[i].OP_TYPEID_06 == 2 ? '<span>' + (tableData[i].OPT_ENG6_PATH != '' ? '<audio controls><source src="' + tableData[i].OPT_ENG6_PATH + '" type="audio/mpeg"></audio>' : '') + '</span><span>' + (tableData[i].OPT_HND6_PATH != '' ? '<audio controls><source src="' + tableData[i].OPT_HND6_PATH + '" type="audio/mpeg"></audio>' : '') + '</span><span>' + (tableData[i].OPT_OTH6_PATH != '' ? '<audio controls><source src="' + tableData[i].OPT_OTH6_PATH + '" type="audio/mpeg"></audio>' : '') + '</span>' : tableData[i].OP_TYPEID_06 == 3 ? '<span>' + (tableData[i].OPT_ENG6_PATH != '' ? '<video width="600" autoplay loop muted><source src="' + tableData[i].OPT_ENG6_PATH + '" type="video/mp4"></video>' : '') + '</span><span>' + (tableData[i].OPT_HND6_PATH != '' ? '<video width="600" autoplay loop muted><source src="' + tableData[i].OPT_HND6_PATH + '" type="video/mp4"></video>' : '') + '</span><span>' + (tableData[i].OPT_OTH6_PATH != '' ? '<video width="600" autoplay loop muted><source src="' + tableData[i].OPT_OTH6_PATH + '" type="video/mp4"></video>' : '') + '</span>' : tableData[i].OP_TYPEID_06 == 4 ? '<span>' + (tableData[i].OPT_ENG6_PATH != '' ? '<div class="mock-q-pic"><img src="' + tableData[i].OPT_ENG6_PATH + '"></div>' : '') + '</span><span>' + (tableData[i].OPT_HND6_PATH != '' ? '<div class="mock-q-pic"><img src="' + tableData[i].OPT_HND6_PATH + '"></div>' : '') + '</span><span>' + (tableData[i].OPT_OTH6_PATH != '' ? '<div class="mock-q-pic"><img src="' + tableData[i].OPT_OTH6_PATH + '"></div>' : '') + '</span>' : '') + '</label></div>' : '') + (tableData[i].OPTION_TYPE_NO == 7 ? '<div class="mock-option" id="one"><input name="option' + (i + 1) + '"  onclick="fnChkQStatus(' + (i + 1) + '),fnOptionEndExam(' + (i + 1) + ',' + (counter + 1) + ',' + tableData[i].QNS_ID + ',7)" type="radio" value="' + tableData[i].OPT_ENG4 + '" ' + tableData[i].selt7 + ' /><label for="one">' + (tableData[i].OP_TYPEID_07 == 1 ? '<span>' + tableData[i].OPT_ENG7 + '</span><span>' + tableData[i].OPT_HIND7 + '</span><span>' + tableData[i].OPT_OTH7 + '</span>' : tableData[i].OP_TYPEID_07 == 2 ? '<span>' + (tableData[i].OPT_ENG7_PATH != '' ? '<audio controls><source src="' + tableData[i].OPT_ENG7_PATH + '" type="audio/mpeg"></audio>' : '') + '</span><span>' + (tableData[i].OPT_HND7_PATH != '' ? '<audio controls><source src="' + tableData[i].OPT_HND7_PATH + '" type="audio/mpeg"></audio>' : '') + '</span><span>' + (tableData[i].OPT_OTH7_PATH != '' ? '<audio controls><source src="' + tableData[i].OPT_OTH7_PATH + '" type="audio/mpeg"></audio>' : '') + '</span>' : tableData[i].OP_TYPEID_07 == 3 ? '<span>' + (tableData[i].OPT_ENG7_PATH != '' ? '<video width="600" autoplay loop muted><source src="' + tableData[i].OPT_ENG7_PATH + '" type="video/mp4"></video>' : '') + '</span><span>' + (tableData[i].OPT_HND7_PATH != '' ? '<video width="600" autoplay loop muted><source src="' + tableData[i].OPT_HND7_PATH + '" type="video/mp4"></video>' : '') + '</span><span>' + (tableData[i].OPT_OTH7_PATH != '' ? '<video width="600" autoplay loop muted><source src="' + tableData[i].OPT_OTH7_PATH + '" type="video/mp4"></video>' : '') + '</span>' : tableData[i].OP_TYPEID_07 == 4 ? '<span>' + (tableData[i].OPT_ENG7_PATH != '' ? '<div class="mock-q-pic"><img src="' + tableData[i].OPT_ENG7_PATH + '"></div>' : '') + '</span><span>' + (tableData[i].OPT_HND7_PATH != '' ? '<div class="mock-q-pic"><img src="' + tableData[i].OPT_HND7_PATH + '"></div>' : '') + '</span><span>' + (tableData[i].OPT_OTH7_PATH != '' ? '<div class="mock-q-pic"><img src="' + tableData[i].OPT_OTH7_PATH + '"></div>' : '') + '</span>' : '') + '</label></div>' : '') + '<input type="hidden" id="hdfRightAns' + (i + 1) + '" value="' + encryptData(tableData[i].RIGHT_ANS, '1234') + '"><input type="hidden" id="hdfqus' + (i + 1) + '" value="' + tableData[i].QNS_ID + '"></div>';



            qnostatus += '<a onclick="javascript:fnGoToQuestion(' + (counter + 1) + ',' + totalnoofq + ');" id="pq' + (i + 1) + '" class=' + tableData[i].OPTION_name + '>' + (i + 1) + '</a>';

            if (i == totalnoofq - 1) {

                htmlContent += '<div class="mock-btn" style="margin-top: 20px;"><a name="next" class="next"  onclick="fnEndExam(' + (i + 1) + ',' + (counter + 1) + ',' + tableData[i].TIME + ')" ><span style="margin-left: -8px;">End the Exam</span><br /><span> परीक्षा समाप्त करें</span></a></div><input type="hidden" id="hdfFirstQ' + (counter + 1) + '" value="' + (counter + 1) + '" /><input type="hidden" id="hdfLastQ' + (counter + 1) + '" value="' + (i + 1) + '" /></div></div>';

            }
            else {
                if (i == (counter + (tableData[0].dsplynoofques - 1))) {
                    if (counter > (tableData[0].dsplynoofques - 1)) {
                        // htmlContent += '<div class="btnPrev"><a name="next" class="next" style="margin:0px;float:none;background:none;cursor:pointer;"  onclick="fnBack(' + (counter - 4) + ',' + (counter + 1) + ')" ><span style="margin-left: -8px;">Back</span><br /><span>पीछे जाएं</span></a></div>';
                    }
                    htmlContent += '<div class="mock-btn" style="margin-top: 20px;"><a href="JavaScript:void(0)" onclick="fnBackNext1(' + (i + 1) + ',' + (counter + 1) + ',' + tableData[0].dsplynoofques + ')">Next Question &raquo;</a><input type="hidden" id="hdfFirstQ' + (counter + 1) + '" value="' + (counter + 1) + '" /><input type="hidden" id="hdfLastQ' + (counter + 1) + '" value="' + (i + 1) + '" /></div></div>';
                    counter += tableData[0].dsplynoofques;
                }
            }

        }
    }
    //qnostatus += '</div><div id="divEndExam" class="btnPrev"><a name="next" class="next" style="margin:0px;float:none;background:none;cursor:pointer;" onclick="fnEndExam(5,1)"><span style="margin-left: -8px;">End the Exam</span><br><span> परीक्षा समाप्त करें</span></a></div>';
    $('#divQStatus').html(qnostatus);
    document.getElementById('divmainloading').style.display = 'none';
    //htmlContent += '<a href="#"><input name="next" class="next" type="button" value="Next" /></a>';
    $('#divTotalNoOfQ').html("Total Questions : " + tableData[0].dsplynoofques + "/" + totalnoofq);
    $('#pSet').html((tableData[0].SETS).replace("_", " - "));
    $('#divQuestionsAnsSheet').html(htmlContent);
    countDown = setInterval(countTime, 1000);
}

//alert(document.getElementById('ltimess').value);
//var minutes = document.getElementById('ltimess').value;


function fnBack(sId, hId) {
    $('#hdfActiveQSheet').val((sId));
    $('#divq' + hId).hide();
    $('#divq' + sId).show();
    $('#divTotalNoOfQ').html("Total Questions : " + (hId - 1) + "/" + $('#hdfTotalNoOfQ').val());
}
function countTime() {
    seconds--;
    if (seconds == 0) {
        document.getElementById('timers').innerHTML = "Time Left : " + ("0" + minutes).slice(-2) + "/" + ("64");
        if (seconds == 0 && minutes == 0) {
            clearInterval(countDown);
            //$('#divThanks').show();
            //setInterval(function () { alert("Hello"); }, 3000);
            setTimeout(function () {
                fnEndExamss(parseInt($('#hdfLastQ' + $('#hdfActiveQSheet').val() + '').val()), parseInt($('#hdfFirstQ' + $('#hdfActiveQSheet').val() + '').val()))
            }, 3000);
        }
        minutes--;
        seconds = 60;
    } else
        document.getElementById('timers').innerHTML = "Time Left : " + ("0" + minutes).slice(-2) + "/" + ("64");
}
function fnBackNext(sId, fId, totalnoofq, queid) {
    if (capflg == 1) {
        return false;
    }
    //alert("dsa");
    if (sId < totalnoofq) {

        countqno++;
       
        //setCookie("countqno", countqno, 1);
        let captchaflag = parseInt($("#hdfcapt").val());
        let captchatime = parseInt($("#hidcapttime").val());

        if (countqno == captchatime && captchaflag==1) {
            //clearInterval(time_out);
            $('.coverlay').css('display', 'block');
            $('.capt').css('display', 'block');
            setCookie("sId", sId, 1);
            setCookie("fId", fId, 1);
            setCookie("totalnoofq", totalnoofq, 1);
            setCookie("queid", queid, 1);
            fngetnewcode()
            countqno = 0;
            capflg = 1;
            //clearCookie("countqno");
        }
        else { 
            updateQuestiontime(queid);
            $('#hdfActiveQSheet').val((sId + 1));
            $('#divTotalNoOfQ').html("Total Questions : " + (sId + 1) + "/" + document.getElementById('hdfTotalNoOfQ').value);
           
            document.getElementById('divq' + (sId + 1)).style.display = 'block';
            let video = $("#divq" + (sId + 1))
                .find(".mock-q-pic")
                .find("video")
                .removeAttr("muted")
                .get(0); // Get raw DOM video element

            if (video) {
                video.muted = false; // Ensure sound is on
                video.play().catch(function (err) {
                    console.log("Autoplay blocked by browser:", err);
                });
            }
        if (sId > 1) {
            for (var i = 0; i < sId; i++) {

                document.getElementById('divq' + (i + 1)).style.display = 'none';

                let video = $("#divq" + (i + 1))
                    .find(".mock-q-pic")
                    .find("video")
                    .get(0);

                if (video) {
                    video.muted = true; // mute video
                }
            }
        }
        else {
            document.getElementById('divq' + fId).style.display = 'none';

            let video = $("#divq" + fId)
                .find(".mock-q-pic")
                .find("video")
                .get(0);

            if (video) {
                video.muted = true; // mute video
            }
        }
        nextqnsauto = sId;
        if (totalnoofques == nextqnsauto + 1) {
            nextcounterauto = "F";
        }
            window.scrollTo(0, 0);
        }
    }
    else {
        $('#btnendexam').click();
    }
    //CountTime(time, sId, fId);

}


function updateQuestiontime(queid) {
    var jdata = {
        uid: $("#hdfUserId").val(), qnsid: queid, examid: $("#hdfExamId").val() , type: 'updateqnstime'
    }
    url_add = window.location.href;
    var data = url_add.split("://")
    var protocol = data[0];
    data = data[1].split("/");
    var domain = data[0];
    var menuname = data[1] + "/" + data[2];
    var encrp = "";
    var url_add = window.location.protocol + "//" + window.location.host + "/";
    var url = url_add + 'api/ApiServices/QuizApi';

    $.ajax({
        type: "POST",
        url: url,//fnoptionsubmitans
        // url: "/Home/fnoptionsubmitans",//fnoptionsubmitans
        data: { jsonData: JSON.stringify(jdata) },
        dataType: "json",
        success: function (data) {
            document.getElementById('divmainloading').style.display = 'none';

        }, error: function (ex) {
            document.getElementById('divmainloading').style.display = 'none';

        }
    });
}

function fngetnewcode() {
    var url = "/Home/GetCaptcha";
    if (capno == 1) {
        url = "/Home/GetCaptchaDate";
    } else if (capno == 2) {
        url = "/Home/GetCaptchaCalp";
    } else if (capno == 3) {
        url = "/Home/GetCaptchaCalm";
    }
    else if (capno == 4) {
        url = "/Home/GetCaptchaH";
    }
    else if (capno == 5) {
        url = "/Home/GetCaptchaL";
    }
    $.ajax({
        type: "POST",
        //url: "/Home/GetCaptcha",
       // url: "/Home/GetCaptchaCal",
        url: url,
        contentType: 'application/json; charset=utf-8',
        datatype: "json",
        success: function (data) {
            window.scrollTo(0, 0);
            $('#imgcaptcha').attr('src', 'data:image/jpeg;base64,' + data.base64Image);
            
        },
        error: function (ex) {
            swal({
                title: "OOps!",
                text: "Please reload captcha image",
                icon: "error",
                timer: 10000,
            });
            //alert('Please reload captcha image');
        }
    });
    return false;
}

function fnBackNext1(sId, fId, dsplynoofques) {
    $('#hdfActiveQSheet').val((sId + 1));
    var totalnoofq = document.getElementById('hdfTotalNoOfQ').value;
    $('#divTotalNoOfQ').html("Total Questions : " + (sId + dsplynoofques) + "/" + totalnoofq);
    document.getElementById('divq' + fId).style.display = 'none';
    document.getElementById('divq' + (sId + 1)).style.display = 'block';
    window.scrollTo(0, 0);
}
function fnOptionEndExam(sId, fId, QnsId, OptId) {


    goahead = true;

    document.getElementById('divmainloading').style.display = 'block';
    var totalAttempt = 0;
    var correctAns = 0;
    var quesid = "";
    var optin = "";
    var rightans = "";

    for (var i = 1; i <= 75; i++) {

        if ($("input[name='option" + i + "']:checked").length > 0) {
            totalAttempt += 1;
            if (decryptData($('#hdfRightAns' + i).val(), '1234') === $("input[name='option" + i + "']:checked").val()) {
                correctAns += 1;
            }
            rightans = decryptData($('#hdfRightAns' + i).val(), '1234');
        }

    }

    var jdata = {
        rzs: totalAttempt, gzs: correctAns, uid: $("#hdfUserId").val(), qnsid: QnsId, optid: OptId, rightans: rightans, type: 'optsubmitans'
    }
    url_add = window.location.href;
    var data = url_add.split("://")
    var protocol = data[0];
    data = data[1].split("/");
    var domain = data[0];
    var menuname = data[1] + "/" + data[2];
    var encrp = "";
    var url_add = window.location.protocol + "//" + window.location.host + "/";
    var url = url_add + 'api/ApiServices/QuizApi';

    $.ajax({
        type: "POST",
        url: url,//fnoptionsubmitans
        // url: "/Home/fnoptionsubmitans",//fnoptionsubmitans
        data: { jsonData: JSON.stringify(jdata) },
        dataType: "json",
        success: function (data) {
            document.getElementById('divmainloading').style.display = 'none';

        }, error: function (ex) {
            document.getElementById('divmainloading').style.display = 'none';

        }
    });

}
function fnEndExamss(sId, fId) {
    goahead = true;
    document.getElementById('divmainloading').style.display = 'block';
    var totalAttempt = 0;
    var correctAns = 0;
    var quesid = "";
    var optin = "";



    for (var i = 1; i <= 75; i++) {

        if ($("input[name='option" + i + "']:checked").length > 0) {
            totalAttempt += 1;
            if (decryptData($('#hdfRightAns' + i).val(), '1234') == $("input[name='option" + i + "']:checked").val()) {
                correctAns += 1;
            }
        }

    }

    $.ajax({
        type: "POST",
        url: "/Home/fnsubmitans",
        data: '{rzs: ' + JSON.stringify(totalAttempt) + ',gzs:' + JSON.stringify(correctAns) + ',uid: ' + JSON.stringify($('#hdfUserId').val()) + '}',
        contentType: "application/json; charset=utf-8",
        dataType: "json",
        success: function (data) {
            window.location.href = "/Home/score/" + $('#hdfExamId').val() + "";
            document.getElementById('divmainloading').style.display = 'none';

        }, error: function (ex) {
            document.getElementById('divmainloading').style.display = 'none';
            document.location.href = "/";

        }
    });


}

function fnEndExam(sId, fId) {
    if (confirm("Are you sure you want to end the exam?") == true) {

        document.getElementById('divmainloading').style.display = 'block';
        goahead = true;

        var totalAttempt = 0;
        var correctAns = 0;
        var quesid = "";
        var optin = "";

        for (var i = 1; i <= 75; i++) {

            if ($("input[name='option" + i + "']:checked").length > 0) {
                totalAttempt += 1;
                if (decryptData($('#hdfRightAns' + i).val(), '1234') == $("input[name='option" + i + "']:checked").val()) {
                    correctAns += 1;
                }
            }

        }
        var jdata = {
            rzs: totalAttempt, gzs: correctAns, uid: $('#hdfUserId').val(), type: 'submitans'
        }
        url_add = window.location.href;
        var data = url_add.split("://")
        var protocol = data[0];
        data = data[1].split("/");
        var domain = data[0];
        var menuname = data[1] + "/" + data[2];
        var encrp = "";
        var url_add = window.location.protocol + "//" + window.location.host + "/";
        var url = url_add + 'api/ApiServices/QuizApi';

        //var Jdata={
        //     rzs: totalAttempt, gzs: correctAns, uid: $('#hdfUserId').val() 
        //}

        $.ajax({
            type: "POST",
            url: url,
            data: { jsonData: JSON.stringify(jdata) },
            //contentType: "application/json; charset=utf-8",  url: "/Home/fnsubmitans",
            dataType: "json",
            success: function (data) {
                window.location.href = "/Home/score/" + $('#hdfExamId').val() + "";

                document.getElementById('divmainloading').style.display = 'none';

            }, error: function (ex) {
                document.getElementById('divmainloading').style.display = 'none';
                document.location.href = "/";

            }
        });
    }

}

function fnGoToQuestion(dId, totalQ) {
    //$('div [id^="divq"]').hide();

    //$("#divq" + dId).show();
    //$('#divTotalNoOfQ').html('Total Questions : ' + (dId + 4) + '/' + totalQ);
}
function fnfadediv(divid) {
    //  document.getElementById(divid).style.opacity = '0.9';
    return true;
}

function closediv(ids) {
    document.getElementById(ids).style.display = 'none';
    fnEndExam(1, 75);
}
function fnshowmsg(heads, message) {
    document.getElementById('divThanks').style.display = 'block';
    document.getElementById('divthanksheading').innerText = heads;
    document.getElementById('divthanksmsg').innerText = message;
}
function fnlogout() {
    goahead = true;
    $.ajax({
        type: "POST",
        url: "Login.aspx/fnwblogoutuser",
        data: '{}',
        contentType: "application/json; charset=utf-8",
        dataType: "json",
        success: function (response) {
            window.location.href = "Default.aspx";
            //                    window.location.reload();
        }, error: function (ex) {
            window.location.href = "Default.aspx";
        }

    });
    return false;
}
function fnChkQStatus(valn) {
    $('#pq' + valn).removeClass('qleft').addClass('qattempt');
}
$('.mock-btn').click(function () {
    $('.mock-question').css('display', 'none');
    $('.popup').css('display', 'block');
});

function TryOneMoreTime() {
    //fnGetQuestionsonLang();
    window.location.reload();
}