add to .bashrc
alias cleos='docker-compose exec eosio /opt/eosio/bin/cleos --wallet-url http://localhost:8888'

$ cleos wallet create
Creating wallet: default
Save password to use in the future to unlock this wallet.
Without password imported keys will not be retrievable.
"PW5JK3gzvxjEkeBMuLib9w4nNGHVoG5gwx4MPqcPwkrLBZsFUZgbc"

$ cleos wallet unlock --password PW5JK3gzvxjEkeBMuLib9w4nNGHVoG5gwx4MPqcPwkrLBZsFUZgbc
Unlocked: default

$ cleos create key
Private key: 5Jj7ahoCdNB83uRCw6HBB9H9tw5Av2SZMw5jcUp1YsgDaLeju34
Public key: EOS7AwTphaRqMUDXcowWwxvrqxtwAppinTAwdLcWFTDNu3zvJjcxv

$ cleos wallet import 5Jj7ahoCdNB83uRCw6HBB9H9tw5Av2SZMw5jcUp1YsgDaLeju34
imported private key for: EOS7AwTphaRqMUDXcowWwxvrqxtwAppinTAwdLcWFTDNu3zvJjcxv

$ cleos wallet keys
[
  "EOS6MRyAjQq8ud7hVNYcfnVPJqcVpscN5So8BhtHuGYqET5GDW5CV",
  "EOS7AwTphaRqMUDXcowWwxvrqxtwAppinTAwdLcWFTDNu3zvJjcxv"
]

$ cleos create account eosio test EOS6MRyAjQq8ud7hVNYcfnVPJqcVpscN5So8BhtHuGYqET5GDW5CV EOS7AwTphaRqMUDXcowWwxvrqxtwAppinTAwdLcWFTDNu3zvJjcxv
executed transaction: d3744a19147c2d0d293612ceb16fe793c1210b552912e8dab3bfc979d8e005df  200 bytes  194 us
#         eosio <= eosio::newaccount            {"creator":"eosio","name":"test","owner":{"threshold":1,"keys":[{"key":"EOS6MRyAjQq8ud7hVNYcfnVPJqcV...
warning: transaction executed locally, but may not be confirmed by the network yet

$ cleos get accounts EOS6MRyAjQq8ud7hVNYcfnVPJqcVpscN5So8BhtHuGYqET5GDW5CV
{
  "account_names": [
    "test"
  ]
}

$ cleos create account eosio decidex EOS6MRyAjQq8ud7hVNYcfnVPJqcVpscN5So8BhtHuGYqET5GDW5CV EOS7AwTphaRqMUDXcowWwxvrqxtwAppinTAwdLcWFTDNu3zvJjcxv

$ docker-compose exec eosio bash
# cd /contracts/decidex/
# eosiocpp -o decidex.wast decidex.cpp
# eosiocpp -g decidex.abi decidex.cpp

$ cleos set contract decidex /contracts/decidex -p decidex

$ cleos push action decidex add '[123]' -p test
$ cleos push action decidex subtract '[123]' -p test
$ cleos push action decidex set '[2]' -p test
