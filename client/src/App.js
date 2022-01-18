import { ConnectedRouter } from "connected-react-router";
import React, { Suspense } from "react";
import { Provider, ReactReduxContext } from "react-redux";
import RoutesComponent from "./router/RoutesComponent";
import { configStore, getHistory } from "./configs/configureStore";
import Spinner from "./router/spinner/Spinner";
import { ToastContainer } from "react-toastify";

//scss
import "./assets/scss/socialv.scss";
import "react-toastify/dist/ReactToastify.css";

const store = configStore();

function App() {
  return (
    <Suspense fallback={<Spinner />}>
      <Provider store={store}>
        <ToastContainer />
        <ConnectedRouter history={getHistory()} context={ReactReduxContext}>
          <RoutesComponent />
        </ConnectedRouter>
      </Provider>
    </Suspense>
  );
}

export default App;
