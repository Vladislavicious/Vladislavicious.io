const PHOTO_FIELD = "photo_200_orig";
const NO_PHOTO_LINK = "https://static.tildacdn.com/tild3133-6461-4762-b763-393238646435/1_9e9CY6nDatrFlVkDHW.png";

function InitializeVkProfile()
{
  console.log("initializing profile");
  VK.init({
    apiId: 51902989,
    onlyWidget: false
  });

  VK.Auth.getLoginStatus( function(response) { console.log("login status: ", response); } );
  let vkAccInfo = new VkAccountInfo();
  vkAccInfo.getCurrentUserInformation();
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

    this.htmlName = new TextItem("profileName");
    this.htmlId = new TextItem("profileId");
    this.htmlImage = new ImageItem("profilePhoto");
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

    this.htmlName.setValue( this.getFullName() );
    this.htmlId.setValue( "ID: " + this.id );
    this.htmlImage.changeImage( this.photoLink );
  }

  getCurrentUserInformation()
  {
    const searchParams = {
      "v" : "5.83",
      "fields" : PHOTO_FIELD,
    }

    let vkAccInfo = new VkAccountInfo();

    VK.Api.call("users.get", searchParams, function(r) {
      console.log("get users info");
      if(r.response) {
        console.log("response: ", r.response);

        let response = r.response[0];
        vkAccInfo.initialize( response["id"], response[PHOTO_FIELD],
                              response["first_name"], response["last_name"] );

      }
      else
      {
        vkAccInfo.initialize( 0, NO_PHOTO_LINK,
                              "пользователь", "не найден" );
        console.log("\nfailed");
      }
    });
  }
}

function ExitButtonPress()
{
  window.open('index.html');
}
