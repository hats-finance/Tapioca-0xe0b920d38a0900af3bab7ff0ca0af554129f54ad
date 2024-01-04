import * as dotenv from 'dotenv';

// Plugins
import { HardhatUserConfig } from 'hardhat/config';
import '@nomicfoundation/hardhat-toolbox';
import '@nomicfoundation/hardhat-chai-matchers';
import '@nomiclabs/hardhat-etherscan';
import 'hardhat-deploy';
import 'hardhat-contract-sizer';
import '@primitivefi/hardhat-dodoc';
import 'typechain';
import '@typechain/hardhat';
import 'hardhat-tracer';
import 'tapioca-sdk';

// Utils
import SDK from 'tapioca-sdk';
import { HttpNetworkConfig } from 'hardhat/types';
import { TAPIOCA_PROJECTS_NAME } from './gitsub_tapioca-sdk/src/api/config';

dotenv.config();
declare global {
    // eslint-disable-next-line @typescript-eslint/no-namespace
    namespace NodeJS {
        interface ProcessEnv {
            ALCHEMY_API_KEY: string;
        }
    }
}

type TNetwork = ReturnType<
    typeof SDK.API.utils.getSupportedChains
>[number]['name'];
const supportedChains = SDK.API.utils.getSupportedChains().reduce(
    (sdkChains, chain) => ({
        ...sdkChains,
        [chain.name]: <HttpNetworkConfig>{
            accounts:
                process.env.PRIVATE_KEY !== undefined
                    ? [process.env.PRIVATE_KEY]
                    : [],
            live: true,
            url: chain.rpc.replace('<api_key>', process.env.ALCHEMY_API_KEY),
            gasMultiplier: chain.tags[0] === 'testnet' ? 2 : 1,
            chainId: Number(chain.chainId),
            tags: [...chain.tags],
        },
    }),
    {} as { [key in TNetwork]: HttpNetworkConfig },
);

const config: HardhatUserConfig & { dodoc: any } = {
    solidity: {
        compilers: [
            {
                version: '0.4.24',
                settings: {
                    optimizer: {
                        enabled: true,
                        runs: 100,
                    },
                },
            },
            {
                version: '0.8.19',
                settings: {
                    viaIR: process.env.NODE_ENV == 'coverage' ? false : true,
                    optimizer: {
                        enabled: true,
                        runs: 100,
                    },
                },
            },
        ],
    },
    namedAccounts: {
        deployer: 0,
    },
    defaultNetwork: 'hardhat',
    networks: {
        hardhat: {
            allowUnlimitedContractSize: true,
            accounts: {
                count: 5,
            },
        },
        ...supportedChains,
    },
    SDK: { project: TAPIOCA_PROJECTS_NAME.TapToken },
    etherscan: {
        apiKey: {
            sepolia: process.env.BLOCKSCAN_KEY ?? '',
            arbitrum_sepolia: process.env.ARBITRUM_SEPOLIA_KEY ?? '',
            avalancheFujiTestnet: process.env.AVALANCHE_FUJI_KEY ?? '',
            bscTestnet: process.env.BSC_KEY ?? '',
            polygonMumbai: process.env.POLYGON_MUMBAI ?? '',
            ftmTestnet: process.env.FTM_TESTNET ?? '',
        },
        customChains: [
            {
                network: 'arbitrum_sepolia',
                chainId: Number(
                    SDK.API.utils.getChainBy('name', 'arbitrum_sepolia')!
                        .chainId,
                ),
                urls: {
                    apiURL: 'https://api-sepolia.arbiscan.io/api',
                    browserURL: 'https://sepolia.arbiscan.io',
                },
            },
        ],
    },
    mocha: {
        timeout: 4000000,
    },
    dodoc: {
        runOnCompile: false,
        freshOutput: false,
    },
    typechain: {
        outDir: 'typechain',
        target: 'ethers-v5',
    },
};

export default config;
