import "@nomicfoundation/hardhat-toolbox"
import dotenv from "dotenv"
dotenv.config()

const config = {
	defaultNetwork: "sepolia",
	solidity: {
		version: "0.8.27",
		settings: {
			optimizer: {
				enabled: true,
			},
		},
	},
	networks: {
		sepolia: {
			type: "http",
			url: process.env.ALCHEMY_URL,
			accounts: [process.env.PRIVATE_KEY],
			timeout: 600000,
		},
	},
}

export default config
