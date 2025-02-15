import '@src/mb_enhanced_cover_art_uploads/providers';

import fs from 'node:fs/promises';

import type { CoverArtProvider } from '@src/mb_enhanced_cover_art_uploads/providers/base';
import { DispatchMap } from '@lib/util/domain_dispatch';

jest.mock('@lib/util/domain_dispatch');

// eslint-disable-next-line jest/unbound-method
const spyDispatchMapSet = DispatchMap.prototype.set as jest.MockedFunction<DispatchMap<CoverArtProvider>['set']>;

function getAllProviderNamesInSource(): Set<string> {
    const providerNames = new Set<string>();

    for (const [, provider] of spyDispatchMapSet.mock.calls) {
        providerNames.add(provider.name);
    }

    return providerNames;
}

describe('cover art provider documentation', () => {
    const providerNamesInDocs = new Set<string>();

    beforeAll(async () => {
        const docsContent = await fs.readFile('./src/mb_enhanced_cover_art_uploads/docs/supported_providers.md', {
            encoding: 'utf8',
        });

        for (const providerNameMatch of docsContent.matchAll(/^\|([^|]+)\|/gm)) {
            for (const providerName of providerNameMatch[1].split('/')) {
                providerNamesInDocs.add(providerName.trim());
            }
        }
    });

    it.each([...getAllProviderNamesInSource()])('has an entry for %s', (providerName) => {
        expect(providerNamesInDocs.has(providerName)).toBeTrue();
    });
});
