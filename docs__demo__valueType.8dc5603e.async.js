(window["webpackJsonp"]=window["webpackJsonp"]||[]).push([[11],{cjcL:function(a,t,e){"use strict";e.r(t);e("Y2jk");for(var n=e("zeV3"),o=e("q1tI"),r=e.n(o),d=e("2YZa"),l={0:"close",1:"running",2:"online",3:"error"},s=[],i=0;i<2;i+=1)s.push({key:i,avatar:"https://gw.alipayobjects.com/zos/antfincdn/efFD%24IOql2/weixintupian_20170331104822.jpg",name:"TradeCode ".concat(i),status:l[Math.floor(10*Math.random())%4],updatedAt:Date.now()-Math.floor(1e3*Math.random()),createdAt:Date.now()-Math.floor(2e3*Math.random()),createdAtRange:[Date.now()-Math.floor(2e3*Math.random()),Date.now()-Math.floor(2e3*Math.random())],money:Math.floor(2e3*Math.random())*i,progress:Math.ceil(100*Math.random())+1,percent:Math.random()>.5?(10*(i+1)+Math.random()).toFixed(3):-(10*(i+1)+Math.random()).toFixed(2),code:"const getData = async params => {\n  const data = await getData(params);\n  return { list: data.data, ...data };\n};"});s.push({key:3,avatar:"https://gw.alipayobjects.com/zos/antfincdn/efFD%24IOql2/weixintupian_20170331104822.jpg",name:"TradeCode ".concat(3),status:0,updatedAt:Date.now()-Math.floor(1e3*Math.random()),createdAt:Date.now()-Math.floor(2e3*Math.random()),createdAtRange:[Date.now()-Math.floor(2e3*Math.random()),Date.now()-Math.floor(2e3*Math.random())],money:3*Math.floor(2e3*Math.random()),progress:Math.ceil(100*Math.random())+1,percent:Math.random()>.5?(40+Math.random()).toFixed(3):-(40+Math.random()).toFixed(2),code:"const getData = async params => {\nconst data = await getData(params);\nreturn { list: data.data, ...data };\n};"});var c=[{title:"\u5e8f\u53f7",dataIndex:"index",valueType:"index",width:72},{title:"border \u5e8f\u53f7",dataIndex:"index",key:"indexBorder",valueType:"indexBorder",width:72,sorter:{multiple:3}},{title:"\u72b6\u6001",dataIndex:"status",initialValue:"all",sorter:{multiple:3},width:100,ellipsis:!0,filters:!0,valueEnum:{all:{text:"\u5168\u90e8",status:"Default"},close:{text:"\u5173\u95ed",status:"Default"},running:{text:"\u8fd0\u884c\u4e2d",status:"Processing"},online:{text:"\u5df2\u4e0a\u7ebf",status:"Success"},error:{text:"\u5f02\u5e38",status:"Error"},0:{text:"0\u5f02\u5e38",status:"Error"}}},{title:"\u4ee3\u7801",key:"code",width:120,dataIndex:"code",valueType:"code"},{title:"\u5934\u50cf",dataIndex:"avatar",key:"avatar",valueType:"avatar",width:150,render:a=>r.a.createElement(n["default"],null,r.a.createElement("span",null,a),r.a.createElement("a",{href:"https://github.com/chenshuai2144",target:"_blank",rel:"noopener noreferrer"},"chenshuai2144"))},{title:"\u64cd\u4f5c",key:"option",width:120,valueType:"option",render:()=>[r.a.createElement("a",null,"\u64cd\u4f5c"),r.a.createElement("a",null,"\u5220\u9664")]}];t["default"]=()=>r.a.createElement(r.a.Fragment,null,r.a.createElement(d["c"],{columns:c,request:(a,t,e)=>(console.log(a,t,e),Promise.resolve({total:200,data:s,success:!0})),rowKey:"key",headerTitle:"\u6837\u5f0f\u7c7b"}))}}]);