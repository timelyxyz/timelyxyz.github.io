---
layout: page
title: "微信支付接口"
description: ""
---
{% include JB/setup %}

{{ date }}

这边记一下我在使用微信支付这个接口时候的注意点。另外，我这边使用的的是JS方式的支付，请参考前注意支付方式。

**使用场景如下**：

1. 用户打开商户网页选贩商品,发起支付,在网页通过 JavaScript 调用 getBrandWCPayRequest 接口,发起微信支付请求,用户迚入支付流程。
2. 用户成功支付点击完成按钮后,商户的前端会收到 JavaScript 的返回值。商户可直接跳转到支付成功的静态页面迚行展示。我在前端js地方放了一个轮询检查是否支付成功的方法，来作支付成功提醒页的跳转。
3. 商户后台收到来自微信开放平台的支付成功回调通知,标志该笔订单支付成功。

另外，接口调用需要的注意点

1. 只能在微信内置浏览器中使用，其他浏览器调用无效
2. API每次调用前都会检查商户的支付权限
3. 所有传入参数都必须是字符串类型
4. 订单详情放入package对象，并调用接口将package生成预支付单

**1/3. getBrandWCPayRequest调用**

	// 当微信内置浏览器完成内部初始化后会触发WeixinJSBridgeReady事件。
	document.addEventListener('WeixinJSBridgeReady', function onBridgeReady() {
		// 公众号支付
		jQuery('a#getBrandWCPayRequest').click(function(e){
			WeixinJSBridge.invoke('getBrandWCPayRequest',{
			 	"appId": getAppId(), //公众号名称，由商户传入
			    "timeStamp": getTimeStamp(), //时间戳
			    "nonceStr": getNonceStr(), //随机串
			    "package": getPackage(),//扩展包
			    "signType": getSignType(), //微信签名方式:1.sha1
			    "paySign": getSign() //微信签名
			}, function(res){
				 //alert(res.err_msg);
				 if(res.err_msg == "get_brand_wcpay_request:ok" ) {
					 paySuccess=true;
					 checkPayResult();
				 }
			    // 使用以上方式判断前端返回,微信团队郑重提示：res.err_msg将在用户支付成功后返回ok，
			    但并不保证它绝对可靠。
			    // 因此微信团队建议，当收到ok返回时，向商户后台询问是否收到交易成功的通知，若收到通知，
			    前端展示交易成功的界面；若此时未收到通知，商户后台主动调用查询订单接口，
			    查询订单的当前状态，并反馈给前端展示相应的界面。
			});
		});
		WeixinJSBridge.log('yo~ ready.');
	}, false)

**2/3. getPackage()定义**

	function getPackage()
	{
	    var banktype = "WX";
	    var body = getBody(); // 商品名称信息，这里由测试网页填入。
	    var fee_type = "1";	 // 费用类型，这里1为默认的人民币
	    var input_charset = "GBK"; 	// 字符集，这里将统一使用GBK
	    var out_trade_no = getOrderSerial(); // 订单号，商户需要保证该字段对于本商户的唯一性
	    var total_fee = getTotalFee();	// 总金额。
	    var partner = getPartnerId(); // 商户注册是分配的partnerId
	    var notify_url = "http://test/APIController/payNotify"; // 支付成功后将通知该地址
	    var spbill_create_ip = getClientIP(); // 用户浏览器的ip，这个需要在前端获取。这里使用127.0.0.1测试值
	    var partnerKey = getPartnerKey(); // 这个值和以上其他值不一样是：
	    // 签名需要它，而最后组成的传输字符串不能含有它。
	    // 这个key是需要商户好好保存的。
	    
	    // 首先第一步：对原串进行签名，注意这里不要对任何字段进行编码。
	    // 这里是将参数按照key=value进行字典排序后组成下面的字符串,在这个字符串最后拼接上key=XXXX。
	    // 由于这里的字段固定，因此只需要按照这个顺序进行排序即可。
	    var signString = "bank_type="+banktype
	    				+"&body="+body
	    				+"&fee_type="+fee_type
	    				+"&input_charset="+input_charset
	    				+"&notify_url="+notify_url
	    				+"&out_trade_no="+out_trade_no
	    				+"&partner="+partner
	    				+"&spbill_create_ip="+spbill_create_ip
	    				+"&total_fee="+total_fee
	    				+"&key="+partnerKey;
	    var md5SignValue = ("" + CryptoJS.MD5(signString)).toUpperCase();
	    
	    // 然后第二步，对每个参数进行url转码。
	    // 如果您的程序是用js，那么需要使用encodeURIComponent函数进行编码。
	    banktype = encodeURIComponent(banktype);
	    body = encodeURIComponent(body);
	    fee_type = encodeURIComponent(fee_type);
	    input_charset = encodeURIComponent(input_charset);
	    notify_url = encodeURIComponent(notify_url);
	    out_trade_no = encodeURIComponent(out_trade_no);
	    partner = encodeURIComponent(partner);
	    spbill_create_ip = encodeURIComponent(spbill_create_ip);
	    total_fee = encodeURIComponent(total_fee);
	    
	    // 然后最后一步，这里按照key＝value除了sign外进行字典序排序后组成下列的字符串，
	    // 最后再串接sign=value
	    var completeString = "bank_type="+banktype
	    					+"&body="+body
	    					+"&fee_type="+fee_type
	    					+"&input_charset="+input_charset
	    					+"&notify_url="+notify_url
	    					+"&out_trade_no="+out_trade_no
	    					+"&partner="+partner
	    					+"&spbill_create_ip="+spbill_create_ip
	    					+"&total_fee="+total_fee;
	    completeString = completeString + "&sign="+md5SignValue;
	    
	    oldPackageString = completeString;// 记住package，方便最后进行整体签名时取用
	    
	    return completeString;
	}

**notify_url的定义**

微信回执调用格式：

	// "/ShopController/payNotify?bank_billno=xxx&bank_type=xxx&discount=0&fee_type=1&input_charset=GBK&notify_id=xxx&out_trade_no=xxx&partner=xxx&product_fee=1&sign=xxx&sign_type=MD5&time_end=20140420151830&total_fee=1&trade_mode=1&trade_state=0&transaction_id=xxx&transport_fee=0"

notify_url对应的action主要用于接收微信支付回执，针对相应的业务逻辑对我们的后台数据库中相应的model作持久化操作，并作存根动作。代码如下

	public static void payNotify(String sign_type, String service_version,
			String input_charset, String sign, int sign_key_index,
			int trade_mode, int trade_state, String pay_info, String partner,
			String bank_type, String bank_billno, int total_fee, int fee_type,
			String notify_id, String transaction_id, String out_trade_no,
			String attach, String time_end, int transport_fee, int product_fee,
			int discount, String buyer_alias) {
		wcLogger.debug("----payNotify called----");
		PayNotify.createPayNotify(sign_type, service_version, input_charset,
				sign, sign_key_index, trade_mode, trade_state, pay_info,
				partner, bank_type, bank_billno, total_fee, fee_type,
				notify_id, transaction_id, out_trade_no, attach, time_end,
				transport_fee, product_fee, discount, buyer_alias);
		OrderSum sum = OrderSum.findOneByOrderSerial(out_trade_no.trim());
		if (null != sum) {
			sum.pay(transaction_id);
			wcLogger.debug("---update paidTime & transId id=" + sum.id + "----");
			renderJSON("success");
		} else {
			renderJSON("fail");
		}
	}
	
**3/3 getSign()的定义**

	function getSign()
	{
	    var app_id = getAppId().toString();
	    var app_key = getAppKey().toString();
	    var nonce_str = oldNonceStr;
	    var package_string = oldPackageString;
	    var time_stamp = oldTimeStamp;
	    //第一步，对所有需要传入的参数加上appkey作一次key＝value字典序的排序
	    var keyvaluestring = "appid="+app_id
	    					+"&appkey="+app_key
	    					+"&noncestr="+nonce_str
	    					+"&package="+package_string
	    					+"&timestamp="+time_stamp;
	    sign = CryptoJS.SHA1(keyvaluestring).toString();
	    return sign;
	}
	
	
<script type="text/javascript">
var time=(new Date()).getTime();
/* * * CONFIGURATION VARIABLES: EDIT BEFORE PASTING INTO YOUR WEBPAGE * * */
var disqus_shortname = 'timelyxyz'; // required: replace example with your forum shortname

/* * * DON'T EDIT BELOW THIS LINE * * */
(function () {
    var s = document.createElement('script'); s.async = true;
    s.type = 'text/javascript';
    s.src = '//' + disqus_shortname + '.disqus.com/count.js';
    (document.getElementsByTagName('HEAD')[0] || document.getElementsByTagName('BODY')[0]).appendChild(s);
}());
</script>