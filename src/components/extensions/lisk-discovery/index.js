import React from 'react';
import LiskHubExtensions from 'LiskHubExtensions';
//import LiskHubExtensions from '../../../utils/liskHubExtensions';

const Box = LiskHubExtensions.components.Box;

class LiskDiscovery extends React.Component {
  constructor() {
    super();

    this.state = {
      projects: [],
    };
  }

  render() {
    return (
      <Box>
        <h1>hello LiskHubExtensions</h1>
      </Box>
    );
  }
}

export default LiskDiscovery;

LiskHubExtensions.addModule({
  identifier:
  LiskHubExtensions.identifiers.dashboardColumn1,
  component: LiskDiscovery,
});
