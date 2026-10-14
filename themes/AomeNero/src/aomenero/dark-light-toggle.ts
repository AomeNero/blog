import { applyTheme, currentTheme, writePreference } from './theme-mode';

/**
 * 明暗切换按钮:把当前生效主题的反面写入为显式偏好。
 * 偏好为 system 的用户点一次即固定为一侧,再点切到另一侧(与旧版两态循环体验一致)。
 */
export function darkLightToggle(): void {
  writePreference(currentTheme() === 'dark' ? 'light' : 'dark');
  applyTheme();
}
