const Partie = require("./Partie");
const Joueur = require("./Joueur");

const modificateurVitesse = 100;
const listePartie = [];
const listJoueur = [];

listJoueur.push(new Joueur("Albert", "Ramos", 28, 56, "Espagne"))
listJoueur.push(new Joueur("Milos", "Raonic", 28, 16, "Canada"))
listJoueur.push(new Joueur("Andy", "Murray", 28, 132, "Angleterre"))
listJoueur.push(new Joueur("Andy", "Roddick", 36, 1000, "États-Unis"))
listJoueur.push(new Joueur("Roger", "Federer", 40, 2, "Suisse"))
listJoueur.push(new Joueur("Rafael", "Nadal", 36, 3, "Espagne"))

listePartie.push(
  new Partie(
    listePartie.length,
    listJoueur[0],
    listJoueur[1],
    "1",
    "Hale",
    "28/10/2021",
    "12h30",
    0
  )
);
listePartie.push(
  new Partie(
    listePartie.length,
    listJoueur[2],
    listJoueur[3],
    "2",
    "Hale",
    "29/10/2021",
    "14h00",
    30
  )
);
listePartie.push(
  new Partie(
    listePartie.length,
    listJoueur[4],
    listJoueur[5],
    "3",
    "Hale",
    "30/10/2021",
    "16h30",
    60
  )
);

const demarrer = function () {
  let tick = 0;
  setInterval(function () {
    for (const partie in listePartie) {
      if (listePartie[partie].tick_debut === tick) {
        demarrerPartie(listePartie[partie]);
      }
    }

    tick += 1;
  }, Math.floor(1000 / modificateurVitesse));
};

function demarrerPartie(partie) {
  const timer = setInterval(function () {
    partie.jouerTour();
    if (partie.estTerminee()) {
      clearInterval(timer);
      console.log("Partie terminée");
    }
  }, Math.floor(1000 / modificateurVitesse));
}

module.exports = {};
module.exports.demarrer = demarrer;
module.exports.liste_partie = listePartie;
module.exports.liste_joueur = listJoueur;
