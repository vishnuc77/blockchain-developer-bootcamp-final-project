require("@nomiclabs/hardhat-waffle");
require('dotenv').config({path: './.env'});

const alchemy_url = "https://eth-rinkeby.alchemyapi.io/v2/0jugd-ZpQo2ChtRw0KEh3Q-XjmsqpYhg";

/**
 * @type import('hardhat/config').HardhatUserConfig
 */
module.exports = {
  solidity: "0.8.0",
  networks: {
    rinkeby: {
      url: alchemy_url,
      accounts: [`0x${process.env.PRIVATE_KEY}`],
    },
    hardhat: {
      chainId: 1337
    }
  },
};
