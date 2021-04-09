class Profile {
    constructor() {
      this.uuid = null;
      this.realUrl = null;
      this.name = null;
      this.backgroundImageUrl = null;
      this.profileImageUrl = null;
      this.from = null;
      this.residence = null;
      this.friendValue = null;
      this.realAccount = null;
    }
    checkRealAccount(){
      let value = 0
      if(this.backgroundImageUrl == null) value++
      if(this.profileImageUrl == null) value++
      if(this.from == null) value++
      if(this.residence == null) value++
      if(this.friendValue == null) value++
 
      if(value > 2) this.realAccount = false
      else this.realAccount = true
    }
  }
  
  module.exports = Profile;
  