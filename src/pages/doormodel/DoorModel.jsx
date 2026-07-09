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
  Card,
  Box,
  Typography,
  Tooltip,
  TextField,
  Divider,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Avatar,
  DialogContentText,
  CardHeader,
  Chip
} from '@mui/material';
import ViewInArIcon from '@mui/icons-material/ViewInAr';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import IconButton from '@mui/material/IconButton';
import UploadFileIcon from '@mui/icons-material/UploadFile';
import ImageIcon from '@mui/icons-material/Image';
import VisibilityIcon from '@mui/icons-material/Visibility';
import CloseIcon from '@mui/icons-material/Close';
import DeleteOutlineIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import CheckIcon from '@mui/icons-material/Check';

//Toast
import { useToast } from '../../contexts/ToastContext';
//api
import { getDoorShades, createDoorShade, deleteDoorShade, updateDoorShade } from '../../services/doorShadeService';
import { getDoorModels, updateDoorModel } from '../../services/doorModelService';

const DoorModel = () => {
  const SERVER_URL = import.meta.env.VITE_SERVER_URL;
  const { showToast } = useToast();
  const [options, setOptions] = useState([]);
  const [shadesList, setShadesList] = useState([]);
  const [selectedSubDesign, setSelectedSubDesign] = useState('');
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [shadeData, setShadeData] = useState(null);

  const [open, setOpen] = useState(false);
  const [modelData, setModelData] = useState(null);
  const [previewTexture, setPreviewTexture] = useState(false);

  const [shadesOpen, setShadesOpen] = useState(false);

  const [form, setForm] = useState({
    modelFile: null,
    mainTexture: null,
    seamlessTexture: '',
    modelFileName: null,
    mainTextureFileName: null,
    mainTextureFilePath: null
  });

  const [shadeForm, setShadeForm] = useState({
    shadeFile: null,
    texturePath: null,
    textureFileName: null,
    shadeName: null
  });

  useEffect(() => {
    getModels();
    getShades();
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

  const getShades = async () => {
    try {
      const response = await getDoorShades();
      const responseData = response?.data;
      if (responseData?.success) {
        setShadesList(responseData?.data);
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

  const saveShade = async (shadeID, updatedShade) => {
    try {
      const response = await updateDoorShade(shadeID, updatedShade);

      if (response?.data?.success) {
        showToast('Door shade updated successfully', 'success');
      } else {
        showToast('Door shade not updated', 'error');
      }
    } catch (error) {
      console.error(error);
      showToast('Something went wrong', 'error');
    }
  };

  const updateShade = async (shadeID, value, control) => {
    const shade = shadesList.filter((shade) => shade._id === shadeID)?.[0];

    if (!shade) return;

    const updatedShade = {
      ...shade,
      [control]: value
    };
    setShadesList((prev) => prev.map((shade) => (shade._id === shadeID ? updatedShade : shade)));

    if (control === 'status') {
      saveShade(shadeID, updatedShade);
    }
  };

  const handleEditShade = (id, flag) => {
    setShadesList(shadesList.map((shade) => (shade._id === id ? { ...shade, editing: !shade?.editing } : shade)));

    const result = shadesList.filter((shade) => shade._id === id)?.[0];
    if (flag) {
      saveShade(id, result);
    }
  };

  const createShade = async () => {
    if (modelData && shadeForm?.shadeFile && shadeForm?.shadeName) {
      try {
        const formData = new FormData();
        formData.append('shadeName', shadeForm?.shadeName);
        formData.append('shadeTexture', shadeForm?.shadeFile);
        formData.append('subDesignValue', modelData?.subDesignId?.subDesignValue);
        formData.append('modelValue', modelData?.modelValue);
        formData.append('seamlessTextureID', '');
        formData.append('modelId', modelData?._id);

        const response = await createDoorShade(formData);
        if (response?.data?.success) {
          setShadeForm({
            ...form,
            shadeFile: null,
            texturePath: null,
            textureFileName: null,
            shadeName: null
          });

          setShadesList((prev) => [...prev, response.data.data]);

          showToast('Door shade created successfully', 'success');
        } else {
          showToast('Door shade not created', 'error');
        }
      } catch (error) {
        console.error(error);
        showToast('Something went wrong', 'error');
      }
    } else {
      showToast('Please fill all values in the form', 'error');
    }
  };

  const uploadModel = async () => {
    if (modelData && (form?.modelFile || form?.mainTexture) && form?.modelFileName && form?.mainTextureFileName) {
      try {
        const formData = new FormData();
        if (form?.modelFile) {
          formData.append('modelFile', form?.modelFile);
        }
        if (form?.mainTexture) {
          formData.append('mainTexture', form?.mainTexture);
        }
        formData.append('subDesignValue', modelData?.subDesignId?.subDesignValue);
        formData.append('modelValue', modelData?.modelValue);
        formData.append('modelSeamlessTextureID', '');

        const response = await updateDoorModel(modelData?._id, formData);
        if (response?.data?.success) {
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
            modelFile: null,
            mainTexture: null,
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
    } else {
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

  const uploadShadeTexturefn = (e) => {
    setShadeForm({
      ...shadeForm,
      shadeFile: e.target.files[0],
      textureFileName: e.target.files[0]?.name
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

  const openShadesDialog = (status, updateId) => {
    const filtered = options.filter((item) => item._id === updateId)?.[0];
    setModelData(filtered);
    setShadesOpen(status);
  };

  const handleDeleteShade = (shadeID) => {
    const filtered = shadesList.filter((shade) => shade._id === shadeID)?.[0];
    setShadeData(filtered);
    setDeleteOpen(true);
  };

  const shadeConformDelete = async () => {
    try {
      const { data } = await deleteDoorShade(shadeData?._id, modelData?.subDesignId?.subDesignValue, modelData?.modelValue);
      if (data.success) {
        setShadesList(shadesList.filter((shade) => shade._id !== shadeData?._id));

        showToast('Door shade deleted successfully', 'success');
        setDeleteOpen(false);
      } else {
        showToast('Door shade not delete', 'error');
      }
    } catch (error) {
      console.error(error);
      showToast('Something went wrong', 'error');
    }
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

                <Button
                  variant="contained"
                  onClick={() => openShadesDialog(true, item._id)}
                  startIcon={<ViewInArIcon />}
                  endIcon={<CloudUploadIcon />}
                >
                  Upload Shades
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

      {/*Door models - upload dialog*/}

      <Dialog open={open} onClose={() => setOpen(false)} maxWidth="sm" fullWidth>
        <DialogTitle>Upload Door Model</DialogTitle>

        <DialogContent>
          <Card elevation={3} sx={{ p: 3, borderRadius: 3 }}>
            <Typography variant="h6" gutterBottom>
              Upload Assets
            </Typography>

            <Grid container spacing={3}>
              {/* Model Upload */}
              <Grid size={{ xs: 12 }}>
                <Stack spacing={1}>
                  <Button variant="contained" component="label" startIcon={<UploadFileIcon />}>
                    Upload Model (.glb)
                    <input hidden type="file" accept=".glb" onChange={uploadModelfn} />
                  </Button>

                  <Typography variant="body2" color="text.secondary">
                    {form?.modelFileName || 'No model selected'}
                  </Typography>
                </Stack>
              </Grid>

              {/* Texture Upload */}
              <Grid size={{ xs: 12 }}>
                <Stack spacing={2}>
                  <Button variant="contained" component="label" startIcon={<ImageIcon />}>
                    Upload Main Texture
                    <input hidden type="file" accept="image/*" onChange={uploadMainTexturefn} />
                  </Button>

                  <Stack direction="row" spacing={2} alignItems="center" justifyContent="space-between">
                    <Typography
                      variant="body2"
                      color="text.secondary"
                      sx={{
                        flex: 1,
                        overflow: 'hidden',
                        textOverflow: 'ellipsis',
                        whiteSpace: 'nowrap'
                      }}
                    >
                      {form?.mainTextureFileName || 'No texture selected'}
                    </Typography>

                    {form?.mainTextureFilePath && (
                      <Tooltip title={previewTexture ? 'Hide Preview' : 'Show Preview'}>
                        <IconButton onClick={() => setPreviewTexture((prev) => !prev)}>
                          <VisibilityIcon />
                        </IconButton>
                      </Tooltip>
                    )}
                  </Stack>

                  {previewTexture && form?.mainTextureFilePath && (
                    <Box
                      sx={{
                        width: 180,
                        height: 180,
                        borderRadius: 2,
                        overflow: 'hidden',
                        border: '1px solid',
                        borderColor: 'divider',
                        boxShadow: 2,
                        mx: 'auto'
                      }}
                    >
                      <Box
                        component="img"
                        src={`${SERVER_URL}/${form.mainTextureFilePath}`}
                        alt="Texture Preview"
                        sx={{
                          width: '100%',
                          height: '100%',
                          objectFit: 'cover'
                        }}
                      />
                    </Box>
                  )}
                </Stack>
              </Grid>
            </Grid>
          </Card>
        </DialogContent>

        <DialogActions>
          <Button onClick={() => setOpen(false)}>Cancel</Button>

          <Button variant="contained" onClick={() => uploadModel()}>
            Save
          </Button>
        </DialogActions>
      </Dialog>

      {/*Manage shades - upload dialog*/}

      <Dialog open={shadesOpen} maxWidth="sm" fullWidth>
        <DialogTitle sx={{ m: 0, p: 2 }}>
          Manage Shades
          <IconButton
            aria-label="close"
            onClick={() => setShadesOpen(false)}
            sx={{
              position: 'absolute',
              right: 8,
              top: 8,
              color: (theme) => theme.palette.grey[500]
            }}
          >
            <CloseIcon />
          </IconButton>
        </DialogTitle>

        <DialogContent>
          {/* Add Shade */}

          <Stack spacing={2} sx={{ mt: 1 }}>
            <TextField
              label="Shade Name"
              value={shadeForm?.shadeName || ''}
              fullWidth
              onChange={(e) => {
                setShadeForm({
                  ...shadeForm,
                  shadeName: e.target.value
                });
              }}
            />

            <Stack direction="row" spacing={2}>
              <Button component="label" variant="outlined">
                Upload Image
                <input hidden type="file" accept="image/*" onChange={uploadShadeTexturefn} />
              </Button>
              {shadeForm?.textureFileName || 'No texture selected'}

              <Button variant="contained" onClick={() => createShade()}>
                Save
              </Button>
            </Stack>
          </Stack>

          <Divider sx={{ my: 3 }} />

          <Typography variant="h6" gutterBottom>
            Existing Shades
          </Typography>

          <Card elevation={3} sx={{ borderRadius: 3 }}>
            <CardHeader
              title="Door Shades"
              subheader={`${shadesList.length} Shades`}
              sx={{
                bgcolor: 'primary.main',
                color: 'white',
                '& .MuiCardHeader-subheader': {
                  color: 'rgba(255,255,255,0.7)'
                }
              }}
            />

            <TableContainer>
              <Table>
                <TableHead>
                  <TableRow
                    sx={{
                      bgcolor: 'grey.100',
                      '& th': {
                        fontWeight: 700,
                        fontSize: 15
                      }
                    }}
                  >
                    <TableCell>Image</TableCell>
                    <TableCell>Shade Name</TableCell>
                    <TableCell>Status</TableCell>
                    <TableCell align="center">Actions</TableCell>
                  </TableRow>
                </TableHead>

                <TableBody>
                  {shadesList.map((shade) => (
                    <TableRow
                      key={shade._id}
                      hover
                      sx={{
                        transition: '0.2s',
                        '&:hover': {
                          bgcolor: 'action.hover'
                        }
                      }}
                    >
                      <TableCell>
                        <Avatar
                          variant="rounded"
                          src={`${SERVER_URL}/${shade.texturePath}`}
                          sx={{
                            width: 65,
                            height: 65,
                            borderRadius: 2
                          }}
                        />
                      </TableCell>

                      <TableCell>
                        {shade.editing ? (
                          <TextField
                            size="small"
                            fullWidth
                            value={shade.shadeName}
                            onChange={(e) => updateShade(shade._id, e.target.value, 'shadeName')}
                          />
                        ) : (
                          <Typography fontWeight={600}>{shade.shadeName}</Typography>
                        )}
                      </TableCell>

                      <TableCell>
                        <Stack direction="row" spacing={2} alignItems="center">
                          <Switch checked={shade.status} onChange={(e) => updateShade(shade._id, e.target.checked, 'status')} />

                          <Chip size="small" label={shade.status ? 'Active' : 'Inactive'} color={shade.status ? 'success' : 'default'} />
                        </Stack>
                      </TableCell>

                      <TableCell align="center">
                        <Tooltip title={shade.editing ? 'Save' : 'Edit'}>
                          <IconButton
                            color={shade.editing ? 'success' : 'primary'}
                            onClick={() => handleEditShade(shade._id, shade.editing)}
                          >
                            {shade.editing ? <CheckIcon /> : <EditIcon />}
                          </IconButton>
                        </Tooltip>

                        <Tooltip title="Delete">
                          <IconButton color="error" onClick={() => handleDeleteShade(shade._id)}>
                            <DeleteOutlineIcon />
                          </IconButton>
                        </Tooltip>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          </Card>
        </DialogContent>
      </Dialog>

      <Dialog open={deleteOpen} onClose={() => setDeleteOpen(false)}>
        <DialogTitle>Delete Shade</DialogTitle>

        <DialogContent>
          <DialogContentText>Are you sure you want to delete this shade?</DialogContentText>
        </DialogContent>

        <DialogActions>
          <Button onClick={() => setDeleteOpen(false)}>Cancel</Button>

          <Button color="error" variant="contained" onClick={() => shadeConformDelete()}>
            Delete
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
};

export default DoorModel;
