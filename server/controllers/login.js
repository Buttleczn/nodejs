// 登录授权接口
const { mysql } = require('../qcloud')
const zm = require('../tools/zm_tools')
var request = require('request');
var fs = require('fs');
const config = require('../config')
const crypto = require('crypto');

var aesDecrypt = function (key, iv, crypted) {
  crypted = new Buffer(crypted, 'base64')
  key = new Buffer(key, 'base64')
  iv = new Buffer(iv, 'base64')
  const decipher = crypto.createDecipheriv('aes-128-cbc', key, iv)
  let decoded = decipher.update(crypted, 'base64', 'utf8')
  decoded += decipher.final('utf8')
  return decoded
}
var sha1 = function (v) {
  return crypto.createHash('sha1').update(v, 'utf8').digest('hex')
}

var rq = {};
var ctr = {
  login: async (ctx, next) => {
    const {
        'x-wx-code': code,
      'x-wx-encrypted-data': encryptedData,
      'x-wx-iv': iv
    } = ctx.req.headers;
    let jgs = { code: code, v: iv };
    const appid = config.appId
    const appsecret = config.appSecret
    let urlss = 'https://api.weixin.qq.com/sns/jscode2session?appid=' + appid + "&secret=" + appsecret + "&js_code=" + code + "&grant_type=authorization_code";
    jgs.uss = urlss;
    let res = await httpGet(urlss);//session_key//openid
    let openid = res.bod.openid;
    let session_key = res.bod.session_key;
    // 生成 3rd_session
    let skey = sha1(session_key)

    // 解密数据
    let decryptedData
    try {
      decryptedData = aesDecrypt(session_key, iv, encryptedData)
      decryptedData = JSON.parse(decryptedData)
    } catch (e) {
      //debug('Auth: %s: %o', ERRORS.ERR_IN_DECRYPT_DATA, e)
      throw new Error(`${ERRORS.ERR_IN_DECRYPT_DATA}\n${e}`)
    }

    // 存储到数据库中
    //查询用户是否已经注册存在
    let userinfo = await mysql("yonghu").where({ openId: openid });
    if (userinfo && userinfo.length > 0) {
      await mysql("yonghu").update({ sessionkey: session_key}).where({ openId: openid });
      userinfo[0].watermark = decryptedData.watermark;
      ctx.state.data = userinfo[0];
    } else {
      //插入用户
      let newuser = {
        openId: openid,
        avatarUrl: decryptedData.avatarUrl,
        chengwei: "游客",
        city: decryptedData.city,
        country: decryptedData.country,
        gender: decryptedData.gender,
        language: decryptedData.language,
        nickName: decryptedData.nickName,
        sessionkey: session_key,
        province: decryptedData.province
      }
      let jg = await mysql("yonghu").insert(newuser);
      newuser.watermark = decryptedData.watermark;
      ctx.state.data = newuser;
    }

  },
  gettel: async (ctx, next) => {
 
    let usersession = await mysql("yonghu").select("sessionkey").where({ openId: rq.uuid });
    let session_key = usersession[0].sessionkey;
    
    // 解密数据
    let decryptedData
      decryptedData = aesDecrypt(session_key, rq.iv, rq.encryptedData)
      decryptedData = JSON.parse(decryptedData)
      await  mysql("yonghu").update({ dianhua: decryptedData.purePhoneNumber }).where({ openId: rq.uuid  });
   
    ctx.state.data = decryptedData;
  }
}
module.exports = async (ctx, next) => {
  // 通过 Koa 中间件进行登录之后
  // 登录信息会被存储到 ctx.state.$wxInfo
  // 具体查看：
  Object.assign(rq, ctx.query, ctx.request.body, ctx.params);
  var action = rq.action;
  if (!action) {
    if (ctx.state.$wxInfo.loginState) {
      ctx.state.data = decryptedData
      ctx.state.data['time'] = Math.floor(Date.now() / 1000)
    }
  } else {
    var fun = ctr[action];
    if (typeof (fun) == "function") {
      try {
        await fun(ctx, next);
      } catch (e) {
        ctx.state.data = {
          ac: action,
          ty: typeof (fun),
          error: e && e.message ? e.message : e.toString()
        }
      }

    } else {
      ctx.state.data = {
        ac: action,
        ty: typeof (fun)
      }
    }
  }
}
