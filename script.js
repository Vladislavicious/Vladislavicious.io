const LIKES_STR = "Лайки"
const COMMENTS_STR = "Комментарии"
const REPOSTS_STR = "Репосты"

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

function changeParamsInInfographics()
{
  let infographics = new Infographics();
  if( infographics.isInfoAvailable() )
    changeInfographicsData( null );
}

function changeInfographicsData( user_id )
{
  let infographics = new Infographics();
  let parameters = new Parameters();

  let countName = parameters.getCurrentParametrName();
  let count = 0;
  if( countName == LIKES_STR )
    count = 25;
  else if( countName == REPOSTS_STR )
    count = 452;
  else if( countName == COMMENTS_STR )
    count = 11;

  let date = new DateItem();
  let datesArray = [date.getDate(), date.getDate(), date.getDate()];
  let countOnDateArray = [count, count * 2, count / 2];

  infographics.sendInfoForInfographics(datesArray, countOnDateArray, countName, user_id);

  // let post = new VkPostItem();
  // let infographics = new Infographics();
  // let parameters = new Parameters();

  // let countName = parameters.getCurrentParametrName();
  // let count = 0;
  // if( countName == LIKES_STR )
  //   count = post.getLikesCount();
  // else if( countName == REPOSTS_STR )
  //   count = post.getRepostsCount();
  // else if( countName == COMMENTS_STR )
  //   count = post.getCommentsCount();

  // let date = new DateItem();
  // let datesArray = [date.getDate()];
  // let countOnDateArray = [count];

  // infographics.sendInfoForInfographics(datesArray, countOnDateArray, countName, user_id);
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

    let infographics = new Infographics();
    infographics.clearPreviousInfo();

    changeInfographicsData( user_id );


    // setTimeout( function() {
    //   if( !infographics.isInfoAvailable() )
    //   {
    //     alert("information has not arrieved");
    //   }
    // }, 1500 );

    // req.getPosts(user_id, function() {
    //   changeInfographicsData( user_id );
    // });

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
  parameters.onChange(value);
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

    let table = new TableItem('tableContainer', 'theadMainTable', 'tbodyMainTable');
    this.items.addItem(table);

    let chart = new ChartItem();
    this.items.addItem(chart);

    this.currentVisibleItem = 0;
  }

  clearPreviousInfo()
  {
    this.datesArray = undefined;
    this.countOnDateArray = undefined;
    this.countName = undefined;
    this.idName = undefined;
  }

  isInfoAvailable() {
    if( this.idName )
    {
      return true;
    }
    return false;
  }

  __getTableItem() { return this.items.allItems[0]; }

  showTable(datesArray, countOnDateArray, countName, idName)
  {
    let tableHeader = [ "Дата", countName ];

    let table = this.__getTableItem();
    table.clear();
    table.addHeader(tableHeader);

    for( let i = 0; i < datesArray.length; i++ )
    {
      let tableRow = [ datesArray[i], countOnDateArray[i] + " шт." ];
      table.addRow(tableRow);
    }
  }

  showInfographics()
  {
    if( !this.datesArray )
      return;

    if( this.currentVisibleItem == 0 )
    {
      this.showTable(this.datesArray, this.countOnDateArray,
                     this.countName, this.idName);
    }
    else if( this.currentVisibleItem == 1 )
    {
      let chart = new ChartItem();
      chart.createGraph(this.datesArray, this.countOnDateArray,
                        this.countName, this.idName);
    }
  }

  sendInfoForInfographics(datesArray, countOnDateArray, countName, idName)
  {
    this.datesArray = datesArray.slice(0);
    this.countOnDateArray = countOnDateArray.slice(0);
    this.countName = countName;
    if( idName != null )
      this.idName = idName;

    this.showInfographics();
  }

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
    this.showInfographics();
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

    this.currentVisibleItem = "0";
  }

  getCurrentParametrName()
  {
    switch( this.getCurrentVisibleItem() )
    {
      case "0":
        return LIKES_STR;
      case "1":
        return COMMENTS_STR;
      case "2":
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
    changeParamsInInfographics();
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

function getCssVar(varName)
{
  return getComputedStyle(document.documentElement,null).getPropertyValue(varName);
}

class ChartItem extends HideableItem {

  constructor()
  {
    if( ChartItem._instance )
    {
      return ChartItem._instance;
    }
    console.log("create ChartItem");
    super("chart");
    this.chart = new Item("myChart");
    ChartItem._instance = this;

    let fontColor = getCssVar('--text-color');
    Chart.defaults.color = fontColor;

  }

  _getContext() { return this.chart.getItem().getContext('2d'); }

  createGraph( datesArray, countOnDateArray, countName, idName )
  {
    if( this.graph )
    {
      this.graph.destroy();
    }
    this.graph = new Chart( this._getContext(), {
      type: 'line',
      data: {
        labels: datesArray,
        datasets: [
          {
            label: countName,
            data: countOnDateArray,
            backgroundColor: getCssVar("--darker-back-color"),
            borderColor: getCssVar("--light-color"),
            borderWidth: 1,
          },
        ],
      },
      options: {
        plugins: {
            title: {
                display: true,
                text: idName,
            },
          },
      },
    });
  }

  show()
  {
    this.getItem().style.display = "flex";
  }
}
