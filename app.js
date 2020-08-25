
const express =  require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const _ = require('lodash');


const date = require(__dirname + '/date.js');

const app = express();

// let items = ["Enter ur goal/Task","Start Typing.."];


app.set('view engine', 'ejs');


app.use(bodyParser.urlencoded({extended:true}));
app.use(express.static("public"));

mongoose.connect('mongodb://localhost:27017/todolistDB', {useNewUrlParser: true, useUnifiedTopology: true });


const itemsSchema = {
    name:String
};

const Item = mongoose.model("Item",itemsSchema);

const item1 = new Item({
    name : "List your Goals/Items."
});

const item2 = new Item({
    name : "Start Typing.."
});

const defaultItems = [item1,item2];


const listSchema ={
    name: String,
    items: [itemsSchema]
};

const List = mongoose.model("List",listSchema);



app.get('/',function(req,res){
    let day = date();


    Item.find({},function(err,foundItems){

        if(foundItems.length === 0){
            Item.insertMany(defaultItems,function(err){
            if(err){
                console.log(err);
            }else{
                console.log("Successfully saved the item into DB ");
            }
        });
            res.redirect("/");
        } else {
            res.render('list',{kindOfDay : "Today", newListItems : foundItems });
        } 
    });
});

app.get('/:customListName',function(req,res){
    const customListName = _.capitalize(req.params.customListName);
    
    List.findOne({name:customListName},function(err,foundList){
        if(!err){
            if(!foundList){
                // Create New list
                const list = new List({
                    name: customListName,
                    items: defaultItems
                });
            
                list.save();
                res.redirect('/'+customListName);
            }else{
                //show existing list

                res.render("List",{kindOfDay : foundList.name, newListItems : foundList.items })

            }
        }
    });
    

});







app.post('/',function(req,res){

    const itemName = req.body.newItem;
    const listName = req.body.list;

    const item=new Item({
        name : itemName
    });

    if(listName === "Today"){
        item.save();
        res.redirect("/");
    }else{
        List.findOne({name : listName}, function(err,foundList){
            foundList.items.push(item);
            foundList.save();
            res.redirect('/'+ listName);
        });
    }

});


app.post('/delete', function(req,res){
    const checkedItemId = req.body.checkbox;
    const listName = req.body.listName;

    if(listName === "Today") {
        Item.findByIdAndRemove(checkedItemId, function(err){
            if(!err){
                console.log("succesfully deleted");
                res.redirect("/");
            }
        });
    } else{
        List.findOneAndUpdate({ name: listName }, {$pull: {items: { _id: checkedItemId }}}, function(err,foundList){
            if(!err){
                res.redirect('/'+ listName);
            }
        });
    }


   
});








// app.get('/refresh',function(req,res){
//     res.redirect('/');
// });

// app.post('/refresh',function(req,res){
//     items = ["Start Typing.."];
//     res.redirect('/');
// });




app.listen(process.env.PORT || 3000 ,function(){
    console.log('Listening to the port 3000');
});

