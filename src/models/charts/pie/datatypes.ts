export interface PieDataFormat {
	label?: string[];

	datasets: ChartDataset[];
}

interface ChartDataset {
	data: number[];
	backgroundColor: string[];
	hoverBackgroundColor?: string[];
}
