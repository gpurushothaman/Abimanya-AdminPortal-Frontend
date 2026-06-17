import React, { useEffect, useState } from "react";

import {getWallThickness,createWallThickness,updateWallThickness,deleteWallThickness,} from "../../services/wallThicknessService";

const WallThickNess = () => {
  const [options, setOptions] = useState([]);
  const [newThickness, setNewThickness] = useState("");

  useEffect(() => {
    fetchWallThickness();
  }, []);

  const fetchWallThickness = async () => {
    try {
      const response = await getWallThickness();

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
      try {
        await updateWallThickness(id, {
          name: selected.name,
        });
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

  const handleDelete = async (id) => {
    try {
      await deleteWallThickness(id);

      setOptions(
        options.filter(
          (item) => item._id !== id
        )
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

  const handleSave = async () => {
    if (!newThickness.trim()) {
      alert("Enter Thickness");
      return;
    }

    try {
      const response =
        await createWallThickness({
          name: newThickness,
        });

      setOptions([
        ...options,
        {
          ...response.data,
          editing: false,
          checked: false,
        },
      ]);

      setNewThickness("");
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
        Wall Thickness
      </h2>

      <div
        style={{
          marginBottom: "20px",
          display: "flex",
          gap: "10px",
        }}
      >
        <input
          type="text"
          placeholder="Enter Thickness"
          value={newThickness}
          onChange={(e) =>
            setNewThickness(e.target.value)
          }
          style={{
            padding: "10px",
            width: "250px",
            border: "1px solid #ccc",
            borderRadius: "6px",
          }}
        />

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
              <input
                type="checkbox"
                checked={item.checked}
                onChange={() =>
                  handleCheck(item._id)
                }
              />

              {item.editing ? (
                <input
                  value={item.name}
                  onChange={(e) =>
                    handleChange(
                      item._id,
                      e.target.value
                    )
                  }
                  style={{
                    padding: "6px 10px",
                    width: "200px",
                  }}
                />
              ) : (
                <span
                  style={{
                    fontSize: "15px",
                  }}
                >
                  {item.name}
                </span>
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

export default WallThickNess;