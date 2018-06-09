add to .bashrc
alias cleos='docker-compose exec keosd /opt/eosio/bin/cleos -u http://nodeosd:8888 --wallet-url http://localhost:8888'

$ cleos wallet create
Creating wallet: default
Save password to use in the future to unlock this wallet.
Without password imported keys will not be retrievable.
"PW5HtCLgm7C8A34dDaWh2Eqhjsqi53nU6s5D7gBvMQCUN6nFFBeKh"

$ cleos wallet unlock --password PW5HtCLgm7C8A34dDaWh2Eqhjsqi53nU6s5D7gBvMQCUN6nFFBeKh
Unlocked: default

$ cleos create key
Private key: 5JyiENJrnYr9dRy9TbxqD6yNDkpS5nD1qRHWpnCSDG97FC6A2wi
Public key: EOS83nkzvH98anEi1HwEEizWR1GzDusy1PS1UbQM3PHN2XFVM4guh

$ cleos wallet import 5JyiENJrnYr9dRy9TbxqD6yNDkpS5nD1qRHWpnCSDG97FC6A2wi
imported private key for: EOS83nkzvH98anEi1HwEEizWR1GzDusy1PS1UbQM3PHN2XFVM4guh

$ cleos wallet keys
[
  "EOS6MRyAjQq8ud7hVNYcfnVPJqcVpscN5So8BhtHuGYqET5GDW5CV",
  "EOS83nkzvH98anEi1HwEEizWR1GzDusy1PS1UbQM3PHN2XFVM4guh"
]

$ cleos create account eosio test EOS6MRyAjQq8ud7hVNYcfnVPJqcVpscN5So8BhtHuGYqET5GDW5CV EOS83nkzvH98anEi1HwEEizWR1GzDusy1PS1UbQM3PHN2XFVM4guh
executed transaction: d3744a19147c2d0d293612ceb16fe793c1210b552912e8dab3bfc979d8e005df  200 bytes  194 us
#         eosio <= eosio::newaccount            {"creator":"eosio","name":"test","owner":{"threshold":1,"keys":[{"key":"EOS6MRyAjQq8ud7hVNYcfnVPJqcV...
warning: transaction executed locally, but may not be confirmed by the network yet

$ cleos get accounts EOS6MRyAjQq8ud7hVNYcfnVPJqcVpscN5So8BhtHuGYqET5GDW5CV
{
  "account_names": [
    "test"
  ]
}

$ cleos create account eosio decidex EOS6MRyAjQq8ud7hVNYcfnVPJqcVpscN5So8BhtHuGYqET5GDW5CV EOS83nkzvH98anEi1HwEEizWR1GzDusy1PS1UbQM3PHN2XFVM4guh

$ docker-compose exec keosd bash
# cd /contracts/decidex/
# eosiocpp -o decidex.wast decidex.cpp
# eosiocpp -g decidex.abi decidex.cpp

$ cleos set contract decidex /contracts/decidex -p decidex

$ cleos push action decidex add '[123]' -p test
$ cleos push action decidex subtract '[123]' -p test
$ cleos push action decidex set '[2]' -p test
