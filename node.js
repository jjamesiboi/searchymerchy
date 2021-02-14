let req = require('request');
let net = require('net');
let fs=require('fs');
let crawler=require('crawler');
let webData = {};
try{webData=JSON.parse(fs.readFileSync("webData.json"));}catch(e){console.log(e);}
let serv = net.createServer((s)=>{
s.on('data',(data)=>{let keepalive=false;
  try{
    let JSONobj = JSON.parse(data);
    switch(JSONobj.g){
      case 'get':{
        let resp=[];
        for(let i=0;i<webData.length;i++){let score=0;
          let info=[webData[i][0],webData[i][1],webData[i][2]];
          if(info[0]==JSONobj.get||info[1]==JSONobj.get||info[2]==JSONobj.get)score=1000;
          let split=JSONobj.get.split(" ");
          for(let a=0;a<split.length;a++){
            if(webData[i][3].includes(split[a])){
              score+=1;
            }
            if(webData[i][1].includes(split[a]))score+=2;
            if(webData[i][2].includes(split[1]))score++;
          }
          if(score)resp[resp.length]=[info,score];
        }
        resp.sort(function(a,b){
          a = a[1];
          b = b[1];
          return a > b ? -1 : (a < b ? 1 : 0);
        });
        resp=resp.slice((JSONobj.start?JSONobj.start:0),(JSONobj.end?JSONobj.end:10));
        for(let i=0;i<resp.length;i++){
          resp[i] = resp[i][0];
        }
        s.end(JSON.stringify(resp));
      }
      case 'add':{
        let dat=[JSONobj.url];
var c = new Crawler({
    maxConnections : 5,
    // This will be called for each crawled page
    callback : function (error, res, done) {
        if(error){
            console.log(error);
        }else{
            var $ = res.$;
            // $ is Cheerio by default
            //a lean implementation of core jQuery designed specifically for the server
            dat[1]=$("title").text();
            dat[2]=$("meta").text();
        }
        done();
    }
});
      }
    }
  }catch(e){console.log(e)}
  if(!keepalive)s.end();
});
s.on('error',console.log);
s.on('end',s.destroy);});
serv.listen(7001);
