add to .bashrc
alias cleos='docker-compose exec keosd /opt/eosio/bin/cleos -u http://nodeosd:8888 --wallet-url http://localhost:8888'

$ cleos wallet create
Creating wallet: default
Save password to use in the future to unlock this wallet.
Without password imported keys will not be retrievable.
"PW5JH3XJsQ5RgAmhTm6ofizbg2Q2NAU28px4Bns8GEiT5n8LjPv1Q"

$ cleos wallet unlock --password PW5JH3XJsQ5RgAmhTm6ofizbg2Q2NAU28px4Bns8GEiT5n8LjPv1Q
Unlocked: default

$ cleos create key
Private key: 5KVGKY3kKxGyixip3vb1VMMU9NX9MmUt6dVCJJQvL2NXhWcdnvf
Public key: EOS59hL4cdopofE4PrfeqarCFBdKC7Ub6A18czhJkQphq4bRUNgHS

$ cleos wallet import 5KVGKY3kKxGyixip3vb1VMMU9NX9MmUt6dVCJJQvL2NXhWcdnvf
imported private key for: EOS79AFSymWS2CgQjeAaemxc6AR1VN1dVaf8cu1GR6ezUsuATQQqH

$ cleos wallet keys
[
  "EOS59hL4cdopofE4PrfeqarCFBdKC7Ub6A18czhJkQphq4bRUNgHS",
  "EOS6MRyAjQq8ud7hVNYcfnVPJqcVpscN5So8BhtHuGYqET5GDW5CV"
]

$ cleos create account eosio test EOS59hL4cdopofE4PrfeqarCFBdKC7Ub6A18czhJkQphq4bRUNgHS EOS6MRyAjQq8ud7hVNYcfnVPJqcVpscN5So8BhtHuGYqET5GDW5CV
executed transaction: d3744a19147c2d0d293612ceb16fe793c1210b552912e8dab3bfc979d8e005df  200 bytes  194 us
#         eosio <= eosio::newaccount            {"creator":"eosio","name":"test","owner":{"threshold":1,"keys":[{"key":"EOS6MRyAjQq8ud7hVNYcfnVPJqcV...
warning: transaction executed locally, but may not be confirmed by the network yet

$ cleos get accounts EOS59hL4cdopofE4PrfeqarCFBdKC7Ub6A18czhJkQphq4bRUNgHS
{
  "account_names": [
    "test"
  ]
}

$ cleos create account eosio counter.code EOS59hL4cdopofE4PrfeqarCFBdKC7Ub6A18czhJkQphq4bRUNgHS EOS6MRyAjQq8ud7hVNYcfnVPJqcVpscN5So8BhtHuGYqET5GDW5CV

$ docker-compose exec keosd bash
# cd /contracts/counter/
# eosiocpp -o counter.wast counter.cpp
# eosiocpp -g counter.abi counter.cpp

$ cleos set contract counter.code /contracts/counter -p counter.code

$ cleos push action counter.code add '[123]' -p test
$ cleos push action counter.code subtract '[123]' -p test
$ cleos push action counter.code set '[2]' -p test
