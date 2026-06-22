import React, { useEffect, useState } from "react";
import { getDoorJambLocation, updateDoorJambLocation, } from "../../services/doorjambLocationService";
import { useToast } from "../../contexts/ToastContext";

const JambLocation = () => {
  const { showToast } = useToast();
  const [options, setOptions] = useState([]);


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




  const saveLocation = async (
    flag,
    opt,
    updateId
  ) => {
    if (flag) {
      try {
        const result =
          opt.filter(
            (item) => item._id === updateId
          )?.[0];

        const response =
          await updateDoorJambLocation(
            updateId,
            result
          );

        if (response?.data?.success) {
          showToast(
            "Location option updated successfully",
            "success"
          );
        } else {
          showToast(
            "Location option not updated",
            "error"
          );
        }
      } catch (error) {
        console.error(error);
        showToast(
          "Something went wrong",
          "error"
        );
      }
    }
  };

  const handleEdit = (id, flag) => {
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

    saveLocation(
      flag,
      options,
      id
    );
  };





  const handleChange = (id, value) => {
    setOptions(options.map((item) => item._id === id ? { ...item, jambLocationName: value, } : item));
  };








  return (
    <div style={{ padding: "25px" }}>

      <h2 style={{ marginBottom: "20px", color: "#333", fontWeight: "600", }}>Jamb Location</h2>





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


                <input
                  type="text"
                  value={item.jambLocationName}
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
                  {item.jambLocationName}
                </span>
              )}
            </div>




            <div>
              <button onClick={() => handleEdit(item._id, item.editing)}
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