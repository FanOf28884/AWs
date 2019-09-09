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
var gChartMode;
var gCodes = [];
var gClippingMode = false;	// クリックで画像保存
var gDClen = 16;				// Donchan幅
var gDCanytime= true;		// Donchanを 常に表示
var gClickedCode;				// 最後にクリックされたcode
var gPickedColor;				// 最後にクリックされた上下2px以内のカラーcode
function changeChart() {
	if(document.URL.indexOf('https://chart.iris.sbisec.co.jp')==0) {
		gChartMode = 'SB';
		document.title = gSBper + '  ' + gSBterm;
	} else if(document.URL.indexOf('https://kabuyoho.ifis.co.jp/img/graph/pbr_range75')==0)
		gChartMode = 'PBR';
	else if(document.URL.indexOf('https://kabuyoho.ifis.co.jp/img/graph/per_range75')==0)
		gChartMode = 'PER';

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
		if(gChartMode=='SB')             showSBChart(code,   isLast);
		if(gChartMode=='PER')           showPERChart(code, isLast);
		if(gChartMode=='PBR')           showPBRChart(code, isLast);
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
	if(gChartMode=='SB' && (window.screen.width==1200 || window.screen.width==1800))
		buff = buff.replace('1em', '0.9em');
	if(gChartMode!='SB')
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
	if(code=='') return;
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
// function workingDays(sDay) {
	// if(sDay.length==5)
		// sDay = (new Date()).getFullYear()+'/'+sDay;
	// var date1 = new Date(sDay);
	// var date2 = new Date();
	// var msDiff = date2.getTime() - date1.getTime();				// getTimeメソッドで経過ミリ秒を取得し、日付の差を求める
	// var daysDiff = Math.floor(msDiff / (1000 * 60 * 60 *24));	// 求めた差分（ミリ秒）を日付へ変換します
	// var dayofweek1 = date1.getDay();
	// var dayofweek2 = date2.getDay();
	// if(dayofweek1 == 0 || dayofweek1 == 6) dayofweek1 = 5;		// 今日が土日なら金曜日として計算する
	// if(dayofweek2 == 0 || dayofweek2 == 6) dayofweek2 = 5;		// 今日が土日なら金曜日として計算する
	// var wkDayDiff= Math.floor(daysDiff/7)*5 + ((dayofweek2-dayofweek1 +5) % 5);
	// return wkDayDiff;
// }

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
	$('#txtCode').val( getLocalStorage('memory') );
	changeChart();
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
