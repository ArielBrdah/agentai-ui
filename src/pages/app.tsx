import Image from "next/image";
import styles from "../app/page.module.css";
import "bootstrap/dist/css/bootstrap.css";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { resolveObjectURL } from "buffer";
import Dashboard from "@/components/App"

export default function App() {

	const [display, setDisplay] = useState(false)
	const verifyToken = async () => {
		const token = localStorage.getItem('token')

		var authorized = await new Promise(async (resolve,reject) => {
			fetch('http://localhost:3000/auth/verify', {
				method: "POST",
				headers: {
					"Content-Type": "application/json"
				},
				body: JSON.stringify({token})
			}).then(res => res.json())
				.then(res => {
					console.log(res)
					// resolve(res)
					if (!res.valid) router.push('/login')
					else setDisplay(true)
					})
				.catch(err => reject(err))


		})
	}

	const router = useRouter()
	useEffect(() => {
		verifyToken()
	}, [])
	return (<>
		{
			display ?
				<Dashboard /> : <></>
		}
	</>
	);
}
