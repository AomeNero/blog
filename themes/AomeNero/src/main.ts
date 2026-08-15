import './scss/color-defination.scss';
import './scss/blog_basic.scss';
import './scss/highlight.scss';
import './scss/style.scss';

import { AomeNero } from './aomenero/aomenero';
import FloatBtn from './components/float-btn';
import * as Utils from './utils/main';
import './components/rightbtn';
import Avatar from './components/avatar';

(window as any).AomeNero = AomeNero;
(window as any).Utils = Utils;

new FloatBtn();
new Avatar();
