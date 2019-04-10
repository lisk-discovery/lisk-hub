import React from 'react';
import LiskHubExtensions from '../../utils/liskHubExtensions';

export default class ExtensionPoint extends React.Component {
  componentDidCatch(error) {
    // eslint-disable-next-line no-console
    console.error(new Error(`Error in extension point '${this.props.identifier}' ${error}`));
  }

  render() {
    const {
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
      moduleId
    } = this.props;

    const Component = LiskHubExtensions._modules[moduleId];
    if (Component) {
      return <Component
        data = {{
          latestBlocks: this.props.blocks && this.props.blocks.latestBlocks,
          transactions: this.props.transactions,
          time: this.props.test,
          accountAddress: this.props.account && this.props.account.address,
          search: this.props.search,
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
        onClickHandle={() => { this.props.testExtensions(); }}
        t={this.props.t}
        identifier={this.props.identifier}
        key={i} />;
    }
    // eslint-disable-next-line no-console
    console.error(new Error(`Invalid component in extension point ${this.props.identifier}`));
    return null;
  }
}
