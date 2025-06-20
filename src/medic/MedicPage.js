import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import './MedicPage.modules.css';

const MedicPage = () => {
  const { userId } = useParams();
  const navigate = useNavigate();
  const [showLogoutModal, setShowLogoutModal] = useState(false);

  const [showConsultatiiPopup, setShowConsultatiiPopup] = useState(false);
  const [selectedDate, setSelectedDate] = useState(new Date());

  const [consultatiiTable, setConsultatiiTable] = useState([]);

  const [showAddReportModal, setShowAddReportModal] = useState(false);
const [diagnostic, setDiagnostic] = useState('');
const [tratament, setTratament] = useState('');
const [recomandari, setRecomandari] = useState('');
const [simptome, setSimptome] = useState('');

  const [consultatieIdForReport, setConsultatieIdForReport] = useState(null);

  const [raportMedical, setRaportMedical] = useState(null);

  const [currentRaportMedical, setCurrentRaportMedical] = useState(null);
  const [showRaportModal, setShowRaportModal] = useState(false);


  const handleOpenRaportModal = async (consultatieId) => {
    await getRaportMedical(consultatieId);
    setCurrentRaportMedical(raportMedical);
    setShowRaportModal(true); // Deschide modalul pentru raport
  };

  const handleCloseRaportModal = () => {
    setCurrentRaportMedical(null);
    setShowRaportModal(false);
  };
  
  // Funcția pentru a obține raportul medical
  const getRaportMedical = async (consultatieId) => {
    try {
      const response = await fetch(`http://localhost:7146/api/raport/get-raport-medical?consultatieId=${consultatieId}`);
      if (response.ok) {
        const raport = await response.json();
        setRaportMedical(raport);
      }
    } catch (error) {
      console.error('Eroare:', error);
    }
  };


const handleOpenAddReportModal = (consultatieId) => {
  setConsultatieIdForReport(consultatieId); 
  setShowAddReportModal(true); 
};


const handleCloseAddReportModal = () => {
  setShowAddReportModal(false);
};

const handleDiagnosticChange = (event) => {
  setDiagnostic(event.target.value);
};

const handleTratamentChange = (event) => {
  setTratament(event.target.value);
};

const handleRecomandariChange = (event) => {
  setRecomandari(event.target.value);
};

const handleSimptomeChange = (event) => {
  setSimptome(event.target.value);
};

const handleAddReport = async (consultatieId) => {
  const reportData = {
    diagnostic,
    tratament,
    recomandari,
    simptome,
    consultatieId
  };

  try {
    const response = await fetch(`http://localhost:7146/api/raport/addRaport`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(reportData),
    });
    console.log("abc", reportData);

    if (response.ok) {
      console.log('Raport adăugat cu succes!');
      handleCloseAddReportModal(); 
    } else {
      console.error('Eroare la adăugarea raportului');
    }
  } catch (error) {
    console.error('Eroare:', error);
  }
};

  const handleConsultatiiViitoareClick = async () => {
    try {
      const response = await fetch(`http://localhost:7146/api/consultatii/get-consultatii-by-date/${userId}?selectedDate=${selectedDate.toISOString()}`);
      

      if (response.ok) {
        const consultatiiData = await response.json();
        setConsultatiiTable(consultatiiData);
        handleOpenConsultatiiPopup();
      }
    } catch (error) {
      console.error('Eroare:', error);
    }
  };

  const handleOpenConsultatiiPopup = () => {
    setShowConsultatiiPopup(true);
  };

  const handleCloseConsultatiiPopup = () => {
    setShowConsultatiiPopup(false);
  };

  const handleNextDate = () => {
    const nextDate = new Date(selectedDate);
    nextDate.setDate(selectedDate.getDate() + 1);
    setSelectedDate(nextDate);
    handleConsultatiiViitoareClick();
  };
  
  const handlePrevDate = () => {
    const prevDate = new Date(selectedDate);
    prevDate.setDate(selectedDate.getDate() - 1);
    setSelectedDate(prevDate);
    handleConsultatiiViitoareClick();
  };

  const handleOpenLogoutModal = () => {
    setShowLogoutModal(true);
  };

  const handleCloseLogoutModal = () => {
    setShowLogoutModal(false);
    navigate('/login'); 
  };

  const handlePacientiClick = () => {
    navigate(`/medic/${userId}/toti-pacientii`);
  };

  return (
    <div className="medicPageContainer">
      <div className="circle-container">
        <div className="blue-circle">
          <p className="circle-text">Textul tău aici</p>
        </div>
      </div>

      <div className="container-head">
        {/* Conținutul header-ului */}
      </div>

      <ul className="button-list-med">
        <li className="button-item-med">
          <button className="blue-button-med" onClick={handlePacientiClick}>
            Pacienti
          </button>
        </li>
        <li className="button-item-med">
          <button className="blue-button-med" onClick={handleConsultatiiViitoareClick}>Consultatii</button>
        </li>
        
        <li className="button-item-med">
          <button className="blue-button-med" onClick={handleOpenLogoutModal}>Deconectare</button>
        </li>
      </ul>

      {showLogoutModal && (
        <div className="logout-modal">
          <div className="logout-modal-content">
            <p>Te-ai deconectat cu succes.</p>
            <button onClick={handleCloseLogoutModal}>Închide</button>
          </div>
        </div>
      )}

      {showConsultatiiPopup && (
        <div className="modal">
          <div className="modal-content">
          <div className="date-picker">
            <button className="arrow-button" onClick={handlePrevDate}>◄</button>
            <p className="selected-date">{selectedDate.toDateString()}</p>
            <button className="arrow-button" onClick={handleNextDate}>►</button>
          </div>
            
            <div className="scrollable-table">
            <table className="pacienti-table">
  <thead>
    <tr>
      <th>Nume</th>
      <th>Prenume</th>
      <th>Descriere</th>
      <th>Ora Programării</th>
      <th>Acțiuni</th> 
    </tr>
  </thead>
  <tbody>
  {consultatiiTable.map(consultatie => {
    const currentDate = new Date();
    const todayDate = new Date(currentDate.getFullYear(), currentDate.getMonth(), currentDate.getDate());      
    const isConsultatieTrecuta = selectedDate < todayDate;
    console.log("id cons", consultatie.consultatieId);
    return (
      <tr key={consultatie.id}>
        <td>{consultatie.numePacient}</td>
        <td>{consultatie.prenumePacient}</td>
        <td>{consultatie.descriere}</td>
        <td>{consultatie.ora}</td>
        <td>
          {isConsultatieTrecuta ? (
            <button className="blue-button-med" onClick={() => handleOpenRaportModal(consultatie.consultatieId)}>
              Vezi raport
          </button>
          ) : (
            <button className="blue-button-med" onClick={() => handleOpenAddReportModal(consultatie.consultatieId)}>
              Adaugă raport
            </button>
          )}
        </td>
      </tr>
    );
  })}
</tbody>

</table>
            </div>
            </div>
            <button onClick={handleCloseConsultatiiPopup}>Închide</button>
          
        </div>
      )}

{showAddReportModal && (
  <div className="modal">
    <div className="modal-content">
      <h2>Adaugă raport</h2>
      <label>
        Diagnostic:
        <input value={diagnostic} onChange={handleDiagnosticChange} />
      </label>
      <label>
        Tratament:
        <input value={tratament} onChange={handleTratamentChange} />
      </label>
      <label>
        Recomandări:
        <input value={recomandari} onChange={handleRecomandariChange} />
      </label>
      <label>
        Simptome:
        <input value={simptome} onChange={handleSimptomeChange} />
      </label>
      <button onClick={() => handleAddReport(consultatieIdForReport)}>Salveaza raport</button>
      <button onClick={handleCloseAddReportModal}>Anulează</button>
    </div>
  </div>
)}


{showRaportModal && currentRaportMedical && (
  <div className="modal">
    <div className="modal-content">
      <h2>Raport medical</h2>
      <p>Diagnostic: {currentRaportMedical.diagnostic}</p>
      <p>Tratament: {currentRaportMedical.tratament}</p>
      <p>Recomandări: {currentRaportMedical.recomandari}</p>
      <p>Simptome: {currentRaportMedical.simptome}</p>
      <button onClick={handleCloseRaportModal}>Închide</button>
    </div>
  </div>
)}

    </div>
  );
};

export default MedicPage;
