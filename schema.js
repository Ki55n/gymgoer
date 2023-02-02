const mongoose = require("mongoose");
mongoose.set('strictQuery', false);
mongoose.set('useUnifiedTopology', true);
//mongoose.connect("mongodb+srv://freakyluffy:Himanshu%402000@cluster0.vd8zb.mongodb.net/test", { useNewUrlParser: true });
mongoose.connect("mongodb://localhost:27017/test");
const user_details = new mongoose.Schema({
  name: String,
  email:String,
  userid:String,
  password:String
});
const user_refer = new mongoose.Schema({
    userid:String,
    refer:String
  });
const user = mongoose.model("names", user_details);
const refer= mongoose.model("refers", user_refer);
// var user1 = new refer({ userid:"hima123",refer:"ACBDED"});
//                     user1.save(function (err, results) {
//                            if(err==null)
//                            {
//                               console.log("data successfully inserted");
//                            }
//                     });

// var user1 = refer.findOne({userid:"hima123" },function(err,docs)
//         {
//           console.log(docs);
//         });
module.exports = { User: user, Referral:refer }