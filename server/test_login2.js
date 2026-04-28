fetch("http://localhost:5000/api/auth/login", {
  method: "POST", 
  headers: {"Content-Type":"application/json"}, 
  body: JSON.stringify({universityId:"241FA04789", password:"password123", role:"driver"})
})
.then(r => r.json().then(data => ({ status: r.status, body: data })))
.then(console.log)
.catch(console.error);
