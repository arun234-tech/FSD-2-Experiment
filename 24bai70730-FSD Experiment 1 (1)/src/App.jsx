<<<<<<< HEAD
import "./App.css";
import PostComposer from "./components/PostComposer";

function App() {
  return <PostComposer />;
}

export default App;
=======
import { Provider } from "react-redux";
import { store } from "@/app/store";
import Dashboard from "@/pages/Dashboard";

/** Root app component — wraps everything in the Redux Provider */
export default function App() {
  return (
    <Provider store={store}>
      <Dashboard />
    </Provider>
  );
}
>>>>>>> e2da21bfa5229c3a2a486d73cb43e5967803513a
