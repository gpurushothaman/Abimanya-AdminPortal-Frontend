import axios from 'axios';
import { useState, useEffect } from 'react';
import {
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
  Avatar,
  DialogContentText,
  FormControl,
  InputLabel,
  Select,
  MenuItem
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import IconButton from '@mui/material/IconButton';

import ImageIcon from '@mui/icons-material/Image';

import DeleteOutlineIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import CheckIcon from '@mui/icons-material/Check';
//Toast
import { useToast } from '../../contexts/ToastContext';
//api
import {
  getDoorSeamlessTexture,
  createDoorSeamlessTexture,
  deleteDoorSeamlessTexture,
  updateDoorSeamlessTexture
} from '../../services/doorSeamlessTextureService';

import { getDoorDesigns } from '../../services/doorDesignService';

export default function DoorSeamlessTexture() {
  const SERVER_URL = import.meta.env.VITE_SERVER_URL;
  const { showToast } = useToast();

  const [searchTerm, setSearchTerm] = useState('');

  const [seamlessTextureForm, setSeamlessTextureForm] = useState({
    seamlessTexture: null,
    texturePath: null,
    textureFileName: null,
    textureName: null,
    designId: null,
    designValue: null,
    previewTexture: null
  });
  const [open, setOpen] = useState(false);
  const [doorDesigns, setDoorDesigns] = useState([]);
  const [seamlessTextureList, setSeamlessTextureList] = useState([]);
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [textureData, setTextureData] = useState(null);

  useEffect(() => {
    getAllDoorDesigns();
    getAllSeamlessTexture();
  }, []);

  const getAllSeamlessTexture = async () => {
    try {
      const response = await getDoorSeamlessTexture();
      if (response?.data?.success) {
        setSeamlessTextureList(response?.data?.data);
      }
    } catch (error) {
      console.error(error);
    }
  };

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

  const uploadTexturefn = (e) => {
    const file = e.target.files[0];

    if (!file) return;

    setSeamlessTextureForm({
      ...seamlessTextureForm,
      seamlessTexture: e.target.files[0],
      textureFileName: e.target.files[0]?.name,
      previewTexture: URL.createObjectURL(file)
    });
  };

  const saveTexture = async (textureID, updatedTexture) => {
    try {
      const response = await updateDoorSeamlessTexture(textureID, updatedTexture);

      if (response?.data?.success) {
        showToast('Door seamless texture updated successfully', 'success');
      } else {
        showToast('Door seamless texture not updated', 'error');
      }
    } catch (error) {
      console.error(error);
      showToast('Something went wrong', 'error');
    }
  };

  const updateTexture = async (textureID, value, control) => {
    const texture = seamlessTextureList.filter((texture) => texture._id === textureID)?.[0];

    if (!texture) return;

    const updatedTexture = {
      ...texture,
      [control]: value
    };
    setSeamlessTextureList((prev) => prev.map((texture) => (texture._id === textureID ? updatedTexture : texture)));

    if (control === 'status') {
      saveTexture(textureID, updatedTexture);
    }
  };

  const handleEditTexture = (id, flag) => {
    setSeamlessTextureList(
      seamlessTextureList.map((texture) => (texture._id === id ? { ...texture, editing: !texture?.editing } : texture))
    );

    const result = seamlessTextureList.filter((texture) => texture._id === id)?.[0];
    if (flag) {
      saveTexture(id, result);
    }
  };

  const createSeamlessTexture = async () => {
    if (seamlessTextureForm?.seamlessTexture && seamlessTextureForm?.textureName) {
      try {
        const formData = new FormData();
        formData.append('seamlessTexture', seamlessTextureForm?.seamlessTexture);
        formData.append('textureName', seamlessTextureForm?.textureName);
        formData.append('designRefId', seamlessTextureForm?.designId);
        formData.append('designValue', seamlessTextureForm?.designValue);
        formData.append('status', seamlessTextureForm?.status === 'active' ? true : false);

        const response = await createDoorSeamlessTexture(formData);
        if (response?.data?.success) {
          setSeamlessTextureForm({
            ...seamlessTextureForm,
            seamlessTexture: null,
            texturePath: null,
            textureFileName: null,
            textureName: null,
            previewTexture: null
          });

          setSeamlessTextureList((prev) => [...prev, response.data.data]);
          setOpen(false);

          showToast('Door seamless texture created successfully', 'success');
        } else {
          showToast('Door seamless texture not created', 'error');
        }
      } catch (error) {
        console.error(error);
        showToast('Something went wrong', 'error');
      }
    } else {
      showToast('Please fill all values in the form', 'error');
    }
  };

  const handleDeleteTexture = (textureID) => {
    const filtered = seamlessTextureList.filter((texture) => texture._id === textureID)?.[0];
    setTextureData(filtered);
    setDeleteOpen(true);
  };

  const textureConformDelete = async () => {
    try {
      const filtered = doorDesigns.filter((design) => design._id === textureData?.designRefId?._id)?.[0];

      const { data } = await deleteDoorSeamlessTexture(textureData?._id, filtered?.designValue);
      if (data.success) {
        setSeamlessTextureList(seamlessTextureList.filter((texture) => texture._id !== textureData?._id));

        showToast('Door seamless texture deleted successfully', 'success');
        setDeleteOpen(false);
      } else {
        showToast('Door seamless texture not delete', 'error');
      }
    } catch (error) {
      console.error(error);
      showToast('Something went wrong', 'error');
    }
  };

  const filteredTextures = seamlessTextureList.filter((texture) => {
    return !searchTerm || texture.designRefId?._id === searchTerm;
  });

  return (
    <div
      style={{
        padding: '20px',
        background: '#fff',
        borderRadius: '10px'
      }}
    >
      <h1>Door Seamless Texture - Management</h1>

      <Box
        sx={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          mb: 3,
          p: 2,
          backgroundColor: '#fff',
          borderRadius: 2,
          boxShadow: '0 2px 10px rgba(0,0,0,0.08)',
          border: '1px solid #e5e7eb'
        }}
      >
        <Box>
          <Typography variant="subtitle2" sx={{ color: 'text.secondary', mb: 1 }}>
            Select Door Design
          </Typography>

          <FormControl size="small" sx={{ minWidth: 260 }}>
            <InputLabel>Design</InputLabel>
            <Select label="Design" value={searchTerm || ''} onChange={(e) => setSearchTerm(e.target.value)}>
              {doorDesigns.map((design) => (
                <MenuItem key={design._id} value={design._id}>
                  {design.designName}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </Box>

        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={() => setOpen(true)}
          sx={{
            px: 3,
            py: 1,
            borderRadius: '10px',
            textTransform: 'none',
            fontWeight: 600,
            boxShadow: 'none',
            '&:hover': {
              boxShadow: '0 6px 18px rgba(25,118,210,0.25)'
            }
          }}
        >
          Add Item
        </Button>
      </Box>

      <table
        style={{
          width: '100%',
          borderCollapse: 'collapse'
        }}
      >
        <thead>
          <tr
            style={{
              background: '#ccfb96'
            }}
          >
            <th style={thStyle}>Image</th>
            <th style={thStyle}>Name</th>
            <th style={thStyle}>Status</th>
            <th style={thStyle}>Action</th>
          </tr>
        </thead>

        <tbody>
          {filteredTextures.length === 0 ? (
            <tr>
              <td
                colSpan="7"
                style={{
                  textAlign: 'center',
                  padding: '20px'
                }}
              >
                No Texture Found
              </td>
            </tr>
          ) : (
            filteredTextures.map((texture, index) => (
              <tr key={texture._id}>
                <td style={tdStyle}>
                  <Avatar src={`${SERVER_URL}/${texture.texturePath}`} alt={texture.textureName} sx={{ width: 40, height: 40 }} />
                </td>

                <td style={tdStyle}>
                  {texture.editing ? (
                    <TextField
                      size="small"
                      fullWidth
                      value={texture.textureName}
                      onChange={(e) => updateTexture(texture._id, e.target.value, 'textureName')}
                    />
                  ) : (
                    <Typography fontWeight={600}>{texture.textureName}</Typography>
                  )}
                </td>

                <td style={tdStyle}>
                  <FormControlLabel
                    control={
                      <Switch
                        checked={texture?.status}
                        onChange={(e) => updateTexture(texture._id, e.target.checked, 'status')}
                        color="success"
                      />
                    }
                    label={texture?.status ? 'Active' : 'Inactive'}
                  />
                </td>

                <td style={tdStyle}>
                  <Tooltip title={texture.editing ? 'Save' : 'Edit'}>
                    <IconButton
                      color={texture.editing ? 'success' : 'primary'}
                      onClick={() => handleEditTexture(texture._id, texture.editing)}
                    >
                      {texture.editing ? <CheckIcon /> : <EditIcon />}
                    </IconButton>
                  </Tooltip>

                  <Tooltip title="Delete">
                    <IconButton color="error" onClick={() => handleDeleteTexture(texture._id)}>
                      <DeleteOutlineIcon />
                    </IconButton>
                  </Tooltip>
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>

      {/*Door seamless texture - upload dialog*/}

      <Dialog open={open} onClose={() => setOpen(false)} maxWidth="sm" fullWidth>
        <DialogTitle>Upload Texture</DialogTitle>

        <DialogContent>
          <Card elevation={3} sx={{ p: 3, borderRadius: 3 }}>
            <Grid container spacing={3}>
              <Grid size={{ xs: 12 }}>
                <Typography variant="h6" gutterBottom>
                  Name
                </Typography>
                <Stack spacing={2}>
                  <FormControl fullWidth>
                    <InputLabel>Design</InputLabel>
                    <Select
                      value={seamlessTextureForm?.designId}
                      onChange={(e) => {
                        const selectedDesign = doorDesigns.find((design) => design._id === e.target.value);

                        setSeamlessTextureForm({
                          ...seamlessTextureForm,
                          designId: e.target.value,
                          designValue: selectedDesign?.designValue || ''
                        });
                      }}
                    >
                      {doorDesigns.map((design) => (
                        <MenuItem key={design._id} value={design._id}>
                          {design.designName}
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                </Stack>
              </Grid>

              <Grid size={{ xs: 12 }}>
                <Typography variant="h6" gutterBottom>
                  Name
                </Typography>
                <Stack spacing={2}>
                  <TextField
                    label="Texture Name"
                    value={seamlessTextureForm?.textureName || ''}
                    fullWidth
                    onChange={(e) => {
                      setSeamlessTextureForm({
                        ...seamlessTextureForm,
                        textureName: e.target.value
                      });
                    }}
                  />
                </Stack>
              </Grid>

              <Grid size={{ xs: 12 }}>
                <Typography variant="h6" gutterBottom>
                  Status
                </Typography>
                <Stack spacing={2}>
                  <FormControl fullWidth>
                    <InputLabel>Status</InputLabel>
                    <Select
                      value={seamlessTextureForm?.status}
                      onChange={(e) => {
                        setSeamlessTextureForm({
                          ...seamlessTextureForm,
                          status: e.target.value
                        });
                      }}
                    >
                      <MenuItem value={'active'}>Active</MenuItem>
                      <MenuItem value={'inactive'}>InActive</MenuItem>
                    </Select>
                  </FormControl>
                </Stack>
              </Grid>

              {/* Texture Upload */}
              <Grid size={{ xs: 12 }}>
                <Stack spacing={2}>
                  <Button variant="contained" component="label" startIcon={<ImageIcon />}>
                    Upload Seamless Texture
                    <input hidden type="file" accept="image/*" onChange={uploadTexturefn} />
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
                      {seamlessTextureForm?.textureFileName || 'No texture selected'}
                    </Typography>
                  </Stack>
                  {seamlessTextureForm?.previewTexture && (
                    <Box
                      component="img"
                      src={seamlessTextureForm?.previewTexture}
                      alt="Texture Preview"
                      sx={{
                        width: 250,
                        height: 250,
                        objectFit: 'cover',
                        border: '1px solid #ccc',
                        borderRadius: 2
                      }}
                    />
                  )}
                </Stack>
              </Grid>
            </Grid>
          </Card>
        </DialogContent>

        <DialogActions>
          <Button onClick={() => setOpen(false)}>Cancel</Button>

          <Button variant="contained" onClick={() => createSeamlessTexture()}>
            Save
          </Button>
        </DialogActions>
      </Dialog>

      <Dialog open={deleteOpen} onClose={() => setDeleteOpen(false)}>
        <DialogTitle>Delete Texture</DialogTitle>

        <DialogContent>
          <DialogContentText>Are you sure you want to delete this texture?</DialogContentText>
        </DialogContent>

        <DialogActions>
          <Button onClick={() => setDeleteOpen(false)}>Cancel</Button>

          <Button color="error" variant="contained" onClick={() => textureConformDelete()}>
            Delete
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
}

const thStyle = {
  border: '1px solid #ddd',
  padding: '12px'
};

const tdStyle = {
  border: '1px solid #ddd',
  padding: '12px',
  textAlign: 'center'
};
