menuPerTerm =  {'5分1日':'5,1','5分2日':'5,2', '5分3日':'5,3', '5分5日':'5,5', '15分5日':'15,5', '15分10日':'15,10', '15分20日':'15,20', '60分20日':'60,20',
	'日足6か月':'D,120', '日足1年':'D,240', '週足3年':'W,156', '月足10年':'M,120'};
setLocalStorage('menuPerTerm', menuPerTerm);

menuAutoUpdate = {'1分更新':1, '2分更新':2, '5分更新':5, '15分更新':15, '30分更新':30, '60分更新':60};
setLocalStorage('menuAutoUpdate', menuAutoUpdate);

menuAlerts = {SNS: 1, TTS: 2, SNSTTS: 3};
setLocalStorage('menuAlerts', menuAlerts);

menuScreening = {SNS: 1, TTS: 2, SNSTTS: 3};
setLocalStorage('menuScreening', menuScreening);

//Screeningのコードはmenuの一つ下に書く

menuIndicatorType = { 'BOL RCI': 'BOL,RCI', '価格変動幅 RCI': 'AHL,RCI',  'SMA3 RCI': 'SMA3,RCI', 'BOL MACD': 'BOL,MD' };
setLocalStorage('menuIndicatorType', menuIndicatorType);

menuDClen = {'5': 30, '15': 15, '60': 15, 'D':15, 'W':15, 'M':15};
setLocalStorage('menuDClen', menuDClen);
