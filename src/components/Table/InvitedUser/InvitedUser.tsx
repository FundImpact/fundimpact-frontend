import { Chip, TableCell, IconButton } from "@material-ui/core";
import React, { useEffect, useState } from "react";
import MoreVertIcon from "@material-ui/icons/MoreVert";
import { invitedUserTable } from "../constants";
import FITable from "../FITable";

export default function InvitedUserTable() {
	const [rows, setRows] = useState<React.ReactNode[]>([]);
	useEffect(() => {
		setRows([
			[
				<TableCell>1</TableCell>,
				<TableCell>Rahul Chawla</TableCell>,
				<TableCell>
					<Chip label="Authenticated" color="primary" variant="outlined" size="small" />
					<Chip label="Public" color="primary" size="small" />
					<Chip label="Test" color="primary" variant="outlined" size="small" />
				</TableCell>,
				<TableCell>
					<IconButton>
						<MoreVertIcon />
					</IconButton>
				</TableCell>,
			],
			[
				<TableCell>2</TableCell>,
				<TableCell>CHAWLA</TableCell>,
				<TableCell>
					<Chip label="Authenticated" color="primary" size="small" />
					<Chip label="Public" color="primary" variant="outlined" size="small" />
					<Chip label="Test" color="primary" variant="outlined" size="small" />
				</TableCell>,
				<TableCell>
					<IconButton>
						<MoreVertIcon />
					</IconButton>
				</TableCell>,
			],
		]);
	}, []);
	return (
		<>
			<FITable tableHeading={invitedUserTable} rows={rows} />
		</>
	);
}
