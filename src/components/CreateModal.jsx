import React, { useState, useEffect, useContext } from 'react';
import Modal from 'react-modal';
import Select from 'react-select';
import { Controller, useForm } from 'react-hook-form';

import { tagsService } from '../services/tags';
import { tasksService } from '../services/tasks';
import { AppContext } from '../contexts/app';
import { statusToRepresentationMap } from '../representations/statuses';

Modal.setAppElement('#root');

const CreateModal = ({ show, onClose, status }) => {
  const { register, handleSubmit, errors, control } = useForm();

  const [statuses] = useState(Object.values(statusToRepresentationMap));
  const [defaultStatus] = useState(status ? statuses.find((s) => s.status === status) : null);
  const [tags, setTags] = useState([]);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(true);
  const appCtx = useContext(AppContext);

  const onSubmit = (formValue) => {
    formValue.tags = (formValue.tags || []).map((tagOption) => tagOption.value);
    formValue.status = status || formValue.status.value;

    tasksService
      .createTask(formValue)
      .then(() => {
        setUploading(false);

        appCtx.updateColumns();
      })
      .catch((error) => {
        setUploading(false);

        console.error(error);
      })
      .finally(() => {
        onClose();
      });
  };

  useEffect(() => {
    tagsService
      .getAllTags()
      .then((tags) => {
        setTags(tags);
      })
      .finally(() => setLoading(false));
  }, []);

  return loading ? (
    ''
  ) : (
    <Modal isOpen={show} onRequestClose={onClose} className={'modal'} overlayClassName={'overlay'}>
      <div className={'modal_btn-container modal_btn-container__creating'}>
        <h1 style={{ margin: 0, marginBottom: '20px' }}>Create task</h1>
        <button className="modal_btn close-btn" onClick={onClose}>
          X
        </button>
      </div>
      <div className={'modal_form-ctn'}>
        <form className={'modal_form-wrapper'} onSubmit={handleSubmit(onSubmit)}>
          <input
            className={'modal_text-input-cnt'}
            placeholder="Title"
            name="title"
            ref={register({ required: true })}
          />
          {errors.title && <p className="modal_form-wrapper-error">Title is required.</p>}
          <input
            className={'modal_text-input-cnt'}
            placeholder="Description"
            name="description"
            ref={register({ required: false })}
          />
          <div className={'modal_select-input-row-wrapper'}>
            <div className={'modal_select-input-wrapper'}>
              <Controller
                className={'modal_select-input-cnt'}
                as={<Select isMulti options={tags.map((tag) => ({ label: tag.title, value: tag.id }))} />}
                control={control}
                rules={{ required: false }}
                onChange={([selected]) => {
                  return selected;
                }}
                name="tags"
              />
            </div>
            <div className={'modal_select-input-wrapper'}>
              <Controller
                className={'modal_select-input-cnt'}
                as={<Select options={statuses.map((status) => ({ label: status.name, value: status.status }))} />}
                control={control}
                rules={{ required: true }}
                onChange={([selected]) => {
                  return selected;
                }}
                defaultValue={defaultStatus ? { value: defaultStatus.status, label: defaultStatus.name } : null}
                name="status"
              />
              {errors.status && <p>Status is required.</p>}
            </div>
          </div>
          <input className={'modal_create-btn'} type="submit" />
        </form>
      </div>
    </Modal>
  );
};

export default CreateModal;
