

function registerUser() {
  
  let name = document.getElementById("nameofuser").value;
  let email = document.getElementById("email").value;
  let username = document.getElementById("username").value;
  let password = document.getElementById("password").value;

   
    // Validation checks
    if (!name || !email || !username || !password) {
      alert("Please fill out all fields");
      return;
  }
  if (name==" "||username==" "||password==""){
    alert("Please enter a valid email address");
    return;
}
  // Check for a valid email format
  if (!isValidEmail(email)) {
      alert("Please enter a valid email address");
      return;
  }
  function isValidEmail(email) {
    // You can implement a more sophisticated email validation regex if needed
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  }
  

  const link = "http://localhost:3000/register";

  let senddata = JSON.stringify({
    name: name,
    email: email,
    username: username,
    password: password,
  });


  fetch(link, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: senddata,
  })
    .then((response) => {
      if (!response.ok) {
        throw new Error("Network Response was not ok");
      }

      // if (response.redirected) {
      //   window.location.href = response.url;
      // }
      // conole.log("rseponse");
      return response.json();
    })

    .then((data) => 
    {

      
      if(data.token)
      {
        console.log("registwrr   wsknk")

        // conole.log("dtatoken");
        // let content="<p id='custommessage' >Registration Successful</p>"
        // document.getElementById('message').innerHTML=content;

        // setTimeout(()=>{
        //   let content="<p id='custommessageredirect' >Redirecting to Login !</p>"
        //   document.getElementById('message').innerHTML=content;
        // },1000)
        console.log("login page not going",data.token)
         
        // setTimeout(()=>{
          window.location.href="/login/index.html"
        // },2000)
        
       
      }


    })
    .catch((error) => {
      console.log(error.message);
    });

    
}

