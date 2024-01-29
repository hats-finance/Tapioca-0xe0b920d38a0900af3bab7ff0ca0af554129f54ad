import { HardhatRuntimeEnvironment } from 'hardhat/types';
import { buildLTap } from 'tasks/deployBuilds/preLbpStack/buildLTap';
import { loadVM } from 'tasks/utils';
import { DEPLOYMENT_NAMES } from './DEPLOY_CONFIG';

export const deployPreLbpStack__task = async (
    {},
    hre: HardhatRuntimeEnvironment,
) => {
    // Settings
    const tag = await hre.SDK.hardhatUtils.askForTag(hre, 'local');
    const VM = await loadVM(hre, tag);

    // Build contracts
    VM.add(await buildLTap(hre, DEPLOYMENT_NAMES.LTAP, [], []));

    // Add and execute
    await VM.execute(3);
    VM.save();
    await VM.verify();

    console.log('[+] Pre LBP Stack deployed! 🎉');
};