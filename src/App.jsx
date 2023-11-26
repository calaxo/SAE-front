import React, { useState, useEffect } from 'react';
import axios from 'axios';
import '@styles/App.css';

import present from '@assets/present.png';
import absent from '@assets/absent.png';
import logo from '@assets/logo.png';

function App() {
  // State hooks
  const [enregistrements, setEnregistrements] = useState(null);
  const [etudiantInfos, setEtudiantInfos] = useState({});
  const [selectedEtudiant, setSelectedEtudiant] = useState(null);
  const [editableInfos, setEditableInfos] = useState({});

  useEffect(() => {
    // Fetching passage data
    const fetchData = () => {
    axios.get("http://saegeii.axel-cal.fr/api/get")
      .then(res => {
        // Organizing the data by student identifier
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
        // Handle errors
        console.error("Error fetching passage data:", error);
      });

    // Fetching student information
    axios.get("http://saegeii.axel-cal.fr/api/getinfos")
      .then(res => {
        // Organizing the student information by student identifier
        const infoByEtudiant = res.data.reduce((acc, info) => {
          acc[info.idEtudiant] = info;
          return acc;
        }, {});

        setEtudiantInfos(infoByEtudiant);

        // Initialization of editableInfos with existing data
        const initialEditableInfos = Object.keys(infoByEtudiant).reduce((acc, etudiant) => {
          acc[etudiant] = {
            prenom: infoByEtudiant[etudiant].prenom || '',
            nom: infoByEtudiant[etudiant].nom || '',
            classe: infoByEtudiant[etudiant].classe || '',
          };
          return acc;
        }, {});

        setEditableInfos(initialEditableInfos);
      })
      .catch(error => {
        // Handle errors
        console.error("Error fetching student information:", error);
      });

    };

    fetchData();

    const intervalId = setInterval(fetchData, 1200000);

    // Cleanup function to clear the interval when the component unmounts
    return () => clearInterval(intervalId);

  }, []);

  // Toggle show/hide all passages for a student
  const toggleShowAll = (etudiant) => {
    setSelectedEtudiant(selectedEtudiant === etudiant ? null : etudiant);
  };

  // Handle input change for editable information
  const handleInputChange = (e, etudiant) => {
    const { name, value } = e.target;
    setEditableInfos((prevInfos) => ({
      ...prevInfos,
      [etudiant]: { ...prevInfos[etudiant], [name]: value },
    }));
  };

  // Handle form submission
  const handleSubmit = (event, etudiant) => {
    event.preventDefault();

    axios.post('http://saegeii.axel-cal.fr/api/changeinfos', {
      idEtudiant: etudiant,
      prenom: editableInfos[etudiant]?.prenom,
      nom: editableInfos[etudiant]?.nom,
      classe: editableInfos[etudiant]?.classe,
    })
      .then(response => {
        // Handle server response if necessary
      })
      .catch(error => {
        // Handle request errors
        console.error("Error submitting form:", error);
      });
  };

  return (
    <div>
      <header className='header'>
      <img src={logo} className='logo' alt="logo" />
      <h1>Historique de passages des étudiants</h1>
      <p>Explorez les enregistrements des passages des étudiants</p>
    </header>

      <div className='main'>
        {enregistrements && Object.entries(enregistrements).map(([etudiant, passages]) => {
          const showAll = selectedEtudiant === etudiant;
          const lastPassage = showAll ? passages : [passages[passages.length - 1]];
          const totalPassages = passages.length;
          const showOk = totalPassages % 2 === 0;

          return (
            <div key={etudiant} className="etudiant-box">
              <h2 className="etudiant-title">Étudiant: {etudiant} 
              

              {showOk ? (
        <img src={present} className='imgpresence' alt="présent" />
      ) : (
        <img src={absent} className='imgpresence' alt="absent" />
      )}

              
              </h2>
              <div className="etudiant-info">
                {etudiantInfos[etudiant] && (
                  <p>
                    <div>Prénom : {etudiantInfos[etudiant].prenom}</div> <div>Nom : {etudiantInfos[etudiant].nom}</div><div> Classe : {etudiantInfos[etudiant].classe}</div>
                  </p>
                )}
              </div>

              {showAll && (
                <form onSubmit={(e) => handleSubmit(e, etudiant)} className="etudiant-changement">
                  <input
                    type='text'
                    placeholder='Prénom'
                    name='prenom'
                    value={editableInfos[etudiant]?.prenom || ''}
                    onChange={(e) => handleInputChange(e, etudiant)}
                  />
                  <input
                    type='text'
                    placeholder='Nom'
                    name='nom'
                    value={editableInfos[etudiant]?.nom || ''}
                    onChange={(e) => handleInputChange(e, etudiant)}
                  />
                  <input
                    type='text'
                    placeholder='Classe'
                    name='classe'
                    value={editableInfos[etudiant]?.classe || ''}
                    onChange={(e) => handleInputChange(e, etudiant)}
                  />
                  <input type="submit" />
                </form>
              )}

              <ul>
                {lastPassage.map((passage, index) => (
                  <li key={index} className="etudiant-record">
                    Date: {passage.date}, Heure: {passage.heure}
                  </li>
                ))}
              </ul>
              <button onClick={() => toggleShowAll(etudiant)}>
                {showAll ? 'Réduire' : 'Afficher tous/modifier'}
              </button>
            </div>
          );
        })}
      </div>

      <footer className='footer'>
      <p>Site pour la formation GEII dédié à la SAE <br></br> par CALENDREAU Axel, NIVEAU Clément, CREUZEAU Kevin, CARRIER Amaury, SOURIAU Thomas © 2023</p>
      </footer>
    </div>
  );
}

export default App;
