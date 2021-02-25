import './LPDMs.css';

import DMChat from './LPDMs/DMChat'

function LPDMs() {
  return (
    <div className="LPDMs">
      {/*<p style={{color: "white", fontFamily: "Comic Sans MS", margin: "10px"}}>dms lol</p>*/}
      <DMChat chatEmail={"ethanflynn2007@gmail.com"} />
      <DMChat chatEmail={"toastmaster9804@gmail.com"} />
    </div>
  );
}

export default LPDMs;
