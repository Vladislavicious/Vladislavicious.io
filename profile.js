function InitializeVkProfile()
{
  console.log("initializing profile");
  VK.init({
    apiId: 51902989,
    onlyWidget: false
  });

  VK.Auth.getLoginStatus( function(response) { console.log("login status", response); } );
};

class VkAccountInfo
{
  constructor()
  {
    if( VkAccountInfo._instance )
    {
      return VkAccountInfo._instance;
    }
    console.log("creating VkAccountInfo");
    VkAccountInfo._instance = this;
  }

  getId() { return this.id; }
  getPhotoLink() { return this.photoLink; }
  getFullName() { return this.firstName + " " + this.lastName; }

  initialize(id, photoLink, firstName, lastName)
  {
    this.id = id;
    this.photoLink = photoLink;
    this.firstName = firstName;
    this.lastName = lastName;
  }
}
