import { Outlet } from "react-router-dom";
// import propTypes from "prop-types";
import { Header } from "@components";

export default function Root() {
  return (
    <div>
      <main className="min-vh-100">
        <Outlet />
        <Header/>
      </main>
    </div>
  );
}
