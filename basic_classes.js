class myArray {
  constructor(type){
    this.type = type;
    this.items = []
  }

  newItem(...args){
    let p = new this.type(...args);
    this.items.push(p);
    return p;
  }

  get allItems(){
    return this.items;
  }

  get numberOfItems(){
      return this.items.length;
  }
}

function Enum(obj)
{
    // итоговый объект
    const newObj = {};
    // проходимся по каждому свойству переданного в функцию объекта
    for( const prop in obj )
    {
        // проверяем наличие собственного свойства у объекта
        if (obj.hasOwnProperty(prop)) {

            // помещаем в новый объект специальный примитивный тип JavaScript Symbol
            newObj[prop] = obj[prop];
        }
    }

    // делаем объект неизменяемым (свойства объекта нельзя будет изменить динамически)
    return Object.freeze(newObj);
}

// html-specific classses

class Item {
  constructor(name)
  {
    this.name = name;
  }

  GetItem()
  {
    return document.getElementById(this.name);
  }
}

class HideableItem extends Item {
  constructor(name)
  {
    super(name);
  }

  Show()
  {
    this.GetItem().style.display = 'block';
  }

  Hide()
  {
    this.GetItem().style.display = 'none';
  }
}

class InputItem extends HideableItem {
  constructor(name)
  {
    super(name);
  }

  GetValue()
  {
    return this.GetItem().value;
  }

  Clear()
  {
    this.GetItem().value = "";
  }
}
