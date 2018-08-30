var zm = require('../tools/zm_tools')
const { mysql } = require("../qcloud");
var ctr = {
  test: async (ctx, next) => {
      ctx.state.data ={
          msg: 'test jg:',
          user: ctx.state.user,
          jg:rq
    }
  },
  updatetime:async (ctx, next) => {
    let dt=zm.getDate(new Date().toString(),"yyyy-MM-dd hh:mm:ss");
    console.log(dt); 
    let jg=await mysql("yonghu").update({updated_at:dt}).where({ openId: rq.uuid})
    ctx.state.data ={
    msg: 'updatetime jg:'+dt,
    jg:jg
  }
}
}
var rq = {};
module.exports = async (ctx, next) => {
  Object.assign(rq, ctx.query, ctx.request.body, ctx.params);
  var action = rq.action;
  var fun = ctr[action];
  if (typeof (fun) == "function") {
    try {
      await fun(ctx, next);
    } catch (e) {
      ctx.state.data = {
        ac: action,
        ty: typeof (fun),
        rq: rq,
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