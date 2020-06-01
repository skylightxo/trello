import React from 'react';
import { Droppable } from 'react-beautiful-dnd';
import Item from '../components/Item';
import AddButton from '../components/AddButton';

const Column = ({ column, index }) => {
  const grid = 8;

  const getListStyle = (isDraggingOver) => ({
    background: isDraggingOver ? 'lightblue' : 'lightgrey',
    padding: grid,
    width: 250,
  });

  return (
    <section>
      <div className={'col_header'} style={{ background: column.header_color }}>
        <span className={'col_header-icon'}>{column.icon}</span>
        <p className={'col_header-text'}>{column.name}</p>
      </div>
      <Droppable key={index} droppableId={index.toString()}>
        {(provided, snapshot) => (
          <div
            className="col"
            ref={provided.innerRef}
            style={(getListStyle(snapshot.isDraggingOver), { background: column.bg_color })}
            {...provided.droppableProps}
          >
            {column.tasks.map((task, index) => (
              <Item key={task.id} task={task} index={index} />
            ))}
            {provided.placeholder}
            <AddButton status={column.status} />
          </div>
        )}
      </Droppable>
    </section>
  );
};

export default Column;
