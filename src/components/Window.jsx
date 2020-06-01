import React, { useState, useEffect, useContext } from 'react';
import Modal from 'react-modal';
import Select from 'react-select';
import { Controller, useForm } from 'react-hook-form';

import { tagsService } from '../services/tags';
import { tasksService } from '../services/tasks';
import { AppContext } from '../contexts/app';

Modal.setAppElement('#root');

const Window = ({ show, onClose, item }) => {
  const [uploading, setUploading] = useState(false);
  const [, setLoading] = useState(false);
  const [editing, setEditing] = useState(false);
  const [tags, setTags] = useState([]);
  const appCtx = useContext(AppContext);

  const { register, handleSubmit, errors, getValues, control } = useForm();

  useEffect(() => {
    tagsService
      .getAllTags()
      .then((tags) => {
        setTags(tags);
      })
      .finally(() => {
        setLoading(false);
        setEditing(false);
      });
  }, []);

  const onEdit = () => {
    setEditing(true);
  };

  const onReset = () => {
    setEditing(false);
    setUploading(false);
  };

  const onAccept = () => {
    setUploading(true);
    const formValue = getValues();

    formValue.tags = (formValue.tags || []).map((tagOption) => tagOption.value);

    tasksService
      .updateTaskById(item.id, formValue)
      .then(() => {
        setUploading(false);
        setEditing(false);

        appCtx.updateColumns();
      })
      .catch((error) => {
        setUploading(false);
        setEditing(false);

        console.error(error);
      });
  };

  const onRemove = () => {
    tasksService
      .removeTaskById(item.id)
      .then(() => {
        setUploading(false);
        setEditing(false);

        appCtx.updateColumns();
      })
      .catch((error) => {
        setUploading(false);
        setEditing(false);

        console.error(error);
      });
  };

  return (
    <Modal isOpen={show} onRequestClose={onClose} className={'modal'} overlayClassName={'overlay'}>
      {!editing ? (
        <>
          <div className={'modal_header'}>
            <h1 style={{ margin: 0 }}>{item.title}</h1>
            <div className={'modal_btn-container'}>
              <button className={'modal_btn edit-btn'} onClick={onEdit}>
                <span role="img" aria-label="edit">
                  ✏️
                </span>
              </button>
              <button className={'modal_btn remove-btn'} onClick={onRemove}>
                <span role="img" aria-label="remove">
                  🗑️
                </span>
              </button>
              <button className={'modal_btn close-btn'} onClick={onClose}>
                X
              </button>
            </div>
          </div>
          <div>
            <h2>Description</h2>
            <p>{item.description}</p>
            <h2>Status</h2>
            <p style={{ textTransform: 'capitalize' }}>{item.status.toLowerCase()}</p>
            <h2>Tags</h2>
            {item.tags.length
              ? item.tags.map((tag) =>
                  tag === undefined ? (
                    ''
                  ) : (
                    <p key={tag.id} className={'item_tag'} style={{ backgroundColor: tag.color }}>
                      {tag.title}
                    </p>
                  ),
                )
              : 'No tags'}
          </div>
        </>
      ) : (
        <>
          <div className={'modal_header modal_header__editing'}>
            <div className={'modal_btn-container modal_btn-container__editing'}>
              <button className={'modal_btn remove-btn'} onClick={onRemove}>
                <span role="img" aria-label="remove">
                  🗑️
                </span>
              </button>
              <button className={'modal_btn close-btn'} onClick={onClose}>
                X
              </button>
            </div>
          </div>
          <div className={'modal_form-ctn'}>
            <form className={'modal_form-wrapper'} onSubmit={handleSubmit(onAccept)}>
              <input
                disabled={uploading}
                defaultValue={item.title}
                className={'modal_text-input-cnt'}
                placeholder="Title"
                name="title"
                ref={register({ required: true })}
              />
              {errors.title && 'Title is required.'}
              <input
                disabled={uploading}
                defaultValue={item.description}
                className={'modal_text-input-cnt'}
                placeholder="Description"
                name="description"
                ref={register({ required: false })}
              />
              <div className={'modal_select-input-wrapper modal_select-input-wrapper__editing'}>
                <Controller
                  className={'modal_select-input-cnt'}
                  as={<Select isMulti options={tags.map((tag) => ({ label: tag.title, value: tag.id }))} />}
                  control={control}
                  rules={{ required: true }}
                  onChange={([selected]) => {
                    return selected;
                  }}
                  name="tags"
                  defaultValue={item.tags.map((tag) => ({ label: tag.title, value: tag.id }))}
                />
              </div>
            </form>
          </div>
          <div className={'modal_btn-container modal_btn-container__editing'}>
            <button className={'modal_btn reset-btn'} onClick={onReset}>
              Reset
            </button>
            {!uploading ? (
              <button className={'modal_btn accept-btn'} onClick={onAccept}>
                ✓
              </button>
            ) : (
              <p>spinner</p>
            )}
          </div>
        </>
      )}
    </Modal>
  );
};

export default Window;
