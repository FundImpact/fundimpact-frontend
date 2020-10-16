import React from "react";
import { Pie } from "react-chartjs-2";
import { PieDataFormat } from "../../../models/charts/pie/datatypes";
import { options } from "../constants";
export default function PieChart({ data }: { data?: PieDataFormat }) {
	if (!data) return null;
	return <Pie data={data} options={options} />;
}
