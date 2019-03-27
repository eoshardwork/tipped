const {
    TIP_CONTRACT,
    TIP_ACCOUNT_TABLE,
    TIP_ACCOUNT_PERM,
    TIP_ACTION,
    WITHDRAW_ACTION,
    PRIVATE_KEY,
    NODE_URL
} = require('../constants')

// Eosjs
const { Api, JsonRpc } = require('eosjs');
const fetch = require('node-fetch').default;                                
const { TextEncoder, TextDecoder } = require('util');    
const { JsSignatureProvider } = require('eosjs/dist/eosjs-jssig');   
const signatureProvider = new JsSignatureProvider([PRIVATE_KEY]);
const rpc = new JsonRpc(NODE_URL, { fetch });
const api = new Api({ rpc, signatureProvider, textDecoder: new TextDecoder(), textEncoder: new TextEncoder() });

function tip (contract, tipper_id, tipped_id, from_username, to_username, quantity, memo) {
    console.log({
        contract: contract,
        from: tipper_id,
        to: tipped_id,
        from_username: from_username,
        to_username: to_username,
        quantity: quantity,
        memo: memo
    })
    
    return api.transact({
        actions: [{
            account: TIP_CONTRACT,
            name: TIP_ACTION,
            authorization: [{
                actor: TIP_CONTRACT,
                permission: TIP_ACCOUNT_PERM
            }],
            data: {
                contract: contract,
                from: tipper_id,
                to: tipped_id,
                from_username: from_username,
                to_username: to_username,
                quantity: quantity,
                memo: memo
            }
        }]
    }, {
        blocksBehind: 3,
        expireSeconds: 30,
    });
}

function withdraw (contract, from_id, from_username, withdraw_to, quantity, memo) {
    let data = {
        contract: contract,
        from: from_id,
        from_username: from_username,
        to: withdraw_to,
        quantity: quantity,
        memo: memo
    }
    console.log(data)
    return api.transact({
        actions: [{
            account: TIP_CONTRACT,
            name: WITHDRAW_ACTION,
            authorization: [{
                actor: TIP_CONTRACT,
                permission: TIP_ACCOUNT_PERM
            }],
            data: {
                contract: contract,
                from: from_id,
                from_username: from_username,
                to: withdraw_to,
                quantity: quantity,
                memo: memo
            }
        }]
    }, {
        blocksBehind: 3,
        expireSeconds: 30,
    });
}

function getBalance (userId) {
    return rpc.get_table_rows({
        json: true,
        code: TIP_CONTRACT,
        scope: userId,
        table: TIP_ACCOUNT_TABLE
    })
}

module.exports = {
    tip,
    withdraw,
    getBalance
}