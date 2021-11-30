class Joueur {
  constructor(prenom, nom, age, rang, pays) {
    this.prenom = prenom;
    this.nom = nom;
    this.age = age;
    this.rang = rang;
    this.pays = pays;
  }

  getName() {
    return `${this.prenom} ${this.nom} (${this.pays})`;
  }
}

module.exports = Joueur;
