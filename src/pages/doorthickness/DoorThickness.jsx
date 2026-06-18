import React, { useEffect, useState } from "react";

import {getDoorThickness,createDoorThickness,updateDoorThickness,deleteDoorThickness,} from "../../services/DoorThicknessService";

const DoorThickNess = () => {
  const [options, setOptions] = useState([]);
  const [newThickness, setNewThickness] = useState("");
  const [thicknessValue, setThicknessValue] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    fetchDoorThickness();
  }, []);
  const fetchDoorThickness = async () => {
    try {
      const response = await getDoorThickness();
     setOptions(
     response.data.data.map((item) => ({
    ...item,
    editing: false,
    checked: false,
  }))
);
    } catch (error) {
      console.error("Fetch Error:", error);
    }
  };



  const handleEdit = async (id) => {
    const selected = options.find(
      (item) => item._id === id
    );
    if (selected.editing) {
        const confirmed = window.confirm("Are you sure you want to update this item?");
      try {
       await updateDoorThickness(id, {
         name: `${selected.value}mm`,
         value: selected.value,
       });
        console.log("Sending:", {
  name: selected.name,
  value: selected.value,
});
        console.log("updated")
      } catch (error) {
        console.error("Update Error:", error);
        return;
      }
    }
    setOptions(
      options.map((item) =>
        item._id === id
          ? { ...item, editing: !item.editing }
          : item
      )
    );
  };



  const handleChange = (id, value) => {
    setOptions(
      options.map((item) =>
        item._id === id
          ? { ...item, name: value }
          : item
      )
    );
  };


const handleNameChange = (id, value) => {
  setOptions(
    options.map((item) =>
      item._id === id
        ? { ...item, name: value }
        : item
    )
  );
};

const handleValueChange = (id, value) => {
  setOptions(
    options.map((item) =>
      item._id === id
        ? { ...item, value: value }
        : item
    )
  );
};



  const handleDelete = async (id) => {
     const confirmed = window.confirm("Are you sure you want to delete this item?");
     if (!confirmed) return;
     try {
      await deleteDoorThickness(id);
      setOptions(options.filter((item) => item._id !== id)
      );
    } catch (error) {
      console.error("Delete Error:", error);
    }
  };



  const handleCheck = (id) => {
    setOptions(
      options.map((item) =>
        item._id === id
          ? { ...item, checked: !item.checked }
          : item
      )
    );
  };

  // THIYAGUUUUUUUUU
  const handleThicknessValueChange = (e) => {
  const value = e.target.value;
  if (/^\d*$/.test(value)) {
    setThicknessValue(value);
    setError("");
  } else {
    setError("Enter correct value");
  }
};


  const handleSave = async () => {
    if (!newThickness.trim()) {
      alert("Enter Thickness");
      return;
    }
    try {
      const response =
        await createDoorThickness({
          name: newThickness,
          value: thicknessValue,
        });
        console.log(response.data.data);
      setOptions([
        ...options,
        {
          ...response.data.data,
          editing: false,
          checked: false,
        },
      ]);
setNewThickness("");
setThicknessValue("");
setError("");
    } catch (error) {
      console.error("Create Error:", error);
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
        Door Thickness
      </h2>

      <div
        style={{
          marginBottom: "20px",
          display: "flex",
          gap: "10px",
        }}
      >

        {/* FIRST CHECKBOX */}

<input
  type="text"
  placeholder="Enter Thickness name"
  value={newThickness}
  onChange={(e) => setNewThickness(e.target.value)}
  style={{
    padding: "10px",
    width: "250px",
    border: "1px solid #ccc",
    borderRadius: "6px",
  }}
/>


        {/* SECOND CHECKBOX */}
<input
  type="text"
  placeholder="Enter Thickness Value"
  value={thicknessValue}
  onChange={handleThicknessValueChange}
  style={{
    padding: "10px",
    width: "250px",
    border: "1px solid #ccc",
    borderRadius: "6px",
  }}
/>


{/* ERROR MESSAGE */}
{error && (
  <p
    style={{
      color: "red",
      fontSize: "12px",
      marginTop: "5px",
    }}
  >
    {error}
  </p>
)}

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
          boxShadow:
            "0 2px 6px rgba(0,0,0,0.08)",
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
          Thickness Options
        </div>

        {options.map((item) => (
          <div
            key={item._id}
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              padding: "16px 18px",
              borderBottom: "1px solid #eee",
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
              {/* <input
                type="checkbox"
                checked={item.checked}
                onChange={() =>
                  handleCheck(item._id)
                }
              /> */}

            
              
{item.editing ? (
  <input
    value={item.value}
    onChange={(e) =>
      handleValueChange(
        item._id,
        e.target.value
      )
    }
  />
) : (
  <>
    <span>{item.value}</span>
  </>
)}
            </div>

            <div>
              <button
                onClick={() =>
                  handleEdit(item._id)
                }
                style={{
                  border: "none",
                  background: "transparent",
                  cursor: "pointer",
                  fontSize: "18px",
                  marginRight: "15px",
                }}
              >
                {item.editing
                  ? "✔️"
                  : "✏️"}
              </button>

              <button
                onClick={() =>
                  handleDelete(item._id)
                }
                style={{
                  border: "none",
                  background: "transparent",
                  cursor: "pointer",
                  fontSize: "18px",
                }}
              >
                🗑️
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default DoorThickNess;