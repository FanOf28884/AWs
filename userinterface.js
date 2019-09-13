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
			txt =  txt.replace('js:','').replace('javascript:','');
			eval(txt);
		}
		$("#fName").val('');
		return ;
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


	$("select#arFname").on('change', function() {
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
