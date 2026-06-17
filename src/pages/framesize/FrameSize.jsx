import React, { useEffect, useState } from "react";

import {
getFrameSize,createFrameSize,updateFrameSize,deleteFrameSize,} from "../../services/frameSizeService";

const FrameSize = () => {
const [heights, setHeights] = useState([]);
const [widths, setWidths] = useState([]);

const [newHeight, setNewHeight] = useState("");
const [newWidth, setNewWidth] = useState("");

useEffect(() => {
fetchFrameSize();
}, []);

const fetchFrameSize = async () => {
try {
const response = await getFrameSize();


  setHeights(
    response.data.data.heights.map((item) => ({
      ...item,
      editing: false,
      checked: false,
    }))
  );

  setWidths(
    response.data.data.widths.map((item) => ({
      ...item,
      editing: false,
      checked: false,
    }))
  );
} catch (error) {
  console.error("Fetch Error:", error);
}


};

const handleCheck = (id, type) => {
if (type === "height") {
setHeights(
heights.map((item) =>
item._id === id
? { ...item, checked: !item.checked }
: item
)
);
} else {
setWidths(
widths.map((item) =>
item._id === id
? { ...item, checked: !item.checked }
: item
)
);
}
};

const handleEdit = async (id, type) => {
const list = type === "height" ? heights : widths;


const selected = list.find(
  (item) => item._id === id
);

if (selected.editing) {
  try {
    await updateFrameSize(id, {
      name: selected.name,
      type,
    });
  } catch (error) {
    console.error(error);
    return;
  }
}

const updated = list.map((item) =>
  item._id === id
    ? { ...item, editing: !item.editing }
    : item
);

type === "height"
  ? setHeights(updated)
  : setWidths(updated);


};

const handleChange = (id, value, type) => {
const list = type === "height" ? heights : widths;


const updated = list.map((item) =>
  item._id === id
    ? { ...item, name: value }
    : item
);

type === "height"
  ? setHeights(updated)
  : setWidths(updated);


};

const handleDelete = async (id, type) => {
try {
await deleteFrameSize(id);


  if (type === "height") {
    setHeights(
      heights.filter((item) => item._id !== id)
    );
  } else {
    setWidths(
      widths.filter((item) => item._id !== id)
    );
  }
} catch (error) {
  console.error(error);
}


};

const handleAddHeight = async () => {
if (!newHeight.trim()) return;


try {
  const response = await createFrameSize({
    name: newHeight,
    type: "height",
  });

  setHeights([
    ...heights,
    {
      ...response.data.data,
      editing: false,
      checked: false,
    },
  ]);

  setNewHeight("");
} catch (error) {
  console.error(error);
}


};

const handleAddWidth = async () => {
if (!newWidth.trim()) return;


try {
  const response = await createFrameSize({
    name: newWidth,
    type: "width",
  });

  setWidths([
    ...widths,
    {
      ...response.data.data,
      editing: false,
      checked: false,
    },
  ]);

  setNewWidth("");
} catch (error) {
  console.error(error);
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
      Frame Height & Width
    </h2>
<div
  style={{
    display: "flex",
    gap: "40px",
    alignItems: "flex-start",
    flexWrap: "wrap",
  }}
>
  {/* Height */}
  <div
    style={{
      width: "450px",
      background: "#fff",
      borderRadius: "10px",
      overflow: "hidden",
      boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
    }}
  >
    <div
      style={{
        backgroundColor:"#f2f2f2",
        color: "black",
        padding: "14px 18px",
        fontWeight: "600",
        fontSize: "16px"
      }}
    >
      Frame Height
    </div>

    <div
      style={{
        padding: "15px",
        display: "flex",
        gap: "10px",
      }}
    >
      <input
        value={newHeight}
        onChange={(e) =>
          setNewHeight(e.target.value)
        }
        placeholder="Enter the frame height"
        style={{
          flex: 1,
          padding: "8px 10px",
        }}
      />

      <button
        onClick={handleAddHeight}
        style={{
          background: "#1976d2",
          color: "#fff",
          border: "none",
          padding: "8px 15px",
          borderRadius: "4px",
          cursor: "pointer",
        }}
      >
        Add
      </button>
    </div>

    {heights.map((item, index) => (
      <div
        key={item._id}
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          padding: "16px 18px",
          borderBottom:
            index !== heights.length - 1
              ? "1px solid #eee"
              : "none",
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "12px",
            flex: 1,
          }}
        >
          <input
            type="checkbox"
            checked={item.checked}
            onChange={() =>
              handleCheck(
                item._id,
                "height"
              )
            }
          />

          {item.editing ? (
            <input
              value={item.name || ""}
              onChange={(e) =>
                handleChange(
                  item._id,
                  e.target.value,
                  "height"
                )
              }
              style={{
                padding: "6px 10px",
                width: "140px",
              }}
            />
          ) : (
            <span>{item.name}</span>
          )}
        </div>

        <div>
          <button
            onClick={() =>
              handleEdit(
                item._id,
                "height"
              )
            }
            style={{
              border: "none",
              background: "transparent",
              cursor: "pointer",
              fontSize: "18px",
              marginRight: "10px",
            }}
          >
            {item.editing ? "✔️" : "✏️"}
          </button>

          <button
            onClick={() =>
              handleDelete(
                item._id,
                "height"
              )
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

  {/* Width */}
  <div
    style={{
      width: "450px",
      background: "#fff",
      borderRadius: "10px",
      overflow: "hidden",
      boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
    }}
  >
    <div
      style={{
      backgroundColor:"#f2f2f2",
       color: "black",
        padding: "14px 18px",
        fontWeight: "600",
        fontSize: "16px"
      }}
    >
      Frame Width
    </div>

    <div
      style={{
        padding: "15px",
        display: "flex",
        gap: "10px",
      }}
    >
      <input
        value={newWidth}
        onChange={(e) =>
          setNewWidth(e.target.value)
        }
        placeholder="Enter Width"
        style={{
          flex: 1,
          padding: "8px 10px",
        }}
      />

      <button
        onClick={handleAddWidth}
        style={{
          background: "#1976d2",
          color: "#fff",
          border: "none",
          padding: "8px 15px",
          borderRadius: "4px",
          cursor: "pointer",
        }}
      >
        Add
      </button>
    </div>

    {widths.map((item, index) => (
      <div
        key={item._id}
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          padding: "16px 18px",
          borderBottom:
            index !== widths.length - 1
              ? "1px solid #eee"
              : "none",
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "12px",
            flex: 1,
          }}
        >
          <input
            type="checkbox"
            checked={item.checked}
            onChange={() =>
              handleCheck(
                item._id,
                "width"
              )
            }
          />

          {item.editing ? (
            <input
              value={item.name || ""}
              onChange={(e) =>
                handleChange(
                  item._id,
                  e.target.value,
                  "width"
                )
              }
              style={{
                padding: "6px 10px",
                width: "140px",
              }}
            />
          ) : (
            <span>{item.name}</span>
          )}
        </div>

        <div>
          <button
            onClick={() =>
              handleEdit(
                item._id,
                "width"
              )
            }
            style={{
              border: "none",
              background: "transparent",
              cursor: "pointer",
              fontSize: "18px",
              marginRight: "10px",
            }}
          >
            {item.editing ? "✔️" : "✏️"}
          </button>

          <button
            onClick={() =>
              handleDelete(
                item._id,
                "width"
              )
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


  </div>
);

   
};

export default FrameSize
