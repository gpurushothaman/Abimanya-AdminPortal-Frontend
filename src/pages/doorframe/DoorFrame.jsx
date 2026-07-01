import React, { useEffect, useState } from 'react';
import { getDoorFrame, updateDoorFrame } from '../../services/doorFrameService';
import { useToast } from '../../contexts/ToastContext';
import Switch from '@mui/material/Switch';
import { FormControl, InputLabel, MenuItem, Select, Stack, FormControlLabel } from '@mui/material';

const DoorFrame = () => {
  const { showToast } = useToast();

  const [designs, setDesigns] = useState([]);
  const [subDesigns, setSubDesigns] = useState([]);
  const [frames, setFrames] = useState([]);

  const [selectedDesign, setSelectedDesign] = useState('');
  const [selectedSubDesign, setSelectedSubDesign] = useState('');

  useEffect(() => {
    fetchDoorFrame();
  }, []);

  const fetchDoorFrame = async () => {
    try {
      const response = await getDoorFrame();
      console.log('response data:', response);
      setDesigns(response.data.data);
    } catch (error) {
      console.error(error);
    }
  };

  const saveFrame = async (data, updateId) => {
    try {
      const response = await updateDoorFrame(updateId, data);

      if (response?.data?.success) {
        showToast('Frame option updated successfully', 'success');
      } else {
        showToast('Frame option not updated', 'error');
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
          frame: sub.frame.map((frame) => (frame._id === id ? { ...frame, editing: !frame.editing } : frame))
        }))
      }));

      const currentDesign = updated.find((d) => d._id === selectedDesign);
      const currentSub = currentDesign?.subdesign.find((s) => s._id === selectedSubDesign);

      setSubDesigns(currentDesign?.subdesign || []);
      setFrames(currentSub?.frame || []);

      if (editing) {
        const result = currentSub?.frame.find((f) => f._id === id);
        if (result) {
          saveFrame(result, id);
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
          frame: sub.frame.map((frame) =>
            frame._id === id
              ? {
                  ...frame,
                  ...(category === 'data' ? { frameName: value } : { status: value })
                }
              : frame
          )
        }))
      }));

      //Updated subdesign
      const currentDesign = updated.find((d) => d._id === selectedDesign);
      setSubDesigns(currentDesign?.subdesign || []);

      //Updated frames
      const currentSub = currentDesign?.subdesign.find((s) => s._id === selectedSubDesign);
      setFrames(currentSub?.frame || []);

      if (category === 'status') {
        const result = currentSub?.frame?.find((item) => item._id === id);
        console.log('res:=', result);
        saveFrame(result, id);
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
    setFrames([]);
  };

  const handleSubDesignChange = (e) => {
    const subId = e.target.value;

    setSelectedSubDesign(subId);

    const sub = subDesigns.find((s) => s._id === subId);
    setFrames(sub ? sub.frame : []);
  };

  return (
    <div style={{ padding: '25px' }}>
      <h2 style={{ marginBottom: '20px', color: '#333', fontWeight: '600' }}>Door Frame</h2>

      <Stack direction="row" spacing={2} sx={{ mb: 2 }}>
        <FormControl fullWidth size="small"      sx={{
    "& .MuiInputLabel-root": {
      color: "#66BB6A", // Normal label color
    },
    "& .MuiInputLabel-root.Mui-focused": {
      color: "#66BB6A", // Focus label color
    },
    "& .MuiOutlinedInput-root": {
      "& fieldset": {
        borderColor: "#A5D6A7", // Normal border
      },
      "&:hover fieldset": {
        borderColor: "#66BB6A", // Hover border
      },
      "&.Mui-focused fieldset": {
        borderColor: "#66BB6A", // Focus border
      },
    },
    "& .MuiSvgIcon-root": {
      color: "#66BB6A", // Dropdown arrow
    },
  }}     >
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

        <FormControl fullWidth size="small" disabled={!selectedDesign}      sx={{
    "& .MuiInputLabel-root": {
      color: "#66BB6A", // Normal label color
    },
    "& .MuiInputLabel-root.Mui-focused": {
      color: "#66BB6A", // Focus label color
    },
    "& .MuiOutlinedInput-root": {
      "& fieldset": {
        borderColor: "#A5D6A7", // Normal border
      },
      "&:hover fieldset": {
        borderColor: "#66BB6A", // Hover border
      },
      "&.Mui-focused fieldset": {
        borderColor: "#66BB6A", // Focus border
      },
    },
    "& .MuiSvgIcon-root": {
      color: "#66BB6A", // Dropdown arrow
    },
  }}   >
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
          Frame Options
        </div>

       
        {frames.map((item) => (
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
                  value={item.frameName}
                  onChange={(e) => handleChange(item._id, e.target.value, 'data')}
                  style={{ padding: '6px 10px', width: '200px' }}
                />
              ) : (
                <span style={{ fontSize: '15px' }}>{item.frameName}</span>
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

export default DoorFrame;
