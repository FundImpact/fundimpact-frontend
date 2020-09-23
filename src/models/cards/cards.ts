import { CARD_TYPES, CARD_OF } from "../../components/Dasboard/Cards/constants";
import { PieDataFormat } from "../charts/pie/datatypes";

export type CardProps = {
	title?: string;
	children?: React.ReactElement | any;
	cardHeight?: string;
	cardFilter?: { label: string }[];
	currentFilter?: string;
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
	firstBarHeading: string;
	firstBarValue: number;
	secondBarHeading: string;
	secondBarValue: number;
};

export type PieCardConfig = {
	pieData: PieDataFormat;
	moreButtonLink: string | undefined;
};

export type ProgressCardResponse = {
	id: string | number;
	name: string;
	avg_value?: number;
	sum?: number;
	dialogTitle: string;
};

export type ProgressCardConfig = {
	dataToDisplay: ProgressCardResponse[];
	dialogTitle?: string;
};
