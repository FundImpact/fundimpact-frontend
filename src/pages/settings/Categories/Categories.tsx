import React, { useState } from "react";
import { Box, Grid, Typography } from "@material-ui/core";
import { FormattedMessage } from "react-intl";
import FilterList from "../../../components/FilterList";
import CategoriesTable from "../../../components/Table/Categories";
import AddButton from "../../../components/Dasboard/AddButton";
import Category from "../../../components/Category";
import { FORM_ACTIONS } from "../../../models/constants";
import { categoryInputFields } from "./inputField.json";

const Categories = () => {
	const [tableFilterList, setTableFilterList] = useState<{
		[key: string]: string | string[];
	}>({
		name: "",
	});

	return (
		<Box p={2}>
			<Grid container>
				<Grid item xs={11}>
					<Typography variant="h4">
						<Box mt={2} fontWeight="fontWeightBold">
							<FormattedMessage
								id="categories"
								defaultMessage="Categories"
								description="This text will be heading of categories page"
							/>
						</Box>
					</Typography>
				</Grid>
				<Grid item xs={1}>
					<Box mt={2}>
						<FilterList
							setFilterList={setTableFilterList}
							inputFields={categoryInputFields}
							initialValues={{
								name: "",
							}}
						/>
					</Box>
				</Grid>
			</Grid>
			<CategoriesTable />
			<AddButton
				createButtons={[]}
				buttonAction={{
					dialog: ({ open, handleClose }: { open: boolean; handleClose: () => void }) => (
						<Category
							open={open}
							handleClose={handleClose}
							formAction={FORM_ACTIONS.CREATE}
						/>
					),
				}}
			/>
		</Box>
	);
};

export default Categories;
