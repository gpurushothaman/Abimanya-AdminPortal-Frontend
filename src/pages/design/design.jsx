import { useState, useEffect } from 'react';
//Toast
import { useToast } from '../../contexts/ToastContext';
//api
import { getDesigns, createDesigns, updateDesign, deleteDesign } from '../../services/';

export default function Design() {
  const { showToast } = useToast();
  const [doors, setDoors] = useState([]);

  const [showModal, setShowModal] = useState(false);

  const [newDoorName, setNewDoorName] = useState('');
  const [newDoorType, setNewDoorType] = useState('');
  const [newStatus, setNewStatus] = useState('active');

  const [searchTerm, setSearchTerm] = useState('');
  const [editingDoor, setEditingDoor] = useState(null);

  useEffect(() => {
    loadDoorsLocation();
  }, []);

  const loadDoorsLocation = async () => {
    try {
      const response = await getDoorLocations();
      console.log(response.data.data);
      setDoors(response.data.data);
    } catch (error) {
      console.error(error);
    }
  };


  const handleEdit = (door) => {
    setEditingDoor(door);

    setNewDoorName(door.doorLocationName);
    setNewDoorType(door.doorLocationValue);
    setNewStatus(door.status ? 'active' : 'inactive');

    setShowModal(true);
  };

  const handleDelete = async (doorId) => {
    const confirmDelete = window.confirm('Are you sure you want to delete this door?');

    if (confirmDelete) {      
      try {      
        const { data } = await deleteDoorLocation(doorId);
        console.log('edit data:=', data);
        if (data.success) {
          setDoors(doors.filter((door) => door._id !== doorId));

          showToast('Door location deleted successfully', 'success');
        } else {
          showToast('Door location not delete', 'error');
        }
      } catch (error) {
        console.error(error);
        showToast('Something went wrong', 'error');
      }
    }
  };

  const handleAddDoor = async () => {
    if (!newDoorName || !newDoorType) {
      alert('Please fill all fields');
      return;
    }

    if (editingDoor) {
      try {
        const payload = {
          doorLocationName: newDoorName,
          doorLocationValue: newDoorType,
          status: newStatus === 'active' ? true : false
        };
        const { data } = await updateDoorLocation(editingDoor._id, payload);
        console.log('edit data:=', data);
        if (data.success) {
          setDoors(
            doors.map((door) =>
              door._id === editingDoor._id
                ? {
                    ...door,
                    doorLocationName: data?.data?.['doorLocationName'],
                    doorLocationValue: data?.data?.['doorLocationValue'],
                    status: data?.data?.['status']
                  }
                : door
            )
          );

          showToast('Door location updated successfully', 'success');
        } else {
          showToast('Door location not updated', 'error');
        }
      } catch (error) {
        console.error(error);
        showToast('Something went wrong', 'error');
      }
    } else {
      try {
        const payload = {
          doorLocationName: newDoorName,
          doorLocationValue: newDoorType,
          status: newStatus === 'active' ? true : false
        };
        const { data } = await createDoorLocations(payload);
        console.log(data)
        if (data.success) {
          const newDoor = {
            _id: data?.data?.[0]?.['_id'],
            doorLocationName: data?.data?.[0]?.['doorLocationName'],
            doorLocationValue: data?.data?.[0]?.['doorLocationValue'],
            status: data?.data?.[0]?.['status'],
            createdAt: data?.data?.[0]?.createdAt
          };
          setDoors([...doors, newDoor]);
          showToast('Door location added successfully', 'success');
        } else {
          showToast('Door location not updated', 'error');
        }
      } catch (error) {
        console.error(error);
        showToast('Something went wrong', 'error');
      }
    }

    setNewDoorName('');
    setNewDoorType('');
    setNewStatus('active');

    setEditingDoor(null);
    setShowModal(false);
  };

  const filteredDoors = doors.filter(
    (door) =>
      door.doorLocationName?.toLowerCase()?.includes(searchTerm?.toLowerCase()) ||
      door.doorLocationValue?.toLowerCase()?.includes(searchTerm?.toLowerCase())
  );

  return (
    <div
      style={{
        padding: '20px',
        background: '#fff',
        borderRadius: '10px'
      }}
    >
      <h1>Door Location Management</h1>

      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginBottom: '20px'
        }}
      >
        <input
          type="text"
          placeholder="Search Door..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          style={{
            width: '300px',
            padding: '10px',
            borderRadius: '6px',
            border: '1px solid #ccc'
          }}
        />

        <button
          onClick={() => {
            setEditingDoor(null);
            setNewDoorName('');
            setNewDoorType('');
            setNewStatus('active');
            setShowModal(true);
          }}
          style={{
            background: '#1677ff',
            color: '#fff',
            border: 'none',
            padding: '10px 20px',
            borderRadius: '6px',
            cursor: 'pointer'
          }}
        >
          + Add Item
        </button>
      </div>

      <table
        style={{
          width: '100%',
          borderCollapse: 'collapse'
        }}
      >
        <thead>
          <tr
            style={{
              background: '#f0f2f5'
            }}
          >
            <th style={thStyle}>S.No</th>
            <th style={thStyle}>Door Name</th>
            <th style={thStyle}>Status</th>
            <th style={thStyle}>Created Date</th>
            <th style={thStyle}>Action</th>
          </tr>
        </thead>

        <tbody>
          {filteredDoors.length === 0 ? (
            <tr>
              <td
                colSpan="7"
                style={{
                  textAlign: 'center',
                  padding: '20px'
                }}
              >
                No Door Location Found
              </td>
            </tr>
          ) : (
            filteredDoors.map((door, index) => (
              <tr key={door._id}>
                <td style={tdStyle}>{index + 1}</td>

                <td style={tdStyle}>{door.doorLocationName}</td>

                <td style={tdStyle}>
                  <span
                    style={{
                      background: door.status ? '#d9f7be' : '#ffccc7',
                      padding: '4px 10px',
                      borderRadius: '20px'
                    }}
                  >
                    {door.status ? 'Active' : 'Inactive'}
                  </span>
                </td>

                <td style={tdStyle}>{door.createdAt}</td>             

                <td style={tdStyle}>
                  <button
                    onClick={() => handleEdit(door)}
                    style={{
                      background: '#faad14',
                      color: '#fff',
                      border: 'none',
                      padding: '6px 12px',
                      borderRadius: '5px',
                      marginRight: '8px',
                      cursor: 'pointer'
                    }}
                  >
                    Edit
                  </button>

                  <button
                    onClick={() => handleDelete(door._id)}
                    style={{
                      background: '#ff4d4f',
                      color: '#fff',
                      border: 'none',
                      padding: '6px 12px',
                      borderRadius: '5px',
                      cursor: 'pointer'
                    }}
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>

      {showModal && (
        <div
          style={{
            position: 'fixed',
            inset: 0,
            background: 'rgba(0,0,0,0.5)',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center'
          }}
        >
          <div
            style={{
              background: '#fff',
              width: '420px',
              padding: '25px',
              borderRadius: '10px'
            }}
          >
            <h2>{editingDoor ? 'Edit Door' : 'Add Door'}</h2>

            <div
              style={{
                marginBottom: '12px'
              }}
            >
              <label>Door Name</label>

              <input
                type="text"
                value={newDoorName}
                onChange={(e) => setNewDoorName(e.target.value)}
                style={{
                  width: '100%',
                  padding: '10px',
                  marginTop: '5px'
                }}
              />
            </div>

            <div
              style={{
                marginBottom: '12px'
              }}
            >
              <label>Door Type</label>

              <input
                type="text"
                value={newDoorType}
                onChange={(e) => setNewDoorType(e.target.value)}
                style={{
                  width: '100%',
                  padding: '10px',
                  marginTop: '5px'
                }}
              />
            </div>

            <div
              style={{
                marginBottom: '15px'
              }}
            >
              <label>Status</label>

              <select
                value={newStatus}
                onChange={(e) => setNewStatus(e.target.value)}
                style={{
                  width: '100%',
                  padding: '10px',
                  marginTop: '5px'
                }}
              >
                <option value="active">Active</option>
                <option value="inactive">Inactive</option>
              </select>
            </div>

            <div
              style={{
                display: 'flex',
                justifyContent: 'flex-end',
                gap: '10px'
              }}
            >
              <button
                onClick={() => {
                  setShowModal(false);
                  setEditingDoor(null);
                }}
              >
                Cancel
              </button>

              <button
                onClick={handleAddDoor}
                style={{
                  background: '#1677ff',
                  color: '#fff',
                  border: 'none',
                  padding: '8px 16px'
                }}
              >
                {editingDoor ? 'Update' : 'Add'}
              </button>
            </div>
          </div>
        </div>
      )}
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
