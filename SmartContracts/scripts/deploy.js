const {ethers} = require("hardhat");

async function main(){
    console.log("Deploying AlgoFi contracts...");

    const[deployer] = await ethers.getSigners();
    console.log("Deploying contracts with account:", deployer.address);

    // deploy factory
    const AlgoFiFactory = await ethers.getContractFactory("AlgoFiFactory");
    const factory = await AlgoFiFactory.deploy();
    await factory.deployed();
    console.log("AlgoFiFactory deployed to:", factory.address);

    // Get contract addresses from factory 
    const [nftAddress, marketplaceAddress] = await factory.getContracts();
    console.log("AlgoFiNFT deployed to:", marketplaceAddress);

    // save deployment info
    const deploymentInfo = {
        network: "algorand-evm-testnet",
        factory: factory.address,
        nft: nftAddress,
        mp: marketplaceAddress,
        deployer: deployer.address,
        timestamp: new Data().toISOString(),
    };
    console.log("Deployment completed:" , deploymentInfo);
}

main()
    .then(() => process.exit(0))
    .catch((error) => {
        console.error(error);
        process.exit(1);
    });