const express = require('express');
const puppeteer = require('puppeteer');
const app = express();
const { v4: uuidv4 } = require('uuid');
const http = require('http').createServer(app);
require('dotenv').config();
const path = require('path');
__dirname = path.resolve();

const io = require('socket.io')(http,{
    cors:{
        origin: "*",
        methods: ["GET","POST"]
    }
});


app.use(express.json());
app.use(express.static('public'));

app.post('/screenshot1', async (req, res) => {
    const {url} = req.body;

    try {
        const browser = await puppeteer.launch();
        const page = await browser.newPage();
        await page.goto(url); 
        const screenshot = await page.screenshot();
        await browser.close();

        res.writeHead(200, {
            'Content-Type': 'image/png',
            'Content-Length': screenshot.length
        });
        res.end(screenshot);
    } catch (error) {
        console.error('Error taking screenshot:', error);
        res.status(500).send('Internal Server Error');
    }
});

app.get('/',(req,res)=>{
    res.sendFile(path.join(__dirname+'/public/index.html'));
})

app.post('/createKey',(req,res)=>{
    const key = uuidv4();
    res.json({key: key});
})

app.get('/:id',(req,res)=>{
    io.on('connection',(socket)=>{
        console.log("New Connection " + socket.id);
    
        socket.on('mouse',(data,currentId)=>{
            console.log(currentId);
            io.sockets.emit('mouse',data,currentId);
        })
        socket.on('disconnect', function () {
            console.log('User disconnected');
        });
    })
    res.sendFile(path.join(__dirname+'/public/sketch.html'));
})



http.listen(process.env.PORT || 3000,()=>{
    console.log("Server is runnig ");
})

