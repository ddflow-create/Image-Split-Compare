import { AppTheme } from '../types';

export interface ThemeStyles {
  root: string;
  panel: string;
  panelSub: string;
  panelCard: string;
  panelCardActive: string;
  canvas: string;
  buttonDefault: string;
  buttonActive: string;
  border: string;
  textPrimary: string;
  textSecondary: string;
  textMuted: string;
  statusBg: string;
  checkeredClass: string;
  dotGridClass: string;
  modalBg: string;
  modalCard: string;
}

export const THEMES: Record<AppTheme, ThemeStyles> = {
  dark: {
    root: 'bg-[#0A0A0A] text-[#E0E0E0]',
    panel: 'bg-[#161616] border-[#2A2A2A]',
    panelSub: 'bg-[#101010] border-[#2A2A2A]',
    panelCard: 'bg-[#141414] border-[#2A2A2A] hover:border-[#444444]',
    panelCardActive: 'bg-[#181818] border-blue-500/80 ring-1 ring-blue-500/40',
    canvas: 'bg-[#0A0A0A]',
    buttonDefault: 'bg-[#1A1A1A] hover:bg-[#262626] text-[#CCCCCC] hover:text-white border-[#2E2E2E]',
    buttonActive: 'bg-blue-600 text-white shadow-sm font-semibold',
    border: 'border-[#2A2A2A]',
    textPrimary: 'text-[#E0E0E0]',
    textSecondary: 'text-[#888888]',
    textMuted: 'text-[#666666]',
    statusBg: 'bg-[#121212] border-[#2A2A2A] text-[#999999]',
    checkeredClass: 'bg-checkered',
    dotGridClass: 'bg-dot-grid',
    modalBg: 'bg-[#0A0A0A]/85',
    modalCard: 'bg-[#161616] border-[#2A2A2A]',
  },
  silver: {
    root: 'bg-[#1C2026] text-[#E8ECF2]',
    panel: 'bg-[#242A33] border-[#384150]',
    panelSub: 'bg-[#1B2028] border-[#343D4C]',
    panelCard: 'bg-[#232932] border-[#384150] hover:border-[#525E72]',
    panelCardActive: 'bg-[#28303C] border-blue-400 ring-1 ring-blue-400/40',
    canvas: 'bg-[#161A20]',
    buttonDefault: 'bg-[#2C333E] hover:bg-[#38414E] text-[#D0D7E2] hover:text-white border-[#3F4958]',
    buttonActive: 'bg-blue-500 text-white shadow-sm font-semibold',
    border: 'border-[#384150]',
    textPrimary: 'text-[#E8ECF2]',
    textSecondary: 'text-[#9AA5B6]',
    textMuted: 'text-[#6E7B8E]',
    statusBg: 'bg-[#1E232B] border-[#384150] text-[#A0AAB8]',
    checkeredClass: 'bg-checkered',
    dotGridClass: 'bg-dot-grid',
    modalBg: 'bg-[#12151A]/85',
    modalCard: 'bg-[#242A33] border-[#384150]',
  },
  light: {
    root: 'bg-[#F4F5F7] text-[#1E232A]',
    panel: 'bg-[#FFFFFF] border-[#DCE0E6]',
    panelSub: 'bg-[#F0F2F5] border-[#DCE0E6]',
    panelCard: 'bg-[#FFFFFF] border-[#DCE0E6] hover:border-[#B8C0CC]',
    panelCardActive: 'bg-[#EEF2FF] border-blue-600 ring-1 ring-blue-600/30',
    canvas: 'bg-[#F8F9FA]',
    buttonDefault: 'bg-[#F4F6F8] hover:bg-[#EAEFF5] text-[#2C3442] border-[#D0D6E0]',
    buttonActive: 'bg-blue-600 text-white shadow-sm font-semibold',
    border: 'border-[#DCE0E6]',
    textPrimary: 'text-[#181C24]',
    textSecondary: 'text-[#576071]',
    textMuted: 'text-[#8C96A6]',
    statusBg: 'bg-[#FFFFFF] border-[#DCE0E6] text-[#576071]',
    checkeredClass: 'bg-checkered-light',
    dotGridClass: 'bg-dot-grid-light',
    modalBg: 'bg-[#000000]/50',
    modalCard: 'bg-[#FFFFFF] border-[#DCE0E6] text-[#181C24]',
  },
};
