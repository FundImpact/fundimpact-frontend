import React from "react";
import { Avatar, Box, Chip } from "@material-ui/core";

const ChipArray = ({
	arr,
	name,
	removeChips,
}: {
	arr: string[];
	name: string;
	removeChips: (index: number) => void;
}) => {
	return (
		<>
			{arr.map((element: string, index: number) => (
				<Box key={index} mx={1}>
					<Chip
						label={element}
						avatar={
							<Avatar
								style={{
									width: "30px",
									height: "30px",
								}}
							>
								<span>{name}</span>
							</Avatar>
						}
						onDelete={() => removeChips(index)}
					/>
				</Box>
			))}
		</>
	);
};

export default ChipArray;
