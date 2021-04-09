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
      if(!this.backgroundImageUrl) value++
      if(!this.profileImageUrl) value++
      if(!this.from) value++
      if(!this.residence) value++
      if(!this.friendValue) value++

      if(value > 2) this.realAccount = false
      else this.realAccount = true
    }
  }
  
  module.exports = Profile;
  