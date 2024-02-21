import { Home, Explore } from "@pages";
import { Suspense, lazy } from "react";
import { RouterProvider, createBrowserRouter } from "react-router-dom";
import { Spinner } from "@utils";
import { Login } from "@pages";

const Root = lazy(() => import("@layouts/Root"));

export default function AppRoutes() {
  const routes = [
    {
      path: "/",
      name: "Home",
      element: <Home />,
    },
    {
      path: "Explore",
      name: "Explore",
      element: <Explore />,
    },
    {
      path: "login",
      name: "Login",
      element: <Login />,
    },
  ];
  const router = createBrowserRouter([
    {
      path: "/",
      element: (
        <Suspense fallback={<Spinner text="PINSHOT"/>}>
          <Root routes={routes}/>
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
