import { NavigationBar }  from "./layout/navBar";
import { WelcomePage }    from "./WelcomePage";
//import { TodoItemsPage }  from "./TodoItemsPage";
import { RealmAppProvider, useRealmApp } from "./RealmApp";
import { ThemeProvider } from "./Theme";
import { AppName } from "./AppName";
import { appId } from "../realm.json";
import "./App.css";
import { AppRouteProviser } from "./rounter/AppRouteProvider";

export default function AppWithRealm() {
  return (
    <ThemeProvider>
      <RealmAppProvider appId={appId}>
        <App />
      </RealmAppProvider>
    </ThemeProvider>
  );
}

function App(){
  const { currentUser, logOut } = useRealmApp();
  return (
    <div className="App">
      <NavigationBar 
        currentUser={currentUser}
        AppName={AppName} 
        logOut={logOut}/>
       {currentUser ? <AppRouteProviser /> : <WelcomePage />}
    </div>
  );
}
