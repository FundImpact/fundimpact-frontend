export interface AttachFile {
	id?: string;
	file?: any;
	preview?: string;
	remark?: string;
	uploadingStatus?: boolean;
	name?: string;
	size?: string;
	url?: string;
	caption?: string;
	ext?: string;
	created_at?: string;
}

export interface Attachments {
	id?: string;
	name: string;
	size: string;
	url: string;
	caption: string;
	ext: string;
	created_at: string;
}
