import React from "react";
import { UserProvider } from "./contexts/userContext";

function App() {
	return (
		<UserProvider>
			<div>Fund Impact</div>
		</UserProvider>
	);
}

export default App;
