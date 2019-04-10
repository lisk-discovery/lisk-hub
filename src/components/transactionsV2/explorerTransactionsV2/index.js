import { connect } from 'react-redux';
import { translate } from 'react-i18next';
import { withRouter } from 'react-router-dom';
import { loadLastTransaction } from '../../../actions/transactions';
import { searchTransactions, searchMoreTransactions, searchAccount, fetchVotedDelegateInfo } from '../../../actions/search';
import actionTypes from '../../../constants/actions';
import ExplorerTransactionsV2 from './explorerTransactionsV2';
import txFilters from '../../../constants/transactionFilters';

/* istanbul ignore next */
const mapStateToProps = (state, ownProps) => ({
  modules: (state.extensions && state.extensions.modules) || {},
  delegate: state.search.delegates[state.search.lastSearch],
  transaction: state.transaction,
  transactions: state.search.searchResults,
  votes: state.search.votes[state.search.lastSearch],
  count: state.search.transactions[state.search.lastSearch] &&
    (state.search.transactions[state.search.lastSearch].count || 0),
  offset: state.search.searchResults.length,
  activeFilter: state.filters.transactions || txFilters.all,
  isSearchInStore: state.search.transactions[ownProps.address] !== undefined,
  loading: state.loading,
  account: state.account,
  followedAccounts: state.followedAccounts.accounts,
  wallets: state.wallets,
  peers: state.peers,
  detailAccount: state.search.accounts[state.search.lastSearch],
  balance: state.search.accounts[state.search.lastSearch]
    && state.search.accounts[state.search.lastSearch].balance,
});

/* istanbul ignore next */
const mapDispatchToProps = {
  fetchVotedDelegateInfo,
  searchAccount,
  searchTransactions,
  searchMoreTransactions,
  addFilter: data => ({ type: actionTypes.addFilter, data }),
  searchUpdateLast: data => ({ data, type: actionTypes.searchUpdateLast }),
  loadLastTransaction,
};

export default withRouter(connect(
  mapStateToProps,
  mapDispatchToProps,
)(translate()(ExplorerTransactionsV2)));
