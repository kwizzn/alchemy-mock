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
    },
  }
}

async function getContract(data = {}) {
  const meta = JSON.parse(await readFile(`./mock/collections/${data.symbol}/_meta.json`, 'utf-8'));
  return {
    ...meta,
    "address": data.address || "0xBC4CA0EdA7647A8aB7C2061c2E118A18a936f13D",
    "name": data.collection?.name || "BoredApeYachtClub",
    "symbol": data.symbol || "BAYC",
    "totalSupply": data.totalSupply || "10000",
    "tokenType": data.tokenType || "ERC721",
    "contractDeployer": data.contractDeployer || "0xaBA7161A7fb69c88e16ED9f455CE62B791EE4D03",
    "deployedBlockNumber": data.deployedBlockNumber || 12287507,
    "isSpam": false,
    "spamClassifications": [],
    "totalBalance": data.balance,
    "numDistinctTokensOwned": data.balance,
  };
}

async function getCollectionListing(data = {}) {
  return getContract(data);
}

async function getMetadata(data = {}) {
  return {
    "contract": await getContract(data),
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

router.get('/getContractsForOwner', async (req, res, next) => {
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
      const balance = await mockERC721.balanceOf(owner);
      result.push(await getCollectionListing(getCollection({
        address: contract,
        symbol,
        balance: balance.toString(),
      })));
    }));

    res.json({
      contracts: result,
      totalCount: result.length,
      pageKey: null,
    });
  } catch (e) {
    next(e);
  }
});

router.get('/getNFTsForContract', async (req, res, next) => {
  try {
    const contractAddress = req.query.contractAddress;
    const provider = new ethers.JsonRpcProvider(process.env.RPC_PROVIDER);
    const abi = JSON.parse(await readFile('../zwap-contracts/abi/MockERC721.json', 'utf-8'));
    const signer = await provider.getSigner();

    const contracts = {
      FAKE: process.env.FAKE,
      MOCK: process.env.MOCK,
      REPL: process.env.REPL,
      TEST: process.env.TEST,
    };
    const symbol = Object.entries(contracts).find(([symbol, address]) => address === contractAddress)?.[0];
    const mockERC721 = new ethers.Contract(contractAddress, abi, signer);
    const result = [];
    for(let i = 0; i < await mockERC721.totalSupply(); i++) {
      const id = await mockERC721.tokenByIndex(i);
      result.push(await getMetadata(getCollection({
        address: contractAddress,
        symbol,
        tokenId: Number(id),
      })));
    }

    const blockNumber = await provider.getBlockNumber();
    const block = await provider.getBlock(blockNumber);
    res.json({
      nfts: result,
      pageKey: null,
    });
  } catch (e) {
    next(e);
  }
});

router.get('/getNFTsForOwner', async (req, res, next) => {
  try {
    const owner = req.query.owner;
    const contractAddresses = req.query['contractAddresses[]'];
    let filter;
    if (contractAddresses) {
      filter = Array.isArray(contractAddresses) ? contractAddresses : [contractAddresses];
    }

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
        if (filter && !filter.map(a => a.toLowerCase()).includes(contract.toLowerCase())) {
          continue;
        }
        result.push(await getMetadata(getCollection({
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
        contracts.push(await getContract(getCollection({symbol: key})));
      }
    }

    res.json({ contracts });
  } catch (e) {
    next(e);
  }
});

export default router;
