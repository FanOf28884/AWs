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
var buff='';
    //unCheck, checkAll, +5, 除く, 無除,Sort
    buff += '<table style="margin:-5px 0px;">    <tbody>    <tr>        <td colspan="5" align="left">';
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
var sock = new WebSocket('ws://127.0.0.1:5001');	
function LINE(msg) {
	sock.send(JSON.stringify({'LINE':msg}));
}

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
    if( typeof(symbolName)=='undefined') setBack();
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
        sleepF(speak(''), 1000);
        return;
    }
    if(speakBuff.length>0) {
        var uttr = new SpeechSynthesisUtterance(speakBuff.shift());
        speechSynthesis.speak(uttr);
    }
}
function sleepF(f, time) {
    setTimeout(function () {
        f.next();
    }, time);
};

function isJpnMarketOpen() {
        var date = new Date();
        var hhmm=date.getHours()*60+date.getMinutes();
        if(hhmm>=540 && hhmm<=690 ||  hhmm>=750 && hhmm<=900)
            return true;
        else
            return false;
}

//=======================================
// CLONE main
//=======================================
function ______CLONE_main______(){}
var  stock = {};	// stock['1570'] = new Chart('1570', rn);
var  Alerts= {}; // 個別のAlert条件
var  cw, ch, lastX = -1;
var  ar;
var  undoBuf = [];
var  undoCnt = 0;
var  chartMode;
var gCodes = [];
var gClippingMode = false;	// クリックで画像保存
var gDClen = 16;				// Donchan幅
var gDCanytime= true;		// Donchanを 常に表示
var gClickedCode;				// 最後にクリックされたcode
var gPickedColor;				// 最後にクリックされた上下2px以内のカラーcode
function changeChart() {
	if(document.URL.indexOf('https://chart.iris.sbisec.co.jp')==0) {
		chartMode = 'SB';
		document.title = gSBper + '  ' + gSBterm;
	} else if(document.URL.indexOf('https://kabuyoho.ifis.co.jp/img/graph/pbr_range75')==0)
		chartMode = 'PBR';
	else if(document.URL.indexOf('https://kabuyoho.ifis.co.jp/img/graph/per_range75')==0)
		chartMode = 'PER';

	var txt = extractCode($("#txtCode").val());	$("#txtCode").val(txt+' ');
	var codes = txt.split(' ');
	for (var code in stock)
		if (codes.indexOf(code)<0) delete stock[code];
	codes = codes.slice(0,Math.min(codes.length,300));	//'３００以上の銘柄数は表示しません
	gCodes = codes;

	setChartStyle();

	// symbolNameが読み込めていなければ、setBack()で読み込む
	if( typeof(symbolName)=='undefined')
		setBack();
//		pushChkMark();
	// Alertsの設定が変わっていたら localStorageに保存する
	// まず現在のChartの設定値をAlertsにセットする
	for( code in stock ) {
		var al = document.getElementById(code).parentNode.getElementsByClassName('al');
		Alerts[code].al0 = al[0].value;
		Alerts[code].al1 = al[1].value;
		Alerts[code].al2 = al[2].value;
		Alerts[code].al3 = al[3].value;
	}
	if( ! compareObj( Alerts, getLocalStorage('Alerts')) )
		setLocalStorage( "Alerts", Alerts );

	var d=new Date();
	var dd= String(d.getMonth()+1)+String(d.getDate());

//codesに  無いchart および randomstrが古い 時刻のchartは削除する
//これにより、一定時間内にchartを重複して読み出すことを防止する
	gRandomStr = randomStr();
	// 表示されているchartについて
	var charts = $('.chart');
	var removes = [];
	for( var i=0; i<charts.length; i++ ) {
		var id = charts[i].id;
		if(codes.indexOf(id)>=0) {
			if(charts[i].getAttribute('randomstr') == gRandomStr)
				codes.splice(codes.indexOf(id), 1);	//新しいのは再表示しない
			else
				removes.push(id);	//重複表示されないように古いのを削除対象に
		} else 
			removes.push(id);	// 次に表示しないので、削除対象に
	}
	for( var i=0; i<removes.length; i++ )   
		document.getElementById(removes[i]).parentNode.parentNode.remove();
	

//console.time('myTime');
	for( var i=0; i<codes.length; i++ ) {
		var code = codes[i];
		if(code=='') continue;

		//---個別codeの画像読み込みと処理
		var isLast = i==(codes.length-1);
		if(chartMode=='SB')             showSBChart(code,   isLast);
		if(chartMode=='PER')           showPERChart(code, isLast);
		if(chartMode=='PBR')           showPBRChart(code, isLast);
		//--------------------------------
	}
	$("#txtCode").val(txt);
	popChkMark();
	//表示順序を txtの順番に合わせsortする
	codes = txt.split(' ');
	for( var i= codes.length-1; i>=0; i--)
		mvIMAGE(codes[i]);

	//mouse clickでチャート座標を検出し、価格を<input>できるように設定する
	//この部分は,dynamicに変更されるごとに実行する必要があり、USER INTERFACEへ移動しないこと
	if( ! gClippingMode ) {
		$('.chart').on("click", function(e) {
			var rect = e.target.getBoundingClientRect();
			var x = e.clientX - rect.left;
			var y = e.clientY - rect.top;
			var code=$(this)[0].id;
			mvPr1_Pr2(code);    //個別チャートのalert領域を右にシフト
			var axPrc = stock[code].axPrc;
			var price = Math.round( (y-axPrc.Yd)/(axPrc.Yu-axPrc.Yd)*(axPrc.u-axPrc.d)+axPrc.d);   //価格に変換する
			var alrt   = $("#"+code).parent().children('input.al');
			alrt[0].value= price;
			Alerts[code].al0 = alrt[0].value; alrt[0].select();
			Alerts[code].al1 = alrt[1].value;
			Alerts[code].al2 = alrt[2].value;
			Alerts[code].al3 = alrt[3].value;
			gClickedCode = code;
			gPickedColor = getPixColor(stock[code].sd, x, y); 
		});
	} else {
		// Deep Learning用にClickした座標を起点として2日分の過去画像をpngで保存する
		$('.chart').on("click", function(e) {
			var rect = e.target.getBoundingClientRect();
			var x = e.clientX - rect.left;
			var y = e.clientY - rect.top;

			if( x>=25) {
				x=x-150;
				y=0;

				var code=$(this)[0].id;
				var canvas = document.getElementById(code);

				var canvas = document.getElementById(code);
				var ctx = canvas.getContext('2d');
				var src = ctx.getImageData(0, 0, cw, ch);	   // 作業用

				mem_canvas = document.createElement("canvas");
				mem_canvas.width = 200;
				mem_canvas.height = ch;
				var context = mem_canvas.getContext('2d');
				context.fillStyle = '#FFFFFF'; 	context.fillRect(0, 0, 200, ch); // 背景を白塗りしておく

				context.putImageData( src, -x, -y);		//キャンバスに画像を読み込む
				context.fillStyle = '#000000'; 	context.fillText(code, 2, 11 )
				vline(context, 150, '#a0a0a0');
				var uri = mem_canvas.toDataURL('image/png');
				//  画像保存用のアンカータグを作成
				var a = document.createElement('a');
				a.href = uri;

				var  dt = new Date();
				var hh = dt.getHours();		if (hh < 10) hh = '0' + hh;
				var mm = dt.getMinutes();	if (mm < 10) mm = '0' + mm;
				var ss = dt.getSeconds();	if (ss < 10) ss = '0' + ss;
				var symbName = symbolName[Number(code)];
				symbName = symbName.substr(0,Math.min(7,symbName.length));
				var  fname = code + '_' + symbName + '_' + hh + mm + ss + '.png';
				a.download = fname;
				// 画像保存のクリックイベントを発生させる
				a.click();
			}
		});
	}
}
//
//====================================================
//====================================================
//====================================================
//====================================================

function selectBox( box, val) {
	$("#"+box).val(val);
	changeChart();
}

function setColor(code, color){
	document.getElementById(code).parentNode.style.background = color;

}
function setChartStyle() {
	var chartStyle =  '#sortable { list-style-type: none; margin: 0; padding: 0; width: 100%; }' + '\r\n';
		chartStyle += '#sortable li { width: 618px; height: 325px; ';
		chartStyle += 'font-size: 1em; text-align: center;     margin: 0px 0px 0px 0px; padding: 1px; float: left; }';
	if(chartMode=='SB' && (window.screen.width==1200 || window.screen.width==1800))
		buff = buff.replace('1em', '0.9em');
	if(chartMode!='SB')
		chartStyle = chartStyle.replace(/618/, '480');
	document.getElementById('chartStyle').innerText = chartStyle;
}



function CheckMatched(txt) {
	var ary = extractCode(txt+' ').split(' ');
	var aryCode = new Array();
	//------------------------
	//一致した銘柄にチェック印をつける
	for( var i=0; i<ary.length; i++) {
		var code = ary[i];
		if(document.getElementById(code) != null) {
			document.getElementById(code).parentNode.firstChild.checked = true;
			aryCode.push(code);
		}
	}

	var charts = getCharts();
	var code = aryCode.pop();
	while (code != undefined) {
		mvIMAGE(code);
		code = aryCode.pop();
	}
	//-- txtCodeを、チャートの順番に書換える
	var buf='';
	getCharts().each(function(){
		buf += $(this).attr('id') + " ";
	});
	$("#txtCode").val(buf.trim() + " ");
}

function pushUndoBuf(txt) {
	undoBuf.push(txt) ;	// undo出来るように保存
	// 重複を削除
	undoBuf = undoBuf.filter(function (x, i, self) {
		return self.indexOf(x) === i;
		});
	undoCnt = undoBuf.length-1;
}

//changeChartでchkが消えてしまうので、もとに戻せるように、checkBoxのidを記憶する
var chkAry = new Array();
function pushChkMark() {
	chkAry = new Array();
	var obj = document.getElementsByName('chkbox');
	for(var ix=0; ix<obj.length; ix++)
	{
		if(obj[ix].checked)
			chkAry.push(obj[ix].parentNode.getElementsByClassName('chart')[0].id);
	}
}
//checkBoxの状態をもとに戻す
function popChkMark() {
	chkAry.forEach(function (code) {
		if(code.length==4) {
			var d = document.getElementById(code);
			if (d!=null)
				d.parentNode.children[0].checked = true;
		}
	});
}
function sortChked() {
		//-- Checkが付いたcodeのindexをAryにpush
		var buf='';
		var AryChk = new Array();
		var AryNon = new Array();
		var obj = document.getElementsByName('chkbox');
		for (var i=0; i<obj.length; i++) {
			if(obj[i].checked) {
				AryChk.push(i);
			}else{
				AryNon.push(i);
			}
		}
		for (var i=0; i<AryChk.length; i++)
			buf += obj[AryChk[i]].parentNode.getElementsByClassName('chart')[0].id + ' ';
		for (var i=0; i<AryNon.length; i++)
			buf += obj[AryNon[i]].parentNode.getElementsByClassName('chart')[0].id + ' ';
		$("#txtCode").val(buf);

		//-- Aryの内容をpopし、後ろのChartから先頭に移動させる
		var charts = $("canvas[class='chart']");
		var ix = AryChk.pop();
		while (ix != undefined)
		{
			var code = charts[ix].id;
			mvIMAGE(code);
			ix = AryChk.pop();
		}
}

//-- id=codeのIMAGEのparentNodeをsourtable直後に移動させる
function mvIMAGE(code) {
	var  obj = document.getElementById(code).parentNode.parentNode;
	var  ele = document.getElementById('sortable');
	ele.insertBefore(obj, ele.firstChild);
}
//価格を右に移動
function mvPr1_Pr2(code) {
	var al = document.getElementById(code).parentNode.getElementsByClassName('al');
	al[3].value = al[2].value;
	al[2].value = al[1].value;
	al[1].value = al[0].value;
	al[0].value = '';
}

function getCharts() {
	return  $("canvas[class='chart']");

}

function compareObj( obj1, obj2 ) {
	function objectSort(obj){
		// まずキーのみをソートする
		var keys = Object.keys(obj).sort();
		// 返却する空のオブジェクトを作る
		var map = {};
		// ソート済みのキー順に返却用のオブジェクトに値を格納する
		keys.forEach(function(key){
			var val = obj[key];
			// 中身がオブジェクトの場合は再帰呼び出しを行う
			if(typeof val === "object"){
				val = objectSort(val);
			}
			map[key] = val;
		});
		return map;
	}
	var obj1JSON = JSON.stringify(objectSort(obj1));
	var obj2JSON = JSON.stringify(objectSort(obj2));
	var rtn = obj1JSON === obj2JSON;
	return rtn;
}
// numeric compare function
// .sort(ASC)   .sort(DESC)
function ASC(a, b)   { return a - b; }
function DESC(a, b) { return b - a; }


//営業日の差分日数を返却します。
function workingDays(sDay) {
	if(sDay.length==5)
		sDay = (new Date()).getFullYear()+'/'+sDay;
	var date1 = new Date(sDay);
	var date2 = new Date();
	var msDiff = date2.getTime() - date1.getTime();				// getTimeメソッドで経過ミリ秒を取得し、日付の差を求める
	var daysDiff = Math.floor(msDiff / (1000 * 60 * 60 *24));	// 求めた差分（ミリ秒）を日付へ変換します
	var dayofweek1 = date1.getDay();
	var dayofweek2 = date2.getDay();
	if(dayofweek1 == 0 || dayofweek1 == 6) dayofweek1 = 5;		// 今日が土日なら金曜日として計算する
	if(dayofweek2 == 0 || dayofweek2 == 6) dayofweek2 = 5;		// 今日が土日なら金曜日として計算する
	var wkDayDiff= Math.floor(daysDiff/7)*5 + ((dayofweek2-dayofweek1 +5) % 5);
	return wkDayDiff;
}

//2010-2050の年号と、1357,1570以外の下記のETF銘柄は除外する
//4桁以外の数字は除外
//後で、submatchを使ってスマートに書き直す
function extractCode(txt) {
	if(txt!="") {
		txt = txt.replace(/\n+>/g,'>').replace(/\n+\)/g,'\)');
		var len = 6;
		var myregex = new RegExp(/\<\d+\>/g);
		var r = txt.match(myregex);
		if(r==null) {
			myregex = new RegExp(/\(\d+\)/g);
			r = txt.match(myregex);
			if(r==null) {
				len = 4;
				myregex = new RegExp(/\d+/g);
				r = txt.match(myregex);
			}
		}
		// 重複を除去する
		var result=[];
		if(r!=null) {
			result = r.filter(function (v, i, s) {
				var vn = Number(v.replace(/\</g,'').replace(/\>/g,'').replace(/\(/g,'').replace(/\)/g,''));
				return (s.indexOf(v) === i && v.length==len  && (vn<2010 || 2050<vn));
			});	// end 重複除去
		}
		if(result.length==1)
			txt = result[0];
		else if(result.length>=2)
			txt = result.join(' ');

		txt = txt.replace(/\</g,'').replace(/\>/g,'').replace(/\(/g,'').replace(/\)/g,'');
	}
	return txt;
}

// load時にSelectOptionの設定を行う
function setBack(){
	Alerts = getLocalStorage('Alerts');
	symbolName = getLocalStorage('symbolName');
	//Drop Down Menues 
	restoreOptionFm_LocalStorage('menuIndicatorType'); $('#menuIndicatorType > option')[0].innerHTML='ChartType'; $('#menuIndicatorType').val('BOL,RCI');
	restoreOptionFm_LocalStorage('menuPerTerm'); $('#menuPerTerm > option')[0].innerHTML='足設定';						$('#menuPerTerm').val('15,10');
	restoreOptionFm_LocalStorage('menuAutoUpdate'); $('#menuAutoUpdate > option')[0].innerHTML='更新周期'; 		$('#menuAutoUpdate').val(5);
	restoreOptionFm_LocalStorage('menuAlerts');   $('#menuAlerts > option')[0].innerHTML='Alert';
	restoreOptionFm_LocalStorage('menuScreening');$('#menuScreening > option')[0].innerHTML='Screening';
	restoreOptionFm_LocalStorage('load');         $('#load > option')[0].innerHTML='load';
	menuDClen = getLocalStorage('menuDClen');
	$('#technicalUpper').val(getLocalStorage('technicalUpper'));
	$('#technicalLower').val(getLocalStorage('technicalLower'));
}

//---------
function doSave() {
	var fName = $("#fName").val();
	if( fName.length>0) {
		var codes = $("#txtCode").val();
		var arFname = getLocalStorage('load');
		if( arFname==undefined ) arFname = {};
		if( codes.length>=4 ) {
			setLocalStorage( fName, codes);
			if( arFname[fName]==undefined ) {
				arFname[fName] = fName;
				setLocalStorage('load', arFname);
			}
			restoreOptionFm_LocalStorage('load');
		} else {
			localStorage.removeItem(fName);
			if( arFname[fName] ) {
				delete arFname[fName];
				setLocalStorage('load', arFname);
			}
			restoreOptionFm_Array('load', arFname);
		}
	}
}

//SelectOptionをLocalStorageにセット
function saveOptionTo_LocalStorage(id) {
	var txt="";
	var idS='#'+id;
	var options={};
	$(idS+' > option').each(function(e){
		options[$(this).val()].val($(this).text());
	});
	setLocalStorage(id, options);
}

//SelectOptionをLocalStorageでレストアする
function restoreOptionFm_LocalStorage(id) {
	var options = getLocalStorage(id);
	if(options!=null) {
		var idS='#'+id;
		$(idS+' > option').remove();
		$(idS).append($('<option>').val(0).html(id));
		Object.keys(options).forEach(function(key) {
			$(idS).append($('<option>').val(this[key]).html(key));
		}, options);
	}
}

function restoreOptionFm_Array(id, optionAr) {
	if(optionAr!=null) {
		var idS='#'+id;
		$(idS+' > option').remove();
		$(idS).append($('<option>').val('').html(''));
		for(var key in optionAr) {
				$(idS).append($('<option>').val(key).html(optionAr[key]));
		}
	}
}

function ______USER_INTERFACE__________(){}
$(function() {
	$("#txtCode").on('change', function(e) {
		// Webの銘柄コードが含まれるテキストから、銘柄コードのみを
		// 正規表現で銘柄コードのみに再構築する-------
		var txt = $("#txtCode").val();
		//=======================================================
		//---- 特殊な文字列が含まれていれば、対応した処理を行う
		if( txt.indexOf('javascript:')==0 ||  txt.indexOf('js:')==0 || txt.indexOf('json:')==0) {
			return;
		}
		if( txt.indexOf('？？')>=0 || txt.indexOf('??')>=0) {	//銘柄名で検索
			tellMeCode();
			txt = $("#txtCode").val();
		}
		if( txt.indexOf('undef?')>=0 ) {
			chkundef();
			return ;
		}
		
		//=======================================================

		txt = extractCode(txt);
		$("#txtCode").val(txt + " ");
		changeChart();
		pushUndoBuf(txt);
	});

	// fNameに 以下の文字列が含まれていれば、javascriptとみなして実行する
	$("#fName").on('change', function(e) {
		var txt = $("#fName").val();
		//---- 特殊な文字列が含まれていれば、対応した処理を行う
		if( txt.indexOf('?=')==0 )
			alert(eval(txt.replace('?=','')));
		else if(  txt.indexOf('=')>0 || txt.indexOf('(')>0 || txt.indexOf('js:')==0 || txt.indexOf('javascript:')==0 ) {
			eval( txt.replace('js:','').replace('javascript:',''));
			$("#fName").val('');
			return ;
		}
	});

	//------------
	// Drag & Drop で読み込み
	var obj = $("#txtCode");
	obj.on('dragenter', function (e) {
		e.stopPropagation();
		e.preventDefault();
		$(this).css('border', '2px solid #0B85A1');
	});
	obj.on('dragover', function (e) {
		 e.stopPropagation();
		 e.preventDefault();
	});
	obj.on('drop', function (e) {
		$(this).css('border', '2px dotted #0B85A1');
		e.preventDefault();

		var txt="";
		if(e.originalEvent.dataTransfer.files.length==0) {
			txt=e.originalEvent.dataTransfer.getData('text/plain');
			$("#txtCode").val(txt+ " ");
			changeChart();
		} else {

			var files = e.originalEvent.dataTransfer.files;

			var reader = new FileReader();
			// ファイル読み込みに成功したときの処理
			reader.onload = function() {
				txt = extractCode(reader.result);
				$("#txtCode").val(txt + " ");
				changeChart();
				pushUndoBuf(txt);
			};
			// ファイル読み込みを実行
			reader.readAsText(files[0]);
		}
	});

	$("select#menuIndicatorType").on('change', function() {
		var ar = $(this).val().split(',');
		if(ar.length==2) {
			setSB_UpperLower(ar[0], ar[1]);
			//chartの 再表示用にrandomstrを書き換えておく
			var charts = $('.chart');
			for( var i=0; i<charts.length; i++)
				charts[i].setAttribute('randomstr', '0'); 
			changeChart();
		}
	});

	$("select#menuPerTerm").on('change', function() {
		var ar = $(this).val().split(',');
		if(ar.length==2) {
			gSBper = ar[0];
			gSBterm = ar[1];
			//chartの 再表示用にrandomstrを書き換えておく
			var charts = $('.chart');
			for( var i=0; i<charts.length; i++)
				charts[i].setAttribute('randomstr', '0'); 
			changeChart();
		}
	});

	// $("select#menuAutoUpdate").on('change', function() {
	// 		$("#updatePer").val($(this).val());
	// });


	$("select#load").on('change', function() {
		var codes = getLocalStorage($(this).val());
		$("#txtCode").val( codes );
		$("#fName").val($(this).val());
		changeChart();
	});


	$("#MC").on('click', function() {
		setLocalStorage('memory','');
	});
	$("#MPlus").on('click', function() {
		var txt = $("#txtCode").val();
		txt = extractCode(getLocalStorage('memory') + " " + txt);
		setLocalStorage('memory',txt);
		changeChart();
	});
	$("#MR").on('click', function() {
		$("#txtCode").val(getLocalStorage('memory') + " ");
		changeChart();
	});

	$("#Undo").on('click', function() {
		if(undoBuf.length==0) return;
		undoCnt--;
		if(undoCnt<0) undoCnt = undoBuf.length-1;
		$("#txtCode").val(undoBuf[undoCnt] + " ");
		//console.log(undoCnt + "    " + undoBuf[undoCnt]);
		changeChart();
	});

	$("#SORT").on('click', function() {
		sortChked();	//--- sort by chekBox
		changeChart();
	});
	$("#REMOVE").on('click', function() {
		//--- sort by chekBox
		//-- Checkが付いたcodeのindexをAryにpush　消去する
		var obj = document.getElementsByName('chkbox');
		for (var i=obj.length-1; i>=0; i--) {
			if(obj[i].checked) {
				var ele = obj[i].parentNode;
				delete stock[code = ele.getElementsByClassName('chart')[0].id];     //stockのデータも消去
				while (ele.firstChild) ele.removeChild(ele.firstChild);	//子要素を全て削除
				ele.parentNode.removeChild(ele);						//自分を削除
			}
		}

		//-- txtCodeの順序をチャートに合わせて書換え
		var buf='';
		getCharts().each(function(){
			buf += $(this).attr('id') + " ";
		});
		$("#txtCode").val(buf.trim() + " ");
		pushUndoBuf($("#txtCode").val() + " ");

		changeChart();
	});

	$("#delNoMark").on('click', function() {
		var obj = document.getElementsByName('chkbox');
		for (var i=obj.length-1; i>=0; i--) {
			if(!(obj[i].checked)) {
				var ele = obj[i].parentNode;
				delete stock[code = ele.getElementsByClassName('chart')[0].id];     //stockのデータも消去
				while (ele.firstChild) ele.removeChild(ele.firstChild);	//子要素を全て削除
				ele.parentNode.removeChild(ele);						//自分を削除
			}
		}

		//-- txtCodeの順序をチャートに合わせて書換え,LocalStorageに保存
		var buf='';
		getCharts().each(function(){
			buf += $(this).attr('id') + " ";
		});
		$("#txtCode").val(buf.trim() + " ");
		pushUndoBuf($("#txtCode").val());

		changeChart();
	});

	$("#unCheck").on('click', function() {
		//-- Checkを外す
		//var Ary = new Array();
		var obj = document.getElementsByName('chkbox');
		for (var i=0; i<obj.length; i++) {
			if(obj[i].checked) {
				obj[i].checked = false;	// checkを外す
			}
		}
	});

	$("#checkAll").on('click', function() {
		//-- Check
		//var Ary = new Array();
		var obj = document.getElementsByName('chkbox');
		for (var i=0; i<obj.length; i++) {
			obj[i].checked = true;	// check
		}
	});

	$("#check_5").on('click', function() {
		//-- 最終チェックの後ろの 10-1個にチェックマークを付ける
		//var Ary = new Array();
		var obj = document.getElementsByName('chkbox');
		var i = obj.length -1;
		for ( ; i>=0; i--) {
			if(obj[i].checked) break;
		}
		for ( cnt=0; i<obj.length && cnt<=5; i++, cnt++) {
			obj[i].checked = true;	// check
		}
	});

	$("#reLoad").on('click', function() {
		location.reload();
	});

	$("#showChart").on('click',function() {
		changeChart();
	});

});
function tellMeCode(){
	var txt = $("#txtCode").val();
	txt = txt.replace('??','').replace('？？','');
	var names = txt.replace('\t',' ').replace('\n',' ').replace('　',' ').split(' ');
	buf = '';
	for(var n = 0; n<names.length; n++){
		Object.keys(symbolName).forEach(function(key) {
			var name = this[key]; // this は symbolName
			if(names[n].length>0 && name.indexOf(names[n])>=0 ) {
				var val = '000'+key;
				buf +=  val.substr(val.length-4)+ ' ';
			}
		}, symbolName);
	}
	$("#txtCode").val(buf);
}

//=======================================
// CLONE filt
//=======================================
function ______CLONE_showChart_common____(){}
var gSBper = '';
var gSBterm='';
var gTechUP='';
var gTechLO='';
function apndCanvas(code, symbName) {
	var buff =   '<li class = "ui-state-default"> <div style = "width: 100%; background-color: rgb(240, 240, 240);" align = "left"> <input type = "checkbox" name = "chkbox"> <a> code </a> <a> symbolName</a> '
				+ '<input class = "al" name = "al0" value = "" size =9 style = "font-size:80%; border-width:1px; background-color:#F8F8F8;">→'
				+ '<input class = "al" name = "al1" value = "" size =9 style = "font-size:80%; border-width:1px; background-color:#F8F8F8;">→'
				+ '<input class = "al" name = "al2" value = "" size =9 style = "font-size:80%; border-width:1px; background-color:#F8F8F8;">→'
				+ '<input class = "al" name = "al3" value = "" size =6 style = "font-size:80%; border-width:1px; background-color:#F8F8F8;"><br><div class="memo"></div>'
				+ '<canvas class = "chart" id = "code" randomStr ="' + gRandomStr + '"'
				+ 'width = "610" height = "295"></canvas> </div> </li>';
	if(chartMode=='SB' && (window.screen.width==1200 || window.screen.width==1800))
		buff = buff.replace(/80%/g, '70%');
	if(chartMode!='SB')
		buff = buff.replace(/610/, '480').replace(/295/, '300').replace(/=9/g, '=5').replace(/=8/g, '=4');
	$('#sortable').append(buff.replace(/code/g, code).replace('symbolName', symbName.substr(0,Math.min(7,symbName.length))));
}
function getUrlOfSB(code) {
	var url = document.URL;
	if(gSBper=='') {
		var p1 = url.indexOf('mode=')+5;
		var p2 = url.indexOf('&', p1);
		var p3 = url.indexOf('Num=') + 4;
		var p4 = url.indexOf('&main=');
		gSBper   = url.substring(p1, p2);
		gSBterm = url.substring(p3, p4);
		var p5 = url.indexOf('addon=')+6;
		var p6 = url.indexOf('&sub=');
		var p7 = url.indexOf('&TP=');
		gTechUP = url.substring(p5, p6);
		gTechLO = url.substring(p6+5, p7);
		$('#PerTerm').val(gSBper + ',' + gSBterm);
	}
	//set per, term
	var url1 = url.substring(0, url.indexOf('mode='));
	var url2 = url.substring(url.indexOf('&main='));
	url = url1 + 'mode=' + gSBper;
	if(Number(gSBterm)<=20)
		url += '&DaysNum=' + gSBterm +url2;
	else
		url += '&DispNum=' + gSBterm +url2;
	//set upper, lower
	var url1 = url.substring(0, url.indexOf('addon='));
	var url2 = url.substring(url.indexOf('&TP='));
	url = url1 + 'addon=' + gTechUP + '&sub=' + gTechLO +url2;;

	//set code
	var p = url.indexOf('ricCode=') + 8;
	var q = url.indexOf('&type=');
	url = url.slice(0, p) + getRicCode(code) + url.slice(q);
	var p = url.indexOf('rand=') + 5;
	return url.slice(0, p) + gRandomStr;
}
	//0001:DOW,0002:NK225 コードを設定する
	function	getRicCode(code) {
		switch(code){
			case '0001': return 'JDIc1';	// DOW
			case '0002': return 'JNIc1';	// NK225
			default:	 return code+'.T';
		}
	}

function getUrlOfPBR(code) {
	var src = "https://kabuyoho.ifis.co.jp/img/graph/pbr_range75/n/";
	src += code + ".gif";
	return src;
}
function getUrlOfPER(code) {
	var src = "https://kabuyoho.ifis.co.jp/img/graph/per_range75/n/";
	src += code + ".gif";
	return src;
}

function setSB_PerTerm(per, term) {
	gSBper   = per;
	gSBterm = term;
	changeChart();
}
function setSB_UpperLower(techUpper, techLower) {
	gTechUP = techUpper;
	gTechLO = techLower;
	changeChart();
}
// SBI Chartから曲線データを抽出する
//	I: ctx,  gr, gl, g1u, g1d
// O: SC.Pr, SC.Prh, SC.Prl
//	lastX:		Out 最新データのpx値
function readCandle(SC, sd, gr, gl, g1u, g1d) {
//        return;
//        var src = ctx.getImageData(0, 0, cw, ch);
//        var sd = src.data;
	var Pu = SC.axPrc.u;
	var Pd = SC.axPrc.d;
	var Yu = SC.axPrc.Yu;
	var Yd = SC.axPrc.Yd;
	var coef=(Pu-Pd) / (Yu-Yd);

	var ru=255, gu=0,  bu=51  ;        //赤candle
	var rd=   0, gd=51, bd=153;        //青candle
	var stepY=1, stepP=cw<<2;
	var xB = gr;
	var xE = gl;
	var yB = g1d;
	var yE = g1u;
	if(yB>yE) { stepY=-1; stepP = -cw<<2;}
	var lastX = -999999;
	for (var x=xB; x>=xE; x--) {       //xBから左方向に
		var h=-999999, l=-999999, c=-999999;
		var p = (x+(yB*cw))<<2;
		for(var y = yB;  y!=yE; y += stepY, p += stepP) {
			if( sd[p]==ru && sd[p+1]==gu && sd[p+2]==bu) {	//色が赤candleの場合
				sd[p]=255;  sd[p+1]=255; sd[p+2]=255;   //白く塗る
				if(lastX<x) lastX   = x;
				if(l==-999999)  {l = y; c = y;}
				h = y;
			} else if( sd[p]==rd && sd[p+1]==gd && sd[p+2]==bd) {	//色が青candleの場合
				sd[p]=255;  sd[p+1]=255; sd[p+2]=255;   //白く塗る
				if(lastX<x) lastX   = x;
				if(l==-999999)  l = y;
				h = y; c = y;
			}
		}
		SC.Prh[lastX-x] = h > -999999? (h - Yd) * coef + Pd :  -999999;
		SC.Prl [lastX-x] = l  > -999999? (l  - Yd) * coef + Pd :  -999999;
		SC.Prc[lastX-x] = c > -999999? (c - Yd) * coef + Pd : -999999;
	}
	SC.lastX = lastX;
}
// Softで直接描画した線で混色が起きていないので、r,g 赤緑の2色から線を識別可能
// Candleを描いた上から線を描いているので検出が容易、クロスする線は欠落が生じるので線形補間する
function readCurve(SC, pixAry, rsltAry, xB, xE,yB, yE, r,g) {
	if( yB<=SC.g1d) {
		var u = SC.axPrc.u;
		var d = SC.axPrc.d;
		var Yu = SC.axPrc.Yu;
		var Yd = SC.axPrc.Yd;
	}else{
		var u  = SC.axInd.u;
		var d  = SC.axInd.d;
		var Yu = SC.axInd.Yu;
		var Yd = SC.axInd.Yd;
	}
	var coef=(u-d) / (Yu-Yd);

	var stepY=1;
	if(yB>yE)  stepY=-1;
	for (var x=xB; x>=xE; x--) {
		for(var y = yB; y!=yE; y += stepY) {
			var p = (x+(y*cw))<<2;
			if( pixAry[p]>=r-10 && pixAry[p]<=r+10 && pixAry[p+1]>=g-10 && pixAry[p+1]<=g+10 ) {	//色が一致した場合
				if(lastX<x) lastX  = x;
				rsltAry[lastX-x] = (y-Yd)*coef + d;
				break;
			} else if( x<=lastX )
				rsltAry[lastX-x] = -999999;	// 色が一致しないときは-999999を返す
		}
	}
}

function interPolate(Ary, smooth) {
	var i=Ary.length-1;
	for(  ; i>=0; i-- ) {	// 左端のデータの無い部分を除外する
		if(Ary[i] != -999999) break;
	}
	var i0=i;
	for(  ; i>=0; i-- ) {
		if(Ary[i]==-999999) {
			for( var j=i; j>=0; j-- ) {
				if(Ary[j] != -999999) {
					for(var k=i; k>j; k--) {
						Ary[k] = (Ary[i+1]*(k-j)+Ary[j]*(i+1-k))/(i+1-j);
					}
					break;
				}
			}
			i = j;
		}
	}
	//簡易smoothing 同値が発生しないように,指数平均化
	if(smooth) {
		for(i=i0-1  ; i>=0; i-- ) {
			Ary[i] = (Ary[i+1]+Ary[i])/2;
		}
	}
}

function eraseGrid(sd, rect, r,g,b){
	var val = 245;  //書き換える色の濃さ
	var w = cw;
	var h  = ch;
	for( var x = rect[0]; x<rect[2]; x++){
		for( var y=rect[1]; y<rect[3]; y++) {
			var i = (x+w*y)<<2;
			if( sd[i]    >=r-5  && sd[i]<=r+5 &&
				sd[i+1]>=g-5 && sd[i+1]<=g+5 &&
				sd[i+2]>=b-5 && sd[i+2]<=b+5 ) {
				sd[i]=val;
				sd[i+1]=val;
				sd[i+2]=val;
			}
		}
	}
}

function getPixColor(sd, x, y) {
	var yB = y-2;
	var yE = y+2;
	var stepP = cw<<2;
	var p = (x+(yB*cw))<<2;
	for(var myy = yB; myy<=yE; myy++, p += stepP) {
		if( sd[p]!=255 && sd[p+1]!=255 && sd[p+2]!=255) {	//色が白以外の場合
			var r=sd[p];
			var g=sd[p+1];
			var b=sd[p+2];
			var rgb = '#' + HEX2(r) + HEX2(g) + HEX2(b);
			return rgb;
		}
	}
}
function HEX2(v) {
	if( v<16 )  return '0' + v.toString(16) ;
	return v.toString(16) ;
}

function readColor(sd, xB, g1u, g1d) {
	var yB = g1d;
	var yE = g1u;
	var xE=20;
	if(yB>yE) { stepY=-1; stepP = -cw<<2;}
	for (var x=xB; x>=xE; x--) {       //xBから左方向に
		var Uh=-1, Ul=-1, Uc=-1;        //赤candle
		var Dh=-1, Dl=-1, Dc=-1;        //青candle
		var p = (x+(yB*cw))<<2;
		for(var y = yB; y<=yE; y += stepY, p += stepP) {
			if( sd[p]!=255) {	//色が白以外の場合
				var r=sd[p];
				var g=sd[p+1];
				var b=sd[p+2];
				var rgb = r+" "+g+" "+b;
			}
		}
	}
}

function doBGColor() {
	 //背景に色をつける------SBI, PER, PBI------
	var txt = extractCode($("#txtCode").val());	$("#txtCode").val(txt+' ');
	var codes = txt.split(' ');
	for( var i=0; i<codes.length; i++ ) {
		var code=codes[i];
		var SC=stock[code];
		if(typeof(SC)!='undefined' && SC.chartType == 'SB') {
			var chkThis = false;
			if(      SC.GcDc[0]==1       ) {bgColor_buy  (code);   chkThis = true;  }
			else if(SC.GcDc[0]==-1        ) {bgColor_sell(code);     chkThis = true; }
			else if(SC.bandWalkDn     ) bgColor_bandWalkDn(code);
			else if(SC.perfectOrderDn ) bgColor_bandWalkDn(code);
			else if(SC.bandWalkUp     ) bgColor_bandWalkUp(code);
			else if(SC.perfectOrderUp ) bgColor_bandWalkUp(code);
			else bgColor_none(code) ;
			document.getElementById(code).parentNode.children[0].checked=chkThis;
		}
	}
	sortChked();
}

function bgColor_buy(code)		  {	document.getElementById(code).parentNode.style.backgroundColor = '#ff8080';}        //red
function bgColor_sell(code)		  {	document.getElementById(code).parentNode.style.backgroundColor = '#8080ff';}        //blue
function bgColor_bandWalkUp(code) {	document.getElementById(code).parentNode.style.backgroundColor = '#ffe8e8';}    //pink
function bgColor_bandWalkDn(code) {	document.getElementById(code).parentNode.style.backgroundColor = '#d8ffd8';}    //greenyellow
function bgColor_divergence(code) {	document.getElementById(code).parentNode.style.backgroundColor = 'yellow';}
function bgColor_none(code) 	  {	document.getElementById(code).parentNode.style.backgroundColor = 'whitesmoke';}


function vline(ctx, h , color) {
	ctx.strokeStyle = color;
	ctx.lineWidth = 0.5;
	ctx.beginPath();
	ctx.moveTo(h, 3);
	ctx.lineTo(h, 190);
	//ctx.closePath();
	ctx.stroke();
}
function hline(ctx, v , color) {
	ctx.strokeStyle = color;
	ctx.lineWidth = 0.5;
	ctx.beginPath();
	ctx.moveTo(20, v);
	ctx.lineTo(540, v);
	// ctx.closePath();
	ctx.stroke();
}

function drawData(SC, ar, color, width){	//lastXは チャート 毎に異なるので追加
	var ctx = SC.ctx;
	var lastX = SC.lastX;
	var u = SC.axPrc.u;  var  Yu = SC.axPrc.Yu;
	var d = SC.axPrc.d;  var  Yd = SC.axPrc.Yd;
	var coef = (Yu-Yd)/(u-d);
	ctx.strokeStyle = color;
	ctx.lineWidth = width;
	ctx.beginPath();
	ctx.moveTo(lastX,	(ar[0]-d)*coef+Yd);
	for(var i=0; i<ar.length-1; i++){
		if(ar[i]!=-999999) ctx.lineTo(lastX-i, 	(ar[i]-d)*coef+Yd);
	}
	ctx.stroke();
}

function highest(ar, w, i) {
	if(ar.length>=i+w) 
		return Math.max.apply(Math, ar.slice(i,i+w));
	else
		return -999999;
}
function lowest(ar, w, i) {
	if(ar.length>=i+w) 
		return Math.min.apply(Math, ar.slice(i,i+w));
	else
		return -999999;
}


	//---------------------------------------------------------------
	// context.data配列arから数値を認識する
	// SBI-Chartのビットマップから単純パターンマッチングで数値OCRを行う
	// y-5,y+4の縦8bit,横5bitのパターンを縦方向のプロジェクションをとり、5桁の数字として一致検出
var OCR_SBI ={'DBB':'0',  'ABHA':'1',  'ABBBC':'2',  'CCBC':'3',  'ABBBH':'4',  'ECBC':'5',  'EACCC':'6',  'ADBBA':'7',  'DCCDC':'8',  'DCCAD':'9',  'AAAAA':'-'};
var OCR_IFIS={'DBBBD':'0',  'BBHAA':'1',  'CCCCC':'2',  'BBCCE':'3',  'CBBHA':'4',  'ECCCE':'5',  'ECCCD':'6',  'ACCCB':'7',  'ECCCE*':'8',  'DCCCE':'9', 'IFIS':true};   //'ABA': ','
function ocrNum(sd, OCR_DIC, xx, yy, w) {   //xx: 左側    yy:高さ中心     w:最大幅
	var th    = 0x40;
	var sum = 0;
	var x=xx;
	var y=yy;
	var rtn='';
	do {
		// 空白部を読み飛ばす
		for(    ; x<xx+w; x++) {
			sum = 0;
			for(var h=y-5; h<=y+5; h++) {
				var p = (h*cw + x)<<2;
				if(sd[p]<th) sum++;
			}
			if(sum>0) break;
		}
		// 次の空白が現れるまでプロジェクションのパターンを計算する
		var ptn="";
		// IFISの5と8が同じパターンになるので、横方向の射影で区別する
		var hProj=[0x30,0x30,0x30,0x30,0x30,0x30,0x30,0x30,0x30,0x30,0x30,0x30,0x30,0x30,0x30];
		for(        ; x<cw; x++) {
			sum = 0x40;
			for(var h=y-5, ix=0; h<=y+5; h++, ix++) {
				var p = (h*cw + x)<<2;
				if(sd[p]<th) {sum++, hProj[ix]++};
			}
			if(sum==0x40) break;
			ptn = ptn + String.fromCharCode(sum);
		}
		while(hProj[0]==0x30) hProj.shift();    //上から文字の始まりの位置まで読み飛ばす
		if(OCR_DIC[ptn] != undefined)
			if(OCR_DIC['IFIS'] !=undefined && ptn=='ECCCE' && hProj[0]!=0x35)
				rtn = rtn + '8';
			else
				rtn = rtn + OCR_DIC[ptn];
	} while(x<xx+w);
	return parseInt(rtn);
}


function ______CLONE_showChart_SBI______(){}
//============================================
var  gTraceBack = 1;			// 背景色の塗りつぶしを判定する区間の Bar数
var  gRandomStr ;
var  cw, ch, lastX = -1;
var  ar;
var ChartSB = function(code){
	this.chartType = 'SB';
	this.code = code;
	this.ctx;
	this.sd;
	this.randomStr = '';
	this.faorite= '';
	this.chartTerm 	= '';
	this.periodicity= '';
	this.divergence = false;
	this.bandWalkUp= false;
	this.bandWalkDn= false;
	this.GcDc = []; //DeadCross GoldenCross
	this.K=[];		// %K
	this.D=[];		// %D
	this.RCI=[];		// RCI
	this.MACD=[];		// MACD
	this.MACDsig=[];	// MACDsig
	this.Ma1=[];	// mean
	this.Ma2=[];	// mean
	this.Ma3=[];	// mean
	this.Pro=[];   // price open
	this.Prh=[];	// price high
	this.Prl=[];	// price lowF
	this.Prc=[];   // price close
	this.AHLu=[];	// 価格変動幅
	this.AHLd=[];	// 価格変動幅
	this.B3u=[];	// bollinger 3sigma
	this.B3d=[];	// bollinger 3sigma
	this.DCu=[];	// Donchan upper
	this.DCm=[];	// Donchan middle
	this.DCd=[];	// Donchan lower
	this.Vol=[];  	// Volume
	this.lastX= -1;	//Chart右端のpx座標
	this.ctx;    // canvas context
	this.cw;    // canvas幅
	this.ch ;   // canvas高さ
	this.cf;		// frameの右端位置
	this.gl = 0;	// 09:00 5日前
	this.gr = 620;		// 15:00 最終日 フレーム右端から1つ目のグリッド位置
	this.g1u = 3;       //upper_chart の上限
	this.g1d = 190;   //upper_chartの下限
	this.g2u = 206;	// lower_chartの100%
	this.g2d = 278;	// lower_chartの0%
	this.BARwidth;  // １つのCandleのpixcel幅
	this.axPrc ={u:-999999,Yu:-999999, d:-999999,Yd:-999999};   //価格軸値と座標
	this.axInd = {u:-999999,Yu:-999999, d:-999999,Yd:-999999};   //価格軸値と座標
};

function showSBChart(code, isLast) {
	var chartType= "SB";
	var chart_url = getUrlOfSB(code);
	gDClen = menuDClen[gSBper];	

	apndCanvas(code,symbolName[Number(code)]);
	var img = new Image();
	img.src = chart_url;
	img.onload = function() {
		//キャンバスを用意する
		var canvas = document.getElementById(code);
		var ctx = canvas.getContext('2d');
		canvas.width = img.width -20;		//638-28 --> 605
		canvas.height = img.height-67;	//グラフ下の凡例領域67px分を読み込まない
		ctx.drawImage( img, -20, 0 );		//キャンバスに画像を読み込む

		//graph領域position　15分足5日間
		// ctx.clearRect(gl,g1d,gr-gl,g2u-g1d); 領域の削除
		// SBI Chartを読み取る
		// CurveAry[]	右端がix=0
		cw = canvas.width;
		ch = canvas.height;
		// SBIの場合は、詳細チャートのURLの中で処理を行う
		src = ctx.getImageData(0, 0, cw, ch);	   // 作業用
		src2=ctx.getImageData(0, 0, cw, ch);    // 書き戻し用

		var sd = src.data;

		if( stock[code] == undefined || stock[code].chartType != 'SB')  {
			stock[code] = new ChartSB(code);		// rn がglobalで設定されていること
			if(Alerts[code]==undefined)
				Alerts[code] = {al0:'', al1:'', al2:'', al3:''};
		}
		// BARwidth 毎回設定
		if(isNaN(gSBper))
			stock[code].BARwidth = 510/gSBterm;
		else
			stock[code].BARwidth = 510/gSBterm/(300/gSBper+2);
			

		var SC = stock[code];
		SC.ctx = ctx;
		SC.sd  = sd;
		if( SC.randomStr 			    != gRandomStr
		   || SC.chartTerm  != gSBterm
		   || SC.periodicity	!= gSBper)
		{
			SC.randomStr 			    = gRandomStr;
			SC.chartTerm     =gSBterm;
			SC.periodicity     = gSBper;
			reculc = true;
		}

		//Alertの設定値を復元する
		var al = canvas.parentNode.getElementsByClassName('al');
		al[0].value = Alerts[code].al0;
		al[1].value = Alerts[code].al1;
		al[2].value = Alerts[code].al2;
		al[3].value = Alerts[code].al3;

		//ここで以前の配列をremoveする必要があるか？
		// 価格の桁数でグラフの横サイズが変わるので、　グラフのフレーム右端cfと、左端glと右端grのグリッド位置を検出
		SC.ctx = ctx;
		SC.cw = cw;	SC.ch = ch;
		var cf, cf2, cf3, gr, gl;
		for(cf=cw-1; cf>400 && sd[(2*cw+cf)<<2]==255; cf--) ;	//上から3pxの位置を右端-1から、白でなくなるまでスキャン
		for(cf2=cw-1; cf2>400 && sd[(10*cw+cf2)<<2]==255; cf2--) ;	//価格が上から2pxに表示され右端を検出できない場合への対応
		for(cf3=cw-1; cf3>400 && sd[(18*cw+cf3)<<2]==255; cf3--) ;	//価格が上から2pxに表示され右端を検出できない場合への対応
		cf  = Math.min(cf,cf2,cf3);     //chart領域の右端、価格軸
		for(gr=cf-1;  gr>400 && sd[(2*cw+gr)<<2]==255; gr--) ;	//上から3pxの位置をcf-1から、白でなくなるまでスキャン
		for(gl=1;      gl<100 && sd[(2*cw+gl)<<2]==255; gl++) ;	//上から3pxの位置を1から、白でなくなるまでスキャン
		gr = cf;
		gl  = 10;
		SC.cf = cf;	SC.gr = gr;	SC.gl = gl;
		var g1u = SC.g1u;
		var g1d = SC.g1d;
		var g2u = SC.g2u;	// 100%
		var g2d = SC.g2d;	// 0%
		//==========================================
		//価格軸のOCR---
		SC.axPrc.u = -999999;
		for(var y=g1u; y<g1d; y++) {
			var x = cf+2;
			if( sd[(cw*y+x)<<2]<255) {	//色が白でない==目盛りの場合
				while(sd[(cw*y+x)<<2]<255) x++; //目盛りがなくなるまで右に進んで
				var num = ocrNum(sd, OCR_SBI, x, y, cw-x);
				if(SC.axPrc.u==-999999) {
					SC.axPrc.u   = num;
					SC.axPrc.Yu = y;
				}
				SC.axPrc.d   = num;
				SC.axPrc.Yd = y;
			}
		}
		//インジ軸のOCR---
		for(var y=g2u; y<g2d; y++) {
			var x = cf+1;
			if( sd[(cw*y+x)<<2]<255) {	//色が白でない==目盛りの場合
				while(sd[(cw*y+x)<<2]<255) x++; //目盛りがなくなるまで右に進んで
				var num = ocrNum(sd, OCR_SBI, x, y, cw-x);
				if(SC.axInd.u==-999999) {
					if(gTechLO=="RCI")  num = 100;	// 時々 間違えるので強制的にセット
					SC.axInd.u   = num;
					SC.axInd.Yu = y;
				}
				SC.axInd.d   = num;
				SC.axInd.Yd = y;
			}
		}
		//================================================================
		//================================================================
		//UP足  Red		rgb(255,   0,  51)	//DN足 Navy	rgb(  0, 51,153)
		//出来高 DarkGr	rgb(102,102,102)	   //罫線  Gray	rgb(153,153,153)
		lastX = -1;	//chart毎に右端を計算する

		eraseGrid(sd, [10,   5,cf-5,187], 0x9e,0x9e,0x9e);          //sdを書き換えて　Gridを消去
		eraseGrid(sd, [10,205,cf-5,275], 0x9e,0x9e,0x9e);          //sdを書き換えて　Gridを消去
		eraseGrid(sd, [10,   5,cf-5,187], 0x99,0xcc,0x00);          //sdを書き換えて　Gridを消去
		ctx.putImageData(src,0,0,0,0,cw,ch); //canvasに書き出す

		SC.Prh=[]; SC.Prc=[]; SC.Prl=[]; 
		readCandle(SC, sd,       gr, gl, g1u, g1d);
		interPolate(SC.Prc, false);
		interPolate(SC.Prh, false);
		interPolate(SC.Prl, false);
		while(SC.Prh[SC.Prh.length-1] ==-999999) {
			SC.Prh.pop();
			SC.Prc.pop();
			SC.Prl.pop();
		}

		// calc Donchan
		SC.DCu=[]; SC.DCm=[]; SC.DCd=[];	// 前の時間足のデータをクリアする
		var iLen = Math.round(gDClen*SC.BARwidth);
		var h = SC.Prh, l = SC.Prl;
		var DCu=SC.DCu, DCd=SC.DCd, DCm=SC.DCm;
		for( var i=h.length-iLen-1; i>=0; i--) {
				DCu[i] = highest(h, iLen, i);
				DCd[i] = lowest(l, iLen, i);
				DCm[i]= (DCu[i] + DCd[i])/2;
		}
		// SMA3 AHLの  時は 自動的にDonchanを表示する
		if(gTechUP=="SMA3" || gTechUP=="AHL" || (gTechUP=="BOL" && gDCanytime)) {
			drawData( SC, SC.DCu , 'red',      1 );	//
			drawData( SC, SC.DCd , 'blue',    1 );
			drawData( SC, SC.DCm, 'purple', 1 );
		}
		
		if(gTechUP=="BOL" && (reculc || SC.B3u.length==0)) {
			readCurve(SC, sd, SC.B3u, gr, gl, g1u, g1d,     0, 204);	// 3σU Aqua
			readCurve(SC, sd, SC.B3d, gr, gl, g1d, g1u,     0, 204);	// 3σD Aqua
			interPolate(SC.B3u, true);
			interPolate(SC.B3d, true);
			while(SC.B3u[0]<0 || SC.B3d[0]<0) {
				SC.B3u.shift();
				SC.B3d.shift();
				SC.Prc.shift();  SC.Prh.shift();  SC.Prl.shift();
			}
		} if((gTechUP=="SMA3" || gTechUP=="WMA3")  && (reculc || SC.Ma1.length==0)) {
			readCurve(SC, sd, SC.Ma1, gr, gl, g1u, g1d,   153, 204);	// MA3 Olive
			readCurve(SC, sd, SC.Ma2, gr, gl, g1u, g1d,   153,   0);	// MA2 Magenta
			readCurve(SC, sd, SC.Ma3, gr, gl, g1u, g1d,   255,  51);	// MA3 red
			interPolate(SC.Ma1, true);
			interPolate(SC.Ma2, true);
			interPolate(SC.Ma3, true);
			while(SC.Ma1[0]<0 || SC.Ma2[0]<0 || SC.Ma3[0]<0) {
				SC.Ma1.shift();
				SC.Ma2.shift();
				SC.Ma3.shift();
			}
		} if(gTechUP=="AHL"  && (reculc || SC.AHLu.length==0)) {
			readCurve(SC, sd, SC.AHLu,  gr, gl, g1u, g1d, 153,    0);	//　%D SlowStoch Purple
			readCurve(SC, sd, SC.AHLd,  gr, gl, g1d, g1u, 153,    0);	//　%D SlowStoch Purple
			interPolate(SC.AHLu, true);                 //ラインの欠落を補間する
			interPolate(SC.AHLd, true);                 //ラインの欠落を補間する
			while(SC.AHLu[0]<0 || SC.AHLd[0]<0) {
				SC.AHLu.shift();
				SC.AHLd.shift();
			}
		} if(gTechLO=="RCI"  && (reculc || SC.RCI.length==0)) {
			readCurve(SC, sd, SC.RCI,      gr, gl, g2u, g2d, 153,    0);	//　%D SlowStoch Purple
			interPolate(SC.RCI, true);                 //ラインの欠落を補間する
			while(SC.RCI[0]<-200)     SC.RCI.shift(); //pxを検出できなくて発生した異常値を削除する
			var yp80  = Math.round((17*SC.axInd.Yu+  3*SC.axInd.Yd)/20);
			var ym80 = Math.round((  3*SC.axInd.Yu+17*SC.axInd.Yd)/20);
			hline(ctx, yp80, '#d0d0d0');
			hline(ctx, ym80,'#d0d0d0');
		} if(gTechLO=="SS"  && (reculc || SC.D.length==0)) {
			readCurve(SC, sd, SC.D,      gr, gl, g2u, g2d,153,      0);	//　%D SlowStoch Purple　
			readCurve(SC, sd, SC.K,      gr, gl, g2u, g2d,153, 204);	//　%K SlowStoch Olive
			interPolate(SC.D, true);                //ラインの欠落を補間する
			if(SC.K[0] < 0 ) SC.K[0]= SC.D[0];  //最新のK値が欠落していたらDで補う
			interPolate(SC.K, true);
			while(SC.D[0] <0  && SC.K[0] < 0) {
				SC.D.shift();
				SC.K.shift();
			}
		} if( gTechLO=="MD"  && (reculc || SC.MACD.length==0)) {
			readCurve(SC, sd, SC.MACDsig,     gr, gl, g2u, g2d,153,      0);	//　%D SlowStoch Purple　
			readCurve(SC, sd, SC.MACD       ,     gr, gl, g2u, g2d,153, 204);	//　%K SlowStoch Olive
			interPolate(SC.MACD, true);                //ラインの欠落を補間する
			if(SC.MACDsig[0]==-999999) SC.MACDsig[0]= SC.MACD[0];  //最新のMACDsig値が欠落していたらMACDで補う
			interPolate(SC.MACDsig, true);
			while(SC.MACD[0] <-100000 || SC.MACDsig[0] <-100000) {
				SC.MACD.shift();
				SC.MACDsig.shift();
			}
		}
		SC.lastX = lastX;
		//================================================================
		// Chartの ディジタイズ 終了
		//================================================================


		//================================================================
		//= Chart領域        =====================================================
		//================================================================
		//  const yellow_green = "#90EE90";
		//  BandWalk:       BOL 1.2sigma以上
		//  OverBought:    BOL  2.3sigma以上
		//  PerfectOder:    SMA, EMA
		var judgeSpan = Math.round(SC.BARwidth*(gTraceBack+0.5));		// 背景色の塗りつぶしを判定する区間の px値
		//====================
		//== Golden Cross  Dead Cross　縦線を引く
		//====================
		for( var x=SC.gl+1, i=SC.lastX-SC.gl-1; x<=lastX; x++, i-- ) {
			var w=Math.round(5*SC.BARwidth); 
			SC.GcDc[i] = 0;
			if (gTechLO=="RCI") {  
				if(SC.RCI[i+1]<-30  && SC.RCI[i+2]>SC.RCI[i+1] && (SC.RCI[i+1])<SC.RCI[i]  && SC.RCI[i+2]!=-999999) {   //-- GC
						drawGCDCmark(SC, "#FF8080", i);
						SC.GcDc[i] = 1;
				}
				if(SC.RCI[i+1]>30  && SC.RCI[i+2]<SC.RCI[i+1] && (SC.RCI[i+1])>SC.RCI[i]  && SC.RCI[i+2]!=-999999) {	 //-- DC
						drawGCDCmark(SC, "#8080FF", i);
						SC.GcDc[i] = -1;
				}
			} if (gTechLO=="SS") {    
				if(SC.D[i+1]>=75  && SC.D[i+1]<=SC.K[i+1] && SC.D[i]>SC.K[i] && SC.K[i]!= -999999) {                    //-- DC (SS)
						drawGCDCmark(SC, "#8080FF", i);
						if(i<judgeSpan) SC.GcDc[i]   = -1;
				}
				if(SC.D[i+1]<=25 && SC.D[i+1]>=SC.K[i+1] && SC.D[i]<SC.K[i] && SC.K[i]!= -999999) 	{                    //-- GC (SS)
						drawGCDCmark(SC, "#FF8080", i);
						if(i<judgeSpan) SC.GcDc[i] = 1;
				}
			} if (gTechLO=="MD") {  
				if(SC.MACD[i+1]>SC.MACDsig[i+1] && SC.MACD[i]<=SC.MACDsig[i]  && SC.MACDsig[i+1]!=-999999) {     //-- DC (MACD)
						drawGCDCmark(SC, "#8080FF", i);
						if(i<judgeSpan) SC.GcDc[i]   = -1;
				}
				if(SC.MACD[i+1]<SC.MACDsig[i+1] && SC.MACD[i]>=SC.MACDsig[i]  && SC.MACD[i+1]!=-999999) {	     //-- GC (MACD)
						drawGCDCmark(SC, "#FF8080", i);
						if(i<judgeSpan) SC.GcDc[i] = 1;
				}
			}
		}
		//=======================================
		//= Trend 領域 色塗り       =======================
		//=======================================
		//clear
		SC.clearZone(0);
		SC.clearZone(1);
		SC.clearZone(2);
		
		SC.bandWalkUp     = false;  SC.bandWalkDn     = false;
		SC.perfectOrderUp = false;  SC.perfectOrderDn = false;
		for( var x=SC.gl+1, i=SC.lastX-SC.gl-1; x<=lastX; x++, i-- ) {
			if(SC.Prh[i]==-999999) continue;
			//====================
			//== 価格変動幅 ===
			//====================
			if(gTechUP=="AHL"  && (reculc || SC.AHLu.length==0)) {
				if(SC.Prh[i]==-999999) continue;
				if(SC.Prh[i]<=SC.AHLu[i]) {
					SC.fillZone(0, '#4040FF', i);
					if(i<judgeSpan) SC.perfectOrderDn = true;
				}
				if(SC.Prl[i]>=SC.AHLd[i] ) {
					SC.fillZone(0, '#FF4040', i);
					if(i<judgeSpan) SC.perfectOrderUp = true;
				}
			} else if(gTechUP=="BOL") {
				if(SC.B3u[i]==-999999) continue;
				var  ma   = (SC.B3u[i]+SC.B3d[i])/2;
				var  dev =  (SC.B3u[i]-SC.B3d[i])/6;
				//== band walk of BB ==
				if(SC.Prc[i]>(ma+dev)) {
					if(SC.Prh[i]>(ma+1.0*dev) && SC.RCI[i]>0)    SC.fillZone(0, 'pink', i);
					if(i<judgeSpan) SC.bandWalkUp = true;
				}
				if(SC.Prc[i]<(ma-dev)) {
					if(SC.Prl[i]<(ma-1.0*dev) && SC.RCI[i]<-0)     SC.fillZone(0, '#90EE90', i); 
					if(i<judgeSpan) SC.bandWalkDn = true;
				}
				//-- extreme  of BB
				if(SC.Prh[i]>=(ma+2.0*dev) && SC.B3u[i]>=0)  SC.fillZone(0, 'red', i);
				if(SC.Prl[i] <=(ma-2.0*dev)   && SC.B3d[i]>=0) SC.fillZone(0, 'blue', i);
			//====================
			//== Perfect Order of SMA3
			//====================
			} else  if(gTechUP=="SMA3" || gTechUP=="EMA3") {
				if(SC.Ma1[i]==-999999) continue;
				if(SC.Prc[i]>=SC.Ma1[i] && SC.Ma1[i]>=SC.Ma2[i] && SC.Ma2[i]>=SC.Ma3[i]) {
					SC.fillZone(0, '#FF4040', i);
					if(i<judgeSpan) SC.perfectOrderUp = true;
				}
				if(SC.Prc[i]<=SC.Ma1[i] && SC.Ma1[i]<=SC.Ma2[i] && SC.Ma2[i]<=SC.Ma3[i])  {
					SC.fillZone(0, '#4040FF', i);
					if(i<judgeSpan) SC.perfectOrderDn = true;
				}
			}
			if(SC.DCu.length>i && SC.Prh.length>i){
				if(SC.Prh[i]==SC.DCu[i])	SC.fillZone(1, 'red', i);
				if(SC.Prl[i]==SC.DCd[i])	SC.fillZone(1, 'blue', i);
			}
		}	//--Trend のZoneに色を塗る end --

		//=======================================
		//= Oscilator 領域 色塗り       =======================
		//=======================================

		for( var x=SC.gl+1, i=SC.lastX-SC.gl-1; x<=lastX; x++, i-- ) {
			var w=Math.round(5*SC.BARwidth); 
			if(SC.RCI[i]>-100){
					if(lowest(SC.GcDc, w, i) != 0 && SC.RCI[i+1]>SC.RCI[i]) {    // DC から5バー以内なら blue
						SC.fillZone(2, '#4000FF', i);
					}
					if(highest(SC.GcDc, w, i) != 0 && SC.RCI[i+1]<SC.RCI[i]) {   // GC から5バー以内なら red
						SC.fillZone(2, '#FF0040', i);
					}
			}
			if(SC.MACD[i]>-999999){
				if(SC.MACD[i]>SC.MACDsig[i]) {    
					SC.fillZone(2, '#4040FF', i);
				}
				if(SC.MACD[i]<SC.MACDsig[i]) {   
					SC.fillZone(2, '#FF4040', i);
				}
			}
		}
		
		//-- タイトルに足と期間を表示
		setTitle();
		$('#menuPerTerm').val(gSBper+','+gSBterm);	//select optionの設定
		

		// チャートの背景を色塗り
		if( isLast )	doBGColor();

	}	// end img.onload
}
function drawGCDCmark(SC, color , i ) {
	SC.ctx.fillStyle = color;  SC.ctx.fillRect(SC.lastX-i, SC.g2u, 1, SC.g2d-SC.g2u);
}
function setTitle() {
	document.title = perTermHtml();
}


//============================================
function perTermHtml() {
	if( gSBterm<=20 )
		return  gSBper + '分' + gSBterm + '日';
	else
		return  {
			'D': {'120': '日足6 か月', '240': '日足1 年'},
			'W': {'52': '週足1年', '104': '週足2年',  '156': '週足3年',  '260': '週足5年'},
			'M': {'12': '月足1年', '24': '月足2年',  '36': '月足3年',  '100': '月足5年',  '200': '月足10年'}
			}[gSBper][gSBterm];
}
function randomStr(length) {
	if (length) {
		var arr = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789'.split('');
		var str = '';
		for (var i = 0; i < length; i++) {
			str += arr[Math.floor(Math.random() * arr.length)];
		}
		return str;
	} else {
		var rn;
		var date = new Date();
		// 09:00以前と、15:00以降はチャートをキャッシュから読み取るため、random Strの値を固定する
		var	formattedDate = [
				date.getFullYear(),
				('0' + (date.getMonth() + 1)).slice(-2),
				('0' + date.getDate()).slice(-2)
			].join('/');
		var hhmm=date.getHours()*60+date.getMinutes();
		var interval = Math.max( $('#menuAutoUpdate').val(), 1);
		hhmm = Math.floor(hhmm/interval) * interval;
		if(hhmm<540)    //09:00
			rn =  Date.parse( formattedDate + ' 00:00:00');
		else if(hhmm>690 && hhmm<750)   //11:30-12:30
			rn =  Date.parse( formattedDate + ' 11:30:00');
		if(hhmm>900)    //15:00
			rn =  Date.parse( formattedDate + ' 15:00:00');
		else
			rn =  Math.round(date.getTime()/120000)*120000;	//2分以内にチャートの更新はしない
		return rn;
	}
}

// class='memo'領域を追加
function technicalUpper_val() {
	var ar = document.URL.slice(document.URL.indexOf('mode=')).split('&');
	return ar[3].replace('addon=', '');
}

function technicalLower_val() {
	var ar = document.URL.slice(document.URL.indexOf('mode=')).split('&');
	return ar[4].replace('sub=', '');
}

function ______CLONE_showChart_PER_PBR______(){}
var ChartPER = function(code){
	this.chartType = 'PER';
	this.code = code;
	this.ctx;
	this.sd;
	this.randomStr = 0;

	this.PERu2=[];   // 緑
	this.PERd2=[];   // 紫
	this.Prc=[];   // price close
	this.Color= '';
	this.lastX= -1;	//Chart右端のpx座標
	this.cw;     // canvas幅
	this.ch ;     // canvas高さ
	this.gl =   90;	     // チャート領域の左端
	this.gr = 470;		 // チャート領域の右端
	this.g1u = 30;     //チャート領域の上限
	this.g1d = 250;   //チャート領域の下限
	this.BARwidth;
	this.axPrc ={u:this.g1d,Yu:this.g1u, d:this.g1u,Yd:this.g1d};   //座標の上下を反転させておく
};
function showPERChart(code,  isLast) {
	showPERPBRChart(code, getUrlOfPER(code), isLast);
}
function showPBRChart(code,  isLast) {
	showPERPBRChart(code, getUrlOfPBR(code), isLast);
}
function showPERPBRChart(code, url, isLast) {
	apndCanvas(code,symbolName[Number(code)]);

	var img = new Image();
	img.src = url ;     //	テスト時は img.src = "7203.png";
	img.onload = function() {
		//キャンバスを用意する
		var canvas = document.getElementById(code);
		var ctx = canvas.getContext('2d');
		canvas.width = img.width;
		canvas.height = img.height;
		ctx.drawImage( img, 0, 0 );		//キャンバスに画像を読み込む

		cw = canvas.width;
		ch = canvas.height;
		src = ctx.getImageData(0, 0, cw, ch);	   // 作業用
		var sd = src.data;
		if( stock[code] == undefined || stock[code].chartType != 'PER')  {
			stock[code] = new ChartPER(code);		// rn がglobalで設定されていること
			if(Alerts[code]==undefined)
				Alerts[code] = {al0:'', al1:'', al2:'', al3:''};
			stock[code].BARwidth = 2;
		}

		var SC = stock[code];
		SC.ctx = ctx;
		SC.sd  = sd;
		SC.cw = cw;	SC.ch = ch;
		//================================================================
		//================================================================

		SC.axPrc.u = ocrNum(sd, OCR_IFIS, 27, SC.g1u, 48);
		SC.axPrc.d = ocrNum(sd, OCR_IFIS, 27, SC.g1d, 48);
		SC.axPrc.Yu = SC.g1u;
		SC.axPrc.Yd = SC.g1d;

		//Alertの設定値を復元
		var al = canvas.parentNode.getElementsByClassName('al');
		al[0].value = Alerts[code].al0;
		al[1].value = Alerts[code].al1;
		al[2].value = Alerts[code].al2;
		al[3].value = Alerts[code].al3;

		//UP足  Red		rgb(255,   0,  51)	//DN足 Navy	rgb(  0, 51,153)
		//出来高 DarkGr	rgb(102,102,102)	   //罫線  Gray	rgb(153,153,153)
		lastX = SC.gr;	//chart毎に右端を計算する
		SC.lastX = lastX;

		readCurve(SC, sd, SC.Prc,          SC.gr, SC.gl, SC.g1u, SC.g1d,  84,    82);
		readCurve(SC, sd, SC.PERu2,      SC.gr, SC.gl, SC.g1u, SC.g1d,  36,  194);
		readCurve(SC, sd, SC.PERd2,      SC.gr, SC.gl, SC.g1u, SC.g1d, 132,     2);
		interPolate(SC.Prc, true);                 //ラインの欠落を補間する
		interPolate(SC.PERu2, true);                 //ラインの欠落を補間する
		interPolate(SC.PERd2, true);                 //ラインの欠落を補間する

		var judgeSpan = Math.round(SC.BARwidth*(gTraceBack+0.5));		// 背景色の塗りつぶしを判定する区間の px値
		for( var x=SC.lastX, i=0; x>SC.gl; x--, i++ ) {		//-- 塗りつぶし bgn --
			var mid = (SC.PERu2[i]+SC.PERd2[i])/2;
			if(SC.Prc[i]>0.99*SC.PERu2[i]) {
				ctx.fillStyle = "#24c264";                 //green
				ctx.fillRect(SC.lastX-i, SC.g1d+1, 2, 10);
				if(i<judgeSpan) {
					document.getElementById(code).parentNode.style.backgroundColor = 'limegreen';
					SC.Color = 'g';
				}
			}else if(SC.Prc[i]<1.005*mid && SC.Prc[i]>0.995*mid) {
				ctx.fillStyle = "#fc4a74";                //red
				ctx.fillRect(SC.lastX-i, SC.g1d+1, 2, 10);
				if(i<judgeSpan) {
					document.getElementById(code).parentNode.style.backgroundColor = 'salmon';
					SC.Color = 'r';
				}
			}else if(SC.Prc[i]<1.01*SC.PERd2[i]) {
				ctx.fillStyle = "#a422fc";                 //purple
				ctx.fillRect(SC.lastX-i, SC.g1d+1, 2, 10);
				if(i<judgeSpan) {
					document.getElementById(code).parentNode.style.backgroundColor = 'plum';
					SC.Color = 'p';
				}
			}else{
				if(i<judgeSpan) {
					document.getElementById(code).parentNode.style.backgroundColor = 'white';
					SC.Color = '';
				}
			}
		}
		if(isLast) setTimeout(function () {
			doPERSort('p');         sortChked();
			doPERSort('r');         sortChked();
			doPERSort('g');         sortChked();
		}, 1000);
	}
}

function doPERSort(color) {
	var txt = extractCode($("#txtCode").val());	$("#txtCode").val(txt+' ');
	var codes = txt.split(' ');
	for( var i=0; i<codes.length; i++ ) {
		var code=codes[i];
		var SC=stock[code];
		if(SC.Color==color)
			document.getElementById(code).parentNode.children[0].checked=true;
		else
			document.getElementById(code).parentNode.children[0].checked=false;
	}
}
//===================================================================
//===================================================================
