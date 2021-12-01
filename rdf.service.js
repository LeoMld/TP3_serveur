const xml = require("xml");
const gen = require("./Generateur");

const getPlayerData = (id) => {
  const { nom, prenom, age, rang, pays } = gen.liste_joueur[id];
  const data = {
    "rdf:Description": [
      { _attr: { "rdf:about": `/data/joueur/${id}` } },
      { "joueur:id": id },
      { "joueur:nom": nom },
      { "joueur:prenom": prenom },
      { "joueur:age": age },
      { "joueur:rang": rang },
      { "joueur:pays": pays },
    ],
  };
  return data;
};

const getPlayerRepresentation = (id) => {
  return xml(
    {
      "rdf:RDF": [
        getPlayerData(id),
        {
          _attr: {
            "xmlns:rdf": "http://www.w3.org/1999/02/22-rdf-syntax-ns#",
            "xmlns:joueur": "/data/joueur/#",
          },
        },
      ],
    },
    { declaration: true }
  );
};

const getPlayersData = () => {
  const data = [];
  gen.liste_joueur.map((_, i) => {
    data.push(getPlayerData(i));
  });
  return { "rdf:Description": data };
};

const getPlayersRepresentation = () => {
  return xml(
    {
      "rdf:RDF": [
        getPlayersData(),
        {
          _attr: {
            "xmlns:rdf": "http://www.w3.org/1999/02/22-rdf-syntax-ns#",
            "xmlns:joueur": "/data/joueur/#",
          },
        },
      ],
    },
    { declaration: true }
  );
};

const getResultsData = () => {
  const tabContent = [];
  gen.liste_partie.forEach((_, index) => {
    tabContent.push(getResultData(index));
  });
  return { "rdf:Description": tabContent };
};

const getResultData = (id) => {
  const { pointage, joueur1, joueur2 } = gen.liste_partie[id];
  let vainqueur = "unknown";
  if (pointage.final) {
    const gameLength = pointage.jeu.length;
    if (pointage.jeu[gameLength - 1][0] > pointage.jeu[gameLength - 1][1]) {
      vainqueur = joueur1.prenom + " " + joueur1.nom;
    } else {
      vainqueur = joueur2.prenom + " " + joueur2.nom;
    }
  }
  return {
    "rdf:Description": [
      { _attr: { "rdf:about": `/data/resultat/${id}` } },
      { "resultat:idMatch": id },
      {
        "resultat:joueur1": [
          joueur1.prenom + " " + joueur1.nom,
          { _attr: { "rdf:about": `/data/joueur/${joueur1.id}` } },
        ],
      },
      {
        "resultat:joueur2": [
          joueur2.prenom + " " + joueur2.nom,
          { _attr: { "rdf:about": `/data/joueur/${joueur2.id}` } },
        ],
      },
      { "resultat:manches": pointage.manches.join("-") },
      { "resultat:jeu": pointage.jeu.join(" | ") },
      { "resultat:vainqueur": vainqueur },
    ],
  };
};

const getResultRepresentation = (id) => {
  return xml(
    {
      "rdf:RDF": [
        getResultData(id),
        {
          _attr: {
            "xmlns:rdf": "http://www.w3.org/1999/02/22-rdf-syntax-ns#",
            "xmlns:resultat": "/data/resultat/#",
          },
        },
      ],
    },
    { declaration: true }
  );
};

const getResultsRepresentation = () => {
  return xml(
    {
      "rdf:RDF": [
        getResultsData(),
        {
          _attr: {
            "xmlns:rdf": "http://www.w3.org/1999/02/22-rdf-syntax-ns#",
            "xmlns:resultat": "/data/resultat/#",
          },
        },
      ],
    },
    { declaration: true }
  );
};

const getScheduleData = (id) => {
  const { joueur1, joueur2, dateDebut, heure_debut } = gen.liste_partie[id];
  return {
    "rdf:Description": [
      { "horaire:idMatch": id },
      {
        "horaire:joueur1": [
          joueur1.prenom + " " + joueur1.nom,
          { _attr: { "rdf:about": `/data/joueur/${joueur1.id}` } },
        ],
      },
      {
        "horaire:joueur2": [
          joueur2.prenom + " " + joueur2.nom,
          { _attr: { "rdf:about": `/data/joueur/${joueur2.id}` } },
        ],
      },
      { "horaire:date": dateDebut },
      { "horaire:heure": heure_debut },
    ],
  };
};

const getSchedulesData = () => {
  const tabContent = [];
  gen.liste_partie.forEach((_, index) => {
    tabContent.push(getScheduleData(index));
  });
  return { "rdf:Description": tabContent };
};

const getScheduleRepresentation = (id) => {
  return xml(
    {
      "rdf:RDF": [
        getScheduleData(id),
        {
          _attr: {
            "xmlns:rdf": "http://www.w3.org/1999/02/22-rdf-syntax-ns#",
            "xmlns:horaire": "/data/horaire/#",
          },
        },
      ],
    },
    { declaration: true }
  );
};

const getSchedulesRepresentation = () => {
  return xml(
    {
      "rdf:RDF": [
        getSchedulesData(),
        {
          _attr: {
            "xmlns:rdf": "http://www.w3.org/1999/02/22-rdf-syntax-ns#",
            "xmlns:horaire": "/data/horaire/#",
          },
        },
      ],
    },
    { declaration: true }
  );
};

const getDataRepresentation = () => {
  return xml(
    {
      "rdf:RDF": [
        getResultsData(),
        getSchedulesData(),
        getPlayersData(),
        {
          _attr: {
            "xmlns:rdf": "http://www.w3.org/1999/02/22-rdf-syntax-ns#",
            "xmlns:horaire": "/data/horaire/#",
            "xmlns:resultat": "/data/resultat/#",
            "xmlns:joueur": "/data/joueur/#",
          },
        },
      ],
    },
    { declaration: true }
  );
};

module.exports.getPlayerRepresentation = getPlayerRepresentation;
module.exports.getPlayersRepresentation = getPlayersRepresentation;
module.exports.getResultsRepresentation = getResultsRepresentation;
module.exports.getResultRepresentation = getResultRepresentation;
module.exports.getScheduleRepresentation = getScheduleRepresentation;
module.exports.getSchedulesRepresentation = getSchedulesRepresentation;
module.exports.getDataRepresentation = getDataRepresentation;
