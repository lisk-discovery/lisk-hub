import React from 'react';
import store from '../../store';

import {
  testExtensions,
  loadTransactions,
  sent,
  loadTransaction,
  transactionsFilterSet,
} from '../../actions/transactions';
import {
  searchDelegate,
  searchVotes,
  searchVoters,
  searchAccount,
  searchTransactions,
} from '../../actions/search';
import LiskHubExtensions from '../../utils/liskHubExtensions';


const extension = async ({ identifier }) => {

  const state = await store.getState();
  const modules = state.extensions.modules[identifier] || [];

  return modules.map(({ moduleId }, i) => {
    const Component = LiskHubExtensions._modules[moduleId];
    if (Component) {
      return <Component
        data = {{
          latestBlocks: state.blocks && state.blocks.latestBlocks,
          transactions: state.transactions,
          time: state.test,
          accountAddress: state.account && state.account.address,
          search: state.search,
        }}
        actions={{
          testExtensions,
          loadTransactions,
          sent,
          loadTransaction,
          transactionsFilterSet,
          searchDelegate,
          searchVotes,
          searchVoters,
          searchAccount,
          searchTransactions,
        }}
        onClickHandle={() => { state.testExtensions(); }}
        t={state.t}
        identifier={state.identifier}
        key={i} />;
    }
    // eslint-disable-next-line no-console
    console.error(new Error(`Invalid component in extension point ${state.identifier}`));
    return null;
  });
};

export default extension;

