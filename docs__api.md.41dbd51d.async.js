(window["webpackJsonp"]=window["webpackJsonp"]||[]).push([[5],{hyzg:function(e,t,l){"use strict";l.r(t);var a=l("q1tI"),n=l.n(a),r=(l("B2uJ"),l("+su7"),l("qOys")),c=l.n(r);l("5Yjd");t["default"]=function(){return n.a.createElement(n.a.Fragment,null,n.a.createElement("div",{className:"markdown"},n.a.createElement("h1",{id:"api"},n.a.createElement("a",{"aria-hidden":"true",href:"#api"},n.a.createElement("span",{className:"icon icon-link"})),"API"),n.a.createElement("p",null,"pro-table \u5728 antd \u7684 table \u4e0a\u8fdb\u884c\u4e86\u4e00\u5c42\u5c01\u88c5\uff0c\u652f\u6301\u4e86\u4e00\u4e9b\u9884\u8bbe\uff0c\u5e76\u4e14\u5c01\u88c5\u4e86\u4e00\u4e9b\u884c\u4e3a\u3002\u8fd9\u91cc\u53ea\u5217\u51fa\u4e0e antd table \u4e0d\u540c\u7684 api\u3002"),n.a.createElement("h2",{id:"table"},n.a.createElement("a",{"aria-hidden":"true",href:"#table"},n.a.createElement("span",{className:"icon icon-link"})),"Table"),n.a.createElement("table",null,n.a.createElement("thead",null,n.a.createElement("tr",null,n.a.createElement("th",null,"\u5c5e\u6027"),n.a.createElement("th",null,"\u63cf\u8ff0"),n.a.createElement("th",null,"\u7c7b\u578b"),n.a.createElement("th",null,"\u9ed8\u8ba4\u503c"))),n.a.createElement("tbody",null,n.a.createElement("tr",null,n.a.createElement("td",null,"request"),n.a.createElement("td",null,"\u4e00\u4e2a\u83b7\u5f97 dataSource \u7684\u65b9\u6cd5"),n.a.createElement("td",null,n.a.createElement("code",null,"(params?: ","{","pageSize: number;current: number;[key: string]: any;","}",",sort,filter) => Promise<RequestData<T>>")),n.a.createElement("td",null,"-")),n.a.createElement("tr",null,n.a.createElement("td",null,"postData"),n.a.createElement("td",null,"\u5bf9\u901a\u8fc7 url \u83b7\u53d6\u7684\u6570\u636e\u8fdb\u884c\u4e00\u4e9b\u5904\u7406"),n.a.createElement("td",null,n.a.createElement("code",null,"(data: T[]) => T[]")),n.a.createElement("td",null,"-")),n.a.createElement("tr",null,n.a.createElement("td",null,"defaultData"),n.a.createElement("td",null,"\u9ed8\u8ba4\u7684\u6570\u636e"),n.a.createElement("td",null,n.a.createElement("code",null,"T[]")),n.a.createElement("td",null,"-")),n.a.createElement("tr",null,n.a.createElement("td",null,"actionRef"),n.a.createElement("td",null,"get table action"),n.a.createElement("td",null,n.a.createElement("code",null,"React.MutableRefObject<ActionType> \\| ((actionRef: ActionType) => void)")),n.a.createElement("td",null,"-")),n.a.createElement("tr",null,n.a.createElement("td",null,"toolBarRender"),n.a.createElement("td",null,"\u6e32\u67d3\u5de5\u5177\u680f\uff0c\u652f\u6301\u8fd4\u56de\u4e00\u4e2a dom \u6570\u7ec4\uff0c\u4f1a\u81ea\u52a8\u589e\u52a0 margin-right"),n.a.createElement("td",null,n.a.createElement("code",null,"(action: UseFetchDataAction<RequestData<T>>) => React.ReactNode[]")),n.a.createElement("td",null,"-")),n.a.createElement("tr",null,n.a.createElement("td",null,"onLoad"),n.a.createElement("td",null,"\u6570\u636e\u52a0\u8f7d\u5b8c\u6210\u540e\u89e6\u53d1,\u4f1a\u591a\u6b21\u89e6\u53d1"),n.a.createElement("td",null,n.a.createElement("code",null,"(dataSource: T[]) => void")),n.a.createElement("td",null,"-")),n.a.createElement("tr",null,n.a.createElement("td",null,"onRequestError"),n.a.createElement("td",null,"\u6570\u636e\u52a0\u8f7d\u5931\u8d25\u65f6\u89e6\u53d1"),n.a.createElement("td",null,n.a.createElement("code",null,"(e: Error) => void")),n.a.createElement("td",null,"-")),n.a.createElement("tr",null,n.a.createElement("td",null,"tableClassName"),n.a.createElement("td",null,"\u5c01\u88c5\u7684 table \u7684 className"),n.a.createElement("td",null,"string"),n.a.createElement("td",null,"-")),n.a.createElement("tr",null,n.a.createElement("td",null,"tableStyle"),n.a.createElement("td",null,"\u5c01\u88c5\u7684 table \u7684 style"),n.a.createElement("td",null,"CSSProperties"),n.a.createElement("td",null,"-")),n.a.createElement("tr",null,n.a.createElement("td",null,"options"),n.a.createElement("td",null,"table \u7684\u5de5\u5177\u680f\uff0c\u8bbe\u7f6e\u4e3a false \u53ef\u4ee5\u5173\u95ed\u5b83"),n.a.createElement("td",null,n.a.createElement("code",null,"{{"," fullScreen: boolean \\| function, reload: boolean \\| function,setting: true ","}}")),n.a.createElement("td",null,n.a.createElement("code",null,"{"," fullScreen: true, reload:true, setting: true","}"))),n.a.createElement("tr",null,n.a.createElement("td",null,"search"),n.a.createElement("td",null,"\u662f\u5426\u663e\u793a\u641c\u7d22\u8868\u5355\uff0c\u4f20\u5165\u5bf9\u8c61\u65f6\u4e3a\u641c\u7d22\u8868\u5355\u7684\u914d\u7f6e"),n.a.createElement("td",null,n.a.createElement("a",{href:"#search"},"search config")),n.a.createElement("td",null,"true")),n.a.createElement("tr",null,n.a.createElement("td",null,"dateFormatter"),n.a.createElement("td",null,"moment \u7684\u683c\u5f0f\u5316\u65b9\u5f0f"),n.a.createElement("td",null,n.a.createElement("code",null,'"string" \\| "number" \\| false')),n.a.createElement("td",null,"string")),n.a.createElement("tr",null,n.a.createElement("td",null,"beforeSearchSubmit"),n.a.createElement("td",null,"\u641c\u7d22\u4e4b\u524d\u8fdb\u884c\u4e00\u4e9b\u4fee\u6539"),n.a.createElement("td",null,n.a.createElement("code",null,"(params:T)=>T")),n.a.createElement("td",null,"-")),n.a.createElement("tr",null,n.a.createElement("td",null,"onSizeChange"),n.a.createElement("td",null,"table \u5c3a\u5bf8\u53d1\u751f\u6539\u53d8"),n.a.createElement("td",null,"`(size: 'default'"),n.a.createElement("td",null,"'middle'")),n.a.createElement("tr",null,n.a.createElement("td",null,"columnsStateMap"),n.a.createElement("td",null,"columns \u7684\u72b6\u6001\u679a\u4e3e"),n.a.createElement("td",null,"`","{","[key: string]: ","{",' show:boolean, fixed: "right"'),n.a.createElement("td",null,'"left"',"}"," ","}","`")),n.a.createElement("tr",null,n.a.createElement("td",null,"onColumnsStateChange"),n.a.createElement("td",null,"columns \u72b6\u6001\u53d1\u751f\u6539\u53d8"),n.a.createElement("td",null,"`(props: ","{","[key: string]: ","{",' show:boolean, fixed: "right"'),n.a.createElement("td",null,'"left"',"}"," ","}",") => void`")),n.a.createElement("tr",null,n.a.createElement("td",null,"type"),n.a.createElement("td",null,"pro-table \u7c7b\u578b"),n.a.createElement("td",null,n.a.createElement("code",null,'"form"')),n.a.createElement("td",null,"-")),n.a.createElement("tr",null,n.a.createElement("td",null,"form"),n.a.createElement("td",null,"antd form \u7684\u914d\u7f6e"),n.a.createElement("td",null,n.a.createElement("code",null,"FormProps")),n.a.createElement("td",null,"-")),n.a.createElement("tr",null,n.a.createElement("td",null,"onSubmit"),n.a.createElement("td",null,"\u63d0\u4ea4\u8868\u5355\u65f6\u89e6\u53d1"),n.a.createElement("td",null,n.a.createElement("code",null,"(params: U) => void")),n.a.createElement("td",null,"-")),n.a.createElement("tr",null,n.a.createElement("td",null,"onReset"),n.a.createElement("td",null,"\u91cd\u7f6e\u8868\u5355\u65f6\u89e6\u53d1"),n.a.createElement("td",null,n.a.createElement("code",null,"() => void")),n.a.createElement("td",null,"-")),n.a.createElement("tr",null,n.a.createElement("td",null,"columnEmptyText"),n.a.createElement("td",null,"\u7a7a\u503c\u65f6\u663e\u793a"),n.a.createElement("td",null,n.a.createElement("code",null,'"string" \\| false')),n.a.createElement("td",null,"false")))),n.a.createElement("h3",{id:"search"},n.a.createElement("a",{"aria-hidden":"true",href:"#search"},n.a.createElement("span",{className:"icon icon-link"})),"search"),n.a.createElement("table",null,n.a.createElement("thead",null,n.a.createElement("tr",null,n.a.createElement("th",null,"\u5c5e\u6027"),n.a.createElement("th",null,"\u63cf\u8ff0"),n.a.createElement("th",null,"\u7c7b\u578b"),n.a.createElement("th",null,"\u9ed8\u8ba4\u503c"))),n.a.createElement("tbody",null,n.a.createElement("tr",null,n.a.createElement("td",null,"searchText"),n.a.createElement("td",null,"\u67e5\u8be2\u6309\u94ae\u7684\u6587\u672c"),n.a.createElement("td",null,"string"),n.a.createElement("td",null,"\u67e5\u8be2")),n.a.createElement("tr",null,n.a.createElement("td",null,"resetText"),n.a.createElement("td",null,"\u91cd\u7f6e\u6309\u94ae\u7684\u6587\u672c"),n.a.createElement("td",null,"string"),n.a.createElement("td",null,"\u91cd\u7f6e")),n.a.createElement("tr",null,n.a.createElement("td",null,"submitText"),n.a.createElement("td",null,"\u63d0\u4ea4\u6309\u94ae\u7684\u6587\u672c"),n.a.createElement("td",null,"string"),n.a.createElement("td",null,"\u63d0\u4ea4")),n.a.createElement("tr",null,n.a.createElement("td",null,"collapseRender"),n.a.createElement("td",null,"\u6536\u8d77\u6309\u94ae\u7684 render"),n.a.createElement("td",null,n.a.createElement("code",null,"(collapsed: boolean,showCollapseButton?: boolean,) => React.ReactNode")),n.a.createElement("td",null,"-")),n.a.createElement("tr",null,n.a.createElement("td",null,"collapsed"),n.a.createElement("td",null,"\u662f\u5426\u6536\u8d77"),n.a.createElement("td",null,"boolean"),n.a.createElement("td",null,"-")),n.a.createElement("tr",null,n.a.createElement("td",null,"onCollapse"),n.a.createElement("td",null,"\u6536\u8d77\u6309\u94ae\u7684\u4e8b\u4ef6"),n.a.createElement("td",null,n.a.createElement("code",null,"(collapsed: boolean) => void;")),n.a.createElement("td",null,"-")),n.a.createElement("tr",null,n.a.createElement("td",null,"optionRender"),n.a.createElement("td",null,"\u64cd\u4f5c\u680f\u7684 render"),n.a.createElement("td",null,n.a.createElement("code",null,"(( searchConfig: Omit<SearchConfig, 'optionRender'>, props: Omit<FormOptionProps, 'searchConfig'>, ) => React.ReactNode) \\| false;")),n.a.createElement("td",null,"-")))),n.a.createElement("h2",{id:"columns"},n.a.createElement("a",{"aria-hidden":"true",href:"#columns"},n.a.createElement("span",{className:"icon icon-link"})),"Columns"),n.a.createElement("table",null,n.a.createElement("thead",null,n.a.createElement("tr",null,n.a.createElement("th",null,"\u5c5e\u6027"),n.a.createElement("th",null,"\u63cf\u8ff0"),n.a.createElement("th",null,"\u7c7b\u578b"),n.a.createElement("th",null,"\u9ed8\u8ba4\u503c"))),n.a.createElement("tbody",null,n.a.createElement("tr",null,n.a.createElement("td",null,"title"),n.a.createElement("td",null,"\u4e0e antd \u4e2d\u57fa\u672c\u76f8\u540c\uff0c\u4f46\u662f\u652f\u6301\u901a\u8fc7\u4f20\u5165\u4e00\u4e2a\u65b9\u6cd5"),n.a.createElement("td",null,n.a.createElement("code",null,"ReactNode \\| ((config: ProColumnType<T>, type: ProTableTypes) => ReactNode)")),n.a.createElement("td",null,"-")),n.a.createElement("tr",null,n.a.createElement("td",null,"renderText"),n.a.createElement("td",null,"\u7c7b\u4f3c table \u7684 render\uff0c\u4f46\u662f\u5fc5\u987b\u8fd4\u56de string\uff0c\u5982\u679c\u53ea\u662f\u5e0c\u671b\u8f6c\u5316\u679a\u4e3e\uff0c\u53ef\u4ee5\u4f7f\u7528 ",n.a.createElement("a",{href:"#valueEnum"},"valueEnum")),n.a.createElement("td",null,n.a.createElement("code",null,"(text: any,record: T,index: number,action: UseFetchDataAction<RequestData<T>>) => string")),n.a.createElement("td",null,"-")),n.a.createElement("tr",null,n.a.createElement("td",null,"render"),n.a.createElement("td",null,"\u7c7b\u4f3c table \u7684 render\uff0c\u7b2c\u4e00\u4e2a\u53c2\u6570\u53d8\u6210\u4e86 dom,\u589e\u52a0\u4e86\u7b2c\u56db\u4e2a\u53c2\u6570 action"),n.a.createElement("td",null,n.a.createElement("code",null,"(text: React.ReactNode,record: T,index: number,action: UseFetchDataAction<RequestData<T>>) => React.ReactNode \\| React.ReactNode[]")),n.a.createElement("td",null,"-")),n.a.createElement("tr",null,n.a.createElement("td",null,"ellipsis"),n.a.createElement("td",null,"\u662f\u5426\u81ea\u52a8\u7f29\u7565"),n.a.createElement("td",null,"boolean"),n.a.createElement("td",null,"-")),n.a.createElement("tr",null,n.a.createElement("td",null,"copyable"),n.a.createElement("td",null,"\u662f\u5426\u652f\u6301\u590d\u5236"),n.a.createElement("td",null,"boolean"),n.a.createElement("td",null,"-")),n.a.createElement("tr",null,n.a.createElement("td",null,"valueEnum"),n.a.createElement("td",null,"\u503c\u7684\u679a\u4e3e\uff0c\u4f1a\u81ea\u52a8\u8f6c\u5316\u628a\u503c\u5f53\u6210 key \u6765\u53d6\u51fa\u8981\u663e\u793a\u7684\u5185\u5bb9"),n.a.createElement("td",null,n.a.createElement("a",{href:"#valueEnum"},"valueEnum")),n.a.createElement("td",null,"-")),n.a.createElement("tr",null,n.a.createElement("td",null,"valueType"),n.a.createElement("td",null,"\u503c\u7684\u7c7b\u578b"),n.a.createElement("td",null,n.a.createElement("code",null,"'money' \\| 'option' \\| 'date' \\| 'dateTime' \\| 'time' \\| 'text'\\| 'index' \\| 'indexBorder'")),n.a.createElement("td",null,"'text'")),n.a.createElement("tr",null,n.a.createElement("td",null,"hideInSearch"),n.a.createElement("td",null,"\u5728\u67e5\u8be2\u8868\u5355\u4e2d\u4e0d\u5c55\u793a\u6b64\u9879"),n.a.createElement("td",null,"boolean"),n.a.createElement("td",null,"-")),n.a.createElement("tr",null,n.a.createElement("td",null,"hideInTable"),n.a.createElement("td",null,"\u5728 Table \u4e2d\u4e0d\u5c55\u793a\u6b64\u5217"),n.a.createElement("td",null,"boolean"),n.a.createElement("td",null,"-")),n.a.createElement("tr",null,n.a.createElement("td",null,"hideInForm"),n.a.createElement("td",null,"\u5728 Form \u6a21\u5f0f\u4e0b \u4e2d\u4e0d\u5c55\u793a\u6b64\u5217"),n.a.createElement("td",null,"boolean"),n.a.createElement("td",null,"-")),n.a.createElement("tr",null,n.a.createElement("td",null,"filters"),n.a.createElement("td",null,"\u8868\u5934\u7684\u7b5b\u9009\u83dc\u5355\u9879\uff0c\u5f53\u503c\u4e3a true \u65f6\uff0c\u81ea\u52a8\u4f7f\u7528 valueEnum \u751f\u6210"),n.a.createElement("td",null,n.a.createElement("code",null,"boolean \\| object[]")),n.a.createElement("td",null,"false")),n.a.createElement("tr",null,n.a.createElement("td",null,"order"),n.a.createElement("td",null,"\u51b3\u5b9a\u5728 \u67e5\u8be2\u8868\u5355\u4e2d\u7684\u987a\u5e8f\uff0c\u8d8a\u5927\u8d8a\u5728\u524d\u9762"),n.a.createElement("td",null,"number"),n.a.createElement("td",null,"-")),n.a.createElement("tr",null,n.a.createElement("td",null,"renderFormItem"),n.a.createElement("td",null,"\u6e32\u67d3\u67e5\u8be2\u8868\u5355\u7684\u8f93\u5165\u7ec4\u4ef6"),n.a.createElement("td",null,n.a.createElement("code",null,"(item,props:","{","value,onChange","}",") => React.ReactNode")),n.a.createElement("td",null,"-")),n.a.createElement("tr",null,n.a.createElement("td",null,"formItemProps"),n.a.createElement("td",null,"\u67e5\u8be2\u8868\u5355\u7684 props\uff0c\u4f1a\u900f\u4f20\u7ed9\u8868\u5355\u9879"),n.a.createElement("td",null,n.a.createElement("code",null,"{"," [prop: string]: any ","}")),n.a.createElement("td",null,"-")))),n.a.createElement("h3",{id:"actiontype"},n.a.createElement("a",{"aria-hidden":"true",href:"#actiontype"},n.a.createElement("span",{className:"icon icon-link"})),"ActionType"),n.a.createElement("p",null,"\u6709\u4e9b\u65f6\u5019\u6211\u4eec\u8981\u89e6\u53d1 table \u7684 reload \u7b49\u64cd\u4f5c\uff0caction \u53ef\u4ee5\u5e2e\u52a9\u6211\u4eec\u505a\u5230\u8fd9\u4e00\u70b9\u3002"),n.a.createElement(c.a,{code:"interface ActionType {\n  reload: () => void;\n  fetchMore: () => void;\n  reset: () => void;\n}\n\nconst ref = useRef<ActionType>();\n\n<ProTable actionRef={ref} />;\n\n// \u5237\u65b0\nref.current.reload();\n\n// \u52a0\u8f7d\u66f4\u591a\nref.current.fetchMore();\n\n// \u91cd\u7f6e\u5230\u9ed8\u8ba4\u503c\nref.current.reset();\n\n// \u6e05\u7a7a\u9009\u4e2d\u9879\nref.current.clearSelected();\n",lang:"tsx"}),n.a.createElement("h2",{id:"valuetype"},n.a.createElement("a",{"aria-hidden":"true",href:"#valuetype"},n.a.createElement("span",{className:"icon icon-link"})),"valueType"),n.a.createElement("p",null,"\u73b0\u5728\u652f\u6301\u7684\u503c\u5982\u4e0b"),n.a.createElement("table",null,n.a.createElement("thead",null,n.a.createElement("tr",null,n.a.createElement("th",null,"\u7c7b\u578b"),n.a.createElement("th",null,"\u63cf\u8ff0"),n.a.createElement("th",null,"\u793a\u4f8b"))),n.a.createElement("tbody",null,n.a.createElement("tr",null,n.a.createElement("td",null,"money"),n.a.createElement("td",null,"\u8f6c\u5316\u503c\u4e3a\u91d1\u989d"),n.a.createElement("td",null,"\xa510,000.26")),n.a.createElement("tr",null,n.a.createElement("td",null,"date"),n.a.createElement("td",null,"\u65e5\u671f"),n.a.createElement("td",null,"2019-11-16")),n.a.createElement("tr",null,n.a.createElement("td",null,"dateRange"),n.a.createElement("td",null,"\u65e5\u671f\u533a\u95f4"),n.a.createElement("td",null,"2019-11-16 2019-11-18")),n.a.createElement("tr",null,n.a.createElement("td",null,"dateTime"),n.a.createElement("td",null,"\u65e5\u671f\u548c\u65f6\u95f4"),n.a.createElement("td",null,"2019-11-16 12:50:00")),n.a.createElement("tr",null,n.a.createElement("td",null,"dateTimeRange"),n.a.createElement("td",null,"\u65e5\u671f\u548c\u65f6\u95f4\u533a\u95f4"),n.a.createElement("td",null,"2019-11-16 12:50:00 2019-11-18 12:50:00")),n.a.createElement("tr",null,n.a.createElement("td",null,"time"),n.a.createElement("td",null,"\u65f6\u95f4"),n.a.createElement("td",null,"12:50:00")),n.a.createElement("tr",null,n.a.createElement("td",null,"option"),n.a.createElement("td",null,"\u64cd\u4f5c\u9879\uff0c\u4f1a\u81ea\u52a8\u589e\u52a0 marginRight\uff0c\u53ea\u652f\u6301\u4e00\u4e2a\u6570\u7ec4,\u8868\u5355\u4e2d\u4f1a\u81ea\u52a8\u5ffd\u7565"),n.a.createElement("td",null,n.a.createElement("code",null,"[<a>\u64cd\u4f5ca</a>,<a>\u64cd\u4f5cb</a>]"))),n.a.createElement("tr",null,n.a.createElement("td",null,"text"),n.a.createElement("td",null,"\u9ed8\u8ba4\u503c\uff0c\u4e0d\u505a\u4efb\u4f55\u5904\u7406"),n.a.createElement("td",null,"-")),n.a.createElement("tr",null,n.a.createElement("td",null,"textarea"),n.a.createElement("td",null,"\u4e0e text \u76f8\u540c\uff0c form \u8f6c\u5316\u65f6\u4f1a\u8f6c\u4e3a textarea \u7ec4\u4ef6"),n.a.createElement("td",null,"-")),n.a.createElement("tr",null,n.a.createElement("td",null,"index"),n.a.createElement("td",null,"\u5e8f\u53f7\u5217"),n.a.createElement("td",null,"-")),n.a.createElement("tr",null,n.a.createElement("td",null,"indexBorder"),n.a.createElement("td",null,"\u5e26 border \u7684\u5e8f\u53f7\u5217"),n.a.createElement("td",null,"-")),n.a.createElement("tr",null,n.a.createElement("td",null,"progress"),n.a.createElement("td",null,"\u8fdb\u5ea6\u6761"),n.a.createElement("td",null,"-")),n.a.createElement("tr",null,n.a.createElement("td",null,"digit"),n.a.createElement("td",null,"\u5355\u7eaf\u7684\u6570\u5b57\uff0cform \u8f6c\u5316\u65f6\u4f1a\u8f6c\u4e3a inputNumber"),n.a.createElement("td",null,"-")))),n.a.createElement("h2",{id:"valueenum"},n.a.createElement("a",{"aria-hidden":"true",href:"#valueenum"},n.a.createElement("span",{className:"icon icon-link"})),"valueEnum"),n.a.createElement("p",null,"\u5f53\u524d\u5217\u503c\u7684\u679a\u4e3e"),n.a.createElement(c.a,{code:"interface IValueEnum {\n  [key: string]:\n    | React.ReactNode\n    | {\n        text: React.ReactNode;\n        status: 'Success' | 'Error' | 'Processing' | 'Warning' | 'Default';\n      };\n}\n",lang:"typescript"}),n.a.createElement("h2",{id:"\u6279\u91cf\u64cd\u4f5c"},n.a.createElement("a",{"aria-hidden":"true",href:"#\u6279\u91cf\u64cd\u4f5c"},n.a.createElement("span",{className:"icon icon-link"})),"\u6279\u91cf\u64cd\u4f5c"),n.a.createElement("p",null,"\u4e0e antd \u76f8\u540c\uff0c\u6279\u91cf\u64cd\u4f5c\u9700\u8981\u8bbe\u7f6e ",n.a.createElement("code",null,"rowSelection")," \u6765\u5f00\u542f\uff0c\u4e0e antd \u4e0d\u540c\u7684\u662f\uff0cpro-table \u63d0\u4f9b\u4e86\u4e00\u4e2a alert \u7528\u4e8e\u627f\u8f7d\u4e00\u4e9b\u4fe1\u606f\u3002\u4f60\u53ef\u4ee5\u901a\u8fc7 ",n.a.createElement("code",null,"tableAlertRender")," \u6765\u5bf9\u5b83\u8fdb\u884c\u81ea\u5b9a\u4e49\u3002\u8bbe\u7f6e\u6216\u8005\u8fd4\u56de false \u5373\u53ef\u5173\u95ed\u3002"),n.a.createElement("table",null,n.a.createElement("thead",null,n.a.createElement("tr",null,n.a.createElement("th",null,"\u5c5e\u6027"),n.a.createElement("th",null,"\u63cf\u8ff0"),n.a.createElement("th",null,"\u7c7b\u578b"),n.a.createElement("th",null,"\u9ed8\u8ba4\u503c"))),n.a.createElement("tbody",null,n.a.createElement("tr",null,n.a.createElement("td",null,"tableAlertRender"),n.a.createElement("td",null,"\u6e32\u67d3 alert\uff0c\u5f53\u914d\u7f6e ",n.a.createElement("code",null,"rowSelection"),"\u6253\u5f00\u3002"),n.a.createElement("td",null,n.a.createElement("code",null,"(keys:string[],rows:T[]) => React.ReactNode[]")),n.a.createElement("td",null,n.a.createElement("code",null,"\u5df2\u9009\u62e9 $","{","selectedRowKeys.length","}"," \u9879"))),n.a.createElement("tr",null,n.a.createElement("td",null,"rowSelection"),n.a.createElement("td",null,"\u8868\u683c\u884c\u662f\u5426\u53ef\u9009\u62e9\uff0c",n.a.createElement("a",{href:"https://ant.design/components/table-cn/#rowSelection",target:"_blank",rel:"noopener noreferrer"},"\u914d\u7f6e\u9879",n.a.createElement("svg",{xmlns:"http://www.w3.org/2000/svg","aria-hidden":!0,x:"0px",y:"0px",viewBox:"0 0 100 100",width:"15",height:"15",className:"__dumi-default-external-link-icon"},n.a.createElement("path",{fill:"currentColor",d:"M18.8,85.1h56l0,0c2.2,0,4-1.8,4-4v-32h-8v28h-48v-48h28v-8h-32l0,0c-2.2,0-4,1.8-4,4v56C14.8,83.3,16.6,85.1,18.8,85.1z"}),n.a.createElement("polygon",{fill:"currentColor",points:"45.7,48.7 51.3,54.3 77.2,28.5 77.2,37.2 85.2,37.2 85.2,14.9 62.8,14.9 62.8,22.9 71.5,22.9"})))),n.a.createElement("td",null,"object"),n.a.createElement("td",null,"false"))))))}}}]);