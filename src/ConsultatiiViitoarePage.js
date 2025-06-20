import './medic/MedicPage.modules.css';
import './RadiografiiPage.modules.css';
import './ConsultatiiViitoarePage.modules.css';
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Modal from 'react-modal';

const ConsultatiiViitoarePage = ({ onLogout }) => {
    const { userId } = useParams();
    const { pacientId } = useParams();
    const navigate = useNavigate();
    const [refreshList, setRefreshList] = useState(false);

    const [showLogoutModal, setShowLogoutModal] = useState(false);
    const [consultatiiViitoare, setConsultatiiViitoare] = useState([]);


    const handleOpenLogoutModal = () => {
        setShowLogoutModal(true);
    };
      
    const handleCloseLogoutModal = () => {
        setShowLogoutModal(false);
        navigate('/login'); // Redirect login
    };
      

    useEffect(() => {
        const fetchConsultatiiViitoare = async () => {
          try {
            const response = await fetch(`http://localhost:7146/api/consultatii/get-consultatii-viitoare/${pacientId}`);
            if (response.ok) {
              const consultatiiViitoareData = await response.json();
              setConsultatiiViitoare(consultatiiViitoareData);
            }
          } catch (error) {
            console.error('Eroare:', error);
          }
        };
      
        fetchConsultatiiViitoare();
      }, [pacientId]);
      
  

    const handlePacientiClick = async () => {
        try {
            
        } catch (error) {
            console.error('Eroare:', error);
        }
    };

    const handleAnulareProgramare = async (consultatieId) => {
        try {
          const response = await fetch(`http://localhost:7146/api/consultatii/${consultatieId}`, {
            method: 'DELETE',
            headers: {
              'Content-Type': 'application/json'
            }
          });
      
          if (response.ok) {
            console.log(`Consultatia cu ID-ul ${consultatieId} a fost anulată.`);
           
          } else {
            console.error('Eroare la anularea programării.');
          }
        } catch (error) {
          console.error('Eroare:', error);
        }
      };
      
    

    return (
        <div className="medicPageContainer">
            <div className="container-head">
                {/* Conținutul header-ului */}
            </div>

            <ul className="button-list-radio">
                <li className="button-item-radio">
                    <button className="blue-button-radio" >
                        Adaugă radiografie
                    </button>
                </li>
                <li className="button-item-radio">
                    <button className="blue-button-radio">Consultatii viitoare</button>
                </li>
                <li className="button-item-radio">
                    <button className="blue-button-radio">Istoric consultatii</button>
                </li>
                <li className= "button-item-radio">
                    <button className = "blue-button-radio" onClick={handleOpenLogoutModal}>Deconectare</button>
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

      {/* Container pentru carduri */}
      <div className="card-container">
        {consultatiiViitoare.map(consultatie => (
          <div key={consultatie.id} className="card">
            <div className="card-content">
              <p>Data programării: {consultatie.data}</p>
              <p>Ora: {consultatie.ora}</p>
              <p>Medic: {consultatie.medic}</p>
              <button className="blue-button-cs" onClick={() => handleAnulareProgramare(consultatie.consultatieId)}>Anulează programare</button>
            </div>
          </div>
        ))}
      </div>
    </div>
    );
};

export default ConsultatiiViitoarePage;
