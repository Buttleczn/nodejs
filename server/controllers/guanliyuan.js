const { mysql } = require("../qcloud");
var zm = require("../tools/zm_tools");
var ctr = {
    test: async (ctx, next) => {
        ctx.state.data = {
            msg: "test jg:",
            jg: rq
        };
    },
    add: async (ctx, next) => {
        //插入审批意见
        let shid = zm.uuid();
        var guanliyuan = {
            pid: shid,
            username: rq.username,
            pwd: zm.md5jiami(rq.pwd),
            name: rq.name
        };
        let rwjg = await mysql("guanliyuan").insert(guanliyuan);
        ctx.state.data = {
            msg: "shrw jg:",
            jg: rwjg,
            isok: true
        };
    },
    logout: async (ctx, next) => {
        ctx.session.admin = false;
        ctx.state.data = {
            msg: "state jg:",
            jg: ctx.session.admin,
            isok: true
        };
    },
    login: async (ctx, next) => {
        //插入审批意见
        var guanliyuan = {
            username: rq.username,
            pwd: zm.md5jiami(rq.pwd)
        };
        let rwjg = await mysql("guanliyuan").where(guanliyuan);
        if (rwjg && rwjg[0]) {
            ctx.session.admin = rwjg[0].pid;
            console.log("login:"+ctx.session.admin );
            ctx.state.data = {
                msg: "shrw jg:",
                jg: rwjg[0],
                isok: true
            };
        } else {
            ctx.state.data = {
                msg: "shrw jg:",
                isok: false
            };
        }
    },
    jiancha: async (ctx, next) => {
        //插入审批意见
        //console.log("jiancha_" + ctx.session.admin );
        var guanliyuan = {
            pid: ctx.session.admin
        };
        let rwjg = await mysql("guanliyuan").where(guanliyuan);
        if (rwjg && rwjg[0]) {
            ctx.state.data = {
                msg: "shrw jg:",
                jg: rwjg[0],
                isok: true
            };
        } else {
            ctx.state.data = {
                msg: "shrw jg:",
                isok: false
            };
        }
    }

};
var rq = {};
module.exports = async (ctx, next) => {
    Object.assign(rq, ctx.query, ctx.request.body, ctx.params);
    var action = rq.action;
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
