import { LocalizationProvider } from "@material-ui/pickers";
import DateFnsUtils from "@material-ui/pickers/adapter/date-fns";
import React, { Suspense } from "react";

import { FullScreenLoader } from "./components/Loader/Loader";
import AppRoutes from "./config/routes";

function App() {
	return (
		<Suspense fallback={<FullScreenLoader />}>
			<LocalizationProvider dateAdapter={DateFnsUtils as any}>
				<AppRoutes />
			</LocalizationProvider>
		</Suspense>
	);
}

export default App;
