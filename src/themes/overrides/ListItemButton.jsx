// ==============================|| OVERRIDES - LIST ITEM ICON ||============================== //

export default function ListItemButton(theme) {
  return {
    MuiListItemButton: {
      styleOverrides: {
        root: {
          '&.Mui-selected': {
            color: '#2E7D32',
            '& .MuiListItemIcon-root': {
              color: '#2E7D32'
            }
          }
        }
      }
    }
  };
}
