let shell = require('shelljs');
let fs = require('fs');
let moment = require('moment');
let dist = 'F:/lizhuang/vue-webpack-for-mobile/mobile/m.train.51ykb.com/v-1.0.0';
let deploy = 'F:/lizhuang/vue-webpack-for-mobile/mobile/m.train.51ykb.com/github/ykb_train_php/public';
let args = process.argv.splice(2);
const publish = require('./publish')
/**
  第一个参数为commit提交的说明
*/
if (args.length === 0) {
  shell.echo('【错误】缺少发版说明，请在第一个参数上补充发版说明');
  shell.exit(1);
}
let version = moment().format('YYYY-MM-DD HH:mm:ss');
let commitText = '[' + version + ']' + args[0];
// 首先判断所发布到的地址是否存在
if (fs.existsSync(deploy)) {
  // 要判断里面的文件是不是已经删除了，如果没有删除则进行删除操作
  if (fs.existsSync(deploy + '/static')) {
    shell.rm('-rf', deploy + '/static', '-rf', deploy + '/index.html');
    // 进入对应目录
    shell.cd(deploy);
    // 删除以后需要commit一下
    shell.exec('git commit -am "删除项目重新打包"');
    // 如果已经删除了则需要把项目复制到这里面
    shell.cp('-R', dist + '/dist/static', deploy);
    shell.cp('-R', dist + '/dist/index.html', deploy);
    // 添加所有文件
    shell.exec('git add *');
    shell.exec('git commit -am "' + commitText + '"');
    // push到远程
    shell.exec('git push origin');
    publish({callback: _ => {
     shell.echo("【√】发布到集成");
    }});
  } else {
     shell.cd(deploy);
     shell.cp('-R', dist + '/dist/static', deploy);
     shell.cp('-R', dist + '/dist/index.html', deploy);
     // 添加所有文件
     shell.exec('git add *');
     shell.exec('git commit -am "' + commitText + '"');
     // push到远程
     shell.exec('git push origin');
     publish({callback: _ => {
      shell.echo("【√】发布到集成");
     }});
  }
} else {
  shell.echo('给定的目录不存在，'+deploy);
}