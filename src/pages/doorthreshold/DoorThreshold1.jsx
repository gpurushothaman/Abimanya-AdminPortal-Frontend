import React, { useEffect, useState } from "react";
import { getDoorThreshold, createDoorThreshold, updateDoorThreshold, } from "../../services/doorThresholdService";
import { useToast } from "../../contexts/ToastContext";

const DoorThreshold = () => {
  const { showToast } = useToast();
  const [newThreshold, setNewThreshold] = useState("");
  const [thresholdValue, setThresholdValue] = useState("");
  const [options, setOptions] = useState([]);



  useEffect(() => { fetchDoorThreshold(); }, []);
  const fetchDoorThreshold = async () => {
    try {
      const response = await getDoorThreshold();
      setOptions(response.data.data.map((item) => ({ ...item, editing: false, })));
    } catch (error) {
      console.error(error);
    }
  };




  const handleEdit = async (id) => {
    const selected = options.find((item) => item._id === id);
    if (selected.editing) {
      try {
        await updateDoorThreshold(id, { thresholdName: selected.thresholdName, thresholdValue: selected.thresholdValue, });
        showToast("Door Threshold Updated Successfully", "success");
      } catch (error) {
        showToast("Update Failed", "error");
        return;
      }
    }
    setOptions(options.map((item) => item._id === id ? { ...item, editing: !item.editing, } : item));
  };






  const handleChange = (id, value) => {
    setOptions(options.map((item) => item._id === id ? { ...item, thresholdName: value, } : item));
  };




  const handleValueChange = (id, value) => {
    setOptions(options.map((item) => item._id === id ? { ...item, thresholdValue: value, } : item));
  };


  const handleSave = async () => {
    if (!newThreshold.trim()) {
      showToast("Enter Threshold Name", "error");
      return;
    }
    if (!thresholdValue) {
      showToast("Select Threshold Value", "error");
      return;
    }
    try {
      const response = await createDoorThreshold({ thresholdName: newThreshold, thresholdValue: thresholdValue, });
      setOptions([...options, { ...response.data.data, editing: false, },]);
      setNewThreshold("");
      setThresholdValue("");
      showToast("Door Threshold Added Successfully", "success");
    } catch (error) {
      showToast("Something went wrong", "error");
    }
  };




  return (
    <div style={{ padding: "25px" }}>
      <h2 style={{ marginBottom: "20px",  color: "#333",  fontStyle: ""  }}>   Door Threshold  </h2>


      <div  style={{  marginBottom: "20px",  display: "flex",  gap: "10px",  }}>
        <input
          type="text"
          placeholder="Enter Threshold Name"
          value={newThreshold}
          onChange={(e) =>  setNewThreshold(e.target.value)  }
          style={{  padding: "10px",  width: "250px",  }}
        />

        <select  value={thresholdValue}  onChange={(e) =>  setThresholdValue(e.target.value)  }
          style={{  padding: "10px",  width: "250px",  }}
        >
          <option value="">  Enter Threshold Value  </option>
          <option value="yes">  Yes  </option>
          <option value="no">  No  </option>
        </select>
        <button onClick={handleSave}>  Add  </button>
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
          Threshold Options
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
            <div  style={{  display: "flex",  alignItems: "center",  gap: "15px",  flex: 1,  }} >


              {item.editing ? (
                <div style={{  display: "flex",  gap: "10px",  }}>
                  <input
                    value={item.thresholdName}  onChange={(e) => handleChange(  item._id,e.target.value ) } />
                  <select value={item.thresholdValue}  onChange={(e) =>  handleValueChange(  item._id,  e.target.value  )}
                  >
                    <option value="yes">  yes </option>
                    <option value="no"> no</option>
                  </select>
                </div>
              ) : (
                <div style={{  display: "flex",  gap: "20px",  }} >
                  <span>  {item.thresholdName}  </span>
                  <span>  {item.thresholdValue} </span>
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

export default DoorThreshold;