import React, { useEffect, useState } from 'react';
import { getDoorFrameTypes, updateDoorFrameType } from '../../services/doorFrameTypesService';
import { useToast } from '../../contexts/ToastContext';
import Switch from '@mui/material/Switch';
import { FormControl, InputLabel, MenuItem, Select, Stack, FormControlLabel } from '@mui/material';

const DoorFrameType = () => {
  const { showToast } = useToast();

  const [designs, setDesigns] = useState([]);
  const [subDesigns, setSubDesigns] = useState([]);
  const [frames, setFrames] = useState([]);
  const [frameTypes, setFrameTypes] = useState([]);

  const [selectedDesign, setSelectedDesign] = useState('');
  const [selectedSubDesign, setSelectedSubDesign] = useState('');
  const [selectedFrame, setSelectedFrame] = useState('');

  useEffect(() => {
    fetchDoorFrameType();
  }, []);

  const fetchDoorFrameType = async () => {
    try {
      const response = await getDoorFrameTypes();
      console.log('response data:', response);
      setDesigns(response.data.data);
    } catch (error) {
      console.error(error);
    }
  };

  const saveFrame = async (data, updateId) => {
    try {
      const response = await updateDoorFrameType(updateId, data);

      if (response?.data?.success) {
        showToast('Frame type updated successfully', 'success');
      } else {
        showToast('Frame type not updated', 'error');
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
          frame: sub.frame.map((frame) => ({
            ...frame,
            frameTypes: frame.frameTypes.map((type) =>
              type._id === id
                ? {
                    ...type,
                    editing: !type.editing
                  }
                : type
            )
          }))
        }))
      }));

      const currentDesign = updated.find((d) => d._id === selectedDesign);
      const currentSub = currentDesign?.subdesign.find((s) => s._id === selectedSubDesign);
      const currentFrame = currentSub?.frame.find((f) => f._id === selectedFrame);

      setSubDesigns(currentDesign?.subdesign || []);
      setFrames(currentSub?.frame || []);
      setFrameTypes(currentFrame?.frameTypes || []);

      if (editing) {
        const result = currentFrame?.frameTypes.find((f) => f._id === id);
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
          frame: sub.frame.map((frame) => ({
            ...frame,
            frameTypes: frame.frameTypes.map((type) =>
              type._id === id
                ? {
                    ...type,
                    ...(category === 'data' ? { frameTypeName: value } : { status: value })
                  }
                : type
            )
          }))
        }))
      }));


      console.log(updated)

      //Updated subdesign
      const currentDesign = updated.find((d) => d._id === selectedDesign);
      setSubDesigns(currentDesign?.subdesign || []);

      //Updated frames
      const currentSub = currentDesign?.subdesign.find((s) => s._id === selectedSubDesign);
      setFrames(currentSub?.frame || []);

       //Updated frame types
       const currentFrame = currentSub?.frame.find((f) => f._id === selectedFrame);
       setFrameTypes(currentFrame?.frameTypes || []);

      if (category === 'status') {
        const result = currentFrame?.frameTypes?.find((item) => item._id === id);
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
    setSelectedFrame('');

    const design = designs.find((d) => d._id === designId);

    setSubDesigns(design?.subdesign || []);
    setFrames([]);
    setFrameTypes([]);
  };

  const handleSubDesignChange = (e) => {
    const subId = e.target.value;

    setSelectedSubDesign(subId);
    setSelectedFrame('');

    const sub = subDesigns.find((s) => s._id === subId);

    setFrames(sub?.frame || []);
    setFrameTypes([]);
  };

  const handleFrameChange = (e) => {
    const frameId = e.target.value;

    setSelectedFrame(frameId);

    const frame = frames.find((f) => f._id === frameId);

    setFrameTypes(frame?.frameTypes || []);
  };

  return (
    <div style={{ padding: '25px' }}>
      <h2 style={{ marginBottom: '20px', color: '#333', fontWeight: '600' }}>Door Frame Type</h2>

      <Stack direction="row" spacing={2} sx={{ mb: 2 }}>
        <FormControl fullWidth size="small">
          <InputLabel>Design</InputLabel>

          <Select value={selectedDesign} label="Design" onChange={handleDesignChange}>
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
          <InputLabel>Sub Design</InputLabel>

          <Select value={selectedSubDesign} label="Sub Design" onChange={handleSubDesignChange}>
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

        <FormControl fullWidth size="small" disabled={!selectedSubDesign}>
          <InputLabel>Frame</InputLabel>

          <Select value={selectedFrame} label="Frame" onChange={handleFrameChange}>
            <MenuItem value="">
              <em>Select Frame</em>
            </MenuItem>

            {frames.map((item) => (
              <MenuItem key={item._id} value={item._id}>
                {item.frameName}
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
          Frame Type Options
        </div>

        {frameTypes.map((item) => (
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
                  value={item.frameTypeName}
                  onChange={(e) => handleChange(item._id, e.target.value, 'data')}
                  style={{ padding: '6px 10px', width: '200px' }}
                />
              ) : (
                <span style={{ fontSize: '15px' }}>{item.frameTypeName}</span>
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

export default DoorFrameType;
