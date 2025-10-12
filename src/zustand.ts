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
  notificationCount: number;
  getNotification: (slug: number) => Promise<void>;
  caseid: number;
  getCaseId: (value: number) => void;
  fetchpaper: (id: number) => Promise<void>;
  employeeId: number;
  getEmployeeId: (value: number) => void;
  confirmId: number;
  takeConfirmId: (value: number) => void;
  fetchshare: (value: number) => Promise<void>;
  sharecount: number;
  confirmpaperid: number;
  triggerPaper: (value: number) => void;
  countdocument: number;
  checkcountdoc: (value: number) => Promise<void>;
  filename: string;
  takeFilename:(value:string)=>void;
  getOTP: (value:number)=>Promise<void>;
  takeAllShare: any;
  getAllShare: (value:number) => Promise<void>;
    countPlan: number;
    countReport: number;
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
  sharecount: 0,
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
  fetchpaper: async (id: number) => {
    const response = await axios.post("/api/document/confirm", {
      authId: id,
    });
    if (response.data.success) {
      set({ papercount: response.data.data });
    }
  },
  employeeId: 0,
  getEmployeeId: (value: number) => {
    set({ employeeId: value });
  },
  confirmId: 0,
  takeConfirmId: (value: number) => set({ confirmId: value }),
  fetchshare: async function (id: number) {
    const response = await axios.post("/api/document/share", {
      authId: id,
    });
    if (response.data.success) {
      set({ sharecount: response.data.data });
    }
  },
  confirmpaperid: 0,
  triggerPaper: (value: number) => set({ confirmpaperid: value }),
  countdocument: 0,
  checkcountdoc: async function (id: number) {
    const response = await axios.post("/api/document/list", {
      user: id,
    });
    if (response.data.success) {
      set({ countdocument: response.data.data });
    }
  },
  filename: "",
  takeFilename:(value:string)=>set({filename:value}),
  getOTP: async function(id: number){
      await axios.put("/api/otp/created", {
        authuserId: id,
      });
  },
    takeAllShare: {},
    getAllShare: async function(id: number) {
      const response = await axios.put(`/api/employee`,{
          id
      });
      if (response.data.success) {
          set({ takeAllShare: response.data.data });
          set({countPlan: response.data.data !== null ? response.data.data.sharegroup.length : 0 });
          set({countReport: response.data.data !== null ? response.data.data.sharereport.length : 0 });
      }
    },
    countPlan: 0,
    countReport: 0
}));
