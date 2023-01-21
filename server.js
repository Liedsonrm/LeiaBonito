const express = require("express")
const puppeteer = require("puppeteer")
const ch = require("cheerio")
var url = "https://www.marxists.org/portugues/marx/1847/11/principios.htm#t1"

const app = express()

app.set('view engine', 'ejs')

app.use(express.static("public"))
app.use(express.json())

app.get("/", (req, res) => {
    res.render("pages/start")
})

app.get("/read", async (req, res) => {
    var url = req.query.url
    console.log(`IP: ${req.ip} Site: ${url}`)

    if(!url){
        return res.redirect("/")
    }
    try{
        puppeteer.launch().then((browser) => {return browser.newPage()}).then((page) => {
            
            return page.goto(url).then(() => {
                return page.content()
            })
        }).then(async (html) => {
            $ = ch.load(html)
    
            var html = await $("body").html()
            var h1 = await $("h1").html()
            // return res.send(html)
    
            return res.render("pages/index", {
                html: html,
                title: h1,
                link: url
            })
            
            
            $("h2").each((i, el) => {
                console.log($(el).text())
            })
            
        })
    } catch(err){
        console.log(err)
        return res.redirect("/")
    }
    


})









app.listen(5000, () => {console.log("Server running on port: 5000")})