import axios from 'axios';
import { useState } from 'react';

export default function DoorLocation() {
  const [doors, setDoors] = useState([
    {
      id: 1,
      doorName: 'Main Entrance Door',
      doorType: 'Entrance',
      status: 'Active',
      createdDate: '2025-06-01'
    },
    {
      id: 2,
      doorName: 'Balcony Door',
      doorType: 'Balcony',
      status: 'Active',
      createdDate: '2025-06-02'
    },
    {
      id: 3,
      doorName: 'Bedroom Door',
      doorType: 'Bedroom',
      status: 'Active',
      createdDate: '2025-06-03'
    },
    {
      id: 4,
      doorName: 'Bathroom Door',
      doorType: 'Bathroom',
      status: 'Active',
      createdDate: '2025-06-04'
    },
    {
      id: 5,
      doorName: 'Kitchen Door',
      doorType: 'Kitchen',
      status: 'Active',
      createdDate: '2025-06-05'
    },
     {
      id: 6,
      doorName: 'Living Room Door',
      doorType: 'Living',
      status: 'Active',
      createdDate: '2025-06-06'
    },
     {
      id: 7,
      doorName: 'Pooja Room Door',
      doorType: 'Pooja',
      status: 'Active',
      createdDate: '2025-06-07'
    },
     {
      id: 8,
      doorName: 'study office Door',
      doorType: 'Study',
      status: 'Active',
      createdDate: '2025-06-08'
    },
     {
      id: 9,
      doorName: 'Store Room Door',
      doorType: 'Store',
      status: 'Active',
      createdDate: '2025-06-09'
    }
  ]);

  const [selectedDoors, setSelectedDoors] = useState([]);
  const [showModal, setShowModal] = useState(false);

  const [newDoorName, setNewDoorName] = useState('');
  const [newDoorType, setNewDoorType] = useState('');
  const [newStatus, setNewStatus] = useState('Active');

  const [searchTerm, setSearchTerm] = useState('');
  const [editingDoor, setEditingDoor] = useState(null);

  const handleCheck = (doorId) => {
    if (selectedDoors.includes(doorId)) {
      setSelectedDoors(
        selectedDoors.filter((id) => id !== doorId)
      );
    } else {
      setSelectedDoors([...selectedDoors, doorId]);
    }
  };

  const handleEdit = (door) => {
    setEditingDoor(door);

    setNewDoorName(door.doorName);
    setNewDoorType(door.doorType);
    setNewStatus(door.status);

    setShowModal(true);
  };

  const handleDelete = (doorId) => {
    const confirmDelete = window.confirm(
      'Are you sure you want to delete this door?'
    );

    if (confirmDelete) {
      setDoors(
        doors.filter((door) => door.id !== doorId)
      );

      setSelectedDoors(
        selectedDoors.filter((id) => id !== doorId)
      );
    }
  };

  const handleAddDoor = () => {
    if (!newDoorName || !newDoorType) {
      alert('Please fill all fields');
      return;
    }

    if (editingDoor) {
      setDoors(
        doors.map((door) =>
          door.id === editingDoor.id
            ? {
                ...door,
                doorName: newDoorName,
                doorType: newDoorType,
                status: newStatus
              }
            : door
        )
      );

      alert('Door Updated Successfully');
    } else {
      const newDoor = {
        id: Date.now(),
        doorName: newDoorName,
        doorType: newDoorType,
        status: newStatus,
        createdDate: new Date()
          .toISOString()
          .split('T')[0]
      };

      setDoors([...doors, newDoor]);

      alert('Door Added Successfully');
    }

    setNewDoorName('');
    setNewDoorType('');
    setNewStatus('Active');

    setEditingDoor(null);
    setShowModal(false);
  };

        //      ((((((   THIYAGUU IMJECTED IN AXIOS AND BACNEND PROCESS      )))))) 

const handleSave = async () => {
  const selectedData = doors.filter((door) =>
    selectedDoors.includes(door.id)
  );
  if (selectedData.length === 0) {
    alert("Please select at least one door");
    return;
  }
  try {
    const token = localStorage.getItem("token");
    console.log("TOKEN =", token);
    const response = await axios.post("http://localhost:5000/api/admin/doorlocation/save",selectedData,
      {
        headers: {
          Authorization: `Bearer ${token}`
        }
      }
    );
    console.log(response.data);
    alert("Door Locations Saved Successfully");
  } catch (error) {
    console.error(error);
    console.log(
      "Backend Error:",
      error.response?.data
    );
    alert(
      error.response?.data?.message ||
      "Save Failed"
    );
  }
};





  const filteredDoors = doors.filter(
    (door) =>
      door.doorName
        .toLowerCase()
        .includes(searchTerm.toLowerCase()) ||
      door.doorType
        .toLowerCase()
        .includes(searchTerm.toLowerCase())
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
          onChange={(e) =>
            setSearchTerm(e.target.value)
          }
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
            setNewStatus('Active');
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
            <th style={thStyle}>Door Type</th>
            <th style={thStyle}>Status</th>
            <th style={thStyle}>Created Date</th>
            <th style={thStyle}>Select</th>
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
                No Door Found
              </td>
            </tr>
          ) : (
            filteredDoors.map((door, index) => (
              <tr key={door.id}>
                <td style={tdStyle}>{index + 1}</td>

                <td style={tdStyle}>
                  {door.doorName}
                </td>

                <td style={tdStyle}>
                  {door.doorType}
                </td>

                <td style={tdStyle}>
                  <span
                    style={{
                      background:
                        door.status === 'Active'
                          ? '#d9f7be'
                          : '#ffccc7',
                      padding: '4px 10px',
                      borderRadius: '20px'
                    }}
                  >
                    {door.status}
                  </span>
                </td>

                <td style={tdStyle}>
                  {door.createdDate}
                </td>

                <td style={tdStyle}>
                  <input
                    type="checkbox"
                    checked={selectedDoors.includes(
                      door.id
                    )}
                    onChange={() =>
                      handleCheck(door.id)
                    }
                  />
                </td>

                <td style={tdStyle}>
                  <button
                    onClick={() =>
                      handleEdit(door)
                    }
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
                    onClick={() =>
                      handleDelete(door.id)
                    }
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

      <button
        onClick={handleSave}
        style={{
          marginTop: '20px',
          background: '#52c41a',
          color: '#fff',
          border: 'none',
          padding: '10px 20px',
          borderRadius: '6px',
          cursor: 'pointer'
        }}
      >
        Save Selected Doors
      </button>

      {showModal && (
        <div
          style={{
            position: 'fixed',
            inset: 0,
            background:
              'rgba(0,0,0,0.5)',
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
            <h2>
              {editingDoor
                ? 'Edit Door'
                : 'Add Door'}
            </h2>

            <div
              style={{
                marginBottom: '12px'
              }}
            >
              <label>Door Name</label>

              <input
                type="text"
                value={newDoorName}
                onChange={(e) =>
                  setNewDoorName(
                    e.target.value
                  )
                }
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
                onChange={(e) =>
                  setNewDoorType(
                    e.target.value
                  )
                }
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
                onChange={(e) =>
                  setNewStatus(
                    e.target.value
                  )
                }
                style={{
                  width: '100%',
                  padding: '10px',
                  marginTop: '5px'
                }}
              >
                <option value="Active">
                  Active
                </option>
                <option value="Inactive">
                  Inactive
                </option>
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
                {editingDoor
                  ? 'Update'
                  : 'Add'}
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