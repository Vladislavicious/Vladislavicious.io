const VKID = window.VKIDSDK;

// const que = "?payload=%7B%22type%22%3A%22silent_token%22%2C%22auth%22%3A1%2C%22user%22%3A%7B%22id%22%3A145262192%2C%22first_name%22%3A%22%D0%92%D0%BB%D0%B0%D0%B4%D0%B8%D1%81%D0%BB%D0%B0%D0%B2%22%2C%22last_name%22%3A%22%D0%A8.%22%2C%22avatar%22%3A%22https%3A%2F%2Fsun9-33.userapi.com%2Fs%2Fv1%2Fig2%2F0VeBM-_fWoVGhr9OXwS8ePIuMWoC_Beobdx3wuAsz1-U4LxvbEwZYvRgTUsNWC5awZcEM6B3eA0opQqlsHtVWBLz.jpg%3Fsize%3D200x200%26quality%3D95%26crop%3D131%2C470%2C336%2C336%26ava%3D1%22%2C%22avatar_base%22%3Anull%2C%22phone%22%3A%22%2B7%20***%20***%20**%2070%22%7D%2C%22token%22%3A%22ksq0YlIml4yza0Iw7udpdEt6qTP6p8mya8x1Bwpum_Z2ZkkaUrS42eEsQ9CpcN44vgXGoIHCT4qbpvSOMa2v7tRzS4ER-uOPieIqPU9499TZzYj1ffn_Qwj3g1VskVqztF7JeRH_dwUBkDpe5zd8saEzwE7crw2QyI2XMBQ2ANMu8m6HCfQbXnlgCbIHY7px7kly7JPi6-iDw1aLMNSeD8YXKh9I7qV3UggroGb9lP-hcgUQsG2NqrBMpkNP1TNvZVieFP5V8zqT-TGZupMH-jJASoumniRKSNG5lI5qHq03d7sCVhaGU80xu3S4YlTqHtmXzJ7MqN-ZbutfZpVXRo1ratKPYMPcuHBY1zwYF7Vy72ZbRYE2Po2QoZwjN1kd%22%2C%22ttl%22%3A600%2C%22uuid%22%3A%22hwruyt%22%2C%22hash%22%3A%22LaZflhloeCOORwlngy3GQUsVzapaaleKMS5Vnx6r7bH%22%2C%22loadExternalUsers%22%3Afalse%7D";

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
    // const queryString = que;

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

    this.AccessToken = NaN;
    this.ServiceToken = 51902989;
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
    xhr.open('GET', url)
    xhr.send()
    if( xhr.readyState == 4 && xhr.status == 200 )
    {
      console.log(xhr.responseText);
    }
    else
    {
      console.log("error GET: ", url);
      console.log("status: ", xhr.status);
    }
  }
};

let Auth = new AuthMaker();




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
