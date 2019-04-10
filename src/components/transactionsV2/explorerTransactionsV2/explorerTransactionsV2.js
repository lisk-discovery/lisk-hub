import React from 'react';
import txFilters from '../../../constants/transactionFilters';
import TransactionsOverviewHeader from '../transactionsOverviewHeader/transactionsOverviewHeader';
import routes from '../../../constants/routes';
import TabsContainer from '../../toolbox/tabsContainer/tabsContainer';
import WalletTab from '../../wallet/walletTab';
import DelegateTab from '../../delegate/delegateTab';

import VotesTab from '../../votes/votesTab';
import LiskHubExtensions from '../../../utils/liskHubExtensions';
import extension  from '../../extensionPoint/extension';

class ExplorerTransactionsV2 extends React.Component {
  // eslint-disable-next-line max-statements
  constructor() {
    super();

    this.state = {
      filter: {},
      customFilters: {
        dateFrom: '',
        dateTo: '',
        amountFrom: '',
        amountTo: '',
        message: '',
      },
      activeCustomFilters: {},
    };

    this.saveFilters = this.saveFilters.bind(this);
    this.clearFilter = this.clearFilter.bind(this);
    this.clearAllFilters = this.clearAllFilters.bind(this);
    this.onInit = this.onInit.bind(this);
    this.onLoadMore = this.onLoadMore.bind(this);
    this.onFilterSet = this.onFilterSet.bind(this);
    this.onTransactionRowClick = this.onTransactionRowClick.bind(this);
    this.updateCustomFilters = this.updateCustomFilters.bind(this);
  }

  async onInit() {
    this.props.loadLastTransaction(this.props.address);

    this.props.searchAccount({
      address: this.props.address,
    });

    this.props.searchTransactions({
      address: this.props.address,
      limit: 30,
      filter: txFilters.all,
    });

    this.props.addFilter({
      filterName: 'transactions',
      value: txFilters.all,
    });

    this.getExtensions(this.props.address);
  }

  async getExtensions(address){
    const identifier = LiskHubExtensions.identifiers.delegateTab;
    const extensions = (await extension({ identifier, address })) || null;
    this.setState({ extensions });
  }

  componentWillReceiveProps(nextProps) {
    if (this.props.delegate !== nextProps.delegate){
      this.getExtensions(this.props.address);
    }
  }

  onLoadMore() {
    this.props.searchMoreTransactions({
      address: this.props.address,
      limit: 30,
      offset: this.props.offset,
      filter: this.props.activeFilter,
      customFilters: this.state.activeCustomFilters,
    });
  }
  /*
    Transactions from tabs are filtered based on filter number
    It applys to All, Incoming and Outgoing
    for other tabs that are not using transactions there is no need to call API
  */
  onFilterSet(filter) {
    this.props.searchTransactions({
      address: this.props.address,
      limit: 30,
      filter,
      customFilters: this.state.activeCustomFilters,
    });
  }

  onTransactionRowClick(props) {
    const transactionPath = `${routes.transactions.pathPrefix}${routes.transactions.path}/${props.value.id}`;
    this.props.history.push(transactionPath);
  }

  /* istanbul ignore next */
  saveFilters(customFilters) {
    this.props.searchTransactions({
      address: this.props.address,
      limit: 30,
      filter: this.props.activeFilter,
      customFilters,
    });
    this.setState({ activeCustomFilters: customFilters, customFilters });
  }

  /* istanbul ignore next */
  clearFilter(filterName) {
    this.saveFilters({
      ...this.state.activeCustomFilters,
      [filterName]: '',
    });
  }

  /* istanbul ignore next */
  clearAllFilters() {
    const customFilters = Object.keys(this.state.customFilters).reduce((acc, key) => ({ ...acc, [key]: '' }), {});
    this.saveFilters(customFilters);
  }

  /* istanbul ignore next */
  updateCustomFilters(customFilters) {
    this.setState({ customFilters });
  }

  render() {
    const overviewProps = {
      ...this.props,
      canLoadMore: this.props.transactions.length < this.props.count,
      onInit: this.onInit,
      onLoadMore: this.onLoadMore,
      onFilterSet: this.onFilterSet,
      onTransactionRowClick: this.onTransactionRowClick,
      saveFilters: this.saveFilters,
      clearFilter: this.clearFilter,
      clearAllFilters: this.clearAllFilters,
      activeCustomFilters: this.state.activeCustomFilters,
      customFilters: this.state.customFilters,
      updateCustomFilters: this.updateCustomFilters,
    };

    const isDelegate = (this.props.delegate
      && this.props.delegate.account && this.props.delegate.account.address === this.props.address);

    return (
      <React.Fragment>
        <TransactionsOverviewHeader
          delegate={this.props.delegate}
          followedAccounts={this.props.followedAccounts}
          balance={this.props.balance}
          address={this.props.address}
          match={this.props.match}
          t={this.props.t}
          account={this.props.account}
        />
        <TabsContainer>
          <WalletTab tabName={this.props.t('Wallet')}
            {...overviewProps}/>
          <VotesTab
            history={this.props.history}
            address={this.props.address}
            fetchVotedDelegateInfo={this.props.fetchVotedDelegateInfo}
            loading={this.props.loading}
            votes={this.props.votes}
            tabClassName={'account-info'}
            tabName={this.props.t('Votes')} />
          {isDelegate
            ? (<DelegateTab
              tabClassName={'delegate-statistics'}
              tabName={this.props.t('Delegate')}
              delegate={this.props.delegate} />)
            : null}
          {
            React.Children.toArray(this.state.extensions)
          }
        </TabsContainer>
      </React.Fragment>
    );
  }
}

export default ExplorerTransactionsV2;
