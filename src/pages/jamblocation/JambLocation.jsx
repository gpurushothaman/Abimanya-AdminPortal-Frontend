import React, { useEffect, useState } from "react";
import { getDoorJambLocation, createDoorJambLocation, updateDoorJambLocation, } from "../../services/doorjambLocationService";
import { useToast } from "../../contexts/ToastContext";

const JambLocation = () => {
  const { showToast } = useToast();
  const [newLocation, setNewLocation] = useState("");
  const [locationValue, setLocationValue] = useState("");
  const [options, setOptions] = useState([]);

  //  FETCH function get a data from user
  useEffect(() => {
    fetchJambLocation();
  }, []);
  const fetchJambLocation = async () => {
    try {
      const response = await getDoorJambLocation();
      setOptions(response.data.data.map((item) => ({ ...item, editing: false, })));
    } catch (error) {
      console.error(error);
    }
  };
  // HANDLEDIT function for edit something for user
  const handleEdit = async (id) => {
    const selected = options.find((item) => item._id === id);
    if (selected.editing) {
      try {
        await updateDoorJambLocation(id, { jambLocationName: selected.jambLocationName, jambLocationValue: selected.jambLocationValue, });
        showToast("Jamb Location Updated Successfully", "success");
      }
      catch (error) {
        showToast("Update Failed", "error");
        return;
      }
    }
    setOptions(options.map((item) => item._id === id ? { ...item, editing: !item.editing, } : item));
  };
  // HANDLE function for change value from user
  const handleChange = (id, value) => {
    setOptions(options.map((item) => item._id === id ? { ...item, jambLocationName: value, } : item));
  };
  // HANDLECHANGE function for user change the value
  const handleValueChange = (id, value) => {
    setOptions(options.map((item) => item._id === id ? { ...item, jambLocationValue: value, } : item));
  };
  // HANDLESAVE function for add user value in dadabase
  const handleSave = async () => {
    if (!newLocation.trim()) {
      showToast("Enter Jamb Location Name", "error");
      return;
    }
    if (!locationValue) {
      showToast("Select Location Value", "error");
      return;
    }
    try {
      const response = await createDoorJambLocation({ jambLocationName: newLocation, jambLocationValue: locationValue, });
      setOptions([...options, { ...response.data.data, editing: false, },]);
      setNewLocation("");
      setLocationValue("");
      showToast("Jamb Location Added Successfully", "success");
    } catch (error) {
      showToast("Something went wrong", "error");
    }
  };




  return (
    <div style={{ padding: "25px" }}>

      <h2 style={{ marginBottom: "20px", color: "#333", fontWeight: "600", }}>Jamb Location</h2>

      <div style={{ marginBottom: "20px", display: "flex", gap: "10px", }}>
        <input type="text" placeholder="Enter Jamb Location Name" value={newLocation} onChange={(e) => setNewLocation(e.target.value)}
          style={{ padding: "10px", width: "250px", }} />

        <select value={locationValue} onChange={(e) => setLocationValue(e.target.value)}
          style={{ padding: "10px", width: "250px", }}
        >
          <option value="">Enter Location</option>
          <option value="front">Front</option>
          <option value="back">Back</option>
        </select>
        <button onClick={handleSave}>Add</button>
      </div>



      <div
        style={{ width: "550px", background: "#fff", border: "1px solid #dcdcdc", borderRadius: "8px", overflow: "hidden", boxShadow: "0 2px 6px rgba(0,0,0,0.08)", }}
      >
        <div
          style={{ padding: "14px 18px", background: "#f5f5f5", borderBottom: "1px solid #ddd", fontWeight: "600", fontSize: "16px", }}
        >
          Location Options
        </div>

        {options.map((item) => (
          <div key={item._id}
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
                <div
                  style={{
                    display: "flex",
                    gap: "10px",
                  }}
                >
                  <input value={item.jambLocationName} onChange={(e) => handleChange(item._id, e.target.value)} />
                  <select value={item.jambLocationValue} onChange={(e) => handleValueChange(item._id, e.target.value)}>
                    <option value="front">front</option>
                    <option value="back">back</option>
                  </select>
                </div>
              ) : (
                <div style={{ display: "flex", gap: "120px", }}>
                  <span>{item.jambLocationName}</span>
                  <span>{item.jambLocationValue}</span>
                </div>
              )}
            </div>




            <div>
              <button onClick={() => handleEdit(item._id)}
                style={{ border: "none", background: "transparent", cursor: "pointer", fontSize: "18px", marginRight: "15px", }}>
                {item.editing ? "✔️" : "✏️"}
              </button>


            </div>
          </div>
        ))}
      </div>




    </div>
  );
};

export default JambLocation;