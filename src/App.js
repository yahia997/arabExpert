import {
  BrowserRouter as Router,
  Route,
  Routes
} from "react-router-dom";
// components //
import { Home, Nav } from "./home";
import { Challenges } from "./challenges";
import { Code } from "./code";
import { Auth } from "./auth";
import { UserPage } from "./user-page";
import { Top } from "./toper";
import { Info } from "./info";
import { First, ManageChallenge } from "./admin";

// css //
import "./styles/main.css";
import "./styles/editor-color.css";

const NotFound = () => {
  return <>
    <Nav />
    <section className="container top">
      <h1 className="w-100 text-center text-white py-5">عذرا لم يتم العثور علي الصفحة.</h1>
    </section>
  </>
}

function App() {
  return (<>
    <Router>
      <Routes>
        <Route path="/" element={<Home/>}/>
        <Route path="/challenge" element={<Challenges/>}/>
        <Route path="/challenge/:id" element={<Code/>}/>
        <Route path="/auth" element={<Auth/>}/>
        <Route path="/user/:id" element={<UserPage/>}/>
        <Route path="/top" element={<Top/>}/>
        <Route path="/info" element={<Info/>}/>
        <Route path="/admin" element={<First/>}/>
        <Route path="/admin/add" element={<ManageChallenge addOrUpadate="add" />}/>
        <Route path="/admin/update/:id" element={<ManageChallenge addOrUpadate="update"/>}/>
        <Route path="*" element={<NotFound/>}/>
      </Routes>
    </Router>
  </>);
}

export default App;
