import axios from "axios";

const exportTable = ({
	tableName,
	tableExportUrl,
	jwt,
}: {
	tableName: string;
	tableExportUrl: string;
	jwt: string;
}) =>
	axios
		.get(tableExportUrl, {
			headers: {
				Authorization: `Bearer ${jwt}`,
			},
			responseType: "blob",
		})
		.then((response) => {
			const url = window.URL.createObjectURL(new Blob([response.data]));
			const link = document.createElement("a");
			link.style.display = "none";
			link.href = url;
			link.setAttribute("download", `${tableName}.csv`);
			document.body.appendChild(link);
			link.click();
		});

export { exportTable };
