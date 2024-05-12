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

  addItem(item){
    this.items.push(item);
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

  getItem()
  {
    return document.getElementById(this.name);
  }
}

class HideableItem extends Item {
  constructor(name)
  {
    super(name);
  }

  show()
  {
    this.getItem().style.display = 'block';
  }

  hide()
  {
    this.getItem().style.display = 'none';
  }
}

class InputItem extends HideableItem {
  constructor(name)
  {
    super(name);
  }

  getValue()
  {
    return this.getItem().value;
  }

  clear()
  {
    this.getItem().value = "";
  }
}

class TableRowItem {
  constructor(cellStringsArr, cellType)
  {
    this.rowItem = document.createElement("tr");

    for( let i = 0; i < cellStringsArr.length; i++ )
    {
      let cell = document.createElement(cellType);
      cell.innerHTML = cellStringsArr[i];
      this.rowItem.appendChild(cell);
    }
  }

  getRow() { return this.rowItem; };
}

class TableItem extends HideableItem {
  constructor(name, theadName, tbodyName)
  {
    super(name);

    this.tHead = new Item(theadName);
    this.tBody = new Item(tbodyName);
  }

  __getTHead() { return this.tHead.getItem(); }
  __getTBody() { return this.tBody.getItem(); }

  addHeader(ColumnNamesArr)
  {
    let columnRow = new TableRowItem(ColumnNamesArr, "th");
    this.__getTHead().appendChild( columnRow.getRow() );
  }

  addRow(RowDataArr)
  {
    let Row = new TableRowItem(RowDataArr, "td");
    this.__getTBody().appendChild( Row.getRow() );
  }

  clear()
  {
    this.__getTBody().replaceChildren();
    this.__getTHead().replaceChildren();
  }

  show()
  {
    this.getItem().style.display = 'flex';
  }
}
