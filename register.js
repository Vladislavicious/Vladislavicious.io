
function parseLoginPassword() {
  console.log('parsing');

  let auth = new AuthForm();
  auth.Clear();
}

function showSecondPassword() {
  console.log('show second password');

  let auth = new AuthForm();
  auth.ShowSecondPassword();
}

class AuthForm {
  constructor()
  {
    if (AuthForm._instance)
    {
      return AuthForm._instance
    }
    console.log('create AuthForms');
    AuthForm._instance = this;

    this.index = new Enum( { login: 0, password: 1, second_password: 2, end: 3 } );
    this.inputs = new myArray(InputItem);
    this.inputs.newItem("login-input");
    this.inputs.newItem("password-input");
    this.inputs.newItem("second-password-input");

    this.registration = false;
  }

  ShowSecondPassword()
  {
    if( this.registration == true )
    {
      this.inputs.allItems[this.index.second_password].Hide();
    }
    else
    {
      this.inputs.allItems[this.index.second_password].Show();
    }

    this.registration = !this.registration;
  }

  Clear()
  {
    for (let i = 0; i < this.index.end; i++)
      this.inputs.allItems[i].Clear();
  }

}
