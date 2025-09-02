import { Router } from 'express';
import { readFile } from 'fs/promises';
import { ethers } from 'ethers';

const router = Router();

const data = {};
const collections = {
  FAKE: {
    symbol: 'CP',
    name: 'CryptoPunk #',
    collection: {
      name: 'CryptoPunks',
      slug: 'cryptopunks',
    },
  },
  MOCK: {
    symbol: 'BAYC',
    name: 'BAYC #',
    collection: {
      name: 'Bored Ape Yacht Club',
      slug: 'boredapeyachtclub',
    },
  },
  REPL: {
    symbol: 'CDB',
    name: 'CDB #',
    collection: {
      name: 'CryptoDickbutts S3',
      slug: 'cryptodickbutts-s3',
    },
  },
  TEST: {
    symbol: 'BLOCKS',
    name: 'Art Block #',
    collection: {
      name: 'Art Blocks',
      slug: 'art-blocks',
    },
  },
};

function getCollection(data) {
  const collection = collections[data.symbol];
  return {
    ...data,
    ...collection,
    name: collection.name + data.tokenId,
    collection: {
      ...data.collection,
      ...collection.collection,
    }
  }
}

function getContract(data = {}) {
  return {
    "address": data.address || "0xBC4CA0EdA7647A8aB7C2061c2E118A18a936f13D",
    "name": data.collection?.name || "BoredApeYachtClub",
    "symbol": data.symbol || "BAYC",
    "totalSupply": data.totalSupply || "10000",
    "tokenType": data.tokenType || "ERC721",
    "contractDeployer": data.contractDeployer || "0xaBA7161A7fb69c88e16ED9f455CE62B791EE4D03",
    "deployedBlockNumber": data.deployedBlockNumber || 12287507,
    "openSeaMetadata": {
      "floorPrice": data.openSeaMetadata?.floorPrice || 10.4,
      "collectionName": data.openSeaMetadata?.collectionName || "Bored Ape Yacht Club",
      "collectionSlug": data.openSeaMetadata?.collectionSlug || "boredapeyachtclub",
      "safelistRequestStatus": data.openSeaMetadata?.safelistRequestStatus || "verified",
      "imageUrl": data.openSeaMetadata?.imageUrl || "https://i.seadn.io/gae/Ju9CkWtV-1Okvf45wo8UctR-M9He2PjILP0oOvxE89AyiPPGtrR3gysu1Zgy0hjd2xKIgjJJtWIc0ybj4Vd7wv8t3pxDGHoJBzDB?w=500&auto=format",
      "description": data.openSeaMetadata?.description || "The Bored Ape Yacht Club is a collection of 10,000 unique Bored Ape NFTs— unique digital collectibles living on the Ethereum blockchain. Your Bored Ape doubles as your Yacht Club membership card, and grants access to members-only benefits, the first of which is access to THE BATHROOM, a collaborative graffiti board. Future areas and perks can be unlocked by the community through roadmap activation. Visit www.BoredApeYachtClub.com for more details.",
      "externalUrl": data.openSeaMetadata?.externalUrl || null,
      "twitterUsername": data.openSeaMetadata?.twitterUsername || "BoredApeYC",
      "discordUrl": data.openSeaMetadata?.discordUrl || "https://discord.gg/3P5K3dzgdB",
      "bannerImageUrl": data.openSeaMetadata?.bannerImageUrl || "https://i.seadn.io/gae/i5dYZRkVCUK97bfprQ3WXyrT9BnLSZtVKGJlKQ919uaUB0sxbngVCioaiyu9r6snqfi2aaTyIvv6DHm4m2R3y7hMajbsv14pSZK8mhs?w=500&auto=format",
      "lastIngestedAt": data.openSeaMetadata?.lastIngestedAt || "2025-07-08T17:33:19.000Z"
    },
    "isSpam": false,
    "spamClassifications": []
  };
}

function getMetadata(data = {}) {
  return {
    "contract": getContract(data),
    "tokenId": data.tokenId?.toString() || "5954",
    "tokenType": "ERC721",
    "name": data.name || null,
    "description": null,
    "tokenUri": "https://alchemy.mypinata.cloud/ipfs/QmeSjSinHpPnmXmspMjwiXyN6zS4E9zccariGR3jxcaWtq/5954",
    "image": {
      "cachedUrl": `http://localhost:8080/cdn/${data.symbol}/${data.tokenId}`,
      "thumbnailUrl": `http://localhost:8080/cdn/${data.symbol}/${data.tokenId}`,
      "pngUrl": `http://localhost:8080/cdn/${data.symbol}/${data.tokenId}`,
      "contentType": "image/png",
      "size": 12345,
      "originalUrl": `http://localhost:8080/cdn/${data.symbol}/${data.tokenId}`,
    },
    "animation": {
      "cachedUrl": null,
      "contentType": null,
      "size": null,
      "originalUrl": null
    },
    "raw": {
      "tokenUri": "ipfs://QmeSjSinHpPnmXmspMjwiXyN6zS4E9zccariGR3jxcaWtq/5954",
      "metadata": {
        "image": "ipfs://Qmdj5hdNRVJJFRRfhMf1Wbmr17dDk6HpTDWrpHUk4HMF1S",
        "attributes": [
          {
            "value": "Rage",
            "trait_type": "Mouth"
          },
          {
            "value": "Sleepy",
            "trait_type": "Eyes"
          },
          {
            "value": "Robot",
            "trait_type": "Fur"
          },
          {
            "value": "Army Green",
            "trait_type": "Background"
          },
          {
            "value": "Army Hat",
            "trait_type": "Hat"
          }
        ]
      },
      "error": null
    },
    "collection": {
      "name": data.collection?.name || "Bored Ape Yacht Club",
      "slug": data.collection?.slug || "boredapeyachtclub",
      "externalUrl": null,
      "bannerImageUrl": "https://i.seadn.io/gae/i5dYZRkVCUK97bfprQ3WXyrT9BnLSZtVKGJlKQ919uaUB0sxbngVCioaiyu9r6snqfi2aaTyIvv6DHm4m2R3y7hMajbsv14pSZK8mhs?w=500&auto=format"
    },
    "mint": {
      "mintAddress": null,
      "blockNumber": null,
      "timestamp": null,
      "transactionHash": null
    },
    "owners": null,
    "timeLastUpdated": "2025-07-08T20:34:38.903Z",
    "balance": "1",
    "acquiredAt": {
      "blockTimestamp": null,
      "blockNumber": null
    },
  };
}

router.get('/getNFTsForOwner', async (req, res, next) => {
  try {
    const owner = req.query.owner;

    const provider = new ethers.JsonRpcProvider(process.env.RPC_PROVIDER);
    const abi = JSON.parse(await readFile('../zwap-contracts/abi/MockERC721.json', 'utf-8'));
    const signer = await provider.getSigner();

    const contracts = {
      FAKE: process.env.FAKE,
      MOCK: process.env.MOCK,
      REPL: process.env.REPL,
      TEST: process.env.TEST,
    };
    const result = [];
    await Promise.all(Object.entries(contracts).map(async ([symbol, contract]) => {
      const mockERC721 = new ethers.Contract(contract, abi, signer);
      for(let i = 0; i < await mockERC721.balanceOf(owner); i++) {
        const id = await mockERC721.tokenOfOwnerByIndex(owner, i);
        result.push(getMetadata(getCollection({
          address: contract,
          symbol,
          tokenId: Number(id),
        })));
      }
    }));

    const blockNumber = await provider.getBlockNumber();
    const block = await provider.getBlock(blockNumber);
    res.json({
      ownedNfts: result,
      totalCount: result.length,
      validAt: {
        blockNumber,
        blockHash: block.hash,
        blockTimestamp: new Date(block.timestamp * 1000),
      },
      pageKey: null,
    });
  } catch (e) {
    next(e);
  }
});

router.post('/getNFTMetadataBatch', async (req, res, next) => {
  try {
    const tokens = req.body?.tokens || [];
    if (tokens.length > 100) {
      next(new Error('No more than 100 tokens'));
      return;
    }

    const contracts = {};
    contracts[process.env.FAKE.toLowerCase()] = 'FAKE';
    contracts[process.env.MOCK.toLowerCase()] = 'MOCK';
    contracts[process.env.REPL.toLowerCase()] = 'REPL';
    contracts[process.env.TEST.toLowerCase()] = 'TEST';

    const result = await Promise.all(tokens.map(({ contractAddress, tokenId }) => {
      const symbol = contracts[contractAddress.toLowerCase()];
      if (!symbol) return;
      return getMetadata(getCollection({
        address: contractAddress,
        symbol,
        tokenId: Number(tokenId),
      }));
    }));

    res.json({ nfts: result });
  } catch (e) {
    next(e);
  }
});

router.get('/searchContractMetadata', async (req, res, next) => {
  try {
    const query = req.query.query;
    if (!query) {
      next(new Error('query is a required request parameter'));
      return;
    }

    const contracts = [];

    for (const key in collections) {
      const item = collections[key];
      const fields = [
        item.symbol.toLowerCase(),
        item.name.toLowerCase(),
        item.collection.name.toLowerCase(),
        item.collection.slug.toLowerCase()
      ];

      if (fields.some(field => field.includes(query.toLowerCase()))) {
        contracts.push(getContract(getCollection({symbol: key})));
      }
    }

    res.json({ contracts });
  } catch (e) {
    next(e);
  }
});

export default router;
