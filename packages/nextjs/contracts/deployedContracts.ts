/**
 * This file is autogenerated by Scaffold-ETH.
 * You should not edit it manually or your changes might be overwritten.
 */
import { GenericContractsDeclaration } from "~~/utils/scaffold-eth/contract";

const deployedContracts = {
  11155111: {
    Loan: {
      address: "0x29C1e56b81dC39b642feBeC73AaCE2B4145cd1df",
      abi: [
        {
          inputs: [
            {
              internalType: "address",
              name: "_usdEToken",
              type: "address",
            },
            {
              internalType: "address",
              name: "_usdcToken",
              type: "address",
            },
            {
              internalType: "address",
              name: "_aavePool",
              type: "address",
            },
            {
              internalType: "address",
              name: "_ethenaStaking",
              type: "address",
            },
            {
              internalType: "address",
              name: "_deployer",
              type: "address",
            },
          ],
          stateMutability: "nonpayable",
          type: "constructor",
        },
        {
          inputs: [],
          name: "aavePool",
          outputs: [
            {
              internalType: "address",
              name: "",
              type: "address",
            },
          ],
          stateMutability: "view",
          type: "function",
        },
        {
          inputs: [
            {
              internalType: "uint256",
              name: "_amount",
              type: "uint256",
            },
          ],
          name: "approve",
          outputs: [],
          stateMutability: "nonpayable",
          type: "function",
        },
        {
          inputs: [],
          name: "closeLoan",
          outputs: [],
          stateMutability: "nonpayable",
          type: "function",
        },
        {
          inputs: [],
          name: "deployer",
          outputs: [
            {
              internalType: "address",
              name: "",
              type: "address",
            },
          ],
          stateMutability: "view",
          type: "function",
        },
        {
          inputs: [
            {
              internalType: "uint256",
              name: "_usdEAmount",
              type: "uint256",
            },
            {
              internalType: "uint256",
              name: "_leverage",
              type: "uint256",
            },
            {
              internalType: "uint256",
              name: "_deadline",
              type: "uint256",
            },
            {
              internalType: "uint8",
              name: "_permitV",
              type: "uint8",
            },
            {
              internalType: "bytes32",
              name: "_permitR",
              type: "bytes32",
            },
            {
              internalType: "bytes32",
              name: "_permitS",
              type: "bytes32",
            },
          ],
          name: "depositToAave",
          outputs: [],
          stateMutability: "nonpayable",
          type: "function",
        },
        {
          inputs: [],
          name: "ethenaStaking",
          outputs: [
            {
              internalType: "contract IEthenaStaking",
              name: "",
              type: "address",
            },
          ],
          stateMutability: "view",
          type: "function",
        },
        {
          inputs: [
            {
              internalType: "uint256",
              name: "_usdEAmount",
              type: "uint256",
            },
          ],
          name: "stake",
          outputs: [],
          stateMutability: "nonpayable",
          type: "function",
        },
        {
          inputs: [],
          name: "usdEToken",
          outputs: [
            {
              internalType: "contract IERC20",
              name: "",
              type: "address",
            },
          ],
          stateMutability: "view",
          type: "function",
        },
        {
          inputs: [],
          name: "usdcToken",
          outputs: [
            {
              internalType: "contract IERC20",
              name: "",
              type: "address",
            },
          ],
          stateMutability: "view",
          type: "function",
        },
        {
          inputs: [],
          name: "usdcTokenPermit",
          outputs: [
            {
              internalType: "contract IERC20Permit",
              name: "",
              type: "address",
            },
          ],
          stateMutability: "view",
          type: "function",
        },
        {
          inputs: [
            {
              internalType: "address",
              name: "",
              type: "address",
            },
          ],
          name: "userDeposits",
          outputs: [
            {
              internalType: "uint256",
              name: "usdEAmount",
              type: "uint256",
            },
            {
              internalType: "uint256",
              name: "sUsdEAmount",
              type: "uint256",
            },
            {
              internalType: "uint256",
              name: "usdcAmount",
              type: "uint256",
            },
            {
              internalType: "uint256",
              name: "aEthUsdcAmount",
              type: "uint256",
            },
          ],
          stateMutability: "view",
          type: "function",
        },
      ],
      inheritedFunctions: {},
    },
  },
} as const;

export default deployedContracts satisfies GenericContractsDeclaration;
