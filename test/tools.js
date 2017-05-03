var assert = require('assert');
var personalInfoDao = require('../Tools/dao/personalInfoDao');

describe('Tools Test', function () {
  describe('#Personal Information', function() {
    describe('submit with information', function() {
      it('should update the Personal Information', function(done){
        var param = {age:"18", address:"unimelb", phone:"01234567890", income:"10000", occupation:"student", interests:"sleep"};
        var sess = {passport:{user:{user_id:"57bd2cabec36c97f3d7dbb48"}}};
        var req = {body:param, session:sess};
        // render function is only called in success scenario
        // so use it to call done
        var res = {send:function(){return;}, render: function() {done();}};
        personalInfoDao.add(req, res, null);
      });
    });
  });
});