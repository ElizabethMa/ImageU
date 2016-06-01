'use strict';

[1,2,3,4].forEach(function(i){
  console.log(i);
});


var fs = require('fs');

//console.log(fs);

// 异步方式
fs.stat('sample.txt', function (err, stat) {
  //console.log(err);
  if (err) {
    console.log(err);
  } else {
    // 是否是文件:
    console.log('isFile: ' + stat.isFile());
    // 是否是目录:
    console.log('isDirectory: ' + stat.isDirectory());
    if (stat.isFile()) {
      // 文件大小:
      console.log('size: ' + stat.size);
      // 创建时间, Date对象:
      console.log('birth time: ' + stat.birthtime);
      // 修改时间, Date对象:
      console.log('modified time: ' + stat.mtime);
    }
  }
});

// 同步方式
var f = fs.statSync('sample.txt');
console.log(f);
