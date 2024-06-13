import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { DepositAddress } from '../schema/deposit.schema';
import { Model } from 'mongoose';
import { english, generateMnemonic, mnemonicToAccount } from 'viem/accounts';
import { fromBytes } from 'viem';
import { Wallet } from 'src/schema/wallet.schema';
import { AuthorizedUser } from 'src/utils/abstract';
import { CryptoService } from 'src/utils/crypto';
import { Network, NetworkType } from 'src/config/network';
import { toDataURL } from 'qrcode';
import { GetDepositAddressResponse } from './deposit.abstract';
import { ExceptionMessages } from 'src/utils/api/exception';

@Injectable()
export class DepositService {
  constructor(
    @InjectModel(DepositAddress.name)
    private depositModel: Model<DepositAddress>,
    @InjectModel(Wallet.name)
    private walletModel: Model<Wallet>,
  ) {
    this.depositModel = depositModel;
    this.walletModel = walletModel;
  }
  _init(): void {}

  async getDepositAddressByChain(
    chain: string,
    user: AuthorizedUser,
  ): Promise<GetDepositAddressResponse> {
    const network = Network.filter((x: NetworkType) => x.chain === chain)[0]
      .network;

    if (!network) throw ExceptionMessages.ChainNotFound;

    let depositAddress: DepositAddress = await this.depositModel.findOne({
      customerId: user.id,
      chain: chain,
    });

    if (!depositAddress) {
      depositAddress = await this.depositModel.findOne({
        customerId: user.id,
        network: network,
      });

      let newDepositAddress = new DepositAddress();

      if (!depositAddress) {
        const walletAddress = await this.createWalletAddress();

        newDepositAddress.addr = walletAddress;
      } else {
        newDepositAddress.addr = depositAddress.addr;
      }

      newDepositAddress.ccy = chain.split('-')[0];
      newDepositAddress.chain = chain;
      newDepositAddress.customerId = user.id;
      newDepositAddress.network = network;
      newDepositAddress.subAccount = 'XidoPistaTebiskine';

      await this.depositModel.create(newDepositAddress);
      depositAddress = newDepositAddress;
    }

    const qrCode = await this.createQrCode(depositAddress.addr);

    return {
      customerId: depositAddress.customerId,
      addr: depositAddress.addr,
      ccy: depositAddress.ccy,
      chain: depositAddress.chain,
      qrCode: qrCode,
      network: depositAddress.network,
    };
  }

  async createWalletAddress(): Promise<string> {
    const seedPhrase = generateMnemonic(english);

    const account = mnemonicToAccount(seedPhrase);

    const publicKey = account.publicKey;

    const privateKey = fromBytes(account.getHdKey().privateKey, 'hex');

    const cryptoService = new CryptoService();

    const encryptedPrivateKey = cryptoService.encrypt(
      privateKey,
      process.env.SECRET_KEY,
    );
    const encryptedSeedPhrase = cryptoService.encrypt(
      seedPhrase,
      process.env.SECRET_KEY,
    );

    const wallet = new this.walletModel({
      // customerId: user.id,
      // subAccount: user.subAccount,
      customerId: 1,
      subAccount: 'asd',
      privateKey: encryptedPrivateKey,
      publicKey: publicKey,
      address: account.address,
      seedPhrase: encryptedSeedPhrase,
    });

    await this.walletModel.create(wallet);

    return account.address;
  }

  private async createQrCode(address: string): Promise<string> {
    const dataUrl: string = await toDataURL(address, {
      width: 480,
      margin: 0,
      color: {
        dark: '#000000',
        light: '#FFFFFF',
      },
    });

    const base64Data = dataUrl.split(',')[1];
    return base64Data;
  }
}
