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
    connectionLimit: 10
});

// ---USER ROUTES---

//GET ALL USERS
app.get('/api/utilisateurs', async(req, res) => {
    let conn;
    try{
        // console.log("requete get utilisateurs")
        conn = await pool.getConnection();
        const rows = await conn.query("SELECT * FROM utilisateurs");
        res.status(200).json(rows);
    }
    catch(err){
        // console.log("Erreur" + err);
    }

    //Relase the connection
    finally {
        if (conn) {
            conn.release();
        }
    }
});

//GET USER BY ID
app.get('/api/utilisateurs/:id', async(req, res) => {
    let conn;
    let id = req.params.id;
    try{
        // console.log("requete get utilisateurs/id")
        conn = await pool.getConnection();
        const rows = await conn.query("SELECT * FROM utilisateurs WHERE idU = ?", id);
        res.status(200).json(rows);
    }
    catch(err){
        // console.log("Erreur" + err);
    }

    //Relase the connection
    finally {
        if (conn) {
            conn.release();
        }
    }
});

//CREATE USER
app.post('/api/utilisateurs/create', async(req, res) => {
    let conn;
    bcrypt.hash(req.body.mdpU, 10)
        .then( async (hash) => {
            // console.log("requete post utilisateurs")
            conn = await pool.getConnection();
            const rows = await conn.query("INSERT INTO utilisateurs (nomU, prenomU, mailU, mdpU) VALUES (?, ?, ?, ?)", [req.body.nomU, req.body.prenomU, req.body.mailU, hash])
            // console.log(rows.affectedRows);
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
        // console.log("requete get utilisateurs/mail/mdp")
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
        // console.log("Erreur" + err);
    } 

    //Relase the connection
    finally {
        if (conn) {
            conn.release();
        }
    }
});

//UPDATE USER
app.put('/api/utilisateurs/update/:id', async(req, res) => {
    let conn;
    let id = req.params.id;
    try{
        // console.log("requete put utilisateurs/id")
        conn = await pool.getConnection();
        const rows = await conn.query("UPDATE utilisateurs SET nomU = ?, prenomU = ?, mailU = ?, mdpU = ? WHERE idU = ?", [req.body.nomU, req.body.prenomU, req.body.mailU, req.body.mdpU, id])
        // console.log(rows.affectedRows);
        res.status(200).json(rows.affectedRows);
    }
    catch(err){
        // console.log("Erreur" + err);
    }

    //Relase the connection
    finally {
        if (conn) {
            conn.release();
        }
    }
});

//DELETE USER
app.delete('/api/utilisateurs/delete/:id', async(req, res) => {
    let conn;
    let id = req.params.id;
    try{
        // console.log("requete delete utilisateurs/id")
        conn = await pool.getConnection();
        const rows = await conn.query("DELETE FROM utilisateurs WHERE idU = ?", id)
        // console.log(rows.affectedRows);
        res.status(200).json(rows.affectedRows);
    }
    catch(err){
        // console.log()
    } 

    //Relase the connection
    finally {
        if (conn) {
            conn.release();
        }
    }
});

// ---JEUX ROUTES---

//GET ALL JEUX
app.get('/api/jeux', async(req, res) => {
    let conn;
    try{
        // console.log("requete get jeux")
        conn = await pool.getConnection();
        const rows = await conn.query("SELECT * FROM jeux");
        res.status(200).json(rows);
    }
    catch(err){
        // console.log("Erreur" + err);
    }

    //Relase the connection
    finally {
        if (conn) {
            conn.release();
        }
    }
});

//GET JEUX BY ID
app.get('/api/jeux/:id', async(req, res) => {
    let conn;
    let id = req.params.id;
    try{
        // console.log("requete get jeux/id")
        conn = await pool.getConnection();
        const rows = await conn.query("SELECT * FROM jeux WHERE idJ = ?", id);
        res.status(200).json(rows);
    }
    catch(err){
        // console.log("Erreur" + err);
    }

    //Relase the connection
    finally {
        if (conn) {
            conn.release();
        }
    }
});

// GET JEUX BY BEST RATING
app.get('/api/bestgames', async(req, res) => {
    let conn;
    try{
        // console.log("requete get jeux/best")
        conn = await pool.getConnection();
        const rows = await conn.query('SELECT j.idJ FROM jeux j JOIN locations l ON j.idJ = l.idJ WHERE l.noteL IS NOT NULL GROUP BY j.idJ ORDER BY AVG(l.noteL) DESC LIMIT 9;');
        res.status(200).json(rows);
    }
    catch(err){
        // console.log("Erreur" + err);
    }
    //Relase the connection
    finally {
        if (conn) {
            conn.release();
        }
    }
});


//GET 6 MOST RECENT GAMES
app.get('/api/recent', async(req, res) => {
    let conn;
    try{
        // console.log("requete get jeux/recent")
        conn = await pool.getConnection();
        const rows = await conn.query("SELECT * FROM jeux ORDER BY anneeJ DESC LIMIT 9");
        res.status(200).json(rows);
    }
    catch(err){
        // console.log("Erreur" + err);
    }
    //Relase the connection
    finally {
        if (conn) {
            conn.release();
        }
    }
});

// SEARCH GAMES

app.get('/api/jeux/search/:search', async(req, res) => {
    let conn;
    let search = req.params.search;
    try{
        // console.log("requete get jeux/search")
        conn = await pool.getConnection();
        const rows = await conn.query("SELECT * FROM jeux WHERE titreJ LIKE ? OR descJ LIKE ? OR anneeJ LIKE ? OR editeurJ LIKE ? ORDER BY anneeJ DESC LIMIT 9", ["%"+search+"%", "%"+search+"%", "%"+search+"%", "%"+search+"%"]);
        res.status(200).json(rows);
    }
    catch(err){
        // console.log("Erreur" + err);
    }
    //Relase the connection
    finally {
        if (conn) {
            conn.release();
        }
    }
});



//CREATE JEUX
app.post('/api/jeux/create', async(req, res) => {
    let conn;
    try{
        // console.log("requete post jeux")
        conn = await pool.getConnection();
        const rows = await conn.query("INSERT INTO jeux (nomJ, descriptionJ, prixJ, imageJ) VALUES (?, ?, ?, ?)", [req.body.nomJ, req.body.descriptionJ, req.body.prixJ, req.body.imageJ])
        // console.log(rows.affectedRows);
        res.status(200).json(rows.affectedRows);
    }
    catch(err){
        // console.log("Erreur" + err);
    }

    //Relase the connection
    finally {
        if (conn) {
            conn.release();
        }
    }
});

//UPDATE JEUX
app.put('/api/jeux/update/:id', async(req, res) => {
    let conn;
    let id = req.params.id;
    try{
        // console.log("requete put jeux/id")
        conn = await pool.getConnection();
        const rows = await conn.query("UPDATE jeux SET nomJ = ?, descriptionJ = ?, prixJ = ?, imageJ = ? WHERE idJ = ?", [req.body.nomJ, req.body.descriptionJ, req.body.prixJ, req.body.imageJ, id])
        // console.log(rows.affectedRows);
        res.status(200).json(rows.affectedRows);
    }
    catch(err){
        // console.log("Erreur" + err);
    }

    //Relase the connection
    finally {
        if (conn) {
            conn.release();
        }
    }
});

//DELETE JEUX
app.delete('/api/jeux/delete/:id', async(req, res) => {
    let conn;
    let id = req.params.id;
    try{
        // console.log("requete delete jeux/id")
        conn = await pool.getConnection();
        const rows = await conn.query("DELETE FROM jeux WHERE idJ = ?", id)
        // console.log(rows.affectedRows);
        res.status(200).json(rows.affectedRows);
    }
    catch(err){
        // console.log("Erreur" + err);
    }

    //Relase the connection
    finally {
        if (conn) {
            conn.release();
        }
    }
});

// ---LOCATION ROUTES---

//GET ALL LOCATIONS
app.get('/api/locations', async(req, res) => {
    let conn;
    try{
        // console.log("requete get locations")
        conn = await pool.getConnection();
        const rows = await conn.query("SELECT * FROM locations");
        res.status(200).json(rows);
    }
    catch(err){
        // console.log("Erreur" + err);
    }

    //Relase the connection
    finally {
        if (conn) {
            conn.release();
        }
    }
});

//GET LOCATION BY ID
app.get('/api/locations/:id', async(req, res) => {
    let conn;
    let id = req.params.id;
    try{
        // console.log("requete get locations/id")
        conn = await pool.getConnection();
        const rows = await conn.query("SELECT * FROM locations WHERE idL = ?", id);
        res.status(200).json(rows);
    }
    catch(err){
        // console.log("Erreur" + err);
    }

     //Relase the connection
    finally {
        if (conn) {
            conn.release();
        }
    }
});

//GET LOCATION BY USER ID
app.get('/api/locations/user/:idU', async (req, res) => {
    let conn;
    try {
      conn = await pool.getConnection();
      const idU = req.params.idU;
      const query = `
        SELECT l.*, j.titreJ, j.editeurJ, j.anneeJ, j.descJ, j.prixJ
        FROM locations l
        JOIN jeux j ON l.idJ = j.idJ
        WHERE l.idU = ?
      `;
      const rows = await conn.query(query, [idU]);
      res.json(rows);
    } catch (error) {
      console.error(error);
      res.status(500).send('Server error');
    } finally {
      if (conn) conn.release();
    }
  });
  
// GET AVERAGE RATING OF A GAME
app.get('/api/locations/avg/:idJ', async(req, res) => {
    let conn;
    let idJ = req.params.idJ;
    try{
        // console.log("requete get locations/avg/idJ")
        conn = await pool.getConnection();
        const query = `
        SELECT AVG(noteL) AS avg
        FROM locations
        WHERE idJ = ?
        `;
    }
    catch(err){
        // console.log("Erreur" + err);
    }
    //Relase the connection
    finally {
        if (conn) {
            conn.release();
        }
    }
});

// GET BEST RATED GAMES


// GET 9 GAMES MOST RENTED
app.get('/api/mostrented', async(req, res) => {
    let conn;
    try{
        // console.log("requete get locations/mostrented")
        conn = await pool.getConnection();
        const rows = await conn.query("SELECT j.idJ FROM jeux j JOIN locations l ON j.idJ = l.idJ GROUP BY j.idJ ORDER BY COUNT(*) DESC LIMIT 9");
        let array = [];
        rows.forEach(element => {
            array.push(element.idJ);
        });
        res.status(200).json(array);
    }
    catch(err){
        // console.log("Erreur" + err);
    }
    //Relase the connection
    finally {
        if (conn) {
            conn.release();
        }
    }
});



//CREATE LOCATION
app.post('/api/locations/create', async(req, res) => {
    let conn;
    try{
        // console.log("requete post locations")
        conn = await pool.getConnection();
        const rows = await conn.query("INSERT INTO locations (empruntL, renduL, idU, idJ) VALUES (?, ?, ?, ?)", [req.body.empruntL, req.body.renduL, req.body.idU, req.body.idJ])
        // console.log(rows.affectedRows);
        res.status(200).json(rows.affectedRows);
    }
    catch(err){
        // console.log("Erreur" + err);
    }

    //Relase the connection
    finally {
        if (conn) {
            conn.release();
        }
    }
});

//UPDATE LOCATION
app.put('/api/locations/update/:id', async(req, res) => {
    let conn;
    let id = req.params.id;
    try{
        // console.log("requete put locations/id")
        conn = await pool.getConnection();
        const rows = await conn.query("UPDATE locations SET noteL = ?, commentL = ? WHERE idL = ?", [req.body.noteL, req.body.commentL, id])
        // console.log(rows.affectedRows);
        res.status(200).json(rows.affectedRows);
    }
    catch(err){
        // console.log("Erreur" + err);
    }

    //Relase the connection
    finally {
        if (conn) {
            conn.release();
        }
    }
});

//DELETE LOCATION
app.delete('/api/locations/delete/:id', async(req, res) => {
    let conn;
    let id = req.params.id;
    try{
        // console.log("requete delete locations/id")
        conn = await pool.getConnection();
        const rows = await conn.query("DELETE FROM locations WHERE idL = ?", id)
        // console.log(rows.affectedRows);
        res.status(200).json(rows.affectedRows);
    }
    catch(err){
        // console.log("Erreur" + err);
    }

    //Relase the connection
    finally {
        if (conn) {
            conn.release();
        }
    }
});

//GET ALL FEEBACKS BY GAME ID 
app.get('/api/feedbacks/:idJ', async (req, res) => {
    let conn;
    let idJ = req.params.idJ;
    try {
        console.log("requete get feedbacks/idJ")
        conn = await pool.getConnection();
        const rows = await conn.query("SELECT utilisateurs.nomU, utilisateurs.prenomU, locations.commentL, locations.noteL FROM locations JOIN utilisateurs ON locations.idU = utilisateurs.idU JOIN jeux ON locations.idJ = jeux.idJ WHERE locations.commentL IS NOT NULL AND jeux.idJ = ?;", idJ);
        res.status(200).json(rows);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server error');
    }
});

app.listen(3001, () => console.log('Server running on port 3001'));  // set the port to listen