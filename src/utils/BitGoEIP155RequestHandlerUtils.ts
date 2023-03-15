import { SignClientTypes } from '@walletconnect/types';
import { eip155Wallets, eip155Addresses } from '@/utils/EIP155WalletUtil';
import { getWalletAddressFromParams, getSignParamsMessage } from '@/utils/HelperUtil';
import { EvmRPCWrapper } from '@bitgo-beta/sdk-rpc-wrapper';
import { formatJsonRpcResult, formatJsonRpcError } from '@json-rpc-tools/utils';
import { getSdkError } from '@walletconnect/utils';
import assert from 'assert';

let rpcWrapper: EvmRPCWrapper;
const walletPassphrase = process.env.NEXT_PUBLIC_WALLET_PASSPHRASE;
let start, elapsed;

export async function approveEIP155Request(
  requestEvent: SignClientTypes.EventArguments['session_request']
) {
  start = new Date().getTime();
  const { params, id } = requestEvent
  const { chainId, request } = params
  const wallet = eip155Wallets[getWalletAddressFromParams(eip155Addresses, params)]
  rpcWrapper = new EvmRPCWrapper(wallet);
  assert(walletPassphrase, 'walletPassphrase not defined');
  console.log(`about to send call to rpc-wrapper with request: `, request);
  const message = getSignParamsMessage(request.params);
  const input = {
    method: request.method,
    id,
    params: [message],
    jsonrpc: '',
  }

  const response: any = await rpcWrapper.handleRPCCall(input, walletPassphrase);
  console.log('bitgo signing response: ', response);
  const result: any = formatJsonRpcResult(id, response.result.txHash);
  console.log('bitgo result: ', result);
  elapsed = new Date().getTime();
  console.log(`bitgo Total elapsed time: ${(elapsed - start)/1000} seconds`);
  return result;
}

export function rejectEIP155Request(requestEvent: SignClientTypes.EventArguments['session_request']){
  const { id } = requestEvent;
  return formatJsonRpcError(id, getSdkError('USER_REJECTED_METHODS').message)
}
