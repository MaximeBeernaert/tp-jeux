const express = require('express');
const app = express();
const mariadb = require('mariadb');
const cors = require('cors');
const bcrypt = require('bcrypt');
require ('dotenv').config();

app.use(express.json());
app.use(cors());

// Pool connexion
const pool = mariadb.createPool({
    host: process.env.DB_HOST,
    database: process.env.DB_DTB,
    user: process.env.DB_USER,
    password: process.env.DB_PWD,
    connectionLimit: 100
});

// ---USER ROUTES---

//GET ALL USERS
app.get('/api/utilisateurs', async(req, res) => {
    let conn;
    try{
        console.log("requete get utilisateurs")
        conn = await pool.getConnection();
        const rows = await conn.query("SELECT * FROM utilisateurs");
        res.status(200).json(rows);
    }
    catch(err){
        console.log("Erreur" + err);
    }
});

//GET USER BY ID
app.get('/api/utilisateurs/:id', async(req, res) => {
    let conn;
    let id = req.params.id;
    try{
        console.log("requete get utilisateurs/id")
        conn = await pool.getConnection();
        const rows = await conn.query("SELECT * FROM utilisateurs WHERE idU = ?", id);
        res.status(200).json(rows);
    }
    catch(err){
        console.log("Erreur" + err);
    }
});

//CREATE USER
app.post('/api/utilisateurs/create', async(req, res) => {
    let conn;
    bcrypt.hash(req.body.mdpU, 10)
        .then( async (hash) => {
            console.log("requete post utilisateurs")
            conn = await pool.getConnection();
            const rows = await conn.query("INSERT INTO utilisateurs (nomU, prenomU, mailU, mdpU) VALUES (?, ?, ?, ?)", [req.body.nomU, req.body.prenomU, req.body.mailU, hash])
            console.log(rows.affectedRows);
            res.status(200).json(rows.affectedRows);
        }
        ).catch(error => res.status(500).json({error}));
});

//USER CONNECTION
app.get('/api/utilisateurs/connexion/:mail/:mdp', async(req, res) => {
    let conn;
    let mail = req.params.mail;
    let mdp = req.params.mdp;
    try{
        console.log("requete get utilisateurs/mail/mdp")
        conn = await pool.getConnection();
        const rows = await conn.query("SELECT * FROM utilisateurs WHERE mailU = ?", mail);
        if(rows.length > 0){
            bcrypt.compare(mdp, rows[0].mdpU)
            .then(valid => {
                if(!valid){
                    return res.status(401).json({error: 'Mot de passe incorrect !'});
                }
                res.status(200).json({
                    user: rows[0]
                });
            })
            .catch(error => res.status(500).json({error}));
        }else{
            res.status(404).json({message: "Invalid mail"});
        }
    }
    catch(err){
        console.log("Erreur" + err);
    } 
});

//UPDATE USER
app.put('/api/utilisateurs/update/:id', async(req, res) => {
    let conn;
    let id = req.params.id;
    try{
        console.log("requete put utilisateurs/id")
        conn = await pool.getConnection();
        const rows = await conn.query("UPDATE utilisateurs SET nomU = ?, prenomU = ?, mailU = ?, mdpU = ? WHERE idU = ?", [req.body.nomU, req.body.prenomU, req.body.mailU, req.body.mdpU, id])
        console.log(rows.affectedRows);
        res.status(200).json(rows.affectedRows);
    }
    catch(err){
        console.log("Erreur" + err);
    }
});

//DELETE USER
app.delete('/api/utilisateurs/delete/:id', async(req, res) => {
    let conn;
    let id = req.params.id;
    try{
        console.log("requete delete utilisateurs/id")
        conn = await pool.getConnection();
        const rows = await conn.query("DELETE FROM utilisateurs WHERE idU = ?", id)
        console.log(rows.affectedRows);
        res.status(200).json(rows.affectedRows);
    }
    catch(err){
        console.log()
    }
});

// ---JEUX ROUTES---

//GET ALL JEUX
app.get('/api/jeux', async(req, res) => {
    let conn;
    try{
        console.log("requete get jeux")
        conn = await pool.getConnection();
        const rows = await conn.query("SELECT * FROM jeux");
        res.status(200).json(rows);
    }
    catch(err){
        console.log("Erreur" + err);
    }
});

//GET JEUX BY ID
app.get('/api/jeux/:id', async(req, res) => {
    let conn;
    let id = req.params.id;
    try{
        console.log("requete get jeux/id")
        conn = await pool.getConnection();
        const rows = await conn.query("SELECT * FROM jeux WHERE idJ = ?", id);
        res.status(200).json(rows);
    }
    catch(err){
        console.log("Erreur" + err);
    }
});

//CREATE JEUX
app.post('/api/jeux/create', async(req, res) => {
    let conn;
    try{
        console.log("requete post jeux")
        conn = await pool.getConnection();
        const rows = await conn.query("INSERT INTO jeux (nomJ, descriptionJ, prixJ, imageJ) VALUES (?, ?, ?, ?)", [req.body.nomJ, req.body.descriptionJ, req.body.prixJ, req.body.imageJ])
        console.log(rows.affectedRows);
        res.status(200).json(rows.affectedRows);
    }
    catch(err){
        console.log("Erreur" + err);
    }
});

//UPDATE JEUX
app.put('/api/jeux/update/:id', async(req, res) => {
    let conn;
    let id = req.params.id;
    try{
        console.log("requete put jeux/id")
        conn = await pool.getConnection();
        const rows = await conn.query("UPDATE jeux SET nomJ = ?, descriptionJ = ?, prixJ = ?, imageJ = ? WHERE idJ = ?", [req.body.nomJ, req.body.descriptionJ, req.body.prixJ, req.body.imageJ, id])
        console.log(rows.affectedRows);
        res.status(200).json(rows.affectedRows);
    }
    catch(err){
        console.log("Erreur" + err);
    }
});

//DELETE JEUX
app.delete('/api/jeux/delete/:id', async(req, res) => {
    let conn;
    let id = req.params.id;
    try{
        console.log("requete delete jeux/id")
        conn = await pool.getConnection();
        const rows = await conn.query("DELETE FROM jeux WHERE idJ = ?", id)
        console.log(rows.affectedRows);
        res.status(200).json(rows.affectedRows);
    }
    catch(err){
        console.log("Erreur" + err);
    }
});

// ---LOCATION ROUTES---

//GET ALL LOCATIONS
app.get('/api/locations', async(req, res) => {
    let conn;
    try{
        console.log("requete get locations")
        conn = await pool.getConnection();
        const rows = await conn.query("SELECT * FROM locations");
        res.status(200).json(rows);
    }
    catch(err){
        console.log("Erreur" + err);
    }
});

//GET LOCATION BY ID
app.get('/api/locations/:id', async(req, res) => {
    let conn;
    let id = req.params.id;
    try{
        console.log("requete get locations/id")
        conn = await pool.getConnection();
        const rows = await conn.query("SELECT * FROM locations WHERE idL = ?", id);
        res.status(200).json(rows);
    }
    catch(err){
        console.log("Erreur" + err);
    }
});

//CREATE LOCATION
app.post('/api/locations/create', async(req, res) => {
    let conn;
    try{
        console.log("requete post locations")
        conn = await pool.getConnection();
        const rows = await conn.query("INSERT INTO locations (dateDebutL, dateFinL, idU, idJ) VALUES (?, ?, ?, ?)", [req.body.dateDebutL, req.body.dateFinL, req.body.idU, req.body.idJ])
        console.log(rows.affectedRows);
        res.status(200).json(rows.affectedRows);
    }
    catch(err){
        console.log("Erreur" + err);
    }
});

//UPDATE LOCATION
app.put('/api/locations/update/:id', async(req, res) => {
    let conn;
    let id = req.params.id;
    try{
        console.log("requete put locations/id")
        conn = await pool.getConnection();
        const rows = await conn.query("UPDATE locations SET dateDebutL = ?, dateFinL = ?, idU = ?, idJ = ? WHERE idL = ?", [req.body.dateDebutL, req.body.dateFinL, req.body.idU, req.body.idJ, id])
        console.log(rows.affectedRows);
        res.status(200).json(rows.affectedRows);
    }
    catch(err){
        console.log("Erreur" + err);
    }
});

//DELETE LOCATION
app.delete('/api/locations/delete/:id', async(req, res) => {
    let conn;
    let id = req.params.id;
    try{
        console.log("requete delete locations/id")
        conn = await pool.getConnection();
        const rows = await conn.query("DELETE FROM locations WHERE idL = ?", id)
        console.log(rows.affectedRows);
        res.status(200).json(rows.affectedRows);
    }
    catch(err){
        console.log("Erreur" + err);
    }
});


app.listen(3001, () => console.log('Server running on port 3001'));  // set the port to listen