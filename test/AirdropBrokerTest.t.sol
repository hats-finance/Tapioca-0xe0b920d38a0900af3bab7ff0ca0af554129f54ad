// SPDX-License-Identifier: UNLICENSED

pragma solidity 0.8.22;

// Tapioca
import {AirdropBroker, IOracle} from "contracts/option-airdrop/AirdropBroker.sol";

import "forge-std/Test.sol";

// TODO Move to common repo
contract ADBOracleMock is IOracle {
    constructor() {}
    function decimals() external view virtual override returns (uint8) {}

    function get(bytes calldata data) external override returns (bool success, uint256 rate) {
        return (true, 1e18);
    }

    function peek(bytes calldata data) external view virtual override returns (bool success, uint256 rate) {}
    function peekSpot(bytes calldata data) external view virtual override returns (uint256 rate) {}
    function symbol(bytes calldata data) external view virtual override returns (string memory) {}
    function name(bytes calldata data) external view virtual override returns (string memory) {}
}

/// @dev We mock the AirdropBroker contract to be able to access internal functions with external ones.
contract AirdropBrokerTestMock is AirdropBroker {
    constructor(
        address _AOTAP,
        address payable _TAPOFT,
        address _PCNFT,
        address _PAYMENT_TOKEN_BENEFICIARY,
        address TAP_ORACLE,
        address _OWNER
    ) AirdropBroker(_AOTAP, _TAPOFT, _PCNFT, _PAYMENT_TOKEN_BENEFICIARY, TAP_ORACLE, _OWNER) {}
}

contract AirdropBrokerTest is Test {
    AirdropBrokerTestMock airdropBroker;

    address AOTAP = address(0);
    address payable TAPOFT = payable(0);
    address PCNFT = address(0);
    address TAP_ORACLE = address(new ADBOracleMock());
    address PAYMENT_TOKEN_BENEFICIARY = address(0);
    address OWNER = address(this);

    function setUp() public {
        airdropBroker = new AirdropBrokerTestMock(AOTAP, TAPOFT, PCNFT, PAYMENT_TOKEN_BENEFICIARY, TAP_ORACLE, OWNER);
    }

    error NotValid();

    function test_set_phase_2_merkle_root() public {
        bytes32[4] memory merkleRoots = [
            bytes32(keccak256("0x01")),
            bytes32(keccak256("0x02")),
            bytes32(keccak256("0x03")),
            bytes32(keccak256("0x04"))
        ];
        assertEq(airdropBroker.epoch(), 0);

        // Success

        airdropBroker.setPhase2MerkleRoots(merkleRoots);
        assertEq(airdropBroker.phase2MerkleRoots(0), merkleRoots[0]);
        assertEq(airdropBroker.phase2MerkleRoots(1), merkleRoots[1]);
        assertEq(airdropBroker.phase2MerkleRoots(2), merkleRoots[2]);
        assertEq(airdropBroker.phase2MerkleRoots(3), merkleRoots[3]);

        // Fail because epoch >= 2
        _advanceEpochsBy(2);
        assertEq(airdropBroker.epoch(), 2);

        vm.expectRevert(NotValid.selector);
        airdropBroker.setPhase2MerkleRoots(merkleRoots);
    }

    function _advanceEpochsBy(uint256 _epochs) internal {
        for (uint256 i = 0; i < _epochs; i++) {
            skip(airdropBroker.EPOCH_DURATION());
            airdropBroker.newEpoch();
        }
    }

    function test_register_users_for_phase() public {
        // Phase 1 test
        address[] memory users = new address[](2);
        users[0] = address(0x1);
        users[1] = address(0x2);

        uint256[] memory amounts = new uint256[](2);
        amounts[0] = 100;
        amounts[1] = 200;

        // Success because epoch is < 1
        assertEq(airdropBroker.epoch(), 0);
        airdropBroker.registerUsersForPhase(1, users, amounts);
        _advanceEpochsBy(1);
    }
}