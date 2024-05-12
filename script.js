LIKES_STR = "Лайки"
COMMENTS_STR = "Комментарии"
REPOSTS_STS = "Репосты"

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
  }

  __getEveryPostsCount(objectName)
  {
    let count = 0;
    for( let i = 0; i < this.arrayLength; i++ )
    {
      count += parseInt(this.postArray[i][objectName]["count"], 10);
    }
    return count;
  }

  getLikesCount()
  {
    return this.__getEveryPostsCount("likes");
  }

  getCommentsCount()
  {
    return this.__getEveryPostsCount("comments");
  }

  getRepostsCount()
  {
    return this.__getEveryPostsCount("reposts");
  }

  changeParams( pagePostsArray, pagePostsCount )
  {
    this.postArray =  pagePostsArray.slice(0);
    this.arrayLength = pagePostsCount;
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

  makeBaseRequest(Method, ParamsDict, CallbackFunction)
  {
    VK.Api.call(Method, ParamsDict, CallbackFunction);
  }

  getPosts(user_id, onGoodResponseFunction)
  {
    const searchParams = {
      "v" : "5.83",
      "owner_id" : user_id,
      "count" : 100,
    }

    this.makeBaseRequest("wall.get", searchParams, function(r) {
      console.log("get posts ", user_id);
      if(r.response) {
        console.log("all posts count:", r.response["count"]);
        console.log("response: ", r.response);

        let post = new VkPostItem();

        let realPostCount = 100;
        if( r.response["count"] < realPostCount )
          realPostCount = r.response["count"];
        post.changeParams(r.response["items"], realPostCount);
        onGoodResponseFunction();
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
    let user_id = search.getValue();
    if( user_id.length < 1 || user_id.includes("!@#$%^&*()_+-=[]{}\\|'\";:.,/") )
    {
      alert("bad id");
      return;
    }

    search.clear();

    req.getPosts(user_id, function() {
      let post = new VkPostItem();
      let infographics = new Infographics();
      let parameters = new Parameters();

      let currentParametrStr = parameters.getCurrentParametrName();
      let count = 0;
      if( currentParametrStr == LIKES_STR )
        count = post.getLikesCount();
      else if( currentParametrStr == REPOSTS_STR )
        count = post.getRepostsCount();
      else if( currentParametrStr == COMMENTS_STR )
        count = post.getCommentsCount();

      let date = new DateItem();

      let tableHeader = [ "Дата", currentParametrStr  + " Количество" ];
      let tableRow = [ date.getDate(), count ];

      let table = infographics.getTableItem();
      table.clear();

      table.addHeader(tableHeader);
      table.addRow(tableRow);
    });

    }
}

function showHideGraph(value) {
  console.log('show', value);
  let infographics = new Infographics();
  infographics.showItem(value);
}


function changeParametr(value) {
  console.log('parametr: ', value);
  let parameters = new Parameters();
  parameters.OnChange(value);
}

function changeDate() {
  console.log('date changed');
  let date = new DateItem();
  date.printDate();
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

    let table = new TableItem('tableContainer', 'theadMainTable', 'tbodyMainTable');
    this.items.addItem(table);

    this.items.newItem('chart');

    this.currentVisibleItem = 1;
  }

  getTableItem() { return this.items.allItems[1]; }

  showItem(value)
  {
    if( value == this.currentVisibleItem )
      return;

    if( value < 0 || value > (this.items.length - 1) )
      return;

    let arr = this.items.allItems;
    arr[this.currentVisibleItem].hide();
    arr[value].show();
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

  getCurrentParametrName()
  {
    switch( this.getCurrentVisibleItem() )
    {
      case 0:
        return LIKES_STR;
      case 1:
        return COMMENTS_STR;
      case 2:
        return REPOSTS_STR;
      default:
        return "Unknown";
    }
  }

  getCurrentVisibleItem()
  {
    return this.currentVisibleItem;
  }

  onChange(value)
  {
    if( value < 0 || value > this.items.length )
      return;

    this.currentVisibleItem = value;
  }
}


class DateItem extends Item{
  constructor()
  {
    if (DateItem._instance)
    {
      return DateItem._instance;
    }
    console.log('create DateItem');
    super("watch");
    DateItem._instance = this;
  }

  printDate()
  {
    console.log(this.getItem().value);
  }

  getDate()
  {
    return this.getItem().value;
  }
}
