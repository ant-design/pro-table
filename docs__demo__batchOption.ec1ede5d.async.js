(window["webpackJsonp"]=window["webpackJsonp"]||[]).push([[6],{aBcX:function(e,t,a){"use strict";a.r(t);a("L/Qf");var r=a("2/Rp"),n=a("WmNS"),l=a.n(n),c=a("9og8"),o=(a("Y2jk"),a("zeV3")),i=(a("0lcf"),a("mr32")),s=a("q1tI"),d=a.n(s),u=a("xvlK"),p=a("2YZa"),m=a("io9h"),w=[{title:"\u6807\u9898",dataIndex:"title",copyable:!0,ellipsis:!0,width:200,hideInSearch:!0},{title:"\u72b6\u6001",dataIndex:"state",initialValue:"all",filters:!0,valueEnum:{all:{text:"\u5168\u90e8",status:"Default"},open:{text:"\u672a\u89e3\u51b3",status:"Error"},closed:{text:"\u5df2\u89e3\u51b3",status:"Success"}}},{title:"\u6807\u7b7e",dataIndex:"labels",width:120,render:(e,t)=>d.a.createElement(o["default"],null,t.labels.map(e=>{var t=e.name,a=e.id,r=e.color;return d.a.createElement(i["a"],{color:r,key:a},t)}))},{title:"\u521b\u5efa\u65f6\u95f4",key:"since",dataIndex:"created_at",valueType:"dateTime"},{title:"option",valueType:"option",dataIndex:"id",render:(e,t)=>[d.a.createElement("a",{key:"1",href:t.html_url,target:"_blank",rel:"noopener noreferrer"},"\u67e5\u770b"),d.a.createElement(p["b"],{key:"2",onSelect:e=>window.alert(e),menus:[{key:"copy",name:"\u590d\u5236"},{key:"delete",name:"\u5220\u9664"}]})]}];t["default"]=()=>d.a.createElement(p["c"],{columns:w,request:Object(c["a"])(l.a.mark((function e(){var t,a=arguments;return l.a.wrap((function(e){while(1)switch(e.prev=e.next){case 0:return t=a.length>0&&void 0!==a[0]?a[0]:{},e.abrupt("return",Object(m["a"])("https://proapi.azurewebsites.net/github/issues",{params:t}));case 2:case"end":return e.stop()}}),e)}))),rowKey:"id",rowSelection:{},tableAlertRender:e=>{var t=e.selectedRowKeys,a=e.selectedRows;return"\u5f53\u524d\u5171\u9009\u4e2d ".concat(t.length," \u9879\uff0c\u5171\u6709 ").concat(a.reduce((e,t)=>"open"===t.state?e+1:e,0)," \u9879\u672a\u89e3\u51b3 ")},tableAlertOptionRender:e=>{var t=e.onCleanSelected;return d.a.createElement(o["default"],null,d.a.createElement("a",null,"\u81ea\u5b9a\u4e49"),d.a.createElement("a",{onClick:t},"\u6e05\u7a7a"))},dateFormatter:"string",headerTitle:"\u6279\u91cf\u64cd\u4f5c",toolBarRender:(e,t)=>{var a=t.selectedRowKeys;return[d.a.createElement(r["a"],{key:"3",type:"primary"},d.a.createElement(u["a"],null),"\u65b0\u5efa"),a&&a.length&&d.a.createElement(r["a"],{key:"3",onClick:()=>{window.alert(a.join("-"))}},"\u6279\u91cf\u5220\u9664")]}})}}]);