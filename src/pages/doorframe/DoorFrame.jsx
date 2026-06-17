import React, { useState } from "react";

const DoorFrame = () => {
  const [options, setOptions] = useState([
    { id: 1, name: "No", editing: false, checked: false },
    { id: 2, name: "Full", editing: false, checked: false },
    { id: 3, name: "Half", editing: false, checked: false },
  ]);

  const handleEdit = (id) => {
    setOptions(
      options.map((item) =>
        item.id === id
          ? { ...item, editing: !item.editing }
          : item
      )
    );
  };

  const handleChange = (id, value) => {
    setOptions(
      options.map((item) =>
        item.id === id ? { ...item, name: value } : item
      )
    );
  };

  const handleDelete = (id) => {
    setOptions(options.filter((item) => item.id !== id));
  };

  const handleCheck = (id) => {
    setOptions(
      options.map((item) =>
        item.id === id
          ? { ...item, checked: !item.checked }
          : item
      )
    );
  };

   const handleSave = () => {
    alert("Saved Successfully");
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
       Door Frame
      </h2>

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
          Frame Options
        </div>

        {options.map((item) => (
          <div
            key={item.id}
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
              <input
                type="checkbox"
                checked={item.checked}
                onChange={() => handleCheck(item.id)}
              />

              {item.editing ? (
                <input
                  value={item.name}
                  onChange={(e) =>
                    handleChange(item.id, e.target.value)
                  }
                  style={{
                    padding: "6px 10px",
                    width: "200px",
                  }}
                />
              ) : (
                <span style={{ fontSize: "15px" }}>
                  {item.name}
                </span>
              )}
            </div>

            <div>
              <button
                onClick={() => handleEdit(item.id)}
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

              <button
                onClick={() => handleDelete(item.id)}
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


<button
        onClick={handleSave}
        style={{
          marginTop: "20px",
          padding: "10px 24px",
          backgroundColor: "#1976d2",
          color: "#fff",
          border: "none",
          borderRadius: "6px",
          cursor: "pointer",
          fontSize: "14px",
          fontWeight: "500",
        }}
      >
        Save
      </button>


    </div>
  );
};

export default DoorFrame;