import { create } from "zustand";

type ReportModalState = {
  isOpen: boolean;
  open: () => void;
  close: () => void;
};

export const useReportModal = create<ReportModalState>((set) => ({
  isOpen: false,
  open: () => set({ isOpen: true }),
  close: () => set({ isOpen: false }),
}));
