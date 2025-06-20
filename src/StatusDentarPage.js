import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import './StatusDentarPage.modules.css';
import './medic/MedicPage.modules.css';

const StatusDentarPage = ({ onLogout }) => {
  const { pacientId } = useParams();
  const { userId } = useParams();
  const [numarDinte, setNumarDinte] = useState('');
  const navigate = useNavigate();
  const [isPopupOpen, setIsPopupOpen] = useState(false);
  const [istoric, setIstoric] = useState('');
  const [statusCurent, setStatusCurent] = useState('');
  const [statusDentarId, setStatusDentarId] = useState(null);

  const handlePacientiClick = () => {
    navigate(`/medic/${userId}/toti-pacientii`);
  };

  const handleNumarDinteChange = (event) => {
    setNumarDinte(event.target.value);
  };

  const handleCautaClick = async () => {
    try {
      const response = await fetch(
        `http://localhost:7146/api/status-dentar/nr-dinte/${pacientId}?nrDinte=${numarDinte}`
      );
  
      /*if (!response.ok) {
        throw new Error('Cererea către server nu a putut fi îndeplinită.');
      }*/
  
      const data = await response.json();
      if (data.istoric || data.statusCurent) {
        setIstoric(data.istoric || '');
        setStatusCurent(data.statusCurent || '');
        setStatusDentarId(data.statusDentarId);
      } else {
        setStatusDentarId(null);
        setIstoric(''); // Setează istoricul ca șir vid
        setStatusCurent(''); // Setează statusul curent ca șir vid
      }
  
      setIsPopupOpen(true); 
    } catch (error) {
      console.error('Eroare la obținerea informațiilor despre dinte:', error);
    }
  };

  const handleSaveClick = async () => {
    try {
      const url = `http://localhost:7146/api/status-dentar/add-update`
  
      const response = await fetch(url, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          nrDinte: numarDinte,
          istoric: istoric,
          statusCurent: statusCurent,
          statusDentarId: statusDentarId || '00000000-0000-0000-0000-000000000000',
        }),
      });
  
      if (!response.ok) {
        throw new Error('Cererea către server nu a putut fi îndeplinită.');
      }
  
      setIsPopupOpen(false);
    } catch (error) {
      console.error('Eroare la actualizarea informațiilor despre dinte:', error);
    }
  };
  

  return (
    <div className="medicPageContainer">
      <div className="container-head"></div>
      <div className="bckg-status"></div>
      <ul className="button-list">
        <li className="button-item">
          <button className="blue-button" onClick={handlePacientiClick}>
            Pacienti
          </button>
        </li>
        <li className="button-item">
          <button className="blue-button">Buton 2</button>
        </li>
        <li className="button-item">
          <button className="blue-button">Buton 3</button>
        </li>
      </ul>

      {/* Secțiunea de căutare */}
      <div className="search-section-container">
        <input
          className="search-input"
          type="text"
          id="numarDinte"
          value={numarDinte}
          onChange={handleNumarDinteChange}
          placeholder="Introduceți numărul dintelui"
        />
        <button className="search-button" onClick={handleCautaClick}>
          Caută
        </button>
      </div>

      {/* Modal */}
      {isPopupOpen && (
        <div className="popup">
          <button className="popup-close-button" onClick={() => setIsPopupOpen(false)}>
            X
          </button>
          <div className="popup-content">
          <p>Informații despre dinte:</p>
      <p>Număr dinte: {numarDinte}</p>
      
        <>
          <p>Istoric:</p>
          <textarea
            name="istoric"
            value={istoric}
            onChange={(e) => setIstoric(e.target.value)}
          />
          <p>Status curent:</p>
          <input
            type="text"
            name="statusCurent"
            value={statusCurent}
            onChange={(e) => setStatusCurent(e.target.value)}
          />
        </>
    
            <button className="save-button" onClick={handleSaveClick}>
              Salvează
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default StatusDentarPage;
