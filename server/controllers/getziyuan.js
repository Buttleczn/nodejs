//获取通用资源类
const { mysql } = require('../qcloud')
const zm = require('../tools/zm_tools')

var ctr = {
  //获取标签类型
  leixing: async (ctx, next) => {
    //search
      let jg = await mysql('leixing').where("sj", "!=", "-1").orderBy("paixu");
    //var jg = test.create();
    ctx.state.data = {
      msg: 'leixing jg:',
      jg: jg
    }
  },
  //添加标签类型
    addleixing: async (ctx, next) => {
        if (!ctx.session.admin) {
            ctx.state.data = {
                msg: 'addleixing jg:',
                jg: '没有权限'
            }
        }
    //先检查编码是否重复    
      let jg = await mysql('leixing').where({ mc: rq.mc}).andWhere('sj', '!=', "-1");
    if(jg&&jg[0]){
      ctx.state.data = {
        msg: 'addleixing jg:',
        isok:false,
        jg: "已经存在相同名称的类型"
      }
      return;
    }
    var leixing = {
        bm: rq.mc ,
        mc: rq.mc,
        sj: '00',
        icon: rq.icon,
        jg: rq.jg,
        gen: '00',
        guanggao:rq.guanggao,
        paixu: rq.paixu
    };
    let rwjg = await mysql("leixing").insert(leixing);
    ctx.state.data = {
      msg: 'leixing jg:',
      isok:true,
      jg: rwjg
    }
  },
  //添加标签类型
    updleixing: async (ctx, next) => {
        if (!ctx.session.admin) {
            ctx.state.data = {
                msg: 'updleixing jg:',
                jg: '没有权限'
            }
        }

    var leixing = {
        mc: rq.mc,
        icon: rq.icon,
        jg: rq.jg,
        guanggao: rq.guanggao,
        paixu: rq.paixu
    };
    let rwjg = await mysql("leixing").update(leixing).where({bm:rq.bm}).andWhere('sj', '!=', "-1");
    ctx.state.data = {
      msg: 'updleixing jg:',
      isok:true,
      jg: rwjg
    }
  },
  delleixing: async (ctx, next) => {
      if (!ctx.session.admin) {
          ctx.state.data = {
              msg: 'delleixing jg:',
              jg: '没有权限'
          }
      }
    let jg = await mysql('leixing').update({sj:"-1",bm:'del_'+rq.bm}).where({bm:rq.bm});
    //var jg = test.create();
    ctx.state.data = {
      msg: 'delleixing jg:',
      jg: jg
    }
  },

  //获取商城类型
  shangjialeixing: async (ctx, next) => {
      //search
      let jg = await mysql('shangjialeixing').where("sj", "!=", "-1").orderBy("paixu");
      //var jg = test.create();
      ctx.state.data = {
          msg: 'shangjialeixing jg:',
          jg: jg
      }
  },
  //添加商城类型
  addshangchengleixing: async (ctx, next) => {
      if (!ctx.session.admin) {
          ctx.state.data = {
              msg: 'addshangchengleixing jg:',
              jg: '没有权限'
          }
      }
      //先检查编码是否重复    
      let jg = await mysql('shangjialeixing').where({ mc: rq.mc }).andWhere('sj', '!=', "-1");
      if (jg && jg[0]) {
          ctx.state.data = {
              msg: 'addshangchengleixing jg:',
              isok: false,
              jg: "已经存在相同名称的类型"
          }
          return;
      }
      var leixing = {
          bm: rq.mc,
          mc: rq.mc,
          sj: '00',
          icon: rq.icon,
          jg: rq.jg,
          gen: '00',
          guanggao: rq.guanggao,
          paixu: rq.paixu
      };
      let rwjg = await mysql("shangjialeixing").insert(leixing);
      ctx.state.data = {
          msg: 'shangjialeixing jg:',
          isok: true,
          jg: rwjg
      }
  },
  //更新商城类型
  updshangjialeixing: async (ctx, next) => {
      if (!ctx.session.admin) {
          ctx.state.data = {
              msg: 'updshangjialeixing jg:',
              jg: '没有权限'
          }
      }

      var leixing = {
          mc: rq.mc,
          icon: rq.icon,
          jg: rq.jg,
          guanggao: rq.guanggao,
          paixu: rq.paixu
      };
      let rwjg = await mysql("shangjialeixing").update(leixing).where({ bm: rq.bm }).andWhere('sj', '!=', "-1");
      ctx.state.data = {
          msg: 'shangjialeixing jg:',
          isok: true,
          jg: rwjg
      }
  },
  //删除商城类型
  delshangjialeixing: async (ctx, next) => {
      if (!ctx.session.admin) {
          ctx.state.data = {
              msg: 'delshangjialeixing jg:',
              jg: '没有权限'
          }
      }
      let jg = await mysql('shangjialeixing').update({ sj: "-1", bm: 'del_' + rq.bm }).where({ bm: rq.bm });
      //var jg = test.create();
      ctx.state.data = {
          msg: 'deshangjialeixing jg:',
          jg: jg
      }
  },

  //获取标签类型
  lunbotu: async (ctx, next) => {
    //search
      let jg = await mysql('lunbotu').where("sj", "!=", "-1").orderBy("paixu");
    //var jg = test.create();
    ctx.state.data = {
      msg: 'lunbotu jg:',
      jg: jg
    }
  },
  //添加标签类型
    addlunbotu: async (ctx, next) => {
        if (!ctx.session.admin) {
            ctx.state.data = {
                msg: 'addlunbotu jg:',
                jg: '没有权限'
            }
        }
        var lunbotu = {
            bm: zm.uuid(),
        mc: rq.mc,
        sj: '00',
        icon: rq.icon,
        paixu: rq.paixu
    };
    let rwjg = await mysql("lunbotu").insert(lunbotu);
    ctx.state.data = {
      msg: 'lunbotu jg:',
      isok:true,
      jg: rwjg
    }
  },
  //添加标签类型
  updlunbotu: async (ctx, next) => {
      if (!ctx.session.admin) {
          ctx.state.data = {
              msg: 'updlunbotu jg:',
              jg: '没有权限'
          }
      }
    var lunbotu = {
        mc: rq.mc,
        icon: rq.icon,
        jg: rq.jg,
        paixu: rq.paixu
    };
    let rwjg = await mysql("lunbotu").update(lunbotu).where({bm:rq.bm}).andWhere('sj', '!=', "-1");
    ctx.state.data = {
      msg: 'updlunbotu jg:',
      isok:true,
      jg: rwjg
    }
  },
  dellunbotu: async (ctx, next) => {
      if (!ctx.session.admin) {
          ctx.state.data = {
              msg: 'dellunbotu jg:',
              jg: '没有权限'
          }
      }
    let jg = await mysql('lunbotu').update({sj:"-1"}).where({bm:rq.bm});
    //var jg = test.create();
    ctx.state.data = {
      msg: 'dellunbotu jg:',
      jg: jg
    }
  },
  //获取置顶设置
  zdts: async (ctx, next) => {
    //search
    let zdtsjg = await mysql.select().table('zhiding');
    ctx.state.data = {
      msg: 'zdts jg:',
      jg: zdtsjg
    };
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