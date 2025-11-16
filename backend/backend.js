const express = require('express')
const mysql = require('mysql')
const cors = require('cors')
const { todo } = require('node:test')
const app = express()
const port = 3000

app.use(cors())
app.use(express.json())
app.use("/kepek",express.static("kepek"))
app.use("/kepek2",express.static("kepek2"))
const pool = mysql.createPool({
        host: 'localhost',
        user: 'root',
        password: '',
        database: 'jatek2025'
        })

app.get('/', (req, res) => {
  res.send('Hello World!')
})


//Aniko-------------------------------------------------
app.delete('/jatekTorles/:jatek_id', (req, res) => {
        const {jatek_id} =req.params
        const sql=`delete from jatek where jatek_id=?`
        pool.query(sql,[jatek_id], (err, result) => {
        if (err) {
            console.log(err)
            return res.status(500).json({error:"Hiba"})
        }
       
        return res.status(200).json({message:"Sikeres törlés"})
        })
})




//Nandi-----------------------------------------------

app.get('/alma', (req, res) => {
  res.send('Hello World1!')
})

app.get('/h2', (req, res) => {
  res.send('Hello World2g!')
})



app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})