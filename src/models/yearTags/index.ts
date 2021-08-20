export interface YearTagPayload {
	id: string;
	type: "annual" | "financial";
	start_date: Date;
	end_date: Date;
}
