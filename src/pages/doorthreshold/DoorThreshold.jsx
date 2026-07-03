import React, { useEffect, useState } from 'react';
import { getAllDoorThreshold, updateDoorThreshold } from '../../services/doorThresholdService';
import { useToast } from '../../contexts/ToastContext';
import { FormControl, InputLabel, MenuItem, Select, Stack } from '@mui/material';

const DoorThreshold = () => {
  const { showToast } = useToast();

  const [designs, setDesigns] = useState([]);

  const [subDesigns, setSubDesigns] = useState([]);
  const [frames, setFrames] = useState([]);
  const [frameTypes, setFrameTypes] = useState([]);
  const [frameTypeOptions, setFrameTypeOptions] = useState([]);
  const [threshold, setThreshold] = useState([]);

  const [selectedDesign, setSelectedDesign] = useState('');
  const [selectedSubDesign, setSelectedSubDesign] = useState('');
  const [selectedFrame, setSelectedFrame] = useState('');
  const [selectedFrameType, setSelectedFrameType] = useState('');
  const [selectedFrameTypeOption, setSelectedFrameTypeOption] = useState('');

  useEffect(() => {
    fetchDoorThresholds();
  }, []);

  const fetchDoorThresholds = async () => {
    try {
      const response = await getAllDoorThreshold();
      setDesigns(response.data.data);
    } catch (error) {
      console.error(error);
    }
  };

  const saveThreshold = async (data, updateId) => {
    try {
      const response = await updateDoorThreshold(updateId, data);

      if (response?.data?.success) {
        showToast('Door Threshold updated successfully', 'success');
      } else {
        showToast('Door Threshold not updated', 'error');
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
              options: type.options.map((option) => ({
                ...option,
                thresholds: option.thresholds.map((threshold) =>
                  threshold._id === id
                    ? {
                        ...threshold,
                        editing: !threshold.editing
                      }
                    : threshold
                )
              }))
            }))
          }))
        }))
      }));

      const currentDesign = updated.find((d) => d._id === selectedDesign);

      const currentSub = currentDesign?.subdesign.find((s) => s._id === selectedSubDesign);

      const currentFrame = currentSub?.frame.find((f) => f._id === selectedFrame);

      const currentFrameType = currentFrame?.frameTypes.find((t) => t._id === selectedFrameType);

      const currentOption = currentFrameType?.options.find((o) => o._id === selectedFrameTypeOption);

      setSubDesigns(currentDesign?.subdesign || []);
      setFrames(currentSub?.frame || []);
      setFrameTypes(currentFrame?.frameTypes || []);
      setFrameTypeOptions(currentFrameType?.options || []);
      setThreshold(currentOption?.thresholds || []);

      if (editing) {
        const result = currentOption?.thresholds.find((o) => o._id === id);

        if (result) {
          saveThreshold(result, id);
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
              options: type.options.map((option) => ({
                ...option,
                thresholds: option.thresholds.map((threshold) =>
                  threshold._id === id
                    ? {
                        ...threshold,
                       
                      }
                    : threshold
                )
              }))
            }))
          }))
        }))
      }));

      const currentDesign = updated.find((d) => d._id === selectedDesign);

      const currentSub = currentDesign?.subdesign.find((s) => s._id === selectedSubDesign);

      const currentFrame = currentSub?.frame.find((f) => f._id === selectedFrame);

      const currentFrameType = currentFrame?.frameTypes.find((t) => t._id === selectedFrameType);

      const currentOption = currentFrameType?.options.find((o) => o._id === selectedFrameTypeOption);

      setSubDesigns(currentDesign?.subdesign || []);
      setFrames(currentSub?.frame || []);
      setFrameTypes(currentFrame?.frameTypes || []);
      setFrameTypeOptions(currentFrameType?.options || []);
      setThreshold(currentOption?.thresholds || []);

      if (category === 'status') {
        const result = currentOption?.thresholds.find((threshold) => threshold._id === id);

        if (result) {
          saveThreshold(result, id);
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
    setSelectedFrameTypeOption('');

    const design = designs.find((d) => d._id === id);

    setSubDesigns(design?.subdesign || []);
    setFrames([]);
    setFrameTypes([]);
    setFrameTypeOptions([]);
    setThreshold([]);
  };

  const handleSubDesignChange = (e) => {
    const id = e.target.value;

    setSelectedSubDesign(id);
    setSelectedFrame('');
    setSelectedFrameType('');
    setSelectedFrameTypeOption('');

    const sub = subDesigns.find((s) => s._id === id);

    setFrames(sub?.frame || []);
    setFrameTypes([]);
    setFrameTypeOptions([]);
    setThreshold([]);
  };

  const handleFrameChange = (e) => {
    const id = e.target.value;

    setSelectedFrame(id);
    setSelectedFrameType('');
    setSelectedFrameTypeOption('');

    const frame = frames.find((f) => f._id === id);

    setFrameTypes(frame?.frameTypes || []);
    setFrameTypeOptions([]);
    setThreshold([]);
  };

  const handleFrameTypeChange = (e) => {
    const id = e.target.value;
    setSelectedFrameType(id);
    setSelectedFrameTypeOption('');

    const frameType = frameTypes.find((f) => f._id === id);
    setFrameTypeOptions(frameType?.options || []);
    setThreshold([]);
  };

  const handleFrameTypeOptionChange = (e) => {
    const id = e.target.value;

    setSelectedFrameTypeOption(id);

    const option = frameTypeOptions.find((o) => o._id === id);

    setThreshold(option?.thresholds || []);
  };
  return (
    <div style={{ padding: '25px' }}>
      <h2 style={{ marginBottom: '20px', color: '#333', fontWeight: '600' }}>Door Threshold</h2>

      <Stack direction="row" spacing={2} sx={{ mb: 2 }}>
        <FormControl fullWidth size="small"    sx={{
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
  }}  >
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
  }} >
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

        <FormControl fullWidth size="small" disabled={!selectedSubDesign}     sx={{
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
  }}  >
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

        <FormControl fullWidth size="small" disabled={!selectedFrame}       sx={{
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
  }} >
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

        <FormControl fullWidth size="small" disabled={!selectedFrameType}      sx={{
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
  }} >
          <InputLabel>Frame Type Option</InputLabel>

          <Select value={selectedFrameTypeOption} label="Frame Type Option" onChange={handleFrameTypeOptionChange}>
            <MenuItem value="">
              <em>Select Frame Type Option</em>
            </MenuItem>

            {frameTypeOptions.map((item) => (
              <MenuItem key={item._id} value={item._id}>
                {item.frameTypeOptionName}
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
        <div style={{ padding: '14px 18px', background: '#ccfb96', borderBottom: '1px solid #ddd', fontWeight: '600', fontSize: '16px' }}>
          Threshold Settings
        </div>

        {threshold.map((item) => (
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
                  value={item.thresholdName}
                  onChange={(e) => handleChange(item._id, e.target.value, 'data')}
                  style={{ padding: '6px 10px', width: '200px' }}
                />
              ) : (
                <span style={{ fontSize: '15px' }}>{item.thresholdName}</span>
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

            
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default DoorThreshold;
