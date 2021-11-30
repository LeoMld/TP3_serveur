
const generateur = require("./Generateur")

function getIndex (name, json) {
  for (let i = 0; i < json.length; ++i) {
    if ((json[i].prenom + " " +json[i].nom) === name) {
      return i;
    }
  }
  return -1;
}

const gen = {
  generateHTML : (title, header, tabName, tabContent)=>{
    let tab = "<table><tr>"
    tabName.forEach((t)=>{
      tab += "<th>"+t+"</th>"
    })
    tab += "</tr>"
    tabContent.forEach((e)=>{
      tab+="<tr>"
      tabName.forEach((name)=>{
        if (name === "lien"){
          tab+="<td><a href="+e[name]+">lien</a></td>"
        }else if (name.includes("Joueur")) {
          const id = getIndex(e[name], generateur.liste_joueur)
          tab += "<td><a href=http://localhost:3000/data/joueur/"+id+">" + e[name] + "</a></td>"
        } else {
          tab += "<td>" + e[name] + "</td>"
        }
      })
      tab+="</tr>"
    })
    tab+="</table>"

    const base = '<!DOCTYPE html>'
      + '<html><head><meta charset="utf-8" /><title>' + header + '</title></head><header><h1>'+title+'</h1></header><body>' + tab + '</body></html>';

    return base
  }
}

module.exports = gen