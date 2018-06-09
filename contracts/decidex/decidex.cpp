#include <eosiolib/eosio.hpp>

using namespace eosio;

static const account_name decidex_account = N(decidex);

class decidex : public eosio::contract {
public:
	using contract::contract;

	decidex(account_name self)
	: eosio::contract(self),
	existing_values(_self, _self) {
	}

	/// @abi action

	void add(uint32_t val) {
		modify(val);
	}

	/// @abi action

	void subtract(uint32_t val) {
		modify(-val);
	}

	/// @abi action

	void set(uint32_t val) {
		auto itr = existing_values.begin();
		if (itr == this->existing_values.end()) {
			uint64_t pkey = existing_values.available_primary_key();
			existing_values.emplace(decidex_account, [&val, &pkey](auto& g) {
				g.pkey = pkey;
				g.val = val;
				print(g.pkey, " ", g.val);
			});
		} else {
			existing_values.modify(itr, itr->pkey, [&val](auto& g) {
				g.val = val;
				print(g.pkey, " ", g.val);
			});
		}
	}
private:

	void modify(int32_t val) {
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
	}

	/// @abi table

	struct value {
		uint64_t pkey;
		int64_t val;

		uint64_t primary_key()const {
			return pkey;
		}
		EOSLIB_SERIALIZE(value, (pkey) (val))
	};

	typedef eosio::multi_index< N(value), value> values;
	values existing_values;
};

EOSIO_ABI(decidex, (add) (subtract) (set))
