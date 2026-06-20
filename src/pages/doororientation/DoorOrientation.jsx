import React, { useEffect, useState } from "react";
import {getDoorOrientation,createDoorOrientation,updateDoorOrientation,} from "../../services/doorOrientationService";
import { useToast } from '../../contexts/ToastContext';


const DoorOrientation = () => {
  const { showToast } = useToast();
 const [newOrientation, setNewOrientation] = useState("");
const [orientationValue, setOrientationValue] =useState("");
const [options, setOptions] = useState([]);

useEffect(() => {
  fetchDoorOrientation();
}, []);

const fetchDoorOrientation = async () => {
  try {
    const response = await getDoorOrientation();

    setOptions(
      response.data.data.map((item) => ({
        ...item,
        editing: false,
      }))
    );
  } catch (error) {
    console.error(error);
  }
};

  const handleEdit = async (id) => {
  const selected = options.find(
    (item) => item._id === id
  );

  if (selected.editing) {
    try {
      await updateDoorOrientation(id, {
        DoorOrientationname:
          selected.DoorOrientationname,
        DoorOrientationvalue:
          selected.DoorOrientationvalue,
      });

      showToast(
        "Door Orientation Updated Successfully",
        "success"
      );
    } catch (error) {
      console.error(error);

      showToast(
        "Update Failed",
        "error"
      );

      return;
    }
  }

  setOptions(
    options.map((item) =>
      item._id === id
        ? {
            ...item,
            editing: !item.editing,
          }
        : item
    )
  );
};

 const handleChange = (id, value) => {
  setOptions(
    options.map((item) =>
      item._id === id
        ? {
            ...item,
            DoorOrientationname: value,
          }
        : item
    )
  );
};

const handleValueChange = (id, value) => {
  setOptions(
    options.map((item) =>
      item._id === id
        ? {
            ...item,
            DoorOrientationvalue: value,
          }
        : item
    )
  );
};




const handleSave = async () => {
 if (!newOrientation.trim()) {
  showToast(
    "Enter Orientation Name",
    "error"
  );
  return;
}

if (!orientationValue) {
  showToast(
    "Select Orientation Value",
    "error"
  );
  return;
}

  try {
    const response =
      await createDoorOrientation({
        DoorOrientationname:
          newOrientation,
        DoorOrientationvalue:
          orientationValue,
      });

    setOptions([
      ...options,
      {
        ...response.data.data,
        editing: false,
      },
    ]);

    setNewOrientation("");
    setOrientationValue("");

    showToast(
      "Door Orientation Added Successfully",
      "success"
    );
  } catch (error) {
    console.error(error);

    showToast(
      error.response?.data?.message ||
      "Something went wrong",
      "error"
    );
  }
};

  return (
    <div style={{ padding: "25px" }}>
      <h2
        style={{
          marginBottom: "20px",
          color: "#333",
          fontWeight: "600",
        }}
      >
        Door Orientation
      </h2>


      {/* THIYAGUUU */}

      <div
  style={{
    marginBottom: "20px",
    display: "flex",
    gap: "10px",
  }}
>
  <input
    type="text"
    placeholder="Enter Orientation Name"
    value={newOrientation}
    onChange={(e) =>
      setNewOrientation(e.target.value)
    }
    style={{
      padding: "10px",
      width: "250px",
      border: "1px solid #ccc",
      borderRadius: "6px",
    }}
  />

  <select
    value={orientationValue}
    onChange={(e) =>
      setOrientationValue(e.target.value)
    }
    style={{
      padding: "10px",
      width: "250px",
      border: "1px solid #ccc",
      borderRadius: "6px",
    }}
  >
    <option value="">Enter Orientation</option>
    <option value="lhs">Lhs</option>
    <option value="rhs">Rhs</option>
  </select>

  <button
    onClick={handleSave}
    style={{
      padding: "10px 20px",
      backgroundColor: "#1976d2",
      color: "#fff",
      border: "none",
      borderRadius: "6px",
      cursor: "pointer",
    }}
  >
    Add
  </button>
</div>

      <div
        style={{
          width: "550px",
          background: "#fff",
          border: "1px solid #dcdcdc",
          borderRadius: "8px",
          overflow: "hidden",
          boxShadow: "0 2px 6px rgba(0,0,0,0.08)",
        }}
      >
        <div
          style={{
            padding: "14px 18px",
            background: "#f5f5f5",
            borderBottom: "1px solid #ddd",
            fontWeight: "600",
            fontSize: "16px",
          }}
        >
          Orientation Options
        </div>

        {options.map((item, index) => (
          <div
            key={item._id}
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              padding: "16px 18px",
              borderBottom:
                index !== options.length - 1
                  ? "1px solid #eee"
                  : "none",
            }}
          >
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: "15px",
                flex: 1,
              }}
            >
              

              {item.editing ? (
  <div
    style={{
      display: "flex",
      gap: "10px",
    }}
  >
    <input
      value={item.DoorOrientationname}
      onChange={(e) =>
        handleChange(item._id, e.target.value)
      }
      style={{
        padding: "6px 10px",
        width: "180px",
      }}
    />

    <select
     value={item.DoorOrientationvalue}
      onChange={(e) =>
        handleValueChange(
          item._id,
          e.target.value
        )
      }
      style={{
        padding: "6px 10px",
        width: "120px",
      }}
    >
      <option value="lhs">lhs</option>
      <option value="rhs">rhs</option>
    </select>
  </div>
) : (

// replace span option for show UI in two input values   ----->
<div
  style={{
    display: "flex",
    gap: "20px",
  }}
>
  <span
    style={{
      width: "180px",
      fontSize: "15px",
    }}
  >
      {item.DoorOrientationname}
  </span>

  <span
    style={{
      width: "80px",
      fontSize: "15px",
    }}
  >
    {item.DoorOrientationvalue}
  </span>
</div>



              )}
            </div>

            <div>
              <button
                onClick={() => handleEdit(item._id)}
                style={{
                  border: "none",
                  background: "transparent",
                  cursor: "pointer",
                  fontSize: "18px",
                  marginRight: "15px",
                }}
              >
                {item.editing ? "✔️" : "✏️"}
              </button>

      
            </div>
          </div>
        ))}
      </div>

    </div>
  );
};

export default DoorOrientation;