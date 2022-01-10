const privateRoutes = [
  {
    path: "/",
    exact: true,
    loader: () => import("../layouts/dashboard/default"),
    menu: false,
    label: "Trang chủ",
    permissionRequired: null,
    icon: "home",
  }
  /* 

  {
    path: "/call",
    exact: true,
    loader: () => import("./CallPage/index"),
  }, */
];

const publicRoutes = [
];

const errorRoutes = [
  {
    path: "/401",
    exact: true,
    loader: () => import("../views/dashboard/errors/error404"),
  },
  {
    path: "/403",
    exact: true,
    loader: () => import("../views/dashboard/errors/error404"),
  },
  {
    path: "/404",
    exact: true,
    loader: () => import("../views/dashboard/errors/error404"),
  },
  {
    path: "/500",
    exact: true,
    loader: () => import("../views/dashboard/errors/error500"),
  },
];

const authRoutes = [
  {
    path: "/auth/sign-in",
    exact: true,
    loader: () => import("../views/dashboard/auth/sign-in"),
  },
  {
    path: "/auth/sign-up",
    exact: true,
    loader: () => import("../views/dashboard/auth/sign-up"),
  },
  {
    path: "/auth/recoverpw",
    exact: true,
    loader: () => import("../views/dashboard/auth/recoverpw"),
  },
  {
    path: "/auth/confirm-mail",
    exact: true,
    loader: () => import("../views/dashboard/auth/confirm-mail"),
  },
  {
    path: "/auth/2FA",
    exact: true,
    loader: () => import("../views/dashboard/auth/2FAQR"),
  },
  {
    path: "/new-password",
    exact: true,
    loader: () => import("../views/dashboard/auth/changePassword"),
  },
];

export default {
  privateRoutes,
  publicRoutes,
  authRoutes,
  errorRoutes,
};
