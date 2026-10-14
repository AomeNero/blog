import './scss/color-defination.scss';
import './scss/blog_basic.scss';
import './scss/highlight.scss';
import './scss/style.scss';

import { AomeNero } from './aomenero/aomenero';
import { followSystem } from './aomenero/theme-mode';
import { router } from './aomenero/router';
import { make_friends_list } from './utils/friend-link';
import FloatBtn from './components/float-btn';
import * as Utils from './utils/main';
import './components/rightbtn';
import Avatar from './components/avatar';

(window as any).AomeNero = AomeNero;
(window as any).Utils = Utils;

followSystem();
// 特性向路由订阅页面切换:组合根负责接线,router 保持通用
router.onPageChange(make_friends_list);
new FloatBtn();
new Avatar();
