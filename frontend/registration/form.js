const form = document.getElementById('form')
const fullname_input = document.getElementById('fullname-input')
const email_input = document.getElementById('email-input')
const password_input = document.getElementById('password-input')
const repeat_password_input = document.getElementById('repeat-password-input')
const error_message = document.getElementById('error-message')
form.addEventListener('submit', (e) => {
   e.preventDefault() 

   let errors = []
   
   if(fullname_input){
    errors = getSignupFormErrors(fullname_input.value, email_input.value, password_input.value, repeat_password_input.value)
   }
   else{
    errors = getLoginFormErrors(email_input.value, password_input.value)
   }
   if(errors.length > 0){
    e.preventDefault()
    error_message.innerText = errors.join(".  ")
   }
})
function getSignupFormErrors(fullname, email, password, repeatpassword){
  let errors = []
  
  if(fullname === '' || fullname == null){
    errors.push('Fullname is required')
    fullname_input.parentElement.classList.add('incorrect')
  }
  if(email === '' || email == null){
    errors.push('Email is required')
    email_input.parentElement.classList.add('incorrect')
  }
  if(password === '' || password == null){
    errors.push('Password is required')
    password_input.parentElement.classList.add('incorrect')
  }
  if(password.length < 8){
    errors.push('Password must have atleast 8 characters')
    password_input.parentElement.classList.add('incorrect')
  }
  if(password !== repeatpassword){
    errors.push('Passwoerd does not match repeated Password')
    password_input.parentElement.classList.add('incorrect')
    repeat_password_input.parentElement.classList.add('incorrect')
  }
  return errors;
}

function getLoginFormErrors(email, password){
    let errors = []
    
    if(email === '' || email == null){
        errors.push('Email is required')
        email_input.parentElement.classList.add('incorrect')
      }
      if(password === '' || password == null){
        errors.push('Password is required')
        password_input.parentElement.classList.add('incorrect')
      }

    return errors;
}
const allInputs = [fullname_input, email_input, password_input, repeat_password_input].filter(input => input != null)
 allInputs.forEach(input => {
    input.addEventListener('input',() => {
       if(input.parentElement.classList.contains('incorrect')){
        input.parentElement.classList.remove('incorrect')
        error_message.innerText =' '
       } 
    })
 })