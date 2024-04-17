import React, { Component } from 'react';

class Tarea extends Component {
  constructor(props) {
    super(props);
    this.state = {
      id: props.id,
      textoTarea: props.textoTarea,
      editando: false,
      estado: props.estado,
      DOM: null,
    };
    this.crearTarea(props.estado, props.contenedor);
  }

  crearTarea = (estado, contenedor) => {
   
    
    // Implementa la lógica de creación del componente aquí
    // En React, normalmente no necesitarías usar appendChild
    // En su lugar, renderizarías el componente y manejarías su estado interno
  }

  editarTarea = () => {
    // Implementa la lógica de edición de la tarea aquí
  
    // Si la tarea está siendo editada, cambia el estado a no editando
}

  borrarTarea = () => {
    // Implementa la lógica de borrado de la tarea aquí
  }

  toggleEstado = () => {
    // Implementa la lógica de cambio de estado aquí
  }

  render() {
    const { textoTarea, estado } = this.state;

    return (
      <div className='tarea'>
        <h2 className='visible'>{textoTarea}</h2>
        <input type='text' value={textoTarea}
        onSubmit={this.editarTarea()} // No olvides agregar el evento onSubmit
        onChange={this.editarTarea()} // No olvides agregar el evento onChange

         />
        <button className='boton' onClick={this.editarTarea()}>Editar</button>
        <button className='boton' onClick={this.borrarTarea()}>Borrar</button>
        <button className={`estado ${estado ? 'terminada' : ''}`} onClick={this.toggleEstado}>
          <span></span>
        </button>
      </div>
    );
  }
}

export default Tarea;