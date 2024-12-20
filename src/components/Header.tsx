import "bootstrap/dist/css/bootstrap.css";

export default function Header() {
	return (
		<div className="d-none">
			<header className="bg bg-secondary" style={{ height: "100px" }}>
				<h2 className="fw-bold text-danger py-4 m-auto" style={{width: "fit-content"}}>
					🤖Agents AI
				</h2>
			</header>
		</div>
	);
}
