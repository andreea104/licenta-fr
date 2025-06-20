import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';

const VeziDetaliiPacientPage = () => {
  const { pacientId } = useParams();
  const [pacient, setPacient] = useState(null);

  useEffect(() => {
    const fetchPacient = async () => {
      try {
        const response = await fetch(`http://localhost:7146/api/pacienti/${pacientId}`);
        if (!response.ok) {
          throw new Error('Cererea către server nu a putut fi îndeplinită.');
        }
        const data = await response.json();
        setPacient(data);
      } catch (error) {
        console.error('Eroare la obținerea detaliilor pacientului:', error);
      }
    };

    fetchPacient();
  }, [pacientId]);

  if (!pacient) {
    return <div>Loading...</div>; 
  }

  return (
    <div>
      <h2>Detalii pacient</h2>
      <div>
        <p>Nume: {pacient.nume}</p>
        <p>Prenume: {pacient.prenume}</p>
        <p>Nr. Telefon: {pacient.nrTelefon}</p>
        <p>Adresa: {pacient.adresa}</p>
        <p>Data Nasterii: {new Date(pacient.dataNasterii).toLocaleDateString()}</p>
        <p>Alergii: {pacient.alergii}</p>
        <p>Tratamente: {pacient.tratamente}</p>
        <p>Probleme Medicale: {pacient.problemeMedicale}</p>
        <p>Fumator: {pacient.fumator ? 'Da' : 'Nu'}</p>
      </div>
    </div>
  );
};

export default VeziDetaliiPacientPage;
