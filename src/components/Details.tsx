import { useState } from 'react';
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import Modal from 'react-bootstrap/Modal';

interface DetailsProps {
	showed: boolean;
	handleShow: () => void;
	handleClose: () => void;
	handleSubmit: (e: React.MouseEvent) => Promise<void>;
	setSettings: () =>  React.Dispatch<React.SetStateAction<string>>;
	setName: () =>  React.Dispatch<React.SetStateAction<string>>;
	hName: () =>  React.Dispatch<React.SetStateAction<string>>;
	hSettings: () =>  React.Dispatch<React.SetStateAction<string>>;
	titleForm: string;
	setShow: React.Dispatch<React.SetStateAction<boolean>>;
  }

export function Details({ handleShow, handleClose, showed, setShow, titleForm, handleSubmit, setName,setSettings, name, settings, dataUpdate, setDataUpdate }: DetailsProps) {

	function handleSettings(e: React.ChangeEvent<HTMLTextAreaElement>){
		setSettings(e.target.value)
		setDataUpdate({...dataUpdate,settings:e.target.value})

	}
	function handleName(e: React.ChangeEvent<HTMLInputElement>){
		setName(e.target.value)
		console.log(e.target.value)
		setDataUpdate({...dataUpdate,name:e.target.value})
	}


	return (<>


		<Modal show={showed} onHide={handleClose}>
			<Modal.Header closeButton>
				<Modal.Title>{titleForm}</Modal.Title>
			</Modal.Header>
			<Modal.Body>
				<Form>
					<Form.Group className="mb-3" controlId="exampleForm.ControlInput1">
						<Form.Label>Nom de l'agent</Form.Label>
						<Form.Control
							type="text"
							placeholder="Nom de l'agent"
							autoFocus
							onChange={handleName}
							value={name}
							defaultValue={""}
						/>
					</Form.Group>
					<Form.Group
						className="mb-3"
						controlId="exampleForm.ControlTextarea1"
					>
						<Form.Label>Description du role de l'agent</Form.Label>
						<Form.Control as="textarea" rows={3} onChange={handleSettings} value={settings} defaultValue={""}/>
					</Form.Group>
				</Form>
			</Modal.Body>
			<Modal.Footer>
				<Button variant="secondary" onClick={handleClose}>
					Fermer
				</Button>
				<Button variant="primary" onClick={handleSubmit}>
					{titleForm}
				</Button>
			</Modal.Footer>
		</Modal>
	</>)
}