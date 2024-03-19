import "./App.css";
import MainPage from "./components/MainPage";
import { Toaster } from "react-hot-toast";

function App() {
  return (
    <>
      <Toaster
        toastOptions={{
          style: {
            width: "500px",
          },
        }}
      />
      <MainPage />
    </>
  );
}

export default App;
