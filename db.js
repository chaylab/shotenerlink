var Massage=require('./models/massage');
exports.addTest=function() {
  Massage.remove({},function(err) {
    if(err) throw err;
  });
  tag=['aa0123','12411b','sd42c3'];
  text=['Hello World!!','Fuck You!!','Holy Shit!!'];
  owner=['1245785495431602','1245785495431602','1245785495431601'];
  newMsg=[1,2,3];
  for(i=0;i<3;i++) {
    newMsg[i] = new Massage;
    newMsg[i].tag=tag[i];
    newMsg[i].text=text[i];
    newMsg[i].owner=owner[i];
    newMsg[i].save(function(err) {
      if(err) throw err;
    });
  }
  console.log('added test massages');
};

exports.getMassageByTag=function(tag,fn) {
  Massage.findOne({'tag':tag},function(err,msg) {
    if(err) return fn(err);
    fn(null,msg);
  });
};

exports.getMassageByOwner=function(owner,fn) {
  Massage.find({'owner':owner},function(err,msg) {
    if(err) fn(err);
    fn(null,msg);
  });
};

function isValidTag(tag) {
  if(tag.length>7) return false;
  vtag=tag.match(/\w\w\w\w\w\w\w?/i);
  if(vtag) {
    return true;
  }
  return false;
}
exports.setMassage=function(tag,ntag,ntext,owner,fn) {
  if(!isValidTag(ntag)) return fn('invalid tag');
  update={'text':ntext};
  if(tag==ntag) Massage.update({'tag':tag,'owner':owner},update,function(err) {
    if(err) return fn(err);
    fn(null);
  }); else Massage.findOne({'tag':ntag},function(err,msg) {
    if(err) return fn(err);
    if(msg) return fn('duplicate tag');
    update={'tag':ntag,'text':ntext};
    Massage.update({'tag':tag,'owner':owner},update,function(err) {
      if(err) return fn(err);
      fn(null);
    });
  });
};

function rndRange(a) { //1-a
  return Math.floor((Math.random()*a)+1);
}
function genTag() {
  tag='';
  len=6;
  for(i=0;i<len;i++) {
    rnd=rndRange(36); //a-z0-9
    if(rnd>10) { base=96; rnd-=10;} else base=47;
    tag+=String.fromCharCode(base+rnd);
  }
  return tag;
}

exports.addMassage=function(text,owner,fn) {
  if(!text) fn('no text');
  tag=genTag();
  Massage.findOne({'tag':tag},function(err,msg) {
    if(err) return fn(err);
    if(msg) return fn('duplicate tag');
      newMsg=new Massage;
      newMsg.tag=tag;
      newMsg.text=text;
      newMsg.owner=owner;
      newMsg.save(function(err) {
        if(err) return fn(err);
        fn(null);
      });
  });
}
