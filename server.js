// Criando e configurando o servidor

const express = require('express')

const server = express()
const db = require("./db")


// Arquivos estáticos
server.use(express.static("public"))

// habilitar req.body
server.use(express.urlencoded({
    extended: true
}))

// configurar nunjucks
const nunjucks = require("nunjucks")
const {
    get
} = require('./db')

nunjucks.configure("views", {
    express: server,
    noCache: true, //boolean
})

//rota, pedido e resposta
server.get("/", function (req, res) {
    db.all(`SELECT * FROM ideas`, function (err, rows) {
        if (err) return console.log(err)
        const reversedIdeas = [...rows].reverse()

        let lastIdeas = []
        for (let idea of reversedIdeas) {
            if (lastIdeas.length < 2) {
                lastIdeas.push(idea)
            }
        }
        return res.render("index.html", {
            ideas: lastIdeas
        })
    })
})

server.get("/ideias", function (req, res) {
    db.all(`SELECT * FROM ideas`, function (err, rows) {
        if (err) {
            console.log(err)
            return res.send("Error DataBase")
        }

        const reversedIdeas = [...rows].reverse()

        return res.render("ideias.html", {
            ideas: reversedIdeas.reverse()
        })
    })
})


server.post("/", function (req, res) {
    //inserir dados na tabela
    const query = `
    INSERT INTO ideas(
        image,
        title,
        category,
        description,
        link
    ) VALUES (?,?,?,?,?)
    `

    const values = [
        req.body.image,
        req.body.title,
        req.body.category,
        req.body.description,
        req.body.link,
    ]

    db.run(query, values, function (err) {
        if (err) {
            console.log(err)
            return res.send("Error DataBase.")
        }
        return res.redirect("/ideias")
    })
})



//Porta

server.listen(3000)