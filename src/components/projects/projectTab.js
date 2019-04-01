import React, { Component } from 'react';
import BoxV2 from '../boxV2';
import styles from './projectTab.css';

import axios from 'axios';

const URI = 'http://localhost:4000';

const Project = ({ project = {} }) => (
  <div>
    <div>
      {project.name}
    </div>
    <a target="_blank" href={"https://www.liskdiscovery.com/" + project.ownership.owner + '/' + project.project_key} >
      visit project
    </a>
  </div>
);

class ProjectTab extends Component{
  constructor() {
    super();

    this.state = {
      projects: [],
    };
  }

  componentDidMount() {
    const { delegate } = this.props;
    this.getProjects(delegate.account.address);
  }

  async getProjects(address) {
    if (!address){
      return;
    }

    try {
      const { data } = await axios.get(`${URI}/address/${address}`);
      if (data.projects){
        this.setState({ projects: data.projects })
      }

    }catch(error){
      console.error('address not found')
    }

  }

  renderProjects() {
    const { projects } = this.state;
    if (projects && projects.length > 0) {
      return projects.map(project => <Project key={project.project_key} project={project} />);
    }else {
        return (
          <div>
            no projects found or not available on Lisk Discovery.
          </div>
        )
    }
  }

  componentWillReceiveProps(nextProps) {
    const { delegate } = this.props;
    if (delegate.address !== nextProps.delegate.address) {
      this.getProjects(nextProps.delegate.account.address);
    }
  }

  render() {
    return (
      <BoxV2>
      <header>
        <h1>Lisk Discovery projects</h1>
      </header>
      <main className={styles.wrapper}>
        <ul className={styles.delegateStats}>
          {this.renderProjects()}
        </ul>
      </main>
    </BoxV2>
    );
  }
}

ProjectTab.defaultProps = {
  delegate: {
    account: {
      address: '',
    }
  },
};

export default ProjectTab;
