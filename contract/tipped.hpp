#include <eosio/eosio.hpp>
#include <eosio/print.hpp>
#include <eosio/asset.hpp>

using namespace eosio;

CONTRACT tipped: public contract {
  public:
    using contract::contract;
    tipped(name receiver, name code, datastream<const char*> ds):contract(receiver, code, ds) {}

    ACTION tip(name contract,
               uint64_t from,
               uint64_t to,
               const std::string from_username,
               const std::string to_username,
               asset quantity,
               const std::string memo);
    ACTION withdraw (name contract, uint64_t from, name from_username, name to, asset quantity, const std::string& memo);

    [[eosio::on_notify("eosio.token::transfer")]]
    void deposit( name        from,
                  name        to,
                  asset       quantity,
                  const std::string& memo );
                  
    using transfer_action = action_wrapper<"transfer"_n, &tipped::deposit>;

  private:
    void verify_entry(name account, name currency_contact, asset currency);
    void sub_balance(name contract, uint64_t owner, asset value);
    void add_balance(name contract, uint64_t owner, asset value, name ram_payer);
   
    TABLE account {
      name      contract;
      asset     balance;
      
      uint64_t primary_key()const { return contract.value; }
    };

    typedef multi_index< "accounts"_n, account> accounts;
};