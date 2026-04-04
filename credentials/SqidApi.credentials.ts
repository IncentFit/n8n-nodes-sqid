import type { ICredentialType, INodeProperties } from 'n8n-workflow';

export class SqidApi implements ICredentialType {
	name = 'sqidApi';
	displayName = 'Sqid API';
	documentationUrl = 'https://sqids.org/';
	icon = 'file:../nodes/Sqid/sqid.svg' as const;
	properties: INodeProperties[] = [
		{
			displayName: 'Alphabet',
			name: 'alphabet',
			type: 'string',
			default: '',
			placeholder: 'e.g. abcdefghijklmnopqrstuvwxyz',
			description:
				'Custom alphabet to use for encoding/decoding. Leave empty to use the default alphabet.',
		},
	];
}
