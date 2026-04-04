# n8n-nodes-sqid

This is an n8n community node. It lets you use [Sqids](https://sqids.org/) in your n8n workflows.

Sqids (formerly Hashids) generates short unique IDs from numbers. It can encode one or more numbers into a short string, and decode that string back into the original numbers. You can optionally provide a custom alphabet.

[n8n](https://n8n.io/) is a [fair-code licensed](https://docs.n8n.io/reference/license/) workflow automation platform.

[Installation](#installation)  
[Operations](#operations)  
[Credentials](#credentials)  
[Compatibility](#compatibility)  
[Usage](#usage)  
[Resources](#resources)  

## Installation

Follow the [installation guide](https://docs.n8n.io/integrations/community-nodes/installation/) in the n8n community nodes documentation.

## Operations

- **Encode** - Encode a list of numbers into a Sqid string
- **Decode** - Decode a Sqid string back into numbers

## Credentials

The Sqid node uses a credential with a single optional field:

- **Alphabet** - A custom alphabet for encoding/decoding. Leave empty to use the default Sqids alphabet. The alphabet must contain at least 3 unique characters.

## Compatibility

Tested with n8n v1.x. Requires n8n version 1.0 or later.

## Usage

**Encoding:** Pass a single number and the node returns a single Sqid string. Pass an array of numbers (from a previous node) and the node returns an array of Sqid strings — one per number.

**Decoding:** Pass a single Sqid string and the node returns the decoded number(s). Pass an array of Sqid strings and the node returns an array of decoded results.

The same alphabet must be used for both encoding and decoding. If you encoded with a custom alphabet, you must decode with the same one.

## Resources

* [n8n community nodes documentation](https://docs.n8n.io/integrations/#community-nodes)
* [Sqids official documentation](https://sqids.org/)
* [Sqids GitHub](https://github.com/sqids)
