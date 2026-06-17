import React, { useState } from "react";

const Architrave = () => {
  const [frontOptions, setFrontOptions] = useState([
    { id: 1, name: "10 mm", checked: false },
    { id: 2, name: "40 mm", checked: false },
    { id: 3, name: "60 mm", checked: false },
  ]);

  const [backOptions, setBackOptions] = useState([
    { id: 1, name: "10 mm", checked: false },
    { id: 2, name: "40 mm", checked: false },
    { id: 3, name: "60 mm", checked: false },
  ]);

  const toggleCheck = (list, setList, id) => {
    setList(
      list.map((item) =>
        item.id === id
          ? { ...item, checked: !item.checked }
          : item
      )
    );
  };

  const deleteItem = (list, setList, id) => {
    setList(list.filter((item) => item.id !== id));
  };

  
   const handleSave = () => {
    alert("Saved Successfully");
  };

  const Card = ({ title, data, setData }) => {
    return (
      <div
        style={{
          width: "340px",
          border: "1px solid #ddd",
          borderRadius: "8px",
          background: "#fff",
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
          {title}
        </div>

        {data.map((item, index) => (
          <div
            key={item.id}
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              padding: "15px 18px",
              borderBottom:
                index !== data.length - 1
                  ? "1px solid #eee"
                  : "none",
            }}
          >
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: "12px",
              }}
            >
              <input
                type="checkbox"
                checked={item.checked}
                onChange={() =>
                  toggleCheck(data, setData, item.id)
                }
              />

              <span
                style={{
                  fontSize: "16px",
                }}
              >
                {item.name}
              </span>
            </div>

            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: "12px",
              }}
            >
              <button
                style={{
                  border: "none",
                  background: "transparent",
                  cursor: "pointer",
                  fontSize: "16px",
                }}
              >
                ✏️
              </button>

              <button
                onClick={() =>
                  deleteItem(data, setData, item.id)
                }
                style={{
                  border: "none",
                  background: "transparent",
                  cursor: "pointer",
                  fontSize: "16px",
                }}
              >
                🗑️
              </button>
            </div>
          </div>
        ))}
      </div>
    );
  };

  return (
    <div style={{ padding: "25px" }}>
      <h2
        style={{
          marginBottom: "25px",
          color: "#333",
          fontWeight: "600",
        }}
      >
        Architrave Size
      </h2>

      <div
        style={{
          display: "flex",
          gap: "40px",
          alignItems: "flex-start",
          flexWrap: "wrap",
        }}
      >
        <Card
          title="Front"
          data={frontOptions}
          setData={setFrontOptions}
        />

        <Card
          title="Back"
          data={backOptions}
          setData={setBackOptions}
        />
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

export default Architrave;