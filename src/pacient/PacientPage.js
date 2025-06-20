import React, { useState } from 'react';
import {useParams} from 'react-router-dom';
import './../medic/MedicPage.modules.css';
import './PacientPage.modules.css'
import { useNavigate } from 'react-router-dom';


const AdminPage = ({ onLogout }) => {
  const navigate = useNavigate();

  const { pacientId } = useParams();
  const [showOptions, setShowOptions] = useState(false);
  const [selectedOption, setSelectedOption] = useState('');

  const [showAddConsultationModal, setShowAddConsultationModal] = useState(false);
  const [descriere, setDescriere] = useState('');
  const [selectedDate, setSelectedDate] = useState('');
  const [availableDoctors, setAvailableDoctors] = useState([]);

  const [showDoctorDetailsModal, setShowDoctorDetailsModal] = useState(false);
  const [selectedDoctor, setSelectedDoctor] = useState(null);

  const [selectedHours, setSelectedHours] = useState({});


  const [appointmentSuccess, setAppointmentSuccess] = useState(false);

  const handleAppointment = async (doctor) => {
    const selectedHourForDoctor = selectedHours[doctor.medicId];
    
    if (selectedHourForDoctor !== undefined) {
      const selectedDateTime = new Date(selectedDate);
      selectedDateTime.setHours(selectedHourForDoctor + 3);
      selectedDateTime.setMinutes(0);
      selectedDateTime.setSeconds(0);
      const dateTimeString = selectedDateTime.toISOString();
      
      console.log("data:", dateTimeString);

      try {
        const response = await fetch('http://localhost:7146/api/consultatii/addConsultatie', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            medicId: doctor.medicId,
            pacientId: pacientId,
            data: dateTimeString,
            descriere: descriere
          })
        });
    
        if (response.ok) {
          setAppointmentSuccess(true);
          setShowAddConsultationModal(false); 
          setShowDoctorDetailsModal(false);

          console.log('JSON trimis către backend:', JSON.stringify({
            pacientId: pacientId,
            appointmentDetails: dateTimeString
          }));
          
          const rasp = await fetch('http://localhost:7146/api/auth/send-confirmation', {
          method: 'POST',
          headers: {
          'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            pacientId: pacientId,
            appointmentDetails: dateTimeString  
          })
        });

        } else {
          console.error('Eroare la adăugarea consultatiei');
        }
      } catch (error) {
        console.error('Eroare:', error);
      }
    } else {
      console.error('Selectează o oră pentru programare.');
    }
  };
  
  const handleHourSelection = (medicId, hour) => {
    setSelectedHours(prevSelectedHours => ({
      ...prevSelectedHours,
      [medicId]: hour 
    }));
  };

  const handleOptionChange = (option) => {
    setSelectedOption(option);
    setShowOptions(false);
  
    if (option === 'adauga') {
      setShowAddConsultationModal(true);
    } else if (option === 'modifica') {
      navigate(`/pacient/${pacientId}/consultatii-viitoare`);
    } else if (option === 'istoric') {
      navigate(`/pacient/${pacientId}/istoric-consultatii`);
    }
  };

  const handleSearch = async () => {
    try {
      const response = await fetch(`http://localhost:7146/api/medic/medici-disponibili?selectedDate=${selectedDate}`);
      
      if (response.ok) {
        const data = await response.json();
        setAvailableDoctors(data);
        setSelectedDoctor(data[0]);
        setShowAddConsultationModal(false);
        openDoctorDetailsModal(data[0]);
      } else {
        console.error('Eroare la preluarea datelor');
      }
    } catch (error) {
      console.error('Eroare:', error);
    }
  };
  
  const openModal = (pacientId) => {
    setShowAddConsultationModal(true);
  };

  const closeModal = () => {
    setShowAddConsultationModal(false);
    setDescriere('');
    setSelectedDate('');
  };

  const openDoctorDetailsModal = (doctor) => {
    setSelectedDoctor(doctor);
    setShowDoctorDetailsModal(true);
  };

  const closeDoctorDetailsModal = () => {
    setSelectedDoctor(null);
    setShowDoctorDetailsModal(false);
  };

  return (
    <div className="medicPageContainer">
      <div className="circle-container">
        <div className="blue-circle"> 
          <p className="circle-text">Textul tău aici</p>
        </div>
      </div>
  
      <div className="container-head">
      </div>
  
      <ul className="button-list">
        <li className="button-item">
          <button
            className="blue-button"
            onClick={() => setShowOptions(!showOptions)}
          >
            Programari
          </button>
          {showOptions && (
            <div className="options-popup">
              <button className="blue-button" onClick={() => handleOptionChange('adauga')}>Adauga</button>
              <button className="blue-button" onClick={() => handleOptionChange('modifica')}>Programari viitoare</button>
              <button className="blue-button" onClick={() => handleOptionChange('istoric')}>Istoric</button>
            </div>
          )}
        </li>
        <li className="button-item">
          <button className="blue-button">Dosar medical</button>
        </li>
        <li className="button-item">
          <button className="blue-button">Buton 3</button>
        </li>
      </ul>
  
      {showAddConsultationModal && (
        <div className="add-consultation-modal">
          <p>Adaugă consultatie:</p>
          <input
            type="text"
            placeholder="Descriere"
            value={descriere}
            onChange={(e) => setDescriere(e.target.value)}
          />
          <input
            type="date"
            value={selectedDate}
            onChange={(e) => setSelectedDate(e.target.value)}
          />
          <button onClick={handleSearch}>Caută</button>
          <button onClick={closeModal}>Închide</button>
        </div>
      )}

      {appointmentSuccess && (
        <div className="add-consultation-modal">
          <p>Programare efectuată cu succes!</p>
          <button onClick={() => setAppointmentSuccess(false)}>Închide</button>
        </div>
      )}

{showDoctorDetailsModal && (
  <div className="overlay">
    <div className="doctor-details-modal">
      <h2>Medici disponibili</h2>
      {availableDoctors.map(doctor => (
  <div key={doctor.medicId} className="doctor-info">
    <p>{doctor.nume} {doctor.prenume}</p>
    <p>Ore disponibile:</p>
    <ul>
      {doctor.availableHours.map(hour => (
        <li key={hour}>
          <label>
            <input
              type="radio"
              name={`hour_${doctor.medicId}`}
              value={hour}
              checked={selectedHours[doctor.medicId] === hour}
              onChange={() => handleHourSelection(doctor.medicId, hour)}
            />
            {`${hour}:00`}
          </label>
        </li>
      ))}
    </ul>
    <button onClick={() => handleAppointment(doctor)}>Programează</button>
  </div>
))}
      <button onClick={closeDoctorDetailsModal}>Închide</button>
    </div>
  </div>
)}      
    </div>
  );
};

export default AdminPage;
