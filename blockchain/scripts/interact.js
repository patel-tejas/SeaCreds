import hre from "hardhat";
const { ethers } = hre;
import "dotenv/config";

async function main()
{
    const provider = new ethers.JsonRpcProvider(process.env.ALCHEMY_URL);
    const deployer = new ethers.Wallet(process.env.PRIVATE_KEY, provider);


    const GHContractFactory = await ethers.getContractFactory("GreenHydrogenCredit", deployer);
    const ghc = GHContractFactory.attach(process.env.GHC_ADR);

    console.log("Token name:", await ghc.name());

    const tx = await ghc.mint(deployer.address, 1000n);
    await tx.wait();
    console.log("Minted 1000 tokens to recipient");

    const balance = await ghc.balanceOf(deployer.address);
    console.log("Recipient balance:", balance.toString());
}

main().catch((error) =>
{
    console.error(error);
    process.exitCode = 1;
});
