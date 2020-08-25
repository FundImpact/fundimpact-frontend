import React, { Suspense } from "react";
import AppRoutes from "./config/routes";
import { FullScreenLoader } from "./components/Loader";

function App() {
	return (
		<Suspense fallback={<FullScreenLoader />}>
			<AppRoutes />
		</Suspense>
	);
}

export default App;
