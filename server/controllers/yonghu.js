var zm = require('../tools/zm_tools')
const { mysql } = require("../qcloud");
var ctr = {
    gatall: async (ctx, next) => {
        if (!ctx.session.admin) {
            ctx.state.data = {
                msg: 'gatall jg:',
                jg: '没有权限'
            }
        }
        let yhlist = await mysql("yonghu").orderBy('updated_at', 'desc');
       
        for (let ind = 0; ind < yhlist.length; ind++) {
            yhlist[ind].created_at = zm.getDate(yhlist[ind].created_at,"yyyy-MM-dd hh:mm:ss"); 
          }
        ctx.state.data = {
            msg: 'gatall jg:',
            jg: yhlist
        }
    },
    update: async (ctx, next) => {
        if (!ctx.session.admin) {
            ctx.state.data = {
                msg: 'gatall jg:',
                jg: '没有权限'
            }
        }
        let jg=await mysql("yonghu").update({chengwei:rq.chengwei}).where({ openId: rq.uuid})
        ctx.state.data = {
            msg: 'update jg:',
            jg: jg
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