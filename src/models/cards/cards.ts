import { CARD_TYPES, CARD_OF } from "../../components/Dasboard/Cards/constants";
import { PieDataFormat } from "../charts/pie/datatypes";

export type CardProps = {
	title?: string;
	children?: React.ReactElement | any;
	cardHeight?: string;
	cardFilter?: { label: string; base: string }[];
	currentFilter?: { label: string; base: string };
} & (
	| {
			type: CARD_TYPES.PIE;
			cardOf: CARD_OF;
			pieCardConfig: {
				moreButtonLink?: string;
			};
	  }
	| {
			type: CARD_TYPES.PROGRESS;
			cardOf: CARD_OF;
	  }
	| {
			type: CARD_TYPES.PROJECT;
			cardOf: CARD_OF;
			projectCardConfig: {
				title: string;
				firstBarHeading: string;
				secondBarHeading: string;
			};
	  }
	| {
			type: CARD_TYPES.DEFAULT;
	  }
);

export type ProjectCardConfig = {
	title: string;
	mainHeading: string | number;
	rightUpperTitle: string;
	firstBarHeading?: string;
	firstBarValue?: number;
	secondBarHeading: string;
	chartConfig: {
		primarySegmentedMeasureData: { name: string; y: number }[];
		qualitativeRangeData: { name: string; y: number }[];
		comparativeErrorMeasureData: { name: string; y: number }[];
	};
};

export type PieCardConfig = {
	pieData: PieDataFormat;
	moreButtonLink: string | undefined;
	loading: boolean;
};

export type ProgressCardResponse = {
	project_id: string | number;
	id: string | number;
	name: string;
	avg_value?: number;
	avg_value_two?: number;
	sum?: number;
	sum_two?: number;
	label?: string;
	labelTwo: string;
};

export type ProgressCardConfig = {
	dataToDisplay: ProgressCardResponse[];
	dialogTitle?: string;
	dialogFilterTitle?: string;
	noBarDisplay?: boolean;
	noBarDisplayTitle?: string[];
	loading?: boolean;
};

export type CategoryDataResponse = {
	id: string | number;
	name: string;
	count?: string;
	sum?: number;
};
