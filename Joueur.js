class Joueur {
  constructor(id, prenom, nom, age, rang, pays) {
    this.id = id;
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
