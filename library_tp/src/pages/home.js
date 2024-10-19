import { GetInfo } from "./accounts/account_info.js";
import { Link } from "react-router-dom";

function Home() {
  const Exit = async () => {
    var info = GetInfo();
    try {
      console.log(info);

      localStorage.clear();
    } catch (error) {
      alert("Ошабка выхода!");
    }
  };

  return (
    <>
      <h1>Hello world!</h1>

      <div> {JSON.parse(localStorage.getItem("account")).username}</div>
      <div> {JSON.parse(localStorage.getItem("account")).role}</div>

      <Link className="buttonExit" onClick={(e) => Exit(e)} to="/login">
        EXIT
      </Link>
    </>
  );
}

export default Home;
