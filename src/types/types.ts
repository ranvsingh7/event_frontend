import { JwtPayload } from "jwt-decode";

// types.ts
export interface EntryType {
    name: string;
    amount: number;
    count: number;
    _id?: string;
}

export interface CustomJwtPayload extends JwtPayload {
    id?: string;
}

export interface Event {
    _id: string;
    name: string;
    description: string;
    date: string;
    location: string;
    // createdBy: string;
    entryTypes: EntryType[];
    createdBy: {
        _id: string; // Ensure this matches your backend structure
      };
}

export interface BookEventDetails {
    eventId: string;
    eventUserId: string;
    name: string;
    email: string;
    mobile: string;
    amount: number;
    passCount: number;
    remainingCount: number;
    entryType: string;
}

export interface Booking extends BookEventDetails {
    _id: string;
    date: string;
    entryTitle: string;
    eventDate: string;
    createdAt: string
}

export interface PassData {
    _id: string;
    name: string;
    email: string;
    entryType: string;
    date: string;
    passCount: number;
    checkedCount: number;
    remainingCount: number;
  }