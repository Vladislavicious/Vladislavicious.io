
class CallbackSynchronizer
{
  constructor()
  {
    if (CallbackSynchronizer._instance)
      {
        return CallbackSynchronizer._instance
      }
      console.log('create CallbackSynchronizer');
      CallbackSynchronizer._instance = this;
      this.Results = {};
    }

  GetPromise(Method, ParamsDict)
  {

    return new Promise((resolve, reject) => {

      VK.Api.call(Method, ParamsDict, (r) => {
        if( r.response )
        {
          resolve(r.response);
        }
        else
          reject(null);
      });

    });

  }
};

class RequestMaker
{
  constructor()
  {
    if (RequestMaker._instance)
    {
      return RequestMaker._instance
    }
    console.log('create RequestMaker');
    RequestMaker._instance = this;
  }

  MakeBaseRequest(Method, ParamsDict)
  {
    let syncronizer =  new CallbackSynchronizer();
    return syncronizer.GetPromise(Method, ParamsDict);
  }

  GetFollowersCount(user_id)
  {
    const searchParams = {
      "v" : "5.83",
      "user_id" : user_id,
      "fields" : "followers_count",
    }
    // result = { "followers_count" : 0 };
    console.log("get followers ", user_id);
    let promise = this.MakeBaseRequest("users.get", searchParams);
    promise
    .then(
      result => {
        console.log(result);
        console.log("followers_count ", result[0]["followers_count"]);
        return result;
      },
      error => {
        console.log("\nfailed");
        return error;
      }
    );
  }

  GetAlbums(user_id)
  {
    const searchParams = {
      "v" : "5.83",
      "user_id" : user_id,
    }

    console.log("get album ", user_id);
    let result = this.MakeBaseRequest("photos.getAlbums", searchParams);
    if(result) {
      console.log("albums count: \n");
      console.log(result["count"]);
      return result["items"];
    }
    else
    {
      console.log("\nfailed");
      return null;
    }
  }

  GetPhotos(user_id)
  {
    albums = this.GetAlbums(user_id);
    if( albums == null )
      return null;

    if( albums.length == 0 )
    {
      console.log(" zero albums ");
      return null;
    }

    const searchParams = {
      "v" : "5.83",
      "user_id" : user_id,
      "album_id" : albums[0]["id"],
    };

    let result = this.MakeBaseRequest("photos.get", searchParams);
    console.log("get photos ", user_id);
    if(result) {
      console.log("photos count: \n");
      console.log(result["count"]);
      return result["items"];
    }
    else
    {
      console.log("\nfailed");
      return null;
    }
  }

  GetPosts(user_id)
  {
    const searchParams = {
      "v" : "5.83",
      "user_id" : user_id,
      "count" : 1, // Пытаемся получить максимальное число постов
    }

    let result = this.MakeBaseRequest("wall.get", searchParams);
    console.log("get posts ", user_id);
    if(result) {
      console.log("all posts count: \n");
      console.log(result["count"]);
      return result["items"];
    }
    else
    {
      console.log("\nfailed");
      return null;
    }
  }
}

function echoFunc(params)
{
  console.log(params);
}

function InitializeVk()
{
  console.log("initializing");
  VK.init({
    apiId: 51902989,
    onlyWidget: false
  });

  VK.Auth.getLoginStatus(echoFunc);
};

let req = new RequestMaker();


// Other functions
class SearchItem extends InputItem
{
  constructor(name)
  {
    if (SearchItem._instance)
    {
      return SearchItem._instance
    }
    console.log('create SearchItem');
    super(name);
    SearchItem._instance = this;
  }
}


function inputEnter(event){
  let search = new SearchItem("searchInput");
  if (event.key === "Enter") {

    let req = new RequestMaker();
    let user_id = parseInt( search.GetValue() );
    if( user_id == NaN )
      {
        alert("bad id");
        return;
      }

      search.Clear();

      let retVal = req.GetFollowersCount(user_id);
      console.log("retval: ", retVal);
      // req.GetPhotos(user_id);
      // req.GetPosts(user_id);
    }
}

function showHideGraph(value) {
  console.log('show', value);
  let infographics = new Infographics();
  infographics.ShowItem(value);
}


function changeParametr(value) {
  console.log('parametr: ', value);
  let parameters = new Parameters();
  parameters.OnChange(value);
}

function changeDate() {
  console.log('date changed');
  let date = new DateItem('watch');
  date.PrintDate();
}

class Infographics {
  constructor()
  {
    if (Infographics._instance)
    {
      return Infographics._instance;
    }
    console.log('create infographics');
    Infographics._instance = this;
    this.items = new myArray(HideableItem);
    this.items.newItem('graph');
    this.items.newItem('table');
    this.items.newItem('chart');

    this.currentVisibleItem = 1;
  }

  ShowItem(value)
  {
    if( value == this.currentVisibleItem )
      return;

    if( value < 0 || value > (this.items.length - 1) )
      return;

    let arr = this.items.allItems;
    arr[this.currentVisibleItem].Hide();
    arr[value].Show();
    this.currentVisibleItem = value;
  }
}

class Parameters {
  constructor()
  {
    if (Parameters._instance)
    {
      return Parameters._instance
    }
    console.log('create parametrs');
    Parameters._instance = this;

    this.items = [];
    this.items.push('likes');
    this.items.push('comments');
    this.items.push('reposts');

    this.currentVisibleItem = 1;
  }

  OnChange(value)
  {
    if( value < 0 || value > this.items.length )
      return;

    console.log(this.items[value]);
  }
}


class DateItem extends Item{
  constructor(name)
  {
    super(name);
    console.log('create date ', this.name);
  }

  PrintDate()
  {
    console.log(this.GetItem().value);
  }
}
