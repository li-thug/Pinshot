import { Suspense, lazy } from "react";
import { RouterProvider, createBrowserRouter } from "react-router-dom";
import {
  Home,
  Explore,
  Login,
  Signup,
  HomeUser,
  PinDetails,
  Profile,
} from "@pages";
import { Spinner } from "@utils";
import ProtectedRoutes from "./ProtectedRoutes.";

const Root = lazy(() => import("@layouts/Root"));

const token = localStorage.getItem("usertoken");

export default function AppRoutes() {
  const routes = [
    {
      path: "/",
      name: "Home",
      element: token ? <HomeUser /> : <Home />,
    },
    {
      path: "explore",
      name: "Explore",
      element: <Explore />,
    },
    {
      path: "login",
      name: "Login",
      element: <Login />,
    },
    {
      path: "signup",
      name: "Signup",
      element: <Signup />,
    },
    {
      path: "pin/:pinId",
      name: "PinDetails",
      element: <PinDetails />,
    },
    {
      path: "profile/:userName",
      name: "Profile",
      element: (
        <ProtectedRoutes isAuth={token}>
          <Profile />,
        </ProtectedRoutes>
      ),
    },
  ];

  const router = createBrowserRouter([
    {
      path: "/",
      element: (
        <Suspense fallback={<Spinner text="PINSHOT" />}>
          <Root routes={routes} />
        </Suspense>
      ),
      children: routes.map((route) => ({
        index: route.path === "/",
        path: route.path === "/" ? undefined : route.path,
        element: route.element,
      })),
    },
  ]);
  return <RouterProvider router={router} />;
}
