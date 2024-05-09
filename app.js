function App() {
    const [isHovering, setIsHovering] = useState(false);
  
    const handleMouseOver = () => {
      setIsHovering(true);
    };
  
    const handleMouseOut = () => {
      setIsHovering(false);
    };
    return (
      <div>
        <div>
          <div
            className={isHovering ? "grow" : ""}
            onMouseOver={handleMouseOver}
            onMouseOut={handleMouseOut}
          >
            Hover
          </div>
        </div>
      </div>
    );
  }