import React, { useEffect, useState } from "react";
import { getDoorOrientation, updateDoorOrientation, } from "../../services/doorOrientationService";
import { useToast } from '../../contexts/ToastContext';
import Switch from "@mui/material/Switch";
import FormControlLabel from "@mui/material/FormControlLabel";


const DoorOrientation = () => {
  const { showToast } = useToast();
  const [options, setOptions] = useState([]);



  useEffect(() => { fetchDoorOrientation(); }, []);
  const fetchDoorOrientation = async () => {
    try {
      const response = await getDoorOrientation();
      setOptions(response.data.data.map((item) => ({ ...item, editing: false, })));
    } catch (error) {
      console.error(error);
    }
  };




  const saveOrientation = async (
    flag,
    data,
    updateId
  ) => {
    if (flag) {
      try {
        const response =
          await updateDoorOrientation(
            updateId,
            data
          );

        if (response?.data?.success) {
          showToast(
            "Orientation option updated successfully",
            "success"
          );
        } else {
          showToast(
            "Orientation option not updated",
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

    const result =
      options.find(
        (item) => item._id === id
      );

    saveOrientation(
      flag,
      result,
      id
    );
  };





  const handleChange = (
    id,
    value,
    category
  ) => {
    setOptions((prev) =>
      prev.map((item) => {
        if (item._id !== id)
          return item;

        if (category === "data") {
          return {
            ...item,
            DoorOrientationname: value,
          };
        }

        if (category === "status") {
          const updated = {
            ...item,
            status: value,
          };

          saveOrientation(
            true,
            updated,
            id
          );

          return updated;
        }

        return item;
      })
    );
  };






  return (
    <div style={{ padding: "25px" }}>
      <h2
        style={{
          marginBottom: "20px",
          color: "#333",
          fontStyle: "",
        }}
      >
        Door Orientation
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
          Orientation Options
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
                <div
                  style={{
                    display: "flex",
                    gap: "10px",
                  }}
                >
                  <input
                    type="text"
                    value={item.DoorOrientationname}
                    onChange={(e) =>
                      handleChange(item._id, e.target.value, "data")
                    }
                    style={{
                      padding: "6px 10px",
                      width: "180px",
                    }}

                  />
                </div>



              ) : (

                <span
                  style={{
                    fontSize: "15px",
                  }}
                >
                  {item.DoorOrientationname}
                </span>
              )}
            </div>

            <div>
              <button
                onClick={() =>
                  handleEdit(
                    item._id,
                    item.editing
                  )
                }
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

              <FormControlLabel
                control={
                  <Switch
                    checked={
                      item?.status || false
                    }
                    onChange={(e) =>
                      handleChange(
                        item._id,
                        e.target.checked,
                        "status"
                      )
                    }
                    color="success"
                  />
                }
                label={
                  item?.status
                    ? "Active"
                    : "Inactive"
                }
              />
            </div>





          </div>
        ))}
      </div>

    </div>
  );
};

export default DoorOrientation;