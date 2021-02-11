const http = require('http')

const data = JSON.stringify({"username": "test_user00", "token": null,  "operation_name": "LOGON", "task_data":{ "password": "bobytest", "role": "" }})

const options = {
  hostname: 'localhost',
  port: 8080,
  path: '/api',
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'Content-Length': data.length
  }
}

const req = http.request(options, res => {
  console.log(`statusCode: ${res.statusCode}`)

  res.on('data', d => {
    process.stdout.write(d)
  })
})

req.on('error', error => {
  console.error(error)
})

req.write(data)
req.end()