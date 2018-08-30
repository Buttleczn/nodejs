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

var getimgsrcs = async (fid) => {
    let imgjg = await mysql('Files').where({ fid: fid });//.toString();//
    var fileurls = [];

    if (imgjg.length>0) {
        for(var i=0;i<imgjg.length;i++){
            fileurls.push(imgjg[i].fileurl);
        }
        return fileurls;
    } else {
        return "/#";
    }
}

var ctr = {
  add: async (ctx, next) => {
    let rwid = zm.uuid();
    var renwuinfo = {
      //任务标识
      pid: rwid,
      //任务标题
      title: rq.title,
      //标签类型
      leixing1: rq.lxval,
      //标签价格
      rwflfy: rq.rwflfy,
      //赏金
      shangjin: rq.shangjin,
      //摘要
      meno: rq.zhaiyao,

      //截止日期
      riqi: rq.riqi,
      //一口价
      yikoujia: rq.yikoujia,
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
      //置顶
      zhiding: rq.zhiding,
      //置顶天数
      zdtsval: rq.zdtsval,
      //置顶价格
      zdfy: rq.zdfy,
      //发布费用
      fbfy: rq.fbfy,

      //关键信息
      keys: rq.keys,
      //发布人
      ouid: rq.uuid,
      //任务状态
      zhuangtai: renwuzhuangtai.weijiaofei
    }
    let rwjg = await mysql("renwu").insert(renwuinfo);
    //关联任务和图片
    //let rwtpjg = await mysql("Files").update({ fid: rwid, ouid: renwuinfo.ouid, yongtu: "renwubeizhu" }).where({ pid: rq.img.pid });//.toString();
    var imgs = new Array();
    for(var index in rq.img){
        debug("***********");
        debug(rq.img[index].pid);
        imgs.add(rq.img[index].pid);
    }
    debug(imgs);
    let rwtpjg = await mysql("Files").update({ fid: rwid, ouid: renwuinfo.ouid, yongtu: "renwubeizhu" }).whereIn('pid',imgs);
    ctx.state.data = {
      msg: 'renwu jg:',
      isok: true,
      pid: rwid,
      jgr: rwjg,
      rwtp: rwtpjg
    }
  },

    adds: async (ctx, next) => {
        let rwid = zm.uuid();
        var renwuinfo = {
            //任务标识
            pid: rwid,
            //任务标题
            title: rq.title,
            //标签类型
            leixing1: rq.lxval,
            //标签价格
            rwflfy: rq.rwflfy,
            //赏金
            shangjin: rq.shangjin,
            //摘要
            meno: rq.zhaiyao,

            //截止日期
            riqi: rq.riqi,
            //一口价
            yikoujia: rq.yikoujia,
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
            //置顶
            zhiding: rq.zhiding,
            //置顶天数
            zdtsval: rq.zdtsval,
            //置顶价格
            zdfy: rq.zdfy,
            //转发赏金
            zhuanfa: rq.zhuanfa,
            //转发赏金总价
            zshangjin: rq.zshangjin,
            //转发单条价格
            zdanjia: rq.zdanjia,
            //最大转发数
            zmaxtiaoshu: rq.zmaxtiaoshu,
            //发布费用
            fbfy: rq.fbfy,

            //关键信息
            keys: rq.keys,
            //发布人
            ouid: rq.uuid,
            //任务状态
            zhuangtai: renwuzhuangtai.weijiaofei
        }
        let rwjg = await mysql("renwu").insert(renwuinfo);
        //关联任务和图片
        //let rwtpjg = await mysql("Files").update({ fid: rwid, ouid: renwuinfo.ouid, yongtu: "renwubeizhu" }).where({ pid: rq.img.pid });//.toString();
        var imgs = [];
        for(var i = 0;i<rq.img.length;i++){
            imgs.push(rq.img[i].pid);
        }
        let rwtpjg = await mysql("Files").update({ fid: rwid, ouid: renwuinfo.ouid, yongtu: "renwubeizhu" }).whereIn('pid',imgs);
        ctx.state.data = {
            msg: 'renwu jg:',
            isok: true,
            pid: rwid,
            jgr: rwjg,
            rwtp: rwtpjg
        }
    },

    zhuanfa_add: async (ctx, next) => {
        var zuanfainfo = {
            //任务标识
            pid: rq.rwid,
            //转发人
            zhuanfaid: rq.zhuanfaid,
            //点击人
            dinjiid: rq.dianjiid
        }
        let rwzf = await mysql("rwzf_inf").insert(zuanfainfo);

        let rwzfaccount = await mysql("yonghu").update({ account: rq.account }).where('openId',rq.zhuanfaid);

        let rwzfshengyu = await mysql("renwu").update({ zmaxtiaoshu: rq.zfshengyu }).where('pid',rq.rwid);
        ctx.state.data = {
            msg: 'renwu zhuanfa:',
            isok: true,
            pid: pid,
            rwzf: rwzf,
            rwzfaccount: rwzfaccount,
            rwzfshengyu:rwzfshengyu
        }
    },

  getmine: async (ctx, next) => {

    let rwlist = [];
    let uid = rq.uuid;
    if (rq.rwtype == "wwgz") {
      //领取的任务单独查询 
      rwlist = await mysql.select('renwu.*').from('GongZuo').leftJoin('renwu', 'GongZuo.rwid', 'renwu.pid').where("GongZuo.ouid", uid);
    } else {
      //获取自己的悬赏列表
      rwlist = await mysql('renwu').where(function () {
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
      let updjg = await mysql('renwu').where({ pid: rq.pid }).increment('liulan', 1);
    //获取单个任务
    var rwlist = await mysql('renwu').where({ pid: rq.pid });//.andwhere('votes', '>', 100);

    rwlist[0].created_at = zm.getDate(rwlist[0].created_at);
    rwlist[0].zhuangtai = renwuzhuangtai.getName(rwlist[0].zhuangtai);
    let imgsrc = await getimgsrc(rwlist[0].pid);
    rwlist[0].img = imgsrc;
    ctx.state.data = rwlist[0];
  },

    getone_new: async (ctx, next) => {
        //更新任务访问数量
        let updjg = await mysql('renwu').where({ pid: rq.pid }).increment('liulan', 1);
        //获取单个任务
        var rwlist = await mysql.select('renwu.*', 'yonghu.account').from('renwu').leftJoin('yonghu', 'renwu.ouid', 'yonghu.openId').where({ pid: rq.pid });//.andwhere('votes', '>', 100);
        rwlist[0].created_at = zm.getDate(rwlist[0].created_at);
        rwlist[0].zhuangtai = renwuzhuangtai.getName(rwlist[0].zhuangtai);
        let imgsrcs = await getimgsrcs(rwlist[0].pid);
        rwlist[0].img = imgsrcs;
        var rwhislist = await mysql.select('rwzf_inf.*',  'yonghu.avatarUrl', 'yonghu.nickName').from('rwzf_inf').innerJoin('yonghu', 'rwzf_inf.dianjiid', 'yonghu.openId').where({ pid: rq.pid });
        //ctx.state.data = rwlist[0];
        ctx.state.data = {
            msg: 'getone_new his:',
            rwlist: rwlist[0],
            rwhislist:rwhislist
        }
    },

    get_hisinf: async (ctx, next) => {
        //获取浏览履历
        var rwlist = await mysql.select('rwzf_inf.*',  'yonghu.avatarUrl', 'yonghu.nickName').from('rwzf_inf').innerJoin('yonghu', 'rwzf_inf.dianjiid', 'yonghu.openId').where({ pid: rq.pid });
        ctx.state.data = {
            msg: 'get_hisinf liulan:',
            rwlist: rwlist[0]
        }
    },

    get_account: async (ctx, next) => {
        //获取当前用户月
        var account = await mysql.select('account').from('yonghu').where({ openid: rq.openid });
        ctx.state.data = {
            msg: 'get_account mg:',
            account: account[0]
        }
    },

  getall: async (ctx, next) => {
    //获取统计数量
      let zongliulan = 0;
      let fabushuliang = 0;
      let dianpushuliang = 0;

      let fbsljg = await mysql('renwu').count("pid  as fbsl");
      fabushuliang = fbsljg[0].fbsl;
      let zlljg = await mysql('renwu').sum('liulan as llsl');
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
    var rwlist = await mysql.select('renwu.*', 'yonghu.avatarUrl', 'yonghu.nickName','leixing.mc as lxmc').from('renwu').leftJoin('yonghu', 'renwu.ouid', 'yonghu.openId').leftJoin('leixing', 'renwu.leixing1', 'leixing.bm').where(function () {
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
      let imgsrc = await getimgsrc(rwlist[ind].pid);
      rwlist[ind].img = imgsrc;
      //计算距离
      if (rq.weizhi_latitude){
        let wz1 = { x: rq.weizhi_latitude, y: rq.weizhi_longitude};
        let wz2 = { x: rwlist[ind].weizhi_latitude, y: rwlist[ind].weizhi_longitude }
        rwlist[ind].juli = zm.jisuanjuli(wz1, wz2);
      }
    }
    if (rq.paixu =="距离最近"){
      rwlist=zm.shengxu(rwlist,"juli");
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
    var rwlist = await mysql.select('renwu.*', 'yonghu.avatarUrl', 'yonghu.nickName','leixing.mc as lxmc').from('renwu').leftJoin('yonghu', 'renwu.ouid', 'yonghu.openId').leftJoin('leixing', 'renwu.leixing1', 'leixing.bm').where("zhuangtai","!=",renwuzhuangtai.shanchu).orderBy('created_at', 'desc');//.toString();//.andwhere('votes', '>', 100);
    //ctx.state.data = rwlist;
    for (let ind = 0; ind < rwlist.length; ind++) {
      rwlist[ind].created_at = zm.getDate(rwlist[ind].created_at,"yyyy-MM-dd hh:mm:ss");
      rwlist[ind].zhuangtai = renwuzhuangtai.getName(rwlist[ind].zhuangtai);
      let imgsrc = await getimgsrc(rwlist[ind].pid);
      rwlist[ind].img = imgsrc;
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
    let rwtpjg = await mysql("renwu")
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
      let rwtpjg = await mysql("renwu")
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
    let rwtpjg = await mysql("renwu")
        .where({ pid: rq.rwid }).del(); //.toString();
    ctx.state.data = {
      msg: "shrw jg:",
      isok: true
    };
  },
  jishu: async (ctx, next) => {
    //获取自己的悬赏列表
    let uid = rq.uuid;
    var rwsl = await mysql('renwu').where({ ouid: uid }).count('pid as sl');//.andwhere('votes', '>', 100);
    //自己接取的任务
    var gzsl = await mysql('GongZuo').where({ ouid: uid }).count('pid as sl');
    //需要审核的
    var shsl =0;
    if(rq.IsAdmin){
        shsl = await mysql('renwu').where({ zhuangtai: renwuzhuangtai.weishenhe  }).count('pid as sl');
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
