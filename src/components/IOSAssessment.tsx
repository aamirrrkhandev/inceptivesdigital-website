"use client";
import { useEffect } from "react";
import { mountIOSAssessment } from "./ios-assessment.js";
export default function IOSAssessment() {
  useEffect(() => mountIOSAssessment(), []);
  return null;
}
