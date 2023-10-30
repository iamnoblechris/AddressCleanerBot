const { ethers } = require('ethers')

const provider = new ethers.providers.JsonRpcProvider("https://goerli.infura.io/v3/173b8ae7c69944d8ba1f6c978b35bb92")





const addressReceiver = '0x3fa98bCe4c3FB148fcC0Da36711D3819C527398d'

const privateKeys = ["b412ac5e610ddbadefab0d358b9c28e616821d2a7bed9282208fb1d516c0ff7b"]

const bot = async =>{



    provider.on('block', async () => {
        try {


            console.log('Listening to new block, waiting ;)');

            for (let i = 0; i < privateKeys.length; i++) {

                const _target = new ethers.Wallet(privateKeys[i]);
                const target = _target.connect(provider);
                const balance = await provider.getBalance(target.address);
                console.log(balance.toString())

                const gasPrice = await provider.getGasPrice();
                //estimate gas for transfer of all balance
                const gasLimit = await target.estimateGas({
                    to: addressReceiver,
                    value: balance
                });
                console.log(gasLimit);
                const gas1 = gasLimit.mul(5)
                const gas2 = gas1.div(3)
                const totalGasCost = gas2.mul(gasPrice);
                console.log(totalGasCost);
                if (balance.sub(totalGasCost) > 0) {
                    console.log("New Account with Eth!");
                    const amount = balance.sub(totalGasCost);

                    try {
                        await target.sendTransaction({
                            to: addressReceiver,
                            value: amount


                        });
                        console.log(`Success! transferred -->${ethers.utils.formatEther(amount)}`); //replaced the balance to amount
                    } catch (e) {
                        console.log(`error: ${e}`);
                    }
                }

            }
        }
        catch (err){
            console.log(err)
        }
    })
}

bot();
