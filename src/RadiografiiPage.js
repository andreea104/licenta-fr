import './medic/MedicPage.modules.css';
import './RadiografiiPage.modules.css';
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Modal from 'react-modal';

const AdminPage = ({ onLogout }) => {
    const { userId } = useParams();
    const { pacientId } = useParams();
    const navigate = useNavigate();
    const [selectedImage, setSelectedImage] = useState(null);
    const [modalIsOpen, setModalIsOpen] = useState(false);

    const [dataEfecturarii, setDataEfecturarii] = useState('');
    const [interpretare, setInterpretare] = useState('');

    const [radiografii, setRadiografii] = useState([]); 

    const [selectedRadiografie, setSelectedRadiografie] = useState(null);
    const [showLogoutModal, setShowLogoutModal] = useState(false);

    const handleOpenLogoutModal = () => {
        setShowLogoutModal(true);
      };
      
      const handleCloseLogoutModal = () => {
        setShowLogoutModal(false);
        navigate('/login'); 
      };
      

  const handleViewRadiografie = (radiografie) => {
    setSelectedRadiografie(radiografie);
  };

  const handleCloseRadiografie = () => {
    setSelectedRadiografie(null);
  };

  useEffect(() => {
    
    const fetchRadiografii = async () => {
      try {
        const response = await fetch(`http://localhost:7146/api/radiografie/get-radiografii/${pacientId}`);
        if (response.ok) {
          const radiografiiData = await response.json();
          setRadiografii(radiografiiData);
        }
      } catch (error) {
        console.error('Eroare:', error);
      }
    };

    fetchRadiografii();
  }, [pacientId]); 


const handleImageChange = (event) => {
    const file = event.target.files[0];
    const reader = new FileReader();
    reader.onload = (event) => {
        setSelectedImage(event.target.result);
    };
    reader.readAsDataURL(file);
};

const handleDataEfecturariiChange = (event) => {
    setDataEfecturarii(event.target.value);
};

const handleInterpretareChange = (event) => {
    setInterpretare(event.target.value);
};

    const handleOpenModal = () => {
        setModalIsOpen(true);
    };

    const handleCloseModal = () => {
        setModalIsOpen(false);
    };

    const handlePacientiClick = async () => {
        try {
            const radiografieDto = {
                isDeleted: false,
                dataEfecturarii: dataEfecturarii,
                interpretare: interpretare,
                pacientId: pacientId,
                imagine: 'string'
            };

            const response = await fetch('http://localhost:7146/api/radiografie/add', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(radiografieDto)
            });

            console.log("json:", radiografieDto);

            if (response.ok) {
                console.log('Radiografie adăugată cu succes:', radiografieDto);
                handleCloseModal(); // Închide pop-up-ul după adăugarea radiografiei
            } else {
                console.error('Eroare la adăugarea radiografiei');
            }
        } catch (error) {
            console.error('Eroare:', error);
        }
    };

    const convertImageToByteArray = async (imageDataUrl) => {
        return new Promise((resolve, reject) => {
            const byteString = atob(imageDataUrl.split(',')[1]);
            const byteArray = new Uint8Array(byteString.length);
    
            for (let i = 0; i < byteString.length; i++) {
                byteArray[i] = byteString.charCodeAt(i);
            }
    
            resolve(Array.from(byteArray));
        });
    };
    

    return (
        <div className="medicPageContainer">
            <div className="container-head">
                {/* Conținutul header-ului */}
            </div>

            {/* Lista de butoane */}
            <ul className="button-list-radio">
                <li className="button-item-radio">
                    <button className="blue-button-radio" onClick={handleOpenModal}>
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

      {/* Afișare carduri pentru radiografii */}
            <div className="card-container">
            {radiografii.map(radiografie => (
                <div key={radiografie.radiografieId} className="card">
                <div className="card-content">
                    <p>Data efectuării: {radiografie.dataEfecturarii}</p>
                    <p>Interpretare: {radiografie.interpretare}</p>
                    <button className="blue-button" onClick={() => handleViewRadiografie(radiografie)}>Vezi radiografie</button>
                    {/* ... și alte detalii */}
                </div>
                </div>
            ))}
            </div>


            {/* Pop-up (Modal) pentru adăugarea radiografiei */}
            <Modal
                isOpen={modalIsOpen}
                onRequestClose={handleCloseModal}
                contentLabel="Adaugă radiografie"
            >
                <h2>Adaugă radiografie</h2>
                <input type="file" accept="image/*" />
                <label>
                Data efectuării:
                <input
                    type="date"
                    value={dataEfecturarii}
                    onChange={handleDataEfecturariiChange}
                />
            </label>

            <label>
                Interpretare:
                <textarea
                    value={interpretare}
                    onChange={handleInterpretareChange}
                />
            </label>
                <button onClick={handlePacientiClick}>Adaugă</button>
                <button onClick={handleCloseModal}>Anulează</button>
            </Modal>

           
            {selectedRadiografie && (
  <div className="modal">
    <div className="modal-content">
      <img className="modal-image" src={selectedRadiografie} alt="Radiografie" />
      <button onClick={handleCloseRadiografie}>Închide</button>
    </div>
  </div>
)}
    
        </div>
    );
};

export default AdminPage;
