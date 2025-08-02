import { create } from "zustand";
import axios from "axios";

type GlobalStore = {
  checkout: number;
  getCheckout: (value: number) => void;
  id: number;
  takeID: (value: number) => void;
  title: string;
  getTitle: (value: string) => void;
  documentid: number;
  getDocumentId: (value: number) => void;
  bread: string;
  getBread: (value: string) => void;
  memberid: number;
  getMember: (value: number) => void;
  papercount: number;
  getPaperCount: (value: number) => void;
  sharecount: number;
  getShareCount: (value: number) => void;
  notificationCount: number;
  getNotification: (slug: number) => Promise<void>;
  caseid: number;
  getCaseId: (value: number) => void;
};

export const ZUSTAND = create<GlobalStore>((set) => ({
  id: 0,
  takeID: (value: number) => set({ id: value }),
  checkout: 0,
  getCheckout: (value: number) => set({ checkout: value }),
  title: "",
  getTitle: (value: string) => set({ title: value }),
  documentid: 0,
  getDocumentId: (value: number) => {
    set({ documentid: value });
  },
  bread: "",
  getBread: (value: string) => {
    set({ bread: value });
  },
  memberid: 0,
  getMember: (value: number) => set({ memberid: value }),
  papercount: 0,
  getPaperCount: (value: number) => set({ papercount: value }),
  sharecount: 0,
  getShareCount(value: number) {
    set({ sharecount: value });
  },
  notificationCount: 0,
  getNotification: async (slug: number) => {
    const res = await axios.get(`/api/badge/${slug}`);
    if (res.data.success) {
      set({ notificationCount: res.data.data.length });
    }
  },
  caseid: 0,
  getCaseId: (value: number) => {
    set({ caseid: value });
  },
}));
