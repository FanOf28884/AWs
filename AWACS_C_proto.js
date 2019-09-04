const yellow_green = '#90EE90';
const light_blue = '#8080FF';
const pink = '#FF7f50';
 
var i, SC;
ChartSB.prototype = {
    getCode: function () {
        return this.code;
    },
    clearZone: function (n) {
        this.ctx.fillStyle = '#FFFFFF';
        this.ctx.fillRect(this.gl, this.g1d - 5 + 7 * n, this.lastX - this.gl, 7);
        return this;
    },
    fillZone: function (n, color, i) {
        this.ctx.fillStyle = color;
        this.ctx.fillRect(this.lastX - i, this.g1d - 5 + 7 * n, 3, 6);
        return this;
    },
    drawAHL: function () {
        for (var i = this.AHLu.length - 1; i >= 0; i--) {
            if (this.Prh[i] <= this.AHLu[i])
                this.fillZone_1('#4040FF', i);
            if (this.Prl[i] >= this.AHLd[i])
                this.fillZone_1('#FF4040', i);
        }
        return this;
    },
    B3mTouch: function () {
        var B3u = this.B3u;
        var B3d = this.B3d;
        var Prh = this.Prh;
        var Prl = this.Prl;
        for (var i = B3u.length - 1; i >= 0; i--) {
            var ma = (B3u[i] + B3d[i]) / 2;
            if (Prh[i] >= ma && ma >= Prl[i])
                this.fillZone_1('black', i);
        }
        return this;
    },
	bgn: function(){
		this.result = true;
		return this;
	},
	end: function(){
		return this.result;
	},
	oBOT: function(){
		this.result = this.RCI[i]>=80;
		return this;
	},
	oBOT: function(){
		this.result = this.RCI[i]<=-80;
		return this;
	},
	PrGT: function(val){
		this.result = this.Prh[i]>val;
		return this;		
	},
	PrLT: function(val){
		this.result = this.Prl[i]<val;
		return this;		
	},
	DiffMaLT: function(val){
		var ma = (this.B3u[i]+this.B3d[i])/2;
		var hl = (this.Prh[i]+this.Prl[i])/2
		this.result = Math.abs(hl-ma)/ma*100<val;
		return this;		
	},
	GCros: function(){
		this.result= this.GcDc[i]==1;
		return this;		
	},
	DCros: function(){
		this.result= this.GcDc[i]==-1;
		return this;		
	},
	DCuTouch: function(){
		this.result= this.DCu[i]==this.Prh[i];
		return this;		
	},
	DCdTouch: function(){
		this.result= this.DCd[i]==this.Prl[i];
		return this;		
	},
}

function test(code){
	SC=stock[code];
	SC.clearZone(1);
	SC.tmp=[];
	for(i=0; i<SC.RCI.length; i++){
		SC.tmp[i] = SC.bgn().DiffMaLT(0.1).end();
	}
	for(i=0; i<SC.RCI.length; i++){
		if(SC.tmp[i])	SC.fillZone(1,'black',i);
	}
}

