import './scss/color-defination.scss';
import './scss/blog_basic.scss';
import './scss/highlight.scss';
import './scss/style.scss';

import { AomeNero } from './aomenero/aomenero';
import * as Utils from './utils/main';
import FloatBtn from './components/float-btn';
import './components/rightbtn';

(window as any).AomeNero = AomeNero;
(window as any).Utils = Utils;

new FloatBtn();
