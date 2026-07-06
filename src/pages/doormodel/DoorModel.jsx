import React, { useState, useEffect } from 'react';

import {
  Checkbox,
  Switch,
  FormControlLabel,
  Button,
  Stack,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Grid,
  TextField,
  MenuItem,
  Box
} from '@mui/material';
import ViewInArIcon from '@mui/icons-material/ViewInAr';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import IconButton from '@mui/material/IconButton';
import VisibilityIcon from '@mui/icons-material/Visibility';

//Toast
import { useToast } from '../../contexts/ToastContext';
//api
import { getDoorModels, updateDoorModel } from '../../services/doorModelService';

const DoorModel = () => {
  const SERVER_URL = import.meta.env.VITE_SERVER_URL;
  const { showToast } = useToast();
  const [options, setOptions] = useState([]);
  const [selectedSubDesign, setSelectedSubDesign] = useState('');

  const [open, setOpen] = useState(false);
  const [modelData, setModelData] = useState(null);
  const [previewTexture, setPreviewTexture] = useState(false);

  const [form, setForm] = useState({
    modelFile: null,
    mainTexture: null,
    seamlessTexture: '',
    modelFileName: null,
    mainTextureFileName: null,
    mainTextureFilePath: null
  });

  const seamlessTextures = [
    { id: 'oak', name: 'Oak' },
    { id: 'walnut', name: 'Walnut' },
    { id: 'teak', name: 'Teak' }
  ];

  useEffect(() => {
    getModels();
  }, []);

  useEffect(() => {
    if (options.length > 0 && !selectedSubDesign) {
      setSelectedSubDesign(options[0]?.subDesignId?.subDesignValue);
    }
  }, [options]);

  const getModels = async () => {
    try {
      const response = await getDoorModels();
      const responseData = response?.data;
      if (responseData?.success) {
        setOptions(responseData?.data);
      }
    } catch (error) {
      console.error(error);
    }
  };

  const subDesignOptions = [
    ...new Map(
      options.map((item) => [
        item.subDesignId?.subDesignValue,
        {
          label: item.subDesignId?.subDesignName,
          value: item.subDesignId?.subDesignValue
        }
      ])
    ).values()
  ];

  const filteredOptions = options.filter((item) => item.subDesignId?.subDesignValue === selectedSubDesign);

  const saveModel = async (flag, opt, updateId) => {
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

  const uploadModel = async () => {
    if (modelData && (form?.modelFile || form?.mainTexture) && ( form?.modelFileName && form?.mainTextureFileName)) {
      try {
        const formData = new FormData();
        formData.append('modelFile', form?.modelFile);
        formData.append('mainTexture', form?.mainTexture);
        formData.append('subDesignValue', modelData?.subDesignId?.subDesignValue);
        formData.append('modelValue', modelData?.modelValue);
        formData.append('seamlessTexture', '');

        const response = await updateDoorModel(modelData?._id, formData);
        if (response?.data?.success) {
          console.log('data:=', response);

          setOptions((prev) =>
            prev.map((item) =>
              item._id === response.data.data._id
                ? {
                    ...item,
                    modelPath: response.data.data.modelPath,
                    modelFileName: response.data.data.modelFileName,
                    modelMainTextureFileName: response.data.data.modelMainTextureFileName,
                    modelMainTexturePath: response.data.data.modelMainTexturePath
                  }
                : item
            )
          );

          setForm({
            ...form,
            modelFileName: response.data.data?.modelFileName,
            mainTextureFileName: response.data.data?.modelMainTextureFileName,
            mainTextureFilePath: response.data.data?.modelMainTexturePath
          });
          showToast('Door Model option updated successfully', 'success');
        } else {
          showToast('Door Model option not updated', 'error');
        }
      } catch (error) {
        console.error(error);
        showToast('Something went wrong', 'error');
      }
    }else{
      showToast('Please upload the file', 'error');
    }
  };

  const handleEdit = (id, editing) => {
    const item = options.find((x) => x._id === id);
    if (editing) {
      saveModel(true, item, id);
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
          saveModel(true, updated, id);
          return updated;
        }
      })
    );
  };

  const openUploadDialog = (status, updateId) => {
    const filtered = options.filter((item) => item._id === updateId)?.[0];
    console.log(filtered);
    setModelData(filtered);
    setOpen(status);
    setForm({
      ...form,
      modelFileName: filtered?.modelFileName,
      mainTextureFileName: filtered?.modelMainTextureFileName,
      mainTextureFilePath: filtered?.modelMainTexturePath
    });
  };

  const uploadMainTexturefn = (e) => {
    setForm({
      ...form,
      mainTexture: e.target.files[0],
      mainTextureFileName: e.target.files[0]?.name
    });
    e.target.value = '';
  };

  const uploadModelfn = (e) => {
    setForm({
      ...form,
      modelFile: e.target.files[0],
      modelFileName: e.target.files[0]?.name
    });
    e.target.value = '';
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

      <div style={{ marginBottom: '20px' }}>
        <select
          value={selectedSubDesign}
          onChange={(e) => setSelectedSubDesign(e.target.value)}
          style={{
            padding: '8px 12px',
            width: '220px',
            borderRadius: '5px',
            border: '1px solid #ccc',
            borderColor: 'green'
          }}
        >
          {subDesignOptions.map((subDesign) => (
            <option key={subDesign?.value} value={subDesign?.value}>
              {subDesign?.label}
            </option>
          ))}
        </select>
      </div>

      <div
        style={{
          width: '1000px',
          minWidth: '1000px',
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
            fontSize: '16px'
          }}
        >
          Door Model Options
        </div>

        {filteredOptions.map((item) => (
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
                  {item.subDesignId?.subDesignName}
                </span>

                {item.editing ? (
                  <input
                    type="text"
                    value={item.modelName}
                    onChange={(e) => handleChange(item._id, e.target.value, 'data')}
                    style={{
                      padding: '6px 10px',
                      width: '200px'
                    }}
                  />
                ) : (
                  <span>{item.modelName}</span>
                )}

                <FormControlLabel control={<Checkbox />} label="Use Common Model" />

                <Button
                  variant="contained"
                  onClick={() => openUploadDialog(true, item._id)}
                  startIcon={<ViewInArIcon />}
                  endIcon={<CloudUploadIcon />}
                >
                  Upload 3D Model
                </Button>
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

      <Dialog open={open} onClose={() => setOpen(false)} maxWidth="md" fullWidth>
        <DialogTitle>Upload Door Model</DialogTitle>

        <DialogContent>
          <Grid container spacing={3} sx={{ mt: 1 }}>
            {/* Model File */}
            <Grid item xs={12}>
              <Button variant="outlined" component="label" fullWidth>
                Upload Model (.glb, .fbx, .obj)
                <input type="file" hidden accept=".glb" onChange={(e) => uploadModelfn(e)} />
              </Button>

              {<p>{form?.modelFileName || ''}</p>}
            </Grid>

            {/* <img src={`${SERVER_URL}/assets/doors/textures/elite/LE_1/1783154572017.jpeg`}/> */}

            {/* Main Texture */}
            <Grid item xs={12}>
              <Button variant="outlined" component="label" fullWidth>
                Upload Main Texture
                <input type="file" hidden accept="image/*" onChange={(e) => uploadMainTexturefn(e)} />
              </Button>

              {<p>{form?.mainTextureFileName || ''}</p>}

              <IconButton onClick={() => setPreviewTexture(!previewTexture)}>
                <VisibilityIcon />
              </IconButton>
            </Grid>

            {/* Seamless Texture Dropdown */}
            <Grid item xs={12}>
              <TextField
                select
                fullWidth
                label="Seamless Texture"
                value={form.seamlessTexture}
                onChange={(e) =>
                  setForm({
                    ...form,
                    seamlessTexture: e.target.value
                  })
                }
              >
                {seamlessTextures.map((item) => (
                  <MenuItem key={item.id} value={item.id}>
                    {item.name}
                  </MenuItem>
                ))}
              </TextField>
            </Grid>
          </Grid>
          {previewTexture && (
            <Box
              sx={{
                width: 120,
                height: 120,
                borderRadius: '50%',
                overflow: 'hidden',
                border: '2px solid #ddd'
              }}
            >
              <img
                src={`${SERVER_URL}/${form?.mainTextureFilePath}`}
                alt="Texture"
                style={{
                  width: '100%',
                  height: '100%',
                  objectFit: 'cover'
                }}
              />
            </Box>
          )}
        </DialogContent>

        <DialogActions>
          <Button onClick={() => setOpen(false)}>Cancel</Button>

          <Button variant="contained" onClick={() => uploadModel()}>
            Save
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
};

export default DoorModel;
