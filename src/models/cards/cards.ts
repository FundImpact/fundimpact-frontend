import { CARD_TYPES } from "../../components/Dasboard/Cards/constants";

export type CardProps = {
	title?: string;
	children?: React.ReactElement | any;
	cardHeight?: string;
} & (
	| {
			type: CARD_TYPES.PIE;
			cardFilter?: { label: string; filter: object }[];
			moreButtonLink?: string;
	  }
	| {
			type: CARD_TYPES.PROGRESS;
			cardFilter?: { label: string; filter: object }[];
	  }
	| {
			type: CARD_TYPES.PROJECT;
			projectCardTitle: string;
			projectCardFirstBarHeading: string;
			projectCardSecondBarHeading: string;
	  }
	| {
			type: CARD_TYPES.DEFAULT;
	  }
);
