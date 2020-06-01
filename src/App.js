import React, { useState, useEffect } from 'react';
import { DragDropContext } from 'react-beautiful-dnd';
import Column from './components/Column';
import CreateModal from './components/CreateModal';
import { tasksService } from './services/tasks';
import { AppContext } from './contexts/app';
import { statusToRepresentationMap } from './representations/statuses';

const reorder = (list, startIndex, endIndex) => {
  const result = Array.from(list);
  const [removed] = result.splice(startIndex, 1);
  result.splice(endIndex, 0, removed);
  return result;
};

const move = (source, destination, droppableSource, droppableDestination) => {
  const sourceClone = Array.from(source);
  const destClone = Array.from(destination);
  const [removed] = sourceClone.splice(droppableSource.index, 1);

  destClone.splice(droppableDestination.index, 0, removed);

  const result = {};
  result[droppableSource.droppableId] = sourceClone;
  result[droppableDestination.droppableId] = destClone;

  return result;
};

const moveBack = (source, destination, droppableDestination, droppableSource) => {
  const sourceClone = Array.from(source);
  const destClone = Array.from(destination);
  const [removed] = destClone.splice(droppableDestination.index, 1);

  sourceClone.splice(droppableSource.index, 0, removed);

  const result = {};
  result[droppableSource.droppableId] = sourceClone;
  result[droppableDestination.droppableId] = destClone;

  return result;
};

function App() {
  const [showCreateModal, setShowModal] = useState(false);
  const [loading, setLoading] = useState(true);
  const [originalTasks, setOriginalTasks] = useState(null);
  const [columns, setColumns] = useState(null);

  const onOpen = () => {
    setShowModal(true);
  };

  const onClose = () => setShowModal(false);

  function onDragEnd({ source, destination }) {
    if (!destination) {
      return;
    }
    const sInd = +source.droppableId;
    const dInd = +destination.droppableId;

    if (sInd === dInd) {
      const tasks = reorder(columns[sInd].tasks, source.index, destination.index);

      // /** Update positions */
      // Promise.all(
      //   tasks.map(
      //     async (task, index) =>
      //       await tasksService.updateTaskById(task.id, { position: index })
      //   )
      // );

      const newColumns = [...columns];
      newColumns[sInd].tasks = tasks;
      setColumns(newColumns);
    } else {
      const result = move(columns[sInd].tasks, columns[dInd].tasks, source, destination);
      const newColumns = [...columns];
      newColumns[sInd].tasks = result[sInd];
      newColumns[dInd].tasks = result[dInd];

      // /** Update positions */
      // Promise.all(
      //   result[dInd].map(
      //     async (task, index) =>
      //       await tasksService.updateTaskById(task.id, { position: index })
      //   )
      // );

      const task = newColumns[dInd].tasks[destination.index];
      const oldStatus = task.status;
      const newStatus = Object.keys(statusToRepresentationMap)[dInd];

      task.status = newStatus;

      setColumns(newColumns);
      setOriginalTasks([...originalTasks]);

      tasksService.updateTaskById(task.id, { status: newStatus }).catch((error) => {
        console.error(error);

        const result = moveBack(columns[sInd].tasks, columns[dInd].tasks, destination, source);
        const newColumns = [...columns];
        newColumns[sInd].tasks = result[sInd];
        newColumns[dInd].tasks = result[dInd];

        task.status = oldStatus;

        setColumns(newColumns);
        setOriginalTasks([...originalTasks]);
      });
    }
  }

  async function refreshColumns() {
    const tasks = await tasksService.getAllTasks();
    const columns = buildColumnsFromTasks(tasks);

    setOriginalTasks(tasks);
    setColumns(columns);

    return columns;
  }

  function buildColumnsFromTasks(tasks) {
    const statusesToTasksMap = tasks.reduce((acc, task) => {
      acc[task.status] = acc[task.status] || [];

      const statusTasks = acc[task.status];

      statusTasks.push(task);

      return acc;
    }, {});

    const columns = Object.entries(statusToRepresentationMap).reduce((acc, [status, statusToRepresentation]) => {
      const tasks = Array.from(statusesToTasksMap[status] || []);
      tasks.sort((a, b) => a.position - b.position);

      const column = {
        ...statusToRepresentation,
        tasks,
      };

      acc.push(column);

      return acc;
    }, []);

    return columns;
  }

  async function updateColumns() {
    setLoading(true);

    await refreshColumns();

    setLoading(false);
  }

  useEffect(() => {
    refreshColumns().finally(() => {
      setLoading(false);
    });
  }, []);

  function searchTasksByString(searchString) {
    if (!searchString) {
      return setColumns(buildColumnsFromTasks(originalTasks));
    }

    const filteredTasks = originalTasks.filter((task) => tasksService.filterTasks(searchString, task));
    const columns = buildColumnsFromTasks(filteredTasks);

    setColumns(columns);
  }

  return loading ? (
    <>
      <div className="header">
        <span className="header_image" role="img" aria-label={'+'} onClick={onOpen}>
          ➕
        </span>{' '}
        <span className="header_image" role="img" aria-label={'search'}>
          🔍
        </span>
        <input></input>
      </div>
      <div className="row">
        <h2 style={{ textAlign: 'center' }}>Loading</h2>
      </div>
    </>
  ) : (
    <AppContext.Provider value={{ updateColumns, searchTasksByString }}>
      <div className="header">
        <span className="header_image" role="img" aria-label={'+'} onClick={onOpen}>
          ➕
        </span>{' '}
        <span className="header_image" role="img" aria-label={'search'}>
          🔍
        </span>
        <input onChange={(e) => searchTasksByString(e.target.value)}></input>
      </div>
      <div className="row">
        <DragDropContext onDragEnd={onDragEnd}>
          {columns.map((column, index) => (
            <Column key={column.name} column={column} index={index} />
          ))}
        </DragDropContext>
      </div>
      <CreateModal onClose={onClose} show={showCreateModal} />
    </AppContext.Provider>
  );
}

export default App;
