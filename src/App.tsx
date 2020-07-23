import React, { Suspense } from "react";
import AppRoutes from "./config/routes";

function App() {
	return (
		<Suspense fallback={<div>Loading</div>}>
			<AppRoutes />
		</Suspense>
	);
}

export default App;
