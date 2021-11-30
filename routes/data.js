const express = require("express");
const router = express.Router();

const gen = require("../Generateur");
const path = require('path');
const semGen = require('../semantiqueGenerateur')
/* GET parties listing. */
router.get("/", function (req, res, next) {
  let contype = req.headers['content-type'];
  console.log(contype);
  if (contype.includes('text/html')) {
    res.sendFile(path.join(__dirname, '../html/data.html'))
  }else if(contype.includes('rdf+xml')){
    console.log("rdffff");
  }
  else {
    res.send(400);
  }
});

router.get("/horaire", function (req, res, next) {
  let contype = req.headers['content-type'];
  console.log(contype);
  if (contype.includes('text/html')) {
    const tabName = ["id", "Joueur1", "Joueur2", "date", "heure", "lien"]
    let tabContent = []
    gen.liste_partie.forEach((m, index)=>{
      tabContent.push({"id" : index,
        "Joueur1": m.joueur1.prenom + " "+m.joueur1.nom,
        "Joueur2": m.joueur2.prenom + " "+m.joueur2.nom,
        "date": m.dateDebut,
        "heure": m.heure_debut,
        "lien": "http://localhost:3000/data/horaire/"+index})
    })
    const html = semGen.generateHTML("Horaires des matchs", "Tennis App", tabName, tabContent)
    res.send(html)
  }else if(contype.includes('rdf+xml')){
  }
  else {
    res.send(400);
  }
});



router.get("/horaire/:id", function (req, res, next) {
  let contype = req.headers['content-type'];
  console.log(contype);
  if (contype.includes('text/html')) {
    const tabName = ["id", "Joueur1", "Joueur2", "date", "heure"]
    let tabContent = []
    const m = gen.liste_partie[req.params.id]
    tabContent.push({"id" : req.params.id,
      "Joueur1": m.joueur1.prenom + " "+m.joueur1.nom,
      "Joueur2": m.joueur2.prenom + " "+m.joueur2.nom,
      "date": m.dateDebut,
      "heure": m.heure_debut})
    const html = semGen.generateHTML("Horaire d'un match", "Tennis App", tabName, tabContent)
    res.send(html)

  }else if(contype.includes('rdf+xml')){
  }
  else {
    res.send(400);
  }
});

router.get("/joueur", function (req, res, next) {
  let contype = req.headers['content-type'];
  if (contype.includes('text/html')) {
    const tabName = ["id", "nom", "prenom", "lien"]
    let tabContent = []
    gen.liste_joueur.forEach((j, index)=>{
      tabContent.push({"id" : index,
        "nom": j.nom,
        "prenom": j.prenom,
        "lien": "http://localhost:3000/data/joueur/"+index})
    })
    const html = semGen.generateHTML("Liste des joueurs", "Tennis App", tabName, tabContent)
    res.send(html)

  }else if(contype.includes('rdf+xml')){
  }
  else {
    res.send(400);
  }
});

router.get("/joueur/:id", function (req, res, next) {
  let contype = req.headers['content-type'];
  if (contype.includes('text/html')) {
    const tabName = ["id", "nom", "prenom", "age", "rang", "pays"]
    let tabContent = []

    tabContent.push({"id" : req.params.id,
      "nom": gen.liste_joueur[req.params.id].nom,
      "prenom": gen.liste_joueur[req.params.id].prenom,
      "age": gen.liste_joueur[req.params.id].age,
      "rang": gen.liste_joueur[req.params.id].rang,
      "pays": gen.liste_joueur[req.params.id].pays
    })

    const html = semGen.generateHTML("Liste des joueurs", "Tennis App", tabName, tabContent)
    res.send(html)
  }else if(contype.includes('rdf+xml')){
  }
  else {
    res.send(400);
  }
});

router.get("/resultat", function (req, res, next) {
  let contype = req.headers['content-type'];
  if (contype.includes('text/html')) {
    const tabName = ["id", "Joueur1", "Joueur2","Manche","Jeu","Vainqueur", "lien"]
    let tabContent = []
    gen.liste_partie.forEach((m, index)=>{
      let vainqueur = "unknown"
      console.log(m.pointage.final);
      if(m.pointage.final){
        const lengthJeu = m.pointage.jeu.length
        if(m.pointage.jeu[lengthJeu-1][0] > m.pointage.jeu[lengthJeu-1][1]){
          vainqueur = m.joueur1.prenom + " "+m.joueur1.nom
        }else{
          vainqueur = m.joueur2.prenom + " "+m.joueur2.nom
        }
      }
      tabContent.push({"id" : index,
        "Joueur1": m.joueur1.prenom + " "+m.joueur1.nom,
        "Joueur2": m.joueur2.prenom + " "+m.joueur2.nom,
        "Manche": m.pointage.manches,
        "Jeu": m.pointage.jeu.join(' | '),
        "Vainqueur":vainqueur,
        "lien": "http://localhost:3000/data/resultat/"+index})
    })
    const html = semGen.generateHTML("Resultats des matchs", "Tennis App", tabName, tabContent)
    res.send(html)
  }else if(contype.includes('rdf+xml')){
  }
  else {
    res.send(400);
  }
});

router.get("/resultat/:id", function (req, res, next) {
  let contype = req.headers['content-type'];
  if (contype.includes('text/html')) {
    const tabName = ["id", "Joueur1", "Joueur2","Manche","Jeu","Vainqueur"]
    let tabContent = []
    let vainqueur = "unknown"
    const m = gen.liste_partie
    const id = req.params.id

    if(m[id].pointage.final){
      const lengthJeu = m[id].pointage.jeu.length
      if(m[id].pointage.jeu[lengthJeu-1][0] > m[id].pointage.jeu[lengthJeu-1][1]){
        vainqueur = m[id].joueur1.prenom + " "+m[id].joueur1.nom
      }else{
        vainqueur = m[id].joueur2.prenom + " "+m[id].joueur2.nom
      }
    }
    tabContent.push({"id" : id,
      "Joueur1": m[id].joueur1.prenom + " "+m[id].joueur1.nom,
      "Joueur2": m[id].joueur2.prenom + " "+m[id].joueur2.nom,
      "Manche": m[id].pointage.manches,
      "Jeu": m[id].pointage.jeu.join(' | '),
      "Vainqueur":vainqueur})

    const html = semGen.generateHTML("Resultat d'un match", "Tennis App", tabName, tabContent)
    res.send(html)
  }else if(contype.includes('rdf+xml')){
  }
  else {
    res.send(400);
  }
});




module.exports = router;
