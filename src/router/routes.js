
const routes = [
  {
    path: '/',
    component: () => import('layouts/AuthLayout.vue'),
    children: [
      {
        path: '',
        name: 'landing',
        component: () => import('pages/IndexPage.vue')
      },
      { path: 'admin/login', component: () => import('src/pages/Admin/AdminLoginPage.vue') },
      { path: 'member/register', component: () => import('src/pages/RegisterPage.vue') },
      { path: 'member/login', component: () => import('src/pages/LoginPage.vue') },
    ],
    meta: { auth: false }
  },
  {
    path: '/',
    component: () => import('layouts/MainLayout.vue'),
    children: [
      {
        path: 'dashboard',
        name: 'dashboard',
        component: () => import('pages/Dashboard.vue')
      },
      {
        path: 'history',
        name: 'history',
        component: () => import('pages/HistoryPage.vue')
      },
      {
        path: 'note',
        name: 'note',
        component: () => import('pages/NotePage.vue')
      },
      {
        path: 'recycle',
        name: 'recycle',
        component: () => import('pages/RecyclePage.vue')
      },
    ],
    meta: { auth: false }
  },
  {
    path: '/admin',
    component: () => import('layouts/AdminMainLayout.vue'),
    children: [
      {
        path: 'dashboard',
        name: 'admindashboard',
        component: () => import('pages/Admin/Dashboard.vue')
      },
      {
        path: 'manage-patients',
        name: 'patients',
        component: () => import('pages/Admin/Patients.vue')
      },
      {
        path: 'manage-users',
        name: 'users',
        component: () => import('pages/Admin/Users.vue')
      },
      {
        path: 'action-logs',
        name: 'auditlogs',
        component: () => import('pages/Admin/Logs.vue')
      },
      {
        path: 'settings',
        name: 'settings',
        component: () => import('pages/Admin/Settings.vue')
      },
    ],
    meta: { auth: false }
  },

  // Always leave this as last one,
  // but you can also remove it
  {
    path: '/:catchAll(.*)*',
    component: () => import('pages/ErrorNotFound.vue')
  }
]

export default routes
