import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import './TotiPacientiiPage.modules.css';
import './medic/MedicPage.modules.css';
import './medic/MedicPage.js';

const TotiPacientiiPage = () => {
  const { userId } = useParams();
  const navigate = useNavigate();
  
  const [showLogoutModal, setShowLogoutModal] = useState(false);
  const [pacienti, setPacienti] = useState([]);
  const [selectedPatient, setSelectedPatient] = useState(null);
  const [showModal, setShowModal] = useState(false);

  const handlePacientiClick = () => {
    navigate(`/medic/${userId}/toti-pacientii`);
  };

  const handleOpenLogoutModal = () => {
    setShowLogoutModal(true);
  };

  const handleCloseLogoutModal = () => {
    setShowLogoutModal(false);
    navigate('/login');
  };


  useEffect(() => {
    const fetchPacienti = async () => {
      try {
        const response = await fetch(`http://localhost:7146/api/medic/${userId}/toti-pacientii`);
        if (!response.ok) {
          throw new Error('Cererea către server nu a putut fi îndeplinită.');
        }
        const data = await response.json();
        setPacienti(data);
      } catch (error) {
        console.error('Eroare la obținerea listei de pacienți:', error);
      }
    };

    if (userId) {
      fetchPacienti();
    }
  }, [userId]);

  const openModal = (pacientId) => {
    const selectedPacient = pacienti.find((pacient) => pacient.pacientId === pacientId);
    setSelectedPatient(selectedPacient);
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
    setSelectedPatient(null);
  };

  const getDetaliiPacient = async (pacientId) => {
    try {
      const response = await fetch(`http://localhost:7146/api/pacienti/${pacientId}`);
      console.log("pac:", pacientId);
      if (!response.ok) {
        throw new Error('Cererea către server nu a putut fi îndeplinită.');
      }
      const data = await response.json();
      setSelectedPatient(data);

      navigate(`/medic/${userId}/toti-pacientii/${pacientId}/vezi-detalii`);
    } catch (error) {
      console.error('Eroare la obținerea detaliilor pacientului:', error);
    }
  };

  const getStatusPacient = async (pacientId) => {
    try {
      //const response = await fetch(`http://localhost:7146/api/status-dentar/add`);
      console.log("pac:", pacientId);

      navigate(`/medic/${userId}/toti-pacientii/${pacientId}/status-dentar`);
    } catch (error) {
      console.error('Eroare la obținerea detaliilor pacientului:', error);
    }
  };

  const getRadiografiiPacient = async (pacientId) => {
    try {
      //const response = await fetch(`http://localhost:7146/api/status-dentar/add`);
      console.log("pac:", pacientId);

      navigate(`/medic/${userId}/toti-pacientii/${pacientId}/radiografii`);
    } catch (error) {
      console.error('Eroare la obținerea radiografiilor pacientului:', error);
    }
  };

  return (
    <div className="medicPageContainer">
      <div className="container-head">
      </div>

      <ul className="button-list-med">
        <li className="button-item-med">
          <button className="blue-button-med" onClick={handlePacientiClick}>
            Pacienti
          </button>
        </li>
        <li className="button-item-med">
          <button className="blue-button-med">Consultatii</button>
        </li>
        <li className="button-item-med">
          <button className="blue-button-med" onClick={handleOpenLogoutModal}>Deconectare</button>
        </li>
      </ul>

      <div className="pacienti-table-container">
      <div className="scrollable-table">
        <table className="pacienti-table">
          <thead>
            <tr>
            <th className="text-stanga" style={{ width: '10%' }}>Nume</th>
            <th className="text-stanga" style={{ width: '10%' }}>Prenume</th>
            <th className="text-stanga" style={{ width: '30%' }}>Acțiuni</th>

            </tr>
          </thead>
          <tbody>
            {pacienti.map((pacient) => (
              <tr key={pacient.id}>
                <td>{pacient.nume}</td>
                <td>{pacient.prenume}</td>
                <td className="actiuni-coloana">
                  <button className="blue-button-pacienti" onClick={() => openModal(pacient.pacientId)}>Vezi detalii</button>
                  <button className="blue-button-pacienti" onClick={() => getStatusPacient(pacient.pacientId)}>Status dentar</button>
                  <button className="blue-button-pacienti" onClick={() => getRadiografiiPacient(pacient.pacientId)}>Radiografii</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        </div>
      </div>

      {showModal && selectedPatient && (
        <div className="modal-background">
          <div className="modal-content">
            <h2>Detalii Pacient</h2>
            <p>Nume: {selectedPatient.nume}</p>
            <p>Prenume: {selectedPatient.prenume}</p>
            {/* Alte detalii pe care vrei să le afișezi */}
            <button onClick={closeModal}>Închide</button>
          </div>
        </div>
      )}

{showLogoutModal && (
        <div className="logout-modal">
          <div className="logout-modal-content">
            <p>Te-ai deconectat cu succes.</p>
            <button onClick={handleCloseLogoutModal}>Închide</button>
          </div>
        </div>
      )}

      {/* Restul codului pentru MedicPage */}
    </div>
  );
  
};

export default TotiPacientiiPage;
