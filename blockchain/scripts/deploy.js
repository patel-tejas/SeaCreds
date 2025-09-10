import hre from "hardhat";
const { ethers } = hre;

async function main()
{
    const provider = new ethers.JsonRpcProvider(process.env.ALCHEMY_URL);
    const deployer = new ethers.Wallet(process.env.PRIVATE_KEY, provider);

    console.log("Deploying contracts with account:", deployer.address);
    console.log("Account balance:", (await provider.getBalance(deployer.address)).toString());

    const GHContractFactory = await ethers.getContractFactory("GreenHydrogenCredit", deployer);

    const ghc = await GHContractFactory.deploy(
        deployer.address,
        deployer.address,
        deployer.address
    );

    await ghc.waitForDeployment();

    console.log("GreenHydrogenCredit deployed at:", ghc.target);
    console.log("Account balance:", (await provider.getBalance(deployer.address)).toString());
}

main().catch((error) =>
{
    console.error(error);
    process.exitCode = 1;
});
