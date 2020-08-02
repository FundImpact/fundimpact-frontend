import React from "react";
import { Doughnut } from "react-chartjs-2";

const data = {
	labels: [],
	datasets: [
		{
			data: [300, 50, 100],
			backgroundColor: ["#5567FF", "#eeeeee", "#14BB4C"],
			hoverBackgroundColor: ["#5567FF", "#eeeeee", "#14BB4C"],
		},
	],
};
const options = {
	legend: {
		display: false,
	},
	tooltips: {
		enabled: false,
	},
	hover: false,
};

export default function PieCharts() {
	return (
		<div>
			<Doughnut data={data} options={options} />
		</div>
	);
}
