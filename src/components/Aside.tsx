import "bootstrap/dist/css/bootstrap.css";
import { useEffect, useState } from "react";
import { Link } from "react-router";

export interface MenuSchema{
	name: string;
	link: string;
}

export default function Aside() {

	const [menu, setMenu] = useState<MenuSchema[]>([])

	useEffect(() => {
		const m : MenuSchema[] = [{name: '🤖Agents',link:'#'}]
		setMenu(m)
	},[])

return (
	<>
			<div className="sidebar ms-0 p-0 d-none d-lg-block border-end border-1 border min-vh-100 bg-dark text-white" id="sidebar">
				<h3 className="text-center mb-4 m-4 fw-bolder">🤖AgentsAI</h3>
				<ul className="nav flex-column" style={{gap:"1rem"}}>
					{
						menu.map((itm, index) => (
							<li className="nav-item" key={index}>
								<a to={itm.link} className="nav-link btn text-start text-dark text-white ms-4">{itm.name}</a>
							</li>			
						))
					}
					<li>
						<a href="/logout" className="btn btn-outline-danger ms-5">Logout</a>
					</li>
				</ul>
			</div>
			</>)
			}