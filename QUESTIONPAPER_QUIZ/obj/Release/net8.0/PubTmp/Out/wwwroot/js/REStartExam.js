
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
function CountTime(time_limit, sId, fId, type) {
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


            //if (totalnoofques == nextqnsauto + 1) {
            //    let milliseconds = time_limit * 1000;
            //    setTimeout(function () {
            //        $('#btnendexam').click();
            //    }, milliseconds);

            //}

        } else {
            $('#timer').html(time_limit);
            time_limit -= 1;
        }
    }, 1000);
}

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



var minutes = 64;
var seconds = 60;
var countDown;
$(document).ready(function () {
    //chkUserParticipatedOrNot();
    // fnGetQuestionsonLang();

    var dropdown = $("#dynamic_select"); // Select the dropdown element
    var optionCount = dropdown.children('option').length; // Get the count of options

    
        $('#welcomeuser').css('display', 'block');
        $('#timerhtml').css('display', 'block');
   
    if (optionCount > 2)
    {
                $('.overlay').css('display', 'block');
                $('.lang-box').css('display', 'block');
            }
    else
    {
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
        url: "/Home/fnGetQuestionsonLangRE",
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
    document.getElementById('divmainloading').style.display = 'block';
    $.ajax({
        type: "POST",
        url: "/Home/fngetquestionsRE",
        data: { uid: $('#hdfUserId').val(), ExamId: $('#hdfExamId').val(), LangId: $('#dynamic_select').val() },
        //contentType: "application/json; charset=utf-8",
        dataType: "json",
        success: function (data) {
            var tableData = JSON.parse(data);
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
            document.getElementById('divmainloading').style.display = 'none';
            //countDown = setInterval(countTime, 1000);
        }, error: function (ex) {
           document.getElementById('divmainloading').style.display = 'none';
            alert('There seems to be something wrong! Please try a again or later.'); /*document.location.href = "Login.aspx";*/
        }
    });
}
$('.popup-close').click(function () {
    $('.lang-box').css('display', 'none');
    $('.overlay').css('display', 'none');
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
            htmlContent += '<div class="mock-btn" style="margin-top: 20px;"><a href="JavaScript:void(0)" class="nextqns_' + i + '" onclick="fnBackNext(' + (i + 1) + ',' + (counter + 1) + ',' + totalnoofq + '), CountTime(' + tableData[i].TIME + ',' + (i + 1) + ',' + (counter + 1) + ',2)">Next Question &raquo;</a><input type="hidden" id="hdfFirstQ' + (counter + 1) + '" value="' + (counter + 1) + '" /><input type="hidden" id="hdfLastQ' + (counter + 1) + '" value="' + (i + 1) + '" /></div></div>';

            CountTime(tableData[i].TIME, (i + 1), (counter + 1), 1);
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
                    htmlContent += '<div class="mock-btn" style="margin-top: 20px;"><a href="JavaScript:void(0)" class="nextqns_' + i + '" onclick="fnBackNext(' + (i + 1) + ',' + (counter + 1) + ',' + totalnoofq + '), CountTime(' + tableData[i].TIME + ',' + (i + 1) + ',' + (counter + 1) + ',3)">Next Question &raquo;</a><input type="hidden" id="hdfFirstQ' + (counter + 1) + '" value="' + (counter + 1) + '" /><input type="hidden" id="hdfLastQ' + (counter + 1) + '" value="' + (i + 1) + '" /></div></div>';
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

            //htmlContent += '<div class="mock-btn" style="margin-top: 20px;"><a href="JavaScript:void(0)" onclick="fnBackNext(' + (i + 1) + ',' + (counter + 1) + ')">Next Question &raquo;</a><input type="hidden" id="hdfFirstQ' + (counter + 1) + '" value="' + (counter + 1) + '" /><input type="hidden" id="hdfLastQ' + (counter + 1) + '" value="' + (i + 1) + '" /></div></div>';

            qnostatus += '<a onclick="javascript:fnGoToQuestion(' + (counter + 1) + ',' + totalnoofq + ');" id="pq' + (i + 1) + '" class=' + tableData[i].OPTION_name + '>' + (i + 1) + '</a>';

            if (i == totalnoofq - 1) {

                // htmlContent += '<div class="btnPrev"><a name="next" class="next" style="margin:0px;float:none;background:none;cursor:pointer;"  onclick="fnEndExam(' + (i + 1) + ',' + (counter + 1) + ')" ><span style="margin-left: -8px;">Back</span><br /><span>पीछे जाएं</span></a></div><div class="btnNext"><a name="next" class="next" style="margin:0px;float:none;background:none;cursor:pointer;"  onclick="fnEndExam(' + (i + 1) + ',' + (counter + 1) + ')" ><span style="margin-left: -8px;">End Exam</span><br /><span> परीक्षा समाप्त</span></a></div><input type="hidden" id="hdfFirstQ' + (counter + 1) + '" value="' + (counter + 1) + '" /><input type="hidden" id="hdfLastQ' + (counter + 1) + '" value="' + (i + 1) + '" /></div>';
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
    //document.getElementById('divmainloading').style.display = 'none';
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
function fnBackNext(sId, fId, totalnoofq) {
    //alert("dsa");
    if (sId < totalnoofq) {
        $('#hdfActiveQSheet').val((sId + 1));
        $('#divTotalNoOfQ').html("Total Questions : " + (sId + 1) + "/" + document.getElementById('hdfTotalNoOfQ').value);
        document.getElementById('divq' + (sId + 1)).style.display = 'block';
        if (sId > 1) {
            for (var i = 0; i < sId; i++) {
                document.getElementById('divq' + (i + 1)).style.display = 'none';
            }
        }
        else {
            document.getElementById('divq' + fId).style.display = 'none';
        }
        nextqnsauto = sId;
        if (totalnoofques == nextqnsauto + 1) {
            nextcounterauto = "F";
        }
        window.scrollTo(0, 0);
    }
    else {
        $('#btnendexam').click();
    }
    //CountTime(time, sId, fId);

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
    

    $.ajax({
        type: "POST",
        url: "/Home/fnoptionsubmitansRE",
        data: { rzs: JSON.stringify(totalAttempt), gzs: JSON.stringify(correctAns), uid: JSON.stringify($("#hdfUserId").val()), QnsId: JSON.stringify(QnsId), OptId: JSON.stringify(OptId), rightans: rightans },
        //contentType: "application/json; charset=utf-8",
        dataType: "json",
        success: function (data) {
           document.getElementById('divmainloading').style.display = 'none';
            //document.location.href = "ShowReport.aspx?uid=" + $('#hdfUserId').val();
        }, error: function (ex) {
           document.getElementById('divmainloading').style.display = 'none';
            ///document.location.href = "Login.aspx";
            // document.location.href = "ShowReport.aspx?uid=" + $('#hdfUserId').val();
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
    // alert(quesid);

    $.ajax({
        type: "POST",
        url: "/Home/fnsubmitansRE",
        data: '{rzs: ' + JSON.stringify(totalAttempt) + ',gzs:' + JSON.stringify(correctAns) + ',uid: ' + JSON.stringify($('#hdfUserId').val()) + '}',
        contentType: "application/json; charset=utf-8",
        dataType: "json",
        success: function (data) {
            window.location.href = "/Home/score/"+$('#hdfExamId').val() + "";
            document.getElementById('divmainloading').style.display = 'none';
            //document.location.href = "ShowReport.aspx?uid=" + $('#hdfUserId').val();
        }, error: function (ex) {
            document.getElementById('divmainloading').style.display = 'none';
            document.location.href = "/";
            // document.location.href = "ShowReport.aspx?uid=" + $('#hdfUserId').val();
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
        // alert(quesid);

        $.ajax({
            type: "POST",
            url: "/Home/fnsubmitansRE",
            data: { rzs: totalAttempt, gzs: correctAns, uid: $('#hdfUserId').val() },
            //contentType: "application/json; charset=utf-8",
            dataType: "json",
            success: function (data) {
                window.location.href = "/Home/score/"+$('#hdfExamId').val() + "";
               
                document.getElementById('divmainloading').style.display = 'none';
                //document.location.href = "ShowReport.aspx?uid=" + $('#hdfUserId').val();
            }, error: function (ex) {
                document.getElementById('divmainloading').style.display = 'none';
                document.location.href = "/";
                // document.location.href = "ShowReport.aspx?uid=" + $('#hdfUserId').val();
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