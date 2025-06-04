export interface NavigationItem {
  id: string;
  title: string;
  type: 'item' | 'collapse' | 'group';
  translate?: string;
  icon?: string;
  hidden?: boolean;
  url?: string;
  classes?: string;
  exactMatch?: boolean;
  external?: boolean;
  target?: boolean;
  breadcrumbs?: boolean;

  children?: NavigationItem[];
}

export const NavigationItems: NavigationItem[] = [
  {
    id: 'navigation',
    title: 'Navigation',
    type: 'group',
    icon: 'icon-navigation',
    children: [
      {
        id: 'dashboard',
        title: 'Dashboard',
        type: 'item',
        url: '/dashboard',
        icon: 'feather icon-home',
        classes: 'nav-item'
      }
    ]
  },
  {
    id: 'quản lý',
    title: 'Quản lý',
    type: 'group',
    icon: 'feather icon-settings',
    children: [
      {
        id: 'list-product',
        title: 'Danh sách sản phẩm',
        type: 'item',
        url: '/product/list-product',
        classes: 'nav-item',
        icon: 'feather icon-package'
      },
      {
        id: 'order',
        title: 'Danh sách đơn hàng',
        type: 'item',
        url: '/order', 
        classes: 'nav-item',
        icon: 'feather icon-shopping-cart'
      },
      {
        id: 'category',
        title: 'Danh sách danh mục',
        type: 'item',
        url: '/category',
        classes: 'nav-item',
        icon: 'feather icon-grid'
      },
      {
        id: 'article',
        title: 'Danh sách bài viết',
        type: 'item',
        url: '/article',
        classes: 'nav-item',
        icon: 'feather icon-file-text' 
      },
      {
        id: 'users',
        title: 'Danh sách người dùng',
        type: 'item',
        url: '/users',
        classes: 'nav-item',
        icon: 'feather icon-users'
      },
      {
        id: 'evaluate',
        title: 'Danh sách đánh giá',
        type: 'item',
        url: '/evaluate',
        classes: 'nav-item',
        icon: 'feather icon-star'
      },
      {
        id: 'request-consultation',
        title: 'Danh sách yêu cầu tư vấn',
        type: 'item',
        url: '/request-consultation',
        classes: 'nav-item',
        icon: 'feather icon-message-circle'
      },
    ]
  },
  {
    id: 'suport',
    title: 'Mô tả',
    type: 'group',
    icon: 'feather icon-layers',
    children: [
      {
        id: 'support-page',
        title: 'Mô tả',
        type: 'item',
        url: '/sample-page',
        classes: 'nav-item',
        icon: 'feather icon-file'
      },
    ]
  }
];
