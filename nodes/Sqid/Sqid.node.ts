import type {
	ICredentialsDecrypted,
	ICredentialTestFunctions,
	IExecuteFunctions,
	INodeCredentialTestResult,
	INodeExecutionData,
	INodeType,
	INodeTypeDescription,
} from 'n8n-workflow';
import { NodeOperationError } from 'n8n-workflow';
// eslint-disable-next-line @n8n/community-nodes/no-restricted-imports
import Sqids from 'sqids';

export class Sqid implements INodeType {
	description: INodeTypeDescription = {
		displayName: 'Sqid',
		name: 'sqid',
		icon: 'file:sqid.svg',
		group: ['transform'],
		version: 1,
		subtitle: '={{ $parameter["operation"] }}',
		description: 'Encode and decode Sqids (short unique IDs from numbers)',
		defaults: {
			name: 'Sqid',
		},
		inputs: ['main'],
		outputs: ['main'],
		usableAsTool: true,
		credentials: [
			{
				name: 'sqidApi',
				required: true,
				testedBy: 'sqidApiTest',
			},
		],
		properties: [
			{
				displayName: 'Operation',
				name: 'operation',
				type: 'options',
				noDataExpression: true,
				options: [
					{
						name: 'Encode',
						value: 'encode',
						description: 'Encode numbers into a Sqid',
						action: 'Encode numbers into a sqid',
					},
					{
						name: 'Decode',
						value: 'decode',
						description: 'Decode a Sqid back into numbers',
						action: 'Decode a sqid back into numbers',
					},
				],
				default: 'encode',
			},
			{
				displayName: 'Value',
				name: 'value',
				type: 'string',
				default: '',
				required: true,
				displayOptions: {
					show: {
						operation: ['encode'],
					},
				},
				placeholder: 'e.g. 42',
				description:
					'A single number or an array of numbers. A single number returns one Sqid. An array returns an array of Sqids.',
			},
			{
				displayName: 'Value',
				name: 'value',
				type: 'string',
				default: '',
				required: true,
				displayOptions: {
					show: {
						operation: ['decode'],
					},
				},
				placeholder: 'e.g. 86Rf07',
				description:
					'A single Sqid string or an array of Sqid strings. A single ID returns one number. An array returns an array of numbers.',
			},
		],
	};

	methods = {
		credentialTest: {
			async sqidApiTest(
				this: ICredentialTestFunctions,
				credential: ICredentialsDecrypted,
			): Promise<INodeCredentialTestResult> {
				try {
					const alphabet = credential.data?.alphabet as string;
					new Sqids(alphabet ? { alphabet } : undefined);
					return { status: 'OK', message: 'Alphabet is valid' };
				} catch (error) {
					return { status: 'Error', message: (error as Error).message };
				}
			},
		},
	};

	async execute(this: IExecuteFunctions): Promise<INodeExecutionData[][]> {
		const items = this.getInputData();
		const returnData: INodeExecutionData[] = [];
		const credentials = await this.getCredentials('sqidApi');
		const alphabet = credentials.alphabet as string;

		const sqids = new Sqids(alphabet ? { alphabet } : undefined);

		for (let i = 0; i < items.length; i++) {
			try {
				const operation = this.getNodeParameter('operation', i) as string;

				const input = this.getNodeParameter('value', i);

				if (operation === 'encode') {
					if (Array.isArray(input)) {
						const ids = input.map((n) => {
							const num = Number(n);
							if (!Number.isInteger(num)) {
								throw new NodeOperationError(this.getNode(),
									`Expected an integer but received "${n}". Sqids only supports non-negative integers.`,
								);
							}
							return sqids.encode([num]);
						});
						returnData.push({ json: { ids } });
					} else {
						const num = Number(input);
						if (!Number.isInteger(num)) {
							throw new NodeOperationError(this.getNode(),
								`Expected an integer but received "${input}". Sqids only supports non-negative integers.`,
							);
						}
						const id = sqids.encode([num]);
						returnData.push({ json: { id } });
					}
				} else {
					if (Array.isArray(input)) {
						const numbers = input.map((s) => sqids.decode(String(s))[0]);
						returnData.push({ json: { numbers } });
					} else {
						const number = sqids.decode(String(input))[0];
						returnData.push({ json: { number } });
					}
				}
			} catch (error) {
				if (this.continueOnFail()) {
					returnData.push({ json: { error: (error as Error).message } });
					continue;
				}
				throw error;
			}
		}

		return [returnData];
	}
}
