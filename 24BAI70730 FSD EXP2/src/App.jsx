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
