"use client";
import { useState } from "react";
import { Service, Staff } from "../types";

export interface BookingState {
  selectedServices: Service[];
  selectedStaff: Staff | null;
  selectedDate: string;
  selectedSlot: { start: string; end: string } | null;
  customerPhone: string;
  customerName: string;
  step: number;
}

const initialState: BookingState = {
  selectedServices: [],
  selectedStaff: null,
  selectedDate: "",
  selectedSlot: null,
  customerPhone: "",
  customerName: "",
  step: 1,
};

export function useBooking() {
  const [booking, setBooking] = useState<BookingState>(initialState);

  const addService = (service: Service) => {
    setBooking((prev) => ({
      ...prev,
      selectedServices: prev.selectedServices.find((s) => s.id === service.id)
        ? prev.selectedServices.filter((s) => s.id !== service.id)
        : [...prev.selectedServices, service],
    }));
  };

  const setStaff = (staff: Staff | null) =>
    setBooking((prev) => ({ ...prev, selectedStaff: staff }));

  const setDate = (date: string) =>
    setBooking((prev) => ({ ...prev, selectedDate: date, selectedSlot: null }));

  const setSlot = (slot: { start: string; end: string } | null) =>
    setBooking((prev) => ({ ...prev, selectedSlot: slot }));

  const setStep = (step: number) =>
    setBooking((prev) => ({ ...prev, step }));

  const setCustomer = (phone: string, name: string) =>
    setBooking((prev) => ({ ...prev, customerPhone: phone, customerName: name }));

  const reset = () => setBooking(initialState);

  const totalDuration = booking.selectedServices.reduce(
    (sum, s) => sum + s.duration_minutes, 0
  );
  const totalPrice = booking.selectedServices.reduce(
    (sum, s) => sum + s.price, 0
  );

  return {
    booking,
    addService,
    setStaff,
    setDate,
    setSlot,
    setStep,
    setCustomer,
    reset,
    totalDuration,
    totalPrice,
  };
}
