let express = require('express')
let mongodb = require('mongodb')
let sanitizeHTML = require('sanitize-html')

let app = express()
let db


let port = process.env.PORT
if (port == null || port == "") {
    port = 3000
}

app.use(express.static('public'))

let connectionString = 'mongodb+srv://todoAppUser:DvrvofqVJIDajxUg@cluster0.uwuq3.mongodb.net/TodoApp?retryWrites=true&w=majority'
mongodb.connect(connectionString, {useNewUrlParser: true, useUnifiedTopology: true}, function(err, client) {
    db = client.db()
    app.listen(port)
})

app.use(express.json())
app.use(express.urlencoded({extended: false}))

// Password Protection {username: username, password: password}
function passwordProtected(req, res, next) {
  res.set('WWW-Authenticate', 'Basic realm="Shopping List"')
  // console.log(req.headers.authorization) - with this we can type in our desired username and password to the interface in the browser and it will be logged to the console in encoded in base 64 format. 
  if (req.headers.authorization == "Basic dXNlcm5hbWU6cGFzc3dvcmQ=") {
    next()
  } else {
    res.status(401).send("Authentication required")
  }
}

app.use(passwordProtected)

app.get('/', function(req, res) {
  db.collection('items').find().toArray(function (err, items) {
    res.send(`
      <!DOCTYPE html>
      <html lang="en">
      <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <meta http-equiv="X-UA-Compatible" content="ie=edge">
        <title>Shopping List</title>
        <link rel="stylesheet" href="style.css">
        <link href="https://fonts.googleapis.com/css2?family=Raleway:wght@200;300;400;500;600&display=swap" rel="stylesheet">
      </head>
      <body>
        <div class="container">
          <h1 class="title align-center">Shopping List</h1>
    
          <div class="form-container">
            <form id="create-form" action="/create-item" method="POST" class="b-margin-null">
              <div class="align-center d-flex">
                <input id="create-field" name="item" autofocus autocomplete="off" type="text" class="input-field" type="text" placeholder=" e.g. tomato">
                <button class="btn btn--add-item">Add new item</button>
              </div>
            </form>
          </div>
    
          <button class="btn btn--clear-all" onclick="clearAllItems()">Clear All</button>
            
          <ul id="item-list" class="text-color-light">
          
          </ul>
        </div>
    
        <script>
          let items = ${JSON.stringify(items)}
        </script>
        <script src="https://unpkg.com/axios/dist/axios.min.js"></script>
        <script src="/browser.js"></script>
      </body>
      </html>
    `)
  })
})

app.post('/create-item', function(req, res) {
  let safeText = sanitizeHTML(req.body.text, {allowedTags: [], allowedAttributes: {}}) // we dont allow HTML tags or attributes, because the array and object is empty in the options
  db.collection('items').insertOne({text: safeText}, function(err, info) {
    res.json(info.ops[0])
    })
})

app.post('/update-item', function(req, res) {
  let safeText = sanitizeHTML(req.body.text, {allowedTags: [], allowedAttributes: {}}) // we dont allow HTML tags or attributes, because the array and object is empty in the options
  db.collection('items').findOneAndUpdate({_id: new mongodb.ObjectId(safeText)}, {$set: {text: req.body.text}}, function() {
    res.send("Success")
  })
})

app.post('/delete-item', function(req, res) {
  db.collection('items').deleteOne({_id: new mongodb.ObjectId(req.body.id)}, function() {
    res.send("Success")
  })
})

app.post('/clear-all-items', function(req, res) {
  db.collection('items').deleteMany({}, function() {
    res.send("Success")
  })
})