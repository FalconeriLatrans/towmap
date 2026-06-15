switch (element.type) {
    case "seat":
      return <Seat element={element} />;
  
    case "stage":
      return <Stage element={element} />;
  
    case "flag":
      return <Flag element={element} />;
  
    default:
      return null;
  }