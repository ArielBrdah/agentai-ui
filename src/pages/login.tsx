import Image from "next/image";
import styles from "../app/page.module.css";
import "bootstrap/dist/css/bootstrap.css";
import { Button, FloatingLabel, Form, InputGroup } from "react-bootstrap";
import { useState } from "react";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";


const UserSchema = z.object({
	name: z.string({
		required_error: "L'e-mail est obligatoire.",
	}).email().min(10,),
	password: z.string({
		required_error: "Le mot de passe est obligatoire.",
	}).min(4, 'Mot de passe, min. 4 caracteres.').max(20, 'Mot de passe, max. 20 caracteres.')
});

type UserSchemaType = z.infer<typeof UserSchema>

export default function Login() {


	const [isLoading, setIsLoading] = useState(false);
	const [notFound, setNotFound] = useState(false);
	const router = useRouter();

	const {
		register, // Pour connecter les inputs
		handleSubmit, // Pour gérer la soumission du formulaire
		formState: { errors }, // Pour accéder aux erreurs
	} = useForm<UserSchemaType>({
		resolver: zodResolver(UserSchema), // Connecter Zod
	});


	const onSubmit = async (data: UserSchemaType) => {
		console.log("Form submitted successfully", data);
		setIsLoading(true);
		try {
			const resp : any = await new Promise((resolve, reject) => {
				fetch("http://localhost:3000/auth/login", {
					method: 'POST',
					headers: {
						"Content-Type": 'application/json',
					},
					body: JSON.stringify(data)
				}).then(res => {
					resolve(res.json())
				}).then(newRes => resolve(newRes))
				.catch(error => reject(error))
			})	
			console.log(resp)
			setIsLoading(false)
			if(await !resp.results) {
				setNotFound(true)
				return;
			}
			localStorage.setItem("token", resp.token);
			router.push("/app");
		} catch(err){
			console.log(err);
		}
	};


	return (
		<div className={styles.page}>
			
			<h2 className="fw-bolder mt-auto text-dark display-1 mb-5 text-start">
				RobotAI 🤖
			</h2>
			
			<Form className="mt-4" onSubmit={handleSubmit(onSubmit)}>
				<Form.Group className="mb-3" controlId="formBasicEmail">
					<FloatingLabel
						controlId="floatingInput"
						label="Email address"
						className="mb-3"
					>
						<Form.Control type="email" placeholder="Enter email" {...register("name")} />
						{errors.name && <p className="text-danger">{errors.name.message}</p>}
					</FloatingLabel>
				</Form.Group>

				<Form.Group className="mb-3" controlId="formBasicPassword">
					<FloatingLabel controlId="floatingPassword" label="Password">
						<Form.Control type="password" placeholder="Password"  {...register("password")} />
						{errors.password && <p className="text-danger">{errors.password.message}</p>}
					</FloatingLabel>
				</Form.Group>
				{notFound ? <p className="alert alert-danger">L'email ou le mot de passe incorrecte, veuillez re-essayer.</p> : ""}

				<Button variant="danger" className="w-100 py-3" type="submit">
					{isLoading ? <span className="spinner-border"></span> : "Login"}
				</Button>
			</Form>
		</div>
	);
}
