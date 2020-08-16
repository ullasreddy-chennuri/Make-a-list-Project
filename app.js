
const express =  require('express');
const bodyParser = require('body-parser');
const date = require(__dirname + '/date.js');

const app = express();

let items = ["Enter ur goal/Task","Start Typing.."];

// function refresh(){
//     items = ["Enter ur goal/Task","Sample-1"];
// }

app.set('view engine', 'ejs');
app.use(bodyParser.urlencoded({extended:true}));
app.use(express.static("public"));


app.get('/',function(req,res){

    let day = date();
    res.render('list',{kindOfDay : day, newListItems : items });


})

app.post('/',function(req,res){
    let item = req.body.newItem;
    items.push(item);
    res.redirect('/');
})

app.get('/refresh',function(req,res){
    res.redirect('/');
});

app.post('/refresh',function(req,res){
    items = ["Start Typing.."];
    res.redirect('/');
})




app.listen(process.env.PORT || 3000 ,function(){
    console.log('Listening to the port 3000');
});

