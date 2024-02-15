import { Suspense, lazy } from "react";
import { RouterProvider, createBrowserRouter } from "react-router-dom";

const Root = lazy(() => import("@layouts/Root"));

export default function AppRoutes() {
  const router = createBrowserRouter([
    {
      path: "/",
      element: (
        <Suspense fallback={<div>...loading</div>}>
          <Root />
        </Suspense>
      ),
    },
  ]);
  return <RouterProvider router={router} />;
}
