import { ConnectedRouter } from "connected-react-router";
import React, { Suspense } from "react";
import { Provider } from "react-redux";
import RoutesComponent from "./router/RoutesComponent";
import { configStore, getHistory } from "./configs/configureStore";
import Spinner from "./router/spinner/Spinner";
import { ToastContainer } from "react-toastify";
//router
import IndexRouters from "./router/index"

//scss
import "./assets/scss/socialv.scss"
import "react-toastify/dist/ReactToastify.css";

const store = configStore();

function App() {
  return (
    <React.Fragment>
      <Suspense fallback={<Spinner />}>
        <Provider store={store}>
          <ToastContainer />
          <ConnectedRouter history={getHistory()}>
            <RoutesComponent />
          </ConnectedRouter>
        </Provider>
      </Suspense>
    </React.Fragment>
  );
}

export default App;
