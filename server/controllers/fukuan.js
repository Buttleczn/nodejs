//付款
const { mysql } = require('../qcloud')
const zm = require('../tools/zm_tools')
const config = require('../config')
var crypto = require('crypto');
const { renwuzhuangtai } = require('../modles/meiju')

var key = config.mch_key;

function paysignjs(appid, nonceStr, package, signType, timeStamp) {
  var ret = {
    appId: appid,
    nonceStr: nonceStr,
    package: package,
    signType: signType,
    timeStamp: timeStamp
  };
  var string = raw1(ret);
  string = string + '&key=' + key;
  console.log(string);
  var crypto = require('crypto');
  return crypto.createHash('md5').update(string, 'utf8').digest('hex');
};

function raw1(args) {
  var keys = Object.keys(args);
  keys = keys.sort()
  var newArgs = {};
  keys.forEach(function (key) {
    newArgs[key] = args[key];
  });

  var stringraw = '';
  for (var k in newArgs) {
    stringraw += '&' + k + '=' + newArgs[k];
  }
  stringraw = stringraw.substr(1);
  return stringraw;
};
function paysignjsapi(ret) {
  var stringraw = raw(ret);
  stringraw = stringraw + '&key=' + key;
  return crypto.createHash('md5').update(stringraw, 'utf8').digest('hex');
};

function raw(args) {
  var keys = Object.keys(args);
  keys = keys.sort()
  var newArgs = {};
  keys.forEach(function (key) {
    newArgs[key.toLowerCase()] = args[key];
  });

  var stringraw = '';
  for (var k in newArgs) {
    stringraw += '&' + k + '=' + newArgs[k];
  }
  stringraw = stringraw.substr(1);
  return stringraw;
};

function getXMLNodeValue(node_name, xml) {
  var tmp = xml.split("<" + node_name + ">");
  var _tmp = tmp[1].split("</" + node_name + ">");
  return _tmp[0];
}
var ctr = {
  //获取付款参数
  getkey: async (ctx, next) => {
    //search
    var bookingNo = rq.rwid;
    var total_feejg = await mysql("renwu").where({ pid: bookingNo });
    if (total_feejg.length < 1) {
      ctx.state.data = {
        msg: 'leixing jg:',
        jg: '没有找到任务'
      }
      return;
    }
    let total_fee = parseFloat(total_feejg[0].fbfy) * 100;
    let attach = "附加费用";
    let appid = config.appId;
    let mch_id = config.mch_id;
    var openid = rq.uuid;
    var cbkurl = "https://332045916.zmapi.xyz/weapp/fukuan/callback";
    var body = "任务发布费用";
    let nonce_str = zm.uuid();
    let spbill_create_ip = "123.12.12.123";
    var url = "https://api.mch.weixin.qq.com/pay/unifiedorder";
    var ret = {
      appid: appid,
      attach: attach,
      body: body,
      mch_id: mch_id,
      nonce_str: nonce_str,
      notify_url: cbkurl,
      openid: openid,
      out_trade_no: bookingNo,
      spbill_create_ip: spbill_create_ip,
      total_fee: total_fee,
      trade_type: 'JSAPI'
    };
    let sign = paysignjsapi(ret).toUpperCase();
    var formData = "<xml>";
    formData += "<appid>" + appid + "</appid>"; //appid
    formData += "<attach>" + attach + "</attach>";
    formData += "<body>" + body + "</body>";
    formData += "<mch_id>" + mch_id + "</mch_id>"; //商户号
    formData += "<nonce_str>" + nonce_str + "</nonce_str>";
    formData += "<notify_url>" + cbkurl + "</notify_url>";
    formData += "<openid>" + openid + "</openid>";
    formData += "<out_trade_no>" + bookingNo + "</out_trade_no>";
    formData += "<spbill_create_ip>" + spbill_create_ip + "</spbill_create_ip>";//APP和网页支付提交用户端ip，Native支付填调用微信支付API的机器IP。
    formData += "<total_fee>" + total_fee + "</total_fee>";//订单总金额，单位为分
    formData += "<trade_type>JSAPI</trade_type>";
    formData += "<sign>" + sign + "</sign>";
    formData += "</xml>";
    let postjg = await zm.httpPost({ url: url, formData: formData });
    try {
      var prepay_id = getXMLNodeValue('prepay_id', postjg.toString("utf-8"));
      var tmp = prepay_id.split('[');
      var tmp1 = tmp[2].split(']');
      let timeStamp = Math.round(new Date().getTime() / 1000);
      //签名
      var _paySignjs = paysignjs(appid, nonce_str, 'prepay_id=' + tmp1[0], 'MD5', timeStamp).toUpperCase();
      var o = {
        prepay_id: tmp1[0],
        timeStamp:timeStamp,
        _paySignjs: _paySignjs
      }
      ctx.state.data = {
        msg: 'leixing jg:',
        fstr: formData,
        rw: total_feejg[0],
        nonceStr: nonce_str,
        jg: o
      }
    }
    catch (e) {
      ctx.state.data = {
        msg: 'leixing jg:',
        fstr: formData,
        rstr: postjg,
        jg: e && e.message ? e.message : e.toString()
      }
    }

  },
  callback: async (ctx, next) => {
      zm.logwrite("支付回传:" + rq.toString());
    },
    list: async (ctx, next) => {
        //search
        let jg = await mysql.select('fukuanjilu.*', 'renwu.title').from('fukuanjilu').leftJoin('renwu', 'fukuanjilu.bookingNo', 'renwu.pid').orderBy("fukuanjilu.id",'desc');
        //var jg = test.create();
        ctx.state.data = {
            msg: 'lunbotu jg:',
            jg: jg
        }
    },
  fkok: async (ctx, next) => {
    //search
    var bookingNo = rq.rwid;
    var total_feejg = await mysql("renwu").where({ pid: bookingNo });
      if (!total_feejg||total_feejg.length < 1) {
      ctx.state.data = {
          msg: 'leixing jg:',
          isok: false,
        jg: '没有找到任务'
      }
      return;
      }
      //检查是不是已经插入
      let zflsjg = await mysql("fukuanjilu").where({ bookingNo: bookingNo });
      if (zflsjg&&zflsjg[0]) {
          ctx.state.data = {
              msg: 'leixing jg:',
              isok: true,
              jg: '已经支付了'
          }
          return;
      }
    let appid = config.appId;
    let mch_id = config.mch_id;
    let nonce_str = zm.uuid();
    var ret = {
      appid: appid,
      mch_id: mch_id,
      nonce_str: nonce_str,
      out_trade_no: bookingNo
    }
    let sign = paysignjsapi(ret);
    var url = "https://api.mch.weixin.qq.com/pay/orderquery";
    var formData = "<xml>";
    formData += "<appid>" + appid + "</appid>"; //appid  
    formData += "<mch_id>" + mch_id + "</mch_id>"; //商户号
    formData += "<nonce_str>" + nonce_str + "</nonce_str>";
    formData += "<out_trade_no>" + bookingNo + "</out_trade_no>";
    formData += "<sign>" + sign + "</sign>";
    formData += "</xml>";
    let postjg = await zm.httpPost({ url: url, formData: formData });
    var trade_state = getXMLNodeValue('trade_state', postjg.toString("utf-8"));
    var tmp = trade_state.split('[');
    var tmp1 = tmp[2].split(']')[0];
    if (tmp1 == "SUCCESS") {
        await mysql("renwu").update({ zhuangtai: renwuzhuangtai.weishenhe }).where({ pid: rq.rwid });
      try{
          let shid = zm.uuid();
          let sjfk = getXMLNodeValue('cash_fee', postjg.toString("utf-8"));
        //  console.log("shijifukuan__" + sjfk);
          let sjfy = parseInt(sjfk) / 100;
        //  console.log("shijifukuan__" + total_feejg[0].fbfy);
        var shjlinfo = {
          pid: shid,
          bookingNo: bookingNo,
            rwflfy: total_feejg[0].rwflfy,
            zdfy: total_feejg[0].zdfy,
            fbfy: total_feejg[0].fbfy,
            sjfy: sjfy
          };
       //   console.log(mysql("fukuanjilu").insert(shjlinfo).toString());
        await mysql("fukuanjilu").insert(shjlinfo);
      } catch (e) {
          tmp1 = e && e.message ? e.message : e.toString();
          console.log("插入付款记录失败：" + tmp1);
      }
    }
    ctx.state.data = {
        msg: 'leixing jg:',
        isok: true,
        jg: tmp1 == "SUCCESS" ? "已经支付了" : tmp1
    }
  },
//提现方法
    tixian:async (ctx, next) =>
    {
        var account = rq.account;
        var appid = config.appId;
        var mch_id = config.mch_id;
        var nonce_str = zm.uuid();
        var openid = rq.rwid;
        var check_name = 'NO_CHECK';
        var spbill_create_ip = "123.12.12.123";
        var desc = '提现';
        var bookingNo = zm.uuid();//'dacf77a6f2247d1af2c42488b7d7c8a';
        var url = "https://api.mch.weixin.qq.com/mmpaymkttransfers/promotion/transfers";
        var amount = parseFloat(account) * 100;
        var ret = {
            mch_appid: appid,
            mchid: mch_id,
            nonce_str: nonce_str,
            partner_trade_no: bookingNo,//不确定
            openid: openid,
            check_name: check_name,
            amount: amount,
            desc: desc,
            spbill_create_ip: spbill_create_ip
        };
        var sign = paysignjsapi(ret).toUpperCase();

        var formData = "<xml>";
        formData += "<mch_appid>" + appid + "</mch_appid>"; //appid
        formData += "<mchid>" + mch_id + "</mchid>"; //商户号
        formData += "<nonce_str>" + nonce_str + "</nonce_str>";
        formData += "<partner_trade_no>" + bookingNo + "</partner_trade_no>";//商户订单号
        formData += "<openid>" + openid + "</openid>";
        formData += "<check_name>" + check_name + "</check_name>";
        formData += "<amount>" + amount + "</amount>";
        formData += "<desc>" + desc + "</desc>";
        formData += "<spbill_create_ip>" + spbill_create_ip + "</spbill_create_ip>";
        formData += "<sign>" + sign + "</sign>";
        formData += "</xml>";
        var postjg = await
        zm.httpTixianPost({url: url, formData: formData});
        var result_code = getXMLNodeValue('result_code', postjg.toString("utf-8"));
        var tmp = result_code.split('[');
        var tmp1 = tmp[2].split(']')[0];
        console.log(tmp1);
        if (tmp1 == "SUCCESS") {
            //await mysql("yonghu").update({account: "0"}).where({openid: rq.rwid});
            ctx.state.data = {
                msg: 'leixing jge:',
                isok: true,
                cm: "提现成功",
                rwid:rq.rwid,
                account:rq.account,
                postjg:postjg
            }
        } else {
            ctx.state.data = {
                msg: 'leixing jge:',
                isok: false,
                cm: "提现时发生错误",
                rwid:rq.rwid,
                account:rq.account,
                postjg:postjg
            }
        }
    }
};
var rq = {};
module.exports = async (ctx, next) => {
  Object.assign(rq, ctx.query, ctx.request.body, ctx.params);
  var fun = ctr[rq.action];
  if (typeof (fun) == "function") {
    try {
      await fun(ctx, next);
      // await  mysql('test').select('id').then(res => {
      //   ctx.state.data = res;
      // })
    } catch (e) {
      ctx.state.data = {
        ac: rq.action,
        ty: typeof (fun),
        error: e && e.message ? e.message : e.toString()
      }
    }

  } else {
    ctx.state.data = {
      ac: rq.action,
      ty: typeof (fun)
    }
  }
}