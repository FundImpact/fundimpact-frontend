export interface AttachFile {
	id?: string;
	file?: any;
	preview?: string;
	remark?: string;
	uploadStatus?: boolean;
	name?: string;
	size?: string;
	url?: string;
	caption?: string;
	ext?: string;
	created_at?: string;
	uploaderConfig?: {
		loaded: number;
		total: number;
	};
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
