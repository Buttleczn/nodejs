//管理员操作控制器，会先验证是否管理员
const { mysql } = require("../qcloud");
var zm = require("../tools/zm_tools");
var ctr = {
  shrw: async (ctx, next) => {
    //插入审批意见
    let shid = zm.uuid();
    var shjlinfo = {
      pid: shid,
      openId: rq.uuid,
      spyj: rq.spyj,
      rwid: rq.rwid,
      shjg: rq.shjg
    };
    let rwjg = await mysql("shenpiyijian").insert(shjlinfo);

    let rwtpjg = await mysql("renwu")
      .update({ zhuangtai: rq.shjg })
      .where({ pid: rq.rwid }); //.toString();
    ctx.state.data = {
      msg: "shrw jg:",
      isok: true
    };
  }
};
var rq = {};
module.exports = async (ctx, next) => {
  Object.assign(rq, ctx.query, ctx.request.body, ctx.params);
  var action = rq.action;
  //验证是否管理员
  let userinfo = await mysql("yonghu").where({ openId: rq.uuid, IsAdmin: 1 });
  if (!userinfo || userinfo.length == 0) {
    ctx.state.data = {
      ac: action,
      msg: "权限错误"
    };
    return;
  }

  var fun = ctr[action];
  if (typeof fun == "function") {
    try {
      await fun(ctx, next);
    } catch (e) {
      ctx.state.data = {
        ac: action,
        ty: typeof fun,
        rq: rq,
        error: e && e.message ? e.message : e.toString()
      };
    }
  } else {
    ctx.state.data = {
      ac: action,
      ty: typeof fun
    };
  }
};
