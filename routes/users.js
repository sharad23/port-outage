var express = require('express');
var userSchema = require('../schemas/user');
var router = express.Router();

/* GET users listing. */
router.get('/', function(req, res, next) {
    //list all user 
    
    userSchema.find({},function(err,data){
         if(err) return handleError(err);
         res.send(data);
    });


});
router.post('/',function(req, res, next){
    //add user
    var newUser = new userSchema();
    newUser.username = req.body.username;
    newUser.password = req.body.password;
    newUser.dept = req.body.dept;
    newUser.role = req.body.role;
    newUser.save(function(err,result){
          if(err) return handleError(err);
          res.send(result);
    });

});
router.put('/:id',function(req,res,next){
	//edit user
	var id = req.params.id;
    userSchema.findOne({_id : id},function(err,data){
    	 data.username = req.body.username;
    	 data.password = req.body.password;
    	 data.dept = req.body.dept;
    	 data.role = req.body.role;
    	 data.save(function(err,result){
            if(err) return handleError(err);
            res.send(result);
    	 });
    });
});
router.get('/:id',function(req,res,next){
    //get specific user
    var id =  req.params.id;
    userSchema.findOne({_id : id},function(err,data){
           if(err) return handleError(err);
           res.send(data);
    });
});
router.delete('/:id',function(req,res,next){
	//delete user
	var id = req.params.id;
	userSchema.remove({_id: id},function(err,data){
           if(err) return handleError(err);
           res.send(data);
	});

});

module.exports = router;
