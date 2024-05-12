class VkPostItem
{
  constructor()
  {
    if (VkPostItem._instance)
    {
      return VkPostItem._instance
    }
    console.log('create VkPostItem');
    VkPostItem._instance = this;

    this.postArray = [];
    this.arrayLength = 0;
    this.isSet = false;
  }

  __GetEveryPostsCount(objectName)
  {
    let count = 0;
    for( let i = 0; i < this.arrayLength; i++ )
    {
      count += parseInt(this.pagePostsArray[i][objectName]["count"], 10);
    }
    return count;
  }

  GetLikesCount()
  {
    return this.__GetEveryPostsCount("likes");
  }

  GetCommentsCount()
  {
    return this.__GetEveryPostsCount("comments");
  }

  GetRepostsCount()
  {
    return this.__GetEveryPostsCount("reposts");
  }

  IsPostInfoArrived()
  {
    return this.isSet;
  }

  WaitForParamsArrival()
  {
    this.isSet = false;
  }

  ChangeParams( pagePostsArray, pagePostsCount )
  {
    this.postArray =  pagePostsArray.slice(0);
    this.arrayLength = pagePostsCount;
    this.isSet = true;
  }
}

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

  MakeBaseRequest(Method, ParamsDict, CallbackFunction)
  {
    VK.Api.call(Method, ParamsDict, CallbackFunction);
  }

  GetPosts(user_id)
  {
    const searchParams = {
      "v" : "5.83",
      "user_id" : user_id,
      "count" : 100,
    }

    this.MakeBaseRequest("wall.get", searchParams, function(r) {
      console.log("get posts ", user_id);
      if(r.response) {
        console.log("all posts count:", r.response["count"]);
        console.log("response: ", r.response);

        let post = new VkPostItem();
        post.WaitForParamsArrival();
        post.ChangeParams(r.response["items"], r.response["count"]);
      }
      else
      {
        console.log("\nfailed");
        return null;
      }
    });
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

      // req.GetPhotos(user_id);
      req.GetPosts(user_id);

      let timeout = 500;
      setTimeout(function() {
        let post = new VkPostItem();
        console.log("likes: ", post.GetLikesCount());
        console.log("reposts: ", post.GetRepostsCount());
        console.log("comments: ", post.GetCommentsCount());

        let infographics = new Infographics();
        let parameters = new Parameters();
        let currentParametr = parameters.GetCurrentVisibleItem();
        console.log("current parameter: ", currentParametr);
      }, (timeout));

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

  GetCurrentVisibleItem()
  {
    return this.currentVisibleItem;
  }

  OnChange(value)
  {
    if( value < 0 || value > this.items.length )
      return;

    this.currentVisibleItem = value;
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
