import React, { useEffect, useState } from "react";
import { Formik, Form } from "formik";
import { Grid, Button, Box } from "@material-ui/core";
import { createStyles, makeStyles, Theme } from "@material-ui/core/styles";
import TallyInput from "./TallyInput";
import { ITallyForm } from "./models";
import { IInputFields } from "../../../models";

const useStyle = makeStyles((theme: Theme) =>
	createStyles({
		btnsWrapper: {
			marginTop: theme.spacing(3),
			// position: "absolute",
			// left: theme.spacing(5),
			// bottom: theme.spacing(5),
		},
		cancelBtn: {
			marginLeft: theme.spacing(1),
			backgroundColor: theme.palette.error.main,
		},
	})
);

const TallyForm = ({
	initialValues,
	validate,
	onSubmit,
	onUpdate,
	onCancel,
	inputFields,
	formAction,
	children,
}: ITallyForm) => {
	const classes = useStyle();
	const [inputsBeforeChildren, setInputsBeforeChildren] = useState<IInputFields[]>([]);
	const [inputsAfterChildren, setInputsAfterChildren] = useState<IInputFields[]>([]);

	const validateInitialValues = (initialValues: any) => {
		const errors = validate(initialValues) as Object;
		if (!errors) return true;
		return Object.keys(errors).length ? false : true;
	};

	useEffect(() => {
		const inputsBefore = inputFields.filter((input) => input.position === "before");
		setInputsBeforeChildren(inputsBefore);

		const inputsAfter = inputFields.filter((input) => input.position === "after");
		setInputsAfterChildren(inputsAfter);
	}, []);

	return (
		<Formik
			initialValues={initialValues}
			onSubmit={onSubmit}
			validate={validate}
			isInitialValid={() => validateInitialValues(initialValues)}
			enableReinitialize
		>
			{(formik) => {
				return (
					<Form>
						<Grid container spacing={2}>
							{inputsBeforeChildren.length > 0 &&
								inputsBeforeChildren?.map((value: IInputFields, index: number) => {
									return (
										!value.hidden && (
											<TallyInput value={value} formik={formik} key={index} />
										)
									);
								})}
						</Grid>

						{children}

						<Grid container spacing={2}>
							{inputsAfterChildren.length > 0 &&
								inputsAfterChildren?.map((value: IInputFields, index: number) => {
									return (
										!value.hidden && (
											<TallyInput value={value} formik={formik} key={index} />
										)
									);
								})}
						</Grid>

						<Box className={classes.btnsWrapper}>
							<Button variant="contained" color="primary" type="submit">
								Save
							</Button>
							<Button
								variant="contained"
								className={classes.cancelBtn}
								onClick={() => {
									formik.resetForm();
									onCancel();
								}}
							>
								Cancel
							</Button>
						</Box>
					</Form>
				);
			}}
		</Formik>
	);
};

export default TallyForm;
