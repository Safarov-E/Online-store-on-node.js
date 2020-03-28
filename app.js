let express = require('express');
let mysql = require('mysql');
let app = express();

app.use(express.static('public'));
app.set('view engine', 'pug');

app.use(express.json());

let con = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '',
    database: 'market'
})

app.listen(3000, function(){
    console.log('node express work on 3000');
});

app.get('/', function(req, res) {
    con.query(
        'SELECT * FROM goods',
        function(error, result) {
            if(error) throw error
            // console.log(result)
            let goods = {};
            for (let i = 0; i < result.length; i++) {
                goods[result[i]['id']] = result[i]
            }
            console.log(JSON.parse(JSON.stringify(goods)))
            res.render('main', {
                foo: 4,
                bar: 7,
                goods : JSON.parse(JSON.stringify(goods))
            })
        }
    );
})
app.get('/cat', function(req, res) {
    let catId = req.query.id;
    let cat = new Promise(function(resolve, reject) {
        con.query(
            'SELECT * FROM category where id = ' + catId,
            function(error, result) {
                if(error) reject(error)
                resolve(result)
            });
        })
    let goods = new Promise(function(resolve, reject) {
        con.query(
            'SELECT * FROM goods where category = ' + catId,
            function(error, result) {
                if(error) reject(error)
                resolve(result)
            });
        })
    Promise.all([cat, goods]).then(function(value) {
        console.log(value[0])
        res.render('cat', {
            cat: JSON.parse(JSON.stringify(value[0])),
            goods: JSON.parse(JSON.stringify(value[1]))
        })
    })
})
app.get('/goods', function(req, res) {
    con.query('SELECT * FROM goods WHERE id='+req.query.id, 
        function(error, result){
            if(error) throw error;
            res.render('goods', {goods: JSON.parse(JSON.stringify(result))})
        })
})

app.post('/get-category-list', function(req, res){
    con.query('SELECT id, category FROM category', 
        function(error, result){
            if(error) throw error;
            res.json(result)
        })
})

app.post('/get-goods-info', function (req, res) {
    console.log(req.body.key);
    if (req.body.key.length !=0){
      con.query('SELECT id,name,cost FROM goods WHERE id IN ('+req.body.key.join(',')+')', function (error, result, fields) {
        if (error) throw error;
        console.log(result);
        let goods = {};
        for (let i = 0; i < result.length; i++){
          goods[result[i]['id']] = result[i];
        }
        res.json(goods);
      });
    }
    else{
      res.send('0');
    }
  });