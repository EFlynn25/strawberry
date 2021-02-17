import './LPChat.css';

function LPChat() {
  function handleClick(e) {
    e.preventDefault();
    console.log("chat");
  }

  return (
    <div className="LPChat" onClick={handleClick}>
    </div>
  );
}

export default LPChat;
