import React, { useState, useEffect } from 'react';
//Toast
import { useToast } from '../../contexts/ToastContext';
//api
import { getAllDimension, updateDimension } from '../../services/dimensionService';

const Dimension = () => {
  const { showToast } = useToast();
  const [options, setOptions] = useState([]);
  const [updateId, setUpdateId] = useState('');

  useEffect(() => {
    getDimension();
  }, []);

  const getDimension = async () => {
    try {
      const response = await getAllDimension();
      setUpdateId(response.data.data[0]._id);      
      setOptions([
        { ...response.data.data[0].height, id: 'height', label: 'Height' },
        { ...response.data.data[0].width, id: 'width', label: 'Width' },
        { ...response.data.data[0].wallThickness, id: 'wallThickness', label: 'Wall Thickness' }
      ]);
    } catch (error) {
      console.error(error);
    }
  };

  const saveDimension = async (flag, opt) => {
    if (flag) {
      try {
        let payload = {
          status,
          height: { min: opt?.[0]?.min, max: opt?.[0]?.max },
          width: { min: opt?.[1]?.min, max: opt?.[1]?.max },
          wallThickness: { min: opt?.[2]?.min, max: opt?.[2]?.max }
        };
        const response = await updateDimension(updateId, payload);
        if (response?.data?.success) {
          showToast('Dimension updated successfully', 'success');
        } else {
          showToast('Dimension not updated', 'error');
        }
      } catch (error) {
        console.error(error);
        showToast('Something went wrong', 'error');
      }
    }
  };

  const handleEdit = (id, flag) => {
    setOptions(options.map((item) => (item.id === id ? { ...item, editing: !item.editing } : item)));
    saveDimension(flag, options);
  };

  const handleChange = (id, value, type) => {
    if (!/^\d*$/.test(value)) return;

    setOptions((prev) =>
      prev.map((item) => {
        if (item.id !== id) return item;

        const updated = {
          ...item,
          [type]: value
        };

        if (updated.min !== '' && updated.max !== '' && Number(updated.min) > Number(updated.max)) {
          return item;
        }

        return updated;
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
        Dimension Options
      </h2>

      <div
        style={{
          width: '1000px',
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
            background: '#ccfb96',
            borderBottom: '1px solid #ddd',
            fontWeight: '600',
            fontSize: '16px',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center'
          }}
        >
          <span>Set ( Min / Max )</span>
        </div>

        {options.map((item) => (
          <div
            key={item.id}
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
                gap: '50px',
                flex: 1
              }}
            >
              <span style={{ fontSize: '15px' }}>{item.label}</span>
            </div>
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '50px',
                flex: 1
              }}
            >
              {item.editing ? (
                <input
                  type="number"
                  value={item.min}
                  onChange={(e) => handleChange(item.id, e.target.value, 'min')}
                  style={{
                    padding: '6px 10px',
                    width: '200px'
                  }}
                />
              ) : (
                <span style={{ fontSize: '15px' }}>{item.min}</span>
              )}
            </div>

            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '50px',
                flex: 1
              }}
            >
              {item.editing ? (
                <input
                  type="number"
                  value={item.max}
                  onChange={(e) => handleChange(item.id, e.target.value, 'max')}
                  style={{
                    padding: '6px 10px',
                    width: '200px'
                  }}
                />
              ) : (
                <span style={{ fontSize: '15px' }}>{item.max}</span>
              )}
            </div>

            <div>
              <button
                onClick={() => handleEdit(item.id, item.editing)}
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
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Dimension;
