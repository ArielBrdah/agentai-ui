import Image from "next/image";
import styles from "../app/page.module.css";
import "bootstrap/dist/css/bootstrap.css";
import { Button, FloatingLabel, Form, InputGroup } from "react-bootstrap";
import { useEffect, useState } from "react";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";


export default function Logout() {

	const router = useRouter()

	useEffect(() => {
		localStorage.setItem('token','');
		router.push('/login')
	})
	return (<></>);
}
