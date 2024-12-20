import "bootstrap/dist/css/bootstrap.css";
import "bootstrap-icons/font/bootstrap-icons.css"
import { Details } from "./Details";
import { useEffect, useState } from "react";

export default function Agents() {
	const [show, setShow] = useState(false);
	const [name, setName] = useState('')
	const [settings, setSettings] = useState('')
	const [titleForm, setTitleForm] = useState('')
	const [dataUpdate, setDataUpdate] = useState<{uuid:string;name:string;settings:string;}>({uuid: '',name:'',settings:''})

	const handleClose = () => setShow(false);
	const handleShow = () => setShow(true);

	const [agents, setAgents] = useState<Agent[]>([]);
	const [loading, setLoading] = useState<boolean>(true);
	const [error, setError] = useState<string>("");
	const [isEditMode, setIsEditMode] = useState(false)

	useEffect(() => {
		const fetchAgents = async () => {
			try {
				const response = await fetch("http://localhost:3000/agents", {
					method: "GET",
					headers: {
						"Authorization": "Bearer " + localStorage.getItem('token')
					}
				});
				if (!response.ok) {
					throw new Error("Failed to fetch agents");
				}
				const data = await response.json();
				setAgents(data);
			} catch (error) {
				setError(error.message || "An error occurred");
			} finally {
				setLoading(false);
			}
		};

		fetchAgents();
	}, []);

	if (loading) {
		return <div>Loading...</div>;
	}

	if (error) {
		return <div>Error: {error}</div>;
	}

	function addAgentModal() {
		setTitleForm('Ajout')
		setName("")
		setSettings("")
		handleShow()
		setIsEditMode(false)
	}

	async function enableAgent(e: any) {
		// console.log(e.target.id)
		// console.log(e.target.checked)
		setAgents((prevAgents) =>
			prevAgents.map((agent) =>
				agent.uuid === e.target.id ? { ...agent, inProduction: e.target.checked } : agent
			)
		);
		try {
			const response = await fetch(`http://localhost:3000/agents/${e.target.id}`, {
				method: 'PUT',
				headers: {
					'Content-Type': 'application/json',
					'Authorization': 'Bearer ' + localStorage.getItem('token')
				},
				body: JSON.stringify({ inProduction: e.target.checked })
			});

			if (!response.ok) {
				throw new Error('Failed to update agent');
			}

			const updatedAgent = await response.json();
			console.log('Agent updated successfully:', updatedAgent);
			alert('Agent #' + e.target.id + " " + (e.target.checked ? "active" : "desactive") + "!")
		} catch (error) {
			console.error('Error updating agent:', error);
			setAgents((prevAgents) =>
				prevAgents.map((agent) =>
					agent.uuid === e.target.id ? { ...agent, inProduction: !e.target.checked } : agent
				)
			);
		}
	}

	async function addAgent() {


		try {
			const response = await fetch('http://localhost:3000/agents', {
				method: 'POST', // Méthode POST pour envoyer les données
				headers: {
					'Content-Type': 'application/json',
					'Authorization': "Bearer " + localStorage.getItem('token')
				},
				body: JSON.stringify({ name, settings, inProduction: false })
			});

			if (!response.ok) {
				throw new Error('Failed to add agent');
			}

			const data = await response.json();
			setAgents((prevAgents) => [...prevAgents, data]);
			handleClose();
			console.log('Agent added successfully:', data);
		} catch (error) {
			console.error('Error adding agent:', error);
		}
	}

	async function removeAgent(e: React.MouseEvent) {
		const uuid = (e.target as HTMLElement).closest('.delete-agent')?.getAttribute('data-id');

		const yes = confirm("Voulez vous supprimer " + uuid)
		if (!yes) return;
		try {
			const response = await fetch(`http://localhost:3000/agents/${uuid}`, {
				method: 'DELETE',
				headers: {
					'Authorization': 'Bearer ' + localStorage.getItem('token'),
				},
			});

			if (!response.ok) {
				throw new Error('Failed to delete agent');
			}

			// Mettre à jour la liste des agents localement
			setAgents((prevAgents) => prevAgents.filter((agent) => agent.uuid !== uuid));
			alert(`Agent #${uuid} supprimé avec succès !`);
		} catch (error) {
			console.error('Erreur lors de la suppression de l\'agent:', error);
			alert(`Erreur : Impossible de supprimer l'agent #${uuid}`);
		}
	}


	async function updateAgent() {
		// const uuid = (e.target as HTMLElement).closest('.update-agent')?.getAttribute('data-id');
		const uuid = dataUpdate.uuid
		const _name = name
		const _settings = settings
		try {
			const response = await fetch(`http://localhost:3000/agents/${uuid}`, {
				method: 'PUT',
				headers: {
					'Authorization': 'Bearer ' + localStorage.getItem('token'),
					'Content-Type': 'application/json'
				},
				body: JSON.stringify({ name: _name, settings: _settings })
			});

			if (!response.ok) {
				throw new Error('Failed to update agent');
			}

			setAgents((prevAgents) => 
				prevAgents.map((agent) =>
					agent.uuid === uuid ? { ...agent, name: _name, settings: _settings } : agent
				)
			);
				alert(`Agent #${uuid} modifie avec succès !`);
		} catch (error) {
			console.error('Erreur lors de la modification de l\'agent:', error);
			alert(`Erreur : Impossible de modifier l'agent #${uuid}`);
		}
	}

	function handleShowModalUpdate(e: React.MouseEvent) {
		const element = (e.target as HTMLElement).closest('.update-agent');

		// Récupérer les attributs de l'élément parent
		const uuid = element?.getAttribute('data-id');
		const s = element?.getAttribute('data-settings');
		const n = element?.getAttribute('data-name');
		setDataUpdate({name: n, settings: s, uuid: uuid})

		if (s !== null && s !== undefined) {
			setSettings(s);
		} else {
			console.log('La valeur est invalide');
		}
		if (n !== null && n !== undefined) {
			setName(n)
		} else {
			console.log('La valeur est invalide');
		}
		setTitleForm('Modifier')
		setIsEditMode(true)
		handleShow()
	}


	function routerSubmit(e: React.MouseEvent ) {
		if(isEditMode){
			updateAgent(e)
		}else {
			addAgent()
		}
	}

	return (
		<>
			<div className="container">
				<h3 className="fw-bolder">Liste des agents</h3>
				<div className="btn btn-primary" onClick={addAgentModal}>Ajouter un agent</div>
				<table className="table table-hover border border-1 my-5">
					<thead>
						<tr>
							<th>Activer</th>
							<th>Robot</th>
							<th>Nom</th>
							<th>Creer le</th>
							<th>Identifiant</th>
							<th>Actions</th>
						</tr>
					</thead>
					<tbody>
						{agents.map((agent) => (
							<tr key={agent.id} >
								<td style={{ verticalAlign: "middle" }} align="center">
									<div className="form-check form-switch m-auto d-flex align-items-center justify-content-center">
										<input className="form-check-input" type="checkbox" role="switch" id={agent.uuid} checked={agent.inProduction} onClick={enableAgent} />
									</div>
								</td>
								<td style={{ verticalAlign: "middle" }} align="center">🤖</td>
								<td className="fw-bolder" style={{ verticalAlign: "middle" }}>{agent.name}</td>
								<td style={{ verticalAlign: "middle" }}>{(new Date(agent.createdAt)).toLocaleString('fr-FR')}</td>
								<td style={{ verticalAlign: "middle" }}><small>{agent.uuid}</small></td>
								<td style={{ verticalAlign: "middle" }}>
									<div className="d-flex" style={{ gap: "1rem" }}>
										<div className="text text-danger delete-agent" onClick={removeAgent} data-id={agent.uuid} role="button"><i className="bi bi-trash"></i></div>
										<div className="text text-primary update-agent" onClick={handleShowModalUpdate} data-settings={agent.settings} data-name={agent.name} data-id={agent.uuid} role="button"><i className="bi bi-pen"></i></div>
									</div>
								</td>
							</tr>
						))}
					</tbody>
				</table>
			</div>
			<Details handleShow={handleShow} handleClose={handleClose} showed={show} setShow={setShow} titleForm={titleForm} handleSubmit={routerSubmit} setName={setName} setSettings={setSettings} name={name} settings={settings} dataUpdate={dataUpdate} setDataUpdate={setDataUpdate} />
		</>)
}