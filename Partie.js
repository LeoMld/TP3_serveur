const Pointage = require("./Pointage.js");
const app = require("./app");

class Partie {
  constructor(
    id,
    joueur1,
    joueur2,
    terrain,
    tournoi,
    dateDebut,
    heureDebut,
    tickDebut
  ) {
    this.id = id;
    this.joueur1 = joueur1;
    this.joueur2 = joueur2;
    this.terrain = terrain;
    this.tournoi = tournoi;
    this.dateDebut = dateDebut;
    this.heure_debut = heureDebut;
    this.pointage = new Pointage(this);
    this.temps_partie = 0;
    this.joueur_au_service = Math.floor(Math.random() * 2);
    this.vitesse_dernier_service = 0;
    this.nombre_coup_dernier_echange = 0;
    this.contestation = [3, 3];
    this.tick_debut = tickDebut;
    this.bets = [];
    this.baseBetP1 = Math.floor(Math.random() * 300);
    this.baseBetP2 = Math.floor(Math.random() * 300);
  }

  jouerTour() {
    let contestationReussi = false;
    if (Math.random() * 100 < 3) {
      // 3% de contestation
      const contestant = Math.floor(Math.random() * 2);
      const player = contestant === 0 ? this.joueur1 : this.joueur2;
      if (!Partie.contester()) {
        this.contestation[contestant] = Math.max(
          0,
          this.contestation[contestant] - 1
        );
        app.notifySockets("contestation", {
          matchId: this.id,
          contestant: player.getName(),
          win: false,
        });
        console.log("contestation echouee");
      } else {
        contestationReussi = true;
        app.notifySockets("contestation", {
          matchId: this.id,
          contestant: player.getName(),
          win: true,
        });
        console.log("contestation reussie");
      }
    }

    if (!contestationReussi) {
      this.pointage.ajouterPoint(Math.floor(Math.random() * 2));
    }
    this.temps_partie += Math.floor(Math.random() * 60); // entre 0 et 60 secondes entre chaque point
    this.vitesse_dernier_service =
      Math.floor(Math.random() * (250 - 60 + 1)) + 60; // entre 60 et 250 km/h
    this.nombre_coup_dernier_echange =
      Math.floor(Math.random() * (30 - 1 + 1)) + 1; // entre 1 et 30 coups par échange
  }

  static contester() {
    return Math.random() * 100 > 25; // 75% de chance que la contestation passe
  }

  changerServeur() {
    this.joueur_au_service = (this.joueur_au_service + 1) % 2;
  }

  nouvelleManche(winnerIndex) {
    this.contestation = [3, 3];
    const winner = winnerIndex === 1 ? this.joueur1 : this.joueur2;
    const loser = winnerIndex === 1 ? this.joueur2 : this.joueur1;
    app.notifySockets("setEnded", {
      matchId: this.id,
      winner: winner.getName(),
      loser: loser.getName(),
      sets: this.pointage.getSetsString(),
    });
  }

  estTerminee() {
    if (this.pointage.final) {
      const winner =
        this.pointage.winnerIndex === 1 ? this.joueur1 : this.joueur2;
      const loser =
        this.pointage.winnerIndex === 1 ? this.joueur2 : this.joueur1;
      app.notifySockets("matchFinished", {
        matchId: this.id,
        winner: winner.getName(),
        loser: loser.getName(),
      });
    }
    return this.pointage.final;
  }

  closeBets() {
    this.bets.forEach((bet) => {
      bet.status = "ended";
      if (bet.playerIndex === this.pointage.winnerIndex) {
        if (bet.playerIndex === 1) {
          bet.win = true;
          bet.amountWon = (bet.amount * bet.odds.odd1).toFixed(2);
          app.notifyUser(bet.userId, "bets", {
            matchId: this.id,
            win: true,
            amount: (bet.amount * bet.odds.odd1).toFixed(2),
          });
        } else if (bet.playerIndex === 2) {
          bet.win = true;
          bet.amountWon = (bet.amount * bet.odds.odd2).toFixed(2);
          app.notifyUser(bet.userId, "bets", {
            win: false,
            matchId: this.id,
            amount: (bet.amount * bet.odds.odd2).toFixed(2),
          });
        }
      } else {
        bet.win = false;
        app.notifyUser(bet.userId, "bets", {
          matchId: this.id,
          win: false,
          amount: bet.amount,
        });
      }
    });
  }

  parier(userId, amount, playerIndex) {
    const playerBet = playerIndex === 1 ? this.joueur1 : this.joueur2;
    const otherPlayer = playerIndex === 1 ? this.joueur2 : this.joueur1;
    const bet = {
      matchId: this.id,
      userId,
      amount,
      playerBet: playerBet.getName(),
      otherPlayer: otherPlayer.getName(),
      playerIndex,
      odds: this.getOdds(),
      status: "pending",
    };
    this.bets.push(bet);
    const users = app.getUsers();
    users.forEach((user) => {
      if (user.userId === userId) {
        user.bets.push(bet);
        return bet;
      }
    });
    return bet;
  }

  getOdds() {
    const percentage = 0.95;
    let amountP1 = this.baseBetP1;
    let amountP2 = this.baseBetP2;
    this.bets.forEach((bet) => {
      if (bet.playerIndex === 1) {
        amountP1 += bet.amount;
      } else if (bet.playerIndex === 2) {
        amountP2 += bet.amount;
      }
    });
    if (amountP1 === 0 && amountP2 === 0) {
      return {
        odd1: (2 * percentage).toFixed(2),
        odd2: (2 * percentage).toFixed(2),
      };
    }
    if (amountP1 === 0 || amountP2 === 0) {
      return {
        odd1: (1 * percentage).toFixed(2),
        odd2: (1 * percentage).toFixed(2),
      };
    }
    return {
      odd1: (((amountP1 + amountP2) / amountP1) * percentage).toFixed(2),
      odd2: (((amountP1 + amountP2) / amountP2) * percentage).toFixed(2),
    };
  }

  toJSON() {
    return {
      odds: this.getOdds(),
      joueur1: this.joueur1,
      joueur2: this.joueur2,
      terrain: this.terrain,
      tournoi: this.tournoi,
      heure_debut: this.heure_debut,
      date_debut: this.dateDebut,
      pointage: this.pointage,
      temps_partie: this.temps_partie,
      serveur: this.joueur_au_service,
      vitesse_dernier_service: this.vitesse_dernier_service,
      nombre_coup_dernier_echange: this.nombre_coup_dernier_echange,
      contestation: this.contestation,
    };
  }
}
module.exports = Partie;
