---
title: 设计字符Logo
tags:
banner: /images/banner-20.webp
---



Agent非常适合设计制作ASCII 艺术字，直接给模板就能学习修改字符，用来做CLI程序Logo打印或者CRT调试打印都很有意思。可以把下面的代码复制给AI，更改任意字符使用。

![ASCII ](/images/ASCII .png)

## 彩色版 · 黑字 + 彩色边框(白底)

<pre style="background:linear-gradient(#ffffff,#ffffff) padding-box,linear-gradient(90deg,#e74c3c,#e67e22,#d4ac0d,#27ae60,#17a2b8,#2980b9,#c2185b,#e74c3c) border-box;border:8px solid transparent;border-radius:12px;color:#000;padding:16px 22px;line-height:1.1;font-family:ui-monospace,SFMono-Regular,Menlo,Consolas,monospace;overflow:auto">
 █████<span style="color:#e74c3c">╗</span>  ██████<span style="color:#e67e22">╗</span> ██<span style="color:#d4ac0d">╗</span>     ██<span style="color:#d4ac0d">╗</span>███████<span style="color:#27ae60">╗</span>███<span style="color:#17a2b8">╗</span>   ██<span style="color:#17a2b8">╗</span>███████<span style="color:#2980b9">╗</span>██████<span style="color:#c2185b">╗</span>  ██████<span style="color:#e74c3c">╗</span> 
██<span style="color:#e74c3c">╔══</span>██<span style="color:#e74c3c">╗</span>██<span style="color:#e67e22">╔═══</span>██<span style="color:#e67e22">╗</span>███<span style="color:#d4ac0d">╗</span>   ███<span style="color:#d4ac0d">║</span>██<span style="color:#27ae60">╔════╝</span>████<span style="color:#17a2b8">╗</span>  ██<span style="color:#17a2b8">║</span>██<span style="color:#2980b9">╔════╝</span>██<span style="color:#c2185b">╔══</span>██<span style="color:#c2185b">╗</span>██<span style="color:#e74c3c">╔═══</span>██<span style="color:#e74c3c">╗</span>
███████<span style="color:#e74c3c">║</span>██<span style="color:#e67e22">║</span>   ██<span style="color:#e67e22">║</span>████<span style="color:#d4ac0d">╗</span> ████<span style="color:#d4ac0d">║</span>█████<span style="color:#27ae60">╗</span>  ██<span style="color:#17a2b8">╔</span>██<span style="color:#17a2b8">╗</span> ██<span style="color:#17a2b8">║</span>█████<span style="color:#2980b9">╗</span>  ██████<span style="color:#c2185b">╔╝</span>██<span style="color:#e74c3c">║</span>   ██<span style="color:#e74c3c">║</span>
██<span style="color:#e74c3c">╔══</span>██<span style="color:#e74c3c">║</span>██<span style="color:#e67e22">║</span>   ██<span style="color:#e67e22">║</span>██<span style="color:#d4ac0d">╔</span>████<span style="color:#d4ac0d">╔</span>██<span style="color:#d4ac0d">║</span>██<span style="color:#27ae60">╔══╝</span>  ██<span style="color:#17a2b8">║╚</span>██<span style="color:#17a2b8">╗</span>██<span style="color:#17a2b8">║</span>██<span style="color:#2980b9">╔══╝</span>  ██<span style="color:#c2185b">╔══</span>██<span style="color:#c2185b">╗</span>██<span style="color:#e74c3c">║</span>   ██<span style="color:#e74c3c">║</span>
██<span style="color:#e74c3c">║</span>  ██<span style="color:#e74c3c">║</span><span style="color:#e67e22">╚</span>██████<span style="color:#e67e22">╔╝</span>██<span style="color:#d4ac0d">║╚</span>██<span style="color:#d4ac0d">╔╝</span>██<span style="color:#d4ac0d">║</span>███████<span style="color:#27ae60">╗</span>██<span style="color:#17a2b8">║</span> <span style="color:#17a2b8">╚</span>████<span style="color:#17a2b8">║</span>███████<span style="color:#2980b9">╗</span>██<span style="color:#c2185b">║</span>  ██<span style="color:#c2185b">║</span><span style="color:#e74c3c">╚</span>██████<span style="color:#e74c3c">╔╝</span>
<span style="color:#e74c3c">╚═╝</span>  <span style="color:#e74c3c">╚═╝</span> <span style="color:#e67e22">╚═════╝</span> <span style="color:#d4ac0d">╚═╝</span> <span style="color:#d4ac0d">╚═╝</span> <span style="color:#d4ac0d">╚═╝</span><span style="color:#27ae60">╚══════╝</span><span style="color:#17a2b8">╚═╝</span>  <span style="color:#17a2b8">╚═══╝</span><span style="color:#2980b9">╚══════╝</span><span style="color:#c2185b">╚═╝</span>  <span style="color:#c2185b">╚═╝</span> <span style="color:#e74c3c">╚═════╝</span> 
</pre>

``` html
<pre style="background:linear-gradient(#ffffff,#ffffff) padding-box,linear-gradient(90deg,#e74c3c,#e67e22,#d4ac0d,#27ae60,#17a2b8,#2980b9,#c2185b,#e74c3c) border-box;border:8px solid transparent;border-radius:12px;color:#000;padding:16px 22px;line-height:1.1;font-family:ui-monospace,SFMono-Regular,Menlo,Consolas,monospace;overflow:auto">
 █████<span style="color:#e74c3c">╗</span>  ██████<span style="color:#e67e22">╗</span> ██<span style="color:#d4ac0d">╗</span>     ██<span style="color:#d4ac0d">╗</span>███████<span style="color:#27ae60">╗</span>███<span style="color:#17a2b8">╗</span>   ██<span style="color:#17a2b8">╗</span>███████<span style="color:#2980b9">╗</span>██████<span style="color:#c2185b">╗</span>  ██████<span style="color:#e74c3c">╗</span> 
██<span style="color:#e74c3c">╔══</span>██<span style="color:#e74c3c">╗</span>██<span style="color:#e67e22">╔═══</span>██<span style="color:#e67e22">╗</span>███<span style="color:#d4ac0d">╗</span>   ███<span style="color:#d4ac0d">║</span>██<span style="color:#27ae60">╔════╝</span>████<span style="color:#17a2b8">╗</span>  ██<span style="color:#17a2b8">║</span>██<span style="color:#2980b9">╔════╝</span>██<span style="color:#c2185b">╔══</span>██<span style="color:#c2185b">╗</span>██<span style="color:#e74c3c">╔═══</span>██<span style="color:#e74c3c">╗</span>
███████<span style="color:#e74c3c">║</span>██<span style="color:#e67e22">║</span>   ██<span style="color:#e67e22">║</span>████<span style="color:#d4ac0d">╗</span> ████<span style="color:#d4ac0d">║</span>█████<span style="color:#27ae60">╗</span>  ██<span style="color:#17a2b8">╔</span>██<span style="color:#17a2b8">╗</span> ██<span style="color:#17a2b8">║</span>█████<span style="color:#2980b9">╗</span>  ██████<span style="color:#c2185b">╔╝</span>██<span style="color:#e74c3c">║</span>   ██<span style="color:#e74c3c">║</span>
██<span style="color:#e74c3c">╔══</span>██<span style="color:#e74c3c">║</span>██<span style="color:#e67e22">║</span>   ██<span style="color:#e67e22">║</span>██<span style="color:#d4ac0d">╔</span>████<span style="color:#d4ac0d">╔</span>██<span style="color:#d4ac0d">║</span>██<span style="color:#27ae60">╔══╝</span>  ██<span style="color:#17a2b8">║╚</span>██<span style="color:#17a2b8">╗</span>██<span style="color:#17a2b8">║</span>██<span style="color:#2980b9">╔══╝</span>  ██<span style="color:#c2185b">╔══</span>██<span style="color:#c2185b">╗</span>██<span style="color:#e74c3c">║</span>   ██<span style="color:#e74c3c">║</span>
██<span style="color:#e74c3c">║</span>  ██<span style="color:#e74c3c">║</span><span style="color:#e67e22">╚</span>██████<span style="color:#e67e22">╔╝</span>██<span style="color:#d4ac0d">║╚</span>██<span style="color:#d4ac0d">╔╝</span>██<span style="color:#d4ac0d">║</span>███████<span style="color:#27ae60">╗</span>██<span style="color:#17a2b8">║</span> <span style="color:#17a2b8">╚</span>████<span style="color:#17a2b8">║</span>███████<span style="color:#2980b9">╗</span>██<span style="color:#c2185b">║</span>  ██<span style="color:#c2185b">║</span><span style="color:#e74c3c">╚</span>██████<span style="color:#e74c3c">╔╝</span>
<span style="color:#e74c3c">╚═╝</span>  <span style="color:#e74c3c">╚═╝</span> <span style="color:#e67e22">╚═════╝</span> <span style="color:#d4ac0d">╚═╝</span> <span style="color:#d4ac0d">╚═╝</span> <span style="color:#d4ac0d">╚═╝</span><span style="color:#27ae60">╚══════╝</span><span style="color:#17a2b8">╚═╝</span>  <span style="color:#17a2b8">╚═══╝</span><span style="color:#2980b9">╚══════╝</span><span style="color:#c2185b">╚═╝</span>  <span style="color:#c2185b">╚═╝</span> <span style="color:#e74c3c">╚═════╝</span> 
</pre>
```

## 颜色对照

| 字母 | 位置 | ANSI 码 | 颜色 | 色值 |
|------|------|---------|------|------|
| A | 1 | `\x1b[91m` | 亮红 | `#ff5555` |
| O | 2 | `\x1b[38;5;208m` | 橙 | `#ff8c42` |
| M | 3 | `\x1b[33m` | 黄 | `#ffd700` |
| E | 4 | `\x1b[32m` | 绿 | `#50fa7b` |
| N | 5 | `\x1b[36m` | 青 | `#8be9fd` |
| E | 6 | `\x1b[34m` | 蓝 | `#7aa2f7` |
| R | 7 | `\x1b[35m` | 品红 | `#ff79c6` |
| O | 8 | `\x1b[91m` | 亮红 | `#ff5555` |
