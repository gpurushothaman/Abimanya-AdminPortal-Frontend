import React, { useState, useEffect } from 'react';
import Zoom from 'react-medium-image-zoom';
import 'react-medium-image-zoom/dist/styles.css';
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
  CardContent,
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
  Chip,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  List,
  ListItem,
  Radio,
  InputAdornment,
  Autocomplete,
  CardActionArea,
  CardMedia
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
import { getDoorSeamlessTexture } from '../../services/doorSeamlessTextureService';
import { getDoorDesigns } from '../../services/doorDesignService';

const DoorModel = () => {
  const SERVER_URL = import.meta.env.VITE_SERVER_URL;
  const { showToast } = useToast();
  const [options, setOptions] = useState([]);
  const [shadesList, setShadesList] = useState([]);
  const [selectedSubDesign, setSelectedSubDesign] = useState('');
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [shadeData, setShadeData] = useState(null);
  const [doorDesigns, setDoorDesigns] = useState([]);
  const [seamlessTextures, setSeamlessTextures] = useState([]);
  const [searchTexture, setSearchTexture] = useState('');


  const [open, setOpen] = useState(false);
  const [modelData, setModelData] = useState(null);
  const [previewTexture, setPreviewTexture] = useState(false);

  const [shadesOpen, setShadesOpen] = useState(false);
  // thiyagu
  const [editingShade, setEditingShade] = useState(null);

  const [form, setForm] = useState({
    modelFile: null,
    mainTexture: null,
    seamlessTextureId: null,
    modelFileName: null,
    mainTextureFileName: null,
    mainTextureFilePath: null
  });

  // Thiagyaguu
  const [shadeForm, setShadeForm] = useState({
    shadeFile: null,
    texturePath: null,
    textureFileName: null,
    shadeName: '',
    seamlessTextureId: null,

    thickness: {
      32: '',
      35: '',
      38: '',
      40: '',
      45: '',
      50: ''
    },

    status: true
  });


  // Thiyaguuuuu ---> 
  const [doorThicknessBasedCost, setDoorThicknessBasedCost] = useState({
    32: '',
    35: '',
    38: '',
    40: '',
    45: '',
    50: ''
  });

  useEffect(() => {
    getModels();
    getShades();
    getSeamlessTextures();
    getAllDoorDesigns();
  }, []);

  useEffect(() => {
    if (options.length > 0 && !selectedSubDesign) {
      setSelectedSubDesign(options[0]?.subDesignId?.subDesignValue);
    }
  }, [options]);

  const getAllDoorDesigns = async () => {
    try {
      const response = await getDoorDesigns();
      if (response?.data?.success) {
        setDoorDesigns(response?.data?.data);
      }
    } catch (error) {
      console.error(error);
    }
  };

  const getSeamlessTextures = async () => {
    try {
      const response = await getDoorSeamlessTexture();
      const responseData = response?.data;
      if (responseData?.success) {
        setSeamlessTextures(responseData?.data);
      }
    } catch (error) {
      console.error(error);
    }
  };

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
  // Thiyaguuuu --------------------------->>>>>>>>>>>>>>>>>>>>>>>>>>>>>>
  const subDesignOptions = options
    .filter((item) => item.subDesignId?.subDesignValue)
    .reduce((acc, item) => {
      const value = item.subDesignId.subDesignValue;

      if (!acc.some((x) => x.value === value)) {
        acc.push({
          label: item.subDesignId.subDesignName,
          value: value
        });
      }

      return acc;
    }, []);

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
                                                      // thiyaguu    ------------------>>>>>>>>>>>>>>>
  const handleEditShade = (shade) => {
  setEditingShade(shade);
  setShadeForm({
    shadeFile: null,
    // Existing image
    texturePath: shade?.texturePath || '',
    textureFileName: shade?.textureFileName || '',
    // Existing name
    shadeName: shade?.shadeName || '',
    // Existing seamless texture
    seamlessTextureId: shade?.seamlessTextureId || '',
    // Existing costs
    thickness: {
      32: shade?.doorThicknessBasedCost?.['32'] ?? '',
      35: shade?.doorThicknessBasedCost?.['35'] ?? '',
      38: shade?.doorThicknessBasedCost?.['38'] ?? '',
      40: shade?.doorThicknessBasedCost?.['40'] ?? '',
      45: shade?.doorThicknessBasedCost?.['45'] ?? '',
      50: shade?.doorThicknessBasedCost?.['50'] ?? ''
    },
    // Existing status
    status: shade?.status ?? true
  });
};

  const createShade = async () => {
    if (modelData && shadeForm?.shadeFile && shadeForm?.shadeName && shadeForm?.seamlessTextureId) {
      try {
        const formData = new FormData();
        formData.append('shadeName', shadeForm?.shadeName);
        formData.append('shadeTexture', shadeForm?.shadeFile);
        formData.append('subDesignValue', modelData?.subDesignId?.subDesignValue);
        formData.append('modelValue', modelData?.modelValue);
        formData.append('seamlessTextureId', shadeForm?.seamlessTextureId);
        formData.append('modelId', modelData?._id);
        formData.append('doorThicknessBasedCost', JSON.stringify(shadeForm.thickness));

        const response = await createDoorShade(formData);
        if (response?.data?.success) {
          //                   Thiyaguuuuuu    ---------------->>>>>>>>>>>>>>
          setShadeForm({
            shadeFile: null,
            texturePath: null,
            textureFileName: null,
            shadeName: '',
            seamlessTextureId: null,

            thickness: {
              32: '',
              35: '',
              38: '',
              40: '',
              45: '',
              50: ''
            },

            status: true
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

                                              // THiayguuuuuu  ------------------>>>>>>>>>>>
  const updateShadeDetails = async () => {
  if (!editingShade?._id) {
    showToast('Shade not selected', 'error');
    return;
  }

  try {
    const formData = new FormData();

    // Shade Name
    formData.append('shadeName', shadeForm.shadeName);

    // Thickness Costs
    formData.append(
      'doorThicknessBasedCost',
      JSON.stringify(shadeForm.thickness)
    );

    // Seamless Texture
    formData.append(
      'seamlessTextureId',
      shadeForm.seamlessTextureId || ''
    );

    // Status
    formData.append(
      'status',
      String(shadeForm.status)
    );

    // New Image - only if user selected a new image
    if (shadeForm.shadeFile) {
      formData.append(
        'shadeTexture',
        shadeForm.shadeFile
      );
    }

    // Required for backend image folder
    formData.append(
      'subDesignValue',
      editingShade?.modelId?.subDesignId?.subDesignValue ||
        editingShade?.modelId?.subDesignValue ||
        modelData?.subDesignId?.subDesignValue ||
        ''
    );

    formData.append(
      'modelValue',
      editingShade?.modelId?.modelValue ||
        modelData?.modelValue ||
        ''
    );

    const response = await updateDoorShade(
      editingShade._id,
      formData
    );

    if (response?.data?.success) {
      showToast('Door shade updated successfully', 'success');

      // Refresh shades
      await getShades();

      // Exit edit mode
      setEditingShade(null);

      // Reset form
      setShadeForm({
        shadeFile: null,
        texturePath: null,
        textureFileName: null,
        shadeName: '',
        seamlessTextureId: null,

        thickness: {
          32: '',
          35: '',
          38: '',
          40: '',
          45: '',
          50: ''
        },

        status: true
      });
    } else {
      showToast('Door shade not updated', 'error');
    }
  } catch (error) {
    console.error(
      'UPDATE SHADE ERROR:',
      error?.response?.data || error
    );

    showToast(
      error?.response?.data?.message ||
        'Something went wrong',
      'error'
    );
  }
};

  const uploadModel = async () => {
    if (modelData && form?.modelFileName && form?.mainTextureFileName) {
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
        formData.append('modelSeamlessTextureID', form?.seamlessTextureId);

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
                  modelMainTexturePath: response.data.data.modelMainTexturePath,
                  modelSeamlessTextureID: response.data.data.modelSeamlessTextureID
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
            mainTextureFilePath: response.data.data?.modelMainTexturePath,
            seamlessTextureId: response.data.data.modelSeamlessTextureID
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
    setModelData(filtered);
    setOpen(status);
    setForm({
      ...form,
      modelFileName: filtered?.modelFileName,
      mainTextureFileName: filtered?.modelMainTextureFileName,
      mainTextureFilePath: filtered?.modelMainTexturePath,
      seamlessTextureId: filtered?.modelSeamlessTextureID
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

  const chooseSeamlesstexturefn = (textureID, type) => {
    if (type === 'model') {
      setForm({
        ...form,
        seamlessTextureId: textureID
      });
    } else if (type === 'shades') {
      setShadeForm({
        ...shadeForm,
        seamlessTextureId: textureID
      });
    }
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

  const filteredSeamlessTextures = seamlessTextures.filter((texture) => {
    return !searchTexture || texture.designRefId?._id === searchTexture;
  });

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

                  <Box>
                    <Typography variant="subtitle2" sx={{ color: 'text.secondary', mb: 1 }}>
                      Select Door Design
                    </Typography>

                    <FormControl size="small" sx={{ minWidth: 260 }}>
                      <InputLabel>Design</InputLabel>
                      <Select label="Design" value={searchTexture || ''} onChange={(e) => setSearchTexture(e.target.value)}>
                        {doorDesigns.map((design) => (
                          <MenuItem key={design._id} value={design._id}>
                            {design.designName}
                          </MenuItem>
                        ))}
                      </Select>
                    </FormControl>
                  </Box>

                  <List sx={{ width: 400 }}>
                    {filteredSeamlessTextures.map((item) => (
                      <ListItem
                        key={item._id}
                        // onClick={() => setSelected(item.id)}
                        sx={{
                          height: 80,
                          border: '1px solid #ddd',
                          borderRadius: 1,
                          mb: 1,
                          display: 'flex',
                          alignItems: 'center',
                          cursor: 'pointer'
                        }}
                      >
                        <Zoom>
                          <Box
                            component="img"
                            src={`${SERVER_URL}/${item.texturePath}`}
                            alt={item.textureName}
                            sx={{
                              width: 60,
                              height: 60,
                              borderRadius: 1,
                              objectFit: 'cover',
                              mr: 2
                            }}
                          />
                        </Zoom>

                        <Typography sx={{ flex: 1 }}>{item.textureName}</Typography>

                        <Radio
                          checked={form?.seamlessTextureId === item._id}
                          onChange={(e) => chooseSeamlesstexturefn(item._id, 'model')}
                        />
                      </ListItem>
                    ))}
                  </List>
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

          <Card sx={{ p: 3, mx: 'auto' }}>
            <Typography variant="h6" gutterBottom>
              Create Shade
            </Typography>

            <Stack spacing={3}>
              {/* Shade Name */}
              <TextField
                fullWidth
                label="Shade Name"
                placeholder="Enter shade name"
                value={shadeForm?.shadeName || ''}
                onChange={(e) =>
                  setShadeForm({
                    ...shadeForm,
                    shadeName: e.target.value
                  })
                }
              />

              {/* Upload */}
              <Box>
                <Typography variant="subtitle2" sx={{ mb: 1 }}>
                  Texture Image
                </Typography>

                <Button component="label" variant="outlined" fullWidth>
                  Upload Image
                  <input hidden type="file" accept="image/*" onChange={uploadShadeTexturefn} />
                </Button>

                {/* Thiyaguuuu ----------------------->>>>>>>>>>>>> */}
                <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
                  {shadeForm?.textureFileName ||
                    (editingShade?.texturePath
                      ? 'Existing texture image'
                      : 'No texture selected')}
                </Typography>

                {editingShade && shadeForm?.texturePath && (
                  <Box
                    component="img"
                    src={`${SERVER_URL}/${shadeForm.texturePath}`}
                    alt="Current Shade Texture"
                    sx={{
                      width: 120,
                      height: 120,
                      objectFit: 'cover',
                      borderRadius: 2,
                      mt: 2,
                      border: '1px solid #ddd'
                    }}
                  />
                )}


              </Box>

              <Card elevation={2} sx={{ mt: 2 }}>
                <CardContent>
                  <Typography variant="h6" gutterBottom>
                    Door Thickness Cost
                  </Typography>

                  <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
                    Set the additional cost for each door thickness.
                  </Typography>

                  {/* thiyguuu   ------------------->>>>>>>>>> */}
                  <Grid container spacing={2}>
                    {console.log('THICKNESS DATA:', shadeForm?.thickness)}
                    {Object.entries(shadeForm?.thickness || {}).map(([thickness, cost]) => (
                      <Grid size={{ xs: 12, sm: 6, md: 4 }} key={thickness}>
                        <TextField
                          fullWidth
                          type="number"
                          label={`${thickness} mm Cost`}
                          value={cost}
                          onChange={(e) =>
                            setShadeForm((prev) => ({
                              ...prev,
                              thickness: {
                                ...prev.thickness,
                                [thickness]: Number(e.target.value)
                              }
                            }))
                          }
                          // thiyagu ---------------->
                          slotProps={{
                            input: {
                              startAdornment: (
                                <InputAdornment position="start">
                                  ₹
                                </InputAdornment>
                              )
                            }
                          }}
                        />
                      </Grid>
                    ))}
                  </Grid>
                </CardContent>
              </Card>

              <Card elevation={2} sx={{ p: 3 }}>
                <Typography variant="h6" gutterBottom>
                  Select seamless texture
                </Typography>

                <Autocomplete
                  options={doorDesigns}
                  getOptionLabel={(option) => option.designName}
                  value={doorDesigns.find((d) => d._id === searchTexture) || null}
                  onChange={(_, value) => setSearchTexture(value?._id || '')}
                  renderInput={(params) => <TextField {...params} label="Search Design" size="small" />}
                  sx={{
                    mb: 3,
                    maxWidth: 400
                  }}
                />

                <Box
                  sx={{
                    maxHeight: 450,
                    overflowY: 'auto',
                    pr: 1,

                    '&::-webkit-scrollbar': {
                      width: 6
                    },
                    '&::-webkit-scrollbar-thumb': {
                      backgroundColor: '#bbb',
                      borderRadius: 10
                    }
                  }}
                >
                  <Grid container spacing={1.5}>
                    {filteredSeamlessTextures.map((item) => {
                      const selected = shadeForm?.seamlessTextureId === item._id;

                      return (
                        <Grid size={{ xs: 12, sm: 6 }} key={item._id}>
                          <Box
                            onClick={() => chooseSeamlesstexturefn(item._id, 'shades')}
                            sx={{
                              display: 'flex',
                              alignItems: 'center',
                              p: 1,
                              cursor: 'pointer',
                              borderRadius: 2,

                              border: selected ? '2px solid #1976d2' : '1px solid #ddd',

                              bgcolor: selected ? 'rgba(25,118,210,.08)' : 'white',

                              '&:hover': {
                                bgcolor: '#f5f5f5'
                              }
                            }}
                          >
                            {/* LEFT RADIO */}
                            <Radio checked={selected} size="small" sx={{ p: 0.5 }} />

                            {/* IMAGE */}
                            <Box
                              onClick={(e) => e.stopPropagation()}
                              sx={{
                                ml: 1,
                                mr: 1.5
                              }}
                            >
                              <Zoom>
                                <Box
                                  component="img"
                                  src={`${SERVER_URL}/${item.texturePath}`}
                                  alt={item.textureName}
                                  sx={{
                                    width: 55,
                                    height: 55,
                                    borderRadius: 1,
                                    objectFit: 'cover',
                                    cursor: 'zoom-in'
                                  }}
                                />
                              </Zoom>
                            </Box>

                            {/* NAME */}
                            <Typography
                              variant="body2"
                              fontWeight={600}
                              noWrap
                              sx={{
                                flex: 1
                              }}
                            >
                              {item.textureName}
                            </Typography>
                          </Box>
                        </Grid>
                      );
                    })}
                  </Grid>
                </Box>
              </Card>
              {/* thiyaguuu */}
              <FormControlLabel
                control={
                  <Switch
                    checked={shadeForm.status}
                    onChange={(e) =>
                      setShadeForm((prev) => ({
                        ...prev,
                        status: e.target.checked
                      }))
                    }
                    color="success"
                  />
                }
                label={shadeForm.status ? 'Active' : 'Inactive'}
              />




              <Button
                variant="contained"
                size="large"
                fullWidth
                onClick={editingShade ? updateShadeDetails : createShade}
              >
                {editingShade ? 'Update Shade' : 'Save Shade'}
              </Button>
            </Stack>
          </Card>

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

                        <Typography fontWeight={600}>
                          {shade.shadeName}
                        </Typography>
                      </TableCell>

                      <TableCell>
                       <Stack direction="row" spacing={2}>
                          <Switch checked={shade.status} onChange={(e) => updateShade(shade._id, e.target.checked, 'status')} />

                          <Chip size="small" label={shade.status ? 'Active' : 'Inactive'} color={shade.status ? 'success' : 'default'} />
                        </Stack>
                      </TableCell>

                      <TableCell align="center">
                        {/* Thiyaguuuu            ------------->>>>>>>> */}
                        <Tooltip title="Edit">
                          <IconButton
                            color="primary"
                            onClick={() => handleEditShade(shade)}
                          >
                            <EditIcon />
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
