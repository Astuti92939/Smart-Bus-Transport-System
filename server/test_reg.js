fetch("http://localhost:5000/api/auth/register", {
  method: "POST", 
  headers: {"Content-Type":"application/json"}, 
  body: JSON.stringify({
    name: "Test Driver",
    universityId: "DRV-TEST", 
    password: "password123", 
    role: "driver",
    phone: "12345",
    region: "Main Campus"
  })
})
.then(r => r.json().then(data => ({ status: r.status, body: data })))
.then(console.log)
.catch(console.error);
