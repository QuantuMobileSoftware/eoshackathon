#include <eosiolib/eosio.hpp>

using namespace eosio;

static const account_name decidex_account = N(decidex);
const uint8_t BUY = 0;
const uint8_t SELL = 1;

class decidex : public eosio::contract {
public:
	using contract::contract;

	decidex(account_name self)
	: eosio::contract(self),
	bids(_self, _self),
	orders(_self, _self) {
	}

	/// @abi action

	void placebid(account_name bidder, uint8_t bidType, uint32_t amount, uint32_t price) {
		uint64_t pkey = bids.available_primary_key();
		bids.emplace(decidex_account, [&pkey, &bidder, &bidType, &amount, &price](auto& g) {
			g.pkey = pkey++;
			g.bidder = bidder;
			g.bidType = bidType;
			g.amount = amount;
			g.price = price;
		});
	}

	/// @abi action

	void match(account_name caller) {
		require_auth(caller);
		auto itr = bids.begin();
		if (itr != bids.end()) {
			// Generate fixture
			uint64_t pkey = orders.available_primary_key();
			orders.emplace(decidex_account, [&pkey, &itr](auto& g) {
				g.pkey = pkey++;
				if (itr->bidType == BUY) {
					g.seller = decidex_account;
					g.buyer = itr->bidder;
				} else {
					g.seller = itr->bidder;
					g.buyer = decidex_account;
				}
				g.amount = itr->amount;
				g.price = itr->price;
			});
			bids.erase(itr);
		}
	}
private:

	/*void modify(int32_t val) {
		auto itr = existing_values.begin();
		if (itr == existing_values.end()) {
			uint64_t pkey = existing_values.available_primary_key();
			existing_values.emplace(decidex_account, [&val, &pkey](auto& g) {
				g.pkey = pkey;
				g.val = val;
				print(g.pkey, " ", g.val);
			});
			print(val);
		} else {
			existing_values.modify(itr, itr->pkey, [&val](auto& g) {
				g.val = g.val + val;
				print(g.pkey, " ", g.val);
			});
		}
	}*/

	/// @abi table bid i64

	struct bid {
		uint64_t pkey;
		account_name bidder;
		uint8_t bidType;
		uint32_t amount;
		uint32_t price;

		uint64_t primary_key()const {
			return pkey;
		}
		EOSLIB_SERIALIZE(bid, (pkey) (bidder) (bidType) (amount) (price))
	};
	eosio::multi_index < N(bid), bid> bids;

	/// @abi table order i64

	struct order {
		uint64_t pkey;
		account_name seller;
		account_name buyer;
		uint32_t amount;
		uint32_t price;

		uint64_t primary_key()const {
			return pkey;
		}
		EOSLIB_SERIALIZE(order, (pkey) (seller) (buyer) (amount) (price))
	};
	eosio::multi_index < N(order), order> orders;

};

EOSIO_ABI(decidex, (placebid) (match))
