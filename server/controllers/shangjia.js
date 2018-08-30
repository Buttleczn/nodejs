const { mysql } = require('../qcloud')
const zm = require('../tools/zm_tools')
const { renwuzhuangtai } = require('../modles/meiju')

var getimgsrc = async (fid) => {
  let imgjg = await mysql('Files').where({ fid: fid });//.toString();//
   
  if (imgjg && imgjg[0]) {
    return imgjg[0].fileurl;
  } else {
    return "/#";
  }
}

var ctr = {
  add: async (ctx, next) => {
    let rwid = zm.uuid();
    var shangjiainfo = {
      //任务标识
      pid: rwid,
      //任务标题
      title: rq.title,
      //标签类型
      leixing1: rq.lxval,
      starttime: rq.starttime,
      endtime: rq.endtime,
      //摘要
      meno: rq.zhaiyao,
      shangbiaoimgs: rq.shangbiaoimgs,
      dianmianimgs: rq.dianmianimgs,
      //位置
      weizhi_latitude: rq.weizhi.latitude,
      //位置
      weizhi_longitude: rq.weizhi.longitude,
      //位置
      weizhi_name: rq.weizhi.name,
      //位置
      weizhi_fullname: rq.weizhi.fullname,
      //电话
      dianhua: rq.dianhua,
      //发布人
      ouid: rq.uuid,
      //任务状态
      zhuangtai: renwuzhuangtai.weishenhe
    }
    let rwjg = await mysql("shangjia").insert(shangjiainfo);
    ctx.state.data = {
      msg: 'shangjia jg:',
      isok: true,
      pid: rwid,
      jgr: rwjg
    }
  },

  getmine: async (ctx, next) => {

    let rwlist = [];
    let uid = rq.uuid;
    if (rq.rwtype == "wwgz") {
      //领取的任务单独查询 
      rwlist = await mysql.select('shangjia.*').from('GongZuo').leftJoin('shangjia', 'GongZuo.rwid', 'shangjia.pid').where("GongZuo.ouid", uid);
    } else {
      //获取自己的悬赏列表
      rwlist = await mysql('shangjia').where(function () {
        switch (rq.rwtype) {
          case "mine": {
            //自己发布的
            this.where({ ouid: uid });
          } break;
          case "shh": {
            //需要审核的
            this.where({ zhuangtai: renwuzhuangtai.weishenhe });
          } break;
          default: this.where("1=2")
        }
      }).orderBy('created_at', 'desc');//.andwhere('votes', '>', 100);
    }
    for (let ind = 0; ind < rwlist.length; ind++) {
      rwlist[ind].created_at = zm.getDate(rwlist[ind].created_at);
      let imgsrc = await getimgsrc(rwlist[ind].pid);
      rwlist[ind].img = imgsrc;
    }

    ctx.state.data = {
      msg: 'getmine jg:',
      rwlist: rwlist,
      jsindex: 0
    }
  },
  getone: async (ctx, next) => {
      //更新任务访问数量
      let updjg = await mysql('shangjia').where({ pid: rq.pid }).increment('liulan', 1);
    //获取单个任务
    var rwlist = await mysql('shangjia').where({ pid: rq.pid });//.andwhere('votes', '>', 100);

    rwlist[0].created_at = zm.getDate(rwlist[0].created_at);
    rwlist[0].zhuangtai = renwuzhuangtai.getName(rwlist[0].zhuangtai);
    let imgsrc = await getimgsrc(rwlist[0].pid);
    rwlist[0].img = imgsrc;
    ctx.state.data = rwlist[0];
  },
  getall: async (ctx, next) => {
    //获取统计数量
      let zongliulan = 0;
      let fabushuliang = 0;
      let dianpushuliang = 0;

      let fbsljg = await mysql('shangjia').count("pid  as fbsl");
      fabushuliang = fbsljg[0].fbsl;
      let zlljg = await mysql('shangjia').sum('liulan as llsl');
      zongliulan = zlljg[0].llsl;
    
    //获取    
      let pagerows = 50;
      let pageindex = 0;
      if (rq.pagerows) {
          pagerows = parseInt(rq.pagerows);
      }
      if (rq.pageindex) {
          pageindex = parseInt(rq.pageindex);
      }
    var rwlist = await mysql.select('shangjia.*', 'yonghu.avatarUrl', 'yonghu.nickName','shangjialeixing.mc as lxmc').from('shangjia').leftJoin('yonghu', 'shangjia.ouid', 'yonghu.openId').leftJoin('shangjialeixing', 'shangjia.leixing1', 'shangjialeixing.bm').where(function () {
      if (rq.lx) {
        this.where({ leixing1: rq.lx })
      }
      if(rq.diqu&&rq.diqu!='全部'){
        this.where('weizhi_fullname', 'like', '%'+rq.diqu+'%')
      }
        if (rq.keys) {
          this.where('title', 'like', '%' + rq.keys + '%')
      }
    }).andWhere({ zhuangtai: renwuzhuangtai.zhengchang }).limit(pagerows).offset(pageindex * pagerows).orderBy('created_at', 'desc');//.toString();//.andwhere('votes', '>', 100);
    //ctx.state.data = rwlist;
    for (let ind = 0; ind < rwlist.length; ind++) {
      rwlist[ind].created_at = zm.getDate(rwlist[ind].created_at);
    }
    ctx.state.data = {
      msg: 'getmine jg:',
      rwlist: rwlist,
      zongliulan: zongliulan,
      fabushuliang: fabushuliang,
      dianpushuliang: dianpushuliang,
      pageindex: pageindex,
      jsindex: 0
    }
  },
  getalladmin: async (ctx, next) => {
        if (!ctx.session.admin) {
            ctx.state.data = {
                msg: 'gatall jg:',
                jg: '没有权限'
            }
        }
    //分析查询
    //获取    
    var rwlist = await mysql.select('shangjia.*', 'yonghu.avatarUrl', 'yonghu.nickName','shangjialeixing.mc as lxmc').from('shangjia').leftJoin('yonghu', 'shangjia.ouid', 'yonghu.openId').leftJoin('shangjialeixing', 'shangjia.leixing1', 'shangjialeixing.bm').where("zhuangtai","!=",renwuzhuangtai.shanchu).orderBy('created_at', 'desc');//.toString();//.andwhere('votes', '>', 100);
    //ctx.state.data = rwlist;
    for (let ind = 0; ind < rwlist.length; ind++) {
      rwlist[ind].created_at = zm.getDate(rwlist[ind].created_at,"yyyy-MM-dd hh:mm:ss");
      rwlist[ind].zhuangtai = renwuzhuangtai.getName(rwlist[ind].zhuangtai);
    }
    ctx.state.data = {
      msg: 'getmine jg:',
      rwlist: rwlist,
      jsindex: 0
    }
  },
  shrw: async (ctx, next) => {
        if (!ctx.session.admin) {
            ctx.state.data = {
                msg: 'shrw jg:',
                jg: '没有权限'
            }
        }
    let rwtpjg = await mysql("shangjia")
      .update({ zhuangtai: renwuzhuangtai.zhengchang })
      .where({ pid: rq.rwid }); //.toString();
    ctx.state.data = {
      msg: "shrw jg:",
      isok: true
    };
  },
  tgrw: async (ctx, next) => {
      if (!ctx.session.admin) {
          ctx.state.data = {
              msg: 'shrw jg:',
              jg: '没有权限'
          }
      }
      let rwtpjg = await mysql("shangjia")
          .update({ sftg: "1" })
          .where({ pid: rq.rwid }); //.toString();
      ctx.state.data = {
          msg: "shrw jg:",
          isok: true
      };
  },
    del: async (ctx, next) => {
        if (!ctx.session.admin) {
            ctx.state.data = {
                msg: 'del jg:',
                jg: '没有权限'
            }
        }
    let rwtpjg = await mysql("shangjia")
        .where({ pid: rq.rwid }).del(); //.toString();
    ctx.state.data = {
      msg: "shrw jg:",
      isok: true
    };
  },
  jishu: async (ctx, next) => {
    //获取自己的悬赏列表
    let uid = rq.uuid;
    var rwsl = await mysql('shangjia').where({ ouid: uid }).count('pid as sl');//.andwhere('votes', '>', 100);
    //自己接取的任务
    var gzsl = await mysql('GongZuo').where({ ouid: uid }).count('pid as sl');
    //需要审核的
    var shsl =0;
if(rq.IsAdmin){
  shsl = await mysql('shangjia').where({ zhuangtai: renwuzhuangtai.weishenhe  }).count('pid as sl');
}
    ctx.state.data = {
      msg: 'jishu jg:',
      xuanshang: rwsl[0]?rwsl[0].sl:0,
      shsl: shsl[0]?shsl[0].sl:0,
      weiban: gzsl[0]? gzsl[0].sl:0
    }
  }
};
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
