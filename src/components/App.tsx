import "bootstrap/dist/css/bootstrap.css";
import Aside from "./Aside";
import Agents from "./Agents";

export default function Dashboard() {
	
return (
	<>
		<div className="container-fluid ps-0 w-100 d-lg-flex" id="adminPanel">
			<Aside />
			<div className="content">
				<nav className="navbar navbar-expand-lg navbar-light bg-light d-lg-none">
					<div className="container-fluid">
						<a className="navbar-brand" href="#">Admin Panel</a>
						<button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNav"
							aria-controls="navbarNav" aria-expanded="false" aria-label="Toggle navigation">
							<span className="navbar-toggler-icon"></span>
						</button>
						<div className="collapse navbar-collapse" id="navbarNav">
							<ul className="navbar-nav">
								<li className="nav-item">
									<a className="nav-link active" aria-current="page" href="#">Home</a>
								</li>
								<li className="nav-item">
									<a className="nav-link" href="#">Profile</a>
								</li>
								<li className="nav-item">
									<a className="nav-link" href="#">Log Out</a>
								</li>
							</ul>
						</div>
					</div>
				</nav>

				<div className="container mt-4">
					<Agents />
					{/* <Chats /> */}
				</div>
			</div>
		</div>
	</>
)
}