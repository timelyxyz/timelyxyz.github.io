---
layout: page
title: "去除 jsChart's logo"
description: ""
---
{% include JB/setup %}

{{ date }}
jsChart是用js结合html5的canvas生成图表的组件，可以在官网下载到free version（此时最新的版本号v3.06）

但是有这个问题`jsChart生成的图表左上角都有不可移除的logo`，当然收费版我想应该是么的吧。

![jsChar's logo](/images/jschart_logo.png)


so，解决方案是查询jschart.js文件中的这段代码，并注释：
	
	fs.bg.2v(fX)

![remove logo](/images/jschart_sol.png)

