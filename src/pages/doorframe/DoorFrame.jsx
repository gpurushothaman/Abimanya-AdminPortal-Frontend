import React, { useEffect, useState } from "react";
import {getDoorFrame,createDoorFrame,updateDoorFrame,} from "../../services/doorFrameService";
import { useToast } from "../../contexts/ToastContext";

const DoorFrame = () => {
  const { showToast } = useToast();
const [newFrame, setNewFrame] = useState("");
const [frameValue, setFrameValue] = useState("");
const [options, setOptions] = useState([]);



useEffect(() => {
  fetchDoorFrame();
}, []);
const fetchDoorFrame = async () => {
  try {
    const response = await getDoorFrame();
    setOptions(response.data.data.map((item) => ({...item,editing: false,})));
  } catch (error) {
    console.error(error);
  }
};




const handleEdit = async (id) => {
  const selected = options.find((item) => item._id === id);
  if (selected.editing) {
    try {
      await updateDoorFrame(id, {
        frameName: selected.frameName,
        frameValue: selected.frameValue,
      });
      showToast(
        "Door Frame Updated Successfully",
        "success"
      );
    } catch (error) {
      showToast("Update Failed", "error");
      return;
    }
  }
  setOptions(
    options.map((item) =>item._id === id? {...item,editing: !item.editing,}: item)
  );
};




 const handleChange = (id, value) => {
  setOptions(options.map((item) =>item._id === id? {...item,frameName: value,}: item));
};

 



const handleValueChange = (id, value) => {
  setOptions(options.map((item) => item._id === id? {...item,frameValue: value,}: item)
  );
};




const handleSave = async () => {
  if (!newFrame.trim()) {
    showToast("Enter Frame Name","error");
    return;
  }
  if (!frameValue) {
    showToast("Select Frame Value","error");
    return;
  }
  try {
    const response = await createDoorFrame({frameName: newFrame,frameValue: frameValue,});
    setOptions([...options,{...response.data.data,editing: false,},]);
    setNewFrame("");
    setFrameValue("");
    showToast("Door Frame Added Successfully","success");
  } catch (error) {
    showToast("Something went wrong","error");
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
       Door Frame
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
    placeholder="Enter Frame Name"
    value={newFrame}
    onChange={(e) =>
      setNewFrame(e.target.value)
    }
    style={{
      padding: "10px",
      width: "250px",
    }}
  />

  <select
    value={frameValue}
    onChange={(e) =>
      setFrameValue(e.target.value)
    }
    style={{
      padding: "10px",
      width: "250px",
    }}
  >
    <option value="">Enter Frame Value</option>
    <option value="full">Full</option>
    <option value="half">Half</option>
    <option value="no">No</option>
  </select>
  <button onClick={handleSave}>Add</button>
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
          Frame Options
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
              

 {item.editing ? (
  <div style={{display: "flex",gap: "10px",}}>
    <input value={item.frameName} onChange={(e) => handleChange(item._id,e.target.value )} />
    <select value={item.frameValue} onChange={(e) =>handleValueChange(item._id,e.target.value)} >
      <option value="full">full</option>
      <option value="half">half</option>
      <option value="no">no</option>
    </select>
  </div>
) : (

         <div  style={{  display: "flex", gap: "20px",}}>
     <span>{item.frameName}</span>
     <span>{item.frameValue} </span>
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

export default DoorFrame;