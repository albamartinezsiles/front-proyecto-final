import { useState } from 'react';

function EnviarTarea() {
  const [textoTarea, setTextoTarea] = useState('');
  const [estado, setEstado] = useState('');
  const [nuevaTarea, setNuevaTarea] = useState([]);

  const enviarTarea = async () => {
    await fetch('http://localhost:3000/crear-tarea', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ 
        textoTarea : textoTarea, 
        estado : estado})
    })
    .then(respuesta => respuesta.json())
    .then(({id}) => {
        if(id){
        setNuevaTarea([...nuevaTarea, {id, textoTarea, estado}])
        setTextoTarea('')
        setEstado('pendiente')
        console.log('Tarea enviada')
        }
    })
  };
}
export default EnviarTarea;