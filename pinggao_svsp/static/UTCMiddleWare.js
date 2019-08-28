/*-----
	版本号V5.2.3.2
	版本命名规范：V版本号.不兼容更新.普通更新.更新次数
	该接口库负责中间件主体功能和通用接口功能
	示例：
	UTCMiddleWare.GetVersion({success:function(version){},fail:function(msg){},error:function(msg){}});
-----*/
//主体
function UTCMiddleWare_Function(){
	var self=this;
	self.code='M0gvP4xYxcLOri7L73Tvom2IKCrOTkhyjmUw1RIZZQDYHm0Bx29XPz7AKSMGE2cU9GHL39MNAKspH73yyCJJ8eZ1PM7p+4vMENDTjMSZNrXvatizGCrkC2Z6Cklgf4THpaHrSLVMpyJ5Zx8XXHo0scSevJ6buhI/Yy8xvpHBcDc=';
	self.version='';
	self.isloading=true;
	self.loadingflag=null;
	self.usekey=false;
	self.vnum=null;
	self.initsure=true;
	self.errorstate={
		//通用
		0x07000000:'（第三方错误/系统错误)',
		0x07000001:'请先启动电子钥匙辅助控件',
		0x07000002:'电子钥匙辅助控件请求超时',
		0x07000003:'电子钥匙辅助控件拒绝访问',
		0x07000004:'缺少参数或参数格式错误',
		0x07000005:'没有找到指定挂载的接口库',
		0x07000006:'参数格式错误无法解析',
		0x07000007:'无法连接外部服务',
		0x07000008:'外部服务请求超时',
		0x07000009:'外部服务拒绝访问',
		0x07000010:'取消选择印章',
		0x0700000A:'钥匙中缺少公章信息',
		0x0700000B:'钥匙中缺少法人章/签字信息',
		0x0700000C:'没有符合筛选条件的证书',
		0x0700000D:'钥匙中缺少印章信息'
	};
	
	self.AddPlugin=function(json){
		//挂载其他接口库
		var pluginlist=['Inside','Evaluate','Idcard','Ui','Hidden'];
		function loop(num){
			if(eval('json.'+pluginlist[num].toLowerCase())){
				self.tool.loadjs(eval('json.'+pluginlist[num].toLowerCase()),function(bool){
					if(bool){
						try{
							eval('self.'+pluginlist[num]+'=new UTCMiddleWare_'+pluginlist[num]+'()');
							json.success('UTCMiddleWare.'+pluginlist[num]);
						}catch(e){
							json.fail('0x07000005',self.errorstate[0x07000005]+','+e.message);
						}
					}else{
						json.fail('0x07000005',self.errorstate[0x07000005]);
					};
					if(num<pluginlist.length-1){
						num++;
						loop(num);
					};
				});
			}else{
				if(num<pluginlist.length-1){
					num++;
					loop(num);
				};
			};
		};
		loop(0);
	};
	//成功回调
	self.successcallback=function(json,data){
		if(typeof(json.success)=='function'||typeof(json.finish)=='function'){
			json.success(data);
		}else{
			alert(data);
		};
	};
	//错误回调
	self.errorcallback=function(json,state,code,data){
		if(state=='fail'){
			debugger;
			if(typeof(json.fail)=='function'||typeof(json.finish)=='function'){
				json.fail(code,data);
			};
		};
		if(state=='error'){
			debugger;
			if(typeof(json.error)=='function'||typeof(json.finish)=='function'){
				json.error(code,data);
			};
		};
	};
	//请求
	self.LocalAjaxPost=function(json,callback){
		try{
			try{
			eval("json = '"+JSON.stringify(json)+"';");
			}catch(e){
				callback('fail','0x07000006',self.errorstate[0x07000006]);
				return false;
			}
			var url = 'http://127.0.0.1:58902/UTCDaemon/';
			if(document.location.protocol=='https:'){
				url = 'https://daemon.utcsoft.com:58912/UTCDaemon/';
			};
			function postfn(){
				var request;
				if(window.ActiveXObject&&self.vnum<9){
					request =new ActiveXObject('Microsoft.XMLHttp'); 
				}else{
					request =new XMLHttpRequest();
				};
				request.open('POST', url,true);
				request.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded; charset=UTF-8');
				request.onreadystatechange= function(){
					if(request.readyState == 4) {
						if(request.status == 200) {
							var obj = JSON.parse(request.responseText);
							if(obj.code=='0'){
								callback('success',obj.code,obj.result);
							}else{
								callback('fail',obj.code,obj.errormsg);
							};
						}else{
							//window.location = "../";
							callback('fail','0x07000001',self.errorstate[0x07000001]);
						};
					};
				};
				json=json.replace(/\\/ig,"\\\\"); 
				//eval("json = '"+json+"';");
				request.send('json=' + json);
			};
			if(navigator.userAgent.indexOf('Trident/')>=0){
				var shitie;
				if(window.ActiveXObject&&self.vnum<9){
					shitie = new ActiveXObject('Microsoft.XMLHttp'); 
				}else{
					shitie = new XMLHttpRequest();
				};
				shitie.open('Get', url,true);
				shitie.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded; charset=UTF-8');
				shitie.onreadystatechange= function(){
					if(shitie.readyState == 4) {
						postfn();
					};
				};
				shitie.send();
			}else{
				postfn();
			};
		}catch(e){
			callback('fail','0x07000001',self.errorstate[0x07000001]);
		};
	};
	//外部请求
	self.WebAjaxPost=function(json,callback){
		try{
			var url=json.url;
			var request = new XMLHttpRequest();
			request.open('POST', url,true);
			request.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded;charset=utf-8');
			request.onreadystatechange= function(){
				if(request.readyState == 4) {
					if(request.status == 200) {
						var obj = JSON.parse(request.responseText);
						callback('success',obj);
					}else{
						callback('fail','0x07000007',self.errorstate[0x07000007]);
					};
				};
			};
			json = (function(obj){ // 转成post需要的字符串.
			    var str = "";
			    for(var prop in obj){
			        str += prop + "=" + obj[prop] + "&"
			    };
			    str=str.substring(0,str.length-1);
			    return str;
			})(json);
			request.send(json);
		}catch(e){
			//console.log(e.message);
			callback('fail','0x07000007',self.errorstate[0x07000007]);
		};
	};
	self.Initialize=function(json){
		if(self.initsure){
			self.initsure=false;
			self.tool=new UTCMiddleWare_Tool();
			self.daemon=new UTCMiddleWare_Daemon();
			if(self.tool.Ie7()){
				alert('请使用IE8及以上内核的浏览器或非IE内核浏览器');
			};
			self.ApiInit();
		};
		try{json.success();}catch(e){};
	};
};
//接口库
/*-----
可调用接口：
	初始化
	获取钥匙信息
	获取证书信息
	获取文件路径
	删除文件
	检测钥匙Pin码
	数字签名
	验证数字签名
	数据加密
	电子签章
	读取身份证
	生成签章数据
	按坐标本地签章
	按关键字本地签章
-----*/
function UTCMiddleWare_Api(){
	var s=null;
	var _s=this;
	//获取中间件版本号
	_s.GetVersion=function(json){
		s.daemon.PluginVersion(function(state,code,tmp){
			if(state=='success'){
				json.success(tmp);
			};
			s.errorcallback(json,state,code,tmp);
		});
	};
	//获取钥匙信息
	_s.GetKeyInfo=function(json){
		s.GetKeyInfo.prototype.Id(json);
	};
	_s.GetKeyInfo.prototype.Id=function(json){//序列号
		s.daemon.GetAEKeyID(function(state,code,id){
			if(state=='success'&&id==''){
				state='fail';
				id='没有检测到钥匙';
			}
			if(state=='success'){
				switch(json.content){
					case 'id' :
					s.successcallback(json,id);
					break;
					default:
					s.successcallback(json,{id:id});
				};
			};
			s.errorcallback(json,state,code,id);
		});
	};
	
	//获取证书信息
	_s.GetKeyCertInfo=function(json){
		s.GetCertInfo.prototype.All(json);
	};
	_s.GetCertInfo=function(json){
		s.GetCertInfo.prototype.All(json);
	};
	_s.GetCertInfo.prototype.All=function(json){//
		s.daemon.getKeyCert(function(state,code,data){
			if(state=='success'){
				for(var i=0;i<data.length;i++){
						data[i].SubjectDN=data[i].SubjectName;
					data[i].DN=data[i].SubjectName;
						data[i].IssuerDN=data[i].IssuerName;
						data[i].SerialNumber=data[i].SerialNumber;
					data[i].SN=data[i].SerialNumber;
					data[i].Date=data[i].NotBefore.replace('-','/').replace('-','/').replace('T',' ')+'-'+data[i].NotAfter.replace('-','/').replace('-','/').replace('T',' ');
				};
				data=_s.GetCertInfo.prototype.screen(json,data,json.code,json.name);
				if(!data){
					return false;
				};
				
				json.success(data);
			};
			s.errorcallback(json,state,code,data);
		});
	};
	_s.GetCertInfo.prototype.screen=function(json,data,code,name){
		var codeobj=[];
		if(code!=undefined){
			for(var i=0;i<data.length;i++){
				var cn=data[i].DN.split('@');
				if(cn[1]==code){
					codeobj.push(data[i]);
				};
			};
		}else{
			codeobj=data;
		};
		var nameobj=[];
		if(name!=undefined){
			for(var i=0;i<codeobj.length;i++){
				var cn=data[i].DN.split('@');
				if(cn[2]==name){
					nameobj.push(codeobj[i]);
				};
			};
		}else{
			nameobj=codeobj;
		};
		if(nameobj.length==0){
			s.errorcallback(json,'fail','0x0700000C',s.errorstate[0x0700000C]);
			return false;
		};
		return nameobj;
	};	
	
	
	//获取文件路径
	_s.GetFilePath=function(json){
		if(typeof(json.suf)=='undefined'){
			json.suf='*';
		};
		document.querySelectorAll('body')[0].style.cursor='no-drop';
		document.querySelectorAll('body')[0].style.pointerEvents='none';
		s.daemon.GetLocalFilePath(json.suf,function(state,code,path){
			document.querySelectorAll('body')[0].style.cursor='auto';
			document.querySelectorAll('body')[0].style.pointerEvents='auto';
			if(state=='success'){
				json.success(path);
			};
			s.errorcallback(json,state,code,path);
		});
	};
	
	//检测钥匙Pin码
	_s.OpenKey=function(json){
		s.OpenKey.prototype.OpenEKey(json);
	};
	_s.OpenKey.prototype.OpenEKey=function(json){
//		if(json.pin==undefined||json.pin==''){
//			s.errorcallback(json,'fail','0x07000004',s.errorstate[0x07000004]);
//		}else{
			s.daemon.OpenEKey(json.pin,function(state,code,data){
				if(state=='success'){
					json.success(json.pin);
				};
				s.errorcallback(json,state,code,data);
			});
//		};
	};
	//修改钥匙Pin码
	_s.ChangePin=function(json){
		s.daemon.ChangePIN(json.oldpin,json.newpin,function(state,code,data){
			if(state=='success'){
				json.success();
			};
			s.errorcallback(json,state,code,data);
		});
	};
	
	_s.GetCommSealInfo=function(json){
		json.sealid=[11,14,15];
		_s.GetSealInfo(json);
	};
	_s.GetCorpSealInfo=function(json){
		json.sealid=[12];
		_s.GetSealInfo(json);
	};
	//获取印章信息
	_s.GetSealInfo=function(json){
		s.daemon.GetEKeyPic(json.pin,function(state,code,data){
			if(state=='success'){
				var obj=[];
				if(json.sealid!=undefined){
					for(var i=0;i<data.length;i++){
						for(var o=0;o<json.sealid.length;o++){
							if(json.sealid[o]==data[i].id){
								obj.push(data[i]);
							};
						};
					};
				}else{
					obj=data;
				};
				if(obj.length==0){
					if(json.sealid!=undefined){
						if(json.sealid.indexOf(11)>=0){
							s.errorcallback(json,'fail','0x0700000A',s.errorstate[0x0700000A]);
						}else{
							if(json.sealid.indexOf(12)>=0){
								s.errorcallback(json,'fail','0x0700000B',s.errorstate[0x0700000B]);
							}else{
								s.errorcallback(json,'fail','0x0700000D',s.errorstate[0x0700000D]);
							};
						}
					}else{
						s.errorcallback(json,'fail','0x0700000D',s.errorstate[0x0700000D]);
					};
				}else{
					json.success(obj);
				};
			};
			s.errorcallback(json,state,code,data);
		});
	};
	_s.GetSealSignInfo=function(json){
		s.daemon.GetEKeyPic(json.pin,function(state,code,data){
			if(state=='success'){
				var seal = new Image();
				var sign = new Image();
				sign.onload = function(){
					if(seal.src==''||seal.src==null||seal.src==undefined){
						s.errorcallback(json,'fail','0x0700000A',s.errorstate[0x0700000A]);
						return false;
					};
					if(sign.src==''||sign.src==null||sign.src==undefined){
						s.errorcallback(json,'fail','0x0700000B',s.errorstate[0x0700000B]);
						return false;
					};
						
					var dx=0;
					if(typeof(json.dx)!='undefined'){
						dx=json.dx;
					};
					var dy=0;
					if(typeof(json.dy)!='undefined'){
						dy=json.dy;
					};
						//创造一个元素
					var canvas=document.createElement("canvas");
					var height;
					var width;
					if(dx>=0&&dy>=0){
						if(seal.width>=(sign.width+dx)&&(sign.height+dy)>=seal.height){
							width = seal.width;
							height =sign.height+dy;
						}else if(seal.width<(sign.width+dx)&&(sign.height+dy)<seal.height){
							width = sign.width+dx;
							height =seal.height;
						}else if(seal.width<(sign.width+dx)&&(sign.height+dy)>seal.height){
							width = sign.width+dx;
							height =sign.height+dy;
						}else if(seal.width>(sign.width+dx)&&(sign.height+dy)<seal.height){
							width = seal.width;
							height =seal.height;
						}
						
					}else if(dx<0&&dy>=0){
						if(seal.height>=(sign.height+dy)){
							width = seal.width+Math.abs(dx)+sign.width;
							height =seal.height;
						}else if(seal.height<sign.height+dy){
							width = seal.width+Math.abs(dx)+sign.width;
							height =sign.height+dy;
						}
						
					}else if(dx<0&&dy<0){
						if(sign.height>=(seal.height+Math.abs(dy))){
							width = sign.width+Math.abs(dx)+seal.width;
							height =sign.height;
						}else if(sign.height<(seal.height+Math.abs(dy))){
							width = sign.width+Math.abs(dx)+seal.width;
							height =seal.height+Math.abs(dy);
						}
						
					}else if(dx>=0&&dy<0){
						if(seal.width>=(sign.width+Math.abs(dx))){
							width = seal.width;
							height =seal.height+Math.abs(dy)+sign.height;
						}else if(seal.width<(sign.width+Math.abs(dx))){
							width = sign.width+Math.abs(dx);
							height =seal.height+Math.abs(dy)+sign.height;
						}
						
					}
					
					canvas.height=height;
					canvas.width=width;
					
					//创造一个画布环境
					var cxt = canvas.getContext("2d");
					var sealx,sealy,signx,signy;
					if(dx<0){
						sealx=Math.abs(dx);
						signx=0;
					}else{
						sealx=0;
						signx=Math.abs(dx);
					};
					if(dy<0){
						sealy=Math.abs(dy);
						signy=0;
					}else{
						sealy=0;
						signy=Math.abs(dy);
					};
					cxt.drawImage(seal,sealx,sealy,seal.width,seal.height);
					cxt.drawImage(sign,signx,signy,sign.width,sign.height);
					if(typeof(json.date)!='undefined'){
						var txt=json.date;
						var txth=20;
						cxt.font=txth+"px Arial";
						var txtw=cxt.measureText(txt).width;
						var txtx=0;
						if(typeof(json.datex)!='undefined'){
							txtx=json.datex;
						};
						var txty=0;
						if(typeof(json.datey)!='undefined'){
							txty=json.datey;
						};
						var imgData=cxt.getImageData(0,0,canvas.width,canvas.height);
						if(txtw+txtx>canvas.width){
							canvas.width=txtw+txtx;
						};
						if(txth+txty>canvas.height){
							canvas.height=txth+txty;
						};
						cxt.putImageData(imgData,0,0);
						cxt.font=txth+"px Arial";
						cxt.fillText(txt,txtx,txty);
					};
					
					json.success({img:canvas.toDataURL()});
				};
				seal.onload = function(){
					var signbool=true;
					for (var i=0;i<data.length;i++) {
						if(data[i].id=='12'){
							signbool=false;
							sign.src='data:image/png;base64,'+data[i].value;
							
							break;
						};
					};
					if(signbool){
						s.errorcallback(json,'fail','0x0700000B',s.errorstate[0x0700000B]);
					};
				};
				var sealbool=true;
				for (var i=0;i<data.length;i++) {
					if(data[i].id=='11'){
						sealbool=false;
						seal.src='data:image/png;base64,'+data[i].value;
						break;
   					};
				};
				if(sealbool){
					s.errorcallback(json,'fail','0x0700000A',s.errorstate[0x0700000A]);
				};
			};
			s.errorcallback(json,state,code,data);
	});
};
	
	//数字签名
	_s.Sign=function(json){
		if(json.type=='file'){
			if(json.detach==false){
				s.Sign.prototype.File(json);
			}else{
				if(json.tofile==true){
					s.Sign.prototype.FileDetachToFile(json);
				}else{
					s.Sign.prototype.FileDetach(json);
				};
			};
		}else{
			if(json.many==true){
				s.Sign.prototype.Msg_many(json);
			}else{
				if(json.detach==false){
					s.Sign.prototype.Msg(json);
				}else{
					s.Sign.prototype.MsgDetach(json);
				};
			};
		};
	};
	_s.SignMsgDetach=function(json){
		s.Sign.prototype.MsgDetach(json);
	};
	_s.SignMsg=function(json){
		s.Sign.prototype.Msg(json);
	};
	_s.SignFileDetach=function(json){
		s.Sign.prototype.FileDetach(json);
	};
	_s.SignFile=function(json){
		s.Sign.prototype.File(json);
	};
	_s.Sign.prototype.Msg=function(json){//消息签名
		if(typeof(json.hash)=='undefined'){
			json.hash='1.3.14.3.2.26';
		};
		var pin='';
		if(typeof(json.pin)!='undefined'){
			pin=json.pin;
		};
		s.daemon.SignString(pin,json.dn,'',json.data,json.hash,json.detach,function(state,code,data){
			if(state=='success'){
				json.success(data);
			};
			s.errorcallback(json,state,code,data);
		});
	};
	_s.Sign.prototype.MsgDetach=function(json){//消息签名分离
		if(typeof(json.hash)=='undefined'){
			json.hash='1.3.14.3.2.26';
		};
		var pin='';
		if(typeof(json.pin)!='undefined'){
			pin=json.pin;
		};
		s.daemon.SignStringDetach(pin,json.dn,'',json.data,json.hash,json.detach,function(state,code,data){
			if(state=='success'){
				json.success(data);
			};
			s.errorcallback(json,state,code,data);
		});
	};
	_s.Sign.prototype.FileDetach=function(json){//分离式文件签名
		if(typeof(json.hash)=='undefined'){
			json.hash='1.3.14.3.2.26';
		};
		var pin='';
		if(typeof(json.pin)!='undefined'){
			pin=json.pin;
		};
		s.daemon.DoSignFile(pin,json.dn,json.path,json.hash,function(state,code,data){
			if(state=='success'){
				json.success(data);
			};
			s.errorcallback(json,state,code,data);
		});
	};
	_s.Sign.prototype.FileDetachToFile=function(json){//分离式文件签名（文件数据）
		s.notdn(json.dn,function(state,dn){
			if(state=='success'){
				s.notpath(json.data,function(state,path){
					if(state=='success'){
						if(typeof(json.hash)=='undefined'){
							json.hash='1.3.14.3.2.26';
						};
						if(typeof(json.suf)=='undefined'){
							json.suf='sig';
						};
						s.daemon.DoSignFile3(dn,path,json.hash,path+'.'+json.suf,function(state,code,data){
							if(state=='success'){
								
								json.success(data);
							};
							s.errorcallback(json,state,code,data);
						});
					};
					s.errorcallback(json,state,path);
				});
			};
			s.errorcallback(json,state,dn);
		});
	};
	_s.Sign.prototype.File=function(json){//非分离式文件签名
		if(typeof(json.hash)=='undefined'){
			json.hash='1.3.14.3.2.26';
		};
		if(typeof(json.suf)=='undefined'){
			json.suf='sig';
		};
		var pin='';
		if(typeof(json.pin)!='undefined'){
			pin=json.pin;
		};
		s.daemon.DoSignFile2(pin,json.dn,json.path,json.hash,json.path+'.'+json.suf,function(state,code,data){
			if(state=='success'){
				json.success(json.path+'.'+json.suf);
			};
			s.errorcallback(json,state,code,data);
		});
	};
	_s.Sign.prototype.Msg_many=function(json){
		s.Sign.prototype.Msg_time=0;
		s.Sign.prototype.Msg_data=json.data;
		s.iscert(json.dn,json,function(dn){
			s.Sign.prototype.Msg_loop(json,dn);
		});
	};
	_s.Sign.prototype.Msg_loop=function(json,dn){
		if(typeof(json.hash)=='undefined'){
			json.hash='1.3.14.3.2.26';
		};
		var pin='';
		if(typeof(json.pin)!='undefined'){
			pin=json.pin;
		};
		s.daemon.SignStringDetach(pin,dn,'',json.data[s.Sign.prototype.Msg_time].hashValue,json.hash,json.detach,function(state,code,data){
			if(state=='success'){
				s.Sign.prototype.Msg_data[s.Sign.prototype.Msg_time].keyString=data;
				s.Sign.prototype.Msg_time++;
				if(s.Sign.prototype.Msg_time>s.Sign.prototype.Msg_data.length-1||s.Sign.prototype.Msg_data.length==0){
					s.Sign.prototype.Msg_finish(json);
				}else{
					s.Sign.prototype.Msg_loop(json,dn);
				};
			};
			s.errorcallback(json,state,code,data);
		});
	};
	_s.Sign.prototype.Msg_finish=function(json){
		json.success(s.Sign.prototype.Msg_data);
	};
	_s.Sign.prototype.Msg_time=0;
	_s.Sign.prototype.Msg_data=[];
	_s.SealFormKey=function(json){
		_s.ispin(json.pin,json,function(pin){
			_s.iscert(json.dn,json,function(dn){
				_s.isseal(json.seal,pin,json,function(seal){
					var idarray=json.id.split(',');
					var boundIDarr=[];
					var signValarr=[];
					for(var i=0;i<idarray.length;i++){
						var ele=document.getElementById(idarray[i]);
						if(ele){
							boundIDarr.push(idarray[i]);
							if(ele.name==undefined){//非表单
								var id=ele.id;
								var name=ele.getAttribute('name')?ele.getAttribute('name'):'';
								var value=ele.value==undefined?ele.getAttribute('value')==undefined?'':ele.getAttribute('value').replace(/\s/g,""):ele.value.replace(/\s/g,"");
								var text=ele.innerHTML==undefined?'':ele.innerHTML;
							}else{//表单
								var id=ele.id;
								var name=ele.name;
								var value=ele.value;
								var text=ele.innerHTML==undefined?'':ele.innerHTML;
							};
							value=value.replace(/\"/g,'');
							value=value.replace(/\'/g,'');
							text=text.replace(/\"/g,'');
							text=text.replace(/\'/g,'');
							var divcon='<'+ele.tagName+',id='+id+',name='+name+',value='+value+',outerText='+text+'>';
							signValarr.push(divcon);
						};
					};
					var boundID=boundIDarr.join(',');
					var signVal=signValarr.join('<UTCSplit|>');
					s.daemon.DoWebSealByEKey(dn,pin,boundID,signVal,seal.id||seal,function(state,code,sealinfo){
						if(state=='success'){
							json.success(sealinfo);
						};
						s.errorcallback(json,state,code,sealinfo);
					});
				});
			});
		});
	};
	//数字签名验签
	_s.SignVerify=function(json){
		if(json.type=='file'){
			s.SignVerify.prototype.FileDetach(json);
		}else{
			if(json.detach==false){
				s.SignVerify.prototype.Msg(json);
			}else{
				s.SignVerify.prototype.MsgDetach(json);
			};
		};
	};
	_s.SignMsgDetachVerify=function(json){
		s.SignVerify.prototype.MsgDetach(json);
	};
	_s.SignMsgVerify=function(json){
		s.SignVerify.prototype.Msg(json);
	};
	_s.SignFileDetachVerify=function(json){
		s.SignVerify.prototype.FileDetach(json);
	};
	_s.SignVerify.prototype.MsgDetach=function(json){//消息验签分离
		var signbool=false;
		if(json.stype=='msg'){
			signbool=true;
		};
		if(typeof(json.certtype)=='undefined'){
			json.certtype='RSA';
		};
		s.daemon.VerifyStringDetach(json.source,json.data,json.certtype,signbool,function(state,code,text){
			if(state=='success'){
				json.success();
			};
			s.errorcallback(json,state,code,text);
		});
	};
	_s.SignVerify.prototype.Msg=function(json){//消息验签
		var signbool=false;
		if(json.stype=='msg'){
			signbool=true;
		};
		if(typeof(json.certtype)=='undefined'){
			json.certtype='RSA';
		};
		s.daemon.VerifyString(json.source,json.data,json.certtype,signbool,function(state,code,text){
			if(state=='success'){
				json.success();
			};
			s.errorcallback(json,state,code,text);
		});
	};
	_s.SignVerify.prototype.FileDetach=function(json){//分离式文件验签
		if(typeof(json.type)=='undefined'){
			json.type='RSA';
		};
		s.daemon.VerifyFileSign(json.data,json.type,json.path,function(state,code,data){
			if(state=='success'){
				json.success(data);
			};
			s.errorcallback(json,state,code,data);
		});
	};
	_s.SealFormVerify=function(json){//表单签章
		s.daemon.DoWebSealGetBoundId(json.data,function(state,code,idstring){
			if(state=='success'){
				var idarray=idstring.split(',');
				var signValarr=[];
				for(var i=0;i<idarray.length;i++){
					var ele=document.getElementById(idarray[i]);
					if(ele){
						if(ele.name==undefined){//非表单
							var id=ele.id;
							var name=ele.getAttribute('name')?ele.getAttribute('name'):'';
							var value=ele.value==undefined?ele.getAttribute('value')==undefined?'':ele.getAttribute('value').replace(/\s/g,""):ele.value.replace(/\s/g,"");
							var text=ele.innerHTML==undefined?'':ele.innerHTML;
						}else{//表单
							var id=ele.id;
							var name=ele.name;
							var value=ele.value;
							var text=ele.innerHTML==undefined?'':ele.innerHTML;
						};
						value=value.replace(/\"/g,'');
						value=value.replace(/\'/g,'');
						text=text.replace(/\"/g,'');
						text=text.replace(/\'/g,'');
						var divcon='<'+ele.tagName+',id='+id+',name='+name+',value='+value+',outerText='+text+'>';
						signValarr.push(divcon);
					};
				};
				s.daemon.DoWebSealVerify(signValarr.join('<UTCSplit|>'),json.data,function(state,code,data){
					if(state=='success'){
						json.success(data);
					};
					s.errorcallback(json,state,code,data);
				});
			};
			s.errorcallback(json,state,code,idstring);
		});
	};
	
	//数据加密
	_s.Envelope=function(json){
		if(json.type=='file'){
			s.Envelope.prototype.File(json);
		}else{
			s.Envelope.prototype.Msg(json);
		};
	};
	_s.EnvelopMsg=function(json){
		s.Envelope.prototype.Msg(json);
	};
	_s.EnvelopFile=function(json){
		s.Envelope.prototype.File(json);
	};
	_s.Envelope.prototype.File=function(json){//文件加密
		var certtype;
		var encAlg;
		if(json.basealg=='SM4'){
			certtype='SM2';
			encAlg='1.2.840.113549.3.4';
		}else{
			if(json.basealg=='3DES'){
				certtype='RSA';
				encAlg='1.2.840.113549.3.4';
			}else{
				certtype='RSA';
				encAlg='1.2.840.113549.3.4';
			};
		};
		if(typeof(json.suf)=='undefined'){
			json.suf='enc';
		};
		s.daemon.EncryptFileCMSEnvelopeEx_ByCert(json.base,certtype,json.path,json.path+'.'+json.suf,encAlg,function(state,code,data){
			if(state=='success'){
				json.success(json.path+'.'+json.suf);
			};
			s.errorcallback(json,state,code,data);
		});
	};
	_s.Envelope.prototype.Msg=function(json){//消息加密
		var certtype;
		var encAlg;
		if(json.basealg=='SM4'){
			certtype='SM2';
			encAlg='1.2.840.113549.3.4';
		}else{
			if(json.basealg=='3DES'){
				certtype='RSA';
				encAlg='1.2.840.113549.3.4';
			}else{
				certtype='RSA';
				encAlg='1.2.840.113549.3.4';
			};
		};
		s.daemon.EncryptMsgCMSEnvelopeEx_ByCert(json.data,json.base,certtype,encAlg,function(state,code,data){
			if(state=='success'){
				json.success(data);
			};
			s.errorcallback(json,state,code,data);
		});
	};
	_s.EnvelopMsgByKey=function(json){//消息加密
		s.daemon.EnvelopMsgByKey(json.data,json.dn,json.alg,function(state,code,data){
			if(state=='success'){
				json.success(data);
			};
			s.errorcallback(json,state,code,data);
		});
	};
	_s.EnvelopFileByCer=function(json){//文件加密
		s.daemon.EnvelopFileByCer(json.path,json.certinfo,json.outpath,json.alg,function(state,code,data){
			if(state=='success'){
				json.success(data);
			};
			s.errorcallback(json,state,code,data);
		});
	};
	_s.EnvelopFileByKey=function(json){//文件加密
		s.daemon.EnvelopFileByKey(json.path,json.dn,json.outpath,function(state,code,data){
			if(state=='success'){
				json.success(data);
			};
			s.errorcallback(json,state,code,data);
		});
	};
	_s.DecEnvelopedMsg=function(json){//消息解密
		s.daemon.DecEnvelopedMsg(json.data,function(state,code,data){
			if(state=='success'){
				json.success(data);
			};
			s.errorcallback(json,state,code,data);
		});
	};
	_s.DecEnvelopedFile=function(json){//文件解密
		s.daemon.DecEnvelopedFile(json.path,json.outpath,json.symkey,function(state,code,data){
			if(state=='success'){
				json.success(data);
			};
			s.errorcallback(json,state,code,data);
		});
	};
	
	//生成签章数据
	_s.GetPdfStdSealDataByKey=function(json){
		s.daemon.GetPdfStdSealDataByKey(json.hash,json.dn,json.pin,function(state,code,data){
			if(state=='success'){
				json.success(data);
			};
			s.errorcallback(json,state,code,data);
		});
	};
	//生成签章数据
	_s.GetPdfStdSealDataByPfx=function(json){
		s.daemon.GetPdfStdSealDataByPfx(json.hash,function(state,code,data){
			if(state=='success'){
				json.success(data);
			};
			s.errorcallback(json,state,code,data);
		});
	};
	//按照坐标对本地文件进行签章
	_s.DoPdfStdSealByKeyAtPos=function(json){
		s.daemon.DoPdfStdSealByKeyAtPos(json.path,json.dn,json.pin,json.seal,json.page,json.x,json.y,function(state,code,data){
			if(state=='success'){
				json.success(data);
			};
			s.errorcallback(json,state,code,data);
		});
	};
	//按照关键字对本地文件进行签章
	_s.DoPdfStdSealByKeyAtKw=function(json){
		s.daemon.DoPdfStdSealByKeyAtKw(json.path,json.dn,json.pin,json.seal,json.kw,function(state,code,data){
			if(state=='success'){
				json.success(data);
			};
			s.errorcallback(json,state,code,data);
		});
	};
	_s.DoWordStdSealByKeyAtPos=function(json){
		s.daemon.DoWordStdSealByKeyAtPos(json.path,json.page,json.x,json.y,function(state,code,data){
			if(state=='success'){
				json.success(data);
			};
			s.errorcallback(json,state,code,data);
		});
	};
	_s.DoExcelStdSealByKeyAtPos=function(json){
		s.daemon.DoExcelStdSealByKeyAtPos(json.path,json.page,json.x,json.y,function(state,code,data){
			if(state=='success'){
				json.success(data);
			};
			s.errorcallback(json,state,code,data);
		});
	};
	_s.GetLocalCert=function(json){
		s.daemon.GetLocalCert(function(state,code,data){
			if(state=='success'){
				json.success(data);
			};
			s.errorcallback(json,state,code,data);
		});
	};
	_s.ApiInit=function(){
		s=this;
	};
};
//工具
/*-----
	加载文件
	浏览器参数
	判断IE7
	判断浏览器
	随机数
	大小写
	文件base64解码
-----*/
function UTCMiddleWare_Tool(){
	var s=UTCMiddleWare;
	var _s=this;
	//加载文件
	_s.loadcss=function(path,callback){
		if(!path || path.length === 0){
			throw new Error('argument "path" is required !');
		}
		var pathsure=true;
		for(var i=0;i<document.querySelectorAll('script').length;i++){
			if(document.querySelectorAll('script')[i].src.indexOf(path)>=0){
				pathsure=false;
			};
		};
		if(pathsure){
			var head = document.getElementsByTagName('head')[0];
	        var link = document.createElement('link');
	        link.href = path;
	        link.rel = 'stylesheet';
	        link.type = 'text/css';
	        head.appendChild(link);
	        script.onload=script.onreadystatechange=function(){
			   if(!this.readyState||this.readyState=='loaded'||this.readyState=='complete'){
			     try{callback();}catch(e){};
			   }
			   script.onload=script.onreadystatechange=null;
			};
		}else{
			try{callback();}catch(e){};
		};
    };
    _s.loadjs=function(path,callback){
		if(!path || path.length === 0){
			throw new Error('argument "path" is required !');
		}
		var pathsure=true;
		for(var i=0;i<document.querySelectorAll('script').length;i++){
			if(document.querySelectorAll('script')[i].src.indexOf(path)>=0){
				pathsure=false;
			};
		};
		if(pathsure){
			var head = document.getElementsByTagName('head')[0];
	        var script = document.createElement('script');
	        script.src = path;
	        script.type = 'text/javascript';
	        head.appendChild(script);
	        script.onload=script.onreadystatechange=function(){
			   if(!this.readyState||this.readyState=='loaded'||this.readyState=='complete'){
			     try{callback(true);}catch(e){};
			   }
			   script.onload=script.onreadystatechange=null;
			};
			script.onerror=function(){
				try{callback(false);}catch(e){};
			};
		}else{
			try{callback(true);}catch(e){};
		};
    };
	//浏览器参数
	_s.typearray=function(ele){
		var browser=navigator.userAgent;
		var version=browser.split(' ');
		var type=false;
		var num;
		for(var i=0;i<version.length;i++){
			var str=version[i];
			if(RegExp(ele).test(str)){
				type=true;
				num=i;
			};
		};
		return{
			type:type,
			num:num
		};
	};
	//判断IE7
	_s.Ie7=function(){
		var browser=navigator.userAgent;
		var version=browser.split(' ');
		if(_s.typearray('MSIE').type){
			var num=_s.typearray('MSIE').num;
			var onum = /^\d+\.\d+/;
            var vnum=onum.exec(version[num+1].replace(/[^0-9.]/ig,""));
            UTCMiddleWare.vnum=onum.exec(version[num+1].replace(/[^0-9.]/ig,""));
			if(vnum<8){
				return true;
			}else{
				return false;
			};
		};
	};
	//判断浏览器
	_s.Browser=function(){
		var ele=navigator.userAgent;
		if(ele.indexOf('Firefox')>=0){
			return 'Firefox';
		}else{
			if(ele.indexOf('Edge')>=0){
				return 'Edge';
			}else{
				if(ele.indexOf('Trident')>=0){
					return 'IE';
				}else{
					if(ele.indexOf('Opera')>=0){
						return 'Opera';
					}else{
						if(ele.indexOf('Chrome')>=0){
							return 'Chrome';
						}else{
							if(ele.indexOf('Safari')>=0){
								return 'Safari';
							}else{
								return 'Other';
							};
						};
					};
				};
			};
		};
	};
	//随机数
	_s.randomnum=function(a){
		var num='';
		for(var i=1;i<=a;i++){
			//var chars = ['0','1','2','3','4','5','6','7','8','9','A','B','C','D','E','F','G','H','I','J','K','L','M','N','O','P','Q','R','S','T','U','V','W','X','Y','Z','a','b','c','d','e','f','g','h','i','j','k','l','m','n','o','p','q','r','s','t','u','v','w','x','y','z'];
			var chars = ['0','1','2','3','4','5','6','7','8','9','A','B','C','D','E','F'];
			var now=new Date();    
			var o = Math.floor(now.getMilliseconds()/1000*16);
			num+=chars[o];
		};
		return num;
	};
	//大小写
	_s.endWith=function(path,s){
		if(s==null||s==""||path.length==0||s.length>path.length){
			return false;
		}else{
			if(path.substring(path.length-s.length)==s){
				return true;
			}else{
				return false;
			};
		};
	};
	//文件base64解码
	_s.fromBase64=function(dataURI){
	    var raw = window.atob(dataURI);
	    var rawLength = raw.length;
	    var array = new Uint8Array(new ArrayBuffer(rawLength));
	
	    for(i = 0; i < rawLength; i++) {
	         array[i] = raw.charCodeAt(i);
	    }
	    return array;
	}
};
//底层接口列表
/*-----
	获取服务版本号
	获取钥匙序列号
	获取加密钥匙序列号
	加密钥匙序列号
	获取钥匙证书DN
	获取IE证书DN
	获取文件路径(系统)
	删除文件
	检测钥匙PIN码
	修改钥匙PIN码
	获取Base64
	验证文件有效性
	字符串签名
	验证字符串签名
	文件签名
	文件签名（文件数据）
	非分离式文件签名
	验证分离式文件签名
	消息加密
	文件加密
	文件签章
	hash值签章
	表单签章（电子钥匙）
	表单签章（服务器）
	表单签章获取ID
	表单签章验证
	获取印章图片数据
	获取临时路径
	创建印章图片
	文件生成签章数据
	读取身份证信息（亚略特）
	读取身份证信息（中控）
-----*/

function UTCMiddleWare_Daemon(){
	var self=this;
	var s=UTCMiddleWare;
	var _s=this;
	//获取服务版本号
	self.PluginVersion=function(callback){
		UTCMiddleWare.LocalAjaxPost({
			'function':'PluginVersion',
			value:{
				proID:s.code
			}
		},function(state,code,data){
			callback(state,code,data);
		});
	};
	//获取钥匙序列号
	self.GetAEKeyID=function(callback){
		UTCMiddleWare.LocalAjaxPost({
			'function':'getKeyID',
			value:{
				proID:s.code
			}
		},function(state,code,data){
			callback(state,code,data);
		});
	};
	//获取钥匙证书DN
	self.getKeyCert=function(callback){
		UTCMiddleWare.LocalAjaxPost({
			'function':'getCert',
			value:{
				proID:s.code
			}
		},function(state,code,data){
			callback(state,code,data);
		});
	};
	//获取IE证书DN
	self.GetLocalCert=function(callback){
		UTCMiddleWare.LocalAjaxPost({
			'function':'GetLocalCertDn',
			value:{
				proID:s.code
			}
		},function(state,code,data){
			callback(state,code,data);
		});
	};
	//获取文件路径(系统)
	self.GetLocalFilePath=function(suffix,callback){
		UTCMiddleWare.LocalAjaxPost({
			'function':'GetLocalFilePath',
			value:{
				proID:s.code
			}
		},function(state,code,data){
			callback(state,code,data);
		});
	};
	//检测钥匙PIN码
	self.OpenEKey=function(password,callback){
		UTCMiddleWare.LocalAjaxPost({
			'function':'ChkKeyPin',
			value:{
				pin:password,
				proID:s.code
			}
		},function(state,code,data){
			callback(state,code,data);
		});
	};
	//修改钥匙PIN码
	self.ChangePIN=function(oldpw,newpw,callback){
		UTCMiddleWare.LocalAjaxPost({
			'function':'ChangePin',
			value:{
				oPin:oldpw,
				nPin:newpw,
				proID:s.code
			}
		},function(state,code,data){
			callback(state,code,data);
		});
	};
	/*-----数字签名-----*/
	//字符串签名
	self.SignString=function(password,DN,blank,source, selectedAlg, bool,callback){
		UTCMiddleWare.LocalAjaxPost({
			'function':'SignMsg',
			value:{
				pin:password,
				data:source,
				dn:DN||'',
				hashAlg:selectedAlg,
				proID:s.code
			}
		},function(state,code,data){
			callback(state,code,data);
		});
	};
	//字符串签名分离
	self.SignStringDetach=function(password,DN,blank,source, selectedAlg, bool,callback){
		UTCMiddleWare.LocalAjaxPost({
			'function':'SignMsgDetached',
			value:{
				pin:password,
				data:source,
				dn:DN||'',
				hashAlg:selectedAlg,
				proID:s.code
			}
		},function(state,code,data){
			callback(state,code,data);
		});
	};
	//验证字符串签名
	self.VerifyString=function(source, message,certtype,bool,callback){
		UTCMiddleWare.LocalAjaxPost({
			'function':'VerifyMsg',
			value:{
				signVal:message,
				proID:s.code
			}
		},function(state,code,data){
			callback(state,code,data);
		});
	};
	//验证字符串签名分离
	self.VerifyStringDetach=function(source, message,certtype,bool,callback){
		UTCMiddleWare.LocalAjaxPost({
			'function':'VerifyMsgDetached',
			value:{
				signVal:message,
				data:source,
				proID:s.code
			}
		},function(state,code,data){
			callback(state,code,data);
		});
	};
	//文件签名
	self.DoSignFile=function(password,DN,path,hachtype,callback){
		UTCMiddleWare.LocalAjaxPost({
			'function':'SignFileDetachedToMsg',
			value:{
				pin:password,
				srcFile:path,
				dn:DN||'',
				hashAlg:hachtype,
				proID:s.code
			}
		},function(state,code,data){
			callback(state,code,data);
		});
	};
	//非分离式文件签名
	self.DoSignFile2=function(password,DN,path,hachtype,suf,callback){
		UTCMiddleWare.LocalAjaxPost({
			'function':'SignFile',
			value:{
				pin:password,
				srcFile:path,
				outFile:suf,
				dn:DN||'',
				hashAlg:hachtype,
				proID:s.code
			}
		},function(state,code,data){
			callback(state,code,data);
		});
	};
	//验证分离式文件签名
	self.VerifyFileSign=function(source,certtype,path,callback){
		UTCMiddleWare.LocalAjaxPost({
			'function':'VerifyFileDetached',
			value:{
				signVal:source,
				srcFile:path,
				proID:s.code
			}
		},function(state,code,data){
			callback(state,code,data);
		});
	};
	//验证多个分离式文件签名
	self.VerifyFilesSign=function(datapath,path,callback){
		UTCMiddleWare.LocalAjaxPost({
			'function':'VerifyFileDetached',
			value:{
				signValFile:path,
				srcFiles:datapath,
				proID:s.code
			}
		},function(state,code,data){
			callback(state,code,data);
		});
	};
	//对多个hash值进行分离式签名
	//对多hash值分离式签名进行验签
	/*-----数字签名-----*/
	/*-----数据加密-----*/
	//消息加密
	self.EncryptMsgCMSEnvelopeEx_ByCert=function(sourcestring,certbase64,certtype,selectedAlgIndex,callback){
		var certbase64n=certbase64.replace(/=/ig,"#");
		UTCMiddleWare.LocalAjaxPost({
			'function':'EnvelopMsg',
			value:{
				data:sourcestring,
				certInfo:certbase64n,
				encAlg:selectedAlgIndex,
				proID:s.code
			}
		},function(state,code,data){
			callback(state,code,data);
		});
	};
	//文件加密
	self.EncryptFileCMSEnvelopeEx_ByCert=function(certbase64,certtype,sourcefilepath,envelopefilepath,selectedAlgIndex,callback){
		var certbase64n=certbase64.replace(/=/ig,"#"); 
		UTCMiddleWare.LocalAjaxPost({
			'function':'EnvelopFile',
			value:{
				srcFile:sourcefilepath,
				outFile:envelopefilepath,
				certInfo:certbase64n,
				encAlg:selectedAlgIndex,
				proID:s.code
			}
		},function(state,code,data){
			callback(state,code,data);
		});
	};
	//消息加密
	self.EnvelopMsgByKey=function(data,dn,alg,callback){
		UTCMiddleWare.LocalAjaxPost({
			'function':'EnvelopMsgByKey',
			value:{
				data:data,
				dn:dn,
				encAlg:alg,
				proID:s.code
			}
		},function(state,code,data){
			callback(state,code,data);
		});
	};
	//文件加密
	self.EnvelopFileByCer=function(path,certinfo,outpath,alg,callback){
		UTCMiddleWare.LocalAjaxPost({
			'function':'EnvelopFileByCer',
			value:{
				srcFile:path,
				certinfo:certinfo,
				outFile:outpath,
				encAlg:alg,
				proID:s.code
			}
		},function(state,code,data){
			callback(state,code,data);
		});
	};
	//文件加密
	self.EnvelopFileByKey=function(path,dn,outpath,callback){
		UTCMiddleWare.LocalAjaxPost({
			'function':'EnvelopFileByKey',
			value:{
				srcFile:path,
				dn:dn,
				outFile:outpath,
				proID:s.code
			}
		},function(state,code,data){
			callback(state,code,data);
		});
	};
	//消息解密
	self.DecEnvelopedMsg=function(data,callback){
		UTCMiddleWare.LocalAjaxPost({
			'function':'DecEnvelopedMsg',
			value:{
				strSymKeyEnvelope:data,
				proID:s.code
			}
		},function(state,code,data){
			callback(state,code,data);
		});
	};
	//文件解密
	self.DecEnvelopedFile=function(encFile,decFile,data,callback){
		UTCMiddleWare.LocalAjaxPost({
			'function':'DecEnvelopedFile',
			value:{
				encFile:encFile,
				decFile:decFile,
				strSymKeyEnvelope:data,
				proID:s.code
			}
		},function(state,code,data){
			callback(state,code,data);
		});
	};
	/*-----数据加密-----*/
	/*-----电子签章-----*/
	//表单签章
	self.DoWebSealByEKey = function(dn,password,boundID,boundVal,dataID,callback){
		UTCMiddleWare.LocalAjaxPost({
			'function':'DoWebSealByEKey',
			value:{
				dn:dn,
				password:password,
				boundID:boundID,
				boundVal:boundVal,
				dataID:dataID,
				proID:s.code
			}
		},function(state,code,data){
			callback(state,code,data);
		});
	};
	self.DoWebSealGetBoundId = function(sealinfo,callback){
		UTCMiddleWare.LocalAjaxPost({
			'function':'DoWebSealGetBoundId',
			value:{
				sealinfo:sealinfo,
				proID:s.code
			}
		},function(state,code,data){
			callback(state,code,data);
		});
	};
	self.DoWebSealVerify = function(val,sealinfo,callback){
		UTCMiddleWare.LocalAjaxPost({
			'function':'DoWebSealVerify',
			value:{
				val:val,
				sealinfo:sealinfo,
				proID:s.code
			}
		},function(state,code,data){
			callback(state,code,data);
		});
	};
	//生成签章数据
	self.GetPdfStdSealDataByKey = function(hash,dn,pin,callback){
		UTCMiddleWare.LocalAjaxPost({
			'function':'GetPdfStdSealDataByKey',
			value:{
				fileAbs:hash,
				pwd:pin,
				keyDn:dn,
				proID:s.code
			}
		},function(state,code,data){
			callback(state,code,data);
		});
	};
	self.GetPdfStdSealDataByPfx = function(hash,callback){
		UTCMiddleWare.LocalAjaxPost({
			'function':'GetPdfStdSealDataByPfx',
			value:{
                fileAbs:hash,
				proID:s.code
			}
		},function(state,code,data){
			callback(state,code,data);
		});
	};
	//按照坐标对本地PDF文件进行签章
	self.DoPdfStdSealByKeyAtPos = function(path,dn,pin,img,page,x,y,callback){
		UTCMiddleWare.LocalAjaxPost({
			'function':'DoPdfStdSealByKeyAtPos',
			value:{
				sourceFile:path,
				pinCode:pin,
				dnName:dn,
				imgBase64:img,
				pageNo:page,
				xPosition:x,
				yPosition:y,
				proID:s.code
			}
		},function(state,code,data){
			callback(state,code,data);
		});
	};
	//按照关键字对本地PDF文件进行签章
	self.DoPdfStdSealByKeyAtKw = function(path,dn,pin,img,kw,callback){
		UTCMiddleWare.LocalAjaxPost({
			'function':'DoPdfStdSealByKeyAtKw',
			value:{
				sourceFile:path,
				pinCode:pin,
				dnName:dn,
				imgBase64:img,
				charString:kw,
				proID:s.code
			}
		},function(state,code,data){
			callback(state,code,data);
		});
	};
	//按照坐标对本地WORD文件进行签章
	self.DoWordStdSealByKeyAtPos = function(path,page,x,y,callback){
		UTCMiddleWare.LocalAjaxPost({
			'function':'DoSealInWordByCoord',
			value:{
				sSourceFile:path,
				xPosition:x,
				yPosition:y,
				pageNo:page,
				proID:s.code
			}
		},function(state,code,data){
			callback(state,code,data);
		});
	};
	//按照坐标对本地Excel文件进行签章
	self.DoExcelStdSealByKeyAtPos = function(path,page,x,y,callback){
		UTCMiddleWare.LocalAjaxPost({
			'function':'DoSealInExcelByCoord',
			value:{
				sSourceFile:path,
				xPosition:x,
				yPosition:y,
				pageNo:page,
				proID:s.code
			}
		},function(state,code,data){
			callback(state,code,data);
		});
	};
	/*-----电子签章-----*/
	//获取印章图片数据
	self.GetEKeyPic=function(password,callback){
		UTCMiddleWare.LocalAjaxPost({
			'function':'GetSealImage',
			value:{
				pin:password,
				proID:s.code
			}
		},function(state,code,data){
			callback(state,code,data);
		});
	};
};

UTCMiddleWare_Function.prototype=new UTCMiddleWare_Api();
var UTCMiddleWare=new UTCMiddleWare_Function();
UTCMiddleWare.Initialize();