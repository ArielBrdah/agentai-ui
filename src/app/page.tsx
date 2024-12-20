"use client";
import Image from "next/image";
import styles from "./page.module.css";
import "bootstrap/dist/css/bootstrap.css";
import Login from "@/pages/login";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
// import Agents from "@/pages/Agents";

import { useState } from "react";
import App from "@/pages/App";

export default function Home() {
  return <Login />;
}
