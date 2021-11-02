import { AttachFile } from "../AttachFile";
import { IProject } from "./project";

export interface IPROJECT_FORM extends IProject {
	donor: string[];
	attachments?: AttachFile[];
	// logframe_tracker: boolean;
}
