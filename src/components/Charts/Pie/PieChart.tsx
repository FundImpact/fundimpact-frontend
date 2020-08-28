import React from "react";
import { Doughnut } from "react-chartjs-2";

import { PieDataFormat } from "../../../models/charts/pie/datatypes";

// const data = {
// 	labels: [],
// 	datasets: [
// 		{
// 			data: [300, 50, 100],
// 			backgroundColor: ["#5567FF", "#eeeeee", "#14BB4C"],
// 			hoverBackgroundColor: ["#5567FF", "#eeeeee", "#14BB4C"],
// 		},
// 	],
// };
const options = {
	legend: {
		display: false,
	},
	tooltips: {
		enabled: false,
	},
	hover: false,
};
export default function PieCharts({ data }: { data?: PieDataFormat }) {
	if (!data) return null;
	return (
		<div>
			<Doughnut data={data} options={options} />
		</div>
	);
}
