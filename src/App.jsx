import React, { useState, useEffect } from 'react';
import axios from 'axios';
import '@styles/App.css';
function App() {
  const [enregistrements, setEnregistrements] = useState(null);

  useEffect(() => {
    axios.get("http://saegeii.axel-cal.fr/api/get")
      .then(res => {
        // Organiser les données par identifiant d'étudiant
        const dataByEtudiant = res.data.reduce((acc, passage) => {
          const { fkidEtudiant, date, heure } = passage;
          if (!acc[fkidEtudiant]) {
            acc[fkidEtudiant] = [];
          }
          acc[fkidEtudiant].push({ date, heure });
          return acc;
        }, {});

        setEnregistrements(dataByEtudiant);
      })
      .catch(error => {
        console.error("Une erreur s'est produite lors de la récupération des données :", error);
      });
  }, []);

  return (
    <div>
      <header className='header'>
        <p>Historique de passages des etudiants</p>
      </header>

    <div className='main'>
    {enregistrements && Object.entries(enregistrements).map(([etudiant, passages]) => (
  <div key={etudiant} className="etudiant-box">
    <h2 className="etudiant-title">Étudiant: {etudiant}</h2>
    <ul>
      {passages.map((passage, index) => (
        <li key={index} className="etudiant-record">
          Date: {passage.date}, Heure: {passage.heure}
        </li>
      ))}
    </ul>
  </div>
))}

              </div>

      <footer className='footer'>
        <p>Site pour la formation GEII dédié à la SAE par CALENDREAU Axel, NIVEAU Clément, CREUZEAU Kevin, CARRIER Amaury, SOURIAU Thomas © 2023</p>
      </footer>
    </div>
  );
}

export default App;
