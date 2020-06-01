import React, { useState } from 'react';
import { Draggable } from 'react-beautiful-dnd';
import { tagsService } from '../services/tags';
import Window from '../components/Window';

const getItemStyle = (isDragging, draggableStyle) => ({
  userSelect: 'none',
  background: isDragging ? 'lightgreen' : '',
  ...draggableStyle,
});

const Item = ({ task, index }) => {
  const [show, setShow] = useState(false);

  const onOpen = () => {
    setShow(true);
  };

  const onClose = () => setShow(false);

  return (
    <Draggable key={task.id} draggableId={task.id.toString()} index={index}>
      {(provided, snapshot) => (
        <div //tasks
          ref={provided.innerRef}
          {...provided.draggableProps}
          {...provided.dragHandleProps}
          style={getItemStyle(snapshot.isDragging, provided.draggableProps.style)}
          className={'item'}
        >
          <span role="img" aria-label="⚙" onClick={onOpen} className={'item_info'}>
            ⚙️
          </span>
          <p className={'item_title'}>{task.title}</p>
          <p className={'item_desc'}>{task.description}</p>
          <div className={'item_tag-container'}>
            {task.tags.map((tag) =>
              tag ? (
                <p key={tag.id} className={'item_tag'} style={{ backgroundColor: tag.color }}>
                  {tag.title}
                </p>
              ) : (
                ''
              ),
            )}
          </div>
          <Window item={task} onClose={onClose} show={show} />
        </div>
      )}
    </Draggable>
  );
};
export default Item;
