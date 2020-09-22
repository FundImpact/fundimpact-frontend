import React from "react";
import { Doughnut } from "react-chartjs-2";
import { PieDataFormat } from "../../../models/charts/pie/datatypes";
import { options } from "../constants";

export default function DoughnutChart({ data }: { data?: PieDataFormat }) {
	if (!data) return null;
	return <Doughnut data={data} options={options} />;
}
