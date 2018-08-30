var log4js = require('log4js');


log4js.configure({
    replaceConsole: true,
    appenders: {
        stdout: {//����̨���
            type: 'stdout'
        },
        req: {//������־
            type: 'dateFile',
            filename: 'logs/',
            pattern: 'req-yyyy-MM-dd.log',
            alwaysIncludePattern: true
        },
        err: {//������־
            type: 'dateFile',
            filename: 'logs/',
            pattern: 'err-yyyy-MM-dd.log',
            alwaysIncludePattern: true
        },
        oth: {//������־
            type: 'dateFile',
            filename: 'logs/',
            pattern: 'oth-yyyy-MM-dd.log',
            alwaysIncludePattern: true
        }
    },
    categories: {
        default: { appenders: ['stdout', 'req','err'], level: 'debug' },//appenders:���õ�appender,ȡappenders��,level:���ü���
        err: { appenders: ['stdout', 'err'], level: 'error' },
        oth: { appenders: ['stdout', 'oth'], level: 'info' }
    }
});

//var LogFile = log4js.getLogger();
//LogFile.info('You can find logs-files in the log-dir');


var LogFile_info = log4js.getLogger('err');
LogFile_info.info('~~~~~~~info log~~~~~~~~~');

//var LogFile_just-errors = log4js.getLogger('error');
//LogFile_just.error('~~~~~~~error log~~~~~~~~~');

logwrite = function (log) {
    LogFile_info.error(log);
}

module.exports = { logwrite}