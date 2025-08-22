import { createBrowserRouter } from "react-router-dom";
import Layout from "@/layout/Layout";

import Dashboard from "@/pages/Dashboard/Dashboard";

import CategoryPage from "@/pages/CategoryPage/CategoryPage";

export const router = createBrowserRouter([
    {
        path: "/",
        element: <Layout />,
        children: [
            {
                children: [
                    {
                        index: true,
                        element: <Dashboard />,
                    },
                    {
                        path: "/category",
                        element: <Dashboard />,
                    },
                    {
                        path: "category/:categoryName",
                        element: <CategoryPage />,
                    },
                ],
            },
        ],
    },
]);

export default router;
