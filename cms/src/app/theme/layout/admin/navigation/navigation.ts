export interface NavigationItem {
  id: string;
  title: string;
  type: 'item' | 'collapse' | 'group';
  icon?: string;
  url?: string;
  classes?: string;
  external?: boolean;
  target?: boolean;
  breadcrumbs?: boolean;
  hidden?: boolean;
  children?: NavigationItem[];
}

// ✅ CẬP NHẬT navigation items - LOẠI BỎ dashboard
export const NavigationItems: NavigationItem[] = [
  // ✅ LOẠI BỎ dashboard item
  // {
  //   id: 'dashboard',
  //   title: 'Dashboard',
  //   type: 'item',
  //   icon: 'feather icon-home',
  //   url: '/dashboard'
  // },
  {
    id: 'main',
    title: 'Quản lý chính',
    type: 'group',
    children: [
      {
        id: 'product',
        title: 'Quản lý sản phẩm',
        type: 'collapse',
        icon: 'feather icon-package',
        children: [
          {
            id: 'list-product',
            title: 'Danh sách sản phẩm',
            type: 'item',
            url: '/product/list-product'
          },
          {
            id: 'add-product',
            title: 'Thêm sản phẩm',
            type: 'item',
            url: '/product/add-product'
          }
        ]
      },
      {
        id: 'order',
        title: 'Quản lý đơn hàng',
        type: 'collapse',
        icon: 'feather icon-shopping-cart',
        children: [
          {
            id: 'list-order',
            title: 'Danh sách đơn hàng',
            type: 'item',
            url: '/order/list-order'
          }
        ]
      },
      {
        id: 'category',
        title: 'Quản lý danh mục',
        type: 'collapse',
        icon: 'feather icon-grid',
        children: [
          {
            id: 'list-category',
            title: 'Danh sách danh mục',
            type: 'item',
            url: '/category/list-category'
          },
          {
            id: 'add-category',
            title: 'Thêm danh mục',
            type: 'item',
            url: '/category/add-category'
          }
        ]
      },
      {
        id: 'article',
        title: 'Quản lý bài viết',
        type: 'collapse',
        icon: 'feather icon-edit',
        children: [
          {
            id: 'list-article',
            title: 'Danh sách bài viết',
            type: 'item',
            url: '/article/list-article'
          },
          {
            id: 'add-article',
            title: 'Thêm bài viết',
            type: 'item',
            url: '/article/add-article'
          }
        ]
      },
      {
        id: 'consultation',
        title: 'Yêu cầu tư vấn',
        type: 'item',
        icon: 'feather icon-help-circle',
        url: '/request-consultation/list-consultation'
      }
    ]
  },
  {
    id: 'admin',
    title: 'Quản trị hệ thống',
    type: 'group',
    children: [
      {
        id: 'users',
        title: 'Quản lý người dùng',
        type: 'item',
        icon: 'feather icon-users',
        url: '/users/list'
      }
    ]
  }
];
