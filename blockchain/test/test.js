import { expect } from "chai"
import hre from "hardhat"
const { ethers } = hre

describe("GreenHydrogenCredit", function () {
	let ghc, provider, deployer

	beforeEach(async function () {
		provider = new ethers.JsonRpcProvider(process.env.ALCHEMY_URL)
		deployer = new ethers.Wallet(process.env.PRIVATE_KEY, provider)
		const GHContractFactory = await ethers.getContractFactory(
			"GreenHydrogenCredit"
		)
		ghc = await GHContractFactory.deploy(
			deployer.address,
			deployer.address,
			deployer.address
		)

		await ghc.waitForDeployment()

		console.log("GreenHydrogenCredit (GHC) address:", ghc.target)
	})

	it("Should deploy and have correct name", async function () {
		expect(await ghc.name()).to.equal("GreenHydrogenCredit")
	})

	it("Should allow only minter to mint tokens", async function () {
		await ghc.connect(minter).mint(otherUser.address, 1000n)
		expect(await ghc.balanceOf(otherUser.address)).to.equal(1000n)

		await expect(ghc.connect(otherUser).mint(otherUser.address, 500n))
			.to.be.revertedWithCustomError(
				ghc,
				"AccessControlUnauthorizedAccount"
			)
			.withArgs(otherUser.address, await ghc.MINTER_ROLE())
	})
})
