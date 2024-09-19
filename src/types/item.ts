// src/types/item.ts
export interface Item {
    itemCode: string;
    itemType: string;
    boxNumber: string;
    spaceNumber: string;
    examType: string;
    status: string;
    createdAt: string;
    // Add any other properties that should be part of the Item interface
};



export interface OverviewData {
    countbloco: number;
    countlaminas: number;
    blocoChange: string;
    laminasChange: string;
};

export interface VisaoGeralProps {
    items: Item[];
    overviewData: OverviewData | null;
};

export interface User {
    name: string;
    photo: string;
  }

export const firebaseConfig = {
    apiKey: "AIzaSyBC_T___UQrgPjRuA9Bv5pCi-Es9MHMDSk",
    authDomain: "file-lab.firebaseapp.com",
    projectId: "file-lab",
    storageBucket: "file-lab.appspot.com",
    messagingSenderId: "936477114424",
    appId: "1:936477114424:web:c3cb3ecdc342fde09226cd",
    measurementId: "G-HELPVWV0KF"
  };