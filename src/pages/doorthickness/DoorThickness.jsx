import React, { useEffect, useState } from 'react';
import { getDoorThickness, createDoorThickness, updateDoorThickness, deleteDoorThickness } from '../../services/doorThicknessService';
import { useToast } from '../../contexts/ToastContext';
import Switch from "@mui/material/Switch";
import FormControlLabel from "@mui/material/FormControlLabel";

const DoorThickNess = () => {
  const { showToast } = useToast();
  const [options, setOptions] = useState([]);
  const [newThickness, setNewThickness] = useState('');
  const [thicknessValue, setThicknessValue] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    fetchDoorThickness();
  }, []);
  const fetchDoorThickness = async () => {
    try {
      const response = await getDoorThickness();
      setOptions(
        response.data.data.map((item) => ({
          ...item,
          editing: false,
          checked: false
        }))
      );
    } catch (error) {
      console.error('Fetch Error:', error);
    }
  };

  const handleEdit = async (id) => {
    const selected = options.find((item) => item._id === id);
    if (selected.editing) {
      const confirmed = window.confirm('Are you sure you want to update this item?');
      if (!confirmed) return;

      try {
        const { data } = await updateDoorThickness(id, {
          DoorThicknessname: selected.DoorThicknessname,
          DoorThicknessvalue: Number(selected.DoorThicknessvalue),
          status: selected.status
        });
        if (data.success) {
          showToast('Door thickness updated successfully', 'success');
        } else {
          showToast('Door thickness update failed', 'error');
          return;
        }
      } catch (error) {
        console.error('Update Error:', error);
        showToast('Something went wrong', 'error');
        return;
      }
    }
    setOptions(options.map((item) => (item._id === id ? { ...item, editing: !item.editing } : item)));
  };



  const handleNameChange = (id, value) => {
    setOptions(options.map((item) =>
      item._id === id
        ? { ...item, DoorThicknessname: value }
        : item
    ));
  };

  const handleValueChange = (id, value) => {
    if (/^\d*$/.test(value)) {
      setOptions(
        options.map((item) =>
          item._id === id
            ? { ...item, DoorThicknessvalue: value }
            : item
        )
      );
    }
  };
  const handleStatusChange = async (
    id,
    value
  ) => {
    setOptions((prev) =>
      prev.map((item) => {
        if (item._id !== id)
          return item;

        return {
          ...item,
          status: value
        };
      })
    );

    try {
      const current =
        options.find(
          (item) => item._id === id
        );

      const response =
        await updateDoorThickness(
          id,
          {
            ...current,
            status: value
          }
        );

      if (response?.data?.success) {
        showToast(
          "Status updated successfully",
          "success"
        );
      } else {
        showToast(
          "Status update failed",
          "error"
        );
      }
    } catch (error) {
      console.error(error);

      showToast(
        "Something went wrong",
        "error"
      );
    }
  };

  // UPDATE TOAST OPTIONS FOR   -----  >   ((((  DELETE MODEL  ))))

  const handleDelete = async (id) => {
    const confirmed = window.confirm('Are you sure you want to delete this item?');
    if (!confirmed) return;
    try {
      const { data } = await deleteDoorThickness(id);
      if (data.success) {
        setOptions(options.filter((item) => item._id !== id));
        showToast('Door thickness deleted successfully', 'success');
      } else {
        showToast('Door thickness not deleted', 'error');
      }
    } catch (error) {
      console.error('Delete Error:', error);
      showToast('Something went wrong', 'error');
    }
  };

  const handleCheck = (id) => {
    setOptions(options.map((item) => (item._id === id ? { ...item, checked: !item.checked } : item)));
  };

  // THIYAGUUUUUUUUU
  const handleThicknessValueChange = (e) => {
    console.log("sadf")
    const value = e.target.value;
    if (/^\d*$/.test(value)) {
      setThicknessValue(value);
      setError('');
    } else {
      setError('Enter correct value');
    }
  };

  const handleSave = async () => {
    if (!newThickness.trim()) {
      alert('Enter Thickness');
      return;
    }
    try {
      const response = await createDoorThickness({
        DoorThicknessname: newThickness,
        DoorThicknessvalue: thicknessValue,
      });
      console.log(response.data.data);
      setOptions([
        ...options,
        {
          ...response.data.data,
          editing: false,
          checked: false
        }
      ]);
      setNewThickness('');
      setThicknessValue('');
      setError('');
    } catch (error) {
      console.error('Create Error:', error);
    }
  };

  return (
    <div style={{ padding: '25px' }}>
      <h2
        style={{
          marginBottom: '20px',
          color: '#333',
          fontWeight: '600'
        }}
      >
        Door Thickness
      </h2>

      <div
        style={{
          marginBottom: '20px',
          display: 'flex',
          gap: '10px'
        }}
      >
        {/* FIRST CHECKBOX */}

        <input
          type="text"
          placeholder="Enter Thickness name"
          value={newThickness}
          onChange={(e) => setNewThickness(e.target.value)}
          style={{
            padding: '10px',
            width: '250px',
            border: '1px solid #ccc',
            borderRadius: '6px'
          }}
        />

        {/* SECOND CHECKBOX */}
        <input
          type="number"
          placeholder="Enter Thickness Value"
          value={thicknessValue}
          onChange={handleThicknessValueChange}
          style={{
            padding: '10px',
            width: '250px',
            border: '1px solid #ccc',
            borderRadius: '6px'
          }}
        />

        {/* ERROR MESSAGE */}
        {error && (
          <p
            style={{
              color: 'red',
              fontSize: '12px',
              marginTop: '5px'
            }}
          >
            {error}
          </p>
        )}

        <button
          onClick={handleSave}
          style={{
            padding: '10px 20px',
            backgroundColor: '#1976d2',
            color: '#fff',
            border: 'none',
            borderRadius: '6px',
            cursor: 'pointer'
          }}
        >
          Add
        </button>
      </div>

      <div
        style={{
          width: '700px',
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
          Thickness Options
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
                gap: '15px',
                flex: 1
              }}
            >
              {/* <input
                type="checkbox"
                checked={item.checked}
                onChange={() =>
                  handleCheck(item._id)
                }
              /> */}

              {item.editing ? (
                <div
                  style={{
                    display: "flex",
                    gap: "10px"
                  }}
                >
                  <input
                    value={item.DoorThicknessname}
                    onChange={(e) =>
                      handleNameChange(item._id, e.target.value)
                    }
                    style={{
                      padding: "6px"
                    }}
                  />

                  <input
                    value={item.DoorThicknessvalue}
                    onChange={(e) =>
                      handleValueChange(item._id, e.target.value)
                    }
                    style={{
                      padding: "6px"
                    }}
                  />
                </div>
              ) : (
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    flex: 1,
                    gap: "80px"
                  }}
                >
                  <span
                    style={{
                      fontSize: "15px",
                      minWidth: "150px"
                    }}
                  >
                    {item.DoorThicknessname}
                  </span>

                  <span
                    style={{
                      fontSize: "15px",
                      minWidth: "80px"
                    }}
                  >
                    {item.DoorThicknessvalue}
                  </span>
                </div>
              )}

            </div>
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: "flex-end",
                gap: "12px",
                minWidth: "320px"
              }}
            >
              <button
                onClick={() => handleEdit(item._id)}
                style={{
                  border: 'none',
                  background: 'transparent',
                  cursor: 'pointer',
                  fontSize: '18px'
                }}
              >
                {item.editing ? '✔️' : '✏️'}
              </button>



              <FormControlLabel
                control={
                  <Switch
                    checked={
                      item?.status || false
                    }
                    onChange={(e) =>
                      handleStatusChange(
                        item._id,
                        e.target.checked
                      )
                    }
                    color="success"
                  />
                }
                label={
                  item?.status
                    ? "Active"
                    : "Inactive"
                }
              />




              <button
                onClick={() => handleDelete(item._id)}
                style={{
                  border: 'none',
                  background: 'transparent',
                  cursor: 'pointer',
                  fontSize: '18px'
                }}
              >
                🗑️
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default DoorThickNess;
