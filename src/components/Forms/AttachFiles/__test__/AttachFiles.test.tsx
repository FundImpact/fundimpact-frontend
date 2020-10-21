import { act, queries, RenderResult, waitForElement } from "@testing-library/react";
import React from "react";
import { DashboardProvider } from "../../../../contexts/dashboardContext";
import { NotificationProvider } from "../../../../contexts/notificationContext";
import { AttachFile } from "../../../../models/AttachFile";
import { renderApollo } from "../../../../utils/test.util";
import AttachFileForm from "../index";

let filesArray: AttachFile[] = [
	{
		id: "39",
		name: "Homepage",
		size: "207.43",
		caption: "sdcsdcsdcsd",
		url:
			"https://fundimpact-stg.s3.ap-south-1.amazonaws.com/org-1/impact-tracking-item/Homepage_883bc1e0c6.png",
		ext: ".png",
		created_at: "2020-10-14T13:00:38.381Z",
	},
	{
		id: "40",
		name: "Profile management",
		size: "60.01",
		caption: "scsdcsdcs",
		url:
			"https://fundimpact-stg.s3.ap-south-1.amazonaws.com/org-1/impact-tracking-item/Profile_management_0fc3d61d46.png",
		ext: ".png",
		created_at: "2020-10-14T13:00:39.454Z",
	},
];

const parentOnSave = jest.fn();
const open = true;
const handleClose = jest.fn();
const setFilesArray = jest.fn();

let attachFiles: RenderResult<typeof queries>;
beforeEach(() => {
	act(() => {
		attachFiles = renderApollo(
			<DashboardProvider>
				<NotificationProvider>
					<AttachFileForm
						{...{
							open,
							handleClose,
							filesArray,
							setFilesArray,
							parentOnSave,
						}}
					/>
				</NotificationProvider>
			</DashboardProvider>,
			{
				mocks: [],
				addTypename: false,
			}
		);
	});
});

describe("Attach Files Form files listing", () => {
	test("renders correctly", async () => {
		filesArray.forEach(async (file: AttachFile) => {
			await waitForElement(() => attachFiles.getByText(new RegExp("" + file.name, "i")));
			await waitForElement(() => attachFiles.getByText(new RegExp("" + file.size, "i")));
			await waitForElement(() => attachFiles.getByText(new RegExp("" + file.caption, "i")));
			await waitForElement(() => attachFiles.findByText(new RegExp("" + file.url, "i")));
		});
	});
});
