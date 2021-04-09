const mongoose = require('mongoose');
const facebookSchema = require('../models/facebook.js');
const profileSchema = require('../models/profile.js');
//連接 rt fb
const facebookDb = mongoose.createConnection('mongodb://0.0.0.0:27018/facebook', {
  auth: { authSource: 'admin' },
  user: 'eagle',
  pass: 'eagle-eye',
  useNewUrlParser: true,
  useUnifiedTopology: true,
  useCreateIndex: true,
});
facebookDb.on('error', () => {
  console.log('connect error!');
});
facebookDb.once('open', () => {
  console.log('fb mongodb connect!');
});

let Facebook = facebookDb.model('facebook', facebookSchema);
let Profile = facebookDb.model('profile', profileSchema);

module.exports = {
  dataTofacebookDb: async fanPage => {
    let oldData = await Facebook.findOne({ url: fanPage.url });
    if (!oldData) {
      Facebook.create(
        {
          url: fanPage.url,
          fanPageName: fanPage.fanPageName,
          like: fanPage.like,
          follower: fanPage.follower,
          profileImageUrl: fanPage.profileImageUrl,
          backgroundImageUrl: fanPage.backgroundImageUrl,
          posts: fanPage.posts,
        },
        (err, data) => {
          if (err) console.log(err);
          if (data) console.log('write data!!');
        }
      );
    } else {
      await Facebook.replaceOne(
        { _id: oldData._id },
        {
          url: fanPage.url,
          fanPageName: fanPage.fanPageName,
          like: fanPage.like,
          likeGrowValue: fanPage.likeGrowValue,
          follower: fanPage.follower,
          followerGrowValue: fanPage.followerGrowValue,
          profileImageUrl: fanPage.profileImageUrl,
          backgroundImageUrl: fanPage.backgroundImageUrl,
          posts: fanPage.posts,
        },
        (err, result) => {
          if (err) console.log(err);
          if (result) console.log('replace data!!');
        }
      );
    }
  },
  compareGrowValue: async fanPage => {
    let oldData = await Facebook.findOne({ url: fanPage.url });
    if (oldData) {
      fanPage.likeGrowValue = String(parseInt(fanPage.like) - parseInt(oldData.like));
      fanPage.commentGrowValue = String(parseInt(fanPage.commentValue) - parseInt(oldData.commentValue));
      fanPage.shareGrowValue = String(parseInt(fanPage.shareValue) - parseInt(oldData.shareValue));
      fanPage.posts.map(newPost => {
        oldData.posts.forEach(oldPost => {
          if (oldPost.title === newPost.title) {
            newPost.likeGrowValue = String(parseInt(newPost.like) - parseInt(oldPost.like));
            newPost.commentGrowValue = String(parseInt(newPost.commentValue) - parseInt(oldPost.commentValue));
            newPost.shareGrowValue = String(parseInt(newPost.shareValue) - parseInt(oldPost.shareValue));
          }
        });
        return newPost;
      });
    }
    return fanPage;
  },
  getDbData: async () => {
    return await Facebook.find({}).limit(20);
  },
  writeProfileToDb: async(profile) =>{
    let data = await Profile.findOne({realUrl: profile.realUrl})
    if(data){
      data.uuid = profile.uuid;
      data.realUrl = profile.realUrl;
      data.name = profile.name;
      data.backgroundImageUrl = profile.backgroundImageUrl;
      data.profileImageUrl = profile.profileImageUrl;
      data.from = profile.from;
      data.residence = profile.residence;
      data.friendValue = profile.friendValue? profile.friendValue: null;
      data.realAccount = profile.realAccount
      data.save((err, doc) =>{
        if(err) console.log(err)
        if(doc) console.log('replace a profile!!')
      });
    }
    else{
        Profile.create({
        uuid: profile.uuid,
        realUrl: profile.realUrl,
        name: profile.name,
        backgroundImageUrl: profile.backgroundImageUrl,
        profileImageUrl: profile.profileImageUrl,
        from: profile.from,
        residence: profile.residence,
        friendValue: profile.friendValue? profile.friendValue: null,
        realAccount: profile.realAccount
      },(err, doc) =>{
        if(err) console.log(err)
        if(doc) console.log('write a profile!!')
      })
    }
  },
  uuidFindProfile: async (uuid) =>{
    return await Profile.findOne({uuid: uuid});
  },
  urlFindProfile: async (url) =>{
    return await Profile.findOne({realUrl: url});
  },
};
