import React, { useEffect, useState } from 'react';
import { getDoorFrameTypeOptions, updateDoorFrameTypeOption } from '../../services/doorFrameTypeOptionsService';
import { useToast } from '../../contexts/ToastContext';
import Switch from '@mui/material/Switch';
import { FormControl, InputLabel, MenuItem, Select, Stack, FormControlLabel } from '@mui/material';

const DoorFrameTypeOptions = () => {
  const { showToast } = useToast();

  const [designs, setDesigns] = useState([]);

  const [subDesigns, setSubDesigns] = useState([]);
  const [frames, setFrames] = useState([]);
  const [frameTypes, setFrameTypes] = useState([]);
  const [options, setOptions] = useState([]);

  const [selectedDesign, setSelectedDesign] = useState('');
  const [selectedSubDesign, setSelectedSubDesign] = useState('');
  const [selectedFrame, setSelectedFrame] = useState('');
  const [selectedFrameType, setSelectedFrameType] = useState('');

  useEffect(() => {
    fetchDoorFrameTypeOptions();
  }, []);

  const fetchDoorFrameTypeOptions = async () => {
    try {
      const response = await getDoorFrameTypeOptions();
      console.log('response data:', response);
      setDesigns(response.data.data);
    } catch (error) {
      console.error(error);
    }
  };

  const saveFrame = async (data, updateId) => {
    try {
      const response = await updateDoorFrameTypeOption(updateId, data);

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
            frameTypes: frame.frameTypes.map((type) => ({
              ...type,
              options: type.options.map((option) =>
                option._id === id
                  ? {
                      ...option,
                      editing: !option.editing
                    }
                  : option
              )
            }))
          }))
        }))
      }));

      const currentDesign = updated.find((d) => d._id === selectedDesign);

      const currentSub = currentDesign?.subdesign.find((s) => s._id === selectedSubDesign);

      const currentFrame = currentSub?.frame.find((f) => f._id === selectedFrame);

      const currentFrameType = currentFrame?.frameTypes.find((t) => t._id === selectedFrameType);

      setSubDesigns(currentDesign?.subdesign || []);
      setFrames(currentSub?.frame || []);
      setFrameTypes(currentFrame?.frameTypes || []);
      setOptions(currentFrameType?.options || []);

      if (editing) {
        const result = currentFrameType?.options.find((o) => o._id === id);

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
            frameTypes: frame.frameTypes.map((type) => ({
              ...type,
              options: type.options.map((option) =>
                option._id === id
                  ? {
                      ...option,
                      ...(category === 'data' ? { frameTypeOptionName: value } : { status: value })
                    }
                  : option
              )
            }))
          }))
        }))
      }));

      const currentDesign = updated.find((d) => d._id === selectedDesign);

      const currentSub = currentDesign?.subdesign.find((s) => s._id === selectedSubDesign);

      const currentFrame = currentSub?.frame.find((f) => f._id === selectedFrame);

      const currentFrameType = currentFrame?.frameTypes.find((t) => t._id === selectedFrameType);

      setSubDesigns(currentDesign?.subdesign || []);
      setFrames(currentSub?.frame || []);
      setFrameTypes(currentFrame?.frameTypes || []);
      setOptions(currentFrameType?.options || []);

      if (category === 'status') {
        const result = currentFrameType?.options.find((option) => option._id === id);

        if (result) {
          saveFrame(result, id);
        }
      }

      return updated;
    });
  };

  const handleDesignChange = (e) => {
    const id = e.target.value;

    setSelectedDesign(id);
    setSelectedSubDesign('');
    setSelectedFrame('');
    setSelectedFrameType('');

    const design = designs.find((d) => d._id === id);

    setSubDesigns(design?.subdesign || []);
    setFrames([]);
    setFrameTypes([]);
    setOptions([]);
  };

  const handleSubDesignChange = (e) => {
    const id = e.target.value;

    setSelectedSubDesign(id);
    setSelectedFrame('');
    setSelectedFrameType('');

    const sub = subDesigns.find((s) => s._id === id);

    setFrames(sub?.frame || []);
    setFrameTypes([]);
    setOptions([]);
  };

  const handleFrameChange = (e) => {
    const id = e.target.value;

    setSelectedFrame(id);
    setSelectedFrameType('');

    const frame = frames.find((f) => f._id === id);

    setFrameTypes(frame?.frameTypes || []);
    setOptions([]);
  };

  const handleFrameTypeChange = (e) => {
    const id = e.target.value;
    setSelectedFrameType(id);

    const frameType = frameTypes.find((f) => f._id === id);
    setOptions(frameType?.options || []);
  };
  return (
    <div style={{ padding: '25px' }}>
      <h2 style={{ marginBottom: '20px', color: '#333', fontWeight: '600' }}>Door Frame Type Options</h2>

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

        <FormControl fullWidth size="small" disabled={!selectedFrame}>
          <InputLabel>Frame Type</InputLabel>

          <Select value={selectedFrameType} label="Frame Type" onChange={handleFrameTypeChange}>
            <MenuItem value="">
              <em>Select Frame Type</em>
            </MenuItem>

            {frameTypes.map((item) => (
              <MenuItem key={item._id} value={item._id}>
                {item.frameTypeName}
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
            <div style={{ display: 'flex', alignItems: 'center', gap: '15px', flex: 1 }}>
              {item.editing ? (
                <input
                  type="text"
                  value={item.frameTypeOptionName}
                  onChange={(e) => handleChange(item._id, e.target.value, 'data')}
                  style={{ padding: '6px 10px', width: '200px' }}
                />
              ) : (
                <span style={{ fontSize: '15px' }}>{item.frameTypeOptionName}</span>
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

export default DoorFrameTypeOptions;
