const app = require("./app");
class Pointage {
  constructor(parent) {
    this.manches = [0, 0];
    this.jeu = [[0, 0]];
    this.echange = [0, 0];
    this.final = false;
    this.winnerIndex = null;
    this.parent = parent;
  }

  getScore() {
    const mancheCourante = this.jeu.length - 1;
    return (
      "Sets : " +
      this.manches[0] +
      "-" +
      this.manches[1] +
      "/ Jeux : " +
      this.jeu[mancheCourante][0] +
      "-" +
      this.jeu[mancheCourante][1] +
      "/ Echange : " +
      this.getTennisRepresentation(this.echange[0]) +
      "-" +
      this.getTennisRepresentation(this.echange[1])
    );
  }

  getTennisRepresentation(score) {
    switch (score) {
      case 0:
        return 0;
      case 1:
        return 15;
      case 2:
        return 30;
      case 3:
        return 40;
      default:
        return -1;
    }
  }

  getSetsString() {
    return `${this.manches[0]}-${this.manches[1]}`;
  }

  ajouterPoint(joueur) {
    const mancheCourante = this.manches.reduce((a, b) => a + b, 0);
    // incrementer l'echange
    this.echange[joueur] += 1;

    // si requis, incrementer le jeu
    if (this.echange[joueur] === 4) {
      this.echange = [0, 0];
      this.jeu[mancheCourante][joueur] += 1;
      this.parent.changerServeur();
    }

    // si requis, incrementer la manche
    if (this.jeu[mancheCourante][joueur] === 6) {
      this.manches[joueur] += 1;
      this.parent.nouvelleManche(joueur + 1);
      if (this.manches[joueur] < 2) {
        this.jeu.push([0, 0]);
      }
    }
    app.notifySockets("score", {
      p1: this.parent.joueur1,
      p2: this.parent.joueur2,
      sets: this.manches,
      games: this.jeu,
      currentGame: this.echange,
    });
    // si le match est termine, le dire
    if (this.manches[joueur] === 2) {
      this.winnerIndex = joueur + 1;
      this.parent.closeBets();
      this.final = true;
    }
  }

  toJSON() {
    return {
      manches: this.manches,
      jeu: this.jeu,
      echange: this.echange,
      final: this.final,
    };
  }
}

module.exports = Pointage;
