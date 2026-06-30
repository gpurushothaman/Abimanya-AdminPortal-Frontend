import React, { useEffect, useState } from 'react';
import { getAllDoorThickness, updateDoorThickness } from '../../services/doorThicknessService';
import { useToast } from '../../contexts/ToastContext';
import Switch from '@mui/material/Switch';
import { FormControl, InputLabel, MenuItem, Select, Stack, FormControlLabel } from '@mui/material';

const DoorThickness = () => {
  const { showToast } = useToast();

  const [designs, setDesigns] = useState([]);
  const [subDesigns, setSubDesigns] = useState([]);
  const [thickness, setthickness] = useState([]);

  const [selectedDesign, setSelectedDesign] = useState('');
  const [selectedSubDesign, setSelectedSubDesign] = useState('');

  useEffect(() => {
    fetchDoorThickness();
  }, []);

  const fetchDoorThickness = async () => {
    try {
      const response = await getAllDoorThickness();
      console.log(response.data.data);
      console.log('response data:', response);
      setDesigns(response.data.data);
    } catch (error) {
      console.error(error);
    }
  };

  const saveThickness = async (data, updateId) => {
    try {
      const response = await updateDoorThickness(updateId, data);

      if (response?.data?.success) {
        showToast('DoorThickness option updated successfully', 'success');
      } else {
        showToast('DoorThickness option not updated', 'error');
      }
    } catch (error) {
      console.error(error);

      showToast('Something went wrong', 'error');
    }
  };

 

  const handleEdit = (id, editing) => {
    setDesigns((prev) => {
      const updated = prev.map((design) => ({
        ...design,
        subdesign: design.subdesign.map((sub) => ({
          ...sub,
        thickness: sub.thickness.map((thickness) =>
  thickness._id === id
    ? { ...thickness, editing: !thickness.editing }
    : thickness
)
        }))
      }));
      const currentDesign = updated.find((d) => d._id === selectedDesign);
      const currentSub = currentDesign?.subdesign.find((s) => s._id === selectedSubDesign);
      setSubDesigns(currentDesign?.subdesign || []);
      setthickness(currentSub?.thickness || []);
      if (editing) {
        const result = currentSub?.thickness.find((f) => f._id === id);
        if (result) {
          saveThickness(result, id);
        }
      }
      return updated;
    });
  };

  const handleChange = (id, value, category) => {
    setDesigns((prev) => {
      const updated = prev.map((design) => ({
        ...design,
        subdesign: design.subdesign.map((sub) => ({
          ...sub,
        thickness: sub.thickness.map((thickness) =>
            thickness._id === id
              ? {
                  ...thickness,
                  ...(category === 'data' ? { DoorThicknessName: value } : { status: value })
                }
              : thickness
          )
        }))
      }));
      //Updated subdesign
      const currentDesign = updated.find((d) => d._id === selectedDesign);
      setSubDesigns(currentDesign?.subdesign || []);
      //Updated orientation
      const currentSub = currentDesign?.subdesign.find((s) => s._id === selectedSubDesign);
      setthickness(currentSub?.thickness || []);
      if (category === 'status') {
        const result = currentSub?.thickness?.find((item) => item._id === id);
        console.log('res:=', result);
        saveThickness(result, id);
      }
      return updated;
    });
  };

  const handleDesignChange = (e) => {
    const designId = e.target.value;
    setSelectedDesign(designId);
    setSelectedSubDesign('');
    const design = designs.find((d) => d._id === designId);
    setSubDesigns(design ? design.subdesign : []);
    setthickness([]);
  };



  const handleSubDesignChange = (e) => {
    const subId = e.target.value;
    setSelectedSubDesign(subId);
    const sub = subDesigns.find((s) => s._id === subId);
    setthickness(sub ? sub.thickness : []);
  };

  return (
    <div style={{ padding: '25px' }}>
      <h2 style={{ marginBottom: '20px', color: '#333', fontWeight: '600' }}>Door Thickness</h2>

      <Stack direction="row" spacing={2} sx={{ mb: 2 }}>
        <FormControl fullWidth size="small">
          <InputLabel id="design-label">Design</InputLabel>
          <Select labelId="design-label" value={selectedDesign} label="Design" onChange={handleDesignChange}>
            <MenuItem value="">
              <em>Select Design</em>
            </MenuItem>

            {designs.map((item) => (
              <MenuItem key={item._id} value={item._id}>
                {item.name}
              </MenuItem>
            ))}
          </Select>
        </FormControl>

        <FormControl fullWidth size="small" disabled={!selectedDesign}>
          <InputLabel id="subdesign-label">Sub Design</InputLabel>
          <Select labelId="subdesign-label" value={selectedSubDesign} label="Sub Design" onChange={handleSubDesignChange}>
            <MenuItem value="">
              <em>Select Sub Design</em>
            </MenuItem>

            {subDesigns.map((item) => (
              <MenuItem key={item._id} value={item._id}>
                {item.name}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
      </Stack>

      <div
        style={{
          width: '550px',
          background: '#fff',
          border: '1px solid #dcdcdc',
          borderRadius: '8px',
          overflow: 'hidden',
          boxShadow: '0 2px 6px rgba(0,0,0,0.08)'
        }}
      >
        <div style={{ padding: '14px 18px', background: '#f5f5f5', borderBottom: '1px solid #ddd', fontWeight: '600', fontSize: '16px' }}>
          Thickness Options
        </div>

       
        {thickness.map((item) => (
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
            <div style={{ display: 'flex', alignItems: 'center', gap: '15px', flex: 1 }}>
              {item.editing ? (
                <input
                  type="text"
                value={item.DoorThicknessName}
                  onChange={(e) => handleChange(item._id, e.target.value, 'data')}
                  style={{ padding: '6px 10px', width: '200px' }}
                />
              ) : (
                <span style={{ fontSize: '15px' }}>    {item.DoorThicknessName}  </span>
              )}
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
                  <Switch
                    checked={item?.status || false}
                    onChange={(e) => handleChange(item._id, e.target.checked, 'status')}
                    color="success"
                  />
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

export default DoorThickness;
