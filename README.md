# This is a small form validator library

- Embraces native HTML form validation
- Get data from the form element

</> Quick start
To use an external validator script, put the 'validator.js' file in the src (source) attribute of a <script> tag:

<script src="./validator.js"></script>

in your HTML document:

# you have to define your form with the following pattern in HTML document

  <form id="form-name">
    <div class='form-group'>
      <input id='input-name' name='input-name' /> // The field you want to validate you can change it into select/ file/ textarea,...
      <span class='form-message'></span>
    </div>
  </form>

note: input-name is optional

# first call Validator function and pass a object to it:

Validator({})

# Inside object you have to includes:

form, formGroupSelector, formMessageSelector, rules

The following code excerpt demonstrates a basic usage example:

  <script src="/Validator.js"></script>
  <script>
   Validator({
    form: '#form-1',
    formGroupSelector: '.form-group',
    formMessageSelector: '.form-message',
    rules: [
      Validator.isRequired('#fullname', 'Vui lòng nhập tên đầy đủ của bạn'),
      Validator.isEmail('#email', 'Trường này phải là email'),
      Validator.isRequired('#email', 'Vui lòng nhập trường này'),
      Validator.minLength('#password', 6, 'Mật khẩu phải tối thiểu 6 ký tự'),
      Validator.isConfirmed('#password-confirmation', 
        () => {
          return document.querySelector('#form-1 #password').value
        },
        'Mật khẩu không trùng khớp'),
      Validator.isRequired('#password-confirmation', 'Vui lòng nhập trường này'),
      Validator.isRequired('input[name="gender"]', 'Vui lòng chọn trường này'),
    ],
    onSubmit(data) {
      console.log(data) // the data from form-1
    }
   })
  </script>
