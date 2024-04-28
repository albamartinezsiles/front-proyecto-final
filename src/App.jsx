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
    //si estoy editando no recargues la lista de tareas
    if (editando) {
      return; 
    }
  
    fetch('https://api-proyecto-final.onrender.com/tareas',{
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      }
    })
      .then(respuesta => respuesta.json())
      .then(tareas => setTareas(tareas))
      .catch(console.error('Error al leer las tareas:'));
  }, [tareas, editando]); //si cambia las tareas o si estoy editando, recarga la lista de tareas
  //

  return (
    <>
      <form
        onSubmit={(evento) => {
          //vamos a crear una tarea
          evento.preventDefault(); //evita que se recargue la pagina
          fetch("https://api-proyecto-final.onrender.com/crear-tarea", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              textoTarea: textoTarea,
              estado: estado,
              editando: false,
            }),
            //traduce de json y obten la tarea con las propiedades de texto, el estado y si está editando. También trae el _id de cada tarea que genera mongo
          })
            .then((respuesta) => respuesta.json())
            .then((tarea) => {
              setNuevaTarea((tareas) => [...tareas, tarea]);
              setTextoTarea("");
              setEstado("pendiente");
              setEditando(false);
              console.log("Tarea enviada");
            }) //agrega la tarea al array de tareas, deja el texto en blanco y el estado en pendiente. Tambien deja de editar. Con esto le damos valor a las variables
            .catch(() => {
              console.error("Error al enviar la tarea:");
            });
        }}
      >
        <input
          type="text"
          placeholder="¿qué hay que hacer?"
          value={textoTarea}
          onChange={(evento) => {
            setTextoTarea(evento.target.value);
            //damos valor a la variable textoTarea con lo que escribimos en el input
          }}
        />
        <input type="submit" value="crear tarea" />
      </form>

      <section className="tareas">
        {tareas.map((tarea) => (
          <div className="tarea" key={tarea._id}>
          {
            /* React necesita el id de cada tarea, asi que se lo ofrecemos accediendo a tarea._id */
          }
            <h2 className={editando ? "" : "visible"}>
              {tarea.textoTarea} {/* Si no estamos editando, muestra el texto de la tarea */}
            </h2>
            <input
              type="text"
              value={editando ? textoEditado : tarea.textoTarea /* Si estamos editando ponle a texto editado el textoTarea, es decir, el escrito en el input*/}
              onChange={(evento) => setTextoEditado(evento.target.value) /* Si cambia el texto del input, cambia el texto editado*/}
              className={editando && tarea === tareaEditada ? "visible" : ""} //Si estamos editando y la tarea es la tarea editada, muestra el input (tarea editada es null al principio y se cambia cuando editamos una tarea)
            />
            <button
              className="boton"
              onClick={async () => {
                if (editando && tarea === tareaEditada) {
                 //si estamos editando y la tarea es la tarea editada, entonces guarda los cambios. Aqui vamos a editar el texto de la tarea 
                //guardo la respuesta de la api en una variable para poder usarla más adelante si la respuesta es correcta (status 200)
                  const respuesta = await fetch(
                    `https://api-proyecto-final.onrender.com/tareas/editar/${tarea._id}`,
                    {
                      method: "PUT",
                      headers: {
                        "Content-Type": "application/json",
                      },
                      body: JSON.stringify({ textoTarea: textoEditado }),
                    }
                  );
                  if (respuesta.status === 200) {
                    setEditando(false);
                    setTareaEditada(null);
                    setTextoEditado("");
                    setTareas(
                      tareas.map((listaTareas) => {
                        if (listaTareas._id === tarea._id) {
                          return { ...listaTareas, textoTarea: textoEditado }; //cuando coincida la tarea de la lista con la tarea que queremos editar, devolvemos la tarea con el texto editado
                        } else {
                          return listaTareas; //si no coincide, devolvemos la tarea sin modificar
                        }
                      })
                    );
                  } else {
                    console.error("Error al guardar los cambios");
                  }
                } else {
                  setEditando(true);
                  setTareaEditada(tarea);
                  setTextoEditado(tarea.textoTarea);
                }
                //si no estamos editando, entonces vamos a editar la tarea. Le damos el valor true a editando, cambiamos el valor de tareaEditada a la tarea que queremos editar y el texto editado al texto de la tarea
              }}
            >
              {editando && tarea === tareaEditada ? "Guardar" : "Editar"}
              {/* Si estamos editando y la tarea es la tarea editada, muestra guardar, si no, muestra editar */}
            </button>

            <button
              className="boton"
              onClick={() => {
                fetch(
                  `https://api-proyecto-final.onrender.com/tareas/borrar/${tarea._id}`,
                  {
                    method: "DELETE",
                    headers: {
                      "Content-Type": "application/json",
                    },
                  }
                )
                  .then((respuesta) => respuesta.json())
                  .then((respuesta) => {
                    if (respuesta.tareaborrada == "ok") { //si la respuesta es correcta, borra la tarea
                      setTareas( //actualizamos el front usando el useState
                        tareas.filter( //filtramos las tareas para que no aparezca la tarea que hemos borrado
                          (listaTareas) => listaTareas._id != tarea._id 
                        )
                      ); //borra la tarea del array si es distinto al id de la tarea que intentamos borrar
                      console.log("Tarea borrada con exito");
                    } else {
                      console.log("Error al borrar la tarea");
                    }
                  });
              }}
            >
              Borrar
            </button>

            <button
              className={`estado ${
                tarea.estado == "terminada" ? "terminada" : "" //si el estado de la tarea es terminada, añade la clase terminada
              }`}
              onClick={() => {
                const nuevoEstado =
                  tarea.estado === "pendiente" ? "terminada" : "pendiente"; //si el estado de la tarea es pendiente, cambialo a terminada, si no, cambialo a pendiente
                  // hacemos un switch para cambiar el estado de la tarea
                fetch(
                  `https://api-proyecto-final.onrender.com/tareas/estado/${tarea._id}`,
                  {
                    method: "PUT",
                    headers: {
                      "Content-Type": "application/json",
                    },
                    body: JSON.stringify({
                      estado: nuevoEstado,
                      //el estado se guarda en la variable nuevoEstado
                    }),
                  }
                )
                  .then((respuesta) => respuesta.json())
                  .then((respuesta) => {
                    console.log(respuesta.estadoModificado);
                    // actualizamos el front
                    setTareas((tareas) => //actualizamos las tareas usando el useState
                      tareas.map((eachTarea) => { //recorremos las tareas
                        if (eachTarea._id === tarea._id) {
                          // en el bucle,si coincide la tarea de la lista con la que queremos editar, devolvemos la tarea con el nuevo estado
                          return { ...eachTarea, estado: nuevoEstado };
                        }
                        // si no coincide, devolvemos la tarea sin modificar
                        return eachTarea;
                      })
                    );
                  });
              }}
            >
              <span></span>
            </button>
          </div>
        ))}
      </section>
    </>
  );
}

export default App
