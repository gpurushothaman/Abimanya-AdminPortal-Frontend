import React, { useEffect, useState } from "react";
import {
  getADoorFrameSections,
  updateDoorFrameSection,
} from "../../services/doorFrameTypeSectionService";
import { useToast } from "../../contexts/ToastContext";
import Switch from "@mui/material/Switch";
import {
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  Stack,
  FormControlLabel,
} from "@mui/material";

const DoorFrameTypeSection = () => {
  const { showToast } = useToast();

  // =========================================================
  // MAIN DATA
  // =========================================================

  const [designs, setDesigns] = useState([]);
  const [subDesigns, setSubDesigns] = useState([]);
  const [frames, setFrames] = useState([]);
  const [frameTypes, setFrameTypes] = useState([]);
  const [frameOptions, setFrameOptions] = useState([]);
  const [sections, setSections] = useState([]);

  // =========================================================
  // SELECTED VALUES
  // =========================================================

  const [selectedDesign, setSelectedDesign] = useState("");
  const [selectedSubDesign, setSelectedSubDesign] = useState("");
  const [selectedFrame, setSelectedFrame] = useState("");
  const [selectedFrameType, setSelectedFrameType] = useState("");
  const [selectedFrameOption, setSelectedFrameOption] = useState("");

  // =========================================================
  // FETCH INITIAL DATA
  // =========================================================

  useEffect(() => {
    fetchDoorFrameSections();
  }, []);

  const fetchDoorFrameSections = async () => {
    try {
      const response = await getADoorFrameSections();

      console.log("Door Frame Section Response:", response);

      if (response?.data?.success) {
        setDesigns(response?.data?.data || []);
      } else {
        showToast(
          "Unable to load door frame section data",
          "error"
        );
      }
    } catch (error) {
      console.error(
        "Error fetching door frame sections:",
        error
      );

      showToast(
        "Unable to load door frame section data",
        "error"
      );
    }
  };

  // =========================================================
  // DROPDOWN STYLE
  // =========================================================

  const dropdownStyle = {
    "& .MuiInputLabel-root": {
      color: "#66BB6A",
    },

    "& .MuiInputLabel-root.Mui-focused": {
      color: "#66BB6A",
    },

    "& .MuiOutlinedInput-root": {
      "& fieldset": {
        borderColor: "#A5D6A7",
      },

      "&:hover fieldset": {
        borderColor: "#66BB6A",
      },

      "&.Mui-focused fieldset": {
        borderColor: "#66BB6A",
      },
    },

    "& .MuiSvgIcon-root": {
      color: "#66BB6A",
    },
  };

  // =========================================================
  // DESIGN CHANGE
  // =========================================================

  const handleDesignChange = (e) => {
    const id = e.target.value;

    setSelectedDesign(id);

    // Reset next selections
    setSelectedSubDesign("");
    setSelectedFrame("");
    setSelectedFrameType("");
    setSelectedFrameOption("");

    // Reset next data
    setSubDesigns([]);
    setFrames([]);
    setFrameTypes([]);
    setFrameOptions([]);
    setSections([]);

    // Find selected design
    const design = designs.find(
      (item) => item._id === id
    );

    // Load Sub Designs
    setSubDesigns(design?.subdesign || []);
  };

  // =========================================================
  // SUB DESIGN CHANGE
  // =========================================================

  const handleSubDesignChange = (e) => {
    const id = e.target.value;

    setSelectedSubDesign(id);

    // Reset next selections
    setSelectedFrame("");
    setSelectedFrameType("");
    setSelectedFrameOption("");

    // Reset next data
    setFrames([]);
    setFrameTypes([]);
    setFrameOptions([]);
    setSections([]);

    // Find selected Sub Design
    const subDesign = subDesigns.find(
      (item) => item._id === id
    );

    // Load Frames
    setFrames(subDesign?.frame || []);
  };

  // =========================================================
  // FRAME CHANGE
  // =========================================================

  const handleFrameChange = (e) => {
    const id = e.target.value;

    setSelectedFrame(id);

    // Reset next selections
    setSelectedFrameType("");
    setSelectedFrameOption("");

    // Reset next data
    setFrameTypes([]);
    setFrameOptions([]);
    setSections([]);

    // Find selected Frame
    const frame = frames.find(
      (item) => item._id === id
    );

    // Load Frame Types
    setFrameTypes(frame?.frameTypes || []);
  };

  // =========================================================
  // FRAME TYPE CHANGE
  // =========================================================
  // Frame Type select pannumbothu
  // Frame Type-kulla irukkura OPTIONS mattum load aagum.
  //
  // Sections inga load panna koodathu.
  // Sections -> Frame Option select pannumbothu mattum load aagum.
  // =========================================================

  const handleFrameTypeChange = (e) => {
    const id = e.target.value;

    setSelectedFrameType(id);

    // Reset Frame Option
    setSelectedFrameOption("");

    // Reset Sections
    setSections([]);

    // Find selected Frame Type
    const frameType = frameTypes.find(
      (item) => item._id === id
    );

    console.log(
      "Selected Frame Type:",
      frameType
    );

    // Load Frame Options
    setFrameOptions(
      frameType?.options || []
    );
  };

  // =========================================================
  // FRAME OPTION CHANGE
  // =========================================================
  // User Frame Option select pannumbothu
  // selected option-kulla irukkura sections mattum
  // eduthu display pannum.
  // =========================================================

  const handleFrameOptionChange = (e) => {
    const id = e.target.value;

    setSelectedFrameOption(id);

    // Clear old sections
    setSections([]);

    // Find selected Frame Option
    const frameOption = frameOptions.find(
      (item) => item._id === id
    );

    console.log(
      "Selected Frame Option:",
      frameOption
    );

    if (!frameOption) {
      return;
    }

    // Get sections from selected option
    const optionSections =
      frameOption?.sections || [];

    console.log(
      "Frame Option Sections:",
      optionSections
    );

    setSections(optionSections);
  };

  // =========================================================
  // SAVE SECTION
  // =========================================================

  const saveSection = async (section) => {
    try {
      const updateData = {
        frameTypeOptionId:
          section.frameTypeOptionId,

        frameSectionName:
          section.frameSectionName,

        frameSectionValue:
          section.frameSectionValue,

        status: section.status,
      };

      const response =
        await updateDoorFrameSection(
          section._id,
          updateData
        );

      if (response?.data?.success) {
        showToast(
          "Frame section updated successfully",
          "success"
        );
      } else {
        showToast(
          "Frame section not updated",
          "error"
        );
      }
    } catch (error) {
      console.error(
        "Error updating frame section:",
        error
      );

      showToast(
        "Something went wrong",
        "error"
      );
    }
  };

  // =========================================================
  // EDIT SECTION
  // =========================================================

  const handleEdit = (id, editing) => {
    const updatedSections = sections.map(
      (section) =>
        section._id === id
          ? {
              ...section,
              editing: !editing,
            }
          : section
    );

    setSections(updatedSections);

    // Save when clicking ✔️
    if (editing) {
      const updatedSection =
        updatedSections.find(
          (section) =>
            section._id === id
        );

      if (updatedSection) {
        saveSection(updatedSection);
      }
    }
  };

  // =========================================================
  // SECTION INPUT CHANGE
  // =========================================================

  const handleSectionChange = (
    id,
    value,
    field
  ) => {
    setSections((prev) =>
      prev.map((section) =>
        section._id === id
          ? {
              ...section,
              [field]: value,
            }
          : section
      )
    );
  };

  // =========================================================
  // STATUS CHANGE
  // =========================================================

  const handleStatusChange = async (
    id,
    value
  ) => {
    const updatedSections =
      sections.map((section) =>
        section._id === id
          ? {
              ...section,
              status: value,
            }
          : section
      );

    setSections(updatedSections);

    const updatedSection =
      updatedSections.find(
        (section) =>
          section._id === id
      );

    if (updatedSection) {
      await saveSection(updatedSection);
    }
  };

  // =========================================================
  // JSX
  // =========================================================

  return (
    <div
      style={{
        padding: "25px",
      }}
    >
      {/* =====================================================
          TITLE
      ===================================================== */}

      <h2
        style={{
          marginBottom: "25px",
          color: "#333",
          fontWeight: "600",
        }}
      >
        Door Frame Type Sections
      </h2>

      {/* =====================================================
          DROPDOWNS
      ===================================================== */}

      <Stack
        direction="row"
        spacing={2}
        sx={{
          mb: 3,
    width: "100%",
    flexWrap: "nowrap",
    alignItems: "center",
        }}
      >
        {/* ===================================================
            DESIGN
        =================================================== */}

        <FormControl
          fullWidth
          size="small"
          sx={{
            ...dropdownStyle,
            flex: 1,
            minWidth: "0px",
          }}
        >
          <InputLabel>
            Design
          </InputLabel>

          <Select
            value={selectedDesign}
            label="Design"
            onChange={handleDesignChange}
          >
            <MenuItem value="">
              <em>
                Select Design
              </em>
            </MenuItem>

            {designs.map((item) => (
              <MenuItem
                key={item._id}
                value={item._id}
              >
                {item.name}
              </MenuItem>
            ))}
          </Select>
        </FormControl>

        {/* ===================================================
            SUB DESIGN
        =================================================== */}

        <FormControl
          fullWidth
          size="small"
          disabled={!selectedDesign}
          sx={{
            ...dropdownStyle,
            flex: 1,
            minWidth: "0px",
          }}
        >
          <InputLabel>
            Sub Design
          </InputLabel>

          <Select
            value={selectedSubDesign}
            label="Sub Design"
            onChange={handleSubDesignChange}
          >
            <MenuItem value="">
              <em>
                Select Sub Design
              </em>
            </MenuItem>

            {subDesigns.map((item) => (
              <MenuItem
                key={item._id}
                value={item._id}
              >
                {item.name}
              </MenuItem>
            ))}
          </Select>
        </FormControl>

        {/* ===================================================
            FRAME
        =================================================== */}

        <FormControl
          fullWidth
          size="small"
          disabled={!selectedSubDesign}
          sx={{
            ...dropdownStyle,
            flex: 1,
            minWidth: "0px",
          }}
        >
          <InputLabel>
            Frame
          </InputLabel>

          <Select
            value={selectedFrame}
            label="Frame"
            onChange={handleFrameChange}
          >
            <MenuItem value="">
              <em>
                Select Frame
              </em>
            </MenuItem>

            {frames.map((item) => (
              <MenuItem
                key={item._id}
                value={item._id}
              >
                {item.frameName}
              </MenuItem>
            ))}
          </Select>
        </FormControl>

        {/* ===================================================
            FRAME TYPE
        =================================================== */}

        <FormControl
          fullWidth
          size="small"
          disabled={!selectedFrame}
          sx={{
            ...dropdownStyle,
            flex: 1,
            minWidth: "0px",
          }}
        >
          <InputLabel>
            Frame Type
          </InputLabel>

          <Select
            value={selectedFrameType}
            label="Frame Type"
            onChange={handleFrameTypeChange}
          >
            <MenuItem value="">
              <em>
                Select Frame Type
              </em>
            </MenuItem>

            {frameTypes.map((item) => (
              <MenuItem
                key={item._id}
                value={item._id}
              >
                {item.frameTypeName}
              </MenuItem>
            ))}
          </Select>
        </FormControl>

        {/* ===================================================
            FRAME OPTIONS
        =================================================== */}

        <FormControl
          fullWidth
          size="small"
          disabled={!selectedFrameType}
          sx={{
            ...dropdownStyle,
            flex: 1,
            minWidth: "0px",
          }}
        >
          <InputLabel>
            Frame Options
          </InputLabel>

          <Select
            value={selectedFrameOption}
            label="Frame Options"
            onChange={
              handleFrameOptionChange
            }
          >
            <MenuItem value="">
              <em>
                Select Frame Option
              </em>
            </MenuItem>

            {frameOptions.map((item) => (
              <MenuItem
                key={item._id}
                value={item._id}
              >
                {item.frameTypeOptionName}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
      </Stack>

      {/* =====================================================
          FRAME SECTION CARD
      ===================================================== */}

      <div
        style={{
          width: "550px",
          background: "#fff",
          border: "1px solid #ddd",
          borderRadius: "8px",
          overflow: "hidden",
          boxShadow:
            "0 2px 6px rgba(0,0,0,0.08)",
        }}
      >
        {/* ===================================================
            CARD HEADER
        =================================================== */}

        <div
          style={{
            padding: "16px 22px",
            background: "#ccfb96",
            borderBottom:
              "1px solid #ddd",
            fontWeight: "600",
            fontSize: "17px",
          }}
        >
          Frame Section Sections
        </div>

        {/* ===================================================
            NO DATA
        =================================================== */}

        {selectedFrameOption &&
        sections.length === 0 ? (
          <div
            style={{
              padding: "35px",
              textAlign: "center",
              color: "#777",
            }}
          >
            No frame sections found
          </div>
        ) : null}

        {/* ===================================================
            SECTION LIST
        =================================================== */}

        {sections.map((item) => (
          <div
            key={item._id}
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent:
                "space-between",
              padding: "16px 20px",
              borderBottom:
                "1px solid #eee",
            }}
          >
            {/* =================================================
                SECTION NAME
            ================================================= */}

            <div
              style={{
                flex: 1,
                display: "flex",
                alignItems: "center",
              }}
            >
              {item.editing ? (
                <input
                  type="text"
                  value={
                    item.frameSectionName ||
                    ""
                  }
                  onChange={(e) =>
                    handleSectionChange(
                      item._id,
                      e.target.value,
                      "frameSectionName"
                    )
                  }
                  style={{
                    width: "220px",
                    padding: "8px 10px",
                    border:
                      "1px solid #66BB6A",
                    borderRadius: "5px",
                    outline: "none",
                    fontSize: "15px",
                  }}
                />
              ) : (
                <span
                  style={{
                    fontSize: "15px",
                    color: "#333",
                  }}
                >
                  {item.frameSectionName ||
                    item.frameSectionValue}
                </span>
              )}
            </div>

            {/* =================================================
                EDIT + STATUS
            ================================================= */}

            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: "12px",
              }}
            >
              {/* EDIT BUTTON */}

              <button
                onClick={() =>
                  handleEdit(
                    item._id,
                    item.editing
                  )
                }
                style={{
                  border: "none",
                  background:
                    "transparent",
                  cursor: "pointer",
                  fontSize: "18px",
                }}
              >
                {item.editing
                  ? "✔️"
                  : "✏️"}
              </button>

              {/* STATUS */}

              <FormControlLabel
                control={
                  <Switch
                    checked={
                      item.status ||
                      false
                    }
                    onChange={(e) =>
                      handleStatusChange(
                        item._id,
                        e.target.checked
                      )
                    }
                    color="success"
                  />
                }
                label={
                  item.status
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

export default DoorFrameTypeSection;