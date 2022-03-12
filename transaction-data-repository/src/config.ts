import nodeConfig from 'config';

interface Config {
    authorityPrivateKeyString: string;
}

const config: Config = {
    authorityPrivateKeyString: nodeConfig.get<string>('secret')
};

export default config;
