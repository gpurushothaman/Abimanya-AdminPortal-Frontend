// material-ui
import { useTheme } from '@mui/material/styles';
import logo from "../../assets/logo/company-logo.png";
import Box from "@mui/material/Box";

// ==============================|| LOGO SVG ||============================== //

export default function LogoMain() {
  const theme = useTheme();
  return (
    <>
       <Box
      component="img"
      src={logo}
      alt="Logo"
      sx={{
        width: 120,
        height: "auto",
      }}
    />
    </>
  );
}
