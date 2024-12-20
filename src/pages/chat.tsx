import "bootstrap/dist/css/bootstrap.css";
import { useEffect, useState } from "react";
import { marked } from 'marked';

interface HistoryItem {
	id: number;
	role: string;
	message: string;
}

export default function App() {

	const [message, setMessage] = useState("")
	const [availableChat, setAvailableChat] = useState(false)
	const [history, setHistory] = useState<HistoryItem[]>([])

	async function getChatUuid() {
		try {
			const response = await fetch('http://localhost:3000/chats', {
				method: "POST",
				headers: {
					"Content-Type": "application/json"
				}
			});
			if (!response.ok) {
				throw new Error('Failed to fetch chat data');
			}
			const data = await response.json();
			return data.uuid;
		} catch (error) {
			console.error(error);
			return null;
		}
	}

	async function getAgentUuid() {
		const urlParams = new URLSearchParams(window.location.search);
		const agentUuid = await urlParams.get('agent');
		if (agentUuid == null) return "";
		return agentUuid
	}

	async function sendPrompt(chatUuid: string, agentUuid: string, user_msg: string) {
		var h = [...history, { role: 'user', message: user_msg } as HistoryItem]
		setHistory(h)
		const payload = {
			chat_id: chatUuid,
			agent_uuid: agentUuid,
			user_msg: user_msg,
			agent_msg: ""
		};

		try {
			const response = await fetch('http://localhost:3000/prompts', {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json',
					'Authorization': 'Bearer ' + localStorage.getItem('token')
				},
				body: JSON.stringify(payload)
			});

			if (!response.ok) {
				throw new Error('Failed to send prompt');
			}

			const responseData = await response.json();
			console.log('Prompt sent successfully:', responseData);
			h = [...h, { role: 'assistant', message: responseData.agent_msg } as HistoryItem]
			setHistory(h)
		} catch (error) {
			console.error('Error sending prompt:', error);
		}
	}


	async function verifyAgent(uuid: string) {
		try {
			const response = await fetch(`http://localhost:3000/agents/${uuid}`, {
				method: 'GET',
				headers: {
					'Content-Type': 'application/json',
					'Authorization': 'Bearer ' + localStorage.getItem('token')
				}
			});

			if (!response.ok) {
				throw new Error('Failed to send prompt');
			}

			const responseData = await response.json();
			console.log('verify agent successfully:', responseData);
			if("found" in responseData || !responseData.inProduction) {
				setAvailableChat(false)
				return
			}

		} catch (error) {
			console.error('Error sending prompt:', error);
		}
	}
	async function execute() {
		const chatUuid = await getChatUuid();
		const agentUuid = await getAgentUuid();
		verifyAgent(agentUuid)
		if (!agentUuid) {
			setAvailableChat(false)
			return
		}
		setAvailableChat(true)
		await sessionStorage.setItem('agent', agentUuid)
		if (chatUuid) {
			localStorage.setItem('chat', chatUuid)
		} else {
			console.log('No chat UUID found');
		}
	}

	async function handleSubmit(e: any) {
		// e.preventDefault()
		const agentUuid = sessionStorage.getItem('agent')
		const chatUuid = localStorage.getItem('chat')
		if (chatUuid && agentUuid) {
			setMessage("")
			await sendPrompt(chatUuid, agentUuid, message)
		}
	}

	async function handleEnter(e: any) {
		if (e.key === 'Enter') {
			// handleSubmit("")
		}
	}

	function handleMessage(e: any) {
		setMessage(e.target.value)
		// console.log(message)
	}


	// Convertir le message Markdown en HTML
	const renderMarkdown = (markdown: string) => {
		return { __html: marked(markdown) };
	};
	
	useEffect(() => {
		execute()
	}, [])

	return (
		<>{availableChat ?
			<div className="bg bg-secondary min-vh-100">

				<div className="container-fluid min-vh-100 bg-white w-100 p-4">

					<h2 className="position-fixed top-0 bg-white w-100 m-auto display-4 fw-bolder" style={{ zIndex: "1000", height: "70px" }}>Chat</h2>
					<div className="border border-1 p-4 mt-5" style={{ minHeight: "70vh" }}>
						<div className="w-75 w-md-50 alert alert-success  ms-auto">
							<strong>Assistant:</strong> <br />Bonjour en quoi puis-je vous aider ?
						</div>
						{history.map((item, index) => (
							<div key={index} className={`w-75 w-md-50 alert ${item.role === "user" ? "alert-primary" : "alert-success"} ${item.role === "assistant" ? "ms-auto" : ""}`}>
								<strong>{item.role === "user" ? "You" : "Assistant"}:</strong> 
								{/* {renderMarkdown(item.message)} */}
								<div
									className="markdown-output"
									dangerouslySetInnerHTML={renderMarkdown(item.message)} // Utilisation du HTML généré
								/>
							</div>
						))}
				</div>
				<div className="w-100 d-flex position-fixed bottom-0 start-0 p-1 bg-white">
					<textarea className="w-100" name="message" id="message" onChange={handleMessage} onKeyDown={handleEnter} value={message}></textarea>
					<button className="btn btn-primary px-5" onClick={handleSubmit}>Send</button>
				</div>
			</div>
			</div > : <div className="alert alert-warning text-center">Aucun Correspondant disponible pour ce chat.</div>
}

		</>
	);
}