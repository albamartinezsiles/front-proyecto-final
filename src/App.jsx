import { useState,useEffect } from 'react'
//import reactLogo from './assets/react.svg'
//import viteLogo from '/vite.svg'
import './estilos.css'


//quiero que cree una tarea y que la mande al back. Luego veo como la pinto
function App() {

  const [textoTarea, setTextoTarea] = useState('')
  const [estado, setEstado] = useState('');
  const [nuevaTarea, setNuevaTarea] = useState([]);
  const [tareas, setTareas] = useState([]);
  const [terminada, setTerminada] = useState(false);

  const [editando, setEditando] = useState(false);
  const [tareaEditada, setTareaEditada] = useState(null);
  const [textoEditado, setTextoEditado] = useState('');


  useEffect(() => {
    if (editando) {
      return; 
    }
  
    fetch('https://api-proyecto-final.onrender.com/tareas')
      .then(respuesta => respuesta.json())
      .then(tareas => setTareas(tareas))
      .catch(error => console.error('Error al leer las tareas:', error));
  }, [tareas, editando]);

  return (
    <>

      <form onSubmit={(evento) => {
        evento.preventDefault();
        fetch('https://api-proyecto-final.onrender.com/crear-tarea', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ 
          textoTarea : textoTarea, 
          estado : estado,
          editando: false,
          })   
      })
      .then(respuesta => respuesta.json())
      .then(tarea => {
        setNuevaTarea(tareas => [...tareas, tarea]);
        setTextoTarea('');
        setEstado('pendiente');
        setEditando(false);
        console.log('Tarea enviada');
    })
    .catch(error => {
        console.error('Error al enviar la tarea:', error);
    })
       
    }}>

      <input type="text" placeholder="¿qué hay que hacer?"
          value={textoTarea}
          onChange={(evento) => {
              setTextoTarea(evento.target.value);
              console.log(textoTarea);
          }}
      />
        <input type="submit" value="crear tarea" />
    </form>

    <section className="tareas">
    
    {tareas.map((tarea) => (
      <div className="tarea" key={tarea._id}>
        <h2 className={editando && tarea === tareaEditada ? "" : "visible"}>{tarea.textoTarea}</h2>
        <input 
          type="text" 
          value={editando? textoEditado : tarea.textoTarea}
          onChange={(evento) => setTextoEditado(evento.target.value)}
          className={editando && tarea === tareaEditada ? "visible" : ""}
        />
        <button className="boton"
          onClick={async () => {
            if (editando && tarea === tareaEditada) {
              // Aquí va tu código para guardar los cambios
              const respuesta = await fetch(`https://api-proyecto-final.onrender.com/tareas/editar/${tarea._id}`, {
                method: 'PUT',
                headers: {
                  'Content-Type': 'application/json',
                },
                body: JSON.stringify({ textoTarea: textoEditado }),
              });
              if (respuesta.status === 200) {
                setEditando(false);
                setTareaEditada(null);
                setTextoEditado('');
                setTareas(tareas.map(listaTareas => {
                  if (listaTareas._id === tarea._id) {
                    return { ...listaTareas, textoTarea: textoEditado };
                  } else {
                    return listaTareas;
                  }
                }));
              } else {
                console.error('Error al guardar los cambios');
              }
            } else {
              setEditando(true);
              setTareaEditada(tarea);
              setTextoEditado(tarea.textoTarea);
            }
          }}
        >
          {editando && tarea === tareaEditada ? 'Guardar' : 'Editar'}
    </button>
        
        <button className="boton"
        onClick={() => {
          fetch(`https://api-proyecto-final.onrender.com/tareas/borrar/${tarea._id}`, {
            method: 'DELETE',
            headers: {
              'Content-Type': 'application/json',
            }
          })
          .then(respuesta => respuesta.json())
          .then(respuesta => {
            if (respuesta.tareaborrada == "ok") {
              setTareas(tareas.filter(listaTareas => listaTareas._id != tarea._id)); //borra la tarea del array si es distinto al id de la tarea que intentamos borrar
              console.log('Tarea borrada con exito');
            } else {
              console.log('Error al borrar la tarea');
            }
          });
  }}
        >Borrar</button>
        
        <button className={`estado ${tarea.estado == 'terminada' ? 'terminada' : ''}`}
          onClick={() => {
            const nuevoEstado = tarea.estado === 'pendiente' ? 'terminada' : 'pendiente';

            fetch(`https://api-proyecto-final.onrender.com/tareas/estado/${tarea._id}`, {
              method: 'PUT',
              headers: {
                'Content-Type': 'application/json',
              },
              body: JSON.stringify({ 
                estado: nuevoEstado
              })
            })
            .then(respuesta => respuesta.json())
            .then(respuesta => {
                console.log(respuesta.estadoModificado);
                // Actualiza el estado de la tarea en el front-end
                setTareas(tareas => tareas.map(eachTarea => {
                    if (eachTarea._id === tarea._id) {
                        return { ...eachTarea, estado: nuevoEstado };
                    }
                    return eachTarea;
                }));
                        });
                      }}
        ><span></span></button>
      </div>
  ))}
</section>
    </>
  )
}

export default App
