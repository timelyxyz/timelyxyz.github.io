---
layout: page
title: "微信支付相关接口"
description: "xxxxx"
---
{% include JB/setup %}

{{ date }}

最近手头的项目是一个基于微信公众平台的微商场，谈到商城，那么就得要用到微信的支付接口。刚好手头的客户提供了已经认证通过了的账号，那我就幸运的研习一下=）

### 主要的接口依次有
1. 微信版本号5.0以上，微信内置浏览器
2. 微信支付
3. 支付结果回执
4. 发货通知
5. 维权、告警
6. 退款

### 一些关于微信支付的概念
1. 目前微信已经有文档的**支付方式**有：JS API 支付、Native(原生)支付。商户可以结合业务场景,自主选择支付形式。
2. 商户需要用到的几个密钥：appId、appSecret、paySignKey、partnerKey。这几个值是用于唯一确定商户的，请妥善保管，因为会用在接口调用中很多签名的生成。
3. 微信5.0之后才有微信支付模块，用useragent来确定用户的版本号再调用接口。
4. 微信强烈建议商户使用 “微信安全支付”标题：showwxpaytitle=1。虽然我没用=)

~~~
1) JS API 支付：是指用户打开图文消息或者扫描二维码,在微信内置浏览器打开网页进行的支付。
   商户网页前端通过使用微信提供的JS API,调用微信支付模块。这种方式,适合需要在商户网页进行选购下单的购买流程。
2) Native(原生)支付：是指用户通过三方app中调用微信接口完成支付流程的方式。
~~~


### 关于接口调用的一些细则
#### [支付接口](http://timelyxyz.github.io/2014/04/24/wechat-pay-pay/ "支付接口")
#### [发货通知](http://timelyxyz.github.io/2014/04/24/wechat-pay-pay/ "发货通知")
#### [维权](http://timelyxyz.github.io/2014/04/24/wechat-pay-pay/ "维权")
#### [告警](http://timelyxyz.github.io/2014/04/24/wechat-pay-pay/ "告警")
#### [退款](http://timelyxyz.github.io/2014/04/24/wechat-pay-pay/ "退款")


### 我在调接口中遇到的一些问题
1. 维权route配置 route, 返回success字符串
2. 发货时间戳long，unix时间，要求到秒，不是毫秒
3. request.body获取postData，解析xml
