import React from 'react';
import { connect } from 'react-redux';
import Box from '../box';
import txFilters from '../../constants/transactionFilters';
import Piwik from '../../utils/piwik';
import TransactionsListV2 from './transactionsListV2';
import styles from './transactionsV2.css';

class TransactionsOverviewV2 extends React.Component {
  constructor(props) {
    super(props);

    this.props.onInit();
  }

  // eslint-disable-next-line class-methods-use-this
  isSmallScreen() {
    return window.innerWidth <= 768;
  }

  isActiveFilter(filter) {
    const { activeFilter } = this.props;
    return (!activeFilter && filter === txFilters.all) ||
      (activeFilter === filter);
  }

  setTransactionsFilter(filter) {
    Piwik.trackingEvent('TransactionsOverview', 'button', 'Set transactions filter');
    this.props.onFilterSet(filter);
  }

  generateFilters(isSmallScreen) {
    return [
      {
        name: this.props.t('All transactions'),
        value: txFilters.all,
        className: 'filter-all',
      },
      {
        name: isSmallScreen ? this.props.t('In') : this.props.t('Incoming transactions'),
        value: txFilters.incoming,
        className: 'filter-in',
      },
      {
        name: isSmallScreen ? this.props.t('Out') : this.props.t('Outgoing transactions'),
        value: txFilters.outgoing,
        className: 'filter-out',
      },
    ];
  }

  render() {
    const isSmallScreen = this.isSmallScreen();
    const filters = this.generateFilters(isSmallScreen);

    return (
      <Box className={`${styles.transactions} transactions`}>
        <React.Fragment>
          <ul className={`${styles.txFilters}`}>
            {filters.map((filter, i) => (
              <li key={i} className={`transaction-filter-item ${filter.className} ${this.isActiveFilter(filter.value) ? styles.active : ''}`}
                onClick={() => this.setTransactionsFilter(filter.value)}>
                {filter.name}
              </li>
            ))}
          </ul>
          <TransactionsListV2
            followedAccounts={this.props.followedAccounts}
            canLoadMore={this.props.canLoadMore}
            transactions={this.props.transactions}
            filter={filters[this.props.activeFilter]}
            address={this.props.address}
            publicKey={this.props.publicKey}
            history={this.props.history}
            onClick={props => this.props.onTransactionRowClick(props)}
            onLoadMore={this.props.onLoadMore}
          />
        </React.Fragment>
      </Box>
    );
  }
}
const mapStateToProps = state => ({
  followedAccounts: state.followedAccounts.accounts,
  peers: state.peers,
  account: state.account,
});

export default connect(mapStateToProps)(TransactionsOverviewV2);

