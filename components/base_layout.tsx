import Pills from "./pills";
import User from "../types/user";
import Nav from "./nav";

function BaseLayout ({ user, children }: { user?: User, children: any }) {
	return (
		<div className="mt-5 mx-auto">
			<Nav user={user}></Nav>
			{children}
		</div>
	)
}

export default BaseLayout;