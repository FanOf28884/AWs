
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
	if(gChartMode=='SB' && (window.screen.width==1200 || window.screen.width==1800))
		buff = buff.replace(/80%/g, '70%');
	if(gChartMode!='SB')
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
	var url = document.URL;
	var src = url.slice(0, url.indexOf('graph')+6)+'pbr_range75/n/';
	src += code + ".gif";
	return src;
}
function getUrlOfPER(code) {
	var url = document.URL;
	var src = url.slice(0, url.indexOf('graph')+6)+'per_range75/n/';
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

