export interface IIndividualForm {
	name: string;
	project?: { id: string; name: string; workspace: { id: string; name: string } }[];
}
