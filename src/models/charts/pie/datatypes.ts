export interface PieDataFormat {
	labels?: string[];
	datasets: ChartDataset[];
}

export interface ChartDataset {
	data?: number[];
	backgroundColor?: string[];
	hoverBackgroundColor?: string[];
}
