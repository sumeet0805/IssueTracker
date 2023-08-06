const express=require('express');
const bodyParser = require('body-parser');
const port=9000;
const path=require('path');
const { title } = require('process');
const app=express();
const db=require('./config/mongoose')
const Project=require('./models/project')
const issues=require('./models/issue')
app.set('view engine','ejs')
app.set('views',path.join(__dirname,'views'))
app.use(express.urlencoded());
app.use(express.static('assets'))
app.get('/',function(req,res){

    Project.find().then((result)=>{
        res.render('home',{
            title:'Issue Tracker Mechanism',
            project_list:result
        });
    }).catch((err)=>{
        console.log(err)
    })
});

app.post('/createProject',function(req,res){
    console.log(req.body)
    const { pname, pdescription, pauthor } =req.body;
    Project.create({
        name:pname,
        description:pdescription,
        author:pauthor
    }).then((result) => {
        return res.redirect('/');
      })
      .catch((err) => {
        console.log(err)
        res.send({ kq: 0, msg: 'kết nối DB thất bại' })
      })
})

app.listen(port,function(err){
    if(err){
        console.log('error inside the code',err);
    }

    console.log('Server is running smoothly on port,',port);
})

app.get('/delete-project/:name',function(req,res){
    let name=req.params.name;
    Project.deleteOne({name:name}).then((result)=>{
        return res.redirect('/');
    }).catch((err)=>{
        console.log(err);
    })
})

app.get('/issues',function(req,res){
    let project=req.params.project;
   
    issues.find({}).then((result1)=>{
        Project.find({}).then((result2)=>{
            res.render('issues',{
                title:'Issue Tracker Mechanism',
                issue_list:result1,
                Project_list:result2,
            });
        }).catch((err)=>{
            console.log(err)
        })
    }).catch((err)=>{
        console.log(err)
    })
    
   
})

app.post('/createIssue',function(req,res){
    console.log(req.body)
    const { ptitle, pdescription, pauthor,project } =req.body;
    
    issues.create({
        title:ptitle,
        description:pdescription,
        author:pauthor,
        project:project
    }).then((result) => {
        issues.find({}).then((result1)=>{
            Project.find({}).then((result2)=>{
                return res.render('issues',{
                    title:'Issue Tracker Mechanism',
                    issue_list:result1,
                    Project_list:result2,
                });
            }).catch((err)=>{
                console.log(err)
            })
        }).catch((err)=>{
            console.log(err)
        })
      })
      .catch((err) => {
        console.log(err)
        return res.send({ kq: 0, msg: 'kết nối DB thất bại' })
      })
})

app.post('/issues/filter',async (req, res)=>{
    const { title, author, description, projectName } = req.body;
    const query = {};
    if (title) query.title = new RegExp(title, 'i'); // Using regular expression to perform case-insensitive search
    if (author) query.author = new RegExp(author, 'i');
    if (description) query.description = new RegExp(description, 'i');
    if (projectName) query.projectName = new RegExp(projectName, 'i');
    await issues.find(query).then((result1)=>{
        Project.find({}).then((result2)=>{
            res.render('issues',{
                title:'Issue Tracker Mechanism',
                issue_list:result1,
                Project_list:result2,
            });
        }).catch((err)=>{
            console.log(err)
        })
    }).catch((err)=>{
        console.log(err)
    })
})

app.get('/delete-issues/:name',function(req,res){
    let name=req.params.name;
    issues.deleteOne({title:name}).then((result)=>{
        issues.find({}).then((result1)=>{
            Project.find({}).then((result2)=>{
                res.render('issues',{
                    title:'Issue Tracker Mechanism',
                    issue_list:result1,
                    Project_list:result2,
                });
            }).catch((err)=>{
                console.log(err)
            })
        }).catch((err)=>{
            console.log(err)
        })
    }).catch((err)=>{
        console.log(err);
    })
})
