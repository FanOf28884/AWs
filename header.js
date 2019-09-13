// header task DnD
//Common setClipboard, cliC CliP setLocalStorage getLocalStorage
//bodyへのD&Dで .js .json .csvの処理
//===================================================================
// COMMON
//===================================================================
function ______common______(){}
//画面に .csv .js .jsonがDnDされた時の処理
$(function() {
	if(typeof(dropZone)!='undefined') return;
	var $d = $('body');
	$d.on("dragenter", function(e) {    e.stopPropagation();    e.preventDefault();});
	$d.on("dragover",  function(e) {    e.stopPropagation();    e.preventDefault();});
	$d.on("drop", function(e) {
		e.stopPropagation();
		e.preventDefault();
		var files = e.originalEvent.dataTransfer.files;
		for (var i = 0; i < files.length; i++) {
			var f = files[i];
			fname = f.name;
			if (fname.slice(-4) == '.csv' || fname.slice(-3) == '.js' || fname.slice(-5) == '.json') {
				var reader = new FileReader();
				reader.onload = function(theFile) {
					var text = reader.result.trim();
					if (fname.slice(-4) == '.csv') {
						var cols = text.split('\n');
						var data = [];
						for (var r = 0; r < cols.length; r++) {
							data.push("[" + cols[r] + "]");
						}
						text = fname.replace('.csv', '') + '= [' + data.join(',') + ']';
					}
					eval(text);
				}
				;
				reader.readAsText(files[i]);
			}
		}
	});
}());

function CopyToClipboard(note) {
    function listener(e) {
        e.clipboardData.setData("text/html", note);
        e.clipboardData.setData("text/plain", note);
        e.preventDefault();
    }
    document.addEventListener("copy", listener);
    document.execCommand("copy");
    document.removeEventListener("copy", listener);
}
function setClipboard(note) { CopyToClipboard(note); }
function setLocalStorage(c_name, val) {
    if (typeof (val) == "object")
        localStorage.setItem(c_name, JSON.stringify(val));
    else
        localStorage.setItem(c_name, val);
    return;
}
function getLocalStorage(c_name) {
    var rtn = localStorage.getItem(c_name);
    if (rtn == null) return '';
    if (rtn.charAt(0) == '[' || rtn.charAt(0) == '{')
        return JSON.parse(rtn);
    return rtn;
}
function cliP(txt){var ss=window.sessionStorage; var v=ss.getItem('clip')+' '+txt; ss.setItem('clip',v); CopyToClipboard(v)}
function cliC(txt){window.sessionStorage.setItem('clip','');}

//+===================+
//+=== HEADER Section =====+
//+===================+
function ______header______(){}
var buff='<style id="chartStyle">	#sortable { list-style-type: none; margin: 0px; padding: 0px; width: 100%; }	#sortable li { width: 24.5%; height: 24.5%; font-size: 1em; align: left;     margin: 0px 1px 0px 0px; padding: 0px; float: left; } </style>';
$('head').append(buff);
//body領域のhtml
    //unCheck, checkAll, +5, 除く, 無除,Sort
    buff   = '<table style="margin:-5px 0px;">    <tbody>    <tr>        <td colspan="5" align="left">';
    buff += '<input type="button" id="unCheck" value="no&#x2714;" style="vertical-align: middle; list-style:none; margin:0px; padding:0px; overflow:hidden;background-color:#E8E8E8;">';
	buff += '<input type="button" id="checkAll" value="all&#x2714;" style="vertical-align: middle; list-style:none; margin:0px; padding:0px; overflow:hidden;background-color:#E8E8E8;">';
	buff += '<input type="button" id="check_5" value="+5&#x2714;" style="vertical-align: middle; list-style:none; margin:0px; padding:0px; overflow:hidden;background-color:#E8E8E8;">';
	buff += '<input type="button" id="REMOVE" value="&#x2714;除" style="vertical-align: middle; list-style:none; margin:0px; padding:0px; overflow:hidden;background-color:#E8E8E8;">';
	buff += '<input type="button" id="delNoMark" value="無除" style="vertical-align: middle; list-style:none; margin:0px; padding:0px; overflow:hidden;background-color:#E8E8E8;"> ';
    buff += '<input type="button" id="SORT" value="Sort▼" style="vertical-align: middle; list-style:none; margin:0px; padding:0px; overflow:hidden;background-color:#E8E8E8;"> ';
    //MC, MPlus, MR
    buff +='<input type="button" id="MC" value="MC" style="vertical-align: middle; list-style:none; margin:0px; padding:0px; overflow:hidden;background-color:#D0D0FF;">';
	buff +='<input type="button" id="MPlus" value="M+" style="vertical-align: middle; list-style:none; margin:0px; padding:0px; overflow:hidden;background-color:#D0D0FF;">';
	buff +='<input type="button" id="MR" value="MR" style="vertical-align: middle; list-style:none; margin:0px; padding:0px; overflow:hidden;background-color:#D0D0FF;"> ';
    // load, 銘柄コードを貼り付け, doSave, fileName
    buff +='<select id="load" style="vertical-align: middle; background-color:#ffe8e8;"> <option value="">load</option></select>';
	buff +='<textarea id="txtCode" rows="1" cols="25" style="vertical-align: middle; background-color:#ffe8e8; width: 187px;height: 19px;border-bottom-width: 0.3;" value="html textbox droppable" placeholder="銘柄コードを貼付け"></textarea>';
	buff +='<input type="button" id="doSave" value="save>" onclick="doSavePlus()" style="vertical-align: middle; border-width:1px;background-color:#fff8f8;">';
	buff +='<input id="fName" value="" width="50px" style="vertical-align: middle; color:#808080;background-color:#ffe8e8;width: 80px;height: 19px;" placeholder="file_name">';
	buff +='</td></tr>';
    // Dropdown Menues
    buff += '<tr><td><select id="menuIndicatorType" style=" vertical-align: middle; background-color:#e8e8e8;"><option value="0">ChartType</option></select> ';
    buff += '<select id="menuPerTerm" style=" vertical-align: middle; background-color:#e8e8e8;"><option value="0">足設定</option></select>';
    buff += '<select id="menuAutoUpdate" style=" vertical-align: middle; background-color:#e8e8e8;"> <option value="0">menuAutoUpdate</option></select>';
    buff += '<select id="menuAlerts" style="vertical-align: middle; background-color:#e8e8ff;"><option value="0">menuAlerts</option></select>';
	buff += '<select id="menuScreening" style=" vertical-align: middle; background-color:#e8e8ff;"><option value="">menuScreening</option></select>';
    buff += '</td> </tr></tbody></table><a id="status" width = 16></a>';
    //Chart Area
    buff += '<ul id="sortable" class="ui-sortable margin-left=2px"></ul>';
//SBI 詳細チャートとIFISチャートのみに対応
if(document.URL.indexOf('https://chart.iris.sbisec.co.jp/sbi/as/Mchart-mchart.html')==0 || document.URL.indexOf('https://kabuyoho.ifis.co.jp/img')==0) {
    $('body > img').remove();
    $('body').attr('style','background-color:#f0f0f0');
    $('body').attr('style','margin-left:5px');
    $('body').append(buff);task_M1
}
function doSavePlus(){doSave(); $('#load > option')[0].innerHTML=' load';}

//LINE message
//var sock = new WebSocket('ws://127.0.0.1:5001');	
//function LINE(msg) {
//	sock.send(JSON.stringify({'LINE':msg}));
//}

//+===================+
//+=== TASK Section =======+
//+===================+
function ______task______(){}
var task={};
var TCB_S1={};   // TCB_S1['changeChart'] = changeChart;
var TCB_M1={};   TCB_M1['changeChart'] = task_changeChart;
var TCB_M5={};

//+================================+
//+=== TASK init Section
//+================================+
//起動時に実行される
(function (){
    if(task["S1"]==undefined)    TaskCreate(task_S1,     1000);
    if(task["M1"]==undefined)   TaskCreate(task_M1,   60000);
    if(task["M5"]==undefined)   TaskCreate(task_M5, 300000);
})();

function task_S1()
{
    if( typeof(menuPerTerm)=='undefined') setTimeout( setBack, 2000);
    if( ! isJpnMarketOpen()) return;
     Object.keys(TCB_S1).forEach(key => TCB_S1[key]());     //TCB_S1に登録されたtaskを実行
}
function task_M1()
{
    if( ! isJpnMarketOpen()) return;
     Object.keys(TCB_M1).forEach(key => TCB_M1[key]());     //TCB_M1に登録されたtaskを実行
}
function task_M5()
{
    if( ! isJpnMarketOpen()) return;
     Object.keys(TCB_M5).forEach(key => TCB_M5[key]());     //TCB_M5に登録されたtaskを実行
}


//+================================+
//+=== TASK Handler
//+================================+
function task_changeChart() {
    var v = $('#menuAutoUpdate').val();
    if(v=='0') return;
    var date = new Date();
	if( date.getDay()==0 || date.getDay()==6) 	return;		// 土曜日,日曜日は  chart再表示をしない
	
	var hhmm=date.getHours()*60+date.getMinutes();
    if( (hhmm % v)==0 &&  (hhmm>=540 && hhmm<=690 || hhmm>=750 && hhmm<=900 ) )   //09:00-11:30,  12:30-15:00
		changeChart();
}

//+================================+
//+=== TASK Common
//+================================+
function TaskCreate(handler, timeout) {
    const now = Date.now();
    let last = now + timeout;
    const step = function() {
        handler();  		// Callback

        // Next iteration (after callback execution)
        const now = Date.now();
        const offset = now - last; // the drift (positive for overshooting)
        let wait = Math.max(1, timeout - offset);

        if (offset > timeout) { 	// something really bad happened. Maybe the browser (tab) was inactive?
            last = now;                // possibly special handling to avoid futile "catch up" run
            wait = timeout;          // Reset interval
        }
        last += timeout;
        task[handler.name]=setTimeout(step, wait);      		// Recursive
        return
    };
    task[handler.name]=setTimeout(step, timeout);
    return
}
function TaskDelete(handler){
    clearInterval(task[handler.name]);
    delete (task[handler.name]);
}


function speak(txt) {
    if(typeof(speakBuff)=='undefined') speakBuff = [];
    if(txt.length>0) speakBuff.push(txt);
    if(speechSynthesis.pending || speechSynthesis.speaking) {
        setTimeout(speak, 1000, '');
        return;
    }
    if(speakBuff.length>0) {
        var uttr = new SpeechSynthesisUtterance(speakBuff.shift());
        speechSynthesis.speak(uttr);
    }
}

function isJpnMarketOpen() {
        var date = new Date();
        var hhmm=date.getHours()*60+date.getMinutes();
        if(hhmm>=540 && hhmm<=690 ||  hhmm>=750 && hhmm<=900)
            return true;
        else
            return false;
}
