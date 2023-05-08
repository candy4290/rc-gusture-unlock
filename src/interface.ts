import type React from 'react';

export interface GustureLockProps {
  className?: string;
  style?: React.CSSProperties;
  callBack?: (psw: string) => void;
  initColor?: string; /* 初始状态下的颜色 */
  successColor?: string; /* 成功的颜色 */
  errorColor?: string; /* 失败的颜色 */
  activeColor?: string; /* 选中状态下的颜色 */
  size?: number; /* 画布大小，长宽一致 */
  nums?: number; /* 行列数 */
}

export type GustureLockRef = {
  success: () => void;
  error: () => void;
  reset: () => void;
}