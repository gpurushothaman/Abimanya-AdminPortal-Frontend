import React, { useState, useEffect } from 'react';
import Switch from '@mui/material/Switch';
import FormControlLabel from '@mui/material/FormControlLabel';
//Toast
import { useToast } from '../../contexts/ToastContext';
//api
import { getDoorModels, updateDoorModel } from '../../services/doorModelService';

const DoorModel = () => {
  const { showToast } = useToast();
  const [options, setOptions] = useState([]);

  useEffect(() => {
    getModels();
  }, []);

  useEffect(() => {

  }, [options]);

  const getModels = async () => {
    try {
      const response = await getDoorModels();
      console.log(response.data);
      if (response?.data?.success) {
        setOptions(response?.data?.data);
      }
    } catch (error) {
      console.error(error);
    }
  };

  const saveDimension = async (flag, opt, updateId) => {
    if (flag) {
      try {        
        const response = await updateDoorModel(updateId, opt);
        if (response?.data?.success) {
          showToast('Door Model option updated successfully', 'success');
        } else {
          showToast('Door Model option not updated', 'error');
        }
      } catch (error) {
        console.error(error);
        showToast('Something went wrong', 'error');
      }
    }
  };

const handleEdit = (id, editing) => {
  const item = options.find(
    (x) => x._id === id
  );
  if (editing) {
    saveDimension(true, item, id);
  }
  setOptions(
    options.map((item) =>
      item._id === id
        ? {
            ...item,
            editing: !item.editing
          }
        : item
    )
  );
};

  const handleChange = (id, value, category) => { 
    setOptions((prev) =>
      prev.map((item) => {
        if (item._id !== id) return item;

        if (category === 'data') {
          const updated = {
            ...item,
            modelName: value
          };
          return updated;
        } else if (category === 'status') {
          const updated = {
            ...item,
            status: value
          };  
          saveDimension(true, updated, id);        
          return updated;      
        }
      })
    );
  
  };

  return (
    <div style={{ padding: '25px' }}>
      <h2
        style={{
          marginBottom: '20px',
          color: '#333',
          fontStyle: ''
        }}
      >
        Door Models
      </h2>

      <div
        style={{
          width: '700px',
          minWidth: '700px',
          background: '#fff',
          border: '1px solid #dcdcdc',
          borderRadius: '8px',
          overflow: 'hidden',
          boxShadow: '0 2px 6px rgba(0,0,0,0.08)'
        }}
      >
        <div
          style={{
            padding: '14px 18px',
            background: '#f5f5f5',
            borderBottom: '1px solid #ddd',
            fontWeight: '600',
            fontSize: '16px'
          }}
        >
          Door Model Options
        </div>

        {options.map((item) => (
          <div
            key={item._id}
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              padding: '16px 18px',
              borderBottom: '1px solid #eee'
            }}
          >
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                flex: 1
              }}
            >

              <div
  style={{
    display: 'flex',
    alignItems: 'center',
    gap: '25px',
    flex: 1
  }}
>
  <span
    style={{
      width: '150px',
      fontWeight: '600'
    }}
  >
    {item.subDesignId?.subDesignValue}
  </span>

  {item.editing ? (
    <input
      type="text"
      value={item.modelName}
      onChange={(e) =>
        handleChange(
          item._id,
          e.target.value,
          'data'
        )
      }
      style={{
        padding: '6px 10px',
        width: '200px'
      }}
    />
  ) : (
    <span>
      {item.modelName}
    </span>
  )}
</div>



            </div>

            <div>
              <button
                onClick={() => handleEdit(item._id, item.editing)}
                style={{
                  border: 'none',
                  background: 'transparent',
                  cursor: 'pointer',
                  fontSize: '18px',
                  marginRight: '15px'
                }}
              >
                {item.editing ? '✔️' : '✏️'}
              </button>

              <FormControlLabel
                control={
                  <Switch checked={item?.status} onChange={(e) => handleChange(item._id, e.target.checked, 'status')} color="success" />
                }
                label={item?.status ? 'Active' : 'Inactive'}
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default DoorModel;
