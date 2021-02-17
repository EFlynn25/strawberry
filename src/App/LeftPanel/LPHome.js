import './LPHome.css';

function LPHome() {
  function handleClick(e) {
    e.preventDefault();
    console.log("home");
  }

  return (
    <div className="LPHome" onClick={handleClick}>
      <svg xmlns="http://www.w3.org/2000/svg" height="24" viewBox="0 0 24 24" width="24" className="homeIcon">
        <path d="M0 0h24v24H0z" fill="none"/>
        <path d="M10 20v-6h4v6h5v-8h3L12 3 2 12h3v8z"/>
      </svg>
      <h1 className="homeText">Home</h1>
    </div>
  );
}

export default LPHome;
