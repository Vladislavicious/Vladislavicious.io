class AuthMaker
{
  constructor()
  {
    if (AuthMaker._instance)
    {
      return AuthMaker._instance;
    }
    console.log('create AuthMaker');
    AuthMaker._instance = this;
    const queryString = window.location.search;

    if( queryString.length > 1 )
    {
      // Извлекаем строку JSON из параметров
      let jsonParams = decodeURIComponent(queryString.split('payload=')[1]);

      // Преобразуем JSON в объект
      this.paramsObject = JSON.parse(jsonParams);

      // Выводим полученный объект
      console.log(this.paramsObject);

      this.SilentToken = this.paramsObject["token"];

      console.log("silent token:\n");
      console.log(this.SilentToken);
      console.log("\n");

      this.Uuid = this.paramsObject["uuid"];
      console.log("uuid:\n");
      console.log(this.Uuid);
      console.log("\n");
    }
    else
    {
      console.log("error extracting querystring");
      this.Uuid = 123456;
    }

    this.ServiceToken = "d51dec46d51dec46d51dec46abd60a164bdd51dd51dec46b3012907e548c61bd00ce23e";
  }

  parseAccessToken()
  {
    let url = new URL('https://api.vk.com/method/auth.exchangeSilentAuthToken');
    url.searchParams.set('v', '5.131');
    url.searchParams.set('token', this.SilentToken);
    url.searchParams.set('access_token', this.ServiceToken);
    url.searchParams.set('uuid', this.Uuid);

    const xhr = new XMLHttpRequest();
    xhr.onreadystatechange = function() {
    if (this.readyState == 4 && this.status == 200) {
      console.log(this.responseText)
      }
    }
    xhr.open('GET', url);
    xhr.send();
    if( xhr.readyState == 4 && xhr.status == 200 )
    {
      console.log(xhr.responseText);
      this.responseText = xhr.responseText;
      this.AccessToken = xhr.responseText["access_token"];
    }
    else
    {
      this.AccessToken = "didn't get";
      this.responseText = null;
      console.log("error GET: ", url);
      console.log("status: ", xhr.status);
    }
  }
};

// let Auth = new AuthMaker();
// Auth.parseAccessToken();
// console.log(Auth.AccessToken);

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

    let Auth = new AuthMaker();
    this.ServiceToken = Auth.ServiceToken;
    this.Uuid         = Auth.Uuid;
  }

  MakeBaseRequest(Method, ParamsDict)
  {
    VK.Api.call(Method, ParamsDict, function(r) {
      if(r.response) {
        console.log(r.response[0]);
        return r.response;
      }
      else
      {
        console.log("\nfailed");
        return null;
      }
    });

  }

  GetFollowersCount(user_id)
  {
      const searchParams = {
        "v" : "5.83",
        "user_id" : user_id,
        "fields" : "followers_count",
      }
      console.log("get followers ", user_id);
      let result = this.MakeBaseRequest("users.get", searchParams);
      if( result != null )
      {
        console.log("followers_count\n");
        console.log(result[0]["followers_count"]);
        console.log(result);
      }
      else
      {
        console.log("failed");
      }
  }

  GetPhotos(user_id)
  {
    const searchParams = {
      "v" : "5.83",
      "user_id" : user_id,
    }
    console.log("get photos ", user_id);
    let result = this.MakeBaseRequest("photos.get", searchParams);
    if( result != null )
    {
      console.log("photos count: \n");
      console.log(result["count"]);
      console.log(result);
    }
    else
    {
      console.log("failed");
    }
  }

  GetPosts(user_id)
  {
    const searchParams = {
      "v" : "5.83",
      "user_id" : user_id,
      "count" : 100, // Пытаемся получить максимальное число постов
    }
    console.log("get posts ", user_id);
    let result = this.MakeBaseRequest("wall.get", searchParams);
    if( result != null )
    {
      console.log("posts count: \n");
      console.log(result["count"]);
      console.log(result);
    }
    else
    {
      console.log("failed");
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

req.GetFollowersCount(123456);
req.GetPhotos(123456);
req.GetFollowersCount(12345);
req.GetPhotos(12345);


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

      let followers = req.GetFollowersCount(user_id);
      let photos = req.GetPhotos(user_id);
      let posts = req.GetPosts(user_id);
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
