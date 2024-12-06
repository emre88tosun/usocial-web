import React from 'react';
import AuthenticatedAppLayout from '@components/layout/AuthenticatedAppLayout';
import {
  createBrowserRouter,
  RouterProvider as DomRouterProvider,
} from 'react-router-dom';
import Login from '@pages/Login';
import Register from '@pages/Register';
import Discover from '@pages/Discover';
import Chats from '@pages/Chats';

export default function RouterProvider() {
  const router = createBrowserRouter([
    {
      path: '/login',
      element: <Login />,
    },
    {
      path: '/register',
      element: <Register />,
    },
    {
      element: <AuthenticatedAppLayout />,
      children: [
        {
          path: '/chats',
          element: <Chats />,
        },
        {
          path: '/',
          element: <Discover />,
        },
      ],
    },
  ]);

  return <DomRouterProvider router={router} />;
}
